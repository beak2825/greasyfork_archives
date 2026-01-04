// ==UserScript==
// @name         GeoGuessr Tips - Floating TOC
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Floats the table of contents on the left side based on a specific XPath
// @author       Gemini
// @match        https://somerandomstuff1.wordpress.com/2019/02/08/geoguessr-the-top-tips-tricks-and-techniques/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/558375/GeoGuessr%20Tips%20-%20Floating%20TOC.user.js
// @updateURL https://update.greasyfork.org/scripts/558375/GeoGuessr%20Tips%20-%20Floating%20TOC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to get an element by XPath
    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    // specific XPath provided by user
    const targetXpath = "/html/body/div[1]/div/div[1]/div/article/div/ul[1]";

    function floatTOC() {
        const tocElement = getElementByXpath(targetXpath);

        if (tocElement) {
            // Apply CSS styles to make it float on the left
            tocElement.style.position = "fixed";
            tocElement.style.left = "10px";
            tocElement.style.top = "100px"; // Distance from top of screen
            tocElement.style.width = "250px"; // Fixed width to prevent it from being too wide
            tocElement.style.maxHeight = "80vh"; // Max height to fit screen
            tocElement.style.overflowY = "auto"; // Scrollbar if the list is too long
            tocElement.style.backgroundColor = "#ffffff"; // White background to read text clearly
            tocElement.style.zIndex = "9999"; // Ensure it sits on top of other content
            tocElement.style.padding = "15px";
            tocElement.style.border = "2px solid #333";
            tocElement.style.borderRadius = "8px";
            tocElement.style.boxShadow = "0 4px 6px rgba(0,0,0,0.1)";
            tocElement.style.fontSize = "14px";
            tocElement.style.listStyleType = "none"; // Optional: removes bullet points for cleaner look

            console.log("Tampermonkey: TOC found and moved.");
        } else {
            console.log("Tampermonkey: TOC element not found at XPath: " + targetXpath);
        }
    }

    // Run the function once the page structure is ready
    window.addEventListener('load', floatTOC);

    // Fallback: Try after 2 seconds in case of dynamic loading
    setTimeout(floatTOC, 2000);

})();