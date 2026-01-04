// ==UserScript==
// @name         Top and Down Scroll Buttons
// @description  Smooth scroll buttons for top and bottom of page
// @version      1.1
// @author       lunagus
// @license      MIT
// @include      *
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/1517518
// @downloadURL https://update.greasyfork.org/scripts/551565/Top%20and%20Down%20Scroll%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/551565/Top%20and%20Down%20Scroll%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Skip iframes
    if (window.self !== window.top) return;
    
    // Configuration
    const CONFIG = {
        speedClick: 500,        // Smooth scroll duration on click (ms)
        speedHover: 100,        // Continuous scroll speed on hover (ms)
        zIndex: 1001,           // Z-index for buttons
        scrollStep: 1,          // Pixels to scroll per interval on hover
        hideThreshold: 0        // Scroll position to show/hide buttons
    };
    
    // SVG icons (inline for better performance)
    const ICONS = {
        up: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cpath d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/%3E%3C/svg%3E',
        down: 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cpath d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/%3E%3C/svg%3E'
    };
    
    // Inject CSS
    const injectStyles = () => {
        const style = document.createElement('style');
        style.textContent = `
            .scroll-btn {
                position: fixed;
                right: 0;
                width: 40px;
                height: 40px;
                background: rgba(0, 0, 0, 0.7);
                border-radius: 5px 0 0 5px;
                cursor: pointer;
                opacity: 0.65;
                transition: opacity 0.3s ease, transform 0.2s ease;
                z-index: ${CONFIG.zIndex};
                display: flex;
                align-items: center;
                justify-content: center;
                user-select: none;
            }
            
            .scroll-btn:hover {
                opacity: 1;
                transform: translateX(-2px);
            }
            
            .scroll-btn:active {
                transform: translateX(-2px) scale(0.95);
            }
            
            .scroll-btn-up {
                bottom: calc(50% + 25px);
            }
            
            .scroll-btn-down {
                top: calc(50% + 25px);
            }
            
            .scroll-btn-hidden {
                display: none;
            }
            
            .scroll-btn img {
                width: 24px;
                height: 24px;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
    };
    
    // Easing function for smooth scroll
    const easeInOutQuad = (t, b, c, d) => {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    };
    
    // Smooth scroll to position
    const smoothScrollTo = (target, duration = CONFIG.speedClick) => {
        const start = window.pageYOffset || document.documentElement.scrollTop;
        const change = target - start;
        const increment = 20;
        let currentTime = 0;
        
        const animateScroll = () => {
            currentTime += increment;
            const val = easeInOutQuad(currentTime, start, change, duration);
            window.scrollTo(0, val);
            if (currentTime < duration) {
                requestAnimationFrame(animateScroll);
            }
        };
        
        animateScroll();
    };
    
    // Scroll animation class
    class ScrollAnimator {
        constructor() {
            this.animationFrame = null;
            this.direction = 0; // 0: stop, 1: up, -1: down
        }
        
        start(direction) {
            this.direction = direction;
            if (!this.animationFrame) {
                this.animate();
            }
        }
        
        stop() {
            this.direction = 0;
            if (this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
        }
        
        animate() {
            if (this.direction === 0) {
                this.animationFrame = null;
                return;
            }
            
            const currentPos = window.pageYOffset || document.documentElement.scrollTop;
            window.scrollTo(0, currentPos - this.direction * CONFIG.scrollStep);
            
            this.animationFrame = requestAnimationFrame(() => this.animate());
        }
    }
    
    // Button manager
    class ScrollButtons {
        constructor() {
            this.animator = new ScrollAnimator();
            this.upBtn = null;
            this.downBtn = null;
            this.init();
        }
        
        createButton(className, iconData) {
            const btn = document.createElement('div');
            btn.className = `scroll-btn ${className}`;
            
            const img = document.createElement('img');
            img.src = iconData;
            img.alt = className.includes('up') ? 'Scroll to top' : 'Scroll to bottom';
            
            btn.appendChild(img);
            return btn;
        }
        
        getDocumentHeight() {
            return Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
        }
        
        updateButtonVisibility() {
            const scrolled = window.pageYOffset || document.documentElement.scrollTop;
            const maxScroll = this.getDocumentHeight() - window.innerHeight;
            
            // Show/hide up button
            this.upBtn.classList.toggle('scroll-btn-hidden', scrolled <= CONFIG.hideThreshold);
            
            // Show/hide down button
            this.downBtn.classList.toggle('scroll-btn-hidden', scrolled >= maxScroll - 10);
        }
        
        init() {
            // Check if page is scrollable
            const isScrollable = this.getDocumentHeight() > window.innerHeight;
            if (!isScrollable) return;
            
            // Inject styles
            injectStyles();
            
            // Create buttons
            this.upBtn = this.createButton('scroll-btn-up', ICONS.up);
            this.downBtn = this.createButton('scroll-btn-down', ICONS.down);
            
            // Add event listeners for up button
            this.upBtn.addEventListener('mouseenter', () => this.animator.start(1));
            this.upBtn.addEventListener('mouseleave', () => this.animator.stop());
            this.upBtn.addEventListener('click', () => {
                this.animator.stop();
                smoothScrollTo(0);
            });
            
            // Add event listeners for down button
            this.downBtn.addEventListener('mouseenter', () => this.animator.start(-1));
            this.downBtn.addEventListener('mouseleave', () => this.animator.stop());
            this.downBtn.addEventListener('click', () => {
                this.animator.stop();
                smoothScrollTo(this.getDocumentHeight());
            });
            
            // Append to body
            document.body.appendChild(this.upBtn);
            document.body.appendChild(this.downBtn);
            
            // Initial visibility update
            this.updateButtonVisibility();
            
            // Update on scroll (throttled)
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                if (scrollTimeout) return;
                scrollTimeout = setTimeout(() => {
                    this.updateButtonVisibility();
                    scrollTimeout = null;
                }, 100);
            }, { passive: true });
            
            // Update on resize
            window.addEventListener('resize', () => {
                this.updateButtonVisibility();
            }, { passive: true });
        }
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => new ScrollButtons());
    } else {
        new ScrollButtons();
    }
})();