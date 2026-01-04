// ==UserScript==
// @name         文本链接转换超链接
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  自动识别页面中的文本链接并转换为可点击的超链接
// @author       Assistant
// @match        *://*/*
// @grant        none
// @license MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557819/%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E8%B6%85%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/557819/%E6%96%87%E6%9C%AC%E9%93%BE%E6%8E%A5%E8%BD%AC%E6%8D%A2%E8%B6%85%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试开关
    const DEBUG = false;

    /**
     * 日志函数
     */
    function log(message, level = 'info') {
        if (DEBUG) {
            console.log(`[文本链接转换器] ${level.toUpperCase()}: ${message}`);
        }
    }

    /**
     * 检查元素是否为可见文本节点
     * @param {Element} element - 要检查的DOM元素
     * @returns {boolean} 是否为可见元素
     */
    function isVisible(element) {
        // 检查元素是否存在
        if (!element) return false;

        // 检查是否为script或style标签
        if (element.tagName === 'SCRIPT' || element.tagName === 'STYLE') {
            return false;
        }

        // 检查display样式
        const style = window.getComputedStyle(element);
        if (style.display === 'none' || style.visibility === 'hidden') {
            return false;
        }

        // 检查offsetParent（排除通过opacity:0或position:absolute;left:-9999px等方式隐藏的元素）
        if (element.offsetParent === null && style.position !== 'fixed') {
            return false;
        }

        return true;
    }

    /**
     * 改进的URL正则表达式，匹配更多类型的链接
     * 匹配以http://或https://开头的有效URL
     */
    const urlRegex = /\b(https?:\/\/[^\s<>"]{4,})\b/gi;

    /**
     * 测试用的文本，用于验证正则表达式
     */
    function testRegex() {
        const testTexts = [
            "https://www.google.com",
            "http://example.com/path",
            "https://github.com/user/repo",
            "https://www.bilibili.com/video/BV1234567890"
        ];

        log('开始测试URL正则表达式...');
        testTexts.forEach(text => {
            const matches = text.match(urlRegex);
            log(`测试文本: ${text}, 匹配结果: ${matches ? matches.join(', ') : '无匹配'}`);
        });
        log('URL正则表达式测试完成');
    }

    /**
     * 检查节点是否已被处理过（避免重复处理）
     * @param {Node} node - 要检查的节点
     * @returns {boolean} 是否已处理过
     */
    function isProcessed(node) {
        if (node.nodeType !== Node.ELEMENT_NODE) return false;
        return node.hasAttribute && node.hasAttribute('data-link-converted');
    }

    /**
     * 创建带有样式的链接元素
     * @param {string} url - URL地址
     * @param {string} originalText - 原始文本
     * @returns {HTMLAnchorElement} 创建的链接元素
     */
    function createStyledLink(url, originalText) {
        try {
            if (!url || !originalText) {
                log('createStyledLink: 无效的参数', 'error');
                return document.createTextNode(originalText || url || '');
            }

            const link = document.createElement('a');
            link.href = url;
            link.textContent = originalText;
            link.target = '_blank'; // 在新标签页中打开
            link.rel = 'noopener noreferrer'; // 安全性考虑
            link.style.textDecoration = 'underline'; // 添加下划线以区分链接
            link.style.color = '#0066cc'; // 使用蓝色链接色

            // 标记为已转换，避免重复处理
            link.setAttribute('data-link-converted', 'true');

            log(`创建链接: ${url.substring(0, 50)}...`);
            return link;
        } catch (error) {
            log(`创建链接时出错: ${error.message}`, 'error');
            return document.createTextNode(originalText || url || '');
        }
    }

    /**
     * 处理文本节点，查找并替换其中的URL链接
     * @param {Text} textNode - 要处理的文本节点
     */
    function processTextNode(textNode) {
        try {
            if (!textNode || !textNode.textContent) {
                return;
            }

            const text = textNode.textContent.trim();

            // 跳过太短的文本
            if (text.length < 8) {
                return;
            }

            // 调试：记录包含http的文本
            if (text.toLowerCase().includes('http')) {
                log(`发现包含http的文本: ${text.substring(0, 100)}...`);
            }

            const matches = text.match(urlRegex);

            if (!matches || matches.length === 0) {
                return; // 没有找到URL，直接返回
            }

            log(`在文本中找到 ${matches.length} 个URL: ${matches.join(', ')}`);

            let lastIndex = 0;
            const fragment = document.createDocumentFragment();

            for (const match of matches) {
                const url = match;
                const urlIndex = text.indexOf(url, lastIndex);

                // 添加URL之前的文本
                if (urlIndex > lastIndex) {
                    const beforeText = text.substring(lastIndex, urlIndex);
                    fragment.appendChild(document.createTextNode(beforeText));
                }

                const parentElement = textNode.parentElement;

                // 检查父元素是否已被处理过
                if (isProcessed(parentElement)) {
                    fragment.appendChild(document.createTextNode(url));
                } else {
                    // 创建带样式的链接
                    const link = createStyledLink(url, url);
                    fragment.appendChild(link);
                }

                lastIndex = urlIndex + url.length;
            }

            // 添加剩余的文本
            if (lastIndex < text.length) {
                const remainingText = text.substring(lastIndex);
                fragment.appendChild(document.createTextNode(remainingText));
            }

            // 替换原文本节点
            if (fragment.childNodes.length > 0 && textNode.parentNode) {
                textNode.parentNode.replaceChild(fragment, textNode);
                log(`成功转换文本节点中的 ${matches.length} 个链接`);
            }
        } catch (error) {
            log(`处理文本节点时出错: ${error.message}`, 'error');
        }
    }

    /**
     * 递归遍历DOM树，处理所有可见的文本节点
     * @param {Node} node - 当前处理的节点
     */
    function traverseDOM(node) {
        try {
            if (!node) {
                return;
            }

            // 跳过已处理的链接
            if (isProcessed(node)) {
                return;
            }

            // 跳过script和style标签
            if (node.nodeType === Node.ELEMENT_NODE &&
                (node.tagName === 'SCRIPT' || node.tagName === 'STYLE' || node.tagName === 'NOSCRIPT')) {
                return;
            }

            // 检查元素是否可见
            if (node.nodeType === Node.ELEMENT_NODE && !isVisible(node)) {
                return;
            }

            // 如果是文本节点且有内容，处理其中的URL
            if (node.nodeType === Node.TEXT_NODE && node.textContent && node.textContent.trim()) {
                processTextNode(node);
                return;
            }

            // 递归处理子节点
            if (node.childNodes && node.childNodes.length > 0) {
                // 使用静态快照，避免在遍历过程中DOM变化导致的问题
                const children = Array.from(node.childNodes);
                for (const child of children) {
                    traverseDOM(child);
                }
            }
        } catch (error) {
            log(`遍历DOM时出错: ${error.message}`, 'error');
        }
    }

    /**
     * 观察DOM变化，动态处理新增内容
     */
    function observeChanges() {
        try {
            if (!document.body) {
                log('无法创建DOM观察器：document.body不存在', 'error');
                return null;
            }

            const observer = new MutationObserver(function(mutations) {
                try {
                    mutations.forEach(function(mutation) {
                        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                            mutation.addedNodes.forEach(function(node) {
                                // 只处理元素节点和文本节点
                                if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                                    // 延迟处理，避免在DOM变化过程中处理
                                    setTimeout(() => traverseDOM(node), 100);
                                }
                            });
                        }
                    });
                } catch (error) {
                    log(`处理DOM变化时出错: ${error.message}`, 'error');
                }
            });

            // 配置观察器
            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: false,
                characterData: false
            });

            log('DOM变化观察器已启动');
            return observer;
        } catch (error) {
            log(`创建DOM观察器时出错: ${error.message}`, 'error');
            return null;
        }
    }

    /**
     * 初始化函数
     */
    function init() {
        try {
            log('开始初始化文本链接转换器');

            // 等待页面完全加载
            if (document.readyState !== 'complete' && document.readyState !== 'interactive') {
                log(`页面状态: ${document.readyState}，等待加载完成`);
                if (document.readyState === 'loading') {
                    document.addEventListener('DOMContentLoaded', function() {
                        setTimeout(init, 500);
                    });
                } else {
                    window.addEventListener('load', function() {
                        setTimeout(init, 500);
                    });
                }
                return;
            }

            // 检查document.body是否存在
            if (!document.body) {
                log('document.body不存在，延迟初始化', 'warn');
                setTimeout(init, 1000);
                return;
            }

            log('开始处理页面链接');

            // 测试正则表达式
            testRegex();

            // 开始遍历DOM树
            traverseDOM(document.body);

            // 启动DOM变化观察器
            const observer = observeChanges();
            if (observer) {
                // 在页面卸载时停止观察
                window.addEventListener('beforeunload', function() {
                    try {
                        observer.disconnect();
                        log('停止DOM变化观察器');
                    } catch (e) {
                        log(`停止观察器时出错: ${e.message}`, 'error');
                    }
                });
            }

            log('文本链接转换器初始化完成');
        } catch (error) {
            log(`初始化过程中出错: ${error.message}`, 'error');
            log(`错误堆栈: ${error.stack}`, 'error');
        }
    }

    // 立即启动脚本，或者延迟启动
    try {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
        } else {
            // 页面已加载，直接初始化
            setTimeout(init, 100);
        }
    } catch (error) {
        log(`启动脚本时出错: ${error.message}`, 'error');
    }

    // 创建测试按钮（仅在用户配置中启用时）
    if (window.location.href.includes('link-converter-test=true')) {
        setTimeout(() => {
            try {
                const testBtn = document.createElement('button');
                testBtn.textContent = '添加测试链接';
                testBtn.style.position = 'fixed';
                testBtn.style.top = '10px';
                testBtn.style.right = '10px';
                testBtn.style.zIndex = '99999';
                testBtn.style.background = '#4CAF50';
                testBtn.style.color = 'white';
                testBtn.style.border = 'none';
                testBtn.style.padding = '10px';
                testBtn.style.borderRadius = '5px';
                testBtn.style.cursor = 'pointer';

                testBtn.onclick = function() {
                    const testDiv = document.createElement('div');
                    testDiv.innerHTML = '这里有一些测试链接：<br>' +
                        '1. https://www.google.com<br>' +
                        '2. http://github.com/test<br>' +
                        '3. https://www.bilibili.com/video/BV1234567890<br>' +
                        '4. http://example.com/path/to/resource';
                    testDiv.style.position = 'fixed';
                    testDiv.style.top = '60px';
                    testDiv.style.right = '10px';
                    testDiv.style.background = 'white';
                    testDiv.style.border = '1px solid #ccc';
                    testDiv.style.padding = '15px';
                    testDiv.style.borderRadius = '5px';
                    testDiv.style.zIndex = '99999';
                    testDiv.style.maxWidth = '400px';

                    document.body.appendChild(testDiv);

                    // 处理新添加的内容
                    setTimeout(() => traverseDOM(testDiv), 100);
                };

                document.body.appendChild(testBtn);
                log('测试按钮已添加到页面');
            } catch (e) {
                log(`创建测试按钮失败: ${e.message}`, 'error');
            }
        }, 1000);
    }

})();