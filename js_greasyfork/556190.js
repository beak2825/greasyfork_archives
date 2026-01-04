// ==UserScript==
// @name         New Download Button For Main CircleFTP
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Changes the broken download buton image
// @license      MIT
// @author       BlazeFTL
// @match        http://main.circleftp.net/*
// @grant        GM_addStyle
// @run-at       document_start
// @downloadURL https://update.greasyfork.org/scripts/556190/New%20Download%20Button%20For%20Main%20CircleFTP.user.js
// @updateURL https://update.greasyfork.org/scripts/556190/New%20Download%20Button%20For%20Main%20CircleFTP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Define CSS for the new modern button
    const buttonStyles = `
        /* The main button style (applied to the new <a> element) */
        .gm-modern-download-button {
            display: inline-block;
            min-width: 105px;
            height: 40px;
            line-height: 40px; /* Center text vertically */
            padding: 0 15px;

            background-color: #4CAF50 !important;
            color: white !important;
            text-align: center;
            text-decoration: none !important;
            border: none;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.3s ease;
            margin: 10px auto;
        }

        /* Hover effect */
        .gm-modern-download-button:hover {
            background-color: #45A049 !important;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2) !important;
            transform: translateY(-1px);
        }

        /* Icon for the button */
        .gm-modern-download-button::before {
            content: "↓";
            margin-right: 8px;
            font-size: 18px;
        }
    `;

    // Add the defined styles to the page
    GM_addStyle(buttonStyles);

    // Flag to ensure we only replace the element once
    let replacementCompleted = false;

    // 2. Function to find and replace the element
    function replaceElement() {
        if (replacementCompleted) return;

        // Target the image primarily by its class and alt attributes
        // We use a broader selector that targets the specific classes you gave me
        const selector = 'img.wp-image-244.size-medium[alt="Dwn Ico"]';
        const oldImage = document.querySelector(selector);

        if (oldImage) {
            console.log('Target image found! Performing clean replacement...');

            // Get the parent link element, which holds the download URL
            const parentLink = oldImage.closest('a');
            const downloadHref = parentLink ? parentLink.href : '#';

            // 3. Create the new download button element (<a> tag)
            const newButton = document.createElement('a');
            newButton.href = downloadHref;
            newButton.className = 'gm-modern-download-button';
            newButton.textContent = 'DOWNLOAD';
            newButton.title = 'Click to Download';

            // 4. Perform the replacement
            if (parentLink) {
                 // Replace the entire parent link element with the new button
                 parentLink.parentNode.replaceChild(newButton, parentLink);
            } else {
                 // If the image is not in a link, just replace the image itself
                 oldImage.parentNode.replaceChild(newButton, oldImage);
            }

            replacementCompleted = true;
            // Stop observing once the element is found and replaced
            if (observer) observer.disconnect();
            console.log('Replacement successful and observer disconnected.');
            return true;
        }
        return false;
    }

    // 5. Use MutationObserver for reliability
    const observer = new MutationObserver(function(mutations, me) {
        // Run the replacement check on every mutation
        replaceElement();
    });

    // Start observing the body for dynamic changes as early as possible
    // We observe the entire document body for any changes
    const targetNode = document.body || document.documentElement;
    if (targetNode) {
        observer.observe(targetNode, { childList: true, subtree: true });
    }

    // 6. Use requestAnimationFrame (raf) for a persistent check during page painting
    function rafCheck() {
        if (!replacementCompleted) {
            replaceElement();
            // Keep checking every frame until it's done
            window.requestAnimationFrame(rafCheck);
        }
    }

    // Start the persistent check loop
    window.requestAnimationFrame(rafCheck);

})();