// ==UserScript==
// @license MIT
// @name         NexusMailPurge - PT网站邮箱批量删除插件
// @namespace    https://github.com/0x1st/NexusMailPurge
// @version      1.0.1
// @description  专为 NexusPHP PT网站设计的邮箱批量删除插件，支持翻页操作
// @author       1st.
// @match        *://*/messages.php*
// @match        *://*/message.php*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555822/NexusMailPurge%20-%20PT%E7%BD%91%E7%AB%99%E9%82%AE%E7%AE%B1%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/555822/NexusMailPurge%20-%20PT%E7%BD%91%E7%AB%99%E9%82%AE%E7%AE%B1%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 简化的选择器管理器 - 专注于邮件内容区域
    class SelectorManager {
        static findSelectAllButton() {
            const buttons = document.querySelectorAll('input[type="button"], input[type="submit"], button');
            
            // 查找全选按钮
            for (let i = 0; i < buttons.length; i++) {
                const button = buttons[i];
                
                // 检查是否是全选按钮
                if (this.isSelectAllButton(button)) {
                    return button;
                }
            }
            
            return null;
        }

        // 判断是否是全选按钮
        static isSelectAllButton(button) {
            const value = (button.value || '').toLowerCase();
            const onclick = button.getAttribute('onclick') || '';
            
            // 排除明显不是全选按钮的元素
            if (button.name === 'id[]') {
                return false;
            }
            
            // 检查按钮文本
            if (value.includes('全选') || value.includes('select all')) {
                return true;
            }
            
            // 检查onclick属性
            if (onclick.includes('checkall') || onclick.includes('CheckAll') || 
                onclick.includes('selectall') || onclick.includes('SelectAll')) {
                return true;
            }
            
            // 检查特定的onclick模式
            if (onclick.includes('check(') && onclick.includes('true')) {
                return true;
            }
            
            return false;
        }

        // 手动选择所有邮件项目
        static manualSelectAll() {
            const checkboxes = SelectorValidator.safeQuerySelectorAll(CONFIG.SELECTORS.mailCheckbox);
            let selectedCount = 0;
            
            checkboxes.forEach(checkbox => {
                if (!checkbox.checked) {
                    checkbox.checked = true;
                    selectedCount++;
                    // 触发change事件
                    checkbox.dispatchEvent(new Event('change', { bubbles: true }));
                }
            });
            
            return selectedCount;
        }

        // 验证全选操作是否生效
        static validateSelectAllOperation(selectAllButton) {
            const mailCheckboxes = SelectorValidator.safeQuerySelectorAll(CONFIG.SELECTORS.mailCheckbox);
            
            if (mailCheckboxes.length === 0) {
                return false;
            }
            
            // 检查选中状态
            const checkedCount = Array.from(mailCheckboxes).filter(cb => cb.checked).length;
            
            return checkedCount > 0;
        }

        // 执行全选操作
        static performSelectAll() {
            const selectAllButton = SelectorManager.findSelectAllButton();
            if (selectAllButton) {
                selectAllButton.click();
                
                // 等待一下让页面响应
                setTimeout(() => {
                    // 验证全选操作是否生效
                    const isValid = SelectorManager.validateSelectAllOperation(selectAllButton);
                    
                    if (!isValid) {
                        SelectorManager.manualSelectAll();
                    }
                }, 100);
            } else {
                SelectorManager.manualSelectAll();
            }
        }
    }

    // 跨页面状态管理器
    class StateManager {
        static STORAGE_KEYS = {
            BATCH_DELETE_STATE: 'nmp_batch_delete_state',
            DELETE_PROGRESS: 'nmp_delete_progress',
        };

        // 保存批量删除状态
        static saveBatchDeleteState(state) {
            try {
                const stateData = {
                    ...state,
                    timestamp: Date.now(),
                    url: window.location.href
                };
                GM_setValue(this.STORAGE_KEYS.BATCH_DELETE_STATE, JSON.stringify(stateData));
            } catch (error) {
                // 静默处理错误
            }
        }

        // 获取批量删除状态
        static getBatchDeleteState() {
            try {
                const stateStr = GM_getValue(this.STORAGE_KEYS.BATCH_DELETE_STATE, null);
                if (!stateStr) return null;
                
                const state = JSON.parse(stateStr);
                return state;
            } catch (error) {
                // 静默处理错误
                return null;
            }
        }

        // 清除批量删除状态
        static clearBatchDeleteState() {
            try {
                GM_deleteValue(this.STORAGE_KEYS.BATCH_DELETE_STATE);
                GM_deleteValue(this.STORAGE_KEYS.DELETE_PROGRESS);
            } catch (error) {
                // 静默处理错误
            }
        }


        // 获取删除进度
        static getDeleteProgress() {
            try {
                const progressStr = GM_getValue(this.STORAGE_KEYS.DELETE_PROGRESS, null);
                if (!progressStr) return null;
                
                const progress = JSON.parse(progressStr);
                return progress;
            } catch (error) {
                return null;
            }
        }

        // 检查是否有未完成的批量删除操作
        static hasUnfinishedBatchDelete() {
            const state = this.getBatchDeleteState();
            return state && state.status === 'running';
        }

        // 更新批量删除进度
        static updateBatchDeleteProgress(currentPage, totalPages, deletedPages, errors = []) {
            const progress = {
                currentPage,
                totalPages,
                deletedPages,
                errors,
                status: 'running',
                timestamp: Date.now()
            };
            
            try {
                GM_setValue(this.STORAGE_KEYS.DELETE_PROGRESS, JSON.stringify(progress));
            } catch (error) {
                // 静默处理错误
            }
        }
    }

    // 配置常量
    const CONFIG = {
        SELECTORS: {
            deleteButton: 'input[type="submit"][name="delete"], input[type="submit"][value*="删除" i], input[type="submit"][value*="Delete" i]',
            mailCheckbox: 'input[type="checkbox"][name="id[]"], input[type="checkbox"][name$="[]"]',
            pageSelect: 'select[onchange="switchPage(this)"], select.px-5[onchange*="switchPage"]'
        },
        COLORS: {
            primary: '#007bff',
            danger: '#dc3545',
            success: '#28a745'
        }
    };

    

    // 选择器验证工具类
    class SelectorValidator {
        static isValidSelector(selector) {
            if (!selector || typeof selector !== 'string') {
                return false;
            }
            
            try {
                // 尝试创建一个临时元素来测试选择器
                document.createElement('div').querySelector(selector);
                return true;
            } catch (error) {
                return false;
            }
        }

        static safeQuerySelector(selector) {
            if (!this.isValidSelector(selector)) {
                return null;
            }
            
            try {
                return document.querySelector(selector);
            } catch (error) {
                return null;
            }
        }

        static safeQuerySelectorAll(selector) {
            if (!this.isValidSelector(selector)) {
                return [];
            }
            
            try {
                return document.querySelectorAll(selector);
            } catch (error) {
                return [];
            }
        }
    }



    // DOM 操作模块
    class DOMManager {
        static isMailboxPage() {
            const isMessagesPage = /message(s)?\.php/i.test(window.location.href);
            if (!isMessagesPage) {
                return false;
            }

            let selectAllBtn = null;
            try {
                selectAllBtn = SelectorManager.findSelectAllButton();
            } catch (error) {}

            const deleteBtn = SelectorValidator.safeQuerySelector(CONFIG.SELECTORS.deleteButton);
            const mailCheckbox = SelectorValidator.safeQuerySelector(CONFIG.SELECTORS.mailCheckbox);
            return !!(selectAllBtn || deleteBtn || mailCheckbox);
        }

        static getSelectAllButton() {
            // 使用智能选择器管理器
            const button = SelectorManager.findSelectAllButton();
            
            return button;
        }

        static getDeleteButton() {
            const button = SelectorValidator.safeQuerySelector(CONFIG.SELECTORS.deleteButton);
            
            return button;
        }

        static getCurrentPageNumber() {
            const urlParams = new URLSearchParams(window.location.search);
            return parseInt(urlParams.get('page')) || 1;
        }

        static getMailItems() {
            const items = SelectorValidator.safeQuerySelectorAll(CONFIG.SELECTORS.mailCheckbox);
            return Array.from(items);
        }

        static getSelectedCount() {
            const checkboxes = SelectorValidator.safeQuerySelectorAll(CONFIG.SELECTORS.mailCheckbox);
            const selected = Array.from(checkboxes).filter(cb => cb.checked);
            return selected.length;
        }

        static getTotalPages() {
            const pageSelect = SelectorValidator.safeQuerySelector(CONFIG.SELECTORS.pageSelect);
            if (pageSelect) {
                const options = pageSelect.querySelectorAll('option');
                if (options.length > 0) {
                    const lastOption = options[options.length - 1];
                    const pageNum = parseInt(lastOption.value) || parseInt(lastOption.textContent);
                    return pageNum || 1;
                }
            }
            
            // 备用方案：从页面链接获取
            const pageLinks = SelectorValidator.safeQuerySelectorAll('a[href*="page="]');
            let maxPage = 1;
            
            pageLinks.forEach(link => {
                const href = link.getAttribute('href');
                const match = href.match(/page=(\d+)/);
                if (match) {
                    maxPage = Math.max(maxPage, parseInt(match[1]));
                }
            });
            
            return maxPage;
        }
    }

    // UI 注入模块
    class UIManager {
        static injectStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .nmp-toolbar {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    border-radius: 5px;
                    padding: 10px;
                    margin: 10px 0;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                }

                .nmp-btn {
                    padding: 6px 12px;
                    border: none;
                    border-radius: 3px;
                    cursor: pointer;
                    font-size: 14px;
                    font-weight: 500;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    transition: all 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }

                .nmp-btn:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }

                .nmp-btn-primary { background: ${CONFIG.COLORS.primary}; color: white; }
                .nmp-btn-danger  { background: ${CONFIG.COLORS.danger};  color: white; }
                .nmp-btn-success { background: ${CONFIG.COLORS.success}; color: white; }

                .nmp-status {
                    font-size: 12px;
                    color: #6c757d;
                    margin-left: 10px;
                }
            `;
            document.head.appendChild(style);
        }

        static createToolbar() {
            const toolbar = document.createElement('div');
            toolbar.className = 'nmp-toolbar';
            toolbar.innerHTML = `
                <span class="nmp-logo">📧 NexusMailPurge</span>
                <button class="nmp-btn nmp-btn-success" id="nmp-delete-selected">删除选中</button>
                <button class="nmp-btn nmp-btn-danger" id="nmp-delete-current">删除当前页</button>
                <button class="nmp-btn nmp-btn-primary" id="nmp-delete-all-pages">删除所有页</button>
                <button class="nmp-btn nmp-btn-warning"   id="nmp-stop-delete">停止删除</button>
                <span class="nmp-status" id="nmp-status">就绪</span>
            `;
            return toolbar;
        }

        
    }

    // 简化的页面操作模块
    class PageOperator {
        constructor() {
            this.deleteButton = null;
        }

        init() {
            this.deleteButton = DOMManager.getDeleteButton();
        }

        selectAllCurrentPage() {
            // 使用简化的 SelectorManager 来执行全选操作
            SelectorManager.performSelectAll();
            return true;
        }

        // 验证全选是否生效
        verifySelectAll() {
            // 使用 SelectorManager 的验证方法
            const selectAllButton = SelectorManager.findSelectAllButton();
            return SelectorManager.validateSelectAllOperation(selectAllButton);
        }

        deleteCurrentPage() {
            if (this.deleteButton) {
                this.deleteButton.click();
                return true;
            }
            return false;
        }

        

        canOperate() {
            return !!this.deleteButton;
        }
    }

    // 批量删除控制器
    class BatchDeleteController {
        constructor(pageOperator) {
            this.pageOperator = pageOperator;
            this.shouldStop = false;
        }

        // 停止批量删除
        stopBatchDelete() {
            this.shouldStop = true;

            StateManager.clearBatchDeleteState();

            // 清掉自动翻页参数
            const url = new URL(window.location.href);
            url.searchParams.delete('nmp_auto');
            window.history.replaceState({}, document.title, url.toString());

            // 移除进度提示
            const progressDiv = document.getElementById('nmp-batch-progress');
            if (progressDiv) progressDiv.remove();

            const statusElement = document.getElementById('nmp-status');
            if (statusElement) statusElement.textContent = '已停止，正在刷新…';
            window.location.reload();
        }

        // 更新UI状态
        updateUIState(isDeleting) {
            const deleteAllBtn = document.getElementById('nmp-delete-all-pages');
            const deleteCurrentBtn = document.getElementById('nmp-delete-current');
            const stopBtn = document.getElementById('nmp-stop-delete');
            if (deleteAllBtn) deleteAllBtn.disabled = isDeleting;
            if (deleteCurrentBtn) deleteCurrentBtn.disabled = isDeleting;
            if (stopBtn) stopBtn.disabled = !isDeleting;
        }

        async deleteCurrentPage() {
            if (!this.pageOperator.canOperate()) {
                const statusElement = document.getElementById('nmp-status');
                if (statusElement) statusElement.textContent = '找不到全选或删除按钮';
                return;
            }

            this.performCurrentPageDelete();
        }

        async deleteSelected() {
            if (!this.pageOperator.canOperate()) {
                const statusElement = document.getElementById('nmp-status');
                if (statusElement) statusElement.textContent = '找不到删除按钮';
                return;
            }
            if (!(DOMManager.getSelectedCount() > 0)) {
                const statusElement = document.getElementById('nmp-status');
                if (statusElement) statusElement.textContent = '请先选择要删除的邮件';
                return;
            }
            this.performSelectedDelete();
        }

        async deleteAllPages() {
            this.performAllPagesDelete();
        }

        async performCurrentPageDelete() {
            try {
                // 点击全选按钮
                if (!this.pageOperator.selectAllCurrentPage()) {
                    throw new Error('无法点击全选按钮');
                }

                // 增加等待时间，确保全选操作完成
                await new Promise(resolve => setTimeout(resolve, 1000));

                // 验证全选是否生效
                if (!this.pageOperator.verifySelectAll()) {
                    // 再等待一下，有些网站可能需要更长时间
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // 点击删除按钮
                if (!this.pageOperator.deleteCurrentPage()) {
                    throw new Error('无法点击删除按钮');
                }

                // 等待删除完成后刷新页面
                setTimeout(() => {
                    window.location.reload();
                }, 3000);

            } catch (error) {
                const statusElement = document.getElementById('nmp-status');
                if (statusElement) statusElement.textContent = `删除失败: ${error.message}`;
            }
        }

        async performSelectedDelete() {
            try {
                if (!(DOMManager.getSelectedCount() > 0)) {
                    throw new Error('未选择任何邮件');
                }
                if (!this.pageOperator.deleteCurrentPage()) {
                    throw new Error('无法点击删除按钮');
                }
                setTimeout(() => {
                    window.location.reload();
                }, 3000);
            } catch (error) {
                const statusElement = document.getElementById('nmp-status');
                if (statusElement) statusElement.textContent = `删除失败: ${error.message}`;
            }
        }



        async performAllPagesDelete() {
            const totalPages = DOMManager.getTotalPages();
            const currentPage = DOMManager.getCurrentPageNumber();
            
            // 设置运行状态
            this.shouldStop = false;
            
            // 更新UI状态
            this.updateUIState(true);
            
            // 保存批量删除状态
            StateManager.saveBatchDeleteState({
                status: 'running',
                totalPages: totalPages,
                startPage: currentPage,
                operationType: 'deleteAllPages'
            });

            // 更新进度
            StateManager.updateBatchDeleteProgress(currentPage, totalPages, 0);

            // 开始删除当前页面
            await this.performSinglePageInBatch(currentPage, totalPages);
        }

        // 恢复批量删除操作
        async resumeAllPagesDelete(state, progress) {

            const currentPage = DOMManager.getCurrentPageNumber();
            const actualCurrentPages = DOMManager.getTotalPages();
            
            // 检查是否所有页面都已处理完成
            if (actualCurrentPages <= 1) {
                this.completeBatchDelete(progress);
                return;
            }

            // 继续处理当前页面
            this.performSinglePageInBatch(currentPage, state.totalPages, progress.deletedPages);
        }

        // 执行单页删除（批量删除中的一页）
        async performSinglePageInBatch(currentPage, totalPages, deletedPages = 0) {
            try {
                // 检查是否收到停止信号
                if (this.shouldStop) {
                    return;
                }
                
                const currentState = StateManager.getBatchDeleteState();
                if (!currentState || currentState.status === 'stopped') {
                    return;
                }

                

                // 点击全选按钮
                if (!this.pageOperator.selectAllCurrentPage()) {
                    throw new Error('无法点击全选按钮');
                }

                // 等待全选操作完成
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                // 验证全选是否生效
                if (!this.pageOperator.verifySelectAll()) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }

                // 点击删除按钮
                if (!this.pageOperator.deleteCurrentPage()) {
                    throw new Error('无法点击删除按钮');
                }

                // 更新进度
                const newDeletedPages = deletedPages + 1;
                StateManager.updateBatchDeleteProgress(currentPage, totalPages, newDeletedPages);

                // 等待删除完成后页面刷新
                setTimeout(() => {
                    // 重新检查当前页数
                    const actualCurrentPages = DOMManager.getTotalPages();
                    
                    if (actualCurrentPages > 1) {
                        // 跳转到第1页继续删除
                        this.navigateToPage(1, true);
                    } else {
                        // 所有页面删除完成
                        const progress = StateManager.getDeleteProgress();
                        this.completeBatchDelete(progress);
                    }
                }, 3000);

            } catch (error) {
                // 更新错误状态
                const progress = StateManager.getDeleteProgress() || {};
                const errors = progress.errors || [];
                errors.push({
                    page: currentPage,
                    error: error.message,
                    timestamp: Date.now()
                });
                
                StateManager.updateBatchDeleteProgress(currentPage, totalPages, deletedPages, errors);
                
                // 继续下一页
                if (currentPage < totalPages) {
                    setTimeout(() => {
                        this.navigateToPage(currentPage + 1);
                    }, 2000);
                } else {
                    const finalProgress = StateManager.getDeleteProgress();
                    this.completeBatchDelete(finalProgress);
                }
            }
        }

        // 跳转到指定页面
        navigateToPage(pageNumber, autoMode = false) {
            const url = new URL(window.location.href);
            url.searchParams.set('page', pageNumber);
            
            if (autoMode) {
                url.searchParams.set('nmp_auto', '1');
            }
            
            window.location.href = url.toString();
        }

        

        // 完成批量删除
        completeBatchDelete(progress) {
            // 清除状态
            StateManager.clearBatchDeleteState();
            
            // 移除进度提示
            
            
            const errors = progress.errors || [];
            const successCount = progress.deletedPages || 0;
            const errorCount = errors.length;
            const statusElement = document.getElementById('nmp-status');
            if (statusElement) statusElement.textContent = `批量删除完成 成功 ${successCount} 页 失败 ${errorCount} 页`;
            setTimeout(() => { window.location.reload(); }, 2000);
        }




    }

    // 主应用类
    class NexusMailPurge {
        constructor() {
            this.pageOperator = new PageOperator();
            this.batchDeleteController = new BatchDeleteController(this.pageOperator);
        }

        init() {
            if (!DOMManager.isMailboxPage()) {
                return;
            }

            window.nexusMailPurge = this;

            // 检查是否有未完成的批量删除操作
            this.checkAndResumeUnfinishedOperation();

            // 注入样式
            UIManager.injectStyles();

            // 等待页面加载完成
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.setupUI());
            } else {
                this.setupUI();
            }
        }

        // 检查并恢复未完成的操作
        checkAndResumeUnfinishedOperation() {
            if (StateManager.hasUnfinishedBatchDelete()) {
                // 延迟一下，确保页面完全加载
                setTimeout(() => {
                    this.resumeBatchDelete();
                }, 2000);
            }
        }
        
        



        // 恢复批量删除操作
        resumeBatchDelete() {
            const state = StateManager.getBatchDeleteState();
            const progress = StateManager.getDeleteProgress();
            
            if (!state || !progress) {
                StateManager.clearBatchDeleteState();
                return;
            }

            this.batchDeleteController.resumeAllPagesDelete(state, progress);
        }

        setupUI() {
            // 初始化页面操作器
            this.pageOperator.init();

            if (!this.pageOperator.canOperate()) {
                return;
            }

            // 创建工具栏
            const toolbar = UIManager.createToolbar();
            
            // 插入工具栏到页面顶部
            const firstElement = document.body.firstElementChild;
            if (firstElement) {
                document.body.insertBefore(toolbar, firstElement);
            } else {
                document.body.appendChild(toolbar);
            }

            // 绑定事件
            this.bindEvents();

            // 更新状态
            this.updateStatus();

            // 插件初始化完成
        }

        bindEvents() {
            const btnCurrent = document.getElementById('nmp-delete-current');
            const btnAll = document.getElementById('nmp-delete-all-pages');
            const btnStop = document.getElementById('nmp-stop-delete');
            const btnSelected = document.getElementById('nmp-delete-selected');
            if (btnCurrent) btnCurrent.onclick = () => this.batchDeleteController.deleteCurrentPage();
            if (btnAll) btnAll.onclick = () => this.batchDeleteController.deleteAllPages();
            if (btnStop) btnStop.onclick = () => this.batchDeleteController.stopBatchDelete();
            if (btnSelected) btnSelected.onclick = () => this.batchDeleteController.deleteSelected();
        }

        updateStatus() {
            const statusElement = document.getElementById('nmp-status');
            if (statusElement) {
                const currentPage = DOMManager.getCurrentPageNumber();
                const totalPages = DOMManager.getTotalPages();
                const remainingPages = totalPages - currentPage + 1;
                
                statusElement.textContent = `剩余页数 ${remainingPages} 页`;
            }
        }
    }

    // 启动插件
    const app = new NexusMailPurge();
    app.init();

})();
