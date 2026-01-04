// ==UserScript==
// @name         MANTANWEB All Photo Loader (v1.8 Auto Fix Size Error)
// @namespace    http://tampermonkey.net/
// @author       gpt5
// @version      1.8
// @description  自動載入所有圖片，size9失敗自動抓 photopage/{num} 正確size。
// @match        https://gravure.mantan-web.jp/article/*
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552260/MANTANWEB%20All%20Photo%20Loader%20%28v18%20Auto%20Fix%20Size%20Error%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552260/MANTANWEB%20All%20Photo%20Loader%20%28v18%20Auto%20Fix%20Size%20Error%29.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener('load', () => {
        const mainImg = document.querySelector('img.photo__image');
        if (!mainImg) return;

        const src = mainImg.src;
        const match = src.match(/images\/(\d{4})\/(\d{2})\/(\d{2})\/([a-zA-Z0-9]+)\/(\d+)_size\d+\.jpg/);
        if (!match) return;

        const [ , year, month, day, articleId, currentStr ] = match;
        const currentNum = parseInt(currentStr, 10);

        const photoNumText = document.querySelector('.photo__numb');
        const totalMatch = photoNumText?.textContent.match(/\/\s*(\d+)/);
        const totalImages = totalMatch ? parseInt(totalMatch[1], 10) : currentNum;

        const figure = mainImg.closest('figure');
        if (!figure) return;

        const container = document.createElement("div");
        container.className = "injected-photo-container";
        container.style.margin = "30px auto";
        container.style.maxWidth = "1134px";
        figure.insertAdjacentElement("afterend", container);

        for (let i = 1; i <= totalImages; i++) {
            if (i === currentNum) continue;
            const numStr = String(i).padStart(3, "0");
            let imgUrl = `https://storage.mantan-web.jp/images/${year}/${month}/${day}/${articleId}/${numStr}_size9.jpg`;

            const wrapper = document.createElement("div");
            wrapper.style.textAlign = "center";
            wrapper.style.margin = "10px auto";

            const img = document.createElement("img");
            img.src = imgUrl;
            img.style.display = "block";
            img.style.margin = "10px auto";
            img.style.maxWidth = "100%";

            img.onerror = () => {
                // Error: try fetch photopage/NNN.html for correct src
                fetch(`https://gravure.mantan-web.jp/article/${articleId}/photopage/${numStr}.html`)
                .then(res => res.text())
                .then(html => {
                    // 解析該頁面主圖 src
                    const tempDom = document.createElement("div");
                    tempDom.innerHTML = html;
                    const newImg = tempDom.querySelector('img.photo__image');
                    if (newImg && newImg.src && newImg.src !== img.src) {
                        img.src = newImg.src;
                    } else {
                        showError();
                    }
                }).catch(() => showError());
            };

            function showError() {
                img.remove();
                const errorMsg = document.createElement("div");
                errorMsg.textContent = `⚠️ 第 ${i} 張載入失敗`;
                errorMsg.style.color = "red";
                errorMsg.style.fontSize = "1rem";
                errorMsg.style.margin = "10px 0";
                wrapper.appendChild(errorMsg);
            }

            wrapper.appendChild(img);
            container.appendChild(wrapper);
        }
    });
})();
