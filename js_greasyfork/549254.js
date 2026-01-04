// ==UserScript==
// @name         Rehab Travel Blocker
// @namespace    rehab_travel_blocker.biscuitius
// @version      1.0
// @description  Prevents travel home from Switzerland until rehab box is ticked
// @author       Biscuitius [1936433]
// @match        https://www.torn.com/index.php
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/549254/Rehab%20Travel%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/549254/Rehab%20Travel%20Blocker.meta.js
// ==/UserScript==

(function() {

    const countryElement = document.querySelector('#skip-to-content');
    const travelHomeButton = document.querySelector('a.travel-home');
    const topPageLinksList = document.getElementById('top-page-links-list');

    if (countryElement && travelHomeButton) {
        const country = countryElement.textContent.trim();
        if (country === 'Switzerland') {

            // Create a tickbox labelled "Done Rehab?"
            const tickBoxContainer = document.createElement('div');
            tickBoxContainer.style.display = 'inline-block';
            tickBoxContainer.style.marginLeft = '6px';
            tickBoxContainer.style.padding = '5px 10px';
            tickBoxContainer.style.lineHeight = '14px';
            tickBoxContainer.style.zIndex = '1000';
            const tickBox = document.createElement('input');
            tickBox.type = 'checkbox';
            tickBox.id = 'doneRehabCheckbox';
            tickBox.style.marginRight = '4px';
            const label = document.createElement('label');
            label.htmlFor = 'doneRehabCheckbox';
            label.textContent = 'Done Rehab?';
            label.style.position = 'relative';
            label.style.top = '-1px';
            tickBoxContainer.appendChild(tickBox);
            tickBoxContainer.appendChild(label);
            topPageLinksList.appendChild(tickBoxContainer);

            // Hide the travel home button until the tickbox is checked
            travelHomeButton.style.display = 'none';
            tickBox.addEventListener('change', function() {
                travelHomeButton.style.display = this.checked ? 'inline' : 'none';
            });

            // Attempt to fix Torn's shitty css for the travel home button
            const travelHomeIconOuter = travelHomeButton.querySelector('.icon-wrap');
            const travelHomeIconInner = travelHomeButton.querySelector('.link-icon-svg.travel-home');
            const travelHomeText = travelHomeButton.querySelector('#travel-home');

            travelHomeButton.style.verticalAlign = 'middle';
            travelHomeButton.style.lineHeight = '26px';
            travelHomeButton.style.height = '26px';
            travelHomeButton.style.margin = '0';
            travelHomeButton.style.padding = '0';
            travelHomeButton.style.paddingLeft = '10px';

            travelHomeText.style.display = 'inline-block';
            travelHomeText.style.verticalAlign = 'middle';
            travelHomeText.style.lineHeight = '28px';
            travelHomeText.style.height = '26px';
            travelHomeText.style.margin = '0';
            travelHomeText.style.padding = '0';

            travelHomeIconOuter.style.display = 'inline-block';
            travelHomeIconOuter.style.verticalAlign = 'middle';
            travelHomeIconOuter.style.lineHeight = '26px';
            travelHomeIconOuter.style.height = '26px';
            travelHomeIconOuter.style.margin = '0';
            travelHomeIconOuter.style.padding = '0';

            travelHomeIconInner.style.display = 'inline-block';
            travelHomeIconInner.style.verticalAlign = 'middle';
            travelHomeIconInner.style.lineHeight = '26px';
            travelHomeIconInner.style.height = '26px';
            travelHomeIconInner.style.margin = '0';
            travelHomeIconInner.style.padding = '0';
        }
    }
})();