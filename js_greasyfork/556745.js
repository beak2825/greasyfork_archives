// ==UserScript==
// @name         Crossword Labs Solver
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Automatically types the answer into crossword labs upon loading into a crossword page
// @author       You
// @match        https://crosswordlabs.com/view/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=crosswordlabs.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/556745/Crossword%20Labs%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/556745/Crossword%20Labs%20Solver.meta.js
// ==/UserScript==
async function solveCrossword() {
    const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    let extractedGrid = [];

    try {
        const scriptElements = document.querySelectorAll('script');
        let dataString = null;
        const startMarker = 'var grid = ';
        const endMarker = ']]';
        for (const script of scriptElements) {if (script.textContent.includes(startMarker)) {dataString = script.textContent; break;}}
        if (!dataString) return;
        const start = dataString.indexOf(startMarker) + startMarker.length;
        const end = dataString.indexOf(endMarker, start);
        if (start === -1 || end === -1 || end < start) return;
        let jsonString = dataString.substring(start, end + 2).trim().replace(/;$/, '');
        extractedGrid = JSON.parse(jsonString);
    } catch (e) {return;}

    if (!Array.isArray(extractedGrid) || extractedGrid.length === 0) return;

    let lettersFilled = 0;
    let errors = 0;

    for (let r = 0; r < extractedGrid.length; r++) {
        const rowData = extractedGrid[r];
        if (!Array.isArray(rowData)) continue;
        for (let c = 0; c < rowData.length; c++) {
            const cellObject = rowData[c];
            if (!cellObject || !cellObject.char) continue;
            const letter = String(cellObject.char || '').toUpperCase();
            if (letter.length === 0) continue;
            const groupId = `cx-${r}-${c}`;
            const groupElement = document.getElementById(groupId);
            if (groupElement) {
                try {groupElement.dispatchEvent(new MouseEvent('click', {bubbles: true, cancelable: true}));} catch (e) {groupElement.click();}
                const key = letter.charAt(0);
                const keyDownEvent = new KeyboardEvent('keydown', {key: key, keyCode: key.charCodeAt(0), bubbles: true, cancelable: true});
                document.dispatchEvent(keyDownEvent);
                const keyUpEvent = new KeyboardEvent('keyup', {key: key, keyCode: key.charCodeAt(0), bubbles: true, cancelable: true});
                document.dispatchEvent(keyUpEvent);
                const textElement = groupElement.querySelector('text.cx-a');
                if (textElement) {if (textElement.textContent !== key) {textElement.textContent = key;} lettersFilled++;} else {errors++;}
                await sleep(50);
            } else {errors++;}
        }
    }
}
solveCrossword();