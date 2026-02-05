// Gestion des produits dans l'administration - VERSION COMPLÈTE CORRIGÉE

class AdminProducts {
    constructor() {
        this.apiUrl = 'https://es-company-api.onrender.com/api';
        this.currentProductId = null;
        this.images = [];
        this.options = [];
        this.variants = [];
        this.categories = [];
        
        this.init();
    }
    
    async init() {
        console.log('AdminProducts: Initialisation...');
        
        // Vérifier si on est en mode édition
        this.checkEditMode();
        
        // Charger les catégories
        await this.loadCategories();
        
        // Initialiser Select2
        this.initSelect2();
        
        // Initialiser les événements
        this.initEvents();
        
        // Initialiser les onglets
        this.initTabs();
        
        console.log('AdminProducts: Initialisation terminée');
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
    
    async loadCategories() {
        console.log('AdminProducts: Chargement des catégories...');
        
        try {
            // Afficher l'indicateur de chargement
            this.showCategoryLoading(true);
            
            // Utiliser l'API avec authentification
            const response = await adminAuth.fetchWithAuth('/categories');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success && data.data && Array.isArray(data.data)) {
                this.categories = data.data;
                this.populateCategorySelect();
                console.log(`AdminProducts: ${this.categories.length} catégories chargées`);
            } else {
                console.warn('AdminProducts: Format de réponse invalide, utilisation des catégories par défaut');
                this.showFallbackCategories();
            }
            
            this.showCategoryLoading(false);
            
        } catch (error) {
            console.error('AdminProducts: Erreur chargement catégories:', error);
            this.showCategoryError();
            this.showFallbackCategories();
        }
    }
    
