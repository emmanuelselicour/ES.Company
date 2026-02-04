// Gestion de la page contact

class ContactPage {
    constructor() {
        this.init();
    }
    
    init() {
        // Initialiser le formulaire de contact
        this.initContactForm();
        
        // Initialiser la FAQ
        this.initFAQ();
        
        // Initialiser la carte (si nécessaire)
        this.initMap();
    }
    
    initContactForm() {
        const form = document.getElementById('contactForm');
        if (!form) return;
        
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = document.getElementById('submitBtn');
            const originalText = submitBtn.innerHTML;
            
            // Désactiver le bouton
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi...';
            
            // Récupérer les données du formulaire
            const formData = {
                firstName: document.getElementById('firstName').value,
                lastName: document.getElementById('lastName').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value
            };
            
            // Validation simple
            if (!this.validateForm(formData)) {
                this.showAlert('Veuillez remplir tous les champs obligatoires correctement.', 'error');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                return;
            }
            
            try {
                // Dans une vraie application, vous enverriez les données à votre API
                // Pour l'instant, simulons un envoi réussi
                await this.sendContactForm(formData);
                
                // Afficher un message de succès
                this.showAlert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.', 'success');
                
                // Réinitialiser le formulaire
                form.reset();
                
            } catch (error) {
                console.error('Erreur envoi formulaire:', error);
                this.showAlert('Une erreur est survenue lors de l\'envoi du message. Veuillez réessayer.', 'error');
            } finally {
                // Réactiver le bouton
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    validateForm(data) {
        // Validation basique
        if (!data.firstName || !data.lastName || !data.email || !data.subject || !data.message) {
            return false;
        }
        
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(data.email)) {
            return false;
        }
        
        return true;
    }
    
    async sendContactForm(data) {
        // Simulation d'envoi à l'API
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Dans 90% des cas, simuler un succès
                if (Math.random() < 0.9) {
                    resolve({ success: true });
                } else {
                    reject(new Error('Erreur de réseau simulée'));
                }
            }, 1500);
        });
    }
    
    showAlert(message, type = 'error') {
        const alertContainer = document.getElementById('formAlert');
        if (!alertContainer) return;
        
        const alert = document.createElement('div');
        alert.className = `alert alert-${type}`;
        alert.innerHTML = `
            <i class="fas fa-${type === 'error' ? 'exclamation-triangle' : 'check-circle'}"></i>
            ${message}
        `;
        
        alertContainer.innerHTML = '';
        alertContainer.appendChild(alert);
        
        // Auto-dismiss pour les succès
        if (type === 'success') {
            setTimeout(() => {
                alert.remove();
            }, 5000);
        }
    }
    
    initFAQ() {
        const faqQuestions = document.querySelectorAll('.faq-question');
        
        faqQuestions.forEach(question => {
            question.addEventListener('click', () => {
                const answer = question.nextElementSibling;
                const isActive = answer.classList.contains('active');
                
                // Fermer toutes les autres réponses
                document.querySelectorAll('.faq-answer').forEach(ans => {
                    ans.classList.remove('active');
                });
                
                document.querySelectorAll('.faq-question').forEach(q => {
                    q.classList.remove('active');
                });
                
                // Ouvrir la réponse cliquée si elle était fermée
                if (!isActive) {
                    answer.classList.add('active');
                    question.classList.add('active');
                }
            });
        });
        
        // Ouvrir la première FAQ par défaut
        if (faqQuestions.length > 0) {
            faqQuestions[0].click();
        }
    }
    
    initMap() {
        // Initialisation de la carte Google Maps
        // Dans une vraie application, vous initialiseriez l'API Google Maps ici
        console.log('Carte initialisée');
    }
}

// Initialiser la page contact
document.addEventListener('DOMContentLoaded', () => {
    // Vérifier si nous sommes sur la page contact
    if (window.location.pathname.includes('contact.html') || 
        document.querySelector('.contact-page')) {
        window.contactPage = new ContactPage();
    }
});
