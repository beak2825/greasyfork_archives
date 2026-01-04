// ==UserScript==
// @name         FlowX – Smooth & Clean X.com
// @namespace    https://greasyfork.org/users/gh0styFPS
// @version      1.1.1
// @description  FlowX enhances X.com: start videos at custom volume and remove sponsored tweets for a cleaner, smoother browsing experience. Author: gh0styFPS
// @author       gh0styFPS
// @match        https://x.com/*
// @match        https://www.x.com/*
// @grant        none
// @run-at       document-idle
// @license      MIT
// @icon         https://abs.twimg.com/icons/apple-touch-icon-192x192.png
// @supportURL   https://greasyfork.org/users/gh0styFPS
// @downloadURL https://update.greasyfork.org/scripts/551564/FlowX%20%E2%80%93%20Smooth%20%20Clean%20Xcom.user.js
// @updateURL https://update.greasyfork.org/scripts/551564/FlowX%20%E2%80%93%20Smooth%20%20Clean%20Xcom.meta.js
// ==/UserScript==

/*
MIT License
Copyright (c) 2025 gh0styFPS
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    const hideSponsored = true;
    const STORAGE_KEY = 'flowx_volume';
    let defaultVolume = parseFloat(localStorage.getItem(STORAGE_KEY)) || 0.5;

    function removeSponsored(node) {
        try {
            const walker = document.createTreeWalker(node, NodeFilter.SHOW_ELEMENT, null);
            while (walker.nextNode()) {
                const el = walker.currentNode;
                if (el.textContent && /(promoted|sponsored|sponsrad|annonsering)/i.test(el.textContent)) {
                    const tweet = el.closest('article[role="article"], div[data-testid="tweet"]');
                    if (tweet && hideSponsored) tweet.style.display = 'none';
                }
            }
        } catch(e){}
    }

    function enhanceVideos(root=document) {
        const videos = root.querySelectorAll('video');
        videos.forEach(video => {
            try {
                video.addEventListener('play', () => {
                    video.volume = defaultVolume;
                    video.muted = false;
                });
            } catch(e){}
        });
    }

    const observer = new MutationObserver(mutations => {
        mutations.forEach(m => {
            m.addedNodes.forEach(node => {
                if (!(node instanceof Element)) return;
                removeSponsored(node);
                enhanceVideos(node);
            });
        });
    });

    observer.observe(document.body, { childList:true, subtree:true });

    removeSponsored(document);
    enhanceVideos(document);

    // --- Settings UI ---
    const btn = document.createElement('button');
    btn.textContent = '⚙️';
    Object.assign(btn.style, {
        position: 'fixed',
        top: '15px',
        right: '20px',
        background: 'rgba(29, 155, 240, 0.15)',
        color: '#E7E9EA',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '9999px',
        width: '40px',
        height: '40px',
        fontSize: '18px',
        cursor: 'pointer',
        zIndex: 99999,
        backdropFilter: 'blur(10px)',
        fontFamily: 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
    });

    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed',
        top: '65px',
        right: '20px',
        background: 'rgba(21, 24, 28, 0.95)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '12px',
        padding: '15px',
        color: '#E7E9EA',
        fontFamily: 'TwitterChirp, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        fontSize: '14px',
        width: '220px',
        display: 'none',
        zIndex: 99999,
        boxShadow: '0 4px 12px rgba(0,0,0,0.4)'
    });

    const title = document.createElement('div');
    title.textContent = 'FlowX Settings';
    title.style.fontWeight = '700';
    title.style.marginBottom = '8px';
    title.style.fontSize = '15px';

    const label = document.createElement('label');
    label.textContent = 'Default Video Volume';
    label.style.display = 'block';
    label.style.marginBottom = '5px';

    const slider = document.createElement('input');
    slider.type = 'range';
    slider.min = 0;
    slider.max = 100;
    slider.value = Math.round(defaultVolume * 100);
    slider.style.width = '100%';

    const valueText = document.createElement('div');
    valueText.textContent = `${slider.value}%`;
    valueText.style.marginTop = '6px';
    valueText.style.textAlign = 'center';
    valueText.style.opacity = '0.8';

    slider.addEventListener('input', () => {
        const vol = slider.value / 100;
        defaultVolume = vol;
        localStorage.setItem(STORAGE_KEY, vol);
        valueText.textContent = `${slider.value}%`;
        enhanceVideos(document);
    });

    panel.appendChild(title);
    panel.appendChild(label);
    panel.appendChild(slider);
    panel.appendChild(valueText);

    btn.addEventListener('click', () => {
        panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
    });

    document.body.appendChild(btn);
    document.body.appendChild(panel);
})();
