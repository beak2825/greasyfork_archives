// ==UserScript==
// @name         Lemonade Information Panel
// @namespace    http://tampermonkey.net/
// @version      2.0.3
// @description  Add information panel button to Lemonade interface
// @author       flag & Silver
// @match        https://lemonade.gg/code/*
// @match        https://*.lemonade.gg/code/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561101/Lemonade%20Information%20Panel.user.js
// @updateURL https://update.greasyfork.org/scripts/561101/Lemonade%20Information%20Panel.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Script configuration - Add your Greasyfork script URLs here
    const SCRIPTS_CONFIG = [
        'https://greasyfork.org/en/scripts/561100-lemonade-project-planner',
        'https://greasyfork.org/en/scripts/560681-lemonade-css-injector',
        'https://greasyfork.org/en/scripts/557182-lemonade-prompt-builder'
        // Add more script URLs here as needed
    ];

    // Inject base styles
    function injectStyles() {
        if (document.getElementById('lpb-info-styles')) return;

        const style = document.createElement('style');
        style.id = 'lpb-info-styles';
        style.textContent = `
            #lpb-info-overlay {
                display: none;
                position: fixed;
                inset: 0;
                background: rgba(0, 0, 0, 0.75);
                backdrop-filter: blur(8px);
                -webkit-backdrop-filter: blur(8px);
                z-index: 99999;
                justify-content: center;
                align-items: center;
            }

            #lpb-info-overlay.open {
                display: flex;
            }

            #lpb-info-modal {
                width: 95%;
                max-width: 900px;
                max-height: 85vh;
                overflow: hidden;
                display: flex;
                flex-direction: column;
                animation: lpbModalIn 0.2s ease;
            }

            @keyframes lpbModalIn {
                from { opacity: 0; transform: scale(0.95) translateY(10px); }
                to { opacity: 1; transform: scale(1) translateY(0); }
            }

            #lpb-info-modal .modal-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            #lpb-info-modal .info-section {
                margin-bottom: 24px;
                padding: 20px;
                background: rgba(0,0,0,0.3);
                border: 1px solid rgba(255,255,255,0.1);
                border-radius: 10px;
            }

            #lpb-info-modal .info-section:last-child {
                margin-bottom: 0;
            }

            #lpb-info-modal .section-header {
                display: flex;
                align-items: center;
                gap: 12px;
                margin-bottom: 16px;
                padding-bottom: 12px;
                border-bottom: 1px solid rgba(255,255,255,0.1);
            }

            #lpb-info-modal .section-icon {
                width: 40px;
                height: 40px;
                border-radius: 8px;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-shrink: 0;
            }

            #lpb-info-modal .section-icon.purple {
                background: rgba(147, 51, 234, 0.2);
                color: #9333ea;
            }

            #lpb-info-modal .section-icon.green {
                background: rgba(34, 197, 94, 0.2);
                color: #22c55e;
            }

            #lpb-info-modal .section-icon.blue {
                background: rgba(59, 130, 246, 0.2);
                color: #3b82f6;
            }

            #lpb-info-modal .section-icon.red {
                background: rgba(239, 68, 68, 0.2);
                color: #ef4444;
            }

            #lpb-info-modal .section-icon.yellow {
                background: rgba(234, 179, 8, 0.2);
                color: #eab308;
            }

            #lpb-info-modal .section-icon.pink {
                background: rgba(236, 72, 153, 0.2);
                color: #ec4899;
            }

            #lpb-info-modal .section-title {
                font-size: 16px;
                font-weight: 600;
            }

            #lpb-info-modal .section-body {
                font-size: 14px;
                line-height: 1.6;
                opacity: 0.9;
            }

            #lpb-info-modal .info-item {
                margin-bottom: 12px;
            }

            #lpb-info-modal .info-item:last-child {
                margin-bottom: 0;
            }

            #lpb-info-modal .info-label {
                font-weight: 500;
                opacity: 0.7;
                font-size: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
            }

            #lpb-info-modal .info-value {
                font-size: 14px;
            }

            #lpb-info-modal .info-value a {
                word-break: break-all;
            }

            .lpb-btn {
                display: inline-flex !important;
                align-items: center !important;
                justify-content: center !important;
                gap: 6px;
                padding: 0 14px !important;
                height: 36px !important;
                font-size: 13px;
                font-weight: 500;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.15s ease;
                border: 1px solid rgba(255,255,255,0.12);
                background: rgba(255,255,255,0.05);
                color: inherit;
                box-sizing: border-box !important;
            }

            .lpb-btn:hover {
                background: rgba(255,255,255,0.1);
            }

            .lpb-btn-sm {
                height: 32px !important;
                padding: 0 12px !important;
                font-size: 12px;
            }

            .lpb-btn-icon {
                width: 36px !important;
                min-width: 36px !important;
                max-width: 36px !important;
                padding: 0 !important;
            }

            .lpb-btn-icon.lpb-btn-sm {
                width: 32px !important;
                min-width: 32px !important;
                max-width: 32px !important;
            }

            .lpb-btn svg {
                flex-shrink: 0 !important;
                width: 12px !important;
                height: 12px !important;
            }

            .loading-pulse {
                animation: pulse 1.5s ease-in-out infinite;
            }

            @keyframes pulse {
                0%, 100% { opacity: 0.6; }
                50% { opacity: 1; }
            }

            @media (max-width: 768px) {
                #lpb-info-modal {
                    height: 90vh;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Get color and icon based on script index
    function getScriptColor(index) {
        const colors = ['purple', 'green', 'blue', 'red', 'yellow', 'pink'];
        return colors[index % colors.length];
    }

    function getScriptIcon(index) {
        const icons = [
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z"/>
            </svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>
            </svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="16 18 22 12 16 6"/>
                <polyline points="8 6 2 12 8 18"/>
            </svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
                <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
                <line x1="12" y1="22.08" x2="12" y2="12"/>
            </svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>`,
            `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"/>
            </svg>`
        ];
        return icons[index % icons.length];
    }

    // Extract script ID from Greasyfork URL
    function extractScriptId(url) {
        const match = url.match(/scripts\/(\d+)/);
        return match ? match[1] : null;
    }

    // Create the information modal
    function createModal() {
        if (document.getElementById('lpb-info-overlay')) return;

        const overlay = document.createElement('div');
        overlay.id = 'lpb-info-overlay';
        overlay.innerHTML = `
            <div id="lpb-info-modal" class="border shadow-xl dark:bg-background light:bg-background gray:bg-card rounded-xl border-border">
                <div class="h-14 shrink-0 px-4 w-full flex items-center justify-between border-b border-border">
                    <div class="flex items-center gap-3">
                        <span class="text-sm font-semibold">Information</span>
                    </div>
                    <button id="lpb-info-close" class="lpb-btn lpb-btn-sm lpb-btn-icon" title="Close (Esc)">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
                        </svg>
                    </button>
                </div>

                <div class="modal-content" id="scripts-container">
                    <!-- Scripts will be dynamically loaded here -->
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Setup event listeners
        const closeBtn = document.getElementById('lpb-info-close');
        closeBtn.addEventListener('click', () => overlay.classList.remove('open'));

        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) overlay.classList.remove('open');
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && overlay.classList.contains('open')) {
                overlay.classList.remove('open');
            }
        });
    }

    // Fetch script data from Greasyfork API
    async function fetchScriptData(url) {
        const scriptId = extractScriptId(url);
        if (!scriptId) {
            console.error('[Info Panel] Invalid Greasyfork URL:', url);
            return null;
        }

        try {
            const response = await fetch(`https://greasyfork.org/en/scripts/${scriptId}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('[Info Panel] Failed to fetch script data:', error);
            return null;
        }
    }

    // Generate HTML for a script section
    function generateScriptSection(data, index, url) {
        const color = getScriptColor(index);
        const icon = getScriptIcon(index);
        const scriptUrl = url || `https://greasyfork.org${data.url}`;

        return `
            <div class="info-section">
                <div class="section-header">
                    <div class="section-icon ${color}">
                        ${icon}
                    </div>
                    <span class="section-title">${data.name || 'Unknown Script'}</span>
                </div>
                <div class="section-body">
                    <div class="info-item">
                        <div class="info-label">Author</div>
                        <div class="info-value">${data.users && data.users[0] ? data.users[0].name : 'Unknown'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Version</div>
                        <div class="info-value">${data.version || 'Unknown'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Total Installs</div>
                        <div class="info-value">${data.total_installs ? data.total_installs.toLocaleString() : '0'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Description</div>
                        <div class="info-value">${data.description || 'No description available'}</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Link</div>
                        <div class="info-value">
                            <a href="${scriptUrl}" target="_blank" style="color: var(--color-${color}, #${color === 'purple' ? '9333ea' : color === 'green' ? '22c55e' : '3b82f6'}); text-decoration: underline;">${scriptUrl}</a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Populate information with all configured scripts
    async function populateInfo() {
        const container = document.getElementById('scripts-container');
        if (!container) return;

        // Show loading state
        container.innerHTML = `
            <div class="info-section">
                <div class="section-body" style="text-align: center; padding: 40px;">
                    <div class="loading-pulse" style="font-size: 14px;">Loading scripts...</div>
                </div>
            </div>
        `;

        // Fetch all script data
        const scriptDataPromises = SCRIPTS_CONFIG.map(url => fetchScriptData(url));
        const scriptsData = await Promise.all(scriptDataPromises);

        // Generate HTML for all scripts
        let htmlContent = '';
        scriptsData.forEach((data, index) => {
            if (data) {
                htmlContent += generateScriptSection(data, index, SCRIPTS_CONFIG[index]);
            }
        });

        // Add credits section
        htmlContent += `
            <div class="info-section">
                <div class="section-header">
                    <div class="section-icon blue">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/>
                            <line x1="4" x2="4" y1="22" y2="15"/>
                        </svg>
                    </div>
                    <span class="section-title">Credits</span>
                </div>
                <div class="section-body">
                    <div class="info-item">
                        <div class="info-label">Created By</div>
                        <div class="info-value">flag & Silver</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Script Name</div>
                        <div class="info-value">Lemonade Information Panel</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Version</div>
                        <div class="info-value">2.0.0</div>
                    </div>
                    <div class="info-item">
                        <div class="info-label">Status</div>
                        <div class="info-value" style="color: #22c55e;">Active</div>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = htmlContent;
    }

    // Inject the information button into the user menu
    function injectInfoButton() {
        // Look for the user menu dropdown
        const menuContent = document.querySelector('[role="menu"][data-radix-menu-content]');
        if (!menuContent || document.getElementById('lpb-info-menu-item')) {
            return;
        }

        // Find the separator before "Log Out"
        const separators = menuContent.querySelectorAll('[role="separator"]');
        const lastSeparator = separators[separators.length - 2]; // Second to last separator
        
        if (!lastSeparator) return;

        // Create the menu item
        const infoMenuItem = document.createElement('div');
        infoMenuItem.id = 'lpb-info-menu-item';
        infoMenuItem.setAttribute('role', 'menuitem');
        infoMenuItem.className = 'relative flex select-none items-center gap-2 rounded-sm px-2 py-1.5 outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0 text-sm cursor-pointer focus:bg-accent focus:text-accent-foreground';
        infoMenuItem.setAttribute('tabindex', '-1');
        infoMenuItem.setAttribute('data-orientation', 'vertical');
        infoMenuItem.setAttribute('data-radix-collection-item', '');
        
        infoMenuItem.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-flame mr-2 size-4" aria-hidden="true">
                <path d="M12 3q1 4 4 6.5t3 5.5a1 1 0 0 1-14 0 5 5 0 0 1 1-3 1 1 0 0 0 5 0c0-2-1.5-3-1.5-5q0-2 2.5-4"/>
            </svg>
            <span>Information Panel</span>
        `;

        infoMenuItem.addEventListener('click', () => {
            const overlay = document.getElementById('lpb-info-overlay');
            if (overlay) {
                populateInfo(); // Refresh info when opening
                overlay.classList.add('open');
            }
        });

        // Insert after the last separator (before Log Out)
        lastSeparator.parentNode.insertBefore(infoMenuItem, lastSeparator.nextSibling);
        
        // Move the separator to be after the Information Panel item
        infoMenuItem.parentNode.insertBefore(lastSeparator, infoMenuItem.nextSibling);
        
        console.log('[Info Panel] Menu item injected successfully');
    }

    // Watch for menu opening
    function watchForMenu() {
        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        const menu = node.querySelector ? node.querySelector('[role="menu"][data-radix-menu-content]') : null;
                        if (menu || (node.getAttribute && node.getAttribute('role') === 'menu')) {
                            setTimeout(() => injectInfoButton(), 50);
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Initialize
    function init() {
        injectStyles();
        createModal();
        watchForMenu();

        console.log('[Info Panel] UserScript loaded');
    }

    // Run on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();