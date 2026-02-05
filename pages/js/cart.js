// Gestion du panier
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Initialiser le panier
function initCart() {
    updateCartCount();
    
    // Bouton panier
    const cartToggle = document.getElementById('cart-toggle');
    const closeCart = document.querySelector('.close-cart');
    const cartSidebar = document.getElementById('cart-sidebar');
    
    if (cartToggle) {
        cartToggle.addEventListener('click', function() {
            cartSidebar.classList.add('active');
            renderCartItems();
        });
    }
    
    if (closeCart) {
        closeCart.addEventListener('click', function() {
            cartSidebar.classList.remove('active');
        });
    }
    
    // Fermer le panier en cliquant à l'extérieur
    document.addEventListener('click', function(e) {
        if (!cartSidebar.contains(e.target) && e.target !== cartToggle && !cartToggle.contains(e.target)) {
            cartSidebar.classList.remove('active');
        }
    });
    
    // Bouton de paiement
    const checkoutBtn = document.querySelector('.btn-checkout');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                showAlert('Votre panier est vide', 'warning');
                return;
            }
            
            if (!currentUser) {
                showAlert('Veuillez vous connecter pour passer commande', 'warning');
                document.getElementById('user-modal').style.display = 'flex';
                cartSidebar.classList.remove('active');
                return;
            }
            
            // Simuler un paiement
            processCheckout();
        });
    }
}

// Ajouter un article au panier
function addToCart(product) {
    // Vérifier si l'article est déjà dans le panier
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        // Augmenter la quantité
        existingItem.quantity += 1;
    } else {
        // Ajouter un nouvel article
        cart.push({
            id: product.id,
            name: product.name,
            price: parseFloat(product.price) || 0,
            image: product.image,
            quantity: 1
        });
    }
    
    // Sauvegarder dans le localStorage
    saveCart();
    
    // Mettre à jour le compteur
    updateCartCount();
    
    // Mettre à jour l'affichage si le panier est ouvert
    const cartSidebar = document.getElementById('cart-sidebar');
    if (cartSidebar && cartSidebar.classList.contains('active')) {
        renderCartItems();
    }
}

// Enlever un article du panier
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    renderCartItems();
}

// Mettre à jour la quantité d'un article
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity < 1) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            renderCartItems();
        }
    }
}

// Sauvegarder le panier
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Mettre à jour le compteur du panier
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartCount.style.display = totalItems > 0 ? 'flex' : 'none';
    }
}

// Afficher les articles du panier
function renderCartItems() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    
    if (!cartItemsContainer) return;
    
    // Vider le conteneur
    cartItemsContainer.innerHTML = '';
    
    // Si le panier est vide
    if (cart.length === 0) {
        const emptyCartText = translations[currentLanguage]?.empty_cart || 'Your cart is empty';
        cartItemsContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <p>${emptyCartText}</p>
            </div>
        `;
        
        if (cartTotalPrice) {
            cartTotalPrice.textContent = '0.00 €';
        }
        
        return;
    }
    
    // Afficher chaque article
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}" 
                 alt="${item.name}" class="cart-item-img">
            <div class="cart-item-details">
                <h4 class="cart-item-title">${item.name}</h4>
                <p class="cart-item-price">${item.price.toFixed(2)} €</p>
                <div class="cart-item-actions">
                    <button class="quantity-btn minus" onclick="updateQuantity('${item.id}', -1)">-</button>
                    <span class="quantity">${item.quantity}</span>
                    <button class="quantity-btn plus" onclick="updateQuantity('${item.id}', 1)">+</button>
                    <button class="remove-item" onclick="removeFromCart('${item.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        
        cartItemsContainer.appendChild(cartItem);
    });
    
    // Mettre à jour le total
    if (cartTotalPrice) {
        cartTotalPrice.textContent = total.toFixed(2) + ' €';
    }
}

// Traiter le paiement
function processCheckout() {
    // Simulation de paiement
    showAlert('Traitement de votre commande...', 'info');
    
    setTimeout(() => {
        // Vider le panier
        cart = [];
        saveCart();
        updateCartCount();
        renderCartItems();
        
        // Fermer le panier
        document.getElementById('cart-sidebar').classList.remove('active');
        
        // Afficher confirmation
        showAlert('Commande passée avec succès! Merci pour votre achat.', 'success');
    }, 2000);
}

// Exposer les fonctions au scope global
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
