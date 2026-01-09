// ==UserScript==
// @name         JanitorAI Auto-Fill Continue (Fixed)
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Fills continue message with trailing space
// @match        https://janitorai.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558850/JanitorAI%20Auto-Fill%20Continue%20%28Fixed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558850/JanitorAI%20Auto-Fill%20Continue%20%28Fixed%29.meta.js
// ==/UserScript==
     
    (function() {
        'use strict';
     
        // Add a space at the end to bypass JanitorAI's validation
        const MESSAGE = "[Send me an emoji] ";
     
        function addButton() {
            // Remove old button if exists
            const oldBtn = document.getElementById('jai-auto-fill-fixed');
            if (oldBtn) oldBtn.remove();
     
            // Wait for textarea to exist
            const textarea = document.querySelector('textarea');
            if (!textarea) {
                setTimeout(addButton, 1000);
                return;
            }
     
            // Create button
            const btn = document.createElement('button');
            btn.id = 'jai-auto-fill-fixed';
            btn.innerHTML = '📝 Fill & Ready';
            btn.style.cssText = `
                position: fixed;
                bottom: 80px;
                right: 20px;
                padding: 12px 18px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                z-index: 9999;
                font-size: 14px;
                font-weight: bold;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: all 0.2s;
            `;
     
            // Hover effect
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'translateY(-2px)';
                btn.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.15)';
            });
     
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translateY(0)';
                btn.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
            });
     
            // Click handler
            btn.addEventListener('click', () => {
                // Set the message WITH trailing space
                textarea.value = MESSAGE;
                textarea.focus();
     
                // Trigger input event (makes send button activate)
                textarea.dispatchEvent(new Event('input', { bubbles: true }));
                textarea.dispatchEvent(new Event('change', { bubbles: true }));
     
                // Visual feedback
                btn.innerHTML = '✓ Ready to Send!';
                btn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
     
                // Highlight the textbox
                textarea.style.boxShadow = '0 0 0 2px #667eea';
                setTimeout(() => {
                    textarea.style.boxShadow = '';
                }, 1000);
     
                // Reset button after 3 seconds
                setTimeout(() => {
                    btn.innerHTML = '📝 Fill & Ready';
                    btn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                }, 3000);
     
                console.log('✅ Message filled with trailing space');
            });
     
            // Add to page
            document.body.appendChild(btn);
            console.log('✅ Fixed auto-fill button added');
        }
     
        // Start
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addButton);
        } else {
            addButton();
        }
     
        // Watch for page changes (JanitorAI is a single-page app)
        const observer = new MutationObserver(() => {
            if (!document.getElementById('jai-auto-fill-fixed')) {
                setTimeout(addButton, 500);
            }
        });
     
        observer.observe(document.body, { childList: true, subtree: true });
    })();