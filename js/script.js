// ===== VARIABLES GLOBALES =====
let isFloatingOpen = false;

// ===== INICIALIZACIÓN =====
function init() {
    initMobileMenu();
    initSmoothScrolling();
    initServiceFilter();
    initContactForm();
    initParticles();
    initFloatingWindow();
    initAnimations();
    initScrollEffects();
    initImageSwap();
    initResidentCarousel();
    initVideoCarousel();
}

// ===== 1. INTERCAMBIAR IMÁGENES =====
function initImageSwap() {
    const mainImage = document.getElementById('mainImage');
    const secondaryImage = document.getElementById('secondaryImage');
    const visualContainer = document.querySelector('.about-visual');
    
    if (!mainImage || !secondaryImage || !visualContainer) return;
    
    visualContainer.addEventListener('click', () => {
        const tempSrc = mainImage.src;
        mainImage.src = secondaryImage.src;
        secondaryImage.src = tempSrc;
    });
    
    visualContainer.style.cursor = 'pointer';
}

// ===== 2. MENÚ MÓVIL =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    document.querySelectorAll('.nav-links a').forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
}

// ===== 3. SCROLL SUAVE =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (!targetElement) return;
            
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = targetElement.offsetTop - headerHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        });
    });
}

// ===== 4. FILTRO DE SERVICIOS =====
function initServiceFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const servicesGrid = document.getElementById('servicesGrid');
    
    if (!filterButtons.length || !serviceCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            serviceCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
            
            if (servicesGrid) {
                servicesGrid.style.display = 'grid';
            }
        });
    });
}

// ===== 5. FORMULARIO DE CONTACTO =====
function initContactForm() {
    const form = document.getElementById('formContacto');
    const tipoButtons = document.querySelectorAll('.opcion-btn');
    const tipoSolicitudInput = document.getElementById('tipoSolicitud');
    const parentescoField = document.getElementById('parentescoField');
    const fechaField = document.getElementById('fechaField');
    
    if (!form) return;
    
    if (fechaField) fechaField.style.display = 'none';
    if (parentescoField) parentescoField.classList.remove('visible');
    
    tipoButtons.forEach(button => {
        button.addEventListener('click', () => {
            tipoButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const tipo = button.getAttribute('data-tipo');
            if (tipoSolicitudInput) tipoSolicitudInput.value = tipo;
            
            if (tipo === 'visita') {
                if (parentescoField) parentescoField.classList.add('visible');
                if (fechaField) fechaField.style.display = 'block';
            } else {
                if (parentescoField) parentescoField.classList.remove('visible');
                if (fechaField) fechaField.style.display = 'none';
            }
        });
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const telefono = document.getElementById('telefono')?.value.trim();
        const mensaje = document.getElementById('mensaje')?.value.trim();
        
        if (!nombre || !email || !telefono || !mensaje) {
            showNotification('Complete todos los campos requeridos', 'error');
            return;
        }
        
        showNotification('¡Mensaje enviado correctamente!', 'success');
        form.reset();
        
        tipoButtons[0].classList.add('active');
        tipoButtons[1].classList.remove('active');
        if (tipoSolicitudInput) tipoSolicitudInput.value = 'consulta';
        if (parentescoField) parentescoField.classList.remove('visible');
        if (fechaField) fechaField.style.display = 'none';
    });
}

// ===== 6. NUEVO CARRUSEL DE RESIDENTES =====
function initResidentCarousel() {
    const residents = [
        {
            src: "img/residente1.jpg",
            title: "Doña María",
            description: "Aquí encontré una nueva familia. Me encantan las tardes de manualidades."
        },
        {
            src: "img/residente2.jpg",
            title: "Don José",
            description: "El jardín es mi lugar favorito. Todos los días juego dominó con mis amigos."
        },
        {
            src: "img/residente3.jpg",
            title: "Señora Elena",
            description: "La atención es excelente, me siento cuidada y respetada siempre."
        },
        {
            src: "img/residente4.jpg",
            title: "Don Luis",
            description: "Me encanta la música y aquí siempre tenemos actividades para compartir."
        }
    ];

    let currentIndex = 0;
    const photoImg = document.getElementById('residentPhoto');
    const photoTitle = document.getElementById('residentTitle');
    const photoDescription = document.getElementById('residentDescription');
    const photoCounter = document.getElementById('residentCounter');
    const prevBtn = document.getElementById('prevResidentBtn');
    const nextBtn = document.getElementById('nextResidentBtn');

    if (!photoImg) return;

    function loadResident(index) {
        if (index < 0 || index >= residents.length) return;
        
        currentIndex = index;
        const resident = residents[currentIndex];
        
        photoImg.src = resident.src;
        photoTitle.textContent = resident.title;
        photoDescription.textContent = resident.description;
        photoCounter.textContent = `${currentIndex + 1} / ${residents.length}`;
        
        updateButtons();
    }

    function updateButtons() {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === residents.length - 1;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                loadResident(currentIndex - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < residents.length - 1) {
                loadResident(currentIndex + 1);
            }
        });
    }

    loadResident(0);
}

