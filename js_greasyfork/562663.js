// ==UserScript==
// @name        Copy specs
// @description Shows button to copy specs of food with tab seperation
// @namespace   shiftgeist
// @match       https://fddb.info/db/de/lebensmittel/*/*
// @grant       none
// @version     202601141
// @author      shiftgeist
// @license     GNU GPLv3
// @icon        https://www.google.com/s2/favicons?sz=64&domain=fddb.info
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/562663/Copy%20specs.user.js
// @updateURL https://update.greasyfork.org/scripts/562663/Copy%20specs.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const btn = document.createElement('button')
    btn.style.margin = '5px'
    btn.style.padding = '6px 14px'
    btn.style.background = '#333'
    btn.style.color = 'white'
    btn.style.border = '2px solid #69f'
    btn.style.cursor = 'pointer'
    btn.style.borderRadius = '4px'

    btn.textContent = 'COPY SPECS'

    const headline = document.querySelector('.pageheadline')
    headline.appendChild(btn)

    function collectData() {
        const data = Array.from(document.querySelectorAll('.standardcontent > div:nth-child(2) > div:not(.itemsec2012) > div:nth-child(2)')).map(v => {
          const match = v.innerText.trim().match(/[\d.,]+/)

          if (!match) return 0;

          return match[0].replace(',', '.')
        });

        const [_1, kcal, protein, carbs, sugar, _2, fat, fiber] = data;
        const salt = data[21]
        const unsatFat = ''
        const sortedData = [kcal, fat, unsatFat, carbs, sugar, protein, fiber, salt]

        const out = `${sortedData.join('\t')}`;

        console.log('=== Average Content ===');
        console.log(out);
        GM_setClipboard(out);
        console.log('✅ Copied to clipboard!');
    }

    btn.addEventListener('click', () => {
        collectData();
    });
}());
