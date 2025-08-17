
    // Preloader
    window.addEventListener('load', () => {
      const preloader = document.getElementById('preloader');
      if (preloader) {
        preloader.style.opacity = '0';
        setTimeout(() => {
          preloader.style.display = 'none';
        }, 500);
      }
    });

    // Particles background
    (function initParticles() {
      const canvas = document.getElementById('particles');
      if (!canvas) return;
      
      const ctx = canvas.getContext('2d');
      let particles = [];
      const particleCount = 60;
      
      // Set canvas size
      function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      
      // Create particles
      function createParticles() {
        particles = [];
        for (let i = 0; i < particleCount; i++) {
          particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 0.6,
            speedY: (Math.random() - 0.5) * 0.6
          });
        }
      }
      
      // Draw particles
      function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw particles
        for (let i = 0; i < particles.length; i++) {
          const p = particles[i];
          
          // Update position
          p.x += p.speedX;
          p.y += p.speedY;
          
          // Bounce off edges
          if (p.x < 0 || p.x > canvas.width) p.speedX *= -1;
          if (p.y < 0 || p.y > canvas.height) p.speedY *= -1;
          
          // Draw particle
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fillStyle = 'rgba(96, 165, 250, 0.7)';
          ctx.fill();
        }
        
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
          for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
              ctx.beginPath();
              ctx.strokeStyle = `rgba(59, 130, 246, ${0.2 * (1 - distance/150)})`;
              ctx.lineWidth = 0.5;
              ctx.moveTo(particles[i].x, particles[i].y);
              ctx.lineTo(particles[j].x, particles[j].y);
              ctx.stroke();
            }
          }
        }
        
        requestAnimationFrame(drawParticles);
      }
      
      createParticles();
      drawParticles();
    })();

    // Mobile menu
    document.addEventListener('DOMContentLoaded', () => {
      const hamburger = document.getElementById('hamburger');
      const mobileMenu = document.getElementById('mobileMenu');
      const menuLinks = document.querySelectorAll('.menu a');
      
      if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
          mobileMenu.classList.toggle('active');
          hamburger.innerHTML = mobileMenu.classList.contains('active') ? 
            '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
        });
        
        // Clone menu items to mobile menu
        mobileMenu.innerHTML = '';
        menuLinks.forEach(link => {
          const clone = link.cloneNode(true);
          mobileMenu.appendChild(clone);
        });
        
        // Close menu when clicking a link
        mobileMenu.querySelectorAll('a').forEach(link => {
          link.addEventListener('click', () => {
            mobileMenu.classList.remove('active');
            hamburger.innerHTML = '<i class="fa-solid fa-bars"></i>';
          });
        });
      }
    });

    // Scroll progress
    window.addEventListener('scroll', () => {
      const progress = document.getElementById('progress');
      if (!progress) return;
      
      const scrollTop = document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop / scrollHeight) * 100;
      
      progress.style.width = scrollPercentage + '%';
    });

    // Reveal on scroll
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    revealElements.forEach(el => {
      revealObserver.observe(el);
    });

    // Active nav link
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.menu a, .mobile a');

    window.addEventListener('scroll', () => {
      let current = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - sectionHeight / 3) {
          current = section.getAttribute('id');
        }
      });
      
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
          link.classList.add('active');
        }
      });
    });

    // Back to top button
    const toTopButton = document.getElementById('toTop');

    window.addEventListener('scroll', () => {
      if (window.scrollY > 500) {
        toTopButton.classList.add('show');
      } else {
        toTopButton.classList.remove('show');
      }
    });

    toTopButton.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });

    // Project card flip on mobile with swipe
    if ('ontouchstart' in window) {
      const projectCards = document.querySelectorAll('.project-card');
      
      projectCards.forEach(card => {
        let touchStartX = 0;
        let touchEndX = 0;
        
        card.addEventListener('touchstart', e => {
          touchStartX = e.changedTouches[0].screenX;
        });
        
        card.addEventListener('touchend', e => {
          touchEndX = e.changedTouches[0].screenX;
          handleSwipe(card);
        });
        
        function handleSwipe(element) {
          const minSwipeDistance = 50;
          
          if (touchStartX - touchEndX > minSwipeDistance) {
            // Swipe left
            element.style.transform = 'rotateY(180deg)';
          } else if (touchEndX - touchStartX > minSwipeDistance) {
            // Swipe right
            element.style.transform = 'rotateY(0deg)';
          }
        }
      });
    }