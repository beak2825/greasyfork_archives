// ==UserScript==
// @name         Link Collector - Smart Magnet Link Tool
// @namespace    https://github.com/
// @version      2.1
// @description  Smart link collector with localStorage persistence, SPA support, and multi-protocol detection. Supports magnet links, eD2k links, and more!
// @author       Link Collector Tools
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/556407/Link%20Collector%20-%20Smart%20Magnet%20Link%20Tool.user.js
// @updateURL https://update.greasyfork.org/scripts/556407/Link%20Collector%20-%20Smart%20Magnet%20Link%20Tool.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Global state management
    var observer = null;
    var button = null;
    var STORAGE_KEY = 'link-collector-storage';

    // Link schemas configuration - easily extensible
    var LINK_SCHEMAS = {
        magnet: {
            pattern: /magnet:\?xt=[^\s<>"']+/gi,
            name: 'Magnet Link',
            icon: '🧲',
            color: '#2196F3'
        },
        ed2k: {
            pattern: /ed2k:\/\/\|\S+\|/gi,
            name: 'eD2k Link',
            icon: '🔗',
            color: '#FF9800'
        }
        // Add more schemas here in the future
        // Example:
        // thunder: {
        //     pattern: /thunder:\/\/\S+/gi,
        //     name: 'Thunder Link',
        //     icon: '⚡',
        //     color: '#4CAF50'
        // }
    };

    // Get all link patterns combined
    function getAllLinkPatterns() {
        return Object.values(LINK_SCHEMAS).map(schema => schema.pattern);
    }

    // Get all link patterns as a single regex
    function getCombinedPattern() {
        var patterns = Object.values(LINK_SCHEMAS).map(schema => schema.pattern.source);
        return new RegExp('(' + patterns.join('|') + ')', 'gi');
    }

    // Identify link schema from URL
    function identifyLinkSchema(linkUrl) {
        for (var [schemaType, schema] of Object.entries(LINK_SCHEMAS)) {
            if (schema.pattern.test(linkUrl)) {
                return { type: schemaType, schema: schema };
            }
        }
        return null;
    }

    // Initialize data from localStorage
    function initializeFromStorage() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                var data = JSON.parse(stored);
                return {
                    discoveredLinks: new Set(data.discoveredLinks || []),
                    copiedLinks: new Set(data.copiedLinks || []),
                    lastUpdated: data.lastUpdated || Date.now()
                };
            }
        } catch (e) {
            console.warn('Failed to load from localStorage:', e);
        }
        return {
            discoveredLinks: new Set(),
            copiedLinks: new Set(),
            lastUpdated: Date.now()
        };
    }

    // Save state to localStorage
    function saveToStorage(discoveredLinks, copiedLinks) {
        try {
            var data = {
                discoveredLinks: Array.from(discoveredLinks),
                copiedLinks: Array.from(copiedLinks),
                lastUpdated: Date.now(),
                url: window.location.href
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        } catch (e) {
            console.warn('Failed to save to localStorage:', e);
            // If storage is full, clear old data and try again
            try {
                localStorage.removeItem(STORAGE_KEY);
                var data = {
                    discoveredLinks: Array.from(discoveredLinks),
                    copiedLinks: Array.from(copiedLinks),
                    lastUpdated: Date.now(),
                    url: window.location.href
                };
                localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            } catch (e2) {
                console.warn('LocalStorage is not available or full');
            }
        }
    }

    // Clear old storage data (older than 15 minutes of inactivity)
    function clearOldStorageData() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                var data = JSON.parse(stored);
                // Use 15 minutes for localStorage to prevent stale data
                if (data.lastUpdated && Date.now() - data.lastUpdated > 900000) { // 15 minutes
                    localStorage.removeItem(STORAGE_KEY);
                    return true;
                }
            }
        } catch (e) {
            console.warn('Failed to clear old storage data:', e);
        }
        return false;
    }

    // Check if storage is expired
    function isStorageExpired() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                var data = JSON.parse(stored);
                return data.lastUpdated && Date.now() - data.lastUpdated > 900000; // 15 minutes
            }
        } catch (e) {
            console.warn('Failed to check storage expiry:', e);
        }
        return false;
    }

    // Get storage age in minutes
    function getStorageAge() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                var data = JSON.parse(stored);
                if (data.lastUpdated) {
                    return Math.floor((Date.now() - data.lastUpdated) / 60000);
                }
            }
        } catch (e) {
            console.warn('Failed to get storage age:', e);
        }
        return 0;
    }

    // Get storage size information
    function getStorageInfo() {
        try {
            var stored = localStorage.getItem(STORAGE_KEY);
            var size = stored ? new Blob([stored]).size : 0;
            var ageMinutes = getStorageAge();
            var expired = isStorageExpired();

            return {
                size: size,
                sizeText: size > 1024 ? (size / 1024).toFixed(2) + ' KB' : size + ' bytes',
                itemCount: stored ? JSON.parse(stored).discoveredLinks.length : 0,
                ageMinutes: ageMinutes,
                expired: expired
            };
        } catch (e) {
            return { size: 0, sizeText: '0 bytes', itemCount: 0, ageMinutes: 0, expired: false };
        }
    }

    // Initialize state from storage
    var state = initializeFromStorage();
    var discoveredLinks = state.discoveredLinks;
    var copiedLinks = state.copiedLinks;

    // Wait for DOM to be ready
    function waitForDOM() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initScript);
        } else {
            initScript();
        }
    }

    // Extract all supported link types from text content
    function extractLinksFromText(text) {
        var combinedPattern = getCombinedPattern();
        var matches = text.match(combinedPattern) || [];
        return matches;
    }

    // Extract magnet links from text content (legacy function for compatibility)
    function extractMagnetLinksFromText(text) {
        return extractLinksFromText(text).filter(function(link) {
            return link.startsWith('magnet:');
        });
    }

    // Scan page for all supported link types and update state
    function scanForMagnetLinks() {
        var newLinksFound = false;

        // Priority 1: Find supported links in actual <a> tags
        Object.keys(LINK_SCHEMAS).forEach(function(schemaType) {
            var links = document.querySelectorAll('a[href^="' + schemaType + ':"]');
            links.forEach(function(link) {
                if (!discoveredLinks.has(link.href)) {
                    discoveredLinks.add(link.href);
                    newLinksFound = true;
                    var schemaInfo = LINK_SCHEMAS[schemaType];
                    console.log('Found ' + schemaInfo.name + ' in <a> tag:', link.href);
                }
            });
        });

        // Priority 2: Find supported links in text content (lower priority)
        // Get all text nodes that might contain supported links
        var textNodes = [];
        var walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // Skip script, style, and other non-content elements
                    var parentTag = node.parentElement.tagName.toLowerCase();
                    if (['script', 'style', 'noscript', 'iframe'].includes(parentTag)) {
                        return NodeFilter.FILTER_REJECT;
                    }

                    // Only process text nodes that contain supported link patterns
                    var textContent = node.textContent;
                    for (var schemaType in LINK_SCHEMAS) {
                        if (textContent.includes(schemaType + ':')) {
                            return NodeFilter.FILTER_ACCEPT;
                        }
                    }

                    return NodeFilter.FILTER_REJECT;
                }
            }
        );

        var node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        // Extract supported links from text nodes
        textNodes.forEach(function(textNode) {
            var links = extractLinksFromText(textNode.textContent);
            links.forEach(function(link) {
                if (!discoveredLinks.has(link)) {
                    discoveredLinks.add(link);
                    newLinksFound = true;
                    var schemaInfo = identifyLinkSchema(link);
                    console.log('Found ' + (schemaInfo ? schemaInfo.schema.name : 'Unknown Link') + ' in text:', link);
                }
            });
        });

        // Additional scan for input values, textarea content, and code blocks
        var extraElements = document.querySelectorAll('input[type="text"], textarea, code, pre, .magnet, .torrent-info, .ed2k, .download-link');
        extraElements.forEach(function(element) {
            var text = element.value || element.textContent || element.innerText;
            var links = extractLinksFromText(text);
            links.forEach(function(link) {
                if (!discoveredLinks.has(link)) {
                    discoveredLinks.add(link);
                    newLinksFound = true;
                    var schemaInfo = identifyLinkSchema(link);
                    console.log('Found ' + (schemaInfo ? schemaInfo.schema.name : 'Unknown Link') + ' in element:', link, 'from:', element.tagName || element.className);
                }
            });
        });

        // Save to storage whenever new links are found
        if (newLinksFound) {
            saveToStorage(discoveredLinks, copiedLinks);
            console.log('Total links found:', discoveredLinks.size);
        }

        return newLinksFound;
    }

    // Check if there are magnet links on the page
    function checkAndCreateButton() {
        scanForMagnetLinks(); // Initial scan

        if (discoveredLinks.size > 0) {
            createButton();
            observePageChanges();
        }
    }

    // Initialize the script
    function initScript() {
        // Check if button already exists
        if (document.getElementById('copy-magnet-links-btn')) {
            return;
        }

        // Clear expired storage data
        var wasCleared = clearOldStorageData();

        checkAndCreateButton();

        // Save initial state
        saveToStorage(discoveredLinks, copiedLinks);

        // Show notification about storage status
        if (wasCleared) {
            setTimeout(function() {
                showNotification('Link Collector data expired (15min). Reset completed! 🔄');
            }, 1000);
        }
    }

    // Create the copy button
    function createButton() {
        // Update button display with link count
        function updateButtonDisplay() {
            var newCount = discoveredLinks.size - copiedLinks.size;
            if (newCount > 0) {
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                    <span style="position: absolute; top: -5px; right: -5px; background: #ff4757; color: white; border-radius: 50%; width: 16px; height: 16px; font-size: 10px; display: flex; align-items: center; justify-content: center; font-weight: bold;">${newCount}</span>
                `;
                var storageInfo = getStorageInfo();
            button.title = `Link Collector: ${newCount} magnet link${newCount > 1 ? 's' : ''} ready to collect\nTotal found: ${discoveredLinks.size} | Already collected: ${copiedLinks.size}\nStorage: ${storageInfo.sizeText}\nRight-click to clear storage`;
            } else {
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none;">
                        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                        <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                `;
                button.title = "Link Collector: All links successfully collected! ✅";
            }
        }

        // Function to copy magnet links to clipboard
        function copyMagnetLinks() {
            // Get only links that haven't been copied yet
            var linksToCopy = [];
            discoveredLinks.forEach(function(link) {
                if (!copiedLinks.has(link)) {
                    linksToCopy.push(link);
                }
            });

            if (linksToCopy.length === 0) {
                showNotification("Link Collector: All links collected! ✅");
                return;
            }

            // Add loading state
            button.disabled = true;
            button.style.cursor = "wait";
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="pointer-events: none; animation: spin 1s linear infinite;">
                    <path d="M21 2v6h-6"></path>
                    <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
                    <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
                    <path d="M3 22v-6h6"></path>
                </svg>
            `;

            var magnetLinks = linksToCopy.join("\n");

            // Simulate async operation for better UX
            setTimeout(function() {
                // Try multiple copy methods for better compatibility
                function tryCopy(text) {
                    // Method 1: Modern Clipboard API (Chrome, Edge, Firefox, Safari 13.1+)
                    if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(text).then(function() {
                            handleCopySuccess(linksToCopy);
                        }).catch(function() {
                            fallbackCopy(text);
                        });
                    }
                    // Method 2: Greasemonkey/Tampermonkey API
                    else if (typeof GM_setClipboard !== 'undefined') {
                        GM_setClipboard(magnetLinks);
                        handleCopySuccess(linksToCopy);
                    }
                    // Method 3: Legacy execCommand method
                    else {
                        fallbackCopy(text);
                    }
                }

                function fallbackCopy(text) {
                    try {
                        var textarea = document.createElement("textarea");
                        textarea.value = text;
                        textarea.style.position = "fixed"; // Prevent scrolling to bottom
                        textarea.style.opacity = "0";
                        document.body.appendChild(textarea);
                        textarea.select();
                        textarea.setSelectionRange(0, 99999); // For mobile devices

                        var successful = document.execCommand("copy");
                        document.body.removeChild(textarea);

                        if (successful) {
                            handleCopySuccess(linksToCopy);
                        } else {
                            showNotification("Failed to copy. Please try manually.");
                        }
                        resetButton();
                    } catch (err) {
                        showNotification("Copy failed: " + err.message);
                        resetButton();
                    }
                }

                // Handle successful copy
                function handleCopySuccess(copiedItems) {
                    // Mark links as copied
                    copiedItems.forEach(function(link) {
                        copiedLinks.add(link);
                    });

                    // Save updated state to storage
                    saveToStorage(discoveredLinks, copiedLinks);

                    showNotification(`Link Collector collected ${copiedItems.length} magnet link${copiedItems.length > 1 ? 's' : ''}! 📋`);
                    updateButtonDisplay();
                    resetButton();
                }

                tryCopy(magnetLinks);
            }, 300); // Small delay for better UX
        }

        // Reset button to original state
        function resetButton() {
            button.disabled = false;
            button.style.cursor = "pointer";
            updateButtonDisplay();
        }

        // Function to show a notification
        function showNotification(message) {
            var notification = document.createElement("div");
            notification.className = "magnet-notification";
            notification.innerText = message;
            notification.style.backgroundColor = "#333";
            notification.style.color = "#fff";
            notification.style.padding = "10px";
            notification.style.borderRadius = "5px";
            notification.style.zIndex = 1001;
            notification.style.fontSize = "14px";
            notification.style.opacity = "0.9";
            document.body.appendChild(notification);

            // Automatically remove the notification after 2 seconds
            setTimeout(function() {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 2000);
        }

        // Add CSS animation and styles
        var style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }

            #copy-magnet-links-btn {
                position: fixed !important;
                bottom: 10px !important;
                right: 10px !important;
                left: auto !important;
                top: auto !important;
                transform: none !important;
            }

            .magnet-notification {
                position: fixed !important;
                bottom: 60px !important;
                right: 10px !important;
                left: auto !important;
                top: auto !important;
                transform: none !important;
            }
        `;
        document.head.appendChild(style);

        // Create a button to trigger the copy action
        button = document.createElement("button");
        button.id = "copy-magnet-links-btn";
        button.style.position = "fixed";
        button.style.bottom = "10px";
        button.style.right = "10px"; // Place the button in the bottom-right corner
        button.style.zIndex = "2147483647"; // Maximum z-index to ensure it's on top
        button.style.width = "32px";
        button.style.height = "32px";
        button.style.padding = "6px";
        button.style.backgroundColor = "rgba(0, 123, 255, 0.9)";
        button.style.color = "white";
        button.style.border = "none";
        button.style.borderRadius = "6px";
        button.style.cursor = "pointer";
        button.style.display = "flex";
        button.style.alignItems = "center";
        button.style.justifyContent = "center";
        button.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
        button.style.transition = "all 0.2s ease";
        button.style.position = "relative"; // For badge positioning

        // Add hover effects
        button.addEventListener("mouseenter", function() {
            if (!button.disabled) {
                button.style.backgroundColor = "rgba(0, 86, 179, 0.95)";
                button.style.transform = "scale(1.1)";
            }
        });

        button.addEventListener("mouseleave", function() {
            if (!button.disabled) {
                button.style.backgroundColor = "rgba(0, 123, 255, 0.9)";
                button.style.transform = "scale(1)";
            }
        });

        document.body.appendChild(button);

        // Bind updateButtonDisplay to button for external access
        button.updateButtonDisplay = updateButtonDisplay;

        // Initialize button display
        updateButtonDisplay();

        // Add event listener for the button
        button.addEventListener("click", function() {
            copyMagnetLinks();
        });

        // Add right-click context menu to clear storage
        button.addEventListener("contextmenu", function(e) {
            e.preventDefault();

            var storageInfo = getStorageInfo();
            var ageText = storageInfo.expired ? `${storageInfo.ageMinutes} min ago (expired)` : `${storageInfo.ageMinutes} min ago`;
            var message = 'Clear Link Collector storage?\n\n' +
                         'Storage info:\n' +
                         '- ' + storageInfo.itemCount + ' links collected\n' +
                         '- Size: ' + storageInfo.sizeText + '\n' +
                         '- Age: ' + ageText + '\n' +
                         '- This will reset the collection\n\n' +
                         'Note: Data expires after 15min inactivity';

            if (confirm(message)) {
                try {
                    localStorage.removeItem(STORAGE_KEY);
                    discoveredLinks.clear();
                    copiedLinks.clear();

                    // Re-scan current page
                    var newLinksFound = scanForMagnetLinks();
                    updateButtonDisplay();

                    showNotification('Link Collector reset! ' + (newLinksFound ? 'Found ' + discoveredLinks.size + ' new links to collect.' : 'No magnet links found.'));
                } catch (err) {
                    showNotification('Failed to clear storage: ' + err.message);
                }
            }
        });
    }

    // Observe page changes for dynamic content
    function observePageChanges() {
        // Initial scan will be handled by createButton function

        observer = new MutationObserver(function(mutations) {
            var newLinksFound = false;

            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    for (var i = 0; i < mutation.addedNodes.length; i++) {
                        var node = mutation.addedNodes[i];
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Priority 1: Check if the node itself is a supported link
                            if (node.tagName === 'A' && node.href) {
                                var schemaInfo = identifyLinkSchema(node.href);
                                if (schemaInfo) {
                                    if (!discoveredLinks.has(node.href)) {
                                        discoveredLinks.add(node.href);
                                        newLinksFound = true;
                                        console.log('Found ' + schemaInfo.schema.name + ' in new node:', node.href);
                                    }
                                }
                            }
                            // Priority 2: Check if the node contains supported links in <a> tags
                            else if (node.querySelectorAll) {
                                Object.keys(LINK_SCHEMAS).forEach(function(schemaType) {
                                    var links = node.querySelectorAll('a[href^="' + schemaType + ':"]');
                                    links.forEach(function(link) {
                                        if (!discoveredLinks.has(link.href)) {
                                            discoveredLinks.add(link.href);
                                            newLinksFound = true;
                                            console.log('Found ' + LINK_SCHEMAS[schemaType].name + ' in new node <a>:', link.href);
                                        }
                                    });
                                });
                            }

                            // Priority 3: Check if the new node contains supported links in text content
                            var textContent = node.textContent || node.innerText || '';
                            var hasSupportedLinks = false;
                            for (var schemaType in LINK_SCHEMAS) {
                                if (textContent.includes(schemaType + ':')) {
                                    hasSupportedLinks = true;
                                    break;
                                }
                            }

                            if (hasSupportedLinks) {
                                var linksFromText = extractLinksFromText(textContent);
                                linksFromText.forEach(function(link) {
                                    if (!discoveredLinks.has(link)) {
                                        discoveredLinks.add(link);
                                        newLinksFound = true;
                                        var linkSchemaInfo = identifyLinkSchema(link);
                                        console.log('Found ' + (linkSchemaInfo ? linkSchemaInfo.schema.name : 'Unknown Link') + ' in new node text:', link, 'from:', node.tagName);
                                    }
                                });
                            }

                            // Also check special elements that might contain magnet links
                            var specialElements = node.querySelectorAll && node.querySelectorAll('input[type="text"], textarea, code, pre, .magnet, .torrent-info');
                            if (specialElements) {
                                specialElements.forEach(function(element) {
                                    var text = element.value || element.textContent || element.innerText;
                                    var magnetLinks = extractMagnetLinksFromText(text);
                                    magnetLinks.forEach(function(magnetLink) {
                                        if (!discoveredLinks.has(magnetLink)) {
                                            discoveredLinks.add(magnetLink);
                                            newLinksFound = true;
                                            console.log('Found magnet link in special element:', magnetLink, 'from:', element.tagName || element.className);
                                        }
                                    });
                                });
                            }
                        }
                    }
                }
                // Also handle attribute changes (e.g., href changes)
                else if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                    var target = mutation.target;
                    if (target.tagName === 'A' && target.href) {
                        var schemaInfo = identifyLinkSchema(target.href);
                        if (schemaInfo && !discoveredLinks.has(target.href)) {
                            discoveredLinks.add(target.href);
                            newLinksFound = true;
                            console.log('Found ' + schemaInfo.schema.name + ' in href change:', target.href);
                        }
                    }
                }
                // Also handle text changes in elements that might contain supported links
                else if (mutation.type === 'characterData') {
                    var target = mutation.target;
                    var textContent = target.textContent;
                    var hasSupportedLinks = false;
                    for (var schemaType in LINK_SCHEMAS) {
                        if (textContent.includes(schemaType + ':')) {
                            hasSupportedLinks = true;
                            break;
                        }
                    }

                    if (hasSupportedLinks) {
                        var linksFromText = extractLinksFromText(textContent);
                        linksFromText.forEach(function(link) {
                            if (!discoveredLinks.has(link)) {
                                discoveredLinks.add(link);
                                newLinksFound = true;
                                var linkSchemaInfo = identifyLinkSchema(link);
                                console.log('Found ' + (linkSchemaInfo ? linkSchemaInfo.schema.name : 'Unknown Link') + ' in text change:', link, 'in:', target.parentElement.tagName);
                            }
                        });
                    }
                }
            });

            // Update button if new links were found
            if (newLinksFound && button && button.updateButtonDisplay) {
                button.updateButtonDisplay();
            }

            // Create button if it doesn't exist and we have links
            if (discoveredLinks.size > 0 && !document.getElementById('copy-magnet-links-btn')) {
                createButton();
            }
        });

        // Start observing with comprehensive options
        observer.observe(document.body, {
            childList: true,      // Watch for added/removed nodes
            subtree: true,        // Watch all descendants
            attributes: true,     // Watch for attribute changes
            attributeFilter: ['href'], // Specifically watch href changes
            characterData: true   // Watch for text content changes
        });

        // Also do periodic scans to catch any missed changes
        setInterval(function() {
            var hadNewLinks = scanForMagnetLinks();
            if (hadNewLinks && button && button.updateButtonDisplay) {
                button.updateButtonDisplay();
            }
        }, 2000); // Check every 2 seconds
    }

    // Start the script
    waitForDOM();
})();
