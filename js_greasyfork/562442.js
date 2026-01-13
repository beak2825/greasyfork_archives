// ==UserScript==
// @name         YouTube Live Chat Danmaku - Replay & Fullscreen Fix
// @name:zh-TW   YouTube 直播彈幕助手 - 支援回放與全螢幕
// @namespace    http://tampermonkey.net/
// @version      2.8.0
// @description  Display YouTube live chat as danmaku (scrolling comments). Supports live streams and replays. Optimized for fullscreen with zero ghosting.
// @description:zh-TW 在 YouTube 直播與回放影片中顯示「彈幕」。支援自動隱藏回放側邊欄，針對全螢幕與劇場模式優化，流暢無殘影。
// @author       YC白白
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/562442/YouTube%20Live%20Chat%20Danmaku%20-%20Replay%20%20Fullscreen%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/562442/YouTube%20Live%20Chat%20Danmaku%20-%20Replay%20%20Fullscreen%20Fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 【使用者自訂參數設定】
     * 可以在下方調整彈幕的外觀與速度
     */
    const CONFIG = {
        SHOW_AUTHOR: false,              // 是否顯示發言者 (true/false)
        FONT_SIZE: '32px',               // 彈幕文字大小
        FONT_WEIGHT: 'bold',             // 文字粗細
        OPACITY: '1.0',                  // 透明度 (0.0 ~ 1.0)
        FONT_FAMILY: '"Microsoft JhengHei", "Apple LiGothic Medium", sans-serif',
        TEXT_SHADOW: '2px 2px 0 #000, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 0px 3px 3px rgba(0,0,0,0.8)',

        TRACK_COUNT: 15,                 // 彈幕最大行數
        TRACK_HEIGHT: 55,                // 每行高度
        TRACK_OFFSET_TOP: 35,            // 第一行距離頂部距離

        SPEED_BASE: 2.8,                 // 移動基礎速度 (數值越大越快)
        SPEED_BONUS: 0.05,               // 長句子額外加權速度
        MAX_SPEED: 5.5,                  // 速度上限

        CHECK_INTERVAL: 3000,            // 系統偵測頻率 (毫秒)
        HISTORY_LIMIT: 1000,             // 彈幕去重記憶容量
        AUTO_HIDE_REPLAY_PANEL: true     // 回放模式時是否自動優化版面
    };

    // ========================================================================
    // 【核心運作引擎 - 物理座標控制系統】
    // ========================================================================

    let danmakus = [];
    let currentTrack = 0;
    const globalProcessedIds = new Set();

    /**
     * 取得影片 ID
     */
    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        let v = urlParams.get('v');
        if (!v) {
            const pathSegments = window.location.pathname.split('/');
            if (pathSegments[1] === 'live') v = pathSegments[2];
        }
        return v;
    }

    /**
     * 直播與回放模式偵測
     */
    function detectVideoMode() {
        const liveBadge = document.querySelector('.ytp-live-badge');
        const isPhysicallyLive = liveBadge && liveBadge.offsetWidth > 0;
        const isInternallyLive = window.ytInitialPlayerResponse?.videoDetails?.isLive === true;

        const replayKeywords = ['聊天重播', '開啟面板', 'Chat Replay', 'Show Chat', 'Show chat'];
        const hasReplayText = replayKeywords.some(key => document.body.innerText.includes(key));
        const hasReplayComponent = !!document.querySelector('yt-video-metadata-carousel-view-model');

        if (isPhysicallyLive || isInternallyLive) return 'live_chat';
        if (hasReplayComponent || hasReplayText) return 'live_chat_replay';
        return null;
    }

    if (window.self === window.top) {

        /**
         * 建立或取得彈幕舞台
         */
        function getOrCreateStage() {
            const videoPlayer = document.querySelector('#movie_player') || document.querySelector('.html5-video-player');
            if (!videoPlayer) return null;

            let stage = document.getElementById('yt-danmaku-stage');
            if (!stage) {
                stage = document.createElement('div');
                stage.id = 'yt-danmaku-stage';
                Object.assign(stage.style, {
                    position: 'absolute', top: '0', left: '0', width: '100%', height: '100%',
                    overflow: 'hidden', pointerEvents: 'none', zIndex: '100', display: 'block'
                });
                videoPlayer.appendChild(stage);
            }
            if (!videoPlayer.contains(stage)) videoPlayer.appendChild(stage);
            return stage;
        }

        /**
         * 物理位移更新循環 (取代 CSS Transition)
         */
        function updatePhysicsLoop() {
            const stage = document.getElementById('yt-danmaku-stage');
            if (!stage) {
                requestAnimationFrame(updatePhysicsLoop);
                return;
            }

            for (let i = danmakus.length - 1; i >= 0; i--) {
                const d = danmakus[i];
                d.x -= d.speed;

                // 使用硬體加速位移
                d.el.style.transform = `translate3d(${d.x}px, 0, 0)`;

                // 移除條件：離開左側螢幕
                if (d.x < -(d.width + 100)) {
                    d.el.remove();
                    danmakus.splice(i, 1);
                }
            }
            requestAnimationFrame(updatePhysicsLoop);
        }
        requestAnimationFrame(updatePhysicsLoop);

        /**
         * 渲染彈幕
         */
        function renderDanmaku(author, message) {
            const stage = getOrCreateStage();
            if (!stage) return;

            const el = document.createElement('div');
            el.innerText = CONFIG.SHOW_AUTHOR ? `${author}: ${message}` : message;

            Object.assign(el.style, {
                position: 'absolute', whiteSpace: 'nowrap', color: 'white',
                fontSize: CONFIG.FONT_SIZE, fontWeight: CONFIG.FONT_WEIGHT,
                fontFamily: CONFIG.FONT_FAMILY, opacity: CONFIG.OPACITY,
                textShadow: CONFIG.TEXT_SHADOW,
                top: `${(currentTrack % CONFIG.TRACK_COUNT) * CONFIG.TRACK_HEIGHT + CONFIG.TRACK_OFFSET_TOP}px`,
                left: '0px', willChange: 'transform'
            });

            stage.appendChild(el);

            const elWidth = el.offsetWidth;
            const stageWidth = stage.offsetWidth;
            let moveSpeed = CONFIG.SPEED_BASE + (message.length * CONFIG.SPEED_BONUS);
            moveSpeed = Math.min(moveSpeed, CONFIG.MAX_SPEED);

            danmakus.push({
                el: el,
                x: stageWidth,
                speed: moveSpeed,
                width: elWidth
            });

            currentTrack++;
        }

        /**
         * 初始化數據源
         */
        function initSystem() {
            if (document.querySelector('.my-hidden-chat')) return;
            const vID = getVideoId();
            if (!vID) return;

            const mode = detectVideoMode();
            if (!mode) return;

            // 回放版面優化
            if (CONFIG.AUTO_HIDE_REPLAY_PANEL && mode === 'live_chat_replay') {
                const panel = document.getElementById('panels-full-bleed-container');
                if (panel) panel.style.display = 'none';
            }

            const hiddenIframe = document.createElement('iframe');
            hiddenIframe.className = 'my-hidden-chat';
            hiddenIframe.src = `https://www.youtube.com/${mode}?v=${vID}&is_popout=1`;
            Object.assign(hiddenIframe.style, {
                width: '0px', height: '0px', border: 'none', visibility: 'hidden', position: 'absolute'
            });
            document.body.appendChild(hiddenIframe);
        }

        // 監聽彈幕數據消息
        window.addEventListener('message', (e) => {
            if (e.data?.type === 'YT_DANMAKU') {
                const { id, author, message } = e.data;
                if (id && globalProcessedIds.has(id)) return;
                if (id) {
                    globalProcessedIds.add(id);
                    if (globalProcessedIds.size > CONFIG.HISTORY_LIMIT) {
                        const firstKey = globalProcessedIds.values().next().value;
                        globalProcessedIds.delete(firstKey);
                    }
                }
                renderDanmaku(author, message);
            }
        }, false);

        setInterval(initSystem, CONFIG.CHECK_INTERVAL);
    }

    else if (window.location.href.includes('live_chat')) {
        /**
         * 數據源 (iframe) 內部邏輯
         */
        const startChatObserver = () => {
            const chatItems = document.querySelector('#items.yt-live-chat-item-list-renderer');
            if (!chatItems) { setTimeout(startChatObserver, 1000); return; }

            new MutationObserver((mutations) => {
                mutations.forEach(m => m.addedNodes.forEach(node => {
                    if (node.nodeName === 'YT-LIVE-CHAT-TEXT-MESSAGE-RENDERER') {
                        const id = node.getAttribute('id');
                        const msg = node.querySelector('#message')?.innerText;
                        if (id && msg) {
                            window.parent.postMessage({
                                type: 'YT_DANMAKU', id: id,
                                author: node.querySelector('#author-name')?.innerText,
                                message: msg
                            }, '*');
                        }
                    }
                }));
            }).observe(chatItems, { childList: true });
        };
        startChatObserver();
    }
})();