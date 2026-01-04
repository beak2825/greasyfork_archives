// ==UserScript==
// @name         Cedric Revive
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Cedric is not dead... Yet.
// @author       @nowaratn
// @match        https://console.harmony.a2z.com/internal-ai-assistant*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/559560/Cedric%20Revive.user.js
// @updateURL https://update.greasyfork.org/scripts/559560/Cedric%20Revive.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeDisabled(element) {
        if (element.hasAttribute('disabled')) {
            element.removeAttribute('disabled');
        }

        element.classList.forEach(className => {
            if (className.includes('disabled')) {
                element.classList.remove(className);
            }
        });
    }

    function clickDismissButton() {
        // Znajdujemy przycisk dismiss po klasie
        const dismissButton = document.querySelector('.awsui_dismiss-button_mx3cw_1z2s0_403');
        if (dismissButton) {
            console.log('Found dismiss button, clicking...');
            dismissButton.click();
        }
    }

    function processElements() {
        // Znajdujemy wszystkie elementy z atrybutem disabled
        const disabledElements = document.querySelectorAll('[disabled]');
        disabledElements.forEach(removeDisabled);

        // Znajdujemy wszystkie elementy z klasą zawierającą 'disabled'
        const disabledClassElements = document.querySelectorAll('[class*="disabled"]');
        disabledClassElements.forEach(removeDisabled);

        // Próbujemy kliknąć przycisk dismiss
        clickDismissButton();
    }

    // Konfiguracja obserwatora
    const config = {
        attributes: true,
        childList: true,
        subtree: true
    };

    // Callback dla MutationObserver
    const callback = function(mutationsList, observer) {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'attributes') {
                processElements();
            }
        }
    };

    // Utworzenie i uruchomienie obserwatora
    const observer = new MutationObserver(callback);

    // Funkcja inicjalizująca
    function init() {
        // Najpierw przetwarzamy istniejące elementy
        processElements();

        // Następnie uruchamiamy obserwator
        observer.observe(document.body, config);

        // Dodatkowe wywołania z opóźnieniem
        setTimeout(processElements, 1000);
        setTimeout(processElements, 2000);
        setTimeout(processElements, 3000);
    }

    // Uruchamiamy gdy DOM jest gotowy
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Dodatkowe nasłuchiwanie na zdarzenie load
    window.addEventListener('load', processElements);
})();
