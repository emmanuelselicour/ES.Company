// Gestion de la page produits
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;
let currentView = 'grid'; // 'grid' ou 'list'

// Initialisation de la page produits
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser l'année dans le footer
    document.getElementById('current-year').textContent = new Date().getFullYear();
    
    // Charger les traductions
    if (typeof loadTranslations === 'function') {
        loadTranslations();
    }
    
    // Initialiser le panier
    if (typeof initCart === 'function') {
        initCart();
    }
    
    // Charger tous les produits
    loadAllProducts();
    
    // Initialiser les écouteurs d'événements
    initProductsEventListeners();
    
    // Vérifier si l'utilisateur est connecté
    if (typeof checkAuthStatus === 'function') {
        checkAuthStatus();
    }
});

// Charger tous les produits
async function loadAllProducts() {
    const productsContainer = document.getElementById('all-products-container');
    const productsList = document.getElementById('all-products-list');
    
    try {
        const response = await fetch(`${API_URL}/api/products`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        
        // Mélanger les produits aléatoirement
        shuffleArray(filteredProducts);
        
        // Afficher les produits
        updateProductsDisplay();
        updateProductsCount();
        updatePagination();
        
    } catch (error) {
        console.error('Error loading products:', error);
        
        // En cas d'erreur, afficher des produits de démo
        loadDemoProducts();
    }
}

// Charger des produits de démo
function loadDemoProducts() {
    allProducts = [
        {
            id: '1',
            name: 'Robe Élégante',
            description: 'Robe élégante pour occasions spéciales, en tissu léger et confortable.',
            category: 'clothing',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 15,
            createdAt: new Date().toISOString()
        },
        {
            id: '2',
            name: 'Jean Slim Noir',
            description: 'Jean slim noir élégant, parfait pour un look décontracté mais stylé.',
            category: 'clothing',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 22,
            createdAt: new Date().toISOString()
        },
        {
            id: '3',
            name: 'Jupe Midi Plissée',
            description: 'Jupe midi plissée en tissu fluide, disponible en plusieurs couleurs.',
            category: 'clothing',
            price: 34.99,
            image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 18,
            createdAt: new Date().toISOString()
        },
        {
            id: '4',
            name: 'Chaussures de Ville en Cuir',
            description: 'Chaussures de ville en cuir véritable, confortables et élégantes.',
            category: 'shoes',
            price: 59.99,
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 12,
            createdAt: new Date().toISOString()
        },
        {
            id: '5',
            name: 'Collier en Argent 925',
            description: 'Collier élégant en argent 925 avec pendentif design minimaliste.',
            category: 'jewelry',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 30,
            createdAt: new Date().toISOString()
        },
        {
            id: '6',
            name: 'Sac à Main en Cuir',
            description: 'Sac à main en cuir véritable, spacieux et élégant pour toutes occasions.',
            category: 'accessories',
            price: 45.99,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 8,
            createdAt: new Date().toISOString()
        },
        {
            id: '7',
            name: 'Veste en Cuir Moto',
            description: 'Veste en cuir style moto, parfaite pour un look rock et élégant.',
            category: 'clothing',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 10,
            createdAt: new Date().toISOString()
        },
        {
            id: '8',
            name: 'Bottes Classiques en Cuir',
            description: 'Bottes en cuir véritable, confortables et durables pour l\'hiver.',
            category: 'shoes',
            price: 69.99,
            image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 14,
            createdAt: new Date().toISOString()
        },
        {
            id: '9',
            name: 'Boucles d\'Oreilles Dorées',
            description: 'Boucles d\'oreilles en or jaune avec pierres cristallines.',
            category: 'jewelry',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 25,
            createdAt: new Date().toISOString()
        },
        {
            id: '10',
            name: 'Écharpe en Laine Mérinos',
            description: 'Écharpe chaleureuse en laine mérinos, parfaite pour l\'hiver.',
            category: 'accessories',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1576872381144-d6c6801d1c34?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 35,
            createdAt: new Date().toISOString()
        },
        {
            id: '11',
            name: 'Pull en Cachemire',
            description: 'Pull doux et chaud en cachemire, disponible en plusieurs coloris.',
            category: 'clothing',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 7,
            createdAt: new Date().toISOString()
        },
        {
            id: '12',
            name: 'Baskets Sport',
            description: 'Baskets confortables pour le sport ou la détente, plusieurs coloris disponibles.',
            category: 'shoes',
            price: 44.99,
            image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 20,
            createdAt: new Date().toISOString()
        }
    ];
    
    filteredProducts = [...allProducts];
    shuffleArray(filteredProducts);
    updateProductsDisplay();
    updateProductsCount();
    updatePagination();
}

// Initialiser les écouteurs d'événements
function initProductsEventListeners() {
    // Filtres
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const priceRangeFilter = document.getElementById('price-range');
    const productSearch = document.getElementById('product-search');
    const searchButton = document.getElementById('search-button');
    const clearFiltersBtn = document.getElementById('clear-filters');
    
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    if (priceRangeFilter) {
        priceRangeFilter.addEventListener('change', applyFilters);
    }
    
    if (productSearch) {
        productSearch.addEventListener('input', function() {
            // Recherche en temps réel après un délai
            clearTimeout(this.searchTimeout);
            this.searchTimeout = setTimeout(applyFilters, 300);
        });
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', applyFilters);
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', clearAllFilters);
    }
    
    // Options d'affichage
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    
    if (gridViewBtn) {
        gridViewBtn.addEventListener('click', function() {
            setViewMode('grid');
        });
    }
    
    if (listViewBtn) {
        listViewBtn.addEventListener('click', function() {
            setViewMode('list');
        });
    }
    
    // Pagination
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', goToPrevPage);
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', goToNextPage);
    }
    
    // Newsletter
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            subscribeToNewsletter(email);
        });
    }
}

