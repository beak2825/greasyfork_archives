// ==UserScript==
// @name         HW star Theme
// @namespace    HW star Theme
// @version      1.0
// @description  Adds a custom background to the Hero Wars game rather than the normal
// @author       Hamizuse
// @license GPL-3.0
// @match        https://www.hero-wars.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hero-wars.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/549862/HW%20star%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/549862/HW%20star%20Theme.meta.js
// ==/UserScript==
(function() {
    const layout = document.querySelector('.layout');
    const layoutContent = document.querySelector('.layout_content');
    if (!layout || !layoutContent) return;

    // Set higher z-index for content
    layoutContent.style.position = 'relative';
    layoutContent.style.zIndex = '10';

    // Store original styles to restore later
    const originalStyles = {
        position: layout.style.position,
        overflow: layout.style.overflow,
        background: layout.style.background
    };

    // Set container styles
    layout.style.position = 'relative';
    layout.style.overflow = 'hidden';
    layout.style.background = 'linear-gradient(135deg, #0a0a2a, #000000, #0a0a2a)';

    // Create stars container
    const starsContainer = document.createElement('div');
    starsContainer.style.position = 'absolute';
    starsContainer.style.top = '0';
    starsContainer.style.left = '0';
    starsContainer.style.width = '100%';
    starsContainer.style.height = '100%';
    starsContainer.style.pointerEvents = 'none';
    starsContainer.style.zIndex = '1';

    // Create shooting stars container
    const shootingStarsContainer = document.createElement('div');
    shootingStarsContainer.style.position = 'absolute';
    shootingStarsContainer.style.top = '0';
    shootingStarsContainer.style.left = '0';
    shootingStarsContainer.style.width = '100%';
    shootingStarsContainer.style.height = '100%';
    shootingStarsContainer.style.pointerEvents = 'none';
    shootingStarsContainer.style.zIndex = '2';

    // Add containers to layout
    layout.appendChild(starsContainer);
    layout.appendChild(shootingStarsContainer);

    // Create stars
    const starCount = 200;
    const starColors = ['#ffffff', '#ffffdd', '#d0e8ff', '#ffddaa', '#e8f4ff', '#aaccff'];

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        const size = Math.random() * 3 + 1;
        const brightness = Math.random() * 0.7 + 0.3;
        const color = starColors[Math.floor(Math.random() * starColors.length)];

        star.style.position = 'absolute';
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.borderRadius = '50%';
        star.style.backgroundColor = color;
        star.style.opacity = brightness.toString();
        star.style.boxShadow = `0 0 ${size * 2}px ${size / 2}px rgba(255, 255, 255, ${brightness * 0.5})`;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;

        // Add twinkling animation
        const twinkleDuration = 2 + Math.random() * 5;
        star.style.animation = `twinkle ${twinkleDuration}s infinite ease-in-out`;
        star.style.animationDelay = `${Math.random() * 5}s`;

        starsContainer.appendChild(star);
    }

    // Create a shooting stars function with continuous looping
    function createShootingStar() {
        if (document.querySelector('.layout') !== layout) return;

        const shootingStar = document.createElement('div');
        const length = Math.random() * 80 + 50;
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        const angle = Math.random() * 25 + 15; // More natural shooting star angles
        const speed = Math.random() * 1000 + 800;

        shootingStar.style.position = 'absolute';
        shootingStar.style.width = `${length}px`;
        shootingStar.style.height = '3px';
        shootingStar.style.background = 'linear-gradient(90deg, rgba(255,255,255,0) 0%, #ffffff 50%, rgba(100,200,255,0.8) 100%)';
        shootingStar.style.transform = `rotate(${angle}deg)`;
        shootingStar.style.transformOrigin = 'left center';
        shootingStar.style.left = `${startX}%`;
        shootingStar.style.top = `${startY}%`;
        shootingStar.style.opacity = '0';
        shootingStar.style.boxShadow = '0 0 20px 3px rgba(150, 200, 255, 0.9)';

        shootingStarsContainer.appendChild(shootingStar);

        // Simple horizontal animation that definitely works
        const animation = shootingStar.animate([
            {
                opacity: 0,
                transform: `rotate(${angle}deg) translateX(-100px)`
            },
            {
                opacity: 1,
                transform: `rotate(${angle}deg) translateX(0)`
            },
            {
                opacity: 0.8,
                transform: `rotate(${angle}deg) translateX(200px)`
            },
            {
                opacity: 0,
                transform: `rotate(${angle}deg) translateX(400px)`
            }
        ], {
            duration: speed,
            easing: 'ease-out'
        });

        // Remove element after animation and create a new 
        animation.onfinish = () => {
            if (shootingStar.parentNode === shootingStarsContainer) {
                shootingStarsContainer.removeChild(shootingStar);
            }
            // Create another shooting star after a random delay
            setTimeout(createShootingStar, Math.random() * 1500 + 500);
        };
    }

    // Create multiple initial shooting stars
    for (let i = 0; i < 3; i++) {
        setTimeout(createShootingStar, i * 800);
    }

    // Add CSS for twinkling animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            25% { opacity: 0.8; transform: scale(1.1); }
            50% { opacity: 1; transform: scale(1.2); }
            75% { opacity: 0.6; transform: scale(1.05); }
        }
    `;
    document.head.appendChild(style);

    // Clean up after 10 seconds
    setTimeout(() => {
        if (document.querySelector('.layout') === layout) {
            layout.style.position = originalStyles.position;
            layout.style.overflow = originalStyles.overflow;
            layout.style.background = originalStyles.background;

            if (starsContainer.parentNode === layout) {
                layout.removeChild(starsContainer);
            }

            if (shootingStarsContainer.parentNode === layout) {
                layout.removeChild(shootingStarsContainer);
            }

            if (style.parentNode === document.head) {
                document.head.removeChild(style);
            }

            // Reset content z-index
            layoutContent.style.position = '';
            layoutContent.style.zIndex = '';
        }
    }, 10000);
})();