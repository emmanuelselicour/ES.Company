// Configuration de l'API
const API_URL = 'https://es-company-api.onrender.com';
// Pour le développement local, décommentez la ligne ci-dessous
// const API_URL = 'http://localhost:5000';

// État global de l'application
let currentUser = null;
let products = [];
let currentLanguage = localStorage.getItem('language') || 'fr';

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'année dans le footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Charger les traductions
    loadTranslations();
    
    // Charger les produits
    loadProducts();
    
    // Initialiser le panier
    initCart();
    
    // Initialiser les écouteurs d'événements
    initEventListeners();
    
    // Vérifier si l'utilisateur est connecté
    checkAuthStatus();
});

// Charger les traductions
function loadTranslations() {
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
        languageSelect.addEventListener('change', function(e) {
            currentLanguage = e.target.value;
            localStorage.setItem('language', currentLanguage);
            updatePageLanguage();
        });
    }
    updatePageLanguage();
}

// Mettre à jour la langue de la page
function updatePageLanguage() {
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[currentLanguage] && translations[currentLanguage][key]) {
            if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                element.setAttribute('placeholder', translations[currentLanguage][key]);
            } else {
                element.textContent = translations[currentLanguage][key];
            }
        }
    });
}

// Traductions
const translations = {
    fr: {
        // Navigation
        home: "Accueil",
        products: "Produits",
        categories: "Catégories",
        about: "À propos",
        contact: "Contact",
        
        // Auth
        login: "Connexion",
        signup: "Inscription",
        email: "Email",
        password: "Mot de passe",
        confirm_password: "Confirmer le mot de passe",
        full_name: "Nom complet",
        email_placeholder: "votre@email.com",
        no_account: "Pas de compte ?",
        have_account: "Déjà un compte ?",
        signup_here: "Inscrivez-vous ici",
        login_here: "Connectez-vous ici",
        
        // Cart
        shopping_cart: "Panier d'achat",
        empty_cart: "Votre panier est vide",
        total: "Total",
        checkout: "Procéder au paiement",
        
        // Hero
        hero_title: "Découvrez la mode qui vous ressemble",
        hero_subtitle: "Robes, pantalons, jupes, chaussures et bijoux de qualité",
        shop_now: "Acheter maintenant",
        
        // Products
        featured_products: "Produits en vedette",
        featured_desc: "Découvrez notre sélection aléatoire de produits",
        refresh_products: "Mélanger les produits",
        loading_products: "Chargement des produits...",
        add_to_cart: "Ajouter au panier",
        view_details: "Voir détails",
        
        // Categories
        shop_categories: "Parcourir par catégorie",
        clothing: "Vêtements",
        clothing_desc: "Robes, pantalons, jupes",
        shoes: "Chaussures",
        shoes_desc: "Pour toutes les occasions",
        jewelry: "Bijoux",
        jewelry_desc: "Accessoires élégants",
        accessories: "Accessoires",
        accessories_desc: "Complétez votre look",
        
        // Footer
        footer_desc: "Votre destination shopping pour la mode et les accessoires de qualité.",
        quick_links: "Liens rapides",
        customer_service: "Service client",
        contact_info: "Informations de contact",
        address: "Port-au-Prince, Haïti",
        all_rights: "Tous droits réservés.",
        faq: "FAQ",
        shipping: "Livraison",
        returns: "Retours",
        privacy: "Politique de confidentialité",
        terms: "Conditions d'utilisation"
    },
    en: {
        home: "Home",
        products: "Products",
        categories: "Categories",
        about: "About",
        contact: "Contact",
        
        login: "Login",
        signup: "Sign Up",
        email: "Email",
        password: "Password",
        confirm_password: "Confirm Password",
        full_name: "Full Name",
        email_placeholder: "your@email.com",
        no_account: "Don't have an account?",
        have_account: "Already have an account?",
        signup_here: "Sign up here",
        login_here: "Login here",
        
        shopping_cart: "Shopping Cart",
        empty_cart: "Your cart is empty",
        total: "Total",
        checkout: "Checkout",
        
        hero_title: "Discover Fashion That Suits You",
        hero_subtitle: "Quality dresses, pants, skirts, shoes and jewelry",
        shop_now: "Shop Now",
        
        featured_products: "Featured Products",
        featured_desc: "Discover our random selection of products",
        refresh_products: "Shuffle Products",
        loading_products: "Loading products...",
        add_to_cart: "Add to Cart",
        view_details: "View Details",
        
        shop_categories: "Shop by Category",
        clothing: "Clothing",
        clothing_desc: "Dresses, pants, skirts",
        shoes: "Shoes",
        shoes_desc: "For all occasions",
        jewelry: "Jewelry",
        jewelry_desc: "Elegant accessories",
        accessories: "Accessories",
        accessories_desc: "Complete your look",
        
        footer_desc: "Your shopping destination for quality fashion and accessories.",
        quick_links: "Quick Links",
        customer_service: "Customer Service",
        contact_info: "Contact Information",
        address: "Port-au-Prince, Haiti",
        all_rights: "All rights reserved.",
        faq: "FAQ",
        shipping: "Shipping",
        returns: "Returns",
        privacy: "Privacy Policy",
        terms: "Terms of Service"
    },
    es: {
        home: "Inicio",
        products: "Productos",
        categories: "Categorías",
        about: "Acerca de",
        contact: "Contacto",
        
        login: "Iniciar Sesión",
        signup: "Registrarse",
        email: "Correo Electrónico",
        password: "Contraseña",
        confirm_password: "Confirmar Contraseña",
        full_name: "Nombre Completo",
        email_placeholder: "tu@email.com",
        no_account: "¿No tienes una cuenta?",
        have_account: "¿Ya tienes una cuenta?",
        signup_here: "Regístrate aquí",
        login_here: "Inicia sesión aquí",
        
        shopping_cart: "Carrito de Compras",
        empty_cart: "Tu carrito está vacío",
        total: "Total",
        checkout: "Pagar",
        
        hero_title: "Descubre la Moda que Te Sienta Bien",
        hero_subtitle: "Vestidos, pantalones, faldas, zapatos y joyas de calidad",
        shop_now: "Comprar Ahora",
        
        featured_products: "Productos Destacados",
        featured_desc: "Descubre nuestra selección aleatoria de productos",
        refresh_products: "Mezclar Productos",
        loading_products: "Cargando productos...",
        add_to_cart: "Añadir al Carrito",
        view_details: "Ver Detalles",
        
        shop_categories: "Comprar por Categoría",
        clothing: "Ropa",
        clothing_desc: "Vestidos, pantalones, faldas",
        shoes: "Zapatos",
        shoes_desc: "Para todas las ocasiones",
        jewelry: "Joyas",
        jewelry_desc: "Accesorios elegantes",
        accessories: "Accesorios",
        accessories_desc: "Completa tu look",
        
        footer_desc: "Tu destino de compras para moda y accesorios de calidad.",
        quick_links: "Enlaces Rápidos",
        customer_service: "Servicio al Cliente",
        contact_info: "Información de Contacto",
        address: "Puerto Príncipe, Haití",
        all_rights: "Todos los derechos reservados.",
        faq: "Preguntas Frecuentes",
        shipping: "Envío",
        returns: "Devoluciones",
        privacy: "Política de Privacidad",
        terms: "Términos de Servicio"
    }
};

