// ==UserScript==
// @name         Gangsters Whores Auto Input
// @namespace    https://greasyfork.org/users/mleko95
// @version      1.0.3
// @description  Automatycznie ustawia wartości inputów na stronach g2.gangsters.pl (whores) według mapy ustawień
// @author       mleko95
// @match        *://g2.gangsters.pl/?module=whores&page=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gangsters.pl
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551340/Gangsters%20Whores%20Auto%20Input.user.js
// @updateURL https://update.greasyfork.org/scripts/551340/Gangsters%20Whores%20Auto%20Input.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // Funkcja do pobrania numeru strony z URL
    function getPageNumber() {
        const params = new URLSearchParams(window.location.search);
        return parseInt(params.get("page"), 10) || 1;
    }

    const page = getPageNumber();

    /**
     * MAPA STRONA → {divNumer: "wartość"}
     * divNumer to ta liczba z fullxpath (div/div[3], div/div[4] itd.)
     * Przykład:
     *   page=1 → div[3] = "10", div[4] = "20"
     */
    const valuesForPages = {
1: { 2:"62", 3: "69", 4: "67", 5: "70", 6: "69", 7: "0", 8: "72", 9: "72", 10: "69", 11: "69" },
2: { 2:"68", 3: "71", 4: "68", 5: "69", 6: "70", 7: "69", 8: "69", 9: "70", 10: "21", 11: "17" },
3: { 2:"14", 3: "12", 4: "11", 5: "10", 6: "8", 7: "8", 8: "7", 9: "7", 10: "6", 11: "7" },
4: { 2:"6", 3: "0", 4: "6" }


    };

    const values = valuesForPages[page];
    if (!values) {
        console.log("Brak zdefiniowanych wartości dla strony", page);
        return;
    }

    // Ustawiamy wartości w inputach
    Object.entries(values).forEach(([divNum, val]) => {
        const xpath = `/html/body/div[1]/div[3]/div[2]/div[2]/div/div[${divNum}]/table/tbody/tr/td[3]/form[1]/div/input`;
        const el = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;

        if (el) {
            el.value = val;
            console.log(`✅ Ustawiono div[${divNum}] = ${val}`);
        } else {
            console.warn(`⚠️ Nie znaleziono inputa dla div[${divNum}] na stronie ${page}`);
        }
    });

})();
