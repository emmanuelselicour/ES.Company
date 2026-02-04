// Gestion des produits dans l'administration

class AdminProducts {
    constructor() {
        this.apiUrl = 'https://es-company-api.onrender.com/api';
        this.currentProductId = null;
        this.images = [];
        this.options = [];
        this.variants = [];
        
        this.init();
    }
    
    init() {
        // Vérifier si on est en mode édition
        this.checkEditMode();
        
        // Initialiser les événements
        this.initEvents();
        
        // Charger les catégories
        this.loadCategories();
        
        // Initialiser Select2
        this.initSelect2();
        
        // Initialiser les onglets
        this.initTabs();
    }
    
    checkEditMode() {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('edit');
        
        if (productId) {
            this.currentProductId = productId;
            this.loadProduct(productId);
            document.getElementById('pageTitle').textContent = 'Modifier le Produit';
        }
    }
    
    initEvents() {
        // Navigation des onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const tabId = btn.getAttribute('data-tab');
                this.switchTab(tabId);
            });
        });
        
        // Onglets de langue
        document.querySelectorAll('.language-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                const lang = tab.getAttribute('data-lang');
                this.switchLanguage(lang);
            });
        });
        
        // Suivi de la quantité
        const trackQuantityCheckbox = document.getElementById('trackQuantity');
        const inventoryFields = document.getElementById('inventoryFields');
        
        trackQuantityCheckbox.addEventListener('change', () => {
            inventoryFields.style.display = trackQuantityCheckbox.checked ? 'block' : 'none';
        });
        
        // Upload d'images
        const imageUploadArea = document.getElementById('imageUploadArea');
        const imageInput = document.getElementById('imageInput');
        
        imageUploadArea.addEventListener('click', () => {
            imageInput.click();
        });
        
        imageInput.addEventListener('change', (e) => {
            this.handleImageUpload(e.target.files);
        });
        
        // Drag and drop pour images
        imageUploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            imageUploadArea.style.borderColor = 'var(--primary-color)';
            imageUploadArea.style.backgroundColor = 'rgba(44, 62, 80, 0.05)';
        });
        
        imageUploadArea.addEventListener('dragleave', () => {
            imageUploadArea.style.borderColor = 'var(--light-gray)';
            imageUploadArea.style.backgroundColor = '';
        });
        
        imageUploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            imageUploadArea.style.borderColor = 'var(--light-gray)';
            imageUploadArea.style.backgroundColor = '';
            
            if (e.dataTransfer.files.length) {
                this.handleImageUpload(e.dataTransfer.files);
            }
        });
        
        // Options et variantes
        document.getElementById('addOptionBtn').addEventListener('click', () => {
            this.addOption();
        });
        
        // Annuler
        document.getElementById('cancelBtn').addEventListener('click', () => {
            window.location.href = 'products-list.html';
        });
        
        // Soumission du formulaire
        document.getElementById('productForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct();
        });
    }
    
    initSelect2() {
        $('#category').select2({
            placeholder: 'Sélectionner une catégorie',
            allowClear: true
        });
        
        $('#tags').select2({
            tags: true,
            tokenSeparators: [','],
            placeholder: 'Ajouter des tags'
        });
    }
    
    initTabs() {
        // Activer le premier onglet
        this.switchTab('basic');
    }
    
    switchTab(tabId) {
        // Désactiver tous les onglets
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Activer l'onglet sélectionné
        document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
        document.getElementById(`${tabId}-tab`).classList.add('active');
    }
    
    switchLanguage(lang) {
        // Désactiver tous les onglets de langue
        document.querySelectorAll('.language-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        document.querySelectorAll('.language-content').forEach(content => {
            content.classList.remove('active');
        });
        
        // Activer la langue sélectionnée
        document.querySelector(`.language-tab[data-lang="${lang}"]`).classList.add('active');
        document.querySelector(`.language-content[data-lang="${lang}"]`).classList.add('active');
    }
    
    async loadCategories() {
        try {
            const response = await fetch(`${this.apiUrl}/categories`);
            const data = await response.json();
            
            if (data.success) {
                const categorySelect = document.getElementById('category');
                
                data.data.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category._id;
                    option.textContent = category.name;
                    categorySelect.appendChild(option);
                });
                
                // Re-initialiser Select2
                $('#category').trigger('change');
            }
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
        }
    }
    
    async loadProduct(productId) {
        try {
            const response = await fetch(`${this.apiUrl}/products/${productId}`);
            const data = await response.json();
            
            if (data.success) {
                const product = data.data;
                
                // Remplir le formulaire
                document.getElementById('name_fr').value = product.name;
                document.getElementById('name_en').value = product.name_en;
                document.getElementById('name_es').value = product.name_es;
                
                document.getElementById('description_fr').value = product.description;
                document.getElementById('description_en').value = product.description_en;
                document.getElementById('description_es').value = product.description_es;
                
                $('#category').val(product.category._id).trigger('change');
                
                document.getElementById('sku').value = product.sku || '';
                document.getElementById('barcode').value = product.barcode || '';
                
                if (product.tags && product.tags.length > 0) {
                    $('#tags').val(product.tags).trigger('change');
                }
                
                document.getElementById('status').value = product.status;
                document.getElementById('isFeatured').checked = product.isFeatured;
                
                document.getElementById('price').value = product.price;
                document.getElementById('comparePrice').value = product.comparePrice || '';
                document.getElementById('cost').value = product.cost || '';
                
                document.getElementById('trackQuantity').checked = product.trackQuantity;
                document.getElementById('quantity').value = product.quantity || 0;
                
                if (product.trackQuantity) {
                    document.getElementById('inventoryFields').style.display = 'block';
                }
                
                // Charger les images
                if (product.images && product.images.length > 0) {
                    this.images = product.images;
                    this.renderImages();
                }
                
                // Charger les options et variantes
                if (product.options && product.options.length > 0) {
                    this.options = product.options;
                    this.renderOptions();
                }
                
                if (product.variants && product.variants.length > 0) {
                    this.variants = product.variants;
                    this.renderVariants();
                }
            }
        } catch (error) {
            console.error('Erreur chargement produit:', error);
            alert('Erreur lors du chargement du produit');
        }
    }
    
    async handleImageUpload(files) {
        // Simuler l'upload (dans la vraie app, uploader vers Cloudinary/S3)
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Vérifier que c'est une image
            if (!file.type.startsWith('image/')) {
                alert('Seules les images sont autorisées');
                continue;
            }
            
            // Créer une URL temporaire pour la prévisualisation
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const newImage = {
                    url: e.target.result,
                    publicId: `temp-${Date.now()}-${i}`,
                    isMain: this.images.length === 0 // Première image = principale
                };
                
                this.images.push(newImage);
                this.renderImages();
            };
            
            reader.readAsDataURL(file);
        }
        
        // Réinitialiser l'input file
        document.getElementById('imageInput').value = '';
    }
    
    renderImages() {
        const container = document.getElementById('imagesPreview');
        container.innerHTML = '';
        
        this.images.forEach((image, index) => {
            const div = document.createElement('div');
            div.className = 'image-preview';
            
            div.innerHTML = `
                <img src="${image.url}" alt="Image ${index + 1}">
                <div class="image-actions">
                    <button type="button" class="image-action-btn set-main" data-index="${index}" title="Définir comme image principale">
                        <i class="fas fa-star"></i>
                    </button>
                    <button type="button" class="image-action-btn delete-image" data-index="${index}" title="Supprimer">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                ${image.isMain ? '<span class="main-image-badge">Principale</span>' : ''}
            `;
            
            container.appendChild(div);
        });
        
        // Ajouter les événements
        container.querySelectorAll('.set-main').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.set-main').getAttribute('data-index'));
                this.setMainImage(index);
            });
        });
        
        container.querySelectorAll('.delete-image').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(e.target.closest('.delete-image').getAttribute('data-index'));
                this.deleteImage(index);
            });
        });
    }
    
    setMainImage(index) {
        this.images.forEach((img, i) => {
            img.isMain = i === index;
        });
        
        this.renderImages();
    }
    
    deleteImage(index) {
        if (confirm('Supprimer cette image ?')) {
            this.images.splice(index, 1);
            
            // Si on a supprimé l'image principale et qu'il reste des images, définir la première comme principale
            if (this.images.length > 0 && !this.images.some(img => img.isMain)) {
                this.images[0].isMain = true;
            }
            
            this.renderImages();
        }
    }
    
    addOption() {
        const template = document.getElementById('optionTemplate');
        const clone = template.content.cloneNode(true);
        const optionItem = clone.querySelector('.option-item');
        
        const container = document.getElementById('optionsContainer');
        container.appendChild(optionItem);
        
        // Ajouter les événements pour cette option
        this.initOptionEvents(optionItem);
        
        // Générer les variantes
        this.generateVariants();
    }
    
    initOptionEvents(optionItem) {
        // Supprimer l'option
        const deleteBtn = optionItem.querySelector('.delete-option');
        deleteBtn.addEventListener('click', () => {
            if (confirm('Supprimer cette option ?')) {
                optionItem.remove();
                this.generateVariants();
            }
        });
        
        // Ajouter une valeur
        const addValueBtn = optionItem.querySelector('.add-value');
        addValueBtn.addEventListener('click', () => {
            this.addOptionValue(optionItem);
        });
        
        // Supprimer une
