// ==UserScript==
// @name         GIF 重播按钮
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  为页面上的 GIF 图片添加重播按钮
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/554156/GIF%20%E9%87%8D%E6%92%AD%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/554156/GIF%20%E9%87%8D%E6%92%AD%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 已处理的 GIF 图片集合
    const processedGifs = new WeakSet();

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .gif-replay-container {
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 60px;
            pointer-events: none;
            z-index: 9999;
        }

        .gif-replay-button {
            position: absolute;
            top: 8px;
            right: 8px;
            width: 32px;
            height: 32px;
            background: rgba(0, 0, 0, 0.6);
            border: none;
            border-radius: 50%;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.2s, background 0.2s;
            pointer-events: auto;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }

        .gif-replay-button:hover {
            background: rgba(0, 0, 0, 0.8);
        }

        .gif-replay-container:hover .gif-replay-button {
            opacity: 1;
        }

        .gif-replay-button::before {
            content: '';
            width: 0;
            height: 0;
            border-style: solid;
            border-width: 6px 0 6px 10px;
            border-color: transparent transparent transparent #fff;
            margin-left: 2px;
        }

        .gif-replay-button.replaying::before {
            border-width: 8px 0 8px 8px;
            animation: spin 0.5s linear;
        }

        @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }

        /* 确保包含 GIF 的容器有相对定位 */
        .gif-wrapper {
            position: relative;
            display: inline-block;
        }
    `;
    document.head.appendChild(style);

    // 检查是否是 GIF 图片
    function isGif(img) {
        if (!img || !img.src) return false;
        
        // 检查 URL 是否包含 .gif
        const url = img.src.toLowerCase();
        if (url.includes('.gif')) return true;
        
        // 有些 GIF 可能通过 data URL 或其他方式加载，这里不做检测
        return false;
    }

    // 为 GIF 添加重播按钮
    function addReplayButton(img) {
        // 如果已经处理过，跳过
        if (processedGifs.has(img)) return;
        processedGifs.add(img);

        // 确保图片的父元素有相对定位
        let wrapper = img.parentElement;
        const computedStyle = window.getComputedStyle(wrapper);
        
        // 如果父元素没有定位属性，创建一个 wrapper
        if (computedStyle.position === 'static') {
            const newWrapper = document.createElement('div');
            newWrapper.className = 'gif-wrapper';
            img.parentNode.insertBefore(newWrapper, img);
            newWrapper.appendChild(img);
            wrapper = newWrapper;
        }

        // 创建按钮容器
        const container = document.createElement('div');
        container.className = 'gif-replay-container';

        // 创建重播按钮
        const button = document.createElement('button');
        button.className = 'gif-replay-button';
        button.title = '重新播放 GIF';
        
        // 点击事件 - 重新加载 GIF
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // 添加动画效果
            button.classList.add('replaying');
            setTimeout(() => button.classList.remove('replaying'), 500);

            // 重新加载 GIF（通过修改 src 添加时间戳）
            const originalSrc = img.src.split('?')[0]; // 移除现有的查询参数
            const timestamp = new Date().getTime();
            img.src = `${originalSrc}?replay=${timestamp}`;
        });

        container.appendChild(button);
        
        // 将容器添加到图片的父元素
        wrapper.style.position = wrapper.style.position || 'relative';
        wrapper.appendChild(container);
    }

    // 处理页面上所有的 GIF
    function processGifs() {
        const images = document.getElementsByTagName('img');
        for (let img of images) {
            if (isGif(img) && img.complete && img.naturalWidth > 0) {
                addReplayButton(img);
            } else if (isGif(img)) {
                // 如果图片还没加载完，等待加载完成
                img.addEventListener('load', () => addReplayButton(img), { once: true });
            }
        }
    }

    // 监听 DOM 变化，处理动态添加的 GIF
    const observer = new MutationObserver((mutations) => {
        for (let mutation of mutations) {
            for (let node of mutation.addedNodes) {
                if (node.nodeType === 1) { // 元素节点
                    if (node.tagName === 'IMG' && isGif(node)) {
                        if (node.complete && node.naturalWidth > 0) {
                            addReplayButton(node);
                        } else {
                            node.addEventListener('load', () => addReplayButton(node), { once: true });
                        }
                    } else {
                        // 检查新添加节点内的所有图片
                        const imgs = node.getElementsByTagName?.('img') || [];
                        for (let img of imgs) {
                            if (isGif(img)) {
                                if (img.complete && img.naturalWidth > 0) {
                                    addReplayButton(img);
                                } else {
                                    img.addEventListener('load', () => addReplayButton(img), { once: true });
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    // 启动监听
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // 初始处理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', processGifs);
    } else {
        processGifs();
    }

    // 页面完全加载后再处理一次
    window.addEventListener('load', processGifs);
})();
