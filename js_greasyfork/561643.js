// ==UserScript==
// @name         威软AI聚合
// @namespace    https://weiruan.org
// @version      1.0.0
// @description  聚合多个热门AI平台，支持API接口调用，多AI分工协作
// @author       威软科技开发
// @license      All Rights Reserved - 修改代码需要作者许可
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @connect      api.openai.com
// @connect      api.anthropic.com
// @connect      api.siliconflow.cn
// @connect      api.ohmygpt.com
// @connect      api.deepseek.com
// @connect      api.moonshot.cn
// @connect      api.minimax.chat
// @connect      api.baichuan-ai.com
// @connect      api.zhipuai.cn
// @connect      dashscope.aliyuncs.com
// @connect      aip.baidubce.com
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/561643/%E5%A8%81%E8%BD%AFAI%E8%81%9A%E5%90%88.user.js
// @updateURL https://update.greasyfork.org/scripts/561643/%E5%A8%81%E8%BD%AFAI%E8%81%9A%E5%90%88.meta.js
// ==/UserScript==

/**
 * ============================================
 * 威软AI聚合 (WeiRuan AI Aggregator)
 * ============================================
 * 版权所有 (C) 2024 威软科技
 *
 * 本软件受版权法保护。未经作者书面许可，
 * 禁止修改、分发或用于商业目的。
 *
 * 联系方式：威软科技
 * ============================================
 */

