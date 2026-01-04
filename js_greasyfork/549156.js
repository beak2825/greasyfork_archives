// ==UserScript==
// @name         WME Copy Segment Info Button
// @version      0.2
// @description  Voegt een knop toe in WME om geselecteerde segmentgegevens te kopiëren naar het clipboard
// @author       Ronald (rdnnk)
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @grant        GM_setClipboard
// @namespace https://chat.openai.com/
// @downloadURL https://update.greasyfork.org/scripts/549156/WME%20Copy%20Segment%20Info%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/549156/WME%20Copy%20Segment%20Info%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function waitForWME() {
        if (typeof W === 'undefined' || typeof W.selectionManager === 'undefined') {
            setTimeout(waitForWME, 5000);
        } else {
            addButtonWhenReady();
        }
    }

    function addButtonWhenReady() {
        const observer = new MutationObserver(() => {
            const overlayButtons = document.querySelector('.overlay-buttons-container');
            if (overlayButtons && !document.getElementById('copy-segment-button')) {
                const button = document.createElement('wz-button');
                button.id = 'copy-segment-button';
                button.className = 'layer-switcher-button overlay-button';
                button.setAttribute('color', 'clear-icon');

                const icon = document.createElement('i');
                icon.className = 'w-icon w-icon-copy';
                button.appendChild(icon);

                button.addEventListener('click', copySegmentInfo);

                overlayButtons.appendChild(button);

                console.log('✅ Copy Segment button edit in WME.');
                observer.disconnect(); // Stop observer 
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

function copySegmentInfo() {
    const addressSpan = document.querySelector('.full-address-container .full-address');
    const button = document.getElementById('copy-segment-button');

    if (!addressSpan) {
        button.style.background = 'red';
        button.textContent = '❌ Geen adres';
        setTimeout(() => {
            button.style.background = '#2b8cbe';
            button.textContent = '📋 Copy Addr';
        }, 1500);
        return;
    }

    let addressText = addressSpan.innerText.trim();

    // Vind de laatste komma (scheiding stad/land)
    const lastCommaIndex = addressText.lastIndexOf(',');
    if (lastCommaIndex === -1) {
        button.style.background = 'red';
        button.textContent = '❌ Ongeldig adres';
        setTimeout(() => {
            button.style.background = '#2b8cbe';
            button.textContent = '📋';
        }, 4500);
        return;
    }

    const withoutCountry = addressText.substring(0, lastCommaIndex).trim(); // verwijder land

    // Vind de laatste komma opnieuw (nu tussen straat en stad)
    const secondLastCommaIndex = withoutCountry.lastIndexOf(',');
    if (secondLastCommaIndex === -1) {
        // Geen stad gevonden, gewoon kopiëren
        GM_setClipboard(withoutCountry);
    } else {
        const street = withoutCountry.substring(0, secondLastCommaIndex).trim();
        const city = withoutCountry.substring(secondLastCommaIndex + 1).trim();

        let formatted;
        if (street.toLowerCase() === city.toLowerCase() || city.toLowerCase()==='no city') {
            formatted = street;
        } else {
            formatted = `${street} in ${city}`;
        }

        GM_setClipboard(formatted);
    }

    // Visuele bevestiging
    button.style.background = 'gold';
    button.textContent = '✅';
    setTimeout(() => {
        button.style.background = '#2b8cbe';
        button.textContent = '📋';
    }, 1000);
}


    waitForWME();
})();
