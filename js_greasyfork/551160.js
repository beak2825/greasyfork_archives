// ==UserScript==
// @name         FarmRPG Borgen Chest Revealer
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license      MIT
// @description  Reveals items in Borgen treasure chests on FarmRPG
// @author       Your Name
// @match        https://farmrpg.com/*
// @match        http://farmrpg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551160/FarmRPG%20Borgen%20Chest%20Revealer.user.js
// @updateURL https://update.greasyfork.org/scripts/551160/FarmRPG%20Borgen%20Chest%20Revealer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Wait for page to load
    window.addEventListener('load', function() {
        // Check if we're on the Borgen chest page
        if (document.querySelector('h2:contains("CHOOSE A CHEST")')) {
            revealChestContents();
        }
    });

    function revealChestContents() {
        // Try multiple methods to find chest contents
        
        // Method 1: Look for chest data in global variables
        setTimeout(function() {
            // Check common variable names that might contain chest data
            const possibleVars = ['chestData', 'borgenChests', 'chests', 'gameData', 'currentChests'];
            
            for (const varName of possibleVars) {
                if (window[varName]) {
                    console.log(`Found ${varName}:`, window[varName]);
                    displayChestContents(window[varName], varName);
                }
            }
            
            // Method 2: Look for chest elements and try to extract data
            const chestElements = document.querySelectorAll('[class*="chest"], [id*="chest"], .btn, button');
            chestElements.forEach((chest, index) => {
                if (chest.textContent.includes('Chest') || chest.innerHTML.includes('chest')) {
                    extractChestData(chest, index);
                }
            });
            
            // Method 3: Monitor network requests for chest data
            overrideXHR();
            
        }, 2000); // Wait 2 seconds for page to fully initialize
    }

    function extractChestData(chestElement, index) {
        // Try to find data attributes
        const dataAttributes = chestElement.attributes;
        for (let attr of dataAttributes) {
            if (attr.name.includes('data') && (attr.value.includes('item') || attr.value.includes('reward'))) {
                console.log(`Chest ${index + 1} data attribute:`, attr.name, '=', attr.value);
                createTooltip(chestElement, attr.value);
            }
        }
        
        // Try to find onclick handlers that might contain item data
        if (chestElement.onclick) {
            const onclickStr = chestElement.onclick.toString();
            if (onclickStr.includes('item') || onclickStr.includes('reward')) {
                console.log(`Chest ${index + 1} onclick:`, onclickStr);
                parseOnclickData(chestElement, onclickStr);
            }
        }
        
        // Check for href attributes with data
        if (chestElement.href && chestElement.href.includes('item')) {
            console.log(`Chest ${index + 1} href:`, chestElement.href);
            parseHrefData(chestElement, chestElement.href);
        }
    }

    function displayChestContents(data, source) {
        // Create overlay to show chest contents
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0,0,0,0.9);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-family: Arial, sans-serif;
            max-width: 400px;
            border: 2px solid gold;
        `;
        
        overlay.innerHTML = `
            <h3 style="color: gold; margin-top: 0;">Borgen Chest Contents</h3>
            <p><strong>Source:</strong> ${source}</p>
            <pre style="background: #333; padding: 10px; border-radius: 5px; overflow: auto; max-height: 300px;">${JSON.stringify(data, null, 2)}</pre>
            <button onclick="this.parentElement.remove()" style="background: #ff4444; color: white; border: none; padding: 5px 10px; border-radius: 3px; cursor: pointer;">Close</button>
        `;
        
        document.body.appendChild(overlay);
    }

    function createTooltip(element, content) {
        element.style.position = 'relative';
        
        const tooltip = document.createElement('div');
        tooltip.style.cssText = `
            position: absolute;
            bottom: 100%;
            left: 50%;
            transform: translateX(-50%);
            background: black;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            white-space: nowrap;
            z-index: 1000;
            border: 1px solid gold;
            font-size: 12px;
            display: none;
        `;
        tooltip.textContent = `Contains: ${content}`;
        
        element.appendChild(tooltip);
        
        element.addEventListener('mouseenter', function() {
            tooltip.style.display = 'block';
        });
        
        element.addEventListener('mouseleave', function() {
            tooltip.style.display = 'none';
        });
    }

    function parseOnclickData(element, onclickStr) {
        // Simple parsing for common patterns
        const itemMatch = onclickStr.match(/item[^']*'([^']+)'/);
        const rewardMatch = onclickStr.match(/reward[^']*'([^']+)'/);
        
        if (itemMatch) {
            createTooltip(element, itemMatch[1]);
        } else if (rewardMatch) {
            createTooltip(element, rewardMatch[1]);
        }
    }

    function parseHrefData(element, hrefStr) {
        const urlParams = new URLSearchParams(hrefStr.split('?')[1]);
        const item = urlParams.get('item');
        const reward = urlParams.get('reward');
        
        if (item) {
            createTooltip(element, item);
        } else if (reward) {
            createTooltip(element, reward);
        }
    }

    function overrideXHR() {
        const originalOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(method, url) {
            this.addEventListener('load', function() {
                if (url.includes('chest') || url.includes('borgen') || url.includes('open') || url.includes('reward')) {
                    try {
                        const response = JSON.parse(this.responseText);
                        console.log('XHR Chest Data:', response);
                        if (response.items || response.rewards) {
                            displayChestContents(response, `XHR: ${url}`);
                        }
                    } catch (e) {
                        // Response might not be JSON
                    }
                }
            });
            originalOpen.apply(this, arguments);
        };
    }

    // Also override fetch requests
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            if (args[0].includes('chest') || args[0].includes('borgen') || args[0].includes('open') || args[0].includes('reward')) {
                response.clone().json().then(data => {
                    console.log('Fetch Chest Data:', data);
                    if (data.items || data.rewards) {
                        displayChestContents(data, `Fetch: ${args[0]}`);
                    }
                }).catch(() => {});
            }
            return response;
        });
    };

    // Add a button to manually trigger chest detection
    const manualButton = document.createElement('button');
    manualButton.textContent = 'Reveal Chest Contents';
    manualButton.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        z-index: 9999;
        background: #4CAF50;
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 12px;
    `;
    manualButton.onclick = revealChestContents;
    document.body.appendChild(manualButton);

    console.log('FarmRPG Borgen Chest Revealer loaded');
})();