// ==UserScript==
// @name         Wordle Definition Button
// @author       Minjae Kim
// @version      2.06
// @description  Adds a button to show the meaning of Wordle's answer on Merriam Webster
// @match        http*://www.nytimes.com/games/wordle/*
// @include      http*://*wordle*
// @match        https://www.nytimes.com/games/wordle/*
// @include      *://*wordle*
// @include      *://*/games/wordle/*
// @match        *://*wordle*/*
// @match        *://*/wordle*/*
// @icon         https://static01.nyt.com/images/2022/03/02/crosswords/alpha-wordle-icon-new/alpha-wordle-icon-new-smallSquare252-v3.png?format=pjpg&quality=75&auto=webp&disable=upscale
// @run-at       document-idle
// @grant        none
// @license      MIT
// @namespace clearjade
// @downloadURL https://update.greasyfork.org/scripts/557291/Wordle%20Definition%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/557291/Wordle%20Definition%20Button.meta.js
// ==/UserScript==

setInterval(function() {
    'use strict';
    
    for (let i = 6; i >= 1; i--) {
        const rowSelect = document.querySelector(`div[aria-label="Row ${i}"]`);
        if (!rowSelect) continue;
        
        const row = rowSelect.querySelectorAll('[data-state]');
        const rowemptiness = Array.from(row).map(element => element.getAttribute('data-state'));
        
        if (rowemptiness.every(item => item === "correct")) {
            const selectrow = rowSelect.querySelectorAll('[aria-label]');
            const label = Array.from(selectrow).map(element => element.getAttribute('aria-label'));
            const letters = label.map(str => str.split(", ")[1]);
            var word = letters.join("");
            button();
            console.log(`Row ${i} ${word}`);
            return;
        }
    }
    

function button(){
    //const word = word;
    const newUrl = `https://www.merriam-webster.com/dictionary/${word}`;

    // Create button
    const button = document.createElement('button');
    button.textContent = word;
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 14px';
    button.style.fontSize = '14px';
    button.style.backgroundColor = '#1f9433';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';

    button.addEventListener('mouseenter', () => {
        button.style.backgroundColor = '#00A308';
    });
    button.addEventListener('mouseleave', () => {
        button.style.backgroundColor = '#1f9433';
    });
    button.addEventListener('click', () => {
        window.open(newUrl, '_self');
    });

    document.body.appendChild(button);
}
},2000);




