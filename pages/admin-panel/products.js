// ============================================
// GESTION DES PRODUITS - E-S COMPANY ADMIN
// ============================================

// Configuration
const CONFIG = {
    API_URL: 'https://es-company-api.onrender.com',
    USE_LOCAL_STORAGE: true,
    DEBUG_MODE: true
};

// Logger pour le débogage
function log(message, data = null) {
    if (CONFIG.DEBUG_MODE) {
        console.log(`[${new Date().toLocaleTimeString()}] ${message}`, data || '');
    }
}

// Gestionnaire de produits
class ProductManager {
    constructor() {
        this.products = [];
        this.isOnline = false;
        this.init();
    }

    async init() {
        log('🔧 Initialisation du ProductManager');
        
        // Vérifier la connexion API
        await this.checkConnection();
        
        // Charger les produits
        await this.loadProducts();
        
        // Initialiser les événements
        this.initEvents();
        
        // Initialiser l'interface
        this.initUI();
    }

    async checkConnection() {
        try {
            log('🔍 Vérification de la connexion API...');
            const response = await fetch(`${CONFIG.API_URL}/api/health`, {
                method: 'GET',
                mode: 'cors',
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                this.isOnline = true;
                const data = await response.json();
                log('✅ API connectée:', data.message);
                this.showMessage('✅ Connecté à l\'API', 'success');
            } else {
                this.isOnline = false;
                log('⚠️ API non disponible');
                this.showMessage('⚠️ Mode hors ligne - Utilisation des données locales', 'warning');
            }
        } catch (error) {
            this.isOnline = false;
            log('❌ Erreur de connexion API:', error.message);
            this.showMessage('❌ Hors ligne - Données locales uniquement', 'error');
        }
    }

    async loadProducts() {
        const loadingElement = document.getElementById('loadingProducts');
        const tableBody = document.getElementById('productsTable');
        
        if (loadingElement) loadingElement.style.display = 'block';
        if (tableBody) tableBody.innerHTML = '';
        
        try {
            if (this.isOnline) {
                await this.loadFromAPI();
            } else {
                this.loadFromLocalStorage();
            }
        } catch (error) {
            log('❌ Erreur lors du chargement:', error);
            this.loadFromLocalStorage();
        } finally {
            if (loadingElement) loadingElement.style.display = 'none';
        }
    }

    async loadFromAPI() {
        try {
            log('🔄 Chargement depuis l\'API...');
            
            const token = this.getAuthToken();
            const headers = {
                'Accept': 'application/json'
            };
            
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
            
            const response = await fetch(`${CONFIG.API_URL}/api/products?limit=100`, {
                headers: headers,
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                this.products = data.data.products || [];
                log(`✅ ${this.products.length} produits chargés depuis l'API`);
                
                // Sauvegarder localement
                this.saveToLocalStorage();
                
                this.updateDisplay();
                this.updateStats();
                
                this.showMessage(`✅ ${this.products.length} produits chargés`, 'success');
            } else {
                throw new Error(data.message || 'Erreur API');
            }
        } catch (error) {
            log('❌ Erreur API:', error.message);
            throw error;
        }
    }

    loadFromLocalStorage() {
        log('📁 Chargement depuis le stockage local...');
        
        // Essayer plusieurs sources
        const sources = [
            'escompany_products_api_backup',
            'escompany_products',
            'products_backup'
        ];
        
        for (const source of sources) {
            const stored = localStorage.getItem(source);
            if (stored) {
                try {
                    this.products = JSON.parse(stored);
                    log(`📁 ${this.products.length} produits chargés depuis ${source}`);
                    
                    // Si on a des données, on s'arrête là
                    if (this.products.length > 0) {
                        this.updateDisplay();
                        this.updateStats();
                        this.showMessage(`📁 ${this.products.length} produits (données locales)`, 'info');
                        return;
                    }
                } catch (error) {
                    log(`❌ Erreur de parsing ${source}:`, error);
                }
            }
        }
        
        // Données par défaut si rien n'est trouvé
        this.products = this.getDefaultProducts();
        log('📁 Utilisation des produits par défaut');
        
        this.updateDisplay();
        this.updateStats();
        this.showMessage('📁 Données locales chargées', 'info');
    }

    saveToLocalStorage() {
        if (CONFIG.USE_LOCAL_STORAGE && this.products.length > 0) {
            localStorage.setItem('escompany_products_api_backup', JSON.stringify(this.products));
            localStorage.setItem('products_last_sync', new Date().toISOString());
            log('💾 Données sauvegardées localement');
        }
    }

    updateDisplay() {
        const tbody = document.getElementById('productsTable');
        const productCount = document.getElementById('productCount');
        const emptyState = document.getElementById('emptyProducts');
        
        if (!tbody) return;
        
        // Mettre à jour le compteur
        if (productCount) {
            productCount.textContent = this.products.length;
        }
        
        // Afficher l'état vide si pas de produits
        if (this.products.length === 0) {
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            tbody.innerHTML = `
                <tr>
                    <td colspan="8" class="text-center py-5">
                        <div class="empty-state">
                            <i class="fas fa-box-open fa-3x text-muted mb-3"></i>
                            <h4 class="text-muted">Aucun produit</h4>
                            <p class="text-muted">Ajoutez votre premier produit pour commencer.</p>
                            <a href="add-product.html" class="btn btn-primary mt-3">
                                <i class="fas fa-plus"></i> Ajouter un produit
                            </a>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Cacher l'état vide
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Générer les lignes du tableau
        tbody.innerHTML = this.products.map((product, index) => {
            const productId = product._id || product.id || `local-${index}`;
            const mainImage = product.images && product.images.length > 0 
                ? product.images[0].url 
                : 'https://via.placeholder.com/60x60?text=No+Image';
            
            const categoryLabels = {
                'robes': 'Robes',
                'pantalons': 'Pantalons', 
                'jupes': 'Jupes',
                'chaussures': 'Chaussures',
                'bijoux': 'Bijoux',
                'accessoires': 'Accessoires'
            };
            
            return `
                <tr data-product-id="${productId}">
                    <td>
                        <img src="${mainImage}" 
                             alt="${product.name || 'Produit'}" 
                             class="product-image"
                             onerror="this.src='https://via.placeholder.com/60x60?text=Image'">
                    </td>
                    <td>
                        <strong>${this.escapeHtml(product.name || 'Sans nom')}</strong>
                        ${product.description ? `
                            <div class="text-muted small mt-1">
                                ${this.truncate(this.escapeHtml(product.description), 60)}
                            </div>
                        ` : ''}
                    </td>
                    <td>
                        <span class="badge badge-category">
                            ${categoryLabels[product.category] || product.category || 'Non catégorisé'}
                        </span>
                    </td>
                    <td class="font-weight-bold">
                        ${this.formatPrice(product.price || 0)}
                    </td>
                    <td>
                        <span class="stock-badge ${(product.stock || 0) < 5 ? 'stock-low' : ''}">
                            ${product.stock || 0}
                            ${(product.stock || 0) < 5 ? ' <i class="fas fa-exclamation-triangle ml-1"></i>' : ''}
                        </span>
                    </td>
                    <td>
                        <span class="status-badge status-${product.status || 'active'}">
                            ${product.status === 'active' ? 'Actif' : 
                              product.status === 'inactive' ? 'Inactif' : 
                              product.status === 'out_of_stock' ? 'Rupture' : 'Actif'}
                        </span>
                    </td>
                    <td class="text-nowrap">
                        ${this.formatDate(product.createdAt || product.updatedAt)}
                    </td>
                    <td>
                        <div class="btn-group" role="group">
                            <a href="edit-product.html?id=${productId}" 
                               class="btn btn-sm btn-outline-primary"
                               title="Modifier">
                                <i class="fas fa-edit"></i>
                            </a>
                            <button type="button" 
                                    class="btn btn-sm btn-outline-danger"
                                    onclick="productManager.deleteProduct('${productId}', '${this.escapeJs(product.name || 'ce produit')}')"
                                    title="Supprimer">
                                <i class="fas fa-trash"></i>
                            </button>
                            <button type="button" 
                                    class="btn btn-sm btn-outline-info"
                                    onclick="productManager.viewProduct('${productId}')"
                                    title="Voir détails">
                                <i class="fas fa-eye"></i>
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }).join('');
        
        log('📊 Tableau des produits mis à jour');
    }

    updateStats() {
        // Mettre à jour les statistiques si elles existent
        const stats = {
            total: this.products.length,
            active: this.products.filter(p => p.status === 'active').length,
            outOfStock: this.products.filter(p => p.status === 'out_of_stock' || (p.stock || 0) === 0).length,
            lowStock: this.products.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 5).length,
            totalValue: this.products.reduce((sum, p) => sum + ((p.price || 0) * (p.stock || 0)), 0)
        };
        
        // Mettre à jour les éléments UI
        const updateElement = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.textContent = value;
        };
        
