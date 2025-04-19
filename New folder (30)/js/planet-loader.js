// Performance monitoring variables
let isScrolling = false;
let scrollTimeout;
let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let isPageVisible = true;
let lastFrameTime = 0;
const FRAME_BUDGET = 16; // ~60fps
let orbitsAnimationId = null;
let backgroundParticlesId = null;

// Observe page visibility changes
document.addEventListener('visibilitychange', () => {
  isPageVisible = document.visibilityState === 'visible';
  
  if (!isPageVisible) {
    // Pause heavy animations when page is not visible
    if (orbitsAnimationId) {
      cancelAnimationFrame(orbitsAnimationId);
      orbitsAnimationId = null;
    }
    if (backgroundParticlesId) {
      cancelAnimationFrame(backgroundParticlesId);
      backgroundParticlesId = null;
    }
  } else if (document.getElementById('planet-loader') && 
            !document.getElementById('planet-loader').classList.contains('hidden')) {
    // Only restart if loader is still visible
    animateOrbits();
    animateBackgroundParticles();
  }
});

// Add scroll detection
window.addEventListener('scroll', () => {
  isScrolling = true;
  
  // Clear previous timeout
  if (scrollTimeout) {
    clearTimeout(scrollTimeout);
  }
  
  // Set a timeout to detect when scrolling ends
  scrollTimeout = setTimeout(() => {
    isScrolling = false;
  }, 200);
});

// Throttle function for performance-heavy operations
function throttle(callback, delay) {
  let lastCall = 0;
  return function(...args) {
    const now = performance.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
}

// Debounce function to limit frequent executions
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Initialize the planet loader
document.addEventListener('DOMContentLoaded', function() {
  setupProgressLoader();
  createOrbitRings();
  createBackgroundParticles();
  animateOrbits();
  animateBackgroundParticles();
  
  // Determine how many resources to load based on reduced motion preference
  const resourceCount = isReducedMotion ? 15 : 30;
  
  // Simulate loading with a lighter algorithm when user prefers reduced motion
  simulateLoading(resourceCount);
});

// Function to set up the progress loader circle with SVG
function setupProgressLoader() {
  const loaderCircle = document.querySelector('.loader-circle');
  if (!loaderCircle) return;
  
  // Check if the progress ring already exists to avoid duplicates
  if (loaderCircle.querySelector('.progress-ring')) {
    // Just update the existing elements instead of creating new ones
    const existingText = loaderCircle.querySelector('.loader-text');
    if (existingText) existingText.textContent = "0%";
    return;
  }
  
  const svgNS = "http://www.w3.org/2000/svg";
  const progressRing = document.createElementNS(svgNS, "svg");
  progressRing.setAttributeNS(null, "class", "progress-ring");
  progressRing.setAttributeNS(null, "width", "110");
  progressRing.setAttributeNS(null, "height", "110");
  
  const progressCircle = document.createElementNS(svgNS, "circle");
  progressCircle.setAttributeNS(null, "class", "progress-ring-circle");
  progressCircle.setAttributeNS(null, "cx", "55");
  progressCircle.setAttributeNS(null, "cy", "55");
  progressCircle.setAttributeNS(null, "r", "50");
  progressCircle.setAttributeNS(null, "stroke-dasharray", "314");
  progressCircle.setAttributeNS(null, "stroke-dashoffset", "314");
  
  progressRing.appendChild(progressCircle);
  loaderCircle.appendChild(progressRing);
  
  // Check if loader text already exists
  let loaderText = loaderCircle.querySelector('.loader-text');
  if (!loaderText) {
    loaderText = document.createElement("div");
    loaderText.className = "loader-text";
    loaderText.textContent = "0%";
    loaderCircle.appendChild(loaderText);
  }
}

// Function to update the progress circle based on loading percentage
function updateProgressCircle(percent) {
  // Skip updates during scrolling to improve performance
  if (isScrolling) return;
  
  const progressCircle = document.querySelector('.progress-ring-circle');
  const loaderText = document.querySelector('.loader-text');
  
  if (!progressCircle || !loaderText) return;
  
  const circumference = 2 * Math.PI * 50;
  const offset = circumference - (percent / 100) * circumference;
  
  // Use requestAnimationFrame for smooth updates
  requestAnimationFrame(() => {
    progressCircle.style.strokeDashoffset = offset;
    loaderText.textContent = `${Math.round(percent)}%`;
    
    // Change color based on progress
    if (percent > 75) {
      progressCircle.style.stroke = "#ff4d4d";
    } else if (percent > 50) {
      progressCircle.style.stroke = "#ff6666";
    } else if (percent > 25) {
      progressCircle.style.stroke = "#ff8080";
    }
  });
}

// Optimized orbit animations with framerate control
function animateOrbits() {
  // Skip animation during scrolling or when page isn't visible
  if (isScrolling || !isPageVisible) {
    orbitsAnimationId = requestAnimationFrame(animateOrbits);
    return;
  }
  
  const now = performance.now();
  // Only update if we have enough frame budget
  if (now - lastFrameTime >= FRAME_BUDGET) {
    lastFrameTime = now;
    
    const orbits = document.querySelectorAll('.orbit');
    orbits.forEach(orbit => {
      // Skip animation for off-screen or hidden elements
      if (!isElementInViewport(orbit) || 
          window.getComputedStyle(orbit).visibility === 'hidden') {
        return;
      }
      
      // Get current rotation
      const currentTransform = window.getComputedStyle(orbit).transform;
      // Apply subtle 3D movement only if the element is visible
      const rotateX = 60 + Math.sin(now * 0.0005) * 5;
      const rotateZ = Math.cos(now * 0.0003) * 5;
      
      // Use transform3d for hardware acceleration
      orbit.style.transform = `translate(-50%, -50%) rotateX(${rotateX}deg) rotateZ(${rotateZ}deg)`;
    });
  }
  
  orbitsAnimationId = requestAnimationFrame(animateOrbits);
}

// Helper function to check if element is in viewport (optimization)
function isElementInViewport(el) {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= -rect.height &&
    rect.left >= -rect.width &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) + rect.height &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width
  );
}

