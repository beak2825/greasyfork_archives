// ==UserScript==
// @name         MWI_Toolkit_Calculator_edited
// @name:zh-CN   MWI计算器魔改版
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  MWI计算器魔改版
// @description:zh-CN  MWI计算器魔改版
// @author       zqzhang1996,deric魔改
// @icon         https://www.milkywayidle.com/favicon.svg
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @require      https://update.greasyfork.org/scripts/550719/1681178/MWI_Toolkit.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555795/MWI_Toolkit_Calculator_edited.user.js
// @updateURL https://update.greasyfork.org/scripts/555795/MWI_Toolkit_Calculator_edited.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 物品配置数组(单次采摘数量，无采集数量加成)
    const itemConfig = [
        {item: "鸡蛋", num: 3.5},
        {item: "小麦", num: 3.5},
        {item: "糖", num: 6.5},
        {item: "棉花", num: 2},
        {item: "蓝莓", num: 4.5},
        {item: "苹果", num: 2.5},
        {item: "低级咖啡豆", num: 1},
        {item: "亚麻", num: 2},
        {item: "黑莓", num: 4.5},
        {item: "橙子", num: 2.5},
        {item: "中级咖啡豆", num: 1},
        {item: "草莓", num: 4.5},
        {item: "李子", num: 2.5},
        {item: "高级咖啡豆", num: 1},
        {item: "竹子", num: 2},
        {item: "哞莓", num: 4.5},
        {item: "桃子", num: 2.5},
        {item: "特级咖啡豆", num: 1},
        {item: "蚕茧", num: 2},
        {item: "火星莓", num: 4.5},
        {item: "火龙果", num: 2.5},
        {item: "火山咖啡豆", num: 1},
        {item: "太空莓", num: 4.5},
        {item: "杨桃", num: 2.5},
        {item: "太空咖啡豆", num: 1},
        {item: "光辉纤维", num: 2},
        {item: "牛奶", num: 2},
        {item: "翠绿牛奶", num: 2},
        {item: "蔚蓝牛奶", num: 2},
        {item: "深紫牛奶", num: 2},
        {item: "绛红牛奶", num: 2},
        {item: "彩虹牛奶", num: 2},
        {item: "神圣牛奶", num: 2},
        {item: "原木", num: 2},
        {item: "白桦原木", num: 2},
        {item: "雪松原木", num: 2},
        {item: "紫心原木", num: 2},
        {item: "银杏原木", num: 2},
        {item: "红杉原木", num: 2},
        {item: "神秘原木", num: 2}
    ];

    //#region 数据模型层

    // 基础数据结构
    class Item {
        constructor(itemHrid, count, isPrimaryItem = false) {
            this.itemHrid = itemHrid;
            this.count = count;
            this.isPrimaryItem = isPrimaryItem; // 标记是否为第一次单步计算的物品
        }
    }

    // 显示物品类 - 包含计算和显示逻辑
    class DisplayItem {
        constructor(itemHrid, ownedCount, requiredCount, isPrimaryItem = false) {
            this.itemHrid = itemHrid;
            this.ownedCount = ownedCount;
            this.requiredCount = requiredCount;
            this.missingCount = Math.max(0, requiredCount - ownedCount);
            this.checked = true; // 新增：默认勾选状态
            this.isPrimaryItem = isPrimaryItem; // 新增：是否为主目标物品

            // DOM 元素引用
            this.domElement = null;
            this.ownedCountElement = null;
            this.requiredCountElement = null;
            this.missingCountElement = null;
            this.checkboxElement = null; // 新增：勾选框引用

            this.initDisplayProperties();
        }

        initDisplayProperties() {
            if (this.itemHrid.includes('/items/')) {
                // 显示名称和图标等属性初始化
                this.displayName = Utils.getItemDisplayName(this.itemHrid);
                this.iconHref = Utils.getIconHrefByItemHrid(this.itemHrid);
                this.sortIndex = Utils.getSortIndexByHrid(this.itemHrid);
            }
            else if (this.itemHrid.includes('/house_rooms/')) {
                // 显示名称和图标等属性初始化
                this.displayName = Utils.getHouseRoomDisplayName(this.itemHrid);
                this.iconHref = Utils.getIconHrefByHouseRoomHrid(this.itemHrid);
                this.sortIndex = Utils.getSortIndexByHrid(this.itemHrid);
            }
        }

        // 更新数据并同步到DOM
        updateCounts(ownedCount, requiredCount) {
            this.ownedCount = ownedCount;
            this.requiredCount = requiredCount;
            this.missingCount = Math.max(0, requiredCount - ownedCount);

            // 仅在数值变化时才更新DOM，避免丢失选中状态
            if (this.ownedCountElement) {
                const newText = Utils.formatNumber(this.ownedCount);
                if (this.ownedCountElement.textContent !== newText) {
                    this.ownedCountElement.textContent = newText;
                }
            }
            if (this.missingCountElement) {
                let newText = Utils.formatNumber(this.missingCount);
                
                // 检查物品是否存在于itemConfig中
                const configItem = itemConfig.find(item => item.item === this.displayName);
                if (configItem && configItem.num > 0) {
                    // 使用缓存的采摘数量加成值，默认为1
                    let pickBuffValue = 1;
                    if (typeof MWI_Toolkit_Calculator_App !== 'undefined' && 
                        MWI_Toolkit_Calculator_App.pickBuffValueCache !== null) {
                        pickBuffValue = MWI_Toolkit_Calculator_App.pickBuffValueCache;
                    } else {
                        // 如果缓存未初始化，尝试加载一次
                        if (typeof MWI_Toolkit_Calculator_App !== 'undefined' && 
                            typeof MWI_Toolkit_Calculator_App.DataManager !== 'undefined') {
                            pickBuffValue = MWI_Toolkit_Calculator_App.DataManager.loadPickBuffValue() || 1;
                            MWI_Toolkit_Calculator_App.pickBuffValueCache = pickBuffValue; // 初始化缓存
                        }
                    }
                    // 计算次数（取整），额外除以采摘数量加成的数值
                    const times = Math.floor(this.missingCount / (configItem.num * pickBuffValue));
                    newText += `/${times}次`;
                }
                
                if (this.missingCountElement.textContent !== newText) {
                    this.missingCountElement.textContent = newText;
                }
            }
            if (this.requiredCountElement) {
                // requiredCountElement 是输入框，无需对数字进行格式化
                const newValue = this.requiredCount;
                if (this.requiredCountElement.value !== newValue) {
                    this.requiredCountElement.value = newValue;
                }
            }
            // 确保勾选框状态正确
            if (this.checkboxElement) {
                // 只有当勾选框的当前状态与对象状态不同时才更新，避免触发不必要的change事件
                if (this.checkboxElement.checked !== this.checked) {
                    this.checkboxElement.checked = this.checked;
                }
            }
        }

        // 设置DOM元素引用
        setDomReferences(domElement, ownedCountElement = null, requiredCountElement = null, missingCountElement = null, checkboxElement = null) {
            this.domElement = domElement;
            this.ownedCountElement = ownedCountElement;
            this.requiredCountElement = requiredCountElement;
            this.missingCountElement = missingCountElement;
            this.checkboxElement = checkboxElement;
        }

        // 销毁DOM引用
        destroyDomReferences() {
            this.domElement = null;
            this.ownedCountElement = null;
            this.requiredCountElement = null;
            this.missingCountElement = null;
        }
    }

    //#endregion

    //#region 工具类

    class Utils {
        // 格式化数字显示
        static formatNumber(num) {
            if (typeof num !== 'number' || isNaN(num)) return '0';
            if (num < 0) num = 0;
            if (num < 1000) {
                // 整数部分<=3位，保留1位小数，但如果小数为0则只显示整数
                const fixed = num.toFixed(1);
                if (fixed.endsWith('.0')) {
                    return Math.round(num).toString();
                }
                return fixed;
            } else if (num < 100000) {
                // 整数部分<=5位，向上取整
                return Math.ceil(num).toString();
            } else if (num < 10_000_000) {
                // 10,000,000~9,999,999 显示xxxK
                return Math.floor(num / 1000) + 'K';
            } else if (num < 10_000_000_000) {
                // 10,000,000~9,999,999,999 显示xxxM
                return Math.floor(num / 1_000_000) + 'M';
            } else if (num < 10_000_000_000_000) {
                // 10,000,000,000~9,999,999,999,999 显示xxxB
                return Math.floor(num / 1_000_000_000) + 'B';
            } else {
                // 更大的数值显示NaN
                return 'NaN';
            }
        }

        // 获取物品排序索引
        static getSortIndexByHrid(hrid) {
            if (hrid.includes('/items/')) {
                return window.MWI_Toolkit?.init_client_data?.itemDetailMap?.[hrid]?.sortIndex || 9999;
            }
            if (hrid.includes('/house_rooms/')) {
                return window.MWI_Toolkit?.init_client_data?.houseRoomDetailMap?.[hrid]?.sortIndex - 9999 || -9999;
            }
            return 9999;
        }

        static getIconHrefByItemHrid(itemHrid) {
            return '/static/media/items_sprite.d4d08849.svg#' + itemHrid.split('/').pop();
        }

        static getIconHrefBySkillHrid(skillHrid) {
            return '/static/media/skills_sprite.3bb4d936.svg#' + skillHrid.split('/').pop();
        }

        static getIconHrefByHouseRoomHrid(houseRoomHrid) {
            const skillHrid = window.MWI_Toolkit?.init_client_data?.houseRoomDetailMap?.[houseRoomHrid]?.skillHrid || houseRoomHrid;
            return Utils.getIconHrefBySkillHrid(skillHrid);
        }

        static getIconHrefByMiscHrid(hrid) {
            return '/static/media/misc_sprite.6fa5e97c.svg#' + hrid.split('/').pop();
        }

        static getItemDisplayName(itemHrid) {
            return window.MWI_Toolkit?.i18n?.getItemName(itemHrid, MWI_Toolkit_Calculator_App.Language);
        }

        static getHouseRoomDisplayName(houseRoomHrid) {
            return window.MWI_Toolkit?.i18n?.getName(houseRoomHrid, "houseRoomNames", MWI_Toolkit_Calculator_App.Language);
        }
    }
    //#endregion

    //#region 核心计算引擎

    class MWI_Toolkit_Calculator_Core {
        constructor() {
            this.targetItems = [];
        }

        // 递归计算所需材料
        calculateRequiredItems(itemHrid, count) {
            let requiredItems = [];

            if (itemHrid.includes('/house_rooms/')) {
                // 处理房屋房间逻辑
                return this.calculateRequiredItemsForHouseRoom(itemHrid, count);
            }

            // 检查是否是目标物品（通过传入的targetItemHrids集合）
            const targetItemHrids = arguments.length > 2 && arguments[2] instanceof Set ? arguments[2] : new Set();
            const isTargetItem = targetItemHrids.has(itemHrid);
            
            // 为目标物品标记为primary
            requiredItems.push(new Item(itemHrid, count, isTargetItem));
            

            // 检查是否开启单步计算模式
            const isSingleStepMode = typeof MWI_Toolkit_Calculator_App !== 'undefined' && 
                                     MWI_Toolkit_Calculator_App.hasOwnProperty('isSingleStepMode') && 
                                     MWI_Toolkit_Calculator_App.isSingleStepMode;
            
            // 用于标记是否是单步计算的第二次调用（已完成第一步计算）
            const isSecondStep = arguments.length > 2 && typeof arguments[2] === 'boolean' && arguments[2] === true;
            
            // 如果是单步计算的第二次调用，则不继续递归计算
            if (isSingleStepMode && isSecondStep) {
                return requiredItems;
            }

            const actionTypes = ["cheesesmithing", "crafting", "tailoring", "cooking", "brewing"];
            const itemName = itemHrid.split('/').pop();

            for (const actionType of actionTypes) {
                const actionHrid = `/actions/${actionType}/${itemName}`;
                if (window.MWI_Toolkit?.init_client_data?.actionDetailMap?.hasOwnProperty(actionHrid)) {
                    const actionDetail = window.MWI_Toolkit.init_client_data.actionDetailMap[actionHrid];
                    const upgradeItemHrid = actionDetail.upgradeItemHrid;
                    const inputItems = actionDetail.inputItems;

                    let outputCount = 1;
                    const outputItems = actionDetail.outputItems;
                    if (outputItems && outputItems.length > 0) {
                        const matchingOutput = outputItems.find(output => output.itemHrid === itemHrid);
                        if (matchingOutput) {
                            outputCount = matchingOutput.count;
                        }
                    }

                    const actionTypeDrinkSlots = this.getActionTypeDrinkSlots(actionType);
                    // 检查工匠茶加成
                    let artisanBuff = 0;
                    if (actionTypeDrinkSlots?.some(slot => slot && slot.itemHrid === '/items/artisan_tea')) {
                        artisanBuff = 0.1 * this.getDrinkConcentration();
                    }

                    // 检查美食茶加成
                    let gourmetBuff = 0;
                    if (actionTypeDrinkSlots?.some(slot => slot && slot.itemHrid === '/items/gourmet_tea')) {
                        gourmetBuff = 0.0 * this.getDrinkConcentration();
                    }

                    // 递归计算输入材料
                    for (const input of inputItems) {
                        const adjustedCount = input.count * count / outputCount * (1 - artisanBuff) / (1 + gourmetBuff);
                        // 在单步模式下，传递isSecondStep=true参数
                        const recursiveResult = this.calculateRequiredItems(input.itemHrid, adjustedCount, isSingleStepMode);
                        requiredItems = this.mergeMaterialArrays(requiredItems, recursiveResult);
                    }

                    // 处理升级物品（不适用工匠茶加成）
                    if (upgradeItemHrid) {
                        // 在单步模式下，传递isSecondStep=true参数
                        const upgradeResult = this.calculateRequiredItems(upgradeItemHrid, count / outputCount / (1 + gourmetBuff), isSingleStepMode);
                        requiredItems = this.mergeMaterialArrays(requiredItems, upgradeResult);
                    }

                    return requiredItems;
                }
            }
            return requiredItems;
        }

        // 计算房屋房间所需材料
        calculateRequiredItemsForHouseRoom(houseRoomHrid, level) {
            let targetItems = [];
            const characterHouseRoomLevel = window.MWI_Toolkit?.init_character_data?.characterHouseRoomMap[houseRoomHrid]?.level || 0;
            const upgradeCostsMap = window.MWI_Toolkit?.init_client_data?.houseRoomDetailMap?.[houseRoomHrid]?.upgradeCostsMap;

            for (let i = characterHouseRoomLevel + 1; i <= level && i <= 8; i++) {
                targetItems = targetItems.concat(upgradeCostsMap[i] || []);
            }

            return this.batchCalculateRequiredItems(targetItems);
        }

        // 批量计算材料需求
        batchCalculateRequiredItems(targetItems) {
            let result = [];
            // 保存所有目标物品的hrid，用于标记
            const targetItemHrids = new Set();
            
            for (const targetItem of targetItems) {
                // 查找对应的DisplayItem来获取勾选状态
                const displayItem = MWI_Toolkit_Calculator_App.UIManager.targetDisplayItems.get(targetItem.itemHrid);
                
                // 如果物品未勾选，则直接跳过不处理，不参与材料计算
                if (displayItem && !displayItem.checked) {
                    continue;
                }
                
                // 记录目标物品的hrid
                targetItemHrids.add(targetItem.itemHrid);
                
                // 传递targetItemHrids集合给calculateRequiredItems方法
                const requiredItems = this.calculateRequiredItems(targetItem.itemHrid, targetItem.count, targetItemHrids);
                result = this.mergeMaterialArrays(result, requiredItems, targetItemHrids);
            }
            return result;
        }

        // 计算等效材料
        calculateEquivalentItems(requiredItems, ownedItems) {
            const equivalentItems = [];
            for (const ownedItem of ownedItems) {
                // 这里count取requiredItems和ownedItems中的较小值并乘-1，表示用于抵消需求
                const requiredItem = requiredItems.find(ri => ri.itemHrid === ownedItem.itemHrid);
                if (requiredItem) {
                    const equivalentCount = Math.min(requiredItem.count, ownedItem.count) * -1;
                    equivalentItems.push(new Item(ownedItem.itemHrid, equivalentCount));
                }
            }
            
            // 检查是否开启单步计算模式
            const isSingleStepMode = typeof MWI_Toolkit_Calculator_App !== 'undefined' && 
                                     MWI_Toolkit_Calculator_App.hasOwnProperty('isSingleStepMode') && 
                                     MWI_Toolkit_Calculator_App.isSingleStepMode;
            
            // 在单步模式下，直接返回equivalentItems而不进行进一步分解
            if (isSingleStepMode) {
                return equivalentItems;
            }
            
            // 非单步模式下继续分解
            return this.batchCalculateRequiredItems(equivalentItems);
        }

        // 合并材料数组并按排序顺序返回
        mergeMaterialArrays(arr1, arr2, targetItemHrids = new Set()) {
            const map = new Map();
            // 保存primary标记信息
            const primaryItems = new Set();
            
            // 合并两个数组中的所有物品
            const allItems = arr1.concat(arr2);
            
            for (const item of allItems) {
                if (map.has(item.itemHrid)) {
                    if (item.itemHrid.includes('/items/')) {
                        map.get(item.itemHrid).count += item.count;
                    }
                    if (item.itemHrid.includes('/house_rooms/')) {
                        map.get(item.itemHrid).count = Math.max(map.get(item.itemHrid).count, item.count);
                    }
                    // 如果任一实例是primary，则保留primary标记
                    if (item.isPrimaryItem || targetItemHrids.has(item.itemHrid)) {
                        primaryItems.add(item.itemHrid);
                    }
                } else {
                    // 检查是否是目标物品
                    const isTargetItem = targetItemHrids.has(item.itemHrid);
                    map.set(item.itemHrid, new Item(item.itemHrid, item.count, item.isPrimaryItem || isTargetItem));
                    // 记录primary标记
                    if (item.isPrimaryItem || isTargetItem) {
                        primaryItems.add(item.itemHrid);
                    }
                }
            }
            
            // 排序：先按是否为primary排序（primary在前），然后按原有的sortIndex排序
            return Array.from(map.values()).sort((a, b) => {
                // 首先检查是否为primary item
                const aIsPrimary = primaryItems.has(a.itemHrid);
                const bIsPrimary = primaryItems.has(b.itemHrid);
                
                if (aIsPrimary && !bIsPrimary) return -1;
                if (!aIsPrimary && bIsPrimary) return 1;
                
                // 都是primary或都不是primary时，按原有的sortIndex排序
                return Utils.getSortIndexByHrid(a.itemHrid) - Utils.getSortIndexByHrid(b.itemHrid);
            });
        }

        // 检查拥有的物品
        checkOwnedItems(requiredItems) {
            const ownedItems = [];
            for (const requiredItem of requiredItems) {
                const ownedCount = window.MWI_Toolkit?.characterItems?.getCount(requiredItem.itemHrid) || 0;
                ownedItems.push(new Item(requiredItem.itemHrid, ownedCount));
            }
            return ownedItems;
        }

        // 获取茶列表
        getActionTypeDrinkSlots(actionType) {
            return window.MWI_Toolkit?.init_character_data?.actionTypeDrinkSlotsMap?.[`/action_types/${actionType}`];
        }

        // 获取饮料浓度系数
        getDrinkConcentration() {
            let drinkConcentration = 1;
            if (window.MWI_Toolkit?.init_client_data && window.MWI_Toolkit?.characterItems) {
                const enhancementLevel = window.MWI_Toolkit.characterItems.getMaxEnhancementLevel("/items/guzzling_pouch");
                if (enhancementLevel != -1) {
                    drinkConcentration = 1
                        + window.MWI_Toolkit.init_client_data.itemDetailMap?.[`/items/guzzling_pouch`].equipmentDetail.noncombatStats.drinkConcentration
                        + window.MWI_Toolkit.init_client_data.itemDetailMap?.[`/items/guzzling_pouch`].equipmentDetail.noncombatEnhancementBonuses.drinkConcentration
                        * window.MWI_Toolkit.init_client_data.enhancementLevelTotalBonusMultiplierTable[enhancementLevel];
                }
            }
            return drinkConcentration;
        }
    }

    //#endregion

    //#region 数据持久化管理

    class MWI_Toolkit_Calculator_DataManager {
        constructor() {
            this.characterID = null;
            this.storageKey = null;
        }

        // 初始化存储键
        initStorageKey() {
            try {
                const characterID = window.MWI_Toolkit?.init_character_data?.character?.id;
                if (characterID) {
                    this.characterID = characterID;
                    this.storageKey = `MWI_Toolkit_Calculator_targetItems_${characterID}`;
                    this.pickBuffStorageKey = `MWI_Toolkit_Calculator_pickBuff_${characterID}`;
                }
            } catch (error) {
                console.error('[MWI计算器] 初始化存储键失败:', error);
            }
        }
        
        // 保存采摘数量加成值
        savePickBuffValue(value) {
            if (!this.pickBuffStorageKey) {
                return false;
            }
            
            try {
                GM_setValue(this.pickBuffStorageKey, value);
                console.log('[MWI计算器] 保存采摘数量加成值成功:', value);
                // 保存时更新缓存
                if (typeof MWI_Toolkit_Calculator_App !== 'undefined') {
                    MWI_Toolkit_Calculator_App.pickBuffValueCache = value;
                    console.log('[MWI计算器] 更新缓存采摘数量加成值:', value);
                }
                return true;
            } catch (error) {
                console.error('[MWI计算器] 保存采摘数量加成值失败:', error);
                return false;
            }
        }
        
        // 加载采摘数量加成值
        loadPickBuffValue() {
            if (!this.pickBuffStorageKey) {
                return 1.15; // 默认值
            }
            
            try {
                const value = GM_getValue(this.pickBuffStorageKey, 1.15);
                console.log('[MWI计算器] 加载采摘数量加成值:', value);
                return value;
            } catch (error) {
                console.error('[MWI计算器] 加载采摘数量加成值失败:', error);
                return 1.15; // 加载失败返回默认值
            }
        }

        // 保存目标物品和勾选状态
        saveTargetItems(targetItems) {
            if (!this.storageKey) {
                return false;
            }

            try {
                const dataToSave = targetItems.map(item => {
                    // 从checkedStatesCache获取物品的勾选状态（如果存在的话）
                    const checked = MWI_Toolkit_Calculator_App.UIManager.checkedStatesCache?.get(item.itemHrid) ?? true;
                    return {
                        itemHrid: item.itemHrid,
                        count: item.count,
                        checked: checked // 保存勾选状态
                    };
                });
                console.log('[MWI计算器] 准备保存的数据:', dataToSave);
                // 确保保存为JSON字符串
                try {
                    const jsonString = JSON.stringify(dataToSave);
                    GM_setValue(this.storageKey, jsonString);
                    console.log('[MWI计算器] 保存成功，存储键:', this.storageKey, '数据长度:', jsonString.length);
                } catch (stringifyError) {
                    console.error('[MWI计算器] JSON序列化失败:', stringifyError);
                    // 尝试保存为非字符串形式作为备选方案
                    GM_setValue(this.storageKey, dataToSave);
                }
                return true;
            } catch (error) {
                console.error('[MWI计算器] 保存目标物品失败:', error);
                return false;
            }
        }

        // 加载目标物品
        loadTargetItems() {
            if (this.characterID) {
                return this.tryLoadTargetItemsFromCharacterID(this.characterID);
            }
        }

        // 从特定角色ID加载数据
        tryLoadTargetItemsFromCharacterID(characterID) {
            const storageKeys = GM_listValues();
            // 优先查找标准格式的键
            const standardKey = `MWI_Toolkit_Calculator_targetItems_${characterID}`;
            let storageKey = standardKey;
            
            // 如果标准键不存在，尝试查找包含角色ID的其他键
            if (!storageKeys.includes(standardKey)) {
                storageKey = storageKeys.find(key => key.includes(characterID));
            }

            if (!storageKey) return;

            try {
                const savedData = GM_getValue(storageKey, '[]');
                let loadedData;
                
                // 检查数据是否已经是字符串格式的JSON
                if (typeof savedData === 'string') {
                    try {
                        loadedData = JSON.parse(savedData);
                    } catch (parseError) {
                        console.error('[MWI计算器] 解析JSON数据失败，尝试作为原始对象处理:', parseError);
                        // 可能已经是对象格式，直接使用
                        loadedData = savedData;
                    }
                } else {
                    // 如果不是字符串，直接使用
                    loadedData = savedData;
                }
                
                // 确保loadedData是一个数组
                if (!Array.isArray(loadedData)) {
                    console.error('[MWI计算器] 数据格式错误，期望数组但得到:', typeof loadedData);
                    return;
                }

                // 验证并转换为Item实例，同时保存勾选状态映射
                const validItems = [];
                const checkedStates = new Map(); // 存储勾选状态

                loadedData.forEach(itemData => {
                    if (itemData && itemData.itemHrid && typeof itemData.count === 'number') {
                        validItems.push(new Item(itemData.itemHrid, itemData.count));
                        // 保存勾选状态，如果没有则默认为true
                        checkedStates.set(itemData.itemHrid, itemData.checked !== undefined ? itemData.checked : true);
                    }
                });

                if (validItems.length > 0) {
                    MWI_Toolkit_Calculator_App.Core.targetItems = validItems;
                    
                    // 合并加载的勾选状态到缓存中，确保不会丢失任何状态
                    checkedStates.forEach((value, key) => {
                        MWI_Toolkit_Calculator_App.UIManager.checkedStatesCache.set(key, value);
                    });
                    
                    MWI_Toolkit_Calculator_App.UIManager.clearAllDisplayItems();
                    MWI_Toolkit_Calculator_App.UIManager.renderItemsDisplay();

                    // 替换旧的键为新的
                    if (!storageKey.startsWith('MWI_Toolkit_Calculator_targetItems_')
                        && storageKey.includes(this.characterID)) {
                        GM_deleteValue(storageKey);
                    }
                    
                    // 立即保存一次，确保数据格式正确
                    this.saveTargetItems(MWI_Toolkit_Calculator_App.Core.targetItems);
                }
            } catch (error) {
                console.error('[MWI计算器] 加载目标物品失败:', error);
            }
        }

        // 清空保存的数据
        clearSavedData() {
            if (!this.storageKey) {
                return false;
            }

            try {
                GM_setValue(this.storageKey, '[]');
                return true;
            } catch (error) {
                return false;
            }
        }
    }

    //#endregion

    //#region UI 组件管理

    class MWI_Toolkit_Calculator_UIManager {
        constructor() {
            this.tabButton = null;
            this.tabPanel = null;
            this.targetItemDiv = null;
            this.missingItemDiv = null;

            // DisplayItem 实例管理
            this.targetDisplayItems = new Map(); // itemHrid -> DisplayItem
            this.missingDisplayItems = new Map(); // itemHrid -> DisplayItem
            
            // 缓存加载的勾选状态
            this.checkedStatesCache = new Map();
            
            // 面板显示区域数组，支持多面板同步显示
            this.panelDisplays = [];
            
            // 初始化时尝试加载保存的勾选状态
            this.loadSavedCheckedStates();
        }
        
        // 加载保存的勾选状态
        loadSavedCheckedStates() {
            try {
                const dataManager = MWI_Toolkit_Calculator_App.DataManager;
                if (dataManager && dataManager.characterID) {
                    const storageKey = `MWI_Toolkit_Calculator_targetItems_${dataManager.characterID}`;
                    const savedData = GM_getValue(storageKey, '[]');
                    const loadedData = JSON.parse(savedData);
                    
                    loadedData.forEach(itemData => {
                        if (itemData && itemData.itemHrid && itemData.checked !== undefined) {
                            this.checkedStatesCache.set(itemData.itemHrid, itemData.checked);
                        }
                    });
                }
            } catch (error) {
                console.error('[MWI计算器] 加载保存的勾选状态失败:', error);
            }
        }

        // 初始化UI
        initialize() {
            // 已有标签页则不重复初始化
            if (document.querySelector('[class^="Toolkit_Calculator_Container"]')) { return; }
            if (document.title.includes('Milky Way Idle')) {
                MWI_Toolkit_Calculator_App.Language = 'en';
            }
            else {
                MWI_Toolkit_Calculator_App.Language = 'zh';
            }

            // 获取容器
            const tabsContainer = document.querySelector('[class^="CharacterManagement_tabsComponentContainer"] [class*="TabsComponent_tabsContainer"]');
            const tabPanelsContainer = document.querySelector('[class^="CharacterManagement_tabsComponentContainer"] [class*="TabsComponent_tabPanelsContainer"]');

            if (!tabsContainer || !tabPanelsContainer) {
                console.error('[MWI计算器] 无法找到标签页容器');
            } else {
                this.createCalculatorTab(tabsContainer, tabPanelsContainer);
            }

            // 尝试在特定位置添加计算器面板
            this.addCalculatorAtSpecificLocation();

            console.log('[MWI计算器] UI初始化完成');
        }
        
        // 在特定位置添加计算器面板
        addCalculatorAtSpecificLocation() {
            // 定义目标按钮选择器
            const targetButtonSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div > button:nth-child(5)';
            // 定义目标徽章选择器（用户指定的完整选择器）
            const targetBadgeSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div > div > div.TabsComponent_tabsContainer__3BDUp > div > div > div > button:nth-child(5) > span.MuiBadge-root.TabsComponent_badge__1Du26.css-1rzb3uu';
            
            // 标记计算器面板是否已添加
            let calculatorAdded = false;
            // 标记目标元素是否存在
            let targetElementExists = false;
            
            // 检查并添加计算器面板的函数
            const checkAndAddCalculator = () => {
                // 查找目标按钮
                const targetButton = document.querySelector(targetButtonSelector);
                // 检查目标徽章元素是否存在
                const targetBadgeExists = document.querySelector(targetBadgeSelector) !== null;
                
                if (targetButton && targetBadgeExists) {
                    // 目标元素存在，但计算器面板可能不存在
                    const calculatorExists = targetButton.parentElement.querySelector('.Toolkit_Calculator_Container');
                    
                    if (!calculatorExists) {
                        // 如果计算器面板不存在，创建并添加
                        this.createCalculatorAtTargetLocation(targetButton);
                        console.log('[MWI计算器] 重新添加计算器面板');
                    }
                    calculatorAdded = true;
                    targetElementExists = true;
                } else {
                    // 目标元素不存在
                    calculatorAdded = false;
                    targetElementExists = false;
                }
            };
            
            // 使用MutationObserver监控目标元素出现和消失
            const observer = new MutationObserver(() => {
                const currentTargetBadgeExists = document.querySelector(targetBadgeSelector) !== null;
                
                if (currentTargetBadgeExists && !targetElementExists) {
                    // 目标元素从不存在变为存在
                    console.log('[MWI计算器] 目标元素重新出现');
                    checkAndAddCalculator();
                } else if (!currentTargetBadgeExists && targetElementExists) {
                    // 目标元素从存在变为不存在
                    console.log('[MWI计算器] 目标元素消失');
                    calculatorAdded = false;
                    targetElementExists = false;
                } else if (currentTargetBadgeExists && targetElementExists && !calculatorAdded) {
                    // 目标元素存在，但计算器面板可能被移除了
                    checkAndAddCalculator();
                }
            });
            
            // 开始监听文档体变化
            observer.observe(document.body, { childList: true, subtree: true });
            console.log('[MWI计算器] 开始持续监控特定位置...');
            
            // 初始检查
            checkAndAddCalculator();
        }
        
        // 在目标按钮右侧创建计算器面板
        createCalculatorAtTargetLocation(targetButton) {
            try {
                // 找到标签按钮容器（目标按钮的父容器）
                const buttonContainer = targetButton.parentElement;
                
                // 找到对应的标签面板容器（通过结构关系查找）
                const tabsContainer = targetButton.closest('.TabsComponent_tabsContainer__3BDUp');
                if (!tabsContainer) {
                    console.error('[MWI计算器] 无法找到标签容器');
                    return;
                }
                
                // 查找标签面板容器（通常在tabsContainer的同级或附近）
                let tabPanelsContainer = tabsContainer.parentElement.querySelector('[class*="tabPanelsContainer"]') || 
                                         tabsContainer.parentElement.querySelector('[class*="TabPanel_tabPanel"]')?.parentElement;
                
                if (!tabPanelsContainer) {
                    // 如果找不到，尝试通过DOM结构向上查找
                    let current = tabsContainer;
                    while (current && !tabPanelsContainer) {
                        current = current.parentElement;
                        tabPanelsContainer = current?.querySelector('[class*="tabPanelsContainer"]') || 
                                           current?.querySelector('[class*="TabPanel_tabPanel"]')?.parentElement;
                    }
                }
                
                if (!tabPanelsContainer) {
                    console.error('[MWI计算器] 无法找到标签面板容器');
                    return;
                }
                
                // 克隆目标按钮作为新的计算器按钮
                const calculatorButton = targetButton.cloneNode(true);
                calculatorButton.children[0].textContent = (MWI_Toolkit_Calculator_App.Language === 'zh') ? 'MWI计算器' : 'MWI_Calculator';
                
                // 查找现有面板以克隆结构
                const existingPanels = tabPanelsContainer.querySelectorAll('[class*="TabPanel_tabPanel"]');
                if (existingPanels.length === 0) {
                    console.error('[MWI计算器] 无法找到现有面板');
                    return;
                }
                
                // 克隆面板结构
                const calculatorPanel = existingPanels[0].cloneNode(false);
                calculatorPanel.style.display = 'none'; // 初始隐藏
                
                // 创建计算器内容
                const calculatorContent = this.createCalculatorPanel();
                calculatorPanel.appendChild(calculatorContent);
                
                // 添加到DOM
                buttonContainer.appendChild(calculatorButton);
                tabPanelsContainer.appendChild(calculatorPanel);
                
                // 绑定事件
                this.bindSpecificLocationTabEvents(calculatorButton, calculatorPanel, buttonContainer.children, tabPanelsContainer.children);
                
                console.log('[MWI计算器] 已在特定位置添加计算器面板');
            } catch (error) {
                console.error('[MWI计算器] 在特定位置添加面板失败:', error);
            }
        }
        
        // 绑定特定位置标签页的事件
        bindSpecificLocationTabEvents(calculatorButton, calculatorPanel, allButtons, allPanels) {
            // 点击事件处理
            calculatorButton.addEventListener('click', () => {
                // 隐藏所有面板
                for (let i = 0; i < allPanels.length; i++) {
                    allPanels[i].style.display = 'none';
                    allPanels[i].classList.add('TabPanel_hidden__26UM3');
                }
                
                // 取消所有按钮的选中状态
                for (let i = 0; i < allButtons.length; i++) {
                    allButtons[i].classList.remove('Mui-selected');
                    allButtons[i].setAttribute('aria-selected', 'false');
                    allButtons[i].tabIndex = -1;
                }
                
                // 显示当前面板并选中当前按钮
                calculatorPanel.style.display = 'block';
                calculatorPanel.classList.remove('TabPanel_hidden__26UM3');
                calculatorButton.classList.add('Mui-selected');
                calculatorButton.setAttribute('aria-selected', 'true');
                calculatorButton.tabIndex = 0;
                
                // 重新渲染物品显示
                this.renderItemsDisplay();
            });
            
            // 为其他按钮添加事件，确保点击时隐藏计算器面板
            for (let i = 0; i < allButtons.length; i++) {
                if (allButtons[i] !== calculatorButton) {
                    // 保存原始点击事件
                    const originalClick = allButtons[i].onclick;
                    allButtons[i].addEventListener('click', () => {
                        calculatorPanel.style.display = 'none';
                        calculatorPanel.classList.add('TabPanel_hidden__26UM3');
                        calculatorButton.classList.remove('Mui-selected');
                        calculatorButton.setAttribute('aria-selected', 'false');
                        calculatorButton.tabIndex = -1;
                    });
                }
            }
        }

        // 创建MWI计算器标签页
        createCalculatorTab(tabsContainer, tabPanelsContainer) {
            // 新增"MWI计算器"按钮
            const oldTabButtons = tabsContainer.querySelectorAll("button");
            this.tabButton = oldTabButtons[1].cloneNode(true);
            this.tabButton.children[0].textContent = (MWI_Toolkit_Calculator_App.Language === 'zh') ? 'MWI计算器' : 'MWI_Calculator';
            oldTabButtons[0].parentElement.appendChild(this.tabButton);

            // 新增MWI计算器tabPanel
            const oldTabPanels = tabPanelsContainer.querySelectorAll('[class*="TabPanel_tabPanel"]');
            this.tabPanel = oldTabPanels[1].cloneNode(false);
            oldTabPanels[0].parentElement.appendChild(this.tabPanel);

            this.bindCalculatorTabEvents(oldTabButtons, oldTabPanels);

            // 创建计算器面板
            const calculatorPanel = this.createCalculatorPanel();
            this.tabPanel.appendChild(calculatorPanel);
        }

        // 绑定标签页事件
        bindCalculatorTabEvents(oldTabButtons, oldTabPanels) {
            for (let i = 0; i < oldTabButtons.length; i++) {
                oldTabButtons[i].addEventListener('click', (event) => {
                    this.tabPanel.hidden = true; // 强制隐藏
                    this.tabPanel.classList.add('TabPanel_hidden__26UM3');
                    this.tabButton.classList.remove('Mui-selected');
                    this.tabButton.setAttribute('aria-selected', 'false');
                    this.tabButton.tabIndex = -1;

                    oldTabButtons[i].classList.add('Mui-selected');
                    oldTabButtons[i].setAttribute('aria-selected', 'true');
                    oldTabButtons[i].tabIndex = 0;
                    oldTabPanels[i].classList.remove('TabPanel_hidden__26UM3');
                    oldTabPanels[i].hidden = false; // 显示目标
                }, true);
            }

            this.tabButton.addEventListener('click', (event) => {
                oldTabButtons.forEach(btn => {
                    btn.classList.remove('Mui-selected');
                    btn.setAttribute('aria-selected', 'false');
                    btn.tabIndex = -1;
                });
                oldTabPanels.forEach(panel => {
                    panel.hidden = true; // 强制隐藏
                    panel.classList.add('TabPanel_hidden__26UM3');
                });

                this.tabButton.classList.add('Mui-selected');
                this.tabButton.setAttribute('aria-selected', 'true');
                this.tabButton.tabIndex = 0;
                this.tabPanel.classList.remove('TabPanel_hidden__26UM3');
                this.tabPanel.hidden = false; // 显示目标
            }, true);
        }

        // 创建计算器面板
        createCalculatorPanel() {
            const calculatorPanel = document.createElement('div');
            calculatorPanel.className = 'Toolkit_Calculator_Container';

            // 创建物品搜索区域
            const addItemSection = this.createAddItemSection();
            calculatorPanel.appendChild(addItemSection);

            // 创建左右分栏布局
            const targetItemDiv = document.createElement('div');
            targetItemDiv.style.display = 'inline-block';
            targetItemDiv.style.verticalAlign = 'top';
            targetItemDiv.style.width = '60%';

            const missingItemDiv = document.createElement('div');
            missingItemDiv.style.display = 'inline-block';
            missingItemDiv.style.verticalAlign = 'top';
            missingItemDiv.style.width = '40%';

            calculatorPanel.appendChild(targetItemDiv);
            calculatorPanel.appendChild(missingItemDiv);

            // 保存面板显示区域引用
            const panelDisplay = {
                targetItemDiv: targetItemDiv,
                missingItemDiv: missingItemDiv
            };
            
            // 如果是第一个面板，设置为默认引用
            if (this.panelDisplays.length === 0) {
                this.targetItemDiv = targetItemDiv;
                this.missingItemDiv = missingItemDiv;
            }
            
            // 添加到面板显示数组
            this.panelDisplays.push(panelDisplay);
            
            // 立即渲染当前的计算结果，确保新面板显示内容
            this.renderItemsDisplay();

            return calculatorPanel;
        }

        // 创建添加物品区域
        createAddItemSection() {
            const addItemSection = document.createElement('div');

            // 左侧60%：物品搜索区域
            const leftSection = document.createElement('div');
            leftSection.style.display = 'inline-block';
            leftSection.style.verticalAlign = 'top';
            leftSection.style.width = '60%';

            const searchContainer = this.createItemSearchComponent();
            leftSection.appendChild(searchContainer);
            
            // 创建单步计算勾选框
            this.createSingleStepCheckbox(leftSection);

            // 右侧40%：房屋选择区域
            const rightSection = document.createElement('div');
            rightSection.style.display = 'inline-block';
            rightSection.style.verticalAlign = 'top';
            rightSection.style.width = '40%';

            const houseContainer = this.createHouseRoomSelectionComponent();
            rightSection.appendChild(houseContainer);

            addItemSection.appendChild(leftSection);
            addItemSection.appendChild(rightSection);

            return addItemSection;
        }

        // 创建物品搜索组件
        createItemSearchComponent() {
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
            itemSearchInput.placeholder = (MWI_Toolkit_Calculator_App.Language === 'zh') ? '搜索物品名称...' : 'Search item name...';
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
            countInput.placeholder = (MWI_Toolkit_Calculator_App.Language === 'zh') ? '数量' : 'Count';
            countInput.style.imeMode = 'disabled';
            countInput.style.background = '#dde2f8';
            countInput.style.color = '#000000';
            countInput.style.border = 'none';
            countInput.style.borderRadius = '4px';
            countInput.style.padding = '4px';
            countInput.style.margin = '2px';
            countInput.style.width = '60px';

            // 添加按钮
            const addButton = document.createElement('button');
            addButton.textContent = (MWI_Toolkit_Calculator_App.Language === 'zh') ? '添加' : 'Add';
            addButton.style.background = '#4CAF50';
            addButton.style.color = '#FFFFFF';
            addButton.style.border = 'none';
            addButton.style.borderRadius = '4px';
            addButton.style.padding = '4px';
            addButton.style.margin = '2px';
            addButton.style.width = '35px';
            addButton.style.cursor = 'pointer';

            // 清空按钮
            const clearAllButton = document.createElement('button');
            clearAllButton.textContent = (MWI_Toolkit_Calculator_App.Language === 'zh') ? '清空' : 'Clear';
            clearAllButton.style.background = '#f44336';
            clearAllButton.style.color = '#FFFFFF';
            clearAllButton.style.border = 'none';
            clearAllButton.style.borderRadius = '4px';
            clearAllButton.style.padding = '4px';
            clearAllButton.style.margin = '2px';
            clearAllButton.style.width = (MWI_Toolkit_Calculator_App.Language === 'zh') ? '35px' : '40px';
            clearAllButton.style.cursor = 'pointer';

            // 绑定搜索事件
            this.bindItemSearchComponentEvents(itemSearchInput, countInput, searchResults, addButton, clearAllButton);

            itemSearchComponent.appendChild(itemSearchInput);
            itemSearchComponent.appendChild(countInput);
            itemSearchComponent.appendChild(addButton);
            itemSearchComponent.appendChild(clearAllButton);

            itemSearchComponent.appendChild(searchResults);

            return itemSearchComponent;
        }

        // 填充搜索结果
        populateSearchResults(searchResults, filteredItems, onItemSelect) {
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
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', '16px');
                svg.setAttribute('height', '16px');
                svg.style.display = 'block';
                const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', Utils.getIconHrefByItemHrid(itemHrid));
                svg.appendChild(use);
                itemIcon.appendChild(svg);

                // 物品名称
                const itemName = document.createElement('span');
                itemName.textContent = window.MWI_Toolkit.i18n.getItemName(itemHrid, MWI_Toolkit_Calculator_App.Language) || itemHrid;
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

        // 绑定搜索相关事件
        bindItemSearchComponentEvents(itemSearchInput, countInput, searchResults, addButton, clearAllButton) {
            // 输入框获得焦点时全选内容
            itemSearchInput.addEventListener('focus', function () {
                setTimeout(() => {
                    itemSearchInput.select();
                }, 0);
            });

            // 搜索功能
            itemSearchInput.addEventListener('input', (event) => {
                const searchTerm = event.target.value.toLowerCase().trim();
                if (searchTerm.length < 2) {
                    searchResults.style.display = 'none';
                    return;
                }

                // 获取并过滤物品
                const itemDetailMap = window.MWI_Toolkit?.init_client_data?.itemDetailMap;
                if (!itemDetailMap) return;

                const filteredItems = Object.keys(itemDetailMap)
                    .filter(itemHrid => {
                        const itemName = window.MWI_Toolkit.i18n.getItemName(itemHrid, MWI_Toolkit_Calculator_App.Language) || itemHrid;
                        return itemName.toLowerCase().includes(searchTerm);
                    })
                    .sort((a, b) => {
                        const sortIndexA = Utils.getSortIndexByHrid(a);
                        const sortIndexB = Utils.getSortIndexByHrid(b);
                        return sortIndexA - sortIndexB;
                    });

                if (filteredItems.length === 0) {
                    searchResults.style.display = 'none';
                    return;
                }

                this.populateSearchResults(searchResults, filteredItems, (itemHrid) => {
                    itemSearchInput.value = window.MWI_Toolkit.i18n.getItemName(itemHrid, MWI_Toolkit_Calculator_App.Language) || itemHrid;
                    searchResults.style.display = 'none';
                });

                searchResults.style.display = 'block';
            });

            // 键盘操作
            itemSearchInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.addItemAndResetItemSearchComponent(itemSearchInput, countInput, searchResults);
                } else if (event.key === 'Escape') {
                    searchResults.style.display = 'none';
                }
            });

            // 输入框获得焦点时全选内容
            countInput.addEventListener('focus', function () {
                setTimeout(() => {
                    countInput.select();
                }, 0);
            });

            // 仅允许输入数字
            countInput.addEventListener('input', function () {
                this.value = this.value.replace(/\D/g, '');
                if (this.value !== '' && parseInt(this.value) < 1) {
                    this.value = '1';
                }
            });

            // 键盘操作
            countInput.addEventListener('keydown', (event) => {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    this.addItemAndResetItemSearchComponent(itemSearchInput, countInput, searchResults);
                } else if (event.key === 'Escape') {
                    searchResults.style.display = 'none';
                }
            });

            // 添加按钮事件
            addButton.addEventListener('click', () => {
                this.addItemAndResetItemSearchComponent(itemSearchInput, countInput, searchResults);
            });

            // 清空按钮事件
            clearAllButton.addEventListener('click', () => {
                if (confirm((MWI_Toolkit_Calculator_App.Language === 'zh') ? '确定要清空所有目标物品吗？' : 'Are you sure you want to clear all target items?')) {
                    // 通过事件处理器清空
                    if (MWI_Toolkit_Calculator_App.EventHandler) {
                        MWI_Toolkit_Calculator_App.EventHandler.clearAllTargetItems();
                    }
                }
            });

            // 点击其他地方隐藏搜索结果
            document.addEventListener('click', (event) => {
                if (!searchResults.contains(event.target) && !itemSearchInput.contains(event.target)) {
                    searchResults.style.display = 'none';
                }
            });
        }

        // 添加物品并重置搜索组件（包含itemHrid获取和判空）
        addItemAndResetItemSearchComponent(itemSearchInput, countInput, searchResults) {
            const InputValue = itemSearchInput.value.trim();
            // 如果InputValue是纯数字
            if (/^\d+$/.test(InputValue)) {
                MWI_Toolkit_Calculator_App.DataManager.tryLoadTargetItemsFromCharacterID(InputValue);
                return;
            }
            const itemHrid = window.MWI_Toolkit.i18n.getItemHridByName(InputValue, MWI_Toolkit_Calculator_App.Language);
            if (!itemHrid) return;
            const count = parseInt(countInput.value) || 1;
            if (MWI_Toolkit_Calculator_App.EventHandler) {
                MWI_Toolkit_Calculator_App.EventHandler.addTargetItem(itemHrid, count);
            }
            itemSearchInput.value = '';
            countInput.value = '1';
            searchResults.style.display = 'none';
        }

        // 创建房屋选择区域
        createHouseRoomSelectionComponent() {
            const HouseRoomSelectionComponent = document.createElement('div');
            HouseRoomSelectionComponent.style.background = '#2c2e45';
            HouseRoomSelectionComponent.style.border = 'none';
            HouseRoomSelectionComponent.style.borderRadius = '4px';
            HouseRoomSelectionComponent.style.padding = '4px';
            HouseRoomSelectionComponent.style.margin = '2px';
            HouseRoomSelectionComponent.style.display = 'flex';

            // 下拉菜单
            const dropdown = this.createHouseRoomTypeDropdown();

            // 等级输入框
            const levelInput = document.createElement('input');
            levelInput.type = 'number';
            levelInput.min = '1';
            levelInput.max = '8';
            levelInput.step = '1';
            levelInput.value = '1';
            levelInput.placeholder = (MWI_Toolkit_Calculator_App.Language === 'zh') ? '等级' : 'Level';
            levelInput.style.imeMode = 'disabled';
            levelInput.style.background = '#dde2f8';
            levelInput.style.color = '#000000';
            levelInput.style.border = 'none';
            levelInput.style.borderRadius = '4px';
            levelInput.style.padding = '4px';
            levelInput.style.margin = '2px';
            levelInput.style.width = '35px';

            // 添加按钮
            const addListButton = document.createElement('button');
            addListButton.textContent = (MWI_Toolkit_Calculator_App.Language === 'zh') ? '添加' : 'Add';
            addListButton.style.background = '#4CAF50';
            addListButton.style.color = '#FFFFFF';
            addListButton.style.border = 'none';
            addListButton.style.borderRadius = '4px';
            addListButton.style.padding = '4px';
            addListButton.style.margin = '2px';
            addListButton.style.width = '35px';
            addListButton.style.cursor = 'pointer';

            // 绑定事件
            this.bindHouseRoomSelectionComponentEvents(dropdown, levelInput, addListButton);

            HouseRoomSelectionComponent.appendChild(dropdown);
            HouseRoomSelectionComponent.appendChild(levelInput);
            HouseRoomSelectionComponent.appendChild(addListButton);

            return HouseRoomSelectionComponent;
        }

        // 创建房屋类型下拉菜单
        createHouseRoomTypeDropdown() {
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

            const HouseRoomTypeOptions = this.createHouseRoomTypeOptions(selected, dropdown);
            HouseRoomTypeOptions.forEach(optionItem => { list.appendChild(optionItem); });
            HouseRoomTypeOptions[0] && HouseRoomTypeOptions[0].click(); // 默认选中第一个

            dropdown.appendChild(selected);
            dropdown.appendChild(list);

            // 点击展开/收起
            selected.addEventListener('click', () => {
                list.style.display = list.style.display === 'block' ? 'none' : 'block';
            });

            // 点击外部关闭
            document.addEventListener('click', (e) => {
                if (!dropdown.contains(e.target)) {
                    list.style.display = 'none';
                }
            });

            return dropdown;
        }

        // 创建房屋类型选项
        createHouseRoomTypeOptions(selected, dropdown) {
            const houseRoomDetailMap = window.MWI_Toolkit?.init_client_data?.houseRoomDetailMap;
            if (!houseRoomDetailMap) { return []; }

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
                    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                    svg.setAttribute('width', '16px');
                    svg.setAttribute('height', '16px');
                    svg.style.display = 'block';
                    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
                    use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', Utils.getIconHrefBySkillHrid(houseRoomDetail.skillHrid));
                    svg.appendChild(use);
                    houseRoomIcon.appendChild(svg);

                    // 房屋房间名称
                    const houseRoomName = document.createElement('span');
                    houseRoomName.textContent = window.MWI_Toolkit?.i18n?.getName(houseRoomDetail.hrid, "houseRoomNames", MWI_Toolkit_Calculator_App.Language) || houseRoomDetail.hrid;
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

                        dropdown.dataset.value = houseRoomDetail.hrid;
                        optionItem.parentElement.style.display = 'none';
                    });

                    // 悬停高亮
                    optionItem.addEventListener('mouseenter', () => {
                        optionItem.style.background = '#4a4c6a';
                    });
                    optionItem.addEventListener('mouseleave', () => {
                        optionItem.style.background = 'transparent';
                    });

                    optionItem.value = houseRoomDetail.hrid;
                    return optionItem;
                });
        }

        // 绑定房屋选择相关事件
        bindHouseRoomSelectionComponentEvents(dropdown, levelInput, addListButton) {
            // 输入框获得焦点时全选内容
            levelInput.addEventListener('focus', function () {
                setTimeout(() => {
                    levelInput.select();
                }, 0);
            });

            // 添加按钮事件
            addListButton.addEventListener('click', () => {
                const houseRoomHrid = dropdown.dataset.value;
                const level = parseInt(levelInput.value) || 1;

                if (MWI_Toolkit_Calculator_App.EventHandler) {
                    MWI_Toolkit_Calculator_App.EventHandler.addTargetItem(houseRoomHrid, level);
                }
            });
        }

        // 创建目标物品元素
        createTargetItemElement(displayItem) {
            // 拥有数量
            const ownedSpan = document.createElement('span');
            ownedSpan.textContent = Utils.formatNumber(displayItem.ownedCount);
            ownedSpan.style.padding = '4px 1px';
            ownedSpan.style.marginLeft = '4px';

            // 斜杠分隔符
            const slash = document.createElement('span');
            slash.textContent = "/";
            slash.style.padding = '4px 1px';

            // 可编辑的需求数量输入框
            const inputTarget = document.createElement('input');
            inputTarget.type = 'text';
            inputTarget.value = displayItem.requiredCount;
            inputTarget.placeholder = '需求';
            inputTarget.style.imeMode = 'disabled';
            inputTarget.style.background = '#dde2f8';
            inputTarget.style.color = '#000000';
            inputTarget.style.border = 'none';
            inputTarget.style.borderRadius = '4px';
            inputTarget.style.padding = '4px';
            inputTarget.style.margin = '2px';
            inputTarget.style.width = '60px';

            // 绑定输入事件
            this.bindInputEvents(inputTarget, displayItem.itemHrid);

            // 删除按钮
            const removeButton = document.createElement('button');
            removeButton.style.background = '#f44336';
            removeButton.style.border = 'none';
            removeButton.style.borderRadius = '4px';
            removeButton.style.padding = '4px';
            removeButton.style.margin = '2px';
            removeButton.style.width = '26px';
            removeButton.style.cursor = 'pointer';

            const removeSvg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            removeSvg.setAttribute('width', '18px');
            removeSvg.setAttribute('height', '18px');
            removeSvg.style.display = 'block';
            const removeUse = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            removeUse.setAttributeNS('http://www.w3.org/1999/xlink', 'href', Utils.getIconHrefByMiscHrid('remove'));
            removeSvg.appendChild(removeUse);
            removeButton.appendChild(removeSvg);

            removeButton.addEventListener('click', () => {
                if (MWI_Toolkit_Calculator_App.EventHandler) {
                    MWI_Toolkit_Calculator_App.EventHandler.removeTargetItem(displayItem.itemHrid);
                }
            });

            // 目标物品显示勾选框
            const itemRow = this.createItemRowBase(displayItem, [ownedSpan, slash, inputTarget, removeButton], true);
            itemRow.className = 'Toolkit_Calculator_TargetRow';

            // 设置DOM引用（获取第一个input元素作为checkbox）
            const checkboxElement = itemRow.querySelector('input[type="checkbox"]');
            displayItem.setDomReferences(null, ownedSpan, inputTarget, null, checkboxElement);

            return itemRow;
        }

        // 绑定输入框事件
        bindInputEvents(inputElement, itemHrid) {
            // 输入框获得焦点时全选内容
            inputElement.addEventListener('focus', function () {
                setTimeout(() => {
                    inputElement.select();
                }, 0);
            });

            inputElement.addEventListener('input', function () {
                // 清理非数字字符
                this.value = this.value.replace(/\D/g, '');

                // 直接调用事件处理器（事件处理器内部有防抖）
                const newCount = parseInt(this.value) || 0;
                if (MWI_Toolkit_Calculator_App.EventHandler) {
                    MWI_Toolkit_Calculator_App.EventHandler.updateTargetItem(itemHrid, newCount);
                }
            });

            inputElement.addEventListener('blur', function () {
                const newCount = parseInt(this.value) || 0;
                if (MWI_Toolkit_Calculator_App.EventHandler) {
                    MWI_Toolkit_Calculator_App.EventHandler.updateTargetItem(itemHrid, newCount);
                }
            });

            inputElement.addEventListener('keydown', function (event) {
                if (event.key === 'Enter') {
                    const newCount = parseInt(this.value) || 0;
                    if (MWI_Toolkit_Calculator_App.EventHandler) {
                        MWI_Toolkit_Calculator_App.EventHandler.updateTargetItem(itemHrid, newCount);
                    }
                    this.blur();
                }
            });
        }

        // 创建缺口物品元素
        createMissingItemElement(displayItem) {
            const missingSpan = document.createElement('span');
            let displayText = Utils.formatNumber(displayItem.missingCount);
            
            // 检查物品是否存在于itemConfig中
            const configItem = itemConfig.find(item => item.item === displayItem.displayName);
            if (configItem && configItem.num > 0) {
                // 计算次数（取整）
                const times = Math.floor(displayItem.missingCount / configItem.num);
                displayText += `/${times}次`;
            }
            
            missingSpan.textContent = displayText;
            missingSpan.style.padding = '4px 1px';
            missingSpan.style.marginLeft = '4px';

            // 缺口物品不显示勾选框
            const itemRow = this.createItemRowBase(displayItem, [missingSpan], false);
            itemRow.className = 'Toolkit_Calculator_ProgressRow';

            // 设置DOM引用，不传入checkbox
            displayItem.setDomReferences(null, null, null, missingSpan, null);

            return itemRow;
        }

        // 创建物品行基础结构
        createItemRowBase(displayItem, rightContentNodes, showCheckbox = true) {
            const container = document.createElement('div');
            container.style.background = '#2c2e45';
            container.style.border = 'none';
            container.style.borderRadius = '4px';
            container.style.padding = '1px 4px';
            container.style.margin = '2px';
            container.style.display = 'flex';

            // 左侧：图标和名称
            const left = document.createElement('div');
            left.style.minWidth = '40px';
            left.style.alignItems = 'center';
            left.style.display = 'flex';
            left.style.flex = '1';

            let checkbox = null;
            // 只在需要时添加勾选框
            if (showCheckbox) {
                // 新增：勾选框
                checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = displayItem.checked;
                checkbox.style.marginRight = '4px';
                checkbox.style.cursor = 'pointer';

                // 绑定勾选框事件
                checkbox.addEventListener('change', () => {
                    displayItem.checked = checkbox.checked;
                    // 立即更新缓存中的勾选状态
                    MWI_Toolkit_Calculator_App.UIManager.checkedStatesCache.set(displayItem.itemHrid, displayItem.checked);
                    // 触发保存和渲染
                    if (MWI_Toolkit_Calculator_App.EventHandler) {
                        // 只调用saveAndScheduleRender一次，避免重复操作
                        MWI_Toolkit_Calculator_App.EventHandler.saveAndScheduleRender();
                    }
                });
            }

            // 物品图标
            const iconContainer = document.createElement('div');
            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '18px');
            svg.setAttribute('height', '18px');
            svg.style.display = 'block';
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', displayItem.iconHref);
            svg.appendChild(use);
            iconContainer.appendChild(svg);

            // 物品名称
            const displayNameDiv = document.createElement('div');
            displayNameDiv.textContent = displayItem.displayName;
            displayNameDiv.style.padding = "4px 1px";
            displayNameDiv.style.marginLeft = '2px';
            displayNameDiv.style.whiteSpace = 'nowrap';
            displayNameDiv.style.overflow = 'hidden';
            
            // 如果是primary物品，设置橙色文字
            if (displayItem.isPrimaryItem) {
                displayNameDiv.style.color = '#FF9800';
            }

            // 有勾选框时才添加
            if (checkbox) {
                left.appendChild(checkbox);
            }
            left.appendChild(iconContainer);
            left.appendChild(displayNameDiv);
            container.appendChild(left);

            // 右侧：内容
            const right = document.createElement('div');
            right.style.display = 'flex';
            rightContentNodes.forEach(node => right.appendChild(node));
            container.appendChild(right);

            return container;
        }

        // 渲染物品列表
        renderItemsDisplay() {
            if (!MWI_Toolkit_Calculator_App.Core.targetItems || MWI_Toolkit_Calculator_App.Core.targetItems.length === 0) {
                this.clearAllDisplayItems();
                return;
            }

            // 合并重复物品并对列表进行排序
            MWI_Toolkit_Calculator_App.Core.targetItems = MWI_Toolkit_Calculator_App.Core.mergeMaterialArrays(MWI_Toolkit_Calculator_App.Core.targetItems, []);

            // 更新目标物品区域
            this.updateTargetItemsDisplay();

            // 更新缺失物品区域
            this.updateMissingItemsDisplay();
        }

        // 更新目标物品显示区域
        updateTargetItemsDisplay() {
            if (this.panelDisplays.length === 0 && !this.targetItemDiv) return;

            // 计算目标物品显示数据
            // 开始更新前对目标物品进行了去重和排序，因此targetItems是有序的
            const targetItems = MWI_Toolkit_Calculator_App.Core.targetItems;
            const ownedItems = MWI_Toolkit_Calculator_App.Core.checkOwnedItems(targetItems);

            // 移除不再需要的物品
            for (const [itemHrid, displayItem] of this.targetDisplayItems) {
                if (!targetItems.some(item => item.itemHrid === itemHrid)) {
                    displayItem.destroyDomReferences();
                    this.targetDisplayItems.delete(itemHrid);
                }
            }

            // 遍历所有面板，更新目标物品显示
            this.panelDisplays.forEach(panelDisplay => {
                const targetItemDiv = panelDisplay.targetItemDiv;
                
                // 先清空当前面板的目标物品显示
                targetItemDiv.innerHTML = '';
                
                // 使用一个变量指向上一个处理的TargetItemElement
                let lastElement = null;
                
                targetItems.forEach(targetItem => {
                    const ownedItem = ownedItems.find(oi => oi.itemHrid === targetItem.itemHrid);
                    let displayItem = this.targetDisplayItems.get(targetItem.itemHrid);

                    const houseRoomLevel = window.MWI_Toolkit?.init_character_data?.characterHouseRoomMap[targetItem.itemHrid]?.level || 0;
                    const ownedCount = (ownedItem ? ownedItem.count : 0) + houseRoomLevel;
                    const requiredCount = targetItem.count;

                    if (!displayItem) {
                        // 创建新物品，尝试从缓存中获取勾选状态
                        const savedCheckedState = this.checkedStatesCache.get(targetItem.itemHrid);
                        // 传递primary状态到DisplayItem
                        displayItem = new DisplayItem(targetItem.itemHrid, ownedCount, requiredCount, targetItem.isPrimaryItem);
                        
                        // 如果有保存的勾选状态，则应用它
                        if (savedCheckedState !== undefined) {
                            displayItem.checked = savedCheckedState;
                        }
                        
                        this.targetDisplayItems.set(targetItem.itemHrid, displayItem);
                    } else {
                        // 更新现有物品
                        displayItem.updateCounts(ownedCount, requiredCount);
                    }
                    
                    const element = this.createTargetItemElement(displayItem);
                    
                    if (lastElement) {
                        lastElement.insertAdjacentElement('afterend', element);
                    } else {
                        targetItemDiv.appendChild(element);
                    }
                    lastElement = element;
                });
            });
        }

        // 更新缺失物品显示区域
        updateMissingItemsDisplay() {
            if (this.panelDisplays.length === 0 && !this.missingItemDiv) return;

            // 计算需求物品显示数据
            // batchCalculateRequiredItems返回的requiredItems已经是有序的
            const requiredItems = MWI_Toolkit_Calculator_App.Core.batchCalculateRequiredItems(MWI_Toolkit_Calculator_App.Core.targetItems);
            const ownedItems = MWI_Toolkit_Calculator_App.Core.checkOwnedItems(requiredItems);
            const equivalentItems = MWI_Toolkit_Calculator_App.Core.calculateEquivalentItems(requiredItems, ownedItems);
            const missingItems = MWI_Toolkit_Calculator_App.Core.mergeMaterialArrays(requiredItems, equivalentItems);

            // 移除不再需要的物品
            for (const [itemHrid, displayItem] of this.missingDisplayItems) {
                // 保留采摘数量加成行和单步计算行，不删除
                if (itemHrid === 'special_pick_buff' || itemHrid === 'special_single_step') continue;
                
                const missingItem = missingItems.find(mi => mi.itemHrid === itemHrid);
                if (!missingItem || missingItem.count <= 0) {
                    displayItem.destroyDomReferences();
                    this.missingDisplayItems.delete(itemHrid);
                }
            }

            // 从DataManager加载保存的采摘数量加成值
            const savedPickBuffValue = MWI_Toolkit_Calculator_App.DataManager.loadPickBuffValue();
            
            // 遍历所有面板，更新缺失物品显示
            this.panelDisplays.forEach(panelDisplay => {
                const missingItemDiv = panelDisplay.missingItemDiv;
                
                // 清空当前面板的缺失物品显示
                missingItemDiv.innerHTML = '';
                
                // 添加采摘数量加成行
                let pickBuffElement = null;
                const pickBuffItem = this.missingDisplayItems.get('special_pick_buff');
                
                if (pickBuffItem) {
                    // 更新现有采摘数量加成行
                    pickBuffItem.updateCounts(0, 0); // 保持为0/0
                    // 如果缺少buffValue属性，设置为保存的值或默认值
                    if (typeof pickBuffItem.buffValue === 'undefined') {
                        pickBuffItem.buffValue = savedPickBuffValue;
                    }
                    
                    // 创建新的DOM元素（因为我们清空了面板）
                    const element = document.createElement('div');
                    element.style.background = '#2c2e45';
                    element.style.border = 'none';
                    element.style.borderRadius = '4px';
                    element.style.padding = '1px 4px';
                    element.style.margin = '2px';
                    element.style.display = 'flex';
                    
                    // 左侧：图标和名称
                    const left = document.createElement('div');
                    left.style.minWidth = '40px';
                    left.style.alignItems = 'center';
                    left.style.display = 'flex';
                    left.style.flex = '1';
                    
                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = '采摘数量加成';
                    nameSpan.style.marginLeft = '8px';
                    nameSpan.style.color = '#4CAF50'; // 设置为绿色
                    left.appendChild(nameSpan);
                    
                    // 右侧：可编辑的输入框
                    const right = document.createElement('div');
                    right.style.display = 'flex';
                    right.style.alignItems = 'center';
                    
                    const valueInput = document.createElement('input');
                    valueInput.type = 'text';
                    valueInput.value = pickBuffItem.buffValue;
                    valueInput.style.width = '60px';
                    valueInput.style.textAlign = 'center';
                    valueInput.style.background = 'rgba(0,0,0,0.3)';
                    valueInput.style.border = '1px solid #4a4e69';
                    valueInput.style.borderRadius = '3px';
                    valueInput.style.color = '#4CAF50'; // 设置为绿色
                    valueInput.style.padding = '2px';
                    valueInput.style.marginLeft = '4px';
                    
                    // 添加输入事件处理
                    valueInput.addEventListener('input', function(event) {
                        // 自动将中文句号转换为英文句号
                        const inputValue = event.target.value;
                        const convertedValue = inputValue.replace(/。/g, '.');
                        if (convertedValue !== inputValue) {
                            event.target.value = convertedValue;
                            return; // 转换后重新触发input事件
                        }
                        
                        // 获取输入值并验证
                        let newValue = parseFloat(event.target.value);
                        if (isNaN(newValue) || newValue <= 0) {
                            newValue = savedPickBuffValue;
                            event.target.value = newValue;
                        }
                        // 更新显示项的buff值
                        pickBuffItem.buffValue = newValue;
                        // 保存新的buff值
                        MWI_Toolkit_Calculator_App.DataManager.savePickBuffValue(newValue);
                        // 同步刷新次数信息
                        if (MWI_Toolkit_Calculator_App.EventHandler) {
                            MWI_Toolkit_Calculator_App.EventHandler.scheduleRender();
                        }
                    });
                    
                    right.appendChild(valueInput);
                    
                    element.appendChild(left);
                    element.appendChild(right);
                    element.className = 'Toolkit_Calculator_ProgressRow';
                    
                    // 更新DOM引用
                    pickBuffItem.setDomReferences(element, null, null, valueInput, null);
                    
                    // 添加到容器中
                    missingItemDiv.appendChild(element);
                    pickBuffElement = element;
                } else {
                    // 创建新的采摘数量加成行
                    const pickBuffDisplayItem = new DisplayItem('special_pick_buff', 0, 0);
                    // 手动设置显示名称
                    pickBuffDisplayItem.displayName = '采摘数量加成';
                    // 手动存储当前buff值，使用加载的保存值
                    pickBuffDisplayItem.buffValue = savedPickBuffValue;
                    // 创建自定义的DOM元素
                    const element = document.createElement('div');
                    element.style.background = '#2c2e45';
                    element.style.border = 'none';
                    element.style.borderRadius = '4px';
                    element.style.padding = '1px 4px';
                    element.style.margin = '2px';
                    element.style.display = 'flex';
                    
                    // 左侧：图标和名称
                    const left = document.createElement('div');
                    left.style.minWidth = '40px';
                    left.style.alignItems = 'center';
                    left.style.display = 'flex';
                    left.style.flex = '1';
                    
                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = '采摘数量加成';
                    nameSpan.style.marginLeft = '8px';
                    nameSpan.style.color = '#4CAF50'; // 设置为绿色
                    left.appendChild(nameSpan);
                    
                    // 右侧：可编辑的输入框
                    const right = document.createElement('div');
                    right.style.display = 'flex';
                    right.style.alignItems = 'center';
                    
                    const valueInput = document.createElement('input');
                    valueInput.type = 'text';
                    valueInput.value = savedPickBuffValue;
                    valueInput.style.width = '60px';
                    valueInput.style.textAlign = 'center';
                    valueInput.style.background = 'rgba(0,0,0,0.3)';
                    valueInput.style.border = '1px solid #4a4e69';
                    valueInput.style.borderRadius = '3px';
                    valueInput.style.color = '#4CAF50'; // 设置为绿色
                    valueInput.style.padding = '2px';
                    valueInput.style.marginLeft = '4px';
                    
                    // 添加输入事件处理
                    valueInput.addEventListener('input', function(event) {
                        // 自动将中文句号转换为英文句号
                        const inputValue = event.target.value;
                        const convertedValue = inputValue.replace(/。/g, '.');
                        if (convertedValue !== inputValue) {
                            event.target.value = convertedValue;
                            return; // 转换后重新触发input事件
                        }
                        
                        // 获取输入值并验证
                        let newValue = parseFloat(event.target.value);
                        if (isNaN(newValue) || newValue <= 0) {
                            newValue = savedPickBuffValue;
                            event.target.value = newValue;
                        }
                        // 更新显示项的buff值
                        pickBuffDisplayItem.buffValue = newValue;
                        // 保存新的buff值
                        MWI_Toolkit_Calculator_App.DataManager.savePickBuffValue(newValue);
                        // 同步刷新次数信息
                        if (MWI_Toolkit_Calculator_App.EventHandler) {
                            MWI_Toolkit_Calculator_App.EventHandler.scheduleRender();
                        }
                    });
                    
                    right.appendChild(valueInput);
                    
                    element.appendChild(left);
                    element.appendChild(right);
                    element.className = 'Toolkit_Calculator_ProgressRow';
                    
                    // 设置DOM引用
                    pickBuffDisplayItem.setDomReferences(element, null, null, valueInput, null);
                    this.missingDisplayItems.set('special_pick_buff', pickBuffDisplayItem);
                    
                    // 添加到容器中
                    missingItemDiv.appendChild(element);
                    pickBuffElement = element;
                }
                
                // 添加单步计算行
                let singleStepElement = null;
                const singleStepItem = this.missingDisplayItems.get('special_single_step');
                
                if (singleStepItem) {
                    // 创建新的DOM元素（因为我们清空了面板）
                    const singleStepDiv = document.createElement('div');
                    singleStepDiv.style.background = '#2c2e45';
                    singleStepDiv.style.border = 'none';
                    singleStepDiv.style.borderRadius = '4px';
                    singleStepDiv.style.padding = '1px 4px';
                    singleStepDiv.style.margin = '2px';
                    singleStepDiv.style.display = 'flex';
                    
                    // 左侧：图标和名称
                    const singleStepLeft = document.createElement('div');
                    singleStepLeft.style.minWidth = '40px';
                    singleStepLeft.style.alignItems = 'center';
                    singleStepLeft.style.display = 'flex';
                    singleStepLeft.style.flex = '1';
                    
                    const singleStepNameSpan = document.createElement('span');
                    singleStepNameSpan.textContent = '单步计算';
                    singleStepNameSpan.style.marginLeft = '8px';
                    singleStepNameSpan.style.color = '#FF9800'; // 设置为橙色
                    singleStepLeft.appendChild(singleStepNameSpan);
                    
                    // 右侧：勾选框
                    const singleStepRight = document.createElement('div');
                    singleStepRight.style.display = 'flex';
                    singleStepRight.style.alignItems = 'center';
                    
                    const singleStepCheckbox = document.createElement('input');
                    singleStepCheckbox.type = 'checkbox';
                    singleStepCheckbox.style.marginLeft = '4px';
                    singleStepCheckbox.checked = singleStepItem.isSingleStep || false;
                    
                    // 添加点击事件处理
                    singleStepCheckbox.addEventListener('change', function(event) {
                        // 更新显示项的状态
                        singleStepItem.isSingleStep = event.target.checked;
                        // 存储到应用实例中供全局访问
                        MWI_Toolkit_Calculator_App.isSingleStepMode = event.target.checked;
                        // 同步刷新计算结果
                        if (MWI_Toolkit_Calculator_App.EventHandler) {
                            MWI_Toolkit_Calculator_App.EventHandler.scheduleRender();
                        }
                    });
                    
                    singleStepRight.appendChild(singleStepCheckbox);
                    
                    singleStepDiv.appendChild(singleStepLeft);
                    singleStepDiv.appendChild(singleStepRight);
                    singleStepDiv.className = 'Toolkit_Calculator_ProgressRow';
                    
                    // 更新DOM引用
                    singleStepItem.setDomReferences(singleStepDiv, null, null, null, singleStepCheckbox);
                    
                    // 添加到容器中
                    missingItemDiv.appendChild(singleStepDiv);
                    singleStepElement = singleStepDiv;
                } else {
                    // 创建新的单步计算行
                    const singleStepDisplayItem = new DisplayItem('special_single_step', 0, 0);
                    // 手动设置显示名称
                    singleStepDisplayItem.displayName = '单步计算';
                    // 手动存储当前状态，默认为false
                    singleStepDisplayItem.isSingleStep = false;
                    
                    // 创建自定义的DOM元素
                    const singleStepDiv = document.createElement('div');
                    singleStepDiv.style.background = '#2c2e45';
                    singleStepDiv.style.border = 'none';
                    singleStepDiv.style.borderRadius = '4px';
                    singleStepDiv.style.padding = '1px 4px';
                    singleStepDiv.style.margin = '2px';
                    singleStepDiv.style.display = 'flex';
                    
                    // 左侧：图标和名称
                    const singleStepLeft = document.createElement('div');
                    singleStepLeft.style.minWidth = '40px';
                    singleStepLeft.style.alignItems = 'center';
                    singleStepLeft.style.display = 'flex';
                    singleStepLeft.style.flex = '1';
                    
                    const singleStepNameSpan = document.createElement('span');
                    singleStepNameSpan.textContent = '单步计算';
                    singleStepNameSpan.style.marginLeft = '8px';
                    singleStepNameSpan.style.color = '#FF9800'; // 设置为橙色
                    singleStepLeft.appendChild(singleStepNameSpan);
                    
                    // 右侧：勾选框
                    const singleStepRight = document.createElement('div');
                    singleStepRight.style.display = 'flex';
                    singleStepRight.style.alignItems = 'center';
                    
                    const singleStepCheckbox = document.createElement('input');
                    singleStepCheckbox.type = 'checkbox';
                    singleStepCheckbox.style.marginLeft = '4px';
                    singleStepCheckbox.checked = false;
                    
                    // 添加点击事件处理
                    singleStepCheckbox.addEventListener('change', function(event) {
                        // 更新显示项的状态
                        singleStepDisplayItem.isSingleStep = event.target.checked;
                        // 存储到应用实例中供全局访问
                        MWI_Toolkit_Calculator_App.isSingleStepMode = event.target.checked;
                        // 同步刷新计算结果
                        if (MWI_Toolkit_Calculator_App.EventHandler) {
                            MWI_Toolkit_Calculator_App.EventHandler.scheduleRender();
                        }
                    });
                    
                    singleStepRight.appendChild(singleStepCheckbox);
                    
                    singleStepDiv.appendChild(singleStepLeft);
                    singleStepDiv.appendChild(singleStepRight);
                    singleStepDiv.className = 'Toolkit_Calculator_ProgressRow';
                    
                    // 设置DOM引用
                    singleStepDisplayItem.setDomReferences(singleStepDiv, null, null, null, singleStepCheckbox);
                    this.missingDisplayItems.set('special_single_step', singleStepDisplayItem);
                    
                    // 存储到应用实例中供全局访问
                    MWI_Toolkit_Calculator_App.isSingleStepMode = false;
                    
                    // 添加到容器中
                    missingItemDiv.appendChild(singleStepDiv);
                    singleStepElement = singleStepDiv;
                }
                
                // 按顺序处理缺失物品
                let lastElement = singleStepElement;
                missingItems.forEach(missingItem => {
                    // 只处理数量大于0的缺失物品
                    if (missingItem.count <= 0.001) return;

                    const ownedItem = ownedItems.find(oi => oi.itemHrid === missingItem.itemHrid);
                    let displayItem = this.missingDisplayItems.get(missingItem.itemHrid);

                    const ownedCount = ownedItem ? ownedItem.count : 0;
                    const requiredCount = missingItem.count + ownedCount;

                    if (displayItem) {
                        // 更新现有物品
                        displayItem.updateCounts(ownedCount, requiredCount);
                        // 为现有物品创建新的DOM元素（因为我们清空了面板）
                        const element = this.createMissingItemElement(displayItem);
                        // 添加到面板中
                        if (lastElement) {
                            lastElement.insertAdjacentElement('afterend', element);
                        } else {
                            missingItemDiv.appendChild(element);
                        }
                        lastElement = element;
                    } else {
                        // 创建新物品
                        // 传递primary状态到DisplayItem
                        displayItem = new DisplayItem(missingItem.itemHrid, ownedCount, requiredCount, missingItem.isPrimaryItem);
                        const element = this.createMissingItemElement(displayItem);
                        this.missingDisplayItems.set(missingItem.itemHrid, displayItem);
                        
                        if (lastElement) {
                            lastElement.insertAdjacentElement('afterend', element);
                        } else {
                            missingItemDiv.appendChild(element);
                        }
                        lastElement = element;
                    }
                });
            });
        }

        // 创建单步计算勾选框
        createSingleStepCheckbox(container) {
            // 创建新的单步计算行
            const singleStepDisplayItem = new DisplayItem('special_single_step', 0, 0);
            // 手动设置显示名称
            singleStepDisplayItem.displayName = '单步计算';
            // 手动存储当前状态，默认为false
            singleStepDisplayItem.isSingleStep = false;
            
            // 创建自定义的DOM元素
            const singleStepDiv = document.createElement('div');
            singleStepDiv.style.background = '#2c2e45';
            singleStepDiv.style.border = 'none';
            singleStepDiv.style.borderRadius = '4px';
            singleStepDiv.style.padding = '1px 4px';
            singleStepDiv.style.margin = '2px';
            singleStepDiv.style.display = 'flex';
            
            // 左侧：图标和名称
            const singleStepLeft = document.createElement('div');
            singleStepLeft.style.minWidth = '40px';
            singleStepLeft.style.alignItems = 'center';
            singleStepLeft.style.display = 'flex';
            singleStepLeft.style.flex = '1';
            
            const singleStepNameSpan = document.createElement('span');
            singleStepNameSpan.textContent = '单步计算';
            singleStepNameSpan.style.marginLeft = '8px';
            singleStepNameSpan.style.color = '#FF9800'; // 设置为橙色
            singleStepLeft.appendChild(singleStepNameSpan);
            
            // 右侧：勾选框
            const singleStepRight = document.createElement('div');
            singleStepRight.style.display = 'flex';
            singleStepRight.style.alignItems = 'center';
            
            const singleStepCheckbox = document.createElement('input');
            singleStepCheckbox.type = 'checkbox';
            singleStepCheckbox.style.marginLeft = '4px';
            singleStepCheckbox.checked = false;
            
            // 添加点击事件处理
            singleStepCheckbox.addEventListener('change', function(event) {
                // 更新显示项的状态
                singleStepDisplayItem.isSingleStep = event.target.checked;
                // 存储到应用实例中供全局访问
                MWI_Toolkit_Calculator_App.isSingleStepMode = event.target.checked;
                // 同步刷新计算结果
                if (MWI_Toolkit_Calculator_App.EventHandler) {
                    MWI_Toolkit_Calculator_App.EventHandler.scheduleRender();
                }
            });
            
            singleStepRight.appendChild(singleStepCheckbox);
            
            singleStepDiv.appendChild(singleStepLeft);
            singleStepDiv.appendChild(singleStepRight);
            singleStepDiv.className = 'Toolkit_Calculator_ProgressRow';
            
            // 设置DOM引用
            singleStepDisplayItem.setDomReferences(singleStepDiv, null, null, null, singleStepCheckbox);
            this.missingDisplayItems.set('special_single_step', singleStepDisplayItem);
            
            // 存储到应用实例中供全局访问
            MWI_Toolkit_Calculator_App.isSingleStepMode = false;
            
            // 将单步计算行添加到容器中
            container.appendChild(singleStepDiv);
        }
        
        // 清空所有显示项
        clearAllDisplayItems() {
            // 清空目标物品缓存
            for (const [itemHrid, displayItem] of this.targetDisplayItems) {
                displayItem.destroyDomReferences();
            }
            this.targetDisplayItems.clear();
            
            // 清空需求物品缓存
            for (const [itemHrid, displayItem] of this.missingDisplayItems) {
                displayItem.destroyDomReferences();
            }
            this.missingDisplayItems.clear();
            
            // 清空所有面板的显示内容
            this.panelDisplays.forEach(panelDisplay => {
                panelDisplay.targetItemDiv.innerHTML = '';
                panelDisplay.missingItemDiv.innerHTML = '';
            });
        }
    }

    //#endregion

    //#region 事件处理器

    class MWI_Toolkit_Calculator_EventHandler {
        constructor() {
            this.renderTimeout = null;
        }

        // 添加目标物品
        addTargetItem(itemHrid, count = 1) {
            if (!itemHrid || count <= 0) return;

            const existingItemIndex = MWI_Toolkit_Calculator_App.Core.targetItems.findIndex(item => item.itemHrid === itemHrid);
            if (existingItemIndex !== -1) {
                // 如果物品已存在，增加数量
                if (itemHrid.includes('/items/')) {
                    MWI_Toolkit_Calculator_App.Core.targetItems[existingItemIndex].count += count;
                }
                if (itemHrid.includes('/house_rooms/')) {
                    MWI_Toolkit_Calculator_App.Core.targetItems[existingItemIndex].count = Math.max(MWI_Toolkit_Calculator_App.Core.targetItems[existingItemIndex].count, count);
                }
            } else {
                // 添加新物品
                MWI_Toolkit_Calculator_App.Core.targetItems.push(new Item(itemHrid, count));
            }

            this.saveAndScheduleRender('数据已保存');
        }

        // 更新目标物品
        updateTargetItem(itemHrid, newCount) {
            if (!itemHrid) return;
            if (newCount < 0) newCount = 0;

            const existingItemIndex = MWI_Toolkit_Calculator_App.Core.targetItems.findIndex(item => item.itemHrid === itemHrid);
            if (existingItemIndex !== -1) {
                MWI_Toolkit_Calculator_App.Core.targetItems[existingItemIndex].count = newCount;
            } else if (newCount > 0) {
                // 如果物品不存在且数量大于0，添加新物品
                MWI_Toolkit_Calculator_App.Core.targetItems.push(new Item(itemHrid, newCount));
            }

            this.saveAndScheduleRender('数据已保存');
        }

        // 删除目标物品
        removeTargetItem(itemHrid) {
            if (!itemHrid) return;

            const index = MWI_Toolkit_Calculator_App.Core.targetItems.findIndex(item => item.itemHrid === itemHrid);
            if (index !== -1) {
                MWI_Toolkit_Calculator_App.Core.targetItems.splice(index, 1);
                this.saveAndScheduleRender('数据已保存');
            }
        }

        // 清空所有目标物品
        clearAllTargetItems() {
            MWI_Toolkit_Calculator_App.Core.targetItems = [];

            // 清空保存的数据
            MWI_Toolkit_Calculator_App.DataManager.clearSavedData();

            this.scheduleRender();
        }

        // 保存数据并计划渲染
        saveAndScheduleRender() {
            // 立即保存数据到存储，确保勾选状态被保存
            try {
                MWI_Toolkit_Calculator_App.DataManager.saveTargetItems(MWI_Toolkit_Calculator_App.Core.targetItems);
            } catch (error) {
                console.error('[MWI计算器] 保存数据失败:', error);
            }
            
            // 计划渲染
            this.scheduleRender();
        }

        // 计划延迟渲染
        scheduleRender() {
            // 清除之前的计时器
            if (this.renderTimeout) {
                clearTimeout(this.renderTimeout);
            }

            // 设置新的计时器
            this.renderTimeout = setTimeout(() => {
                MWI_Toolkit_Calculator_App.UIManager.renderItemsDisplay();
                this.renderTimeout = null;
            }, 300); // 300ms 防抖延迟
        }

        // 注册物品变更监听器
        registerItemChangeListener() {
            // 注册物品变更监听器
            if (window.MWI_Toolkit?.characterItems?.changeCallbacks) {
                window.MWI_Toolkit.characterItems.changeCallbacks.push((endCharacterItems) => {
                    this.scheduleRender();
                });
                console.log('[MWI计算器] 物品变更监听器已注册');
            } else {
                console.warn('[MWI计算器] 无法注册物品变更监听器，MWI_Toolkit.characterItems.changeCallbacks 不可用');
            }
        }
    }

    //#endregion

    //#region 主应用程序

    class MWI_Toolkit_Calculator_App {
        static Core;
        static DataManager;
        static UIManager;
        static EventHandler;
        static Language;
        static isFirstInitialization = true;
        static pickBuffValueCache = null; // 缓存采摘数量加成值

        constructor() {
            MWI_Toolkit_Calculator_App.Core = new MWI_Toolkit_Calculator_Core();
            MWI_Toolkit_Calculator_App.DataManager = new MWI_Toolkit_Calculator_DataManager();
            MWI_Toolkit_Calculator_App.UIManager = new MWI_Toolkit_Calculator_UIManager();
            MWI_Toolkit_Calculator_App.EventHandler = new MWI_Toolkit_Calculator_EventHandler();
        }

        start() {
            this.waitForDependencies(() => {
                this.initialize();
            });
            window.MWI_Toolkit.switchCharacterCallbacks.push(() => {
                this.waitForDependencies(() => {
                    this.initialize();
                });
            });
        }

        // 初始化应用程序
        initialize() {
            console.log('[MWI计算器] 开始初始化...');

            if (MWI_Toolkit_Calculator_App.isFirstInitialization) {
                // 事件不重复注册
                MWI_Toolkit_Calculator_App.EventHandler.registerItemChangeListener();
                MWI_Toolkit_Calculator_App.isFirstInitialization = false;
            }

            // 创建UI
            MWI_Toolkit_Calculator_App.UIManager.initialize();
            // 读取角色ID
            MWI_Toolkit_Calculator_App.DataManager.initStorageKey();
            // 加载保存数据
            MWI_Toolkit_Calculator_App.DataManager.loadTargetItems();
            
            // 初始化时加载一次采摘数量加成值并缓存
            MWI_Toolkit_Calculator_App.pickBuffValueCache = MWI_Toolkit_Calculator_App.DataManager.loadPickBuffValue() || 1;
            console.log('[MWI计算器] 初始化缓存采摘数量加成值:', MWI_Toolkit_Calculator_App.pickBuffValueCache);

            console.log('[MWI计算器] 初始化完成');
        }

        // 等待依赖项加载完成
        waitForDependencies(callback) {
            const checkDependencies = setInterval(() => {
                if (window.MWI_Toolkit?.init_character_data &&
                    window.MWI_Toolkit?.init_client_data) {
                    clearInterval(checkDependencies);
                    console.log('[MWI计算器] 依赖项加载完成');

                    // 等待DOM元素出现
                    this.waitForElement(callback);
                }
            }, 500);
        }

        // 等待DOM元素出现
        waitForElement(callback) {
            const selector = '[class^="CharacterManagement_tabsComponentContainer"] [class*="TabsComponent_tabsContainer"]';
            const el = document.querySelector(selector);
            if (el) {
                callback();
                return;
            }
            const observer = new MutationObserver(() => {
                const el = document.querySelector(selector);
                if (el) {
                    observer.disconnect();
                    callback();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        
        // 在指定按钮旁添加新按钮
        addButtonNextToTarget() {
            const targetSelector = '#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7> div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.SkillActionDetail_skillActionDetail__1jHU4 > div > div.SkillActionDetail_actionContainer__22yYX > div.SkillActionDetail_maxActionCountInput__1C0Pw > button.Button_button__1Fe9z.Button_small__3fqC7.Button_disabled__wCyIq';
            
            // 检查目标元素是否已存在
            let targetButton = document.querySelector(targetSelector);
            if (targetButton) {
                this.createNewButton(targetButton);
                return;
            }
            
            // 使用MutationObserver监听目标元素出现
            const observer = new MutationObserver(() => {
                targetButton = document.querySelector(targetSelector);
                if (targetButton) {
                    // 检查新按钮是否已经存在
                    if (!document.querySelector('#MWI_custom_button')) {
                        this.createNewButton(targetButton);
                    }
                    // 由于目标可能多次出现，这里不disconnect
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
        
        // 创建新按钮
        createNewButton(targetButton) {
            const newButton = document.createElement('button');
            newButton.id = 'MWI_custom_button';
            newButton.className = 'Button_button__1Fe9z Button_small__3fqC7';
            newButton.textContent = '输入';
            newButton.style.marginLeft = '5px';
            
            // 添加点击事件，实现查找匹配文本并更新按钮名称
            newButton.addEventListener('click', () => {
                console.log('[MWI计算器] 新按钮被点击，开始查找匹配内容');
                
                // 查找第一个元素的文本内容
                let skillNameElement = document.querySelector('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.SkillActionDetail_skillActionDetail__1jHU4 > div > div.SkillActionDetail_name__3erHV');
                
                if (!skillNameElement) {
                    console.error('[MWI计算器] 未找到技能名称元素');
                    return;
                }
                
                let searchName = skillNameElement.textContent.trim();
                console.log('[MWI计算器] 找到技能名称:', searchName);
                
                // 获取目标容器
                const targetContainer = document.querySelector('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_characterManagementPanel__3OYQL > div > div > div > div.TabsComponent_tabPanelsContainer__26mzo > div:nth-child(6) > div > div:nth-child(3)');
                
                if (!targetContainer) {
                    console.error('[MWI计算器] 未找到目标容器');
                    return;
                }
                
                // 查找所有可能的行（n可以是任意数字）
                const rows = targetContainer.querySelectorAll('div:nth-child(3) > div');
                let foundMatch = false;
                
                // 尝试使用第一个名称查找匹配
                for (let i = 0; i < rows.length; i++) {
                    const row = rows[i];
                    const nameElement = row.querySelector('div:nth-child(2)');
                    
                    if (nameElement && nameElement.textContent.trim() === searchName) {
                        // 找到了匹配项，获取对应的数值
                        const valueElement = row.querySelector('span');
                        
                        if (valueElement) {
                            const value = valueElement.textContent.trim();
                            console.log('[MWI计算器] 找到匹配项，数值为:', value);
                            foundMatch = true;
                            
                            // 将数值填入到指定的输入框中
                            const targetInput = document.querySelector('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.SkillActionDetail_skillActionDetail__1jHU4 > div > div.SkillActionDetail_actionContainer__22yYX > div.SkillActionDetail_maxActionCountInput__1C0Pw > div.SkillActionDetail_input__1G-kE > div > input');
                            
                            if (targetInput) {
                                // 处理值，当含有斜杠时只取斜杠后面的内容
                                let processedValue = value;
                                if (value.includes('/')) {
                                    processedValue = value.split('/')[1];
                                    console.log('[MWI计算器] 检测到斜杠，已处理值为:', processedValue);
                                }
                                
                                // 保留数字和小数点，然后取整
                                const numericValue = processedValue.replace(/[^0-9.]/g, '');
                                if (numericValue !== processedValue) {
                                    console.log('[MWI计算器] 已提取数字部分，从', processedValue, '变为', numericValue);
                                }
                                // 无论是否进行了字符提取，都要将数值取整
                                const flooredValue = Math.floor(parseFloat(numericValue) || 0);
                                processedValue = flooredValue.toString();
                                
                                // 使用React兼容的输入触发方法
                                reactInputTriggerHack(targetInput, processedValue);
                                console.log('[MWI计算器] 已使用React兼容方式将数值填入输入框:', processedValue);
                            } else {
                                console.error('[MWI计算器] 未找到目标输入框');
                            }
                            
                            break;
                        }
                    }
                }
                
                // 如果未找到匹配，尝试查找第二个元素的文本内容
                if (!foundMatch) {
                    console.log('[MWI计算器] 未找到匹配的技能名称，尝试查找第二个元素');
                    
                    const secondNameElement = document.querySelector('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7> div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.SkillActionDetail_skillActionDetail__1jHU4 > div > div.SkillActionDetail_content__1MbXv > div > div:nth-child(4) > div.SkillActionDetail_dropTable__3ViVp > div > div.Item_itemContainer__x7kH1 > div > div > div.Item_name__2C42x');
                    
                    if (secondNameElement) {
                        searchName = secondNameElement.textContent.trim();
                        console.log('[MWI计算器] 找到第二个元素名称:', searchName);
                        
                        // 再次尝试查找匹配项
                        for (let i = 0; i < rows.length; i++) {
                            const row = rows[i];
                            const nameElement = row.querySelector('div:nth-child(2)');
                            
                            if (nameElement && nameElement.textContent.trim() === searchName) {
                                // 找到了匹配项，获取对应的数值
                                const valueElement = row.querySelector('span');
                                
                                if (valueElement) {
                                    const value = valueElement.textContent.trim();
                                    console.log('[MWI计算器] 使用第二个名称找到匹配项，数值为:', value);
                                    foundMatch = true;
                                    
                                    // 将数值填入到指定的输入框中
                                    const targetInput = document.querySelector('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.SkillActionDetail_skillActionDetail__1jHU4 > div > div.SkillActionDetail_actionContainer__22yYX > div.SkillActionDetail_maxActionCountInput__1C0Pw > div.SkillActionDetail_input__1G-kE > div > input');
                                    
                                    if (targetInput) {
                                        // 处理值，当含有斜杠时只取斜杠后面的内容
                                        let processedValue = value;
                                        if (value.includes('/')) {
                                            processedValue = value.split('/')[1];
                                            console.log('[MWI计算器] 检测到斜杠，已处理值为:', processedValue);
                                        }
                                        
                                        // 保留数字和小数点，然后取整
                                        const numericValue = processedValue.replace(/[^0-9.]/g, '');
                                        if (numericValue !== processedValue) {
                                            console.log('[MWI计算器] 已提取数字部分，从', processedValue, '变为', numericValue);
                                        }
                                        // 无论是否进行了字符提取，都要将数值取整
                                        const flooredValue = Math.floor(parseFloat(numericValue) || 0);
                                        processedValue = flooredValue.toString();
                                        
                                        // 使用React兼容的输入触发方法
                                        reactInputTriggerHack(targetInput, processedValue);
                                        console.log('[MWI计算器] 已使用React兼容方式将数值填入输入框:', processedValue);
                                    } else {
                                        console.error('[MWI计算器] 未找到目标输入框');
                                    }
                                    
                                    break;
                                }
                            }
                        }
                    } else {
                        console.log('[MWI计算器] 未找到第二个元素');
                    }
                }
                
                if (!foundMatch) {
                    console.log('[MWI计算器] 未找到匹配项');
                }
            });
            
            // React输入触发辅助函数
            function reactInputTriggerHack(inputElem, value) {
                let lastValue = inputElem.value;
                inputElem.value = value;
                let event = new Event("input", { bubbles: true });
                event.simulated = true;
                let tracker = inputElem._valueTracker;
                if (tracker) {
                    tracker.setValue(lastValue);
                }
                inputElem.dispatchEvent(event);
            }
            
            // 将新按钮添加到目标按钮旁边
            targetButton.parentNode.insertBefore(newButton, targetButton.nextSibling);
            console.log('[MWI计算器] 新按钮已添加到目标按钮旁边');
            
            // 创建"增加"按钮
            const addButton = document.createElement('button');
            addButton.id = 'MWI_add_button';
            addButton.className = 'Button_button__1Fe9z Button_small__3fqC7';
            addButton.textContent = '增加';
            addButton.style.marginLeft = '5px';
                    addButton.style.backgroundColor = 'orange';
            
            // 添加点击事件，实现将输入框数字+10
            addButton.addEventListener('click', () => {
                console.log('[MWI计算器] 增加按钮被点击，开始增加数值');
                
                // 获取目标输入框
                const targetInput = document.querySelector('#root > div > div > div.GamePage_gamePanel__3uNKN > div.GamePage_contentPanel__Zx4FH > div.GamePage_middlePanel__uDts7 > div.GamePage_mainPanel__2njyb > div > div:nth-child(1) > div > div.Modal_modalContainer__3B80m > div.Modal_modal__1Jiep > div.SkillActionDetail_skillActionDetail__1jHU4 > div > div.SkillActionDetail_actionContainer__22yYX > div.SkillActionDetail_maxActionCountInput__1C0Pw > div.SkillActionDetail_input__1G-kE > div > input');
                
                if (targetInput) {
                    // 获取当前输入框的值
                    let currentValue = targetInput.value.trim();
                    // 提取数字部分
                    const numericValue = currentValue.replace(/[^0-9]/g, '');
                    // 转换为数字并加10
                    const newValue = (parseInt(numericValue, 10) || 0) + 10;
                    console.log('[MWI计算器] 当前值:', currentValue, '增加后值:', newValue);
                    
                    // 使用React兼容的输入触发方法
                    reactInputTriggerHack(targetInput, newValue.toString());
                    console.log('[MWI计算器] 已将数值增加10并填入输入框');
                } else {
                    console.error('[MWI计算器] 未找到目标输入框');
                }
            });
            
            // 将"增加"按钮添加到"输入"按钮旁边
            newButton.parentNode.insertBefore(addButton, newButton.nextSibling);
            console.log('[MWI计算器] 增加按钮已添加到输入按钮旁边');
        }
    }

    //#endregion

    // 创建并启动应用程序实例
    const app = new MWI_Toolkit_Calculator_App();
    app.start();
    app.addButtonNextToTarget();

})();