// Charger les produits depuis l'API
async function loadProducts() {
    const productsContainer = document.getElementById('products-container');
    
    if (!productsContainer) return;
    
    try {
        const response = await fetch(`${API_URL}/api/products`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        products = await response.json();
        
        // Mélanger les produits aléatoirement
        shuffleProducts();
        
        // Afficher les produits
        displayProducts(products.slice(0, 8)); // Afficher seulement 8 produits
        
    } catch (error) {
        console.error('Error loading products:', error);
        
        // En cas d'erreur, afficher des produits de démo
        displayDemoProducts();
    }
}

// Mélanger les produits aléatoirement
function shuffleProducts() {
    for (let i = products.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [products[i], products[j]] = [products[j], products[i]];
    }
}

// Afficher les produits
function displayProducts(productsToDisplay) {
    const productsContainer = document.getElementById('products-container');
    
    if (!productsContainer) return;
    
    // Effacer le contenu actuel
    productsContainer.innerHTML = '';
    
    // Si aucun produit n'est disponible
    if (!productsToDisplay || productsToDisplay.length === 0) {
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <h3>Aucun produit disponible</h3>
                <p>Revenez bientôt pour découvrir nos nouveautés</p>
            </div>
        `;
        return;
    }
    
    // Afficher chaque produit
    productsToDisplay.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Créer une carte de produit
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    // Image par défaut si aucune image n'est fournie
    const imageUrl = product.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    
    // Prix formaté
    const price = product.price ? `€${parseFloat(product.price).toFixed(2)}` : '€0.00';
    
    // Traduction du bouton
    const addToCartText = translations[currentLanguage]?.add_to_cart || 'Add to Cart';
    const viewDetailsText = translations[currentLanguage]?.view_details || 'View Details';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-image">
        <div class="product-details">
            <h3 class="product-title">${product.name}</h3>
            <span class="product-category">${product.category || 'General'}</span>
            <p class="product-price">${price}</p>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart('${product.id}')">${addToCartText}</button>
                <button class="view-details" onclick="viewProductDetails('${product.id}')">${viewDetailsText}</button>
            </div>
        </div>
    `;
    
    return card;
}

// Afficher des produits de démo (en cas d'API indisponible)
function displayDemoProducts() {
    const demoProducts = [
        {
            id: '1',
            name: 'Robe Élégante',
            category: 'Robes',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '2',
            name: 'Jean Slim',
            category: 'Pantalons',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '3',
            name: 'Jupe Midi',
            category: 'Jupes',
            price: 34.99,
            image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '4',
            name: 'Chaussures de Ville',
            category: 'Chaussures',
            price: 59.99,
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '5',
            name: 'Collier Argent',
            category: 'Bijoux',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '6',
            name: 'Sac à Main',
            category: 'Accessoires',
            price: 45.99,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '7',
            name: 'Veste en Cuir',
            category: 'Vêtements',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '8',
            name: 'Bottes Classiques',
            category: 'Chaussures',
            price: 69.99,
            image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        }
    ];
    
    products = demoProducts;
    displayProducts(demoProducts);
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Bouton de rafraîchissement des produits
    const refreshBtn = document.getElementById('refresh-products');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            shuffleProducts();
            displayProducts(products.slice(0, 8));
            
            // Animation de feedback
            refreshBtn.innerHTML = '<i class="fas fa-check"></i> Produits mélangés!';
            refreshBtn.disabled = true;
            
            setTimeout(() => {
                refreshBtn.innerHTML = '<i class="fas fa-random"></i> Mélanger les produits';
                refreshBtn.disabled = false;
            }, 1500);
        });
    }
    
    // Menu utilisateur
    const userMenuBtn = document.getElementById('user-menu');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            if (currentUser) {
                // Afficher menu utilisateur connecté
                showUserMenu();
            } else {
                // Afficher modal de connexion
                showAuthModal();
            }
        });
    }
    
    // Modal d'authentification
    const authModal = document.getElementById('user-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const showSignupLink = document.getElementById('show-signup');
    const showLoginLink = document.getElementById('show-login');
    
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', function() {
            authModal.style.display = 'none';
        });
    }
    
    if (showSignupLink) {
        showSignupLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('login-form').classList.remove('active');
            document.getElementById('signup-form').classList.add('active');
        });
    }
    
    if (showLoginLink) {
        showLoginLink.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('signup-form').classList.remove('active');
            document.getElementById('login-form').classList.add('active');
        });
    }
    
    // Fermer le modal en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target === authModal) {
            authModal.style.display = 'none';
        }
    });
    
    // Formulaires de connexion et d'inscription
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', toggleMobileMenu);
    }
}

