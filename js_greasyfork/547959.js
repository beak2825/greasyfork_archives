// ==UserScript==
// @name         Pixiv Tag Filter
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  Pixiv排行榜屏蔽
// @author        Kyouka
// @match        https://www.pixiv.net/ranking*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/547959/Pixiv%20Tag%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/547959/Pixiv%20Tag%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认配置
    const defaultConfig = {
        tagGroups: [
            {
                name: "默认",
                tags: ["BL", "/百合/"], // 示例：可以混合普通标签和正则标签
                active: true,
            }
        ],
        panelTheme: "dark"
    };

    //  状态管理
    let config = GM_getValue('config', defaultConfig);
    config.tagGroups.forEach(g => delete g.caseSensitive);
    let draftConfig = null;
    let panelVisible = false;
    let currentPanel = null;


    //  CSS 样式
    GM_addStyle(`
        ._attr-filter-hidden { display: none !important; }
        .pfp-panel {
            font-family: 'Segoe UI', sans-serif; box-shadow: 0 4px 20px rgba(0,0,0,0.25);
            max-height: 80vh; width: 395px;
            position: fixed; bottom: 20px; right: 20px; z-index: 99999;
            border-radius: 12px;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        .pfp-panel.dark { background: #2d3748; color: #f8f9fa; }
        .pfp-panel .pfp-header {
            padding: 12px 16px;
            flex-shrink: 0;
        }
        .pfp-panel .pfp-content-scrollable {
            padding: 0 16px;
            flex-grow: 1;
            overflow-y: auto;
        }
        .pfp-panel .pfp-main-footer {
            padding: 12px 16px;
            flex-shrink: 0;
            background: rgba(0,0,0,0.1);
            border-top: 1px solid rgba(255,255,255,0.1);
        }
        .pfp-group-item { margin: 12px 0; padding: 12px; border-radius: 6px; background: rgba(255,255,255,0.05); }
        .pfp-group-header { display: flex; align-items: center; margin-bottom: 8px; }
        .pfp-delete-btn { background: #e53e3e; color: white; border: none; border-radius: 4px; padding: 2px 8px; margin-left: 8px; cursor: pointer; }
        .pfp-delete-btn:hover { background: #c53030; }
        .pfp-options-row { display: flex; gap: 12px; margin-top: 8px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 8px; }
        .pfp-option-label { display: flex; align-items: center; font-size: 14px; }
        .pfp-tags-container { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px 0; min-height: 28px; }
        .pfp-tag-item { display: flex; align-items: center; background: #4a5568; padding: 4px 8px; border-radius: 12px; font-size: 13px; }
        .pfp-tag-delete-btn { background: none; border: none; color: white; font-size: 16px; margin-left: 4px; cursor: pointer; padding: 0 4px; line-height: 1; }
        .pfp-add-tag-wrapper { display: flex; margin-top: 8px; margin-bottom: 8px; }
        .pfp-add-tag-input { flex-grow: 1; padding: 6px; border-radius: 4px 0 0 4px; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.1); color: inherit; }
        .pfp-add-tag-btn { padding: 2px 8px; border: none; border-radius: 0 4px 4px 0; background: #3182ce; color: white; cursor: pointer; border-radius: 4px;}
        .pfp-footer-actions { display: flex; gap: 10px; margin-top: 16px; }
        .pfp-action-btn { flex-grow: 1; padding: 9px; border: none; border-radius: 6px; cursor: pointer; font-size: 15px; }
        .pfp-add-group-btn { width: 100%; background: #4299e1; color: white; }
        .pfp-save-btn { background: #38a169; color: white; }
        .pfp-cancel-btn { background: #718096; color: white; }
    `);
    function deepCopy(obj) { return JSON.parse(JSON.stringify(obj)); }
    // --- 核心逻辑 ---
    function rerenderPanel(panel, data) {
        // 1. 记录当前滚动位置
        const scrollableArea = panel.querySelector('.pfp-content-scrollable');
        const scrollTop = scrollableArea ? scrollableArea.scrollTop : 0;
        // 2. 正常重绘UI
        renderPanelContent(panel, data);
        // 3. 恢复滚动位置
        const newScrollableArea = panel.querySelector('.pfp-content-scrollable');
        if (newScrollableArea) {
            newScrollableArea.scrollTop = scrollTop;
        }
    }

    // 切换面板
    function togglePanel() {
        if (panelVisible) {
            if (currentPanel) currentPanel.remove();
            currentPanel = null;
            draftConfig = null;
            panelVisible = false;
        } else {
            draftConfig = deepCopy(config);
            currentPanel = createPanelShell();
            renderPanelContent(currentPanel, draftConfig); // 首次渲染不需要记忆滚动
            document.body.appendChild(currentPanel);
            panelVisible = true;
        }
    }

    // 创建面板基本框架
    function createPanelShell() {
        const panel = document.createElement('div');
        panel.className = `pfp-panel ${config.panelTheme}`;
        return panel;
    }

    // 渲染面板的动态内容
    function renderPanelContent(panel, data) {
        panel.innerHTML = ''; // 清空

        // 1. 创建固定的头部
        const header = document.createElement('div');
        header.className = 'pfp-header';
        const headerFlex = document.createElement('div');
        headerFlex.style.cssText = 'display: flex; justify-content: space-between; align-items: center;';
        const title = document.createElement('h3');
        title.textContent = 'Pixiv标签过滤器';
        title.style.margin = '0';
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.style.cssText = 'background: none; border: none; font-size: 24px; cursor: pointer; padding: 0 8px; color: inherit;';
        closeBtn.addEventListener('click', togglePanel);
        headerFlex.append(title, closeBtn);
        header.appendChild(headerFlex);

        // 2. 创建可滚动的内容区
        const contentArea = document.createElement('div');
        contentArea.className = 'pfp-content-scrollable';
        const groupsContainer = document.createElement('div');

        data.tagGroups.forEach((group, index) => {
            const groupItem = document.createElement('div');
            groupItem.className = 'pfp-group-item';
            // 组头部
            const groupHeader = document.createElement('div');
            groupHeader.className = 'pfp-group-header';
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = group.active;
            checkbox.style.marginRight = '8px'; //间隔
            checkbox.addEventListener('change', (e) => { group.active = e.target.checked; });
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.value = group.name;
            Object.assign(nameInput.style, { flexGrow: '1', padding: '6px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(0,0,0,0.1)', color: 'inherit' }); //标签组颜色
            nameInput.addEventListener('change', (e) => { group.name = e.target.value; });
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'pfp-delete-btn';
            deleteBtn.textContent = '删除';
            deleteBtn.addEventListener('click', () => {
                if (confirm(`确定要删除标签组"${group.name}"吗?`)) {
                    data.tagGroups.splice(index, 1);
                    rerenderPanel(panel, data);
                }
            });
            groupHeader.append(checkbox, nameInput, deleteBtn);
            // 添加标签
            const addTagWrapper = document.createElement('div');
            addTagWrapper.className = 'pfp-add-tag-wrapper';
            const addTagInput = document.createElement('input');
            addTagInput.className = 'pfp-add-tag-input';
            addTagInput.style.marginRight = '8px'; //间隔
            addTagInput.placeholder = '添加标签或/正则表达式/';
            const addTagBtn = document.createElement('button');
            addTagBtn.className = 'pfp-add-tag-btn';
            addTagBtn.textContent = '添加';
            const addNewTag = () => {
                const newTag = addTagInput.value.trim();
                if (newTag && !group.tags.includes(newTag)) {
                    group.tags.push(newTag);
                    rerenderPanel(panel, data);
                } else {
                    addTagInput.value = '';
                }
            };
            addTagBtn.addEventListener('click', addNewTag);
            addTagInput.addEventListener('keydown', (e) => { if (e.key === 'Enter') addNewTag(); });
            addTagWrapper.append(addTagInput, addTagBtn);
            // 标签列表
            const tagsContainer = document.createElement('div');
            tagsContainer.className = 'pfp-tags-container';
            group.tags.forEach((tag, tagIndex) => {
                const tagItem = document.createElement('span');
                tagItem.className = 'pfp-tag-item';
                tagItem.textContent = tag;
                const tagDeleteBtn = document.createElement('button');
                tagDeleteBtn.className = 'pfp-tag-delete-btn';
                tagDeleteBtn.innerHTML = '&times;';
                tagDeleteBtn.addEventListener('click', () => {
                    group.tags.splice(tagIndex, 1);
                    rerenderPanel(panel, data);
                });
                tagItem.appendChild(tagDeleteBtn);
                tagsContainer.appendChild(tagItem);
            });
            // 选项
            const optionsRow = document.createElement('div');
            optionsRow.className = 'pfp-options-row';
            const caseOption = document.createElement('label');
            caseOption.className = 'pfp-option-label';
            const caseCheckbox = document.createElement('input');
            caseCheckbox.type = 'checkbox';
            caseCheckbox.checked = group.caseSensitive;
            caseCheckbox.addEventListener('change', (e) => { group.caseSensitive = e.target.checked; });

            groupItem.append(groupHeader, addTagWrapper, tagsContainer, optionsRow);
            groupItem.append(groupHeader, addTagWrapper, tagsContainer);
            groupsContainer.appendChild(groupItem);
        });
        contentArea.appendChild(groupsContainer);

        // 3. 创建固定的尾部
        const mainFooter = document.createElement('div');
        mainFooter.className = 'pfp-main-footer';

        // 添加新组按钮
        const addGroupBtn = document.createElement('button');
        addGroupBtn.textContent = '+ 添加标签组';
        addGroupBtn.className = 'pfp-action-btn pfp-add-group-btn';
        addGroupBtn.addEventListener('click', () => {

            data.tagGroups.push({
                name: `新标签组 ${data.tagGroups.length + 1}`,
                tags: [],
                active: true
            });
            rerenderPanel(panel, data);
            // 滚动到底部查看新添加的组
            setTimeout(() => {
                const newScrollableArea = panel.querySelector('.pfp-content-scrollable');
                if(newScrollableArea) newScrollableArea.scrollTop = newScrollableArea.scrollHeight;
            }, 0);
        });

        // 保存/取消按钮
        const footerActions = document.createElement('div');
        footerActions.className = 'pfp-footer-actions';
        const saveBtn = document.createElement('button');
        saveBtn.textContent = '保存并应用';
        saveBtn.className = 'pfp-action-btn pfp-save-btn';
        saveBtn.addEventListener('click', () => {
            config = deepCopy(draftConfig);
            GM_setValue('config', config);
            filterItems();
            togglePanel();
        });
        const cancelBtn = document.createElement('button');
        cancelBtn.textContent = '取消';
        cancelBtn.className = 'pfp-action-btn pfp-cancel-btn';
        cancelBtn.addEventListener('click', togglePanel);
        footerActions.append(saveBtn, cancelBtn);

        mainFooter.append(addGroupBtn, footerActions);

        // 4. 按顺序组装面板
        panel.append(header, contentArea, mainFooter);
    }

    // 核心过滤函数
    function filterItems() {
        const activeGroups = config.tagGroups.filter(g => g.active && g.tags.length > 0);
        if (activeGroups.length === 0) { // 如果没有活动的规则，确保所有项都显示
            document.querySelectorAll('._attr-filter-hidden').forEach(item => item.classList.remove('_attr-filter-hidden'));
            return;
        }

        document.querySelectorAll('[data-tags]').forEach(item => {
            const tags = item.getAttribute('data-tags').split(' ');
            let shouldHide = false;

            for (const group of activeGroups) {
                const hasMatch = group.tags.some(blockedTag => {
                    // 正则表达式匹配逻辑
                    const regexMatch = blockedTag.match(/^\/(.+)\/([a-z]*)$/);
                    if (regexMatch) {
                        try {
                            let pattern = regexMatch[1];
                            let flags = regexMatch[2] || '';
                            // **如果正则未使用 'i' 标志，自动为其添加**
                            if (!flags.includes('i')) {
                                flags += 'i';
                            }
                            const regex = new RegExp(pattern, flags);
                            return tags.some(tag => regex.test(tag));
                        } catch (e) {
                            console.error(`无效的正则表达式: ${blockedTag}`, e);
                            return false;
                        }
                    } else {
                        // **普通字符串匹配不区分大小写**
                        const lowerBlockedTag = blockedTag.toLowerCase();
                        return tags.some(tag => tag.toLowerCase() === lowerBlockedTag);
                    }

                });

                if (hasMatch) {
                    shouldHide = true;
                    break;
                }
            }

            const rankingItem = item.closest('.ranking-item');
            if (rankingItem) {
                rankingItem.classList.toggle('_attr-filter-hidden', shouldHide);
            }
        });
    }

    // --- 初始化和监听 ---
    GM_addValueChangeListener('config', (name, oldValue, newValue, remote) => {
        if (remote) {
            console.log('Pixiv Tag Filter: 检测到来自其他页面的配置更新，正在应用...');
            config = newValue; // 更新当前页面的配置
            filterItems(); // 重新执行过滤
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === "`" && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA') {
            e.preventDefault();
            togglePanel();
        }
    });

    GM_registerMenuCommand('打开/关闭过滤器面板', togglePanel);

    const observer = new MutationObserver(filterItems);
    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(filterItems, 1000);
})();