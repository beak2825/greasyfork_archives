// ==UserScript==
// @name         Spelling Bee Buddy Simplify
// @namespace    https://github.com/PatrykCholewa
// @version      1.0.0
// @description  Removes used hints from NYT Spelling Bee Buddy
// @author       Patryk Cholewa
// @match        https://www.nytimes.com/*/spelling-bee-buddy.html
// @icon         https://www.nytimes.com/vi-assets/static-assets/favicon-d2483f10ef688e6f89e23806b9700298.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552504/Spelling%20Bee%20Buddy%20Simplify.user.js
// @updateURL https://update.greasyfork.org/scripts/552504/Spelling%20Bee%20Buddy%20Simplify.meta.js
// ==/UserScript==

const isSquareSolved = div => {
    const classList = div.classList;
    return !!classList && classList.contains('letter') && classList.contains('filled') && !classList.contains('remaining');
};

const clearSquareSolved = div => {
    div.style.backgroundColor = 'transparent';
};

const clearSquareIfSolved = div => {
    if (isSquareSolved(div)) {
        clearSquareSolved(div);
    }
};

const hideRow = div => {
    div.style.contentVisibility = 'hidden';
};

const cleanSquarePangram = squarePangram => {
    squarePangram.querySelectorAll('.row:nth-of-type(n+3):not(:last-of-type)').forEach(row => {
        row.querySelectorAll('.letter')
           .forEach(square => {
            clearSquareIfSolved(square);
        });
        if (Array.from(row.querySelectorAll('.letter')).filter(sq => sq.classList.contains('remaining')).length === 0) {
            hideRow(row);
        }
    });
};

const cleanListOfPairs = listOfPairs => {
    listOfPairs.querySelectorAll('.pair-container').forEach(cont => {
        const sq = cont.querySelector('.letter.filled');
        if (isSquareSolved(sq)) {
            cont.style.display = 'none';
        }
    });
};

const cleanWordTable = wordTable => {
    wordTable.querySelectorAll('.row.user-found').forEach(row => {
        row.style.display = 'none';
    });
};

(function() {
    'use strict';
    setInterval(() => {
        cleanSquarePangram(document.querySelector(".square-pangram-area"));
        cleanListOfPairs(document.querySelector(".list-of-pairs"));
        cleanWordTable(document.querySelector(".word-table"));
    }, 5000);
})();
