   // Particles background
        const canvas = document.getElementById('particles');
        const ctx = canvas.getContext('2d');
        
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 100;
        
        class Particle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = `rgba(96, 165, 250, ${Math.random() * 0.5 + 0.1})`;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function initParticles() {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }
        
        function connectParticles() {
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(96, 165, 250, ${0.1 - distance/120})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
        }
        
        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
            }
            
            connectParticles();
            requestAnimationFrame(animateParticles);
        }
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        // Scroll animations
        function initScrollAnimations() {
            const fadeElements = document.querySelectorAll('.fade-in');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.animation = `fadeIn ${entry.target.dataset.delay || '1s'} ease forwards`;
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.1 });
            
            fadeElements.forEach(el => {
                el.dataset.delay = `${Math.random() * 0.5 + 0.5}s`;
                observer.observe(el);
            });
        }
        
        // Mobile menu toggle
        function initMobileMenu() {
            const mobileMenuBtn = document.querySelector('.mobile-menu');
            const navLinks = document.querySelector('.nav-links');
            
            mobileMenuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
        }
        
        // Smooth scrolling for anchor links
        function initSmoothScrolling() {
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const targetId = this.getAttribute('href');
                    const targetElement = document.querySelector(targetId);
                    
                    if (targetElement) {
                        window.scrollTo({
                            top: targetElement.offsetTop - 80,
                            behavior: 'smooth'
                        });
                        
                        // Close mobile menu if open
                        document.querySelector('.nav-links').classList.remove('active');
                    }
                });
            });
        }
        
        // Set active navigation link
        function setActiveNav() {
            const sections = document.querySelectorAll('section');
            const navLinks = document.querySelectorAll('.nav-links a');
            
            window.addEventListener('scroll', () => {
                let current = '';
                
                sections.forEach(section => {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.clientHeight;
                    
                    if (window.scrollY >= sectionTop - 100) {
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
        
        // Discord username copy functionality
        function initDiscordCopy() {
            const discordBtn = document.getElementById('discord-btn');
            const toast = document.getElementById('toast');
            
            discordBtn.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Copy username to clipboard
                navigator.clipboard.writeText('ahmed_2030_84932').then(() => {
                    // Show toast notification
                    toast.classList.add('show');
                    
                    // Hide after 3 seconds
                    setTimeout(() => {
                        toast.classList.remove('show');
                    }, 3000);
                });
            });
        }
        
        // Initialize everything
        window.addEventListener('load', () => {
            initParticles();
            animateParticles();
            initScrollAnimations();
            initMobileMenu();
            initSmoothScrolling();
            setActiveNav();
            initDiscordCopy();
        });
