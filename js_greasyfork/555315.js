// ==UserScript==
// @name         Google Images - Restore Full Color Search
// @version      1.0.4
// @description  This brings back the option to filter for full color images, excluding black and white ones.
// @author       makewebsitesbetter
// @namespace    userscripts
// @icon         https://i.postimg.cc/3NMLffrh/greenbox.png
// @include      *://*.google.*/search?*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555315/Google%20Images%20-%20Restore%20Full%20Color%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/555315/Google%20Images%20-%20Restore%20Full%20Color%20Search.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 1. The Core Logic function.
    function addFullColorOption(container) {
        // Don't add it if it already exists.
        const allLinks = Array.from(container.querySelectorAll('a'));
        // Look for 'Full color'.
        if (allLinks.some(a => a.textContent.includes('Full color'))) {
            return;
        }

        // Find the specific dropdown items.
        const options = Array.from(container.querySelectorAll("div.XhWQv"));
        
        const anyColorDiv = options.find(div => div.textContent.includes("Any color"));
        const transparentDiv = options.find(div => div.querySelector("a[href*='ic:trans']"));

        if (!anyColorDiv || !transparentDiv) return;

        // Clone the transparent node to create the Full color node.
        const fullColorDiv = transparentDiv.cloneNode(true);
        const fullColorLink = fullColorDiv.querySelector('a');

        // Update text and href.
        fullColorLink.textContent = 'Full color';
        fullColorLink.href = fullColorLink.href.replace('ic:trans', 'ic:color');

        // Insert after "Any color".
        anyColorDiv.after(fullColorDiv);

        // Handle the active state (UI).
        if (window.location.href.includes('tbs=ic:color')) {
            // Update the dropdown label "Any color" -> "Full color"
            const dropdownContainer = container.closest("[jsname='H9P06b']");
            if (dropdownContainer && dropdownContainer.previousElementSibling) {
                const label = dropdownContainer.previousElementSibling.querySelector("[jsname='ibnC6b']");
                if (label) label.textContent = 'Full color';
            }

            // Highlight the new option.
            fullColorDiv.classList.add('Wf7Nsf'); // Google's active class.
            anyColorDiv.classList.remove('Wf7Nsf');
        }

        // Add click listener to "Any color" to ensure that clicking "Any color" actually clears the color filter.
        const anyColorLink = anyColorDiv.querySelector('a');
        if (anyColorLink) {
            // Remove old listeners to prevent stacking. Cloning doesn't copy listeners, but the original might have them.
            const newAnyColorLink = anyColorLink.cloneNode(true);
            anyColorLink.parentNode.replaceChild(newAnyColorLink, anyColorLink);
            
            newAnyColorLink.addEventListener('click', function(e) {
                if (window.location.href.includes('tbs=ic:color')) {
                    e.preventDefault();
                    const url = new URL(window.location.href);
                    url.searchParams.delete('tbs'); // Remove color param.
                    url.searchParams.set('tbas', '0'); // Reset filter.
                    window.location.href = url.toString();
                }
            });
        }
    }

    // 2. The Scanner.
    function scanForTarget() {
        // The main selector: div.vH6rvf.FJCJfd.
        const candidates = document.querySelectorAll("div.vH6rvf.FJCJfd");

        candidates.forEach((node) => {
            // If the node has already been processed, skip it.
            if (node.dataset.hasFullColor) return;

            // Manually check for :has(a[href*='ic:trans'])
            const hasTransLink = node.querySelector("a[href*='ic:trans']");
            if (!hasTransLink) return;

            // Mark as processed so the logic doesn't run 100 times a second.
            node.dataset.hasFullColor = "true";

            // Run the main function.
            addFullColorOption(node);
        });
    }

    // 3. The Observer.
        // Scan for the specific selector when DOM changes occur.
    const observer = new MutationObserver(() => {
        scanForTarget();
    });

    // 4. Start Observing.
    // Observe documentElement <html> to ensure everything is caught, even before the body exists.
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    // 5. Initial Run.
    // Run once immediately in case the element is already there (reloads, back button, etc).
    scanForTarget();

})     ();