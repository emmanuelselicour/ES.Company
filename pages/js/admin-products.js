// Gestion des produits dans l'admin
document.addEventListener('DOMContentLoaded', function() {
    initProductsManagement();
    loadProducts();
    initEventListeners();
});

// Variables globales
let products = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 10;
let selectedProducts = new Set();

// Initialiser la gestion des produits
function initProductsManagement() {
    // Initialiser DataTables
    $('#products-table').DataTable({
        pageLength: productsPerPage,
        lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Tous"]],
        language: {
            url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json'
        },
        dom: '<"table-controls"fl>rt<"table-footer"ip>',
        responsive: true,
        columnDefs: [
            { orderable: false, targets: [0, 1, 8] }
        ]
    });
}

// Charger les produits
async function loadProducts() {
    try {
        showLoading();
        
        // Simulation - dans une vraie app, on ferait une requête API
        // const response = await fetch(`${API_URL}/api/admin/products`);
        // products = await response.json();
        
        // Pour la démo, on utilise des données fictives
        await simulateAPICall();
        
        filteredProducts = [...products];
        updateProductsTable();
        updateStatistics();
        hideLoading();
        
    } catch (error) {
        console.error('Error loading products:', error);
        Swal.fire('Erreur', 'Impossible de charger les produits', 'error');
        hideLoading();
    }
}

