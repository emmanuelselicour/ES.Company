// Gestion de la page détails produit
let currentProduct = null;
let selectedColor = 'black';
let selectedSize = 'M';
let quantity = 1;

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Récupérer l'ID du produit depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    
    if (productId) {
        loadProductDetails(productId);
        loadRelatedProducts(productId);
    } else {
        // Rediriger si pas d'ID
        window.location.href = 'products.html';
    }
    
    // Initialiser les écouteurs d'événements
    initProductDetailsEventListeners();
});

// Charger les détails du produit
async function loadProductDetails(productId) {
    try {
        const response = await fetch(`${API_URL}/api/products/${productId}`);
        
        if (response.ok) {
            currentProduct = await response.json();
        } else {
            // Fallback à un produit de démo
            currentProduct = getDemoProduct(productId);
        }
    } catch (error) {
        console.error('Error loading product details:', error);
        currentProduct = getDemoProduct(productId);
    }
    
    // Afficher les détails du produit
    renderProductDetails();
}

// Obtenir un produit de démo
function getDemoProduct(productId) {
    const demoProducts = {
        '1': {
            id: '1',
            name: 'Robe Élégante',
            description: 'Cette robe élégante est parfaite pour toutes occasions. Fabriquée à partir de matériaux de haute qualité, elle offre confort et style. Coupe ajustée qui met en valeur la silhouette.',
            category: 'clothing',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            ],
            stock: 10,
            sku: 'ROBE001'
        },
        '2': {
            id: '2',
            name: 'Jean Slim',
            description: 'Jean slim décontracté avec coupe moderne. Confortable et durable, idéal pour un usage quotidien. Disponible en plusieurs tailles.',
            category: 'clothing',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
            images: [
                'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
                'https://images.unsplash.com/photo-1582418702059-97ebafb35d09?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            ],
            stock: 15,
            sku: 'JEAN002'
        }
    };
    
    return demoProducts[productId] || demoProducts['1'];
}

// Charger les produits similaires
async function loadRelatedProducts(currentProductId) {
    const container = document.getElementById('related-products-container');
    
    if (!container) return;
    
    try {
        let relatedProducts = [];
        
        // Dans une vraie application, on ferait une requête à l'API
        // Pour cette démo, on utilise des produits de démo
        const allProducts = getDemoProducts();
        
        // Filtrer pour exclure le produit actuel et prendre 4 produits aléatoires
        relatedProducts = allProducts
            .filter(product => product.id !== currentProductId)
            .sort(() => Math.random() - 0.5)
            .slice(0, 4);
        
        // Afficher les produits similaires
        renderRelatedProducts(relatedProducts);
    } catch (error) {
        console.error('Error loading related products:', error);
    }
}

// Obtenir tous les produits de démo
function getDemoProducts() {
    return [
        {
            id: '1',
            name: 'Robe Élégante',
            category: 'clothing',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '2',
            name: 'Jean Slim',
            category: 'clothing',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '3',
            name: 'Jupe Midi',
            category: 'clothing',
            price: 34.99,
            image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '4',
            name: 'Chaussures de Ville',
            category: 'shoes',
            price: 59.99,
            image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '5',
            name: 'Collier Argent',
            category: 'jewelry',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        },
        {
            id: '6',
            name: 'Sac à Main',
            category: 'accessories',
            price: 45.99,
            image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
        }
    ];
}

// Initialiser les écouteurs d'événements
function initProductDetailsEventListeners() {
    // Boutons de quantité
    const quantityMinus = document.getElementById('quantity-minus');
    const quantityPlus = document.getElementById('quantity-plus');
    const quantityInput = document.getElementById('quantity-input');
    
    if (quantityMinus) {
        quantityMinus.addEventListener('click', function() {
            if (quantity > 1) {
                quantity--;
                quantityInput.value = quantity;
            }
        });
    }
    
    if (quantityPlus) {
        quantityPlus.addEventListener('click', function() {
            if (quantity < 10) {
                quantity++;
                quantityInput.value = quantity;
            }
        });
    }
    
    if (quantityInput) {
        quantityInput.addEventListener('change', function() {
            const value = parseInt(this.value);
            if (value >= 1 && value <= 10) {
                quantity = value;
            } else {
                this.value = quantity;
            }
        });
    }
    
    // Options de couleur
    const colorOptions = document.querySelectorAll('.color-option');
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Retirer la classe active de toutes les options
            colorOptions.forEach(opt => opt.classList.remove('active'));
            
            // Ajouter la classe active à l'option cliquée
            this.classList.add('active');
            
            // Mettre à jour la couleur sélectionnée
            selectedColor = this.dataset.color;
        });
    });
    
    // Sélecteur de taille
    const sizeSelect = document.getElementById('size-select');
    if (sizeSelect) {
        sizeSelect.addEventListener('change', function() {
            selectedSize = this.value;
        });
    }
    
    // Bouton "Ajouter au panier"
    const addToCartBtn = document.getElementById('add-to-cart-btn');
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', addToCartFromDetails);
    }
    
    // Bouton "Acheter maintenant"
    const buyNowBtn = document.getElementById('buy-now-btn');
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', buyNow);
    }
}

