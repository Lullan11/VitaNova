// ===== VARIABLES GLOBALES =====
let isFloatingOpen = false;
let currentVideo = null;
let currentSlide = 0;

// ===== FUNCIONES DE INICIALIZACIÓN =====
function init() {
    console.log('VitaNova - Inicializando...');
    
    // Inicializar componentes
    initMobileMenu();
    initSmoothScrolling();
    initServiceFilter();
    initContactForm();
    initVideoPlayers();
    initVideoSlider();
    initParticles();
    initFloatingWindow();
    initAnimations();
    initScrollEffects();
    
    // Ajustar videos verticales
    adjustVerticalVideos();
}

// ===== MENÚ MÓVIL =====
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navItems = document.querySelectorAll('.nav-links a');
    
    if (!menuToggle || !navLinks) return;
    
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');
        
        // Animación del icono hamburguesa
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Cerrar menú al hacer clic en enlace
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (!menuToggle.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.classList.remove('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// ===== SCROLL SUAVE =====
function initSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
            
            // Actualizar enlace activo
            updateActiveNavLink(targetId);
        });
    });
}

function updateActiveNavLink(targetId) {
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === targetId) {
            link.classList.add('active');
        }
    });
}

// ===== FILTRO DE SERVICIOS =====
function initServiceFilter() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    
    if (!filterButtons.length || !serviceCards.length) return;
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            // Filtrar tarjetas
            serviceCards.forEach(card => {
                card.style.opacity = '0.3';
                card.style.transform = 'scale(0.95)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
                        card.style.display = 'flex';
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1)';
                        }, 50);
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });
}

