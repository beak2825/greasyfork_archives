// ==UserScript==
// @name         MWI_Toolkit_ActionDetailPlus
// @namespace    http://tampermonkey.net/
// @version      5.2.2
// @description  MWI动作面板增强
// @author       zqzhang1996
// @icon         https://www.milkywayidle.com/favicon.svg
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @grant        none
// @run-at       document-body
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/550483/MWI_Toolkit_ActionDetailPlus.user.js
// @updateURL https://update.greasyfork.org/scripts/550483/MWI_Toolkit_ActionDetailPlus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    if (window.MWI_Toolkit) return;
    window.MWI_Toolkit = {};
    window.MWI_Toolkit.characterItems = {
        map: new Map(),
        getCount(itemHrid, enhancementLevel = 0) { return window.MWI_Toolkit.characterItems.map.get(itemHrid)?.get(enhancementLevel) || 0; },
        getMaxEnhancementLevel(itemHrid) {
            const itemMap = window.MWI_Toolkit.characterItems.map.get(itemHrid);
            if (!itemMap) return -1;
            const validLevels = Array.from(itemMap.entries()).filter(([level, count]) => count > 0).map(([level, count]) => level);
            return validLevels.length > 0 ? Math.max(...validLevels) : -1;
        },
        changeCallbacks: [],
        triggerItemChangeEvent(endCharacterItems) {
            window.MWI_Toolkit.characterItems.changeCallbacks.forEach(callback => {
                try { callback(endCharacterItems); }
                catch (error) { console.error('Error in item change callback:', error); }
            });
        },
        updateItemsMap(characterItems) {
            if (characterItems) {
                characterItems.forEach(item => {
                    if (!window.MWI_Toolkit.characterItems.map.has(item.itemHrid)) { window.MWI_Toolkit.characterItems.map.set(item.itemHrid, new Map()); }
                    window.MWI_Toolkit.characterItems.map.get(item.itemHrid).set(item.enhancementLevel, item.count);
                });
            }
        }
    };

    window.MWI_Toolkit.switchCharacterCallbacks = [];
    const oriGet = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data").get;
    Object.defineProperty(MessageEvent.prototype, "data", {
        get: function () {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket) ||
                (socket.url.indexOf("api.milkywayidle.com/ws") === -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") === -1)) {
                return oriGet.call(this);
            }
            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop
            try {
                const obj = JSON.parse(message);
                if (obj && obj.type === "init_character_data") {
                    console.log("[MWI_Toolkit] 捕获到 init_character_data 消息，更新角色数据和物品数据");
                    window.MWI_Toolkit.init_character_data = obj;
                    const compressedData = localStorage.getItem("initClientData");
                    const decompressedData = LZString.decompressFromUTF16(compressedData);
                    window.MWI_Toolkit.init_client_data = JSON.parse(decompressedData);
                    window.MWI_Toolkit.i18n.i18nData = (e => e?.[Object.keys(e).find(k => k.startsWith('__reactFiber$'))]?.return?.stateNode)(document.querySelector('[class^="GamePage"]'))?.props.i18n;
                    window.MWI_Toolkit.characterItems.map.clear();
                    window.MWI_Toolkit.characterItems.updateItemsMap(obj.characterItems);
                    window.MWI_Toolkit.switchCharacterCallbacks.forEach(callback => {
                        try { callback(); }
                        catch (error) { console.error('Error in switchCharacterCallbacks:', error); }
                    });
                }
                else if (obj && obj.endCharacterItems) {
                    window.MWI_Toolkit.characterItems.updateItemsMap(obj.endCharacterItems);
                    window.MWI_Toolkit.characterItems.triggerItemChangeEvent(obj.endCharacterItems);
                }
            } catch (e) { }
            return message;
        }
    });
    window.MWI_Toolkit.i18n = {
        getItemName(itemHrid, lang = "zh") { return this.getName(itemHrid, "itemNames", lang); },
        getName(hrid, fieldName = null, lang = "zh") {
            if (!hrid) { return hrid; }
            try {
                const translation = this.i18nData?.options?.resources?.[lang]?.translation;
                if (!translation) { return hrid; }
                if (fieldName) { return translation[fieldName]?.[hrid] || hrid; }
                for (const [fieldKey, fieldData] of Object.entries(translation)) {
                    if (fieldData && typeof fieldData === 'object') {
                        const result = fieldData[hrid];
                        if (result && typeof result === 'string') { return result; }
                    }
                }
                return hrid;
            }
            catch (e) { return hrid; }
        },
        getItemHridByName(itemName, lang = "zh") {
            return this.getHridByName(itemName, "itemNames", lang);
        },
        getHridByName(name, fieldName = null, lang = "zh") {
            if (!name) { return null; }
            try {
                const translation = this.i18nData?.options?.resources?.[lang]?.translation;
                if (!translation) { return null; }
                const searchName = name.toLowerCase().trim();
                if (fieldName) {
                    const fieldData = translation[fieldName];
                    if (!fieldData) { return null; }
                    for (const [hrid, currentName] of Object.entries(fieldData)) {
                        if (currentName.toLowerCase() === searchName) { return hrid; }
                    }
                    return null;
                }
                for (const [fieldKey, fieldData] of Object.entries(translation)) {
                    if (fieldData && typeof fieldData === 'object') {
                        for (const [hrid, currentName] of Object.entries(fieldData)) {
                            if (typeof currentName === 'string' && currentName.toLowerCase() === searchName) {
                                return hrid;
                            }
                        }
                    }
                }
                return null;
            }
            catch (e) { return null; }
        },
        i18nData: null
    };

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

        static getIconHrefByItemHrid(itemHrid) {
            return '/static/media/items_sprite.d4d08849.svg#' + itemHrid.split('/').pop();
        }

        static reactInputTriggerHack(inputElem) {
            let lastValue = inputElem.value;
            let event = new Event("input", { bubbles: true });
            event.simulated = true;
            let tracker = inputElem._valueTracker;
            if (tracker) {
                tracker.setValue(lastValue === '' ? ' ' : ''); // 触发变更
            }
            inputElem.dispatchEvent(event);
        }
    }

    //#endregion

    //#region 主应用程序

    class MWI_Toolkit_ActionDetailPlus_App {
        static Language = 'zh';

        constructor() {
            this.processableItemMap = {
                "/items/milk": "/items/cheese",
                "/items/verdant_milk": "/items/verdant_cheese",
                "/items/azure_milk": "/items/azure_cheese",
                "/items/burble_milk": "/items/burble_cheese",
                "/items/crimson_milk": "/items/crimson_cheese",
                "/items/rainbow_milk": "/items/rainbow_cheese",
                "/items/holy_milk": "/items/holy_cheese",
                "/items/log": "/items/lumber",
                "/items/birch_log": "/items/birch_lumber",
                "/items/cedar_log": "/items/cedar_lumber",
                "/items/purpleheart_log": "/items/purpleheart_lumber",
                "/items/ginkgo_log": "/items/ginkgo_lumber",
                "/items/redwood_log": "/items/redwood_lumber",
                "/items/arcane_log": "/items/arcane_lumber",
                "/items/cotton": "/items/cotton_fabric",
                "/items/flax": "/items/linen_fabric",
                "/items/bamboo_branch": "/items/bamboo_fabric",
                "/items/cocoon": "/items/silk_fabric",
                "/items/radiant_fiber": "/items/radiant_fabric"
            };
        }

        enhanceSkillActionDetail() {
            if (unsafeWindow.MWI_Toolkit_Started) { return; }
            if (document.title.includes('Milky Way Idle')) {
                MWI_Toolkit_ActionDetailPlus_App.Language = 'en';
            }
            else {
                MWI_Toolkit_ActionDetailPlus_App.Language = 'zh';
            }

            const {
                upgradeItemHrid,    // itemHrid
                inputItems,         // [{itemHrid, count}]
                outputItems         // [{itemHrid, count}]
            } = this.calculateActionDetail();

            const missingUpgradeItemCountComponent = {};
            if (upgradeItemHrid) {
                const missingCountContainer = document.querySelector('[class^="SkillActionDetail_upgradeItemSelectorInput"]')?.parentElement?.previousElementSibling;
                if (missingCountContainer) {
                    const newTextSpan = document.createElement('span');
                    newTextSpan.textContent = missingCountContainer.textContent;
                    newTextSpan.style.height = window.getComputedStyle(document.querySelector('[class*="SkillActionDetail_levelRequirement"]')).height;
                    missingCountContainer.innerHTML = '';
                    missingCountContainer.appendChild(newTextSpan);

                    const missingCountComponent = document.createElement('div');
                    missingCountComponent.style.display = 'flex';
                    missingCountComponent.style.alignItems = 'flex-end';
                    missingCountComponent.style.flexDirection = 'column';

                    const missingCountSpan = document.createElement('span');
                    missingCountSpan.style.display = 'flex';
                    missingCountSpan.style.alignItems = 'center';
                    missingCountSpan.style.color = '#faa21e';
                    missingCountComponent.appendChild(missingCountSpan);

                    missingUpgradeItemCountComponent.itemHrid = upgradeItemHrid;
                    missingUpgradeItemCountComponent.missingCountSpan = missingCountSpan;
                    missingUpgradeItemCountComponent.count = 1; // 升级物品固定需求1个

                    missingCountContainer.appendChild(missingCountComponent);
                }
            }

            // [{itemHrid, missingCountSpan, inventoryCountSpan, inputCountSpan, count}]
            const inputItemComponents = [];
            if (inputItems) {
                const inputItemComponentContainer = document.querySelector('[class^="SkillActionDetail_itemRequirements"]');
                const missingCountContainer = inputItemComponentContainer?.parentElement?.previousElementSibling;
                if (missingCountContainer) {
                    const newTextSpan = document.createElement('span');
                    newTextSpan.textContent = missingCountContainer.textContent;
                    newTextSpan.style.height = window.getComputedStyle(document.querySelector('[class*="SkillActionDetail_levelRequirement"]')).height;
                    missingCountContainer.innerHTML = '';
                    missingCountContainer.appendChild(newTextSpan);

                    const missingCountComponent = document.createElement('div');
                    missingCountComponent.style.display = 'flex';
                    missingCountComponent.style.alignItems = 'flex-end';
                    missingCountComponent.style.flexDirection = 'column';

                    const inventoryCountSpans = inputItemComponentContainer?.querySelectorAll('[class*="SkillActionDetail_inventoryCount"]');
                    const inputCountSpans = inputItemComponentContainer?.querySelectorAll('[class*="SkillActionDetail_inputCount"]');
                    const itemContainers = inputItemComponentContainer?.querySelectorAll('[class*="Item_itemContainer"]');
                    for (let i = 0; i < itemContainers.length; i++) {
                        inputCountSpans[i].style.color = '#E7E7E7';

                        const inputItemHrid = '/items/' + itemContainers[i].querySelector('svg use').getAttribute('href').split('#').pop();
                        const inputItemCount = inputItems.find(item => item.itemHrid === inputItemHrid)?.count || 0;
                        const missingCountSpan = document.createElement('span');
                        missingCountSpan.style.height = window.getComputedStyle(itemContainers[i]).height;
                        missingCountSpan.style.display = 'flex';
                        missingCountSpan.style.alignItems = 'center';
                        missingCountSpan.style.color = '#faa21e';
                        missingCountComponent.appendChild(missingCountSpan);
                        inputItemComponents.push({ itemHrid: inputItemHrid, missingCountSpan, inventoryCountSpan: inventoryCountSpans[i], inputCountSpan: inputCountSpans[i], count: inputItemCount });
                    }

                    missingCountContainer.appendChild(missingCountComponent);
                }
            }

            // [{itemHrid, input, count}]
            const outputItemComponents = [];
            let lastOutputItemComponent = document.querySelector('[class^="SkillActionDetail_maxActionCountInput"]');
            const outputItemComponentContainer = lastOutputItemComponent.parentElement;
            const skillActionTimeInput = lastOutputItemComponent.querySelector('input');
            const skillActionTimeButtons = lastOutputItemComponent.querySelectorAll('button');

            for (const outputItem of outputItems) {
                if (outputItem.count === 1 && outputItems.length === 1) break; // 仅有一个产出且数量为1时不创建额外输入框
                const { component: newOutputItemComponent, input: newInput } = this.createOutputItemComponent(outputItem.itemHrid);
                if (newOutputItemComponent && newInput) {
                    outputItemComponentContainer.insertBefore(newOutputItemComponent, lastOutputItemComponent.nextSibling);
                    outputItemComponents.push({ itemHrid: outputItem.itemHrid, input: newInput, count: outputItem.count });
                    lastOutputItemComponent = newOutputItemComponent;
                }
            }

            // 联动
            let linking = false;
            function updateSkillActionDetail(e) {
                if (linking) return;
                linking = true;
                const idx = outputItemComponents.findIndex(input => input.input === e.target);
                const targetValue = parseInt(e.target.value, 10);
                if (idx !== -1) {
                    skillActionTimeInput.value = (isNaN(targetValue)) ? '∞' : Math.ceil(targetValue / outputItemComponents[idx].count);
                    Utils.reactInputTriggerHack(skillActionTimeInput);
                }
                const skillActionTimes = parseInt(skillActionTimeInput.value, 10);
                outputItemComponents.forEach(({ itemHrid, input, count }) => {
                    if (input !== e.target) {
                        input.value = (isNaN(skillActionTimes)) ? '∞' : Math.ceil(skillActionTimes * count);
                    }
                });
                inputItemComponents.forEach(({ itemHrid, missingCountSpan, inventoryCountSpan, inputCountSpan, count }) => {
                    const inventoryCount = window.MWI_Toolkit.characterItems.getCount(itemHrid);
                    const requiredCount = count * skillActionTimes;
                    if (isNaN(skillActionTimes)) {
                        missingCountSpan.textContent = '';
                        inventoryCountSpan.style.color = '';
                    }
                    else {
                        if (requiredCount > inventoryCount) {
                            missingCountSpan.textContent = Utils.formatNumber(requiredCount - inventoryCount);
                            inventoryCountSpan.style.color = '#f44336';
                        } else {
                            missingCountSpan.textContent = ' ';
                            inventoryCountSpan.style.color = '#E7E7E7';
                        }
                    }
                    inputCountSpan.textContent = '\u00A0/ ' + Utils.formatNumber(count * ((isNaN(skillActionTimes) ? 1 : skillActionTimes))) + '\u00A0';
                });
                if (missingUpgradeItemCountComponent.missingCountSpan) {
                    if (isNaN(skillActionTimes)) { missingUpgradeItemCountComponent.missingCountSpan.textContent = ''; }
                    else {
                        const requiredCount = missingUpgradeItemCountComponent.count * skillActionTimes;
                        const inventoryCount = window.MWI_Toolkit.characterItems.getCount(missingUpgradeItemCountComponent.itemHrid);

                        if (requiredCount > inventoryCount) {
                            missingUpgradeItemCountComponent.missingCountSpan.textContent = Utils.formatNumber(requiredCount - inventoryCount);
                        } else {
                            missingUpgradeItemCountComponent.missingCountSpan.textContent = ' ';
                        }
                    }
                }

                linking = false;
            }

            skillActionTimeInput.addEventListener('input', updateSkillActionDetail);
            outputItemComponents.forEach(({ input }) => {
                input.addEventListener('input', updateSkillActionDetail);
            });
            skillActionTimeButtons.forEach(btn => {
                btn.addEventListener('click', () => {
                    setTimeout(() => {
                        updateSkillActionDetail({ target: skillActionTimeInput });
                    }, 20);
                });
            });

            // 初次填充
            setTimeout(() => {
                updateSkillActionDetail({ target: skillActionTimeInput });
            }, 20);
        }

        //#region 数据计算

        // 数据计算，返回 {upgradeItemHrid, inputItems, outputItems}
        calculateActionDetail() {
            const actionDetail = this.getActionDetail();
            const actionType = this.getActionType();
            if (!actionDetail || !actionType) {
                console.warn('MWI_Toolkit_ActionDetailPlus: 无法获取动作详情');
                return { upgradeItemHrid: null, inputItems: null, outputItems: null };
            }
            // console.log('MWI_Toolkit_ActionDetailPlus: 获取到动作详情', actionDetail);

            const drinkSlots = this.getActionTypeDrinkSlots();
            const drinkConcentration = this.getDrinkConcentration();
            // console.log('MWI_Toolkit_ActionDetailPlus: 获取到茶列表', drinkSlots, drinkConcentration);

            const upgradeItemHrid = actionDetail.upgradeItemHrid;
            const inputItems = actionDetail.inputItems ? JSON.parse(JSON.stringify(actionDetail.inputItems)) : null;
            const outputItems = actionDetail.outputItems ? JSON.parse(JSON.stringify(actionDetail.outputItems)) : [];

            // 检查采集数量加成
            const gatheringBuff = (drinkSlots?.some(slot => slot && slot.itemHrid === '/items/gathering_tea') ? 0.15 * drinkConcentration : 0)
                + this.getEquipmentGatheringBuff() + this.getCommunityGatheringBuff();
            // 检查加工茶加成
            const processingBuff = (drinkSlots?.some(slot => slot && slot.itemHrid === '/items/processing_tea') ? 0.15 * drinkConcentration : 0);
            // 检查美食茶加成
            const gourmetBuff = (drinkSlots?.some(slot => slot && slot.itemHrid === '/items/gourmet_tea') ? 0.12 * drinkConcentration : 0);
            // 检查工匠茶加成
            const artisanBuff = (drinkSlots?.some(slot => slot && slot.itemHrid === '/items/artisan_tea') ? 0.1 * drinkConcentration : 0);

            if (['milking', 'foraging', 'woodcutting', /*'cheesesmithing', 'crafting', 'tailoring', 'cooking', 'brewing'*/].includes(actionType)) {
                const dropTable = actionDetail.dropTable;
                for (const dropItem of dropTable) {
                    const averageCount = dropItem.dropRate * (dropItem.minCount + dropItem.maxCount) / 2 * (1 + gatheringBuff);
                    const processedItemHrid = this.processableItemMap[dropItem.itemHrid];
                    if (processedItemHrid) {
                        outputItems.push({ itemHrid: dropItem.itemHrid, count: averageCount * (1 - processingBuff), });
                        outputItems.push({ itemHrid: processedItemHrid, count: averageCount * (1 - processingBuff) / 2 / (1 - artisanBuff) + averageCount * processingBuff / 2, });
                    } else {
                        outputItems.push({ itemHrid: dropItem.itemHrid, count: averageCount, });
                    }
                }
            }
            if ([/*'milking', 'foraging', 'woodcutting', 'cheesesmithing', 'crafting', 'tailoring',*/ 'cooking', 'brewing'].includes(actionType)) {
                for (const outputItem of outputItems) { outputItem.count = outputItem.count * (1 + gourmetBuff); }
            }
            if ([/*'milking', 'foraging', 'woodcutting',*/ 'cheesesmithing', 'crafting', 'tailoring', 'cooking', 'brewing'].includes(actionType)) {
                for (const inputItem of inputItems) { inputItem.count = inputItem.count * (1 - artisanBuff); }
            }

            return { upgradeItemHrid, inputItems, outputItems };
        }

        //#endregion

        //#region UI创建

        // 创建output数量栏，返回 [{component, input}]
        createOutputItemComponent(itemHrid) {
            const origComponent = document.querySelector('[class^="SkillActionDetail_maxActionCountInput"]');
            if (!origComponent) return null;

            // 克隆外层div（不带子内容）
            const newComponent = origComponent.cloneNode(false);

            const originalActionLabel = document.querySelector('[class^="SkillActionDetail_actionContainer"] [class^="SkillActionDetail_label"]');
            if (Object.values(this.processableItemMap).includes(itemHrid)) {
                const tab = originalActionLabel.cloneNode(false);
                tab.style.width = window.getComputedStyle(originalActionLabel).width;
                tab.className = 'SkillActionDetail_tab';
                tab.textContent = '┗';
                newComponent.appendChild(tab);
            }

            // 物品图标
            const itemIcon = document.createElement('div');
            itemIcon.style.width = window.getComputedStyle(originalActionLabel).width;
            itemIcon.style.height = window.getComputedStyle(originalActionLabel).height;
            itemIcon.style.marginRight = '2px';
            itemIcon.style.display = 'flex';
            itemIcon.style.alignItems = 'center';
            itemIcon.style.justifyContent = 'center';

            const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svg.setAttribute('width', '20px');
            svg.setAttribute('height', '20px');
            svg.style.display = 'block';
            const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
            use.setAttributeNS('http://www.w3.org/1999/xlink', 'href', Utils.getIconHrefByItemHrid(itemHrid));
            svg.appendChild(use);
            itemIcon.appendChild(svg);

            newComponent.appendChild(itemIcon);

            // 输入框
            const origInputWrap = origComponent.querySelector('[class^="SkillActionDetail_input"]');
            const inputWrap = origInputWrap.cloneNode(true);
            const origInput = origInputWrap.querySelector('input');
            const input = inputWrap.querySelector('input');
            input.addEventListener('focus', function () {
                setTimeout(() => {
                    input.select();
                }, 0);
            });
            input.addEventListener('keydown', function (e) {
                if (e.key === 'Enter' || e.keyCode === 13) {
                    if (origInput) {
                        const event = new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            key: 'Enter',
                            code: 'Enter',
                            keyCode: 13,
                            which: 13
                        });
                        origInput.dispatchEvent(event);
                    }
                }
            });
            newComponent.appendChild(inputWrap);

            if (!Object.values(this.processableItemMap).includes(itemHrid)) {
                // 快捷填充按钮
                const btns = [
                    { val: 1000, txt: '1k' },
                    { val: 2000, txt: '2k' },
                    { val: 5000, txt: '5k' }
                ];
                const origButtons = origComponent.querySelectorAll('button');
                let buttonClass = '';
                if (origButtons.length > 0) buttonClass = origButtons[0].className;

                btns.forEach(({ val, txt }) => {
                    const btn = document.createElement('button');
                    btn.className = buttonClass;
                    btn.textContent = txt;
                    btn.addEventListener('click', () => {
                        input.value = val;
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    });
                    newComponent.appendChild(btn);
                });
            }

            return { component: newComponent, input };
        }

        //#endregion

        //#region 数据获取函数

        getActionHrid() {
            const actionNameDiv = document.querySelector('[class^="SkillActionDetail_name"]');
            const actionName = actionNameDiv ? actionNameDiv.textContent : '';
            return window.MWI_Toolkit.i18n.getHridByName(actionName, 'actionNames', MWI_Toolkit_ActionDetailPlus_App.Language);
        }

        getActionDetail() {
            const actionHrid = this.getActionHrid();
            return window.MWI_Toolkit?.init_client_data?.actionDetailMap?.[`${actionHrid}`];
        }

        getActionType() {
            // const actionType = document
            //     .querySelector('[class*="SkillActionDetail_value"][class*="SkillActionDetail_levelRequirement"]')
            //     ?.querySelector('svg use')
            //     ?.getAttribute('href')
            //     ?.split('#')
            //     ?.pop()
            //     || '';
            const actionDetail = this.getActionDetail();
            const actionType = actionDetail?.type?.split('/').pop() || '';
            // 仅支持八种常规类型
            if (['milking', 'foraging', 'woodcutting', 'cheesesmithing', 'crafting', 'tailoring', 'cooking', 'brewing'].includes(actionType)) {
                return actionType;
            }
            return null;
        }

        // 获取茶列表
        getActionTypeDrinkSlots() {
            const actionType = this.getActionType();
            const drinkSlots = window.MWI_Toolkit?.init_character_data?.actionTypeDrinkSlotsMap?.[`/action_types/${actionType}`];
            // if (['milking', 'foraging', 'woodcutting', /*'cheesesmithing', 'crafting', 'tailoring', 'cooking', 'brewing'*/].includes(actionType))
            // 对三采添加对应的工匠茶数据用于计算加工数量
            const processActionType = { milking: 'cheesesmithing', foraging: 'tailoring', woodcutting: 'crafting' }[actionType] || null;
            if (processActionType) {
                const processDrinkSlots = window.MWI_Toolkit?.init_character_data?.actionTypeDrinkSlotsMap?.[`/action_types/${processActionType}`];
                processDrinkSlots.forEach(drink => {
                    if (drink && drink.itemHrid == '/items/artisan_tea') {
                        drinkSlots.push(drink);
                    }
                });
            }
            return drinkSlots;
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

        // 获取装备采集数量buff
        getEquipmentGatheringBuff() {
            let equipmentGatheringBuff = 0;
            if (window.MWI_Toolkit?.init_client_data && window.MWI_Toolkit?.characterItems) {
                const philosophers_earrings_enhancementLevel = window.MWI_Toolkit.characterItems.getMaxEnhancementLevel("/items/philosophers_earrings");
                const earrings_of_gathering_enhancementLevel = window.MWI_Toolkit.characterItems.getMaxEnhancementLevel("/items/earrings_of_gathering");
                const philosophers_ring_enhancementLevel = window.MWI_Toolkit.characterItems.getMaxEnhancementLevel("/items/philosophers_ring");
                const ring_of_gathering_enhancementLevel = window.MWI_Toolkit.characterItems.getMaxEnhancementLevel("/items/ring_of_gathering");

                if (philosophers_earrings_enhancementLevel != -1) {
                    equipmentGatheringBuff = equipmentGatheringBuff
                        + window.MWI_Toolkit.init_client_data.itemDetailMap?.[`/items/philosophers_earrings`].equipmentDetail.noncombatStats.gatheringQuantity
                        + window.MWI_Toolkit.init_client_data.itemDetailMap?.[`/items/philosophers_earrings`].equipmentDetail.noncombatEnhancementBonuses.gatheringQuantity
                        * window.MWI_Toolkit.init_client_data.enhancementLevelTotalBonusMultiplierTable[philosophers_earrings_enhancementLevel];
                } else if (earrings_of_gathering_enhancementLevel != -1) {
                    equipmentGatheringBuff = equipmentGatheringBuff
                        + window.MWI_Toolkit.init_client_data.itemDetailMap?.[`/items/earrings_of_gathering`].equipmentDetail.noncombatStats.gatheringQuantity
                        + window.MWI_Toolkit.init_client_data.itemDetailMap?.[`/items/earrings_of_gathering`].equipmentDetail.noncombatEnhancementBonuses.gatheringQuantity
                        * window.MWI_Toolkit.init_client_data.enhancementLevelTotalBonusMultiplierTable[earrings_of_gathering_enhancementLevel];
                }

                if (philosophers_ring_enhancementLevel != -1) {
                    equipmentGatheringBuff = equipmentGatheringBuff
                        + window.MWI_Toolkit.init_client_data.itemDetailMap?.[`/items/philosophers_ring`].equipmentDetail.noncombatStats.gatheringQuantity
                        + window.MWI_Toolkit.init_client_data.itemDetailMap?.[`/items/philosophers_ring`].equipmentDetail.noncombatEnhancementBonuses.gatheringQuantity
                        * window.MWI_Toolkit.init_client_data.enhancementLevelTotalBonusMultiplierTable[philosophers_ring_enhancementLevel];
                } else if (ring_of_gathering_enhancementLevel != -1) {
                    equipmentGatheringBuff = equipmentGatheringBuff
                        + window.MWI_Toolkit.init_client_data.itemDetailMap?.[`/items/ring_of_gathering`].equipmentDetail.noncombatStats.gatheringQuantity
                        + window.MWI_Toolkit.init_client_data.itemDetailMap?.[`/items/ring_of_gathering`].equipmentDetail.noncombatEnhancementBonuses.gatheringQuantity
                        * window.MWI_Toolkit.init_client_data.enhancementLevelTotalBonusMultiplierTable[ring_of_gathering_enhancementLevel];
                }
            }
            return equipmentGatheringBuff;
        }

        // 获取社区采集数量buff
        getCommunityGatheringBuff() {
            const buffDivs = document.querySelectorAll('[class^="CommunityBuff_communityBuff"]');
            for (const buffDiv of buffDivs) {
                const useEl = buffDiv.querySelector('svg use');
                if (!useEl) continue;
                const href = useEl.getAttribute('href') || '';
                if (href.includes('gathering')) {
                    const levelDiv = buffDiv.querySelector('[class^="CommunityBuff_level"]');
                    if (levelDiv) {
                        const match = levelDiv.textContent.match(/Lv\.(\d+)/);
                        if (match) {
                            return parseInt(match[1], 10) * 0.005 + 0.195;
                        }
                    }
                }
            }
            return 0;
        }

        //#endregion

        // 监听页面变化
        initialize() {
            let lastPanel = null;
            const observer = new MutationObserver(() => {
                const panel = document.querySelector('[class^="SkillActionDetail_regularComponent"]');
                if (panel && panel !== lastPanel) {
                    lastPanel = panel;
                    setTimeout(() => {
                        this.enhanceSkillActionDetail(); // 箭头函数保证 this 正确
                    }, 50);
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    //#endregion

    // 创建并启动应用程序实例
    const app = new MWI_Toolkit_ActionDetailPlus_App();
    app.initialize();
})();