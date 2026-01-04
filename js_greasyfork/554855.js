// ==UserScript==
// @name         Upload Audio for VinylAndParticles
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  upload your own song
// @author       Dax
// @match        https://mgz.me/scenes/VinylAndParticles*
// @match        https://mgz.me/scenes*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554855/Upload%20Audio%20for%20VinylAndParticles.user.js
// @updateURL https://update.greasyfork.org/scripts/554855/Upload%20Audio%20for%20VinylAndParticles.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let customAudioURL = null;

    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        let url = args[0];

        if (typeof url !== 'string') {
            url = args[0].url || args[0].toString();
        }

        if ((url.includes('.mp3') || url.includes('audio')) && customAudioURL) {
            args[0] = customAudioURL;
        }

        return originalFetch.apply(this, args);
    };

    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: rgba(20, 20, 20, 0.9);
        padding: 15px;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        z-index: 10000;
        font-family: Arial, sans-serif;
        color: #fff;
    `;

    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'audio/*';
    fileInput.style.display = 'none';

    const uploadButton = document.createElement('button');
    uploadButton.textContent = 'upload';
    uploadButton.style.cssText = `
        background: #333333;
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 13px;
    `;

    const statusText = document.createElement('div');
    statusText.style.cssText = `
        margin-top: 8px;
        font-size: 11px;
        color: #aaa;
    `;
    statusText.textContent = 'no song';

    uploadButton.onclick = () => fileInput.click();

    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            statusText.textContent = 'loading';

            const reader = new FileReader();
            reader.onload = (event) => {
                customAudioURL = event.target.result;
                statusText.textContent = file.name;
                statusText.style.color = '#4ade80';
            };
            reader.readAsDataURL(file);
        }
    };

    overlay.appendChild(uploadButton);
    overlay.appendChild(fileInput);
    overlay.appendChild(statusText);

    document.body.appendChild(overlay);
})();