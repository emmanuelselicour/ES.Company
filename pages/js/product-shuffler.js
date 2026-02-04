// Product Shuffler - Randomize product display on each page load/refresh

class ProductShuffler {
    constructor() {
        this.products = [];
        this.featuredContainer = document.getElementById('featuredProducts');
        this.productsContainer = document.getElementById('productsContainer');
        this.apiUrl = 'https://es-company-api.onrender.com/api';
        
        this.init();
    }
    
    async init() {
        // Charger les produits depuis l'API
        await this.loadProducts();
        
        // Afficher les produits aléatoirement
        this.displayRandomProducts();
    }
    
    async loadProducts() {
        try {
            // Essayer d'abord l'API
            const response = await fetch(`${this.apiUrl}/products?limit=50`);
            
            if (response.ok) {
                const data = await response.json();
                if (data.success) {
                    this.products = data.data;
                } else {
                    await this.loadDefaultProducts();
                }
            } else {
                await this.loadDefaultProducts();
            }
        } catch (error) {
            console.log("API non disponible, utilisation des produits par défaut");
            await this.loadDefaultProducts();
        }
    }
    
    async loadDefaultProducts() {
        // Produits par défaut
        this.products = [
            // ... vos produits par défaut ...
        ];
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }
    
    getRandomProducts(count) {
        const shuffled = [...this.products];
        this.shuffleArray(shuffled);
        return shuffled.slice(0, count);
    }
    
    displayRandomProducts() {
        if (this.featuredContainer) {
            const randomProducts = this.getRandomProducts(6);
            this.renderProducts(randomProducts, this.featuredContainer);
        }
        
        if (this.productsContainer) {
            const shuffledProducts = this.shuffleArray([...this.products]);
            this.renderProducts(shuffledProducts, this.productsContainer);
        }
    }
    
    renderProducts(products, container) {
        container.innerHTML = '';
        
        const currentLang = document.documentElement.classList.contains('lang-en') ? 'en' : 
                           document.documentElement.classList.contains('lang-es') ? 'es' : 'fr';
        
        products.forEach(product => {
            const productCard = this.createProductCard(product, currentLang);
            container.appendChild(productCard);
        });
    }
    
    createProductCard(product, lang) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const name = lang === 'en' ? product.name_en : 
                    lang === 'es' ? product.name_es : product.name;
        
        const category = product.category ? (lang === 'en' ? product.category.name_en : 
                        lang === 'es' ? product.category.name_es : product.category.name) : 'Uncategorized';
        
        const description = lang === 'en' ? product.description_en : 
                          lang === 'es' ? product.description_es : product.description;
        
        const imageUrl = product.images && product.images.length > 0 ? 
                        product.images.find(img => img.isMain)?.url || product.images[0].url : 
                        'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80';
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${name}" loading="lazy">
            </div>
            <div class="product-info">
                <span class="product-category">${category}</span>
                <h3 class="product-title">${name}</h3>
                <p class="product-description">${description.substring(0, 100)}...</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product._id}">
                        <i class="fas fa-cart-plus"></i> 
                        <span data-lang="fr">Ajouter</span>
                        <span data-lang="en">Add</span>
                        <span data-lang="es">Añadir</span>
                    </button>
                    <button class="view-details" data-id="${product._id}">
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
}

// Initialiser
document.addEventListener('DOMContentLoaded', () => {
    new ProductShuffler();
});
