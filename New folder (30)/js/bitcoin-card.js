document.addEventListener('DOMContentLoaded', () => {
  // Get the card elements
  const cryptoCards = document.querySelectorAll('.crypto-card');
  const bitcoinCard = document.getElementById('bitcoin-card-container');
  const ethereumCard = document.getElementById('ethereum-card-container');
  const usdtCard = document.getElementById('usdt-card-container');
  
  // Get the card faces
  const bitcoinFace = bitcoinCard.querySelector('.coin-face');
  const ethereumFace = ethereumCard.querySelector('.coin-face');
  const usdtFace = usdtCard.querySelector('.coin-face');
  
  // Price update elements
  const bitcoinPrice = bitcoinCard.querySelector('.coin-price');
  const bitcoinChange = bitcoinCard.querySelector('.coin-change span');
  const ethereumPrice = ethereumCard.querySelector('.coin-price');
  const ethereumChange = ethereumCard.querySelector('.coin-change span');
  const usdtPrice = usdtCard.querySelector('.coin-price');
  const usdtChange = usdtCard.querySelector('.coin-change span');
  
  // Performance monitoring
  let isScrolling = false;
  let scrollTimeout;
  let isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let lastFrameTime = 0;
  const FRAME_THRESHOLD = 1000 / 30; // Limit to 30 fps
  
  // Initialize prices and percentages
  const prices = {
    bitcoin: ['$61,245.78', '$61,302.94', '$61,178.25', '$61,350.12', '$61,290.55'],
    ethereum: ['$3,487.12', '$3,502.35', '$3,468.90', '$3,520.15', '$3,495.22'],
    usdt: ['$1.00', '$1.001', '$0.999', '$1.00', '$1.002']
  };
  
  const percentages = {
    bitcoin: ['+5.8%', '+5.9%', '+5.7%', '+6.0%', '+5.8%'],
    ethereum: ['+3.2%', '+3.5%', '+3.0%', '+3.7%', '+3.3%'],
    usdt: ['+0.01%', '+0.02%', '+0.00%', '+0.01%', '+0.02%']
  };
  
  let priceIndices = {
    bitcoin: 0,
    ethereum: 0,
    usdt: 0
  };
  
  // Current active card
  let activeCard = bitcoinCard;
  let isCardAnimating = false;

  // Initialize the card functionality
  initCardStack();
  
  // Begin price updates for all cards
  startPriceUpdates();
  
  // Debounce function for better performance
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
  
  // Throttle function to limit function calls
  function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
      if (!inThrottle) {
        func(...args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }
  
  // Track scrolling for performance optimization
  window.addEventListener('scroll', () => {
    isScrolling = true;
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 100);
  });
  
  // Initialize the card stack interactions
  function initCardStack() {
    // Add click event to each card
    cryptoCards.forEach(card => {
      card.addEventListener('click', debounce(function() {
        // Only respond if this isn't the active card and not currently animating
        if (card !== activeCard && !isCardAnimating) {
          // Remove active class from current active card
          cryptoCards.forEach(c => c.classList.remove('active'));
          
          // Set animating flag
          isCardAnimating = true;
          
          // Reset all cards to their original transforms first
          resetCardPositions();
          
          // Set the clicked card as active after a short delay
          setTimeout(() => {
            // Add active class to the clicked card
            card.classList.add('active');
            
            // Update active card reference
            activeCard = card;
            
            // Reposition the other cards based on new active card
            updateCardPositions();
            
            // Clear animating flag
            setTimeout(() => {
              isCardAnimating = false;
            }, 800);
          }, 50);
        }
      }, 300)); // Debounce for better performance
      
      // Mouse over/leave events for 3D effect
      card.addEventListener('mouseenter', () => {
        // Pause the floating animation
        card.style.animation = 'none';
      });
      
      card.addEventListener('mousemove', throttle(handleMouseMove, FRAME_THRESHOLD));
      
      card.addEventListener('mouseleave', () => {
        const innerCard = card.querySelector('.crypto-card-inner');
        const glow = card.querySelector('.card-glow');
        
        // Reset card transform
        innerCard.style.transform = 'rotateX(5deg) rotateY(-5deg)';
        
        // Reset glow
        if (glow) {
          glow.style.transform = 'translate(0, 0)';
          glow.style.opacity = '0.3';
        }
        
        // Restore the floating animation if applicable
        card.style.animation = card === activeCard ? 'none' : 'floatCard 6s ease-in-out infinite';
      });
    });
  }
  
  // Handle mouse movement for 3D effect with performance optimization
  function handleMouseMove(e) {
    // Skip if scrolling for performance
    if (isScrolling) return;
    
    // Throttle by using requestAnimationFrame
    requestAnimationFrame(() => {
      const now = performance.now();
      if (now - lastFrameTime < FRAME_THRESHOLD) return;
      lastFrameTime = now;
      
      const card = e.currentTarget;
      const innerCard = card.querySelector('.crypto-card-inner');
      const glow = card.querySelector('.card-glow');
      
      const rect = card.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate mouse position relative to center
      const mouseX = e.clientX - centerX;
      const mouseY = e.clientY - centerY;
      
      // Calculate rotation (max 15 degrees)
      const rotateY = mouseX * (isReducedMotion ? 0.03 : 0.08);
      const rotateX = -mouseY * (isReducedMotion ? 0.03 : 0.08);
      
      // Apply rotation with hardware acceleration hint
      innerCard.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      innerCard.style.willChange = 'transform';
      
      // Move glow effect if present with optimized performance
      if (glow) {
        const glowX = (mouseX / rect.width) * (isReducedMotion ? 15 : 30);
        const glowY = (mouseY / rect.height) * (isReducedMotion ? 15 : 30);
        glow.style.transform = `translate(${glowX}px, ${glowY}px)`;
        glow.style.opacity = '0.5';
      }
    });
  }
  
  // Reset all cards to default positions
  function resetCardPositions() {
    // Use transform3d for hardware acceleration
    bitcoinCard.style.transform = 'translate3d(0, 0, 0) scale(1)';
    ethereumCard.style.transform = 'translate3d(0, 0, 0) scale(1)';
    usdtCard.style.transform = 'translate3d(0, 0, 0) scale(1)';
    
    bitcoinCard.style.opacity = '1';
    ethereumCard.style.opacity = '1';
    usdtCard.style.opacity = '1';
    
    bitcoinCard.style.zIndex = '1';
    ethereumCard.style.zIndex = '1';
    usdtCard.style.zIndex = '1';
  }
  
  // Update card positions based on active card
  function updateCardPositions() {
    if (activeCard === bitcoinCard) {
      bitcoinCard.style.transform = 'translate3d(0, 0, 0) rotateY(0) scale(1)';
      bitcoinCard.style.zIndex = '3';
      bitcoinCard.style.opacity = '1';
      
      ethereumCard.style.transform = 'translate3d(-25px, -15px, 0) rotateY(-8deg) scale(0.97)';
      ethereumCard.style.zIndex = '2';
      ethereumCard.style.opacity = '0.9';
      
      usdtCard.style.transform = 'translate3d(-50px, -30px, 0) rotateY(-16deg) scale(0.94)';
      usdtCard.style.zIndex = '1';
      usdtCard.style.opacity = '0.8';
    } 
    else if (activeCard === ethereumCard) {
      ethereumCard.style.transform = 'translate3d(0, 0, 0) rotateY(0) scale(1)';
      ethereumCard.style.zIndex = '3';
      ethereumCard.style.opacity = '1';
      
      bitcoinCard.style.transform = 'translate3d(20px, -10px, 0) rotateY(5deg) scale(0.97)';
      bitcoinCard.style.zIndex = '2';
      bitcoinCard.style.opacity = '0.9';
      
      usdtCard.style.transform = 'translate3d(-20px, -20px, 0) rotateY(-5deg) scale(0.94)';
      usdtCard.style.zIndex = '1';
      usdtCard.style.opacity = '0.8';
    }
    else if (activeCard === usdtCard) {
      usdtCard.style.transform = 'translate3d(0, 0, 0) rotateY(0) scale(1)';
      usdtCard.style.zIndex = '3';
      usdtCard.style.opacity = '1';
      
      ethereumCard.style.transform = 'translate3d(20px, -10px, 0) rotateY(5deg) scale(0.97)';
      ethereumCard.style.zIndex = '2';
      ethereumCard.style.opacity = '0.9';
      
      bitcoinCard.style.transform = 'translate3d(40px, -20px, 0) rotateY(10deg) scale(0.94)';
      bitcoinCard.style.zIndex = '1';
      bitcoinCard.style.opacity = '0.8';
    }
    
    // Add will-change hint for hardware acceleration
    cryptoCards.forEach(card => {
      card.style.willChange = 'transform, opacity';
      // Remove will-change after animation completes to free GPU memory
      setTimeout(() => {
        card.style.willChange = 'auto';
      }, 1000);
    });
  }
  
  // Start price updates for all cryptocurrencies
  function startPriceUpdates() {
    const updateInterval = isReducedMotion ? 8000 : 5000;
    
    // Update Bitcoin price
    setInterval(() => {
      // Skip updates when scrolling or not visible
      if (isScrolling || document.visibilityState !== 'visible') return;
      updatePrice('bitcoin', bitcoinPrice, bitcoinChange);
    }, updateInterval);
    
    // Update Ethereum price with a 2-second offset
    setTimeout(() => {
      setInterval(() => {
        // Skip updates when scrolling or not visible
        if (isScrolling || document.visibilityState !== 'visible') return;
        updatePrice('ethereum', ethereumPrice, ethereumChange);
      }, updateInterval);
    }, 2000);
    
    // Update USDT price with a 3.5-second offset
    setTimeout(() => {
      setInterval(() => {
        // Skip updates when scrolling or not visible
        if (isScrolling || document.visibilityState !== 'visible') return;
        updatePrice('usdt', usdtPrice, usdtChange);
      }, updateInterval);
    }, 3500);
  }
  
  // Update price for a specific cryptocurrency
  function updatePrice(crypto, priceElement, percentElement) {
    priceIndices[crypto] = (priceIndices[crypto] + 1) % prices[crypto].length;
    
    // Skip animation if reduced motion or scrolling
    if (isReducedMotion || isScrolling) {
      priceElement.textContent = prices[crypto][priceIndices[crypto]];
      percentElement.textContent = percentages[crypto][priceIndices[crypto]];
      return;
    }
    
    // Add animation class
    priceElement.classList.add('price-update');
    
    // Update the price and percentage after a short delay
    setTimeout(() => {
      priceElement.textContent = prices[crypto][priceIndices[crypto]];
      percentElement.textContent = percentages[crypto][priceIndices[crypto]];
    }, 500);
    
    // Remove animation class after animation completes
    setTimeout(() => {
      priceElement.classList.remove('price-update');
    }, 1000);
  }
}); 