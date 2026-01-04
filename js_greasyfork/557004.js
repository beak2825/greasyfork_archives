// ==UserScript==
// @name         Green Tools ESP😎
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Mobile-optimized Player ESP for iPad - Green Tools Edition
// @author       Green Tools
// @match        https://narrow.one/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=narrow.one
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557004/Green%20Tools%20ESP%F0%9F%98%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/557004/Green%20Tools%20ESP%F0%9F%98%8E.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isESPActive = false;
    let originalNameProperty = null;
    let touchCount = 0;
    let lastTouchTime = 0;

    function initMobileESP() {
        console.log('Green Tools ESP - Mobile Edition Loaded');
        createTouchActivator();
        document.addEventListener('keydown', handleKeyPress);
        showMobileInstructions();
    }

    function createTouchActivator() {
        const activator = document.createElement('div');
        activator.innerHTML = '🎮';
        activator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            background: rgba(0, 150, 0, 0.8);
            border: 2px solid #00ff00;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 24px;
            color: white;
            z-index: 10000;
            cursor: pointer;
            user-select: none;
            box-shadow: 0 0 15px rgba(0, 255, 0, 0.5);
        `;

        activator.addEventListener('touchstart', handleTouchActivation, { passive: true });
        activator.addEventListener('touchend', (e) => e.preventDefault(), { passive: false });
        
        document.body.appendChild(activator);
    }

    function handleTouchActivation(e) {
        e.preventDefault();
        const currentTime = Date.now();
        
        if (currentTime - lastTouchTime < 500) {
            touchCount++;
            if (touchCount >= 2) {
                toggleESP();
                touchCount = 0;
            }
        } else {
            touchCount = 1;
        }
        
        lastTouchTime = currentTime;

        e.target.style.transform = 'scale(0.9)';
        setTimeout(() => {
            e.target.style.transform = 'scale(1)';
        }, 100);
    }

    function handleKeyPress(e) {
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            toggleESP();
        }
        
        if (e.key === 'F1') {
            e.preventDefault();
            showMobileInstructions();
        }
    }

    function toggleESP() {
        if (!isESPActive) {
            enableESP();
        } else {
            disableESP();
        }
    }

    function enableESP() {
        if (isESPActive) return;

        try {
            if (!originalNameProperty) {
                originalNameProperty = Object.getOwnPropertyDescriptor(Object.prototype, 'name');
            }

            Object.defineProperty(Object.prototype, 'name', {
                get() {
                    return this._name;
                },
                set(v) {
                    this._name = v;
                    if (v === 'player') {
                        setTimeout(() => removeDepthTest(this.material), 10);
                    }
                },
                configurable: true
            });

            scanExistingPlayers();

            isESPActive = true;
            showMobileNotification('ESP Activated', 'success');
            
            console.log('Green Tools ESP - ACTIVATED');

        } catch (error) {
            console.warn('ESP Activation failed:', error);
            showMobileNotification('ESP Activation Failed', 'error');
        }
    }

    function disableESP() {
        if (!isESPActive) return;

        try {
            if (originalNameProperty) {
                Object.defineProperty(Object.prototype, 'name', originalNameProperty);
            } else {
                delete Object.prototype.name;
            }

            isESPActive = false;
            showMobileNotification('ESP Deactivated', 'info');
            
            console.log('Green Tools ESP - DEACTIVATED');

        } catch (error) {
            console.warn('ESP Deactivation failed:', error);
        }
    }

    function removeDepthTest(material) {
        if (!material) return;
        
        try {
            if (Array.isArray(material)) {
                material.forEach(mat => {
                    if (mat && typeof mat === 'object') {
                        mat.depthTest = false;
                    }
                });
            } else if (typeof material === 'object') {
                material.depthTest = false;
            }
        } catch (e) {
        }
    }

    function scanExistingPlayers() {
        setTimeout(() => {
            try {
                const objects = Object.values(window).filter(obj => 
                    obj && typeof obj === 'object' && obj.name === 'player'
                );
                
                objects.forEach(obj => {
                    setTimeout(() => removeDepthTest(obj.material), Math.random() * 100);
                });
            } catch (e) {
            }
        }, 1000);
    }

    function showMobileNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.textContent = message;
        
        const colors = {
            success: 'rgba(0, 150, 0, 0.9)',
            error: 'rgba(150, 0, 0, 0.9)',
            info: 'rgba(0, 100, 150, 0.9)'
        };
        
        notification.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${colors[type] || colors.info};
            color: white;
            padding: 12px 16px;
            border-radius: 10px;
            font-size: 14px;
            font-weight: bold;
            z-index: 10001;
            max-width: 250px;
            text-align: center;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 2px solid #00ff00;
            opacity: 0;
            transform: translateX(100px);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100px)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    function showMobileInstructions() {
        const instructions = `
Green Tools ESP - iPad Edition

How to Use:
• Double-tap the 🎮 icon to toggle ESP
• Connect a keyboard and press Ctrl+E or Cmd+E
• F1 key shows this help

Status: ${isESPActive ? 'ACTIVE' : 'INACTIVE'}
        `.trim();
        
        alert(instructions);
    }

    function addAntiDetection() {
        window['_gt_' + Math.random().toString(36).substr(2, 9)] = true;
        setTimeout(initMobileESP, Math.random() * 3000 + 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addAntiDetection);
    } else {
        addAntiDetection();
    }

    window.addEventListener('beforeunload', () => {
        if (isESPActive) {
            disableESP();
        }
    });

})();