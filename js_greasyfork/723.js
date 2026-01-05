// ==UserScript==
// @name        WaniKani Stroke Order
// @namespace   japanese
// @description Shows a kanji's stroke order on its page and during lessons and reviews.
// @license     GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @include     http*://*wanikani.com/kanji/*
// @include     http*://*wanikani.com/level/*/kanji/*
// @include     http*://*wanikani.com/review/session
// @include     http*://*wanikani.com/lesson/session
// @version     1.1.2
// @grant       GM_xmlhttpRequest
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/723/WaniKani%20Stroke%20Order.user.js
// @updateURL https://update.greasyfork.org/scripts/723/WaniKani%20Stroke%20Order.meta.js
// ==/UserScript==

/*
 * Thanks a lot to ...
 * Wanikani Phonetic-Semantic Composition - Userscript
 * by ruipgpinheiro (LordGravewish)
 * ... for code showing me how to insert sections during kanji reviews.
 * The code heavily borrows from that script!
 * Also thanks to Halo for a loading bug fix!
 */

/*
 * Helper Functions/Variables
 */
$ = unsafeWindow.$;

/*
 * Global Variables/Objects/Classes
 */
var PageEnum = Object.freeze({ unknown:0, kanji:1, reviews:2, lessons:3 });
var curPage = PageEnum.unknown;
var JISHO = "http://classic.jisho.org";

/*
 * Main
 */
function init() {
    // Determine page type
    if (/\/kanji\/./.test(document.URL)) {
        curPage = PageEnum.kanji;
    } else if (/\/review/.test(document.URL)) {
        curPage = PageEnum.reviews;
    } else if (/\/lesson/.test(document.URL)) {
        curPage = PageEnum.lessons;
    }

    // Create and store the element that will hold the image
    unsafeWindow.diagram = createDiagramSection();

    // Register callback for when to load stroke order
    switch (curPage) {
        case PageEnum.kanji:
            loadDiagram();
            break;
        case PageEnum.reviews:
            var o = new MutationObserver(function(mutations) {
               // The last one always has 2 mutations, so let's use that
               if (mutations.length != 2)
                   return;

               // Reviews dynamically generate the DOM. We always need to re-insert the element
               if (getKanji() !== null) {
               setTimeout(function() {
                       var diagram = createDiagramSection();
                       if (diagram !== null && diagram.length > 0) {
                           unsafeWindow.diagram = diagram;
                           loadDiagram();
                       }
                   }, 150);
               }
            });
            o.observe(document.getElementById('item-info'), {'attributes' : true});
            break;
        case PageEnum.lessons:
            var o = new MutationObserver(loadDiagram);
            o.observe(document.getElementById('supplement-kan'), {'attributes' : true});
            loadDiagram();
            break;
    }
}

if (document.readyState === 'complete') {
    init();
} else {
    window.addEventListener('load', init);
}

/*
 * Returns the current kanji
 */
function getKanji() {
    switch(curPage) {
        case PageEnum.kanji:
            return document.title[document.title.length - 1];

        case PageEnum.reviews:
            var curItem = $.jStorage.get("currentItem");
            if("kan" in curItem)
                return curItem.kan.trim();
            else
                return null;

        case PageEnum.lessons:
            var kanjiNode = $("#character");

            if(kanjiNode === undefined || kanjiNode === null)
                return null;

            return kanjiNode.text().trim();
    }

    return null;
}

/*
 * Creates a section for the diagram and returns a pointer to its content
 */
function createDiagramSection() {

    // Reviews hack: Only do it once
    if ($('#stroke_order').length == 0) {
        var sectionHTML = '<section><h2>Stroke Order</h2><p id="stroke_order">&nbsp;</p></section>';

        switch(curPage) {
            case PageEnum.kanji:
                $(sectionHTML).insertAfter('#information');
                break;
            case PageEnum.reviews:
                console.log("prepend");
                $('#item-info-col2').prepend(sectionHTML);
                break;
            case PageEnum.lessons:
                $('#supplement-kan-breakdown .col1').append(sectionHTML);
                break;
        }
    }

    return $('#stroke_order');
}

/*
 * Adds the diagram section element to the appropriate location
 */
function loadDiagram() {

    if (!unsafeWindow || !unsafeWindow.diagram.length)
        return;

    unsafeWindow.diagram.html("Loading...");

    setTimeout(function() {
        GM_xmlhttpRequest({
            method: "GET",
            url: JISHO + "/kanji/details/" + getKanji(),
            onload: function(xhr) {
                var diagram = unsafeWindow.diagram;
                if (xhr.status == 200) {
                    if (diagramURL = xhr.responseText.match(/\/static\/images\/stroke_diagrams\/[0-9]+_frames\.png/)) {
                        diagram.html('<img src="' + JISHO + diagramURL[0] + '" alt="Stroke order diagram" />');
                        return;
                    }
                }

                unsafeWindow.diagram.html("Error while loading diagram");
            },
            onerror: function(xhr) {
                unsafeWindow.diagram.html("Error while loading diagram");
            }
        });
    }, 0);
}