// ==UserScript==
// @name         dy视频
// @namespace    http://tampermonkey.net/
// @version      2025-10-14
// @description  .
// @license      MIT
// @author       MagnoliaCoco
// @match        https://www.douyin.com/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552515/dy%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/552515/dy%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const css = `
    .picdl{
        position: absolute !important;
        top: 60px;
        right: 20px;
        width: 80px;
        height: 30px;
        border: 1px solid;
        border-radius: 8px;
        color: white;
        line-height: 30px;
        font-size: 20px;
        text-align: center;
        background-color: #484848;
        cursor: pointer;
    }
    `;
    const styleEl = document.createElement('style');
    styleEl.type = 'text/css';
    styleEl.textContent = css;
    const head = document.head || document.documentElement;
    if (head) {
        head.appendChild(styleEl);
    } else {
        document.documentElement.appendChild(styleEl);
    }

    let btn = document.createElement('div');
    btn.textContent = '下载';
    btn.className = 'picdl';
    btn.addEventListener('click', () => {
        fetch(document.querySelector('video').children[0].src).then(res => res.blob()).then(blob => {
            const a = document.createElement('a');
            document.body.appendChild(a)
            a.style.display = 'none'
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = document.querySelector('video').children[0].src.match(/vid=(\d+)/)[1] + '.mp4';
            a.click();
            document.body.removeChild(a)
            window.URL.revokeObjectURL(url);
        });
    })
    document.body.appendChild(btn);
})();