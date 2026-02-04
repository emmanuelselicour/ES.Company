// Gestion de la page produits avec filtres et pagination

class ProductsPage {
    constructor() {
        this.apiUrl = 'https://es-company-api.onrender.com/api';
        this.products = [];
        this.filteredProducts = [];
        this.categories = [];
        this.currentFilters = {
            category: [],
            minPrice: null,
            maxPrice: null,
            inStock: false,
            featured: false
        };
        this.currentSort = 'createdAt:desc';
        this.currentPage = 1;
        this.itemsPerPage = 12;
        this.totalPages = 1;
        
        this.init();
    }
    
    async init() {
        // Charger les produits
        await this.loadProducts();
        
        // Charger les catégories
        await this.loadCategories();
        
        // Initialiser les événements
        this.initEvents();
        
        // Afficher les produits
        this.displayProducts();
        
        // Rendre les filtres
        this.renderCategoryFilters();
    }
    
    async loadProducts() {
        try {
            const response = await fetch(`${this.apiUrl}/products?limit=100`);
            const data = await response.json();
            
            if (data.success) {
                this.products = data.data;
                this.filteredProducts = [...this.products];
                this.updateProductsCount();
            }
        } catch (error) {
            console.error('Erreur chargement produits:', error);
            // Fallback aux produits par défaut
            this.loadDefaultProducts();
        }
    }
    
    loadDefaultProducts() {
        // Produits par défaut (similaire à product-shuffler.js)
        this.products = [
            {
                _id: 1,
                name: "Robe Élégante",
                name_en: "Elegant Dress",
                name_es: "Vestido Elegante",
                category: { _id: 1, name: "Robes", name_en: "Dresses", name_es: "Vestidos" },
                price: 59.99,
                image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
                description: "Robe légère pour l'été",
                quantity: 10,
                status: "active"
            },
            // Ajouter plus de produits par défaut...
        ];
        this.filteredProducts = [...this.products];
        this.updateProductsCount();
    }
    
    async loadCategories() {
        try {
            const response = await fetch(`${this.apiUrl}/categories`);
            const data = await response.json();
            
            if (data.success) {
                this.categories = data.data;
            }
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        }
    }
    
    initEvents() {
        // Toggle des filtres
        const filterToggle = document.getElementById('filterToggle');
        const filtersPanel = document.getElementById('filtersPanel');
        const closeFilters = document.getElementById('closeFilters');
        
        if (filterToggle && filtersPanel) {
            filterToggle.addEventListener('click', () => {
                filtersPanel.classList.toggle('active');
            });
        }
        
        if (closeFilters && filtersPanel) {
            closeFilters.addEventListener('click', () => {
                filtersPanel.classList.remove('active');
            });
        }
        
        // Tri
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) {
            sortSelect.addEventListener('change', (e) => {
                this.currentSort = e.target.value;
                this.applyFiltersAndSort();
            });
        }
        
