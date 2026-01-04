// ==UserScript==
// @name         Guardian Crossword Previous/Next
// @license      MIT
// @namespace    https://greasyfork.org/en/users/890062-garyt
// @version      2025-09-19
// @description  Add Previous and Next buttons to Guardian (Cryptic) Crosswords
// @author       GaryT
// @match        https://www.theguardian.com/crosswords/*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=theguardian.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548322/Guardian%20Crossword%20PreviousNext.user.js
// @updateURL https://update.greasyfork.org/scripts/548322/Guardian%20Crossword%20PreviousNext.meta.js
// ==/UserScript==

function styleElem(astyle) {
    const series = document.querySelector("a.dcr-a0da13");
    astyle.fontWeight="bold";
    astyle.textDecoration = "none";
    astyle.color = window.getComputedStyle(series).color;
}

function gnext(this1,series,dowk) {
    if (series=='cryptic'){
        return(dowk=='Fri')?this1+2:this1+1;
    }
    if (series=='prize'){
        return(this1+6);
    }

    return this1+1;
}

function gprev(this1,series,dowk) {
    if (series=='cryptic'){
        return(dowk=='Mon')?this1-2:this1-1; //sorry, but I love ternaries...
    }
    if (series=='prize'){
        return(this1-6);
    }
    return this1-1;
}

(function() {
    'use strict';
    console.log("GTGCPrevNext");
    const crozzi = "https://www.theguardian.com/crosswords/"
    const gcURL = window.location.href;
    const esccroz = crozzi.replace(/\./g,"\\.");
    const gcRE = new RegExp(esccroz+'(.*)/([0-9]+)');
//    console.log(gcRE);
    const gcmatch = gcRE.exec(gcURL);
    const series = gcmatch[1]
    const this1 = parseInt(gcmatch[2]);
    const title = document.querySelector("h1.dcr-uc7bn6");
    let datesp = document.querySelector("span.dcr-u0h1qy");
    if (datesp == null){
        datesp = document.querySelector("div.dcr-lp0nif");
    }
    const dmatch = /([MTWFS][a-u]{2}) (\d+ [A-Za-z]{3}) \d{4}/.exec(datesp.textContent);
    const dowk= dmatch[1];
    const doyr= dmatch[2]; //may need this for Christmas?
    const prev1=(dowk=='Mon')?this1-2:this1-1; //sorry, but I love ternaries...
    const next1=(dowk=='Fri')?this1+2:this1+1;

    let GTPrev = document.createElement('a');
    GTPrev.href = crozzi+series+'/'+(gprev(this1,series,dowk));
    GTPrev.text = "< ";
    GTPrev.title = "Previous Crossword";
    styleElem(GTPrev.style);

    let GTNext = document.createElement('a');
    GTNext.href = crozzi+series+'/'+(gnext(this1,series,dowk));
    GTNext.text = " >";
    GTNext.title = "Next Crossword";
    styleElem(GTNext.style);

    title.insertBefore(GTPrev,title.firstChild);
    title.appendChild(GTNext);
})();