(function() {
    'use strict';

    // ==================== 配置区域 ====================
    const CONFIG = {
        version: '1.0.0',
        author: '威软科技开发',
        copyright: '© 2024 威软科技 - 修改代码需要作者许可',

        // AI平台配置
        platforms: {
            // OpenAI
            openai: {
                name: 'OpenAI (ChatGPT)',
                baseUrl: 'https://api.openai.com/v1',
                models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-3.5-turbo'],
                defaultModel: 'gpt-4o-mini',
                authType: 'Bearer'
            },
            // Anthropic Claude
            anthropic: {
                name: 'Anthropic (Claude)',
                baseUrl: 'https://api.anthropic.com/v1',
                models: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
                defaultModel: 'claude-3-haiku-20240307',
                authType: 'x-api-key'
            },
            // SiliconFlow
            siliconflow: {
                name: 'SiliconFlow',
                baseUrl: 'https://api.siliconflow.cn/v1',
                models: ['deepseek-ai/DeepSeek-V2.5', 'Qwen/Qwen2.5-72B-Instruct', 'meta-llama/Meta-Llama-3.1-405B-Instruct'],
                defaultModel: 'deepseek-ai/DeepSeek-V2.5',
                authType: 'Bearer'
            },
            // OhMyGPT
            ohmygpt: {
                name: 'OhMyGPT',
                baseUrl: 'https://api.ohmygpt.com/v1',
                models: ['gpt-4o', 'gpt-4o-mini', 'claude-3-opus', 'claude-3-sonnet'],
                defaultModel: 'gpt-4o-mini',
                authType: 'Bearer'
            },
            // DeepSeek
            deepseek: {
                name: 'DeepSeek',
                baseUrl: 'https://api.deepseek.com/v1',
                models: ['deepseek-chat', 'deepseek-coder'],
                defaultModel: 'deepseek-chat',
                authType: 'Bearer'
            },
            // Moonshot (Kimi)
            moonshot: {
                name: 'Moonshot (Kimi)',
                baseUrl: 'https://api.moonshot.cn/v1',
                models: ['moonshot-v1-8k', 'moonshot-v1-32k', 'moonshot-v1-128k'],
                defaultModel: 'moonshot-v1-8k',
                authType: 'Bearer'
            },
            // 智谱AI
            zhipu: {
                name: '智谱AI (GLM)',
                baseUrl: 'https://open.bigmodel.cn/api/paas/v4',
                models: ['glm-4', 'glm-4-flash', 'glm-3-turbo'],
                defaultModel: 'glm-4-flash',
                authType: 'Bearer'
            },
            // 通义千问
            qwen: {
                name: '通义千问',
                baseUrl: 'https://dashscope.aliyuncs.com/api/v1',
                models: ['qwen-turbo', 'qwen-plus', 'qwen-max'],
                defaultModel: 'qwen-turbo',
                authType: 'Bearer'
            },
            // 百川AI
            baichuan: {
                name: '百川AI',
                baseUrl: 'https://api.baichuan-ai.com/v1',
                models: ['Baichuan2-Turbo', 'Baichuan2-Turbo-192k'],
                defaultModel: 'Baichuan2-Turbo',
                authType: 'Bearer'
            },
            // MiniMax
            minimax: {
                name: 'MiniMax',
                baseUrl: 'https://api.minimax.chat/v1',
                models: ['abab6.5-chat', 'abab5.5-chat'],
                defaultModel: 'abab6.5-chat',
                authType: 'Bearer'
            }
        }
    };

    // ==================== 存储管理 ====================
    class StorageManager {
        static get(key, defaultValue = null) {
            try {
                const value = GM_getValue(key, null);
                return value !== null ? JSON.parse(value) : defaultValue;
            } catch {
                return defaultValue;
            }
        }

        static set(key, value) {
            GM_setValue(key, JSON.stringify(value));
        }

        static getApiKeys() {
            return this.get('apiKeys', {});
        }

        static setApiKey(platform, key) {
            const keys = this.getApiKeys();
            keys[platform] = key;
            this.set('apiKeys', keys);
        }

        static getSettings() {
            return this.get('settings', {
                theme: 'dark',
                defaultPlatform: 'openai',
                enableCollaboration: true,
                maxConcurrent: 3
            });
        }

        static setSettings(settings) {
            this.set('settings', settings);
        }

        static getHistory() {
            return this.get('chatHistory', []);
        }

        static addHistory(item) {
            const history = this.getHistory();
            history.unshift(item);
            if (history.length > 100) history.pop();
            this.set('chatHistory', history);
        }
    }

    // ==================== API客户端 ====================
    class AIClient {
        constructor(platform, apiKey) {
            this.platform = platform;
            this.apiKey = apiKey;
            this.config = CONFIG.platforms[platform];
        }

        async chat(messages, model = null, options = {}) {
            const selectedModel = model || this.config.defaultModel;

            return new Promise((resolve, reject) => {
                const headers = {
                    'Content-Type': 'application/json'
                };

                // 设置认证头
                if (this.config.authType === 'Bearer') {
                    headers['Authorization'] = `Bearer ${this.apiKey}`;
                } else if (this.config.authType === 'x-api-key') {
                    headers['x-api-key'] = this.apiKey;
                    headers['anthropic-version'] = '2023-06-01';
                }

                let body;
                let endpoint = '/chat/completions';

                // Anthropic特殊处理
                if (this.platform === 'anthropic') {
                    endpoint = '/messages';
                    body = {
                        model: selectedModel,
                        max_tokens: options.maxTokens || 4096,
                        messages: messages.map(m => ({
                            role: m.role === 'system' ? 'user' : m.role,
                            content: m.content
                        }))
                    };
                } else {
                    body = {
                        model: selectedModel,
                        messages: messages,
                        temperature: options.temperature || 0.7,
                        max_tokens: options.maxTokens || 4096,
                        stream: false
                    };
                }

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `${this.config.baseUrl}${endpoint}`,
                    headers: headers,
                    data: JSON.stringify(body),
                    onload: (response) => {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (response.status >= 200 && response.status < 300) {
                                let content;
                                if (this.platform === 'anthropic') {
                                    content = data.content[0].text;
                                } else {
                                    content = data.choices[0].message.content;
                                }
                                resolve({
                                    success: true,
                                    content: content,
                                    model: selectedModel,
                                    platform: this.platform,
                                    usage: data.usage
                                });
                            } else {
                                reject({
                                    success: false,
                                    error: data.error?.message || '请求失败',
                                    platform: this.platform
                                });
                            }
                        } catch (e) {
                            reject({
                                success: false,
                                error: '解析响应失败',
                                platform: this.platform
                            });
                        }
                    },
                    onerror: (error) => {
                        reject({
                            success: false,
                            error: '网络请求失败',
                            platform: this.platform
                        });
                    }
                });
            });
        }
    }

    // ==================== 协作引擎 ====================
    class CollaborationEngine {
        constructor() {
            this.tasks = [];
            this.results = {};
        }

        // 任务分解
        async decomposeTask(mainTask, aiClients) {
            const decomposer = aiClients[0];
            const prompt = `你是一个任务分解专家。请将以下任务分解为可以并行执行的子任务，每个子任务应该可以独立完成。

主任务: ${mainTask}

请以JSON格式返回子任务列表，格式如下:
{
    "subtasks": [
        {"id": 1, "title": "子任务标题", "description": "详细描述", "expertise": "需要的专业领域"},
        ...
    ]
}

只返回JSON，不要其他内容。`;

            try {
                const response = await decomposer.chat([
                    { role: 'user', content: prompt }
                ]);

                const jsonMatch = response.content.match(/\{[\s\S]*\}/);
                if (jsonMatch) {
                    return JSON.parse(jsonMatch[0]).subtasks;
                }
            } catch (e) {
                console.error('任务分解失败:', e);
            }

            return [{ id: 1, title: mainTask, description: mainTask, expertise: 'general' }];
        }

        // 分配任务给AI
        assignTasks(subtasks, aiClients) {
            const assignments = [];
            subtasks.forEach((task, index) => {
                const client = aiClients[index % aiClients.length];
                assignments.push({
                    task: task,
                    client: client
                });
            });
            return assignments;
        }

        // 执行协作任务
        async executeCollaboration(mainTask, selectedPlatforms) {
            const apiKeys = StorageManager.getApiKeys();
            const aiClients = [];

            // 创建AI客户端
            for (const platform of selectedPlatforms) {
                if (apiKeys[platform]) {
                    aiClients.push(new AIClient(platform, apiKeys[platform]));
                }
            }

            if (aiClients.length === 0) {
                throw new Error('没有可用的AI平台，请先配置API密钥');
            }

            // 分解任务
            const subtasks = await this.decomposeTask(mainTask, aiClients);

            // 分配任务
            const assignments = this.assignTasks(subtasks, aiClients);

            // 并行执行
            const results = await Promise.allSettled(
                assignments.map(async (assignment) => {
                    const prompt = `你正在参与一个协作项目。你的任务是:

任务标题: ${assignment.task.title}
任务描述: ${assignment.task.description}
专业领域: ${assignment.task.expertise}

请完成这个任务并提供详细的输出。`;

                    return {
                        task: assignment.task,
                        platform: assignment.client.platform,
                        response: await assignment.client.chat([
                            { role: 'user', content: prompt }
                        ])
                    };
                })
            );

            // 汇总结果
            const summaryClient = aiClients[0];
            const completedResults = results
                .filter(r => r.status === 'fulfilled')
                .map(r => r.value);

            const summaryPrompt = `请汇总以下各个子任务的完成结果，形成一个完整的项目报告:

${completedResults.map(r => `
### ${r.task.title} (由 ${CONFIG.platforms[r.platform].name} 完成)
${r.response.content}
`).join('\n')}

请提供一个结构清晰、内容完整的汇总报告。`;

            const summary = await summaryClient.chat([
                { role: 'user', content: summaryPrompt }
            ]);

            return {
                subtasks: subtasks,
                results: completedResults,
                summary: summary.content
            };
        }
    }

    // ==================== UI界面 ====================
    class UI {
        constructor() {
            this.container = null;
            this.isVisible = false;
            this.currentTab = 'chat';
            this.collaborationEngine = new CollaborationEngine();
            this.init();
        }

        init() {
            this.injectStyles();
            this.createContainer();
            this.registerMenuCommand();
        }

        injectStyles() {
            GM_addStyle(`
                /* 威软AI聚合 - 样式表 */
                #weiruan-ai-container {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 900px;
                    max-width: 95vw;
                    height: 700px;
                    max-height: 90vh;
                    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
                    border-radius: 16px;
                    box-shadow: 0 25px 50px rgba(0,0,0,0.5);
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: none;
                    flex-direction: column;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.1);
                }

                #weiruan-ai-container.visible {
                    display: flex;
                }

                .weiruan-header {
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    padding: 16px 20px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-radius: 16px 16px 0 0;
                }

                .weiruan-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .weiruan-logo-icon {
                    width: 36px;
                    height: 36px;
                    background: white;
                    border-radius: 8px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    color: #667eea;
                    font-size: 14px;
                }

                .weiruan-logo-text {
                    color: white;
                    font-size: 20px;
                    font-weight: 600;
                }

                .weiruan-logo-subtitle {
                    color: rgba(255,255,255,0.8);
                    font-size: 12px;
                }

                .weiruan-close-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    width: 32px;
                    height: 32px;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 18px;
                    transition: background 0.2s;
                }

                .weiruan-close-btn:hover {
                    background: rgba(255,255,255,0.3);
                }

                .weiruan-tabs {
                    display: flex;
                    background: rgba(0,0,0,0.2);
                    padding: 8px;
                    gap: 4px;
                }

                .weiruan-tab {
                    flex: 1;
                    padding: 10px 16px;
                    background: transparent;
                    border: none;
                    color: rgba(255,255,255,0.6);
                    cursor: pointer;
                    border-radius: 8px;
                    font-size: 14px;
                    transition: all 0.2s;
                }

                .weiruan-tab:hover {
                    background: rgba(255,255,255,0.1);
                    color: rgba(255,255,255,0.8);
                }

                .weiruan-tab.active {
                    background: rgba(102, 126, 234, 0.3);
                    color: white;
                }

                .weiruan-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                }

                .weiruan-panel {
                    display: none;
                }

                .weiruan-panel.active {
                    display: block;
                }

                /* 聊天面板 */
                .weiruan-chat-container {
                    display: flex;
                    flex-direction: column;
                    height: 100%;
                }

                .weiruan-platform-select {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 16px;
                    flex-wrap: wrap;
                }

                .weiruan-platform-btn {
                    padding: 8px 16px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: white;
                    border-radius: 20px;
                    cursor: pointer;
                    font-size: 13px;
                    transition: all 0.2s;
                }

                .weiruan-platform-btn:hover {
                    background: rgba(255,255,255,0.2);
                }

                .weiruan-platform-btn.selected {
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    border-color: transparent;
                }

                .weiruan-platform-btn.disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .weiruan-messages {
                    flex: 1;
                    overflow-y: auto;
                    margin-bottom: 16px;
                    padding: 16px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 12px;
                    min-height: 200px;
                }

                .weiruan-message {
                    margin-bottom: 16px;
                    padding: 12px 16px;
                    border-radius: 12px;
                    max-width: 85%;
                }

                .weiruan-message.user {
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    margin-left: auto;
                }

                .weiruan-message.assistant {
                    background: rgba(255,255,255,0.1);
                    color: white;
                }

                .weiruan-message-platform {
                    font-size: 11px;
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 4px;
                }

                .weiruan-input-container {
                    display: flex;
                    gap: 12px;
                }

                .weiruan-input {
                    flex: 1;
                    padding: 14px 18px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 12px;
                    color: white;
                    font-size: 14px;
                    resize: none;
                }

                .weiruan-input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .weiruan-input::placeholder {
                    color: rgba(255,255,255,0.4);
                }

                .weiruan-send-btn {
                    padding: 14px 28px;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    border-radius: 12px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: transform 0.2s, box-shadow 0.2s;
                }

                .weiruan-send-btn:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
                }

                .weiruan-send-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                /* 协作面板 */
                .weiruan-collab-form {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .weiruan-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .weiruan-form-label {
                    color: rgba(255,255,255,0.8);
                    font-size: 14px;
                    font-weight: 500;
                }

                .weiruan-textarea {
                    padding: 14px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 12px;
                    color: white;
                    font-size: 14px;
                    min-height: 120px;
                    resize: vertical;
                }

                .weiruan-textarea:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .weiruan-checkbox-group {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 12px;
                }

                .weiruan-checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 8px;
                    cursor: pointer;
                }

                .weiruan-checkbox-item input {
                    accent-color: #667eea;
                }

                .weiruan-checkbox-item label {
                    color: white;
                    font-size: 13px;
                    cursor: pointer;
                }

                .weiruan-collab-result {
                    margin-top: 20px;
                    padding: 20px;
                    background: rgba(0,0,0,0.2);
                    border-radius: 12px;
                    color: white;
                    max-height: 300px;
                    overflow-y: auto;
                }

                .weiruan-collab-result h4 {
                    color: #667eea;
                    margin-bottom: 12px;
                }

                .weiruan-collab-result pre {
                    white-space: pre-wrap;
                    word-break: break-word;
                }

                /* 设置面板 */
                .weiruan-settings-section {
                    margin-bottom: 24px;
                }

                .weiruan-settings-title {
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    margin-bottom: 16px;
                    padding-bottom: 8px;
                    border-bottom: 1px solid rgba(255,255,255,0.1);
                }

                .weiruan-api-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 12px;
                }

                .weiruan-api-item label {
                    width: 140px;
                    color: rgba(255,255,255,0.8);
                    font-size: 13px;
                }

                .weiruan-api-item input {
                    flex: 1;
                    padding: 10px 14px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    border-radius: 8px;
                    color: white;
                    font-size: 13px;
                }

                .weiruan-api-item input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .weiruan-save-btn {
                    padding: 12px 24px;
                    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    color: white;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 14px;
                    margin-top: 16px;
                }

                /* 关于面板 */
                .weiruan-about {
                    text-align: center;
                    color: white;
                    padding: 40px 20px;
                }

                .weiruan-about-logo {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    font-size: 28px;
                    font-weight: bold;
                    color: white;
                }

                .weiruan-about h2 {
                    font-size: 28px;
                    margin-bottom: 8px;
                }

                .weiruan-about-version {
                    color: rgba(255,255,255,0.6);
                    margin-bottom: 24px;
                }

                .weiruan-about-desc {
                    color: rgba(255,255,255,0.8);
                    line-height: 1.8;
                    max-width: 500px;
                    margin: 0 auto 24px;
                }

                .weiruan-about-features {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                    text-align: left;
                    max-width: 500px;
                    margin: 0 auto 24px;
                }

                .weiruan-feature-item {
                    padding: 16px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                }

                .weiruan-feature-item h4 {
                    color: #667eea;
                    margin-bottom: 4px;
                    font-size: 14px;
                }

                .weiruan-feature-item p {
                    color: rgba(255,255,255,0.7);
                    font-size: 12px;
                }

                .weiruan-copyright {
                    color: rgba(255,255,255,0.5);
                    font-size: 12px;
                    padding-top: 20px;
                    border-top: 1px solid rgba(255,255,255,0.1);
                }

                /* 浮动按钮 */
                #weiruan-ai-float-btn {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 56px;
                    height: 56px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
                    cursor: pointer;
                    z-index: 999998;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: transform 0.3s, box-shadow 0.3s;
                    border: none;
                }

                #weiruan-ai-float-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 30px rgba(102, 126, 234, 0.6);
                }

                #weiruan-ai-float-btn span {
                    color: white;
                    font-weight: bold;
                    font-size: 14px;
                }

                /* 加载动画 */
                .weiruan-loading {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255,255,255,0.3);
                    border-radius: 50%;
                    border-top-color: white;
                    animation: weiruan-spin 1s linear infinite;
                }

                @keyframes weiruan-spin {
                    to { transform: rotate(360deg); }
                }

                /* 滚动条样式 */
                .weiruan-content::-webkit-scrollbar,
                .weiruan-messages::-webkit-scrollbar,
                .weiruan-collab-result::-webkit-scrollbar {
                    width: 6px;
                }

                .weiruan-content::-webkit-scrollbar-track,
                .weiruan-messages::-webkit-scrollbar-track,
                .weiruan-collab-result::-webkit-scrollbar-track {
                    background: transparent;
                }

                .weiruan-content::-webkit-scrollbar-thumb,
                .weiruan-messages::-webkit-scrollbar-thumb,
                .weiruan-collab-result::-webkit-scrollbar-thumb {
                    background: rgba(255,255,255,0.2);
                    border-radius: 3px;
                }
            `);
        }

        createContainer() {
            // 创建浮动按钮
            const floatBtn = document.createElement('button');
            floatBtn.id = 'weiruan-ai-float-btn';
            floatBtn.innerHTML = '<span>AI</span>';
            floatBtn.onclick = () => this.toggle();
            document.body.appendChild(floatBtn);

            // 创建主容器
            this.container = document.createElement('div');
            this.container.id = 'weiruan-ai-container';
            this.container.innerHTML = this.getContainerHTML();
            document.body.appendChild(this.container);

            this.bindEvents();
        }

        getContainerHTML() {
            const apiKeys = StorageManager.getApiKeys();

            return `
                <div class="weiruan-header">
                    <div class="weiruan-logo">
                        <div class="weiruan-logo-icon">威</div>
                        <div>
                            <div class="weiruan-logo-text">威软AI聚合</div>
                            <div class="weiruan-logo-subtitle">WeiRuan AI Aggregator</div>
                        </div>
                    </div>
                    <button class="weiruan-close-btn" id="weiruan-close">×</button>
                </div>

                <div class="weiruan-tabs">
                    <button class="weiruan-tab active" data-tab="chat">💬 对话</button>
                    <button class="weiruan-tab" data-tab="collab">🤝 协作</button>
                    <button class="weiruan-tab" data-tab="settings">⚙️ 设置</button>
                    <button class="weiruan-tab" data-tab="about">ℹ️ 关于</button>
                </div>

                <div class="weiruan-content">
                    <!-- 对话面板 -->
                    <div class="weiruan-panel active" id="panel-chat">
                        <div class="weiruan-chat-container">
                            <div class="weiruan-platform-select" id="platform-select">
                                ${Object.entries(CONFIG.platforms).map(([key, platform]) => `
                                    <button class="weiruan-platform-btn ${apiKeys[key] ? '' : 'disabled'}"
                                            data-platform="${key}"
                                            title="${apiKeys[key] ? '点击选择' : '请先配置API密钥'}">
                                        ${platform.name}
                                    </button>
                                `).join('')}
                            </div>
                            <div class="weiruan-messages" id="chat-messages">
                                <div style="text-align: center; color: rgba(255,255,255,0.5); padding: 40px;">
                                    选择一个AI平台开始对话
                                </div>
                            </div>
                            <div class="weiruan-input-container">
                                <textarea class="weiruan-input" id="chat-input"
                                    placeholder="输入您的问题..." rows="2"></textarea>
                                <button class="weiruan-send-btn" id="chat-send">发送</button>
                            </div>
                        </div>
                    </div>

                    <!-- 协作面板 -->
                    <div class="weiruan-panel" id="panel-collab">
                        <div class="weiruan-collab-form">
                            <div class="weiruan-form-group">
                                <label class="weiruan-form-label">项目/任务描述</label>
                                <textarea class="weiruan-textarea" id="collab-task"
                                    placeholder="描述您的项目或任务，多个AI将分工协作完成..."></textarea>
                            </div>
                            <div class="weiruan-form-group">
                                <label class="weiruan-form-label">选择参与协作的AI</label>
                                <div class="weiruan-checkbox-group" id="collab-platforms">
                                    ${Object.entries(CONFIG.platforms).map(([key, platform]) => `
                                        <div class="weiruan-checkbox-item">
                                            <input type="checkbox" id="collab-${key}" value="${key}"
                                                ${apiKeys[key] ? '' : 'disabled'}>
                                            <label for="collab-${key}">${platform.name}</label>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>
                            <button class="weiruan-send-btn" id="collab-start">开始协作</button>
                            <div class="weiruan-collab-result" id="collab-result" style="display: none;">
                                <h4>协作结果</h4>
                                <pre id="collab-output"></pre>
                            </div>
                        </div>
                    </div>

                    <!-- 设置面板 -->
                    <div class="weiruan-panel" id="panel-settings">
                        <div class="weiruan-settings-section">
                            <div class="weiruan-settings-title">API密钥配置</div>
                            ${Object.entries(CONFIG.platforms).map(([key, platform]) => `
                                <div class="weiruan-api-item">
                                    <label>${platform.name}</label>
                                    <input type="password" id="api-${key}"
                                        placeholder="输入API密钥"
                                        value="${apiKeys[key] || ''}">
                                </div>
                            `).join('')}
                            <button class="weiruan-save-btn" id="save-settings">保存设置</button>
                        </div>
                    </div>

                    <!-- 关于面板 -->
                    <div class="weiruan-panel" id="panel-about">
                        <div class="weiruan-about">
                            <div class="weiruan-about-logo">威</div>
                            <h2>威软AI聚合</h2>
                            <div class="weiruan-about-version">版本 ${CONFIG.version}</div>
                            <p class="weiruan-about-desc">
                                威软AI聚合是一款强大的AI工具，聚合了多个热门AI平台，
                                支持单独对话和多AI分工协作，帮助您高效完成各种任务。
                            </p>
                            <div class="weiruan-about-features">
                                <div class="weiruan-feature-item">
                                    <h4>🌐 多平台聚合</h4>
                                    <p>支持OpenAI、Claude、DeepSeek等10+主流AI平台</p>
                                </div>
                                <div class="weiruan-feature-item">
                                    <h4>🤝 智能协作</h4>
                                    <p>多AI分工协作，高效完成复杂任务</p>
                                </div>
                                <div class="weiruan-feature-item">
                                    <h4>🔌 API接口</h4>
                                    <p>支持SiliconFlow、OhMyGPT等API平台</p>
                                </div>
                                <div class="weiruan-feature-item">
                                    <h4>🔒 安全可靠</h4>
                                    <p>本地存储API密钥，数据安全有保障</p>
                                </div>
                            </div>
                            <div class="weiruan-copyright">
                                ${CONFIG.copyright}<br>
                                作者：${CONFIG.author}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }

        bindEvents() {
            // 关闭按钮
            this.container.querySelector('#weiruan-close').onclick = () => this.hide();

            // 标签切换
            this.container.querySelectorAll('.weiruan-tab').forEach(tab => {
                tab.onclick = () => this.switchTab(tab.dataset.tab);
            });

            // 平台选择
            this.selectedPlatform = null;
            this.container.querySelectorAll('.weiruan-platform-btn').forEach(btn => {
                btn.onclick = () => {
                    if (btn.classList.contains('disabled')) return;
                    this.container.querySelectorAll('.weiruan-platform-btn').forEach(b =>
                        b.classList.remove('selected'));
                    btn.classList.add('selected');
                    this.selectedPlatform = btn.dataset.platform;
                };
            });

            // 发送消息
            const chatInput = this.container.querySelector('#chat-input');
            const chatSend = this.container.querySelector('#chat-send');

            chatSend.onclick = () => this.sendMessage();
            chatInput.onkeydown = (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            };

            // 保存设置
            this.container.querySelector('#save-settings').onclick = () => this.saveSettings();

            // 开始协作
            this.container.querySelector('#collab-start').onclick = () => this.startCollaboration();
        }

        registerMenuCommand() {
            GM_registerMenuCommand('打开威软AI聚合', () => this.show());
        }

        toggle() {
            this.isVisible ? this.hide() : this.show();
        }

        show() {
            this.container.classList.add('visible');
            this.isVisible = true;
        }

        hide() {
            this.container.classList.remove('visible');
            this.isVisible = false;
        }

        switchTab(tabName) {
            this.container.querySelectorAll('.weiruan-tab').forEach(tab => {
                tab.classList.toggle('active', tab.dataset.tab === tabName);
            });
            this.container.querySelectorAll('.weiruan-panel').forEach(panel => {
                panel.classList.toggle('active', panel.id === `panel-${tabName}`);
            });
            this.currentTab = tabName;
        }

        async sendMessage() {
            const input = this.container.querySelector('#chat-input');
            const message = input.value.trim();

            if (!message) return;
            if (!this.selectedPlatform) {
                alert('请先选择一个AI平台');
                return;
            }

            const apiKeys = StorageManager.getApiKeys();
            if (!apiKeys[this.selectedPlatform]) {
                alert('请先在设置中配置该平台的API密钥');
                return;
            }

            const messagesDiv = this.container.querySelector('#chat-messages');

            // 添加用户消息
            messagesDiv.innerHTML += `
                <div class="weiruan-message user">
                    ${this.escapeHtml(message)}
                </div>
            `;

            input.value = '';

            // 添加加载提示
            const loadingId = 'loading-' + Date.now();
            messagesDiv.innerHTML += `
                <div class="weiruan-message assistant" id="${loadingId}">
                    <div class="weiruan-message-platform">${CONFIG.platforms[this.selectedPlatform].name}</div>
                    <div class="weiruan-loading"></div> 正在思考...
                </div>
            `;
            messagesDiv.scrollTop = messagesDiv.scrollHeight;

            try {
                const client = new AIClient(this.selectedPlatform, apiKeys[this.selectedPlatform]);
                const response = await client.chat([
                    { role: 'user', content: message }
                ]);

                const loadingEl = document.getElementById(loadingId);
                if (loadingEl) {
                    loadingEl.innerHTML = `
                        <div class="weiruan-message-platform">${CONFIG.platforms[this.selectedPlatform].name}</div>
                        ${this.escapeHtml(response.content)}
                    `;
                }

                StorageManager.addHistory({
                    platform: this.selectedPlatform,
                    userMessage: message,
                    assistantMessage: response.content,
                    timestamp: new Date().toISOString()
                });

            } catch (error) {
                const loadingEl = document.getElementById(loadingId);
                if (loadingEl) {
                    loadingEl.innerHTML = `
                        <div class="weiruan-message-platform">${CONFIG.platforms[this.selectedPlatform].name}</div>
                        <span style="color: #ff6b6b;">错误: ${error.error || '请求失败'}</span>
                    `;
                }
            }

            messagesDiv.scrollTop = messagesDiv.scrollHeight;
        }

        async startCollaboration() {
            const taskInput = this.container.querySelector('#collab-task');
            const task = taskInput.value.trim();

            if (!task) {
                alert('请输入项目或任务描述');
                return;
            }

            const selectedPlatforms = [];
            this.container.querySelectorAll('#collab-platforms input:checked').forEach(cb => {
                selectedPlatforms.push(cb.value);
            });

            if (selectedPlatforms.length < 2) {
                alert('请至少选择2个AI平台进行协作');
                return;
            }

            const resultDiv = this.container.querySelector('#collab-result');
            const outputDiv = this.container.querySelector('#collab-output');

            resultDiv.style.display = 'block';
            outputDiv.textContent = '正在分解任务并分配给各AI...\n';

            const startBtn = this.container.querySelector('#collab-start');
            startBtn.disabled = true;
            startBtn.innerHTML = '<span class="weiruan-loading"></span> 协作进行中...';

            try {
                const result = await this.collaborationEngine.executeCollaboration(task, selectedPlatforms);

                let output = '=== 任务分解 ===\n';
                result.subtasks.forEach((st, i) => {
                    output += `${i + 1}. ${st.title}\n`;
                });

                output += '\n=== 各AI完成情况 ===\n';
                result.results.forEach(r => {
                    output += `\n【${CONFIG.platforms[r.platform].name}】${r.task.title}\n`;
                    output += `${r.response.content}\n`;
                    output += '---\n';
                });

                output += '\n=== 汇总报告 ===\n';
                output += result.summary;

                outputDiv.textContent = output;

            } catch (error) {
                outputDiv.textContent = `协作失败: ${error.message || error}`;
            }

            startBtn.disabled = false;
            startBtn.textContent = '开始协作';
        }

        saveSettings() {
            Object.keys(CONFIG.platforms).forEach(key => {
                const input = this.container.querySelector(`#api-${key}`);
                if (input && input.value) {
                    StorageManager.setApiKey(key, input.value);
                }
            });

            // 刷新平台按钮状态
            const apiKeys = StorageManager.getApiKeys();
            this.container.querySelectorAll('.weiruan-platform-btn').forEach(btn => {
                const platform = btn.dataset.platform;
                btn.classList.toggle('disabled', !apiKeys[platform]);
            });

            alert('设置已保存！');
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML.replace(/\n/g, '<br>');
        }
    }

    // ==================== 初始化 ====================
    const ui = new UI();

    console.log(`
    ╔═══════════════════════════════════════════╗
    ║       威软AI聚合 v${CONFIG.version}              ║
    ║       WeiRuan AI Aggregator               ║
    ║                                           ║
    ║       ${CONFIG.copyright}       ║
    ║       作者：${CONFIG.author}                ║
    ╚═══════════════════════════════════════════╝
    `);

})();// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      2026-01-06
// @description  try to take over the world!
// @author       You
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
})();