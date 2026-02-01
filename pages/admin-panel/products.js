// products.js - VERSION CORRIGÉE

// ⚠️ DÉCLARER API_URL UNE SEULE FOIS ICI ⚠️
const API_URL = 'https://votre-api.onrender.com'; // Remplacez par VOTRE URL

// Fonction pour obtenir le token
function getAuthToken() {
  return localStorage.getItem('admin_token') || 
         localStorage.getItem('token') || 
         sessionStorage.getItem('admin_token');
}

// Gestion des produits
class ProductManager {
  constructor() {
    this.products = [];
    this.currentProductId = null;
    this.init();
  }

  async init() {
    try {
      await this.loadProducts();
      this.initEvents();
    } catch (error) {
      console.error('❌ Initialization error:', error);
      this.loadLocalProducts();
    }
  }

  async loadProducts() {
    try {
      console.log('🔄 Loading products from API...');
      
      const response = await fetch(`${API_URL}/api/products?limit=100`, {
        headers: {
          'Content-Type': 'application/json',
          ...(getAuthToken() && { 'Authorization': `Bearer ${getAuthToken()}` })
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.status === 'success') {
        this.products = data.data.products || [];
        console.log(`✅ Loaded ${this.products.length} products from API`);
        
        // Sauvegarder localement pour backup
        localStorage.setItem('escompany_products_backup', JSON.stringify(this.products));
        
        // Mettre à jour l'affichage
        this.updateProductsDisplay();
      } else {
        throw new Error(data.message || 'API returned error');
      }
    } catch (error) {
      console.error('❌ Error loading products from API:', error);
      console.log('🔄 Falling back to local data...');
      this.loadLocalProducts();
    }
  }

  loadLocalProducts() {
    const storedProducts = localStorage.getItem('escompany_products');
    const backupProducts = localStorage.getItem('escompany_products_backup');
    
    if (storedProducts) {
      this.products = JSON.parse(storedProducts);
      console.log(`📁 Loaded ${this.products.length} products from local storage`);
    } else if (backupProducts) {
      this.products = JSON.parse(backupProducts);
      console.log(`📁 Loaded ${this.products.length} products from backup`);
    } else {
      this.products = [
        {
          id: 1,
          name: "Robe d'été fleurie",
          description: "Robe légère et confortable pour l'été",
          price: 2500,
          category: "robes",
          stock: 15,
          status: "active",
          images: [{
            url: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
            alt: "Robe d'été fleurie"
          }]
        }
      ];
      console.log('📁 Using default products');
    }
    
    this.updateProductsDisplay();
  }

  updateProductsDisplay() {
    const tbody = document.getElementById('productsTable');
    if (!tbody) return;
    
    tbody.innerHTML = this.products.map(product => `
      <tr>
        <td>
          <img src="${product.images?.[0]?.url || 'https://via.placeholder.com/60x60?text=No+Image'}" 
               alt="${product.name}" 
               class="product-image">
        </td>
        <td>${product.name}</td>
        <td>${product.category}</td>
        <td>${this.formatPrice(product.price)}</td>
        <td>${product.stock}</td>
        <td><span class="status ${product.status}">${product.status === 'active' ? 'Actif' : 'Inactif'}</span></td>
        <td>${new Date(product.createdAt).toLocaleDateString()}</td>
        <td class="actions">
          <a href="edit-product.html?id=${product.id}" class="btn btn-small" title="Modifier">
            <i class="fas fa-edit"></i>
          </a>
          <button onclick="productManager.deleteProduct(${product.id})" class="btn btn-small delete-btn" title="Supprimer">
            <i class="fas fa-trash"></i>
          </button>
        </td>
      </tr>
    `).join('');
    
    document.getElementById('productCount').textContent = this.products.length;
  }

  async addProduct(productData) {
    try {
      console.log('📦 Adding product to API...', productData);
      
      const formData = new FormData();
      
      // Ajouter les champs texte
      Object.keys(productData).forEach(key => {
        if (key !== 'images') {
          formData.append(key, productData[key]);
        }
      });
      
      // Ajouter les images
      if (productData.images && productData.images.length > 0) {
        productData.images.forEach((image, index) => {
          if (image.file) {
            formData.append('images', image.file);
          }
        });
      }
      
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'success') {
        console.log('✅ Product added successfully:', result.data.product);
        alert('✅ Produit ajouté avec succès!');
        
        // Recharger la liste des produits
        await this.loadProducts();
        
        // Rediriger vers la liste des produits
        window.location.href = 'products.html';
        
        return result.data.product;
      } else {
        throw new Error(result.message || 'Error adding product');
      }
    } catch (error) {
      console.error('❌ Error adding product:', error);
      alert(`❌ Erreur lors de l'ajout du produit: ${error.message}`);
      throw error;
    }
  }

  formatPrice(price) {
    return new Intl.NumberFormat('fr-HT', {
      style: 'currency',
      currency: 'HTG'
    }).format(price);
  }

  initEvents() {
    // Initialiser les filtres
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    
    if (applyFilters) {
      applyFilters.addEventListener('click', () => {
        this.applyFilters();
      });
    }
    
    if (resetFilters) {
      resetFilters.addEventListener('click', () => {
        this.resetFilters();
      });
    }
  }

  applyFilters() {
    // Votre logique de filtrage
    console.log('Applying filters...');
  }

  resetFilters() {
    // Votre logique de réinitialisation
    console.log('Resetting filters...');
  }
}

// ⚠️ INITIALISER UNE SEULE FOIS ⚠️
const productManager = new ProductManager();

// Exposer au global pour les boutons HTML
window.productManager = productManager;
