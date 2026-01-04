// ==UserScript==
// @name         Product Category 
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add check links to GoodsFox items that open YDCMS search in a popup
// @author       You
// @match        https://app.goodsfox.com/goods
// @grant         none
// @downloadURL https://update.greasyfork.org/scripts/554294/Product%20Category.user.js
// @updateURL https://update.greasyfork.org/scripts/554294/Product%20Category.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add check links to all matching elements
    function addCheckLinks() {
        // Find all elements with the specified class
        const goodsElements = document.querySelectorAll('a.el-tooltip.gp-table-goods__name');

        goodsElements.forEach(element => {
            // Check if we've already added a check link for this element
            if (element.nextElementSibling && element.nextElementSibling.classList.contains('goodsfox-check-link')) {
                return; // Skip if check link already exists
            }

            // Extract text content from the original link
            const keyword = encodeURIComponent(element.textContent.trim());

            // Create new check link
            const checkLink = document.createElement('a');
            checkLink.href = `https://ydcms.umlife.com/#/os_goods?page=1&keyword=${keyword}&date`;
            checkLink.textContent = 'check';
            checkLink.className = 'goodsfox-check-link';
            checkLink.style.marginLeft = '10px';
            checkLink.target = '_blank';

            // Add click event to open popup window
            checkLink.addEventListener('click', function(e) {
                e.preventDefault();

                // Calculate 60% of current window dimensions
                const width = Math.floor(window.innerWidth * 0.6);
                const height = Math.floor(window.innerHeight * 0.6);

                // Open popup window with specified dimensions
                window.open(
                    this.href,
                    'ydcms_popup',
                    `width=${width},height=${height},resizable=yes,scrollbars=yes`
                );
            });

            // Insert the check link after the original element
            element.parentNode.insertBefore(checkLink, element.nextSibling);
        });
    }

    // Initial run
    addCheckLinks();

    // Set up a MutationObserver to handle dynamically loaded content
    const observer = new MutationObserver(function(mutations) {
        let shouldAddLinks = false;

        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldAddLinks = true;
            }
        });

        if (shouldAddLinks) {
            addCheckLinks();
        }
    });

    // Start observing the document body for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();