// Simuler un appel API
function simulateAPICall() {
    return new Promise((resolve) => {
        setTimeout(() => {
            products = [
                {
                    id: '1',
                    sku: 'PROD-001',
                    name: 'Robe Élégante',
                    category: 'clothing',
                    subcategory: 'Robes',
                    price: 49.99,
                    comparePrice: 59.99,
                    cost: 25.00,
                    stock: 8,
                    lowStockThreshold: 5,
                    description: 'Robe élégante pour occasions spéciales',
                    images: ['https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                    weight: 0.5,
                    dimensions: '30x20x5',
                    tags: ['robe', 'élégant', 'soirée'],
                    active: true,
                    featured: true,
                    createdAt: '2023-06-01',
                    updatedAt: '2023-06-15'
                },
                {
                    id: '2',
                    sku: 'PROD-002',
                    name: 'Jean Slim Noir',
                    category: 'clothing',
                    subcategory: 'Pantalons',
                    price: 39.99,
                    comparePrice: 49.99,
                    cost: 20.00,
                    stock: 22,
                    lowStockThreshold: 5,
                    description: 'Jean slim noir élégant',
                    images: ['https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                    weight: 0.8,
                    dimensions: '40x30x5',
                    tags: ['jean', 'pantalon', 'slim'],
                    active: true,
                    featured: false,
                    createdAt: '2023-06-02',
                    updatedAt: '2023-06-10'
                },
                {
                    id: '3',
                    sku: 'PROD-003',
                    name: 'Chaussures de Ville en Cuir',
                    category: 'shoes',
                    subcategory: 'Chaussures de ville',
                    price: 59.99,
                    comparePrice: 79.99,
                    cost: 30.00,
                    stock: 12,
                    lowStockThreshold: 5,
                    description: 'Chaussures de ville en cuir véritable',
                    images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                    weight: 1.2,
                    dimensions: '35x25x15',
                    tags: ['chaussures', 'cuir', 'ville'],
                    active: true,
                    featured: true,
                    createdAt: '2023-06-03',
                    updatedAt: '2023-06-12'
                },
                {
                    id: '4',
                    sku: 'PROD-004',
                    name: 'Collier en Argent 925',
                    category: 'jewelry',
                    subcategory: 'Colliers',
                    price: 24.99,
                    comparePrice: 34.99,
                    cost: 10.00,
                    stock: 30,
                    lowStockThreshold: 5,
                    description: 'Collier élégant en argent 925',
                    images: ['https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                    weight: 0.1,
                    dimensions: '20x10x5',
                    tags: ['collier', 'argent', 'bijoux'],
                    active: true,
                    featured: false,
                    createdAt: '2023-06-04',
                    updatedAt: '2023-06-08'
                },
                {
                    id: '5',
                    sku: 'PROD-005',
                    name: 'Sac à Main en Cuir',
                    category: 'accessories',
                    subcategory: 'Sacs',
                    price: 45.99,
                    comparePrice: 59.99,
                    cost: 25.00,
                    stock: 3,
                    lowStockThreshold: 5,
                    description: 'Sac à main en cuir véritable',
                    images: ['https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                    weight: 0.7,
                    dimensions: '30x20x15',
                    tags: ['sac', 'cuir', 'main'],
                    active: true,
                    featured: true,
                    createdAt: '2023-06-05',
                    updatedAt: '2023-06-14'
                },
                {
                    id: '6',
                    sku: 'PROD-006',
                    name: 'Veste en Cuir Moto',
                    category: 'clothing',
                    subcategory: 'Vestes',
                    price: 79.99,
                    comparePrice: 99.99,
                    cost: 40.00,
                    stock: 10,
                    lowStockThreshold: 5,
                    description: 'Veste en cuir style moto',
                    images: ['https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                    weight: 1.5,
                    dimensions: '50x40x10',
                    tags: ['veste', 'cuir', 'moto'],
                    active: true,
                    featured: false,
                    createdAt: '2023-06-06',
                    updatedAt: '2023-06-13'
                },
                {
                    id: '7',
                    sku: 'PROD-007',
                    name: 'Bottes Classiques en Cuir',
                    category: 'shoes',
                    subcategory: 'Bottes',
                    price: 69.99,
                    comparePrice: 89.99,
                    cost: 35.00,
                    stock: 14,
                    lowStockThreshold: 5,
                    description: 'Bottes en cuir véritable',
                    images: ['https://images.unsplash.com/photo-1547887537-6158d64c35b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                    weight: 1.8,
                    dimensions: '35x25x20',
                    tags: ['bottes', 'cuir', 'classique'],
                    active: true,
                    featured: false,
                    createdAt: '2023-06-07',
                    updatedAt: '2023-06-11'
                },
                {
                    id: '8',
                    sku: 'PROD-008',
                    name: 'Boucles d\'Oreilles Dorées',
                    category: 'jewelry',
                    subcategory: 'Boucles d\'oreilles',
                    price: 29.99,
                    comparePrice: 39.99,
                    cost: 12.00,
                    stock: 25,
                    lowStockThreshold: 5,
                    description: 'Boucles d\'oreilles en or jaune',
                    images: ['https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                    weight: 0.05,
                    dimensions: '10x5x3',
                    tags: ['boucles', 'or', 'bijoux'],
                    active: true,
                    featured: false,
                    createdAt: '2023-06-08',
                    updatedAt: '2023-06-09'
                },
                {
                    id: '9',
                    sku: 'PROD-009',
                    name: 'Écharpe en Laine Mérinos',
                    category: 'accessories',
                    subcategory: 'Écharpes',
                    price: 19.99,
                    comparePrice: 29.99,
                    cost: 8.00,
                    stock: 35,
                    lowStockThreshold: 5,
                    description: 'Écharpe chaleureuse en laine mérinos',
                    images: ['https://images.unsplash.com/photo-1576872381144-d6c6801d1c34?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                    weight: 0.3,
                    dimensions: '180x30x2',
                    tags: ['écharpe', 'laine', 'hiver'],
                    active: true,
                    featured: false,
                    createdAt: '2023-06-09',
                    updatedAt: '2023-06-10'
                },
                {
                    id: '10',
                    sku: 'PROD-010',
                    name: 'Pull en Cachemire',
                    category: 'clothing',
                    subcategory: 'Pulls',
                    price: 89.99,
                    comparePrice: 119.99,
                    cost: 45.00,
                    stock: 7,
                    lowStockThreshold: 5,
                    description: 'Pull doux et chaud en cachemire',
                    images: ['https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80'],
                    weight: 0.6,
                    dimensions: '45x35x8',
                    tags: ['pull', 'cachemire', 'chaud'],
                    active: true,
                    featured: true,
                    createdAt: '2023-06-10',
                    updatedAt: '2023-06-16'
                }
            ];
            resolve();
        }, 1000);
    });
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Bouton ajouter produit
    document.getElementById('add-product-btn').addEventListener('click', showAddProductModal);
    
    // Filtres
    document.getElementById('filter-category').addEventListener('change', applyFilters);
    document.getElementById('filter-status').addEventListener('change', applyFilters);
    document.getElementById('filter-price').addEventListener('change', applyFilters);
    document.getElementById('clear-filters').addEventListener('click', clearFilters);
    
    // Recherche
    document.getElementById('admin-product-search').addEventListener('input', function() {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(applyFilters, 500);
    });
    
    // Sélection globale
    document.getElementById('select-all').addEventListener('change', function() {
        const checkboxes = document.querySelectorAll('.product-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.checked = this.checked;
            const productId = checkbox.value;
            if (this.checked) {
                selectedProducts.add(productId);
            } else {
                selectedProducts.delete(productId);
            }
        });
        updateBulkActions();
    });
    
    // Actions groupées
    document.getElementById('apply-bulk-action').addEventListener('click', applyBulkAction);
    
    // Import/Export
    document.getElementById('export-products').addEventListener('click', exportProducts);
    document.getElementById('import-products').addEventListener('click', showImportModal);
    document.getElementById('download-template').addEventListener('click', downloadCSVTemplate);
    
    // Formulaire produit
    document.getElementById('product-form').addEventListener('submit', saveProduct);
    document.getElementById('upload-images-btn').addEventListener('click', () => {
        document.getElementById('product-images').click();
    });
    
    // Upload d'images
    document.getElementById('product-images').addEventListener('change', handleImageUpload);
    
    // Drag and drop pour images
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    if (uploadPlaceholder) {
        uploadPlaceholder.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadPlaceholder.style.backgroundColor = '#f0f8ff';
        });
        
        uploadPlaceholder.addEventListener('dragleave', () => {
            uploadPlaceholder.style.backgroundColor = '';
        });
        
        uploadPlaceholder.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadPlaceholder.style.backgroundColor = '';
            const files = e.dataTransfer.files;
            handleImageFiles(files);
        });
        
        uploadPlaceholder.addEventListener('click', () => {
            document.getElementById('product-images').click();
        });
    }
    
    // Formulaire modification rapide
    document.getElementById('quick-edit-form').addEventListener('submit', saveQuickEdit);
    
    // Fermer les modals
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
}

// Mettre à jour le tableau des produits
function updateProductsTable() {
    const tbody = document.getElementById('products-table-body');
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const currentProducts = filteredProducts.slice(startIndex, endIndex);
    
    tbody.innerHTML = '';
    
    currentProducts.forEach(product => {
        const row = createProductRow(product);
        tbody.appendChild(row);
    });
    
    updatePagination();
    updateStatistics();
}

// Créer une ligne de produit
function createProductRow(product) {
    const row = document.createElement('tr');
    row.dataset.id = product.id;
    
    // Statut du stock
    let stockStatus = 'success';
    let stockText = product.stock;
    
    if (product.stock === 0) {
        stockStatus = 'danger';
        stockText = 'Hors stock';
    } else if (product.stock <= product.lowStockThreshold) {
        stockStatus = 'warning';
        stockText = `${product.stock} (Faible)`;
    }
    
    // Statut actif
    const status = product.active ? 'Actif' : 'Inactif';
    const statusClass = product.active ? 'success' : 'secondary';
    
    row.innerHTML = `
        <td>
            <input type="checkbox" class="product-checkbox" value="${product.id}">
        </td>
        <td>
            <img src="${product.images[0] || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80'}" 
                 alt="${product.name}" 
                 class="product-thumbnail">
        </td>
        <td>
            <div class="product-info">
                <strong>${product.name}</strong>
                <small>${product.sku}</small>
            </div>
        </td>
        <td>
            <span class="category-badge">${getCategoryName(product.category)}</span>
            ${product.subcategory ? `<small>${product.subcategory}</small>` : ''}
        </td>
        <td>
            <strong>€${product.price.toFixed(2)}</strong>
            ${product.comparePrice ? `<br><small class="text-muted"><s>€${product.comparePrice.toFixed(2)}</s></small>` : ''}
        </td>
        <td>
            <span class="stock-badge ${stockStatus}">${stockText}</span>
        </td>
        <td>
            <span class="status-badge ${statusClass}">${status}</span>
        </td>
        <td>${formatDate(product.createdAt)}</td>
        <td>
            <div class="action-buttons">
                <button class="btn-icon view" onclick="viewProduct('${product.id}')" title="Voir">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-icon edit" onclick="editProduct('${product.id}')" title="Éditer">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-icon quick-edit" onclick="quickEditProduct('${product.id}')" title="Modification rapide">
                    <i class="fas fa-bolt"></i>
                </button>
                <button class="btn-icon delete" onclick="deleteProduct('${product.id}')" title="Supprimer">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </td>
    `;
    
    // Gérer la sélection de la checkbox
    const checkbox = row.querySelector('.product-checkbox');
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            selectedProducts.add(product.id);
        } else {
            selectedProducts.delete(product.id);
        }
        updateBulkActions();
        updateSelectAllCheckbox();
    });
    
    return row;
}