// Afficher les détails du produit
function renderProductDetails() {
    if (!currentProduct) return;
    
    // Mettre à jour le titre
    document.getElementById('product-title').textContent = currentProduct.name;
    
    // Mettre à jour le fil d'Ariane
    document.getElementById('product-name').textContent = currentProduct.name;
    document.getElementById('product-category').textContent = getCategoryName(currentProduct.category);
    
    // Mettre à jour la catégorie
    document.getElementById('product-category-badge').textContent = getCategoryName(currentProduct.category);
    
    // Mettre à jour le stock
    const stockElement = document.getElementById('product-stock');
    if (currentProduct.stock > 0) {
        stockElement.textContent = `${currentProduct.stock} en stock`;
        stockElement.className = 'product-stock';
    } else {
        stockElement.textContent = 'Rupture de stock';
        stockElement.className = 'product-stock out-of-stock';
    }
    
    // Mettre à jour le SKU
    document.getElementById('product-sku').textContent = `SKU: ${currentProduct.sku || '--'}`;
    
    // Mettre à jour le prix
    document.querySelector('.current-price').textContent = `€${currentProduct.price.toFixed(2)}`;
    
    // Mettre à jour la description
    document.getElementById('product-description-text').textContent = currentProduct.description || 'Description non disponible';
    
    // Mettre à jour les images
    const mainImage = document.getElementById('main-product-image');
    const thumbnailsContainer = document.getElementById('thumbnail-images');
    
    if (currentProduct.images && currentProduct.images.length > 0) {
        // Image principale
        mainImage.src = currentProduct.images[0];
        mainImage.alt = currentProduct.name;
        
        // Miniatures
        thumbnailsContainer.innerHTML = '';
        
        currentProduct.images.forEach((image, index) => {
            const thumbnail = document.createElement('div');
            thumbnail.className = `thumbnail ${index === 0 ? 'active' : ''}`;
            
            const img = document.createElement('img');
            img.src = image;
            img.alt = `${currentProduct.name} - vue ${index + 1}`;
            
            thumbnail.appendChild(img);
            thumbnailsContainer.appendChild(thumbnail);
            
            // Ajouter un écouteur d'événement pour changer l'image principale
            thumbnail.addEventListener('click', function() {
                // Retirer la classe active de toutes les miniatures
                document.querySelectorAll('.thumbnail').forEach(thumb => {
                    thumb.classList.remove('active');
                });
                
                // Ajouter la classe active à la miniature cliquée
                this.classList.add('active');
                
                // Changer l'image principale
                mainImage.src = image;
            });
        });
    } else {
        // Image par défaut
        mainImage.src = currentProduct.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
        mainImage.alt = currentProduct.name;
    }
}

// Afficher les produits similaires
function renderRelatedProducts(products) {
    const container = document.getElementById('related-products-container');
    
    if (!container) return;
    
    // Vider le conteneur
    container.innerHTML = '';
    
    // Si aucun produit
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="no-related-products">
                <p>Aucun produit similaire trouvé</p>
            </div>
        `;
        return;
    }
    
    // Afficher chaque produit
    products.forEach(product => {
        const productCard = createRelatedProductCard(product);
        container.appendChild(productCard);
    });
}

// Créer une carte de produit similaire
function createRelatedProductCard(product) {
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
                <button class="view-details" onclick="viewRelatedProduct('${product.id}')" data-translate="view_details">Voir détails</button>
            </div>
        </div>
    `;
    
    return card;
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

// Ajouter au panier depuis la page détails
function addToCartFromDetails() {
    if (!currentProduct) return;
    
    // Créer un produit avec les variantes sélectionnées
    const productWithVariants = {
        ...currentProduct,
        color: selectedColor,
        size: selectedSize
    };
    
    // Ajouter la quantité
    for (let i = 0; i < quantity; i++) {
        addToCart(productWithVariants);
    }
    
    // Afficher une notification
    showAlert(`${currentProduct.name} (${quantity}x) a été ajouté au panier`, 'success');
    
    // Ouvrir le panier
    document.getElementById('cart-sidebar').classList.add('active');
    renderCartItems();
}

// Acheter maintenant
function buyNow() {
    if (!currentProduct) return;
    
    // Ajouter au panier
    addToCartFromDetails();
    
    // Rediriger vers le panier
    setTimeout(() => {
        document.getElementById('cart-sidebar').classList.add('active');
    }, 500);
}

// Voir un produit similaire
function viewRelatedProduct(productId) {
    window.location.href = `product-details.html?id=${productId}`;
}

// Exposer les fonctions globales
window.addToCart = function(productId) {
    // Cette fonction est déjà définie dans cart.js
    const product = getDemoProduct(productId) || { id: productId, name: 'Produit', price: 0 };
    addToCart(product);
};

window.viewRelatedProduct = viewRelatedProduct;
