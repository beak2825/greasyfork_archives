// ==UserScript==
// @name         Clean Catbox
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Be able to use Catbox in public without the people next to you thinking you are a gooner.
// @author       maxlikespizza
// @match        *://*.catbox.moe/*
// @match        *://catbox.moe/*
// @icon         https://catbox.moe/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558759/Clean%20Catbox.user.js
// @updateURL https://update.greasyfork.org/scripts/558759/Clean%20Catbox.meta.js
// ==/UserScript==

(function() {
    "use strict";

    // --- Knock out the javascript that initially chooses the pic ---
    const originalCreateElement = document.createElement.bind(document);

    document.createElement = function(tag) {
        const el = originalCreateElement(tag);

        if (tag.toLowerCase() === "script") {
            const realSetAttribute = el.setAttribute.bind(el);
            el.setAttribute = function(name, value) {
                if (name === "src" && value.includes("resources/pic.js")) {
                    console.warn("Gooner shit destroyed (script)");
                    return;
                }
                return realSetAttribute(name, value);
            };
        }

        return el;
    };

    //remove existing <script src="resources/pic.js"> added before this script loaded
    new MutationObserver((mut) => {
        for (const m of mut) {
            for (const node of m.addedNodes) {
                if (node.tagName === "SCRIPT" && node.src && node.src.includes("resources/pic.js")) {
                    console.warn("Gooner shit destroyed (pre-existing content");
                    node.remove();
                }

                //kill the containing image block
                if (node.nodeType === 1) {
                    if (node.matches("div.image")) {
                        console.warn("Gooner shit destroyed (img)");
                        node.remove();
                    }
                    const bad = node.querySelector("div.image");
                    if (bad) bad.remove();
                }
            }
        }
    }).observe(document.documentElement, { childList: true, subtree: true });

})();
