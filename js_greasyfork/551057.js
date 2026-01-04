// ==UserScript==
// @name         Selective Fullscreen Blocker
// @namespace    http://tampermonkey.net/
// @version      3.1
// @description  Blocks forced fullscreen but allows F11 manual fullscreen
// @match        *://*/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/551057/Selective%20Fullscreen%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/551057/Selective%20Fullscreen%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== [1] BLOCK AUTOMATIC/SCRIPTED FULLSCREEN APIs =====
    const blockAutomaticFullscreen = (element) => {
        const descriptors = {
            'requestFullscreen': null,
            'webkitRequestFullscreen': null,
            'mozRequestFullScreen': null,
            'msRequestFullscreen': null,
            // Keep exit methods available for F11 to work properly
            'fullscreenEnabled': false,
            'webkitFullscreenEnabled': false,
            'mozFullScreenEnabled': false,
            'msFullscreenEnabled': false
        };

        for (const [prop, value] of Object.entries(descriptors)) {
            try {
                Object.defineProperty(element, prop, {
                    value,
                    writable: false,
                    configurable: false
                });
            } catch (e) {}
        }
    };

    // Block automatic fullscreen on document, HTML, and elements
    blockAutomaticFullscreen(document);
    blockAutomaticFullscreen(HTMLElement.prototype);
    blockAutomaticFullscreen(Element.prototype);

    // ===== [2] MUTATIONOBSERVER (BLOCK NEW ELEMENTS) =====
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    blockAutomaticFullscreen(node);
                }
            });
        });
    });
    observer.observe(document, { childList: true, subtree: true });

    // ===== [3] SELECTIVE FORCE-EXIT - Only for scripted fullscreen =====
    let isF11Fullscreen = false;

    setInterval(() => {
        // Only exit if fullscreen was triggered automatically (not by F11)
        if ((document.fullscreenElement ||
             document.webkitFullscreenElement ||
             document.mozFullScreenElement ||
             document.msFullscreenElement) && !isF11Fullscreen) {
            document.exitFullscreen?.();
            document.webkitExitFullscreen?.();
            document.mozCancelFullScreen?.();
            document.msExitFullscreen?.();
        }
    }, 100);

    // ===== [4] ALLOW F11, BLOCK OTHER FULLSCREEN KEYS =====
    document.addEventListener('keydown', (e) => {
        // ALLOW F11 to work normally
        if (e.key === 'F11') {
            isF11Fullscreen = true;
            // Don't prevent default - let F11 work
            return;
        }

        // Block other fullscreen shortcuts
        if ((e.ctrlKey && e.key === 'Enter') ||
            (e.key === 'f' && (e.ctrlKey || e.metaKey))) {
            e.preventDefault();
            e.stopImmediatePropagation();
            return false;
        }
    }, true);

    // Reset F11 flag when exiting fullscreen
    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            isF11Fullscreen = false;
        }
    });

    document.addEventListener('webkitfullscreenchange', () => {
        if (!document.webkitFullscreenElement) {
            isF11Fullscreen = false;
        }
    });

    // ===== [5] OVERRIDE VIDEO PLAYER FULLSCREEN BUTTONS =====
    document.addEventListener('DOMContentLoaded', () => {
        document.querySelectorAll('button, div, [role="button"]').forEach((btn) => {
            btn.addEventListener('click', (e) => {
                if (btn.innerText.includes('Fullscreen') ||
                    btn.getAttribute('aria-label')?.includes('Fullscreen') ||
                    btn.classList.contains('fullscreen') ||
                    btn.querySelector('[d*="M3 3v18h18"]')) { // Common fullscreen icon path
                    e.stopImmediatePropagation();
                    e.preventDefault();
                }
            }, true);
        });
    });

    // ===== [6] BLOCK COMMON SMART TEST FULLSCREEN TRIGGERS =====
    window.addEventListener('load', () => {
        // Block fullscreen on user gestures that might be smart test triggers
        document.addEventListener('click', (e) => {
            // If this is likely a smart test fullscreen trigger
            if (e.target.tagName === 'CANVAS' ||
                e.target.classList.contains('test-canvas') ||
                e.target.id.includes('test') ||
                e.target.id.includes('exam')) {
                setTimeout(() => {
                    if (document.fullscreenElement && !isF11Fullscreen) {
                        document.exitFullscreen?.();
                    }
                }, 50);
            }
        }, true);
    });
})();