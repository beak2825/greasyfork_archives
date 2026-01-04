// ==UserScript==
// @name         Auto-Click Event Details Buttons
// @namespace    https://pagywosg.xyz/
// @version      1.1
// @description  Automatically clicks "Collapse Description" and "Me" buttons on Event Details page. Source code and development: https://github.com/palharesf/user_scripts
// @author       palharesf
// @license      MIT
// @match        https://pagywosg.xyz/events*
// @grant        none
//
// Changelog:
// v1.1 - Added polling to wait for dynamic content
// v1.0 - Initial release
// @downloadURL https://update.greasyfork.org/scripts/550163/Auto-Click%20Event%20Details%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/550163/Auto-Click%20Event%20Details%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to show popup messages
    function showPopup(message, isError = false) {
        const popup = document.createElement('div');
        popup.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${isError ? '#ff4444' : '#44aa44'};
            color: white;
            padding: 15px 20px;
            border-radius: 5px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            font-family: Arial, sans-serif;
            font-size: 14px;
            max-width: 300px;
            word-wrap: break-word;
        `;
        popup.textContent = message;
        document.body.appendChild(popup);
        
        // Auto-remove popup after 4 seconds
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 4000);
    }

    // Function to wait for buttons to appear and then click them
    function waitForButtonsAndClick() {
        let attempts = 0;
        const maxAttempts = 20; // 10 seconds total (20 attempts × 500ms)
        
        function checkForButtons() {
            attempts++;
            console.log(`Attempt ${attempts}/${maxAttempts}: Looking for buttons...`);
            
            const collapseButton = document.querySelector('.event-detail__btn-collapse');
            const meButton = document.querySelector('.utable__link-me');
            
            // If both buttons are found, click them
            if (collapseButton && meButton) {
                console.log('✓ Both buttons found! Clicking...');
                collapseButton.click();
                console.log('✓ Clicked Collapse Description button');
                
                meButton.click();
                console.log('✓ Clicked Me button');
                
                showPopup('✓ Successfully clicked both buttons!');
                return; // Stop checking
            }
            
            // If we've reached max attempts, give up
            if (attempts >= maxAttempts) {
                console.log('✗ Timeout: Buttons not found after 10 seconds');
                
                let foundButtons = [];
                if (collapseButton) foundButtons.push('Collapse Description');
                if (meButton) foundButtons.push('Me');
                
                if (foundButtons.length > 0) {
                    showPopup(`✓ Found: ${foundButtons.join(', ')}\n✗ Still missing some buttons`, true);
                } else {
                    showPopup('✗ Unable to find either button after 10 seconds', true);
                }
                return;
            }
            
            // Keep checking every 500ms
            setTimeout(checkForButtons, 500);
        }
        
        // Start checking immediately
        checkForButtons();
    }

    // Wait for basic HTML to load, then start looking for buttons
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForButtonsAndClick);
    } else {
        waitForButtonsAndClick();
    }

    console.log('🚀 Auto-Click Event Details Userscript loaded');

})();