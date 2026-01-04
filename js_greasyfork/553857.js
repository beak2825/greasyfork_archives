// ==UserScript==
// @name         知乎 ETC 检测器
// @namespace    https://github.com/sixiaolong1117/Tampermonkey
// @version      0.2
// @description  在回答详情页使用，用 LLM 检测评论质量，标红存在阅读障碍的用户
// @license      MIT
// @icon         https://zhihu.com/favicon.ico
// @author       SI Xiaolong
// @match        https://www.zhihu.com/question/*/answer/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @connect      localhost
// @connect      127.0.0.1
// @connect      www.zhihu.com
// @connect      cloud.infini-ai.com
// @downloadURL https://update.greasyfork.org/scripts/553857/%E7%9F%A5%E4%B9%8E%20ETC%20%E6%A3%80%E6%B5%8B%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/553857/%E7%9F%A5%E4%B9%8E%20ETC%20%E6%A3%80%E6%B5%8B%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置项
    const CONFIG = {
        aiProvider: GM_getValue('aiProvider', 'ollama'), // 当前使用的 AI 平台
        contextLength: GM_getValue('contextLength', 3000),

        // Ollama 配置
        ollamaUrl: GM_getValue('ollamaUrl', 'http://localhost:11434'),
        ollamaModel: GM_getValue('ollamaModel', 'qwen2.5:7b'),

        // Infini-AI 配置
        infiniApiKey: GM_getValue('infiniApiKey', ''),
        infiniModel: GM_getValue('infiniModel', 'deepseek-v3.2-exp')
    };

    // 检测深色模式
    const isDarkMode = () => {
        return document.documentElement.classList.contains('theme-dark') ||
            document.body.classList.contains('dark') ||
            window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    // 获取自适应颜色
    const getColors = () => {
        const dark = isDarkMode();
        return {
            panelBg: dark ? '#1e1e1e' : '#ffffff',
            panelBorder: dark ? '#444444' : '#1976D2',
            btnContainerBg: dark ? '#2a2a2a' : '#f5f5f5',
            commentBorder: dark ? '#444444' : '#e0e0e0',
            commentBg: dark ? 'transparent' : 'transparent',
            textPrimary: dark ? '#e0e0e0' : '#333333',
            textSecondary: dark ? '#b0b0b0' : '#666666',
            primaryBtn: dark ? '#1565C0' : '#1976D2',
            successBtn: dark ? '#2E7D32' : '#4caf50',
            infoBtn: dark ? '#0277BD' : '#00ACC1',
            warningBtn: dark ? '#E65100' : '#FF6F00',
            errorBg: dark ? '#3d1f1f' : '#ffebee',
            errorBorder: dark ? '#8B0000' : '#ef5350',
            errorText: dark ? '#ff6b6b' : '#c62828',
            shadow: dark ? '0 4px 12px rgba(0,0,0,0.5)' : '0 4px 12px rgba(0,0,0,0.15)',
            inputBg: dark ? '#2a2a2a' : '#ffffff',
            inputBorder: dark ? '#555555' : '#cccccc'
        };
    };

    // 显示设置面板
    function showSettingsPanel() {
        if (document.getElementById('ai-settings-panel')) {
            document.getElementById('ai-settings-panel').style.display = 'flex';
            return;
        }

        const colors = getColors();
        const overlay = document.createElement('div');
        overlay.id = 'ai-settings-panel';
        overlay.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.5); display: flex; justify-content: center;
        align-items: center; z-index: 99999;
    `;

        const panel = document.createElement('div');
        panel.style.cssText = `
        background: ${colors.panelBg};
        border-radius: 12px;
        box-shadow: ${colors.shadow};
        width: 500px; max-width: 90%; max-height: 80vh; overflow-y: auto;
    `;

        panel.innerHTML = `
        <div style="padding:20px; border-bottom:2px solid ${colors.panelBorder};
            display:flex; justify-content:space-between; align-items:center;">
            <h2 style="margin:0; color:${colors.textPrimary}; font-size:20px;">⚙️ AI 设置</h2>
            <button id="close-settings" style="background:transparent;border:none;
                font-size:24px;cursor:pointer;color:${colors.textSecondary};">×</button>
        </div>

        <div style="padding:20px;">
            <!-- AI 平台选择 -->
            <div style="margin-bottom:20px;">
                <label style="display:block;margin-bottom:8px;color:${colors.textPrimary};font-weight:500;">🤖 选择 AI 平台</label>
                <select id="ai-provider-select" style="
                    display:block;
                    width:calc(100% - 4px);
                    padding:10px 12px;
                    margin-top:4px;
                    border:1px solid ${colors.inputBorder};
                    border-radius:8px;
                    background:${colors.inputBg};
                    color:${colors.textPrimary};
                    font-size:14px;
                    box-sizing:border-box;
                ">
                    <option value="ollama" ${CONFIG.aiProvider === 'ollama' ? 'selected' : ''}>Ollama (本地模型)</option>
                    <option value="infini" ${CONFIG.aiProvider === 'infini' ? 'selected' : ''}>Infini-AI (云端)</option>
                </select>
            </div>

            <!-- Ollama 设置 -->
            <div id="ollama-settings" style="margin-bottom:20px;display:${CONFIG.aiProvider === 'ollama' ? 'block' : 'none'};">
                <label style="display:block;margin-bottom:8px;color:${colors.textPrimary};">🌐 Ollama 地址</label>
                <input id="ollama-url-input" type="text" value="${CONFIG.ollamaUrl}"
                    placeholder="http://localhost:11434" style="
                    display:block;
                    width:calc(100% - 4px);
                    padding:10px 12px;
                    margin-top:4px;
                    border:1px solid ${colors.inputBorder};
                    border-radius:8px;
                    background:${colors.inputBg};
                    color:${colors.textPrimary};
                    font-size:14px;
                    box-sizing:border-box;
                ">
                <label style="display:block;margin-top:12px;margin-bottom:8px;color:${colors.textPrimary};">🧠 模型名称</label>
                <input id="ollama-model-input" type="text" value="${CONFIG.ollamaModel}"
                    placeholder="qwen2.5:7b" style="
                    display:block;
                    width:calc(100% - 4px);
                    padding:10px 12px;
                    margin-top:4px;
                    border:1px solid ${colors.inputBorder};
                    border-radius:8px;
                    background:${colors.inputBg};
                    color:${colors.textPrimary};
                    font-size:14px;
                    box-sizing:border-box;
                ">
            </div>

            <!-- Infini-AI 设置 -->
            <div id="infini-settings" style="margin-bottom:20px;display:${CONFIG.aiProvider === 'infini' ? 'block' : 'none'};">
                <label style="display:block;margin-bottom:8px;color:${colors.textPrimary};">🔑 Infini API Key</label>
                <input id="infini-api-key-input" type="password" value="${CONFIG.infiniApiKey}" placeholder="输入 API Key" style="
                    display:block;
                    width:calc(100% - 4px);
                    padding:10px 12px;
                    margin-top:4px;
                    border:1px solid ${colors.inputBorder};
                    border-radius:8px;
                    background:${colors.inputBg};
                    color:${colors.textPrimary};
                    font-size:14px;
                    box-sizing:border-box;
                ">
                <label style="display:block;margin-top:12px;margin-bottom:8px;color:${colors.textPrimary};">🧠 模型名称</label>
                <input id="infini-model-input" type="text" value="${CONFIG.infiniModel}" placeholder="deepseek-v3.2-exp" style="
                    display:block;
                    width:calc(100% - 4px);
                    padding:10px 12px;
                    margin-top:4px;
                    border:1px solid ${colors.inputBorder};
                    border-radius:8px;
                    background:${colors.inputBg};
                    color:${colors.textPrimary};
                    font-size:14px;
                    box-sizing:border-box;
                ">
            </div>

            <!-- 上下文长度 -->
            <div style="margin-bottom:20px;">
                <label style="display:block;margin-bottom:8px;color:${colors.textPrimary};font-weight:500;">📏 上下文长度（字）</label>
                <input id="context-length-input" type="number" value="${CONFIG.contextLength}" min="1000" max="10000" step="500"
                    style="
                    display:block;
                    width:calc(100% - 4px);
                    padding:10px 12px;
                    margin-top:4px;
                    border:1px solid ${colors.inputBorder};
                    border-radius:8px;
                    background:${colors.inputBg};
                    color:${colors.textPrimary};
                    font-size:14px;
                    box-sizing:border-box;
                ">
            </div>

            <!-- 按钮区 -->
            <div style="display:flex;gap:10px;">
                <button id="save-settings" style="flex:1;padding:12px;background:${colors.successBtn};
                    color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;">💾 保存</button>
                <button id="reset-settings" style="flex:1;padding:12px;background:${colors.warningBtn};
                    color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;">🔄 恢复默认</button>
            </div>
        </div>
    `;

        overlay.appendChild(panel);
        document.body.appendChild(overlay);

        // 切换 AI 平台动态显示对应设置
        const providerSelect = panel.querySelector('#ai-provider-select');
        providerSelect.addEventListener('change', e => {
            document.getElementById('ollama-settings').style.display = e.target.value === 'ollama' ? 'block' : 'none';
            document.getElementById('infini-settings').style.display = e.target.value === 'infini' ? 'block' : 'none';
        });

        document.getElementById('close-settings').onclick = () => overlay.remove();

        // 保存设置
        document.getElementById('save-settings').onclick = () => {
            CONFIG.aiProvider = providerSelect.value;
            CONFIG.contextLength = parseInt(document.getElementById('context-length-input').value);

            CONFIG.ollamaUrl = document.getElementById('ollama-url-input').value.trim();
            CONFIG.ollamaModel = document.getElementById('ollama-model-input').value.trim();

            CONFIG.infiniApiKey = document.getElementById('infini-api-key-input').value.trim();
            CONFIG.infiniModel = document.getElementById('infini-model-input').value.trim();

            for (const k in CONFIG) GM_setValue(k, CONFIG[k]);

            alert('✅ 设置已保存');
            overlay.remove();
        };

        // 恢复默认
        document.getElementById('reset-settings').onclick = () => {
            if (confirm('确定要恢复默认设置吗？')) {
                document.getElementById('ai-provider-select').value = 'ollama';
                document.getElementById('ollama-url-input').value = 'http://localhost:11434';
                document.getElementById('ollama-model-input').value = 'qwen2.5:7b';
                document.getElementById('context-length-input').value = '3000';
                document.getElementById('infini-api-key-input').value = '';
                document.getElementById('infini-model-input').value = 'deepseek-v3.2-exp';
            }
        };
    }

    // 添加菜单命令
    GM_registerMenuCommand('打开设置面板', showSettingsPanel);

    // 调用 Ollama API
    function callOllama(prompt) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CONFIG.ollamaUrl}/api/generate`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    model: CONFIG.ollamaModel,
                    prompt: prompt,
                    stream: false
                }),
                timeout: 90000, // 增加超时时间到90秒
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data.response);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: function (error) {
                    reject(error);
                },
                ontimeout: function () {
                    reject(new Error('请求超时'));
                }
            });
        });
    }

    // Infini-AI API 调用函数
    function callInfiniAI(prompt) {
        return new Promise((resolve, reject) => {
            const apiKey = CONFIG.infiniApiKey;
            if (!apiKey) {
                return reject(new Error('未设置 Infini API Key'));
            }

            GM_xmlhttpRequest({
                method: 'POST',
                url: 'https://cloud.infini-ai.com/maas/v1/chat/completions',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify({
                    model: CONFIG.infiniModel,
                    messages: [
                        { role: 'user', content: prompt }
                    ]
                }),
                timeout: 90000,
                onload: function (response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const result = data.choices?.[0]?.message?.content || '';
                        resolve(result);
                    } catch (e) {
                        reject(e);
                    }
                },
                onerror: reject,
                ontimeout: () => reject(new Error('Infini 请求超时'))
            });
        });
    }

    // 获取回答信息
    function getAnswerInfo() {
        const answerItem = document.querySelector('.ContentItem.AnswerItem');
        if (!answerItem) return null;

        const dataZop = answerItem.getAttribute('data-zop');
        let title = '未知问题';
        let answerId = '';

        if (dataZop) {
            try {
                const zopData = JSON.parse(dataZop.replace(/&quot;/g, '"'));
                title = zopData.title || title;
                answerId = zopData.itemId || '';
            } catch (e) {
                console.error('解析 data-zop 失败:', e);
            }
        }

        const contentElement = answerItem.querySelector('.RichContent-inner');
        let answerContent = '';
        if (contentElement) {
            answerContent = contentElement.textContent.trim();
        }

        const metaUrl = answerItem.querySelector('meta[itemprop="url"]');
        const answerUrl = metaUrl ? metaUrl.getAttribute('content') : '';

        return {
            title,
            answerId,
            answerContent,
            answerItem,
            answerUrl
        };
    }

    // 分析评论质量（使用更严格的提示词）
    async function analyzeComment(title, answerContent, commentContent) {
        // 使用配置的上下文长度
        const answerSummary = answerContent.substring(0, CONFIG.contextLength);

        const prompt = `你是一个评论质量分析助手，请根据以下逻辑严格判断评论是否属于“明显的抬杠行为”。

问题标题：
${title}

回答内容（前${CONFIG.contextLength}字）：
${answerSummary}

评论内容：
${commentContent}

----------------------------
【判断流程（必须严格按顺序执行）】

第一步：评论是否在反驳回答？
- 如果评论只是补充、提问、感谢、相关讨论 → 判定为「正常评论」
- 如果评论明确表达不同意、反对、质疑回答核心观点 → 继续第二步

第二步：评论是否阅读了回答？
- 如果评论的反驳内容在回答中已有明确解释，但评论仍质疑 → 判定为「抬杠（未读回答）」
- 如果评论的反驳内容明显脱离回答主题、与问题无关 → 判定为「抬杠（不相关）」
- 否则 → 继续第三步

第三步：评论是否理解了回答？
- 如果评论明显曲解了回答的核心观点（回答说明A，评论理解成B） → 判定为「抬杠（曲解）」
- 如果评论断章取义、选择性理解，只截取片段反驳整体 → 判定为「抬杠（断章取义）」
- 否则 → 继续第四步

第四步：评论是否合理反驳？
- 如果评论提出的反驳有逻辑、有一定事实或个人经验依据 → 判定为「正常评论」
- 如果评论的反驳明显无理（逻辑错误、常识错误、纯粹反对而反对） → 判定为「抬杠（无理反驳）」

----------------------------
【排除条件】
以下情况一律视为「正常评论」：
- 评论观点与回答不同但仍有合理依据
- 评论表达粗鲁但内容有逻辑
- 评论确实看了回答，只是理解角度不同
- 评论内容无法确定是否反驳或有歧义

【最终判定输出格式】  
请严格按照以下格式回答（不要有多余内容）：  
抬杠|具体理由  
或  
正常评论|具体理由  

理由必须简短具体（≤30字），说明关键判断依据。`;


        try {
            let response = '';
            if (CONFIG.aiProvider === 'infini') {
                response = await callInfiniAI(prompt);
            } else if (CONFIG.aiProvider === 'ollama') {
                response = await callOllama(prompt);
            } else {
                throw new Error(`未知的 AI 平台: ${CONFIG.aiProvider}`);
            }

            const parts = response.trim().split('|');
            const judgment = parts[0] || '';
            const reason = parts[1] || response.trim();
            const isLowQuality = judgment.includes('抬杠');

            return { isLowQuality, reason, fullResponse: response.trim() };
        } catch (error) {
            console.error('AI 分析失败:', error);
            throw error;
        }
    }

    // 标红评论
    function markCommentAsLowQuality(commentDiv, reason) {
        const colors = getColors();
        commentDiv.style.backgroundColor = colors.errorBg;
        commentDiv.style.border = `2px solid ${colors.errorBorder}`;
        commentDiv.style.borderRadius = '4px';

        const badge = document.createElement('div');
        badge.style.cssText = `
            display: inline-block;
            padding: 4px 8px;
            background: ${colors.errorBorder};
            color: white;
            border-radius: 3px;
            font-size: 12px;
            margin-left: 10px;
            font-weight: bold;
        `;
        badge.textContent = '🚫 抬杠';
        badge.title = reason;

        const metaLine = commentDiv.querySelector('.CommentItemV2-metaLine, .CommentItemV2-meta');
        if (metaLine) {
            metaLine.appendChild(badge);
        }
    }

    // 处理单个评论
    async function processComment(commentDiv, answerInfo, statusSpan) {
        const commentId = commentDiv.getAttribute('data-id');
        const commentText = commentDiv.textContent.trim();

        if (!commentText || commentText.length < 5) {
            statusSpan.textContent = '⏭️ 跳过（太短）';
            statusSpan.style.color = '#999';
            return;
        }

        statusSpan.textContent = '🔍 分析中...';
        statusSpan.style.color = '#2196F3';

        try {
            const result = await analyzeComment(
                answerInfo.title,
                answerInfo.answerContent,
                commentText
            );

            const colors = getColors();

            if (result.isLowQuality) {
                statusSpan.innerHTML = `
                    <span style="color: #ef5350; font-weight: bold;">🚫 抬杠</span>
                    <span style="color: ${colors.textSecondary}; margin-left: 8px; font-size: 11px;">
                        ${result.reason}
                    </span>
                `;
                statusSpan.title = `完整判定：${result.fullResponse}`;
                markCommentAsLowQuality(commentDiv, result.fullResponse);
            } else {
                statusSpan.innerHTML = `
                    <span style="color: #4caf50; font-weight: bold;">✅ 正常</span>
                    <span style="color: ${colors.textSecondary}; margin-left: 8px; font-size: 11px;">
                        ${result.reason}
                    </span>
                `;
                statusSpan.title = `完整判定：${result.fullResponse}`;
            }
        } catch (error) {
            statusSpan.textContent = '❌ 错误';
            statusSpan.style.color = '#f44336';
            statusSpan.title = error.message;
            console.error('处理评论失败:', error);
        }
    }

    // 添加检测按钮到每个评论
    function addDetectionButtons() {
        const answerInfo = getAnswerInfo();
        if (!answerInfo) {
            console.error('无法获取回答信息');
            console.log('❌ 无法获取回答信息，请刷新页面后重试');
            return;
        }

        const colors = getColors();

        let commentDivs = [];

        commentDivs = Array.from(document.querySelectorAll('[data-id^="1"]')).filter(el => {
            const dataId = el.getAttribute('data-id');
            return dataId && dataId.length > 10 && el.closest('.Comments-container');
        });

        if (commentDivs.length === 0) {
            const possibleSelectors = [
                '.CommentItemV2',
                '.CommentItem',
                '.Comment',
                '[class*="Comment"]',
                '.css-18ld3w0 > div'
            ];

            for (const selector of possibleSelectors) {
                const elements = document.querySelectorAll(selector);
                if (elements.length > 0) {
                    commentDivs = Array.from(elements).filter(el =>
                        el.getAttribute('data-id') || el.textContent.trim().length > 20
                    );
                    if (commentDivs.length > 0) {
                        console.log(`✅ 使用选择器 ${selector} 找到 ${commentDivs.length} 条评论`);
                        break;
                    }
                }
            }
        }

        if (commentDivs.length === 0) {
            console.log('❌ 未找到评论');
            return;
        }

        console.log(`✅ 找到 ${commentDivs.length} 条评论`);
        let successCount = 0;

        commentDivs.forEach((commentDiv, index) => {
            if (commentDiv.querySelector('.ai-detect-btn')) {
                console.log(`评论 ${index + 1} 已有检测按钮，跳过`);
                return;
            }

            const commentId = commentDiv.getAttribute('data-id') || `temp_${index}`;

            const btnContainer = document.createElement('div');
            btnContainer.style.cssText = `
                display: inline-flex;
                align-items: center;
                gap: 8px;
                margin: 8px 0;
                padding: 4px 8px;
                background: ${colors.btnContainerBg};
                border-radius: 4px;
            `;

            const detectBtn = document.createElement('button');
            detectBtn.className = 'ai-detect-btn';
            detectBtn.style.cssText = `
                padding: 4px 10px;
                background: ${colors.primaryBtn};
                color: white;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                font-weight: 500;
                transition: all 0.3s;
            `;
            detectBtn.textContent = '🤖 检测';
            detectBtn.title = '使用 AI 检测评论质量';

            const statusSpan = document.createElement('span');
            statusSpan.style.cssText = `
                font-size: 12px;
                font-weight: 500;
                color: ${colors.textSecondary};
            `;

            detectBtn.onclick = async () => {
                detectBtn.disabled = true;
                detectBtn.style.opacity = '0.5';
                detectBtn.style.cursor = 'not-allowed';
                await processComment(commentDiv, answerInfo, statusSpan);
                detectBtn.disabled = false;
                detectBtn.style.opacity = '1';
                detectBtn.style.cursor = 'pointer';
            };

            btnContainer.appendChild(detectBtn);
            btnContainer.appendChild(statusSpan);

            let inserted = false;

            const metaSelectors = [
                '.CommentItemV2-metaLine',
                '.CommentItemV2-meta',
                '.CommentItem-meta',
                '[class*="meta"]',
                '[class*="Meta"]'
            ];

            for (const selector of metaSelectors) {
                const metaLine = commentDiv.querySelector(selector);
                if (metaLine) {
                    metaLine.appendChild(btnContainer);
                    inserted = true;
                    console.log(`✅ 评论 ${index + 1} 按钮已插入到 ${selector}`);
                    break;
                }
            }

            if (!inserted) {
                commentDiv.appendChild(btnContainer);
                inserted = true;
                console.log(`✅ 评论 ${index + 1} 按钮已追加到评论末尾`);
            }

            if (inserted) {
                successCount++;
                commentDiv.style.border = `1px solid ${colors.commentBorder}`;
                commentDiv.style.padding = '8px';
                commentDiv.style.marginBottom = '8px';
                commentDiv.style.borderRadius = '4px';
            }
        });

        console.log(`✅ 成功为 ${successCount}/${commentDivs.length} 条评论添加检测按钮`);
    }

    // 使面板可拖动
    function makeDraggable(element) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        let isDragging = false;

        const dragHandle = element.querySelector('#drag-handle');
        if (!dragHandle) return;

        dragHandle.style.cursor = 'move';
        dragHandle.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e.preventDefault();
            isDragging = true;
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            document.onmousemove = elementDrag;
            element.style.transition = 'none';
        }

        function elementDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;

            let newTop = element.offsetTop - pos2;
            let newLeft = element.offsetLeft - pos1;

            const maxX = window.innerWidth - element.offsetWidth;
            const maxY = window.innerHeight - element.offsetHeight;

            newLeft = Math.max(0, Math.min(newLeft, maxX));
            newTop = Math.max(0, Math.min(newTop, maxY));

            element.style.top = newTop + "px";
            element.style.left = newLeft + "px";
            element.style.right = 'auto';
        }

        function closeDragElement() {
            isDragging = false;
            document.onmouseup = null;
            document.onmousemove = null;
            element.style.transition = '';
        }
    }

    // 添加全局检测按钮
    function addGlobalDetectionButton() {
        if (document.getElementById('global-detect-panel')) return;

        const colors = getColors();

        const panel = document.createElement('div');
        panel.id = 'global-detect-panel';
        panel.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${colors.panelBg};
            border: 2px solid ${colors.panelBorder};
            border-radius: 8px;
            box-shadow: ${colors.shadow};
            z-index: 10000;
            min-width: 220px;
            transition: box-shadow 0.3s;
        `;

        panel.innerHTML = `
            <div id="drag-handle" style="
                padding: 12px 15px;
                font-weight: bold;
                font-size: 16px;
                color: ${colors.panelBorder};
                border-bottom: 1px solid ${colors.panelBorder};
                background: ${colors.btnContainerBg};
                border-radius: 6px 6px 0 0;
                user-select: none;
            ">
                🤖 AI 评论检测 <span style="float: right; font-size: 14px; color: ${colors.textSecondary};">✋</span>
            </div>
            <div style="padding: 15px;">
                <button id="open-settings" style="
                    width: 100%;
                    padding: 10px;
                    background: ${colors.infoBtn};
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 8px;
                    transition: opacity 0.3s;
                ">⚙️ 打开设置</button>
                <button id="add-detect-buttons" style="
                    width: 100%;
                    padding: 10px;
                    background: ${colors.primaryBtn};
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 8px;
                    transition: opacity 0.3s;
                ">📌 添加检测按钮</button>
                <button id="batch-detect" style="
                    width: 100%;
                    padding: 10px;
                    background: ${colors.successBtn};
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                ">🚀 批量检测全部</button>
                <div id="batch-progress" style="
                    margin-top: 10px;
                    font-size: 12px;
                    color: ${colors.textSecondary};
                    display: none;
                "></div>
                <div style="
                    margin-top: 10px;
                    padding: 8px;
                    background: ${colors.btnContainerBg};
                    border-radius: 4px;
                    font-size: 11px;
                    color: ${colors.textSecondary};
                ">
                    ${(() => {
                        const aiProvider = GM_getValue('aiProvider', 'ollama');
                        const contextLength = GM_getValue('contextLength', 3000);
                        const ollamaModel = GM_getValue('ollamaModel', 'qwen2.5:7b');
                        const infiniModel = GM_getValue('infiniModel', 'deepseek-v3.2-exp');
                        const engineName = aiProvider === 'infini'
                            ? `Infini-AI (${infiniModel})`
                            : `Ollama (${ollamaModel})`;
                        return `⚙️ 引擎: ${engineName}<br>📊 上下文: ${contextLength} 字`;
                    })()}
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        makeDraggable(panel);

        const dragHandle = panel.querySelector('#drag-handle');
        dragHandle.addEventListener('mouseenter', () => {
            panel.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
        });
        dragHandle.addEventListener('mouseleave', () => {
            panel.style.boxShadow = colors.shadow;
        });

        const buttons = panel.querySelectorAll('button');
        buttons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.opacity = '0.85';
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.opacity = '1';
            });
        });

        // 打开设置面板
        document.getElementById('open-settings').onclick = () => {
            showSettingsPanel();
        };

        // 添加检测按钮
        document.getElementById('add-detect-buttons').onclick = () => {
            addDetectionButtons();
        };

        // 批量检测
        document.getElementById('batch-detect').onclick = async () => {
            const answerInfo = getAnswerInfo();
            if (!answerInfo) {
                alert('无法获取回答信息');
                return;
            }

            let commentDivs = [];

            commentDivs = Array.from(document.querySelectorAll('[data-id^="1"]')).filter(el => {
                const dataId = el.getAttribute('data-id');
                return dataId && dataId.length > 10 && el.closest('.Comments-container');
            });

            if (commentDivs.length === 0) {
                const possibleSelectors = [
                    '.CommentItemV2',
                    '.CommentItem',
                    '.Comment',
                    '[class*="Comment"]',
                    '.css-18ld3w0 > div'
                ];

                for (const selector of possibleSelectors) {
                    const elements = document.querySelectorAll(selector);
                    if (elements.length > 0) {
                        commentDivs = Array.from(elements).filter(el =>
                            el.getAttribute('data-id') || el.textContent.trim().length > 20
                        );
                        if (commentDivs.length > 0) break;
                    }
                }
            }

            if (commentDivs.length === 0) {
                alert('未找到评论');
                return;
            }

            const progressDiv = document.getElementById('batch-progress');
            progressDiv.style.display = 'block';
            const batchBtn = document.getElementById('batch-detect');
            batchBtn.disabled = true;
            batchBtn.style.opacity = '0.5';

            for (let i = 0; i < commentDivs.length; i++) {
                const commentDiv = commentDivs[i];
                progressDiv.textContent = `进度: ${i + 1}/${commentDivs.length}`;

                let statusSpan = commentDiv.querySelector('.temp-status');
                if (!statusSpan) {
                    statusSpan = document.createElement('span');
                    statusSpan.className = 'temp-status';
                    statusSpan.style.cssText = 'margin-left: 10px; font-size: 12px; font-weight: bold;';

                    const metaSelectors = [
                        '.CommentItemV2-metaLine',
                        '.CommentItemV2-meta',
                        '.CommentItem-meta',
                        '[class*="meta"]'
                    ];

                    let inserted = false;
                    for (const selector of metaSelectors) {
                        const metaLine = commentDiv.querySelector(selector);
                        if (metaLine) {
                            metaLine.appendChild(statusSpan);
                            inserted = true;
                            break;
                        }
                    }

                    if (!inserted) {
                        commentDiv.appendChild(statusSpan);
                    }
                }

                await processComment(commentDiv, answerInfo, statusSpan);
                await new Promise(resolve => setTimeout(resolve, 1000));
            }

            const colors = getColors();
            progressDiv.textContent = '✅ 批量检测完成！';
            progressDiv.style.color = colors.successBtn;
            batchBtn.disabled = false;
            batchBtn.style.opacity = '1';
        };
    }

    // 初始化
    function init() {
        console.log('知乎评论智能检测器已启动');
        console.log('当前配置:', {
            useInfini: CONFIG.useInfini,
            infiniModel: CONFIG.infiniModel,
            ollamaModel: CONFIG.ollamaModel,
            contextLength: CONFIG.contextLength
        });

        setTimeout(() => {
            addGlobalDetectionButton();
        }, 2000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();