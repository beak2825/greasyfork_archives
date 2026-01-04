// ==UserScript==
// @name         UltimateServer Decoder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Decode service names on ultimateserver.org
// @author       MidniteRyder
// @match        https://www.ultimateserver.org/*
// @match        https://ultimateserver.org/*
// @match        https://ps.freshticks.xyz/*
// @match        https://thelink.icu/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556935/UltimateServer%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/556935/UltimateServer%20Decoder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default settings
    const defaultSettings = {
        vpsMode: 'transparent', // 'remove', 'transparent', or 'keep'
        enabled: true
    };

    // Get current settings
    let settings = {
        vpsMode: GM_getValue('vpsMode', defaultSettings.vpsMode),
        enabled: GM_getValue('enabled', defaultSettings.enabled)
    };

    // Mapping definitions
    const wordMappings = {
        'Earth': 'Emby',
        'Water': 'Jellyfin',
        'Fire': 'Plex',
        'Wind': 'XXX',
        'Dark': 'Music / Books',
        'Mainline': 'Movies / TV'
    };

    const twoLetterMappings = {
        'EM': 'Emby',
        'PL': 'Plex',
        'JF': 'Jellyfin'
    };

    const singleLetterMappings = {
        'P': 'Plex',
        'E': 'Emby',
        'J': 'Jellyfin'
    };

    const specialMappings = {
        'm': 'Music',
        'b': 'Books',
        'x': 'XXX'
    };

    // Create settings menu
    function createSettingsUI() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 10000;
            display: flex;
            justify-content: center;
            align-items: center;
        `;

        const panel = document.createElement('div');
        panel.style.cssText = `
            background: #1a1a1a;
            color: #fff;
            padding: 25px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
            min-width: 400px;
            font-family: Arial, sans-serif;
        `;

        panel.innerHTML = `
            <h2 style="margin-top: 0; color: #4CAF50;">UltimateServer Decoder Settings</h2>
            
            <div style="margin: 20px 0;">
                <label style="display: block; margin-bottom: 5px;">
                    <input type="checkbox" id="decoderEnabled" ${settings.enabled ? 'checked' : ''}>
                    Enable Decoder
                </label>
            </div>

            <div style="margin: 20px 0;">
                <label style="display: block; margin-bottom: 10px; font-weight: bold;">VPS Display Mode:</label>
                <label style="display: block; margin: 5px 0;">
                    <input type="radio" name="vpsMode" value="keep" ${settings.vpsMode === 'keep' ? 'checked' : ''}>
                    Keep "VPS" visible
                </label>
                <label style="display: block; margin: 5px 0;">
                    <input type="radio" name="vpsMode" value="transparent" ${settings.vpsMode === 'transparent' ? 'checked' : ''}>
                    Make "VPS" transparent
                </label>
                <label style="display: block; margin: 5px 0;">
                    <input type="radio" name="vpsMode" value="remove" ${settings.vpsMode === 'remove' ? 'checked' : ''}>
                    Remove "VPS" completely
                </label>
            </div>

            <div style="margin-top: 25px; display: flex; gap: 10px;">
                <button id="saveSettings" style="
                    padding: 10px 20px;
                    background: #4CAF50;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                ">Save & Reload</button>
                <button id="cancelSettings" style="
                    padding: 10px 20px;
                    background: #666;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                ">Cancel</button>
            </div>
        `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // Event listeners
        document.getElementById('saveSettings').addEventListener('click', () => {
            settings.enabled = document.getElementById('decoderEnabled').checked;
            settings.vpsMode = document.querySelector('input[name="vpsMode"]:checked').value;
            
            GM_setValue('enabled', settings.enabled);
            GM_setValue('vpsMode', settings.vpsMode);
            
            location.reload();
        });

        document.getElementById('cancelSettings').addEventListener('click', () => {
            document.body.removeChild(overlay);
        });

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                document.body.removeChild(overlay);
            }
        });
    }

    // Register menu command
    GM_registerMenuCommand('Decoder Settings', createSettingsUI);

    // Add floating settings button to page
    function addFloatingButton() {
        const button = document.createElement('button');
        button.innerHTML = '⚙️';
        button.title = 'Decoder Settings';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: #4CAF50;
            color: white;
            border: none;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            transition: transform 0.2s, background 0.2s;
        `;
        
        button.addEventListener('mouseover', () => {
            button.style.transform = 'scale(1.1)';
            button.style.background = '#45a049';
        });
        
        button.addEventListener('mouseout', () => {
            button.style.transform = 'scale(1)';
            button.style.background = '#4CAF50';
        });
        
        button.addEventListener('click', createSettingsUI);
        
        document.body.appendChild(button);
    }

    // Only run decoder if enabled
    if (!settings.enabled) {
        // Still show settings button even when disabled
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', addFloatingButton);
        } else {
            addFloatingButton();
        }
        return;
    }

    // Track processed nodes to avoid re-processing
    const processedNodes = new WeakSet();

    // Function to decode text
    function decodeText(text) {
        let decoded = text;

        // Replace full words (case-insensitive but preserve case in output)
        Object.keys(wordMappings).forEach(key => {
            const regex = new RegExp(`\\b${key}\\b`, 'gi');
            decoded = decoded.replace(regex, wordMappings[key]);
        });

        // Replace two-letter codes with or without ** prefix
        Object.keys(twoLetterMappings).forEach(key => {
            // Match **XX or XX (with word boundaries or special chars)
            const regex = new RegExp(`(?:\\*\\*)?\\b${key}\\b`, 'gi');
            decoded = decoded.replace(regex, twoLetterMappings[key]);
        });

        // Replace single letters when they appear standalone or in specific contexts
        // Pattern: word boundaries or within brackets/parentheses
        Object.keys(singleLetterMappings).forEach(key => {
            // Match single letter between word boundaries or special chars
            const regex = new RegExp(`(?<=^|\\s|\\[|\\(|\\/)${key}(?=$|\\s|\\]|\\)|\\/)`, 'g');
            decoded = decoded.replace(regex, singleLetterMappings[key]);
        });

        // Replace special single letters (m/b/x)
        Object.keys(specialMappings).forEach(key => {
            const regex = new RegExp(`(?<=^|\\s|\\[|\\(|\\/)${key}(?=$|\\s|\\]|\\)|\\/)`, 'g');
            decoded = decoded.replace(regex, specialMappings[key]);
        });

        return decoded;
    }

    // Function to handle VPS display
    function handleVPS(node) {
        if (settings.vpsMode === 'remove') {
            // Remove VPS text completely
            node.textContent = node.textContent.replace(/\bVPS\b/gi, '');
        } else if (settings.vpsMode === 'transparent') {
            // Make VPS almost transparent
            const text = node.textContent;
            if (/\bVPS\b/i.test(text)) {
                const parts = text.split(/(\bVPS\b)/gi);
                const parent = node.parentNode;
                if (!parent) return;
                
                const fragment = document.createDocumentFragment();
                
                parts.forEach(part => {
                    if (/\bVPS\b/i.test(part)) {
                        const span = document.createElement('span');
                        span.textContent = part;
                        span.style.opacity = '0.15';
                        span.setAttribute('data-decoded', 'true');
                        fragment.appendChild(span);
                    } else if (part) {
                        fragment.appendChild(document.createTextNode(part));
                    }
                });
                
                parent.replaceChild(fragment, node);
            }
        }
        // If 'keep', do nothing
    }

    // Process text nodes
    function processNode(node) {
        // Skip if already processed
        if (processedNodes.has(node)) return;
        
        if (node.nodeType === Node.TEXT_NODE) {
            // Skip empty or whitespace-only nodes
            if (!node.textContent || !node.textContent.trim()) return;
            
            const originalText = node.textContent;
            const decodedText = decodeText(originalText);
            
            if (originalText !== decodedText) {
                node.textContent = decodedText;
            }
            
            // Mark as processed
            processedNodes.add(node);
            
            // Handle VPS after decoding
            handleVPS(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            // Skip if already marked as decoded
            if (node.hasAttribute && node.hasAttribute('data-decoded')) return;
            
            // Skip script, style, and settings elements
            if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;
            if (node.id === 'decoderSettings' || node.closest('#decoderSettings')) return;
            
            // Mark element as processed
            processedNodes.add(node);
            
            Array.from(node.childNodes).forEach(processNode);
        }
    }

    // Initial processing
    processNode(document.body);

    // Debounce function to prevent excessive processing
    let mutationTimeout;
    const pendingNodes = new Set();

    // Watch for dynamic content with throttling
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                // Skip our own changes
                if (node.hasAttribute && node.hasAttribute('data-decoded')) return;
                if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'SPAN' || node.closest('[data-decoded]'))) return;
                
                pendingNodes.add(node);
            });
        });

        // Debounce processing
        clearTimeout(mutationTimeout);
        mutationTimeout = setTimeout(() => {
            pendingNodes.forEach(node => {
                if (document.body.contains(node)) {
                    processNode(node);
                }
            });
            pendingNodes.clear();
        }, 100); // Wait 100ms before processing
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Add floating settings button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', addFloatingButton);
    } else {
        addFloatingButton();
    }

    console.log('UltimateServer Decoder active');
})();