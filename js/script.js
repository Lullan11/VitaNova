document.addEventListener('DOMContentLoaded', function () {
    // ===== ELEMENTOS DEL DOM =====
    const header = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-links a');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.nav-links');
    const contactForm = document.getElementById('formContacto');
    const sections = document.querySelectorAll('section');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const serviceCards = document.querySelectorAll('.service-card');
    const floatingInfo = document.getElementById('floatingInfo');
    const floatingToggle = document.getElementById('floatingToggle');
    const closeFloating = document.getElementById('closeFloating');
    const whatsappBtn = document.querySelector('.whatsapp-float');

    // ===== EFECTO DE SCROLL EN HEADER =====
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

    // ===== MENÚ MÓVIL =====
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

    // ===== FILTRO DE SERVICIOS =====
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

    // ===== VENTANA FLOTANTE MEJORADA =====
    // Solo se abre cuando el usuario hace clic en el botón
    floatingToggle.addEventListener('click', function () {
        floatingInfo.classList.toggle('active');
        this.style.transform = floatingInfo.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0)';
    });

    closeFloating.addEventListener('click', function () {
        floatingInfo.classList.remove('active');
        floatingToggle.style.transform = 'rotate(0)';
    });

    // Cerrar ventana flotante al hacer clic fuera
    document.addEventListener('click', function (event) {
        if (!floatingInfo.contains(event.target) &&
            !floatingToggle.contains(event.target) &&
            floatingInfo.classList.contains('active')) {
            floatingInfo.classList.remove('active');
            floatingToggle.style.transform = 'rotate(0)';
        }
    });

    // ===== FORMULARIO DE CONTACTO =====
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
                servicioField.style.display = 'none';
            } else {
                parentescoField.classList.remove('visible');
                parentescoInput.required = false;
                fechaField.style.display = 'none';
                servicioField.style.display = 'block';
            }
        });
    });

    // Envío del formulario
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

    // ===== ANIMACIONES DE TARJETAS AL SCROLL =====
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

    // ===== PARTÍCULAS FLOTANTES EN HERO =====
    const particlesContainer = document.getElementById('particles');
    const colors = ['#3a5bb8', '#6ba43a', '#5a7de0', '#8bc34a'];

    for (let i = 0; i < 40; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Tamaño aleatorio
        const size = Math.random() * 20 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Posición aleatoria
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // Color aleatorio
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Animación aleatoria
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;

        particlesContainer.appendChild(particle);
    }

    // ===== EFECTO PULSO EN BOTÓN DE WHATSAPP =====
    setInterval(() => {
        whatsappBtn.style.transform = 'scale(1.1)';
        setTimeout(() => {
            whatsappBtn.style.transform = 'scale(1)';
        }, 300);
    }, 3000);

    // ===== SCROLL SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== ANIMACIÓN DE MARCADOR EN EL MAPA =====
    const marker = document.querySelector('.marker-pin');
    setInterval(() => {
        marker.style.transform = 'rotate(-45deg) scale(1.1)';
        setTimeout(() => {
            marker.style.transform = 'rotate(-45deg) scale(1)';
        }, 300);
    }, 2000);
});