// ===== FORMULARIO DE CONTACTO =====
function initContactForm() {
    const form = document.getElementById('formContacto');
    const tipoButtons = document.querySelectorAll('.opcion-btn');
    const tipoSolicitudInput = document.getElementById('tipoSolicitud');
    const parentescoField = document.getElementById('parentescoField');
    const fechaField = document.getElementById('fechaField');
    
    if (!form) return;
    
    // Manejar botones de tipo de solicitud
    tipoButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover clase active de todos los botones
            tipoButtons.forEach(btn => btn.classList.remove('active'));
            // Agregar clase active al botón clickeado
            button.classList.add('active');
            
            const tipo = button.getAttribute('data-tipo');
            tipoSolicitudInput.value = tipo;
            
            // Mostrar/ocultar campos según el tipo
            if (tipo === 'visita') {
                parentescoField.classList.add('visible');
                fechaField.style.display = 'block';
                setTimeout(() => {
                    parentescoField.style.opacity = '1';
                    parentescoField.style.transform = 'translateY(0)';
                }, 10);
            } else {
                parentescoField.classList.remove('visible');
                fechaField.style.display = 'none';
                parentescoField.style.opacity = '0';
                parentescoField.style.transform = 'translateY(-10px)';
            }
        });
    });
    
    // Manejar envío del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Validación básica
        const nombre = document.getElementById('nombre').value.trim();
        const email = document.getElementById('email').value.trim();
        const telefono = document.getElementById('telefono').value.trim();
        const mensaje = document.getElementById('mensaje').value.trim();
        
        if (!nombre || !email || !telefono || !mensaje) {
            showNotification('Por favor complete todos los campos requeridos', 'error');
            return;
        }
        
        // Validar email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Por favor ingrese un email válido', 'error');
            return;
        }
        
        // Validar teléfono (mínimo 7 dígitos)
        if (telefono.replace(/\D/g, '').length < 7) {
            showNotification('Por favor ingrese un número de teléfono válido', 'error');
            return;
        }
        
        // Mostrar loading
        const submitBtn = form.querySelector('.form-submit');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;
        
        try {
            // Simular envío (reemplazar con tu backend)
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            showNotification('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
            form.reset();
            
            // Resetear campos especiales
            tipoButtons[0].classList.add('active');
            tipoButtons[1].classList.remove('active');
            tipoSolicitudInput.value = 'consulta';
            parentescoField.classList.remove('visible');
            fechaField.style.display = 'none';
            
        } catch (error) {
            showNotification('Error al enviar el mensaje. Por favor intente nuevamente.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
    
    // Validación en tiempo real
    const inputs = form.querySelectorAll('input, textarea');
    inputs.forEach(input => {
        input.addEventListener('blur', () => {
            validateField(input);
        });
        
        input.addEventListener('input', () => {
            clearFieldError(input);
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    
    if (field.required && !value) {
        showFieldError(field, 'Este campo es requerido');
        return false;
    }
    
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Ingrese un email válido');
            return false;
        }
    }
    
    if (field.id === 'telefono' && value) {
        const phoneDigits = value.replace(/\D/g, '');
        if (phoneDigits.length < 7) {
            showFieldError(field, 'Ingrese un número válido (mín. 7 dígitos)');
            return false;
        }
    }
    
    clearFieldError(field);
    return true;
}

function showFieldError(field, message) {
    clearFieldError(field);
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.style.color = '#ff3d6a';
    errorDiv.style.fontSize = '0.8rem';
    errorDiv.style.marginTop = '5px';
    errorDiv.textContent = message;
    
    field.parentNode.appendChild(errorDiv);
    field.style.borderColor = '#ff3d6a';
}

function clearFieldError(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
    field.style.borderColor = '';
}

// ===== SLIDER DE VIDEOS =====
function initVideoSlider() {
    const sliderTrack = document.querySelector('.video-slider-track');
    const slides = document.querySelectorAll('.video-slide');
    const prevBtn = document.querySelector('.slider-prev');
    const nextBtn = document.querySelector('.slider-next');
    const dots = document.querySelectorAll('.slider-dot');
    
    if (!sliderTrack || !slides.length) return;
    
    currentSlide = 0;
    const slideCount = slides.length;
    
    // Actualizar posición del slider
    function updateSliderPosition() {
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        // Actualizar puntos
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Actualizar estado de botones
        if (prevBtn) prevBtn.disabled = currentSlide === 0;
        if (nextBtn) nextBtn.disabled = currentSlide === slideCount - 1;
        
        // Pausar todos los videos excepto el actual
        pauseOtherSliderVideos();
    }
    
    // Pausar otros videos en el slider
    function pauseOtherSliderVideos() {
        slides.forEach((slide, index) => {
            if (index !== currentSlide) {
                const video = slide.querySelector('.slide-video');
                if (video && !video.paused) {
                    video.pause();
                    
                    // Mostrar botón de play
                    const playBtn = slide.querySelector('.slide-video-play-btn');
                    if (playBtn) {
                        playBtn.style.opacity = '1';
                        playBtn.style.visibility = 'visible';
                    }
                }
            }
        });
    }
    
    // Botón siguiente
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            if (currentSlide < slideCount - 1) {
                currentSlide++;
                updateSliderPosition();
            }
        });
    }
    
    // Botón anterior
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (currentSlide > 0) {
                currentSlide--;
                updateSliderPosition();
            }
        });
    }
    
    // Puntos de navegación
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const slideIndex = parseInt(dot.getAttribute('data-slide'));
            if (slideIndex !== currentSlide) {
                currentSlide = slideIndex;
                updateSliderPosition();
            }
        });
    });
    
    // Navegación con teclado
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            if (currentSlide > 0) {
                currentSlide--;
                updateSliderPosition();
            }
        } else if (e.key === 'ArrowRight') {
            if (currentSlide < slideCount - 1) {
                currentSlide++;
                updateSliderPosition();
            }
        }
    });
    
    // Navegación táctil (swipe)
    let touchStartX = 0;
    let touchEndX = 0;
    
    if (sliderTrack) {
        sliderTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        sliderTrack.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }
    
    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0 && currentSlide < slideCount - 1) {
                // Swipe izquierda (siguiente)
                currentSlide++;
            } else if (diff < 0 && currentSlide > 0) {
                // Swipe derecha (anterior)
                currentSlide--;
            }
            updateSliderPosition();
        }
    }
    
    // Configurar controles de video en el slider
    const slideVideos = document.querySelectorAll('.slide-video');
    const slidePlayBtns = document.querySelectorAll('.slide-video-play-btn');
    
    slidePlayBtns.forEach((btn, index) => {
        btn.addEventListener('click', () => {
            const video = slideVideos[index];
            if (video) {
                if (video.paused) {
                    video.play();
                    btn.style.opacity = '0';
                    btn.style.visibility = 'hidden';
                } else {
                    video.pause();
                }
            }
        });
    });
    
    slideVideos.forEach(video => {
        video.addEventListener('play', () => {
            const wrapper = video.closest('.slide-video-wrapper');
            if (wrapper) {
                const playBtn = wrapper.querySelector('.slide-video-play-btn');
                if (playBtn) {
                    playBtn.style.opacity = '0';
                    playBtn.style.visibility = 'hidden';
                }
            }
            
            // Pausar otros videos
            pauseOtherVideos(video);
        });
        
        video.addEventListener('pause', () => {
            const wrapper = video.closest('.slide-video-wrapper');
            if (wrapper) {
                const playBtn = wrapper.querySelector('.slide-video-play-btn');
                if (playBtn) {
                    playBtn.style.opacity = '1';
                    playBtn.style.visibility = 'visible';
                }
            }
        });
    });
    
    // Inicializar posición
    updateSliderPosition();
}

