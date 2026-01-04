// ==UserScript==
// @name         阿里巴巴国际站AI产品标题生成器-阉割版
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在阿里巴巴国际站发品页面生成AI产品标题和关键词组，仅支持DeepSeek大模型
// @author       树洞先生
// @license      MIT
// @match        https://post.alibaba.com/product/*
// @connect      api.deepseek.com
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/547993/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99AI%E4%BA%A7%E5%93%81%E6%A0%87%E9%A2%98%E7%94%9F%E6%88%90%E5%99%A8-%E9%98%89%E5%89%B2%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/547993/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99AI%E4%BA%A7%E5%93%81%E6%A0%87%E9%A2%98%E7%94%9F%E6%88%90%E5%99%A8-%E9%98%89%E5%89%B2%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // DeepSeek API配置
    const DEEPSEEK_CONFIG = {
        name: 'DeepSeek',
        urls: ['https://api.deepseek.com/v1/chat/completions'],
        model: 'deepseek-chat'
    };

    // 等待页面加载完成
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`Element ${selector} not found within ${timeout}ms`));
                } else {
                    setTimeout(check, 100);
                }
            }

            check();
        });
    }

    // 创建生成按钮
    function createGenerateButton() {
        const button = document.createElement('button');
        button.id = 'ai-title-generator-btn';
        button.innerHTML = '🤖 AI生成标题-阉割版-树洞先生';
        button.style.cssText = `
            position: absolute;
            top: 50%;
            right: 10px;
            transform: translateY(-50%);
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 12px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            transition: all 0.3s ease;
            white-space: nowrap;
        `;

        // 悬停效果
        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-50%) scale(1.05)';
            button.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(-50%) scale(1)';
            button.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)';
        });

        return button;
    }

    // 定位按钮到商品名称标签右侧
    function positionButtonToProductName() {
        let tryCount = 0;
        const maxTries = 25;
        function tryInsert() {
            const targetLabel = document.querySelector('label.oly-label-container.left.sell-o-addon-label.required');
            if (targetLabel) {
                const actionsWrapper = targetLabel.querySelector('.actions-wrapper');
                if (actionsWrapper) {
                    const parent = actionsWrapper.parentElement;
                    parent.style.position = 'relative';

                    const existingButton = document.getElementById('ai-title-generator-btn');
                    if (existingButton) existingButton.remove();
                    const button = createGenerateButton();
                    button.style.position = 'absolute';
                    button.style.right = '0';
                    button.style.top = '50%';
                    button.style.transform = 'translateY(-50%)';
                    button.style.height = actionsWrapper.offsetHeight + 'px';
                    button.style.lineHeight = actionsWrapper.offsetHeight + 'px';
                    button.style.fontSize = '14px';
                    button.style.boxSizing = 'border-box';
                    button.style.padding = '0 16px';
                    button.style.margin = '0';
                    button.style.zIndex = 10;
                    parent.appendChild(button);
                    button.addEventListener('click', () => {
                        const modal = document.getElementById('ai-title-modal');
                        if (modal) {
                            modal.style.display = 'flex';
                            if (typeof loadAPIConfig === 'function') loadAPIConfig();
                            if (typeof setupEventListeners === 'function') setupEventListeners(modal);
                        }
                    });
                    return true;
                }
            }
            tryCount++;
            if (tryCount < maxTries) {
                setTimeout(tryInsert, 200);
            } else {
                return false;
            }
            return false;
        }
        return tryInsert();
    }

    // 创建弹窗
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'ai-title-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 10001;
            display: none;
            justify-content: center;
            align-items: center;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 12px;
            width: 600px;
            max-width: 90vw;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            position: relative;
        `;

        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px;">
                <h2 style="margin: 0; color: #333; font-size: 20px;">AI产品标题生成器-DeepSeek-阉割版</h2>
                <button id="close-modal" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #999;">&times;</button>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">输入关键词（中文/英文）：</label>
                <input type="text" id="keyword-input" placeholder="请输入产品关键词，如：风扇、连衣裙、充电器..." style="
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e1e5e9;
                    border-radius: 6px;
                    font-size: 14px;
                    box-sizing: border-box;
                    transition: border-color 0.3s ease;
                " />
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">DeepSeek API配置：</label>
                <div style="display: flex; gap: 15px; align-items: center; margin-bottom: 10px;">
                    <select id="ai-model-select" style="
                        padding: 8px 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        background: white;
                        min-width: 180px;
                    ">
                        <option value="deepseek-chat">deepseek-chat</option>
                        <option value="deepseek-reasoner">deepseek-reasoner</option>
                    </select>
                    <input type="text" id="api-key" placeholder="请输入DeepSeek API Key" style="
                        flex: 1;
                        padding: 8px 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        box-sizing: border-box;
                    " />
                                         <button id="test-api-btn" style="
                         background: #2196f3;
                         color: white;
                         border: none;
                         padding: 8px 16px;
                         border-radius: 6px;
                         font-size: 13px;
                         cursor: pointer;
                         margin-left: 4px;
                         transition: all 0.3s ease;
                     ">测试API</button>
                     <button id="diagnose-btn" style="
                         background: #ff9800;
                         color: white;
                         border: none;
                         padding: 8px 16px;
                         border-radius: 6px;
                         font-size: 13px;
                         cursor: pointer;
                         margin-left: 4px;
                         transition: all 0.3s ease;
                     ">诊断问题</button>
                </div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">
                    💡 使用DeepSeek大模型生成高质量的产品标题和关键词组
                </div>
            </div>

            <!-- 自定义AI提示词输入区 -->
            <div id="custom-prompt-area" style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">
                    自定义AI提示词（可选）：
                    <button id="toggle-prompt-visibility" style="margin-left:10px;font-size:12px;background:#f8f9fa;border:1px solid #ddd;border-radius:3px;padding:2px 6px;cursor:pointer;">隐藏/显示</button>
                </label>
                <textarea id="custom-prompt-input" placeholder="可自定义AI提示词，留空则用默认提示词" style="
                    width: 100%;
                    height: 60px;
                    padding: 10px;
                    border: 2px solid #e1e5e9;
                    border-radius: 6px;
                    font-size: 14px;
                    resize: vertical;
                    box-sizing: border-box;
                    background-color: #f8f9fa;
                    margin-bottom: 8px;
                "></textarea>
                <div style="display:flex;gap:8px;align-items:center;">
                    <button id="save-prompt-template-btn" style="font-size:12px;background:#28a745;color:white;border:none;padding:4px 8px;border-radius:3px;cursor:pointer;">保存为模板</button>
                    <select id="prompt-template-select" style="flex:1;font-size:12px;padding:4px;border:1px solid #ddd;border-radius:3px;">
                        <option value="">选择已保存的模板</option>
                    </select>
                    <button id="delete-prompt-template-btn" style="font-size:12px;background:#dc3545;color:white;border:none;padding:4px 8px;border-radius:3px;cursor:pointer;">删除模板</button>
                </div>
            </div>

            <div style="display: flex; gap: 10px; justify-content: flex-end; flex-wrap: wrap; margin-bottom: 8px;">
                <button id="generate-btn" style="
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    border: none;
                    padding: 6px 14px;
                    border-radius: 4px;
                    font-size: 13px;
                    font-weight: 500;
                    cursor: pointer;
                    transition: all 0.3s ease;
                ">🤖 生成</button>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">生成的标题：</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <textarea id="generated-title" readonly placeholder="AI生成的英文标题将显示在这里..." style="
                        width: 100%;
                        height: 80px;
                        padding: 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        resize: vertical;
                        box-sizing: border-box;
                        background-color: #f8f9fa;
                    "></textarea>
                    <button id="copy-title-btn" style="
                        background: #28a745;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        margin-left: 4px;
                        transition: all 0.3s ease;
                    ">复制</button>
                </div>
                <div id="title-char-count" style="text-align: right; font-size: 12px; color: #666; margin-top: 5px;">0/125 字符</div>
            </div>

            <div style="margin-bottom: 20px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">生成的副标题：</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <textarea id="generated-subtitle" readonly placeholder="AI生成的英文副标题将显示在这里..." style="
                        width: 100%;
                        height: 60px;
                        padding: 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        resize: vertical;
                        box-sizing: border-box;
                        background-color: #f8f9fa;
                    "></textarea>
                    <button id="copy-subtitle-btn" style="
                        background: #ff9800;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        margin-left: 4px;
                        transition: all 0.3s ease;
                    ">复制</button>
                </div>
                <div id="subtitle-char-count" style="text-align: right; font-size: 12px; color: #666; margin-top: 5px;">0/125 字符</div>
            </div>

            <div style="margin-bottom: 25px;">
                <label style="display: block; margin-bottom: 8px; font-weight: bold; color: #555;">生成的关键词组：</label>
                <div style="display: flex; align-items: center; gap: 8px;">
                    <textarea id="generated-keywords" readonly placeholder="AI生成的英文关键词组将显示在这里..." style="
                        width: 100%;
                        height: 100px;
                        padding: 12px;
                        border: 2px solid #e1e5e9;
                        border-radius: 6px;
                        font-size: 14px;
                        resize: vertical;
                        box-sizing: border-box;
                        background-color: #f8f9fa;
                    "></textarea>
                    <button id="copy-keywords-btn" style="
                        background: #17a2b8;
                        color: white;
                        border: none;
                        padding: 8px 16px;
                        border-radius: 6px;
                        font-size: 13px;
                        cursor: pointer;
                        margin-left: 4px;
                        transition: all 0.3s ease;
                    ">复制</button>
                </div>
                <div id="keywords-char-count" style="text-align: right; font-size: 12px; color: #666; margin-top: 5px;">0/350 字符</div>
            </div>
        `;

        modal.appendChild(modalContent);
        return modal;
    }

    // 初始化脚本
    async function init() {
        try {
            await waitForElement('body');

            let modal = document.getElementById('ai-title-modal');
            if (!modal) {
                modal = createModal();
                document.body.appendChild(modal);
            }

            loadAPIConfig();

            setTimeout(() => {
                let buttonPositioned = positionButtonToProductName();

                if (!buttonPositioned) {
                    const button = createDefaultButton();
                    document.body.appendChild(button);
                    button.addEventListener('click', () => {
                        const modal = document.getElementById('ai-title-modal');
                        if (modal) {
                            modal.style.display = 'flex';
                            if (typeof loadAPIConfig === 'function') loadAPIConfig();
                        } else {
                            alert('弹窗未正确加载，请刷新页面重试');
                        }
                    });
                }
            }, 1000);

            if (modal) {
                const closeBtn = modal.querySelector('#close-modal');
                if (closeBtn && !closeBtn.hasAttribute('data-inited')) {
                    closeBtn.addEventListener('click', () => {
                        modal.style.display = 'none';
                    });
                    closeBtn.setAttribute('data-inited', '1');
                }
                if (!modal.hasAttribute('data-inited')) {
                    modal.addEventListener('click', (e) => {
                        if (e.target === modal) {
                            modal.style.display = 'none';
                        }
                    });
                    modal.setAttribute('data-inited', '1');
                }
            }

        } catch (error) {
            console.error('脚本初始化失败:', error);
        }
    }

    // 创建默认定位的按钮（备用方案）
    function createDefaultButton() {
        const button = document.createElement('button');
        button.id = 'ai-title-generator-btn';
        button.innerHTML = '🤖 AI生成标题-阉割版';
        button.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: bold;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
        `;

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'translateY(-2px)';
            button.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'translateY(0)';
            button.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
        });

        return button;
    }

    // 设置事件监听器
    function setupEventListeners(modal) {
        const closeBtn = modal.querySelector('#close-modal');
        if (closeBtn && !closeBtn.hasAttribute('data-inited')) {
            closeBtn.addEventListener('click', () => {
                modal.style.display = 'none';
            });
            closeBtn.setAttribute('data-inited', '1');
        }

        if (!modal.hasAttribute('data-inited')) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
            modal.setAttribute('data-inited', '1');
        }

        const keywordInput = modal.querySelector('#keyword-input');
        if (keywordInput && !keywordInput.hasAttribute('data-inited')) {
            keywordInput.addEventListener('focus', () => {
                keywordInput.style.borderColor = '#667eea';
            });
            keywordInput.addEventListener('blur', () => {
                keywordInput.style.borderColor = '#e1e5e9';
            });
            keywordInput.setAttribute('data-inited', '1');
        }

        const apiKeyInput = modal.querySelector('#api-key');
        if (apiKeyInput && !apiKeyInput.hasAttribute('data-inited')) {
            apiKeyInput.addEventListener('input', () => {
                apiKeyInput.setAttribute('data-real-key', apiKeyInput.value);
            });
            apiKeyInput.addEventListener('blur', () => {
                let realKey = apiKeyInput.value;
                if (realKey.includes('*')) {
                    realKey = apiKeyInput.getAttribute('data-real-key') || '';
                }
                GM_setValue('deepseek_api_key', realKey);
                apiKeyInput.value = maskApiKey(realKey);
                apiKeyInput.setAttribute('data-real-key', realKey);
            });
            apiKeyInput.setAttribute('data-inited', '1');
        }

        if (apiKeyInput && !apiKeyInput.hasAttribute('data-mask-inited')) {
            let realApiKey = apiKeyInput.getAttribute('data-real-key') || apiKeyInput.value;
            apiKeyInput.value = maskApiKey(realApiKey);
            apiKeyInput.setAttribute('data-real-key', realApiKey);
            apiKeyInput.setAttribute('data-mask-inited', '1');
        }

        const titleTextarea = modal.querySelector('#generated-title');
        const subtitleTextarea = modal.querySelector('#generated-subtitle');
        const keywordsTextarea = modal.querySelector('#generated-keywords');
        const titleCharCount = modal.querySelector('#title-char-count');
        const subtitleCharCount = modal.querySelector('#subtitle-char-count');
        const keywordsCharCount = modal.querySelector('#keywords-char-count');

        if (titleTextarea && !titleTextarea.hasAttribute('data-inited')) {
            titleTextarea.addEventListener('input', () => {
                const count = titleTextarea.value.length;
                titleCharCount.textContent = `${count}/125 字符`;
                titleCharCount.style.color = count > 125 ? '#dc3545' : '#666';
            });
            titleTextarea.setAttribute('data-inited', '1');
        }

        if (subtitleTextarea && !subtitleTextarea.hasAttribute('data-inited')) {
            subtitleTextarea.addEventListener('input', () => {
                const count = subtitleTextarea.value.length;
                subtitleCharCount.textContent = `${count}/125 字符`;
                subtitleCharCount.style.color = count > 125 ? '#dc3545' : '#666';
            });
            subtitleTextarea.setAttribute('data-inited', '1');
        }

        if (keywordsTextarea && !keywordsTextarea.hasAttribute('data-inited')) {
            keywordsTextarea.addEventListener('input', () => {
                const count = keywordsTextarea.value.length;
                keywordsCharCount.textContent = `${count}/350 字符`;
                keywordsCharCount.style.color = count > 350 ? '#dc3545' : '#666';
            });
            keywordsTextarea.setAttribute('data-inited', '1');
        }

        const generateBtn = modal.querySelector('#generate-btn');
        if (generateBtn && !generateBtn.hasAttribute('data-inited')) {
            generateBtn.addEventListener('click', generateContent);
            generateBtn.setAttribute('data-inited', '1');
        }

        const copyTitleBtn = modal.querySelector('#copy-title-btn');
        if (copyTitleBtn && !copyTitleBtn.hasAttribute('data-inited')) {
            copyTitleBtn.addEventListener('click', () => {
                copyToClipboard(titleTextarea.value, '标题已复制到剪贴板');
            });
            copyTitleBtn.setAttribute('data-inited', '1');
        }

        const copySubtitleBtn = modal.querySelector('#copy-subtitle-btn');
        if (copySubtitleBtn && !copySubtitleBtn.hasAttribute('data-inited')) {
            copySubtitleBtn.addEventListener('click', () => {
                copyToClipboard(subtitleTextarea.value, '副标题已复制到剪贴板');
            });
            copySubtitleBtn.setAttribute('data-inited', '1');
        }

        const copyKeywordsBtn = modal.querySelector('#copy-keywords-btn');
        if (copyKeywordsBtn && !copyKeywordsBtn.hasAttribute('data-inited')) {
            copyKeywordsBtn.addEventListener('click', () => {
                copyToClipboard(keywordsTextarea.value, '关键词已复制到剪贴板');
            });
            copyKeywordsBtn.setAttribute('data-inited', '1');
        }

        if (keywordInput && !keywordInput.hasAttribute('data-enter-inited')) {
            keywordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    generateContent();
                }
            });
            keywordInput.setAttribute('data-enter-inited', '1');
        }

        const testApiBtn = modal.querySelector('#test-api-btn');
        if (testApiBtn && !testApiBtn.hasAttribute('data-inited')) {
            testApiBtn.addEventListener('click', async () => {
                let apiKey = apiKeyInput.getAttribute('data-real-key') || apiKeyInput.value;
                if (!apiKey.trim()) {
                    showNotification('请先输入API Key', 'warning');
                    return;
                }
                testApiBtn.disabled = true;
                testApiBtn.textContent = '测试中...';
                try {
                    const result = await testDeepSeekAPI(apiKey);
                    showNotification('API测试成功: ' + result, 'success');
                } catch (e) {
                    showNotification('API测试失败: ' + (e.message || e), 'error');
                } finally {
                    testApiBtn.disabled = false;
                    testApiBtn.textContent = '测试API';
                }
            });
            testApiBtn.setAttribute('data-inited', '1');
        }

        // 自定义提示词相关功能
        const promptInput = modal.querySelector('#custom-prompt-input');
        const savePromptBtn = modal.querySelector('#save-prompt-template-btn');
        const promptSelect = modal.querySelector('#prompt-template-select');
        const deletePromptBtn = modal.querySelector('#delete-prompt-template-btn');
        const togglePromptBtn = modal.querySelector('#toggle-prompt-visibility');

        // 加载模板到下拉框
        function loadPromptTemplates() {
            const templates = GM_getValue('deepseek_prompt_templates', []);
            promptSelect.innerHTML = '<option value="">选择已保存的模板</option>';
            templates.forEach((tpl, idx) => {
                const opt = document.createElement('option');
                opt.value = idx;
                opt.textContent = tpl.slice(0, 30).replace(/\n/g, ' ') + (tpl.length > 30 ? '...' : '');
                promptSelect.appendChild(opt);
            });
        }

        // 选择模板自动填充
        if (promptSelect && !promptSelect.hasAttribute('data-inited')) {
            promptSelect.addEventListener('change', () => {
                const templates = GM_getValue('deepseek_prompt_templates', []);
                if (promptSelect.value && templates[promptSelect.value]) {
                    promptInput.value = templates[promptSelect.value];
                }
            });
            promptSelect.setAttribute('data-inited', '1');
        }

        // 保存为模板
        if (savePromptBtn && !savePromptBtn.hasAttribute('data-inited')) {
            savePromptBtn.addEventListener('click', () => {
                const val = promptInput.value.trim();
                if (!val) {
                    showNotification('提示词不能为空', 'warning');
                    return;
                }
                let templates = GM_getValue('deepseek_prompt_templates', []);
                if (!templates.includes(val)) {
                    templates.push(val);
                    GM_setValue('deepseek_prompt_templates', templates);
                    loadPromptTemplates();
                    showNotification('模板已保存', 'success');
                } else {
                    showNotification('模板已存在', 'info');
                }
            });
            savePromptBtn.setAttribute('data-inited', '1');
        }

        // 删除模板
        if (deletePromptBtn && !deletePromptBtn.hasAttribute('data-inited')) {
            deletePromptBtn.addEventListener('click', () => {
                let templates = GM_getValue('deepseek_prompt_templates', []);
                if (promptSelect.value && templates[promptSelect.value]) {
                    templates.splice(promptSelect.value, 1);
                    GM_setValue('deepseek_prompt_templates', templates);
                    loadPromptTemplates();
                    showNotification('模板已删除', 'success');
                }
            });
            deletePromptBtn.setAttribute('data-inited', '1');
        }

        // 隐藏/显示输入框
        let promptVisible = true;
        if (togglePromptBtn && !togglePromptBtn.hasAttribute('data-inited')) {
            togglePromptBtn.addEventListener('click', () => {
                promptVisible = !promptVisible;
                promptInput.style.display = promptVisible ? '' : 'none';
                togglePromptBtn.textContent = promptVisible ? '隐藏/显示' : '显示提示词';
            });
            togglePromptBtn.setAttribute('data-inited', '1');
        }

        // 初始化加载模板
        loadPromptTemplates();

        // 诊断按钮
        const diagnoseBtn = modal.querySelector('#diagnose-btn');
        if (diagnoseBtn && !diagnoseBtn.hasAttribute('data-inited')) {
            diagnoseBtn.addEventListener('click', () => {
                diagnoseProblems();
            });
            diagnoseBtn.setAttribute('data-inited', '1');
        }
    }

    // 保存API配置
    function saveAPIConfig() {
        const apiKeyInput = document.querySelector('#api-key');
        let realKey = apiKeyInput.getAttribute('data-real-key') || apiKeyInput.value;
        GM_setValue('deepseek_api_key', realKey);
    }

    // 加载API配置
    function loadAPIConfig() {
        const apiKeyInput = document.querySelector('#api-key');
        if (apiKeyInput) {
            let realKey = GM_getValue('deepseek_api_key', '');
            apiKeyInput.value = maskApiKey(realKey);
            apiKeyInput.setAttribute('data-real-key', realKey);
        }
    }

    // 复制到剪贴板
    function copyToClipboard(text, message) {
        if (!text.trim()) {
            showNotification('没有内容可复制', 'warning');
            return;
        }

        navigator.clipboard.writeText(text).then(() => {
            showNotification(message, 'success');
        }).catch(() => {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            showNotification(message, 'success');
        });
    }

    // 显示通知
    function showNotification(message, type = 'info') {
        let container = document.getElementById('ai-notification-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'ai-notification-container';
            container.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                z-index: 10002;
                display: flex;
                flex-direction: column;
                align-items: flex-end;
                gap: 10px;
                pointer-events: none;
            `;
            document.body.appendChild(container);
        }

        const notification = document.createElement('div');
        notification.style.cssText = `
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            font-size: 14px;
            font-weight: bold;
            box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            transition: all 0.3s ease;
            margin-bottom: 0;
            pointer-events: auto;
        `;

        switch (type) {
            case 'success':
                notification.style.background = '#28a745';
                break;
            case 'warning':
                notification.style.background = '#ffc107';
                notification.style.color = '#212529';
                break;
            case 'error':
                notification.style.background = '#dc3545';
                break;
            default:
                notification.style.background = '#17a2b8';
        }

        notification.textContent = message;
        container.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // 使用DeepSeek API生成内容
    async function generateWithDeepSeek(keyword, customPrompt = '') {
        const config = DEEPSEEK_CONFIG;
        const aiModelSelect = document.querySelector('#ai-model-select');
        let model = aiModelSelect ? aiModelSelect.value : config.model;

        // 默认提示词
        const defaultPrompt = `请为以下产品关键词生成英文产品标题、副标题和关键词组，严格用于阿里巴巴国际站2025年商品发布，需完全符合平台最新规范：
你是一位经验丰富的阿里巴巴国际站运营专家和SEO优化师。你的任务是为我的一款产品生成高质量、SEO友好且吸引海外买家的产品标题。

请遵循以下规则：
1. 标题必须包含核心关键词，并尽量靠前。
2. 合理组合产品的属性、用途、材质和营销词。
3. 标题总长度不超过125个字符。
4. 语言风格专业，符合B2B采购商的搜索习惯。
5. 标题需要有变化，不要只是简单地堆砌词语。
生成的关键词。请为我提供：
1.  10个核心关键词 (Core Keywords)。
2.  15个长尾关键词 (Long-tail Keywords)，包含材质、特性或用途。
3.  5个B2B采购商可能会用的搜索词 (B2B Buyer Search Terms)。

产品关键词: ${keyword}
一、产品标题要求
核心要素：必须包含产品核心关键词（置于标题中前半段），搭配重要属性词（如材质、规格、特性）、同义 / 变体词（如同义词、功能变体）、场景词（如用途、适用领域），结构优先为 “重要属性词 + 核心关键词 + 同义 / 变体词 + 场景词”；
字符限制：总字符数严格控制在 100-125 字符之间，需充分利用字符长度，避免冗余；
介词位置：介词 “for”“with” 需置于标题中后段，禁止出现在前 1/3 位置；
禁止内容：绝对禁止出现任何品牌词（如具体品牌名、自有品牌标识），禁止冗余词汇、联系方式、特殊字符（如 &*#）、关键词堆砌，禁止与后续生成的图片 / 属性描述冲突；
格式规范：每个单词首字母大写（介词、连词、冠词除外），语言专业严谨，符合 B2B 采购商阅读习惯，无口语化表达。
二、产品副标题要求
核心关联：必须包含产品核心关键词，与主标题上下文一致，避免重复主标题及产品属性内容；
内容补充：聚焦主标题未覆盖的卖点（如耐用性、易用性、售后优势）、拓展适用场景（如细分行业用途）或功能细节（如维护方式）；
字符与合规：总字符数严格控制在 100-125 字符之间，禁止夸大宣传（如 “best”“top 1”）、虚假信息及违规词汇；
语言风格：延续专业 B2B 调性，用不同表述补充价值，提升买家采购意愿。
三、关键词组要求
数量与内容：包含 5个英文核心关键词，5个长尾关键词，3个B2B采购商可能会用的搜索词,紧密围绕产品核心词、属性词（材质 / 特性）、场景词（用途 / 领域），均为 B2B 买家常用搜索词汇；
格式规范：关键词之间禁止用英文逗号分隔，直接使用空格进行分隔，300 字符≤总字符数≤350 字符；
禁止内容：无无关词汇、无重复词汇、无低俗信息及联系方式，确保每个关键词均具备实际搜索价值。
四、输出格式
严格按照以下格式输出，无任何额外解释、分析或补充内容：
标题: [符合要求的英文产品标题]
副标题: [符合要求的英文产品副标题]
关键词: [符合要求的英文关键词组]

不要输出其它内容。`;


        // 使用自定义提示词或默认提示词
        let prompt = customPrompt.trim() ? customPrompt.replace('{keyword}', keyword) : defaultPrompt;
        // 注入多样化令牌（不应出现在输出中）
        const variantHint = Math.random().toString(36).slice(2, 10);
        prompt += `\n\n多样化要求：请基于内部变体令牌 ${variantHint} 选择不同的用词与表达方式，避免与同类标题/副标题完全一致。不要在输出中出现该令牌或任何与之相关的内容。`;

        const requestData = {
            model: model,
            messages: [
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 500,
            temperature: 0.85,
            top_p: 0.9,
            stream: false
        };

        const errors = [];
        for (let i = 0; i < config.urls.length; i++) {
            const url = config.urls[i];
            console.log(`尝试API地址 ${i + 1}/${config.urls.length}: ${url}`);

            try {
                const result = await makeDeepSeekRequest(url, requestData);
                return result;
            } catch (error) {
                errors.push(`地址${i + 1}: ${error.message}`);
                if (i < config.urls.length - 1) {
                    console.log('尝试下一个API地址...');
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        }

        const errorMessage = `所有API地址都请求失败:\n${errors.join('\n')}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
    }

    // 发送DeepSeek API请求
    function makeDeepSeekRequest(url, requestData) {
        return new Promise((resolve, reject) => {
            const apiKey = document.querySelector('#api-key').getAttribute('data-real-key') || document.querySelector('#api-key').value;

            let headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            };

            console.log('发送DeepSeek API请求:', {
                url: url,
                method: 'POST',
                headers: headers,
                dataSize: JSON.stringify(requestData).length,
                apiKeyLength: apiKey ? apiKey.length : 0
            });

            console.log('请求数据:', JSON.stringify(requestData, null, 2));

            GM_xmlhttpRequest({
                method: 'POST',
                url: url,
                headers: headers,
                data: JSON.stringify(requestData),
                timeout: 60000, // 增加到60秒
                onload: function(response) {
                    console.log('DeepSeek响应状态:', response.status);
                    console.log('DeepSeek响应头:', response.responseHeaders);
                    console.log('DeepSeek原始返回:', response.responseText);

                    if (response.status === 0) {
                        reject(new Error('请求被阻止或网络错误 (状态码: 0)'));
                        return;
                    }

                    try {
                        const data = JSON.parse(response.responseText);

                        if (response.status === 200 && data.choices && data.choices[0]) {
                            let content = data.choices[0].message.content;
                            if ((!content || content.trim() === '') && data.choices[0].message.reasoning_content) {
                                content = data.choices[0].message.reasoning_content;
                            }
                            console.log('AI返回的内容:', content);
                            const result = parseAIResponse(content);
                            if (result) {
                                console.log('解析结果:', result);
                                resolve(result);
                            } else {
                                reject(new Error('AI返回的内容格式不正确'));
                            }
                        } else {
                            console.error('DeepSeek API错误返回:', data);
                            let errorMessage = '未知错误';
                            if (data.error && data.error.message) {
                                errorMessage = data.error.message;
                            } else if (data.message) {
                                errorMessage = data.message;
                            } else if (data.error) {
                                errorMessage = JSON.stringify(data.error);
                            }
                            reject(new Error(`API错误 (${response.status}): ${errorMessage}`));
                        }
                    } catch (error) {
                        console.error('解析响应失败:', error);
                        console.error('原始响应:', response.responseText);
                        reject(new Error('解析AI响应失败: ' + error.message));
                    }
                },
                onerror: function(error) {
                    console.error('网络请求错误:', error);
                    reject(new Error('网络请求失败: ' + (error.error || '未知错误')));
                },
                ontimeout: function() {
                    console.error('请求超时');
                    reject(new Error('请求超时 (60秒)'));
                },
                onabort: function() {
                    console.error('请求被中止');
                    reject(new Error('请求被中止'));
                }
            });
        });
    }

    // 解析AI API返回的内容
    function parseAIResponse(content) {
        function normalizeTitleCase(str) {
            if (!str) return '';
            const lowerCaseWords = [
                'a', 'an', 'the',
                'and', 'but', 'or', 'nor', 'for', 'so', 'yet',
                'at', 'by', 'for', 'in', 'of', 'on', 'to', 'up', 'with', 'as', 'from', 'into', 'like', 'near', 'off', 'onto', 'over', 'per', 'plus', 'than', 'till', 'upon', 'via', 'down', 'out', 'about', 'after', 'before', 'behind', 'below', 'beneath', 'beside', 'between', 'beyond', 'during', 'except', 'inside', 'outside', 'since', 'through', 'under', 'within', 'without', 'over', 'under', 'against', 'along', 'among', 'around', 'because', 'although', 'if', 'unless', 'until', 'while', 'where', 'when', 'once', 'since', 'though', 'even', 'whereas'
            ];
            const words = str.split(/\s+/);
            return words.map((word, idx) => {
                const w = word.toLowerCase();
                if (idx === 0 || idx === words.length - 1) {
                    return word.charAt(0).toUpperCase() + word.slice(1);
                }
                if (lowerCaseWords.includes(w)) {
                    return w;
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            }).join(' ');
        }

        function cleanKeywords(str) {
            if (!str) return '';
            let s = str.replace(/[，,.;:!！。？?、\-_=+~`@#$%^&*()\[\]{}|\\/<>'\"""""'' ]/g, ' ');
            s = s.replace(/[^a-zA-Z0-9 ]/g, '');
            s = s.replace(/\s+/g, ' ');
            s = s.trim();
            return s;
        }

        if (!content || content.trim() === '') {
            return null;
        }

        const titleMatch = content.match(/(?:\*\*|__)?标题(?:\*\*|__)?[：:：\s]*([^\n]+?)(?=\n|副标题|关键词|$)/i);
        const subtitleMatch = content.match(/(?:\*\*|__)?副标题(?:\*\*|__)?[：:：\s]*([^\n]+?)(?=\n|关键词|$)/i);
        const keywordsMatch = content.match(/(?:\*\*|__)?关键词(?:\*\*|__)?[：:：\s]*([^\n]+?)(?=\n|$)/i);

        if (titleMatch && keywordsMatch) {
            let title = titleMatch[1].trim();
            let subtitle = subtitleMatch ? subtitleMatch[1].trim() : '';
            let keywords = keywordsMatch[1].trim();

            title = title.replace(/^[*]{2,}/, '').replace(/^[\[\]【】]/g, '').trim();
            subtitle = subtitle.replace(/^[*]{2,}/, '').replace(/[\[\]【】]/g, '').trim();
            keywords = keywords.replace(/[\[\]【】]/g, '').trim();

            title = title.replace(/[\u4e00-\u9fa5]/g, '').replace(/\s+/g, ' ').trim();
            subtitle = subtitle.replace(/[\u4e00-\u9fa5]/g, '').replace(/\s+/g, ' ').trim();
            keywords = keywords.replace(/[\u4e00-\u9fa5]/g, '').replace(/\s+/g, ' ').trim();

            title = normalizeTitleCase(title);
            subtitle = normalizeTitleCase(subtitle);
            keywords = cleanKeywords(keywords);

            if (title.length > 128) {
                title = title.substring(0, 128).trim();
                const lastSpaceIndex = title.lastIndexOf(' ');
                if (lastSpaceIndex > 100) {
                    title = title.substring(0, lastSpaceIndex);
                }
            }
            if (subtitle.length > 128) {
                subtitle = subtitle.substring(0, 128).trim();
                const lastSpaceIndex = subtitle.lastIndexOf(' ');
                if (lastSpaceIndex > 100) {
                    subtitle = subtitle.substring(0, lastSpaceIndex);
                }
            }
            if (keywords.length > 350) {
                keywords = keywords.substring(0, 350).trim();
                const lastCommaIndex = keywords.lastIndexOf(',');
                if (lastCommaIndex > 300) {
                    keywords = keywords.substring(0, lastCommaIndex);
                }
            }
            return { title, subtitle, keywords };
        }

        return null;
    }

    // 生成内容
    async function generateContent() {
        const keywordInput = document.querySelector('#keyword-input');
        const titleTextarea = document.querySelector('#generated-title');
        const subtitleTextarea = document.querySelector('#generated-subtitle');
        const keywordsTextarea = document.querySelector('#generated-keywords');
        const generateBtn = document.querySelector('#generate-btn');
        const apiKey = document.querySelector('#api-key').getAttribute('data-real-key') || document.querySelector('#api-key').value;

        const keyword = keywordInput.value.trim();
        const customPrompt = document.getElementById('custom-prompt-input')?.value?.trim() || '';

        if (!keyword) {
            showNotification('请输入关键词', 'warning');
            return;
        }

        if (!apiKey.trim()) {
            showNotification('请先配置API Key', 'warning');
            return;
        }

        generateBtn.disabled = true;
        const originalText = generateBtn.textContent;
        generateBtn.textContent = '🔄 DeepSeek生成中...';
        showNotification('正在使用DeepSeek AI生成...', 'info');

        try {
            const result = await generateWithDeepSeek(keyword, customPrompt);

            titleTextarea.value = result.title;
            if (subtitleTextarea) subtitleTextarea.value = result.subtitle || '';
            keywordsTextarea.value = result.keywords;

            titleTextarea.dispatchEvent(new Event('input'));
            if (subtitleTextarea) subtitleTextarea.dispatchEvent(new Event('input'));
            keywordsTextarea.dispatchEvent(new Event('input'));

            showNotification('DeepSeek AI生成完成！', 'success');

        } catch (error) {
            let errorMessage = '生成失败，请重试';
            if (error.message.includes('API错误')) {
                errorMessage = 'DeepSeek API调用失败，请检查API Key和网络连接';
            } else if (error.message.includes('网络请求失败')) {
                errorMessage = '网络连接失败，请检查网络设置';
            }

            showNotification(errorMessage, 'error');
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = originalText;
            const apiKeyInput = document.querySelector('#api-key');
            if (apiKeyInput) {
                apiKeyInput.blur();
            }
        }
    }

    // API密钥打码函数
    function maskApiKey(apiKey) {
        if (!apiKey) return '';
        if (apiKey.length <= 8) return apiKey[0] + '****' + apiKey[apiKey.length - 1];
        return apiKey.slice(0, 4) + '****' + apiKey.slice(-4);
    }

    // 诊断问题
    function diagnoseProblems() {
        const apiKey = document.querySelector('#api-key').getAttribute('data-real-key') || document.querySelector('#api-key').value;
        const model = document.querySelector('#ai-model-select').value;

        let issues = [];
        let suggestions = [];

        // 检查API Key
        if (!apiKey || apiKey.trim() === '') {
            issues.push('❌ API Key为空');
            suggestions.push('请输入有效的DeepSeek API Key');
        } else if (apiKey.length < 20) {
            issues.push('❌ API Key长度异常');
            suggestions.push('请检查API Key是否正确');
        } else {
            issues.push('✅ API Key已配置');
        }

        // 检查模型选择
        if (model) {
            issues.push(`✅ 模型选择: ${model}`);
        } else {
            issues.push('❌ 未选择模型');
            suggestions.push('请选择DeepSeek模型');
        }

        // 检查网络连接
        issues.push('🔍 正在检查网络连接...');

        // 测试网络连接
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://api.deepseek.com/v1/models',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            },
            timeout: 10000,
            onload: function(response) {
                if (response.status === 200) {
                    issues.push('✅ 网络连接正常');
                } else {
                    issues.push(`❌ 网络连接异常 (状态码: ${response.status})`);
                    suggestions.push('请检查网络连接或API Key');
                }
                showDiagnosticResult(issues, suggestions);
            },
            onerror: function() {
                issues.push('❌ 无法连接到DeepSeek API');
                suggestions.push('请检查网络连接、防火墙设置或使用代理');
                showDiagnosticResult(issues, suggestions);
            },
            ontimeout: function() {
                issues.push('❌ 网络连接超时');
                suggestions.push('请检查网络连接或尝试使用代理');
                showDiagnosticResult(issues, suggestions);
            }
        });
    }

    // 显示诊断结果
    function showDiagnosticResult(issues, suggestions) {
        let message = '🔍 诊断结果:\n\n' + issues.join('\n');
        if (suggestions.length > 0) {
            message += '\n\n💡 建议:\n' + suggestions.join('\n');
        }

        // 创建诊断结果弹窗
        const diagnosticModal = document.createElement('div');
        diagnosticModal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
            z-index: 10003;
            max-width: 500px;
            max-height: 80vh;
            overflow-y: auto;
        `;

        diagnosticModal.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #333;">诊断结果</h3>
                <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; font-size: 20px; cursor: pointer; color: #999;">&times;</button>
            </div>
            <div style="white-space: pre-line; font-family: monospace; font-size: 12px; line-height: 1.5;">${message}</div>
            <div style="margin-top: 15px; text-align: center;">
                <button onclick="this.parentElement.parentElement.remove()" style="background: #2196f3; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">关闭</button>
            </div>
        `;

        document.body.appendChild(diagnosticModal);
    }

    // 测试DeepSeek API连接
    async function testDeepSeekAPI(apiKey) {
        const requestData = {
            model: 'deepseek-chat',
            messages: [
                { role: 'user', content: 'Say hello world.' }
            ],
            max_tokens: 10,
            temperature: 0.1,
            stream: false
        };

        return new Promise((resolve, reject) => {
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            };

            console.log('测试API请求:', {
                url: DEEPSEEK_CONFIG.urls[0],
                headers: headers,
                data: requestData
            });

            GM_xmlhttpRequest({
                method: 'POST',
                url: DEEPSEEK_CONFIG.urls[0],
                headers: headers,
                data: JSON.stringify(requestData),
                timeout: 30000,
                onload: function(response) {
                    console.log('测试API响应状态:', response.status);
                    console.log('测试API响应:', response.responseText);

                    if (response.status === 0) {
                        reject(new Error('请求被阻止或网络错误 (状态码: 0)'));
                        return;
                    }

                    try {
                        const data = JSON.parse(response.responseText);
                        if (response.status === 200 && data.choices && data.choices[0]) {
                            const content = data.choices[0].message.content;
                            resolve(content);
                        } else {
                            let errorMessage = '未知错误';
                            if (data.error && data.error.message) errorMessage = data.error.message;
                            else if (data.message) errorMessage = data.message;
                            else if (data.error) errorMessage = JSON.stringify(data.error);
                            reject(new Error(`API错误 (${response.status}): ${errorMessage}`));
                        }
                    } catch (e) {
                        console.error('测试API解析失败:', e);
                        reject(new Error('解析响应失败: ' + e.message));
                    }
                },
                onerror: function(e) {
                    console.error('测试API网络错误:', e);
                    reject(new Error('网络请求失败: ' + (e.error || '未知错误')));
                },
                ontimeout: function() {
                    console.error('测试API超时');
                    reject(new Error('请求超时 (30秒)'));
                },
                onabort: function() {
                    console.error('测试API被中止');
                    reject(new Error('请求被中止'));
                }
            });
        });
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

