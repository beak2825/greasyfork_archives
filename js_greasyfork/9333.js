// ==UserScript==
// @name        LiveLeak CometChat Disable
// @description Disables the CometChat feature.
// @version     1.0
// @namespace   Dimethyl
// @include     *://www.liveleak.com/*
// @grant       none
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/9333/LiveLeak%20CometChat%20Disable.user.js
// @updateURL https://update.greasyfork.org/scripts/9333/LiveLeak%20CometChat%20Disable.meta.js
// ==/UserScript==

function onBeforeScriptExecute(e) {
    var script = e.target;
    var scriptParent = script.parentNode;
    if (/chat\.liveleak\.com\/cchat/.test(script.textContent)) {
        e.stopPropagation();
        e.preventDefault();
        scriptParent.removeChild(script);
    }
}

document.addEventListener('beforescriptexecute', onBeforeScriptExecute, true);