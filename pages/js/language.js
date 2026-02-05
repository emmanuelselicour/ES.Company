// Gestion des langues
// Ce fichier est déjà intégré dans main.js avec les traductions
// Il est séparé ici pour la clarté de la structure

// Les traductions sont définies dans main.js
// Cette fonction est exposée pour être utilisée dans d'autres fichiers
function translate(key) {
    return translations[currentLanguage] && translations[currentLanguage][key] 
        ? translations[currentLanguage][key] 
        : key;
}

// Changer la langue
function changeLanguage(lang) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    updatePageLanguage();
    
    // Mettre à jour le sélecteur de langue
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = lang;
    }
}

// Exposer les fonctions au scope global
window.translate = translate;
window.changeLanguage = changeLanguage;
