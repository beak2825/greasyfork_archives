// ==UserScript==
// @name        Neopets - Petpet Lab Visual Selector
// @namespace   https://neopets.com/
// @author      Kaero
// @version     2025.12.23
// @description Displays Petpets in a grid again
// @match       https://www.neopets.com/petpetlab.phtml*
// @grant       none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/559992/Neopets%20-%20Petpet%20Lab%20Visual%20Selector.user.js
// @updateURL https://update.greasyfork.org/scripts/559992/Neopets%20-%20Petpet%20Lab%20Visual%20Selector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function init() {
        // 1. Locate the dropdown by its unique onchange attribute
        const selectMenu = document.querySelector('select[onchange*="selectPetpet"]');
        const pplDivs = document.querySelectorAll('.ppl-petpet');

        if (!selectMenu || pplDivs.length === 0) return;

        // Prevent double injection
        if (document.getElementById('ppl-grid-selector')) return;

        // 2. Create the Responsive Grid Container
        const grid = document.createElement('div');
        grid.id = 'ppl-grid-selector';
        grid.style = `
            display: grid;
            /* auto-fit + minmax(150px, 1fr):
               - Fits as many columns as possible given the width.
               - Each column must be at least 150px wide.
               - If space remains, they stretch (1fr).
               - Max-width 800px ensures we never get more than 4 cols (150px * 5 + gaps > 800px).
            */
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin: 20px auto;
            max-width: 800px; /* Limits to ~4 columns */
            width: 95%;       /* Ensures it fits nicely on mobile screens */
            padding: 15px;
            background: #fff;
            border: 3px solid #6e4e37;
            border-radius: 15px;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
            box-sizing: border-box;
        `;

        // 3. Extract and display Petpet data
        pplDivs.forEach(div => {
            const petName = div.id.replace('PPL', '');
            const img = div.querySelector('img');
            const text = div.querySelector('p');

            if (!img || !text) return;

            const card = document.createElement('div');
            card.className = 'petpet-grid-card';
            card.style = `
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border: 2px solid #ddd;
                border-radius: 10px;
                padding: 15px;
                text-align: center;
                cursor: pointer;
                background: #fdfdfd;
                transition: transform 0.2s, border-color 0.2s, box-shadow 0.2s;
                min-height: 180px; /* Uniform height for cleaner look */
            `;

            card.innerHTML = `
                <img src="${img.src}" style="width: 80px; height: 80px; object-fit: contain; margin-bottom: 8px;">
                <b style="font-size: 14px; color: #333; margin-bottom: 4px;">${petName}</b>
                <span style="font-size: 11px; color: #777;">(${img.alt})</span>
                <i style="font-size: 11px; color: #555; margin-top: auto; padding-top: 8px;">"${text.innerText}"</i>
            `;

            // Hover effects
            card.onmouseover = () => {
                card.style.borderColor = "#ffb84d";
                card.style.transform = "translateY(-3px)";
                card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
            };
            card.onmouseout = () => {
                if (selectMenu.value !== petName) {
                    card.style.borderColor = "#ddd";
                    card.style.transform = "none";
                    card.style.boxShadow = "none";
                } else {
                    card.style.transform = "none"; // Keep selected flat but colored
                }
            };

            // Selection Logic
            card.onclick = () => {
                selectMenu.value = petName;
                selectMenu.dispatchEvent(new Event('change'));

                // Visual feedback
                document.querySelectorAll('.petpet-grid-card').forEach(c => {
                    c.style.background = "#fdfdfd";
                    c.style.borderColor = "#ddd";
                    c.style.boxShadow = "none";
                });
                card.style.background = "#fff9e6";
                card.style.borderColor = "#ffb84d";
            };

            grid.appendChild(card);
        });

        // 4. Insert directly before the dropdown container
        selectMenu.parentNode.insertBefore(grid, selectMenu);
    }

    // Run initialization
    if (document.readyState === 'loading') {
        window.addEventListener('load', init);
    } else {
        init();
    }
})();