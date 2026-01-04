// ==UserScript==
// @name         Scryfall MTGPics links
// @namespace    https://scryfall.com
// @version      1
// @description  Adds MTGPics links to Scryfall pages
// @author       NotOnLand
// @match        *://*scryfall.com/card/*
// @match        *://*scryfall.com/search?q=*
// @grant        none
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=scryfall.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548673/Scryfall%20MTGPics%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/548673/Scryfall%20MTGPics%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

	  //var cardScry = window.location.pathname.split('/');
    //div.prints > table.prints-table tr.current > td:first-child > a.href
    var currentLink = '/card/ugl/27/sorry';
    if(document.querySelector("div.prints > table.prints-table tr.current > td:first-child > a")) {
      currentLink = document.querySelector("div.prints > table.prints-table tr.current > td:first-child > a").pathname;
    }
    console.log(currentLink);
    var cardScry = currentLink.split('/');

    switch (cardScry[2].toUpperCase()) {
      case "4ED":
        cardScry[2] = "4th";
        break;
      case "5ED":
        cardScry[2] = "5th";
        break;
      case "6ED":
        cardScry[2] = "6th";
        break;
      case "7ED":
        cardScry[2] = "7th";
        break;
      case "8ED":
        cardScry[2] = "8th";
        break;
      case "9ED":
        cardScry[2] = "9th";
        break;
      case "10E":
        cardScry[2] = "xth";
        break;
      case "M10":
        cardScry[2] = "10m";
        break;
      case "M11":
        cardScry[2] = "11m";
        break;
      case "M12":
        cardScry[2] = "12m";
        break;
      case "M13":
        cardScry[2] = "13m";
        break;
      case "M14":
        cardScry[2] = "14m";
        break;
      case "M15":
        cardScry[2] = "15m";
        break;
      case "M19":
        cardScry[2] = "19m";
        break;
    }

    if(cardScry[3].length < 3) cardScry[3] = "0" + cardScry[3];
    if(cardScry[3].length < 3) cardScry[3] = "0" + cardScry[3];

    var cardPics = 'https://www.mtgpics.com/card?ref=' + cardScry[2] + cardScry[3];
    console.log(cardPics);
    var li = document.createElement("li");
    li.id = "card-link";
    var aLink = document.createElement("a");
    aLink.classList += 'button-n';
    aLink.href = cardPics;
    aLink.id = "mtgpics-link";
    aLink.target = "_blank";
    aLink.innerHTML = '<svg focusable="false" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 30 30"><path d="M1 4v22h28v-22h-28zm26 20h-24v-18h24v18zm-9-14l-5 6-2-2-6 8h20l-7-12zm-6.784 7.045l1.918 1.918 4.576-5.491 3.808 6.528h-12.518l2.216-2.955zm-4.216-5.045c1.104 0 2-.896 2-2s-.896-2-2-2-2 .896-2 2 .896 2 2 2z"></path></svg>';
    var linkText = document.createElement("b");
    linkText.innerHTML = "Open on MTGPics";

    if(document.getElementsByClassName("toolbox-links")[0]){
        document.getElementsByClassName("toolbox-links")[0].appendChild(li);
        document.getElementById("card-link").appendChild(aLink);
        document.getElementById("mtgpics-link").appendChild(linkText);
    }
})();