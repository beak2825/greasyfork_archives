// ==UserScript==
// @name         [YouTube] Thumbnail Shift Preview
// @name:ja      [YouTube] サムネイルシフトでプレビュー再生
// @namespace    http://tampermonkey.net/
// @version      2025-10-23.21
// @description  Hover over a YouTube thumbnail and press Shift to preview the video page in the bottom-right corner.
// @description:ja YouTubeのサムネイルにホバーしてShiftキーを押すと、右下に動画ページをプレビューします。
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @author       You (with contributions from Grok)
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/553453/%5BYouTube%5D%20Thumbnail%20Shift%20Preview.user.js
// @updateURL https://update.greasyfork.org/scripts/553453/%5BYouTube%5D%20Thumbnail%20Shift%20Preview.meta.js
// ==/UserScript==
(function () {
    'use strict';

    let currentHoveredLink = null;
    let shiftPressed = false;

    // 動画リンクを動的に監視
    function observeVideoLinks() {
        const observer = new MutationObserver(() => {
            const links = document.querySelectorAll('a#thumbnail, a[href*="/watch?v="], a[href*="youtu.be/"], a[href*="/shorts/"]');
            links.forEach((link) => {
                if (!link.dataset.listenerAdded) {
                    link.addEventListener('mouseenter', () => {
                        currentHoveredLink = link; // ホバー中のリンクを更新
                    });
                    link.addEventListener('mouseleave', () => {
                        if (currentHoveredLink === link) {
                            currentHoveredLink = null;
                        }
                    });
                    link.dataset.listenerAdded = true;
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ページ読み込み完了後に監視開始
    window.addEventListener('load', () => {
        observeVideoLinks();
    });

    // ShiftキーおよびEscキーのイベントリスナー
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Shift') {
            shiftPressed = !shiftPressed; // Shiftキーでトグル
            if (!shiftPressed) {
                // Shiftがオフになったらプレビューを閉じる
                const existingWrapper = document.getElementById('shift-key-iframe-wrapper');
                if (existingWrapper) existingWrapper.remove();
            } else if (currentHoveredLink) {
                // Shiftがオンになり、ホバー中のリンクがあればプレビュー表示
                showPreview();
            }
        } else if (e.key === 'Escape') {
            // Escキーでプレビューを閉じる
            const existingWrapper = document.getElementById('shift-key-iframe-wrapper');
            if (existingWrapper) existingWrapper.remove();
            shiftPressed = false; // Escで閉じた場合、Shift状態もリセット
        }
    });

    // プレビュー表示関数
    function showPreview() {
        if (!shiftPressed || !currentHoveredLink) return;

        // リンク取得
        const href = currentHoveredLink.href;
        if (!href || (!href.includes('watch?v=') && !href.includes('youtu.be/') && !href.includes('/shorts/'))) {
            alert('⚠ 有効なYouTube動画リンクではありません: ' + href);
            console.log('リンク:', href);
            return;
        }

        // YouTube動画IDを抽出
        let videoId = '';
        if (href.includes('watch?v=')) {
            videoId = href.split('watch?v=')[1]?.split('&')[0];
        } else if (href.includes('youtu.be/')) {
            videoId = href.split('youtu.be/')[1]?.split('?')[0].split('/')[0];
        } else if (href.includes('/shorts/')) {
            videoId = href.split('/shorts/')[1]?.split('?')[0].split('/')[0];
        }

        if (!videoId) {
            alert('⚠ 動画IDの取得に失敗しました: ' + href);
            console.log('リンク:', href);
            return;
        }

        // 動画ページURLを構築
        const videoPageUrl = `https://www.youtube.com/watch?v=${videoId}`;

        // 既存のプレビューがあればiframeのsrcを更新
        const existingWrapper = document.getElementById('shift-key-iframe-wrapper');
        if (existingWrapper) {
            const iframe = existingWrapper.querySelector('iframe');
            if (iframe && iframe.src !== videoPageUrl) {
                iframe.src = videoPageUrl; // 新しい動画ページに更新
            }
            return;
        }

        // ラッパー生成
        const wrapper = document.createElement('div');
        wrapper.id = 'shift-key-iframe-wrapper';
        Object.assign(wrapper.style, {
            position: 'fixed',
            bottom: '10px', // 右下に表示
            right: '10px', // 右から10px
            width: '800px',
            height: '450px',
            zIndex: '99999',
            background: 'transparent',
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            borderRadius: '8px',
            overflow: 'hidden',
            border: 'none',
            margin: '0',
            padding: '0'
        });

        // 閉じるボタン
        const closeButton = document.createElement('button');
        closeButton.textContent = '×';
        Object.assign(closeButton.style, {
            position: 'absolute',
            top: '5px',
            right: '5px',
            background: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '30px',
            height: '30px',
            fontSize: '16px',
            cursor: 'pointer',
            zIndex: '1000000'
        });
        closeButton.addEventListener('click', () => {
            wrapper.remove();
            shiftPressed = false; // 閉じるボタンで閉じた場合、Shift状態もリセット
        });

        // iframe生成
        const iframe = document.createElement('iframe');
        Object.assign(iframe.style, {
            width: '1000px',
            height: '680px',
            border: 'none',
            display: 'block',
            transform: 'scale(0.8)',
            transformOrigin: 'top left',
            overflow: 'hidden',
            margin: '0',
            padding: '0',
            background: '#000'
        });
        iframe.setAttribute('scrolling', 'no');
        iframe.src = videoPageUrl; // ホバーしたサムネイルの動画ページを表示
        iframe.allow = 'autoplay; encrypted-media';
        iframe.allowFullscreen = true;
        iframe.referrerpolicy = 'strict-origin-when-cross-origin'; // YouTube要件対応

        wrapper.append(closeButton, iframe);
        document.body.appendChild(wrapper);
    }
})();