// ==UserScript==
// @name         RealSound all photo Loader
// @namespace    http://tampermonkey.net/
// @author       gpt5
// @version      1.3
// @description  RealSound photo Loader
// @match        https://realsound.jp/tech/*/photo/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550931/RealSound%20all%20photo%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/550931/RealSound%20all%20photo%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 找第一張 <img>
    let mainImg = document.querySelector('figure img');
    if (!mainImg) return;

    // 組裝完整網址
    let src = mainImg.src.startsWith('http') ? mainImg.src : location.origin + mainImg.getAttribute('src');

    // 匹配前綴-數字-後綴
    let match = src.match(/(.*-)(\d+)(\.jpg(?:\.webp)?)/);
    if (!match) return;

    let prefix = match[1];
    let num = parseInt(match[2]);
    let suffix = match[3];

    // 自動偵測總張數 從 <p class="attachment-caption-number">
    let caption = document.querySelector('.attachment-caption-number');
    let totalMatch = caption ? caption.textContent.match(/(\d+)\s*[/／]\s*(\d+)/) : null;
    let totalImages = totalMatch ? parseInt(totalMatch[2]) : num; // 例如 (1/20) 取得 20

    // 插入容器放在 <figure> 後面
    let figure = document.querySelector('figure.attachment-img');
    let container = document.createElement("div");
    container.style.marginTop = "20px";
    figure.insertAdjacentElement("afterend", container);

    // 從下一張開始載入
    for (let i = num + 1; i <= totalImages; i++) {
        let numStr = String(i).padStart(2, "0");
        let newUrl = prefix + numStr + suffix;

        let img = document.createElement("img");
        img.src = newUrl;
        img.style.display = "block";
        img.style.margin = "10px auto";
        img.style.maxWidth = "90%";

        img.onerror = () => img.remove(); // 404 時移除

        container.appendChild(img);
    }
})();
