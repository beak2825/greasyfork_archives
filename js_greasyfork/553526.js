// ==UserScript==
// @name             Neopets: SDB Price Tracker
// @namespace        kmtxcxjx
// @version          1.0.1
// @description      Tracks prices of items in SDB using the itemdb SDB Pricer script, displays changes in price over time
// @match            *://www.neopets.com/safetydeposit.phtml*
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @grant            GM.setValue
// @grant            GM.getValue
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/553526/Neopets%3A%20SDB%20Price%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/553526/Neopets%3A%20SDB%20Price%20Tracker.meta.js
// ==/UserScript==

(async function() {
    'use strict';

    // Our script has to run after the "itemDB - Safety Deposit Box Pricer" script
    // These just track how many times we check if it's run yet, and gives up after a while
    let attempts = 0;
    // Each attempt takes 100ms
    const maxAttempts = 20;

    // Stored object where keys are item IDs and values are initial item prices
    let priceData = await GM.getValue('sdbPriceTracker', {});

    // Make numbers pretty :)
    function formatNP(num) {
        return num.toLocaleString() + ' NP';
    }

    function getItemIdFromInput(input) {
        const match = input?.name.match(/\[(\d+)\]/);
        return match ? match[1] : null;
    }

    // Generates new HTML to append after the itemdb link
    function createDeltaContent(oldPrice, newPrice) {
        const delta = newPrice - oldPrice;
        // Increase in price = green, decrease = red, stayed the same = black
        const deltaColor = delta > 0 ? 'green' : delta < 0 ? 'red' : 'black';
        // Add the + in front if positive, and format nicely
        const formattedDelta = `${delta >= 0 ? '+' : ''}${formatNP(delta)}`;

        return `
<b>
    Was: ${formatNP(oldPrice)}<br>
    (<span style="color:${deltaColor}">${formattedDelta}</span>)
</b>`;
    }

    // Looks for itemdb script's table cells, stores prices, adds our delta info
    function main() {
        // Look for all divs contained within tds
        const tds = document.querySelectorAll('td > div');
        // Keep the ones that contain links to an itemdb item page
        // Best way I found since nothing here sets classes or ids
        const matches = Array.from(tds)
        .map(div => {
            const linkDiv = Array.from(div.children).find(c => c.tagName === 'DIV' && c.querySelector('a[href*="itemdb.com.br/item"]'));
            return linkDiv ? { parentDiv: div, linkDiv } : null;
        })
        .filter(Boolean);

        if (matches.length) {
            matches.forEach(({ parentDiv, linkDiv }) => {
                const link = linkDiv.querySelector('a[href*="itemdb.com.br/item"]');
                // itemdb's script makes the item's price the textContent of the link - get it, remove commas, take off the ' NP', store as int
                const currPrice = parseInt(link.textContent.trim().replace(/,/g, '').replace(/\s*NP$/, ''), 10);
                if (isNaN(currPrice)) return;

                // The item id can be gotten from the item removal input, which has HTML like this:
                // <input type="text" name="back_to_inv[30295]" size="3" value="0" data-total_count="1" class="remove_safety_deposit" data-remove_val="n">
                //                                      ^^^^^ This is our item ID
                const nextInput = parentDiv.closest('tr')?.querySelector('input.remove_safety_deposit');
                const itemId = getItemIdFromInput(nextInput);
                if (!itemId) return;

                if (!(itemId in priceData)) {
                    priceData[itemId] = currPrice;
                    //console.error(`NEW Item ID: ${itemId} | Price: ${priceInt}`);
                } else {
                    //console.error(`Existing Item ID: ${itemId} (kept old price ${priceData[itemId]})`);
                }

                // Append the new HTML that shows the original price and the price delta
                linkDiv.innerHTML += `
<br><span class="sdb-delta" data-itemid="${itemId}" style="font-size:0.85em; color:black; cursor:context-menu;">
    ${createDeltaContent(priceData[itemId], currPrice)}
</span>`;
                // Add context menu to reset stored value
                const deltaSpan = linkDiv.querySelector('.sdb-delta');
                addContextMenu(deltaSpan, itemId, currPrice);
            });

            // Store any new prices we found
            GM.setValue('sdbPriceTracker', priceData);
        } else if (attempts < maxAttempts) {
            // Failed to find any table cells made by the itemdb script - maybe it hasn't finished running yet, wait a bit and try again
            attempts++;
            setTimeout(main, 100);
        } else {
            // We've failed enough, give up - is the itemdb script even installed?
            console.warn(`Neopets SDB Price Tracker: No matches found after ${maxAttempts} retries, aborting. 'itemdb Safety Deposit Box Pricer' script not installed?`);
        }
    }

    // Context menu for our added span, which just has an option to reset a stored value to its current value
    function addContextMenu(span, itemId, currPrice) {
        span.addEventListener('contextmenu', e => {
            e.preventDefault();

            // Remove any existing menu
            const existingMenu = document.querySelector('.custom-context-menu');
            if (existingMenu) existingMenu.remove();

            // Create menu
            const menu = document.createElement('div');
            menu.className = 'custom-context-menu';
            menu.style.position = 'absolute';
            menu.style.left = `${e.pageX}px`;
            menu.style.top = `${e.pageY}px`;
            menu.style.background = 'white';
            menu.style.border = '1px solid black';
            menu.style.padding = '4px';
            menu.style.zIndex = 9999;
            menu.style.cursor = 'pointer';
            menu.style.userSelect = 'none';
            menu.textContent = 'Reset value';

            menu.addEventListener('click', async () => {
                // Update priceData
                priceData[itemId] = currPrice;
                await GM.setValue('sdbPriceTracker', priceData);

                // Update span HTML
                span.innerHTML = createDeltaContent(currPrice, currPrice, itemId);
                menu.remove();
            });

            document.body.appendChild(menu);

            // Remove menu if clicked elsewhere
            const removeMenu = () => {
                menu.remove();
                document.removeEventListener('click', removeMenu);
            };
            document.addEventListener('click', removeMenu)
        });
    }
    // Give the itemDB script a little time to run first
    setTimeout(main, 100);
})();
