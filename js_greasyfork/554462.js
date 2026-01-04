// ==UserScript==
// @name         Gamekee dirty translator
// @namespace    http://https://www.gamekee.com/dna/*
// @version      2025-11-01
// @description  very dirty translator for gamekee dna builds
// @author       @keilo on discord
// @match        https://www.gamekee.com/dna/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gamekee.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/554462/Gamekee%20dirty%20translator.user.js
// @updateURL https://update.greasyfork.org/scripts/554462/Gamekee%20dirty%20translator.meta.js
// ==/UserScript==

const delay = ms => new Promise(res => setTimeout(res, ms));

function runScriptLogic() {
    const dict = {
        "选择魔之楔": "Select Demon Wedge",

        "赛琪": "Psyche",
        "琳恩": "Lynn",
        "丽蓓卡": "Rebecca",
        "菲娜": "Fina",
        "塔比瑟": "Tabethe",
        "玛尔洁": "Margie",
        "海尔法": "Hellfire",
        "耶尔与奥利弗": "Yale and Oliver",
        "松露与榛子": "Truffle and Filbert",
        "奥特赛德": "Outsider",
        "达芙涅": "Daphne",
        "西比尔": "Sibylle",
        "黎瑟": "Rhythm",
        "兰迪": "Randy",
        "妮弗尔夫人": "Lady Nifle",
        "莉兹贝尔": "Lisbell",
        "贝蕾妮卡": "Berenica",
        "幻景": "Phantasio",

        "追忆的残影": "Remanent Reminiscence",
        "蓝色脉动": "Bluecurrent Pulse",
        "汉塞尔与格雷特": "Hansel and Gretel",
        "希冀的丰稔": "Elpides Abound",
        "剥离": "Rendhusk",
        "伊卡洛斯": "Icarus",
        "塞壬的拥吻": "Siren's Kiss",
        "祈请净火": "Flamme De Epuration",
        "孤子的缚锁": "Shackle of Lonewolf",
        "弧光百劫": "Arclight Apocalypse",
        "春玦戟": "Vernal Jade Halberd",
        "销骨": "Osteobreaker",
        "惩戒的炼火": "Punitive Inferno",
        "凋零": "Withershade",
        "崩解": "Destructo",
        "枯朽": "Wanewraith",
        "失乡的獠牙": "Exiled Fangs",
        "赘生": "Excresduo",
        "不渝的梦海": "Undying Oneiros",
        "蒙恩御礼": "Sacred Favour",
        "放逐怒雷": "Exiled Thunderwyrm",
        "慧谋的攻守": "Ingenious Tactics",
        "辉珀刃": "Blade Amberglow",
        "无序奇点": "Entropic Singularity",
        "萨麦尔": "Samael",
        "爆破艺术": "Blast Artistry",
        "伊弥尔": "Ymir",

        "火属性攻击": "Pyro ATK",
        "风属性攻击": "Anemo ATK",
        "水属性攻击": "Hydro ATK",
        "光属性攻击": "Lumino ATK",
        "雷属性攻击": "Electro ATK",
        "暗属性攻击": "Umbro ATK",

        "攻击": "ATK",
        "生命": "HP",
        "护盾": "Shield",
        "防御": "DEF",
        "最大神智": "Max Sanity",
        "技能威力": "Skill DMG",
        "技能范围": "Skill Range",
        "技能耐久": "Skill Duration",
        "技能效益": "Skill Efficiency",
        "昂扬": "Morale",
        "背水": "Resolve",

        "贯穿攻击": "Spike ATK",
        "切割攻击": "Slash ATK",
        "震荡攻击": "Smash ATK",
        "暴击率": "CRIT Chance",
        "暴击伤害": "CRIT Damage",
        "攻击速度": "ATK Speed",
        "触发概率": "Trigger Probability",
        "攻击范围": "ATK Range",
        "多重射击": "Multishot",
        "弹匣容量": "Mag Capacity",
        "最大弹药": "Max Ammo",
        "弹药转化率": "Ammo Conversion Rate",
        "弹药转换率": "Ammo Conversion Rate",
        "连击持续时间": "Combo Duration",
        "射线长度": "Beam Length",
        "蓄力攻击速度": "Charged ATK Speed",

        "全盛·昂扬": "Prime · Morale",
        "全盛·背水": "Prime · Resolve",
        "全盛·安神": "Prime · Serenity",
        "全盛·追袭": "Prime · Huntdown",
        "天光·极昼": "Skylume · Midnight Sun",
        "天光·燎原": "Skylume · Wildfire",
        "雷鸣·燎原": "Thunder · Wildfire",
        "凛风·极昼": "Squall · Midnight Sun",
        "凛风·燎原": "Squall · Wildfire",
        "焚炎·极昼": "Inferno · Midnight Sun",
        "焚炎·燎原": "Inferno · Wildfire",
        "骇浪·极昼": "Seawave · Midnight Sun",
        "薰风吐息": "Whispering Zephyr",
        "紊乱气旋": "Turbulent Cyclone",
        "焚心野火": "Devouring Wildfire",
        "水雾弥漫": "Misty Veil",
        "激扬寒波": "Frosty Torrent",
        "雷云摧朽": "Ravaging Thunder",
        "流光交辉": "Gleam & Glimmer",
        "色散成霓": "Prismatic Neon",
        "虚妄献祭": "Illusionary Sacrifice",
        "炽灼·鼓舞": "Blaze · Inspo",
        "炽灼·决断": "Blaze · Volition",
        "炽灼·背水": "Blaze · Resolve",
        "炽灼·永恒": "Blaze · Eternity",
        "炽灼·涅槃": "Blaze · Nirvana",
        "炽灼·昂扬": "Blaze · Morale",
        "羽翼·永恒": "Wings · Eternity",
        "涅槃·权能": "Nirvana · Spectrum",
        "坚守·永恒": "Steadfast · Eternity",
        "炽灭": "Scorch",
        "涅槃": "Nirvana",
        "退避": "Vigilant",
        "腾跃": "prance",
        "救济": "Rescue",

        "幻光闪烁": "Whirl of Illusion",
        "统御穿刺": "Commanding Thrust",
        "专注": "Focus",
        "迅捷": "Celerity",
        "盛怒·缠缚": "Rage · Trammel",
        "缠缚": "Trammel",
        "领界": "Threshold",
        "攻势·专注": "Impetus · Focus",
        "倾力": "Utmost",
        "攻势": "Impetus",
        "叠影": "Foldover",
        "透析": "Penetration",
        "追猎": "Hunt",
        "整备": "Loadout",
        "重压": "Crusher",
        "盛怒": "Rage",
        "连环·缠缚": "Continuity · Trammel",
        "羽翼": "Wings",
        "鼓舞·散碎": "Inspo · Shards",
        "鼓舞·消逝": "Inspo · Elapse",
        "权能·预兆": "Spectrum · Omen",
        "羽翼·鼓舞": "Wings · Inspo",
        "永恒": "Eternity",
        "鼓舞": "Inspo",
        "怒火射线": "Furious Beam",
        "聚焦": "Focus",
        "锋锐": "Edge",
        "专注·厚重": "Focus · Mass",
        "狂热": "Fervor",
        "怒火爆破": "Furious Blast",
        "刀尖把戏": "Blade Feint",
        "暴虐": "Brutality",
        "迅捷蓄势": "Swift Momentum",
        "透析·缠缚": "Penetration · Trammel",
        "乱花斩月": "Crescent Flurry",

        "耐受值": "Tolerance",
        "闪避次数": "Dodge Attempts",
    }

    const spans = document.getElementsByTagName('span');
    for(let span of spans) {
        if(span.textContent in dict) {
            span.textContent = dict[span.textContent];
        }
    }
}

(async function() {
    'use strict';
    window.addEventListener('click', runScriptLogic);

    await delay(1000);
    runScriptLogic();
})();