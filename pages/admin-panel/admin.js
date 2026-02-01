// admin.js - Fonctions communes pour le panel admin
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
        if (userElement) {
            // Récupérer l'utilisateur depuis localStorage
            const userStr = localStorage.getItem('admin_user');
            if (userStr) {
                try {
                    const user = JSON.parse(userStr);
                    userElement.textContent = user.name || user.email || 'Administrateur';
                } catch (e) {
                    console.error('Error parsing user data:', e);
                    userElement.textContent = 'Administrateur';
                }
            } else {
                userElement.textContent = 'Administrateur';
            }
        }
    }

    // Afficher un message d'alerte
    showAlert(message, type = 'success', duration = 5000) {
        // Créer ou réutiliser une div d'alerte
        let alertDiv = document.getElementById('globalAlert');
        
        if (!alertDiv) {
            alertDiv = document.createElement('div');
            alertDiv.id = 'globalAlert';
            document.body.appendChild(alertDiv);
        }
        
        alertDiv.className = `alert alert-${type}`;
        alertDiv.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'exclamation-triangle'}"></i>
            <span>${message}</span>
        `;
        
        // Positionner l'alerte
        alertDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            display: flex;
            align-items: center;
            gap: 10px;
            padding: 15px;
            border-radius: var(--border-radius);
            box-shadow: var(--box-shadow);
            max-width: 400px;
        `;
        
        // Styles selon le type
        if (type === 'success') {
            alertDiv.style.backgroundColor = '#d5f4e6';
            alertDiv.style.color = '#27ae60';
            alertDiv.style.border = '1px solid #a3e4c0';
        } else if (type === 'error') {
            alertDiv.style.backgroundColor = '#fadbd8';
            alertDiv.style.color = '#e74c3c';
            alertDiv.style.border = '1px solid #f5b7b1';
        } else if (type === 'warning') {
            alertDiv.style.backgroundColor = '#fdebd0';
            alertDiv.style.color = '#f39c12';
            alertDiv.style.border = '1px solid #f8c471';
        }
        
        // Ajouter l'animation CSS si elle n'existe pas
        if (!document.querySelector('#alertStyles')) {
            const style = document.createElement('style');
            style.id = 'alertStyles';
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
        }
        
        // Supprimer après la durée spécifiée
        setTimeout(() => {
            alertDiv.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => {
                alertDiv.remove();
            }, 300);
        }, duration);
        
        return alertDiv;
    }

    // Formater la date
    formatDate(dateString) {
        if (!dateString) return 'N/A';
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
        if (!price && price !== 0) return 'N/A';
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
