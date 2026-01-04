// ==UserScript==
// @license CaiMoGu_OldDream
// @name         CraftOfExile模拟器做装翻译
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将craftofexile.com的英文翻译为中文，支持简体中文、繁体中文和英文切换
// @author       GitHub Copilot
// @include      https://www.craftofexile.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/549811/CraftOfExile%E6%A8%A1%E6%8B%9F%E5%99%A8%E5%81%9A%E8%A3%85%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/549811/CraftOfExile%E6%A8%A1%E6%8B%9F%E5%99%A8%E5%81%9A%E8%A3%85%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前语言，优先读取localStorage
    let currentLang = localStorage.getItem('coe_lang') || 'zh-CN';

    // 本地翻译映射
    const localTranslation = [

        // 页面元素翻译 (包括按钮、标签等)  
        { en: "Weapon", zhCN: "武器", zhTW: "武器" },
        { en: "Armour", zhCN: "护甲", zhTW: "護甲" },
        { en: "Helmet", zhCN: "头盔", zhTW: "頭盔" },
        { en: "Boots", zhCN: "鞋子", zhTW: "鞋子" },
        { en: "Gloves", zhCN: "手套", zhTW: "手套" },
        { en: "Shield", zhCN: "盾牌", zhTW: "盾牌" },
        { en: "Ring", zhCN: "戒指", zhTW: "戒指" },
        { en: "Amulet", zhCN: "项链", zhTW: "項鍊" },
        { en: "Belt", zhCN: "腰带", zhTW: "腰帶" },
        { en: "Life", zhCN: "生命", zhTW: "生命" },
        { en: "Mana", zhCN: "魔力", zhTW: "魔力" },
        { en: "Energy Shield", zhCN: "能量护盾", zhTW: "能量護盾" },
        { en: "Evasion", zhCN: "闪避", zhTW: "閃避" },
        { en: "Armour Rating", zhCN: "护甲值", zhTW: "護甲值" },
        { en: "Physical Damage", zhCN: "物理伤害", zhTW: "物理傷害" },
        { en: "Elemental Damage", zhCN: "元素伤害", zhTW: "元素傷害" },
        { en: "d4craft.com", zhCN: "d4craft.com", zhTW: "d4craft.com" },
        { en: "arpg.info", zhCN: "arpg.info", zhTW: "arpg.info" },
        { en: "poe1", zhCN: "poe1", zhTW: "poe1" },
        { en: "How to use", zhCN: "使用方法", zhTW: "使用方法" },
        { en: "Weightings", zhCN: "权重", zhTW: "權重" },
        { en: "Changelog", zhCN: "更新日志", zhTW: "更新日誌" },
        { en: "PatreonBecome a patreonLog in with patreon", zhCN: "赞助/登录Patreon", zhTW: "贊助/登入Patreon" },
        { en: "Patreon", zhCN: "赞助", zhTW: "贊助" },
        { en: "Current patchEarly-Access0.3.0", zhCN: "当前补丁 早期访问 0.3.0", zhTW: "當前補丁 早期訪問 0.3.0" },
        { en: "Current patch", zhCN: "当前补丁", zhTW: "當前補丁" },
        { en: "Early-Access", zhCN: "早期访问", zhTW: "早期訪問" },
        { en: "Current weightings values have been extrapolated", zhCN: "当前权重值已推算", zhTW: "當前權重值已推算" },
        { en: "using a special method. You can view the details about this by going to the Weightings page.", zhCN: "使用特殊方法。详情请参见权重页面。", zhTW: "使用特殊方法。詳情請參見權重頁面。" },
        { en: "Import item", zhCN: "导入物品", zhTW: "導入物品" },
        { en: "Base groupChoose base group", zhCN: "基础组 选择基础组", zhTW: "基礎組 選擇基礎組" },
        { en: "Choose base group", zhCN: "选择基础组", zhTW: "選擇基礎組" },
        { en: "Jewellery", zhCN: "珠宝", zhTW: "珠寶" },
        { en: "Offhands", zhCN: "副手", zhTW: "副手" },
        { en: "One-Handed Weapons", zhCN: "单手武器", zhTW: "單手武器" },
        { en: "Two-Handed Weapons", zhCN: "双手武器", zhTW: "雙手武器" },
        { en: "Latest Changes", zhCN: "最新变更", zhTW: "最新變更" },
        { en: "Choose item creation mode", zhCN: "选择物品创建模式", zhTW: "選擇物品創建模式" },
        { en: "Create new item", zhCN: "创建新物品", zhTW: "創建新物品" },
        { en: "or", zhCN: "或", zhTW: "或" },
        { en: "Import item", zhCN: "导入物品", zhTW: "導入物品" },
        { en: "PrivacyDonate", zhCN: "隐私/捐赠", zhTW: "隱私/捐贈" },
        { en: "Privacy", zhCN: "隐私", zhTW: "隱私" },
        { en: "Donate", zhCN: "捐赠", zhTW: "捐贈" },
        { en: "craftofexile.com is not affiliated with or endorsed by Grinding Gear Games", zhCN: "craftofexile.com 与 Grinding Gear Games 无关联或背书", zhTW: "craftofexile.com 與 Grinding Gear Games 無關聯或背書" },
       //物品属性翻译   
        { en: "QUALITY", zhCN: "品质", zhTW: "品質" },
        { en: "EVASION", zhCN: "闪避", zhTW: "閃避" },
        { en: "REQUIRES LEVEL", zhCN: "需要等级", zhTW: "需要等級" },
        { en: "(20-30)% reduced Slowing Potency of Debuffs on You", zhCN: "你身上的减速效果降低 (20-30)%", zhTW: "你身上的減速效果降低 (20-30)%" },
        { en: "(30-40)% increased Elemental Ailment Threshold", zhCN: "元素异常阈值提高 (30-40)%", zhTW: "元素異常閾值提高 (30-40)%" },
        { en: "Corsair CoatQuality: 20%evasion: 487Requires level: 80(10-20)% reduced Movement Speed Penalty from using Skills while moving", zhCN: "海盗外套 品质:20% 闪避:487 需要等级:80 使用技能移动时移动速度惩罚降低(10-20)%", zhTW: "海盜外套 品質:20% 閃避:487 需要等級:80 使用技能移動時移動速度懲罰降低(10-20)%" },
        { en: "(10-20)% reduced Movement Speed Penalty from using Skills while moving", zhCN: "使用技能移动时移动速度惩罚降低(10-20)%", zhTW: "使用技能移動時移動速度懲罰降低(10-20)%" },
        { en: "Choose options", zhCN: "选择选项", zhTW: "選擇選項" },
        { en: "Choose a base", zhCN: "选择基础", zhTW: "選擇基礎" },
        { en: "DEX", zhCN: "敏捷", zhTW: "敏捷" },
        { en: "DEX/INT", zhCN: "敏捷/智慧", zhTW: "敏捷/智慧" },
        { en: "STR", zhCN: "力量", zhTW: "力量" },
        { en: "STR/DEX", zhCN: "力量/敏捷", zhTW: "力量/敏捷" },
        { en: "STR/INT", zhCN: "力量/智慧", zhTW: "力量/智慧" },
        { en: "Select item level", zhCN: "选择物品等级", zhTW: "選擇物品等級" },
        { en: "Set item quality", zhCN: "设置物品品质", zhTW: "設置物品品質" },
        { en: "Set item sockets", zhCN: "设置物品插槽", zhTW: "設置物品插槽" },
        { en: "Proceed", zhCN: "继续", zhTW: "繼續" },
        { en: "Chaos Orb", zhCN: "混沌石", zhTW: "混沌石" },
        { en: "Exalted Orb", zhCN: "崇高石", zhTW: "崇高石" },
        { en: "Orb of Alchemy", zhCN: "点金石", zhTW: "點金石" },
        { en: "Orb of Augmentation", zhCN: "增幅石", zhTW: "增幅石" },
        { en: "Orb of Transmutation", zhCN: "蜕变石", zhTW: "蛻變石" },
        { en: "Regal Orb", zhCN: "富豪石", zhTW: "富豪石" },
        { en: "Orb of Annulment", zhCN: "无效石", zhTW: "無效石" },
        { en: "Close filtersOpen filters", zhCN: "关闭筛选/打开筛选", zhTW: "關閉篩選/打開篩選" },
        { en: "Close filters", zhCN: "关闭筛选", zhTW: "關閉篩選" },
        { en: "Close all groupsOpen all groups", zhCN: "关闭所有分组/打开所有分组", zhTW: "關閉所有分組/打開所有分組" },
        { en: "Close all groups", zhCN: "关闭所有分组", zhTW: "關閉所有分組" },
        { en: "LEFT click to expand and add modifiers as requirements, RIGHT click to add modifiers to the item blocking it from the pool.", zhCN: "左键展开并添加词缀为需求，右键添加词缀到物品并阻止其进入池中。", zhTW: "左鍵展開並添加詞綴為需求，右鍵添加詞綴到物品並阻止其進入池中。" },
        //词缀翻译
        { en: "Ailment", zhCN: "异常状态", zhTW: "異常狀態" },
        { en: "Amanamu", zhCN: "阿玛纳姆", zhTW: "阿瑪納姆" },
        { en: "Attack", zhCN: "攻击", zhTW: "攻擊" },
        { en: "Attribute", zhCN: "属性", zhTW: "屬性" },
        { en: "Bleed", zhCN: "流血", zhTW: "流血" },
        { en: "Caster", zhCN: "施法", zhTW: "施法" },
        { en: "Chaos", zhCN: "混沌", zhTW: "混沌" },
        { en: "Cold", zhCN: "冰冷", zhTW: "冰冷" },
        { en: "Critical", zhCN: "暴击", zhTW: "暴擊" },
        { en: "Damage", zhCN: "伤害", zhTW: "傷害" },
        { en: "Elemental", zhCN: "元素", zhTW: "元素" },
        { en: "Fire", zhCN: "火焰", zhTW: "火焰" },
        { en: "Gem", zhCN: "宝石", zhTW: "寶石" },
        { en: "Kurgal", zhCN: "库尔加尔", zhTW: "庫爾加爾" },
        { en: "Lightning", zhCN: "闪电", zhTW: "閃電" },
        { en: "Minion", zhCN: "召唤物", zhTW: "召喚物" },
        { en: "Physical", zhCN: "物理", zhTW: "物理" },
        { en: "Speed", zhCN: "速度", zhTW: "速度" },
        { en: "Ulaman", zhCN: "乌拉曼", zhTW: "烏拉曼" },
        { en: "Influence", zhCN: "影响", zhTW: "影響" },
        { en: "Non-Attack", zhCN: "非攻击", zhTW: "非攻擊" },
        { en: "Non-Caster", zhCN: "非施法", zhTW: "非施法" },
        { en: "Non-Chaos", zhCN: "非混沌", zhTW: "非混沌" },
        { en: "Non-Cold", zhCN: "非冰冷", zhTW: "非冰冷" },
        { en: "Non-Critical", zhCN: "非暴击", zhTW: "非暴擊" },
        { en: "Non-Fire", zhCN: "非火焰", zhTW: "非火焰" },
        { en: "Non-Life", zhCN: "非生命", zhTW: "非生命" },
        { en: "Non-Lightning", zhCN: "非闪电", zhTW: "非閃電" },
        { en: "Non-Physical", zhCN: "非物理", zhTW: "非物理" },
        { en: "Non-Speed", zhCN: "非速度", zhTW: "非速度" },
        { en: "Non-Influence", zhCN: "非影响", zhTW: "非影響" },
        { en: "Prefixes", zhCN: "前缀", zhTW: "前綴" },
        { en: "TotalsTiersWeightAffix %", zhCN: "总计/等级/权重/词缀%", zhTW: "總計/等級/權重/詞綴%" },
        { en: "Totals", zhCN: "总计", zhTW: "總計" },
        { en: "Tiers", zhCN: "等级", zhTW: "等級" },
        { en: "Weight", zhCN: "权重", zhTW: "權重" },
        { en: "Affix %", zhCN: "词缀%", zhTW: "詞綴%" },
        { en: "All modifiers", zhCN: "所有词缀", zhTW: "所有詞綴" },
        { en: "Base", zhCN: "基础", zhTW: "基礎" },
        { en: "iLvl", zhCN: "物品等级", zhTW: "物品等級" },
        { en: "prefix %", zhCN: "前缀%", zhTW: "前綴%" },
        { en: "Weight %", zhCN: "权重%", zhTW: "權重%" },
        { en: "Desecrated", zhCN: "亵渎", zhTW: "褻瀆" },
        { en: "Use calculator settings", zhCN: "使用计算器设置", zhTW: "使用計算器設定" },
        { en: "Restore saved item", zhCN: "恢复已保存物品", zhTW: "恢復已保存物品" },
        //装备词缀
        { en: "to Chaos Resistance", zhCN: "获得混沌抗性", zhTW: "獲得混沌抗性" },
        { en: "increased Movement Speed", zhCN: "增加移动速度", zhTW: "增加移動速度" },
        { en: "reduced Elemental Ailment Duration on you", zhCN: "你身上的元素异常持续时间缩短", zhTW: "你身上的元素異常持續時間縮短" },
        { en: "increased Mana Regeneration Rate", zhCN: "增加魔力回复速度", zhTW: "增加魔力回復速度" },
        { en: "faster start of Energy Shield Recharge", zhCN: "能量护盾充能更快开始", zhTW: "能量護盾充能更快開始" },
        { en: "of Damage is taken from Mana before Life", zhCN: "伤害优先从魔力吸收", zhTW: "傷害優先從魔力吸收" },
        { en: "increased Stun Threshold", zhCN: "提高击晕阈值", zhTW: "提高擊暈閾值" },
        { en: "of maximum Life per second", zhCN: "每秒最大生命", zhTW: "每秒最大生命" },
        { en: "increased Stun Threshold", zhCN: "提高击晕阈值", zhTW: "提高擊暈閾值" },
        { en: "of Armour also applies to Elemental Damage", zhCN: "护甲也作用于元素伤害", zhTW: "護甲也作用於元素傷害" },
        { en: "Chaos Wand", zhCN: "混沌法杖", zhTW: "混沌法杖" },
        { en: "Fire Wand", zhCN: "火焰法杖", zhTW: "火焰法杖" },
        { en: "Ice Wand", zhCN: "冰霜法杖", zhTW: "冰霜法杖" },
        { en: "Lightning Wand", zhCN: "闪电法杖", zhTW: "閃電法杖" },
        { en: "Physical Wand", zhCN: "物理法杖", zhTW: "物理法杖" },
        { en: "Restart", zhCN: "重置", zhTW: "重置" },
        { en: "Item level", zhCN: "物品等级", zhTW: "物品等級" },
        { en: "Requires level", zhCN: "需要等级", zhTW: "需要等級" },
        { en: "Reveal", zhCN: "揭示", zhTW: "揭示" },
        { en: "Suffixes", zhCN: "后缀", zhTW: "後綴" },
        { en: "Implicits", zhCN: "基础词缀", zhTW: "基礎詞綴" },
        { en: "Base modpool", zhCN: "基础词缀池", zhTW: "基礎詞綴池" },
        { en: "Spending", zhCN: "消耗", zhTW: "消耗" },
        { en: "Export", zhCN: "导出", zhTW: "導出" },
        { en: "Starting State (Hover)", zhCN: "初始状态（悬停）", zhTW: "初始狀態（懸停）" },
        { en: "Restart", zhCN: "重置", zhTW: "重置" },
        { en: "TypeNormalGreaterPerfect", zhCN: "类型 普通 卓越 完美", zhTW: "類型 普通 卓越 完美" },
        { en: "Type", zhCN: "类型", zhTW: "類型" },
        { en: "Normal", zhCN: "普通", zhTW: "普通" },
        { en: "Greater", zhCN: "卓越", zhTW: "卓越" },
        { en: "Perfect", zhCN: "完美", zhTW: "完美" },
        { en: "DIVINE ORB", zhCN: "神圣石", zhTW: "神聖石" },
        { en: "VALL ORB", zhCN: "瓦尔石", zhTW: "瓦爾石" },
        { en: "Artificer's Orb", zhCN: "工匠石", zhTW: "工匠石" },
        { en: "Fracturing Orb", zhCN: "裂界石", zhTW: "裂界石" },
        { en: "Lesser Essences", zhCN: "低级精华", zhTW: "低級精華" },
        // 低级精华
        { en: "Lesser Essence of the Body", zhCN: "低级体魄精华", zhTW: "低級體魄精華" },
        { en: "Lesser Essence of the Mind", zhCN: "低级心灵精华", zhTW: "低級心靈精華" },
        { en: "Lesser Essence of Enhancement", zhCN: "低级强化精华", zhTW: "低級強化精華" },
        { en: "Lesser Essence of Abrasion", zhCN: "低级磨损精华", zhTW: "低級磨損精華" },
        { en: "Lesser Essence of Flames", zhCN: "低级烈焰精华", zhTW: "低級烈焰精華" },
        { en: "Lesser Essence of Ice", zhCN: "低级冰霜精华", zhTW: "低級冰霜精華" },
        { en: "Lesser Essence of Electricity", zhCN: "低级电能精华", zhTW: "低級電能精華" },
        { en: "Lesser Essence of Ruin", zhCN: "低级毁灭精华", zhTW: "低級毀滅精華" },
        { en: "Lesser Essence of Battle", zhCN: "低级战斗精华", zhTW: "低級戰鬥精華" },
        { en: "Lesser Essence of Sorcery", zhCN: "低级法术精华", zhTW: "低級法術精華" },
        { en: "Lesser Essence of Haste", zhCN: "低级迅捷精华", zhTW: "低級迅捷精華" },
        { en: "Lesser Essence of the Infinite", zhCN: "低级无尽精华", zhTW: "低級無盡精華" },
        { en: "Lesser Essence of Seeking", zhCN: "低级追寻精华", zhTW: "低級追尋精華" },
        { en: "Lesser Essence of Insulation", zhCN: "低级绝缘精华", zhTW: "低級絕緣精華" },
        { en: "Lesser Essence of Thawing", zhCN: "低级解冻精华", zhTW: "低級解凍精華" },
        { en: "Lesser Essence of Grounding", zhCN: "低级接地精华", zhTW: "低級接地精華" },
        { en: "Lesser Essence of Alacrity", zhCN: "低级敏捷精华", zhTW: "低級敏捷精華" },
        { en: "Lesser Essence of Opulence", zhCN: "低级富饶精华", zhTW: "低級富饒精華" },
        { en: "Lesser Essence of Command", zhCN: "低级统御精华", zhTW: "低級統御精華" },
        // 精华
        { en: "Essences", zhCN: "精华", zhTW: "精華" },
        { en: "Essence of the Body", zhCN: "体魄精华", zhTW: "體魄精華" },
        { en: "Essence of the Mind", zhCN: "心灵精华", zhTW: "心靈精華" },
        { en: "Essence of Enhancement", zhCN: "强化精华", zhTW: "強化精華" },
        { en: "Essence of Abrasion", zhCN: "磨损精华", zhTW: "磨損精華" },
        { en: "Essence of Flames", zhCN: "烈焰精华", zhTW: "烈焰精華" },
        { en: "Essence of Ice", zhCN: "冰霜精华", zhTW: "冰霜精華" },
        { en: "Essence of Electricity", zhCN: "电能精华", zhTW: "電能精華" },
        { en: "Essence of Ruin", zhCN: "毁灭精华", zhTW: "毀滅精華" },
        { en: "Essence of Battle", zhCN: "战斗精华", zhTW: "戰鬥精華" },
        { en: "Essence of Sorcery", zhCN: "法术精华", zhTW: "法術精華" },
        { en: "Essence of Haste", zhCN: "迅捷精华", zhTW: "迅捷精華" },
        { en: "Essence of the Infinite", zhCN: "无尽精华", zhTW: "無盡精華" },
        { en: "Essence of Seeking", zhCN: "追寻精华", zhTW: "追尋精華" },
        { en: "Essence of Insulation", zhCN: "绝缘精华", zhTW: "絕緣精華" },
        { en: "Essence of Thawing", zhCN: "解冻精华", zhTW: "解凍精華" },
        { en: "Essence of Grounding", zhCN: "接地精华", zhTW: "接地精華" },
        { en: "Essence of Alacrity", zhCN: "敏捷精华", zhTW: "敏捷精華" },
        { en: "Essence of Opulence", zhCN: "富饶精华", zhTW: "富饒精華" },
        { en: "Essence of Command", zhCN: "统御精华", zhTW: "統御精華" },
        // 高级精华
        { en: "Greater Essences", zhCN: "高级精华", zhTW: "高級精華" },
        { en: "Greater Essence of the Body", zhCN: "高级体魄精华", zhTW: "高級體魄精華" },
        { en: "Greater Essence of the Mind", zhCN: "高级心灵精华", zhTW: "高級心靈精華" },
        { en: "Greater Essence of Enhancement", zhCN: "高级强化精华", zhTW: "高級強化精華" },
        { en: "Greater Essence of Abrasion", zhCN: "高级磨损精华", zhTW: "高級磨損精華" },
        { en: "Greater Essence of Flames", zhCN: "高级烈焰精华", zhTW: "高級烈焰精華" },
        { en: "Greater Essence of Ice", zhCN: "高级冰霜精华", zhTW: "高級冰霜精華" },
        { en: "Greater Essence of Electricity", zhCN: "高级电能精华", zhTW: "高級電能精華" },
        { en: "Greater Essence of Ruin", zhCN: "高级毁灭精华", zhTW: "高級毀滅精華" },
        { en: "Greater Essence of Battle", zhCN: "高级战斗精华", zhTW: "高級戰鬥精華" },
        { en: "Greater Essence of Sorcery", zhCN: "高级法术精华", zhTW: "高級法術精華" },
        { en: "Greater Essence of Haste", zhCN: "高级迅捷精华", zhTW: "高級迅捷精華" },
        { en: "Greater Essence of the Infinite", zhCN: "高级无尽精华", zhTW: "高級無盡精華" },
        { en: "Greater Essence of Seeking", zhCN: "高级追寻精华", zhTW: "高級追尋精華" },
        { en: "Greater Essence of Insulation", zhCN: "高级绝缘精华", zhTW: "高級絕緣精華" },
        { en: "Greater Essence of Thawing", zhCN: "高级解冻精华", zhTW: "高級解凍精華" },
        { en: "Greater Essence of Grounding", zhCN: "高级接地精华", zhTW: "高級接地精華" },
        { en: "Greater Essence of Alacrity", zhCN: "高级敏捷精华", zhTW: "高級敏捷精華" },
        { en: "Greater Essence of Opulence", zhCN: "高级富饶精华", zhTW: "高級富饒精華" },
        { en: "Greater Essence of Command", zhCN: "高级统御精华", zhTW: "高級統御精華" },
        // 完美精华
        { en: "Perfect Essences", zhCN: "完美精华", zhTW: "完美精華" },
        { en: "Perfect Essence of the Body", zhCN: "完美体魄精华", zhTW: "完美體魄精華" },
        { en: "Perfect Essence of the Mind", zhCN: "完美心灵精华", zhTW: "完美心靈精華" },
        { en: "Perfect Essence of Enhancement", zhCN: "完美强化精华", zhTW: "完美強化精華" },
        { en: "Perfect Essence of Abrasion", zhCN: "完美磨损精华", zhTW: "完美磨損精華" },
        { en: "Perfect Essence of Flames", zhCN: "完美烈焰精华", zhTW: "完美烈焰精華" },
        { en: "Perfect Essence of Ice", zhCN: "完美冰霜精华", zhTW: "完美冰霜精華" },
        { en: "Perfect Essence of Electricity", zhCN: "完美电能精华", zhTW: "完美電能精華" },
        { en: "Perfect Essence of Ruin", zhCN: "完美毁灭精华", zhTW: "完美毀滅精華" },
        { en: "Perfect Essence of Battle", zhCN: "完美战斗精华", zhTW: "完美戰鬥精華" },
        { en: "Perfect Essence of Sorcery", zhCN: "完美法术精华", zhTW: "完美法術精華" },
        { en: "Perfect Essence of Haste", zhCN: "完美迅捷精华", zhTW: "完美迅捷精華" },
        { en: "Perfect Essence of the Infinite", zhCN: "完美无尽精华", zhTW: "完美無盡精華" },
        { en: "Essence of Hysteria", zhCN: "歇斯底里精华", zhTW: "歇斯底里精華" },
        { en: "Essence of Delirium", zhCN: "谵妄精华", zhTW: "譫妄精華" },
        { en: "Essence of Horror", zhCN: "恐惧精华", zhTW: "恐懼精華" },
        { en: "Essence of Insanity", zhCN: "疯狂精华", zhTW: "瘋狂精華" },
        { en: "Perfect Essence of Seeking", zhCN: "完美追寻精华", zhTW: "完美追尋精華" },
        { en: "Perfect Essence of Insulation", zhCN: "完美绝缘精华", zhTW: "完美絕緣精華" },
        { en: "Perfect Essence of Thawing", zhCN: "完美解冻精华", zhTW: "完美解凍精華" },
        { en: "Perfect Essence of Grounding", zhCN: "完美接地精华", zhTW: "完美接地精華" },
        { en: "Perfect Essence of Alacrity", zhCN: "完美敏捷精华", zhTW: "完美敏捷精華" },
        { en: "Perfect Essence of Opulence", zhCN: "完美富饶精华", zhTW: "完美富饒精華" },
        { en: "Perfect Essence of Command", zhCN: "完美统御精华", zhTW: "完美統御精華" },
        // 深渊通货
        { en: "Desecration", zhCN: "亵渎", zhTW: "褻瀆" },
        { en: "Ancient Collarbone", zhCN: "远古锁骨", zhTW: "遠古鎖骨" },
        { en: "Ancient Jawbone", zhCN: "远古下颌骨", zhTW: "遠古下顎骨" },
        { en: "Ancient Rib", zhCN: "远古肋骨", zhTW: "遠古肋骨" },
        { en: "Gnawed Collarbone", zhCN: "啃咬锁骨", zhTW: "啃咬鎖骨" },
        { en: "Gnawed Jawbone", zhCN: "啃咬下颌骨", zhTW: "啃咬下顎骨" },
        { en: "Gnawed Rib", zhCN: "啃咬肋骨", zhTW: "啃咬肋骨" },
        { en: "Preserved Collarbone", zhCN: "保存锁骨", zhTW: "保存鎖骨" },
        { en: "Preserved Cranium", zhCN: "保存头骨", zhTW: "保存頭骨" },
        { en: "Preserved Jawbone", zhCN: "保存下颌骨", zhTW: "保存下顎骨" },
        { en: "Preserved Rib", zhCN: "保存肋骨", zhTW: "保存肋骨" },
        { en: "Preserved Spine", zhCN: "保存脊椎", zhTW: "保存脊椎" },
        //预兆
        { en: "Omens", zhCN: "预兆", zhTW: "預兆" },
        { en: "the Blackblooded", zhCN: "黑血者", zhTW: "黑血者" },
        { en: "the Blessed", zhCN: "受祝福者", zhTW: "受祝福者" },
        { en: "Dextral Alchemy", zhCN: "右手炼金", zhTW: "右手煉金" },
        { en: "Dextral Annulment", zhCN: "右手抹消", zhTW: "右手抹消" },
        { en: "Dextral Coronation", zhCN: "右手加冕", zhTW: "右手加冕" },
        { en: "Dextral Crystallisation", zhCN: "右手结晶", zhTW: "右手結晶" },
        { en: "Dextral Erasure", zhCN: "右手消除", zhTW: "右手消除" },
        { en: "Dextral Exaltation", zhCN: "右手崇高", zhTW: "右手崇高" },
        { en: "Dextral Necromancy", zhCN: "右手死灵", zhTW: "右手死靈" },
        { en: "Greater Annulment", zhCN: "高级抹消", zhTW: "高級抹消" },
        { en: "Greater Exaltation", zhCN: "高级崇高", zhTW: "高級崇高" },
        { en: "Homogenising Exaltation", zhCN: "均质崇高", zhTW: "均質崇高" },
        { en: "Homogenising Coronation", zhCN: "均质加冕", zhTW: "均質加冕" },
        { en: "the Liege", zhCN: "领主", zhTW: "領主" },
        { en: "Light", zhCN: "光明", zhTW: "光明" },
        { en: "Sinistral Alchemy", zhCN: "左手炼金", zhTW: "左手煉金" },
        { en: "Sinistral Annulment", zhCN: "左手抹消", zhTW: "左手抹消" },
        { en: "Sinistral Coronation", zhCN: "左手加冕", zhTW: "左手加冕" },
        { en: "Sinistral Crystallisation", zhCN: "左手结晶", zhTW: "左手結晶" },
        { en: "Sinistral Erasure", zhCN: "左手消除", zhTW: "左手消除" },
        { en: "Sinistral Exaltation", zhCN: "左手崇高", zhTW: "左手崇高" },
        { en: "Sinistral Necromancy", zhCN: "左手死灵", zhTW: "左手死靈" },
        { en: "the Sovereign", zhCN: "君主", zhTW: "君主" },
        { en: "Whittling", zhCN: "削弱", zhTW: "削弱" },
        //符文
        { en: "Runes", zhCN: "符文", zhTW: "符文" },
        { en: "Lesser", zhCN: "低级", zhTW: "低級" },
        { en: "Normal", zhCN: "普通", zhTW: "普通" },
        { en: "Greater", zhCN: "高级", zhTW: "高級" },
        { en: "Special", zhCN: "特殊", zhTW: "特殊" },
        //核心
        { en: "Soul Cores", zhCN: "灵魂核心", zhTW: "靈魂核心" },
        { en: "Talismans", zhCN: "护身符", zhTW: "護身符" },
        { en: "Catalysts", zhCN: "催化剂", zhTW: "催化劑" },
        { en: "Adaptive", zhCN: "适应型", zhTW: "適應型" },
        { en: "Reaver", zhCN: "掠夺者", zhTW: "掠奪者" },
        { en: "Esh's", zhCN: "艾许的", zhTW: "艾許的" },
        { en: "Flesh", zhCN: "血肉", zhTW: "血肉" },
        { en: "Sibilant", zhCN: "嘶鸣", zhTW: "嘶鳴" },
        { en: "Carapace", zhCN: "甲壳", zhTW: "甲殼" },
        { en: "Xoph's", zhCN: "索弗的", zhTW: "索弗的" },
        { en: "Skittering", zhCN: "疾行", zhTW: "疾行" },
        { en: "Neural", zhCN: "神经", zhTW: "神經" },
        { en: "Chayula's", zhCN: "夏乌拉的", zhTW: "夏烏拉的" },
        { en: "Tul's", zhCN: "图尔的", zhTW: "圖爾的" },
        { en: "Uul-Netol's", zhCN: "乌尔尼托的", zhTW: "烏爾尼托的" },
        { en: "ModeMaximumSingle", zhCN: "模式 最大 单一", zhTW: "模式 最大 單一" },
        { en: "Mode", zhCN: "模式", zhTW: "模式" },
        { en: "Maximum", zhCN: "最大", zhTW: "最大" },
        { en: "Single", zhCN: "单一", zhTW: "單一" }
    ];

    // 按页面分类的翻译数据
    const pageTranslations = {
        "/": [
            { en: "Craft of Exile", zhCN: "流放之路装备模拟器", zhTW: "流放之路裝備模擬器" },
            { en: "Calculator", zhCN: "权重计算", zhTW: "權重計算" },
            { en: "Simulator", zhCN: "步骤模拟", zhTW: "步驟模擬" },
            { en: "Emulator", zhCN: "通货模拟", zhTW: "通貨模擬" },
            { en: "About", zhCN: "关于", zhTW: "關於" },
            { en: "Home", zhCN: "首页", zhTW: "首頁" },
            { en: "Settings", zhCN: "设置", zhTW: "設定" },
            { en: "Help", zhCN: "帮助", zhTW: "幫助" },
            { en: "Contact", zhCN: "联系", zhTW: "聯絡" },
            { en: "Login", zhCN: "登录", zhTW: "登入" },
            { en: "Logout", zhCN: "退出", zhTW: "登出" },
            { en: "Register", zhCN: "注册", zhTW: "註冊" },
            { en: "Forum", zhCN: "论坛", zhTW: "論壇" },
            { en: "News", zhCN: "新闻", zhTW: "新聞" },
            { en: "Language", zhCN: "语言", zhTW: "語言" },
            { en: "Profile", zhCN: "个人资料", zhTW: "個人資料" },
            { en: "Search", zhCN: "搜索", zhTW: "搜尋" },
            { en: "Save", zhCN: "保存", zhTW: "儲存" },
            { en: "Load", zhCN: "加载", zhTW: "載入" },
            { en: "Delete", zhCN: "删除", zhTW: "刪除" },
            { en: "Edit", zhCN: "编辑", zhTW: "編輯" },
            { en: "Account", zhCN: "账号", zhTW: "帳號" },
            { en: "Username", zhCN: "用户名", zhTW: "使用者名稱" },
            { en: "Password", zhCN: "密码", zhTW: "密碼" },
            { en: "Confirm", zhCN: "确认", zhTW: "確認" },
            { en: "Cancel", zhCN: "取消", zhTW: "取消" },
            { en: "Submit", zhCN: "提交", zhTW: "送出" },
            { en: "Next", zhCN: "下一步", zhTW: "下一步" },
            { en: "Previous", zhCN: "上一步", zhTW: "上一步" },
            { en: "Back", zhCN: "返回", zhTW: "返回" },
            { en: "Continue", zhCN: "继续", zhTW: "繼續" },
            { en: "Options", zhCN: "选项", zhTW: "選項" },
            { en: "Advanced", zhCN: "高级", zhTW: "進階" },
            { en: "Basic", zhCN: "基础", zhTW: "基礎" },
            { en: "Update", zhCN: "更新", zhTW: "更新" },
            { en: "Download", zhCN: "下载", zhTW: "下載" },
            { en: "Upload", zhCN: "上传", zhTW: "上傳" },
            { en: "Message", zhCN: "消息", zhTW: "訊息" },
            { en: "Notification", zhCN: "通知", zhTW: "通知" },
            { en: "Error", zhCN: "错误", zhTW: "錯誤" },
            { en: "Success", zhCN: "成功", zhTW: "成功" },
            { en: "Warning", zhCN: "警告", zhTW: "警告" },
            { en: "Info", zhCN: "信息", zhTW: "資訊" }
            // ...可继续补充其它常见英文词条
        ],
        "/item-generator": [
            { en: "Item Generator", zhCN: "物品生成器", zhTW: "物品生成器" },
            { en: "Base Type", zhCN: "基础类型", zhTW: "基礎類型" },
            { en: "Rarity", zhCN: "稀有度", zhTW: "稀有度" }
            // ...补充该页面词条
        ],
        "/bench": [
            { en: "Bench", zhCN: "工艺台", zhTW: "工藝台" },
            { en: "Craft", zhCN: "工艺", zhTW: "工藝" }
            // ...补充该页面词条
        ]
        // ...继续补充其它页面
    };

    // 合并所有页面翻译
    function getMergedTranslation(lang) {
        let dict = {};
        Object.values(pageTranslations).forEach(arr => {
            arr.forEach(item => {
                dict[item.en] = lang === 'zh-TW' ? item.zhTW : item.zhCN;
            });
        });
        localTranslation.forEach(item => {
            dict[item.en] = lang === 'zh-TW' ? item.zhTW : item.zhCN;
        });
        return dict;
    }

    // 翻译页面内容
    function translatePage(lang) {
        let data = getMergedTranslation(lang);
        if (!data || Object.keys(data).length === 0) return;
        let walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            let text = node.nodeValue.trim();
            if (text.length > 0 && data[text]) {
                node.nodeValue = data[text];
            }
        }
    }

    // 恢复英文
    function restoreEnglish() {
        location.reload();
    }

    // 全局 observer 变量
    let observer = null;

    // 监听DOM变化，自动翻译
    function observeAndTranslate(lang) {
        translatePage(lang); // 先翻译一次
        if (observer) observer.disconnect(); // 断开旧监听
        observer = new MutationObserver(() => {
            translatePage(lang);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 创建语言切换下拉框（支持拖动）
    function createLangDropdown() {
        let container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.top = '40px';
        container.style.right = '20px';
        container.style.zIndex = 99999;
        container.style.background = '#222';
        container.style.border = '2px solid #fff';
        container.style.borderRadius = '8px';
        container.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
        container.style.padding = '10px 18px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.cursor = 'move'; // 鼠标样式

        // 拖动功能
        let isDragging = false, offsetX = 0, offsetY = 0;
        container.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - container.getBoundingClientRect().left;
            offsetY = e.clientY - container.getBoundingClientRect().top;
            document.body.style.userSelect = 'none';
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                container.style.left = (e.clientX - offsetX) + 'px';
                container.style.top = (e.clientY - offsetY) + 'px';
                container.style.right = 'auto';
            }
        });
        document.addEventListener('mouseup', function() {
            isDragging = false;
            document.body.style.userSelect = '';
        });

        let label = document.createElement('label');
        label.innerHTML = '🌐 <b>-</b>';
        label.style.color = '#fff';
        label.style.fontSize = '16px';
        label.style.fontWeight = 'bold';
        label.style.marginRight = '10px';

        let select = document.createElement('select');
        select.style.fontSize = '16px';
        select.style.padding = '4px 8px';
        select.style.borderRadius = '4px';
        select.style.border = '1px solid #fff';
        select.style.background = '#000';
        select.style.color = '#fff';
        select.style.fontWeight = 'bold';
        select.style.outline = 'none';
        select.style.cursor = 'pointer';

        select.onmouseover = function() {
            select.style.background = '#333';
        };
        select.onmouseout = function() {
            select.style.background = '#000';
        };

        let options = [
            { value: 'zh-CN', text: '简体中文' },
            { value: 'zh-TW', text: '繁體中文' },
            { value: 'en', text: 'English' }
        ];
        options.forEach(opt => {
            let option = document.createElement('option');
            option.value = opt.value;
            option.text = opt.text;
            option.style.background = '#222';
            option.style.color = '#fff';
            select.appendChild(option);
        });

        select.value = currentLang;

        select.onchange = function() {
            currentLang = select.value;
            localStorage.setItem('coe_lang', currentLang);
            if (currentLang === 'en') {
                if (observer) observer.disconnect(); // 切英文时断开监听
                location.reload(); // 英文刷新页面
            } else {
                if (observer) observer.disconnect(); // 断开旧监听
                translatePage(currentLang);          // 立即翻译
                observeAndTranslate(currentLang);    // 重新注册 observer
            }
        };

        container.appendChild(label);
        container.appendChild(select);
        document.body.appendChild(container);
    }

    // 提取所有可见div及其常见提示属性的英文
    function extractVisibleDivTexts() {
        let result = new Set();
        document.querySelectorAll('div').forEach(div => {
            // 判断div是否可见
            let style = window.getComputedStyle(div);
            if (style.display === 'none' || style.visibility === 'hidden' || div.offsetParent === null) return;
            let text = div.textContent.trim();
            // 只输出纯英文且非空
            if (text && /^[\x00-\x7F]+$/.test(text)) {
                result.add(text); // 修正：加入集合
            }
        });
        return Array.from(result);
    }

    function generateTranslationConfig(texts) {
        return texts.map(t => `{ en: "${t}", zhCN: "cn", zhTW: "tw" }`).join(',\n');
    }

    // 主流程
    // let texts = extractVisibleDivTexts();
    // let configContent = generateTranslationConfig(texts);

    // // 下载为配置文件
    // let blob = new Blob([configContent], { type: "text/plain" });
    // let a = document.createElement("a");
    // a.href = URL.createObjectURL(blob);
    // a.download = "div_translation_config.txt";
    // a.click();

    // 初始化
    window.addEventListener('load', function() {
        createLangDropdown();
        if (currentLang !== 'en') {
            observeAndTranslate(currentLang); // 页面加载后自动翻译并监听
        }
    });
})();