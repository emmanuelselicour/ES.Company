// Configuration de l'API
const API_URL = "https://es-company-api.onrender.com";
// const API_URL = "http://localhost:3000"; // Pour le développement local

// État de l'application
let products = [];
let cart = JSON.parse(localStorage.getItem('esCompanyCart')) || [];

// DOM Elements
const productsContainer = document.getElementById('products-container');
const cartIcon = document.querySelector('.cart-icon');
const cartCount = document.querySelector('.cart-count');
const cartModal = document.getElementById('cartModal');
const closeCartBtn = document.querySelector('.close-cart');
const cartItemsContainer = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const refreshProductsBtn = document.getElementById('refresh-products');
const searchInput = document.querySelector('.search-box input');
const contactForm = document.getElementById('contactForm');

// Catégories et données de produits par défaut (en attendant l'API)
const defaultProducts = [
    {
        id: 1,
        name: "Robe Élégante",
        description: "Robe longue en soie pour occasions spéciales",
        price: 4500,
        category: "Vêtements",
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Pantalon Chic",
        description: "Pantalon en lin pour un style décontracté mais élégant",
        price: 3200,
        category: "Vêtements",
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Jupe Florale",
        description: "Jupe mi-longue avec motif floral printanier",
        price: 2800,
        category: "Vêtements",
        image: "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Baskets Modernes",
        description: "Chaussures de sport confortables et stylées",
        price: 5500,
        category: "Chaussures",
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Talons Hauts",
        description: "Talons élégants pour soirée ou bureau",
        price: 6200,
        category: "Chaussures",
        image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Collier en Or",
        description: "Collier fin en or 18 carats avec pendentif",
        price: 8900,
        category: "Bijoux",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Sac à Main",
        description: "Sac en cuir de qualité avec compartiments multiples",
        price: 7200,
        category: "Accessoires",
        image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        name: "Chemise Blanche",
        description: "Chemise en coton pour un look professionnel",
        price: 2500,
        category: "Vêtements",
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
];

// Fonction pour mélanger un tableau aléatoirement (algorithme de Fisher-Yates)
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Fonction pour formater le prix
function formatPrice(price) {
    return new Intl.NumberFormat('fr-HT', {
        style: 'currency',
        currency: 'HTG',
        minimumFractionDigits: 0
    }).format(price);
}

// Charger les produits depuis l'API ou utiliser les données par défaut
async function loadProducts() {
    try {
        productsContainer.innerHTML = '<div class="loading">Chargement des produits...</div>';
        
        // Essayer de récupérer les produits depuis l'API
        const response = await fetch(`${API_URL}/api/products`);
        
        if (response.ok) {
            products = await response.json();
        } else {
            // Si l'API n'est pas disponible, utiliser les produits par défaut
            console.log("API non disponible, utilisation des produits par défaut");
            products = [...defaultProducts];
        }
        
        // Mélanger les produits aléatoirement
        products = shuffleArray(products);
        
        // Afficher les produits
        displayProducts(products);
        
    } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
        products = [...defaultProducts];
        products = shuffleArray(products);
        displayProducts(products);
    }
}

// Afficher les produits dans le DOM
function displayProducts(productsToDisplay) {
    if (productsToDisplay.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">Aucun produit disponible pour le moment.</p>';
        return;
    }
    
    productsContainer.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.dataset.id = product.id;
        
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" alt="${product.name}">
            </div>
            <div class="product-info">
                <div class="product-category">${product.category || 'Non catégorisé'}</div>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description || 'Produit de qualité'}</p>
                <div class="product-price">${formatPrice(product.price)}</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product.id}">
                        <i class="fas fa-cart-plus"></i> Ajouter
                    </button>
                    <a href="#" class="view-details" data-id="${product.id}">Voir détails</a>
                </div>
            </div>
        `;
        
        productsContainer.appendChild(productCard);
    });
    
    // Ajouter les écouteurs d'événements aux boutons "Ajouter au panier"
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.add-to-cart').dataset.id);
            addToCart(productId);
        });
    });
    
    // Ajouter les écouteurs d'événements aux liens "Voir détails"
    document.querySelectorAll('.view-details').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const productId = parseInt(e.target.closest('.view-details').dataset.id);
            viewProductDetails(productId);
        });
    });
}

// Ajouter un produit au panier
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Vérifier si le produit est déjà dans le panier
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    // Mettre à jour le localStorage
    localStorage.setItem('esCompanyCart', JSON.stringify(cart));
    
    // Mettre à jour l'interface
    updateCartUI();
    
    // Afficher une notification
    showNotification(`${product.name} ajouté au panier!`);
}

// Afficher les détails d'un produit
function viewProductDetails(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Créer un modal pour afficher les détails du produit
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>${product.name}</h3>
                <button class="close-modal">&times;</button>
            </div>
            <div class="modal-body">
                <div class="product-detail">
                    <div class="product-detail-image">
                        <img src="${product.image || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" alt="${product.name}">
                    </div>
                    <div class="product-detail-info">
                        <div class="product-category">${product.category || 'Non catégorisé'}</div>
                        <div class="product-price">${formatPrice(product.price)}</div>
                        <p class="product-description">${product.description || 'Produit de qualité'}</p>
                        <button class="btn add-to-cart-detail" data-id="${product.id}">
                            <i class="fas fa-cart-plus"></i> Ajouter au panier
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Ajouter le style pour le modal
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .modal-content {
            background-color: white;
            width: 90%;
            max-width: 800px;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
        }
        
        .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background-color: var(--primary-color);
            color: white;
        }
        
        .modal-header h3 {
            font-size: 1.5rem;
        }
        
        .close-modal {
            background: none;
            border: none;
            color: white;
            font-size: 2rem;
            cursor: pointer;
            line-height: 1;
        }
        
        .modal-body {
            padding: 20px;
        }
        
        .product-detail {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 30px;
        }
        
        .product-detail-image img {
            width: 100%;
            border-radius: 8px;
        }
        
        .product-detail-info {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .add-to-cart-detail {
            align-self: flex-start;
        }
        
        @media (max-width: 768px) {
            .product-detail {
                grid-template-columns: 1fr;
            }
        }
    `;
    
    document.head.appendChild(style);
    
    // Ajouter les écouteurs d'événements
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    modal.querySelector('.add-to-cart-detail').addEventListener('click', () => {
        addToCart(productId);
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
    
    // Fermer le modal en cliquant à l'extérieur
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
            document.head.removeChild(style);
        }
    });
}