    populateCategorySelect() {
        const categorySelect = document.getElementById('category');
        if (!categorySelect) {
            console.error('AdminProducts: Élément #category non trouvé');
            return;
        }
        
        // Vider les options existantes (sauf la première)
        while (categorySelect.options.length > 1) {
            categorySelect.remove(1);
        }
        
        // Ajouter les catégories
        this.categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category._id;
            option.textContent = category.name;
            categorySelect.appendChild(option);
        });
        
        console.log(`AdminProducts: ${this.categories.length} options ajoutées au select`);
        
        // Re-initialiser Select2 si présent
        if (typeof $ !== 'undefined' && $('#category').data('select2')) {
            $('#category').trigger('change');
            console.log('AdminProducts: Select2 réinitialisé');
        }
    }
    
    showFallbackCategories() {
        console.log('AdminProducts: Affichage des catégories par défaut');
        
        // Catégories par défaut garanties
        const fallbackCategories = [
            { _id: '1', name: 'Robes', name_en: 'Dresses', name_es: 'Vestidos' },
            { _id: '2', name: 'Pantalons', name_en: 'Pants', name_es: 'Pantalones' },
            { _id: '3', name: 'Jupes', name_en: 'Skirts', name_es: 'Faldas' },
            { _id: '4', name: 'Chaussures', name_en: 'Shoes', name_es: 'Zapatos' },
            { _id: '5', name: 'Bijoux', name_en: 'Jewelry', name_es: 'Joyas' },
            { _id: '6', name: 'Accessoires', name_en: 'Accessories', name_es: 'Accesorios' },
            { _id: '7', name: 'Hauts', name_en: 'Tops', name_es: 'Tops' },
            { _id: '8', name: 'Vestes', name_en: 'Jackets', name_es: 'Chaquetas' },
            { _id: '9', name: 'Sacs', name_en: 'Bags', name_es: 'Bolsos' },
            { _id: '10', name: 'Sous-vêtements', name_en: 'Underwear', name_es: 'Ropa Interior' },
            { _id: '11', name: 'Maillots de bain', name_en: 'Swimwear', name_es: 'Trajes de baño' },
            { _id: '12', name: 'Vêtements sport', name_en: 'Sportswear', name_es: 'Ropa deportiva' }
        ];
        
        this.categories = fallbackCategories;
        this.populateCategorySelect();
    }
    
    showCategoryLoading(show) {
        const loadingElement = document.getElementById('categoryLoading');
        if (loadingElement) {
            loadingElement.style.display = show ? 'block' : 'none';
        }
    }
    
    showCategoryError() {
        const errorElement = document.getElementById('categoryError');
        if (errorElement) {
            errorElement.style.display = 'block';
        }
    }
    
    initSelect2() {
        console.log('AdminProducts: Initialisation de Select2...');
        
        // Vérifier que jQuery et Select2 sont chargés
        if (typeof $ === 'undefined') {
            console.error('AdminProducts: jQuery non chargé');
            return;
        }
        
        if (typeof $.fn.select2 === 'undefined') {
            console.error('AdminProducts: Select2 non chargé');
            return;
        }
        
        // Initialiser Select2 pour la catégorie
        $('#category').select2({
            placeholder: 'Sélectionner une catégorie',
            allowClear: true,
            width: '100%',
            dropdownParent: $('.product-form-container').length ? $('.product-form-container') : $(document.body)
        }).on('select2:open', () => {
            // S'assurer que le dropdown s'affiche correctement
            $('.select2-dropdown').css('z-index', '10000');
        });
        
        // Initialiser Select2 pour les tags
        $('#tags').select2({
            tags: true,
            tokenSeparators: [','],
            placeholder: 'Ajouter des tags (séparés par des virgules)',
            width: '100%'
        });
        
        console.log('AdminProducts: Select2 initialisé avec succès');
    }
    
    initEvents() {
        console.log('AdminProducts: Initialisation des événements...');
        
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
        
        if (trackQuantityCheckbox && inventoryFields) {
            trackQuantityCheckbox.addEventListener('change', () => {
                inventoryFields.style.display = trackQuantityCheckbox.checked ? 'block' : 'none';
            });
        }
        
        // Upload d'images
        const imageUploadArea = document.getElementById('imageUploadArea');
        const imageInput = document.getElementById('imageInput');
        
        if (imageUploadArea && imageInput) {
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
        }
        
        // Options et variantes
        const addOptionBtn = document.getElementById('addOptionBtn');
        if (addOptionBtn) {
            addOptionBtn.addEventListener('click', () => {
                this.addOption();
            });
        }
        
        // Annuler
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                window.location.href = 'products-list.html';
            });
        }
        
        // Soumission du formulaire
        const productForm = document.getElementById('productForm');
        if (productForm) {
            productForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveProduct();
            });
        }
        
        console.log('AdminProducts: Événements initialisés');
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
        const selectedBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        const selectedTab = document.getElementById(`${tabId}-tab`);
        
        if (selectedBtn) selectedBtn.classList.add('active');
        if (selectedTab) selectedTab.classList.add('active');
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
        const selectedTab = document.querySelector(`.language-tab[data-lang="${lang}"]`);
        const selectedContent = document.querySelector(`.language-content[data-lang="${lang}"]`);
        
        if (selectedTab) selectedTab.classList.add('active');
        if (selectedContent) selectedContent.classList.add('active');
    }
    
    async loadProduct(productId) {
        console.log(`AdminProducts: Chargement du produit ${productId}...`);
        
        try {
            const response = await adminAuth.fetchWithAuth(`/products/${productId}`);
            const data = await response.json();
            
            if (data.success) {
                const product = data.data;
                console.log('AdminProducts: Produit chargé:', product);
                
                // Remplir le formulaire
                this.fillProductForm(product);
            } else {
                throw new Error(data.error || 'Produit non trouvé');
            }
        } catch (error) {
            console.error('AdminProducts: Erreur chargement produit:', error);
            alert('Erreur lors du chargement du produit: ' + error.message);
        }
    }
    
    fillProductForm(product) {
        // Informations de base
        document.getElementById('name_fr').value = product.name || '';
        document.getElementById('name_en').value = product.name_en || product.name || '';
        document.getElementById('name_es').value = product.name_es || product.name || '';
        
        // Descriptions
        document.getElementById('description_fr').value = product.description || '';
        document.getElementById('description_en').value = product.description_en || product.description || '';
        document.getElementById('description_es').value = product.description_es || product.description || '';
        
        // Catégorie
        if (product.category && $('#category').data('select2')) {
            $('#category').val(product.category._id).trigger('change');
        } else if (product.category) {
            document.getElementById('category').value = product.category._id;
        }
        
        // SKU et code-barres
        document.getElementById('sku').value = product.sku || '';
        document.getElementById('barcode').value = product.barcode || '';
        
        // Tags
        if (product.tags && product.tags.length > 0 && $('#tags').data('select2')) {
            $('#tags').val(product.tags).trigger('change');
        } else if (product.tags) {
            document.getElementById('tags').value = product.tags.join(', ');
        }
        
        // Statut et vedette
        document.getElementById('status').value = product.status || 'active';
        document.getElementById('isFeatured').checked = product.isFeatured || false;
        
        // Prix
        document.getElementById('price').value = product.price || 0;
        document.getElementById('comparePrice').value = product.comparePrice || '';
        document.getElementById('cost').value = product.cost || '';
        
        // Inventaire
        document.getElementById('trackQuantity').checked = product.trackQuantity || false;
        document.getElementById('quantity').value = product.quantity || 0;
        
        const inventoryFields = document.getElementById('inventoryFields');
        if (inventoryFields) {
            inventoryFields.style.display = product.trackQuantity ? 'block' : 'none';
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
        
        console.log('AdminProducts: Formulaire rempli avec succès');
    }
    
    async handleImageUpload(files) {
        console.log(`AdminProducts: Upload de ${files.length} image(s)...`);
        
        // Pour l'instant, simuler l'upload (dans la vraie app, uploader vers Cloudinary/S3)
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            
            // Vérifier que c'est une image
            if (!file.type.startsWith('image/')) {
                alert('Seules les images sont autorisées');
                continue;
            }
            
            // Limite de taille (5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert(`L'image ${file.name} est trop grande (max 5MB)`);
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
            
            reader.onerror = () => {
                alert(`Erreur lors de la lecture de l'image ${file.name}`);
            };
            
            reader.readAsDataURL(file);
        }
        
        // Réinitialiser l'input file
        document.getElementById('imageInput').value = '';
    }
    
    renderImages() {
        const container = document.getElementById('imagesPreview');
        if (!container) return;
        
        container.innerHTML = '';
        
        if (this.images.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <i class="fas fa-images"></i>
                    <p>Aucune image ajoutée</p>
                </div>
            `;
            return;
        }
        
        this.images.forEach((image, index) => {
            const div = document.createElement('div');
            div.className = 'image-preview';
            
            div.innerHTML = `
                <img src="${image.url}" alt="Image ${index + 1}" loading="lazy">
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
        if (!template) {
            console.error('AdminProducts: Template d\'option non trouvé');
            return;
        }
        
        const clone = template.content.cloneNode(true);
        const optionItem = clone.querySelector('.option-item');
        
        const container = document.getElementById('optionsContainer');
        if (!container) {
            console.error('AdminProducts: Conteneur d\'options non trouvé');
            return;
        }
        
        container.appendChild(optionItem);
        
        // Ajouter les événements pour cette option
        this.initOptionEvents(optionItem);
        
        // Générer les variantes
        this.generateVariants();
    }
    
    initOptionEvents(optionItem) {
        // Supprimer l'option
        const deleteBtn = optionItem.querySelector('.delete-option');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Supprimer cette option ?')) {
                    optionItem.remove();
                    this.generateVariants();
                }
            });
        }
        
        // Ajouter une valeur
        const addValueBtn = optionItem.querySelector('.add-value');
        if (addValueBtn) {
            addValueBtn.addEventListener('click', () => {
                this.addOptionValue(optionItem);
            });
        }
        
        // Supprimer une valeur (pour les valeurs existantes)
        const deleteValueBtns = optionItem.querySelectorAll('.delete-value');
        deleteValueBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const valueDiv = e.target.closest('.option-value');
                if (confirm('Supprimer cette valeur ?')) {
                    valueDiv.remove();
                    this.generateVariants();
                }
            });
        });
        
        // Écouter les changements dans les valeurs
        const nameInput = optionItem.querySelector('.option-name');
        const valueInputs = optionItem.querySelectorAll('.value-input');
        
        const handleChange = () => {
            setTimeout(() => this.generateVariants(), 100);
        };
        
        if (nameInput) nameInput.addEventListener('input', handleChange);
        valueInputs.forEach(input => {
            input.addEventListener('input', handleChange);
        });
    }
    
    addOptionValue(optionItem) {
        const valuesContainer = optionItem.querySelector('.option-values');
        if (!valuesContainer) return;
        
        const valueDiv = document.createElement('div');
        valueDiv.className = 'option-value';
        valueDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 10px;';
        
        valueDiv.innerHTML = `
            <input type="text" class="form-control value-input" placeholder="Valeur (ex: S)" style="flex: 1;">
            <button type="button" class="btn btn-outline delete-value" style="padding: 5px 10px; font-size: 0.9rem;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        valuesContainer.appendChild(valueDiv);
        
        // Événement pour supprimer la valeur
        const deleteBtn = valueDiv.querySelector('.delete-value');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                if (confirm('Supprimer cette valeur ?')) {
                    valueDiv.remove();
                    this.generateVariants();
                }
            });
        }
        
        // Écouter les changements
        const valueInput = valueDiv.querySelector('.value-input');
        if (valueInput) {
            valueInput.addEventListener('input', () => {
                setTimeout(() => this.generateVariants(), 100);
            });
        }
        
        // Générer les variantes
        this.generateVariants();
    }
    
    generateVariants() {
        // Récupérer toutes les options et leurs valeurs
        const optionItems = document.querySelectorAll('.option-item');
        const options = [];
        
        optionItems.forEach(item => {
            const nameInput = item.querySelector('.option-name');
            const valueInputs = item.querySelectorAll('.value-input');
            
            if (!nameInput) return;
            
            const name = nameInput.value.trim();
            const values = [];
            
            valueInputs.forEach(input => {
                const value = input.value.trim();
                if (value) {
                    values.push(value);
                }
            });
            
            if (name && values.length > 0) {
                options.push({ name, values });
            }
        });
        
        this.options = options;
        
        // Si pas d'options, cacher la section variantes
        const variantsSection = document.getElementById('variantsSection');
        if (variantsSection) {
            variantsSection.style.display = options.length === 0 ? 'none' : 'block';
        }
        
        if (options.length === 0) {
            this.variants = [];
            this.renderVariants();
            return;
        }
        
        // Générer toutes les combinaisons possibles
        const combinations = this.getCombinations(options);
        
        // Générer les variantes
        this.variants = combinations.map(combination => {
            const variantOptions = [];
            let variantName = '';
            
            options.forEach((option, index) => {
                const value = combination[index];
                variantOptions.push({
                    name: option.name,
                    value: value
                });
                
                if (variantName) variantName += ' / ';
                variantName += value;
            });
            
            return {
                options: variantOptions,
                sku: '',
                price: parseFloat(document.getElementById('price').value) || 0,
                comparePrice: parseFloat(document.getElementById('comparePrice').value) || 0,
                quantity: 0
            };
        });
        
        // Rendre les variantes
        this.renderVariants();
    }
    
    getCombinations(options) {
        if (options.length === 0) return [];
        if (options.length === 1) return options[0].values.map(v => [v]);
        
        const [first, ...rest] = options;
        const restCombinations = this.getCombinations(rest);
        const combinations = [];
        
        first.values.forEach(value => {
            restCombinations.forEach(restCombo => {
                combinations.push([value, ...restCombo]);
            });
        });
        
        return combinations;
    }
    
    renderVariants() {
        const tbody = document.getElementById('variantsBody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (this.variants.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td colspan="4" class="empty-state">
                    <i class="fas fa-cubes"></i>
                    <p>Aucune variante générée</p>
                    <p>Ajoutez des options avec leurs valeurs pour générer des variantes</p>
                </td>
            `;
            tbody.appendChild(row);
            return;
        }
        
        this.variants.forEach((variant, index) => {
            const row = document.createElement('tr');
            
            const optionsText = variant.options.map(opt => `${opt.name}: ${opt.value}`).join(', ');
            
            row.innerHTML = `
                <td>${optionsText}</td>
                <td><input type="text" class="form-control variant-sku" data-index="${index}" value="${variant.sku}" placeholder="SKU" style="width: 120px;"></td>
                <td><input type="number" class="form-control variant-price" data-index="${index}" value="${variant.price}" min="0" step="0.01" style="width: 100px;"></td>
                <td><input type="number" class="form-control variant-quantity" data-index="${index}" value="${variant.quantity}" min="0" style="width: 100px;"></td>
            `;
            
            tbody.appendChild(row);
        });
        
        // Ajouter les événements pour les inputs
        tbody.querySelectorAll('.variant-sku').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.variants[index].sku = e.target.value;
            });
        });
        
        tbody.querySelectorAll('.variant-price').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.variants[index].price = parseFloat(e.target.value) || 0;
            });
        });
        
        tbody.querySelectorAll('.variant-quantity').forEach(input => {
            input.addEventListener('input', (e) => {
                const index = parseInt(e.target.getAttribute('data-index'));
                this.variants[index].quantity = parseInt(e.target.value) || 0;
            });
        });
    }
    
    renderOptions() {
        const container = document.getElementById('optionsContainer');
        if (!container) return;
        
        container.innerHTML = '';
        
        this.options.forEach(option => {
            this.addOption();
            
            // Remplir la dernière option ajoutée
            const optionItems = container.querySelectorAll('.option-item');
            const lastOption = optionItems[optionItems.length - 1];
            
            const nameInput = lastOption.querySelector('.option-name');
            if (nameInput) nameInput.value = option.name;
            
            // Supprimer la valeur par défaut
            const valuesContainer = lastOption.querySelector('.option-values');
            if (valuesContainer) valuesContainer.innerHTML = '';
            
            // Ajouter les valeurs
            option.values.forEach(value => {
                this.addOptionValue(lastOption);
                const valueInputs = lastOption.querySelectorAll('.value-input');
                if (valueInputs.length > 0) {
                    valueInputs[valueInputs.length - 1].value = value;
                }
            });
        });
        
        // Générer les variantes
        this.generateVariants();
    }
    
    async saveProduct() {
        console.log('AdminProducts: Sauvegarde du produit...');
        
        try {
            // Récupérer les données du formulaire
            const formData = this.getFormData();
            
            // Validation
            if (!this.validateFormData(formData)) {
                return;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            // Désactiver le bouton
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
            
            let response;
            let isUpdate = false;
            
            if (this.currentProductId) {
                // Mise à jour
                isUpdate = true;
                response = await adminAuth.fetchWithAuth(`/products/${this.currentProductId}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
            } else {
                // Création
                response = await adminAuth.fetchWithAuth('/products', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            }
            
            const data = await response.json();
            
            if (data.success) {
                alert(`Produit ${isUpdate ? 'mis à jour' : 'créé'} avec succès !`);
                window.location.href = 'products-list.html';
            } else {
                throw new Error(data.error || 'Erreur lors de l\'enregistrement');
            }
            
        } catch (error) {
            console.error('AdminProducts: Erreur sauvegarde produit:', error);
            alert('Erreur lors de l\'enregistrement du produit: ' + error.message);
        } finally {
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Enregistrer le produit';
            }
        }
    }
    
    getFormData() {
        const formData = {
            name: document.getElementById('name_fr').value.trim(),
            name_en: document.getElementById('name_en').value.trim() || document.getElementById('name_fr').value.trim(),
            name_es: document.getElementById('name_es').value.trim() || document.getElementById('name_fr').value.trim(),
            description: document.getElementById('description_fr').value.trim(),
            description_en: document.getElementById('description_en').value.trim() || document.getElementById('description_fr').value.trim(),
            description_es: document.getElementById('description_es').value.trim() || document.getElementById('description_fr').value.trim(),
            category: document.getElementById('category').value,
            price: parseFloat(document.getElementById('price').value) || 0,
            images: this.images,
            status: document.getElementById('status').value,
            isFeatured: document.getElementById('isFeatured').checked,
            options: this.options,
            variants: this.variants
        };
        
        // Champs optionnels
        const comparePrice = document.getElementById('comparePrice').value;
        const cost = document.getElementById('cost').value;
        const sku = document.getElementById('sku').value.trim();
        const barcode = document.getElementById('barcode').value.trim();
        const trackQuantity = document.getElementById('trackQuantity').checked;
        const quantity = document.getElementById('quantity').value;
        const tags = $('#tags').val();
        
        if (comparePrice) formData.comparePrice = parseFloat(comparePrice);
        if (cost) formData.cost = parseFloat(cost);
        if (sku) formData.sku = sku;
        if (barcode) formData.barcode = barcode;
        if (tags && tags.length > 0) formData.tags = Array.isArray(tags) ? tags : [tags];
        
        formData.trackQuantity = trackQuantity;
        if (trackQuantity) {
            formData.quantity = parseInt(quantity) || 0;
        }
        
        return formData;
    }
    
    validateFormData(formData) {
        // Validation basique
        if (!formData.name || formData.name.length < 2) {
            alert('Le nom du produit est obligatoire (minimum 2 caractères)');
            return false;
        }
        
        if (!formData.category) {
            alert('Veuillez sélectionner une catégorie');
            return false;
        }
        
        if (!formData.price || formData.price <= 0) {
            alert('Le prix doit être supérieur à 0');
            return false;
        }
        
        if (!formData.description || formData.description.length < 10) {
            alert('La description est obligatoire (minimum 10 caractères)');
            return false;
        }
        
        // Vérifier les images
        if (this.images.length === 0) {
            if (!confirm('Aucune image n\'a été ajoutée. Souhaitez-vous continuer sans image ?')) {
                return false;
            }
        }
        
        return true;
    }
}

// Initialiser la gestion des produits
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, initialisation de AdminProducts...');
    
    // Vérifier si nous sommes sur la page d'ajout/modification de produit
    if (document.querySelector('.product-form-container') || 
        window.location.pathname.includes('products.html') && 
        !window.location.pathname.includes('products-list.html')) {
        
        // Attendre que l'authentification soit prête
        const checkAuth = setInterval(() => {
            if (window.adminAuth && window.adminAuth.token) {
                clearInterval(checkAuth);
                console.log('Authentification OK, initialisation de AdminProducts');
                window.adminProducts = new AdminProducts();
            }
        }, 100);
        
        // Timeout après 5 secondes
        setTimeout(() => {
            clearInterval(checkAuth);
            if (!window.adminAuth || !window.adminAuth.token) {
                console.warn('Authentification non disponible, initialisation en mode limité');
                window.adminProducts = new AdminProducts();
            }
        }, 5000);
    }
});
