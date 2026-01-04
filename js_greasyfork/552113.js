// ==UserScript==
// @name         Jira Activity Module Fullscreen Toggle with AI Analysis
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  Add fullscreen toggle and AI-powered analysis for Jira activity log module.
// @description  为 Jira 活动日志模块添加全屏切换和 AI 分析功能。
// @author       Will
// @license      MIT
// @homepage     https://github.com/jwq2011/TamperMonkey-Scripts
// @supportURL   https://github.com/jwq2011/TamperMonkey-Scripts/issues
// @match        *://jira-sh.xxxxauto.com:8080/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @connect      dashscope.aliyuncs.com
// @require      https://update.greasyfork.org/scripts/506699/marked.js
// @compatible   tampermonkey
// @compatible   violentmonkey
// @compatible   greasemonkey
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/552113/Jira%20Activity%20Module%20Fullscreen%20Toggle%20with%20AI%20Analysis.user.js
// @updateURL https://update.greasyfork.org/scripts/552113/Jira%20Activity%20Module%20Fullscreen%20Toggle%20with%20AI%20Analysis.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.activityFullscreenScriptLoaded) return;
    window.activityFullscreenScriptLoaded = true;

    const DEFAULT_MODELS = ['qwen-plus', 'qwen-max', 'qwen-turbo', 'qwen-flash-2025-07-28', 'qwen-flash', 'qwen-plus-2025-07-14', 'qwen3-30b-a3b-instruct-2507'];
    const DASHSCOPE_API_KEY = GM_getValue('DASHSCOPE_API_KEY', '');
    const MODEL_NAME = GM_getValue('MODEL_NAME', 'qwen-plus');

    GM_addStyle(`
        .activity-fullscreen-btn, .activity-analyze-btn, .activity-config-btn {
            margin-left: 10px;
            padding: 6px 12px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 13px;
            color: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .activity-fullscreen-btn { background-color: #0052cc; }
        .activity-fullscreen-btn.exit { background-color: #d04437; }
        .activity-analyze-btn { background-color: #008000; }
        .activity-config-btn { background-color: #ff9900; }

        #exit-fullscreen-btn {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background-color: #d04437;
            color: white;
            padding: 10px 15px;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        }

        #ai-config-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10001;
            width: 400px;
        }
        #ai-config-modal label {
            display: block;
            margin-top: 10px;
        }
        #ai-config-modal input, #ai-config-modal select {
            width: 100%;
            padding: 6px;
            margin-top: 4px;
        }
        #ai-config-modal button {
            margin-top: 15px;
            padding: 8px 12px;
            background-color: #0052cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
        #overlay {
            position: fixed;
            top: 0; left: 0; right: 0; bottom: 0;
            background: rgba(0,0,0,0.5);
            z-index: 10000;
        }

        /* AI Result Modal */
        #ai-result-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10002;
            width: 80%;
            max-width: 800px;
            max-height: 80vh;
            overflow: hidden;
            resize: both;
            display: flex;
            flex-direction: column;
        }

        #ai-result-header {
            padding: 10px 15px;
            background: #0052cc;
            color: white;
            cursor: move;
            user-select: none;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        #ai-result-close {
            background: none;
            border: none;
            color: white;
            font-size: 18px;
            cursor: pointer;
        }

        #ai-result-content {
            padding: 15px;
            overflow-y: auto;
            flex-grow: 1;
        }

        #ai-result-actions {
            padding: 10px;
            text-align: right;
            border-top: 1px solid #eee;
        }

        #ai-result-actions button {
            margin-left: 10px;
            padding: 6px 12px;
            background-color: #0052cc;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
        }
    `);

    function createButtons() {
        const activityModule = document.getElementById('activitymodule');
        if (!activityModule) return;

        const heading = activityModule.querySelector('#activitymodule_heading');
        if (!heading) return;

        [...heading.querySelectorAll('.activity-fullscreen-btn, .activity-analyze-btn, .activity-config-btn')].forEach(btn => btn.remove());

        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'activity-fullscreen-btn';
        toggleBtn.textContent = '全屏模式';
        toggleBtn.addEventListener('click', toggleFullscreen);
        heading.appendChild(toggleBtn);

        const analyzeBtn = document.createElement('button');
        analyzeBtn.className = 'activity-analyze-btn';
        analyzeBtn.textContent = 'AI 分析';
        analyzeBtn.addEventListener('click', analyzeContent);
        heading.appendChild(analyzeBtn);

        const configBtn = document.createElement('button');
        configBtn.className = 'activity-config-btn';
        configBtn.textContent = '配置';
        configBtn.addEventListener('click', openConfigModal);
        heading.appendChild(configBtn);
    }

    function toggleFullscreen() {
        const activityModule = document.getElementById('activitymodule');
        const toggleBtn = document.querySelector('.activity-fullscreen-btn');
        const isFullscreen = activityModule.classList.contains('fullscreen-active');

        if (!isFullscreen) {
            activityModule.classList.add('fullscreen-active');
            activityModule.style.cssText = `
                position: fixed !important;
                top: 70px !important;
                left: 0 !important;
                right: 0 !important;
                bottom: 0 !important;
                z-index: 9999 !important;
                width: 100% !important;
                height: calc(100% - 70px) !important;
                margin: 0 !important;
                padding: 20px !important;
                overflow-y: auto !important;
                background-color: #fff !important;
                box-shadow: 0 0 15px rgba(0,0,0,0.2) !important;
                box-sizing: border-box !important;
            `;
            document.querySelector('.aui-sidebar')?.style.setProperty('display', 'none', 'important');

            const content = document.querySelector('.issue-body-content');
            content?.querySelectorAll('.module').forEach(module => {
                if (module.id !== 'activitymodule' && module.id !== 'stalker') {
                    module.style.display = 'none';
                    module.dataset.wasHidden = 'true';
                }
            });

            toggleBtn.textContent = '退出全屏';
            toggleBtn.classList.add('exit');

            const exitBtn = document.createElement('button');
            exitBtn.id = 'exit-fullscreen-btn';
            exitBtn.textContent = '退出全屏';
            exitBtn.addEventListener('click', toggleFullscreen);
            document.body.appendChild(exitBtn);

        } else {
            activityModule.classList.remove('fullscreen-active');
            activityModule.style.cssText = '';
            document.querySelector('.aui-sidebar')?.style.removeProperty('display');

            const content = document.querySelector('.issue-body-content');
            content?.querySelectorAll('.module').forEach(module => {
                if (module.dataset.wasHidden === 'true') {
                    module.style.display = '';
                    delete module.dataset.wasHidden;
                }
            });

            toggleBtn.textContent = '全屏模式';
            toggleBtn.classList.remove('exit');
            document.getElementById('exit-fullscreen-btn')?.remove();
        }
    }

    async function analyzeContent() {
        const contentDiv = document.querySelector('.mod-content');
        if (!contentDiv) {
            showResultModal("未找到内容区域");
            return;
        }

        const contentText = contentDiv.innerText.trim();
        if (!contentText) {
            showResultModal("内容为空");
            return;
        }

        showResultModal("正在分析中，请稍候...");

        const prompt = `
你是一名资深项目经理兼技术分析师，请仔细阅读以下 JIRA 活动日志内容，分析并总结以下几点：

1. **关键讨论点**：有哪些重要的讨论、意见分歧或建议？
2. **变更记录**：涉及哪些字段修改、状态流转或责任人调整？
3. **风险与问题**：是否存在延期风险、技术难点、资源瓶颈？
4. **结论与行动项**：最终达成什么共识？谁负责下一步？

日志内容如下：

${contentText}
`;

        try {
            const response = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
                    headers: {
                        'Authorization': `Bearer ${GM_getValue('DASHSCOPE_API_KEY')}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        model: GM_getValue('MODEL_NAME'),
                        messages: [
                            { role: 'system', content: '你是一位经验丰富的项目管理与技术分析专家。' },
                            { role: 'user', content: prompt }
                        ]
                    }),
                    onload: res => resolve(JSON.parse(res.responseText)),
                    onerror: reject
                });
            });

            const result = response.choices?.[0]?.message?.content || '分析失败';
            showResultModal(result);
        } catch (err) {
            console.error(err);
            showResultModal("分析失败，请检查网络或 API 配置");
        }
    }

    function showResultModal(content) {
        // 移除已有弹窗
        const oldOverlay = document.getElementById('overlay');
        const oldModal = document.getElementById('ai-result-modal');
        if (oldOverlay) oldOverlay.remove();
        if (oldModal) oldModal.remove();

        // 创建遮罩层
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        document.body.appendChild(overlay);

        // 创建弹窗主体
        const modal = document.createElement('div');
        modal.id = 'ai-result-modal';

        const header = document.createElement('div');
        header.id = 'ai-result-header';
        header.textContent = 'AI 分析结果';

        const closeBtn = document.createElement('button');
        closeBtn.id = 'ai-result-close';
        closeBtn.innerHTML = '&times;';
        closeBtn.onclick = () => {
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };
        header.appendChild(closeBtn);

        const contentBox = document.createElement('div');
        contentBox.id = 'ai-result-content';
        contentBox.innerHTML = marked.parse(content);

        const actions = document.createElement('div');
        actions.id = 'ai-result-actions';

        const copyBtn = document.createElement('button');
        copyBtn.textContent = '复制';
        copyBtn.onclick = () => {
            navigator.clipboard.writeText(content).then(() => {
                alert("已复制到剪贴板");
            });
        };

        const newWindowBtn = document.createElement('button');
        newWindowBtn.textContent = '新窗口打开';
        newWindowBtn.onclick = () => {
            const win = window.open('', '_blank');
            win.document.write(`
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="UTF-8">
                    <title>AI 分析结果</title>
                    <style>
                        body { font-family: sans-serif; padding: 20px; }
                        pre { white-space: pre-wrap; }
                    </style>
                </head>
                <body>
                    ${marked.parse(content)}
                </body>
                </html>
            `);
            win.document.close();
        };

        actions.appendChild(copyBtn);
        actions.appendChild(newWindowBtn);

        modal.appendChild(header);
        modal.appendChild(contentBox);
        modal.appendChild(actions);
        document.body.appendChild(modal);

        // 拖拽功能
        let isDragging = false;
        let offsetX, offsetY;

        header.onmousedown = (e) => {
            isDragging = true;
            offsetX = e.clientX - modal.getBoundingClientRect().left;
            offsetY = e.clientY - modal.getBoundingClientRect().top;
            modal.style.cursor = 'grabbing';
        };

        document.onmousemove = (e) => {
            if (!isDragging) return;
            modal.style.left = `${e.clientX - offsetX}px`;
            modal.style.top = `${e.clientY - offsetY}px`;
            modal.style.transform = 'none';
        };

        document.onmouseup = () => {
            isDragging = false;
            modal.style.cursor = 'default';
        };
    }

    function openConfigModal() {
        const overlay = document.createElement('div');
        overlay.id = 'overlay';
        document.body.appendChild(overlay);

        const modal = document.createElement('div');
        modal.id = 'ai-config-modal';

        const keyLabel = document.createElement('label');
        keyLabel.textContent = 'API Key';
        const keyInput = document.createElement('input');
        keyInput.type = 'password';
        keyInput.value = GM_getValue('DASHSCOPE_API_KEY', '');
        keyLabel.appendChild(keyInput);

        const modelLabel = document.createElement('label');
        modelLabel.textContent = '模型名称';
        const modelSelect = document.createElement('select');
        DEFAULT_MODELS.forEach(model => {
            const option = document.createElement('option');
            option.value = model;
            option.textContent = model;
            if (model === GM_getValue('MODEL_NAME')) option.selected = true;
            modelSelect.appendChild(option);
        });
        const customOption = document.createElement('option');
        customOption.value = 'custom';
        customOption.textContent = '自定义...';
        modelSelect.appendChild(customOption);
        modelLabel.appendChild(modelSelect);

        const customInput = document.createElement('input');
        customInput.placeholder = '输入模型名称';
        customInput.style.display = modelSelect.value === 'custom' ? 'block' : 'none';
        modelSelect.addEventListener('change', () => {
            customInput.style.display = modelSelect.value === 'custom' ? 'block' : 'none';
        });

        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存配置';
        saveBtn.onclick = () => {
            GM_setValue('DASHSCOPE_API_KEY', keyInput.value);
            const selectedModel = modelSelect.value === 'custom' ? customInput.value : modelSelect.value;
            GM_setValue('MODEL_NAME', selectedModel);
            alert('配置已保存');
            document.body.removeChild(overlay);
            document.body.removeChild(modal);
        };

        modal.appendChild(keyLabel);
        modal.appendChild(modelLabel);
        modal.appendChild(modelSelect);
        modal.appendChild(customInput);
        modal.appendChild(saveBtn);
        document.body.appendChild(modal);
    }

    function initialize() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                createButtons();
            });
        } else {
            createButtons();
        }

        setTimeout(() => {
            if (!document.querySelector('.activity-fullscreen-btn')) {
                createButtons();
            }
        }, 3000);
    }

    initialize();
})();
