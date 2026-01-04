// ==UserScript==
// @name         KH Tagsets Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a download button to the KH Tagsets page to easily back up your tag data as a JSON file.
// @author       Gemini
// @match        https://k-hentai.org/tagsets
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552352/KH%20Tagsets%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/552352/KH%20Tagsets%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 태그셋 다운로드 기능
    const downloadTagsets = () => {
        const jsonData = JSON.stringify(tagsets, null, 2);
        const blob = new Blob([jsonData], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Tagsets.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    // 태그셋 다운로드 버튼 생성 기능
    const createTagsetsDownloadButton = () => {
        const saveButton = document.createElement('button');
        saveButton.textContent = '태그셋 저장';
        Object.assign(saveButton.style, {
            backgroundColor: '#4CAF50',
            border: 'none',
            color: 'white',
            padding: '6px 12px',
            textAlign: 'center',
            textDecoration: 'none',
            display: 'inline-block',
            fontSize: '16px',
            cursor: 'pointer',
            borderRadius: '5px',
        });
        saveButton.addEventListener('click', downloadTagsets);

        const createButton = document.getElementById('khTagsetsCreateButton');
        if (createButton && createButton.parentElement) {
            createButton.parentElement.insertBefore(saveButton, createButton.nextSibling);
        }
    };

    createTagsetsDownloadButton();
})();