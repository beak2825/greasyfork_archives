// ==UserScript==
// @name         4-正确率查询-按钮
// @namespace    http://tampermonkey.net/
// @version      3.2.0
// @description  【猫厂专用】在周测详情页添加一个美化按钮，点击后在悬浮窗中显示所有题目、整体正确率（整数）并优化复制功能。现已支持在线更新
// @author       大生
// @match        https://tyca.codemao.cn/weekly-test/group-center?paperId=*
// @grant        GM_xmlhttpRequest
// @grant        GM_setClipboard
// @icon         https://tyca.codemao.cn/favicon.ico
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/552761/4-%E6%AD%A3%E7%A1%AE%E7%8E%87%E6%9F%A5%E8%AF%A2-%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/552761/4-%E6%AD%A3%E7%A1%AE%E7%8E%87%E6%9F%A5%E8%AF%A2-%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('Tampermonkey script loaded: 猫码周测题目及选项正确率和正确答案查询 (Copy all info enhanced)');

    let preloadedData = null;
    let dataLoadingPromise = null;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeScript);
    } else {
        initializeScript();
    }

    async function initializeScript() {
        console.log('DOM Content Loaded, initializing script elements.');

        const button = document.createElement('button');
        button.textContent = '查询正确率';
        button.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 20px;
            padding: 15px 30px;
            background-color: #4CAF50;
            color: white;
            border: none;
            border-radius: 30px;
            box-shadow: 0 6px 12px rgba(0, 0, 0, 0.25);
            cursor: pointer;
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            z-index: 9999;
            outline: none;
        `;
        button.onmouseover = function() {
            this.style.backgroundColor = '#45a049';
            this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.35)';
            this.style.transform = 'translateY(-3px)';
        };
        button.onmouseout = function() {
            this.style.backgroundColor = '#4CAF50';
            this.style.boxShadow = '0 6px 12px rgba(0, 0, 0, 0.25)';
            this.style.transform = 'translateY(0)';
        };
        button.onmousedown = function() {
            this.style.transform = 'translateY(-1px) scale(0.98)';
            this.style.boxShadow = '0 3px 6px rgba(0, 0, 0, 0.15)';
        };
        button.onmouseup = function() {
            this.style.transform = 'translateY(0) scale(1)';
        };
        document.body.appendChild(button);
        console.log('Query button added to document body, positioned at bottom-right.');

        // 在脚本加载时就静默预加载数据
        preloadAllData();

        function createFloatingWindow() {
            let existingWindow = document.getElementById('questionAccuracyWindow');
            if (existingWindow) {
                console.log('Removing existing window.');
                existingWindow.remove();
            }

            const windowDiv = document.createElement('div');
            windowDiv.id = 'questionAccuracyWindow';
            windowDiv.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: 70%;
                max-width: 800px;
                max-height: 85%;
                background-color: #f8f9fa;
                border: 1px solid #e0e0e0;
                border-radius: 12px;
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.25);
                z-index: 10000;
                overflow: hidden;
                font-family: 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
                color: #333;
                animation: fadeIn 0.3s ease-out forwards;
                display: flex;
                flex-direction: column;
            `;

            let styleSheet = document.getElementById('tm-accuracy-animations');
            if (!styleSheet) {
                styleSheet = document.createElement("style");
                styleSheet.id = 'tm-accuracy-animations';
                styleSheet.type = "text/css";
                styleSheet.innerText = `
                    @keyframes fadeIn {
                        from { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
                        to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    }
                    @keyframes fadeOut {
                        from { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                        to { opacity: 0; transform: translate(-50%, -50%) scale(0.95); }
                    }
                `;
                document.head.appendChild(styleSheet);
            }

            const headerDiv = document.createElement('div');
            headerDiv.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 20px 30px 15px;
                border-bottom: 1px solid #e0e0e0;
                background-color: #f8f9fa;
                position: sticky;
                top: 0;
                z-index: 10;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            `;

            const titleSpan = document.createElement('span');
            titleSpan.textContent = '正确率分析';
            titleSpan.id = 'accuracyWindowTitle';
            titleSpan.style.cssText = `
                font-size: 24px;
                font-weight: bold;
                color: #212529;
            `;

            const closeButton = document.createElement('button');
            closeButton.textContent = '✕';
            closeButton.style.cssText = `
                background: none;
                border: none;
                font-size: 28px;
                cursor: pointer;
                color: #6c757d;
                line-height: 1;
                padding: 0 8px;
                transition: color 0.2s ease;
                outline: none;
            `;
            closeButton.onmouseover = function() { this.style.color = '#dc3545'; };
            closeButton.onmouseout = function() { this.style.color = '#6c757d'; };
            closeButton.addEventListener('click', () => {
                windowDiv.style.animation = 'fadeOut 0.3s ease-in forwards';
                windowDiv.addEventListener('animationend', () => {
                    windowDiv.remove();
                }, { once: true });
            });

            headerDiv.appendChild(titleSpan);
            headerDiv.appendChild(closeButton);
            windowDiv.appendChild(headerDiv);

            const contentScrollContainer = document.createElement('div');
            contentScrollContainer.style.cssText = `
                flex-grow: 1;
                overflow-y: auto;
                padding: 20px 30px 30px;
            `;
            contentScrollContainer.id = 'accuracyContent';
            windowDiv.appendChild(contentScrollContainer);

            // --- 复制按钮 ---
            const copyButton = document.createElement('button');
            copyButton.textContent = '复制信息';
            copyButton.style.cssText = `
                position: absolute;
                right: 20px;
                bottom: 20px;
                padding: 10px 20px;
                background-color: #17a2b8;
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-size: 15px;
                font-weight: bold;
                box-shadow: 0 4px 8px rgba(0,0,0,0.2);
                transition: background-color 0.2s ease, transform 0.2s ease;
                z-index: 100;
                outline: none;
            `;
            copyButton.onmouseover = function() {
                this.style.backgroundColor = '#138496';
                this.style.transform = 'scale(1.05)';
            };
            copyButton.onmouseout = function() {
                this.style.backgroundColor = '#17a2b8';
                this.style.transform = 'scale(1)';
            };

            // --- 核心修改：复制按钮逻辑，使用预加载的纯文本数据进行复制 ---
            copyButton.onclick = function() {
                if (preloadedData && !preloadedData.error && preloadedData.plainText) {
                    GM_setClipboard(preloadedData.plainText);
                    this.textContent = '已复制!';
                    setTimeout(() => {
                        this.textContent = '复制信息';
                    }, 1500);
                    console.log('Copied pre-formatted plain text data.');
                } else {
                    // 兜底方案，如果预加载数据有问题，直接从DOM获取
                    const contentToCopy = document.getElementById('accuracyContent').innerText;
                    GM_setClipboard(contentToCopy);
                    this.textContent = '已复制!';
                    setTimeout(() => {
                        this.textContent = '复制信息';
                    }, 1500);
                    console.warn('Preloaded plain text not available, copied from DOM innerText.');
                }
            };
            // --- 复制按钮逻辑结束 ---

            windowDiv.appendChild(copyButton);
            document.body.appendChild(windowDiv);
            console.log('Floating window created with sticky header and floating copy button.');

            return contentScrollContainer;
        }

        async function preloadAllData() {
            if (dataLoadingPromise) {
                console.log('Data loading already in progress or completed, returning existing promise.');
                return dataLoadingPromise;
            }

            const urlParams = new URLSearchParams(window.location.search);
            const paperId = urlParams.get('paperId');

            if (!paperId) {
                console.error('Paper ID not found in URL. Cannot preload data.');
                preloadedData = { error: true, message: '未在URL中找到 paperId。请确认当前页面是周测页面。' };
                return Promise.resolve(preloadedData);
            }

            dataLoadingPromise = (async () => {
                console.log(`Starting data preload for paperId: ${paperId}`);
                const paperApiUrl = `https://codecamp-teaching-system.codemao.cn/paper/${paperId}`;

                try {
                    const paperResponse = await new Promise((resolve, reject) => {
                        GM_xmlhttpRequest({
                            method: "GET",
                            url: paperApiUrl,
                            onload: resolve,
                            onerror: reject
                        });
                    });

                    const paperData = JSON.parse(paperResponse.responseText);
                    if (!paperData.success || !paperData.data || !paperData.data.questions || paperData.data.questions.length === 0) {
                        console.error('Paper data not successful or no questions found.', paperData);
                        return { error: true, message: '未找到题目信息或数据格式不正确。', data: paperData };
                    }

                    const paperName = paperData.data.paperName || "未知试卷名称";
                    console.log(`Fetched paperName: ${paperName}`);

                    const questionIds = paperData.data.questions.map(q => q.questionId);
                    let questionsHtmlParts = [];
                    let questionsPlainTextParts = []; // 用于存储纯文本内容

                    questionsPlainTextParts.push(`试卷名称: ${paperName}`);
                    questionsPlainTextParts.push(`试卷ID: ${paperId}`);
                    questionsPlainTextParts.push(`---`); // 添加分隔符

                    console.log(`Found ${questionIds.length} questions. Fetching details...`);

                    for (let i = 0; i < questionIds.length; i++) {
                        const qId = questionIds[i];
                        const questionApiUrl = `https://codecamp-teaching-system.codemao.cn/general-question/list?questionId=${qId}`;

                        const questionResponse = await new Promise((resolve, reject) => {
                            GM_xmlhttpRequest({
                                method: "GET",
                                url: questionApiUrl,
                                onload: resolve,
                                onerror: reject
                            });
                        });

                        const questionData = JSON.parse(questionResponse.responseText);
                        let questionHtml = '';
                        let questionPlainText = ''; // 单个题目的纯文本

                        if (questionData.success && questionData.data && questionData.data.items && questionData.data.items.length > 0) {
                            const question = questionData.data.items[0];
                            const overallAccuracy = question.stat && question.stat.accuracy !== undefined ?
                                                    Math.round(question.stat.accuracy * 100) + '%' : 'N/A';

                            if (i > 0) {
                                questionHtml += '<div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #e9ecef;"></div>';
                                questionsPlainTextParts.push(`\n---`); // 纯文本分隔符
                            }

                            // 构建HTML
                            questionHtml += `<h3 style="color: #007bff; margin-bottom: 8px;">题目ID: ${qId} (${question.name})</h3>`;
                            questionHtml += `<p style="font-size: 1.1em; margin-bottom: 15px;"><strong>整体正确率: <span style="color: #28a745;">${overallAccuracy}</span></strong></p>`;
                            questionHtml += `<ul style="list-style: none; padding: 0;">`;

                            // 构建纯文本
                            questionPlainText += `\n题目ID: ${qId} (${question.name})\n`;
                            questionPlainText += `整体正确率: ${overallAccuracy}\n`;

                            if (question.stat && question.stat.optionStat && question.stat.optionStat.length > 0 && question.options) {
                                question.options.forEach(option => {
                                    const optionChar = String.fromCharCode(65 + option.seq);
                                    const correctMarkHtml = option.isCorrect ? ' <span style="color: #28a745; font-weight: bold;">- ✅ (正确答案)</span>' : '';
                                    const correctMarkPlainText = option.isCorrect ? ' - (正确答案)' : '';

                                    const statOption = question.stat.optionStat.find(stat => stat.seq === option.seq);
                                    const selectedRate = statOption ? Math.round(statOption.selectedRate * 100) : 'N/A';

                                    questionHtml += `<li style="margin-bottom: 5px; padding: 5px 0; border-bottom: 1px dotted #dee2e6;">选项 ${optionChar}: <strong>${selectedRate}%</strong>${correctMarkHtml}</li>`;
                                    questionPlainText += `选项 ${optionChar}: ${selectedRate}%${correctMarkPlainText}\n`;
                                });
                            } else {
                                questionHtml += `<li style="color: #6c757d;">无选项正确率数据或选项信息。</li>`;
                                questionPlainText += `无选项正确率数据或选项信息。\n`;
                            }
                            questionHtml += `</ul>`;
                        } else {
                            if (i > 0) {
                                questionHtml += '<div style="margin-top: 30px; padding-top: 20px; border-top: 1px dashed #e9ecef;"></div>';
                                questionsPlainTextParts.push(`\n---`);
                            }
                            questionHtml += `<h3 style="color: #007bff;">题目ID: ${qId}</h3><p style="color: #dc3545;">无法获取该题目详情或选项正确率数据。</p>`;
                            questionPlainText += `\n题目ID: ${qId}\n无法获取该题目详情或选项正确率数据。\n`;
                            console.warn(`Could not get details for question ID: ${qId}`);
                        }
                        questionsHtmlParts.push(questionHtml);
                        questionsPlainTextParts.push(questionPlainText); // 将纯文本加入数组
                    }

                    const fullContentHtml = questionsHtmlParts.join(''); // 不需要 initialInfoHtml，因为已经合并到 questionsHtmlParts 中
                    const fullContentPlainText = questionsPlainTextParts.join('\n'); // 组合所有纯文本部分

                    preloadedData = {
                        html: fullContentHtml, // 用于显示在弹窗的HTML内容
                        plainText: fullContentPlainText, // 用于复制的纯文本内容
                        paperName: paperName,
                        paperId: paperId,
                        error: false
                    };
                    console.log('Data preloaded successfully. HTML and plain text generated.');
                    return preloadedData;

                } catch (e) {
                    console.error('Preload: Request or parsing data failed:', e);
                    preloadedData = { error: true, message: '获取数据失败，请检查网络或Paper ID是否正确。详情请查看浏览器控制台。' };
                    return preloadedData;
                }
            })();

            return dataLoadingPromise;
        }

        button.addEventListener('click', async function() {
            console.log('Query button clicked.');
            const contentDiv = createFloatingWindow(); // 确保每次点击都创建并获取到新的弹窗内容容器

            // 显示加载提示，以防数据仍在加载中
            contentDiv.innerHTML = '<p style="text-align: center; color: #555;">正在加载数据，请稍候...</p>';

            const result = await dataLoadingPromise;

            if (result && !result.error) {
                console.log('Displaying data from preloaded/loaded source.');
                // 注意：这里仍然使用 result.html 来填充弹窗显示内容
                contentDiv.innerHTML = `
                    <p style="margin-bottom: 8px;"><strong>试卷名称:</strong> ${result.paperName}</p>
                    <p style="margin-bottom: 20px;"><strong>试卷ID:</strong> ${result.paperId}</p>
                    <div style="border-bottom: 1px dashed #e9ecef; margin-bottom: 20px;"></div>
                ` + result.html;
            } else if (result && result.error) {
                console.log('Displaying error from preloaded/loaded source.');
                contentDiv.innerHTML = `<p style="text-align: center; color: #dc3545; font-weight: bold;">${result.message}</p>`;
            } else {
                console.error('Unexpected state: dataLoadingPromise is null after click.');
                contentDiv.innerHTML = '<p style="text-align: center; color: #dc3545; font-weight: bold;">初始化数据失败，请刷新页面重试。</p>';
            }
        });
    }
})();