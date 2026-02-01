// products.js - Gestion des produits pour le panel admin

class ProductManager {
    constructor() {
        this.apiUrl = 'https://es-company-api.onrender.com'; // Remplacez par votre URL Render
        this.authToken = null;
        this.init();
    }

    init() {
        // Récupérer le token d'authentification
        this.authToken = localStorage.getItem('admin_token');
        
        if (!this.authToken) {
            console.error('No auth token found');
            return;
        }
    }

    // Obtenir tous les produits depuis l'API
    async getAllProducts(filters = {}) {
        try {
            // Préparer les paramètres de requête
            const queryParams = new URLSearchParams({
                ...filters,
                limit: 1000 // Récupérer tous les produits
            }).toString();
            
            const url = `${this.apiUrl}/api/products${queryParams ? '?' + queryParams : ''}`;
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (response.status === 401) {
                // Token invalide ou expiré
                this.handleUnauthorized();
                return [];
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.products;
            } else {
                console.error('API Error:', data.message);
                return [];
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // Obtenir un produit par ID
    async getProductById(id) {
        try {
            const response = await fetch(`${this.apiUrl}/api/products/${id}`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (response.status === 401) {
                this.handleUnauthorized();
                return null;
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.product;
            } else {
                console.error('API Error:', data.message);
                return null;
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    // Créer un nouveau produit
    async createProduct(productData) {
        try {
            const response = await fetch(`${this.apiUrl}/api/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            
            if (response.status === 401) {
                this.handleUnauthorized();
                return null;
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.product;
            } else {
                throw new Error(data.message || 'Erreur lors de la création');
            }
        } catch (error) {
            console.error('Error creating product:', error);
            throw error;
        }
    }

    // Mettre à jour un produit
    async updateProduct(id, productData) {
        try {
            const response = await fetch(`${this.apiUrl}/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(productData)
            });
            
            if (response.status === 401) {
                this.handleUnauthorized();
                return null;
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.product;
            } else {
                throw new Error(data.message || 'Erreur lors de la mise à jour');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    // Supprimer un produit
    async deleteProduct(id) {
        try {
            const response = await fetch(`${this.apiUrl}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${this.authToken}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (response.status === 401) {
                this.handleUnauthorized();
                return false;
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return true;
            } else {
                throw new Error(data.message || 'Erreur lors de la suppression');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    // Obtenir les statistiques des produits
    async getProductStats() {
        try {
            const response = await fetch(`${this.apiUrl}/api/products/stats`, {
                headers: {
                    'Authorization': `Bearer ${this.authToken}`
                }
            });
            
            if (response.status === 401) {
                this.handleUnauthorized();
                return null;
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data;
            } else {
                console.error('API Error:', data.message);
                return null;
            }
        } catch (error) {
            console.error('Error fetching product stats:', error);
            return null;
        }
    }

    // Gérer les erreurs d'authentification
    handleUnauthorized() {
        console.warn('Authentication required or token expired');
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        
        // Afficher un message et rediriger vers la page de login
        if (window.admin && typeof window.admin.showAlert === 'function') {
            window.admin.showAlert('Session expirée. Veuillez vous reconnecter.', 'error');
        }
        
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }

    // Tester la connexion à l'API
    async testConnection() {
        try {
            const response = await fetch(`${this.apiUrl}/api/health`);
            const data = await response.json();
            return data.status === 'success';
        } catch (error) {
            console.error('API connection test failed:', error);
            return false;
        }
    }

    // Exporter les produits en CSV
    exportToCSV(products) {
        if (!products || products.length === 0) {
            console.warn('No products to export');
            return;
        }
        
        const headers = ['ID', 'Nom', 'Description', 'Catégorie', 'Prix', 'Stock', 'Statut', 'En vedette', 'Remise'];
        const rows = products.map(p => [
            p._id,
            `"${p.name}"`,
            `"${p.description.replace(/"/g, '""')}"`,
            p.category,
            p.price,
            p.stock,
            p.status,
            p.featured ? 'Oui' : 'Non',
            p.discount || 0
        ]);
        
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\n');
        
        // Créer et télécharger le fichier
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `produits_escompany_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        return true;
    }
}

// Initialiser le gestionnaire de produits
const productManager = new ProductManager();

// Exposer au global
window.productManager = productManager;
