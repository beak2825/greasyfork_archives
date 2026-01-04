// ==UserScript==
// @name         Waze リンクポッド
// @namespace    http://tampermonkey.net/
// @version      1.9
// @description  動かせる縦型ツールバー＋便利リンクボタン（Wazeエディタ・ライブマップ対応）
// @author       Aoi
// @match        https://www.waze.com/*/editor*
// @match        https://www.waze.com/ja/live-map/directions
// @match        https://www.waze.com/live-map/directions
// @grant        none
// @run-at       document-start
// @license      MIT
// @icon         https://www.waze.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/554800/Waze%20%E3%83%AA%E3%83%B3%E3%82%AF%E3%83%9D%E3%83%83%E3%83%89.user.js
// @updateURL https://update.greasyfork.org/scripts/554800/Waze%20%E3%83%AA%E3%83%B3%E3%82%AF%E3%83%9D%E3%83%83%E3%83%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // === ボタン設定（ここに追加するだけ！）===
    const BUTTONS = [
        {
            icon: 'https://web-assets.waze.com/livemap/stg/event-icon-48x48.png',
            url: 'https://www.waze.com/ja/events',
            title: 'Waze イベント'
        },
        {
            icon: 'https://www.mlit.go.jp/common/logo.png',
            url: 'https://www.road-info-prvs.mlit.go.jp/roadinfo/pc/',
            title: '国土交通省 道路情報'
        },
        {
            icon: 'https://orbis-guide.com/favicon.ico',  // 短縮＆安定
            url: 'https://orbis-guide.com/',
            title: 'Orbis Guide'
        }
    ];

    // === ツールバー作成 ===
    function createToolbar() {
        // 既存があれば削除
        document.getElementById('waze-utility-bar')?.remove();

        const bar = document.createElement('div');
        bar.id = 'waze-utility-bar';
        bar.style.cssText = `
            position: fixed; display: flex; flex-direction: column;
            gap: 8px; padding: 8px; background: white;
            border: 1px solid #ddd; border-radius: 12px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 2147483647; cursor: grab; user-select: none;
            font-family: Arial, sans-serif; transition: box-shadow 0.2s;
        `;

        bar.onmouseover = () => bar.style.boxShadow = '0 6px 16px rgba(0,0,0,0.2)';
        bar.onmouseout = () => bar.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';

        // ボタン追加
        BUTTONS.forEach(btn => {
            const button = document.createElement('button');
            button.style.cssText = `
                width: 40px; height: 40px; padding: 0; margin: 0;
                background: transparent; border: none; border-radius: 8px;
                cursor: pointer; display: flex; align-items: center;
                justify-content: center; transition: background 0.2s;
            `;

            const img = new Image(28, 28);
            img.src = btn.icon;
            img.alt = btn.title;
            img.style.pointerEvents = 'none';

            // アイコン読み込み失敗 → 頭文字表示
            img.onerror = () => {
                img.style.display = 'none';
                button.textContent = btn.title[0];
                button.style.font = 'bold 14px Arial';
            };

            button.appendChild(img);
            button.title = btn.title;
            button.onclick = e => { e.stopPropagation(); window.open(btn.url, '_blank'); };
            button.onmouseover = () => button.style.background = '#f0f0f0';
            button.onmouseout = () => button.style.background = 'transparent';

            bar.appendChild(button);
        });

        // === 位置復元（初回は右中央）===
        const KEY = 'waze_utility_bar_position';
        const saved = localStorage.getItem(KEY);
        const pos = saved ? JSON.parse(saved) : { top: '50%', right: '12px', transform: 'translateY(-50%)', left: 'auto', bottom: 'auto' };
        Object.assign(bar.style, pos);

        // === ドラッグ移動 ===
        let dragging = false, startX, startY, startLeft, startTop;

        bar.onmousedown = e => {
            if (e.target.tagName === 'BUTTON') return;
            e.preventDefault();
            dragging = true;
            bar.style.transition = 'none';
            bar.style.cursor = 'grabbing';
            bar.style.transform = 'none';

            const rect = bar.getBoundingClientRect();
            startX = e.clientX; startY = e.clientY;
            startLeft = rect.left; startTop = rect.top;

            if (bar.style.right !== 'auto') {
                bar.style.left = `${rect.left}px`;
                bar.style.right = 'auto';
            }
        };

        const move = e => {
            if (!dragging) return;
            bar.style.left = `${startLeft + e.clientX - startX}px`;
            bar.style.top = `${startTop + e.clientY - startY}px`;
            bar.style.right = 'auto'; bar.style.bottom = 'auto';
        };

        const up = () => {
            if (!dragging) return;
            dragging = false;
            bar.style.transition = 'box-shadow 0.2s';
            bar.style.cursor = 'grab';

            localStorage.setItem(KEY, JSON.stringify({
                top: bar.style.top,
                left: bar.style.left,
                right: 'auto',
                bottom: 'auto'
            }));
        };

        document.addEventListener('mousemove', move);
        document.addEventListener('mouseup', up);
        bar.onmouseleave = up;

        return bar;
    }

    // === ツールバー挿入（複数タイミング対応）===
    function inject() {
        if (document.getElementById('waze-utility-bar')) return;
        const container = document.body || document.documentElement;
        if (container) container.appendChild(createToolbar());
    }

    const tryInject = () => document.body ? inject() : setTimeout(tryInject, 100);
    tryInject();
    document.addEventListener('DOMContentLoaded', inject);
    window.addEventListener('load', () => setTimeout(inject, 1000));

    // 動的ページ・URL変化対応
    new MutationObserver(inject).observe(document.documentElement, { childList: true, subtree: true });
    setInterval(inject, 3000);

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(inject, 600);
        }
    }).observe(document, { subtree: true, childList: true });

})();

