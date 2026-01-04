// ==UserScript==
// @name         Pornhub - Forçar ES + Millores de Cerca
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Redirigeix a es.pornhub.com, ordena resultats per 'Més vistos' i exclou categories específiques.
// @description:es  Redirige a es.pornhub.com, ordena resultados por 'Más vistos' y excluye categorías específicas.
// @author       Anna i Margu (+ Anna, que Margu 😅)
// @match        *://*.pornhub.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/552047/Pornhub%20-%20For%C3%A7ar%20ES%20%2B%20Millores%20de%20Cerca.user.js
// @updateURL https://update.greasyfork.org/scripts/552047/Pornhub%20-%20For%C3%A7ar%20ES%20%2B%20Millores%20de%20Cerca.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- CONFIGURACIÓ ---
    const dominiCorrecte = 'es.pornhub.com';

    const parametresDeCerca = {
        'o': 'mv', // Ordenar per 'Most Viewed'
        'exclude_category': '57-6-29-63-28-582-602-572-83' // Excloure categories
    };
    // --------------------

    const urlActual = new URL(window.location.href);
    let calRecarregar = false;

    // 1. Comprovem el domini/subdomini
    // Si el 'hostname' no és el que volem, el canviem.
    if (urlActual.hostname !== dominiCorrecte) {
        urlActual.hostname = dominiCorrecte;
        calRecarregar = true;
    }

    // 2. Comprovem si estem a la pàgina de cerca per afegir els paràmetres
    // El 'pathname' és la part de la URL que ve després del domini (ex: /video/search)
    if (urlActual.pathname.startsWith('/video/search')) {
        // Iterem sobre cada paràmetre que volem afegir
        for (const nom in parametresDeCerca) {
            // Comprovem si el paràmetre NO existeix a la URL actual
            if (!urlActual.searchParams.has(nom)) {
                const valor = parametresDeCerca[nom];
                urlActual.searchParams.append(nom, valor);
                calRecarregar = true; // Marquem que cal recarregar la pàgina
            }
        }
    }

    // 3. Si hem fet qualsevol canvi (de domini o de paràmetres), recarreguem la pàgina
    if (calRecarregar) {
        window.location.href = urlActual.toString();
    }
})();