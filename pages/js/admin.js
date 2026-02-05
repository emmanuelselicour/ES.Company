// Admin Panel JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les composants du panel admin
    initAdminPanel();
    initCharts();
    initDataTables();
    initEventListeners();
});

// Initialiser le panel admin
function initAdminPanel() {
    // Basculer la sidebar sur mobile
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const adminSidebar = document.querySelector('.admin-sidebar');
    
    if (sidebarToggle && adminSidebar) {
        sidebarToggle.addEventListener('click', function() {
            adminSidebar.classList.toggle('active');
        });
    }
    
    // Fermer la sidebar en cliquant à l'extérieur sur mobile
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 992) {
            if (!adminSidebar.contains(e.target) && e.target !== sidebarToggle && !sidebarToggle.contains(e.target)) {
                adminSidebar.classList.remove('active');
            }
        }
    });
    
    // Gérer les notifications
    const notificationsBtn = document.getElementById('notifications-btn');
    const notificationsModal = document.getElementById('notifications-modal');
    
    if (notificationsBtn) {
        notificationsBtn.addEventListener('click', function() {
            if (notificationsModal) {
                notificationsModal.style.display = 'block';
                loadAllNotifications();
            }
        });
    }
    
    // Fermer le modal de notifications
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            notificationsModal.style.display = 'none';
        });
    }
    
    // Fermer le modal en cliquant à l'extérieur
    window.addEventListener('click', function(e) {
        if (e.target === notificationsModal) {
            notificationsModal.style.display = 'none';
        }
    });
}

// Initialiser les graphiques
function initCharts() {
    // Graphique de revenus
    const revenueCtx = document.getElementById('revenueChart');
    if (revenueCtx) {
        const revenueChart = new Chart(revenueCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
                datasets: [{
                    label: 'Revenu (€)',
                    data: [3200, 4200, 5100, 5800, 7200, 8450],
                    borderColor: '#4361ee',
                    backgroundColor: 'rgba(67, 97, 238, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            drawBorder: false
                        },
                        ticks: {
                            callback: function(value) {
                                return '€' + value;
                            }
                        }
                    },
                    x: {
                        grid: {
                            display: false
                        }
                    }
                }
            }
        });
    }
}

// Initialiser les tables de données
function initDataTables() {
    // Initialiser DataTables si jQuery est disponible
    if (typeof $ !== 'undefined' && $.fn.DataTable) {
        $('.data-table').DataTable({
            pageLength: 10,
            lengthMenu: [[5, 10, 25, 50, -1], [5, 10, 25, 50, "Tous"]],
            language: {
                url: '//cdn.datatables.net/plug-ins/1.13.4/i18n/fr-FR.json'
            },
            dom: '<"table-controls"fl>rt<"table-footer"ip>',
            responsive: true
        });
    }
}

// Initialiser les écouteurs d'événements
function initEventListeners() {
    // Recherche dans l'admin
    const adminSearch = document.querySelector('.admin-search input');
    if (adminSearch) {
        adminSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performAdminSearch(this.value);
            }
        });
        
        document.querySelector('.admin-search button').addEventListener('click', function() {
            performAdminSearch(adminSearch.value);
        });
    }
    
    // Gérer les clics sur les cartes de statistiques
    document.querySelectorAll('.stat-card').forEach(card => {
        card.addEventListener('click', function() {
            const statType = this.querySelector('p').textContent.toLowerCase();
            navigateToStatPage(statType);
        });
    });
    
    // Gérer les boutons d'action dans les tables
    document.querySelectorAll('.btn-icon.view').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const orderId = row.querySelector('td:first-child').textContent;
            viewOrderDetails(orderId);
        });
    });
    
    document.querySelectorAll('.btn-icon.edit').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation();
            const row = this.closest('tr');
            const orderId = row.querySelector('td:first-child').textContent;
            editOrder(orderId);
        });
    });
}

// Effectuer une recherche dans l'admin
function performAdminSearch(query) {
    if (!query.trim()) {
        showAdminAlert('Veuillez entrer un terme de recherche', 'warning');
        return;
    }
    
    // Simulation de recherche
    showAdminAlert(`Recherche de "${query}" en cours...`, 'info');
    
    // Dans une vraie application, on ferait une requête AJAX
    setTimeout(() => {
        showAdminAlert(`Aucun résultat trouvé pour "${query}"`, 'warning');
    }, 1000);
}

