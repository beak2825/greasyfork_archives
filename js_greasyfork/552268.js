// ==UserScript==
// @name         Torn Item Market Buys
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a gold star to anonymous checkbox in Torn Item Market
// @author       Glitchey
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552268/Torn%20Item%20Market%20Buys.user.js
// @updateURL https://update.greasyfork.org/scripts/552268/Torn%20Item%20Market%20Buys.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS for the star
    const style = document.createElement('style');
    style.textContent = `
        .toggle-star {
            display: inline-block;
            color: #999;
            font-size: 20px;
            margin-right: 5px;
            vertical-align: middle;
            transition: color 0.3s ease, text-shadow 0.3s ease;
            cursor: pointer;
            line-height: 1;
        }
        .toggle-star.active {
            color: #FFD700;
            text-shadow: 0 0 3px rgba(255, 215, 0, 0.5);
        }
        /* Hide the original anonymous SVG icon */
        .tooltipChild___YluFn .icon___lkc0u {
            display: none !important;
        }
        /* Hide the original label text */
        .checkboxContainer___NjWr0 label.marker-css {
            display: none !important;
        }
        /* Hide the checkbox itself */
        .checkboxContainer___NjWr0 input[type="checkbox"] {
            display: none !important;
        }
        /* Hide the tooltip - multiple selectors */
        .tooltip___z6rKg {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
        }
        .tooltipChild___YluFn .tooltip___z6rKg {
            display: none !important;
        }
        div.tooltip___z6rKg {
            display: none !important;
        }
        /* Style the star label */
        .star-label {
            display: inline-block;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // Function to get storage key for an item
    function getStorageKey(checkboxId) {
        return `torn_market_star_${checkboxId}`;
    }

    // Function to save star state
    function saveStarState(checkboxId, isActive) {
        try {
            localStorage.setItem(getStorageKey(checkboxId), isActive ? '1' : '0');
        } catch (e) {
            console.error('Torn Market Buys: Failed to save state', e);
        }
    }

    // Function to load star state
    function loadStarState(checkboxId) {
        try {
            const saved = localStorage.getItem(getStorageKey(checkboxId));
            return saved === '1';
        } catch (e) {
            console.error('Torn Market Buys: Failed to load state', e);
            return false;
        }
    }

    // Function to reorder items - gold starred items go to bottom
    function reorderItems() {
        // Only run on the viewListing page
        if (!window.location.hash.includes('#/viewListing')) {
            return;
        }

        const itemRows = document.querySelectorAll('.virtualListing___jl0JE > .itemRowWrapper___cFs4O');
        if (itemRows.length === 0) {
            return;
        }

        const parent = itemRows[0].parentElement;
        if (!parent) return;

        const itemsArray = Array.from(itemRows);

        // Separate into starred and unstarred
        const unstarred = [];
        const starred = [];

        itemsArray.forEach(row => {
            const star = row.querySelector('.toggle-star');
            if (star && star.classList.contains('active')) {
                starred.push(row);
            } else {
                unstarred.push(row);
            }
        });

        // Reorder: unstarred first, then starred
        [...unstarred, ...starred].forEach(row => {
            parent.appendChild(row);
        });

        console.log('Torn Market Buys: Reordered items -', unstarred.length, 'unstarred,', starred.length, 'starred');
    }

    // Function to add star to checkbox containers
    function addStars() {
        // Only run on the viewListing page
        if (!window.location.hash.includes('#/viewListing')) {
            return;
        }

        const checkboxContainers = document.querySelectorAll('.checkboxContainer___NjWr0');

        if (checkboxContainers.length === 0) {
            console.log('Torn Market Buys: No checkbox containers found yet');
            return;
        }

        console.log('Torn Market Buys: Found', checkboxContainers.length, 'checkbox containers');

        checkboxContainers.forEach((container, index) => {
            // Check if star already exists
            if (container.querySelector('.toggle-star')) {
                console.log('Torn Market Buys: Star already exists for container', index);
                return;
            }

            const checkbox = container.querySelector('input[type="checkbox"]');
            const oldLabel = container.querySelector('label.marker-css');

            console.log('Torn Market Buys: Container', index, '- Checkbox:', !!checkbox);

            if (checkbox) {
                // Remove text from old label
                if (oldLabel) {
                    oldLabel.textContent = '';
                }

                // Create new label for just the star
                const starLabel = document.createElement('label');
                starLabel.className = 'star-label';
                starLabel.setAttribute('for', checkbox.id);

                const star = document.createElement('span');
                star.className = 'toggle-star';
                star.innerHTML = '★';

                // Load saved state or use checkbox state
                const savedState = loadStarState(checkbox.id);
                if (savedState) {
                    star.classList.add('active');
                    checkbox.checked = true;
                } else if (checkbox.checked) {
                    star.classList.add('active');
                }

                // Toggle star when clicked
                starLabel.addEventListener('click', (e) => {
                    e.preventDefault();
                    checkbox.checked = !checkbox.checked;
                    star.classList.toggle('active');

                    // Save state
                    saveStarState(checkbox.id, checkbox.checked);

                    // Trigger change event on checkbox
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));

                    // Reorder items after star click
                    setTimeout(reorderItems, 100);
                });

                // Update star when checkbox changes
                checkbox.addEventListener('change', () => {
                    if (checkbox.checked) {
                        star.classList.add('active');
                    } else {
                        star.classList.remove('active');
                    }
                    // Save state when checkbox changes
                    saveStarState(checkbox.id, checkbox.checked);
                });

                starLabel.appendChild(star);
                container.appendChild(starLabel);
                console.log('Torn Market Buys: Star successfully added to container', index);
            } else {
                console.log('Torn Market Buys: Missing checkbox for container', index);
            }
        });
    }

    // Initial run with delay to ensure DOM is loaded
    setTimeout(() => {
        addStars();
        reorderItems();
    }, 1000);

    // Observer to handle dynamically loaded content
    const observer = new MutationObserver(() => {
        addStars();
    });

    // Start observing the document for changes
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Watch for hash changes
    window.addEventListener('hashchange', () => {
        console.log('Torn Market Buys: Hash changed to', window.location.hash);
        setTimeout(() => {
            addStars();
            reorderItems();
        }, 500);
    });

    // Also run on page changes (for SPA navigation)
    window.addEventListener('popstate', () => {
        setTimeout(() => {
            addStars();
            reorderItems();
        }, 500);
    });

    console.log('Torn Market Buys: Script loaded');
})();