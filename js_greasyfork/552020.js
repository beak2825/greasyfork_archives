// ==UserScript==
// @name         b站硬核会员答题辅助(Gemini ver.)
// @namespace    https://github.com/Masetti0927
// @version      2025-10-09
// @description  b站硬核会员答题辅助
// @author       masetti
// @match        https://www.bilibili.com/h5/senior-newbie/qa
// @license      GPL-3.0-only
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/552020/b%E7%AB%99%E7%A1%AC%E6%A0%B8%E4%BC%9A%E5%91%98%E7%AD%94%E9%A2%98%E8%BE%85%E5%8A%A9%28Gemini%20ver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/552020/b%E7%AB%99%E7%A1%AC%E6%A0%B8%E4%BC%9A%E5%91%98%E7%AD%94%E9%A2%98%E8%BE%85%E5%8A%A9%28Gemini%20ver%29.meta.js
// ==/UserScript==
(function () {
    'use strict';
    // ⭐⭐⭐ 1. 请输入你的 Google AI Studio API Key ⭐⭐⭐
    // 你也可以直接在这里把 Key 写死，例如： const API_KEY = "AIzaSy...你的Key";
    const API_KEY = prompt("请输入你的 Google AI Studio API Key:");

    // ⭐⭐⭐ 2. 需要别的模型这里改 ⭐⭐⭐
    // 推荐使用性能较好的模型，如 gemini-2.5-flash 或 gemini-2.5-pro
    const MODEL = "gemini-2.5-flash"; // 或 "gemini-2.5-pro"

    // ⭐⭐⭐ 3. Google Gemini API 的 ENDPOINT ⭐⭐⭐
    // API URL 包含模型名称，Key 作为查询参数
    const GEMINI_CHAT_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

    // Prompt模板，想改可以改。
    const getPrompt = (questionText, answersText) => {
        return `你是一个资深的 B 站答题专家。你只能告诉我最有可能正确的选项。不要提供任何解释或其他文本。问题: ${questionText}；选项：${answersText}`
    }

    // 后面不用改了

    let lastQuestionText = ""; // 存储上一次的文本
    let isThrottled = false; // 节流标志


    // 防抖函数
    function debounce(func, delay) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    // 节流函数
    function throttle(func, limit) {
        return function (...args) {
            if (!isThrottled) {
                func.apply(this, args);
                isThrottled = true;
                setTimeout(() => {
                    isThrottled = false;
                }, limit);
            }
        };
    }

    // 创建一个观察者实例
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                // 重新获取所有带有 fade-out 类的 senior-question 元素
                const fadeOutQuestions = document.querySelectorAll('.senior-question.fade-out');

                fadeOutQuestions.forEach(question => {
                    // 获取问题文本
                    const questionText = question.querySelector('.senior-question__qs').innerText;

                    // 获取所有答案文本
                    const answerElements = question.querySelectorAll('.senior-question__answer .senior-question__answer--item');
                    const answersText = Array.from(answerElements).map(answer => answer.innerText);

                    // 防抖处理，创建或更新内容
                    // 使用 getPrompt() 生成最终发送给 API 的文本
                    createOrUpdateContent(getPrompt(questionText, answersText));
                });
            }
        });
    });

    // 创建或更新内容的函数
    const createOrUpdateContent = throttle(debounce((promptText) => {
        // 如果新的文本和上一次的文本相同，则不发送请求
        if (promptText === lastQuestionText) {
            return;
        }

        lastQuestionText = promptText; // 更新上一次的文本

        // 使用彩色输出问题文本
        console.log('%cPrompt: ' + promptText, 'font-weight: bold;');

        // 4. 发起 fetch 请求 (请求头和请求体已适配 Gemini API)
        fetch(GEMINI_CHAT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 注意：Google API Key 是通过 URL 参数传递，不需要 Authorization 头部
            },
            body: JSON.stringify({
                contents: [ // 使用 contents 替代 messages
                    {
                        role: 'user',
                        parts: [ // 使用 parts 替代 content
                            {
                                text: promptText
                            }
                        ]
                    }
                ]
            })
        })
            .then(response => {
                if (!response.ok) {
                    // 如果 API 返回错误，尝试解析错误信息
                    return response.json().then(err => {
                        console.error('API 错误详情:', err.error);
                        throw new Error(`网络响应错误，状态码: ${response.status}`);
                    });
                }
                return response.json();
            })
            .then(data => {
                // 5. 获取并处理响应中的内容 (适配 Gemini 响应结构)
                const content = data?.candidates?.[0]?.content?.parts?.[0]?.text || "未找到答案";

                // 使用彩色输出响应内容
                console.log('%c【Gemini 推荐选项】: ' + content, 'color: #34A853; font-weight: bold; font-size: 1.2em;');
            })
            .catch(error => {
                console.error('Fetch error:', error);
                console.log('%c请检查：1. 您的 API Key 是否正确；2. 您是否已启用该模型的 API 权限；3. 您的 API 是否被限流。', 'color: red;');
            });
    }, 1000), 2000); // 防抖延迟为 1000 毫秒，节流间隔为 2000 毫秒

    // 观察目标节点，配置观察选项
    const targetNode = document.body; // 你可以根据需要选择特定的父元素
    const config = { childList: true, subtree: true };

    // 开始观察
    observer.observe(targetNode, config);
})();