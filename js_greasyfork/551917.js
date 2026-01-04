// ==UserScript==
// @name         LNB Partido → Live Button
// @namespace    https://www.laliganacional.com.ar/
// @version      1.1
// @description  Přidá tlačítko pro přechod na live URL
// @author       LM
// @license      MIT
// @match        https://www.laliganacional.com.ar/lfb/partido/*==/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551917/LNB%20Partido%20%E2%86%92%20Live%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/551917/LNB%20Partido%20%E2%86%92%20Live%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;
    const match = currentUrl.match(/partido\/([^=]+)==/);
    if (!match) return;

    const matchId = match[1];
    const liveUrl = `https://www.laliganacional.com.ar/lfb/partido/en-vivo/${matchId}==?key=`;

    const button = document.createElement('button');
    button.textContent = 'OTEVŘÍT LIVE URL';
    button.style.fontSize = '20px';
    button.style.padding = '14px 28px';
    button.style.background = '#ff4444';
    button.style.color = '#fff';
    button.style.fontWeight = 'bold';
    button.style.border = 'none';
    button.style.borderRadius = '10px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    button.style.transition = 'all 0.2s ease-in-out';
    button.onmouseover = () => button.style.background = '#ff2222';
    button.onmouseout = () => button.style.background = '#ff4444';
    button.onclick = () => window.open(liveUrl, '_blank');

    // Vyhledání cílového elementu podle XPath
    const xpath = "//main/div[1]/div[1]/div[2]";
    const target = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

    if (target) {
        target.appendChild(button);
    } else {
        console.warn("XPath nenalezen, tlačítko nebylo vloženo.");
    }
})();
