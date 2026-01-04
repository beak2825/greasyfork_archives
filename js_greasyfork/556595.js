// ==UserScript==
// @name         K12 Grade Highlighter
// @namespace    http://github.com/e016/k12-plus
// @version      2025-11-21
// @description  Highlights grades in the Courses, like in D2L. It can't highlight what-if scores, though.
// @author       d016
// @match        https://learn2.k12.com/courses/*/grades
// @icon         https://www.google.com/s2/favicons?sz=64&domain=k12.com
// @grant        none
// @license      GNU 3.0
// @downloadURL https://update.greasyfork.org/scripts/556595/K12%20Grade%20Highlighter.user.js
// @updateURL https://update.greasyfork.org/scripts/556595/K12%20Grade%20Highlighter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function highlightGrades() {
        var gradeElems = Array.from(document.querySelectorAll('span.tooltip')),
            totals = gradeElems.map((elem)=>(elem.innerText.split('\n')[1])).filter(x=>x);
        gradeElems.forEach((elem, i)=>{
            function highlight(elem, i) {
                elem.style.background = "unset";
                if(elem.innerText.includes("What-If")) {
                elem.style.background = 'rgba(128, 128, 128, 0.5)'
                    return
                }
            var split = totals[i]?.split?.("/");

            if(split?.length != 2) {
                return;
            }
            var percentage = +split[0] / +split[1];
            if(isNaN(percentage)) {
                return;
            }

                elem.style.background = percentage < 0.6 ? 'rgba(255,0,0,0.5)' : percentage < 0.8 ? 'rgba(255,128,0,0.5)' : 'rgba(0,255,0,0.5)';
            }
            highlight(elem, i)

            //elem.addEventListener('click', (event)=>(setTimeout(highlight,500,elem,i)))
        });
    setTimeout(highlightGrades, 500)
    }
    highlightGrades()
})();