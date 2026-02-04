// Gestion de la connexion admin

class AdminLogin {
    constructor() {
        this.apiUrl = 'https://es-company-api.onrender.com/api';
        this.init();
    }
    
    init() {
        // Vérifier si l'utilisateur est déjà connecté
        this.checkAlreadyLoggedIn();
        
        // Initialiser les événements
        this.initEvents();
    }
    
    checkAlreadyLoggedIn() {
        const token = localStorage.getItem('adminToken');
        if (token) {
            // Vérifier si le token est toujours valide
            fetch(`${this.apiUrl}/auth/verify`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success && data.user.role === 'admin') {
                    // Rediriger vers le dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    // Token invalide, nettoyer
                    localStorage.removeItem('adminToken');
                    localStorage.removeItem('adminUser');
                }
            })
            .catch(() => {
                // Erreur de connexion, nettoyer
                localStorage.removeItem('adminToken');
                localStorage.removeItem('adminUser');
            });
        }
    }
    
    initEvents() {
        // Toggle mot de passe
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        if (togglePassword && passwordInput) {
            togglePassword.addEventListener('click', () => {
                const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                passwordInput.setAttribute('type', type);
                
                togglePassword.innerHTML = type === 'password' ? 
                    '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
            });
        }
        
        // Soumission du formulaire
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.login();
            });
        }
    }
    
    showAlert(message, type = 'error') {
        const container = document.getElementById('alertContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
            ${message}
        `;
        
        container.appendChild(alert);
        
        // Auto-dismiss pour les succès
        if (type === 'success') {
            setTimeout(() => {
                alert.remove();
            }, 3000);
        }
    }
    
    async login() {
        const email = document.getElementById('email')?.value.trim();
        const password = document.getElementById('password')?.value;
        const loginBtn = document.getElementById('loginBtn');
        
        // Validation basique
        if (!email || !password) {
            this.showAlert('Veuillez remplir tous les champs');
            return;
        }
        
        // Désactiver le bouton
        if (loginBtn) {
            loginBtn.disabled = true;
            loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
        }
        
        try {
            console.log('Tentative de connexion avec:', email);
            
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            console.log('Réponse reçue, status:', response.status);
            
            const data = await response.json();
            console.log('Données de réponse:', data);
            
            if (data.success && data.user.role === 'admin') {
                // Stocker le token et les infos utilisateur
                localStorage.setItem('adminToken', data.token);
                localStorage.setItem('adminUser', JSON.stringify(data.user));
                
                this.showAlert('Connexion réussie ! Redirection...', 'success');
                
                // Rediriger après un court délai
                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 1500);
                
            } else {
                const errorMessage = data.error || 'Accès réservé aux administrateurs';
                this.showAlert(errorMessage);
                if (loginBtn) {
                    loginBtn.disabled = false;
                    loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
                }
            }
            
        } catch (error) {
            console.error('Erreur login:', error);
            this.showAlert('Erreur de connexion au serveur. Vérifiez que l\'API est en ligne.');
            if (loginBtn) {
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
            }
        }
    }
}

// Initialiser la connexion
document.addEventListener('DOMContentLoaded', () => {
    window.adminLogin = new AdminLogin();
});
