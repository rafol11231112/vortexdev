document.addEventListener('DOMContentLoaded', function() {
  // Create the background container if it doesn't exist
  let backgroundContainer = document.querySelector('.animated-background');
  if (!backgroundContainer) {
    backgroundContainer = document.createElement('div');
    backgroundContainer.className = 'animated-background';
    document.body.appendChild(backgroundContainer);
  }
  
  // Create dot container if it doesn't exist
  let dotContainer = backgroundContainer.querySelector('.dot-container');
  if (!dotContainer) {
    dotContainer = document.createElement('div');
    dotContainer.className = 'dot-container';
    backgroundContainer.appendChild(dotContainer);
  }
  
  // Configuration - more red dots
  const config = {
    dotCount: 25, // Increased for more visible red dots
    minSize: 3,
    maxSize: 6, // Larger dots
    minDuration: 20, // Faster movement
    maxDuration: 35,
    minOpacity: 0.3, // Higher opacity
    maxOpacity: 0.6
  };
  
  // Check if user prefers reduced motion
  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (isReducedMotion) {
    config.dotCount = 15;
    config.minDuration = 40;
    config.maxDuration = 50;
  }
  
  // Create dots
  createDots();
  
  function createDots() {
    // Clear existing dots to prevent duplicates
    dotContainer.innerHTML = '';
    
    // Create the main floating dots
    for (let i = 0; i < config.dotCount; i++) {
      createDot();
    }
    
    // Add more special dots for emphasis
    createSpecialDot('top-right', 5);
    createSpecialDot('bottom-left', 6);
    createSpecialDot('center-right', 7);
    createSpecialDot('center-left', 4);
    createSpecialDot('top-center', 6);
  }
  
  function createDot() {
    const dot = document.createElement('div');
    dot.className = 'bg-dot';
    
    // Random size - larger dots
    const size = config.minSize + Math.random() * (config.maxSize - config.minSize);
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    
    // Random position
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    dot.style.setProperty('--x', `${x}%`);
    dot.style.setProperty('--y', `${y}%`);
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    
    // Random animation duration
    const duration = config.minDuration + Math.random() * (config.maxDuration - config.minDuration);
    dot.style.setProperty('--duration', `${duration}s`);
    
    // Random opacity - higher for better visibility
    const opacity = config.minOpacity + Math.random() * (config.maxOpacity - config.minOpacity);
    dot.style.setProperty('--opacity', opacity);
    
    // Random delay
    const delay = Math.random() * 10;
    dot.style.animationDelay = `${delay}s`;
    
    // Add slight blur to some dots
    if (Math.random() > 0.6) {
      dot.style.filter = `blur(${Math.random() + 0.5}px)`;
    }
    
    dotContainer.appendChild(dot);
    
    // Remove and recreate the dot after animation cycle
    const lifespan = duration * 1.2;
    setTimeout(() => {
      dot.remove();
      createDot();
    }, lifespan * 1000);
  }
  
  function createSpecialDot(position, size) {
    const dot = document.createElement('div');
    dot.className = 'bg-dot special-dot';
    
    // Set size
    dot.style.width = `${size}px`;
    dot.style.height = `${size}px`;
    
    // Set position based on keyword
    let x, y;
    switch (position) {
      case 'top-right':
        x = 80 + Math.random() * 15;
        y = 5 + Math.random() * 10;
        break;
      case 'bottom-left':
        x = 5 + Math.random() * 10;
        y = 80 + Math.random() * 15;
        break;
      case 'center-right':
        x = 85 + Math.random() * 10;
        y = 40 + Math.random() * 20;
        break;
      case 'center-left':
        x = 5 + Math.random() * 10;
        y = 40 + Math.random() * 20;
        break;
      case 'top-center':
        x = 40 + Math.random() * 20;
        y = 5 + Math.random() * 10;
        break;
      default:
        x = Math.random() * 100;
        y = Math.random() * 100;
    }
    
    dot.style.setProperty('--x', `${x}%`);
    dot.style.setProperty('--y', `${y}%`);
    dot.style.left = `${x}%`;
    dot.style.top = `${y}%`;
    
    // Longer animation duration for special dots
    const duration = 30 + Math.random() * 10;
    dot.style.setProperty('--duration', `${duration}s`);
    
    // Higher opacity for special dots
    dot.style.setProperty('--opacity', 0.6);
    
    // Brighter glow effect
    dot.style.boxShadow = `0 0 15px rgba(255, 0, 0, 0.7)`;
    
    // Random delay
    const delay = Math.random() * 5;
    dot.style.animationDelay = `${delay}s`;
    
    dotContainer.appendChild(dot);
  }
}); 