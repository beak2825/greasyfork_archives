// ==UserScript==
// @name         微博 AI 概括工具
// @namespace    https://github.com/sixiaolong1117/Tampermonkey
// @version      0.2
// @description  使用 LLM 对微博博文进行 AI 概括总结
// @license      MIT
// @icon         https://weibo.com/favicon.ico
// @author       SI Xiaolong
// @match        https://weibo.com/*
// @match        https://*.weibo.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_notification
// @connect      localhost
// @connect      127.0.0.1
// @connect      cloud.infini-ai.com
// @downloadURL https://update.greasyfork.org/scripts/554604/%E5%BE%AE%E5%8D%9A%20AI%20%E6%A6%82%E6%8B%AC%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/554604/%E5%BE%AE%E5%8D%9A%20AI%20%E6%A6%82%E6%8B%AC%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const DEFAULT_CONFIG = {
        aiProvider: 'ollama', // 'ollama' 或 'infini'
        
        // Ollama 配置
        ollamaUrl: 'http://localhost:11434',
        ollamaModel: 'llama3.2',
        
        // Infini-AI 配置
        infiniApiKey: '',
        infiniModel: 'deepseek-v3.2-exp',
        
        // 通用配置
        maxLength: 1000,
        prompt: '请用简洁的中文总结以下微博内容，提取核心要点，限制在100字以内：'
    };

    // 工具函数：检测深色模式
    const isDarkMode = () => {
        return document.documentElement.classList.contains('theme-dark') ||
               document.body.classList.contains('dark') ||
               window.matchMedia('(prefers-color-scheme: dark)').matches;
    };

    // 工具函数：获取主题颜色
    const getColors = () => {
        const dark = isDarkMode();
        return {
            panelBg: dark ? '#1e1e1e' : '#ffffff',
            panelBorder: dark ? '#444444' : '#1976D2',
            btnContainerBg: dark ? '#2a2a2a' : '#f5f5f5',
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

    class OllamaSummarizer {
        constructor() {
            this.config = this.loadConfig();
            this.initMenu();
            this.observeFeed();
        }

        loadConfig() {
            const saved = GM_getValue('ollama_config');
            return { ...DEFAULT_CONFIG, ...saved };
        }

        saveConfig(config) {
            this.config = { ...this.config, ...config };
            GM_setValue('ollama_config', this.config);
        }

        initMenu() {
            GM_registerMenuCommand('⚙️ AI 设置', () => this.showSettingsPanel());
        }

        // ============ 设置面板相关方法 ============
        
        showSettingsPanel() {
            // 避免重复创建
            if (document.getElementById('ollama-settings-panel')) {
                document.getElementById('ollama-settings-panel').style.display = 'flex';
                return;
            }

            const overlay = this.createOverlay();
            const panel = this.createPanel();
            
            overlay.appendChild(panel);
            document.body.appendChild(overlay);
            
            this.bindSettingsEvents(overlay, panel);
        }

        createOverlay() {
            const overlay = document.createElement('div');
            overlay.id = 'ollama-settings-panel';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 99999;
            `;
            return overlay;
        }

        createPanel() {
            const colors = getColors();
            const panel = document.createElement('div');
            panel.style.cssText = `
                background: ${colors.panelBg};
                border-radius: 12px;
                box-shadow: ${colors.shadow};
                width: 500px;
                max-width: 90%;
                max-height: 80vh;
                overflow-y: auto;
            `;

            panel.innerHTML = `
                ${this.createPanelHeader(colors)}
                ${this.createPanelBody(colors)}
            `;

            return panel;
        }

        createPanelHeader(colors) {
            return `
                <div style="
                    padding: 20px;
                    border-bottom: 2px solid ${colors.panelBorder};
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                ">
                    <h2 style="margin: 0; color: ${colors.textPrimary}; font-size: 20px;">⚙️ AI 设置</h2>
                    <button id="close-settings" style="
                        background: transparent;
                        border: none;
                        font-size: 24px;
                        cursor: pointer;
                        color: ${colors.textSecondary};
                        padding: 0;
                        width: 30px;
                        height: 30px;
                        line-height: 30px;
                    ">×</button>
                </div>
            `;
        }

        createPanelBody(colors) {
            return `
                <div style="padding: 20px;">
                    ${this.createProviderSelector(colors)}
                    ${this.createOllamaSettings(colors)}
                    ${this.createInfiniSettings(colors)}
                    ${this.createCommonSettings(colors)}
                    ${this.createActionButtons(colors)}
                </div>
            `;
        }

        createProviderSelector(colors) {
            return `
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        color: ${colors.textPrimary};
                        font-weight: 500;
                    ">🤖 选择 AI 平台</label>
                    <select id="ai-provider-select" style="
                        width: 100%;
                        padding: 10px;
                        border: 1px solid ${colors.inputBorder};
                        border-radius: 6px;
                        background: ${colors.inputBg};
                        color: ${colors.textPrimary};
                        font-size: 14px;
                        box-sizing: border-box;
                    ">
                        <option value="ollama" ${this.config.aiProvider === 'ollama' ? 'selected' : ''}>Ollama (本地模型)</option>
                        <option value="infini" ${this.config.aiProvider === 'infini' ? 'selected' : ''}>Infini-AI (云端)</option>
                    </select>
                </div>
            `;
        }

        createOllamaSettings(colors) {
            const display = this.config.aiProvider === 'ollama' ? 'block' : 'none';
            return `
                <div id="ollama-settings" style="display: ${display};">
                    <div style="margin-bottom: 20px;">
                        <label style="
                            display: block;
                            margin-bottom: 8px;
                            color: ${colors.textPrimary};
                            font-weight: 500;
                        ">🌐 Ollama 地址</label>
                        <input
                            type="text"
                            id="ollama-url-input"
                            value="${this.config.ollamaUrl}"
                            placeholder="http://localhost:11434"
                            style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid ${colors.inputBorder};
                                border-radius: 6px;
                                background: ${colors.inputBg};
                                color: ${colors.textPrimary};
                                font-size: 14px;
                                box-sizing: border-box;
                            "
                        />
                        <small style="color: ${colors.textSecondary}; display: block; margin-top: 5px;">
                            默认: http://localhost:11434
                        </small>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="
                            display: block;
                            margin-bottom: 8px;
                            color: ${colors.textPrimary};
                            font-weight: 500;
                        ">🧠 模型名称</label>
                        <input
                            type="text"
                            id="ollama-model-input"
                            value="${this.config.ollamaModel}"
                            placeholder="llama3.2"
                            style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid ${colors.inputBorder};
                                border-radius: 6px;
                                background: ${colors.inputBg};
                                color: ${colors.textPrimary};
                                font-size: 14px;
                                box-sizing: border-box;
                            "
                        />
                        <small style="color: ${colors.textSecondary}; display: block; margin-top: 5px;">
                            推荐: llama3.2, qwen2.5:7b, mistral:7b
                        </small>
                    </div>
                </div>
            `;
        }

        createInfiniSettings(colors) {
            const display = this.config.aiProvider === 'infini' ? 'block' : 'none';
            return `
                <div id="infini-settings" style="display: ${display};">
                    <div style="margin-bottom: 20px;">
                        <label style="
                            display: block;
                            margin-bottom: 8px;
                            color: ${colors.textPrimary};
                            font-weight: 500;
                        ">🔑 Infini API Key</label>
                        <input
                            type="password"
                            id="infini-api-key-input"
                            value="${this.config.infiniApiKey}"
                            placeholder="输入 API Key"
                            style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid ${colors.inputBorder};
                                border-radius: 6px;
                                background: ${colors.inputBg};
                                color: ${colors.textPrimary};
                                font-size: 14px;
                                box-sizing: border-box;
                            "
                        />
                        <small style="color: ${colors.textSecondary}; display: block; margin-top: 5px;">
                            访问 <a href="https://cloud.infini-ai.com" target="_blank" style="color: ${colors.infoBtn};">Infini-AI</a> 获取 API Key
                        </small>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <label style="
                            display: block;
                            margin-bottom: 8px;
                            color: ${colors.textPrimary};
                            font-weight: 500;
                        ">🧠 模型名称</label>
                        <input
                            type="text"
                            id="infini-model-input"
                            value="${this.config.infiniModel}"
                            placeholder="deepseek-v3.2-exp"
                            style="
                                width: 100%;
                                padding: 10px;
                                border: 1px solid ${colors.inputBorder};
                                border-radius: 6px;
                                background: ${colors.inputBg};
                                color: ${colors.textPrimary};
                                font-size: 14px;
                                box-sizing: border-box;
                            "
                        />
                        <small style="color: ${colors.textSecondary}; display: block; margin-top: 5px;">
                            推荐: deepseek-v3.2-exp, qwen2.5-72b-instruct
                        </small>
                    </div>
                </div>
            `;
        }

        createCommonSettings(colors) {
            return `
                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        color: ${colors.textPrimary};
                        font-weight: 500;
                    ">📏 最大文本长度（字数）</label>
                    <input
                        type="number"
                        id="max-length-input"
                        value="${this.config.maxLength}"
                        min="500"
                        max="5000"
                        step="100"
                        style="
                            width: 100%;
                            padding: 10px;
                            border: 1px solid ${colors.inputBorder};
                            border-radius: 6px;
                            background: ${colors.inputBg};
                            color: ${colors.textPrimary};
                            font-size: 14px;
                            box-sizing: border-box;
                        "
                    />
                    <small style="color: ${colors.textSecondary}; display: block; margin-top: 5px;">
                        建议: 1000-2000 字（越大越准确，但速度越慢）
                    </small>
                </div>

                <div style="margin-bottom: 20px;">
                    <label style="
                        display: block;
                        margin-bottom: 8px;
                        color: ${colors.textPrimary};
                        font-weight: 500;
                    ">💬 提示词</label>
                    <textarea
                        id="ollama-prompt-input"
                        placeholder="请输入概括提示词"
                        style="
                            width: 100%;
                            padding: 10px;
                            border: 1px solid ${colors.inputBorder};
                            border-radius: 6px;
                            background: ${colors.inputBg};
                            color: ${colors.textPrimary};
                            font-size: 14px;
                            box-sizing: border-box;
                            resize: vertical;
                            min-height: 80px;
                        "
                    >${this.config.prompt}</textarea>
                    <small style="color: ${colors.textSecondary}; display: block; margin-top: 5px;">
                        用于指导AI如何概括微博内容
                    </small>
                </div>
            `;
        }

        createActionButtons(colors) {
            return `
                <button id="test-connection" style="
                    width: 100%;
                    padding: 12px;
                    background: ${colors.infoBtn};
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    margin-bottom: 15px;
                ">🔌 测试连接</button>

                <div id="test-result" style="
                    padding: 10px;
                    border-radius: 6px;
                    font-size: 13px;
                    display: none;
                    margin-bottom: 15px;
                "></div>

                <div style="display: flex; gap: 10px;">
                    <button id="save-settings" style="
                        flex: 1;
                        padding: 12px;
                        background: ${colors.successBtn};
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                    ">💾 保存设置</button>

                    <button id="reset-settings" style="
                        flex: 1;
                        padding: 12px;
                        background: ${colors.warningBtn};
                        color: white;
                        border: none;
                        border-radius: 6px;
                        cursor: pointer;
                        font-size: 14px;
                        font-weight: 500;
                    ">🔄 恢复默认</button>
                </div>
            `;
        }

        bindSettingsEvents(overlay, panel) {
            const closePanel = () => {
                overlay.style.display = 'none';
            };

            // 关闭按钮
            panel.querySelector('#close-settings').onclick = closePanel;
            overlay.onclick = (e) => {
                if (e.target === overlay) closePanel();
            };

            // AI 平台切换
            panel.querySelector('#ai-provider-select').addEventListener('change', (e) => {
                const isOllama = e.target.value === 'ollama';
                panel.querySelector('#ollama-settings').style.display = isOllama ? 'block' : 'none';
                panel.querySelector('#infini-settings').style.display = isOllama ? 'none' : 'block';
            });

            // 测试连接
            panel.querySelector('#test-connection').onclick = () => this.testConnection(panel);

            // 保存设置
            panel.querySelector('#save-settings').onclick = () => this.saveSettings(panel, closePanel);

            // 恢复默认
            panel.querySelector('#reset-settings').onclick = () => this.resetSettings(panel);
        }

        async testConnection(panel) {
            const testBtn = panel.querySelector('#test-connection');
            const testResult = panel.querySelector('#test-result');
            const colors = getColors();
            
            const provider = panel.querySelector('#ai-provider-select').value;

            testBtn.disabled = true;
            testBtn.textContent = '🔄 测试中...';
            testResult.style.display = 'block';
            testResult.style.background = colors.inputBg;
            testResult.style.color = colors.textSecondary;
            testResult.textContent = '正在连接...';

            try {
                if (provider === 'ollama') {
                    await this.testOllamaConnection(panel, testResult, colors);
                } else {
                    await this.testInfiniConnection(panel, testResult, colors);
                }
            } catch (error) {
                testResult.style.background = colors.errorBg;
                testResult.style.color = colors.errorText;
                testResult.textContent = `❌ 连接失败: ${error.message}`;
            }

            testBtn.disabled = false;
            testBtn.textContent = '🔌 测试连接';
        }

        testOllamaConnection(panel, testResult, colors) {
            const url = panel.querySelector('#ollama-url-input').value;

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `${url}/api/tags`,
                    timeout: 5000,
                    onload: (response) => {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            const models = data.models || [];
                            testResult.style.background = '#e8f5e9';
                            testResult.style.color = '#2e7d32';
                            testResult.innerHTML = `
                                ✅ 连接成功！<br>
                                发现 ${models.length} 个模型: ${models.map(m => m.name).join(', ') || '无'}
                            `;
                            resolve();
                        } else {
                            reject(new Error(`HTTP ${response.status}`));
                        }
                    },
                    onerror: reject,
                    ontimeout: () => reject(new Error('连接超时'))
                });
            });
        }

        testInfiniConnection(panel, testResult, colors) {
            const apiKey = panel.querySelector('#infini-api-key-input').value.trim();
            const model = panel.querySelector('#infini-model-input').value.trim();

            if (!apiKey) {
                testResult.style.background = colors.errorBg;
                testResult.style.color = colors.errorText;
                testResult.textContent = '❌ 请先输入 API Key';
                return Promise.reject(new Error('未输入 API Key'));
            }

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://cloud.infini-ai.com/maas/v1/chat/completions',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        model: model,
                        messages: [{ role: 'user', content: 'test' }],
                        max_tokens: 10
                    }),
                    timeout: 10000,
                    onload: (response) => {
                        if (response.status === 200) {
                            testResult.style.background = '#e8f5e9';
                            testResult.style.color = '#2e7d32';
                            testResult.innerHTML = `✅ 连接成功！<br>模型: ${model}`;
                            resolve();
                        } else {
                            reject(new Error(`API 错误: ${response.status}`));
                        }
                    },
                    onerror: reject,
                    ontimeout: () => reject(new Error('连接超时'))
                });
            });
        }

        saveSettings(panel, closePanel) {
            const provider = panel.querySelector('#ai-provider-select').value;
            const maxLength = parseInt(panel.querySelector('#max-length-input').value);
            const prompt = panel.querySelector('#ollama-prompt-input').value.trim();

            // 验证通用配置
            if (maxLength < 500 || maxLength > 5000) {
                alert('❌ 最大文本长度必须在 500-5000 之间！');
                return;
            }

            const newConfig = {
                aiProvider: provider,
                maxLength: maxLength,
                prompt: prompt
            };

            // 验证并保存 Ollama 配置
            if (provider === 'ollama') {
                const url = panel.querySelector('#ollama-url-input').value.trim();
                const model = panel.querySelector('#ollama-model-input').value.trim();

                if (!url || !model) {
                    alert('❌ 请填写完整的 Ollama 配置！');
                    return;
                }

                newConfig.ollamaUrl = url;
                newConfig.ollamaModel = model;
            }
            // 验证并保存 Infini 配置
            else if (provider === 'infini') {
                const apiKey = panel.querySelector('#infini-api-key-input').value.trim();
                const model = panel.querySelector('#infini-model-input').value.trim();

                if (!apiKey || !model) {
                    alert('❌ 请填写完整的 Infini-AI 配置！');
                    return;
                }

                newConfig.infiniApiKey = apiKey;
                newConfig.infiniModel = model;
            }

            this.saveConfig(newConfig);
            alert('✅ 设置已保存！');
            closePanel();
        }

        resetSettings(panel) {
            if (confirm('确定要恢复默认设置吗？')) {
                panel.querySelector('#ai-provider-select').value = DEFAULT_CONFIG.aiProvider;
                panel.querySelector('#ollama-url-input').value = DEFAULT_CONFIG.ollamaUrl;
                panel.querySelector('#ollama-model-input').value = DEFAULT_CONFIG.ollamaModel;
                panel.querySelector('#infini-api-key-input').value = DEFAULT_CONFIG.infiniApiKey;
                panel.querySelector('#infini-model-input').value = DEFAULT_CONFIG.infiniModel;
                panel.querySelector('#max-length-input').value = DEFAULT_CONFIG.maxLength;
                panel.querySelector('#ollama-prompt-input').value = DEFAULT_CONFIG.prompt;
                
                // 触发平台切换事件
                const event = new Event('change');
                panel.querySelector('#ai-provider-select').dispatchEvent(event);
            }
        }

        // ============ AI 调用相关方法 ============

        async callAI(content) {
            const fullPrompt = this.config.prompt + '\n\n' + content;
            
            if (this.config.aiProvider === 'infini') {
                return await this.callInfiniAI(fullPrompt);
            } else {
                return await this.callOllamaAPI(fullPrompt);
            }
        }

        callOllamaAPI(prompt) {
            return new Promise((resolve, reject) => {
                const payload = {
                    model: this.config.ollamaModel,
                    prompt: prompt,
                    stream: false
                };

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${this.config.ollamaUrl}/api/generate`,
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify(payload),
                    responseType: 'json',
                    timeout: 60000,
                    onload: (response) => {
                        if (response.status === 200) {
                            const data = response.response;
                            resolve(data.response || '无返回内容');
                        } else {
                            reject(new Error(`Ollama API 错误: ${response.status}`));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error(`网络错误: ${error.statusText || 'Unknown'}`));
                    },
                    ontimeout: () => {
                        reject(new Error('请求超时'));
                    }
                });
            });
        }

        callInfiniAI(prompt) {
            return new Promise((resolve, reject) => {
                if (!this.config.infiniApiKey) {
                    reject(new Error('未配置 Infini API Key'));
                    return;
                }

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: 'https://cloud.infini-ai.com/maas/v1/chat/completions',
                    headers: {
                        'Authorization': `Bearer ${this.config.infiniApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    data: JSON.stringify({
                        model: this.config.infiniModel,
                        messages: [
                            { role: 'user', content: prompt }
                        ]
                    }),
                    timeout: 60000,
                    onload: (response) => {
                        if (response.status === 200) {
                            try {
                                const data = JSON.parse(response.responseText);
                                const result = data.choices?.[0]?.message?.content || '无返回内容';
                                resolve(result);
                            } catch (e) {
                                reject(new Error('解析响应失败'));
                            }
                        } else {
                            reject(new Error(`Infini API 错误: ${response.status}`));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error(`网络错误: ${error.statusText || 'Unknown'}`));
                    },
                    ontimeout: () => {
                        reject(new Error('请求超时'));
                    }
                });
            });
        }

        // ============ 微博相关方法 ============

        observeFeed() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) {
                            this.processFeedItems(node);
                        }
                    });
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            // 初始处理
            this.processFeedItems(document.body);
        }

        processFeedItems(container) {
            const feedItems = container.querySelectorAll?.('.Feed_body_3R0rO') || [];

            feedItems.forEach((feedItem) => {
                if (feedItem.querySelector('.weibo-ai-summary-btn')) return;

                const header = feedItem.querySelector('.woo-box-flex');
                const content = feedItem.querySelector('.detail_wbtext_4CRf9');

                if (header && content) {
                    this.addSummaryButton(header, content);
                }
            });
        }

        addSummaryButton(header, contentElement) {
            // 尝试多个可能的位置插入按钮，避免和用户名交互冲突
            const possibleParents = [
                header.querySelector('.head_main_4K3n4'), // 头部主容器
                header.querySelector('.woo-box-flex'),    // flex 容器
                header                                     // 最后兜底：直接插入 header
            ];

            let targetParent = null;
            for (const parent of possibleParents) {
                if (parent && !parent.classList.contains('head_name_24eEB')) {
                    targetParent = parent;
                    break;
                }
            }

            if (!targetParent) return;

            // 创建按钮容器，独立于用户名
            const buttonContainer = document.createElement('div');
            buttonContainer.className = 'weibo-ai-button-container';
            buttonContainer.style.cssText = `
                display: inline-flex;
                align-items: center;
                margin-left: 10px;
                flex-shrink: 0;
            `;

            const button = document.createElement('button');
            button.className = 'weibo-ai-summary-btn';
            button.textContent = 'AI 概括';
            button.style.cssText = `
                padding: 2px 8px;
                border: 1px solid #d0d0d0;
                border-radius: 3px;
                background: transparent;
                color: #8590a6;
                font-size: 12px;
                cursor: pointer;
                transition: all 0.2s;
                flex-shrink: 0;
            `;

            // 悬停效果
            button.addEventListener('mouseenter', () => {
                button.style.borderColor = '#667eea';
                button.style.color = '#667eea';
                button.style.background = 'rgba(102, 126, 234, 0.05)';
            });

            button.addEventListener('mouseleave', () => {
                button.style.borderColor = '#d0d0d0';
                button.style.color = '#8590a6';
                button.style.background = 'transparent';
            });

            // 阻止事件冒泡，避免触发父元素的点击事件
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
                this.summarizeContent(contentElement, button);
            });

            // 阻止容器的点击事件冒泡
            buttonContainer.addEventListener('click', (e) => {
                e.stopPropagation();
            });

            buttonContainer.appendChild(button);

            // 插入到合适的位置
            if (targetParent === header) {
                // 如果是直接插入 header，添加到第一个子元素后面
                const firstChild = header.firstElementChild;
                if (firstChild && firstChild.nextSibling) {
                    header.insertBefore(buttonContainer, firstChild.nextSibling);
                } else {
                    header.appendChild(buttonContainer);
                }
            } else {
                targetParent.appendChild(buttonContainer);
            }
        }

        async summarizeContent(contentElement, button) {
            const originalText = button.textContent;
            button.textContent = '概括中...';
            button.disabled = true;

            try {
                const content = this.extractTextContent(contentElement);
                const summary = await this.callAI(content);
                this.showSummaryPopup(summary, contentElement);
            } catch (error) {
                console.error('概括失败:', error);
                GM_notification({
                    text: `概括失败: ${error.message}`,
                    title: 'AI 概括错误',
                    timeout: 3000
                });
            } finally {
                button.textContent = originalText;
                button.disabled = false;
            }
        }

        extractTextContent(element) {
            let text = element.textContent || element.innerText || '';
            // 清理文本，移除多余空格和换行
            text = text.replace(/\s+/g, ' ').trim();
            // 限制长度
            return text.substring(0, this.config.maxLength);
        }

        showSummaryPopup(summary, contentElement) {
            // 移除已存在的弹窗
            const existingPopup = document.querySelector('.weibo-summary-popup');
            if (existingPopup) {
                existingPopup.remove();
            }

            const colors = getColors();

            const popup = document.createElement('div');
            popup.className = 'weibo-summary-popup';
            popup.style.cssText = `
                position: absolute;
                background: ${colors.panelBg};
                border: 1px solid ${colors.panelBorder};
                border-radius: 8px;
                padding: 15px;
                max-width: 400px;
                box-shadow: ${colors.shadow};
                z-index: 1000;
                font-family: system-ui, -apple-system, sans-serif;
                font-size: 14px;
                line-height: 1.5;
                color: ${colors.textPrimary};
            `;

            const providerName = this.config.aiProvider === 'infini' 
                ? `Infini-AI (${this.config.infiniModel})`
                : `Ollama (${this.config.ollamaModel})`;

            popup.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <strong style="color: #667eea;">AI 概括</strong>
                    <button class="close-popup" style="background: none; border: none; font-size: 16px; cursor: pointer; color: ${colors.textSecondary};">×</button>
                </div>
                <div class="summary-content" style="white-space: pre-wrap; margin-bottom: 10px;">${summary}</div>
                <div style="font-size: 12px; color: ${colors.textSecondary}; text-align: right;">
                    ${providerName}
                </div>
            `;

            // 定位弹窗
            const rect = contentElement.getBoundingClientRect();
            popup.style.top = `${rect.bottom + window.scrollY + 10}px`;
            popup.style.left = `${rect.left + window.scrollX}px`;

            document.body.appendChild(popup);

            // 关闭按钮事件
            popup.querySelector('.close-popup').addEventListener('click', () => {
                popup.remove();
            });

            // 点击外部关闭
            setTimeout(() => {
                const closeHandler = (e) => {
                    if (!popup.contains(e.target)) {
                        popup.remove();
                        document.removeEventListener('click', closeHandler);
                    }
                };
                document.addEventListener('click', closeHandler);
            }, 100);
        }
    }

    // 初始化
    let initialized = false;
    function init() {
        if (!initialized && document.querySelector('.Feed_body_3R0rO')) {
            initialized = true;
            new OllamaSummarizer();
        }
    }

    // 页面加载时初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 处理动态加载的内容
    setInterval(init, 1000);
})();