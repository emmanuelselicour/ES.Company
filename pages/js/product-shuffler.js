// Product Shuffler - Randomize product display on each page load/refresh

class ProductShuffler {
    constructor() {
        this.products = [];
        this.featuredContainer = document.getElementById('featuredProducts');
        this.productsContainer = document.getElementById('productsContainer');
        this.apiUrl = 'https://es-company-api.onrender.com/products';
        // Fallback API simulation
        this.localApiUrl = 'api-simulation/products.json';
        
        this.init();
    }
    
    async init() {
        // Charger les produits depuis l'API
        await this.loadProducts();
        
        // Afficher les produits aléatoirement
        this.displayRandomProducts();
        
        // Ajouter un écouteur pour rafraîchir les produits
        this.addRefreshListener();
    }
    
    async loadProducts() {
        try {
            // Essayer d'abord l'API principale
            const response = await fetch(this.apiUrl);
            
            if (response.ok) {
                this.products = await response.json();
            } else {
                // Si l'API principale échoue, utiliser les données locales
                await this.loadLocalProducts();
            }
        } catch (error) {
            console.log("API principale non disponible, utilisation des données locales");
            await this.loadLocalProducts();
        }
        
        // Si toujours pas de produits, utiliser des produits par défaut
        if (this.products.length === 0) {
            this.createDefaultProducts();
        }
    }
    
    async loadLocalProducts() {
        try {
            const response = await fetch(this.localApiUrl);
            if (response.ok) {
                this.products = await response.json();
            }
        } catch (error) {
            console.log("Impossible de charger les produits locaux");
        }
    }
    
    createDefaultProducts() {
        // Produits par défaut pour démonstration
        this.products = [
            {
                id: 1,
                name: "Robe Élégante",
                name_en: "Elegant Dress",
                name_es: "Vestido Elegante",
                category: "Robes",
                category_en: "Dresses",
                category_es: "Vestidos",
                price: 59.99,
                image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Robe légère pour l'été",
                description_en: "Light dress for summer",
                description_es: "Vestido ligero para el verano"
            },
            {
                id: 2,
                name: "Pantalon Classique",
                name_en: "Classic Pants",
                name_es: "Pantalón Clásico",
                category: "Pantalons",
                category_en: "Pants",
                category_es: "Pantalones",
                price: 49.99,
                image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Pantalon élégant pour toutes occasions",
                description_en: "Elegant pants for all occasions",
                description_es: "Pantalón elegante para todas las ocasiones"
            },
            {
                id: 3,
                name: "Jupe Longue",
                name_en: "Long Skirt",
                name_es: "Falda Larga",
                category: "Jupes",
                category_en: "Skirts",
                category_es: "Faldas",
                price: 39.99,
                image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Jupe longue et fluide",
                description_en: "Long and fluid skirt",
                description_es: "Falda larga y fluida"
            },
            {
                id: 4,
                name:
