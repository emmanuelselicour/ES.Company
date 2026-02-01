// CORRECTION : Déclarer API_URL une seule fois
// Supprimez toutes les autres déclarations de API_URL et gardez seulement celle-ci :

// REMPLACEZ TOUTE VOTRE CONFIGURATION ACTUELLE PAR CE CODE :

const API_URL = 'https://votre-api.onrender.com'; // Remplacez par votre URL Render réelle

// Vérifier si nous sommes en développement
const isDevelopment = window.location.hostname === 'localhost' || 
                      window.location.hostname === '127.0.0.1';

// Fonction pour obtenir le token
function getAuthToken() {
  return localStorage.getItem('admin_token') || 
         localStorage.getItem('token') || 
         sessionStorage.getItem('admin_token');
}

// Fonction fetch avec gestion d'erreurs
async function apiFetch(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const token = getAuthToken();
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    },
    credentials: 'omit' // Important pour CORS
  };
  
  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    console.log(`🌐 Fetching: ${url}`);
    const response = await fetch(url, finalOptions);
    
    // Vérifier si la réponse est OK
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`❌ API Error (${endpoint}):`, error.message);
    throw error;
  }
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
      
      // Test CORS d'abord
      try {
        const corsTest = await apiFetch('/api/cors-test');
        console.log('✅ CORS test successful:', corsTest);
      } catch (corsError) {
        console.warn('⚠️ CORS test failed, trying without auth...');
      }
      
      // Charger les produits
      const data = await apiFetch('/api/products?limit=100');
      
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
    // Votre code existant pour afficher les produits
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
          } else if (image.url) {
            // Si c'est une URL, l'envoyer comme texte
            formData.append('imageUrls', image.url);
          }
        });
      }
      
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
          // Note: NE PAS mettre 'Content-Type' pour FormData
          // Le navigateur le définit automatiquement avec le boundary
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
    // Votre code existant pour les événements
  }
}

// Initialiser le gestionnaire de produits
const productManager = new ProductManager();

// Exposer au global pour les boutons HTML
window.productManager = productManager;

// Test de connexion API au chargement
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Tester la connexion API
    const health = await fetch(`${API_URL}/api/health`);
    if (health.ok) {
      const data = await health.json();
      console.log('✅ API Health:', data);
    }
  } catch (error) {
    console.warn('⚠️ Cannot reach API:', error.message);
  }
});
