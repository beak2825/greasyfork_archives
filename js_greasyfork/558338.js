// ==UserScript==
// @name         Random Page and Gallery for exhentai
// @namespace    http://exhentai.org/
// @version      1.2
// @description  adds random page and random gallery buttons to search pages
// @author       asdaa
// @include      *://exhentai.org/*
// @include      *://g.e-hentai.org/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/558338/Random%20Page%20and%20Gallery%20for%20exhentai.user.js
// @updateURL https://update.greasyfork.org/scripts/558338/Random%20Page%20and%20Gallery%20for%20exhentai.meta.js
// ==/UserScript==

// Options:

let openGalleryOnNewTab = true;
let openPageOnNewTab = true;

//

function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
}

function openRandGal(newtab = openGalleryOnNewTab) {
    let gals = Array.from(document.getElementsByClassName('itg')[0].getElementsByTagName('a')).filter(gal => gal.href.includes('/g/'));
    // gals = gals.filter(onlyUnique);
    window.open(gals[parseInt(Math.floor(Math.random() * gals.length - 1))].href, newtab ? '_blank' : '_parent');
}


function openRandPage(newtab = openPageOnNewTab) {
    // If not at first page to first page
    if (document.getElementById("ufirst").href) {
        GM_setValue("runRandPage", true); // <-- persist for next page load
        document.getElementById("ufirst").click()
        return;
    }

    // Set jump value from 0 days to 18 years
    let r = Math.floor(Math.random() * 6570) + 1;
    let randpage = document.getElementById("unext").href + "&jump=" + r + "d";

    // Open random page and go to a random gallery on that tab
    GM_setValue("runRandGal", true); // <-- persist for new tab load
    window.open(randpage, newtab ? '_blank' : '_parent');
}

(function(){
    let isFavorites = location.href.indexOf('favorites') > 0;
    let place, style;

    let template = s => `
<div id="randomStuff" style="${s}">
  <a id="randGalLink" href="#">Random Gallery</a> &nbsp;&nbsp;
  <a id="randPageLink" href="#">Random Page</a>
</div>`;

    if (isFavorites) {
        // ------- Favorites page -------
        place = document.getElementsByClassName("fp fps");
        place = place[0];
        style = "text-align: center; margin-top: 10px;";
        place.insertAdjacentHTML("afterend", template(style));
    } else {
        // ------- Main page -------
        place = document.querySelector('[onclick*="toggle_advsearch_pane"]');
        place = place.parentElement;
        style = "margin-top: 3px;";
        place.insertAdjacentHTML("beforeend", template(style));
    }

    var myLink = document.getElementById("randGalLink");
    myLink.addEventListener("click", openRandGal, true);
    myLink.addEventListener("auxclick", e => {
        if (e.button === 1) { // 1 = middle mouse button
            e.preventDefault(); // prevent default new-tab behavior
            openRandGal();
        }
    }, true);
    
    var myPageLink = document.getElementById("randPageLink");
    myPageLink.addEventListener("click", openRandPage, true);
    myPageLink.addEventListener("auxclick", e => {
        if (e.button === 1) { // 1 = middle mouse button
            e.preventDefault(); // prevent default new-tab behavior
            openRandPage();
        }
    }, true);



    if (GM_getValue("runRandGal")) {
        GM_setValue("runRandGal", false);
        openRandGal(false);
    }
    if (GM_getValue("runRandPage")) {
        GM_setValue("runRandPage", false);
        openRandPage();
    }
})();