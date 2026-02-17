// ===== VARIABLES GLOBALES =====
let isFloatingOpen = false;

// Variables para slider de videos
let videoCurrentSlide = 0;
let videoSlideCount = 0;
let videoSliderTrack;
let videoPrevBtn;
let videoNextBtn;
let videoDots = [];

// Variables para slider de residentes
let residentsCurrentSlide = 0;
let residentsSlideCount = 0;
let residentsSliderTrack;
let residentsPrevBtn;
let residentsNextBtn;
let residentsDots = [];
let residentsVisibleSlides = 1;

// ===== INICIALIZACIÓN =====
function init() {
    initMobileMenu();
    initSmoothScrolling();
    initServiceFilter();
    initContactForm();
    initVideoSlider();
    initResidentsSlider();
    initParticles();
    initFloatingWindow();
    initAnimations();
    initScrollEffects();
    initImageSwap();
    
    window.addEventListener('resize', function() {
        updateResidentsVisibleSlides();
        if (typeof updateResidentsSliderPosition === 'function') {
            updateResidentsSliderPosition();
        }
    });
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
    
    // Cerrar menú al hacer clic en un enlace
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
            // Remover active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filtrar tarjetas
            serviceCards.forEach(card => {
                if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                    card.style.display = 'flex';
                    // Animación suave al aparecer
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.display = 'none';
                }
            });
            
            // Reordenar grid si es necesario
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
    
    // Configuración inicial
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
        
        // Resetear opciones
        tipoButtons[0].classList.add('active');
        tipoButtons[1].classList.remove('active');
        if (tipoSolicitudInput) tipoSolicitudInput.value = 'consulta';
        if (parentescoField) parentescoField.classList.remove('visible');
        if (fechaField) fechaField.style.display = 'none';
    });
}

// ===== 6. SLIDER DE VIDEOS =====
function initVideoSlider() {
    videoSliderTrack = document.querySelector('.video-slider-track');
    const slides = document.querySelectorAll('.video-slide');
    videoPrevBtn = document.querySelector('.video-prev');
    videoNextBtn = document.querySelector('.video-next');
    videoDots = document.querySelectorAll('.video-dots .slider-dot');
    
    if (!videoSliderTrack || !slides.length) return;
    
    videoCurrentSlide = 0;
    videoSlideCount = slides.length;
    
    function updateVideoSliderPosition() {
        videoSliderTrack.style.transform = `translateX(-${videoCurrentSlide * 100}%)`;
        
        videoDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === videoCurrentSlide);
        });
        
        if (videoPrevBtn) videoPrevBtn.disabled = videoCurrentSlide === 0;
        if (videoNextBtn) videoNextBtn.disabled = videoCurrentSlide === videoSlideCount - 1;
        
        pauseOtherVideos();
    }
    
    function pauseOtherVideos() {
        slides.forEach((slide, index) => {
            if (index !== videoCurrentSlide) {
                const video = slide.querySelector('.slide-video');
                if (video && !video.paused) {
                    video.pause();
                    const playBtn = slide.querySelector('.slide-video-play-btn');
                    if (playBtn) {
                        playBtn.style.opacity = '1';
                        playBtn.style.visibility = 'visible';
                    }
                }
            }
        });
    }
    
    if (videoNextBtn) {
        videoNextBtn.addEventListener('click', () => {
            if (videoCurrentSlide < videoSlideCount - 1) {
                videoCurrentSlide++;
                updateVideoSliderPosition();
            }
        });
    }
    
    if (videoPrevBtn) {
        videoPrevBtn.addEventListener('click', () => {
            if (videoCurrentSlide > 0) {
                videoCurrentSlide--;
                updateVideoSliderPosition();
            }
        });
    }
    
    videoDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            if (slideIndex !== videoCurrentSlide) {
                videoCurrentSlide = slideIndex;
                updateVideoSliderPosition();
            }
        });
    });
    
    // Configurar botones de play personalizados
    const playButtons = document.querySelectorAll('.slide-video-play-btn');
    const videos = document.querySelectorAll('.slide-video');
    
    playButtons.forEach((btn, index) => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const video = videos[index];
            if (video) {
                if (video.paused) {
                    // Pausar otros videos
                    videos.forEach(v => {
                        if (v !== video && !v.paused) v.pause();
                    });
                    video.play();
                    btn.style.opacity = '0';
                    btn.style.visibility = 'hidden';
                } else {
                    video.pause();
                }
            }
        });
    });
    
    videos.forEach((video, index) => {
        video.addEventListener('play', () => {
            const playBtn = video.closest('.slide-video-wrapper')?.querySelector('.slide-video-play-btn');
            if (playBtn) {
                playBtn.style.opacity = '0';
                playBtn.style.visibility = 'hidden';
            }
        });
        
        video.addEventListener('pause', () => {
            const playBtn = video.closest('.slide-video-wrapper')?.querySelector('.slide-video-play-btn');
            if (playBtn) {
                playBtn.style.opacity = '1';
                playBtn.style.visibility = 'visible';
            }
        });
        
        video.addEventListener('ended', () => {
            const playBtn = video.closest('.slide-video-wrapper')?.querySelector('.slide-video-play-btn');
            if (playBtn) {
                playBtn.style.opacity = '1';
                playBtn.style.visibility = 'visible';
            }
        });
    });
    
    updateVideoSliderPosition();
}

// ===== 7. SLIDER DE RESIDENTES =====
function initResidentsSlider() {
    const residentsSection = document.getElementById('residentes');
    if (!residentsSection) return;
    
    residentsSliderTrack = residentsSection.querySelector('.video-slider-track');
    const slides = residentsSection.querySelectorAll('.video-slide');
    residentsPrevBtn = residentsSection.querySelector('.video-prev');
    residentsNextBtn = residentsSection.querySelector('.video-next');
    residentsDots = residentsSection.querySelectorAll('.video-dots .slider-dot');
    
    if (!residentsSliderTrack || !slides.length) return;
    
    residentsCurrentSlide = 0;
    residentsSlideCount = slides.length;
    
    function updateResidentsSliderPosition() {
        if (!slides.length) return;
        
        residentsSliderTrack.style.transform = `translateX(-${residentsCurrentSlide * 100}%)`;
        
        residentsDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === residentsCurrentSlide);
        });
        
        if (residentsPrevBtn) residentsPrevBtn.disabled = residentsCurrentSlide === 0;
        if (residentsNextBtn) residentsNextBtn.disabled = residentsCurrentSlide === residentsSlideCount - 1;
    }
    
    if (residentsNextBtn) {
        residentsNextBtn.addEventListener('click', () => {
            if (residentsCurrentSlide < residentsSlideCount - 1) {
                residentsCurrentSlide++;
                updateResidentsSliderPosition();
            }
        });
    }
    
    if (residentsPrevBtn) {
        residentsPrevBtn.addEventListener('click', () => {
            if (residentsCurrentSlide > 0) {
                residentsCurrentSlide--;
                updateResidentsSliderPosition();
            }
        });
    }
    
    residentsDots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            if (slideIndex >= 0 && slideIndex < residentsSlideCount) {
                residentsCurrentSlide = slideIndex;
                updateResidentsSliderPosition();
            }
        });
    });
    
    // Guardar función para usarla en resize
    window.updateResidentsSliderPosition = updateResidentsSliderPosition;
    updateResidentsSliderPosition();
}

function updateResidentsVisibleSlides() {
    residentsVisibleSlides = 1;
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
        
        // Activar enlaces del menú según sección visible
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