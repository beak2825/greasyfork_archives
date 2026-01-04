// ==UserScript==
// @name         Fix Oversized playbar in Youtube Theater Mode
// @namespace    http://tampermonkey.net/
// @version      0.5
// @license MIT
// @description  Fix the big playbar if you have it.
// @author       re11ding
// @run-at       document-start
// @match        https://www.youtube.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require https://code.jquery.com/jquery-4.0.0-rc.1.js
// @downloadURL https://update.greasyfork.org/scripts/548623/Fix%20Oversized%20playbar%20in%20Youtube%20Theater%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/548623/Fix%20Oversized%20playbar%20in%20Youtube%20Theater%20Mode.meta.js
// ==/UserScript==

(function() {
    const removeImproperClasses = () => {
      $("div.ytp-hide-info-bar").removeClass("ytp-big-mode");
      $("div.ytp-popup").removeClass("ytp-big-mode");
    };

    var applyCSSStyle = function() {
        var style = document.createElement('style');
        style.setAttribute('media', 'screen');
        style.appendChild(document.createTextNode(''));
        document.head.appendChild(style);
        style.sheet.insertRule('.ytp-volume-slider-active .ytp-volume-panel {width: 72px !important;}');
    }
    var fixPlaybar = function() {
        const mutationObserver = new MutationObserver(removeImproperClasses);
        mutationObserver.observe(document, { subtree: true, childList: true });
    }
    var checkElementThenRun = function(selector, func) {
        var el = document.querySelector(selector);
        if ( el == null ) {
            if (window.requestAnimationFrame != undefined) {
                window.requestAnimationFrame(function(){ checkElementThenRun(selector, func)});
            } else {
                document.addEventListener('readystatechange', function(e) {
                    if (document.readyState == 'complete') {
                        func();
                    }
                });
            }
        } else {
            func();
        }
    }
    checkElementThenRun('head', applyCSSStyle);
    checkElementThenRun('#player', fixPlaybar);
})();