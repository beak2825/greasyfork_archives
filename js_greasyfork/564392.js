// ==UserScript==
// @name        Disable animations
// @description Speed up browsing by disabling CSS and JavaScript animations
// @version     2026.01.29
// @author      Claude Sonnet 4.5
// @grant       none
// @inject-into auto
// @run-at      document-start
// @match       *://*/*
// @namespace https://greasyfork.org/users/1519047
// @downloadURL https://update.greasyfork.org/scripts/564392/Disable%20animations.user.js
// @updateURL https://update.greasyfork.org/scripts/564392/Disable%20animations.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Disable CSS animations and transitions
    const injectCSS = () => {
        const style = document.createElement('style');
        style.id = 'disable-animations-style';
        style.textContent = `
            *, *::before, *::after {
                animation-duration: 0ms !important;
                animation-delay: 0ms !important;
                animation-timing-function: step-start !important;

                transition-duration: 0ms !important;
                transition-delay: 0ms !important;
                transition-timing-function: step-start !important;

                scroll-behavior: auto !important;
            }
        `;

        const target = document.head || document.documentElement;
        if (target && !document.getElementById('disable-animations-style')) {
            target.appendChild(style);
        }
    };

    // Inject CSS as early as possible
    if (document.documentElement) {
        injectCSS();
    } else {
        // Fallback if documentElement isn't ready
        const observer = new MutationObserver(() => {
            if (document.documentElement) {
                injectCSS();
                observer.disconnect();
            }
        });
        observer.observe(document, { childList: true });
    }

    // Disable JavaScript animations
    const disableJSAnimations = () => {
        try {
            // Disable jQuery animations
            const jQueryInstances = [
                window.jQuery,
                window.$ && window.$.fx ? window.$ : null,
                window.wrappedJSObject?.jQuery,
                window.wrappedJSObject?.$ && window.wrappedJSObject.$.fx ? window.wrappedJSObject.$ : null
            ];

            jQueryInstances.forEach(jq => {
                if (jq && jq.fx) {
                    jq.fx.off = true;
                }
            });

            // Disable Velocity.js animations
            if (window.Velocity) {
                window.Velocity.mock = true;
            }
            if (window.wrappedJSObject?.Velocity) {
                window.wrappedJSObject.Velocity.mock = true;
            }

            // Override requestAnimationFrame to reduce animation callbacks (optional, aggressive)
            // Uncomment if you want even more aggressive animation blocking:
            /*
            const originalRAF = window.requestAnimationFrame;
            window.requestAnimationFrame = function(callback) {
                return originalRAF.call(this, function(timestamp) {
                    callback(timestamp);
                });
            };
            */
        } catch (e) {
            console.debug('Animation disabler: Error disabling JS animations', e);
        }
    };

    // Run JS animation disabling on load and periodically check
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', disableJSAnimations);
    } else {
        disableJSAnimations();
    }

    window.addEventListener('load', disableJSAnimations);

    // Re-check after a delay in case jQuery loads late
    setTimeout(disableJSAnimations, 1000);
})();