// ===== REPRODUCTORES DE VIDEO =====
function initVideoPlayers() {
    const videoPlayers = document.querySelectorAll('video');
    
    if (!videoPlayers.length) return;
    
    // Configurar videos
    videoPlayers.forEach(video => {
        // Añadir controles si no los tiene
        if (!video.hasAttribute('controls')) {
            video.setAttribute('controls', 'true');
        }
        
        // Pausar otros videos cuando uno se reproduce
        video.addEventListener('play', () => {
            pauseOtherVideos(video);
            currentVideo = video;
        });
        
        // Manejar errores de video
        video.addEventListener('error', () => {
            console.warn('Error al cargar video:', video.src);
        });
    });
}

function pauseOtherVideos(currentVideo) {
    const allVideos = document.querySelectorAll('video');
    allVideos.forEach(video => {
        if (video !== currentVideo && !video.paused) {
            video.pause();
            
            // Mostrar botón de play en el video pausado
            const wrapper = video.closest('.slide-video-wrapper');
            if (wrapper) {
                const playBtn = wrapper.querySelector('.slide-video-play-btn');
                if (playBtn) {
                    playBtn.style.opacity = '1';
                    playBtn.style.visibility = 'visible';
                }
            }
        }
    });
}

// ===== AJUSTAR VIDEOS VERTICALES =====
function adjustVerticalVideos() {
    const videos = document.querySelectorAll('.slide-video');
    
    videos.forEach(video => {
        // Asegurar que los videos verticales se muestren completos
        video.style.objectFit = 'contain';
        video.style.backgroundColor = '#000';
    });
    
    // Revisar periódicamente para videos que se carguen después
    setTimeout(adjustVerticalVideos, 1000);
}

// ===== PARTÍCULAS EN HERO =====
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Tamaño aleatorio
    const size = Math.random() * 20 + 5;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Posición aleatoria
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Color basado en colores primarios
    const colors = ['#3a5bb8', '#6ba43a', '#ff6b8b'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    particle.style.background = color;
    
    // Opacidad aleatoria
    particle.style.opacity = Math.random() * 0.3 + 0.1;
    
    // Animación
    const duration = Math.random() * 20 + 10;
    const delay = Math.random() * 5;
    particle.style.animation = `float ${duration}s infinite linear ${delay}s`;
    
    container.appendChild(particle);
}

// ===== VENTANA FLOTANTE =====
function initFloatingWindow() {
    const floatingToggle = document.getElementById('floatingToggle');
    const floatingWindow = document.getElementById('floatingInfo');
    const closeFloating = document.getElementById('closeFloating');
    
    if (!floatingToggle || !floatingWindow) return;
    
    // Mostrar ventana flotante
    floatingToggle.addEventListener('click', () => {
        if (isFloatingOpen) {
            closeFloatingWindow();
        } else {
            openFloatingWindow();
        }
    });
    
    // Cerrar ventana flotante
    if (closeFloating) {
        closeFloating.addEventListener('click', closeFloatingWindow);
    }
    
    // Cerrar al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (isFloatingOpen && 
            !floatingWindow.contains(e.target) && 
            !floatingToggle.contains(e.target)) {
            closeFloatingWindow();
        }
    });
    
    // Cerrar con Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isFloatingOpen) {
            closeFloatingWindow();
        }
    });
}

