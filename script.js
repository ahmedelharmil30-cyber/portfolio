// Dynamic Color System - Automatically changes based on user interaction and time
class DynamicColorSystem {
    constructor() {
        this.baseHue = 150; // Base green hue for cybersecurity theme
        this.currentHue = this.baseHue;
        this.hueVelocity = 0;
        this.hueAcceleration = 0;
        this.maxHueVelocity = 5;
        this.minHue = 120; // Blue-green range
        this.maxHue = 200; // Cyan range
        
        // Color names for display
        this.colorNames = {
            120: "Security Blue",
            130: "Network Cyan",
            140: "Cyber Teal",
            150: "Cyber Green",
            160: "System Green",
            170: "Forest Green",
            180: "Mint Green",
            190: "Emerald",
            200: "Jade"
        };
        
        // Interaction tracking
        this.lastInteractionTime = Date.now();
        this.idleTimer = 0;
        this.scrollIntensity = 0;
        this.mouseX = 0;
        this.mouseY = 0;
        this.mouseVelocity = 0;
        this.lastMouseUpdate = Date.now();
        
        // Animation variables
        this.pulsePhase = 0;
        this.glowIntensity = 0.5;
        this.breathingPhase = 0;
        
        // Initialize
        this.init();
    }
    
    init() {
        this.updateColorDisplay();
        this.startAnimation();
        this.setupEventListeners();
        this.applyColor(this.currentHue);
    }
    
    setupEventListeners() {
        // Scroll interaction
        window.addEventListener('scroll', () => {
            this.scrollIntensity = Math.min(window.scrollY / 100, 3);
            this.hueAcceleration = this.scrollIntensity * 0.1;
            this.lastInteractionTime = Date.now();
        });
        
        // Mouse movement interaction
        document.addEventListener('mousemove', (e) => {
            const now = Date.now();
            const timeDiff = now - this.lastMouseUpdate;
            
            if (timeDiff > 50) { // Throttle updates
                const dx = e.clientX - this.mouseX;
                const dy = e.clientY - this.mouseY;
                this.mouseVelocity = Math.sqrt(dx * dx + dy * dy) / timeDiff;
                
                // Map mouse X position to hue influence
                const windowWidth = window.innerWidth;
                const normalizedX = e.clientX / windowWidth;
                this.hueAcceleration = (normalizedX - 0.5) * 2;
                
                this.mouseX = e.clientX;
                this.mouseY = e.clientY;
                this.lastMouseUpdate = now;
                this.lastInteractionTime = Date.now();
            }
        });
        
        // Touch interaction for mobile
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const now = Date.now();
            const timeDiff = now - this.lastMouseUpdate;
            
            if (timeDiff > 50) {
                const dx = touch.clientX - this.mouseX;
                const dy = touch.clientY - this.mouseY;
                this.mouseVelocity = Math.sqrt(dx * dx + dy * dy) / timeDiff;
                
                const windowWidth = window.innerWidth;
                const normalizedX = touch.clientX / windowWidth;
                this.hueAcceleration = (normalizedX - 0.5) * 2;
                
                this.mouseX = touch.clientX;
                this.mouseY = touch.clientY;
                this.lastMouseUpdate = now;
                this.lastInteractionTime = Date.now();
            }
        });
        
        // Click interaction
        document.addEventListener('click', () => {
            this.hueAcceleration += 1;
            this.lastInteractionTime = Date.now();
        });
        
        // Hover interaction
        document.addEventListener('mouseover', (e) => {
            if (e.target.matches('.btn, .card, .skill-tag, .project-card, .contact-card')) {
                this.hueAcceleration += 0.2;
                this.lastInteractionTime = Date.now();
            }
        });
    }
    
    startAnimation() {
        const animate = () => {
            const now = Date.now();
            const timeSinceInteraction = now - this.lastInteractionTime;
            
            // Breathing effect when idle
            this.breathingPhase = (this.breathingPhase + 0.02) % (Math.PI * 2);
            
            // Pulse effect
            this.pulsePhase = (this.pulsePhase + 0.05) % (Math.PI * 2);
            
            // Update hue velocity based on acceleration
            this.hueVelocity += this.hueAcceleration;
            this.hueVelocity *= 0.95; // Friction
            this.hueVelocity = Math.max(Math.min(this.hueVelocity, this.maxHueVelocity), -this.maxHueVelocity);
            
            // Update current hue
            this.currentHue += this.hueVelocity;
            
            // Keep hue in range
            if (this.currentHue < this.minHue) {
                this.currentHue = this.minHue;
                this.hueVelocity *= -0.5; // Bounce back
            } else if (this.currentHue > this.maxHue) {
                this.currentHue = this.maxHue;
                this.hueVelocity *= -0.5; // Bounce back
            }
            
            // Reset acceleration
            this.hueAcceleration *= 0.9;
            
            // Automatic subtle changes when idle
            if (timeSinceInteraction > 5000) { // 5 seconds idle
                const idlePhase = (now / 20000) % (Math.PI * 2);
                this.hueAcceleration += Math.sin(idlePhase) * 0.01;
                
                // Gentle breathing glow
                this.glowIntensity = 0.3 + Math.sin(this.breathingPhase) * 0.2;
            } else {
                // Active interaction glow
                const activity = Math.min(timeSinceInteraction / 1000, 1);
                this.glowIntensity = 0.5 + (1 - activity) * 0.3;
            }
            
            // Apply the new color
            this.applyColor(this.currentHue);
            
            // Update display
            this.updateColorDisplay();
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    applyColor(hue) {
        // Update CSS variables
        const saturation = 100;
        const lightness = 50;
        
        document.documentElement.style.setProperty('--hue', hue);
        document.documentElement.style.setProperty('--saturation', `${saturation}%`);
        document.documentElement.style.setProperty('--lightness', `${lightness}%`);
        
        // Update glow intensity
        const glowAlpha = this.glowIntensity * 0.5;
        document.documentElement.style.setProperty('--accent-glow', 
            `0 0 20px hsla(${hue}, ${saturation}%, ${lightness}%, ${glowAlpha})`);
        
        // Update subtle color for backgrounds
        const subtleAlpha = 0.1 + Math.sin(this.pulsePhase) * 0.05;
        document.documentElement.style.setProperty('--accent-subtle', 
            `hsla(${hue}, ${saturation}%, ${lightness}%, ${subtleAlpha})`);
    }
    
    updateColorDisplay() {
        const hue = Math.round(this.currentHue);
        const colorName = this.getColorName(hue);
        const hexColor = this.hslToHex(hue, 100, 50);
        
        const colorNameEl = document.getElementById('colorName');
        const colorHexEl = document.getElementById('colorHex');
        
        if (colorNameEl) colorNameEl.textContent = colorName;
        if (colorHexEl) colorHexEl.textContent = hexColor;
    }
    
    getColorName(hue) {
        // Find closest named hue
        const hues = Object.keys(this.colorNames).map(Number);
        const closestHue = hues.reduce((prev, curr) => {
            return Math.abs(curr - hue) < Math.abs(prev - hue) ? curr : prev;
        });
        
        return this.colorNames[closestHue];
    }
    
    hslToHex(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        
        let r, g, b;
        
        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        
        const toHex = (x) => {
            const hex = Math.round(x * 255).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }
}

// Create particles background
function createParticles() {
    const container = document.getElementById('particles-js');
    const particleCount = 60;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random properties
        const size = Math.random() * 5 + 2;
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        const duration = Math.random() * 20 + 10;
        const delay = Math.random() * 5;
        const opacity = Math.random() * 0.4 + 0.1;
        
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        particle.style.animationDuration = `${duration}s`;
        particle.style.animationDelay = `${delay}s`;
        particle.style.opacity = opacity;
        
        container.appendChild(particle);
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navLinks = document.querySelector('.nav-links');
    
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.innerHTML = navLinks.classList.contains('active') 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    });
    
    document.querySelectorAll('.nav-links a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });
}

// Navbar scroll effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// Active navigation highlighting
function initActiveNav() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop - 200) {
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
}

