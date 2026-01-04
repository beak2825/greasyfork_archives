// ==UserScript==
// @name         Sala do Futuro - Zoar Saudação Completa
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Troca toda a saudação ("Olá, Nome") por uma versão zoada
// @match        https://saladofuturo.educacao.sp.gov.br/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/551363/Sala%20do%20Futuro%20-%20Zoar%20Sauda%C3%A7%C3%A3o%20Completa.user.js
// @updateURL https://update.greasyfork.org/scripts/551363/Sala%20do%20Futuro%20-%20Zoar%20Sauda%C3%A7%C3%A3o%20Completa.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const randomStrings = [
        "the death",
        "your soul",
        "darkness",
        "the voice that screams in the silence",
        "the silence",
        "the plague"
    ];

    function changeWelcome() {
        const userSpan = document.querySelector(".MuiTypography-root.MuiTypography-h5");
        if (userSpan) {
            const randomText = randomStrings[Math.floor(Math.random() * randomStrings.length)];
            const parent = userSpan.parentNode;

            if (parent && !parent.textContent.includes("No, I'm not human")) {
                parent.textContent = `No, I'm not human, I am ${randomText}`;
            }
        }
    }

    // roda 1x ao carregar
    window.addEventListener('load', () => {
        setTimeout(changeWelcome, 1500); 
    });

})();
