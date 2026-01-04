// ==UserScript==
// @name         Prevent Erome Redirects and Popups
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Blocks redirects and popups URLs on Erome
// @author       nereids
// @icon         https://icons.duckduckgo.com/ip3/erome.com.ico
// @license      MIT
// @match        https://erome.com/*
// @match        https://www.erome.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553551/Prevent%20Erome%20Redirects%20and%20Popups.user.js
// @updateURL https://update.greasyfork.org/scripts/553551/Prevent%20Erome%20Redirects%20and%20Popups.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of blocked URL patterns
    const blockedPatterns = [
        'brightadnetwork.com',
        'pemsrv.com',
        '/jump/next.php',
        'splash.php'
    ];

    // Function to check if URL matches any blocked pattern
    function isBlockedUrl(url) {
        return url && typeof url === 'string' && blockedPatterns.some(pattern => url.includes(pattern));
    }

    // Log blocked attempts for debugging
    function logBlocked(action, url) {
        console.log(`[Erome Redirect Blocker v0.6] ${action} blocked: ${url}`);
    }

    // Override window.open to block popups
    const originalOpen = window.open;
    window.open = function(url, ...args) {
        if (isBlockedUrl(url)) {
            logBlocked('Popup', url);
            return null;
        }
        return originalOpen.apply(this, [url, ...args]);
    };

    // Override location.replace
    const originalReplace = window.location.replace;
    window.location.replace = function(url) {
        if (isBlockedUrl(url)) {
            logBlocked('Replace redirect', url);
            return;
        }
        return originalReplace.apply(window.location, arguments);
    };

    // Override location.href setter
    let hrefValue = window.location.href;
    Object.defineProperty(window.location, 'href', {
        get: function() {
            return hrefValue;
        },
        set: function(value) {
            if (isBlockedUrl(value)) {
                logBlocked('href setter redirect', value);
                return hrefValue;
            }
            hrefValue = value;
            window.location.replace(value);
            return hrefValue;
        },
        enumerable: true,
        configurable: true
    });

    // Block clicks and form submissions
    function blockEvent(event, url) {
        if (isBlockedUrl(url)) {
            logBlocked('Event', url);
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
            return true;
        }
        return false;
    }

    // Handle all click events
    document.addEventListener('click', function(event) {
        let target = event.target;
        while (target && target.tagName !== 'A' && target.tagName !== 'FORM') {
            target = target.parentElement;
        }
        if (target && target.tagName === 'A' && target.href) {
            blockEvent(event, target.href);
        } else if (target && target.tagName === 'FORM' && target.action) {
            blockEvent(event, target.action);
        }
    }, { capture: true, passive: false });

    // Block navigation via beforeunload
    window.addEventListener('beforeunload', function(event) {
        if (isBlockedUrl(window.location.href)) {
            logBlocked('Beforeunload navigation', window.location.href);
            event.preventDefault();
            event.returnValue = '';
            window.history.back();
        }
    }, { capture: true });

    // Block popstate navigation
    window.addEventListener('popstate', function(event) {
        if (isBlockedUrl(window.location.href)) {
            logBlocked('Popstate navigation', window.location.href);
            window.history.back();
        }
    }, { capture: true });

    // Monitor DOM changes for links, scripts, and iframes
    const domObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'A' && node.href && isBlockedUrl(node.href)) {
                    logBlocked('Dynamic link', node.href);
                    node.href = '#';
                    node.onclick = function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        return false;
                    };
                }
                if (node.tagName === 'SCRIPT' && node.src && isBlockedUrl(node.src)) {
                    logBlocked('Script load', node.src);
                    node.remove();
                }
                if (node.tagName === 'IFRAME' && node.src && isBlockedUrl(node.src)) {
                    logBlocked('Iframe load', node.src);
                    node.remove();
                }
            });
        });
    });

    // Observe DOM changes
    domObserver.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // Block meta refresh redirects
    const metaObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            mutation.addedNodes.forEach(function(node) {
                if (node.tagName === 'META' && node.httpEquiv && node.httpEquiv.toLowerCase() === 'refresh') {
                    const content = node.getAttribute('content');
                    if (content && content.includes('url=') && isBlockedUrl(content.split('url=')[1])) {
                        logBlocked('Meta refresh', content);
                        node.remove();
                    }
                }
            });
        });
    });

    // Observe meta tag additions
    metaObserver.observe(document.head, {
        childList: true,
        subtree: true
    });

    // Simplified setTimeout override
    const originalSetTimeout = window.setTimeout;
    window.setTimeout = function(callback, delay, ...args) {
        if (typeof callback === 'function') {
            return originalSetTimeout(function() {
                const originalLocation = window.location.href;
                const result = callback.apply(this, arguments);
                if (window.location.href !== originalLocation && isBlockedUrl(window.location.href)) {
                    logBlocked('setTimeout location change', window.location.href);
                    window.history.back();
                }
                return result;
            }, delay, ...args);
        }
        return originalSetTimeout(callback, delay, ...args);
    };

    // Simplified setInterval override
    const originalSetInterval = window.setInterval;
    window.setInterval = function(callback, delay, ...args) {
        if (typeof callback === 'function') {
            return originalSetInterval(function() {
                const originalLocation = window.location.href;
                const result = callback.apply(this, arguments);
                if (window.location.href !== originalLocation && isBlockedUrl(window.location.href)) {
                    logBlocked('setInterval location change', window.location.href);
                    window.history.back();
                }
                return result;
            }, delay, ...args);
        }
        return originalSetInterval(callback, delay, ...args);
    };

    // Fallback: Check and revert location
    setInterval(function() {
        if (isBlockedUrl(window.location.href)) {
            logBlocked('Fallback location check', window.location.href);
            window.history.back();
        }
    }, 200);

})();