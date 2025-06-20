// VARIABLES GLOBALES
const prices = {
    'menu-classics': 50,
    'menu-decouverte': 68,
    'menu-degustation': 125,
    'menu-enfant': 28,
    'foie-gras': 32,
    'pigeon': 45,
    'turbot': 38,
    'champagne': 35,
    'souffle': 16
};

let quantities = {
    'menu-classics': 0,
    'menu-decouverte': 0,
    'menu-degustation': 0,
    'menu-enfant': 0,
    'foie-gras': 0,
    'pigeon': 0,
    'turbot': 0,
    'champagne': 0,
    'souffle': 0
};

// Variables du carousel
let currentSlide = 0;
let isAutoplay = true;
let autoplayInterval;
let progressInterval;
const totalSlides = 3;
const autoplayDelay = 5000; // 5 secondes

// ===========================================
// MENU MOBILE 
// ===========================================

/*
Toggle du menu mobile
 */
function toggleMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    console.log('toggleMobileMenu appelé, navMenu:', navMenu);
    
    if (navMenu) {
        navMenu.classList.toggle('active');
        console.log('Classes après toggle:', navMenu.className);
    } else {
        console.error('Element navMenu non trouvé');
    }
}

/*
Ferme le menu mobile
 */
function closeMobileMenu() {
    const navMenu = document.getElementById('navMenu');
    if (navMenu && window.innerWidth <= 768) {
        navMenu.classList.remove('active');
    }
}

/*
Initialisation du menu mobile
 */
function initMobileMenu() {
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    const dropdowns = document.querySelectorAll('.dropdown');
    
    console.log('Initialisation menu mobile:', { mobileToggle, navMenu });
    
    // Toggle menu mobile
    if (mobileToggle) {
        mobileToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            toggleMobileMenu();
        });
    } else {
        console.error('Bouton mobile toggle non trouvé');
    }
    
    // Gestion des dropdowns sur mobile
    dropdowns.forEach(dropdown => {
        const link = dropdown.querySelector('a');
        if (link) {
            link.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.classList.toggle('active');
                }
            });
        }
    });
    
    // Fermer le menu quand on clique sur un lien simple
    if (navMenu) {
        navMenu.querySelectorAll('a:not(.dropdown > a)').forEach(link => {
            link.addEventListener('click', function() {
                closeMobileMenu();
            });
        });
    }
    
    // Fermer le menu lors du redimensionnement
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            if (navMenu) navMenu.classList.remove('active');
            dropdowns.forEach(dropdown => {
                dropdown.classList.remove('active');
            });
        }
    });
    
    // Fermer le menu en cliquant en dehors
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && navMenu && navMenu.classList.contains('active')) {
            if (!navMenu.contains(e.target) && !mobileToggle.contains(e.target)) {
                closeMobileMenu();
            }
        }
    });
    
    // Fermer avec la touche Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && window.innerWidth <= 768) {
            closeMobileMenu();
        }
    });
}

// ===========================================
// CAROUSEL 
// ===========================================

/*
Change de slide
 */
function changeSlide(direction) {
    const track = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!track) {
        console.warn('Carousel track non trouvé');
        return;
    }
    
    // Mettre à jour l'index
    currentSlide += direction;
    
    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }
    
    // Appliquer la transformation
    const translateX = -currentSlide * (100 / totalSlides);
    track.style.transform = `translateX(${translateX}%)`;
    
    // Mettre à jour les indicateurs
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
    
    // Redémarrer l'autoplay et la progression
    restartAutoplay();
    resetProgress();
    
    console.log(`Slide changé vers: ${currentSlide + 1}/${totalSlides}`);
}

/*
Va directement à un slide spécifique
 */
function goToSlide(index) {
    const track = document.getElementById('carouselTrack');
    const indicators = document.querySelectorAll('.indicator');
    
    if (!track || index < 0 || index >= totalSlides) return;
    
    currentSlide = index;
    
    const translateX = -currentSlide * (100 / totalSlides);
    track.style.transform = `translateX(${translateX}%)`;
    
    indicators.forEach((indicator, i) => {
        indicator.classList.toggle('active', i === currentSlide);
    });
    
    restartAutoplay();
    resetProgress();
    
    console.log(`Slide direct vers: ${currentSlide + 1}/${totalSlides}`);
}

/*
Démarre l'autoplay
 */
