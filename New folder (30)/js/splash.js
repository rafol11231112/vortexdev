document.addEventListener('DOMContentLoaded', () => {
    // Show splash screen for a minimum time
    const minDisplayTime = 3000; // 3 seconds
    const startTime = new Date().getTime();
    
    // Update loading percentage
    let loadingPercentage = 0;
    const percentageText = document.getElementById('loading-percentage');
    const progressCircle = document.querySelector('.progress-ring-circle');
    const radius = progressCircle ? progressCircle.r.baseVal.value : 0;
    const circumference = radius * 2 * Math.PI;
    
    if (progressCircle) {
        progressCircle.style.strokeDasharray = `${circumference} ${circumference}`;
        progressCircle.style.strokeDashoffset = circumference;
    }
    
    // Function to update progress ring
    function setProgress(percent) {
        if (progressCircle) {
            const offset = circumference - (percent / 100) * circumference;
            progressCircle.style.strokeDashoffset = offset;
        }
        if (percentageText) {
            percentageText.textContent = `${Math.round(percent)}%`;
        }
    }
    
    // Simulated loading progress
    const loadingInterval = setInterval(() => {
        // Increment loading percentage with easing
        if (loadingPercentage < 70) {
            loadingPercentage += 1.2; // Faster initial loading
        } else if (loadingPercentage < 90) {
            loadingPercentage += 0.4; // Slow down in the middle
        } else if (loadingPercentage < 100) {
            loadingPercentage += 0.1; // Very slow at the end
        }
        
        // Keep percentage within bounds
        loadingPercentage = Math.min(loadingPercentage, 99);
        
        setProgress(loadingPercentage);
        
        // Also update the planet rotation speed based on loading progress
        const planetElement = document.querySelector('.planet-element');
        if (planetElement) {
            // Gradually increase rotation speed as loading progresses
            const rotationSpeed = 1 + (loadingPercentage / 100) * 2;
            planetElement.style.animationDuration = `${20 / rotationSpeed}s, 4s`;
        }
        
        // Check if site is loaded
        if (document.readyState === 'complete') {
            clearInterval(loadingInterval);
            const currentTime = new Date().getTime();
            const elapsedTime = currentTime - startTime;
            
            // Ensure splash screen shows for minimum time
            if (elapsedTime >= minDisplayTime) {
                completeSplash();
            } else {
                // Wait until minimum time has passed
                setTimeout(completeSplash, minDisplayTime - elapsedTime);
            }
        }
    }, 30);
    
    // Function to finish splash screen and show main content
    function completeSplash() {
        // Set to 100% when done
        setProgress(100);
        
        // Add complete class to splash screen
        const splashScreen = document.getElementById('splash-screen');
        if (splashScreen) {
            splashScreen.classList.add('complete');
            
            // Hide splash and show content after animation
            setTimeout(() => {
                splashScreen.style.display = 'none';
                document.body.classList.add('loaded');
            }, 600);
        }
    }
    
    // Handle direct completion if page is already loaded
    if (document.readyState === 'complete') {
        clearInterval(loadingInterval);
        const currentTime = new Date().getTime();
        const elapsedTime = currentTime - startTime;
        
        if (elapsedTime >= minDisplayTime) {
            completeSplash();
        } else {
            setTimeout(completeSplash, minDisplayTime - elapsedTime);
        }
    }
    
    // Add ambient particle animation to splash
    createAmbientParticles();
    
    // Add floating text elements
    createFloatingTextElements();
});

// Create floating text elements around the logo
function createFloatingTextElements() {
    const splashScreen = document.getElementById('splash-screen');
    const logoContainer = document.querySelector('.logo-container');
    if (!splashScreen || !logoContainer) return;
    
    // Colors to use for the floating text (matching example)
    const colors = [
        'rgb(245, 15, 11)',  // red
        'rgb(52, 130, 240)', // blue
        'rgb(46, 184, 113)', // green
        'rgb(236, 72, 153)', // pink
        'rgb(231, 76, 60)'   // light red
    ];
    
    // Add a container for the text elements
    const textContainer = document.createElement('div');
    textContainer.className = 'floating-text-container';
    splashScreen.appendChild(textContainer);
    
    // Generate random numbers for texts
    const texts = [
        '01', '10', '001', '101', '110', '111', '0101', 
        '1010', '0011', '1100', '01101', '10110', '00101',
        '11001', '10101', '00111', '11110', '01011', '10001'
    ];
    
    // Create floating text elements
    for (let i = 0; i < 40; i++) {
        const textElement = document.createElement('div');
        textElement.className = 'floating-text text-opacity-10';
        
        // Random position relative to the center
        const angle = Math.random() * Math.PI * 2; // Random angle
        const distance = 50 + Math.random() * 300; // Random distance from center (wider range)
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        // Random size between 25px and 90px
        const fontSize = 25 + Math.random() * 65;
        
        // Random color from our colors array
        const colorIndex = Math.floor(Math.random() * colors.length);
        const color = colors[colorIndex];
        
        // Random opacity between 0.05 and 0.6
        const opacity = 0.05 + Math.random() * 0.55;
        
        // Random rotation between 0 and 360 degrees
        const rotation = Math.random() * 360;
        
        // Random scale between 0.8 and 1.5
        const scale = 0.8 + Math.random() * 0.7;
        
        // Set random text content
        const textIndex = Math.floor(Math.random() * texts.length);
        textElement.textContent = texts[textIndex];
        
        // Apply styles
        textElement.style.cssText = `
            position: absolute;
            font-size: ${fontSize.toFixed(3)}px;
            color: ${color};
            opacity: ${opacity.toFixed(3)};
            transform: translate(${x.toFixed(3)}px, ${y.toFixed(3)}px) scale(${scale.toFixed(3)}) rotate(${rotation.toFixed(3)}deg);
        `;
        
        textContainer.appendChild(textElement);
        
        // Add animation with random duration
        animateFloatingText(textElement);
    }
}

