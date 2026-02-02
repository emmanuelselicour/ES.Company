// Gestion du panier global
class GlobalCartManager {
    constructor() {
        this.cartSummary = null;
        this.init();
    }
    
    init() {
        this.updateCartCount();
        this.setupEventListeners();
    }
    
    async getCartSummary() {
        const token = localStorage.getItem('token');
        if (!token) return null;
        
        try {
            const response = await fetch(`${API_URL}/cart/summary`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    this.cartSummary = data.data;
                    return this.cartSummary;
                }
            }
        } catch (error) {
            console.error('Error getting cart summary:', error);
        }
        
        return null;
    }
    
    async updateCartCount() {
        const summary = await this.getCartSummary();
        const countElements = document.querySelectorAll('.cart-count');
        
        if (summary && summary.totalItems > 0) {
            countElements.forEach(el => {
                el.textContent = summary.totalItems;
                el.style.display = 'inline-block';
            });
        } else {
            countElements.forEach(el => {
                el.textContent = '0';
                el.style.display = 'none';
            });
        }
    }
    
    async addToCart(productId, quantity = 1, options = {}) {
        const token = localStorage.getItem('token');
        
        if (!token) {
            // Rediriger vers la page de login
            if (confirm('Veuillez vous connecter pour ajouter au panier. Voulez-vous vous connecter maintenant ?')) {
                window.location.href = `/login.html?redirect=${encodeURIComponent(window.location.pathname)}`;
            }
            return false;
        }
        
        try {
            const response = await fetch(`${API_URL}/cart/items`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    productId,
                    quantity,
                    ...options
                })
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                this.showNotification('Article ajouté au panier !', 'success');
                this.updateCartCount();
                return true;
            } else {
                this.showNotification(data.message || 'Erreur d\'ajout au panier', 'error');
                return false;
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            this.showNotification('Erreur de connexion au serveur', 'error');
            return false;
        }
    }
    
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `cart-notification cart-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : 'exclamation-circle'}"></i>
            <span>${message}</span>
        `;
        
        // Styles pour la notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : '#e74c3c'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            gap: 10px;
            z-index: 9999;
            animation: slideIn 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    setupEventListeners() {
        // Ajouter des boutons "Ajouter au panier" dynamiquement
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('[data-add-to-cart]');
            if (addToCartBtn) {
                e.preventDefault();
                
                const productId = addToCartBtn.dataset.productId;
                const quantity = parseInt(addToCartBtn.dataset.quantity) || 1;
                const color = addToCartBtn.dataset.color;
                const size = addToCartBtn.dataset.size;
                
                this.addToCart(productId, quantity, { color, size });
            }
        });
        
        // Mettre à jour le compteur régulièrement
        setInterval(() => {
            this.updateCartCount();
        }, 30000); // Toutes les 30 secondes
    }
}

// Initialiser le gestionnaire de panier global
const globalCart = new GlobalCartManager();

// Fonction utilitaire pour formater les prix
function formatPrice(price) {
    return new Intl.NumberFormat('fr-HT').format(price);
}

// Gestion de l'authentification
function updateAuthUI() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    const authElements = document.querySelectorAll('[data-auth]');
    
    authElements.forEach(element => {
        const authState = element.dataset.auth;
        
        if (authState === 'authenticated' && !token) {
            element.style.display = 'none';
        } else if (authState === 'unauthenticated' && token) {
            element.style.display = 'none';
        } else {
            element.style.display = '';
        }
    });
    
    // Mettre à jour le nom d'utilisateur si présent
    if (user) {
        const userData = JSON.parse(user);
        const userNameElements = document.querySelectorAll('[data-user-name]');
        userNameElements.forEach(el => {
            el.textContent = userData.name;
        });
    }
}

// Vérifier l'authentification au chargement
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    globalCart.updateCartCount();
});

// Déconnexion
function logout() {
    if (confirm('Êtes-vous sûr de vouloir vous déconnecter ?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/index.html';
    }
}
