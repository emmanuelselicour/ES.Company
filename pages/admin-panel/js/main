document.addEventListener('DOMContentLoaded', function() {
  // Initialiser le chargeur de produits
  const productLoader = window.productLoader;
  
  // Éléments DOM
  const productsGrid = document.getElementById('productsGrid');
  const loadingSpinner = document.getElementById('loadingSpinner');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Variables
  let currentCategory = 'all';
  
  // Charger les produits au démarrage
  loadProducts();
  
  // Gestion des filtres
  filterButtons.forEach(button => {
    button.addEventListener('click', function() {
      const category = this.getAttribute('data-category');
      
      // Mettre à jour le bouton actif
      filterButtons.forEach(btn => btn.classList.remove('active'));
      this.classList.add('active');
      
      // Charger les produits de la catégorie
      currentCategory = category;
      loadProducts(category);
    });
  });
  
  // Fonction pour charger les produits
  async function loadProducts(category = 'all') {
    try {
      // Afficher le spinner
      loadingSpinner.style.display = 'block';
      productsGrid.innerHTML = '';
      
      let products = [];
      
      if (category === 'all') {
        // Charger tous les produits
        products = await productLoader.loadAllProducts({
          status: 'active',
          limit: 12
        });
      } else {
        // Charger par catégorie
        products = await productLoader.loadProductsByCategory(category, 12);
      }
      
      // Afficher les produits
      displayProducts(products);
      
    } catch (error) {
      console.error('Error loading products:', error);
      showError('Impossible de charger les produits. Veuillez réessayer.');
    } finally {
      // Cacher le spinner
      loadingSpinner.style.display = 'none';
    }
  }
  
  // Fonction pour afficher les produits
  function displayProducts(products) {
    if (!products || products.length === 0) {
      productsGrid.innerHTML = `
        <div class="no-products">
          <i class="fas fa-box-open"></i>
          <h3>Aucun produit trouvé</h3>
          <p>Aucun produit disponible dans cette catégorie pour le moment.</p>
        </div>
      `;
      return;
    }
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
      const productHTML = productLoader.generateProductHTML(product);
      const productElement = document.createElement('div');
      productElement.innerHTML = productHTML;
      productsGrid.appendChild(productElement.firstElementChild);
    });
    
    // Ajouter les événements aux boutons
    addProductEvents();
  }
  
  // Ajouter les événements aux produits
  function addProductEvents() {
    const viewButtons = document.querySelectorAll('.view-product');
    
    viewButtons.forEach(button => {
      button.addEventListener('click', function() {
        const productId = this.getAttribute('data-id');
        // Rediriger vers la page produit (à créer)
        window.location.href = `product.html?id=${productId}`;
      });
    });
  }
  
  // Afficher un message d'erreur
  function showError(message) {
    productsGrid.innerHTML = `
      <div class="error-message">
        <i class="fas fa-exclamation-triangle"></i>
        <h3>Erreur de chargement</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="loadProducts()">Réessayer</button>
      </div>
    `;
  }
  
  // Charger les catégories
  loadCategories();
  
  async function loadCategories() {
    try {
      const categoriesGrid = document.getElementById('categoriesGrid');
      if (!categoriesGrid) return;
      
      // Catégories prédéfinies
      const categories = [
        {
          id: 'robes',
          name: 'Robes',
          image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          count: 0
        },
        {
          id: 'pantalons',
          name: 'Pantalons',
          image: 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          count: 0
        },
        {
          id: 'jupes',
          name: 'Jupes',
          image: 'https://images.unsplash.com/photo-1585487000160-6eb9ce6b5a53?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          count: 0
        },
        {
          id: 'chaussures',
          name: 'Chaussures',
          image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          count: 0
        },
        {
          id: 'bijoux',
          name: 'Bijoux',
          image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80',
          count: 0
        }
      ];
      
      // Compter les produits par catégorie
      const allProducts = await productLoader.loadAllProducts({ status: 'active' });
      
      categories.forEach(category => {
        category.count = allProducts.filter(p => p.category === category.id).length;
      });
      
      // Générer le HTML des catégories
      categoriesGrid.innerHTML = categories.map(category => `
        <div class="category-card" data-category="${category.id}">
          <img src="${category.image}" alt="${category.name}" class="category-img">
          <div class="category-info">
            <h3>${category.name}</h3>
            <p>${category.count} produits</p>
            <button class="btn btn-small view-category" data-category="${category.id}">
              Voir les produits
            </button>
          </div>
        </div>
      `).join('');
      
      // Ajouter les événements
      const categoryButtons = document.querySelectorAll('.view-category');
      categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
          const category = this.getAttribute('data-category');
          // Activer le filtre correspondant
          const correspondingFilter = document.querySelector(`.filter-btn[data-category="${category}"]`);
          if (correspondingFilter) {
            correspondingFilter.click();
          }
          // Faire défiler jusqu'aux produits
          document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        });
      });
      
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  }
});
