// ==UserScript==
// @name         Megaup's Anti_AdBlock Fucker and Autodownloader
// @namespace    http://tampermonkey.net/
// @version      1.8
// @description  deletes that stupid annoying check for ad blocks and downloads without hesitation.
// @author       Accro
// @match        https://megaup.net/*
// @match        https://download.megaup.net/*
// @grant        none
// @license      MIT
// @icon         https://raw.githubusercontent.com/Accroon/userscript-assets/main/happy.png
// @downloadURL https://update.greasyfork.org/scripts/549536/Megaup%27s%20Anti_AdBlock%20Fucker%20and%20Autodownloader.user.js
// @updateURL https://update.greasyfork.org/scripts/549536/Megaup%27s%20Anti_AdBlock%20Fucker%20and%20Autodownloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeOverlay() {
        const downloadDiv = document.querySelector('#download');
        if (!downloadDiv) return;
        const overlayImg = downloadDiv.querySelector('img');
        if (overlayImg) overlayImg.remove();
    }

    function autoDownload() {
        // Direct download link
        const directLink = document.querySelector('#afterdownload a');
        if (directLink) {
            window.location.href = directLink.href;
            return;
        }


        const downloadBtn = document.querySelector('#btndownload');
        if (downloadBtn) downloadBtn.click();


        const xpath = "/html/body/div[2]/section/div/div/div[3]/table/tbody/tr[2]/td/div[2]/a";
        const button = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        if (button) button.click();
    }

    const interval = setInterval(() => {
        removeOverlay();
        autoDownload();
    }, 1000);

    setTimeout(() => clearInterval(interval), 10000);
})();
