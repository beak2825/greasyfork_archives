// ==UserScript==
// @name         BetterSama
// @version      1.0.4
// @description  Removes useless UI elements and puts the content fullscreen
// @author       Cratereprofond
// @match        https://anime-sama.si/*
// @grant        none
// @run-at       document-end
// @namespace https://greasyfork.org/users/your-id-here
// @downloadURL https://update.greasyfork.org/scripts/558820/BetterSama.user.js
// @updateURL https://update.greasyfork.org/scripts/558820/BetterSama.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        #sousBlocMiddle {
            width: auto;
            position: absolute;
            left: 2rem;
            right: 2rem;
            height: 100rem;
        }

        html, body {
            height: 100%;
        }
        
        #sousBlocLeft, #sousBlocRight, .flex.flex-col.items-center.justify-center, footer{
            display: none;
        }
    `;

    document.head.appendChild(style);
})();
