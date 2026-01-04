// ==UserScript==
// @name         aimg Progress Bar
// @name:ja      あいもげプログレスバー
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  あいもげのスレ寿命をプログレスバーで表示します
// @author       nanasy
// @match        https://nijiurachan.net/*/thread.php*
// @icon         https://nijiurachan.net/favicon.ico
// @license      MIT
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557660/aimg%20Progress%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/557660/aimg%20Progress%20Bar.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const height = "4px"; // バーの高さ
    let wrap, fill, start, updater;

    // UI生成
    function createBar() {
        const bar = document.createElement('div');
        bar.id = "progressbar";
        bar.innerHTML = `<div class="wrap"><div class="fill"></div></div>`;
        document.body.appendChild(bar);
        wrap = document.querySelector('#progressbar .wrap');
        fill = document.querySelector('#progressbar .fill');

        const style = document.createElement('style');
        style.textContent = `
            #progressbar{ position: fixed; left: 0px; bottom: ${height}; z-index: 200; }
            #progressbar .wrap{ display: flex; position: absolute; height: ${height}; background: #222; }
            #progressbar .fill{ background: #e04000; transition: 1s ease-out; height: ${height}; }
        `;
        document.head.appendChild(style);
    }

    // サイズ調整
    function adjustWidth() {
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        wrap.style.width = `calc(100vw - ${scrollbar}px)`;
    }

    // 表示更新
    function updateBar() {
        adjustWidth();
        const t1 = document.querySelector('#contdisp');
        const t2 = document.querySelector('span[style*="font-size:small"]');
        const [, dayStr, timeStr] = (t1?.textContent || t2?.textContent).trim().slice(0, -5).match(/(\d+(?:日))?(\d+:\d+)/);
        const [h, m] = timeStr.split(':').map(Number);
        const now = new Date();
        const end = new Date(now);

        end.setHours(h, m, 0 ,0);

        if (dayStr) {
            const maxDaysAhead = 28;
            const targetDay = Number(dayStr.slice(0, -1));
            for (let i = 1; i <= maxDaysAhead; i++) {
                end.setDate(now.getDate() + i);
                if (end.getDate() === targetDay) break;
            }
        }

        const ratio = (now - start) / (end - start);
        if (ratio > 1) {
            wrap.title = "まもなく消えます";
            fill.style.width = "100%";
            clearInterval(updater);
        } else {
            const min = Math.ceil((end - now) / 60000);
            if(min >= 60){
                const hour = Math.floor(min / 60);
                wrap.title = 'あと' + (hour >= 24? `${Math.floor(hour / 24)}日と`: '')+ `${hour % 24}時間`;
            }else{
                wrap.title = `あと${min}分`;
            }
            fill.style.width = ratio * 100 + "%";
        }
    }

    // 初回実行, タイマーセット
    function init() {
        const node = document.querySelector('span[style*="font-size:small"]');
        if (/\d+:\d+/.test(node?.textContent) && !document.getElementById('progressbar')) {
            start = new Date(document.querySelector('.thre span.cnw').firstChild.nodeValue.trim());
            createBar();
            updateBar();
            updater = setInterval(updateBar, 30000);
        }
    }
    setTimeout(init, 1000);
    window.addEventListener('resize', adjustWidth);
})();