// Naviguer vers une page de statistiques
function navigateToStatPage(statType) {
    let url = '';
    
    switch(statType) {
        case 'commandes totales':
            url = 'admin-orders.html';
            break;
        case 'revenu total':
            url = 'admin-analytics.html';
            break;
        case 'clients':
            url = 'admin-customers.html';
            break;
        case 'produits':
            url = 'admin-products.html';
            break;
        default:
            return;
    }
    
    window.location.href = url;
}

// Voir les détails d'une commande
function viewOrderDetails(orderId) {
    // Simulation - dans une vraie app, on redirigerait vers la page de détails
    showAdminAlert(`Affichage des détails de la commande ${orderId}`, 'info');
    
    // Ouvrir un modal de détails
    setTimeout(() => {
        const modal = createOrderDetailsModal(orderId);
        document.body.appendChild(modal);
    }, 500);
}

// Éditer une commande
function editOrder(orderId) {
    showAdminAlert(`Édition de la commande ${orderId}`, 'info');
    // Dans une vraie app, on redirigerait vers le formulaire d'édition
    setTimeout(() => {
        window.location.href = `admin-order-edit.html?id=${orderId}`;
    }, 1000);
}

// Créer un modal de détails de commande
function createOrderDetailsModal(orderId) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.style.display = 'block';
    
    modal.innerHTML = `
        <div class="modal-content" style="max-width: 600px;">
            <span class="close-modal">&times;</span>
            <h2>Détails de la commande ${orderId}</h2>
            <div class="order-details">
                <div class="detail-row">
                    <span class="detail-label">Client:</span>
                    <span class="detail-value">Marie Dupont</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Date:</span>
                    <span class="detail-value">12/06/2023</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Statut:</span>
                    <span class="status delivered">Livrée</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Montant total:</span>
                    <span class="detail-value">€149.99</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Adresse de livraison:</span>
                    <span class="detail-value">123 Rue de la Mode, 75001 Paris</span>
                </div>
                
                <h3 style="margin-top: 20px;">Articles commandés</h3>
                <table class="order-items">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>Quantité</th>
                            <th>Prix unitaire</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Robe Élégante</td>
                            <td>1</td>
                            <td>€49.99</td>
                            <td>€49.99</td>
                        </tr>
                        <tr>
                            <td>Collier Argent</td>
                            <td>2</td>
                            <td>€24.99</td>
                            <td>€49.98</td>
                        </tr>
                        <tr>
                            <td>Sac à Main</td>
                            <td>1</td>
                            <td>€45.99</td>
                            <td>€45.99</td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colspan="3" style="text-align: right; font-weight: 600;">Total:</td>
                            <td style="font-weight: 600;">€145.96</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="text-align: right;">Livraison:</td>
                            <td>€4.03</td>
                        </tr>
                        <tr>
                            <td colspan="3" style="text-align: right; font-weight: 600;">Total final:</td>
                            <td style="font-weight: 600;">€149.99</td>
                        </tr>
                    </tfoot>
                </table>
                
                <div class="modal-actions">
                    <button class="btn btn-secondary" onclick="this.closest('.modal').remove()">Fermer</button>
                    <button class="btn btn-primary" onclick="editOrder('${orderId}')">Éditer la commande</button>
                </div>
            </div>
        </div>
    `;
    
    // Fermer le modal
    modal.querySelector('.close-modal').addEventListener('click', function() {
        modal.remove();
    });
    
    // Fermer en cliquant à l'extérieur
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    return modal;
}

