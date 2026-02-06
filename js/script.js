document.addEventListener('DOMContentLoaded', function () {
    // Elementos del DOM
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.nav-links');
    const contactForm = document.getElementById('formContacto');
    const sections = document.querySelectorAll('section');

    // Efecto de header al hacer scroll
    window.addEventListener('scroll', function () {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Cambiar enlace activo según scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Menú móvil
    menuToggle.addEventListener('click', function () {
        mobileMenu.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-bars');
        this.querySelector('i').classList.toggle('fa-times');
    });

    // Cerrar menú al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('active');
            menuToggle.querySelector('i').classList.remove('fa-times');
            menuToggle.querySelector('i').classList.add('fa-bars');
        });
    });

    // Funcionalidad para opciones de tipo de solicitud
    const opcionBtns = document.querySelectorAll('.opcion-btn');
    const parentescoField = document.getElementById('parentescoField');
    const fechaField = document.getElementById('fechaField');
    const tipoSolicitudInput = document.getElementById('tipoSolicitud');
    const parentescoInput = document.getElementById('parentesco');
    const servicioField = document.getElementById('servicio').parentElement;

    opcionBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Remover clase active de todos los botones
            opcionBtns.forEach(b => {
                b.classList.remove('active');
                b.classList.remove('green');
            });

            // Agregar clase active al botón clickeado
            this.classList.add('active');
            const tipo = this.getAttribute('data-tipo');

            // Cambiar color según tipo
            if (tipo === 'visita') {
                this.classList.add('green');
            }

            // Actualizar campo oculto
            tipoSolicitudInput.value = tipo;

            // Mostrar u ocultar campo de parentesco
            if (tipo === 'visita') {
                parentescoField.classList.add('visible');
                parentescoInput.required = true;
                fechaField.style.display = 'block';
                // AGREGA ESTA LÍNEA para ocultar el campo de servicio:
                servicioField.style.display = 'none';
            } else {
                parentescoField.classList.remove('visible');
                parentescoInput.required = false;
                fechaField.style.display = 'none';
                // AGREGA ESTA LÍNEA para mostrar el campo de servicio:
                servicioField.style.display = 'block';
            }
        });
    });

    // Formulario de contacto
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Obtener tipo de solicitud
        const tipoSolicitud = tipoSolicitudInput.value;

        // Validación simple
        const nombre = document.getElementById('nombre').value;
        const email = document.getElementById('email').value;
        const telefono = document.getElementById('telefono').value;
        const mensaje = document.getElementById('mensaje').value;

        if (!nombre || !email || !telefono || !mensaje) {
            alert('Por favor, completa todos los campos obligatorios (*)');
            return;
        }

        // Validación adicional para visitas
        if (tipoSolicitud === 'visita') {
            const parentesco = parentescoInput.value;
            if (!parentesco) {
                alert('Para agendar una visita, por favor indica tu parentesco con el adulto mayor.');
                return;
            }
        }

        // Simular envío
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.innerHTML;

        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            if (tipoSolicitud === 'visita') {
                alert('¡Gracias por solicitar una visita! Nos pondremos en contacto contigo en un plazo máximo de 24 horas para confirmar la fecha y hora de tu visita a Vita Nova.');
            } else {
                alert('¡Gracias por tu consulta! Nos pondremos en contacto contigo en un plazo máximo de 24 horas para brindarte toda la información que necesitas sobre Vita Nova.');
            }

            contactForm.reset();

            // Restablecer opciones por defecto
            opcionBtns.forEach(b => {
                b.classList.remove('active', 'green');
                if (b.getAttribute('data-tipo') === 'consulta') {
                    b.classList.add('active');
                }
            });

            tipoSolicitudInput.value = 'consulta';
            parentescoField.classList.remove('visible');
            parentescoInput.required = false;
            fechaField.style.display = 'block';
            // AGREGA ESTA LÍNEA para mostrar el campo de servicio cuando se reinicia:
            servicioField.style.display = 'block';

            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;

            // Desplazarse al inicio
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }, 1500);
    });

    // FILTRO DE SERVICIOS MEJORADO
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            // Quitar clase active de todos los botones
            filterBtns.forEach(b => b.classList.remove('active'));

            // Agregar clase active al botón clickeado
            this.classList.add('active');

            const filter = this.getAttribute('data-filter');

            // Animación de salida de tarjetas
            serviceCards.forEach(card => {
                card.style.opacity = '0.5';
                card.style.transform = 'scale(0.95)';

                setTimeout(() => {
                    if (filter === 'all' || card.getAttribute('data-category') === filter) {
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

    // Animaciones al hacer scroll para tarjetas de servicio
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Aplicar animaciones a elementos
    serviceCards.forEach(card => {
        observer.observe(card);
    });

    // Efecto hover en tarjetas de servicio mejorado
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.zIndex = '10';
            const icon = this.querySelector('.service-icon-container');
            if (icon) {
                icon.style.transform = 'scale(1.15) rotate(8deg)';
            }
        });

        card.addEventListener('mouseleave', function () {
            this.style.zIndex = '1';
            const icon = this.querySelector('.service-icon-container');
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0)';
            }
        });
    });

    // Modal de servicio
    const serviceModal = document.getElementById('serviceModal');
    const modalClose = document.getElementById('modalClose');
    const modalContent = document.getElementById('modalContent');

    // Cerrar modal con ESC
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            serviceModal.classList.remove('active');
        }
    });

    // Cerrar modal al hacer clic fuera
    serviceModal.addEventListener('click', function (e) {
        if (e.target === this) {
            this.classList.remove('active');
        }
    });

    // Cerrar modal con botón
    modalClose.addEventListener('click', function () {
        serviceModal.classList.remove('active');
    });
});

// Efecto de partículas flotantes
document.addEventListener('DOMContentLoaded', function () {
    const container = document.querySelector('.hero');
    if (!container) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 8 + 4 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = 'rgba(58, 91, 184, 0.1)';
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.zIndex = '1';
        particle.style.animation = `float ${Math.random() * 10 + 10}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
});