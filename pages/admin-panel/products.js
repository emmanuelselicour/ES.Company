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
            const response = await fetch('https://votre-api.onrender.com/api/products', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.status === 'success') {
                this.products = data.data.products || [];
                console.log(`✅ Loaded ${this.products.length} products from API`);
            } else {
                console.error('❌ Error loading products:', data.message);
            }
        } catch (error) {
            console.error('❌ Error loading products:', error);
            // Fallback: données locales si l'API échoue
            const storedProducts = localStorage.getItem('escompany_products');
            if (storedProducts) {
                this.products = JSON.parse(storedProducts);
            }
        }
    }

    // Sauvegarder les produits (pour le cache local)
    saveProducts() {
        localStorage.setItem('escompany_products', JSON.stringify(this.products));
    }

    // Obtenir tous les produits
    getAllProducts() {
        return this.products;
    }

    // Obtenir un produit par ID
    getProductById(id) {
        return this.products.find(product => product._id === id || product.id === id);
    }

    // Ajouter un produit via l'API
    async addProduct(productData) {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('https://votre-api.onrender.com/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(productData)
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Ajouter au cache local
                this.products.push(data.data.product);
                this.saveProducts();
                return data.data.product;
            } else {
                throw new Error(data.message || 'Failed to add product');
            }
        } catch (error) {
            console.error('❌ Error adding product:', error);
            throw error;
        }
    }

    // Mettre à jour un produit via l'API
    async updateProduct(id, productData) {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`https://votre-api.onrender.com/api/products/${id}`, {
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
                const index = this.products.findIndex(product => product._id === id || product.id === id);
                if (index !== -1) {
                    this.products[index] = data.data.product;
                    this.saveProducts();
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
            const response = await fetch(`https://votre-api.onrender.com/api/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                // Supprimer du cache local
                const index = this.products.findIndex(product => product._id === id || product.id === id);
                if (index !== -1) {
                    this.products.splice(index, 1);
                    this.saveProducts();
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

    // Obtenir les statistiques via l'API
    async getStats() {
        try {
            const token = localStorage.getItem('admin_token');
            const response = await fetch('https://votre-api.onrender.com/api/products/stats', {
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
            
            // Fallback aux calculs locaux
            return this.getLocalStats();
            
        } catch (error) {
            console.error('❌ Error getting stats:', error);
            return this.getLocalStats();
        }
    }

    // Statistiques locales (fallback)
    getLocalStats() {
        const totalProducts = this.products.length;
        const activeProducts = this.products.filter(p => p.status === 'active').length;
        const totalValue = this.products.reduce((sum, product) => sum + (product.price * product.stock), 0);
        const lowStockProducts = this.products.filter(p => p.stock < 5).length;
        
        return {
            totalProducts,
            activeProducts,
            totalValue,
            lowStockProducts
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
                    featured: formData.get('featured') === 'true'
                };
                
                // Récupérer les images temporaires
                const tempImages = JSON.parse(localStorage.getItem('temp_product_images') || '[]');
                const images = tempImages.filter(img => img !== null);
                
                if (images.length > 0) {
                    productData.images = images.map(url => ({ url, alt: productData.name }));
                }
                
                try {
                    // Ajouter ou mettre à jour le produit
                    if (this.currentProductId) {
                        // Mise à jour
                        const updated = await this.updateProduct(this.currentProductId, productData);
                        if (updated) {
                            admin.showAlert('Produit mis à jour avec succès!', 'success');
                            setTimeout(() => {
                                window.location.href = 'products.html';
                            }, 1500);
                        }
                    } else {
                        // Ajout
                        const added = await this.addProduct(productData);
                        if (added) {
                            admin.showAlert('Produit ajouté avec succès!', 'success');
                            setTimeout(() => {
                                window.location.href = 'products.html';
                            }, 1500);
                        }
                    }
                    
                    // Nettoyer les images temporaires
                    localStorage.removeItem('temp_product_images');
                    
                } catch (error) {
                    admin.showAlert(`Erreur: ${error.message}`, 'error');
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
            // Charger le produit depuis l'API
            const token = localStorage.getItem('admin_token');
            const response = await fetch(`https://votre-api.onrender.com/api/products/${productId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                const product = data.data.product;
                this.currentProductId = product._id;
                
                // Remplir les champs du formulaire
                document.getElementById('name').value = product.name || '';
                document.getElementById('category').value = product.category || '';
                document.getElementById('price').value = product.price || '';
                document.getElementById('description').value = product.description || '';
                document.getElementById('stock').value = product.stock || '';
                document.getElementById('status').value = product.status || 'active';
                document.getElementById('featured').value = product.featured || false;
                
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
            }
        } catch (error) {
            console.error('❌ Error loading product for edit:', error);
            admin.showAlert('Erreur lors du chargement du produit', 'error');
        }
    }
}

// Initialiser le gestionnaire de produits
const productManager = new ProductManager();

// Exposer au global
window.productManager = productManager;