function startAutoplay() {
    if (isAutoplay) {
        autoplayInterval = setInterval(() => {
            changeSlide(1);
        }, autoplayDelay);
        startProgress();
        console.log('Autoplay démarré');
    }
}
/*
Arrête l'autoplay
 */
function stopAutoplay() {
    if (autoplayInterval) {
        clearInterval(autoplayInterval);
        autoplayInterval = null;
    }
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

/*
Redémarre l'autoplay
 */
function restartAutoplay() {
    stopAutoplay();
    startAutoplay();
}

/*
Démarre la barre de progression
 */
function startProgress() {
    const progressBar = document.getElementById('progressBar');
    if (!progressBar) return;
    
    let progress = 0;
    const incrementTime = 50;
    const increment = (incrementTime / autoplayDelay) * 100;
    
    progressInterval = setInterval(() => {
        progress += increment;
        progressBar.style.width = `${Math.min(progress, 100)}%`;
        
        if (progress >= 100) {
            progress = 0;
        }
    }, incrementTime);
}

/*
Remet à zéro la barre de progression
 */
function resetProgress() {
    const progressBar = document.getElementById('progressBar');
    if (progressBar) {
        progressBar.style.width = '0%';
    }
}

/*
Initialise le carousel
 */
function initCarousel() {
    console.log('Initialisation du carousel...');
    
    const track = document.getElementById('carouselTrack');
    const carousel = document.getElementById('carouselContainer');
    
    if (!track || !carousel) {
        console.warn('Éléments carousel non trouvés - carousel non initialisé');
        return false;
    }
    
    // Initialiser la position
    currentSlide = 0;
    track.style.transform = 'translateX(0%)';
    
    // Contrôles tactiles
    initTouchControls();
    
    // Contrôles clavier
    initKeyboardControls();
    
    // Pause au survol
    initHoverControls();
    
    // Démarrer l'autoplay
    startAutoplay();
    
    console.log('✅ Carousel initialisé avec succès');
    return true;
}

/*
Contrôles tactiles
 */
function initTouchControls() {
    let startX = 0;
    let endX = 0;
    const carousel = document.getElementById('carouselContainer');
    
    if (!carousel) return;
    
    carousel.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        handleSwipe();
    }, { passive: true });

    function handleSwipe() {
        const threshold = 50;
        const diff = startX - endX;
        
        if (Math.abs(diff) > threshold) {
            if (diff > 0) {
                changeSlide(1);
            } else {
                changeSlide(-1);
            }
        }
    }
}

/*
Contrôles clavier
 */
function initKeyboardControls() {
    document.addEventListener('keydown', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
            return;
        }
        
        switch(e.key) {
            case 'ArrowLeft':
                e.preventDefault();
                changeSlide(-1);
                break;
            case 'ArrowRight':
                e.preventDefault();
                changeSlide(1);
                break;
            case ' ':
                e.preventDefault();
                isAutoplay = !isAutoplay;
                if (isAutoplay) {
                    startAutoplay();
                } else {
                    stopAutoplay();
                }
                break;
        }
    });
}

/*
Contrôles de survol
 */
function initHoverControls() {
    const carousel = document.getElementById('carouselContainer');
    if (!carousel) return;
    
    carousel.addEventListener('mouseenter', () => {
        stopAutoplay();
    });
    
    carousel.addEventListener('mouseleave', () => {
        if (isAutoplay) {
            startAutoplay();
        }
    });
}

// ===========================================
// CALCULATEUR D'ESTIMATION
// ===========================================

/*
Met à jour la quantité d'un item
 */
function updateQuantity(item, change) {
    if (!quantities.hasOwnProperty(item)) return;
    
    quantities[item] = Math.max(0, quantities[item] + change);
    
    const qtyElement = document.getElementById(item + '-qty');
    if (qtyElement) {
        qtyElement.textContent = quantities[item];
    }
    
    updateTotal();
}

/*
Calcule et affiche le total
 */
function updateTotal() {
    let totalHT = 0;
    
    Object.keys(quantities).forEach(item => {
        if (prices[item]) {
            totalHT += quantities[item] * prices[item];
        }
    });
    
    const tva = totalHT * 0.055;
    const totalTTC = totalHT + tva;
    
    const htElement = document.getElementById('total-ht');
    const tvaElement = document.getElementById('total-tva');
    const ttcElement = document.getElementById('total-ttc');
    
    if (htElement) htElement.textContent = totalHT.toFixed(2) + ' €';
    if (tvaElement) tvaElement.textContent = tva.toFixed(2) + ' €';
    if (ttcElement) ttcElement.textContent = totalTTC.toFixed(2) + ' €';
}

