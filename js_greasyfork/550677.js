// ==UserScript==
// @name         Rakuten Hover Zoom (overlay safe)
// @namespace    https://example.com/
// @version      1.1
// @description  楽天でマウスホバー時に大きい画像を表示（楽天のレイヤー対策）
// @match        https://item.rakuten.co.jp/*
// @match        https://search.rakuten.co.jp/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/550677/Rakuten%20Hover%20Zoom%20%28overlay%20safe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/550677/Rakuten%20Hover%20Zoom%20%28overlay%20safe%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ===== プレビュー用要素作成 =====
    const preview = document.createElement('div');
    Object.assign(preview.style, {
        position: 'fixed',
        pointerEvents: 'none',   // ← レイヤーに干渉されない
        zIndex: '2147483647',    // ← 最前面（楽天のレイヤーより上）
        border: '1px solid #ccc',
        background: '#fff',
        padding: '4px',
        display: 'none',
        boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
    });
    const img = document.createElement('img');
    Object.assign(img.style, {
        maxWidth: '500px',   // サイズ調整
        maxHeight: '500px'
    });
    preview.appendChild(img);
    document.body.appendChild(preview);

    // ===== イベント =====
    const thumbSelector = 'img.image--x5mNi, img[src*="tshop.r10s.jp"]';

    document.addEventListener('mouseover', e => {
        const t = e.target;
        if (t.matches(thumbSelector)) {
            // fitin=275:275 などを削ってオリジナルサイズURLを推測
            let bigUrl = t.src.replace(/\?.*$/, '');
            img.src = bigUrl;
            preview.style.display = 'block';
        }
    });

    document.addEventListener('mousemove', e => {
        if (preview.style.display === 'block') {
            preview.style.top = (e.clientY + 20) + 'px';
            preview.style.left = (e.clientX + 20) + 'px';
        }
    });

    document.addEventListener('mouseout', e => {
        if (e.target.matches(thumbSelector)) {
            preview.style.display = 'none';
        }
    });

    // ===== レイヤーの pointer-events を無効化（任意） =====
    // もし楽天側の拡大レイヤーが残って邪魔な場合
    const observer = new MutationObserver(muts => {
        muts.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType === 1 && node.matches('.some-rakuten-overlay-class')) {
                    node.style.pointerEvents = 'none';
                }
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
// ===== 邪魔な楽天ボタンを透過 =====
function disableRakutenOverlayButton() {
    document.querySelectorAll(
        'button.button--3YE3u' // 質問のHTMLから特定
    ).forEach(btn => {
        // クリック等は残したいなら pointer-events を none
        btn.style.pointerEvents = 'none';
        btn.style.opacity = '0'; // 完全に見えなくする
    });
}

// ページロード後と、動的追加に対応
disableRakutenOverlayButton();
const obs = new MutationObserver(disableRakutenOverlayButton);
obs.observe(document.body, { childList: true, subtree: true });
