// ==UserScript==
// @name         aimg Progress Bar
// @name:ja      あいもげプログレスバー
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  あいもげのスレ寿命をプログレスバーで表示します
// @author       nanasy
// @match        https://nijiurachan.net/*/thread*
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

    let wrap, fill, add, start, addTime, end, origin, updater;
    const expiry = document.querySelector('.thread-expiry-footer');

    // サイズ調整
    function adjustWidth() {
        const scrollbar = window.innerWidth - document.documentElement.clientWidth;
        wrap.style.width = `calc(100vw - ${scrollbar}px)`;
    }

    // 表示更新
    function updateBar() {
        const now = new Date();
        if(expiry.textContent){
            const text = expiry.textContent.trim().slice(0, -5);
            let [, y, mo, d, h, m] = text.match(/(?:(\d+)年)?(?:(\d+)月)?(?:(\d+)日)?(?:(\d+):(\d+))?/).map(v => (v == null? null: Number(v)));
            h ??= 0;
            m ??= 0;
            d ??= mo? 1: now.getDate();
            mo ??= now.getMonth() + 1;
            y ??= now.getFullYear();
            if(y < 2000)y += 2000;

            end = new Date(y, mo - 1, d, h, m);
            while (end <= now) {
                if (text.includes('年')) {
                    break;
                } else if (text.includes('月')) {
                    y++;
                } else if (text.includes('日')) {
                    mo++;
                    if (mo > 12) {
                        mo = 1;
                        y++;
                    }
                } else break;
                end = new Date(y, mo - 1, d, h, m);
            }
        }
        const ratio = (now - start) / (end - start);
        const formatTime = time => {
            const min = Math.ceil(time / 60000);
            return [
              min >= 1440 && `${min / 1440 | 0}日と`,
              min >= 60 && `${min / 60 % 24 | 0}時間`,
              `${min % 60}分`
            ].filter(Boolean).join('');
        }
        if (ratio < 1 && expiry.textContent) {
            // 寿命が1ヶ月以上なら年月換算
            let remY = end.getFullYear() - now.getFullYear();
            let remMo = end.getMonth() - now.getMonth();
            if (end.getDate() < now.getDate()) remMo--;
            if (remMo < 0) {
                remY--;
                remMo += 12;
            }

            wrap.title = 'あと' + (remY > 0? `${remY}年${remMo}ヶ月`: remMo > 0? `${remMo}ヶ月`: formatTime(end - now));
            fill.style.width = `${ratio * 100}%`;
        } else {
            wrap.title = "まもなく消えます";
            fill.style.width = "100%";
        }
        origin ??= new Date(end - addTime);
        addTime = end - origin;
        if (addTime) wrap.title += ` (${formatTime(addTime)}延長)`;
        add.style.width = `${addTime * 100 / (end - start)}%`;

        adjustWidth();
    }

    // UI生成, 初回実行
    function init() {
        if (/\d+:\d+/.test(expiry.textContent) && !document.querySelector('#progressbar')) {
            const bar = document.createElement('div');
            bar.id = 'progressbar';
            bar.innerHTML = `<div class="wrap"><div class="fill"></div><div class="add"></div></div>`;
            document.body.appendChild(bar);
            wrap = bar.querySelector('.wrap');
            fill = bar.querySelector('.fill');
            add = bar.querySelector('.add');

            const style = document.createElement('style');
            style.textContent = `
                #progressbar{ position: fixed; left: 0px; bottom: ${height}; z-index: 200; }
                #progressbar .wrap{  background: #222; display: flex; position: absolute; }
                #progressbar .fill{ background: #e04000; transition: 1s ease-out; height: ${height}; }
                #progressbar .add{ background: #fff; position: absolute; right: 0px; transition: 1s ease-out; opacity: 0.2; height: ${height}; }
            `;
            document.head.appendChild(style);

            start = new Date(document.querySelector('.thre .cnw').firstChild.nodeValue.trim());
            // 延長時間を取得
            const sod = document.querySelector('.thre .sod').textContent.match(/\d+/);
            addTime = Number(sod? sod[0]: 0) * 600000;

            updateBar();
            // スレに同期して更新
            new MutationObserver(updateBar).observe(expiry, { childList: true, characterData: true });
            // 自動リロードがOFFの場合タイマーで更新
            if (localStorage.getItem('autoReloadEnabled') == 0) updater = setInterval(updateBar, 15000);
        }
        // そうだねが押されたら反映
        document.querySelector('a[id^=sd]')?.addEventListener('click', () => setTimeout(reloadThread, 100));
    }

    // スレの中身が生成・更新されたらinitを実行
    const node = document.querySelector('.thre div[data-thread-op]');
    if (node.firstChild) init();
    new MutationObserver(init).observe(node, { childList: true });

    // 自動リロードの設定が変更されたらタイマーを切り替え
    document.querySelector('#contres').addEventListener('click', e => {
        if (e.target.nodeName === 'INPUT') {
            if(updater)clearInterval(updater);
            if (!e.target.checked) updater = setInterval(updateBar, 15000);
        }
    });

    window.addEventListener('resize', adjustWidth);
})();