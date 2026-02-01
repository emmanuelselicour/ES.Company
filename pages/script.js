// Menu mobile
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('nav');
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            // Changer l'icône
            const icon = this.querySelector('i');
            if (nav.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Fermer le menu mobile en cliquant sur un lien
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            const icon = document.querySelector('.mobile-menu-btn i');
            if (icon) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    });

    // Animation simple au défilement
    window.addEventListener('scroll', function() {
        const header = document.querySelector('header');
        if (header) {
            if (window.scrollY > 100) {
                header.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
            }
        }
    });

    // Notification pour les produits à venir
    const notifyBtn = document.querySelector('.notify-btn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            alert('Merci pour votre intérêt ! Nous vous informerons dès que notre collection sera disponible.');
        });
    }

    // Gestion du formulaire de contact
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validation simple
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            if (name && email && message) {
                // Simuler l'envoi
                const submitBtn = contactForm.querySelector('button[type="submit"]');
                const originalText = submitBtn.textContent;
                
                submitBtn.textContent = 'Envoi en cours...';
                submitBtn.disabled = true;
                
                setTimeout(() => {
                    alert('Merci pour votre message ! Nous vous répondrons dans les plus brefs délais.');
                    contactForm.reset();
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 1500);
            } else {
                alert('Veuillez remplir tous les champs du formulaire.');
            }
        });
    }

    // Filtrage des catégories
    const categoryFilters = document.querySelectorAll('.category-filter');
    if (categoryFilters.length > 0) {
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Retirer la classe active de tous les filtres
                categoryFilters.forEach(f => f.classList.remove('active'));
                
                // Ajouter la classe active au filtre cliqué
                this.classList.add('active');
                
                // Simuler le filtrage (à remplacer par le vrai filtrage quand il y aura des produits)
                const category = this.getAttribute('data-category');
                const categoryTitle = document.querySelector('.category-title');
                
                if (categoryTitle) {
                    categoryTitle.textContent = category === 'all' ? 'Toutes les catégories' : this.textContent;
                }
                
                // Afficher un message temporaire
                const message = document.createElement('div');
                message.className = 'filter-message';
                message.textContent = `Affichage des produits de la catégorie: ${this.textContent}`;
                message.style.cssText = `
                    position: fixed;
                    top: 100px;
                    right: 20px;
                    background: var(--secondary-color);
                    color: white;
                    padding: 10px 20px;
                    border-radius: var(--border-radius);
                    z-index: 1000;
                    animation: slideIn 0.3s ease;
                `;
                
                document.body.appendChild(message);
                
                setTimeout(() => {
                    message.style.animation = 'slideOut 0.3s ease';
                    setTimeout(() => message.remove(), 300);
                }, 2000);
            });
        });
    }

    // Ajouter des styles d'animation pour les messages
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .filter-message {
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--secondary-color);
            color: white;
            padding: 10px 20px;
            border-radius: var(--border-radius);
            z-index: 1000;
            animation: slideIn 0.3s ease;
        }
    `;
    document.head.appendChild(style);
});
