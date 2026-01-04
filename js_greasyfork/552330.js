// ==UserScript==
// @name         MWI_Toolkit
// @version      5.3.6
// @namespace    http://tampermonkey.net/
// @description  MWI工具集
// @author       zqzhang1996
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidlecn.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-body
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/552330/MWI_Toolkit.user.js
// @updateURL https://update.greasyfork.org/scripts/552330/MWI_Toolkit.meta.js
// ==/UserScript==
(function () {
    'use strict';
    //#region Calculator
    class TargetItemCategory {
        constructor(categoryHrid, needCalc = true) {
            this.needCalc = true;
            this.categoryDetailsElement = null;
            this.categorySummaryElement = null;
            this.needCalcCheckbox = null;
            this.categoryHrid = categoryHrid;
            this.needCalc = needCalc;
        }
        updateDisplayElement() {
            this.categoryDetailsElement.style.background = this.needCalc ? '#0E4F32' : '#2c2e45';
            this.categorySummaryElement.style.background = this.needCalc ? '#147147' : '#393a5b';
            this.needCalcCheckbox.checked = this.needCalc;
        }
    }
    class DisplayItem {
        constructor(itemHrid, count) {
            this.itemHrid = itemHrid;
            this.count = count;
            this.initDisplayProperties();
        }
        initDisplayProperties() {
            if ([...MWI_Toolkit_ActionDetailPlus.processableItemMap.values()].includes(this.itemHrid)) {
                this.categoryHrid = '/item_categories/materials';
            }
            else if (this.itemHrid.endsWith('_tea')) {
                this.categoryHrid = '/item_categories/tea';
            }
            else if (this.itemHrid.endsWith('_coffee')) {
                this.categoryHrid = '/item_categories/coffee';
            }
            else {
                this.categoryHrid = MWI_Toolkit.initClientData?.itemDetailMap?.[this.itemHrid].categoryHrid;
            }
            this.displayName = MWI_Toolkit_I18n.getItemName(this.itemHrid);
            this.iconHref = MWI_Toolkit_Utils.getIconHrefByItemHrid(this.itemHrid);
            this.sortIndex = MWI_Toolkit_Utils.getSortIndexByItemHrid(this.itemHrid);
        }
        getOwnedCount() {
            return MWI_Toolkit_ItemsMap.getCount(this.itemHrid);
        }
    }
    class TargetItem extends DisplayItem {
        constructor(itemHrid, count, needCalc = true) {
            super(itemHrid, count);
            this.needCalc = true;
            this.displayElement = null;
            this.needCalcCheckbox = null;
            this.ownedSpan = null;
            this.targetInput = null;
            this.needCalc = needCalc;
        }
        updateDisplayElement() {
            if (this.needCalcCheckbox) {
                this.needCalcCheckbox.checked = this.needCalc;
                this.displayElement.style.background = this.needCalc ? '' : '#2c2e45';
            }
            if (this.ownedSpan) {
                const newText = MWI_Toolkit_Utils.formatNumber(this.getOwnedCount());
                if (this.ownedSpan.textContent !== newText) {
                    this.ownedSpan.textContent = newText;
                }
            }
            if (this.targetInput) {
                const newText = this.count.toString();
                if (this.targetInput.value.trim() === '' && this.count != 0) {
                    this.targetInput.value = newText;
                }
            }
        }
        removeDisplayElement() {
            this.displayElement?.remove();
        }
    }
    class TargetHouseRoom extends TargetItem {
        constructor(houseRoomHrid, level, needCalc = true) {
            super(houseRoomHrid, level, needCalc);
        }
        initDisplayProperties() {
            this.categoryHrid = '/item_categories/house_rooms';
            this.displayName = MWI_Toolkit_I18n.getName(this.itemHrid, 'houseRoomNames');
            this.iconHref = MWI_Toolkit_Utils.getIconHrefByHouseRoomHrid(this.itemHrid);
            this.sortIndex = MWI_Toolkit_Utils.getSortIndexByHouseRoomHrid(this.itemHrid);
        }
        getOwnedCount() {
            return MWI_Toolkit.gameObject?.state?.characterHouseRoomDict?.[this.itemHrid]?.level || 0;
        }
    }
    class RequiredItem extends DisplayItem {
        constructor(itemHrid, count, shortageCount, overflowCount) {
            super(itemHrid, count);
            this.shortageCount = 0;
            this.overflowCount = 0;
            this.shortageDisplayElement = null;
            this.requiredDisplayElement = null;
            this.shortageSpan = null;
            this.overflowSpan = null;
            this.requiredSpan = null;
            this.displayNameSpan = null;
            this.shortageCount = shortageCount;
            this.overflowCount = overflowCount;
        }
        updateDisplayElement() {
            const netCount = this.shortageCount > 0 ? -this.shortageCount : this.overflowCount;
            if (this.shortageSpan) {
                const newText = MWI_Toolkit_Utils.formatNumber(this.shortageCount);
                if (this.shortageSpan.textContent !== newText) {
                    this.shortageSpan.textContent = newText;
                }
                if (this.shortageCount > 0) {
                    let inputShortageCount = 0;
                    MWI_Toolkit_ActionDetailPlus.tryGetRecipe(this.itemHrid)?.inputs?.forEach(input => {
                        inputShortageCount += MWI_Toolkit_Calculator.requiredItemsMap.get(input.itemHrid)?.shortageCount || 0;
                    });
                    this.shortageDisplayElement.style.background = (inputShortageCount === 0 ? '#147147' : '');
                    this.shortageDisplayElement.style.display = 'flex';
                }
                else {
                    this.shortageDisplayElement.style.display = 'none';
                }
            }
            if (this.overflowSpan) {
                const newText = MWI_Toolkit_Utils.formatNumber(netCount);
                if (this.overflowSpan.textContent !== newText) {
                    this.overflowSpan.textContent = newText;
                }
                this.overflowSpan.style.color = this.shortageCount > 0 ? '#eb3f3f' : '';
            }
            if (this.requiredSpan) {
                const newText = MWI_Toolkit_Utils.formatNumber(this.count);
                if (this.requiredSpan.textContent !== newText) {
                    this.requiredSpan.textContent = newText;
                }
            }
            if (this.displayNameSpan) {
                this.displayNameSpan.textContent = Math.floor(netCount / this.count * 100) + '%';
                if (netCount < 0) {
                    this.displayNameSpan.style.color = '#eb3f3f';
                }
                else if (netCount < this.count) {
                    this.displayNameSpan.style.color = '#faa21e';
                }
                else if (netCount < 2 * this.count) {
                    this.displayNameSpan.style.color = '';
                }
                else if (netCount < 4 * this.count) {
                    this.displayNameSpan.style.color = '#59d0b9';
                }
                else {
                    this.displayNameSpan.style.color = '#4aa3e6';
                }
            }
        }
        removeDisplayElement() {
            this.shortageDisplayElement?.remove();
            this.requiredDisplayElement?.remove();
        }
    }
    class MWI_Toolkit_Calculator {
        // 获取存储键
        static getStorageKey(characterID = null) {
            if (!characterID) {
                characterID = MWI_Toolkit?.gameObject?.state?.character?.id;
            }
            return `MWI_Toolkit_Calculator_TargetItems_${characterID}`;
        }
        // 保存所有 details 元素的 open 状态
        static saveDetailsOpenState() {
            const storageKey = MWI_Toolkit_Calculator.getStorageKey();
            const storageKey_Details = storageKey.replace('TargetItems', 'DetailsOpenState');
            const detailsState = {};
            // 保存 targetItemDetailsMap
            MWI_Toolkit_Calculator.targetItemDetailsMap.forEach((details, key) => {
                detailsState[`target_${key}`] = details.open;
            });
            // 保存 shortageItemDetailsMap
            MWI_Toolkit_Calculator.shortageItemDetailsMap.forEach((details, key) => {
                detailsState[`shortage_${key}`] = details.open;
            });
            // 保存 requiredItemDetailsMap
            MWI_Toolkit_Calculator.requiredItemDetailsMap.forEach((details, key) => {
                detailsState[`required_${key}`] = details.open;
            });
            try {
                GM_setValue(storageKey_Details, JSON.stringify(detailsState));
            }
            catch (error) {
                console.error('[MWI_Toolkit] 保存Details open状态失败', error);
            }
        }
        // 恢复所有 details 元素的 open 状态
        static restoreDetailsOpenState(storageKey_Details) {
            try {
                const saved = GM_getValue(storageKey_Details, '{}');
                const detailsState = JSON.parse(saved);
                // 恢复 targetItemDetailsMap
                MWI_Toolkit_Calculator.targetItemDetailsMap.forEach((details, key) => {
                    if (typeof detailsState[`target_${key}`] === 'boolean') {
                        details.open = detailsState[`target_${key}`];
                    }
                });
                // 恢复 shortageItemDetailsMap
                MWI_Toolkit_Calculator.shortageItemDetailsMap.forEach((details, key) => {
                    if (typeof detailsState[`shortage_${key}`] === 'boolean') {
                        details.open = detailsState[`shortage_${key}`];
                    }
                });
                // 恢复 requiredItemDetailsMap
                MWI_Toolkit_Calculator.requiredItemDetailsMap.forEach((details, key) => {
                    if (typeof detailsState[`required_${key}`] === 'boolean') {
                        details.open = detailsState[`required_${key}`];
                    }
                });
            }
            catch (error) {
                console.error('[MWI_Toolkit] 恢复Details open状态失败', error);
            }
        }
        // 保存数据
        static saveCalculatorData() {
            const storageKey = MWI_Toolkit_Calculator.getStorageKey();
            const storageKey_Category = storageKey.replace('TargetItems', 'TargetItemCategories');
            const storageKey_Details = storageKey.replace('TargetItems', 'DetailsOpenState');
            MWI_Toolkit_Calculator.saveDetailsOpenState();
            const dataToSave = [...MWI_Toolkit_Calculator.targetItemsMap.values()].map(item => ({
                itemHrid: item.itemHrid,
                count: item.count,
                needCalc: item.needCalc
            }));
            const dataToSave_Category = [...MWI_Toolkit_Calculator.targetItemCategoryMap.values()].map(category => ({
                categoryHrid: category.categoryHrid,
                needCalc: category.needCalc
            }));
            try {
                GM_setValue(storageKey, JSON.stringify(dataToSave));
                GM_setValue(storageKey_Category, JSON.stringify(dataToSave_Category));
                return true;
            }
            catch (error) {
                console.error('[MWI_Toolkit]' + error);
                return false;
            }
        }
        // 从特定角色ID加载数据
        static loadCalculatorData(characterID = null) {
            const storageKey = MWI_Toolkit_Calculator.getStorageKey(characterID);
            const storageKey_Category = storageKey.replace('TargetItems', 'TargetItemCategories');
            const storageKey_Details = storageKey.replace('TargetItems', 'DetailsOpenState');
            MWI_Toolkit_Calculator.restoreDetailsOpenState(storageKey_Details);
            try {
                const savedData = GM_getValue(storageKey, '[]');
                const savedData_Category = GM_getValue(storageKey_Category, '[]');
                const loadedItems = JSON.parse(savedData);
                const loadedCategories = JSON.parse(savedData_Category);
                // 验证并转换为Item实例
                const validItemsMap = new Map(loadedItems.map((item) => {
                    try {
                        if (item.itemHrid.includes('/items/')) {
                            return [item.itemHrid, new TargetItem(item.itemHrid, item.count, typeof item.needCalc === 'boolean' ? item.needCalc : true)];
                        }
                        if (item.itemHrid.includes('/house_rooms/')) {
                            return [item.itemHrid, new TargetHouseRoom(item.itemHrid, item.count, typeof item.needCalc === 'boolean' ? item.needCalc : true)];
                        }
                    }
                    catch {
                        return null;
                    }
                }).filter((item) => item !== null));
                loadedCategories.forEach((category) => {
                    if (MWI_Toolkit_Calculator.targetItemCategoryMap.has(category.categoryHrid)) {
                        MWI_Toolkit_Calculator.targetItemCategoryMap.get(category.categoryHrid).needCalc = category.needCalc;
                    }
                    else {
                        MWI_Toolkit_Calculator.targetItemCategoryMap.set(category.categoryHrid, new TargetItemCategory(category.categoryHrid, category.needCalc));
                    }
                });
                if (validItemsMap.size > 0) {
                    MWI_Toolkit_Calculator.clearAllTargetItems();
                    MWI_Toolkit_Calculator.targetItemsMap = validItemsMap;
                    MWI_Toolkit_Calculator.renderItemsDisplay();
                    MWI_Toolkit_Calculator.saveCalculatorData();
                }
            }
            catch (error) {
                console.error('[MWI_Toolkit]' + error);
            }
        }
        // 更新目标物品
        static updateTargetItem(itemHrid, count = 1) {
            if (!itemHrid)
                return;
            const item = MWI_Toolkit_Calculator.targetItemsMap.get(itemHrid);
            if (item) {
                item.count = count;
            }
            else {
                // 添加新物品
                if (itemHrid.includes('/items/')) {
                    MWI_Toolkit_Calculator.targetItemsMap.set(itemHrid, new TargetItem(itemHrid, count));
                }
                if (itemHrid.includes('/house_rooms/')) {
                    MWI_Toolkit_Calculator.targetItemsMap.set(itemHrid, new TargetHouseRoom(itemHrid, count));
                }
            }
            MWI_Toolkit_Calculator.saveAndScheduleRender();
        }
        // 删除目标物品
        static removeTargetItem(itemHrid) {
            if (!itemHrid)
                return;
            MWI_Toolkit_Calculator.targetItemsMap.get(itemHrid)?.removeDisplayElement();
            MWI_Toolkit_Calculator.targetItemsMap.delete(itemHrid);
            MWI_Toolkit_Calculator.saveAndScheduleRender();
        }
        // 清空目标物品
        static clearAllTargetItems() {
            MWI_Toolkit_Calculator.targetItemsMap.forEach(item => item.removeDisplayElement());
            MWI_Toolkit_Calculator.targetItemsMap.clear();
            MWI_Toolkit_Calculator.saveAndScheduleRender();
        }
        // 保存数据并计划渲染
        static saveAndScheduleRender() {
            // 保存数据到存储
            MWI_Toolkit_Calculator.saveCalculatorData();
            MWI_Toolkit_Calculator.scheduleRender();
        }
        // 计划延迟渲染
        static scheduleRender() {
            // 清除之前的计时器
            if (MWI_Toolkit_Calculator.renderTimeout) {
                clearTimeout(MWI_Toolkit_Calculator.renderTimeout);
            }
            // 设置新的计时器
            MWI_Toolkit_Calculator.renderTimeout = setTimeout(() => {
                MWI_Toolkit_Calculator.renderItemsDisplay();
                MWI_Toolkit_Calculator.renderTimeout = null;
            }, 300); // 300ms 防抖延迟
        }
        // 计算所有所需材料
        static calculateAllRequiredItems(inventoryMap) {
            const result = new Map();
            const queueMap = new Map();
            MWI_Toolkit_Calculator.targetItemsMap.forEach(targetItem => {
                if (targetItem.needCalc && this.targetItemCategoryMap.get(targetItem.categoryHrid)?.needCalc) {
                    if (targetItem.itemHrid.includes('/house_rooms/')) {
                        // 处理房屋建造成本
                        const characterHouseRoomLevel = MWI_Toolkit.gameObject.state.characterHouseRoomDict?.[targetItem.itemHrid]?.level || 0;
                        const upgradeCostsMap = MWI_Toolkit.initClientData?.houseRoomDetailMap?.[targetItem.itemHrid]?.upgradeCostsMap;
                        for (let i = characterHouseRoomLevel + 1; i <= targetItem.count && i <= 8; i++) {
                            upgradeCostsMap[i].forEach(costItem => {
                                queueMap.set(costItem.itemHrid, (queueMap.get(costItem.itemHrid) || 0) + costItem.count);
                            });
                        }
                    }
                    else if (targetItem.count < 0) {
                        inventoryMap.set(targetItem.itemHrid, (inventoryMap.get(targetItem.itemHrid) || 0) - targetItem.count);
                    }
                    else {
                        queueMap.set(targetItem.itemHrid, (queueMap.get(targetItem.itemHrid) || 0) + targetItem.count);
                    }
                }
            });
            while (queueMap.size > 0) {
                const [itemHrid, need] = queueMap.entries().next().value;
                queueMap.delete(itemHrid);
                const have = inventoryMap.get(itemHrid) || 0;
                const use = Math.min(have, need);
                if (use > 0) {
                    inventoryMap.set(itemHrid, have - use);
                }
                const remain = need - use;
                if (remain > 0) {
                    result.set(itemHrid, (result.get(itemHrid) || 0) + remain);
                    const recipe = MWI_Toolkit_ActionDetailPlus.tryGetRecipe(itemHrid);
                    if (!recipe)
                        continue;
                    const times = Math.ceil(remain / recipe.outputCount);
                    for (const input of recipe.inputs) {
                        queueMap.set(input.itemHrid, (queueMap.get(input.itemHrid) || 0) + input.count * times);
                    }
                }
            }
            return result;
        }
        // 初始化计算器逻辑
        static initialize() {
            MWI_Toolkit_ItemsMap.itemsUpdatedCallbacks.push((enditemsMap) => {
                MWI_Toolkit_Calculator.scheduleRender();
            });
        }
        // 初始化计算器UI
        static initializeCalculatorUI() {
            MWI_Toolkit.waitForElement('[class^="CharacterManagement_tabsComponentContainer"] [class*="TabsComponent_tabsContainer"]', () => {
                MWI_Toolkit_Calculator.createCalculatorUI();
            });
        }
        // 初始化UI
        static createCalculatorUI() {
            // 已有标签页则不重复初始化
            if (document.querySelector('[class^="Toolkit_Calculator_Container"]')) {
                return;
            }
            // 获取容器
            const tabsContainer = document.querySelector('[class^="CharacterManagement_tabsComponentContainer"] [class*="TabsComponent_tabsContainer"]');
            const tabPanelsContainer = document.querySelector('[class^="CharacterManagement_tabsComponentContainer"] [class*="TabsComponent_tabPanelsContainer"]');
            if (!tabsContainer || !tabPanelsContainer) {
                console.error('[MWI_Toolkit_Calculator] 无法找到标签页容器');
                return;
            }
            MWI_Toolkit_Calculator.createCalculatorTab(tabsContainer, tabPanelsContainer);
            MWI_Toolkit_Calculator.targetItemsMap = new Map();
            MWI_Toolkit_Calculator.requiredItemsMap = new Map();
            // 加载保存数据
            MWI_Toolkit_Calculator.loadCalculatorData();
            console.log('[MWI_Toolkit_Calculator] UI初始化完成');
        }
        // 创建MWI计算器标签页
        static createCalculatorTab(tabsContainer, tabPanelsContainer) {
            // 新增"MWI计算器"按钮
            const oldTabButtons = tabsContainer.querySelectorAll("button");
            MWI_Toolkit_Calculator.tabButton = oldTabButtons[1].cloneNode(true);
            MWI_Toolkit_Calculator.tabButton.children[0].textContent = (MWI_Toolkit_I18n.getGameLanguage() === 'zh') ? 'MWI计算器' : 'MWI_Calculator';
            oldTabButtons[0].parentElement.appendChild(MWI_Toolkit_Calculator.tabButton);
            // 新增MWI计算器tabPanel
            const oldTabPanels = tabPanelsContainer.querySelectorAll('[class*="TabPanel_tabPanel"]');
            MWI_Toolkit_Calculator.tabPanel = oldTabPanels[1].cloneNode(false);
            oldTabPanels[0].parentElement.appendChild(MWI_Toolkit_Calculator.tabPanel);
            MWI_Toolkit_Calculator.bindCalculatorTabEvents(oldTabButtons, oldTabPanels);
            // 创建计算器面板
            const calculatorPanel = MWI_Toolkit_Calculator.createCalculatorPanel();
            MWI_Toolkit_Calculator.tabPanel.appendChild(calculatorPanel);
        }
        // 绑定标签页事件
        static bindCalculatorTabEvents(oldTabButtons, oldTabPanels) {
            for (let i = 0; i < oldTabButtons.length; i++) {
                oldTabButtons[i].addEventListener('click', () => {
                    MWI_Toolkit_Calculator.tabPanel.hidden = true; // 强制隐藏
                    MWI_Toolkit_Calculator.tabPanel.classList.add('TabPanel_hidden__26UM3');
                    MWI_Toolkit_Calculator.tabButton.classList.remove('Mui-selected');
                    MWI_Toolkit_Calculator.tabButton.setAttribute('aria-selected', 'false');
                    MWI_Toolkit_Calculator.tabButton.tabIndex = -1;
                    oldTabButtons[i].classList.add('Mui-selected');
                    oldTabButtons[i].setAttribute('aria-selected', 'true');
                    oldTabButtons[i].tabIndex = 0;
                    oldTabPanels[i].classList.remove('TabPanel_hidden__26UM3');
                    oldTabPanels[i].hidden = false; // 显示目标
                }, true);
            }
            MWI_Toolkit_Calculator.tabButton.addEventListener('click', () => {
                oldTabButtons.forEach(btn => {
                    btn.classList.remove('Mui-selected');
                    btn.setAttribute('aria-selected', 'false');
                    btn.tabIndex = -1;
                });
                oldTabPanels.forEach(panel => {
                    panel.hidden = true; // 强制隐藏
                    panel.classList.add('TabPanel_hidden__26UM3');
                });
                MWI_Toolkit_Calculator.tabButton.classList.add('Mui-selected');
                MWI_Toolkit_Calculator.tabButton.setAttribute('aria-selected', 'true');
                MWI_Toolkit_Calculator.tabButton.tabIndex = 0;
                MWI_Toolkit_Calculator.tabPanel.classList.remove('TabPanel_hidden__26UM3');
                MWI_Toolkit_Calculator.tabPanel.hidden = false; // 显示目标
            }, true);
        }
        // 创建计算器面板
        static createCalculatorPanel() {
            const calculatorPanel = document.createElement('div');
            calculatorPanel.className = 'Toolkit_Calculator_Container';
            // 创建物品搜索区域
            const addItemSection = MWI_Toolkit_Calculator.createAddItemSection();
            calculatorPanel.appendChild(addItemSection);
            // 左侧区域
            const leftDiv = document.createElement('div');
            leftDiv.style.display = 'inline-block';
            leftDiv.style.verticalAlign = 'top';
            leftDiv.style.width = '60%';
            leftDiv.style.padding = '0px 2px';
            MWI_Toolkit_Calculator.createItemDetailsMap(leftDiv, MWI_Toolkit_Calculator.targetItemDetailsMap);
            calculatorPanel.appendChild(leftDiv);
            MWI_Toolkit_Calculator.targetItemDetailsMap.forEach((details, categoryHrid) => {
                const summary = details.querySelector('summary');
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style.verticalAlign = 'middle';
                if (!MWI_Toolkit_Calculator.targetItemCategoryMap.has(categoryHrid)) {
                    MWI_Toolkit_Calculator.targetItemCategoryMap.set(categoryHrid, new TargetItemCategory(categoryHrid));
                }
                MWI_Toolkit_Calculator.targetItemCategoryMap.get(categoryHrid).categoryDetailsElement = details;
                MWI_Toolkit_Calculator.targetItemCategoryMap.get(categoryHrid).categorySummaryElement = summary;
                MWI_Toolkit_Calculator.targetItemCategoryMap.get(categoryHrid).needCalcCheckbox = checkbox;
                checkbox.checked = MWI_Toolkit_Calculator.targetItemCategoryMap.get(categoryHrid).needCalc;
                checkbox.addEventListener('change', () => {
                    MWI_Toolkit_Calculator.targetItemCategoryMap.get(categoryHrid).needCalc = checkbox.checked;
                    MWI_Toolkit_Calculator.saveAndScheduleRender();
                });
                summary.prepend(checkbox);
            });
            // 右侧区域
            const rightDiv = document.createElement('div');
            rightDiv.style.display = 'inline-block';
            rightDiv.style.verticalAlign = 'top';
            rightDiv.style.width = '40%';
            rightDiv.style.padding = '0px 2px';
            const shortageItemDetails = document.createElement('details');
            shortageItemDetails.style.background = '#902f10';
            shortageItemDetails.style.borderRadius = '4px';
            shortageItemDetails.style.padding = '2px';
            shortageItemDetails.open = true;
            const shortageSummary = document.createElement('summary');
            shortageSummary.textContent = MWI_Toolkit_I18n.getGameLanguage() === 'zh' ? '缺口' : 'Shortages';
            shortageSummary.style.background = '#af3914';
            shortageSummary.style.borderRadius = '4px';
            shortageSummary.style.fontSize = '14px';
            shortageSummary.style.padding = '2px 6px';
            shortageSummary.style.textAlign = 'left';
            shortageSummary.style.cursor = 'pointer';
            shortageItemDetails.appendChild(shortageSummary);
            MWI_Toolkit_Calculator.createItemDetailsMap(shortageItemDetails, MWI_Toolkit_Calculator.shortageItemDetailsMap);
            rightDiv.appendChild(shortageItemDetails);
            const requiredItemDetails = document.createElement('details');
            requiredItemDetails.style.background = '#0c385a';
            requiredItemDetails.style.borderRadius = '4px';
            requiredItemDetails.style.padding = '2px';
            const requiredSummary = document.createElement('summary');
            requiredSummary.textContent = MWI_Toolkit_I18n.getGameLanguage() === 'zh' ? '详情(净值/需求)' : 'Status(Net/Required)';
            requiredSummary.style.background = '#1770b3';
            requiredSummary.style.borderRadius = '4px';
            requiredSummary.style.fontSize = '14px';
            requiredSummary.style.padding = '2px 6px';
            requiredSummary.style.textAlign = 'left';
            requiredSummary.style.cursor = 'pointer';
            requiredItemDetails.appendChild(requiredSummary);
            MWI_Toolkit_Calculator.createItemDetailsMap(requiredItemDetails, MWI_Toolkit_Calculator.requiredItemDetailsMap);
            rightDiv.appendChild(requiredItemDetails);
            calculatorPanel.appendChild(rightDiv);
            return calculatorPanel;
        }
        // 创建物品分类区域
        static createItemDetailsMap(container, ItemDetailsMap) {
            MWI_Toolkit_Calculator.itemCategoryList.forEach(categoryHrid => {
                const details = document.createElement('details');
                details.style.background = '#2c2e45';
                details.style.borderRadius = '4px';
                details.style.margin = '2px 0px';
                details.style.padding = '2px 0px';
                details.open = true;
                details.addEventListener('toggle', () => {
                    MWI_Toolkit_Calculator.saveDetailsOpenState();
                });
                const summary = document.createElement('summary');
                summary.textContent = MWI_Toolkit_I18n.getName(categoryHrid, 'itemCategoryNames');
                summary.style.background = '#393a5b';
                summary.style.borderRadius = '4px';
                summary.style.fontSize = '14px';
                summary.style.padding = '2px 6px';
                summary.style.textAlign = 'left';
                summary.style.cursor = 'pointer';
                details.appendChild(summary);
                container.appendChild(details);
                ItemDetailsMap.set(categoryHrid, details);
            });
        }
        // 创建添加物品区域
        static createAddItemSection() {
            const addItemSection = document.createElement('div');
            // 左侧60%：物品搜索区域
            const leftSection = document.createElement('div');
            leftSection.style.display = 'inline-block';
            leftSection.style.verticalAlign = 'top';
            leftSection.style.width = '60%';
            const searchContainer = MWI_Toolkit_Calculator.createItemSearchComponent();
            leftSection.appendChild(searchContainer);
            // 右侧40%：房屋选择区域
            const rightSection = document.createElement('div');
            rightSection.style.display = 'inline-block';
            rightSection.style.verticalAlign = 'top';
            rightSection.style.width = '40%';
            const houseContainer = MWI_Toolkit_Calculator.createHouseRoomSelectionComponent();
            rightSection.appendChild(houseContainer);
            addItemSection.appendChild(leftSection);
            addItemSection.appendChild(rightSection);
            return addItemSection;
        }
        // 创建物品搜索组件
        static createItemSearchComponent() {
            const itemSearchComponent = document.createElement('div');
            itemSearchComponent.style.background = '#2c2e45';
            itemSearchComponent.style.border = 'none';
            itemSearchComponent.style.borderRadius = '4px';
            itemSearchComponent.style.padding = '4px';
            itemSearchComponent.style.margin = '2px';
            itemSearchComponent.style.display = 'flex';
            itemSearchComponent.style.position = 'relative';
            // 物品搜索输入框
            const itemSearchInput = document.createElement('input');
            itemSearchInput.type = 'text';
            itemSearchInput.placeholder = (MWI_Toolkit_I18n.getGameLanguage() === 'zh') ? '搜索物品名称...' : 'Search item name...';
            itemSearchInput.style.background = '#dde2f8';
            itemSearchInput.style.color = '#000000';
            itemSearchInput.style.border = 'none';
            itemSearchInput.style.borderRadius = '4px';
            itemSearchInput.style.padding = '4px';
            itemSearchInput.style.margin = '2px';
            itemSearchInput.style.minWidth = '40px';
            itemSearchInput.style.flex = '1';
            // 搜索结果下拉列表
            const searchResults = document.createElement('div');
            searchResults.style.background = '#2c2e45';
            searchResults.style.border = 'none';
            searchResults.style.borderRadius = '4px';
            searchResults.style.padding = '4px';
            searchResults.style.margin = '2px';
            searchResults.style.width = '200px';
            searchResults.style.maxHeight = '335px';
            searchResults.style.overflowY = 'auto';
            searchResults.style.zIndex = '1000';
            searchResults.style.display = 'none';
            searchResults.style.position = 'absolute';
            searchResults.style.left = '4px';
            searchResults.style.top = '32px';
            // 数量输入框
            const countInput = document.createElement('input');
            countInput.type = 'text';
            countInput.value = '1';
            countInput.placeholder = (MWI_Toolkit_I18n.getGameLanguage() === 'zh') ? '数量' : 'Count';
            countInput.style.background = '#dde2f8';
            countInput.style.color = '#000000';
            countInput.style.border = 'none';
            countInput.style.borderRadius = '4px';
            countInput.style.padding = '4px';
            countInput.style.margin = '2px';
            countInput.style.width = '60px';
            // 添加按钮
            const addButton = document.createElement('button');
            addButton.textContent = (MWI_Toolkit_I18n.getGameLanguage() === 'zh') ? '添加' : 'Add';
            addButton.style.background = '#4CAF50';
            addButton.style.color = '#FFFFFF';
            addButton.style.border = 'none';
            addButton.style.borderRadius = '4px';
            addButton.style.padding = '4px';
            addButton.style.margin = '2px';
            addButton.style.cursor = 'pointer';
            // 清空按钮
            const clearAllButton = document.createElement('button');
            clearAllButton.textContent = (MWI_Toolkit_I18n.getGameLanguage() === 'zh') ? '清空' : 'Clear';
            clearAllButton.style.background = '#eb3f3f';
            clearAllButton.style.color = '#FFFFFF';
            clearAllButton.style.border = 'none';
            clearAllButton.style.borderRadius = '4px';
            clearAllButton.style.padding = '4px';
            clearAllButton.style.margin = '2px';
            clearAllButton.style.cursor = 'pointer';
            // 绑定搜索事件
            MWI_Toolkit_Calculator.bindItemSearchComponentEvents(itemSearchInput, countInput, searchResults, addButton, clearAllButton);
            itemSearchComponent.appendChild(itemSearchInput);
            itemSearchComponent.appendChild(countInput);
            itemSearchComponent.appendChild(addButton);
            itemSearchComponent.appendChild(clearAllButton);
            itemSearchComponent.appendChild(searchResults);
            return itemSearchComponent;
        }
        // 绑定搜索相关事件
        static bindItemSearchComponentEvents(itemSearchInput, countInput, searchResults, addButton, clearAllButton) {
            // 输入框获得焦点时全选内容
            itemSearchInput.addEventListener('focus', () => {
                setTimeout(() => {
                    itemSearchInput.select();
                }, 0);
            });
            // 搜索功能
            itemSearchInput.addEventListener('input', () => {
                const searchTerm = itemSearchInput.value.toLowerCase().trim();
                if (searchTerm.length < 2) {
                    searchResults.style.display = 'none';
                    return;
                }
                // 获取并过滤物品
                const itemDetailMap = MWI_Toolkit?.initClientData?.itemDetailMap;
                if (!itemDetailMap)
                    return;
                const filteredItems = Object.keys(itemDetailMap)
                    .filter(itemHrid => {
                    return MWI_Toolkit_I18n.getItemName(itemHrid).toLowerCase().includes(searchTerm);
                })
                    .sort((a, b) => {
                    const sortIndexA = MWI_Toolkit_Utils.getSortIndexByItemHrid(a);
                    const sortIndexB = MWI_Toolkit_Utils.getSortIndexByItemHrid(b);
                    return sortIndexA - sortIndexB;
                });
                if (filteredItems.length === 0) {
                    searchResults.style.display = 'none';
                    return;
                }
                MWI_Toolkit_Calculator.populateSearchResults(searchResults, filteredItems, (itemHrid) => {
                    itemSearchInput.value = MWI_Toolkit_I18n.getItemName(itemHrid);
                    searchResults.style.display = 'none';
                });
                searchResults.style.display = 'block';
            });
            // 键盘操作
            itemSearchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    MWI_Toolkit_Calculator.addItemAndResetItemSearchComponent(itemSearchInput, countInput, searchResults);
                }
                else if (e.key === 'Escape') {
                    searchResults.style.display = 'none';
                }
            });
            // 输入框获得焦点时全选内容
            countInput.addEventListener('focus', () => {
                setTimeout(() => {
                    countInput.select();
                }, 0);
            });
            // 仅允许输入数字
            countInput.addEventListener('input', () => {
                // 只允许负号在首位，其余为数字
                countInput.value = countInput.value.replace(/(?!^)-|[^\d-]/g, '');
            });
            // 键盘操作
            countInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    MWI_Toolkit_Calculator.addItemAndResetItemSearchComponent(itemSearchInput, countInput, searchResults);
                }
                else if (e.key === 'Escape') {
                    searchResults.style.display = 'none';
                }
            });
            // 添加按钮事件
            addButton.addEventListener('click', () => {
                MWI_Toolkit_Calculator.addItemAndResetItemSearchComponent(itemSearchInput, countInput, searchResults);
            });
            // 清空按钮事件
            clearAllButton.addEventListener('click', () => {
                if (confirm((MWI_Toolkit_I18n.getGameLanguage() === 'zh') ? '确定要清空所有目标物品吗？' : 'Are you sure you want to clear all target items?')) {
                    // 通过事件处理器清空
                    MWI_Toolkit_Calculator.clearAllTargetItems();
                }
            });
            // 点击其他地方隐藏搜索结果
            document.addEventListener('click', () => {
                searchResults.style.display = 'none';
            });
        }
        // 填充搜索结果
        static populateSearchResults(searchResults, filteredItems, onItemSelect) {
            searchResults.innerHTML = '';
            filteredItems.forEach((itemHrid, index) => {
                const resultItem = document.createElement('div');
                resultItem.style.borderBottom = '1px solid #98a7e9';
                resultItem.style.borderRadius = '4px';
                resultItem.style.padding = '4px';
                resultItem.style.alignItems = 'center';
                resultItem.style.display = 'flex';
                resultItem.style.cursor = 'pointer';
                if (index === 0) {
                    resultItem.style.background = '#4a4c6a';
                }
                // 物品图标
                const itemIcon = document.createElement('div');
                const iconHref = MWI_Toolkit_Utils.getIconHrefByItemHrid(itemHrid);
                const svg = MWI_Toolkit_Utils.createIconSvg(iconHref);
                itemIcon.appendChild(svg);
                // 物品名称
                const itemName = document.createElement('span');
                itemName.textContent = MWI_Toolkit_I18n.getItemName(itemHrid);
                itemName.style.marginLeft = '2px';
                resultItem.appendChild(itemIcon);
                resultItem.appendChild(itemName);
                // 悬停高亮
                resultItem.addEventListener('mouseenter', () => {
                    resultItem.style.background = '#4a4c6a';
                });
                resultItem.addEventListener('mouseleave', () => {
                    resultItem.style.background = 'transparent';
                });
                resultItem.addEventListener('click', () => onItemSelect(itemHrid));
                searchResults.appendChild(resultItem);
            });
        }
        // 添加物品并重置搜索组件（包含itemHrid获取和判空）
        static addItemAndResetItemSearchComponent(itemSearchInput, countInput, searchResults) {
            const InputValue = itemSearchInput.value.trim();
            // 如果InputValue是纯数字，则视为从特定角色加载数据
            if (/^\d+$/.test(InputValue)) {
                const characterID = parseInt(InputValue, 10);
                MWI_Toolkit_Calculator.loadCalculatorData(characterID);
                return;
            }
            const itemHrid = MWI_Toolkit_I18n.getItemHridByName(InputValue);
            if (!itemHrid)
                return;
            const count = parseInt(countInput.value, 10) || 1;
            MWI_Toolkit_Calculator.updateTargetItem(itemHrid, count);
            itemSearchInput.value = '';
            countInput.value = '1';
            searchResults.style.display = 'none';
        }
        // 创建房屋选择区域
        static createHouseRoomSelectionComponent() {
            const HouseRoomSelectionComponent = document.createElement('div');
            HouseRoomSelectionComponent.style.background = '#2c2e45';
            HouseRoomSelectionComponent.style.border = 'none';
            HouseRoomSelectionComponent.style.borderRadius = '4px';
            HouseRoomSelectionComponent.style.padding = '4px';
            HouseRoomSelectionComponent.style.margin = '2px';
            HouseRoomSelectionComponent.style.display = 'flex';
            // 下拉菜单
            const dropdown = MWI_Toolkit_Calculator.createHouseRoomTypeDropdown();
            // 等级输入框
            const levelInput = document.createElement('input');
            levelInput.type = 'number';
            levelInput.min = '1';
            levelInput.max = '8';
            levelInput.step = '1';
            levelInput.value = '1';
            levelInput.placeholder = (MWI_Toolkit_I18n.getGameLanguage() === 'zh') ? '等级' : 'Level';
            levelInput.style.background = '#dde2f8';
            levelInput.style.color = '#000000';
            levelInput.style.border = 'none';
            levelInput.style.borderRadius = '4px';
            levelInput.style.padding = '4px';
            levelInput.style.margin = '2px';
            levelInput.style.width = '35px';
            // 添加按钮
            const addListButton = document.createElement('button');
            addListButton.textContent = (MWI_Toolkit_I18n.getGameLanguage() === 'zh') ? '添加' : 'Add';
            addListButton.style.background = '#4CAF50';
            addListButton.style.color = '#FFFFFF';
            addListButton.style.border = 'none';
            addListButton.style.borderRadius = '4px';
            addListButton.style.padding = '4px';
            addListButton.style.margin = '2px';
            addListButton.style.width = '35px';
            addListButton.style.cursor = 'pointer';
            // 绑定事件
            MWI_Toolkit_Calculator.bindHouseRoomSelectionComponentEvents(dropdown, levelInput, addListButton);
            HouseRoomSelectionComponent.appendChild(dropdown);
            HouseRoomSelectionComponent.appendChild(levelInput);
            HouseRoomSelectionComponent.appendChild(addListButton);
            return HouseRoomSelectionComponent;
        }
        // 创建房屋类型下拉菜单
        static createHouseRoomTypeDropdown() {
            // 创建容器
            const dropdown = document.createElement('div');
            dropdown.style.display = 'flex';
            dropdown.style.minWidth = '20px';
            dropdown.style.flex = '1';
            dropdown.style.position = 'relative';
            // 选中项显示区
            const selected = document.createElement('div');
            selected.style.background = '#393a5b';
            selected.style.color = '#000000';
            selected.style.border = 'none';
            selected.style.borderRadius = '4px';
            selected.style.paddingLeft = '4px';
            selected.style.margin = '2px';
            selected.style.minWidth = '40px';
            selected.style.flex = '1';
            selected.style.cursor = 'pointer';
            selected.style.display = 'flex';
            selected.style.alignItems = 'center';
            // 下拉菜单列表
            const list = document.createElement('div');
            list.style.background = '#2c2e45';
            list.style.border = 'none';
            list.style.borderRadius = '4px';
            list.style.padding = '4px';
            list.style.margin = '2px';
            list.style.width = '150px';
            list.style.maxHeight = '335px';
            list.style.overflowY = 'auto';
            list.style.zIndex = '1000';
            list.style.display = 'none';
            list.style.position = 'absolute';
            list.style.left = '0px';
            list.style.top = '32px';
            const HouseRoomTypeOptions = MWI_Toolkit_Calculator.createHouseRoomTypeOptions(selected, dropdown);
            HouseRoomTypeOptions.forEach(optionItem => { list.appendChild(optionItem); });
            HouseRoomTypeOptions[0] && HouseRoomTypeOptions[0].click(); // 默认选中第一个
            dropdown.appendChild(selected);
            dropdown.appendChild(list);
            // 点击展开/收起
            selected.addEventListener('click', (e) => {
                e.stopPropagation();
                list.style.display = list.style.display === 'block' ? 'none' : 'block';
            });
            // 点击外部关闭
            document.addEventListener('click', () => {
                list.style.display = 'none';
            });
            return dropdown;
        }
        // 创建房屋类型选项
        static createHouseRoomTypeOptions(selected, dropdown) {
            const houseRoomDetailMap = MWI_Toolkit.initClientData?.houseRoomDetailMap;
            if (!houseRoomDetailMap) {
                return [];
            }
            return Object.values(houseRoomDetailMap)
                .sort((a, b) => (a.sortIndex ?? 9999) - (b.sortIndex ?? 9999))
                .map(houseRoomDetail => {
                const optionItem = document.createElement('div');
                optionItem.style.borderBottom = '1px solid #98a7e9';
                optionItem.style.borderRadius = '4px';
                optionItem.style.padding = '4px';
                optionItem.style.alignItems = 'center';
                optionItem.style.display = 'flex';
                optionItem.style.cursor = 'pointer';
                // 房屋房间图标
                const houseRoomIcon = document.createElement('div');
                const iconHref = MWI_Toolkit_Utils.getIconHrefBySkillHrid(houseRoomDetail.skillHrid);
                const svg = MWI_Toolkit_Utils.createIconSvg(iconHref);
                houseRoomIcon.appendChild(svg);
                // 房屋房间名称
                const houseRoomName = document.createElement('span');
                houseRoomName.textContent = MWI_Toolkit_I18n?.getName(houseRoomDetail.hrid, "houseRoomNames") || houseRoomDetail.hrid;
                houseRoomName.style.marginLeft = '2px';
                houseRoomName.style.whiteSpace = 'nowrap';
                houseRoomName.style.overflow = 'hidden';
                optionItem.appendChild(houseRoomIcon);
                optionItem.appendChild(houseRoomName);
                optionItem.addEventListener('click', () => {
                    selected.innerHTML = '';
                    const selectedIcon = houseRoomIcon.cloneNode(true);
                    selected.appendChild(selectedIcon);
                    const selectedName = houseRoomName.cloneNode(true);
                    selectedName.style.color = '#FFFFFF';
                    selected.appendChild(selectedName);
                    dropdown.dataset.houseRoomHrid = houseRoomDetail.hrid;
                    optionItem.parentElement.style.display = 'none';
                });
                // 悬停高亮
                optionItem.addEventListener('mouseenter', () => {
                    optionItem.style.background = '#4a4c6a';
                });
                optionItem.addEventListener('mouseleave', () => {
                    optionItem.style.background = 'transparent';
                });
                optionItem.dataset.houseRoomHrid = houseRoomDetail.hrid;
                return optionItem;
            });
        }
        // 绑定房屋选择相关事件
        static bindHouseRoomSelectionComponentEvents(dropdown, levelInput, addListButton) {
            // 输入框获得焦点时全选内容
            levelInput.addEventListener('focus', function () {
                setTimeout(() => {
                    levelInput.select();
                }, 0);
            });
            // 添加按钮事件
            addListButton.addEventListener('click', () => {
                const houseRoomHrid = dropdown.dataset.houseRoomHrid;
                const level = parseInt(levelInput.value) || 1;
                MWI_Toolkit_Calculator.updateTargetItem(houseRoomHrid, level);
            });
        }
        // 渲染物品列表
        static renderItemsDisplay() {
            MWI_Toolkit_Calculator.targetItemCategoryMap.forEach((category) => {
                category.updateDisplayElement();
            });
            // 这里只需要新增或更新，删除在targetItems变动时进行处理
            MWI_Toolkit_Calculator.itemCategoryList.forEach(categoryHrid => {
                const details = MWI_Toolkit_Calculator.targetItemDetailsMap.get(categoryHrid);
                let lastElement = details.querySelector('summary');
                let itemCount = 0;
                [...MWI_Toolkit_Calculator.targetItemsMap.values()]
                    .sort((a, b) => a.sortIndex - b.sortIndex)
                    .forEach(targetItem => {
                    if (targetItem.categoryHrid !== categoryHrid) {
                        return;
                    }
                    if (!targetItem.displayElement) {
                        MWI_Toolkit_Calculator.createTargetItemDisplayElement(targetItem);
                        lastElement.insertAdjacentElement('afterend', targetItem.displayElement);
                    }
                    targetItem.updateDisplayElement();
                    lastElement = targetItem.displayElement;
                    itemCount++;
                });
                details.hidden = itemCount === 0;
            });
            const inventoryMap = MWI_Toolkit_ItemsMap.getInventoryMap();
            const totalNeeds = MWI_Toolkit_Calculator.calculateAllRequiredItems(new Map());
            const remainNeeds = MWI_Toolkit_Calculator.calculateAllRequiredItems(inventoryMap);
            // 移除不存在的物品
            [...MWI_Toolkit_Calculator.requiredItemsMap.keys()].forEach(itemHrid => {
                if (!totalNeeds.has(itemHrid)) {
                    MWI_Toolkit_Calculator.requiredItemsMap.get(itemHrid)?.removeDisplayElement();
                    MWI_Toolkit_Calculator.requiredItemsMap.delete(itemHrid);
                }
            });
            [...totalNeeds.keys()].forEach(itemHrid => {
                const item = MWI_Toolkit_Calculator.requiredItemsMap.get(itemHrid);
                if (item) {
                    item.count = totalNeeds.get(itemHrid) || 0;
                    item.shortageCount = remainNeeds.get(itemHrid) || 0;
                    item.overflowCount = inventoryMap.get(itemHrid) || 0;
                }
                else {
                    MWI_Toolkit_Calculator.requiredItemsMap.set(itemHrid, new RequiredItem(itemHrid, totalNeeds.get(itemHrid) || 0, remainNeeds.get(itemHrid) || 0, inventoryMap.get(itemHrid) || 0));
                }
            });
            MWI_Toolkit_Calculator.itemCategoryList.forEach(categoryHrid => {
                const shortageDetails = MWI_Toolkit_Calculator.shortageItemDetailsMap.get(categoryHrid);
                const requiredDetails = MWI_Toolkit_Calculator.requiredItemDetailsMap.get(categoryHrid);
                let lastShortageElement = shortageDetails.querySelector('summary');
                let lastRequiredElement = requiredDetails.querySelector('summary');
                let shortageItemCount = 0;
                let requiredItemCount = 0;
                [...MWI_Toolkit_Calculator.requiredItemsMap.values()]
                    .sort((a, b) => a.sortIndex - b.sortIndex)
                    .forEach(requiredItem => {
                    if (requiredItem.categoryHrid !== categoryHrid) {
                        return;
                    }
                    if (!requiredItem.shortageDisplayElement) {
                        MWI_Toolkit_Calculator.createShortageItemDisplayElement(requiredItem);
                        lastShortageElement.insertAdjacentElement('afterend', requiredItem.shortageDisplayElement);
                    }
                    if (!requiredItem.requiredDisplayElement) {
                        MWI_Toolkit_Calculator.createRequiredItemDisplayElement(requiredItem);
                        lastRequiredElement.insertAdjacentElement('afterend', requiredItem.requiredDisplayElement);
                    }
                    requiredItem.updateDisplayElement();
                    lastShortageElement = requiredItem.shortageDisplayElement;
                    lastRequiredElement = requiredItem.requiredDisplayElement;
                    shortageItemCount += requiredItem.shortageCount > 0 ? 1 : 0;
                    requiredItemCount++;
                });
                shortageDetails.hidden = shortageItemCount === 0;
                requiredDetails.hidden = requiredItemCount === 0;
            });
        }
        // 创建目标物品元素
        static createTargetItemDisplayElement(targetItem) {
            const { container, itemContainer, rightDiv } = MWI_Toolkit_Calculator.createBaseItemDisplayItem(targetItem);
            const needCalcCheckbox = document.createElement('input');
            needCalcCheckbox.type = 'checkbox';
            container.prepend(needCalcCheckbox);
            needCalcCheckbox.addEventListener('change', () => {
                targetItem.needCalc = needCalcCheckbox.checked;
                MWI_Toolkit_Calculator.saveAndScheduleRender();
            });
            // 拥有数量
            const ownedSpan = document.createElement('span');
            ownedSpan.style.padding = '4px 1px';
            ownedSpan.style.marginLeft = '4px';
            // 斜杠分隔符
            const slash = document.createElement('span');
            slash.textContent = "/";
            slash.style.padding = '4px 1px';
            // 可编辑的需求数量输入框
            const targetInput = document.createElement('input');
            targetInput.type = 'text';
            targetInput.placeholder = '需求';
            targetInput.style.background = '#dde2f8';
            targetInput.style.color = '#000000';
            targetInput.style.border = 'none';
            targetInput.style.borderRadius = '4px';
            targetInput.style.padding = '4px';
            targetInput.style.margin = '2px';
            targetInput.style.width = '60px';
            // 绑定输入事件
            targetInput.addEventListener('input', function () {
                // 清理非数字字符
                this.value = this.value.replace(/(?!^)-|[^\d-]/g, '');
                const newCount = parseInt(this.value) || 0;
                MWI_Toolkit_Calculator.updateTargetItem(targetItem.itemHrid, newCount);
            });
            // 输入框获得焦点时全选内容
            targetInput.addEventListener('focus', function () {
                setTimeout(() => {
                    targetInput.select();
                }, 0);
            });
            // 删除按钮
            const removeButton = document.createElement('button');
            removeButton.style.background = '#eb3f3f';
            removeButton.style.border = 'none';
            removeButton.style.borderRadius = '4px';
            removeButton.style.padding = '4px';
            removeButton.style.margin = '2px';
            removeButton.style.cursor = 'pointer';
            const iconHref = MWI_Toolkit_Utils.getIconHrefByMiscHrid('remove');
            const removeSvg = MWI_Toolkit_Utils.createIconSvg(iconHref);
            removeButton.appendChild(removeSvg);
            removeButton.addEventListener('click', () => {
                MWI_Toolkit_Calculator.removeTargetItem(targetItem.itemHrid);
            });
            rightDiv.appendChild(ownedSpan);
            rightDiv.appendChild(slash);
            rightDiv.appendChild(targetInput);
            rightDiv.appendChild(removeButton);
            targetItem.displayElement = container;
            targetItem.needCalcCheckbox = needCalcCheckbox;
            targetItem.ownedSpan = ownedSpan;
            targetItem.targetInput = targetInput;
        }
        // 创建缺口物品元素
        static createShortageItemDisplayElement(requiredItem) {
            const { container, itemContainer, rightDiv } = MWI_Toolkit_Calculator.createBaseItemDisplayItem(requiredItem);
            const shortageSpan = document.createElement('span');
            shortageSpan.style.background = '#393a5b';
            shortageSpan.style.borderRadius = '4px';
            shortageSpan.style.padding = '2px 6px';
            shortageSpan.style.marginLeft = '4px';
            shortageSpan.style.cursor = 'pointer';
            shortageSpan.addEventListener('click', (e) => {
                if (e.ctrlKey || e.metaKey) {
                    MWI_Toolkit_Calculator.TryGotoActionDetailByRequiredItem(requiredItem);
                }
            });
            rightDiv.appendChild(shortageSpan);
            requiredItem.shortageDisplayElement = container;
            requiredItem.shortageSpan = shortageSpan;
        }
        // 创建需求物品元素
        static createRequiredItemDisplayElement(requiredItem) {
            const { container, itemContainer, rightDiv } = MWI_Toolkit_Calculator.createBaseItemDisplayItem(requiredItem);
            const RequiredCountDiv = document.createElement('div');
            RequiredCountDiv.style.padding = '4px 1px';
            RequiredCountDiv.style.marginLeft = '4px';
            const overflowSpan = document.createElement('span');
            const requiredSpan = document.createElement('span');
            requiredSpan.style.display = 'inline-block';
            requiredSpan.style.textAlign = 'right';
            requiredSpan.style.width = '45px';
            const slash = document.createElement('span');
            slash.textContent = '/';
            slash.style.margin = '0px 2px';
            rightDiv.appendChild(overflowSpan);
            rightDiv.appendChild(slash);
            rightDiv.appendChild(requiredSpan);
            requiredItem.requiredDisplayElement = container;
            requiredItem.overflowSpan = overflowSpan;
            requiredItem.requiredSpan = requiredSpan;
            requiredItem.displayNameSpan = itemContainer.querySelector('span');
            rightDiv.appendChild(RequiredCountDiv);
        }
        // 创建基础物品显示项（包含图标+名称+右侧区域）
        static createBaseItemDisplayItem(displayItem) {
            const container = document.createElement('div');
            container.className = 'Toolkit_Calculator_Container';
            container.style.border = 'none';
            container.style.borderRadius = '4px';
            container.style.padding = '1px';
            container.style.margin = '2px';
            container.style.display = 'flex';
            container.style.alignItems = 'center';
            const itemContainer = MWI_Toolkit_Calculator.createItemContainer(displayItem);
            container.appendChild(itemContainer);
            const leftDiv = document.createElement('div');
            leftDiv.style.flex = '1';
            container.appendChild(leftDiv);
            // 右侧内容
            const rightDiv = document.createElement('div');
            rightDiv.style.display = 'flex';
            container.appendChild(rightDiv);
            return { container, itemContainer, rightDiv };
        }
        // 创建物品容器（图标+名称）
        static createItemContainer(displayItem) {
            const container = document.createElement('div');
            container.style.minWidth = '40px';
            container.style.alignItems = 'center';
            container.style.display = 'flex';
            // 物品图标
            const iconContainer = document.createElement('div');
            iconContainer.style.marginLeft = '2px';
            const svg = MWI_Toolkit_Utils.createIconSvg(displayItem.iconHref);
            iconContainer.appendChild(svg);
            // 物品名称
            const displayNameSpan = document.createElement('span');
            displayNameSpan.textContent = displayItem.displayName;
            displayNameSpan.style.padding = "4px 1px";
            displayNameSpan.style.marginLeft = '2px';
            displayNameSpan.style.whiteSpace = 'nowrap';
            displayNameSpan.style.overflow = 'hidden';
            container.appendChild(iconContainer);
            container.appendChild(displayNameSpan);
            return container;
        }
        // 尝试打开动作面板
        static TryGotoActionDetailByRequiredItem(requiredItem) {
            const actionHrid = MWI_Toolkit_ActionDetailPlus.getActionHrid(requiredItem.displayName)
                ?? MWI_Toolkit_ActionDetailPlus.processableActionMap.get(requiredItem.itemHrid);
            if (!actionHrid) {
                return;
            }
            const { upgradeItemHrid, inputItems, outputItems } = MWI_Toolkit_ActionDetailPlus.calculateActionDetail(actionHrid);
            const outputCount = outputItems.find(oi => oi.itemHrid === requiredItem.itemHrid)?.count;
            if (!outputCount) {
                return;
            }
            if (!actionHrid.includes('milking') && !actionHrid.includes('foraging') && !actionHrid.includes('woodcutting')) {
                // 其他情况直接计算所需次数
                const actionCount = Math.ceil(requiredItem.shortageCount / outputCount);
                MWI_Toolkit.gameObject.handleGoToAction(actionHrid, actionCount);
            }
            else {
                // 三采使用置信度计算保证最终随机产出不低于需求
                const processedItemHrid = MWI_Toolkit_ActionDetailPlus.processableItemMap.get(requiredItem.itemHrid);
                if (processedItemHrid) {
                    // 对于可加工物品，检查加工茶和工匠茶的影响
                    const processedItemOutputCount = outputItems.find(oi => oi.itemHrid === processedItemHrid)?.count || 0;
                    const processedItemShortageCount = MWI_Toolkit_Calculator.requiredItemsMap.get(processedItemHrid)?.shortageCount || 0;
                    if (processedItemOutputCount !== 0 && processedItemShortageCount !== 0) {
                        const processedItemInputCount = MWI_Toolkit_ActionDetailPlus.tryGetRecipe(processedItemHrid)
                            .inputs.find(ii => ii.itemHrid === requiredItem.itemHrid)?.count || 2;
                        if (requiredItem.shortageCount < (processedItemShortageCount / processedItemOutputCount * outputCount)) {
                            // 加工茶效果产物不能完全覆盖需求，按比例计算
                            const actionCount = MWI_Toolkit_Calculator.getRequiredTrials99(outputCount, requiredItem.shortageCount / (outputCount + processedItemOutputCount * processedItemInputCount) * outputCount);
                            MWI_Toolkit.gameObject.handleGoToAction(actionHrid, actionCount);
                        }
                        else {
                            // 加工茶效果产物可以完全覆盖需求，从原材料中扣除总数对应原料
                            const actionCount = MWI_Toolkit_Calculator.getRequiredTrials99(outputCount, requiredItem.shortageCount - processedItemShortageCount * processedItemInputCount);
                            MWI_Toolkit.gameObject.handleGoToAction(actionHrid, actionCount);
                        }
                        return;
                    }
                }
                // 直接使用99%置信度计算所需次数
                const actionCount = MWI_Toolkit_Calculator.getRequiredTrials99(outputCount, requiredItem.shortageCount);
                MWI_Toolkit.gameObject.handleGoToAction(actionHrid, actionCount);
            }
        }
        // 计算99%置信度所需尝试次数
        static getRequiredTrials99(mu, target) {
            // 用拟合公式0.3mu简化标准差，2.326为99%置信度的Z值
            const sigma = 0.3 * mu * 2.326;
            // 解一元二次方程 n*mu - sigma*sqrt(n) - target = 0
            // x = sqrt(n) = (sigma + sqrt(sigma^2 + 4*mu*target)) / (2*mu)
            const x = (sigma + Math.sqrt(sigma * sigma + 4 * mu * target)) / (2 * mu);
            return Math.ceil(x * x);
        }
    }
    MWI_Toolkit_Calculator.targetItemCategoryMap = new Map();
    MWI_Toolkit_Calculator.targetItemsMap = new Map();
    MWI_Toolkit_Calculator.requiredItemsMap = new Map();
    MWI_Toolkit_Calculator.tabButton = null;
    MWI_Toolkit_Calculator.tabPanel = null;
    MWI_Toolkit_Calculator.targetItemDetailsMap = new Map();
    MWI_Toolkit_Calculator.shortageItemDetailsMap = new Map();
    MWI_Toolkit_Calculator.requiredItemDetailsMap = new Map();
    MWI_Toolkit_Calculator.itemCategoryList = [
        '/item_categories/house_rooms',
        '/item_categories/currency',
        '/item_categories/loot',
        '/item_categories/key',
        '/item_categories/food',
        '/item_categories/tea',
        '/item_categories/coffee',
        '/item_categories/drink',
        '/item_categories/ability_book',
        '/item_categories/equipment',
        '/item_categories/materials',
        '/item_categories/resource',
    ];
    MWI_Toolkit_Calculator.renderTimeout = null;
    //#endregion
    //#region ActionDetailPlus
    class UpgradeItemComponent {
    }
    class InputItemComponent {
    }
    class OutputItemComponent {
    }
    class ProcessingTeaComponent {
    }
    class MWI_Toolkit_ActionDetailPlus {
        // 初始化监听器
        static initialize() {
            let lastPanel = null;
            const observer = new MutationObserver(() => {
                const panel = document.querySelector('[class^="SkillActionDetail_regularComponent"]');
                if (panel && panel !== lastPanel) {
                    lastPanel = panel;
                    setTimeout(() => {
                        MWI_Toolkit_ActionDetailPlus.enhanceSkillActionDetail();
                    }, 50);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        // 增强技能动作详情面板
        static enhanceSkillActionDetail() {
            const actionName = MWI_Toolkit_ActionDetailPlus.getActionName();
            const actionHrid = MWI_Toolkit_ActionDetailPlus.getActionHrid(actionName);
            const { upgradeItemHrid, inputItems, outputItems } = MWI_Toolkit_ActionDetailPlus.calculateActionDetail(actionHrid);
            const skillActionTimeInput = document.querySelector('[class^="SkillActionDetail_maxActionCountInput"]').querySelector('input');
            const skillActionTimeButtons = document.querySelector('[class^="SkillActionDetail_maxActionCountInput"]').querySelectorAll('button');
            MWI_Toolkit_ActionDetailPlus.createUpgradeItemComponent(upgradeItemHrid);
            MWI_Toolkit_ActionDetailPlus.createInputItemComponents(inputItems);
            MWI_Toolkit_ActionDetailPlus.createOutputItemComponents(outputItems);
            // 联动
            let linking = false;
            function updateSkillActionDetail(e) {
                if (linking)
                    return;
                linking = true;
                const target = e.target;
                const index = MWI_Toolkit_ActionDetailPlus.outputItemComponents.findIndex(component => component.outputItemInput === target);
                const targetValue = parseInt(target.value, 10);
                if (index !== -1) {
                    skillActionTimeInput.value = (isNaN(targetValue)) ? '∞' : Math.ceil(targetValue / MWI_Toolkit_ActionDetailPlus.outputItemComponents[index].count).toString();
                    MWI_Toolkit_Utils.reactInputTriggerHack(skillActionTimeInput);
                }
                const skillActionTimes = parseInt(skillActionTimeInput.value, 10);
                MWI_Toolkit_ActionDetailPlus.outputItemComponents.forEach(component => {
                    if (component.outputItemInput !== target) {
                        component.outputItemInput.value = (isNaN(skillActionTimes)) ? '∞' : Math.ceil(skillActionTimes * component.count).toString();
                    }
                });
                MWI_Toolkit_ActionDetailPlus.inputItemComponents.forEach(component => {
                    const inventoryCount = MWI_Toolkit_ItemsMap.getCount(component.itemHrid);
                    const requiredCount = component.count * skillActionTimes;
                    if (isNaN(skillActionTimes)) {
                        component.shortageCountSpan.textContent = '';
                        component.inventoryCountSpan.style.color = '';
                    }
                    else {
                        if (requiredCount > inventoryCount) {
                            component.shortageCountSpan.textContent = MWI_Toolkit_Utils.formatNumber(requiredCount - inventoryCount);
                            component.inventoryCountSpan.style.color = '#eb3f3f';
                        }
                        else {
                            component.shortageCountSpan.textContent = ' ';
                            component.inventoryCountSpan.style.color = '#E7E7E7';
                        }
                    }
                    component.inputCountSpan.textContent = '\u00A0/ ' + MWI_Toolkit_Utils.formatNumber(component.count * ((isNaN(skillActionTimes) ? 1 : skillActionTimes))) + '\u00A0';
                });
                if (MWI_Toolkit_ActionDetailPlus.upgradeItemComponent) {
                    if (isNaN(skillActionTimes)) {
                        MWI_Toolkit_ActionDetailPlus.upgradeItemComponent.shortageCountSpan.textContent = '';
                    }
                    else {
                        const requiredCount = MWI_Toolkit_ActionDetailPlus.upgradeItemComponent.count * skillActionTimes;
                        const inventoryCount = MWI_Toolkit_ItemsMap.getCount(MWI_Toolkit_ActionDetailPlus.upgradeItemComponent.itemHrid);
                        if (requiredCount > inventoryCount) {
                            MWI_Toolkit_ActionDetailPlus.upgradeItemComponent.shortageCountSpan.textContent = MWI_Toolkit_Utils.formatNumber(requiredCount - inventoryCount);
                        }
                        else {
                            MWI_Toolkit_ActionDetailPlus.upgradeItemComponent.shortageCountSpan.textContent = ' ';
                        }
                    }
                }
                if (MWI_Toolkit_ActionDetailPlus.processingTeaComponent) {
                    MWI_Toolkit_ActionDetailPlus.processingTeaComponent.CountSpan.textContent =
                        (isNaN(skillActionTimes)) ? '∞' : Math.ceil(skillActionTimes * MWI_Toolkit_ActionDetailPlus.processingTeaComponent.count).toString();
                }
                linking = false;
            }
            skillActionTimeInput.addEventListener('input', updateSkillActionDetail);
            MWI_Toolkit_ActionDetailPlus.outputItemComponents.forEach(component => {
                component.outputItemInput.addEventListener('input', updateSkillActionDetail);
            });
            skillActionTimeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    skillActionTimeInput.dispatchEvent(new Event('input', { bubbles: false }));
                });
            });
            MWI_Toolkit_ItemsMap.itemsUpdatedCallbacks.push(() => {
                skillActionTimeInput.dispatchEvent(new Event('input', { bubbles: false }));
            });
            // 初次填充
            skillActionTimeInput.dispatchEvent(new Event('input', { bubbles: false }));
        }
        // 创建升级物品组件
        static createUpgradeItemComponent(upgradeItemHrid) {
            MWI_Toolkit_ActionDetailPlus.upgradeItemComponent = null;
            if (!upgradeItemHrid) {
                return;
            }
            const shortageCountContainer = document.querySelector('[class^="SkillActionDetail_upgradeItemSelectorInput"]')?.parentElement?.previousElementSibling;
            if (!shortageCountContainer) {
                return;
            }
            const newTextSpan = document.createElement('span');
            newTextSpan.textContent = shortageCountContainer.textContent;
            newTextSpan.style.height = window.getComputedStyle(document.querySelector('[class*="SkillActionDetail_levelRequirement"]')).height;
            shortageCountContainer.innerHTML = '';
            shortageCountContainer.appendChild(newTextSpan);
            const shortageCountDiv = document.createElement('div');
            shortageCountDiv.style.display = 'flex';
            shortageCountDiv.style.alignItems = 'flex-end';
            shortageCountDiv.style.flexDirection = 'column';
            const shortageCountSpan = document.createElement('span');
            shortageCountSpan.style.display = 'flex';
            shortageCountSpan.style.alignItems = 'center';
            shortageCountSpan.style.color = '#faa21e';
            shortageCountDiv.appendChild(shortageCountSpan);
            shortageCountContainer.appendChild(shortageCountDiv);
            MWI_Toolkit_ActionDetailPlus.upgradeItemComponent = new UpgradeItemComponent();
            MWI_Toolkit_ActionDetailPlus.upgradeItemComponent.itemHrid = upgradeItemHrid;
            MWI_Toolkit_ActionDetailPlus.upgradeItemComponent.count = 1; // 升级物品固定需求1个
            MWI_Toolkit_ActionDetailPlus.upgradeItemComponent.shortageCountSpan = shortageCountSpan;
        }
        // 创建所有输入物品组件
        static createInputItemComponents(inputItems) {
            MWI_Toolkit_ActionDetailPlus.inputItemComponents = new Array();
            if (!inputItems || inputItems.length === 0) {
                return;
            }
            const inputItemComponentContainer = document.querySelector('[class^="SkillActionDetail_itemRequirements"]');
            const shortageCountContainer = inputItemComponentContainer?.parentElement?.previousElementSibling;
            if (shortageCountContainer) {
                const newTextSpan = document.createElement('span');
                newTextSpan.textContent = shortageCountContainer.textContent;
                newTextSpan.style.height = window.getComputedStyle(document.querySelector('[class*="SkillActionDetail_levelRequirement"]')).height;
                const shortageCountComponent = document.createElement('div');
                shortageCountComponent.style.display = 'flex';
                shortageCountComponent.style.alignItems = 'flex-end';
                shortageCountComponent.style.flexDirection = 'column';
                shortageCountContainer.innerHTML = '';
                shortageCountContainer.appendChild(newTextSpan);
                shortageCountContainer.appendChild(shortageCountComponent);
                const inventoryCountSpans = inputItemComponentContainer?.querySelectorAll('[class*="SkillActionDetail_inventoryCount"]');
                const inputCountSpans = inputItemComponentContainer?.querySelectorAll('[class*="SkillActionDetail_inputCount"]');
                const itemContainers = inputItemComponentContainer?.querySelectorAll('[class*="Item_itemContainer"]');
                for (let i = 0; i < itemContainers.length; i++) {
                    inputCountSpans[i].style.color = '#E7E7E7';
                    const inputItemHrid = '/items/' + itemContainers[i].querySelector('svg use').getAttribute('href').split('#').pop();
                    const inputItemCount = inputItems.find(item => item.itemHrid === inputItemHrid)?.count || 0;
                    const shortageCountSpan = document.createElement('span');
                    shortageCountSpan.style.height = window.getComputedStyle(itemContainers[i]).height;
                    shortageCountSpan.style.display = 'flex';
                    shortageCountSpan.style.alignItems = 'center';
                    shortageCountSpan.style.color = '#faa21e';
                    shortageCountComponent.appendChild(shortageCountSpan);
                    const inputItemComponent = new InputItemComponent();
                    inputItemComponent.itemHrid = inputItemHrid;
                    inputItemComponent.count = inputItemCount;
                    inputItemComponent.shortageCountSpan = shortageCountSpan;
                    inputItemComponent.inventoryCountSpan = inventoryCountSpans[i];
                    inputItemComponent.inputCountSpan = inputCountSpans[i];
                    MWI_Toolkit_ActionDetailPlus.inputItemComponents.push(inputItemComponent);
                }
            }
        }
        // 创建所有输出物品组件
        static createOutputItemComponents(outputItems) {
            MWI_Toolkit_ActionDetailPlus.outputItemComponents = Array();
            MWI_Toolkit_ActionDetailPlus.processingTeaComponent = null;
            let lastOutputItemComponent = document.querySelector('[class^="SkillActionDetail_maxActionCountInput"]');
            for (const outputItem of outputItems) {
                if (outputItem.count === 1 && outputItems.length === 1)
                    break; // 仅有一个产出且数量为1时不创建额外输入框
                const processedItemHrid = [...MWI_Toolkit_ActionDetailPlus.processableItemMap.values()].find(v => v === outputItem.itemHrid);
                if (processedItemHrid) {
                    // 加工茶产物
                    const processedItemComponent = MWI_Toolkit_ActionDetailPlus.createProcessingTeaComponent(outputItem, outputItems);
                    lastOutputItemComponent.insertAdjacentElement('afterend', processedItemComponent);
                    lastOutputItemComponent = processedItemComponent;
                }
                else {
                    // 直接采集产物
                    const outputItemComponent = MWI_Toolkit_ActionDetailPlus.createOutputItemComponent(outputItem);
                    lastOutputItemComponent.insertAdjacentElement('afterend', outputItemComponent);
                    lastOutputItemComponent = outputItemComponent;
                }
            }
        }
        // 创建输出物品组件
        static createOutputItemComponent(outputItem) {
            const origComponent = document.querySelector('[class^="SkillActionDetail_maxActionCountInput"]');
            if (!origComponent)
                return null;
            // 克隆外层div（不带子内容）
            const component = origComponent.cloneNode(false);
            const originalActionLabel = document.querySelector('[class^="SkillActionDetail_actionContainer"] [class^="SkillActionDetail_label"]');
            // 物品图标
            const itemIcon = document.createElement('div');
            itemIcon.style.width = window.getComputedStyle(originalActionLabel).width;
            itemIcon.style.marginRight = '2px';
            itemIcon.style.display = 'flex';
            itemIcon.style.alignItems = 'center';
            itemIcon.style.justifyContent = 'center';
            const iconHref = MWI_Toolkit_Utils.getIconHrefByItemHrid(outputItem.itemHrid);
            const svg = MWI_Toolkit_Utils.createIconSvg(iconHref);
            itemIcon.appendChild(svg);
            component.appendChild(itemIcon);
            // 输入框
            const origInputWrap = origComponent.querySelector('[class^="SkillActionDetail_input"]');
            const inputWrap = origInputWrap.cloneNode(true);
            const origInput = origInputWrap.querySelector('input');
            const input = inputWrap.querySelector('input');
            input.addEventListener('focus', () => { input.select(); });
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && origInput) {
                    origInput.dispatchEvent(event);
                }
            });
            component.appendChild(inputWrap);
            // 快捷填充按钮
            const btns = [
                { val: 1000, txt: '1k' },
                { val: 2000, txt: '2k' },
                { val: 5000, txt: '5k' }
            ];
            const origButtons = origComponent.querySelectorAll('button');
            const buttonClass = origButtons.length > 0 ? origButtons[0].className : '';
            btns.forEach(({ val, txt }) => {
                const btn = document.createElement('button');
                btn.className = buttonClass;
                btn.textContent = txt;
                btn.addEventListener('click', () => {
                    input.value = val.toString();
                    input.dispatchEvent(new Event('input', { bubbles: true }));
                });
                component.appendChild(btn);
            });
            const outputItemComponent = new OutputItemComponent();
            outputItemComponent.count = outputItem.count;
            outputItemComponent.outputItemInput = input;
            MWI_Toolkit_ActionDetailPlus.outputItemComponents.push(outputItemComponent);
            return component;
        }
        // 创建加工茶产出组件
        static createProcessingTeaComponent(processedItem, outputItems) {
            const origComponent = document.querySelector('[class^="SkillActionDetail_maxActionCountInput"]');
            if (!origComponent)
                return null;
            // 克隆外层div（不带子内容）
            const component = origComponent.cloneNode(false);
            // 制表符
            const originalActionLabel = document.querySelector('[class^="SkillActionDetail_actionContainer"] [class^="SkillActionDetail_label"]');
            const tab = originalActionLabel.cloneNode(false);
            tab.textContent = '┗';
            tab.style.width = '24px';
            component.appendChild(tab);
            // 物品图标
            const itemIcon = document.createElement('div');
            itemIcon.style.width = '24px';
            itemIcon.style.marginRight = '2px';
            itemIcon.style.display = 'flex';
            itemIcon.style.alignItems = 'center';
            itemIcon.style.justifyContent = 'center';
            const iconHref = MWI_Toolkit_Utils.getIconHrefByItemHrid(processedItem.itemHrid);
            const svg = MWI_Toolkit_Utils.createIconSvg(iconHref);
            itemIcon.appendChild(svg);
            component.appendChild(itemIcon);
            // 输入框
            const origInputWrap = origComponent.querySelector('[class^="SkillActionDetail_input"]');
            const origInput = origInputWrap.querySelector('input');
            const inputWrap = origInputWrap.cloneNode(true);
            const input = inputWrap.querySelector('input');
            input.disabled = (processedItem.count === 0);
            input.addEventListener('focus', () => { input.select(); });
            input.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && origInput) {
                    origInput.dispatchEvent(event);
                }
            });
            component.appendChild(inputWrap);
            const outputItemComponent = new OutputItemComponent();
            outputItemComponent.count = processedItem.count;
            outputItemComponent.outputItemInput = input;
            MWI_Toolkit_ActionDetailPlus.outputItemComponents.push(outputItemComponent);
            const processableItemHrid = [...MWI_Toolkit_ActionDetailPlus.processableItemMap.entries()]
                .find(([, v]) => v === processedItem.itemHrid)?.[0];
            const processableItem = outputItems.find(oi => oi.itemHrid === processableItemHrid);
            const recipeInputItem = MWI_Toolkit_ActionDetailPlus.tryGetRecipe(processedItem.itemHrid).inputs[0];
            const slash1 = document.createElement('span');
            slash1.textContent = '+';
            slash1.style.margin = '0px 2px';
            const processingTeaSpan = document.createElement('span');
            const slash2 = document.createElement('span');
            slash2.textContent = '=';
            slash2.style.margin = '0px 2px';
            component.appendChild(slash1);
            component.appendChild(processingTeaSpan);
            component.appendChild(slash2);
            const processingTeaComponent = new ProcessingTeaComponent();
            processingTeaComponent.count = processableItem.count / recipeInputItem.count;
            processingTeaComponent.CountSpan = processingTeaSpan;
            MWI_Toolkit_ActionDetailPlus.processingTeaComponent = processingTeaComponent;
            const totalInputWrap = origInputWrap.cloneNode(true);
            const totalInput = totalInputWrap.querySelector('input');
            totalInput.addEventListener('focus', () => { totalInput.select(); });
            totalInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter' && origInput) {
                    origInput.dispatchEvent(event);
                }
            });
            component.appendChild(totalInputWrap);
            const totalItemComponent = new OutputItemComponent();
            totalItemComponent.count = processedItem.count + processableItem.count / recipeInputItem.count;
            totalItemComponent.outputItemInput = totalInput;
            MWI_Toolkit_ActionDetailPlus.outputItemComponents.push(totalItemComponent);
            return component;
        }
        // 获取物品配方
        static tryGetRecipe(itemHrid) {
            const itemName = itemHrid.split('/').pop() || '';
            // 检查商店兑换
            const shopHrid = `/shop_items/${itemName}`;
            if (MWI_Toolkit.initClientData?.shopItemDetailMap?.hasOwnProperty(shopHrid)) {
                const shopItemDetail = MWI_Toolkit.initClientData?.shopItemDetailMap[shopHrid];
                if (shopItemDetail.category === "/shop_categories/dungeon") {
                    const recipe = { inputs: new Array, outputCount: 1 };
                    shopItemDetail.costs.forEach(cost => {
                        recipe.inputs.push({ itemHrid: cost.itemHrid, count: cost.count });
                    });
                    return recipe;
                }
            }
            // 检查制造配方
            const actionTypes = ["cheesesmithing", "crafting", "tailoring", "cooking", "brewing"];
            for (const actionType of actionTypes) {
                const actionHrid = `/actions/${actionType}/${itemName}`;
                if (MWI_Toolkit.initClientData?.actionDetailMap?.hasOwnProperty(actionHrid)) {
                    // 复用 MWI_Toolkit_ActionDetailPlus 的计算逻辑以获得输入/输出（考虑茶水等加成在 calculateRequiredItems 中已处理）
                    const { upgradeItemHrid, inputItems, outputItems } = MWI_Toolkit_ActionDetailPlus.calculateActionDetail(actionHrid);
                    if (upgradeItemHrid) {
                        inputItems.push({ itemHrid: upgradeItemHrid, count: 1 });
                    } // 升级物品固定需求数量1，添加到输入中
                    let outputCount = 1;
                    if (outputItems && outputItems.length > 0) {
                        const matching = outputItems.find(o => o.itemHrid === itemHrid);
                        if (matching)
                            outputCount = matching.count || 1;
                    }
                    return { inputs: inputItems, outputCount };
                }
            }
            return null;
        }
        // 计算动作详情
        static calculateActionDetail(actionHrid) {
            const actionDetail = MWI_Toolkit_ActionDetailPlus.getActionDetail(actionHrid);
            const actionType = actionDetail?.type?.split('/').pop() || '';
            // 仅支持八种常规类型
            if (!actionDetail || !actionType || !['milking', 'foraging', 'woodcutting', 'cheesesmithing', 'crafting', 'tailoring', 'cooking', 'brewing'].includes(actionType)) {
                console.warn('[MWI_Toolkit] 无法获取动作详情' + actionHrid);
                return { upgradeItemHrid: null, inputItems: [], outputItems: [] };
            }
            // console.log('MWI_Toolkit_ActionDetailPlus: 获取到动作详情', actionDetail);
            const upgradeItemHrid = actionDetail.upgradeItemHrid;
            const inputItems = actionDetail.inputItems ? JSON.parse(JSON.stringify(actionDetail.inputItems)) : Array();
            const outputItems = actionDetail.outputItems ? JSON.parse(JSON.stringify(actionDetail.outputItems)) : Array();
            const drinkSlots = MWI_Toolkit_ActionDetailPlus.getActionTypeDrinkSlots(actionType);
            const drinkConcentration = MWI_Toolkit_ActionDetailPlus.getDrinkConcentration();
            // console.log('MWI_Toolkit_ActionDetailPlus: 获取到茶列表', drinkSlots, drinkConcentration);
            // 检查采集数量加成
            const gatheringBuff = (drinkSlots?.some(itemHrid => itemHrid === '/items/gathering_tea') ? 0.15 * drinkConcentration : 0)
                + MWI_Toolkit_ActionDetailPlus.getEquipmentGatheringBuff() + MWI_Toolkit_ActionDetailPlus.getCommunityGatheringBuff();
            // 检查加工茶加成
            const processingBuff = (drinkSlots?.some(itemHrid => itemHrid === '/items/processing_tea') ? 0.15 * drinkConcentration : 0);
            // 检查美食茶加成
            const gourmetBuff = (drinkSlots?.some(itemHrid => itemHrid === '/items/gourmet_tea') ? 0.12 * drinkConcentration : 0);
            // 检查工匠茶加成
            const artisanBuff = (drinkSlots?.some(itemHrid => itemHrid === '/items/artisan_tea') ? 0.1 * drinkConcentration : 0);
            if (['milking', 'foraging', 'woodcutting', /*'cheesesmithing', 'crafting', 'tailoring', 'cooking', 'brewing'*/].includes(actionType)) {
                const dropTable = actionDetail.dropTable;
                for (const dropItem of dropTable) {
                    const averageCount = dropItem.dropRate * (dropItem.minCount + dropItem.maxCount) / 2 * (1 + gatheringBuff);
                    const processedItemHrid = MWI_Toolkit_ActionDetailPlus.processableItemMap.get(dropItem.itemHrid);
                    if (processedItemHrid) {
                        outputItems.push({ itemHrid: dropItem.itemHrid, count: averageCount * (1 - processingBuff), });
                        outputItems.push({ itemHrid: processedItemHrid, count: averageCount * processingBuff / 2, });
                    }
                    else {
                        outputItems.push({ itemHrid: dropItem.itemHrid, count: averageCount, });
                    }
                }
            }
            if ([/*'milking', 'foraging', 'woodcutting', 'cheesesmithing', 'crafting', 'tailoring',*/ 'cooking', 'brewing'].includes(actionType)) {
                for (const outputItem of outputItems) {
                    outputItem.count = outputItem.count * (1 + gourmetBuff);
                }
            }
            if ([/*'milking', 'foraging', 'woodcutting',*/ 'cheesesmithing', 'crafting', 'tailoring', 'cooking', 'brewing'].includes(actionType)) {
                for (const inputItem of inputItems) {
                    inputItem.count = inputItem.count * (1 - artisanBuff);
                }
            }
            return { upgradeItemHrid, inputItems, outputItems };
        }
        // 获取当前动作名称
        static getActionName() {
            const actionNameDiv = document.querySelector('[class^="SkillActionDetail_name"]');
            return actionNameDiv ? actionNameDiv.textContent : '';
        }
        // 获取动作HRID
        static getActionHrid(actionName) {
            return MWI_Toolkit_I18n.getHridByName(actionName, 'actionNames');
        }
        // 获取动作详情
        static getActionDetail(actionHrid) {
            return MWI_Toolkit.initClientData?.actionDetailMap?.[`${actionHrid}`];
        }
        // 获取动作类型对应的饮品栏物品列表
        static getActionTypeDrinkSlots(actionType) {
            if (!actionType) {
                return [];
            }
            const drinkSlots = [];
            MWI_Toolkit.gameObject?.state?.actionTypeDrinkSlotsDict?.[`/action_types/${actionType}`].forEach(drink => {
                if (drink && drink.itemHrid) {
                    drinkSlots.push(drink.itemHrid);
                }
            });
            // 对三采添加对应的工匠茶数据用于计算加工数量
            const processActionType = { milking: 'cheesesmithing', foraging: 'tailoring', woodcutting: 'crafting' }[actionType] || null;
            if (processActionType) {
                const processDrinkSlots = MWI_Toolkit.gameObject?.state?.actionTypeDrinkSlotsDict?.[`/action_types/${processActionType}`];
                processDrinkSlots.forEach(drink => {
                    if (drink && drink.itemHrid == '/items/artisan_tea') {
                        drinkSlots.push(drink.itemHrid);
                    }
                });
            }
            return drinkSlots;
        }
        // 获取饮品浓缩倍率
        static getDrinkConcentration() {
            const enhancementLevel = MWI_Toolkit_ItemsMap.getMaxEnhancementLevel("/items/guzzling_pouch");
            if (enhancementLevel != -1) {
                return 1
                    + MWI_Toolkit.initClientData?.itemDetailMap?.[`/items/guzzling_pouch`].equipmentDetail.noncombatStats.drinkConcentration
                    + MWI_Toolkit.initClientData?.itemDetailMap?.[`/items/guzzling_pouch`].equipmentDetail.noncombatEnhancementBonuses.drinkConcentration
                        * MWI_Toolkit.initClientData?.enhancementLevelTotalBonusMultiplierTable[enhancementLevel];
            }
            return 1;
        }
        // 获取装备采集数量加成
        static getEquipmentGatheringBuff() {
            let equipmentGatheringBuff = 0;
            const philosophers_earrings_enhancementLevel = MWI_Toolkit_ItemsMap.getMaxEnhancementLevel("/items/philosophers_earrings");
            const earrings_of_gathering_enhancementLevel = MWI_Toolkit_ItemsMap.getMaxEnhancementLevel("/items/earrings_of_gathering");
            const philosophers_ring_enhancementLevel = MWI_Toolkit_ItemsMap.getMaxEnhancementLevel("/items/philosophers_ring");
            const ring_of_gathering_enhancementLevel = MWI_Toolkit_ItemsMap.getMaxEnhancementLevel("/items/ring_of_gathering");
            if (philosophers_earrings_enhancementLevel != -1) {
                equipmentGatheringBuff = equipmentGatheringBuff
                    + MWI_Toolkit.initClientData?.itemDetailMap?.[`/items/philosophers_earrings`].equipmentDetail.noncombatStats.gatheringQuantity
                    + MWI_Toolkit.initClientData?.itemDetailMap?.[`/items/philosophers_earrings`].equipmentDetail.noncombatEnhancementBonuses.gatheringQuantity
                        * MWI_Toolkit.initClientData?.enhancementLevelTotalBonusMultiplierTable[philosophers_earrings_enhancementLevel];
            }
            else if (earrings_of_gathering_enhancementLevel != -1) {
                equipmentGatheringBuff = equipmentGatheringBuff
                    + MWI_Toolkit.initClientData?.itemDetailMap?.[`/items/earrings_of_gathering`].equipmentDetail.noncombatStats.gatheringQuantity
                    + MWI_Toolkit.initClientData?.itemDetailMap?.[`/items/earrings_of_gathering`].equipmentDetail.noncombatEnhancementBonuses.gatheringQuantity
                        * MWI_Toolkit.initClientData?.enhancementLevelTotalBonusMultiplierTable[earrings_of_gathering_enhancementLevel];
            }
            if (philosophers_ring_enhancementLevel != -1) {
                equipmentGatheringBuff = equipmentGatheringBuff
                    + MWI_Toolkit.initClientData?.itemDetailMap?.[`/items/philosophers_ring`].equipmentDetail.noncombatStats.gatheringQuantity
                    + MWI_Toolkit.initClientData?.itemDetailMap?.[`/items/philosophers_ring`].equipmentDetail.noncombatEnhancementBonuses.gatheringQuantity
                        * MWI_Toolkit.initClientData?.enhancementLevelTotalBonusMultiplierTable[philosophers_ring_enhancementLevel];
            }
            else if (ring_of_gathering_enhancementLevel != -1) {
                equipmentGatheringBuff = equipmentGatheringBuff
                    + MWI_Toolkit.initClientData?.itemDetailMap?.[`/items/ring_of_gathering`].equipmentDetail.noncombatStats.gatheringQuantity
                    + MWI_Toolkit.initClientData?.itemDetailMap?.[`/items/ring_of_gathering`].equipmentDetail.noncombatEnhancementBonuses.gatheringQuantity
                        * MWI_Toolkit.initClientData?.enhancementLevelTotalBonusMultiplierTable[ring_of_gathering_enhancementLevel];
            }
            return equipmentGatheringBuff;
        }
        // 获取社区采集数量加成
        static getCommunityGatheringBuff() {
            const communityBuffs = MWI_Toolkit.gameObject?.state?.communityBuffs || [];
            for (const buff of communityBuffs) {
                if (buff.hrid === "/community_buff_types/gathering_quantity" && !buff.isDone) {
                    return buff.level * 0.005 + 0.195;
                }
            }
            return 0;
        }
    }
    MWI_Toolkit_ActionDetailPlus.processableActionMap = new Map([
        ["/items/milk", "/actions/milking/cow"],
        ["/items/verdant_milk", "/actions/milking/verdant_cow"],
        ["/items/azure_milk", "/actions/milking/azure_cow"],
        ["/items/burble_milk", "/actions/milking/burble_cow"],
        ["/items/crimson_milk", "/actions/milking/crimson_cow"],
        ["/items/rainbow_milk", "/actions/milking/unicow"],
        ["/items/holy_milk", "/actions/milking/holy_cow"],
        ["/items/log", "/actions/woodcutting/tree"],
        ["/items/birch_log", "/actions/woodcutting/birch_tree"],
        ["/items/cedar_log", "/actions/woodcutting/cedar_tree"],
        ["/items/purpleheart_log", "/actions/woodcutting/purpleheart_tree"],
        ["/items/ginkgo_log", "/actions/woodcutting/ginkgo_tree"],
        ["/items/redwood_log", "/actions/woodcutting/redwood_tree"],
        ["/items/arcane_log", "/actions/woodcutting/arcane_tree"],
        ["/items/cotton", "/actions/foraging/cotton"],
        ["/items/flax", "/actions/foraging/flax"],
        ["/items/bamboo_branch", "/actions/foraging/bamboo_branch"],
        ["/items/cocoon", "/actions/foraging/cocoon"],
        ["/items/radiant_fiber", "/actions/foraging/radiant_fiber"]
    ]);
    MWI_Toolkit_ActionDetailPlus.processableItemMap = new Map([
        ["/items/milk", "/items/cheese"],
        ["/items/verdant_milk", "/items/verdant_cheese"],
        ["/items/azure_milk", "/items/azure_cheese"],
        ["/items/burble_milk", "/items/burble_cheese"],
        ["/items/crimson_milk", "/items/crimson_cheese"],
        ["/items/rainbow_milk", "/items/rainbow_cheese"],
        ["/items/holy_milk", "/items/holy_cheese"],
        ["/items/log", "/items/lumber"],
        ["/items/birch_log", "/items/birch_lumber"],
        ["/items/cedar_log", "/items/cedar_lumber"],
        ["/items/purpleheart_log", "/items/purpleheart_lumber"],
        ["/items/ginkgo_log", "/items/ginkgo_lumber"],
        ["/items/redwood_log", "/items/redwood_lumber"],
        ["/items/arcane_log", "/items/arcane_lumber"],
        ["/items/cotton", "/items/cotton_fabric"],
        ["/items/flax", "/items/linen_fabric"],
        ["/items/bamboo_branch", "/items/bamboo_fabric"],
        ["/items/cocoon", "/items/silk_fabric"],
        ["/items/radiant_fiber", "/items/radiant_fabric"],
        ["/items/rough_hide", "/items/rough_leather"],
        ["/items/reptile_hide", "/items/reptile_leather"],
        ["/items/gobo_hide", "/items/gobo_leather"],
        ["/items/beast_hide", "/items/beast_leather"],
        ["/items/umbral_hide", "/items/umbral_leather"]
    ]);
    //#endregion
    //#region Utils
    class MWI_Toolkit_Utils {
        // 格式化数字
        static formatNumber(num) {
            // 类型和有效性检查
            if (!Number.isFinite(num)) {
                return '0';
            }
            // // 确保非负数
            // const normalizedNum = Math.max(0, num);
            const normalizedNum = num;
            // 小于1000：保留1位小数，但如果小数为0则只显示整数
            if (normalizedNum <= 999) {
                const fixed = normalizedNum.toFixed(1);
                return fixed.endsWith('.0') ? Math.round(normalizedNum).toString() : fixed;
            }
            // 小于100,000：向上取整
            if (normalizedNum <= 99999) {
                return Math.ceil(normalizedNum).toString();
            }
            // 小于10,000,000：显示xxxK (100K~9999K)
            if (normalizedNum <= 9999999) {
                return `${Math.floor(normalizedNum / 1000)}K`;
            }
            // 小于10,000,000,000：显示xxxM (100M~9999M)
            if (normalizedNum <= 9999999999) {
                return `${Math.floor(normalizedNum / 1000000)}M`;
            }
            // 小于10,000,000,000,000：显示xxxB (100B~9999B)
            if (normalizedNum <= 9999999999999) {
                return `${Math.floor(normalizedNum / 1000000000)}B`;
            }
            // 更大的数值显示NaN
            return 'NaN';
        }
        // 获取物品排序索引
        static getSortIndexByItemHrid(hrid) {
            return (MWI_Toolkit.initClientData?.itemDetailMap?.[hrid]?.sortIndex || 9999);
        }
        // 获取技能排序索引
        static getSortIndexByHouseRoomHrid(hrid) {
            return (MWI_Toolkit.initClientData?.houseRoomDetailMap?.[hrid]?.sortIndex || 0) - 9999;
        }
        // 获取物品图标链接
        static getIconHrefByItemHrid(itemHrid) {
            return '/static/media/items_sprite.d4d08849.svg#' + (itemHrid.split('/').pop() || '');
        }
        // 获取技能图标链接
        static getIconHrefBySkillHrid(skillHrid) {
            return '/static/media/skills_sprite.3bb4d936.svg#' + (skillHrid.split('/').pop() || '');
        }
        // 获取房屋图标链接
        static getIconHrefByHouseRoomHrid(houseRoomHrid) {
            return MWI_Toolkit_Utils.getIconHrefBySkillHrid(MWI_Toolkit.initClientData?.houseRoomDetailMap?.[houseRoomHrid]?.skillHrid || houseRoomHrid);
        }
        // 获取杂项图标链接
        static getIconHrefByMiscHrid(hrid) {
            return '/static/media/misc_sprite.6fa5e97c.svg#' + (hrid.split('/').pop() || '');
        }
        // 创建图标SVG元素
        static createIconSvg(iconHref) {
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '18px');
            svg.setAttribute('height', '18px');
            svg.style.display = 'block';
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', iconHref);
            svg.appendChild(use);
            return svg;
        }
        // 触发React对input元素的变更检测
        static reactInputTriggerHack(inputElem) {
            const lastValue = inputElem.value;
            const event = new Event("input", { bubbles: true });
            // 添加自定义标记
            event.simulated = true;
            // 访问React内部的value tracker
            const tracker = inputElem._valueTracker;
            if (tracker) {
                // 触发变更：设置为不同的值以触发React的change检测
                tracker.setValue(lastValue === '' ? ' ' : '');
            }
            inputElem.dispatchEvent(event);
        }
    }
    //#endregion
    //#region I18n
    class MWI_Toolkit_I18n {
        // 获取当前游戏语言
        static getGameLanguage() {
            return MWI_Toolkit.gameObject?.language || 'zh';
        }
        // 获取物品名称
        static getItemName(itemHrid) {
            return MWI_Toolkit_I18n.getName(itemHrid, "itemNames");
        }
        // 获取名称
        static getName(hrid, category) {
            if (!hrid || !category) {
                return hrid;
            }
            // 特例自定义itemCategory名称
            if (category === 'itemCategoryNames') {
                switch (hrid) {
                    case '/item_categories/house_rooms':
                        return MWI_Toolkit_I18n?.getGameLanguage() === 'zh' ? '房屋' : 'House';
                    case '/item_categories/tea':
                        return MWI_Toolkit_I18n?.getGameLanguage() === 'zh' ? '茶' : 'Tea';
                    case '/item_categories/coffee':
                        return MWI_Toolkit_I18n?.getGameLanguage() === 'zh' ? '咖啡' : 'Coffee';
                    case '/item_categories/materials':
                        return MWI_Toolkit_I18n?.getGameLanguage() === 'zh' ? '材料' : 'Materials';
                }
            }
            return MWI_Toolkit.gameObject?.props?.i18n?.options?.resources?.[MWI_Toolkit_I18n?.getGameLanguage()]?.translation?.[category]?.[hrid] || hrid;
        }
        // 通过物品名称获取物品HRID
        static getItemHridByName(itemName) {
            return MWI_Toolkit_I18n.getHridByName(itemName, "itemNames");
        }
        // 通过名称获取HRID
        static getHridByName(name, category) {
            if (!name || !category) {
                return null;
            }
            return Object.entries(MWI_Toolkit.gameObject?.props?.i18n?.options?.resources?.[MWI_Toolkit_I18n?.getGameLanguage()]?.translation?.[category] || {})
                .find(([, v]) => (v || '').toLowerCase() === name.toLowerCase().trim())?.[0] ?? null;
        }
    }
    //#endregion
    //#region ItemsMap
    class MWI_Toolkit_ItemsMap {
        // 获取物品数量
        static getCount(itemHrid, enhancementLevel = 0) {
            return MWI_Toolkit_ItemsMap.map.get(itemHrid)?.get(enhancementLevel) ?? 0;
        }
        // 获取所有物品数量
        static getInventoryMap() {
            const inventoryMap = new Map();
            MWI_Toolkit_ItemsMap.map.forEach((enhancementMap, itemHrid) => {
                inventoryMap.set(itemHrid, enhancementMap.get(0) || 0);
            });
            return inventoryMap;
        }
        // 获取物品最高强化等级
        static getMaxEnhancementLevel(itemHrid) {
            const m = MWI_Toolkit_ItemsMap.map.get(itemHrid);
            if (!m) {
                return -1;
            }
            let max = -1;
            for (const [level, count] of m) {
                if (count > 0 && level > max) {
                    max = level;
                }
            }
            return max;
        }
        // 更新物品数据
        static update(endCharacterItems) {
            if (!endCharacterItems) {
                return;
            }
            for (const item of endCharacterItems) {
                if (!MWI_Toolkit_ItemsMap.map.has(item.itemHrid)) {
                    MWI_Toolkit_ItemsMap.map.set(item.itemHrid, new Map());
                }
                MWI_Toolkit_ItemsMap.map.get(item.itemHrid).set(item.enhancementLevel, item.count);
            }
            MWI_Toolkit_ItemsMap.itemsUpdatedCallbacks.forEach(cb => {
                try {
                    cb(endCharacterItems);
                }
                catch (e) {
                    console.error('[MWI_Toolkit] Error in item updated callback:', e);
                }
            });
        }
        // 清空物品数据
        static clear() {
            MWI_Toolkit_ItemsMap.map.clear();
        }
    }
    /** 物品数据映射表：itemHrid -> (enhancementLevel -> count) */
    MWI_Toolkit_ItemsMap.map = new Map();
    MWI_Toolkit_ItemsMap.itemsUpdatedCallbacks = [];
    //#endregion
    //#region MWI_Toolkit
    class MWI_Toolkit {
        // 启动
        static start() {
            MWI_Toolkit.setupWebSocketInterceptor();
            MWI_Toolkit.waitForElement('[class^="GamePage"]', () => {
                MWI_Toolkit.initialize();
            });
        }
        // 设置 WebSocket 消息拦截器
        static setupWebSocketInterceptor() {
            const oriGet = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data")?.get;
            if (!oriGet) {
                return;
            }
            Object.defineProperty(MessageEvent.prototype, "data", {
                get: function () {
                    const socket = this.currentTarget;
                    // 只拦截游戏服务器的 WebSocket 消息
                    if (!(socket instanceof WebSocket) || (socket.url.indexOf("api.milkywayidle.com/ws") === -1 &&
                        socket.url.indexOf("api-test.milkywayidle.com/ws") === -1 &&
                        socket.url.indexOf("api.milkywayidlecn.com/ws") === -1 &&
                        socket.url.indexOf("api-test.milkywayidlecn.com/ws") === -1)) {
                        return oriGet.call(this);
                    }
                    const message = oriGet.call(this);
                    Object.defineProperty(this, "data", { value: message }); // 防止循环调用
                    MWI_Toolkit?.handleWebSocketMessage(message);
                    return message;
                }
            });
        }
        // 处理 WebSocket 消息
        static handleWebSocketMessage(message) {
            try {
                const obj = JSON.parse(message);
                // 类型守卫：检查是否为对象
                if (!obj || typeof obj !== 'object')
                    return;
                const msgObj = obj;
                // 处理角色初始化消息（使用双重断言）
                if (msgObj.type === "init_character_data" && Array.isArray(msgObj.characterItems)) {
                    MWI_Toolkit.handleInitCharacterData(obj);
                }
                // 处理物品变更消息（使用双重断言）
                else if (Array.isArray(msgObj.endCharacterItems)) {
                    MWI_Toolkit.handleEndCharacterItems(obj);
                }
            }
            catch {
                // 忽略解析错误（非JSON消息或其他错误）
            }
        }
        // 处理角色初始化数据
        static handleInitCharacterData(data) {
            // 清空并初始化物品映射表
            MWI_Toolkit_ItemsMap.clear();
            MWI_Toolkit_ItemsMap.update(data.characterItems);
            if (!MWI_Toolkit.initialized) {
                return;
            }
            console.log("[MWI_Toolkit] 界面刷新");
            MWI_Toolkit_Calculator.initializeCalculatorUI();
            MWI_Toolkit.waitForElement('[class^="GamePage"]', () => {
                MWI_Toolkit.gameObject = MWI_Toolkit.getGameObject();
            });
        }
        // 处理物品变更数据
        static handleEndCharacterItems(data) {
            // 更新物品映射表
            MWI_Toolkit_ItemsMap.update(data.endCharacterItems);
        }
        // 等待元素出现
        static waitForElement(selector, callback) {
            const el = document.querySelector(selector);
            if (el) {
                // 元素已存在，直接执行回调
                callback();
                return;
            }
            // 元素不存在，监听DOM变化
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    callback();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        // 初始化
        static initialize() {
            MWI_Toolkit.gameObject = MWI_Toolkit.getGameObject();
            MWI_Toolkit.initClientData = MWI_Toolkit.getInitClientData();
            if (!MWI_Toolkit.gameObject || !MWI_Toolkit.initClientData) {
                console.error("[MWI_Toolkit] 初始化失败");
                return;
            }
            MWI_Toolkit.initialized = true;
            MWI_Toolkit_ActionDetailPlus.initialize();
            MWI_Toolkit_Calculator.initialize();
            console.log("[MWI_Toolkit] 已初始化");
            console.log(MWI_Toolkit.gameObject, MWI_Toolkit.initClientData);
        }
        // 获取游戏主组件实例
        static getGameObject() {
            // (e => e?.[Object.keys(e).find(k => k.startsWith('__reactFiber$'))]?.return?.stateNode)(document.querySelector('[class^="GamePage"]'))
            const gamePageElement = document.querySelector('[class^="GamePage"]');
            if (!gamePageElement)
                return null;
            // 查找React Fiber的key（格式：__reactFiber$xxx）
            const reactKey = Object.keys(gamePageElement).find(k => k.startsWith('__reactFiber$'));
            if (!reactKey)
                return null;
            // 通过Fiber节点获取组件实例
            const fiber = gamePageElement[reactKey];
            return fiber?.return?.stateNode || null;
        }
        // 获取初始化客户端数据
        static getInitClientData() {
            const compressedData = localStorage.getItem("initClientData");
            if (compressedData) {
                const decompressedData = LZString.decompressFromUTF16(compressedData);
                return JSON.parse(decompressedData);
            }
            return null;
        }
    }
    MWI_Toolkit.gameObject = null;
    MWI_Toolkit.initClientData = null;
    MWI_Toolkit.initialized = false;
    //#endregion
    // 防止重复加载
    if (unsafeWindow.MWI_Toolkit_Started) {
        return;
    }
    unsafeWindow.MWI_Toolkit_Started = true;
    // 启动工具包
    MWI_Toolkit.start();
})();
