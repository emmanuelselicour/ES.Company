// Gestion de la page produits
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'année dans le footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Charger les traductions
    loadTranslations();
    
    // Initialiser le panier
    initCart();
    
    // Charger tous les produits
    loadAllProducts();
    
    // Initialiser les filtres
    initFilters();
    
    // Initialiser la pagination
    initPagination();
    
    // Vérifier si l'utilisateur est connecté
    checkAuthStatus();
    
    // Initialiser les écouteurs d'événements
    initEventListeners();
});

// Variables de pagination
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;

// Charger tous les produits
async function loadAllProducts() {
    const productsContainer = document.getElementById('all-products-container');
    
    try {
        const response = await fetch(`${API_URL}/api/products`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        // Mélanger les produits aléatoirement
        shuffleProducts();
        
        // Afficher la première page
        displayProductsPage(1);
        
    } catch (error) {
        console.error('Error loading products:', error);
        
        // En cas d'erreur, afficher des produits de démo
        displayDemoProducts();
    }
}

// Mélanger les produits aléatoirement
function shuffleProducts() {
    for (let i = filteredProducts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [filteredProducts[i], filteredProducts[j]] = [filteredProducts[j], filteredProducts[i]];
    }
}

// Afficher les produits de démo
function displayDemoProducts() {
    allProducts = [
        {
            id: '1',
            name: 'Robe Élégante',
            description: 'Robe élégante pour occasions spéciales',
            category: 'clothing',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '2',
            name: 'Jean Slim',
            description: 'Jean slim moderne et confortable',
            category: 'clothing',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '3',
            name: 'Jupe Midi',
            description: 'Jupe midi tendance et polyvalente',
            category: 'clothing',
            price: 34.99,
            image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '4',
            name: 'Chaussures de Ville',
            description: 'Chaussures élégantes pour le bureau',
            category: 'shoes',
            price: 59.99,
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '5',
            name: 'Collier Argent',
            description: 'Collier en argent avec pendentif',
            category: 'jewelry',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '6',
            name: 'Sac à Main',
            description: 'Sac à main moderne et spacieux',
            category: 'accessories',
            price: 45.99,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '7',
            name: 'Veste en Cuir',
            description: 'Veste en cuir véritable',
            category: 'clothing',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '8',
            name: 'Bottes Classiques',
            description: 'Bottes classiques en cuir',
            category: 'shoes',
            price: 69.99,
            image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '9',
            name: 'Boucles d\'Oreilles',
            description: 'Boucles d\'oreilles dorées',
            category: 'jewelry',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '10',
            name: 'Ceinture en Cuir',
            description: 'Ceinture en cuir véritable',
            category: 'accessories',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '11',
            name: 'Pull en Laine',
            description: 'Pull chaud et confortable',
            category: 'clothing',
            price: 44.99,
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '12',
            name: 'Sandales Été',
            description: 'Sandales légères pour l\'été',
            category: 'shoes',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1560343090-f0409e92791a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '13',
            name: 'Bracelet Perles',
            description: 'Bracelet élégant avec perles',
            category: 'jewelry',
            price: 22.99,
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '14',
            name: 'Lunettes de Soleil',
            description: 'Lunettes de soleil stylées',
            category: 'accessories',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '15',
            name: 'Chemise Blanche',
            description: 'Chemise blanche classique',
            category: 'clothing',
            price: 32.99,
            image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '16',
            name: 'Baskets Sport',
            description: 'Baskets confortables pour le sport',
            category: 'shoes',
            price: 54.99,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        }
    ];
    
    filteredProducts = [...allProducts];
    shuffleProducts();
    displayProductsPage(1);
}

// Initialiser les filtres
function initFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('product-search');
    const searchButton = document.querySelector('.search-box button');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
}

// Appliquer les filtres
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('product-search');
    
    let results = [...allProducts];
    
    // Filtre par catégorie
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    if (selectedCategory) {
        results = results.filter(product => product.category === selectedCategory);
    }
    
    // Filtre par recherche
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchTerm) {
        results = results.filter(product => 
            product.name.toLowerCase().includes(searchTerm) || 
            product.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Trier les résultats
    const sortOption = sortFilter ? sortFilter.value : 'random';
    switch(sortOption) {
        case 'price-low':
            results.sort((a, b) => (a.price || 0) - (b.price || 0));
            break;
        case 'price-high':
            results.sort((a, b) => (b.price || 0) - (a.price || 0));
            break;
        case 'name':
            results.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'random':
            shuffleArray(results);
            break;
    }
    
    filteredProducts = results;
    currentPage = 1;
    displayProductsPage(currentPage);
}

// Mélanger un tableau aléatoirement
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialiser la pagination
function initPagination() {
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    
    if (prevButton) {
        prevButton.addEventListener('click', function() {
            if (currentPage > 1) {
                currentPage--;
                displayProductsPage(currentPage);
            }
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', function() {
            const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
                displayProductsPage(currentPage);
            }
        });
    }
}

