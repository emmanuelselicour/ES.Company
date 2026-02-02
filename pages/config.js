// Configuration de l'application
window.APP_CONFIG = {
  // URL de l'API - MODIFIEZ-CI pour votre URL Render
  API_URL: 'https://votre-api.onrender.com/api',
  
  // Configuration du site
  SITE_NAME: 'E-S COMPANY',
  SITE_DESCRIPTION: 'Boutique de mode en ligne',
  
  // Contacts
  CONTACT_EMAIL: 'info@escompany.com',
  CONTACT_PHONE: '+509 1234 5678',
  
  // Réseaux sociaux
  SOCIAL_MEDIA: {
    facebook: 'https://facebook.com/escompany',
    instagram: 'https://instagram.com/escompany',
    twitter: 'https://twitter.com/escompany'
  }
};

// Fonctions utilitaires
window.formatPrice = (price) => {
  return new Intl.NumberFormat('fr-HT', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price) + ' HTG';
};

window.getApiUrl = (endpoint) => {
  return window.APP_CONFIG.API_URL + endpoint;
};

// Vérifier la connexion API
window.checkApiConnection = async () => {
  try {
    const response = await fetch(window.getApiUrl('/health'));
    const data = await response.json();
    return { connected: true, data };
  } catch (error) {
    return { connected: false, error: error.message };
  }
};
