// ==UserScript==
// @name         よろずニュース多頁圖集載入腳本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  待在第一頁自動載入所有 gallery 分頁圖片
// @author       Comet Assistant
// @match        https://yorozoonews.jp/article/*?p=*
// @grant        GM_xmlhttpRequest
// @connect      yorozoonews.jp
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/552264/%E3%82%88%E3%82%8D%E3%81%9A%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E5%A4%9A%E9%A0%81%E5%9C%96%E9%9B%86%E8%BC%89%E5%85%A5%E8%85%B3%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/552264/%E3%82%88%E3%82%8D%E3%81%9A%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E5%A4%9A%E9%A0%81%E5%9C%96%E9%9B%86%E8%BC%89%E5%85%A5%E8%85%B3%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 取得 gallery 區塊所有分頁連結
    let gallery = document.querySelector('ul.module-article-header-photo-thumbs--gallery');
    if (!gallery) return;

    // 所有分頁連結
    let pageLinks = Array.from(gallery.querySelectorAll('a')).map(a => a.href);
    // 如果 a 標籤是相對路徑，需補全
    pageLinks = pageLinks.map(url => url.startsWith('http') ? url : (location.origin + url));

    // 包裝 Promise 批次讀圖
    Promise.all(pageLinks.map((url, idx) =>
        new Promise(resolve => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(resp) {
                    let div = document.createElement('div');
                    div.style.margin = "10px 0";
                    div.innerHTML = resp.responseText;
                    // 找出該頁大圖 IMG
                    let imgSpan = div.querySelector('span.module-article-photo__image img');
                    if (imgSpan) {
                        // 插入到本頁 gallery 下方
                        let newImg = document.createElement('img');
                        newImg.src = imgSpan.src.startsWith('//') ? 'https:' + imgSpan.src : imgSpan.src;
                        newImg.alt = `gallery-img-${idx+1}`;
                        newImg.style.maxWidth = '100%';
                        newImg.style.margin = '5px';
                        gallery.parentElement.appendChild(newImg);
                    }
                    resolve();
                }
            });
        })
    )).then(() => {
    });
})();
