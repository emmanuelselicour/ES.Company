<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Gestion des produits - Panel Admin E-S COMPANY</title>
    <link rel="icon" href="https://i.postimg.cc/44F5BnV2/file-000000001f3471fda269be0d033dc40a.png" type="image/png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <!-- Header -->
    <header class="admin-header">
        <div class="container admin-header-container">
            <div class="admin-logo">
                <img src="https://i.postimg.cc/44F5BnV2/file-000000001f3471fda269be0d033dc40a.png" alt="E-S COMPANY Logo" class="admin-logo-img">
                <div class="admin-logo-text">E-S <span>COMPANY</span> Admin</div>
            </div>
            
            <div class="admin-user">
                <span id="currentUserName"></span>
                <a href="#" class="logout-btn" id="logoutBtn">
                    <i class="fas fa-sign-out-alt"></i> Déconnexion
                </a>
            </div>
        </div>
    </header>

    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="sidebar">
            <ul class="sidebar-menu">
                <li><a href="dashboard.html"><i class="fas fa-tachometer-alt"></i> Tableau de bord</a></li>
                <li><a href="products.html" class="active"><i class="fas fa-tshirt"></i> Produits</a></li>
                <li><a href="add-product.html"><i class="fas fa-plus-circle"></i> Ajouter un produit</a></li>
                <li><a href="#"><i class="fas fa-shopping-cart"></i> Commandes</a></li>
                <li><a href="#"><i class="fas fa-users"></i> Clients</a></li>
                <li><a href="#"><i class="fas fa-chart-bar"></i> Statistiques</a></li>
                <li><a href="#"><i class="fas fa-cog"></i> Paramètres</a></li>
            </ul>
        </aside>

        <!-- Main content -->
        <main class="main-content">
            <div class="page-header">
                <h1><i class="fas fa-tshirt"></i> Gestion des produits</h1>
                <a href="add-product.html" class="btn btn-success">
                    <i class="fas fa-plus"></i> Nouveau produit
                </a>
            </div>

            <!-- Alert message -->
            <div id="alertMessage" class="alert" style="display: none;"></div>

            <!-- Filtres -->
            <div class="card" style="margin-bottom: 30px;">
                <h3 style="margin-bottom: 15px; color: var(--primary-color);">Filtres</h3>
                <div style="display: flex; gap: 15px; flex-wrap: wrap; align-items: center;">
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Catégorie</label>
                        <select id="categoryFilter" class="form-control" style="width: 200px;">
                            <option value="">Toutes les catégories</option>
                            <option value="robes">Robes</option>
                            <option value="pantalons">Pantalons</option>
                            <option value="jupes">Jupes</option>
                            <option value="chaussures">Chaussures</option>
                            <option value="bijoux">Bijoux</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Statut</label>
                        <select id="statusFilter" class="form-control" style="width: 150px;">
                            <option value="">Tous les statuts</option>
                            <option value="active">Actif</option>
                            <option value="inactive">Inactif</option>
                            <option value="out_of_stock">Rupture</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Stock</label>
                        <select id="stockFilter" class="form-control" style="width: 150px;">
                            <option value="">Tous</option>
                            <option value="low">Stock faible (&lt; 5)</option>
                            <option value="out">Rupture de stock</option>
                            <option value="good">Stock bon</option>
                        </select>
                    </div>
                    
                    <div>
                        <label style="display: block; margin-bottom: 5px; font-weight: 600;">Recherche</label>
                        <input type="text" id="searchFilter" class="form-control" style="width: 200px;" placeholder="Nom ou description">
                    </div>
                    
                    <div style="margin-top: 20px;">
                        <button id="applyFilters" class="btn btn-primary">
                            <i class="fas fa-filter"></i> Appliquer
                        </button>
                        <button id="resetFilters" class="btn btn-outline">
                            <i class="fas fa-redo"></i> Réinitialiser
                        </button>
                    </div>
                </div>
            </div>

            <!-- Liste des produits -->
            <div class="card">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                    <h3 style="color: var(--primary-color);">Liste des produits (<span id="productCount">0</span>)</h3>
                    <div style="display: flex; gap: 10px;">
                        <button id="refreshBtn" class="btn btn-small">
                            <i class="fas fa-sync-alt"></i> Actualiser
                        </button>
                        <button id="exportBtn" class="btn btn-small">
                            <i class="fas fa-download"></i> Exporter
                        </button>
                    </div>
                </div>
                
                <div class="table-responsive">
                    <table>
                        <thead>
                            <tr>
                                <th style="width: 60px;">Image</th>
                                <th>Nom</th>
                                <th style="width: 100px;">Catégorie</th>
                                <th style="width: 100px;">Prix</th>
                                <th style="width: 80px;">Stock</th>
                                <th style="width: 100px;">Statut</th>
                                <th style="width: 150px;">Date d'ajout</th>
                                <th style="width: 120px;">Actions</th>
                            </tr>
                        </thead>
                        <tbody id="productsTable">
                            <!-- Les produits seront ajoutés ici par JavaScript -->
                            <tr id="loadingRow">
                                <td colspan="8" style="text-align: center; padding: 40px;">
                                    <div class="loading-spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid var(--secondary-color); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                                    <p>Chargement des produits...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                
                <div style="margin-top: 20px; text-align: center;">
                    <div id="pagination">
                        <!-- La pagination sera ajoutée ici par JavaScript -->
                    </div>
                </div>
            </div>
        </main>
    </div>

    <!-- Modal de confirmation de suppression -->
    <div id="deleteModal" class="modal" style="display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0,0,0,0.5); z-index: 1000; align-items: center; justify-content: center;">
        <div class="modal-content" style="background-color: white; padding: 30px; border-radius: var(--border-radius); max-width: 500px; width: 90%;">
            <h3 style="margin-bottom: 20px; color: var(--primary-color);">
                <i class="fas fa-exclamation-triangle" style="color: var(--secondary-color); margin-right: 10px;"></i>
                Confirmer la suppression
            </h3>
            <p id="deleteMessage" style="margin-bottom: 25px;">Êtes-vous sûr de vouloir supprimer ce produit ?</p>
            <div style="display: flex; gap: 15px; justify-content: flex-end;">
                <button id="cancelDelete" class="btn btn-outline">Annuler</button>
                <button id="confirmDelete" class="btn btn-danger" style="background-color: var(--secondary-color);">Supprimer</button>
            </div>
        </div>
    </div>

    <style>
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .btn-danger {
            background-color: var(--secondary-color);
            color: white;
        }
        
        .btn-danger:hover {
            background-color: #c0392b;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
        }
        
        .status-active {
            background-color: #d5f4e6;
            color: #27ae60;
        }
        
        .status-inactive {
            background-color: #fdebd0;
            color: #f39c12;
        }
        
        .status-out_of_stock {
            background-color: #fadbd8;
            color: #e74c3c;
        }
        
        .stock-low {
            color: #e74c3c;
            font-weight: bold;
        }
        
        .stock-zero {
            color: #f39c12;
            font-weight: bold;
        }
    </style>

    <script>
        // Configuration
        const API_URL = 'https://es-company-api.onrender.com'; // Remplacez par votre URL Render
        
        // État de l'application
        let currentPage = 1;
        const itemsPerPage = 10;
        let totalProducts = 0;
        let currentFilters = {};
        let productToDelete = null;
        let authToken = null;

        // Initialisation
        document.addEventListener('DOMContentLoaded', function() {
            // Vérifier l'authentification
            checkAuth();
            
            // Charger le token
            authToken = localStorage.getItem('admin_token');
            if (!authToken) {
                window.location.href = 'index.html';
                return;
            }
            
            // Afficher le nom d'utilisateur
            const user = JSON.parse(localStorage.getItem('admin_user') || '{}');
            if (user && user.name) {
                document.getElementById('currentUserName').textContent = user.name;
            }
            
            // Gestion de la déconnexion
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('admin_token');
                localStorage.removeItem('admin_user');
                window.location.href = 'index.html';
            });
            
            // Initialiser les événements
            initEvents();
            
            // Charger les produits
            loadProducts();
        });

        // Vérifier l'authentification
        function checkAuth() {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                window.location.href = 'index.html';
            }
        }

        // Initialiser les événements
        function initEvents() {
            // Appliquer les filtres
            document.getElementById('applyFilters').addEventListener('click', applyFilters);
            
            // Réinitialiser les filtres
            document.getElementById('resetFilters').addEventListener('click', resetFilters);
            
            // Rafraîchir
            document.getElementById('refreshBtn').addEventListener('click', function() {
                loadProducts();
            });
            
            // Export
            document.getElementById('exportBtn').addEventListener('click', exportProducts);
            
            // Modal de suppression
            document.getElementById('cancelDelete').addEventListener('click', function() {
                document.getElementById('deleteModal').style.display = 'none';
                productToDelete = null;
            });
            
            document.getElementById('confirmDelete').addEventListener('click', deleteProduct);
        }

        // Charger les produits depuis l'API
        async function loadProducts() {
            try {
                showLoading(true);
                
                // Préparer les filtres
                const filters = {
                    page: currentPage,
                    limit: itemsPerPage,
                    ...currentFilters
                };
                
                // Construire l'URL
                const queryParams = new URLSearchParams(filters).toString();
                const url = `${API_URL}/api/products${queryParams ? '?' + queryParams : ''}`;
                
                const response = await fetch(url, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                if (response.status === 401) {
                    // Token invalide ou expiré
                    localStorage.removeItem('admin_token');
                    localStorage.removeItem('admin_user');
                    window.location.href = 'index.html';
                    return;
                }
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    displayProducts(data.data.products);
                    updateProductCount(data.data.pagination.total);
                    updatePagination(data.data.pagination);
                } else {
                    throw new Error(data.message || 'Erreur de chargement');
                }
            } catch (error) {
                console.error('Error loading products:', error);
                showError('Erreur de chargement: ' + error.message);
            } finally {
                showLoading(false);
            }
        }

        // Afficher les produits dans le tableau
        function displayProducts(products) {
            const tbody = document.getElementById('productsTable');
            
            if (!products || products.length === 0) {
                tbody.innerHTML = `
                    <tr>
                        <td colspan="8" style="text-align: center; padding: 40px;">
                            <i class="fas fa-box-open" style="font-size: 3rem; color: #ddd; margin-bottom: 15px;"></i>
                            <h4 style="color: #777;">Aucun produit trouvé</h4>
                            <p>Essayez de modifier vos filtres ou ajoutez un nouveau produit.</p>
                            <a href="add-product.html" class="btn btn-success" style="margin-top: 15px;">
                                <i class="fas fa-plus"></i> Ajouter un produit
                            </a>
                        </td>
                    </tr>
                `;
                return;
            }
            
            let html = '';
            
            products.forEach(product => {
                // Image du produit
                const imageUrl = product.images && product.images.length > 0 
                    ? product.images[0].url 
                    : 'https://via.placeholder.com/50x50?text=No+Image';
                
                // Formatage du prix
                const priceFormatted = new Intl.NumberFormat('fr-HT', {
                    style: 'currency',
                    currency: 'HTG'
                }).format(product.price);
                
                // Formatage de la date
                const date = new Date(product.createdAt);
                const dateFormatted = date.toLocaleDateString('fr-FR');
                
                // Statut
                const statusText = {
                    'active': 'Actif',
                    'inactive': 'Inactif',
                    'out_of_stock': 'Rupture'
                }[product.status] || product.status;
                
                const statusClass = `status-${product.status}`;
                
                // Classe pour le stock
                let stockClass = '';
                if (product.stock === 0) {
                    stockClass = 'stock-zero';
                } else if (product.stock < 5) {
                    stockClass = 'stock-low';
                }
                
                html += `
                    <tr>
                        <td>
                            <img src="${imageUrl}" 
                                 alt="${product.name}" 
                                 style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px;">
                        </td>
                        <td>
                            <strong>${product.name}</strong>
                            <div style="font-size: 12px; color: #777; margin-top: 5px; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                                ${product.description || 'Aucune description'}
                            </div>
                        </td>
                        <td>
                            <span class="status-badge" style="background-color: #e8f4fc; color: #3498db; padding: 3px 8px; border-radius: 4px; text-transform: capitalize;">
                                ${product.category}
                            </span>
                        </td>
                        <td><strong>${priceFormatted}</strong></td>
                        <td class="${stockClass}">${product.stock}</td>
                        <td>
                            <span class="status-badge ${statusClass}">${statusText}</span>
                        </td>
                        <td>${dateFormatted}</td>
                        <td class="actions">
                            <a href="edit-product.html?id=${product._id}" class="btn btn-small" title="Modifier" data-tooltip="Modifier">
                                <i class="fas fa-edit"></i>
                            </a>
                            <button class="btn btn-small delete-btn" 
                                   data-product-id="${product._id}"
                                   data-product-name="${product.name}"
                                   title="Supprimer"
                                   data-tooltip="Supprimer">
                                <i class="fas fa-trash"></i>
                            </button>
                            <a href="#" class="btn btn-small" title="Voir détails" data-tooltip="Voir détails" onclick="viewProductDetails('${product._id}')">
                                <i class="fas fa-eye"></i>
                            </a>
                        </td>
                    </tr>
                `;
            });
            
            tbody.innerHTML = html;
            
            // Ajouter les événements de suppression
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = this.getAttribute('data-product-id');
                    const productName = this.getAttribute('data-product-name');
                    confirmDelete(productId, productName);
                });
            });
        }

        // Afficher/masquer le loading
        function showLoading(show) {
            const tbody = document.getElementById('productsTable');
            if (show) {
                tbody.innerHTML = `
                    <tr id="loadingRow">
                        <td colspan="8" style="text-align: center; padding: 40px;">
                            <div class="loading-spinner" style="border: 3px solid #f3f3f3; border-top: 3px solid var(--secondary-color); border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; margin: 0 auto 10px;"></div>
                            <p>Chargement des produits...</p>
                        </td>
                    </tr>
                `;
            }
        }

        // Mettre à jour le compteur de produits
        function updateProductCount(count) {
            document.getElementById('productCount').textContent = count;
            totalProducts = count;
        }

        // Mettre à jour la pagination
        function updatePagination(pagination) {
            const paginationDiv = document.getElementById('pagination');
            
            if (pagination.pages <= 1) {
                paginationDiv.innerHTML = '';
                return;
            }
            
            let paginationHTML = '';
            const maxPagesToShow = 5;
            let startPage = Math.max(1, pagination.page - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(pagination.pages, startPage + maxPagesToShow - 1);
            
            // Ajuster startPage si on est proche de la fin
            if (endPage - startPage + 1 < maxPagesToShow) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }
            
            // Bouton précédent
            if (pagination.page > 1) {
                paginationHTML += `<button class="btn btn-small" onclick="changePage(${pagination.page - 1})"><i class="fas fa-chevron-left"></i></button>`;
            }
            
            // Première page
            if (startPage > 1) {
                paginationHTML += `<button class="btn btn-small" onclick="changePage(1)">1</button>`;
                if (startPage > 2) {
                    paginationHTML += `<button class="btn btn-small" disabled>...</button>`;
                }
            }
            
            // Pages
            for (let i = startPage; i <= endPage; i++) {
                paginationHTML += `<button class="btn btn-small ${i === pagination.page ? 'btn-primary' : ''}" onclick="changePage(${i})">${i}</button>`;
            }
            
            // Dernière page
            if (endPage < pagination.pages) {
                if (endPage < pagination.pages - 1) {
                    paginationHTML += `<button class="btn btn-small" disabled>...</button>`;
                }
                paginationHTML += `<button class="btn btn-small" onclick="changePage(${pagination.pages})">${pagination.pages}</button>`;
            }
            
            // Bouton suivant
            if (pagination.page < pagination.pages) {
                paginationHTML += `<button class="btn btn-small" onclick="changePage(${pagination.page + 1})"><i class="fas fa-chevron-right"></i></button>`;
            }
            
            paginationDiv.innerHTML = paginationHTML;
        }

        // Changer de page
        function changePage(page) {
            currentPage = page;
            loadProducts();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Appliquer les filtres
        function applyFilters() {
            currentPage = 1;
            currentFilters = {};
            
            // Catégorie
            const category = document.getElementById('categoryFilter').value;
            if (category) {
                currentFilters.category = category;
            }
            
            // Statut
            const status = document.getElementById('statusFilter').value;
            if (status) {
                currentFilters.status = status;
            }
            
            // Stock
            const stockFilter = document.getElementById('stockFilter').value;
            if (stockFilter === 'low') {
                currentFilters.maxStock = 5;
                currentFilters.minStock = 1;
            } else if (stockFilter === 'out') {
                currentFilters.stock = 0;
            }
            
            // Recherche
            const search = document.getElementById('searchFilter').value;
            if (search) {
                currentFilters.search = search;
            }
            
            loadProducts();
        }

        // Réinitialiser les filtres
        function resetFilters() {
            document.getElementById('categoryFilter').value = '';
            document.getElementById('statusFilter').value = '';
            document.getElementById('stockFilter').value = '';
            document.getElementById('searchFilter').value = '';
            
            currentPage = 1;
            currentFilters = {};
            
            loadProducts();
        }

        // Confirmer la suppression
        function confirmDelete(productId, productName) {
            productToDelete = productId;
            document.getElementById('deleteMessage').textContent = 
                `Êtes-vous sûr de vouloir supprimer le produit "${productName}" ? Cette action est irréversible.`;
            document.getElementById('deleteModal').style.display = 'flex';
        }

        // Supprimer un produit
        async function deleteProduct() {
            if (!productToDelete) return;
            
            try {
                const response = await fetch(`${API_URL}/api/products/${productToDelete}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    showSuccess('Produit supprimé avec succès!');
                    loadProducts(); // Recharger la liste
                } else {
                    throw new Error(data.message || 'Erreur lors de la suppression');
                }
            } catch (error) {
                console.error('Error deleting product:', error);
                showError('Erreur lors de la suppression: ' + error.message);
            } finally {
                // Fermer le modal
                document.getElementById('deleteModal').style.display = 'none';
                productToDelete = null;
            }
        }

        // Voir les détails d'un produit
        async function viewProductDetails(productId) {
            try {
                const response = await fetch(`${API_URL}/api/products/${productId}`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    const product = data.data.product;
                    
                    // Créer un modal pour afficher les détails
                    const modal = document.createElement('div');
                    modal.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        background-color: rgba(0,0,0,0.5);
                        z-index: 1000;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    `;
                    
                    modal.innerHTML = `
                        <div style="background-color: white; padding: 30px; border-radius: var(--border-radius); max-width: 800px; width: 90%; max-height: 90vh; overflow-y: auto;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                                <h3 style="color: var(--primary-color);">Détails du produit</h3>
                                <button onclick="this.parentElement.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #777;">×</button>
                            </div>
                            
                            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 20px;">
                                <div>
                                    <h4 style="margin-bottom: 10px; color: var(--primary-color);">Informations générales</h4>
                                    <p><strong>Nom:</strong> ${product.name}</p>
                                    <p><strong>Catégorie:</strong> ${product.category}</p>
                                    <p><strong>Prix:</strong> ${new Intl.NumberFormat('fr-HT', {style: 'currency', currency: 'HTG'}).format(product.price)}</p>
                                    <p><strong>Stock:</strong> ${product.stock}</p>
                                    <p><strong>Statut:</strong> ${product.status}</p>
                                    <p><strong>En vedette:</strong> ${product.featured ? 'Oui' : 'Non'}</p>
                                    ${product.discount > 0 ? `<p><strong>Remise:</strong> ${product.discount}%</p>` : ''}
                                </div>
                                
                                <div>
                                    <h4 style="margin-bottom: 10px; color: var(--primary-color);">Description</h4>
                                    <p>${product.description}</p>
                                </div>
                            </div>
                            
                            <div style="margin-bottom: 20px;">
                                <h4 style="margin-bottom: 10px; color: var(--primary-color);">Images</h4>
                                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                                    ${product.images && product.images.length > 0 
                                        ? product.images.map(img => `
                                            <img src="${img.url}" 
                                                 alt="${img.alt || product.name}" 
                                                 style="width: 100px; height: 100px; object-fit: cover; border-radius: 4px;">
                                        `).join('')
                                        : '<p>Aucune image</p>'
                                    }
                                </div>
                            </div>
                            
                            ${product.specifications && Object.keys(product.specifications).length > 0 ? `
                                <div style="margin-bottom: 20px;">
                                    <h4 style="margin-bottom: 10px; color: var(--primary-color);">Spécifications</h4>
                                    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 10px;">
                                        ${Object.entries(product.specifications).map(([key, value]) => `
                                            <p><strong>${key}:</strong> ${value}</p>
                                        `).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <div style="display: flex; justify-content: flex-end; gap: 15px; margin-top: 30px; border-top: 1px solid #eee; padding-top: 20px;">
                                <a href="edit-product.html?id=${product._id}" class="btn btn-primary">
                                    <i class="fas fa-edit"></i> Modifier
                                </a>
                                <button onclick="this.parentElement.parentElement.parentElement.remove()" class="btn btn-outline">
                                    Fermer
                                </button>
                            </div>
                        </div>
                    `;
                    
                    document.body.appendChild(modal);
                } else {
                    throw new Error(data.message || 'Erreur lors du chargement');
                }
            } catch (error) {
                console.error('Error viewing product details:', error);
                showError('Erreur lors du chargement des détails: ' + error.message);
            }
        }

        // Exporter les produits
        async function exportProducts() {
            try {
                // Récupérer tous les produits (sans pagination)
                const response = await fetch(`${API_URL}/api/products?limit=1000`, {
                    headers: {
                        'Authorization': `Bearer ${authToken}`
                    }
                });
                
                const data = await response.json();
                
                if (data.status === 'success') {
                    const products = data.data.products;
                    
                    // Convertir en CSV
                    const headers = ['ID', 'Nom', 'Description', 'Catégorie', 'Prix', 'Stock', 'Statut', 'En vedette', 'Remise', 'Date création'];
                    const rows = products.map(p => [
                        p._id,
                        `"${p.name}"`,
                        `"${p.description.replace(/"/g, '""')}"`,
                        p.category,
                        p.price,
                        p.stock,
                        p.status,
                        p.featured ? 'Oui' : 'Non',
                        p.discount || 0,
                        new Date(p.createdAt).toLocaleDateString('fr-FR')
                    ]);
                    
                    const csvContent = [
                        headers.join(','),
                        ...rows.map(row => row.join(','))
                    ].join('\n');
                    
                    // Créer et télécharger le fichier
                    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
                    const link = document.createElement('a');
                    const url = URL.createObjectURL(blob);
                    
                    link.setAttribute('href', url);
                    link.setAttribute('download', `produits_escompany_${new Date().toISOString().split('T')[0]}.csv`);
                    link.style.visibility = 'hidden';
                    
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    
                    showSuccess('Export CSV téléchargé avec succès!');
                } else {
                    throw new Error(data.message || 'Erreur lors de l\'export');
                }
            } catch (error) {
                console.error('Error exporting products:', error);
                showError('Erreur lors de l\'export: ' + error.message);
            }
        }

        // Afficher un message de succès
        function showSuccess(message) {
            const alertDiv = document.getElementById('alertMessage');
            alertDiv.className = 'alert alert-success';
            alertDiv.innerHTML = `<i class="fas fa-check-circle"></i> ${message}`;
            alertDiv.style.display = 'flex';
            
            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 3000);
        }

        // Afficher un message d'erreur
        function showError(message) {
            const alertDiv = document.getElementById('alertMessage');
            alertDiv.className = 'alert alert-error';
            alertDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${message}`;
            alertDiv.style.display = 'flex';
            
            setTimeout(() => {
                alertDiv.style.display = 'none';
            }, 5000);
        }
    </script>
</body>
</html>
