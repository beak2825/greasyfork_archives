// ==UserScript==
// @name         Drawaria Chaos
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  ХАОС
// @author       𝙎𝙞𝙡𝙡𝙮 𝘾𝙖𝙩`
// @match        https://drawaria.online/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550586/Drawaria%20Chaos.user.js
// @updateURL https://update.greasyfork.org/scripts/550586/Drawaria%20Chaos.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function randomColor() {
        return 'hsl(' + Math.floor(Math.random()*360) + ', 100%, 50%)';
    }

    function changeTextAndColors() {
        const allElements = document.querySelectorAll('body *');

        allElements.forEach(el => {
            
            if(el.children.length === 0 && el.textContent.trim() !== '') {
                el.textContent = "ТОТЯ. ♥️";
            }
  
            el.style.color = randomColor();
        });
    }

    setInterval(changeTextAndColors, 1000); 
})();