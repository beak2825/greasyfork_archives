// ==UserScript==
// @name         拯救deric的懒癌
// @namespace    https://www.milkywayidle.com/
// @version      0.512
// @description  按角色存储 + 全技能整合收藏 + 多选筛选 +  完整物品卡片（支持跨技能拖拽自定义排序）+ Tab记忆 + 一键清除
// @author       baozhi powerby_Grok
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidle.com/*
// @grant        none
// @icon         https://www.milkywayidle.com/favicon.svg
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/557976/%E6%8B%AF%E6%95%91deric%E7%9A%84%E6%87%92%E7%99%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/557976/%E6%8B%AF%E6%95%91deric%E7%9A%84%E6%87%92%E7%99%8C.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. 扩展允许的技能列表，新增 '挤奶' 和 '伐木'
    const allowedSkills = ['采摘', '奶酪锻造', '制作', '缝纫', '烹饪', '冲泡', '挤奶', '伐木'];

    // 统一存储键
    const MWI_MAIN_STORAGE_KEY = 'mwi_main_data_';

    // 旧的存储键（用于数据迁移）
    const OLD_STORAGE_KEY = 'mwi_all_favorites_';
    const OLD_LAST_TAB_KEY = 'mwi_last_tabs_';
    const OLD_SELECTED_SKILLS_KEY = 'mwi_selected_skills_';
    const CACHE_KEY = 'mwi_item_cache_';

    const PENDING_CLICK_KEY = 'mwi_pending_global_click';

    let currentCharacterId = null;
    let selectedSkills = new Set();
    let isProcessingClick = false;
    let updateTimeout;
    let tabRestoreTimeout;
    let lastObservedSkill = null; // V4.1: 新增状态跟踪，用于判断是否为新的技能面板加载

    // ==================== 辅助函数：防抖 ====================
    /**
     * 防抖更新 UI，用于合并短时间内的多次收藏/取消收藏操作。
     */
    function debounceUpdate() {
        clearTimeout(updateTimeout);
        updateTimeout = setTimeout(() => {
            updateFavoritesPanelIfOpen();
            updateAllFavoriteButtons();
        }, 200);
    }

    // ==================== 角色ID获取 ====================
    function hookCharacterId() {
        const originalGet = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data").get;
        function hookedGet() {
            const result = originalGet.call(this);
            if (this.currentTarget instanceof WebSocket) {
                try {
                    const msg = JSON.parse(result);
                    if (msg?.type === "init_character_data" && msg.character?.id) {
                        const newId = msg.character.id.toString();
                        if (newId !== currentCharacterId) {
                            currentCharacterId = newId;
                            setTimeout(() => {
                                selectedSkills = new Set(getSelectedSkills());
                                debounceUpdate();
                            }, 300);
                        }
                    }
                } catch (e) { /* ignore */ }
            }
            return result;
        }
        Object.defineProperty(MessageEvent.prototype, "data", {
            get: hookedGet,
            configurable: true
        });
    }

    function getCharacterId() {
        if (currentCharacterId) return currentCharacterId;
        if (window.mwi?.character?.id) return window.mwi.character.id.toString();
        return 'default';
    }

    // ==================== 统一存储操作 (主存储) ====================
    function getMainStorageKey() {
        return `${MWI_MAIN_STORAGE_KEY}${getCharacterId()}`;
    }

    // 将 allFavorites 结构根据 globalOrder 同步，以确保数据一致性 (谁拥有哪个物品)
    function syncFavoritesToGlobalOrder(data) {
        // 1. 映射所有现有物品到它们的技能
        const itemToSkillMap = {};
        for (const skill in data.allFavorites) {
            data.allFavorites[skill].forEach(name => {
                itemToSkillMap[name] = skill;
            });
        }

        // 2. 清空 allFavorites 并根据 globalOrder 和 itemToSkillMap 重建
        const newFavorites = {};
        allowedSkills.forEach(skill => newFavorites[skill] = []);

        data.globalOrder.forEach(name => {
            const skill = itemToSkillMap[name]; // 使用物品的原始技能
            if (skill && allowedSkills.includes(skill)) {
                newFavorites[skill].push(name);
            }
        });

        data.allFavorites = newFavorites;
    }

    // 获取所有角色数据，并处理迁移和 globalOrder 初始化
    function getCharacterData() {
        const key = getMainStorageKey();
        let data = {
            allFavorites: {},
            globalOrder: [],
            lastTabs: {},
            selectedSkills: []
        };

        try {
            const raw = localStorage.getItem(key);
            if (raw) {
                data = JSON.parse(raw);
            }
        } catch (e) { /* ignore */ }

        allowedSkills.forEach(skill => {
            data.allFavorites[skill] = data.allFavorites[skill] || [];
        });

        data.globalOrder = data.globalOrder || [];

        const isMigrated = migrateOldData(data);

        // 如果 globalOrder 是空的，则用 allFavorites 初始化它 (保持 skill -> item 顺序)
        if (data.globalOrder.length === 0) {
            let uniqueItems = new Set();
            allowedSkills.forEach(skill => {
                (data.allFavorites[skill] || []).forEach(name => {
                    if (!uniqueItems.has(name)) {
                        data.globalOrder.push(name);
                        uniqueItems.add(name);
                    }
                });
            });
            if (data.globalOrder.length > 0) {
                 setCharacterData(data);
            }
        } else if (isMigrated) {
            syncFavoritesToGlobalOrder(data);
            setCharacterData(data);
        }

        return data;
    }

    function setCharacterData(data) {
        localStorage.setItem(getMainStorageKey(), JSON.stringify(data));
    }

    function migrateOldData(data) {
        let isMigrated = false;

        const oldFavs = localStorage.getItem(`${OLD_STORAGE_KEY}${getCharacterId()}`);
        if (oldFavs) {
            try {
                const parsed = JSON.parse(oldFavs);
                const fullFavorites = {};
                allowedSkills.forEach(skill => {
                    fullFavorites[skill] = parsed[skill] || [];
                });
                data.allFavorites = fullFavorites;
                localStorage.removeItem(`${OLD_STORAGE_KEY}${getCharacterId()}`);
                isMigrated = true;
            } catch (e) { /* ignore */ }
        }

        const oldSelected = localStorage.getItem(`${OLD_SELECTED_SKILLS_KEY}${getCharacterId()}`);
        if (oldSelected) {
            try {
                data.selectedSkills = JSON.parse(oldSelected);
                localStorage.removeItem(`${OLD_SELECTED_SKILLS_KEY}${getCharacterId()}`);
                isMigrated = true;
            } catch (e) { /* ignore */ }
        }

        const oldTabs = localStorage.getItem(`${OLD_LAST_TAB_KEY}${getCharacterId()}`);
        if (oldTabs) {
            try {
                data.lastTabs = JSON.parse(oldTabs);
                localStorage.removeItem(`${OLD_LAST_TAB_KEY}${getCharacterId()}`);
                isMigrated = true;
            } catch (e) { /* ignore */ }
        }

        return isMigrated;
    }

    // ==================== 全局排序操作 ====================

    function getGlobalOrder() {
        return getCharacterData().globalOrder;
    }

    function setGlobalOrder(newOrderArray) {
        const data = getCharacterData();
        data.globalOrder = newOrderArray;
        syncFavoritesToGlobalOrder(data);
        setCharacterData(data);
    }

    function findItemSkill(itemName) {
        const allFavorites = getCharacterData().allFavorites;
        for (const [skill, items] of Object.entries(allFavorites)) {
            if (items.includes(itemName)) {
                return skill;
            }
        }
        return null;
    }

    function getFavoritesForSkill(skill) {
        return getCharacterData().allFavorites[skill] || [];
    }

    function setFavoritesForSkill(skill, arr) {
        const data = getCharacterData();
        data.allFavorites[skill] = arr;
        setCharacterData(data);
    }

    function addToGlobalOrder(name) {
        const data = getCharacterData();
        if (!data.globalOrder.includes(name)) {
            data.globalOrder.push(name);
            syncFavoritesToGlobalOrder(data);
            setCharacterData(data);
        }
    }

    function removeFromGlobalOrder(name) {
        const data = getCharacterData();
        const index = data.globalOrder.indexOf(name);
        if (index > -1) {
            data.globalOrder.splice(index, 1);
            syncFavoritesToGlobalOrder(data);
            setCharacterData(data);
        }
    }

    function saveSelectedSkills(skills) {
        const data = getCharacterData();
        data.selectedSkills = skills;
        setCharacterData(data);
    }

    function getSelectedSkills() {
        const data = getCharacterData();

        const allFavorites = data.allFavorites;
        const skillsWithFavorites = allowedSkills.filter(skill => (allFavorites[skill]?.length || 0) > 0);

        let validSkills = [];
        if (data.selectedSkills && data.selectedSkills.length > 0) {
            validSkills = data.selectedSkills.filter(skill => skillsWithFavorites.includes(skill));
        }

        if (validSkills.length === 0 && skillsWithFavorites.length > 0) {
            validSkills = skillsWithFavorites;
        }

        return validSkills;
    }

    // ==================== 物品卡片缓存 (独立存储) ====================

    function getCacheKey() {
        return `${CACHE_KEY}${getCharacterId()}`;
    }

    function cacheItemCard(item, skill) {
        const nameEl = item.querySelector('.SkillAction_name__2VPXa');
        if (!nameEl) return;
        const name = nameEl.textContent.trim();

        const isFavorited = !!findItemSkill(name);

        if (!isFavorited) return;

        const cleanItem = item.cloneNode(true);
        cleanItem.querySelector('.mwi-fav-btn')?.remove();

        const clone = cleanItem.cloneNode(true);

        try {
            const cache = JSON.parse(localStorage.getItem(getCacheKey()) || '{}');
            if (!cache[skill]) cache[skill] = {};
            cache[skill][name] = clone.outerHTML;
            localStorage.setItem(getCacheKey(), JSON.stringify(cache));
        } catch (e) { /* ignore */ }
    }

    function getCachedItem(skill, name) {
        try {
            const cache = JSON.parse(localStorage.getItem(getCacheKey()) || '{}');
            let cachedHtml = cache[skill]?.[name] || null;
            if (!cachedHtml) {
                for (const sk in cache) {
                    if (cache[sk][name]) {
                        cachedHtml = cache[sk][name];
                        break;
                    }
                }
            }
            return cachedHtml;
        } catch (e) {
            return null;
        }
    }

    function removeCacheForItem(skill, name) {
        try {
            const cache = JSON.parse(localStorage.getItem(getCacheKey()) || '{}');
            if (cache[skill] && cache[skill][name]) {
                delete cache[skill][name];
                localStorage.setItem(getCacheKey(), JSON.stringify(cache));
            }
        } catch (e) { /* ignore */ }
    }

    // ==================== 收藏按钮（技能页面）====================
    function addFavoriteButton(item, currentSkill) {
        if (item.querySelector('.mwi-fav-btn')) return;
        const nameEl = item.querySelector('.SkillAction_name__2VPXa');
        if (!nameEl) return;
        const name = nameEl.textContent.trim();

        const btn = document.createElement('button');
        btn.className = 'mwi-fav-btn';

        let itemSkill = findItemSkill(name);
        const isFavorited = !!itemSkill;

        btn.textContent = isFavorited ? '⭐' : '☆';

        Object.assign(btn.style, {
            position: 'absolute', top: '4px', right: '4px', background: 'none',
            border: 'none', fontSize: '18px', cursor: 'pointer', zIndex: '10',
            color: isFavorited ? 'rgb(255, 215, 0)' : 'rgb(170, 170, 170)'
        });

        btn.onclick = e => {
            e.stopPropagation();

            const itemSkill = findItemSkill(name);

            if (itemSkill) {
                // 取消收藏
                const arr = getFavoritesForSkill(itemSkill);
                const idx = arr.indexOf(name);
                if (idx > -1) {
                    arr.splice(idx, 1);
                    setFavoritesForSkill(itemSkill, arr);
                    removeFromGlobalOrder(name);
                    removeCacheForItem(itemSkill, name);

                    btn.textContent = '☆';
                    btn.style.color = 'rgb(170, 170, 170)';

                    debounceUpdate();
                    updateOtherSkillFavoriteButtons(name, false);
                }
            } else {
                // 添加收藏到当前技能
                const arr = getFavoritesForSkill(currentSkill);
                if (!arr.includes(name)) {
                    arr.push(name);
                    setFavoritesForSkill(currentSkill, arr);
                    addToGlobalOrder(name);

                    cacheItemCard(item, currentSkill);

                    btn.textContent = '⭐';
                    btn.style.color = 'rgb(255, 215, 0)';

                    debounceUpdate();
                }
            }
        };

        item.style.position = 'relative';
        item.appendChild(btn);
    }

    // 更新其他技能的收藏按钮状态
    function updateOtherSkillFavoriteButtons(itemName, isFavorited = null) {
        if (isFavorited === null) {
            isFavorited = !!findItemSkill(itemName);
        }

        const allItems = document.querySelectorAll('.SkillAction_skillAction__1esCp:not(.SkillAction_opaque__s9Yeq)');

        allItems.forEach(item => {
            const nameEl = item.querySelector('.SkillAction_name__2VPXa');
            if (nameEl && nameEl.textContent.trim() === itemName) {
                const btn = item.querySelector('.mwi-fav-btn');
                if (btn) {
                    btn.textContent = isFavorited ? '⭐' : '☆';
                    btn.style.color = isFavorited ? 'rgba(255, 254, 249, 1)' : 'rgb(170, 170, 170)';
                }
            }
        });
    }

    function updateAllFavoriteButtons() {
        const allItems = document.querySelectorAll('.SkillAction_skillAction__1esCp:not(.SkillAction_opaque__s9Yeq)');
        const currentSkill = document.querySelector('.NavigationBar_active__3R-QS .NavigationBar_label__1uH-y')?.textContent.trim();

        allItems.forEach(item => {
            const btn = item.querySelector('.mwi-fav-btn');
            if (btn) {
                const nameEl = item.querySelector('.SkillAction_name__2VPXa');
                if (nameEl) {
                    const name = nameEl.textContent.trim();
                    const isFavorited = !!findItemSkill(name);

                    btn.textContent = isFavorited ? '⭐' : '☆';
                    btn.style.color = isFavorited ? 'rgb(255, 215, 0)' : 'rgb(170, 170, 170)';

                    if (isFavorited && currentSkill && !getCachedItem(currentSkill, name)) {
                        setTimeout(() => {
                            cacheItemCard(item, currentSkill);
                        }, 10);
                    }
                }
            }
        });
    }

    // ==================== Tab 切换和跨技能跳转 ====================

    function getLastTabIndex(skill) {
        const data = getCharacterData();
        return data.lastTabs[skill] !== undefined ? data.lastTabs[skill] : 0;
    }

    function setLastTabIndex(skill, idx) {
        const data = getCharacterData();
        data.lastTabs[skill] = idx;
        setCharacterData(data);
    }

    /**
     * 为“挤奶”和“伐木”这种没有原生标签页的技能注入 Mui Tab 结构
     */
    function injectTabStructure(root, skill) {
        // 检查是否已经注入
        if (root.querySelector('.MuiTabs-root')) {
            return;
        }

        const tabsComponentContainer = root.querySelector('.GatheringProductionSkillPanel_tabsComponentContainer__3Ua1T');
        if (!tabsComponentContainer) return;

        const tabsComponent = tabsComponentContainer.querySelector('.TabsComponent_tabsComponent__3PqGp');
        const panelsContainer = tabsComponentContainer.querySelector('.TabsComponent_tabPanelsContainer__26mzo');

        if (!tabsComponent || !panelsContainer) return;

        // 1. 创建 Tab 结构
        const tabsContainer = document.createElement('div');
        tabsContainer.className = 'TabsComponent_tabsContainer__3BDUp TabsComponent_wrap__3fEC7';

        const muiTabsRoot = document.createElement('div');
        muiTabsRoot.className = 'MuiTabs-root css-orq8zk'; // 使用通用的 Mui Tabs 类

        const muiTabsScroller = document.createElement('div');
        muiTabsScroller.className = 'MuiTabs-scroller MuiTabs-fixed css-1anid1y';
        muiTabsScroller.style.overflow = 'hidden';
        muiTabsScroller.style.marginBottom = '0px';

        const muiTabsFlexContainer = document.createElement('div');
        muiTabsFlexContainer.className = 'MuiTabs-flexContainer css-k008qs';
        muiTabsFlexContainer.setAttribute('role', 'tablist');

        const indicator = document.createElement('span');
        indicator.className = 'MuiTabs-indicator css-ttwr4n';
        indicator.style.left = '0px';
        indicator.style.width = '0px';

        // 2. 创建第一个 Tab 按钮（原操作列表）
        const originalTabButton = document.createElement('button');
        originalTabButton.className = 'MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5 Mui-selected';
        originalTabButton.setAttribute('role', 'tab');
        originalTabButton.setAttribute('aria-selected', 'true');
        originalTabButton.setAttribute('tabindex', '0');
        // V3.9: 添加自定义标识
        originalTabButton.setAttribute('data-mwi-custom-tab', 'true');
        originalTabButton.innerHTML = `<span class="MuiBadge-root TabsComponent_badge__1Du26 css-1rzb3uu">${skill}<span class="MuiBadge-badge MuiBadge-standard MuiBadge-invisible MuiBadge-anchorOriginTopRight MuiBadge-anchorOriginTopRightRectangular MuiBadge-overlapRectangular css-vwo4eg"></span></span><span class="MuiTouchRipple-root css-w0pj6f"></span>`;

        // 3. 组装 Tab 栏
        muiTabsFlexContainer.appendChild(originalTabButton);
        muiTabsScroller.appendChild(muiTabsFlexContainer);
        muiTabsScroller.appendChild(indicator);
        muiTabsRoot.appendChild(muiTabsScroller);
        tabsContainer.appendChild(muiTabsRoot);

        // 4. 注入 Tab 栏结构
        tabsComponent.insertBefore(tabsContainer, panelsContainer);

        // 5. 调整原有的内容面板：使其成为第一个 Tab 的面板并显示
        const originalPanel = panelsContainer.querySelector('.TabPanel_tabPanel__tXMJF');
        if (originalPanel) {
            // 确保第一个面板可见
            originalPanel.classList.remove('TabPanel_hidden__26UM3');
        }
    }


    // 仅在有 Tab 结构的技能面板中创建“收藏”Tab
    function ensureFavoritesTab(tabsContainer, skill) {
        let favTab = tabsContainer.querySelector('.mwi-fav-tab');
        if (favTab) return;

        const tabsFlex = tabsContainer.querySelector('.MuiTabs-flexContainer');
        if (!tabsFlex) return;

        const tabsComponentContainer = tabsContainer.closest('.GatheringProductionSkillPanel_tabsComponentContainer__3Ua1T');
        if (!tabsComponentContainer) return;

        const panelsContainer = tabsComponentContainer.querySelector('.TabsComponent_tabPanelsContainer__26mzo');
        if (!panelsContainer) return;

        // --- 1. 创建 Tab 按钮 ---
        const tab = document.createElement('button');
        tab.className = 'MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary css-1q2h7u5 mwi-fav-tab';
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-selected', 'false');
        tab.setAttribute('tabindex', '-1');
        // V3.9: 添加自定义标识
        tab.setAttribute('data-mwi-custom-tab', 'true');
        tab.innerHTML = `<span style="position:relative; display:inline-flex; align-items:center;">收藏</span><span class="MuiTouchRipple-root css-w0pj6f"></span>`;
        tabsFlex.appendChild(tab);

        // --- 2. 创建 Tab 面板 ---
        const panel = document.createElement('div');
        panel.className = 'TabPanel_tabPanel__tXMJF TabPanel_hidden__26UM3 mwi-fav-panel';
        panel.style.padding = '24px';
        panel.style.position = 'relative';
        panelsContainer.appendChild(panel);
    }

    function switchToTab(skill, targetIdx) {
        const root = document.querySelector('.GatheringProductionSkillPanel_gatheringProductionSkillPanel__vG4M7');
        if (!root) return;

        const tabsContainer = root.querySelector('.MuiTabs-root');
        if (!tabsContainer) return;

        const tabsFlex = tabsContainer.querySelector('.MuiTabs-flexContainer');
        if (!tabsFlex) return;

        const tabs = Array.from(tabsFlex.children);
        const indicator = tabsContainer.querySelector('.MuiTabs-indicator');
        // 确保获取到所有面板，包括原生的和自定义的
        const panels = root.querySelectorAll('.TabsComponent_tabPanelsContainer__26mzo > .TabPanel_tabPanel__tXMJF');

        // 再次检查边界，防止出现越界错误
        if (targetIdx < 0 || targetIdx >= tabs.length) {
             console.error(`[MWI Fav] Invalid target index: ${targetIdx} for skill ${skill}`);
             return;
        }

        // 更新按钮状态
        tabs.forEach((t, i) => {
            t.classList.toggle('Mui-selected', i === targetIdx);
            t.setAttribute('aria-selected', i === targetIdx);
            t.setAttribute('tabindex', i === targetIdx ? '0' : '-1');
        });

        // 更新面板状态 (原生面板 + 收藏面板)
        panels.forEach((p, i) => {
            p.classList.toggle('TabPanel_hidden__26UM3', i !== targetIdx);
        });

        // 更新指示器位置
        if (indicator && tabs[targetIdx]) {
            // 计算目标 Tab 之前所有 Tab 的宽度总和 (用于确定 translateX)
            const left = tabs.slice(0, targetIdx).reduce((s, t) => s + t.offsetWidth, 0);

            const tabsRoot = root.querySelector('.MuiTabs-root');
            // 获取 MuiTabs-root 的滚动位置，确保指示器在滚动时位置正确
            const scrollLeft = tabsRoot ? tabsRoot.scrollLeft : 0;

            const indicatorX = left - scrollLeft;
            const indicatorW = tabs[targetIdx].offsetWidth;

            indicator.style.transform = `translateX(${indicatorX}px)`;
            indicator.style.width = `${indicatorW}px`;

            // 确保指示器的颜色也正确 (游戏原始颜色)
            indicator.style.backgroundColor = 'rgb(240, 240, 240)';
        }

        // 关键：保存正确的 Tab 索引
        setLastTabIndex(skill, targetIdx);
        if (targetIdx === tabs.length - 1 && targetIdx >= 0) {
            updateFavoritesPanel(skill);
        }
    }

    function setPendingClick(skill, itemName, selectedSkillsForTarget) {
        if (isProcessingClick) return;

        sessionStorage.setItem(PENDING_CLICK_KEY, JSON.stringify({
            skill,
            itemName,
            selectedSkills: Array.from(selectedSkillsForTarget)
        }));
    }

    function getPendingClick() {
        const data = sessionStorage.getItem(PENDING_CLICK_KEY);
        sessionStorage.removeItem(PENDING_CLICK_KEY);
        return data ? JSON.parse(data) : null;
    }

    function handlePendingClick() {
        if (isProcessingClick) return;

        const pending = getPendingClick();
        if (!pending) return;

        const { skill, itemName, selectedSkills: savedSelectedSkills } = pending;

        const currentSkillLabel = document.querySelector('.NavigationBar_active__3R-QS .NavigationBar_label__1uH-y');
        if (!currentSkillLabel || currentSkillLabel.textContent.trim() !== skill) return;

        isProcessingClick = true;

        if (savedSelectedSkills && savedSelectedSkills.length > 0) {
            selectedSkills.clear();
            savedSelectedSkills.forEach(s => selectedSkills.add(s));
        }

        // V4.0: 使用 setTimeout 延迟，确保页面导航和 Tab 结构加载完成
        setTimeout(() => {
            try {
                const root = document.querySelector('.GatheringProductionSkillPanel_gatheringProductionSkillPanel__vG4M7');

                // 确保 Tab 结构已存在，特别是对于挤奶/伐木
                if ((skill === '挤奶' || skill === '伐木') && !root.querySelector('.MuiTabs-root')) {
                    injectTabStructure(root, skill);
                }

                const tabsContainer = root?.querySelector('.MuiTabs-root');

                // 只有有 tab 的技能才需要切换 tab
                if (tabsContainer) {
                    const tabsFlex = tabsContainer.querySelector('.MuiTabs-flexContainer');
                    if (tabsFlex) {
                        const favTabIdx = tabsFlex.children.length - 1;
                        const favTab = tabsFlex.children[favTabIdx];
                        if (favTab) {
                            // 强制切换到收藏页
                            switchToTab(skill, favTabIdx);
                        }
                    }
                }

                setTimeout(() => {
                    clickTargetItem(itemName, skill);
                    isProcessingClick = false;
                }, 50); // 再次延迟 50ms 确保收藏 Tab 内容渲染完毕
            } catch (e) {
                isProcessingClick = false;
            }
        }, 100); // 延迟 100ms 等待技能页面完全加载
    }

    function clickTargetItem(itemName, skill) {
        const itemEl = Array.from(document.querySelectorAll('.SkillAction_skillAction__1esCp')).find(item =>
            item.querySelector('.SkillAction_name__2VPXa')?.textContent.trim() === itemName
        );

        if (itemEl && !itemEl.classList.contains('SkillAction_opaque__s9Yeq')) {
            itemEl.click();
        }
    }

    // ==================== 收藏面板（多选版本）====================
    function updateFavoritesPanel(currentSkill) {
        const panel = document.querySelector('.mwi-fav-panel');
        if (!panel) return;

        const scrollTop = panel.scrollTop;
        panel.innerHTML = '';

        const allFavorites = getCharacterData().allFavorites;
        const skillCounts = allowedSkills.reduce((acc, skill) => {
            acc[skill] = allFavorites[skill]?.length || 0;
            return acc;
        }, {});

        const skillsWithFavorites = allowedSkills.filter(skill => skillCounts[skill] > 0);

        // --- 技能选择逻辑 ---
        if (selectedSkills.size === 0) {
            const savedSkills = getSelectedSkills();
            savedSkills.forEach(skill => selectedSkills.add(skill));
            if (selectedSkills.size > 0 && savedSkills.length !== Array.from(selectedSkills).length) {
                 saveSelectedSkills(Array.from(selectedSkills));
            }
        } else {
            selectedSkills.forEach(skill => {
                if (!skillsWithFavorites.includes(skill)) {
                    selectedSkills.delete(skill);
                }
            });
            if (selectedSkills.size === 0 && skillsWithFavorites.length > 0) {
                 selectedSkills.add(skillsWithFavorites[0]);
            }
            saveSelectedSkills(Array.from(selectedSkills));
        }

        // --- 筛选容器 ---
        const filterContainer = document.createElement('div');
        filterContainer.style.marginBottom = '20px';
        filterContainer.style.display = 'flex';
        filterContainer.style.gap = '8px';
        filterContainer.style.flexWrap = 'wrap';
        filterContainer.style.alignItems = 'center';
        filterContainer.className = 'mwi-filter-container';

        const createFilterButton = (text, isSelected, clickHandler) => {
            const btn = document.createElement('button');
            btn.className = 'MuiButtonBase-root MuiTab-root MuiTab-textColorPrimary mwi-filter-btn';
            btn.textContent = text;
            Object.assign(btn.style, {
                minWidth: '0', padding: '6px 12px', margin: '0', border: 'none', cursor: 'pointer',
                background: isSelected ? '#3a3a3a' : 'none', color: isSelected ? 'white' : 'rgba(255, 255, 255, 0.7)',
                borderRadius: '4px', transition: 'all 0.2s', fontWeight: isSelected ? '500' : '400',
                textTransform: 'none'
            });
            btn.addEventListener('mouseenter', () => { btn.style.background = isSelected ? '#3a3a3a' : 'rgba(255, 255, 255, 0.08)'; });
            btn.addEventListener('mouseleave', () => { btn.style.background = isSelected ? '#3a3a3a' : 'none'; });
            btn.addEventListener('click', clickHandler);
            return btn;
        };

        const isAllSelected = selectedSkills.size === skillsWithFavorites.length && skillsWithFavorites.length > 0;
        filterContainer.appendChild(createFilterButton('全选', isAllSelected, () => {
            if (isAllSelected) { selectedSkills.clear(); } else { selectedSkills.clear(); skillsWithFavorites.forEach(skill => selectedSkills.add(skill)); }
            saveSelectedSkills(Array.from(selectedSkills)); updateFavoritesPanel(currentSkill);
        }));

        filterContainer.appendChild(createFilterButton('反选', false, () => {
            const allSelected = Array.from(selectedSkills);
            selectedSkills.clear();
            skillsWithFavorites.forEach(skill => {
                if (!allSelected.includes(skill)) { selectedSkills.add(skill); }
            });
            if (selectedSkills.size === 0 && skillsWithFavorites.length > 0) { selectedSkills.add(skillsWithFavorites[0]); }
            saveSelectedSkills(Array.from(selectedSkills)); updateFavoritesPanel(currentSkill);
        }));

        skillsWithFavorites.forEach(skill => {
            const isSelected = selectedSkills.has(skill);
            filterContainer.appendChild(createFilterButton(`${skill} (${skillCounts[skill]})`, isSelected, () => {
                if (selectedSkills.has(skill)) { if (selectedSkills.size > 1) { selectedSkills.delete(skill); } } else { selectedSkills.add(skill); }
                saveSelectedSkills(Array.from(selectedSkills)); updateFavoritesPanel(currentSkill);
            }));
        });

        panel.appendChild(filterContainer);

        // 清空选中收藏按钮
        const clearBtn = document.createElement('button');
        clearBtn.className = 'mwi-clear-favs-btn';
        clearBtn.textContent = '×';
        clearBtn.title = '清空选中技能的收藏';
        Object.assign(clearBtn.style, {
            position: 'absolute', top: '4px', right: '4px', background: 'none', border: 'none',
            color: '#999', fontSize: '20px', cursor: 'pointer', width: '24px', height: '24px',
            borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '0', zIndex: '100', opacity: '0.5', transition: 'opacity 0.2s'
        });

        clearBtn.addEventListener('mouseenter', () => { clearBtn.style.opacity = '1'; clearBtn.style.color = '#ff4444'; });
        clearBtn.addEventListener('mouseleave', () => { clearBtn.style.opacity = '0.5'; clearBtn.style.color = '#999'; });

        clearBtn.addEventListener('click', () => {
            if (selectedSkills.size === 0) return;

            const skillsList = Array.from(selectedSkills).join('、');
            if (confirm(`确定要清空选中技能（${skillsList}）的所有收藏吗？`)) {

                selectedSkills.forEach(skill => {
                    getFavoritesForSkill(skill)?.forEach(name => {
                         removeFromGlobalOrder(name);
                         removeCacheForItem(skill, name);
                    });
                    setFavoritesForSkill(skill, []);
                });

                debounceUpdate();
                selectedSkills.clear();
                saveSelectedSkills(Array.from(selectedSkills));
                updateFavoritesPanel(currentSkill);
            }
        });

        panel.appendChild(clearBtn);

        // 创建物品容器
        const grid = document.createElement('div');
        grid.className = 'SkillActionGrid_skillActionGrid__1tJFk';
        panel.appendChild(grid);

        // 使用 globalOrder 作为排序来源
        const globalOrder = getGlobalOrder();
        const displayItems = [];

        globalOrder.forEach(name => {
            const originalSkill = findItemSkill(name);
            if (originalSkill && selectedSkills.has(originalSkill)) {
                displayItems.push({ name: name, skill: originalSkill });
            }
        });

        if (displayItems.length === 0) {
            grid.innerHTML = `<div style="color:#aaa;padding:40px;text-align:center;">
                                ${skillsWithFavorites.length === 0 ? '暂无任何收藏物品' : (selectedSkills.size === 0 ? '请选择要显示的技能' : '选中的技能暂无收藏物品')}
                            </div>`;
            return;
        }

        // 获取仓库物品数据
        const inventoryItems = getInventoryItems();
        
        // 显示物品卡片
        displayItems.forEach((item) => {
            let clone;
            const cachedHtml = getCachedItem(item.skill, item.name);
            if (cachedHtml) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = cachedHtml;
                clone = tempDiv.firstChild;
            } else {
                clone = createSimpleItemCard(item.name);
            }

            if (!clone || clone.nodeType !== 1) { clone = createSimpleItemCard(item.name); }

            clone.dataset.name = item.name;
            clone.dataset.skill = item.skill;
            clone.style.position = 'relative';
            clone.style.opacity = '1';
            
            // 获取物品的仓库数量
            const itemCount = inventoryItems[item.name] || '0';
            
            // 移除已存在的数量显示元素（如果有）
            const existingCount = clone.querySelector('.mwi-item-count');
            if (existingCount) {
                existingCount.remove();
            }
            
            // 创建数量显示元素
            const countElement = document.createElement('div');
            countElement.className = 'mwi-item-count';
            countElement.textContent = itemCount;
            Object.assign(countElement.style, {
                position: 'absolute',
                bottom: '10px', // 垂直上移
                left: '0',
                right: '0',
                width: '100%', // 水平居中
                background: 'none', // 无背景
                color: '#cccccc', // 浅灰色
                fontSize: '11px',
                fontWeight: 'bold',
                padding: '1px 4px',
                textAlign: 'center',
                zIndex: '5'
            });
            
            // 将数量显示元素添加到物品卡片中
            clone.appendChild(countElement);

            const existingBtns = clone.querySelectorAll('.mwi-fav-btn');
            existingBtns.forEach(btn => btn.remove());

            const favBtn = document.createElement('button');
            favBtn.className = 'mwi-fav-btn mwi-panel-fav-btn';
            favBtn.textContent = '⭐';
            Object.assign(favBtn.style, {
                position: 'absolute', top: '4px', right: '4px', background: 'none',
                border: 'none', fontSize: '18px', cursor: 'pointer', zIndex: '10',
                color: 'rgb(255, 215, 0)'
            });

            favBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const itemSkill = findItemSkill(item.name);
                if (itemSkill) {
                    const arr = getFavoritesForSkill(itemSkill);
                    const index = arr.indexOf(item.name);
                    if (index > -1) {
                        arr.splice(index, 1);
                        setFavoritesForSkill(itemSkill, arr);
                        removeFromGlobalOrder(item.name);
                        removeCacheForItem(itemSkill, item.name);

                        updateFavoritesPanel(currentSkill);
                        debounceUpdate();
                    }
                }
            });

            clone.appendChild(favBtn);
            clone.addEventListener('click', (e) => {
                if (e.target.closest('.mwi-fav-btn')) return;
                e.stopPropagation();

                const itemSkill = item.skill;
                const currentActiveSkill = document.querySelector('.NavigationBar_active__3R-QS .NavigationBar_label__1uH-y')?.textContent.trim();

                if (itemSkill === currentActiveSkill) {
                    const itemEl = Array.from(document.querySelectorAll('.SkillAction_skillAction__1esCp')).find(itemEl =>
                        itemEl.querySelector('.SkillAction_name__2VPXa')?.textContent.trim() === item.name
                    );
                    if (itemEl) itemEl.click();
                } else {
                    setPendingClick(itemSkill, item.name, selectedSkills);

                    const skillNavs = document.querySelectorAll('.NavigationBar_button__3L1eA, .NavigationBar_navigationLink__3eAHA');
                    const targetNav = Array.from(skillNavs).find(nav => {
                        const label = nav.querySelector('.NavigationBar_label__1uH-y');
                        return label && label.textContent.trim() === itemSkill;
                    });

                    if (targetNav) targetNav.click();
                }
            });

            // --- 跨技能拖拽排序逻辑 ---
            clone.draggable = true;

            clone.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', JSON.stringify({ name: item.name }));
                clone.classList.add('dragging');
                clone.style.opacity = '0.4';
            });

            clone.addEventListener('dragend', () => {
                clone.classList.remove('dragging');
                clone.style.opacity = '1';
                grid.querySelectorAll('.SkillAction_skillAction__1esCp').forEach(c => { c.style.border = ''; });
            });

            clone.addEventListener('dragenter', (e) => {
                e.preventDefault();
                if (clone.classList.contains('dragging')) return;
                clone.style.border = '2px solid #555';
            });

            clone.addEventListener('dragleave', () => {
                clone.style.border = '';
            });

            grid.appendChild(clone);
        });

        // 拖拽释放（处理跨技能排序）
        grid.addEventListener('dragover', (e) => e.preventDefault());

        grid.addEventListener('drop', (e) => {
            e.preventDefault();

            const draggedCard = document.querySelector('.SkillAction_skillAction__1esCp.dragging');
            if (draggedCard) draggedCard.style.opacity = '1';

            try {
                const data = JSON.parse(e.dataTransfer.getData('text/plain'));
                const draggedName = data.name;

                const target = e.target.closest('.SkillAction_skillAction__1esCp');
                if (!target || target.dataset.name === draggedName) return;

                const targetName = target.dataset.name;

                const currentGlobalOrder = getGlobalOrder();

                const fromIndex = currentGlobalOrder.indexOf(draggedName);
                const toIndex = currentGlobalOrder.indexOf(targetName);

                if (fromIndex > -1 && toIndex > -1) {
                    const [movedItem] = currentGlobalOrder.splice(fromIndex, 1);
                    currentGlobalOrder.splice(toIndex, 0, movedItem);

                    setGlobalOrder(currentGlobalOrder);

                    updateFavoritesPanel(currentSkill);
                }
            } catch (e) {
                console.error("拖拽错误:", e);
             } finally {
                grid.querySelectorAll('.SkillAction_skillAction__1esCp').forEach(c => { c.style.border = ''; });
             }
        });

        panel.scrollTop = scrollTop;
    }

    function createSimpleItemCard(itemName) {
        const card = document.createElement('div');
        card.className = 'SkillAction_skillAction__1esCp';
        card.innerHTML = `<div class="SkillAction_container__2Qbcu" style="height: 100%;">
                <div class="SkillAction_iconWrapper__mjk5b" style="width: 48px; height: 48px;">
                    <div class="SkillAction_iconBackground__3LSVo"></div>
                    <div class="SkillAction_icon__3JYqX" style="font-size: 24px;">⚠️</div>
                </div>
                <div class="SkillAction_textContent__2k4Vw">
                    <div class="SkillAction_name__2VPXa">${itemName}</div>
                    <div class="SkillAction_description__1q5Xp" style="color: #ffaa00; font-size: 12px;">缓存丢失</div>
                </div>
            </div>`;
        card.style.cursor = 'pointer';
        return card;
    }

    function updateFavoritesPanelIfOpen() {
        const panel = document.querySelector('.mwi-fav-panel');
        if (panel && !panel.classList.contains('TabPanel_hidden__26UM3')) {
            const skill = document.querySelector('.NavigationBar_active__3R-QS .NavigationBar_label__1uH-y')?.textContent.trim();
            if (skill && allowedSkills.includes(skill)) {
                // 只有 Tabbed 技能才需要更新面板
                if (document.querySelector('.GatheringProductionSkillPanel_gatheringProductionSkillPanel__vG4M7')) {
                     updateFavoritesPanel(skill);
                }
            }
        }
    }

    // ==================== 仓库物品数量获取 ====================
    /**
     * 获取仓库中所有物品的名称和数量
     * @returns {Object} 物品名称到数量的映射
     */
    // 仓库物品数据缓存
    let inventoryDataCache = {};

    // 从DOM中获取仓库物品数据
    function getInventoryItems() {
        const inventory = {};
        
        // 查找仓库容器（使用更通用的选择器，不依赖其他脚本添加的类）
        const inventoryContainer = document.querySelector('.Inventory_items__6SXv0');
        if (!inventoryContainer) {
            return inventory;
        }
        
        // 遍历所有物品（不依赖分类结构，直接查找所有物品容器）
        const allItems = inventoryContainer.querySelectorAll('.Item_itemContainer__x7kH1');
        
        allItems.forEach((item, index) => {
            // 获取物品名称（检查所有可能的路径）
            let iconContainer = item.querySelector('.Item_iconContainer__5z7j4');
            if (!iconContainer) {
                // 尝试更深层的路径
                iconContainer = item.querySelector('.Item_item__2De2O .Item_iconContainer__5z7j4');
            }
            if (!iconContainer) {
                return;
            }
            
            // 首先尝试直接从iconContainer获取aria-label
            let itemName = iconContainer.getAttribute('aria-label');
            
            // 如果没找到，检查内部的svg元素
            if (!itemName) {
                const svgElement = iconContainer.querySelector('svg[role="img"]');
                if (svgElement) {
                    itemName = svgElement.getAttribute('aria-label');
                }
            }
            
            // 如果还是没找到，尝试检查所有子元素
            if (!itemName) {
                const childWithAriaLabel = iconContainer.querySelector('[aria-label]');
                if (childWithAriaLabel) {
                    itemName = childWithAriaLabel.getAttribute('aria-label');
                }
            }
            
            if (!itemName) {
                return;
            }
            
            // 获取物品数量
            let countElement = item.querySelector('.Item_count__1HVvv');
            if (!countElement) {
                // 尝试更深层的路径
                countElement = item.querySelector('.Item_item__2De2O .Item_count__1HVvv');
            }
            const count = countElement ? countElement.textContent.trim() : '0';
            
            // 存储到映射中
            inventory[itemName] = count;
        });
        
        // 更新缓存
        inventoryDataCache = inventory;
        return inventory;
    }

    // 监听仓库变化的Observer
    const inventoryObserver = new MutationObserver(() => {
        getInventoryItems();
        
        // 仓库数据变化时，自动更新收藏面板的物品数量显示
        updateFavoritesPanelIfOpen();
    });

    // 启动仓库监听
    function startInventoryObserver() {
        // 先尝试直接获取一次数据
        getInventoryItems();
        
        // 设置定时器定期检查仓库面板是否打开
        const checkInventoryInterval = setInterval(() => {
            const inventoryContainer = document.querySelector('.Inventory_items__6SXv0');
            if (inventoryContainer) {
                // 观察仓库容器的变化
                inventoryObserver.observe(inventoryContainer, {
                    childList: true,
                    subtree: true,
                    characterData: true
                });
                
                // 清除定时器
                clearInterval(checkInventoryInterval);
            }
        }, 2000); // 每2秒检查一次
    }

    // ==================== 主循环 ====================
    hookCharacterId();
    selectedSkills = new Set(getSelectedSkills());
    
    // 启动仓库数据监听
    startInventoryObserver();

    const observer = new MutationObserver(() => {
        handlePendingClick();

        const skillLabel = document.querySelector('.NavigationBar_active__3R-QS .NavigationBar_label__1uH-y');
        const skill = skillLabel?.textContent.trim();
        if (!skill || !allowedSkills.includes(skill)) return;

        const root = document.querySelector('.GatheringProductionSkillPanel_gatheringProductionSkillPanel__vG4M7');
        if (!root) {
            // V4.1: 如果技能面板根元素不存在，将 lastObservedSkill 置空，确保下次加载时被视为新技能
            lastObservedSkill = null;
            return;
        }

        // V4.1 FIX: 检查技能是否切换
        const isNewSkillLoad = skill !== lastObservedSkill;


        // **新逻辑：为挤奶和伐木注入 Tab 结构**
        if (skill === '挤奶' || skill === '伐木') {
            injectTabStructure(root, skill);
        }

        const tabsContainer = root.querySelector('.MuiTabs-root');
        const isTabbedSkill = !!tabsContainer;

        // 2. 无论是否为 Tabbed 技能，都为物品卡片添加收藏按钮
        document.querySelectorAll('.SkillAction_skillAction__1esCp:not(.SkillAction_opaque__s9Yeq)')
            .forEach(item => addFavoriteButton(item, skill));

        // 3. 只有 Tabbed 技能才执行 Tab 相关的逻辑
        if (isTabbedSkill) {

            ensureFavoritesTab(tabsContainer, skill);

            const tabsFlex = tabsContainer.querySelector('.MuiTabs-flexContainer');
            if (!tabsFlex) return;

            const tabs = tabsFlex.querySelectorAll('button');
            const total = tabs.length;

            // V4.2 FIX: 重新添加事件监听器，确保兼容原生行为并修正自定义 Tab 的状态
            tabs.forEach((tab, i) => {
                // 检查是否已添加监听器
                if (tab.hasAttribute('data-mwi-listener-added')) return;

                tab.setAttribute('data-mwi-listener-added', 'true');
                const isCustomTab = tab.hasAttribute('data-mwi-custom-tab');
                const isFavTab = tab.classList.contains('mwi-fav-tab');

                // 备份原有的点击事件（仅对原生Tab有效）
                const originalClickListener = tab.onclick;
                tab.onclick = null; // 清除原有的 onclick 属性

                tab.addEventListener('click', (e) => {
                    // 获取最新的标签和面板列表
                    const updatedTabs = Array.from(tabsFlex.children);
                    const updatedPanels = root.querySelectorAll('.TabsComponent_tabPanelsContainer__26mzo > .TabPanel_tabPanel__tXMJF');
                    const currentIdx = updatedTabs.indexOf(tab);
                    
                    if (isFavTab) {
                        // 场景 1: 点击的是收藏 Tab
                        e.stopPropagation();
                        switchToTab(skill, currentIdx);
                    } else {
                        // 场景 2: 点击的是原生 Tab（包括挤奶/伐木的原生 Tab）
                        
                        // 1. 触发原生逻辑，让 React 更新其内部状态
                        if (originalClickListener) {
                             try {
                                 originalClickListener.call(tab, e);
                             } catch (err) {
                                 // 忽略原生事件可能的错误
                             }
                        }

                        // 2. 强制更新所有标签状态
                        updatedTabs.forEach((t, idx) => {
                            const isSelected = idx === currentIdx;
                            t.classList.toggle('Mui-selected', isSelected);
                            t.setAttribute('aria-selected', isSelected);
                            t.setAttribute('tabindex', isSelected ? '0' : '-1');
                        });

                        // 3. 强制更新所有面板状态
                        updatedPanels.forEach((p, idx) => {
                            p.classList.toggle('TabPanel_hidden__26UM3', idx !== currentIdx);
                        });

                        // 4. 修复收藏 Tab 状态
                        const favTab = root.querySelector('.mwi-fav-tab');
                        if (favTab) {
                            favTab.classList.remove('Mui-selected');
                            favTab.setAttribute('aria-selected', 'false');
                            favTab.setAttribute('tabindex', '-1');
                        }

                        // 5. 持久化索引
                        setLastTabIndex(skill, currentIdx);
                    }
                });
            });


            // 标签页加载持久化逻辑
            const savedIdx = Math.min(getLastTabIndex(skill), total - 1);
            const currentIdx = Array.from(tabs).findIndex(t => t.classList.contains('Mui-selected'));

            // V4.3 FIX: 核心逻辑：只有在技能刚刚加载时，且目标索引与当前不一致才执行强制切换。
            // 依赖 isNewSkillLoad 确保仅在通过导航栏切换技能时触发。
            if (isNewSkillLoad && currentIdx !== savedIdx) {
                tabRestoreTimeout = setTimeout(() => {
                    // 再次检查当前激活的技能是否一致，以防用户在延迟期间切换了技能
                    const currentSkillCheck = document.querySelector('.NavigationBar_active__3R-QS .NavigationBar_label__1uH-y')?.textContent.trim();
                    if (currentSkillCheck !== skill) return;

                    switchToTab(skill, savedIdx);

                }, 100); // 增加延迟到 100ms 解决可能的竞态条件 (Race Condition)
            }
        }

        // V4.1 核心：在 observer 结束前更新 lastObservedSkill，以检测下一次的技能切换。
        if(skill) {
             lastObservedSkill = skill;
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });
})();