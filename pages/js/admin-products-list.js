// Gestion de la liste des produits dans l'administration

class AdminProductsList {
    constructor() {
        this.apiUrl = 'https://es-company-api.onrender.com/api';
        this.products = [];
        this.filteredProducts = [];
        this.categories = [];
        this.currentPage = 1;
        this.itemsPerPage = 15;
        this.totalPages = 1;
        this.currentFilters = {
            search: '',
            category: '',
            status: '',
            sort: 'createdAt:desc'
        };
        
        this.init();
    }
    
    async init() {
        // Vérifier l'authentification
        if (!window.adminAuth || !window.adminAuth.token) {
            window.location.href = 'login.html';
            return;
        }
        
        // Charger les catégories
        await this.loadCategories();
        
        // Charger les produits
        await this.loadProducts();
        
        // Initialiser les événements
        this.initEvents();
        
        // Afficher les produits
        this.displayProducts();
    }
    
    async loadCategories() {
        try {
            const response = await fetch(`${this.apiUrl}/categories`);
            const data = await response.json();
            
            if (data.success) {
                this.categories = data.data;
                this.populateCategoryFilter();
            }
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        }
    }
    
    populateCategoryFilter() {
        const filter = document.getElementById('categoryFilter');
        if (!filter) return;
        
        // Vider les options existantes (sauf la première)
        while (filter.options.length > 1) {
            filter.remove(1);
        }
        
        // Ajouter les catégories
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category._id;
            option.textContent = category.name;
            filter.appendChild(option);
        });
    }
    
    async loadProducts() {
        try {
            const response = await window.adminAuth.fetchWithAuth('/products?limit=1000');
            const data = await response.json();
            
            if (data.success) {
                this.products = data.data;
                this.filteredProducts = [...this.products];
                this.updateProductsCount();
            }
        } catch (error) {
            console.error('Erreur chargement produits:', error);
            this.showError('Erreur lors du chargement des produits');
        }
    }
    
    initEvents() {
        // Recherche
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value;
                this.applyFilters();
            });
        }
        
        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }
        
        // Filtres
        const categoryFilter = document.getElementById('categoryFilter');
        const statusFilter = document.getElementById('statusFilter');
        const sortFilter = document.getElementById('sortFilter');
        
        if (categoryFilter) {
            categoryFilter.addEventListener('change', (e) => {
                this.currentFilters.category = e.target.value;
                this.applyFilters();
            });
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', (e) => {
                this.currentFilters.status = e.target.value;
                this.applyFilters();
            });
        }
        
        if (sortFilter) {
            sortFilter.addEventListener('change', (e) => {
                this.currentFilters.sort = e.target.value;
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
        
        // Actions sur les produits (éditer, supprimer)
        document.addEventListener('click', async (e) => {
            if (e.target.closest('.edit-btn')) {
                const productId = e.target.closest('.edit-btn').getAttribute('data-id');
                this.editProduct(productId);
            }
            
            if (e.target.closest('.delete-btn')) {
                const productId = e.target.closest('.delete-btn').getAttribute('data-id');
                this.deleteProduct(productId);
            }
        });
    }
    
    applyFilters() {
        this.filteredProducts = this.products.filter(product => {
            // Recherche
            if (this.currentFilters.search) {
                const searchTerm = this.currentFilters.search.toLowerCase();
                const productName = product.name ? product.name.toLowerCase() : '';
                const productSku = product.sku ? product.sku.toLowerCase() : '';
                const productDesc = product.description ? product.description.toLowerCase() : '';
                
                if (!productName.includes(searchTerm) && 
                    !productSku.includes(searchTerm) && 
                    !productDesc.includes(searchTerm)) {
                    return false;
                }
            }
            
            // Filtre par catégorie
            if (this.currentFilters.category && product.category) {
                const categoryId = typeof product.category === 'object' ? 
                    product.category._id : product.category;
                
                if (categoryId !== this.currentFilters.category) {
                    return false;
                }
            }
            
            // Filtre par statut
            if (this.currentFilters.status && product.status !== this.currentFilters.status) {
                return false;
            }
            
            return true;
        });
        
        this.applySort();
        this.currentPage = 1;
        this.displayProducts();
        this.updateProductsCount();
    }
    
    applySort() {
        const [sortField, sortOrder] = this.currentFilters.sort.split(':');
        
        this.filteredProducts.sort((a, b) => {
            let aValue = a[sortField];
            let bValue = b[sortField];
            
            if (sortField === 'name') {
                aValue = aValue ? aValue.toLowerCase() : '';
                bValue = bValue ? bValue.toLowerCase() : '';
            }
            
            if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
            if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
            return 0;
        });
    }
    
    applyFiltersAndSort() {
        this.applyFilters();
    }
    
    displayProducts() {
        const tbody = document.getElementById('productsTableBody');
        if (!tbody) return;
        
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
        
        // Vider le tableau
        tbody.innerHTML = '';
        
        if (pageProducts.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">
                        <i class="fas fa-search"></i>
                        <p>Aucun produit trouvé</p>
                        <p>Essayez de modifier vos filtres de recherche</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        // Ajouter chaque produit
        pageProducts.forEach(product => {
            const row = this.createProductRow(product);
            tbody.appendChild(row);
        });
    }
    
    createProductRow(product) {
        const row = document.createElement('tr');
        
        // Informations produit
        const imageUrl = product.images && product.images.length > 0 ? 
            product.images.find(img => img.isMain)?.url || product.images[0].url : 
            'https://via.placeholder.com/60x60?text=No+Image';
        
        const categoryName = product.category ? 
            (typeof product.category === 'object' ? product.category.name : 'Inconnue') : 
            'Inconnue';
        
        // Statut
        const statusText = {
            'active': 'Actif',
            'draft': 'Brouillon',
            'archived': 'Archivé',
            'out_of_stock': 'Rupture'
        }[product.status] || product.status;
        
        const statusClass = `status-${product.status}`;
        
        // Stock
        const stockText = product.trackQuantity ? 
            `${product.quantity || 0} unités` : 
            'Non suivi';
        
        row.innerHTML = `
            <td>
                <div class="product-cell">
                    <img src="${imageUrl}" alt="${product.name}" class="product-image-small">
                    <div class="product-info">
                        <h4>${product.name}</h4>
                        <p>${product.sku || 'Pas de SKU'}</p>
                    </div>
                </div>
            </td>
            <td>${categoryName}</td>
            <td>$${product.price ? product.price.toFixed(2) : '0.00'}</td>
            <td>${stockText}</td>
            <td><span class="status-badge ${statusClass}">${statusText}</span></td>
            <td>
                <div class="table-actions">
                    <button class="action-btn edit-btn" data-id="${product._id}" title="Modifier">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" data-id="${product._id}" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }
    
    updateProductsCount() {
        const countElement = document.getElementById('productsCount');
        if (!countElement) return;
        
        countElement.textContent = `${this.filteredProducts.length} produit(s)`;
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
    
   
