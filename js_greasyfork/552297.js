// ==UserScript==
// @name         SS13 Idle Extensions
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      2025-10-11
// @description  Utilities for SS13IDLE
// @author       DeCell
// @match        https://spacestationidle.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=spacestationidle.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/552297/SS13%20Idle%20Extensions.user.js
// @updateURL https://update.greasyfork.org/scripts/552297/SS13%20Idle%20Extensions.meta.js
// ==/UserScript==
'use strict';


const temporarySettings = {
    autoBossFight: false,
    bossFightInterval: null
}; // stuff that arent being saved between refreshes


const $autoBossFight = $('<button>', {
    text: 'Not Auto Fighting Bosses Now',
    class: 'btn btn-success',
});


$autoBossFight.on("click", () => {
    temporarySettings.autoBossFight = !temporarySettings.autoBossFight;
    const checked = temporarySettings.autoBossFight;

    $autoBossFight.toggleClass("btn-success btn-danger");

    if (checked) {
        $autoBossFight.text('Auto Fighting Bosses Now');
        temporarySettings.bossFightInterval = setInterval(() => {
            // get the element that haves the click trigger for the next boss fight and click it
            $('h6:contains("FIGHT ANOTHER BOSS")').first()
                .parent()
                .children().eq(1)
                .children().first()
                .trigger("click");
        }, 500);
    }
    else {
        $autoBossFight.text('Not Auto Fighting Bosses Now');
        if (temporarySettings.bossFightInterval) {
            clearInterval(temporarySettings.bossFightInterval);
            temporarySettings.bossFightInterval = null;
        }
    }
});

(function () {


    function updateVisibility() {
        const activeTab = getActiveTabString();
        if (activeTab === 'Combat') {
            $putElementToHeader($autoBossFight)
        }
    }

    updateVisibility();
    const observer = new MutationObserver(() => {
        updateVisibility();
    });

    const appContainer = document.body;
    observer.observe(appContainer, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });
})();


function getActiveTabString() {
    const $header = $('.content-header');
    if ($header.length) {
        const $span = $header.find('span');
        return $span.length ? $span.text().trim() : null;
    }
    return null;
}

function $getHeaderElement() {
    return $('.content-header');
}

function $putElementToHeader($element) {
    const $header = $getHeaderElement();
    if ($header && $header.length && !$element.parent().is($header)) {
        $header.append($element); // need to add it back when switching tabs cuz the whole page gets rebuilt between pages
    }
}