function openFloatingWindow() {
    const floatingWindow = document.getElementById('floatingInfo');
    const floatingToggle = document.getElementById('floatingToggle');
    
    floatingWindow.classList.add('active');
    floatingToggle.style.opacity = '0.5';
    isFloatingOpen = true;
    
    // Animación del icono
    const icon = floatingToggle.querySelector('i');
    icon.classList.remove('fa-info-circle');
    icon.classList.add('fa-times');
}

function closeFloatingWindow() {
    const floatingWindow = document.getElementById('floatingInfo');
    const floatingToggle = document.getElementById('floatingToggle');
    
    floatingWindow.classList.remove('active');
    floatingToggle.style.opacity = '1';
    isFloatingOpen = false;
    
    // Animación del icono
    const icon = floatingToggle.querySelector('i');
    icon.classList.remove('fa-times');
    icon.classList.add('fa-info-circle');
}

// ===== ANIMACIONES =====
function initAnimations() {
    // Animación de tarjetas de servicios
    const serviceCards = document.querySelectorAll('.service-card');
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('animate');
                }, index * 100);
            }
        });
    }, observerOptions);
    
    serviceCards.forEach(card => {
        observer.observe(card);
    });
    
    // Animación de stats
    const stats = document.querySelectorAll('.stat-number');
    if (stats.length) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateStats();
                    statsObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        statsObserver.observe(stats[0].parentElement);
    }
}

function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const target = parseInt(stat.textContent);
        let current = 0;
        const increment = target / 30;
        const duration = 1500;
        const stepTime = duration / 30;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            stat.textContent = Math.floor(current) + (stat.textContent.includes('+') ? '+' : '');
        }, stepTime);
    });
}

// ===== EFECTOS DE SCROLL =====
function initScrollEffects() {
    // Header scroll effect
    window.addEventListener('scroll', () => {
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Actualizar enlaces activos basados en scroll
        updateActiveNavOnScroll();
    });
}

function updateActiveNavOnScroll() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const headerHeight = document.querySelector('header').offsetHeight;
        
        if (scrollY >= (sectionTop - headerHeight - 100)) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// ===== NOTIFICACIONES =====
function showNotification(message, type = 'info') {
    // Remover notificación existente
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Crear notificación
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // Estilos de notificación
    notification.style.position = 'fixed';
    notification.style.top = '20px';
    notification.style.right = '20px';
    notification.style.zIndex = '9999';
    notification.style.background = type === 'success' ? '#6ba43a' : '#ff3d6a';
    notification.style.color = 'white';
    notification.style.padding = '15px 20px';
    notification.style.borderRadius = '12px';
    notification.style.boxShadow = '0 5px 15px rgba(0,0,0,0.2)';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '10px';
    notification.style.transform = 'translateX(150%)';
    notification.style.transition = 'transform 0.3s ease';
    
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 10);
    
    // Botón cerrar
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// ===== INICIALIZAR TODO CUANDO EL DOM ESTÉ LISTO =====
document.addEventListener('DOMContentLoaded', init);

// ===== MANEJAR CAMBIOS DE TAMAÑO DE PANTALLA =====
window.addEventListener('resize', () => {
    // Ajustar slider en redimensionamiento
    const sliderTrack = document.querySelector('.video-slider-track');
    if (sliderTrack) {
        sliderTrack.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
});

// ===== MANEJAR VISIBILIDAD DE LA PÁGINA =====
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pausar todos los videos cuando la página no es visible
        const videos = document.querySelectorAll('video');
        videos.forEach(video => {
            if (!video.paused) {
                video.pause();
            }
        });
    }
});

// ===== POLYFILL PARA INTERSECTION OBSERVER =====
if (!('IntersectionObserver' in window)) {
    // Cargar polyfill dinámicamente
    const script = document.createElement('script');
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(script);
    
    // Inicializar animaciones después de cargar polyfill
    script.onload = initAnimations;
}