// ==UserScript==
// @name         Batch Skin Downloader for NameMC
// @namespace    http://tampermonkey.net/
// @version      2025-10-18
// @description  Adds a button to the top of NameMC to batch download skins that are visible on the current page.
// @author       https://github.com/xskutsu
// @match        *://*.namemc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=namemc.com
// @grant        GM_xmlhttpRequest
// @connect      s.namemc.com
// @run-at       document-end
// @license      AGPLv3.0
// @downloadURL https://update.greasyfork.org/scripts/552969/Batch%20Skin%20Downloader%20for%20NameMC.user.js
// @updateURL https://update.greasyfork.org/scripts/552969/Batch%20Skin%20Downloader%20for%20NameMC.meta.js
// ==/UserScript==

(function() {
    "use strict";

    function disectSkinIDFromURL(url) {
        const params = new URL(url).searchParams;
        return params.get("id");
    }

    function getVisibleSkinIDs() {
        const pattern = /:\/\/s\.namemc\.com\/3d\/skin\/body\.png/i;
        const output = [];
        for (const imgElement of document.querySelectorAll("img")) {
            const src = imgElement.src;
            if (pattern.test(src)) {
                output.push(disectSkinIDFromURL(src));
            }
        }
        return output;
    }

    function getSkinImageURL(skinID) {
        return `https://s.namemc.com/i/${skinID}.png`;
    }

    async function downloadVisibleSkins() {
        const visibleSkinIDs = getVisibleSkinIDs();
        if (!confirm(`Are you sure you want to batch download ${visibleSkinIDs.length} skin(s)? This WILL spam you with download prompts, so be ready.`)) {
            return;
        }
        for (const skinID of visibleSkinIDs) {
            const blob = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: getSkinImageURL(skinID),
                    responseType: "blob",
                    onload: e => resolve(e.response)
                });
            });
            const blobUrl = URL.createObjectURL(blob);
            const linkElement = document.createElement("a");
            linkElement.href = blobUrl;
            linkElement.download = `${skinID}.png`;
            linkElement.click();
            URL.revokeObjectURL(linkElement.href);
        }
    }

    function injectButton() {
        const xpath = "//a[@href='/discord' and text()='Discord']";
        const result = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null);
        const referenceElement = result.singleNodeValue.parentElement;
        const batchDownloadElement = referenceElement.cloneNode(true);
        batchDownloadElement.children[0].textContent = "Batch Download";
        batchDownloadElement.children[0].removeAttribute("href");
        batchDownloadElement.style.backgroundColor = "#00FF0055";
        batchDownloadElement.style.cursor = "pointer";
        batchDownloadElement.addEventListener("click", function () {
            try {
                downloadVisibleSkins();
            } catch (err) {
                console.error(err);
                alert("Failed to download visible skins for batch skin downloader. Check console for more information.");
            }
        });
        referenceElement.parentElement.appendChild(batchDownloadElement);
    }

    try {
        injectButton();
    } catch (err) {
        console.error(err);
        alert("Failed to inject button for batch skin downloader. Check console for more information.");
    }
})();











