// ==UserScript==
// @name         Traderie One-click Relist All
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a 'Relist All' and 'Load More' button in your Traderie profile page for easy relisting.
// @author       CherryFanta
// @match        https://traderie.com/*/profile/*/listings
// @icon         https://www.google.com/s2/favicons?sz=64&domain=traderie.com
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560168/Traderie%20One-click%20Relist%20All.user.js
// @updateURL https://update.greasyfork.org/scripts/560168/Traderie%20One-click%20Relist%20All.meta.js
// ==/UserScript==

$(document).ready(function () {

    $('body').append(`
        <div id="overlay_controls" style="
            position: fixed;
            top: 20px;
            left: 20px;
            z-index: 2147483647;
            background: rgba(0,0,0,0.7);
            padding: 10px;
            border-radius: 8px;
            display: flex;
            gap: 6px;
        ">
            <button type="button" id="relist_all" style="width:120px">Relist All</button>
            <button type="button" id="load_more" style="width:120px">Load More</button>
        </div>
    `);

    // Load More
    $(document).on('click', '#load_more', function () {
        $('button[aria-label$="Load More"]').each(function () {
            $(this).trigger('click');
        });
    });

    // Relist All
$(document).on('click', '#relist_all', function () {
    $('div.listing-action-bar > div:nth-child(4) > button').each(function (index) {
        var button = $(this);
        setTimeout(function () {
            button.trigger('click');
        }, index * 500);
    });
});
});