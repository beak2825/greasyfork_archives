// ==UserScript==
// @name         知乎问题屏蔽器
// @namespace    zhihu-question-blocker
// @version      1.0.0
// @description  自定义关键词屏蔽知乎推荐问题
// @match        https://www.zhihu.com/*
// @run-at       document-start
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/550961/%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/550961/%E7%9F%A5%E4%B9%8E%E9%97%AE%E9%A2%98%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(() => {
    'use strict';

    // 默认屏蔽关键词
    const DEFAULT_KEYWORDS = [
        '如何看待',
        '怎么看',
        '有什么看法',
        '明星',
        '娱乐圈',
        '网红',
        '直播',
        '游戏主播'
    ];

    // 获取用户设置的关键词
    let blockedKeywords = GM_getValue('blockedKeywords', DEFAULT_KEYWORDS);

    // 添加样式
    GM_addStyle(`
        .zhihu-blocker-hidden {
            display: none !important;
        }

        .zhihu-blocker-settings {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 500px;
            max-height: 600px;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            padding: 20px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
        }

        .zhihu-blocker-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.5);
            z-index: 9999;
        }

        .zhihu-blocker-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }

        .zhihu-blocker-title {
            font-size: 18px;
            font-weight: 600;
            color: #333;
        }

        .zhihu-blocker-close {
            background: none;
            border: none;
            font-size: 24px;
            cursor: pointer;
            color: #999;
            padding: 0;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .zhihu-blocker-close:hover {
            color: #333;
        }

        .zhihu-blocker-input-group {
            margin-bottom: 15px;
        }

        .zhihu-blocker-label {
            display: block;
            margin-bottom: 5px;
            font-weight: 500;
            color: #333;
        }

        .zhihu-blocker-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 14px;
            box-sizing: border-box;
        }

        .zhihu-blocker-keywords {
            max-height: 300px;
            overflow-y: auto;
            border: 1px solid #ddd;
            border-radius: 4px;
            padding: 10px;
            background: #f9f9f9;
        }

        .zhihu-blocker-keyword-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 5px 8px;
            margin-bottom: 5px;
            background: #fff;
            border-radius: 4px;
            border: 1px solid #eee;
        }

        .zhihu-blocker-keyword-text {
            flex: 1;
            font-size: 14px;
            color: #333;
        }

        .zhihu-blocker-remove-btn {
            background: #ff4757;
            color: white;
            border: none;
            border-radius: 3px;
            padding: 2px 8px;
            font-size: 12px;
            cursor: pointer;
        }

        .zhihu-blocker-remove-btn:hover {
            background: #ff3742;
        }

        .zhihu-blocker-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px solid #eee;
        }

        .zhihu-blocker-btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 500;
        }

        .zhihu-blocker-btn-primary {
            background: #0084ff;
            color: white;
        }

        .zhihu-blocker-btn-primary:hover {
            background: #0066cc;
        }

        .zhihu-blocker-btn-secondary {
            background: #f5f5f5;
            color: #333;
        }

        .zhihu-blocker-btn-secondary:hover {
            background: #e8e8e8;
        }

        .zhihu-blocker-stats {
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            font-size: 12px;
            z-index: 1000;
            display: none;
        }

        /* 左侧快速输入框 */
        .zhihu-blocker-quick-input {
            position: fixed;
            left: -300px;
            top: 50%;
            transform: translateY(-50%);
            width: 300px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 0 12px 12px 0;
            box-shadow: 2px 0 20px rgba(0, 0, 0, 0.3);
            z-index: 9998;
            transition: left 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', sans-serif;
        }

        .zhihu-blocker-quick-input.show {
            left: 0;
        }

        .zhihu-blocker-quick-tab {
            position: absolute;
            right: -8px;
            top: 50%;
            transform: translateY(-50%);
            width: 16px;
            height: 16px;
            background: radial-gradient(circle, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.3) 70%, transparent 100%);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }

        .zhihu-blocker-quick-tab:hover {
            width: 32px;
            height: 32px;
            right: -16px;
            opacity: 0.9;
            background: radial-gradient(circle, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 0.8) 60%, rgba(118, 75, 162, 0.3) 80%, transparent 100%);
            box-shadow: 0 0 16px rgba(102, 126, 234, 0.6);
            transform: translateY(-50%) scale(1.1);
        }

        .zhihu-blocker-quick-tab::after {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 8px;
            height: 8px;
            background: rgba(255, 255, 255, 0);
            border-radius: 50%;
            transition: all 0.3s ease;
        }

        .zhihu-blocker-quick-tab:hover::after {
            width: 12px;
            height: 12px;
            background: rgba(255, 255, 255, 0.8);
            box-shadow: 0 0 6px rgba(255, 255, 255, 0.4);
        }

        .zhihu-blocker-quick-content {
            padding: 20px;
            color: white;
        }

        .zhihu-blocker-quick-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 15px;
            text-align: center;
            color: white;
        }

        .zhihu-blocker-quick-input-field {
            width: 100%;
            padding: 10px 12px;
            border: none;
            border-radius: 6px;
            font-size: 14px;
            background: rgba(255, 255, 255, 0.9);
            color: #333;
            margin-bottom: 10px;
            box-sizing: border-box;
            transition: all 0.2s ease;
        }

        .zhihu-blocker-quick-input-field:focus {
            outline: none;
            background: rgba(255, 255, 255, 1);
            box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.3);
        }

        .zhihu-blocker-quick-input-field::placeholder {
            color: #999;
        }

        .zhihu-blocker-quick-add-btn {
            width: 100%;
            padding: 10px;
            background: rgba(255, 255, 255, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.3);
            border-radius: 6px;
            color: white;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            margin-bottom: 15px;
        }

        .zhihu-blocker-quick-add-btn:hover {
            background: rgba(255, 255, 255, 0.3);
            border-color: rgba(255, 255, 255, 0.5);
        }

        .zhihu-blocker-quick-recent {
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            padding-top: 15px;
        }

        .zhihu-blocker-quick-recent-title {
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            margin-bottom: 8px;
        }

        .zhihu-blocker-quick-keyword {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            padding: 4px 8px;
            border-radius: 12px;
            font-size: 12px;
            margin: 2px 4px 2px 0;
            cursor: pointer;
            transition: all 0.2s ease;
        }

        .zhihu-blocker-quick-keyword:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .zhihu-blocker-quick-stats {
            text-align: center;
            font-size: 12px;
            color: rgba(255, 255, 255, 0.8);
            margin-top: 10px;
        }
    `);

    // 统计信息
    let blockedCount = 0;

    // 创建统计显示元素
    const statsElement = document.createElement('div');
    statsElement.className = 'zhihu-blocker-stats';
    statsElement.textContent = '已屏蔽: 0 个问题';
    document.body.appendChild(statsElement);

    // 创建快速输入框
    const quickInputPanel = createQuickInputPanel();

    // 更新统计显示
    function updateStats() {
        statsElement.textContent = `已屏蔽: ${blockedCount} 个问题`;
        if (blockedCount > 0) {
            statsElement.style.display = 'block';
            setTimeout(() => {
                statsElement.style.display = 'none';
            }, 3000);
        }

        // 同时更新快速输入框的统计
        if (quickInputPanel && quickInputPanel.updateQuickStats) {
            quickInputPanel.updateQuickStats();
        }
    }

    // 检查文本是否包含屏蔽关键词
    function containsBlockedKeyword(text) {
        if (!text) return false;
        const lowerText = text.toLowerCase();
        return blockedKeywords.some(keyword =>
            lowerText.includes(keyword.toLowerCase())
        );
    }

    // 屏蔽问题元素
    function blockElement(element, reason) {
        element.classList.add('zhihu-blocker-hidden');
        blockedCount++;
        console.log(`[知乎屏蔽器] 屏蔽问题: ${reason}`);
        updateStats();
    }

    // 检查并屏蔽问题
    function checkAndBlockQuestions() {
        // 知乎首页推荐问题选择器
        const selectors = [
            '.ContentItem', // 主要内容项
            '.TopstoryItem', // 推荐内容项
            '.Card', // 卡片式内容
            '[data-zop-feedtype]', // 带有 feed 类型的元素
            '.List-item' // 列表项
        ];

        selectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(item => {
                if (item.classList.contains('zhihu-blocker-hidden')) return;

                // 获取问题标题
                const titleElements = item.querySelectorAll([
                    'h2 a',
                    '.ContentItem-title a',
                    '.QuestionItem-title a',
                    '[data-za-detail-view-element_name="Title"] a',
                    '.RichText',
                    '.ContentItem-title'
                ].join(','));

                let shouldBlock = false;
                let blockReason = '';

                titleElements.forEach(titleEl => {
                    const titleText = titleEl.textContent || titleEl.innerText;
                    if (containsBlockedKeyword(titleText)) {
                        shouldBlock = true;
                        blockReason = titleText.substring(0, 50) + '...';
                    }
                });

                // 检查问题描述
                const descElements = item.querySelectorAll([
                    '.RichText',
                    '.ContentItem-meta',
                    '.QuestionRichText'
                ].join(','));

                descElements.forEach(descEl => {
                    const descText = descEl.textContent || descEl.innerText;
                    if (containsBlockedKeyword(descText)) {
                        shouldBlock = true;
                        if (!blockReason) {
                            blockReason = descText.substring(0, 50) + '...';
                        }
                    }
                });

                if (shouldBlock) {
                    blockElement(item, blockReason);
                }
            });
        });
    }

    // 创建设置界面
    function createSettingsUI() {
        const overlay = document.createElement('div');
        overlay.className = 'zhihu-blocker-overlay';

        const modal = document.createElement('div');
        modal.className = 'zhihu-blocker-settings';

        modal.innerHTML = `
            <div class="zhihu-blocker-header">
                <div class="zhihu-blocker-title">知乎问题屏蔽设置</div>
                <button class="zhihu-blocker-close">×</button>
            </div>

            <div class="zhihu-blocker-input-group">
                <label class="zhihu-blocker-label">添加屏蔽关键词：</label>
                <input type="text" class="zhihu-blocker-input" placeholder="输入关键词后按回车添加" id="keyword-input">
            </div>

            <div class="zhihu-blocker-input-group">
                <label class="zhihu-blocker-label">当前屏蔽关键词：</label>
                <div class="zhihu-blocker-keywords" id="keywords-list"></div>
            </div>

            <div class="zhihu-blocker-buttons">
                <button class="zhihu-blocker-btn zhihu-blocker-btn-secondary" id="reset-btn">重置为默认</button>
                <button class="zhihu-blocker-btn zhihu-blocker-btn-primary" id="save-btn">保存设置</button>
            </div>
        `;

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // 渲染关键词列表
        function renderKeywords() {
            const keywordsList = modal.querySelector('#keywords-list');
            keywordsList.innerHTML = '';

            blockedKeywords.forEach((keyword, index) => {
                const item = document.createElement('div');
                item.className = 'zhihu-blocker-keyword-item';
                item.innerHTML = `
                    <span class="zhihu-blocker-keyword-text">${keyword}</span>
                    <button class="zhihu-blocker-remove-btn" data-index="${index}">删除</button>
                `;
                keywordsList.appendChild(item);
            });
        }

        renderKeywords();

        // 事件绑定
        const keywordInput = modal.querySelector('#keyword-input');
        const closeBtn = modal.querySelector('.zhihu-blocker-close');
        const saveBtn = modal.querySelector('#save-btn');
        const resetBtn = modal.querySelector('#reset-btn');

        // 添加关键词
        keywordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const keyword = keywordInput.value.trim();
                if (keyword && !blockedKeywords.includes(keyword)) {
                    blockedKeywords.push(keyword);
                    keywordInput.value = '';
                    renderKeywords();
                }
            }
        });

        // 删除关键词
        modal.addEventListener('click', (e) => {
            if (e.target.classList.contains('zhihu-blocker-remove-btn')) {
                const index = parseInt(e.target.dataset.index);
                blockedKeywords.splice(index, 1);
                renderKeywords();
            }
        });

        // 关闭设置
        function closeSettings() {
            document.body.removeChild(overlay);
        }

        closeBtn.addEventListener('click', closeSettings);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeSettings();
        });

        // 保存设置
        saveBtn.addEventListener('click', () => {
            GM_setValue('blockedKeywords', blockedKeywords);
            alert('设置已保存！');
            closeSettings();
            // 重新检查页面
            setTimeout(() => {
                checkAndBlockQuestions();
            }, 100);
        });

        // 重置设置
        resetBtn.addEventListener('click', () => {
            if (confirm('确定要重置为默认设置吗？')) {
                blockedKeywords = [...DEFAULT_KEYWORDS];
                renderKeywords();
            }
        });
    }

    // 创建快速输入面板
    function createQuickInputPanel() {
        const panel = document.createElement('div');
        panel.className = 'zhihu-blocker-quick-input';

        panel.innerHTML = `
            <div class="zhihu-blocker-quick-tab"></div>
            <div class="zhihu-blocker-quick-content">
                <div class="zhihu-blocker-quick-title">快速屏蔽</div>
                <input type="text" class="zhihu-blocker-quick-input-field" placeholder="输入关键词..." id="quick-keyword-input">
                <button class="zhihu-blocker-quick-add-btn" id="quick-add-btn">添加屏蔽词</button>
                <div class="zhihu-blocker-quick-recent">
                    <div class="zhihu-blocker-quick-recent-title">最近添加:</div>
                    <div id="quick-recent-keywords"></div>
                </div>
                <div class="zhihu-blocker-quick-stats" id="quick-stats">
                    已屏蔽: 0 个问题
                </div>
            </div>
        `;

        document.body.appendChild(panel);

        // 获取元素
        const tab = panel.querySelector('.zhihu-blocker-quick-tab');
        const quickInput = panel.querySelector('#quick-keyword-input');
        const quickAddBtn = panel.querySelector('#quick-add-btn');
        const recentKeywords = panel.querySelector('#quick-recent-keywords');
        const quickStats = panel.querySelector('#quick-stats');

        let isExpanded = false;

        // 切换面板显示/隐藏
        function togglePanel() {
            isExpanded = !isExpanded;
            panel.classList.toggle('show', isExpanded);
            if (isExpanded) {
                setTimeout(() => quickInput.focus(), 300);
                updateRecentKeywords();
                updateQuickStats();
            }
        }

        // 更新最近添加的关键词显示
        function updateRecentKeywords() {
            const recentCount = 8; // 显示最近8个
            const recent = blockedKeywords.slice(-recentCount).reverse();
            recentKeywords.innerHTML = '';

            recent.forEach(keyword => {
                const keywordEl = document.createElement('span');
                keywordEl.className = 'zhihu-blocker-quick-keyword';
                keywordEl.textContent = keyword;
                keywordEl.title = `点击删除: ${keyword}`;
                keywordEl.addEventListener('click', () => {
                    if (confirm(`确定要删除关键词 "${keyword}" 吗？`)) {
                        const index = blockedKeywords.indexOf(keyword);
                        if (index > -1) {
                            blockedKeywords.splice(index, 1);
                            GM_setValue('blockedKeywords', blockedKeywords);
                            updateRecentKeywords();
                            // 重新检查页面
                            setTimeout(checkAndBlockQuestions, 100);
                        }
                    }
                });
                recentKeywords.appendChild(keywordEl);
            });
        }

        // 更新快速统计
        function updateQuickStats() {
            quickStats.textContent = `已屏蔽: ${blockedCount} 个问题`;
        }

        // 添加关键词
        function addQuickKeyword() {
            const keyword = quickInput.value.trim();
            if (keyword && !blockedKeywords.includes(keyword)) {
                blockedKeywords.push(keyword);
                GM_setValue('blockedKeywords', blockedKeywords);
                quickInput.value = '';
                updateRecentKeywords();

                // 显示添加成功提示
                const originalText = quickAddBtn.textContent;
                quickAddBtn.textContent = '已添加!';
                quickAddBtn.style.background = 'rgba(76, 175, 80, 0.8)';
                setTimeout(() => {
                    quickAddBtn.textContent = originalText;
                    quickAddBtn.style.background = '';
                }, 1000);

                // 重新检查页面
                setTimeout(checkAndBlockQuestions, 100);
            } else if (blockedKeywords.includes(keyword)) {
                // 显示已存在提示
                const originalText = quickAddBtn.textContent;
                quickAddBtn.textContent = '已存在';
                quickAddBtn.style.background = 'rgba(255, 152, 0, 0.8)';
                setTimeout(() => {
                    quickAddBtn.textContent = originalText;
                    quickAddBtn.style.background = '';
                }, 1000);
            }
        }

        // 事件绑定
        tab.addEventListener('click', togglePanel);
        quickAddBtn.addEventListener('click', addQuickKeyword);

        quickInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                addQuickKeyword();
            }
        });

        // 点击面板外部关闭
        document.addEventListener('click', (e) => {
            if (isExpanded && !panel.contains(e.target)) {
                togglePanel();
            }
        });

        // ESC 键关闭
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isExpanded) {
                togglePanel();
            }
        });

        // 暴露更新方法供外部调用
        panel.updateQuickStats = updateQuickStats;

        return panel;
    }

    // 注册菜单命令
    GM_registerMenuCommand('屏蔽设置', createSettingsUI);

    // 页面加载完成后开始监控
    function init() {
        // 初始检查
        checkAndBlockQuestions();

        // 监控页面变化
        const observer = new MutationObserver((mutations) => {
            let shouldCheck = false;
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldCheck = true;
                }
            });
            if (shouldCheck) {
                setTimeout(checkAndBlockQuestions, 500);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 定期检查（防止遗漏）
        setInterval(checkAndBlockQuestions, 3000);
    }

    // 等待页面加载
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    console.log('[知乎问题屏蔽器] 已启动，当前屏蔽关键词：', blockedKeywords);
})();