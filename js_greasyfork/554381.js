// ==UserScript==
// @name         Guardian Crossword Better Checker
// @license      MIT
// @namespace    https://greasyfork.org/en/users/890062-garyt
// @version      2025-11-01
// @description  Check Guardian (Cryptic) Crosswords
// @author       GaryT
// @match        https://www.theguardian.com/crosswords/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theguardian.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554381/Guardian%20Crossword%20Better%20Checker.user.js
// @updateURL https://update.greasyfork.org/scripts/554381/Guardian%20Crossword%20Better%20Checker.meta.js
// ==/UserScript==

function chklist(list,results){
    for (let i = 0; i < list.length; i++) {
        results.clues++;
        let ans = list[i].querySelector("span.dcr-1i5wt9b");
        if (ans.textContent.includes("Answer correct.")){
            results.correct++;
            list[i].style.color = 'green';
        } else {
            list[i].style.color = 'red';
        }
    }
}

function chkclues(ser,serno){
    const sel = "-hints-crosswords/"+ser+"/"+serno;
    const aclist = document.getElementById("across"+sel).children;
    const dnlist = document.getElementById("down"+sel).children;
    let results = { correct : 0, clues : 0 };
    chklist(aclist,results);
    chklist(dnlist,results);
    if (results.correct == results.clues){
        alert("All Correct!")
    } else {
        alert(results.correct + " of " + results.clues + " correct");
    }
}

(function() {
    'use strict';
    console.log("GTGCCheck");
    const crozzi = "https://www.theguardian.com/crosswords/"
    const gcURL = window.location.href;
    const esccroz = crozzi.replace(/\./g,"\\.");
    const gcRE = new RegExp(esccroz+'(.*)/([0-9]+)');
    const gcmatch = gcRE.exec(gcURL);
    const series = gcmatch[1]
    const this1 = parseInt(gcmatch[2]);
    const title = document.querySelector("h1.dcr-uc7bn6");
    const cluecon0 = document.querySelector("button.dcr-hdcfwb"); // adding buttons here fails?
    cluecon0.addEventListener('click', function() {
        const chkbutstate = cluecon0.textContent;
        if ( chkbutstate === "Confirm Check All") {
            setTimeout(() => {
                chkclues(series,this1);
            }, 300);
        }
    });
})();