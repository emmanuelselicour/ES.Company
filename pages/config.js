// config.js - À placer dans le dossier racine de Netlify
const API_CONFIG = {
  // ✅ CHANGEZ CETTE URL PAR VOTRE URL RENDER
  API_URL: 'https://es-company-api.onrender.com/api',
  
  // ✅ Config pour développement local
  LOCAL_API: 'http://localhost:5000/api',
  
  // ✅ Détecter l'environnement
  getBaseURL: function() {
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
      return this.LOCAL_API;
    }
    return this.API_URL;
  },
  
  // ✅ Headers par défaut
  getHeaders: function(token = null) {
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
  }
};

// Exposer au global
window.API_CONFIG = API_CONFIG;