        updateElement('statsTotalProducts', stats.total);
        updateElement('statsActiveProducts', stats.active);
        updateElement('statsOutOfStock', stats.outOfStock);
        updateElement('statsLowStock', stats.lowStock);
        
        const totalValueEl = document.getElementById('statsTotalValue');
        if (totalValueEl) {
            totalValueEl.textContent = this.formatPrice(stats.totalValue);
        }
    }

    async deleteProduct(productId, productName) {
        if (!productId) {
            this.showMessage('❌ ID produit manquant', 'error');
            return;
        }
        
        const confirmMsg = productName 
            ? `Êtes-vous sûr de vouloir supprimer "${productName}" ?`
            : 'Êtes-vous sûr de vouloir supprimer ce produit ?';
        
        if (!confirm(confirmMsg)) {
            return;
        }
        
        this.showMessage('🗑️ Suppression en cours...', 'info');
        
        try {
            if (this.isOnline && !productId.startsWith('local-')) {
                // Supprimer via l'API
                const token = this.getAuthToken();
                const headers = {
                    'Accept': 'application/json'
                };
                
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                
                const response = await fetch(`${CONFIG.API_URL}/api/products/${productId}`, {
                    method: 'DELETE',
                    headers: headers,
                    mode: 'cors'
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.status !== 'success') {
                    throw new Error(data.message || 'Erreur de suppression');
                }
                
                this.showMessage('✅ Produit supprimé de l\'API', 'success');
            }
            
            // Supprimer localement dans tous les cas
            const productIndex = this.products.findIndex(p => 
                (p._id === productId) || (p.id === productId) || (`local-${this.products.indexOf(p)}` === productId)
            );
            
            if (productIndex !== -1) {
                this.products.splice(productIndex, 1);
                this.saveToLocalStorage();
                this.updateDisplay();
                this.updateStats();
                
                this.showMessage('✅ Produit supprimé', 'success');
            } else {
                this.showMessage('⚠️ Produit non trouvé localement', 'warning');
            }
            
        } catch (error) {
            log('❌ Erreur de suppression:', error);
            this.showMessage(`❌ Erreur: ${error.message}`, 'error');
        }
    }

    viewProduct(productId) {
        alert(`Détails du produit ${productId}\n\nFonctionnalité à implémenter.`);
    }

    // ============================================
    // UTILITAIRES
    // ============================================

    getAuthToken() {
        return localStorage.getItem('admin_token') || 
               localStorage.getItem('token') || 
               sessionStorage.getItem('admin_token');
    }

    formatPrice(amount) {
        return new Intl.NumberFormat('fr-HT', {
            style: 'currency',
            currency: 'HTG',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0);
    }

    formatDate(dateString) {
        if (!dateString) return 'N/A';
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch {
            return 'N/A';
        }
    }

    escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    escapeJs(text) {
        if (!text) return '';
        return text
            .replace(/\\/g, '\\\\')
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, '\\n');
    }

    truncate(text, length) {
        if (!text) return '';
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    }

    showMessage(message, type = 'info') {
        log(`💬 Message (${type}): ${message}`);
        
        // Créer ou mettre à jour un élément de message
        let messageEl = document.getElementById('globalMessage');
        
        if (!messageEl) {
            messageEl = document.createElement('div');
            messageEl.id = 'globalMessage';
            messageEl.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                padding: 15px 20px;
                border-radius: 8px;
                color: white;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                max-width: 400px;
                animation: slideIn 0.3s ease;
            `;
            document.body.appendChild(messageEl);
        }
        
        // Couleurs par type
        const colors = {
            success: '#27ae60',
            error: '#e74c3c',
            warning: '#f39c12',
            info: '#3498db'
        };
        
        messageEl.style.backgroundColor = colors[type] || colors.info;
        messageEl.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 
                             type === 'error' ? 'exclamation-circle' : 
                             type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span style="margin-left: 10px;">${message}</span>
        `;
        
        // Ajouter l'animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        if (!document.querySelector('#messageAnimations')) {
            style.id = 'messageAnimations';
            document.head.appendChild(style);
        }
        
        // Supprimer après 5 secondes
        setTimeout(() => {
            messageEl.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                if (messageEl.parentNode) {
                    messageEl.parentNode.removeChild(messageEl);
                }
            }, 300);
        }, 5000);
    }

    getDefaultProducts() {
        return [
            {
                id: 'default-1',
                name: "Robe d'été fleurie",
                description: "Robe légère et confortable pour l'été, avec motif floral élégant.",
                price: 2500,
                category: "robes",
                stock: 15,
                status: "active",
                featured: true,
                images: [{
                    url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    alt: "Robe d'été fleurie"
                }],
                specifications: {
                    material: "Coton",
                    color: "Multicolore",
                    size: ["S", "M", "L", "XL"]
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'default-2',
                name: "Pantalon slim noir",
                description: "Pantalon slim élégant en tissu stretch confortable.",
                price: 1800,
                category: "pantalons",
                stock: 25,
                status: "active",
                featured: false,
                images: [{
                    url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                    alt: "Pantalon slim noir"
                }],
                specifications: {
                    material: "Polyester",
                    color: "Noir",
                    size: ["S", "M", "L"]
                },
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    initEvents() {
        // Filtres
        const applyBtn = document.getElementById('applyFilters');
        const resetBtn = document.getElementById('resetFilters');
        
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyFilters());
        }
        
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.resetFilters());
        }
        
        // Recherche
        const searchInput = document.getElementById('searchProducts');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchProducts(e.target.value);
            });
        }
        
        // Rafraîchir
        const refreshBtn = document.getElementById('refreshProducts');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadProducts();
            });
        }
    }

    initUI() {
        // Ajouter des styles CSS si nécessaire
        if (!document.querySelector('#productManagerStyles')) {
            const style = document.createElement('style');
            style.id = 'productManagerStyles';
            style.textContent = `
                .product-image {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 4px;
                    border: 1px solid #eee;
                }
                
                .badge-category {
                    background-color: #e8f4fc;
                    color: #3498db;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                }
                
                .stock-badge {
                    display: inline-flex;
                    align-items: center;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-weight: 600;
                    font-size: 14px;
                    background-color: #d5f4e6;
                    color: #27ae60;
                }
                
                .stock-badge.stock-low {
                    background-color: #fdebd0;
                    color: #f39c12;
                }
                
                .status-badge {
                    display: inline-block;
                    padding: 4px 8px;
                    border-radius: 4px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: uppercase;
                }
                
                .status-active {
                    background-color: #d5f4e6;
                    color: #27ae60;
                }
                
                .status-inactive {
                    background-color: #fdebd0;
                    color: #f39c12;
                }
                
                .status-out_of_stock {
                    background-color: #fadbd8;
                    color: #e74c3c;
                }
                
                .btn-group .btn {
                    padding: 4px 8px;
                    font-size: 12px;
                }
                
                .empty-state {
                    text-align: center;
                    padding: 40px 20px;
                }
                
                #loadingProducts {
                    text-align: center;
                    padding: 40px;
                    font-size: 16px;
                    color: #666;
                }
            `;
            document.head.appendChild(style);
        }
        
        // Ajouter un indicateur de chargement si nécessaire
        const tableBody = document.getElementById('productsTable');
        if (tableBody && !document.getElementById('loadingProducts')) {
            const loadingDiv = document.createElement('div');
            loadingDiv.id = 'loadingProducts';
            loadingDiv.style.display = 'none';
            loadingDiv.innerHTML = `
                <div class="spinner-border text-primary" role="status">
                    <span class="sr-only">Chargement...</span>
                </div>
                <p class="mt-3">Chargement des produits...</p>
            `;
            tableBody.parentNode.insertBefore(loadingDiv, tableBody);
        }
    }

    applyFilters() {
        // Implémenter la logique de filtrage
        console.log('Filtrage des produits...');
        // À compléter selon vos besoins
    }

    resetFilters() {
        const filters = ['categoryFilter', 'statusFilter', 'stockFilter'];
        filters.forEach(id => {
            const element = document.getElementById(id);
            if (element) element.value = '';
        });
        this.loadProducts();
    }

    searchProducts(query) {
        if (!query.trim()) {
            this.updateDisplay();
            return;
        }
        
        const filtered = this.products.filter(product => 
            product.name?.toLowerCase().includes(query.toLowerCase()) ||
            product.description?.toLowerCase().includes(query.toLowerCase()) ||
            product.category?.toLowerCase().includes(query.toLowerCase())
        );
        
        // Mettre à jour l'affichage temporairement
        const originalProducts = this.products;
        this.products = filtered;
        this.updateDisplay();
        this.products = originalProducts;
    }
}