        // Rafraîchir produits
        const refreshBtn = document.getElementById('refreshProducts');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.shuffleProducts();
            });
        }
        
        // Appliquer les filtres
        const applyFiltersBtn = document.getElementById('applyFilters');
        if (applyFiltersBtn) {
            applyFiltersBtn.addEventListener('click', () => {
                this.updateFiltersFromUI();
                this.applyFiltersAndSort();
                filtersPanel.classList.remove('active');
            });
        }
        
        // Effacer les filtres
        const clearFiltersBtn = document.getElementById('clearFilters');
        if (clearFiltersBtn) {
            clearFiltersBtn.addEventListener('click', () => {
                this.clearFilters();
                this.applyFiltersAndSort();
            });
        }
        
        // Pagination
        document.addEventListener('click', (e) => {
            if (e.target.closest('#prevPage')) {
                this.prevPage();
            }
            
            if (e.target.closest('#nextPage')) {
                this.nextPage();
            }
            
            if (e.target.closest('.page-number')) {
                const page = parseInt(e.target.closest('.page-number').getAttribute('data-page'));
                this.goToPage(page);
            }
        });
    }
    
    updateFiltersFromUI() {
        // Catégories
        const categoryCheckboxes = document.querySelectorAll('.category-filter:checked');
        this.currentFilters.category = Array.from(categoryCheckboxes).map(cb => cb.value);
        
        // Prix
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        this.currentFilters.minPrice = minPrice ? parseFloat(minPrice) : null;
        this.currentFilters.maxPrice = maxPrice ? parseFloat(maxPrice) : null;
        
        // Disponibilité
        this.currentFilters.inStock = document.getElementById('inStock').checked;
        this.currentFilters.featured = document.getElementById('featured').checked;
    }
    
    clearFilters() {
        // Réinitialiser les filtres
        this.currentFilters = {
            category: [],
            minPrice: null,
            maxPrice: null,
            inStock: false,
            featured: false
        };
        
        // Réinitialiser l'UI
        document.querySelectorAll('.category-filter').forEach(cb => {
            cb.checked = false;
        });
        
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        document.getElementById('inStock').checked = false;
        document.getElementById('featured').checked = false;
    }
    
    applyFiltersAndSort() {
        // Appliquer les filtres
        this.filteredProducts = this.products.filter(product => {
            // Filtrer par catégorie
            if (this.currentFilters.category.length > 0) {
                if (!product.category || !this.currentFilters.category.includes(product.category._id.toString())) {
                    return false;
                }
            }
            
            // Filtrer par prix
            if (this.currentFilters.minPrice !== null && product.price < this.currentFilters.minPrice) {
                return false;
            }
            
            if (this.currentFilters.maxPrice !== null && product.price > this.currentFilters.maxPrice) {
                return false;
            }
            
            // Filtrer par disponibilité
            if (this.currentFilters.inStock && (!product.quantity || product.quantity <= 0)) {
                return false;
            }
            
            // Filtrer par produits en vedette
            if (this.currentFilters.featured && !product.isFeatured) {
                return false;
            }
            
            // Filtrer par statut
            if (product.status !== 'active') {
                return false;
            }
            
            return true;
        });
        
        // Appliquer le tri
        this.sortProducts();
        
        // Réinitialiser à la première page
        this.currentPage = 1;
        
        // Afficher les produits
        this.displayProducts();
        this.updateProductsCount();
    }
    
    sortProducts() {
        const [sortField, sortOrder] = this.currentSort.split(':');
        
        this.filteredProducts.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];
            
            // Pour les champs imbriqués (comme category.name)
            if (sortField === 'category') {
                const currentLang = document.documentElement.classList.contains('lang-en') ? 'en' : 
                                   document.documentElement.classList.contains('lang-es') ? 'es' : 'fr';
                
                const fieldName = `name${currentLang === 'fr' ? '' : '_' + currentLang}`;
                aValue = a.category ? a.category[fieldName] || a.category.name : '';
                bValue = b.category ? b.category[fieldName] || b.category.name : '';
            }
            
            // Conversion pour les comparaisons
            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }
            
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    shuffleProducts() {
        // Algorithme de mélange Fisher-Yates
        for (let i = this.filteredProducts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.filteredProducts[i], this.filteredProducts[j]] = [this.filteredProducts[j], this.filteredProducts[i]];
        }
        
        // Animation du bouton
        const refreshBtn = document.getElementById('refreshProducts');
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt fa-spin"></i>';
        setTimeout(() => {
            refreshBtn.innerHTML = '<i class="fas fa-random"></i> <span data-lang="fr">Mélanger</span><span data-lang="en">Shuffle</span><span data-lang="es">Mezclar</span>';
        }, 500);
        
        // Réinitialiser à la première page
        this.currentPage = 1;
        
        // Afficher les produits
        this.displayProducts();
    }
    
    renderCategoryFilters() {
        const container = document.getElementById('categoryFilters');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.categories.forEach(category => {
            const currentLang = document.documentElement.classList.contains('lang-en') ? 'en' : 
                               document.documentElement.classList.contains('lang-es') ? 'es' : 'fr';
            
            const categoryName = category[`name${currentLang === 'fr' ? '' : '_' + currentLang}`] || category.name;
            
            const div = document.createElement('div');
            div.className = 'filter-option';
            div.innerHTML = `
                <input type="checkbox" class="category-filter" id="cat-${category._id}" value="${category._id}">
                <label for="cat-${category._id}">${categoryName}</label>
            `;
            
            container.appendChild(div);
        });
        
        // Ajouter les événements aux nouvelles checkboxes
        document.querySelectorAll('.category-filter').forEach(cb => {
            cb.addEventListener('change', () => {
                this.updateFiltersFromUI();
                this.applyFiltersAndSort();
            });
        });
    }
    
    displayProducts() {
        const container = document.getElementById('productsContainer');
        if (!container) return;
        
        // Calculer les produits pour la page actuelle
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const pageProducts = this.filteredProducts.slice(startIndex, endIndex);
        
        // Calculer le nombre total de pages
        this.totalPages = Math.ceil(this.filteredProducts.length / this.itemsPerPage);
        
        // Afficher ou masquer la pagination
        const pagination = document.getElementById('pagination');
        if (pagination) {
            pagination.style.display = this.totalPages > 1 ? 'flex' : 'none';
            this.renderPagination();
        }
        
        // Vider le conteneur
        container.innerHTML = '';
        
        // Obtenir la langue actuelle
        const currentLang = document.documentElement.classList.contains('lang-en') ? 'en' : 
                           document.documentElement.classList.contains('lang-es') ? 'es' : 'fr';
        
        if (pageProducts.length === 0) {
            // Afficher un message "aucun produit"
            container.innerHTML = `
                <div class="no-products">
                    <i class="fas fa-search"></i>
                    <h3 data-lang="fr">Aucun produit trouvé</h3>
                    <h3 data-lang="en">No products found</h3>
                    <h3 data-lang="es">No se encontraron productos</h3>
                    <p data-lang="fr">Essayez de modifier vos filtres ou recherchez autre chose</p>
                    <p data-lang="en">Try adjusting your filters or search for something else</p>
                    <p data-lang="es">Intente ajustar sus filtros o buscar algo más</p>
                    <button class="btn btn-outline" id="clearAllFilters" style="margin-top: 20px;">
                        <span data-lang="fr">Effacer tous les filtres</span>
                        <span data-lang="en">Clear all filters</span>
                        <span data-lang="es">Limpiar todos los filtros</span>
                    </button>
                </div>
            `;
            
            // Ajouter l'événement pour effacer les filtres
            const clearAllBtn = document.getElementById('clearAllFilters');
            if (clearAllBtn) {
                clearAllBtn.addEventListener('click', () => {
                    this.clearFilters();
                    this.applyFiltersAndSort();
                });
            }
            
            return;
        }
        
        // Ajouter chaque produit
        pageProducts.forEach(product => {
            const productCard = this.createProductCard(product, currentLang);
            container.appendChild(productCard);
        });
    }
    
    createProductCard(product, lang) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        // Sélectionner le texte selon la langue
        const name = product[`name${lang === 'fr' ? '' : '_' + lang}`] || product.name;
        const category = product.category ? 
            (product.category[`name${lang === 'fr' ? '' : '_' + lang}`] || product.category.name) : 
            '';
        
        const description = product[`description${lang === 'fr' ? '' : '_' + lang}`] || product.description;
        const imageUrl = product.images && product.images.length > 0 ? 
            product.images.find(img => img.isMain)?.url || product.images[0].url : 
            product.image;
        
        card.innerHTML = `
            <div class="product-image">
                <img src="${imageUrl}" alt="${name}" loading="lazy">
                ${product.isFeatured ? '<span class="featured-badge">★</span>' : ''}
            </div>
            <div class="product-info">
                <span class="product-category">${category}</span>
                <h3 class="product-title">${name}</h3>
                <p class="product-description">${description.substring(0, 80)}...</p>
                <div class="product-price">$${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="add-to-cart" data-id="${product._id}">
                        <i class="fas fa-cart-plus"></i> 
                        <span data-lang="fr">Ajouter</span>
                        <span data-lang="en">Add</span>
                        <span data-lang="es">Añadir</span>
                    </button>
                    <button class="view-details" data-id="${product._id}">
                        <i class="fas fa-eye"></i> 
                        <span data-lang="fr">Voir</span>
                        <span data-lang="en">View</span>
                        <span data-lang="es">Ver</span>
                    </button>
                </div>
            </div>
        `;
        
        // Ajouter un badge "En stock" si la quantité est faible
        if (product.quantity && product.quantity < 5 && product.quantity > 0) {
            const stockBadge = document.createElement('span');
            stockBadge.className = 'stock-badge';
            stockBadge.textContent = `${product.quantity} restant(s)`;
            card.querySelector('.product-info').insertBefore(stockBadge, card.querySelector('.product-price'));
        }
        
        return card;
    }
    
    updateProductsCount() {
        const countElement = document.getElementById('productsCount');
        if (!countElement) return;
        
        const currentLang = document.documentElement.classList.contains('lang-en') ? 'en' : 
                           document.documentElement.classList.contains('lang-es') ? 'es' : 'fr';
        
        if (currentLang === 'fr') {
            countElement.textContent = `${this.filteredProducts.length} produit(s) trouvé(s)`;
        } else if (currentLang === 'en') {
            countElement.textContent = `${this.filteredProducts.length} product(s) found`;
        } else {
            countElement.textContent = `${this.filteredProducts.length} producto(s) encontrado(s)`;
        }
    }
    
    renderPagination() {
        const pageNumbers = document.getElementById('pageNumbers');
        const prevBtn = document.getElementById('prevPage');
        const nextBtn = document.getElementById('nextPage');
        
        if (!pageNumbers || !prevBtn || !nextBtn) return;
        
        // Mettre à jour les boutons précédent/suivant
        prevBtn.disabled = this.currentPage === 1;
        prevBtn.classList.toggle('disabled', this.currentPage === 1);
        
        nextBtn.disabled = this.currentPage === this.totalPages;
        nextBtn.classList.toggle('disabled', this.currentPage === this.totalPages);
        
        // Générer les numéros de page
        pageNumbers.innerHTML = '';
        
        // Toujours afficher la première page
        this.addPageNumber(pageNumbers, 1);
        
        // Calculer les pages à afficher
        let startPage = Math.max(2, this.currentPage - 1);
        let endPage = Math.min(this.totalPages - 1, this.currentPage + 1);
        
        // Ajouter des ellipses si nécessaire
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pageNumbers.appendChild(ellipsis);
        }
        
        // Ajouter les pages intermédiaires
        for (let i = startPage; i <= endPage; i++) {
            this.addPageNumber(pageNumbers, i);
        }
        
        // Ajouter des ellipses si nécessaire
        if (endPage < this.totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pageNumbers.appendChild(ellipsis);
        }
        
        // Toujours afficher la dernière page si différente de la première
        if (this.totalPages > 1) {
            this.addPageNumber(pageNumbers, this.totalPages);
        }
    }
    
    addPageNumber(container, pageNumber) {
        const pageEl = document.createElement('button');
        pageEl.className = 'page-number';
        pageEl.textContent = pageNumber;
        pageEl.setAttribute('data-page', pageNumber);
        
        if (pageNumber === this.currentPage) {
            pageEl.classList.add('active');
        }
        
        container.appendChild(pageEl);
    }
    
    prevPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.displayProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.displayProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
    
    goToPage(page) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.currentPage = page;
            this.displayProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }
}

// Initialiser la page produits
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si nous sommes sur la page produits
    if (window.location.pathname.includes('products.html') || 
        document.querySelector('.products-page')) {
        window.productsPage = new ProductsPage();
    }
});