// Afficher le modal d'authentification
function showAuthModal() {
    const authModal = document.getElementById('user-modal');
    document.getElementById('login-form').classList.add('active');
    document.getElementById('signup-form').classList.remove('active');
    authModal.style.display = 'flex';
}

// Gérer la connexion
async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Validation simple
    if (!email || !password) {
        showAlert('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    try {
        // Dans une vraie application, on ferait une requête à l'API
        // Pour cette démo, on simule une connexion réussie
        const response = await mockLogin(email, password);
        
        if (response.success) {
            currentUser = response.user;
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            
            showAlert('Connexion réussie!', 'success');
            document.getElementById('user-modal').style.display = 'none';
            
            // Mettre à jour l'interface
            updateUserInterface();
            
            // Réinitialiser le formulaire
            document.getElementById('loginForm').reset();
        } else {
            showAlert('Email ou mot de passe incorrect', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('Une erreur est survenue. Veuillez réessayer.', 'error');
    }
}

// Gérer l'inscription
async function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirmPassword = document.getElementById('signup-confirm').value;
    
    // Validation
    if (!name || !email || !password || !confirmPassword) {
        showAlert('Veuillez remplir tous les champs', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Les mots de passe ne correspondent pas', 'error');
        return;
    }
    
    if (password.length < 6) {
        showAlert('Le mot de passe doit contenir au moins 6 caractères', 'error');
        return;
    }
    
    try {
        // Dans une vraie application, on ferait une requête à l'API
        // Pour cette démo, on simule une inscription réussie
        const response = await mockSignup(name, email, password);
        
        if (response.success) {
            currentUser = response.user;
            localStorage.setItem('user', JSON.stringify(response.user));
            localStorage.setItem('token', response.token);
            
            showAlert('Inscription réussie! Bienvenue sur E-S COMPANY!', 'success');
            document.getElementById('user-modal').style.display = 'none';
            
            // Mettre à jour l'interface
            updateUserInterface();
            
            // Réinitialiser le formulaire
            document.getElementById('signupForm').reset();
            
            // Retourner au formulaire de connexion
            document.getElementById('signup-form').classList.remove('active');
            document.getElementById('login-form').classList.add('active');
        } else {
            showAlert(response.message || 'Une erreur est survenue', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showAlert('Une erreur est survenue. Veuillez réessayer.', 'error');
    }
}

// Simuler une connexion (pour démo)
function mockLogin(email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Simulation simple - en réalité, on vérifierait avec l'API
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const user = users.find(u => u.email === email && u.password === password);
            
            if (user) {
                resolve({
                    success: true,
                    user: {
                        id: user.id,
                        name: user.name,
                        email: user.email
                    },
                    token: 'mock-jwt-token-' + Date.now()
                });
            } else {
                resolve({
                    success: false,
                    message: 'Email ou mot de passe incorrect'
                });
            }
        }, 1000);
    });
}