// Smooth scrolling
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Progress bar
function initProgressBar() {
    const progressBar = document.getElementById('progressBar');
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
}

// Back to top button
function initBackToTop() {
    const backToTop = document.getElementById('backToTop');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    
    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animated counters
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current);
                setTimeout(updateCounter, 20);
            } else {
                counter.textContent = target;
            }
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Animated skill bars
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-level');
    
    skillBars.forEach(bar => {
        const level = bar.getAttribute('data-level');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        bar.style.width = level + '%';
                    }, 300);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(bar);
    });
}

// Typing effect
function initTypingEffect() {
    const textElement = document.querySelector('.typing-text');
    const texts = [
        "Cybersecurity Engineer & Network Security Specialist",
        "SOC Analyst & Threat Hunter",
        "Linux Administrator & Security Consultant",
        "Fortinet Security Engineer"
    ];
    
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
        const currentText = texts[textIndex];
        
        if (isDeleting) {
            textElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            textElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }
        
        if (!isDeleting && charIndex === currentText.length) {
            isDeleting = true;
            setTimeout(type, 2000);
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % texts.length;
            setTimeout(type, 500);
        } else {
            setTimeout(type, isDeleting ? 50 : 100);
        }
    }
    
    setTimeout(type, 1000);
}

// Email form submission
function initEmailForm() {
    const form = document.getElementById('emailForm');
    const successMessage = document.getElementById('successMessage');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value,
            timestamp: new Date().toISOString()
        };
        
        // Simulate sending
        setTimeout(() => {
            successMessage.classList.add('show');
            
            setTimeout(() => {
                successMessage.classList.remove('show');
            }, 5000);
            
            form.reset();
            
            // Log to console
            console.log('Email form submitted:', formData);
        }, 1000);
    });
}

// Fade-in animations
function initAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    fadeElements.forEach(el => {
        observer.observe(el);
    });
}

// Newsletter form
function initNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const email = this.querySelector('input').value;
        
        if (email && email.includes('@')) {
            this.innerHTML = '<span style="color: var(--accent)">Subscribed! <i class="fas fa-check"></i></span>';
            console.log('Newsletter subscription:', email);
        }
    });
}

// Initialize everything when page loads
window.addEventListener('load', () => {
    // Initialize dynamic color system
    new DynamicColorSystem();
    
    // Initialize other components
    createParticles();
    initMobileMenu();
    initNavbarScroll();
    initActiveNav();
    initSmoothScroll();
    initProgressBar();
    initBackToTop();
    initCounters();
    initSkillBars();
    initTypingEffect();
    initEmailForm();
    initAnimations();
    initNewsletter();
    
    // Preload animations
    setTimeout(() => {
        document.querySelectorAll('.fade-in').forEach(el => {
            if (el.getBoundingClientRect().top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
});

// Performance optimization
let lastScrollY = window.scrollY;
let ticking = false;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    
    if (!ticking) {
        window.requestAnimationFrame(() => {
            // Any scroll-based animations here
            ticking = false;
        });
        
        ticking = true;
    }
});
