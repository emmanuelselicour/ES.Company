// Configuration
const API_BASE_URL = 'https://votre-api.onrender.com'; // REMPLACEZ par votre URL Render

// Gestion des produits
class ProductManager {
    constructor() {
        this.products = [];
        this.currentProductId = null;
        this.init();
    }

    init() {
        // Charger les produits depuis l'API
        this.loadProducts();
        
        // Initialiser les événements
        this.initEvents();
    }

    // Charger les produits depuis l'API
    async loadProducts() {
        try {
            const token = localStorage.getItem('admin_token');
            
            // Vérifier si le token existe
            if (!token) {
                console.warn('⚠️ No admin token found, using local data');
                this.loadLocalProducts();
                return;
            }
            
            const response = await fetch(`${API_BASE_URL}/api/products?limit=100`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                mode: 'cors',
                credentials: 'include'
            });
            
            console.log('📡 API Response status:', response.status);
            
            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Session expirée. Veuillez vous reconnecter.');
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('📦 API Data received:', data);
            
            if (data.status === 'success') {
                this.products = data.data.products || [];
                console.log(`✅ Loaded ${this.products.length} products from API`);
                
                // Sauvegarder dans le cache local
                this.saveLocalProducts();
            } else {
                console.error('❌ API returned error:', data.message);
                this.loadLocalProducts();
            }
        } catch (error) {
            console.error('❌ Error loading products from API:', error);
            console.log('🔄 Falling back to local data...');
            this.loadLocalProducts();
        }
    }

    // Charger les produits depuis le cache local
    loadLocalProducts() {
        const storedProducts = localStorage.getItem('escompany_products');
        if (storedProducts) {
            try {
                this.products = JSON.parse(storedProducts);
                console.log(`📁 Loaded ${this.products.length} products from local storage`);
            } catch (e) {
                console.error('❌ Error parsing local products:', e);
                this.products = [];
            }
        } else {
            console.log('📁 No local products found');
            this.products = [];
        }
    }

    // Sauvegarder les produits localement
    saveLocalProducts() {
        try {
            localStorage.setItem('escompany_products', JSON.stringify(this.products));
            console.log('💾 Products saved to local storage');
        } catch (e) {
            console.error('❌ Error saving to local storage:', e);
        }
    }

    // Obtenir tous les produits
    getAllProducts() {
        // S'assurer que c'est toujours un tableau
        return Array.isArray(this.products) ? this.products : [];
    }

    // Obtenir un produit par ID
    getProductById(id) {
        const products = this.getAllProducts();
        return products.find(product => product._id === id || product.id === id);
    }

    // Ajouter un produit via l'API
    async addProduct(productData) {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                throw new Error('Non authentifié. Veuillez vous reconnecter.');
            }
            
            console.log('📤 Sending product to API:', productData);
            
            const response = await fetch(`${API_BASE_URL}/api/products`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
            
            console.log('📥 API Response:', response.status);
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Ajouter au cache local
                const newProduct = data.data.product;
                this.products.push(newProduct);
                this.saveLocalProducts();
                return newProduct;
            } else {
                throw new Error(data.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('❌ Error adding product:', error);
            
            // Fallback: ajouter localement
            const newId = this.products.length > 0 
                ? Math.max(...this.products.map(p => p.id || p._id || 0)) + 1 
                : 1;
            
            const newProduct = {
                id: newId,
                ...productData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            this.products.push(newProduct);
            this.saveLocalProducts();
            
            // Retourner le produit local
            return newProduct;
        }
    }

    // Mettre à jour un produit via l'API
    async updateProduct(id, productData) {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                throw new Error('Non authentifié. Veuillez vous reconnecter.');
            }
            
            console.log('🔄 Updating product via API:', id, productData);
            
            const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Mettre à jour dans le cache local
                const index = this.products.findIndex(product => 
                    product._id === id || product.id === id
                );
                
                if (index !== -1) {
                    this.products[index] = {
                        ...this.products[index],
                        ...data.data.product,
                        updatedAt: new Date().toISOString()
                    };
                    this.saveLocalProducts();
                }
                return data.data.product;
            } else {
                throw new Error(data.message || 'Failed to update product');
            }
        } catch (error) {
            console.error('❌ Error updating product:', error);
            throw error;
        }
    }

    // Supprimer un produit via l'API
    async deleteProduct(id) {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                throw new Error('Non authentifié. Veuillez vous reconnecter.');
            }
            
            console.log('🗑️ Deleting product via API:', id);
            
            const response = await fetch(`${API_BASE_URL}/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Supprimer du cache local
                const index = this.products.findIndex(product => 
                    product._id === id || product.id === id
                );
                
                if (index !== -1) {
                    this.products.splice(index, 1);
                    this.saveLocalProducts();
                }
                return true;
            } else {
                throw new Error(data.message || 'Failed to delete product');
            }
        } catch (error) {
            console.error('❌ Error deleting product:', error);
            throw error;
        }
    }

    // Obtenir les statistiques
    async getStats() {
        try {
            const token = localStorage.getItem('admin_token');
            if (!token) {
                return this.getLocalStats();
            }
            
            const response = await fetch(`${API_BASE_URL}/api/products/stats`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                if (data.status === 'success') {
                    return data.data;
                }
            }
            
            return this.getLocalStats();
            
        } catch (error) {
            console.error('❌ Error getting stats:', error);
            return this.getLocalStats();
        }
    }

    // Statistiques locales (fallback)
    getLocalStats() {
        const products = this.getAllProducts();
        const totalProducts = products.length;
        const activeProducts = products.filter(p => p.status === 'active').length;
        const totalValue = products.reduce((sum, product) => sum + ((product.price || 0) * (product.stock || 0)), 0);
        const lowStockProducts = products.filter(p => (p.stock || 0) < 5 && (p.stock || 0) > 0).length;
        const outOfStockProducts = products.filter(p => (p.stock || 0) === 0).length;
        
        return {
            totalProducts,
            activeProducts,
            totalValue,
            lowStockProducts,
            outOfStockProducts,
            averagePrice: totalProducts > 0 ? totalValue / totalProducts : 0
        };
    }

    // Initialiser les événements
    initEvents() {
        // Gestion de l'upload d'images
        this.initImageUpload();
        
        // Gestion du formulaire d'ajout/modification
        this.initProductForm();
    }

    // Initialiser l'upload d'images
    initImageUpload() {
        const imageBoxes = document.querySelectorAll('.image-upload-box');
        
        imageBoxes.forEach((box, index) => {
            const fileInput = box.querySelector('input[type="file"]');
            const imagePreview = box.querySelector('.uploaded-image');
            const removeBtn = box.querySelector('.remove-image');
            const uploadIcon = box.querySelector('.fa-cloud-upload-alt');
            const uploadText = box.querySelector('p');
            
            if (fileInput) {
                fileInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        const reader = new FileReader();
                        
                        reader.onload = (e) => {
                            imagePreview.src = e.target.result;
                            imagePreview.style.display = 'block';
                            
                            if (uploadIcon) uploadIcon.style.display = 'none';
                            if (uploadText) uploadText.style.display = 'none';
                            if (removeBtn) removeBtn.style.display = 'flex';
                            
                            // Sauvegarder l'image dans le localStorage temporaire
                            const tempImages = JSON.parse(localStorage.getItem('temp_product_images') || '[]');
                            tempImages[index] = e.target.result;
                            localStorage.setItem('temp_product_images', JSON.stringify(tempImages));
                        };
                        
                        reader.readAsDataURL(file);
                    }
                });
            }
            
            if (removeBtn) {
                removeBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    imagePreview.src = '';
                    imagePreview.style.display = 'none';
                    
                    if (uploadIcon) uploadIcon.style.display = 'block';
                    if (uploadText) uploadText.style.display = 'block';
                    removeBtn.style.display = 'none';
                    
                    // Réinitialiser l'input file
                    if (fileInput) fileInput.value = '';
                    
                    // Supprimer l'image du localStorage temporaire
                    const tempImages = JSON.parse(localStorage.getItem('temp_product_images') || '[]');
                    tempImages[index] = null;
                    localStorage.setItem('temp_product_images', JSON.stringify(tempImages));
                });
            }
            
            // Activer le clic sur la boîte
            box.addEventListener('click', function(e) {
                if (e.target !== fileInput && e.target !== removeBtn) {
                    fileInput.click();
                }
            });
        });
    }

    // Initialiser le formulaire produit
    initProductForm() {
        const productForm = document.getElementById('productForm');
        
        if (productForm) {
            // Charger les images temporaires si elles existent
            this.loadTempImages();
            
            productForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                // Récupérer les données du formulaire
                const formData = new FormData(productForm);
                const productData = {
                    name: formData.get('name'),
                    category: formData.get('category'),
                    price: parseFloat(formData.get('price')),
                    description: formData.get('description'),
                    stock: parseInt(formData.get('stock')),
                    status: formData.get('status'),
                    featured: formData.get('featured') === 'true',
                    discount: parseFloat(formData.get('discount') || 0)
                };
                
                // Récupérer les images temporaires
                const tempImages = JSON.parse(localStorage.getItem('temp_product_images') || '[]');
                const images = tempImages.filter(img => img !== null);
                
                if (images.length > 0) {
                    productData.images = images.map(url => ({ 
                        url, 
                        alt: productData.name,
                        isBase64: true 
                    }));
                }
                
                try {
                    // Afficher un indicateur de chargement
                    const submitBtn = productForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.textContent;
                    submitBtn.textContent = 'Traitement en cours...';
                    submitBtn.disabled = true;
                    
                    // Ajouter ou mettre à jour le produit
                    if (this.currentProductId) {
                        // Mise à jour
                        const updated = await this.updateProduct(this.currentProductId, productData);
                        if (updated) {
                            if (window.admin && window.admin.showAlert) {
                                window.admin.showAlert('Produit mis à jour avec succès!', 'success');
                            } else {
                                alert('✅ Produit mis à jour avec succès!');
                            }
                            setTimeout(() => {
                                window.location.href = 'products.html';
                            }, 1500);
                        }
                    } else {
                        // Ajout
                        const added = await this.addProduct(productData);
                        if (added) {
                            if (window.admin && window.admin.showAlert) {
                                window.admin.showAlert('Produit ajouté avec succès!', 'success');
                            } else {
                                alert('✅ Produit ajouté avec succès!');
                            }
                            setTimeout(() => {
                                window.location.href = 'products.html';
                            }, 1500);
                        }
                    }
                    
                    // Nettoyer les images temporaires
                    localStorage.removeItem('temp_product_images');
                    
                } catch (error) {
                    console.error('❌ Form submission error:', error);
                    
                    if (window.admin && window.admin.showAlert) {
                        window.admin.showAlert(`Erreur: ${error.message}`, 'error');
                    } else {
                        alert(`❌ Erreur: ${error.message}`);
                    }
                    
                    // Réactiver le bouton
                    const submitBtn = productForm.querySelector('button[type="submit"]');
                    submitBtn.disabled = false;
                    submitBtn.textContent = 'Enregistrer le produit';
                }
            });
        }
    }

    // Charger les images temporaires
    loadTempImages() {
        const tempImages = JSON.parse(localStorage.getItem('temp_product_images') || '[]');
        const imageBoxes = document.querySelectorAll('.image-upload-box');
        
        imageBoxes.forEach((box, index) => {
            if (tempImages[index]) {
                const imagePreview = box.querySelector('.uploaded-image');
                const uploadIcon = box.querySelector('.fa-cloud-upload-alt');
                const uploadText = box.querySelector('p');
                const removeBtn = box.querySelector('.remove-image');
                
                if (imagePreview) {
                    imagePreview.src = tempImages[index];
                    imagePreview.style.display = 'block';
                }
                
                if (uploadIcon) uploadIcon.style.display = 'none';
                if (uploadText) uploadText.style.display = 'none';
                if (removeBtn) removeBtn.style.display = 'flex';
            }
        });
    }

    // Pré-remplir le formulaire d'édition
    async populateEditForm(productId) {
        try {
            // Chercher d'abord dans les produits locaux
            let product = this.getProductById(productId);
            
            // Si non trouvé localement, essayer l'API
            if (!product) {
                const token = localStorage.getItem('admin_token');
                if (token) {
                    const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    
                    if (response.ok) {
                        const data = await response.json();
                        if (data.status === 'success') {
                            product = data.data.product;
                        }
                    }
                }
            }
            
            if (product) {
                this.currentProductId = product._id || product.id;
                
                // Remplir les champs du formulaire
                document.getElementById('name').value = product.name || '';
                document.getElementById('category').value = product.category || '';
                document.getElementById('price').value = product.price || '';
                document.getElementById('description').value = product.description || '';
                document.getElementById('stock').value = product.stock || '';
                document.getElementById('status').value = product.status || 'active';
                document.getElementById('featured').value = product.featured ? 'true' : 'false';
                
                if (product.discount) {
                    document.getElementById('discount').value = product.discount;
                }
                
                // Sauvegarder les images temporairement
                if (product.images && product.images.length > 0) {
                    const imageUrls = product.images.map(img => img.url);
                    localStorage.setItem('temp_product_images', JSON.stringify(imageUrls));
                    this.loadTempImages();
                }
                
                // Mettre à jour le titre de la page
                const pageTitle = document.querySelector('.page-header h1');
                if (pageTitle) {
                    pageTitle.textContent = 'Modifier le produit';
                }
                
                // Mettre à jour le bouton de soumission
                const submitBtn = document.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.textContent = 'Mettre à jour le produit';
                    submitBtn.className = 'btn btn-warning';
                }
                
                return true;
            } else {
                throw new Error('Produit non trouvé');
            }
        } catch (error) {
            console.error('❌ Error loading product for edit:', error);
            
            if (window.admin && window.admin.showAlert) {
                window.admin.showAlert(`Erreur: ${error.message}`, 'error');
            } else {
                alert(`❌ Erreur: ${error.message}`);
            }
            
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 2000);
            
            return false;
        }
    }
}

// Initialiser le gestionnaire de produits
const productManager = new ProductManager();

// Exposer au global
window.productManager = productManager;
