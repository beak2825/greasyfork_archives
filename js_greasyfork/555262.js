// ==UserScript==
// @name             Neopets: HTML Game UI tweaks
// @namespace        kmtxcxjx
// @version          1.0.5
// @description      Moves elements around on various HTML-based games so the buttons to continue playing on each screen can be clicked without having to move the mouse on every new screen.
// @match            *://www.neopets.com/games/slots.phtml*
// @match            *://www.neopets.com/medieval/doubleornothing.phtml*
// @match            *://www.neopets.com/medieval/cheeseroller.phtml
// @match            *://www.neopets.com/medieval/kissthemortog.phtml*
// @match            *://www.neopets.com/games/lottery.phtml
// @match            *://www.neopets.com/games/maze/maze.phtml*
// @grant            none
// @run-at           document-end
// @icon             https://images.neopets.com/games/aaa/dailydare/2012/post/theme-icon.png
// @license          MIT
// @downloadURL https://update.greasyfork.org/scripts/555262/Neopets%3A%20HTML%20Game%20UI%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/555262/Neopets%3A%20HTML%20Game%20UI%20tweaks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // FETCH
    if (window.location.href.includes('://www.neopets.com/games/maze/maze.phtml')) {
        // Map arrow key codes to direction names
        const keyMap = {
            'ArrowUp': 'North',
            'ArrowDown': 'South',
            'ArrowLeft': 'West',
            'ArrowRight': 'East'
        };

        document.addEventListener('keydown', function(e) {
            const direction = keyMap[e.key];
            if (!direction) return; // Not an arrow key

            // Find the <area> element with matching alt or title
            const area = Array.from(document.querySelectorAll('map[name="navmap"] area'))
            .find(a => a.alt === direction || a.title === direction);

            if (area && area.href) {
                window.location.href = area.href; // Navigate
                e.preventDefault(); // Prevent scrolling
            }
        });
    }

    // THE LOTTERY
    if (window.location.href.includes('://www.neopets.com/games/lottery.phtml')) {
        const buyButton = document.querySelector('input[value="Buy a Lottery Ticket!"]');
        const p = document.querySelector('td.content table tbody tr td:nth-of-type(2) p:nth-of-type(3)');
        if (!buyButton || !p || !p.textContent.trim().startsWith('Ticket 1 : ')) return;
        buyButton.insertAdjacentElement('afterend', p);
    }

    // KISS THE MOROTOG
    if (window.location.href.includes('://www.neopets.com/medieval/kissthemortog.phtml')) {
        const grundoImg = document.querySelector('img[src="//images.neopets.com/medieval/frog_guy.gif"]');
        if (grundoImg) { // On the Mortog selection screen
            // This moves the first mortog to the top of the page
            const mortogImg = document.querySelector('img[src="//images.neopets.com/items/pet_mortog.gif"]');
            if (!mortogImg) return;
            const mortogAnchor = mortogImg.parentNode;
            if (!mortogAnchor) return;

            // Move Mortog anchor before the Grundo image
            grundoImg.parentNode.insertBefore(mortogAnchor, grundoImg);
            grundoImg.parentNode.insertBefore(document.createElement('br'), grundoImg);
            return;
        }
        // If we're here, we're on the results screen - move both buttons to the top of the page
        const p = document.querySelector('td.content p');
        if (p) {
            // Grabs the <center> tags that contain each button
            const centers = Array.from(document.querySelectorAll('center > form')).map(f => f.parentElement);

            // Insert each <center> at the start of the <p> which appears at the top of the page
            centers.forEach((center, index) => {
                p.insertBefore(center, p.children[index]);
            });
        }

    }

    // SCORCHY SLOTS
    if (window.location.href.includes('://www.neopets.com/games/slots.phtml')) {
        // This form contains the entire play area
        const form = document.querySelector('form[action="process_slots2.phtml"]');
        if (!form) return;

        // center is the <center> tag that contains the "Play Again" button
        const submitButton = form.querySelector('center input[type="submit"]');
        if (!submitButton) return;
        const center = submitButton.parentElement;

        // The table includes the 3 slot rows and, if present, the row of holds
        const table = form.querySelector('table');
        if (!table) return;

        const tbody = table.querySelector('tbody');
        const rows = tbody.querySelectorAll('tr');

        // All images in the second row, containing the active slot selections:
        const imgs = Array.from(rows[1].querySelectorAll('td img'))

        // Check for JACKPOT!
        const jackpot = imgs.every(img => img.src === "https://images.neopets.com/games/slots/baggold_0.gif");
        // If it's a jackpot, don't move anything - should keep the button out of position so it isn't accidentally clicked and missed
        if (jackpot) return;

        // URL for jackpot bag and map pieces
        // Depending on if these are present, we will have the Play Again button above or below the hold display
        // If they are not present, the button goes above the holds, so the slot can be respun without moving the mouse
        // If they are present, put the button below the holds, so you can't accidentally skip them
        const targets = [
            "https://images.neopets.com/games/slots/baggold_0.gif", // Jackpot
            "https://images.neopets.com/games/slots/mappiece_0.gif" // Map piece
        ];

        if (rows.length === 4) { // There are holds this round
            // Whether those images contain any of our targets:
            const found = imgs.some(img => targets.includes(img.src));

            if (!found) { // None of the slot selections contain our targets, put button above the holds
                const newRow = document.createElement('tr');
                const newCell = document.createElement('td');
                newCell.colSpan = 6;
                newCell.appendChild(center);
                newRow.appendChild(newCell);
                // insert before current 4th row, the holds
                tbody.insertBefore(newRow, rows[3]);
                return;
            }
        }
        // No holds - just put the button after the table
        form.insertBefore(center, table.nextSibling);
    }

    // DOUBLE OR NOTHING
    if (window.location.href.includes('://www.neopets.com/medieval/doubleornothing.phtml')) {
        // Initial start-game screen, look for high score button
        const a = document.querySelector('td.content center p a[href="//www.neopets.com/gamescores.phtml?game_id=178"]');
        if (a) {
            const center = a.parentElement.parentElement;
            // This p element contains the coin
            const p = document.querySelector('td.content p table');
            if (!p) return;
            // Move it to before the high score buttons's containing elements
            center.insertBefore(p.parentElement, a.parentElement);
            return;
        }
        // Successful flip screen, look for Continue button
        const continueButton = document.querySelector('input[value="Continue"]');
        if (continueButton) {
            // Continue button is inside a <center> tag two levels up
            const center = continueButton.parentElement.parentElement;
            // Move it to after the ruffle element, which is before the <center> that contains the above <center>
            const center2 = center.parentElement;
            center2.parentElement.insertBefore(center, center2);
            return;
        }
        // Flip screen, any round but the first - look for the coin image
        let coin = document.querySelector('img[src="//images.neopets.com/medieval/coin_heads.gif"]');
        if (!coin) coin = document.querySelector('img[src="//images.neopets.com/medieval/coin_tails.gif"]');
        if (coin) {
            // Move the p that contains the coin image to immediately after the image of the Skeith
            const p = coin.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;
            const p2 = document.querySelector('center img[src="//images.neopets.com/medieval/coin_skeith.gif"]').nextSibling;
            p2.parentElement.insertBefore(p, p2);
        }
        // Lose screen, look for Try Again button
        const tryAgainButton = document.querySelector('input[value="Try again..."]');
        if (tryAgainButton) {
            const center = tryAgainButton.parentElement.parentElement;
            // Moves it before an empty <p></p> that seems to just act as a <br>
            center.parentElement.insertBefore(center, center.previousSibling);
            return;
        }
    }

    // CHEESEROLLER
    if (window.location.href.includes('://www.neopets.com/medieval/cheeseroller.phtml')) {
        const td = document.querySelector('td.content');
        const p = td.querySelector('p');
        const center = document.createElement('center');
        td.insertBefore(center, p.nextSibling);

        const form = document.querySelector('form[action="cheeseroller.phtml"]');
        if (form) {
            center.appendChild(form);

            const backToGames = document.querySelector('form[action="//www.neopets.com/gameroom.phtml"]');
            if (backToGames) center.appendChild(backToGames);

            const hillside = document.querySelector('img[src="//images.neopets.com/medieval/cheese_slope.gif"]');
            if (hillside) {
                // p is the element which tells you how far is left and how long has elapsed
                const p = hillside.parentElement.querySelector('hr + p');
                center.appendChild(p);
            }
        }
    }
})();