// Add animation to floating text elements
function animateFloatingText(element) {
    // Current transformation values
    const style = window.getComputedStyle(element);
    const transform = style.getPropertyValue('transform');
    
    // Random movement parameters
    const duration = 15 + Math.random() * 20; // 15-35 seconds
    const xMove = -50 + Math.random() * 100; // -50px to 50px
    const yMove = -50 + Math.random() * 100; // -50px to 50px
    const rotateChange = -30 + Math.random() * 60; // -30deg to 30deg
    const scaleChange = 0.95 + Math.random() * 0.2; // 0.95 to 1.15
    
    // Apply animation
    element.style.transition = `transform ${duration}s ease-in-out`;
    
    // Create a function to continuously change position
    const moveElement = () => {
        // Parse current transform
        const currentTransform = element.style.transform;
        const translateMatch = currentTransform.match(/translate\(([^,]+)px,\s*([^)]+)px\)/);
        const scaleMatch = currentTransform.match(/scale\(([^)]+)\)/);
        const rotateMatch = currentTransform.match(/rotate\(([^)]+)deg\)/);
        
        if (translateMatch && scaleMatch && rotateMatch) {
            const currentX = parseFloat(translateMatch[1]);
            const currentY = parseFloat(translateMatch[2]);
            const currentScale = parseFloat(scaleMatch[1]);
            const currentRotate = parseFloat(rotateMatch[1]);
            
            // Calculate new values
            const newX = currentX + xMove;
            const newY = currentY + yMove;
            const newScale = currentScale * scaleChange;
            const newRotate = currentRotate + rotateChange;
            
            // Apply new transform
            element.style.transform = `translate(${newX.toFixed(3)}px, ${newY.toFixed(3)}px) scale(${newScale.toFixed(3)}) rotate(${newRotate.toFixed(3)}deg)`;
        }
        
        // Schedule next movement
        setTimeout(moveElement, duration * 1000);
    };
    
    // Start animation after a random delay
    setTimeout(moveElement, Math.random() * 3000);
}

// Create ambient particles for splash screen
function createAmbientParticles() {
    const splashScreen = document.getElementById('splash-screen');
    if (!splashScreen) return;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'splash-particles';
    splashScreen.appendChild(particleContainer);
    
    // Create orbital rings
    const orbitalRing = document.createElement('div');
    orbitalRing.className = 'orbital-ring';
    splashScreen.querySelector('.logo-container').appendChild(orbitalRing);
    
    const orbitalRing2 = document.createElement('div');
    orbitalRing2.className = 'orbital-ring ring2';
    splashScreen.querySelector('.logo-container').appendChild(orbitalRing2);
    
    // Add a glowing effect to the planet
    const planetGlow = document.createElement('div');
    planetGlow.className = 'planet-glow';
    splashScreen.querySelector('.logo-container').appendChild(planetGlow);
    
    // Add a loading indicator on the planet
    const planetLoading = document.createElement('div');
    planetLoading.className = 'planet-loading';
    splashScreen.querySelector('.planet-element').appendChild(planetLoading);
    
    // Add orbiting particles
    for (let i = 0; i < 6; i++) {
        const particle = document.createElement('div');
        particle.className = 'orbital-particle';
        particle.style.animationDelay = `${i * 0.5}s`;
        orbitalRing.appendChild(particle);
        
        const particle2 = document.createElement('div');
        particle2.className = 'orbital-particle';
        particle2.style.animationDelay = `${i * 0.3}s`;
        orbitalRing2.appendChild(particle2);
        
        // Add small dust particles
        const dustParticle = document.createElement('div');
        dustParticle.className = 'dust-particle';
        dustParticle.style.animationDelay = `${i * 0.2}s`;
        dustParticle.style.left = `${Math.random() * 160}px`;
        dustParticle.style.top = `${Math.random() * 160}px`;
        splashScreen.querySelector('.logo-container').appendChild(dustParticle);
    }
    
    // Add background particles
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'ambient-particle';
        
        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 3 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random opacity
        particle.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        
        // Random animation duration
        const duration = Math.random() * 10 + 5;
        particle.style.animation = `floatParticle ${duration}s ease-in-out infinite alternate`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particleContainer.appendChild(particle);
    }
} 