// ==UserScript==
// @name         Nuclear Fullscreen Blocker (F11 Allowed) - Fixed
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Block websites from automatically entering fullscreen mode but allow F11
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550660/Nuclear%20Fullscreen%20Blocker%20%28F11%20Allowed%29%20-%20Fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/550660/Nuclear%20Fullscreen%20Blocker%20%28F11%20Allowed%29%20-%20Fixed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Block fullscreen requests by overriding the fullscreen API
    function blockFullscreen() {
        // Override Element.requestFullscreen
        const originalRequestFullscreen = Element.prototype.requestFullscreen;
        Element.prototype.requestFullscreen = function() {
            console.log('Fullscreen request blocked by Nuclear Fullscreen Blocker');
            return Promise.reject(new Error('Automatic fullscreen blocked by user script'));
        };

        // Override browser-specific fullscreen methods
        const methods = [
            'webkitRequestFullscreen',
            'mozRequestFullScreen', 
            'msRequestFullscreen'
        ];

        methods.forEach(method => {
            if (Element.prototype[method]) {
                Element.prototype[method] = function() {
                    console.log('Fullscreen request blocked by Nuclear Fullscreen Blocker');
                    return Promise.reject(new Error('Automatic fullscreen blocked by user script'));
                };
            }
        });

        // Allow exitFullscreen to work normally
        const originalExitFullscreen = Document.prototype.exitFullscreen;
        if (originalExitFullscreen) {
            Document.prototype.exitFullscreen = function() {
                return originalExitFullscreen.call(this);
            };
        }

        // Also allow browser-specific exit methods
        const exitMethods = [
            'webkitExitFullscreen',
            'mozCancelFullScreen',
            'msExitFullscreen'
        ];

        exitMethods.forEach(method => {
            if (Document.prototype[method]) {
                const originalMethod = Document.prototype[method];
                Document.prototype[method] = function() {
                    return originalMethod.call(this);
                };
            }
        });
    }

    // Block keyboard shortcuts that websites use for fullscreen
    function blockFullscreenShortcuts() {
        document.addEventListener('keydown', function(e) {
            // Block common website fullscreen shortcuts but allow F11
            const blockedShortcuts = [
                // Ctrl/Cmd + Enter
                (e.ctrlKey || e.metaKey) && e.key === 'Enter',
                // 'f' key on video elements
                (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO') && (e.key === 'f' || e.key === 'F'),
                // Space bar on video elements (might trigger fullscreen)
                (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO') && e.key === ' ' && !e.ctrlKey && !e.metaKey
            ];

            if (blockedShortcuts.some(condition => condition)) {
                e.preventDefault();
                e.stopImmediatePropagation();
                console.log('Fullscreen shortcut blocked');
                return false;
            }
        }, true);
    }

    // Block fullscreen via click events on buttons/elements
    function blockFullscreenClicks() {
        document.addEventListener('click', function(e) {
            const target = e.target;
            // Check if this might be a fullscreen button
            if (target.hasAttribute('onclick') && 
                target.getAttribute('onclick').includes('fullscreen')) {
                e.preventDefault();
                e.stopImmediatePropagation();
                console.log('Fullscreen click blocked');
                return false;
            }
        }, true);
    }

    // Initialize everything
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', function() {
            blockFullscreen();
            blockFullscreenShortcuts();
            blockFullscreenClicks();
        });
    } else {
        blockFullscreen();
        blockFullscreenShortcuts();
        blockFullscreenClicks();
    }

    // Re-block if new content is added dynamically
    const observer = new MutationObserver(function(mutations) {
        let shouldReBlock = false;
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length > 0) {
                shouldReBlock = true;
            }
        });
        
        if (shouldReBlock) {
            setTimeout(blockFullscreen, 50);
        }
    });

    if (document.body) {
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    console.log('Nuclear Fullscreen Blocker activated - F11 fullscreen is allowed');
})();