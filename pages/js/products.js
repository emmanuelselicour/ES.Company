// Gestion de la page produits
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 12;
let currentView = 'grid';

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Charger les produits
    loadAllProducts();
    
    // Initialiser les écouteurs d'événements
    initProductsEventListeners();
});

// Charger tous les produits
async function loadAllProducts() {
    const productsContainer = document.getElementById('all-products-container');
    const productsList = document.getElementById('all-products-list');
    
    if (!productsContainer) return;
    
    try {
        const response = await fetch(`${API_URL}/api/products`);
        
        if (response.ok) {
            allProducts = await response.json();
        } else {
            // Fallback à des produits de démo
            allProducts = getDemoProducts();
        }
    } catch (error) {
        console.error('Error loading products:', error);
        allProducts = getDemoProducts();
    }
    
    // Initialiser les produits filtrés
    filteredProducts = [...allProducts];
    
    // Mélanger les produits
    shuffleArray(filteredProducts);
    
    // Afficher les produits
    renderProducts();
}

// Obtenir des produits de démo
function getDemoProducts() {
    return [
        {
            id: '1',
            name: 'Robe Élégante',
            description: 'Robe élégante pour toutes occasions',
            category: 'clothing',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 10
        },
        {
            id: '2',
            name: 'Jean Slim',
            description: 'Jean slim décontracté',
            category: 'clothing',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 15
        },
        {
            id: '3',
            name: 'Jupe Midi',
            description: 'Jupe midi élégante',
            category: 'clothing',
            price: 34.99,
            image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 8
        },
        {
            id: '4',
            name: 'Chaussures de Ville',
            description: 'Chaussures élégantes pour le bureau',
            category: 'shoes',
            price: 59.99,
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 12
        },
        {
            id: '5',
            name: 'Collier Argent',
            description: 'Collier en argent sterling',
            category: 'jewelry',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 20
        },
        {
            id: '6',
            name: 'Sac à Main',
            description: 'Sac à main en cuir véritable',
            category: 'accessories',
            price: 45.99,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 6
        },
        {
            id: '7',
            name: 'Veste en Cuir',
            description: 'Veste en cuir véritable',
            category: 'clothing',
            price: 79.99,
            image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 5
        },
        {
            id: '8',
            name: 'Bottes Classiques',
            description: 'Bottes en cuir pour l\'hiver',
            category: 'shoes',
            price: 69.99,
            image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 9
        },
        {
            id: '9',
            name: 'Boucles d\'Oreilles',
            description: 'Boucles d\'oreilles en or',
            category: 'jewelry',
            price: 29.99,
            image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 18
        },
        {
            id: '10',
            name: 'Ceinture en Cuir',
            description: 'Ceinture en cuir véritable',
            category: 'accessories',
            price: 19.99,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 14
        },
        {
            id: '11',
            name: 'Pull en Laine',
            description: 'Pull chaud en laine',
            category: 'clothing',
            price: 44.99,
            image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 11
        },
        {
            id: '12',
            name: 'Sandales Été',
            description: 'Sandales confortables pour l\'été',
            category: 'shoes',
            price: 32.99,
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 7
        },
        {
            id: '13',
            name: 'Bracelet Perles',
            description: 'Bracelet élégant avec perles',
            category: 'jewelry',
            price: 18.99,
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 22
        },
        {
            id: '14',
            name: 'Écharpe en Soie',
            description: 'Écharpe légère en soie',
            category: 'accessories',
            price: 22.99,
            image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 16
        },
        {
            id: '15',
            name: 'Costume Homme',
            description: 'Costume élégant pour homme',
            category: 'clothing',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 4
        },
        {
            id: '16',
            name: 'Baskets Sport',
            description: 'Baskets confortables pour le sport',
            category: 'shoes',
            price: 54.99,
            image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 13
        },
        {
            id: '17',
            name: 'Montre Classique',
            description: 'Montre élégante pour homme',
            category: 'jewelry',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 3
        },
        {
            id: '18',
            name: 'Lunettes de Soleil',
            description: 'Lunettes de soleil polarisées',
            category: 'accessories',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            stock: 10
        }
    ];
}

// Mélanger un tableau
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialiser les écouteurs d'événements
function initProductsEventListeners() {
    // Filtre de catégorie
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', applyFilters);
    }
    
    // Filtre de tri
    const sortFilter = document.getElementById('sort-filter');
    if (sortFilter) {
        sortFilter.addEventListener('change', applyFilters);
    }
    
    // Recherche
    const searchInput = document.getElementById('product-search');
    const searchButton = searchInput?.nextElementSibling;
    
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 500));
    }
    
    if (searchButton) {
        searchButton.addEventListener('click', applyFilters);
    }
    
    // Boutons de vue
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            viewButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Changer la vue
            currentView = this.dataset.view;
            renderProducts();
        });
    });
    
    // Pagination
    const prevPageBtn = document.getElementById('prev-page');
    const nextPageBtn = document.getElementById('next-page');
    
    if (prevPageBtn) {
        prevPageBtn.addEventListener('click', goToPrevPage);
    }
    
    if (nextPageBtn) {
        nextPageBtn.addEventListener('click', goToNextPage);
    }
}

