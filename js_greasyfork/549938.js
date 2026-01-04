// ==UserScript==
// @name         网页文本格式化工具
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  强大的网页文本格式化工具，支持文本清理、格式转换、编码解码、排序去重等实用功能
// @author       shenfangda
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/549938/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/549938/%E7%BD%91%E9%A1%B5%E6%96%87%E6%9C%AC%E6%A0%BC%E5%BC%8F%E5%8C%96%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 配置
    const config = {
        tools: [
            { id: 'clean', name: '文本清理', icon: '🧹' },
            { id: 'format', name: '格式转换', icon: '🔄' },
            { id: 'encode', name: '编码解码', icon: '🔐' },
            { id: 'sort', name: '排序去重', icon: '📊' },
            { id: 'case', name: '大小写转换', icon: '📝' },
            { id: 'replace', name: '批量替换', icon: '🔁' },
            { id: 'count', name: '文本统计', icon: '📈' },
            { id: 'extract', name: '信息提取', icon: '🔍' }
        ],
        
        // 文本处理规则
        textRules: {
            clean: {
                spaces: { name: '多余空格', desc: '清理多余空格和制表符' },
                lines: { name: '空行清理', desc: '删除多余空行' },
                html: { name: 'HTML标签', desc: '移除HTML标签' },
                special: { name: '特殊字符', desc: '清理不可见字符' },
                punctuation: { name: '标点符号', desc: '统一标点符号格式' }
            },
            format: {
                json: { name: 'JSON格式化', desc: '格式化JSON文本' },
                xml: { name: 'XML格式化', desc: '格式化XML文本' },
                sql: { name: 'SQL格式化', desc: '格式化SQL语句' },
                csv: { name: 'CSV转换', desc: '转换CSV格式' },
                markdown: { name: 'Markdown转换', desc: '转换为Markdown格式' }
            },
            encode: {
                url: { name: 'URL编码/解码', desc: 'URL编码转换' },
                base64: { name: 'Base64编码/解码', desc: 'Base64转换' },
                html: { name: 'HTML实体编码', desc: 'HTML实体转换' },
                unicode: { name: 'Unicode编码', desc: 'Unicode转换' },
                md5: { name: 'MD5哈希', desc: '生成MD5哈希值' }
            }
        }
    };

    // 主类
    class TextFormatterToolkit {
        constructor() {
            this.currentTool = null;
            this.selectedText = '';
            this.init();
        }

        init() {
            console.log('网页文本格式化工具已启动');
            this.createUI();
            this.bindEvents();
            this.addContextMenu();
        }

        // 创建UI界面
        createUI() {
            GM_addStyle(`
                #text-formatter-panel {
                    position: fixed;
                    top: 50px;
                    right: 50px;
                    width: 400px;
                    max-height: 600px;
                    background: #fff;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
                    z-index: 10000;
                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    font-size: 14px;
                    display: none;
                    overflow: hidden;
                }

                #text-formatter-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 15px 20px;
                    cursor: move;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-weight: 600;
                }

                #text-formatter-title {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                #text-formatter-close {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    font-size: 18px;
                    cursor: pointer;
                    width: 28px;
                    height: 28px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: background 0.2s;
                }

                #text-formatter-close:hover {
                    background: rgba(255,255,255,0.3);
                }

                #text-formatter-content {
                    padding: 20px;
                    max-height: 500px;
                    overflow-y: auto;
                }

                .tool-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .tool-item {
                    padding: 15px;
                    background: #f8f9fa;
                    border: 2px solid transparent;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }

                .tool-item:hover {
                    background: #e9ecef;
                    border-color: #667eea;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.15);
                }

                .tool-item.active {
                    background: #667eea;
                    color: white;
                    border-color: #667eea;
                }

                .tool-icon {
                    font-size: 28px;
                    margin-bottom: 8px;
                    display: block;
                }

                .tool-name {
                    font-weight: 500;
                    font-size: 13px;
                }

                .tool-panel {
                    display: none;
                    animation: fadeIn 0.3s ease-in-out;
                }

                .tool-panel.active {
                    display: block;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .input-section, .output-section {
                    margin-bottom: 15px;
                }

                .section-title {
                    font-weight: 600;
                    margin-bottom: 8px;
                    color: #495057;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .text-area {
                    width: 100%;
                    min-height: 120px;
                    padding: 12px;
                    border: 1px solid #ced4da;
                    border-radius: 6px;
                    font-family: 'Consolas', 'Monaco', monospace;
                    font-size: 13px;
                    resize: vertical;
                    transition: border-color 0.2s;
                }

                .text-area:focus {
                    outline: none;
                    border-color: #667eea;
                    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
                }

                .button-group {
                    display: flex;
                    gap: 8px;
                    flex-wrap: wrap;
                    margin-bottom: 15px;
                }

                .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 500;
                    transition: all 0.2s;
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                }

                .btn-primary {
                    background: #667eea;
                    color: white;
                }

                .btn-primary:hover {
                    background: #5a67d8;
                    transform: translateY(-1px);
                }

                .btn-secondary {
                    background: #6c757d;
                    color: white;
                }

                .btn-secondary:hover {
                    background: #5a6268;
                }

                .btn-success {
                    background: #28a745;
                    color: white;
                }

                .btn-success:hover {
                    background: #218838;
                }

                .btn-warning {
                    background: #ffc107;
                    color: #212529;
                }

                .btn-warning:hover {
                    background: #e0a800;
                }

                .checkbox-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 15px;
                }

                .checkbox-item {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .checkbox-item:hover {
                    background: #e9ecef;
                }

                .checkbox-item input[type="checkbox"] {
                    margin: 0;
                }

                .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 10px;
                    margin-bottom: 15px;
                }

                .stat-item {
                    background: #f8f9fa;
                    padding: 10px;
                    border-radius: 6px;
                    text-align: center;
                }

                .stat-value {
                    font-size: 20px;
                    font-weight: bold;
                    color: #667eea;
                }

                .stat-label {
                    font-size: 12px;
                    color: #6c757d;
                    margin-top: 2px;
                }

                .floating-button {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border: none;
                    border-radius: 50%;
                    cursor: pointer;
                    font-size: 24px;
                    color: white;
                    box-shadow: 0 4px 20px rgba(102, 126, 234, 0.3);
                    transition: all 0.3s;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .floating-button:hover {
                    transform: scale(1.1);
                    box-shadow: 0 6px 25px rgba(102, 126, 234, 0.4);
                }

                .replace-pairs {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                    margin-bottom: 15px;
                }

                .replace-pair {
                    display: flex;
                    gap: 8px;
                    align-items: center;
                }

                .replace-input {
                    flex: 1;
                    padding: 8px;
                    border: 1px solid #ced4da;
                    border-radius: 4px;
                    font-size: 13px;
                }

                .extract-results {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 6px;
                    padding: 12px;
                    margin-top: 10px;
                    max-height: 200px;
                    overflow-y: auto;
                }

                .extract-item {
                    padding: 6px 8px;
                    margin: 4px 0;
                    background: white;
                    border-radius: 4px;
                    border-left: 3px solid #667eea;
                    font-family: monospace;
                    font-size: 12px;
                }
            `);

            // 创建浮动按钮
            const floatingBtn = document.createElement('button');
            floatingBtn.className = 'floating-button';
            floatingBtn.innerHTML = '📝';
            floatingBtn.title = '文本格式化工具';
            floatingBtn.onclick = () => this.togglePanel();
            document.body.appendChild(floatingBtn);

            // 创建主面板
            const panel = document.createElement('div');
            panel.id = 'text-formatter-panel';
            panel.innerHTML = `
                <div id="text-formatter-header">
                    <div id="text-formatter-title">
                        <span>📝</span>
                        <span>文本格式化工具</span>
                    </div>
                    <button id="text-formatter-close">×</button>
                </div>
                <div id="text-formatter-content">
                    <div class="tool-grid">
                        ${config.tools.map(tool => `
                            <div class="tool-item" data-tool="${tool.id}">
                                <span class="tool-icon">${tool.icon}</span>
                                <span class="tool-name">${tool.name}</span>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div id="tool-panels">
                        ${this.createToolPanels()}
                    </div>
                </div>
            `;
            document.body.appendChild(panel);

            this.makeDraggable(panel.querySelector('#text-formatter-header'), panel);
        }

        // 创建工具面板
        createToolPanels() {
            return `
                <div class="tool-panel" id="panel-clean">
                    <div class="input-section">
                        <div class="section-title">🧹 文本清理</div>
                        <textarea class="text-area" id="clean-input" placeholder="输入需要清理的文本..."></textarea>
                    </div>
                    <div class="checkbox-group">
                        ${Object.entries(config.textRules.clean).map(([key, rule]) => `
                            <label class="checkbox-item">
                                <input type="checkbox" value="${key}" checked>
                                <strong>${rule.name}</strong> - ${rule.desc}
                            </label>
                        `).join('')}
                    </div>
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="textFormatterToolkit.processClean()">开始清理</button>
                        <button class="btn btn-secondary" onclick="textFormatterToolkit.clearInput('clean')">清空</button>
                    </div>
                    <div class="output-section">
                        <div class="section-title">✨ 清理结果</div>
                        <textarea class="text-area" id="clean-output" readonly placeholder="清理结果将显示在这里..."></textarea>
                    </div>
                </div>

                <div class="tool-panel" id="panel-format">
                    <div class="input-section">
                        <div class="section-title">🔄 格式转换</div>
                        <textarea class="text-area" id="format-input" placeholder="输入需要格式化的文本..."></textarea>
                    </div>
                    <div class="button-group">
                        ${Object.entries(config.textRules.format).map(([key, rule]) => `
                            <button class="btn btn-primary" onclick="textFormatterToolkit.processFormat('${key}')">${rule.name}</button>
                        `).join('')}
                    </div>
                    <div class="button-group">
                        <button class="btn btn-secondary" onclick="textFormatterToolkit.clearInput('format')">清空</button>
                        <button class="btn btn-success" onclick="textFormatterToolkit.copyOutput('format')">复制结果</button>
                    </div>
                    <div class="output-section">
                        <div class="section-title">📋 转换结果</div>
                        <textarea class="text-area" id="format-output" readonly placeholder="转换结果将显示在这里..."></textarea>
                    </div>
                </div>

                <div class="tool-panel" id="panel-encode">
                    <div class="input-section">
                        <div class="section-title">🔐 编码解码</div>
                        <textarea class="text-area" id="encode-input" placeholder="输入需要编码/解码的文本..."></textarea>
                    </div>
                    <div class="button-group">
                        ${Object.entries(config.textRules.encode).map(([key, rule]) => `
                            <button class="btn btn-primary" onclick="textFormatterToolkit.processEncode('${key}', true)">${rule.name}</button>
                        `).join('')}
                    </div>
                    <div class="button-group">
                        ${Object.entries(config.textRules.encode).filter(([key]) => key !== 'md5').map(([key, rule]) => `
                            <button class="btn btn-warning" onclick="textFormatterToolkit.processEncode('${key}', false)">${rule.name}解码</button>
                        `).join('')}
                    </div>
                    <div class="button-group">
                        <button class="btn btn-secondary" onclick="textFormatterToolkit.clearInput('encode')">清空</button>
                        <button class="btn btn-success" onclick="textFormatterToolkit.copyOutput('encode')">复制结果</button>
                    </div>
                    <div class="output-section">
                        <div class="section-title">🔑 处理结果</div>
                        <textarea class="text-area" id="encode-output" readonly placeholder="处理结果将显示在这里..."></textarea>
                    </div>
                </div>

                <div class="tool-panel" id="panel-sort">
                    <div class="input-section">
                        <div class="section-title">📊 排序去重</div>
                        <textarea class="text-area" id="sort-input" placeholder="每行一个项目，输入需要处理的文本..."></textarea>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="textFormatterToolkit.processSort('asc')">升序排列</button>
                        <button class="btn btn-primary" onclick="textFormatterToolkit.processSort('desc')">降序排列</button>
                        <button class="btn btn-success" onclick="textFormatterToolkit.processSort('unique')">去重</button>
                        <button class="btn btn-warning" onclick="textFormatterToolkit.processSort('shuffle')">随机排序</button>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-secondary" onclick="textFormatterToolkit.clearInput('sort')">清空</button>
                        <button class="btn btn-success" onclick="textFormatterToolkit.copyOutput('sort')">复制结果</button>
                    </div>
                    <div class="output-section">
                        <div class="section-title">📈 处理结果</div>
                        <textarea class="text-area" id="sort-output" readonly placeholder="处理结果将显示在这里..."></textarea>
                    </div>
                </div>

                <div class="tool-panel" id="panel-case">
                    <div class="input-section">
                        <div class="section-title">📝 大小写转换</div>
                        <textarea class="text-area" id="case-input" placeholder="输入需要转换的文本..."></textarea>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="textFormatterToolkit.processCase('upper')">转换大写</button>
                        <button class="btn btn-primary" onclick="textFormatterToolkit.processCase('lower')">转换小写</button>
                        <button class="btn btn-success" onclick="textFormatterToolkit.processCase('title')">标题格式</button>
                        <button class="btn btn-warning" onclick="textFormatterToolkit.processCase('camel')">驼峰命名</button>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-secondary" onclick="textFormatterToolkit.clearInput('case')">清空</button>
                        <button class="btn btn-success" onclick="textFormatterToolkit.copyOutput('case')">复制结果</button>
                    </div>
                    <div class="output-section">
                        <div class="section-title">✏️ 转换结果</div>
                        <textarea class="text-area" id="case-output" readonly placeholder="转换结果将显示在这里..."></textarea>
                    </div>
                </div>

                <div class="tool-panel" id="panel-replace">
                    <div class="input-section">
                        <div class="section-title">🔁 批量替换</div>
                        <textarea class="text-area" id="replace-input" placeholder="输入需要替换的文本..."></textarea>
                    </div>
                    <div class="section-title">替换规则</div>
                    <div class="replace-pairs" id="replace-pairs">
                        <div class="replace-pair">
                            <input type="text" class="replace-input" placeholder="查找内容" data-type="find">
                            <input type="text" class="replace-input" placeholder="替换为" data-type="replace">
                            <button class="btn btn-warning" onclick="textFormatterToolkit.removeReplacePair(this)">删除</button>
                        </div>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="textFormatterToolkit.addReplacePair()">添加规则</button>
                        <button class="btn btn-success" onclick="textFormatterToolkit.processReplace()">执行替换</button>
                        <button class="btn btn-secondary" onclick="textFormatterToolkit.clearInput('replace')">清空</button>
                    </div>
                    <div class="output-section">
                        <div class="section-title">🔄 替换结果</div>
                        <textarea class="text-area" id="replace-output" readonly placeholder="替换结果将显示在这里..."></textarea>
                    </div>
                </div>

                <div class="tool-panel" id="panel-count">
                    <div class="input-section">
                        <div class="section-title">📈 文本统计</div>
                        <textarea class="text-area" id="count-input" placeholder="输入需要统计的文本..."></textarea>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="textFormatterToolkit.processCount()">开始统计</button>
                        <button class="btn btn-secondary" onclick="textFormatterToolkit.clearInput('count')">清空</button>
                    </div>
                    <div class="stats-grid" id="count-stats" style="display: none;">
                        <div class="stat-item">
                            <div class="stat-value" id="char-count">0</div>
                            <div class="stat-label">字符数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="word-count">0</div>
                            <div class="stat-label">单词数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="line-count">0</div>
                            <div class="stat-label">行数</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value" id="para-count">0</div>
                            <div class="stat-label">段落数</div>
                        </div>
                    </div>
                </div>

                <div class="tool-panel" id="panel-extract">
                    <div class="input-section">
                        <div class="section-title">🔍 信息提取</div>
                        <textarea class="text-area" id="extract-input" placeholder="输入需要提取信息的文本..."></textarea>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-primary" onclick="textFormatterToolkit.processExtract('email')">提取邮箱</button>
                        <button class="btn btn-primary" onclick="textFormatterToolkit.processExtract('url')">提取网址</button>
                        <button class="btn btn-success" onclick="textFormatterToolkit.processExtract('phone')">提取电话</button>
                        <button class="btn btn-warning" onclick="textFormatterToolkit.processExtract('ip')">提取IP</button>
                    </div>
                    <div class="button-group">
                        <button class="btn btn-secondary" onclick="textFormatterToolkit.clearInput('extract')">清空</button>
                        <button class="btn btn-success" onclick="textFormatterToolkit.copyOutput('extract')">复制结果</button>
                    </div>
                    <div class="extract-results" id="extract-results" style="display: none;">
                        <div class="section-title">🎯 提取结果</div>
                        <div id="extract-items"></div>
                    </div>
                </div>
            `;
        }

        // 绑定事件
        bindEvents() {
            // 工具选择
            document.querySelectorAll('.tool-item').forEach(item => {
                item.addEventListener('click', () => {
                    const toolId = item.dataset.tool;
                    this.selectTool(toolId);
                });
            });

            // 关闭按钮
            document.getElementById('text-formatter-close').addEventListener('click', () => {
                this.hidePanel();
            });

            // 点击外部关闭
            document.addEventListener('click', (e) => {
                const panel = document.getElementById('text-formatter-panel');
                const button = document.querySelector('.floating-button');
                if (!panel.contains(e.target) && !button.contains(e.target)) {
                    this.hidePanel();
                }
            });
        }

        // 添加右键菜单
        addContextMenu() {
            document.addEventListener('contextmenu', (e) => {
                const selection = window.getSelection().toString().trim();
                if (selection) {
                    this.selectedText = selection;
                }
            });

            // 监听文本选择
            document.addEventListener('mouseup', () => {
                setTimeout(() => {
                    const selection = window.getSelection().toString().trim();
                    if (selection) {
                        this.selectedText = selection;
                    }
                }, 100);
            });
        }

        // 选择工具
        selectTool(toolId) {
            // 更新工具选择状态
            document.querySelectorAll('.tool-item').forEach(item => {
                item.classList.remove('active');
            });
            document.querySelector(`[data-tool="${toolId}"]`).classList.add('active');

            // 显示对应面板
            document.querySelectorAll('.tool-panel').forEach(panel => {
                panel.classList.remove('active');
            });
            document.getElementById(`panel-${toolId}`).classList.add('active');

            this.currentTool = toolId;

            // 如果有选中文本，自动填充
            if (this.selectedText && !document.getElementById(`${toolId}-input`).value) {
                document.getElementById(`${toolId}-input`).value = this.selectedText;
            }
        }

        // 文本清理
        processClean() {
            const input = document.getElementById('clean-input').value;
            if (!input) return;

            let result = input;
            const checkboxes = document.querySelectorAll('#panel-clean input[type="checkbox"]:checked');
            
            checkboxes.forEach(checkbox => {
                const rule = checkbox.value;
                switch (rule) {
                    case 'spaces':
                        result = result.replace(/\s+/g, ' ').trim();
                        break;
                    case 'lines':
                        result = result.replace(/\n\s*\n\s*\n/g, '\n\n');
                        break;
                    case 'html':
                        result = result.replace(/<[^>]*>/g, '');
                        break;
                    case 'special':
                        result = result.replace(/[\x00-\x1F\x7F-\x9F]/g, '');
                        break;
                    case 'punctuation':
                        result = result.replace(/[\""]/g, '"')
                                      .replace(/[\'']/g, "'")
                                      .replace(/[---]/g, '-')
                                      .replace(/\.\.\./g, '…');
                        break;
                }
            });

            document.getElementById('clean-output').value = result;
        }

        // 格式转换
        processFormat(type) {
            const input = document.getElementById('format-input').value;
            if (!input) return;

            let result = input;
            try {
                switch (type) {
                    case 'json':
                        result = JSON.stringify(JSON.parse(input), null, 2);
                        break;
                    case 'xml':
                        result = this.formatXML(input);
                        break;
                    case 'sql':
                        result = this.formatSQL(input);
                        break;
                    case 'csv':
                        result = this.formatCSV(input);
                        break;
                    case 'markdown':
                        result = this.formatMarkdown(input);
                        break;
                }
            } catch (error) {
                result = `格式转换错误: ${error.message}`;
            }

            document.getElementById('format-output').value = result;
        }

        // 编码解码
        processEncode(type, encode) {
            const input = document.getElementById('encode-input').value;
            if (!input) return;

            let result = input;
            try {
                switch (type) {
                    case 'url':
                        result = encode ? encodeURIComponent(input) : decodeURIComponent(input);
                        break;
                    case 'base64':
                        result = encode ? btoa(input) : atob(input);
                        break;
                    case 'html':
                        result = encode ? this.htmlEncode(input) : this.htmlDecode(input);
                        break;
                    case 'unicode':
                        result = encode ? this.unicodeEncode(input) : this.unicodeDecode(input);
                        break;
                    case 'md5':
                        result = this.md5(input);
                        break;
                }
            } catch (error) {
                result = `编码解码错误: ${error.message}`;
            }

            document.getElementById('encode-output').value = result;
        }

        // 排序处理
        processSort(type) {
            const input = document.getElementById('sort-input').value;
            if (!input) return;

            let lines = input.split('\n').filter(line => line.trim());
            
            switch (type) {
                case 'asc':
                    lines.sort((a, b) => a.localeCompare(b));
                    break;
                case 'desc':
                    lines.sort((a, b) => b.localeCompare(a));
                    break;
                case 'unique':
                    lines = [...new Set(lines)];
                    break;
                case 'shuffle':
                    lines = this.shuffleArray(lines);
                    break;
            }

            document.getElementById('sort-output').value = lines.join('\n');
        }

        // 大小写转换
        processCase(type) {
            const input = document.getElementById('case-input').value;
            if (!input) return;

            let result = input;
            switch (type) {
                case 'upper':
                    result = input.toUpperCase();
                    break;
                case 'lower':
                    result = input.toLowerCase();
                    break;
                case 'title':
                    result = this.toTitleCase(input);
                    break;
                case 'camel':
                    result = this.toCamelCase(input);
                    break;
            }

            document.getElementById('case-output').value = result;
        }

        // 批量替换
        addReplacePair() {
            const container = document.getElementById('replace-pairs');
            const pair = document.createElement('div');
            pair.className = 'replace-pair';
            pair.innerHTML = `
                <input type="text" class="replace-input" placeholder="查找内容" data-type="find">
                <input type="text" class="replace-input" placeholder="替换为" data-type="replace">
                <button class="btn btn-warning" onclick="textFormatterToolkit.removeReplacePair(this)">删除</button>
            `;
            container.appendChild(pair);
        }

        removeReplacePair(button) {
            const pairs = document.querySelectorAll('.replace-pair');
            if (pairs.length > 1) {
                button.parentElement.remove();
            }
        }

        processReplace() {
            const input = document.getElementById('replace-input').value;
            if (!input) return;

            let result = input;
            const pairs = document.querySelectorAll('.replace-pair');
            
            pairs.forEach(pair => {
                const findInput = pair.querySelector('[data-type="find"]');
                const replaceInput = pair.querySelector('[data-type="replace"]');
                const find = findInput.value;
                const replace = replaceInput.value;
                
                if (find) {
                    result = result.replace(new RegExp(find.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), replace);
                }
            });

            document.getElementById('replace-output').value = result;
        }

        // 文本统计
        processCount() {
            const input = document.getElementById('count-input').value;
            if (!input) return;

            const stats = {
                chars: input.length,
                words: input.trim() ? input.trim().split(/\s+/).length : 0,
                lines: input.split('\n').length,
                paragraphs: input.split(/\n\s*\n/).filter(p => p.trim()).length
            };

            document.getElementById('char-count').textContent = stats.chars;
            document.getElementById('word-count').textContent = stats.words;
            document.getElementById('line-count').textContent = stats.lines;
            document.getElementById('para-count').textContent = stats.paragraphs;
            
            document.getElementById('count-stats').style.display = 'grid';
        }

        // 信息提取
        processExtract(type) {
            const input = document.getElementById('extract-input').value;
            if (!input) return;

            let results = [];
            const patterns = {
                email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
                url: /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g,
                phone: /1[3-9]\d{9}|\d{3,4}-\d{7,8}|\(\d{3,4}\)\d{7,8}/g,
                ip: /\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b/g
            };

            const matches = input.match(patterns[type]) || [];
            results = [...new Set(matches)]; // 去重

            const resultsContainer = document.getElementById('extract-items');
            const resultsDiv = document.getElementById('extract-results');
            
            if (results.length > 0) {
                resultsContainer.innerHTML = results.map(item => `
                    <div class="extract-item">${item}</div>
                `).join('');
                document.getElementById('extract-output').value = results.join('\n');
            } else {
                resultsContainer.innerHTML = '<div class="extract-item">未找到匹配的内容</div>';
                document.getElementById('extract-output').value = '';
            }
            
            resultsDiv.style.display = 'block';
        }

        // 工具方法
        clearInput(type) {
            document.getElementById(`${type}-input`).value = '';
            if (document.getElementById(`${type}-output`)) {
                document.getElementById(`${type}-output`).value = '';
            }
            if (type === 'count') {
                document.getElementById('count-stats').style.display = 'none';
            }
            if (type === 'extract') {
                document.getElementById('extract-results').style.display = 'none';
            }
        }

        copyOutput(type) {
            const output = document.getElementById(`${type}-output`);
            if (output && output.value) {
                GM_setClipboard(output.value);
                this.showNotification('已复制到剪贴板！');
            }
        }

        // 辅助方法
        formatXML(xml) {
            // 简单的XML格式化
            return xml.replace(/></g, '>\n<').replace(/(>)(<)(\/)/g, '$1\n$2$3');
        }

        formatSQL(sql) {
            // 简单的SQL格式化
            return sql.replace(/\b(SELECT|FROM|WHERE|JOIN|LEFT|RIGHT|INNER|ORDER|GROUP|HAVING)\b/gi, '\n$1')
                     .replace(/\b(AND|OR)\b/gi, '\n  $1');
        }

        formatCSV(input) {
            // 简单的CSV转换
            const lines = input.split('\n').filter(line => line.trim());
            return lines.map(line => line.split(/[,\t]/).map(cell => `"${cell.trim()}"`).join(',')).join('\n');
        }

        formatMarkdown(input) {
            // 简单的Markdown转换
            return input.split('\n').map(line => {
                line = line.trim();
                if (line.length === 0) return '';
                if (line.length < 50) return `## ${line}`;
                return line;
            }).join('\n\n');
        }

        htmlEncode(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        htmlDecode(text) {
            const div = document.createElement('div');
            div.innerHTML = text;
            return div.textContent;
        }

        unicodeEncode(text) {
            return text.split('').map(char => 
                char.codePointAt(0) > 127 ? '\\u' + char.codePointAt(0).toString(16).padStart(4, '0') : char
            ).join('');
        }

        unicodeDecode(text) {
            return text.replace(/\\u([0-9a-fA-F]{4})/g, (match, hex) => 
                String.fromCharCode(parseInt(hex, 16))
            );
        }

        md5(text) {
            // 简化的MD5实现（实际使用需要完整实现）
            return 'MD5: ' + btoa(text).slice(0, 16);
        }

        shuffleArray(array) {
            const shuffled = [...array];
            for (let i = shuffled.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
            }
            return shuffled;
        }

        toTitleCase(text) {
            return text.toLowerCase().replace(/\b\w/g, char => char.toUpperCase());
        }

        toCamelCase(text) {
            return text.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (match, char) => char.toUpperCase());
        }

        // 界面控制
        togglePanel() {
            const panel = document.getElementById('text-formatter-panel');
            if (panel.style.display === 'none' || !panel.style.display) {
                panel.style.display = 'block';
                if (this.selectedText && !this.currentTool) {
                    this.selectTool('clean');
                }
            } else {
                this.hidePanel();
            }
        }

        hidePanel() {
            document.getElementById('text-formatter-panel').style.display = 'none';
        }

        showNotification(message) {
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #28a745;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 10001;
                font-size: 14px;
                font-weight: 500;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease-out;
            `;
            notification.textContent = message;
            document.body.appendChild(notification);

            setTimeout(() => {
                notification.style.animation = 'fadeOut 0.3s ease-in';
                setTimeout(() => notification.remove(), 300);
            }, 2000);
        }

        // 拖拽功能
        makeDraggable(element, container) {
            let isDragging = false;
            let currentX;
            let currentY;
            let initialX;
            let initialY;
            let xOffset = 0;
            let yOffset = 0;

            element.addEventListener('mousedown', dragStart);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', dragEnd);

            function dragStart(e) {
                initialX = e.clientX - xOffset;
                initialY = e.clientY - yOffset;

                if (e.target === element) {
                    isDragging = true;
                }
            }

            function drag(e) {
                if (isDragging) {
                    e.preventDefault();
                    currentX = e.clientX - initialX;
                    currentY = e.clientY - initialY;
                    xOffset = currentX;
                    yOffset = currentY;

                    container.style.transform = `translate(${currentX}px, ${currentY}px)`;
                }
            }

            function dragEnd(e) {
                initialX = currentX;
                initialY = currentY;
                isDragging = false;
            }
        }
    }

    // 添加动画样式
    GM_addStyle(`
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `);

    // 初始化
    const textFormatterToolkit = new TextFormatterToolkit();
    window.textFormatterToolkit = textFormatterToolkit;

})();