// Simuler une inscription (pour démo)
function mockSignup(name, email, password) {
    return new Promise((resolve) => {
        setTimeout(() => {
            // Vérifier si l'utilisateur existe déjà
            const users = JSON.parse(localStorage.getItem('users') || '[]');
            const userExists = users.some(u => u.email === email);
            
            if (userExists) {
                resolve({
                    success: false,
                    message: 'Cet email est déjà utilisé'
                });
                return;
            }
            
            // Créer un nouvel utilisateur
            const newUser = {
                id: 'user-' + Date.now(),
                name,
                email,
                password, // En réalité, on ne stockerait jamais le mot de passe en clair
                createdAt: new Date().toISOString()
            };
            
            // Ajouter à la "base de données"
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            
            resolve({
                success: true,
                user: {
                    id: newUser.id,
                    name: newUser.name,
                    email: newUser.email
                },
                token: 'mock-jwt-token-' + Date.now()
            });
        }, 1000);
    });
}

// Vérifier le statut d'authentification
function checkAuthStatus() {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userData && token) {
        try {
            currentUser = JSON.parse(userData);
            updateUserInterface();
        } catch (e) {
            console.error('Error parsing user data:', e);
        }
    }
}

// Mettre à jour l'interface utilisateur
function updateUserInterface() {
    const userMenuBtn = document.getElementById('user-menu');
    
    if (userMenuBtn && currentUser) {
        userMenuBtn.innerHTML = `<i class="fas fa-user-check"></i>`;
        userMenuBtn.title = currentUser.name;
    }
}

