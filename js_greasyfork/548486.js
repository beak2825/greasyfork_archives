// ==UserScript==
// @name         Luogu Hit
// @namespace    http://limit-bed.com
// @version      2025-09-08
// @description  Hello world!
// @author       Lim Watt
// @match        https://www.luogu.com.cn/problem/*
// @match        https://luogu.com.cn/problem/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/548486/Luogu%20Hit.user.js
// @updateURL https://update.greasyfork.org/scripts/548486/Luogu%20Hit.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 所有资源加载完成后运行的代码
    window.onload = function () {
        const pathname = window.location.pathname;
        const ProblemID = pathname.substring(pathname.lastIndexOf('/') + 1);
        const url = `https://unigravityqwq.github.io/?ask=` + ProblemID;
        
        const card = document.querySelector('.l-card');
        const svg = `<svg data-v-7c15661e="" class="svg-inline--fa fa-book" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="book" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><!--! Font Awesome Free 7.0.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free (Icons: CC BY 4.0, Fonts: SIL OFL 1.1, Code: MIT License) Copyright 2025 Fonticons, Inc. --><path fill="currentColor" d="M420.9 448C428.2 425.7 442.8 405.5 459.3 388.1C492 353.7 512 307.2 512 256C512 150 426 64 320 64C214 64 128 150 128 256C128 307.2 148 353.7 180.7 388.1C197.2 405.5 211.9 425.7 219.1 448L420.8 448zM416 496L224 496L224 512C224 556.2 259.8 592 304 592L336 592C380.2 592 416 556.2 416 512L416 496zM312 176C272.2 176 240 208.2 240 248C240 261.3 229.3 272 216 272C202.7 272 192 261.3 192 248C192 181.7 245.7 128 312 128C325.3 128 336 138.7 336 152C336 165.3 325.3 176 312 176z"></path></svg>`
        // 创建第一个子元素
        const child1 = document.createElement('br');

        // 创建第二个子元素
        const child2 = document.createElement('div');
        child2.innerHTML = `<a data-v-12b24cc3="" data-v-7c15661e="" target="_blank" href="` + url + `" disabled="false" class="">` + svg + ` 查看提示</a>`;
        // 添加到 .l-card 元素中
        card.appendChild(child1);
        card.appendChild(child2);
    };
    
})();