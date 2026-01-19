// ==UserScript==
// @name         知乎屏蔽词修改器
// @namespace    http://tampermonkey.net/
// @version      2026-0119-1353-00 
// @description  仅对网页版知乎推荐页生效
// @author       razor_gg
// @match        https://www.zhihu.com/
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/563202/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E8%AF%8D%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/563202/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E8%AF%8D%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==

(function() {
     'use strict';

    // 默认关键词
    const DEFAULT_KEYWORDS = ['男','女','父亲','母亲'];
    // 存储键名
    const STORAGE_KEY = 'zhihu_block_keywords';

    // 获取关键词列表
    function getKeywords() {
        return GM_getValue(STORAGE_KEY, DEFAULT_KEYWORDS);
    }

    // 保存关键词列表
    function saveKeywords(keywords) {
        GM_setValue(STORAGE_KEY, keywords);
        // 更新内存中的列表
        blockKeywords = keywords;
        // 刷新页面状态
        refreshBlockStatus();
    }

    // 当前生效的关键词
    let blockKeywords = getKeywords();

    // 目标问题的父容器选择器
    const QUESTION_CONTAINER_SELECTOR = '.ContentItem';
    // 标题元素选择器
    const TITLE_SELECTOR = '.ContentItem-title a';
    // 注入样式
    const style = document.createElement('style');
    style.textContent = `
        .zhihu-hide-item {
            display: none !important;
        }
        
        /* 悬浮按钮样式 */
        #zhihu-blocker-toggle-btn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 8px 16px;
            background-color: #0084ff;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-size: 14px;
        }
        #zhihu-blocker-toggle-btn:hover {
            background-color: #0077e6;
        }

        /* 弹窗容器样式 */
        #zhihu-blocker-modal {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 80%;
            max-width: 600px;
            max-height: 80vh;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            display: flex;
            flex-direction: column;
            border: 1px solid #ebebeb;
        }
        
        .zhihu-blocker-modal-header {
            padding: 16px;
            border-bottom: 1px solid #ebebeb;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f6f6f6;
            border-radius: 8px 8px 0 0;
        }
        
        .zhihu-blocker-modal-title {
            font-weight: bold;
            font-size: 16px;
            color: #121212;
        }

        .zhihu-blocker-header-actions {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .zhihu-blocker-modal-close {
            cursor: pointer;
            font-size: 20px;
            color: #999;
            background: none;
            border: none;
            padding: 0 8px;
        }
        
        .zhihu-blocker-modal-content {
            padding: 16px;
            overflow-y: auto;
            flex: 1;
        }

        .zhihu-blocker-item-row {
            padding: 12px;
            border-bottom: 1px solid #f0f0f0;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
        }
        
        .zhihu-blocker-item-row:last-child {
            border-bottom: none;
        }

        .zhihu-blocker-item-link {
            color: #175199;
            text-decoration: none;
            font-size: 14px;
            line-height: 1.5;
            flex: 1;
            margin-right: 12px;
        }
        
        .zhihu-blocker-item-link:hover {
            text-decoration: underline;
        }

        .zhihu-blocker-tag {
            font-size: 12px;
            color: #f00;
            background: #fff0f0;
            padding: 2px 6px;
            border-radius: 4px;
            white-space: nowrap;
            margin-right: 8px;
        }

        .zhihu-blocker-action-btn {
            font-size: 12px;
            color: #0084ff;
            background: none;
            border: 1px solid #0084ff;
            padding: 2px 8px;
            border-radius: 4px;
            cursor: pointer;
            white-space: nowrap;
        }
        
        .zhihu-blocker-action-btn:hover {
            background: #0084ff;
            color: white;
        }

        /* 标签式编辑器样式 */
        .zhihu-blocker-tags-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            min-height: 100px;
            align-content: flex-start;
            margin-bottom: 12px;
            background: #fff;
        }

        .zhihu-blocker-edit-tag {
            background: #eef6ff;
            color: #0084ff;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 6px;
            border: 1px solid #cce5ff;
        }

        .zhihu-blocker-tag-close {
            cursor: pointer;
            font-size: 14px;
            line-height: 1;
            opacity: 0.6;
        }
        
        .zhihu-blocker-tag-close:hover {
            opacity: 1;
            color: #f00;
        }

        .zhihu-blocker-input-wrapper {
            display: flex;
            gap: 8px;
            margin-bottom: 12px;
        }

        .zhihu-blocker-new-input {
            flex: 1;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
        }

        .zhihu-blocker-add-btn {
            background: #0084ff;
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        .zhihu-blocker-add-btn:hover {
            background: #0077e6;
        }

        /* 徽标样式 */
        .zhihu-blocker-badge {
            position: absolute;
            top: -5px;
            right: -5px;
            background: #f00;
            color: white;
            border-radius: 10px;
            padding: 2px 6px;
            font-size: 12px;
            font-weight: bold;
            box-shadow: 0 1px 2px rgba(0,0,0,0.2);
            min-width: 8px;
            text-align: center;
            line-height: 1;
        }

        /* 遮罩层 */
        #zhihu-blocker-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            z-index: 9998;
        }
    `;
    document.head.appendChild(style);

    // 创建弹窗相关元素
    let modal = null;
    let overlay = null;

    function createModal() {
        if (modal) return;

        // 创建遮罩
        overlay = document.createElement('div');
        overlay.id = 'zhihu-blocker-overlay';
        overlay.onclick = closeModal;
        document.body.appendChild(overlay);

        // 创建弹窗
        modal = document.createElement('div');
        modal.id = 'zhihu-blocker-modal';
        
        const header = document.createElement('div');
        header.className = 'zhihu-blocker-modal-header';
        header.innerHTML = `
            <span class="zhihu-blocker-modal-title">已屏蔽的内容</span>
            <div class="zhihu-blocker-header-actions">
                <button class="zhihu-blocker-text-btn" id="zhihu-blocker-settings-btn">设置关键词</button>
                <button class="zhihu-blocker-modal-close">×</button>
            </div>
        `;
        header.querySelector('.zhihu-blocker-modal-close').onclick = closeModal;
        header.querySelector('#zhihu-blocker-settings-btn').onclick = toggleSettingsView;

        const content = document.createElement('div');
        content.className = 'zhihu-blocker-modal-content';
        content.id = 'zhihu-blocker-list';

        modal.appendChild(header);
        modal.appendChild(content);
        document.body.appendChild(modal);
    }

    function closeModal() {
        if (modal) {
            modal.remove();
            modal = null;
        }
        if (overlay) {
            overlay.remove();
            overlay = null;
        }
        isEditingKeywords = false;
    }

    // 切换设置视图
    function toggleSettingsView() {
        isEditingKeywords = !isEditingKeywords;
        const listContainer = document.getElementById('zhihu-blocker-list');
        const titleEl = modal.querySelector('.zhihu-blocker-modal-title');
        const settingsBtn = document.getElementById('zhihu-blocker-settings-btn');
        
        if (isEditingKeywords) {
            // 进入编辑模式
            titleEl.textContent = '设置屏蔽关键词';
            settingsBtn.textContent = '返回列表';
            
            const keywordsText = blockKeywords.join('\n');
            
            listContainer.innerHTML = `
                <div class="zhihu-blocker-editor-container" style="display:flex;flex-direction:column;height:100%;">
                    <div class="zhihu-blocker-input-wrapper">
                        <input type="text" class="zhihu-blocker-new-input" placeholder="输入关键词，按回车添加" />
                        <button class="zhihu-blocker-add-btn">添加</button>
                    </div>
                    <div class="zhihu-blocker-tags-container"></div>
                    <div style="font-size:12px;color:#999;margin-top:auto;">修改会实时自动保存并生效。</div>
                </div>
            `;
            
            const tagsContainer = listContainer.querySelector('.zhihu-blocker-tags-container');
            const input = listContainer.querySelector('.zhihu-blocker-new-input');
            const addBtn = listContainer.querySelector('.zhihu-blocker-add-btn');

            // 渲染标签
            const renderTags = () => {
                tagsContainer.innerHTML = '';
                blockKeywords.forEach(keyword => {
                    const tag = document.createElement('div');
                    tag.className = 'zhihu-blocker-edit-tag';
                    tag.innerHTML = `
                        <span>${keyword}</span>
                        <span class="zhihu-blocker-tag-close" data-keyword="${keyword}">×</span>
                    `;
                    tagsContainer.appendChild(tag);
                });
            };

            // 添加关键词逻辑
            const addKeyword = () => {
                const val = input.value.trim();
                if (val && !blockKeywords.includes(val)) {
                    const newKeywords = [...blockKeywords, val];
                    saveKeywords(newKeywords);
                    renderTags();
                    input.value = '';
                } else if (blockKeywords.includes(val)) {
                    alert('关键词已存在');
                }
            };

            // 删除关键词逻辑
            tagsContainer.onclick = (e) => {
                if (e.target.classList.contains('zhihu-blocker-tag-close')) {
                    const keywordToRemove = e.target.dataset.keyword;
                    const newKeywords = blockKeywords.filter(k => k !== keywordToRemove);
                    saveKeywords(newKeywords);
                    renderTags();
                }
            };

            // 绑定事件
            addBtn.onclick = addKeyword;
            input.onkeypress = (e) => {
                if (e.key === 'Enter') {
                    addKeyword();
                }
            };

            // 初始化渲染
            renderTags();
        } else {
            // 返回列表模式
            titleEl.textContent = '已屏蔽的内容';
            settingsBtn.textContent = '设置关键词';
            showBlockedContent();
        }
    }

    function showBlockedContent() {
        createModal();
        // 如果当前是在编辑模式下调用的（比如初始化），确保切换回列表模式的UI状态（或者保持编辑模式，这里假设调用showBlockedContent是为了显示列表）
        // 实际上，如果从外部调用，我们通常希望显示列表。
        if (isEditingKeywords) {
             toggleSettingsView();
             return; // toggleSettingsView 会调用 showBlockedContent
        }

        const listContainer = document.getElementById('zhihu-blocker-list');
        listContainer.innerHTML = '';

        const blockedElements = document.querySelectorAll('.zhihu-blocked-item');
        
        if (blockedElements.length === 0) {
            listContainer.innerHTML = '<div style="text-align:center;color:#999;padding:20px;">暂无被屏蔽的内容</div>';
            return;
        }

        blockedElements.forEach(element => {
            const titleElement = element.querySelector(TITLE_SELECTOR);
            if (!titleElement) return;

            const title = titleElement.textContent.trim();
            const url = titleElement.href;
            
            // 找出匹配的关键词
            const matchedKeyword = blockKeywords.find(k => title.includes(k)) || '未知';

            const row = document.createElement('div');
            row.className = 'zhihu-blocker-item-row';
            row.innerHTML = `
                <a href="${url}" target="_blank" class="zhihu-blocker-item-link">${title}</a>
                <div style="display:flex;align-items:center;">
                    <span class="zhihu-blocker-tag">含 "${matchedKeyword}"</span>
                    <button class="zhihu-blocker-action-btn">解除屏蔽</button>
                </div>
            `;
            
            // 绑定解除屏蔽事件
            const unblockBtn = row.querySelector('.zhihu-blocker-action-btn');
            
            // 内部函数：更新按钮状态
            const updateBtnState = () => {
                const isIgnored = element.classList.contains('zhihu-blocker-ignored');
                if (isIgnored) {
                    unblockBtn.textContent = '重新屏蔽';
                    unblockBtn.style.color = '#f00';
                    unblockBtn.style.borderColor = '#f00';
                    row.style.opacity = '0.6'; // 视觉上变淡，表示已不再屏蔽
                } else {
                    unblockBtn.textContent = '解除屏蔽';
                    unblockBtn.style.color = '#0084ff';
                    unblockBtn.style.borderColor = '#0084ff';
                    row.style.opacity = '1';
                }
            };
            
            // 初始化按钮状态（虽然默认都是屏蔽状态，但为了稳健性还是检查一下）
            updateBtnState();

            unblockBtn.onclick = () => {
                const isIgnored = element.classList.contains('zhihu-blocker-ignored');
                
                if (isIgnored) {
                    // 重新屏蔽
                    element.classList.add('zhihu-hide-item', 'zhihu-blocked-item');
                    element.classList.remove('zhihu-blocker-ignored');
                } else {
                    // 解除屏蔽
                    element.classList.remove('zhihu-hide-item', 'zhihu-blocked-item');
                    element.classList.add('zhihu-blocker-ignored');
                }
                
                updateBtnState();

                // 滚动到对应元素位置
                element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                
                // 添加高亮闪烁效果
                element.style.transition = 'background-color 0.5s';
                const originalBg = element.style.backgroundColor;
                element.style.backgroundColor = '#fff3cd'; // 浅黄色高亮
                setTimeout(() => {
                    element.style.backgroundColor = originalBg;
                }, 1000);
                
                // 更新计数
                updateBadgeCount();
            };

            listContainer.appendChild(row);
        });
    }

    // 状态标记
    let isBlockedContentVisible = false;
    let isEditingKeywords = false; // 是否正在编辑关键词

    // 刷新页面屏蔽状态
    function refreshBlockStatus() {
        // 获取所有潜在的问题容器
        const allQuestions = document.querySelectorAll(QUESTION_CONTAINER_SELECTOR);
        
        allQuestions.forEach(element => {
            // 如果已经被标记为忽略（用户手动解除屏蔽），则不清除忽略标记，但清除屏蔽状态以便重新检查（虽然有忽略标记会被processQuestionElement跳过）
            // 这里我们需要一种策略：
            // 1. 如果用户手动解除了屏蔽，我们希望它保持显示。
            // 2. 如果新规则下它不再需要屏蔽，它也应该显示。
            // 3. 如果新规则下它需要屏蔽，且没有忽略标记，它应该被屏蔽。
            
            // 简单粗暴：重置除了“忽略”以外的所有状态
            element.classList.remove('zhihu-blocked-item', 'zhihu-hide-item');
            
            // 清除处理标记，强制重新检查
            delete element.dataset.zhihuBlockerProcessed;
            
            // 重新运行检查逻辑
            processQuestionElement(element);
        });
        
        // 如果弹窗打开且不是在编辑模式，刷新弹窗内容
         if (modal && !isEditingKeywords) {
             showBlockedContent();
         }
         
         // 刷新计数
         updateBadgeCount();
     }

    // 更新徽标计数
    function updateBadgeCount() {
        const btn = document.getElementById('zhihu-blocker-toggle-btn');
        if (!btn) return;
        
        let badge = btn.querySelector('.zhihu-blocker-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'zhihu-blocker-badge';
            btn.appendChild(badge);
        }
        
        // 计算当前被屏蔽的元素数量（排除已解除屏蔽的）
        const blockedCount = document.querySelectorAll('.zhihu-blocked-item:not(.zhihu-blocker-ignored)').length;
        
        if (blockedCount > 0) {
            badge.style.display = 'block';
            badge.textContent = blockedCount > 99 ? '99+' : blockedCount;
        } else {
            badge.style.display = 'none';
        }
    }

    // 创建切换按钮
    function createMainButton() {
        const btn = document.createElement('button');
        btn.id = 'zhihu-blocker-toggle-btn';
        btn.textContent = '查看屏蔽记录';
        // 添加 relative 定位以便徽标绝对定位
        btn.style.position = 'fixed'; 
        btn.onclick = showBlockedContent;
        document.body.appendChild(btn);
        
        // 初始化徽标
        updateBadgeCount();
    }

    // 处理单个问题元素
    function processQuestionElement(element) {
        // 如果已标记为忽略，则跳过
        if (element.classList.contains('zhihu-blocker-ignored')) return;

        // 避免重复处理
        if (element.dataset.zhihuBlockerProcessed) return;
        element.dataset.zhihuBlockerProcessed = 'true';

        const titleElement = element.querySelector(TITLE_SELECTOR);
        if (titleElement) {
            const title = titleElement.textContent.trim();
            // 检查标题是否包含任意关键词
            if (blockKeywords.some(keyword => title.includes(keyword))) {
                // 添加标记类
                element.classList.add('zhihu-blocked-item');
                // 始终隐藏
                element.classList.add('zhihu-hide-item');
                console.log(`已屏蔽问题: ${title}`);
                
                // 更新计数
                updateBadgeCount();
            }
        }
    }

    // 初始化按钮
    createMainButton();

    // 处理所有可见的问题元素
    function processAllQuestions() {
        document.querySelectorAll(QUESTION_CONTAINER_SELECTOR).forEach(processQuestionElement);
    }
    // 页面加载完成后处理现有问题
    window.addEventListener('load', processAllQuestions);
    // 监听DOM变化，处理动态加载的内容
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) { // 确保是元素节点
                        if (node.matches(QUESTION_CONTAINER_SELECTOR)) {
                            processQuestionElement(node);
                        } else {
                            // 检查新增节点的子节点
                            node.querySelectorAll(QUESTION_CONTAINER_SELECTOR).forEach(processQuestionElement);
                        }
                    }
                });
            }
        });
    });
    // 开始观察DOM变化
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();