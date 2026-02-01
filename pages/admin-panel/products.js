// === CONFIGURATION ===
// IMPORTANT: NE DÉCLAREZ API_URL QU'UNE SEULE FOIS ICI
// Supprimez toutes les autres déclarations dans d'autres fichiers

// URL de votre API sur Render
const API_URL = 'https://es-company-api.onrender.com'; // REMPLACEZ par votre URL réelle

// Fonction utilitaire pour obtenir le token JWT
function getAuthToken() {
    return localStorage.getItem('admin_token') || 
           localStorage.getItem('token') || 
           sessionStorage.getItem('admin_token');
}

// Fonction fetch avec gestion d'erreurs améliorée
async function apiFetch(endpoint, options = {}) {
    const url = `${API_URL}${endpoint}`;
    const token = getAuthToken();
    
    const defaultOptions = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        },
        mode: 'cors',
        credentials: 'omit'
    };
    
    const finalOptions = { ...defaultOptions, ...options };
    
    try {
        console.log(`🌐 API Request: ${url}`);
        const response = await fetch(url, finalOptions);
        
        // Gérer les réponses non-OK
        if (!response.ok) {
            let errorMessage = `HTTP ${response.status}`;
            try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
            } catch {
                // Si la réponse n'est pas du JSON
                const errorText = await response.text();
                errorMessage = errorText || errorMessage;
            }
            throw new Error(errorMessage);
        }
        
        return await response.json();
    } catch (error) {
        console.error(`❌ API Error (${endpoint}):`, error.message);
        throw error;
    }
}

// === GESTION DES PRODUITS ===
class ProductManager {
    constructor() {
        this.products = [];
        this.init();
    }

    async init() {
        await this.loadProducts();
        this.initEvents();
    }

    async loadProducts() {
        try {
            console.log('🔄 Chargement des produits depuis l\'API...');
            
            const data = await apiFetch('/api/products?limit=100');
            
            if (data.status === 'success') {
                this.products = data.data.products || [];
                console.log(`✅ ${this.products.length} produits chargés depuis l'API`);
                
                // Sauvegarde locale
                localStorage.setItem('escompany_products_backup', JSON.stringify(this.products));
                
                // Mettre à jour l'affichage
                this.updateProductsDisplay();
            }
        } catch (error) {
            console.error('❌ Erreur de chargement depuis l\'API:', error);
            this.loadLocalProducts();
        }
    }

    loadLocalProducts() {
        console.log('🔄 Chargement depuis le stockage local...');
        
        // Essayer d'abord la sauvegarde API
        const backupProducts = localStorage.getItem('escompany_products_backup');
        if (backupProducts) {
            this.products = JSON.parse(backupProducts);
            console.log(`📁 ${this.products.length} produits chargés depuis la sauvegarde`);
        } 
        // Sinon utiliser les données locales
        else {
            const storedProducts = localStorage.getItem('escompany_products');
            if (storedProducts) {
                this.products = JSON.parse(storedProducts);
                console.log(`📁 ${this.products.length} produits chargés depuis le stockage local`);
            } else {
                // Données par défaut
                this.products = this.getDefaultProducts();
                console.log('📁 Utilisation des produits par défaut');
            }
        }
        
        this.updateProductsDisplay();
    }

