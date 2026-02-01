// products.js - Gestion des produits avec API
class ProductManager {
    constructor() {
        this.API_URL = 'https://es-company-api.onrender.com/api'; // Votre URL Render
        this.products = [];
        this.currentProductId = null;
        this.init();
    }

    init() {
        // Initialiser les événements
        this.initEvents();
    }

    // Obtenir tous les produits depuis l'API
    async getAllProducts() {
        try {
            const response = await fetch(`${this.API_URL}/products`);
            const data = await response.json();
            
            if (data.status === 'success') {
                this.products = data.data.products;
                return this.products;
            } else {
                console.error('Error fetching products:', data.message);
                return [];
            }
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // Obtenir un produit par ID
    async getProductById(id) {
        try {
            const response = await fetch(`${this.API_URL}/products/${id}`);
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.product;
            } else {
                console.error('Error fetching product:', data.message);
                return null;
            }
        } catch (error) {
            console.error('Error fetching product:', error);
            return null;
        }
    }

    // Ajouter un produit
    async addProduct(productData) {
        try {
            const formData = new FormData();
            
            // Ajouter les champs texte
            Object.keys(productData).forEach(key => {
                if (key !== 'images') {
                    formData.append(key, productData[key]);
                }
            });
            
            // Ajouter les images
            if (productData.images && productData.images.length > 0) {
                for (let i = 0; i < productData.images.length; i++) {
                    // Convertir DataURL en Blob
                    if (productData.images[i].startsWith('data:')) {
                        const blob = await fetch(productData.images[i]).then(r => r.blob());
                        formData.append('images', blob, `image_${i}.jpg`);
                    }
                }
            }
            
            const response = await fetch(`${this.API_URL}/products`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.product;
            } else {
                throw new Error(data.message || 'Erreur lors de l\'ajout du produit');
            }
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    // Mettre à jour un produit
    async updateProduct(id, productData) {
        try {
            const formData = new FormData();
            
            // Ajouter les champs texte
            Object.keys(productData).forEach(key => {
                if (key !== 'images' && key !== 'removedImages') {
                    formData.append(key, productData[key]);
                }
            });
            
            // Ajouter les images
            if (productData.images && productData.images.length > 0) {
                for (let i = 0; i < productData.images.length; i++) {
                    // Convertir DataURL en Blob
                    if (productData.images[i].startsWith('data:')) {
                        const blob = await fetch(productData.images[i]).then(r => r.blob());
                        formData.append('images', blob, `image_${i}.jpg`);
                    }
                }
            }
            
            if (productData.removedImages) {
                formData.append('removedImages', JSON.stringify(productData.removedImages));
            }
            
            const response = await fetch(`${this.API_URL}/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${auth.token}`
                },
                body: formData
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data.product;
            } else {
                throw new Error(data.message || 'Erreur lors de la mise à jour du produit');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    // Supprimer un produit
    async deleteProduct(id) {
        try {
            const response = await fetch(`${this.API_URL}/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return true;
            } else {
                throw new Error(data.message || 'Erreur lors de la suppression du produit');
            }
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    // Obtenir les statistiques
    async getStats() {
        try {
            const response = await fetch(`${this.API_URL}/products/stats`, {
                headers: {
                    'Authorization': `Bearer ${auth.token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            const data = await response.json();
            
            if (data.status === 'success') {
                return data.data;
            } else {
                console.error('Error fetching stats:', data.message);
                return null;
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            return null;
        }
    }

    // Initialiser les événements
    initEvents() {
        // Gestion de l'upload d'images
        this.initImageUpload();
        
        // Gestion du formulaire d'ajout/modification
        this.initProductForm();
    }

    // Initialiser l'upload d'images (version simplifiée)
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
                    status: formData.get('status')
                };
                
                // Récupérer les images
                const tempImages = JSON.parse(localStorage.getItem('temp_product_images') || '[]');
                const images = tempImages.filter(img => img !== null);
                
                if (images.length > 0) {
                    productData.images = images;
                }
                
                try {
                    // Afficher un loader
                    const submitBtn = productForm.querySelector('button[type="submit"]');
                    const originalText = submitBtn.innerHTML;
                    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
                    submitBtn.disabled = true;
                    
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
                    const submitBtn = productForm.querySelector('button[type="submit"]');
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;
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
            const product = await this.getProductById(productId);
            
            if (product) {
                this.currentProductId = productId;
                
                // Remplir les champs du formulaire
                document.getElementById('name').value = product.name || '';
                document.getElementById('category').value = product.category || '';
                document.getElementById('price').value = product.price || '';
                document.getElementById('description').value = product.description || '';
                document.getElementById('stock').value = product.stock || '';
                document.getElementById('status').value = product.status || 'active';
                
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
            console.error('Error loading product for edit:', error);
            admin.showAlert('Erreur lors du chargement du produit', 'error');
        }
    }
}

// Initialiser le gestionnaire de produits
const productManager = new ProductManager();

// Exposer au global
window.productManager = productManager;
