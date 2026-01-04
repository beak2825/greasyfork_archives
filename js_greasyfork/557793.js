// ==UserScript==
// @name         YouTube Ask About Video Maximizer
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Maximizes the "Ask about this video" canvas to fill the entire page on YouTube
// @author       You
// @match        https://www.youtube.com/watch*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/557793/YouTube%20Ask%20About%20Video%20Maximizer.user.js
// @updateURL https://update.greasyfork.org/scripts/557793/YouTube%20Ask%20About%20Video%20Maximizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add global styles
    GM_addStyle(`
        .ask-maximized {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100vw !important;
            height: 100vh !important;
            z-index: 9999 !important;
            background: var(--yt-spec-base-background) !important;
            margin: 0 !important;
            padding: 0 !important;
        }

        .ask-maximized #content {
            width: 100% !important;
            height: 100% !important;
            max-height: none !important;
            display: flex !important;
            flex-direction: column !important;
        }

        .ask-maximized #header {
            padding: 16px 24px !important;
            box-sizing: border-box !important;
            flex-shrink: 0 !important;
        }

        .ask-maximized yt-section-list-renderer {
            flex: 1 !important;
            min-height: 0 !important;
            overflow: auto !important;
        }

        .ask-maximized #content > * {
            width: 100% !important;
            height: 100% !important;
            max-height: none !important;
        }

        .ask-maximized yt-item-section-renderer {
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            display: flex !important;
            flex-direction: column !important;
            padding: 16px 24px !important;
            box-sizing: border-box !important;
        }

        .ask-maximized you-chat-item-view-model,
        .ask-maximized yt-chat-user-turn-view-model {
            width: 100% !important;
            height: auto !important;
            flex-shrink: 0 !important;
            margin-bottom: 12px !important;
        }

        .ask-maximized ytd-watch-flexy {
            display: none !important;
        }
    `);

    function maximizeAskPanel() {
        const askPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"]');

        if (askPanel && askPanel.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED') {
            // Add our maximized class
            askPanel.classList.add('ask-maximized');

            // Force a reflow to ensure styles are applied
            void askPanel.offsetHeight;

            // Move the panel to the document body to avoid any parent constraints
            if (askPanel.parentElement !== document.body) {
                document.body.appendChild(askPanel);
            }

            console.log('Ask panel maximized');
        }
    }

    function restoreNormalView() {
        const askPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="PAyouchat"]');
        const panelsContainer = document.querySelector('#panels');

        if (askPanel && askPanel.getAttribute('visibility') !== 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED') {
            // Remove our maximized class
            askPanel.classList.remove('ask-maximized');

            // Move the panel back to its original position if needed
            if (panelsContainer && askPanel.parentElement === document.body) {
                panelsContainer.appendChild(askPanel);
            }

            console.log('Normal view restored');
        }
    }

    // Create a MutationObserver to watch for changes
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'attributes' && mutation.attributeName === 'visibility') {
                const target = mutation.target;
                if (target.getAttribute('target-id') === 'PAyouchat') {
                    if (target.getAttribute('visibility') === 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED') {
                        setTimeout(maximizeAskPanel, 100);
                    } else {
                        restoreNormalView();
                    }
                }
            }
        });
    });

    // Start observing when the page loads
    function init() {
        const panels = document.querySelector('#panels');
        if (panels) {
            observer.observe(panels, {
                attributes: true,
                attributeFilter: ['visibility'],
                subtree: true
            });
            console.log('YouTube Ask Maximizer initialized');
        } else {
            // Retry if panels not found yet
            setTimeout(init, 1000);
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Also check on navigation (YouTube is a SPA)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            init();
        }
    }).observe(document, {subtree: true, childList: true});

})();