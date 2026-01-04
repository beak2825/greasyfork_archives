// ==UserScript==
// @name         ICKeyTool
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  铁牛碎片耗时计算
// @license      MIT
// @match        https://*/MWICombatSimulatorTest/*
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @author       Ratatatata
// @grant        GM_setValue
// @grant        GM_getValue
// @require     https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/549520/ICKeyTool.user.js
// @updateURL https://update.greasyfork.org/scripts/549520/ICKeyTool.meta.js
// ==/UserScript==

(function() {
    let initData_actionDetailMap = null;
    let initData_levelExperienceTable = null;
    let initData_actionCategoryDetailMap = null;
    let initData_abilityDetailMap = null;
    let initData_itemDetailMap = null;
    let initData_actionTypeDrinkSlotsMap = null;
    let initData_characterItems = null;
    let initData_characterSkills = null;
    let initData_characterHouseRoomMap = null;


    let itemEnNameToHridMap = {};

    let config = {
        //生活装备效率读不到，默认+5
        itemEffiBuff: 11.2,
        //20级采集buff
        GatheringQuantityBuff:29.5,
        //20级效率buff
        ProductionEfficiencyBuff:19.7
    }

    let language = "zh";
    const FragmentList=["蓝色钥匙碎片","绿色钥匙碎片","紫色钥匙碎片","白色钥匙碎片","橙色钥匙碎片","棕色钥匙碎片","石头钥匙碎片","黑暗钥匙碎片","燃烧钥匙碎片",
              "Blue Key Fragment","Green Key Fragment","Purple Key Fragment","White Key Fragment","Orange Key Fragment","Brown Key Fragment","Stone Key Fragment","Dark Key Fragment","Burning Key Fragment"];
    const CATEGORIES = {
        "Fragment": ["蓝色钥匙碎片","绿色钥匙碎片","紫色钥匙碎片","白色钥匙碎片","橙色钥匙碎片","棕色钥匙碎片","石头钥匙碎片","黑暗钥匙碎片","燃烧钥匙碎片",
              "Blue Key Fragment","Green Key Fragment","Purple Key Fragment","White Key Fragment","Orange Key Fragment","Brown Key Fragment","Stone Key Fragment","Dark Key Fragment","Burning Key Fragment"],
    };
    function decompressInitClientData(compressedData) {
        try {
            // 使用lz-string库解压UTF16格式数据
            const decompressedJson = LZString.decompressFromUTF16(compressedData);
            if (!decompressedJson) {
                throw new Error("解压失败，数据可能为空或损坏");
            }

            // 解析为JSON对象
            return JSON.parse(decompressedJson);
        } catch (error) {
            console.error("还原initClientData时出错：", error);
            return null;
        }
    }

    function calculateCost(){
        let result = "-";
        const inputTime = document.getElementById('inputSimulationTime');
        //总模拟时长
        const simTime = Number(inputTime.value);

        //每小时消耗品数量
        const consumablesUsedList = getConsumablesUsed();
        console.log(consumablesUsedList);
        //消耗品制作耗时 min
        const consumablesUsedCost=getConsumablesUsedCost(consumablesUsedList);

        const drop = getDropsData();
        console.log('drops:', getDropsData());
        if(drop.length>0){
            //总碎片掉落
            const dropFragmentNumber=drop[0].numericValue;
            result=(60+consumablesUsedCost)*simTime/dropFragmentNumber;
            result=result.toFixed(2);
        }else{
            result="-"
        }
        const realProfitDiv = document.getElementById('realCostDisplay');
        realProfitDiv.setAttribute("i18n-data", `: ${result}`);
        applyi18n();
    }

    function getConsumablesUsedCost(consumablesUsedList){
        let totalCost = 0;
        consumablesUsedList.forEach(item => {
            const SingelCost=getSingelMaterialsCost(item.englishName,item.quantity,false);
            console.log(`制作${item.name}耗时：${SingelCost.toFixed(2)}分钟`)
            totalCost += SingelCost;
        });
        return totalCost;
    }

    //单位min
    function getSingelMaterialsCost(material,quantity,teaLoop=false){
        if(material.includes('Tea Leaf')||material.includes('Crushed')||material.includes('Essence')) return 0;
        //console.log("当前计算材料：",material);
        //console.log("当前计算数量：",quantity);
        let costTime=0;
        let itemName=material;
        //是否烧饭
        const isProduction =
                initData_actionDetailMap[getActionHridFromItemName(itemName)].inputItems &&
                initData_actionDetailMap[getActionHridFromItemName(itemName)].inputItems.length > 0;

        const actionHrid = getActionHridFromItemName(itemName);
        // 茶效率
        const teaBuffs = getTeaBuffsByActionHrid(actionHrid);
        // 原料信息
        let inputItems = [];
        let totalResourcesPerAction = 0;

        if (isProduction) {
            inputItems = JSON.parse(JSON.stringify(initData_actionDetailMap[actionHrid].inputItems));
            for (const item of inputItems) {
                totalResourcesPerAction += getSingelMaterialsCost(initData_itemDetailMap[item.itemHrid].name,item.count,teaLoop);
            }
            // 茶减少原料消耗
            const lessResourceBuff = teaBuffs.lessResource;
            totalResourcesPerAction *= 1 - lessResourceBuff / 100;
        }

        // 消耗饮料
        let drinksConsumedPerHourCost = 0;
        const drinksList = initData_actionTypeDrinkSlotsMap[initData_actionDetailMap[actionHrid].type];
        for (const drink of drinksList) {
            if (!drink || !drink.itemHrid) {
                continue;
            }
            if(!teaLoop)drinksConsumedPerHourCost += getSingelMaterialsCost(initData_itemDetailMap[drink.itemHrid].name,12,true);
        }

        // 每小时动作数（包含工具缩减动作时间）
        const baseTimePerActionSec = initData_actionDetailMap[actionHrid].baseTimeCost / 1000000000;
        const toolPercent = getToolsSpeedBuffByActionHrid(actionHrid);
        const actualTimePerActionSec = baseTimePerActionSec / (1 + toolPercent / 100);

        let actionPerHour = 3600 / actualTimePerActionSec;

        // 每小时产品数
        let droprate = null;
        if (isProduction) {
            droprate = initData_actionDetailMap[actionHrid].outputItems[0].count;
        } else {
            droprate =
                (initData_actionDetailMap[actionHrid].dropTable[0].minCount + initData_actionDetailMap[actionHrid].dropTable[0].maxCount) / 2;
        }
        let itemPerHour = actionPerHour * droprate;

        // 等级碾压提高效率（人物等级不及最低要求等级时，按最低要求等级计算）
        const requiredLevel = initData_actionDetailMap[actionHrid].levelRequirement.level;
        let currentLevel = requiredLevel;
        for (const skill of initData_characterSkills) {
            if (skill.skillHrid === initData_actionDetailMap[actionHrid].levelRequirement.skillHrid) {
                currentLevel = skill.level;
                break;
            }
        }
        const levelEffBuff = currentLevel - requiredLevel > 0 ? currentLevel - requiredLevel : 0;
        // 房子效率
        const houseEffBuff = getHousesEffBuffByActionHrid(actionHrid);
        // 特殊装备效率
        const itemEffiBuff = config.itemEffiBuff;
        // 总效率影响动作数/生产物品数
        actionPerHour *= 1 + (levelEffBuff + houseEffBuff + teaBuffs.efficiency + itemEffiBuff + config.ProductionEfficiencyBuff) / 100;
        itemPerHour *= 1 + (levelEffBuff + houseEffBuff + teaBuffs.efficiency + itemEffiBuff + config.ProductionEfficiencyBuff) / 100;
        let extraFreeItemPerHour=0
        if (isProduction){
            // 茶额外产品数量（不消耗原料）
            extraFreeItemPerHour = (itemPerHour * teaBuffs.quantity) / 100;
        }else{
            // 茶额外产品数量+社区buff
            extraFreeItemPerHour = (itemPerHour * (teaBuffs.quantity+config.GatheringQuantityBuff) ) / 100;
        }
        costTime=quantity*60.0/(itemPerHour+extraFreeItemPerHour)+drinksConsumedPerHourCost;
        //console.log("当前计算材料：",material);
        //console.log("当前计算数量：",quantity);
        //console.log("当前计算耗时：",costTime);
        return costTime;
    }
    const actionHridToHouseNamesMap = {
        "/action_types/brewing": "/house_rooms/brewery",
        "/action_types/cheesesmithing": "/house_rooms/forge",
        "/action_types/cooking": "/house_rooms/kitchen",
        "/action_types/crafting": "/house_rooms/workshop",
        "/action_types/foraging": "/house_rooms/garden",
        "/action_types/milking": "/house_rooms/dairy_barn",
        "/action_types/tailoring": "/house_rooms/sewing_parlor",
        "/action_types/woodcutting": "/house_rooms/log_shed",
        "/action_types/alchemy": "/house_rooms/laboratory",
    };
    function getHousesEffBuffByActionHrid(actionHrid) {
        const houseName = actionHridToHouseNamesMap[initData_actionDetailMap[actionHrid].type];
        if (!houseName) {
            return 0;
        }
        const house = initData_characterHouseRoomMap[houseName];
        if (!house) {
            return 0;
        }
        return house.level * 1.5;
    }
    const actionHridToToolsSpeedBuffNamesMap = {
        "/action_types/brewing": "brewingSpeed",
        "/action_types/cheesesmithing": "cheesesmithingSpeed",
        "/action_types/cooking": "cookingSpeed",
        "/action_types/crafting": "craftingSpeed",
        "/action_types/foraging": "foragingSpeed",
        "/action_types/milking": "milkingSpeed",
        "/action_types/tailoring": "tailoringSpeed",
        "/action_types/woodcutting": "woodcuttingSpeed",
        "/action_types/alchemy": "alchemySpeed",
    };
    const itemEnhanceLevelToBuffBonusMap = {
        0: 0,
        1: 2,
        2: 4.2,
        3: 6.6,
        4: 9.2,
        5: 12.0,
        6: 15.0,
        7: 18.2,
        8: 21.6,
        9: 25.2,
        10: 29.0,
        11: 33.0,
        12: 37.2,
        13: 41.6,
        14: 46.2,
        15: 51.0,
        16: 56.0,
        17: 61.2,
        18: 66.6,
        19: 72.2,
        20: 78.0,
    };
    function getToolsSpeedBuffByActionHrid(actionHrid) {
        let totalBuff = 0;
        for (const item of initData_characterItems) {
            if (item.itemLocationHrid.includes("_tool")) {
                const buffName = actionHridToToolsSpeedBuffNamesMap[initData_actionDetailMap[actionHrid].type];
                const enhanceBonus = 1 + itemEnhanceLevelToBuffBonusMap[item.enhancementLevel] / 100;
                const buff = initData_itemDetailMap[item.itemHrid].equipmentDetail.noncombatStats[buffName] || 0;
                totalBuff += buff * enhanceBonus;
            }
        }
        return Number(totalBuff * 100).toFixed(1);
    }
    function getTeaBuffsByActionHrid(actionHrid) {
        const teaBuffs = {
            efficiency: 0, // Efficiency tea, specific teas, -Artisan tea.
            quantity: 0, // Gathering tea, Gourmet tea.
            lessResource: 0, // Artisan tea.
            extraExp: 0, // Wisdom tea. Not used.
            upgradedProduct: 0, // Processing tea. Not used.
        };

        const actionTypeId = initData_actionDetailMap[actionHrid].type;
        const teaList = initData_actionTypeDrinkSlotsMap[actionTypeId];
        for (const tea of teaList) {
            if (!tea || !tea.itemHrid) {
                continue;
            }

            for (const buff of initData_itemDetailMap[tea.itemHrid].consumableDetail.buffs) {
                if (buff.typeHrid === "/buff_types/artisan") {
                    teaBuffs.lessResource += buff.flatBoost * 100;
                } else if (buff.typeHrid === "/buff_types/action_level") {
                    teaBuffs.efficiency -= buff.flatBoost;
                } else if (buff.typeHrid === "/buff_types/gathering") {
                    teaBuffs.quantity += buff.flatBoost * 100;
                } else if (buff.typeHrid === "/buff_types/gourmet") {
                    teaBuffs.quantity += buff.flatBoost * 100;
                } else if (buff.typeHrid === "/buff_types/wisdom") {
                    teaBuffs.extraExp += buff.flatBoost * 100;
                } else if (buff.typeHrid === "/buff_types/processing") {
                    teaBuffs.upgradedProduct += buff.flatBoost * 100;
                } else if (buff.typeHrid === "/buff_types/efficiency") {
                    teaBuffs.efficiency += buff.flatBoost * 100;
                } else if (buff.typeHrid === `/buff_types/${actionTypeId.replace("/action_types/", "")}_level`) {
                    teaBuffs.efficiency += buff.flatBoost;
                }
            }
        }

        return teaBuffs;
    }


    const ConsumablesTranslations = {
        "itemNames./items/donut": "Donut",
        "itemNames./items/blueberry_donut": "Blueberry Donut",
        "itemNames./items/blackberry_donut": "Blackberry Donut",
        "itemNames./items/strawberry_donut": "Strawberry Donut",
        "itemNames./items/mooberry_donut": "Mooberry Donut",
        "itemNames./items/marsberry_donut": "Marsberry Donut",
        "itemNames./items/spaceberry_donut": "Spaceberry Donut",
        "itemNames./items/cupcake": "Cupcake",
        "itemNames./items/blueberry_cake": "Blueberry Cake",
        "itemNames./items/blackberry_cake": "Blackberry Cake",
        "itemNames./items/strawberry_cake": "Strawberry Cake",
        "itemNames./items/mooberry_cake": "Mooberry Cake",
        "itemNames./items/marsberry_cake": "Marsberry Cake",
        "itemNames./items/spaceberry_cake": "Spaceberry Cake",
        "itemNames./items/gummy": "Gummy",
        "itemNames./items/apple_gummy": "Apple Gummy",
        "itemNames./items/orange_gummy": "Orange Gummy",
        "itemNames./items/plum_gummy": "Plum Gummy",
        "itemNames./items/peach_gummy": "Peach Gummy",
        "itemNames./items/dragon_fruit_gummy": "Dragon Fruit Gummy",
        "itemNames./items/star_fruit_gummy": "Star Fruit Gummy",
        "itemNames./items/yogurt": "Yogurt",
        "itemNames./items/apple_yogurt": "Apple Yogurt",
        "itemNames./items/orange_yogurt": "Orange Yogurt",
        "itemNames./items/plum_yogurt": "Plum Yogurt",
        "itemNames./items/peach_yogurt": "Peach Yogurt",
        "itemNames./items/dragon_fruit_yogurt": "Dragon Fruit Yogurt",
        "itemNames./items/star_fruit_yogurt": "Star Fruit Yogurt",

        "itemNames./items/stamina_coffee": "Stamina Coffee",
        "itemNames./items/intelligence_coffee": "Intelligence Coffee",
        "itemNames./items/defense_coffee": "Defense Coffee",
        "itemNames./items/attack_coffee": "Attack Coffee",
        "itemNames./items/melee_coffee": "Melee Coffee",
        "itemNames./items/ranged_coffee": "Ranged Coffee",
        "itemNames./items/magic_coffee": "Magic Coffee",
        "itemNames./items/super_stamina_coffee": "Super Stamina Coffee",
        "itemNames./items/super_intelligence_coffee": "Super Intelligence Coffee",
        "itemNames./items/super_defense_coffee": "Super Defense Coffee",
        "itemNames./items/super_attack_coffee": "Super Attack Coffee",
        "itemNames./items/super_melee_coffee": "Super Melee Coffee",
        "itemNames./items/super_ranged_coffee": "Super Ranged Coffee",
        "itemNames./items/super_magic_coffee": "Super Magic Coffee",
        "itemNames./items/ultra_stamina_coffee": "Ultra Stamina Coffee",
        "itemNames./items/ultra_intelligence_coffee": "Ultra Intelligence Coffee",
        "itemNames./items/ultra_defense_coffee": "Ultra Defense Coffee",
        "itemNames./items/ultra_attack_coffee": "Ultra Attack Coffee",
        "itemNames./items/ultra_melee_coffee": "Ultra Melee Coffee",
        "itemNames./items/ultra_ranged_coffee": "Ultra Ranged Coffee",
        "itemNames./items/ultra_magic_coffee": "Ultra Magic Coffee",
        "itemNames./items/wisdom_coffee": "Wisdom Coffee",
        "itemNames./items/lucky_coffee": "Lucky Coffee",
        "itemNames./items/swiftness_coffee": "Swiftness Coffee",
        "itemNames./items/channeling_coffee": "Channeling Coffee",
        "itemNames./items/critical_coffee": "Critical Coffee"
    }
    function getConsumablesEnglishNames(items) {
        return items.map(item => {
            const englishName = ConsumablesTranslations[item.i18nKey] || item.displayName;
            return {
                ...item,
                englishName: englishName
            };
        });
    }

    function getConsumablesUsed(){
        const container = document.getElementById('simulationResultConsumablesUsed');
        const rows = container.querySelectorAll('.row');
        const materials = [];
        rows.forEach(row => {
            const nameElement = row.querySelector('.col-md-6:first-child');
            const quantityElement = row.querySelector('.col-md-6:last-child');
            const name = nameElement.textContent.trim();
            const quantity = parseInt(quantityElement.textContent.trim(), 10);
            const i18nKey = nameElement.getAttribute('data-i18n');
            materials.push({
                i18nKey: i18nKey,
                name: name,
                quantity: quantity
            });

        });
        return getConsumablesEnglishNames(materials);
    }

    function getDropsData() {
        const drops = Array.from(document.querySelectorAll('#noRngDrops .row')).map(row => {
            const name = row.querySelector('.col-md-6:first-child').textContent.trim();
            const value = row.querySelector('.col-md-6:last-child').textContent.trim();
            return {
                name: name,
                rawValue: value,
                numericValue: parseFloat(value.replace(/,/g, '')) || 0
            };
        });
        const filteredData = drops.filter(item => {
            return FragmentList.includes(item.name);
        });
        return filteredData;
    }

    const i18nText = {
        "en": {
            "i18n-realCostTitle": "Real No RNG Fragment Cost",
            "i18n-realCostUnit": " mins/fragment",
        },
        "zh": {
            "i18n-realCostTitle": "实际碎片期望",
            "i18n-realCostUnit": " 分钟/片",
        }
    }
    function addi18nListener() {
        setTimeout(() => {
            const i18nBtnList = document.querySelector("body > div.language-switcher").children;
            i18nBtnList[0].addEventListener("click", () => {
                language = "en";
                applyi18n();
            });
            i18nBtnList[1].addEventListener("click", () => {
                language = "zh";
                applyi18n();
            });
        }, 1000);
    }
    function applyi18n() {
        const i18nElements = document.querySelectorAll("[i18n-id]");
        i18nElements.forEach(element => {
            const i18nId = element.getAttribute("i18n-id");
            let text = "";
            if (i18nText[language] && i18nText[language][i18nId]) {
                text = i18nText[language][i18nId];
            } else {
                console.warn(`Missing translation for ${i18nId} in language ${language}`);
            }
            if (element.getAttribute("i18n-data")) {
                text += element.getAttribute("i18n-data");
            }
            if (element.getAttribute("i18n-data-unit")) {
                text += i18nText[language][element.getAttribute("i18n-data-unit")];
            }
            element.textContent = text;
        });
    }
    function addRealCostBlock() {
        const realProfitDiv = document.createElement('div');
        realProfitDiv.id = 'realCostDisplay';
        realProfitDiv.style.backgroundColor = '#FFD700';
        realProfitDiv.style.color = 'black';
        realProfitDiv.style.fontWeight = 'bold';
        realProfitDiv.style.padding = '4px';
        realProfitDiv.setAttribute("i18n-id", "i18n-realCostTitle");
        realProfitDiv.setAttribute("i18n-data", ":");
        realProfitDiv.setAttribute("i18n-data-unit", "i18n-realCostUnit");

        const targetDiv = document.getElementById('noRngProfitPreview').parentElement.parentElement;
        targetDiv.parentNode.insertBefore(realProfitDiv, targetDiv.nextSibling);

    }
    function getActionHridFromItemName(name) {
        let newName = name.replace("Milk", "Cow");
        newName = newName.replace("Log", "Tree");
        newName = newName.replace("Cowing", "Milking");
        newName = newName.replace("Rainbow Cow", "Unicow");
        newName = newName.replace("Collector's Boots", "Collectors Boots");
        newName = newName.replace("Knight's Aegis", "Knights Aegis");
        if (!initData_actionDetailMap) {
            console.error("getActionHridFromItemName no initData_actionDetailMap: " + name);
            return null;
        }
        for (const action of Object.values(initData_actionDetailMap)) {
            if (action.name === newName) {
                return action.hrid;
            }
        }
        return null;
    }

    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = hookedGet;
        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);

        function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }
            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 &&socket.url.indexOf("api.milkywayidlecn.com/ws") <= -1 && socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message }); // Anti-loop

            return handleMessage(message);
        }
    }
    function handleMessage(message) {
        let obj = JSON.parse(message);
        if (obj && obj.type === "init_character_data") {
            GM_setValue("init_character_data", message);
        }
        return message;
    }
    function init() {
        if (document.URL.includes("milkywayidle.com")||document.URL.includes("milkywayidlecn.com")) {
            GM_setValue("init_client_data", JSON.stringify(decompressInitClientData(localStorage.getItem("initClientData"))));
            hookWS();
        }else{
            try{
                const init_client_data = JSON.parse(GM_getValue("init_client_data"));
                console.log("=init_client_data==",init_client_data);
                initData_actionDetailMap = init_client_data.actionDetailMap;
                initData_levelExperienceTable = init_client_data.levelExperienceTable;
                initData_itemDetailMap = init_client_data.itemDetailMap;
                initData_actionCategoryDetailMap = init_client_data.actionCategoryDetailMap;
                initData_abilityDetailMap = init_client_data.abilityDetailMap;
                for (const [key, value] of Object.entries(initData_itemDetailMap)) {
                    itemEnNameToHridMap[value.name] = key;
                }
                const init_character_data = JSON.parse(GM_getValue("init_character_data"));
                console.log("=init_character_data==",init_character_data);
                initData_actionTypeDrinkSlotsMap = init_character_data.actionTypeDrinkSlotsMap;
                initData_characterItems = init_character_data.characterItems;
                initData_characterSkills = init_character_data.characterSkills;
                initData_characterHouseRoomMap = init_character_data.characterHouseRoomMap;

                addi18nListener();
                addRealCostBlock();
                language = localStorage.getItem("i18nextLng") || "en";
                const obConfig = { characterData: true, subtree: true, childList: true };
                const ProfitNode = document.getElementById('noRngProfitPreview');
                new MutationObserver(() => { calculateCost(); }).observe(ProfitNode, obConfig);

            } catch (e) {
                console.warn("先打开游戏获取数据，open the game first");
                return;
            }
        }
    }
    init();
})();