// Create orbit rings with dots - optimized
function createOrbitRings() {
  // Don't create all rings if reduced motion is preferred
  const orbitCount = isReducedMotion ? 3 : 5;
  const dotsPerOrbit = isReducedMotion ? 4 : 8;
  
  for (let i = 1; i <= orbitCount; i++) {
    const orbit = document.querySelector(`.orbit-${i}`);
    if (!orbit) continue;
    
    // Create dots for this orbit - use documentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    // Create fewer dots for better performance
    for (let j = 0; j < dotsPerOrbit; j++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      
      // Calculate positions around the circle
      const angle = (j / dotsPerOrbit) * 2 * Math.PI;
      const radius = orbit.offsetWidth / 2;
      
      // Position based on angle
      dot.style.left = `${radius + radius * Math.cos(angle)}px`;
      dot.style.top = `${radius + radius * Math.sin(angle)}px`;
      
      // Add some z-axis variation for 3D effect
      dot.style.transform = `translateZ(${Math.sin(angle) * 5}px)`;
      
      fragment.appendChild(dot);
    }
    
    orbit.appendChild(fragment);
  }
}

// Function to create background particles with reduced count for better performance
function createBackgroundParticles() {
  const bgParticles = document.querySelector('.bg-particles');
  if (!bgParticles) return;
  
  // Clear any existing particles first to prevent duplicates
  bgParticles.innerHTML = '';
  
  // Reduce particle count based on performance preferences
  const particleCount = isReducedMotion ? 15 : 30;
  
  // Use documentFragment for better performance
  const fragment = document.createDocumentFragment();
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size between 1-3px
    const size = Math.random() * 2 + 1;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    
    // Random position
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    
    // Random opacity
    particle.style.opacity = Math.random() * 0.5 + 0.1;
    
    // Random animation delay
    particle.style.animationDelay = `${Math.random() * 5}s`;
    
    fragment.appendChild(particle);
  }
  
  bgParticles.appendChild(fragment);
}

