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
            // Rediriger vers le dashboard
            window.location.href = 'dashboard.html';
        }
    }
    
    initEvents() {
        // Toggle mot de passe
        const togglePassword = document.getElementById('togglePassword');
        const passwordInput = document.getElementById('password');
        
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            togglePassword.innerHTML = type === 'password' ? 
                '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
        
        // Soumission du formulaire
        document.getElementById('loginForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.login();
        });
    }
    
    showAlert(message, type = 'error') {
        const container = document.getElementById('alertContainer');
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
            ${message}
        `;
        
        container.innerHTML = '';
        container.appendChild(alert);
        
        // Auto-dismiss pour les succès
        if (type === 'success') {
            setTimeout(() => {
                alert.remove();
            }, 3000);
        }
    }
    
    async login() {
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const loginBtn = document.getElementById('loginBtn');
        
        // Validation basique
        if (!email || !password) {
            this.showAlert('Veuillez remplir tous les champs');
            return;
        }
        
        // Désactiver le bouton
        loginBtn.disabled = true;
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connexion...';
        
        try {
            const response = await fetch(`${this.apiUrl}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            const data = await response.json();
            
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
                this.showAlert(data.error || 'Accès réservé aux administrateurs');
                loginBtn.disabled = false;
                loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
            }
            
        } catch (error) {
            console.error('Erreur login:', error);
            this.showAlert('Erreur de connexion au serveur');
            loginBtn.disabled = false;
            loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Se connecter';
        }
    }
}

// Initialiser la connexion
document.addEventListener('DOMContentLoaded', () => {
    window.adminLogin = new AdminLogin();
});
