document.addEventListener('DOMContentLoaded', () => {
    // Initialize tech card animation
    initTechCards();
    
    // Setup project details view
    initProjectDetailView();
    
    // Setup form submission
    setupContactForm();
    
    // Add scroll to top button
    addScrollToTopButton();
});

/**
 * Initialize typing effect in the terminal section
 */
function initTypingEffect() {
    const typingLine = document.querySelector('.typing-animation');
    const textToType = "const fullstack = true;";
    let i = 0;
    
    function typeWriter() {
        if (i < textToType.length) {
            typingLine.textContent += textToType.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        }
    }
    
    setTimeout(() => {
        typeWriter();
    }, 1500);
}

/**
 * Create and animate particles in the background
 */
function initParticleBackground() {
    const particleContainer = document.querySelector('.particle-background');
    
    // Create particles
    for (let i = 0; i < 30; i++) {
        createParticle(particleContainer);
    }
}

/**
 * Create a single particle element
 */
function createParticle(container) {
    const particle = document.createElement('div');
    particle.classList.add('particle');
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    
    // Random size
    const size = Math.random() * 3 + 1;
    
    // Random color (primary or secondary)
    const colors = ['#ff3e55', '#3e84ff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    // Random opacity
    const opacity = Math.random() * 0.5 + 0.1;
    
    // Set particle styles
    particle.style.cssText = `
        position: absolute;
        top: ${y}%;
        left: ${x}%;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: 50%;
        opacity: ${opacity};
        pointer-events: none;
        animation: float ${Math.random() * 10 + 10}s linear infinite;
    `;
    
    container.appendChild(particle);
    
    // Create CSS animation for floating movement
    const style = document.createElement('style');
    const animName = `float-${Math.floor(Math.random() * 1000)}`;
    style.textContent = `
        @keyframes float {
            0% {
                transform: translate(0, 0);
            }
            25% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
            50% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
            75% {
                transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px);
            }
            100% {
                transform: translate(0, 0);
            }
        }
    `;
    document.head.appendChild(style);
    
    particle.style.animation = `${animName} ${Math.random() * 20 + 10}s infinite alternate`;
}

/**
 * Initialize animations that occur on scrolling
 */
function initScrollAnimations() {
    // Add scroll event listener
    window.addEventListener('scroll', () => {
        // Add fixed header class on scroll
        const header = document.querySelector('header');
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
        
        // Animate elements when they come into view
        const animateElements = document.querySelectorAll('.project-card, .profile-card, .about-text, .dev-profile');
        animateElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight - 100;
            
            if (isVisible) {
                el.classList.add('fade-in');
            }
        });
    });
}

// Initialize tech card animation
function initTechCards() {
    const techCard = document.getElementById('tech-card-1');
    
    if (techCard) {
        // Add 3D hover effect to the card
        techCard.addEventListener('mousemove', function(e) {
            const rect = techCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const angleX = (y - centerY) / 20;
            const angleY = (centerX - x) / 20;
            
            techCard.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        
        techCard.addEventListener('mouseleave', function() {
            techCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
        });
    }
}

// Setup the project detail view interaction
function initProjectDetailView() {
    const projectCards = document.querySelectorAll('.project-card');
    const projectDetail = document.getElementById('project-detail');
    
    if (!projectDetail) return;
    
    const projectTitle = document.getElementById('detail-project-title');
    const projectDescription = document.querySelector('.detail-description');
    
    // Add click event to all project cards
    projectCards.forEach(card => {
        const viewDetailsBtn = card.querySelector('.btn');
        
        if (viewDetailsBtn) {
            viewDetailsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get project info
                const title = card.querySelector('h3').textContent;
                const description = card.querySelector('p').textContent;
                
                // Update detail view
                projectTitle.textContent = title;
                projectDescription.textContent = description;
                
                // Show detail view
                projectDetail.classList.remove('hidden');
                
                // Scroll to detail view
                projectDetail.scrollIntoView({ behavior: 'smooth' });
            });
        }
    });
    
    // Add back button to detail view
    const backButton = document.createElement('button');
    backButton.classList.add('btn-outline', 'back-btn');
    backButton.innerHTML = '<i class="fas fa-arrow-left"></i> Back to projects';
    projectDetail.insertBefore(backButton, projectDetail.firstChild);
    
    backButton.addEventListener('click', () => {
        projectDetail.classList.add('hidden');
        document.getElementById('projects').scrollIntoView({ behavior: 'smooth' });
    });
}

// Setup contact form submission
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Get form data
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Validate form
            if (!name || !email || !message) {
                alert('Please fill out all fields.');
                return;
            }
            
            // Simulate form submission
            const submitBtn = contactForm.querySelector('.submit-btn');
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            
            setTimeout(() => {
                // Simulating success response
                contactForm.innerHTML = `
                    <div class="success-message">
                        <i class="fas fa-check-circle"></i>
                        <h3>Message Sent!</h3>
                        <p>Thank you for reaching out. I'll get back to you soon.</p>
                    </div>
                `;
            }, 1500);
        });
    }
}

// Add scroll to top button
function addScrollToTopButton() {
    const scrollBtn = document.createElement('button');
    scrollBtn.classList.add('scroll-top-btn');
    scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('visible');
        } else {
            scrollBtn.classList.remove('visible');
        }
    });
    
    // Scroll to top on click
    scrollBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
} 