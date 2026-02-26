// ===== VARIABLES GLOBALES =====
let isFloatingOpen = false;

// ===== INICIALIZACIÓN =====
function init() {
    initMobileMenu();
    initSmoothScrolling();
    initServiceFilter();
    initContactForm(); // Esta es la función actualizada para WhatsApp con corazones verdes
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

// ===== 5. FORMULARIO DE CONTACTO CON WHATSAPP (ACTUALIZADO - CORAZONES VERDES Y FECHA CORREGIDA) =====
function initContactForm() {
    const form = document.getElementById('formContacto');
    const tipoButtons = document.querySelectorAll('.opcion-btn');
    const tipoSolicitudInput = document.getElementById('tipoSolicitud');
    const parentescoField = document.getElementById('parentescoField');
    const fechaField = document.getElementById('fechaField');

    if (!form) return;

    // Tu número de WhatsApp (formato internacional, sin espacios ni símbolos)
    const WHATSAPP_NUMBER = '573222044690'; // Este es tu número existente

    // Ocultar campos de visita inicialmente
    if (fechaField) fechaField.style.display = 'none';
    if (parentescoField) parentescoField.classList.remove('visible');

    // Manejar los botones de tipo de solicitud
    tipoButtons.forEach(button => {
        button.addEventListener('click', () => {
            tipoButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const tipo = button.getAttribute('data-tipo');
            if (tipoSolicitudInput) tipoSolicitudInput.value = tipo;

            // Mostrar/ocultar campos según el tipo
            if (tipo === 'visita') {
                if (parentescoField) parentescoField.classList.add('visible');
                if (fechaField) fechaField.style.display = 'block';
            } else {
                if (parentescoField) parentescoField.classList.remove('visible');
                if (fechaField) fechaField.style.display = 'none';
            }
        });
    });

    // Manejar el envío del formulario
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Obtener todos los valores del formulario
        const nombre = document.getElementById('nombre')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const telefono = document.getElementById('telefono')?.value.trim();
        const mensaje = document.getElementById('mensaje')?.value.trim();
        const tipoSolicitud = document.getElementById('tipoSolicitud')?.value;
        const servicio = document.getElementById('servicio')?.value;
        const parentesco = document.getElementById('parentesco')?.value.trim();
        const fechaPreferida = document.getElementById('fechaPreferida')?.value;

        // Validar campos requeridos
        if (!nombre || !email || !telefono || !mensaje) {
            showNotification('Por favor completa todos los campos requeridos', 'error');
            return;
        }

        // Validar email (formato básico)
        if (!isValidEmail(email)) {
            showNotification('Por favor ingresa un email válido', 'error');
            return;
        }

        // Validar teléfono (mínimo 7 dígitos)
        if (telefono.replace(/\D/g, '').length < 7) {
            showNotification('Por favor ingresa un teléfono válido', 'error');
            return;
        }

        // Construir el mensaje para WhatsApp (CON CORAZONES VERDES)
        let whatsappMessage = `💚 *Nueva Solicitud desde VitaNova* 💚%0A%0A`;
        
        // Tipo de solicitud
        whatsappMessage += `💚 *Tipo de solicitud:* ${tipoSolicitud === 'visita' ? '📅 Agendar Visita' : '❓ Consulta de Información'}%0A`;
        whatsappMessage += `%0A`;
        
        // Datos de contacto
        whatsappMessage += `💚 *📋 DATOS DE CONTACTO*%0A`;
        whatsappMessage += `💚 *Nombre:* ${nombre}%0A`;
        whatsappMessage += `💚 *Email:* ${email}%0A`;
        whatsappMessage += `💚 *Teléfono:* ${telefono}%0A`;
        whatsappMessage += `%0A`;
        
        // Servicio de interés (si seleccionó uno)
        if (servicio) {
            const servicioTexto = {
                'hospedaje': 'Hospedaje Permanente',
                'guarderia': 'Guardería por Días',
                'alimentacion': 'Alimentación Balanceada',
                'enfermeria': 'Enfermería 24 Horas',
                'ame': 'AME (Urgencias Domiciliarias)',
                'cuidado-personal': 'Cuidado Personal Integral'
            }[servicio] || servicio;
            
            whatsappMessage += `💚 *🔹 Servicio de interés:* ${servicioTexto}%0A`;
            whatsappMessage += `%0A`;
        }
        
        // Datos específicos para visitas (CON FECHA CORREGIDA)
        if (tipoSolicitud === 'visita') {
            whatsappMessage += `💚 *📅 INFORMACIÓN DE VISITA*%0A`;
            if (parentesco) whatsappMessage += `💚 *Parentesco:* ${parentesco}%0A`;
            if (fechaPreferida) {
                // CORREGIDO: Formatear la fecha EXACTAMENTE como el usuario la seleccionó
                // Dividimos la fecha en año, mes, día
                const partesFecha = fechaPreferida.split('-');
                const año = partesFecha[0];
                const mes = partesFecha[1];
                const dia = partesFecha[2];
                
                // Mostramos la fecha en formato DD/MM/YYYY (DÍA/MES/AÑO) para que sea claro
                whatsappMessage += `💚 *Fecha preferida:* ${dia}/${mes}/${año}%0A`;
            }
            whatsappMessage += `%0A`;
        }
        
        // Mensaje
        whatsappMessage += `💚 *💬 MENSAJE:*%0A`;
        whatsappMessage += `${mensaje}%0A`;
        whatsappMessage += `%0A`;
        whatsappMessage += `---%0A`;
        whatsappMessage += `💚 *Enviado desde el formulario web de VitaNova* 💚`;

        // Crear el enlace de WhatsApp
        const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`;

        // Mostrar notificación de éxito
        showNotification('💚 Redirigiendo a WhatsApp para enviar el mensaje...', 'success');
        
        // Pequeño delay para que el usuario vea la notificación
        setTimeout(() => {
            // Abrir WhatsApp en una nueva pestaña
            window.open(whatsappUrl, '_blank');
        }, 1500);

        // Resetear el formulario después de enviar
        setTimeout(() => {
            form.reset();
            
            // Resetear los botones de tipo
            tipoButtons.forEach(btn => {
                btn.classList.remove('active');
                if (btn.getAttribute('data-tipo') === 'consulta') {
                    btn.classList.add('active');
                }
            });
            
            // Resetear campos
            if (tipoSolicitudInput) tipoSolicitudInput.value = 'consulta';
            if (parentescoField) parentescoField.classList.remove('visible');
            if (fechaField) fechaField.style.display = 'none';
            
            // Limpiar el campo de parentesco
            const parentescoInput = document.getElementById('parentesco');
            if (parentescoInput) parentescoInput.value = '';
            
        }, 2000);
    });
}

// Función auxiliar para validar email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== 6. NUEVO CARRUSEL DE RESIDENTES =====
function initResidentCarousel() {
    const residents = [
        {
            src: "img/vicky.jpeg",
            title: "Vicky",
            description: "",
            orientation: "vertical"
        },
        {
            src: "img/blanca.jpeg",
            title: "Blanca",
            description: ""
        },
        {
            src: "img/cecilia.jpeg",
            title: "Cecilia",
            description: ""
        },
        {
            src: "img/elvirita.jpeg",
            title: "Elvirita",
            description: ""
        },
        {
            src: "img/eufemia.jpeg",
            title: "Eufemia",
            description: ""
        },
        {
            src: "img/gladys.jpeg",
            title: "Gladys",
            description: ""
        },
        {
            src: "img/zoilita.jpeg",
            title: "Zoilita",
            description: ""
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
            src: "img/instalaciones.mp4",
            title: "Tour Virtual",
            description: "Recorrido por nuestras instalaciones.",
            orientation: "horizontal"
        },
        {
            src: "img/unidos.mp4",
            title: "Un poco mas de nosotros",
            description: "Te esperamos.",
            orientation: "horizontal"
        },
        {
            src: "img/amoryamistad.mp4",
            title: "Amor y Amistad",
            description: "En vitaNova.",
            orientation: "horizontal"
        },
        {
            src: "img/como-llegar.mp4",
            title: "Como llegar",
            description: "Ven a visitarnos.",
            orientation: "horizontal"
        },
        {
            src: "img/diaMujer.mp4",
            title: "El dia de la Mujer",
            description: "Queremos ver nuestras Mujeres felices.",
            orientation: "horizontal"
        },
        {
            src: "img/felices.mp4",
            title: "Momentos Felices",
            description: "La alegría de nuestros residentes.",
            orientation: "horizontal"
        },
        {
            src: "img/fisioterapia.mp4",
            title: "Fisioterapia",
            description: "Un poco de nuestros servicios.",
            orientation: "horizontal"
        },
        {
            src: "img/navidad.mp4",
            title: "Nuestra Navidad",
            description: "Sintiendo el espiritu navideño.",
            orientation: "horizontal"
        },
        {
            src: "img/nosotros.mp4",
            title: "Guardería",
            description: "Haz parte de nosotros.",
            orientation: "horizontal"
        },
        {
            src: "img/vitanova.mp4",
            title: "Apoyo para todos",
            description: "Te queremos.",
            orientation: "horizontal"
        },
        {
            src: "img/visitanos-experiencia.mp4",
            title: "Te estamos esperandoo",
            description: "Ven a compartir.",
            orientation: "horizontal"
        },
        {
            src: "img/videomusical.mp4",
            title: "Video Musical",
            description: "Disfruta.",
            orientation: "horizontal"
        },

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

    // Estilos para la notificación
    notification.style.position = 'fixed';
    notification.style.bottom = '30px';
    notification.style.right = '30px';
    notification.style.backgroundColor = type === 'success' ? '#4CAF50' : '#f44336';
    notification.style.color = 'white';
    notification.style.padding = '15px 25px';
    notification.style.borderRadius = '50px';
    notification.style.boxShadow = '0 5px 25px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.style.display = 'flex';
    notification.style.alignItems = 'center';
    notification.style.gap = '15px';
    notification.style.transform = 'translateX(150%)';
    notification.style.transition = 'transform 0.3s ease';
    notification.style.fontFamily = "'Poppins', sans-serif";
    notification.style.fontSize = '14px';
    notification.style.fontWeight = '500';

    const content = notification.querySelector('.notification-content');
    content.style.display = 'flex';
    content.style.alignItems = 'center';
    content.style.gap = '10px';

    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '16px';
    closeBtn.style.opacity = '0.8';
    closeBtn.style.padding = '0 5px';

    closeBtn.addEventListener('mouseenter', () => {
        closeBtn.style.opacity = '1';
    });

    closeBtn.addEventListener('mouseleave', () => {
        closeBtn.style.opacity = '0.8';
    });

    document.body.appendChild(notification);

    // Animar entrada
    setTimeout(() => { notification.style.transform = 'translateX(0)'; }, 10);

    // Cerrar al hacer click
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto-cerrar después de 4 segundos
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(150%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 4000);
}

// ===== INICIAR TODO =====
document.addEventListener('DOMContentLoaded', init);