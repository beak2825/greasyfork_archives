// ==UserScript==
// @name         YouTube Live Chat Channel Name Restorer
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  YouTubeのライブチャットでチャンネル名を表示します。メンバーは元の色（緑など）、一般は明るいグレー、チャンネル主は黄色で表示されます。固定コメント非表示ボタン付き。
// @author       めらのあ
// @match        https://www.youtube.com/*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557297/YouTube%20Live%20Chat%20Channel%20Name%20Restorer.user.js
// @updateURL https://update.greasyfork.org/scripts/557297/YouTube%20Live%20Chat%20Channel%20Name%20Restorer.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // --- CONFIGURATION ---
    const MAX_CONCURRENT_REQUESTS = 6;
    const REQUEST_DELAY_MS = 100;
    // --- STATE ---
    const CACHE = new Map();
    const PENDING = new Map();
    const QUEUE = [];
    let activeRequests = 0;
    let pinnedHidden = false;

    // --- UTILS ---
    const getHandleText = (el) => {
        const text = el.textContent || el.innerText || '';
        if (text.startsWith('@') && text.length > 1) return text.trim();
        const chip = el.closest('yt-live-chat-author-chip') || el.querySelector('yt-live-chat-author-chip');
        if (chip) {
            const span = chip.querySelector('#author-name') || chip.querySelector('span');
            if (span && span.textContent?.trim().startsWith('@')) return span.textContent.trim();
        }
        return null;
    };

    // --- 色を暗くするユーティリティ関数 ---
    const darkenColor = (color, amount = 0.3) => {
        const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        if (match) {
            const r = Math.max(0, Math.floor(parseInt(match[1]) * (1 - amount)));
            const g = Math.max(0, Math.floor(parseInt(match[2]) * (1 - amount)));
            const b = Math.max(0, Math.floor(parseInt(match[3]) * (1 - amount)));
            return `rgb(${r}, ${g}, ${b})`;
        }
        const hexMatch = color.match(/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i);
        if (hexMatch) {
            const r = Math.max(0, Math.floor(parseInt(hexMatch[1], 16) * (1 - amount)));
            const g = Math.max(0, Math.floor(parseInt(hexMatch[2], 16) * (1 - amount)));
            const b = Math.max(0, Math.floor(parseInt(hexMatch[3], 16) * (1 - amount)));
            return `rgb(${r}, ${g}, ${b})`;
        }
        return color;
    };

    // --- 固定コメント非表示ボタン ---
    const createPinnedToggleButton = () => {
        if (document.querySelector('#pinned-toggle-btn')) return;

        const chatHeader = document.querySelector('yt-live-chat-header-renderer');
        if (!chatHeader) return;

        const btn = document.createElement('button');
        btn.id = 'pinned-toggle-btn';
        btn.textContent = '📌';
        btn.title = '固定コメントを非表示/表示';
        btn.style.cssText = `
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 4px;
            color: white;
            cursor: pointer;
            font-size: 14px;
            padding: 2px 6px;
            margin-right: 8px;
            transition: background 0.2s;
            flex-shrink: 0;
        `;
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(255, 255, 255, 0.2)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = pinnedHidden ? 'rgba(255, 100, 100, 0.3)' : 'rgba(255, 255, 255, 0.1)';
        });
        btn.addEventListener('click', () => {
            pinnedHidden = !pinnedHidden;
            togglePinnedComments();
            btn.style.background = pinnedHidden ? 'rgba(255, 100, 100, 0.3)' : 'rgba(255, 255, 255, 0.1)';
            btn.title = pinnedHidden ? '固定コメントを表示' : '固定コメントを非表示';
        });

        // 「トップチャット」ドロップダウンの右横に挿入
        const menuButton = chatHeader.querySelector('yt-dropdown-menu') ||
            chatHeader.querySelector('#menu') ||
            chatHeader.querySelector('#primary-content tp-yt-paper-menu-button');
        if (menuButton && menuButton.parentNode) {
            // メニューボタンの直後に挿入
            if (menuButton.nextSibling) {
                menuButton.parentNode.insertBefore(btn, menuButton.nextSibling);
            } else {
                menuButton.parentNode.appendChild(btn);
            }
        } else {
            // フォールバック: primary-contentに追加
            const headerContent = chatHeader.querySelector('#primary-content') || chatHeader;
            headerContent.appendChild(btn);
        }
    };

    const togglePinnedComments = () => {
        const pinnedMessages = document.querySelectorAll('yt-live-chat-banner-manager, yt-live-chat-pinned-message-renderer');
        pinnedMessages.forEach(el => {
            el.style.display = pinnedHidden ? 'none' : '';
        });
    };

    // --- QUEUE PROCESSOR ---
    const processQueue = async () => {
        if (activeRequests >= MAX_CONCURRENT_REQUESTS || QUEUE.length === 0) return;
        const handle = QUEUE.shift();
        activeRequests++;
        try {
            const cleanHandle = handle.slice(1);
            const url = `https://www.youtube.com/@${cleanHandle}/about`;
            const response = await fetch(url);
            const html = await response.text();
            const match = html.match(/<meta property="og:title" content="([^"]+)">/);
            let realName = match ? match[1] : '';
            realName = realName.replace(' - YouTube', '').trim();
            if (!realName) realName = null;
            if (realName) {
                CACHE.set(cleanHandle, realName);
            }
            const callbacks = PENDING.get(cleanHandle) || [];
            callbacks.forEach(cb => cb(realName));
        } catch (e) {
            console.warn(`[NameRestorer] Failed to fetch ${handle}`, e);
        } finally {
            PENDING.delete(handle.slice(1));
            activeRequests--;
            if (QUEUE.length > 0) {
                setTimeout(processQueue, REQUEST_DELAY_MS);
            }
        }
    };

    const enqueueRequest = (handle, callback) => {
        const cleanHandle = handle.slice(1);
        if (CACHE.has(cleanHandle)) {
            callback(CACHE.get(cleanHandle));
            return;
        }
        if (PENDING.has(cleanHandle)) {
            PENDING.get(cleanHandle).push(callback);
            return;
        }
        PENDING.set(cleanHandle, [callback]);
        QUEUE.push(handle);
        processQueue();
    };

    // --- DOM PROCESSOR ---
    const processChip = (chip) => {
        if (chip.dataset.processed) return;
        if (chip.querySelector('.restored-channel-name')) {
            chip.dataset.processed = 'true';
            return;
        }
        const handle = getHandleText(chip);
        if (!handle) return;
        chip.dataset.processed = 'true';

        // --- リクエスト前に同期的に情報を取得 ---
        const authorNameNode = chip.querySelector('#author-name') || chip.querySelector('span');
        if (!authorNameNode) return;

        const originalColor = window.getComputedStyle(authorNameNode).color;

        // 元の色をRGB値で解析して、白/グレー系かどうか判定
        const rgbMatch = originalColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
        let isDefaultColor = true; // デフォルト色（グレー系）かどうか
        if (rgbMatch) {
            const r = parseInt(rgbMatch[1]);
            const g = parseInt(rgbMatch[2]);
            const b = parseInt(rgbMatch[3]);
            // グレー系は R≈G≈B で値が近い
            const maxDiff = Math.max(Math.abs(r - g), Math.abs(g - b), Math.abs(r - b));
            isDefaultColor = maxDiff < 30; // 色差が30未満ならグレー系とみなす
        }

        // グレー系なら明るいグレー、それ以外は元の色をそのまま使用
        const targetColor = isDefaultColor ? '#dddddd' : originalColor;

        enqueueRequest(handle, (realName) => {
            if (!realName) return;
            if (chip.querySelector('.restored-channel-name')) return;

            // チャンネル名スパンを作成
            const nameSpan = document.createElement('span');
            nameSpan.className = 'restored-channel-name';
            nameSpan.textContent = realName + ' ';
            nameSpan.style.cssText = `
                font-weight: 700 !important;
                margin-right: 4px;
                color: ${targetColor} !important;
            `;

            // @userを()で囲み、暗い色に
            const handleSpan = document.createElement('span');
            handleSpan.className = 'restored-handle';
            handleSpan.textContent = `(${handle})`;
            const darkenedColor = darkenColor(targetColor, 0.35);
            handleSpan.style.cssText = `
                font-size: 0.85em;
                color: ${darkenedColor} !important;
                margin-left: 2px;
            `;

            // 元の@userを非表示
            authorNameNode.style.display = 'none';

            chip.insertBefore(handleSpan, chip.firstChild);
            chip.insertBefore(nameSpan, chip.firstChild);
            chip.title = `${handle} (${realName})`;
        });
    };

    // --- メッセージの改行処理 ---
    const processMessage = (messageEl) => {
        if (messageEl.dataset.lineBreakProcessed) return;
        messageEl.dataset.lineBreakProcessed = 'true';

        messageEl.style.cssText = `
            display: block !important;
            white-space: pre-wrap !important;
            word-break: break-word !important;
        `;
    };

    // --- 固定コメントの監視 ---
    const watchPinnedComments = () => {
        if (pinnedHidden) {
            togglePinnedComments();
        }
    };

    // --- OBSERVER ---
    const observer = new MutationObserver(mutations => {
        for (const mutation of mutations) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;

                    // チップ処理
                    if (node.tagName === 'YT-LIVE-CHAT-AUTHOR-CHIP') {
                        processChip(node);
                    } else if (node.getElementsByTagName) {
                        const chips = node.getElementsByTagName('yt-live-chat-author-chip');
                        for (let i = 0; i < chips.length; i++) {
                            processChip(chips[i]);
                        }
                    }

                    // メッセージ改行処理
                    if (node.id === 'message' || node.querySelector?.('#message')) {
                        const messages = node.id === 'message' ? [node] : node.querySelectorAll('#message');
                        messages.forEach(processMessage);
                    }

                    // 固定コメント監視（非表示状態なら新しい固定も非表示に）
                    if (node.tagName === 'YT-LIVE-CHAT-BANNER-MANAGER' ||
                        node.tagName === 'YT-LIVE-CHAT-PINNED-MESSAGE-RENDERER') {
                        watchPinnedComments();
                    }
                });
            }
        }
    });

    const startObserver = () => {
        const chatContainer = document.querySelector('yt-live-chat-renderer') ||
            document.querySelector('yt-live-chat-app') ||
            document.body;
        if (chatContainer) {
            observer.observe(chatContainer, { childList: true, subtree: true });
            document.querySelectorAll('yt-live-chat-author-chip').forEach(processChip);
            document.querySelectorAll('#message').forEach(processMessage);
            createPinnedToggleButton();
            console.log('YouTube Chat Name Restorer (Release v1.6 Enhanced) Started');
        } else {
            setTimeout(startObserver, 1000);
        }
    };

    if (document.readyState === 'complete') {
        startObserver();
    } else {
        window.addEventListener('load', startObserver);
    }
})();

