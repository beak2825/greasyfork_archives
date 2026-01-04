// ==UserScript==
// @name         可拖拽调整视频大小 + iframe 字体缩小 - xgplayer (稳定版2)
// @namespace    http://tampermonkey.net/
// @version      1.9
// @author       修越
// @license      修越
// @description  拖动调整视频大小并保存，下次自动恢复；iframe 内 header-bar 字体和高度变小；视频严格填充容器；拖拽方块稳定显示；iframe 文字缩小稳定
// @match        https://douyin-debug.bytedance.net/aweme-debug/landing*
// @match        https://search.bytedance.net/garr/fetch_review/owner_mission/mission_task_list/70068/mission_task_detail/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/560914/%E5%8F%AF%E6%8B%96%E6%8B%BD%E8%B0%83%E6%95%B4%E8%A7%86%E9%A2%91%E5%A4%A7%E5%B0%8F%20%2B%20iframe%20%E5%AD%97%E4%BD%93%E7%BC%A9%E5%B0%8F%20-%20xgplayer%20%28%E7%A8%B3%E5%AE%9A%E7%89%882%29.user.js
// @updateURL https://update.greasyfork.org/scripts/560914/%E5%8F%AF%E6%8B%96%E6%8B%BD%E8%B0%83%E6%95%B4%E8%A7%86%E9%A2%91%E5%A4%A7%E5%B0%8F%20%2B%20iframe%20%E5%AD%97%E4%BD%93%E7%BC%A9%E5%B0%8F%20-%20xgplayer%20%28%E7%A8%B3%E5%AE%9A%E7%89%882%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const STORAGE_KEY = 'video-left-size';

    // ---------------------------
    // 拖拽逻辑
    // ---------------------------
    function initResizerDrag(resizer, videoDiv) {
        const videoTag = videoDiv.querySelector('#video-tag');
        const xgPlayer = videoDiv.querySelector('.xgplayer');

        // 恢复上次保存的尺寸
        const savedSize = localStorage.getItem(STORAGE_KEY);
        if (savedSize) {
            try {
                const { width, height } = JSON.parse(savedSize);
                setSize(width, height);
            } catch(e) {}
        }

        function setSize(width, height) {
            videoDiv.style.width = width + 'px';
            videoDiv.style.height = height + 'px';

            if (videoTag) {
                videoTag.style.width = '100%';
                videoTag.style.height = '100%';
                videoTag.style.maxWidth = '100%';
                videoTag.style.maxHeight = '100%';
                videoTag.style.margin = '0';
                videoTag.style.padding = '0';
                videoTag.style.boxSizing = 'border-box';

                const controls = videoTag.querySelector('.xgplayer-controls');
                if (controls) {
                    controls.style.width = '100%';
                    controls.style.bottom = '0';
                }
            }

            if (xgPlayer) {
                xgPlayer.style.width = '100%';
                xgPlayer.style.height = '100%';
                xgPlayer.style.maxWidth = '100%';
                xgPlayer.style.maxHeight = '100%';
                xgPlayer.style.margin = '0';
                xgPlayer.style.padding = '0';
                xgPlayer.style.boxSizing = 'border-box';
            }

            updateResizerPosition();
        }

        function updateResizerPosition() {
            resizer.style.left = (videoDiv.clientWidth - resizer.offsetWidth) + 'px';
            resizer.style.top = (videoDiv.clientHeight - resizer.offsetHeight) + 'px';
        }

        let isResizing = false;

        resizer.addEventListener('mousedown', function(e) {
            isResizing = true;
            e.preventDefault();
        });

        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;
            const rect = videoDiv.getBoundingClientRect();
            let newWidth = e.clientX - rect.left;
            let newHeight = e.clientY - rect.top;

            // 限制最小尺寸
            newWidth = Math.max(newWidth, 100);
            newHeight = Math.max(newHeight, 56);

            setSize(newWidth, newHeight);
        });

        document.addEventListener('mouseup', function() {
            if (isResizing) {
                isResizing = false;
                localStorage.setItem(STORAGE_KEY, JSON.stringify({
                    width: parseInt(videoDiv.style.width),
                    height: parseInt(videoDiv.style.height)
                }));
            }
        });

        updateResizerPosition();
    }

    // ---------------------------
    // 保证拖拽方块存在
    // ---------------------------
    function ensureResizer(rootDoc) {
        const videoDiv = rootDoc.querySelector('.video-left-SDhr23');
        if (!videoDiv) return;

        let resizer = videoDiv.querySelector('.custom-resizer');
        if (!resizer) {
            resizer = rootDoc.createElement('div');
            resizer.className = 'custom-resizer';
            resizer.style.width = '10px';
            resizer.style.height = '10px';
            resizer.style.background = 'rgba(0,0,0,0.5)';
            resizer.style.position = 'absolute';
            resizer.style.cursor = 'se-resize';
            resizer.style.zIndex = '99999';
            videoDiv.style.position = 'relative';
            videoDiv.appendChild(resizer);

            initResizerDrag(resizer, videoDiv);
        }
    }

    // ---------------------------
    // 监听 DOM 变化，保持拖拽方块
    // ---------------------------
    function observeResizer(rootDoc) {
        const observer = new MutationObserver(() => {
            ensureResizer(rootDoc);
        });
        observer.observe(rootDoc.body, { childList: true, subtree: true });
    }

    // ---------------------------
    // iframe 内 header-bar 字体缩小（稳定版）
    // ---------------------------
    function shrinkHeaderTextInIframe(rootDoc) {
        function applyStyle(headerDiv) {
            if (!headerDiv.classList.contains('custom-shrinked')) {
                headerDiv.style.fontSize = '12px';
                headerDiv.style.lineHeight = '14px';
                headerDiv.style.height = 'auto';
                headerDiv.style.padding = '2px 0';
                headerDiv.classList.add('custom-shrinked');
            }
        }

        const headerDiv = rootDoc.querySelector('.header-bar-kWzUvv');
        if (headerDiv) applyStyle(headerDiv);

        const observer = new MutationObserver(() => {
            const header = rootDoc.querySelector('.header-bar-kWzUvv');
            if (header) applyStyle(header);
        });

        observer.observe(rootDoc.body, { childList: true, subtree: true });
    }

    // ---------------------------
    // 初始化
    // ---------------------------
    function init(rootDoc) {
        ensureResizer(rootDoc);
        observeResizer(rootDoc);

        if (rootDoc !== window.top.document) {
            shrinkHeaderTextInIframe(rootDoc);
        }
    }

    setTimeout(() => {
        init(document);
    }, 1000);

})();
