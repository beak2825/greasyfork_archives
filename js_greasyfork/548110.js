// ==UserScript==
// @name         Manarion Chinese Translation
// @namespace    http://tampermonkey.net/
// @version      0.18.7
// @description  Manarion Chinese Translation and Quest notification, on any issue occurred, please /whisper LemonApostle in game
// @description:zh  Manarion 文本汉化，以及任务通知（非自动点击），如果汉化出现任何问题，可以游戏私信 LemonApostle，在 greasyfork 页面留下评论，或者通过其他方式联系我
// @author       VoltaX-LemonApostle
// @match        https://manarion.com/*
// @icon         https://s2.loli.net/2025/05/28/YmWGhwXJVHonOsI.png
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_info
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/548110/Manarion%20Chinese%20Translation.user.js
// @updateURL https://update.greasyfork.org/scripts/548110/Manarion%20Chinese%20Translation.meta.js
// ==/UserScript==

// for fire fox
if (window.top !== window) return;

const WatchNode = (node, callback) => {
    const OnMutate = (_, observer) => {
        observer.disconnect();
        callback(node);
        observer.observe(node, {childList: true, subtree: true, characterData: true});
    };
    OnMutate(undefined, new MutationObserver(OnMutate));
}
const Temp = {
    DeathNotificationSet: new Set(),
};
const ButtonClass = "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border border-input bg-background dark:bg-primary/30 shadow-xs hover:bg-accent dark:hover:bg-primary/50 hover:text-accent-foreground cursor-pointer h-9 px-4 py-2 has-[>svg]:px-3";
const SwitchClass = "peer data-[state=checked]:bg-primary data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 dark:data-[state=unchecked]:bg-input/40 inline-flex h-[1.15rem] w-8 shrink-0 items-center rounded-full border border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50";
const SwitchBallClass = "bg-background dark:data-[state=unchecked]:bg-foreground dark:data-[state=checked]:bg-primary-foreground pointer-events-none block size-4 rounded-full ring-0 transition-transform data-[state=checked]:translate-x-[calc(100%-2px)] data-[state=unchecked]:translate-x-0";
const InputClass = "border-input file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground flex h-9 min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive w-30";
const UpdateButtonID = "manarion-chinese-translation-update-button";
const UpdateDotID = "manarion-chinese-translation-update-dot";
let elnaethWaken = false;
//const ElementalRiftEpoch = Date.UTC(2025, 5, 3, 12, 0, 0, 0);
const ADD_FAQ = false;
let observer;
const GetItem = (key) => {try {
    return JSON.parse(window.localStorage.getItem(key) ?? "{}");
} catch(e){
    console.error(e);
    return {};
}};
const SetItem = (key, value) => window.localStorage.setItem(key, JSON.stringify(value));
//#region EquipAnal
const _AvailEquip = new Map(); // name -> equipDetail
const _EquipParts = new Map(); // part -> equips
const AddToAnalysis = (div) => {
    console.log(div);
    const detail = {};
    const name = div.querySelector(":scope>div.text-sm>div[class='mb-1 text-lg font-bold']").textContent;
    [...div.querySelectorAll(":scope>div.text-sm>div[class='text-foreground flex justify-between']")].forEach(div => {
        const key = div.children[0].textContent;
        const value = div.children[1].childNodes[1].textContent.replace("%", "");
        detail[key] = value;
    });
    const part = div.querySelector(":scope>div.text-sm>div[class='text-foreground mb-2 flex justify-between gap-2']>span:nth-child(2)").childNodes[2].textContent;
    const level = div.querySelector(":scope>div.text-sm>div[class='text-foreground mb-2 flex justify-between gap-2']>span:nth-child(1)").childNodes[2].textContent;
    detail.level = Number(level);
    _AvailEquip.set(name, detail);
    if(!_EquipParts.has(part)) _EquipParts.set(part, [name]);
    else _EquipParts.get(part).push(name);
};
const Boosts = [
    [1,"Spellpower","法术强度"],
    [2,"Ward","抗性"],
    [3,"Intellect","智力"],
    [4,"Stamina","耐力"],
    [5,"Focus","集中"],
    [6,"Spirit","精神"],
    [7,"Mana","魔力"],
    [10,"Fire Mastery","火系精通"],
    [11,"Water Mastery","水系精通"],
    [12,"Nature Mastery","自然精通"],
    [40,"Damage","伤害"],
    [41,"Multicast","多重施法"],
    [42,"Critical hit chance","暴击几率"],
    [43,"Critical hit damage","暴击伤害"],
    [44,"Haste","技能急速"],
    [45,"Health Boost","生命值增幅"],
    [46,"Ward Boost","抗性增幅"],
    [47,"Focus","集中"],
    [48,"Mana Boost","魔力增幅"],
    [49,"Overload","过载"],
    [50,"Time dilation","时间膨胀"],
];
const BoostID2CN = new Map(Boosts.map(([id, EN, CN]) => [id, CN]));
unsafeWindow.ExpertEquipAnalState = () => {
    console.log("_AvailEquip");
    console.log(_AvailEquip);
    console.log("_EquipParts");
    console.log(_EquipParts);
};
//#region Settings
const localStorageKey = "manarion-chinese-translation-settings"
const _Settings = {
    doTranslate: true,
    debug: false,
    manaDustName: "魔法尘",
    worldshaperName: "再塑世界之敌",
    worldburnerName: "焚毁世界之敌",
    worlddrownerName: "沉没世界之敌",
    notifyQuestComplete: true,
    notifyElementalRiftBegin: true,
    notifyPowerRiftBegin: true,
    notifyDeaths: false,
    fontFamilyEn: "Times New Roman",
    fontFamily: "Microsoft YaHei",
    enableTestFeature: false,
    //notifyWithInterval: -1,
    ...GetItem(localStorageKey),
};
const FontEnOptions = [
    ["Arial","Arial"],
    ["Verdana","Verdana"],
    ["Tahoma","Tahoma"],
    ["Trebuchet MS","Trebuchet MS"],
    ["Times New Roman","Times New Roman"],
    ["Georgia","Georgia"],
    ["Garamond","Garamond"],
    ["Courier New","Courier New"],
];
const FontEnOptionsLookup = new Map(FontEnOptions);
const FontOptions = [
    ["SimSun", "宋体"],
    ["SimHei", "黑体"],
    ["Microsoft YaHei", "微软雅黑"],
    ["Microsoft JhengHei", "微软正黑体"],
    ["NSimSun", "新宋体"],
    ["DFKai-SB", "标楷体"],
    ["FangSong", "仿宋"],
    ["KaiTi", "楷体"],
    ["FangSong_GB2312", "仿宋_GB2312"],
    ["KaiTi_GB2312", "楷体_GB2312"],
    ...navigator.userAgent.includes("Macintosh")?[
        ["STHeiti Light", "华文细黑"],
        ["STHeiti", "华文黑体"],
        ["STKaiti", "华文楷体"],
        ["STSong", "华文宋体"],
        ["STFangsong", "华文仿宋"],
        ["LiHei Pro Medium", "儷黑 Pro"],
        ["LiSong Pro Light", "儷宋 Pro"],
        ["BiauKai", "標楷體"],
        ["Apple LiGothic Medium", "蘋果儷中黑"],
        ["Apple LiSung Light", "蘋果儷細宋"],
    ]:[],
];
const FontOptionsLookup = new Map(FontOptions);
const Settings = new Proxy(_Settings, {
    set(target, p, newValue, receiver){
        target[p] = newValue;
        SetItem(localStorageKey, _Settings);
        if(p === "fontFamily"){
            document.body.fontFamily = newValue;
        }
        return true;
    }
});
const SettingPanelID = "manarion-chinese-translation-settings-background";
// #region style
const css =
`
.detect-box{
    opacity: 0;
    pointer-events: none;
}
.font-selector:hover{
    background-color: color-mix(in oklab,var(--input)50%,transparent)
}
.font-selector{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    min-width: 100px;
    border-color: var(--primary);
    border-width: 1px;
    border-radius: 3px;
    padding: 5.5px;
    padding-left: 10px;
    background-color: color-mix(in oklab,var(--input)30%,transparent)
    transition: background-color 0.2s;
    &>svg{
        position: relative;
        top: 5px;
    }
}
.font-family-name{
    pointer-events: none;
    margin-right: 10px;
    flex-grow: 1;
}
.font-family-options-background{
    z-index: 1;
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0);
}
.font-family-options-wrapper{
    position: absolute;
    right: var(--font-family-options-wrapper-right);
    top: var(--font-family-options-wrapper-top);
    min-width: var(--font-family-options-wrapper-min-width);
    width: max-content;
    height: fit-content;
    max-height: var(--font-family-options-wrapper-height);
    display: flex;
    flex-direction: column;
    overflow-y: scroll;
    border-radius: 3px;
    border-color: var(--primary);
    border-width: 1px;
    background-color: black;
}
.font-family-option{
    padding: 2px 5px;
    display: flex;
    flex-wrap: nowrap;
    width: 100%;
    &>span{
        margin-right: 10px;
    }
    &>svg{
        opacity: 0;
        position: relative;
        top: 5px;
    }
    &[data-selected="true"]>svg{
        opacity: 1;
    }
}
.font-family-option:hover{
    background-color: color-mix(in oklab,var(--input)30%,transparent)
}
.min-w-\\[400px\\]{
    min-width: 400px;
}
#${UpdateDotID}{
    position: absolute;
    top: -4px;
    left: -4px;
}
#${SettingPanelID}{
    position: absolute;
    display: flex;
    width: 100%;
    height: 100%;
    top: 0px;
    left: 0px;
    background-color: rgba(0, 0, 0, 0.5);
    &>div{
        max-height: 100%;
        overflow-y: scroll;
        border-width: 3px;
        border-radius: 5px;
        margin: auto;
        background-color: black;
    }
}
:root{
    font-variant: none;
    font-weight: 500;
    --font-family-options-wrapper-right: 0px;
    --font-family-options-wrapper-top: 0px;
    --font-family-options-wrapper-height: 0px;
    --font-family-options-wrapper-min-width: 0px;
    --curr-font-family-en: ${Settings.fontFamilyEn};
    --curr-font-family-zh: ${Settings.fontFamily};
}
body{
    font-family: var(--temp-font-family-en, var(--curr-font-family-en, ${Settings.fontFamilyEn})), var(--temp-font-family-zh, var(--curr-font-family-zh, ${Settings.fontFamily}));
}
ol[data-sonner-toast]>li{
    font-family: var(--temp-font-family-en, var(--curr-font-family-en, ${Settings.fontFamilyEn})), var(--temp-font-family-zh, var(--curr-font-family-zh, ${Settings.fontFamily}));
}
main div.space-y-4:nth-child(1) div[data-slot="card"]:nth-child(2) div.space-y-1 div.min-h-8{
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    &>.item-qol-container {
        grid-column: 2 / 3;
        grid-row: 2 / 3;
    }
    &>span[data-slot="popover-trigger"], &>span[data-slot="tooltip-trigger"] {
        width: max-content;
        grid-row: 1 / 2;
        grid-column: 2 / 3;
    }
}
main div.hover\\:bg-primary\\/20.text-md.flex.min-h-8.gap-2>div:not(.w-15):not(.shrink-0):not(.item-qol-container):not([data-slot]){
    display: grid;
    grid-template-columns: 1fr;
    &>span[data-slot="popover-trigger"], &>span[data-slot="tooltip-trigger"] {
        width: max-content;
        grid-row: 1 / 2;
        grid-column: 1 / 2;
    }
}
main>div:nth-child(1)>div.space-y-4>div.text-sm>div.hover\\:bg-primary\\/20.mb-0\\.5.flex.items-center>div:nth-child(1){
    display: grid;
    grid-template-columns: 1fr;
    &>span[data-slot="popover-trigger"], &>span[data-slot="tooltip-trigger"] {
        width: max-content;
        grid-row: 1 / 2;
        grid-column: 1 / 2;
    }
}
`;
const InsertStyleSheet = (style) => {
    console.log("InsertStyleSheet");
    GM_addStyle(style);
};
InsertStyleSheet(css);
const html = (html) => {
    const t = document.createElement("template");
    t.innerHTML = html;
    return t.content.firstElementChild;
};
//#region HTML
const HTML = (tagname, attrs, ...children) => {
    if(attrs === undefined) return document.createTextNode(tagname);
    const ele = document.createElement(tagname);
    if(attrs) for(const [key, value] of Object.entries(attrs)){
        if(value === null || value === undefined) continue;
        if(key.charAt(0) === "_"){
            const type = key.slice(1);
            ele.addEventListener(type, value);
        }
        else if(key === "eventListener"){
            for(const listener of value){
                ele.addEventListener(listener.type, listener.listener, listener.options);
            }
        }
        else ele.setAttribute(key, value);
    }
    for(const child of children) if(child) ele.append(child);
    return ele;
};
//#region SVG
const tickSVG = html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-check size-4"><path d="M20 6 9 17l-5-5"></path></svg>`);
const dropdownArrowSVG = html(`<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down size-4 opacity-50" aria-hidden="true"><path d="m6 9 6 6 6-6"></path></svg>`);
const translateSettingsSVG = html(`<svg width="24" height="24" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="#8f96a9" class="bi bi-translate">
  <path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286H4.545zm1.634-.736L5.5 3.956h-.049l-.679 2.022H6.18z"/>
  <path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2zm7.138 9.995c.193.301.402.583.63.846-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6.066 6.066 0 0 1-.415-.492 1.988 1.988 0 0 1-.94.31z"/>
</svg>`);
const dotSVG = html(`<svg hidden="" height="10" width="10" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 31.955 31.955" xml:space="preserve" fill="#8f96a9" id="${UpdateDotID}">
<g>
	<path d="M27.25,4.655C20.996-1.571,10.88-1.546,4.656,4.706C-1.571,10.96-1.548,21.076,4.705,27.3   c6.256,6.226,16.374,6.203,22.597-0.051C33.526,20.995,33.505,10.878,27.25,4.655z"/>
	<path d="M13.288,23.896l-1.768,5.207c2.567,0.829,5.331,0.886,7.926,0.17l-0.665-5.416   C17.01,24.487,15.067,24.5,13.288,23.896z M8.12,13.122l-5.645-0.859c-0.741,2.666-0.666,5.514,0.225,8.143l5.491-1.375   C7.452,17.138,7.426,15.029,8.12,13.122z M28.763,11.333l-4.965,1.675c0.798,2.106,0.716,4.468-0.247,6.522l5.351,0.672   C29.827,17.319,29.78,14.193,28.763,11.333z M11.394,2.883l1.018,5.528c2.027-0.954,4.356-1.05,6.442-0.288l1.583-5.137   C17.523,1.94,14.328,1.906,11.394,2.883z"/>
	<circle cx="15.979" cy="15.977" r="6.117"/>
</g>
</svg>`);
// #region Settings
const popupSelector = 'div[data-slot="tooltip-content"]:not([translated]), div[data-slot="popover-content"]:not([translated]), div[data-radix-popper-content-wrapper]:not([translated])';
const Translation = new Map([
    ["Jewel", "宝石"],
    ["Match", "匹配"],
    ["Action", "行动"],
    ["Favorite", "保护"],

    ["Clear", "清除"],
    ["Actions:", "行动次数"],
    ["Dungeon Skip ", "跳过地牢"],
    ["Guild Only","仅限公会"],
    ["Increases build speed of Mage Tower upgrades", "增加巫师塔建造速度"],
    ["Construction", "建造"],
    // #region stat panel
    ...[
        ["Battle Level", "战斗等级"],
        ["Experience", "经验值"],
        ["Intellect", "智力"],
        ["Stamina", "耐力"],
        ["Spirit", "精神"],
        ["Focus", "集中"],
        ["Mana", "魔力"],
        ["Nature Mastery", "自然精通"],
        ["Fire Mastery", "火系精通"],
        ["Water Mastery", "水系精通"],
        ["Total Spellpower", "总法强"],
        ["Total Ward", "总抗性"],
    ].flatMap(([key, value]) => [
        [key, value],
        [`${key}:`, `${value}:`],
        [` +1 ${key} `, ` +1 ${value} `],
    ]),
    ["Quest Progress:", "任务进度:"],
    ["Increases your spell damage", "增强你的法术伤害"],
    ["Increases your health", "增加你的生命值"],
    ["Increases your mana pool", "增加你的魔力值"],
    ["Decreases enemy ward strength", "降低敌人的防御强度"],
    ["Increases your mana regeneration", "增加你的魔法回复"],
    // #region item names
    ...[
        ["Crystallized Mana", "魔力结晶"],
        ["Mana Dust", `${Settings.manaDustName}`],
        ["Elemental Shards", "元素碎片"],
        ["Codex", "法典"],
        ["Bound Codex", "绑定法典"],
        ["Dungeon Points", "地牢点数"],
        ["Fish", "鱼"],
        ["Wood", "木"],
        ["Iron", "铁"],
        ["Egg", "宠物蛋"],
        ["Tome of Fire", "火之书"],
        ["Tome of Water", "水之书"],
        ["Tome of Nature", "自然之书"],
        ["Tome of Mana Shield", "魔法盾之书"],
        ["Orb of Power", "强化球"],
        ["Orb of Chaos", "混沌球"],
        ["Orb of Divinity", "神圣球"],
        ["Orb of Legacy", "古物球"],
        ["Orb of Perfection", "完美球"],
        ["Elementium", "元素源质"],
        ["Divine Essence", "神圣精华"],
        ["Sunpetal", "太阳花瓣"],
        ["Sageroot", "智慧之根"],
        ["Bloomwell", "繁茂精华"],
        ["Fire Essence", "火之精华"],
        ["Water Essence", "水之精华"],
        ["Nature Essence", "自然精华"],
        ["Asbestos", "火绒"],
        ["Ironbark", "铁桉"],
        ["Fish Scales", "鱼鳞"],
        ["Elderwood", "古树枝干"],
        ["Lodestone", "磁石"],
        ["White Pearl", "白色珍珠"],
        ["Four-leaf Clover", "四叶草"],
        ["Enchanted Droplet", "神秘结露"],
        ["Infernal Heart", "熔岩之心"],
        ["Event Points", "事件点数"],
        ["Event Points ", "事件点数 "],
    ].flatMap(([key, value]) => [
        [key, value],
        [` ${key}`, ` ${value}`],
        [`[${key}]`, `[${value}]`],
        [`${key}:`, `${value}:`],
    ]),
    ...[
        ["Fire Resistance", "火系抗性"],
        ["Water Resistance", "水系抗性"],
        ["Nature Resistance", "自然抗性"],
        ["nature res", "自然抗性"],
        ["fire res", "火系抗性"],
        ["water res", "水系抗性"],
        ["Nature res", "自然抗性"],
        ["Fire res", "火系抗性"],
        ["Water res", "水系抗性"],
        ["Inferno", "地狱烈焰"],
        ["Tidal Wrath", "狂潮"],
        ["Wildheart", "野性之心"],
        ["Insight", "洞察"],
        ["Bountiful Harvest", "丰饶"],
        ["Prosperity", "富饶"],
        ["Fortune", "幸运"],
        ["Growth", "成长"],
        ["Vitality", "活力"],
    ].flatMap(([key, value]) => [
        [key, value],
        [key.toLowerCase(), value],
        [`${key} `, `${value} `],
        [`Formula: ${key}`, `术式：${value}`],
        [`Formula: ${key}:`, `术式：${value}:`],
        [`[Formula: ${key}]`, `[术式：${value}]`],
    ]),
    // #region tab
    ["Base Power", "基础能力值"],
    ["Combat Skills", "战斗加成"],
    ["Enchants", "附魔技能"],
    ["Gathering", "采集升级"],
    ["Farm", "农场"],
    ["Potions", "药水"],
 
    ["Global", "广播"],
    ["Whispers", "私信"],
    ["Whispers ", "私信 "],
    ["All", "所有"],
    ["General", "通用"],
    ["Trade", "交易"],
    ["Guild", "公会"],
    ["Help", "帮助"],
    // #region market
    ["Quantity", "数量"],
    ["Unit Price", "单价"],
    ["Sell", "出售"],
    ["Buy", "购买"],
    ["Level", "等级"],
    ["Rarity", "稀有度"],
    ["Skill", "对应技能"],
    ["Slot", "部位"],
    ["Secondary Boost", "次要加成"],
    ["Tertiary Boost", "第三加成"],
    ["Infused", "已升级"],
    ["Min Quality", "最小品质"],
    ["Max Price", "最高售价"],
    ["Resonance", "共鸣"],   
    ["Luster", "光泽"],      
    ["Clarity", "净度"],
    ["Buy Orders", "购买挂单"],
    ["Sell Orders", "出售挂单"],
    [" each", " 单价"],
    ["View your orders", "查看我的挂单"],
    ["Marketplace", "市场"],
    ["All prices are in Mana Dust", `所有价格的单位都是${Settings.manaDustName}`],
    ["Back to market", "回到市场"],
    ["Item", "物品"],
    // #region guild
    ["Create", "创建"],
    ["Guild Name", "公会名"],
    ["Level", "等级"],
    ["Upgrades", "公会加成"],
    ["Roster", "成员列表"],
    ["Armory", "装备库"],
    ["Ranks", "公会职位"],
    ["Log", "日志"],
    ["Name", "名称"],
    ["Active", "状态"],
    ["Rank", "职位"],
    ["Borrow", "借出"],
    // #region button
    ["Checkout with Stripe", "使用 Stripe 支付"],
    ["Transfer", "赠送"],
    ["Seller", "出售者"],
    ["Quality", "品质"],
    ["Boost", "加成"],
    ["Price", "售价"],
    ["Reset", "重置"],
    ["Search", "搜索"],
    ["Equipment", "装备"],
    ["Equip", "装备"],
    ["View other items", "查看其他物品"],
    ["Unequip", "卸下"],
    ["Refresh Actions", "刷新行动计数"],
    ["Stop", "中止"],
    ["Max", "最大"],
    ["Confirm", "确定"],
    ["OK", "确定"],
    ["Cancel", "取消"],
    ["Edit", "修改"],
    ["Donate", "捐赠"],
    ["Return", "返还"],
    ["Upgrade", "升级"],
    ["Load More", "查看更多"],
    ["Select Enemy", "选择敌人"],
    ["← Prev", "← 上一页"],
    ["Next →", "下一页 →"],
    ["Brew", "制作"],
    ["Collect", "采摘"],
    ["Save", "保存"],
    ["Close", "关闭"],
    ["Mine", "挖矿"],
    ["Woodcut", "伐木"],
    ["View Players", "查看所有玩家"],
    ["Refresh", "刷新"],
    ["Activate", "激活"],
    ["Choose Sigil", "选择魔符"],
    ["View Event", "查看事件"],
    ["View Players", "查看玩家"],
    ["Extend", "续费"],
    ["Invite", "邀请"],
    // #region research
    ["Staff (Damage)", "法杖（元素伤害）"],
    ["Cloak (Resistance)", "斗篷（元素抗性）"],
    ["Head (Base XP)", "头部（基础经验值）"],
    ["Neck (Base Resources)", "项链（基础资源量）"],
    ["Chest (Base Mana Dust)", `衣服（基础${Settings.manaDustName}）`],
    ["Hands (Drop Boost)", "手部（掉落加成）"],
    ["Feet (Multistat)", "脚部（多重属性掉落）"],
    ["Ring (All stat boost)", "戒指（全属性增幅）"],
    ["Spell Tomes", "法术之书"],
    ["Spellpower", "法术强度"],
    ["Elemental Shards ", "元素碎片"],
    ["Ward", "抗性"],
    ["Fire Spell Rank", "火魔法等级"],
    ["Water Spell Rank", "水魔法等级"],
    ["Nature Spell Rank", "自然魔法等级"],
    ["Mana Shield Rank", "魔法盾等级"],
    ...[
        ["Damage", "伤害"],
        ["Multicast", "多重施法"],
        ["Crit Chance", "暴击几率"],
        ["Critical hit chance", "暴击几率"],
        ["Crit Damage", "暴击伤害"],
        ["Critical hit damage", "暴击伤害"],
        ["Haste", "技能急速"],
        ["Health", "生命值"],
        ["Focus", "集中"],
        ["Mana", "魔力"],
        ["Overload", "过载"],
        ["Time Dilation", "时间膨胀"],
        ["Time dilation", "时间膨胀"],
        ["Mining", "采矿"],
        ["Fishing", "捕鱼"],
        ["Woodcutting", "伐木"],
        ["Base Experience", "基础经验值"],
        ["Base Resource", "基础资源量"],
        ["Base Mana Dust", `基础${Settings.manaDustName}`],
        ["Drop Boost", "掉落加成"],
        ["Multistat", "多重属性掉落"],
        ["Actions", "行动次数"],
        ["Quest Boost", "任务速度"],
        ["Potion Boost", "药水效果"],
    ].flatMap(([key, value]) => [
        [key, value],
        [key.toLowerCase(), value],
    ]),
    // #region equip detail
    ["Link", "链接至聊天"],
    ["Quality", "品质"],
    ["Currently Equipped", "已被装备"],
    ["Battle Level", "战斗等级"],
    ["Gather Level", "采集等级"],
    // #region equip
    ["Common", "普通"], ["Uncommon", "稀有"], ["Rare", "罕见"], ["Epic", "史诗"], ["Legendary", "传说"], ["Heirloom", "传承"], ["Mythic", "神话"],
    ["Ward Boost", "抗性增幅"],
    ["Battle Experience", "战斗经验"],
    ["Chest", "身体"],
    ["Health Boost", "生命值增幅"],
    ["Any", "任意"],
    ["Weapon", "武器"],
    ["Head", "头部"],
    ["Neck", "项链"],
    ["Back", "背部"],
    ["Hands", "手部"],
    ["Feet", "脚部"],
    ["Ring", "戒指"],
    ["Sigil", "魔符"],
    ["Stat Drop", "属性点掉落率"],
    ["Potion Duration", "药水持续时长"],
    ["Base Resource Amount", "基础资源量"],
    ["Focus Boost", "集中增幅"],
    ["Mana Boost", "魔力增幅"],
    // #region label
    ["Stat Drop Tracker", "属性值掉落记录"],
    ["Item Drop Tracker", "掉落物记录"],
    ["Step Size", "步幅"],
    ["Strength", "强度等级"],
    ["Upgrade:", "升级:"],
    ["Type", "种类"],
    ["Bulk Action", "批量操作"],
    ["Mass Disenchant", "批量分解"],
    ["Amount", "数量"],
    ["Tier", "等级"],
    // #region battle text
    ["Are you sure you want to reset your codex boosts?", "确定要重置所有法典升级吗？"],
    ["You have invested ", "你已经投入了 "],
    [" will be deducted as a reset cost.", " 将作为重置费用被扣除。"],
    ["You won, you gained ", "战斗胜利，你获得了 "],
    ["You lost.", "战斗失败。"],
    ["experience.", "点经验。"],
    ["You attacked ", "你攻击了 "],
    [" times. Casting", " 次。释放了 "],
    [" spells, critting", " 次法术，造成暴击伤害 "],
    ["spells, critting ", " 次法术，造成暴击伤害 "],
    [" times. Dealing", " 次。造成了"],
    [" damage.", " 伤害。"],
    [" times.", " 次。"],
    ["Mana: ", "魔力："],
    ["Enemy attacked you ", "敌人对你攻击了 "],
    ["You found the following loot:", "你获得的战利品有："],
    ["Mana Regen Rate: ", "魔力回复率："],
    ["Mana Usage Rate: ", "魔力消耗率："],
    ["Overflow Bonus Damage:", "溢流伤害增幅: "],
    // #region research text
    ["Increases base spellpower.", "增加基础法术强度。"],
    ["Increases base ward strength.", "增加基础抗性。"],
    ["Provides a base damage multiplier to fire spells.", "为火系法术提供基础伤害增幅。"],
    ["Provides a base damage multiplier to water spells.", "为水系法术提供基础伤害增幅。"],
    ["Provides a base damage multiplier to nature spells.", "为自然系法术提供基础伤害增幅。"],
    ["Mana shield converts a percentage of mana into health at the start of combat.", "魔法盾会在战斗开始时将一部分魔力转化为生命值。"],
    ["Increases all damage done.", "增加最终伤害。"],
    ["Increases the chance of casting multiple spells during a single attack.", "增加单次攻击释放多次法术的概率。"],
    ["Increases the chance of dealing critical damage. Base value of 5%.", "增加造成暴击伤害的概率，基础值 5%。超过 100% 的暴击率可以造成多次暴击。"],
    ["Increases the damage of critical hits. Base value of 50%", "增加暴击伤害，基础值 50%。"],
    ["Causes you to cast spells more often during combat.", "使你在战斗中更频繁地释放法术。"],
    ["Increases your health pool.", "增加你的最大生命值。"],
    ["Provides a multiplier to your ward strength.", "提供抗性增幅。"],
    ["Provides a multiplier to your focus stat. This decreases enemy ward strength.", "提供集中增幅。集中可以在战斗中削弱敌人的实际抗性。"],
    ["Provides a multiplier to your mana pool and mana regeneration. If you run out of mana, you deal half damage.", "提供魔力值和魔力回复增幅。魔力耗尽后，你只能造成50%的伤害。"],
    ["Consume more mana to deal more damage.", "消耗额外魔力以造成更多伤害。"],
    ["Slows down enemy attacks.", "降低敌人的攻击速度。"],
    ["Lets you enchant staves with a higher level of Inferno.", "使你可以为法杖附魔更高等级的地狱烈焰。"],
    ["Lets you enchant staves with a higher level of Tidal Wrath.", "使你可以为法杖附魔更高等级的狂潮。"],
    ["Lets you enchant staves with a higher level of Wildheart.", "使你可以为法杖附魔更高等级的野性之心。"],
    ["Lets you enchant cloaks with stronger fire resistance.", "使你可以为斗篷附魔更高等级的火系抗性。"],
    ["Lets you enchant cloaks with stronger water resistance.", "使你可以为斗篷附魔更高等级的水系抗性。"],
    ["Lets you enchant cloaks with stronger nature resistance.", "使你可以为斗篷附魔更高等级的自然抗性。"],
    ["Lets you enchant hoods with base experience.", "使你可以为兜帽附魔更高等级的基础经验值。"],
    ["Lets you enchant amulets with base resource gain.", "使你可以为项链附魔更高等级的基础资源量。"],
    ["Lets you enchant robes with base mana dust", `使你可以为法袍附魔更高等级的基础${Settings.manaDustName}。`],
    ["Lets you enchant gloves with drop boost", "使你可以为手套附魔更高等级的掉落加成。"],
    ["Lets you enchant boots with multistat", "使你可以为鞋子附魔更高等级的多重属性掉落。"],
    ["Lets you enchant rings with vitality, increasing all stats", "使你可以为戒指附魔更高等级的活性，提升全属性。"],
    ["Increases resources harvested while mining.", "增加挖矿获取的资源。"],
    ["Increases resources harvested while fishing.", "增加捕鱼获取的资源"],
    ["Increases resources harvested while woodcutting.", "增加伐木获取的资源。"],
    ["Provides a multiplier to base experience.", "增幅基础经验值。"],
    ["Increases the base amount of resources you get while gathering.", "增加采集获取的基础资源量。"],
    ["Provides a multiplier to enemy base Mana Dust drop.", `增幅敌人掉落的基础${Settings.manaDustName}数量。`],
    ["Increases your chance to get additional stat rolls and mastery.", "提升掉落额外属性点和元素精通点的概率。"],
    ["Increases the maximum amount of actions you can do.", "增加最大行动次数。"],
    ["Increases your chance to find nearly any item drop.", "提升获得绝大多数掉落物的概率。"],
    ["Turns a Legendary item into an Heirloom. Halving the power but removing the level requirement.", "将一件传说装备变为传承装备。装备属性值减半，但会移除等级限制。"],
    // #region guild text
    ["Manage Ranks (Admin)", "调整职位（管理员）"],
    ["Invite Members", "邀请成员"],
    ["Kick Members", "踢出成员"],
    ["Promote Members", "晋升成员"],
    ["Edit Description", "编辑介绍"],
    ["Donate Items", "捐赠物品"],
    ["Borrow Items", "借出物品"],
    ["Retrieve Items", "提取物品"],
    ["Revoke Items", "强制归还"],
    ["Withdraw Funds", "提出仓库"],
    ["Upgrades", "升级"],
    ["Edit Taxes", "修改税率"],
    ["Taxes: XP ", "税率：经验值 "],
    ["%, Mana Dust", `%，${Settings.manaDustName}`],
    ["%, Elemental Shards", "%，元素碎片"],
    ["%, Resources", "%，资源"],
    ["Guild Level", "公会等级"],
    ["+0.5% resources per level", "每级使成员资源获取 +0.5%"],
    ["Ethereal Refinery", "以太精炼"],
    ["Reduces the cost of other buildings by 1% per level", "每级使其他升级的消耗 x99%"],
    ["Council Chamber", "会议厅"],
    ["Increases the maximum amount of guild members by 1 per level", "每级 +1 最大成员数"],
    ["Level ", "等级 "],
    ["Cloakroom", "衣帽间"],
    ["Increases the capacity of the armory by 50 items per level", "每级 +50 装备库容量"],
    ["Nexus Crystal", "连结水晶"],
    ["Amplifies the power of all Elemental Shards Research boosts by 1% per level", "每级使成员所有元素碎片升级效果 +1%"],
    ["Magical Accounting", "魔法账簿"],
    ["Increases the amount of resources contributed through guild taxes by 1% per level", "每级使通过税收获取的资源额外 +1%"],
    ["Mana Conduit", "魔力回路"],
    ["Reduces the mana cost of all spells by 4% per level", "每级使成员所有法术魔力消耗 x96%"],
    ["Study Room", "学习室"],
    ["the Study Room", "学习室"],
    ["Increases base experience gains by 1% per level", "每级使成员基础经验值 +1%"],
    ["Sleeping Quarters", "睡眠区"],
    ["Increases maximum actions by 1% per level", "每级使成员最大行动次数 +1%"],
    // #region update text
    ["New guild upgrade: Ethereal Refinery", "新的公会升级项目：以太精炼"],
    ["- Reduces the cost of other buildings by 1% per level", "- 每级使其他公会升级消耗 x99%"],
    ["- Uses Mana Dust only", `- 只消耗${Settings.manaDustName}升级`],
    ["Added various leaderboards", "新增各种排行榜"],
    ["Changed base resource amount boost display on profile", "更改了资料页基础资源量加成的显示"],
    ["Base Resource Amount bonus from level has been reduced to a flat 0.03 per level", "随等级变化的基础资源量加成现在变为固定每级 0.03"],
    ["You can now invest into extra Base Resource Amount with Mana Dust", `现在你可以使用${Settings.manaDustName}研究升级基础资源量加成`],
    ["Added diminishing returns when using multiple pieces of equipment with +Mana Dust %", `对同时装备多个具有${Settings.manaDustName}加成属性装备的情况，新增了递减收益`],
    ["- 1 piece no penalty", "- 1 件装备时，无影响"],
    ["- 2 pieces -5%", "- 2 件装备时，-5%"],
    ["- 3 pieces -10%", "- 3 件装备时，-10%"],
    ["- 4 pieces -15%", "- 4 件装备时，-15%"],
    ["- 5 pieces -20%", "- 5 件装备时，-20%"],
    ["- 6 pieces -25%", "- 6 件装备时，-25%"],
    ["- 7 pieces -30%", "- 7 件装备时，-30%"],
    ["- 8 pieces -35%", "- 8 件装备时，-35%"],
    ["and ", "和 "],
    ["New drop ", "新增掉落物 "],
    [" (rarer than Orb of Divinity)", "（稀有度比神圣球更高）"],
    ["- Turns a Legendary item into an Heirloom. Halving the power (level) but removing the level requirement.", "- 将一件传说装备变为传承装备。装备属性值（等级）减半，但是不再有等级限制。"],
    ["- Used to create catch-up gear that can be used by new players or players looking to switch", "- 用来生成追赶装备，供新玩家或者转职玩家使用"],
    ["- Would also like to remind everyone that there are diminishing returns on the base shard drop amount boost from total level", "- 同样希望提醒各位玩家，总等级对基础元素碎片掉落量的加成会逐渐衰减"],
    ["New Potion of Resonance: Provides +Elemental Shards % boost (Additive with equipment bonus). Uses both ", "新的回响药水：提供元素碎片 % 加成（和装备加成累加）。同时消耗 "],
    [". Same scaling as the Potion of Wisdom", "。数值成长和智慧药水相同"],
    ["Guild levels now also provide a multiplicative bonus to Orb and Formula drop rates", "公会等级现在还会提供特殊球和术式掉落率的累乘加成"],
    ["Added extra options to the Quantity and Unit Price field in the market to more easily choose these values", "为市场的数量和单价输入框新增了方便输入数值的按钮"],
    ["Add Notifications channel where you will find the system messages that previously appeared in all channels", "新增通知频道，之前出现在所有频道中的系统信息现在会出现在这里"],
    ["Added QoL option to automatically collect farm every 3 hours", "新增便利升级设置项，可每 3 小时收获一次农场"],
    ["Added rankings for total level and total base stats", "新增总等级和总属性排行榜"],
    ["Fix guild members leaving not being logged correctly", "修复了公会成员离开无法正确被日志记录的问题"],
    ["Potion Boost can now be bought on the potions page with", "现在可以购买药水加成升级，消耗"],
    [" ", " "],
    [", providing a permanent buff to potions. (Same effect as the Sigil of Distillation)", "，提供永久性的药水增强。（和蒸馏魔符的作用相同）"],
    ["Rift of Power: Added detail about upgrades to the chat message and activity log.", "力量裂隙：在聊天和活动日志中加入了升级详情。"],
    ["Market: Quantity field can now be left empty. Which will buy/sell as much as possible at the specified price without creating an open order. Also added confirmation when leaving price empty.", "市场：数量输入框现在可以留空。留空时会尽可能多地以所指定价格购买/出售而不挂单。同样加入了留空时的二次确认。"],
    ["Changed most feedback warning/error messages to be displayed as toasts instead of in the chat.", "将大多数警告/错误信息从聊天移到新增弹窗中。"],
    ["Added Quality of Life 'subscription' for 5", "加入了便利性月卡，价格为 5"],
    ["/month.", " 每月"],
    ["- Auto join events (configurable)", "- 自动参加事件（可设置）"],
    ["- Use enchanting skills of guild members", "- 利用公会成员的附魔能力"],
    ["Added more settings", "新增更多设置"],
    ["- Automatically join elemental rift (requires QoL)", "- 自动参加元素裂隙事件（需要便利升级月卡）"],
    ["- Automatically siphon rift of power up to X times (requires QoL)", "- 自动参加力量裂隙，并在单次裂隙中最多汲取 X 次力量（需要便利升级月卡）"],
    ["- Automatically disenchant item drops up to rarity", "- 自动分解特定稀有度以下的掉落装备"],
    ["- Option to block others from enchanting your equipment", "- 阻止他人为你的装备附魔"],
    ["- Channel prefix display options", "- 设置频道前缀显示模式"],
    ["- Disable title/color options", "- 禁用头衔/更改头衔颜色"],
    ["Added option to color your titles once you accumulate 50 Ascension Points", "新增自定义头衔颜色，要求累计获得 50 晋升点数"],
    ["Elemental Rift event actions now also progress your quest", "元素裂隙事件行动现在也会计入任务进度（和击败的事件 boss 数目无关）"],
    ["Show the enchant level for resistance enchants in tooltips", "在装备弹窗中还会显示抗性附魔对应等级"],
    ["Added limit of 200 enemy attacks to battles, after which you will give up", "战斗现在有 200 敌方攻击次数上限，超过此限制你将会放弃此次战斗"],
    ["Clicking your action during an event no longer tries to leave the event, you can select your activity on the Town page if you really want to leave", "事件中，点击导航栏的行动图标不再导致你离开当前事件，而是切换到事件页面，如果你确实希望离开，你可以在城镇页面中选择行动"],
    ["Fix farm fully grown icon not showing without visiting the farm page first", "修复了未访问农场页面的情况下，农场完全生长的图标不显示的问题。"],
    ["Fix quest notification sometimes not triggering with Sigil of Purpose", "修复了携带目标魔符时，任务完成通知有时不触发的问题"],
    ["Added premium shop with Codex and Crystallized Mana", "新增可购买法典和魔力结晶的高级商店"],
    ["Added more item names for battle items by level. Existing items have been renamed.", "新增更多战斗装备的等级名。现有装备的名称同样会改变。"],
    ["Added cosmetic chat titles matching these names that can be unlocked with Crystallized Mana", "新增装饰性聊天头衔，可以通过魔力结晶解锁"],
    ["Sigils are now part of equipment sets. Also moved sigil to top.", "魔符现在也可以被配装保存。此外将魔符移到装备栏顶端。"],
    ["Change referral bonus to be 5% of codex purchases and shards reduced to 5% of base drop (no longer includes % bonus shards from equipment).", "将推荐奖励变为所购买法典的 5% 以及所掉落基础元素碎片的 5%（不再计算装备的元素碎片加成）。"],
    [" No reset", " 不会有删档重置"],
    ["Fix dropping out of elemental rift queue when doing certain things", "修复了执行某些操作时会取消准备元素裂隙的问题"],
    ["/event (or /elementalrift) Brings up info about the latest elemental rift event", "/event（或者 /elementalrift）还会给出上一次元素裂隙的信息"],
    ["Change elemental rift timing to every 3.5 hours", "元素裂隙现在每 3.5 小时出现一次"],
    ["Add activity log entries for event points gained", "新增事件点数的活动日志项"],
    ["Potion of Renewal can now be created in higher tiers (with exponential cost scaling)", "现在可以制造更高等级的刷新药水（原料消耗指数级上升）"],
    ["The farm now grows ", "农场现在收获的 "],
    [" and", " 和"],
    [" at a 55:45 ratio instead of 60:40", " 数量比例由原来的 60:40 变为 55:45"],
    ["Show farm icon next to potion icon when farm is fully grown", "当农场完全成长时，在药水图标旁边显示农场图标"],
    ["Add equipment set names to star icon tooltip", "表示保护的星星标记会在提示悬浮窗中显示装备所属配装名字"],
    ["Add chatbox size preference in settings", "在设置中新增聊天框大小设置"],
    ["Add preference option to use clickable tooltips instead of hover", "在设置中现在可以选择点击而非悬浮触发提示悬浮窗"],
    ["Temporarily remember inventory filters when changing pages", "切换页面时会临时记住仓库过滤选项"],
    ["Fix an issue where quality would downgrade slightly when chaos orbing max percentile items", "修复了使用混沌球随机具有最大可能值属性的装备属性值时，装备品质可能稍微降低的问题"],
    ["Fix market category sometimes not switching fully", "修复了市场中切换物品分类有时不能完全更新挂单信息的问题"],
    ["Changed various texts for clarity", "更改了若干文字，以使表述更清晰"],
    ["Added Elemental Rift Event. Will occur every 2.5 hours, lasting 10 minutes with a 5 minute queue time. Awards Event Points based on bosses defeated/damage done/resources harvested.", "新增元素裂隙事件。每 2.5 小时出现一次，持续 10 分钟，并且带有 5 分钟准备时间。基于击败的 boss 数/造成的伤害/采集的资源奖励事件点数。"],
    ["Added Sigils and Event Shop, you can find them in the inventory. Sigils upgrade automatically based on total event points earned and can be exchanged freely.", "新增魔符和事件商店，你可以在仓库页面找到它们。魔符基于总事件点数自动升级，并且可以自由在不同种类间切换。"],
    ["Added leaderboards for event points and herbs/hr.", "新增事件点数和每小时药草数排行榜。"],
    ["Improved display of upgrades on rift of power page.", "改善了力量裂隙页面的强化显示。"],
    ["Fix missing activity logs when searching", "修复搜索活动记录时缺失某些条目的问题"],
    ["Fix quest loot tracker entries disappearing on refresh", "修复掉落记录刷新后丢失任务奖励记录的问题"],
    ["Fix ignore not working in guild chat", "修复公会聊天屏蔽不生效的问题"],
    ["The first type of event has been added: Rift of Power. Randomly opens every 3-6 hours for 10 minutes.", "新增第一种事件：力量裂隙。活动将间隔随机 3 到 6 小时开启，每次持续 10 分钟。"],
    [" When you siphon it you have a chance each action (starting at 100% each rift dropping to 10% as you siphon more) to apply the effect of an ", " 当你汲取力量裂隙时，每次行动都有一定概率（初始值 100%，每次成功降低 10%，最低 10%）施加一个"],
    [" ", " "],
    [" to your lowest quality equipped item.", " 的效果，作用于你装备的最低品质的物品上。"],
    ["Added new notification setting for this event.", "新增适用该事件的通知设置。"],
    [" now preserves the quality % of an item, bumping up all modifier values.", " 现在保留物品的品质百分比，将会相应增幅所有的属性值。"],
    ["Quests after 1000 completions now have a chance to give extra", "超过 1000 次行动的任务现在有几率给予额外的"],
    [", with 2 being guaranteed at 2000 etc. Also applies to the extra guild proc. Retroactively awarded some missed", "，到达 2000 行动任务时必定奖励 2 个法典，依此类推。此效果对公会额外任务法典同样有效。为任务进度超过 1000 的玩家相应补发了"],
    [" to the players past 1000 quests already.", "。"],
    ["Doubled chance of guild receiving ", "公会从成员任务中获得额外 "],
    [" on quest completions and retroactively awarded", " 的概率加倍，并且为公会相应补发了"],
    [" to guilds", ""],
    ["Doubled amount of ", "公会每次升级获得的 "],
    [" awarded for each guild level. (retroactive)", " 加倍。（相应补发）"],
    ["Display admin/mod roles in chat", "聊天中标记管理员角色"],
    ["Parse and show links in chat", "聊天消息会处理并显示链接"],
    ["Discarding potions now works one at a time", "现在销毁药水每次只会销毁一瓶"],
    ["Wire command supports comma separated items", "Wire指令现在支持逗号分隔的多个物品"],
    ["Randomize order of maxed enchanting leaderboards every restart", "每次重启时，附魔等级排行榜的同等排名间顺序随机变化"],
    ["Add in game News section", "游戏内加入新闻区"],
    ["Fixed an issue that was causing unintended variance with high time dilation/haste in combination with crit chance", "修复了高时间膨胀/技能急速和暴击几率共存时，造成意外的波动的问题。"],
    ["Market cooldown no longer applies when not over/undercutting the best price or doing it by at least 1%", "市场挂牌冷却在以下情况不再触发：不对当前最佳价格压价，或者对当前最佳价格至少压价 1%"],
    ["Added guild levels and battle xp tax option, providing a resource boost and increasing amounts of Codex", "新增公会等级以及战斗经验税收选项，提供采集提升，和更多法典"],
    ["Actions on most gathering equipment replaced by base resource amount (a quarter of the amount that tools have). Tools unchanged", "大多数采集装备的行动计数被替换为基础资源量（相当于原数值的四分之一）。工具不受影响"],
    ["Adjusted resource cost scaling for higher level guild upgrades", "调整了高等级公会升级的资源花费曲线"],
    ["Adjusted gatherer xp past level 750", "调整了 750 级以后的采集经验"],
    [" now preserves the quality % of items", " 现在保留物品的品质百分比"],
    [" infusion system for equipment, increasing power by 5% per infusion for exponentially increasing cost", " 装备强化系统，每次强化提升装备 5% 的各项数值，消耗指数级增加"],
    ["Mastery Codex boost removed and refunded as", "元素精通法典升级移除，相应消耗返还为"],
    [". Mastery drops now benefit from multistat", "。元素精通掉落现在受多重属性掉落增益"],
    ["Mana Conduit now gives 4% mana cost reduction per upgrade", "魔力回路现在每级提供 4% 的魔力消耗削减"],
    ["Mana Research boost now also boosts mana regeneration", "魔力研究升级现在还会增幅魔力回复"],
    ["Added another scaling factor to enemies past 5000", "为超过 5000 强度的敌人增加了额外的成长因素"],
    ["Market cooldown no longer applies if cancelled order was older than 1 hour", "取消 1 小时以前的市场挂单时，不再触发市场挂牌冷却"],
    ["Increased actions from 3 to 5 per Codex", "行动计数法典升级每级提升由 3 增加至 5"],
    ["Cancelling an order prevents new order for same item for 10 minutes. Limit to 1 open order per item", "取消市场挂单将使得接下来 10 分钟内无法对同一物品创建新挂单。每种物品只能创建 1 个活跃订单"],
    ["Added max price filter and reset filter button in equipment market", "为装备市场新增最大售价过滤选项，以及重置过滤按钮"],
    ["Added pulsing animation to potion icon 10 minutes before potion expires", "当药水效果仅余少于 10 分钟时，为药水图标新增闪烁动画"],
    ["Potions from belt only consumed when matching current action type", "现在只会从药水腰带中使用对应于当前行动的药水"],
    ["Added notification option for potion expiring", "新增药水耗尽通知选项"],
    ["Added extra confirmation to potion belt purchases and spellpower/ward when gathering", "为药水腰带容量升级和采集时法术强度/抗性升级新增二次确认"],
    ["Pushed down loot tracker sooner on smaller layouts", "提高下沉掉落跟踪面板的屏幕尺寸阈值"],
    ["Changed number formatting to be independent of browser localisation", "现在数值格式化不随浏览器本地化设置而改变"],
    ["Reduced battle xp needed per level by 50%", "升级所需战斗经验减少 50%"],
    ["Increased weight of battle levels in shard drop calculation, slowed scaling based on total level", "提高了元素碎片掉落数量计算时战斗等级的权重，降低基于总等级的增长速度"],
    ["Can now upgrade/discard potions in potion belt", "现在可以升级/丢弃药水腰带中的药水了"],
    ["Added extra confirmation for brewing potion not matching active action type", "制作不符合当前行动的药水时，新增二次确认"],
    ["Added farming + potions", "新增农场和药水"],
    ["Next guild upgrade can now be marked for anyone to complete", "新增标记下一公会升级功能，使任何成员均可完成"],
    ["Added field for internal guild info", "新增公会内部信息功能"],
    ["Added guild message of the day", "新增公会当日消息功能"],
    ["Remember mass disenchant option", "保存批量分解选项"],
    ["Increased ", "增加 "],
    [" drop rate by 50%", " 掉落率 50%"],
    [" drop rate by 25%", " 掉落率 25%"],
    ["Added option to filter items for any gathering skill in market, armory, inventory", "新增在市场、装备库、仓库过滤指定采集技能装备的选项"],
    ["Equipment order prices can now be edited", "装备出售挂牌价格现在可以编辑了"],
    ["Added Quality column and secondary boost filter for combat skills to equipment market", "为装备市场增加了品质列和战斗第二加成过滤选项"],
    ["Fixed notification going through when player is ignored", "修复玩家被屏蔽时通知不生效的问题"],
    ["Scroll to top when switching chat tabs, don't clear selected chat channel", "切换聊天频道时自动滚动至顶端，并且不会清除选中频道的聊天记录"],
    ["Player profile and research pages now show correct totals including Nexus Crystal and base crit chance/damage", "玩家简介和研究页面现在会正确显示连结水晶升级后以及计算基础暴击率/暴击伤害后的属性值"],
    ["Added equipment market", "新增装备市场"],
    ["Show chance to upgrade each specific boost on upgrade page", "在强化页面显示每项装备属性获得升级的概率"],
    ["Rare items now have same amount of modifiers as epics, with lower values", "稀有物品的属性数现在和史诗物品一样，但是数值更低"],
    ["Increased average/maximum roll values for non-legendary items", "增加了非传说物品属性值的平均值/最大值"],
    ["Significantly buffed mana regeneration from spirit", "极大增加了精神属性提供的魔力回复"],
    ["Can leave price field blank in market to sell/buy at market price", "在价格输入框留空可以直接以当前市场价出售/购买"],
    ["Can click funds in guild to prefill", "可以在公会升级页面中点击个人仓库剩余数量以快速填写捐赠输入框"],
    ["Added /ignored, /wire, /afk, /profile commands", "新增 /ignored, /wire, /afk, /profile 指令"],
    ["Added ability to add text on profile page", "新增主页自定义文字功能"],
    ["Allowed line breaks in guild description", "公会介绍现在可以换行了"],
    ["Added clear button to loot tracker", "为掉落追踪器新增清除按钮"],
    [" rerolls if all boosts are same, 50% chance to pick active mastery on staffs", " 会在随机后的所有属性类型和原来完全相同时重新随机，对于法杖，有 50% 的概率选择当前行动对应的元素精通加成"],
    ["Added activity log for players and guilds", "新增玩家和公会的活动记录"],
    ["Added cap of level 22 on enchanting skills, increasing by 1 every Monday", "所有附魔等级新增 22 级上限，每周一上限增加 1"],
    ["Added leaderboards for enchanting", "新增附魔等级排行榜"],
    ["Changed weights of equipment drops, less weighted toward weapons", "改变了装备掉落的权重，减少了武器的权重"],
    ["Increased chance of epic gear and legendary jewelry drops", "增加了史诗装备和传说首饰的掉落概率"],
    ["Increased chatbox size, decreased line spacing", "增加了聊天框的大小，减少了行间距"],
    ["Added ctrl + click item linking", "新增 Ctrl + 点击物品链接至聊天的功能"],
    ["Reset enchanting skills, refunded formulas, cancelled market orders for formulas", "重置所有附魔等级，返还相应术式，取消所有附魔术式的市场挂牌"],
    ["Added option to reset codex boosts, cost based on non-action boosts", "新增重置法典升级的选项，重置消耗基于行动次数以外的升级计算"],
    ["Can enchant items from profiles", "可以在玩家资料页附魔装备"],
    ["Added ignore functionality and /help command", "新增屏蔽功能和 /help 指令"],
    ["Guilds can tax ", "公会可以对 "],
    [", withdraw", " 收税，凭借新增的公会权限回收"],
    ["/", "/"],
    [" with new rank permission", ""],
    ["Slightly nerfed enemy ward/focus scaling in final areas", "略微削弱了最终区域敌人的抗性/集中增长率"],
    ["Changed battle xp curve, reducing by up to 11% under level 160, increasing later", "调整了战斗经验曲线，160 战斗等级以下所需经验最高减少 11%，在之后则会增加"],
    ["Armory shows if borrowed items are unequipped", "装备库现在标识借出但未被装备的物品"],
    ["Reverted part of enemy scaling due to error", "由于报错，回退了一部分敌人成长调整"],
    ["Display online/active player count", "显示在线/活动玩家数量"],
    ["Display last active time in guild roster", "在公会名单中显示上次活动时间"],
    ["Added detailed notification settings, support for multiple devices", "新增详细通知设置，支持多设备"],
    ["Updated battle code, slightly reduced randomness of enemy damage", "更新战斗代码，稍微降低了敌人伤害的随机性"],
    ["Added color options for theme and chat colors in settings", "在设置中新增主题颜色和聊天颜色选项"],
    ["Added /transferguild command", "新增 /transferguild 指令"],
    ["Enchanting reagent cost scaling changed to 3 per level", "附魔材料消耗调整至每级 3 个"],
    ["Fire/Water/Nature Essence added to gathering skill drop tables", "火/水/自然精华加入采集技能掉落物中"],
    ["Adjusted droprates of some reagents", "调整了某些附魔材料的掉落率"],
    ["Added leaderboard for strongest enemy defeated in final zones", "新增最终区域击败敌人最高强度排行榜"],
    ["Leaderboards filtered to remove admins/inactive players", "排行榜现在会移除管理员和不活跃玩家"],
    ["Can favorite items to prevent mass disenchant", "可以保护物品，防止其被批量分解"],
    ["Mass disenchant only applies to filtered item list", "批量分解现在只会分解清单中过滤后的物品"],
    ["Fixed issues with item links in chat input", "修复了聊天输入框关于物品链接的问题"],
    ["Can no longer transfer items to banned/guest accounts", "无法再向封禁/访客账号发送物品"],
    ["Added leaderboards for different categories", "新增不同类别的排行榜"],
    ["Added gather actions count to profile, some early data missing", "个人资料页新增采集行动数统计，一些早期数据已丢失"],
    ["Added guild upgrade for increased actions", "新增可以增加最大行动数的公会升级"],
    ["3 actions per codex (retroactive)", "每本法典提升 3 行动数（溯及既往）"],
    ["Gather gear more likely to roll for active skill", "掉落的采集装备现在更有可能对应于当前行动"],
    ["Item transfers now show in whispers for persistence", "物品收发记录现在在私聊栏中长期显示"],
    ["Whisper tab shows unread count, including in All tab", "私聊栏现在显示未读数量，包括「所有」栏"],
    ["Manual refresh may be needed to see changes", "改动可能需要手动刷新生效"],
    ["New guild upgrade: Study Room +1% base experience per level for gatherers and battlers", "新增公会升级：学习室。每级使战斗和采集成员基础经验值 +1%"],
    ["Banned players’ names struck through on guild roster and profile", "封禁玩家的名字会在个人资料页和公会名单上用删除线划去"],
    [" logic updated to preserve existing modifier types", " 机制更新，现在会保留已有的属性"],
    [" from quest rewards changed to", " 在任务奖励中变为"],
    [" until quest counter reaches 1000", "，直至任务所需行动数到达 1000"],
    ["Normal tradeable codex drop rates buffed to 1/4k base", "普通的可交易法典掉落率基础值增加至 1/4000"],
    ["Closed 50 accounts for multi farming/botting", "封禁了 50 个小号/脚本"],
    // #region town text
    ["Welcome to Manarion", "欢迎来到 Manarion"],
    ["Battle Zones", "战斗区"],
    ["Radiant Grove (Beginner)", "辉光树林（新手）"],
    ["The Smoldering Marsh (Intermediate)", "烟尘湿地（进阶）"],
    ["Worldshaper's Domain ", "创世领域"],
    ["Maelstrom's Eye ", "风暴之眼"],
    ["Blazing Core ", "炙热核心"],
    ["Gathering Zones", "采集区"],
    ["Ironclad Mines (Mining)", "覆铁矿洞（采矿）"],
    ["Azure Lake (Fishing)", "蔚蓝湖泊（捕鱼）"],
    ["Elderwood Grove (Woodcutting)", "古树之林（伐木）"],
    ["Other Places", "其他区域"],
    ["The Farm", "农场"],
    ["Notice Board (Rules)", "告示板（游戏规则）"],
    ["News Board" , "新闻栏"],
    ["The Market", "市场"],
    ["Guild", "公会"],
    ["Hall of Fame", "荣耀大厅"],
    ["Mage Tower", "巫师塔"],
    ["Notice Board (Rules)", "告示板（游戏规则）"],
    ["News Board", "新闻栏"],
    // #region label
    ["Adjust personal contribution", "调整个人上税"],
    ["Example", "示例按钮"],
    ["Sign in with Discord", "使用 Discord 登录"],
    ["Sign in with Twitch", "使用 Twitch 登录"],
    ["Join Us on Discord", "加入我们的 Discord"],
    ["Quest Timer:", "任务计时器："],
    ["Time to Level:", "升级倒计时："],
    ["XP / Hr:", "XP / 小时:"],
    ["Levels / Hr:", "等级 / 小时:"],
    ["XP / Day:", "XP / 天:"],
    ["Mana Dust / Hr:", `${Settings.manaDustName} / 小时:`],
    ["Mana Dust / Day:", `${Settings.manaDustName} / 天:`],
    ["Resource / Hr:", "资源 / 小时:"],
    ["Resource / Day:", "资源 / 天:"],
    ["Shards / Hr:", "碎片 / 小时:"],
    ["Shards / Day:", "碎片 / 天:"],
    ["Shards range:", "碎片掉落范围："],
    ["Intellect gained:", "获得智力:"],
    ["Stamina gained:", "获得耐力:"],
    ["Spirit gained:", "获得精神:"],
    ["Focus gained:", "获得集中:"],
    ["Mana gained:", "获得魔力:"],
    ["Mastery gained:", "获得元素精通:"],
    ["Tracked time:", "记录时间:"],
    ["Total stats:", "总获得属性点:"],
    ["Unlink", "解除绑定"],
    ["Logout", "登出"],
    ["Infuse", "注能等级"],
    ["Use", "使用"],
    ["Premium", "高级商店"],
    ["Current Title", "当前头衔"],
    ["Unlock", "解锁"],
    ["Title", "头衔"],
    ["Used to purchase premium features like titles", "用来购买包含头衔等高级特性的货币"],
    ["None", "无"],
    ["Neophyte", "Neophyte"], // #region Elnaeth
    ["Show stats tracker (lower left)", "显示属性追踪器（左下角）"],
    ["Show individual stat gains log (upper right)", "显示属性掉落日志（右上角）"],
    ["Show enhanced loot tracker (upper right)", "显示增强型掉落追踪器（右上角）"],
    ["Enable item QoL as a whole", "显示装备便利信息"],
    ["Enable item QoL on profile pages", "在资料页显示装备便利信息"],
    ["General settings", "通用设置"],
    ["Item QoL settings", "装备便利信息设置"],
    ["Parse rare items", "显示稀有装备信息"],
    ["Parse epic items", "显示史诗装备信息"],
    ["Parse legendary items", "显示传说装备信息"],
    ["Parse heirloom items", "显示传承装备信息"],
    ["Parse mythic items", "显示神话装备信息"],
    ["Show codex boosts (such as exp, stat, mana dust, etc)", "显示法典加成（基础经验值，基础魔法尘等法典研究升级）"],
    ["Show shard boosts (such as crit chance, crit damage, etc)", "显示碎片加成（暴击率，暴击伤害等元素碎片研究升级）"],
    ["Show (missing) enchants", "显示（缺少的）附魔"],
    ["Show which sets items belong to", "显示装备所属配装"],
    ["Show item quality", "显示装备品质"],
    ["Enable extensive debug output (developer mode)", "开启详细 debug 输出（开发者模式）"],
    // #region battle text
    ["Your guild received:", "你的公会获得了："],
    ["Battle XP", "战斗经验"],
    [" Battle XP", " 战斗经验"],
    ["Player", "玩家"],
    ["Ward Strength: ", "抗性强度："],
    ["% Mana Shield Size: ", "% 魔力护盾大小："],
    ["Average Damage Per Spell:", "每次施法平均伤害："],
    ["You spent ", "你消耗了 "],
    [" mana", " 点魔力"],
    [".", "."],
    ["Kills: ", "击杀："],
    ["Deaths: ", "死亡："],
    ["Winrate:", "胜率："],
    ["Enemy", "敌人"],
    ["Average Damage Per Attack:", "每次攻击平均伤害："],
    [" Lacked ", " 缺少 "],
    [" mana", " 魔力"],
    ["You went ", "你进行了一次"],
    ["mining", "采矿"],
    ["fishing", "捕鱼"],
    ["woodcutting", "伐木"],
    [" and gained", "，获得了"],
    [" experience", " 点经验"],
    ["You received the following loot:", "你获得了以下物品："],
    ["Set name", "设置名称"],
    // #region rule text
    ["1. Respect Others", "1. 尊重他人"],
    ["No harassment, personal attacks, or targeted insults.", "禁止羞辱行为，人身攻击，或者有针对的侮辱。"],
    ["2. Keep It Safe For Everyone", "2. 为所有人维护适宜的环境"],
    ["No NSFW content, racism, sexism, or hate speech of any kind.", "禁止不适宜工作展示 (NSFW) 的内容，种族歧视，性别歧视，或者任何形式的仇恨言论。"],
    ["3. No Automation", "3. 禁止自动化"],
    ["Any form of botting, scripting, or macroing is forbidden.", "禁止任何形式的自动机器人、脚本、宏。"],
    ["4. No Scamming", "4. 禁止欺诈"],
    ["All trade agreements must be honored. Scamming wastes moderator time and will result in bans.", "所有的交易约定都应得到彻底遵守。欺诈行为浪费管理员的时间，将会导致封禁。"],
    ["5. One Account Per Person", "5. 一人一号"],
    ["If multiple people play from the same location, they may not play in a way that provides excessive benefit to any account other than their own.", "如果多个人在同一地点游玩，他们不能以任意形式为彼此提供利益。"],
    ["6. No Account Sharing", "6. 禁止共享账号"],
    ["Do not share your account. You are responsible for all activity on your account.", "不要分享你的账号。你为你账号的所有行动负责。"],
    ["7. No Bug Abuse", "7. 禁止恶意利用漏洞"],
    ["If you find an exploit, report it privately to a staff member. Abusing bugs will result in a ban.", "如果你发现了一个漏洞，请私下向制作人员反馈。恶意利用漏洞将会导致封禁。"],
    // #region siphon text
    ["You are currently siphoning power into your lowest quality equipped item...", "为装备中的最低品质物品汲取裂隙之力..."],
    ["Siphoning power into ", "汲取力量至 "],
    ["You don't have any items equipped.", "你没有装备任何物品。"],
    ["Currencies", "通用物品"],
    ["Resources", "资源"],
    ["Orbs/Upgrading", "特殊球/升级"],
    ["Herbs", "药草"],
    ["Enchanting Reagents", "附魔材料"],
    ["Enchanting Formulas", "附魔术式"],
    ["Merchant", "商人"],
    // #region nav link
    ["Combat", "战斗"],
    ["Town", "城镇"],
    ["Research", "研究"],
    ["Inventory", "仓库"],
    ["Dungeon", "地牢"],
    ["Tower","塔"],
    ["Pets", "宠物"],
    ["Gems","宝石"],
    ["Market", "市场"],
    ["Shop","商店"],
    ["Crafting","锻造"],
    ["Rankings", "排行榜"],
    ["Battle", "战斗"],
    ["Rules", "规则"],
    ["News", "新闻"],
    ["Settings", "设置"],
    // #region item desc txt
    ["You have ", "仓库数量 "],
    ["Fragments of raw elemental power.", "含有纯净元素之力的碎片。"],
    ["A smoldering ember.", "尚未熄灭的余烬。"],
    ["A fine dust infused with magical energy.", "一些灌注了魔力的精良粉尘。"],
    ["An ancient book filled with arcane knowledge.", "一本写满奥术智慧的古书。"],
    ["An ancient book filled with arcane knowledge. Untradeable.", "一本写满奥术智慧的古书。不可交易。"],
    ["Sustenance for the journey ahead.", "滋养前路。"],
    ["A basic crafting material from trees.", "一种基础的来自树木的合成材料。"],
    ["A sturdy material for construction.", "一种用于建筑的坚实材料。"],
    ["A tome ablaze with fiery incantations.", "一本因炙热的魔咒而熊熊燃烧的典籍。"],
    ["A tome rippling with fluid magic.", "一本因流动的魔法而泛起波纹的典籍。"],
    ["A tome pulsing with vitality.", "一本因勃勃生机而脉动着的典籍。"],
    ["A tome that strengthens your mana shield ability.", "一本增强你的魔法盾的典籍。"],
    ["Rerolls the values of all item modifiers. Only higher values are kept.", "随机变化装备的所有属性值。只会保留比原先更高的值。"],
    ["Rerolls all modifiers of an item. Including the skill on gathering items.", "随机变化装备的所有属性。包括采集装备的采集种类。"],
    ["Upgrades an Epic item to Legendary.", "将一件史诗装备升级至传说。"],
    ["Used to make Potion of Renewal", "用于合成刷新药水"],
    ["Used to make Potion of Wisdom", "用于合成智慧药水"], // dummy
    ["Used to make Potion of Harvesting", "用于合成收获药水"], // dummy
    ["Used to make Potions", "药水的原材料"],
    ["A burning core of fire magic.", "燃烧着的火魔法核心。"],
    ["A swirling essence of water magic.", "漩涡状的水魔法精华。"],
    ["A living essence of nature's magic.", "拥有生命的自然魔法精华。"],
    ["A fire-resistant mineral. Can provide resistance to fire.", "一种抗火的矿物。可以提供火系抗性。"],
    ["A rare, incredibly durable wood. Can provide resistance to nature.", "一种无比结实的稀有木材。可以提供自然抗性。"],
    ["Scales from a mystical fish. Can provide resistance to water.", "来自一条神秘之鱼的鱼鳞。可以提供水系抗性。"],
    ["A wood fragment from an ancient tree.", "一片来自某株古树的木材。"],
    ["A mystical stone that resonates.", "一颗产生共振的神秘石子。"],
    ["A rare pearl", "一种稀有的珍珠。"],
    ["A rare clover", "一种稀有的三叶草。"],
    ["Swirling with magic.", "富含的魔法在其内产生了漩涡。"],
    ["An enchantment that amplifies fire magic.", "一种增强火系魔法的附魔。"],
    ["An enchantment that empowers water magic.", "一种增强水系魔法的附魔。"],
    ["An enchantment that enhances nature magic.", "一种增强自然魔法的附魔。"],
    ["Improves your fire resistance enchantment ability.", "提升你的火系抗性附魔能力"],
    ["Improves your water resistance enchantment ability", "提升你的水系抗性附魔能力"],
    ["Improves your nature resistance enchantment ability", "提升你的自然抗性附魔能力"],
    ["An enchantment that multiplies base experience.", "一种提高基础经验的附魔。"],
    ["An enchantment that multiplies base resources.", "一种提高基础资源的附魔。"],
    ["An enchantment that multiplies base mana dust drops.", `一种提高基础${Settings.manaDustName}的附魔。`],
    ["An enchantment that increases drop rates.", "一种提高掉落概率的附魔。"],
    ["An enchantment that increases your multistat.", "一种提高多重属性掉落的附魔。"],
    ["An enchantment that multiplies all your base stats.", "一种提高你的所有属性值的附魔。"],
    ["Used to upgrade Sigils", "用于升级魔符"],
    // #region quest/event
    ["Defeat ", "击败 "],
    [" enemies.", " 个敌人"],
    ["Complete ", "完成 "],
    [" harvests.", " 次采集"],
    ["Quest Progress", "任务进度"],
    [" ticks remaining", " 刻剩余"],
    [" Elemental Rift", " 元素裂隙"],
    ["Queue for Elemental Rift", "准备元素裂隙"],
    ["Event Boss ", "事件 Boss "],
    ["Event Buffs", "事件加成"],
    ["Starting in ", "距离开始还有 "],
    [" ticks", " 刻"],
    ["Complete for ", "完成可获得 "],
    ["You contributed ", "你贡献了 "],
    ["iron", "铁"],
    ["wood", "木"],
    ["fish", "鱼"],
    // #region misc
    ["Edit Profile", "编辑资料"],
    ["Enchant", "附魔"],
    ["📜 Game Rules", "📜 游戏规则"],
    ["Worldshaper", Settings.worldshaperName],
    ["Worldburner", Settings.worldburnerName],
    ["Worlddrowner", Settings.worlddrownerName],
    [" Online", " 在线"],
    [" Active", " 活动中"],
    ["Connection lost", "连接中断"],
    ["Trying to reconnect...", "正在重连..."],
    ["Your account has been disabled.", "你的账号已被封禁"],
    ["Farm Herbs/Hr", "农场每小时收获"],
    ["Highest Damage Spell Rank","最高伤害魔法等级"],
    ["Highest Resistance Spell Rank","最高抗性魔法等级"],
    ["Completed (Total)","已完成（总计）"],
    ["Completed (Manual)","已完成（手动）"],
    ["Rooms visited","已访问房间数"],
    ["Treasures found","已发现宝藏数"],
    ["Guild Objectives","公会地牢总伤害"],
    ["Fastest Small Any%","最快小型 任意完成度"],
    ["Fastest Medium Any%","最快中型 任意完成度"],
    ["Fastest Large Any%","最快大型 任意完成度"],
    ["Fastest Small 100%","最快小型 100%完成度"],
    ["Fastest Medium 100%","最快中型 100%完成度"],
    ["Fastest Large 100%","最快大型 100完成度"],
    ["No results", "无结果"],
    // #region profile text
    ["Battle Quest # ", "战斗任务 # "],
    ["Gather Actions: ", "采集次数："],
    ["Gather Quest # ", "采集任务 # "],
    ["Event Actions: ", "事件中行动数："],
    ["Spellpower Upgrades", "法术强度升级"],
    ["Ward Upgrades", "抗性升级"],
    ["Harvest Golems", "收割傀儡"],
    ["Fertilizer", "肥料"],
    ["Plot", "地块"],
    ["Potion belt size", "药水腰带容量"],
    ["Siphoning Rift of Power", "正在汲取裂隙之力"],
    ["Siphon Rift of Power", "汲取裂隙之力"],
    ["You have siphoned power from the rift ", "你从裂隙中汲取了 "],
    [" times. Siphon chance: ", " 次力量。下次成功汲取概率："],
    ["% Upgrade Chance)", "% 强化概率)"],
    ["Event Points: ", "事件点数："],
    ["Dungeons unlocked", "已完成地牢"],
    ["Idle Progress Speed", "挂机进度速度"],
    ["Treasure", "宝藏"],
    ["Queue Upgrades", "地牢队列升级"],
    ["Swiftness", "迅捷"],
    ["Perception", "感知"],
    ["view distance", "视野距离"],
    ["Auto Loot", "自动拾取"],
    ["Workshop", "工匠坊"],
    ["Planning Office", "规划大厅"],
    ["Spire", "魔能尖塔"],
    ["Expedition Hall", "远征殿堂"],
    ["Menagerie", "奇兽苑"],
    ["Laboratory", "炼金室"],
    ["Library", "智识之库"],
    ["Training Grounds", "试炼场"],
    ["Meditation Sanctum", "冥想圣所"],
    ["Leyline Tap", "魔网节点"],
    ["Moonwell", "月亮井"],
    ["Dust Collector", "尘加成器"],
    ["Jeweler's Bench","珠宝工坊"],
    // #region pet text
    ["menuitem Activate", "激活"],
 
 
    // #region dropdown text
    ["Investments", "研究投入"],
    ["Pet Levels Gained", "宠物等级"],
    ["Deaths", "死亡"],
    ["Kills/Death", "击杀/死亡"],
    ["Highest Mastery", "最高元素精通"],
    ["Base Spellpower", "基础法术强度"],
    ["Base Ward", "基础抗性"],
    ["Highest Spell Rank", "最高魔法等级"],
    ["View Profile", "查看资料页"],
    ["Wire", "给予物品"],
    ["Whisper", "私聊"],
    ["Ignore", "屏蔽"],
    ["Funds", "仓库"],
    ["Members", "成员"],
    ["Rank Changes", "职位变动"],
    ["Mining Level", "采矿等级"],
    ["Fishing Level", "捕鱼等级"],
    ["Woodcutting Level", "伐木等级"],
    ["Strongest Enemy", "击败敌人最高强度"],
    ["Total Actions", "总行动数"],
    ["Battle Quest #", "战斗任务 #"],
    ["Gather Quest #", "采集任务 #"],
    ["Enchanting", "附魔"],
    ["Send", "发送"],
    ["Account", "账号"],
    ["Event", "事件"],
    ["Total Level", "总等级"],
    ["Base Stats", "基础属性值"],
    // #region elnaeth
    ["Loot Tracker", "掉落追踪器"],
    ["\n        Tracker settings\n      ", "掉落追踪脚本设置"],
    ["\n              Save settings\n            ", "保存设置"],
    ["Show item info on a single line", "单行显示装备信息"],
 
    // #region pets
    ["Pet Egg", "宠物蛋"],
    ["Pet Egg:", "宠物蛋:"],
    ["Each pet level gained grants 2% bonus experience to all pets", "宠物每升1级，所有宠物经验+2%"],
    ["Decreases the duration to auto complete a dungeon by 0.833%", "将地牢自动完成的时长缩短 0.833%"],
    ["Increases view distance in dungeons.", "增加地牢视野范围"],
    ["Increases the amount of dungeons you can unlock for auto completion.", "增加可以自动完成的地牢数量"],
    ["Increases the amount of treasure found by 1%", "增加找到的宝藏数量+1%"],
    ["Increased movement speed in dungeons.", "增加地牢移动速度"],
    ["Automatically open chests in dungeons when entering the room.", "进入房间时自动打开宝箱"],
    ["The maximum amount of dungeons you can complete", "最大可完成的地牢数量"],
    ["Dungeons", "地牢"],
    [" completed)", " 已完成)"],
    ["Play Manual Mode", "手动模式"],
    ["Dungeon Point Upgrades", "地牢科技"],
    [" points)", " 剩余点数)"],
    ["Small", "小型"],
    ["Medium", "中型"],
    ["Large", "大型"],
    ["Guild Dungeon ", "公会地牢 "],
    ["View Loot", "查看掉落"],
    ["Sniffles", "嗅嗅"],
    ["View progress", "查看目前进度"],

    // #region gem
    ["Merge", "合成"],
    ["Cut", "切割"],
    ["Select", "选择"],
    ["Gem", "宝石"],
    ["Jewelcrafting", "珠宝锻造"],
    ["Ruby", "红宝石"],
    ["Sapphire", "蓝宝石"],
    ["Emerald", "祖母绿"],
    ["Diamond", "金刚石"],
    ["Garnet", "石榴石"],
    ["Aquamarine", "海蓝石"],
    ["Jade", "碧玉石"],
    ["Citrine", "黄水晶"],
    ["Topaz", "托帕石"],
    ["Amethyst", "紫水晶"],
    ["Onyx", "黑曜石"],
    ["Turquoise", "绿松石"],
    ["Peridot", "橄榄石"],
    ["Tanzanite", "坦桑石"],
    ["Tourmaline", "电气石"],
    ["Resonance", "共鸣"],   
    ["Luster", "光泽"],      
    ["Clarity", "净度"],
    ["(", "("],
    [")", ")"],
    ["Mining XP", "采矿经验"],
    ["Fishing XP", "捕鱼经验"],
    ["Woodcutting XP", "伐木经验"],
    ["Equipment Drop Rate", "装备掉落率"],
    ["Gem Drop Rate", "宝石掉落率"],
    ["Overflow", "溢流"],
    ["Stamina", "耐力"],
    ["Base Resource", "基础资源"],
    ["Base Resource Amount", "基础资源量"],
    ["Magical Accounting", "魔法账簿"],
    ["Pet Bonus XP", "宠物加成经验"],
    ...[
        ["A gem that amplifies Fire magic", "增强火系魔法的宝石"],
        ["A gem that amplifies Water magic", "增强水系魔法的宝石"],
        ["A gem that amplifies Nature magic", "增强自然魔法的宝石"],
        ["A gem that increases Intellect", "增加智力的宝石"],
        ["A gem that increases experience while Mining", "增加采矿经验的宝石"],
        ["A gem that increases experience while Fishing", "增加捕鱼经验的宝石"],
        ["A gem that increases experience while Woodcutting", "增加伐木经验的宝石"],
        ["A gem that increases the drop rate of Equipment", "增加装备掉落率的宝石"],
        ["A gem that increases the drop rate of Gems", "增加宝石掉落率的宝石"],
        ["A gem that makes use of excess mana regeneration", "利用超额魔力回复的宝石"],
        ["A gem that increases Stamina", "增加耐力的宝石"],
        ["A gem that increases Base Resource %", "增加基础资源百分比的宝石"],
        ["A gem that increases Base Resource Amount", "增加基础资源量的宝石"],
        ["A gem that increases Magical Accounting", "增加魔法账簿的宝石"],
        ["A gem that increases Pet Bonus Experience", "增加宠物经验加成的宝石"],
        ["Gem Tokens", "宝石代币"],
    ].flatMap(([key, value]) => [
        [key, value],
        [` ${key}`, ` ${value}`],
        [`${key}:`, `${value}:`],
    ]),
    ["Gem Tokens are earned by working on objectives in group dungeons", "宝石代币可通过完成团队地下城获取"],
    ["Merge Gems", "宝石合成"],
    ["Automation", "自动"],
    ["s","s"],
    ["Automatically combine identical jewels up to", "自动合成相同宝石直到"],
    ["Clear selection after merge", "合成后清空选择"],
    ["[Gem Tokens]", "[宝石代币]"],
    ["Jewels", "宝石"],
    ["Uncut Gems","未切割宝石"],
    ["Build","建造"],
]);
// #region SettingTL
const SettingsTranslation = new Map([
    ["Auto collect farm every 3 hours", "每 3 小时自动收获农场"],
    ["，", "，"],
    ["Referrer Link", "推荐链接"],
    ["Guild Taxes", "公会税收"],
    ["Push Notifications", "推送通知"],
    ["Customize Colors", "自定义颜色"],
    ["Chatbox size: ", "聊天框大小："],
    ["Preferences", "偏好"],
    ["Theme", "主题"],
    ["Whispers", "私信消息"],
    ["General", "通用频道"],
    ["Trade", "交易频道"],
    ["Guild", "公会频道"],
    ["Help", "帮助频道"],
    ["Notifications", "通知频道"],
    ["Identity Providers", "身份验证"],
    ["Quest Complete", "任务完成"],
    ["Fatigue", "行动计数归零"],
    ["Whisper", "私信"],
    ["Potion expired", "药水耗尽"],
    ["Rift of Power (Event)", "力量裂隙（事件）"],
    ["Added on", "添加于"],
    ["Refer your friends to the game and get an additional 5% of their", "将游戏推荐给朋友，然后额外获得他们充值获得的"],
    [" purchases and their base", " 5% 以及他们掉落的"],
    [" drops.", " 的基础值的 5%。"],
    [" they find.", " 的 5%。"],
    ["You must both verify your account by linking an identity provider to earn rewards.", "双方均需绑定账号以获取奖励。"],
    ["Other devices", "其他设备"],
    ["You have earned a total of", "你总共获得了"],
    ["任务完成", "任务完成"],
    ["行动计数归零", "行动计数归零"],
    ["私信", "私信"],
    ["药水耗尽", "药水耗尽"],
    ["力量裂隙（事件）", "力量裂隙（事件）"],
    ["Elemental Rift (Event)", "元素裂隙（事件）"],
    ["Tooltip mode:", "物品悬浮窗触发方式："],
    ["Hover", "鼠标悬浮"],
    ["Click", "鼠标点击"],
    ["Channel Prefix:", "频道前缀："],
    ["7TV Emotes", "表情包"],
    ["Chat Titles:", "聊天头衔："],
    ["Long", "长"],
    ["Short", "短"],
    ["None", "无"],
    ["Colored", "彩色"],
    ["Gray", "灰色"],
    ["Hidden", "不显示"],
    ["Animated", "动画"],
    ["Static", "静态"],
    ["Text", "文字"],
    ["Emotes in system messages", "在系统消息里有表情包"],
    ["Yes", "是"],
    ["No", "否"],
    ["Game Preferences", "游戏偏好"],
    ["UI Preferences", "界面偏好"],
    ["Automatically join Elemental Rift", "自动参加元素裂隙事件"],
    ["Automatically siphon Rift of Power up to", "自动参加力量裂隙事件，直到汲取力量次数到达"],
    ["times", "次"],
    ["Automatically disenchant item drops up to", "自动分解稀有度"],
    ["rarity", "以下的掉落装备"],
    ["Block others from enchanting your equipment", "阻止其他人为你的装备附魔"],
]);
// #region FarmTL
const FarmTranslation = new Map([
    ["Potion Boost", "药水增强"], // farm
    ["Increases the potency of potions.", "增强药水的效果"], // farm
    [" (Tier ", " (等级 "],
    [" Ticks)", " 刻)"],
    [" more in potion belt", " 瓶存于药水腰带"],
    ["", ""],
    ["Your farm has been growing for ", "你的农场已经生长了 "],
    ["Your farm has been growing for less than a minute", "你的农场已经生长了不到一分钟"],
    [" hours", " 小时"],
    [" hours ", " 小时 "],
    [" hour", " 小时"],
    [" hour ", " 小时 "],
    [" minutes", " 分钟"],
    [" minute", " 分钟"],
    [" herbs/hour, upkeep", " 药草/小时，消耗"],
    ["dust/hour)",  `${Settings.manaDustName}/小时)`],
    ["(Your farm continues to grow for up to 24 hours)", "(你的农场可以持续生长 24 小时)"],
    ["Upgrades", "升级"],
    ["Harvest Golems", "收割傀儡"],
    ["Fertilizer", "肥料"],
    ["Plots", "地块"],
    ["Improves growth, increasing the yield of all plots.", "促进作物生长，增加所有地块产出。"],
    ["Constantly tends to your plots, increasing the yield of all plots.", "不间断地照料田地，增加所有地块产出。"],
    ["Expands your farming area, increasing the yield.", "扩大你的田地，增加产出。"],
    ["Current Boost: ", "当前加成："],
    ["Increase ", "提升 "],
    [" times (+", " 级 (+"],
    [" times (", " 级 ("],
    [") for ", ")，消耗 "],
    ["times (", "级 ("],
    [") for ", "), 消耗 "],
    ["Potion of Renewal", "刷新药水"],
    ["Potion of Wisdom", "智慧药水"],
    ["Potion of Harvesting", "收获药水"],
    ["Potion of Resonance", "回响药水"],
    ["Restores 200 actions when you run out.", "当行动次数不足时回复 200 次数"],
    ["当行动次数不足时回复 ", "当行动次数不足时回复 "],
    [" 200 次数", " 200 次数"],
    [" Battle Experience for 1 hour.", " 战斗经验，持续 1 小时。"],
    [" Base Resource Amount for 1 hour.", " 基础资源量，持续 1 小时。"],
    [" Elemental Shards for 1 hour.", " 元素碎片，持续 1 小时。"],
    ["Potion Belt", "药水腰带"],
    ["Potion belt", "药水腰带"],
    ["Brewing", "酿药"],
    ["Increases the maximum amount of potions you can store.", "增加你最多可以保存的药水数量。"],
]);
[...FarmTranslation.values()].forEach(value => FarmTranslation.set(value, value));
// #region GuildTL
const GuildTranslation = new Map([
    ["Guild Funds", "公会仓库"],
    ["Name", "玩家名称"],
    ["resources", "资源"],
    ["Guild Name", "公会名称"],
    ["Level", "公会等级"],
    ["Active", "上次活动"],
    ["Rank", "职位"],
    ["Upgrades", "公会升级"],
    ["Owner", "所有者"],
    ["Members", "成员数量"],
    ["members", "成员"],
    ["items", "物品数"],
    ["per boost", "每次升级"],
    ["additional resources", "额外资源"],
    ["reduction", "消耗削减"],
    ["Base Experience", "基础经验值"],
    ["additional actions", "额外行动"],
    ["Capacity ", "装备库空间 "],
    ["Activity Log", "活动日志"],
    ["Info", "信息"],
    ["Message of the Day", "每日消息"],
    ["% Base Resource", "% 基础资源量"],
    ["% Orb drop rate", "% 特殊球掉落率"],
    ["% Formula drop rate", "% 术式掉落率"],
    ["% Elementium drop rate", "% 元素源质掉落率"],
]);
// #region ChatTL
const ChatTranslation = new Map([
    ["Whispers ", "私信 "],
    ...[
        ["Whispers", "私信"],
        ["Global", "广播"],
        ["All", "所有"],
        ["General", "通用"],
        ["Trade", "交易"],
        ["Guild", "公会"],
        ["Help", "帮助"],
        ["Chinese", "中文"],
        ["Notifications", "通知"],
    ].flatMap(([key, value]) => [
        [key, value],
        [`[${key}]${key.toLowerCase()}`, `[${value}]`],
    ]),
    ["[W]whispers", "[私]"],
    ["[G]global", "[广]"],
    ["[A]all", "[全]"],
    ["[G]general", "[通]"],
    ["[T]trade", "[易]"],
    ["[G]guild", "[会]"],
    ["[H]help", "[助]"],
    ["[C]hinese", "中"],
    ["[N]notifications", "[通]"],
]);
// #region MenuItemTL
const MenuItemTranslation = new Map([
    ["Link", "链接到聊天"],
    ["View Profile", "查看资料页"],
    ["Wire", "给予物品"],
    ["Whisper", "私聊"],
    ["Ignore", "屏蔽"],
    ["Transfer", "赠送"],
    ["Orb of Divinity", "神圣球"],
    ["Borrow", "借出"],
    ["Enchant", "附魔"],
    ["Upgrade", "升级"],
    ["Favorite", "保护"],
    ["Sell", "出售"],
    ["Disenchant", "分解"],
    ["Donate to armory", "捐赠至装备库"],
    ["Unfavorite", "取消保护"],
    ["Contributions", "查看贡献"],
    ["Leave Guild", "离开公会"],
    ["Heirloom", "传承"],
]);
// #region MarketTL
const MarketTranslation = new Map([
    ["Your Sell Orders", "你的出售挂单"],
    ["Your Buy Orders", "你的收购挂单"],
    ["Equipment", "装备挂单"],
    ["Name", "物品名"],
    ["Price", "售价"],
    ["Boost", "加成"],
    ["Quality", "品质"],
    ["Seller", "出售人"],
    ["Total: ", "总计: "],
]);
// #region UpgradeTL
const UpgradeTranslation = new Map([
    ["Upgrading", "强化"],
    ["Upgrading ", "强化 "],
    ["Enchanting", "附魔"],
    ["Enchanting  ", "附魔 "],
    ["Infuse with ", "消耗 "], // upgrade
    [" increasing all modifiers by", " 注能，增加所有属性值"], // upgrade
    ["Chance to upgrade at least one boost:", "至少升级一条属性的概率:"],
    ["Reroll all modifiers. Including the skill on gathering items.", "随机改变所有属性。包括采集装备的采集种类。"],
    ["Upgrade epic item to legendary", "将物品升级至传说装备。"],
    ["Currently ", "当前 "],
    ["Max ", "最高可附魔 "],
    ["Increase ", "提升 "],
    [" times (+", " 级 (+"],
    [") for ", "), 消耗 "],
    ["Each action taken toward progressing your quest has a chance to grant extra credit.", "完成行动时，概率获得额外的任务进度。"],
    ["Increases the duration of potions.", "增加药水的持续时间。"],
    ["Increases stat drop amount and mastery gain.", "增加属性掉落和元素精通获取。"],
    ["Increases all base stats (intellect, stamina, focus, spirit, mana).", "提高全属性（智力、耐力、集中、精神、魔力）。"],
    ["Convert", "将"],
    ["into an heirloom.", "变为传承装备。"],
    ["Converting this item into an heirloom will scale the item to half its level but remove the level requirement.", "将这件装备变为传承装备以后，会使其属性值变为现在等级的一半，但是不再有等级限制。"],
    ["Upgrades all rolls to the highest roll already on the item", "将物品上所有词条的 roll 值变为该物品上已有的最高词条的 roll 值"],
]);
// #region ProfileTL
const ProfileTranslation = new Map([
    ["Guild:", "公会："],
    ["Activity: ", "当前活动："],
    ["battle", "战斗"],
    ["mining", "采矿"],
    ["fishing", "捕鱼"],
    ["woodcutting", "伐木"],
    ["Battle Level: ", "战斗等级："],
    ["Zone: ", "战斗区域："],
    ["blazing_core", "炙热核心"],
    ["worldshapers_domain", "创世领域"],
    ["maelstroms_eye", "风暴之眼"],
    ["Enemy: ", "交战敌人："],
    ["Mining Level: ", "采矿等级："],
    ["Fishing Level: ", "捕鱼等级："],
    ["Woodcutting Level:", "伐木等级："],
    ["Pet Levels gained: ","宠物总等级："],
    ["Statistics", "统计信息"],
    ["Base Stats", "基础属性值"],
    ["Elemental Mastery", "元素精通"],
    ["Enchanting Skills", "附魔等级"],
    ["Gathering Boosts", "采集加成"],
    ["Spells", "法术加成"],
    ["Codex Boosts", "法典加成"],
    ["Other Equipment Boosts", "其他装备加成"],
    ["Combat Skills", "战斗加成"],
    ["Farm", "农场"],
    ["Equipment", "装备"],
    ["Dungeons", "地牢"],
    ["Mage Tower", "巫师塔"]
]);
// #region PlacehlderTL
const PlaceholderTranslation = new Map([
    ["Player name", "玩家名称"],
    ["To player name", "要赠送的玩家名称"],
    ["Quantity", "数量"],
    ["Lookup player", "查询玩家"],
    ["Min", "最小值"],
    ["Max", "最大值"],
    ["Optional", "选填"],
    ["Donate", "捐赠数量"],
    ["Search text", "搜索文字"],
    ["Price", "价格"],
    ["Set name", "配装名称"],
    ["Search player...", "搜索玩家..."],
    ["Enter amount in €", "输入要支付的€"],
]);
if(!Settings.debug) [...Translation.values()].forEach(value => Translation.set(value, value));
// #region EquipTL
const EquipTranslation = new Map([
    // quality
    ["Worn", "破旧的"],
    ["Refined", "精制的"],
    ["Runed", "铭文的"],
    ["Ascended", "进阶的"],
    ["Eternal", "永恒的"],
    ["Heirloom", "传承的"],
    ["Mythical", "神话的"],
    // type
    ["Neophyte", "新手"],
    ["Initiate", "初始"],
    ["Novice", "见习"],
    ["Apprentice", "学徒"],
    ["Acolyte", "助手"],
    ["Adept", "熟手"],
    ["Scholar", "专家"],
    ["Magus", "术士"],
    ["Invoker", "祈求者"],
    ["Archmage", "大巫师"],
    ["Eldritch", "异界"],
    ["Primordial", "原初"],
    ["Celestial", "星辉"],
    ["Virtuous","至善"],
    ["Transcendent","超脱"],
    ["Zenith","巅峰"],
    ["Dominion","统御"],
    ["Archangel","大天使"],
    ["Lumberjack's", "伐木工"],
    ["Tidecaller's", "唤潮人"],
    ["Prospector's", "探矿者"],
    ["Thaumaturge", "奇术师"],
    ["Incantator", "唤魔者"],
    ["Disciple", "门徒"],
    ["Paragon", "贤者"],
    ["Elysian", "天界"],
    ["Daemon", "精灵"],
    ["Archon", "神使"],
    ["Divine", "神圣"],
    ["Cherubim", "智天使"],
    ["Seraphim", "炽天使"],
    ["Ophanim", "坐天使"],
    // part
    ["Staff", "法杖"],
    ["Hood", "兜帽"],
    ["Pendant", "项链"],
    ["Cloak", "斗篷"],
    ["Robes", "法袍"],
    ["Gloves", "手套"],
    ["Sandals", "鞋子"],
    ["Ring", "戒指"],
    [" of Water", "水"],
    [" of Fire", "火"],
    [" of Nature", "自然"],
    ["Helmet", "头盔"],
    ["Pickaxe", "镐子"],
    ["Axe", "斧头"],
    ["Rod", "鱼竿"],
    ["Jacket", "夹克"],
    ["Cape", "披风"],
    ["Boots", "靴子"],
    ["Hat", "帽子"],
    ["Tunic", "外衣"],
    // Sigil
    ["Growth", "成长"],
    ["Purpose", "目标"],
    ["Distillation", "蒸馏"],
    ["Vitality", "活性"],
    ["Sigil", "魔符"],
]);
// #region HelpTL
const SystemMsgTranslation = new Map([
    ["A Rift of Power has opened!", "力量裂隙事件开启！"],
    ["/help Display this message", "/help 显示此帮助信息"],
    ["/transferguild <name> Transfer guild ownership", "/transferguild <玩家名> 转移公会所有权"],
    ["/guildmotd <motd> Set guild message of the day.", "/guildmotd <消息> 设置公会每日消息。"],
    ["/leave <channel> Leave a chat channel", "/leave <频道名> 离开指定的聊天频道"],
    ["/join <channel> Join a chat channel", "/join <频道名> 加入指定的聊天频道，可任意指定频道名称"],
    ["/ignored Lists ignored players", "/ignored 显示屏蔽名单"],
    ["/unignore <name> Unignore player", "/unignore <玩家名> 取消屏蔽指定玩家"],
    ["/ignore <name> Ignore player", "/ignore <玩家名> 屏蔽指定玩家"],
    ["/profile <name> Navigate to player profile", "/profile <玩家名> 跳转至指定玩家的资料页"],
    ["/afk <message> Set auto reply message. Empty message to clear. Alias /autoreply", "/afk <自动回复消息> 设置离线自动回复消息。设置为空以取消此功能。相同效果指令：/autoreply"],
    ["/wire <name> <amount> <mana|dust|shards|codex|...> Transfer items to player. Alias /transfer", "/wire <玩家名> <数量> <mana|dust|shards|codex|...> 输送指定数量的指定物品至指定玩家。相同效果指令：/transfer"],
    ["/w <name> <msg> Send a private message. Alias /whisper, /tell, /msg", "/w <玩家名> <消息> 发送私信。相同效果指令：/whisper, /tell, /msg"],
    ["/event Display next elemental rift time and previous event stats", "/event 显示下一次元素裂隙事件的开始时间以及上一次事件的数据"],
    ["You already have an open order for this item.", "你已经有一个此物品的交易挂单了。"],
    ["You have recently cancelled an order for this item and must wait 10 minutes before creating new orders less than 1% above the best price.", "你在不久前取消了一个此物品的挂单，因此如果你新创建的挂单价格小于当前最高买价的 101%，将有 10 分钟的挂单冷却时间。"],
    ["You have recently cancelled an order for this item and must wait 10 minutes before creating new orders less than 1% under the best price.", "你在不久前取消了一个此物品的挂单，因此如果你新创建的挂单价格大于当前最低卖价的 99%，将有 10 分钟的挂单冷却时间。"],
    ["Player not found.", "未找到玩家。"],
    ["Already equipped", "已经装备"],
    ["Potion belt is full.", "药水腰带容量已满。"],
    ["No items match filter", "没有符合条件的物品。"],
    ["Next Elemental Rift is now!", "元素裂隙事件进行中！"],
    ["The Elemental Rift is opening in 5 minutes!", "元素裂隙还有 5 分钟开始！"],
    ["You automatically stopped siphoning the Rift of Power due to your QoL settings.", "根据你的便利升级（QoL）设置，已自动停止汲取力量裂隙。"],
    ["Your current dungeon objective was cleared!", "你的当前地牢障碍物已清除！"],
]);
// #region DialogTL
const DialogTranslation = new Map([
    ["Transfer item to", "将物品送给其他玩家"],
    ["Borrow item to", "将物品借给其他玩家"],
    ["Enchant item", "附魔物品"],
    ["Currently ", "当前值 "],
    ["Max ", "最大值 "],
    ["Increase ", "提升 "],
    [" times (+", " 级 ( +"],
    [") for ", ")，消耗 "],
    ["Upgrade potions", "提升药水等级"],
    ["Upgrading these potions by 1 tier will cost", "将这些药水提升 1 级将消耗"],
    ["Are you sure", "你确定吗"],
    ["Create equipment set", "新建配装"],
    ["Confirm upgrade", "确认升级"],
    ["Discard potions", "丢弃药水"],
    ["Leave Event Queue", "取消准备"],
    ["Are you sure you want to leave the event queue?", "确定要取消准备吗？"],
    ["Total Contributions", "所有贡献"],
    ["Purchase item", "购买物品"],
    ["Confirm guild upgrade", "确认公会升级"],
]);
//#region ToastTL
const ToastTranslation = new Map([
    ["You already have an open order for this item.", "你已经有一个此物品的交易挂单了。"],
    ["You have recently cancelled an order for this item and must wait 10 minutes before creating new orders less than 1% above the best price.", "你在不久前取消了一个此物品的挂单，因此如果你新创建的挂单价格小于当前最高买价的 101%，将有 10 分钟的挂单冷却时间。"],
    ["You have recently cancelled an order for this item and must wait 10 minutes before creating new orders less than 1% under the best price.", "你在不久前取消了一个此物品的挂单，因此如果你新创建的挂单价格大于当前最低卖价的 99%，将有 10 分钟的挂单冷却时间。"],
    ["Player not found.", "未找到玩家。"],
    ["Already equipped", "已经装备"],
    ["Potion belt is full.", "药水腰带容量已满。"],
    ["No items match filter", "没有符合条件的物品。"],
    ["Next Elemental Rift is now!", "元素裂隙事件进行中！"],
    ["The Elemental Rift is opening in 5 minutes!", "元素裂隙还有 5 分钟开始！"],

    ["Farm is not ready to collect", "农场现在还无法采摘"],
    ["You don't have enough herbs", "你没有足够的草药"],
]);
// #region ElementalRif
const ElementalRiftTranslation = new Map([
    ["Name", "玩家名"],
    ["Actions", "行动数"],
    ["Damage", "造成伤害"],
    ["Resources", "采集资源"],
    ["Next Elemental Rift at ", "下一次元素裂隙时间为 "],
    [" bosses were defeated in the last event.", " 个 boss。"],
    ["Resources contributed", "贡献的资源"],
    ["Event Points", "事件点数"],
    ["Previous", "上一页"],
    ["Next", "下一页"],
    ["Page ", "第 "],
    [" of", " /"],
]);
// #region ElnaethTL
const ElnaethTranslation = new Map([
    ["Battle Experience Boost", "经验"],
    ["Mana Dust Boost", Settings.manaDustName],
    ["Elemental Shard Boost", "元素碎片"],
    ["Stat drop", "属性点掉率"],
    ["Base Resource Amount", "资源"],
]);
//#region PremiumTL
const PremiumShopTranslation = new Map([
    ["Premium Shop", "高级商店"],
    ["Ascension", "晋升"],
    ["All purchases also give Ascension Points on top of the", "所有购买在获得的"],
    [" received", " 之上还会给予晋升点数"],
    ["Purchase ", "消费获得 "],
    [" per 1€. Min 5€.", " 每€。最低消费 5€。"],
    [" Codex and", " 法典和"],
    [" Crystallized Mana for ", " 魔力结晶，支付 "],
    ["Don't broadcast purchase in chat", "不要在聊天中广播支付消息"],
    ["Next title: ", "下一头衔："],
    [" Ascension Points)", " 晋升点数)"],
    ["Unlock for ", "解锁消耗 "],
    [" and 1 ", " 和 1 "], // premium
    ["Quality of Life", "便利升级"], // premium
    ["Automates some things for 5", "提供一些自动化功能，费用 5"], // premium
    [" per 30 days. Configuration options available in", " 每月。配置选项请前往"], // premium
    ["settings", "设置"], // premium
    ["Automatically Join Events", "自动参加事件"], // premium
    ["Use enchanting skills of guild members", "使用公会成员的附魔能力"], // premium
    ["Auto collect farm", "自动收获农场"],
    ["Double dungeon queue size", "双倍地下城队列大小"],
    ["Username Change", "更改用户名"],
    ["I agree to immediate digital delivery and waive my 14-day withdrawal right.", "我同意立即进行支付并放弃我的 14 天退款权利。"],
]);
// #region PetsTL
const PetsTranslation = new Map([
    ["Active Pets", "激活宠物"],
    ["Your Inactive Pets", "未激活宠物"],
    ["Eggs", "蛋"],
    ["You have", "你有"],
    ["Level", "等级"],
    ["Unlock pet for", "解锁宠物需要"],
    ["pet bonus experience", "宠物加成经验"],
 
    ["Resurrect", "复活"],
    ["Resistance", "元素抗性"],
    ["Regeneration", "再生"],
    ["Versatility", "小火苗"],
    ["Egg Drop", "鸡哥"],
    ["Foraging", "大猩猩"],
    ["Immunity", "免疫"],
    ["Damage", "伤害"],
    ["Curse", "诅咒"],
    ["Poison", "毒性"],
    ["Focus", "集中"],
    ["Ward", "抗性"],
    ["Haste", "技能急速"],
    ["Colony", "蜂巢"],
    ["Mining", "采矿"],
    ["Fishing", "捕鱼"],
    ["Woodcutting", "伐木"],
    ["Pet bonus xp", "蘑菇头"],
    ["Multistat", "多重属性"],
    ["Dungeon Idle", "地牢之猫"],
 
    ["Combat", "战斗"],
    ["Gathering", "采集"],
    ["Utility", "辅助"],
    ["Base Experience", "基础经验"],
    ["Base Mana Dust", `基础${Settings.manaDustName}`],
    ["Mana Dust", Settings.manaDustName],
    ["bonus experience", "加成经验"],
    ["Magical Accounting", "魔法账簿"],
    ["while fishing", "捕鱼时"],
    ["while mining", "采矿时"],
    ["while woodcutting", "伐木时"],
    ["multiplicatively", "乘法加成"],
    ["chance to find", "概率发现"],
    ["random resource drop", "随机资源掉落"],
    ["Chance to drop", "概率掉落"],
    ["from normal actions", "从普通行动"],
    ["other active pets", "其他激活宠物"],
    ["idle dungeon progress", "地牢挂机进度"],
    ["chance per tick", "每次时钟周期概率"],
    ["Pet Egg:", "蛋:"],
    ["Pet Egg", "蛋"],
    ["Egg:", "蛋:"],
    ["Egg", "蛋"],
]);
const petDescriptionRules = [
    [/After taking fatal damage restore your health to full (\d+) times per battle/, "受到致命伤害后，每场战斗恢复满血 $1 次"],
    [/Increases resistance against all elements by ([\d.]+)%/, "增加对所有元素的抗性 $1%"],
    [/After enemy attacks restore (\d+)% health and mana\. This effect diminishes to 0% over (\d+) rounds/, "敌人攻击后恢复 $1% 生命值和魔力。此效果在 $2 回合内逐渐减弱至 0%"],
    [/\+(\d+)% Base Experience while fishing/, "捕鱼时 +$1% 基础经验"],
    [/Also gain ([\d.]+)% of gathering experience in your other gathering skills\./, "在其他采集技能中也获得 $1% 的采集经验"],
    [/([\d.]+)% Chance to drop eggs from normal actions/, "普通行动 $1% 概率掉落蛋"],
    [/(\d+)% chance to find a random resource drop/, "$1% 概率发现随机资源掉落"],
    [/\+(\d+)% Base Mana Dust/, `+$1% 基础${Settings.manaDustName}`],
    [/Nullify the first (\d+) enemy attacks/, "无效化敌人前 $1 次攻击"],
    [/Increases damage done by ([\d.]+)% \(multiplicatively\)/, "增加 $1% 伤害（乘法加成）"],
    [/After start of combat consume all your mana to reduce enemy health to ([\d.]+)%/, "战斗开始时消耗所有魔力，将敌人生命值降至 $1%"],
    [/After enemy attacks deal ([\d.]+)% of their current health as poison damage/, "敌人攻击后造成其当前生命值 $1% 的毒性伤害"],
    [/Increases focus by ([\d.]+)% \(multiplicatively\)/, "增加 $1% 集中（乘法加成）"],
    [/Increases ward by ([\d.]+)% \(multiplicatively\)/, "增加 $1% 抗性（乘法加成）"],
    [/Increases haste by ([\d.]+)% \(multiplicatively\)/, "增加 $1% 技能急速（乘法加成）"],
    [/\+(\d+)% Magical Accounting/, "+$1% 魔法账簿"],
    [/\+(\d+)% Base Experience while mining/, "采矿时 +$1% 基础经验"],
    [/\+(\d+)% Base Experience while woodcutting/, "伐木时 +$1% 基础经验"],
    [/\+(\d+)% pet bonus experience to other active pets/, "为其他激活宠物 +$1% pet bonus experience"],
    [/\+(\d+)% Multistat/, "+$1% 多重属性"],
    [/\+(\d+)% chance per tick at extra idle dungeon progress/, "每次行动 +$1% 概率获得额外地牢挂机进度"],
];
// #region DungeonsTL
const DungeonsTranslation = new Map([
    ["Dungeons", "地牢"],
    ["completed", "已完成"],
    ["Current Boost: ", "当前加成："],
    ["Upgrade:", "升级："],
    ["Increase", "提升"],
    ["times", "级"],
    ["for", "，消耗"],
    ["Max", "最大"],
    ["Confirm", "确定"],
    ["Reset", "重置"],
    ["Unlock Dungeons", "解锁地牢"],
    ["Dungeon Points", "地牢点数"],
    ["Idle Dungeon Progress", "地牢挂机进度"],
    ["Idle Size", "挂机规模"],
    ["hours", "小时"],
    ["minutes", "分钟"],
    ["until finished", "后完成"],
    ["View Loot","查看掉落"],
    ["None", "无"],
    ["Small", "小型地牢"],
    ["Medium", "中型地牢"],
    ["Large", "大型地牢"],
    ["Play Manual Mode", "手动模式"],
    ["Auto buy dungeons", "自动购买地牢"],
    ["Speedrun Mode", "速通模式"],
    ["No treasures/completion count. Only times are recorded.", "不计算宝藏/完成次数。只记录时间。"],
    ["Max buys the Unlock Dungeons upgrade when starting a run", "开始时自动购买解锁地牢升级"],
    ["Dungeon Point Upgrades", "地牢点数升级"],
    ["points", "点数"],
    ["Idle Progress Speed", "挂机进度速度"],
    ["Decreases the duration to auto complete a dungeon by 0.833%", "使自动完成地牢的时间减少 0.833%"],
    ["Treasure", "宝藏"],
    ["Increases the amount of treasure found by 1%", "使发现的宝藏数量增加 1%"],
    ["Dungeon Queue", "地牢队列"],
    ["Increases the amount of dungeons you can unlock for auto completion.", "增加可以解锁用于自动完成的地牢数量。"],
    ["Swiftness", "迅捷"],
    ["Increased movement speed in dungeons.", "增加在地牢中的移动速度。"],
    ["Perception", "感知"],
    ["Increases view distance in dungeons.", "增加在地牢中的视野距离。"],
    ["view distance", "视野距离"],
    ["Auto Loot", "自动拾取"],
    ["Automatically open chests in dungeons when entering the room.", "进入房间时自动打开地牢中的宝箱。"],
    ["Yes", "是"],
    ["No", "否"],
    ["Sniffles", "嗅嗅"],
    ["View Loot", "查看战利品"],
    ["Increase ", "提升 "],
    [" times (", " 级 ("],
    [") for ", ")，消耗 "],
    ["Idle Dungeon Progress ", "地牢挂机进度 "],
    [" until finished)", " 后完成)"],
]);
// #region TowerTL
const TowerTranslation = new Map([
    ["Mage Tower", "巫师塔"],
    ["You have ", "你拥有 "],
    ["Build Queue", "建造队列"],
    ["Workshop", "工匠坊"],
    ["Planning Office", "规划大厅"],
    ["Spire", "魔能尖塔"],
    ["Expedition Hall", "远征殿堂"],
    ["Menagerie", "奇兽苑"],
    ["Laboratory", "炼金室"],
    ["Library", "智识之库"],
    ["Training Grounds", "试炼场"],
    ["Meditation Sanctum", "冥想圣所"],
    ["Leyline Tap", "魔网节点"],
    ["Moonwell", "月亮井"],
    ["Dust Collector", "尘加成器"],
    ["Jeweler's Bench","珠宝工坊"],
    [" by ", " "],
    ["Increases Construction boost", "提升建筑速度加成"],
    ["Increases build queue", "提升建造队列"],
    ["Increases elemental shard based boosts (multicast, mining, ...) on equipment", "提升装备上基于元素碎片的加成效果（如多重施法、采矿...）"],
    ["Increases your effectiveness in guild dungeons", "提升你在公会地下城中的效能"],
    ["Increases Pet Bonus XP", "提升宠物经验加成"],
    ["Increases Potion Duration", "提升药水持续时间"],
    ["Increases Intellect stat drop amount", "提升智力属性掉落量"],
    ["Increases Stamina stat drop amount", "提升耐力属性掉落量"],
    ["Increases Focus stat drop amount", "提升专注属性掉落量"],
    ["Increases Spirit stat drop amount", "提升精神属性掉落量"],
    ["Increases Mana stat drop amount", "提升魔力属性掉落量"],
    ["Increases Mana Dust collected", "提升收集的魔力粉尘量"],
    ["Increases Jewelcrafting Skill", "提升珠宝制作技能"],
    ["Speed ", "速度 "],
    ["Build Speed: ", "建造速度："],
    ["Upgrades ", "建筑升级 "],
    ["Upgrades", "建筑升级"],
    [" Queued", " 队列中"],
    ["You can adjust build speed, but material costs will also scale at the same rate", "你可以调整建造速度，但材料消耗也会以相同的比例增加"],
]);

