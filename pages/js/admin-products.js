// Gestion des produits dans l'administration - VERSION CORRIGÉE

class AdminProducts {
    constructor() {
        this.apiUrl = 'https://es-company-api.onrender.com/api';
        this.currentProductId = null;
        this.images = [];
        this.options = [];
        this.variants = [];
        this.categories = []; // Stocker les catégories
        
        this.init();
    }
    
    async init() {
        // Vérifier si on est en mode édition
        this.checkEditMode();
        
        // Charger les catégories AVANT d'initialiser les événements
        await this.loadCategories();
        
        // Initialiser les événements
        this.initEvents();
        
        // Initialiser Select2 avec les catégories
        this.initSelect2();
        
        // Initialiser les onglets
        this.initTabs();
        
        // Remplir le select des catégories
        this.populateCategorySelect();
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
    
    async initEvents() {
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
        }
        
        // Drag and drop pour images
        if (imageUploadArea) {
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
    }
    
    async loadCategories() {
        try {
            console.log('Chargement des catégories...');
            const response = await fetch(`${this.apiUrl}/categories`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                this.categories = data.data;
                console.log('Catégories chargées:', this.categories);
            } else {
                console.error('Erreur API:', data.error);
                this.loadDefaultCategories();
            }
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            this.loadDefaultCategories();
        }
    }
    
    loadDefaultCategories() {
        // Catégories par défaut si l'API échoue
        this.categories = [
            { _id: '1', name: 'Robes', name_en: 'Dresses', name_es: 'Vestidos' },
            { _id: '2', name: 'Pantalons', name_en: 'Pants', name_es: 'Pantalones' },
            { _id: '3', name: 'Jupes', name_en: 'Skirts', name_es: 'Faldas' },
            { _id: '4', name: 'Chemises', name_en: 'Shirts', name_es: 'Camisas' },
            { _id: '5', name: 'Chaussures', name_en: 'Shoes', name_es: 'Zapatos' },
            { _id: '6', name: 'Bijoux', name_en: 'Jewelry', name_es: 'Joyas' },
            { _id: '7', name: 'Accessoires', name_en: 'Accessories', name_es: 'Accesorios' },
            { _id: '8', name: 'Sacs', name_en: 'Bags', name_es: 'Bolsos' }
        ];
        console.log('Catégories par défaut chargées');
    }
    
    populateCategorySelect() {
        const categorySelect = document.getElementById('category');
        if (!categorySelect) {
            console.error('Select de catégorie non trouvé');
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
        
        console.log('Catégories ajoutées au select:', this.categories.length);
    }
    
    initSelect2() {
        const categorySelect = $('#category');
        if (categorySelect.length) {
            categorySelect.select2({
                placeholder: 'Sélectionner une catégorie',
                allowClear: true,
                width: '100%'
            });
            
            console.log('Select2 initialisé sur la catégorie');
        }
        
        const tagsSelect = $('#tags');
        if (tagsSelect.length) {
            tagsSelect.select2({
                tags: true,
                tokenSeparators: [','],
                placeholder: 'Ajouter des tags'
            });
        }
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
        const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
        const tabContent = document.getElementById(`${tabId}-tab`);
        
        if (tabBtn) tabBtn.classList.add('active');
        if (tabContent) tabContent.classList.add('active');
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
        const langTab = document.querySelector(`.language-tab[data-lang="${lang}"]`);
        const langContent = document.querySelector(`.language-content[data-lang="${lang}"]`);
        
        if (langTab) langTab.classList.add('active');
        if (langContent) langContent.classList.add('active');
    }
    
    async loadProduct(productId) {
        try {
            console.log('Chargement du produit:', productId);
            const response = await fetch(`${this.apiUrl}/products/${productId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                const product = data.data;
                console.log('Produit chargé:', product);
                
                // Remplir le formulaire
                this.fillProductForm(product);
                
            } else {
                console.error('Erreur chargement produit:', data.error);
                alert('Erreur lors du chargement du produit');
            }
        } catch (error) {
            console.error('Erreur chargement produit:', error);
            alert('Erreur lors du chargement du produit');
        }
    }
    
    fillProductForm(product) {
        // Remplir les champs de base
        const nameFr = document.getElementById('name_fr');
        const nameEn = document.getElementById('name_en');
        const nameEs = document.getElementById('name_es');
        
        if (nameFr) nameFr.value = product.name || '';
        if (nameEn) nameEn.value = product.name_en || product.name || '';
        if (nameEs) nameEs.value = product.name_es || product.name || '';
        
        // Description
        const descFr = document.getElementById('description_fr');
        const descEn = document.getElementById('description_en');
        const descEs = document.getElementById('description_es');
        
        if (descFr) descFr.value = product.description || '';
        if (descEn) descEn.value = product.description_en || product.description || '';
        if (descEs) descEs.value = product.description_es || product.description || '';
        
        // Catégorie
        const categorySelect = document.getElementById('category');
        if (categorySelect && product.category) {
            categorySelect.value = product.category._id || product.category;
            
            // Mettre à jour Select2
            $('#category').val(product.category._id || product.category).trigger('change');
        }
        
        // SKU, barcode
        const sku = document.getElementById('sku');
        const barcode = document.getElementById('barcode');
        
        if (sku) sku.value = product.sku || '';
        if (barcode) barcode.value = product.barcode || '';
        
        // Tags
        if (product.tags && product.tags.length > 0) {
            $('#tags').val(product.tags).trigger('change');
        }
        
        // Statut
        const status = document.getElementById('status');
        if (status) status.value = product.status || 'active';
        
        // Produit en vedette
        const isFeatured = document.getElementById('isFeatured');
        if (isFeatured) isFeatured.checked = product.isFeatured || false;
        
        // Prix
        const price = document.getElementById('price');
        const comparePrice = document.getElementById('comparePrice');
        const cost = document.getElementById('cost');
        
        if (price) price.value = product.price || 0;
        if (comparePrice) comparePrice.value = product.comparePrice || '';
        if (cost) cost.value = product.cost || '';
        
        // Inventaire
        const trackQuantity = document.getElementById('trackQuantity');
        const quantity = document.getElementById('quantity');
        const inventoryFields = document.getElementById('inventoryFields');
        
        if (trackQuantity) trackQuantity.checked = product.trackQuantity || false;
        if (quantity) quantity.value = product.quantity || 0;
        if (inventoryFields) {
            inventoryFields.style.display = trackQuantity?.checked ? 'block' : 'none';
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
    
    async handleImageUpload(files) {
        // Pour l'instant, simulons l'upload avec des URLs locales
        // Dans une vraie app, vous uploaderiez vers un serveur
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
        const imageInput = document.getElementById('imageInput');
        if (imageInput) imageInput.value = '';
    }
    
    renderImages() {
        const container = document.getElementById('imagesPreview');
        if (!container) return;
        
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
        if (!template) return;
        
        const clone = template.content.cloneNode(true);
        const optionItem = clone.querySelector('.option-item');
        
        const container = document.getElementById('optionsContainer');
        if (!container) return;
        
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
        
        // Supprimer une valeur
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
            const name = nameInput ? nameInput.value.trim() : '';
            
            const values = [];
            item.querySelectorAll('.value-input').forEach(input => {
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
            return;
        }
        
        // Générer toutes les combinaisons possibles
        const combinations = this.getCombinations(options);
        
        // Récupérer le prix de base
        const priceInput = document.getElementById('price');
        const basePrice = priceInput ? parseFloat(priceInput.value) || 0 : 0;
        
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
                price: basePrice,
                comparePrice: 0,
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
            
            if (lastOption) {
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
            }
        });
        
        // Générer les variantes
        this.generateVariants();
    }
    
    async saveProduct() {
        try {
            // Récupérer les données du formulaire
            const formData = this.getFormData();
            
            // Validation
            if (!this.validateFormData(formData)) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn ? submitBtn.innerHTML : '';
            
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
            }
            
            // Vérifier l'authentification
            if (!window.adminAuth || !window.adminAuth.token) {
                alert('Vous devez être connecté pour ajouter un produit');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                return;
            }
            
            let response;
            
            if (this.currentProductId) {
                // Mise à jour
                response = await window.adminAuth.fetchWithAuth(`/products/${this.currentProductId}`, {
                    method: 'PUT',
                    body: JSON.stringify(formData)
                });
            } else {
                // Création
                response = await window.adminAuth.fetchWithAuth('/products', {
                    method: 'POST',
                    body: JSON.stringify(formData)
                });
            }
            
            const data = await response.json();
            
            if (data.success) {
                alert(`Produit ${this.currentProductId ? 'mis à jour' : 'créé'} avec succès !`);
                window.location.href = 'products-list.html';
            } else {
                alert(data.error || 'Erreur lors de l\'enregistrement');
            }
            
        } catch (error) {
            console.error('Erreur sauvegarde produit:', error);
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
        return {
            name: document.getElementById('name_fr')?.value.trim() || '',
            name_en: document.getElementById('name_en')?.value.trim() || '',
            name_es: document.getElementById('name_es')?.value.trim() || '',
            description: document.getElementById('description_fr')?.value.trim() || '',
            description_en: document.getElementById('description_en')?.value.trim() || '',
            description_es: document.getElementById('description_es')?.value.trim() || '',
            category: document.getElementById('category')?.value || '',
            price: parseFloat(document.getElementById('price')?.value) || 0,
            comparePrice: document.getElementById('comparePrice')?.value ? parseFloat(document.getElementById('comparePrice').value) : undefined,
            cost: document.getElementById('cost')?.value ? parseFloat(document.getElementById('cost').value) : undefined,
            sku: document.getElementById('sku')?.value.trim() || undefined,
            barcode: document.getElementById('barcode')?.value.trim() || undefined,
            trackQuantity: document.getElementById('trackQuantity')?.checked || false,
            quantity: document.getElementById('trackQuantity')?.checked ? parseInt(document.getElementById('quantity')?.value) || 0 : 0,
            images: this.images,
            status: document.getElementById('status')?.value || 'active',
            isFeatured: document.getElementById('isFeatured')?.checked || false,
            tags: $('#tags').val() || [],
            options: this.options,
            variants: this.variants
        };
    }
    
    validateFormData(data) {
        // Validation de base
        if (!data.name || !data.category || !data.price || data.price <= 0) {
            return false;
        }
        
        // Vérifier que la catégorie existe dans la liste
        const categoryExists = this.categories.some(cat => cat._id === data.category);
        if (!categoryExists) {
            alert('Catégorie invalide');
            return false;
        }
        
        return true;
    }
}

// Initialiser la gestion des produits
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si nous sommes sur la page d'ajout/modification de produit
    if (window.location.pathname.includes('products.html') && 
        !window.location.pathname.includes('products-list.html')) {
        
        // Attendre que l'authentification soit chargée
        if (window.adminAuth) {
            window.adminProducts = new AdminProducts();
        } else {
            // Si adminAuth n'est pas encore chargé, attendre
            const checkAuth = setInterval(() => {
                if (window.adminAuth) {
                    clearInterval(checkAuth);
                    window.adminProducts = new AdminProducts();
                }
            }, 100);
        }
    }
});
