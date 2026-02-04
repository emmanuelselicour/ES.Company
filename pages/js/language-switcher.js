// Language Switcher for E-S COMPANY

class LanguageSwitcher {
    constructor() {
        this.currentLang = this.getSavedLanguage() || 'fr';
        this.init();
    }
    
    init() {
        // Définir la langue initiale
        this.setLanguage(this.currentLang);
        
        // Ajouter des écouteurs d'événements aux boutons de langue
        this.addLanguageButtonsListeners();
        
        // Mettre à jour le texte selon la langue
        this.updatePageText();
    }
    
    getSavedLanguage() {
        return localStorage.getItem('esCompanyLang');
    }
    
    saveLanguage(lang) {
        localStorage.setItem('esCompanyLang', lang);
    }
    
    setLanguage(lang) {
        // Mettre à jour l'attribut de classe sur l'élément html
        document.documentElement.className = `lang-${lang}`;
        
        // Mettre à jour le bouton actif
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Sauvegarder la langue
        this.saveLanguage(lang);
        this.currentLang = lang;
        
        // Mettre à jour le texte de la page
        this.updatePageText();
        
        // Rafraîchir les produits avec la nouvelle langue
        if (window.productShuffler) {
            window.productShuffler.displayRandomProducts();
        }
    }
    
    addLanguageButtonsListeners() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const lang = btn.getAttribute('data-lang');
                this.setLanguage(lang);
            });
        });
    }
    
    updatePageText() {
        // Cacher tous les textes multilingues
        document.querySelectorAll('[data-lang]').forEach(element => {
            element.style.display = 'none';
        });
        
        // Afficher uniquement les textes dans la langue actuelle
        document.querySelectorAll(`[data-lang="${this.currentLang}"]`).forEach(element => {
            element.style.display = 'inline';
        });
        
        // Traitement spécial pour les éléments de bloc
        document.querySelectorAll(`[data-lang="${this.currentLang}"]`).forEach(element => {
            if (element.tagName === 'P' || element.tagName === 'H1' || element.tagName === 'H2' || 
                element.tagName === 'H3' || element.tagName === 'DIV' || element.tagName === 'SECTION') {
                element.style.display = 'block';
            }
        });
    }
}

// Initialiser le switcher de langue
document.addEventListener('DOMContentLoaded', () => {
    window.languageSwitcher = new LanguageSwitcher();
});
