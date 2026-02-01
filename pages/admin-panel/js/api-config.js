// Dans votre site Netlify, créez un fichier js/api-config.js
const API_CONFIG = {
  BASE_URL: 'https://es-company-api.onrender.com',
  ENDPOINTS: {
    PRODUCTS: '/api/products',
    PRODUCTS_BY_CATEGORY: '/api/products/category',
    FEATURED_PRODUCTS: '/api/products/featured',
    CATEGORIES: '/api/products/categories'
  },
  
  // Fonction pour construire les URLs
  getUrl(endpoint, params = {}) {
    let url = `${this.BASE_URL}${endpoint}`;
    
    if (Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams(params);
      url += `?${queryParams.toString()}`;
    }
    
    return url;
  }
};

// Exporter pour utilisation globale
window.API_CONFIG = API_CONFIG;
