// Main JavaScript for E-S COMPANY

document.addEventListener('DOMContentLoaded', function() {
    // Menu mobile toggle
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.querySelector('.main-nav');
    
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', function() {
            mainNav.classList.toggle('active');
            menuToggle.innerHTML = mainNav.classList.contains('active') ? 
                '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
        });
        
        // Fermer le menu en cliquant sur un lien
        document.querySelectorAll('.main-nav a').forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            });
        });
    }
    
    // Cart functionality
    let cart = JSON.parse(localStorage.getItem('esCompanyCart')) || [];
    const cartCount = document.querySelector('.cart-count');
    
    function updateCartCount() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        if (cartCount) {
            cartCount.textContent = totalItems;
        }
    }
    
    // Add to cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.add-to-cart')) {
            const button = e.target.closest('.add-to-cart');
            const productId = parseInt(button.getAttribute('data-id'));
            
            // Trouver le produit
            let product;
            if (window.productShuffler && window.productShuffler.products) {
                product = window.productShuffler.products.find(p => p.id === productId);
            }
            
            if (product) {
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
                
                // Sauvegarder dans localStorage
                localStorage.setItem('esCompanyCart', JSON.stringify(cart));
                
                // Mettre à jour le compteur
                updateCartCount();
                
                // Animation de confirmation
                button.innerHTML = '<i class="fas fa-check"></i> <span data-lang="fr">Ajouté</span><span data-lang="en">Added</span><span data-lang="es">Añadido</span>';
                button.style.backgroundColor = '#27ae60';
                
                setTimeout(() => {
                    button.innerHTML = '<i class="fas fa-cart-plus"></i> <span data-lang="fr">Ajouter</span><span data-lang="en">Add</span><span data-lang="es">Añadir</span>';
                    button.style.backgroundColor = '';
                }, 1500);
            }
        }
    });
    
    // View details buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-details')) {
            const button = e.target.closest('.view-details');
            const productId = parseInt(button.getAttribute('data-id'));
            
            // Rediriger vers la page de détails (à implémenter)
            alert('Page de détails du produit à implémenter');
        }
    });
    
    // Initialiser le compteur du panier
    updateCartCount();
    
    // Smooth scrolling pour les ancres
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                
                if (target) {
                    window.scrollTo({
                        top: target.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
    
    // Animation au défilement
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observer les éléments à animer
    document.querySelectorAll('.product-card, .category-card').forEach(el => {
        observer.observe(el);
    });
});
