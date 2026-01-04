// ==UserScript==
// @name         Item Market Experience Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @author       mikihisa123 [2462160]
// @description  Script that allows you to manage your Item Market shop more efficiently
// @copyright    2025 Mikihisa123
// @match        https://www.torn.com/page.php?sid=ItemMarket*
// @exclude      https://www.torn.com/api.html
// @exclude      https://www.torn.com/swagger.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558061/Item%20Market%20Experience%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/558061/Item%20Market%20Experience%20Enhancer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let controlPanelCreated = false;
    function getAllPriceComponents() {
        return document.querySelectorAll('[class*="priceInputWrapper"] .input-money:not([value])');
    }
    function updatePageState() {
    const isViewListing = location.hash.startsWith('#/viewListing');
    if(isViewListing && !controlPanelCreated) {
        setupControlPanel();
        controlPanelCreated = true;
    }
  }
    function setupControlPanel() {
        const controlPanel = document.querySelector('[class*="controls"]');
        if (controlPanel) {
            const wrapper = document.createElement('div')
            const btnOpenShop = document.createElement('button');
            const btnCloseShop = document.createElement('button');
            // wrapper styling
            wrapper.style.backgroundColor = '#333';
            wrapper.style.display = 'flex';
            wrapper.style.justifyContent = 'space-evenly';
            // Open Shop styling
            btnOpenShop.textContent = 'Open shop!';
            btnOpenShop.style.backgroundColor = 'green';
            btnOpenShop.style.fontWeight = 'bold';
            btnOpenShop.style.width = '250px';
            btnOpenShop.style.height = '50px';
            btnOpenShop.style.borderRadius = '25px';
            btnOpenShop.style.cursor = 'pointer';
            btnOpenShop.addEventListener('click', () => {
                const allPrices = getAllPriceComponents();
                if(allPrices) {
                    allPrices.forEach(input => {
                        const v = input.value.trim();

                        if (!v) {
                            console.log('Input is empty → nothing to remove:', input);
                            showToast('Some price reached 0 or lower, please check!');
                            return;
                        }

                        const newValue = v.slice(0, -1);

                        input.value = newValue;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    })
                    showToast('Shop opened!');
                    displayMessageAndRemoveButtons(btnOpenShop,btnCloseShop,wrapper, true);

                }
                else {
                showToast('no prices to update!');
                }
            });
            // Close Shop styling
            btnCloseShop.textContent = 'Close shop!';
            btnCloseShop.style.backgroundColor = 'red';
            btnCloseShop.style.fontWeight = 'bold';
            btnCloseShop.style.color = 'antiquewhite';
            btnCloseShop.style.width = '250px';
            btnCloseShop.style.height = '50px';
            btnCloseShop.style.borderRadius = '25px';
            btnCloseShop.style.cursor = 'pointer';
            btnCloseShop.addEventListener('click', () => {
                const allPrices = getAllPriceComponents();
                if(allPrices) {
                    allPrices.forEach(input => {
                        if (input.value.trim()) {
                            input.value += '0';
                            input.dispatchEvent(new Event('input', { bubbles: true }));
                        } else {
                            console.log('Skipped empty price input:', input);
                        }
                    })
                    showToast('Shop Closed! Have a good rest!');
                    displayMessageAndRemoveButtons(btnOpenShop,btnCloseShop,wrapper, false);
                }
                else {
                showToast('no prices to update!');
                }
            });
            controlPanel.parentNode.insertBefore(wrapper, controlPanel.nextSibling);
            wrapper.appendChild(btnOpenShop);
            wrapper.appendChild(btnCloseShop);
            controlPanelCreated = true;
        } else {
            return;
        }
    }
    function displayMessageAndRemoveButtons(openButton, closeButton, wrapper, isOpened) {
        openButton.remove();
        closeButton.remove();
        wrapper.style.fontSize = 'x-large';
        wrapper.style.textAlign = 'center';
        if(isOpened) {
            wrapper.style.backgroundColor = 'green';
            wrapper.textContent = 'SHOP OPENED! In order to bring buttons back, please refresh the page'
        } else {
            wrapper.style.backgroundColor = 'red';
            wrapper.style.color = 'antiquewhite';
            wrapper.textContent = 'SHOP CLOSED! In order to bring buttons back, please refresh the page'
        }
    }

    function showToast(message, duration = 2500) {
        const existing = document.getElementById('tm-modal-toast');
        if (existing) existing.remove();

        const el = document.createElement('div');
        el.id = 'tm-modal-toast';
        el.textContent = message;

        el.style.position = 'fixed';
        el.style.left = '50%';
        el.style.bottom = '30px';
        el.style.transform = 'translateX(-50%)';
        el.style.maxWidth = '480px';
        el.style.width = 'calc(100% - 40px)';

        el.style.background = 'rgba(0, 0, 0, 0.9)';
        el.style.color = '#fff';
        el.style.padding = '16px 24px';
        el.style.borderRadius = '10px';
        el.style.fontSize = '15px';
        el.style.textAlign = 'center';
        el.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.4)';
        el.style.zIndex = '999999';
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(el);

        requestAnimationFrame(() => {
            el.style.opacity = '1';
        });

        setTimeout(() => {
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
        }, duration);
    }
    updatePageState();
    window.addEventListener('hashchange', updatePageState, false);
})();