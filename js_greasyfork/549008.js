// ==UserScript==
// @name         修改百度网盘视频宽度
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修改视频播放区域的宽度，使其完全贴合视频的大小
// @author       woshilisisui
// @match        https://pan.baidu.com/pfile/video?path=*
// @icon         https://th.bing.com/th?id=ODLS.039b3eb8-253e-4d80-8727-6e7d039c3891&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/549008/%E4%BF%AE%E6%94%B9%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%AE%BD%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/549008/%E4%BF%AE%E6%94%B9%E7%99%BE%E5%BA%A6%E7%BD%91%E7%9B%98%E8%A7%86%E9%A2%91%E5%AE%BD%E5%BA%A6.meta.js
// ==/UserScript==


(function() {
    'use strict';

    function waitForElement(selector, callback) {
        const el = document.querySelector(selector);
        if (el) {
            callback(el);
        } else {
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    callback(el);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    waitForElement('video.vjs-tech', (video) => {
        waitForElement('.drager_col', (dragerCol) => {
            const leftDiv = dragerCol.querySelector('.drager_left');
            const rightDiv = dragerCol.querySelector('.drager_right');
            const sliderCol = dragerCol.querySelector('.slider_col');

            if (!leftDiv || !rightDiv || !sliderCol) return;

            // 确保父容器是 flex
            if (getComputedStyle(dragerCol).display !== 'flex') {
                dragerCol.style.display = 'flex';
                dragerCol.style.flexDirection = 'row';
                dragerCol.style.alignItems = 'stretch';
            }

            // ----------------------
            // 自动布局函数
            // ----------------------
            function autoLayout() {
                const videoHeight = video.clientHeight || video.offsetHeight;
                const containerWidth = dragerCol.clientWidth || window.innerWidth;

                // 获取右栏 min-width
                const rightMinWidth = parseFloat(getComputedStyle(rightDiv).minWidth) || 0;

                if (videoHeight > 0 && containerWidth > 0) {
                    // 理想左栏宽度（16:9）
                    let idealLeftWidth = videoHeight * (16 / 9) + 0.15;

                    // 检查剩余空间
                    const remainingWidth = containerWidth - idealLeftWidth;
                    if (remainingWidth < rightMinWidth) {
                        const maxLeftWidth = containerWidth - rightMinWidth;
                        idealLeftWidth = Math.max(maxLeftWidth, 0);
                    }

                    // clamp 左栏不能小于50%
                    const minLeftWidth = containerWidth * 0.5;
                    if (idealLeftWidth < minLeftWidth) {
                        idealLeftWidth = minLeftWidth;
                    }

                    const leftPercent = (idealLeftWidth / containerWidth) * 100;

                    leftDiv.style.flex = `0 0 ${leftPercent}%`;
                    leftDiv.style.width = `${leftPercent}%`;

                    rightDiv.style.flexGrow = '1';
                    rightDiv.style.flexShrink = '1';
                }
            }

            autoLayout();

            // 视频元数据加载完成
            video.addEventListener('loadedmetadata', autoLayout);

            // 窗口大小变化
            window.addEventListener('resize', autoLayout);

            // ----------------------
            // 拖动 slider_col 调节左右宽度
            // ----------------------
            let isDragging = false;

            sliderCol.style.cursor = 'col-resize'; // 鼠标样式

            sliderCol.addEventListener('mousedown', (e) => {
                e.preventDefault();
                isDragging = true;
                document.body.style.userSelect = 'none'; // 拖动时禁选
            });

            window.addEventListener('mousemove', (e) => {
                if (!isDragging) return;

                const containerRect = dragerCol.getBoundingClientRect();
                const containerWidth = containerRect.width;
                const rightMinWidth = parseFloat(getComputedStyle(rightDiv).minWidth) || 0;

                // 鼠标位置相对于容器左侧
                let newLeftWidth = e.clientX - containerRect.left;

                // Clamp：保证右侧 min-width
                if (containerWidth - newLeftWidth < rightMinWidth) {
                    newLeftWidth = containerWidth - rightMinWidth;
                }

                // Clamp：保证左侧最小50%
                const minLeftWidth = containerWidth * 0.5;
                if (newLeftWidth < minLeftWidth) {
                    newLeftWidth = minLeftWidth;
                }

                const leftPercent = (newLeftWidth / containerWidth) * 100;

                leftDiv.style.flex = `0 0 ${leftPercent}%`;
                leftDiv.style.width = `${leftPercent}%`;
            });

            window.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    document.body.style.userSelect = ''; // 恢复可选中
                }
            });
        });
    });

    // 隐藏 AI 笔记区域
    function hideNote() {
        const note = document.querySelector('.vp-ai-note-aside');
        if (note) {
            note.style.display = 'none';
        }
    }

    hideNote();
    const observer = new MutationObserver(hideNote);
    observer.observe(document.body, { childList: true, subtree: true });

})();