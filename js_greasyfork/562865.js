// ==UserScript==
// @name         あいもげカタログ公式スレ強調
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  あいもげのカタログで管理人・公式のスレを虹色の枠線で強調表示します
// @author       Feldschlacht
// @license      MIT
// @match        https://nijiurachan.net/pc/catalog.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562865/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%AB%E3%82%BF%E3%83%AD%E3%82%B0%E5%85%AC%E5%BC%8F%E3%82%B9%E3%83%AC%E5%BC%B7%E8%AA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/562865/%E3%81%82%E3%81%84%E3%82%82%E3%81%92%E3%82%AB%E3%82%BF%E3%83%AD%E3%82%B0%E5%85%AC%E5%BC%8F%E3%82%B9%E3%83%AC%E5%BC%B7%E8%AA%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==========================================
    // ⚙️ 設定エリア
    // ==========================================

    // 虹色アニメーションの設定 ('on': 動く / 'off': 静止した虹色)
    const ANIMATION_MODE = 'on';

    // 枠線の太さ (px単位の数値)
    const BORDER_WIDTH = 2;

    // 強調対象にする名前のキーワードリスト
    const TARGET_KEYWORDS = [
        '管理人',
        '運営',
        '開発チーム',
        'admin'
    ];

    // ==========================================
    // 🎨 スタイル定義
    // ==========================================

    /* 【円形グラデーション（色相環）の定義】
       中心から放射状に色が変化します。
       赤から始まり、一周して赤に戻るように定義することで、色相環を表現します。
    */
    const conicGradient = `conic-gradient(
        #ff0000, #ffff00, #00ff00, #00ffff, #0000ff, #ff00ff, #ff0000
    )`;

    /*
       【アニメーション設定】
       色相(filter: hue-rotate)を0度から360度まで回転させることで、
       円形グラデーションの色がその場でぐるぐると変化し続けます。
    */
    const animCSS = (ANIMATION_MODE === 'on')
        ? 'animation: smooth-rainbow-flow 3s linear infinite;'
        : '';

    const highlightStyle = `
        .admin-thread-highlight {
            position: relative !important;
            z-index: 1;
        }

        /* 虹色枠線 (::after擬似要素) */
        .admin-thread-highlight::after {
            content: '';
            position: absolute;
            top: 0; right: 0; bottom: 0; left: 0;
            z-index: 10;
            pointer-events: none;

            border: ${BORDER_WIDTH}px solid transparent;
            border-radius: 2px;

            /* グラデーション適用 (border-imageはconic-gradientに対応) */
            border-image: ${conicGradient} 1;

            /* アニメーション適用 */
            ${animCSS}
        }

        /* 高度な表現 (mask対応ブラウザ用) */
        @supports (-webkit-mask: linear-gradient(#fff 0 0)) or (mask: linear-gradient(#fff 0 0)) {
            .admin-thread-highlight::after {
                border: none;
                border-image: none;

                /* 円形グラデーションを背景に設定 */
                background: ${conicGradient};
                /* conic-gradientはデフォルトで要素全体を埋めるため、background-sizeは不要 */

                padding: ${BORDER_WIDTH}px;

                -webkit-mask:
                    linear-gradient(#fff 0 0) content-box,
                    linear-gradient(#fff 0 0);
                -webkit-mask-composite: xor;
                mask-composite: exclude;

                ${animCSS}
            }
        }

        /* 色相回転アニメーション
           0deg(赤) → 360deg(赤)
           継ぎ目なく無限に色が流れ続けます
        */
        @keyframes smooth-rainbow-flow {
            from { filter: hue-rotate(0deg); }
            to { filter: hue-rotate(360deg); }
        }
    `;

    // CSS注入
    const styleElement = document.createElement('style');
    styleElement.textContent = highlightStyle;
    document.head.appendChild(styleElement);

    // ==========================================
    // 🧠 メインロジック
    // ==========================================

    async function highlightAdminThreads() {
        try {
            const apiUrl = '/api/v1/catalog?limit=200';

            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`API Error: ${response.status}`);

            const json = await response.json();
            if (!json.ok || !json.data || !json.data.threads) return;

            const threads = json.data.threads;
            let hitCount = 0;

            threads.forEach(thread => {
                const threadName = thread.name || '';
                const isTarget = TARGET_KEYWORDS.some(keyword => threadName.includes(keyword));

                if (isTarget) {
                    const targetId = thread.id;
                    const el = document.querySelector(`[data-thread-id="${targetId}"]`);

                    if (el) {
                        el.classList.add('admin-thread-highlight');
                        hitCount++;
                    }
                }
            });

            if (hitCount > 0) {
                console.log(`[AdminHighlighter] ${hitCount}件の公式スレを強調表示しました`);
            }

        } catch (e) {
            console.error('❌ [AdminHighlighter] Error:', e);
        }
    }

    window.addEventListener('load', highlightAdminThreads);

})();