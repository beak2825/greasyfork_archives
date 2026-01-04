// ==UserScript==
// @name         Nuclear Fullscreen Blocker (F11 Allowed)
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Block websites from automatically entering fullscreen mode but allow F11
// @author       You
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550542/Nuclear%20Fullscreen%20Blocker%20%28F11%20Allowed%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550542/Nuclear%20Fullscreen%20Blocker%20%28F11%20Allowed%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Block fullscreen requests by overriding the fullscreen API
    function blockFullscreen() {
        // Override Element.requestFullscreen
        if (Element.prototype.requestFullscreen) {
            Element.prototype.requestFullscreen = function() {
                console.log('Automatic fullscreen request blocked by Nuclear Fullscreen Blocker');
                return Promise.reject(new Error('Automatic fullscreen blocked by user script'));
            };
        }

        // Override Element.webkitRequestFullscreen (Safari/Chrome)
        if (Element.prototype.webkitRequestFullscreen) {
            Element.prototype.webkitRequestFullscreen = function() {
                console.log('Automatic fullscreen request blocked by Nuclear Fullscreen Blocker');
                return Promise.reject(new Error('Automatic fullscreen blocked by user script'));
            };
        }

        // Override Element.mozRequestFullScreen (Firefox)
        if (Element.prototype.mozRequestFullScreen) {
            Element.prototype.mozRequestFullScreen = function() {
                console.log('Automatic fullscreen request blocked by Nuclear Fullscreen Blocker');
                return Promise.reject(new Error('Automatic fullscreen blocked by user script'));
            };
        }

        // Override Element.msRequestFullscreen (IE/Edge)
        if (Element.prototype.msRequestFullscreen) {
            Element.prototype.msRequestFullscreen = function() {
                console.log('Automatic fullscreen request blocked by Nuclear Fullscreen Blocker');
                return Promise.reject(new Error('Automatic fullscreen blocked by user script'));
            };
        }

        // Allow document.exitFullscreen to work normally
        const originalExitFullscreen = Document.prototype.exitFullscreen;
        Document.prototype.exitFullscreen = function() {
            return originalExitFullscreen.call(this);
        };

        // Block fullscreenchange events from triggering unwanted behavior
        // but only prevent default, don't stop propagation entirely
        document.addEventListener('fullscreenchange', function(e) {
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }, true);

        document.addEventListener('webkitfullscreenchange', function(e) {
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }, true);

        document.addEventListener('mozfullscreenchange', function(e) {
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }, true);

        document.addEventListener('MSFullscreenChange', function(e) {
            if (!e.defaultPrevented) {
                e.preventDefault();
            }
        }, true);
    }

    // Remove F11 blocking - allow browser's native F11 fullscreen to work
    // Only block other keyboard shortcuts that websites might use
    document.addEventListener('keydown', function(e) {
        // Block Ctrl+Enter or Cmd+Enter (common website fullscreen shortcuts)
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            e.preventDefault();
            e.stopImmediatePropagation();
            console.log('Website fullscreen shortcut blocked');
            return false;
        }

        // Block common media fullscreen shortcuts (like 'f' key on video players)
        if (e.target.tagName === 'VIDEO' || e.target.tagName === 'AUDIO') {
            if (e.key === 'f' || e.key === 'F') {
                e.preventDefault();
                e.stopImmediatePropagation();
                console.log('Media fullscreen shortcut blocked');
                return false;
            }
        }
    }, true);

    // Block context menu fullscreen options for websites
    document.addEventListener('contextmenu', function(e) {
        // Only prevent if it's likely a fullscreen context menu option
        const target = e.target;
        if (target.tagName === 'VIDEO' || target.tagName === 'AUDIO' ||
            target.classList.contains('video-player') ||
            target.closest('video, audio, [class*="video"], [class*="player"]')) {
            e.stopPropagation();
        }
    }, true);

    // Block fullscreen via iframe attempts
    window.addEventListener('DOMContentLoaded', function() {
        const iframes = document.getElementsByTagName('iframe');
        for (let iframe of iframes) {
            try {
                iframe.addEventListener('load', function() {
                    try {
                        // Block fullscreen in iframes too
                        if (iframe.contentDocument) {
                            const iframeElement = iframe.contentDocument.defaultView.Element;
                            if (iframeElement && iframeElement.prototype) {
                                iframeElement.prototype.requestFullscreen = function() {
                                    return Promise.reject(new Error('Automatic fullscreen blocked'));
                                };
                            }
                        }
                    } catch (e) {
                        // Cross-origin iframe, can't modify
                    }
                });
            } catch (e) {
                // Cross-origin iframe, can't access
            }
        }
    });

    // Initialize the blocker
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', blockFullscreen);
    } else {
        blockFullscreen();
    }

    // Re-block after dynamic content loads
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                // Re-apply blocking to new elements if needed
                setTimeout(blockFullscreen, 100);
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    console.log('Nuclear Fullscreen Blocker activated - F11 is allowed');
})();