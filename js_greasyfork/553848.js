// ==UserScript==
// @name         Tenor Multi-User Blocker - Enhanced
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Blocks GIFs from multiple users in Tenor search results with debug mode
// @author       Ruben Van den Broeck
// @match        https://tenor.com/*
// @license MIT
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553848/Tenor%20Multi-User%20Blocker%20-%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/553848/Tenor%20Multi-User%20Blocker%20-%20Enhanced.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const DEBUG_MODE = true; // Set to false for production

    // Add usernames separated by commas
    const BLOCKED_USERNAMES = "Blazzord, Lastfridayart, TobiasDavidson";

    // Parse blocked usernames into an array and trim whitespace
    const blockedUsersArray = BLOCKED_USERNAMES.split(',').map(name => name.trim()).filter(name => name.length > 0);

    const API_PATTERNS = [
        /\/gifapi\//,
        /\/v1\//,
        /\/v2\//,
        /\/search\//,
        /\/trending\//,
        /\/categories\//,
        /\/suggestions\//
    ];

    // Logging function
    function debugLog(...args) {
        if (DEBUG_MODE) {
            console.log('[Tenor Blocker]', ...args);
        }
    }

    // Initialize
    debugLog('Blocked users:', blockedUsersArray);

    // Filter function to remove unwanted GIFs
    function filterTenorResponse(data) {
        if (!data || !data.results || !Array.isArray(data.results)) {
            debugLog('Invalid API response structure');
            return data;
        }

        const originalCount = data.results.length;
        const blockedCounts = {};

        data.results = data.results.filter(item => {
            const hasUser = item.user && item.user.username;
            if (!hasUser) return true;

            const isBlocked = blockedUsersArray.includes(item.user.username);

            if (isBlocked) {
                blockedCounts[item.user.username] = (blockedCounts[item.user.username] || 0) + 1;
                debugLog(`Blocked GIF from ${item.user.username}:`, item.id, item.title);
            }

            return !isBlocked;
        });

        const totalBlocked = originalCount - data.results.length;
        if (totalBlocked > 0) {
            debugLog(`Filtered ${totalBlocked} total items:`, blockedCounts);
        }

        return data;
    }

    // Main blocking function
    function startBlocking() {
        debugLog('Starting multi-user blocker...');

        // Intercept Fetch API
        if (window.fetch) {
            const originalFetch = window.fetch;
            window.fetch = async function(...args) {
                const requestUrl = args[0] instanceof Request ? args[0].url : args[0];

                if (API_PATTERNS.some(pattern => pattern.test(requestUrl))) {
                    debugLog('Intercepted fetch request:', requestUrl);

                    const response = await originalFetch.apply(this, args);
                    try {
                        const clonedResponse = response.clone();
                        const json = await clonedResponse.json();
                        const filtered = filterTenorResponse(json);

                        return new Response(JSON.stringify(filtered), {
                            status: response.status,
                            statusText: response.statusText,
                            headers: response.headers
                        });
                    } catch (e) {
                        debugLog('Error processing fetch response:', e);
                        return response;
                    }
                }
                return originalFetch.apply(this, args);
            };
        }

        // Intercept XHR requests
        if (window.XMLHttpRequest) {
            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
                this._requestUrl = url;
                return originalOpen.apply(this, arguments);
            };

            const originalSend = XMLHttpRequest.prototype.send;
            XMLHttpRequest.prototype.send = function(body) {
                if (this._requestUrl && API_PATTERNS.some(pattern => pattern.test(this._requestUrl))) {
                    debugLog('Intercepted XHR request:', this._requestUrl);

                    const originalOnload = this.onload;
                    this.onload = function(e) {
                        if (this.responseText) {
                            try {
                                const json = JSON.parse(this.responseText);
                                const filtered = filterTenorResponse(json);
                                Object.defineProperty(this, 'responseText', {
                                    value: JSON.stringify(filtered)
                                });
                            } catch (error) {
                                debugLog('Error processing XHR response:', error);
                            }
                        }
                        if (originalOnload) return originalOnload.call(this, e);
                    };
                }
                return originalSend.apply(this, arguments);
            };
        }

        // Fallback: Clean DOM periodically
        setInterval(() => {
            const gifElements = document.querySelectorAll('div[data-username], div.gif');
            gifElements.forEach(el => {
                const username = el.getAttribute('data-username') ||
                                el.querySelector('.gif-user')?.textContent;

                if (username && blockedUsersArray.some(blocked => username.includes(blocked))) {
                    debugLog('Removing DOM element:', el);
                    el.remove();
                }
            });
        }, 3000);
    }

    // Start the blocking process
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startBlocking);
    } else {
        startBlocking();
    }
})();