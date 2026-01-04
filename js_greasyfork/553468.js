// ==UserScript==
// @name        AI 网页图片上传 压缩 
// @namespace   https://github.com/JustDoIt166
// @version     1.4.1
// @description 拦截网页图片上传，替换为压缩后的图片，体积更小、加载更快；支持拖动、双击隐藏设置按钮；支持自定义快捷键唤出按钮；隐藏状态持久化；修复 Trusted Types 报错；自动修正文件后缀；统计压缩率；高级设置折叠；UI主题自适应；Worker生命周期优化；CSP 适配；主题切换
// @author      JustDoIt166
// @icon        https://raw.githubusercontent.com/JustDoIt166/AI-Upload-Image-Compressor/refs/heads/main/assets/icon.svg
// @match       https://chat.qwen.ai/*
// @match       https://chat.z.ai/*
// @match       https://chatgpt.com/*
// @match       https://gemini.google.com/*
// @match       https://chat.deepseek.com/*
// @match       https://yiyan.baidu.com/*
// @grant       GM_registerMenuCommand
// @grant       GM_getResourceText
// @resource    compressorWorker https://raw.githubusercontent.com/JustDoIt166/AI-Upload-Image-Compressor/refs/heads/main/worker.js
// @require     https://cdn.jsdelivr.net/npm/dompurify@3.0.6/dist/purify.min.js
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/553468/AI%20%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%20%E5%8E%8B%E7%BC%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/553468/AI%20%E7%BD%91%E9%A1%B5%E5%9B%BE%E7%89%87%E4%B8%8A%E4%BC%A0%20%E5%8E%8B%E7%BC%A9.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const SITE_CONFIGS = {
        'chat.qwen.ai': { fileInputSelector: 'input[type="file"]', name: 'Qwen' },
        'chat.z.ai': { fileInputSelector: 'input[type="file"]', name: 'Z.AI' },
        'gemini.google.com': { fileInputSelector: 'input[type="file"]', name: 'Gemini' },
        'chat.deepseek.com': { fileInputSelector: 'input[type="file"]', name: 'DeepSeek' }
    };

    const DEFAULT_SETTINGS = {
        mimeType: 'image/webp',
        quality: 0.85,
        maxWidth: 4096,
        maxHeight: 2160,
        autoCompress: true,
        adaptiveQuality: true,
        adaptiveQualityThresholds: [
            { size: 1024 * 1024, quality: 0.95 },
            { size: 3 * 1024 * 1024, quality: 0.85 },
            { size: 5 * 1024 * 1024, quality: 0.75 },
            { size: Infinity, quality: 0.65 }
        ],
        enableHotkey: true,
        hotkey: 'Alt+C',
        enableDblClickReveal: true,
        positionOffset: { x: 20, y: 50 },
        themeAuto: true,
        themeOverride: 'auto', // auto / light / dark
        advancedSettingsCollapsed: false
    };

    const stats = {
        totalCompressed: 0,
        totalSizeSaved: 0,
        compressionHistory: []
    };

    const ImageCompressor = {
        settings: { ...DEFAULT_SETTINGS },
        isButtonHidden: false,
        worker: null,
        workerUrl: null,
        ttPolicy: null,
        activeTheme: 'light',
        hasCspMeta: false,

        init() {
            this.checkCspMeta();
            this.initTrustedTypes();
            this.loadSettings();
            this.loadStats();
            this.detectTheme();
            this.setupEventListeners();
            this.createUI();
            this.initWorker();
            this.setupHotkeyListener();

            if (this.settings.enableDblClickReveal) {
                this.setupGlobalRevealOnDblTap();
                this.setupDesktopRevealOnDblClick();
            }

            if (typeof GM_registerMenuCommand !== 'undefined') {
                GM_registerMenuCommand('打开图片压缩设置', () => {
                    this.showSettingsButton();
                    this.toggleSettingsPanel();
                });
                GM_registerMenuCommand('隐藏图片压缩按钮', () => {
                    this.hideSettingsButton();
                    this.showToast('设置按钮已隐藏，可通过双击空白处或快捷键再次唤出', 'info');
                });
            }

            window.addEventListener('beforeunload', () => {
                this.terminateWorker();
            });

            console.log('🛡️ 图片压缩脚本 v1.4.1 已激活 ');
        },

        checkCspMeta() {
            this.hasCspMeta = !!document.querySelector('meta[http-equiv="Content-Security-Policy"], meta[name="content-security-policy"]');
        },

        detectTheme() {
            if (this.settings.themeOverride === 'light' || this.settings.themeOverride === 'dark') {
                this.activeTheme = this.settings.themeOverride;
                return;
            }

            if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                this.activeTheme = 'dark';
            } else {
                this.activeTheme = 'light';
            }

            const htmlElement = document.documentElement;
            const bodyStyles = window.getComputedStyle(document.body);

            const isDarkMode =
                bodyStyles.backgroundColor &&
                (this.getLuminance(bodyStyles.backgroundColor) < 0.5 ||
                    htmlElement.getAttribute('data-theme') === 'dark' ||
                    htmlElement.classList.contains('dark-mode') ||
                    htmlElement.classList.contains('dark'));

            if (this.settings.themeAuto && isDarkMode) {
                this.activeTheme = 'dark';
            }
        },

        setTheme(mode) {
            if (['light', 'dark', 'auto'].includes(mode)) {
                this.settings.themeOverride = mode;
            }
            if (mode === 'auto') {
                this.detectTheme();
            } else {
                this.activeTheme = mode;
            }
            this.saveSettings();
            this.updatePanelTheme();
            this.updateThemeToggleButton();
        },

        getLuminance(color) {
            const rgb = color.match(/\d+/g);
            if (!rgb || rgb.length < 3) return 0.5;
            const r = parseInt(rgb[0], 10) / 255;
            const g = parseInt(rgb[1], 10) / 255;
            const b = parseInt(rgb[2], 10) / 255;
            return 0.2126 * r + 0.7152 * g + 0.0722 * b;
        },

        getThemeColors() {
            if (this.activeTheme === 'dark') {
                return {
                    bg: '#2d2d2d',
                    panelBg: '#1e1e1e',
                    text: '#e0e0e0',
                    border: '#444',
                    buttonBg: '#3a3a3a',
                    accent: '#4a9eff'
                };
            }
            return {
                bg: '#ffffff',
                panelBg: '#ffffff',
                text: '#333333',
                border: '#ddd',
                buttonBg: '#f5f5f5',
                accent: '#2196f3'
            };
        },

        initTrustedTypes() {
            if (window.trustedTypes && window.trustedTypes.createPolicy) {
                try {
                    this.ttPolicy = window.trustedTypes.createPolicy('ai-upload-compressor-policy', {
                        createHTML: (string) => string,
                        createScriptURL: (url) => url,
                        createScript: (script) => script
                    });
                } catch (e) {
                    console.warn('Trusted Types 策略创建受限，回退到普通模式:', e);
                }
            }
        },

        renderHTML(htmlString) {
            if (this.ttPolicy && !this.hasCspMeta) {
                return this.ttPolicy.createHTML(htmlString);
            }
            if (window.DOMPurify) {
                return window.DOMPurify.sanitize(htmlString, { RETURN_TRUSTED_TYPE: !!this.ttPolicy });
            }
            return htmlString;
        },

        loadSettings() {
            const saved = localStorage.getItem('imageCompressSettings');
            if (saved) {
                try {
                    const parsed = JSON.parse(saved);
                    if (parsed && typeof parsed === 'object') {
                        this.settings = { ...this.settings, ...parsed };
                        if (!parsed.adaptiveQualityThresholds) {
                            this.settings.adaptiveQualityThresholds = [...DEFAULT_SETTINGS.adaptiveQualityThresholds];
                        }
                        if (!parsed.themeOverride) {
                            this.settings.themeOverride = 'auto';
                        }
                    }
                } catch (e) {
                    console.warn('图片压缩设置解析失败，使用默认设置:', e);
                }
            }
            this.isButtonHidden = localStorage.getItem('compressButtonHidden') === 'true';
        },

        saveSettings() {
            try {
                localStorage.setItem('imageCompressSettings', JSON.stringify(this.settings));
            } catch (e) {
                console.warn('保存设置失败:', e);
            }
        },

        loadStats() {
            const saved = localStorage.getItem('compressStats');
            if (saved) {
                try {
                    const savedStats = JSON.parse(saved);
                    stats.totalCompressed = savedStats.totalCompressed || 0;
                    stats.totalSizeSaved = savedStats.totalSizeSaved || 0;
                    if (Array.isArray(savedStats.compressionHistory)) {
                        stats.compressionHistory = savedStats.compressionHistory.slice(-100);
                    } else {
                        stats.compressionHistory = [];
                    }
                } catch (e) {
                    console.warn('压缩统计解析失败，将重置:', e);
                }
            }
        },

        updateStats(originalSize, compressedSize) {
            stats.totalCompressed++;
            stats.totalSizeSaved += originalSize - compressedSize;
            stats.compressionHistory.push({
                date: new Date().toISOString(),
                originalSize,
                compressedSize,
                saved: originalSize - compressedSize
            });
            if (stats.compressionHistory.length > 100) {
                stats.compressionHistory.shift();
            }
            try {
                localStorage.setItem('compressStats', JSON.stringify(stats));
            } catch (e) {
                console.warn('保存压缩统计失败:', e);
            }
        },

        getWorkerScript() {
            if (typeof GM_getResourceText !== 'undefined') {
                try {
                    const resource = GM_getResourceText('compressorWorker');
                    if (resource && resource.trim()) {
                        return resource;
                    }
                } catch (err) {
                    console.warn('读取 Worker 资源失败，使用内联备用方案:', err);
                }
            }
            // 内联备用方案，避免完全失效
            return `
                self.onmessage = async function(e) {
                    if (typeof OffscreenCanvas === 'undefined') {
                        self.postMessage({ error: '浏览器不支持后台压缩 (OffscreenCanvas missing)' });
                        return;
                    }
                    if (typeof createImageBitmap === 'undefined') {
                        self.postMessage({ error: '浏览器不支持 createImageBitmap' });
                        return;
                    }
                    const { file, mimeType, quality, maxWidth, maxHeight } = e.data;
                    try {
                        const imageBitmap = await createImageBitmap(file);
                        let width = imageBitmap.width;
                        let height = imageBitmap.height;
                        const originalRatio = width / height;

                        let needsResize = false;
                        if (width > maxWidth) {
                            width = maxWidth;
                            height = width / originalRatio;
                            needsResize = true;
                        }
                        if (height > maxHeight) {
                            height = maxHeight;
                            width = height * originalRatio;
                            needsResize = true;
                        }

                        const canvas = new OffscreenCanvas(
                            needsResize ? Math.round(width) : imageBitmap.width,
                            needsResize ? Math.round(height) : imageBitmap.height
                        );

                        const ctx = canvas.getContext('2d', { alpha: mimeType !== 'image/jpeg' });
                        if (!ctx) {
                            self.postMessage({ error: '无法获取绘图上下文' });
                            imageBitmap.close();
                            return;
                        }

                        if (mimeType === 'image/jpeg') {
                            ctx.fillStyle = '#FFFFFF';
                            ctx.fillRect(0, 0, canvas.width, canvas.height);
                        }

                        ctx.drawImage(imageBitmap, 0, 0, canvas.width, canvas.height);
                        imageBitmap.close();

                        const blob = await canvas.convertToBlob({ type: mimeType, quality });
                        self.postMessage({ compressedBlob: blob });
                    } catch (error) {
                        self.postMessage({ error: error && error.message ? error.message : String(error) });
                    }
                };
            `;
        },

        initWorker() {
            const workerCode = this.getWorkerScript();
            const blob = new Blob([workerCode], { type: 'application/javascript' });
            const workerUrl = URL.createObjectURL(blob);
            this.workerUrl = workerUrl;
            this.worker = new Worker(workerUrl);
        },

        terminateWorker() {
            if (this.worker) {
                this.worker.terminate();
                this.worker = null;
            }
            if (this.workerUrl) {
                URL.revokeObjectURL(this.workerUrl);
                this.workerUrl = null;
            }
        },

        compress(file) {
            return new Promise((resolve, reject) => {
                if (!this.worker) {
                    this.initWorker();
                }
                if (!this.worker) {
                    reject(new Error('Worker初始化失败'));
                    return;
                }
                let quality = this.settings.quality;
                if (this.settings.adaptiveQuality) {
                    quality = this.getAdaptiveQuality(file.size);
                }
                const messageId = Date.now() + Math.random();

                const handleMessage = (e) => {
                    if (e.data.error) {
                        reject(new Error(e.data.error));
                    } else {
                        resolve(e.data.compressedBlob);
                    }
                    this.worker.removeEventListener('message', handleMessage);
                };

                this.worker.addEventListener('message', handleMessage);
                this.worker.postMessage({
                    file,
                    mimeType: this.settings.mimeType,
                    quality,
                    maxWidth: this.settings.maxWidth,
                    maxHeight: this.settings.maxHeight,
                    id: messageId
                });
            });
        },

        getAdaptiveQuality(fileSize) {
            const thresholds = this.settings.adaptiveQualityThresholds;
            for (const threshold of thresholds) {
                if (fileSize < threshold.size) {
                    return threshold.quality;
                }
            }
            return thresholds[thresholds.length - 1].quality;
        },

        async handleMultipleFiles(files) {
            const compressedFiles = [];
            const extMap = {
                'image/webp': '.webp',
                'image/jpeg': '.jpg',
                'image/png': '.png'
            };

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                if (!file.type.startsWith('image/')) {
                    compressedFiles.push(file);
                    continue;
                }

                this.showToast(`处理图片 ${i + 1}/${files.length}: ${file.name}`, 'info');
                try {
                    const compressedBlob = await this.compress(file);

                    const targetExt = extMap[this.settings.mimeType] || '.jpg';
                    const dotIndex = file.name.lastIndexOf('.');
                    const baseName = dotIndex > 0 ? file.name.substring(0, dotIndex) : file.name;
                    const newFileName = baseName + targetExt;

                    const compressedFile = new File([compressedBlob], newFileName, {
                        type: this.settings.mimeType,
                        lastModified: Date.now()
                    });

                    compressedFiles.push(compressedFile);
                    this.updateStats(file.size, compressedFile.size);

                    const savedBytes = file.size - compressedFile.size;
                    const savedMB = (savedBytes / 1024 / 1024).toFixed(2);
                    let ratioText = '未知';
                    if (file.size > 0) {
                        const ratio = (compressedFile.size / file.size) * 100;
                        ratioText = ratio.toFixed(1) + '%';
                    }
                    this.showToast(
                        `✅ ${file.name} 压缩成功，压缩后约为原图的 ${ratioText}，节省 ${savedMB} MB`,
                        'success'
                    );
                } catch (err) {
                    console.error(`压缩 ${file.name} 失败:`, err);
                    this.showToast(`⚠️ ${file.name} 压缩失败，已使用原图上传`, 'error');
                    compressedFiles.push(file);
                }
            }
            return compressedFiles;
        },

        setupEventListeners() {
            document.addEventListener('change', async (e) => {
                if (e._myScriptIsProcessing) return;
                const target = e.target;
                if (!(target?.tagName === 'INPUT' && target.type === 'file' && target.files?.length > 0)) {
                    return;
                }
                const imageFiles = Array.from(target.files).filter(file => file.type.startsWith('image/'));
                if (imageFiles.length === 0) return;
                if (!this.settings.autoCompress) return;

                e.stopImmediatePropagation();
                e.preventDefault();
                try {
                    const finalFiles = await this.handleMultipleFiles(Array.from(target.files));
                    const dt = new DataTransfer();
                    finalFiles.forEach(file => dt.items.add(file));

                    target.files = dt.files;
                    const newEvent = new Event('change', { bubbles: true, cancelable: true });
                    newEvent._myScriptIsProcessing = true;
                    target.dispatchEvent(newEvent);
                } catch (err) {
                    console.error('❌ 压缩替换失败:', err);
                    this.showToast('❌ 图片压缩流程异常，请重试', 'error');
                }
            }, true);

            this.observeFileInputs();
        },

        observeFileInputs() {
            if (!window.MutationObserver) return;
            const observer = new MutationObserver(() => { });
            observer.observe(document.body, { childList: true, subtree: true });
        },

        createUI() {
            if (document.getElementById('compress-settings-btn')) return;

            const settingsBtn = document.createElement('div');
            settingsBtn.id = 'compress-settings-btn';

            const svgContent = `
                <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="paperGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#FDF8EC"/>
                            <stop offset="100%" stop-color="#EBE3D6"/>
                        </linearGradient>
                        <linearGradient id="darkPaperGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stop-color="#D6CFBF"/>
                            <stop offset="100%" stop-color="#C2BAAB"/>
                        </linearGradient>
                    </defs>
                    <g transform="translate(60, 20) rotate(5)">
                        <rect x="0" y="0" width="100" height="120" rx="10" fill="url(#darkPaperGradient)" stroke="#4A4A4A" stroke-width="2"/>
                        <line x1="85" y1="20" x2="85" y2="100" stroke="#4A4A4A" stroke-width="2" stroke-dasharray="2,4"/>
                    </g>
                    <rect x="25" y="40" width="120" height="140" rx="10" fill="url(#paperGradient)" stroke="#4A4A4A" stroke-width="2"/>
                    <rect x="40" y="55" width="90" height="60" rx="5" fill="#C2E6F2" stroke="#4A4A4A" stroke-width="2"/>
                    <path d="M40 115 L65 75 L85 110 L105 70 L130 115 Z" fill="#2DA592" stroke="#4A4A4A" stroke-width="2" stroke-linejoin="round"/>
                    <path d="M55 115 L75 85 L95 115 Z" fill="#2DA592" stroke="#4A4A4A" stroke-width="2" stroke-linejoin="round"/>
                    <circle cx="115" cy="70" r="8" fill="#FDD755" stroke="#4A4A4A" stroke-width="2"/>
                    <rect x="40" y="130" width="70" height="5" rx="2" fill="#4A4A4A"/>
                    <rect x="40" y="140" width="50" height="5" rx="2" fill="#4A4A4A"/>
                    <rect x="40" y="150" width="60" height="5" rx="2" fill="#4A4A4A"/>
                </svg>
            `;

            settingsBtn.innerHTML = this.renderHTML(svgContent);

            const colors = this.getThemeColors();

            settingsBtn.title = '图片压缩设置（双击隐藏）';
            settingsBtn.style.cssText = `
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                background: ${colors.buttonBg};
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: move;
                z-index: 99999;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                transition: transform 0.2s;
                user-select: none;
                border: 1px solid ${colors.border};
            `;

            const savedPos = JSON.parse(localStorage.getItem('compressBtnPosition') || 'null');
            if (savedPos && typeof savedPos.x === 'number' && typeof savedPos.y === 'number') {
                const x = Math.max(this.settings.positionOffset.x, Math.min(savedPos.x, window.innerWidth - 50));
                const y = Math.max(this.settings.positionOffset.y, Math.min(savedPos.y, window.innerHeight - 50));
                settingsBtn.style.left = x + 'px';
                settingsBtn.style.top = y + 'px';
                settingsBtn.style.right = 'auto';
                settingsBtn.style.bottom = 'auto';
                settingsBtn.style.transform = 'none';
            } else {
                if (this.settings.positionOffset.x !== 20 || this.settings.positionOffset.y !== 50) {
                    settingsBtn.style.right = this.settings.positionOffset.x + 'px';
                    settingsBtn.style.top = this.settings.positionOffset.y + '%';
                    settingsBtn.style.transform = 'translateY(-50%)';
                }
            }

            if (this.isButtonHidden) {
                settingsBtn.style.display = 'none';
            }

            let isDragging = false;
            let offsetX, offsetY;

            const onMouseDown = (e) => {
                isDragging = true;
                const rect = settingsBtn.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;
                settingsBtn.style.cursor = 'grabbing';
                e.preventDefault();
            };

            const onMouseMove = (e) => {
                if (!isDragging) return;
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                const maxX = window.innerWidth - settingsBtn.offsetWidth;
                const maxY = window.innerHeight - settingsBtn.offsetHeight;
                const boundedX = Math.max(this.settings.positionOffset.x, Math.min(x, maxX));
                const boundedY = Math.max(this.settings.positionOffset.y, Math.min(y, maxY));
                settingsBtn.style.left = `${boundedX}px`;
                settingsBtn.style.top = `${boundedY}px`;
                settingsBtn.style.right = 'auto';
                settingsBtn.style.bottom = 'auto';
                settingsBtn.style.transform = 'none';
            };

            const onMouseUp = () => {
                if (!isDragging) return;
                isDragging = false;
                settingsBtn.style.cursor = 'move';
                const rect = settingsBtn.getBoundingClientRect();
                const x = rect.left + window.scrollX;
                const y = rect.top + window.scrollY;
                localStorage.setItem('compressBtnPosition', JSON.stringify({ x, y }));
            };

            settingsBtn.addEventListener('mousedown', onMouseDown);
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);

            settingsBtn.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                this.hideSettingsButton();
                if ('ontouchstart' in window) {
                    this.showToast('在空白处双击可重新显示按钮', 'info');
                }
            });

            let lastTap = 0;
            settingsBtn.addEventListener('touchstart', (e) => {
                const now = Date.now();
                if (now - lastTap < 350 && now - lastTap > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.hideSettingsButton();
                    if ('ontouchstart' in window) {
                        this.showToast('在空白处双击可重新显示按钮', 'info');
                    }
                    lastTap = 0;
                } else {
                    lastTap = now;
                }
            });

            settingsBtn.addEventListener('click', (e) => {
                if (isDragging) return;
                e.stopPropagation();
                this.toggleSettingsPanel();
            });

            settingsBtn.addEventListener('mouseenter', () => {
                if (!isDragging) settingsBtn.style.transform = 'scale(1.1)';
            });

            settingsBtn.addEventListener('mouseleave', () => {
                if (!isDragging) settingsBtn.style.transform = 'scale(1)';
            });

            if (document.body) {
                document.body.appendChild(settingsBtn);
            } else {
                document.addEventListener('DOMContentLoaded', () => {
                    document.body.appendChild(settingsBtn);
                });
            }

            this.createSettingsPanel();
        },

        hideSettingsButton() {
            const btn = document.getElementById('compress-settings-btn');
            if (btn) {
                btn.style.display = 'none';
                this.isButtonHidden = true;
                localStorage.setItem('compressButtonHidden', 'true');
            }
        },

        showSettingsButton() {
            const btn = document.getElementById('compress-settings-btn');
            if (btn) {
                btn.style.display = 'flex';
                this.isButtonHidden = false;
                localStorage.setItem('compressButtonHidden', 'false');
            }
        },

        createSettingsPanel() {
            if (document.getElementById('compress-settings-panel')) return;

            const panel = document.createElement('div');
            panel.id = 'compress-settings-panel';

            const colors = this.getThemeColors();

            panel.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: ${colors.panelBg};
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                z-index: 100000;
                width: 400px;
                max-width: 90vw;
                max-height: 80vh;
                overflow-y: auto;
                display: none;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                padding: 24px;
                box-sizing: border-box;
                color: ${colors.text};
            `;

            const savedMB = (stats.totalSizeSaved / 1024 / 1024).toFixed(2);

            const adaptiveThresholdsHTML = this.settings.adaptiveQualityThresholds.map((threshold, index) => `
                <div class="threshold-item" data-index="${index}" style="display: flex; align-items: center; margin-bottom: 8px; gap: 8px;">
                    <span style="flex: 1; min-width: 80px;">
                        <input type="number" class="size-input" value="${threshold.size / 1024 / 1024}" step="0.5" min="0.5" style="width: 60px; padding: 4px; border: 1px solid ${colors.border}; border-radius: 4px;">
                        MB
                    </span>
                    <span style="flex: 1; min-width: 80px;">
                        质量:
                        <input type="number" class="quality-input" value="${threshold.quality}" step="0.05" min="0.1" max="1" style="width: 60px; padding: 4px; border: 1px solid ${colors.border}; border-radius: 4px;">
                    </span>
                    ${index > 0 ? `<button class="remove-threshold" data-index="${index}" style="padding: 2px 6px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">删除</button>` : '<span style="width: 40px;"></span>'}
                </div>
            `).join('');

            const panelContent = `
                <h3 style="margin-top: 0; color: ${colors.text};">图片压缩设置</h3>

                <div class="setting-item" style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; color: ${colors.text};">
                        压缩质量: <span id="quality-value">${this.settings.quality}</span>
                    </label>
                    <input type="range" id="quality-slider" min="0.1" max="1" step="0.05" value="${this.settings.quality}" style="width: 100%;">
                </div>
                <div class="setting-item" style="margin-bottom: 16px;">
                    <label style="display: block; margin-bottom: 8px; color: ${colors.text};">
                        输出格式:
                    </label>
                    <select id="output-format" style="width: 100%; padding: 8px; border: 1px solid ${colors.border}; border-radius: 4px; background: ${colors.panelBg}; color: ${colors.text};">
                        <option value="image/webp" ${this.settings.mimeType === 'image/webp' ? 'selected' : ''}>WebP（推荐，更小体积）</option>
                        <option value="image/jpeg" ${this.settings.mimeType === 'image/jpeg' ? 'selected' : ''}>JPEG（兼容性好）</option>
                        <option value="image/png" ${this.settings.mimeType === 'image/png' ? 'selected' : ''}>PNG（无损压缩）</option>
                    </select>
                </div>

                <div id="advanced-settings-toggle" style="
                    margin: 12px 0;
                    padding: 8px 10px;
                    border-radius: 6px;
                    background: ${colors.buttonBg};
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    cursor: pointer;
                    user-select: none;
                    font-size: 14px;
                    color: ${colors.text};
                ">
                    <span>高级设置</span>
                    <span id="advanced-arrow">${this.settings.advancedSettingsCollapsed ? '▶' : '▼'}</span>
                </div>

                <div id="advanced-settings" style="display: ${this.settings.advancedSettingsCollapsed ? 'none' : 'block'}; border-top: 1px solid ${colors.border}; padding-top: 12px; margin-bottom: 8px;">
                    <div class="setting-item" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; color: ${colors.text};">
                            最大宽度 (px):
                        </label>
                        <input type="number" id="max-width" value="${this.settings.maxWidth}" style="width: 100%; padding: 8px; border: 1px solid ${colors.border}; border-radius: 4px; background: ${colors.panelBg}; color: ${colors.text};">
                    </div>
                    <div class="setting-item" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; color: ${colors.text};">
                            最大高度 (px):
                        </label>
                        <input type="number" id="max-height" value="${this.settings.maxHeight}" style="width: 100%; padding: 8px; border: 1px solid ${colors.border}; border-radius: 4px; background: ${colors.panelBg}; color: ${colors.text};">
                    </div>
                    <div class="setting-item" style="margin-bottom: 16px;">
                        <label style="display: flex; align-items: center; color: ${colors.text};">
                            <input type="checkbox" id="auto-compress" ${this.settings.autoCompress ? 'checked' : ''} style="margin-right: 8px;">
                            自动压缩上传的图片
                        </label>
                    </div>
                    <div class="setting-item" style="margin-bottom: 16px;">
                        <label style="display: flex; align-items: center; color: ${colors.text};">
                            <input type="checkbox" id="adaptive-quality" ${this.settings.adaptiveQuality ? 'checked' : ''} style="margin-right: 8px;">
                            自适应压缩质量
                        </label>
                    </div>

                    <div class="setting-item" id="thresholds-container" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; color: ${colors.text};">
                            自适应质量阈值:
                        </label>
                        ${adaptiveThresholdsHTML}
                        <button id="add-threshold" style="padding: 6px 12px; background: ${colors.accent}; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 8px;">添加阈值</button>
                    </div>

                    <div class="setting-item" style="margin-bottom: 16px;">
                        <label style="display: flex; align-items: center; color: ${colors.text};">
                            <input type="checkbox" id="enable-hotkey" ${this.settings.enableHotkey ? 'checked' : ''} style="margin-right: 8px;">
                            启用快捷键唤出设置按钮
                        </label>
                    </div>
                    <div class="setting-item" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; color: ${colors.text};">
                            快捷键（示例：Alt+C、Ctrl+Shift+P）:
                        </label>
                        <input type="text" id="hotkey-input" value="${this.settings.hotkey}"
                               placeholder="例如：Alt+C"
                               style="width: 100%; padding: 8px; border: 1px solid ${colors.border}; border-radius: 4px; background: ${colors.panelBg}; color: ${colors.text};">
                        <p style="font-size: 12px; color: #888; margin-top: 4px;">
                            支持 Ctrl / Shift / Alt / Meta（Mac ⌘）+ 字母/数字/F1~F12
                        </p>
                    </div>
                    <div class="setting-item" style="margin-bottom: 16px;">
                        <label style="display: flex; align-items: center; color: ${colors.text};">
                            <input type="checkbox" id="enable-dblclick-reveal" ${this.settings.enableDblClickReveal ? 'checked' : ''} style="margin-right: 8px;">
                            允许双击空白区域唤出按钮
                        </label>
                    </div>
                
                    <div class="setting-item" style="margin-bottom: 16px;">
                        <label style="display: flex; align-items: center; color: ${colors.text};">
                            <input type="checkbox" id="theme-auto" ${this.settings.themeAuto ? 'checked' : ''} style="margin-right: 8px;">
                            自动适配页面主题
                        </label>
                    </div>
                    <div class="setting-item" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; color: ${colors.text};">
                            主题模式:
                        </label>
                        <div id="theme-toggle-group" style="display: flex; gap: 8px;">
                            <button data-theme="auto" class="theme-toggle-btn" style="flex:1; padding: 8px; border: 1px solid ${colors.border}; border-radius: 6px; background: ${this.settings.themeOverride === 'auto' ? colors.accent : colors.buttonBg}; color: ${this.settings.themeOverride === 'auto' ? '#fff' : colors.text}; cursor: pointer;">自动</button>
                            <button data-theme="light" class="theme-toggle-btn" style="flex:1; padding: 8px; border: 1px solid ${colors.border}; border-radius: 6px; background: ${this.settings.themeOverride === 'light' ? colors.accent : colors.buttonBg}; color: ${this.settings.themeOverride === 'light' ? '#fff' : colors.text}; cursor: pointer;">浅色</button>
                            <button data-theme="dark" class="theme-toggle-btn" style="flex:1; padding: 8px; border: 1px solid ${colors.border}; border-radius: 6px; background: ${this.settings.themeOverride === 'dark' ? colors.accent : colors.buttonBg}; color: ${this.settings.themeOverride === 'dark' ? '#fff' : colors.text}; cursor: pointer;">深色</button>
                        </div>
                    </div>
                    <div class="setting-item" style="margin-bottom: 16px;">
                        <label style="display: block; margin-bottom: 8px; color: ${colors.text};">
                            定位偏移 (X, Y%):
                        </label>
                        <div style="display: flex; gap: 8px;">
                            <input type="number" id="offset-x" value="${this.settings.positionOffset.x}" min="0" style="flex: 1; padding: 8px; border: 1px solid ${colors.border}; border-radius: 4px; background: ${colors.panelBg}; color: ${colors.text};">
                            <input type="number" id="offset-y" value="${this.settings.positionOffset.y}" min="0" max="100" style="flex: 1; padding: 8px; border: 1px solid ${colors.border}; border-radius: 4px; background: ${colors.panelBg}; color: ${colors.text};">
                        </div>
                        <p style="font-size: 12px; color: #888; margin-top: 4px;">
                            X:右侧偏移(px), Y:垂直位置(%)
                        </p>
                    </div>
                </div>

                <div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid ${colors.border};">
                    <p id="stats-text" style="color: ${colors.text}; font-size: 14px; margin: 0 0 16px 0;">
                        已压缩 ${stats.totalCompressed} 张图片，节省 ${savedMB} MB 空间
                    </p>
                </div>
                <div style="display: flex; gap: 12px; justify-content: flex-end;">
                    <button id="reset-stats" style="padding: 8px 16px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        重置统计
                    </button>
                    <button id="save-settings" style="padding: 8px 16px; background: ${colors.accent}; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        保存设置
                    </button>
                </div>
                <a href="https://github.com/JustDoIt166/AI-Upload-Image-Compressor" target="_blank"
                    style="display: block; margin-top: 12px; color: ${colors.accent}; text-decoration: none; font-size: 13px; text-align: center; display: flex; align-items: center; justify-content: center; gap: 6px;">
                    <svg aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" style="fill: currentColor;">
                    <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.81 3.65-3.93 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.04-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.27-.82 2.15 0 3.12 1.86 3.73 3.64 3.93-.24.21-.45.74-.45 1.48 0 1.07.01 1.93.01 2.2 0 .21-.15.46-.55.38A8.013 8.013 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
                    </svg>
                    查看 脚本源代码
                </a>
            `;

            panel.innerHTML = this.renderHTML(panelContent);
            document.body.appendChild(panel);

            const overlay = document.createElement('div');
            overlay.id = 'compress-settings-overlay';
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                z-index: 99999;
                display: none;
                backdrop-filter: blur(4px);
            `;
            document.body.appendChild(overlay);

            const advToggle = panel.querySelector('#advanced-settings-toggle');
            const advSection = panel.querySelector('#advanced-settings');
            const advArrow = panel.querySelector('#advanced-arrow');
            if (advToggle && advSection) {
                advToggle.addEventListener('click', () => {
                    const isHidden = advSection.style.display === 'none';
                    advSection.style.display = isHidden ? 'block' : 'none';
                    if (advArrow) {
                        advArrow.textContent = isHidden ? '▼' : '▶';
                    }
                    this.settings.advancedSettingsCollapsed = !isHidden;
                });
            }

            const addThresholdBtn = panel.querySelector('#add-threshold');
            if (addThresholdBtn) {
                addThresholdBtn.addEventListener('click', () => {
                    const thresholdsContainer = panel.querySelector('#thresholds-container');
                    const currentThresholds = this.settings.adaptiveQualityThresholds;
                    const newIndex = currentThresholds.length;
                    const defaultThreshold = { size: 10 * 1024 * 1024, quality: 0.5 };

                    currentThresholds.push(defaultThreshold);

                    const newThresholdHTML = `
                        <div class="threshold-item" data-index="${newIndex}" style="display: flex; align-items: center; margin-bottom: 8px; gap: 8px;">
                            <span style="flex: 1; min-width: 80px;">
                                <input type="number" class="size-input" value="${defaultThreshold.size / 1024 / 1024}" step="0.5" min="0.5" style="width: 60px; padding: 4px; border: 1px solid ${colors.border}; border-radius: 4px;">
                                MB
                            </span>
                            <span style="flex: 1; min-width: 80px;">
                                质量:
                                <input type="number" class="quality-input" value="${defaultThreshold.quality}" step="0.05" min="0.1" max="1" style="width: 60px; padding: 4px; border: 1px solid ${colors.border}; border-radius: 4px;">
                            </span>
                            <button class="remove-threshold" data-index="${newIndex}" style="padding: 2px 6px; background: #f44336; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">删除</button>
                        </div>
                    `;

                    const tempDiv = document.createElement('div');
                    tempDiv.innerHTML = newThresholdHTML;
                    const newElement = tempDiv.firstElementChild;
                    thresholdsContainer.insertBefore(newElement, addThresholdBtn);

                    const removeBtn = newElement.querySelector('.remove-threshold');
                    removeBtn.addEventListener('click', (ev) => {
                        const index = parseInt(ev.target.getAttribute('data-index'), 10);
                        this.settings.adaptiveQualityThresholds.splice(index, 1);
                        ev.target.closest('.threshold-item').remove();

                        document.querySelectorAll('.threshold-item').forEach((item, idx) => {
                            item.setAttribute('data-index', idx);
                            const rmBtn = item.querySelector('.remove-threshold');
                            if (rmBtn) {
                                rmBtn.setAttribute('data-index', idx);
                                rmBtn.style.display = idx === 0 ? 'none' : 'block';
                            }
                        });
                    });
                });
            }

            panel.querySelectorAll('.remove-threshold').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const index = parseInt(e.target.getAttribute('data-index'), 10);
                    this.settings.adaptiveQualityThresholds.splice(index, 1);
                    e.target.closest('.threshold-item').remove();

                    document.querySelectorAll('.threshold-item').forEach((item, idx) => {
                        item.setAttribute('data-index', idx);
                        const removeBtn = item.querySelector('.remove-threshold');
                        if (removeBtn) {
                            removeBtn.setAttribute('data-index', idx);
                            removeBtn.style.display = idx === 0 ? 'none' : 'block';
                        }
                    });
                });
            });

            const qualitySlider = panel.querySelector('#quality-slider');
            const qualityValue = panel.querySelector('#quality-value');
            qualitySlider.addEventListener('input', (e) => {
                qualityValue.textContent = e.target.value;
            });

            panel.querySelector('#save-settings').addEventListener('click', () => {
                this.settings.quality = parseFloat(qualitySlider.value);
                this.settings.mimeType = panel.querySelector('#output-format').value;
                this.settings.maxWidth = parseInt(panel.querySelector('#max-width').value, 10) || DEFAULT_SETTINGS.maxWidth;
                this.settings.maxHeight = parseInt(panel.querySelector('#max-height').value, 10) || DEFAULT_SETTINGS.maxHeight;
                this.settings.autoCompress = panel.querySelector('#auto-compress').checked;
                this.settings.adaptiveQuality = panel.querySelector('#adaptive-quality').checked;

                const thresholdItems = panel.querySelectorAll('.threshold-item');
                const newThresholds = [];
                thresholdItems.forEach(item => {
                    const sizeMB = parseFloat(item.querySelector('.size-input').value);
                    const q = parseFloat(item.querySelector('.quality-input').value);
                    if (!isNaN(sizeMB) && !isNaN(q)) {
                        newThresholds.push({ size: sizeMB * 1024 * 1024, quality: q });
                    }
                });
                newThresholds.sort((a, b) => a.size - b.size);
                if (newThresholds.length > 0) newThresholds[newThresholds.length - 1].size = Infinity;
                this.settings.adaptiveQualityThresholds = newThresholds.length > 0 ? newThresholds : DEFAULT_SETTINGS.adaptiveQualityThresholds;

                this.settings.enableHotkey = panel.querySelector('#enable-hotkey').checked;
                this.settings.hotkey = panel.querySelector('#hotkey-input').value.trim() || 'Alt+C';
                this.settings.enableDblClickReveal = panel.querySelector('#enable-dblclick-reveal').checked;
                this.settings.themeAuto = panel.querySelector('#theme-auto').checked;
                this.settings.positionOffset.x = parseInt(panel.querySelector('#offset-x').value, 10) || DEFAULT_SETTINGS.positionOffset.x;
                this.settings.positionOffset.y = parseInt(panel.querySelector('#offset-y').value, 10) || DEFAULT_SETTINGS.positionOffset.y;

                this.saveSettings();
                this.setupHotkeyListener();
                this.detectTheme();
                this.updatePanelTheme();
                this.updateThemeToggleButton();
                this.showToast('设置已保存', 'success');
                this.toggleSettingsPanel();
            });

            panel.querySelector('#reset-stats').addEventListener('click', () => {
                stats.totalCompressed = 0;
                stats.totalSizeSaved = 0;
                stats.compressionHistory = [];
                try {
                    localStorage.setItem('compressStats', JSON.stringify(stats));
                } catch (e) {
                    console.warn('重置统计保存失败:', e);
                }
                const statEl = panel.querySelector('#stats-text');
                if (statEl) statEl.textContent = '已压缩 0 张图片，节省 0.00 MB 空间';
                this.showToast('统计已重置', 'info');
            });

            const closePanel = () => {
                panel.style.display = 'none';
                overlay.style.display = 'none';
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            };

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && panel.style.display === 'block') {
                    closePanel();
                }
            });
            overlay.addEventListener('click', closePanel);
            document.addEventListener('click', (e) => {
                if (panel.style.display === 'block' &&
                    !panel.contains(e.target) &&
                    !document.getElementById('compress-settings-btn').contains(e.target)) {
                    closePanel();
                }
            });

            // 主题切换按钮绑定
            panel.querySelectorAll('.theme-toggle-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const mode = btn.getAttribute('data-theme');
                    this.setTheme(mode);
                });
            });
        },

        toggleSettingsPanel() {
            let panel = document.getElementById('compress-settings-panel');
            let overlay = document.getElementById('compress-settings-overlay');

            if (!panel) {
                this.createSettingsPanel();
                panel = document.getElementById('compress-settings-panel');
                overlay = document.getElementById('compress-settings-overlay');
            }

            if (panel.style.display === 'block') {
                panel.style.display = 'none';
                overlay.style.display = 'none';
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
            } else {
                this.detectTheme();
                this.updatePanelTheme();

                panel.style.display = 'block';
                overlay.style.display = 'block';
                const savedMB = (stats.totalSizeSaved / 1024 / 1024).toFixed(2);
                const statEl = panel.querySelector('#stats-text');
                if (statEl) {
                    statEl.textContent = `已压缩 ${stats.totalCompressed} 张图片，节省 ${savedMB} MB 空间`;
                }
                document.body.style.overflow = 'hidden';
                document.body.style.paddingRight = '15px';
            }
        },

        updatePanelTheme() {
            const panel = document.getElementById('compress-settings-panel');
            if (!panel) return;
            const colors = this.getThemeColors();
            const overlay = document.getElementById('compress-settings-overlay');

            panel.style.background = colors.panelBg;
            panel.style.color = colors.text;
            if (overlay) overlay.style.background = 'rgba(0, 0, 0, 0.5)';

            const inputs = panel.querySelectorAll('input, select');
            inputs.forEach(input => {
                input.style.background = colors.panelBg;
                input.style.color = colors.text;
                input.style.borderColor = colors.border;
            });

            panel.querySelectorAll('.theme-toggle-btn').forEach(btn => {
                const mode = btn.getAttribute('data-theme');
                btn.style.background = this.settings.themeOverride === mode ? colors.accent : colors.buttonBg;
                btn.style.color = this.settings.themeOverride === mode ? '#fff' : colors.text;
                btn.style.borderColor = colors.border;
            });
        },

        updateThemeToggleButton() {
            const panel = document.getElementById('compress-settings-panel');
            if (!panel) return;
            const colors = this.getThemeColors();
            panel.querySelectorAll('.theme-toggle-btn').forEach(btn => {
                const mode = btn.getAttribute('data-theme');
                btn.style.background = this.settings.themeOverride === mode ? colors.accent : colors.buttonBg;
                btn.style.color = this.settings.themeOverride === mode ? '#fff' : colors.text;
            });
        },

        parseHotkey(hotkeyStr) {
            const parts = hotkeyStr.toLowerCase().split('+').map(p => p.trim()).filter(Boolean);
            const modifiers = { ctrl: false, shift: false, alt: false, meta: false };
            let key = '';
            for (const part of parts) {
                if (part === 'ctrl') modifiers.ctrl = true;
                else if (part === 'shift') modifiers.shift = true;
                else if (part === 'alt') modifiers.alt = true;
                else if (['meta', 'cmd', 'command'].includes(part)) modifiers.meta = true;
                else key = part;
            }
            return { ...modifiers, key };
        },

        handleHotkeyEvent: function (e) {
            const self = ImageCompressor;
            if (!self.settings.enableHotkey || !self.settings.hotkey) return;
            const config = self.parseHotkey(self.settings.hotkey);
            if (!config.key) return;

            const keyMatch = e.key && e.key.toLowerCase() === config.key;
            const ctrlMatch = !!e.ctrlKey === config.ctrl;
            const shiftMatch = !!e.shiftKey === config.shift;
            const altMatch = !!e.altKey === config.alt;
            const metaMatch = !!e.metaKey === config.meta;

            if (keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch) {
                e.preventDefault();
                if (self.isButtonHidden) {
                    self.showSettingsButton();
                    const btn = document.getElementById('compress-settings-btn');
                    if (btn) {
                        btn.style.transform = 'scale(1.15)';
                        setTimeout(() => {
                            if (!self.isButtonHidden) btn.style.transform = 'scale(1)';
                        }, 200);
                    }
                }
            }
        },

        setupHotkeyListener() {
            document.removeEventListener('keydown', this.handleHotkeyEvent);
            if (this.settings.enableHotkey) {
                document.addEventListener('keydown', this.handleHotkeyEvent);
            }
        },

        setupGlobalRevealOnDblTap() {
            if (!('ontouchstart' in window)) return;
            let lastTap = 0;
            const self = this;
            const handleTouchStart = (e) => {
                if (!self.isButtonHidden) return;
                const target = e.target;
                const interactiveTags = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'A', 'VIDEO', 'CANVAS'];
                if (interactiveTags.includes(target.tagName) ||
                    target.closest('button, a, input, textarea, [contenteditable="true"]')) {
                    return;
                }
                const now = Date.now();
                if (now - lastTap < 350 && now - lastTap > 0) {
                    e.preventDefault();
                    e.stopPropagation();
                    self.showSettingsButton();
                    self.showToast('设置按钮已显示', 'info');
                    lastTap = 0;
                } else {
                    lastTap = now;
                }
            };
            document.addEventListener('touchstart', handleTouchStart, { passive: false });
        },

        setupDesktopRevealOnDblClick() {
            if ('ontouchstart' in window) return;
            const handleDblClick = (e) => {
                if (!this.isButtonHidden) return;
                const target = e.target;
                const interactiveTags = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT', 'A', 'VIDEO', 'CANVAS'];
                if (interactiveTags.includes(target.tagName) ||
                    target.closest('button, a, input, textarea, [contenteditable="true"]')) {
                    return;
                }
                e.preventDefault();
                e.stopPropagation();
                this.showSettingsButton();
                this.showToast('设置按钮已显示', 'info');
            };
            document.addEventListener('dblclick', handleDblClick);
        },

        showToast(message, type = 'info') {
            let container = document.getElementById('qwen-compress-toast-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'qwen-compress-toast-container';
                container.style.cssText = `
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 999999;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    pointer-events: none;
                `;
                document.body.appendChild(container);
            }

            const toast = document.createElement('div');
            const colors = this.getThemeColors();
            const bgColor = type === 'error' ? '#ff4444' : type === 'success' ? '#4caf50' : colors.accent;

            toast.textContent = message;
            toast.style.cssText = `
                background: ${bgColor};
                color: white;
                padding: 10px 16px;
                margin-bottom: 8px;
                border-radius: 6px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                max-width: 320px;
                word-break: break-word;
                font-size: 14px;
                opacity: 0;
                transform: translateX(100%);
                transition: opacity 0.3s ease, transform 0.3s ease;
                pointer-events: auto;
            `;

            container.appendChild(toast);
            requestAnimationFrame(() => {
                toast.style.opacity = '1';
                toast.style.transform = 'translateX(0)';
            });

            setTimeout(() => {
                toast.style.opacity = '0';
                toast.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (toast.parentNode) toast.parentNode.removeChild(toast);
                    if (container && !container.hasChildNodes()) {
                        container.remove();
                    }
                }, 300);
            }, 3000);
        }
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            ImageCompressor.init();
        });
    } else {
        ImageCompressor.init();
    }
})();