// Obtenir le nom de la catégorie
function getCategoryName(category) {
    const categories = {
        'clothing': 'Vêtements',
        'shoes': 'Chaussures',
        'jewelry': 'Bijoux',
        'accessories': 'Accessoires'
    };
    return categories[category] || category;
}

// Formater la date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR');
}

// Mettre à jour la pagination
function updatePagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const currentPageEl = document.getElementById('current-page');
    const prevBtn = document.getElementById('prev-page');
    const nextBtn = document.getElementById('next-page');
    const paginationInfo = document.getElementById('pagination-info');
    
    if (currentPageEl) currentPageEl.textContent = currentPage;
    if (prevBtn) prevBtn.disabled = currentPage === 1;
    if (nextBtn) nextBtn.disabled = currentPage === totalPages || totalPages === 0;
    
    if (paginationInfo) {
        const start = ((currentPage - 1) * productsPerPage) + 1;
        const end = Math.min(currentPage * productsPerPage, filteredProducts.length);
        paginationInfo.textContent = `Affichage de ${start} à ${end} sur ${filteredProducts.length} produits`;
    }
    
    // Écouteurs pour les boutons de pagination
    if (prevBtn) {
        prevBtn.onclick = () => {
            if (currentPage > 1) {
                currentPage--;
                updateProductsTable();
            }
        };
    }
    
    if (nextBtn) {
        nextBtn.onclick = () => {
            if (currentPage < totalPages) {
                currentPage++;
                updateProductsTable();
            }
        };
    }
}

