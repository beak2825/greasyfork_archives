// ==UserScript==
// @name         enhanced rejcounts.pl
// @namespace    https://greasyfork.org/de/users/1516523-martink
// @version      1.0.7
// @description  Fügt einen Button hinzu, um alle Händler in einem kombinierten Link zu öffnen
// @author       Martin Kaiser
// @match        https://opus.geizhals.at/pv-edit/rejcounts.pl*
// @run-at       document-idle
// @grant        none
// @license      MIT
// @icon         https://666kb.com/i/fxfm86s1jawf7ztn7.jpg
// @downloadURL https://update.greasyfork.org/scripts/552907/enhanced%20rejcountspl.user.js
// @updateURL https://update.greasyfork.org/scripts/552907/enhanced%20rejcountspl.meta.js
// ==/UserScript==


(function() {
    'use strict';

    let buttonInserted = false;

    function insertButton() {
        if (buttonInserted) return;

        // Finde das Element mit "Nicht erledigt:"
        const boldElements = document.querySelectorAll('b');
        let targetElement = null;

        for (const el of boldElements) {
            if (el.textContent.trim() === 'Nicht erledigt:') {
                targetElement = el;
                break;
            }
        }

        if (!targetElement) return;

        buttonInserted = true;

        // Button erstellen
        const button = document.createElement('button');
        button.textContent = 'Alle Händler öffnen';
        button.style.marginLeft = '10px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function() {
            // Alle Händler-Links finden
            const links = document.querySelectorAll('a[href*="kalif/matchcode/rejects#"][href*="haendler_id="]');

            if (links.length === 0) {
                alert('Keine Händler-Links gefunden.');
                return;
            }

            // Händler-IDs extrahieren
            const haendlerIds = [];
            for (const link of links) {
                const href = link.getAttribute('href');
                const match = href.match(/haendler_id=(\d+)/);
                if (match && match[1]) {
                    haendlerIds.push(match[1]);
                }
            }

            if (haendlerIds.length === 0) {
                alert('Keine Händler-IDs gefunden.');
                return;
            }

            // Basis-Parameter aus dem ersten Link extrahieren
            const firstHref = links[0].getAttribute('href');

            // URL und Hash-Fragment trennen
            const [baseUrl, fragment] = firstHref.split('#');

            // Fragment-Parameter parsen
            const params = fragment.split('&');
            const baseParams = [];
            let haendlerTags = '';
            let matchcodeTodoTag = '';

            for (const param of params) {
                if (param.startsWith('haendler_id=')) {
                    continue;
                } else if (param.startsWith('haendler_tags=')) {
                    haendlerTags = param;
                } else if (param.startsWith('matchcode_todo_tag=')) {
                    matchcodeTodoTag = param;
                } else {
                    baseParams.push(param);
                }
            }

            // Neuen kombinierten Link erstellen
            const haendlerIdParams = haendlerIds.map(id => 'haendler_id=' + id).join('&');

            let newFragment = baseParams.join('&');
            newFragment += '&' + haendlerIdParams;
            if (haendlerTags) {
                newFragment += '&' + haendlerTags;
            }
            if (matchcodeTodoTag) {
                newFragment += '&' + matchcodeTodoTag;
            }

            const newUrl = baseUrl + '#' + newFragment;

            // Link in neuem Tab öffnen
            window.open(newUrl, '_blank');
        });

        // Button nach "Nicht erledigt:" einfügen
        targetElement.parentNode.insertBefore(button, targetElement.nextSibling);
    }

    // Sofort versuchen
    insertButton();

    // MutationObserver für dynamisch geladenen Inhalt
    const observer = new MutationObserver(function(mutations) {
        if (!buttonInserted) {
            insertButton();
        } else {
            observer.disconnect();
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Fallback: Polling alle 2 Sekunden für bis zu 5 Minuten
    let attempts = 0;
    const maxAttempts = 150;
    const interval = setInterval(function() {
        attempts++;
        if (buttonInserted || attempts >= maxAttempts) {
            clearInterval(interval);
            return;
        }
        insertButton();
    }, 2000);

})();