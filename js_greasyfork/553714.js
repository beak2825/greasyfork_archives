// ==UserScript==
// @name         ClickMe Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  偵測 Click Me 中的 iframe 並複製 src 至剪貼簿
// @license MIT
// @author       scbmark
// @icon         https://r18.clickme.net/favicon_r18.ico
// @match        https://r18.clickme.net/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/553714/ClickMe%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/553714/ClickMe%20Enhancer.meta.js
// ==/UserScript==


(function () {
    'use strict';

    function collectIframeSrcs() {
        const iframes = document.querySelectorAll('iframe');
        const srcList = [];
        iframes.forEach((iframe) => {
            if (iframe.src) {
                srcList.push(iframe.src);
            }
        });
        return srcList;
    }

    function jumpToLink() {
        for (let a of document.querySelectorAll("span")) {
            if (a.textContent.includes("按此前往") || a.textContent.includes("傳送門")) {
                window.open(a.nextSibling.href)
                break
            }
        }
    }


    function createCopyButton() {
        const title = document.getElementsByTagName('h1')[0].textContent;
        const button = document.createElement('button');
        button.textContent = '複製所有 iframe src';
        Object.assign(button.style, {
            position: 'fixed',
            top: '10px',
            right: '10px',
            zIndex: 9999,
            padding: '8px 12px',
            backgroundColor: '#28a745',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        });

        button.addEventListener('click', () => {
            const srcList = collectIframeSrcs();
            if (srcList.length === 0) {
                button.textContent = '⚠️ 沒有找到 iframe';
                jumpToLink();
            } else {
                let commands = [];
                srcList.forEach((src, index) => {
                    commands.push(`yt-dlp --output "${title}-${index}.mp4" "${src}"`)
                })
                const allSrcs = commands.join('\n');
                GM_setClipboard(allSrcs, 'text');
                button.textContent = '✅ 已複製 ' + srcList.length + ' 個';
            }

            setTimeout(() => {
                button.textContent = '複製所有 iframe src';
            }, 2500);
        });

        document.body.appendChild(button);
    }

    window.addEventListener('load', () => {
        createCopyButton();
    });
})();
