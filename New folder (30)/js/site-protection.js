/**
 * Vortex Website Protection
 * Advanced security measures to prevent unauthorized copying and access
 */

(function() {
    'use strict';
    
    // ======= INITIALIZE PROTECTION =======
    const securityConfig = {
        enableRightClickProtection: false,
        enableConsoleProtection: true,
        enableSourceProtection: true,
        enableDevToolsProtection: true,
        enablePrintProtection: true,
        enableSaveProtection: true,
        enableWatermark: true,
        enableObfuscation: true,
        enableTamperDetection: true
    };
    
    // ======= RIGHT CLICK PROTECTION =======
    // Right-click is now disabled in the config
    
    // ======= CONSOLE MESSAGE PROTECTION =======
    if (securityConfig.enableConsoleProtection) {
        // Override console methods
        const consoleWarning = "⚠️ WARNING: This website is protected. Unauthorized access is prohibited.";
        const originalConsole = {
            log: console.log,
            warn: console.warn,
            error: console.error,
            info: console.info,
            debug: console.debug
        };
        
        console.log = function() {
            originalConsole.warn(consoleWarning);
            // originalConsole.log.apply(console, arguments);
        };
        
        console.warn = function() {
            originalConsole.warn(consoleWarning);
            // originalConsole.warn.apply(console, arguments);
        };
        
        console.error = function() {
            originalConsole.warn(consoleWarning);
            // originalConsole.error.apply(console, arguments);
        };
        
        console.info = function() {
            originalConsole.warn(consoleWarning);
            // originalConsole.info.apply(console, arguments);
        };
        
        console.debug = function() {
            originalConsole.warn(consoleWarning);
            // originalConsole.debug.apply(console, arguments);
        };
        
        // Log once to show warning
        console.log("Access attempt logged");
    }
    
    // ======= SOURCE CODE PROTECTION =======
    if (securityConfig.enableSourceProtection) {
        // Add obfuscation layer to page
        function obfuscateSource() {
            // Add a large number of hidden comments to make source harder to read
            for (let i = 0; i < 500; i++) {
                const comment = document.createComment('Security Layer ' + Math.random().toString(36).substring(2, 15));
                document.body.appendChild(comment);
            }
            
            // Add decoy elements with misleading IDs
            for (let i = 0; i < 10; i++) {
                const decoy = document.createElement('div');
                decoy.id = 'protected-content-' + Math.random().toString(36).substring(2, 15);
                decoy.style.position = 'absolute';
                decoy.style.opacity = '0';
                decoy.style.pointerEvents = 'none';
                decoy.innerHTML = '<div>This website is protected by advanced security measures.</div>';
                document.body.appendChild(decoy);
            }
        }
        
        // Run obfuscation
        if (securityConfig.enableObfuscation) {
            obfuscateSource();
            
            // Re-apply obfuscation periodically in case DOM is modified
            setInterval(obfuscateSource, 15000);
        }
    }
    
    // ======= ADVANCED DEVTOOLS DETECTION =======
    if (securityConfig.enableDevToolsProtection) {
        // Method 1: Check window properties
        function checkDevTools() {
            const threshold = 160;
            
            // Method 1: Size comparison
            if (window.outerWidth - window.innerWidth > threshold || 
                window.outerHeight - window.innerHeight > threshold) {
                handleUnauthorizedAccess();
                return true;
            }
            
            // Method 2: Check orientation of debugger
            try {
                const mediaQuery = window.matchMedia('(min-width: 0px)');
                const oldValue = mediaQuery.matches;
                mediaQuery.matches = !oldValue;
                const orientationChanged = mediaQuery.matches !== oldValue;
                mediaQuery.matches = oldValue; // Reset
                
                if (orientationChanged) {
                    handleUnauthorizedAccess();
                    return true;
                }
            } catch (e) {}
            
            // Method 3: Check console timings
            const startTime = performance.now();
            console.log("%c", "font-size:1px; padding:" + 1e7 + "px; line-height: " + 1e7 + "px;");
            console.clear();
            if (performance.now() - startTime > 100) {
                handleUnauthorizedAccess();
                return true;
            }
            
            return false;
        }
        
        // Run DevTools check periodically
        let detectionInterval = setInterval(function() {
            checkDevTools();
        }, 1000);
    }
    
    // ======= PRINT PROTECTION =======
    if (securityConfig.enablePrintProtection) {
        window.addEventListener('beforeprint', function(e) {
            e.preventDefault();
            alert('Printing is disabled for security reasons.');
            return false;
        });
        
        // Disable Ctrl+P
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                return false;
            }
        });
    }
    
    // ======= SAVE PROTECTION =======
    if (securityConfig.enableSaveProtection) {
        // Disable Ctrl+S
        document.addEventListener('keydown', function(e) {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                return false;
            }
        });
    }
    
    // ======= TAMPER DETECTION =======
    if (securityConfig.enableTamperDetection) {
        // Set up observers to detect DOM changes
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    // Check if security-critical elements were removed
                    if (mutation.removedNodes.length > 0) {
                        Array.from(mutation.removedNodes).forEach(function(node) {
                            if (node.className && 
                                (node.className.includes('content-watermark') || 
                                 node.className.includes('protection'))) {
                                // Reapply protection if tampered with
                                createWatermark();
                            }
                        });
                    }
                }
            });
        });
        
        // Start observing the document
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // ======= HANDLE UNAUTHORIZED ACCESS =======
    function handleUnauthorizedAccess() {
        // Override entire page with a warning
        document.body.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100vh; background: #000; color: #ff0000; display: flex; flex-direction: column; justify-content: center; align-items: center; text-align: center; font-family: Arial, sans-serif; z-index: 99999;">
                <h1 style="font-size: 28px; margin-bottom: 20px;">UNAUTHORIZED ACCESS DETECTED</h1>
                <p style="font-size: 18px; max-width: 80%;">This website is protected by advanced security measures.</p>
                <p style="font-size: 16px; margin-top: 20px;">Your IP address and details have been logged.</p>
                <button style="margin-top: 30px; padding: 10px 20px; background: #ff0000; color: white; border: none; cursor: pointer;" onclick="window.location.reload()">Return to Site</button>
            </div>
        `;
        
        // Log access attempt
        try {
            localStorage.setItem('security_violation', Date.now());
            sessionStorage.setItem('security_violation', Date.now());
        } catch (e) {}
    }
    
    // ======= CREATE WATERMARK =======
    function createWatermark() {
        if (!securityConfig.enableWatermark) return;
        
        const existingWatermark = document.querySelector('.content-watermark');
        if (existingWatermark) return;
        
        const watermark = document.createElement('div');
        watermark.className = 'content-watermark';
        watermark.style.position = 'fixed';
        watermark.style.top = '0';
        watermark.style.left = '0';
        watermark.style.width = '100%';
        watermark.style.height = '100%';
        watermark.style.zIndex = '1000';
        watermark.style.pointerEvents = 'none';
        watermark.style.userSelect = 'none';
        
        // Create a more complex watermark pattern
        for (let i = 0; i < 10; i++) {
            for (let j = 0; j < 20; j++) {
                const mark = document.createElement('div');
                mark.textContent = 'VORTEX';
                mark.style.position = 'absolute';
                mark.style.left = (5 + j * 10) + '%';
                mark.style.top = (10 + i * 8) + '%';
                mark.style.transform = 'rotate(-30deg)';
                mark.style.color = 'rgba(255, 0, 0, 0.02)';
                mark.style.fontSize = '12px';
                mark.style.fontWeight = 'bold';
                mark.style.fontFamily = 'Arial, sans-serif';
                mark.style.letterSpacing = '2px';
                watermark.appendChild(mark);
            }
        }
        
        document.body.appendChild(watermark);
    }
    
    // Create watermark at startup
    if (securityConfig.enableWatermark) {
        document.addEventListener('DOMContentLoaded', function() {
            createWatermark();
            
            // Recreate watermark periodically in case it's removed
            setInterval(createWatermark, 3000);
        });
    }
    
    // ======= INITIALIZATION MESSAGE =======
    console.warn("🔒 Advanced Protection System Active");
})(); 