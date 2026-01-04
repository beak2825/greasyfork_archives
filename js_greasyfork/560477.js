// ==UserScript==

// @name         磁力链接转复制

// @namespace    https://github.com/

// @version      1.0.0

// @description  阻止Safari浏览器打开磁力链接，改为复制到剪贴板，并显示成功通知

// @author       Saem

// @match        *://*/*

// @grant        none

// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/560477/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/560477/%E7%A3%81%E5%8A%9B%E9%93%BE%E6%8E%A5%E8%BD%AC%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {

    'use strict';

    

    // 添加自定义样式

    const style = document.createElement('style');

    style.textContent = `

        .magnet-clickable {

            cursor: pointer;

            color: #0066cc;

            text-decoration: underline;

            transition: all 0.2s ease;

        }

        .magnet-clickable:hover {

            color: #ff6600;

            text-decoration: none;

        }

        .magnet-clickable.copied {

            color: #00aa00;

            font-weight: bold;

        }

        .magnet-notification {

            position: fixed;

            top: 20px;

            right: 20px;

            padding: 12px 20px;

            background: #4CAF50;

            color: white;

            border-radius: 8px;

            box-shadow: 0 4px 12px rgba(0,0,0,0.2);

            z-index: 999999;

            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

            font-size: 14px;

            max-width: 300px;

            opacity: 0;

            transform: translateX(100px);

            animation: magnet-notification-slide-in 0.3s forwards, magnet-notification-fade-out 0.5s 2s forwards;

        }

        @keyframes magnet-notification-slide-in {

            to {

                opacity: 1;

                transform: translateX(0);

            }

        }

        @keyframes magnet-notification-fade-out {

            to {

                opacity: 0;

                transform: translateX(100px);

            }

        }

    `;

    document.head.appendChild(style);

    

    // 磁力链接正则表达式

    const magnetRegex = /magnet:\?xt=urn:[a-z0-9]+:[a-z0-9]{32,}/gi;

    

    // 显示通知

    function showNotification(message) {

        // 移除之前的通知

        const oldNotification = document.querySelector('.magnet-notification');

        if (oldNotification) {

            oldNotification.remove();

        }

        

        // 创建新通知

        const notification = document.createElement('div');

        notification.className = 'magnet-notification';

        notification.textContent = message;

        document.body.appendChild(notification);

        

        // 2秒后自动移除

        setTimeout(() => {

            if (notification.parentNode) {

                notification.remove();

            }

        }, 2000);

    }

    

    // 复制到剪贴板（iOS兼容版本）

    function copyToClipboard(text, element) {

        // 创建临时输入框

        const tempInput = document.createElement('input');

        tempInput.value = text;

        tempInput.style.position = 'fixed';

        tempInput.style.opacity = '0';

        tempInput.style.pointerEvents = 'none';

        tempInput.style.left = '-1000px';

        document.body.appendChild(tempInput);

        

        // 选中文本

        tempInput.select();

        tempInput.setSelectionRange(0, 99999); // 对于移动设备

        

        try {

            // 尝试复制

            const successful = document.execCommand('copy');

            

            if (successful) {

                // 显示通知

                showNotification('✅磁力链接已复制');

                

                // 视觉反馈

                if (element) {

                    const originalText = element.textContent;

                    const originalClass = element.className;

                    

                    element.textContent = '✅';

                    element.className = originalClass + ' copied';

                    

                    setTimeout(() => {

                        element.textContent = originalText;

                        element.className = originalClass;

                    }, 1000);

                }

            } else {

                showNotification('复制失败，请长按链接手动复制');

            }

        } catch (err) {

            console.error('复制失败:', err);

            showNotification('复制失败，请长按链接手动复制');

        }

        

        // 移除临时输入框

        document.body.removeChild(tempInput);

    }

    

    // 创建iOS兼容的点击事件处理

    function handleMagnetClick(e, magnetUrl, element) {

        e.preventDefault();

        e.stopPropagation();

        

        // 在iOS上，我们需要阻止默认的链接打开行为

        if (e.cancelable) {

            e.preventDefault();

        }

        

        // 复制到剪贴板

        copyToClipboard(magnetUrl, element);

        

        return false;

    }

    

    // 处理链接元素

    function processLinkElement(link) {

        if (link.href && link.href.match(magnetRegex)) {

            // 标记为已处理

            link.setAttribute('data-magnet-processed', 'true');

            

            // 添加可点击样式

            link.classList.add('magnet-clickable');

            

            // 保存原始href

            const magnetUrl = link.href;

            

            // 移除原有事件监听器

            const newLink = link.cloneNode(true);

            link.parentNode.replaceChild(newLink, link);

            

            // 添加新的点击事件

            newLink.addEventListener('click', function(e) {

                handleMagnetClick(e, magnetUrl, this);

            });

            

            // 对于iOS，还需要处理touch事件

            newLink.addEventListener('touchend', function(e) {

                handleMagnetClick(e, magnetUrl, this);

            });

            

            // 添加标题提示

            newLink.title = '点击复制磁力链接（iOS用户请点击这里）';

            

            return newLink;

        }

        return link;

    }

    

    // 处理文本节点中的磁力链接

    function processTextNode(textNode) {

        if (!textNode.nodeValue || textNode.nodeValue.trim() === '') {

            return false;

        }

        

        const matches = [...textNode.nodeValue.matchAll(magnetRegex)];

        if (matches.length === 0) {

            return false;

        }

        

        const parent = textNode.parentNode;

        if (!parent || parent.tagName === 'SCRIPT' || parent.tagName === 'STYLE' || parent.tagName === 'TEXTAREA') {

            return false;

        }

        

        // 如果已经是链接，跳过

        if (parent.tagName === 'A' && parent.href) {

            return false;

        }

        

        // 创建文档片段

        const fragment = document.createDocumentFragment();

        let lastIndex = 0;

        

        matches.forEach(match => {

            const matchText = match[0];

            const matchIndex = match.index;

            

            // 添加匹配前的文本

            if (matchIndex > lastIndex) {

                fragment.appendChild(

                    document.createTextNode(textNode.nodeValue.substring(lastIndex, matchIndex))

                );

            }

            

            // 创建可点击的链接元素

            const link = document.createElement('a');

            link.href = matchText;

            link.textContent = matchText;

            link.classList.add('magnet-clickable');

            link.title = '点击复制磁力链接（iOS用户请点击这里）';

            

            // 添加点击事件

            link.addEventListener('click', function(e) {

                handleMagnetClick(e, matchText, this);

            });

            

            // 对于iOS，还需要处理touch事件

            link.addEventListener('touchend', function(e) {

                handleMagnetClick(e, matchText, this);

            });

            

            fragment.appendChild(link);

            lastIndex = matchIndex + matchText.length;

        });

        

        // 添加剩余的文本

        if (lastIndex < textNode.nodeValue.length) {

            fragment.appendChild(

                document.createTextNode(textNode.nodeValue.substring(lastIndex))

            );

        }

        

        // 替换原始文本节点

        parent.replaceChild(fragment, textNode);

        

        return true;

    }

    

    // 扫描并处理所有磁力链接

    function scanAndProcessMagnets() {

        // 处理已有的磁力链接

        const allLinks = document.querySelectorAll('a[href^="magnet:"]');

        allLinks.forEach(link => {

            if (!link.hasAttribute('data-magnet-processed')) {

                processLinkElement(link);

            }

        });

        

        // 遍历文本节点查找磁力链接

        const walker = document.createTreeWalker(

            document.body,

            NodeFilter.SHOW_TEXT,

            {

                acceptNode: function(node) {

                    // 跳过脚本、样式等元素内的文本

                    if (node.parentNode.tagName === 'SCRIPT' || 

                        node.parentNode.tagName === 'STYLE' ||

                        node.parentNode.tagName === 'TEXTAREA') {

                        return NodeFilter.FILTER_REJECT;

                    }

                    

                    // 检查是否包含磁力链接

                    if (node.nodeValue && magnetRegex.test(node.nodeValue)) {

                        return NodeFilter.FILTER_ACCEPT;

                    }

                    

                    return NodeFilter.FILTER_REJECT;

                }

            }

        );

        

        const textNodes = [];

        let node = walker.nextNode();

        while (node) {

            textNodes.push(node);

            node = walker.nextNode();

        }

        

        // 处理文本节点

        textNodes.forEach(textNode => {

            processTextNode(textNode);

        });

    }

    

    // 观察DOM变化

    function observeDOM() {

        const observer = new MutationObserver(function(mutations) {

            // 延迟处理，避免频繁触发

            clearTimeout(window.magnetScanTimeout);

            window.magnetScanTimeout = setTimeout(() => {

                scanAndProcessMagnets();

            }, 300);

        });

        

        observer.observe(document.body, {

            childList: true,

            subtree: true

        });

        

        return observer;

    }

    

    // 初始化

    function init() {

        // 页面加载完成后开始扫描

        if (document.readyState === 'loading') {

            document.addEventListener('DOMContentLoaded', function() {

                // 初始扫描

                scanAndProcessMagnets();

                // 开始观察DOM变化

                observeDOM();

            });

        } else {

            // 页面已加载，立即扫描

            scanAndProcessMagnets();

            observeDOM();

        }

        

        // 页面完全加载后再次扫描

        window.addEventListener('load', function() {

            setTimeout(scanAndProcessMagnets, 1000);

        });

        

        // 处理iOS Safari的特殊情况

        if (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) {

            // 添加iOS特定样式

            const iosStyle = document.createElement('style');

            iosStyle.textContent = `

                .magnet-clickable {

                    -webkit-tap-highlight-color: rgba(0, 102, 204, 0.3);

                }

                .magnet-clickable:active {

                    background-color: rgba(0, 102, 204, 0.1);

                }

            `;

            document.head.appendChild(iosStyle);

        }

    }

    

    // 启动脚本

    init();

    

})();

