// ==UserScript==
// @name         Gamestop - Custom Checkout
// @namespace    revadike
// @version      1.2
// @description  Replace cart with 3 copies of a game for easy checkout
// @author       revadike
// @match        https://www.gamestop.com/*
// @icon         https://www.gamestop.com/favicon.ico
// @license      MIT
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/553745/Gamestop%20-%20Custom%20Checkout.user.js
// @updateURL https://update.greasyfork.org/scripts/553745/Gamestop%20-%20Custom%20Checkout.meta.js
// ==/UserScript==

// Seconds before redirecting to checkout
const CART_REDIRECT_AFTER = 3;

(function () {
    'use strict';

    // Function to clear cart and add items
    async function clearCartAndAdd(originalBtn) {
        try {
            // Clear existing cart items
            const { items } = await fetch("https://www.gamestop.com/on/demandware.store/Sites-gamestop-us-Site/default/Cart-Get").then(res => res.json());
            await Promise.all(items.map(async (item) => fetch(`https://www.gamestop.com/on/demandware.store/Sites-gamestop-us-Site/default/Cart-RemoveProductLineItem?pid=${item.id}&uuid=${item.UUID}`)));

            // Redirect to checkout after CART_REDIRECT_AFTER seconds
            setTimeout(() => {
                window.location.href = "https://www.gamestop.com/checkout";
            }, CART_REDIRECT_AFTER * 1000);

            // Click the original add to cart button
            originalBtn.click();
        } catch (error) {
            console.error('Error clearing cart:', error);
        }
    }

    // Function to modify elements
    function modifyElements() {
        // Get all quantity inputs
        const qtyInputs = document.querySelectorAll('input.quantity-select');
        qtyInputs.forEach(input => {
            if (!input.dataset.modified) {
                input.value = 3;
                input.dataset.modified = 'true';
            }
        });

        // Get all add to cart buttons
        const cartBtns = document.querySelectorAll('button.js-add-to-cart');
        cartBtns.forEach(btn => {
            // Check if button is not modified yet
            if (!btn.dataset.modified) {
                // Hide the original button
                btn.style.display = 'none';
                btn.dataset.modified = 'true';

                // Create a copy without listeners (deep clone to include content)
                const newBtn = btn.cloneNode(true);
                newBtn.innerText = 'Add 3 to Checkout';
                newBtn.style.display = '';
                newBtn.dataset.customBtn = 'true';
                newBtn.removeAttribute('data-modified');
                newBtn.classList.remove('js-add-to-cart');

                // Add click handler to new button
                newBtn.addEventListener('click', () => clearCartAndAdd(btn));

                // Insert the new button after the original
                btn.parentNode.insertBefore(newBtn, btn.nextSibling);
            } else if (btn.style.display !== 'none') {
                // If the button was modified but is now visible again, hide it
                btn.style.display = 'none';
            }
        });
    }

    // Run periodically to detect and modify elements
    setInterval(modifyElements, 500);
})();
