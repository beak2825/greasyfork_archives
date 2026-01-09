// ==UserScript==
// @name         Definition Button for spellbee.org
// @author       Minjae Kim
// @version      1.05
// @description  Click on the words found to go to its definition on Merriam Webster
// @match        https://spellbee.org/
// @icon         https://spellbee.org/assets/img/spelling-bee-game.png?v2
// @run-at       document-idle
// @grant        none
// @license      MIT
// @namespace    https://greasyfork.org/en/users/1529082-minjae-kim
// @downloadURL https://update.greasyfork.org/scripts/561991/Definition%20Button%20for%20spellbeeorg.user.js
// @updateURL https://update.greasyfork.org/scripts/561991/Definition%20Button%20for%20spellbeeorg.meta.js
// ==/UserScript==

addDefinition();

const enterButton = document.querySelector('#submit_button');
enterButton.addEventListener('click', (event) => {
   addDefinition();
});


window.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        addDefinition();
        }
});

function addDefinition() {
    'use strict';

    let wordList = document.querySelectorAll('.block-words-select__dropdown-els li');

    wordList.forEach((element) => {
        let word = element.innerText.trim();
        element.style.cursor = 'pointer';
        element.style.backgroundColor = 'rgba(222, 206, 31, 0.4)';
        element.addEventListener('click', () => {
            const url = `https://www.merriam-webster.com/dictionary/${word}`;
            window.open(url, '_blank'); // Opens the definition in a new tab
        });
    });

}
