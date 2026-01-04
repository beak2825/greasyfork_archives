// ==UserScript==
// @name         Facebook Profanity Filter
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replace offensive words in Facebook posts and comments
// @author       You
// @match        https://www.facebook.com/*
// @match        https://web.facebook.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548967/Facebook%20Profanity%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/548967/Facebook%20Profanity%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // // Facebook Profanity Filter Replacement Script
(function() {
    'use strict';
    
    // Configuration
    const config = {
        enabled: true,
        showNotifications: true,
        autoReplace: false,
        caseSensitive: false
    };
    
    // Word replacement mapping
    const wordReplacements = {
        'shit': 'sh1t',
        'fuck': 'f*ck',
        'asshole': 'a$$hole',
        'bitch': 'b1tch',
        'damn': 'd*mn',
        'crap': 'cr@p',
        'hell': 'h*ll',
        'dick': 'd*ck',
        'piss': 'p*ss',
        'bastard': 'b*stard',
        'retard': 'r*tard',
        'slut': 'sl*t',
        'whore': 'wh*re',
        'nigger': 'n*gger',
        'fag': 'f*g',
        'goddamn': 'g*dd*mn'
    };
    
    // DOM elements to monitor for Facebook
    const targetSelectors = [
        'div[contenteditable="true"]',
        'textarea[placeholder*="Write a comment"]',
        'textarea[placeholder*="What\'s on your mind"]',
        'input[type="text"]'
    ];
    
    let isProcessing = false;
    
    // Initialize the script
    function init() {
        console.log('Facebook Profanity Filter initialized');
        setupMutationObserver();
        setupEventListeners();
    }
    
    // Set up mutation observer to detect new contenteditable elements
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {
                    setupEventListeners();
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    // Set up event listeners for input fields
    function setupEventListeners() {
        targetSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(element => {
                if (!element.hasAttribute('data-profanity-listener')) {
                    element.setAttribute('data-profanity-listener', 'true');
                    
                    // Listen for input events
                    element.addEventListener('input', handleInput);
                    
                    // Listen for blur events (when user leaves the field)
                    element.addEventListener('blur', handleBlur);
                    
                    // Listen for paste events
                    element.addEventListener('paste', handlePaste);
                }
            });
        });
    }
    
    // Handle input events
    function handleInput(event) {
        if (!config.enabled || isProcessing) return;
        
        const element = event.target;
        setTimeout(() => {
            processText(element);
        }, 100);
    }
    
    // Handle blur events
    function handleBlur(event) {
        if (!config.enabled) return;
        processText(event.target);
    }
    
    // Handle paste events
    function handlePaste(event) {
        if (!config.enabled) return;
        
        setTimeout(() => {
            processText(event.target);
        }, 100);
    }
    
    // Process text for profanity
    function processText(element) {
        if (isProcessing) return;
        
        isProcessing = true;
        let text = element.textContent || element.value;
        let originalText = text;
        
        // Process each word replacement
        Object.keys(wordReplacements).forEach(badWord => {
            const replacement = wordReplacements[badWord];
            const regex = new RegExp(`\\b${badWord}\\b`, config.caseSensitive ? 'g' : 'gi');
            
            if (regex.test(text)) {
                text = text.replace(regex, replacement);
                
                // Show notification if text was changed
                if (text !== originalText && config.showNotifications) {
                    showNotification(`Replaced "${badWord}" with "${replacement}"`);
                }
            }
        });
        
        // Update the element if changes were made
        if (text !== originalText) {
            if (element.contentEditable === 'true') {
                element.textContent = text;
                // Move cursor to end
                const range = document.createRange();
                range.selectNodeContents(element);
                range.collapse(false);
                const selection = window.getSelection();
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                element.value = text;
            }
            
            // Trigger input event for Facebook to detect changes
            const inputEvent = new Event('input', { bubbles: true });
            element.dispatchEvent(inputEvent);
        }
        
        isProcessing = false;
    }
    
    // Show notification to user
    function showNotification(message) {
        // Remove existing notification if any
        const existingNotification = document.getElementById('profanity-notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        const notification = document.createElement('div');
        notification.id = 'profanity-notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4267B2;
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            z-index: 10000;
            font-family: Helvetica, Arial, sans-serif;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
            animation: slideIn 0.3s ease;
        `;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
        
        // Add CSS animations
        addNotificationStyles();
    }
    
    // Add CSS styles for notifications
    function addNotificationStyles() {
        if (!document.getElementById('profanity-styles')) {
            const style = document.createElement('style');
            style.id = 'profanity-styles';
            style.textContent = `
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes slideOut {
                    from { transform: translateX(0); opacity: 1; }
                    to { transform: translateX(100%); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Create control panel for user settings
    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'profanity-control-panel';
        panel.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: white;
            border: 1px solid #ddd;
            padding: 15px;
            border-radius: 8px;
            z-index: 9999;
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            font-family: Helvetica, Arial, sans-serif;
            min-width: 200px;
        `;
        
        panel.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #4267B2;">Profanity Filter</h3>
            <label style="display: block; margin-bottom: 10px;">
                <input type="checkbox" id="profanity-enabled" ${config.enabled ? 'checked' : ''}>
                Enable Filter
            </label>
            <label style="display: block; margin-bottom: 10px;">
                <input type="checkbox" id="profanity-notifications" ${config.showNotifications ? 'checked' : ''}>
                Show Notifications
            </label>
            <button id="profanity-close" style="margin-top: 10px; padding: 5px 10px; background: #4267B2; color: white; border: none; border-radius: 4px; cursor: pointer;">
                Close
            </button>
        `;
        
        document.body.appendChild(panel);
        
        // Add event listeners
        document.getElementById('profanity-enabled').addEventListener('change', (e) => {
            config.enabled = e.target.checked;
        });
        
        document.getElementById('profanity-notifications').addEventListener('change', (e) => {
            config.showNotifications = e.target.checked;
        });
        
        document.getElementById('profanity-close').addEventListener('click', () => {
            panel.remove();
        });
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
    
    // Expose functions to global scope for manual control
    window.ProfanityFilter = {
        enable: () => config.enabled = true,
        disable: () => config.enabled = false,
        showPanel: createControlPanel,
        addWord: (word, replacement) => wordReplacements[word] = replacement,
        removeWord: (word) => delete wordReplacements[word]
    };
    
})();
})();