// ==UserScript==
// @name         YouTube Link Finder and Converter
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Finds YouTube embeds From any website, fetches their official titles, converts them to youtu.be short links, and provides an easy way to copy both.
// @author       VIDU
// @license      MIT
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/550476/YouTube%20Link%20Finder%20and%20Converter.user.js
// @updateURL https://update.greasyfork.org/scripts/550476/YouTube%20Link%20Finder%20and%20Converter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #yt-finder-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 380px; /* Increased width for more content */
            max-width: 90vw;
            max-height: 500px; /* Increased height */
            background-color: #282828;
            color: #f1f1f1;
            border: 1px solid #444;
            border-radius: 12px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.4);
            z-index: 99999;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 14px;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            transition: opacity 0.3s ease, transform 0.3s ease;
            opacity: 0;
            transform: translateY(20px);
        }
        #yt-finder-container.visible {
            opacity: 1;
            transform: translateY(0);
        }
        #yt-finder-header {
            padding: 12px 15px;
            background-color: #333;
            border-bottom: 1px solid #444;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: move;
        }
        #yt-finder-header h3 {
            margin: 0;
            font-size: 16px;
            font-weight: 600;
            display: flex;
            align-items: center;
        }
        #yt-finder-header svg {
            width: 24px;
            height: 24px;
            margin-right: 8px;
            fill: #FF0000;
        }
        #yt-finder-close-btn {
            background: none;
            border: none;
            color: #aaa;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
            line-height: 1;
            transition: color 0.2s;
        }
        #yt-finder-close-btn:hover {
            color: #fff;
        }
        #yt-finder-list {
            list-style: none;
            padding: 10px;
            margin: 0;
            overflow-y: auto;
        }
        #yt-finder-list.loading-state {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 80px;
            color: #aaa;
        }
        #yt-finder-list::-webkit-scrollbar {
            width: 8px;
        }
        #yt-finder-list::-webkit-scrollbar-track {
            background: #282828;
        }
        #yt-finder-list::-webkit-scrollbar-thumb {
            background-color: #555;
            border-radius: 4px;
            border: 2px solid #282828;
        }
        .yt-finder-item {
            display: flex;
            flex-direction: column; /* Stack title and link vertically */
            padding: 12px 5px;
            border-bottom: 1px solid #3c3c3c;
            gap: 8px; /* Space between title/link sections */
        }
        .yt-finder-item:last-child {
            border-bottom: none;
        }
        .yt-finder-title-container, .yt-finder-link-container {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
        }
        .yt-finder-title {
            font-weight: 600;
            color: #f1f1f1;
            margin-right: 8px;
            flex-grow: 1;
            word-break: break-word;
        }
        .yt-finder-link {
            flex-grow: 1;
            margin-right: 10px;
            color: #00aaff;
            word-break: break-all;
        }
        .yt-finder-icon-btn {
            background: none;
            border: none;
            cursor: pointer;
            padding: 4px;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
        }
        .yt-finder-icon-btn svg {
            width: 16px;
            height: 16px;
            fill: #aaa;
            transition: fill 0.2s, transform 0.1s ease;
        }
        .yt-finder-icon-btn:hover svg {
            fill: #fff;
        }
        .yt-finder-icon-btn:active {
             transform: scale(0.9);
        }
        .yt-finder-icon-btn.copied svg {
             fill: #4CAF50;
        }
        .yt-finder-copy-btn {
            background-color: #4CAF50;
            color: white;
            border: none;
            padding: 6px 12px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 12px;
            font-weight: bold;
            flex-shrink: 0;
            transition: background-color 0.2s ease, transform 0.1s ease;
        }
        .yt-finder-copy-btn:hover {
            background-color: #45a049;
        }
        .yt-finder-copy-btn:active {
            transform: scale(0.95);
        }
        .yt-finder-copy-btn.copied {
            background-color: #007bff;
        }
    `);

    function findYoutubeVideoIds() {
        const iframes = document.querySelectorAll('iframe');
        const videoIds = new Set();
        const youtubeRegex = /https?:\/\/(?:www\.)?(?:youtube\.com\/embed\/|youtube-nocookie\.com\/embed\/)([a-zA-Z0-9_-]{11})/;

        iframes.forEach(iframe => {
            if (iframe.src) {
                const match = iframe.src.match(youtubeRegex);
                if (match && match[1]) {
                    videoIds.add(match[1]);
                }
            }
        });

        return Array.from(videoIds);
    }

 
    function getVideoInfo(videoId) {
        return new Promise((resolve, reject) => {
            const oEmbedUrl = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;

            // We must use GM_xmlhttpRequest for cross-domain requests in a userscript.
            GM_xmlhttpRequest({
                method: "GET",
                url: oEmbedUrl,
                onload: function(response) {
                    if (response.status >= 200 && response.status < 300) {
                        try {
                            const data = JSON.parse(response.responseText);
                            resolve({
                                title: data.title || 'Title not found',
                                videoId: videoId,
                                shortUrl: `https://youtu.be/${videoId}`
                            });
                        } catch (e) {
                            reject('JSON parsing error');
                        }
                    } else {
                        reject(`Request failed with status: ${response.status}`);
                    }
                },
                onerror: function(error) {
                    console.error("Userscript: oEmbed request failed for video ID:", videoId, error);
                    reject('Request error');
                }
            });
        });
    }


    function copyToClipboard(text, buttonElement) {
        const isIconButton = buttonElement.classList.contains('yt-finder-icon-btn');

        navigator.clipboard.writeText(text).then(() => {
            if (isIconButton) {
                 buttonElement.classList.add('copied');
                 setTimeout(() => buttonElement.classList.remove('copied'), 1500);
            } else {
                const originalText = buttonElement.textContent;
                buttonElement.textContent = 'Copied!';
                buttonElement.classList.add('copied');
                setTimeout(() => {
                    buttonElement.textContent = originalText;
                    buttonElement.classList.remove('copied');
                }, 1500);
            }
        }).catch(err => {
             console.error('Userscript: Failed to copy text.', err);
             alert('Failed to copy. Please try again.');
        });
    }

   
    function makeDraggable(el, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        handle.onmousedown = e => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };
            document.onmousemove = e => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                el.style.top = `${el.offsetTop - pos2}px`;
                el.style.left = `${el.offsetLeft - pos1}px`;
                el.style.bottom = 'auto';
                el.style.right = 'auto';
            };
        };
    }

   
    function createUIPanel(videos, isLoading = false) {
        const container = document.createElement('div');
        container.id = 'yt-finder-container';

        // An SVG for the clipboard icon, embedded directly to avoid external dependencies.
        const clipboardIconSVG = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 2H8C6.89543 2 6 2.89543 6 4V18C6 19.1046 6.89543 20 8 20H16C17.1046 20 18 19.1046 18 18V4C18 2.89543 17.1046 2 16 2Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:currentColor;"></path>
                <path d="M12 22V20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:currentColor;"></path>
                <path d="M10 4.01V2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:currentColor;"></path>
                <path d="M14 4.01V2" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="fill:none;stroke:currentColor;"></path>
            </svg>`;


        const header = document.createElement('div');
        header.id = 'yt-finder-header';
        header.innerHTML = `
            <h3>
                <svg viewBox="0 0 24 24"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M9.933,15.549V8.451L15.625,12L9.933,15.549z"/></svg>
                VIDU Info Finder ${!isLoading ? `(${videos.length})` : ''}
            </h3>
        `;
        const closeButton = document.createElement('button');
        closeButton.id = 'yt-finder-close-btn';
        closeButton.innerHTML = '&times;';
        closeButton.title = 'Close';
        closeButton.onclick = () => container.remove();
        header.appendChild(closeButton);

        const list = document.createElement('ul');
        list.id = 'yt-finder-list';

        if (isLoading) {
            list.classList.add('loading-state');
            list.textContent = 'Fetching video titles...';
        } else {
            videos.forEach(video => {
                const listItem = document.createElement('li');
                listItem.className = 'yt-finder-item';

                // Title Section
                const titleContainer = document.createElement('div');
                titleContainer.className = 'yt-finder-title-container';
                const titleSpan = document.createElement('span');
                titleSpan.className = 'yt-finder-title';
                titleSpan.textContent = video.title;
                const titleCopyBtn = document.createElement('button');
                titleCopyBtn.className = 'yt-finder-icon-btn';
                titleCopyBtn.title = 'Copy Title';
                titleCopyBtn.innerHTML = clipboardIconSVG;
                titleCopyBtn.onclick = () => copyToClipboard(video.title, titleCopyBtn);
                titleContainer.appendChild(titleSpan);
                titleContainer.appendChild(titleCopyBtn);

                // Link Section
                const linkContainer = document.createElement('div');
                linkContainer.className = 'yt-finder-link-container';
                const linkSpan = document.createElement('span');
                linkSpan.className = 'yt-finder-link';
                linkSpan.textContent = video.shortUrl;
                const linkCopyBtn = document.createElement('button');
                linkCopyBtn.className = 'yt-finder-copy-btn';
                linkCopyBtn.textContent = 'Copy Link';
                linkCopyBtn.onclick = () => copyToClipboard(video.shortUrl, linkCopyBtn);
                linkContainer.appendChild(linkSpan);
                linkContainer.appendChild(linkCopyBtn);

                listItem.appendChild(titleContainer);
                listItem.appendChild(linkContainer);
                list.appendChild(listItem);
            });
        }

        container.appendChild(header);
        container.appendChild(list);
        document.body.appendChild(container);

        setTimeout(() => container.classList.add('visible'), 50);
        makeDraggable(container, header);
        return container;
    }


    window.addEventListener('load', async () => {
        const videoIds = findYoutubeVideoIds();

        if (videoIds.length > 0) {
            // Immediately show a panel in a "loading" state for better UX.
            const loadingPanel = createUIPanel([], true);

            // Create an array of promises, one for each API call.
            // We catch errors individually so that one failed request doesn't stop all others.
            const promises = videoIds.map(id => getVideoInfo(id).catch(err => {
                console.error(`Failed to fetch info for video ID ${id}:`, err);
                return null; // Return null on failure
            }));

            // Wait for all promises to settle (either resolve or reject).
            const videoData = (await Promise.all(promises)).filter(Boolean); // `filter(Boolean)` removes any nulls from failed requests.

            // Remove the temporary loading panel.
            loadingPanel.remove();

            // If we successfully got data for at least one video, show the final panel.
            if (videoData.length > 0) {
                createUIPanel(videoData, false);
            }
        } else {
            console.log('Userscript: No YouTube embeds found on this page.');
        }
    });

})();
