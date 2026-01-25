// ==UserScript==
// @name         GC Hide Card Game Stats
// @namespace    https://greasyfork.org/en/users/1175371
// @version      0.2
// @description  Hide win/loss stats for GC's Pyramids, Sakhmet Solitaire, and Scarab 21.
// @author       sanjix
// @match        https://www.grundos.cafe/games/pyramids/
// @match        https://www.grundos.cafe/games/sakhmet_solitaire/
// @match        https://www.grundos.cafe/games/scarab21/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563956/GC%20Hide%20Card%20Game%20Stats.user.js
// @updateURL https://update.greasyfork.org/scripts/563956/GC%20Hide%20Card%20Game%20Stats.meta.js
// ==/UserScript==

var statsText = document.querySelector('h1[id="sakhmet-solitaire"] ~ div.center p + p + p, .center img[src="https://grundoscafe.b-cdn.net/desert/pyramids/pyramids_winner.gif"] ~ p +p +p, .center img[src="https://grundoscafe.b-cdn.net/games/scarab21/scarab21_winner.gif"] ~ p + p + p');
statsText.style.display = 'none';
var toggle = document.createElement('button');
document.querySelector('.center').style.marginBottom = '1em';
toggle.textContent = 'Toggle Stats';
statsText.after(toggle);
toggle.addEventListener('click', function() {
    if (statsText.style.display == 'none') {
        statsText.style.display = 'block';
    } else {
        statsText.style.display = 'none';
    }
});