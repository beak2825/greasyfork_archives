// ==UserScript==
// @name         Xiongmaogb 复制磁力链接按钮
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Add a copy button next to panel-title links on xiongmaogb.top to fetch and copy magnet links using fetch for better cookie handling, with error logging
// @author       Grok
// @match        https://xiongmaogb.top/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/560707/Xiongmaogb%20%E5%A4%8D%E5%88%B6%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/560707/Xiongmaogb%20%E5%A4%8D%E5%88%B6%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to add buttons to all matching panels
    function addCopyButtons() {
        const panels = document.querySelectorAll('.panel.panel-default.border-radius');
        panels.forEach(panel => {
            const titleElement = panel.querySelector('h3.panel-title.link');
            if (titleElement) {
                const link = titleElement.querySelector('a');
                if (link) {
                    // Create copy button
                    const copyButton = document.createElement('button');
                    copyButton.textContent = '复制磁力';
                    copyButton.style.marginLeft = '10px';
                    copyButton.style.cursor = 'pointer';

                    // Append button to the right of the title
                    titleElement.appendChild(copyButton);

                    // Add click event
                    copyButton.addEventListener('click', async () => {
                        copyButton.textContent = '复制中';
                        const detailUrl = link.href;

                        try {
                            const response = await fetch(detailUrl, {
                                method: 'GET',
                                credentials: 'include', // Include cookies
                                headers: {
                                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
                                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                                    'Accept-Language': 'en-US,en;q=0.9',
                                    'Referer': window.location.href
                                }
                            });

                            console.log('Fetch response status:', response.status);
                            console.log('Response headers:', response.headers);

                            if (response.ok) {
                                const text = await response.text();
                                console.log('Response text snippet:', text.substring(0, 500)); // Log first 500 chars

                                const parser = new DOMParser();
                                const doc = parser.parseFromString(text, 'text/html');
                                const magnetElement = doc.querySelector('#magnet');
                                if (magnetElement && magnetElement.href) {
                                    console.log('Found magnet link:', magnetElement.href);
                                    await navigator.clipboard.writeText(magnetElement.href);
                                    copyButton.textContent = '已复制';
                                    console.log('Clipboard copy successful');
                                } else {
                                    copyButton.textContent = '复制失败';
                                    console.error('Magnet element not found in parsed document');
                                    console.log('Parsed document title:', doc.title);
                                    console.log('Detail magnet panel:', doc.querySelector('#detail-magnet-panel') ? 'Found' : 'Not found');
                                }
                            } else {
                                copyButton.textContent = '复制失败';
                                console.error('Fetch failed with status:', response.status);
                            }
                        } catch (error) {
                            copyButton.textContent = '复制失败';
                            console.error('Fetch error:', error);
                        }
                    });
                }
            }
        });
    }

    // Run on page load
    window.addEventListener('load', addCopyButtons);
})();