// ===========================================
// GESTION DES FORMULAIRES
// ===========================================

/*
Soumet le formulaire de réservation
 */
function submitReservation(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    // Validation de la date
    const date = formData.get('date');
    const today = new Date();
    const selectedDate = new Date(date);
    
    if (selectedDate <= today) {
        alert('Veuillez sélectionner une date future pour votre réservation.');
        return;
    }
    
    // Vérifier si c'est un dimanche ou lundi
    const dayOfWeek = selectedDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 1) {
        alert('Nous sommes fermés le dimanche et le lundi. Veuillez choisir une autre date.');
        return;
    }
    
    console.log('Données de réservation:', Object.fromEntries(formData));
    showPopup();
    form.reset();
}

/*
Soumet le formulaire de contact
 */
function submitContact(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    
    console.log('Données de contact:', Object.fromEntries(formData));
    alert('Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais (sous 24h ouvrées).');
    form.reset();
}

// ===========================================
// GESTION DU POPUP
// ===========================================

/*
Affiche le popup de confirmation
 */
function showPopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.classList.add('show');
    }
}
/*
Ferme le popup
 */
function closePopup() {
    const popup = document.getElementById('popup');
    if (popup) {
        popup.classList.remove('show');
    }
}

// ===========================================
// NAVIGATION ET SCROLL
// ===========================================

/*
Scroll vers une section spécifique
 */
function scrollToSection(sectionId) {
    setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, 100);
}

/*
Anime les éléments au scroll
 */
function animateOnScroll() {
    const elements = document.querySelectorAll('.card, .team-member, .gallery-item, .calculator, .intro-content, .menu-item, .info-item, .hours-item');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('animate-fade-in');
        }
    });
}

// ===========================================
// UTILITAIRES
// ===========================================

/*
Définit la date minimum
 */
function setMinimumDate() {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateInputs = document.querySelectorAll('input[type="date"]');
    dateInputs.forEach(input => {
        if (input.id === 'date' || input.name === 'date') {
            input.min = tomorrow.toISOString().split('T')[0];
        }
    });
}

/*
Initialise les formulaires
 */
function initFormListeners() {
    const reservationForm = document.getElementById('reservationForm');
    if (reservationForm) {
        reservationForm.addEventListener('submit', submitReservation);
    }
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContact);
    }
}

/*
Initialise les liens de scroll
 */
function initScrollLinks() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    scrollLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href').substring(1);
            if (targetId && document.getElementById(targetId)) {
                e.preventDefault();
                scrollToSection(targetId);
                closeMobileMenu();
            }
        });
    });
}

/*
Debounce pour optimiser les performances
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/*
Gestion de Google Maps
 */
function openGoogleMaps() {
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.addEventListener('click', function() {
            const address = "15 Avenue de la Gastronomie, 59600 Maubeuge, France";
            const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
            window.open(url, '_blank');
        });
    }
}

// ===========================================
// INITIALISATION PRINCIPALE
// ===========================================

/*
Initialise toutes les fonctionnalités
 */
function initializeApp() {
    console.log('🚀 Initialisation de l\'application...');
    
    // Menu mobile (PRIORITÉ)
    initMobileMenu();
    
    // Carousel
    initCarousel();
    
    // Calculateur
    if (typeof updateTotal === 'function') {
        updateTotal();
    }
    
    // Dates minimum
    setMinimumDate();
    
    // Event listeners
    initFormListeners();
    initScrollLinks();
    
    // Google Maps
    openGoogleMaps();
    
    // Animations
    animateOnScroll();
    
    // Popup
    const popup = document.getElementById('popup');
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === this) {
                closePopup();
            }
        });
    }
    
    console.log('✅ Application initialisée avec succès');
}

// ===========================================
// EVENT LISTENERS GLOBAUX
// ===========================================

// Initialisation au chargement du DOM
document.addEventListener('DOMContentLoaded', initializeApp);

// Animation au scroll
window.addEventListener('scroll', debounce(animateOnScroll, 10));

// Nettoyage au déchargement
window.addEventListener('beforeunload', function() {
    stopAutoplay();
});

// Gestion de la visibilité de la page
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoplay();
    } else if (isAutoplay) {
        startAutoplay();
    }
});

console.log('📄 Script chargé - En attente du DOM...');