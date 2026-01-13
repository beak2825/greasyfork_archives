// ==UserScript==
// @name         Polytech schelude style overhaul
// @namespace    http://tampermonkey.net/
// @version      2026-01-12.2
// @description  Style overhaul for polytech schelude
// @author       Panchenko_ms
// @match        https://polytech-shedule.ru/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=polytech-shedule.ru
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562352/Polytech%20schelude%20style%20overhaul.user.js
// @updateURL https://update.greasyfork.org/scripts/562352/Polytech%20schelude%20style%20overhaul.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    let controllPanel = document.getElementsByClassName("control-group")[0];
    let newButton = document.createElement("button");
    newButton.style.display = "inline-block";
    newButton.style.height = "33px";
    newButton.textContent = "Группы по цветам";
    controllPanel.appendChild(newButton);
    newButton.addEventListener('click', recolorRun);

})();

function recolorRun(){
    console.log("test");
    let groups1 = document.getElementsByClassName("groups");
    let allGroups = [];
    for(let i = 0; i < groups1.length; i++) allGroups.push(groups1[i].textContent);
    let uniqueGroups = [...new Set(allGroups)];

    let colors = ["#c4d1eb", "#c4ebd4", "#e4b892","#b8d08d", "#eaebc4", "#ebc7c4","#ebd9c4", "#daebc4", "#c4eaeb","#e1c4eb", "#daebc4", "#ebc4d8","#ebd6c4", "#2b8163", "yellow",];
    for(let j = 0; j < uniqueGroups.length; j++) {
        for(let i = 0; i < groups1.length; i++) {
            let groupCell = groups1[i]
            if(groupCell.textContent == uniqueGroups[j]){
                groupCell.style.fontWeight = "bold";
                groupCell.style.fontSize = "16px";
                groupCell.parentElement.style.backgroundColor = colors[j];
            }}
    }


    let table = document.getElementById('tabl');
    table.style.width = "1100px";

    hideElementsByClass('week-title');
    hideElementsByClass('week-separator');

    document.getElementsByClassName('schedule-table')[0].style.marginBottom = "10px";

    let allLines = document.getElementsByTagName("th");
    for(let i = 1; i < allLines.length; i++) {
        if (i!= 7){
            allLines[i].style.width = "100px";
        }
    }

    let allCells = document.getElementsByTagName("td");
    for(let i = 0; i < allCells.length; i++) {
        allCells[i].style.verticalAlign = "middle";
       allCells[i].style.padding = "4px";
    }
}
function hideElementsByClass(elemClassName){
    let allElems = document.getElementsByClassName(elemClassName);
     for(let i = 0; i < allElems.length; i++) {
         allElems[i].style.display = "none";
     }
}

