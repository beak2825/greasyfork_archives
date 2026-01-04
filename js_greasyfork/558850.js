// ==UserScript==
// @name         JanitorAI Mobile & Desktop Continue
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Works on both mobile and desktop
// @match        https://janitorai.com/*
// @match        https://www.janitorai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558850/JanitorAI%20Mobile%20%20Desktop%20Continue.user.js
// @updateURL https://update.greasyfork.org/scripts/558850/JanitorAI%20Mobile%20%20Desktop%20Continue.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    const MESSAGE = "[Continue the story. I give you permission to control my character as well.] ";
    
    // More robust textarea finder for mobile
    function findTextarea() {
        // Try multiple selectors for different JanitorAI versions
        const selectors = [
            'textarea',
            'input[type="text"]',
            'div[contenteditable="true"]',
            '[role="textbox"]',
            '.chat-input',
            'input',
            'div[class*="input"]',
            'div[class*="text"]'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element && (element.tagName === 'TEXTAREA' || 
                           element.tagName === 'INPUT' || 
                           element.isContentEditable)) {
                return element;
            }
        }
        
        // Last resort: look for anything that looks like a text input
        const allElements = document.querySelectorAll('*');
        for (const el of allElements) {
            if (el.tagName === 'TEXTAREA' || 
                (el.tagName === 'INPUT' && el.type === 'text') ||
                el.isContentEditable) {
                return el;
            }
        }
        
        return null;
    }
    
    function addButton() {
        const btnId = 'jai-mobile-btn';
        if (document.getElementById(btnId)) return;
        
        const btn = document.createElement('button');
        btn.id = btnId;
        btn.innerHTML = '📝 Fill Continue';
        
        // Mobile-responsive styling
        btn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 20px;
            padding: 16px 22px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 50px;
            cursor: pointer;
            z-index: 999999;
            font-size: 16px;
            font-weight: bold;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
            touch-action: manipulation;
            -webkit-tap-highlight-color: transparent;
            min-width: 140px;
            text-align: center;
        `;
        
        // Make it bigger on mobile
        if (window.innerWidth <= 768) {
            btn.style.padding = '20px 24px';
            btn.style.fontSize = '18px';
            btn.style.bottom = '120px';
            btn.style.minWidth = '160px';
        }
        
        btn.addEventListener('click', () => {
            const textInput = findTextarea();
            
            if (!textInput) {
                alert('No text input found! Try opening the keyboard first.');
                return;
            }
            
            // Focus first
            textInput.focus();
            
            // Different handling for different element types
            if (textInput.isContentEditable) {
                // For contenteditable divs (common on mobile)
                textInput.innerHTML = MESSAGE;
                textInput.textContent = MESSAGE;
            } else {
                // For textarea/input
                textInput.value = MESSAGE;
            }
            
            // Trigger all possible events
            const events = ['input', 'change', 'keyup', 'keydown', 'keypress', 'blur', 'focus'];
            events.forEach(eventType => {
                textInput.dispatchEvent(new Event(eventType, { bubbles: true }));
            });
            
            // Visual feedback
            btn.innerHTML = '✓ Filled!';
            btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
            
            // Try to open mobile keyboard if needed
            if (window.innerWidth <= 768) {
                textInput.focus();
                setTimeout(() => {
                    // Trigger a click to ensure focus on some mobile browsers
                    textInput.click();
                }, 100);
            }
            
            console.log('✅ Message filled on mobile/desktop');
            
            // Reset button
            setTimeout(() => {
                btn.innerHTML = '📝 Fill Continue';
                btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            }, 2000);
        });
        
        // Touch events for better mobile
        btn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            btn.style.transform = 'scale(0.95)';
        });
        
        btn.addEventListener('touchend', (e) => {
            e.preventDefault();
            btn.style.transform = 'scale(1)';
        });
        
        document.body.appendChild(btn);
        console.log('✅ Mobile-compatible button added');
    }
    
    // Wait for page to load
    function init() {
        // Wait longer on mobile
        const delay = window.innerWidth <= 768 ? 3000 : 1500;
        setTimeout(addButton, delay);
        
        // Also try when URL changes (SPA navigation)
        let lastUrl = location.href;
        setInterval(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                setTimeout(addButton, 1000);
            }
        }, 500);
    }
    
    // Start
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();