// Appliquer les filtres
function applyFilters() {
    const category = document.getElementById('category-filter').value;
    const sortBy = document.getElementById('sort-filter').value;
    const priceRange = document.getElementById('price-range').value;
    const searchQuery = document.getElementById('product-search').value.toLowerCase();
    
    // Filtrer les produits
    filteredProducts = allProducts.filter(product => {
        let matches = true;
        
        // Filtre par catégorie
        if (category && product.category !== category) {
            matches = false;
        }
        
        // Filtre par fourchette de prix
        if (priceRange && matches) {
            const [min, max] = priceRange.split('-').map(Number);
            if (product.price < min || product.price > max) {
                matches = false;
            }
        }
        
        // Filtre par recherche
        if (searchQuery && matches) {
            const searchIn = `${product.name} ${product.description} ${product.category}`.toLowerCase();
            if (!searchIn.includes(searchQuery)) {
                matches = false;
            }
        }
        
        return matches;
    });
    
    // Trier les produits
    sortProducts(sortBy);
    
    // Réinitialiser à la première page
    currentPage = 1;
    
    // Mettre à jour l'affichage
    updateProductsDisplay();
    updateProductsCount();
    updatePagination();
    updateActiveFilters(category, priceRange, searchQuery);
}

// Trier les produits
function sortProducts(sortBy) {
    switch(sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'newest':
            filteredProducts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            break;
        case 'random':
        default:
            shuffleArray(filteredProducts);
            break;
    }
}

// Mélanger un tableau aléatoirement
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Effacer tous les filtres
function clearAllFilters() {
    document.getElementById('category-filter').value = '';
    document.getElementById('sort-filter').value = 'random';
    document.getElementById('price-range').value = '';
    document.getElementById('product-search').value = '';
    
    filteredProducts = [...allProducts];
    shuffleArray(filteredProducts);
    currentPage = 1;
    
    updateProductsDisplay();
    updateProductsCount();
    updatePagination();
    updateActiveFilters('', '', '');
}

