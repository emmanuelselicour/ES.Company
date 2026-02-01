// Fonctions communes pour le panel admin
class AdminFunctions {
    constructor() {
        this.init();
    }

    init() {
        // Initialiser le menu actif
        this.setActiveMenu();
        
        // Initialiser les tooltips
        this.initTooltips();
        
        // Initialiser les confirmations de suppression
        this.initDeleteConfirmations();
        
        // Afficher l'utilisateur connecté
        this.displayCurrentUser();
    }

    // Définir le menu actif basé sur l'URL
    setActiveMenu() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const menuItems = document.querySelectorAll('.sidebar-menu a');
        
        menuItems.forEach(item => {
            const href = item.getAttribute('href');
            if (href === currentPage) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    }

    // Initialiser les tooltips
    initTooltips() {
        const tooltips = document.querySelectorAll('[data-tooltip]');
        
        tooltips.forEach(element => {
            element.addEventListener('mouseenter', function(e) {
                const tooltipText = this.getAttribute('data-tooltip');
                const tooltip = document.createElement('div');
                tooltip.className = 'tooltip';
                tooltip.textContent = tooltipText;
                tooltip.style.cssText = `
                    position: absolute;
                    background: var(--primary-color);
                    color: white;
                    padding: 5px 10px;
                    border-radius: 4px;
                    font-size: 12px;
                    z-index: 1000;
                    white-space: nowrap;
                    pointer-events: none;
                    transform: translateY(-100%);
                    margin-top: -5px;
                `;
                
                document.body.appendChild(tooltip);
                
                const rect = this.getBoundingClientRect();
                tooltip.style.left = rect.left + rect.width/2 - tooltip.offsetWidth/2 + 'px';
                tooltip.style.top = rect.top + 'px';
                
                this.tooltipElement = tooltip;
            });
            
            element.addEventListener('mouseleave', function() {
                if (this.tooltipElement) {
                    this.tooltipElement.remove();
                    this.tooltipElement = null;
                }
            });
        });
    }

    // Initialiser les confirmations de suppression
    initDeleteConfirmations() {
        const deleteButtons = document.querySelectorAll('.delete-btn');
        
        deleteButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const itemName = this.getAttribute('data-item-name') || 'cet élément';
                const confirmMessage = `Êtes-vous sûr de vouloir supprimer ${itemName} ? Cette action est irréversible.`;
                
                if (confirm(confirmMessage)) {
                    // Si c'est un lien, suivre le lien
                    if (this.tagName === 'A' && this.getAttribute('href')) {
                        window.location.href = this.getAttribute('href');
                    }
                    // Sinon, déclencher l'événement click sur le parent form
                    else if (this.closest('form')) {
                        this.closest('form').submit();
                    }
                }
            });
        });
    }

    // Afficher l'utilisateur connecté
    displayCurrentUser() {
        const userElement = document.getElementById('currentUserName');
        if (userElement && auth.getCurrentUser()) {
            userElement.textContent = auth.getCurrentUser().name;
        }
    }

    // Afficher un message d'alerte
    showAlert(message, type = 'success', duration = 5000) {
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        // Positionner l'alerte
        alert.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
        `;
        
        document.body.appendChild(alert);
        
        // Ajouter l'animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
        
        // Supprimer après la durée spécifiée
        setTimeout(() => {
            alert.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => alert.remove(), 300);
        }, duration);
        
        return alert;
    }

    // Formater la date
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    // Formater le prix
    formatPrice(price) {
        return new Intl.NumberFormat('fr-HT', {
            style: 'currency',
            currency: 'HTG'
        }).format(price);
    }
}

// Initialiser les fonctions admin
const admin = new AdminFunctions();

// Exposer au global
window.admin = admin;
