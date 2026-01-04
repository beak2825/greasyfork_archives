// ==UserScript==
// @name         Mercari 直接貼上圖片以圖搜圖
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  允許在 jp.mercari.com 的指定上傳區域使用 Ctrl+V 貼上剪貼簿中的圖片
// @author       SheepText
// @match        https://jp.mercari.com/*
// @grant        none
// @run-at       document-idle
// @icon https://www.google.com/s2/favicons?domain=jp.mercari.com
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/555018/Mercari%20%E7%9B%B4%E6%8E%A5%E8%B2%BC%E4%B8%8A%E5%9C%96%E7%89%87%E4%BB%A5%E5%9C%96%E6%90%9C%E5%9C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/555018/Mercari%20%E7%9B%B4%E6%8E%A5%E8%B2%BC%E4%B8%8A%E5%9C%96%E7%89%87%E4%BB%A5%E5%9C%96%E6%90%9C%E5%9C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handlePaste(event) {
        const items = (event.clipboardData || event.originalEvent.clipboardData).items;
        let imageFile = null;

        if (!items) {
            return;
        }

        for (let i = 0; i < items.length; i++) {
            if (items[i].kind === 'file' && items[i].type.startsWith('image/')) {
                imageFile = items[i].getAsFile();
                break;
            }
        }

        if (!imageFile) {
            return;
        }

        const container = document.querySelector('[data-testid="file-input-container-for-ifl"]');

        if (!container) {
            return;
        }

        const fileInput = container.querySelector('input[type="file"]');

        if (!fileInput) {
            return;
        }

        event.preventDefault();

        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(imageFile);

        fileInput.files = dataTransfer.files;

        const changeEvent = new Event('change', {
            bubbles: true,
            cancelable: true
        });
        fileInput.dispatchEvent(changeEvent);

    }

    document.addEventListener('paste', handlePaste);
})();