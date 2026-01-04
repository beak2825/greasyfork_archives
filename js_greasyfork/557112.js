// ==UserScript==
// @name         あいもげYoutubeポップアップ表示
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  YouTubeリンククリックで固定表示
// @match        https://nijiurachan.net/pc/thread.php*
// @grant        none
// @run-at       document-end
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557112/%E3%81%82%E3%81%84%E3%82%82%E3%81%92Youtube%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/557112/%E3%81%82%E3%81%84%E3%82%82%E3%81%92Youtube%E3%83%9D%E3%83%83%E3%83%97%E3%82%A2%E3%83%83%E3%83%97%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('=== YouTube固定スクリプト起動 (チャット表示版) ===');

    const youtubePatterns = [
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?youtu\.be\/([a-zA-Z0-9_-]{11})/,
        /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/
    ];

    function extractVideoId(url) {
        for (let pattern of youtubePatterns) {
            const match = url.match(pattern);
            if (match) return match[1];
        }
        return null;
    }

    function saveSettings(settings) {
        try {
            localStorage.setItem('ytPlayerSettings', JSON.stringify(settings));
        } catch(e) {
            console.error('設定保存エラー:', e);
        }
    }

    function loadSettings() {
        try {
            const saved = localStorage.getItem('ytPlayerSettings');
            if (saved) {
                return JSON.parse(saved);
            }
        } catch(e) {
            console.error('設定読み込みエラー:', e);
        }
        return {
            width: 560,
            height: 345,
            chatVisible: false,
            chatWidth: 300,
            scaleIndex: 0
        };
    }

    function createFixedPlayer(videoId) {
        console.log('プレイヤー作成: ' + videoId);

        const existing = document.getElementById('fixed-youtube-player');
        if (existing) existing.remove();

        const settings = loadSettings();

        // メインコンテナ
        const container = document.createElement('div');
        container.id = 'fixed-youtube-player';
        container.style.cssText = 'position:fixed;top:10px;right:10px;width:' + settings.width + 'px;height:' + settings.height + 'px;z-index:99999;background:#000;box-shadow:0 4px 12px rgba(0,0,0,0.7);border-radius:8px;overflow:hidden;min-width:560px;min-height:345px;';

        // ヘッダー（コンテンツの上に重ねる）
        const header = document.createElement('div');
        header.style.cssText = 'position:absolute;top:0;left:0;height:30px;background:linear-gradient(to bottom,rgba(68,68,68,0.95),rgba(34,34,34,0.95));color:#fff;display:flex;justify-content:space-between;align-items:center;padding:0 10px;font-size:12px;user-select:none;z-index:10;opacity:0;transition:opacity 0.3s ease;pointer-events:none;';

        const dragArea = document.createElement('div');
        dragArea.style.cssText = 'flex:1;cursor:move;display:flex;align-items:center;height:100%;pointer-events:auto;';
        const title = document.createElement('span');
        title.textContent = '🎬 YouTube Player';
        dragArea.appendChild(title);

        const controls = document.createElement('div');
        controls.style.cssText = 'display:flex;gap:8px;align-items:center;pointer-events:auto;';

        // チャット幅調整
        const widthControl = document.createElement('div');
        widthControl.style.cssText = 'display:none;align-items:center;gap:4px;background:rgba(51,51,51,0.9);padding:2px 6px;border-radius:4px;';

        const minusBtn = document.createElement('span');
        minusBtn.textContent = '−';
        minusBtn.style.cssText = 'cursor:pointer;padding:2px 6px;background:#555;border-radius:2px;font-size:14px;font-weight:bold;user-select:none;';

        const widthValue = document.createElement('span');
        widthValue.textContent = settings.chatWidth;
        widthValue.style.cssText = 'font-size:11px;color:#aaa;width:35px;text-align:center;user-select:none;';

        const plusBtn = document.createElement('span');
        plusBtn.textContent = '＋';
        plusBtn.style.cssText = 'cursor:pointer;padding:2px 6px;background:#555;border-radius:2px;font-size:14px;font-weight:bold;user-select:none;';

        widthControl.appendChild(minusBtn);
        widthControl.appendChild(widthValue);
        widthControl.appendChild(plusBtn);

        // 文字サイズボタン
        const scales = [
            {scale: null, label: 'auto'},
            {scale: 1.0, label: '100%'},
            {scale: 0.75, label: '75%'},
            {scale: 0.6, label: '60%'},
            {scale: 0.5, label: '50%'}
        ];

        const sizeBtn = document.createElement('span');
        sizeBtn.textContent = '📝 ' + scales[settings.scaleIndex].label;
        sizeBtn.style.cssText = 'cursor:pointer;padding:4px 8px;background:#555;border-radius:3px;font-size:11px;display:none;user-select:none;';

        const chatToggle = document.createElement('span');
        chatToggle.textContent = '💬 チャット';
        chatToggle.style.cssText = 'cursor:pointer;padding:4px 8px;background:' + (settings.chatVisible ? '#0a8' : '#555') + ';border-radius:3px;font-size:11px;user-select:none;';

        const closeBtn = document.createElement('span');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = 'cursor:pointer;padding:4px 8px;font-size:14px;user-select:none;';

        controls.appendChild(widthControl);
        controls.appendChild(sizeBtn);
        controls.appendChild(chatToggle);
        controls.appendChild(closeBtn);
        header.appendChild(dragArea);
        header.appendChild(controls);

        // コンテンツエリア
        const content = document.createElement('div');
        content.style.cssText = 'display:flex;width:100%;height:100%;';

        // 動画エリア
        const videoArea = document.createElement('div');
        videoArea.style.cssText = 'flex:1;display:flex;min-width:320px;';

        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width:100%;height:100%;border:none;';
        iframe.src = 'https://www.youtube.com/embed/' + videoId + '?autoplay=1&enablejsapi=1';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;

        videoArea.appendChild(iframe);

        // チャットエリア
        const chatArea = document.createElement('div');
        chatArea.style.cssText = 'width:' + settings.chatWidth + 'px;border-left:1px solid #333;display:' + (settings.chatVisible ? 'block' : 'none') + ';flex-shrink:0;overflow:hidden;';

        const chatWrapper = document.createElement('div');
        chatWrapper.style.cssText = 'width:400px;height:133.33%;transform:scale(0.75);transform-origin:0 0;';

        const chatIframe = document.createElement('iframe');
        chatIframe.style.cssText = 'width:100%;height:100%;border:none;';
        chatIframe.src = 'https://www.youtube.com/live_chat?v=' + videoId + '&embed_domain=' + window.location.hostname;

        chatWrapper.appendChild(chatIframe);
        chatArea.appendChild(chatWrapper);

        content.appendChild(videoArea);
        content.appendChild(chatArea);

        // リサイズハンドル
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = 'position:absolute;bottom:0;right:0;width:20px;height:20px;cursor:nwse-resize;background:linear-gradient(135deg, transparent 50%, #666 50%);z-index:10;';

        container.appendChild(content);
        container.appendChild(header);
        container.appendChild(resizeHandle);
        document.body.appendChild(container);

        if (settings.chatVisible) {
            sizeBtn.style.display = 'block';
            widthControl.style.display = 'flex';
        }

        // 変数
        let chatWidth = settings.chatWidth;
        let chatVisible = settings.chatVisible;
        let scaleIndex = settings.scaleIndex;
        let manualScale = scales[scaleIndex].scale;

        // ヘッダー幅を動画エリアより20px短く
        function updateHeaderWidth() {
            const videoWidth = videoArea.offsetWidth;
            header.style.width = (videoWidth - 20) + 'px';
        }
        updateHeaderWidth();

        // タイトルバー自動表示/非表示
        let headerTimeout = null;

        function showHeader() {
            header.style.opacity = '1';
            if (headerTimeout) clearTimeout(headerTimeout);
        }

        function hideHeader() {
            headerTimeout = setTimeout(function() {
                header.style.opacity = '0';
            }, 2000);
        }

        container.addEventListener('mouseenter', showHeader);
        container.addEventListener('mousemove', function() {
            showHeader();
            hideHeader();
        });
        container.addEventListener('mouseleave', function() {
            if (headerTimeout) clearTimeout(headerTimeout);
            header.style.opacity = '0';
        });

        showHeader();
        hideHeader();

        function saveCurrentSettings() {
            saveSettings({
                width: container.offsetWidth,
                height: container.offsetHeight,
                chatVisible: chatVisible,
                chatWidth: chatWidth,
                scaleIndex: scaleIndex
            });
        }

        function updateChatScale(width, manualScale) {
            if (manualScale !== null) {
                const wrapperWidth = width / manualScale;
                chatWrapper.style.transform = 'scale(' + manualScale + ')';
                chatWrapper.style.width = wrapperWidth + 'px';
                chatWrapper.style.height = (100 / manualScale) + '%';
            } else {
                const scale = 0.5 + (width - 150) * (0.5 / 300);
                const finalScale = Math.max(0.5, Math.min(1.0, scale));
                const wrapperWidth = width / finalScale;
                chatWrapper.style.transform = 'scale(' + finalScale + ')';
                chatWrapper.style.width = wrapperWidth + 'px';
                chatWrapper.style.height = (100 / finalScale) + '%';
            }
        }

        function setChatWidth(newWidth) {
            const oldWidth = chatWidth;
            chatWidth = Math.max(150, Math.min(450, newWidth));
            widthValue.textContent = chatWidth;
            chatArea.style.width = chatWidth + 'px';
            updateChatScale(chatWidth, manualScale);
            const widthDiff = chatWidth - oldWidth;
            container.style.width = (container.offsetWidth + widthDiff) + 'px';
            saveCurrentSettings();
        }

        updateChatScale(chatWidth, manualScale);

        // ボタンイベント
        minusBtn.onclick = function() {
            setChatWidth(chatWidth - 25);
        };

        plusBtn.onclick = function() {
            setChatWidth(chatWidth + 25);
        };

        sizeBtn.onclick = function() {
            scaleIndex = (scaleIndex + 1) % scales.length;
            manualScale = scales[scaleIndex].scale;
            updateChatScale(chatWidth, manualScale);
            sizeBtn.textContent = '📝 ' + scales[scaleIndex].label;
            saveCurrentSettings();
        };

        chatToggle.onclick = function() {
            chatVisible = !chatVisible;
            if (chatVisible) {
                chatArea.style.display = 'block';
                chatArea.style.width = chatWidth + 'px';
                updateChatScale(chatWidth, manualScale);
                const videoWidth = videoArea.offsetWidth;
                container.style.width = (videoWidth + chatWidth) + 'px';
                chatToggle.style.background = '#0a8';
                sizeBtn.style.display = 'block';
                widthControl.style.display = 'flex';
            } else {
                chatArea.style.display = 'none';
                chatToggle.style.background = '#555';
                sizeBtn.style.display = 'none';
                widthControl.style.display = 'none';
            }
            setTimeout(updateHeaderWidth, 50);
            saveCurrentSettings();
        };

        closeBtn.onclick = function() {
            saveCurrentSettings();
            container.remove();
        };

        // ドラッグ移動
        let isDragging = false;
        let dragStartX, dragStartY, containerStartLeft, containerStartTop;

        dragArea.addEventListener('mousedown', function(e) {
            isDragging = true;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            const rect = container.getBoundingClientRect();
            containerStartLeft = rect.left;
            containerStartTop = rect.top;
            container.style.right = 'auto';
        });

        document.addEventListener('mousemove', function(e) {
            if (!isDragging) return;
            const dx = e.clientX - dragStartX;
            const dy = e.clientY - dragStartY;
            container.style.left = (containerStartLeft + dx) + 'px';
            container.style.top = (containerStartTop + dy) + 'px';
        });

        document.addEventListener('mouseup', function() {
            isDragging = false;
        });

        // リサイズ
        let isResizing = false;
        let resizeStartX, resizeStartY, startWidth, startHeight;

        resizeHandle.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            isResizing = true;
            resizeStartX = e.clientX;
            resizeStartY = e.clientY;
            startWidth = container.offsetWidth;
            startHeight = container.offsetHeight;
        });

        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;

            const dx = e.clientX - resizeStartX;
            const dy = e.clientY - resizeStartY;

            const newHeight = Math.max(345, startHeight + dy);
            container.style.height = newHeight + 'px';

            if (chatVisible) {
                const minWidth = 320 + chatWidth;
                const newWidth = Math.max(minWidth, startWidth + dx);
                container.style.width = newWidth + 'px';
            } else {
                const newWidth = Math.max(560, startWidth + dx);
                container.style.width = newWidth + 'px';
            }
            updateHeaderWidth();
        });

        document.addEventListener('mouseup', function() {
            if (isResizing) {
                isResizing = false;
                saveCurrentSettings();
            }
        });
    }

    function attachHandlers() {
        const allLinks = document.querySelectorAll('a');
        let count = 0;

        allLinks.forEach(function(link) {
            const videoId = extractVideoId(link.href);
            if (videoId && !link.dataset.ytHandled) {
                link.dataset.ytHandled = 'true';
                count++;

                link.addEventListener('click', function(e) {
                    e.preventDefault();
                    createFixedPlayer(videoId);
                });

                link.style.color = '#ff0000';
                link.style.fontWeight = 'bold';
            }
        });

        if (count > 0) {
            console.log('YouTubeリンク検出: ' + count + '個');
        }
    }

    function init() {
        attachHandlers();

        const observer = new MutationObserver(function() {
            attachHandlers();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }
})();