// Mettre à jour les statistiques
function updateStatistics() {
    const total = products.length;
    const inStock = products.filter(p => p.stock > 0 && p.active).length;
    const lowStock = products.filter(p => p.stock > 0 && p.stock <= p.lowStockThreshold).length;
    const outOfStock = products.filter(p => p.stock === 0).length;
    
    document.getElementById('total-products').textContent = total;
    document.getElementById('in-stock').textContent = inStock;
    document.getElementById('low-stock').textContent = lowStock;
    document.getElementById('out-of-stock').textContent = outOfStock;
}

// Appliquer les filtres
function applyFilters() {
    const category = document.getElementById('filter-category').value;
    const status = document.getElementById('filter-status').value;
    const price = document.getElementById('filter-price').value;
    const search = document.getElementById('admin-product-search').value.toLowerCase();
    
    filteredProducts = products.filter(product => {
        let matches = true;
        
        // Filtre par catégorie
        if (category && product.category !== category) {
            matches = false;
        }
        
        // Filtre par statut
        if (status && matches) {
            switch(status) {
                case 'active':
                    if (!product.active) matches = false;
                    break;
                case 'inactive':
                    if (product.active) matches = false;
                    break;
                case 'low_stock':
                    if (product.stock > product.lowStockThreshold || product.stock === 0) matches = false;
                    break;
                case 'out_of_stock':
                    if (product.stock > 0) matches = false;
                    break;
            }
        }
        
        // Filtre par prix
        if (price && matches) {
            switch(price) {
                case '0-50':
                    if (product.price < 0 || product.price > 50) matches = false;
                    break;
                case '50-100':
                    if (product.price < 50 || product.price > 100) matches = false;
                    break;
                case '100-200':
                    if (product.price < 100 || product.price > 200) matches = false;
                    break;
                case '200+':
                    if (product.price < 200) matches = false;
                    break;
            }
        }
        
        // Filtre par recherche
        if (search && matches) {
            const searchIn = `${product.name} ${product.sku} ${product.description} ${product.tags}`.toLowerCase();
            if (!searchIn.includes(search)) {
                matches = false;
            }
        }
        
        return matches;
    });
    
    currentPage = 1;
    updateProductsTable();
}

