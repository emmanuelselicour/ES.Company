// auth.js - Gestion de l'authentification pour le panel admin

const API_URL = 'https://es-company-api.onrender.com'; // Remplacez par votre URL Render

// Fonction de connexion
async function loginAdmin(email, password) {
    try {
        const response = await fetch(`${API_URL}/api/auth/admin/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Sauvegarder le token et les informations utilisateur
            localStorage.setItem('admin_token', data.data.token);
            localStorage.setItem('admin_user', JSON.stringify(data.data.user));
            
            return { success: true, data: data.data };
        } else {
            return { 
                success: false, 
                message: data.message || 'Erreur de connexion' 
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

// Vérifier si l'utilisateur est connecté
function isAuthenticated() {
    const token = localStorage.getItem('admin_token');
    const user = localStorage.getItem('admin_user');
    
    return !!(token && user);
}

// Obtenir le token d'authentification
function getAuthToken() {
    return localStorage.getItem('admin_token');
}

// Obtenir les informations de l'utilisateur
function getUserInfo() {
    const userStr = localStorage.getItem('admin_user');
    return userStr ? JSON.parse(userStr) : null;
}

// Déconnexion
function logout() {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    window.location.href = 'index.html';
}

// Vérifier et rediriger si non authentifié
function checkAuthAndRedirect() {
    if (!isAuthenticated()) {
        window.location.href = 'index.html';
    }
}

// Vérifier l'authentification au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
    // Si on est sur la page de login, ne pas rediriger
    if (window.location.pathname.includes('index.html') || 
        window.location.pathname.endsWith('/')) {
        return;
    }
    
    checkAuthAndRedirect();
});

// Exporter les fonctions
window.auth = {
    loginAdmin,
    isAuthenticated,
    getAuthToken,
    getUserInfo,
    logout,
    checkAuthAndRedirect
};
