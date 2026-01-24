// ==UserScript==
// @name         禅道Bug详情AI标准化助手
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  在禅道Bug详情页自动抓取标题和历史记录，调用DeepSeek API生成标准化分析内容
// @author       鞠卓瀚
// @match        https://www.j-do.cn:9012/zentao/bug-view-*.html
// @match        https://www.j-do.cn:9012/zentao/bug-edit-*.html
// @grant        GM_xmlhttpRequest
// @connect      api.deepseek.com
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/563721/%E7%A6%85%E9%81%93Bug%E8%AF%A6%E6%83%85AI%E6%A0%87%E5%87%86%E5%8C%96%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/563721/%E7%A6%85%E9%81%93Bug%E8%AF%A6%E6%83%85AI%E6%A0%87%E5%87%86%E5%8C%96%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 配置区 ====================
    const CONFIG = {
        // 页面选择器配置
        TITLE_SELECTOR: '#mainMenu .page-title .text',
        HISTORY_SELECTOR: '.detail.histories .detail-content',
        ANCHOR_SELECTOR: '#mainMenu',

        // DeepSeek API 配置
        API_URL: 'https://api.deepseek.com/chat/completions',
        API_MODEL: 'deepseek-chat',

        // System Prompt（固定，不可编辑）
        SYSTEM_PROMPT: `你是一个专业的软件开发与测试协作助手。你的任务是根据 Bug 背景信息，生成结构化、工程化的分析内容，用于开发与测试之间的沟通记录。

核心要求：
1. 语言自然、去除AI味道，像真人开发写的
2. 不使用"可能"、"猜测"、"推测"等模糊用语
3. 仅基于输入内容分析，不自行补充逻辑或假设
4. 语气中性，适合团队协作记录
5. 用中文回答，工程化表达`,

        // 默认 User Prompt（用户可编辑）
        DEFAULT_PROMPT: `请根据以下 bug 背景，生成标准分析内容，格式如下：

Bug背景：
\`\`\`
{pageInfo}
{userInput}
\`\`\`

输出要求：
1. **Bug原因**：基于描述内容进行分析。若背景中包含排查结论或合理怀疑，请据此客观陈述；若未能确认原因，需明确说明"暂未排查出具体原因"，并仅保留分析过程与已验证信息；禁止自行推测或编造逻辑。
2. **解决方案**：结合当前定位情况，说明已采取或计划的处理措施，包括兜底方案、日志补充、或进一步排查方向。
3. **测试点**：列出测试应验证的场景、数据特征和回归范围。
4. 辛苦测试老师测试了 + 一个emoji

内容规范：
* 每项 2–5 句，语言自然去除ai味道、工程化，用中文回答！！很重要；
* 不使用"可能""猜测""推测"等模糊用语；
* 仅基于输入内容分析，不自行补充逻辑或假设；
* 语气中性，适合开发与测试协作记录。`
    };

    // ==================== 工具函数 ====================

    // 等待元素出现
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const element = document.querySelector(selector);
            if (element) {
                resolve(element);
                return;
            }

            const observer = new MutationObserver(() => {
                const element = document.querySelector(selector);
                if (element) {
                    observer.disconnect();
                    resolve(element);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                reject(new Error(`元素未找到: ${selector}`));
            }, timeout);
        });
    }

    // 提取纯文本（保留换行，去除多余空白）
    function extractText(element) {
        if (!element) return '';

        // 克隆节点避免影响原页面
        const clone = element.cloneNode(true);

        // 移除脚本和样式标签
        clone.querySelectorAll('script, style, button').forEach(el => el.remove());

        // 获取文本内容
        let text = clone.innerText || clone.textContent || '';

        // 清理多余空白，但保留换行
        text = text.replace(/[ \t]+/g, ' ')  // 多个空格/tab合并为一个空格
                   .replace(/\n\s+/g, '\n')   // 行首空白去除
                   .replace(/\s+\n/g, '\n')   // 行尾空白去除
                   .replace(/\n{3,}/g, '\n\n') // 多个换行合并为两个
                   .trim();

        return text;
    }

    // 从 localStorage 读取 API Key
    function getApiKey() {
        return localStorage.getItem('chandao_deepseek_apikey') || '';
    }

    // 保存 API Key 到 localStorage
    function saveApiKey(key) {
        localStorage.setItem('chandao_deepseek_apikey', key);
    }

    // 从 localStorage 读取 Prompt
    function getPrompt() {
        return localStorage.getItem('chandao_prompt') || CONFIG.DEFAULT_PROMPT;
    }

    // 保存 Prompt 到 localStorage
    function savePrompt(prompt) {
        localStorage.setItem('chandao_prompt', prompt);
    }

    // 调用 DeepSeek API（流式返回）
    function callDeepSeekAPI(apiKey, userPrompt, onProgress) {
        return new Promise((resolve, reject) => {
            let fullContent = '';

            GM_xmlhttpRequest({
                method: 'POST',
                url: CONFIG.API_URL,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                data: JSON.stringify({
                    model: CONFIG.API_MODEL,
                    messages: [
                        {
                            role: 'system',
                            content: CONFIG.SYSTEM_PROMPT
                        },
                        {
                            role: 'user',
                            content: userPrompt
                        }
                    ],
                    stream: true
                }),
                timeout: 60000,
                onprogress: function(response) {
                    // 流式返回时实时处理
                    try {
                        const text = response.responseText;
                        const lines = text.split('\n');
                        fullContent = '';

                        for (let line of lines) {
                            line = line.trim();
                            if (line.startsWith('data: ')) {
                                const data = line.substring(6);
                                if (data === '[DONE]') continue;

                                try {
                                    const json = JSON.parse(data);
                                    const delta = json.choices[0]?.delta?.content;
                                    if (delta) {
                                        fullContent += delta;
                                    }
                                } catch (e) {
                                    // 忽略解析错误
                                }
                            }
                        }

                        if (onProgress && fullContent) {
                            // 实时转换并显示
                            const htmlContent = markdownToHtml(fullContent);
                            onProgress(htmlContent);
                        }
                    } catch (e) {
                        console.error('流式处理错误:', e);
                    }
                },
                onload: function(response) {
                    if (response.status === 200) {
                        // 最终处理
                        try {
                            const text = response.responseText;
                            const lines = text.split('\n');
                            fullContent = '';

                            for (let line of lines) {
                                line = line.trim();
                                if (line.startsWith('data: ')) {
                                    const data = line.substring(6);
                                    if (data === '[DONE]') continue;

                                    try {
                                        const json = JSON.parse(data);
                                        const delta = json.choices[0]?.delta?.content;
                                        if (delta) {
                                            fullContent += delta;
                                        }
                                    } catch (e) {
                                        // 忽略解析错误
                                    }
                                }
                            }

                            if (fullContent) {
                                resolve(fullContent);
                            } else {
                                reject(new Error('未收到有效响应内容'));
                            }
                        } catch (e) {
                            reject(new Error('解析响应失败: ' + e.message));
                        }
                    } else {
                        reject(new Error(`API请求失败 (${response.status}): ${response.responseText}`));
                    }
                },
                onerror: function(error) {
                    reject(new Error('网络请求失败: ' + JSON.stringify(error)));
                },
                ontimeout: function() {
                    reject(new Error('请求超时，请检查网络连接'));
                }
            });
        });
    }

    // 复制到剪贴板
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        try {
            document.execCommand('copy');
            return true;
        } catch (e) {
            console.error('复制失败:', e);
            return false;
        } finally {
            document.body.removeChild(textarea);
        }
    }

    // 将 Markdown 转换为 HTML
    function markdownToHtml(markdown) {
        if (!markdown) return '';

        let html = markdown;

        // 转换粗体 **text** 或 __text__ 为 <strong>text</strong>
        html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        html = html.replace(/__(.+?)__/g, '<strong>$1</strong>');

        // 转换斜体 *text* 或 _text_ 为 <em>text</em>
        html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
        html = html.replace(/_(.+?)_/g, '<em>$1</em>');

        // 转换换行符为 <br />
        html = html.replace(/\n/g, '<br />');

        // 转换段落（两个换行符）为 <p>
        html = html.replace(/<br \/><br \/>/g, '</p><p>');

        // 包裹在 <p> 标签中
        if (!html.startsWith('<p>')) {
            html = '<p>' + html + '</p>';
        }

        return html;
    }

    // ==================== UI 创建 ====================

    function createUI() {
        const panel = document.createElement('div');
        panel.id = 'chandao-ai-panel';
        panel.innerHTML = `
            <style>
                #chandao-ai-panel {
                    position: fixed;
                    top: 80px;
                    right: 20px;
                    width: 450px;
                    max-height: 80vh;
                    background: #fff;
                    border: 1px solid #ccc;
                    border-radius: 4px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    z-index: 9999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                #chandao-ai-panel.minimized {
                    height: auto;
                    max-height: none;
                }
                #chandao-ai-panel.minimized .panel-body {
                    display: none;
                }
                .panel-header {
                    background: #f5f5f5;
                    border-bottom: 1px solid #ddd;
                    color: #333;
                    padding: 10px 12px;
                    font-weight: 600;
                    font-size: 14px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    cursor: move;
                    user-select: none;
                }
                .panel-header-title {
                    flex: 1;
                }
                .panel-header-actions {
                    display: flex;
                    gap: 6px;
                }
                .panel-header-btn {
                    background: #e0e0e0;
                    border: none;
                    color: #666;
                    width: 22px;
                    height: 22px;
                    border-radius: 3px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 16px;
                }
                .panel-header-btn:hover {
                    background: #d0d0d0;
                }
                .panel-body {
                    padding: 12px;
                    overflow-y: auto;
                    flex: 1;
                }
                .form-group {
                    margin-bottom: 12px;
                }
                .form-label {
                    display: block;
                    margin-bottom: 4px;
                    font-size: 12px;
                    font-weight: 500;
                    color: #333;
                }
                .form-input, .form-textarea {
                    width: 100%;
                    padding: 6px 8px;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                    font-size: 12px;
                    box-sizing: border-box;
                    font-family: inherit;
                }
                .form-input:focus, .form-textarea:focus {
                    outline: none;
                    border-color: #4a90e2;
                }
                .form-textarea {
                    resize: vertical;
                    min-height: 60px;
                }
                .form-textarea.large {
                    min-height: 120px;
                    font-family: monospace;
                    font-size: 11px;
                }
                .btn {
                    padding: 8px 16px;
                    border: 1px solid #ddd;
                    border-radius: 3px;
                    font-size: 12px;
                    font-weight: 500;
                    cursor: pointer;
                    background: #fff;
                    color: #333;
                }
                .btn:hover:not(:disabled) {
                    background: #f5f5f5;
                }
                .btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .btn-primary {
                    background: #4a90e2;
                    color: white;
                    border-color: #4a90e2;
                    width: 100%;
                }
                .btn-primary:hover:not(:disabled) {
                    background: #357abd;
                }
                .btn-secondary {
                    margin-top: 6px;
                }
                .output-area {
                    background: #fafafa;
                    border: 1px solid #e0e0e0;
                    border-radius: 3px;
                    padding: 10px;
                    font-size: 12px;
                    line-height: 1.6;
                    max-height: 300px;
                    overflow-y: auto;
                    color: #333;
                }
                .output-area.empty {
                    color: #999;
                    font-style: italic;
                }
                .output-area.error {
                    background: #fff5f5;
                    border-color: #ffcccc;
                    color: #cc0000;
                }
                .status-text {
                    font-size: 11px;
                    color: #666;
                    margin-top: 6px;
                    text-align: center;
                }
                .status-text.error {
                    color: #cc0000;
                }
                .status-text.success {
                    color: #00aa00;
                }
                .collapsible-section {
                    margin-bottom: 12px;
                }
                .collapsible-header {
                    cursor: pointer;
                    user-select: none;
                    padding: 6px 8px;
                    background: #f9f9f9;
                    border: 1px solid #e0e0e0;
                    border-radius: 3px;
                    font-size: 12px;
                    font-weight: 500;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .collapsible-header:hover {
                    background: #f0f0f0;
                }
                .collapsible-content {
                    margin-top: 6px;
                }
                .collapsible-content.collapsed {
                    display: none;
                }
                .toggle-icon {
                    font-size: 10px;
                }
            </style>
            <div class="panel-header" id="panel-drag-handle">
                <div class="panel-header-title">🤖 AI标准化助手</div>
                <div class="panel-header-actions">
                    <button class="panel-header-btn" id="btn-minimize" title="最小化">−</button>
                    <button class="panel-header-btn" id="btn-close" title="关闭">×</button>
                </div>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label class="form-label">DeepSeek API Key *</label>
                    <input type="text" class="form-input" id="input-apikey" placeholder="请输入您的API Key" />
                </div>

                <div class="collapsible-section">
                    <div class="collapsible-header" id="prompt-section-header">
                        <span>Prompt 模板（可编辑）</span>
                        <span class="toggle-icon">▼</span>
                    </div>
                    <div class="collapsible-content collapsed" id="prompt-section-content">
                        <div style="font-size: 11px; color: #666; margin-bottom: 6px; line-height: 1.4;">
                            � 提示：Prompt 中需要两个参数<br/>
                            • {页面获取的信息} - 自动抓取标题和历史记录<br/>
                            • {用户输入的信息} - 下方输入框填写的解决方案
                        </div>
                        <textarea class="form-textarea large" id="input-prompt" placeholder="输入 Prompt 模板..."></textarea>
                        <button class="btn btn-secondary" id="btn-reset-prompt" style="margin-top: 6px; width: 100%;">🔄 恢复默认 Prompt</button>
                    </div>
                </div>

                <div class="form-group">
                    <label class="form-label">用户输入的解决方案（可选）</label>
                    <textarea class="form-textarea" id="input-supplement" placeholder="输入你的解决方案、排查过程、修复措施等..."></textarea>
                </div>
                <div class="form-group">
                    <button class="btn btn-primary" id="btn-generate">生成标准化内容</button>
                </div>
                <div class="form-group">
                    <label class="form-label">AI 生成结果</label>
                    <div class="output-area empty" id="output-result">等待生成...</div>
                    <button class="btn btn-secondary" id="btn-copy" style="display:none;">📋 一键复制</button>
                    <div class="status-text" id="status-text"></div>
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 加载保存的 API Key 和 Prompt
        const savedKey = getApiKey();
        if (savedKey) {
            document.getElementById('input-apikey').value = savedKey;
        }

        const savedPrompt = getPrompt();
        const promptInput = document.getElementById('input-prompt');
        if (promptInput) {
            promptInput.value = savedPrompt;
            console.log('Prompt 已加载，长度:', savedPrompt.length);
        }

        // 绑定事件
        bindEvents(panel);
        makeDraggable(panel);

        return panel;
    }

    // 绑定事件
    function bindEvents(panel) {
        const btnGenerate = document.getElementById('btn-generate');
        const btnCopy = document.getElementById('btn-copy');
        const btnClose = document.getElementById('btn-close');
        const btnMinimize = document.getElementById('btn-minimize');
        const btnResetPrompt = document.getElementById('btn-reset-prompt');
        const inputApiKey = document.getElementById('input-apikey');
        const inputPrompt = document.getElementById('input-prompt');
        const promptSectionHeader = document.getElementById('prompt-section-header');
        const promptSectionContent = document.getElementById('prompt-section-content');

        // 生成按钮
        btnGenerate.addEventListener('click', handleGenerate);

        // 复制按钮
        btnCopy.addEventListener('click', () => {
            const output = document.getElementById('output-result');
            const htmlContent = output.innerHTML;

            // 创建临时元素用于复制 HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            tempDiv.style.position = 'fixed';
            tempDiv.style.left = '-9999px';

            document.body.appendChild(tempDiv);

            // 选择内容
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(tempDiv);
            selection.removeAllRanges();
            selection.addRange(range);

            try {
                // 复制为富文本（保留 HTML 格式）
                const success = document.execCommand('copy');
                if (success) {
                    showStatus('已复制到剪贴板（HTML格式，可直接粘贴到禅道）', 'success');
                } else {
                    throw new Error('复制命令失败');
                }
            } catch (e) {
                console.error('复制失败:', e);
                showStatus('复制失败，请手动复制', 'error');
            } finally {
                document.body.removeChild(tempDiv);
                selection.removeAllRanges();
            }
        });

        // 关闭按钮
        btnClose.addEventListener('click', () => {
            panel.style.display = 'none';
        });

        // 最小化按钮
        btnMinimize.addEventListener('click', () => {
            panel.classList.toggle('minimized');
            btnMinimize.textContent = panel.classList.contains('minimized') ? '+' : '−';
        });

        // 恢复默认 Prompt 按钮
        btnResetPrompt.addEventListener('click', () => {
            if (confirm('确定要恢复默认 Prompt 吗？')) {
                inputPrompt.value = CONFIG.DEFAULT_PROMPT;
                savePrompt(CONFIG.DEFAULT_PROMPT);
                showStatus('已恢复默认 Prompt', 'success');
            }
        });

        // API Key 保存
        inputApiKey.addEventListener('blur', () => {
            saveApiKey(inputApiKey.value.trim());
        });

        // Prompt 保存
        inputPrompt.addEventListener('blur', () => {
            savePrompt(inputPrompt.value.trim());
        });

        // Prompt 折叠/展开
        promptSectionHeader.addEventListener('click', () => {
            promptSectionContent.classList.toggle('collapsed');
            const icon = promptSectionHeader.querySelector('.toggle-icon');
            icon.textContent = promptSectionContent.classList.contains('collapsed') ? '▼' : '▲';
        });
    }

    // 拖拽功能
    function makeDraggable(panel) {
        const handle = document.getElementById('panel-drag-handle');
        let isDragging = false;
        let currentX, currentY, initialX, initialY;

        handle.addEventListener('mousedown', (e) => {
            if (e.target.closest('.panel-header-btn')) return;
            isDragging = true;
            initialX = e.clientX - panel.offsetLeft;
            initialY = e.clientY - panel.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            panel.style.left = currentX + 'px';
            panel.style.top = currentY + 'px';
            panel.style.right = 'auto';
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    // 显示状态信息
    function showStatus(message, type = '') {
        const statusText = document.getElementById('status-text');
        statusText.textContent = message;
        statusText.className = 'status-text ' + type;
    }

    // 处理生成请求
    async function handleGenerate() {
        const btnGenerate = document.getElementById('btn-generate');
        const btnCopy = document.getElementById('btn-copy');
        const output = document.getElementById('output-result');
        const apiKey = document.getElementById('input-apikey').value.trim();
        const promptTemplate = document.getElementById('input-prompt').value.trim();
        const userSolution = document.getElementById('input-supplement').value.trim();

        // 验证 API Key
        if (!apiKey) {
            output.textContent = '❌ 请先填写 DeepSeek API Key';
            output.className = 'output-area error';
            btnCopy.style.display = 'none';
            showStatus('请填写API Key', 'error');
            return;
        }

        // 验证 Prompt
        if (!promptTemplate) {
            output.textContent = '❌ Prompt 模板不能为空';
            output.className = 'output-area error';
            btnCopy.style.display = 'none';
            showStatus('请填写Prompt模板', 'error');
            return;
        }

        // 禁用按钮
        btnGenerate.disabled = true;
        btnGenerate.textContent = '生成中...';
        btnCopy.style.display = 'none';
        output.textContent = '正在调用 AI 生成内容，请稍候...';
        output.className = 'output-area';
        showStatus('正在生成...', '');

        try {
            // 抓取页面内容
            const bugTitle = await extractBugTitle();
            const bugHistory = await extractBugHistory();

            console.log('抓取到的标题:', bugTitle);
            console.log('抓取到的历史记录长度:', bugHistory?.length || 0);

            if (!bugTitle && !bugHistory) {
                throw new Error('未能抓取到Bug标题或历史记录，请检查页面结构');
            }

            // 构建完整的 prompt
            const fullPrompt = buildFullPrompt(promptTemplate, bugTitle, bugHistory, userSolution);
            console.log('完整 Prompt 长度:', fullPrompt.length);
            console.log('完整 Prompt 预览:', fullPrompt.substring(0, 200) + '...');

            // 调用 API（流式返回）
            const result = await callDeepSeekAPI(apiKey, fullPrompt, (partialContent) => {
                // 实时更新输出区域
                output.innerHTML = partialContent || '生成中...';
                output.className = 'output-area';
            });

            console.log('AI 返回结果长度:', result?.length || 0);

            // 转换 Markdown 为 HTML
            const htmlResult = markdownToHtml(result);
            console.log('转换后 HTML 长度:', htmlResult?.length || 0);

            // 显示最终结果
            output.innerHTML = htmlResult || '（无返回内容）';
            output.className = 'output-area';
            btnCopy.style.display = 'block';
            showStatus('生成成功！', 'success');

        } catch (error) {
            output.textContent = '❌ ' + error.message;
            output.className = 'output-area error';
            showStatus('生成失败', 'error');
            console.error('生成失败:', error);
        } finally {
            btnGenerate.disabled = false;
            btnGenerate.textContent = '生成标准化内容';
        }
    }

    // 提取Bug标题
    async function extractBugTitle() {
        try {
            const titleElement = await waitForElement(CONFIG.TITLE_SELECTOR, 3000);
            return extractText(titleElement);
        } catch (e) {
            console.warn('未找到标题元素:', e);
            return '';
        }
    }

    // 提取Bug历史记录
    async function extractBugHistory() {
        try {
            const historyElement = await waitForElement(CONFIG.HISTORY_SELECTOR, 3000);
            return extractText(historyElement);
        } catch (e) {
            console.warn('未找到历史记录元素:', e);
            return '';
        }
    }

    // 构建完整的 Prompt（替换占位符）
    function buildFullPrompt(promptTemplate, title, history, userSolution) {
        // 第一部分：页面获取的信息（pageInfo）
        let pageInfo = '';
        if (title) {
            pageInfo += `标题：${title}\n\n`;
        }
        if (history) {
            pageInfo += `历史记录：\n${history}`;
        }

        // 第二部分：用户输入的信息（userInput）
        let userInput = userSolution || '（无）';

        // 替换 Prompt 模板中的两个参数变量
        let fullPrompt = promptTemplate
            .replace('{pageInfo}', pageInfo)
            .replace('{userInput}', userInput);

        return fullPrompt;
    }

    // ==================== 监听页面变化 ====================

    function observePageChanges() {
        const observer = new MutationObserver((mutations) => {
            // 当标题或历史记录区域更新时，可以在这里添加逻辑
            // 目前保持简单，不自动重新抓取
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // ==================== 初始化 ====================

    function init() {
        // 等待页面加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // 检查是否在Bug详情页或编辑页
        if (!window.location.href.match(/bug-(view|edit)-\d+\.html/)) {
            console.log('不在Bug详情页或编辑页，脚本不运行');
            return;
        }

        // 创建UI
        setTimeout(() => {
            createUI();
            observePageChanges();
            console.log('禅道Bug详情AI标准化助手已加载');
        }, 1000);
    }

    // 启动
    init();

})();
