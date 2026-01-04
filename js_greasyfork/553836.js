// ==UserScript==
// @name         河南民族宗教平台助手v9.0（已失效）
// @namespace    http://tampermonkey.net/
// @version      9.6
// @description  河南省高校河南民族宗教理论知识网络竞赛答案获取，自动版企鹅裙：1034619898
// @author       480326406@qq.com
// @match        *://hnjingsai.cn/cbt/exam/*
// @match        *://hnjingsai.cn/*
// @match        *://hnjingsai.cn/cbt/*
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/553836/%E6%B2%B3%E5%8D%97%E6%B0%91%E6%97%8F%E5%AE%97%E6%95%99%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8Bv90%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/553836/%E6%B2%B3%E5%8D%97%E6%B0%91%E6%97%8F%E5%AE%97%E6%95%99%E5%B9%B3%E5%8F%B0%E5%8A%A9%E6%89%8Bv90%EF%BC%88%E5%B7%B2%E5%A4%B1%E6%95%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let questionsList = [];

    // -------------------------------------------------------------------
    // --- (1) 注入面板所需的 CSS 样式 ---
    // -------------------------------------------------------------------

    function injectCSS() {
        const style = document.createElement('style');
        style.textContent = `
            #auto-answer-panel {
                position: fixed;
                top: 20px;
                left: 20px;
                width: 360px; /* 宽度以适应5列网格 */
                background: #ffffff;
                border-radius: 10px;
                box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                z-index: 999999;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                color: #333;
                overflow: hidden;
            }
            #answer-panel-header {
                padding: 14px 18px;
                background: #f7f9fa;
                border-bottom: 1px solid #eee;
                display: flex;
                justify-content: space-between;
                align-items: center;
                cursor: move;
                user-select: none;
            }
            #answer-panel-header span {
                font-size: 16px;
                font-weight: 600;
            }

            /* 题号网格 */
            #answer-grid-container {
                display: grid;
                grid-template-columns: repeat(5, 1fr);
                gap: 10px;
                padding: 18px;
            }
            /* (修改) 题号答案框 */
            .grid-answer-box {
                border: 1px solid #dcdfe6;
                background: #fff;
                border-radius: 4px;
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                user-select: none;

                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 6px 4px;
                min-height: 42px; /* 保持统一高度 */
            }
            .grid-answer-box:hover {
                background: #f5f7fa;
                border-color: #c0c4cc;
            }
            .grid-q-num {
                font-size: 11px;
                color: #909399;
                font-weight: 400;
            }
            .grid-q-ans {
                font-size: 15px; /* 调整大小以适应 ABCD */
                font-weight: 700;
                color: #409EFF;
                line-height: 1.2;
                margin-top: 3px;
                font-family: 'Courier New', monospace;
            }
            /* 选中时的状态 */
            .grid-answer-box.active {
                background: #409EFF;
                color: #fff;
                border-color: #409EFF;
            }
            .grid-answer-box.active .grid-q-num {
                color: #e0e0e0;
            }
            .grid-answer-box.active .grid-q-ans {
                color: #fff;
            }

            /* 答案显示区域 */
            #answer-display-area {
                padding: 0 18px 18px 18px;
            }
            .display-content {
                background: #f8f9fa;
                border: 1px solid #eee;
                border-radius: 6px;
                padding: 15px;
                min-height: 120px;
                user-select: text;
            }
            .display-prompt {
                color: #999;
                text-align: center;
                padding-top: 35px;
                font-size: 14px;
            }
            .display-q-num {
                font-size: 16px;
                font-weight: 600;
                color: #303133;
                margin-bottom: 12px;
            }
            /* (修改) 题目和答案的样式 */
            .display-q-title {
                font-size: 14px;
                color: #333;
                line-height: 1.6;
                white-space: normal;
                word-wrap: break-word;
                margin-bottom: 15px;
            }
            .display-q-answer {
                font-size: 20px;
                font-weight: 700;
                color: #E6A23C;
                background: #fdf6ec;
                border: 1px solid #faecd8;
                border-radius: 5px;
                padding: 8px 12px;
                font-family: 'Courier New', monospace;
            }

            /* (新增) 页脚推广 */
            #panel-footer {
                padding: 15px 18px;
                background: #f7f9fa;
                border-top: 1px solid #eee;
                font-size: 13px;
                color: #606266;
                line-height: 1.5;
                text-align: center;
            }
            #panel-footer b {
                color: #007BFF;
                user-select: text; /* 方便复制群号 */
                font-weight: 600;
            }
        `;
        document.head.appendChild(style);
    }

    // -------------------------------------------------------------------
    // --- (2) 拦截网络请求 (获取答案) ---
    // -------------------------------------------------------------------

    // 拦截 fetch 请求
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        return originalFetch.apply(this, args).then(response => {
            const clonedResponse = response.clone();
            if (args[0].includes('/api/onlineExam/getPaper')) {
                clonedResponse.json().then(data => {
                    if (data.success && data.result && data.result.questions) {
                        processQuestions(data.result.questions);
                    }
                }).catch(() => {});
            }
            return response;
        });
    };

    // 拦截 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url, ...rest) {
        this._url = url;
        return originalOpen.apply(this, [method, url, ...rest]);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        if (this._url && this._url.includes('/api/onlineExam/getPaper')) {
            this.addEventListener('load', function() {
                try {
                    const data = JSON.parse(this.responseText);
                    if (data.success && data.result && data.result.questions) {
                        processQuestions(data.result.questions);
                    }
                } catch (err) {}
            });
        }
        return originalSend.apply(this, args);
    };

    // -------------------------------------------------------------------
    // --- (3) 处理答案数据并创建UI ---
    // -------------------------------------------------------------------

    // 统一处理获取到的问题
    function processQuestions(questions) {
        if (questionsList.length > 0) return; // 防止重复执行

        questionsList = questions.map(q => ({
            title: q.title,
            rightAnswer: q.rightAnswer
        }));

        // 注入CSS
        injectCSS();
        // 创建答案显示面板
        createAnswerPanel(questionsList);
    }

    // 创建答案显示面板
    function createAnswerPanel(answers) {
        if (document.getElementById('auto-answer-panel')) return;

        const panel = document.createElement('div');
        panel.id = 'auto-answer-panel';

        // --- 1. 设置面板的完整 HTML (骨架) ---
        panel.innerHTML = `
            <div id="answer-panel-header">
                <span>🎯 答案助手 (共 ${answers.length} 题)</span>
            </div>

            <div id="answer-grid-container">
                </div>

            <div id="answer-display-area">
                <div class="display-content">
                    <div class="display-prompt">
                        👆 点击上方题号查看答案详情
                    </div>
                </div>
            </div>

            <div id="panel-footer">
                <div>防止滥用，只提供手动版本</div>
                <div style="margin-top: 5px;">自动版本进🐧群获取: <b>1034619898</b></div>
            </div>
        `;
        document.body.appendChild(panel);

        // --- 2. 获取容器 ---
        const gridContainer = document.getElementById('answer-grid-container');
        const displayContainer = document.querySelector('#answer-display-area .display-content');

        // --- 3. 动态生成并插入题号网格 ---
        answers.forEach((q, index) => {
            const questionNumber = index + 1;
            const box = document.createElement('div');
            box.className = 'grid-answer-box';

            // (修改) 将题号和答案都放入网格
            box.innerHTML = `
                <span class="grid-q-num">Q${questionNumber}</span>
                <span class="grid-q-ans">${q.rightAnswer}</span>
            `;

            // --- 4. 为每个题号添加点击事件 ---
            box.addEventListener('click', () => {
                // 移除其他所有的高亮
                const currentActive = gridContainer.querySelector('.grid-answer-box.active');
                if (currentActive) {
                    currentActive.classList.remove('active');
                }

                // 高亮当前点击的
                box.classList.add('active');

                // 安全处理HTML内容，防止题目中包含 < > 符号
                const safeTitle = q.title.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                // (修改) 更新下方的显示区域，题目在上，答案在下
                displayContainer.innerHTML = `
                    <div class="display-q-num">第 ${questionNumber} 题</div>
                    <div class="display-q-title">${safeTitle}</div>
                    <div class="display-q-answer">${q.rightAnswer}</div>
                `;
            });

            gridContainer.appendChild(box);
        });

        // --- 5. 使面板可拖动 (仅限头部) ---
        const handle = document.getElementById('answer-panel-header');
        makeDraggable(panel, handle);
    }

    // -------------------------------------------------------------------
    // --- (4) 拖动功能 (仅限标题栏) ---
    // -------------------------------------------------------------------

    function makeDraggable(element, handle) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        handle.onmousedown = (e) => {
            e.preventDefault();
            pos3 = e.clientX;
            pos4 = e.clientY;

            document.onmouseup = () => {
                document.onmouseup = null;
                document.onmousemove = null;
            };

            // --- 错误已从此位置移除 ---

            document.onmousemove = (e) => {
                e.preventDefault();
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                const newTop = element.offsetTop - pos2;
                const newLeft = element.offsetLeft - pos1;

                element.style.top = Math.max(0, Math.min(newTop, window.innerHeight - element.offsetHeight)) + 'px';
                element.style.left = Math.max(0, Math.min(newLeft, window.innerWidth - element.offsetWidth)) + 'px';
            };
        };
    }

})();