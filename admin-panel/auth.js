// Gestion de l'authentification
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        // Vérifier si l'utilisateur est déjà connecté
        this.checkAuth();
    }

    // Vérifier l'authentification
    checkAuth() {
        const user = localStorage.getItem('admin_user');
        if (user) {
            this.currentUser = JSON.parse(user);
            
            // Rediriger vers le dashboard si on est sur la page de login
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname.endsWith('/')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Rediriger vers le login si non connecté (sauf sur la page de login)
            if (!window.location.pathname.includes('index.html') && 
                !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        }
    }

    // Connexion
    login(email, password) {
        // Ici, normalement, on ferait une requête à l'API
        // Pour l'exemple, on utilise des identifiants fictifs
        const validCredentials = {
            email: 'admin@escompany.com',
            password: 'admin123'
        };

        if (email === validCredentials.email && password === validCredentials.password) {
            this.currentUser = {
                id: 1,
                email: email,
                name: 'Administrateur E-S COMPANY',
                role: 'admin'
            };

            // Sauvegarder dans le localStorage
            localStorage.setItem('admin_user', JSON.stringify(this.currentUser));

            // Rediriger vers le dashboard
            window.location.href = 'dashboard.html';

            return { success: true, message: 'Connexion réussie' };
        } else {
            return { success: false, message: 'Email ou mot de passe incorrect' };
        }
    }

    // Déconnexion
    logout() {
        localStorage.removeItem('admin_user');
        this.currentUser = null;
        window.location.href = 'index.html';
    }

    // Vérifier les permissions
    hasPermission(permission) {
        if (!this.currentUser) return false;
        
        // Pour l'exemple, l'admin a tous les droits
        if (this.currentUser.role === 'admin') {
            return true;
        }
        
        return false;
    }

    // Obtenir l'utilisateur courant
    getCurrentUser() {
        return this.currentUser;
    }
}

// Initialiser l'authentification
const auth = new AuthManager();

// Exposer au global pour les autres scripts
window.auth = auth;
