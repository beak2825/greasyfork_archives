// ==UserScript==
// @name         通达OA显示完整链接文字
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Replaces truncated link text (...) with the full title attribute text on GUC notification pages.
// @author       AI Assistant
// @match        http://ow.guc.edu.cn:8090/general/notify/show*
// @grant        none
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550841/%E9%80%9A%E8%BE%BEOA%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E9%93%BE%E6%8E%A5%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/550841/%E9%80%9A%E8%BE%BEOA%E6%98%BE%E7%A4%BA%E5%AE%8C%E6%95%B4%E9%93%BE%E6%8E%A5%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Finds all anchor tags within the table body that have a 'title' attribute
     * and whose text content ends with an ellipsis (...).
     * Replaces the truncated text with the full title text.
     */
    function fixTruncatedLinks() {
        // Select all <a> tags that are descendants of a <td> within the table row structure,
        // which is a good target for the article titles.
        const links = document.querySelectorAll('tr > td > a[title]');

        links.forEach(link => {
            const linkText = link.textContent.trim();
            const fullTitle = link.getAttribute('title');

            // 1. Check if the link text ends with an ellipsis
            // 2. Check if the full title is different from the current text
            if (linkText.endsWith('...') && fullTitle && fullTitle !== linkText) {
                // Replace the truncated text with the full text from the title attribute
                link.textContent = fullTitle;

                // Optional: You might want to remove the <font> tag's color
                // to make the full title blend in, or keep it, depending on the desired look.
                // The provided HTML snippet shows <font color="">, which is empty,
                // but if it had a color, this would be how to remove/change it:
                // const fontTag = link.querySelector('font');
                // if (fontTag) {
                //     fontTag.removeAttribute('color');
                // }
            }
        });
    }

    // Run the function after the page has loaded
    fixTruncatedLinks();

    // Since some content might load dynamically, you could also add a short
    // delay or an observer if the initial run doesn't catch all links.
    // For most static pages, running once should be enough.

})();