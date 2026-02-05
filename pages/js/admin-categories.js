// Gestion des catégories dans le panel admin

class AdminCategories {
    constructor() {
        this.apiUrl = 'https://es-company-api.onrender.com/api';
        this.categories = [];
        this.init();
    }
    
    async init() {
        await this.loadCategories();
        this.initCategoryManagement();
    }
    
    async loadCategories() {
        try {
            const loadingElement = document.getElementById('categoryLoading');
            const errorElement = document.getElementById('categoryError');
            
            if (loadingElement) loadingElement.style.display = 'block';
            if (errorElement) errorElement.style.display = 'none';
            
            const response = await adminAuth.fetchWithAuth('/categories');
            const data = await response.json();
            
            if (data.success) {
                this.categories = data.data;
                this.renderCategories();
            } else {
                throw new Error('Format de réponse invalide');
            }
            
            if (loadingElement) loadingElement.style.display = 'none';
            
        } catch (error) {
            console.error('Erreur chargement catégories:', error);
            
            const loadingElement = document.getElementById('categoryLoading');
            const errorElement = document.getElementById('categoryError');
            
            if (loadingElement) loadingElement.style.display = 'none';
            if (errorElement) errorElement.style.display = 'block';
            
            // Utiliser des catégories par défaut
            this.categories = this.getDefaultCategories();
            this.renderCategories();
        }
    }
    
    getDefaultCategories() {
        return [
            { _id: '1', name: 'Robes', name_en: 'Dresses', name_es: 'Vestidos' },
            { _id: '2', name: 'Pantalons', name_en: 'Pants', name_es: 'Pantalones' },
            { _id: '3', name: 'Jupes', name_en: 'Skirts', name_es: 'Faldas' },
            { _id: '4', name: 'Chaussures', name_en: 'Shoes', name_es: 'Zapatos' },
            { _id: '5', name: 'Bijoux', name_en: 'Jewelry', name_es: 'Joyas' },
            { _id: '6', name: 'Accessoires', name_en: 'Accessories', name_es: 'Accesorios' },
            { _id: '7', name: 'Hauts', name_en: 'Tops', name_es: 'Tops' },
            { _id: '8', name: 'Vestes', name_en: 'Jackets', name_es: 'Chaquetas' }
        ];
    }
    
    renderCategories() {
        const categorySelect = document.getElementById('category');
        if (!categorySelect) return;
        
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
        
        // Re-initialiser Select2 si présent
        if (typeof $ !== 'undefined' && $('#category').data('select2')) {
            $('#category').trigger('change');
        }
    }
    
    initCategoryManagement() {
        // Bouton pour créer une nouvelle catégorie
        const addCategoryBtn = document.getElementById('addCategoryBtn');
        if (addCategoryBtn) {
            addCategoryBtn.addEventListener('click', () => {
                this.showCategoryModal();
            });
        }
    }
    
    showCategoryModal() {
        // Créer une modal pour ajouter une catégorie
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px;">
                <div class="modal-header">
                    <h3>Ajouter une catégorie</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <form id="categoryForm">
                        <div class="form-group">
                            <label>Nom (Français) *</label>
                            <input type="text" id="catNameFr" class="form-control" required>
                        </div>
                        <div class="form-group">
                            <label>Nom (English)</label>
                            <input type="text" id="catNameEn" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Nombre (Español)</label>
                            <input type="text" id="catNameEs" class="form-control">
                        </div>
                        <div class="form-group">
                            <label>Catégorie parente</label>
                            <select id="catParent" class="form-control">
                                <option value="">Aucune (catégorie principale)</option>
                            </select>
                        </div>
                        <div class="form-actions">
                            <button type="button" class="btn btn-outline" id="cancelCategory">Annuler</button>
                            <button type="submit" class="btn btn-primary" id="saveCategory">Enregistrer</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Remplir le select des catégories parentes
        const parentSelect = document.getElementById('catParent');
        this.categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat._id;
            option.textContent = cat.name;
            parentSelect.appendChild(option);
        });
        
        // Événements
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#cancelCategory').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#categoryForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            await this.saveCategory();
            modal.remove();
        });
        
        // Fermer en cliquant en dehors
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
    }
    
    async saveCategory() {
        const name = document.getElementById('catNameFr').value;
        const name_en = document.getElementById('catNameEn').value || name;
        const name_es = document.getElementById('catNameEs').value || name;
        const parent = document.getElementById('catParent').value || null;
        
        try {
            const response = await adminAuth.fetchWithAuth('/categories', {
                method: 'POST',
                body: JSON.stringify({
                    name,
                    name_en,
                    name_es,
                    parent
                })
            });
            
            const data = await response.json();
            
            if (data.success) {
                alert('Catégorie créée avec succès !');
                // Recharger les catégories
                await this.loadCategories();
            } else {
                alert('Erreur: ' + (data.error || 'Impossible de créer la catégorie'));
            }
        } catch (error) {
            console.error('Erreur création catégorie:', error);
            alert('Erreur lors de la création de la catégorie');
        }
    }
}

// Initialiser la gestion des catégories
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('category')) {
        window.adminCategories = new AdminCategories();
    }
});
