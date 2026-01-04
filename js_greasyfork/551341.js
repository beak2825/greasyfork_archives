// ==UserScript==
// @name         Gangsters Bizesy - zakup
// @namespace    https://greasyfork.org/users/mleko95
// @version      1.0.3
// @description  Automatycznie ustawia wartości inputów na stronach g2.gangsters.pl (whores) według mapy ustawień
// @author       mleko95
// @match        *://g2.gangsters.pl/?module=business&page=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gangsters.pl
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/551341/Gangsters%20Bizesy%20-%20zakup.user.js
// @updateURL https://update.greasyfork.org/scripts/551341/Gangsters%20Bizesy%20-%20zakup.meta.js
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
1: { 2:"16", 3: "18", 4: "17", 5: "16", 6: "17", 7: "16", 8: "15", 9: "15", 10: "16", 11: "16", 12: "17", 13: "16", 14: "16", 15: "16", 16: "16" },
2: { 2:"17", 3: "16", 4: "17", 5: "16", 6: "16", 7: "16", 8: "15", 9: "16", 10: "16", 11: "16", 12: "16", 13: "16", 14: "17", 15: "16", 16: "15" },
3: { 2:"17", 3: "16", 4: "16", 5: "15", 6: "16", 7: "16", 8: "16", 9: "16", 10: "15", 11: "15", 12: "16", 13: "17", 14: "17", 15: "17", 16: "17" },
4: { 2:"16", 3: "16", 4: "15", 5: "16", 6: "17", 7: "17", 8: "16", 9: "16", 10: "16", 11: "17", 12: "17", 13: "13", 14: "11", 15: "9", 16: "9" },
5: { 2:"7", 3: "7", 4: "6", 5: "6", 6: "5", 7: "5", 8: "6", 9: "5", 10: "6", 11: "6", 12: "5", 13: "0", 14: "6", 15: "5", 16: "4" }

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
