// ==UserScript==
// @name RavenIdle 简单汉化
// @namespace https://dev.ravenidle.com
// @version 1.0.3
// @description 遗漏很多的汉化
// @match https://dev.ravenidle.com/*
// @run-at document-start
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/549094/RavenIdle%20%E7%AE%80%E5%8D%95%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/549094/RavenIdle%20%E7%AE%80%E5%8D%95%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  const exactMap = {
    // Auth / 登录
    "Back to login": "返回登录",
    "Email Address": "邮箱地址",
    "Enter Your Email to Recover Your Password": "输入邮箱以找回密码",
    "Recover my password": "找回我的密码",
    "A password recovery link has been sent to your email":
      "密码找回链接已发送到你的邮箱",
    Password: "密码",
    "Account Name or Email": "账号名或邮箱",
    "Remember account name": "记住账号名",
    "Create new account": "创建新账号",
    "Sign in with Google": "使用 Google 登录",
    "Sign in with Telegram": "使用 Telegram 登录",
    "Sign in to my account": "登录到我的账号",
    "Login with RavenQuest": "使用 RavenQuest 登录",
    "Please confirm the captcha": "请确认验证码",
    "I forgot my password": "我忘记密码",
    "Resend email to validate my account": "重发验证邮件",
    "Trouble signing in?": "登录遇到问题？",
    "Code of Conduct": "行为准则",
    "By logging in, you agree with the": "登录即表示你同意",
    "Unable to log in, please try again later": "暂时无法登录，请稍后再试",
    "Invalid Code": "无效的验证码",

    // Register / 注册
    "Login to my account": "登录我的账号",
    "Create Account": "创建账号",
    "Subscribe to our mailing list": "订阅我们的邮件列表",
    "Terms of Service": "服务条款",
    "I agree to the": "我同意",
    Username: "用户名",
    "Confirm Password": "确认密码",
    "Registration successful! Click the Send Link button to confirm your email.":
      "注册成功！点击“发送链接”按钮以确认邮箱。",
    "Send confirmation link": "发送确认链接",
    "Confirmation link sent, check your email for confirmation":
      "确认链接已发送，请在邮箱中查收",

    // Common / 通用
    Activate: "激活",
    Active: "已激活",
    Back: "返回",
    Battle: "战斗",
    Buy: "购买",
    Cancel: "取消",
    Confirm: "确认",
    Cost: "花费",
    Current: "当前",
    Delete: "删除",
    Destroy: "销毁",
    Distance: "距离",
    "End Hunt": "结束狩猎",
    Equip: "装备",
    Finish: "完成",
    "Follow us": "关注我们",
    "Hide Options": "隐藏选项",
    Inactive: "未激活",
    Leave: "离开",
    Logout: "退出登录",
    Loot: "战利品",
    Materials: "材料",
    Move: "移动",
    Next: "下一步",
    No: "否",
    "Not Linked": "未关联",
    "Not Used": "未使用",
    OR: "或",
    "Play Now": "立即游玩",
    Prev: "上一步",
    Preview: "预览",
    Rarity: "稀有度",
    "Resend code": "重发验证码",
    Reset: "重置",
    Reward: "奖励",
    Rewards: "奖励",
    Save: "保存",
    "Save Changes": "保存更改",
    "See more": "查看更多",
    Sell: "出售",
    "Show Options": "显示选项",
    Summary: "摘要",
    "Time Left": "剩余时间",
    "Time spent": "已用时间",
    Unequip: "卸下",
    Used: "已使用",
    "Verification Code": "验证码",
    Experience: "经验",
    Yes: "是",
    "You do not have permission to access this page": "你没有访问该页面的权限",

    // Layout / 侧边栏
    Achievements: "成就",
    "Adventurer's Board": "冒险者布告",
    Alchemy: "炼金",
    "Battle Pass": "战斗通行证",
    Blacksmithing: "锻造",
    Breeding: "繁育",
    Carpentry: "木工",
    Character: "角色",
    Settings: "设置",
    Cooking: "烹饪",
    Crafting: "制作",
    Dungeons: "地下城",
    Farming: "农耕",
    Fishing: "钓鱼",
    Gathering: "采集",
    "Gladiator Arena": "角斗场",
    Herbalism: "草药学",
    Husbandry: "畜牧",
    Infusion: "注灵",
    Land: "领地",
    Leaderboard: "排行榜",
    Map: "地图",
    Mining: "采矿",
    Monsters: "怪物",
    "Munk Shop": "Munk 商店",
    "Prize Pool": "奖池",
    Merchant: "商人",
    "Skill Tree": "技能树",
    Tradepacks: "商队包裹",
    Trophies: "奖杯",
    "Utilities (optional)": "实用工具（可选）",
    Weaving: "织布",
    Woodcutting: "伐木",

    // Character / 角色
    Class: "职业",
    "Attack Power": "攻击力",
    "Defense Power": "防御力",
    Equipment: "装备",
    Inventory: "背包",
    "No class": "无职业",
    Points: "点数",
    "Choose Your Name": "选择你的名字",
    "Create your Character": "创建你的角色",
    "Select Your Archetype": "选择你的原型",
    "Back to the game": "返回游戏",

    // Monsters / 怪物
    "In Battle": "战斗中",
    "Battle Mode": "战斗模式",
    "Recent Loot": "最近掉落",
    "Monsters List": "怪物列表",
    "You Died": "你已阵亡",
    "Monsters Killed": "击杀数",
    "Total Items": "物品总数",
    "Total Time": "总时长",
    "Experience Gained": "获得经验",

    // Shop / 商店
    "Buy Item": "购买物品",
    "Sell Item": "出售物品",
    "Unable to purchase item": "无法购买物品",
    "Item purchased successfully": "购买成功",
    "Unable to sell item": "无法出售物品",
    "Item sold successfully": "出售成功",
    "Check all": "全选",
    "Uncheck all": "取消全选",
    "Lost Merchant": "迷失的商人",

    // Cookies / 隐私提示
    "Privacy Policy": "隐私政策",

    "Primary Attributes": "主要属性",
    Vitality: "体质",
    Might: "力量",
    Intelligence: "智力",
    Dexterity: "敏捷",
    Wisdom: "智慧",
    "Secondary Attributes": "次要属性",
    "Physical Attack": "物理攻击",
    "Magic Attack": "魔法攻击",
    "Physical Defense": "物理防御",
    "Magic Defense": "魔法防御",
    "Healing Power": "治疗强度",
    "Health Regeneration": "生命回复",
    "Mana Regeneration": "法力回复",
    "Max Health": "最大生命值",
    "Max Mana": "最大法力值",
    "Critical Chance": "暴击几率",
    "Critical Damage": "暴击伤害",
    Cooldown: "冷却",
    RESET: "重置",
    SAVE: "保存",
    "Gathering Mode": "采集模式",
    mining: "采矿",
    woodcutting: "伐木",
    "My Trophies": "我的奖杯",
    "Trophies List": "奖杯列表",
    Profile: "个人资料",
    Sounds: "声音",
    "Master Volume": "主音量",
    "Music Volume": "音乐音量",
    "Combat Volume": "战斗音量",
    Interface: "界面",
    Professions: "专业",
    "Gathering (Drop Down)": "采集（下拉）",
    "Mining Volume": "采矿音量",
    "Woodcutting Volume": "伐木音量",
    "Crafting (Drop Down)": "制作（下拉）",
    "Blacksmithing Volume": "锻造音量",
    "Carpentry Volume": "木工音量",
    "Cooking Volume": "烹饪音量",
    "Weaving Volume": "织布音量",
    Notifications: "通知",
    Linking: "账号关联",
    "Skill Order": "技能顺序",
    Consumables: "消耗品",
    "When to use health potions?": "血药阈值",
    "When to use drinks and foods?": "吃喝阈值",
    "Latest Gathering Items": "最近获得物品",
    blacksmithing: "锻造",
    carpentry: "木工",
    cooking: "烹饪",
    weaving: "织布",
    butchering: "屠宰",
    farming: "农耕",
    gathering: "采集",
    husbandry: "畜牧",
    "Spend Silver": "花费银币",
    easy: "简单",
    medium: "中等",
    hard: "困难",
    "One monster spawns. Ideal for quick battles and single-target attacks.":
      "只出现一只怪物，适合快速战斗和单体攻击。",
    Warfare: "战争",
    Archery: "弓术",
    Shadow: "暗影",
    Protection: "防护",
    Wizardry: "魔法",
    Holy: "神圣",
    Spiritual: "灵术",
    Witchcraft: "巫术",
    ARCHETYPE: "原型",
    "Manage Skill Order": "管理技能顺序",
    Cosmetics: "外观",
    "Copper Ore": "铜矿石",
    Rock: "岩石",
    "Iron Ore": "铁矿石",
    "Cobalt Ore": "钴矿石",
    "Titanium Ore": "钛矿石",
    "Juniper Tree": "杜松树",
    "Fir Tree": "冷杉树",
    "Palm Tree": "棕榈树",
    "Oak Tree": "橡树",
    "Wildleaf Tree": "野叶树",
    "Willow Tree": "柳树",
    "Harvest logs from trees.": "从树上采集原木。",
    "Nodes are collected every 45 seconds and can be gathered while idle for up to 12 hours.":
      "节点每45秒可采集一次，并可在挂机状态下持续采集，最长12小时。",
    "Advanced trees provide rarer resources.": "高级树木提供更稀有的资源。",
    "Higher-level nodes yield rarer materials.": "高级节点产出更稀有的材料。",
    "Collect ores and gems from mining nodes.": "从采矿节点收集矿石和宝石。",
    Boosters: "增益道具",
    "Select Difficulty": "选择难度",
    "Want to maximize your rewards? Activate a booster and power through.":
      "想要最大化你的奖励吗？激活一个增益道具助你一臂之力。",
    '"Increases the speed you gather items by"': "“提高你采集物品的速度”",
    "Unlocks at the end of the season. Requires a Premium Battle Pass.":
      "赛季结束时解锁。需要高级战斗通行证。",
  };

  const regexRules = [
    [/Congratulations on reaching level {value}!/g, "恭喜达到 {value} 级！"],
    [/Requires Level {level}/g, "需要等级 {level}"],
    [/Unlock {qtd} slots/g, "解锁 {qtd} 个槽位"],
    [/Distance from {origin} to {destiny}/g, "{origin} 到 {destiny} 的距离"],
    [
      /You have already claimed your rewards today./g,
      "你今天已经领取过奖励了。",
    ],
    [/You have no daily entries left./g, "今日进入次数已用完。"],
    [/Defeated Enemies/g, "已击败的敌人"],
    [/Reset in/g, "重置于"],
    [/Remaining quantity/g, "剩余数量"],
    [/Do you want to use this booster?/g, "是否使用该增益道具？"],
    [/Select Effort Potion Amount/g, "选择体力药剂数量"],
    [/Proceed Payment/g, "继续支付"],
    [/History/g, "历史记录"],
    [/Amount/g, "金额"],
    [/Code/g, "代码"],
    [/Date/g, "日期"],
    [/Description/g, "描述"],
    [/Complete/g, "完成"],
    [/Heals/g, "治疗"],
    [/Deals/g, "造成"],
    [/Grants/g, "授予"],
    [/Enchants/g, "强化"],
    [/Restores/g, "恢复"],
    [/Increases/g, "增加"],
    [/and/g, "和"],
    [/Casts/g, "施放"],
    [/spell damage/g, "法术伤害"],
    [/Spell Power/g, "法术强度"],
    [/Healing Power/g, "治疗强度"],
    [/barrier/g, "护盾"],
    [/Weapon Power/g, "武器强度"],
    [/Weapon Defense/g, "武器防御"],
    [/Haste/g, "急速"],
    [/Spell Defense/g, "法术防御"],
    [/Mana Regeneration/g, "法力回复"],
    [/Maximum Mana/g, "最大法力值"],
    [/Maximum Health/g, "最大生命值"],
    [/Health Regeneration/g, "生命回复"],

  ];

  function translateString(s) {
    if (typeof s !== "string") return s;
    if (s in exactMap) return exactMap[s];
    let out = s;
    for (const [re, zh] of regexRules) {
      if (re.test(out)) out = out.replace(re, zh);
    }
    return out;
  }

  function deepTranslate(obj) {
    const seen = new WeakSet();
    function rec(v) {
      if (typeof v === "string") return translateString(v);
      if (!v || typeof v !== "object") return v;
      if (seen.has(v)) return v;
      seen.add(v);
      if (Array.isArray(v)) {
        for (let i = 0; i < v.length; i++) v[i] = rec(v[i]);
      } else {
        for (const k of Object.keys(v)) v[k] = rec(v[k]);
      }
      return v;
    }
    return rec(obj);
  }

  function looksLikeEnDict(obj) {
    try {
      if (!obj || typeof obj !== "object") return false;
      if (!obj.auth || !obj.common || !obj.layout || !obj.character)
        return false;
      const a = obj.auth && obj.auth.back;
      const c = obj.common && obj.common.and;
      const s1 =
        obj.layout && obj.layout.sidebar && obj.layout.sidebar.character;
      const s2 = obj.character && obj.character.class;
      return (
        a === "Back to login" ||
        c === "and" ||
        s1 === "Character" ||
        s2 === "Class"
      );
    } catch (_) {
      return false;
    }
  }

  const origParse = JSON.parse;
  JSON.parse = function (str, reviver) {
    const obj = origParse.call(this, str, reviver);
    try {
      if (looksLikeEnDict(obj)) {
        return deepTranslate(obj);
      }
    } catch (_) {
      /* ignore */
    }
    return obj;
  };

  // 调试日志
  // console.log('[i18n] JSON.parse hook installed');
})();
