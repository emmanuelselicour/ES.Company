// auth.js - Gestion de l'authentification
class AuthManager {
    constructor() {
        this.API_URL = 'https://es-company-api.onrender.com/api'; // Votre URL Render
        this.currentUser = null;
        this.token = null;
        this.init();
    }

    init() {
        // Récupérer le token depuis le localStorage
        this.token = localStorage.getItem('admin_token');
        const user = localStorage.getItem('admin_user');
        
        if (user && this.token) {
            this.currentUser = JSON.parse(user);
            
            // Rediriger vers le dashboard si on est sur la page de login
            if (window.location.pathname.includes('index.html') || 
                window.location.pathname.endsWith('/')) {
                window.location.href = 'dashboard.html';
            }
        } else {
            // Rediriger vers le login si non connecté
            if (!window.location.pathname.includes('index.html') && 
                !window.location.pathname.endsWith('/')) {
                window.location.href = 'index.html';
            }
        }
    }

    // Connexion avec l'API réelle
    async login(email, password) {
        try {
            const response = await fetch(`${this.API_URL}/auth/admin/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (data.status === 'success') {
                this.currentUser = data.data.user;
                this.token = data.data.token;

                // Sauvegarder dans le localStorage
                localStorage.setItem('admin_token', this.token);
                localStorage.setItem('admin_user', JSON.stringify(this.currentUser));

                // Rediriger vers le dashboard
                window.location.href = 'dashboard.html';

                return { success: true, message: 'Connexion réussie' };
            } else {
                return { 
                    success: false, 
                    message: data.message || 'Email ou mot de passe incorrect' 
                };
            }
        } catch (error) {
            console.error('Login error:', error);
            return { 
                success: false, 
                message: 'Erreur de connexion au serveur' 
            };
        }
    }

    // Déconnexion
    logout() {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        this.currentUser = null;
        this.token = null;
        window.location.href = 'index.html';
    }

    // Obtenir les headers avec token
    getAuthHeaders() {
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
        };
    }

    // Vérifier si l'utilisateur est connecté
    isAuthenticated() {
        return !!this.token && !!this.currentUser;
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
