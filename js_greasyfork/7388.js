// ==UserScript==
// @name         PoE Trade - add whisper button
// @namespace    Ohad83
// @version      0.1
// @description  Adds a whisper button to poe.trade searches which pops up a whisper text to copy.
//               If you sort the items, the button will disappear. No worries - just press the "Add" button near the theme buttons.
// @author       Ohad83
// @match        http://poe.trade/search/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/7388/PoE%20Trade%20-%20add%20whisper%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/7388/PoE%20Trade%20-%20add%20whisper%20button.meta.js
// ==/UserScript==

function alreadyAddedButtons() {
    var first_item = document.getElementsByClassName("item")[0];
    var bottom_row = first_item.getElementsByClassName("bottom-row")[0];
    var bottom_row_text = bottom_row.textContent;
    if (bottom_row_text.indexOf("Whisper") == -1) {
        return false;
    }
    return true;
}

function addWhispers() {
    if (alreadyAddedButtons()) {
        return;
    }
    var items = document.getElementsByClassName("item");
    for (var i = 0; i < items.length; i++) {
        var current_item = items[i];
        var item_cell = current_item.getElementsByClassName("item-cell")[0];
        var item_name = item_cell.getElementsByTagName("h5")[0].textContent.trim();
        var buyout = current_item.getAttribute("data-buyout");
        var bottom_row = current_item.getElementsByClassName("bottom-row")[0];
        var bottom_row_text = bottom_row.textContent.split("·");
        var ign = '';
        for (var j = 0; j < bottom_row_text.length; j++) {
            if (bottom_row_text[j].indexOf("IGN:") != -1) {
                ign = bottom_row_text[j].substring(bottom_row_text[j].indexOf("IGN:") + 4).trim();
                break;
            }
        }
        
        var place_to_add_button = bottom_row.getElementsByClassName("requirements")[0];
        var button_to_add = document.createElement("a");
        button_to_add.setAttribute("href", "#");
        button_to_add.setAttribute("whisper", "@" + ign + " Hello, I would like to buy your " + item_name + " for " + buyout);
        button_to_add.setAttribute("onclick", "window.prompt(\"Copy to clipboard: Ctrl + C\", this.getAttribute(\"whisper\")); return false;");
        button_to_add.text = " · Whisper";
        place_to_add_button.appendChild(button_to_add);
    }
}

function mainWhisper() {
    var protip = document.getElementsByClassName('protip')[0];
    var init_span = document.createElement("span");
    init_span.setAttribute("class", "right");
    init_span.setAttribute("style", "margin-right:0.5em");
    init_span.textContent = "Whisper button: ";
    var init_link = document.createElement("a");
    init_link.setAttribute("href", "#");
    init_link.addEventListener("click", addWhispers, false);
    init_link.textContent = "Add";
    init_span.appendChild(init_link);
    protip.appendChild(init_span);
    addWhispers();
}
mainWhisper();