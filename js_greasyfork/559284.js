// ==UserScript==
// @name         Dizipal Video Embed Bulucu
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Sayfadaki iframe ve video kaynaklarını bulur, sağ üst köşede listeler.
// @author       Assistant
// @match        https://dizipal*.com/*
// @match        https://www.dizipal*.com/*
// @license      allah
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dizipal1516.com
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/559284/Dizipal%20Video%20Embed%20Bulucu.user.js
// @updateURL https://update.greasyfork.org/scripts/559284/Dizipal%20Video%20Embed%20Bulucu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Arayüzü oluştur
    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'embed-finder-panel';
        panel.style.position = 'fixed';
        panel.style.top = '10px';
        panel.style.right = '10px';
        panel.style.zIndex = '99999';
        panel.style.backgroundColor = '#1a1a1a';
        panel.style.color = '#fff';
        panel.style.padding = '15px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.fontSize = '12px';
        panel.style.maxWidth = '300px';
        panel.style.maxHeight = '80vh';
        panel.style.overflowY = 'auto';
        panel.style.border = '1px solid #444';

        const title = document.createElement('h3');
        title.innerText = 'Embed Bulucu';
        title.style.margin = '0 0 10px 0';
        title.style.color = '#ffcc00';
        panel.appendChild(title);

        const scanBtn = document.createElement('button');
        scanBtn.innerText = 'Videoları Tara / Yenile';
        scanBtn.style.width = '100%';
        scanBtn.style.padding = '8px';
        scanBtn.style.marginBottom = '10px';
        scanBtn.style.cursor = 'pointer';
        scanBtn.style.backgroundColor = '#28a745';
        scanBtn.style.color = 'white';
        scanBtn.style.border = 'none';
        scanBtn.style.borderRadius = '4px';

        scanBtn.onclick = scanForVideos;
        panel.appendChild(scanBtn);

        const list = document.createElement('div');
        list.id = 'embed-list';
        panel.appendChild(list);

        document.body.appendChild(panel);
    }

    // Video ve Iframe'leri tara
    function scanForVideos() {
        const listDiv = document.getElementById('embed-list');
        listDiv.innerHTML = ''; // Listeyi temizle

        // 1. Iframe'leri bul
        const iframes = document.querySelectorAll('iframe');
        let foundCount = 0;

        if (iframes.length > 0) {
            const header = document.createElement('div');
            header.innerHTML = `<strong>Iframes (${iframes.length}):</strong>`;
            header.style.marginTop = '5px';
            header.style.borderBottom = '1px solid #555';
            listDiv.appendChild(header);

            iframes.forEach((iframe, index) => {
                const src = iframe.src;
                if (src) {
                    createLinkItem(listDiv, `Embed ${index + 1}`, src);
                    foundCount++;
                }
            });
        }

        // 2. Video etiketlerini bul (varsa)
        const videos = document.querySelectorAll('video');
        if (videos.length > 0) {
            const header = document.createElement('div');
            header.innerHTML = `<strong>Direct Video Tags (${videos.length}):</strong>`;
            header.style.marginTop = '10px';
            header.style.borderBottom = '1px solid #555';
            listDiv.appendChild(header);

            videos.forEach((video, index) => {
                let src = video.src || video.currentSrc;
                // Source child element kontrolü
                if (!src) {
                    const sourceTag = video.querySelector('source');
                    if (sourceTag) src = sourceTag.src;
                }

                if (src) {
                    createLinkItem(listDiv, `Video Player ${index + 1}`, src);
                    foundCount++;
                }
            });
        }

        if (foundCount === 0) {
            listDiv.innerHTML = '<p style="color:#aaa;">Video bulunamadı. Sayfanın tamamen yüklendiğinden emin olun.</p>';
        }
    }

    // Link öğesi oluşturucu
    function createLinkItem(container, label, url) {
        const wrapper = document.createElement('div');
        wrapper.style.marginBottom = '8px';
        wrapper.style.wordBreak = 'break-all';

        const name = document.createElement('div');
        name.innerText = label;
        name.style.color = '#ccc';
        name.style.fontWeight = 'bold';
        wrapper.appendChild(name);

        const link = document.createElement('a');
        link.href = url;
        link.innerText = url;
        link.target = '_blank';
        link.style.color = '#4da3ff';
        link.style.textDecoration = 'none';
        link.style.display = 'block';
        link.style.marginBottom = '2px';
        wrapper.appendChild(link);

        // Kopyala butonu (Opsiyonel küçük metin)
        const copyBtn = document.createElement('span');
        copyBtn.innerText = '[Kopyala]';
        copyBtn.style.cursor = 'pointer';
        copyBtn.style.color = '#aaa';
        copyBtn.style.fontSize = '10px';
        copyBtn.onclick = function() {
            navigator.clipboard.writeText(url).then(() => {
                copyBtn.innerText = '[Kopyalandı!]';
                setTimeout(() => copyBtn.innerText = '[Kopyala]', 1000);
            });
        };
        wrapper.appendChild(copyBtn);

        container.appendChild(wrapper);
    }

    // Sayfa yüklendikten kısa bir süre sonra çalıştır
    window.addEventListener('load', () => {
        setTimeout(createUI, 1500); // 1.5 saniye bekle ki DOM otursun
    });

})();