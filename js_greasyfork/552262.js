// ==UserScript==
// @name         ENTAME next Gallery 全文多頁合併圖片載入穩定版
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  合併所有分頁圖片到首頁，只插入第二張以後，不重複首頁原圖，支援所有 https://entamenext.com/articles/gallery/{id}/1
// @author       AI
// @match        https://entamenext.com/articles/gallery/*/1
// @grant        GM_xmlhttpRequest
// @connect      entamenext.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552262/ENTAME%20next%20Gallery%20%E5%85%A8%E6%96%87%E5%A4%9A%E9%A0%81%E5%90%88%E4%BD%B5%E5%9C%96%E7%89%87%E8%BC%89%E5%85%A5%E7%A9%A9%E5%AE%9A%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/552262/ENTAME%20next%20Gallery%20%E5%85%A8%E6%96%87%E5%A4%9A%E9%A0%81%E5%90%88%E4%BD%B5%E5%9C%96%E7%89%87%E8%BC%89%E5%85%A5%E7%A9%A9%E5%AE%9A%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 取得分頁URL陣列
    function getGalleryPageUrls() {
        return Array.from(document.querySelectorAll('.articleGalleryList ul li a')).map(a => a.href);
    }

    // 解析分頁圖片資訊
    function extractImageInfo(htmlText) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');
        // 不直接用 class，兼容 lightbox_41268 或其他變化
        const imgAnchor = doc.querySelector('.articleGalleryImg a');
        if (!imgAnchor) return null;
        const previewDiv = imgAnchor.querySelector('.img');
        const imgUrl = imgAnchor.getAttribute('href');
        let previewUrl = previewDiv ? previewDiv.style.backgroundImage : '';
        if (previewUrl && previewUrl.indexOf('url(') === 0) {
            previewUrl = previewUrl.replace(/^url\(["']?/, '').replace(/["']?\)$/, '');
        } else {
            previewUrl = imgUrl;
        }
        return imgUrl ? { imgUrl, previewUrl } : null;
    }

    // 插入圖片
    function insertImageBlock(imageInfo) {
        if (!imageInfo || !imageInfo.imgUrl) return;
        const block = document.createElement('div');
        block.className = "articleGalleryImg";
        block.innerHTML = `
            <a class="zoom-in" href="${imageInfo.imgUrl}" style="display: block;">
                <div class="img" style="background-image: url('${imageInfo.previewUrl}');"></div>
            </a>
            <meta itemprop="url" content="${imageInfo.imgUrl}">
            <p class="meta"></p>
        `;
        // 插在所有 .articleGalleryImg 區塊最後
        const allImgs = document.querySelectorAll('.articleGalleryImg');
        const lastImg = allImgs[allImgs.length - 1];
        if (lastImg) {
            lastImg.parentNode.insertBefore(block, lastImg.nextSibling);
        }
    }

    // 主流程（只載入第二張起）
    function loadAllGalleryImages() {
        const urls = getGalleryPageUrls();
        if (urls.length <= 1) return; // 只一張直接跳過
        const otherUrls = urls.slice(1); // 從第二個開始
        otherUrls.forEach(url => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function (response) {
                    const imgInfo = extractImageInfo(response.responseText);
                    if (imgInfo) insertImageBlock(imgInfo);
                }
            });
        });
    }

    // 保證 DOM 載入時執行
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', loadAllGalleryImages);
    } else {
        loadAllGalleryImages();
    }
})();
