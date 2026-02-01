// Gestion des produits
class ProductManager {
    constructor() {
        this.products = [];
        this.currentProductId = null;
        this.init();
    }

    init() {
        // Charger les produits depuis le localStorage
        this.loadProducts();
        
        // Initialiser les événements
        this.initEvents();
    }

    // Charger les produits
    loadProducts() {
        const storedProducts = localStorage.getItem('escompany_products');
        if (storedProducts) {
            this.products = JSON.parse(storedProducts);
        } else {
            // Données d'exemple
            this.products = [
                {
                    id: 1,
                    name: "Robe d'été fleurie",
                    category: "robes",
                    price: 2500,
                    description: "Robe légère et confortable pour l'été, avec motif floral.",
                    images: [
                        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                        "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80",
                        "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                    ],
                    stock: 15,
                    status: "active",
                    createdAt: "2023-10-15T10:30:00",
                    updatedAt: "2023-10-15T10:30:00"
                },
                {
                    id: 2,
                    name: "Pantalon slim noir",
                    category: "pantalons",
                    price: 1800,
                    description: "Pantalon slim élégant en tissu stretch confortable.",
                    images: [
                        "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                    ],
                    stock: 25,
                    status: "active",
                    createdAt: "2023-10-14T14:20:00",
                    updatedAt: "2023-10-14T14:20:00"
                },
                {
                    id: 3,
                    name: "Jupe plissée bleue",
                    category: "jupes",
                    price: 1200,
                    description: "Jupe plissée midi dans un bleu pastel tendance.",
                    images: [
                        "https://images.unsplash.com/photo-1585487000160-6eb9ce6b5a53?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=500&q=80"
                    ],
                    stock: 10,
                    status: "active",
                    createdAt: "2023-10-13T09:15:00",
                    updatedAt: "2023-10-13T09:15:00"
                }
            ];
            this.saveProducts();
        }
    }

    // Sauvegarder les produits
    saveProducts() {
        localStorage.setItem('escompany_products', JSON.stringify(this.products));
    }

    // Obtenir tous les produits
    getAllProducts() {
        return this.products;
    }

    // Obtenir un produit par ID
    getProductById(id) {
        return this.products.find(product => product.id == id);
    }

    // Ajouter un produit
    addProduct(productData) {
        const newId = this.products.length > 0 ? Math.max(...this.products.map(p => p.id)) + 1 : 1;
        
        const newProduct = {
            id: newId,
            ...productData,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        this.products.push(newProduct);
        this.saveProducts();
        
        return newProduct;
    }

    // Mettre à jour un produit
    updateProduct(id, productData) {
        const index = this.products.findIndex(product => product.id == id);
        
        if (index !== -1) {
            this.products[index] = {
                ...this.products[index],
                ...productData,
                updatedAt: new Date().toISOString()
            };
            
            this.saveProducts();
            return this.products[index];
        }
        
        return null;
    }

    // Supprimer un produit
    deleteProduct(id) {
        const index = this.products.findIndex(product => product.id == id);
        
        if (index !== -1) {
            const deletedProduct = this.products.splice(index, 1)[0];
            this.saveProducts();
            return deletedProduct;
        }
        
        return null;
    }

    // Obtenir les statistiques
    getStats() {
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
            
            productForm.addEventListener('submit', (e) => {
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
                
                // Ajouter ou mettre à jour le produit
                if (this.currentProductId) {
                    // Mise à jour
                    const updated = this.updateProduct(this.currentProductId, productData);
                    if (updated) {
                        admin.showAlert('Produit mis à jour avec succès!', 'success');
                        setTimeout(() => {
                            window.location.href = 'products.html';
                        }, 1500);
                    }
                } else {
                    // Ajout
                    const added = this.addProduct(productData);
                    if (added) {
                        admin.showAlert('Produit ajouté avec succès!', 'success');
                        setTimeout(() => {
                            window.location.href = 'products.html';
                        }, 1500);
                    }
                }
                
                // Nettoyer les images temporaires
                localStorage.removeItem('temp_product_images');
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
    populateEditForm(productId) {
        const product = this.getProductById(productId);
        
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
                localStorage.setItem('temp_product_images', JSON.stringify(product.images));
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
    }
}

// Initialiser le gestionnaire de produits
const productManager = new ProductManager();

// Exposer au global
window.productManager = productManager;
