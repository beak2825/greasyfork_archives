// ==UserScript==
// @name         Libgen PDF Auto-Rename
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Automatically rename Libgen downloads using title and year from the metadata and show download status
// @author       Bui Quoc Dung
// @match        https://libgen.*/ads.php*
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/559305/Libgen%20PDF%20Auto-Rename.user.js
// @updateURL https://update.greasyfork.org/scripts/559305/Libgen%20PDF%20Auto-Rename.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener('click', function(e) {
        const getLink = e.target.closest('a[href^="get.php"]');

        if (getLink) {
            e.preventDefault();
            e.stopPropagation();

            const textNode = getLink.querySelector('h2') || getLink;
            const originalText = textNode.innerText;
            textNode.innerText = "Downloading...";
            getLink.style.pointerEvents = "none";


            const bibtext = document.getElementById('bibtext')?.value || "";
            let title = "document";
            let year = "";

            const titleMatch = bibtext.match(/title\s*=\s*\{(.*?)\}/);
            if (titleMatch) title = titleMatch[1].trim();

            const yearMatch = bibtext.match(/year\s*=\s*\{(?:.*?)(\d{4})\}/);
            if (yearMatch) year = yearMatch[1];

            const fileName = `${title} ${year}`.trim().replace(/[\\/:*?"<>|]/g, '_') + '.pdf';
            const downloadUrl = new URL(getLink.href, window.location.origin).href;

            GM_download({
                url: downloadUrl,
                name: fileName,
                saveAs: true,
                onload: function() {
                    textNode.innerText = originalText;
                    getLink.style.pointerEvents = "auto";
                    getLink.style.opacity = "1";
                },
                onerror: function() {
                    textNode.innerText = originalText;
                    getLink.style.pointerEvents = "auto";
                    getLink.style.opacity = "1";
                    window.location.href = downloadUrl;
                }
            });
        }
    }, true);
})();