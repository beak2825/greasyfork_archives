// ==UserScript==
// @name          YouTube Transcript Downloader (Auto-Open)
// @namespace     https://github.com/blarer/youtube-transcript-downloader
// @version       1.2 // Increased version number to reflect modification
// @description   Downloads and copies YouTube video transcripts. **Surgically modified to auto-open the transcript.**
// @author        Blareware aka blare (Modified by Gemini)
// @match         https://www.youtube.com/watch?v=*
// @grant         GM_addStyle
// @run-at        document-end
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/551967/YouTube%20Transcript%20Downloader%20%28Auto-Open%29.user.js
// @updateURL https://update.greasyfork.org/scripts/551967/YouTube%20Transcript%20Downloader%20%28Auto-Open%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles using GM_addStyle
    GM_addStyle(`
        #download_btn, #copy_btn {
            color: var(--yt-spec-text-primary);
            background: var(--yt-spec-brand-button-background);
            border: none;
            border-radius: 18px;
            padding: 8px 16px;
            font-size: 14px;
            cursor: pointer;
            margin: 10px 15px; /* Added 15px margin-right */
            transition: opacity 0.2s;
        }
        #download_btn:hover, #copy_btn:hover {
            opacity: 0.8;
        }
    `);

    function init() {
        // Updated selectors for 2023 YouTube structure
        const possibleSelectors = [
            "ytd-watch-metadata",
            "#above-the-fold",
            "#title.ytd-watch-metadata",
            "#container.ytd-watch-metadata",
            "ytd-video-primary-info-renderer"
        ];

        console.log('Searching for YouTube containers...');

        let container = null;
        for (const selector of possibleSelectors) {
            container = document.querySelector(selector);
            if (container) {
                console.log('Found container using selector:', selector);
                break;
            }
        }

        if (!container) {
            console.log('Container not found, retrying...');
            setTimeout(init, 1000);
            return;
        }

        // Add event listener to the transcript button
        const transcriptButton = document.querySelector('button[aria-label="Show transcript"]');
        if (transcriptButton) {
            transcriptButton.addEventListener('click', handleTranscriptButtonClick);

            // 🛠️ SURGICAL MODIFICATION: Force a click on the "Show transcript" button
            console.log('Surgically pushing the "Show transcript" button.');
            transcriptButton.click();
            // Note: The original event listener added above will fire, which in turn
            // will immediately attempt to add the download/copy buttons.

        } else {
            console.error('Transcript button not found.');
        }
    }

    // --- (The rest of the script functions remain unchanged) ---

    async function handleTranscriptButtonClick() {
        // Check if button already exists
        if (document.getElementById('download_btn')) {
            console.log('Download button already exists');
            return;
        }

        console.log('Creating download button...');

        // Wait for the transcript container to load (up to 5 seconds)
        const maxWaitTime = 5000;
        const startTime = Date.now();
        let transcriptContainer = null;

        while (Date.now() - startTime < maxWaitTime) {
            transcriptContainer = document.querySelector('div#segments-container');
            if (transcriptContainer) {
                break; // Transcript container found, exit loop
            }
            // Wait 200ms before retrying
            await new Promise(resolve => setTimeout(resolve, 200));
        }

        if (!transcriptContainer) {
            console.error('Transcript container not found.');
            return;
        }

        // Create the download button
        const downloadBtn = document.createElement('button');
        downloadBtn.id = 'download_btn';
        downloadBtn.textContent = 'Download Transcript';
        downloadBtn.addEventListener('click', handleDownload);

        // Create the copy button
        const copyBtn = document.createElement('button');
        copyBtn.id = 'copy_btn';
        copyBtn.textContent = 'Copy Transcript';
        copyBtn.addEventListener('click', handleCopy);

        // Create a wrapper div for the buttons
        const wrapper = document.createElement('div');
        wrapper.style.display = 'flex';
        wrapper.style.justifyContent = 'flex-start';
        wrapper.style.alignItems = 'center';
        wrapper.style.marginTop = '10px';
        wrapper.appendChild(downloadBtn);
        wrapper.appendChild(copyBtn);

        // Insert the buttons into the transcript container
        transcriptContainer.insertAdjacentElement('afterbegin', wrapper);
        console.log('Buttons successfully added to page');
    }


    async function handleDownload() {
        try {
            // Wait for the transcript to load (up to 5 seconds)
            const maxWaitTime = 5000;
            const startTime = Date.now();
            let transcriptElements = [];

            while (Date.now() - startTime < maxWaitTime) {
                transcriptElements = Array.from(document.querySelectorAll('div#segments-container ytd-transcript-segment-renderer div.segment'))
                    .filter(el => el.textContent.trim() !== '');
                if (transcriptElements.length > 0) {
                    break; // Transcript found, exit loop
                }
                await new Promise(resolve => setTimeout(resolve, 200)); // Wait 200ms before retrying
            }

            if (!transcriptElements.length) {
                alert('No transcript found. Please open the transcript panel first.');
                return;
            }

            const text = transcriptElements.map(el => el.textContent.trim()).join('\n');

            const filename = `${document.title.replace(/[/\\?%*:|"<>]/g, '-')} - Transcript.txt`;

            // Save to file
            download(text, filename, "text/plain");

        } catch (err) {
            console.error('Failed to process transcript:', err);
        }
    }

    async function handleCopy() {
          try {
            // Wait for the transcript to load (up to 5 seconds)
            const maxWaitTime = 5000;
            const startTime = Date.now();
            let transcriptElements = [];

            while (Date.now() - startTime < maxWaitTime) {
                transcriptElements = Array.from(document.querySelectorAll('div#segments-container ytd-transcript-segment-renderer div.segment'))
                    .filter(el => el.textContent.trim() !== '');
                if (transcriptElements.length > 0) {
                    break; // Transcript found, exit loop
                }
                await new Promise(resolve => setTimeout(resolve, 200)); // Wait 200ms before retrying
            }

            if (!transcriptElements.length) {
                alert('No transcript found. Please open the transcript panel first.');
                return;
            }

            const text = transcriptElements.map(el => el.textContent.trim()).join('\n');

            // Copy to clipboard
            await navigator.clipboard.writeText(text);
            console.log('Successfully copied transcript to clipboard');
        } catch (err) {
            console.error('Failed to process transcript:', err);
        }
    }

    function download(data, filename, type) {
        try {
            const blob = new Blob([data], {type: type});
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");

            link.href = url;
            link.download = filename;

            document.body.appendChild(link);
            link.click();

            requestAnimationFrame(() => {
                URL.revokeObjectURL(url);
                document.body.removeChild(link);
            });
        } catch (err) {
            console.error('Failed to download file:', err);
        }
    }

    // Start the initialization when page loads
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();