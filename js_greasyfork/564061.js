// ==UserScript==
// @name         YouTube Error Auto-Reload (Multi-Language)
// @namespace    Cozy
// @version      1.5
// @license      MIT
// @description  Site-Reloader GER // "Inhalte nicht verfügbar" / US // "Content isn't available"
// @author       Cozy
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/564061/YouTube%20Error%20Auto-Reload%20%28Multi-Language%29.user.js
// @updateURL https://update.greasyfork.org/scripts/564061/YouTube%20Error%20Auto-Reload%20%28Multi-Language%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Liste der Fehlermeldungen
    const errorMessages = [
        // Deutsch / German
        "Diese Inhalte sind derzeit nicht verfügbar",

        // Englisch / English
        "This content isn't available"
    ];

    // Prüfung alle 1 Sekunden
    const checkInterval = 1000;

    console.log("YouTube Auto-Reload Skript läuft...");

    setInterval(function() {
        if (!document.body) return;

        const pageText = document.body.textContent;

        const errorFound = errorMessages.some(function(satz) {
            return pageText.includes(satz);
        });

        if (errorFound) {
            console.log("Fehler erkannt! Seite wird neu geladen...");
            window.location.reload();
        }

    }, checkInterval);

})();