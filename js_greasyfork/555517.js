// ==UserScript==
// @name         Rule34Video 批量复制视频链接
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  为视频添加选择框以批量复制链接
// @author       您
// @match        https://rule34video.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/555517/Rule34Video%20%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/555517/Rule34Video%20%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 为每个视频添加选择框
    function addCheckboxes() {
        const videos = document.querySelectorAll('.item.thumb.video, [class*="video_"]');
        if (videos.length === 0) {
            console.log('未找到视频元素，请检查选择器:', '.item.thumb.video, [class*="video_"]');
            return;
        }
        videos.forEach(video => {
            if (!video.querySelector('input[type="checkbox"]')) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style.position = 'absolute';
                checkbox.style.top = '5px';
                checkbox.style.left = '12px';
                checkbox.style.zIndex = '1000';
                checkbox.style.transform = 'scale(3)';
                checkbox.style.transformOrigin = 'top left';
                checkbox.style.pointerEvents = 'auto';
                checkbox.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';

                // 优先选择 class="th js-open-popup" 的 a 元素
                const linkElement = video.querySelector('a.th.js-open-popup');
                if (linkElement) {
                    let href = linkElement.href;
                    console.log('原始 href:', href); // 调试：检查 href

                    // 提取视频 ID（支持 /video/ 和 /popup-video/）
                    const idMatch = href.match(/\/(?:video|popup-video)\/(\d+)/);
                    let videoId = idMatch ? idMatch[1] : null;
                    console.log('提取的 videoId:', videoId); // 调试：检查 ID

                    // 提取标题（从 .thumb_title）
                    let title = '';
                    const titleElement = video.querySelector('.thumb_title');
                    if (titleElement) {
                        title = titleElement.textContent.trim()
                            .toLowerCase()
                            .replace(/&/g, 'and')
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/-+/g, '-')
                            .replace(/^-|-$/g, '');
                        console.log('提取的标题:', title); // 调试：检查标题
                    } else {
                        console.log('未找到 .thumb_title 元素:', video);
                    }

                    if (videoId && title) {
                        const link = `https://rule34video.com/video/${videoId}/${title}/`;
                        checkbox.dataset.link = link;
                        console.log('链接已绑定:', link); // 调试：检查链接
                    } else {
                        console.log('未正确提取 ID 或标题:', { videoId, title, href });
                    }
                } else {
                    console.log('未找到 a.th.js-open-popup 元素:', video);
                }

                video.style.position = 'relative';
                const cover = video.querySelector('img') || video.querySelector('.thumbnail');
                if (cover) {
                    cover.style.zIndex = '1';
                }

                video.appendChild(checkbox);
            }
        });
    }

    // 显示自动消失的提示
    function showTemporaryMessage(message) {
        let messageDiv = document.getElementById('tempMessage');
        if (!messageDiv) {
            messageDiv = document.createElement('div');
            messageDiv.id = 'tempMessage';
            messageDiv.style.position = 'fixed';
            messageDiv.style.top = '20px';
            messageDiv.style.left = '50%';
            messageDiv.style.transform = 'translateX(-50%)';
            messageDiv.style.padding = '10px 20px';
            messageDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            messageDiv.style.color = 'white';
            messageDiv.style.borderRadius = '5px';
            messageDiv.style.zIndex = '3000';
            messageDiv.style.fontFamily = 'Arial, sans-serif';
            document.body.appendChild(messageDiv);
        }
        messageDiv.textContent = message;
        messageDiv.style.opacity = '1';
        messageDiv.style.transition = 'opacity 0.5s';

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                if (messageDiv.parentNode) {
                    messageDiv.parentNode.removeChild(messageDiv);
                }
            }, 500);
        }, 2000);
    }

    // 复制选中的链接
    function copySelectedLinks() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        const selectedLinks = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.dataset.link);

        console.log('选中的链接:', selectedLinks);

        if (selectedLinks.length > 0) {
            navigator.clipboard.writeText(selectedLinks.join('\n'))
                .then(() => {
                    console.log('复制成功，内容:', selectedLinks.join('\n'));
                    showTemporaryMessage(`已复制 ${selectedLinks.length} 个链接到剪贴板！`);
                })
                .catch(err => {
                    console.error('复制失败:', err);
                    showTemporaryMessage('复制链接失败，请确保浏览器允许访问剪贴板！');
                });
        } else {
            showTemporaryMessage('未选择任何链接！');
        }
    }

    // 添加复制链接按钮
    function addCopyButton() {
        let button = document.getElementById('copyButton');
        if (!button) {
            button = document.createElement('button');
            button.id = 'copyButton';
            button.innerText = '复制选中链接';
            button.style.margin = '10px';
            button.style.padding = '5px 10px';
            button.style.position = 'fixed';
            button.style.bottom = '10px';
            button.style.right = '10px';
            button.style.zIndex = '2000';
            button.addEventListener('click', copySelectedLinks);
            document.body.appendChild(button);
        }
    }

    // 页面加载时添加选择框和按钮
    window.addEventListener('load', () => {
        addCheckboxes();
        addCopyButton();
    });

    // 监听动态内容
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            if (document.querySelectorAll('input[type="checkbox"]').length < document.querySelectorAll('.item.thumb.video, [class*="video_"]').length) {
                addCheckboxes();
            }
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // 监听滚动事件
    window.addEventListener('scroll', addCheckboxes);

    // 初始运行
    addCheckboxes();
    addCopyButton();
})();