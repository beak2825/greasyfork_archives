// ==UserScript==
// @name         更好的书签
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一个功能强大的书签管理工具，支持双栏显示、搜索等功能
// @author       xjy666a
// @match        *://*/*
// @match        file://*/*
// @include      *
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @priority     1
// @license      MIT
// @icon         https://youke1.picui.cn/s1/2025/11/08/690efd26c73bb.png
// @downloadURL https://update.greasyfork.org/scripts/555177/%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%B9%A6%E7%AD%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/555177/%E6%9B%B4%E5%A5%BD%E7%9A%84%E4%B9%A6%E7%AD%BE.meta.js
// ==/UserScript==

/* MIT License
 
Copyright (c) 2025 xjy666a
 
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
 
The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
 
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    // 创建书签管理器
    class BookmarkManager {
        constructor() {
            this.bookmarks = [];
            this.filteredBookmarks = [];
            this.currentView = 'grid'; // grid 或 list
            this.searchQuery = '';
            this.isVisible = false;
            this.shadowRoot = null;
            this.selectedBookmarks = new Set(); // 选中的书签URL集合
            this.batchMode = false; // 是否处于批量选择模式
            this.storageListener = null; // 存储变化监听器
            this.init();
        }

        init() {
            // 创建主界面
            this.createUI();
            // 绑定事件
            this.bindEvents();
            // 从存储加载数据（使用 GM_getValue，可在所有网站间共享）
            this.loadFromStorage();
            // 监听存储变化，实现跨标签页同步
            this.setupStorageListener();
            // 添加页面关闭前保存
            this.setupAutoSave();
        }

        createUI() {
            // 创建主容器
            const container = document.createElement('div');
            container.id = 'better-bookmarks-container';
            
            // 创建 Shadow DOM 来隔离样式
            this.shadowRoot = container.attachShadow({ mode: 'open' });
            
            // 在 Shadow DOM 中创建内容
            this.shadowRoot.innerHTML = `
                <div class="bb-wrapper">
                    <div class="bb-header">
                        <h1>更好的书签</h1>
                        <div class="bb-controls">
                            <button class="bb-btn bb-btn-primary" id="bb-add-current-btn" title="添加当前页面">+ 添加当前页面</button>
                            <button class="bb-btn bb-btn-primary" id="bb-add-manual-btn" title="手动添加书签">+ 手动添加</button>
                            <button class="bb-btn bb-btn-primary" id="bb-import-btn">导入书签</button>
                            <button class="bb-btn" id="bb-export-btn">导出书签</button>
                            <button class="bb-btn-icon" id="bb-close-btn" title="关闭 (Esc)">✕</button>
                            <input type="file" id="bb-file-input" accept=".html" style="display: none;">
                        </div>
                    </div>
                    <div class="bb-toolbar">
                        <div class="bb-search">
                            <input type="text" id="bb-search-input" placeholder="搜索书签..." class="bb-search-input">
                            <button class="bb-btn-icon" id="bb-clear-search">✕</button>
                        </div>
                        <div class="bb-view-toggle">
                            <button class="bb-btn-icon ${this.currentView === 'grid' ? 'active' : ''}" id="bb-grid-view" title="网格视图">⊞</button>
                            <button class="bb-btn-icon ${this.currentView === 'list' ? 'active' : ''}" id="bb-list-view" title="列表视图">☰</button>
                        </div>
                        <div class="bb-batch-controls" id="bb-batch-controls" style="display: none;">
                            <button class="bb-btn" id="bb-batch-select-all">全选</button>
                            <button class="bb-btn" id="bb-batch-deselect-all">取消全选</button>
                            <button class="bb-btn" id="bb-batch-pin">批量置顶</button>
                            <button class="bb-btn" id="bb-batch-unpin">批量取消置顶</button>
                            <button class="bb-btn bb-btn-danger" id="bb-batch-delete">批量删除</button>
                            <button class="bb-btn" id="bb-batch-cancel">取消批量</button>
                            <span class="bb-selected-count" id="bb-selected-count">已选择 0 项</span>
                        </div>
                        <button class="bb-btn" id="bb-batch-mode-btn" title="批量选择模式">批量选择</button>
                    </div>
                    <div class="bb-content" id="bb-content">
                        <div class="bb-empty-state">
                            <p>还没有书签，请先导入书签文件、添加书签或将当前访问页面保存为书签</p>
                            <button class="bb-btn bb-btn-primary" id="bb-empty-import-btn-initial">导入书签</button>
                        </div>
                    </div>
                </div>
            `;

            // 添加样式到 Shadow DOM
            this.addStyles();

            // 插入到页面
            document.body.appendChild(container);
        }

        addStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* CSS Reset for Shadow DOM */
                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }
                
                :host {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: 999999;
                    display: none;
                }

                :host(.visible) {
                    display: block;
                }

                .bb-wrapper {
                    width: 100%;
                    height: 100%;
                    background: #f5f5f5;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                    overflow-y: auto;
                }

                .bb-header {
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 20px 30px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }

                .bb-header h1 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 600;
                }

                .bb-controls {
                    display: flex;
                    gap: 10px;
                }

                .bb-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    transition: all 0.3s;
                }

                .bb-btn-primary {
                    background: white;
                    color: #667eea;
                }

                .bb-btn-primary:hover {
                    background: #f0f0f0;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .bb-btn:not(.bb-btn-primary) {
                    background: rgba(255,255,255,0.2);
                    color: white;
                }

                .bb-btn:not(.bb-btn-primary):hover {
                    background: rgba(255,255,255,0.3);
                }

                #bb-batch-mode-btn {
                    background: #f0f0f0;
                    color: #333;
                    border: 2px solid #e0e0e0;
                }

                #bb-batch-mode-btn:hover {
                    background: #e0e0e0;
                    border-color: #d0d0d0;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .bb-toolbar {
                    background: white;
                    padding: 15px 30px;
                    display: flex;
                    gap: 15px;
                    align-items: center;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.05);
                    flex-wrap: wrap;
                }

                .bb-toolbar .bb-btn:not(.bb-btn-danger) {
                    background: #f0f0f0;
                    color: #333;
                    border: 2px solid #e0e0e0;
                }

                .bb-toolbar .bb-btn:not(.bb-btn-danger):hover {
                    background: #e0e0e0;
                    border-color: #d0d0d0;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                }

                .bb-toolbar .bb-btn-danger {
                    background: #ff4444 !important;
                    color: white !important;
                    border: 2px solid #ff4444 !important;
                }

                .bb-toolbar .bb-btn-danger:hover {
                    background: #ff6666 !important;
                    border-color: #ff6666 !important;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
                }

                .bb-search {
                    flex: 1;
                    min-width: 200px;
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .bb-search-input {
                    width: 100%;
                    padding: 10px 40px 10px 15px;
                    border: 2px solid #e0e0e0;
                    border-radius: 6px;
                    font-size: 14px;
                    transition: border-color 0.3s;
                }

                .bb-search-input:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .bb-btn-icon {
                    width: 36px;
                    height: 36px;
                    border: 2px solid #e0e0e0;
                    background: #e0e0e0;
                    border-radius: 6px;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 18px;
                    transition: all 0.3s;
                }

                .bb-btn-icon:hover {
                    border-color: #667eea;
                    color: #667eea;
                }

                .bb-btn-icon.active {
                    background: #667eea;
                    border-color: #667eea;
                    color: white;
                }

                #bb-close-btn {
                    background: rgba(255,255,255,0.2);
                    border: none;
                    color: white;
                    font-size: 20px;
                    width: 36px;
                    height: 36px;
                }

                #bb-close-btn:hover {
                    background: rgba(255,255,255,0.3);
                }

                .bb-view-toggle {
                    display: flex;
                    gap: 5px;
                }

                .bb-batch-controls {
                    display: flex;
                    gap: 10px;
                    align-items: center;
                    flex-wrap: wrap;
                }

                .bb-selected-count {
                    margin-left: 10px;
                    color: #667eea;
                    font-weight: 600;
                    font-size: 14px;
                }

                .bb-btn-danger {
                    background: #ff4444;
                    color: white;
                }

                .bb-btn-danger:hover {
                    background: #ff6666;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(255, 68, 68, 0.3);
                }

                .bb-context-menu {
                    background: white;
                    border-radius: 8px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                    padding: 8px 0;
                    min-width: 150px;
                    z-index: 1000001;
                }

                .bb-context-menu-item {
                    padding: 10px 20px;
                    cursor: pointer;
                    font-size: 14px;
                    color: #333;
                    transition: background 0.2s;
                }

                .bb-context-menu-item:hover {
                    background: #f5f5f5;
                }

                .bb-context-menu-item.bb-context-menu-danger {
                    color: #ff4444;
                }

                .bb-context-menu-item.bb-context-menu-danger:hover {
                    background: #ffe0e0;
                }

                .bb-content {
                    padding: 30px;
                    max-width: 1400px;
                    margin: 0 auto;
                }

                .bb-empty-state {
                    text-align: center;
                    padding: 60px 20px;
                    color: #999;
                }

                .bb-empty-state p {
                    font-size: 16px;
                    margin-bottom: 20px;
                }

                /* 网格视图 */
                .bb-grid-view {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                }

                .bb-bookmark-card {
                    background: white;
                    border-radius: 8px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    transition: all 0.3s;
                    cursor: pointer;
                    border: 2px solid transparent;
                    position: relative;
                }

                .bb-bookmark-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15);
                    border-color: #667eea;
                }

                .bb-bookmark-card.pinned {
                    border-color: #ffd700;
                    background: linear-gradient(135deg, #fffef0 0%, #ffffff 100%);
                }

                .bb-bookmark-card.selected {
                    border-color: #667eea;
                    background: #f0f4ff;
                }

                .bb-bookmark-card .bb-bookmark-checkbox {
                    position: absolute;
                    top: 10px;
                    left: 10px;
                    width: 20px;
                    height: 20px;
                    cursor: pointer;
                    z-index: 11;
                    accent-color: #667eea;
                }

                .bb-pin-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: rgba(255,255,255,0.9);
                    border: 2px solid #e0e0e0;
                    border-radius: 6px;
                    width: 32px;
                    height: 32px;
                    cursor: pointer;
                    font-size: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    z-index: 10;
                    padding: 0;
                }

                .bb-pin-btn:hover {
                    background: #fff;
                    border-color: #667eea;
                    transform: scale(1.1);
                }

                .bb-bookmark-card.pinned .bb-pin-btn {
                    border-color: #ffd700;
                    background: #fffef0;
                }

                .bb-bookmark-icon {
                    width: 48px;
                    height: 48px;
                    border-radius: 8px;
                    margin-bottom: 12px;
                    object-fit: cover;
                }

                .bb-bookmark-title {
                    font-size: 16px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 8px;
                    line-height: 1.4;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .bb-bookmark-url {
                    font-size: 12px;
                    color: #999;
                    margin-bottom: 8px;
                    word-break: break-all;
                    display: -webkit-box;
                    -webkit-line-clamp: 1;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }


                /* 列表视图 */
                .bb-list-view {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }

                .bb-bookmark-item {
                    background: white;
                    border-radius: 8px;
                    padding: 15px 20px;
                    box-shadow: 0 1px 4px rgba(0,0,0,0.1);
                    transition: all 0.3s;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    border: 2px solid transparent;
                    position: relative;
                }

                .bb-bookmark-item:hover {
                    transform: translateX(4px);
                    box-shadow: 0 2px 8px rgba(0,0,0,0.15);
                    border-color: #667eea;
                }

                .bb-bookmark-item.pinned {
                    border-color: #ffd700;
                    background: linear-gradient(135deg, #fffef0 0%, #ffffff 100%);
                }

                .bb-bookmark-item.selected {
                    border-color: #667eea;
                    background: #f0f4ff;
                }

                .bb-bookmark-item .bb-bookmark-checkbox {
                    width: 18px;
                    height: 18px;
                    cursor: pointer;
                    accent-color: #667eea;
                    flex-shrink: 0;
                }

                .bb-bookmark-item .bb-pin-btn {
                    background: rgba(255,255,255,0.9);
                    border: 2px solid #e0e0e0;
                    border-radius: 6px;
                    width: 28px;
                    height: 28px;
                    cursor: pointer;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.3s;
                    padding: 0;
                    flex-shrink: 0;
                }

                .bb-bookmark-item .bb-pin-btn:hover {
                    background: #fff;
                    border-color: #667eea;
                    transform: scale(1.1);
                }

                .bb-bookmark-item.pinned .bb-pin-btn {
                    border-color: #ffd700;
                    background: #fffef0;
                }

                .bb-bookmark-item-icon {
                    width: 32px;
                    height: 32px;
                    border-radius: 6px;
                    flex-shrink: 0;
                    object-fit: cover;
                }

                .bb-bookmark-item-info {
                    flex: 1;
                    min-width: 0;
                }

                .bb-bookmark-item-title {
                    font-size: 15px;
                    font-weight: 600;
                    color: #333;
                    margin-bottom: 4px;
                }

                .bb-bookmark-item-url {
                    font-size: 12px;
                    color: #999;
                    word-break: break-all;
                }


                /* 高亮搜索关键词 */
                .bb-highlight {
                    background: #fff3cd;
                    padding: 2px 4px;
                    border-radius: 3px;
                }

                /* 添加书签对话框 */
                .bb-dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000000;
                }

                .bb-dialog {
                    background: white;
                    border-radius: 8px;
                    padding: 24px;
                    min-width: 400px;
                    max-width: 500px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                }

                .bb-dialog h3 {
                    margin: 0 0 20px 0;
                    font-size: 20px;
                    color: #333;
                }

                .bb-dialog-form-group {
                    margin-bottom: 16px;
                }

                .bb-dialog-form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                }

                .bb-dialog-form-group input,
                .bb-dialog-form-group select {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                }

                .bb-dialog-form-group input:focus,
                .bb-dialog-form-group select:focus {
                    outline: none;
                    border-color: #667eea;
                }

                .bb-dialog-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }

                .bb-dialog-actions button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background 0.2s;
                }

                .bb-dialog-actions .bb-btn-cancel {
                    background: #f0f0f0;
                    color: #333;
                }

                .bb-dialog-actions .bb-btn-cancel:hover {
                    background: #e0e0e0;
                }

                .bb-dialog-actions .bb-btn-confirm {
                    background: #667eea;
                    color: white;
                }

                .bb-dialog-actions .bb-btn-confirm:hover {
                    background: #5568d3;
                }

                .bb-dialog-actions button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .bb-icon-preview {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: 8px;
                    padding: 12px;
                    background: #f5f5f5;
                    border-radius: 6px;
                }

                .bb-icon-preview img {
                    width: 48px;
                    height: 48px;
                    border-radius: 6px;
                    object-fit: cover;
                    border: 2px solid #e0e0e0;
                }

                .bb-icon-preview-text {
                    font-size: 12px;
                    color: #666;
                }
            `;
            this.shadowRoot.appendChild(style);
        }

        bindEvents() {
            // 添加当前页面按钮
            this.shadowRoot.getElementById('bb-add-current-btn').addEventListener('click', () => {
                this.showAddCurrentPageDialog();
            });

            // 手动添加书签按钮
            this.shadowRoot.getElementById('bb-add-manual-btn').addEventListener('click', () => {
                this.showAddManualDialog();
            });

            // 导入按钮
            this.shadowRoot.getElementById('bb-import-btn').addEventListener('click', () => {
                this.shadowRoot.getElementById('bb-file-input').click();
            });

            // 空状态的导入按钮（初始状态）
            const emptyImportBtn = this.shadowRoot.getElementById('bb-empty-import-btn-initial');
            if (emptyImportBtn) {
                emptyImportBtn.addEventListener('click', () => {
                    this.shadowRoot.getElementById('bb-file-input').click();
                });
            }

            // 文件选择
            this.shadowRoot.getElementById('bb-file-input').addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.importBookmarks(file);
                    // 清空文件输入，以便可以重复选择同一个文件
                    e.target.value = '';
                }
            });

            // 导出按钮
            this.shadowRoot.getElementById('bb-export-btn').addEventListener('click', () => {
                this.exportBookmarks();
            });

            // 搜索
            this.shadowRoot.getElementById('bb-search-input').addEventListener('input', (e) => {
                this.searchQuery = e.target.value.toLowerCase();
                this.filterBookmarks();
            });

            // 清除搜索
            this.shadowRoot.getElementById('bb-clear-search').addEventListener('click', () => {
                this.shadowRoot.getElementById('bb-search-input').value = '';
                this.searchQuery = '';
                this.filterBookmarks();
            });

            // 视图切换
            this.shadowRoot.getElementById('bb-grid-view').addEventListener('click', () => {
                this.currentView = 'grid';
                this.updateViewButtons();
                this.renderBookmarks();
            });

            this.shadowRoot.getElementById('bb-list-view').addEventListener('click', () => {
                this.currentView = 'list';
                this.updateViewButtons();
                this.renderBookmarks();
            });

            // 批量选择模式按钮
            this.shadowRoot.getElementById('bb-batch-mode-btn').addEventListener('click', () => {
                this.toggleBatchMode();
            });

            // 批量操作按钮
            this.shadowRoot.getElementById('bb-batch-select-all').addEventListener('click', () => {
                this.selectAllBookmarks();
            });

            this.shadowRoot.getElementById('bb-batch-deselect-all').addEventListener('click', () => {
                this.deselectAllBookmarks();
            });

            this.shadowRoot.getElementById('bb-batch-pin').addEventListener('click', () => {
                if (this.selectedBookmarks.size > 0) {
                    this.batchPin();
                }
            });

            this.shadowRoot.getElementById('bb-batch-unpin').addEventListener('click', () => {
                if (this.selectedBookmarks.size > 0) {
                    this.batchUnpin();
                }
            });

            this.shadowRoot.getElementById('bb-batch-delete').addEventListener('click', () => {
                const count = this.selectedBookmarks.size;
                if (count > 0) {
                    if (confirm(`确定要删除选中的 ${count} 个书签吗？`)) {
                        const urls = Array.from(this.selectedBookmarks);
                        this.deleteBookmarks(urls);
                        this.toggleBatchMode();
                    }
                }
            });

            this.shadowRoot.getElementById('bb-batch-cancel').addEventListener('click', () => {
                this.toggleBatchMode();
            });

            // 关闭按钮
            this.shadowRoot.getElementById('bb-close-btn').addEventListener('click', () => {
                this.hide();
            });

            // 快捷键绑定
            document.addEventListener('keydown', (e) => {
                // Ctrl+B 或 Cmd+B 打开/关闭
                if ((e.ctrlKey || e.metaKey) && e.key === 'b' && !e.shiftKey) {
                    e.preventDefault();
                    this.toggle();
                }
                // Ctrl+Shift+A 或 Cmd+Shift+A 添加当前页面
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'A') {
                    e.preventDefault();
                    this.showAddCurrentPageDialog();
                }
                // Esc 关闭
                if (e.key === 'Escape' && this.isVisible) {
                    this.hide();
                }
            });

            // 点击背景关闭
            const container = document.getElementById('better-bookmarks-container');
            container.addEventListener('click', (e) => {
                // 检查点击是否在 Shadow DOM 内部
                // 如果事件路径中包含 Shadow Root，说明点击的是 Shadow DOM 内的元素，不关闭
                // 如果事件路径中不包含 Shadow Root，说明点击的是容器本身（背景），关闭
                const path = e.composedPath();
                const clickedInShadow = path.includes(this.shadowRoot);
                
                // 只有当点击的是容器本身（不在 Shadow DOM 内）时才关闭
                if (!clickedInShadow) {
                    this.hide();
                }
            });
        }

        show() {
            this.isVisible = true;
            // 每次显示时重新加载数据，确保同步最新数据
            this.loadFromStorage();
            document.getElementById('better-bookmarks-container').classList.add('visible');
            // 聚焦搜索框
            setTimeout(() => {
                this.shadowRoot.getElementById('bb-search-input').focus();
            }, 100);
        }

        hide() {
            this.isVisible = false;
            document.getElementById('better-bookmarks-container').classList.remove('visible');
        }

        toggle() {
            if (this.isVisible) {
                this.hide();
            } else {
                this.show();
            }
        }

        updateViewButtons() {
            this.shadowRoot.getElementById('bb-grid-view').classList.toggle('active', this.currentView === 'grid');
            this.shadowRoot.getElementById('bb-list-view').classList.toggle('active', this.currentView === 'list');
        }

        importBookmarks(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const html = e.target.result;
                this.parseBookmarks(html);
                // 保存到存储（使用 GM_setValue，可在所有网站间共享）
                this.saveToStorage();
                this.filterBookmarks();
            };
            reader.onerror = () => {
                alert('读取文件失败，请重试');
            };
            reader.readAsText(file);
        }

        parseBookmarks(html) {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            this.bookmarks = [];
            
            // 递归解析书签（忽略文件夹结构）
            const parseNode = (node) => {
                const children = node.querySelectorAll(':scope > DT');
                
                children.forEach(child => {
                    const h3 = child.querySelector('H3');
                    const a = child.querySelector('A');
                    
                    if (h3) {
                        // 文件夹，递归解析其内容
                        const dl = child.querySelector('DL');
                        if (dl) {
                            parseNode(dl);
                        }
                    } else if (a) {
                        // 书签
                        const href = a.getAttribute('HREF');
                        const title = a.textContent.trim();
                        const icon = a.getAttribute('ICON');
                        const addDate = a.getAttribute('ADD_DATE');
                        
                        if (href && title) {
                            this.bookmarks.push({
                                title,
                                url: href,
                                icon: icon || this.getDefaultIcon(href),
                                addDate: addDate ? parseInt(addDate) * 1000 : Date.now(),
                                pinned: false
                            });
                        }
                    }
                });
            };

            const dl = doc.querySelector('DL');
            if (dl) {
                parseNode(dl);
            }

            // 按置顶和标题排序
            this.bookmarks.sort((a, b) => {
                // 置顶的书签优先
                if (a.pinned !== b.pinned) {
                    return b.pinned ? 1 : -1;
                }
                return a.title.localeCompare(b.title);
            });
        }

        normalizeUrl(url) {
            // 规范化URL，自动添加协议
            if (!url) return url;
            
            url = url.trim();
            
            // 如果已经有协议，直接返回
            if (/^https?:\/\//i.test(url)) {
                return url;
            }
            
            // 如果以www开头或其他格式，自动添加https://
            return `https://${url}`;
        }

        getFavicon(url) {
            // 同步获取favicon URL（使用Google的favicon服务）
            try {
                const normalizedUrl = this.normalizeUrl(url);
                const urlObj = new URL(normalizedUrl);
                const domain = urlObj.hostname;
                // 使用Google的favicon服务（最可靠且快速）
                return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
            } catch {
                return 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32" fill="%23667eea"/></svg>';
            }
        }

        getDefaultIcon(url) {
            // 保持向后兼容，使用同步方法
            return this.getFavicon(url);
        }

        filterBookmarks() {
            this.filteredBookmarks = this.bookmarks.filter(bookmark => {
                // 搜索筛选
                if (this.searchQuery) {
                    const query = this.searchQuery.toLowerCase();
                    return bookmark.title.toLowerCase().includes(query) ||
                           bookmark.url.toLowerCase().includes(query);
                }

                return true;
            });

            // 对过滤后的书签进行排序：置顶优先
            this.filteredBookmarks.sort((a, b) => {
                if (a.pinned !== b.pinned) {
                    return b.pinned ? 1 : -1;
                }
                return a.title.localeCompare(b.title);
            });

            this.renderBookmarks();
        }

        highlightText(text, query) {
            if (!query) return this.escapeHtml(text);
            // 转义HTML
            const escaped = this.escapeHtml(text);
            // 转义查询字符串中的特殊字符
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(`(${escapedQuery})`, 'gi');
            return escaped.replace(regex, '<span class="bb-highlight">$1</span>');
        }

        renderBookmarks() {
            const content = this.shadowRoot.getElementById('bb-content');
            
            if (this.filteredBookmarks.length === 0) {
                content.innerHTML = `
                    <div class="bb-empty-state">
                        <p>${this.searchQuery ? '没有找到匹配的书签' : '还没有书签，请先导入书签文件、添加书签或将当前访问页面保存为书签'}</p>
                        ${!this.searchQuery ? `<button class="bb-btn bb-btn-primary" id="bb-empty-import-btn">导入书签</button>` : ''}
                    </div>
                `;
                // 绑定空状态的导入按钮事件
                if (!this.searchQuery) {
                    const emptyImportBtn = content.querySelector('#bb-empty-import-btn');
                    if (emptyImportBtn) {
                        emptyImportBtn.addEventListener('click', () => {
                            this.shadowRoot.getElementById('bb-file-input').click();
                        });
                    }
                }
                return;
            }

            let html = '';

            if (this.currentView === 'grid') {
                html += '<div class="bb-grid-view">';
                this.filteredBookmarks.forEach(bookmark => {
                    html += this.renderBookmarkCard(bookmark);
                });
                html += '</div>';
            } else {
                html += '<div class="bb-list-view">';
                this.filteredBookmarks.forEach(bookmark => {
                    html += this.renderBookmarkItem(bookmark);
                });
                html += '</div>';
            }

            content.innerHTML = html;

            // 更新批量工具栏状态
            this.updateBatchToolbar();

            // 绑定点击事件
            content.querySelectorAll('.bb-bookmark-card, .bb-bookmark-item').forEach((el) => {
                el.addEventListener('click', (e) => {
                    // 如果点击的是复选框、置顶按钮或右键菜单，不打开链接
                    if (e.target.classList.contains('bb-pin-btn') || 
                        e.target.classList.contains('bb-bookmark-checkbox') ||
                        e.target.closest('.bb-context-menu')) {
                        e.stopPropagation();
                        return;
                    }
                    // 批量模式下点击卡片选择/取消选择
                    if (this.batchMode) {
                        const url = el.getAttribute('data-url');
                        if (url) {
                            this.toggleBookmarkSelection(url);
                            this.renderBookmarks();
                        }
                        return;
                    }
                    const url = el.getAttribute('data-url');
                    if (url) {
                        window.open(url, '_blank');
                    }
                });

                // 绑定右键菜单
                el.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    const url = el.getAttribute('data-url');
                    if (url) {
                        this.showContextMenu(e, url);
                    }
                });
            });

            // 绑定复选框事件
            content.querySelectorAll('.bb-bookmark-checkbox').forEach((checkbox) => {
                checkbox.addEventListener('change', (e) => {
                    e.stopPropagation();
                    const url = checkbox.getAttribute('data-url');
                    if (url) {
                        this.toggleBookmarkSelection(url);
                        this.renderBookmarks();
                    }
                });
            });

            // 绑定置顶按钮事件
            content.querySelectorAll('.bb-pin-btn').forEach((btn) => {
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const url = btn.getAttribute('data-url');
                    this.togglePin(url);
                });
            });
        }

        renderBookmarkCard(bookmark) {
            const highlightedTitle = this.highlightText(bookmark.title, this.searchQuery);
            const highlightedUrl = this.highlightText(bookmark.url, this.searchQuery);
            const pinIcon = bookmark.pinned ? '📌' : '📍';
            const pinClass = bookmark.pinned ? 'pinned' : '';
            const isSelected = this.selectedBookmarks.has(bookmark.url);
            const checkboxHtml = this.batchMode ? `
                <input type="checkbox" class="bb-bookmark-checkbox" data-url="${this.escapeHtml(bookmark.url)}" ${isSelected ? 'checked' : ''}>
            ` : '';
            
            return `
                <div class="bb-bookmark-card ${pinClass} ${isSelected ? 'selected' : ''}" data-url="${this.escapeHtml(bookmark.url)}">
                    ${checkboxHtml}
                    <button class="bb-pin-btn" data-url="${this.escapeHtml(bookmark.url)}" title="${bookmark.pinned ? '取消置顶' : '置顶'}">${pinIcon}</button>
                    <img src="${this.escapeHtml(bookmark.icon)}" alt="" class="bb-bookmark-icon" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'48\\' height=\\'48\\'><rect width=\\'48\\' height=\\'48\\' fill=\\'%23667eea\\'/></svg>'">
                    <div class="bb-bookmark-title">${highlightedTitle}</div>
                    <div class="bb-bookmark-url">${highlightedUrl}</div>
                </div>
            `;
        }

        renderBookmarkItem(bookmark) {
            const highlightedTitle = this.highlightText(bookmark.title, this.searchQuery);
            const highlightedUrl = this.highlightText(bookmark.url, this.searchQuery);
            const pinIcon = bookmark.pinned ? '📌' : '📍';
            const pinClass = bookmark.pinned ? 'pinned' : '';
            const isSelected = this.selectedBookmarks.has(bookmark.url);
            const checkboxHtml = this.batchMode ? `
                <input type="checkbox" class="bb-bookmark-checkbox" data-url="${this.escapeHtml(bookmark.url)}" ${isSelected ? 'checked' : ''}>
            ` : '';
            
            return `
                <div class="bb-bookmark-item ${pinClass} ${isSelected ? 'selected' : ''}" data-url="${this.escapeHtml(bookmark.url)}">
                    ${checkboxHtml}
                    <button class="bb-pin-btn" data-url="${this.escapeHtml(bookmark.url)}" title="${bookmark.pinned ? '取消置顶' : '置顶'}">${pinIcon}</button>
                    <img src="${this.escapeHtml(bookmark.icon)}" alt="" class="bb-bookmark-item-icon" onerror="this.src='data:image/svg+xml,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'32\\' height=\\'32\\'><rect width=\\'32\\' height=\\'32\\' fill=\\'%23667eea\\'/></svg>'">
                    <div class="bb-bookmark-item-info">
                        <div class="bb-bookmark-item-title">${highlightedTitle}</div>
                        <div class="bb-bookmark-item-url">${highlightedUrl}</div>
                    </div>
                </div>
            `;
        }

        togglePin(url) {
            const bookmark = this.bookmarks.find(b => b.url === url);
            if (bookmark) {
                bookmark.pinned = !bookmark.pinned;
                this.saveToStorage();
                this.filterBookmarks();
            }
        }

        deleteBookmark(url) {
            const index = this.bookmarks.findIndex(b => b.url === url);
            if (index !== -1) {
                // 从内存中删除
                this.bookmarks.splice(index, 1);
                this.selectedBookmarks.delete(url);
                // 使用油猴 API 保存到存储
                try {
                    if (this.bookmarks && this.bookmarks.length > 0) {
                        GM_setValue('better-bookmarks', JSON.stringify(this.bookmarks));
                    } else {
                        GM_setValue('better-bookmarks', JSON.stringify([]));
                    }
                } catch (e) {
                    console.error('删除书签失败:', e);
                    alert('删除书签失败: ' + e.message);
                    return;
                }
                this.filterBookmarks();
            }
        }

        deleteBookmarks(urls) {
            // 从内存中批量删除
            urls.forEach(url => {
                const index = this.bookmarks.findIndex(b => b.url === url);
                if (index !== -1) {
                    this.bookmarks.splice(index, 1);
                }
                this.selectedBookmarks.delete(url);
            });
            // 使用油猴 API 保存到存储
            try {
                if (this.bookmarks && this.bookmarks.length > 0) {
                    GM_setValue('better-bookmarks', JSON.stringify(this.bookmarks));
                } else {
                    GM_setValue('better-bookmarks', JSON.stringify([]));
                }
            } catch (e) {
                console.error('批量删除书签失败:', e);
                alert('批量删除书签失败: ' + e.message);
                return;
            }
            this.filterBookmarks();
        }

        toggleBookmarkSelection(url) {
            if (this.selectedBookmarks.has(url)) {
                this.selectedBookmarks.delete(url);
            } else {
                this.selectedBookmarks.add(url);
            }
            this.updateBatchToolbar();
        }

        selectAllBookmarks() {
            this.filteredBookmarks.forEach(bookmark => {
                this.selectedBookmarks.add(bookmark.url);
            });
            this.updateBatchToolbar();
            this.renderBookmarks();
        }

        deselectAllBookmarks() {
            this.selectedBookmarks.clear();
            this.updateBatchToolbar();
            this.renderBookmarks();
        }

        toggleBatchMode() {
            this.batchMode = !this.batchMode;
            if (!this.batchMode) {
                this.selectedBookmarks.clear();
            }
            this.updateBatchToolbar();
            this.renderBookmarks();
        }

        batchPin() {
            const urls = Array.from(this.selectedBookmarks);
            urls.forEach(url => {
                const bookmark = this.bookmarks.find(b => b.url === url);
                if (bookmark && !bookmark.pinned) {
                    bookmark.pinned = true;
                }
            });
            this.saveToStorage();
            this.filterBookmarks();
            this.selectedBookmarks.clear();
            this.updateBatchToolbar();
        }

        batchUnpin() {
            const urls = Array.from(this.selectedBookmarks);
            urls.forEach(url => {
                const bookmark = this.bookmarks.find(b => b.url === url);
                if (bookmark && bookmark.pinned) {
                    bookmark.pinned = false;
                }
            });
            this.saveToStorage();
            this.filterBookmarks();
            this.selectedBookmarks.clear();
            this.updateBatchToolbar();
        }

        showContextMenu(e, url) {
            // 移除已存在的右键菜单
            const existingMenu = this.shadowRoot.querySelector('.bb-context-menu');
            if (existingMenu) {
                existingMenu.remove();
            }

            const bookmark = this.bookmarks.find(b => b.url === url);
            if (!bookmark) return;

            // 获取容器位置
            const container = this.shadowRoot.querySelector('.bb-wrapper');
            const rect = container.getBoundingClientRect();
            
            const menu = document.createElement('div');
            menu.className = 'bb-context-menu';
            menu.style.position = 'absolute';
            menu.style.left = `${e.clientX - rect.left}px`;
            menu.style.top = `${e.clientY - rect.top}px`;
            menu.style.zIndex = '1000001';

            menu.innerHTML = `
                <div class="bb-context-menu-item" data-action="pin">${bookmark.pinned ? '取消置顶' : '置顶'}</div>
                <div class="bb-context-menu-item" data-action="edit">编辑</div>
                <div class="bb-context-menu-item bb-context-menu-danger" data-action="delete">删除</div>
            `;

            container.appendChild(menu);

            // 绑定菜单项点击事件
            menu.querySelectorAll('.bb-context-menu-item').forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const action = item.getAttribute('data-action');
                    this.handleContextMenuAction(action, url);
                    menu.remove();
                });
            });

            // 点击其他地方关闭菜单
            const closeMenu = (e) => {
                const path = e.composedPath ? e.composedPath() : [];
                if (!path.includes(menu)) {
                    menu.remove();
                    document.removeEventListener('click', closeMenu);
                }
            };
            setTimeout(() => {
                document.addEventListener('click', closeMenu);
            }, 100);
        }

        handleContextMenuAction(action, url) {
            switch (action) {
                case 'pin':
                    this.togglePin(url);
                    break;
                case 'edit':
                    const bookmark = this.bookmarks.find(b => b.url === url);
                    if (bookmark) {
                        this.showEditBookmarkDialog(bookmark);
                    }
                    break;
                case 'delete':
                    if (confirm('确定要删除这个书签吗？')) {
                        this.deleteBookmark(url);
                    }
                    break;
            }
        }

        updateBatchToolbar() {
            const batchControls = this.shadowRoot.getElementById('bb-batch-controls');
            const batchModeBtn = this.shadowRoot.getElementById('bb-batch-mode-btn');
            const selectedCount = this.shadowRoot.getElementById('bb-selected-count');

            if (this.batchMode) {
                batchControls.style.display = 'flex';
                batchModeBtn.textContent = '取消批量';
                const count = this.selectedBookmarks.size;
                selectedCount.textContent = `已选择 ${count} 项`;
            } else {
                batchControls.style.display = 'none';
                batchModeBtn.textContent = '批量选择';
            }
        }

        showAddCurrentPageDialog() {
            // 获取当前页面信息
            const currentUrl = window.location.href;
            const currentTitle = document.title || currentUrl;
            
            // 检查是否已存在
            const existingBookmark = this.bookmarks.find(b => b.url === currentUrl);
            if (existingBookmark) {
                if (confirm(`该页面已存在于书签中：\n${existingBookmark.title}\n\n是否要更新它？`)) {
                    this.showEditBookmarkDialog(existingBookmark);
                }
                return;
            }

            // 创建对话框（在 Shadow DOM 中）
            const overlay = document.createElement('div');
            overlay.className = 'bb-dialog-overlay';
            const overlayStyle = document.createElement('style');
            overlayStyle.textContent = `
                .bb-dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000000;
                }
                .bb-dialog {
                    background: white;
                    border-radius: 8px;
                    padding: 24px;
                    min-width: 400px;
                    max-width: 500px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                }
                .bb-dialog h3 {
                    margin: 0 0 20px 0;
                    font-size: 20px;
                    color: #333;
                }
                .bb-dialog-form-group {
                    margin-bottom: 16px;
                }
                .bb-dialog-form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                }
                .bb-dialog-form-group input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                .bb-dialog-form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                .bb-dialog-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }
                .bb-dialog-actions button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .bb-dialog-actions .bb-btn-cancel {
                    background: #f0f0f0;
                    color: #333;
                }
                .bb-dialog-actions .bb-btn-cancel:hover {
                    background: #e0e0e0;
                }
                .bb-dialog-actions .bb-btn-confirm {
                    background: #667eea;
                    color: white;
                }
                .bb-dialog-actions .bb-btn-confirm:hover {
                    background: #5568d3;
                }
            `;
            overlay.appendChild(overlayStyle);
            const dialog = document.createElement('div');
            dialog.className = 'bb-dialog';
            dialog.innerHTML = `
                <h3>添加当前页面</h3>
                <div class="bb-dialog-form-group">
                    <label>标题</label>
                    <input type="text" id="bb-dialog-title" value="${this.escapeHtml(currentTitle)}" />
                </div>
                <div class="bb-dialog-form-group">
                    <label>URL</label>
                    <input type="text" id="bb-dialog-url" value="${this.escapeHtml(currentUrl)}" readonly style="background: #f5f5f5;" />
                </div>
                <div class="bb-dialog-actions">
                    <button class="bb-btn-cancel" id="bb-dialog-cancel">取消</button>
                    <button class="bb-btn-confirm" id="bb-dialog-confirm">添加</button>
                </div>
            `;
            overlay.appendChild(dialog);

            document.body.appendChild(overlay);

            // 绑定事件
            const cancelBtn = overlay.querySelector('#bb-dialog-cancel');
            const confirmBtn = overlay.querySelector('#bb-dialog-confirm');
            const titleInput = overlay.querySelector('#bb-dialog-title');

            const closeDialog = () => {
                document.body.removeChild(overlay);
            };

            cancelBtn.addEventListener('click', closeDialog);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeDialog();
                }
            });

            confirmBtn.addEventListener('click', () => {
                const title = titleInput.value.trim();
                let url = overlay.querySelector('#bb-dialog-url').value.trim();

                if (!title) {
                    alert('请输入标题');
                    return;
                }

                if (!url) {
                    alert('URL不能为空');
                    return;
                }

                // 规范化URL（自动添加https://）
                url = this.normalizeUrl(url);

                // 验证URL格式
                try {
                    new URL(url);
                } catch {
                    alert('请输入有效的URL（例如：example.com 或 www.example.com）');
                    return;
                }

                this.addBookmark(title, url);
                closeDialog();
            });

            // 按Enter确认
            titleInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    confirmBtn.click();
                }
            });

            // 聚焦到标题输入框
            setTimeout(() => titleInput.focus(), 100);
        }

        showAddManualDialog() {
            // 创建对话框
            const overlay = document.createElement('div');
            overlay.className = 'bb-dialog-overlay';
            const overlayStyle = document.createElement('style');
            overlayStyle.textContent = `
                .bb-dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000000;
                }
                .bb-dialog {
                    background: white;
                    border-radius: 8px;
                    padding: 24px;
                    min-width: 400px;
                    max-width: 500px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                }
                .bb-dialog h3 {
                    margin: 0 0 20px 0;
                    font-size: 20px;
                    color: #333;
                }
                .bb-dialog-form-group {
                    margin-bottom: 16px;
                }
                .bb-dialog-form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                }
                .bb-dialog-form-group input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                .bb-dialog-form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                .bb-dialog-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }
                .bb-dialog-actions button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .bb-dialog-actions .bb-btn-cancel {
                    background: #f0f0f0;
                    color: #333;
                }
                .bb-dialog-actions .bb-btn-cancel:hover {
                    background: #e0e0e0;
                }
                .bb-dialog-actions .bb-btn-confirm {
                    background: #667eea;
                    color: white;
                }
                .bb-dialog-actions .bb-btn-confirm:hover {
                    background: #5568d3;
                }
                .bb-dialog-actions button:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }
                .bb-icon-preview {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-top: 8px;
                    padding: 12px;
                    background: #f5f5f5;
                    border-radius: 6px;
                }
                .bb-icon-preview img {
                    width: 48px;
                    height: 48px;
                    border-radius: 6px;
                    object-fit: cover;
                    border: 2px solid #e0e0e0;
                }
                .bb-icon-preview-text {
                    font-size: 12px;
                    color: #666;
                }
            `;
            overlay.appendChild(overlayStyle);
            const dialog = document.createElement('div');
            dialog.className = 'bb-dialog';
            dialog.innerHTML = `
                <h3>手动添加书签</h3>
                <div class="bb-dialog-form-group">
                    <label>标题</label>
                    <input type="text" id="bb-manual-dialog-title" placeholder="输入书签标题" />
                </div>
                <div class="bb-dialog-form-group">
                    <label>URL</label>
                    <input type="text" id="bb-manual-dialog-url" placeholder="https://example.com" />
                    <div class="bb-icon-preview" id="bb-icon-preview" style="display: none;">
                        <img id="bb-icon-preview-img" src="" alt="Icon" />
                        <div class="bb-icon-preview-text">网站图标预览</div>
                    </div>
                </div>
                <div class="bb-dialog-actions">
                    <button class="bb-btn-cancel" id="bb-manual-dialog-cancel">取消</button>
                    <button class="bb-btn-confirm" id="bb-manual-dialog-confirm">添加</button>
                </div>
            `;
            overlay.appendChild(dialog);

            document.body.appendChild(overlay);

            // 绑定事件
            const cancelBtn = overlay.querySelector('#bb-manual-dialog-cancel');
            const confirmBtn = overlay.querySelector('#bb-manual-dialog-confirm');
            const titleInput = overlay.querySelector('#bb-manual-dialog-title');
            const urlInput = overlay.querySelector('#bb-manual-dialog-url');
            const iconPreview = overlay.querySelector('#bb-icon-preview');
            const iconPreviewImg = overlay.querySelector('#bb-icon-preview-img');

            // URL输入时自动获取并预览icon
            let iconUpdateTimeout;
            urlInput.addEventListener('input', () => {
                clearTimeout(iconUpdateTimeout);
                let url = urlInput.value.trim();
                
                if (!url) {
                    iconPreview.style.display = 'none';
                    return;
                }

                // 规范化URL（自动添加https://）
                url = this.normalizeUrl(url);

                // 验证URL格式
                try {
                    new URL(url);
                } catch {
                    iconPreview.style.display = 'none';
                    return;
                }

                // 延迟更新，避免频繁请求
                iconUpdateTimeout = setTimeout(() => {
                    const icon = this.getFavicon(url);
                    iconPreviewImg.src = icon;
                    iconPreviewImg.onerror = () => {
                        iconPreviewImg.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48"><rect width="48" height="48" fill="%23667eea"/></svg>';
                    };
                    iconPreview.style.display = 'flex';
                }, 500);
            });

            const closeDialog = () => {
                document.body.removeChild(overlay);
            };

            cancelBtn.addEventListener('click', closeDialog);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeDialog();
                }
            });

            confirmBtn.addEventListener('click', async () => {
                const title = titleInput.value.trim();
                let url = urlInput.value.trim();

                if (!title) {
                    alert('请输入标题');
                    return;
                }

                if (!url) {
                    alert('URL不能为空');
                    return;
                }

                // 规范化URL（自动添加https://）
                url = this.normalizeUrl(url);

                // 验证URL格式
                try {
                    new URL(url);
                } catch {
                    alert('请输入有效的URL（例如：example.com 或 www.example.com）');
                    return;
                }

                // 检查是否已存在
                const existingBookmark = this.bookmarks.find(b => b.url === url);
                if (existingBookmark) {
                    if (!confirm(`该URL已存在于书签中：\n${existingBookmark.title}\n\n是否要更新它？`)) {
                        return;
                    }
                }

                this.addBookmark(title, url);
                closeDialog();
            });

            // 按Enter确认
            urlInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    confirmBtn.click();
                }
            });

            titleInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    urlInput.focus();
                }
            });

            // 聚焦到标题输入框
            setTimeout(() => titleInput.focus(), 100);
        }

        showEditBookmarkDialog(bookmark) {
            // 创建对话框（在 Shadow DOM 中）
            const overlay = document.createElement('div');
            overlay.className = 'bb-dialog-overlay';
            const overlayStyle = document.createElement('style');
            overlayStyle.textContent = `
                .bb-dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000000;
                }
                .bb-dialog {
                    background: white;
                    border-radius: 8px;
                    padding: 24px;
                    min-width: 400px;
                    max-width: 500px;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                }
                .bb-dialog h3 {
                    margin: 0 0 20px 0;
                    font-size: 20px;
                    color: #333;
                }
                .bb-dialog-form-group {
                    margin-bottom: 16px;
                }
                .bb-dialog-form-group label {
                    display: block;
                    margin-bottom: 6px;
                    font-size: 14px;
                    color: #666;
                    font-weight: 500;
                }
                .bb-dialog-form-group input {
                    width: 100%;
                    padding: 8px 12px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    box-sizing: border-box;
                }
                .bb-dialog-form-group input:focus {
                    outline: none;
                    border-color: #667eea;
                }
                .bb-dialog-actions {
                    display: flex;
                    justify-content: flex-end;
                    gap: 10px;
                    margin-top: 20px;
                }
                .bb-dialog-actions button {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 4px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background 0.2s;
                }
                .bb-dialog-actions .bb-btn-cancel {
                    background: #f0f0f0;
                    color: #333;
                }
                .bb-dialog-actions .bb-btn-cancel:hover {
                    background: #e0e0e0;
                }
                .bb-dialog-actions .bb-btn-confirm {
                    background: #667eea;
                    color: white;
                }
                .bb-dialog-actions .bb-btn-confirm:hover {
                    background: #5568d3;
                }
            `;
            overlay.appendChild(overlayStyle);
            const dialog = document.createElement('div');
            dialog.className = 'bb-dialog';
            dialog.innerHTML = `
                <h3>编辑书签</h3>
                <div class="bb-dialog-form-group">
                    <label>标题</label>
                    <input type="text" id="bb-dialog-title" value="${this.escapeHtml(bookmark.title)}" />
                </div>
                <div class="bb-dialog-form-group">
                    <label>URL</label>
                    <input type="text" id="bb-dialog-url" value="${this.escapeHtml(bookmark.url)}" />
                </div>
                <div class="bb-dialog-actions">
                    <button class="bb-btn-cancel" id="bb-dialog-cancel">取消</button>
                    <button class="bb-btn-confirm" id="bb-dialog-confirm">保存</button>
                </div>
            `;
            overlay.appendChild(dialog);

            document.body.appendChild(overlay);

            // 绑定事件
            const cancelBtn = overlay.querySelector('#bb-dialog-cancel');
            const confirmBtn = overlay.querySelector('#bb-dialog-confirm');
            const titleInput = overlay.querySelector('#bb-dialog-title');
            const urlInput = overlay.querySelector('#bb-dialog-url');

            const closeDialog = () => {
                document.body.removeChild(overlay);
            };

            cancelBtn.addEventListener('click', closeDialog);
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    closeDialog();
                }
            });

            confirmBtn.addEventListener('click', () => {
                const title = titleInput.value.trim();
                let url = urlInput.value.trim();

                if (!title) {
                    alert('请输入标题');
                    return;
                }

                if (!url) {
                    alert('URL不能为空');
                    return;
                }

                // 规范化URL（自动添加https://）
                url = this.normalizeUrl(url);

                // 验证URL格式
                try {
                    new URL(url);
                } catch {
                    alert('请输入有效的URL（例如：example.com 或 www.example.com）');
                    return;
                }

                bookmark.title = title;
                bookmark.url = url;
                bookmark.icon = this.getFavicon(url);

                this.saveToStorage();
                this.filterBookmarks();
                closeDialog();
            });

            // 聚焦到标题输入框
            setTimeout(() => titleInput.focus(), 100);
        }

        addBookmark(title, url) {
            // 检查是否已存在相同的URL
            const existingIndex = this.bookmarks.findIndex(b => b.url === url);
            const icon = this.getFavicon(url);
            
            if (existingIndex !== -1) {
                // 如果已存在，更新它
                this.bookmarks[existingIndex].title = title;
                this.bookmarks[existingIndex].icon = icon;
            } else {
                // 添加新书签
                this.bookmarks.push({
                    title: title.trim(),
                    url: url.trim(),
                    icon: icon,
                    addDate: Date.now(),
                    pinned: false
                });
            }

            // 保存并更新显示
            this.saveToStorage();
            this.filterBookmarks();
        }

        addCurrentPage(title, url) {
            // 保持向后兼容
            this.addBookmark(title, url);
        }

        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }

        saveToStorage() {
            try {
                if (this.bookmarks && this.bookmarks.length > 0) {
                    GM_setValue('better-bookmarks', JSON.stringify(this.bookmarks));
                } else {
                    // 如果书签为空，也保存空数组，以便下次加载时知道已经初始化过
                    GM_setValue('better-bookmarks', JSON.stringify([]));
                }
            } catch (e) {
                console.error('保存书签失败:', e);
                alert('保存书签失败: ' + e.message);
            }
        }

        setupAutoSave() {
            // 页面关闭前保存
            window.addEventListener('beforeunload', () => {
                this.saveToStorage();
            });
            
            // 页面隐藏时保存（切换标签页等）
            document.addEventListener('visibilitychange', () => {
                if (document.hidden) {
                    this.saveToStorage();
                }
            });
        }

        setupStorageListener() {
            // 监听存储变化，实现跨标签页实时同步
            try {
                if (typeof GM_addValueChangeListener !== 'undefined') {
                    this.storageListener = GM_addValueChangeListener('better-bookmarks', (name, oldValue, newValue, remote) => {
                        // remote 为 true 表示变化来自其他标签页
                        if (remote) {
                            // 重新加载数据
                            this.loadFromStorage();
                            // 如果界面是打开的，刷新显示
                            if (this.isVisible) {
                                this.filterBookmarks();
                            }
                        }
                    });
                }
            } catch (e) {
                console.warn('无法设置存储监听器:', e);
                // 如果不支持监听器，至少每次显示时重新加载数据（已在 show() 方法中实现）
            }
        }

        loadFromStorage() {
            try {
                // 先尝试从 GM_getValue 加载
                let stored = GM_getValue('better-bookmarks', null);
                
                // 如果 GM_getValue 没有数据，尝试从 localStorage 迁移（兼容旧数据）
                if (!stored) {
                    const oldStored = localStorage.getItem('better-bookmarks');
                    if (oldStored) {
                        stored = oldStored;
                        // 迁移到 GM_setValue
                        GM_setValue('better-bookmarks', oldStored);
                        // 清理旧的 localStorage 数据
                        try {
                            localStorage.removeItem('better-bookmarks');
                        } catch (e) {
                            // 忽略清理错误
                        }
                    }
                }
                
                if (stored) {
                    this.bookmarks = JSON.parse(stored);
                    // 确保所有书签都有 pinned 属性，并移除旧的 folder 属性
                    this.bookmarks.forEach(bookmark => {
                        if (bookmark.pinned === undefined) {
                            bookmark.pinned = false;
                        }
                        // 移除 folder 属性（如果存在）
                        if (bookmark.folder !== undefined) {
                            delete bookmark.folder;
                        }
                    });
                    // 保存清理后的数据
                    this.saveToStorage();
                    this.filterBookmarks();
                }
            } catch (e) {
                console.error('加载书签失败:', e);
            }
        }

        exportBookmarks() {
            // 生成Netscape格式的书签HTML
            let html = `<!DOCTYPE NETSCAPE-Bookmark-file-1>
<!-- This is an automatically generated file.
     It is created by 更好的书签 -->
<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">
<TITLE>Bookmarks</TITLE>
<H1>Bookmarks</H1>
<DL><p>`;

            // 生成HTML（所有书签放在一个文件夹中）
            html += `    <DT><H3>收藏夹</H3>\n    <DL><p>\n`;
            this.bookmarks.forEach(bookmark => {
                const date = Math.floor(bookmark.addDate / 1000);
                const url = this.escapeHtml(bookmark.url);
                const icon = this.escapeHtml(bookmark.icon || '');
                const title = this.escapeHtml(bookmark.title);
                html += `        <DT><A HREF="${url}" ADD_DATE="${date}" ICON="${icon}">${title}</A>\n`;
            });
            html += `    </DL><p>\n`;

            html += `</DL><p>`;

            // 下载文件
            const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `bookmarks_${new Date().toISOString().split('T')[0]}.html`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    // 注册油猴菜单命令 - 显示快捷键提示
    GM_registerMenuCommand('快捷键说明', () => {
        const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
        const ctrlKey = isMac ? 'Cmd' : 'Ctrl';
        
        const shortcuts = [
            `${ctrlKey} + B：打开/关闭书签界面`,
            `${ctrlKey} + Shift + A：添加当前页面到书签`,
            `Esc：关闭书签界面`
        ];
        
        alert('快捷键说明：\n\n' + shortcuts.join('\n'));
    });

    // 等待DOM加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            new BookmarkManager();
        });
    } else {
        new BookmarkManager();
    }

})();

