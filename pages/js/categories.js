// Gestion de la page catégories
document.addEventListener('DOMContentLoaded', function() {
    initCategoriesPage();
    loadCategoryProducts();
    initEventListeners();
});

// Initialiser la page catégories
function initCategoriesPage() {
    // Charger les traductions
    if (typeof loadTranslations === 'function') {
        loadTranslations();
    }
    
    // Initialiser le panier
    if (typeof initCart === 'function') {
        initCart();
    }
    
    // Vérifier si l'utilisateur est connecté
    if (typeof checkAuthStatus === 'function') {
        checkAuthStatus();
    }
    
    // Traductions supplémentaires
    const additionalTranslations = {
        fr: {
            all_categories: "Toutes les catégories",
            categories_desc: "Parcourez notre collection par catégorie",
            clothing_desc_full: "Découvrez notre collection complète de vêtements pour toutes les occasions",
            shoes_desc_full: "Des chaussures élégantes et confortables pour chaque saison",
            jewelry_desc_full: "Accessoires élégants pour compléter votre tenue",
            accessories_desc_full: "Sacs, ceintures et autres accessoires mode",
            products_count: "produits",
            subcategories: "Sous-catégories",
            dresses: "Robes",
            pants: "Pantalons",
            skirts: "Jupes",
            tops: "Hauts",
            jackets: "Vestes",
            heels: "Talons",
            sneakers: "Baskets",
            boots: "Bottes",
            necklaces: "Colliers",
            earrings: "Boucles d'oreilles",
            bags: "Sacs",
            belts: "Ceintures",
            featured_by_category: "Produits par catégorie",
            featured_by_category_desc: "Découvrez nos meilleurs produits dans chaque catégorie",
            size_guide: "Guide des tailles",
            size_guide_desc: "Trouvez la taille parfaite pour vous",
            size: "Taille",
            bust: "Buste (cm)",
            waist: "Taille (cm)",
            hips: "Hanches (cm)",
            us_size: "US",
            uk_size: "UK",
            size_tips: "Conseils pour les tailles",
            tip1: "Prenez vos mesures au niveau le plus large",
            tip2: "Portez des sous-vêtements légers lors de la prise de mesures",
            tip3: "Consultez les commentaires des autres clients pour des conseils sur l'ajustement",
            tip4: "En cas de doute entre deux tailles, choisissez la plus grande",
            tip5: "Les tailles peuvent varier selon les marques et les styles",
            explore_category: "Explorer"
        },
        en: {
            all_categories: "All Categories",
            categories_desc: "Browse our collection by category",
            clothing_desc_full: "Discover our complete collection of clothing for all occasions",
            shoes_desc_full: "Elegant and comfortable shoes for every season",
            jewelry_desc_full: "Elegant accessories to complete your outfit",
            accessories_desc_full: "Bags, belts and other fashion accessories",
            products_count: "products",
            subcategories: "Subcategories",
            dresses: "Dresses",
            pants: "Pants",
            skirts: "Skirts",
            tops: "Tops",
            jackets: "Jackets",
            heels: "Heels",
            sneakers: "Sneakers",
            boots: "Boots",
            necklaces: "Necklaces",
            earrings: "Earrings",
            bags: "Bags",
            belts: "Belts",
            featured_by_category: "Products by Category",
            featured_by_category_desc: "Discover our best products in each category",
            size_guide: "Size Guide",
            size_guide_desc: "Find the perfect size for you",
            size: "Size",
            bust: "Bust (cm)",
            waist: "Waist (cm)",
            hips: "Hips (cm)",
            us_size: "US",
            uk_size: "UK",
            size_tips: "Size Tips",
            tip1: "Take your measurements at the widest point",
            tip2: "Wear light underwear when taking measurements",
            tip3: "Check other customers' reviews for fit advice",
            tip4: "When in doubt between two sizes, choose the larger one",
            tip5: "Sizes may vary between brands and styles",
            explore_category: "Explore"
        },
        es: {
            all_categories: "Todas las categorías",
            categories_desc: "Explora nuestra colección por categoría",
            clothing_desc_full: "Descubre nuestra colección completa de ropa para todas las ocasiones",
            shoes_desc_full: "Zapatos elegantes y cómodos para cada temporada",
            jewelry_desc_full: "Accesorios elegantes para completar tu atuendo",
            accessories_desc_full: "Bolsos, cinturones y otros accesorios de moda",
            products_count: "productos",
            subcategories: "Subcategorías",
            dresses: "Vestidos",
            pants: "Pantalones",
            skirts: "Faldas",
            tops: "Tops",
            jackets: "Chaquetas",
            heels: "Tacones",
            sneakers: "Zapatillas",
            boots: "Botas",
            necklaces: "Collares",
            earrings: "Pendientes",
            bags: "Bolsos",
            belts: "Cinturones",
            featured_by_category: "Productos por categoría",
            featured_by_category_desc: "Descubre nuestros mejores productos en cada categoría",
            size_guide: "Guía de tallas",
            size_guide_desc: "Encuentra la talla perfecta para ti",
            size: "Talla",
            bust: "Busto (cm)",
            waist: "Cintura (cm)",
            hips: "Caderas (cm)",
            us_size: "EE.UU.",
            uk_size: "Reino Unido",
            size_tips: "Consejos de tallas",
            tip1: "Toma tus medidas en el punto más ancho",
            tip2: "Usa ropa interior ligera al tomar medidas",
            tip3: "Consulta las reseñas de otros clientes para consejos de ajuste",
            tip4: "En caso de duda entre dos tallas, elige la más grande",
            tip5: "Las tallas pueden variar entre marcas y estilos",
            explore_category: "Explorar"
        }
    };
    
    // Fusionner les traductions
    for (const lang in additionalTranslations) {
        if (translations[lang]) {
            Object.assign(translations[lang], additionalTranslations[lang]);
        }
    }
}