// Effacer les filtres
function clearFilters() {
    document.getElementById('filter-category').value = '';
    document.getElementById('filter-status').value = '';
    document.getElementById('filter-price').value = '';
    document.getElementById('admin-product-search').value = '';
    
    filteredProducts = [...products];
    currentPage = 1;
    updateProductsTable();
}

// Mettre à jour la checkbox "Tout sélectionner"
function updateSelectAllCheckbox() {
    const selectAll = document.getElementById('select-all');
    const checkboxes = document.querySelectorAll('.product-checkbox');
    
    if (checkboxes.length === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
        return;
    }
    
    const checkedCount = document.querySelectorAll('.product-checkbox:checked').length;
    
    if (checkedCount === 0) {
        selectAll.checked = false;
        selectAll.indeterminate = false;
    } else if (checkedCount === checkboxes.length) {
        selectAll.checked = true;
        selectAll.indeterminate = false;
    } else {
        selectAll.checked = false;
        selectAll.indeterminate = true;
    }
}

// Mettre à jour les actions groupées
function updateBulkActions() {
    const applyBtn = document.getElementById('apply-bulk-action');
    applyBtn.disabled = selectedProducts.size === 0;
}

// Appliquer les actions groupées
function applyBulkAction() {
    const action = document.getElementById('bulk-action').value;
    
    if (!action) {
        Swal.fire('Erreur', 'Veuillez sélectionner une action', 'warning');
        return;
    }
    
    if (selectedProducts.size === 0) {
        Swal.fire('Erreur', 'Veuillez sélectionner au moins un produit', 'warning');
        return;
    }
    
    Swal.fire({
        title: 'Confirmer l\'action',
        text: `Vous allez appliquer l'action "${getActionName(action)}" à ${selectedProducts.size} produit(s).`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Confirmer',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            performBulkAction(action);
        }
    });
}

// Obtenir le nom de l'action
function getActionName(action) {
    const actions = {
        'activate': 'Activer',
        'deactivate': 'Désactiver',
        'delete': 'Supprimer',
        'update_stock': 'Mettre à jour le stock'
    };
    return actions[action] || action;
}

// Effectuer l'action groupée
function performBulkAction(action) {
    showLoading();
    
    // Simulation de l'action
    setTimeout(() => {
        selectedProducts.forEach(productId => {
            const productIndex = products.findIndex(p => p.id === productId);
            if (productIndex !== -1) {
                switch(action) {
                    case 'activate':
                        products[productIndex].active = true;
                        break;
                    case 'deactivate':
                        products[productIndex].active = false;
                        break;
                    case 'delete':
                        products.splice(productIndex, 1);
                        break;
                    case 'update_stock':
                        // Pourrait ouvrir un modal pour définir la nouvelle valeur
                        products[productIndex].stock = 10;
                        break;
                }
            }
        });
        
        // Vider la sélection
        selectedProducts.clear();
        document.getElementById('select-all').checked = false;
        
        // Mettre à jour l'affichage
        filteredProducts = [...products];
        updateProductsTable();
        updateBulkActions();
        
        hideLoading();
        
        Swal.fire('Succès', `Action "${getActionName(action)}" appliquée avec succès`, 'success');
    }, 1000);
}

// Exporter les produits
function exportProducts() {
    Swal.fire({
        title: 'Exporter les produits',
        text: 'Sélectionnez le format d\'exportation',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'CSV',
        cancelButtonText: 'JSON',
        showDenyButton: true,
        denyButtonText: 'Excel'
    }).then((result) => {
        if (result.isConfirmed) {
            exportToCSV();
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            exportToJSON();
        } else if (result.isDenied) {
            exportToExcel();
        }
    });
}

