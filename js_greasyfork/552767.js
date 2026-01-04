// ==UserScript==
// @name         YouTube 2024 Like/Dislike Buttons & No Quick Action Bar In Full Screen
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Restores classic 2024 like button icons, fills them on click without visual bugs, and removes the action bar when in full screen.
// @author       ChatGPT & Google Gemini
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552767/YouTube%202024%20LikeDislike%20Buttons%20%20No%20Quick%20Action%20Bar%20In%20Full%20Screen.user.js
// @updateURL https://update.greasyfork.org/scripts/552767/YouTube%202024%20LikeDislike%20Buttons%20%20No%20Quick%20Action%20Bar%20In%20Full%20Screen.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // SVG icon for the OUTLINE (default) like button
    const LIKE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="currentColor" d="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h14.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.01,20,17.43,20H8v-8.61l5.6-6.06c0.19-0.21,0.48-0.33,0.78-0.33c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h5.58C19.14,12,19.6,12.44,19.98,13.17z"></path></svg>`;

    // SVG icon for the FILLED (active) like button
    const LIKE_FILLED_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="currentColor" d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path></svg>`;

    // SVG icon for the OUTLINE (default) dislike button
    const DISLIKE_SVG = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
      <path fill="currentColor" d="M17 4H6.57c-1.07 0-1.98.67-2.19 1.61l-1.34 6C2.77 12.85 3.82 14 5.23 14h4.23l-1.52 4.94C7.62 19.97 8.46 21 9.62 21c.58 0 1.14-.24 1.52-.65L17 14h4V4h-4zm-6.6 15.67c-.19.21-.48.33-.78.33-.26 0-.5-.11-.63-.3-.07-.1-.15-.26-.09-.47l1.52-4.94.4-1.29H5.23c-.41 0-.8-.17-1.03-.46-.12-.15-.25-.4-.18-.72l1.34-6c.1-.47.61-.82 1.21-.82H16v8.61l-5.6 6.06zM20 13h-3V5h3v8z"/>
    </svg>`;

    // SVG icon for the FILLED (active) dislike button
    const DISLIKE_FILLED_SVG = `<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24"><path fill="currentColor" d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14-.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path></svg>`;

    // **Inject CSS to prevent icons from resizing on click**
    GM_addStyle(`
        like-button-view-model button:hover .classic-like-svg,
        like-button-view-model button:active .classic-like-svg,
        dislike-button-view-model button:hover .classic-dislike-svg,
        dislike-button-view-model button:active .classic-dislike-svg {
            transform: none !important;
        }
    `);

    function createClassicSVG(svg, className, isLikeButton) {
        const span = document.createElement('span');
        span.className = className;
        span.style.width = '24px';
        span.style.height = '24px';
        span.style.display = 'inline-block';
        span.style.verticalAlign = 'middle';
        span.style.backgroundColor = 'currentColor';
        span.style.mask = `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}") no-repeat center / contain`;
        span.style.webkitMask = span.style.mask;

        if (isLikeButton) {
            // Add space between the like icon and the count number
            span.style.marginRight = '6px';
        } else {
            // **Positioning for the dislike button**
            span.style.marginRight = '6px'; // Add space to its right (moves it left from the text)
            span.style.position = 'relative';
            span.style.top = '1px'; // Move it down slightly to prevent cutoff
        }
        return span;
    }

    // Function to update the fill state of a single button
    function updateButtonFill(button) {
        const isLikeButton = button.closest('like-button-view-model');
        const pressed = button.getAttribute('aria-pressed') === 'true';
        const span = button.querySelector(isLikeButton ? '.classic-like-svg' : '.classic-dislike-svg');
        if (!span) return;

        const newSVG = isLikeButton ? (pressed ? LIKE_FILLED_SVG : LIKE_SVG) : (pressed ? DISLIKE_FILLED_SVG : DISLIKE_SVG);
        const newMask = `url("data:image/svg+xml;utf8,${encodeURIComponent(newSVG)}") no-repeat center / contain`;

        if (span.style.mask !== newMask) {
            span.style.mask = newMask;
            span.style.webkitMask = newMask;
        }
    }

    // Main function that finds, replaces, and observes the buttons
    function processButtons() {
        document.querySelectorAll('like-button-view-model button, dislike-button-view-model button').forEach(button => {
            if (button.dataset.classicIcons) return;
            button.dataset.classicIcons = 'true';

            const isLikeButton = button.closest('like-button-view-model');
            const className = isLikeButton ? 'classic-like-svg' : 'classic-dislike-svg';
            const defaultSVG = isLikeButton ? LIKE_SVG : DISLIKE_SVG;

            const iconContainer = button.querySelector('.yt-spec-button-shape-next__icon');
            if (iconContainer) {
                iconContainer.style.display = 'none';

                const customIcon = createClassicSVG(defaultSVG, className, isLikeButton);
                const textContent = button.querySelector('.yt-spec-button-shape-next__button-text-content');

                if (isLikeButton) {
                     button.insertBefore(customIcon, textContent);
                } else {
                     button.insertBefore(customIcon, textContent);
                }

                updateButtonFill(button);

                const observer = new MutationObserver((mutations) => {
                    mutations.forEach(mutation => {
                        if (mutation.type === 'attributes' && mutation.attributeName === 'aria-pressed') {
                            updateButtonFill(mutation.target);
                        }
                    });
                });
                observer.observe(button, { attributes: true });
            }
        });
    }

    // Use a MutationObserver to detect when new buttons are added to the page
    const bodyObserver = new MutationObserver(processButtons);
    bodyObserver.observe(document.body, { childList: true, subtree: true });

    // Initial run on script load
    processButtons();

        // The element you want to remove has the class: yt-player-quick-action-buttons
    // We can use GM_addStyle to set its display property to 'none' immediately.
    // The `:not([hidden])` is added for robustness, although usually unnecessary.
    GM_addStyle(`
        /* Hide the quick action buttons bar that appears over the video player */
        yt-player-quick-action-buttons {
            display: none !important;
        }

        /* Specific selector for the compact controls (mini-player/fullscreen) */
        .ytPlayerQuickActionButtonsHost.ytPlayerQuickActionButtonsHostCompactControls {
             display: none !important;
        }
    `);
})();