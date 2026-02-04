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
        
        nameInput.addEventListener('input', handleChange);
        valueInputs.forEach(input => {
            input.addEventListener('input', handleChange);
        });
    }
    
    addOptionValue(optionItem) {
        const valuesContainer = optionItem.querySelector('.option-values');
        
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
        deleteBtn.addEventListener('click', () => {
            if (confirm('Supprimer cette valeur ?')) {
                valueDiv.remove();
                this.generateVariants();
            }
        });
        
        // Écouter les changements
        const valueInput = valueDiv.querySelector('.value-input');
        valueInput.addEventListener('input', () => {
            setTimeout(() => this.generateVariants(), 100);
        });
        
        // Générer les variantes
        this.generateVariants();
    }
    
    generateVariants() {
        // Récupérer toutes les options et leurs valeurs
        const optionItems = document.querySelectorAll('.option-item');
        const options = [];
        
        optionItems.forEach(item => {
            const name = item.querySelector('.option-name').value.trim();
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
        if (options.length === 0) {
            document.getElementById('variantsSection').style.display = 'none';
            this.variants = [];
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
        
        // Afficher la section variantes
        document.getElementById('variantsSection').style.display = 'block';
        
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
        container.innerHTML = '';
        
        this.options.forEach(option => {
            this.addOption();
            
            // Remplir la dernière option ajoutée
            const optionItems = container.querySelectorAll('.option-item');
            const lastOption = optionItems[optionItems.length - 1];
            
            lastOption.querySelector('.option-name').value = option.name;
            
            // Supprimer la valeur par défaut
            lastOption.querySelector('.option-values').innerHTML = '';
            
            // Ajouter les valeurs
            option.values.forEach(value => {
                this.addOptionValue(lastOption);
                const valueInputs = lastOption.querySelectorAll('.value-input');
                valueInputs[valueInputs.length - 1].value = value;
            });
        });
        
        // Générer les variantes
        this.generateVariants();
    }
    
    async saveProduct() {
        try {
            // Récupérer les données du formulaire
            const formData = {
                name: document.getElementById('name_fr').value.trim(),
                name_en: document.getElementById('name_en').value.trim(),
                name_es: document.getElementById('name_es').value.trim(),
                description: document.getElementById('description_fr').value.trim(),
                description_en: document.getElementById('description_en').value.trim(),
                description_es: document.getElementById('description_es').value.trim(),
                category: document.getElementById('category').value,
                price: parseFloat(document.getElementById('price').value),
                comparePrice: document.getElementById('comparePrice').value ? parseFloat(document.getElementById('comparePrice').value) : undefined,
                cost: document.getElementById('cost').value ? parseFloat(document.getElementById('cost').value) : undefined,
                sku: document.getElementById('sku').value.trim() || undefined,
                barcode: document.getElementById('barcode').value.trim() || undefined,
                trackQuantity: document.getElementById('trackQuantity').checked,
                quantity: document.getElementById('trackQuantity').checked ? parseInt(document.getElementById('quantity').value) || 0 : 0,
                images: this.images,
                status: document.getElementById('status').value,
                isFeatured: document.getElementById('isFeatured').checked,
                tags: $('#tags').val() || [],
                options: this.options,
                variants: this.variants
            };
            
            // Validation
            if (!formData.name || !formData.category || !formData.price) {
                alert('Veuillez remplir tous les champs obligatoires');
                return;
            }
            
            const submitBtn = document.getElementById('submitBtn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enregistrement...';
            
            let response;
            
            if (this.currentProductId) {
                // Mise à jour
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
                alert(`Produit ${this.currentProductId ? 'mis à jour' : 'créé'} avec succès !`);
                window.location.href = 'products-list.html';
            } else {
                alert(data.error || 'Erreur lors de l\'enregistrement');
            }
            
        } catch (error) {
            console.error('Erreur sauvegarde produit:', error);
            alert('Erreur lors de l\'enregistrement du produit');
        } finally {
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<i class="fas fa-save"></i> Enregistrer le produit';
            }
        }
    }
}

// Initialiser la gestion des produits
document.addEventListener('DOMContentLoaded', () => {
    window.adminProducts = new AdminProducts();
});
