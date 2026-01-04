// ==UserScript==
// @name         Cambridge Dictionary Audio Downloader
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Automatically downloads audio from Cambridge Dictionary when you click the play button.
// @author       gemini&mp
// @match        https://dictionary.cambridge.org/*
// @grant        GM_download
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549233/Cambridge%20Dictionary%20Audio%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/549233/Cambridge%20Dictionary%20Audio%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 存储已经下载过的音频URL，防止重复下载
    const downloadedUrls = new Set();

    // Function to find the title of the entry
    function getEntryTitle() {
        let title = document.querySelector('.di-title');
        if (title) {
            return title.textContent.trim().replace(/\s+/g, '_');
        }
        return 'audio'; // fallback title
    }

    // Function to handle the click event
    function handleClick(event) {
        const audioWrapper = event.target.closest('.dico-sound, .daud');
        if (audioWrapper) {
            const audioSource = audioWrapper.querySelector('source');
            if (audioSource) {
                const audioUrl = audioSource.src;

                // 检查这个URL是否已经下载过
                if (downloadedUrls.has(audioUrl)) {
                    console.log('Audio already downloaded, skipping.');
                    return; // 如果已经下载过，则直接返回
                }

                const entryTitle = getEntryTitle();
                const filename = `${entryTitle}_cambridgedic.mp3`;

                // 使用 GM_download 下载文件
                GM_download({
                    url: audioUrl,
                    name: filename,
                    saveAs: true,
                    onload: function() {
                        console.log(`Successfully downloaded: ${filename}`);
                        // 下载成功后，将URL添加到已下载的集合中
                        downloadedUrls.add(audioUrl);
                    },
                    onerror: function(error) {
                        console.error('Download failed:', error);
                    }
                });
            }
        }
    }

    // Add a global click listener
    document.addEventListener('click', handleClick);
})();