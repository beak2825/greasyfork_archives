// ==UserScript==
// @name         dy图文
// @namespace    http://tampermonkey.net/
// @version      2025-09-24
// @description  .
// @license      MIT
// @author       MagnoliaCoco
// @match        https://www.douyin.com/note/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyin.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550511/dy%E5%9B%BE%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/550511/dy%E5%9B%BE%E6%96%87.meta.js
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
        document.querySelectorAll('.dySwiperSlide').forEach((e) => {
            window.open(e.childNodes[1].childNodes[0].src.toString(), "_blank");
        })
    })
    document.body.appendChild(btn);
})();