    updateProductsDisplay() {
        const tbody = document.getElementById('productsTable');
        const productCount = document.getElementById('productCount');
        
        if (!tbody) return;
        
        if (this.products.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" style="text-align: center; padding: 40px;">
                        <i class="fas fa-box-open" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                        <h4 style="color: #777;">Aucun produit trouvé</h4>
                        <p>Ajoutez votre premier produit.</p>
                    </td>
                </tr>
            `;
            if (productCount) productCount.textContent = '0';
            return;
        }
        
        tbody.innerHTML = this.products.map(product => `
            <tr>
                <td>
                    <img src="${product.images?.[0]?.url || 'https://via.placeholder.com/60x60?text=No+Image'}" 
                         alt="${product.name}" 
                         class="product-image">
                </td>
                <td>
                    <strong>${this.escapeHtml(product.name)}</strong>
                    ${product.description ? `<div style="font-size: 12px; color: #777; margin-top: 5px;">${this.truncate(this.escapeHtml(product.description), 50)}</div>` : ''}
                </td>
                <td>
                    <span class="status" style="background-color: #e8f4fc; color: #3498db; padding: 3px 8px; border-radius: 4px;">
                        ${this.getCategoryLabel(product.category)}
                    </span>
                </td>
                <td><strong>${this.formatPrice(product.price)}</strong></td>
                <td>
                    ${product.stock}
                    ${product.stock < 5 ? '<i class="fas fa-exclamation-triangle" style="color: #e74c3c; margin-left: 5px;"></i>' : ''}
                </td>
                <td><span class="status ${product.status}">${product.status === 'active' ? 'Actif' : 'Inactif'}</span></td>
                <td>${new Date(product.createdAt || Date.now()).toLocaleDateString('fr-FR')}</td>
                <td class="actions">
                    <a href="edit-product.html?id=${product.id || product._id}" class="btn btn-small" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button onclick="productManager.confirmDeleteProduct('${product.id || product._id}', '${this.escapeHtml(product.name)}')" 
                            class="btn btn-small delete-btn" 
                            title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        if (productCount) {
            productCount.textContent = this.products.length;
        }
    }

    async addProduct(productData) {
        try {
            console.log('📦 Ajout du produit...', productData);
            
            // Préparer FormData pour l'envoi
            const formData = new FormData();
            
            // Ajouter les champs texte
            Object.keys(productData).forEach(key => {
                if (key !== 'images' && productData[key] !== undefined) {
                    formData.append(key, productData[key]);
                }
            });
            
            // Ajouter les images
            if (productData.images && Array.isArray(productData.images)) {
                productData.images.forEach((image, index) => {
                    if (image instanceof File) {
                        formData.append('images', image);
                    }
                });
            }
            
            const response = await fetch(`${API_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: formData
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || 'Erreur serveur');
            }
            
            const result = await response.json();
            
            if (result.status === 'success') {
                alert('✅ Produit ajouté avec succès!');
                await this.loadProducts();
                return result.data.product;
            } else {
                throw new Error(result.message || 'Erreur lors de l\'ajout');
            }
        } catch (error) {
            console.error('❌ Erreur d\'ajout:', error);
            
            // Essayer de sauvegarder localement
            try {
                this.saveProductLocally(productData);
                alert('⚠️ Produit sauvegardé localement (erreur API).');
                this.loadLocalProducts();
            } catch (localError) {
                alert(`❌ Erreur: ${error.message}`);
            }
            
            throw error;
        }
    }

    saveProductLocally(productData) {
        const products = JSON.parse(localStorage.getItem('escompany_products') || '[]');
        const newProduct = {
            id: Date.now(),
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        products.push(newProduct);
        localStorage.setItem('escompany_products', JSON.stringify(products));
    }

    async deleteProduct(productId) {
        if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
            return;
        }
        
        try {
            await apiFetch(`/api/products/${productId}`, {
                method: 'DELETE'
            });
            
            alert('✅ Produit supprimé avec succès!');
            await this.loadProducts();
        } catch (error) {
            console.error('❌ Erreur de suppression:', error);
            
            // Supprimer localement
            const products = JSON.parse(localStorage.getItem('escompany_products') || '[]');
            const filteredProducts = products.filter(p => p.id !== productId && p._id !== productId);
            localStorage.setItem('escompany_products', JSON.stringify(filteredProducts));
            
            alert('✅ Produit supprimé localement.');
            this.loadLocalProducts();
        }
    }

    confirmDeleteProduct(productId, productName) {
        if (confirm(`Êtes-vous sûr de vouloir supprimer "${productName}" ?`)) {
            this.deleteProduct(productId);
        }
    }

    // === UTILITAIRES ===
    formatPrice(price) {
        return new Intl.NumberFormat('fr-HT', {
            style: 'currency',
            currency: 'HTG',
            minimumFractionDigits: 0
        }).format(price || 0);
    }

    getCategoryLabel(category) {
        const labels = {
            'robes': 'Robes',
            'pantalons': 'Pantalons',
            'jupes': 'Jupes',
            'chaussures': 'Chaussures',
            'bijoux': 'Bijoux',
            'accessoires': 'Accessoires'
        };
        return labels[category] || category;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    truncate(text, length) {
        return text.length > length ? text.substring(0, length) + '...' : text;
    }

    getDefaultProducts() {
        return [
            {
                id: 1,
                name: "Robe d'été fleurie",
                description: "Robe légère et confortable pour l'été",
                price: 2500,
                category: "robes",
                stock: 15,
                status: "active",
                images: [{
                    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    alt: "Robe d'été fleurie"
                }],
                createdAt: new Date().toISOString()
            }
        ];
    }

    initEvents() {
        // Initialiser les filtres
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
    }

    applyFilters() {
        // Implémentation des filtres
        console.log('🔍 Application des filtres...');
        // À implémenter selon vos besoins
    }

    resetFilters() {
        const filters = ['categoryFilter', 'statusFilter', 'stockFilter'];
        filters.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        this.loadProducts();
    }
}

// === INITIALISATION ===
// S'assurer que productManager est accessible globalement
window.productManager = new ProductManager();

// Tester la connexion API au chargement
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🚀 Initialisation du gestionnaire de produits...');
    
    // Tester la connexion API
    try {
        const response = await fetch(`${API_URL}/api/health`);
        if (response.ok) {
            const data = await response.json();
            console.log('✅ API Status:', data.message);
        }
    } catch (error) {
        console.warn('⚠️ API non accessible:', error.message);
        console.log('🔄 Utilisation du mode hors ligne');
    }
});
