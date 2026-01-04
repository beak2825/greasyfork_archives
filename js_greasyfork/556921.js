// ==UserScript==
// @name         Mejoras en resultados de Mercado Libre Colombia
// @namespace    http://tampermonkey.net/
// @version      20251202.2
// @description  Disminuye la opacidad de resultados de Mercado Libre Colombia con tiempo de entrega, promocionados y compra internacional, además de señalar claramente los articulos usados y reacondicionados
// @author       74m45h11@gmail.com
// @match        https://listado.mercadolibre.com.co/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=mercadolibre.com.co
// @grant        GM_addStyle
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/556921/Mejoras%20en%20resultados%20de%20Mercado%20Libre%20Colombia.user.js
// @updateURL https://update.greasyfork.org/scripts/556921/Mejoras%20en%20resultados%20de%20Mercado%20Libre%20Colombia.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const cssRulesBorde = `
        .usado-reacondicionado {
            border: 2px solid #ff8800 !important; /* Borde anaranjado */
            border-radius: 8px !important;       /* Bordes redondeados */
            padding: 5px !important;             /* Espaciado para que el borde se vea bien */
        }
    `;

    GM_addStyle(cssRulesBorde);

    const selectorMFT = `div.poly-card:has(span.poly-component__manufacturing-time)`;
    const selectorCBT = `div.poly-card:has(span.poly-component__cbt)`;
    const selectorAd = `div.poly-card:has(a.poly-component__ads-promotions)`;

    const cssRules = `
        ${selectorMFT} {
            opacity: 0.3 !important;
            transition: opacity 0.5s ease; /* Opcional: añade una transición suave */
        }

        /* Opcional: Aumentar la opacidad al pasar el ratón para ver el contenido */
        ${selectorMFT}:hover {
            opacity: 1.0 !important;
        }

        ${selectorCBT} {
            opacity: 0.3 !important;
            transition: opacity 0.5s ease;
        }

        ${selectorCBT}:hover {
            opacity: 1.0 !important;
        }
        
        ${selectorAd} {
            opacity: 0.3 !important;
            transition: opacity 0.5s ease;
        }

        ${selectorAd}:hover {
            opacity: 1.0 !important;
        }
    `;

    GM_addStyle(cssRules);

    function applyUsadoReacondicionadoStyles() {
        const items = document.querySelectorAll('div.poly-card');

        const conditionTexts = ['Usado', 'Reacondicionado'];

        items.forEach(div => {
            const conditionSpan = div.querySelector('span.poly-component__item-condition');

            if (conditionSpan) {
                const conditionText = conditionSpan.textContent.trim().toLowerCase();

                const shouldAddBorder = conditionTexts.some(text =>
                    conditionText.includes(text.toLowerCase())
                );

                if (shouldAddBorder) {
                    div.parentElement.classList.add('usado-reacondicionado');
                }
            }
        });
    }

    applyUsadoReacondicionadoStyles();

})();