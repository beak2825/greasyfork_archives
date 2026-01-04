// ==UserScript==
// @name         No sold items
// @namespace    https://greasyfork.org/en/users/47243-liquorburn
// @version      2025-10-29
// @description  Hides sold items and removes ads on subito.it
// @author       Burn
// @copyright    2025, burn (https://openuserjs.org/users/burn)
// @license      MIT
// @match        https://www.subito.it/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/553544/No%20sold%20items.user.js
// @updateURL https://update.greasyfork.org/scripts/553544/No%20sold%20items.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let adWrapper = "ad_wrapper_";
    let soldClass = "_soldBadge__"; //"item-sold-badge";
    let parentClass = "AdItem_adItemCard__"; //"SmallCard-module_card__";

    function findElements() {
        const elements = document.querySelectorAll('[id^="'+ adWrapper +'"]');
        elements.forEach(element => {
            element.parentNode.removeChild(element);
            console.log("eliminato ad");
        });

        const soldElements = document.querySelectorAll('[class*="'+ soldClass +'"]');
        soldElements.forEach(element => {
            const parentElement = element.closest('[class*="'+ parentClass +'"]');
            if (parentElement && !parentElement.classList.contains('hidden-by-script')) {
                parentElement.style.display = 'none';
                parentElement.classList.add('hidden-by-script');
                console.log("nascosto sold item");
            }
        });
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            findElements();
        });
    });
    const config = {
        childList: true,
        subtree: true,
        attributes: true
    };
    observer.observe(document.body, config);
    findElements();

    const toggleButton = document.createElement('button');
    toggleButton.id = 'toggle-sold-items-btn';
    toggleButton.textContent = 'Mostra / nascondi venduti';
    document.body.appendChild(toggleButton);

    const style = document.createElement('style');
    style.innerText = `
      #toggle-sold-items-btn {
        position: fixed;
        bottom: 10px;
        right: 10px;
        z-index: 1000;
        background-color: #f9423a;
        color: white;
        padding: 10px 20px;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 600;
      }
      #toggle-sold-items-btn:hover {
        background-color: #fa7b75;
        color: white;
      }
    `;
    document.head.appendChild(style);

    let hiddenItemsVisible = false;
    toggleButton.addEventListener('click', () => {
        hiddenItemsVisible = !hiddenItemsVisible;
        const hiddenElements = document.querySelectorAll('.hidden-by-script');
        hiddenElements.forEach(element => {
            element.style.display = hiddenItemsVisible ? 'block' : 'none';
        });
    });
})();
