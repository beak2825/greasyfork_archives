// ==UserScript==
// @name         Bulharsko - Basketbal eapi
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Změní bulharská jména z azbuky do latinky
// @author       Michal
// @match        https://eapi.web.prod.cloud.atriumsports.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552546/Bulharsko%20-%20Basketbal%20eapi.user.js
// @updateURL https://update.greasyfork.org/scripts/552546/Bulharsko%20-%20Basketbal%20eapi.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const cyrillicToLatin = {
        'А': 'A', 'а': 'a',
        'Б': 'B', 'б': 'b',
        'В': 'V', 'в': 'v',
        'Г': 'G', 'г': 'g',
        'Д': 'D', 'д': 'd',
        'Е': 'E', 'е': 'e',
        'Ж': 'Zh', 'ж': 'zh',
        'З': 'Z', 'з': 'z',
        'И': 'I', 'и': 'i',
        'Й': 'Y', 'й': 'y',
        'К': 'K', 'к': 'k',
        'Л': 'L', 'л': 'l',
        'М': 'M', 'м': 'm',
        'Н': 'N', 'н': 'n',
        'О': 'O', 'о': 'o',
        'П': 'P', 'п': 'p',
        'Р': 'R', 'р': 'r',
        'С': 'S', 'с': 's',
        'Т': 'T', 'т': 't',
        'У': 'U', 'у': 'u',
        'Ф': 'F', 'ф': 'f',
        'Х': 'H', 'х': 'h',
        'Ц': 'Ts', 'ц': 'ts',
        'Ч': 'Ch', 'ч': 'ch',
        'Ш': 'Sh', 'ш': 'sh',
        'Щ': 'Sht', 'щ': 'sht',
        'Ъ': 'A', 'ъ': 'a',
        'Ь': 'Y', 'ь': 'y',
        'Ю': 'Yu', 'ю': 'yu',
        'Я': 'Ya', 'я': 'ya'
    };

    const transliterate = (text) => {
        try {
            if (!text) return text;
            return text.split('').map(char => cyrillicToLatin[char] || char).join('');
        } catch (error) {
            console.error('Transliteration failed:', error, 'Text:', text);
            return text;
        }
    };

    const processCell = (cell) => {
        try {
            if (!cell || !cell.textContent) return;

            const originalText = cell.textContent;

            if (/[\u0400-\u04FF]/.test(originalText)) {
                const transliteratedText = transliterate(originalText);
                cell.title = `Original: ${originalText}`;
                cell.textContent = transliteratedText;
            }
        } catch (error) {
            console.error('Cell processing failed:', error, 'Cell:', cell);
        }
    };

    const processTable = () => {
        try {
            const nameCells = document.querySelectorAll('td[data-cellname="name"]');
            const teamCells = document.querySelectorAll('td[data-cellname="team"]');

            [...nameCells, ...teamCells].forEach(processCell);
        } catch (error) {
            console.error('Table processing failed:', error);
        }
    };

    try {
        processTable();

        const observer = new MutationObserver((mutations) => {
            try {
                const hasNewNodes = mutations.some(mutation => mutation.addedNodes.length > 0);
                if (hasNewNodes) processTable();
            } catch (error) {
                console.error('MutationObserver callback failed:', error);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    } catch (error) {
        console.error('Script initialization failed:', error);
    }
})();