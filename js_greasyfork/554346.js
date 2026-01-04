// ==UserScript==
// @name         Update Page Text to 917,000
// @namespace    https://example.com/
// @version      1.0
// @description  Updates the target span text to 917,000 on page load
// @author       You
// @match        https://*/*
// @match        http://*/*
// @locale       en
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/554346/Update%20Page%20Text%20to%20917%2C000.user.js
// @updateURL https://update.greasyfork.org/scripts/554346/Update%20Page%20Text%20to%20917%2C000.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const xpath = "/html/body/div[1]/div/div[1]/div/div[3]/main/div[1]/h1/span/span/span";

    function updateText() {
        const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (element) {
            element.textContent = "917,000";
            console.log("✅ Text updated successfully!");
        } else {
            console.warn("⚠️ Element not found for the provided XPath.");
        }
    }

    // Run immediately after load
    window.addEventListener('load', updateText);

    // Optional: also observe future changes if the element loads dynamically
    const observer = new MutationObserver(updateText);
    observer.observe(document.body, { childList: true, subtree: true });
})();
