// ==UserScript==
// @name         Google Drive Auto Download & Close
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically download Google Drive files and close tabs
// @author       dil83
// @license      MIT
// @match        https://drive.google.com/file/d/*/view*
// @match        https://drive.google.com/file/d/*/preview*
// @match        https://drive.usercontent.google.com/download*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=google.com
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/556811/Google%20Drive%20Auto%20Download%20%20Close.user.js
// @updateURL https://update.greasyfork.org/scripts/556811/Google%20Drive%20Auto%20Download%20%20Close.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const currentUrl = window.location.href;
    if (currentUrl.includes('drive.google.com/file/d/')) {
        handleDriveViewPage();
    }
    else if (currentUrl.includes('drive.usercontent.google.com/download')) {
        handleDownloadPage();
    }
    function handleDriveViewPage() {
        const match = currentUrl.match(/\/file\/d\/([^\/]+)/);
        if (!match) {
            console.log('Could not extract file ID');
            return;
        }
        const fileId = match[1];
        const downloadUrl = `https://drive.usercontent.google.com/download?id=${fileId}&export=download&authuser=0`;

        console.log('Redirecting to download URL:', downloadUrl);
        window.location.href = downloadUrl;
    }

    function handleDownloadPage() {
        console.log('On download page, looking for download button or form...');
        setTimeout(() => {
            const downloadForm = document.getElementById('download-form');
            if (downloadForm) {
                console.log('Found download form, submitting...');
                downloadForm.submit();
                setTimeout(() => {
                    console.log('Closing tab...');
                    window.close();
                }, 1500);
                return;
            }
            const downloadButton = document.getElementById('uc-download-link');
            if (downloadButton) {
                console.log('Found download button, clicking...');
                downloadButton.click();

                setTimeout(() => {
                    console.log('Closing tab...');
                    window.close();
                }, 1500);
                return;
            }
            const buttons = document.querySelectorAll('button, input[type="submit"], a');
            for (const button of buttons) {
                const text = button.textContent || button.value || '';
                if (text.toLowerCase().includes('download')) {
                    console.log('Found download element, clicking...');
                    button.click();

                    setTimeout(() => {
                        console.log('Closing tab...');
                        window.close();
                    }, 1500);
                    return;
                }
            }
            console.log('No download button found, checking if download started...');
            setTimeout(() => {
                console.log('Closing tab...');
                window.close();
            }, 2000);

        }, 1000);
    }
})();