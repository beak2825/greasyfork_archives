// ==UserScript==
// @name         Hero wars Sky
// @namespace    Hero wars Sky
// @version      1.0
// @description  Try to see space!
// @author       Hamizuse
// @match        https://www.hero-wars.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=hero-wars.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549943/Hero%20wars%20Sky.user.js
// @updateURL https://update.greasyfork.org/scripts/549943/Hero%20wars%20Sky.meta.js
// ==/UserScript==

(function() {
// Get the layout container
const layout = document.querySelector('.layout');

// Create stars container
const starsContainer = document.createElement('div');
starsContainer.style.position = 'absolute';
starsContainer.style.top = '0';
starsContainer.style.left = '0';
starsContainer.style.width = '100%';
starsContainer.style.height = '100%';
starsContainer.style.overflow = 'hidden';
starsContainer.style.zIndex = '0';
starsContainer.style.pointerEvents = 'none';

// Set layout container styles
layout.style.position = 'relative';
layout.style.backgroundColor = '#0a0e29';
layout.style.backgroundImage = 'linear-gradient(to bottom, #0a0e29, #1a1f4b, #2d2a6d)';
layout.style.minHeight = '100vh';
layout.style.color = '#ffffff';
layout.style.fontFamily = "'Arial', sans-serif";
layout.style.overflow = 'hidden';

// Create stars
function createStars() {
    const starCount = 200;

    for (let i = 0; i < starCount; i++) {
        const star = document.createElement('div');
        star.style.position = 'absolute';
        star.style.backgroundColor = '#ffffff';
        star.style.borderRadius = '50%';

        // Random position
        const left = Math.random() * 100;
        const top = Math.random() * 100;
        star.style.left = `${left}%`;
        star.style.top = `${top}%`;

        // Random size (1-3px)
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;

        // Random opacity and animation delay
        const opacity = Math.random() * 0.8 + 0.2;
        const delay = Math.random() * 5;

        star.style.opacity = opacity;
        star.style.animation = `twinkle ${Math.random() * 3 + 2}s infinite ${delay}s`;

        starsContainer.appendChild(star);
    }
}

// Add CSS for twinkling animation
const style = document.createElement('style');
style.textContent = `
    @keyframes twinkle {
        0%, 100% {
            opacity: 0.2;
            transform: scale(1);
        }
        50% {
            opacity: 1;
            transform: scale(1.2);
        }
    }

    .layout::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 200px;
        background: linear-gradient(to bottom, rgba(10, 14, 41, 0.8), transparent);
        z-index: 1;
    }

    .layout::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 200px;
        background: linear-gradient(to top, rgba(10, 14, 41, 0.8), transparent);
        z-index: 1;
    }

    .layout > * {
        position: relative;
        z-index: 2;
    }
`;
document.head.appendChild(style);

// Create and add stars
createStars();
layout.appendChild(starsContainer);

// Add some shooting stars occasionally
function createShootingStar() {
    const shootingStar = document.createElement('div');
    shootingStar.style.position = 'absolute';
    shootingStar.style.backgroundColor = '#ffffff';
    shootingStar.style.height = '2px';
    shootingStar.style.width = '0px';
    shootingStar.style.boxShadow = '0 0 10px 2px rgba(255, 255, 255, 0.8)';
    shootingStar.style.borderRadius = '50%';

    const startX = Math.random() * 100;
    const startY = Math.random() * 30;
    const angle = Math.random() * 30 + 15;

    shootingStar.style.left = `${startX}%`;
    shootingStar.style.top = `${startY}%`;
    shootingStar.style.transform = `rotate(${angle}deg)`;

    starsContainer.appendChild(shootingStar);

    // Animate shooting star
    shootingStar.animate([
        {
            width: '0px',
            opacity: 0
        },
        {
            width: '100px',
            opacity: 1
        },
        {
            width: '0px',
            opacity: 0
        }
    ], {
        duration: 2000,
        easing: 'ease-out'
    }).onfinish = () => {
        starsContainer.removeChild(shootingStar);
    };
}

// Create shooting stars at random intervals
setInterval(() => {
    if (Math.random() > 0.7) {
        createShootingStar();
    }
}, 3000);

// Add some content styling for better visibility
const contentElements = layout.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, span');
contentElements.forEach(el => {
    el.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.3)';
});

console.log('Night theme with twinkling stars applied to layout container!');
})();