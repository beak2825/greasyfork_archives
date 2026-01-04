// ==UserScript==
// @name         NSWpedia Timer Skipper
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Überspringt den Wait-Timer auf NSWpedia.com und zeigt sofort den Download-Link an
// @author       You
// @match        https://nswpedia.com/*
// @match        http://nswpedia.com/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550678/NSWpedia%20Timer%20Skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/550678/NSWpedia%20Timer%20Skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('NSWpedia Timer Skipper: Script geladen');

    function skipTimer() {
        // Warte bis das DOM vollständig geladen ist
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', skipTimer);
            return;
        }

        // Suche nach dem Progress Container
        const progressContainer = document.querySelector('.progress-container');
        const downloadSection = document.getElementById('download-section');
        const progressBar = document.querySelector('.progress-bar');

        if (progressContainer && downloadSection) {
            console.log('NSWpedia Timer Skipper: Timer gefunden, überspringe...');
            
            // Verstecke den Progress Container
            progressContainer.style.display = 'none';
            
            // Zeige den Download-Section sofort an
            downloadSection.style.display = 'block';
            
            // Setze die Progress Bar auf 100%
            if (progressBar) {
                progressBar.style.width = '100%';
                progressBar.setAttribute('aria-valuenow', '100');
                progressBar.textContent = '100%';
            }

            console.log('NSWpedia Timer Skipper: Timer erfolgreich übersprungen!');
        } else {
            // Falls die Elemente noch nicht geladen sind, versuche es erneut
            setTimeout(skipTimer, 100);
        }
    }

    // Starte das Script sofort
    skipTimer();

    // Zusätzlich: Überwache Änderungen am DOM (für dynamisch geladene Inhalte)
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'childList') {
                // Prüfe ob neue Timer-Elemente hinzugefügt wurden
                const progressContainer = document.querySelector('.progress-container');
                const downloadSection = document.getElementById('download-section');
                
                if (progressContainer && progressContainer.style.display !== 'none') {
                    skipTimer();
                }
            }
        });
    });

    // Starte das DOM-Überwachung
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Zusätzliche Sicherheit: Überspringe Timer auch bei Seitenwechseln
    window.addEventListener('beforeunload', function() {
        observer.disconnect();
    });

})();