// Mettre à jour les filtres actifs
function updateActiveFilters(category, priceRange, searchQuery) {
    const activeFiltersContainer = document.getElementById('active-filters');
    activeFiltersContainer.innerHTML = '';
    
    if (category) {
        const categoryNames = {
            'clothing': 'Vêtements',
            'shoes': 'Chaussures',
            'jewelry': 'Bijoux',
            'accessories': 'Accessoires'
        };
        
        const filterElement = document.createElement('div');
        filterElement.className = 'active-filter';
        filterElement.innerHTML = `
            <span>Catégorie: ${categoryNames[category] || category}</span>
            <button class="remove-filter" data-filter="category">&times;</button>
        `;
        activeFiltersContainer.appendChild(filterElement);
    }
    
    if (priceRange) {
        const [min, max] = priceRange.split('-');
        const filterElement = document.createElement('div');
        filterElement.className = 'active-filter';
        filterElement.innerHTML = `
            <span>Prix: ${min}€ - ${max}€</span>
            <button class="remove-filter" data-filter="price">&times;</button>
        `;
        activeFiltersContainer.appendChild(filterElement);
    }
    
    if (searchQuery) {
        const filterElement = document.createElement('div');
        filterElement.className = 'active-filter';
        filterElement.innerHTML = `
            <span>Recherche: "${searchQuery}"</span>
            <button class="remove-filter" data-filter="search">&times;</button>
        `;
        activeFiltersContainer.appendChild(filterElement);
    }
    
    // Ajouter des écouteurs aux boutons de suppression
    document.querySelectorAll('.remove-filter').forEach(button => {
        button.addEventListener('click', function() {
            const filterType = this.getAttribute('data-filter');
            removeFilter(filterType);
        });
    });
}

// Supprimer un filtre spécifique
function removeFilter(filterType) {
    switch(filterType) {
        case 'category':
            document.getElementById('category-filter').value = '';
            break;
        case 'price':
            document.getElementById('price-range').value = '';
            break;
        case 'search':
            document.getElementById('product-search').value = '';
            break;
    }
    
    applyFilters();
}

// Définir le mode d'affichage
function setViewMode(mode) {
    currentView = mode;
    
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const gridContainer = document.getElementById('all-products-container');
    const listContainer = document.getElementById('all-products-list');
    
    if (mode === 'grid') {
        gridViewBtn.classList.add('active');
        listViewBtn.classList.remove('active');
        gridContainer.style.display = 'grid';
        listContainer.style.display = 'none';
    } else {
        gridViewBtn.classList.remove('active');
        listViewBtn.classList.add('active');
        gridContainer.style.display = 'none';
        listContainer.style.display = 'block';
    }
    
    // Régénérer l'affichage selon le mode
    updateProductsDisplay();
}

// Mettre à jour l'affichage des produits
function updateProductsDisplay() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    
    if (currentView === 'grid') {
        displayProductsGrid(currentProducts);
    } else {
        displayProductsList(currentProducts);
    }
}