// ============================================
// INITIALISATION
// ============================================

// Initialiser le gestionnaire de produits
let productManager;

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Page chargée, initialisation du ProductManager...');
    
    // Vérifier si on est sur la page des produits
    if (document.getElementById('productsTable')) {
        productManager = new ProductManager();
        window.productManager = productManager; // Exposer globalement
        
        // Ajouter un bouton de test si en mode debug
        if (CONFIG.DEBUG_MODE) {
            const testBtn = document.createElement('button');
            testBtn.className = 'btn btn-sm btn-outline-secondary';
            testBtn.innerHTML = '<i class="fas fa-bug"></i> Test';
            testBtn.style.marginLeft = '10px';
            testBtn.onclick = () => {
                console.log('=== TEST ===');
                console.log('Produits:', productManager.products);
                console.log('En ligne:', productManager.isOnline);
                console.log('Token:', productManager.getAuthToken());
            };
            
            const header = document.querySelector('.page-header');
            if (header) {
                header.appendChild(testBtn);
            }
        }
    }
});

// Fonctions globales pour les boutons HTML
window.deleteProduct = function(productId, productName) {
    if (window.productManager) {
        window.productManager.deleteProduct(productId, productName);
    } else {
        alert('Gestionnaire non initialisé');
    }
};

window.refreshProducts = function() {
    if (window.productManager) {
        window.productManager.loadProducts();
    }
};