// Mettre à jour l'interface du panier
function updateCartUI() {
    // Mettre à jour le nombre d'articles dans le panier
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Mettre à jour le contenu du modal du panier
    updateCartModal();
}

// Mettre à jour le modal du panier
function updateCartModal() {
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Votre panier est vide</p>';
        cartTotal.textContent = formatPrice(0);
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image || 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" alt="${item.name}">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${formatPrice(item.price)} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" data-id="${item.id}">
                <i class="fas fa-trash"></i>
            </button>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    cartTotal.textContent = formatPrice(total);
    
    // Ajouter les écouteurs d'événements aux boutons de suppression
    document.querySelectorAll('.cart-item-remove').forEach(button => {
        button.addEventListener('click', (e) => {
            const productId = parseInt(e.target.closest('.cart-item-remove').dataset.id);
            removeFromCart(productId);
        });
    });
}

// Retirer un produit du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('esCompanyCart', JSON.stringify(cart));
    updateCartUI();
}

// Afficher une notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Ajouter le style pour la notification
    const style = document.createElement('style');
    style.textContent = `
        .notification {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
            z-index: 3000;
            animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
            animation-fill-mode: forwards;
        }
        
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
    document.body.appendChild(notification);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
        if (document.body.contains(notification)) {
            document.body.removeChild(notification);
            document.head.removeChild(style);
        }
    }, 3000);
}

// Fonction de recherche
function searchProducts(query) {
    if (!query.trim()) {
        displayProducts(products);
        return;
    }
    
    const filteredProducts = products.filter(product => {
        const searchText = query.toLowerCase();
        return (
            product.name.toLowerCase().includes(searchText) ||
            product.description.toLowerCase().includes(searchText) ||
            product.category.toLowerCase().includes(searchText)
        );
    });
    
    displayProducts(filteredProducts);
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', () => {
    // Charger les produits
    loadProducts();
    
    // Mettre à jour l'interface du panier
    updateCartUI();
    
    // Événements pour le panier
    cartIcon.addEventListener('click', () => {
        cartModal.style.display = 'flex';
    });
    
    closeCartBtn.addEventListener('click', () => {
        cartModal.style.display = 'none';
    });
    
    cartModal.addEventListener('click', (e) => {
        if (e.target === cartModal) {
            cartModal.style.display = 'none';
        }
    });
    
    // Événement pour le bouton de rafraîchissement
    refreshProductsBtn.addEventListener('click', () => {
        // Mélanger les produits aléatoirement
        products = shuffleArray(products);
        displayProducts(products);
        showNotification('Produits mélangés!');
    });
    
    // Événement pour la recherche
    searchInput.addEventListener('input', (e) => {
        searchProducts(e.target.value);
    });
    
    // Événement pour le formulaire de contact
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Ici, normalement, on enverrait les données à l'API
            // Pour l'instant, on simule juste l'envoi
            showNotification('Message envoyé avec succès! Nous vous répondrons bientôt.');
            contactForm.reset();
        });
    }
    
    // Événement pour le bouton de menu mobile
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        });
    }
    
    // Événement pour le bouton de passage à la caisse
    const checkoutBtn = document.querySelector('.checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) {
                showNotification('Votre panier est vide!');
                return;
            }
            
            // Ici, normalement, on redirigerait vers la page de paiement
            showNotification('Fonctionnalité de paiement à implémenter avec le panel admin');
        });
    }
});
