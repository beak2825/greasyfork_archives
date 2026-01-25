// ==UserScript==
// @name         [Flight Rising] Sophie Auto Reduce
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically reduces items from your list.
// @author       Triggernometry base code + flight-crime modifications
// @match        https://www1.flightrising.com/trading/sophie/reduce
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/564050/%5BFlight%20Rising%5D%20Sophie%20Auto%20Reduce.user.js
// @updateURL https://update.greasyfork.org/scripts/564050/%5BFlight%20Rising%5D%20Sophie%20Auto%20Reduce.meta.js
// ==/UserScript==

// wait until page load, then run main
$(document).ready(main);

var reduceItems = {
    // For Simple Thread
    "food": ['Coral Grouse'],
    "materials": [],
    "other": [],
    // For Fine Thread
    "apparel": [],
    "familiars": []
};


// these are used across all/most functions
var toggleState = GM_getValue('toggleState', false);
var toggleDisplay = ["OFF (click to toggle)",
    "ON (click to toggle)"];

function buildGUI() {
    console.log("toggleDisplay:", toggleDisplay);
    // set up GUI box
    $('body').prepend("<div id=\"familiariliarbox\">" +
        "    <div style=\"text-align: center; color: #e8cc9f; font: bold 7.8pt/30px tahoma; background: #731d08; margin: -10px -10px 10px;\">Auto Spooling</div>" +
        // set toggle display to whatever it was before new page was loaded (or off, if page has never beeen loaded this session)
        "    <button id=\"onOffDisplay\">" + toggleDisplay[toggleState ? 1 : 0] + "</button>" +
        "</div>" +
        "<style>" +
        "    #familiariliarbox label {" +
        "        float: inherit;" +
        "    }" +
        "    #familiariliarbox {" +
        "        padding: 10px;" +
        "        border: 1px solid #000;" +
        "        position: fixed;" +
        "        top: 0;" +
        "        left: 0;" +
        "        background: #fff;" +
        "        z-index: 1002;" +
        "    }" +
        "    #turnOff," +
        "    #turnOn {" +
        "        border: 0;" +
        "        background-color: #dcd6c8;" +
        "        padding: 5px 10px;" +
        "        color: #731d08;" +
        "        margin: auto;" +
        "        box-shadow: 0 1px 3px #999;" +
        "        border-radius: 5px;" +
        "        text-shadow: 0 1px 1px #FFF;" +
        "        border-bottom: 1px solid #222;" +
        "        cursor: pointer;" +
        "        display: block;" +
        "        font: bold 11px arial;" +
        "        transition: 0.1s;" +
        "    }" +
        "    #onOffDisplay {" +
        "        border: 0;" +
        "        background-color: #dcd6c8;" +
        "        padding: 5px 10px;" +
        "        color: #731d08;" +
        "        margin: auto;" +
        "        box-shadow: 0 1px 3px #999;" +
        "        border-radius: 5px;" +
        "        text-shadow: 0 1px 1px #FFF;" +
        "        border-bottom: 1px solid #222;" +
        "        cursor: pointer;" +
        "        display: block;" +
        "        font: bold 11px arial;" +
        "        transition: 0.1s;" +
        "    }" +
        "    #turnOff:hover," +
        "    #turnOn:hover {" +
        "        background-color: #bfb9ac;" +
        "        color: #731d08;" +
        "    }" +
        "</style>"
    );

    // set the toggle click behavior
    $('#onOffDisplay').click(function () {
        toggleState = !toggleState;
        GM_setValue('toggleState', toggleState);

        if (toggleState) {
            $('#onOffDisplay').html(toggleDisplay[1]);
        }
        else {
            $('#onOffDisplay').html(toggleDisplay[0]);
        }
    });
}

async function getMatchingReduceables() {
    for (const key of Object.keys(reduceItems)) {
        let valueList = reduceItems[key];
        console.log("key:", key);
        // switch to category tab
        let chooseCategory = document.querySelector(`.item-picker-common-tabs .common-tab[data-category="${key}"]`).click();
        await sleep(2000);

        // search for item
        let input = document.querySelector(".item-picker-filter-field > input");
        let searchTerm = input.value = valueList;
        console.log("Item to search for:", searchTerm);
        input.focus();
        
        // simulate keyup event to fire search
        let keyUp = new KeyboardEvent('keyup');
        input.addEventListener("build", (e) => {
            /* … */
        });
        input.dispatchEvent(keyUp);
        await sleep(2000);

        // return item to brew
        let item = document.querySelector(`.item-picker-item-icon[data-name="${searchTerm}"]`);
        return item;

    }

    //if reached end of loop without returning, no item found
    return null;
}

async function collectItem() {
    await sleep(2000);
    let collectDoneItem = document.querySelector('button#crafter-status-claim').click();
    // wait for page to load after click
    // await collectDoneItem.DOMContentLoaded();
    await sleep(2000);
    location.reload();
}

async function reducingWait() {
    let reducingTime = document.querySelector('#crafter-timer-countdown').getAttribute('data-seconds-left');
    reducingTime = parseInt(reducingTime) + 3;
    console.log(`Now waiting for ${reducingTime} seconds. Please Stand by.`)
    await sleep(reducingTime * 1000);
    location.reload();
}

async function reduce() {
    let clickReduceButton = document.querySelector('#crafter-reduce-item');
    console.log("Click return object:", clickReduceButton);

    // wait for item load
    // if Transmute button is clicked multiple times, page breaks
    while (!document.querySelector('#ui-id-1')) {
        await sleep(2000);
        clickReduceButton.click();
        await sleep(2000);
    }

    var reduceSelection;

    if (autoMeltFood) {
        reduceSelection = await getFood(2);
    }

    if (!reduceSelection) {
        reduceSelection = await getMatchingReduceables();
    }

    // if not null, item found
    if (reduceSelection) {
        console.log("Selected food:", reduceSelection);

        reduceSelection.click();
        await sleep(2000);
        let reduceConfirm = document.querySelector('.beigebutton.thingbutton[value="Okay"]').click();
    }
    // trinketswise, reached end of items without findin a match. Exit.
    else {
        console.log("Reached end without finding a match. Nothing to reduce.");
        return 0;
    }
}

function sleep(ms) {
    console.log(`Sleebs ${ms} ms!`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

function main() {
    buildGUI();

    // only if on
    if (toggleState == true) {
        let idle = document.querySelector('#crafter-reduce-item');
        let brewing = document.querySelector('.crafter-status-action');
        let done = document.querySelector('#crafter-status-claim');

        if (done) {
            collectItem();
        } else if (brewing) {
            reducingWait();
        } else if (idle) {
            reduce();
        }
    }
}