// Exporter en CSV
function exportToCSV() {
    showLoading();
    
    setTimeout(() => {
        const csvContent = convertToCSV(products);
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `produits_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        hideLoading();
        Swal.fire('Succès', 'Export CSV terminé', 'success');
    }, 1500);
}

// Convertir en CSV
function convertToCSV(data) {
    const headers = ['SKU', 'Nom', 'Catégorie', 'Prix', 'Stock', 'Statut', 'Description'];
    const rows = data.map(product => [
        product.sku,
        `"${product.name}"`,
        getCategoryName(product.category),
        product.price,
        product.stock,
        product.active ? 'Actif' : 'Inactif',
        `"${product.description}"`
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
}

// Exporter en JSON
function exportToJSON() {
    showLoading();
    
    setTimeout(() => {
        const jsonContent = JSON.stringify(products, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `produits_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        hideLoading();
        Swal.fire('Succès', 'Export JSON terminé', 'success');
    }, 1500);
}

// Exporter en Excel (simulation)
function exportToExcel() {
    Swal.fire('Info', 'La fonctionnalité Excel nécessite une bibliothèque supplémentaire', 'info');
}

// Afficher le modal d'ajout de produit
function showAddProductModal() {
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    title.textContent = 'Ajouter un nouveau produit';
    form.reset();
    form.dataset.mode = 'add';
    form.dataset.productId = '';
    
    // Réinitialiser l'aperçu des images
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = `
        <div class="upload-placeholder" id="upload-placeholder">
            <i class="fas fa-cloud-upload-alt"></i>
            <p>Glissez-déposez des images ou cliquez pour télécharger</p>
            <span>PNG, JPG, JPEG jusqu'à 5MB</span>
        </div>
    `;
    
    modal.style.display = 'block';
    initImageUpload();
}

// Éditer un produit
function editProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('product-modal');
    const title = document.getElementById('modal-title');
    const form = document.getElementById('product-form');
    
    title.textContent = 'Éditer le produit';
    form.dataset.mode = 'edit';
    form.dataset.productId = productId;
    
    // Remplir le formulaire
    document.getElementById('product-name').value = product.name;
    document.getElementById('product-sku').value = product.sku;
    document.getElementById('product-category').value = product.category;
    document.getElementById('product-subcategory').value = product.subcategory || '';
    document.getElementById('product-price').value = product.price;
    document.getElementById('product-compare-price').value = product.comparePrice || '';
    document.getElementById('product-cost').value = product.cost || '';
    document.getElementById('product-stock').value = product.stock;
    document.getElementById('product-low-stock').value = product.lowStockThreshold;
    document.getElementById('product-description').value = product.description;
    document.getElementById('product-weight').value = product.weight || '';
    document.getElementById('product-dimensions').value = product.dimensions || '';
    document.getElementById('product-tags').value = product.tags ? product.tags.join(', ') : '';
    document.getElementById('product-active').checked = product.active;
    document.getElementById('product-featured').checked = product.featured || false;
    
    // Afficher les images
    const imagePreview = document.getElementById('image-preview');
    imagePreview.innerHTML = '';
    
    if (product.images && product.images.length > 0) {
        product.images.forEach((image, index) => {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-item';
            imgContainer.innerHTML = `
                <img src="${image}" alt="Image ${index + 1}">
                <button type="button" class="remove-image" onclick="removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            imagePreview.appendChild(imgContainer);
        });
    } else {
        imagePreview.innerHTML = `
            <div class="upload-placeholder" id="upload-placeholder">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Glissez-déposez des images ou cliquez pour télécharger</p>
                <span>PNG, JPG, JPEG jusqu'à 5MB</span>
            </div>
        `;
    }
    
    modal.style.display = 'block';
    initImageUpload();
}

// Initialiser l'upload d'images
function initImageUpload() {
    const uploadPlaceholder = document.getElementById('upload-placeholder');
    if (uploadPlaceholder) {
        uploadPlaceholder.addEventListener('click', () => {
            document.getElementById('product-images').click();
        });
    }
}

// Gérer l'upload d'images
function handleImageUpload(event) {
    const files = event.target.files;
    handleImageFiles(files);
}

// Gérer les fichiers image
function handleImageFiles(files) {
    const imagePreview = document.getElementById('image-preview');
    
    // Supprimer le placeholder s'il existe
    const placeholder = document.getElementById('upload-placeholder');
    if (placeholder) {
        placeholder.remove();
    }
    
    Array.from(files).forEach((file, index) => {
        if (!file.type.startsWith('image/')) {
            Swal.fire('Erreur', 'Seules les images sont autorisées', 'error');
            return;
        }
        
        if (file.size > 5 * 1024 * 1024) {
            Swal.fire('Erreur', 'L\'image ne doit pas dépasser 5MB', 'error');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = function(e) {
            const imgContainer = document.createElement('div');
            imgContainer.className = 'image-item';
            imgContainer.innerHTML = `
                <img src="${e.target.result}" alt="Image ${index + 1}">
                <button type="button" class="remove-image" onclick="removeImage(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            imagePreview.appendChild(imgContainer);
        };
        reader.readAsDataURL(file);
    });
}

