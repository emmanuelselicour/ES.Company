// api.js - À inclure dans toutes les pages du site client
const API_URL = 'https://votre-api.onrender.com'; // Remplacez par votre URL Render

class ESCompanyAPI {
    constructor() {
        this.baseURL = API_URL;
    }

    // Méthodes pour les produits
    async getProducts(filters = {}) {
        try {
            const queryParams = new URLSearchParams(filters).toString();
            const url = `${this.baseURL}/api/products${queryParams ? '?' + queryParams : ''}`;
            
            const response = await fetch(url);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.products;
            } else {
                console.error('API Error:', data.message);
                return [];
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            return [];
        }
    }

    async getProductById(id) {
        try {
            const response = await fetch(`${this.baseURL}/api/products/${id}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.product;
            } else {
                console.error('API Error:', data.message);
                return null;
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            return null;
        }
    }

    async getProductsByCategory(category, limit = 12) {
        return this.getProducts({ category, limit });
    }

    async getFeaturedProducts() {
        try {
            const response = await fetch(`${this.baseURL}/api/products/featured`);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.products;
            } else {
                console.error('API Error:', data.message);
                return [];
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            return [];
        }
    }

    // Méthodes pour les catégories
    async getCategories() {
        const products = await this.getProducts();
        const categories = {};
        
        products.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = {
                    name: product.category,
                    count: 0,
                    products: []
                };
            }
            categories[product.category].count++;
            categories[product.category].products.push(product);
        });
        
        return Object.values(categories);
    }

    // Méthode pour simuler l'ancien localStorage
    async getLocalStorageData() {
        // Pour la compatibilité avec l'ancien code
        const products = await this.getProducts();
        
        return {
            products: products,
            categories: await this.getCategories()
        };
    }
}

// Initialiser l'API
const api = new ESCompanyAPI();

// Exporter pour utilisation globale
window.ESCompanyAPI = api;
window.api = api; // Alias court
