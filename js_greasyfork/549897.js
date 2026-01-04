// ==UserScript==
// @name         网页工具箱 - 多功能网页增强工具
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  集合多种实用网页工具的增强插件，包括广告屏蔽、阅读模式、网页截图、链接提取等功能
// @author       shenfangda
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_info
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549897/%E7%BD%91%E9%A1%B5%E5%B7%A5%E5%85%B7%E7%AE%B1%20-%20%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%BD%91%E9%A1%B5%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/549897/%E7%BD%91%E9%A1%B5%E5%B7%A5%E5%85%B7%E7%AE%B1%20-%20%E5%A4%9A%E5%8A%9F%E8%83%BD%E7%BD%91%E9%A1%B5%E5%A2%9E%E5%BC%BA%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        // 工具列表
        tools: [
            { id: 'adblock', name: '广告屏蔽', icon: '🚫' },
            { id: 'reader', name: '阅读模式', icon: '📖' },
            { id: 'screenshot', name: '网页截图', icon: '📸' },
            { id: 'links', name: '链接提取', icon: '🔗' },
            { id: 'images', name: '图片提取', icon: '🖼️' },
            { id: 'colorpicker', name: '颜色选择器', icon: '🎨' },
            { id: 'text', name: '文本提取', icon: '📝' },
            { id: 'password', name: '密码生成', icon: '🔑' },
            { id: 'qrcode', name: '二维码生成', icon: '🔲' },
            { id: 'translate', name: '快速翻译', icon: '🌐' }
        ],
        
        // 默认设置
        defaultSettings: {
            adblockSelectors: [
                // 基础广告选择器
                '.ad', '.ads', '.advertisement', '[class*="ad-"]', '[id*="ad-"]',
                '.google-ads', '.banner-ad', '.sidebar-ad', '.popup-ad',
                
                // 常见广告网络
                '[data-ad-client]', '[data-ad-slot]', '[data-google-query-id]',
                '.adsbygoogle', '.google-auto-placed', '.google-ad-block',
                
                // 社交媒体广告
                '.fb-ad', '.facebook-ad', '.twitter-ad', '.instagram-ad',
                
                // 视频广告
                '.video-ad', '.pre-roll-ad', '.post-roll-ad', '.mid-roll-ad',
                
                // 弹窗和浮动广告
                '.modal-ad', '.overlay-ad', '.floating-ad', '.sticky-ad',
                
                // 内容推荐广告
                '.recommended-content', '.related-posts', '[class*="recommend"]',
                '.outbrain', '.taboola', '[data-widget-id]',
                
                // 其他常见广告标识
                '[data-ad]', '[data-advertisement]', '.sponsored', '.promotion',
                '.affiliate', '.partner-content', '.native-ad', '.advertorial'
            ],
            readerMode: {
                maxWidth: 800,
                lineHeight: 1.6,
                fontSize: 16,
                fontFamily: 'Arial, sans-serif'
            }
        }
    };

    // 主要功能类
    class WebToolkit {
        constructor() {
            this.settings = {...config.defaultSettings};
            this.init();
        }

        init() {
            console.log('网页工具箱已启动');
            this.createUI();
            this.bindEvents();
        }

        // 创建用户界面
        createUI() {
            GM_addStyle(`
                #web-toolkit-panel {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 300px;
                    max-height: 80vh;
                    background: #fff;
                    border: 1px solid #ccc;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    z-index: 10000;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                    overflow: hidden;
                    display: none;
                }
                
                #web-toolkit-panel-header {
                    background: #2c3e50;
                    color: white;
                    padding: 12px 15px;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                
                #web-toolkit-panel-title {
                    font-weight: bold;
                    font-size: 16px;
                }
                
                #web-toolkit-panel-close {
                    background: none;
                    border: none;
                    color: white;
                    font-size: 20px;
                    cursor: pointer;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }
                
                #web-toolkit-panel-close:hover {
                    background: rgba(255,255,255,0.2);
                }
                
                #web-toolkit-panel-content {
                    padding: 15px;
                    overflow-y: auto;
                    max-height: calc(80vh - 50px);
                }
                
                .web-toolkit-section {
                    margin-bottom: 20px;
                }
                
                .web-toolkit-section-title {
                    font-weight: bold;
                    margin-bottom: 12px;
                    color: #2c3e50;
                    border-bottom: 1px solid #eee;
                    padding-bottom: 6px;
                    display: flex;
                    align-items: center;
                }
                
                .web-toolkit-section-title i {
                    margin-right: 8px;
                    font-size: 16px;
                }
                
                .web-toolkit-tools-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                }
                
                .web-toolkit-tool-item {
                    padding: 12px;
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: all 0.2s;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    text-align: center;
                }
                
                .web-toolkit-tool-item:hover {
                    background: #e9ecef;
                    transform: translateY(-2px);
                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
                }
                
                .web-toolkit-tool-icon {
                    font-size: 24px;
                    margin-bottom: 8px;
                }
                
                .web-toolkit-tool-name {
                    font-size: 13px;
                    color: #495057;
                }
                
                .web-toolkit-btn {
                    padding: 10px 15px;
                    background: #3498db;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    width: 100%;
                    margin-top: 5px;
                    transition: background 0.2s;
                }
                
                .web-toolkit-btn:hover {
                    background: #2980b9;
                }
                
                .web-toolkit-btn.secondary {
                    background: #95a5a6;
                }
                
                .web-toolkit-btn.secondary:hover {
                    background: #7f8c8d;
                }
                
                .web-toolkit-btn.success {
                    background: #27ae60;
                }
                
                .web-toolkit-btn.success:hover {
                    background: #229954;
                }
                
                .web-toolkit-btn.danger {
                    background: #e74c3c;
                }
                
                .web-toolkit-btn.danger:hover {
                    background: #c0392b;
                }
                
                .web-toolkit-input-group {
                    margin-bottom: 15px;
                }
                
                .web-toolkit-input-group label {
                    display: block;
                    margin-bottom: 5px;
                    font-weight: 500;
                    color: #495057;
                }
                
                .web-toolkit-input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                
                .web-toolkit-textarea {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                    min-height: 100px;
                    resize: vertical;
                }
                
                .web-toolkit-result {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 4px;
                    padding: 12px;
                    margin-top: 10px;
                    max-height: 200px;
                    overflow-y: auto;
                }
                
                .web-toolkit-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #27ae60;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 10001;
                    display: none;
                }
                
                #web-toolkit-toggle-btn {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    width: 45px;
                    height: 45px;
                    background: #2c3e50;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    cursor: pointer;
                    z-index: 9999;
                    font-size: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                #web-toolkit-toggle-btn:hover {
                    background: #34495e;
                    transform: scale(1.05);
                }
                
                .web-toolkit-password-container {
                    display: flex;
                    gap: 10px;
                }
                
                .web-toolkit-password-container .web-toolkit-input {
                    flex: 1;
                }
                
                .web-toolkit-qrcode-container {
                    text-align: center;
                }
                
                .web-toolkit-qrcode-container canvas {
                    max-width: 100%;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                }
            `);

            // 创建主面板
            const panel = document.createElement('div');
            panel.id = 'web-toolkit-panel';
            
            panel.innerHTML = `
                <div id="web-toolkit-panel-header">
                    <div id="web-toolkit-panel-title">网页工具箱</div>
                    <button id="web-toolkit-panel-close">×</button>
                </div>
                <div id="web-toolkit-panel-content">
                    <div class="web-toolkit-section">
                        <div class="web-toolkit-section-title">
                            <span>🔧 常用工具</span>
                        </div>
                        <div class="web-toolkit-tools-grid" id="web-toolkit-tools-grid">
                            <!-- 工具项将通过JS动态添加 -->
                        </div>
                    </div>
                    
                    <div class="web-toolkit-section" id="web-toolkit-tool-details" style="display: none;">
                        <!-- 工具详情将通过JS动态添加 -->
                    </div>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // 创建切换按钮
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'web-toolkit-toggle-btn';
            toggleBtn.innerHTML = '🛠️';
            document.body.appendChild(toggleBtn);
            
            // 创建通知元素
            const notification = document.createElement('div');
            notification.className = 'web-toolkit-notification';
            notification.id = 'web-toolkit-notification';
            document.body.appendChild(notification);
            
            // 初始化工具网格
            this.initToolsGrid();
        }

        // 初始化工具网格
        initToolsGrid() {
            const toolsGrid = document.getElementById('web-toolkit-tools-grid');
            toolsGrid.innerHTML = '';
            
            config.tools.forEach(tool => {
                const toolItem = document.createElement('div');
                toolItem.className = 'web-toolkit-tool-item';
                toolItem.dataset.toolId = tool.id;
                
                toolItem.innerHTML = `
                    <div class="web-toolkit-tool-icon">${tool.icon}</div>
                    <div class="web-toolkit-tool-name">${tool.name}</div>
                `;
                
                toolsGrid.appendChild(toolItem);
            });
        }

        // 绑定事件
        bindEvents() {
            // 切换面板显示
            document.getElementById('web-toolkit-toggle-btn').addEventListener('click', () => {
                const panel = document.getElementById('web-toolkit-panel');
                panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
            });
            
            // 关闭面板
            document.getElementById('web-toolkit-panel-close').addEventListener('click', () => {
                document.getElementById('web-toolkit-panel').style.display = 'none';
            });
            
            // 拖拽面板
            this.makeDraggable(document.getElementById('web-toolkit-panel-header'), document.getElementById('web-toolkit-panel'));
            
            // 工具点击事件
            document.getElementById('web-toolkit-tools-grid').addEventListener('click', (e) => {
                const toolItem = e.target.closest('.web-toolkit-tool-item');
                if (toolItem) {
                    const toolId = toolItem.dataset.toolId;
                    this.openToolDetail(toolId);
                }
            });
        }

        // 使面板可拖拽
        makeDraggable(header, panel) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
            
            header.onmousedown = dragMouseDown;
            
            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();
                // 获取鼠标位置
                pos3 = e.clientX;
                pos4 = e.clientY;
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }
            
            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();
                // 计算新位置
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                // 设置元素新位置
                panel.style.top = (panel.offsetTop - pos2) + "px";
                panel.style.left = (panel.offsetLeft - pos1) + "px";
            }
            
            function closeDragElement() {
                // 停止移动
                document.onmouseup = null;
                document.onmousemove = null;
            }
        }

        // 打开工具详情
        openToolDetail(toolId) {
            const toolDetails = document.getElementById('web-toolkit-tool-details');
            toolDetails.style.display = 'block';
            
            const tool = config.tools.find(t => t.id === toolId);
            if (!tool) return;
            
            switch(toolId) {
                case 'adblock':
                    this.renderAdblockTool(toolDetails);
                    break;
                case 'reader':
                    this.renderReaderTool(toolDetails);
                    break;
                case 'screenshot':
                    this.renderScreenshotTool(toolDetails);
                    break;
                case 'links':
                    this.renderLinksTool(toolDetails);
                    break;
                case 'images':
                    this.renderImagesTool(toolDetails);
                    break;
                case 'colorpicker':
                    this.renderColorPickerTool(toolDetails);
                    break;
                case 'text':
                    this.renderTextTool(toolDetails);
                    break;
                case 'password':
                    this.renderPasswordTool(toolDetails);
                    break;
                case 'qrcode':
                    this.renderQRCodeTool(toolDetails);
                    break;
                case 'translate':
                    this.renderTranslateTool(toolDetails);
                    break;
                default:
                    toolDetails.innerHTML = `<p>工具 "${tool.name}" 尚未实现</p>`;
            }
            
            // 添加返回按钮
            const backButton = document.createElement('button');
            backButton.className = 'web-toolkit-btn secondary';
            backButton.textContent = '← 返回工具列表';
            backButton.onclick = () => {
                toolDetails.style.display = 'none';
                this.initToolsGrid();
            };
            
            toolDetails.appendChild(backButton);
        }

        // 渲染广告屏蔽工具
        renderAdblockTool(container) {
            container.innerHTML = `
                <div class="web-toolkit-section-title">
                    <span>🚫 广告屏蔽</span>
                </div>
                <p>点击下方按钮屏蔽页面中的广告元素</p>
                <button id="web-toolkit-adblock-btn" class="web-toolkit-btn">屏蔽广告</button>
                <div class="web-toolkit-result" id="web-toolkit-adblock-result" style="display: none;"></div>
            `;
            
            document.getElementById('web-toolkit-adblock-btn').addEventListener('click', () => {
                this.blockAds();
            });
        }

        // 渲染阅读模式工具
        renderReaderTool(container) {
            container.innerHTML = `
                <div class="web-toolkit-section-title">
                    <span>📖 阅读模式</span>
                </div>
                <p>点击下方按钮进入阅读模式，专注于文章内容</p>
                <button id="web-toolkit-reader-btn" class="web-toolkit-btn">进入阅读模式</button>
            `;
            
            document.getElementById('web-toolkit-reader-btn').addEventListener('click', () => {
                this.enterReaderMode();
            });
        }

        // 渲染网页截图工具
        renderScreenshotTool(container) {
            container.innerHTML = `
                <div class="web-toolkit-section-title">
                    <span>📸 网页截图</span>
                </div>
                <p>点击下方按钮截取当前网页</p>
                <button id="web-toolkit-screenshot-btn" class="web-toolkit-btn">截取网页</button>
                <div class="web-toolkit-result" id="web-toolkit-screenshot-result" style="display: none;"></div>
            `;
            
            document.getElementById('web-toolkit-screenshot-btn').addEventListener('click', () => {
                this.takeScreenshot();
            });
        }

        // 渲染链接提取工具
        renderLinksTool(container) {
            container.innerHTML = `
                <div class="web-toolkit-section-title">
                    <span>🔗 链接提取</span>
                </div>
                <p>点击下方按钮提取页面中的所有链接</p>
                <button id="web-toolkit-links-btn" class="web-toolkit-btn">提取链接</button>
                <div class="web-toolkit-result" id="web-toolkit-links-result" style="display: none;"></div>
            `;
            
            document.getElementById('web-toolkit-links-btn').addEventListener('click', () => {
                this.extractLinks();
            });
        }
        
        // 渲染图片提取工具
        renderImagesTool(container) {
            container.innerHTML = `
                <div class="web-toolkit-section-title">
                    <span>🖼️ 图片提取</span>
                </div>
                <p>点击下方按钮提取页面中的所有图片</p>
                <button id="web-toolkit-images-btn" class="web-toolkit-btn">提取图片</button>
                <div class="web-toolkit-result" id="web-toolkit-images-result" style="display: none;"></div>
            `;
            
            document.getElementById('web-toolkit-images-btn').addEventListener('click', () => {
                this.extractImages();
            });
        }
        
        // 渲染颜色选择器工具
        renderColorPickerTool(container) {
            container.innerHTML = `
                <div class="web-toolkit-section-title">
                    <span>🎨 颜色选择器</span>
                </div>
                <p>点击下方按钮打开颜色选择器</p>
                <button id="web-toolkit-color-btn" class="web-toolkit-btn">打开颜色选择器</button>
                <div class="web-toolkit-result" id="web-toolkit-color-result" style="display: none;"></div>
            `;
            
            document.getElementById('web-toolkit-color-btn').addEventListener('click', () => {
                this.initColorPicker();
            });
        }

        // 渲染文本提取工具
        renderTextTool(container) {
            container.innerHTML = `
                <div class="web-toolkit-section-title">
                    <span>📝 文本提取</span>
                </div>
                <p>点击下方按钮提取页面中的所有文本内容</p>
                <button id="web-toolkit-text-btn" class="web-toolkit-btn">提取文本</button>
                <div class="web-toolkit-result" id="web-toolkit-text-result" style="display: none;"></div>
            `;
            
            document.getElementById('web-toolkit-text-btn').addEventListener('click', () => {
                this.extractText();
            });
        }

        // 渲染密码生成工具
        renderPasswordTool(container) {
            container.innerHTML = `
                <div class="web-toolkit-section-title">
                    <span>🔑 密码生成</span>
                </div>
                <div class="web-toolkit-input-group">
                    <label>密码长度</label>
                    <input type="number" id="web-toolkit-password-length" class="web-toolkit-input" value="12" min="4" max="128">
                </div>
                <div class="web-toolkit-input-group">
                    <label>
                        <input type="checkbox" id="web-toolkit-password-uppercase" checked> 包含大写字母
                    </label>
                </div>
                <div class="web-toolkit-input-group">
                    <label>
                        <input type="checkbox" id="web-toolkit-password-numbers" checked> 包含数字
                    </label>
                </div>
                <div class="web-toolkit-input-group">
                    <label>
                        <input type="checkbox" id="web-toolkit-password-symbols" checked> 包含符号
                    </label>
                </div>
                <button id="web-toolkit-password-generate" class="web-toolkit-btn">生成密码</button>
                <div class="web-toolkit-password-container">
                    <input type="text" id="web-toolkit-password-result" class="web-toolkit-input" readonly>
                    <button id="web-toolkit-password-copy" class="web-toolkit-btn secondary">复制</button>
                </div>
            `;
            
            document.getElementById('web-toolkit-password-generate').addEventListener('click', () => {
                this.generatePassword();
            });
            
            document.getElementById('web-toolkit-password-copy').addEventListener('click', () => {
                this.copyPassword();
            });
        }

        // 渲染二维码生成工具
        renderQRCodeTool(container) {
            container.innerHTML = `
                <div class="web-toolkit-section-title">
                    <span>🔲 二维码生成</span>
                </div>
                <div class="web-toolkit-input-group">
                    <label>输入文本或链接</label>
                    <input type="text" id="web-toolkit-qrcode-text" class="web-toolkit-input" value="${window.location.href}">
                </div>
                <button id="web-toolkit-qrcode-generate" class="web-toolkit-btn">生成二维码</button>
                <div class="web-toolkit-qrcode-container">
                    <div id="web-toolkit-qrcode-result"></div>
                </div>
            `;
            
            document.getElementById('web-toolkit-qrcode-generate').addEventListener('click', () => {
                this.generateQRCode();
            });
        }

        // 渲染翻译工具
        renderTranslateTool(container) {
            container.innerHTML = `
                <div class="web-toolkit-section-title">
                    <span>🌐 快速翻译</span>
                </div>
                <div class="web-toolkit-input-group">
                    <label>输入要翻译的文本</label>
                    <textarea id="web-toolkit-translate-input" class="web-toolkit-textarea" placeholder="输入要翻译的文本..."></textarea>
                </div>
                <div class="web-toolkit-input-group">
                    <label>目标语言</label>
                    <select id="web-toolkit-translate-target" class="web-toolkit-input">
                        <option value="zh">中文</option>
                        <option value="en">英语</option>
                        <option value="ja">日语</option>
                        <option value="ko">韩语</option>
                        <option value="fr">法语</option>
                        <option value="de">德语</option>
                        <option value="es">西班牙语</option>
                    </select>
                </div>
                <button id="web-toolkit-translate-btn" class="web-toolkit-btn">翻译</button>
                <div class="web-toolkit-result" id="web-toolkit-translate-result" style="display: none;"></div>
            `;
            
            document.getElementById('web-toolkit-translate-btn').addEventListener('click', () => {
                this.translateText();
            });
        }

        // 广告屏蔽功能
        blockAds() {
            const result = document.getElementById('web-toolkit-adblock-result');
            let blockedCount = 0;
            let smartBlockedCount = 0;
            
            // 1. 使用预定义选择器屏蔽广告
            this.settings.adblockSelectors.forEach(selector => {
                try {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (element.style.display !== 'none' && this.isLikelyAd(element)) {
                            element.style.display = 'none';
                            element.setAttribute('data-ad-blocked', 'true');
                            blockedCount++;
                        }
                    });
                } catch (e) {
                    console.warn('选择器无效:', selector);
                }
            });
            
            // 2. 智能识别可能的广告元素
            smartBlockedCount = this.smartBlockAds();
            
            // 3. 屏蔽常见的广告脚本和iframe
            this.blockAdScripts();
            
            // 显示结果
            result.style.display = 'block';
            const totalBlocked = blockedCount + smartBlockedCount;
            result.innerHTML = `
                <p>🚫 广告屏蔽完成！</p>
                <p>• 规则匹配: ${blockedCount} 个</p>
                <p>• 智能识别: ${smartBlockedCount} 个</p>
                <p><strong>总计: ${totalBlocked} 个广告元素</strong></p>
            `;
            this.showNotification(`已屏蔽 ${totalBlocked} 个广告元素`);
        }
        
        // 智能识别广告元素
        smartBlockAds() {
            let count = 0;
            const elements = document.querySelectorAll('*');
            
            elements.forEach(element => {
                // 检查元素特征
                const className = element.className || '';
                const id = element.id || '';
                const text = element.textContent || '';
                
                // 智能判断条件
                const isAdLike = (
                    // 包含广告相关关键词
                    /(广告|推广|赞助|ADVERTISEMENT|SPONSORED|Promoted)/i.test(text) &&
                    text.length < 100 // 文本较短
                ) || (
                    // 特定的尺寸特征
                    (element.offsetHeight === 90 || element.offsetHeight === 250) &&
                    element.offsetWidth > 200
                ) || (
                    // 包含特定图片源
                    element.querySelector('img[src*="doubleclick"]') ||
                    element.querySelector('img[src*="googleads"]') ||
                    element.querySelector('img[src*="facebook.com/tr"]')
                ) || (
                    // 样式特征
                    getComputedStyle(element).position === 'fixed' &&
                    element.offsetHeight < 150 &&
                    /bottom|right/.test(getComputedStyle(element).cssText)
                );
                
                if (isAdLike && element.style.display !== 'none' && !element.hasAttribute('data-ad-blocked')) {
                    element.style.display = 'none';
                    element.setAttribute('data-ad-smart-blocked', 'true');
                    count++;
                }
            });
            
            return count;
        }
        
        // 判断元素是否可能是广告
        isLikelyAd(element) {
            // 排除一些误杀的元素
            const text = element.textContent || '';
            const tagName = element.tagName.toLowerCase();
            
            // 排除导航菜单
            if (tagName === 'nav' || element.closest('nav')) return false;
            
            // 排除主要内容区域
            if (element.closest('main, article, .content, .post-content')) return false;
            
            // 排除太小的元素（可能是按钮等）
            if (element.offsetHeight < 20 && element.offsetWidth < 100) return false;
            
            return true;
        }
        
        // 屏蔽广告脚本
        blockAdScripts() {
            // 移除已知的广告脚本
            const adScripts = [
                'doubleclick.net',
                'googleadservices.com',
                'googlesyndication.com',
                'facebook.com/tr',
                'google-analytics.com'
            ];
            
            document.querySelectorAll('script').forEach(script => {
                const src = script.src || '';
                if (adScripts.some(domain => src.includes(domain))) {
                    script.remove();
                }
            });
            
            // 屏蔽广告iframe
            document.querySelectorAll('iframe').forEach(iframe => {
                const src = iframe.src || '';
                if (adScripts.some(domain => src.includes(domain))) {
                    iframe.remove();
                }
            });
        }

        // 阅读模式
        enterReaderMode() {
            // 保存原始内容
            const originalContent = document.body.innerHTML;
            
            // 创建阅读模式容器
            const readerContainer = document.createElement('div');
            readerContainer.id = 'web-toolkit-reader-mode';
            readerContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: white;
                z-index: 99999;
                overflow-y: auto;
                padding: 20px;
                box-sizing: border-box;
            `;
            
            // 提取文章内容（简化版）
            const articleContent = this.extractArticleContent();
            
            readerContainer.innerHTML = `
                <div style="max-width: ${this.settings.readerMode.maxWidth}px; margin: 0 auto; font-family: ${this.settings.readerMode.fontFamily};">
                    <h1 style="font-size: 2em; margin-bottom: 20px;">${document.title}</h1>
                    <div style="line-height: ${this.settings.readerMode.lineHeight}; font-size: ${this.settings.readerMode.fontSize}px;">
                        ${articleContent}
                    </div>
                    <div style="margin-top: 30px; text-align: center;">
                        <button id="web-toolkit-reader-exit" class="web-toolkit-btn secondary">退出阅读模式</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(readerContainer);
            
            // 绑定退出事件
            document.getElementById('web-toolkit-reader-exit').addEventListener('click', () => {
                document.body.removeChild(readerContainer);
            });
            
            this.showNotification('已进入阅读模式');
        }

        // 提取文章内容（增强版）
        extractArticleContent() {
            // 1. 尝试找到文章内容
            const contentSelectors = [
                'article',
                '.content',
                '.post-content',
                '.article-content',
                '.entry-content',
                'main',
                '#content',
                '.entry',
                '.post',
                '.story',
                '.news-content',
                '.article-body',
                '.main-content',
                '.text-content'
            ];
            
            let contentElement = null;
            let bestScore = 0;
            
            // 2. 智能选择最佳内容容器
            for (const selector of contentSelectors) {
                const elements = document.querySelectorAll(selector);
                for (const element of elements) {
                    const score = this.calculateContentScore(element);
                    if (score > bestScore) {
                        bestScore = score;
                        contentElement = element;
                    }
                }
            }
            
            // 3. 如果没有找到合适的容器，使用智能算法
            if (!contentElement) {
                contentElement = this.findMainContent();
            }
            
            // 4. 清理和优化内容
            if (contentElement) {
                return this.cleanAndOptimizeContent(contentElement);
            }
            
            // 5. 最后备用方案
            return this.getFallbackContent();
        }
        
        // 计算内容评分
        calculateContentScore(element) {
            let score = 0;
            const text = element.textContent || '';
            const textLength = text.trim().length;
            
            // 文本长度评分
            if (textLength > 500) score += 10;
            if (textLength > 1000) score += 20;
            if (textLength > 2000) score += 30;
            
            // 段落数量评分
            const paragraphs = element.querySelectorAll('p');
            score += paragraphs.length * 5;
            
            // 图片数量评分（适中的图片数量）
            const images = element.querySelectorAll('img');
            if (images.length > 0 && images.length <= 10) {
                score += images.length * 2;
            }
            
            // 标题评分
            const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');
            score += headings.length * 3;
            
            // 链接密度评分（链接不能太多）
            const links = element.querySelectorAll('a');
            const linkDensity = links.length / Math.max(textLength / 100, 1);
            if (linkDensity < 0.5) { // 每100字符少于0.5个链接
                score += 10;
            }
            
            // 标签名称评分
            const tagName = element.tagName.toLowerCase();
            if (tagName === 'article') score += 15;
            if (tagName === 'main') score += 10;
            
            return score;
        }
        
        // 智能查找主要内容
        findMainContent() {
            // 使用Readability算法的简化版本
            const candidates = [];
            const allElements = document.querySelectorAll('div, section, article, main');
            
            allElements.forEach(element => {
                // 跳过明显的非内容元素
                if (this.isUnlikelyContent(element)) return;
                
                const textContent = element.textContent || '';
                const textLength = textContent.trim().length;
                
                // 只考虑有足够文本的元素
                if (textLength < 100) return;
                
                const score = this.calculateAdvancedContentScore(element);
                candidates.push({ element, score, textLength });
            });
            
            // 按评分排序
            candidates.sort((a, b) => b.score - a.score);
            
            // 返回最佳候选
            return candidates.length > 0 ? candidates[0].element : document.body;
        }
        
        // 计算高级内容评分
        calculateAdvancedContentScore(element) {
            let score = 0;
            const textContent = element.textContent || '';
            const textLength = textContent.trim().length;
            
            // 基础文本长度评分
            score += Math.min(textLength / 100, 50); // 最多50分
            
            // 段落密度评分
            const paragraphs = element.querySelectorAll('p');
            const paragraphDensity = paragraphs.length / Math.max(element.children.length, 1);
            score += paragraphDensity * 20;
            
            // 句子长度评分（平均句子长度）
            const sentences = textContent.split(/[.!?]+/).filter(s => s.trim().length > 0);
            const avgSentenceLength = sentences.reduce((sum, s) => sum + s.trim().length, 0) / Math.max(sentences.length, 1);
            if (avgSentenceLength > 20 && avgSentenceLength < 200) {
                score += 10;
            }
            
            // 逗号密度评分（合理的逗号使用）
            const commaCount = (textContent.match(/,/g) || []).length;
            const commaDensity = commaCount / Math.max(textLength, 1);
            if (commaDensity > 0.01 && commaDensity < 0.1) {
                score += 5;
            }
            
            // 类名和ID评分
            const className = element.className || '';
            const id = element.id || '';
            const classAndId = className + ' ' + id;
            
            // 正面关键词
            if (/(content|article|post|entry|story|news|text)/i.test(classAndId)) {
                score += 20;
            }
            
            // 负面关键词
            if (/(comment|footer|sidebar|menu|navigation|advertisement|ad|social)/i.test(classAndId)) {
                score -= 30;
            }
            
            return score;
        }
        
        // 判断是否为非内容元素
        isUnlikelyContent(element) {
            const className = element.className || '';
            const id = element.id || '';
            const classAndId = className + ' ' + id;
            
            const unlikelyPatterns = [
                'comment', 'footer', 'header', 'sidebar', 'menu', 'navigation',
                'advertisement', 'ad', 'social', 'share', 'widget',
                'related', 'recommended', 'sidebar', 'menu', 'nav'
            ];
            
            return unlikelyPatterns.some(pattern => 
                new RegExp(pattern, 'i').test(classAndId)
            );
        }
        
        // 清理和优化内容
        cleanAndOptimizeContent(element) {
            // 克隆元素以避免修改原始DOM
            const clonedElement = element.cloneNode(true);
            
            // 移除不需要的元素
            const unwantedSelectors = [
                'script', 'style', 'noscript', 'iframe', 'object', 'embed',
                '.advertisement', '.ad', '.social-share', '.comments',
                '.sidebar', '.navigation', '.menu', '.footer', '.header',
                '[class*="ad-"]', '[id*="ad-"]', '[class*="advertisement"]'
            ];
            
            unwantedSelectors.forEach(selector => {
                const elements = clonedElement.querySelectorAll(selector);
                elements.forEach(el => el.remove());
            });
            
            // 移除属性
            const elementsWithAttributes = clonedElement.querySelectorAll('*');
            elementsWithAttributes.forEach(el => {
                // 保留必要的属性
                const attributesToKeep = ['src', 'alt', 'href', 'title'];
                Array.from(el.attributes).forEach(attr => {
                    if (!attributesToKeep.includes(attr.name)) {
                        el.removeAttribute(attr.name);
                    }
                });
            });
            
            return clonedElement.innerHTML;
        }
        
        // 获取备用内容
        getFallbackContent() {
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = document.body.innerHTML;
            
            // 移除script和style标签
            const scripts = tempDiv.querySelectorAll('script');
            scripts.forEach(script => script.remove());
            
            const styles = tempDiv.querySelectorAll('style');
            styles.forEach(style => style.remove());
            
            // 移除明显的非内容元素
            const unwantedElements = tempDiv.querySelectorAll(
                'nav, header, footer, aside, .sidebar, .menu, .navigation, .advertisement, .ad'
            );
            unwantedElements.forEach(el => el.remove());
            
            return tempDiv.innerHTML;
        }

        // 网页截图
        takeScreenshot() {
            this.showNotification('正在准备截图功能...');
            
            const result = document.getElementById('web-toolkit-screenshot-result');
            result.style.display = 'block';
            
            // 动态加载html2canvas库
            this.loadScript('https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js')
                .then(() => {
                    this.performScreenshot();
                })
                .catch(() => {
                    result.innerHTML = `
                        <p>❌ 截图库加载失败</p>
                        <p>请检查网络连接，或使用浏览器自带截图功能：</p>
                        <ul>
                            <li>Windows: Win + Shift + S</li>
                            <li>Mac: Cmd + Shift + 4</li>
                        </ul>
                        <button id="web-toolkit-screenshot-retry" class="web-toolkit-btn">重试</button>
                    `;
                    
                    document.getElementById('web-toolkit-screenshot-retry').addEventListener('click', () => {
                        this.takeScreenshot();
                    });
                });
        }
        
        // 执行截图
        performScreenshot() {
            const result = document.getElementById('web-toolkit-screenshot-result');
            
            this.showNotification('正在截取网页，请稍候...');
            
            // 隐藏工具箱面板
            const panel = document.getElementById('web-toolkit-panel');
            const toggleBtn = document.getElementById('web-toolkit-toggle-btn');
            const originalPanelDisplay = panel.style.display;
            const originalBtnDisplay = toggleBtn.style.display;
            
            panel.style.display = 'none';
            toggleBtn.style.display = 'none';
            
            // 等待一小段时间确保面板隐藏
            setTimeout(() => {
                html2canvas(document.body, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 1,
                    width: window.innerWidth,
                    height: window.innerHeight,
                    scrollX: 0,
                    scrollY: 0
                }).then(canvas => {
                    // 恢复面板显示
                    panel.style.display = originalPanelDisplay;
                    toggleBtn.style.display = originalBtnDisplay;
                    
                    // 显示截图结果
                    const imgData = canvas.toDataURL('image/png');
                    
                    result.innerHTML = `
                        <div style="text-align: center;">
                            <p>✅ 网页截图完成！</p>
                            <img src="${imgData}" style="max-width: 100%; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0;">
                            <div style="display: flex; gap: 10px; margin-top: 15px;">
                                <button id="web-toolkit-screenshot-download" class="web-toolkit-btn success">下载图片</button>
                                <button id="web-toolkit-screenshot-copy" class="web-toolkit-btn">复制到剪贴板</button>
                                <button id="web-toolkit-screenshot-fullpage" class="web-toolkit-btn secondary">截取完整页面</button>
                            </div>
                        </div>
                    `;
                    
                    // 绑定按钮事件
                    document.getElementById('web-toolkit-screenshot-download').addEventListener('click', () => {
                        this.downloadScreenshot(imgData);
                    });
                    
                    document.getElementById('web-toolkit-screenshot-copy').addEventListener('click', () => {
                        this.copyScreenshot(imgData);
                    });
                    
                    document.getElementById('web-toolkit-screenshot-fullpage').addEventListener('click', () => {
                        this.takeFullPageScreenshot();
                    });
                    
                    this.showNotification('截图完成！');
                    
                }).catch(error => {
                    // 恢复面板显示
                    panel.style.display = originalPanelDisplay;
                    toggleBtn.style.display = originalBtnDisplay;
                    
                    result.innerHTML = `
                        <p>❌ 截图失败: ${error.message}</p>
                        <p>可能的原因：</p>
                        <ul>
                            <li>页面内容跨域限制</li>
                            <li>浏览器安全策略</li>
                            <li>页面结构复杂</li>
                        </ul>
                        <button id="web-toolkit-screenshot-retry" class="web-toolkit-btn">重试</button>
                    `;
                    
                    document.getElementById('web-toolkit-screenshot-retry').addEventListener('click', () => {
                        this.takeScreenshot();
                    });
                    
                    this.showNotification('截图失败，请重试');
                });
            }, 500);
        }
        
        // 截取完整页面
        takeFullPageScreenshot() {
            const result = document.getElementById('web-toolkit-screenshot-result');
            
            this.showNotification('正在截取完整页面...');
            
            // 获取页面完整尺寸
            const fullHeight = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            );
            
            const fullWidth = Math.max(
                document.body.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.clientWidth,
                document.documentElement.scrollWidth,
                document.documentElement.offsetWidth
            );
            
            // 隐藏工具箱面板
            const panel = document.getElementById('web-toolkit-panel');
            const toggleBtn = document.getElementById('web-toolkit-toggle-btn');
            const originalPanelDisplay = panel.style.display;
            const originalBtnDisplay = toggleBtn.style.display;
            
            panel.style.display = 'none';
            toggleBtn.style.display = 'none';
            
            setTimeout(() => {
                html2canvas(document.body, {
                    useCORS: true,
                    allowTaint: true,
                    scale: 0.5, // 降低分辨率以避免内存问题
                    width: fullWidth,
                    height: fullHeight,
                    scrollX: 0,
                    scrollY: 0
                }).then(canvas => {
                    // 恢复面板显示
                    panel.style.display = originalPanelDisplay;
                    toggleBtn.style.display = originalBtnDisplay;
                    
                    const imgData = canvas.toDataURL('image/png');
                    
                    result.innerHTML = `
                        <div style="text-align: center;">
                            <p>✅ 完整页面截图完成！</p>
                            <img src="${imgData}" style="max-width: 100%; border: 1px solid #ddd; border-radius: 4px; margin: 10px 0;">
                            <div style="display: flex; gap: 10px; margin-top: 15px;">
                                <button id="web-toolkit-screenshot-download" class="web-toolkit-btn success">下载完整页面</button>
                                <button id="web-toolkit-screenshot-copy" class="web-toolkit-btn">复制到剪贴板</button>
                            </div>
                        </div>
                    `;
                    
                    document.getElementById('web-toolkit-screenshot-download').addEventListener('click', () => {
                        this.downloadScreenshot(imgData, 'fullpage-screenshot.png');
                    });
                    
                    document.getElementById('web-toolkit-screenshot-copy').addEventListener('click', () => {
                        this.copyScreenshot(imgData);
                    });
                    
                    this.showNotification('完整页面截图完成！');
                    
                }).catch(error => {
                    // 恢复面板显示
                    panel.style.display = originalPanelDisplay;
                    toggleBtn.style.display = originalBtnDisplay;
                    
                    this.showNotification('完整页面截图失败，尝试当前视口截图');
                    this.takeScreenshot(); // 回退到普通截图
                });
            }, 500);
        }
        
        // 下载截图
        downloadScreenshot(dataUrl, filename = 'screenshot.png') {
            const link = document.createElement('a');
            link.download = filename;
            link.href = dataUrl;
            link.click();
            this.showNotification('截图已下载！');
        }
        
        // 复制截图到剪贴板
        copyScreenshot(dataUrl) {
            // 创建临时图片元素
            const img = new Image();
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                canvas.toBlob(blob => {
                    if (blob) {
                        navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]).then(() => {
                            this.showNotification('截图已复制到剪贴板！');
                        }).catch(() => {
                            this.showNotification('复制失败，请手动下载');
                        });
                    }
                });
            };
            img.src = dataUrl;
        }
        
        // 动态加载脚本
        loadScript(url) {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = url;
                script.onload = resolve;
                script.onerror = reject;
                document.head.appendChild(script);
            });
        }

        // 提取链接
        extractLinks() {
            const links = Array.from(document.querySelectorAll('a[href]'))
                .map(a => ({
                    text: a.textContent.trim(),
                    url: a.href
                }))
                .filter(link => link.text && link.url);
            
            const result = document.getElementById('web-toolkit-links-result');
            result.style.display = 'block';
            
            if (links.length === 0) {
                result.innerHTML = '<p>未找到链接</p>';
                return;
            }
            
            let html = `<p>找到 ${links.length} 个链接：</p><ul>`;
            links.forEach(link => {
                html += `<li><a href="${link.url}" target="_blank">${link.text}</a></li>`;
            });
            html += '</ul>';
            
            result.innerHTML = html;
            this.showNotification(`提取到 ${links.length} 个链接`);
        }
        
        // 提取图片
        extractImages() {
            const images = Array.from(document.querySelectorAll('img[src]'))
                .map(img => ({
                    src: img.src,
                    alt: img.alt || '无描述',
                    width: img.naturalWidth || img.width,
                    height: img.naturalHeight || img.height
                }))
                .filter(img => img.src && !img.src.includes('data:')); // 排除base64图片
            
            const result = document.getElementById('web-toolkit-images-result');
            result.style.display = 'block';
            
            if (images.length === 0) {
                result.innerHTML = '<p>未找到图片</p>';
                return;
            }
            
            let html = `<p>找到 ${images.length} 张图片：</p><div class="web-toolkit-images-grid">`;
            images.forEach((img, index) => {
                html += `
                    <div class="web-toolkit-image-item">
                        <img src="${img.src}" alt="${img.alt}" loading="lazy">
                        <div class="web-toolkit-image-info">
                            <p><strong>描述:</strong> ${img.alt}</p>
                            <p><strong>尺寸:</strong> ${img.width} x ${img.height}</p>
                            <p><strong>URL:</strong> <a href="${img.src}" target="_blank">查看原图</a></p>
                            <button class="web-toolkit-btn secondary" onclick="window.open('${img.src}', '_blank')">下载</button>
                        </div>
                    </div>
                `;
            });
            html += '</div>';
            
            result.innerHTML = html;
            this.showNotification(`提取到 ${images.length} 张图片`);
        }
        
        // 颜色选择器
        initColorPicker() {
            const result = document.getElementById('web-toolkit-color-result');
            result.style.display = 'block';
            
            result.innerHTML = `
                <div class="web-toolkit-color-picker">
                    <div class="web-toolkit-color-canvas-container">
                        <canvas id="web-toolkit-color-canvas" width="300" height="200"></canvas>
                        <div id="web-toolkit-color-cursor" class="color-cursor"></div>
                    </div>
                    <div class="web-toolkit-color-controls">
                        <div class="web-toolkit-color-slider">
                            <label>色相:</label>
                            <input type="range" id="web-toolkit-hue-slider" min="0" max="360" value="0">
                        </div>
                        <div class="web-toolkit-color-inputs">
                            <div>
                                <label>HEX:</label>
                                <input type="text" id="web-toolkit-hex-input" value="#FF0000">
                            </div>
                            <div>
                                <label>RGB:</label>
                                <input type="text" id="web-toolkit-rgb-input" value="rgb(255, 0, 0)">
                            </div>
                            <div>
                                <label>HSL:</label>
                                <input type="text" id="web-toolkit-hsl-input" value="hsl(0, 100%, 50%)">
                            </div>
                        </div>
                        <div class="web-toolkit-color-preview">
                            <div id="web-toolkit-color-preview" style="width: 100px; height: 50px; background: #FF0000; border: 1px solid #ccc;"></div>
                        </div>
                        <div class="web-toolkit-color-actions">
                            <button id="web-toolkit-copy-hex" class="web-toolkit-btn">复制HEX</button>
                            <button id="web-toolkit-copy-rgb" class="web-toolkit-btn">复制RGB</button>
                            <button id="web-toolkit-copy-hsl" class="web-toolkit-btn">复制HSL</button>
                            <button id="web-toolkit-pick-from-screen" class="web-toolkit-btn secondary">从屏幕取色</button>
                        </div>
                    </div>
                </div>
            `;
            
            this.initColorPickerCanvas();
            this.bindColorPickerEvents();
            this.showNotification('颜色选择器已初始化');
        }
        
        // 初始化颜色选择器画布
        initColorPickerCanvas() {
            const canvas = document.getElementById('web-toolkit-color-canvas');
            const ctx = canvas.getContext('2d');
            
            // 创建渐变色
            this.updateColorCanvas(0); // 初始色相为0
        }
        
        // 更新颜色画布
        updateColorCanvas(hue) {
            const canvas = document.getElementById('web-toolkit-color-canvas');
            const ctx = canvas.getContext('2d');
            const width = canvas.width;
            const height = canvas.height;
            
            // 清空画布
            ctx.clearRect(0, 0, width, height);
            
            // 创建饱和度渐变
            const satGradient = ctx.createLinearGradient(0, 0, width, 0);
            satGradient.addColorStop(0, '#ffffff');
            satGradient.addColorStop(1, `hsl(${hue}, 100%, 50%)`);
            
            // 创建亮度渐变
            const lightGradient = ctx.createLinearGradient(0, 0, 0, height);
            lightGradient.addColorStop(0, 'rgba(255, 255, 255, 0)');
            lightGradient.addColorStop(1, '#000000');
            
            // 应用渐变
            ctx.fillStyle = satGradient;
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = lightGradient;
            ctx.fillRect(0, 0, width, height);
        }
        
        // 绑定颜色选择器事件
        bindColorPickerEvents() {
            const canvas = document.getElementById('web-toolkit-color-canvas');
            const hueSlider = document.getElementById('web-toolkit-hue-slider');
            const hexInput = document.getElementById('web-toolkit-hex-input');
            const rgbInput = document.getElementById('web-toolkit-rgb-input');
            const hslInput = document.getElementById('web-toolkit-hsl-input');
            
            let isPicking = false;
            
            // 画布点击事件
            canvas.addEventListener('mousedown', (e) => {
                isPicking = true;
                this.pickColorFromCanvas(e);
            });
            
            canvas.addEventListener('mousemove', (e) => {
                if (isPicking) {
                    this.pickColorFromCanvas(e);
                }
            });
            
            canvas.addEventListener('mouseup', () => {
                isPicking = false;
            });
            
            // 色相滑块事件
            hueSlider.addEventListener('input', (e) => {
                this.updateColorCanvas(e.target.value);
            });
            
            // 输入框事件
            hexInput.addEventListener('input', (e) => {
                this.updateColorFromHex(e.target.value);
            });
            
            // 复制按钮事件
            document.getElementById('web-toolkit-copy-hex').addEventListener('click', () => {
                GM_setClipboard(hexInput.value);
                this.showNotification('HEX值已复制');
            });
            
            document.getElementById('web-toolkit-copy-rgb').addEventListener('click', () => {
                GM_setClipboard(rgbInput.value);
                this.showNotification('RGB值已复制');
            });
            
            document.getElementById('web-toolkit-copy-hsl').addEventListener('click', () => {
                GM_setClipboard(hslInput.value);
                this.showNotification('HSL值已复制');
            });
            
            // 屏幕取色按钮
            document.getElementById('web-toolkit-pick-from-screen').addEventListener('click', () => {
                this.startScreenColorPicker();
            });
        }
        
        // 从画布选择颜色
        pickColorFromCanvas(e) {
            const canvas = document.getElementById('web-toolkit-color-canvas');
            const rect = canvas.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(x, y, 1, 1);
            const [r, g, b] = imageData.data;
            
            this.updateColorDisplay(r, g, b);
        }
        
        // 更新颜色显示
        updateColorDisplay(r, g, b) {
            const hex = this.rgbToHex(r, g, b);
            const rgb = `rgb(${r}, ${g}, ${b})`;
            const hsl = this.rgbToHsl(r, g, b);
            
            document.getElementById('web-toolkit-hex-input').value = hex;
            document.getElementById('web-toolkit-rgb-input').value = rgb;
            document.getElementById('web-toolkit-hsl-input').value = hsl;
            document.getElementById('web-toolkit-color-preview').style.background = hex;
        }
        
        // 从HEX更新颜色
        updateColorFromHex(hex) {
            const rgb = this.hexToRgb(hex);
            if (rgb) {
                this.updateColorDisplay(rgb.r, rgb.g, rgb.b);
            }
        }
        
        // RGB转HEX
        rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(x => {
                const hex = x.toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }
        
        // HEX转RGB
        hexToRgb(hex) {
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return result ? {
                r: parseInt(result[1], 16),
                g: parseInt(result[2], 16),
                b: parseInt(result[3], 16)
            } : null;
        }
        
        // RGB转HSL
        rgbToHsl(r, g, b) {
            r /= 255;
            g /= 255;
            b /= 255;
            
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;
            
            if (max === min) {
                h = s = 0;
            } else {
                const d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }
            
            return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
        }
        
        // 开始屏幕取色
        startScreenColorPicker() {
            this.showNotification('屏幕取色功能开发中...');
            // 这里可以实现更复杂的屏幕取色功能
            // 由于浏览器安全限制，可能需要额外的权限或扩展
        }

        // 提取文本
        extractText() {
            const text = document.body.innerText || document.body.textContent;
            const result = document.getElementById('web-toolkit-text-result');
            result.style.display = 'block';
            
            if (!text) {
                result.innerHTML = '<p>未找到文本内容</p>';
                return;
            }
            
            // 截取前1000个字符作为预览
            const preview = text.substring(0, 1000);
            const fullText = text;
            
            result.innerHTML = `
                <p>文本长度: ${fullText.length} 字符</p>
                <textarea class="web-toolkit-textarea" readonly>${preview}${fullText.length > 1000 ? '...' : ''}</textarea>
                <button id="web-toolkit-text-copy" class="web-toolkit-btn secondary">复制全部文本</button>
            `;
            
            document.getElementById('web-toolkit-text-copy').addEventListener('click', () => {
                GM_setClipboard(fullText);
                this.showNotification('文本已复制到剪贴板');
            });
            
            this.showNotification(`提取到 ${fullText.length} 字符的文本`);
        }

        // 生成密码
        generatePassword() {
            const length = parseInt(document.getElementById('web-toolkit-password-length').value) || 12;
            const includeUppercase = document.getElementById('web-toolkit-password-uppercase').checked;
            const includeNumbers = document.getElementById('web-toolkit-password-numbers').checked;
            const includeSymbols = document.getElementById('web-toolkit-password-symbols').checked;
            
            let charset = 'abcdefghijklmnopqrstuvwxyz';
            if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            if (includeNumbers) charset += '0123456789';
            if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
            
            let password = '';
            for (let i = 0; i < length; i++) {
                const randomIndex = Math.floor(Math.random() * charset.length);
                password += charset[randomIndex];
            }
            
            document.getElementById('web-toolkit-password-result').value = password;
            this.showNotification('密码已生成');
        }

        // 复制密码
        copyPassword() {
            const password = document.getElementById('web-toolkit-password-result').value;
            if (password) {
                GM_setClipboard(password);
                this.showNotification('密码已复制到剪贴板');
            }
        }

        // 生成二维码
        generateQRCode() {
            const text = document.getElementById('web-toolkit-qrcode-text').value;
            if (!text) {
                this.showNotification('请输入文本内容');
                return;
            }
            
            const result = document.getElementById('web-toolkit-qrcode-result');
            result.style.display = 'block';
            
            // 动态加载qrcode.js库
            this.loadScript('https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js')
                .then(() => {
                    this.performQRGeneration(text);
                })
                .catch(() => {
                    result.innerHTML = `
                        <p>❌ 二维码库加载失败</p>
                        <p>请检查网络连接后重试</p>
                        <button id="web-toolkit-qr-retry" class="web-toolkit-btn">重试</button>
                    `;
                    
                    document.getElementById('web-toolkit-qr-retry').addEventListener('click', () => {
                        this.generateQRCode();
                    });
                });
        }
        
        // 执行二维码生成
        performQRGeneration(text) {
            const result = document.getElementById('web-toolkit-qrcode-result');
            
            this.showNotification('正在生成二维码...');
            
            // 清空之前的结果
            result.innerHTML = `
                <div style="text-align: center;">
                    <p>正在生成二维码...</p>
                    <div id="web-toolkit-qr-code" style="margin: 20px auto;"></div>
                    <div id="web-toolkit-qr-actions" style="display: none; margin-top: 15px;">
                        <button id="web-toolkit-qr-download" class="web-toolkit-btn success">下载二维码</button>
                        <button id="web-toolkit-qr-copy" class="web-toolkit-btn">复制二维码</button>
                        <button id="web-toolkit-qr-regenerate" class="web-toolkit-btn secondary">重新生成</button>
                    </div>
                </div>
            `;
            
            try {
                // 生成二维码
                const qrcode = new QRCode(document.getElementById('web-toolkit-qr-code'), {
                    text: text,
                    width: 256,
                    height: 256,
                    colorDark : '#000000',
                    colorLight : '#ffffff',
                    correctLevel : QRCode.CorrectLevel.H
                });
                
                // 等待二维码生成完成
                setTimeout(() => {
                    const canvas = document.querySelector('#web-toolkit-qr-code canvas');
                    const img = document.querySelector('#web-toolkit-qr-code img');
                    
                    if (canvas || img) {
                        // 显示操作按钮
                        document.getElementById('web-toolkit-qr-actions').style.display = 'flex';
                        document.getElementById('web-toolkit-qr-actions').style.gap = '10px';
                        
                        // 绑定按钮事件
                        document.getElementById('web-toolkit-qr-download').addEventListener('click', () => {
                            this.downloadQRCode(text);
                        });
                        
                        document.getElementById('web-toolkit-qr-copy').addEventListener('click', () => {
                            this.copyQRCode();
                        });
                        
                        document.getElementById('web-toolkit-qr-regenerate').addEventListener('click', () => {
                            this.generateQRCode();
                        });
                        
                        this.showNotification('二维码生成成功！');
                    } else {
                        result.innerHTML = `
                            <p>❌ 二维码生成失败</p>
                            <p>请重试或检查输入内容</p>
                            <button id="web-toolkit-qr-retry" class="web-toolkit-btn">重试</button>
                        `;
                        
                        document.getElementById('web-toolkit-qr-retry').addEventListener('click', () => {
                            this.generateQRCode();
                        });
                    }
                }, 1000);
                
            } catch (error) {
                result.innerHTML = `
                    <p>❌ 二维码生成错误: ${error.message}</p>
                    <p>请检查输入内容或重试</p>
                    <button id="web-toolkit-qr-retry" class="web-toolkit-btn">重试</button>
                `;
                
                document.getElementById('web-toolkit-qr-retry').addEventListener('click', () => {
                    this.generateQRCode();
                });
                
                this.showNotification('二维码生成失败');
            }
        }
        
        // 下载二维码
        downloadQRCode(text) {
            const canvas = document.querySelector('#web-toolkit-qr-code canvas');
            const img = document.querySelector('#web-toolkit-qr-code img');
            
            let dataUrl;
            if (canvas) {
                dataUrl = canvas.toDataURL('image/png');
            } else if (img) {
                dataUrl = img.src;
            } else {
                this.showNotification('无法获取二维码图片');
                return;
            }
            
            const link = document.createElement('a');
            link.download = `qrcode-${Date.now()}.png`;
            link.href = dataUrl;
            link.click();
            this.showNotification('二维码已下载！');
        }
        
        // 复制二维码到剪贴板
        copyQRCode() {
            const canvas = document.querySelector('#web-toolkit-qr-code canvas');
            const img = document.querySelector('#web-toolkit-qr-code img');
            
            if (canvas) {
                canvas.toBlob(blob => {
                    if (blob) {
                        navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]).then(() => {
                            this.showNotification('二维码已复制到剪贴板！');
                        }).catch(() => {
                            this.showNotification('复制失败，请手动下载');
                        });
                    }
                });
            } else if (img) {
                // 复制图片元素
                const imgElement = new Image();
                imgElement.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = imgElement.width;
                    canvas.height = imgElement.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(imgElement, 0, 0);
                    
                    canvas.toBlob(blob => {
                        if (blob) {
                            navigator.clipboard.write([
                                new ClipboardItem({ 'image/png': blob })
                            ]).then(() => {
                                this.showNotification('二维码已复制到剪贴板！');
                            }).catch(() => {
                                this.showNotification('复制失败，请手动下载');
                            });
                        }
                    });
                };
                imgElement.src = img.src;
            } else {
                this.showNotification('无法找到二维码图片');
            }
        }

        // 翻译文本
        translateText() {
            const text = document.getElementById('web-toolkit-translate-input').value;
            const targetLang = document.getElementById('web-toolkit-translate-target').value;
            
            if (!text) {
                this.showNotification('请输入要翻译的文本');
                return;
            }
            
            const result = document.getElementById('web-toolkit-translate-result');
            result.style.display = 'block';
            
            // 显示加载状态
            result.innerHTML = `
                <div style="text-align: center;">
                    <p>正在翻译中...</p>
                    <div class="web-toolkit-loading" style="margin: 20px auto;"></div>
                </div>
            `;
            
            // 使用Google翻译API进行翻译
            this.performTranslation(text, targetLang)
                .then(translation => {
                    result.innerHTML = `
                        <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; background: #f9f9f9;">
                            <p><strong>原文：</strong></p>
                            <p style="margin-bottom: 15px; font-style: italic;">${text}</p>
                            <p><strong>翻译结果 (${targetLang}):</strong></p>
                            <p style="font-size: 1.1em; color: #333;">${translation}</p>
                            <div style="margin-top: 15px; display: flex; gap: 10px;">
                                <button id="web-toolkit-copy-translation" class="web-toolkit-btn success">复制翻译</button>
                                <button id="web-toolkit-translate-again" class="web-toolkit-btn secondary">重新翻译</button>
                            </div>
                        </div>
                    `;
                    
                    // 绑定按钮事件
                    document.getElementById('web-toolkit-copy-translation').addEventListener('click', () => {
                        navigator.clipboard.writeText(translation).then(() => {
                            this.showNotification('翻译结果已复制到剪贴板！');
                        }).catch(() => {
                            this.showNotification('复制失败，请手动复制');
                        });
                    });
                    
                    document.getElementById('web-toolkit-translate-again').addEventListener('click', () => {
                        this.translateText();
                    });
                    
                    this.showNotification('翻译完成！');
                })
                .catch(error => {
                    console.error('翻译错误:', error);
                    
                    // 如果API失败，使用备用翻译服务
                    this.performBackupTranslation(text, targetLang)
                        .then(translation => {
                            result.innerHTML = `
                                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; background: #f9f9f9;">
                                    <p><strong>原文：</strong></p>
                                    <p style="margin-bottom: 15px; font-style: italic;">${text}</p>
                                    <p><strong>翻译结果 (${targetLang}):</strong></p>
                                    <p style="font-size: 1.1em; color: #333;">${translation}</p>
                                    <p style="font-size: 0.9em; color: #666; margin-top: 10px;">使用备用翻译服务</p>
                                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                                        <button id="web-toolkit-copy-translation" class="web-toolkit-btn success">复制翻译</button>
                                        <button id="web-toolkit-translate-again" class="web-toolkit-btn secondary">重新翻译</button>
                                    </div>
                                </div>
                            `;
                            
                            // 绑定按钮事件
                            document.getElementById('web-toolkit-copy-translation').addEventListener('click', () => {
                                navigator.clipboard.writeText(translation).then(() => {
                                    this.showNotification('翻译结果已复制到剪贴板！');
                                }).catch(() => {
                                    this.showNotification('复制失败，请手动复制');
                                });
                            });
                            
                            document.getElementById('web-toolkit-translate-again').addEventListener('click', () => {
                                this.translateText();
                            });
                            
                            this.showNotification('翻译完成！');
                        })
                        .catch(backupError => {
                            console.error('备用翻译也失败:', backupError);
                            
                            // 如果所有翻译都失败，显示错误信息
                            result.innerHTML = `
                                <div style="color: #d32f2f; padding: 15px; border: 1px solid #ffcdd2; border-radius: 5px; background: #ffebee;">
                                    <p><strong>翻译失败</strong></p>
                                    <p>无法连接到翻译服务，请检查网络连接后重试。</p>
                                    <p style="font-size: 0.9em; margin-top: 10px;">错误信息: ${error.message}</p>
                                    <div style="margin-top: 15px;">
                                        <button id="web-toolkit-translate-retry" class="web-toolkit-btn">重试</button>
                                        <button id="web-toolkit-translate-offline" class="web-toolkit-btn secondary">离线翻译</button>
                                    </div>
                                </div>
                            `;
                            
                            // 绑定重试按钮
                            document.getElementById('web-toolkit-translate-retry').addEventListener('click', () => {
                                this.translateText();
                            });
                            
                            // 绑定离线翻译按钮
                            document.getElementById('web-toolkit-translate-offline').addEventListener('click', () => {
                                this.performOfflineTranslation(text, targetLang);
                            });
                            
                            this.showNotification('翻译服务连接失败');
                        });
                });
        }
        
        // 执行翻译（主要翻译服务）
        async performTranslation(text, targetLang) {
            // 使用Google翻译API
            const apiUrl = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            // 解析Google翻译响应
            if (data && data[0] && Array.isArray(data[0])) {
                const translation = data[0].map(item => item[0]).join('');
                return translation;
            } else {
                throw new Error('Invalid translation response');
            }
        }
        
        // 备用翻译服务
        async performBackupTranslation(text, targetLang) {
            // 使用Microsoft翻译API或其他免费翻译服务
            const apiUrl = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=auto|${targetLang}`;
            
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data && data.responseData && data.responseData.translatedText) {
                return data.responseData.translatedText;
            } else {
                throw new Error('Invalid translation response');
            }
        }
        
        // 离线翻译（简单的字符映射）
        performOfflineTranslation(text, targetLang) {
            // 这是一个非常基础的离线翻译实现，仅用于演示
            const result = document.getElementById('web-toolkit-translate-result');
            
            // 简单的字符映射表（仅用于演示）
            const basicTranslations = {
                'hello': { 'zh': '你好', 'ja': 'こんにちは', 'ko': '안녕하세요' },
                'world': { 'zh': '世界', 'ja': '世界', 'ko': '세계' },
                'good': { 'zh': '好', 'ja': '良い', 'ko': '좋은' },
                'thank you': { 'zh': '谢谢', 'ja': 'ありがとう', 'ko': '감사합니다' }
            };
            
            const lowerText = text.toLowerCase().trim();
            let translation = text; // 默认返回原文
            
            // 查找简单的翻译
            for (const [english, translations] of Object.entries(basicTranslations)) {
                if (lowerText.includes(english)) {
                    if (translations[targetLang]) {
                        translation = text.toLowerCase().replace(english, translations[targetLang]);
                        break;
                    }
                }
            }
            
            result.innerHTML = `
                <div style="border: 1px solid #ddd; padding: 15px; border-radius: 5px; background: #f9f9f9;">
                    <p><strong>原文：</strong></p>
                    <p style="margin-bottom: 15px; font-style: italic;">${text}</p>
                    <p><strong>离线翻译结果 (${targetLang}):</strong></p>
                    <p style="font-size: 1.1em; color: #333;">${translation}</p>
                    <p style="font-size: 0.9em; color: #666; margin-top: 10px;">⚠️ 离线翻译功能有限，仅支持基础词汇</p>
                    <div style="margin-top: 15px; display: flex; gap: 10px;">
                        <button id="web-toolkit-copy-translation" class="web-toolkit-btn success">复制翻译</button>
                        <button id="web-toolkit-translate-again" class="web-toolkit-btn secondary">重新翻译</button>
                    </div>
                </div>
            `;
            
            // 绑定按钮事件
            document.getElementById('web-toolkit-copy-translation').addEventListener('click', () => {
                navigator.clipboard.writeText(translation).then(() => {
                    this.showNotification('翻译结果已复制到剪贴板！');
                }).catch(() => {
                    this.showNotification('复制失败，请手动复制');
                });
            });
            
            document.getElementById('web-toolkit-translate-again').addEventListener('click', () => {
                this.translateText();
            });
            
            this.showNotification('离线翻译完成');
        }

        // 显示通知
        showNotification(message) {
            const notification = document.getElementById('web-toolkit-notification');
            notification.textContent = message;
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
    }

    // 初始化插件
    new WebToolkit();
})();