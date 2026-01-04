// ==UserScript==
// @name         YouTube埋め込みプレイヤー最大化
// @namespace    gunjobiyori.com
// @version      0.0.1
// @description  埋め込みYouTubeプレイヤーをウィンドウ内で最大化
// @author       euro_s
// @match        https://koyokoyotube.web.app/watch/*
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/560316/YouTube%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E6%9C%80%E5%A4%A7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/560316/YouTube%E5%9F%8B%E3%82%81%E8%BE%BC%E3%81%BF%E3%83%97%E3%83%AC%E3%82%A4%E3%83%A4%E3%83%BC%E6%9C%80%E5%A4%A7%E5%8C%96.meta.js
// ==/UserScript==
(() => {
    'use strict';

    // 最大化用のスタイル
    const style = `
    .kyt-maximized {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 2147483647 !important;
      background: black !important;
      display: block !important;
    }
    .kyt-maximized .MuiBox-root,
    .kyt-maximized > div,
    .kyt-maximized > div > div,
    .kyt-maximized > div > div > div {
      width: 100% !important;
      height: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
      aspect-ratio: unset !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
    }
    .kyt-maximized iframe#youtubeplayer {
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
    }
    .kyt-maximize-btn {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 2147483648;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border: 2px solid white;
      border-radius: 6px;
      padding: 10px 16px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      opacity: 0;
      transition: opacity 0.3s;
      pointer-events: none;
    }
    .kyt-maximize-btn.visible {
      opacity: 1;
      pointer-events: auto;
    }
    .kyt-maximize-btn:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  `;

    // スタイルを追加
    GM_addStyle(style);

    // 状態管理
    let isMaximized = false;
    let targetContainer = null;
    let maximizeBtn = null;

    // 最大化ボタンを作成
    function createButton() {
        if (maximizeBtn) return maximizeBtn;

        maximizeBtn = document.createElement('button');
        maximizeBtn.className = 'kyt-maximize-btn';
        maximizeBtn.textContent = '⛶ 最大化';
        maximizeBtn.addEventListener('click', toggleMaximize);
        document.body.appendChild(maximizeBtn);
        return maximizeBtn;
    }

    // 最大化/復元を切り替え
    function toggleMaximize() {
        if (isMaximized) {
            restore();
        } else {
            maximize();
        }
    }

    // 最大化
    function maximize() {
        // .fullscreen コンテナを探す
        targetContainer = document.querySelector('.fullscreen');
        if (!targetContainer) {
            // フォールバック: YouTube iframe の親を探す
            const iframe = document.querySelector('iframe#youtubeplayer, iframe[src*="youtube.com/embed"]');
            if (iframe) {
                targetContainer = iframe.closest('div');
            }
        }

        if (!targetContainer) {
            console.log('KoyoTube Maximize: プレイヤーコンテナが見つかりません');
            return;
        }

        // 最大化クラスを追加
        targetContainer.classList.add('kyt-maximized');

        isMaximized = true;
        maximizeBtn.textContent = '✕ 閉じる';
        maximizeBtn.classList.add('visible');
    }

    // 復元
    function restore() {
        if (targetContainer) {
            targetContainer.classList.remove('kyt-maximized');
            targetContainer = null;
        }

        isMaximized = false;
        if (maximizeBtn) {
            maximizeBtn.textContent = '⛶ 最大化';
        }
    }

    // マウス移動でボタンの表示/非表示を制御
    let hideTimeout = null;
    function handleMouseMove() {
        if (!maximizeBtn) return;

        maximizeBtn.classList.add('visible');

        clearTimeout(hideTimeout);
        if (!isMaximized) {
            hideTimeout = setTimeout(() => {
                maximizeBtn.classList.remove('visible');
            }, 2000);
        }
    }

    // Escキーで閉じる
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && isMaximized) {
            restore();
        }
    });

    // 初期化
    function init() {
        // プレイヤーが存在するか確認
        const hasPlayer = document.querySelector('.fullscreen') ||
            document.querySelector('iframe#youtubeplayer') ||
            document.querySelector('iframe[src*="youtube.com/embed"]');

        if (hasPlayer) {
            createButton();
            document.addEventListener('mousemove', handleMouseMove);
        }
    }

    // DOMContentLoaded後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 動的なページ変更に対応
    const observer = new MutationObserver(() => {
        if (!maximizeBtn) {
            init();
        }
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
    });
})();
