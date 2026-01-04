// ==UserScript==
// @name         Waze リンクポッド + URLランチャー (Editorのみ)
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  リンクポッドはEditorのみ。URLツールはEventsページ（クエリ付きURL対応）で表示
// @author       Aoi
// @match        https://www.waze.com/*/editor*
// @match        https://www.waze.com/ja/events*
// @match        https://www.waze.com/ja/events?*
// @grant        none
// @run-at       document-start
// @license      MIT
// @icon         https://www.waze.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/555244/Waze%20%E3%83%AA%E3%83%B3%E3%82%AF%E3%83%9D%E3%83%83%E3%83%89%20%2B%20URL%E3%83%A9%E3%83%B3%E3%83%81%E3%83%A3%E3%83%BC%20%28Editor%E3%81%AE%E3%81%BF%29.user.js
// @updateURL https://update.greasyfork.org/scripts/555244/Waze%20%E3%83%AA%E3%83%B3%E3%82%AF%E3%83%9D%E3%83%83%E3%83%89%20%2B%20URL%E3%83%A9%E3%83%B3%E3%83%81%E3%83%A3%E3%83%BC%20%28Editor%E3%81%AE%E3%81%BF%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ページ判定（クエリ付きURLでも正しく判定）
    const isEditor = /\/editor/.test(location.pathname);
    const isEvents = /\/ja\/events/.test(location.pathname);

    // ==================================================================
    // 1. リンクポッド（Editor のみ）
    // ==================================================================

    function createToolbar() {
        if (!isEditor) return null;
        if (document.getElementById('waze-utility-bar')) return null;

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
            }
        ];

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

        // 位置復元
        const KEY = 'waze_utility_bar_position';
        const saved = localStorage.getItem(KEY);
        const pos = saved ? JSON.parse(saved) : { top: '50%', right: '12px', transform: 'translateY(-50%)', left: 'auto', bottom: 'auto' };
        Object.assign(bar.style, pos);

        // ドラッグ移動
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

    // ==================================================================
    // 2. URLランチャー（Events のみ）
    // ==================================================================

    function createUrlTool() {
        if (!isEvents) {
            const existing = document.getElementById('waze-url-tool');
            if (existing) existing.remove();
            return null;
        }

        if (document.getElementById('waze-url-tool')) return null;

        const container = document.createElement('div');
        container.id = 'waze-url-tool';
        container.style.cssText = `
            position: fixed; bottom: 20px; left: 50%; transform: translateX(-50%);
            display: flex; flex-direction: column; align-items: center;
            z-index: 2147483646; font-family: Arial, sans-serif;
        `;

        const urlInput = document.createElement('input');
        urlInput.type = 'text';
        urlInput.placeholder = 'https://www.waze.com/ja/events?zoom=17&lat=42.9904&lon=141.5554';
        urlInput.style.cssText = `
            margin-bottom: 5px; width: 400px; padding: 8px; font-size: 14px;
            border: 1px solid #ccc; border-radius: 4px;
        `;

        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; gap: 5px;';

        const createBtn = (text, color, callback) => {
            const btn = document.createElement('button');
            btn.innerHTML = text;
            btn.style.cssText = `
                padding: 6px 12px; background: ${color}; color: white;
                border: none; border-radius: 4px; cursor: pointer;
                font-size: 13px; min-width: 80px;
            `;
            btn.onclick = callback;
            return btn;
        };

        const pasteBtn = createBtn('貼り付け', '#007bff', () => {
            navigator.clipboard.readText()
                .then(text => urlInput.value = text.trim())
                .catch(() => alert('クリップボードの読み込みに失敗しました'));
        });

        const editorBtn = createBtn('Editorで開く', '#28a745', () => openWaze('editor'));
        const liveMapBtn = createBtn('Live Mapで開く', '#dc3545', () => openWaze('livemap'));

        const openWaze = (type) => {
            const url = urlInput.value.trim();
            if (!url) return alert('URLを入力または貼り付けてください。');

            const params = new URLSearchParams(url.split('?')[1]);
            const lat = params.get('lat') || params.get('latitude');
            const lon = params.get('lon') || params.get('longitude') || params.get('lng');

            if (!lat || !lon) {
                return alert('URLに緯度と経度が含まれていません。');
            }

            if (type === 'editor') {
                const editorUrl = `https://www.waze.com/ja/editor?env=row&lon=${lon}&lat=${lat}&zoom=5`;
                window.open(editorUrl, '_blank');
            } else {
                const liveMapUrl = `https://www.waze.com/ja/live-map/directions?to=ll.${lat}%2C${lon}`;
                window.open(liveMapUrl, '_blank');
            }
        };

        buttonContainer.append(pasteBtn, editorBtn, liveMapBtn);
        container.append(urlInput, buttonContainer);
        return container;
    }

    // ==================================================================
    // 3. 注入
    // ==================================================================

    function injectAll() {
        if (!document.body) return;

        const toolbar = createToolbar();
        const urlTool = createUrlTool();

        if (toolbar && !document.getElementById('waze-utility-bar')) {
            document.body.appendChild(toolbar);
        }
        if (urlTool && !document.getElementById('waze-url-tool')) {
            document.body.appendChild(urlTool);
        }
    }

    const tryInject = () => document.body ? injectAll() : setTimeout(tryInject, 100);
    tryInject();
    document.addEventListener('DOMContentLoaded', injectAll);
    window.addEventListener('load', () => setTimeout(injectAll, 1000));

    new MutationObserver(injectAll).observe(document.documentElement, { childList: true, subtree: true });
    setInterval(injectAll, 3000);

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(injectAll, 600);
        }
    }).observe(document, { subtree: true, childList: true });

})();