// Function to animate background particles with performance optimization
function animateBackgroundParticles() {
  // Skip animation during scrolling or when page isn't visible
  if (isScrolling || !isPageVisible) {
    backgroundParticlesId = requestAnimationFrame(animateBackgroundParticles);
    return;
  }
  
  const now = performance.now();
  // Only update if we have enough frame budget
  if (now - lastFrameTime >= FRAME_BUDGET * 2) { // Lower priority animation
    const particles = document.querySelectorAll('.particle');
    particles.forEach(particle => {
      // Skip animation for particles that are off-screen
      if (!isElementInViewport(particle)) return;
      
      // Apply subtle movement
      const x = Math.sin(now * 0.0001 + parseInt(particle.style.left)) * 3;
      const y = Math.cos(now * 0.0001 + parseInt(particle.style.top)) * 3;
      
      // Use translate3d for hardware acceleration
      particle.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    });
  }
  
  backgroundParticlesId = requestAnimationFrame(animateBackgroundParticles);
}

// Simulate loading resources
function simulateLoading(resourceCount) {
  let loadedResources = 0;
  const totalResources = resourceCount;
  
  // Simulate loading with exponential easing for more natural progress
  const loadResource = () => {
    loadedResources++;
    const progress = (loadedResources / totalResources) * 100;
    updateProgressCircle(progress);
    
    if (loadedResources < totalResources) {
      // Use variable timing with slower progress at the end
      const delay = Math.max(50, 100 - progress * 0.5 + Math.random() * 100);
      setTimeout(loadResource, delay);
    } else {
      completeLoading();
    }
  };
  
  // Start loading simulation
  loadResource();
}

// Complete the loading and transition to the main content
function completeLoading() {
  // Ensure the progress reaches 100% visually
  updateProgressCircle(100);
  
  // Wait a moment before hiding loader
  setTimeout(() => {
    const planetLoader = document.getElementById('planet-loader');
    if (planetLoader) {
      planetLoader.classList.add('hidden');
      
      // Stop animations once loading is complete
      if (orbitsAnimationId) {
        cancelAnimationFrame(orbitsAnimationId);
        orbitsAnimationId = null;
      }
      if (backgroundParticlesId) {
        cancelAnimationFrame(backgroundParticlesId);
        backgroundParticlesId = null;
      }
      
      // Start the typing animation in the terminal after loading
      setTimeout(() => {
        startTerminalAnimation();
      }, 800);
    }
  }, 500);
}

// Terminal typing animation function - optimized
function startTerminalAnimation() {
  // Skip animation if reduced motion is preferred
  if (isReducedMotion) {
    // Just show all text immediately instead
    const typingElements = document.querySelectorAll('.typing-animation');
    typingElements.forEach(element => {
      element.style.opacity = 1;
      element.classList.remove('typing-animation');
    });
    return;
  }
  
  const terminalOutput = document.querySelector('.terminal-output');
  if (!terminalOutput) return;
  
  const commandPrompt = document.querySelector('.command-prompt');
  if (commandPrompt) {
    commandPrompt.classList.add('active');
  }
  
  const typingElements = document.querySelectorAll('.typing-animation');
  let currentElementIndex = 0;
  
  const typeNextElement = () => {
    // Skip typing if user is scrolling
    if (isScrolling) {
      setTimeout(typeNextElement, 200);
      return;
    }
    
    if (currentElementIndex >= typingElements.length) return;
    
    const element = typingElements[currentElementIndex];
    if (!element) return;
    
    element.style.opacity = 1;
    const text = element.getAttribute('data-text') || element.textContent;
    element.textContent = '';
    
    // Type each character with a delay
    let charIndex = 0;
    
    const typeChar = () => {
      // Skip if element is no longer in DOM
      if (!document.body.contains(element)) return;
      
      // Skip typing if user is scrolling
      if (isScrolling) {
        setTimeout(typeChar, 50);
        return;
      }
      
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        
        // Variable typing speed for more natural effect
        const typingSpeed = Math.random() * 20 + 15;
        setTimeout(typeChar, typingSpeed);
      } else {
        // Move to next element
        currentElementIndex++;
        // Add delay between elements
        setTimeout(typeNextElement, 200);
      }
    };
    
    // Start typing the first character
    typeChar();
  };
  
  // Start typing animation
  setTimeout(typeNextElement, 300);
} 