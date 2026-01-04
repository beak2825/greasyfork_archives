// ==UserScript==
// @name         GC Beauty Contest Keyboard Controls
// @namespace    https://greasyfork.org/en/users/1175371/
// @version      0.2
// @description  Adds keyboard controls to GC Beauty Contest for ease of navigation.
// @author       sanjix
// @match        https://www.grundos.cafe/art/beauty/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558286/GC%20Beauty%20Contest%20Keyboard%20Controls.user.js
// @updateURL https://update.greasyfork.org/scripts/558286/GC%20Beauty%20Contest%20Keyboard%20Controls.meta.js
// ==/UserScript==

var entries = document.querySelectorAll('.bc_entry form button');
var nextSpecies = document.querySelector('span a[href*="/art/beauty/vote?get_species"]');
var backToEntries = document.querySelector('#entryReportBlock ~ div a');
var vote = document.querySelector('input[name="do_vote"]');
var index = 0;
document.addEventListener("keydown", (event) => {
    switch (event.key) {
        case 'Enter':
            {
                vote.click();
            }
            break;
        case "ArrowRight":
            {
                event.preventDefault();
                nextSpecies.click();
            }
            break;
        case "ArrowLeft":
            {
                //backToEntries.click();
                history.back();
            }
            break
   }
});