// ==UserScript==
// @name         文字和谐处理脚本（AI补充容错版）
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  修复AI响应解析错误，确保静态替换正常运行
// @author       401贺林枫
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      dashscope.aliyuncs.com
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/557905/%E6%96%87%E5%AD%97%E5%92%8C%E8%B0%90%E5%A4%84%E7%90%86%E8%84%9A%E6%9C%AC%EF%BC%88AI%E8%A1%A5%E5%85%85%E5%AE%B9%E9%94%99%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/557905/%E6%96%87%E5%AD%97%E5%92%8C%E8%B0%90%E5%A4%84%E7%90%86%E8%84%9A%E6%9C%AC%EF%BC%88AI%E8%A1%A5%E5%85%85%E5%AE%B9%E9%94%99%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
//填写你的阿里apikey
        aliApiKey: '你的阿里云api-key',
        sensitiveWords: {
            'wcnm': '***',
            '傻逼': '###',
            '测试词': '[已和谐]'
        },
        aiPrompt: `请识别以下文本中的所有低俗、辱骂性、不文明敏感词，仅返回敏感词数组，格式为["词1","词2"]，不要任何额外内容。`,
        aiTimeout: 10000,
        enableAI: true
    };

    // -------------------------- 修复：强化AI响应容错 --------------------------
    async function aiAddSensitiveWords() {
        if (!CONFIG.enableAI || !CONFIG.aliApiKey) return;

        // 提取页面文本（简化逻辑，避免复杂DOM遍历出错）
        const pageText = document.body.innerText.substring(0, 5000); // 限制长度，避免请求过大
        if (!pageText) return;

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${CONFIG.aliApiKey}`
                    },
                    data: JSON.stringify({
                        model: "qwen-turbo",
                        input: { messages: [{ role: "user", content: `${CONFIG.aiPrompt}\n文本：${pageText}` }] },
                        parameters: { temperature: 0, result_format: "text" }
                    }),
                    timeout: CONFIG.aiTimeout,
                    onload: resolve,
                    onerror: reject,
                    ontimeout: () => reject(new Error('超时'))
                });
            });

            // 修复1：先检查HTTP状态码
            if (response.status !== 200) {
                throw new Error(`HTTP错误：${response.status}，响应：${response.responseText.substring(0, 100)}`);
            }

            // 修复2：解析响应体时增加容错
            let result;
            try {
                result = JSON.parse(response.responseText);
            } catch (e) {
                throw new Error(`响应非JSON：${response.responseText.substring(0, 100)}`);
            }

            // 修复3：检查阿里云返回的错误码
            if (result.code && result.code !== '200') {
                throw new Error(`阿里云错误：${result.code || '未知'} - ${result.message || '无描述'}`);
            }

            // 修复4：严格校验AI返回的数组格式
            const aiOutput = result.output?.text?.trim() || '';
            if (!aiOutput.startsWith('[') || !aiOutput.endsWith(']')) {
                throw new Error(`AI返回非数组：${aiOutput.substring(0, 100)}`);
            }

            let aiSensitiveWords;
            try {
                aiSensitiveWords = JSON.parse(aiOutput);
                if (!Array.isArray(aiSensitiveWords)) throw new Error('不是数组');
            } catch (e) {
                throw new Error(`解析数组失败：${aiOutput}，错误：${e.message}`);
            }

            // 补充敏感词到词库
            aiSensitiveWords.forEach(word => {
                if (word && typeof word === 'string' && !CONFIG.sensitiveWords[word]) {
                    CONFIG.sensitiveWords[word] = '***';
                    console.log(`[AI补充] ${word} → ***`);
                }
            });

        } catch (error) {
            // 关键：即使AI失败，也仅警告，不影响静态替换
            console.warn(`[AI补充失败] ${error.message}，继续使用静态词库`);
        }
    }

    // -------------------------- 保留原脚本核心逻辑 --------------------------
    async function initScript() {
        await aiAddSensitiveWords(); // 无论AI是否成功，都会继续执行

        // 构建正则（原逻辑）
        const sensitiveKeys = Object.keys(CONFIG.sensitiveWords).map(word =>
            word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        );
        const regexPattern = new RegExp(`(${sensitiveKeys.join('|')})`, 'gi');

        // 替换文本（原逻辑）
        function replaceText(node) {
            if (node.nodeType === Node.TEXT_NODE) {
                const originalText = node.textContent;
                if (!originalText) return;

                const replacedText = originalText.replace(regexPattern, match => {
                    const lowerMatch = match.toLowerCase();
                    for (const [word, replacement] of Object.entries(CONFIG.sensitiveWords)) {
                        if (word.toLowerCase() === lowerMatch) {
                            console.log(`替换成功："${match}" → "${replacement}"`);
                            return replacement;
                        }
                    }
                    return match;
                });

                if (replacedText !== originalText) {
                    node.textContent = replacedText;
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                const tagName = node.tagName.toUpperCase();
                if (['SCRIPT', 'STYLE', 'TEXTAREA', 'INPUT'].includes(tagName)) return;
                Array.from(node.childNodes).forEach(child => replaceText(child));
            }
        }

        // 初始处理 + 监听（原逻辑）
        replaceText(document.body);
        console.log('初始处理完成（静态词库正常运行）');

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE || node.nodeType === Node.TEXT_NODE) {
                        replaceText(node);
                    }
                });
            });
        });
        observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    }

    initScript();

})();