// Appliquer les filtres
function applyFilters() {
    const categoryFilter = document.getElementById('category-filter');
    const sortFilter = document.getElementById('sort-filter');
    const searchInput = document.getElementById('product-search');
    
    let filtered = [...allProducts];
    
    // Filtrer par catégorie
    if (categoryFilter && categoryFilter.value) {
        filtered = filtered.filter(product => product.category === categoryFilter.value);
    }
    
    // Filtrer par recherche
    if (searchInput && searchInput.value.trim()) {
        const searchTerm = searchInput.value.trim().toLowerCase();
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.category.toLowerCase().includes(searchTerm)
        );
    }
    
    // Trier les produits
    if (sortFilter && sortFilter.value) {
        switch(sortFilter.value) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'random':
                shuffleArray(filtered);
                break;
        }
    }
    
    filteredProducts = filtered;
    currentPage = 1;
    renderProducts();
}

// Afficher les produits
function renderProducts() {
    // Calculer les produits pour la page actuelle
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    // Mettre à jour la pagination
    updatePagination();
    
    // Afficher les produits selon la vue
    if (currentView === 'grid') {
        renderGridView(productsToShow);
    } else {
        renderListView(productsToShow);
    }
    
    // Traduire les boutons
    translateProductButtons();
}

// Afficher la vue grille
function renderGridView(products) {
    const container = document.getElementById('all-products-container');
    const listContainer = document.getElementById('all-products-list');
    
    // Afficher la grille, cacher la liste
    container.style.display = 'grid';
    listContainer.style.display = 'none';
    
    // Vider le conteneur
    container.innerHTML = '';
    
    // Si aucun produit
    if (products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos filtres de recherche</p>
            </div>
        `;
        return;
    }
    
    // Afficher chaque produit
    products.forEach(product => {
        const productCard = createProductCard(product);
        container.appendChild(productCard);
    });
}

// Afficher la vue liste
function renderListView(products) {
    const container = document.getElementById('all-products-container');
    const listContainer = document.getElementById('all-products-list');
    
    // Afficher la liste, cacher la grille
    container.style.display = 'none';
    listContainer.style.display = 'block';
    
    // Vider le conteneur de liste
    listContainer.innerHTML = '';
    
    // Si aucun produit
    if (products.length === 0) {
        listContainer.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>Aucun produit trouvé</h3>
                <p>Essayez de modifier vos filtres de recherche</p>
            </div>
        `;
        return;
    }
    
    // Afficher chaque produit en vue liste
    products.forEach(product => {
        const listItem = createProductListItem(product);
        listContainer.appendChild(listItem);
    });
}

// Créer une carte de produit pour la vue grille
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    const imageUrl = product.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    const price = product.price ? `€${parseFloat(product.price).toFixed(2)}` : '€0.00';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-image">
        <div class="product-details">
            <h3 class="product-title">${product.name}</h3>
            <span class="product-category">${getCategoryName(product.category)}</span>
            <p class="product-price">${price}</p>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart('${product.id}')" data-translate="add_to_cart">Ajouter au panier</button>
                <button class="view-details" onclick="viewProductDetails('${product.id}')" data-translate="view_details">Voir détails</button>
            </div>
        </div>
    `;
    
    return card;
}

// Créer un élément de liste de produit
function createProductListItem(product) {
    const item = document.createElement('div');
    item.className = 'product-list-item';
    item.dataset.id = product.id;
    
    const imageUrl = product.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    const price = product.price ? `€${parseFloat(product.price).toFixed(2)}` : '€0.00';
    
    item.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-list-image">
        <div class="product-list-details">
            <h3 class="product-list-title">${product.name}</h3>
            <p class="product-list-description">${product.description || 'Produit de qualité'}</p>
            <div class="product-list-meta">
                <div>
                    <span class="product-list-price">${price}</span>
                    <span class="product-list-category">${getCategoryName(product.category)}</span>
                </div>
                <div class="product-list-actions">
                    <button class="add-to-cart" onclick="addToCart('${product.id}')" data-translate="add_to_cart">Ajouter au panier</button>
                    <button class="view-details" onclick="viewProductDetails('${product.id}')" data-translate="view_details">Voir détails</button>
                </div>
            </div>
        </div>
    `;
    
    return item;
}

// Obtenir le nom de la catégorie
function getCategoryName(category) {
    const categories = {
        'clothing': 'Vêtements',
        'shoes': 'Chaussures',
        'jewelry': 'Bijoux',
        'accessories': 'Accessoires'
    };
    
    return categories[category] || 'Général';
}

// Mettre à jour la pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const pageInfo = document.getElementById('page-info');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    
    if (pageInfo) {
        pageInfo.textContent = `Page ${currentPage} sur ${totalPages}`;
    }
    
    if (prevBtn) {
        prevBtn.disabled = currentPage <= 1;
    }
    
    if (nextBtn) {
        nextBtn.disabled = currentPage >= totalPages || totalPages === 0;
    }
}

// Aller à la page précédente
function goToPrevPage() {
    if (currentPage > 1) {
        currentPage--;
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Aller à la page suivante
function goToNextPage() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (currentPage < totalPages) {
        currentPage++;
        renderProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// Voir les détails d'un produit
function viewProductDetails(productId) {
    // Rediriger vers la page de détails du produit
    window.location.href = `product-details.html?id=${productId}`;
}

// Traduire les boutons des produits
function translateProductButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const viewDetailsButtons = document.querySelectorAll('.view-details');
    
    addToCartButtons.forEach(button => {
        button.textContent = translations[currentLanguage]?.add_to_cart || 'Add to Cart';
    });
    
    viewDetailsButtons.forEach(button => {
        button.textContent = translations[currentLanguage]?.view_details || 'View Details';
    });
}

// Fonction debounce pour les recherches
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Exposer les fonctions globales
window.viewProductDetails = viewProductDetails;
window.addToCart = function(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (product) {
        addToCart(product);
    }
};
