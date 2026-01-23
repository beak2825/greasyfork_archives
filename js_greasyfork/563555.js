// ==UserScript==
// @name         BI-UPDATE-USER
// @version      2026-01-21
// @description  update username
// @author       You
// @match        https://bi.xiaoeknow.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA0AAAANCAYAAABy6+R8AAAA7ElEQVQokX3SIUsEQQCG4WfPuyIm0WDSblwOk/9AQU3CIYg2wbb/wm02wWIQm2Iyn0HDbRFFowgGLSLYLozh9mR2ce8rw7x8Lwwfk4QQxEnyYh49LOIDFyFLXyudWEryYg4PWIg6P+iGLH0Zg5ZqdmoCzOAgBnVpyf+p8Lo01SC1Gi/oN0i3k6RLPNXYJ04apZClQ2zgsURvWA9Z+hX3/iZP8iLBGmZxhmU8YxfvIUtvKlKSFys4Rhff2MI1NnGFadzjMGTpIHE0SHGHTvSCU+zh3Oh3jDPEaruEsQD75dmr8Q6220Zz1leclP4vfJo95Z2chEkAAAAASUVORK5CYII=
// @run-at       document-end
// @grant        none
// @license MIT
// @namespace https://greasyfork.org/users/878840
// @downloadURL https://update.greasyfork.org/scripts/563555/BI-UPDATE-USER.user.js
// @updateURL https://update.greasyfork.org/scripts/563555/BI-UPDATE-USER.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. 用户名替换功能
    const targetElement = document.querySelector('#user_center > span');

    if (targetElement && targetElement.textContent.includes('jimmychen')) {
        targetElement.textContent = targetElement.textContent.replace(/jimmychen/g, 'guzhzogu');
        console.log('文本替换完成：jimmychen → guzhzogu');
    }

    // 2. 背景图片替换功能
    const base64Image = 'data:image/png;base64,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';

    const processedElements = new WeakSet();

    function replaceBackgroundImages() {
        const allElements = document.querySelectorAll('*');

        allElements.forEach(element => {
            // 排除img标签
            if (['img', 'i', 'span'].includes(element.tagName.toLowerCase())) {
                return;
            }

            // 检查是否已处理
            if (processedElements.has(element)) {
                return;
            }

            // 获取计算样式
            const style = window.getComputedStyle(element);

            // 检查background-image属性
            if (style.backgroundImage &&
                style.backgroundImage !== 'none' &&
                style.backgroundImage !== 'inherit' &&
                style.backgroundImage !== 'initial' &&
                style.backgroundImage !== 'unset' &&
                !style.backgroundImage.includes(base64Image)) {

                // 保存原始背景图片（可选，用于调试）
                if (!element.hasAttribute('data-original-bg')) {
                    element.setAttribute('data-original-bg', style.backgroundImage);
                }

                // 替换背景图片
                element.style.backgroundImage = `url(${base64Image})`;
                processedElements.add(element);
                element.setAttribute('data-bg-replaced', 'true');

                console.log('替换背景图片:', element.tagName, element.className || element.id);
            }

            // 检查内联样式（优先级高于计算样式）
            const inlineBg = element.style.backgroundImage;
            if (inlineBg &&
                inlineBg !== 'none' &&
                !inlineBg.includes(base64Image) &&
                !element.hasAttribute('data-inline-skipped')) {

                // 标记为已跳过内联样式替换（如果需要保留内联样式）
                element.setAttribute('data-inline-skipped', 'true');
            }
        });
    }

    // 初始执行
    replaceBackgroundImages();

    // 动态内容监控
    const observer = new MutationObserver((mutationsList) => {
        let shouldReplace = false;

        for (let mutation of mutationsList) {
            // 新增节点
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach(node => {
                    // 排除script, style等标签
                    if (node.nodeType === 1 &&
                        node.tagName &&
                        node.tagName.toLowerCase() !== 'img' &&
                        node.tagName.toLowerCase() !== 'script' &&
                        node.tagName.toLowerCase() !== 'style' &&
                        node.tagName.toLowerCase() !== 'link') {
                        shouldReplace = true;
                    }
                });
            }

            // 样式或类名变化
            if (mutation.type === 'attributes' &&
                (mutation.attributeName === 'style' || mutation.attributeName === 'class')) {
                shouldReplace = true;
            }
        }

        if (shouldReplace) {
            setTimeout(replaceBackgroundImages, 100);
        }
    });

    // 开始监控DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // 监控样式表变化
    const styleObserver = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeName === 'STYLE') {
                        // 延迟执行，确保样式已加载
                        setTimeout(replaceBackgroundImages, 200);
                    } else if (node.nodeName === 'LINK' &&
                               node.getAttribute('rel') === 'stylesheet') {
                        // 等待外部样式表加载
                        node.addEventListener('load', () => {
                            setTimeout(replaceBackgroundImages, 200);
                        });
                    }
                });
            }
        });
    });

    styleObserver.observe(document.head, {
        childList: true,
        subtree: false
    });

    // 响应窗口大小变化（某些响应式设计会改变背景）
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            replaceBackgroundImages();
        }, 200);
    });

    // 页面可见性变化
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            setTimeout(replaceBackgroundImages, 300);
        }
    });

    console.log('脚本已启动：用户名替换和背景图片替换功能（已排除img标签）');

    // 5分钟后停止监控以节省性能
    setTimeout(() => {
        observer.disconnect();
        styleObserver.disconnect();
        console.log('背景图片监控已停止');
    }, 300000);

    // 3. 增强用户名替换功能（监控动态加载）
    function monitorUsernameChange() {
        const usernameElement = document.querySelector('#user_center > span');
        if (usernameElement && usernameElement.textContent.includes('jimmychen')) {
            usernameElement.textContent = usernameElement.textContent.replace(/jimmychen/g, 'guzhzogu');
            console.log('用户名动态替换完成');
        }
    }

    // 初始检查用户名
    monitorUsernameChange();

    // 监控用户名元素变化
    const usernameElement = document.querySelector('#user_center');
    if (usernameElement) {
        const usernameObserver = new MutationObserver(() => {
            setTimeout(monitorUsernameChange, 100);
        });

        usernameObserver.observe(usernameElement, {
            childList: true,
            characterData: true,
            subtree: true
        });
    }

})();