// Supprimer une image
function removeImage(index) {
    // Dans une vraie app, on enverrait une requête pour supprimer l'image
    const imageItems = document.querySelectorAll('.image-item');
    if (imageItems[index]) {
        imageItems[index].remove();
    }
    
    // Si plus d'images, afficher le placeholder
    if (document.querySelectorAll('.image-item').length === 0) {
        const imagePreview = document.getElementById('image-preview');
        imagePreview.innerHTML = `
            <div class="upload-placeholder" id="upload-placeholder">
                <i class="fas fa-cloud-upload-alt"></i>
                <p>Glissez-déposez des images ou cliquez pour télécharger</p>
                <span>PNG, JPG, JPEG jusqu'à 5MB</span>
            </div>
        `;
        initImageUpload();
    }
}

// Sauvegarder le produit
function saveProduct(event) {
    event.preventDefault();
    
    const form = event.target;
    const mode = form.dataset.mode;
    const productId = form.dataset.productId;
    
    // Validation
    const name = document.getElementById('product-name').value;
    const price = parseFloat(document.getElementById('product-price').value);
    const stock = parseInt(document.getElementById('product-stock').value);
    
    if (!name || !price || isNaN(stock)) {
        Swal.fire('Erreur', 'Veuillez remplir tous les champs obligatoires', 'error');
        return;
    }
    
    showLoading();
    
    // Simulation de sauvegarde
    setTimeout(() => {
        const newProduct = {
            id: mode === 'add' ? `PROD-${Date.now()}` : productId,
            sku: document.getElementById('product-sku').value || `SKU-${Date.now()}`,
            name: name,
            category: document.getElementById('product-category').value,
            subcategory: document.getElementById('product-subcategory').value || '',
            price: price,
            comparePrice: document.getElementById('product-compare-price').value ? 
                parseFloat(document.getElementById('product-compare-price').value) : null,
            cost: document.getElementById('product-cost').value ? 
                parseFloat(document.getElementById('product-cost').value) : null,
            stock: stock,
            lowStockThreshold: parseInt(document.getElementById('product-low-stock').value) || 5,
            description: document.getElementById('product-description').value,
            images: getProductImages(),
            weight: document.getElementById('product-weight').value ? 
                parseFloat(document.getElementById('product-weight').value) : null,
            dimensions: document.getElementById('product-dimensions').value || '',
            tags: document.getElementById('product-tags').value ? 
                document.getElementById('product-tags').value.split(',').map(tag => tag.trim()) : [],
            active: document.getElementById('product-active').checked,
            featured: document.getElementById('product-featured').checked,
            createdAt: mode === 'add' ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString()
        };
        
        if (mode === 'add') {
            products.unshift(newProduct);
        } else {
            const index = products.findIndex(p => p.id === productId);
            if (index !== -1) {
                newProduct.createdAt = products[index].createdAt;
                products[index] = newProduct;
            }
        }
        
        filteredProducts = [...products];
        updateProductsTable();
        closeProductModal();
        hideLoading();
        
        Swal.fire('Succès', `Produit ${mode === 'add' ? 'ajouté' : 'modifié'} avec succès`, 'success');
    }, 1500);
}

// Obtenir les images du produit
function getProductImages() {
    const imageItems = document.querySelectorAll('.image-item img');
    return Array.from(imageItems).map(img => img.src);
}