// Afficher une page de produits
function displayProductsPage(page) {
    const productsContainer = document.getElementById('all-products-container');
    const prevButton = document.getElementById('prev-page');
    const nextButton = document.getElementById('next-page');
    const pageInfo = document.getElementById('page-info');
    
    if (!productsContainer) return;
    
    // Calculer les indices de début et fin
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    // Calculer le nombre total de pages
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    // Mettre à jour la pagination
    if (prevButton) {
        prevButton.disabled = page === 1;
    }
    
    if (nextButton) {
        nextButton.disabled = page === totalPages;
    }
    
    if (pageInfo) {
        const pageText = translations[currentLanguage]?.page || 'Page';
        const ofText = translations[currentLanguage]?.of || 'sur';
        pageInfo.textContent = `${pageText} ${page} ${ofText} ${totalPages}`;
    }
    
    // Effacer le contenu actuel
    productsContainer.innerHTML = '';
    
    // Si aucun produit n'est disponible
    if (pageProducts.length === 0) {
        const noProductsText = translations[currentLanguage]?.no_products || 'Aucun produit trouvé';
        const tryAgainText = translations[currentLanguage]?.try_again || 'Essayez de modifier vos critères de recherche';
        
        productsContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>${noProductsText}</h3>
                <p>${tryAgainText}</p>
            </div>
        `;
        return;
    }
    
    // Afficher chaque produit
    pageProducts.forEach(product => {
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

// Ajouter des traductions supplémentaires
const additionalTranslations = {
    fr: {
        all_products: "Tous les produits",
        all_products_desc: "Découvrez notre collection complète",
        all_categories: "Toutes catégories",
        sort_random: "Aléatoire",
        sort_price_low: "Prix: croissant",
        sort_price_high: "Prix: décroissant",
        sort_name: "Nom: A-Z",
        search_placeholder: "Rechercher un produit...",
        prev: "Précédent",
        next: "Suivant",
        page: "Page",
        of: "sur",
        no_products: "Aucun produit trouvé",
        try_again: "Essayez de modifier vos critères de recherche"
    },
    en: {
        all_products: "All Products",
        all_products_desc: "Discover our complete collection",
        all_categories: "All Categories",
        sort_random: "Random",
        sort_price_low: "Price: Low to High",
        sort_price_high: "Price: High to Low",
        sort_name: "Name: A-Z",
        search_placeholder: "Search for a product...",
        prev: "Previous",
        next: "Next",
        page: "Page",
        of: "of",
        no_products: "No products found",
        try_again: "Try adjusting your search criteria"
    },
    es: {
        all_products: "Todos los Productos",
        all_products_desc: "Descubre nuestra colección completa",
        all_categories: "Todas las Categorías",
        sort_random: "Aleatorio",
        sort_price_low: "Precio: Bajo a Alto",
        sort_price_high: "Precio: Alto a Bajo",
        sort_name: "Nombre: A-Z",
        search_placeholder: "Buscar un producto...",
        prev: "Anterior",
        next: "Siguiente",
        page: "Página",
        of: "de",
        no_products: "No se encontraron productos",
        try_again: "Intente ajustar sus criterios de búsqueda"
    }
};

// Fusionner les traductions supplémentaires
for (const lang in additionalTranslations) {
    if (translations[lang]) {
        translations[lang] = { ...translations[lang], ...additionalTranslations[lang] };
    }
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Menu utilisateur
    const userMenuBtn = document.getElementById('user-menu');
    if (userMenuBtn) {
        userMenuBtn.addEventListener('click', function() {
            if (currentUser) {
                showUserMenu();
            } else {
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

// Exposer les fonctions au scope global
window.addToCart = addToCart;
window.viewProductDetails = function(productId) {
    window.location.href = `product-details.html?id=${productId}`;
};
