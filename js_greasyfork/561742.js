// ==UserScript==
// @name         Penpa Answer Checking
// @namespace    http://tampermonkey.net/
// @version      2026-01-07
// @description  Add a button to count the number of errors for puzzles on penpa.
// @author       Leaving Leaves
// @match        https://opt-pan.github.io/penpa-edit/?m=solve&*
// @match        https://swaroopg92.github.io/penpa-edit/#m=solve&*
// @icon         https://opt-pan.github.io/penpa-edit/css/images/logo.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561742/Penpa%20Answer%20Checking.user.js
// @updateURL https://update.greasyfork.org/scripts/561742/Penpa%20Answer%20Checking.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let button_HTML = [
        '<span class="tooltip">',
        '    <button id="check_solution" class="button" value="Check">Check</button>',
        '    <span id="check_text" class="tooltiptext">Check for errors</span>',
        '</span>'].join('');
    document.querySelector("#bottom_button > br").insertAdjacentHTML('beforebegin', button_HTML);
    let check_button = document.getElementById("check_solution");
    check_button.addEventListener('click', function() {
        let solution = pu.solution;
        if (solution === "") {
            alert('No answer checking!');
            return;
        }
        if (typeof(solution)==="string") {
            solution = JSON.parse(solution);
        }
        let error_cnt = pu.make_solution().map((e,i) => e.filter(ee => !(solution[i].includes(ee)))).flat().length;
        alert('Error count: ' + error_cnt);
    });
})();