// Fermer le modal produit
function closeProductModal() {
    document.getElementById('product-modal').style.display = 'none';
}

// Voir les détails d'un produit
function viewProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    Swal.fire({
        title: product.name,
        html: `
            <div style="text-align: left;">
                <p><strong>SKU:</strong> ${product.sku}</p>
                <p><strong>Catégorie:</strong> ${getCategoryName(product.category)}</p>
                <p><strong>Prix:</strong> €${product.price.toFixed(2)}</p>
                <p><strong>Stock:</strong> ${product.stock}</p>
                <p><strong>Statut:</strong> ${product.active ? 'Actif' : 'Inactif'}</p>
                <p><strong>Description:</strong> ${product.description}</p>
                <p><strong>Créé le:</strong> ${formatDate(product.createdAt)}</p>
                ${product.tags.length > 0 ? `<p><strong>Tags:</strong> ${product.tags.join(', ')}</p>` : ''}
            </div>
        `,
        imageUrl: product.images[0],
        imageWidth: 300,
        imageAlt: product.name,
        confirmButtonText: 'Fermer'
    });
}

// Modification rapide
function quickEditProduct(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quick-edit-modal');
    document.getElementById('quick-edit-id').value = productId;
    document.getElementById('quick-edit-price').value = product.price;
    document.getElementById('quick-edit-stock').value = product.stock;
    document.getElementById('quick-edit-status').value = product.active ? 'active' : 'inactive';
    
    modal.style.display = 'block';
}

// Sauvegarder la modification rapide
function saveQuickEdit(event) {
    event.preventDefault();
    
    const productId = document.getElementById('quick-edit-id').value;
    const price = parseFloat(document.getElementById('quick-edit-price').value);
    const stock = parseInt(document.getElementById('quick-edit-stock').value);
    const status = document.getElementById('quick-edit-status').value;
    
    const productIndex = products.findIndex(p => p.id === productId);
    if (productIndex !== -1) {
        products[productIndex].price = price;
        products[productIndex].stock = stock;
        products[productIndex].active = status === 'active';
        products[productIndex].updatedAt = new Date().toISOString();
        
        filteredProducts = [...products];
        updateProductsTable();
        closeQuickEditModal();
        
        Swal.fire('Succès', 'Produit mis à jour avec succès', 'success');
    }
}

// Fermer le modal de modification rapide
function closeQuickEditModal() {
    document.getElementById('quick-edit-modal').style.display = 'none';
}

// Supprimer un produit
function deleteProduct(productId) {
    Swal.fire({
        title: 'Confirmer la suppression',
        text: 'Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
    }).then((result) => {
        if (result.isConfirmed) {
            showLoading();
            
            setTimeout(() => {
                const index = products.findIndex(p => p.id === productId);
                if (index !== -1) {
                    products.splice(index, 1);
                    filteredProducts = [...products];
                    updateProductsTable();
                    
                    Swal.fire('Succès', 'Produit supprimé avec succès', 'success');
                }
                
                hideLoading();
            }, 1000);
        }
    });
}

// Afficher le modal d'importation
function showImportModal() {
    document.getElementById('import-modal').style.display = 'block';
}

// Fermer le modal d'importation
function closeImportModal() {
    document.getElementById('import-modal').style.display = 'none';
}

// Télécharger le modèle CSV
function downloadCSVTemplate() {
    const template = `SKU,Nom,Catégorie,Sous-catégorie,Prix,Prix comparé,Coût,Stock,Seuil stock bas,Description,Poids,Dimensions,Tags,Actif,En vedette
PROD-001,Robe Élégante,clothing,Robes,49.99,59.99,25.00,8,5,"Robe élégante pour occasions spéciales",0.5,"30x20x5cm","robe,élégant,soirée",true,true
PROD-002,Jean Slim Noir,clothing,Pantalons,39.99,49.99,20.00,22,5,"Jean slim noir élégant",0.8,"40x30x5cm","jean,pantalon,slim",true,false`;
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', 'modele_produits.csv');
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Afficher le chargement
function showLoading() {
    // Pourrait ajouter un overlay de chargement
    document.body.style.cursor = 'wait';
}

// Cacher le chargement
function hideLoading() {
    document.body.style.cursor = 'default';
}
