// ==UserScript==
// @name         Oricon All Photo Loader 
// @namespace    http://tampermonkey.net/
// @author       gpt5
// @version      3.0
// @description  Oricon Photo Loader
// @match        https://www.oricon.co.jp/news/*/photo/1/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/550930/Oricon%20All%20Photo%20Loader.user.js
// @updateURL https://update.greasyfork.org/scripts/550930/Oricon%20All%20Photo%20Loader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 解析總張數
    let captionEl = document.querySelector('.photo_caption h1');
    if (!captionEl) return;
    let match = captionEl.textContent.match(/（(\d+)\/(\d+)枚）/);
    if (!match) return;
    let total = parseInt(match[2], 10);

    // 找第一張圖片
    let firstImg = document.querySelector('.main_photo_image img');
    if (!firstImg) return;

    // 建立 gallery
    let gallery = document.createElement('div');
    gallery.id = 'all-photo-gallery';
    gallery.style.marginTop = '20px';
    gallery.style.border = '2px solid #ddd';
    gallery.style.padding = '10px';
    let mainContainer = document.querySelector('#main_photo');
    if (mainContainer) mainContainer.insertAdjacentElement('afterend', gallery);

    // 工具：建立圖片+caption block
    function createPhotoBlock(imgSrc, captionText) {
        let block = document.createElement('div');
        block.className = 'photo-block';
        block.style.marginBottom = '20px';
        block.style.paddingBottom = '15px';
        block.style.borderBottom = '1px solid #ccc';

        let img = document.createElement('img');
        img.src = imgSrc;
        img.style.maxWidth = '100%';
        img.style.display = 'block';
        img.style.margin = '0 auto 8px auto';

        let cap = document.createElement('div');
        cap.textContent = captionText;
        cap.style.fontSize = '14px';
        cap.style.textAlign = 'center';
        cap.style.color = '#444';

        block.appendChild(img);
        block.appendChild(cap);
        return block;
    }

    // Step1: 先存第一張
    let photos = [];
    photos[1] = {
        img: firstImg.src,
        caption: captionEl.textContent
    };

    // Step2: 依序 fetch 其餘圖片 (用 Shift_JIS decoder)
    let fetches = [];
    for (let i = 2; i <= total; i++) {
        let url = location.href.replace('/photo/1/', `/photo/${i}/`);
        let f = fetch(url)
            .then(res => res.arrayBuffer())
            .then(buf => {
                let decoder = new TextDecoder("shift-jis");
                let html = decoder.decode(buf);
                let parser = new DOMParser();
                let doc = parser.parseFromString(html, 'text/html');
                let imgEl = doc.querySelector('.main_photo_image img');
                let capEl = doc.querySelector('.photo_caption h1');
                if (imgEl && capEl) {
                    photos[i] = {
                        img: imgEl.src,
                        caption: capEl.textContent
                    };
                }
            }).catch(e => console.error("Load error:", e));
        fetches.push(f);
    }

    // Step3: 等全部載入完成後，依頁碼順序 append
    Promise.all(fetches).then(() => {
        for (let i = 1; i <= total; i++) {
            if (photos[i]) {
                gallery.appendChild(createPhotoBlock(photos[i].img, photos[i].caption));
            }
        }
    });
})();
