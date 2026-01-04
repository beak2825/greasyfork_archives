// ==UserScript==
// @name         微信公众号文章编辑器
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  一个用于编辑和格式化内容以便发布到微信公众号的工具，支持Markdown语法和实时预览
// @author       shenfangda
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iIzAwQjM3QiIgd2lkdGg9IjQ4cHgiIGhlaWdodD0iNDhweCI+PHBhdGggZD0iTTE0LjkgMTAuNXYyaC01di0yaC0ydjdoMTB2LTdoLTN6bTcuMSA3LjVIMlY2aDIwdjEyem0tMTgtMWgxNlY4SDRWMTZ6Ii8+PC9zdmc+
// @downloadURL https://update.greasyfork.org/scripts/549932/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E7%BC%96%E8%BE%91%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/549932/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E7%BC%96%E8%BE%91%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 主要功能类
    class WeChatArticleEditor {
        constructor() {
            this.init();
        }

        init() {
            console.log('微信公众号文章编辑器已启动');
            this.createUI();
            this.bindEvents();
        }

        // 创建用户界面
        createUI() {
            GM_addStyle(`
                #wechat-editor-panel {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 80%;
                    height: 80%;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 100000;
                    display: none;
                    flex-direction: column;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                }

                #wechat-editor-panel-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 15px 20px;
                    border-bottom: 1px solid #eee;
                    background: #f8f9fa;
                    border-radius: 8px 8px 0 0;
                }

                #wechat-editor-panel-title {
                    font-size: 18px;
                    font-weight: 600;
                    color: #333;
                }

                #wechat-editor-close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #999;
                    width: 30px;
                    height: 30px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                }

                #wechat-editor-close-btn:hover {
                    background: #eee;
                    color: #666;
                }

                #wechat-editor-content {
                    display: flex;
                    flex: 1;
                    overflow: hidden;
                }

                #wechat-editor-input-area {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid #eee;
                }

                #wechat-editor-toolbar {
                    padding: 10px 15px;
                    border-bottom: 1px solid #eee;
                    background: #f8f9fa;
                    display: flex;
                    gap: 10px;
                    flex-wrap: wrap;
                }

                .wechat-editor-tool-btn {
                    background: #f1f1f1;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    padding: 5px 10px;
                    font-size: 14px;
                    cursor: pointer;
                }

                .wechat-editor-tool-btn:hover {
                    background: #e9e9e9;
                }

                #wechat-editor-textarea {
                    flex: 1;
                    padding: 20px;
                    border: none;
                    resize: none;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                    font-size: 14px;
                    line-height: 1.5;
                    outline: none;
                }

                #wechat-editor-preview-area {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    background: #fff;
                }

                #wechat-editor-preview-content {
                    max-width: 100%;
                }

                #wechat-editor-footer {
                    padding: 15px 20px;
                    border-top: 1px solid #eee;
                    background: #f8f9fa;
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    border-radius: 0 0 8px 8px;
                }

                .wechat-editor-action-btn {
                    padding: 8px 16px;
                    border-radius: 4px;
                    border: none;
                    font-size: 14px;
                    cursor: pointer;
                }

                #wechat-editor-copy-btn {
                    background: #07c160;
                    color: white;
                }

                #wechat-editor-copy-btn:hover {
                    background: #06a050;
                }

                #wechat-editor-reset-btn {
                    background: #f1f1f1;
                    color: #333;
                }

                #wechat-editor-reset-btn:hover {
                    background: #e9e9e9;
                }

                #wechat-editor-toggle-btn {
                    position: fixed;
                    top: 70px;
                    right: 20px;
                    width: 45px;
                    height: 45px;
                    background: #00b37b;
                    color: white;
                    border: none;
                    border-radius: 50%;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    cursor: pointer;
                    z-index: 99999;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s ease;
                }

                #wechat-editor-toggle-btn:hover {
                    background: #009966;
                    transform: scale(1.1);
                }

                /* Markdown样式 */
                .wechat-editor-preview h1,
                .wechat-editor-preview h2,
                .wechat-editor-preview h3,
                .wechat-editor-preview h4,
                .wechat-editor-preview h5,
                .wechat-editor-preview h6 {
                    margin: 20px 0 15px;
                    font-weight: bold;
                    color: #333;
                }

                .wechat-editor-preview h1 {
                    font-size: 24px;
                }

                .wechat-editor-preview h2 {
                    font-size: 22px;
                }

                .wechat-editor-preview h3 {
                    font-size: 20px;
                }

                .wechat-editor-preview h4 {
                    font-size: 18px;
                }

                .wechat-editor-preview h5 {
                    font-size: 16px;
                }

                .wechat-editor-preview h6 {
                    font-size: 14px;
                }

                .wechat-editor-preview p {
                    margin: 0 0 15px;
                    line-height: 1.7;
                    color: #333;
                    font-size: 16px;
                }

                .wechat-editor-preview ul,
                .wechat-editor-preview ol {
                    margin: 10px 0 15px;
                    padding-left: 20px;
                }

                .wechat-editor-preview li {
                    margin-bottom: 8px;
                    line-height: 1.6;
                }

                .wechat-editor-preview a {
                    color: #00b37b;
                    text-decoration: none;
                }

                .wechat-editor-preview pre,
                .wechat-editor-preview code {
                    background: #f8f8f8;
                    border-radius: 4px;
                    padding: 12px;
                    font-size: 14px;
                    line-height: 1.5;
                    overflow-x: auto;
                    margin: 15px 0;
                    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
                }

                .wechat-editor-preview blockquote {
                    border-left: 4px solid #00b37b;
                    margin: 15px 0;
                    padding: 10px 20px;
                    background: #f8f8f8;
                    color: #666;
                }

                .wechat-editor-preview img {
                    max-width: 100%;
                    height: auto;
                    border-radius: 4px;
                    margin: 10px 0;
                }

                .wechat-editor-preview table {
                    width: 100%;
                    margin: 15px 0;
                    border-collapse: collapse;
                    font-size: 14px;
                }

                .wechat-editor-preview td,
                .wechat-editor-preview th {
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    text-align: left;
                }

                .wechat-editor-preview th {
                    background: #f8f8f8;
                    font-weight: bold;
                }

                .wechat-editor-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    background: #27ae60;
                    color: white;
                    padding: 12px 20px;
                    border-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                    z-index: 100001;
                    font-family: Arial, sans-serif;
                    font-size: 14px;
                }

                .wechat-editor-notification.error {
                    background: #e74c3c;
                }
            `);

            // 创建主面板
            const panel = document.createElement('div');
            panel.id = 'wechat-editor-panel';
            
            panel.innerHTML = `
                <div id="wechat-editor-panel-header">
                    <div id="wechat-editor-panel-title">微信公众号文章编辑器</div>
                    <button id="wechat-editor-close-btn">×</button>
                </div>
                <div id="wechat-editor-content">
                    <div id="wechat-editor-input-area">
                        <div id="wechat-editor-toolbar">
                            <button class="wechat-editor-tool-btn" data-action="heading">标题</button>
                            <button class="wechat-editor-tool-btn" data-action="bold">粗体</button>
                            <button class="wechat-editor-tool-btn" data-action="italic">斜体</button>
                            <button class="wechat-editor-tool-btn" data-action="link">链接</button>
                            <button class="wechat-editor-tool-btn" data-action="code">代码</button>
                            <button class="wechat-editor-tool-btn" data-action="quote">引用</button>
                            <button class="wechat-editor-tool-btn" data-action="ul">无序列表</button>
                            <button class="wechat-editor-tool-btn" data-action="ol">有序列表</button>
                        </div>
                        <textarea id="wechat-editor-textarea" placeholder="在此粘贴或输入您的Markdown内容..."></textarea>
                    </div>
                    <div id="wechat-editor-preview-area">
                        <div id="wechat-editor-preview-content" class="wechat-editor-preview"></div>
                    </div>
                </div>
                <div id="wechat-editor-footer">
                    <button id="wechat-editor-reset-btn" class="wechat-editor-action-btn">重置</button>
                    <button id="wechat-editor-copy-btn" class="wechat-editor-action-btn">复制到微信</button>
                </div>
            `;
            
            document.body.appendChild(panel);
            
            // 创建切换按钮
            const toggleBtn = document.createElement('button');
            toggleBtn.id = 'wechat-editor-toggle-btn';
            toggleBtn.innerHTML = '📝';
            document.body.appendChild(toggleBtn);
        }

        // 绑定事件
        bindEvents() {
            // 切换面板显示
            document.getElementById('wechat-editor-toggle-btn').addEventListener('click', () => {
                const panel = document.getElementById('wechat-editor-panel');
                panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
            });
            
            // 关闭面板
            document.getElementById('wechat-editor-close-btn').addEventListener('click', () => {
                document.getElementById('wechat-editor-panel').style.display = 'none';
            });
            
            // 文本域输入事件
            document.getElementById('wechat-editor-textarea').addEventListener('input', () => {
                this.updatePreview();
            });
            
            // 工具栏按钮事件
            document.getElementById('wechat-editor-toolbar').addEventListener('click', (e) => {
                if (e.target.classList.contains('wechat-editor-tool-btn')) {
                    const action = e.target.dataset.action;
                    this.handleToolbarAction(action);
                }
            });
            
            // 复制按钮事件
            document.getElementById('wechat-editor-copy-btn').addEventListener('click', () => {
                this.copyToWeChat();
            });
            
            // 重置按钮事件
            document.getElementById('wechat-editor-reset-btn').addEventListener('click', () => {
                this.resetEditor();
            });
        }

        // 处理工具栏动作
        handleToolbarAction(action) {
            const textarea = document.getElementById('wechat-editor-textarea');
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            let newText = '';
            let newCursorPos = start;
            
            switch(action) {
                case 'heading':
                    newText = `# ${selectedText || '标题'}`;
                    newCursorPos = start + 2;
                    break;
                case 'bold':
                    newText = `**${selectedText || '粗体文本'}**`;
                    newCursorPos = start + 2;
                    break;
                case 'italic':
                    newText = `*${selectedText || '斜体文本'}*`;
                    newCursorPos = start + 1;
                    break;
                case 'link':
                    newText = `[${selectedText || '链接文本'}](http://example.com)`;
                    newCursorPos = start + selectedText.length + 3;
                    break;
                case 'code':
                    newText = `\`${selectedText || '代码'}\``;
                    newCursorPos = start + 1;
                    break;
                case 'quote':
                    newText = `> ${selectedText || '引用内容'}`;
                    newCursorPos = start + 2;
                    break;
                case 'ul':
                    newText = `- ${selectedText || '列表项'}`;
                    newCursorPos = start + 2;
                    break;
                case 'ol':
                    newText = `1. ${selectedText || '列表项'}`;
                    newCursorPos = start + 3;
                    break;
            }
            
            textarea.value = textarea.value.substring(0, start) + newText + textarea.value.substring(end);
            textarea.focus();
            textarea.setSelectionRange(newCursorPos, newCursorPos + newText.length - (action === 'heading' ? 2 : action === 'bold' ? 4 : action === 'italic' ? 2 : action === 'code' ? 2 : action === 'quote' ? 2 : action === 'ul' ? 2 : action === 'ol' ? 3 : 0));
            this.updatePreview();
        }

        // 更新预览
        updatePreview() {
            const content = document.getElementById('wechat-editor-textarea').value;
            const preview = document.getElementById('wechat-editor-preview-content');
            preview.innerHTML = this.markdownToHTML(content);
        }

        // Markdown转HTML
        markdownToHTML(markdown) {
            // 简单的Markdown解析器
            let html = markdown;
            
            // 代码块
            html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
            
            // 行内代码
            html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
            
            // 引用
            html = html.replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>');
            
            // 无序列表
            html = html.replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>');
            html = html.replace(/(<li>.*<\/li>)/gs, '<ul>$1</ul>');
            
            // 有序列表
            html = html.replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>');
            html = html.replace(/(<li>.*<\/li>)/gs, '<ol>$1</ol>');
            
            // 链接
            html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
            
            // 图片
            html = html.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1">');
            
            // 粗体
            html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            
            // 斜体
            html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
            
            // 标题
            html = html.replace(/^###### (.*$)/gm, '<h6>$1</h6>');
            html = html.replace(/^##### (.*$)/gm, '<h5>$1</h5>');
            html = html.replace(/^#### (.*$)/gm, '<h4>$1</h4>');
            html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
            html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
            html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
            
            // 段落
            html = html.replace(/^\s*([^\n<]+?)\s*$/gm, '<p>$1</p>');
            
            // 处理空行
            html = html.replace(/<p>\s*<\/p>/g, '');
            
            return html;
        }

        // 复制到微信
        copyToWeChat() {
            const content = document.getElementById('wechat-editor-preview-content').innerHTML;
            
            try {
                GM_setClipboard(content, 'text/html');
                this.showNotification('✅ 已复制到剪贴板，可粘贴到微信公众号编辑器');
            } catch (error) {
                console.error('复制失败:', error);
                this.showNotification('❌ 复制失败，请重试', true);
            }
        }

        // 重置编辑器
        resetEditor() {
            document.getElementById('wechat-editor-textarea').value = '';
            document.getElementById('wechat-editor-preview-content').innerHTML = '';
        }

        // 显示通知
        showNotification(message, isError = false) {
            // 移除现有的通知
            const existingNotification = document.querySelector('.wechat-editor-notification');
            if (existingNotification) {
                existingNotification.remove();
            }
            
            // 创建通知元素
            const notification = document.createElement('div');
            notification.className = 'wechat-editor-notification';
            if (isError) {
                notification.classList.add('error');
            }
            notification.innerHTML = message;
            
            document.body.appendChild(notification);
            
            // 3秒后移除通知
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 3000);
        }
    }

    // 初始化插件
    new WeChatArticleEditor();
})();