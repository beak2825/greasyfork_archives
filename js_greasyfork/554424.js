// ==UserScript==
// @name         Papanad Quick Links (Mobile Friendly)
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds persistent draggable navigation box to Torn.com (desktop & mobile) with neon red styling, toggle functionality, and position memory
// @author       SharmZ
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554424/Papanad%20Quick%20Links%20%28Mobile%20Friendly%29.user.js
// @updateURL https://update.greasyfork.org/scripts/554424/Papanad%20Quick%20Links%20%28Mobile%20Friendly%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const isPDA = window.location.href.includes('pda.php') || document.querySelector('.pda-version');

    // Get stored position or use default (mobile-friendly defaults)
    const savedPosition = JSON.parse(localStorage.getItem('papanadNavPosition') || 'null');
    const defaultPosition = isMobile || isPDA ? {
        x: window.innerWidth - 150,
        y: window.innerHeight - 220
    } : {
        x: window.innerWidth - 160,
        y: window.innerHeight - 180
    };
    
    const position = savedPosition || defaultPosition;
    const isMenuOpen = localStorage.getItem('papanadNavOpen') !== 'false';

    // Create the container div with mobile-friendly sizing
    const navBox = document.createElement('div');
    navBox.id = 'torn-quick-nav';
    navBox.style.position = 'fixed';
    navBox.style.left = `${position.x}px`;
    navBox.style.top = `${position.y}px`;
    navBox.style.backgroundColor = '#000';
    navBox.style.border = '1px solid #FF0033';
    navBox.style.borderRadius = '5px';
    navBox.style.padding = isMobile || isPDA ? '10px' : '8px';
    navBox.style.zIndex = '9999';
    navBox.style.fontFamily = 'Arial, sans-serif';
    navBox.style.color = '#fff';
    navBox.style.boxShadow = '0 0 10px rgba(255, 0, 51, 0.7)';
    navBox.style.width = isMobile || isPDA ? '160px' : '140px';
    navBox.style.cursor = 'move';
    navBox.style.transition = 'all 0.3s ease';
    navBox.style.userSelect = 'none';
    navBox.style.touchAction = 'none'; // Prevent touch scrolling interference

    // Mobile-specific styling adjustments
    if (isMobile || isPDA) {
        navBox.style.transform = 'scale(1.05)';
        navBox.style.transformOrigin = 'center';
    }

    // Create the content with mobile-friendly sizing
    navBox.innerHTML = `
        <div id="nav-toggle" style="font-weight: bold; margin-bottom: ${isMobile || isPDA ? '6px' : '4px'}; text-align: center; color: #66ff00; cursor: move; user-select: none; font-size: ${isMobile || isPDA ? '14px' : '13px'}; padding: ${isMobile || isPDA ? '4px' : '2px'};">
            QUICK NAV ${isMenuOpen ? '▼' : '►'}
        </div>
        <div id="nav-links" style="${isMenuOpen ? 'display: flex;' : 'display: none;'} flex-direction: column; gap: ${isMobile || isPDA ? '4px' : '2px'};">
            <a href="https://www.torn.com/index.php"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};">Home</a>
            <a href="https://www.torn.com/factions.php?step=your"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};">My Faction</a>
            <a href="https://www.torn.com/item.php"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};">Items</a>
            <a href="https://www.torn.com/page.php?sid=stocks"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};">Stocks</a>
            <a href="https://www.torn.com/page.php?sid=crimes#/"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};">Crimes</a>
            <a href="https://www.torn.com/gym.php"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};">Gym</a>
            <a href="https://www.torn.com/page.php?sid=racing"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};">Raceway</a>
            <a href="https://www.torn.com/page.php?sid=travel"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};">Travel</a>
            <a href="https://www.torn.com/bazaar.php"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};">My Bazaar</a>
            <a href="https://www.weav3r.dev/dollar-bazaars"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};" target="_blank">$1 Items</a>
            <a href="https://ffscouter.com/target-finder"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};" target="_blank">Target Finder</a>
            <a href="https://www.torn.com/factions.php?step=your&type=1#/tab=armoury&start=0&sub=medical"
               style="color: #66ff00; text-decoration: none; padding: ${isMobile || isPDA ? '5px 8px' : '2px 4px'}; border-radius: ${isMobile || isPDA ? '4px' : '2px'}; background: rgba(255, 0, 51, 0.2); transition: all 0.2s; font-size: ${isMobile || isPDA ? '14px' : '12px'};">Med Armory</a>
        </div>
    `;

    // Add hover/touch effects
    const style = document.createElement('style');
    style.textContent = `
        #torn-quick-nav a {
            touch-action: manipulation;
        }
        #torn-quick-nav a:hover, #torn-quick-nav a:active {
            background: rgba(255, 0, 51, 0.4) !important;
            transform: translateX(3px);
        }
        #nav-toggle {
            touch-action: manipulation;
        }
        #nav-toggle:hover, #nav-toggle:active {
            text-shadow: 0 0 5px #66ff00;
        }
        #torn-quick-nav {
            transition: none !important;
        }
        @media (hover: none) {
            #torn-quick-nav a:hover {
                background: rgba(255, 0, 51, 0.3) !important;
            }
        }
    `;
    document.head.appendChild(style);

    // Drag functionality variables
    let isDragging = false;
    let offsetX, offsetY;
    let lastTapTime = 0;
    const doubleTapDelay = 300; // ms

    // Add drag functionality for both mouse and touch
    const header = navBox.querySelector('#nav-toggle');
    header.style.cursor = 'move';

    // Common function to handle start of drag
    function startDrag(clientX, clientY) {
        isDragging = true;
        offsetX = clientX - navBox.getBoundingClientRect().left;
        offsetY = clientY - navBox.getBoundingClientRect().top;
        navBox.style.cursor = 'grabbing';
        navBox.style.opacity = '0.9';
    }

    // Mouse events
    header.addEventListener('mousedown', function(e) {
        startDrag(e.clientX, e.clientY);
        e.preventDefault();
    });

    // Touch events for mobile
    header.addEventListener('touchstart', function(e) {
        // Handle double tap for toggle on mobile
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTapTime;
        if (tapLength < doubleTapDelay && tapLength > 0) {
            // Double tap detected - toggle menu
            const isOpen = document.querySelector('#nav-links').style.display !== 'none';
            document.querySelector('#nav-links').style.display = isOpen ? 'none' : 'flex';
            document.querySelector('#nav-toggle').textContent = `QUICK NAV ${isOpen ? '►' : '▼'}`;
            localStorage.setItem('papanadNavOpen', isOpen ? 'false' : 'true');
            e.preventDefault();
            return;
        }
        lastTapTime = currentTime;

        // Single tap and hold - start drag
        if (e.touches.length === 1) {
            startDrag(e.touches[0].clientX, e.touches[0].clientY);
            e.preventDefault();
        }
    }, { passive: false });

    // Common function to handle drag movement
    function moveDrag(clientX, clientY) {
        if (!isDragging) return;
        
        // Calculate new position
        let newX = clientX - offsetX;
        let newY = clientY - offsetY;
        
        // Keep within viewport boundaries with padding
        const padding = isMobile || isPDA ? 15 : 10;
        newX = Math.max(padding, Math.min(newX, window.innerWidth - navBox.offsetWidth - padding));
        newY = Math.max(padding, Math.min(newY, window.innerHeight - navBox.offsetHeight - padding));
        
        // Update position
        navBox.style.left = `${newX}px`;
        navBox.style.top = `${newY}px`;
        navBox.style.right = 'auto';
        navBox.style.bottom = 'auto';
    }

    // Mouse move
    document.addEventListener('mousemove', function(e) {
        moveDrag(e.clientX, e.clientY);
    });

    // Touch move
    document.addEventListener('touchmove', function(e) {
        if (!isDragging) return;
        e.preventDefault(); // Prevent scrolling while dragging
        if (e.touches.length === 1) {
            moveDrag(e.touches[0].clientX, e.touches[0].clientY);
        }
    }, { passive: false });

    // Common function to handle end of drag
    function endDrag() {
        if (isDragging) {
            // Save position to localStorage
            const rect = navBox.getBoundingClientRect();
            localStorage.setItem('papanadNavPosition', JSON.stringify({
                x: rect.left,
                y: rect.top
            }));
            
            isDragging = false;
            navBox.style.cursor = 'move';
            navBox.style.opacity = '1';
        }
    }

    // Mouse up
    document.addEventListener('mouseup', endDrag);

    // Touch end
    document.addEventListener('touchend', endDrag);

    // Add to page
    document.body.appendChild(navBox);
})();