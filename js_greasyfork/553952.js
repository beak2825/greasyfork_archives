// ==UserScript==
// @name         	Method.gg - Fellowship Auto-Load Routes
// @name:de        	Method.gg - Fellowship Routen automatisch laden
// @namespace    	https://greasyfork.org/users/928242
// @version      	1.0.0
// @description  	Adding quick load buttons to dungeons, to automatically load routes and open the map in full screen
// @description:de 	Schnellladetasten zu Dungeons hinzufügen, um Routen automatisch zu laden und die Karte im Vollbildmodus zu öffnen
// @author       	Kamikaze (https://github.com/Kamiikaze)
// @supportURL     	https://github.com/Kamiikaze/Tampermonkey/issues
// @iconURL      	https://www.playfellowship.com/fel_assets/favicon.ico?v=3
// @match        	https://www.method.gg/fellowship/route-planner*
// @license      	MIT
// @grant         	none
// @downloadURL https://update.greasyfork.org/scripts/553952/Methodgg%20-%20Fellowship%20Auto-Load%20Routes.user.js
// @updateURL https://update.greasyfork.org/scripts/553952/Methodgg%20-%20Fellowship%20Auto-Load%20Routes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION - Adjust these settings
    // ============================================
    const CONFIG = {
        // Which route to load (1 = first route, 2 = second route, etc.)
        // Will fallback to first route if selected route doesn't exist
        ROUTE_INDEX: 1,

        // Enable fullscreen mode after loading route
        ENABLE_FULLSCREEN: true,

        // Hide the right sidebar after loading
        HIDE_SIDEBAR: true,

        // Show notifications
        SHOW_NOTIFICATIONS: true,

        // Notification duration in milliseconds (-1 for permanent)
        NOTIFICATION_DURATION: 5000
    };
    // ============================================

    // Simple notification system with stacking fix
    function showNotification(text, type = 'default', permanent = false) {
        if (!CONFIG.SHOW_NOTIFICATIONS) return;

        const notification = document.createElement('div');
        notification.className = `method-notification ${type}`;
        notification.textContent = text;

        // Calculate position based on existing notifications
        const existingNotifications = document.querySelectorAll('.method-notification');
        let topPosition = 90;
        existingNotifications.forEach(notif => {
            topPosition += notif.offsetHeight + 10; // 10px gap between notifications
        });

        notification.style.top = `${topPosition}px`;
        document.body.appendChild(notification);

        // Trigger animation
        setTimeout(() => notification.classList.add('show'), 10);

        // Auto-remove after duration
        if (CONFIG.NOTIFICATION_DURATION > 0) {
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.remove();
                    // Reposition remaining notifications
                    repositionNotifications();
                }, 300);
            }, permanent ? -1 : CONFIG.NOTIFICATION_DURATION);
        }
    }

    // Reposition all notifications to fill gaps
    function repositionNotifications() {
        const notifications = document.querySelectorAll('.method-notification');
        let topPosition = 90;
        notifications.forEach(notif => {
            notif.style.top = `${topPosition}px`;
            topPosition += notif.offsetHeight + 10;
        });
    }

    // Add notification styles
    const style = document.createElement('style');
    style.textContent = `
        .method-notification {
            position: fixed;
            right: 20px;
            background: #243743;
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            border: 2px solid #637cf9;
            box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            opacity: 0;
            transform: translateX(400px);
            transition: all 0.3s ease;
            max-width: 300px;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        }
        .method-notification.show {
            opacity: 1;
            transform: translateX(0);
        }
        .method-notification.error {
            background: #9c0000;
            border-color: #f96363;
        }
    `;
    document.head.appendChild(style);

    // Use simple element waiter
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver((mutations, obs) => {
                const element = document.querySelector(selector);
                if (element) {
                    obs.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`Timeout waiting for ${selector}`));
            }, timeout);
        });
    }

    // Helper function to click an element
    function clickElement(element) {
        if (element) {
            element.click();
            return true;
        }
        return false;
    }

    // Get route name from element
    function getRouteName(routeElement) {
        const nameElement = routeElement.querySelector('.dungeon-guide-route__name');
        return nameElement ? nameElement.textContent.trim() : 'Unknown Route';
    }

    // Get dungeon name from page
    function getDungeonName() {
        const titleElement = document.querySelector('.raid-boss-name');
        return titleElement ? titleElement.textContent.trim() : 'Unknown Dungeon';
    }

    // Main automation function for dungeon pages
    async function autoLoadRoute() {
        console.info('Starting auto-load sequence...');
        showNotification('🎮 Starting auto-load sequence...', 'default');

        try {
            const dungeonName = getDungeonName();

            // Wait a bit for page to fully load
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Step 1: Find and click the route load button
            console.info(`Looking for route #${CONFIG.ROUTE_INDEX} Load button...`);

            const allLoadButtons = await waitForElement('.dungeon-guide-route__load');
            const loadButtons = document.querySelectorAll('.dungeon-guide-route__load');

            let targetIndex = CONFIG.ROUTE_INDEX - 1; // Convert to 0-based index
            let loadButton = loadButtons[targetIndex];

            // Fallback to first route if selected route doesn't exist
            if (!loadButton && loadButtons.length > 0) {
                console.warn(`Route #${CONFIG.ROUTE_INDEX} not found, falling back to first route`);
                targetIndex = 0;
                loadButton = loadButtons[0];
            }

            if (loadButton) {
                // Get the route container to find the route name
                const routeContainer = loadButton.closest('.dungeon-guide-route');
                const routeName = getRouteName(routeContainer);

                console.info(`Clicking Load button for route: "${routeName}"`);
                showNotification(`📥 Loading route: ${routeName}`, 'default');

                clickElement(loadButton);
                await new Promise(resolve => setTimeout(resolve, 1500));

                showNotification(`✅ Route "${routeName}" loaded successfully!`, 'default');
            } else {
                console.error('No load buttons found');
                showNotification('❌ No routes found to load', 'error');
            }

            // Step 2: Enable fullscreen
            if (CONFIG.ENABLE_FULLSCREEN) {
                console.info('Looking for Fullscreen button...');
                const fullscreenButton = await waitForElement('#route-planner-fullscreen');

                if (fullscreenButton) {
                    console.info('Clicking Fullscreen button...');
                    clickElement(fullscreenButton);
                    await new Promise(resolve => setTimeout(resolve, 500));
                } else {
                    console.warn('Fullscreen button not found');
                }
            } else {
                console.info('Fullscreen disabled in config');
            }

            // Step 3: Hide right sidebar
            if (CONFIG.HIDE_SIDEBAR) {
                console.info('Looking for sidebar hide button...');
                const hideButton = await waitForElement('.route-rail-toggle');

                if (hideButton) {
                    console.info('Clicking hide sidebar button...');
                    clickElement(hideButton);
                } else {
                    console.warn('Sidebar hide button not found');
                }
            } else {
                console.info('Sidebar hiding disabled in config');
            }

            console.info('Auto-load sequence completed!');
            showNotification(`🎉 Auto-load completed for ${dungeonName}!`, 'default');

        } catch (error) {
            console.error('Error during auto-load:', error);
            showNotification(`❌ Error: ${error.message}`, 'error');
        }
    }

    // Add quick load buttons to dungeon list
    function addQuickLoadButtons() {
        console.debug('Adding quick load buttons...');

        let dungeonElements = document.querySelectorAll('.items-list .item-tile');

        dungeonElements.forEach(element => {
            // Skip if button already added
            if (element.dataset.quickloadAdded) return;
            element.dataset.quickloadAdded = 'true';

            element.style.cssText = `
                display: flex;
                flex-direction: row;
                flex-wrap: nowrap;
                align-items: center;
            `;

            // Get the dungeon URL
            let dungeonUrlEl = element.querySelector('a');
            let dungeonUrl = dungeonUrlEl.href;
            if (!dungeonUrl) return;

            dungeonUrlEl.style.width = "100%";

            // Don't add button to the main route-planner page link
            if (dungeonUrl.endsWith('/route-planner') || dungeonUrl.endsWith('/route-planner/')) return;

            // Get dungeon name for tooltip
            const dungeonNameEl = element.querySelector('.item-tile__name, h3, h4');
            const dungeonName = dungeonNameEl ? dungeonNameEl.textContent.trim() : 'dungeon';

            // Create the quick load button
            const button = document.createElement('button');
            button.textContent = '⚡';
            button.style.cssText = `
                padding: 4px 8px;
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                transition: background-color 0.3s;
            `;

            const routeText = CONFIG.ROUTE_INDEX === 1 ? 'first' :
                            CONFIG.ROUTE_INDEX === 2 ? 'second' :
                            `${CONFIG.ROUTE_INDEX}th`;
            button.title = `Quick Load: Open ${dungeonName} and auto-load ${routeText} route${CONFIG.ENABLE_FULLSCREEN ? ' in fullscreen' : ''}`;

            button.addEventListener('mouseover', () => {
                button.style.backgroundColor = '#45a049';
            });

            button.addEventListener('mouseout', () => {
                button.style.backgroundColor = '#4CAF50';
            });

            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                console.info(`Quick load clicked for: ${dungeonName}`);
                showNotification(`🚀 Opening ${dungeonName}...`, 'default');

                // Add autoload parameter to URL
                const url = new URL(dungeonUrl);
                url.searchParams.set('autoload', '1');

                // Navigate to the dungeon page with autoload parameter
                setTimeout(() => {
                    window.location.href = url.toString();
                }, 300);
            });

            // Insert the button before the dungeon element
            element.prepend(button);
        });
    }

    // Check if we're on a dungeon page with autoload parameter
    function checkAutoLoad() {
        const urlParams = new URLSearchParams(window.location.search);
        const currentPath = window.location.pathname;

        // Check if we're on a specific dungeon page (not the main list)
        const isDungeonPage = currentPath.includes('/route-planner/') &&
                             !currentPath.endsWith('/route-planner') &&
                             !currentPath.endsWith('/route-planner/');

        if (isDungeonPage && urlParams.get('autoload') === '1') {
            console.info('Autoload parameter detected!');
            autoLoadRoute();
            return true;
        }
        return false;
    }

    // Initialize script
    function init() {
        console.info('Script initialized');
        console.info('Configuration:', CONFIG);

        // Check if we should auto-load
        const isAutoLoading = checkAutoLoad();

        // If not auto-loading, add quick load buttons to the list page
        if (!isAutoLoading) {
            // Wait for page to load
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => {
                    setTimeout(addQuickLoadButtons, 1000);
                });
            } else {
                setTimeout(addQuickLoadButtons, 1000);
            }

            // Also observe for dynamic content loading
            const observer = new MutationObserver(() => {
                addQuickLoadButtons();
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }

    init();
})();
