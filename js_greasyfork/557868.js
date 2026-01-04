// ==UserScript==
// @name         Z-Image Free AI Image Generator - No Login Required
// @name:zh-CN   Z-Image 免费AI图片生成器 - 无需登录
// @namespace    https://zimage.run/
// @version      1.0.0
// @description  Generate AI images on any webpage! Powered by Alibaba's Z-Image Turbo model. No login required, no registration needed, completely free to use. Supports bilingual Chinese-English prompts, 8-step ultra-fast inference, photorealistic output.
// @description:zh-CN 在任何网页中快速生成AI图片！基于阿里巴巴Z-Image Turbo模型，无需登录，无需注册，完全免费使用。支持中英文双语提示词，8步极速推理，照片级真实输出。
// @author       Z-Image Team
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @connect      zimage.run
// @license      MIT
// @homepage     https://zimage.run
// @supportURL   https://github.com/Tongyi-MAI/Z-Image/issues
// @icon         https://zimage.run/logo.png
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/557868/Z-Image%20Free%20AI%20Image%20Generator%20-%20No%20Login%20Required.user.js
// @updateURL https://update.greasyfork.org/scripts/557868/Z-Image%20Free%20AI%20Image%20Generator%20-%20No%20Login%20Required.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== Configuration ====================
    const CONFIG = {
        API_BASE: 'https://zimage.run/api/z-image',
        POLLING_INTERVAL: 3000, // Polling interval in milliseconds
        MAX_POLLING_ATTEMPTS: 200, // Maximum polling attempts (10 minutes)
        DEFAULT_WIDTH: 512,
        DEFAULT_HEIGHT: 512,
    };

    // ==================== Styles ====================
    GM_addStyle(`
        /* Float button styles */
        #z-image-float-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            cursor: pointer;
            z-index: 999999;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s ease;
            border: none;
        }

        #z-image-float-btn:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        #z-image-float-btn svg {
            width: 30px;
            height: 30px;
            fill: white;
        }

        /* Modal styles */
        #z-image-modal {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.7);
            z-index: 1000000;
            display: none;
            align-items: center;
            justify-content: center;
            backdrop-filter: blur(5px);
        }

        #z-image-modal.show {
            display: flex;
        }

        #z-image-modal-content {
            background: white;
            border-radius: 16px;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(-50px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Modal header */
        .z-image-modal-header {
            padding: 24px;
            border-bottom: 1px solid #e5e7eb;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .z-image-modal-title {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin: 0;
        }

        .z-image-modal-subtitle {
            font-size: 14px;
            color: #6b7280;
            margin-top: 4px;
        }

        .z-image-close-btn {
            background: none;
            border: none;
            font-size: 28px;
            color: #9ca3af;
            cursor: pointer;
            padding: 0;
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 8px;
            transition: all 0.2s;
        }

        .z-image-close-btn:hover {
            background: #f3f4f6;
            color: #1f2937;
        }

        /* Modal body */
        .z-image-modal-body {
            padding: 24px;
        }

        /* Form styles */
        .z-image-form-group {
            margin-bottom: 20px;
        }

        .z-image-label {
            display: block;
            font-size: 14px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
        }

        .z-image-textarea {
            width: 100%;
            min-height: 120px;
            padding: 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            font-family: inherit;
            resize: vertical;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }

        .z-image-textarea:focus {
            outline: none;
            border-color: #667eea;
        }

        .z-image-size-group {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
        }

        .z-image-input {
            width: 100%;
            padding: 10px 12px;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            font-size: 14px;
            transition: border-color 0.2s;
            box-sizing: border-box;
        }

        .z-image-input:focus {
            outline: none;
            border-color: #667eea;
        }

        /* Button styles */
        .z-image-btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        }

        .z-image-btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            width: 100%;
        }

        .z-image-btn-primary:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .z-image-btn-primary:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        /* Result display */
        .z-image-result {
            margin-top: 24px;
            padding: 20px;
            background: #f9fafb;
            border-radius: 12px;
            display: none;
        }

        .z-image-result.show {
            display: block;
        }

        .z-image-status {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-bottom: 16px;
        }

        .z-image-spinner {
            width: 24px;
            height: 24px;
            border: 3px solid #e5e7eb;
            border-top-color: #667eea;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .z-image-status-text {
            font-size: 14px;
            color: #6b7280;
        }

        .z-image-preview {
            width: 100%;
            border-radius: 8px;
            margin-top: 16px;
        }

        .z-image-actions {
            display: flex;
            gap: 12px;
            margin-top: 16px;
        }

        .z-image-btn-secondary {
            background: white;
            color: #667eea;
            border: 2px solid #667eea;
            flex: 1;
        }

        .z-image-btn-secondary:hover {
            background: #667eea;
            color: white;
        }

        /* Hint text */
        .z-image-hint {
            font-size: 12px;
            color: #9ca3af;
            margin-top: 8px;
        }

        .z-image-badge {
            display: inline-block;
            padding: 4px 12px;
            background: #dbeafe;
            color: #1e40af;
            border-radius: 12px;
            font-size: 12px;
            font-weight: 600;
            margin-bottom: 12px;
        }

        /* Context menu styles */
        .z-image-context-menu {
            position: fixed;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            padding: 8px 0;
            z-index: 1000001;
            display: none;
            min-width: 200px;
        }

        .z-image-context-menu.show {
            display: block;
        }

        .z-image-context-item {
            padding: 10px 16px;
            cursor: pointer;
            font-size: 14px;
            color: #374151;
            transition: background 0.2s;
        }

        .z-image-context-item:hover {
            background: #f3f4f6;
        }

        /* Error message */
        .z-image-error {
            padding: 12px;
            background: #fee2e2;
            color: #991b1b;
            border-radius: 8px;
            margin-top: 12px;
            font-size: 14px;
        }
    `);

    // ==================== Utility Functions ====================

    /**
     * Create API request
     */
    function apiRequest(url, options = {}) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: options.method || 'GET',
                url: url,
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                data: options.body ? JSON.stringify(options.body) : undefined,
                onload: (response) => {
                    try {
                        const data = JSON.parse(response.responseText);
                        resolve(data);
                    } catch (e) {
                        reject(new Error('Failed to parse response'));
                    }
                },
                onerror: (error) => {
                    reject(new Error('Network error'));
                },
                ontimeout: () => {
                    reject(new Error('Request timeout'));
                }
            });
        });
    }

    /**
     * Generate image
     */
    async function generateImage(prompt, width, height, seed) {
        const response = await apiRequest(`${CONFIG.API_BASE}/generate`, {
            method: 'POST',
            body: {
                prompt: prompt,
                width: parseInt(width),
                height: parseInt(height),
                seed: seed || undefined
            }
        });

        if (!response.success) {
            throw new Error(response.error || 'Generation failed');
        }

        return response.data;
    }

    /**
     * Check task status
     */
    async function checkStatus(uuid) {
        const response = await apiRequest(`${CONFIG.API_BASE}/status/${uuid}`);

        if (!response.success) {
            throw new Error(response.error || 'Failed to check status');
        }

        return response.data;
    }

    /**
     * Poll task status until complete
     */
    async function pollUntilComplete(uuid, onProgress) {
        let attempts = 0;

        while (attempts < CONFIG.MAX_POLLING_ATTEMPTS) {
            const status = await checkStatus(uuid);

            if (onProgress) {
                onProgress(status);
            }

            if (status.status === 'completed') {
                return status;
            }

            if (status.status === 'failed') {
                throw new Error(status.errorMessage || 'Generation failed');
            }

            await new Promise(resolve => setTimeout(resolve, CONFIG.POLLING_INTERVAL));
            attempts++;
        }

        throw new Error('Generation timeout');
    }

    // ==================== UI Components ====================

    /**
     * Create float button
     */
    function createFloatButton() {
        const btn = document.createElement('button');
        btn.id = 'z-image-float-btn';
        btn.innerHTML = `
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/>
            </svg>
        `;
        btn.title = 'Z-Image AI Image Generator - No Login Required, Free to Use';
        btn.onclick = () => openModal();
        document.body.appendChild(btn);
    }

    /**
     * Create main modal
     */
    function createModal() {
        const modal = document.createElement('div');
        modal.id = 'z-image-modal';
        modal.innerHTML = `
            <div id="z-image-modal-content">
                <div class="z-image-modal-header">
                    <div>
                        <h2 class="z-image-modal-title">Z-Image AI Generator</h2>
                        <p class="z-image-modal-subtitle">No Login · No Registration · Completely Free</p>
                        <a href="https://zimage.run" target="_blank" style="color: #667eea; font-size: 14px; font-weight: 600; text-decoration: none; display: inline-flex; align-items: center; gap: 4px; margin-top: 4px;">
                            🌐 Visit zimage.run →
                        </a>
                    </div>
                    <button class="z-image-close-btn" onclick="document.getElementById('z-image-modal').classList.remove('show')">×</button>
                </div>
                <div class="z-image-modal-body">
                    <div class="z-image-badge">🚀 Powered by Alibaba Z-Image Turbo · Visit <a href="https://zimage.run" target="_blank" style="color: #1e40af; text-decoration: underline;">zimage.run</a> for more</div>

                    <div class="z-image-form-group">
                        <label class="z-image-label">Prompt (Chinese or English)</label>
                        <textarea
                            id="z-image-prompt"
                            class="z-image-textarea"
                            placeholder="Describe the image you want to generate, e.g., A white Persian cat sitting on a windowsill, sunlight streaming through the window onto the cat, warm lighting, soft shadows, professional pet photography, HD, depth of field effect"
                        ></textarea>
                        <div class="z-image-hint">💡 Tip: Detailed descriptions generate better images. Supports bilingual Chinese-English input.</div>
                    </div>

                    <div class="z-image-form-group">
                        <label class="z-image-label">Image Size</label>
                        <div class="z-image-size-group">
                            <div>
                                <input
                                    type="number"
                                    id="z-image-width"
                                    class="z-image-input"
                                    value="512"
                                    min="64"
                                    max="2048"
                                    placeholder="Width"
                                />
                            </div>
                            <div>
                                <input
                                    type="number"
                                    id="z-image-height"
                                    class="z-image-input"
                                    value="512"
                                    min="64"
                                    max="2048"
                                    placeholder="Height"
                                />
                            </div>
                        </div>
                        <div class="z-image-hint">📐 Recommended: 512×512 (square), 768×512 (landscape), 512×768 (portrait)</div>
                    </div>

                    <button id="z-image-generate-btn" class="z-image-btn z-image-btn-primary">
                        ✨ Generate Image for Free
                    </button>

                    <div style="text-align: center; margin-top: 16px; padding: 12px; background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%); border-radius: 8px;">
                        <p style="margin: 0; font-size: 13px; color: #6b7280;">
                            💡 Want more features? Visit
                            <a href="https://zimage.run" target="_blank" style="color: #667eea; font-weight: 700; text-decoration: none;">zimage.run</a>
                            for the full experience!
                        </p>
                    </div>

                    <div id="z-image-result" class="z-image-result">
                        <div id="z-image-status-container" class="z-image-status">
                            <div class="z-image-spinner"></div>
                            <span id="z-image-status-text" class="z-image-status-text">Generating...</span>
                        </div>
                        <div id="z-image-error" class="z-image-error" style="display: none;"></div>
                        <img id="z-image-preview" class="z-image-preview" style="display: none;" />
                        <div id="z-image-actions" class="z-image-actions" style="display: none;">
                            <button id="z-image-download-btn" class="z-image-btn z-image-btn-secondary">
                                📥 Download
                            </button>
                            <button id="z-image-copy-btn" class="z-image-btn z-image-btn-secondary">
                                📋 Copy Link
                            </button>
                            <button id="z-image-new-btn" class="z-image-btn z-image-btn-secondary">
                                🔄 Generate Again
                            </button>
                        </div>
                        <div style="text-align: center; margin-top: 16px; padding: 16px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 12px;">
                            <p style="margin: 0 0 8px 0; font-size: 15px; color: white; font-weight: 600;">
                                🎉 Success! Visit our website for more features
                            </p>
                            <a href="https://zimage.run" target="_blank" style="display: inline-block; padding: 10px 24px; background: white; color: #667eea; border-radius: 8px; text-decoration: none; font-weight: 700; font-size: 16px;">
                                🌐 Visit zimage.run Now
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        // Click background to close
        modal.onclick = (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        };

        // Bind generate button
        document.getElementById('z-image-generate-btn').onclick = handleGenerate;
    }

    /**
     * Open modal
     */
    function openModal(selectedText = '') {
        const modal = document.getElementById('z-image-modal');
        modal.classList.add('show');

        if (selectedText) {
            document.getElementById('z-image-prompt').value = selectedText;
        }

        // Reset result area
        document.getElementById('z-image-result').classList.remove('show');
        document.getElementById('z-image-preview').style.display = 'none';
        document.getElementById('z-image-actions').style.display = 'none';
        document.getElementById('z-image-error').style.display = 'none';
    }

    /**
     * Handle generate request
     */
    async function handleGenerate() {
        const promptEl = document.getElementById('z-image-prompt');
        const widthEl = document.getElementById('z-image-width');
        const heightEl = document.getElementById('z-image-height');
        const generateBtn = document.getElementById('z-image-generate-btn');
        const resultEl = document.getElementById('z-image-result');
        const statusTextEl = document.getElementById('z-image-status-text');
        const errorEl = document.getElementById('z-image-error');
        const previewEl = document.getElementById('z-image-preview');
        const actionsEl = document.getElementById('z-image-actions');

        const prompt = promptEl.value.trim();
        const width = parseInt(widthEl.value);
        const height = parseInt(heightEl.value);

        // Validate input
        if (!prompt) {
            alert('Please enter a prompt');
            return;
        }

        if (width < 64 || width > 2048 || height < 64 || height > 2048) {
            alert('Image size must be between 64 and 2048');
            return;
        }

        // Show loading state
        generateBtn.disabled = true;
        generateBtn.textContent = '⏳ Generating...';
        resultEl.classList.add('show');
        document.getElementById('z-image-status-container').style.display = 'flex';
        errorEl.style.display = 'none';
        previewEl.style.display = 'none';
        actionsEl.style.display = 'none';

        try {
            // 1. Create task
            statusTextEl.textContent = 'Creating generation task...';
            const { uuid } = await generateImage(prompt, width, height);

            // 2. Poll status
            const result = await pollUntilComplete(uuid, (status) => {
                if (status.status === 'pending') {
                    statusTextEl.textContent = `In queue, ${status.queuePosition} tasks ahead...`;
                } else if (status.status === 'processing') {
                    statusTextEl.textContent = `Generating... ${status.progress}%`;
                }
            });

            // 3. Show result
            document.getElementById('z-image-status-container').style.display = 'none';
            previewEl.src = result.resultUrl;
            previewEl.style.display = 'block';
            actionsEl.style.display = 'flex';

            // Bind action buttons
            document.getElementById('z-image-download-btn').onclick = () => {
                window.open(result.resultUrl, '_blank');
            };

            document.getElementById('z-image-copy-btn').onclick = () => {
                GM_setClipboard(result.resultUrl);
                alert('Image link copied to clipboard!');
            };

            document.getElementById('z-image-new-btn').onclick = () => {
                resultEl.classList.remove('show');
                previewEl.style.display = 'none';
                actionsEl.style.display = 'none';
            };

        } catch (error) {
            console.error('Generation error:', error);
            document.getElementById('z-image-status-container').style.display = 'none';
            errorEl.textContent = `❌ Generation failed: ${error.message}`;
            errorEl.style.display = 'block';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = '✨ Generate Image for Free';
        }
    }

    /**
     * Create context menu
     */
    function createContextMenu() {
        const menu = document.createElement('div');
        menu.id = 'z-image-context-menu';
        menu.className = 'z-image-context-menu';
        menu.innerHTML = `
            <div class="z-image-context-item" data-action="generate">
                🎨 Generate with Z-Image
            </div>
        `;
        document.body.appendChild(menu);

        // Bind click event
        menu.querySelector('[data-action="generate"]').onclick = () => {
            const selectedText = window.getSelection().toString().trim();
            openModal(selectedText);
            menu.classList.remove('show');
        };

        // Click elsewhere to close menu
        document.addEventListener('click', () => {
            menu.classList.remove('show');
        });
    }

    /**
     * Show context menu
     */
    function showContextMenu(e) {
        const selectedText = window.getSelection().toString().trim();
        if (!selectedText) return;

        e.preventDefault();
        const menu = document.getElementById('z-image-context-menu');
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
        menu.classList.add('show');
    }

    // ==================== Initialization ====================

    function init() {
        // Create UI components
        createFloatButton();
        createModal();
        createContextMenu();

        // Bind context menu
        document.addEventListener('contextmenu', showContextMenu);

        // Register userscript menu commands
        GM_registerMenuCommand('🎨 Open Z-Image Generator', () => openModal());
        GM_registerMenuCommand('🌐 Visit Z-Image Website', () => {
            window.open('https://zimage.run', '_blank');
        });

        console.log('✅ Z-Image userscript loaded - No login required, free to use!');
    }

    // Wait for DOM to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
