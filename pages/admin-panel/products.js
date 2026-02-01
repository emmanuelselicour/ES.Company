// products.js mis à jour pour utiliser l'API
class ProductManager {
    constructor() {
        this.API_URL = 'https://es-company-api.onrender.com/api';
        this.products = [];
    }

    async loadProducts() {
        try {
            const response = await fetch(`${this.API_URL}/products`);
            const data = await response.json();
            
            if (data.status === 'success') {
                this.products = data.data.products || [];
            } else {
                console.error('Error loading products:', data.message);
                this.products = [];
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            this.products = [];
        }
    }

    async getAllProducts() {
        if (this.products.length === 0) {
            await this.loadProducts();
        }
        return this.products;
    }

    async getProductById(id) {
        try {
            const response = await fetch(`${this.API_URL}/products/${id}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.product;
            }
            return null;
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    async addProduct(productData, images) {
        try {
            const formData = new FormData();
            
            // Ajouter les données du produit
            Object.keys(productData).forEach(key => {
                formData.append(key, productData[key]);
            });
            
            // Ajouter les images
            images.forEach((image, index) => {
                if (image.file) {
                    formData.append('images', image.file);
                } else if (image.url) {
                    // Si c'est une URL existante (pour l'édition)
                    formData.append('existingImages', JSON.stringify([image.url]));
                }
            });
            
            const response = await fetch(`${this.API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                await this.loadProducts(); // Recharger les produits
                return data.data.product;
            }
            return null;
        } catch (error) {
            console.error('Error adding product:', error);
            return null;
        }
    }

    async updateProduct(id, productData) {
        try {
            const response = await fetch(`${this.API_URL}/products/${id}`, {
                method: 'PUT',
                headers: auth.getAuthHeaders(),
                body: JSON.stringify(productData)
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                await this.loadProducts(); // Recharger les produits
                return data.data.product;
            }
            return null;
        } catch (error) {
            console.error('Error updating product:', error);
            return null;
        }
    }

    async deleteProduct(id) {
        try {
            const response = await fetch(`${this.API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: auth.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                await this.loadProducts(); // Recharger les produits
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error deleting product:', error);
            return false;
        }
    }

    async getStats() {
        try {
            const response = await fetch(`${this.API_URL}/products/stats`, {
                headers: auth.getAuthHeaders()
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data;
            }
            return {
                totalProducts: 0,
                activeProducts: 0,
                totalValue: 0,
                lowStockProducts: 0
            };
        } catch (error) {
            console.error('Error fetching stats:', error);
            return {
                totalProducts: 0,
                activeProducts: 0,
                totalValue: 0,
                lowStockProducts: 0
            };
        }
    }
}

const productManager = new ProductManager();
window.productManager = productManager;
