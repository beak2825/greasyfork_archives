// ==UserScript==
// @name           Neopets - Lunar Temple Answer Highlighter
// @version        1.0
// @description    Highlights the correct answer for the Lunar Temple Daily
// @match          *://*.neopets.com/shenkuu/lunar/?show=puzzle
// @author         0o0slytherinpride0o0
// @namespace      https://github.com/0o0slytherinpride0o0/
// @license        MIT
// @downloadURL https://update.greasyfork.org/scripts/549416/Neopets%20-%20Lunar%20Temple%20Answer%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/549416/Neopets%20-%20Lunar%20Temple%20Answer%20Highlighter.meta.js
// ==/UserScript==

(function() {
  
    'use strict';
    
    const once = {
        once: true,
    };
 
    function init() {
        var angleKreludor = document.querySelector("td.content").innerHTML.match(/angleKreludor=([0-9]*)&/);
        var answerTable = document.querySelector("td.content form[method='post'][action='results.phtml']");
        
        if (angleKreludor != null && answerTable != null) {
        
            // the solution according to JN is just dividing by 22.5 and rounding
            // also 0 and 16 have the same solution
            var solutionNum = Math.round(Number(angleKreludor[1])/22.5) % 16;
            
            // the image numbers don't match the solution numbers though:
            // the image numbers are 0-15 from the top left to the bottom right
            // the solution numbers are 0-15 from the bottom left to the top right
            // so the new moon (all black) is the image 0.gif but 8 is the solution number
            const imageNumArr = Array(8).fill(1).map((x, index) => index + 8).concat(Array(8).fill(1).map((x, index) => index));
            var imageNum = imageNumArr[solutionNum];
            
            var solutionImg = answerTable.querySelector('img[src="https://images.neopets.com/shenkuu/lunar/phases/' + imageNum + '.gif"]');
            solutionImg.style.borderRadius = "60%";
            solutionImg.parentElement.style.backgroundColor = "#4A9BCF";
        }
    }
 
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
        init();
    } else {
        window.addEventListener('DOMContentLoaded', init, once);
    }
    
})();