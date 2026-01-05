// ==UserScript==
// @name          Chrome - No Google Translate Popup
// @version       0.2a
// @namespace     pk.qwerty12
// @description   Remove the original text popup when using Chrome's built in translation feature
// @include       http*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/7232/Chrome%20-%20No%20Google%20Translate%20Popup.user.js
// @updateURL https://update.greasyfork.org/scripts/7232/Chrome%20-%20No%20Google%20Translate%20Popup.meta.js
// ==/UserScript==

function injectCSS() {
    // CSS taken from OBender: http://stackoverflow.com/a/8531408
    const css = ".goog-tooltip {  display: none !important;  } .goog-tooltip:hover { display: none !important; } .goog-text-highlight { background-color: transparent !important; border: none !important; box-shadow: none !important; }";
    GM_addStyle(css);
}

var observer = new MutationObserver(function(mutations) {
  mutations.forEach(function(mutation) {
    for (var i = 0; i < mutation.addedNodes.length; ++i) {
        if (mutation.addedNodes[i].nodeType == 1 && mutation.addedNodes[i].id === "goog-gt-tt") {
            injectCSS();
            break;
        }
    }
  });
});
setTimeout(function() {
    observer.observe(document.body, {
        childList: true
    })
}, 100);