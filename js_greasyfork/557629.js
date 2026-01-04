// ==UserScript==
// @name         调用deepseek将粤语转普通话
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在discuss.com.hk网站上自动将粤语文本翻译成普通话，并添加红色横线样式
// @author       You
// @match        https://www.discuss.com.hk/viewthread.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discuss.com.hk
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/557629/%E8%B0%83%E7%94%A8deepseek%E5%B0%86%E7%B2%A4%E8%AF%AD%E8%BD%AC%E6%99%AE%E9%80%9A%E8%AF%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/557629/%E8%B0%83%E7%94%A8deepseek%E5%B0%86%E7%B2%A4%E8%AF%AD%E8%BD%AC%E6%99%AE%E9%80%9A%E8%AF%9D.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 脚本配置
    const config = {
        apiKey: GM_getValue('deepseek_api_key', ''),
        triggerMode: GM_getValue('trigger_mode', 'auto'), // auto 或 manual
        translationEnabled: GM_getValue('translation_enabled', true)
    };

    // 样式定义
    const styles = `
        <style>
            .hk2cn-translated {
                margin-bottom: 5px;
            }
            .hk2cn-original {
                display: block;
                margin-bottom: 3px;
                text-decoration: line-through;
                color: gray;
            }
            .hk2cn-translated-text {
                display: block;
                background-color: #c3e6cb;
                padding: 2px 0;
            }
            .hk2cn-error {
                color: red;
                font-style: italic;
            }
        </style>
    `;

    // 添加样式到页面
    document.head.insertAdjacentHTML('beforeend', styles);

    // 页面初始化
    function init() {
        console.log('粤语转普通话翻译工具已加载');
        setupMenu();
        if (config.translationEnabled) {
            observePageChanges();
            translateExistingContent();
        }
    }

    // 设置菜单
    function setupMenu() {
        GM_registerMenuCommand('设置API密钥', openConfigDialog);
        GM_registerMenuCommand(config.translationEnabled ? '禁用翻译' : '启用翻译', toggleTranslation);
    }

    // 打开配置对话框
    function openConfigDialog() {
        const apiKey = prompt('请输入DeepSeek API密钥:', config.apiKey);
        if (apiKey !== null) {
            GM_setValue('deepseek_api_key', apiKey);
            config.apiKey = apiKey;
            alert('API密钥已保存');
        }
    }

    // 切换翻译状态
    function toggleTranslation() {
        config.translationEnabled = !config.translationEnabled;
        GM_setValue('translation_enabled', config.translationEnabled);
        if (config.translationEnabled) {
            observePageChanges();
            translateExistingContent();
        } else {
            // 停止观察并移除翻译结果
            if (observer) {
                observer.disconnect();
            }
            removeTranslations();
        }
        // 重新设置菜单
        GM_unregisterMenuCommand('设置API密钥');
        GM_unregisterMenuCommand(config.translationEnabled ? '启用翻译' : '禁用翻译');
        setupMenu();
    }

    // 移除所有翻译结果
    function removeTranslations() {
        const translations = document.querySelectorAll('.hk2cn-translated, .hk2cn-error');
        translations.forEach(el => el.remove());
    }

    // 页面变化观察器
    let observer = null;

    // 观察页面变化
    function observePageChanges() {
        if (observer) return;

        observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // 检查是否是postmessage元素或其子元素
                            if (node.classList.contains('postmessage') && node.classList.contains('defaultpost')) {
                                processElement(node);
                            } else {
                                // 检查是否包含postmessage子元素
                                const postMessages = node.querySelectorAll('div.postmessage.defaultpost');
                                postMessages.forEach(post => processElement(post));
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 处理单个元素
    function processElement(element) {
        if (element.classList.contains('hk2cn-translated') || element.classList.contains('hk2cn-error')) {
            return;
        }

        if (element.nodeType === Node.TEXT_NODE) {
            translateTextNode(element);
        } else {
            // 处理元素及其子节点
            const textNodes = getTextNodes(element);
            textNodes.forEach(translateTextNode);
        }
    }

    // 获取元素内的所有文本节点
    function getTextNodes(element) {
        const textNodes = [];
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while ((node = walker.nextNode())) {
            // 过滤掉空白节点和已经处理过的节点
            if (node.nodeValue.trim() && !node.parentNode.classList.contains('hk2cn-translated') && !node.parentNode.classList.contains('hk2cn-error')) {
                textNodes.push(node);
            }
        }
        return textNodes;
    }

    // 翻译现有内容
    function translateExistingContent() {
        const postMessages = document.querySelectorAll('div.postmessage.defaultpost');
        postMessages.forEach(post => {
            const textNodes = getTextNodes(post);
            textNodes.forEach(translateTextNode);
        });
    }

    // 翻译文本节点
    async function translateTextNode(node) {
        if (!node.nodeValue.trim() || node.parentNode.classList.contains('hk2cn-translated')) {
            return;
        }

        const originalText = node.nodeValue;
        // 简单检测是否为粤语（这里可以根据需要优化检测逻辑）
        if (isCantonese(originalText)) {
            try {
                const translatedText = await translateText(originalText);
                renderTranslation(node, originalText, translatedText);
            } catch (error) {
                renderError(node, originalText, error.message);
            }
        }
    }

    // 简单的粤语检测（可以根据需要优化）
    function isCantonese(text) {
        // 常见粤语词汇和语法特征
        const cantoneseFeatures = [
            '嘅', '咁', '乜', '係', '冇', '嚟', '睇', '啲', '俾', '佢',
            '咗', '嘞', '啰', '噉', '啱', '嘢', '冧', '瞓', '氹', '搵',
            '攞', '嚿', '睇下', '唔该', '多谢', '边个', '点样', '做乜',
            '系咪', '冇问题', '呢度', '𠮶度', '依家', '而家', '迟啲',
            '早啲', '晏啲', '快啲', '慢啲', '几多', '边度', '乜嘢'
        ];

        const matchCount = cantoneseFeatures.filter(feature => text.includes(feature)).length;
        return matchCount > 0;
    }

    // 调用DeepSeek API翻译文本
    function translateText(text) {
        return new Promise((resolve, reject) => {
            if (!config.apiKey) {
                reject(new Error('未设置API密钥，请在菜单中配置'));
                return;
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://api.deepseek.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${config.apiKey}`
                },
                data: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: '你是一个专业的粤语翻译助手，请将用户提供的粤语文本准确翻译成标准普通话，只返回翻译结果，不要添加任何解释或额外内容。'
                        },
                        {
                            role: 'user',
                            content: text
                        }
                    ],
                    max_tokens: 500,
                    temperature: 0.1
                }),
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        if (data.choices && data.choices.length > 0) {
                            resolve(data.choices[0].message.content.trim());
                        } else {
                            reject(new Error('翻译失败：' + (data.error?.message || '未知错误')));
                        }
                    } catch (error) {
                        reject(new Error('解析响应失败：' + error.message));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败：' + error.message));
                },
                ontimeout: function() {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // 渲染翻译结果
    function renderTranslation(node, originalText, translatedText) {
        // 创建翻译容器
        const container = document.createElement('div');
        container.className = 'hk2cn-translated';

        // 创建原始文本元素
        const originalElement = document.createElement('span');
        originalElement.className = 'hk2cn-original';
        originalElement.textContent = originalText;

        // 创建翻译文本元素
        const translatedElement = document.createElement('span');
        translatedElement.className = 'hk2cn-translated-text';
        translatedElement.textContent = translatedText;

        // 组装容器
        container.appendChild(originalElement);
        container.appendChild(translatedElement);

        // 替换原节点
        node.parentNode.replaceChild(container, node);
    }

    // 渲染错误信息
    function renderError(node, originalText, errorMessage) {
        // 创建错误容器
        const container = document.createElement('div');
        container.className = 'hk2cn-error';
        container.innerHTML = `${originalText} <br> (翻译错误：${errorMessage})`;

        // 替换原节点
        node.parentNode.replaceChild(container, node);
    }

    // 初始化脚本
    init();

})();