const equipRegex = /(?<lbracket>\[?)(?:(?:Sigil of (?<sigilType>[A-Za-z]+))|(?:(?<gemName>[A-Za-z\s]+) \(?(?<gemStats>[A-Z]\/[A-Z]\/[A-Z])\)?)|(?<quality>Worn|Refined|Runed|Ascended|Eternal|Heirloom|Mythical) (?:(?<type>[A-Za-z']+) )?(?<part>[A-Za-z]+)(?<elementType> of Water| of Fire| of Nature)?(?<upgradeLevel> \+[0-9]+)?(?:\s*\((?<level>[0-9]+)\))?)(?<rbracket>\]?)/;

const EquipTextTranslate = (text) => {
    const result = equipRegex.exec(text);
    if (!result) {
        // 如果开启了调试模式才打印，减少正常使用的干扰
        if (Settings.debug) console.log(`equipRegex failed to match: 【${text}】`);
        return "";
    }
 
    const group = result.groups;
    if (!group) return "";
 
    // 分支 A：处理魔符 (Sigils)
    if (group.sigilType) {
        const tl = EquipTranslation.get(group.sigilType) || group.sigilType;
        return `${group.lbracket || ""}${tl}魔符${group.rbracket || ""}`;
    } 
    
    // 分支 B：处理宝石 (Gems) - 这是新加的逻辑
    else if (group.gemName) {
        const nameParts = group.gemName.trim().split(/\s+/);
        // 对宝石名及其形容词逐词翻译（Discordant, Faint, Ruby...）
        const translatedName = nameParts.map(word => {
            return Translation.get(word) || word;
        }).join('');
        
        // 保持原来的括号和层级格式
        return `${group.lbracket || ""}${translatedName} (${group.gemStats})${group.rbracket || ""}`;
    } 
    
    // 分支 C：处理普通装备 (Equipment)
    else {
        const validParts = new Set([
            "Staff", "Hood", "Pendant", "Cloak", "Robes", "Gloves", "Sandals", "Ring",
            "Helmet", "Pickaxe", "Axe", "Rod", "Jacket", "Cape", "Boots", "Hat", "Tunic"
        ]);

        if (group.part && !validParts.has(group.part)) {
            // 传承装备 (Heirloom) 特殊处理
            const equipRegex2 = /(?<lbracket>\[?)(?:Sigil of (?<sigilType>[A-Za-z]+))|(?:(?<quality>Worn|Refined|Runed|Ascended|Eternal|Heirloom|Mythical) (?<part>[A-Za-z]+)(?<elementType> of Water| of Fire| of Nature)?(?<upgradeLevel> \+[0-9]+)?(?:\s*\((?<level>[0-9]+)\))?(?<rbracket>\]?))/;
            const result2 = equipRegex2.exec(text);
            if (result2 && result2.groups) {
                const g2 = result2.groups;
                const quality = EquipTranslation.get(g2.quality) ?? g2.quality;
                const part2 = EquipTranslation.get(g2.part) ?? g2.part;
                const elementType = g2.elementType ? (EquipTranslation.get(g2.elementType.trim()) || g2.elementType) : "";
                const level = g2.level ? ` (${g2.level})` : "";
                return `${g2.lbracket ?? ""}${quality}${elementType}${part2}${g2.upgradeLevel ?? ""}${level}${g2.rbracket ?? ""}`;
            }
        }

        // 正常装备翻译
        const quality = EquipTranslation.get(group.quality) ?? group.quality;
        const type = group.type ? (EquipTranslation.get(group.type.trim()) ?? group.type) : "";
        const part = EquipTranslation.get(group.part) ?? group.part;
        const elementType = group.elementType ? (EquipTranslation.get(group.elementType.trim()) ?? group.elementType) : "";
        const level = group.level ? ` (${group.level})` : "";
        
        return `${group.lbracket ?? ""}${quality}${type}${elementType}${part}${group.upgradeLevel ?? ""}${level}${group.rbracket ?? ""}`;
    }
};
const EquipTranslate = (ele) => {
    if (!ele || !ele.textContent) {
        console.log("EquipTranslate called with invalid element:", ele);
        return;
    }
    const tl = EquipTextTranslate(ele.textContent);
    if(tl) ele.textContent = tl;
    // else console.log("could not translate item: ", ele.textContent);
}
const ImportInventory = () => {
    manarion.inventory.items.filter(item => item.Rarity === 5).forEach(({ ID, Name, Boosts, Level }) => {
        const name = EquipTextTranslate(Name);
        const details = Object.fromEntries(Boosts.map(([id, value]) => [BoostID2CN.get(id), value]).filter(([id, value]) => id));
        details.level = Level;
        _AvailEquip.set(name, details);
    })
};
const researchSelector = ["-content-mana-dust", "-content-combat-skills", "-content-enchants", "-content-gathering", "-content-codex"].map(id => `div[data-state="active"][id$="${id.replaceAll(":", "\\:")}"]:not([data-state="translated"])`).join(",");
const _FailedTranslate = new Set();
// #region __TypedTL
const __TypedTranslation = new Map([
    ["equipment", EquipTranslation],
    ["settings", SettingsTranslation],
    ["farm", FarmTranslation],
    ["guild", GuildTranslation],
    ["chat", ChatTranslation],
    ["market", MarketTranslation],
    ["menuitem", MenuItemTranslation],
    ["upgrade", UpgradeTranslation],
    ["profile", ProfileTranslation],
    ["help", SystemMsgTranslation],
    ["dialog", DialogTranslation],
    ["elementalRift", ElementalRiftTranslation],
    ["premium", PremiumShopTranslation],
    ["toast", ToastTranslation],
    ["default", Translation],
    ["pets", PetsTranslation],
    ["dungeons", DungeonsTranslation],
    ["tower", TowerTranslation],
]);

const translateLeafTextNodes = (rootNode, type = "default") => {
    rootNode.childNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent.trim();
            if (text) {
                // 将 type 传给 _Translate
                _Translate(node, type); 
            }
        } else if (node.nodeType === Node.ELEMENT_NODE) {
            translateLeafTextNodes(node, type);
        }
    });
};

//#region _Translate()
const _Translate = (ele, type = "default", keepOriginalText = false) => {
    if(ele?.nodeType !== Node.TEXT_NODE && (!ele || !ele.textContent || [...ele.childNodes].filter(node => node.nodeType !== Node.TEXT_NODE).length > 0)){
        // console.log("_Translate() return early");
        return;
    }
    
    if(ele.nodeType !== Node.TEXT_NODE && ele.childNodes.length > 1){
        console.log("_Translate() replace multiple childNodes", ele.outerHTML);
    }
    const text = ele.textContent;
    const trimmedText = text.trim();

    // 1.单字符
    if (trimmedText.length <= 1) {
        return true;
    }

    // 2. 增强型数字与单位过滤
    // 匹配规则：[可选正负号][数字][可选小数点及小数][可选单位 K/M/B/T/Q/S/%]
    // 能够匹配：10, -5, +1.5, 2.00M, 10B, 100T, 1.2Q, 50%, +15% 等
    if (/^[+-]?\d+(\.\d+)?([KMTBQS%])?$/i.test(trimmedText)) {
        return true;
    }

    // 3. 过滤纯等级/品质缩写 (如 SS, SR, SSR) 
    // 如果字典里没定义这些，就直接跳过不报错
    if (/^[A-Z]{2,3}$/.test(trimmedText) && !Translation.has(trimmedText)) {
        return true;
    }
    
    // 4. 过滤常见的纯符号组合 (如 ->, =>, >>, ---)
    if (/^[^a-zA-Z0-9\u4e00-\u9fa5]+$/.test(trimmedText)) {
        return true;
    }
 
    const translation = __TypedTranslation.get(type) ?? Translation;
    ele.textContent = (translation.get(text) ?? (console.log("未翻译", type, text), (Settings.debug && !keepOriginalText) ? "未翻译" : text));
    if(!keepOriginalText && (ele.textContent === "未翻译" || ele.textContent === text)){
        _FailedTranslate.add(JSON.stringify({
            type: type,
            text: text,
        }));
        return false;
    }
    else return true;
};

const _TypedTranslate = (type, keepOriginalText = false) => {
    return (ele) => _Translate(ele, type, keepOriginalText);
};
unsafeWindow.ExportFailedTranslate = (comment = true) => {
    console.log([..._FailedTranslate.keys()].map(json => {
        const data = JSON.parse(json);
        return `    ["${data.text}", ""],${comment ? ` // ${data.type}` : ""}`;
    }).join("\n"));
};
const CheckTranslation = (scope, selector, callback, doNotRetrigger = true) => {
    if(!scope || !scope instanceof Element){
        return;
    }
    scope.querySelectorAll(`${scope === document ? "" : ":scope "}${selector}:not([translated])`).forEach(ele => {
        callback(ele);
        if(doNotRetrigger) ele.setAttribute("translated", "");
    });
};
// #region LogTranslator
function preprocessNodes(nodes) {
  let str = "";
  const originalLength = nodes.length;
  let newIndex = 0;
  const spanIndices = [];
 
  // First pass: collapse text before/after elements
  for (let i = 0; i < originalLength; i++) {
    const node = nodes[i];
 
    if (node.nodeType === Node.TEXT_NODE) {
      str += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      spanIndices.push(i); // ✅ track index of element
 
      // If there's accumulated text, write it to the current newIndex
      while (newIndex < originalLength && nodes[newIndex].nodeType !== Node.TEXT_NODE) {
        newIndex++;
      }
 
      if (newIndex < originalLength) {
        nodes[newIndex].textContent = str;
        str = "";
        newIndex++;
      }
 
      // Skip to next available non-element slot to keep element where it is
      while (newIndex < originalLength && nodes[newIndex].nodeType === Node.TEXT_NODE) {
        nodes[newIndex].textContent = "";
        newIndex++;
      }
    }
  }
 
  // After last element: write remaining text
  while (newIndex < originalLength && nodes[newIndex].nodeType !== Node.TEXT_NODE) {
    newIndex++;
  }
 
  if (newIndex < originalLength) {
    nodes[newIndex].textContent = str;
    str = "";
    newIndex++;
  }
 
  // Clear any remaining text nodes
  while (newIndex < originalLength) {
    if (nodes[newIndex].nodeType === Node.TEXT_NODE) {
      nodes[newIndex].textContent = "";
    }
    newIndex++;
  }
 
  return spanIndices;
}
 
const LogTranslator = (channelType, nodes) => {
    // console.log("正在处理日志:", channelType, nodes);
    if (nodes.length === 0) return;
    if (nodes.length === 1 && nodes[0].nodeType === Node.ELEMENT_NODE) {
        nodes = [...nodes[0].childNodes];
    }
    let result;
    let spanInd = preprocessNodes(nodes);
    const text = nodes.map(node => node.textContent).join("");
 
    switch(channelType){
        case "ActivityLog":{
            if(result = /Your ([^ ]+) level is now ([0-9]+)\./.exec(text)){
                nodes[0].textContent = `你的${Translation.get(result[1]) ?? result[1]}等级到达 ${result[2]}`;
            }
            else if(result = /You whispered ([^:]+): (.*)/.exec(text)){
                nodes[0].textContent = `你对 ${result[1]} 说：${result[2]}`;
            }
            else if(result = /([^ ]+) whispered you: (.*)/.exec(text)){
                nodes[0].textContent = `${result[1]} 对你说：${result[2]}`;
            }
            else if(result = /([^ ]+) sent you ([^ ]+ )?\[([^\]]+)\]/.exec(text)){
                nodes[0].textContent = `${result[1]} 送给你 ${result[2]??""}`;
                nodes[spanInd[0]+1].textContent = "。";
            }
            else if(result = /([^ ]+) borrowed you \[([^\]]+)\]/.exec(text)){
                nodes[0].textContent = `${result[1]} 借给你 `;
                nodes[spanInd[0]+1].textContent = "。";
            }
            else if(result = /([^ ]+) returned \[([^\]]+)\] to you/.exec(text)){
                nodes[0].textContent = `${result[1]} 还给你 `;
                nodes[spanInd[0]+1].textContent = "。";
            }
            else if(result = /You sent ([^ ]+ )?\[([^\]]+)\] to ([^\.]+)\./.exec(text)){
                nodes[0].textContent = `你送给 ${result[3]} ${result[1]??""}`;
                nodes[spanInd[0]+1].textContent = "。";
            }
            else if(result = /You borrowed \[([^\]]+)\] to ([^\.]+)\./.exec(text)){
                nodes[0].textContent = `你借给 ${result[2]} `;
                nodes[spanInd[0]+1].textContent = "。";
            }
            else if(result = /You returned \[([^\]]+)\] to ([^\.]+)\./.exec(text)){
                nodes[0].textContent = `你还给 ${result[2]} `;
                nodes[spanInd[0]+1].textContent = "。";
            }
            else if(result = /Edited (sell|buy) order for ([^ ]+) -> ([^ ]+) \[([^\]])+\] for ([^ ]+) each/.exec(text)){
                nodes[0].textContent = `编辑挂单：${{"sell":"出售","buy":"购买"}[result[1]]} ${result[2]} 🡢 ${result[3]} `;
                nodes[spanInd[0]+1].textContent = `，单价 ${result[5]}。`;
            }
            else if(result = /Edited sell order for \[([^\]])+\] ([^ ]+) -> (.*)/.exec(text)){
                nodes[0].textContent = `编辑挂单：`;
                nodes[spanInd[0]+1].textContent = ` ${result[2]} 🡢 ${result[3]}`;
            }
            else if(result = /Created (sell|buy) order for ([^ ]+ )?\[([^\]])+\] for ([^ ]+) each/.exec(text)){
 
                nodes[0].textContent = `创建挂单：${{"sell":"出售","buy":"购买"}[result[1]]} ${result[2] ?? ""}`;
                nodes[spanInd[0]+1].textContent = result[5] ? `，单价 ${result[4]}。` : `，价格 ${result[4]}`;
            }
            else if(result = /Created (sell|buy) order for ([^ ]+ )?\[([^\]])+\] for ([^ ]+)/.exec(text)){
                nodes[0].textContent = `创建挂单：${{"sell":"出售","buy":"购买"}[result[1]]} ${result[2] ?? ""}`;
                nodes[spanInd[0]+1].textContent = result[5] ? `，单价 ${result[4]}。` : `，价格 ${result[4]}`;
            }
            else if(result = /Cancelled (sell|buy) order for ([^ ]+) \[([^\]])+\] for ([^ ]+) each/.exec(text)){
                nodes[0].textContent = `取消挂单：${{"sell":"出售","buy":"购买"}[result[1]]} ${result[2]} `;
                nodes[spanInd[0]+1].textContent = `，单价 ${result[4]}。`;
            }
            else if(result = /Cancelled sell order for \[([^\]])+\]/.exec(text)){
                nodes[0].textContent = `取消出售 `;
            }
            else if(result = /Bought \[([^\]]+)\] from ([^ ]+) for ([^ ]+)/.exec(text)){
                nodes[0].textContent = `从 ${result[2]} 处购买 `;
                nodes[spanInd[0]+1].textContent = `，花费 ${result[3]} `;
            }
            else if(result = /Sold \[([^\]]+)\] to ([^ ]+) for ([^ ]+)/.exec(text)){
                nodes[0].textContent = `将 `;
                nodes[spanInd[0]+1].textContent = ` 卖给 ${result[2]}，获得 ${result[3]} `;
            }
            else if(result = /You bought ([^ ]+) \[([^\]]+)\] for ([^ ]+) \(([^ ]+) each\)/.exec(text)){
                nodes[0].textContent = `以 ${result[4]} 单价购买 ${result[1]} `;
                nodes[spanInd[0]+1].textContent = `，花费 ${result[3]} ${Settings.manaDustName}。`;
            }
            else if(result = /You sold ([^ ]+) \[([^\]]+)\] for ([^ ]+) \(([^ ]+) each\)/.exec(text)){
 
                nodes[0].textContent = `以 ${result[4]} 单价售出 ${result[1]} `;
                nodes[spanInd[0]+1].textContent = `，获得 ${result[3]} ${Settings.manaDustName}。`;
            }
            else if(result = /You have earned ([^ ]+) event points\. ([^ ]+) bosses were defeated in the Elemental Rift/.exec(text)){
                nodes[0].textContent = `你获得了 ${result[1]} 事件点数。此次元素裂隙事件共有 ${result[2]} 只 boss 被击败！`
            }
            else if(result = /Your \[([^\]]+)\] has increased in power \(([^\)]+)\)/.exec(text)){
                nodes[0].textContent = `你的 `;
                const boosts = result[2].split(", ").map(boost => {
                    console.log(boost);
                    const result = /([^ ]+) (.*)/.exec(boost);
                    return `${result[1]} ${Translation.get(result[2]) ?? result[2]}`;
                }).join("，");
                nodes[spanInd[0]+1].textContent = ` 增强了力量（${boosts}）。`;
            }
            else console.log(`cannot translate|括号内是文本（${text}）|(Activity Log)`);
            break;
        }
        //#region Guild↑ActLog
        case "guild":{
            if(result = /([^ ]+) deposited \[[^\]]+\] into the armory\./.exec(text)){
                nodes[0].textContent = `${result[1]} 将 `;
                nodes[spanInd[0]+1].textContent = ` 捐赠至装备库。`;
            }
            else if(result = /([^ ]+) withdrew \[[^\]]+\] from the armory\./.exec(text)){
                nodes[0].textContent = `${result[1]} 将 `;
                nodes[spanInd[0]+1].textContent = ` 从装备库中取出。`;
            }
            else if(result = /([^ ]+) returned \[[^\]]+\] to the armory\./.exec(text)){
                nodes[0].textContent = `${result[1]} 将 `;
                nodes[spanInd[0]+1].textContent = ` 返还至装备库。`;
            }
            else if(result = /([^ ]+) borrowed \[[^\]]+\] from the armory\./.exec(text)){
                nodes[0].textContent = `${result[1]} 将 `;
                nodes[spanInd[0]+1].textContent = ` 借出装备库。`;
            }
            else if(result = /([^ ]+) revoked \[[^\]]+\] from ([^\.]+)/.exec(text)){
                nodes[0].textContent = `${result[1]} 将 `;
                nodes[spanInd[0]+1].textContent = ` 从 ${result[2]} 处收回。`;
            }
            else if(result = /([^ ]+) received ([0-9]+) extra \[[^\]]+\] for the guild while completing their quest!/.exec(text)){
                nodes[0].textContent = `${result[1]} 完成任务后，为公会额外获得了 ${result[2]} 本 `;
                nodes[spanInd[0]+1].textContent = `！`;
            }
            else if(result = /([^ ]+) has upgraded the (.*?) to level \d+/.exec(text)){
                const upgradeNameEN = result[2].trim();
                const upgradeNameCN = Translation.get(upgradeNameEN);
 
                if (upgradeNameCN === undefined) {
                    console.log(`[汉化脚本-Debug] 发现未翻译的公会升级项: "${upgradeNameEN}"`);
                    nodes[0].textContent = `${result[1]} 升级了「${upgradeNameEN}」`;
                } else {
                    nodes[0].textContent = `${result[1]} 升级了「${upgradeNameCN}」`;
                }
            }
            else if(result = /([^ ]+) has marked the (.*) as the next upgrade/.exec(text)){
                const markedUpgradeEN = result[2].trim();
                const markedUpgradeCN = Translation.get(markedUpgradeEN);
 
                if (markedUpgradeCN === undefined) {
                    console.log(`[汉化脚本-Debug] 发现未翻译的公会标记升级项: "${markedUpgradeEN}"`);
                    nodes[0].textContent = `${result[1]} 将「${markedUpgradeEN}」标记为下个升级。`;
                } else {
                    nodes[0].textContent = `${result[1]} 将「${markedUpgradeCN}」标记为下个升级。`;
                }
            }
            else if(result = /([^ ]+) has joined the guild!/.exec(text)){
                nodes[0].textContent = `${result[1]} 加入了公会！`;
            }
            else if(result = /([^ ]+) has kicked ([^ ]+) from the guild!/.exec(text)){
                nodes[0].textContent = `${result[1]} 将 ${result[2]} 踢出了公会！`;
            }
            else if(result = /([^ ]+) has invited ([^ ]+) to join the guild\./.exec(text)){
                nodes[0].textContent = `${result[1]} 邀请了 ${result[2]} 加入公会。`;
            }
            else if(result = /([^ ]+) has marked the (.+) as the next upgrade\./.exec(text)){
                nodes[0].textContent = `${result[1]} 将「${Translation.get(result[2])}」标记为下一个公会升级。`;
            }
            else if(result = /The guild has advanced to level ([0-9]+) with the help of ([^\.]+). ([0-9]+) \[[^\]]+\] have been added to the guild funds./.exec(text)){
                nodes[0].textContent = `${result[2]} 为公会升级至 ${result[1]} 级提供了关键经验。公会获得了 ${result[3]} 本 `;
                nodes[spanInd[0]+1].textContent = `。`
            }
            else if(result = /([^ ]+) has left the guild/.exec(text)){
                nodes[0].textContent = `${result[1]} 离开了公会。`
            }
            else if(result = /([^ ]+) donated ([^ ]+) \[[^\]]+\]/.exec(text)){
                nodes[0].textContent = `${result[1]} 捐赠了 ${result[2]} `;
            }
            else if(result = /([^ ]+) withdrew ([^ ]+) \[[^\]]+\]/.exec(text)){
                nodes[0].textContent = `${result[1]} 提取了 ${result[2]} `;
            }
            else if(result = /([^ ]+) changed ([^']+)'s rank to (.*)/.exec(text)){
                nodes[0].textContent = `${result[1]} 将 ${result[2]} 的职位变为 ${result[3]}`;
            }
            else if(result = /([^ ]+) updated rank (.*) permissions/.exec(text)){
                nodes[0].textContent = `${result[1]} 更改了 ${result[2]} 的权限`;
            }
            else if(result = /([^ ]+) updated (.*) (Wood|Fish|Iron|Elemental Shards|Mana Dust|Battle XP) tax from ([^ ]+) to ([^ ]+)/.exec(text)){
                nodes[0].textContent = `${result[1]} 更改了 ${result[2]} 关于${Translation.get(result[3]) ?? result[3]}的税率： ${result[4]} 🡢 ${result[5]}`;
            }
            else if(result = /The guild has advanced to level ([0-9]+)/.exec(text)){
                nodes[0].textContent = `公会到达 ${result[1]} 级`;
            }
            else console.log(`cannot translate|${text}|(Guild)`);
            break;
        }
        case "general":{
            if(result = /([^ ]+) purchased ([0-9]+) \[[^\]]+\] and ([0-9]+) \[[^\]]+\]/.exec(text)){
                nodes[0].textContent = `${result[1]} 购买了 ${result[2]} `;
                nodes[spanInd[0]+1].textContent = ` 和 ${result[3]} `;
            }
            break;
        }
        case "trade":{
            break;
        }
        //#region Global
        case "global":{
            if(result = /([^ ]+) found a \[[^\]]+\]/.exec(text)){
                nodes[0].textContent = `${result[1]} 发现了 `;
            }
            else if (result = /([^ ]+) upgraded \[[^\]]+\]/.exec(text)){
                nodes[0].textContent = `${result[1]} 升级了 `;
            }
            else console.log(`cannot translate|${text}|(Global)`);
            break;
        }
        //#region All
        case "notifications":
        case "all":{
            if(SystemMsgTranslation.has(nodes[0].textContent)) _Translate(nodes[0], "help");
            if(result = /You sold ([^ ]+) \[[^\]]+\] for ([^ ]+) \(([^ ]+) each\)\./.exec(text)){
                nodes[0].textContent = `你卖出了 ${result[1]} `;
                nodes[spanInd[0]+1].textContent = `, 获得 ${result[2]} ${Settings.manaDustName}（单价 ${result[3]}）`;
            }
            else if(result = /You bought ([^ ]+) \[[^\]]+\] for ([^ ]+) \(([^ ]+) each\)\./.exec(text)){
                nodes[0].textContent = `你购买了 ${result[1]} `;
                nodes[spanInd[0]+1].textContent = `, 花费 ${result[2]} ${Settings.manaDustName}（单价 ${result[3]}）`;
            }
            else if(result = /Sold \[[^\]]+\] to ([^ ]+) for ([^ ]+) \[[^\]]+\]./.exec(text)){
                nodes[0].textContent = "将 ";
                nodes[spanInd[0]+1].textContent = ` 卖给了 ${result[1]}，获得 ${result[2]} `;
            }
            else if(result = /Your \[([^\]]+)\] has increased in power \(([^\)]+)\)/.exec(text)){
                nodes[0].textContent = `你的 `;
                const boosts = result[2].split(", ").map(boost => {
                    console.log(boost);
                    const result = /([^ ]+) (.*)/.exec(boost);
                    return `${result[1]} ${Translation.get(result[2]) ?? result[2]}`;
                }).join("，");
                nodes[spanInd[0]+1].textContent = ` 增强了力量（${boosts}）。`;
            }
            else if(result = /Bought \[[^\]]+\] from ([^ ]+) for ([^ ]+) \[[^\]]+\]\./.exec(text)){
                nodes[0].textContent = `从 ${result[1]} 处购买了 `;
                nodes[spanInd[0]+1].textContent = `, 花费 ${result[2]} `;
            }
            else if(result = /Your \[[^\]]+\] has increased in power\./.exec(text)){
                nodes[0].textContent = "你的 ";
                nodes[spanInd[0]+1].textContent = " 从裂隙中获得了力量。"
            }
            else if(result = /Next Elemental Rift starts in ([0-9]+)?([A-Za-z ]+)?([0-9]+)?([A-Za-z ]+)?/.exec(text)){
                const times = result.slice(1).map(text => FarmTranslation.get(text) ?? text);
                nodes[0].textContent = `距离下一次元素裂隙还有 ${times.join("")}`;
            }
            else if(result = /You have earned ([^ ]+) event points\./.exec(text)){
                nodes[0].textContent = `你获得了 ${result[1]} 事件点数。`
            }
            else if(result = /([^ ])+ returned \[[^\]]+\] to you/.exec(text)){
                nodes[0].textContent = `${result[1]} 将 `;
                nodes[spanInd[0]+1].textContent = ` 还给了你。`
            }
            else if(result = /([^ ])+ enchanted your \[[^\]]+\]/.exec(text)){
                nodes[0].textContent = `${result[1]} 附魔了你的 `;
            }
            else if(result = /[Yy]ou sent ([^ ]+) ([^ ]+) \[[^\]]+\]/.exec(text)){
                nodes[0].textContent = `你送给了 ${result[1]} ${result[2]} `;
            }
            else if(result = /[Yy]ou sent ([^ ]+) \[[^\]]+\] to ([^ ]+)\./.exec(text)){
                nodes[0].textContent = `你送给了 ${result[2]} ${result[1]} `;
                nodes[spanInd[0]+1].textContent = "";
            }
            else console.log(`cannot translate|${text}|(All)`);
            break;
        }
    }
};
const FindAndReplaceText = () => {try {
    switch(window.location.pathname){
        //#region /shop
        case "/shop":{
            // 四个大块
            CheckTranslation(document, "main div.font-semibold.text-center.text-2xl[data-slot='card-title']", _TypedTranslate("premium"));
            // 所有购买在获得的 [魔力结晶] 之上还会给予晋升点数
            CheckTranslation(document, "main div[data-slot='card-description']", (div) => [
                div.childNodes[0],
                div.childNodes[3],
            ].forEach(_TypedTranslate("premium")));
            // 消费获得 30 [法典] 和 1 [魔力结晶] 每€。最低消费 5€。
            CheckTranslation(document, "div[data-slot='card']:nth-child(1) div.px-6.space-y-4[data-slot='card-content']>div:nth-child(1)", (div) => [
                // Purchase 30 [codex] and 1 [cryistallized mana] ...
                div.childNodes[0],
                div.childNodes[4],
                div.childNodes[6],
            ].forEach(_TypedTranslate("premium")));
            // 消费获得 150 法典和 5 魔力结晶，支付 5€
            CheckTranslation(document, "div[data-slot='card']:nth-child(1) div.px-6.space-y-4[data-slot='card-content']>div:nth-child(3)", (div) => [
                div.childNodes[0],
                div.childNodes[2],
                div.childNodes[5],
            ].forEach(_TypedTranslate("premium")));
            // 付款上面的两个
            CheckTranslation(document, "div[data-slot='card']:nth-child(1) div.px-6.space-y-4[data-slot='card-content']>div:nth-child(4)", (div) => _Translate(div.childNodes[1], "premium"));
            CheckTranslation(document, "div[data-slot='card']:nth-child(1) div.px-6.space-y-4[data-slot='card-content']>div:nth-child(5)", (div) => _Translate(div.childNodes[1], "premium"));
            // 下一头衔：奇术师 (135/150 晋升点数)
            CheckTranslation(document, "div[data-slot='card']:nth-child(2) div.px-6.space-y-2[data-slot='card-content']>div:nth-child(2)>div:nth-child(1)", (div) => {
                _Translate(div.childNodes[0], "premium");
                _Translate(div.childNodes[1], "equipment");
                _Translate(div.childNodes[3].childNodes[4], "premium");
            });
            // 解锁消耗 15 [魔力结晶]
            CheckTranslation(document, "div[data-slot='card']:nth-child(2) div.px-6.space-y-2[data-slot='card-content']>div:nth-child(2)>div:nth-child(3)", (div) => {
                _Translate(div.childNodes[0], "premium");
            })
            // 便利升级下面那一大块
            CheckTranslation(document, "div[data-slot='card']:nth-child(3) div.px-6.space-y-2[data-slot='card-content']", (div) => {
                [
                    div.children[0].childNodes[0],
                    div.children[0].childNodes[3],
                    div.children[0].childNodes[5],
                    div.children[1].children[0],
                    div.children[1].children[1],
                    div.children[1].children[2],
                    div.children[1].children[3],
                ].forEach(_TypedTranslate("premium"));
                const div20 = div.children[2].children[0];
                new MutationObserver((_, observer) => {
                    observer.disconnect();
                    div20.textContent = div20.textContent.replace("QoL active until", "便利升级有效期至");
                    div20.textContent = div20.textContent.replace("You currently do not have QoL", "你还没有购买便利升级");
                    observer.observe(div20, {childList: true, subtree: true, characterData: true});
                }).observe(div20, {childList: true, subtree: true, characterData: true});
            })
            CheckTranslation(document, 'div[data-radix-popper-content-wrapper] .bg-popover[class*="rarity-"]', (equipDiv) => {
                const nameEl = equipDiv.querySelector('.glow.mb-1.text-lg.font-bold[class*="rarity-"]');
                if (nameEl) EquipTranslate(nameEl);
                const levelEl = equipDiv.querySelector('.text-foreground.mb-2.flex.justify-between.gap-2 span:first-child');
                if (levelEl && levelEl.textContent.includes('Level')) {
                    const match = /^(.*)\s+Level\s+(\d+)$/.exec(levelEl.textContent);
                    if (match) {
                        const skill = Translation.get(match[1]) || match[1];
                        levelEl.textContent = `${skill}等级 ${match[2]}`;
                    }
                }
                const typeEl = equipDiv.querySelector('.text-foreground.mb-2.flex.justify-between.gap-2 span:last-child');
                if (typeEl) {
                    const parts = typeEl.textContent.split(' ');
                    if (parts.length >= 2) {
                        const rarity = Translation.get(parts[0]) || parts[0];
                        const slot = Translation.get(parts[1]) || parts[1];
                        typeEl.textContent = `${rarity} ${slot}`;
                    }
                }
                equipDiv.querySelectorAll('.text-foreground.flex.justify-between span:first-child, .flex.justify-between.text-green-500 span:first-child').forEach(span => {
                    _Translate(span);
                });
                const qualityEl = equipDiv.querySelector('.text-foreground\\/70.mt-1.flex.justify-between span:first-child');
                if (qualityEl) _Translate(qualityEl);
                const linkEl = equipDiv.querySelector('.text-foreground.float-right.cursor-pointer.text-sm.underline.select-none');
                if (linkEl && linkEl.textContent === 'Link') linkEl.textContent = '链接';
            });
            break;
        }
        // #region /event
        case "/event":{
            CheckTranslation(document, "main>div:nth-child(1)>div:nth-child(1):not([class])", div => {
                _Translate(div.childNodes[0], "elementalRift");
                div.children[0].title = div.children[0].title.split("/").reverse().join("/");
            });
            CheckTranslation(document, "main>div:nth-child(1)>div:nth-child(2):not([class])", div => {
                _Translate(div.childNodes[1], "elementalRift");
                div.insertBefore(document.createTextNode("上次事件共击败 "), div.childNodes[0]);
            });
            CheckTranslation(document, "main th[data-slot='table-head']>button>span", _TypedTranslate("elementalRift"));
            CheckTranslation(document, "main>div:nth-child(1)>div:nth-child(3).mt-2.text-xl", _TypedTranslate("elementalRift"));
            CheckTranslation(document, "main>div:nth-child(1)>div:nth-child(n+4):nth-last-child(n+2)", div => _Translate(div.childNodes[1]));
            CheckTranslation(document, "main>div:nth-last-child(1)>div.space-y-2>div.space-y-2>div.px-2", div => {
                [
                    div.children[0],
                    div.children[1].childNodes[0],
                    div.children[1].childNodes[2],
                    div.children[2],
                ].forEach(_TypedTranslate("elementalRift"));
                div.children[1].append(document.createTextNode(" 页"));
            });
            break;
        }
        // #region /activity-log
        case "/activity-log":{
            CheckTranslation(document, 'main button[data-slot="select-trigger"]', button => {
                _Translate(button.childNodes[0]);
                new MutationObserver(() => _Translate(button.childNodes[0], "default", ))
            })
            CheckTranslation(document, "main div.space-y-2>div:nth-child(1):nth-last-child(1)", _Translate);
            CheckTranslation(document, "main h1.text-2xl", _TypedTranslate("guild"));
            // LogTranslator 调用1, 在玩家活动日志
            CheckTranslation(document, "main div.space-y-2>div.space-x-1.text-sm.leading-4", div => {
                LogTranslator("ActivityLog", [...div.children[1].childNodes]);
            })
            break;
        }
        // #region /town
        case "/town":{
            document.querySelectorAll("main > div:not([translated]):nth-child(1)").forEach(div => {
                div.setAttribute("translated", "");
                [
                    div.children[0]/* title */,
                    div.children[1]/* panels */.children[0]/* battle panel */.children[0]/* battle panel title*/,
                    div.children[1].children[0].children[1]/* battle panel content */.children[0],
                    div.children[1].children[0].children[1].children[1],
                    div.children[1].children[0].children[1].children[2].childNodes[0],
                    div.children[1].children[0].children[1].children[3].childNodes[0],
                    div.children[1].children[0].children[1].children[4].childNodes[0],
                    div.children[1].children[1]/* gather panel */.children[0]/* gather panel title */,
                    div.children[1].children[1].children[1]/* gather panel content */.children[0],
                    div.children[1].children[1].children[1].children[1],
                    div.children[1].children[1].children[1].children[2],
                    div.children[1].children[2]/* others panel */.children[0]/* others panel title */,
                    div.children[1].children[2].children[1]/* others panel content */.children[0],
                    div.children[1].children[2].children[1].children[1],
                    div.children[1].children[2].children[1].children[2],
                    div.children[1].children[2].children[1].children[3],
                    div.children[1].children[2].children[1].children[4],
                    div.children[1].children[2].children[1].children[5],
                    div.children[1].children[2].children[1].children[6],
                ].forEach(_Translate);
            });
            break;
        }
        // #region /market/*
        case "/market/my-orders":
            // LEMONAPOSTLE 这里的 each 可以删了，反正没用
            CheckTranslation(document, "main div.text-xl", _TypedTranslate("market"));
            if(window.location.pathname === "/market/my-orders") CheckTranslation(document, "main table.w-full.table-auto.text-left thead tr th", _Translate);
        case "/market": {
            if(document.querySelector('button[id$="\\:-trigger-equipment"][data-state="active"]')){
                document.querySelectorAll("tbody tr td:nth-child(4):not([translated])").forEach(td => {
                    td.setAttribute("translated", "");
                    const text = td.textContent;
                    const splitPos = text.indexOf(" ");
                    td.textContent = `${text.substring(0, splitPos)} ${Translation.get(text.substring(splitPos + 1).trim()) ?? text.substring(splitPos + 1)}`;
                });
            }
            CheckTranslation(document, "th span.mr-1", _TypedTranslate("market"));
            // 出售挂单和购买挂单
            CheckTranslation(document, `main div.min-h-100 div.mt-4.flex.flex-wrap`, div => {
                div.querySelectorAll(":scope label:not([translated]), :scope th:not([translated]), :scope h2:not([translated])").forEach(el => {
                    el.setAttribute("translated", "");
                    _Translate(el);
                });
            });
            // 总计
            CheckTranslation(document, "div.mt-2 div.mb-2>div:nth-child(3)>div:nth-child(3)", div => {
                if (div.childNodes[0]) _Translate(div.childNodes[0], "market");
            });
            if (window.location.pathname === "/market/my-orders") {
                CheckTranslation(document, "main div.text-xl", _TypedTranslate("market"));
                CheckTranslation(document, "main table thead tr th", _Translate);
            }
            document.querySelectorAll('span[class*="rarity-"]').forEach(span => {
                if (span.hasAttribute('translation-observer-attached')) {
                    return;
                }
                span.setAttribute('translation-observer-attached', 'true');
 
                const translateThisSpan = (targetSpan) => {
                    const itemName = targetSpan.textContent;
                    let result; 
                    if (result = /^ \+([^ ]+) ([A-Za-z ]+) $/.exec(itemName)) {
                        const valuePart = result[1];
                        const namePart = result[2].trim();
                        const translatedName = Translation.get(namePart) ?? namePart;
                        targetSpan.textContent = ` +${valuePart} ${translatedName} `;
                    }
                    else if (Translation.has(itemName)) {
                        targetSpan.textContent = Translation.get(itemName);
                    }
                    else if (targetSpan.dataset.slot === "tooltip-trigger" || targetSpan.dataset.slot === "popover-trigger") {
                        EquipTranslate(targetSpan);
                    }
                };
 
                translateThisSpan(span);
                const observer = new MutationObserver(() => {
                    observer.disconnect();
                    translateThisSpan(span);
                    observer.observe(span, { characterData: true, childList: true, subtree: true });
                });
                observer.observe(span, { characterData: true, childList: true, subtree: true });
            });
            break;
        }
        // #region /research
        case "/research":{
            document.querySelectorAll('div[data-slot="dialog-header"]:not([translated])').forEach(div => {
                div.setAttribute("translated", "");
                [div.children[0], div.children[1].children[0].childNodes[0], div.children[1].children[1].childNodes[3]].forEach(_Translate);
            });
            break;
        }
        // #region /guild/log
        case "/guild/log":{
            CheckTranslation(document, "main h1", _TypedTranslate("guild"));
            CheckTranslation(document, 'main button[data-slot="select-trigger"]', (button) => {
                _Translate(button.childNodes[0]);
            }, false);
            CheckTranslation(document, "main div.space-y-2>div.space-x-1.text-sm.leading-4", div => {
                // LogTranslator 调用 2，在 guild log 之中
                LogTranslator("guild", [...div.children[1].childNodes]);
            })
            break;
        }
        // #region /guild/(list)
        case "/guild/list":
        case "/guild":{
            CheckTranslation(document, "th span.mr-1", _TypedTranslate("guild"));
            CheckTranslation(document, "th[data-slot='table-head']", _TypedTranslate("guild"));
            [...document.querySelectorAll('div[data-slot="table-container"]>table>tbody>tr>td:nth-child(2)>div:nth-child(1)')].forEach(td => {
                if(!td.textContent) return;
                let result;
                const Translate = (translated) => {
                    const clone = td.cloneNode(true);
                    clone.textContent = translated;
                    td.setAttribute("hidden", "");
                    td.insertAdjacentElement("afterend", clone);
                }
                if(result = /about ([^ ]+) hours? ago/.exec(td.textContent)){
                    Translate(`约 ${result[1]} 小时前`);
                }
                else if(result = /([^ ]+) minutes? ago/.exec(td.textContent)){
                    Translate(`${result[1]} 分钟前`);
                }
            })
            break;
        }
        // #region /guild/info
        case "/guild/info":{
            CheckTranslation(document, 'main div.space-y-2 div.space-y-2 div.text-xl', _TypedTranslate("guild"));
            break;
        }
        // #region /guild/ranks
        case "/guild/ranks":{
            document.querySelectorAll('div.hover\\:bg-primary\\/20:not([translated])').forEach(div => {
                div.setAttribute("translated", '');
                div.children[1].textContent = div.children[1].textContent.split(", ").map(word => Translation.get(word) ?? "未翻译").join(", ");
                [
                    div.children[2].childNodes[0],
                    div.children[2].childNodes[2],
                    div.children[2].childNodes[5],
                    div.children[2].childNodes[8],
                ].forEach(_Translate);
            });
            break;
        }
        // #region /g*/upgrades
        case "/guild/upgrades":{
            CheckTranslation(document, "main div.space-y-2>div:nth-child(2)>div:nth-child(1)", _TypedTranslate("guild"));
            CheckTranslation(document, "main>div.space-y-2 div.mt-4.gap-6>div.border-primary:nth-child(1)>div:nth-child(3):nth-last-child(2)", div => {
                div.childNodes[3].textContent = " 战斗经验";
            })
            CheckTranslation(document, "div.mt-4:nth-child(4) div.border-primary.flex.w-full.flex-col.border.p-2.md\\:w-80:nth-child(n+2)", div => {
                [
                    div.children[0],
                    div.children[1],
                    div.children[2].children[0].childNodes[0],
                    ...[...(div.children[3]?.children ?? [])].map(ele => ele.childNodes[1]).filter(node => node),
                ].forEach(_Translate);
                const div21 = div.querySelector(":scope div.mt-auto.flex.justify-between").children[1];
                const text21 = div21.textContent;
                const result21 = /([^ ]+) (.*)/.exec(text21);
                if(!result21) {console.log("result201 is null"); return;}
                div21.textContent = `${result21[1]} ${GuildTranslation.get(result21[2]) ?? result21[2]}`;
            });
            CheckTranslation(document, "div.mt-4:nth-child(4) div.border-primary.flex.w-full.flex-col.border.p-2.md\\:w-80:nth-child(1)", div => {
                _Translate(div.children[0]);
                _Translate(div.children[1].childNodes[2], "guild");
                _Translate(div.children[2].childNodes[2], "guild");
                _Translate(div.children[3].childNodes[2], "guild");
                _Translate(div.children[4].childNodes[2], "guild");
                const last = div.children[div.children.length - 1];
                _Translate(last.children[0].childNodes[0]);
                _Translate(last.children[1].childNodes[last.children[1].childNodes.length - 1]);
            });
            break;
        }
        // #region /g*/armory
        case "/guild/armory":{
            CheckTranslation(document, "main>div:nth-child(1)>div:nth-child(2)", div => _Translate(div.childNodes[0], "guild"));
            CheckTranslation(document, "main div.hover\\:bg-primary\\/20.mb-0\\.5.flex.items-center.gap-2>div.ml-auto", div => {
                let result;
                if(result = /Borrowed by ([^ ]+) \(Unequipped\)/.exec(div.textContent)){
                    div.childNodes[0].textContent = `${result[1]} 借出`;
                    div.childNodes[1].textContent = "（未装备）";
                }
                else if(result = /Borrowed by (.*)/.exec(div.textContent)) div.textContent = `${result[1]} 借出`;
            }, false);
            break;
        }
        // #region /news
        case "/news":{
            document.querySelectorAll(`html.dark.notranslate body div#root div.flex.max-h-screen.min-h-screen.flex-col.overflow-x-hidden div.flex.max-w-screen.grow.flex-col.overflow-y-scroll.lg\\:flex-row.lg\\:flex-wrap main.grow.p-2.lg\\:w-1.lg\\:p-4 div.space-y-4.p-2 div div ul.ml-6.list-disc li span:not([translated])`).forEach(span => {
                span.setAttribute("translated", "");
                [...span.childNodes].forEach(node => {
                    if(node.nodeType !== Node.TEXT_NODE) return;
                    _Translate(node);
                });
            });
            /*
            CheckTranslation(document, "main h2.text-lg", h2 => {
                const dateComp = h2.textContent.split("/");
                dateComp.reverse();
                h2.textContent = dateComp.join("/");
            })
            */
            break;
        }
        // #region /rankings
        case "/rankings": {
            // page xx of xx
            CheckTranslation(document, `div#root div.flex.max-h-screen.min-h-screen.flex-col.overflow-x-hidden div.flex.max-w-screen.grow.flex-col.overflow-y-scroll.lg\\:flex-row.lg\\:flex-wrap main.grow.p-2.lg\\:w-1.lg\\:p-4 div.mx-auto.max-w-2xl.p-4 div.mt-2.flex.flex-wrap.justify-center.gap-4 div.text-muted-foreground.flex.items-center.gap-2.text-sm`, div => {
                div.childNodes[0].textContent = "第";
                div.childNodes[2].textContent = "/ ";
                div.append(HTML("span", {}, " 页"));
            })
            CheckTranslation(document, "label.flex.items-center.gap-2", label => {
                _Translate(label.childNodes[1]);
            });
            break;
        }
        case "/":{
            // #region /(Event boss)
            if([...document.querySelectorAll("main div.flex.flex-wrap.justify-center.gap-2:nth-child(1) button.inline-flex.items-center")].filter(button => button.getAttribute("class") === `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[color,box-shadow] disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive bg-primary text-primary-foreground shadow-xs hover:bg-primary/90 cursor-pointer h-9 px-4 py-2 has-[>svg]:px-3`).length === 4){
                document.querySelectorAll("main th[data-slot='table-head']>button>span").forEach(_TypedTranslate("elementalRift"));
                CheckTranslation(document, "main div div p.text-center.font-semibold", div => {
                    _Translate(div.childNodes[0]); // Event boss
                });
                CheckTranslation(document, "main>div:nth-child(1)>div:nth-child(4):nth-last-child(2):not([class])", _Translate); // Event buff
                CheckTranslation(document, "main>div:nth-child(1)>div:nth-child(5):nth-last-child(1).space-y-2>div", div => { // Event buff items
                    _Translate(div.childNodes[3]);
                    _Translate(div.childNodes[10]);
                });
                CheckTranslation(document, "main>div:nth-child(1)>div:nth-child(2):nth-last-child(4)>div:nth-child(3)>div:nth-child(2)", div => _Translate(div.childNodes[0]));
                CheckTranslation(document, "div.space-y-1>p:nth-child(1):nth-last-child(1)", p => {
                    _Translate(p.childNodes[0]);
                    _Translate(p.childNodes[3]);
                });
                CheckTranslation(document, "div.space-y-1>p:nth-child(2):nth-last-child(1)>span:nth-child(3):nth-last-child(1)", span => {
                    _Translate(span.childNodes[0]);
                    _Translate(span.childNodes[2]);
                });
                CheckTranslation(document, "div.space-y-1:nth-child(3):nth-last-child(3)", div => {
                    if(div.textContent.startsWith("You attacked")){
                        [
                            div.children[0].childNodes[0],
                            div.children[0].childNodes[2],
                            div.children[0].childNodes[5],
                            div.children[0].childNodes[7],
                            div.children[0].childNodes[10],
                            div.children[1].childNodes[0],
                            div.children[1]?.children[2]?.childNodes[0],
                            div.children[1]?.children[2]?.childNodes[2],
                        ].filter(node => node).forEach(_Translate);
                    }
                });
            }
            // #region /(rift of pwer)
            CheckTranslation(document, "main div div div.mt-2>div.text-foreground.flex.justify-between", div => {
                _Translate(div.children[0]);
                _Translate(div.children[1].childNodes[0]);
                _Translate(div.children[1].childNodes[4]);
            });
            CheckTranslation(document, "div.mt-2>div.text-foreground.flex.justify-between>span:nth-child(1):nth-last-child(2)", _Translate);
            CheckTranslation(document, "main>div:nth-child(1):nth-last-child(1)>div:not([class]):nth-child(2):nth-last-child(2)", div => {
                _Translate(div.childNodes[0]);
                _Translate(div.childNodes[4]);
            });
            CheckTranslation(document, "main>div:nth-child(1):nth-last-child(1)>div.mt-4.text-xl", div => {
                _Translate(div);
            });
            // #region /(work)
            // #region /work
            // monster name
            CheckTranslation(document, "main>div.space-y-2>div.grid.grid-cols-1>div.mt-4:nth-child(2)", _Translate);
            // main translation 1
            CheckTranslation(document, "main>div.space-y-2>div:nth-child(3)>p:nth-child(1)", (p) => {
                // You won, you gained 2,215,745,396 experience.
                _Translate(p.childNodes[0]);
                _Translate(p.childNodes[3]);
            });
            CheckTranslation(document, "main>div.space-y-2>div:nth-child(3)>p:nth-child(2)", (p) => {
                // 你攻击了 553.47K 次。释放了 49.84M 次法术，造成暴击伤害 3.53B 次。
                _Translate(p.childNodes[0]);
                _Translate(p.childNodes[2]);
                _Translate(p.childNodes[5]);
                _Translate(p.childNodes[8]);
            });
            CheckTranslation(document, "main>div.space-y-2>div:nth-child(3)>p:nth-child(3)", (p) => {
                // 敌人对你攻击了 182 次。
                _Translate(p.childNodes[0]);
                _Translate(p.childNodes[2]);
            });
            // main translation 2
            CheckTranslation(document, "main>div.space-y-2>div:nth-child(4)", (p) => {
                // 你获得的战利品有：104.69M [魔法尘]你的公会获得了：11.63M [魔法尘]246.19M 战斗经验
                _Translate(p.childNodes[0]);
            });
            CheckTranslation(document, "main>div.space-y-2>div:nth-child(4)>div:nth-child(2)", (p) => {
                // 你的公会获得了：11.63M [魔法尘]246.19M 战斗经验
                _Translate(p.childNodes[0]);
            });
            CheckTranslation(document, "main>div.space-y-2>div:nth-child(4)>div:nth-child(2)>ul>li:nth-last-child(1)", (li) => {
                // 246.19M 战斗经验
                const text = li.textContent;
                const result = /([^ ]+) Battle XP/;
                if(result) li.childNodes[2].textContent = "战斗经验";
            });
            // #region /(rift of pwr)
            document.querySelectorAll("html.dark.notranslate body div#root div.flex.max-h-screen.min-h-screen.flex-col.overflow-x-hidden div.flex.max-w-screen.grow.flex-col.overflow-y-scroll.lg\\:flex-row.lg\\:flex-wrap main>div:not([class]):not([translated])").forEach(div => {
                div.setAttribute("translated", "");
                if(div?.children[0]?.children[0]?.children[0]?.textContent === "You are currently siphoning power into your lowest quality equipped item..."){
                    [
                        div.children[0].children[0].children[0],
                        div.children[0].children[0].children[1].childNodes[0],
                        div.children[0].children[0].children[1].childNodes[2],
                        div.children[1].childNodes[0],
                        div.children[1].childNodes[4],
                    ].forEach(_Translate);
                    return;
                }
                [
                    div?.children[0]?.children[0]?.childNodes[0],
                    div?.children[0]?.children[0]?.childNodes[1],
                    div?.children[0]?.children[0]?.childNodes[2],
                    div?.children[0]?.children[0]?.childNodes[5],
                    div?.children[1]?.childNodes[0],
                    div?.children[1]?.children[1]?.childNodes[0],
                ].filter(ele => ele).forEach(_Translate);
            });
            // main translation 3
            /* 
            
            debugTranslate("html.dark.notranslate body div#root div.flex.max-h-screen.min-h-screen.flex-col.overflow-x-hidden div.flex.max-w-screen.grow.flex-col.overflow-y-scroll.lg\\:flex-row.lg\\:flex-wrap main.grow.p-2.lg\\:w-1.lg\\:p-4 div.space-y-2 div.mt-4.grid.grid-cols-2.gap-4:nth-child(5)")
            
            playerPanel = "html.dark.notranslate body div#root div.flex.max-h-screen.min-h-screen.flex-col.overflow-x-hidden div.flex.max-w-screen.grow.flex-col.overflow-y-scroll.lg\\:flex-row.lg\\:flex-wrap main.grow.p-2.lg\\:w-1.lg\\:p-4 div.space-y-2 div.mt-4.grid.grid-cols-2.gap-4:nth-child(5)" + " div:nth-child(1)"
            debugTranslate(playerPanel)
            
            debugTranslate(playerPanel,0)
            */
 
            document.querySelectorAll("html.dark.notranslate body div#root div.flex.max-h-screen.min-h-screen.flex-col.overflow-x-hidden div.flex.max-w-screen.grow.flex-col.overflow-y-scroll.lg\\:flex-row.lg\\:flex-wrap main.grow.p-2.lg\\:w-1.lg\\:p-4 div.space-y-2 div.mt-4.grid.grid-cols-2.gap-4:nth-child(5)").forEach(div => {
                if(div.hasAttribute("translated", "")){
                    const lackMana = div.children[0].children[3].childNodes[3];
                    if(lackMana.textContent !== "."){
                        const result = /and lacked ([^ ]+) mana/.exec(lackMana.textContent);
                        if(result) lackMana.textContent = `，缺少了 ${result[1]} 点魔力`;
                    }
                    return;
                }
                div.setAttribute("translated", "");
                const playerPanel = div.children[0];
                if (playerPanel) {
                    _Translate(playerPanel.children[0]);
                    _Translate(playerPanel.children[1].childNodes[0]);
                    _Translate(playerPanel.children[1].childNodes[2]); // 魔力护盾大小
                    _Translate(playerPanel.children[2].childNodes[0]);
                    _Translate(playerPanel.children[3].childNodes[0]);
                    _Translate(playerPanel.children[3].childNodes[2]); // 你消耗了 xx 魔力
                    _Translate(playerPanel.children[4].childNodes[0]);
                    _Translate(playerPanel.children[4].childNodes[4]); // 魔力回复率，魔力消耗率
                    _Translate(playerPanel.children[5].childNodes[0]);
                    _Translate(playerPanel.children[6].children[0].childNodes[0]);
                    _Translate(playerPanel.children[6].children[1].childNodes[0]);
                    _Translate(playerPanel.children[6].children[2].childNodes[0]);
                }
 
                const enemyPanel = div.children[1];
                if (enemyPanel) {
                    _Translate(enemyPanel.children[0]);
                    _Translate(enemyPanel.children[1].childNodes[0]);
                    _Translate(enemyPanel.children[2].childNodes[0]);
                }
            });
            break;
        }
        // #region /rules
        case "/rules":{
            document.querySelectorAll("main h2.text-lg:not([translated]), main p.text-md:not([translated]), main h1:not([translated])").forEach(p => {
                p.setAttribute("translated", "");
                _Translate(p);
            });
            break;
        }
        // #region /inventory
        case "/inventory":{
            document.querySelectorAll("main div.mt-2.mb-1.text-xl:not([translated]), main span.text-2xl:not([translated]), main div.text-2xl:not([translated]), main div.space-y-1 div.text-md div.w-15:not([translated])").forEach(div => {
                div.setAttribute("translated", "");
                _Translate(div);
            });
            CheckTranslation(document, "div.flex.min-h-8.gap-2>div.block.md\\:hidden:nth-child(2):nth-last-child(1)", div => {
                div.childNodes[0].textContent = "无";
                _Translate(div.childNodes[1]);
            })
            document.querySelectorAll('button[data-slot="dropdown-menu-trigger"][aria-haspopup="menu"]').forEach(div => {
                div.setAttribute("translated", "");
                if(div.childNodes[1] && div.childNodes[1].textContent === " Selected") div.childNodes[1].textContent = " 已选择";
            })
            break;
        }
        // #region /settings
        case "/settings":{
            CheckTranslation(document, "main>div.space-y-2>div.space-y-4>div.flex.items-center.gap-2>span:nth-child(1):not([class])", _TypedTranslate("settings"));
            CheckTranslation(document, "main>div.space-y-2>div.space-y-4>div.flex.items-center.gap-2>span:nth-child(3):nth-last-child(1):not([class])", _TypedTranslate("settings"));
            CheckTranslation(document, "div.space-y-6>div>div.flex.gap-4>span.whitespace-nowrap", span => {
                _Translate(span.childNodes[0], "settings");
            })
            CheckTranslation(document, "div.space-y-6>div.flex.gap-4>div.mb-2:nth-child(1)", _TypedTranslate("settings")); // tooltip mode
            CheckTranslation(document, "main button[data-slot='toggle-group-item']", _TypedTranslate("settings"));
            document.querySelectorAll("main>div:not([translated])").forEach((div) => {
                div.setAttribute("translated", "");
                [
                    div.children[1].childNodes[0],
                    div.children[1].childNodes[3],
                    div.children[1].childNodes[6],
                    div.children[3],
                ].filter(div => div).forEach((div) => _Translate(div, "settings"));
            });
            document.querySelectorAll("main>div:not([ref-translated])").forEach(div => {
                div.childNodes.forEach(node => {
                    if(node.nodeType === Node.TEXT_NODE){
                        _Translate(node, "settings");
                        div.setAttribute("ref-translated", "");
                    }
                });
            });
            document.querySelectorAll("main h2.text-2xl:not([translated]), main label:not([translated]), main span.w-30.text-lg:not([translated]), main div.text-xl:not([translated])").forEach(div => {
                div.setAttribute("translated", "");
                _Translate(div, "settings");
            });
            document.querySelectorAll(`main div.space-y-2 div div div.flex.flex-wrap.items-center.justify-between.gap-2.p-2 div div.space-x-2 span.text-xs:not([translated])`).forEach(span => {
                span.setAttribute("translated", "");
                _Translate(span.childNodes[0], "settings");
            });
            document.querySelectorAll(`main div.space-y-2 div.ml-2 div.ml-4:not([translated])`).forEach(div => {
                div.setAttribute("translated", "");
                div.replaceChildren(...div.textContent.split(", ").reduce((result, current, index, arr) => {
                    result.push(current);
                    if(index !== arr.length - 1) result.push("，");
                    return result;
                }, []));
                [...div.childNodes].forEach(node => _Translate(node, "settings"));
            });
            break;
        }
        // #region /farm(farm)
        case "/farm":{
            const farmId = `div[id$="\\:-content-farm"]`;
            const potionsId = `div[id$="\\:-content-potions"]`;
 
            // 'Your farm has been growing for 4 minutes(16.34K herbs/hour)'
            CheckTranslation(document, `${farmId}>div.flex.flex-wrap.items-center.justify-between>div.space-x-1`, (div) => {
                const growTime = div.children[0];
                const growTimeTranslation = (multlist, observer) => {
                    observer?.disconnect();
                    const text = growTime.textContent;
                    const result = /([A-Za-z ]+)([0-9]+)?([A-Za-z ]+)?([0-9]+)?([A-Za-z ]+)?/.exec(text);
                    growTime.textContent = result.slice(1).map(part => FarmTranslation.get(part ?? "") ?? part).join("");
                    observer?.observe(growTime, {subtree: true, childList: true, characterData: true});
                };
                growTimeTranslation();
                new MutationObserver(growTimeTranslation).observe(growTime, {subtree: true, childList: true, characterData: true});
                
                _Translate(div.children[1].childNodes[2], "farm");
                _Translate(div.children[1].childNodes[6], "farm");
            });
 
            // Ready to collect in 3 hours(Your farm continues to grow for up to 24 hours)
            CheckTranslation(document, `${farmId}>div.flex.flex-wrap.items-center.justify-between>div.space-x-2`, (div) => {
                const growTime = div.children[0];
                const growTimeTranslation = (mutlist, observer) => {
                    observer?.disconnect();
                    const text = growTime.textContent;
                    const result = /([A-Za-z ]+)([0-9]+)?([A-Za-z ]+)?([0-9]+)?([A-Za-z ]+)?/.exec(text);
                    growTime.textContent = result.slice(2).map(part => FarmTranslation.get(part ?? "") ?? part).join("") + "后可再次采摘";
                    observer?.observe(growTime, {subtree: true, childList: true, characterData: true});
                };
                growTimeTranslation();
                new MutationObserver(growTimeTranslation).observe(growTime, {subtree: true, childList: true, characterData: true});
                _Translate(div.children[1], "farm");
            });
 
            CheckTranslation(document, `${farmId}>div.mt-1.text-2xl`, _TypedTranslate("farm"));
 
            const TranslateNotation = (ele) => ele.textContent = ele.textContent.replace("potions", "药水").replace("potion", "药水");
 
            const UpgradeTranslation =  (div) => {
                [
                    div.children[0].children[0].children[0],
                    div.children[0].children[0].children[1],
                    div.children[1].childNodes[0],
                    div.children[3].childNodes[0],
                    div.children[3].childNodes[2],
                    div.children[3].childNodes[5],
                ].forEach(_TypedTranslate("farm"));
            };
 
 
            CheckTranslation(document, `${farmId}>div.flex.flex-col.gap-2.rounded-lg.p-3`, UpgradeTranslation);
 
        // #region /farm(potion)
            // 
            CheckTranslation(document, `${potionsId}>div.flex.flex-col.gap-2.rounded-lg.p-3`, UpgradeTranslation);
            CheckTranslation(document, `${potionsId} div.text-2xl`, _TypedTranslate("farm"));
            CheckTranslation(document, `${potionsId} div.space-y-1 div.flex.items-center`, (div) => {
                _Translate(div.children[0].childNodes[2], "farm");
                const node04 = div.children[0].childNodes[4];
                if(node04.nodeType === Node.TEXT_NODE){
                    node04.textContent = node04.textContent.replace("Tier", "等级");
                }
                else _Translate(node04, "farm");
            });
            CheckTranslation(document, `${potionsId} span.text-sm`, (span) => {
                const OnMutate = (_, observer) => {
                    observer.disconnect();
                    const text = span.textContent;
                    let result;
                    if(result = /Restores ([^ ]+) actions when you run out/.exec(text)){
                        span.textContent = `当行动次数不足时回复 ${result[1]} 次数。`;
                    }
                    else if(text.startsWith("+")){
                        let newText = text;
                        const replacements = {
                            "Battle Experience": "战斗经验",
                            "Elemental Shards": "元素碎片",
                            "Base Resource Amount": "基础资源量",
                            "for": "持续",
                        };
                        for (const [key, value] of Object.entries(replacements)) {
                            newText = newText.replace(new RegExp(key, 'g'), value);
                        }
                        span.textContent = newText;
                    }
                    observer.observe(span, {childList: true, subtree: true, characterData: true});
                }
                const observer = new MutationObserver(OnMutate);
                OnMutate(undefined, observer);
            });
            CheckTranslation(document, `${potionsId} div.space-x-2>span:nth-child(1)`, _TypedTranslate("farm"));
            CheckTranslation(document, `${potionsId} div.ml-1.space-y-4 div.flex.flex-wrap.items-end.gap-2>div:nth-last-child(2)>div`, (div) => {
                div.childNodes[3].textContent = " 每份消耗";
            });

            // 下面的两个升级
            var allItems = document.querySelectorAll("div.flex.flex-col.gap-2.rounded-lg.p-3");
            for (let i = 0; i < allItems.length; i++) {
                const item = allItems[i];
                if(item){
                    var describe1 = item.children[0].children[0].children[1];
                    if (describe1) {
                        _Translate(describe1.childNodes[0], "farm");
                    }
                }
            }
            break;
        }
        // #region /eventshop
        case "/sigils":{
            CheckTranslation(document, "div.flex.items-center.gap-2>div.break-words", _TypedTranslate("upgrade"))
            CheckTranslation(document, "main>div.space-y-2:nth-child(1)>div:nth-child(1)", div => {
                div.childNodes[0].textContent = "你有 ";
                div.childNodes[4].textContent = "。到达下一魔符升级需要累计";
            })
        }
        // #region /pets
        case "/pets": {
            // 宠物状态
            CheckTranslation(document, "main .text-2xl", (element) => {
                const otherPetsTranslation = (mutList, observer) => {
                    observer?.disconnect();
                    const text = element.textContent.trim();
                    const result = /^Other Pets\s*\(You have\s+([\d,\.]+)\s+Eggs?\)$/i.exec(text);
                    if(result){
                        const [_, eggs] = result;
                        element.innerHTML = `其他宠物 <span class="text-sm">(你拥有 ${eggs} 个蛋)</span>`;
                        return;
                    }
                    _TypedTranslate("pets")(element);
                }
                otherPetsTranslation();
                new MutationObserver(otherPetsTranslation).observe(element, {subtree: true, childList: true, characterData: true});
            });
            // 宠物名称
            CheckTranslation(document, 'div[data-slot="card-title"] .text-xl', _TypedTranslate("pets"));
            // 多少个蛋解锁
            CheckTranslation(document, "div[data-slot='card-content'] button[data-slot='button']:not([translated])", (btn) => {
                const btnTranslation = (mutList, observer) => {
                    observer?.disconnect();
                    const text = btn.textContent;
                    const result = /Unlock pet for (\d+) Eggs/.exec(text);
                    if(result) btn.textContent = `使用 ${result[1]} 个蛋解锁`;
                    observer?.observe(btn, {subtree: true, childList: true, characterData: true});
                }
                btnTranslation();
                new MutationObserver(btnTranslation).observe(btn, {subtree: true, childList: true, characterData: true});
            });
            // 宠物描述1
            CheckTranslation(document, 'div[data-slot="card-content"] div.space-y-2 > div:last-child', (div) => {
                const text = div.textContent;
                for (const [regex, template] of petDescriptionRules) {
                    const match = regex.exec(text);
                    if (match) {
                        let translated = template;
                        for (let i = 1; i < match.length; i++) {
                            translated = translated.replace(`$${i}`, match[i]);
                        }
                        div.textContent = translated;
                        return;
                    }
                }
            });
            // 宠物描述2
            CheckTranslation(document, 'div[data-slot="card-content"].flex.h-full.flex-col > div:first-child', (div) => {
                const text = div.textContent;
                for (const [regex, template] of petDescriptionRules) {
                    const match = regex.exec(text);
                    if (match) {
                        let translated = template;
                        for (let i = 1; i < match.length; i++) {
                            translated = translated.replace(`$${i}`, match[i]);
                        }
                        div.textContent = translated;
                        return;
                    }
                }
            });
            break;
        }
        // #region /dungeon-shop
        case "/dungeon-shop": {
            const dungeonShopCardSelector = 'div.flex.flex-col.gap-2.rounded-lg.p-3:not([translated])';
 
            document.querySelectorAll(dungeonShopCardSelector).forEach(cardDiv => {
                cardDiv.setAttribute("translated", "");
                _Translate(cardDiv.children[0].children[0].childNodes[0], "dungeons");
                explain = cardDiv.children[0]?.children[0]?.children[1]?.childNodes[0];
                if(explain){
                    _Translate(explain, "dungeons");
                }
                _Translate(cardDiv.children[1].childNodes[0], "dungeons");
                _Translate(cardDiv.children[3].childNodes[0], "dungeons");
                _Translate(cardDiv.children[3].childNodes[2], "dungeons");
                _Translate(cardDiv.children[3].childNodes[4], "dungeons");
                _Translate(cardDiv.children[3].childNodes[5], "dungeons");
            });
 
            // 有两个匹配项，第一个是左上角那个地牢
            div = document.querySelector("div.space-y-2 > div.text-2xl > *:nth-child(1)");
            div.setAttribute("translated", "");
            _Translate(div.childNodes[0]);
            _Translate(div.children[0].childNodes[4]);
 
            div = document.querySelector("div.space-y-2 h2.pb-2.text-xl");
            div.setAttribute("translated", "");
            _Translate(div.childNodes[0]); // Play Manual Mode
 
            label =  document.querySelector("div.space-y-2 div.flex div.mb-2.flex.flex-wrap label.flex.items-center.gap-2:not([translated])");
            if (label) {
                label.setAttribute("translated", "");
                _Translate(label.childNodes[1], "dungeons"); // Speedrun Mode
            }
 
            div = document.querySelector("div.my-4.flex.items-center.justify-between.text-2xl div.space-x-2");
            div.setAttribute("translated", "");
            _Translate(div.children[0].childNodes[0]); // Dungeon Point Upgrades
            _Translate(div.children[1].childNodes[2]); //  points)
 
            div = document.querySelector("div.flex.items-center.justify-between div.flex.items-center.gap-2");
            div.setAttribute("translated", "");
            _Translate(div.children[1].childNodes[0]); // Sniffles
 
            button = document.querySelector("div.space-y-2.p-2 > div.flex.items-center.justify-between > button");
            button.removeAttribute("translated");
            _Translate(button.childNodes[0]);
 
            div = document.querySelector("div.grid.grid-cols-1.gap-4 div.space-y-2.p-2 > :nth-child(2):not([translated])");
            if(div){
                div.setAttribute("translated", "");
                _Translate(div.childNodes[0], "dungeons");
            }
 
            div = document.querySelector("div.grid.grid-cols-1.gap-4 div.space-y-2.p-2 > :nth-child(3) > :nth-child(1):not([translated])");
            if(div){
                div.setAttribute("translated", "");
                _Translate(div.childNodes[0], "dungeons");
            }
 
            div = document.querySelector("div.grid.grid-cols-1.gap-4 div.space-y-2.p-2 > :nth-child(3) > :nth-child(1) > :nth-child(1):not([translated])");
            if(div){
                div.setAttribute("translated", "");
                _Translate(div.childNodes[2], "dungeons");
            }
 
            // none small medium large
            div = document.querySelector("div.grid.grid-cols-1.gap-4 div.space-y-2.p-2 > :nth-child(3) > :nth-child(2):not([translated])");
            if(div){
                div.setAttribute("translated", "");
                _Translate(div.children[0].childNodes[0], "dungeons");
                _Translate(div.children[1].childNodes[0], "dungeons");
                _Translate(div.children[2].childNodes[0], "dungeons");
                _Translate(div.children[3].childNodes[0], "dungeons");
            }

            break;
        }
        // #region /mage-tower
        case "/mage-tower": {
            const baseSelector = "div.flex.flex-wrap.items-baseline.justify-between";
            const base = document.querySelector(baseSelector);

            // mage tower
            const titleElement = base.children[0];
            if (titleElement && !titleElement.hasAttribute("translated")) {
                _Translate(titleElement.childNodes[0], "tower");
                titleElement.setAttribute("translated", ""); 
            }

            // you have xxx
            const contentElement = base.children[1];
            if (contentElement && !contentElement.hasAttribute("translated")) {
                _Translate(contentElement.childNodes[0], "tower");
                contentElement.setAttribute("translated", "");
            }

            var allItems = document.querySelectorAll('div.text-2xl');
            var buildQueue = allItems[1];
            if (buildQueue && !buildQueue.hasAttribute("translated")) {
                _Translate(buildQueue.childNodes[0], "tower");
                buildQueue.setAttribute("translated", "");
            }

            // constructing
            var allItems = document.querySelectorAll('div.hover\\:bg-primary\\/40.space-y-2.rounded.p-2');
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                if (item && !item.hasAttribute("translated")) {
                    _Translate(item.children[0].children[0].children[0].children[0], "tower");
                    _Translate(item.children[0].children[0].children[1].childNodes[0], "tower");
                    _Translate(item.children[0].children[0].children[1].childNodes[1], "tower");
                    item.setAttribute("translated", "");
                }
            }

            // queue
            var allItems = document.querySelectorAll('div.space-y-1');
            for (var i = 0; i < allItems.length; i++) {
                var item = allItems[i];
                if (item && !item.hasAttribute("translated")) {
                    _Translate(item.children[0].children[0].childNodes[0], "tower");
                    _Translate(item.children[2].children[1].childNodes[0], "tower");
                    item.setAttribute("translated", "");
                }
            }

            // build speed
            var allItems = document.querySelectorAll('div.flex.justify-between.text-sm span');
            var item = allItems[0];
            if (item && !item.hasAttribute("translated")) {
                _Translate(item.childNodes[0], "tower");
                item.setAttribute("translated", "");
            }

            // upgrades 
            var upgrades = document.querySelector("div.min-w-0");
            if(upgrades){
                var firstChild = upgrades.children[0];
                if(firstChild && !firstChild.hasAttribute("translated")){
                    _Translate(firstChild.childNodes[0], "tower");
                    _Translate(firstChild.children[0].childNodes[3], "tower");
                    firstChild.setAttribute("translated", "");
                }
                var secondChild = upgrades.children[1];
                if(secondChild && !secondChild.hasAttribute("translated")){
                    _Translate(secondChild.childNodes[0], "tower");
                    secondChild.setAttribute("translated", "");
                }
            }

            break;
        }
        // #endregion
        // #region /jewel
        case "/jewelcrafting": {
            const baseSelector3 = "div.flex.max-w-screen.grow.flex-col.overflow-y-scroll.lg\\:flex-row.lg\\:flex-wrap>main>div>:nth-child(2)";
            const base = document.querySelector(baseSelector3);
            if (!base) break; // 如果找不到基础容器，直接跳出
            
            // 1. jewelcrafting 标题
            const titleElement = base.children[0]?.children[0]?.children[0]?.children[0];
            if (titleElement && !titleElement.hasAttribute("translated")) {
                _Translate(titleElement.childNodes[0]);
                titleElement.setAttribute("translated", ""); 
            }

            // 注意：切换到商店时，这个路径大概率会变，所以加问号
            const contentElement = base.children[0]?.children[1]?.children[0]?.children[0]?.children[0]?.children[0];
            if (contentElement && !contentElement.hasAttribute("translated")) {
                _Translate(contentElement.childNodes[0]);
                contentElement.setAttribute("translated", "");
            }

            // 3. 三个元素 (Resonance, Luster, Clarity)
            const contentElement2 = base.children[0]?.children[1]?.children[0]?.children[0]?.children[2];
            if (contentElement2 && !contentElement2.hasAttribute("translated")) {
                translateLeafTextNodes(contentElement2);
                contentElement2.setAttribute("translated", "");
            }

            // 4. 底部或其他元素
            const contentElement3 = base.children[0]?.children[1]?.children[0]?.children[1]?.children[1];
            if (contentElement3 && !contentElement3.hasAttribute("translated")) {
                translateLeafTextNodes(contentElement3);
                contentElement3.setAttribute("translated", "");
            }
            
            // 宝石商店页面
            const shopContent = document.querySelector('div[data-slot="tabs-content"] > div');
            if (shopContent && !shopContent.hasAttribute("translated")) {
                const balanceRow = shopContent.children[0];
                if (balanceRow) {
                    // 使用递归翻译文本节点，它会翻译 "You have" 和 "Gem Tokens"
                    translateLeafTextNodes(balanceRow);
                }

                const rowsContainer = shopContent.children[1];
                if (rowsContainer) {
                    [...rowsContainer.children].forEach(row => {

                        // 翻译描述列 (A gem that...)
                        if (row.children[1]) {
                            translateLeafTextNodes(row.children[1]);
                        }

                        // 翻译价格列 (2.00M Gem Tokens)
                        if (row.children[3]) {
                            translateLeafTextNodes(row.children[3]);
                        }

                        // 翻译购买按钮 (Buy)
                        if (row.children[4]) {
                            translateLeafTextNodes(row.children[4]);
                        }
                    });
                }
                
                // 标记整个商店容器已翻译
                shopContent.setAttribute("translated", "");
            }
            break;
        }
    };
    // #region 路径匹配结束
    // #region /profile
    if(window.location.pathname.startsWith("/profile")){
        CheckTranslation(document, 'div[data-slot="card"]:nth-child(1)>div[data-slot="card-content"]>p:nth-child(n+2)', (kv) => {
            _Translate(kv.childNodes[0], "profile");
            kv.childNodes[1].textContent = kv.childNodes[1].textContent.replace(/Worlddrowner|Worldburner|Worldshaper/, (match) => Translation.get(match));
            _Translate(kv.childNodes[1], "profile", true);
        });
        CheckTranslation(document, 'div[data-slot="card"]:nth-child(n+3) div[data-slot="card-title"]', _TypedTranslate("profile"));
        CheckTranslation(document, 'div[data-slot="card"]:nth-child(2)', div => {
            _Translate(div.children[0], "profile");
            CheckTranslation(div, 'div.w-15', _Translate);
        });
        CheckTranslation(document, 'div[data-slot="card"]:nth-child(n+3) div[data-slot="card-content"] p', p => {
            _Translate(p.childNodes[0]);
        });
        CheckTranslation(document, 'div[data-slot="card"]:nth-child(n+3) div[data-slot="card-content"] p span.ml-2.text-sm', span => {
            if(span.childNodes[0].textContent === "(Total ") span.childNodes[0].textContent = "(总计 ";
        });
    }
    // #region /upgrade
    if(window.location.pathname.endsWith("/upgrade")){
        CheckTranslation(document, "main>div>div>div>div>h2", (h2) => _Translate(h2.childNodes[0], "upgrade"));
        CheckTranslation(document, "div>div.items-end.space-x-3>div:nth-child(2)", (div) => {
            [
                div.childNodes[0],
                div.childNodes[4],
            ].forEach(_TypedTranslate("upgrade"));
        });
        CheckTranslation(document, "div>div.items-center.space-x-3>div:nth-child(3)", (div) => {
            _Translate(div.childNodes[0], "upgrade");
        });
        CheckTranslation(document, "div.text-foreground.flex.justify-between>div>span", _Translate);
    }
    // #region /enchant
    if(window.location.pathname.endsWith("/enchant")){
        CheckTranslation(document, "main>div>h2", (h2) => _Translate(h2.childNodes[0], "upgrade"));
        CheckTranslation(document, "main div.flex.flex-col.gap-2.rounded-lg.p-3", (div) => {
            [
                div.children[1].children[0].childNodes[0],
                div.children[1].children[1].childNodes[0],
                div.children[3].childNodes[0],
                div.children[3].childNodes[2],
                div.children[3].childNodes[5],
            ].forEach(_TypedTranslate("upgrade"));
        });
    }
    //#region heirloom
    if(window.location.pathname.endsWith("/heirloom")){
        CheckTranslation(document, "main>div>h2", h2 => [h2.childNodes[0], h2.childNodes[4]].forEach(_TypedTranslate("upgrade")));
        CheckTranslation(document, "main>div>div.space-x-3>div:not([class])", _TypedTranslate("upgrade"));
    }
    // #region active count
    CheckTranslation(document, 'div#root div.flex.max-h-screen.min-h-screen.flex-col.overflow-x-hidden div.flex.max-w-screen.grow.flex-col.overflow-y-scroll.lg\\:flex-row.lg\\:flex-wrap div.border-primary.w-full.max-lg\\:border-b.lg\\:w-60.lg\\:border-r div.border-primary.flex.justify-between.border-b.px-2.py-1.text-sm', (div) => {
        _Translate(div.children[0].childNodes[1]);
        _Translate(div.children[1].childNodes[1]);
    });
    document.querySelectorAll('main a[href^="/market"]:not([translated])').forEach(a => {
        a.setAttribute("translated", "");
        _Translate(a);
        _Translate(a.parentElement.children[0]);
        _Translate(a.parentElement.children[1]);
    });
    // #region dropdown
    CheckTranslation(document, 'div[data-slot="dropdown-menu-item"]', (ele) => {
        // 根据当前页面决定翻译字典类型
        const type = window.location.pathname.startsWith("/market") ? "default" : 
                     window.location.pathname === "/shop" ? "equipment" : "menuitem";
        
        // 关键：不再直接 _Translate(ele)，因为 ele 内部结构太复杂
        // 使用递归函数深入到叶子节点去翻译每一个 span 里的文字
        translateLeafTextNodes(ele, type);
    });
    // #region nav
    document.querySelectorAll(`nav a:not([translated])`).forEach(a => {
        a.setAttribute("translated", "");
        if (a.children[1] && a.children[1].textContent.trim()) {
            _Translate(a.children[1]);
        }
    });
    document.querySelectorAll(`#root > div > nav > div.border-primary.bg-background.absolute.w-full.border-b > a:not([translated])`).forEach(a => {
        a.setAttribute("translated", "");
        _Translate(a.childNodes[2]);
    });
    // #region label
    document.querySelectorAll("label:not([translated])").forEach((label) => {
        label.setAttribute("translated", "");
        _Translate(label);
    });
    // #region stat panel
    document.querySelectorAll(`body div#root div.flex.max-h-screen.min-h-screen.flex-col.overflow-x-hidden div.flex.max-w-screen.grow.flex-col.overflow-y-scroll.lg\\:flex-row.lg\\:flex-wrap div.border-primary.w-full.max-lg\\:border-b.lg\\:w-60.lg\\:border-r div.grid.grid-cols-4.gap-x-4.p-2.text-sm.lg\\:grid-cols-2 div.col-span-2.flex.justify-between span:not([translated]):nth-child(1)`).forEach(span => {
        span.setAttribute("translated", "");
        _Translate(span);
    });
    // #region popup
    document.querySelectorAll(popupSelector).forEach(div => {
        div.setAttribute("translated", "");
        if(Settings.debug) document.body.append(div.cloneNode(true));
        if(div.childNodes[0].nodeType === Node.TEXT_NODE){
            _Translate(div.childNodes[0]);
        }
        else if(div.children.length <= 2 && div.children[0].children.length === 2 && div.children[0].children[1].children.length === 2){
            const _div = div.children[0];
            _Translate(_div.children[0]);
            _Translate(_div.children[1].children[0].childNodes[0]);
            _Translate(_div.children[1].children[1].children[0]);
            _Translate(_div.children[1].children[1].children[1]);
            // if(_div.children[1].children[0].children[1]) _div.children[1].children[0].children[1].childNodes[2].textContent = " 绑定";
        }
        else if(div.children.length >= 2 && div.children[0].childNodes.length === 2 && div.children[1].childNodes.length === 2 && div.children[0].children.length === 0 && div.children[1].children.length === 0){
            // Codex popup
            div.children[0].childNodes[0].textContent = "可交易：";
            div.children[1].childNodes[0].textContent = "绑定：";
        }
        else if(div.children[0]?.children.length === 3 && div.children[0].children[0].textContent.startsWith("Potion of")){
            const div0 = div.children[0];
            const OnMutate = (_, observer) => {
                observer.disconnect();
                [
                    div0.children[0].childNodes[0],
                    div0.children[0].childNodes[1],
                    div0.children[0].childNodes[5],
                    div0.children[2].childNodes[1],
                ].forEach(_TypedTranslate("farm", true));
                observer.observe(div0, {subtree: true, childList: true, characterData: true});
            };
            const div01t = div0.children[1].textContent;
            const firstSpacePos = div01t.indexOf(" ");
            div01t.textContent = `${div01t.slice(0, firstSpacePos)}${FarmTranslation.get(div01t.slice(firstSpacePos)) ?? div01t.slice(firstSpacePos)}`
            const observer = new MutationObserver(OnMutate);
            OnMutate(undefined, observer);
        }
    });
    // #region item notice：handle the popup [not] appear in the market
    if (!window.location.pathname.startsWith("/market")) {
        document.querySelectorAll('span[class*="rarity-"]:not([translated])').forEach(span => {

            const itemName = span.textContent;
            // console.log(itemName);
            let result;

            // 如果存在名称，直接翻译就可以
            if(Translation.has(itemName)) {
                span.setAttribute("translated", "");
                span.textContent = Translation.get(itemName);
            }
            else if(result = /^ \+([^ ]+) ([A-Za-z ]+) $/.exec(span.textContent)){
                span.setAttribute("translated", "");
                span.textContent = ` +${result[1]} ${Translation.get(result[2].trim()) ?? result[2]} `;
            }
            else if (result = /^(\[?)Uncut ([A-Za-z]+)(:?)(\]?)$/.exec(itemName)) {
                span.setAttribute("translated", "");
                const lbr = result[1];
                const gemNameEN = result[2];
                const colon = result[3];
                const rbr = result[4];
                
                const gemNameCN = Translation.get(gemNameEN) ?? gemNameEN;
                span.textContent = `${lbr}未切割的${gemNameCN}${colon}${rbr}`;
            }
            else if (result = /^(\[?)([A-Za-z]+) ([A-Z]\/[A-Z]\/[A-Z])(\]?)$/.exec(itemName)) {
                span.setAttribute("translated", "");
                const lbr = result[1];      // 左括号 [ (如果有)
                const gemNameEN = result[2]; // 宝石名 Sapphire
                const stats = result[3];    // 属性 B/C/B
                const rbr = result[4];      // 右括号 ] (如果有)
                
                const gemNameCN = Translation.get(gemNameEN) ?? gemNameEN;
                span.childNodes[1].textContent = `${gemNameCN} ${stats}`;
            }
            else if(span.dataset.slot === "tooltip-trigger" || span.dataset.slot === "popover-trigger"){
                span.setAttribute("translated", "");
                // 检查是否在inventory界面的装备列表中
                if(window.location.pathname === "/inventory" &&
                    (document.querySelector("main>div:nth-child(1)>div.space-y-1")?.contains(span) ||
                    document.querySelector("main>div:nth-child(1)>div.space-y-4>div.text-sm")?.contains(span))){
 
                    // 对于inventory界面，直接翻译原始元素，不创建克隆
                    if (span.childNodes[1]) {
                        EquipTranslate(span.childNodes[1]);
 
                        // 使用MutationObserver监听变化并重新翻译
                        new MutationObserver((_, observer) => {
                            observer.disconnect();
                            if (span.childNodes[1]) {
                                EquipTranslate(span.childNodes[1]);
                            }
                            observer.observe(span, {childList: true, subtree: true, characterData: true});
                        }).observe(span, {childList: true, subtree: true, characterData: true});
                    }
                }
                // 对于profile界面，使用克隆方式（保留原有逻辑）
                else if(window.location.pathname.startsWith("/profile") && document.querySelector("main")?.contains(span)){
                    span.setAttribute("translated", "");
                    // 检查是否已经存在克隆
                    if(!span.parentElement.querySelector(":scope span[clone]")){
                        const spanClone = span.cloneNode(true);
                        span.style.opacity = "0";
                        spanClone.setAttribute("clone", "");
                        span.insertAdjacentElement("afterend", spanClone);
 
                        if (spanClone.childNodes[1]) {
                            EquipTranslate(spanClone.childNodes[1]);
                        }
 
                        new MutationObserver((_, observer) => {
                            observer.disconnect();
                            const existingClone = span.parentElement.querySelector(":scope span[clone]");
                            if(existingClone){
                                const newClone = span.cloneNode(true);
                                newClone.style.opacity = "1";
                                newClone.setAttribute("clone", "");
                                existingClone.replaceWith(newClone);
 
                                if (newClone.childNodes[1]) {
                                    EquipTranslate(newClone.childNodes[1]);
                                }
                            }
                            observer.observe(span, {childList: true, subtree: true, characterData: true});
                        }).observe(span, {childList: true, subtree: true, characterData: true});
                    }
                }
                // 对于其他界面，直接翻译
                else{
                    span.setAttribute("translated", "");
                    if (span.childNodes[1]) {
                        EquipTranslate(span.childNodes[1]);
                    }
 
                    new MutationObserver((_, observer) => {
                        observer.disconnect();
                        if (span.childNodes[1]) {
                            EquipTranslate(span.childNodes[1]);
                        }
                        observer.observe(span, {childList: true, subtree: true, characterData: true});
                    }).observe(span, {childList: true, subtree: true, characterData: true});
                }
            }
            // 无法翻译物品
            else console.log("cannot translate|"+itemName+"|");
        });
    }
    // #region equip detail
    document.querySelectorAll('div[class*="rarity-"].bg-popover:not([translated])').forEach(div => {
        div.setAttribute("translated", "");
        div.querySelectorAll(":scope div.font-bold.text-lg").forEach(div => EquipTranslate(div));
        div.querySelectorAll(":scope div.text-foreground.flex.justify-between:not(.gap-2)").forEach(div => _Translate(div.children[0]));
        div.querySelectorAll(":scope div.text-foreground\\/70.flex").forEach(div => _Translate(div.children[0]));
        div.querySelectorAll(":scope div.text-foreground\\/70.text-sm").forEach(div => _Translate(div));
        div.querySelectorAll(":scope .text-sm.underline.select-none").forEach(link => {
            _Translate(link);
            if(Settings.enableTestFeature) link.insertAdjacentElement("afterend", HTML("div", {class: "text-foreground float-right cursor-pointer text-sm underline select-none", _click: () => AddToAnalysis(div)}, " 加入分析"));
        });
        div.querySelectorAll(":scope div.text-foreground.mb-2.flex.justify-between.gap-2").forEach(div => {
            const div00 = div.children[0].childNodes[0];
            if(div00.textContent === "No Requirement") div00.textContent = "无等级";
            else{
                const result = /(.*) ([0-9]+)/.exec(div00.textContent);
                if(result) div00.textContent = `${Translation.get(result[1]) ?? result[1]} ${result[2]}`;
            }
            _Translate(div.children[1].childNodes[0]);
            _Translate(div.children[1].childNodes[2])
        });
        // Enchantment
        div.querySelectorAll(":scope div.flex.justify-between.text-green-500").forEach(div => _Translate(div.children[0]));
    });
    // #region tab button
    document.querySelectorAll('div.font-chatbox button[role="tab"]:not([translated])').forEach(button => {
        button.setAttribute("translated", "");
        _Translate(button.childNodes[0], "chat", true);
    });
    document.querySelectorAll('button[role="tab"]:not([translated]), button[data-slot="button"]:not([translated])').forEach(button => {
        button.setAttribute("translated", "");
        button.childNodes.forEach(node => _Translate(node));
    });
    CheckTranslation(document, 'span[data-slot="tabs-trigger"]', _Translate);
 
    document.querySelectorAll(researchSelector).forEach(div => {
        div.dataset.state = "translated"; 
        div.querySelectorAll(":scope h2.my-4.text-2xl").forEach(h2 => {
            _Translate(h2.childNodes[0]);
        });
        div.querySelectorAll(":scope div.my-4.flex.items-center.justify-between").forEach(h2 => {
            _Translate(h2.childNodes[0]);
        });
        div.querySelectorAll(":scope div.small-caps.text-xl:nth-child(1)").forEach(div => {
            _Translate(div.children[0]);
        });
        div.querySelectorAll(":scope div.text-sm:nth-child(2)").forEach(div => {
            div.childNodes[0].textContent = "当前加成等级：";
        });
        div.querySelectorAll(":scope div.text-sm:nth-child(4)").forEach(div => {
            div.childNodes[0].textContent = "提升 ";
            div.childNodes[2].textContent = " 级 (";
            div.childNodes[5].textContent = ") 使用 ";
        });
    });
    // #region select
    document.querySelectorAll(`div[role="option"][data-slot="select-item"] [id^="radix-"]:not([translated])`).forEach(rootEle => {
        rootEle.setAttribute("translated", "");
        translateLeafTextNodes(rootEle);
    });
    // #region select-trigger
    document.querySelectorAll('button[data-slot="select-trigger"] span[data-slot="select-value"]:not([translated])').forEach(rootEle => {
        translateLeafTextNodes(rootEle);
    });
    // #region placeholder
    CheckTranslation(document, 'input[placeholder][data-slot="input"]', input => input.placeholder = PlaceholderTranslation.get(input.placeholder) ?? input.placeholder);
    // #region chat/log
    CheckTranslation(document, 'div.border-primary.shrink-0.border-t div.scrollbar-thin.scrollbar-track-transparent.flex-1.overflow-y-auto.pl-1.text-sm div.leading-4\\.5>span:nth-child(1):nth-last-child(1) span.text-gray-300', span => {
        const node = span.childNodes[0];
        const tl = EquipTranslation.get(node.textContent);
        if(tl) node.textContent = tl;
    });
    CheckTranslation(document, 'div.border-primary.shrink-0.border-t div.scrollbar-thin.scrollbar-track-transparent.flex-1.overflow-y-auto.pl-1.text-sm div.leading-4\\.5>span:nth-child(1):nth-last-child(1)', span => {
        const timestampEle = span.children[0];
        let result;
        if(result = /([A-Za-z]+) borrowed you a /.exec(span.childNodes[2]?.textContent ?? "")){
            span.childNodes[2].textContent = `${result[1]} 借给了你 `;
            return;
        }
        if(result = /([A-Za-z]+) sent you a /.exec(span.childNodes[2]?.textContent ?? "")){
            span.childNodes[2].textContent = `${result[1]} 送给了你 `;
            return;
        }
        if(result = /([A-Za-z]+) sent you ([^ ]+) /.exec(span.childNodes[2]?.textContent ?? "")){
            span.childNodes[2].textContent = `${result[1]} 送给了你 ${result[2]} `;
            return;
        }
        const message = span.children[1];
        if(!message) {
            console.log("no message", span.innerHTML);
            return;
        }
        const channel = /text-\[var\(--channel-([^\)]+)\)\]/.exec(span.getAttribute("class") ?? "")?.[1] ?? "all";
        if(channel === "whispers") {
            // should be whisper
            span.childNodes[2].textContent = {"From ":"来自 ","To ":"发给 "}[span.childNodes[2].textContent] ?? span.childNodes[2].textContent;
            return;
        }
        WatchNode(message, (message) => {
            const node = message.childNodes[1];
            if(message.childNodes[1].nodeType === Node.TEXT_NODE){
                const result = ChatTranslation.get(node.textContent + channel);
                if(result) node.textContent = result;
            }
        });
        const isSystem = !message.querySelector("span[aria-haspopup='menu']");
        const nodes = [...message.childNodes].slice((message.childNodes[2].nodeType === Node.TEXT_NODE && message.childNodes[2].textContent === " ") ? 3 : 2);
        // LogTranslator 调用 3 ，处理其他所有情况
        if(isSystem) LogTranslator(channel, nodes);
    });
    // #region loot tracker
    CheckTranslation(document, `div#root div.flex.max-h-screen.min-h-screen.flex-col.overflow-x-hidden div.flex.max-w-screen.grow.flex-col.overflow-y-scroll.lg\\:flex-row.lg\\:flex-wrap div.border-primary.flex.w-full.shrink-0.flex-col.p-2.text-xs.max-lg\\:border-t.lg\\:w-70.lg\\:border-l div.relative.mb-1.text-center.text-lg`, div => _Translate(div.childNodes[0]));
    // #region connection lost
    CheckTranslation(document, `div#root div.bg-background\\/75.fixed.inset-0.z-50.flex.items-center.justify-center div.bg-card\\/50.border-primary.rounded-lg.border.p-6.text-center.shadow-lg`, (div) => {
        _Translate(div.children[0]);
        _Translate(div.children[2]);
    });
    document.querySelectorAll('button[role="combobox"][aria-controls^="radix-"] span[data-slot="select-value"]:nth-child(1):not([translated])').forEach(span => {
        if(Settings.debug) document.body.append(span.cloneNode(true));
        span.setAttribute("translated", "");
        if(span.parentElement.title === "Attack with magic type"){
            span.parentElement.title = "选择用于攻击的元素类型";
            return;
        }
        if(span.querySelector(":scope div.flex.items-center.gap-2") && span.children[0].children[1].childNodes[3]){
            return;
            const toTranslate = span.children[0].children[1].childNodes[3];
            const wrapper = toTranslate.parentElement;
            const clone = wrapper.cloneNode(true);
            wrapper.insertAdjacentElement("afterend", clone);
            wrapper.setAttribute("hidden", "");
            _Translate(clone.childNodes[3]);
            new MutationObserver(() => {const _clone = wrapper.cloneNode(true); clone.replaceWith(_clone); _Translate(_clone.childNodes[3])}).observe(wrapper, {childList: true, subtree: true, characterData: true});
        }
        const clone = span.cloneNode(true);
        span.insertAdjacentElement("afterend", clone);
        _Translate(clone);
        span.setAttribute("hidden", "");
        new MutationObserver(() => {const _clone = span.cloneNode(true); _Translate(_clone); _clone.removeAttribute("hidden"); span.nextElementSibling.replaceWith(_clone)}).observe(span, {childList: true, subtree: true, characterData: true});
    });
    // #region dialog
    CheckTranslation(document, 'div[data-slot="dialog-content"]', (div) => {
        const titleEle = div.querySelector(":scope [data-slot='dialog-title']");
        if(!titleEle){
            console.log("cound not find dialog title");
            return;
        }
        const title = titleEle.textContent;
        let result;
        if(title.startsWith("List [")){
            titleEle.childNodes[0].textContent = "挂单 ";
        }
        else if(result = /Are you sure you want to disenchant ([0-9]+) items?\?/.exec(title)){
            titleEle.textContent = `确定要分解 ${result[1]} 件装备吗？` ;
            div.children[0].children[1].children[0].textContent = "你将获得";
        }
        else if(result = /Transfer \[[^\]]+\]/.exec(title)){
            titleEle.childNodes[0].textContent = "赠送 ";
        }
        else switch(title){
            case "Confirm guild upgrade":{
                const text = div.children[0].childNodes[1].textContent;
                const result = /Are you sure you want to upgrade (.*)/.exec(text);
                if(!result) break;
                div.children[0].childNodes[1].textContent = `确定要升级${Translation.get(result[1])}吗？`;
                break;
            }
            case "Enchant item":{
                CheckTranslation(div, "div.flex.flex-col.gap-2.rounded-lg.p-3", div => {
                    [
                        div.children[1].children[0].childNodes[0],
                        div.children[1].children[1].childNodes[0],
                        div.children[3].childNodes[0],
                        div.children[3].childNodes[2],
                        div.children[3].childNodes[5],
                    ].forEach(_TypedTranslate("dialog"))
                });
                break;
            }
            case "Upgrade potions":{
                _Translate(div.children[0].children[1].childNodes[0], "dialog");
                break;
            }
            case "Are you sure":{
                div.children[0].childNodes[1].textContent = "要取消事件排队吗？"
                break;
            }
            case "Confirm upgrade":{
                div.children[0].children[1].childNodes[0].textContent = "确定要使用 ";
                const _ = [...div.children[0].children[1].childNodes].at(-1)
                _.textContent = " 升级吗？";
                break;
            }
            case "Discard potions":{
                div.children[0].childNodes[1].textContent = "你确定要丢弃这瓶药水吗？";
                break;
            }
            case "Leave Event Queue":{
                _Translate(div.children[0].childNodes[1], "dialog");
                break;
            }
            case "Total Contributions":{
                const lastCh = div.querySelector("div[data-slot='dialog-header']>div:nth-last-child(1)");
                if(lastCh.childNodes[0].textContent === "Battle XP") lastCh.childNodes[0].textContent = "战斗经验";
                break;
            }
        }
        _Translate(titleEle, "dialog");
    })
    //#region toast
    CheckTranslation(document, "ol.toaster.group", (ol) => ol.style.removeProperty("font-family"));
    CheckTranslation(document, "ol.toaster.group>li[data-sonner-toast] div[data-title]", _TypedTranslate("toast"));
    // #region elnaeth
    // 属性掉落记录
    CheckTranslation(document, "#shard-drop-range", span => {
        new MutationObserver((mutlist, observer) => {
            observer.disconnect();
            result = /([^ ]+) to ([^ ]+)/.exec(span.textContent);
            if(result) span.textContent = `${result[1]} 至 ${result[2]}`;
            observer.observe(span, {childList: true, subtree: true, characterData: true});
        }).observe(span, {childList: true, subtree: true, characterData: true});
    })
    CheckTranslation(document, "div.elnaeth-stats-log.text-center.text-lg", div => {
        div.textContent = div.textContent.trim();
        _Translate(div);
    });
    CheckTranslation(document, "div.elnaeth-items-log.text-center.text-lg", div => {
        const node = div.childNodes[0];
        node.textContent = node.textContent.trim();
        _Translate(node);
    });
    CheckTranslation(document, "#reset-stat-tracker", button => button.textContent = "重置");
    CheckTranslation(document, 'div[title="Kindly provided by Elnaeth. Tips appreciated!"]>button.m-0.p-1.bg-red-500.text-sm.text-white.rounded.cursor-pointer', button => button.textContent = "重置");
    CheckTranslation(document, "#elnaeth-settings-button", (button) => {
        _Translate(button);
    });
    CheckTranslation(document, "#tracker-modal h1.text-left.float-left", _Translate);
    CheckTranslation(document, "#tracker-modal h2:not([class])", _Translate);
    CheckTranslation(document, "#save-tracker-settings", _Translate);
    CheckTranslation(document, ".item-qol-container.text-sm>span", span => {
        let result;
        if(result = ElnaethTranslation.get(span.title)){
            span.title = result;
            const kv = span.textContent.split(": ");
            if(kv[1]) span.textContent = `${result}：${kv[1]}`;
        }
        if(result = Translation.get(span.title)){
            span.title = result;
            const kv = span.textContent.split(": ");
            if(kv[1]) span.textContent = `${result}：${kv[1]}`;
        }
        else if(span.textContent === "Missing enchant"){
            span.textContent = "未附魔";
        }
        else if(span.title === "Item Quality"){
            span.title = "品质";
            const kv = span.textContent.split(": ");
            span.textContent = `品质：${kv[1]}`;
        }
        else if(result = /([^ ]+) \/ ([^ ]+) \(([^\)]+)\) (.*)/.exec(span.textContent)){
            span.textContent = `${result[1]} / ${result[2]} (${result[3]}) ${Translation.get(result[4].trim()) ??  result[4]}`;
        }
        else if(result = /<([^ ]+) set>/.exec(span.textContent)){
            span.textContent = `<${result[1]}>`;
        }
    })
} catch(e) {
    console.error(e);
    // console.log("TODO")
}};
// #region eventTrans
const TranslateEventConfig = [
    {
        id: "quest",
        title: ["Quest Progress"],
        childrenLength: 2,
        OnProgress: (div) => {
            const questContent = div.querySelector(":scope p.text-foreground.text-sm");
            if(Settings.notifyQuestComplete && Number(questContent.childNodes[1].textContent) === Number(questContent.childNodes[3].textContent)) {
                new Notification("任务完成", { requireInteraction: true, });
            }
        },
        TLOnProgress: (div) => {
            const questContent = div.querySelector(":scope p.text-foreground.text-sm");
            _Translate(questContent.childNodes[0], "default", true);
            _Translate(questContent.childNodes[4], "default", true);
            if(div.children[3]) _Translate(div.children[3].childNodes[0]);
        }
    },
    {
        id: "rift of power",
        title: ["Siphon Rift of Power", "Siphoning Rift of Power"],
        childrenLength: 2,
        OnStart: () => {
            if(Settings.notifyPowerRiftBegin) new Notification("力量裂隙已出现！", {requireInteraction: true});
        },
        TLOnProgress: (div) => {
            _Translate(div.querySelector(":scope>div:nth-last-child(1)").childNodes[1], "default", true);
        },
    },
    {
        id: "elemental rift",
        title: ["Queue for Elemental Rift", " Elemental Rift"],
        childrenLength: 2,
        OnStart: () => {
            if(Settings.notifyElementalRiftBegin) new Notification("元素裂隙已出现！", {requireInteraction: true});
        },
        TLOnProgress: (div) => {
            if(Settings.doTranslate) {
                const content = div.querySelector(":scope>div:nth-last-child(1)");
                [...content.childNodes].filter(node => node).forEach(node => _Translate(node, "default", true));
            }
        },
    }
];
const MappedTranlsateEventConfig = new Map(TranslateEventConfig.flatMap((config) => config.title.map(title => [title, config])));
const TranslateEvent = () => {
    document.querySelectorAll("div.border-primary div.grid-cols-4 div.col-span-4 div.p-2.w-full:not([translated])").forEach(div => {
        if(!Settings.doTranslate) return;
        const config = MappedTranlsateEventConfig.get(div.children[0]?.textContent);
        if(!config || div.children.length !== config.childrenLength) return;
        div.setAttribute("translated", "");
        if(Settings.doTranslate){
            const title = div.children[0];
            const titleClone = title.cloneNode(true);
            titleClone.setAttribute("clone", "");
            title.setAttribute("hidden", "");
            title.insertAdjacentElement("afterend", titleClone);
        }
        config.OnStart?.(div);
        const OnEventlikeProgress = (mutlist, observer) => {
            observer.disconnect();
            config.OnProgress?.(div);
            if(Settings.doTranslate){
                const clone = div.querySelector(":scope [clone]");
                const newClone = div.children[0].cloneNode(true);
                newClone.removeAttribute("hidden");
                newClone.setAttribute("clone", "")
                _Translate(newClone);
                clone.replaceWith(newClone);
                config.TLOnProgress?.(div);
            }
            observer.observe(div, {childList: true, subtree: true, characterData: true});
        };
        const observer = new MutationObserver(OnEventlikeProgress);
        OnEventlikeProgress(undefined, observer);
    })
};
// #region FAQ
const FAQClick = (ev) => {
    ev.preventDefault();
    const main = document.querySelector("main");
    history.pushState("hello", "", "/faq")
}
const AddFAQ = () => {
    if(document.getElementById("manarion-ch-trans-faq")) return;
    const nav = document.querySelector("html.dark.notranslate body div#root div.flex.max-h-screen.min-h-screen.flex-col.overflow-x-hidden nav.bg-card.small-caps.border-primary.z-1.w-full.max-w-screen.border-b.shadow-md div.flex.items-center.px-4.py-2 div.ml-auto.flex.w-full.max-w-full.items-center.gap-2 div.flex.w-0.flex-shrink.flex-grow.justify-end.gap-1.overflow-x-hidden");
    if(!nav) return;
    nav.insertAdjacentElement("beforeend",
        HTML("a", {
            id: "manarion-ch-trans-faq",
            class: "text-muted-foreground hover:bg-primary/50 ring-primary mx-1 my-1 flex flex-shrink-0 items-center gap-2 rounded-lg px-1 py-1 transition hover:ring",
            href: "/faq",
            translated: "",
            _click: FAQClick
        },
            HTML("span", {class: "hidden lg:inline"}, "常见问题")
        )
    )
}
// #region FontSelect
const CreateFontSelect = (settingsProp, FontOptions, FontOptionsLookup, lang) => {
    return HTML("div", {class: "font-selector", _click: (ev) => {
        const self = ev.currentTarget;
        const rect = self.getBoundingClientRect();
        const detectBox = HTML("div", {class: "detect-box fixed"});
        document.body.append(detectBox);
        detectBox.style.width = `${rect.width + 2}px`;
        detectBox.style.height = `${rect.height + 2}px`;
        detectBox.style.top = `${rect.top - 1}px`;
        detectBox.style.left = `${rect.left - 1}px`;
        const thresholds = [];
        for(let i = 0; i <= 1; i += 0.01) thresholds.push(i);
        new IntersectionObserver((entries, observer) => {
            entries.sort((a, b) => b.time - a.time);
            const rect = self.getBoundingClientRect();
            const topHeight = rect.top;
            detectBox.style.width = `${rect.width + 2}px`;
            detectBox.style.height = `${rect.height + 2}px`;
            detectBox.style.top = `${rect.top - 1}px`;
            detectBox.style.left = `${rect.left - 1}px`;
            const bottomHeight = window.innerHeight - rect.bottom;
            if(topHeight > bottomHeight){
                document.body.style.setProperty("--font-family-options-wrapper-top", "5px");
                document.body.style.setProperty("--font-family-options-wrapper-height", `${topHeight - 10}px`);
            }
            else{
                document.body.style.setProperty("--font-family-options-wrapper-top", `${rect.bottom + 5}px`);
                document.body.style.setProperty("--font-family-options-wrapper-height", `${bottomHeight - 10}px`);
            }
            document.body.style.setProperty("--font-family-options-wrapper-right", `${window.innerWidth - rect.right}px`);
            document.body.style.setProperty("--font-family-options-wrapper-min-width", `${rect.width}px`);
        }, {root: detectBox, threshold: thresholds}).observe(self);
        self.querySelector(":scope>.font-family-options-background")?.removeAttribute("hidden");
    }},
        HTML("div", {class: "font-family-name", "data-active-font": Settings[settingsProp]}, FontOptionsLookup.get(Settings[settingsProp])),
        dropdownArrowSVG.cloneNode(true),
        HTML("div", {class: "font-family-options-background", hidden: "", _click: (ev) => {
            ev.stopPropagation();
            ev.currentTarget.setAttribute("hidden", "");
            document.querySelectorAll(".detect-box").forEach(ele => ele.remove());
        }},
            HTML("div", {class: "font-family-options-wrapper scrollbar-thin scrollbar-track-transparent"},
                ...FontOptions.map(([fontFamily, fontName]) =>
                    HTML("div", {class: "font-family-option", "data-font-family": fontFamily, "data-selected": Settings[settingsProp] === fontFamily, _pointerenter: (ev) => {
                        ev.stopPropagation();
                        const curr = ev.currentTarget;
                        const fontFamily = curr.dataset.fontFamily;
                        const root = document.documentElement;
                        root.style.setProperty(`--temp-font-family-${lang}`, fontFamily);
                        curr.parentElement/*wrapper*/.parentElement/*background*/.parentElement/*selector*/.children[0].textContent = FontOptionsLookup.get(fontFamily);
                    }, _pointerleave: (ev) => {
                        ev.stopPropagation();
                        const curr = ev.currentTarget;
                        const fontFamily = curr.dataset.fontFamily;
                        const root = document.documentElement;
                        if(root.style.getPropertyValue(`--temp-font-family-${lang}`) === fontFamily){
                            root.style.removeProperty(`--temp-font-family-${lang}`);
                            const select = curr.parentElement/*wrapper*/.parentElement/*background*/.parentElement/*selector*/.children[0];
                            select.textContent = FontOptionsLookup.get(select.dataset.activeFont);
                        }
                    }, _click: (ev) => {
                        const curr = ev.currentTarget;
                        const fontFamily = curr.dataset.fontFamily;
                        Settings[settingsProp] = fontFamily;
                        const root = document.documentElement;
                        root.style.setProperty(`--curr-font-family-${lang}`, fontFamily);
                        const selectEle = curr.parentElement/*wrapper*/.parentElement/*background*/.parentElement/*selector*/.children[0];
                        selectEle.textContent = curr.children[0].textContent;
                        selectEle.dataset.activeFont = curr.dataset.fontFamily;
                        curr.parentElement/*wrapper*/.querySelectorAll(":scope .font-family-option[data-selected='true']").forEach(div => div.dataset.selected = "false");
                        curr.dataset.selected = true;
                    }},
                        HTML("span", {class: "font-family-option-text flex-grow", style: `font-family: ${fontFamily}`}, fontName),
                        tickSVG.cloneNode(true),
                    ),
                )
            )
        ),
    );
};
// #region Settings
const AddSettings = () => {
    if(document.body && !document.getElementById(SettingPanelID)){
        document.body.append(
            HTML("div", {id: SettingPanelID, hidden: "", _click: (ev) => {
                document.getElementById(SettingPanelID).setAttribute("hidden", "");
            }},
                HTML("div", {id: "setting-panel", class: "min-w-[400px] h-fit rounded-[4px] space-y-4 z-50 border-primary p-6 scrollbar-thin scrollbar-track-transparent", _click: (ev) => {
                    ev.stopPropagation();
                }},
                    HTML("div", {class: "flex"},
                        HTML("div", {class: "flex-grow text-2xl"}, "汉化脚本设置"),
                        HTML("button", {id: UpdateButtonID, "data-href": GM_info.script.downloadURL, class: ButtonClass, translated: "", hidden: "", _click: (ev) => {
                            const a = HTML("a", {href: ev.currentTarget.dataset.href, target: "_blank", download: "", hidden: "", style: "display:none;"});
                            a.click();
                        }}, "有可用更新"),
                    ),
                    ...[
                        ["doTranslate", "是否汉化", "更改此设置将刷新页面", "bool", () => window.location.reload()],
                        ["manaDustName", "Mana Dust 译名", "更改此设置将刷新页面", "input", () => window.location.reload()],
                        ["fontFamily", "游戏字体", "可分别设置英文和中文字体", "font"],
                        ["notifyQuestComplete", "任务完成提醒", "在未手动点击之前不会消失", "bool"],
                        ["notifyElementalRiftBegin", "元素裂隙通知", "未手动点击之前不会消失", "bool"],
                        ["notifyPowerRiftBegin", "力量裂隙通知", "未手动点击之前不会消失", "bool"],
                        ["notifyDeaths", "死亡时通知", "防止脱下装备忘记穿回", "bool"],
                        //["notifyWithInterval", "定时发送通知", "例：用于提醒定期检查市场", "input"],
                        ["debug", "开启测试模式", "会影响正常使用", "bool", () => window.location.reload()],
                        ["enableTestFeature", "开启开发中功能", "会影响正常使用", "bool", () => window.location.reload()],
                    ].map(([settingProp, description, info, type, ...args]) => {
                        switch(type){
                            case "bool":
                                return HTML("div", {class: "flex items-center gap-2 mr-1"},
                                    HTML("div", {class: "flex-grow flex flex-col"},
                                        HTML("label", {translated: ""}, description),
                                        ...(info ? [
                                            HTML("label", {class: "text-xs", translated: ""}, info)
                                        ] : []),
                                    ),
                                    HTML("button", {class: SwitchClass, type: "button", role: "switch", "aria-checked": Settings[settingProp], "data-state": Settings[settingProp] ? "checked" : "unchecked", value: "on", "data-slot": "switch", _click: (ev) => {
                                        const button = ev.currentTarget;
                                        const cur = button.dataset.state === "checked";
                                        button.dataset.state = cur ? "unchecked" : "checked";
                                        button.setAttribute("aria-checked", cur ? "false" : "true");
                                        button.children[0].dataset.state = cur ? "unchecked" : "checked";
                                        Settings[settingProp] = !cur;
                                        args[0]?.();
                                    }},
                                        HTML("span", {class: SwitchBallClass, "data-state": Settings[settingProp] ? "checked" : "unchecked", "data-slot": "switch-thumb"})
                                    ),
                                );
                            case "input":
                                return HTML("div", {class: "flex items-center gap-2 mr-1"},
                                    HTML("label", {class: "flex-grow", translated: ""}, description),
                                    HTML("input", {class: InputClass, "data-slot": "input", type: 'text', value: Settings[settingProp], translated: '', _change: (ev) => {
                                        Settings[settingProp] = ev.target.value;
                                    }}),
                                );
                            case "font":
                                return HTML("div", {class: "flex items-center gap-2 mr-1"},
                                    HTML("div", {class: "flex-grow flex flex-col"},
                                        HTML("label", {translated: ""}, description),
                                        ...(info ? [
                                            HTML("label", {class: "text-xs", translated: ""}, info)
                                        ] : []),
                                    ),
                                    CreateFontSelect("fontFamilyEn", FontEnOptions, FontEnOptionsLookup, "en"),
                                    CreateFontSelect("fontFamily", FontOptions, FontOptionsLookup, "zh"),
                                )
                        }
                    }),
                )
            )
        );
    }
};
const AddSettingsNavItem = () => {
    if(document.getElementById(`${SettingPanelID}-nav`)) return;
    const navs = document.querySelector("nav div.ml-auto.flex");
    navs?.append(
        HTML("a", {id: `${SettingPanelID}-nav`, class: "cursor-pointer text-muted-foreground hover:bg-primary/50 ring-primary mx-1 my-1 flex flex-shrink-0 items-center gap-2 rounded-lg px-1 py-1 transition hover:ring", "data-discover": 'true', translated: '', _click: (ev) => {
            ev.preventDefault();
            ev.stopPropagation();
            document.getElementById(SettingPanelID)?.removeAttribute("hidden");
        }},
            HTML("div", {class: 'relative'},
                translateSettingsSVG.cloneNode(true),
                dotSVG.cloneNode(true),
            ),
            HTML('span', {class: 'hidden lg:inline'}, "汉化设置"),
        )
    )
};
const CheckDeaths = () => {
    const set = Temp.DeathNotificationSet;
    if(Temp.Deaths && unsafeWindow.manarion && unsafeWindow.manarion.player.CurrentEnemyDeaths > Temp.Deaths){
        const note = new Notification("角色死亡");
        [...set.keys()].forEach(note => {
            set.delete(note);
            note.close();
        });
        set.add(note);
        note.addEventListener("close", (note) => set.has(note) ? set.delete(note) : undefined);
    }
    if(unsafeWindow.manarion){ Temp.Deaths = unsafeWindow.manarion.player.CurrentEnemyDeaths; }
    setTimeout(CheckDeaths, 1000);
}
CheckDeaths();

// #region OnMutate
const OnMutate = async (mutlist, observer) => {
    observer.disconnect();
    AddSettings();
    AddSettingsNavItem();
    if(Settings.doTranslate){
        FindAndReplaceText();
    }
    TranslateEvent();
    if(ADD_FAQ) AddFAQ();
    observer.observe(document, {subtree: true, childList: true});
};
 
setTimeout(() => {
    observer = new MutationObserver(OnMutate).observe(document, {subtree: true, childList: true});
}, 1000);
 
const wakeElnaeth = () => {
    // console.log("wakeElnaeth");
    let next = 3000;
    if(!elnaethWaken && !document.getElementById("elnaeth-settings-button")){
        window.dispatchEvent(new Event("load"));
        setTimeout(wakeElnaeth, next *= 2);
    }
};
console.log('chinese translation loaded');
wakeElnaeth();