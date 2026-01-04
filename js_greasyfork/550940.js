// ==UserScript==
// @name         给AI搜索网站添加q查询参数，支持deepseek,腾讯元宝,知乎直答,kimi,阿里qwen,字节豆包,gemini
// @namespace    http://tampermonkey.net/
// @version      2025.12.21
// @description  从URL中提取q查询参数，填入对话框，提交搜索。deepseek：chat.deepseek.com/?q={query}，腾讯元宝：yuanbao.tencent.com/?q={query}，知乎直答：zhida.zhihu.com/?q={query}，kimi：www.kimi.com/?q={query}，阿里qwen（用#伪?以免验证）：chat.qwen.ai/#q={query}，字节豆包：www.doubao.com/?q={query}，gemini：gemini.google.com/?q={query}。
// @author       smilingpoplar
// @match        https://chat.deepseek.com/*
// @match        https://yuanbao.tencent.com/*
// @match        https://zhida.zhihu.com/*
// @match        https://www.kimi.com/*
// @match        https://chat.qwen.ai/*
// @match        https://www.doubao.com/*
// @match        https://gemini.google.com/*
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550940/%E7%BB%99AI%E6%90%9C%E7%B4%A2%E7%BD%91%E7%AB%99%E6%B7%BB%E5%8A%A0q%E6%9F%A5%E8%AF%A2%E5%8F%82%E6%95%B0%EF%BC%8C%E6%94%AF%E6%8C%81deepseek%2C%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%2C%E7%9F%A5%E4%B9%8E%E7%9B%B4%E7%AD%94%2Ckimi%2C%E9%98%BF%E9%87%8Cqwen%2C%E5%AD%97%E8%8A%82%E8%B1%86%E5%8C%85%2Cgemini.user.js
// @updateURL https://update.greasyfork.org/scripts/550940/%E7%BB%99AI%E6%90%9C%E7%B4%A2%E7%BD%91%E7%AB%99%E6%B7%BB%E5%8A%A0q%E6%9F%A5%E8%AF%A2%E5%8F%82%E6%95%B0%EF%BC%8C%E6%94%AF%E6%8C%81deepseek%2C%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%2C%E7%9F%A5%E4%B9%8E%E7%9B%B4%E7%AD%94%2Ckimi%2C%E9%98%BF%E9%87%8Cqwen%2C%E5%AD%97%E8%8A%82%E8%B1%86%E5%8C%85%2Cgemini.meta.js
// ==/UserScript==

(async () => {
    'use strict';

    const waitForElement = (selector, timeout) => {
        return new Promise((resolve, reject) => {
            const elem = document.querySelector(selector);
            if (elem) return resolve(elem);

            let timer;
            if (typeof timeout === 'number' && timeout > 0) {
                timer = setTimeout(() => {
                    observer.disconnect();
                    reject(`在${timeout}ms内，未找到元素：${selector}`);
                }, timeout);
            }
            const observer = new MutationObserver(() => {
                const elem = document.querySelector(selector);
                if (elem) {
                    if (timer) clearTimeout(timer);
                    observer.disconnect();
                    resolve(elem);
                }
            });
            observer.observe(document.documentElement, { childList: true, subtree: true });
        });
    };
    const delay = (ms) => new Promise(res => setTimeout(res, ms));

    const getQuery = {
        search: () => new URLSearchParams(window.location.search).get('q'),
        hash: () => {
            const queryString = location.hash.substring(1);
            return new URLSearchParams(queryString).get('q');
        }
    };
    const simulateInput = {
        textContent: (elem, value) => {
            elem.textContent = value;
            elem.dispatchEvent(new InputEvent('input', { bubbles: true }));
        },
        textContentWithData: (elem, value) => {
            elem.textContent = value;
            elem.dispatchEvent(new InputEvent('input', { data: value, bubbles: true }));
        },
        value: (elem, value) => {
            elem.value = value;
            elem.dispatchEvent(new InputEvent('input', { bubbles: true }));
        },
        insertText: (elem, value) => {
            document.execCommand('insertText', false, value);
            elem.dispatchEvent(new InputEvent('input', { bubbles: true }));
        }
    };
    const simulateEnter = {
        keyboard: (event = 'keydown') => (elem) => {
            elem.dispatchEvent(new KeyboardEvent(event, { key: 'Enter', keyCode: 13, bubbles: true }));
        },
        react: (elem) => {
            const getReactProps = el => el[Object.keys(el).find(k => k.startsWith('__reactProps$'))];
            getReactProps(elem)?.onKeyDown?.({
                key: "Enter",
                code: "Enter",
                keyCode: 13,
                which: 13,
                preventDefault: () => { },
                stopPropagation: () => { },
            });
        }
    };

    const defaultConfig = {
        getQuery: getQuery.search,
        selector: 'div[contenteditable="true"]',
        simulateInput: simulateInput.textContent,
        simulateEnter: simulateEnter.keyboard()
    };
    const siteConfigs = {
        'chat.deepseek.com': {
            selector: 'textarea.ds-scroll-area'
        },
        'yuanbao.tencent.com': {
            beforeInput: async () => {
                // 在.input-guide-v2出现前的对话会被清空，所以等它加载
                await waitForElement('.input-guide-v2', 3000);
            }
        },
        'zhida.zhihu.com': {
            simulateInput: simulateInput.insertText,
            simulateEnter: simulateEnter.react
        },
        'www.kimi.com': {
            simulateInput: simulateInput.textContentWithData,
        },
        'chat.qwen.ai': {
            getQuery: getQuery.hash,
            selector: '#chat-input'
        },
        'www.doubao.com': {
            selector: 'textarea.semi-input-textarea'
        }
    };


    const siteConfig = siteConfigs[window.location.hostname] ?? {};
    const config = { ...defaultConfig, ...siteConfig };
    const query = config.getQuery();
    if (!query) return;

    const editor = await waitForElement(config.selector);
    await config.beforeInput?.();

    editor.focus();
    await delay(100);
    config.simulateInput(editor, query);
    await delay(100);
    config.simulateEnter(editor);
})();