// ==UserScript==
// @name         Spelling Bee Definition Button
// @author       Minjae Kim
// @version      1.20
// @description  Click on the words found to go to its definition on Merriam Webster
// @match        https://www.nytimes.com/puzzles/spelling-bee
// @icon         https://www.nytimes.com/games-assets/v2/assets/icons/spelling-bee.svg
// @run-at       document-idle
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1529082-minjae-kim
// @downloadURL https://update.greasyfork.org/scripts/561108/Spelling%20Bee%20Definition%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/561108/Spelling%20Bee%20Definition%20Button.meta.js
// ==/UserScript==


//skip the start screen
/*
const autoClicker = setInterval(() => {
    const startButton = document.querySelectorAll('.pz-moment__button.primary.default');
    for (const continueBtn of startButton) {
        const btnText = continueBtn.textContent.toLowerCase();
        if (btnText.includes('continue')) {
            continueBtn.click();
        clearInterval(autoClicker);
        console.log("clicked");
        }
    }
}, 100);
*/


setInterval(function() {
    'use strict';
    
    let wordList = document.querySelectorAll('.sb-anagram');
    
    wordList.forEach((element) => {
        let word = element.innerText.trim();
        element.style.cursor = 'pointer';
        element.style.backgroundColor = '#f7da21';
        element.addEventListener('click', () => {
            const url = `https://www.merriam-webster.com/dictionary/${word}`;
            window.open(url, '_blank'); // Opens the definition in a new tab
        });
    });

},2000);


