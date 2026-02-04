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
                name: "Collier en Argent",
                name_en: "Silver Necklace",
                name_es: "Collar de Plata",
                category: "Bijoux",
                category_en: "Jewelry",
                category_es: "Joyas",
                price: 29.99,
                image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Collier en argent avec pendentif",
                description_en: "Silver necklace with pendant",
                description_es: "Collar de plata con colgante"
            },
            {
                id: 5,
                name: "Chaussures à Talons",
                name_en: "Heel Shoes",
                name_es: "Zapatos de Tacón",
                category: "Chaussures",
                category_en: "Shoes",
                category_es: "Zapatos",
                price: 79.99,
                image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Chaussures élégantes à talons",
                description_en: "Elegant heel shoes",
                description_es: "Zapatos elegantes de tacón"
            },
            {
                id: 6,
                name: "Chemise Blanche",
                name_en: "White Shirt",
                name_es: "Camisa Blanca",
                category: "Haut",
                category_en: "Top",
                category_es: "Parte Superior",
                price: 34.99,
                image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Chemise blanche classique",
                description_en: "Classic white shirt",
                description_es: "Camisa blanca clásica"
            }
        ];
    }
    
    shuffleArray(array) {
        // Algorithme de mélange Fisher-Yates
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    getRandomProducts(count) {
        // Mélanger les produits et en retourner un certain nombre
        const shuffled = [...this.products];
        this.shuffleArray(shuffled);
        return shuffled.slice(0, count);
    }
    
    displayRandomProducts() {
        // Afficher les produits sur la page d'accueil
        if (this.featuredContainer) {
            const randomProducts = this.getRandomProducts(6);
            this.renderProducts(randomProducts, this.featuredContainer);
        }
        
        // Afficher tous les produits sur la page produits
        if (this.productsContainer) {
            const shuffledProducts = this.shuffleArray([...this.products]);
            this.renderProducts(shuffledProducts, this.productsContainer);
        }
    }
    
    renderProducts(products, container) {
        // Vider le conteneur
        container.innerHTML = '';
        
        // Obtenir la langue actuelle
        const currentLang = document.documentElement.classList.contains('lang-en') ? 'en' : 
                           document.documentElement.classList.contains('lang-es') ? 'es' : 'fr';
        
        // Ajouter chaque produit
        products.forEach(product => {
            const productCard = this.createProductCard(product, currentLang);
            container.appendChild(productCard);
        });
    }
    
    createProductCard(product, lang) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Sélectionner le texte selon la langue
        const name = lang === 'en' ? product.name_en || product.name : 
                    lang === 'es' ? product.name_es || product.name : product.name;
        
        const category = lang === 'en' ? product.category_en || product.category : 
                        lang === 'es' ? product.category_es || product.category : product.category;
        
        const description = lang === 'en' ? product.description_en || product.description : 
                          lang === 'es' ? product.description_es || product.description : product.description;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${name}">
            </div>
            <div class="product-info">
                <span class="product-category">${category}</span>
                <h3 class="product-title">${name}</h3>
                <p class="product-description">${description}</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> 
                        <span data-lang="fr">Ajouter</span>
                        <span data-lang="en">Add</span>
                        <span data-lang="es">Añadir</span>
                    </button>
                    <button class="view-details" data-id="${product.id}">
                        <i class="fas fa-eye"></i> 
                        <span data-lang="fr">Voir</span>
                        <span data-lang="en">View</span>
                        <span data-lang="es">Ver</span>
                    </button>
                </div>
            </div>
        `;
        
        return card;
    }
    
    addRefreshListener() {
        // Ajouter un bouton de rafraîchissement manuel (optionnel)
        const refreshBtn = document.getElementById('refreshProducts');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.displayRandomProducts();
                
                // Animation de rafraîchissement
                refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
                setTimeout(() => {
                    refreshBtn.innerHTML = '<i class="fas fa-random"></i> <span data-lang="fr">Mélanger</span><span data-lang="en">Shuffle</span><span data-lang="es">Mezclar</span>';
                }, 500);
            });
        }
    }
}

// Initialiser le product shuffler lorsque la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    new ProductShuffler();
});
