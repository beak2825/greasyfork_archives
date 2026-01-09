// ==UserScript==
// @name         Better Loot Tracker
// @namespace    http://tampermonkey.net/
// @version      1.1.0
// @description  计算并展示掉落记录中强化和炼金行动的部分信息
// @author       PaperCat
// @match        https://www.milkywayidle.com/*
// @match        https://test.milkywayidle.com/*
// @match        https://milkywayidle.com/*
// @match        https://milkywayidlecn.com/*
// @match        https://www.milkywayidlecn.com/*
// @match        https://test.milkywayidlecn.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/mathjs/10.6.4/math.min.js
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/561845/Better%20Loot%20Tracker.user.js
// @updateURL https://update.greasyfork.org/scripts/561845/Better%20Loot%20Tracker.meta.js
// ==/UserScript==

/*
    此插件依赖 MWITools 的市场数据，请确保已安装 MWITools:
    This plugin depends on MWITools for market data. Please install MWITools:
    https://greasyfork.org/en/scripts/494467-mwitools
*/

(function() {
    'use strict';

    const userLanguage = localStorage.getItem('i18nextLng');
    const isZH = userLanguage?.startsWith("zh");

    // ======================
    // 国际化文本
    // ======================
    const i18n = {
        zh: {
            success: '成功',
            failure: '失败',
            target: '目标',
            protectLevel: '保护等级',
            preferredLevels: '偏好等级',
            superEnhanceMinLevel: '超级强化最低起始等级',
            globalSettings: '全局设置',
            alchemyPriceMode: '炼金价格选择',
            alchemyPriceAskBid: '左买右卖',
            alchemyPriceBidAsk: '右买左卖',
            alchemyPriceAskAsk: '左买左卖',
            alchemyPriceBidBid: '右买右卖',
            autoOptimal: '自动(最优)',
            treatAsSuccess: '视为成功',
            material: '材料',
            protection: '保护',
            total: '总消耗',
            superSpend: '强化消耗',
            alchemyCost: '成本',
            alchemyOutput: '产出',
            alchemyProfit: '收益',
            originalCost: '原始成本',
            finalValue: '最终价值',
            profit: '收益',
            aboveExpected: '高于期望',
            belowExpected: '低于期望',
            expected: '期望',
            noMarketData: '市场数据未加载，请确保已安装MWITools'
        },
        en: {
            success: 'Success',
            failure: 'Failure',
            target: 'Target',
            protectLevel: 'Protect Level',
            preferredLevels: 'Preferred Levels',
            superEnhanceMinLevel: 'Super Enhance Min Start',
            globalSettings: 'Global Settings',
            alchemyPriceMode: 'Alchemy Price Mode',
            alchemyPriceAskBid: 'Ask/ Bid',
            alchemyPriceBidAsk: 'Bid/ Ask',
            alchemyPriceAskAsk: 'Ask/ Ask',
            alchemyPriceBidBid: 'Bid/ Bid',
            autoOptimal: 'Auto(Optimal)',
            treatAsSuccess: 'Treat as Success',
            material: 'Material',
            protection: 'Protect',
            total: 'Total',
            superSpend: 'Enhance Spend',
            alchemyCost: 'Cost',
            alchemyOutput: 'Output',
            alchemyProfit: 'Profit',
            originalCost: 'Original Cost',
            finalValue: 'Final Value',
            profit: 'Profit',
            aboveExpected: 'Above expected',
            belowExpected: 'Below expected',
            expected: 'Expected',
            noMarketData: 'Market data not loaded, please ensure MWITools is installed'
        }
    };
    
    const t = isZH ? i18n.zh : i18n.en;
    const DEBUG = {
        init: true,
        calc: false
    };

    const logInit = (...args) => {
        if (DEBUG.init) console.log(...args);
    };

    const logCalc = (...args) => {
        if (DEBUG.calc) console.log(...args);
    };

    const LOOT_LOG_PANEL_SELECTOR = '.LootLogPanel_lootLogPanel__2013X';
    const LOOT_LOG_LIST_SELECTOR = '.LootLogPanel_actionLoots__3oTid';
    const LOOT_LOG_ITEM_SELECTOR = '.LootLogPanel_actionLoot__32gl_';
    const REFRESH_BUTTON_SELECTOR = 'button.Button_button__1Fe9z';

    const PREFERENCE_LEVELS_KEY = 'EnhancementLootTracker_preference_levels';
    const SUPER_ENHANCE_MIN_KEY = 'EnhancementLootTracker_super_min_start_level';
    const ALCHEMY_PRICE_MODE_KEY = 'EnhancementLootTracker_alchemy_price_mode';
    const ALCHEMY_PRICE_MODES = ['ask_bid', 'bid_ask', 'ask_ask', 'bid_bid'];
    let globalPreferenceText = localStorage.getItem(PREFERENCE_LEVELS_KEY) || '';
    let globalSuperEnhanceMinLevel = Number(localStorage.getItem(SUPER_ENHANCE_MIN_KEY));
    let globalAlchemyPriceMode = localStorage.getItem(ALCHEMY_PRICE_MODE_KEY) || 'ask_bid';
    if (!Number.isFinite(globalSuperEnhanceMinLevel) || globalSuperEnhanceMinLevel < 0) {
        globalSuperEnhanceMinLevel = 5;
    }
    if (!ALCHEMY_PRICE_MODES.includes(globalAlchemyPriceMode)) {
        globalAlchemyPriceMode = 'ask_bid';
    }

    function getGlobalPreferenceLevels() {
        return parsePreferenceLevels(globalPreferenceText);
    }

    function setGlobalPreferenceText(text) {
        globalPreferenceText = text || '';
        localStorage.setItem(PREFERENCE_LEVELS_KEY, globalPreferenceText);
    }

    function getSuperEnhanceMinLevel() {
        return globalSuperEnhanceMinLevel;
    }

    function setSuperEnhanceMinLevel(value) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) return;
        const normalized = Math.min(Math.max(Math.round(parsed), 0), 20);
        globalSuperEnhanceMinLevel = normalized;
        localStorage.setItem(SUPER_ENHANCE_MIN_KEY, String(normalized));
    }

    function getAlchemyPriceMode() {
        return globalAlchemyPriceMode;
    }

    function setAlchemyPriceMode(value) {
        if (!ALCHEMY_PRICE_MODES.includes(value)) return;
        globalAlchemyPriceMode = value;
        localStorage.setItem(ALCHEMY_PRICE_MODE_KEY, value);
    }

    function getLootLogContainer() {
        return document.querySelector(LOOT_LOG_LIST_SELECTOR);
    }

    function setupRefreshButtonHook() {
        const panel = document.querySelector(LOOT_LOG_PANEL_SELECTOR);
        if (!panel) return;

        const refreshButton = panel.querySelector(REFRESH_BUTTON_SELECTOR);
        if (!refreshButton || refreshButton.dataset.eltBound === '1') return;

        refreshButton.dataset.eltBound = '1';
        refreshButton.addEventListener('click', () => {
            setTimeout(() => processLootLogs({ force: true }), 0);
        });
    }

    // ======================
    // 数据访问帮助函数
    // ======================

    function decompressInitClientData(compressedData) {
        try {
            const decompressedJson = LZString.decompressFromUTF16(compressedData);
            if (!decompressedJson) {
                throw new Error("decompressInitClientData: decompressFromUTF16() returned null");
            }
            return JSON.parse(decompressedJson);
        } catch (error) {
            console.error("[Better Loot Tracker] decompressInitClientData: ", error);
            return null;
        }
    }

    let _cachedInitClientData = null;

    function getInitClientData() {
        if (_cachedInitClientData) return _cachedInitClientData;
        
        const stored = localStorage.getItem("initClientData");
        if (!stored) return null;
        
        // 解压缩
        const decompressed = decompressInitClientData(stored);
        if (decompressed) {
            _cachedInitClientData = decompressed;
            return decompressed;
        }
        
        return null;
    }

    // 获取市场数据 (来自MWITools)
    function getMarketData() {
        try {
            const marketDataStr = localStorage.getItem('MWITools_marketAPI_json');
            if (marketDataStr) {
                return JSON.parse(marketDataStr);
            }
        } catch (e) {
            console.error('[Better Loot Tracker] Error loading market data:', e);
        }
        return null;
    }

    function getMarketPrice(itemHRID, marketData) {
        if (itemHRID === '/items/coin' || itemHRID === '/items/coins') return 1;
        if (!itemHRID || typeof itemHRID !== 'string') return 0;
        if (!marketData?.marketData) return 0;

        const marketRoot = marketData.marketData[itemHRID];
        if (!marketRoot) return 0;

        const priceObject = marketRoot["0"];
        if (!priceObject) return 0;

        return priceObject.a || priceObject.b || 0;
    }

    function getMarketPriceSide(itemHRID, marketData, side) {
        if (itemHRID === '/items/coin' || itemHRID === '/items/coins') return 1;
        if (!itemHRID || typeof itemHRID !== 'string') return 0;
        if (!marketData?.marketData) return 0;

        const marketRoot = marketData.marketData[itemHRID];
        if (!marketRoot) return 0;

        const priceObject = marketRoot["0"];
        if (!priceObject) return 0;

        if (side === 'bid') return priceObject.b || priceObject.a || 0;
        return priceObject.a || priceObject.b || 0;
    }

    /* 官方汉化 */
    const ZHItemNames = {
        "/items/coin": "金币",
        "/items/task_token": "任务代币",
        "/items/chimerical_token": "奇幻代币",
        "/items/sinister_token": "阴森代币",
        "/items/enchanted_token": "秘法代币",
        "/items/pirate_token": "海盗代币",
        "/items/cowbell": "牛铃",
        "/items/bag_of_10_cowbells": "牛铃袋 (10个)",
        "/items/purples_gift": "小紫牛的礼物",
        "/items/small_meteorite_cache": "小陨石舱",
        "/items/medium_meteorite_cache": "中陨石舱",
        "/items/large_meteorite_cache": "大陨石舱",
        "/items/small_artisans_crate": "小工匠匣",
        "/items/medium_artisans_crate": "中工匠匣",
        "/items/large_artisans_crate": "大工匠匣",
        "/items/small_treasure_chest": "小宝箱",
        "/items/medium_treasure_chest": "中宝箱",
        "/items/large_treasure_chest": "大宝箱",
        "/items/chimerical_chest": "奇幻宝箱",
        "/items/chimerical_refinement_chest": "奇幻精炼宝箱",
        "/items/sinister_chest": "阴森宝箱",
        "/items/sinister_refinement_chest": "阴森精炼宝箱",
        "/items/enchanted_chest": "秘法宝箱",
        "/items/enchanted_refinement_chest": "秘法精炼宝箱",
        "/items/pirate_chest": "海盗宝箱",
        "/items/pirate_refinement_chest": "海盗精炼宝箱",
        "/items/blue_key_fragment": "蓝色钥匙碎片",
        "/items/green_key_fragment": "绿色钥匙碎片",
        "/items/purple_key_fragment": "紫色钥匙碎片",
        "/items/white_key_fragment": "白色钥匙碎片",
        "/items/orange_key_fragment": "橙色钥匙碎片",
        "/items/brown_key_fragment": "棕色钥匙碎片",
        "/items/stone_key_fragment": "石头钥匙碎片",
        "/items/dark_key_fragment": "黑暗钥匙碎片",
        "/items/burning_key_fragment": "燃烧钥匙碎片",
        "/items/chimerical_entry_key": "奇幻钥匙",
        "/items/chimerical_chest_key": "奇幻宝箱钥匙",
        "/items/sinister_entry_key": "阴森钥匙",
        "/items/sinister_chest_key": "阴森宝箱钥匙",
        "/items/enchanted_entry_key": "秘法钥匙",
        "/items/enchanted_chest_key": "秘法宝箱钥匙",
        "/items/pirate_entry_key": "海盗钥匙",
        "/items/pirate_chest_key": "海盗宝箱钥匙",
        "/items/donut": "甜甜圈",
        "/items/blueberry_donut": "蓝莓甜甜圈",
        "/items/blackberry_donut": "黑莓甜甜圈",
        "/items/strawberry_donut": "草莓甜甜圈",
        "/items/mooberry_donut": "哞莓甜甜圈",
        "/items/marsberry_donut": "火星莓甜甜圈",
        "/items/spaceberry_donut": "太空莓甜甜圈",
        "/items/cupcake": "纸杯蛋糕",
        "/items/blueberry_cake": "蓝莓蛋糕",
        "/items/blackberry_cake": "黑莓蛋糕",
        "/items/strawberry_cake": "草莓蛋糕",
        "/items/mooberry_cake": "哞莓蛋糕",
        "/items/marsberry_cake": "火星莓蛋糕",
        "/items/spaceberry_cake": "太空莓蛋糕",
        "/items/gummy": "软糖",
        "/items/apple_gummy": "苹果软糖",
        "/items/orange_gummy": "橙子软糖",
        "/items/plum_gummy": "李子软糖",
        "/items/peach_gummy": "桃子软糖",
        "/items/dragon_fruit_gummy": "火龙果软糖",
        "/items/star_fruit_gummy": "杨桃软糖",
        "/items/yogurt": "酸奶",
        "/items/apple_yogurt": "苹果酸奶",
        "/items/orange_yogurt": "橙子酸奶",
        "/items/plum_yogurt": "李子酸奶",
        "/items/peach_yogurt": "桃子酸奶",
        "/items/dragon_fruit_yogurt": "火龙果酸奶",
        "/items/star_fruit_yogurt": "杨桃酸奶",
        "/items/milking_tea": "挤奶茶",
        "/items/foraging_tea": "采摘茶",
        "/items/woodcutting_tea": "伐木茶",
        "/items/cooking_tea": "烹饪茶",
        "/items/brewing_tea": "冲泡茶",
        "/items/alchemy_tea": "炼金茶",
        "/items/enhancing_tea": "强化茶",
        "/items/cheesesmithing_tea": "奶酪锻造茶",
        "/items/crafting_tea": "制作茶",
        "/items/tailoring_tea": "缝纫茶",
        "/items/super_milking_tea": "超级挤奶茶",
        "/items/super_foraging_tea": "超级采摘茶",
        "/items/super_woodcutting_tea": "超级伐木茶",
        "/items/super_cooking_tea": "超级烹饪茶",
        "/items/super_brewing_tea": "超级冲泡茶",
        "/items/super_alchemy_tea": "超级炼金茶",
        "/items/super_enhancing_tea": "超级强化茶",
        "/items/super_cheesesmithing_tea": "超级奶酪锻造茶",
        "/items/super_crafting_tea": "超级制作茶",
        "/items/super_tailoring_tea": "超级缝纫茶",
        "/items/ultra_milking_tea": "究极挤奶茶",
        "/items/ultra_foraging_tea": "究极采摘茶",
        "/items/ultra_woodcutting_tea": "究极伐木茶",
        "/items/ultra_cooking_tea": "究极烹饪茶",
        "/items/ultra_brewing_tea": "究极冲泡茶",
        "/items/ultra_alchemy_tea": "究极炼金茶",
        "/items/ultra_enhancing_tea": "究极强化茶",
        "/items/ultra_cheesesmithing_tea": "究极奶酪锻造茶",
        "/items/ultra_crafting_tea": "究极制作茶",
        "/items/ultra_tailoring_tea": "究极缝纫茶",
        "/items/gathering_tea": "采集茶",
        "/items/gourmet_tea": "美食茶",
        "/items/wisdom_tea": "经验茶",
        "/items/processing_tea": "加工茶",
        "/items/efficiency_tea": "效率茶",
        "/items/artisan_tea": "工匠茶",
        "/items/catalytic_tea": "催化茶",
        "/items/blessed_tea": "福气茶",
        "/items/stamina_coffee": "耐力咖啡",
        "/items/intelligence_coffee": "智力咖啡",
        "/items/defense_coffee": "防御咖啡",
        "/items/attack_coffee": "攻击咖啡",
        "/items/melee_coffee": "近战咖啡",
        "/items/ranged_coffee": "远程咖啡",
        "/items/magic_coffee": "魔法咖啡",
        "/items/super_stamina_coffee": "超级耐力咖啡",
        "/items/super_intelligence_coffee": "超级智力咖啡",
        "/items/super_defense_coffee": "超级防御咖啡",
        "/items/super_attack_coffee": "超级攻击咖啡",
        "/items/super_melee_coffee": "超级近战咖啡",
        "/items/super_ranged_coffee": "超级远程咖啡",
        "/items/super_magic_coffee": "超级魔法咖啡",
        "/items/ultra_stamina_coffee": "究极耐力咖啡",
        "/items/ultra_intelligence_coffee": "究极智力咖啡",
        "/items/ultra_defense_coffee": "究极防御咖啡",
        "/items/ultra_attack_coffee": "究极攻击咖啡",
        "/items/ultra_melee_coffee": "究极近战咖啡",
        "/items/ultra_ranged_coffee": "究极远程咖啡",
        "/items/ultra_magic_coffee": "究极魔法咖啡",
        "/items/wisdom_coffee": "经验咖啡",
        "/items/lucky_coffee": "幸运咖啡",
        "/items/swiftness_coffee": "迅捷咖啡",
        "/items/channeling_coffee": "吟唱咖啡",
        "/items/critical_coffee": "暴击咖啡",
        "/items/poke": "破胆之刺",
        "/items/impale": "透骨之刺",
        "/items/puncture": "破甲之刺",
        "/items/penetrating_strike": "贯心之刺",
        "/items/scratch": "爪影斩",
        "/items/cleave": "分裂斩",
        "/items/maim": "血刃斩",
        "/items/crippling_slash": "致残斩",
        "/items/smack": "重碾",
        "/items/sweep": "重扫",
        "/items/stunning_blow": "重锤",
        "/items/fracturing_impact": "碎裂冲击",
        "/items/shield_bash": "盾击",
        "/items/quick_shot": "快速射击",
        "/items/aqua_arrow": "流水箭",
        "/items/flame_arrow": "烈焰箭",
        "/items/rain_of_arrows": "箭雨",
        "/items/silencing_shot": "沉默之箭",
        "/items/steady_shot": "稳定射击",
        "/items/pestilent_shot": "疫病射击",
        "/items/penetrating_shot": "贯穿射击",
        "/items/water_strike": "流水冲击",
        "/items/ice_spear": "冰枪术",
        "/items/frost_surge": "冰霜爆裂",
        "/items/mana_spring": "法力喷泉",
        "/items/entangle": "缠绕",
        "/items/toxic_pollen": "剧毒粉尘",
        "/items/natures_veil": "自然菌幕",
        "/items/life_drain": "生命吸取",
        "/items/fireball": "火球",
        "/items/flame_blast": "熔岩爆裂",
        "/items/firestorm": "火焰风暴",
        "/items/smoke_burst": "烟爆灭影",
        "/items/minor_heal": "初级自愈术",
        "/items/heal": "自愈术",
        "/items/quick_aid": "快速治疗术",
        "/items/rejuvenate": "群体治疗术",
        "/items/taunt": "嘲讽",
        "/items/provoke": "挑衅",
        "/items/toughness": "坚韧",
        "/items/elusiveness": "闪避",
        "/items/precision": "精确",
        "/items/berserk": "狂暴",
        "/items/elemental_affinity": "元素增幅",
        "/items/frenzy": "狂速",
        "/items/spike_shell": "尖刺防护",
        "/items/retribution": "惩戒",
        "/items/vampirism": "吸血",
        "/items/revive": "复活",
        "/items/insanity": "疯狂",
        "/items/invincible": "无敌",
        "/items/speed_aura": "速度光环",
        "/items/guardian_aura": "守护光环",
        "/items/fierce_aura": "物理光环",
        "/items/critical_aura": "暴击光环",
        "/items/mystic_aura": "元素光环",
        "/items/gobo_stabber": "哥布林长剑",
        "/items/gobo_slasher": "哥布林关刀",
        "/items/gobo_smasher": "哥布林狼牙棒",
        "/items/spiked_bulwark": "尖刺重盾",
        "/items/werewolf_slasher": "狼人关刀",
        "/items/griffin_bulwark": "狮鹫重盾",
        "/items/griffin_bulwark_refined": "狮鹫重盾（精）",
        "/items/gobo_shooter": "哥布林弹弓",
        "/items/vampiric_bow": "吸血弓",
        "/items/cursed_bow": "咒怨之弓",
        "/items/cursed_bow_refined": "咒怨之弓（精）",
        "/items/gobo_boomstick": "哥布林火棍",
        "/items/cheese_bulwark": "奶酪重盾",
        "/items/verdant_bulwark": "翠绿重盾",
        "/items/azure_bulwark": "蔚蓝重盾",
        "/items/burble_bulwark": "深紫重盾",
        "/items/crimson_bulwark": "绛红重盾",
        "/items/rainbow_bulwark": "彩虹重盾",
        "/items/holy_bulwark": "神圣重盾",
        "/items/wooden_bow": "木弓",
        "/items/birch_bow": "桦木弓",
        "/items/cedar_bow": "雪松弓",
        "/items/purpleheart_bow": "紫心弓",
        "/items/ginkgo_bow": "银杏弓",
        "/items/redwood_bow": "红杉弓",
        "/items/arcane_bow": "神秘弓",
        "/items/stalactite_spear": "石钟长枪",
        "/items/granite_bludgeon": "花岗岩大棒",
        "/items/furious_spear": "狂怒长枪",
        "/items/furious_spear_refined": "狂怒长枪（精）",
        "/items/regal_sword": "君王之剑",
        "/items/regal_sword_refined": "君王之剑（精）",
        "/items/chaotic_flail": "混沌连枷",
        "/items/chaotic_flail_refined": "混沌连枷（精）",
        "/items/soul_hunter_crossbow": "灵魂猎手弩",
        "/items/sundering_crossbow": "裂空之弩",
        "/items/sundering_crossbow_refined": "裂空之弩（精）",
        "/items/frost_staff": "冰霜法杖",
        "/items/infernal_battlestaff": "炼狱法杖",
        "/items/jackalope_staff": "鹿角兔之杖",
        "/items/rippling_trident": "涟漪三叉戟",
        "/items/rippling_trident_refined": "涟漪三叉戟（精）",
        "/items/blooming_trident": "绽放三叉戟",
        "/items/blooming_trident_refined": "绽放三叉戟（精）",
        "/items/blazing_trident": "炽焰三叉戟",
        "/items/blazing_trident_refined": "炽焰三叉戟（精）",
        "/items/cheese_sword": "奶酪剑",
        "/items/verdant_sword": "翠绿剑",
        "/items/azure_sword": "蔚蓝剑",
        "/items/burble_sword": "深紫剑",
        "/items/crimson_sword": "绛红剑",
        "/items/rainbow_sword": "彩虹剑",
        "/items/holy_sword": "神圣剑",
        "/items/cheese_spear": "奶酪长枪",
        "/items/verdant_spear": "翠绿长枪",
        "/items/azure_spear": "蔚蓝长枪",
        "/items/burble_spear": "深紫长枪",
        "/items/crimson_spear": "绛红长枪",
        "/items/rainbow_spear": "彩虹长枪",
        "/items/holy_spear": "神圣长枪",
        "/items/cheese_mace": "奶酪钉头锤",
        "/items/verdant_mace": "翠绿钉头锤",
        "/items/azure_mace": "蔚蓝钉头锤",
        "/items/burble_mace": "深紫钉头锤",
        "/items/crimson_mace": "绛红钉头锤",
        "/items/rainbow_mace": "彩虹钉头锤",
        "/items/holy_mace": "神圣钉头锤",
        "/items/wooden_crossbow": "木弩",
        "/items/birch_crossbow": "桦木弩",
        "/items/cedar_crossbow": "雪松弩",
        "/items/purpleheart_crossbow": "紫心弩",
        "/items/ginkgo_crossbow": "银杏弩",
        "/items/redwood_crossbow": "红杉弩",
        "/items/arcane_crossbow": "神秘弩",
        "/items/wooden_water_staff": "木制水法杖",
        "/items/birch_water_staff": "桦木水法杖",
        "/items/cedar_water_staff": "雪松水法杖",
        "/items/purpleheart_water_staff": "紫心水法杖",
        "/items/ginkgo_water_staff": "银杏水法杖",
        "/items/redwood_water_staff": "红杉水法杖",
        "/items/arcane_water_staff": "神秘水法杖",
        "/items/wooden_nature_staff": "木制自然法杖",
        "/items/birch_nature_staff": "桦木自然法杖",
        "/items/cedar_nature_staff": "雪松自然法杖",
        "/items/purpleheart_nature_staff": "紫心自然法杖",
        "/items/ginkgo_nature_staff": "银杏自然法杖",
        "/items/redwood_nature_staff": "红杉自然法杖",
        "/items/arcane_nature_staff": "神秘自然法杖",
        "/items/wooden_fire_staff": "木制火法杖",
        "/items/birch_fire_staff": "桦木火法杖",
        "/items/cedar_fire_staff": "雪松火法杖",
        "/items/purpleheart_fire_staff": "紫心火法杖",
        "/items/ginkgo_fire_staff": "银杏火法杖",
        "/items/redwood_fire_staff": "红杉火法杖",
        "/items/arcane_fire_staff": "神秘火法杖",
        "/items/eye_watch": "掌上监工",
        "/items/snake_fang_dirk": "蛇牙短剑",
        "/items/vision_shield": "视觉盾",
        "/items/gobo_defender": "哥布林防御者",
        "/items/vampire_fang_dirk": "吸血鬼短剑",
        "/items/knights_aegis": "骑士盾",
        "/items/knights_aegis_refined": "骑士盾（精）",
        "/items/treant_shield": "树人盾",
        "/items/manticore_shield": "蝎狮盾",
        "/items/tome_of_healing": "治疗之书",
        "/items/tome_of_the_elements": "元素之书",
        "/items/watchful_relic": "警戒遗物",
        "/items/bishops_codex": "主教法典",
        "/items/bishops_codex_refined": "主教法典（精）",
        "/items/cheese_buckler": "奶酪圆盾",
        "/items/verdant_buckler": "翠绿圆盾",
        "/items/azure_buckler": "蔚蓝圆盾",
        "/items/burble_buckler": "深紫圆盾",
        "/items/crimson_buckler": "绛红圆盾",
        "/items/rainbow_buckler": "彩虹圆盾",
        "/items/holy_buckler": "神圣圆盾",
        "/items/wooden_shield": "木盾",
        "/items/birch_shield": "桦木盾",
        "/items/cedar_shield": "雪松盾",
        "/items/purpleheart_shield": "紫心盾",
        "/items/ginkgo_shield": "银杏盾",
        "/items/redwood_shield": "红杉盾",
        "/items/arcane_shield": "神秘盾",
        "/items/sinister_cape": "阴森斗篷",
        "/items/sinister_cape_refined": "阴森斗篷（精）",
        "/items/chimerical_quiver": "奇幻箭袋",
        "/items/chimerical_quiver_refined": "奇幻箭袋（精）",
        "/items/enchanted_cloak": "秘法披风",
        "/items/enchanted_cloak_refined": "秘法披风（精）",
        "/items/red_culinary_hat": "红色厨师帽",
        "/items/snail_shell_helmet": "蜗牛壳头盔",
        "/items/vision_helmet": "视觉头盔",
        "/items/fluffy_red_hat": "蓬松红帽子",
        "/items/corsair_helmet": "掠夺者头盔",
        "/items/corsair_helmet_refined": "掠夺者头盔（精）",
        "/items/acrobatic_hood": "杂技师兜帽",
        "/items/acrobatic_hood_refined": "杂技师兜帽（精）",
        "/items/magicians_hat": "魔术师帽",
        "/items/magicians_hat_refined": "魔术师帽（精）",
        "/items/cheese_helmet": "奶酪头盔",
        "/items/verdant_helmet": "翠绿头盔",
        "/items/azure_helmet": "蔚蓝头盔",
        "/items/burble_helmet": "深紫头盔",
        "/items/crimson_helmet": "绛红头盔",
        "/items/rainbow_helmet": "彩虹头盔",
        "/items/holy_helmet": "神圣头盔",
        "/items/rough_hood": "粗糙兜帽",
        "/items/reptile_hood": "爬行动物兜帽",
        "/items/gobo_hood": "哥布林兜帽",
        "/items/beast_hood": "野兽兜帽",
        "/items/umbral_hood": "暗影兜帽",
        "/items/cotton_hat": "棉帽",
        "/items/linen_hat": "亚麻帽",
        "/items/bamboo_hat": "竹帽",
        "/items/silk_hat": "丝帽",
        "/items/radiant_hat": "光辉帽",
        "/items/dairyhands_top": "挤奶工上衣",
        "/items/foragers_top": "采摘者上衣",
        "/items/lumberjacks_top": "伐木工上衣",
        "/items/cheesemakers_top": "奶酪师上衣",
        "/items/crafters_top": "工匠上衣",
        "/items/tailors_top": "裁缝上衣",
        "/items/chefs_top": "厨师上衣",
        "/items/brewers_top": "饮品师上衣",
        "/items/alchemists_top": "炼金师上衣",
        "/items/enhancers_top": "强化师上衣",
        "/items/gator_vest": "鳄鱼马甲",
        "/items/turtle_shell_body": "龟壳胸甲",
        "/items/colossus_plate_body": "巨像胸甲",
        "/items/demonic_plate_body": "恶魔胸甲",
        "/items/anchorbound_plate_body": "锚定胸甲",
        "/items/anchorbound_plate_body_refined": "锚定胸甲（精）",
        "/items/maelstrom_plate_body": "怒涛胸甲",
        "/items/maelstrom_plate_body_refined": "怒涛胸甲（精）",
        "/items/marine_tunic": "海洋皮衣",
        "/items/revenant_tunic": "亡灵皮衣",
        "/items/griffin_tunic": "狮鹫皮衣",
        "/items/kraken_tunic": "克拉肯皮衣",
        "/items/kraken_tunic_refined": "克拉肯皮衣（精）",
        "/items/icy_robe_top": "冰霜袍服",
        "/items/flaming_robe_top": "烈焰袍服",
        "/items/luna_robe_top": "月神袍服",
        "/items/royal_water_robe_top": "皇家水系袍服",
        "/items/royal_water_robe_top_refined": "皇家水系袍服（精）",
        "/items/royal_nature_robe_top": "皇家自然系袍服",
        "/items/royal_nature_robe_top_refined": "皇家自然系袍服（精）",
        "/items/royal_fire_robe_top": "皇家火系袍服",
        "/items/royal_fire_robe_top_refined": "皇家火系袍服（精）",
        "/items/cheese_plate_body": "奶酪胸甲",
        "/items/verdant_plate_body": "翠绿胸甲",
        "/items/azure_plate_body": "蔚蓝胸甲",
        "/items/burble_plate_body": "深紫胸甲",
        "/items/crimson_plate_body": "绛红胸甲",
        "/items/rainbow_plate_body": "彩虹胸甲",
        "/items/holy_plate_body": "神圣胸甲",
        "/items/rough_tunic": "粗糙皮衣",
        "/items/reptile_tunic": "爬行动物皮衣",
        "/items/gobo_tunic": "哥布林皮衣",
        "/items/beast_tunic": "野兽皮衣",
        "/items/umbral_tunic": "暗影皮衣",
        "/items/cotton_robe_top": "棉袍服",
        "/items/linen_robe_top": "亚麻袍服",
        "/items/bamboo_robe_top": "竹袍服",
        "/items/silk_robe_top": "丝绸袍服",
        "/items/radiant_robe_top": "光辉袍服",
        "/items/dairyhands_bottoms": "挤奶工下装",
        "/items/foragers_bottoms": "采摘者下装",
        "/items/lumberjacks_bottoms": "伐木工下装",
        "/items/cheesemakers_bottoms": "奶酪师下装",
        "/items/crafters_bottoms": "工匠下装",
        "/items/tailors_bottoms": "裁缝下装",
        "/items/chefs_bottoms": "厨师下装",
        "/items/brewers_bottoms": "饮品师下装",
        "/items/alchemists_bottoms": "炼金师下装",
        "/items/enhancers_bottoms": "强化师下装",
        "/items/turtle_shell_legs": "龟壳腿甲",
        "/items/colossus_plate_legs": "巨像腿甲",
        "/items/demonic_plate_legs": "恶魔腿甲",
        "/items/anchorbound_plate_legs": "锚定腿甲",
        "/items/anchorbound_plate_legs_refined": "锚定腿甲（精）",
        "/items/maelstrom_plate_legs": "怒涛腿甲",
        "/items/maelstrom_plate_legs_refined": "怒涛腿甲（精）",
        "/items/marine_chaps": "航海皮裤",
        "/items/revenant_chaps": "亡灵皮裤",
        "/items/griffin_chaps": "狮鹫皮裤",
        "/items/kraken_chaps": "克拉肯皮裤",
        "/items/kraken_chaps_refined": "克拉肯皮裤（精）",
        "/items/icy_robe_bottoms": "冰霜袍裙",
        "/items/flaming_robe_bottoms": "烈焰袍裙",
        "/items/luna_robe_bottoms": "月神袍裙",
        "/items/royal_water_robe_bottoms": "皇家水系袍裙",
        "/items/royal_water_robe_bottoms_refined": "皇家水系袍裙（精）",
        "/items/royal_nature_robe_bottoms": "皇家自然系袍裙",
        "/items/royal_nature_robe_bottoms_refined": "皇家自然系袍裙（精）",
        "/items/royal_fire_robe_bottoms": "皇家火系袍裙",
        "/items/royal_fire_robe_bottoms_refined": "皇家火系袍裙（精）",
        "/items/cheese_plate_legs": "奶酪腿甲",
        "/items/verdant_plate_legs": "翠绿腿甲",
        "/items/azure_plate_legs": "蔚蓝腿甲",
        "/items/burble_plate_legs": "深紫腿甲",
        "/items/crimson_plate_legs": "绛红腿甲",
        "/items/rainbow_plate_legs": "彩虹腿甲",
        "/items/holy_plate_legs": "神圣腿甲",
        "/items/rough_chaps": "粗糙皮裤",
        "/items/reptile_chaps": "爬行动物皮裤",
        "/items/gobo_chaps": "哥布林皮裤",
        "/items/beast_chaps": "野兽皮裤",
        "/items/umbral_chaps": "暗影皮裤",
        "/items/cotton_robe_bottoms": "棉袍裙",
        "/items/linen_robe_bottoms": "亚麻袍裙",
        "/items/bamboo_robe_bottoms": "竹袍裙",
        "/items/silk_robe_bottoms": "丝绸袍裙",
        "/items/radiant_robe_bottoms": "光辉袍裙",
        "/items/enchanted_gloves": "附魔手套",
        "/items/pincer_gloves": "蟹钳手套",
        "/items/panda_gloves": "熊猫手套",
        "/items/magnetic_gloves": "磁力手套",
        "/items/dodocamel_gauntlets": "渡渡驼护手",
        "/items/dodocamel_gauntlets_refined": "渡渡驼护手（精）",
        "/items/sighted_bracers": "瞄准护腕",
        "/items/marksman_bracers": "神射护腕",
        "/items/marksman_bracers_refined": "神射护腕（精）",
        "/items/chrono_gloves": "时空手套",
        "/items/cheese_gauntlets": "奶酪护手",
        "/items/verdant_gauntlets": "翠绿护手",
        "/items/azure_gauntlets": "蔚蓝护手",
        "/items/burble_gauntlets": "深紫护手",
        "/items/crimson_gauntlets": "绛红护手",
        "/items/rainbow_gauntlets": "彩虹护手",
        "/items/holy_gauntlets": "神圣护手",
        "/items/rough_bracers": "粗糙护腕",
        "/items/reptile_bracers": "爬行动物护腕",
        "/items/gobo_bracers": "哥布林护腕",
        "/items/beast_bracers": "野兽护腕",
        "/items/umbral_bracers": "暗影护腕",
        "/items/cotton_gloves": "棉手套",
        "/items/linen_gloves": "亚麻手套",
        "/items/bamboo_gloves": "竹手套",
        "/items/silk_gloves": "丝手套",
        "/items/radiant_gloves": "光辉手套",
        "/items/collectors_boots": "收藏家靴",
        "/items/shoebill_shoes": "鲸头鹳鞋",
        "/items/black_bear_shoes": "黑熊鞋",
        "/items/grizzly_bear_shoes": "棕熊鞋",
        "/items/polar_bear_shoes": "北极熊鞋",
        "/items/centaur_boots": "半人马靴",
        "/items/sorcerer_boots": "巫师靴",
        "/items/cheese_boots": "奶酪靴",
        "/items/verdant_boots": "翠绿靴",
        "/items/azure_boots": "蔚蓝靴",
        "/items/burble_boots": "深紫靴",
        "/items/crimson_boots": "绛红靴",
        "/items/rainbow_boots": "彩虹靴",
        "/items/holy_boots": "神圣靴",
        "/items/rough_boots": "粗糙靴",
        "/items/reptile_boots": "爬行动物靴",
        "/items/gobo_boots": "哥布林靴",
        "/items/beast_boots": "野兽靴",
        "/items/umbral_boots": "暗影靴",
        "/items/cotton_boots": "棉靴",
        "/items/linen_boots": "亚麻靴",
        "/items/bamboo_boots": "竹靴",
        "/items/silk_boots": "丝靴",
        "/items/radiant_boots": "光辉靴",
        "/items/small_pouch": "小袋子",
        "/items/medium_pouch": "中袋子",
        "/items/large_pouch": "大袋子",
        "/items/giant_pouch": "巨大袋子",
        "/items/gluttonous_pouch": "贪食之袋",
        "/items/guzzling_pouch": "暴饮之囊",
        "/items/necklace_of_efficiency": "效率项链",
        "/items/fighter_necklace": "战士项链",
        "/items/ranger_necklace": "射手项链",
        "/items/wizard_necklace": "巫师项链",
        "/items/necklace_of_wisdom": "经验项链",
        "/items/necklace_of_speed": "速度项链",
        "/items/philosophers_necklace": "贤者项链",
        "/items/earrings_of_gathering": "采集耳环",
        "/items/earrings_of_essence_find": "精华发现耳环",
        "/items/earrings_of_armor": "护甲耳环",
        "/items/earrings_of_regeneration": "恢复耳环",
        "/items/earrings_of_resistance": "抗性耳环",
        "/items/earrings_of_rare_find": "稀有发现耳环",
        "/items/earrings_of_critical_strike": "暴击耳环",
        "/items/philosophers_earrings": "贤者耳环",
        "/items/ring_of_gathering": "采集戒指",
        "/items/ring_of_essence_find": "精华发现戒指",
        "/items/ring_of_armor": "护甲戒指",
        "/items/ring_of_regeneration": "恢复戒指",
        "/items/ring_of_resistance": "抗性戒指",
        "/items/ring_of_rare_find": "稀有发现戒指",
        "/items/ring_of_critical_strike": "暴击戒指",
        "/items/philosophers_ring": "贤者戒指",
        "/items/trainee_milking_charm": "实习挤奶护符",
        "/items/basic_milking_charm": "基础挤奶护符",
        "/items/advanced_milking_charm": "高级挤奶护符",
        "/items/expert_milking_charm": "专家挤奶护符",
        "/items/master_milking_charm": "大师挤奶护符",
        "/items/grandmaster_milking_charm": "宗师挤奶护符",
        "/items/trainee_foraging_charm": "实习采摘护符",
        "/items/basic_foraging_charm": "基础采摘护符",
        "/items/advanced_foraging_charm": "高级采摘护符",
        "/items/expert_foraging_charm": "专家采摘护符",
        "/items/master_foraging_charm": "大师采摘护符",
        "/items/grandmaster_foraging_charm": "宗师采摘护符",
        "/items/trainee_woodcutting_charm": "实习伐木护符",
        "/items/basic_woodcutting_charm": "基础伐木护符",
        "/items/advanced_woodcutting_charm": "高级伐木护符",
        "/items/expert_woodcutting_charm": "专家伐木护符",
        "/items/master_woodcutting_charm": "大师伐木护符",
        "/items/grandmaster_woodcutting_charm": "宗师伐木护符",
        "/items/trainee_cheesesmithing_charm": "实习奶酪锻造护符",
        "/items/basic_cheesesmithing_charm": "基础奶酪锻造护符",
        "/items/advanced_cheesesmithing_charm": "高级奶酪锻造护符",
        "/items/expert_cheesesmithing_charm": "专家奶酪锻造护符",
        "/items/master_cheesesmithing_charm": "大师奶酪锻造护符",
        "/items/grandmaster_cheesesmithing_charm": "宗师奶酪锻造护符",
        "/items/trainee_crafting_charm": "实习制作护符",
        "/items/basic_crafting_charm": "基础制作护符",
        "/items/advanced_crafting_charm": "高级制作护符",
        "/items/expert_crafting_charm": "专家制作护符",
        "/items/master_crafting_charm": "大师制作护符",
        "/items/grandmaster_crafting_charm": "宗师制作护符",
        "/items/trainee_tailoring_charm": "实习缝纫护符",
        "/items/basic_tailoring_charm": "基础缝纫护符",
        "/items/advanced_tailoring_charm": "高级缝纫护符",
        "/items/expert_tailoring_charm": "专家缝纫护符",
        "/items/master_tailoring_charm": "大师缝纫护符",
        "/items/grandmaster_tailoring_charm": "宗师缝纫护符",
        "/items/trainee_cooking_charm": "实习烹饪护符",
        "/items/basic_cooking_charm": "基础烹饪护符",
        "/items/advanced_cooking_charm": "高级烹饪护符",
        "/items/expert_cooking_charm": "专家烹饪护符",
        "/items/master_cooking_charm": "大师烹饪护符",
        "/items/grandmaster_cooking_charm": "宗师烹饪护符",
        "/items/trainee_brewing_charm": "实习冲泡护符",
        "/items/basic_brewing_charm": "基础冲泡护符",
        "/items/advanced_brewing_charm": "高级冲泡护符",
        "/items/expert_brewing_charm": "专家冲泡护符",
        "/items/master_brewing_charm": "大师冲泡护符",
        "/items/grandmaster_brewing_charm": "宗师冲泡护符",
        "/items/trainee_alchemy_charm": "实习炼金护符",
        "/items/basic_alchemy_charm": "基础炼金护符",
        "/items/advanced_alchemy_charm": "高级炼金护符",
        "/items/expert_alchemy_charm": "专家炼金护符",
        "/items/master_alchemy_charm": "大师炼金护符",
        "/items/grandmaster_alchemy_charm": "宗师炼金护符",
        "/items/trainee_enhancing_charm": "实习强化护符",
        "/items/basic_enhancing_charm": "基础强化护符",
        "/items/advanced_enhancing_charm": "高级强化护符",
        "/items/expert_enhancing_charm": "专家强化护符",
        "/items/master_enhancing_charm": "大师强化护符",
        "/items/grandmaster_enhancing_charm": "宗师强化护符",
        "/items/trainee_stamina_charm": "实习耐力护符",
        "/items/basic_stamina_charm": "基础耐力护符",
        "/items/advanced_stamina_charm": "高级耐力护符",
        "/items/expert_stamina_charm": "专家耐力护符",
        "/items/master_stamina_charm": "大师耐力护符",
        "/items/grandmaster_stamina_charm": "宗师耐力护符",
        "/items/trainee_intelligence_charm": "实习智力护符",
        "/items/basic_intelligence_charm": "基础智力护符",
        "/items/advanced_intelligence_charm": "高级智力护符",
        "/items/expert_intelligence_charm": "专家智力护符",
        "/items/master_intelligence_charm": "大师智力护符",
        "/items/grandmaster_intelligence_charm": "宗师智力护符",
        "/items/trainee_attack_charm": "实习攻击护符",
        "/items/basic_attack_charm": "基础攻击护符",
        "/items/advanced_attack_charm": "高级攻击护符",
        "/items/expert_attack_charm": "专家攻击护符",
        "/items/master_attack_charm": "大师攻击护符",
        "/items/grandmaster_attack_charm": "宗师攻击护符",
        "/items/trainee_defense_charm": "实习防御护符",
        "/items/basic_defense_charm": "基础防御护符",
        "/items/advanced_defense_charm": "高级防御护符",
        "/items/expert_defense_charm": "专家防御护符",
        "/items/master_defense_charm": "大师防御护符",
        "/items/grandmaster_defense_charm": "宗师防御护符",
        "/items/trainee_melee_charm": "实习近战护符",
        "/items/basic_melee_charm": "基础近战护符",
        "/items/advanced_melee_charm": "高级近战护符",
        "/items/expert_melee_charm": "专家近战护符",
        "/items/master_melee_charm": "大师近战护符",
        "/items/grandmaster_melee_charm": "宗师近战护符",
        "/items/trainee_ranged_charm": "实习远程护符",
        "/items/basic_ranged_charm": "基础远程护符",
        "/items/advanced_ranged_charm": "高级远程护符",
        "/items/expert_ranged_charm": "专家远程护符",
        "/items/master_ranged_charm": "大师远程护符",
        "/items/grandmaster_ranged_charm": "宗师远程护符",
        "/items/trainee_magic_charm": "实习魔法护符",
        "/items/basic_magic_charm": "基础魔法护符",
        "/items/advanced_magic_charm": "高级魔法护符",
        "/items/expert_magic_charm": "专家魔法护符",
        "/items/master_magic_charm": "大师魔法护符",
        "/items/grandmaster_magic_charm": "宗师魔法护符",
        "/items/basic_task_badge": "基础任务徽章",
        "/items/advanced_task_badge": "高级任务徽章",
        "/items/expert_task_badge": "专家任务徽章",
        "/items/celestial_brush": "星空刷子",
        "/items/cheese_brush": "奶酪刷子",
        "/items/verdant_brush": "翠绿刷子",
        "/items/azure_brush": "蔚蓝刷子",
        "/items/burble_brush": "深紫刷子",
        "/items/crimson_brush": "绛红刷子",
        "/items/rainbow_brush": "彩虹刷子",
        "/items/holy_brush": "神圣刷子",
        "/items/celestial_shears": "星空剪刀",
        "/items/cheese_shears": "奶酪剪刀",
        "/items/verdant_shears": "翠绿剪刀",
        "/items/azure_shears": "蔚蓝剪刀",
        "/items/burble_shears": "深紫剪刀",
        "/items/crimson_shears": "绛红剪刀",
        "/items/rainbow_shears": "彩虹剪刀",
        "/items/holy_shears": "神圣剪刀",
        "/items/celestial_hatchet": "星空斧头",
        "/items/cheese_hatchet": "奶酪斧头",
        "/items/verdant_hatchet": "翠绿斧头",
        "/items/azure_hatchet": "蔚蓝斧头",
        "/items/burble_hatchet": "深紫斧头",
        "/items/crimson_hatchet": "绛红斧头",
        "/items/rainbow_hatchet": "彩虹斧头",
        "/items/holy_hatchet": "神圣斧头",
        "/items/celestial_hammer": "星空锤子",
        "/items/cheese_hammer": "奶酪锤子",
        "/items/verdant_hammer": "翠绿锤子",
        "/items/azure_hammer": "蔚蓝锤子",
        "/items/burble_hammer": "深紫锤子",
        "/items/crimson_hammer": "绛红锤子",
        "/items/rainbow_hammer": "彩虹锤子",
        "/items/holy_hammer": "神圣锤子",
        "/items/celestial_chisel": "星空凿子",
        "/items/cheese_chisel": "奶酪凿子",
        "/items/verdant_chisel": "翠绿凿子",
        "/items/azure_chisel": "蔚蓝凿子",
        "/items/burble_chisel": "深紫凿子",
        "/items/crimson_chisel": "绛红凿子",
        "/items/rainbow_chisel": "彩虹凿子",
        "/items/holy_chisel": "神圣凿子",
        "/items/celestial_needle": "星空针",
        "/items/cheese_needle": "奶酪针",
        "/items/verdant_needle": "翠绿针",
        "/items/azure_needle": "蔚蓝针",
        "/items/burble_needle": "深紫针",
        "/items/crimson_needle": "绛红针",
        "/items/rainbow_needle": "彩虹针",
        "/items/holy_needle": "神圣针",
        "/items/celestial_spatula": "星空锅铲",
        "/items/cheese_spatula": "奶酪锅铲",
        "/items/verdant_spatula": "翠绿锅铲",
        "/items/azure_spatula": "蔚蓝锅铲",
        "/items/burble_spatula": "深紫锅铲",
        "/items/crimson_spatula": "绛红锅铲",
        "/items/rainbow_spatula": "彩虹锅铲",
        "/items/holy_spatula": "神圣锅铲",
        "/items/celestial_pot": "星空壶",
        "/items/cheese_pot": "奶酪壶",
        "/items/verdant_pot": "翠绿壶",
        "/items/azure_pot": "蔚蓝壶",
        "/items/burble_pot": "深紫壶",
        "/items/crimson_pot": "绛红壶",
        "/items/rainbow_pot": "彩虹壶",
        "/items/holy_pot": "神圣壶",
        "/items/celestial_alembic": "星空蒸馏器",
        "/items/cheese_alembic": "奶酪蒸馏器",
        "/items/verdant_alembic": "翠绿蒸馏器",
        "/items/azure_alembic": "蔚蓝蒸馏器",
        "/items/burble_alembic": "深紫蒸馏器",
        "/items/crimson_alembic": "绛红蒸馏器",
        "/items/rainbow_alembic": "彩虹蒸馏器",
        "/items/holy_alembic": "神圣蒸馏器",
        "/items/celestial_enhancer": "星空强化器",
        "/items/cheese_enhancer": "奶酪强化器",
        "/items/verdant_enhancer": "翠绿强化器",
        "/items/azure_enhancer": "蔚蓝强化器",
        "/items/burble_enhancer": "深紫强化器",
        "/items/crimson_enhancer": "绛红强化器",
        "/items/rainbow_enhancer": "彩虹强化器",
        "/items/holy_enhancer": "神圣强化器",
        "/items/milk": "牛奶",
        "/items/verdant_milk": "翠绿牛奶",
        "/items/azure_milk": "蔚蓝牛奶",
        "/items/burble_milk": "深紫牛奶",
        "/items/crimson_milk": "绛红牛奶",
        "/items/rainbow_milk": "彩虹牛奶",
        "/items/holy_milk": "神圣牛奶",
        "/items/cheese": "奶酪",
        "/items/verdant_cheese": "翠绿奶酪",
        "/items/azure_cheese": "蔚蓝奶酪",
        "/items/burble_cheese": "深紫奶酪",
        "/items/crimson_cheese": "绛红奶酪",
        "/items/rainbow_cheese": "彩虹奶酪",
        "/items/holy_cheese": "神圣奶酪",
        "/items/log": "原木",
        "/items/birch_log": "白桦原木",
        "/items/cedar_log": "雪松原木",
        "/items/purpleheart_log": "紫心原木",
        "/items/ginkgo_log": "银杏原木",
        "/items/redwood_log": "红杉原木",
        "/items/arcane_log": "神秘原木",
        "/items/lumber": "木板",
        "/items/birch_lumber": "白桦木板",
        "/items/cedar_lumber": "雪松木板",
        "/items/purpleheart_lumber": "紫心木板",
        "/items/ginkgo_lumber": "银杏木板",
        "/items/redwood_lumber": "红杉木板",
        "/items/arcane_lumber": "神秘木板",
        "/items/rough_hide": "粗糙兽皮",
        "/items/reptile_hide": "爬行动物皮",
        "/items/gobo_hide": "哥布林皮",
        "/items/beast_hide": "野兽皮",
        "/items/umbral_hide": "暗影皮",
        "/items/rough_leather": "粗糙皮革",
        "/items/reptile_leather": "爬行动物皮革",
        "/items/gobo_leather": "哥布林皮革",
        "/items/beast_leather": "野兽皮革",
        "/items/umbral_leather": "暗影皮革",
        "/items/cotton": "棉花",
        "/items/flax": "亚麻",
        "/items/bamboo_branch": "竹子",
        "/items/cocoon": "蚕茧",
        "/items/radiant_fiber": "光辉纤维",
        "/items/cotton_fabric": "棉花布料",
        "/items/linen_fabric": "亚麻布料",
        "/items/bamboo_fabric": "竹子布料",
        "/items/silk_fabric": "丝绸",
        "/items/radiant_fabric": "光辉布料",
        "/items/egg": "鸡蛋",
        "/items/wheat": "小麦",
        "/items/sugar": "糖",
        "/items/blueberry": "蓝莓",
        "/items/blackberry": "黑莓",
        "/items/strawberry": "草莓",
        "/items/mooberry": "哞莓",
        "/items/marsberry": "火星莓",
        "/items/spaceberry": "太空莓",
        "/items/apple": "苹果",
        "/items/orange": "橙子",
        "/items/plum": "李子",
        "/items/peach": "桃子",
        "/items/dragon_fruit": "火龙果",
        "/items/star_fruit": "杨桃",
        "/items/arabica_coffee_bean": "低级咖啡豆",
        "/items/robusta_coffee_bean": "中级咖啡豆",
        "/items/liberica_coffee_bean": "高级咖啡豆",
        "/items/excelsa_coffee_bean": "特级咖啡豆",
        "/items/fieriosa_coffee_bean": "火山咖啡豆",
        "/items/spacia_coffee_bean": "太空咖啡豆",
        "/items/green_tea_leaf": "绿茶叶",
        "/items/black_tea_leaf": "黑茶叶",
        "/items/burble_tea_leaf": "紫茶叶",
        "/items/moolong_tea_leaf": "哞龙茶叶",
        "/items/red_tea_leaf": "红茶叶",
        "/items/emp_tea_leaf": "虚空茶叶",
        "/items/catalyst_of_coinification": "点金催化剂",
        "/items/catalyst_of_decomposition": "分解催化剂",
        "/items/catalyst_of_transmutation": "转化催化剂",
        "/items/prime_catalyst": "至高催化剂",
        "/items/snake_fang": "蛇牙",
        "/items/shoebill_feather": "鲸头鹳羽毛",
        "/items/snail_shell": "蜗牛壳",
        "/items/crab_pincer": "蟹钳",
        "/items/turtle_shell": "乌龟壳",
        "/items/marine_scale": "海洋鳞片",
        "/items/treant_bark": "树皮",
        "/items/centaur_hoof": "半人马蹄",
        "/items/luna_wing": "月神翼",
        "/items/gobo_rag": "哥布林抹布",
        "/items/goggles": "护目镜",
        "/items/magnifying_glass": "放大镜",
        "/items/eye_of_the_watcher": "观察者之眼",
        "/items/icy_cloth": "冰霜织物",
        "/items/flaming_cloth": "烈焰织物",
        "/items/sorcerers_sole": "魔法师鞋底",
        "/items/chrono_sphere": "时空球",
        "/items/frost_sphere": "冰霜球",
        "/items/panda_fluff": "熊猫绒",
        "/items/black_bear_fluff": "黑熊绒",
        "/items/grizzly_bear_fluff": "棕熊绒",
        "/items/polar_bear_fluff": "北极熊绒",
        "/items/red_panda_fluff": "小熊猫绒",
        "/items/magnet": "磁铁",
        "/items/stalactite_shard": "钟乳石碎片",
        "/items/living_granite": "花岗岩",
        "/items/colossus_core": "巨像核心",
        "/items/vampire_fang": "吸血鬼之牙",
        "/items/werewolf_claw": "狼人之爪",
        "/items/revenant_anima": "亡者之魂",
        "/items/soul_fragment": "灵魂碎片",
        "/items/infernal_ember": "地狱余烬",
        "/items/demonic_core": "恶魔核心",
        "/items/griffin_leather": "狮鹫之皮",
        "/items/manticore_sting": "蝎狮之刺",
        "/items/jackalope_antler": "鹿角兔之角",
        "/items/dodocamel_plume": "渡渡驼之翎",
        "/items/griffin_talon": "狮鹫之爪",
        "/items/chimerical_refinement_shard": "奇幻精炼碎片",
        "/items/acrobats_ribbon": "杂技师彩带",
        "/items/magicians_cloth": "魔术师织物",
        "/items/chaotic_chain": "混沌锁链",
        "/items/cursed_ball": "诅咒之球",
        "/items/sinister_refinement_shard": "阴森精炼碎片",
        "/items/royal_cloth": "皇家织物",
        "/items/knights_ingot": "骑士之锭",
        "/items/bishops_scroll": "主教卷轴",
        "/items/regal_jewel": "君王宝石",
        "/items/sundering_jewel": "裂空宝石",
        "/items/enchanted_refinement_shard": "秘法精炼碎片",
        "/items/marksman_brooch": "神射胸针",
        "/items/corsair_crest": "掠夺者徽章",
        "/items/damaged_anchor": "破损船锚",
        "/items/maelstrom_plating": "怒涛甲片",
        "/items/kraken_leather": "克拉肯皮革",
        "/items/kraken_fang": "克拉肯之牙",
        "/items/pirate_refinement_shard": "海盗精炼碎片",
        "/items/butter_of_proficiency": "精通之油",
        "/items/thread_of_expertise": "专精之线",
        "/items/branch_of_insight": "洞察之枝",
        "/items/gluttonous_energy": "贪食能量",
        "/items/guzzling_energy": "暴饮能量",
        "/items/milking_essence": "挤奶精华",
        "/items/foraging_essence": "采摘精华",
        "/items/woodcutting_essence": "伐木精华",
        "/items/cheesesmithing_essence": "奶酪锻造精华",
        "/items/crafting_essence": "制作精华",
        "/items/tailoring_essence": "缝纫精华",
        "/items/cooking_essence": "烹饪精华",
        "/items/brewing_essence": "冲泡精华",
        "/items/alchemy_essence": "炼金精华",
        "/items/enhancing_essence": "强化精华",
        "/items/swamp_essence": "沼泽精华",
        "/items/aqua_essence": "海洋精华",
        "/items/jungle_essence": "丛林精华",
        "/items/gobo_essence": "哥布林精华",
        "/items/eyessence": "眼精华",
        "/items/sorcerer_essence": "法师精华",
        "/items/bear_essence": "熊熊精华",
        "/items/golem_essence": "魔像精华",
        "/items/twilight_essence": "暮光精华",
        "/items/abyssal_essence": "地狱精华",
        "/items/chimerical_essence": "奇幻精华",
        "/items/sinister_essence": "阴森精华",
        "/items/enchanted_essence": "秘法精华",
        "/items/pirate_essence": "海盗精华",
        "/items/task_crystal": "任务水晶",
        "/items/star_fragment": "星光碎片",
        "/items/pearl": "珍珠",
        "/items/amber": "琥珀",
        "/items/garnet": "石榴石",
        "/items/jade": "翡翠",
        "/items/amethyst": "紫水晶",
        "/items/moonstone": "月亮石",
        "/items/sunstone": "太阳石",
        "/items/philosophers_stone": "贤者之石",
        "/items/crushed_pearl": "珍珠碎片",
        "/items/crushed_amber": "琥珀碎片",
        "/items/crushed_garnet": "石榴石碎片",
        "/items/crushed_jade": "翡翠碎片",
        "/items/crushed_amethyst": "紫水晶碎片",
        "/items/crushed_moonstone": "月亮石碎片",
        "/items/crushed_sunstone": "太阳石碎片",
        "/items/crushed_philosophers_stone": "贤者之石碎片",
        "/items/shard_of_protection": "保护碎片",
        "/items/mirror_of_protection": "保护之镜",
        "/items/philosophers_mirror": "贤者之镜",
    };
    // ======================
    // 物品名称映射
    // ======================

    let itemNameToHrid = {};
    let itemHridToName = {};
    let zhNameToHrid = {};

    function buildItemMaps() {
        if (!itemDetailMap) {
            const initData = getInitClientData();
            if (initData?.itemDetailMap) {
                itemDetailMap = initData.itemDetailMap;
            } else {
                logInit('[Better Loot Tracker] No itemDetailMap available for building item maps');
                return;
            }
        }

        // 由 itemDetailMap 构建英文名映射
        for (const [hrid, item] of Object.entries(itemDetailMap)) {
            if (item.name) {
                itemNameToHrid[item.name] = hrid;
                itemHridToName[hrid] = item.name;
            }
        }
        
        // 由 ZHItemNames 构建中文名映射（反转映射）
        for (const [hrid, zhName] of Object.entries(ZHItemNames)) {
            zhNameToHrid[zhName] = hrid;
        }
        
        logInit('[Better Loot Tracker] 物品映射构建完成，英文', Object.keys(itemNameToHrid).length, '中文:', Object.keys(zhNameToHrid).length);
    }
    
    // 根据物品名称获取HRID（支持中英文）
    function getItemHrid(itemName) {
        // 先去掉末尾的强化等级标记（如 "+1" 或 "+5"）
        const cleanName = itemName.replace(/\s*\+\d+$/, '').trim();
        
        // 先尝试英文名
        if (itemNameToHrid[cleanName]) {
            return itemNameToHrid[cleanName];
        }
        
        // 再尝试中文名
        if (zhNameToHrid[cleanName]) {
            return zhNameToHrid[cleanName];
        }
        
        // 尝试用 itemDetailMap 动态查找（遍历所有物品）
        if (itemDetailMap) {
            for (const [hrid, item] of Object.entries(itemDetailMap)) {
                // 检查英文名
                if (item.name === cleanName) {
                    itemNameToHrid[cleanName] = hrid;
                    return hrid;
                }
            }
        }
        
        // 通过 ZHItemNames 查找
        for (const [hrid, zhName] of Object.entries(ZHItemNames)) {
            if (zhName === cleanName) {
                zhNameToHrid[cleanName] = hrid;
                return hrid;
            }
        }
        
        return null;
    }

    // ======================
    // 强化计算
    // ======================

    const SUCCESS_RATE = [
        50, 45, 45, 40, 40, 40, 35, 35, 35, 35,
        30, 30, 30, 30, 30, 30, 30, 30, 30, 30
    ];
    const ITEM_ENHANCE_LEVEL_TO_BUFF_BONUS_MAP = {
        0: 0, 1: 2, 2: 4.2, 3: 6.6, 4: 9.2, 5: 12, 6: 15, 7: 18.2, 8: 21.6, 9: 25.2, 10: 29,
        11: 33.4, 12: 38.4, 13: 44, 14: 50.2, 15: 57, 16: 64.4, 17: 72.4, 18: 81, 19: 90.2, 20: 100
    };
    const ENHANCE_DEFAULT_PARAMS = {
        enhancing_level: 125,
        laboratory_level: 6,
        enhancer_bonus: 5.42,
        glove_bonus: 12.9,
        tea_enhancing: false,
        tea_super_enhancing: false,
        tea_ultra_enhancing: true,
        tea_blessed: true
    };

    function getBaseItemLevel(itemHRID) {
        if (!itemDetailMap) {
            const initData = getInitClientData();
            if (initData?.itemDetailMap) {
                itemDetailMap = initData.itemDetailMap;
            } else {
                return 0;
            }
        }
        const itemDetails = itemDetailMap[itemHRID];
        return itemDetails?.itemLevel || 0;
    }

    function getEnhancementCosts(itemHRID) {
        if (!itemDetailMap) {
            const initData = getInitClientData();
            if (initData?.itemDetailMap) {
                itemDetailMap = initData.itemDetailMap;
            } else {
                return null;
            }
        }
        
        const itemData = itemDetailMap[itemHRID];
        if (!itemData?.enhancementCosts) return null;

        return itemData.enhancementCosts;
    }

    function getProtectionItems(itemHRID) {
        if (!itemDetailMap) {
            const initData = getInitClientData();
            if (initData?.itemDetailMap) {
                itemDetailMap = initData.itemDetailMap;
            } else {
                return [itemHRID, "/items/mirror_of_protection"];
            }
        }
        
        const itemData = itemDetailMap[itemHRID];
        let protectHrids = [itemHRID, "/items/mirror_of_protection"];
        
        if (itemData?.protectionItemHrids) {
            protectHrids = protectHrids.concat(itemData.protectionItemHrids);
        }
        
        return protectHrids;
    }

    // ======================
    // 数据获取和管理
    // ======================

    // 存储角色数据
    let characterItems = null;
    let characterBuffs = null;
    let characterSkills = null;
    let characterHouseRoomMap = null;
    let itemDetailMap = null;

    // Hook WebSocket消息获取数据
    function hookWebSocket() {
        logInit('[Better Loot Tracker] Starting WebSocket hook installation...');
        
        try {
            const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
            if (!dataProperty) {
                console.error('[Better Loot Tracker] Failed to get MessageEvent.prototype.data property');
                return;
            }
            
            const oriGet = dataProperty.get;
            if (!oriGet) {
                console.error('[Better Loot Tracker] Failed to get original data getter');
                return;
            }

            dataProperty.get = function hookedGet() {
                const socket = this.currentTarget;
                if (!(socket instanceof WebSocket)) {
                    return oriGet.call(this);
                }
                
                const url = socket.url;
                logCalc('[Better Loot Tracker] WebSocket message from:', url);
                
                if (url.indexOf("api.milkywayidle.com/ws") <= -1 && url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                    return oriGet.call(this);
                }

                const message = oriGet.call(this);
                Object.defineProperty(this, "data", { value: message }); // Anti-loop

                try {
                    const obj = JSON.parse(message);
                    logCalc('[Better Loot Tracker] WebSocket message type:', obj.type);
                    
                    if (obj && obj.type === "init_character_data") {
                        logInit('[Better Loot Tracker] Received init_character_data');
                        characterItems = obj.characterItems;
                        characterBuffs = obj.characterBuffs;
                        characterSkills = obj.characterSkills;
                        characterHouseRoomMap = obj.characterHouseRoomMap;
                        logInit('[Better Loot Tracker] Updated characterItems:', !!characterItems, characterItems?.length);
                        logInit('[Better Loot Tracker] Updated characterBuffs:', !!characterBuffs, characterBuffs?.length);
                        logInit('[Better Loot Tracker] Updated characterSkills:', !!characterSkills, Object.keys(characterSkills || {}).length);
                        logInit('[Better Loot Tracker] Updated characterHouseRoomMap:', !!characterHouseRoomMap, Object.keys(characterHouseRoomMap || {}).length);
                        
                        // 延迟调用调试函数，确保所有数据都已更新
                        setTimeout(() => {
                            debugShowAllData();
                        }, 1000);
                    } else if (obj && obj.type === "init_client_data") {
                        logInit('[Better Loot Tracker] Received init_client_data');
                        itemDetailMap = obj.itemDetailMap;
                        logInit('[Better Loot Tracker] Updated itemDetailMap:', !!itemDetailMap, Object.keys(itemDetailMap || {}).length);
                    }
                } catch (e) {
                    console.error('[Better Loot Tracker] Error parsing WebSocket message:', e);
                }

                return message;
            };

            Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
            logInit('[Better Loot Tracker] WebSocket hook installed successfully');
        } catch (error) {
            console.error('[Better Loot Tracker] Error installing WebSocket hook:', error);
        }
    }

    // 获取暴饮之囊的饮料浓度加成
    function getDrinkConcentrationBonus() {
        logCalc('[Better Loot Tracker] getDrinkConcentrationBonus - characterItems:', !!characterItems);
        if (!characterItems || !itemDetailMap) return 0;


        logCalc('[Better Loot Tracker] characterItems length:', characterItems.length);

        for (const item of characterItems) {
            if (item.itemLocationHrid === "/item_locations/pouch" && item.itemHrid === "/items/guzzling_pouch") {
                logCalc('[Better Loot Tracker] Found guzzling pouch:', item);
                const itemDetail = itemDetailMap[item.itemHrid];
                logCalc('[Better Loot Tracker] Guzzling pouch detail:', itemDetail);
                
                if (itemDetail?.equipmentDetail?.noncombatStats?.drinkConcentration) {
                    const enhanceBonus = 1 + (ITEM_ENHANCE_LEVEL_TO_BUFF_BONUS_MAP[item.enhancementLevel || 0] || 0) / 100;
                    const result = itemDetail.equipmentDetail.noncombatStats.drinkConcentration * enhanceBonus * 100;
                    logCalc('[Better Loot Tracker] Drink concentration bonus:', result);
                    return result;
                }
            }
        }
        logCalc('[Better Loot Tracker] No guzzling pouch found');
        return 0;
    }

    // 获取强化等级
    function getPlayerEnhanceParams() {
        const res = {
            ...ENHANCE_DEFAULT_PARAMS,
            drink_concentration_bonus: getDrinkConcentrationBonus(),
            enhancers_top_speed: 0,
            enhancers_bottom_speed: 0,
            necklace_speed: 0
        };

        if (characterSkills && Array.isArray(characterSkills)) {
            for (const s of characterSkills) {
                if (s.skillHrid && s.skillHrid.includes("enhancing")) {
                    res.enhancing_level = s.level;
                    break;
                }
            }
        }

        let foundObservatory = false;
        if (characterHouseRoomMap) {
            for (const key in characterHouseRoomMap) {
                const hrid = characterHouseRoomMap[key].houseRoomHrid || "";
                if (hrid.includes("observatory")) {
                    const observatoryLevel = characterHouseRoomMap[key].level;
                    if (observatoryLevel !== undefined && observatoryLevel !== null) {
                        res.laboratory_level = observatoryLevel;
                        foundObservatory = true;
                        break;
                    }
                }
            }
            if (!foundObservatory) {
                for (const key in characterHouseRoomMap) {
                    const hrid = characterHouseRoomMap[key].houseRoomHrid || "";
                    if (hrid.includes("laboratory")) {
                        const laboratoryLevel = characterHouseRoomMap[key].level;
                        if (laboratoryLevel !== undefined && laboratoryLevel !== null) {
                            res.laboratory_level = laboratoryLevel;
                            break;
                        }
                    }
                }
            }
        }

        let foundEnhancer = false;
        if (characterItems && Array.isArray(characterItems)) {
            for (const it of characterItems) {
                if (!it.itemLocationHrid || it.itemLocationHrid === "/item_locations/inventory") continue;
                const hrid = it.itemHrid;
                const detail = itemDetailMap?.[hrid];
                if (!detail) continue;
                const noncombat = detail.equipmentDetail && detail.equipmentDetail.noncombatStats;
                if (noncombat && noncombat.enhancingSuccess && !foundEnhancer) {
                    const ENHANCER_LEVEL_BONUS = [
                        0.0, 2.0, 4.2, 6.6, 9.2, 12.0, 15.0, 18.2, 21.6, 25.2, 29.0,
                        33.4, 38.4, 44.0, 50.2, 57.0, 64.4, 72.4, 81.0, 90.2, 100.0
                    ];
                    const instanceLevel = Math.min(Math.max(Number(it.enhancementLevel ?? 0), 0), 20);
                    const baseFraction = noncombat.enhancingSuccess || 0.0;
                    if (instanceLevel >= 1) {
                        const multiplier = 1 + ENHANCER_LEVEL_BONUS[instanceLevel] / 100.0;
                        const finalFraction = baseFraction * multiplier;
                        res.enhancer_bonus = Number((finalFraction * 100).toFixed(4));
                    } else {
                        res.enhancer_bonus = Number((baseFraction * 100).toFixed(4));
                    }
                    foundEnhancer = true;
                }
                if (hrid && (hrid.includes("glove") || hrid.includes("gloves") || hrid.includes("gauntlets"))) {
                    if (it.enhancementLevel !== undefined && it.enhancementLevel !== null) {
                        const lvl = Number(it.enhancementLevel);
                        if (lvl >= 10) res.glove_bonus = 12.9;
                        else if (lvl >= 5) res.glove_bonus = 11.2;
                        else res.glove_bonus = 10.0;
                    } else {
                        res.glove_bonus = ENHANCE_DEFAULT_PARAMS.glove_bonus;
                    }
                }
                if (hrid === "/items/enhancers_top") {
                    const enhancingSpeed = detail?.equipmentDetail?.noncombatStats?.enhancingSpeed;
                    if (enhancingSpeed) {
                        const enhanceBonus = 1 + (ITEM_ENHANCE_LEVEL_TO_BUFF_BONUS_MAP[it.enhancementLevel || 0] || 0) / 100;
                        res.enhancers_top_speed = enhancingSpeed * enhanceBonus * 100;
                    }
                }
                if (hrid === "/items/enhancers_bottoms") {
                    const enhancingSpeed = detail?.equipmentDetail?.noncombatStats?.enhancingSpeed;
                    if (enhancingSpeed) {
                        const enhanceBonus = 1 + (ITEM_ENHANCE_LEVEL_TO_BUFF_BONUS_MAP[it.enhancementLevel || 0] || 0) / 100;
                        res.enhancers_bottom_speed = enhancingSpeed * enhanceBonus * 100;
                    }
                }
                if (hrid === "/items/necklace_of_speed" || hrid === "/items/philosophers_necklace") {
                    const enhancingSpeed = detail?.equipmentDetail?.noncombatStats?.enhancingSpeed;
                    if (enhancingSpeed) {
                        const enhanceBonus = 1 + (ITEM_ENHANCE_LEVEL_TO_BUFF_BONUS_MAP[it.enhancementLevel || 0] || 0) * 5 / 100;
                        res.necklace_speed = enhancingSpeed * enhanceBonus * 100;
                    }
                }
            }
        }

        return res;
    }

    // ======================
    // 调试函数 - 显示所有获取到的数据
    // ======================
    
    function debugShowAllData() {
        if (!DEBUG.calc) return;
        logCalc('=== [Better Loot Tracker] 调试信息 - 所有数据===');
        
        // 基础数据
        logCalc('1. 基础数据状态');
        logCalc('   - itemDetailMap available:', !!itemDetailMap);
        logCalc('   - characterItems available:', !!characterItems);
        logCalc('   - characterBuffs available:', !!characterBuffs);
        logCalc('   - characterSkills available:', !!characterSkills);
        
        if (itemDetailMap) {
            logCalc('   - itemDetailMap size:', Object.keys(itemDetailMap).length);
        }
        
        if (characterSkills) {
            logCalc('   - characterSkills length:', characterSkills.length);
            const enhancingSkill = characterSkills.find(skill => skill.skillHrid === '/skills/enhancing');
            const observatorySkill = characterSkills.find(skill => skill.skillHrid === '/skills/observatory');
            logCalc('   - 强化技能等级', enhancingSkill?.level || '未找到');
            logCalc('   - 天文台技能等级', observatorySkill?.level || '未找到');
        }
        
        if (characterItems) {
            logCalc('   - characterItems length:', characterItems.length);
            logCalc('   - characterItems sample:', characterItems.slice(0, 3));
            
            // 查找暴饮之囊
            const guzzlingPouch = characterItems.find(item => 
                item.itemLocationHrid === "/item_locations/pouch" && 
                item.itemHrid === "/items/guzzling_pouch"
            );
            logCalc('   - 暴饮之囊:', guzzlingPouch);
            
            // 查找强化器
            const enhancers = characterItems.filter(item => 
                item.itemLocationHrid && 
                item.itemLocationHrid !== "/item_locations/inventory" &&
                itemDetailMap[item.itemHrid]?.equipmentDetail?.noncombatStats?.enhancingSuccess
            );
            logCalc('   - 强化器数量', enhancers.length);
            logCalc('   - 强化器列表', enhancers);
        }
        
        if (characterBuffs) {
            logCalc('   - characterBuffs length:', characterBuffs.length);
            logCalc('   - characterBuffs sample:', characterBuffs.slice(0, 3));
            
            // 查找茶类buff
            const teaBuffs = characterBuffs.filter(buff => 
                buff.itemHrid && (
                    buff.itemHrid.includes('tea') || 
                    buff.itemHrid.includes('enhancing') ||
                    buff.itemHrid.includes('blessed')
                )
            );
            logCalc('   - 茶类buff数量:', teaBuffs.length);
            logCalc('   - 茶类buff列表:', teaBuffs);
        }
        
        // 计算结果
        logCalc('2. 计算结果:');
        const playerParams = getPlayerEnhanceParams();
        const drinkMultiplier = playerParams.drink_concentration_bonus ? (1 + playerParams.drink_concentration_bonus / 100) : 1;
        const effectiveLevel = playerParams.enhancing_level +
            (playerParams.tea_enhancing ? 3 * drinkMultiplier : 0) +
            (playerParams.tea_super_enhancing ? 6 * drinkMultiplier : 0) +
            (playerParams.tea_ultra_enhancing ? 8 * drinkMultiplier : 0);
        const enhancingLevel = playerParams.enhancing_level;
        const observatoryLevel = playerParams.laboratory_level;
        const drinkBonus = playerParams.drink_concentration_bonus;
        const enhancerBonus = playerParams.enhancer_bonus;
        const teaEffects = {
            enhancing: playerParams.tea_enhancing,
            superEnhancing: playerParams.tea_super_enhancing,
            ultraEnhancing: playerParams.tea_ultra_enhancing,
            blessed: playerParams.tea_blessed
        };
        
        logCalc('   - 强化技能等级', enhancingLevel);
        logCalc('   - 天文台技能等级', observatoryLevel);
        logCalc('   - 暴饮之囊加成:', drinkBonus);
        logCalc('   - 强化器加成', enhancerBonus);
        logCalc('   - 茶效果', teaEffects);
        
        // 测试强化计算
        logCalc('3. 测试强化计算 (以星空针+5为例):');
        const testItemHrid = '/items/celestial_needle';
        if (itemDetailMap && itemDetailMap[testItemHrid]) {
            const testResult = Enhancelate(testItemHrid, 5, 2);
            logCalc('   - 测试物品:', testItemHrid);
            logCalc('   - 物品等级:', getBaseItemLevel(testItemHrid));
            logCalc('   - 期望强化次数:', testResult.actions);
            logCalc('   - 期望保护次数:', testResult.protectCount);
        } else {
            logCalc('   - 测试物品不存在于itemDetailMap')
        }
        
        logCalc('=== 调试信息结束 ===');
    }

    // 计算期望强化次数和保护次数
    function Enhancelate(itemHrid, stopAt, protectAt, overrideParams = null) {
        logCalc('[Better Loot Tracker] Enhancelate called with:', { itemHrid, stopAt, protectAt, overrideParams });
        
        const itemLevel = getBaseItemLevel(itemHrid);
        logCalc('[Better Loot Tracker] Item level:', itemLevel);
        const playerParams = { ...getPlayerEnhanceParams(), ...(overrideParams || {}) };
        
        // 获取实际的强化等级和天文台等级
        const actualEnhancingLevel = playerParams.enhancing_level;
        const actualObservatoryLevel = playerParams.laboratory_level;
        
        logCalc('[Better Loot Tracker] Using enhancing level:', actualEnhancingLevel);
        logCalc('[Better Loot Tracker] Using observatory level:', actualObservatoryLevel);
        
        // 获取暴饮之囊加成
        const drinkConcentrationBonus = playerParams.drink_concentration_bonus;
        const drinkConcentrationMultiplier = drinkConcentrationBonus ? (1 + drinkConcentrationBonus / 100) : 1;
        logCalc('[Better Loot Tracker] Drink concentration multiplier:', drinkConcentrationMultiplier);
        
        // 获取茶效果
        const teaEffects = {
            enhancing: playerParams.tea_enhancing,
            superEnhancing: playerParams.tea_super_enhancing,
            ultraEnhancing: playerParams.tea_ultra_enhancing,
            blessed: playerParams.tea_blessed
        };
        
        // 计算有效强化等级（包含茶的加成和暴饮之囊加成影响）
        const effectiveLevel = actualEnhancingLevel +
            (teaEffects.enhancing ? 3 * drinkConcentrationMultiplier : 0) +
            (teaEffects.superEnhancing ? 6 * drinkConcentrationMultiplier : 0) +
            (teaEffects.ultraEnhancing ? 8 * drinkConcentrationMultiplier : 0);
        logCalc('[Better Loot Tracker] Effective level:', effectiveLevel, 'base:', actualEnhancingLevel);
        
        // 获取强化器加成
        const enhancerBonus = playerParams.enhancer_bonus;
        
        // 计算总加成
        let totalBonus;
        if (effectiveLevel >= itemLevel) {
            totalBonus = 1 + (0.05 * (effectiveLevel + actualObservatoryLevel - itemLevel) + enhancerBonus) / 100;
        } else {
            totalBonus = 1 - 0.5 * (1 - effectiveLevel / itemLevel) + (0.05 * actualObservatoryLevel + enhancerBonus) / 100;
        }
        logCalc('[Better Loot Tracker] Total bonus:', totalBonus);

        // 建立马尔可夫矩阵
        let markov = math.zeros(21, 21);
        for (let i = 0; i < stopAt; i++) {
            const successChance = (SUCCESS_RATE[i] / 100.0) * totalBonus;
            const destination = i >= protectAt ? i - 1 : 0;
            
            if (teaEffects.blessed) {
                // 祝福茶效果也受暴饮之囊加成影响
                const blessedEffect = 0.01 * drinkConcentrationMultiplier;
                markov.set([i, Math.min(i + 2, 20)], successChance * blessedEffect);
                markov.set([i, i + 1], successChance * (1 - blessedEffect));
                markov.set([i, destination], 1 - successChance);
            } else {
                markov.set([i, i + 1], successChance);
                markov.set([i, destination], 1.0 - successChance);
            }
        }
        markov.set([stopAt, stopAt], 1.0);

        // 计算期望强化次数
        let Q = markov.subset(math.index(math.range(0, stopAt), math.range(0, stopAt)));
        const M = math.inv(math.subtract(math.identity(stopAt), Q));
        const attemptsArray = M.subset(math.index(math.range(0, 1), math.range(0, stopAt)));
        const attempts = typeof attemptsArray === "number" 
            ? attemptsArray 
            : math.flatten(math.row(attemptsArray, 0).valueOf()).reduce((a, b) => a + b, 0);

        // 计算期望保护次数
        let protects = 0;
        if (protectAt >= 1 && protectAt < stopAt) {
            const protectAttempts = M.subset(math.index(math.range(0, 1), math.range(protectAt, stopAt)));
            const protectAttemptsArray = typeof protectAttempts === "number" 
                ? [protectAttempts] 
                : math.flatten(math.row(protectAttempts, 0).valueOf());
            protects = protectAttemptsArray.map((a, i) => 
                a * markov.get([i + protectAt, i + protectAt - 1])
            ).reduce((a, b) => a + b, 0);
        }

        const result = {
            actions: attempts,
            protectCount: protects
        };
        logCalc('[Better Loot Tracker] Enhancelate result:', result);
        return result;
    }

    // 找到最佳保护等级
    function findBestProtectLevel(itemHrid, targetLevel, marketData) {
        const enhancementCosts = getEnhancementCosts(itemHrid);
        if (!enhancementCosts) return { protectAt: 2, materialCost: 0, protectCost: 0 };

        // 计算每次强化的材料成本
        let perActionCost = 0;
        for (const cost of enhancementCosts) {
            const price = getMarketPrice(cost.itemHrid, marketData);
            perActionCost += price * cost.count;
        }

        // 计算保护成本
        const protectionItems = getProtectionItems(itemHrid);
        let minProtectCost = Infinity;
        for (const protectHrid of protectionItems) {
            const price = getMarketPrice(protectHrid, marketData);
            if (price > 0 && price < minProtectCost) {
                minProtectCost = price;
            }
        }
        if (minProtectCost === Infinity) minProtectCost = 0;

        // 遍历所有可能的保护等级找到最优
        let bestResult = null;
        const startProtect = targetLevel === 1 ? 1 : 2;
        
        for (let protectAt = startProtect; protectAt <= targetLevel; protectAt++) {
            const sim = Enhancelate(itemHrid, targetLevel, protectAt);
            const totalCost = perActionCost * sim.actions + minProtectCost * sim.protectCount;
            
            if (!bestResult || totalCost < bestResult.totalCost) {
                bestResult = {
                    protectAt: protectAt,
                    expectedActions: sim.actions,
                    expectedProtects: sim.protectCount,
                    perActionCost: perActionCost,
                    minProtectCost: minProtectCost,
                    totalCost: totalCost
                };
            }
        }

        return bestResult;
    }

    // ======================
    // 解析掉落记录
    // ======================

    function parseEnhancementLoot(lootElement) {
        // 获取标题信息
        const titleSpan = lootElement.querySelector('div > span:not(.loot-log-index)');
        if (!titleSpan) return null;

        const titleText = titleSpan.textContent;
        
        // 检查是否是强化行动
        if (!titleText.includes('强化') && !titleText.toLowerCase().includes('enhancing')) {
            return null;
        }

        // 解析强化次数：格式如 "强化 - 星空针(104)" 或 "Enhancing - Celestial Needle (104)"
        const countMatch = titleText.match(/\((\d+)\)/);
        if (!countMatch) return null;
        const enhanceCount = parseInt(countMatch[1]);
        const startLevelMatch = titleText.match(/\+(\d+)\s*\(\d+\)\s*$/);
        const startLevel = startLevelMatch ? parseInt(startLevelMatch[1]) : 0;

        // 解析物品名称 - 同时尝试中英文格式
        let itemName = null;
        
        // 尝试中文格式
        const zhMatch = titleText.match(/强化\s*-\s*(.+?)\s*\(/);
        if (zhMatch) {
            itemName = zhMatch[1].trim();
        }
        
        // 如果中文没匹配到，尝试英文格式
        if (!itemName) {
            const enMatch = titleText.match(/Enhancing\s*-\s*(.+?)\s*\(/i);
            if (enMatch) {
                itemName = enMatch[1].trim();
            }
        }
        
        if (!itemName) return null;

        // 获取物品HRID（支持中英文，自动去掉强化等级）
        const itemHrid = getItemHrid(itemName);
        if (!itemHrid) {
            logCalc('[Better Loot Tracker] 未找到物品HRID:', itemName);
            return null;
        }

        // 解析各等级掉落
        const drops = {};
        const itemContainers = lootElement.querySelectorAll('.Item_itemContainer__x7kH1');
        
        for (const container of itemContainers) {
            const countDiv = container.querySelector('.Item_count__1HVvv');
            const levelDiv = container.querySelector('.Item_enhancementLevel__19g-e');
            
            if (countDiv) {
                const count = parseInt(countDiv.textContent) || 0;
                let level = 0;
                
                if (levelDiv) {
                    const levelMatch = levelDiv.textContent.match(/\+(\d+)/);
                    level = levelMatch ? parseInt(levelMatch[1]) : 0;
                }
                
                // 检查是否是强化精华（排除它）
                const itemIcon = container.querySelector('svg use');
                if (itemIcon) {
                    const href = itemIcon.getAttribute('href') || '';
                    if (href.includes('enhancing_essence')) {
                        continue; // 跳过强化精华
                    }
                }
                
                drops[level] = (drops[level] || 0) + count;
            }
        }

        return {
            itemName,
            itemHrid,
            enhanceCount,
            startLevel,
            drops
        };
    }

    function parseAlchemyLoot(lootElement) {
        const titleSpan = lootElement.querySelector('div > span:not(.loot-log-index)');
        if (!titleSpan) return null;

        const titleText = titleSpan.textContent;
        if (!titleText.includes('炼金') && !titleText.toLowerCase().includes('alchemy')) {
            return null;
        }

        const costMatch = titleText.match(/:\s*(.+?)\s*\((\d+)\)\s*$/);
        if (!costMatch) return null;

        const costItemName = costMatch[1].trim();
        const costCount = parseInt(costMatch[2], 10);
        if (!costItemName || !Number.isFinite(costCount)) return null;

        const costItemHrid = getItemHrid(costItemName);
        if (!costItemHrid) {
            logCalc('[Better Loot Tracker] 未找到炼金消耗物品HRID:', costItemName);
            return null;
        }

        const outputs = {};
        const itemContainers = lootElement.querySelectorAll('.Item_itemContainer__x7kH1');
        for (const container of itemContainers) {
            const countDiv = container.querySelector('.Item_count__1HVvv');
            if (!countDiv) continue;
            const count = parseInt(countDiv.textContent, 10) || 0;
            if (count <= 0) continue;

            const itemIcon = container.querySelector('svg use');
            const href = itemIcon?.getAttribute('href') || '';
            const idMatch = href.match(/#(.+)$/);
            if (!idMatch) continue;

            const itemId = idMatch[1].trim();
            if (!itemId) continue;

            const itemHrid = `/items/${itemId}`;
            outputs[itemHrid] = (outputs[itemHrid] || 0) + count;
        }

        return {
            costItemHrid,
            costCount,
            outputs
        };
    }

    function analyzeEnhancementResult(parsedData) {
        const { drops } = parsedData;
        
        // 找到最高等级和其数量
        let maxLevel = 0;
        let maxLevelCount = 0;
        
        for (const [levelStr, count] of Object.entries(drops)) {
            const level = parseInt(levelStr);
            if (level > maxLevel) {
                maxLevel = level;
                maxLevelCount = count;
            }
        }

        // 判断目标等级和是否成功
        let targetLevel, success;
        if (maxLevelCount === 1) {
            targetLevel = maxLevel;
            success = true;
        } else {
            targetLevel = maxLevel + 1;
            success = false;
        }

        return {
            targetLevel,
            success,
            maxLevel,
            maxLevelCount
        };
    }

    function parsePreferenceLevels(text) {
        if (!text) return [];
        const matches = text.match(/\d+/g) || [];
        const levels = matches
            .map((value) => parseInt(value, 10))
            .filter((level) => Number.isFinite(level) && level >= 1 && level <= 20);
        return Array.from(new Set(levels)).sort((a, b) => a - b);
    }

    function applyPreferredTarget(analysisResult, preferenceLevels) {
        if (!preferenceLevels || preferenceLevels.length === 0) return analysisResult;
        const { maxLevel } = analysisResult;
        if (preferenceLevels.includes(maxLevel)) return analysisResult;

        const nextPreferred = preferenceLevels.find((level) => level > maxLevel);
        if (!nextPreferred) return analysisResult;

        return {
            ...analysisResult,
            targetLevel: nextPreferred,
            success: false
        };
    }

    function getAlchemyPriceSides(mode) {
        switch (mode) {
            case 'bid_ask':
                return { costSide: 'bid', outputSide: 'ask' };
            case 'ask_ask':
                return { costSide: 'ask', outputSide: 'ask' };
            case 'bid_bid':
                return { costSide: 'bid', outputSide: 'bid' };
            case 'ask_bid':
            default:
                return { costSide: 'ask', outputSide: 'bid' };
        }
    }

    function hasSuperEnhanceGap(drops, protectAt) {
        if (!protectAt || protectAt < 2) return false;
        let missingStreak = 0;
        for (let level = 1; level < protectAt; level++) {
            if ((drops[level] || 0) > 0) {
                missingStreak = 0;
                continue;
            }
            missingStreak += 1;
            if (missingStreak >= 2) return true;
        }
        return false;
    }

    function getExpectedTotalCostToLevel(itemHrid, level, marketData) {
        if (!level || level <= 0) return 0;
        const strategy = findBestProtectLevel(itemHrid, level, marketData);
        return strategy ? strategy.totalCost : 0;
    }

    function applySuperEnhanceFailurePadding(drops, startLevel) {
        const padded = { ...drops };
        const cap = Math.max(0, Math.min(Math.floor(startLevel), 20));
        for (let level = 0; level <= cap; level++) {
            padded[level] = (padded[level] || 0) + 1;
        }
        return padded;
    }

    function displayAlchemyInfo(lootElement, alchemyData, marketData) {
        const { costItemHrid, costCount, outputs } = alchemyData;
        const priceSides = getAlchemyPriceSides(globalAlchemyPriceMode);
        const costPrice = getMarketPriceSide(costItemHrid, marketData, priceSides.costSide);
        const totalCost = costPrice * costCount;

        let totalOutput = 0;
        for (const [itemHrid, count] of Object.entries(outputs)) {
            const outputPrice = getMarketPriceSide(itemHrid, marketData, priceSides.outputSide);
            totalOutput += outputPrice * count;
        }
        totalOutput *= 0.98;

        const profit = totalOutput - totalCost;
        const profitColor = profit >= 0 ? 'rgb(100, 255, 100)' : 'rgb(255, 100, 100)';

        const titleSpan = lootElement.querySelector('div > span:not(.loot-log-index)');
        if (!titleSpan) return;

        const existingTitleInfo = titleSpan.parentElement.querySelector('.alchemy-title-info');
        if (existingTitleInfo) {
            existingTitleInfo.remove();
        }

        const titleInfo = document.createElement('span');
        titleInfo.className = 'alchemy-title-info';
        titleInfo.style.cssText = 'margin-left: 8px;';
        titleInfo.innerHTML = `
            <span style="margin-left: 8px; color: #e0e0e0;">${t.alchemyCost}: ${formatNumber(totalCost)}</span>
            <span style="margin-left: 8px; color: #e0e0e0;">${t.alchemyOutput}: ${formatNumber(totalOutput)}</span>
            <span style="margin-left: 8px; color: ${profitColor};">${t.alchemyProfit}: ${formatNumber(profit)}</span>
        `;

        titleSpan.after(titleInfo);
    }

    function renderGlobalSettingsPanel(container) {
        if (!container) return;

        let wrapper = container.querySelector('.enhancement-loot-tracker-global-settings-wrapper');
        if (!wrapper) {
            wrapper = document.createElement('div');
            wrapper.className = 'enhancement-loot-tracker-global-settings-wrapper';
            wrapper.style.cssText = `
                margin: 6px 0 10px 0;
                display: flex;
                align-items: center;
                gap: 8px;
                flex-wrap: wrap;
            `;

            wrapper.innerHTML = `
                <button class="elt-global-settings-toggle" style="background: rgba(100,100,100,0.5); border: 1px solid #666; border-radius: 6px; color: #ddd; cursor: pointer; padding: 4px 10px; font-size: 12px;">
                    ${t.globalSettings}
                </button>
                <div class="enhancement-loot-tracker-global-settings" style="
                    padding: 8px 12px;
                    background: rgba(0, 0, 0, 0.35);
                    border-radius: 8px;
                    font-size: 12px;
                    color: #e0e0e0;
                    display: none;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 8px;
                ">
                    <label style="display: flex; align-items: center; gap: 6px;">
                        ${t.preferredLevels}:
                        <input class="elt-global-preference" placeholder="使用空格分隔，如‘7 8 10’" style="width: 140px; background: rgba(50,50,50,0.8); color: #e0e0e0; border: 1px solid #555; border-radius: 4px; padding: 2px 6px; font-size: 11px;">
                    </label>
                    <label style="display: flex; align-items: center; gap: 6px;">
                        ${t.superEnhanceMinLevel}:
                        <input class="elt-global-super-min" type="number" min="0" max="20" style="width: 64px; background: rgba(50,50,50,0.8); color: #e0e0e0; border: 1px solid #555; border-radius: 4px; padding: 2px 6px; font-size: 11px;">
                    </label>
                    <label style="display: flex; align-items: center; gap: 6px;">
                        ${t.alchemyPriceMode}:
                        <select class="elt-global-alchemy-price" style="background: rgba(50,50,50,0.8); color: #e0e0e0; border: 1px solid #555; border-radius: 4px; padding: 2px 6px; font-size: 11px;">
                            <option value="ask_bid">${t.alchemyPriceAskBid}</option>
                            <option value="bid_ask">${t.alchemyPriceBidAsk}</option>
                            <option value="ask_ask">${t.alchemyPriceAskAsk}</option>
                            <option value="bid_bid">${t.alchemyPriceBidBid}</option>
                        </select>
                    </label>
                    <span style="font-size: 11px; color: #888;">用于所有掉落记录</span>
                </div>
            `;

            container.prepend(wrapper);

            const toggle = wrapper.querySelector('.elt-global-settings-toggle');
            const panel = wrapper.querySelector('.enhancement-loot-tracker-global-settings');
            toggle.addEventListener('click', () => {
                if (panel) {
                    panel.style.display = panel.style.display === 'none' ? 'flex' : 'none';
                }
            });
        }

        const input = wrapper.querySelector('.elt-global-preference');
        if (input && input.value !== globalPreferenceText) {
            input.value = globalPreferenceText;
        }
        if (input && !input.dataset.bound) {
            input.dataset.bound = '1';
            input.addEventListener('change', () => {
                setGlobalPreferenceText(input.value);
                processLootLogs({ force: true });
            });
        }

        const superInput = wrapper.querySelector('.elt-global-super-min');
        if (superInput && superInput.value !== String(globalSuperEnhanceMinLevel)) {
            superInput.value = String(globalSuperEnhanceMinLevel);
        }
        if (superInput && !superInput.dataset.bound) {
            superInput.dataset.bound = '1';
            superInput.addEventListener('change', () => {
                setSuperEnhanceMinLevel(superInput.value);
                processLootLogs({ force: true });
            });
        }

        const alchemySelect = wrapper.querySelector('.elt-global-alchemy-price');
        if (alchemySelect && alchemySelect.value !== globalAlchemyPriceMode) {
            alchemySelect.value = globalAlchemyPriceMode;
        }
        if (alchemySelect && !alchemySelect.dataset.bound) {
            alchemySelect.dataset.bound = '1';
            alchemySelect.addEventListener('change', () => {
                setAlchemyPriceMode(alchemySelect.value);
                processLootLogs({ force: true });
            });
        }
    }

    /**
     * 计算实际保护次数
     * 
     * 算法说明
     * 1. 从保护等级x开始，累加x, x+2, x+4...的掉落次数
     * 2. 如果成功，再减去保护等级和目标等级之间包含的"奇数位置"等级数量
     *    这里“奇数位置”是指：从protectAt开始数，第1个、第2个..等级
     *    例如 protectAt=5, targetLevel=7: 
     *    需要累加 +5 和 +7 的次数
     *    成功时减去（因为成功到达+7需要经过+5和+7这两个保护点各一次成功）
     * 
     * @param {Object} drops - 各等级掉落数据{0: 46, 1: 27, 2: 12, ...}
     * @param {number} protectAt - 保护起始等级
     * @param {number} targetLevel - 目标等级
     * @param {boolean} success - 是否成功到达目标
     * @returns {number} 实际保护次数
     */
    function calculateActualProtections(drops, protectAt, targetLevel, success) {
        if (!protectAt || protectAt < 1) return 0;
        // 按保护等级的奇偶性统计保护位掉落
        let protectCount = 0;
        const parity = protectAt % 2;
        for (let level = protectAt; level <= targetLevel; level++) {
            if (level % 2 !== parity) continue;
            protectCount += (drops[level] || 0);
        }
        
        // 成功时扣掉一路通过的保护位次数
        if (success) {
            let successPassCount = 0;
            for (let level = protectAt; level <= targetLevel; level++) {
                if (level % 2 !== parity) continue;
                successPassCount++;
            }
            protectCount -= successPassCount;
        }
        
        return Math.max(0, protectCount);
    }

    // ======================
    // 格式化数据
    // ======================

    function formatNumber(num) {
        if (num === undefined || num === null || isNaN(num)) return '0';
        
        const absNum = Math.abs(num);
        let formatted;
        
        if (absNum >= 1e9) {
            formatted = (num / 1e9).toFixed(2) + 'B';
        } else if (absNum >= 1e6) {
            formatted = (num / 1e6).toFixed(2) + 'M';
        } else if (absNum >= 1e3) {
            formatted = (num / 1e3).toFixed(2) + 'K';
        } else {
            formatted = Math.round(num).toString();
        }
        
        return formatted;
    }

    // ======================
    // 显示增强信息
    // ======================

    // 存储每个掉落记录的配置
    const lootConfigs = new WeakMap();

    function displayEnhancementInfo(lootElement, parsedData, analysisResult, marketData, customConfig = null) {
        logCalc('[Better Loot Tracker] displayEnhancementInfo called with:', parsedData);
        
        const { itemHrid, enhanceCount, drops, startLevel } = parsedData;
        const defaultTargetLevel = analysisResult.targetLevel;
        const defaultSuccess = analysisResult.success;
        const baseItemPrice = getMarketPrice(itemHrid, marketData);
        
        // 获取或初始化配置
        let config = customConfig || lootConfigs.get(lootElement);
        if (!config) {
            const preferenceLevels = getGlobalPreferenceLevels();
            const preferredAnalysis = applyPreferredTarget(analysisResult, preferenceLevels);
            config = {
                targetLevel: preferredAnalysis.targetLevel,
                success: preferredAnalysis.success,
                protectAt: null,
                hasCustomTarget: false,
                hasCustomSuccess: false
            };
            lootConfigs.set(lootElement, config);
        }

        const preferredAnalysis = applyPreferredTarget(analysisResult, getGlobalPreferenceLevels());
        const targetLevel = config.hasCustomTarget ? config.targetLevel : preferredAnalysis.targetLevel;
        const success = config.hasCustomSuccess ? config.success : preferredAnalysis.success;
        if (!config.hasCustomTarget) config.targetLevel = targetLevel;
        if (!config.hasCustomSuccess) config.success = success;
        
        logCalc('[Better Loot Tracker] Config:', config);
        
        // 获取最佳强化策略
        const bestStrategy = findBestProtectLevel(itemHrid, targetLevel, marketData);
        if (!bestStrategy) {
            logCalc('[Better Loot Tracker] No best strategy found');
            return;
        }
        
        logCalc('[Better Loot Tracker] Best strategy:', bestStrategy);
        
        // 使用用户自定义保护等级或最佳保护等级
        const protectAt = config.protectAt !== null
            ? Math.min(config.protectAt, targetLevel)
            : bestStrategy.protectAt;

        const maxLevel = analysisResult.maxLevel;
        const hasZeroDrop = (drops[0] || 0) > 0;
        const superMinLevel = getSuperEnhanceMinLevel();
        let isSuperEnhance = false;
        let superSuccess = false;
        let superTargetLevel = targetLevel;
        if (startLevel > 0 && startLevel >= superMinLevel) {
            if (!hasZeroDrop) {
                isSuperEnhance = true;
                superSuccess = true;
                superTargetLevel = maxLevel;
            } else if (hasSuperEnhanceGap(drops, protectAt)) {
                isSuperEnhance = true;
                superSuccess = false;
                superTargetLevel = 0;
            }
        }
        
        // 重新计算使用用户选择的保护等级的期望值
        const sim = Enhancelate(itemHrid, targetLevel, protectAt);
        const expectedMaterialCost = bestStrategy.perActionCost * sim.actions;
        const expectedProtectCost = bestStrategy.minProtectCost * sim.protectCount;
        const expectedTotalCost = expectedMaterialCost + expectedProtectCost;
        
        logCalc('[Better Loot Tracker] Expected costs:', {
            materialCost: expectedMaterialCost,
            protectCost: expectedProtectCost,
            totalCost: expectedTotalCost
        });
        
        // 计算实际消耗
        const actualMaterialCost = bestStrategy.perActionCost * enhanceCount;
        const actualProtectTargetLevel = isSuperEnhance ? maxLevel : targetLevel;
        const actualProtectSuccess = isSuperEnhance ? superSuccess : success;
        const dropsForProtect = isSuperEnhance && startLevel > 0
            ? applySuperEnhanceFailurePadding(drops, startLevel)
            : drops;
        const actualProtectCount = calculateActualProtections(dropsForProtect, protectAt, actualProtectTargetLevel, actualProtectSuccess);
        const actualProtectCost = bestStrategy.minProtectCost * actualProtectCount;
        const actualTotalCost = actualMaterialCost + actualProtectCost;
        
        logCalc('[Better Loot Tracker] Actual costs:', {
            materialCost: actualMaterialCost,
            protectCost: actualProtectCost,
            totalCost: actualTotalCost,
            protectCount: actualProtectCount
        });
        
        // 计算比例
        const materialRatioNum = expectedMaterialCost > 0 ? actualMaterialCost / expectedMaterialCost : 0;
        const protectRatioNum = expectedProtectCost > 0 ? actualProtectCost / expectedProtectCost : 0;
        const totalRatioNum = expectedTotalCost > 0 ? actualTotalCost / expectedTotalCost : 0;
        
        const materialRatio = materialRatioNum.toFixed(2);
        const protectRatio = protectRatioNum.toFixed(2);
        const totalRatio = totalRatioNum.toFixed(2);
        
        // 根据比例决定颜色：>1红色、<1绿色、=1白色
        const getRatioColor = (ratio) => {
            if (ratio > 1) return 'rgb(255, 100, 100)';
            if (ratio < 1) return 'rgb(100, 255, 100)';
            return '#e0e0e0';
        };
        const materialColor = getRatioColor(materialRatioNum);
        const protectColor = getRatioColor(protectRatioNum);
        const totalColor = getRatioColor(totalRatioNum);
        
        // 计算差值
        const diff = actualTotalCost - expectedTotalCost;
        const diffText = diff >= 0 ? `${t.aboveExpected}: ${formatNumber(diff)}` : `${t.belowExpected}: ${formatNumber(Math.abs(diff))}`;
        const diffColor = diff >= 0 ? 'rgb(255, 100, 100)' : 'rgb(100, 255, 100)';
        
        // 成功/失败状态
        const statusText = isSuperEnhance ? (superSuccess ? t.success : t.failure) : (success ? t.success : t.failure);
        const statusColor = isSuperEnhance
            ? (superSuccess ? 'rgb(100, 255, 100)' : 'rgb(255, 100, 100)')
            : (success ? 'rgb(100, 255, 100)' : 'rgb(255, 100, 100)');
        
        // 生成唯一ID
        const uniqueId = `elt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        // ========== 标题行信息（显示在标题后面） ==========
        const titleSpan = lootElement.querySelector('div > span:not(.loot-log-index)');
        if (titleSpan) {
            // 移除旧的标题行信息
            const existingTitleInfo = titleSpan.parentElement.querySelector('.enhancement-title-info');
            if (existingTitleInfo) {
                existingTitleInfo.remove();
            }
            
            // 创建标题行信息
            const titleInfo = document.createElement('span');
            titleInfo.className = 'enhancement-title-info';
            titleInfo.style.cssText = 'margin-left: 8px;';
            
            // 只有成功时才显示差值信息
            const diffHtml = success ? `<span style="margin-left: 8px; color: ${diffColor}; font-weight: bold;">${diffText}</span>` : '';
            const superOriginalCost = baseItemPrice + getExpectedTotalCostToLevel(itemHrid, startLevel, marketData);
            const superFinalValue = superSuccess
                ? baseItemPrice + getExpectedTotalCostToLevel(itemHrid, superTargetLevel, marketData)
                : baseItemPrice;
            const superProfit = superFinalValue - superOriginalCost - actualTotalCost;
            const superProfitColor = superProfit >= 0 ? 'rgb(100, 255, 100)' : 'rgb(255, 100, 100)';

            const normalHtml = `
                <span style="color: ${statusColor}; font-weight: bold;">[${statusText}]</span>
                <span style="margin-left: 8px; color: ${materialColor};">${t.material}: ${formatNumber(actualMaterialCost)} (${materialRatio}x ${formatNumber(expectedMaterialCost)})</span>
                <span style="margin-left: 8px; color: ${protectColor};">${t.protection}: ${formatNumber(actualProtectCost)} (${protectRatio}x ${formatNumber(expectedProtectCost)})</span>
                <span style="margin-left: 8px; color: ${totalColor};">${t.total}: ${formatNumber(actualTotalCost)} (${totalRatio}x ${formatNumber(expectedTotalCost)})</span>
                ${diffHtml}
            `;

            const superHtml = `
                <span style="color: ${statusColor}; font-weight: bold;">[${statusText}]</span>
                <span style="margin-left: 8px; color: #e0e0e0;">${t.superSpend}: ${formatNumber(actualTotalCost)}</span>
                <span style="margin-left: 8px; color: #e0e0e0;">${t.originalCost}: ${formatNumber(superOriginalCost)}</span>
                <span style="margin-left: 8px; color: #e0e0e0;">${t.finalValue}: ${formatNumber(superFinalValue)}</span>
                <span style="margin-left: 8px; color: ${superProfitColor};">${t.profit}: ${formatNumber(superProfit)}</span>
            `;

            titleInfo.innerHTML = `
                ${isSuperEnhance ? superHtml : normalHtml}
                <button class="enhancement-toggle-settings" style="margin-left: 8px; background: rgba(100,100,100,0.5); border: 1px solid #666; border-radius: 4px; color: #ccc; cursor: pointer; padding: 1px 6px; font-size: 12px;">⚙</button>
            `;
            
            // 插入到标题后面
            titleSpan.after(titleInfo);
            
            // 添加设置按钮点击事件
            const toggleBtn = titleInfo.querySelector('.enhancement-toggle-settings');
            toggleBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const settingsPanel = lootElement.querySelector('.enhancement-loot-tracker-info');
                if (settingsPanel) {
                    settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
                }
            });
        }
        
        // ========== 底部配置区域（默认隐藏） ==========
        // 创建显示元素
        const infoSpan = document.createElement('div');
        infoSpan.className = 'enhancement-loot-tracker-info';
        infoSpan.style.cssText = `
            margin-top: 8px;
            padding: 6px 10px;
            background: rgba(0, 0, 0, 0.3);
            border-radius: 6px;
            font-size: 12px;
            color: #e0e0e0;
            display: none;
        `;
        
        // 生成目标等级选项
        let targetOptions = '';
        for (let i = 1; i <= 20; i++) {
            const selected = i === targetLevel ? 'selected' : '';
            targetOptions += `<option value="${i}" ${selected}>+${i}</option>`;
        }
        
        // 生成保护等级选项
        const autoProtectLabel = isZH ? `自动(+${bestStrategy.protectAt})` : `Auto(+${bestStrategy.protectAt})`;
        let protectOptions = `<option value="auto">${autoProtectLabel}</option>`;
        for (let i = 2; i <= targetLevel; i++) {
            const selected = (config.protectAt !== null && i === protectAt) ? 'selected' : '';
            protectOptions += `<option value="${i}" ${selected}>+${i}</option>`;
        }
        if (config.protectAt === null) {
            protectOptions = protectOptions.replace('value="auto"', 'value="auto" selected');
        }
        
        infoSpan.innerHTML = `
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 8px;">
                <label style="display: flex; align-items: center; gap: 4px;">
                    ${t.target}:
                    <select id="${uniqueId}-target" style="background: rgba(50,50,50,0.8); color: #e0e0e0; border: 1px solid #555; border-radius: 4px; padding: 2px 4px; font-size: 11px;">
                        ${targetOptions}
                    </select>
                </label>
                <label style="display: flex; align-items: center; gap: 4px;">
                    ${t.protectLevel}:
                    <select id="${uniqueId}-protect" style="background: rgba(50,50,50,0.8); color: #e0e0e0; border: 1px solid #555; border-radius: 4px; padding: 2px 4px; font-size: 11px;">
                        ${protectOptions}
                    </select>
                </label>
                <label style="display: flex; align-items: center; gap: 4px;">
                    <input type="checkbox" id="${uniqueId}-success" ${success ? 'checked' : ''} style="margin: 0;">
                    ${t.treatAsSuccess}
                </label>
                <span style="margin-left: 8px; font-size: 11px; color: #888;">
                    ${t.expected}: ${formatNumber(expectedTotalCost)}
                </span>
            </div>
        `;
        
        // 检查是否已经添加过
        const existingInfo = lootElement.querySelector('.enhancement-loot-tracker-info');
        if (existingInfo) {
            existingInfo.remove();
        }
        
        // 添加到掉落记录底部
        const dropsContainer = lootElement.querySelector('.LootLogPanel_itemDrops__2h0ov');
        if (dropsContainer) {
            dropsContainer.before(infoSpan);
        } else {
            lootElement.prepend(infoSpan);
        }
        
        // 添加事件监听器
        const targetSelect = infoSpan.querySelector(`#${uniqueId}-target`);
        const protectSelect = infoSpan.querySelector(`#${uniqueId}-protect`);
        const successCheckbox = infoSpan.querySelector(`#${uniqueId}-success`);
        
        const updateDisplay = (options = {}) => {
            // 记住当前设置面板的显示状态
            const currentPanel = lootElement.querySelector('.enhancement-loot-tracker-info');
            const wasVisible = currentPanel && currentPanel.style.display !== 'none';

            const hasCustomTarget = options.targetChanged ? true : config.hasCustomTarget;
            const hasCustomSuccess = options.successChanged ? true : config.hasCustomSuccess;
            const preferredAnalysis = applyPreferredTarget(analysisResult, getGlobalPreferenceLevels());
            const resolvedTargetLevel = hasCustomTarget ? parseInt(targetSelect.value) : preferredAnalysis.targetLevel;
            const resolvedSuccess = hasCustomSuccess ? successCheckbox.checked : preferredAnalysis.success;

            const newConfig = {
                targetLevel: resolvedTargetLevel,
                success: resolvedSuccess,
                protectAt: protectSelect.value === 'auto' ? null : parseInt(protectSelect.value),
                hasCustomTarget,
                hasCustomSuccess
            };
            
            // 如果目标等级改变，更新保护等级选项
            if (newConfig.targetLevel !== config.targetLevel) {
                const refreshedBest = findBestProtectLevel(parsedData.itemHrid, newConfig.targetLevel, marketData) || { protectAt: 2 };
                const refreshedAutoLabel = isZH ? `自动(+${refreshedBest.protectAt})` : `Auto(+${refreshedBest.protectAt})`;
                let newProtectOptions = `<option value="auto" selected>${refreshedAutoLabel}</option>`;
                for (let i = 2; i <= newConfig.targetLevel; i++) {
                    newProtectOptions += `<option value="${i}">+${i}</option>`;
                }
                protectSelect.innerHTML = newProtectOptions;
                newConfig.protectAt = null;
            }
            
            lootConfigs.set(lootElement, newConfig);
            displayEnhancementInfo(lootElement, parsedData, analysisResult, marketData, newConfig);
            
            // 恢复设置面板的显示状态
            if (wasVisible) {
                const newPanel = lootElement.querySelector('.enhancement-loot-tracker-info');
                if (newPanel) {
                    newPanel.style.display = 'block';
                }
            }
        };
        
        targetSelect.addEventListener('change', () => updateDisplay({ targetChanged: true }));
        protectSelect.addEventListener('change', () => updateDisplay());
        successCheckbox.addEventListener('change', () => updateDisplay({ successChanged: true }));
    }

    // ======================
    // 主处理函数
    // ======================

    function processLootLogs(options = {}) {
        logCalc('[Better Loot Tracker] processLootLogs 开始执行..');
        const force = !!options.force;
        
        const marketData = getMarketData();
        if (!marketData) {
            logCalc(`[Better Loot Tracker] ${t.noMarketData}`);
            return;
        }
        logCalc('[Better Loot Tracker] 市场数据已加载');

        const container = getLootLogContainer();
        if (!container) {
            logCalc('[Better Loot Tracker] 没有找到掉落记录容器');
            return;
        }

        renderGlobalSettingsPanel(container);
        setupRefreshButtonHook();

        const lootLogList = container.querySelectorAll(LOOT_LOG_ITEM_SELECTOR);
        logCalc('[Better Loot Tracker] 找到掉落记录数量:', lootLogList.length);
        
        if (!lootLogList.length) {
            logCalc('[Better Loot Tracker] 没有找到掉落记录元素');
            return;
        }

        let processedCount = 0;
        lootLogList.forEach((lootElement, index) => {
            logCalc(`[Better Loot Tracker] 处理第${index + 1}个掉落记录..`);

            if (!force && lootElement.dataset.eltProcessed === '1') {
                return;
            }
            
            // 解析掉落数据
            const parsedData = parseEnhancementLoot(lootElement);
            if (parsedData) {
                logCalc(`[Better Loot Tracker] 第${index + 1}个记录是强化记录:`, parsedData);
                
                // 分析强化结果
                const analysisResult = analyzeEnhancementResult(parsedData);
                logCalc(`[Better Loot Tracker] 分析结果:`, analysisResult);
                
                // 显示信息
                displayEnhancementInfo(lootElement, parsedData, analysisResult, marketData);
                lootElement.dataset.eltProcessed = '1';
                processedCount++;
                return;
            }

            const alchemyData = parseAlchemyLoot(lootElement);
            if (alchemyData) {
                logCalc(`[Better Loot Tracker] 第${index + 1}个记录是炼金记录:`, alchemyData);
                displayAlchemyInfo(lootElement, alchemyData, marketData);
                lootElement.dataset.eltProcessed = '1';
                processedCount++;
                return;
            }

            logCalc(`[Better Loot Tracker] 第${index + 1}个记录不是强化或炼金记录`);
        });
        
        logCalc(`[Better Loot Tracker] 处理完成，共处理${processedCount}个强化记录`);
    }

    // ======================
    // 观察DOM变化
    // ======================

    function setupObserver() {
        logInit('[Better Loot Tracker] 设置DOM观察器..');
        
        const observer = new MutationObserver((mutations) => {
            let shouldProcess = false;
            
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.classList?.contains('LootLogPanel_actionLoot__32gl_') ||
                                node.querySelector?.('.LootLogPanel_actionLoot__32gl_') ||
                                node.classList?.contains('LootLogPanel_actionLoots__3oTid')) {
                                shouldProcess = true;
                                logCalc('[Better Loot Tracker] 检测到新的掉落记录');
                                break;
                            }
                        }
                    }
                }
                if (shouldProcess) break;
            }
            
            if (shouldProcess) {
                logCalc('[Better Loot Tracker] 延迟处理新的掉落记录...');
                setTimeout(processLootLogs, 200);
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        logInit('[Better Loot Tracker] DOM观察器已设置');
    }

    // ======================
    // 初始化
    // ======================

    function init() {
        logInit('[Better Loot Tracker] 初始化开始..');
        logInit('[Better Loot Tracker] 当前URL:', window.location.href);
        logInit('[Better Loot Tracker] 用户代理:', navigator.userAgent);
        
        // 安装WebSocket hook
        hookWebSocket();
        
        // 等待initClientData加载
        let checkCount = 0;
        const checkData = setInterval(() => {
            checkCount++;
            const initData = getInitClientData();
            logCalc(`[Better Loot Tracker] 检查数据(${checkCount}/60):`, !!initData, !!initData?.itemDetailMap);
            
            if (initData?.itemDetailMap) {
                clearInterval(checkData);
                
                // 初始化itemDetailMap
                itemDetailMap = initData.itemDetailMap;
                
                logInit('[Better Loot Tracker] InitData loaded, itemDetailMap size:', Object.keys(itemDetailMap).length);
                logInit('[Better Loot Tracker] CharacterItems from WebSocket:', !!characterItems);
                logInit('[Better Loot Tracker] CharacterBuffs from WebSocket:', !!characterBuffs);
                logInit('[Better Loot Tracker] CharacterSkills from WebSocket:', !!characterSkills);
                
                buildItemMaps();
                setupObserver();
                
                // 首次处理
                setTimeout(() => {
                    logCalc('[Better Loot Tracker] 开始首次处理掉落记录..');
                    processLootLogs();
                }, 1000);
                
                // 显示调试信息
                setTimeout(() => {
                    logCalc('[Better Loot Tracker] 显示调试信息...');
                    debugShowAllData();
                }, 2000);
                
                logInit('[Better Loot Tracker] 初始化完毕..');
            }
            
            if (checkCount >= 60) {
                clearInterval(checkData);
                logInit('[Better Loot Tracker] 初始化超时，但继续尝试..');
                
                // 即使超时也尝试安装observer
                setupObserver();
                setTimeout(() => {
                    debugShowAllData();
                }, 1000);
            }
        }, 500);
    }

    // 等待页面加载完成
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
        logInit('[Better Loot Tracker] Waiting for DOMContentLoaded');
    } else {
        logInit('[Better Loot Tracker] DOM already loaded, initializing immediately');
        init();
    }

    // 添加一个全局标识，确认插件已加载
    window.EnhancementLootTrackerLoaded = true;
    logInit('[Better Loot Tracker] Plugin loaded successfully');

    // 添加全局测试函数
    window.testEnhancementLootTracker = function() {
        logCalc('[Better Loot Tracker] 手动测试开始..');
        debugShowAllData();
        processLootLogs({ force: true });
    };

})();



