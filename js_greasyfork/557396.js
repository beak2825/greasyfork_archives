// ==UserScript==
// @name         Shoutbox Direct Image Link Viewer
// @icon         https://icons.duckduckgo.com/ip3/torrentbd.net.ico
// @namespace    foxbinner
// @version      1.1.2
// @description  Converts direct images, Tenor, Lightshot, and ibb.co.com links to inline thumbnails.
// @match        https://*.torrentbd.com/*
// @match        https://*.torrentbd.net/*
// @match        https://*.torrentbd.org/*
// @match        https://*.torrentbd.me/*
// @grant        GM_xmlhttpRequest
// @author       foxbinner
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557396/Shoutbox%20Direct%20Image%20Link%20Viewer.user.js
// @updateURL https://update.greasyfork.org/scripts/557396/Shoutbox%20Direct%20Image%20Link%20Viewer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const imageRegex = /https?:\/\/[^\s'"><]+\.(?:png|jpe?g|webp|gif)(?:\?[^\s'">]*)?(?=[^\w\-]|$)/gi;
    const tenorDirectRegex = /https?:\/\/(?:c|media)\.tenor\.com\/[^\s'"><]+/gi;
    const lightshotRegex = /https?:\/\/prnt\.sc\/[a-zA-Z0-9\-_]+/gi;
    const ibbRegex = /https?:\/\/ibb\.co\.com\/[a-zA-Z0-9\-_]+/gi;

    function resolvePageImage(url) {
        return new Promise((resolve) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                headers: { "User-Agent": "Mozilla/5.0" },
                onload: function (response) {
                    const html = response.responseText;
                    const match = html.match(/<meta[^>]+(?:name|property)=["'](?:twitter:image:src|og:image)["'][^>]+content=["']([^"']+)["']/i);
                    if (match && match[1]) {
                        resolve(match[1]);
                    } else {
                        resolve(null);
                    }
                },
                onerror: function () {
                    console.error("Page Resolve failed for", url);
                    resolve(null);
                }
            });
        });
    }

    function convertLinksInNode(node) {
        const textField = node.querySelector('.shout-text');
        if (!textField) return;

        const walker = document.createTreeWalker(textField, NodeFilter.SHOW_TEXT, null);
        const textNodes = [];
        let curr;
        while ((curr = walker.nextNode())) textNodes.push(curr);

        textNodes.forEach(textNode => {
            const text = textNode.nodeValue;

            if (!imageRegex.test(text) &&
                !tenorDirectRegex.test(text) &&
                !lightshotRegex.test(text) &&
                !ibbRegex.test(text)) return;

            const frag = document.createDocumentFragment();
            let lastIndex = 0;

            imageRegex.lastIndex = 0;
            tenorDirectRegex.lastIndex = 0;
            lightshotRegex.lastIndex = 0;
            ibbRegex.lastIndex = 0;

            while (true) {
                const mImg = imageRegex.exec(text);
                const mTen = tenorDirectRegex.exec(text);
                const mLs = lightshotRegex.exec(text);
                const mIbb = ibbRegex.exec(text);

                const matches = [
                    { type: 'img', m: mImg },
                    { type: 'tn', m: mTen },
                    { type: 'ls', m: mLs },
                    { type: 'ls', m: mIbb }
                ].filter(x => x.m).sort((a, b) => a.m.index - b.m.index);

                if (matches.length === 0) break;

                let next = matches[0];
                const m = next.m;
                const url = m[0];

                if (m.index > lastIndex) {
                    frag.appendChild(document.createTextNode(text.slice(lastIndex, m.index)));
                }

                if (next.type === 'img' && url.match(/^https?:\/\/(?:www\.)?tenor\.com\//i)) {
                    next.type = 'ls';
                }

                if (next.type === 'img' || next.type === 'tn') {
                    const img = document.createElement('img');
                    img.src = url;
                    img.dataset.fullsrc = url;
                    img.referrerPolicy = "no-referrer";
                    img.style.cssText = 'max-width:100px; max-height:100px; vertical-align:middle; display:inline; margin:0 4px; cursor:pointer; border-radius:4px;';
                    img.alt = 'image';

                    frag.appendChild(document.createTextNode(' '));
                    frag.appendChild(img);
                    frag.appendChild(document.createTextNode(' '));

                    lastIndex = m.index + url.length;
                }
                else if (next.type === 'ls') {
                    const placeholder = document.createElement('span');
                    const img = document.createElement('img');
                    img.style.cssText = 'max-width:100px; max-height:100px; vertical-align:middle; display:inline; margin:0 4px; cursor:pointer; border-radius:4px;';
                    img.alt = 'loading...';
                    img.dataset.fullsrc = url;

                    placeholder.appendChild(document.createTextNode(' '));
                    placeholder.appendChild(img);
                    placeholder.appendChild(document.createTextNode(' '));

                    resolvePageImage(url).then(realUrl => {
                        if (realUrl) {
                            img.src = realUrl;
                            img.dataset.fullsrc = realUrl;
                            img.alt = 'image';
                        } else {
                            const parent = placeholder.parentNode;
                            if (parent) parent.replaceChild(document.createTextNode(url + ' '), placeholder);
                        }
                    });

                    frag.appendChild(placeholder);
                    lastIndex = m.index + url.length;
                }

                imageRegex.lastIndex = lastIndex;
                tenorDirectRegex.lastIndex = lastIndex;
                lightshotRegex.lastIndex = lastIndex;
                ibbRegex.lastIndex = lastIndex;
            }

            if (lastIndex < text.length) {
                frag.appendChild(document.createTextNode(text.slice(lastIndex)));
            }

            textNode.parentNode.replaceChild(frag, textNode);
        });
    }

    function createOverlay(img) {
        const existing = document.querySelector('.image-overlay');
        if (existing) existing.remove();

        const overlay = document.createElement('div');
        overlay.className = 'image-overlay';
        overlay.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.9); z-index: 9999;
            display: flex; align-items: center; justify-content: center;
            cursor: pointer;
        `;

        const fullImg = document.createElement('img');
        fullImg.src = img.dataset.fullsrc || img.src;
        fullImg.referrerPolicy = "no-referrer";
        fullImg.style.cssText = `
            max-width: 90vw; max-height: 90vh;
            border-radius: 8px; box-shadow: 0 10px 30px rgba(0,0,0,0.5);
        `;

        overlay.appendChild(fullImg);
        overlay.onclick = () => overlay.remove();
        fullImg.onclick = (e) => e.stopPropagation();

        document.addEventListener('keydown', function escClose(e) {
            if (e.key === 'Escape') overlay.remove();
        }, { once: true });

        document.body.appendChild(overlay);
    }

    function addClickHandlers() {
        document.querySelectorAll('.shout-text img[data-fullsrc]').forEach(img => {
            img.onclick = (e) => {
                e.preventDefault();
                e.stopPropagation();
                createOverlay(img);
            };
            if (img.parentElement && img.parentElement.tagName === 'A') {
                img.parentElement.onclick = (e) => e.preventDefault();
            }
        });
    }

    function scanAllShouts() {
        document.querySelectorAll('.shout-item').forEach(convertLinksInNode);
        addClickHandlers();
    }

    scanAllShouts();

    const shoutContainer = document.querySelector('#shouts-container');
    if (shoutContainer) {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((m) => {
                m.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE &&
                        (node.classList?.contains('shout-item') || node.querySelector?.('.shout-item'))) {
                        const shoutItem = node.classList?.contains('shout-item') ? node : node.querySelector('.shout-item');
                        setTimeout(() => {
                            convertLinksInNode(shoutItem);
                            addClickHandlers();
                        }, 50);
                    }
                });
            });
        });
        observer.observe(shoutContainer, { childList: true, subtree: true });
    }
})();