// Charger toutes les notifications
function loadAllNotifications() {
    const notificationsList = document.querySelector('.notifications-list');
    if (!notificationsList) return;
    
    // Simulation de chargement de notifications
    const notifications = [
        {
            id: 1,
            type: 'order',
            message: 'Nouvelle commande #ORD-006 reçue',
            time: 'Il y a 10 minutes',
            read: false
        },
        {
            id: 2,
            type: 'customer',
            message: 'Nouveau client inscrit: Thomas Moreau',
            time: 'Il y a 2 heures',
            read: false
        },
        {
            id: 3,
            type: 'product',
            message: 'Stock critique: Chaussures de Ville (2 restants)',
            time: 'Il y a 5 heures',
            read: true
        },
        {
            id: 4,
            type: 'system',
            message: 'Sauvegarde automatique effectuée avec succès',
            time: 'Il y a 1 jour',
            read: true
        },
        {
            id: 5,
            type: 'order',
            message: 'Commande #ORD-005 expédiée',
            time: 'Il y a 2 jours',
            read: true
        }
    ];
    
    notificationsList.innerHTML = '';
    
    notifications.forEach(notification => {
        const notificationItem = document.createElement('div');
        notificationItem.className = `notification-item ${notification.read ? 'read' : 'unread'}`;
        
        let icon = '';
        let iconClass = '';
        
        switch(notification.type) {
            case 'order':
                icon = 'fa-shopping-cart';
                iconClass = 'text-primary';
                break;
            case 'customer':
                icon = 'fa-user';
                iconClass = 'text-success';
                break;
            case 'product':
                icon = 'fa-box';
                iconClass = 'text-warning';
                break;
            case 'system':
                icon = 'fa-cog';
                iconClass = 'text-info';
                break;
        }
        
        notificationItem.innerHTML = `
            <i class="fas ${icon} ${iconClass}"></i>
            <div>
                <p>${notification.message}</p>
                <small>${notification.time}</small>
            </div>
            ${!notification.read ? '<span class="unread-dot"></span>' : ''}
        `;
        
        notificationItem.addEventListener('click', function() {
            markNotificationAsRead(notification.id);
            this.classList.add('read');
            this.querySelector('.unread-dot')?.remove();
        });
        
        notificationsList.appendChild(notificationItem);
    });
}

// Marquer une notification comme lue
function markNotificationAsRead(notificationId) {
    // Simulation - dans une vraie app, on ferait une requête API
    console.log(`Notification ${notificationId} marquée comme lue`);
}

// Afficher une alerte dans l'admin
function showAdminAlert(message, type = 'info') {
    // Supprimer les alertes existantes
    const existingAlerts = document.querySelectorAll('.admin-alert');
    existingAlerts.forEach(alert => alert.remove());
    
    // Créer l'alerte
    const alert = document.createElement('div');
    alert.className = `admin-alert alert-${type}`;
    alert.textContent = message;
    alert.style.cssText = `
        position: fixed;
        top: 90px;
        right: 30px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    // Couleurs selon le type
    const colors = {
        success: '#27ae60',
        error: '#e74c3c',
        warning: '#f39c12',
        info: '#3498db'
    };
    
    alert.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(alert);
    
    // Supprimer après 3 secondes
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 3000);
}

// Ajouter du CSS pour les alertes admin
const adminAlertStyles = document.createElement('style');
adminAlertStyles.textContent = `
    .admin-alert {
        position: fixed;
        top: 90px;
        right: 30px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 2000;
        animation: slideIn 0.3s ease, fadeOut 0.3s ease 2.7s;
        max-width: 400px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    }
    
    .order-details {
        margin-top: 20px;
    }
    
    .detail-row {
        display: flex;
        margin-bottom: 10px;
        padding-bottom: 10px;
        border-bottom: 1px solid #eee;
    }
    
    .detail-label {
        font-weight: 600;
        width: 150px;
        color: #333;
    }
    
    .detail-value {
        flex: 1;
        color: #666;
    }
    
    .order-items {
        width: 100%;
        border-collapse: collapse;
        margin: 20px 0;
    }
    
    .order-items th,
    .order-items td {
        padding: 10px;
        text-align: left;
        border-bottom: 1px solid #eee;
    }
    
    .order-items th {
        background-color: #f8f9fa;
        font-weight: 600;
    }
    
    .modal-actions {
        display: flex;
        justify-content: flex-end;
        gap: 10px;
        margin-top: 20px;
        padding-top: 20px;
        border-top: 1px solid #eee;
    }
    
    .unread-dot {
        width: 10px;
        height: 10px;
        background-color: #e74c3c;
        border-radius: 50%;
        margin-left: 10px;
    }
    
    .notification-item.read {
        opacity: 0.7;
    }
`;
document.head.appendChild(adminAlertStyles);