// Afficher les produits en grille
function displayProductsGrid(products) {
    const container = document.getElementById('all-products-container');
    
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3 data-translate="no_products_found">Aucun produit trouvé</h3>
                <p data-translate="no_products_desc">Essayez de modifier vos critères de recherche ou consultez nos autres catégories</p>
                <button class="btn btn-primary" onclick="clearAllFilters()" data-translate="clear_filters">Effacer les filtres</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Afficher les produits en liste
function displayProductsList(products) {
    const container = document.getElementById('all-products-list');
    
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3 data-translate="no_products_found">Aucun produit trouvé</h3>
                <p data-translate="no_products_desc">Essayez de modifier vos critères de recherche ou consultez nos autres catégories</p>
                <button class="btn btn-primary" onclick="clearAllFilters()" data-translate="clear_filters">Effacer les filtres</button>
            </div>
        `;
        return;
    }
    
    container.innerHTML = '';
    
    products.forEach(product => {
        const productItem = createProductListItem(product);
        container.appendChild(productItem);
    });
}

// Créer une carte produit (grille)
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    const imageUrl = product.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    const price = product.price ? `€${parseFloat(product.price).toFixed(2)}` : '€0.00';
    
    // Traductions
    const addToCartText = translations[currentLanguage]?.add_to_cart || 'Add to Cart';
    const viewDetailsText = translations[currentLanguage]?.view_details || 'View Details';
    const categoryNames = {
        'clothing': translations[currentLanguage]?.clothing || 'Clothing',
        'shoes': translations[currentLanguage]?.shoes || 'Shoes',
        'jewelry': translations[currentLanguage]?.jewelry || 'Jewelry',
        'accessories': translations[currentLanguage]?.accessories || 'Accessories'
    };
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-image">
        <div class="product-details">
            <h3 class="product-title">${product.name}</h3>
            <span class="product-category">${categoryNames[product.category] || product.category}</span>
            <p class="product-price">${price}</p>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart('${product.id}')">${addToCartText}</button>
                <button class="view-details" onclick="viewProductDetails('${product.id}')">${viewDetailsText}</button>
            </div>
        </div>
    `;
    
    return card;
}

// Créer un élément produit (liste)
function createProductListItem(product) {
    const item = document.createElement('div');
    item.className = 'product-list-item';
    item.dataset.id = product.id;
    
    const imageUrl = product.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    const price = product.price ? `€${parseFloat(product.price).toFixed(2)}` : '€0.00';
    
    // Traductions
    const addToCartText = translations[currentLanguage]?.add_to_cart || 'Add to Cart';
    const viewDetailsText = translations[currentLanguage]?.view_details || 'View Details';
    const categoryNames = {
        'clothing': translations[currentLanguage]?.clothing || 'Clothing',
        'shoes': translations[currentLanguage]?.shoes || 'Shoes',
        'jewelry': translations[currentLanguage]?.jewelry || 'Jewelry',
        'accessories': translations[currentLanguage]?.accessories || 'Accessories'
    };
    
    item.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="list-image">
        <div class="list-details">
            <h3 class="list-title">${product.name}</h3>
            <span class="list-category">${categoryNames[product.category] || product.category}</span>
            <p class="list-description">${product.description || 'Aucune description disponible'}</p>
            <div class="list-bottom">
                <span class="list-price">${price}</span>
                <div class="list-actions">
                    <button class="add-to-cart" onclick="addToCart('${product.id}')">${addToCartText}</button>
                    <button class="view-details" onclick="viewProductDetails('${product.id}')">${viewDetailsText}</button>
                </div>
            </div>
        </div>
    `;
    
    return item;
}

// Mettre à jour le compteur de produits
function updateProductsCount() {
    const countElement = document.getElementById('products-count');
    if (countElement) {
        const total = filteredProducts.length;
        const showing = Math.min(productsPerPage, total);
        
        if (total === 0) {
            countElement.textContent = translations[currentLanguage]?.no_products_found || 'Aucun produit trouvé';
        } else {
            const showingText = translations[currentLanguage]?.showing || 'Affichage de';
            const ofText = translations[currentLanguage]?.of || 'sur';
            const productsText = translations[currentLanguage]?.products || 'produits';
            
            countElement.textContent = `${showingText} ${showing} ${ofText} ${total} ${productsText}`;
        }
    }
}

// Mettre à jour la pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const currentPageSpan = document.getElementById('current-page');
    const totalPagesSpan = document.getElementById('total-pages');
    
    if (currentPageSpan) currentPageSpan.textContent = currentPage;
    if (totalPagesSpan) totalPagesSpan.textContent = totalPages;
    
    if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    }
}

// Aller à la page précédente
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        updateProductsDisplay();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Aller à la page suivante
function goToNextPage() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        updateProductsDisplay();
        updatePagination();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Voir les détails d'un produit
function viewProductDetails(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// S'abonner à la newsletter
function subscribeToNewsletter(email) {
    if (!email || !email.includes('@')) {
        showAlert('Veuillez entrer une adresse email valide', 'error');
        return;
    }
    
    // Simuler l'envoi à l'API
    setTimeout(() => {
        // Sauvegarder dans le localStorage pour la démo
        let subscribers = JSON.parse(localStorage.getItem('newsletter_subscribers') || '[]');
        if (!subscribers.includes(email)) {
            subscribers.push(email);
            localStorage.setItem('newsletter_subscribers', JSON.stringify(subscribers));
        }
        
        showAlert('Merci pour votre inscription à notre newsletter!', 'success');
        
        // Réinitialiser le formulaire
        const newsletterForm = document.getElementById('newsletter-form');
        if (newsletterForm) {
            newsletterForm.reset();
        }
    }, 1000);
}

// Ajouter des traductions supplémentaires
const additionalTranslations = {
    fr: {
        all_products: "Tous les produits",
        all_products_desc: "Découvrez notre collection complète",
        category: "Catégorie",
        sort_by: "Trier par",
        price_range: "Fourchette de prix",
        search_placeholder: "Rechercher un produit...",
        clear_filters: "Effacer les filtres",
        previous: "Précédent",
        next: "Suivant",
        of: "sur",
        pages: "pages",
        showing: "Affichage de",
        products: "produits",
        no_products_found: "Aucun produit trouvé",
        no_products_desc: "Essayez de modifier vos critères de recherche",
        newsletter_title: "Restez informé",
        newsletter_desc: "Inscrivez-vous à notre newsletter",
        subscribe: "S'abonner",
        random: "Aléatoire",
        "price-low": "Prix: croissant",
        "price-high": "Prix: décroissant",
        newest: "Plus récents"
    },
    en: {
        all_products: "All Products",
        all_products_desc: "Discover our complete collection",
        category: "Category",
        sort_by: "Sort by",
        price_range: "Price range",
        search_placeholder: "Search for a product...",
        clear_filters: "Clear filters",
        previous: "Previous",
        next: "Next",
        of: "of",
        pages: "pages",
        showing: "Showing",
        products: "products",
        no_products_found: "No products found",
        no_products_desc: "Try modifying your search criteria",
        newsletter_title: "Stay informed",
        newsletter_desc: "Subscribe to our newsletter",
        subscribe: "Subscribe",
        random: "Random",
        "price-low": "Price: low to high",
        "price-high": "Price: high to low",
        newest: "Newest"
    },
    es: {
        all_products: "Todos los productos",
        all_products_desc: "Descubre nuestra colección completa",
        category: "Categoría",
        sort_by: "Ordenar por",
        price_range: "Rango de precios",
        search_placeholder: "Buscar un producto...",
        clear_filters: "Limpiar filtros",
        previous: "Anterior",
        next: "Siguiente",
        of: "de",
        pages: "páginas",
        showing: "Mostrando",
        products: "productos",
        no_products_found: "No se encontraron productos",
        no_products_desc: "Intenta modificar tus criterios de búsqueda",
        newsletter_title: "Mantente informado",
        newsletter_desc: "Suscríbete a nuestro boletín",
        subscribe: "Suscribirse",
        random: "Aleatorio",
        "price-low": "Precio: bajo a alto",
        "price-high": "Precio: alto a bajo",
        newest: "Más recientes"
    }
};

// Fusionner les traductions supplémentaires
for (const lang in additionalTranslations) {
    if (translations[lang]) {
        Object.assign(translations[lang], additionalTranslations[lang]);
    } else {
        translations[lang] = additionalTranslations[lang];
    }
}
