// Gestion de l'authentification pour le panel admin

class AdminAuth {
    constructor() {
        this.apiUrl = 'https://es-company-api.onrender.com/api';
        this.token = localStorage.getItem('adminToken');
        this.user = JSON.parse(localStorage.getItem('adminUser')) || null;
        
        this.init();
    }
    
    init() {
        // Vérifier l'authentification au chargement
        this.checkAuth();
        
        // Gérer la déconnexion
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.logout());
        }
        
        // Afficher les infos utilisateur
        this.displayUserInfo();
    }
    
    async checkAuth() {
        // Si pas de token, rediriger vers la page de login
        if (!this.token && !window.location.href.includes('login.html')) {
            window.location.href = 'login.html';
            return;
        }
        
        // Si token, vérifier sa validité
        if (this.token && !window.location.href.includes('login.html')) {
            try {
                const response = await fetch(`${this.apiUrl}/auth/verify`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${this.token}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (!data.valid) {
                    this.logout();
                } else {
                    // Mettre à jour les infos utilisateur
                    this.user = data.user;
                    localStorage.setItem('adminUser', JSON.stringify(data.user));
                }
            } catch (error) {
                console.error('Erreur vérification token:', error);
                this.logout();
            }
        }
    }
    
    displayUserInfo() {
        const adminEmail = document.getElementById('adminEmail');
        if (adminEmail && this.user) {
            adminEmail.textContent = this.user.email;
        }
    }
    
    async login(email, password) {
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
            if (data.success) {
                this.token = data.token;
                this.user = data.user;
                
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                
                return { success: true };
            } else {
                return { success: false, error: data.error || 'Erreur de connexion' };
            }
        } catch (error) {
            console.error('Erreur login:', error);
            return { success: false, error: 'Erreur de connexion au serveur' };
        }
    }
    
    logout() {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        this.token = null;
        this.user = null;
        
        window.location.href = 'login.html';
    }
    
    getAuthHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Content-Type': 'application/json'
        };
    }
    
    async fetchWithAuth(url, options = {}) {
        options.headers = {
            ...options.headers,
            ...this.getAuthHeaders()
        };
        
        const response = await fetch(`${this.apiUrl}${url}`, options);
        
        // Si non autorisé, déconnecter
        if (response.status === 401) {
            this.logout();
            throw new Error('Non autorisé');
        }
        
        return response;
    }
}

// Initialiser l'authentification
window.adminAuth = new AdminAuth();
