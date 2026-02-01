// Gestion du chargement des produits depuis l'API
class ProductLoader {
  constructor() {
    this.products = [];
    this.categories = [];
    this.isLoading = false;
  }

  // Charger tous les produits
  async loadAllProducts(params = {}) {
    try {
      this.isLoading = true;
      const url = API_CONFIG.getUrl(API_CONFIG.ENDPOINTS.PRODUCTS, params);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        this.products = data.data.products;
        return this.products;
      } else {
        throw new Error(data.message || 'Failed to load products');
      }
    } catch (error) {
      console.error('Error loading products:', error);
      return this.getFallbackProducts();
    } finally {
      this.isLoading = false;
    }
  }

  // Charger les produits par catégorie
  async loadProductsByCategory(category, limit = 8) {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS_BY_CATEGORY}/${category}?limit=${limit}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data.products;
      }
      return [];
    } catch (error) {
      console.error(`Error loading ${category} products:`, error);
      return this.getFallbackProductsByCategory(category);
    }
  }

  // Charger les produits en vedette
  async loadFeaturedProducts() {
    try {
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FEATURED_PRODUCTS}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.status === 'success') {
        return data.data.products;
      }
      return [];
    } catch (error) {
      console.error('Error loading featured products:', error);
      return this.getFallbackFeaturedProducts();
    }
  }

  // Produits de secours (si l'API est hors ligne)
  getFallbackProducts() {
    return [
      {
        id: 1,
        name: "Robe d'été fleurie",
        description: "Robe légère et confortable pour l'été",
        price: 2500,
        category: "robes",
        images: [{
          url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          alt: "Robe d'été fleurie"
        }],
        stock: 15,
        status: "active",
        featured: true
      },
      {
        id: 2,
        name: "Pantalon slim noir",
        description: "Pantalon slim élégant en tissu stretch",
        price: 1800,
        category: "pantalons",
        images: [{
          url: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
          alt: "Pantalon slim noir"
        }],
        stock: 25,
        status: "active",
        featured: false
      }
    ];
  }

  getFallbackProductsByCategory(category) {
    const allProducts = this.getFallbackProducts();
    return allProducts.filter(product => product.category === category);
  }

  getFallbackFeaturedProducts() {
    const allProducts = this.getFallbackProducts();
    return allProducts.filter(product => product.featured);
  }

  // Générer le HTML pour un produit
  generateProductHTML(product) {
    return `
      <div class="product-card" data-id="${product.id}">
        <div class="product-image">
          <img src="${product.images && product.images.length > 0 ? product.images[0].url : 'https://via.placeholder.com/300x300?text=No+Image'}" 
               alt="${product.name}">
          ${product.stock < 5 ? '<span class="low-stock">Stock faible</span>' : ''}
          ${product.featured ? '<span class="featured-badge">⭐ En vedette</span>' : ''}
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="product-description">${product.description.substring(0, 80)}...</p>
          <div class="product-price">
            ${product.discount > 0 ? `
              <span class="original-price">${this.formatPrice(product.price)} HTG</span>
              <span class="discounted-price">${this.formatPrice(product.price * (1 - product.discount / 100))} HTG</span>
              <span class="discount-badge">-${product.discount}%</span>
            ` : `
              <span class="current-price">${this.formatPrice(product.price)} HTG</span>
            `}
          </div>
          <div class="product-meta">
            <span class="category">${this.getCategoryLabel(product.category)}</span>
            <span class="stock">Stock: ${product.stock}</span>
          </div>
          <button class="btn btn-primary view-product" data-id="${product.id}">
            Voir détails
          </button>
        </div>
      </div>
    `;
  }

  // Formater le prix
  formatPrice(price) {
    return new Intl.NumberFormat('fr-HT', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  // Traduire les catégories
  getCategoryLabel(category) {
    const categories = {
      'robes': 'Robes',
      'pantalons': 'Pantalons',
      'jupes': 'Jupes',
      'chaussures': 'Chaussures',
      'bijoux': 'Bijoux'
    };
    return categories[category] || category;
  }
}

// Initialiser et exporter
const productLoader = new ProductLoader();
window.productLoader = productLoader;
