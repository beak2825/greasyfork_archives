// ==UserScript==
// @name         Thingiverse Dark Mode
// @namespace    https://monkeyr.com/
// @version      v1.0.1
// @description  A simple script which converts Thingiverse to a darker theme. Modified to to use MutationObserver idea taken from https://github.com/LuckDuracell/ThingiverseDark/
// @author       mh, LuckDuracell
// @match        https://www.thingiverse.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=thingiverse.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555826/Thingiverse%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/555826/Thingiverse%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function activateBlackout(ele) {
        // Select all divs and inputs on the page
        const divs = document.querySelectorAll('div, input', ele);
        // Loop through the divs and inputs, setting the background and color properties
        for (let i = 0; i < divs.length; i++) {
            if (!(divs[i].className.includes("i-button left") || divs[i].textContent.startsWith("Report Thi"))) {
                divs[i].style.background = `rgba(1, 0, 9, ${(0.5 + (i + 1) / (divs.length))})`;
                if (divs[i].style.color === '#555') {
                    divs[i].style.color = 'white';
                }
            }
        }
    }


    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes) {
                mutation.addedNodes.forEach(activateBlackout);
            }
        });
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    const css = [
        "@namespace url(http://www.w3.org/1999/xhtml);",
        "html body {color:#243aa2;}",
        "html a {color:#2b52fe!important}",
    ].join("\n");
    if (typeof GM_addStyle != "undefined") {
        GM_addStyle(css);
    } else if (typeof PRO_addStyle != "undefined") {
        PRO_addStyle(css);
    } else if (typeof addStyle != "undefined") {
        addStyle(css);
    } else {
        var node = document.createElement("style");
        node.type = "text/css";
        node.appendChild(document.createTextNode(css));
        var heads = document.getElementsByTagName("head");
        if (heads.length > 0) {
            heads[0].appendChild(node);
        } else {
            // no head yet, stick it whereever
            document.documentElement.appendChild(node);
        }
    }

})();