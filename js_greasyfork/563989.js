// ==UserScript==
// @name         V3 Slash Key for Searchbox
// @namespace    aubymori
// @version      1.0.0
// @description  Slash key to focus searchbox in V3
// @author       aubymori
// @match        https://www.youtube.com/*
// @icon         https://s.ytimg.com/yts/img/favicon_32-vflWoMFGx.png
// @license      GPL-3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/563989/V3%20Slash%20Key%20for%20Searchbox.user.js
// @updateURL https://update.greasyfork.org/scripts/563989/V3%20Slash%20Key%20for%20Searchbox.meta.js
// ==/UserScript==

window.addEventListener("keydown", function(event) {
    if (event.key == "Control" || event.key == "Shift" || event.key == "Alt")
    {
        return; // do nothing, don't wanna interrupt new tab shortcut with theater mode
    }
    else if (event.key == "/" && !inputFocused())
    {
        document.getElementById("masthead-search-term").focus();
        event.preventDefault();
    }
}, false);

function inputFocused()
{
    let el = document.activeElement;
    if (el.tagName == "INPUT") return true;
    if (el.getAttribute("contenteditable") == "true") return true;
    return false;
}