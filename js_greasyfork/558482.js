// ==UserScript==
// @name         YouTube Clean & Fast (Hide UI/Spinner)
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      4
// @description  Hide all YouTube player UI (buttons, spinner, shadows, ads, branding, related videos suggestions when the video ends) immediately and show them only on mouse hover.
// @author       hacker09
// @match        *://www.youtube.com/embed/*
// @match        *://www.youtube.com/watch*
// @icon         https://www.youtube.com/s/desktop/03f86491/img/favicon.ico
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558482/YouTube%20Clean%20%20Fast%20%28Hide%20UISpinner%29.user.js
// @updateURL https://update.greasyfork.org/scripts/558482/YouTube%20Clean%20%20Fast%20%28Hide%20UISpinner%29.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const css = `
        /* === MAIN UI HIDING (Opacity 0 when mouse is outside PLAYER) === */

        /* 1. Top Controls */
        body.tm-clean-ui .ytp-chrome-top,
        /* 2. Bottom Controls */
        body.tm-clean-ui .ytp-chrome-bottom,
        /* 3. Shadows */
        body.tm-clean-ui .ytp-gradient-top,
        body.tm-clean-ui .ytp-gradient-bottom,
        /* 4. Center Play Button */
        body.tm-clean-ui .ytp-large-play-button,
        /* 5. Spinner */
        body.tm-clean-ui .ytp-spinner,
        /* 6. Bezel */
        body.tm-clean-ui .ytp-bezel-text-wrapper,
        body.tm-clean-ui .ytp-bezel,
        /* 7. Branding & Popups */
        body.tm-clean-ui .ytp-watermark,
        body.tm-clean-ui .ytp-upnext,
        body.tm-clean-ui .ytp-pause-overlay-container,
        body.tm-clean-ui .ytp-share-panel,
        body.tm-clean-ui .ytp-storyboard-framepreview,
        body.tm-clean-ui .ytp-cued-thumbnail-overlay,
        /* 8. Top Alerts */
        body.tm-clean-ui .ytp-caption-window-top,
        /* 9. Suggested Ads */
        body.tm-clean-ui .ytp-suggested-action,
        body.tm-clean-ui .ytp-featured-product,
        body.tm-clean-ui .ytp-ad-overlay-container,
        body.tm-clean-ui .ytp-ad-overlay-slot,
        body.tm-clean-ui .ytp-suggested-action-badge,
        /* 10. Channel Branding */
        body.tm-clean-ui .iv-branding,
        body.tm-clean-ui .ytp-fullscreen-quick-actions,
        /* 11. END SCREEN SUGGESTIONS */
        body.tm-clean-ui .ytp-ce-element,
        body.tm-clean-ui .ytp-ce-covering-overlay,
        body.tm-clean-ui .ytp-ce-element-shadow,
        body.tm-clean-ui .ytp-ce-video-title,
        body.tm-clean-ui .ytp-ce-video-duration,
        body.tm-clean-ui .ytp-ce-channel-title,
        body.tm-clean-ui .ytp-ce-subscribe-container
        {
            opacity: 0 !important;
            visibility: hidden !important;
            display: none !important;
            transition: opacity 0.1s ease-out !important;
        }

        /* === EXCEPTIONS (Always Visible) === */
        body.tm-clean-ui .ytp-caption-window-bottom,
        body.tm-clean-ui .html5-main-video {
            opacity: 1 !important;
            visibility: visible !important;
            display: block !important;
        }

        /* === TRANSITIONS === */
        .ytp-chrome-top,
        .ytp-chrome-bottom,
        .ytp-caption-window-top,
        .ytp-ad-overlay-container,
        .ytp-ce-element {
            transition: opacity 0.1s ease-in !important;
        }
    `;

  // Inject CSS immediately
  const styleNode = document.createElement('style');
  styleNode.type = 'text/css';
  styleNode.appendChild(document.createTextNode(css));
  (document.head || document.documentElement).appendChild(styleNode);

  function startDelegate() {
    if (!document.body) return;

    // Default to hidden
    document.body.classList.add('tm-clean-ui');

    // Use a global mousemove listener to check where the mouse is
    // This works even if the player is replaced or loaded late
    document.addEventListener('mousemove', (e) => {
      // Check if the hover target is inside the player container (#movie_player)
      const isInsidePlayer = e.target.closest('#movie_player');

      if (isInsidePlayer) {
        // We are inside the player (including bottom bar) -> Show UI
        if (document.body.classList.contains('tm-clean-ui')) {
          document.body.classList.remove('tm-clean-ui');
        }
      } else {
        // We are strictly outside the player -> Hide UI
        if (!document.body.classList.contains('tm-clean-ui')) {
          document.body.classList.add('tm-clean-ui');
        }
      }
    }, true); // Capture phase to ensure we catch it
  }

  // Observer to trigger immediately when body is created (No 50ms timer)
  if (document.body) {
    startDelegate();
  } else {
    const observer = new MutationObserver((mutations, obs) => {
      if (document.body) {
        startDelegate();
        obs.disconnect();
      }
    });
    observer.observe(document.documentElement, { childList: true });
  }

})();