// ==UserScript==
// @name         SampleFocus Downloader [fixed lol]
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  original samplefocus downloader some devs are lazy so i made my own
// @author       CSI JML
// @match        https://samplefocus.com/samples/*
// @grant        GM_download
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/559975/SampleFocus%20Downloader%20%5Bfixed%20lol%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/559975/SampleFocus%20Downloader%20%5Bfixed%20lol%5D.meta.js
// ==/UserScript==

// i formatted it nicely so anyone who is suspicious of this script can read it easily :p

(function() {
    'use strict';

    function injectDownloadButton() {
        const heroSection = document.querySelector('.section.sample-hero');
        if (!heroSection) return;

        const originalBtnContainer = document.querySelector('.css-116gh75');
        if (!originalBtnContainer || document.getElementById('quick-mp3-download')) return;

        let mp3Url = "";

        const scripts = document.querySelectorAll('script');
        for (let s of scripts) {
            const match = s.textContent.match(/"sample_mp3_url":"(https:\/\/[^"]+)"/);
            if (match) {
                mp3Url = match[1].replace(/\\u0026/g, '&');
                break;
            }
        }

        if (mp3Url) {
            const urlPath = mp3Url.split('?')[0];
            const fileName = urlPath.substring(urlPath.lastIndexOf('/') + 1);
            const newBtn = document.createElement('a');
            newBtn.id = 'quick-mp3-download';
            newBtn.className = "MuiButtonBase-root MuiButton-root MuiButton-contained MuiButton-containedPrimary";
            newBtn.innerHTML = `<i class="fas fa-file-audio"></i> Download MP3`;
            newBtn.style.backgroundColor = "#4caf50"; // Green color
            newBtn.style.color = "white";
            newBtn.style.padding = "8px 16px";
            newBtn.style.borderRadius = "4px";
            newBtn.style.textDecoration = "none";
            newBtn.style.display = "flex";
            newBtn.style.alignItems = "center";
            newBtn.style.justifyContent = "center";
            newBtn.style.cursor = "pointer";
            newBtn.style.fontWeight = "bold";
            newBtn.style.fontSize = "16px";
            newBtn.style.flexDirection = "column";
            newBtn.title = "nothing here ig";

            newBtn.onclick = (e) => {
                e.preventDefault();
                GM_download({
                    url: mp3Url,
                    name: fileName,
                    saveAs: true
                });
            };

            originalBtnContainer.appendChild(newBtn);
        }
    }
    const observer = new MutationObserver(() => injectDownloadButton());
    observer.observe(document.body, { childList: true, subtree: true });
    injectDownloadButton();

})();