// ===== 7. NUEVO CARRUSEL DE VIDEOS =====
function initVideoCarousel() {
    const videos = [
        {
            src: "img/amoryamistad.mp4",
            title: "Un Día Típico",
            description: "Conoce cómo transcurre un día completo en VitaNova.",
            orientation: "horizontal"
        },
        {
            src: "img/como-llegar.mp4",
            title: "Actividades Recreativas",
            description: "Sesiones de terapia ocupacional y actividades grupales.",
            orientation: "horizontal"
        },
        {
            src: "videos/testimonios-familias.mp4",
            title: "Testimonios de Familias",
            description: "Las familias comparten sus experiencias.",
            orientation: "horizontal"
        },
        {
            src: "videos/instalaciones.mp4",
            title: "Tour Virtual",
            description: "Recorrido por nuestras instalaciones.",
            orientation: "horizontal"
        },
        {
            src: "img/felices.mp4",
            title: "Momentos Felices",
            description: "La alegría de nuestros residentes.",
            orientation: "vertical"
        }
    ];

    let currentIndex = 0;
    const mainVideo = document.getElementById('mainVideo');
    const videoTitle = document.getElementById('videoTitle');
    const videoDescription = document.getElementById('videoDescription');
    const videoCounter = document.getElementById('videoCounter');
    const orientationBadge = document.getElementById('orientationBadge');
    const prevBtn = document.getElementById('prevVideoBtn');
    const nextBtn = document.getElementById('nextVideoBtn');

    if (!mainVideo) return;

    function adjustOrientation(orientation) {
        if (orientation === 'vertical') {
            mainVideo.style.aspectRatio = '9/16';
            if (orientationBadge) {
                orientationBadge.textContent = '📱 Vertical';
                orientationBadge.style.backgroundColor = 'rgba(255, 215, 0, 0.9)';
                orientationBadge.style.color = '#1a2a3a';
            }
        } else {
            mainVideo.style.aspectRatio = '16/9';
            if (orientationBadge) {
                orientationBadge.textContent = '🖥️ Horizontal';
                orientationBadge.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
                orientationBadge.style.color = '#1a2a3a';
            }
        }
    }

    function loadVideo(index) {
        if (index < 0 || index >= videos.length) return;
        
        currentIndex = index;
        const video = videos[currentIndex];
        
        mainVideo.pause();
        mainVideo.src = video.src;
        videoTitle.textContent = video.title;
        videoDescription.textContent = video.description;
        videoCounter.textContent = `${currentIndex + 1} / ${videos.length}`;
        
        adjustOrientation(video.orientation);
        
        mainVideo.load();
        mainVideo.play().catch(e => console.log("Reproducción automática no permitida"));
        
        updateButtons();
    }

    function updateButtons() {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex === videos.length - 1;
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentIndex > 0) {
                loadVideo(currentIndex - 1);
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentIndex < videos.length - 1) {
                loadVideo(currentIndex + 1);
            }
        });
    }

    loadVideo(0);
}

// ===== 8. PARTÍCULAS =====
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        const size = Math.random() * 8 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.background = '#6ba43a';
        particle.style.opacity = Math.random() * 0.15 + 0.05;
        particle.style.animationDuration = `${Math.random() * 8 + 8}s`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
    }
}

// ===== 9. VENTANA FLOTANTE =====
function initFloatingWindow() {
    const floatingToggle = document.getElementById('floatingToggle');
    const floatingWindow = document.getElementById('floatingInfo');
    const closeFloating = document.getElementById('closeFloating');
    
    if (!floatingToggle || !floatingWindow) return;
    
    floatingToggle.addEventListener('click', toggleFloatingWindow);
    
    if (closeFloating) {
        closeFloating.addEventListener('click', closeFloatingWindow);
    }
    
    document.addEventListener('click', (e) => {
        if (isFloatingOpen && 
            !floatingWindow.contains(e.target) && 
            !floatingToggle.contains(e.target)) {
            closeFloatingWindow();
        }
    });
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFloatingOpen) {
            closeFloatingWindow();
        }
    });
}

function toggleFloatingWindow() {
    if (isFloatingOpen) {
        closeFloatingWindow();
    } else {
        openFloatingWindow();
    }
}

function openFloatingWindow() {
    const floatingWindow = document.getElementById('floatingInfo');
    const floatingToggle = document.getElementById('floatingToggle');
    
    floatingWindow.classList.add('active');
    isFloatingOpen = true;
    
    const icon = floatingToggle.querySelector('i');
    icon.classList.remove('fa-info-circle');
    icon.classList.add('fa-times');
}

function closeFloatingWindow() {
    const floatingWindow = document.getElementById('floatingInfo');
    const floatingToggle = document.getElementById('floatingToggle');
    
    floatingWindow.classList.remove('active');
    isFloatingOpen = false;
    
    const icon = floatingToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-info-circle');
}

// ===== 10. ANIMACIONES =====
function initAnimations() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 80);
            }
        });
    }, { threshold: 0.1 });
    
    serviceCards.forEach(card => observer.observe(card));
}

// ===== 11. EFECTOS DE SCROLL =====
function initScrollEffects() {
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        const sections = document.querySelectorAll('section[id]');
        const scrollPosition = window.scrollY + 120;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-links a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===== 12. NOTIFICACIONES =====
function showNotification(message, type = 'success') {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 10);
    
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 300);
    });
    
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// ===== INICIAR TODO =====
document.addEventListener('DOMContentLoaded', init);