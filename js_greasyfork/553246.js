// ==UserScript==
// @name         Amazon Video Link Collector (Prime + Amazon.com)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Collects all movie and series links from Amazon Prime Video and Amazon.com video
// @author       You
// @match        https://www.primevideo.com/*
// @match        https://*.primevideo.com/*
// @match        https://www.amazon.com/*
// @match        https://*.amazon.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/553246/Amazon%20Video%20Link%20Collector%20%28Prime%20%2B%20Amazoncom%29.user.js
// @updateURL https://update.greasyfork.org/scripts/553246/Amazon%20Video%20Link%20Collector%20%28Prime%20%2B%20Amazoncom%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Persistent storage using localStorage
    const STORAGE_KEY = 'pv_links_collection_v1';
    const COPIED_KEY = 'pv_links_copied_history_v1';

    // Load saved links from storage
    function loadSavedLinks() {
        try {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch (e) {
            console.error('Error loading saved links:', e);
            return new Set();
        }
    }

    // Load copied links from storage
    function loadCopiedLinks() {
        try {
            const saved = localStorage.getItem(COPIED_KEY);
            return saved ? new Set(JSON.parse(saved)) : new Set();
        } catch (e) {
            console.error('Error loading copied links:', e);
            return new Set();
        }
    }

    // Save links to storage
    function saveLinks() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(collectedLinks)));
        } catch (e) {
            console.error('Error saving links:', e);
        }
    }

    // Save copied links to storage
    function saveCopiedLinks() {
        try {
            localStorage.setItem(COPIED_KEY, JSON.stringify(Array.from(copiedLinks)));
        } catch (e) {
            console.error('Error saving copied links:', e);
        }
    }

    const collectedLinks = loadSavedLinks();
    const copiedLinks = loadCopiedLinks();

    // Panel visibility state
    let isPanelVisible = true;

    // Create toggle button (always visible)
    const toggleBtn = document.createElement('button');
    toggleBtn.innerHTML = '📦 Hide Panel';
    toggleBtn.style.cssText = `
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 10000;
        padding: 10px 15px;
        background: #146eb4;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;
    toggleBtn.addEventListener('click', togglePanel);
    document.body.appendChild(toggleBtn);

    // Create button panel container
    const buttonPanel = document.createElement('div');
    buttonPanel.id = 'pv-button-panel';
    buttonPanel.style.cssText = `
        position: fixed;
        bottom: 60px;
        right: 10px;
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
    `;
    document.body.appendChild(buttonPanel);

    // Create button to extract links
    const btn = document.createElement('button');
    updateButtonText();
    btn.style.cssText = `
        padding: 10px 15px;
        background: #00a8e1;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;

    function updateButtonText() {
        const newCount = collectedLinks.size - copiedLinks.size;
        btn.innerHTML = `✨ Collect (${collectedLinks.size} | ${newCount} new)`;
    }

    btn.addEventListener('click', extractContentLinks);
    buttonPanel.appendChild(btn);

    function togglePanel() {
        isPanelVisible = !isPanelVisible;
        buttonPanel.style.display = isPanelVisible ? 'flex' : 'none';
        toggleBtn.innerHTML = isPanelVisible ? '📦 Hide Panel' : '📦 Show Panel';
    }

    function extractContentLinks() {
        const newLinksFound = [];
        const duplicatesSkipped = [];

        // Find all links on the page - works for both Prime Video and Amazon.com
        const allLinks = document.querySelectorAll('a[href*="/detail/"], a[href*="/gp/video/detail/"]');

        allLinks.forEach(link => {
            let href = link.href;
            // Match Prime Video detail URLs OR Amazon.com video URLs
            if (href && (href.includes('/detail/') || href.includes('/gp/video/detail/'))) {
                // Clean the URL based on which platform it's from
                href = cleanVideoURL(href);

                if (href && !collectedLinks.has(href)) {
                    newLinksFound.push(href);
                    collectedLinks.add(href);
                } else if (href) {
                    duplicatesSkipped.push(href);
                }
            }
        });

        // Also try to find links in common video card patterns
        const selectors = [
            '[data-testid*="card"]',
            '[class*="Card"]',
            '[class*="card"]',
            '[class*="Title"]',
            '[class*="title"]',
            '[class*="content"]',
            '[class*="poster"]',
            '[data-card-title]',
            '[data-testid*="title"]',
            '[class*="av-"]'
        ];

        selectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                const link = element.querySelector('a[href*="/detail/"], a[href*="/gp/video/detail/"]') ||
                            (element.tagName === 'A' && (element.href.includes('/detail/') || element.href.includes('/gp/video/detail/')) ? element : null);
                if (link && link.href) {
                    let cleanHref = cleanVideoURL(link.href);

                    if (cleanHref && !collectedLinks.has(cleanHref)) {
                        newLinksFound.push(cleanHref);
                        collectedLinks.add(cleanHref);
                    } else if (cleanHref && !duplicatesSkipped.includes(cleanHref)) {
                        duplicatesSkipped.push(cleanHref);
                    }
                }
            });
        });

        // Save to storage
        saveLinks();

        // Update button text
        updateButtonText();

        // Show notification
        const newCount = collectedLinks.size - copiedLinks.size;
        if (newLinksFound.length > 0) {
            showNotification(`✅ Added ${newLinksFound.length} new | ⭐️ Skipped ${duplicatesSkipped.length} duplicates | 💾 Total: ${collectedLinks.size} (${newCount} not copied yet)`);
        } else {
            showNotification(`No new links found. ${duplicatesSkipped.length} duplicates skipped. Total: ${collectedLinks.size} (${newCount} not copied yet)`);
        }
    }

    // Function to clean video URLs - works for both Prime Video and Amazon.com
    function cleanVideoURL(url) {
        // For Amazon.com video URLs: /gp/video/detail/ID/
        if (url.includes('/gp/video/detail/')) {
            const match = url.match(/(https?:\/\/[^\/]+\/gp\/video\/detail\/[A-Z0-9]+)/);
            return match ? match[1] + '/' : null;
        }
        
        // For Prime Video URLs: /detail/ID/
        if (url.includes('/detail/')) {
            const match = url.match(/(https?:\/\/[^\/]+\/detail\/[A-Z0-9]+)/);
            return match ? match[1] + '/' : null;
        }
        
        return null;
    }

    function showNotification(message) {
        const notif = document.createElement('div');
        notif.textContent = message;
        notif.style.cssText = `
            position: fixed;
            bottom: 230px;
            right: 10px;
            z-index: 10000;
            padding: 10px 15px;
            background: #00a8e1;
            color: white;
            border-radius: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            max-width: 300px;
            font-size: 13px;
        `;
        document.body.appendChild(notif);
        setTimeout(() => notif.remove(), 4000);
    }

    // Add View/Copy button
    const viewBtn = document.createElement('button');
    viewBtn.innerHTML = '📋 View & Copy';
    viewBtn.style.cssText = `
        padding: 10px 15px;
        background: #0088cc;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;
    viewBtn.addEventListener('click', () => displayResults(Array.from(collectedLinks)));
    buttonPanel.appendChild(viewBtn);

    // Add Clear button
    const clearBtn = document.createElement('button');
    clearBtn.innerHTML = '🗑️ Clear All';
    clearBtn.style.cssText = `
        padding: 10px 15px;
        background: #dc3545;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;
    clearBtn.addEventListener('click', () => {
        if (confirm(`Clear all ${collectedLinks.size} saved links and copy history?`)) {
            collectedLinks.clear();
            copiedLinks.clear();
            saveLinks();
            saveCopiedLinks();
            updateButtonText();
            showNotification('Everything cleared!');
        }
    });
    buttonPanel.appendChild(clearBtn);

    // Add Clear Copied button
    const clearCopiedBtn = document.createElement('button');
    clearCopiedBtn.innerHTML = '🔄 Clear Copied';
    clearCopiedBtn.style.cssText = `
        padding: 10px 15px;
        background: #ffc107;
        color: black;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;
    clearCopiedBtn.addEventListener('click', () => {
        if (confirm(`Reset copy history? (${copiedLinks.size} links will be available to copy again)`)) {
            copiedLinks.clear();
            saveCopiedLinks();
            updateButtonText();
            showNotification('Copy history cleared! All links available to copy again.');
        }
    });
    buttonPanel.appendChild(clearCopiedBtn);

    function displayResults(links) {
        // Filter out already copied links
        const uncopiedLinks = links.filter(link => !copiedLinks.has(link));

        // Remove existing modal if any
        const existing = document.getElementById('content-links-modal');
        if (existing) existing.remove();

        // Create modal
        const modal = document.createElement('div');
        modal.id = 'content-links-modal';
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.5);
            z-index: 10001;
            max-width: 80%;
            max-height: 80%;
            overflow: auto;
            color: black;
        `;

        const title = document.createElement('h2');
        if (uncopiedLinks.length === 0) {
            title.textContent = `All ${links.length} links have been copied already!`;
            title.style.marginTop = '0';

            const message = document.createElement('p');
            message.textContent = 'Collect more links or click "Clear Copied" to reset copy history.';

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.style.cssText = `
                padding: 8px 15px;
                background: #666;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                margin-top: 10px;
            `;
            closeBtn.addEventListener('click', () => {
                modal.remove();
                document.getElementById('overlay-backdrop').remove();
            });

            modal.appendChild(title);
            modal.appendChild(message);
            modal.appendChild(closeBtn);
        } else {
            title.textContent = `${uncopiedLinks.length} New Links to Copy`;
            title.style.marginTop = '0';

            const subtitle = document.createElement('p');
            subtitle.textContent = `(${copiedLinks.size} already copied, ${uncopiedLinks.length} new)`;
            subtitle.style.cssText = 'color: #666; margin: 0 0 10px 0; font-size: 14px;';

            const linksList = document.createElement('textarea');
            linksList.value = uncopiedLinks.join('\n');
            linksList.style.cssText = `
                width: 100%;
                height: 300px;
                margin: 10px 0;
                padding: 10px;
                font-family: monospace;
                font-size: 12px;
            `;

            const btnContainer = document.createElement('div');
            btnContainer.style.cssText = 'display: flex; gap: 10px; justify-content: flex-end;';

            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy New Links';
            copyBtn.style.cssText = `
                padding: 8px 15px;
                background: #00a8e1;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            `;
            copyBtn.addEventListener('click', () => {
                linksList.select();
                document.execCommand('copy');

                // Mark these links as copied
                uncopiedLinks.forEach(link => copiedLinks.add(link));
                saveCopiedLinks();
                updateButtonText();

                copyBtn.textContent = 'Copied!';
                copyBtn.style.background = '#28a745';
                setTimeout(() => {
                    modal.remove();
                    document.getElementById('overlay-backdrop').remove();
                    showNotification(`✅ Copied ${uncopiedLinks.length} new links!`);
                }, 1000);
            });

            const closeBtn = document.createElement('button');
            closeBtn.textContent = 'Close';
            closeBtn.style.cssText = `
                padding: 8px 15px;
                background: #666;
                color: white;
                border: none;
                border-radius: 5px;
                cursor: pointer;
            `;
            closeBtn.addEventListener('click', () => {
                modal.remove();
                document.getElementById('overlay-backdrop').remove();
            });

            btnContainer.appendChild(copyBtn);
            btnContainer.appendChild(closeBtn);

            modal.appendChild(title);
            modal.appendChild(subtitle);
            modal.appendChild(linksList);
            modal.appendChild(btnContainer);
        }

        // Create overlay
        const overlay = document.createElement('div');
        overlay.id = 'overlay-backdrop';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.7);
            z-index: 10000;
        `;
        overlay.addEventListener('click', () => {
            modal.remove();
            overlay.remove();
        });

        document.body.appendChild(overlay);
        document.body.appendChild(modal);
    }
})();