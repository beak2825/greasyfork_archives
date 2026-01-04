// ==UserScript==
// @name         芯位答题插件（大语言模型调用LLM Qwen通义千问版本）
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  自动调用 Qwen-VL + Qwen-Max 答题（Base64 图片 + 实时进度）
// @author       You
// @match        *://*.beeline-ai.com/student/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/551507/%E8%8A%AF%E4%BD%8D%E7%AD%94%E9%A2%98%E6%8F%92%E4%BB%B6%EF%BC%88%E5%A4%A7%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B%E8%B0%83%E7%94%A8LLM%20Qwen%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E7%89%88%E6%9C%AC%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/551507/%E8%8A%AF%E4%BD%8D%E7%AD%94%E9%A2%98%E6%8F%92%E4%BB%B6%EF%BC%88%E5%A4%A7%E8%AF%AD%E8%A8%80%E6%A8%A1%E5%9E%8B%E8%B0%83%E7%94%A8LLM%20Qwen%E9%80%9A%E4%B9%89%E5%8D%83%E9%97%AE%E7%89%88%E6%9C%AC%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ======================
    // 配置模块（apiKey 从 localStorage 读取）
    // ======================
    const Config = {
        VisionModelSelect: "qwen-vl-plus",
        LLM_modelSelect: "qwen-max",
        get apiKey() {
            return localStorage.getItem('qwen_api_key') || '';
        },
        set apiKey(val) {
            if (val) {
                localStorage.setItem('qwen_api_key', val.trim());
            } else {
                localStorage.removeItem('qwen_api_key');
            }
        }
    };

    // ======================
    // 状态管理
    // ======================
    const State = {
        answerreturn: [],
        isDone: false,
        hasTriggered: false
    };

    // ======================
    // UI 模块（新增 API Key 输入面板）
    // ======================
    const UI = (function () {
        let boardanswer, bottonanswer, displaylevel, textanswer, textlevelnum, textleveltag;
        let apiKeyPanel = null;

        function createElement(tag, styles = {}, text = '', children = []) {
            const el = document.createElement(tag);
            Object.assign(el.style, styles);
            if (text) el.textContent = text;
            children.forEach(child => el.appendChild(child));
            return el;
        }

        function showApiKeyInput() {
            if (apiKeyPanel) return;

            apiKeyPanel = createElement('div', {
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                padding: '20px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                boxShadow: '0 0 15px rgba(0,0,0,0.3)',
                zIndex: '99999',
                width: '300px',
                textAlign: 'center'
            });

            const title = createElement('h3', { margin: '0 0 15px 0' }, '请输入 Qwen API Key');
            const input = createElement('input', {
                width: '100%',
                padding: '8px',
                marginBottom: '10px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                boxSizing: 'border-box'
            });
            input.type = 'password'; // 可改为 'text' 如果希望可见

            const submitBtn = createElement('button', {
                padding: '6px 12px',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
            }, '保存并开始');
            submitBtn.onclick = () => {
                const key = input.value.trim();
                if (key) {
                    Config.apiKey = key;
                    document.body.removeChild(apiKeyPanel);
                    apiKeyPanel = null;
                    // 可选：提示成功
                    alert('API Key 已保存！插件将在检测到题目后自动运行。');
                } else {
                    alert('请输入有效的 API Key！');
                }
            };

            const note = createElement('p', {
                fontSize: '12px',
                color: '#666',
                marginTop: '10px'
            }, 'Key 格式如：sk-xxxxxxxxxxxxxxxxxxxxxxxx');

            apiKeyPanel.append(title, input, submitBtn, note);
            document.body.appendChild(apiKeyPanel);

            // 聚焦输入框
            input.focus();
        }

        function createUI() {
            if (boardanswer) return;

            boardanswer = createElement('div', {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                width: '190px',
                height: '230px',
                backgroundColor: '#F5F5F5',
                borderRadius: '10px',
                outline: '2px solid #757575',
                zIndex: '9999'
            });

            bottonanswer = createElement('div', {
                position: 'absolute',
                top: '10px',
                right: '10px',
                width: '170px',
                height: '50px',
                backgroundColor: '#B4D4FF',
                outline: '2px solid #86B6F6',
                borderRadius: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            });

            displaylevel = createElement('div', {
                position: 'absolute',
                top: '70px',
                right: '10px',
                width: '100px',
                height: '50px',
                backgroundColor: '#BFD8AF',
                outline: '2px solid #99BC85',
                borderRadius: '10px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
            });

            textanswer = createElement('h3', {
                color: '#1A365D',
                margin: '0',
                fontSize: '14px',
                textAlign: 'center'
            }, 'answer: 等待题目...');

            const textlevel = createElement('h4', {
                color: '#12372A',
                margin: '0',
                fontSize: '12px'
            }, '题号：');

            textlevelnum = createElement('h2', {
                color: '#12372A',
                margin: '0',
                fontSize: '18px'
            });

            textleveltag = createElement('h5', {
                color: '#12372A',
                margin: '0',
                fontSize: '12px'
            });

            bottonanswer.appendChild(textanswer);
            displaylevel.append(textlevel, textlevelnum, textleveltag);
            boardanswer.append(displaylevel, bottonanswer);
            document.body.appendChild(boardanswer);

            // 检查是否已有 API Key
            if (!Config.apiKey) {
                showApiKeyInput();
            }
        }

        function updateAnswerText(text) {
            if (textanswer) textanswer.textContent = text;
        }

        function updateLevel(num, tag) {
            if (textlevelnum) textlevelnum.textContent = num;
            if (textleveltag) textleveltag.textContent = tag;
        }

        return {
            createUI,
            updateAnswerText,
            updateLevel
        };
    })();

    // ======================
    // 工具函数（支持 Base64 图片）
    // ======================
    const Utils = {
        isValidURL(str) {
            return typeof str === 'string' && /<img\s/i.test(str);
        },

        extractImgSrc(htmlStr) {
            const temp = document.createElement('div');
            temp.innerHTML = htmlStr;
            const img = temp.querySelector('img');
            return img ? img.src : null;
        },

        async urlToBase64(url) {
            if (!url || typeof url !== 'string') return null;
            try {
                const cleanUrl = url.replace(/ /g, '%20');
                const response = await fetch(cleanUrl);
                if (!response.ok) {
                    console.warn('Image fetch failed:', response.status, url);
                    return null;
                }
                const blob = await response.blob();
                return new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = () => reject(reader.error);
                    reader.readAsDataURL(blob);
                });
            } catch (e) {
                console.error('urlToBase64 error:', url, e.message || e);
                return null;
            }
        }
    };

    // ======================
    // AI 调用模块（使用 Config.apiKey）
    // ======================
    const AI = (function () {
        async function callModel(model, messages, timeoutMs = 12000) {
            const apiKey = Config.apiKey;
            if (!apiKey) {
                console.error('API Key 未设置！');
                return '[API Key 未设置]';
            }

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

            try {
                // 🔧 修复：移除 URL 末尾空格！
                const response = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${apiKey}`
                    },
                    body: JSON.stringify({ model, messages }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errText = await response.text().catch(() => '[无法读取错误]');
                    console.error(`API ${response.status}:`, errText);
                    return '[调用失败]';
                }

                const data = await response.json().catch(e => {
                    console.error('JSON parse failed:', e);
                    return null;
                });

                if (!data || !data.choices?.[0]?.message?.content) {
                    console.warn('Invalid API response:', data);
                    return '[无有效内容]';
                }

                return data.choices[0].message.content.trim();
            } catch (error) {
                clearTimeout(timeoutId);
                if (error.name === 'AbortError') {
                    console.error(`请求超时 (${timeoutMs}ms)`);
                } else {
                    console.error('Fetch error:', error);
                }
                return '[请求异常]';
            }
        }

        async function callVisionModel(imageData) {
            const messages = [{
                role: "user",
                content: [
                    { type: "text", text: "请准确提取图片中的所有文字和数学公式，仅返回内容，不要任何解释！" },
                    { type: "image_url", image_url: { url: imageData } }
                ]
            }];
            return await callModel(Config.VisionModelSelect, messages, 10000);
        }

        async function callLLM(prompt) {
            const messages = [
                {
                    role: "system",
                    content: "你是一个答题助手。你必须只输出一行严格的 JSON 对象，不要任何其他字符、解释、空格、换行、Markdown 代码块或标点。格式必须为：{\"question\":\"...\",\"answer\":\"A\",\"diff\":true}"
                },
                {
                    role: "user",
                    content: prompt.trim()
                }
            ];
            const result = await callModel(Config.LLM_modelSelect, messages, 12000);
            return result === '[请求异常]' || result === '[调用失败]' || result === '[无有效内容]' || result === '[API Key 未设置]'
                ? '{}'
                : result;
        }

        return { callVisionModel, callLLM };
    })();

    // ======================
    // 主逻辑（新增 Key 检查）
    // ======================
    const MainLogic = (function () {
        const qTypeMap = { 'danxuan': 0, 'duoxuan': 1, 'panduan': 2 };
        const prompts = [
            `这是一道单选题。请严格按以下要求作答：仅输出一行 JSON，格式为 {"question":"题目内容","answer":"A","diff":true}。不要任何额外字符、解释、换行或空格。题目如下：\n`,
            `这是一道多选题。请严格按以下要求作答：仅输出一行 JSON，格式为 {"question":"题目内容","answer":"A B","diff":true}。不要任何额外字符、解释、换行或空格。题目如下：\n`,
            `这是一道判断题。请严格按以下要求作答：仅输出一行 JSON，格式为 {"question":"题目内容","answer":"T","diff":true}。不要任何额外字符、解释、换行或空格。题目如下：\n`
        ];

        async function limitConcurrencyWithProgress(tasks, limit = 2, onProgress = null) {
            const results = [];
            const total = tasks.length;
            let completed = 0;

            for (let i = 0; i < tasks.length; i += limit) {
                const batch = tasks.slice(i, i + limit);
                const batchResults = await Promise.all(
                    batch.map(task => task().catch(err => {
                        console.error('Task failed:', err);
                        return '[处理失败]';
                    }))
                );
                results.push(...batchResults);
                completed += batch.length;
                if (onProgress) onProgress(completed, total);
            }
            return results;
        }

        async function processTopic(topic) {
            try {
                let topicTitle = topic.topicTitle || '';
                if (Utils.isValidURL(topicTitle)) {
                    const imgUrl = Utils.extractImgSrc(topicTitle);
                    if (imgUrl) {
                        const base64 = await Utils.urlToBase64(imgUrl);
                        if (base64) {
                            topicTitle = await AI.callVisionModel(base64);
                        } else {
                            topicTitle = '[图片加载失败]';
                        }
                    }
                }

                let optionsText = '';
                const questions = topic.topicQuestionCoreDtoList || [];
                const optionPromises = questions.map(async (q) => {
                    let content = q.content || '';
                    if (Utils.isValidURL(content)) {
                        const imgUrl = Utils.extractImgSrc(content);
                        if (imgUrl) {
                            const base64 = await Utils.urlToBase64(imgUrl);
                            if (base64) {
                                content = await AI.callVisionModel(base64);
                            } else {
                                content = '[图片加载失败]';
                            }
                        }
                    }
                    return `${q.index}\t${content}\n`;
                });

                const optionChunks = [];
                for (let i = 0; i < optionPromises.length; i += 2) {
                    const chunk = optionPromises.slice(i, i + 2);
                    const results = await Promise.all(chunk.map(p => p.catch(e => {
                        console.warn('Option parse failed:', e);
                        return `${questions[i]?.index || '?'}\t[图片解析失败]\n`;
                    })));
                    optionChunks.push(...results);
                }
                optionsText = optionChunks.join('');

                const qType = qTypeMap[topic.topicType];
                if (qType === undefined) {
                    console.warn('Unknown question type:', topic.topicType);
                    return null;
                }

                return prompts[qType] + topicTitle + '\n' + optionsText;
            } catch (e) {
                console.error('processTopic error:', e);
                return null;
            }
        }

        function extractJsonFromString(str) {
            if (typeof str !== 'string') return null;
            try {
                return JSON.parse(str);
            } catch (e) {
                const start = str.indexOf('{');
                const end = str.lastIndexOf('}');
                if (start === -1 || end <= start) return null;
                let jsonStr = str.slice(start, end + 1);
                try {
                    return JSON.parse(jsonStr);
                } catch (e2) {
                    try {
                        const fixed = jsonStr.replace(/\\\\/g, '\\');
                        return JSON.parse(fixed);
                    } catch (e3) {
                        return null;
                    }
                }
            }
        }

        async function run(data) {
            if (!Config.apiKey) {
                UI.createUI(); // 会自动弹出输入框
                return;
            }
            if (State.hasTriggered) return;
            State.hasTriggered = true;

            UI.createUI();
            UI.updateAnswerText('检测到作业数据，正在加载题目...');

            const homeworkTopicList = data.data?.homeworkTopicList;
            if (!homeworkTopicList || !Array.isArray(homeworkTopicList)) {
                UI.updateAnswerText('无效题目数据');
                return;
            }

            const topicTasks = homeworkTopicList.map(topic => () => processTopic(topic));
            const promptList = (await limitConcurrencyWithProgress(topicTasks, 2))
                .filter(prompt => prompt && prompt !== '[处理失败]');

            if (promptList.length === 0) {
                UI.updateAnswerText('未解析到有效题目');
                return;
            }

            UI.updateAnswerText(`共 ${promptList.length} 题，正在分析...`);

            const llmTasks = promptList.map(prompt => () => AI.callLLM(prompt));
            console.log("正在启动LLM任务");

            const results = await limitConcurrencyWithProgress(llmTasks, 2, (completed, total) => {
                UI.updateAnswerText(`正在分析第 ${completed}/${total} 题...`);
            });

            console.log("LLM任务完成");

            State.answerreturn = results.map((res, i) => {
                const parsed = extractJsonFromString(res);
                if (parsed && parsed.answer !== undefined) {
                    return parsed.answer;
                } else {
                    console.error('Failed to extract answer from Q' + (i + 1), res);
                    return 'NaN';
                }
            });

            State.isDone = true;
            console.log("答题结果已生成");

            UI.updateAnswerText('答题完成！');
            updateCurrentDisplay();
        }

        function updateCurrentDisplay() {
            const indexEl = document.querySelector('.index');
            const tagEl = document.querySelector('.tag');
            if (!indexEl || !tagEl || !State.isDone) return;

            const numMatch = indexEl.textContent.trim().match(/^(\d+)/);
            const num = numMatch ? parseInt(numMatch[1], 10) : 1;
            const tag = tagEl.textContent;

            UI.updateLevel(num, tag);

            if (State.answerreturn.length >= num) {
                UI.updateAnswerText(`answer: ${State.answerreturn[num - 1]}`);
            }
        }

        return { run, updateCurrentDisplay };
    })();

    // ======================
    // 网络拦截
    // ======================
    const Interceptor = (function () {
        function tryTrigger(data) {
            if (State.hasTriggered) return;
            try {
                const hasField = JSON.stringify(data).includes('"homeworkAssessPoints"');
                if (hasField && data.code === 200 && data.data?.homeworkTopicList) {
                    console.log('[答题插件] 检测到 homeworkAssessPoints，启动答题逻辑');
                    MainLogic.run(data);
                }
            } catch (e) {
                console.warn('[答题插件] 数据检测异常:', e);
            }
        }

        const originalXhrOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function () {
            this.addEventListener('load', function () {
                if (this.readyState === 4 && this.status === 200) {
                    const ct = this.getResponseHeader('content-type');
                    if (ct?.includes('application/json')) {
                        try {
                            const data = JSON.parse(this.responseText);
                            tryTrigger(data);
                        } catch (e) { /* ignore */ }
                    }
                }
            });
            return originalXhrOpen.apply(this, arguments);
        };

        const originalFetch = window.fetch;
        window.fetch = function () {
            const promise = originalFetch.apply(this, arguments);
            promise.then(response => {
                if (response.ok && response.headers.get('content-type')?.includes('application/json')) {
                    response.clone().json().then(data => tryTrigger(data)).catch(() => {});
                }
            }).catch(() => {});
            return promise;
        };
    })();

    // ======================
    // DOM 监听（题号变化）
    // ======================
    function debounce(func, wait) {
        let timeout;
        return function (...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }

    const examContainer =
        document.querySelector('.exam-container') ||
        document.querySelector('.question-wrapper') ||
        document.querySelector('[class*="topic"]') ||
        document.querySelector('[class*="question"]') ||
        document.body;

    const debouncedUpdate = debounce(MainLogic.updateCurrentDisplay, 100);

    const observer = new MutationObserver(debouncedUpdate);
    observer.observe(examContainer, {
        childList: true,
        subtree: true,
        characterData: true
    });

})();