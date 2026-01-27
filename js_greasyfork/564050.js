// ==UserScript==
// @name         [Flight Rising] Sophie Auto Reduce
// @namespace    http://tampermonkey.net/
// @version      2.01
// @description  Automatically reduces items from your list.
// @author       Triggernometry base code + flight-crime modifications
// @match        https://www1.flightrising.com/trading/sophie/reduce*
// @grant        GM_setValue
// @grant        GM_getValue
// @icon         https://www.google.com/s2/favicons?domain=flightrising.com
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/564050/%5BFlight%20Rising%5D%20Sophie%20Auto%20Reduce.user.js
// @updateURL https://update.greasyfork.org/scripts/564050/%5BFlight%20Rising%5D%20Sophie%20Auto%20Reduce.meta.js
// ==/UserScript==

// wait until page load, then run main
$(document).ready(main);

/* Attention Script User!

Please add the items you'd like to reduce between the brackets below in their respective categories.
This script is CASE SENSITIVE!
Please surround the item name with ''s
Please add a comma between each item name
You may leave a category blank or only add one item

Example:
let reduceItems = {
    // For Simple Thread
    "food": ['Black Capped Chickadee', 'Fire Ant'],
    "materials": ['Broken Pottery Piece', 'Shale'],
    "other": ['Scroll Case', 'Battered Scroll Case'],
    // For Fine Thread
    "apparel": ['Porcelain Marionette Legs', 'Fanciful Casting'],
    "familiars": ['Undergrowth Shovelsnout', 'Mossy Beetleboar']
};
*/

let reduceItems = {
    // For Simple Thread
    "food": [],
    "materials": [],
    "other": [],
    // For Fine Thread
    "apparel": [],
    "familiars": []
};

// these are used across all/most functions
let toggleState = GM_getValue('toggleState', false);
let toggleDisplay = ["Entire Script: OFF",
    "Entire Script: ON"];

// toggle auto reduce food logic
let foodToggleState = GM_getValue('foodToggleState', false);
let foodToggleDisplay = ["Auto Reduce Food: OFF",
    "Auto Reduce Food: ON"];

function buildGUI() {
    console.log("toggleDisplay:", toggleDisplay);
    console.log("foodToggleDisplay:", foodToggleDisplay);
    // set up GUI box
    $('body').prepend("<div style=\"text-align: center; max-width: 170px;\" id=\"familiariliarbox\">" +
        "    <h3 style=\"color: #e8cc9f; font: bold 9pt tahoma; background: #731d08; margin: -10px -10px 10px; padding: 5px;\">Sophie Auto Reduce</h3>" +
        " <p style=\"font: 9pt tahoma; margin: 10px 0px 10px 0px;\">Click Buttons to Toggle On/Off</p>" +
        // set toggle display to whatever it was before new page was loaded (or off, if page has never beeen loaded this session)
        "    <button id=\"onOffDisplay\">" + toggleDisplay[toggleState ? 1 : 0] + "</button>" +
        " <br> " +
        "    <button id=\"onOffFoodDisplay\">" + foodToggleDisplay[foodToggleState ? 1 : 0] + "</button>" +
        "<p style=\"font: 8pt tahoma; margin: 10px 0px 10px 0px;\"><i>The auto reduce food option will select & reduce any food items that are not favorites, starting with the lowest treasure value.<i></p> " +
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
        "    #onOffDisplay, #onOffFoodDisplay {" +
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

    // set the auto reduce food toggle click behavior
    $('#onOffFoodDisplay').click(function () {
        foodToggleState = !foodToggleState;
        GM_setValue('foodToggleState', foodToggleState);

        if (foodToggleState) {
            $('#onOffFoodDisplay').html(foodToggleDisplay[1]);
        }
        else {
            $('#onOffFoodDisplay').html(foodToggleDisplay[0]);
        }
    });
}

async function getFood() {
    // switch to food category tab, if not already selected
    console.log("Swapping to food tab...");
    let chooseCategory = document.querySelector('.item-picker-common-tabs .common-tab[data-category="food"]').click();
    await sleep(2000);

    // select not favorited items
    let select = document.querySelector(".item-picker-filter-field > select[name='favorited']");
    console.log("Select Menu:", select);
    let selectOption = "0";
    select.value = selectOption;
    select.focus();
    await sleep(1000);

    // sort ascending by treasure value
    select = document.querySelector(".item-picker-filter-field > select[name='sort']");
    console.log("Select Menu:", select);
    selectOption = 'value_asc';
    select.value = selectOption;
    select.focus();
    await sleep(1000);

    // simulate keyup event to fire search
    let input = document.querySelector(".item-picker-filter-field > input");
    input.focus();
    let keyUp = new KeyboardEvent('keyup');
    input.addEventListener("build", (e) => { });
    input.dispatchEvent(keyUp);
    await sleep(2000);

    // return item to brew
    let item = document.querySelector(`.item-picker-items:first-child > .item-picker-item`);

    if (item) {
        return item;
    } else {
        return null;
    }
}

async function getMatchingReduceables() {
    for (const key of Object.keys(reduceItems)) {
        let valueList = reduceItems[key];
        console.log("key:", key);
        // switch to category tab
        let chooseCategory = document.querySelector(`.item-picker-common-tabs .common-tab[data-category="${key}"]`).click();
        await sleep(1000);

        // search for item
        let input = document.querySelector(".item-picker-filter-field > input");
        let searchTerm = input.value = valueList;

        if (searchTerm.length > 0) {
            console.log("Item to search for:", searchTerm);
            input.focus();

            // simulate keyup event to fire search
            let keyUp = new KeyboardEvent('keyup');
            input.addEventListener("build", (e) => { });
            input.dispatchEvent(keyUp);
            await sleep(1000);
        }


        // return item to brew
        let item = document.querySelector(`.item-picker-item-icon[data-name="${searchTerm}"]`);
        if (item) { return item; }
    }

    // if reached end of loop without returning, no item found
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
    // if reduce button is clicked multiple times, page breaks
    while (!document.querySelector('#ui-id-1')) {
        await sleep(2000);
        clickReduceButton.click();
        await sleep(2000);
    }

    let reduceSelection;

    if (!reduceSelection) {
        reduceSelection = await getMatchingReduceables();
    }

    if (foodToggleState) {
        reduceSelection = await getFood();
    }

    // if not null, item found
    if (reduceSelection) {
        reduceSelection.click();
        await sleep(1000);

        // check for virtual stack
        let virtualStack = document.querySelector("#item-picker-back-message");
        if (virtualStack) {
            await sleep(1000);
            console.log("Item is in a virtual stack.")
            reduceSelection = document.querySelector(".item-picker-item");
            reduceSelection.click();
        };
        await sleep(2000);
        // Final Confirmation -- Comment out for testing
        let reduceConfirm = document.querySelector('.beigebutton.thingbutton[value="Okay"]').click();
    }
    // trinketswise, reached end of items without findin a match. Exit.
    else {
        console.log("Reached end without finding a match. Nothing to reduce.");
        return 0;
    }
}

function sleep(ms) {
    console.log(`Sleep ${ms}ms`);
    return new Promise(resolve => setTimeout(resolve, ms));
}

function main() {
    buildGUI();

    // only if on
    if (toggleState == true) {
        let idle = document.querySelector('#crafter-reduce-item');
        let reducing = document.querySelector('.crafter-status-action');
        let done = document.querySelector('#crafter-status-claim');

        if (done) {
            collectItem();
        } else if (reducing) {
            reducingWait();
        } else if (idle) {
            reduce();
        }
    }
}