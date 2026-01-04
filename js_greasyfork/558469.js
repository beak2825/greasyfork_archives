// ==UserScript==
// @name         OWOT Purpleizer
// @namespace    greasyfork.org/en/users/1213777-logan-usw
// @version      1.0.0
// @description  Turns most OWOT messages starting with '<' purple.
// @author       logan.usw
// @match        https://ourworldoftext.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ourworldoftext.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/558469/OWOT%20Purpleizer.user.js
// @updateURL https://update.greasyfork.org/scripts/558469/OWOT%20Purpleizer.meta.js
// ==/UserScript==

(() => {

function $parcel$interopDefault(a) {
  return a && a.__esModule ? a.default : a;
}
// global variable for purple text
var $041db87cc4b43330$exports = {};
$041db87cc4b43330$exports = ".message__content--purple {\n  color: #825fdb;\n}\n";


window.chatPurpleText = true;
const $957b0f1b8a4ef7fc$var$purpleTextCSS = document.createElement("style");
$957b0f1b8a4ef7fc$var$purpleTextCSS.innerHTML = (0, (/*@__PURE__*/$parcel$interopDefault($041db87cc4b43330$exports)));
document.head.appendChild($957b0f1b8a4ef7fc$var$purpleTextCSS);
const $957b0f1b8a4ef7fc$var$chatWatcher = new MutationObserver($957b0f1b8a4ef7fc$var$analyzeMsgs) // mutation observer to scan new messages
;
// analyze new chat messages
function $957b0f1b8a4ef7fc$var$analyzeMsgs(mutations) {
    mutations.forEach((message)=>{
        const msgElem = message.addedNodes[0]?.lastChild, msgContent = msgElem.textContent.trim() // message without start & end spaces
        ;
        // starts with '<' = purple text except if it's possibly a html tag or haert
        if (window.chatPurpleText && msgContent.startsWith("<") && msgContent !== "<3" && !msgContent.includes('>')) msgElem.classList.add("message__content--purple");
    });
}
// start watching page & global
$957b0f1b8a4ef7fc$var$chatWatcher.observe(elm.page_chatfield, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: false
});
$957b0f1b8a4ef7fc$var$chatWatcher.observe(elm.global_chatfield, {
    attributes: false,
    childList: true,
    characterData: false,
    subtree: false
});

})();
