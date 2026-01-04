// ==UserScript==
// @name             Neopets: Various Shop Wizard & SSW Improvements
// @namespace        kmtxcxjx
// @version          1.0.2
// @description      Adds item image to SW & SSW results. Has SSW link to SW if on cooldown. Makes 'identical' default search mode in older SSW. Fixes text when results loading in older SSW.
// @match            *://www.neopets.com/*
// @grant            none
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/554715/Neopets%3A%20Various%20Shop%20Wizard%20%20SSW%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/554715/Neopets%3A%20Various%20Shop%20Wizard%20%20SSW%20Improvements.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    let itemId;
    let url;

    async function getImgSrc(itemId) {
        const res = await fetch(`https://itemdb.com.br/api/v1/items/many?item_id[]=${itemId}`, {
            method: 'GET',
        });
        const data = await res.json();
        return data[itemId].image;
    }

    async function handleSW() {
        const a = document.querySelector('div.wizard-results-grid a');
        if (!a) return;
        const match = a.href.match(/buy_obj_info_id=(\d+)/);
        if (!match) return;
        if (itemId !== match[1]) {
            itemId = match[1];
            url = undefined;
        }

        const h3 = document.querySelector('div.wizard-results-text h3');
        if (!h3) return;

        let img = h3.nextElementSibling;
        if (!img || img.tagName !== 'IMG') {
            img = document.createElement('img');
            img.src = url ?? 'https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png';
            img.alt = itemId;
            img.style.width = '50px';
            h3.insertAdjacentElement('afterend', img);
        } else if (img && img.alt !== itemId) {
            img.src = 'https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png';
            img.alt = itemId;
        }
        if (img.src === 'https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png') {
            url = await getImgSrc(itemId);
            img.src = url;
        }
    }

    async function handleNewSSW() {
        linkToSW();
        const tab1 = document.querySelector('div#ssw-tabs-1');
        const tab2 = document.querySelector('div#ssw-tabs-2');
        if (!tab1 || !tab2) return;

        if (getComputedStyle(tab1).display !== 'none') {
            const imgDiv = document.querySelector('div#imgResult');
            if (imgDiv) imgDiv.remove();
            const h3 = document.querySelector('div#ssw__2020 h3');
            if (h3) h3.style.paddingLeft = '0px';
            return;
        }

        const a = tab2.querySelector('div#sswresults a');
        if (!a) {
            const loadingImg = tab2.querySelector('div.ssw-loading[alt="Loading..."]');
            if (loadingImg) {
                const imgDiv = document.querySelector('div#imgResult');
                if (imgDiv) imgDiv.remove();
            }
            return;
        }
        const match = a.href.match(/buy_obj_info_id=(\d+)/);
        if (!match) return;
        if (itemId !== match[1]) {
            itemId = match[1];
            url = undefined;
        }

        const wizard = document.querySelector('div.ssw-char__2020');
        if (!wizard) return;

        let imgDiv = wizard.nextElementSibling;
        if (!imgDiv || imgDiv.id !== 'imgResult') {
            imgDiv = document.createElement('div');
            imgDiv.id = 'imgResult';
            imgDiv.style.position = 'absolute';
            imgDiv.style.left = '74px';
            imgDiv.style.top = '3px';
            imgDiv.style.width = '44px';
            imgDiv.style.height = '44px';
            imgDiv.style.boxSizing = 'border-box';
            imgDiv.style.background = '#d2d2d2';
            imgDiv.style.border = '1px solid #5e5e5e';
            imgDiv.style.borderRadius = '8px';
            imgDiv.style.display = 'flex';
            imgDiv.style.alignItems = 'center';
            imgDiv.style.justifyContent = 'center';

            const img = document.createElement('img');
            img.src = url ?? 'https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png';
            img.alt = itemId;
            img.style.width = '40px';
            img.style.border = '2px solid #282828';
            img.style.borderRadius = '8px';

            const h3 = document.querySelector('div#ssw__2020 h3');
            if (h3) h3.style.paddingLeft = '23px';


            imgDiv.appendChild(img);
            wizard.parentNode.insertBefore(imgDiv, wizard.nextSibling);
        }
        const img = imgDiv.firstElementChild;
        if (img.alt !== itemId) {
            img.src = 'https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png';
            img.alt = itemId;
        }

        if (img.src === 'https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png') {
            url = await getImgSrc(itemId);
            img.src = url;
        }
    }

    async function handleOldSSW() {
        linkToSW();
        const tab1 = document.querySelector('div#ssw-tabs-1');
        const tab2 = document.querySelector('div#ssw-tabs-2');
        if (!tab1 || !tab2) return;

        if (getComputedStyle(tab1).display !== 'none') {
            const imgDiv = document.querySelector('div#imgResult');
            if (imgDiv) imgDiv.remove();
            return;
        }

        const a = tab2.querySelector('table#results_table a');
        if (!a) {
            const loadingImg = tab2.querySelector('div img[alt="Loading..."]');
            if (loadingImg) {
                const searchingForDiv = tab2.querySelector('div#search_for');
                if (!searchingForDiv) return;
                const newText = `Searching for '${currentSearchStr}'...`;
                if (searchingForDiv.textContent !== newText) searchingForDiv.textContent = `Searching for '${currentSearchStr}'...`;
            }
            return
        };

        const match = a.href.match(/buy_obj_info_id=(\d+)/);
        if (!match) return;
        if (itemId !== match[1]) {
            itemId = match[1];
            url = undefined;
        }

        const shopkeeper = document.querySelector('div#shopkeeper');
        if (!shopkeeper) return;

        let imgDiv = shopkeeper.nextElementSibling;

        if (!imgDiv || imgDiv.id !== 'imgResult') {
            imgDiv = document.createElement('div');
            imgDiv.id = 'imgResult';
            imgDiv.style.position = 'absolute';
            imgDiv.style.left = '63px';
            imgDiv.style.top = '29px';
            imgDiv.style.width = '86px';
            imgDiv.style.height = '86px';
            imgDiv.style.boxSizing = 'border-box';
            imgDiv.style.background = '#d2d2d2';
            imgDiv.style.border = '1px solid #5e5e5e';
            imgDiv.style.borderRadius = '8px';
            imgDiv.style.display = 'flex';
            imgDiv.style.alignItems = 'center';
            imgDiv.style.justifyContent = 'center';

            const img = document.createElement('img');
            img.src = url ?? 'https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png';
            img.alt = itemId;
            img.style.width = '80px';
            img.style.border = '2px solid #282828';
            img.style.borderRadius = '8px';

            imgDiv.appendChild(img);
            shopkeeper.parentNode.insertBefore(imgDiv, shopkeeper.nextElementSibling);
        }

        const img = imgDiv.firstElementChild;
        if (img.alt !== itemId) {
            img.src = 'https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png';
            img.alt = itemId;
        }
        if (img.src === 'https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png') {
            url = await getImgSrc(itemId);
            img.src = url;
        }
    }

    function linkToSW() {
        let searchFor, parent, fontSize;
        if (document.querySelector('div#ssw_tabs_pane')) { // Old style
            const tab2 = document.querySelector('div#ssw-tabs-2');
            if (!tab2) return;
            if (getComputedStyle(tab2).display === 'none') return; // Results page not visible
            if (document.querySelector('table#results_table')) return; // Search was successful

            parent = document.querySelector('div#results > p.pmod');
            if (!parent) parent = document.querySelector('div#ssw_error_result');
            searchFor = document.querySelector('div#search_for');
            fontSize = '9px';
        } else if (document.querySelector('div#ssw__2020')) { // New style
            parent = document.querySelector('div#ssw_error_result');
            if (!parent) return;
            if (getComputedStyle(parent).display === 'none') return; // No error displayed

            searchFor = document.querySelector('div#search_for p');
            fontSize = '11pt';
        } else return; // No SSW present at all
        // Parent or search text doesn't exist, or we already inserted a link
        if (!parent || !searchFor || parent.querySelector('a.sw-link')) return;
        // Either the item doesn't exist or it's unbuyable - either way a link to SW is pointless
        if (parent.textContent.trim() === 'No items found.') return;

        const match = searchFor.textContent.match(/Searching for '(.*)', matching '/);
        if (!match) return;
        const query = match[1];

        const a = document.createElement('a');
        a.href = `https://www.neopets.com/shops/wizard.phtml?string=${encodeURIComponent(query)}`;
        a.textContent = 'here';
        a.className = 'sw-link';
        a.target = '_blank'; // Opens in new tab
        a.style.fontSize = fontSize;

        const sentence = document.createElement('span');
        sentence.style.fontSize = fontSize;
        sentence.appendChild(document.createTextNode('Or click '));
        sentence.appendChild(a);
        sentence.appendChild(document.createTextNode(' to search on the Shop Wizard instead.'));

        parent.appendChild(document.createElement('br'));
        parent.appendChild(document.createElement('br'));
        parent.appendChild(sentence);
    }

    let currentSearchStr = '';

    // Add mutation observers for all three SW variants
    // Original Shop Wizard
    if (window.location.href.includes('://www.neopets.com/shops/wizard.phtml')) {
        const shopWizardFormResults = document.querySelector('div#shopWizardFormResults');
        if (shopWizardFormResults) new MutationObserver(handleSW).observe(shopWizardFormResults, { childList: true, subtree: true });
    }

    const newSSW = document.querySelector('div#ssw__2020');
    if (newSSW) {
        new MutationObserver(handleNewSSW).observe(newSSW, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
    }

    const oldSSW = document.querySelector('div#ssw_tabs_pane');
    if (oldSSW) {
        // Make "identical to my phrase" the default option, like the other two wizards
        const opt = document.querySelector('select#ssw-criteria option[value="exact"]');
        if (opt) opt.selected = true;

        // Track anything typed into the SSW search box
        const input = document.querySelector('input#searchstr');
        if (input) input.addEventListener('input', () => { currentSearchStr = input.value; });

        new MutationObserver(handleOldSSW).observe(oldSSW, {
            childList: true,
            subtree: true,
            attributes: true,
            characterData: true
        });
    }
})();