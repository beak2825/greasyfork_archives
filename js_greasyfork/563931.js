// ==UserScript==
// @name        Scamalytics IP Auto-fill
// @namespace   Violentmonkey Scripts
// @match       https://scamalytics.com/*
// @grant       none
// @version     1.0
// @author      -
// @description Adds a button to fetch and auto-fill your current IP address
// @downloadURL https://update.greasyfork.org/scripts/563931/Scamalytics%20IP%20Auto-fill.user.js
// @updateURL https://update.greasyfork.org/scripts/563931/Scamalytics%20IP%20Auto-fill.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for the page to load
    function init() {
        const ipInput = document.querySelector('input[name="ip"]');
        
        if (!ipInput) {
            return;
        }

        // Create the button
        const fetchButton = document.createElement('button');
        fetchButton.textContent = 'Get My IP';
        fetchButton.type = 'button';
        fetchButton.style.cssText = `
            margin-left: 8px;
            padding: 8px 16px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
            transition: background-color 0.3s;
        `;

        // Hover effect
        fetchButton.onmouseover = () => {
            fetchButton.style.backgroundColor = '#45a049';
        };
        fetchButton.onmouseout = () => {
            fetchButton.style.backgroundColor = '#4CAF50';
        };

        // Click handler to fetch IP
        fetchButton.onclick = async () => {
            fetchButton.textContent = 'Loading...';
            fetchButton.disabled = true;
            
            try {
                // Multiple fallback APIs for maximum reliability
                let ip = null;
                
                // Try ipapi.co first
                try {
                    const response = await fetch('https://ipapi.co/json/');
                    const data = await response.json();
                    ip = data.ip;
                } catch (e) {
                    // Fallback to api64.ipify.org
                    try {
                        const response = await fetch('https://api64.ipify.org?format=json');
                        const data = await response.json();
                        ip = data.ip;
                    } catch (e2) {
                        // Fallback to icanhazip.com
                        try {
                            const response = await fetch('https://icanhazip.com');
                            ip = (await response.text()).trim();
                        } catch (e3) {
                            // Fallback to ipinfo.io
                            try {
                                const response = await fetch('https://ipinfo.io/json');
                                const data = await response.json();
                                ip = data.ip;
                            } catch (e4) {
                                // Final fallback to ident.me
                                const response = await fetch('https://ident.me');
                                ip = (await response.text()).trim();
                            }
                        }
                    }
                }
                
                if (ip) {
                    ipInput.value = ip;
                    fetchButton.textContent = '✓ IP Loaded';
                    fetchButton.style.backgroundColor = '#2196F3';
                    
                    // Reset button after 2 seconds
                    setTimeout(() => {
                        fetchButton.textContent = 'Get My IP';
                        fetchButton.style.backgroundColor = '#4CAF50';
                        fetchButton.disabled = false;
                    }, 2000);
                } else {
                    throw new Error('No IP returned');
                }
            } catch (error) {
                console.error('Error fetching IP:', error);
                fetchButton.textContent = '✗ Error';
                fetchButton.style.backgroundColor = '#f44336';
                
                // Reset button after 2 seconds
                setTimeout(() => {
                    fetchButton.textContent = 'Get My IP';
                    fetchButton.style.backgroundColor = '#4CAF50';
                    fetchButton.disabled = false;
                }, 2000);
            }
        };

        // Insert button after the input field
        ipInput.parentNode.insertBefore(fetchButton, ipInput.nextSibling);
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();