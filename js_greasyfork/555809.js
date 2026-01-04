// ==UserScript==
// @name         MWI Transmute Calculator Enhanced
// @namespace    http://tampermonkey.net/
// @version      5.0.3
// @description  計算煉金轉化期望收益 - 整合玩家數據精確計算
// @author       Riysin & Enhanced
// @match        https://www.milkywayidle.com/*
// @match        https://www.milkywayidlecn.com/*
// @icon         https://www.milkywayidle.com/favicon.svg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/555809/MWI%20Transmute%20Calculator%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/555809/MWI%20Transmute%20Calculator%20Enhanced.meta.js
// ==/UserScript==

/* global mwi */

(function () {
    'use strict';

    if (!window.mwi) {
        console.error("MWI Transmute Calculator 需要安裝 mooket 才能使用");
        return;
    }

    // ===== 常量定義 =====
    const FAVORITES_KEY = 'transmute_favorites';
    const FEE_RATE = 0.98;

    const TRADE_MODES = {
        highBuyLowSell: { getName: () => '高買低賣', inputMode: 'ask', outputMode: 'bid' },
        highBuyHighSell: { getName: () => '高買高賣', inputMode: 'ask', outputMode: 'ask' },
        lowBuyHighSell: { getName: () => '低買高賣', inputMode: 'bid', outputMode: 'ask' },
        lowBuyLowSell: { getName: () => '低買低賣', inputMode: 'bid', outputMode: 'bid' }
    };

    const CATALYSTS = {
        transmute: {
            none: { getName: () => '不使用', itemHrid: null, successBonusMultiplier: 0, cost: 0 },
            transmute: { getName: () => '轉化催化劑', itemHrid: '/items/catalyst_of_transmutation', successBonusMultiplier: 0.15, cost: null },
            prime: { getName: () => '至尊催化劑', itemHrid: '/items/prime_catalyst', successBonusMultiplier: 0.25, cost: null }
        },
        midas: {
            none: { getName: () => '不使用', itemHrid: null, successBonusMultiplier: 0, cost: 0 },
            midas: { getName: () => '點金催化劑', itemHrid: '/items/catalyst_of_coinification', successBonusMultiplier: 0.15, cost: null },
            prime: { getName: () => '至尊催化劑', itemHrid: '/items/prime_catalyst', successBonusMultiplier: 0.25, cost: null }
        },
        disassemble: {
            none: { getName: () => '不使用', itemHrid: null, successBonusMultiplier: 0, cost: 0 },
            disassemble: { getName: () => '分解催化劑', itemHrid: '/items/catalyst_of_decomposition', successBonusMultiplier: 0.15, cost: null },
            prime: { getName: () => '至尊催化劑', itemHrid: '/items/prime_catalyst', successBonusMultiplier: 0.25, cost: null }
        }
    };

    const ALCHEMY_MODES = {
        transmute: { getName: () => '轉化', icon: '⚗️' },
        midas: { getName: () => '點金', icon: '💰' },
        disassemble: { getName: () => '分解', icon: '🔨' }
    };

    const GATHERING_SKILLS = ['/item_categories/milking', '/item_categories/foraging', '/item_categories/woodcutting'];

    // ===== 全局狀態 =====
    let manualCatalyticTea = false;
    const goldCostCache = new Map();

    // ===== Buff 系統 =====
    class Buff {
        constructor() {
            this.artisan = 0;
            this.action_speed = 0;
            this.alchemy_success = 0;
            this.blessed = 0;
            this.combat_drop_quantity = 0;
            this.efficiency = 0;
            this.essence_find = 0;
            this.enhancing_success = 0;
            this.gathering = 0;
            this.wisdom = 0;
            this.processing = 0;
            this.rare_find = 0;
        }

        static fromBuffs(buffs) {
            const buff = new Buff();
            if (!buffs) return buff;

            for (const { typeHrid, flatBoost } of buffs) {
                switch (typeHrid) {
                    case "/buff_types/artisan":
                        buff.artisan += flatBoost * 100;
                        break;
                    case "/buff_types/action_level":
                        buff.efficiency -= flatBoost;
                        break;
                    case "/buff_types/action_speed":
                        buff.action_speed += flatBoost * 100;
                        break;
                    case "/buff_types/alchemy_success":
                        buff.alchemy_success += flatBoost * 100;
                        break;
                    case "/buff_types/blessed":
                        buff.blessed += flatBoost * 100;
                        break;
                    case "/buff_types/combat_drop_quantity":
                        buff.combat_drop_quantity += flatBoost * 100;
                        break;
                    case "/buff_types/essence_find":
                        buff.essence_find += flatBoost * 100;
                        break;
                    case "/buff_types/efficiency":
                        buff.efficiency += flatBoost * 100;
                        break;
                    case "/buff_types/enhancing_success":
                        buff.enhancing_success += flatBoost * 100;
                        break;
                    case "/buff_types/gathering":
                    case "/buff_types/gourmet":
                        buff.gathering += flatBoost * 100;
                        break;
                    case "/buff_types/wisdom":
                        buff.wisdom += flatBoost * 100;
                        break;
                    case "/buff_types/processing":
                        buff.processing += flatBoost * 100;
                        break;
                    case "/buff_types/rare_find":
                        buff.rare_find += flatBoost * 100;
                        break;
                    default:
                        if (typeHrid.endsWith("_level")) {
                            buff.efficiency += flatBoost;
                        } else {
                            console.warn(`未處理的 buff 類型: ${typeHrid}`);
                        }
                        break;
                }
            }
            return buff;
        }
    }

    class BuffsProvider {
        constructor() {
            this.buffCache = {
                community: new Map(),
                tea: new Map(),
                equipment: new Map(),
                house: new Map()
            };

            this.initializeBuffs();
        }

        initializeBuffs() {
            const alchemyTypeHrid = '/action_types/alchemy';

            try {
                // ===== 方法1：從 initCharacterData 獲取（優先） =====
                let communityBuffs = mwi.initCharacterData?.communityActionTypeBuffsMap?.[alchemyTypeHrid];
                let teaBuffs = mwi.initCharacterData?.consumableActionTypeBuffsMap?.[alchemyTypeHrid];
                let equipmentBuffs = mwi.initCharacterData?.equipmentActionTypeBuffsMap?.[alchemyTypeHrid];
                let houseBuffs = mwi.initCharacterData?.houseActionTypeBuffsMap?.[alchemyTypeHrid];

                // ===== 方法2：如果方法1失敗，嘗試從 characterManager 獲取 =====
                if (!communityBuffs) {
                    communityBuffs = mwi.game?.characterManager?.communityActionTypeBuffsMap?.[alchemyTypeHrid];
                }
                if (!teaBuffs) {
                    teaBuffs = mwi.game?.characterManager?.consumableActionTypeBuffsMap?.[alchemyTypeHrid];
                }
                if (!equipmentBuffs) {
                    equipmentBuffs = mwi.game?.characterManager?.equipmentActionTypeBuffsMap?.[alchemyTypeHrid];
                }
                if (!houseBuffs) {
                    houseBuffs = mwi.game?.characterManager?.houseActionTypeBuffsMap?.[alchemyTypeHrid];
                }

                // 社區 buff
                if (communityBuffs) {
                    this.buffCache.community.set(alchemyTypeHrid, Buff.fromBuffs(communityBuffs));
                    console.log('✅ 社區 buff 已載入:', communityBuffs);
                } else {
                    console.warn('⚠️ 未找到社區 buff');
                }

                // 茶 buff
                if (teaBuffs) {
                    this.buffCache.tea.set(alchemyTypeHrid, Buff.fromBuffs(teaBuffs));
                    console.log('✅ 茶飲 buff 已載入:', teaBuffs);
                } else {
                    console.warn('⚠️ 未找到茶飲 buff');
                }

                // 裝備 buff
                if (equipmentBuffs) {
                    this.buffCache.equipment.set(alchemyTypeHrid, Buff.fromBuffs(equipmentBuffs));
                    console.log('✅ 裝備 buff 已載入:', equipmentBuffs);
                } else {
                    console.warn('⚠️ 未找到裝備 buff');
                }

                // 房子 buff
                if (houseBuffs) {
                    this.buffCache.house.set(alchemyTypeHrid, Buff.fromBuffs(houseBuffs));
                    console.log('✅ 房子 buff 已載入:', houseBuffs);
                } else {
                    console.warn('⚠️ 未找到房子 buff');
                }
            } catch (e) {
                console.error('初始化 Buff 時發生錯誤:', e);
            }
        }

        getCommunityBuff() {
            return this.buffCache.community.get('/action_types/alchemy') || new Buff();
        }

        getTeaBuffs() {
            return this.buffCache.tea.get('/action_types/alchemy') || new Buff();
        }

        getHouseBuff() {
            return this.buffCache.house.get('/action_types/alchemy') || new Buff();
        }

        getEquipmentBuff() {
            return this.buffCache.equipment.get('/action_types/alchemy') || new Buff();
        }

        getTotalAlchemySuccessBuff() {
            const community = this.getCommunityBuff().alchemy_success;
            const tea = this.getTeaBuffs().alchemy_success;
            const house = this.getHouseBuff().alchemy_success;
            const equipment = this.getEquipmentBuff().alchemy_success;
            const total = community + tea + house + equipment;
            console.log(`成功率 Buff: 社區${community}% + 茶${tea}% + 房${house}% + 裝${equipment}% = ${total}%`);
            return total;
        }

        getTotalEfficiencyBuff() {
            const community = this.getCommunityBuff().efficiency;
            const tea = this.getTeaBuffs().efficiency;
            const house = this.getHouseBuff().efficiency;
            const equipment = this.getEquipmentBuff().efficiency;
            const total = community + tea + house + equipment;
            console.log(`效率 Buff: 社區${community}% + 茶${tea}% + 房${house}% + 裝${equipment}% = ${total}%`);
            return total;
        }

        getTotalActionSpeedBuff() {
            const community = this.getCommunityBuff().action_speed;
            const tea = this.getTeaBuffs().action_speed;
            const house = this.getHouseBuff().action_speed;
            const equipment = this.getEquipmentBuff().action_speed;
            const total = community + tea + house + equipment;
            console.log(`速度 Buff: 社區${community}% + 茶${tea}% + 房${house}% + 裝${equipment}% = ${total}%`);
            return total;
        }

        getBuffBreakdown() {
            return {
                community: this.getCommunityBuff(),
                tea: this.getTeaBuffs(),
                house: this.getHouseBuff(),
                equipment: this.getEquipmentBuff()
            };
        }
    }

    // ===== 物品識別系統 =====
    class ItemIdentifier {
        constructor() {
            this.nameToHridMap = new Map();
            this.hridToZhNameMap = new Map();
            this.initialized = false;
        }

        initialize() {
            if (this.initialized) return;

            const itemDetailMap = mwi.initClientData?.itemDetailMap;
            if (!itemDetailMap) {
                console.error('無法獲取 itemDetailMap');
                return;
            }

            for (const [hrid, detail] of Object.entries(itemDetailMap)) {
                const itemId = hrid.replace('/items/', '');
                this.nameToHridMap.set(hrid, hrid);
                this.nameToHridMap.set(itemId, hrid);

                const zhName = mwi.lang?.zh?.translation?.itemNames?.[hrid];
                if (zhName) {
                    this.addNameMapping(zhName, hrid);
                    this.hridToZhNameMap.set(hrid, zhName);
                }

                const enName = mwi.lang?.en?.translation?.itemNames?.[hrid];
                if (enName) {
                    this.addNameMapping(enName, hrid);
                }
            }

            this.initialized = true;
            console.log(`✅ 物品識別系統初始化完成：${this.nameToHridMap.size} 個映射`);
        }

        addNameMapping(name, hrid) {
            this.nameToHridMap.set(name, hrid);
            this.nameToHridMap.set(name.toLowerCase(), hrid);
            this.nameToHridMap.set(name.replace(/\s+/g, ''), hrid);
        }

        getHridFromName(name) {
            if (!name) return null;
            const cleanName = name.trim();
            return this.nameToHridMap.get(cleanName) ||
                   this.nameToHridMap.get(cleanName.toLowerCase()) ||
                   this.nameToHridMap.get(cleanName.replace(/\s+/g, '')) ||
                   null;
        }

        searchByName(searchTerm, exactOnly = false) {
            const results = [];
            const term = searchTerm.trim();
            const lowerTerm = term.toLowerCase();

            for (const [hrid, zhName] of this.hridToZhNameMap.entries()) {
                const isExact = zhName === term;
                const isPartial = !exactOnly && zhName.toLowerCase().includes(lowerTerm);

                if (isExact || isPartial) {
                    results.push({ hrid, name: zhName, exact: isExact });
                }
            }

            return results.sort((a, b) => b.exact - a.exact);
        }
    }

    const itemIdentifier = new ItemIdentifier();

    // ===== 收藏功能 =====
    function getFavorites() {
        try {
            const saved = localStorage.getItem(FAVORITES_KEY);
            return saved ? JSON.parse(saved) : [];
        } catch (e) {
            return [];
        }
    }

    function saveFavorites(favorites) {
        try {
            localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
        } catch (e) {
            console.error('無法儲存收藏:', e);
        }
    }

    function toggleFavorite(itemHrid) {
        const favorites = getFavorites();
        const index = favorites.indexOf(itemHrid);

        if (index > -1) {
            favorites.splice(index, 1);
        } else {
            favorites.push(itemHrid);
        }

        saveFavorites(favorites);
        return index === -1;
    }

    function isFavorite(itemHrid) {
        return getFavorites().includes(itemHrid);
    }

    // ===== 價格相關函數 =====
    function safeGetPrice(itemHrid, enhancementLevel = 0, priceType = 'bid') {
        try {
            const priceObj = mwi.coreMarket.getItemPrice(itemHrid, enhancementLevel);
            const price = priceObj?.[priceType];
            return (price !== undefined && price !== null && price >= 0) ? price : null;
        } catch (e) {
            return null;
        }
    }

    function getBestSellPrice(itemHrid, enhancementLevel = 0, preferredPriceType = 'bid') {
        const itemName = getItemName(itemHrid);
        const preferredPrice = safeGetPrice(itemHrid, enhancementLevel, preferredPriceType);

        // 如果有首選價格，使用它
        if (preferredPrice !== null && preferredPrice > 0) {
            return preferredPrice * FEE_RATE;
        }

        // 【重要邏輯】
        // 如果條件設定為高賣(ask)，但沒有高賣價 → 嘗試使用低賣(bid)
        // 如果條件設定為低賣(bid)，但沒有低賣價 → 直接返回 0（不嘗試 ask）

        if (preferredPriceType === 'ask') {
            // 高賣模式：沒有 ask，嘗試 bid
            const bidPrice = safeGetPrice(itemHrid, enhancementLevel, 'bid');
            if (bidPrice !== null && bidPrice > 0) {
                console.log(`⚠️ ${itemName} 沒有高賣(ask)價格，使用低賣(bid)價格: ${bidPrice}`);
                return bidPrice * FEE_RATE;
            }
            // bid 也沒有，返回 0
            console.warn(`⚠️ ${itemName} 沒有任何賣價，使用 0 元計算`);
            return 0;
        } else {
            // 低賣模式：沒有 bid，直接返回 0（不使用 ask）
            console.warn(`⚠️ ${itemName} 沒有低賣(bid)價格，使用 0 元計算`);
            return 0;
        }
    }

    function hasMarketPrice(itemHrid, enhancementLevel = 0) {
        try {
            const price = mwi.coreMarket.getItemPrice(itemHrid, enhancementLevel, true);
            return price && price.ask > 0 && price.bid > 0;
        } catch (e) {
            return false;
        }
    }

    // ===== 遊戲狀態檢測 =====
    function hasCatalyticTeaBuff() {
        if (manualCatalyticTea) return true;

        try {
            const buffs = mwi.game?.characterManager?.buffs;
            if (!buffs) return false;

            for (const buffHrid of Object.keys(buffs)) {
                if (buffHrid.includes('catalytic') || buffHrid.includes('tea')) {
                    console.log(`✅ 檢測到催化茶 buff: ${buffHrid}`);
                    return true;
                }
            }
            return false;
        } catch (e) {
            console.warn('無法檢測催化茶 buff:', e);
            return false;
        }
    }

    function getAlchemyLevel() {
        try {
            // 方法1: 從 game.state 獲取
            const skillMap = mwi.game?.state?.characterSkillMap;
            if (skillMap) {
                const alchemySkill = skillMap.get('/skills/alchemy');
                if (alchemySkill?.level) {
                    return alchemySkill.level;
                }
            }

            // 方法2: 從 characterManager 獲取
            const skills = mwi.game?.characterManager?.skills;
            if (skills) {
                const alchemySkill = skills['/skills/alchemy'];
                if (alchemySkill?.level) {
                    return alchemySkill.level;
                }
            }

            // 方法3: 從 initCharacterData 獲取
            const characterSkills = mwi.initCharacterData?.characterSkills;
            if (Array.isArray(characterSkills)) {
                const alchemySkill = characterSkills.find(s => s.skillHrid === '/skills/alchemy');
                if (alchemySkill?.level) {
                    return alchemySkill.level;
                }
            }

            console.warn('無法獲取煉金等級，使用預設值 1');
            return 1;
        } catch (e) {
            console.warn('獲取煉金等級時發生錯誤:', e);
            return 1;
        }
    }

    function getAlchemyActionBaseTime(itemHrid, mode = 'transmute') {
        try {
            // 煉金動作路徑格式：/actions/alchemy/{mode}
            // mode 可以是：transmute, decompose, coinify
            const actionHrid = `/actions/alchemy/${mode}`;
            const actionDetail = mwi.initClientData?.actionDetailMap?.[actionHrid];

            if (actionDetail?.baseTimeCost) {
                const timeInSeconds = actionDetail.baseTimeCost / 1000000000;
                console.log(`✅ ${mode} 模式基礎時間: ${timeInSeconds}秒`);
                return timeInSeconds;
            }

            console.warn(`⚠️ 無法找到 ${mode} 動作，使用預設 20 秒`);
            return 20;
        } catch (e) {
            console.warn('❌ 獲取煉金動作時間錯誤:', e);
            return 20;
        }
    }

    function getEquipmentActionSpeed() {
        try {
            const buffs = window.alchemyBuffsProvider || new BuffsProvider();
            const equipmentBuff = buffs.getEquipmentBuff();

            // action_speed 是裝備（如工具、速度項鍊）提供的速度加成
            return equipmentBuff.action_speed || 0;
        } catch (e) {
            console.warn('無法獲取裝備速度:', e);
            return 0;
        }
    }

    function calculateAlchemyEfficiency(itemHrid) {
        try {
            const alchemyLevel = getAlchemyLevel();
            const itemLevel = getItemLevel(itemHrid);

            // 1. 等級碾壓效率：(玩家等級 - 物品等級)%
            const levelCrushEfficiency = Math.max(0, alchemyLevel - itemLevel);

            // 2. 獲取各種 efficiency buff
            const buffs = window.alchemyBuffsProvider || new BuffsProvider();
            const communityEfficiency = buffs.getCommunityBuff().efficiency;
            const teaEfficiency = buffs.getTeaBuffs().efficiency;
            const houseEfficiency = buffs.getHouseBuff().efficiency;
            const equipmentEfficiency = buffs.getEquipmentBuff().efficiency;

            // 3. 總效率 = 1 + 所有效率加成%
            const totalEfficiencyPercent = levelCrushEfficiency + communityEfficiency +
                  teaEfficiency + houseEfficiency + equipmentEfficiency;

            const totalEfficiency = 1 + (totalEfficiencyPercent / 100);

            console.log(`📊 效率計算 (${getItemName(itemHrid)}):`);
            console.log(`  等級碾壓: Lv${alchemyLevel} - Lv${itemLevel} = +${levelCrushEfficiency}%`);
            console.log(`  社區: +${communityEfficiency}%`);
            console.log(`  茶飲: +${teaEfficiency}%`);
            console.log(`  房屋: +${houseEfficiency}%`);
            console.log(`  裝備: +${equipmentEfficiency}%`);
            console.log(`  總效率: ${totalEfficiency.toFixed(3)}x (${totalEfficiencyPercent}%)`);

            return {
                totalEfficiency,
                breakdown: {
                    levelCrush: levelCrushEfficiency,
                    community: communityEfficiency,
                    tea: teaEfficiency,
                    house: houseEfficiency,
                    equipment: equipmentEfficiency,
                    total: totalEfficiencyPercent
                }
            };
        } catch (e) {
            console.error('計算效率時發生錯誤:', e);
            return { totalEfficiency: 1, breakdown: {} };
        }
    }

    function calculateActionTime(itemHrid) {
        try {
            // 1. 基礎動作時間（工具決定）
            const baseTime = getAlchemyActionBaseTime(itemHrid);

            // 2. 速度加成（工具 + 速度項鍊等）
            const actionSpeedPercent = getEquipmentActionSpeed();

            // 3. 實際時間 = 基礎時間 / (1 + 速度%)
            const actualTime = baseTime / (1 + actionSpeedPercent / 100);

            console.log(`⏱️ 時間計算 (${getItemName(itemHrid)}):`);
            console.log(`  基礎時間: ${baseTime}秒`);
            console.log(`  速度加成: +${actionSpeedPercent}%`);
            console.log(`  實際時間: ${actualTime.toFixed(2)}秒`);

            return {
                baseTime,
                actionSpeedPercent,
                actualTime
            };
        } catch (e) {
            console.error('計算時間時發生錯誤:', e);
            return { baseTime: 5, actionSpeedPercent: 0, actualTime: 5 };
        }
    }

    function getAlchemyEfficiency() {
        try {
            const skills = mwi.game?.characterManager?.skills;
            if (!skills) return 1;

            const alchemySkill = skills['/skills/alchemy'];
            if (!alchemySkill) return 1;

            const level = alchemySkill.level || 1;

            // 基礎效率：等級 * 1%
            const baseEfficiency = 1 + (level * 0.01);

            // 獲取 buff 加成
            const buffs = window.alchemyBuffsProvider || new BuffsProvider();
            const totalEfficiencyBuff = buffs.getTotalEfficiencyBuff();

            // 總效率 = 基礎效率 * (1 + buff加成%)
            const totalEfficiency = baseEfficiency * (1 + totalEfficiencyBuff / 100);

            console.log(`煉金效率: Lv${level} = ${baseEfficiency.toFixed(2)} × (1 + ${totalEfficiencyBuff}%) = ${totalEfficiency.toFixed(2)}`);

            return totalEfficiency;
        } catch (e) {
            console.warn('無法獲取煉金效率:', e);
            return 1;
        }
    }

    function isGatheringItem(itemHrid) {
        const itemDetail = mwi.initClientData?.itemDetailMap?.[itemHrid];
        if (!itemDetail) return false;
        return GATHERING_SKILLS.includes(itemDetail.categoryHrid);
    }

    function getItemLevel(itemHrid) {
        const itemDetail = mwi.initClientData?.itemDetailMap?.[itemHrid];
        return itemDetail?.itemLevel || 1;
    }

    // ===== 金幣成本計算 =====
    function calculateGoldCost(itemHrid, mode = 'transmute') {
        const cacheKey = `${itemHrid}_${mode}`;
        if (goldCostCache.has(cacheKey)) {
            return goldCostCache.get(cacheKey);
        }

        const itemDetail = mwi.initClientData?.itemDetailMap?.[itemHrid];
        if (!itemDetail) return 0;

        let goldCost = 0;

        if (mode === 'transmute') {
            const sellPrice = itemDetail.sellPrice || 0;
            const categoryHrid = itemDetail.categoryHrid || '';
            const itemName = getItemName(itemHrid);

            goldCost = Math.floor(sellPrice * 0.2);
            let minCost = 100;

            const specialCategories = {
                essence: 500,
                leather: 50,
                plank: 50,
                wood: 50
            };

            for (const [key, cost] of Object.entries(specialCategories)) {
                if (categoryHrid.includes(key) || itemHrid.includes(key) || itemName.includes(key)) {
                    minCost = cost;
                    break;
                }
            }

            if (categoryHrid.includes('food') || categoryHrid.includes('consumable') ||
                categoryHrid.includes('drink') || categoryHrid.includes('beverage')) {
                const keywords = ['cake', 'donut', 'yogurt', 'gummy', 'candy', 'coffee', 'tea',
                                '蛋糕', '甜甜圈', '酸奶', '軟糖', '糖果', '咖啡', '茶'];
                if (keywords.some(kw => itemHrid.includes(kw) || itemName.includes(kw))) {
                    minCost = 50;
                }
            }

            goldCost = Math.max(goldCost, minCost);

        } else if (mode === 'disassemble') {
            const itemLevel = getItemLevel(itemHrid);
            const isGathering = isGatheringItem(itemHrid);
            goldCost = 50 + itemLevel * (isGathering ? 10 : 5);
        }

        goldCostCache.set(cacheKey, goldCost);
        return goldCost;
    }

    function calculateMidasGold(itemHrid) {
        const itemDetail = mwi.initClientData?.itemDetailMap?.[itemHrid];
        if (!itemDetail) return 0;

        const sellPrice = itemDetail.sellPrice || 0;
        const isGathering = isGatheringItem(itemHrid);

        return sellPrice * (isGathering ? 10 : 5);
    }

    // 獲取基礎成功率
    function getBaseSuccessRate(alchemyDetail, mode) {
        let baseRate;

        // 點金固定 70%
        if (mode === 'midas') {
            baseRate = 0.7;
        }
        // 分解固定 60%
        else if (mode === 'disassemble') {
            baseRate = 0.6;
        }
        // 轉化模式使用 transmuteSuccessRate
        else {
            const transmuteRate = alchemyDetail?.transmuteSuccessRate;
            // 如果沒有轉化成功率，預設為 100%
            if (transmuteRate === null || transmuteRate === undefined) {
                baseRate = 1;
            } else {
                baseRate = transmuteRate;
            }
        }

        // 應用煉金成功率 buff
        const buffs = window.alchemyBuffsProvider || new BuffsProvider();
        const successBuff = buffs.getTotalAlchemySuccessBuff();

        if (successBuff > 0) {
            // 成功率 buff 是乘法加成
            const buffedRate = Math.min(1, baseRate * (1 + successBuff / 100));
            console.log(`基礎成功率: ${(baseRate * 100).toFixed(1)}% → 加成後: ${(buffedRate * 100).toFixed(1)}% (+${successBuff}%)`);
            return buffedRate;
        }

        return baseRate;
    }

    // ===== 工具函數 =====
    function setupBuffUpdateListeners() {
        // 監聽 WebSocket 訊息來更新 buff
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        const oriGet = dataProperty.get;

        dataProperty.get = function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) {
                return oriGet.call(this);
            }

            if (socket.url.indexOf("api.milkywayidle.com/ws") <= -1 &&
                socket.url.indexOf("api-test.milkywayidle.com/ws") <= -1) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message });

            try {
                const data = JSON.parse(message);
                const buffsProvider = window.alchemyBuffsProvider;

                // 監聽 init_character_data 來更新 mwi.initCharacterData
                if (data.type === 'init_character_data') {
                    console.log('🔄 檢測到角色數據初始化');

                    // 更新 initCharacterData
                    if (data.communityActionTypeBuffsMap) {
                        mwi.initCharacterData = mwi.initCharacterData || {};
                        mwi.initCharacterData.communityActionTypeBuffsMap = data.communityActionTypeBuffsMap;
                    }
                    if (data.consumableActionTypeBuffsMap) {
                        mwi.initCharacterData = mwi.initCharacterData || {};
                        mwi.initCharacterData.consumableActionTypeBuffsMap = data.consumableActionTypeBuffsMap;
                    }
                    if (data.equipmentActionTypeBuffsMap) {
                        mwi.initCharacterData = mwi.initCharacterData || {};
                        mwi.initCharacterData.equipmentActionTypeBuffsMap = data.equipmentActionTypeBuffsMap;
                    }
                    if (data.houseActionTypeBuffsMap) {
                        mwi.initCharacterData = mwi.initCharacterData || {};
                        mwi.initCharacterData.houseActionTypeBuffsMap = data.houseActionTypeBuffsMap;
                    }

                    if (buffsProvider) {
                        buffsProvider.initializeBuffs();
                    }
                }
                // 監聽 buff 更新事件
                else if (data.type === 'community_buffs_updated' ||
                         data.type === 'consumable_buffs_updated' ||
                         data.type === 'equipment_buffs_updated' ||
                         data.type === 'house_rooms_updated') {

                    console.log(`🔄 檢測到 buff 更新: ${data.type}`);

                    // 更新對應的 initCharacterData
                    if (data.type === 'community_buffs_updated' && data.communityActionTypeBuffsMap) {
                        mwi.initCharacterData = mwi.initCharacterData || {};
                        mwi.initCharacterData.communityActionTypeBuffsMap = data.communityActionTypeBuffsMap;
                    }
                    if (data.type === 'consumable_buffs_updated' && data.consumableActionTypeBuffsMap) {
                        mwi.initCharacterData = mwi.initCharacterData || {};
                        mwi.initCharacterData.consumableActionTypeBuffsMap = data.consumableActionTypeBuffsMap;
                    }
                    if (data.type === 'equipment_buffs_updated' && data.equipmentActionTypeBuffsMap) {
                        mwi.initCharacterData = mwi.initCharacterData || {};
                        mwi.initCharacterData.equipmentActionTypeBuffsMap = data.equipmentActionTypeBuffsMap;
                    }
                    if (data.type === 'house_rooms_updated' && data.houseActionTypeBuffsMap) {
                        mwi.initCharacterData = mwi.initCharacterData || {};
                        mwi.initCharacterData.houseActionTypeBuffsMap = data.houseActionTypeBuffsMap;
                    }

                    if (buffsProvider) {
                        buffsProvider.initializeBuffs();
                    }
                }
            } catch (e) {
                // 忽略非 JSON 訊息
            }

            return message;
        };

        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
    }

    function waitForInit() {
        return new Promise((resolve) => {
            const checkInit = () => {
                if (window.mwi?.coreMarket && window.mwi?.initClientData && window.mwi?.lang) {
                    itemIdentifier.initialize();

                    const maxWaitTime = 10000;
                    const startTime = Date.now();

                    const waitForCharacterData = () => {
                        if (mwi.initCharacterData?.communityActionTypeBuffsMap ||
                            Date.now() - startTime > maxWaitTime) {

                            window.alchemyBuffsProvider = new BuffsProvider();
                            console.log('✅ Buff 系統初始化完成');

                            setupBuffUpdateListeners();
                            manualCatalyticTea = true;

                            // 自動偵測暴飲袋並設定 UI
                            const satchelInfo = detectSatchel();
                            if (satchelInfo.equipped) {
                                // 等待 UI 創建後再設定
                                setTimeout(() => {
                                    const satchelCheckbox = document.getElementById('satchel-checkbox');
                                    const satchelLevelSelect = document.getElementById('satchel-level-select');
                                    if (satchelCheckbox && satchelLevelSelect) {
                                        satchelCheckbox.checked = true;
                                        satchelLevelSelect.value = satchelInfo.level;
                                        satchelLevelSelect.disabled = false;
                                        console.log(`✅ 已自動設定暴飲袋 +${satchelInfo.level}`);
                                    }
                                }, 100);
                            }

                            resolve();
                        } else {
                            setTimeout(waitForCharacterData, 100);
                        }
                    };

                    waitForCharacterData();
                } else {
                    setTimeout(checkInit, 500);
                }
            };
            checkInit();
        });
    }

    function showNumber(num, forceNoSign = false) {
        if (num === null || num === undefined || isNaN(num)) return "N/A";
        if (num === 0) return "0";

        const sign = (!forceNoSign && num > 0) ? '+' : '';
        const absNum = Math.abs(num);

        if (absNum >= 1e10) return `${sign}${(num / 1e9).toFixed(1)}B`;
        if (absNum >= 1e7) return `${sign}${(num / 1e6).toFixed(1)}M`;
        if (absNum >= 1e5) return `${sign}${Math.floor(num / 1e3)}K`;
        return `${sign}${Math.floor(num)}`;
    }

    function getItemName(itemHrid) {
        if (!itemHrid) return "Unknown";
        return itemIdentifier.hridToZhNameMap.get(itemHrid) ||
               mwi.lang?.zh?.translation?.itemNames?.[itemHrid] ||
               itemHrid;
    }

    function goToMarketPage(itemHrid) {
        try {
            if (mwi.game?.handleGoToMarketplace) {
                mwi.game.handleGoToMarketplace(itemHrid, 0);
                console.log(`跳轉到市場頁面: ${itemHrid}`);

                // 如果詳細計算頁面已打開，等待市場數據加載後自動刷新
                const modal = document.getElementById('transmute-detail-modal');
                if (modal && modal.style.display === 'flex' && window.currentDetailResult && window.currentDetailTradeMode) {
                    console.log('💡 等待市場數據加載...');

                    // 輪詢檢查市場數據是否加載完成
                    let checkCount = 0;
                    const maxChecks = 20; // 最多檢查 2 秒 (20 × 100ms)

                    const checkInterval = setInterval(() => {
                        checkCount++;

                        const orderBooks = mwi.game?.state?.marketItemOrderBooks;

                        // 檢查是否加載了目標物品的市場數據
                        if (orderBooks && orderBooks.itemHrid === itemHrid) {
                            console.log('✅ 市場數據已加載，刷新詳細頁面');
                            clearInterval(checkInterval);

                            // 刷新詳細計算頁面
                            showDetailedCalculation(window.currentDetailResult, window.currentDetailTradeMode);
                        } else if (checkCount >= maxChecks) {
                            console.warn('⏱️ 市場數據加載超時');
                            clearInterval(checkInterval);
                        }
                    }, 100);
                }
            } else {
                console.error('handleGoToMarketplace 方法不可用');
            }
        } catch (e) {
            console.error('跳轉市場頁面失敗:', e);
        }
    }

    function outputContainsInput(recipe) {
        const inputHrid = recipe.inputItemHrid;
        const allOutputs = [...recipe.outputItems, ...recipe.essenceDrops, ...recipe.rareDrops];
        return allOutputs.some(output => output.itemHrid === inputHrid);
    }

    // ===== 配方掃描 =====
    function getAllAlchemyRecipes(mode = 'transmute') {
        const recipes = [];
        const itemDetailMap = mwi.initClientData?.itemDetailMap;

        if (!itemDetailMap) {
            console.error('無法獲取 itemDetailMap');
            return recipes;
        }

        console.log(`=== 開始掃描${ALCHEMY_MODES[mode].getName()}配方 ===`);

        for (const [itemHrid, itemDetail] of Object.entries(itemDetailMap)) {
            const alchemyDetail = itemDetail.alchemyDetail;
            if (!alchemyDetail) continue;

            try {
                let recipe = null;

                if (mode === 'transmute') {
                    const dropTable = alchemyDetail.transmuteDropTable;
                    if (!Array.isArray(dropTable) || dropTable.length === 0) continue;

                    // 獲取 bulkMultiplier（一次動作消耗和產出的倍數）
                    const bulkMultiplier = alchemyDetail.bulkMultiplier || 1;

                    const outputItems = [];
                    const essenceDrops = [];
                    const rareDrops = [];

                    dropTable.forEach(drop => {
                        const dropItem = {
                            itemHrid: drop.itemHrid,
                            count: (drop.maxCount || drop.minCount || 1) * bulkMultiplier, // 乘以 bulkMultiplier
                            rate: drop.dropRate || 1
                        };

                        const dropItemDetail = itemDetailMap[drop.itemHrid];
                        if (dropItemDetail?.categoryHrid === '/item_categories/essence') {
                            essenceDrops.push(dropItem);
                        } else if (drop.dropRate < 0.01) {
                            rareDrops.push(dropItem);
                        } else {
                            outputItems.push(dropItem);
                        }
                    });

                    recipe = {
                        mode: 'transmute',
                        actionHrid: `/actions/alchemy/transmute${itemHrid}`,
                        name: getItemName(itemHrid),
                        inputItemHrid: itemHrid,
                        inputItems: [{ itemHrid, enhancementLevel: 0, count: bulkMultiplier }], // 消耗數量
                        outputItems,
                        essenceDrops,
                        rareDrops,
                        goldCost: calculateGoldCost(itemHrid, 'transmute') * bulkMultiplier, // 金幣成本
                        baseSuccessRate: getBaseSuccessRate(alchemyDetail, 'transmute'),
                        successRate: getBaseSuccessRate(alchemyDetail, 'transmute'),
                        catalystItemHrid: null,
                        valid: true,
                        missingPrices: [],
                        timestamp: Date.now(),
                        bulkMultiplier: bulkMultiplier // 保存供後續使用
                    };

                } else if (mode === 'midas') {
                    if (!alchemyDetail.isCoinifiable) continue;

                    const bulkMultiplier = alchemyDetail.bulkMultiplier || 1;
                    const goldAmount = calculateMidasGold(itemHrid) * bulkMultiplier;
                    if (goldAmount === 0) continue;

                    const baseSuccessRate = getBaseSuccessRate(alchemyDetail, 'midas');

                    recipe = {
                        mode: 'midas',
                        actionHrid: `/actions/alchemy/midas${itemHrid}`,
                        name: getItemName(itemHrid),
                        inputItemHrid: itemHrid,
                        inputItems: [{ itemHrid, enhancementLevel: 0, count: bulkMultiplier }],
                        outputItems: [{
                            itemHrid: 'GOLD',
                            count: goldAmount,
                            rate: 1,
                            isGold: true
                        }],
                        essenceDrops: [],
                        rareDrops: [],
                        goldCost: 0,
                        baseSuccessRate: baseSuccessRate,
                        successRate: baseSuccessRate,
                        catalystItemHrid: null,
                        valid: true,
                        missingPrices: [],
                        timestamp: Date.now(),
                        bulkMultiplier: bulkMultiplier
                    };

                } else if (mode === 'disassemble') {
                    const decomposeItems = alchemyDetail.decomposeItems;
                    if (!Array.isArray(decomposeItems) || decomposeItems.length === 0) continue;

                    const bulkMultiplier = alchemyDetail.bulkMultiplier || 1;

                    const outputItems = decomposeItems.map(item => ({
                        itemHrid: item.itemHrid,
                        count: (item.count || 1) * bulkMultiplier,
                        rate: 1
                    }));

                    const baseSuccessRate = getBaseSuccessRate(alchemyDetail, 'disassemble');

                    recipe = {
                        mode: 'disassemble',
                        actionHrid: `/actions/alchemy/disassemble${itemHrid}`,
                        name: getItemName(itemHrid),
                        inputItemHrid: itemHrid,
                        inputItems: [{ itemHrid, enhancementLevel: 0, count: bulkMultiplier }],
                        outputItems,
                        essenceDrops: [],
                        rareDrops: [],
                        goldCost: calculateGoldCost(itemHrid, 'disassemble') * bulkMultiplier,
                        baseSuccessRate: baseSuccessRate,
                        successRate: baseSuccessRate,
                        catalystItemHrid: null,
                        valid: true,
                        missingPrices: [],
                        timestamp: Date.now(),
                        bulkMultiplier: bulkMultiplier
                    };
                }

                if (recipe) {
                    console.log(`✅ 找到配方: ${recipe.name} (基礎成功率:${(recipe.baseSuccessRate * 100).toFixed(0)}%)`);
                    recipes.push(recipe);
                }

            } catch (e) {
                console.error(`❌ 解析配方失敗: ${itemHrid}`, e);
            }
        }

        console.log(`=== 掃描完成，找到 ${recipes.length} 個${ALCHEMY_MODES[mode].getName()}配方 ===`);
        return recipes;
    }

    function calculateExpectedValue(recipe, tradeMode = 'highBuyLowSell') {
        const mode = TRADE_MODES[tradeMode];
        const result = {
            ...recipe,
            inputCost: 0,
            outputValue: 0,
            essenceValue: 0,
            rareValue: 0,
            catalystCost: 0,
            expectedValue: 0,
            tradeMode,
            spreadRatio: 0,
            dailyProfit: 0,
            actionsPerDay: 0,
            efficiencyBreakdown: {},
            timeBreakdown: {}
        };

        const containsInput = outputContainsInput(recipe);

        // ===== 1. 計算輸入成本 =====
        for (const input of recipe.inputItems) {
            const price = safeGetPrice(input.itemHrid, input.enhancementLevel || 0, mode.inputMode);
            if (price === null || price === 0) {
                result.missingPrices.push(getItemName(input.itemHrid));
                result.valid = false;
            } else {
                result.inputCost += price * input.count;
            }
        }

        // ===== 2. 定義輸出價格獲取函數 =====
        const getOutputPrice = (itemHrid, isGold = false) => {
            if (isGold) return 1;

            if (containsInput && itemHrid === recipe.inputItemHrid) {
                const price = safeGetPrice(itemHrid, 0, mode.inputMode);
                return price !== null ? price * FEE_RATE : null;
            }
            return getBestSellPrice(itemHrid, 0, mode.outputMode);
        };

        // ===== 3. 計算輸出價值 =====
        const calculateOutputValue = (items) => {
            return items.reduce((total, item) => {
                const price = getOutputPrice(item.itemHrid, item.isGold);
                if (price === null || price === 0) {
                    if (!item.isGold) {
                        result.missingPrices.push(getItemName(item.itemHrid));
                        result.valid = false;
                    }
                    return total;
                }
                return total + price * item.count * item.rate * result.successRate;
            }, 0);
        };

        result.outputValue = calculateOutputValue(recipe.outputItems);
        result.essenceValue = calculateOutputValue(recipe.essenceDrops);
        result.rareValue = calculateOutputValue(recipe.rareDrops);

        // ===== 4. 計算催化劑成本 =====
        if (recipe.catalystItemHrid) {
            const price = safeGetPrice(recipe.catalystItemHrid, 0, mode.inputMode);
            if (price !== null && price > 0) {
                result.catalystCost = price * result.successRate;
            }
        }

        // ===== 5. 如果數據有效，計算期望值和日利潤 =====
        if (result.valid) {
            // 5.1 計算期望淨利
            result.expectedValue = result.outputValue + result.essenceValue + result.rareValue
                - result.inputCost - result.catalystCost - result.goldCost;

            // 5.2 計算價差比率（流動性）
            const askPrice = safeGetPrice(recipe.inputItemHrid, 0, 'ask');
            const bidPrice = safeGetPrice(recipe.inputItemHrid, 0, 'bid');
            if (askPrice && bidPrice && askPrice > 0) {
                result.spreadRatio = (bidPrice / askPrice) * 100;
            }

            // ===== 5.3 計算效率 =====
            const alchemyLevel = getAlchemyLevel();
            const itemLevel = getItemLevel(recipe.inputItemHrid);

            // 等級碾壓效率：(玩家等級 - 物品等級)%
            const levelCrushEfficiency = Math.max(0, alchemyLevel - itemLevel);

            // 獲取各種 efficiency buff
            const buffs = window.alchemyBuffsProvider || new BuffsProvider();
            const communityEfficiency = buffs.getCommunityBuff().efficiency;
            const teaEfficiency = buffs.getTeaBuffs().efficiency;
            const houseEfficiency = buffs.getHouseBuff().efficiency;
            const equipmentEfficiency = buffs.getEquipmentBuff().efficiency;

            // 總效率百分比
            const totalEfficiencyPercent = levelCrushEfficiency + communityEfficiency +
                  teaEfficiency + houseEfficiency + equipmentEfficiency;

            // 總效率倍率 = 1 + (總效率% / 100)
            const totalEfficiency = 1 + (totalEfficiencyPercent / 100);

            // 儲存效率分解資訊
            result.efficiencyBreakdown = {
                levelCrush: levelCrushEfficiency,
                community: communityEfficiency,
                tea: teaEfficiency,
                house: houseEfficiency,
                equipment: equipmentEfficiency,
                total: totalEfficiencyPercent,
                multiplier: totalEfficiency
            };

            // ===== 5.4 計算動作時間（傳入 recipe.mode）=====
            // 基礎動作時間（從動作詳情獲取，根據煉金模式）
            const baseTime = getAlchemyActionBaseTime(recipe.inputItemHrid, recipe.mode);

            // 速度加成（工具 + 速度項鍊等）
            const actionSpeedPercent = buffs.getTotalActionSpeedBuff();

            // 實際時間 = 基礎時間 / (1 + 速度%)
            const actualTime = baseTime / (1 + actionSpeedPercent / 100);

            // 儲存時間分解資訊
            result.timeBreakdown = {
                baseTime: baseTime,
                actionSpeedPercent: actionSpeedPercent,
                actualTime: actualTime
            };

            // ===== 5.5 計算每天動作次數 =====
            // 基礎動作次數/天 = 86400秒 / 實際時間
            const baseActionsPerDay = 86400 / actualTime;

            // 應用效率加成得到最終動作次數
            result.actionsPerDay = Math.floor(baseActionsPerDay * totalEfficiency);

            // ===== 5.6 計算日利潤 =====
            result.dailyProfit = result.expectedValue * result.actionsPerDay;
        }

        return result;
    }

    // 自動偵測暴飲袋
    function detectSatchel() {
        try {
            // 從 game.state.characterItemMap 獲取裝備
            const characterItemMap = mwi.game?.state?.characterItemMap;
            if (characterItemMap) {
                for (const [key, item] of characterItemMap.entries()) {
                    // 檢查是否在 pouch 槽位且是 guzzling_pouch
                    if (key.includes('/item_locations/pouch') &&
                        key.includes('/items/guzzling_pouch')) {

                        // 從 key 中提取強化等級
                        // 格式: "561359::/item_locations/pouch::/items/guzzling_pouch::5"
                        const parts = key.split('::');
                        const enhancementLevel = parseInt(parts[parts.length - 1]) || 0;

                        console.log(`✅ 偵測到暴飲袋 +${enhancementLevel}`);
                        return { equipped: true, level: enhancementLevel };
                    }
                }
            }

            console.log('⚠️ 未偵測到暴飲袋');
            return { equipped: false, level: 0 };
        } catch (e) {
            console.warn('偵測暴飲袋時發生錯誤:', e);
            return { equipped: false, level: 0 };
        }
    }

    function calculateWithCatalysts(recipe, tradeMode) {
        const hasCatalyticTea = hasCatalyticTeaBuff();
        let teaBonusMultiplier = hasCatalyticTea ? 0.05 : 0;

        // 檢查暴飲袋 - 優先使用自動偵測，如果手動勾選則使用手動設定
        const satchelCheckbox = document.getElementById('satchel-checkbox');
        const satchelLevelSelect = document.getElementById('satchel-level-select');

        let satchelLevel = 0;
        let useSatchel = false;

        // 如果有手動勾選，使用手動設定
        if (satchelCheckbox?.checked && satchelLevelSelect) {
            satchelLevel = parseInt(satchelLevelSelect.value) || 0;
            useSatchel = true;
            console.log(`🎒 使用手動設定的暴飲袋 +${satchelLevel}`);
        } else {
            // 否則自動偵測
            const detected = detectSatchel();
            if (detected.equipped) {
                satchelLevel = detected.level;
                useSatchel = true;
                console.log(`🎒 自動偵測到暴飲袋 +${satchelLevel}`);
            }
        }

        if (useSatchel && teaBonusMultiplier > 0) {
            const satchelBonus = getSatchelBonus(satchelLevel);
            // 暴飲袋增強茶飲效果
            teaBonusMultiplier = teaBonusMultiplier * (1 + satchelBonus / 100);
            console.log(`🎒 暴飲袋 +${satchelLevel}: ${satchelBonus.toFixed(2)}% 增強`);
            console.log(`🍵 催化茶最終效果: ${(teaBonusMultiplier * 100).toFixed(2)}%`);
        }

        const mode = TRADE_MODES[tradeMode];
        const results = [];

        const catalysts = CATALYSTS[recipe.mode];

        for (const [key, catalyst] of Object.entries(catalysts)) {
            const totalBonusMultiplier = teaBonusMultiplier + catalyst.successBonusMultiplier;
            const finalSuccessRate = Math.min(1, recipe.baseSuccessRate * (1 + totalBonusMultiplier));

            const modifiedRecipe = {
                ...recipe,
                successRate: finalSuccessRate,
                catalystItemHrid: catalyst.itemHrid
            };

            const result = calculateExpectedValue(modifiedRecipe, tradeMode);

            // 如果催化劑有成本，計算催化劑成本
            if (catalyst.itemHrid && catalyst.cost === null) {
                const catalystPrice = safeGetPrice(catalyst.itemHrid, 0, mode.inputMode);
                if (catalystPrice !== null && catalystPrice > 0) {
                    result.catalystCost = catalystPrice * result.successRate;
                    result.expectedValue = result.outputValue + result.essenceValue + result.rareValue
                        - result.inputCost - result.catalystCost - result.goldCost;
                    result.dailyProfit = result.expectedValue * result.actionsPerDay;
                }
            } else if (catalyst.cost) {
                result.catalystCost = catalyst.cost * result.successRate;
                result.expectedValue = result.outputValue + result.essenceValue + result.rareValue
                    - result.inputCost - result.catalystCost - result.goldCost;
                result.dailyProfit = result.expectedValue * result.actionsPerDay;
            }

            Object.assign(result, {
                catalystType: key,
                catalystName: catalyst.getName(),
                finalSuccessRate,
                bonusMultiplier: totalBonusMultiplier,
                hasCatalyticTea,
                usedSatchel: useSatchel,
                satchelLevel: satchelLevel
            });

            results.push(result);
        }

        return results.sort((a, b) => b.expectedValue - a.expectedValue);
    }

    // ===== UI 創建函數 =====
    function createDetailModal() {
        const modal = document.createElement('div');
        modal.id = 'transmute-detail-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%;
            background-color: rgba(0, 0, 0, 0.7); display: none;
            justify-content: center; align-items: center; z-index: 10001;
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: #1a1a2e; border: 2px solid #90a6eb;
            border-radius: 8px; padding: 24px; max-width: 700px;
            max-height: 80vh; overflow-y: auto; color: #e7e7e7;
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.style.display = 'none';
        });

        return { modal, modalContent };
    }

    function showDetailedCalculation(result, tradeMode) {
        window.currentDetailResult = result;
        window.currentDetailTradeMode = tradeMode;

        const { modal, modalContent } = window.transmuteDetailModal;
        const mode = TRADE_MODES[tradeMode];
        const profitRate = result.inputCost > 0 ? ((result.expectedValue / result.inputCost) * 100).toFixed(2) : 0;
        const isProfitable = result.expectedValue > 0;
        const profitColor = isProfitable ? '#00ff00' : '#ff3333';
        const containsInput = outputContainsInput(result);

        // 修正：使用原始基礎成功率
        const baseRecipe = {
            ...result,
            baseSuccessRate: result.baseSuccessRate,
            successRate: result.baseSuccessRate
        };

        const catalystOptions = calculateWithCatalysts(baseRecipe, tradeMode);
        const totalCost = result.inputCost + (result.catalystCost || 0) + (result.goldCost || 0);
        const totalOutput = result.outputValue + (result.essenceValue || 0) + (result.rareValue || 0);

        const modeIcon = ALCHEMY_MODES[result.mode]?.icon || '⚗️';

        let html = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2 style="margin: 0; color: #90a6eb;">${modeIcon} ${result.name}</h2>
            <div style="display: flex; gap: 8px;">
                <button onclick="window.goToMarket_${result.inputItemHrid.replace(/\W/g, '_')}()"
                        style="padding: 6px 12px; background-color: #5668ff; color: white;
                               border: none; border-radius: 6px; cursor: pointer; font-size: 13px;">
                    🛒 前往市場
                </button>
                <button onclick="this.closest('#transmute-detail-modal').style.display='none'"
                        style="padding: 4px 12px; background-color: #282844; color: #e7e7e7;
                               border: 1px solid #90a6eb; border-radius: 4px; cursor: pointer;">✕</button>
            </div>
        </div>

        <div style="background-color: #16213e; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
                <div>
                    <div style="font-size: 24px; font-weight: bold; color: ${profitColor}; margin-bottom: 4px;">
                        ${showNumber(result.expectedValue)}
                    </div>
                    <div style="font-size: 14px; color: #90a6eb;">
                        期望收益 (${isProfitable ? '+' : ''}${profitRate}%)
                    </div>
                    <div style="font-size: 12px; color: #90a6eb; margin-top: 4px;">
                        成功率: ${(result.finalSuccessRate * 100).toFixed(2)}%
                        ${result.catalystName ? ` (${result.catalystName})` : ''}
                    </div>
                </div>
                <div>
                    <div style="font-size: 20px; font-weight: bold; color: #ff69b4; margin-bottom: 4px;">
                        ${showNumber(result.dailyProfit)}
                    </div>
                    <div style="font-size: 14px; color: #90a6eb; margin-bottom: 4px;">
                        預計日利潤
                    </div>
                    <div style="font-size: 11px; color: #888; line-height: 1.4;">
                        86400秒 ÷ ${result.timeBreakdown?.actualTime?.toFixed(2) || '?'}秒 × ${result.efficiencyBreakdown?.multiplier?.toFixed(2) || '1.00'}<br>
                        = ${showNumber(result.actionsPerDay, true)} 次/天
                    </div>
                </div>
            </div>
            ${containsInput ? `
            <div style="font-size: 11px; color: #ffd700; margin-top: 12px; padding: 6px; background: rgba(255, 215, 0, 0.1); border-radius: 4px;">
                ⚠️ 此配方產出包含輸入物品，相同物品使用買入價格計算
            </div>
            ` : ''}
        </div>
    `;

        // 催化劑比較區塊
        if (catalystOptions.length > 0) {
            html += `
        <div style="background-color: #16213e; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
            <h3 style="margin: 0 0 12px 0; color: #90a6eb; font-size: 16px;">
                ⚗️ 催化劑比較
            </h3>
            <div style="font-size: 11px; color: #90a6eb; margin-bottom: 12px; padding: 8px; background: rgba(0,0,0,0.3); border-radius: 4px;">
                最終成功率 = 基礎成功率 × (1 + 催化劑加成 + 催化茶加成)
                ${result.hasCatalyticTea ? `<br>🍵 已檢測到催化茶 buff (+5%)` : ''}
            </div>
        `;

            catalystOptions.forEach(opt => {
                const isSelected = opt.catalystType === result.catalystType;
                const bonusText = opt.bonusMultiplier > 0 ? ` (+${(opt.bonusMultiplier * 100).toFixed(0)}%)` : '';
                html += `
            <div style="padding: 10px; margin-bottom: 8px; border-radius: 6px;
                        background-color: ${isSelected ? 'rgba(144, 166, 235, 0.2)' : '#1a1a2e'};
                        border: 2px solid ${isSelected ? '#90a6eb' : 'transparent'};">
                <div style="display: grid; grid-template-columns: 1fr auto; gap: 12px; align-items: center;">
                    <div>
                        <span style="font-weight: bold; color: #e7e7e7;">${opt.catalystName}</span>
                        ${isSelected ? ' <span style="color: #90a6eb;">✓</span>' : ''}
                        <div style="font-size: 11px; color: #90a6eb; margin-top: 4px;">
                            成功率: ${(opt.finalSuccessRate * 100).toFixed(2)}%${bonusText}
                            ${opt.catalystCost > 0 ? ` | 成本: ${showNumber(opt.catalystCost)}` : ''}
                        </div>
                        <div style="font-size: 11px; color: #ff69b4; margin-top: 2px;">
                            日利: ${showNumber(opt.dailyProfit)}
                        </div>
                    </div>
                    <div style="text-align: right;">
                        <div style="font-weight: bold; color: ${opt.expectedValue > 0 ? '#00ff00' : '#ff3333'}; font-size: 16px;">
                            ${showNumber(opt.expectedValue)}
                        </div>
                    </div>
                </div>
            </div>
            `;
            });

            html += `</div>`;
        }

        html += generateCalculationDetails(result, mode, containsInput, totalCost, totalOutput, profitColor);

        modalContent.innerHTML = html;
        window[`goToMarket_${result.inputItemHrid.replace(/\W/g, '_')}`] = () => goToMarketPage(result.inputItemHrid);
        modal.style.display = 'flex';
    }

    function generatePlayerDataSection(result) {
        const buffs = window.alchemyBuffsProvider || new BuffsProvider();
        const buffBreakdown = buffs.getBuffBreakdown();
        const alchemyLevel = getAlchemyLevel();
        const itemLevel = getItemLevel(result.inputItemHrid);

        return `
    <div style="background-color: #16213e; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #90a6eb; font-size: 16px;">📊 玩家數據</h3>
        <div style="font-size: 12px; color: #e7e7e7; line-height: 1.8;">

            <div style="padding: 12px; background: rgba(0,0,0,0.3); border-radius: 6px; margin-bottom: 12px;">
                <div style="font-weight: bold; color: #90a6eb; margin-bottom: 8px;">⚡ 煉金等級與效率</div>
                <div style="margin-left: 12px;">
                    玩家等級: <strong>Lv${alchemyLevel}</strong><br>
                    物品等級: <strong>Lv${itemLevel}</strong><br>
                    等級碾壓: <strong>+${result.efficiencyBreakdown.levelCrush}%</strong> (${alchemyLevel} - ${itemLevel})<br>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
                        社區效率: +${result.efficiencyBreakdown.community?.toFixed(1) || 0}%<br>
                        茶飲效率: +${result.efficiencyBreakdown.tea?.toFixed(1) || 0}%<br>
                        裝備效率: +${result.efficiencyBreakdown.equipment?.toFixed(1) || 0}%<br>
                        房屋效率: +${result.efficiencyBreakdown.house?.toFixed(1) || 0}%<br>
                    </div>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
                        <span style="color: #00ff00;"><strong>總效率: ${result.efficiencyBreakdown.multiplier?.toFixed(3) || '1.000'}x</strong></span>
                        <span style="color: #888; font-size: 10px;"> (1 + ${result.efficiencyBreakdown.total?.toFixed(1) || 0}%)</span>
                    </div>
                </div>
            </div>

            <div style="padding: 12px; background: rgba(0,0,0,0.3); border-radius: 6px;">
                <div style="font-weight: bold; color: #90a6eb; margin-bottom: 8px;">⏱️ 動作時間計算</div>
                <div style="margin-left: 12px;">
                    基礎時間: <strong>${result.timeBreakdown.baseTime}秒</strong> (動作及物品)<br>
                    速度 Buff: <strong>+${result.timeBreakdown.actionSpeedPercent.toFixed(1)}%</strong> (工具+項鍊)<br>
                    實際時間: <strong>${result.timeBreakdown.actualTime.toFixed(2)}秒</strong>
                    <span style="color: #888; font-size: 10px;"> (${result.timeBreakdown.baseTime} ÷ ${(1 + result.timeBreakdown.actionSpeedPercent / 100).toFixed(2)})</span><br>
                    <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
                        基礎次數/天: <strong>${(86400 / result.timeBreakdown.actualTime).toFixed(2)}</strong>
                        <span style="color: #888; font-size: 10px;"> (86400s ÷ ${result.timeBreakdown.actualTime.toFixed(2)}s)</span><br>
                        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); color: #ff69b4;">
                            <strong>最終動作數: ${showNumber(result.actionsPerDay, true)} 次/天</strong>
                            <span style="color: #888; font-size: 10px;"> (× ${result.efficiencyBreakdown.multiplier?.toFixed(3) || '1.000'})</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;
    }

    function generateCalculationDetails(result, mode, containsInput, totalCost, totalOutput, profitColor) {
        let html = `
    <div style="background-color: #16213e; padding: 16px; border-radius: 6px; margin-bottom: 16px;">
        <h3 style="margin: 0 0 12px 0; color: #90a6eb; font-size: 16px;">🧮 期望值計算過程</h3>
        <div style="font-size: 12px; color: #e7e7e7; line-height: 1.8;">
    `;

        // 如果有 bulkMultiplier，顯示提示
        if (result.bulkMultiplier && result.bulkMultiplier > 1) {
            html += `
        <div style="margin-bottom: 16px; padding: 12px; background: rgba(144, 166, 235, 0.2); border-radius: 6px; border-left: 3px solid #90a6eb;">
            <div style="font-weight: bold; color: #90a6eb; margin-bottom: 4px;">📦 批量煉金</div>
            <div style="margin-left: 12px;">
                此配方一次動作消耗 <strong>${result.bulkMultiplier}</strong> 個材料，產出 <strong>${result.bulkMultiplier}</strong> 倍產物
            </div>
        </div>
        `;
        }

        html += generateCostSection('① 輸入成本', result.inputItems, mode.inputMode, mode, '#ff9999');

        if (result.goldCost > 0) {
            html += `
        <div style="margin-bottom: 16px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 6px; border-left: 3px solid #ffcc00;">
            <div style="font-weight: bold; color: #ffcc00; margin-bottom: 8px;">② 金幣成本</div>
            <div style="margin-left: 12px;">每次${ALCHEMY_MODES[result.mode]?.getName() || '煉金'}消耗: <strong>${showNumber(result.goldCost, true)}</strong> 金幣</div>
        </div>
        `;
        }

        if (result.catalystCost > 0) {
            const catalystPrice = safeGetPrice(result.catalystItemHrid, 0, mode.inputMode);
            html += `
        <div style="margin-bottom: 16px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 6px; border-left: 3px solid #ffaa00;">
            <div style="font-weight: bold; color: #ffaa00; margin-bottom: 8px;">③ 催化劑成本</div>
            <div style="margin-left: 12px;">
                ${result.catalystName}: ${showNumber(catalystPrice, true)} × ${(result.finalSuccessRate * 100).toFixed(2)}% (成功率) = <strong>${showNumber(result.catalystCost, true)}</strong>
            </div>
        </div>
        `;
        }

        if (result.outputItems?.length > 0) {
            html += generateOutputSection('④ 主要產出期望值', result.outputItems, result, mode, containsInput, '#99ff99');
        }

        if (result.essenceDrops?.length > 0 && result.essenceValue > 0) {
            html += generateOutputSection('⑤ 精華掉落期望值', result.essenceDrops, result, mode, containsInput, '#9999ff');
        }

        if (result.rareDrops?.length > 0 && result.rareValue > 0) {
            html += generateOutputSection('⑥ 稀有掉落期望值', result.rareDrops, result, mode, containsInput, '#ffaa00');
        }

        html += `
    <div style="padding: 16px; background: rgba(0,0,0,0.5); border-radius: 6px; border: 2px solid ${profitColor};">
        <div style="font-weight: bold; color: #90a6eb; margin-bottom: 12px; font-size: 14px;">⑦ 最終計算</div>
        <div style="margin-left: 12px; line-height: 2;">
            <div>總產出: <strong style="color: #99ff99;">${showNumber(totalOutput, true)}</strong></div>
            <div>材料成本: <strong style="color: #ff9999;">${showNumber(result.inputCost, true)}</strong></div>
            ${result.goldCost > 0 ? `<div>金幣成本: <strong style="color: #ffcc00;">${showNumber(result.goldCost, true)}</strong></div>` : ''}
            ${result.catalystCost > 0 ? `<div>催化劑成本: <strong style="color: #ffaa00;">${showNumber(result.catalystCost, true)}</strong></div>` : ''}
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
                總成本: <strong style="color: #ff9999;">${showNumber(totalCost, true)}</strong>
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 16px;">
                <strong>期望淨利</strong> = ${showNumber(totalOutput, true)} - ${showNumber(totalCost, true)} = <strong style="color: ${profitColor};">${showNumber(result.expectedValue)}</strong>
            </div>
            <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2);">
                <strong style="color: #ff69b4;">日利潤</strong> = ${showNumber(result.expectedValue)} × ${showNumber(result.actionsPerDay, true)} = <strong style="color: #ff69b4;">${showNumber(result.dailyProfit)}</strong>
            </div>
        </div>
    </div>
    `;

        html += `</div></div>`;

        if (!result.valid) {
            html += `
        <div style="background-color: #3a1f1f; padding: 12px; border-radius: 6px; margin-top: 16px; border: 1px solid #ff6666;">
            <div style="color: #ff9999; font-weight: bold; margin-bottom: 4px;">⚠️ 警告：部分價格數據缺失</div>
            <div style="font-size: 13px;">${result.missingPrices.join(', ')}</div>
        </div>
        `;
        }

        // 玩家數據移到最下面
        html += generatePlayerDataSection(result);

        return html;
    }

    // 獲取特定價格的掛單數量
    function getOrderAmountAtPrice(itemHrid, enhancementLevel, priceType, targetPrice) {
        try {
            const orderBooks = mwi.game?.state?.marketItemOrderBooks;

            // 檢查是否是當前查看的物品
            if (!orderBooks || orderBooks.itemHrid !== itemHrid) {
                return null; // 不是當前查看的物品，無法獲取詳細數據
            }

            // 獲取對應強化等級的訂單簿
            const orderBook = orderBooks.orderBooks?.[enhancementLevel];
            if (!orderBook) {
                return null;
            }

            // 根據價格類型選擇訂單列表
            const orders = priceType === 'ask' ? orderBook.asks : orderBook.bids;
            if (!orders || orders.length === 0) {
                return 0;
            }

            // 計算該價格的總數量
            const amount = orders
            .filter(order => order.price === targetPrice)
            .reduce((sum, order) => sum + (order.quantity || 0), 0);

            return amount;
        } catch (e) {
            console.warn('獲取掛單數量時發生錯誤:', e);
            return null;
        }
    }

    function generateCostSection(title, items, priceType, mode, color) {
        let html = `
    <div style="margin-bottom: 16px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 6px; border-left: 3px solid ${color};">
        <div style="font-weight: bold; color: ${color}; margin-bottom: 8px;">
            ${title} (${mode.getName()}: 買入 = ${priceType.toUpperCase()})
        </div>
    `;

        items.forEach(item => {
            const price = safeGetPrice(item.itemHrid, item.enhancementLevel || 0, priceType);
            const total = price * item.count;

            // 獲取該價格的掛單數量
            let marketAmountText = '';
            if (price > 0) {
                const orderAmount = getOrderAmountAtPrice(item.itemHrid, item.enhancementLevel || 0, priceType, price);
                if (orderAmount !== null) {
                    marketAmountText = orderAmount > 0
                        ? ` (該價掛單: ${showNumber(orderAmount, true)})`
                    : ' (該價無掛單)';
                }
            }

            // 生成唯一的函數名稱用於跳轉
            const itemSafeId = item.itemHrid.replace(/\W/g, '_');
            const funcName = `goToMarket_input_${itemSafeId}_${Date.now()}`;

            // 註冊跳轉函數
            window[funcName] = () => goToMarketPage(item.itemHrid);

            html += `
        <div style="margin-left: 12px; margin-bottom: 4px;">
            <span onclick="window.${funcName}()" style="color: #5cf; text-decoration: underline; cursor: pointer;" title="點擊前往市場頁面">
                ${getItemName(item.itemHrid)}
            </span> × ${item.count} = ${showNumber(price, true)}${marketAmountText} × ${item.count} = <strong>${showNumber(total, true)}</strong>
        </div>
        `;
        });

        const totalCost = items.reduce((sum, item) => {
            const price = safeGetPrice(item.itemHrid, item.enhancementLevel || 0, priceType);
            return sum + (price * item.count);
        }, 0);

        html += `
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
            小計: <strong style="color: ${color};">${showNumber(totalCost, true)}</strong>
        </div>
    </div>
    `;

        return html;
    }


    function generateOutputSection(title, items, result, mode, containsInput, color) {
        let html = `
    <div style="margin-bottom: 16px; padding: 12px; background: rgba(0,0,0,0.3); border-radius: 6px; border-left: 3px solid ${color};">
        <div style="font-weight: bold; color: ${color}; margin-bottom: 8px;">
            ${title} (${mode.getName()}: 賣出 = ${mode.outputMode.toUpperCase()})
        </div>
    `;

        items.forEach(item => {
            if (item.isGold) {
                const baseGold = item.count;
                const successRate = result.finalSuccessRate;
                const finalGold = baseGold * successRate;

                html += `
            <div style="margin-left: 12px; margin-bottom: 8px;">
                <div>💰 金幣 × ${showNumber(baseGold, true)}</div>
                <div style="margin-left: 12px; color: #90a6eb; font-size: 11px;">
                    ${showNumber(baseGold, true)} × ${(successRate * 100).toFixed(2)}% (成功率) =
                </div>
                <div style="margin-left: 12px; color: #e7e7e7; font-size: 13px;">
                    <strong>${showNumber(finalGold, true)}</strong>
                </div>
            </div>
            `;
                return;
            }

            const isSameAsInput = containsInput && item.itemHrid === result.inputItemHrid;
            const preferredPriceType = isSameAsInput ? mode.inputMode : mode.outputMode;

            // 獲取價格並記錄實際使用的價格類型
            const preferredPrice = safeGetPrice(item.itemHrid, 0, preferredPriceType);
            let actualPrice = preferredPrice;
            let actualPriceType = preferredPriceType;
            let priceWarning = '';

            // 如果首選價格不存在，根據規則選擇備用價格
            if ((actualPrice === null || actualPrice === 0) && preferredPriceType === 'ask') {
                const bidPrice = safeGetPrice(item.itemHrid, 0, 'bid');
                if (bidPrice !== null && bidPrice > 0) {
                    actualPrice = bidPrice;
                    actualPriceType = 'bid';
                    priceWarning = ' ⚠️ 使用低賣價';
                } else {
                    actualPrice = 0;
                    priceWarning = ' ⚠️ 無市場價格';
                }
            } else if ((actualPrice === null || actualPrice === 0) && preferredPriceType === 'bid') {
                actualPrice = 0;
                priceWarning = ' ⚠️ 無低賣價';
            }

            const priceAfterFee = actualPrice > 0 ? actualPrice * FEE_RATE : 0;

            // 計算
            const baseCount = item.count;
            const dropRate = item.rate;
            const successRate = result.finalSuccessRate;
            const value = priceAfterFee * baseCount * dropRate * successRate;

            // 獲取該價格的掛單數量
            let marketAmountText = '';
            if (actualPrice > 0) {
                const orderAmount = getOrderAmountAtPrice(item.itemHrid, 0, actualPriceType, actualPrice);
                if (orderAmount !== null) {
                    marketAmountText = orderAmount > 0
                        ? ` (該價掛單: ${showNumber(orderAmount, true)})`
                    : ' (該價無掛單)';
                }
            }

            // 生成唯一的函數名稱用於跳轉
            const itemSafeId = item.itemHrid.replace(/\W/g, '_');
            const funcName = `goToMarket_output_${itemSafeId}_${Date.now()}`;

            // 註冊跳轉函數
            window[funcName] = () => goToMarketPage(item.itemHrid);

            // 構建計算式
            let calcParts = [showNumber(priceAfterFee, true)];
            if (baseCount !== 1) calcParts.push(`× ${baseCount}`);
            if (dropRate < 1) calcParts.push(`× ${(dropRate * 100).toFixed(2)}% (掉率)`);
            if (successRate < 1) calcParts.push(`× ${(successRate * 100).toFixed(2)}% (成功率)`);

            // 判斷價格類型文字
            let priceTypeText = actualPriceType === 'ask' ? '採購價' : '收購價';

            html += `
        <div style="margin-left: 12px; margin-bottom: 12px;">
            <div>
                <span onclick="window.${funcName}()" style="color: #5cf; text-decoration: underline; cursor: pointer;" title="點擊前往市場頁面">
                    ${getItemName(item.itemHrid)}
                </span> × ${baseCount} ${dropRate < 1 ? `(${(dropRate * 100).toFixed(2)}% 掉率)` : ''}
                ${isSameAsInput ? '<span style="color: #ffd700; font-size: 11px;"> ⚠️ 使用買入價</span>' : ''}
                ${priceWarning ? `<span style="color: #ff9999; font-size: 11px;">${priceWarning}</span>` : ''}
            </div>
            ${actualPrice > 0 ? `
            <div style="margin-left: 12px; color: #90a6eb; font-size: 11px; margin-top: 4px;">
                市場價(${priceTypeText}): ${showNumber(actualPrice, true)}${marketAmountText} → 扣手續費(98%):
            </div>
            <div style="margin-left: 12px; color: #90a6eb; font-size: 11px;">
                ${calcParts.join(' ')}
            </div>
            <div style="margin-left: 12px; color: #e7e7e7; font-size: 13px; margin-top: 2px;">
                <strong>= ${showNumber(value, true)}</strong>
            </div>
            ` : `
            <div style="margin-left: 12px; color: #888; font-size: 11px; margin-top: 4px;">
                無市場價格，使用 0 元
            </div>
            `}
        </div>
        `;
        });

        const sectionValue = items.reduce((sum, item) => {
            if (item.isGold) return sum + (item.count * result.finalSuccessRate);

            const isSameAsInput = containsInput && item.itemHrid === result.inputItemHrid;
            const preferredPriceType = isSameAsInput ? mode.inputMode : mode.outputMode;

            let price = safeGetPrice(item.itemHrid, 0, preferredPriceType);

            if ((price === null || price === 0) && preferredPriceType === 'ask') {
                const bidPrice = safeGetPrice(item.itemHrid, 0, 'bid');
                price = (bidPrice !== null && bidPrice > 0) ? bidPrice : 0;
            } else if (price === null || price === 0) {
                price = 0;
            }

            const priceAfterFee = price > 0 ? price * FEE_RATE : 0;
            return sum + (priceAfterFee * item.count * item.rate * result.finalSuccessRate);
        }, 0);

        html += `
        <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.1);">
            小計: <strong style="color: ${color};">${showNumber(sectionValue, true)}</strong>
        </div>
    </div>
    `;

        return html;
    }

    function createSearchSuggestions(searchInput, callback) {
        const suggestionsDiv = document.createElement('div');
        suggestionsDiv.style.cssText = `
            position: absolute; top: 100%; left: 0; right: 0;
            background: rgba(40, 40, 68, 0.98); border: 1px solid rgba(144, 166, 235, 0.6);
            border-top: none; border-radius: 0 0 10px 10px; max-height: 200px;
            overflow-y: auto; z-index: 10002; display: none;
        `;

        let currentFocus = -1;
        searchInput.parentElement.style.position = 'relative';
        searchInput.parentElement.appendChild(suggestionsDiv);

        searchInput.addEventListener('input', () => {
            const value = searchInput.value.trim();
            suggestionsDiv.innerHTML = '';
            currentFocus = -1;

            if (!value) {
                suggestionsDiv.style.display = 'none';
                return;
            }

            const results = itemIdentifier.searchByName(value).slice(0, 10);
            if (results.length === 0) {
                suggestionsDiv.style.display = 'none';
                return;
            }

            results.forEach((result, index) => {
                const item = document.createElement('div');
                item.style.cssText = `padding: 8px 12px; cursor: pointer; color: #f4f4f8; font-size: 13px;`;
                item.textContent = result.name;

                if (result.exact) {
                    item.style.fontWeight = 'bold';
                    item.style.backgroundColor = 'rgba(144, 166, 235, 0.2)';
                }

                item.addEventListener('mouseenter', () => {
                    item.style.backgroundColor = 'rgba(144, 166, 235, 0.3)';
                });
                item.addEventListener('mouseleave', () => {
                    item.style.backgroundColor = result.exact ? 'rgba(144, 166, 235, 0.2)' : 'transparent';
                });

                item.addEventListener('click', () => {
                    searchInput.value = result.name;
                    suggestionsDiv.style.display = 'none';
                    callback();
                });

                suggestionsDiv.appendChild(item);
            });

            suggestionsDiv.style.display = 'block';
        });

        searchInput.addEventListener('keydown', (e) => {
            const items = Array.from(suggestionsDiv.children);
            if (items.length === 0) return;

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                currentFocus = (currentFocus + 1) % items.length;
                setActive(items);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                currentFocus = currentFocus <= 0 ? items.length - 1 : currentFocus - 1;
                setActive(items);
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (currentFocus > -1) items[currentFocus].click();
            } else if (e.key === 'Escape') {
                suggestionsDiv.style.display = 'none';
            }
        });

        function setActive(items) {
            items.forEach((item, i) => {
                item.style.backgroundColor = i === currentFocus ? 'rgba(144, 166, 235, 0.3)' : 'transparent';
            });
        }

        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
                suggestionsDiv.style.display = 'none';
            }
        });
    }

    function getCurrentFilters(calculator) {
        const selects = calculator.querySelectorAll('select');
        const numberInputs = calculator.querySelectorAll('input[type="number"]');

        const alchemyModeSelect = document.getElementById('alchemy-mode-select');
        const tradeModeSelect = selects[1];
        const priceTypeSelect = selects[2];
        const priceFilterSelect = selects[3];
        const spreadFilterLabel = selects[4];
        const spreadFilterSelect = selects[5];

        const priceFilterInput = numberInputs[0];
        const spreadFilterInput = numberInputs[1];

        return {
            searchTerm: calculator.querySelector('input[placeholder="🔍 搜尋"]')?.value.trim() || '',
            outputItemFilter: calculator.querySelector('input[placeholder="🎯 產出"]')?.value.trim() || '',
            priceFilter: priceTypeSelect?.value && priceFilterInput?.value ? {
                priceType: priceTypeSelect.value,
                type: priceFilterSelect.value,
                value: parseFloat(priceFilterInput.value)
            } : null,
            spreadFilter: spreadFilterLabel?.value && spreadFilterInput?.value ? {
                type: spreadFilterSelect.value,
                value: parseFloat(spreadFilterInput.value)
            } : null,
            favoritesOnly: document.getElementById('favorites-only-checkbox')?.checked || false
        };
    }

    function getActionTypeBadge(mode) {
        if (mode === 'transmute') {
            return '<span style="font-size: 10px; background: #5668ff; padding: 1px 4px; border-radius: 3px; margin-left: 4px;">⚗️轉化</span>';
        } else if (mode === 'midas') {
            return '<span style="font-size: 10px; background: #d4af37; color: #000; padding: 1px 4px; border-radius: 3px; margin-left: 4px;">💰點金</span>';
        } else if (mode === 'disassemble') {
            return '<span style="font-size: 10px; background: #8b4513; padding: 1px 4px; border-radius: 3px; margin-left: 4px;">🔨分解</span>';
        }
        return '';
    }

    function displayMarketScanResults(results, tradeMode, totalCount, validCount = null, filters = {}, alchemyMode = 'transmute') {
        const resultsContainer = document.getElementById('transmute-results-container');
        if (!resultsContainer) return;

        if (results.length === 0) {
            resultsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
                <div style="color: #ff9999; font-size: 18px; margin-bottom: 8px;">沒有符合條件的配方</div>
            </div>
        `;
            return;
        }

        const mode = TRADE_MODES[tradeMode];
        const filterParts = [];

        if (filters.searchTerm) filterParts.push(`搜尋: "${filters.searchTerm}"`);
        if (filters.outputItemFilter) filterParts.push(`產出: "${filters.outputItemFilter}"`);
        if (filters.priceFilter) {
            const priceType = filters.priceFilter.priceType === 'ask' ? 'Ask' : 'Bid';
            filterParts.push(`價格(${priceType}): ${filters.priceFilter.type === 'min' ? '≥' : '≤'} ${showNumber(filters.priceFilter.value)}`);
        }
        if (filters.spreadFilter) {
            filterParts.push(`流動: ${filters.spreadFilter.type === 'min' ? '≥' : '≤'} ${filters.spreadFilter.value}%`);
        }
        if (filters.favoritesOnly) filterParts.push('只顯示收藏');

        const filterDescription = filterParts.length > 0 ? ` - ${filterParts.join(' | ')}` : '';

        const modeTitle = alchemyMode === 'daily_profit' ? '💰 全部 (日利潤排序)' : `${ALCHEMY_MODES[alchemyMode].icon} ${ALCHEMY_MODES[alchemyMode].getName()}`;

        // 優化：限制初始顯示數量，超過100個只顯示前100個
        const displayLimit = 100;
        const hasMore = results.length > displayLimit;
        const displayResults = hasMore ? results.slice(0, displayLimit) : results;

        let html = `
        <div style="background-color: #16213e; padding: 12px; border-radius: 8px; margin-bottom: 12px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
                <div style="flex: 1; min-width: 200px;">
                    <div style="font-size: 14px; color: #90a6eb;">
                        ${modeTitle} <strong style="color: #e7e7e7;">${results.length}</strong> 個配方
                        ${validCount ? ` (${validCount}/${totalCount})` : ''}
                        ${filterDescription}
                    </div>
                    <div style="font-size: 12px; color: #888; margin-top: 4px;">
                        ${mode.getName()}
                        ${results[0]?.hasCatalyticTea ? ` | 🍵 +5%` : ''}
                        ${hasMore ? ` | 顯示前 ${displayLimit} 個結果` : ''}
                    </div>
                </div>
                <div style="display: flex; gap: 12px; font-size: 12px;">
                    <span style="color: #00ff00;">✓ ${results.filter(r => r.expectedValue > 0).length}</span>
                    <span style="color: #ff3333;">✗ ${results.filter(r => r.expectedValue < 0).length}</span>
                </div>
            </div>
        </div>
        <div style="overflow-y: auto; max-height: calc(85vh - 280px);">
    `;

        displayResults.forEach((result, index) => {
            const profitRate = result.inputCost > 0 ? ((result.expectedValue / result.inputCost) * 100).toFixed(1) : 0;
            const bgColor = index % 2 === 0 ? '#16213e' : '#1a1a2e';
            const catalystBadge = getCatalystBadge(result.catalystType);
            const inputAsk = safeGetPrice(result.inputItemHrid, 0, 'ask');
            const inputBid = safeGetPrice(result.inputItemHrid, 0, 'bid');
            const inventoryCount = mwi.game?.inventoryManager?.inventoryMap?.[result.inputItemHrid]?.count || 0;
            const isFav = isFavorite(result.inputItemHrid);
            const mostValuable = getMostValuableOutput(result);

            // 動作類型徽章（只在日利潤模式顯示）
            const actionBadge = alchemyMode === 'daily_profit' ? getActionTypeBadge(result.mode) : '';

            html += `
            <div style="background-color: ${bgColor}; padding: 10px 12px; margin-bottom: 4px; border-radius: 6px;
                        border-left: 3px solid ${result.expectedValue > 0 ? '#00ff00' : '#ff3333'};
                        cursor: pointer; display: grid; grid-template-columns: auto 1fr auto auto; gap: 10px; align-items: center;"
                 onclick="window.showTransmuteDetail_${index}()">
                <button onclick="event.stopPropagation(); window.toggleFavorite_${index}(event)"
                        style="padding: 2px 6px; background: transparent; color: #ffd700;
                               border: 1px solid rgba(255, 215, 0, 0.3); border-radius: 4px;
                               cursor: pointer; font-size: 14px; line-height: 1;">
                    ${isFav ? '⭐' : '☆'}
                </button>
                <div style="min-width: 0;">
                    <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
                        <span style="color: #666; font-size: 11px; font-weight: 600;">#${index + 1}</span>
                        <strong style="color: #e7e7e7; font-size: 14px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
                            ${result.name}
                        </strong>
                        ${actionBadge}
                        ${catalystBadge}
                    </div>
                    <div style="display: flex; gap: 10px; flex-wrap: wrap; font-size: 12px; color: #90a6eb;">
                        <span>${showNumber(inputAsk, true)}/${showNumber(inputBid, true)}</span>
                        <span title="流動性：Bid/Ask 百分比">流動性 ${result.spreadRatio.toFixed(1)}%</span>
                        ${inventoryCount > 0 ? `<span style="color: #ffd700;">庫存 ${inventoryCount}</span>` : ''}
                        ${mostValuable ? `<span style="color: #9df; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 120px;" title="${mostValuable}">${mostValuable}</span>` : ''}
                    </div>
                </div>
                <div style="text-align: right;">
                    <div style="font-weight: bold; color: ${result.expectedValue > 0 ? '#00ff00' : '#ff3333'}; font-size: 15px;">
                        ${showNumber(result.expectedValue)}
                    </div>
                    <div style="font-size: 11px; color: #90a6eb;">
                        ${result.expectedValue > 0 ? '+' : ''}${profitRate}%
                    </div>
                    <div style="font-size: 10px; color: #ff69b4; margin-top: 2px;">
                        日 ${showNumber(result.dailyProfit)}
                    </div>
                </div>
                <button onclick="event.stopPropagation(); window.goToMarket_${result.inputItemHrid.replace(/\W/g, '_')}()"
                        style="padding: 4px 8px; background-color: #5668ff; color: white;
                               border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">
                    🛒
                </button>
            </div>
        `;

            window[`showTransmuteDetail_${index}`] = () => showDetailedCalculation(result, tradeMode);
            window[`goToMarket_${result.inputItemHrid.replace(/\W/g, '_')}`] = () => goToMarketPage(result.inputItemHrid);
            window[`toggleFavorite_${index}`] = function(event) {
                const newIsFav = toggleFavorite(result.inputItemHrid);
                event.target.textContent = newIsFav ? '⭐' : '☆';

                const favoritesOnlyCheckbox = document.getElementById('favorites-only-checkbox');
                if (favoritesOnlyCheckbox?.checked) {
                    const calculator = document.getElementById('transmute-calculator');
                    const modeSelect = document.getElementById('alchemy-mode-select');
                    showFullMarketScan(tradeMode, getCurrentFilters(calculator), modeSelect.value);
                }
            };
        });

        if (hasMore) {
            html += `
        <div style="text-align: center; padding: 20px; color: #888; font-size: 12px;">
            顯示前 ${displayLimit} 個結果 / 共 ${results.length} 個配方
            <br>
            <span style="color: #90a6eb;">使用篩選功能來縮小範圍</span>
        </div>
        `;
        }

        html += `</div>`;
        resultsContainer.innerHTML = html;
    }
    function getCatalystBadge(catalystType) {
        if (catalystType === 'transmute') {
            return '<span style="font-size: 10px; background: #4a5568; padding: 1px 4px; border-radius: 3px; margin-left: 4px;" title="轉化催化劑 ×1.15">⚗️×1.15</span>';
        } else if (catalystType === 'midas') {
            return '<span style="font-size: 10px; background: #d4af37; color: #000; padding: 1px 4px; border-radius: 3px; margin-left: 4px;" title="點金催化劑 ×1.15">💰×1.15</span>';
        } else if (catalystType === 'disassemble') {
            return '<span style="font-size: 10px; background: #8b4513; padding: 1px 4px; border-radius: 3px; margin-left: 4px;" title="分解催化劑 ×1.15">🔨×1.15</span>';
        } else if (catalystType === 'prime') {
            return '<span style="font-size: 10px; background: #d4af37; color: #000; padding: 1px 4px; border-radius: 3px; margin-left: 4px;" title="至尊催化劑 ×1.25">⚗️✨×1.25</span>';
        }
        return '';
    }

    function getMostValuableOutput(result) {
        let mostValuable = null;
        let maxValue = 0;

        const allOutputs = [
            ...result.outputItems,
            ...result.essenceDrops,
            ...result.rareDrops
        ];

        for (const output of allOutputs) {
            if (output.isGold) {
                if (output.count > maxValue) {
                    maxValue = output.count;
                    mostValuable = `金幣`;
                }
                continue;
            }

            const price = getBestSellPrice(output.itemHrid, 0, 'bid');
            const value = price * output.count;
            if (value > maxValue) {
                maxValue = value;
                mostValuable = `${getItemName(output.itemHrid)} (${(output.rate * 100).toFixed(2)}%)`;
            }
        }

        return mostValuable;
    }

    function showFullMarketScan(tradeMode, filters = {}, alchemyMode = 'transmute') {
        const resultsContainer = document.getElementById('transmute-results-container');
        if (!resultsContainer) return;

        resultsContainer.innerHTML = `
        <div style="text-align: center; padding: 40px;">
            <div style="font-size: 24px; margin-bottom: 16px;">🔍</div>
            <div style="color: #90a6eb;">正在掃描${alchemyMode === 'daily_profit' ? '全部' : ALCHEMY_MODES[alchemyMode].getName()}配方...</div>
            ${alchemyMode === 'daily_profit' ? '<div style="color: #888; font-size: 12px; margin-top: 8px;">掃描三種模式中，請稍候...</div>' : ''}
        </div>
    `;

        const processData = () => {
            const startTime = performance.now();

            let allRecipes = [];

            // 如果是日利潤模式，掃描所有類型
            if (alchemyMode === 'daily_profit') {
                console.log('⏱️ 開始掃描全部模式...');
                allRecipes = [
                    ...getAllAlchemyRecipes('transmute'),
                    ...getAllAlchemyRecipes('midas'),
                    ...getAllAlchemyRecipes('disassemble')
                ];
                console.log(`✅ 掃描完成，找到 ${allRecipes.length} 個配方`);
            } else {
                allRecipes = getAllAlchemyRecipes(alchemyMode);
            }

            if (allRecipes.length === 0) {
                resultsContainer.innerHTML = `
                <div style="text-align: center; padding: 40px;">
                    <div style="font-size: 48px; margin-bottom: 16px;">❌</div>
                    <div style="color: #ff9999; font-size: 18px;">無法獲取配方數據</div>
                </div>
            `;
                return;
            }

            // 優化：先篩選有市場價格的配方，減少計算量
            console.log('⏱️ 開始篩選有效配方...');
            const validRecipes = allRecipes.filter(recipe => {
                if (recipe.mode === 'midas' || recipe.mode === 'disassemble') {
                    return recipe.inputItems.every(input =>
                                                   hasMarketPrice(input.itemHrid, input.enhancementLevel)
                                                  );
                }

                const hasInputPrice = recipe.inputItems.every(input =>
                                                              hasMarketPrice(input.itemHrid, input.enhancementLevel)
                                                             );
                if (!hasInputPrice) return false;

                return recipe.outputItems.some(output => hasMarketPrice(output.itemHrid, 0));
            });
            console.log(`✅ 篩選完成，${validRecipes.length} 個有效配方`);

            // 優化：分批處理結果，避免一次計算太多
            console.log('⏱️ 開始計算期望值...');
            let results = validRecipes.map(recipe => {
                const catalystResults = calculateWithCatalysts(recipe, tradeMode);
                return catalystResults[0];
            }).filter(r => r.valid);
            console.log(`✅ 計算完成，${results.length} 個有效結果`);

            results = applyFilters(results, filters);

            // 如果是日利潤模式，按日利潤排序
            if (alchemyMode === 'daily_profit') {
                results.sort((a, b) => b.dailyProfit - a.dailyProfit);
            } else {
                results.sort((a, b) => b.expectedValue - a.expectedValue);
            }

            const endTime = performance.now();
            console.log(`✅ 總耗時: ${((endTime - startTime) / 1000).toFixed(2)} 秒`);

            displayMarketScanResults(results, tradeMode, allRecipes.length, validRecipes.length, filters, alchemyMode);
        };

        // 使用 setTimeout 讓 UI 先更新
        setTimeout(processData, 50);
    }

    function applyFilters(results, filters) {
        let filtered = results;

        if (filters.searchTerm) {
            const term = filters.searchTerm.trim();
            filtered = filtered.filter(r => r.name === term || r.name.includes(term));
        }

        if (filters.outputItemFilter) {
            const term = filters.outputItemFilter.trim();
            filtered = filtered.filter(r => {
                const allOutputs = [...r.outputItems, ...r.essenceDrops, ...r.rareDrops];

                if (allOutputs.some(output => {
                    if (output.isGold) return term === '金幣' || term.toLowerCase() === 'gold';
                    return getItemName(output.itemHrid) === term;
                })) {
                    return true;
                }

                return allOutputs.some(output => {
                    if (output.isGold) return false;
                    return getItemName(output.itemHrid).includes(term);
                });
            });
        }

        if (filters.priceFilter) {
            filtered = filtered.filter(r => {
                const price = safeGetPrice(r.inputItemHrid, 0, filters.priceFilter.priceType);
                if (!price) return false;
                return filters.priceFilter.type === 'min' ?
                    price >= filters.priceFilter.value :
                    price <= filters.priceFilter.value;
            });
        }

        if (filters.spreadFilter) {
            filtered = filtered.filter(r => {
                return filters.spreadFilter.type === 'min' ?
                    r.spreadRatio >= filters.spreadFilter.value :
                    r.spreadRatio <= filters.spreadFilter.value;
            });
        }

        if (filters.favoritesOnly) {
            const favorites = getFavorites();
            filtered = filtered.filter(r => favorites.includes(r.inputItemHrid));
        }

        return filtered;
    }

    function createUI() {
        const container = document.createElement('div');
        container.id = 'transmute-calculator';
        container.style.cssText = `
            position: fixed; top: 60px; right: 20px; width: 580px; max-height: 85vh;
            background: rgba(15, 20, 48, 0.96); border: 1px solid rgba(144, 166, 235, 0.5);
            border-radius: 12px; z-index: 10000; display: none; flex-direction: column;
            font-family: 'Segoe UI', Arial, sans-serif; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        `;

        const header = createHeader();
        const resultsContainer = document.createElement('div');
        resultsContainer.id = 'transmute-results-container';
        resultsContainer.style.cssText = `
            padding: 16px; color: #e7e7e7; background: rgba(12, 16, 40, 0.4);
            overflow-y: auto; flex: 1;
        `;

        container.appendChild(header.element);
        container.appendChild(resultsContainer);
        document.body.appendChild(container);

        setupDragging(container, header.element);

        return header.controls;
    }

    function createHeader() {
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 12px 14px;
            background: linear-gradient(135deg, rgba(22, 33, 62, 0.9), rgba(36, 48, 94, 0.9));
            border-bottom: 1px solid rgba(144, 166, 235, 0.3);
            cursor: move; user-select: none;
        `;

        const titleRow = document.createElement('div');
        titleRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;';

        const title = document.createElement('h3');
        title.style.cssText = 'margin: 0; color: #f4f4f8; font-size: 16px; font-weight: 600;';
        title.textContent = '🧪 煉金計算器';

        const topRightControls = createTopRightControls();
        titleRow.appendChild(title);
        titleRow.appendChild(topRightControls.element);

        const controlsRow = createSearchInputs();
        const bottomControls = createBottomControls();

        header.appendChild(titleRow);
        header.appendChild(controlsRow.element);
        header.appendChild(bottomControls.element);

        const performScan = () => {
            const calculator = document.getElementById('transmute-calculator');
            const modeSelect = document.getElementById('alchemy-mode-select');
            showFullMarketScan(bottomControls.tradeModeSelect.value, getCurrentFilters(calculator), modeSelect.value);
        };

        return {
            element: header,
            controls: {
                container: document.getElementById('transmute-calculator'),
                tradeModeSelect: bottomControls.tradeModeSelect,
                alchemyModeSelect: bottomControls.alchemyModeSelect,
                searchInput: controlsRow.searchInput,
                outputItemInput: controlsRow.outputItemInput,
                teaCheckbox: topRightControls.teaCheckbox,
                satchelCheckbox: topRightControls.satchelCheckbox,
                satchelLevelSelect: topRightControls.satchelLevelSelect,
                priceTypeSelect: bottomControls.priceTypeSelect,
                priceFilterSelect: bottomControls.priceFilterSelect,
                priceFilterInput: bottomControls.priceFilterInput,
                spreadFilterLabel: bottomControls.spreadFilterLabel,
                spreadFilterSelect: bottomControls.spreadFilterSelect,
                spreadFilterInput: bottomControls.spreadFilterInput,
                favoritesOnlyCheckbox: topRightControls.favoritesOnlyCheckbox,
                performScan
            }
        };
    }

    // 暴飲袋加成查找表（Lv0-20）
    function getSatchelBonus(enhancementLevel) {
        const bonusTable = {
            0: 10.00, 1: 10.20, 2: 10.42, 3: 10.66, 4: 10.92,
            5: 11.20, 6: 11.50, 7: 11.82, 8: 12.16, 9: 12.52,
            10: 12.90, 11: 13.34, 12: 13.84, 13: 14.40, 14: 15.02,
            15: 15.70, 16: 16.44, 17: 17.24, 18: 18.10, 19: 19.02,
            20: 20.00
        };

        if (bonusTable[enhancementLevel] !== undefined) {
            return bonusTable[enhancementLevel];
        }

        if (enhancementLevel < 0) return bonusTable[0];
        if (enhancementLevel > 20) return bonusTable[20];

        return 10.00;
    }

    function createTopRightControls() {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; gap: 4px; align-items: center;';

        const buttonStyle = `
        padding: 3px 6px; background: rgba(40, 40, 68, 0.7);
        border: 1px solid rgba(144, 166, 235, 0.4); border-radius: 6px;
        cursor: pointer; font-size: 11px; user-select: none;
    `;

        // 催化茶勾選框
        const teaCheckboxContainer = document.createElement('label');
        teaCheckboxContainer.style.cssText = `${buttonStyle} display: flex; align-items: center; gap: 3px; color: #f4f4f8;`;
        teaCheckboxContainer.title = '催化茶 (+5% 成功率)';
        const teaCheckbox = document.createElement('input');
        teaCheckbox.type = 'checkbox';
        teaCheckbox.id = 'catalytic-tea-checkbox';
        teaCheckbox.checked = true; // 預設勾選
        teaCheckbox.style.cssText = 'cursor: pointer; width: 12px; height: 12px;';
        teaCheckboxContainer.appendChild(teaCheckbox);
        teaCheckboxContainer.appendChild(document.createTextNode('🍵'));

        // 暴飲袋選項
        const satchelContainer = document.createElement('label');
        satchelContainer.style.cssText = `${buttonStyle} display: flex; align-items: center; gap: 3px; color: #f4f4f8;`;
        satchelContainer.title = '暴飲袋（增強茶飲效果）';

        const satchelCheckbox = document.createElement('input');
        satchelCheckbox.type = 'checkbox';
        satchelCheckbox.id = 'satchel-checkbox';
        satchelCheckbox.style.cssText = 'cursor: pointer; width: 12px; height: 12px;';

        const satchelSelect = document.createElement('select');
        satchelSelect.id = 'satchel-level-select';
        satchelSelect.style.cssText = `
        padding: 2px 4px; background: rgba(40, 40, 68, 0.9); color: #f4f4f8;
        border: 1px solid rgba(144, 166, 235, 0.4); border-radius: 4px;
        cursor: pointer; font-size: 10px; margin-left: 2px;
    `;
        satchelSelect.disabled = true;

        // 生成0-20級選項
        for (let i = 0; i <= 20; i++) {
            const option = document.createElement('option');
            option.value = i;
            const bonus = getSatchelBonus(i);
            option.textContent = `+${i}`;
            satchelSelect.appendChild(option);
        }

        satchelCheckbox.addEventListener('change', () => {
            satchelSelect.disabled = !satchelCheckbox.checked;
        });

        satchelContainer.appendChild(satchelCheckbox);
        satchelContainer.appendChild(document.createTextNode('🎒'));
        satchelContainer.appendChild(satchelSelect);

        // 收藏勾選框
        const favoritesOnlyContainer = document.createElement('label');
        favoritesOnlyContainer.style.cssText = `${buttonStyle} display: flex; align-items: center; gap: 3px; color: #f4f4f8;`;
        const favoritesOnlyCheckbox = document.createElement('input');
        favoritesOnlyCheckbox.type = 'checkbox';
        favoritesOnlyCheckbox.id = 'favorites-only-checkbox';
        favoritesOnlyCheckbox.style.cssText = 'cursor: pointer; width: 12px; height: 12px;';
        favoritesOnlyContainer.appendChild(favoritesOnlyCheckbox);
        favoritesOnlyContainer.appendChild(document.createTextNode('⭐'));

        const refreshBtn = document.createElement('button');
        refreshBtn.textContent = '🔄';
        refreshBtn.title = '重新整理';
        refreshBtn.style.cssText = `${buttonStyle} color: #e7e7e7; font-size: 13px;`;

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '✕';
        closeBtn.style.cssText = refreshBtn.style.cssText;
        closeBtn.addEventListener('click', () => {
            document.getElementById('transmute-calculator').style.display = 'none';
        });

        container.appendChild(teaCheckboxContainer);
        container.appendChild(satchelContainer);
        container.appendChild(favoritesOnlyContainer);
        container.appendChild(refreshBtn);
        container.appendChild(closeBtn);

        return {
            element: container,
            teaCheckbox,
            satchelCheckbox,
            satchelLevelSelect: satchelSelect,
            favoritesOnlyCheckbox,
            refreshBtn
        };
    }

    function createSearchInputs() {
        const container = document.createElement('div');
        container.style.cssText = 'display: grid; grid-template-columns: 1fr 1fr; gap: 6px;';

        const inputStyle = `
            padding: 5px 8px; background: rgba(40, 40, 68, 0.7); color: #f4f4f8;
            border: 1px solid rgba(144, 166, 235, 0.4); border-radius: 6px;
            width: 100%; outline: none; font-size: 12px;
        `;

        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = '🔍 搜尋';
        searchInput.style.cssText = inputStyle;

        const outputItemInput = document.createElement('input');
        outputItemInput.type = 'text';
        outputItemInput.placeholder = '🎯 產出';
        outputItemInput.title = '搜尋可產出特定物品的配方';
        outputItemInput.style.cssText = inputStyle;

        container.appendChild(searchInput);
        container.appendChild(outputItemInput);

        return { element: container, searchInput, outputItemInput };
    }

    function createBottomControls() {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; gap: 4px; align-items: center; flex-wrap: wrap;';

        const selectStyle = `
            padding: 5px 8px; background: rgba(40, 40, 68, 0.7); color: #f4f4f8;
            border: 1px solid rgba(144, 166, 235, 0.4); border-radius: 6px;
            cursor: pointer; font-size: 12px;
        `;

        const alchemyModeSelect = document.createElement('select');
        alchemyModeSelect.id = 'alchemy-mode-select';
        alchemyModeSelect.style.cssText = selectStyle;
        alchemyModeSelect.innerHTML = `
    <option value="daily_profit">💰 全部 (日利潤)</option>
    ${Object.entries(ALCHEMY_MODES)
            .map(([key, mode]) => `<option value="${key}">${mode.icon} ${mode.getName()}</option>`)
            .join('')}
`;

        const tradeModeSelect = document.createElement('select');
        tradeModeSelect.style.cssText = selectStyle;
        tradeModeSelect.innerHTML = Object.entries(TRADE_MODES)
            .map(([key, mode]) => `<option value="${key}">${mode.getName()}</option>`)
            .join('');

        const priceFilter = createPriceFilter(selectStyle);
        const spreadFilter = createSpreadFilter(selectStyle);

        container.appendChild(alchemyModeSelect);
        container.appendChild(tradeModeSelect);
        container.appendChild(priceFilter.container);
        container.appendChild(spreadFilter.container);

        return {
            element: container,
            alchemyModeSelect,
            tradeModeSelect,
            ...priceFilter,
            ...spreadFilter
        };
    }

    function createPriceFilter(selectStyle) {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; gap: 3px; align-items: center;';

        const priceTypeSelect = document.createElement('select');
        priceTypeSelect.style.cssText = selectStyle;
        priceTypeSelect.innerHTML = `
            <option value="">篩選</option>
            <option value="ask">Ask</option>
            <option value="bid">Bid</option>
        `;

        const priceFilterSelect = document.createElement('select');
        priceFilterSelect.style.cssText = selectStyle;
        priceFilterSelect.innerHTML = `<option value="max">≤</option><option value="min">≥</option>`;
        priceFilterSelect.disabled = true;

        const priceFilterInput = document.createElement('input');
        priceFilterInput.type = 'number';
        priceFilterInput.placeholder = '數值';
        priceFilterInput.style.cssText = `
            padding: 5px 6px; background: rgba(40, 40, 68, 0.7); color: #f4f4f8;
            border: 1px solid rgba(144, 166, 235, 0.4); border-radius: 6px;
            width: 70px; outline: none; font-size: 12px;
        `;
        priceFilterInput.disabled = true;

        priceTypeSelect.addEventListener('change', () => {
            const enabled = !!priceTypeSelect.value;
            priceFilterSelect.disabled = !enabled;
            priceFilterInput.disabled = !enabled;
            if (!enabled) priceFilterInput.value = '';
        });

        container.appendChild(priceTypeSelect);
        container.appendChild(priceFilterSelect);
        container.appendChild(priceFilterInput);

        return { container, priceTypeSelect, priceFilterSelect, priceFilterInput };
    }

    function createSpreadFilter(selectStyle) {
        const container = document.createElement('div');
        container.style.cssText = 'display: flex; gap: 3px; align-items: center;';

        const spreadFilterLabel = document.createElement('select');
        spreadFilterLabel.style.cssText = selectStyle;
        spreadFilterLabel.innerHTML = `
            <option value="">流動性</option>
            <option value="enabled">Bid/Ask</option>
        `;

        const spreadFilterSelect = document.createElement('select');
        spreadFilterSelect.style.cssText = selectStyle;
        spreadFilterSelect.innerHTML = `<option value="max">≤</option><option value="min">≥</option>`;
        spreadFilterSelect.disabled = true;

        const spreadFilterInput = document.createElement('input');
        spreadFilterInput.type = 'number';
        spreadFilterInput.placeholder = '0-100';
        spreadFilterInput.step = '1';
        spreadFilterInput.min = '0';
        spreadFilterInput.max = '100';
        spreadFilterInput.style.cssText = `
            padding: 5px 6px; background: rgba(40, 40, 68, 0.7); color: #f4f4f8;
            border: 1px solid rgba(144, 166, 235, 0.4); border-radius: 6px;
            width: 70px; outline: none; font-size: 12px;
        `;
        spreadFilterInput.disabled = true;

        spreadFilterLabel.addEventListener('change', () => {
            const enabled = !!spreadFilterLabel.value;
            spreadFilterSelect.disabled = !enabled;
            spreadFilterInput.disabled = !enabled;
            if (!enabled) spreadFilterInput.value = '';
        });

        container.appendChild(spreadFilterLabel);
        container.appendChild(spreadFilterSelect);
        container.appendChild(spreadFilterInput);

        return { container, spreadFilterLabel, spreadFilterSelect, spreadFilterInput };
    }

    function setupDragging(container, header) {
        let isDragging = false;
        let initialX, initialY;

        header.addEventListener('mousedown', (e) => {
            if (['BUTTON', 'SELECT', 'INPUT', 'LABEL', 'SPAN'].includes(e.target.tagName)) return;
            isDragging = true;
            initialX = e.clientX - container.offsetLeft;
            initialY = e.clientY - container.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                container.style.left = `${e.clientX - initialX}px`;
                container.style.top = `${e.clientY - initialY}px`;
                container.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });
    }

    function setupEventListeners(controls) {
        const { performScan, searchInput, outputItemInput, priceFilterInput, spreadFilterInput,
               priceTypeSelect, priceFilterSelect, spreadFilterLabel, spreadFilterSelect,
               tradeModeSelect, alchemyModeSelect, teaCheckbox, satchelCheckbox,
               satchelLevelSelect, favoritesOnlyCheckbox } = controls;

        const refreshBtn = document.querySelector('#transmute-calculator button[title="重新整理"]');
        if (refreshBtn) refreshBtn.addEventListener('click', performScan);

        tradeModeSelect.addEventListener('change', performScan);
        alchemyModeSelect.addEventListener('change', performScan);

        createSearchSuggestions(searchInput, performScan);
        createSearchSuggestions(outputItemInput, performScan);

        const debounce = (fn, delay) => {
            let timeout;
            return () => {
                clearTimeout(timeout);
                timeout = setTimeout(fn, delay);
            };
        };

        searchInput.addEventListener('input', debounce(performScan, 800));
        outputItemInput.addEventListener('input', debounce(performScan, 800));
        priceFilterInput.addEventListener('input', debounce(performScan, 800));
        spreadFilterInput.addEventListener('input', debounce(performScan, 800));

        priceTypeSelect.addEventListener('change', () => {
            if (priceTypeSelect.value && priceFilterInput.value) performScan();
        });
        priceFilterSelect.addEventListener('change', () => {
            if (priceTypeSelect.value && priceFilterInput.value) performScan();
        });
        spreadFilterLabel.addEventListener('change', () => {
            if (spreadFilterLabel.value && spreadFilterInput.value) performScan();
        });
        spreadFilterSelect.addEventListener('change', () => {
            if (spreadFilterLabel.value && spreadFilterInput.value) performScan();
        });

        favoritesOnlyCheckbox.addEventListener('change', performScan);
        teaCheckbox.addEventListener('change', () => {
            manualCatalyticTea = teaCheckbox.checked;
            console.log(`催化茶手動設定: ${manualCatalyticTea ? '開啟' : '關閉'}`);
            performScan();
        });

        satchelCheckbox.addEventListener('change', () => {
            console.log(`暴飲袋: ${satchelCheckbox.checked ? '開啟' : '關閉'}`);
            performScan();
        });

        satchelLevelSelect.addEventListener('change', () => {
            if (satchelCheckbox.checked) {
                const level = parseInt(satchelLevelSelect.value);
                const bonus = getSatchelBonus(level);
                console.log(`暴飲袋等級: +${level} (${bonus.toFixed(2)}% 增強)`);
                performScan();
            }
        });
    }

    function createToggleButton(ui) {
        const button = document.createElement('button');
        button.id = 'transmute-calculator-toggle';
        button.title = '煉金計算器';
        button.style.cssText = `
            position: fixed; top: 120px; right: 12px; width: 42px; height: 42px;
            background: linear-gradient(135deg, rgba(86, 104, 255, 0.9), rgba(168, 85, 247, 0.9));
            color: #ffffff; border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 10px; cursor: move; z-index: 999999;
            font-size: 18px; display: flex; align-items: center; justify-content: center;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3); transition: all 0.2s;
        `;
        button.textContent = '🧪';

        button.addEventListener('mouseenter', () => {
            button.style.transform = 'scale(1.05)';
            button.style.boxShadow = '0 6px 16px rgba(86, 104, 255, 0.4)';
        });

        button.addEventListener('mouseleave', () => {
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)';
        });

        let isDragging = false;
        let hasMoved = false;
        let startX, startY, initialX, initialY;

        button.addEventListener('mousedown', (e) => {
            isDragging = true;
            hasMoved = false;
            startX = e.clientX;
            startY = e.clientY;
            initialX = e.clientX - button.offsetLeft;
            initialY = e.clientY - button.offsetTop;
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                const deltaX = Math.abs(e.clientX - startX);
                const deltaY = Math.abs(e.clientY - startY);
                if (deltaX > 5 || deltaY > 5) hasMoved = true;

                button.style.left = `${e.clientX - initialX}px`;
                button.style.top = `${e.clientY - initialY}px`;
                button.style.right = 'auto';
            }
        });

        document.addEventListener('mouseup', () => {
            isDragging = false;
        });

        button.addEventListener('click', () => {
            if (!hasMoved) {
                const calculator = ui.container || document.getElementById('transmute-calculator');
                if (calculator.style.display === 'none') {
                    calculator.style.display = 'flex';
                    ui.teaCheckbox.checked = manualCatalyticTea;
                    ui.performScan();
                } else {
                    calculator.style.display = 'none';
                }
            }
            hasMoved = false;
        });

        document.body.appendChild(button);
    }

    // ===== 初始化 =====
    waitForInit().then(() => {
        console.log('🎉 MWI Transmute Calculator Enhanced v5.0.3 初始化完成');
        window.transmuteDetailModal = createDetailModal();
        const controls = createUI();
        setupEventListeners(controls);
        createToggleButton(controls);
    });

})();