// Charger les produits par catégorie
async function loadCategoryProducts() {
    try {
        // Charger tous les produits
        const response = await fetch(`${API_URL}/api/products`);
        const products = await response.json();
        
        // Séparer par catégorie
        const clothingProducts = products.filter(p => p.category === 'clothing').slice(0, 4);
        const shoesProducts = products.filter(p => p.category === 'shoes').slice(0, 4);
        const jewelryProducts = products.filter(p => p.category === 'jewelry').slice(0, 4);
        const accessoriesProducts = products.filter(p => p.category === 'accessories').slice(0, 4);
        
        // Afficher les produits par défaut (vêtements)
        displayCategoryProducts('clothing', clothingProducts);
        
    } catch (error) {
        console.error('Error loading category products:', error);
        displayDemoCategoryProducts();
    }
}

// Afficher des produits de démo
function displayDemoCategoryProducts() {
    const demoProducts = {
        clothing: [
            {
                id: '1',
                name: 'Robe Élégante',
                category: 'clothing',
                price: 49.99,
                image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '2',
                name: 'Jean Slim Noir',
                category: 'clothing',
                price: 39.99,
                image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '3',
                name: 'Jupe Midi Plissée',
                category: 'clothing',
                price: 34.99,
                image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '7',
                name: 'Veste en Cuir Moto',
                category: 'clothing',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            }
        ],
        shoes: [
            {
                id: '4',
                name: 'Chaussures de Ville',
                category: 'shoes',
                price: 59.99,
                image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '8',
                name: 'Bottes Classiques',
                category: 'shoes',
                price: 69.99,
                image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '12',
                name: 'Baskets Sport',
                category: 'shoes',
                price: 44.99,
                image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '13',
                name: 'Sandales Été',
                category: 'shoes',
                price: 29.99,
                image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            }
        ],
        jewelry: [
            {
                id: '5',
                name: 'Collier Argent',
                category: 'jewelry',
                price: 24.99,
                image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '9',
                name: 'Boucles d\'Oreilles',
                category: 'jewelry',
                price: 29.99,
                image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '14',
                name: 'Bracelet Or',
                category: 'jewelry',
                price: 39.99,
                image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '15',
                name: 'Montre Élégante',
                category: 'jewelry',
                price: 89.99,
                image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            }
        ],
        accessories: [
            {
                id: '6',
                name: 'Sac à Main',
                category: 'accessories',
                price: 45.99,
                image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '10',
                name: 'Écharpe Laine',
                category: 'accessories',
                price: 19.99,
                image: 'https://images.unsplash.com/photo-1576872381144-d6c6801d1c34?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '16',
                name: 'Ceinture Cuir',
                category: 'accessories',
                price: 34.99,
                image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            },
            {
                id: '17',
                name: 'Lunettes Soleil',
                category: 'accessories',
                price: 59.99,
                image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'
            }
        ]
    };
    
    // Afficher les produits par défaut
    displayCategoryProducts('clothing', demoProducts.clothing);
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Tabs des catégories
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Mettre à jour les tabs actives
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Afficher le contenu correspondant
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`${category}-products`).classList.add('active');
            
            // Charger les produits de la catégorie
            loadSpecificCategoryProducts(category);
        });
    });
}