// Afficher le menu utilisateur
function showUserMenu() {
    // Créer un menu déroulant simple
    const existingMenu = document.querySelector('.user-dropdown');
    if (existingMenu) {
        existingMenu.remove();
        return;
    }
    
    const userMenuBtn = document.getElementById('user-menu');
    const rect = userMenuBtn.getBoundingClientRect();
    
    const dropdown = document.createElement('div');
    dropdown.className = 'user-dropdown';
    dropdown.style.cssText = `
        position: fixed;
        top: ${rect.bottom + 10}px;
        right: ${window.innerWidth - rect.right}px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 1000;
        min-width: 200px;
        padding: 10px 0;
    `;
    
    dropdown.innerHTML = `
        <div class="user-info" style="padding: 10px 15px; border-bottom: 1px solid #eee;">
            <p style="font-weight: 600; margin: 0;">${currentUser.name}</p>
            <p style="font-size: 0.9rem; color: #666; margin: 5px 0 0;">${currentUser.email}</p>
        </div>
        <a href="profile.html" style="display: block; padding: 10px 15px; text-decoration: none; color: #333; transition: background 0.2s;">
            <i class="fas fa-user" style="margin-right: 10px;"></i> Mon profil
        </a>
        <a href="orders.html" style="display: block; padding: 10px 15px; text-decoration: none; color: #333; transition: background 0.2s;">
            <i class="fas fa-shopping-bag" style="margin-right: 10px;"></i> Mes commandes
        </a>
        <div style="border-top: 1px solid #eee; margin: 10px 0;"></div>
        <button id="logout-btn" style="width: 100%; text-align: left; padding: 10px 15px; background: none; border: none; cursor: pointer; color: #e74c3c; transition: background 0.2s;">
            <i class="fas fa-sign-out-alt" style="margin-right: 10px;"></i> Déconnexion
        </button>
    `;
    
    document.body.appendChild(dropdown);
    
    // Gérer la déconnexion
    document.getElementById('logout-btn').addEventListener('click', handleLogout);
    
    // Fermer le menu en cliquant à l'extérieur
    setTimeout(() => {
        document.addEventListener('click', function closeMenu(e) {
            if (!dropdown.contains(e.target) && e.target !== userMenuBtn) {
                dropdown.remove();
                document.removeEventListener('click', closeMenu);
            }
        });
    }, 10);
}

// Gérer la déconnexion
function handleLogout() {
    currentUser = null;
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    // Mettre à jour l'interface
    const userMenuBtn = document.getElementById('user-menu');
    if (userMenuBtn) {
        userMenuBtn.innerHTML = `<i class="fas fa-user"></i>`;
        userMenuBtn.title = '';
    }
    
    // Fermer le menu
    const dropdown = document.querySelector('.user-dropdown');
    if (dropdown) {
        dropdown.remove();
    }
    
    showAlert('Déconnexion réussie', 'success');
}

// Basculer le menu mobile
function toggleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    navLinks.style.display = navLinks.style.display === 'flex' ? 'none' : 'flex';
    
    if (navLinks.style.display === 'flex') {
        navLinks.style.flexDirection = 'column';
        navLinks.style.position = 'absolute';
        navLinks.style.top = '100%';
        navLinks.style.left = '0';
        navLinks.style.right = '0';
        navLinks.style.backgroundColor = 'white';
        navLinks.style.padding = '20px';
        navLinks.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)';
        navLinks.style.gap = '15px';
    }
}

// Ajouter un produit au panier
function addToCart(productId) {
    // Trouver le produit
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    // Ajouter au panier (fonction définie dans cart.js)
    window.addToCart(product);
    
    // Afficher une notification
    showAlert(`${product.name} a été ajouté au panier`, 'success');
}

// Voir les détails d'un produit
function viewProductDetails(productId) {
    // Rediriger vers la page de détails du produit
    window.location.href = `product-details.html?id=${productId}`;
}

// Afficher une alerte
function showAlert(message, type = 'info') {
    // Supprimer les alertes existantes
    const existingAlerts = document.querySelectorAll('.alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Créer l'alerte
    const alert = document.createElement('div');
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Couleurs selon le type
    if (type === 'success') {
        alert.style.backgroundColor = '#27ae60';
    } else if (type === 'error') {
        alert.style.backgroundColor = '#e74c3c';
    } else if (type === 'warning') {
        alert.style.backgroundColor = '#f39c12';
    } else {
        alert.style.backgroundColor = '#3498db';
    }
    
    document.body.appendChild(alert);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 3000);
}

// Ajouter des styles d'animation pour les alertes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes fadeOut {
        from {
            opacity: 1;
        }
        to {
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
