// ==UserScript==
// @name         MWI-Bulwark-Equipment-Diff
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  双手盾装备DPS对比工具
// @author       wangchyan
// @match        https://*.milkywayidle.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=milkywayidle.com
// @require      https://cdn.jsdelivr.net/npm/lz-string@1.5.0/libs/lz-string.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/564337/MWI-Bulwark-Equipment-Diff.user.js
// @updateURL https://update.greasyfork.org/scripts/564337/MWI-Bulwark-Equipment-Diff.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let selfData = {};
    let importedStats = null; // 存储导入的玩家属性（用于动态系数计算）
    let importedEquipmentStats = {}; // 存储导入时各位置装备的词条数据
    let importedBaseValues = {}; // 存储导入时各属性的基础值（不含装备加成）
    let importedTotalValues = {}; // 存储导入时各属性的总值（用于固定增益转相对值）
    let currentEquipmentMap = {}; // 存储当前装备item信息
    let itemDetailMap = {}; // 存储游戏物品详细信息
    let isButtonInSuccessState = false;

    const colors = {
        info: 'rgb(0, 108, 158)',
        smaller: 'rgb(199, 21, 21)',
        greater: 'rgb(23, 151, 12)',
        disabled: 'rgb(128, 128, 128)',
        success: 'rgb(34, 197, 94)',
    };

    // 强化加成倍数表（索引=强化等级，值=加成倍数）
    const ENHANCEMENT_MULTIPLIER_TABLE = [
        0, 1, 2.1, 3.3, 4.6, 6, 7.5, 9.1, 10.8, 12.6,
        14.5, 16.7, 19.2, 22, 25.1, 28.5, 32.2, 36.2, 40.5, 45.1, 50
    ];

    // 硬编码的中文物品名称到 itemHrid 的映射表
    // 反向映射函数
    function inverseKV(obj) {
        const retobj = {};
        for (const key in obj) {
            retobj[obj[key]] = key;
        }
        return retobj;
    }

    // ZHItemNames: HRID -> 中文名
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
        "/items/small_artisans_crate": "小工匠箱",
        "/items/medium_artisans_crate": "中工匠箱",
        "/items/large_artisans_crate": "大工匠箱",
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
        "/items/ultra_milking_tea": "终极挤奶茶",
        "/items/ultra_foraging_tea": "终极采摘茶",
        "/items/ultra_woodcutting_tea": "终极伐木茶",
        "/items/ultra_cooking_tea": "终极烹饪茶",
        "/items/ultra_brewing_tea": "终极冲泡茶",
        "/items/ultra_alchemy_tea": "终极炼金茶",
        "/items/ultra_enhancing_tea": "终极强化茶",
        "/items/ultra_cheesesmithing_tea": "终极奶酪锻造茶",
        "/items/ultra_crafting_tea": "终极制作茶",
        "/items/ultra_tailoring_tea": "终极缝纫茶",
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
        "/items/ultra_stamina_coffee": "终极耐力咖啡",
        "/items/ultra_intelligence_coffee": "终极智力咖啡",
        "/items/ultra_defense_coffee": "终极防御咖啡",
        "/items/ultra_attack_coffee": "终极攻击咖啡",
        "/items/ultra_melee_coffee": "终极近战咖啡",
        "/items/ultra_ranged_coffee": "终极远程咖啡",
        "/items/ultra_magic_coffee": "终极魔法咖啡",
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
        "/items/pestilent_shot": "瘟疫射击",
        "/items/penetrating_shot": "穿透射击",
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
        "/items/furious_spear": "愤怒长枪",
        "/items/furious_spear_refined": "愤怒长枪（精）",
        "/items/regal_sword": "君王之剑",
        "/items/regal_sword_refined": "君王之剑（精）",
        "/items/chaotic_flail": "混乱连枷",
        "/items/chaotic_flail_refined": "混乱连枷（精）",
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
        "/items/rough_hood": "粗革兜帽",
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
        "/items/rough_tunic": "粗革皮衣",
        "/items/reptile_tunic": "爬行动物皮衣",
        "/items/gobo_tunic": "哥布林皮衣",
        "/items/beast_tunic": "野兽皮衣",
        "/items/umbral_tunic": "暗影皮衣",
        "/items/cotton_robe_top": "棉袍服",
        "/items/linen_robe_top": "亚麻袍服",
        "/items/bamboo_robe_top": "竹袍服",
        "/items/silk_robe_top": "丝袍服",
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
        "/items/rough_chaps": "粗革皮裤",
        "/items/reptile_chaps": "爬行动物皮裤",
        "/items/gobo_chaps": "哥布林皮裤",
        "/items/beast_chaps": "野兽皮裤",
        "/items/umbral_chaps": "暗影皮裤",
        "/items/cotton_robe_bottoms": "棉袍裙",
        "/items/linen_robe_bottoms": "亚麻袍裙",
        "/items/bamboo_robe_bottoms": "竹袍裙",
        "/items/silk_robe_bottoms": "丝袍裙",
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
        "/items/rough_bracers": "粗革护腕",
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
        "/items/sorcerer_boots": "法师靴",
        "/items/cheese_boots": "奶酪靴",
        "/items/verdant_boots": "翠绿靴",
        "/items/azure_boots": "蔚蓝靴",
        "/items/burble_boots": "深紫靴",
        "/items/crimson_boots": "绛红靴",
        "/items/rainbow_boots": "彩虹靴",
        "/items/holy_boots": "神圣靴",
        "/items/rough_boots": "粗革靴",
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
        "/items/wizard_necklace": "法师项链",
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
        "/items/rough_hide": "粗革兽皮",
        "/items/reptile_hide": "爬行动物皮",
        "/items/gobo_hide": "哥布林皮",
        "/items/beast_hide": "野兽皮",
        "/items/umbral_hide": "暗影皮",
        "/items/rough_leather": "粗革皮革",
        "/items/reptile_leather": "爬行动物皮革",
        "/items/gobo_leather": "哥布林皮革",
        "/items/beast_leather": "野兽皮革",
        "/items/umbral_leather": "暗影皮革",
        "/items/cotton": "棉花",
        "/items/flax": "亚麻",
        "/items/bamboo_branch": "竹子",
        "/items/cocoon": "茧",
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
        "/items/sorcerers_sole": "法师鞋底",
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
        "/items/chaotic_chain": "混乱锁链",
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
        "/items/philosophers_mirror": "贤者之镜"
    };

    // 创建反向映射：中文名 -> itemHrid
    const ZHToItemHridMap = inverseKV(ZHItemNames);

    // 英文名称到 itemHrid 的映射（从 itemDetailMap 动态构建）
    let ENToItemHridMap = {};

    // 构建英文名称映射
    function buildEnglishNameMap() {
        if (Object.keys(ENToItemHridMap).length > 0) return; // 已经构建过
        ENToItemHridMap = {};
        for (const [hrid, detail] of Object.entries(itemDetailMap)) {
            if (detail && detail.name) {
                // itemDetailMap 中的 name 字段是英文名称
                ENToItemHridMap[detail.name] = hrid;
            }
        }
        // console.log('Bulwark Diff: Built English name map with', Object.keys(ENToItemHridMap).length, 'items');
    }

    // 动态检查当前语言设置
    function isZH() {
        return localStorage.getItem("i18nextLng")?.toLowerCase()?.startsWith("zh") || false;
    }

    // 双手盾DPS模型权重
    const DPS_WEIGHTS = {
        autoAttack: 0.40,
        retaliation: 0.30,
        thorns: 0.20,
        other: 0.10
    };

    // 论文中提到的属性列表及其收益系数
    // type: 'percent' = 比例增益(+x%)，直接用百分比差值
    // type: 'flat' = 固定增益(+x)，需要转换为相对基础值的百分比
    const PAPER_STATS = {
        '物理增幅': { en: 'Physical Amplify', coefficient: 0.50, dynamic: false, type: 'percent' },
        '防御伤害': { en: 'Defensive Damage', coefficient: 0.40, dynamic: true, type: 'percent' },
        '自动攻击伤害': { en: 'Auto Attack Damage', coefficient: 0.40, dynamic: false, type: 'percent' },
        '攻击速度': { en: 'Attack Speed', coefficient: 0.40, dynamic: false, type: 'percent' },
        '钝击精准度': { en: 'Smash Accuracy', coefficient: 0.40, dynamic: false, type: 'percent' },
        '护甲': { en: 'Armor', coefficient: 0.20, dynamic: false, type: 'flat' },
        '暴击率': { en: 'Critical Rate', coefficient: 0.20, dynamic: false, type: 'percent' },
        '钝击伤害': { en: 'Smash Damage', coefficient: 0.10, dynamic: true, type: 'percent' },
    };

    // 装备位置映射
    const EQUIPMENT_SLOTS = {
        '/item_locations/head': 'head',
        '/item_locations/body': 'body',
        '/item_locations/legs': 'legs',
        '/item_locations/feet': 'feet',
        '/item_locations/hands': 'hands',
        '/item_locations/main_hand': 'main_hand',
        '/item_locations/off_hand': 'off_hand',
        '/item_locations/two_hand': 'two_hand',
        '/item_locations/neck': 'neck',
        '/item_locations/earrings': 'earrings',
        '/item_locations/ring': 'ring',
        '/item_locations/back': 'back',
        '/item_locations/pouch': 'pouch',
        '/item_locations/trinket': 'trinket',
    };

    function transZH(zh) {
        if (isZH()) return zh;
        return {
            "战斗风格": "Combat Style",
            "伤害类型": "Damage Type",
            "自动攻击伤害": "Auto Attack Damage",
            "攻击速度": "Attack Speed",
            "攻击间隔": "Attack Interval",
            "暴击率": "Critical Rate",
            "钝击精准度": "Smash Accuracy",
            "钝击伤害": "Smash Damage",
            "物理增幅": "Physical Amplify",
            "防御伤害": "Defensive Damage",
            "护甲": "Armor",
        }[zh] || zh;
    }

    function getStatZHName(key) {
        if (PAPER_STATS[key]) return key;
        for (const zhName in PAPER_STATS) {
            if (PAPER_STATS[zhName].en === key || PAPER_STATS[zhName].en.toLowerCase() === key.toLowerCase()) {
                return zhName;
            }
        }
        return null;
    }

    function isStatInPaper(key) {
        return getStatZHName(key) !== null;
    }

    // 检查是否装备了双手盾
    function isBulwarkEquipped() {
        const twoHandItem = currentEquipmentMap['/item_locations/two_hand'];
        if (!twoHandItem) return false;
        const itemHrid = (twoHandItem.itemHrid || '').toLowerCase();
        return itemHrid.includes('bulwark');
    }

    // 检查itemHrid是否是双手盾
    function isBulwarkItem(itemHrid) {
        if (!itemHrid) return false;
        return itemHrid.toLowerCase().includes('bulwark');
    }

    // 获取装备位置类型
    function getEquipmentSlot(itemHrid) {
        if (!itemHrid || !itemDetailMap[itemHrid]) return null;
        const detail = itemDetailMap[itemHrid];
        return detail?.equipmentDetail?.type || null;
    }

    // 获取技能等级
    function getSkillLevel(skillName, skillMap) {
        if (!skillMap) return 0;
        for (const skill of skillMap) {
            if (skill.skillHrid === skillName) {
                return skill.level;
            }
        }
        return 0;
    }

    // 获取玩家当前属性用于动态系数计算
    function getPlayerStats() {
        if (!selfData || !selfData.combatUnit) return null;

        const combatDetails = selfData.combatUnit.combatDetails;
        const combatStats = combatDetails?.combatStats || {};

        const defenseLevel = getSkillLevel('/skills/defense', selfData.characterSkills);
        const meleeLevel = getSkillLevel('/skills/attack', selfData.characterSkills);

        const defensiveDamageBonus = combatStats.defensiveDamage || 0;
        const smashDamageBonus = combatStats.smashDamage || 0;

        const S = (10 + meleeLevel) * (1 + smashDamageBonus);
        const D = (10 + defenseLevel) * (1 + defensiveDamageBonus);
        const totalSmashDamage = S + D;

        return {
            defenseLevel,
            meleeLevel,
            defensiveDamageBonus,
            smashDamageBonus,
            totalSmashDamage,
        };
    }

    // 计算装备的属性（从itemDetailMap获取基础属性，根据强化等级计算实际属性）
    // 公式：最终属性 = 基础属性 + 强化倍数 × 强化加成基础值
    function getEquipmentStats(itemHrid, enhancementLevel) {
        if (!itemHrid || !itemDetailMap[itemHrid]) return {};

        const detail = itemDetailMap[itemHrid];
        const equipDetail = detail?.equipmentDetail;
        if (!equipDetail) return {};

        const stats = {};
        const combatStats = equipDetail.combatStats || {};
        const combatEnhancementBonuses = equipDetail.combatEnhancementBonuses || {};

        // 获取强化倍数
        const level = Math.min(Math.max(enhancementLevel || 0, 0), 20);
        const multiplier = ENHANCEMENT_MULTIPLIER_TABLE[level] || 0;

        // 提取战斗属性
        for (const [key, value] of Object.entries(combatStats)) {
            if (value !== undefined && value !== null && typeof value === 'number') {
                const zhName = combatStatKeyToZHName(key);
                if (zhName && isStatInPaper(zhName)) {
                    // 计算强化后的属性：基础属性 + 强化倍数 × 强化加成基础值
                    const enhancementBonus = combatEnhancementBonuses[key] || 0;
                    const finalValue = value + multiplier * enhancementBonus;

                    // 转为百分比格式（游戏数据是小数形式）
                    stats[zhName] = finalValue * 100;
                }
            }
        }

        return stats;
    }

    // 将combatStats的key转换为中文名称（内部使用）
    function combatStatKeyToZHName(key) {
        const mapping = {
            'physicalAmplify': '物理增幅',
            'defensiveDamage': '防御伤害',
            'autoAttackDamage': '自动攻击伤害',
            'attackSpeed': '攻击速度',
            'smashAccuracy': '钝击精准度',
            'armor': '护甲',
            'criticalRate': '暴击率',
            'smashDamage': '钝击伤害',
        };
        return mapping[key] || null;
    }

    // 将combatStats的key转换为显示名称（根据当前语言）
    function combatStatKeyToName(key) {
        const zhName = combatStatKeyToZHName(key);
        if (!zhName) return null;
        return isZH() ? zhName : (PAPER_STATS[zhName]?.en || null);
    }

    // 导入当前属性（直接从游戏数据计算装备属性）
    function importAllEquipmentStats() {
        importedEquipmentStats = {};
        importedTotalValues = {};

        // 确保 itemDetailMap 已加载
        if (Object.keys(itemDetailMap).length === 0) {
            loadGameData();
            buildEnglishNameMap();
        }

        // 1. 获取当前总属性值（从combatStats）
        const combatStats = selfData?.combatUnit?.combatDetails?.combatStats || {};

        // 记录当前总值（全部转为百分比格式）
        for (const [key, value] of Object.entries(combatStats)) {
            const zhName = combatStatKeyToZHName(key);
            if (zhName && isStatInPaper(zhName)) {
                importedTotalValues[zhName] = (value || 0) * 100; // 转为百分比
            }
        }

        // 2. 直接从数据计算每件装备的属性（使用正确的强化公式）
        for (const [location, item] of Object.entries(currentEquipmentMap)) {
            if (!item || !item.itemHrid) continue;

            const stats = getEquipmentStats(item.itemHrid, item.enhancementLevel);
            if (Object.keys(stats).length > 0) {
                importedEquipmentStats[location] = stats;
            }
        }

        // console.log('Bulwark Diff: Total values:', importedTotalValues);
        // console.log('Bulwark Diff: Equipment stats:', importedEquipmentStats);
    }

    // 获取属性的DPS收益系数
    function getStatCoefficient(statKey, stats) {
        const zhName = getStatZHName(statKey);
        if (!zhName) return null;

        const statInfo = PAPER_STATS[zhName];

        if (statInfo.dynamic) {
            if (zhName === '防御伤害') {
                const currentDefDmg = stats.defensiveDamageBonus || 0;
                const autoAttackContrib = (10 + stats.defenseLevel) / stats.totalSmashDamage;
                const thornsContrib = 1 / (1 + currentDefDmg);
                const weighted = autoAttackContrib * (DPS_WEIGHTS.autoAttack + DPS_WEIGHTS.other) +
                               thornsContrib * (DPS_WEIGHTS.retaliation + DPS_WEIGHTS.thorns);
                return weighted;
            }
            if (zhName === '钝击伤害') {
                const contrib = (10 + stats.meleeLevel) / stats.totalSmashDamage;
                return contrib * (DPS_WEIGHTS.autoAttack + DPS_WEIGHTS.other);
            }
        }

        return statInfo.coefficient;
    }

    // 创建导入按钮
    function createImportButton() {
        const buttonContainer = document.querySelector('[class*="EquipmentPanel_buttonContainer"]');
        if (!buttonContainer) return;
        if (buttonContainer.querySelector('.BulwarkImportButton')) return;

        const originalButton = buttonContainer.querySelector('button');
        if (!originalButton) return;

        const importButton = originalButton.cloneNode(true);
        importButton.classList.add('BulwarkImportButton');
        importButton.style.marginLeft = '8px';
        importButton.style.display = 'inline-flex';
        importButton.onclick = null;

        buttonContainer.style.display = 'flex';
        buttonContainer.style.flexWrap = 'wrap';
        buttonContainer.style.gap = '8px';
        buttonContainer.style.alignItems = 'center';

        updateButtonDisplay(importButton);

        importButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (!isBulwarkEquipped() || isButtonInSuccessState) return;

            const stats = getPlayerStats();
            if (stats) {
                importedStats = stats;
                isButtonInSuccessState = true;

                // 直接从数据计算装备属性
                importAllEquipmentStats();

                // 显示成功状态
                const scannedCount = Object.keys(importedEquipmentStats).length;
                importButton.textContent = isZH() ? `导入成功 (${scannedCount}件)` : `Success (${scannedCount})`;
                importButton.style.backgroundColor = colors.success;
                importButton.style.color = '#fff';

                setTimeout(() => {
                    isButtonInSuccessState = false;
                    importButton.textContent = isZH() ? '重新导入当前属性' : 'Re-import Stats';
                    importButton.style.backgroundColor = '';
                    importButton.style.color = '';
                }, 3000);
            }
        });

        buttonContainer.appendChild(importButton);
    }

    function updateButtonDisplay(button) {
        if (isButtonInSuccessState) return;

        const hasBulwark = isBulwarkEquipped();

        if (!hasBulwark) {
            button.textContent = isZH() ? '未装备双手盾' : 'No Bulwark Equipped';
            button.style.backgroundColor = colors.disabled;
            button.style.opacity = '0.6';
            button.style.cursor = 'not-allowed';
            button.disabled = true;
        } else if (importedStats) {
            button.textContent = isZH() ? '重新导入当前属性' : 'Re-import Stats';
            button.style.backgroundColor = '';
            button.style.opacity = '';
            button.style.cursor = '';
            button.disabled = false;
        } else {
            button.textContent = isZH() ? '导入当前属性' : 'Import Current Stats';
            button.style.backgroundColor = '';
            button.style.opacity = '';
            button.style.cursor = '';
            button.disabled = false;
        }
    }

    // 解析装备模态框数据
    function parseEquipmentModal(element) {
        const equipmentDetail = {};
        const detailLines = element.querySelectorAll('[class*="EquipmentStatsText_stat"]');
        for (const line of detailLines) {
            if (line.querySelector('[class*="EquipmentStatsText_uniqueStat"]')) continue;
            const data = line.textContent.split(':');
            if (data.length === 2) {
                const key = data[0].trim();
                const value = data[1].split('(')[0].trim();
                if (value === 'N/A') continue;
                equipmentDetail[key] = value;
            }
        }
        return equipmentDetail;
    }


    // 装备类型文本到位置的映射
    const EQUIPMENT_TYPE_TO_LOCATION = {
        // 中文
        '头部': '/item_locations/head',
        '身体': '/item_locations/body',
        '腿部': '/item_locations/legs',
        '脚部': '/item_locations/feet',
        '手部': '/item_locations/hands',
        '主手': '/item_locations/main_hand',
        '副手': '/item_locations/off_hand',
        '双手': '/item_locations/two_hand',
        '项链': '/item_locations/neck',
        '耳环': '/item_locations/earrings',
        '戒指': '/item_locations/ring',
        '背部': '/item_locations/back',
        '口袋': '/item_locations/pouch',
        '饰品': '/item_locations/trinket',
        // 英文
        'Head': '/item_locations/head',
        'Body': '/item_locations/body',
        'Legs': '/item_locations/legs',
        'Feet': '/item_locations/feet',
        'Hands': '/item_locations/hands',
        'Main Hand': '/item_locations/main_hand',
        'Off Hand': '/item_locations/off_hand',
        'Two Hand': '/item_locations/two_hand',
        'Neck': '/item_locations/neck',
        'Earrings': '/item_locations/earrings',
        'Ring': '/item_locations/ring',
        'Back': '/item_locations/back',
        'Pouch': '/item_locations/pouch',
        'Trinket': '/item_locations/trinket',
    };

    // 从tooltip中获取装备位置
    function getEquipmentLocationFromModal(modal) {
        // 查找装备类型文本
        const allText = modal.textContent;

        // 调试：打印tooltip中的所有文本
        // console.log('Bulwark Diff: Modal text sample:', allText.substring(0, 500));

        // 查找包含装备类型的行
        const lines = modal.querySelectorAll('[class*="ItemTooltipText_infoText"], [class*="EquipmentStatsText_stat"], div');
        for (const line of lines) {
            const text = line.textContent.trim();
            // 检查是否包含装备类型关键词
            if (text.includes('装备类型') || text.includes('Equipment Type') ||
                text.includes('类型') || text.includes('Type:')) {
                // console.log('Bulwark Diff: Found type line:', text);
                const parts = text.split(':');
                if (parts.length >= 2) {
                    const typeName = parts[parts.length - 1].trim();
                    const location = EQUIPMENT_TYPE_TO_LOCATION[typeName];
                    if (location) {
                        // console.log('Bulwark Diff: Found location from type text:', typeName, '->', location);
                        return location;
                    }
                }
            }
        }

        // 备用方法：直接在文本中查找装备类型名
        for (const [typeName, location] of Object.entries(EQUIPMENT_TYPE_TO_LOCATION)) {
            // 检查各种可能的格式
            if (allText.includes(`装备类型: ${typeName}`) ||
                allText.includes(`Equipment Type: ${typeName}`) ||
                allText.includes(`类型: ${typeName}`) ||
                allText.includes(`Type: ${typeName}`)) {
                // console.log('Bulwark Diff: Found location from full text:', typeName, '->', location);
                return location;
            }
        }

        // console.log('Bulwark Diff: Could not find equipment location');
        return null;
    }

    // 检查是否是双手盾类型的武器（从tooltip属性判断）
    // 双手盾的特征：有 "防御伤害" 属性
    function isBulwarkFromModal(modal) {
        const allText = modal.textContent;
        // 检查是否有防御伤害属性（双手盾特有）
        return allText.includes('防御伤害') || allText.includes('Defensive Damage');
    }

    // 从tooltip获取强化等级
    function getEnhancementLevelFromModal(modal) {
        const nameElem = modal.querySelector('[class*="ItemTooltipText_name"]');
        if (!nameElem) return 0;

        const spans = nameElem.querySelectorAll('span');
        if (spans.length > 1) {
            const levelMatch = spans[1].textContent.match(/\+(\d+)/);
            if (levelMatch) return parseInt(levelMatch[1]);
        } else {
            const fullText = nameElem.textContent.trim();
            const match = fullText.match(/\+(\d+)$/);
            if (match) return parseInt(match[1]);
        }
        return 0;
    }

    // 从tooltip获取装备的计算属性（使用正确的强化公式）
    function getCalculatedEquipmentStats(modal) {
        const itemHrid = getItemHridFromModal(modal);
        if (!itemHrid) return null;

        const enhancementLevel = getEnhancementLevelFromModal(modal);
        const stats = getEquipmentStats(itemHrid, enhancementLevel);

        // console.log('Bulwark Diff: Calculated stats for', itemHrid, '+' + enhancementLevel, ':', stats);
        return stats;
    }

    // 获取装备的itemHrid（支持中文和英文名称）
    function getItemHridFromModal(modal) {
        // 从物品名称获取
        const nameElem = modal.querySelector('[class*="ItemTooltipText_name"]');
        if (!nameElem) {
            // console.log('Bulwark Diff: Could not find item name element');
            return null;
        }

        const spans = nameElem.querySelectorAll('span');
        let itemName = '';
        if (spans.length > 0) {
            itemName = spans[0].textContent.trim();
        } else {
            itemName = nameElem.textContent.trim();
        }

        // 移除强化等级后缀（如 "+12"）
        itemName = itemName.replace(/\s*\+\d+$/, '').trim();

        // 先尝试中文名称映射（硬编码）
        let hrid = ZHToItemHridMap[itemName];
        if (hrid) {
            // console.log('Bulwark Diff: Found itemHrid from Chinese map:', itemName, '->', hrid);
            return hrid;
        }

        // 再尝试英文名称映射（从 itemDetailMap 构建）
        buildEnglishNameMap();
        hrid = ENToItemHridMap[itemName];
        if (hrid) {
            // console.log('Bulwark Diff: Found itemHrid from English map:', itemName, '->', hrid);
            return hrid;
        }

        // console.log('Bulwark Diff: Could not find itemHrid for:', itemName);
        return null;
    }

    // 判断tooltip中的装备位置
    function getEquipmentSlotFromTooltip(equipmentData) {
        // 根据装备类型判断位置
        // 这里需要从装备属性推断，或者从itemDetailMap获取
        return null; // 简化处理，后续可以完善
    }

    function parseStatValue(valueStr) {
        if (!valueStr) return 0;
        const cleaned = valueStr.replace(',', '').replace(' ', '').replace('+', '').replace('_', '');
        if (cleaned.endsWith('%')) {
            return parseFloat(cleaned.replace('%', ''));
        } else if (cleaned.endsWith('s')) {
            return parseFloat(cleaned.replace('s', '')) * 100;
        }
        return parseFloat(cleaned) || 0;
    }

    // 计算相对差值
    // 论文定义：1%相对词条提升 = 当前总属性的1%
    // 相对提升 = (装备属性差) / 当前总属性 × 100%
    function calculateRelativeDiff(statName, newValue, currentValue) {
        const zhName = getStatZHName(statName);
        if (!zhName) return { diff: 0, relativeDiff: 0 };

        const statInfo = PAPER_STATS[zhName];
        const absoluteDiff = newValue - currentValue;

        // 获取当前总属性值
        const totalValue = importedTotalValues[statName] || 100;

        if (totalValue === 0) return { diff: absoluteDiff, relativeDiff: 0 };

        // 相对提升 = 属性差 / 总属性 × 100%
        const relativeDiff = (absoluteDiff / totalValue) * 100;

        return { diff: absoluteDiff, relativeDiff };
    }

    // 计算DPS差异（新装备 vs 当前同位置装备）
    // equipmentLocation: 直接传入装备位置（如 '/item_locations/neck'）
    // isBulwark: 是否是双手盾
    function calculateDPSDiff(newEquipmentData, equipmentLocation, isBulwark) {
        if (!importedStats) {
            return { error: isZH() ? '请先导入当前属性' : 'Please import stats first' };
        }

        if (!equipmentLocation) {
            return { error: isZH() ? '无法识别装备类型' : 'Unknown equipment type' };
        }

        // console.log('Bulwark Diff: calculateDPSDiff', {
        //     equipmentLocation,
        //     isBulwark,
        //     newEquipmentData,
        //     importedEquipmentStats
        // });

        // 如果是双手武器位置，检查是否是bulwark
        if (equipmentLocation === '/item_locations/two_hand') {
            if (!isBulwark) {
                return { error: isZH() ? '非双手盾装备' : 'Not a Bulwark' };
            }
        }

        // 获取当前位置的装备属性
        const currentSlotStats = importedEquipmentStats[equipmentLocation] || {};
        // console.log('Bulwark Diff: Current slot stats', { equipmentLocation, currentSlotStats });

        // 标准化 newEquipmentData：将属性名称（可能是中文或英文）转换为中文名称
        const normalizedNewEquipmentData = {};
        for (const [key, value] of Object.entries(newEquipmentData)) {
            if (!isStatInPaper(key)) continue;
            const zhName = getStatZHName(key);
            if (zhName) {
                normalizedNewEquipmentData[zhName] = value;
            }
        }

        let totalDPSDiff = 0;
        const details = {};

        // 计算差异
        for (const key in normalizedNewEquipmentData) {
            if (!isStatInPaper(key)) continue;

            // newEquipmentData 现在直接是数字格式
            const newValue = typeof normalizedNewEquipmentData[key] === 'number'
                ? normalizedNewEquipmentData[key]
                : parseStatValue(normalizedNewEquipmentData[key]);
            const currentValue = currentSlotStats[key] || 0;

            // 检查是否两方不全为0
            const hasCurrentValue = currentValue && currentValue !== 0;
            const hasNewValue = newValue && newValue !== 0;
            if (!hasCurrentValue && !hasNewValue) continue; // 两方都为0，跳过

            const { diff, relativeDiff } = calculateRelativeDiff(key, newValue, currentValue);

            if (isNaN(relativeDiff)) continue;

            const coefficient = getStatCoefficient(key, importedStats);
            if (coefficient !== null) {
                const contribution = relativeDiff * coefficient;
                totalDPSDiff += contribution;
                details[key] = {
                    newValue,
                    currentValue,
                    diff,           // 绝对差值
                    relativeDiff,   // 相对差值（用于计算DPS）
                    contribution
                };
            }
        }

        // 处理当前装备有但新装备没有的属性（会减少）
        for (const key in currentSlotStats) {
            if (!isStatInPaper(key)) continue;
            if (normalizedNewEquipmentData[key]) continue; // 已经处理过

            const currentValue = currentSlotStats[key];

            // 检查是否两方不全为0（当前装备有值，新装备为0）
            const hasCurrentValue = currentValue && currentValue !== 0;
            if (!hasCurrentValue) continue; // 当前装备也为0，跳过

            const { diff, relativeDiff } = calculateRelativeDiff(key, 0, currentValue);

            if (isNaN(relativeDiff)) continue;

            const coefficient = getStatCoefficient(key, importedStats);
            if (coefficient !== null) {
                const contribution = relativeDiff * coefficient;
                totalDPSDiff += contribution;
                details[key] = {
                    newValue: 0,
                    currentValue,
                    diff,
                    relativeDiff,
                    contribution
                };
            }
        }

        return { dpsDiff: totalDPSDiff, details };
    }

    // 添加DPS显示到模态框
    function addDiffToModal(element, equipmentData, equipmentLocation, isBulwark, price) {
        if (!importedStats) return;
        if (element.querySelector('.bulwark-diff-header')) return;

        const parentArea = element.querySelector('[class*="EquipmentStatsText_equipmentStatsText"]');
        if (!parentArea) return;
        const TextArea = parentArea.firstChild;

        const dpsResult = calculateDPSDiff(equipmentData, equipmentLocation, isBulwark);

        const headerLine = document.createElement('div');
        headerLine.className = 'bulwark-diff-header';
        headerLine.style = 'display: flex; grid-gap: 6px; gap: 6px; justify-content: space-between; border-top: 1px solid #666; padding-top: 6px; margin-top: 6px;';

        const titleSpan = document.createElement('span');
        titleSpan.textContent = isZH() ? '双手盾DPS变化:' : 'Bulwark DPS Change:';
        titleSpan.style = `color: ${colors.info}; font-weight: bold;`;
        headerLine.appendChild(titleSpan);

        if (dpsResult.error) {
            const errorSpan = document.createElement('span');
            errorSpan.textContent = `[${dpsResult.error}]`;
            errorSpan.style = `color: ${colors.info}; font-weight: bold;`;
            headerLine.appendChild(errorSpan);
        } else {
            const dpsDiff = dpsResult.dpsDiff;
            const diffSpan = document.createElement('span');
            diffSpan.textContent = dpsDiff > 0 ? `+${dpsDiff.toFixed(3)}%` : `${dpsDiff.toFixed(3)}%`;
            diffSpan.style = `color: ${dpsDiff > 0 ? colors.greater : dpsDiff < 0 ? colors.smaller : colors.info}; font-weight: bold;`;
            headerLine.appendChild(diffSpan);
        }

        parentArea.insertBefore(headerLine, TextArea);

        // 性价比
        if (!dpsResult.error && dpsResult.dpsDiff !== 0 && price > 0) {
            const priceLine = document.createElement('div');
            priceLine.className = 'bulwark-diff-header';
            priceLine.style = 'display: flex; grid-gap: 6px; gap: 6px; justify-content: space-between;';

            const priceLabel = document.createElement('span');
            priceLabel.textContent = isZH() ? '每10M价格DPS:' : 'DPS% per 10M:';
            priceLabel.style = `color: ${colors.info}; font-weight: bold;`;
            priceLine.appendChild(priceLabel);

            const dpsPerMil = Math.abs(dpsResult.dpsDiff) / (price / 1e7);
            const dpsPerMilSpan = document.createElement('span');
            dpsPerMilSpan.textContent = `${dpsPerMil.toFixed(5)}%`;
            dpsPerMilSpan.style = `color: ${colors.info}; font-weight: bold;`;
            priceLine.appendChild(dpsPerMilSpan);

            parentArea.insertBefore(priceLine, TextArea);
        }

        // 显示各属性变化
        if (dpsResult.details) {
            const detailLines = element.querySelectorAll('[class*="EquipmentStatsText_stat"]');
            const displayedStats = new Set(); // 记录已显示的属性（中文名称）

            // 1. 先显示 tooltip 中存在的属性
            for (const line of detailLines) {
                const keyFromTooltip = line.textContent.split(':')[0].trim();
                if (!isStatInPaper(keyFromTooltip)) continue;

                // 将 tooltip 中的属性名称（可能是中文或英文）转换为中文名称
                const zhName = getStatZHName(keyFromTooltip);
                if (!zhName || !dpsResult.details[zhName]) continue;

                const detail = dpsResult.details[zhName];

                // 不显示没变化的属性
                if (detail.relativeDiff === 0) continue;

                const valueElement = line.querySelectorAll('span')[1];
                if (!valueElement) continue;

                const diffSpan = document.createElement('span');
                diffSpan.className = 'bulwark-diff-value';

                // 显示格式：只显示DPS贡献%
                const dpsText = detail.contribution > 0 ? `+${detail.contribution.toFixed(3)}%` : `${detail.contribution.toFixed(3)}%`;

                diffSpan.textContent = ` (${dpsText} DPS)`;
                diffSpan.style = `color: ${detail.relativeDiff > 0 ? colors.greater : colors.smaller}; font-weight: bold;`;
                valueElement.appendChild(diffSpan);

                displayedStats.add(zhName);
            }

            // 2. 对于 details 中存在但 tooltip 中不存在的属性，创建新的显示行
            for (const [zhName, detail] of Object.entries(dpsResult.details)) {
                if (displayedStats.has(zhName)) continue; // 已经显示过

                // 不显示没变化的属性
                if (detail.relativeDiff === 0) continue;

                // 检查是否两方不全为0
                const hasCurrentValue = detail.currentValue && detail.currentValue !== 0;
                const hasNewValue = detail.newValue && detail.newValue !== 0;
                if (!hasCurrentValue && !hasNewValue) continue; // 两方都为0，不显示

                // 创建新的属性行（克隆现有行的结构）
                const existingLine = detailLines[0];
                const newLine = existingLine ? existingLine.cloneNode(false) : document.createElement('div');
                if (!existingLine) {
                    newLine.className = 'EquipmentStatsText_stat';
                }
                newLine.innerHTML = ''; // 清空内容

                const nameSpan = document.createElement('span');
                const displayName = isZH() ? zhName : (PAPER_STATS[zhName]?.en || zhName);
                nameSpan.textContent = displayName + ':';

                const valueSpan = document.createElement('span');
                const newDisplayValue = detail.newValue ?
                    (detail.newValue > 0 ? `+${detail.newValue.toFixed(2)}%` : `${detail.newValue.toFixed(2)}%`) :
                    '0%';
                const dpsText = detail.contribution > 0 ? `+${detail.contribution.toFixed(3)}%` : `${detail.contribution.toFixed(3)}%`;
                valueSpan.innerHTML = `${newDisplayValue} <span style="color: ${detail.relativeDiff > 0 ? colors.greater : colors.smaller}; font-weight: bold;">(${dpsText} DPS)</span>`;

                newLine.appendChild(nameSpan);
                newLine.appendChild(valueSpan);

                // 插入到 headerLine 之后（下方）
                if (parentArea) {
                    const headerLine = parentArea.querySelector('.bulwark-diff-header');
                    if (headerLine && headerLine.nextSibling) {
                        parentArea.insertBefore(newLine, headerLine.nextSibling);
                    } else if (headerLine) {
                        parentArea.appendChild(newLine);
                    } else {
                        // 如果没有 headerLine，追加到末尾
                        parentArea.appendChild(newLine);
                    }
                }
            }
        }
    }

    function parsePrice(costText) {
        if (!costText) return 0;
        if (costText.endsWith('M')) return parseFloat(costText.replace('M', '').replace(',', '')) * 1e6;
        if (costText.endsWith('k') || costText.endsWith('K')) return parseFloat(costText.replace(/[kK]/, '').replace(',', '')) * 1e3;
        if (costText.endsWith('B')) return parseFloat(costText.replace('B', '').replace(',', '')) * 1e9;
        if (costText.endsWith('T')) return parseFloat(costText.replace('T', '').replace(',', '')) * 1e12;
        return parseFloat(costText.replace(',', '')) || 0;
    }

    function getMWIToolsPrice(modal) {
        const enhancedPriceText = isZH() ? '总成本' : 'Total cost';
        let costNodes = Array.from(modal.querySelectorAll('*')).filter(el => {
            if (!el.textContent || !el.textContent.includes(enhancedPriceText)) return false;
            return Array.from(el.childNodes).every(node => node.nodeType === Node.TEXT_NODE);
        });
        if (costNodes.length > 0) {
            const costText = costNodes[0].textContent.replace(enhancedPriceText, '').trim();
            return parsePrice(costText);
        }

        const normalPriceText = isZH() ? '日均价' : 'Daily average price';
        costNodes = Array.from(modal.querySelectorAll('*')).filter(el => {
            if (!el.textContent || !el.textContent.includes(normalPriceText)) return false;
            return Array.from(el.childNodes).every(node => node.nodeType === Node.TEXT_NODE);
        });
        if (costNodes.length > 0) {
            const costText = costNodes[0].textContent.split('/')[0].split(' ')[1]?.trim();
            return parsePrice(costText);
        }

        return 0;
    }

    // 解压initClientData（使用LZString）
    function decompressInitClientData(compressedData) {
        try {
            if (typeof LZString === 'undefined') {
                // console.log('Bulwark Diff: LZString not available');
                return null;
            }
            const decompressedJson = LZString.decompressFromUTF16(compressedData);
            if (!decompressedJson) {
                // console.log('Bulwark Diff: decompressFromUTF16 returned null');
                return null;
            }
            return JSON.parse(decompressedJson);
        } catch (e) {
            // console.log('Bulwark Diff: decompress error', e);
            return null;
        }
    }

    // 加载游戏数据
    function loadGameData() {
        // console.log('Bulwark Diff: loadGameData called, LZString:', typeof LZString !== 'undefined');
        try {
            const initClientData = localStorage.getItem("initClientData");
            // console.log('Bulwark Diff: initClientData exists:', !!initClientData);

            if (initClientData) {
                const obj = decompressInitClientData(initClientData);
                // console.log('Bulwark Diff: decompressed obj:', !!obj, obj ? Object.keys(obj).slice(0, 5) : null);
                if (obj && obj.itemDetailMap) {
                    itemDetailMap = obj.itemDetailMap;
                    // console.log('Bulwark Diff: itemDetailMap loaded with', Object.keys(itemDetailMap).length, 'items');
                    buildEnglishNameMap(); // 构建英文名称映射
                    return true;
                }
            }
        } catch (e) {
            // console.log('Bulwark Diff: Error loading itemDetailMap', e);
        }
        return false;
    }

    function updateEquipmentMap(characterItems) {
        if (!characterItems) return;
        currentEquipmentMap = {};
        for (const item of characterItems) {
            if (item.itemLocationHrid !== "/item_locations/inventory") {
                currentEquipmentMap[item.itemLocationHrid] = item;
            }
        }
    }

    // WebSocket Hook
    function hookWS() {
        const dataProperty = Object.getOwnPropertyDescriptor(MessageEvent.prototype, "data");
        if (!dataProperty || !dataProperty.get) return;
        const oriGet = dataProperty.get;

        dataProperty.get = function hookedGet() {
            const socket = this.currentTarget;
            if (!(socket instanceof WebSocket)) return oriGet.call(this);
            if (!socket.url.includes("api.milkywayidle.com/ws") && !socket.url.includes("api-test.milkywayidle.com/ws")) {
                return oriGet.call(this);
            }

            const message = oriGet.call(this);
            Object.defineProperty(this, "data", { value: message });

            try {
                handleMessage(message);
            } catch (error) {
                // console.log("Bulwark Diff: Error in handleMessage:", error);
            }
            return message;
        };

        Object.defineProperty(MessageEvent.prototype, "data", dataProperty);
    }

    function handleMessage(message) {
        if (typeof message !== "string") return;

        try {
            const parsedMessage = JSON.parse(message);

            if (parsedMessage?.type === "init_client_data") {
                if (parsedMessage.itemDetailMap) {
                    itemDetailMap = parsedMessage.itemDetailMap;
                    // console.log('Bulwark Diff: itemDetailMap loaded from WS');
                    buildEnglishNameMap(); // 构建英文名称映射
                }
            }

            if (parsedMessage?.type === "init_character_data") {
                selfData = parsedMessage;
                updateEquipmentMap(parsedMessage.characterItems);
                // console.log('Bulwark Diff: Character data loaded');
            }

            if (parsedMessage?.type === "items_updated" && parsedMessage.endCharacterItems) {
                for (const item of parsedMessage.endCharacterItems) {
                    if (item.itemLocationHrid !== "/item_locations/inventory") {
                        if (item.count === 0) {
                            currentEquipmentMap[item.itemLocationHrid] = null;
                        } else {
                            currentEquipmentMap[item.itemLocationHrid] = item;
                        }
                    }
                }
                // 更新按钮状态
                const btn = document.querySelector('.BulwarkImportButton');
                if (btn) updateButtonDisplay(btn);
            }
        } catch (error) {
            // Ignore
        }
    }

    // 使用 MutationObserver 监听DOM变化
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            // 检查按钮
            createImportButton();

            // 检查tooltip
            if (!importedStats) return;

            const modals = document.querySelectorAll('.MuiPopper-root');
            for (const modal of modals) {
                const equipmentDetail = modal.querySelector('[class*="ItemTooltipText_equipmentDetail"]');
                if (!equipmentDetail) continue;
                if (equipmentDetail.querySelector('.bulwark-diff-header')) continue;

                const equipmentLocation = getEquipmentLocationFromModal(modal);
                const isBulwark = isBulwarkFromModal(modal);
                const price = getMWIToolsPrice(modal);

                // 使用公式计算新装备的属性（与导入时使用相同的公式）
                const calculatedStats = getCalculatedEquipmentStats(modal);

                if (calculatedStats) {
                    // 使用计算的属性进行对比
                    addDiffToModal(equipmentDetail, calculatedStats, equipmentLocation, isBulwark, price);
                } else {
                    // 如果无法计算（找不到 itemHrid），回退到读取 tooltip
                    const equipmentData = parseEquipmentModal(equipmentDetail);
                    const parsedStats = {};
                    for (const [keyFromTooltip, value] of Object.entries(equipmentData)) {
                        if (!isStatInPaper(keyFromTooltip)) continue;
                        // 将 tooltip 中的属性名称（可能是中文或英文）转换为中文名称
                        const zhName = getStatZHName(keyFromTooltip);
                        if (zhName) {
                            parsedStats[zhName] = parseStatValue(value);
                        }
                    }
                    addDiffToModal(equipmentDetail, parsedStats, equipmentLocation, isBulwark, price);
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // 初始化
    hookWS();
    loadGameData();

    // 延迟启动observer，等待页面加载
    setTimeout(() => {
        setupObserver();
        // console.log('MWI-Bulwark-Equipment-Diff loaded');
    }, 1000);

})();
