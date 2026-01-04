// ==UserScript==
// @name         YouTube Floating Video Player
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Creates a floating YouTube video player that opens in new tab
// @author       Arkina Romeon
// @match        https://*.youtube.com/watch?v=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/556829/YouTube%20Floating%20Video%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/556829/YouTube%20Floating%20Video%20Player.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Wait for page to load
    window.addEventListener('load', function() {
        // Create floating button
        const floatBtn = document.createElement('button');
        floatBtn.innerHTML = '🎬';
        floatBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: #ff0000;
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transition: all 0.3s ease;
        `;
        
        // Add hover effects
        floatBtn.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.background = '#cc0000';
        });
        
        floatBtn.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.background = '#ff0000';
        });
        
        // Add click handler
        floatBtn.addEventListener('click', function() {
            openVideoInNewTab();
        });
        
        // Add touch support for mobile
        floatBtn.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            this.style.background = '#cc0000';
        });
        
        floatBtn.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.style.transform = 'scale(1)';
            this.style.background = '#ff0000';
            openVideoInNewTab();
        });
        
        document.body.appendChild(floatBtn);
        
        function openVideoInNewTab() {
            // Get current video ID
            const urlParams = new URLSearchParams(window.location.search);
            const videoId = urlParams.get('v');
            
            if (videoId) {
                // Create embed URL
                const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;
                
                // Open in new tab
                const newTab = window.open(embedUrl, '_blank');
                
                if (newTab) {
                    // Focus the new tab
                    newTab.focus();
                } else {
                    // Fallback if popup blocked
                    alert('Popup blocked! Please allow popups for this site.');
                }
            }
        }
        
        // Add keyboard shortcut (F for float)
        document.addEventListener('keydown', function(e) {
            if (e.key === 'F' || e.key === 'f') {
                if (!e.ctrlKey && !e.altKey && !e.metaKey) {
                    e.preventDefault();
                    openVideoInNewTab();
                }
            }
        });
        
        // Make button draggable on desktop
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        floatBtn.addEventListener('mousedown', dragStart);
        document.addEventListener('mousemove', drag);
        document.addEventListener('mouseup', dragEnd);
        
        function dragStart(e) {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === floatBtn) {
                isDragging = true;
            }
        }
        
        function drag(e) {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                xOffset = currentX;
                yOffset = currentY;
                
                setTranslate(currentX, currentY, floatBtn);
            }
        }
        
        function setTranslate(xPos, yPos, el) {
            el.style.transform = `translate(${xPos}px, ${yPos}px) scale(1)`;
        }
        
        function dragEnd() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
        
        // Mobile drag support
        floatBtn.addEventListener('touchstart', function(e) {
            const touch = e.touches[0];
            initialX = touch.clientX - xOffset;
            initialY = touch.clientY - yOffset;
            isDragging = true;
        });
        
        document.addEventListener('touchmove', function(e) {
            if (isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                currentX = touch.clientX - initialX;
                currentY = touch.clientY - initialY;
                
                xOffset = currentX;
                yOffset = currentY;
                
                setTranslate(currentX, currentY, floatBtn);
            }
        });
        
        document.addEventListener('touchend', function() {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        });
    });
})();