// Charger les produits d'une catégorie spécifique
async function loadSpecificCategoryProducts(category) {
    try {
        const response = await fetch(`${API_URL}/api/products?category=${category}`);
        const products = await response.json();
        displayCategoryProducts(category, products.slice(0, 4));
    } catch (error) {
        console.error(`Error loading ${category} products:`, error);
        // Utiliser les données de démo en cas d'erreur
        const demoProducts = {
            clothing: [
                {id: '1', name: 'Robe Élégante', price: 49.99, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '2', name: 'Jean Slim Noir', price: 39.99, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '3', name: 'Jupe Midi', price: 34.99, image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '7', name: 'Veste Cuir', price: 79.99, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
            ],
            shoes: [
                {id: '4', name: 'Chaussures Ville', price: 59.99, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '8', name: 'Bottes Cuir', price: 69.99, image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '12', name: 'Baskets', price: 44.99, image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '13', name: 'Sandales', price: 29.99, image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
            ],
            jewelry: [
                {id: '5', name: 'Collier', price: 24.99, image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '9', name: 'Boucles Oreilles', price: 29.99, image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '14', name: 'Bracelet', price: 39.99, image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '15', name: 'Montre', price: 89.99, image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
            ],
            accessories: [
                {id: '6', name: 'Sac Main', price: 45.99, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '10', name: 'Écharpe', price: 19.99, image: 'https://images.unsplash.com/photo-1576872381144-d6c6801d1c34?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '16', name: 'Ceinture', price: 34.99, image: 'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'},
                {id: '17', name: 'Lunettes', price: 59.99, image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'}
            ]
        };
        
        displayCategoryProducts(category, demoProducts[category] || []);
    }
}

// Afficher les produits d'une catégorie
function displayCategoryProducts(category, products) {
    const container = document.getElementById(`${category}-products`).querySelector('.products-grid');
    
    if (!products || products.length === 0) {
        container.innerHTML = `
            <div class="no-products">
                <i class="fas fa-box-open"></i>
                <p>Aucun produit disponible dans cette catégorie</p>
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

// Créer une carte produit
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    
    const imageUrl = product.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80';
    const price = product.price ? `€${parseFloat(product.price).toFixed(2)}` : '€0.00';
    
    // Traductions
    const addToCartText = translations[currentLanguage]?.add_to_cart || 'Add to Cart';
    const viewDetailsText = translations[currentLanguage]?.view_details || 'View Details';
    
    card.innerHTML = `
        <img src="${imageUrl}" alt="${product.name}" class="product-image">
        <div class="product-details">
            <h3 class="product-title">${product.name}</h3>
            <p class="product-price">${price}</p>
            <div class="product-actions">
                <button class="add-to-cart" onclick="addToCart('${product.id}')">${addToCartText}</button>
                <button class="view-details" onclick="viewProductDetails('${product.id}')">${viewDetailsText}</button>
            </div>
        </div>
    `;
    
    return card;
}
