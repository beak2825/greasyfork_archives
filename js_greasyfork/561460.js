// ==UserScript==
// @name         MapGenie 森林之子地图汉化
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  MapGenie Sons of The Forest 地图汉化插件，支持原文/汉化模式和中文搜索
// @author       zxb
// @match        https://mapgenie.io/sons-of-the-forest/*
// @match        file:///*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/561460/MapGenie%20%E6%A3%AE%E6%9E%97%E4%B9%8B%E5%AD%90%E5%9C%B0%E5%9B%BE%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/561460/MapGenie%20%E6%A3%AE%E6%9E%97%E4%B9%8B%E5%AD%90%E5%9C%B0%E5%9B%BE%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // ========== 翻译词库 ==========
  const locals = {
    // ========== UI 元素 ==========
    Search: "搜索",
    "Show All": "显示全部",
    "Hide All": "隐藏全部",
    "Filter Active": "筛选已激活",
    "Clear Target": "清除目标",
    "Embed Map": "嵌入地图",
    "Upgrade To Pro": "升级到专业版",

    // ========== 分类名称 ==========
    Locations: "位置",
    Collectibles: "收集品",
    Items: "物品",
    Natives: "原住民",
    Wildlife: "野生动物",
    Materials: "材料",
    Other: "其他",

    // ========== Locations 子分类 ==========
    "3D Printer": "3D打印机",
    "Abandoned Camp": "废弃营地",
    Bunker: "地堡",
    "Cannibal Camp": "食人族营地",
    "Cave Entrance": "洞穴入口",
    Exit: "出口",
    "GPS Locator": "GPS定位器",
    "Point of Interest": "兴趣点",
    "Spawn Point": "出生点",
    Village: "村庄",

    // ========== Collectibles 子分类 ==========
    "Artifact Piece": "神器碎片",
    Blueprint: "蓝图",
    Book: "书籍",
    Clothes: "衣服",
    Document: "文档",
    Keycard: "门禁卡",
    Laptop: "笔记本电脑",
    Magazine: "杂志",
    "Video Recording": "视频录像",

    // ========== Items 子分类 ==========
    "Air Tank": "氧气瓶",
    "Ammo Case": "弹药箱",
    "Cooking Pot": "烹饪锅",
    Crate: "板条箱",
    "Crossbow Bolts": "弩箭",
    Equipment: "装备",
    Explosives: "爆炸物",
    Flare: "信号弹",
    Gear: "齿轮",
    "Golf Cart Battery": "高尔夫球车电池",
    "Light Bulb": "灯泡",
    Meds: "药品",
    Snack: "零食",
    Soda: "汽水",
    Suitcase: "行李箱",
    "Supply Case": "补给箱",
    Tarp: "防水布",
    "Utility Item": "实用物品",
    Weapon: "武器",

    // ========== Natives 子分类 ==========
    Mutant: "变异体",

    // ========== Wildlife 子分类 ==========
    Deer: "鹿",
    Fish: "鱼",
    Moose: "驼鹿",
    Oyster: "牡蛎",
    Seagull: "海鸥",
    Shark: "鲨鱼",
    Turtle: "海龟",

    // ========== Materials 子分类 ==========
    Cash: "现金",
    "Circuit Board": "电路板",
    Cloth: "布料",
    Coins: "硬币",
    "Duct Tape": "强力胶带",
    Mushrooms: "蘑菇",
    Plant: "植物",
    Rope: "绳索",
    "Solafite Ore": "索拉菲特矿石",
    "Vodka Bottle": "伏特加酒瓶",
    Watch: "手表",
    Wire: "电线",

    // ========== Other 子分类 ==========
    Door: "门",
    "Easter Egg": "彩蛋",
    "Golf Ball": "高尔夫球",
    Grave: "坟墓",
    Miscellaneous: "杂项",
    Pond: "池塘",
    Radio: "收音机",
    Skull: "头骨",
    Vehicle: "载具",

    // ========== 游戏物品详细列表 ==========
    "Can Opener": "开罐器",
    "Firefighter Axe": "消防斧",
    "Modern Axe": "现代斧",
    "Tactical Axe": "战术斧",
    "Crafted Axe": "自制斧",
    "Climbing Axe": "登山斧",
    Katana: "武士刀",
    Machete: "弯刀",
    Chainsaw: "电锯",
    Crossbow: "弩",
    Slingshot: "弹弓",
    Bow: "弓",
    "Modern Bow": "现代弓",
    "Crafted Bow": "自制弓",
    Pistol: "手枪",
    Shotgun: "霰弹枪",
    Revolver: "左轮手枪",
    Rifle: "步枪",
    Flamethrower: "火焰喷射器",
    Shovel: "铲子",
    "Tactical Shovel": "战术铲",
    "Crafted Shovel": "自制铲",
    Pickaxe: "镐",
    "Crafted Pickaxe": "自制镐",
    Rock: "石头",
    Torch: "火把",
    Flashlight: "手电筒",
    "Night Vision Goggles": "夜视仪",
    Walkman: "随身听",
    Compass: "指南针",
    "GPS Tracker": "GPS追踪器",
    Rebreather: "呼吸器",
    "Zipline Rope": "滑索绳",
    "Rope Gun": "绳索枪",
    "Stun Gun": "电击枪",
    Pelt: "毛皮",
    "Dried Meat": "肉干",
    "Raw Meat": "生肉",
    "Cooked Meat": "熟肉",
    "Small Meat": "小块肉",
    "Large Meat": "大块肉",
    "Dried Fish": "鱼干",
    "Raw Fish": "生鱼",
    "Cooked Fish": "熟鱼",
    Berries: "浆果",
    Blueberries: "蓝莓",
    Twinberries: "双莓",
    Snowberries: "雪莓",
    "Aloe Vera": "芦荟",
    "Energy Mix": "能量混合物",
    "Energy Bar": "能量棒",
    "Energy Drink": "能量饮料",
    "Chocolate Bar": "巧克力棒",
    "Snack Pack": "零食包",
    "Canned Food": "罐头食品",
    Jerky: "肉干",
    "Water Bottle": "水瓶",
    "Water Skin": "水袋",
    "Soda Can": "汽水罐",
    Beer: "啤酒",
    Vodka: "伏特加",
    Whiskey: "威士忌",
    Bandage: "绷带",
    Medkit: "急救包",
    Pills: "药丸",
    Alcohol: "酒精",
    Herbs: "草药",
    Marigold: "金盏花",
    Yarrow: "蓍草",
    Aloe: "芦荟",
    Coneflower: "锥花",
    "Health Mix": "健康混合物",
    "Health Plus": "健康增强",
    "Bone Armor": "骨甲",
    "Stealth Armor": "潜行甲",
    "Technological Armor": "科技甲",
    "Warm Suit": "保暖服",
    "Creeper Armor": "爬行者甲",
    "Deer Skin": "鹿皮",
    "Rabbit Fur": "兔皮",
    "Boar Skin": "野猪皮",
    "Lizard Skin": "蜥蜴皮",
    "Turtle Shell": "海龟壳",
    Bone: "骨头",
    Skull: "头骨",
    Teeth: "牙齿",
    Feather: "羽毛",
    Stick: "木棍",
    Log: "原木",
    Stone: "石头",
    Rock: "岩石",
    Leaf: "叶子",
    "Plant Fiber": "植物纤维",
    Cloth: "布料",
    "Duct Tape": "强力胶带",
    Wire: "电线",
    Battery: "电池",
    "Circuit Board": "电路板",
    Coins: "硬币",
    Cash: "现金",
    Watch: "手表",
    "Gold Bar": "金条",
    Diamond: "钻石",
    Ruby: "红宝石",
    Emerald: "绿宝石",
    Sapphire: "蓝宝石",
    Keycard: "门禁卡",
    "Maintenance Keycard": "维护门禁卡",
    "Guest Keycard": "客人门禁卡",
    "VIP Keycard": "VIP门禁卡",
    "CEO Keycard": "CEO门禁卡",
    Laptop: "笔记本电脑",
    "Flash Drive": "U盘",
    "Hard Drive": "硬盘",
    "Memory Card": "内存卡",
    Document: "文档",
    Book: "书籍",
    Magazine: "杂志",
    Blueprint: "蓝图",
    Recipe: "食谱",
    Map: "地图",
    Compass: "指南针",
    GPS: "GPS",
    Radio: "收音机",
    "Walkie Talkie": "对讲机",
    Flashlight: "手电筒",
    Flare: "信号弹",
    Torch: "火把",
    Lighter: "打火机",
    Matches: "火柴",
    Firewood: "柴火",
    Campfire: "篝火",
    Bonfire: "大火堆",
    "Fire Pit": "火坑",
    "Stone Ring": "石圈",
    "Drying Rack": "晾干架",
    Shelter: "庇护所",
    Tent: "帐篷",
    "Lean-to": "简易棚",
    "Tree House": "树屋",
    Cabin: "小屋",
    "Lookout Tower": "瞭望塔",
    Trap: "陷阱",
    "Deadfall Trap": "落石陷阱",
    "Snare Trap": "陷阱",
    "Fish Trap": "捕鱼陷阱",
    "Bird Trap": "捕鸟陷阱",
    Wall: "墙",
    Door: "门",
    Gate: "大门",
    Window: "窗户",
    Floor: "地板",
    Roof: "屋顶",
    Stairs: "楼梯",
    Ladder: "梯子",
    Bridge: "桥",
    Zipline: "滑索",
    Raft: "木筏",
    Boat: "船",
    Kayak: "皮划艇",
    "Golf Cart": "高尔夫球车",
    ATV: "全地形车",
    Snowmobile: "雪地摩托",
    "Hang Glider": "滑翔机",

    // ========== 工具提示 ==========
    "Distance Measurement Tool": "距离测量工具",
    "Sniping Radius Tool": "狙击范围工具",
    "Drag the target shape to visualize sniping distances. Dotted lines are 50m increments.":
      "拖动目标形状以可视化狙击距离。虚线为50米增量。",

    // ========== 其他文本 ==========
    "Embed this map on your own website by copying the code below and adding it to your html":
      "通过复制下面的代码并将其添加到您的 HTML 中，将此地图嵌入到您自己的网站上",
    "Ad Blocker? Consider an upgrade to PRO to remove ads and get extra features.":
      "广告拦截器？考虑升级到专业版以移除广告并获取额外功能。",

    // ========== 正则表达式翻译（用于动态内容） ==========
    regex: {},
  };

  // 导出到全局作用域
  if (typeof window !== "undefined") {
    window.mapgenieLocals = locals;
  }

  // ========== 中文→英文反向翻译字典（用于搜索功能） ==========
  const reverseLocals = {
    // UI 元素
    搜索: "Search",
    显示全部: "Show All",
    隐藏全部: "Hide All",
    筛选已激活: "Filter Active",
    清除目标: "Clear Target",
    嵌入地图: "Embed Map",
    升级到专业版: "Upgrade To Pro",

    // 分类名称
    位置: "Locations",
    收集品: "Collectibles",
    物品: "Items",
    原住民: "Natives",
    野生动物: "Wildlife",
    材料: "Materials",
    其他: "Other",

    // Locations 子分类
    "3D打印机": "3D Printer",
    废弃营地: "Abandoned Camp",
    地堡: "Bunker",
    食人族营地: "Cannibal Camp",
    洞穴入口: "Cave Entrance",
    出口: "Exit",
    GPS定位器: "GPS Locator",
    兴趣点: "Point of Interest",
    出生点: "Spawn Point",
    村庄: "Village",

    // Collectibles 子分类
    神器碎片: "Artifact Piece",
    蓝图: "Blueprint",
    书籍: "Book",
    衣服: "Clothes",
    文档: "Document",
    门禁卡: "Keycard",
    笔记本电脑: "Laptop",
    杂志: "Magazine",
    视频录像: "Video Recording",

    // Items 子分类
    氧气瓶: "Air Tank",
    弹药箱: "Ammo Case",
    烹饪锅: "Cooking Pot",
    板条箱: "Crate",
    弩箭: "Crossbow Bolts",
    装备: "Equipment",
    爆炸物: "Explosives",
    信号弹: "Flare",
    齿轮: "Gear",
    高尔夫球车电池: "Golf Cart Battery",
    灯泡: "Light Bulb",
    药品: "Meds",
    零食: "Snack",
    汽水: "Soda",
    行李箱: "Suitcase",
    补给箱: "Supply Case",
    防水布: "Tarp",
    实用物品: "Utility Item",
    武器: "Weapon",

    // Natives 子分类
    变异体: "Mutant",

    // Wildlife 子分类
    鹿: "Deer",
    鱼: "Fish",
    驼鹿: "Moose",
    牡蛎: "Oyster",
    海鸥: "Seagull",
    鲨鱼: "Shark",
    海龟: "Turtle",

    // Materials 子分类
    现金: "Cash",
    电路板: "Circuit Board",
    布料: "Cloth",
    硬币: "Coins",
    强力胶带: "Duct Tape",
    蘑菇: "Mushrooms",
    植物: "Plant",
    绳索: "Rope",
    索拉菲特矿石: "Solafite Ore",
    伏特加酒瓶: "Vodka Bottle",
    手表: "Watch",
    电线: "Wire",

    // Other 子分类
    门: "Door",
    彩蛋: "Easter Egg",
    高尔夫球: "Golf Ball",
    坟墓: "Grave",
    杂项: "Miscellaneous",
    池塘: "Pond",
    收音机: "Radio",
    头骨: "Skull",
    载具: "Vehicle",

    // 游戏物品详细列表
    开罐器: "Can Opener",
    消防斧: "Firefighter Axe",
    现代斧: "Modern Axe",
    战术斧: "Tactical Axe",
    自制斧: "Crafted Axe",
    登山斧: "Climbing Axe",
    武士刀: "Katana",
    弯刀: "Machete",
    电锯: "Chainsaw",
    弩: "Crossbow",
    弹弓: "Slingshot",
    弓: "Bow",
    现代弓: "Modern Bow",
    自制弓: "Crafted Bow",
    手枪: "Pistol",
    霰弹枪: "Shotgun",
    左轮手枪: "Revolver",
    步枪: "Rifle",
    火焰喷射器: "Flamethrower",
    铲子: "Shovel",
    战术铲: "Tactical Shovel",
    自制铲: "Crafted Shovel",
    镐: "Pickaxe",
    自制镐: "Crafted Pickaxe",
    石头: "Rock",
    火把: "Torch",
    手电筒: "Flashlight",
    夜视仪: "Night Vision Goggles",
    随身听: "Walkman",
    指南针: "Compass",
    GPS追踪器: "GPS Tracker",
    呼吸器: "Rebreather",
    滑索绳: "Zipline Rope",
    绳索枪: "Rope Gun",
    电击枪: "Stun Gun",
    毛皮: "Pelt",
    肉干: "Dried Meat",
    生肉: "Raw Meat",
    熟肉: "Cooked Meat",
    小块肉: "Small Meat",
    大块肉: "Large Meat",
    鱼干: "Dried Fish",
    生鱼: "Raw Fish",
    熟鱼: "Cooked Fish",
    浆果: "Berries",
    蓝莓: "Blueberries",
    双莓: "Twinberries",
    雪莓: "Snowberries",
    芦荟: "Aloe Vera",
    能量混合物: "Energy Mix",
    能量棒: "Energy Bar",
    能量饮料: "Energy Drink",
    巧克力棒: "Chocolate Bar",
    零食包: "Snack Pack",
    罐头食品: "Canned Food",
    肉干: "Jerky",
    水瓶: "Water Bottle",
    水袋: "Water Skin",
    汽水罐: "Soda Can",
    啤酒: "Beer",
    伏特加: "Vodka",
    威士忌: "Whiskey",
    绷带: "Bandage",
    急救包: "Medkit",
    药丸: "Pills",
    酒精: "Alcohol",
    草药: "Herbs",
    金盏花: "Marigold",
    蓍草: "Yarrow",
    芦荟: "Aloe",
    锥花: "Coneflower",
    健康混合物: "Health Mix",
    健康增强: "Health Plus",
    骨甲: "Bone Armor",
    潜行甲: "Stealth Armor",
    科技甲: "Technological Armor",
    保暖服: "Warm Suit",
    爬行者甲: "Creeper Armor",
    鹿皮: "Deer Skin",
    兔皮: "Rabbit Fur",
    野猪皮: "Boar Skin",
    蜥蜴皮: "Lizard Skin",
    海龟壳: "Turtle Shell",
    骨头: "Bone",
    头骨: "Skull",
    牙齿: "Teeth",
    羽毛: "Feather",
    木棍: "Stick",
    原木: "Log",
    石头: "Stone",
    岩石: "Rock",
    叶子: "Leaf",
    植物纤维: "Plant Fiber",
    布料: "Cloth",
    强力胶带: "Duct Tape",
    电线: "Wire",
    电池: "Battery",
    电路板: "Circuit Board",
    硬币: "Coins",
    现金: "Cash",
    手表: "Watch",
    金条: "Gold Bar",
    钻石: "Diamond",
    红宝石: "Ruby",
    绿宝石: "Emerald",
    蓝宝石: "Sapphire",
    门禁卡: "Keycard",
    维护门禁卡: "Maintenance Keycard",
    客人门禁卡: "Guest Keycard",
    VIP门禁卡: "VIP Keycard",
    CEO门禁卡: "CEO Keycard",
    笔记本电脑: "Laptop",
    U盘: "Flash Drive",
    硬盘: "Hard Drive",
    内存卡: "Memory Card",
    文档: "Document",
    书籍: "Book",
    杂志: "Magazine",
    蓝图: "Blueprint",
    食谱: "Recipe",
    地图: "Map",
    指南针: "Compass",
    GPS: "GPS",
    收音机: "Radio",
    对讲机: "Walkie Talkie",
    手电筒: "Flashlight",
    信号弹: "Flare",
    火把: "Torch",
    打火机: "Lighter",
    火柴: "Matches",
    柴火: "Firewood",
    篝火: "Campfire",
    大火堆: "Bonfire",
    火坑: "Fire Pit",
    石圈: "Stone Ring",
    晾干架: "Drying Rack",
    庇护所: "Shelter",
    帐篷: "Tent",
    简易棚: "Lean-to",
    树屋: "Tree House",
    小屋: "Cabin",
    瞭望塔: "Lookout Tower",
    陷阱: "Trap",
    落石陷阱: "Deadfall Trap",
    捕鸟陷阱: "Snare Trap",
    捕鱼陷阱: "Fish Trap",
    捕鸟陷阱: "Bird Trap",
    墙: "Wall",
    门: "Door",
    大门: "Gate",
    窗户: "Window",
    地板: "Floor",
    屋顶: "Roof",
    楼梯: "Stairs",
    梯子: "Ladder",
    桥: "Bridge",
    滑索: "Zipline",
    木筏: "Raft",
    船: "Boat",
    皮划艇: "Kayak",
    高尔夫球车: "Golf Cart",
    全地形车: "ATV",
    雪地摩托: "Snowmobile",
    滑翔机: "Hang Glider",

    // 工具提示
    距离测量工具: "Distance Measurement Tool",
    狙击范围工具: "Sniping Radius Tool",
  };

  // 导出到全局作用域
  if (typeof window !== "undefined") {
    window.mapgenieReverseLocals = reverseLocals;
  }

  // ========== 配置管理 ==========
  const config = {
    mode: "translated", // 'original', 'translated'
    enableRegex: true,
    enableOnlineTranslation: true, // 启用在线翻译
    enableChineseSearch: true, // 启用中文搜索
    onlineTranslationService: "mymemory", // 翻译服务选择
    autoCacheCleanup: true, // 自动清理缓存
  };

  // ========== 在线翻译全局变量 ==========
  const translationQueue = new Map(); // 翻译队列
  const failedTranslations = new Map(); // 失败翻译记录
  let translationTimer = null; // 节流定时器

  // ========== 翻译活动引用计数 ==========
  let translationActivityCount = 0; // 翻译活动计数器
  let loadingOverlayVisible = false; // 加载界面是否可见

  // ========== 搜索功能全局变量 ==========
  let searchInputObserver = null;
  let searchInputElement = null;
  let originalSearchHandler = null;

  // ========== 翻译活动管理函数 ==========
  function startTranslationActivity() {
    translationActivityCount++;
    if (!loadingOverlayVisible && translationActivityCount > 0) {
      showLoadingOverlay();
      loadingOverlayVisible = true;
    }
  }

  function endTranslationActivity() {
    translationActivityCount--;
    if (translationActivityCount < 0) {
      translationActivityCount = 0;
    }
    if (loadingOverlayVisible && translationActivityCount === 0) {
      hideLoadingOverlay();
      loadingOverlayVisible = false;
    }
  }

  // ========== 性能优化全局变量 ==========
  const textNodeCache = new WeakMap(); // 缓存TreeWalker结果

  // 加载配置
  function loadConfig() {
    const saved = localStorage.getItem("mapgenie-chinese-config");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        Object.assign(config, parsed);
      } catch (e) {
        console.error("配置加载失败:", e);
      }
    }
  }

  // 保存配置
  function saveConfig() {
    localStorage.setItem("mapgenie-chinese-config", JSON.stringify(config));
  }

  // 保存原始文本的属性名
  const ORIGINAL_TEXT_ATTR = "data-mg-original";

  // ========== 忽略规则 ==========
  const ignoreRules = {
    tags: ["SCRIPT", "STYLE", "CODE", "PRE", "NOSCRIPT"],
    classes: ["code", "highlight", "markdown-body", "mapboxgl-canvas"],
    attributes: ["data-code", "data-json", "data-skip-translation"],
  };

  // 检查是否应该忽略元素
  function shouldIgnore(element) {
    if (!element || !element.tagName) return false;

    // 检查标签
    if (ignoreRules.tags.includes(element.tagName)) {
      return true;
    }

    // 检查 class
    if (element.classList) {
      for (const className of ignoreRules.classes) {
        if (element.classList.contains(className)) {
          return true;
        }
      }
    }

    // 检查属性
    for (const attr of ignoreRules.attributes) {
      if (element.hasAttribute(attr)) {
        return true;
      }
    }

    return false;
  }

  // ========== 搜索翻译功能 ==========

  // 检测是否包含中文字符
  function containsChinese(text) {
    return /[\u4e00-\u9fa5]/.test(text);
  }

  // 检测是否是纯英文文本
  function isEnglishText(text) {
    if (!text || typeof text !== "string") return false;
    // 检查是否只包含英文字符、数字、空格和常用标点
    return /^[a-zA-Z0-9\s.,!?;:'"()\-_@#$%&*+=<>[\]{}|\\/]+$/.test(text);
  }

  // 从双语文本中提取英文部分
  function extractEnglishFromBilingual(text) {
    if (!text || typeof text !== "string") return text;

    // 检查是否是双语文本格式："中文 (英文)"
    const bilingualMatch = text.match(/^[\s\S]*?\s*\(([^)]+)\)\s*$/);
    if (bilingualMatch) {
      const englishPart = bilingualMatch[1].trim();
      // 确保提取的部分是英文
      if (isEnglishText(englishPart)) {
        return englishPart;
      }
    }

    return text;
  }

  // 将中文搜索词翻译成英文
  function translateSearchQuery(query) {
    if (!query || typeof query !== "string") return query;

    // 如果不包含中文，直接返回
    if (!containsChinese(query)) {
      return query;
    }

    // 尝试精确匹配
    if (window.mapgenieReverseLocals && window.mapgenieReverseLocals[query]) {
      return window.mapgenieReverseLocals[query];
    }

    // 尝试部分匹配（处理多个词的情况）
    const words = query.split(/\s+/);
    const translatedWords = words.map((word) => {
      if (window.mapgenieReverseLocals && window.mapgenieReverseLocals[word]) {
        return window.mapgenieReverseLocals[word];
      }
      return word;
    });

    const result = translatedWords.join(" ");

    // 如果有中文字符没有被翻译，尝试在线翻译
    if (containsChinese(result) && config.enableOnlineTranslation) {
      // 检查缓存
      const cached = getFromCache(result);
      if (cached && cached !== result) {
        return cached;
      }

      // 调用在线翻译
      console.log("尝试在线翻译搜索词:", result);
      triggerOnlineTranslation(result);

      // 返回原文，等待翻译完成
      return result;
    }

    return result;
  }

  // 设置搜索拦截
  function setupSearchInterception() {
    console.log("开始设置搜索拦截...");

    // 检查反向翻译字典是否已初始化
    if (!window.mapgenieReverseLocals) {
      console.warn("反向翻译字典未初始化，尝试从 locals.js 加载");
      // 尝试等待 locals.js 加载，但不递归调用
      const checkReverseLocals = setInterval(() => {
        if (window.mapgenieReverseLocals) {
          clearInterval(checkReverseLocals);
          console.log("反向翻译字典已加载，开始设置搜索拦截");
          // 直接设置搜索拦截，不再递归调用
          setupSearchInput();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkReverseLocals);
        console.warn("反向翻译字典加载超时，搜索功能可能无法正常工作");
      }, 5000);
      return;
    }

    // 如果字典已加载，直接设置搜索拦截
    setupSearchInput();
  }

  // 设置搜索输入框监听
  function setupSearchInput() {
    // 防止重复设置
    if (searchInputElement) {
      console.log("搜索输入框已设置，跳过");
      return;
    }

    // 等待搜索输入框出现
    const checkSearchInput = setInterval(() => {
      console.log("正在查找搜索输入框...");

      // 改进的搜索输入框查找方法
      const possibleSelectors = [
        "#search-input",
        'input[type="search"]',
        'input[placeholder*="search"]',
        'input[placeholder*="Search"]',
        'input[placeholder*="搜索"]',
        ".search-input",
        "#search",
        '[data-testid*="search"]',
        '[class*="search"] input',
        '[id*="search"] input',
        'input[name*="search"]',
        'input[aria-label*="search"]',
        'input[aria-label*="Search"]',
      ];

      searchInputElement = null;
      for (const selector of possibleSelectors) {
        const element = document.querySelector(selector);
        if (element) {
          searchInputElement = element;
          console.log(
            "通过选择器找到搜索输入框:",
            selector,
            searchInputElement,
          );
          break;
        }
      }

      // 如果选择器没找到，尝试遍历所有 input 元素
      if (!searchInputElement) {
        console.log("通过选择器未找到搜索框，尝试遍历所有 input 元素...");
        const allInputs = document.querySelectorAll("input");
        console.log("找到", allInputs.length, "个 input 元素");

        for (const input of allInputs) {
          const type = input.type || "";
          const placeholder = input.placeholder || "";
          const className = input.className || "";
          const id = input.id || "";
          const name = input.name || "";
          const ariaLabel = input.getAttribute("aria-label") || "";

          console.log("检查 input:", {
            type,
            placeholder,
            className,
            id,
            name,
            ariaLabel,
          });

          if (
            type === "search" ||
            placeholder.toLowerCase().includes("search") ||
            className.toLowerCase().includes("search") ||
            id.toLowerCase().includes("search") ||
            name.toLowerCase().includes("search") ||
            ariaLabel.toLowerCase().includes("search")
          ) {
            searchInputElement = input;
            console.log("通过遍历找到搜索输入框:", searchInputElement);
            break;
          }
        }
      }

      // 如果还是没找到，尝试查找任何可见的 input 元素
      if (!searchInputElement) {
        console.log("尝试查找任何可见的 input 元素...");
        const allInputs = document.querySelectorAll("input");
        for (const input of allInputs) {
          const style = window.getComputedStyle(input);
          if (style.display !== "none" && style.visibility !== "hidden") {
            searchInputElement = input;
            console.log("找到可见的 input 元素作为搜索框:", searchInputElement);
            break;
          }
        }
      }

      if (searchInputElement) {
        clearInterval(checkSearchInput);
        console.log("最终找到搜索输入框:", searchInputElement);

        // 保存原始的input事件处理器
        const inputHandler = searchInputElement.oninput;
        const keyupHandler = searchInputElement.onkeyup;

        // 拦截输入事件
        searchInputElement.addEventListener("input", (e) => {
          // 检查标志位，避免无限循环
          if (e._skipTranslation) {
            if (inputHandler) {
              inputHandler.call(searchInputElement, e);
            }
            return;
          }

          const inputValue = e.target.value;
          console.log("检测到搜索输入:", inputValue);

          // 如果包含中文，翻译成英文
          if (containsChinese(inputValue)) {
            const translatedQuery = translateSearchQuery(inputValue);
            console.log("翻译后的搜索词:", translatedQuery);

            if (translatedQuery !== inputValue) {
              // 更新输入框的值为英文
              e.target.value = translatedQuery;

              // 触发输入事件，让网站感知到变化
              const inputEvent = new Event("input", { bubbles: true });
              inputEvent._skipTranslation = true; // 设置标志位
              e.target.dispatchEvent(inputEvent);
            }
          }

          // 调用原始的处理器（如果有）
          if (inputHandler) {
            inputHandler.call(searchInputElement, e);
          }
        });

        // 拦截键盘事件（处理Enter键搜索）
        searchInputElement.addEventListener("keyup", (e) => {
          if (e.key === "Enter") {
            const inputValue = e.target.value;
            console.log("检测到Enter键搜索:", inputValue);

            // 如果包含中文，翻译成英文
            if (containsChinese(inputValue)) {
              const translatedQuery = translateSearchQuery(inputValue);
              console.log("翻译后的搜索词:", translatedQuery);

              if (translatedQuery !== inputValue) {
                e.target.value = translatedQuery;

                // 触发输入事件，让网站感知到变化
                const inputEvent = new Event("input", { bubbles: true });
                inputEvent._skipTranslation = true;
                e.target.dispatchEvent(inputEvent);
              }
            }
          }

          // 调用原始的处理器（如果有）
          if (keyupHandler) {
            keyupHandler.call(searchInputElement, e);
          }
        });

        // 拦截 compositionend 事件（处理中文输入法）
        searchInputElement.addEventListener("compositionend", (e) => {
          const inputValue = e.target.value;
          console.log("检测到中文输入法结束:", inputValue);

          // 如果包含中文，翻译成英文
          if (containsChinese(inputValue)) {
            const translatedQuery = translateSearchQuery(inputValue);
            console.log("翻译后的搜索词:", translatedQuery);

            if (translatedQuery !== inputValue) {
              // 如果翻译结果和原文不同，立即更新
              e.target.value = translatedQuery;

              // 触发输入事件
              const inputEvent = new Event("input", { bubbles: true });
              inputEvent._skipTranslation = true;
              e.target.dispatchEvent(inputEvent);
            } else {
              // 如果翻译结果和原文相同，说明需要在线翻译
              console.log("需要在线翻译，等待翻译完成...");

              // 等待翻译完成（最多等待3秒）
              let checkCount = 0;
              const checkInterval = setInterval(() => {
                checkCount++;
                const cached = getFromCache(inputValue);
                if (
                  cached &&
                  cached.translation &&
                  cached.translation !== inputValue
                ) {
                  console.log(
                    "在线翻译完成:",
                    inputValue,
                    "->",
                    cached.translation,
                  );

                  e.target.value = cached.translation;

                  const inputEvent = new Event("input", { bubbles: true });
                  inputEvent._skipTranslation = true;
                  e.target.dispatchEvent(inputEvent);

                  clearInterval(checkInterval);
                } else if (checkCount >= 6) {
                  // 3秒后停止检查
                  console.log("在线翻译超时");
                  clearInterval(checkInterval);
                }
              }, 500);
            }
          }
        });

        // 监听翻译队列，当翻译完成时更新搜索框
        const checkTranslationQueue = setInterval(() => {
          // 检查缓存中是否有新翻译的搜索词
          const searchValue = searchInputElement
            ? searchInputElement.value
            : "";
          if (searchValue && containsChinese(searchValue)) {
            const cached = getFromCache(searchValue);
            if (cached && cached !== searchValue) {
              console.log("搜索词翻译完成:", searchValue, "->", cached);

              // 更新搜索框的值为英文
              searchInputElement.value = cached;
              const inputEvent = new Event("input", { bubbles: true });
              inputEvent._skipTranslation = true;
              searchInputElement.dispatchEvent(inputEvent);
            }
          }
        }, 500);

        console.log("搜索拦截设置完成");
      }
    }, 500);

    // 10秒后停止检查，避免无限循环
    setTimeout(() => {
      clearInterval(checkSearchInput);
      if (!searchInputElement) {
        console.warn("未找到搜索输入框，搜索拦截功能无法启用");
      }
    }, 10000);
  }

  // 清理搜索拦截
  function cleanupSearchInterception() {
    if (searchInputElement && searchInputObserver) {
      searchInputObserver.disconnect();
      console.log("已清理搜索拦截");
    }
  }

  // ========== 翻译函数 ==========
  function translate(text, originalText = null) {
    if (!text || typeof text !== "string") return text;

    // 使用原始文本进行翻译（如果提供）
    const textToTranslate = originalText || text;

    // 查找精确匹配
    if (locals[textToTranslate]) {
      return applyMode(textToTranslate, locals[textToTranslate]);
    }

    // 正则表达式匹配
    if (config.enableRegex && locals.regex) {
      for (const pattern in locals.regex) {
        try {
          const regex = new RegExp(pattern, "g");
          if (regex.test(textToTranslate)) {
            return textToTranslate.replace(regex, (match) => {
              return applyMode(match, locals.regex[pattern]);
            });
          }
        } catch (e) {
          console.warn("正则表达式错误:", pattern, e);
        }
      }
    }

    // 检查缓存
    const cachedTranslation = getFromCache(textToTranslate);
    if (cachedTranslation) {
      return applyMode(textToTranslate, cachedTranslation);
    }

    // 触发在线翻译（异步）
    if (config.enableOnlineTranslation) {
      triggerOnlineTranslation(textToTranslate);
    }

    // 如果没有找到翻译，返回原始文本
    return textToTranslate;
  }

  // 应用显示模式
  function applyMode(original, translated) {
    switch (config.mode) {
      case "original":
        return original;
      case "translated":
        return translated;
      default:
        return translated;
    }
  }

  // ========== 在线翻译功能 ==========

  // MyMemory API 翻译
  async function translateWithMyMemory(text, targetLang = "zh-CN") {
    const langpair = targetLang === "en" ? "zh-CN|en" : "en|zh-CN";
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langpair}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`);
    }

    const data = await response.json();

    if (data.responseStatus === 200) {
      return data.responseData.translatedText;
    } else {
      throw new Error(data.responseDetails || "翻译失败");
    }
  }

  // 触发在线翻译（带节流）
  function triggerOnlineTranslation(text) {
    // 检查是否启用在线翻译
    if (!config.enableOnlineTranslation) return;

    // 只翻译长度小于100的文本
    if (text.length > 100) {
      console.log("文本过长，跳过在线翻译:", text.substring(0, 50) + "...");
      return;
    }

    // 检查是否在失败列表中（24小时内不再尝试）
    const lastFailed = failedTranslations.get(text);
    if (lastFailed && Date.now() - lastFailed < 86400000) {
      return;
    }

    // 避免重复翻译
    if (translationQueue.has(text)) return;

    // 限制队列大小
    if (translationQueue.size >= 20) {
      console.log("翻译队列已满，跳过:", text.substring(0, 30) + "...");
      return;
    }

    translationQueue.set(text, Date.now());

    // 1000ms 后批量处理（从500ms增加到1000ms，减少频率）
    clearTimeout(translationTimer);
    translationTimer = setTimeout(() => {
      processTranslationQueue();
    }, 1000);
  }

  // 处理翻译队列
  async function processTranslationQueue() {
    const texts = Array.from(translationQueue.keys());
    translationQueue.clear();

    // 批量翻译（每次最多 5 个）
    for (let i = 0; i < texts.length; i += 5) {
      const batch = texts.slice(i, i + 5);
      await Promise.all(batch.map(translateSingle));
    }
  }

  // 单个文本翻译
  async function translateSingle(text) {
    try {
      // 1. 检查缓存
      const cached = getFromCache(text);
      if (cached) {
        updateDOMWithTranslation(text, cached);
        return;
      }

      // 2. 调用在线翻译
      const translated = await fetchOnlineTranslation(text);

      if (translated) {
        // 3. 保存到缓存
        saveToCache(text, translated);

        // 4. 更新 DOM
        updateDOMWithTranslation(text, translated);

        // 5. 从失败列表中移除
        failedTranslations.delete(text);
      }
    } catch (error) {
      console.warn("翻译失败:", text, error);
      failedTranslations.set(text, Date.now());
    }
  }

  // 获取在线翻译（带重试）
  async function fetchOnlineTranslation(text, retryCount = 0) {
    try {
      // 根据文本语言自动选择翻译方向
      const targetLang = containsChinese(text) ? "en" : "zh-CN";
      console.log(
        `在线翻译: ${text} (${targetLang === "en" ? "中文→英文" : "英文→中文"})`,
      );
      return await translateWithMyMemory(text, targetLang);
    } catch (error) {
      console.warn(`翻译失败 (尝试 ${retryCount + 1}/3):`, text, error);

      if (retryCount < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        return fetchOnlineTranslation(text, retryCount + 1);
      }

      return null;
    }
  }

  // ========== 缓存管理 ==========

  // 生成缓存键
  function generateCacheKey(text) {
    // 使用简单的哈希函数
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const char = text.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // 转换为32位整数
    }
    return `trans_${Math.abs(hash)}`;
  }

  // 从缓存获取翻译
  function getFromCache(text) {
    const cache = GM_getValue("translation_cache", {});
    const key = generateCacheKey(text);

    if (cache[key]) {
      // 检查是否过期（30天）
      const age = Date.now() - cache[key].timestamp;
      if (age < 2592000000) {
        // 30天 = 2592000000ms
        return cache[key].translation;
      } else {
        // 过期，删除
        delete cache[key];
        GM_setValue("translation_cache", cache);
      }
    }

    return null;
  }

  // 保存到缓存
  function saveToCache(text, translation) {
    const cache = GM_getValue("translation_cache", {});
    const key = generateCacheKey(text);

    // 检查容量限制（1000条）
    const entries = Object.keys(cache);
    if (entries.length >= 1000) {
      // 删除最旧的条目（LRU）
      let oldestKey = null;
      let oldestTime = Infinity;

      for (const k in cache) {
        if (cache[k].timestamp < oldestTime) {
          oldestTime = cache[k].timestamp;
          oldestKey = k;
        }
      }

      if (oldestKey) {
        delete cache[oldestKey];
      }
    }

    cache[key] = {
      original: text,
      translation: translation,
      timestamp: Date.now(),
    };

    GM_setValue("translation_cache", cache);
  }

  // 清理过期缓存
  function cleanupCache() {
    const cache = GM_getValue("translation_cache", {});
    const now = Date.now();
    let cleaned = 0;

    for (const key in cache) {
      const age = now - cache[key].timestamp;
      if (age > 2592000000) {
        // 30天
        delete cache[key];
        cleaned++;
      }
    }

    if (cleaned > 0) {
      GM_setValue("translation_cache", cache);
      console.log(`清理了 ${cleaned} 条过期缓存`);
    }

    return cleaned;
  }

  // 清空所有缓存
  function clearCache() {
    GM_setValue("translation_cache", {});
    console.log("已清空翻译缓存");
  }

  // 获取缓存统计
  function getCacheStats() {
    const cache = GM_getValue("translation_cache", {});
    return {
      total: Object.keys(cache).length,
      entries: Object.values(cache).map((entry) => ({
        original: entry.original,
        translation: entry.translation,
        age: Date.now() - entry.timestamp,
      })),
    };
  }

  // ========== 可视化标记 ==========

  // 添加未翻译标记
  function addUntranslatedMarker(element, originalText) {
    if (!element) return;

    element.classList.add("untranslated-text");
    element.setAttribute("title", `未翻译: ${originalText}`);
  }

  // 移除翻译标记
  function removeTranslationMarkers(element) {
    if (!element) return;

    // 移除所有翻译相关的类
    element.classList.remove(
      "untranslated-text",
      "translating-text",
      "translation-failed",
    );

    // 移除title属性
    element.removeAttribute("title");

    // 移除可能的内联样式
    element.style.removeProperty("border-bottom");
    element.style.removeProperty("background");
  }

  // 更新 DOM 中的翻译
  function updateDOMWithTranslation(originalText, translatedText) {
    // 查找所有带有原始文本属性的元素
    const elements = document.querySelectorAll(
      `[${ORIGINAL_TEXT_ATTR}="${originalText}"]`,
    );

    elements.forEach((element) => {
      // 更新文本内容
      const textNodes = getTextNodes(element);
      textNodes.forEach((node) => {
        const translated = applyMode(originalText, translatedText);
        if (node.textContent !== translated) {
          node.textContent = translated;
        }
      });

      // 移除未翻译标记
      removeTranslationMarkers(element);
    });
  }

  // ========== DOM 操作 ==========
  // 获取所有文本节点
  function getTextNodes(element) {
    // 检查缓存
    if (textNodeCache.has(element)) {
      const cached = textNodeCache.get(element);
      // 检查缓存是否过期（2秒）
      if (Date.now() - cached.timestamp < 2000) {
        return cached.nodes;
      }
    }

    const textNodes = [];
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
      acceptNode: (node) => {
        // 跳过空白节点
        if (!node.textContent.trim()) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    while (walker.nextNode()) {
      textNodes.push(walker.currentNode);
    }

    // 缓存结果
    textNodeCache.set(element, {
      nodes: textNodes,
      timestamp: Date.now(),
    });

    return textNodes;
  }

  // 翻译元素及其子元素
  function translateElement(element, forceRestore = false, depth = 0) {
    if (!element || shouldIgnore(element)) return;

    // 限制递归深度，避免无限递归
    const MAX_DEPTH = 20;
    if (depth > MAX_DEPTH) {
      console.warn("翻译深度超过限制:", element);
      return;
    }

    // 只在顶层翻译时显示加载界面（depth === 0）
    if (depth === 0 && !forceRestore) {
      startTranslationActivity();
    }

    // 翻译文本节点
    const textNodes = getTextNodes(element);
    textNodes.forEach((node) => {
      const parentElement = node.parentElement;

      // 获取或保存原始文本
      let originalText = node.textContent.trim();

      // 如果父元素有保存的原始文本，使用它
      if (parentElement && parentElement.hasAttribute(ORIGINAL_TEXT_ATTR)) {
        originalText = parentElement.getAttribute(ORIGINAL_TEXT_ATTR);
      } else if (parentElement) {
        // 第一次翻译，需要确定原始文本
        let textToSave = originalText;

        // 如果当前文本是双语文本，提取英文部分
        if (containsChinese(originalText) && originalText.includes("(")) {
          textToSave = extractEnglishFromBilingual(originalText);
        }

        // 如果当前文本是纯中文，尝试从字典中找到对应的英文
        if (containsChinese(originalText) && !originalText.includes("(")) {
          if (locals[originalText]) {
            // 找到中文对应的英文，保存英文作为原始文本
            textToSave = originalText; // 保存中文，因为 locals 是英文→中文的映射
          } else if (
            window.mapgenieReverseLocals &&
            window.mapgenieReverseLocals[originalText]
          ) {
            // 找到中文对应的英文
            textToSave = window.mapgenieReverseLocals[originalText];
          }
        }

        // 保存原始文本
        parentElement.setAttribute(ORIGINAL_TEXT_ATTR, textToSave);
        originalText = textToSave;
      }

      // 强制恢复或重新翻译
      if (forceRestore) {
        // 恢复原始文本
        if (node.textContent !== originalText) {
          node.textContent = originalText;
        }
        // 移除标记
        removeTranslationMarkers(parentElement);
      } else {
        // 根据当前模式翻译
        const translatedText = translate(originalText, originalText);

        // 检查是否需要添加未翻译标记
        // 只有在本地词库和缓存中都没有翻译，且不启用在线翻译时才标记
        const hasLocalTranslation = locals[originalText] !== undefined;
        const hasCachedTranslation = getFromCache(originalText) !== null;
        const shouldMark =
          translatedText === originalText &&
          !hasLocalTranslation &&
          !hasCachedTranslation &&
          !config.enableOnlineTranslation;

        if (shouldMark) {
          addUntranslatedMarker(parentElement, originalText);
        }

        if (node.textContent !== translatedText) {
          node.textContent = translatedText;
        }
      }
    });

    // 翻译属性
    const attributes = ["title", "placeholder", "alt"];
    attributes.forEach((attr) => {
      if (element.hasAttribute(attr)) {
        let originalAttr = element.getAttribute(attr);

        // 保存原始属性值（总是保存，即使已经保存过）
        const savedOriginal = element.getAttribute(
          `${ORIGINAL_TEXT_ATTR}-${attr}`,
        );
        if (!savedOriginal) {
          element.setAttribute(`${ORIGINAL_TEXT_ATTR}-${attr}`, originalAttr);
        } else {
          // 如果已经保存过，使用保存的原始值
          originalAttr = savedOriginal;
        }

        // 根据当前模式翻译
        if (config.mode !== "original") {
          const translatedAttr = translate(originalAttr, originalAttr);
          if (originalAttr !== translatedAttr) {
            element.setAttribute(attr, translatedAttr);
          }
        } else {
          // 恢复原始属性值
          if (savedOriginal && element.getAttribute(attr) !== savedOriginal) {
            element.setAttribute(attr, savedOriginal);
          }
        }
      }
    });

    // 递归翻译子元素
    if (element.children) {
      Array.from(element.children).forEach((child) => {
        translateElement(child, forceRestore, depth + 1);
      });
    }

    // 只在顶层翻译时隐藏加载界面（depth === 0）
    if (depth === 0 && !forceRestore) {
      endTranslationActivity();
    }
  }

  // 重新翻译整个页面
  function retranslatePage() {
    console.log("切换到模式:", config.mode);
    startTranslationActivity();

    // 使用 setTimeout 让加载遮罩层有时间显示
    setTimeout(() => {
      translateElement(document.body, false);
      endTranslationActivity();
    }, 100);
  }

  // 恢复所有原始文本
  function restoreOriginalText() {
    translateElement(document.body, true);
  }

  // ========== 控制菜单 ==========
  function createControlMenu() {
    // 检查是否已存在
    if (document.getElementById("mapgenie-chinese-menu")) {
      return;
    }

    // 创建加载遮罩层
    const loadingOverlay = document.createElement("div");
    loadingOverlay.id = "mapgenie-loading-overlay";
    loadingOverlay.innerHTML = `
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <div class="loading-text">翻译中...</div>
      </div>
    `;
    loadingOverlay.style.display = "none";
    document.body.appendChild(loadingOverlay);

    // 创建控制菜单
    const menu = document.createElement("div");
    menu.id = "mapgenie-chinese-menu";
    menu.innerHTML = `
      <div class="menu-header-bar">
        <div class="menu-title" title="点击展开汉化菜单">
          <svg class="menu-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M2 12h20"></path>
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
          </svg>
          <span>汉化设置</span>
        </div>
        <div class="menu-close" title="关闭">×</div>
      </div>
      <div class="menu-content">
        <div class="menu-section">
          <div class="menu-section-title">语言模式</div>
          <div class="menu-item" data-mode="original">原文</div>
          <div class="menu-item" data-mode="translated">汉化</div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title">功能选项</div>
          <div class="menu-toggle-item" data-config="enableOnlineTranslation">
            <span class="toggle-indicator">✓</span>
            <span class="toggle-label">启用在线翻译</span>
          </div>
          <div class="menu-toggle-item" data-config="enableChineseSearch">
            <span class="toggle-indicator">✓</span>
            <span class="toggle-label">启用中文搜索</span>
          </div>
        </div>

        <div class="menu-section">
          <div class="menu-section-title">缓存管理</div>
          <div class="menu-item cache-stats" id="cache-stats">缓存: 加载中...</div>
          <div class="menu-item" id="clear-cache">清理缓存</div>
        </div>

        <div class="menu-footer">
          <div class="menu-version">v1.5.1</div>
        </div>
      </div>
    `;

    document.body.appendChild(menu);

    // 默认最小化
    menu.classList.add("minimized");

    // 添加样式
    GM_addStyle(`
      /* 浮动按钮 */
      /* 加载遮罩层 */
      #mapgenie-loading-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 999999;
        display: none;
        align-items: center;
        justify-content: center;
      }

      .loading-content {
        background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
        padding: 40px 60px;
        border-radius: 20px;
        box-shadow: 0 0 40px rgba(0, 212, 255, 0.3);
        text-align: center;
        border: 1px solid rgba(0, 212, 255, 0.3);
      }

      .loading-spinner {
        width: 60px;
        height: 60px;
        margin: 0 auto 20px;
        position: relative;
      }

      .loading-spinner::before,
      .loading-spinner::after {
        content: '';
        position: absolute;
        border: 3px solid transparent;
        border-radius: 50%;
      }

      .loading-spinner::before {
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-top-color: #00d4ff;
        border-right-color: #00d4ff;
        animation: spin 1s linear infinite;
      }

      .loading-spinner::after {
        top: 10px;
        left: 10px;
        right: 10px;
        bottom: 10px;
        border-bottom-color: #00ff88;
        border-left-color: #00ff88;
        animation: spin 1.5s linear infinite reverse;
      }

      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }

      .loading-text {
        color: #00d4ff;
        font-size: 18px;
        font-weight: bold;
        letter-spacing: 2px;
        text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
      }

      /* 控制菜单 */
      #mapgenie-chinese-menu {
        position: fixed;
        top: 100px;
        right: 20px;
        z-index: 99999;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        min-width: 280px;
        background: linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%);
        border-radius: 16px;
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 212, 255, 0.2);
        border: 1px solid rgba(0, 212, 255, 0.2);
        overflow: hidden;
        transition: transform 0.3s ease, opacity 0.3s ease;
      }

      #mapgenie-chinese-menu.minimized {
        width: 56px;
        min-width: 56px;
        height: 56px;
        border-radius: 50%;
        overflow: hidden;
        box-shadow: 0 4px 20px rgba(0, 212, 255, 0.4);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }

      #mapgenie-chinese-menu.minimized:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 30px rgba(0, 212, 255, 0.6);
      }

      #mapgenie-chinese-menu.minimized .menu-content {
        display: none;
      }

      #mapgenie-chinese-menu.minimized .menu-header-bar {
        justify-content: center;
        height: 100%;
        padding: 0;
        border-bottom: none;
        cursor: pointer;
      }

      #mapgenie-chinese-menu.minimized .menu-title span,
      #mapgenie-chinese-menu.minimized .menu-close {
        display: none;
      }

      #mapgenie-chinese-menu.minimized .menu-icon {
        width: 28px;
        height: 28px;
      }

      .menu-header-bar {
        background: rgba(0, 212, 255, 0.1);
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        cursor: move;
        border-bottom: 1px solid rgba(0, 212, 255, 0.2);
        user-select: none;
      }

      .menu-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: #00d4ff;
        font-size: 14px;
        font-weight: bold;
        text-shadow: 0 0 10px rgba(0, 212, 255, 0.5);
      }

      .menu-icon {
        width: 20px;
        height: 20px;
        animation: pulse 2s ease-in-out infinite;
      }

      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }

      .menu-close {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #ff6b6b;
        font-size: 24px;
        cursor: pointer;
        transition: all 0.2s;
        border-radius: 4px;
        line-height: 1;
      }

      .menu-close:hover {
        background: rgba(255, 107, 107, 0.2);
        transform: rotate(90deg);
      }

      .menu-content {
        padding: 8px 0;
        max-height: 500px;
        overflow-y: auto;
      }

      .menu-content::-webkit-scrollbar {
        width: 6px;
      }

      .menu-content::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.2);
      }

      .menu-content::-webkit-scrollbar-thumb {
        background: rgba(0, 212, 255, 0.3);
        border-radius: 3px;
      }

      .menu-section {
        margin: 8px 12px;
        padding: 12px;
        background: rgba(0, 0, 0, 0.2);
        border-radius: 8px;
        border: 1px solid rgba(0, 212, 255, 0.1);
      }

      .menu-section-title {
        font-size: 11px;
        font-weight: bold;
        color: #00ff88;
        text-transform: uppercase;
        letter-spacing: 1px;
        margin-bottom: 8px;
        padding-bottom: 4px;
        border-bottom: 1px solid rgba(0, 255, 136, 0.2);
      }

      .menu-item {
        padding: 10px 12px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 13px;
        color: #e0e0e0;
        border-radius: 6px;
        margin-bottom: 4px;
      }

      .menu-item:hover {
        background: rgba(0, 212, 255, 0.15);
        color: #00d4ff;
        transform: translateX(4px);
      }

      .menu-item.active {
        background: linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(0, 255, 136, 0.3) 100%);
        color: #00ff88;
        font-weight: bold;
        box-shadow: 0 0 10px rgba(0, 255, 136, 0.2);
      }

      .menu-toggle-item {
        padding: 10px 12px;
        cursor: pointer;
        transition: all 0.2s;
        font-size: 13px;
        color: #e0e0e0;
        border-radius: 6px;
        margin-bottom: 4px;
        display: flex;
        align-items: center;
        gap: 10px;
      }

      .menu-toggle-item:hover {
        background: rgba(0, 212, 255, 0.15);
        color: #00d4ff;
      }

      .toggle-indicator {
        width: 18px;
        height: 18px;
        border: 2px solid #00ff88;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        color: #00ff88;
        flex-shrink: 0;
        transition: all 0.2s;
        box-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
      }

      .menu-toggle-item.disabled .toggle-indicator {
        border-color: #555;
        color: transparent;
        box-shadow: none;
      }

      .menu-toggle-item.disabled .toggle-label {
        color: #777;
      }

      .cache-stats {
        font-size: 12px;
        color: #999;
      }

      .menu-footer {
        padding: 12px;
        text-align: center;
        border-top: 1px solid rgba(0, 212, 255, 0.1);
      }

      .menu-version {
        font-size: 11px;
        color: #555;
      }

      /* 未翻译文本标记 */
      .untranslated-text {
        border-bottom: 2px dashed #ff9800;
        background: linear-gradient(180deg, rgba(255,152,0,0.1) 0%, transparent 100%);
        cursor: help;
        position: relative;
      }

      .untranslated-text::after {
        content: "🌐";
        position: absolute;
        right: -20px;
        top: 0;
        font-size: 12px;
        opacity: 0.7;
      }

      /* 翻译中标记 */
      .translating-text {
        opacity: 0.7;
        background: linear-gradient(180deg, rgba(102,126,234,0.1) 0%, transparent 100%);
      }

      /* 翻译失败标记 */
      .translation-failed {
        border-bottom: 2px dashed #f44336;
        background: linear-gradient(180deg, rgba(244,67,54,0.1) 0%, transparent 100%);
      }

      /* 工具提示 */
      .untranslated-text[title]:hover::before {
        content: attr(title);
        position: absolute;
        bottom: 100%;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: #fff;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        white-space: nowrap;
        z-index: 100000;
      }
    `);

    // 拖动功能
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;

    const headerBar = menu.querySelector(".menu-header-bar");

    headerBar.addEventListener("mousedown", dragStart);
    document.addEventListener("mouseup", dragEnd);
    document.addEventListener("mousemove", drag);

    function dragStart(e) {
      if (e.target.classList.contains("menu-close")) return;

      initialX = e.clientX - xOffset;
      initialY = e.clientY - yOffset;
      isDragging = true;
      menu.style.transition = "none";
    }

    function dragEnd() {
      initialX = currentX;
      initialY = currentY;
      isDragging = false;
      menu.style.transition = "transform 0.3s ease, opacity 0.3s ease";
    }

    function drag(e) {
      if (isDragging) {
        e.preventDefault();
        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;
        xOffset = currentX;
        yOffset = currentY;
        menu.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
    }

    // 最小化功能
    headerBar.addEventListener("dblclick", () => {
      if (menu.classList.contains("minimized")) {
        menu.classList.remove("minimized");
      } else {
        menu.classList.add("minimized");
      }
    });

    // 最小化时单击也能展开
    headerBar.addEventListener("click", (e) => {
      if (menu.classList.contains("minimized")) {
        menu.classList.remove("minimized");
      }
    });

    // 关闭功能
    menu.querySelector(".menu-close").addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.add("minimized");
    });

    // 绑定事件
    menu.querySelectorAll(".menu-item[data-mode]").forEach((item) => {
      item.addEventListener("click", () => {
        const mode = item.getAttribute("data-mode");
        console.log("切换语言模式:", mode);
        config.mode = mode;
        saveConfig();
        updateMenuActiveState();

        // 重新翻译页面
        showLoadingOverlay();
        setTimeout(() => {
          console.log("开始重新翻译页面...");
          retranslatePage();
          console.log("页面重新翻译完成");
          hideLoadingOverlay();
        }, 100);
      });
    });

    // 在线翻译开关
    menu.querySelectorAll(".menu-toggle-item").forEach((item) => {
      item.addEventListener("click", () => {
        const configKey = item.getAttribute("data-config");
        config[configKey] = !config[configKey];
        saveConfig();
        updateToggleItemState(item, config[configKey]);
      });
    });

    // 清理缓存
    document.getElementById("clear-cache").addEventListener("click", () => {
      clearCache();
      updateCacheStats();
      alert("缓存已清理");
    });

    updateMenuActiveState();
    updateToggleItemsState();
  }

  // 显示加载遮罩层
  function showLoadingOverlay() {
    const overlay = document.getElementById("mapgenie-loading-overlay");
    if (overlay) {
      overlay.style.display = "flex";
    }
  }

  // 隐藏加载遮罩层
  function hideLoadingOverlay() {
    const overlay = document.getElementById("mapgenie-loading-overlay");
    if (overlay) {
      overlay.style.display = "none";
    }
  }

  // 更新菜单激活状态
  function updateMenuActiveState() {
    const menu = document.getElementById("mapgenie-chinese-menu");
    if (!menu) return;

    menu.querySelectorAll(".menu-item").forEach((item) => {
      if (item.getAttribute("data-mode") === config.mode) {
        item.classList.add("active");
      } else {
        item.classList.remove("active");
      }
    });
  }

  // 更新缓存统计
  function updateCacheStats() {
    const stats = getCacheStats();
    const statsElement = document.getElementById("cache-stats");
    if (statsElement) {
      statsElement.textContent = `缓存: ${stats.total} 条`;
    }
  }

  // 更新开关项状态
  function updateToggleItemsState() {
    const menu = document.getElementById("mapgenie-chinese-menu");
    if (!menu) return;

    menu.querySelectorAll(".menu-toggle-item").forEach((item) => {
      const configKey = item.getAttribute("data-config");
      updateToggleItemState(item, config[configKey]);
    });
  }

  function updateToggleItemState(item, enabled) {
    if (enabled) {
      item.classList.remove("disabled");
      item.querySelector(".toggle-indicator").textContent = "✓";
    } else {
      item.classList.add("disabled");
      item.querySelector(".toggle-indicator").textContent = "";
    }
  }

  // ========== DOM 监听 ==========
  function setupDOMObserver() {
    let debounceTimer = null;
    let isProcessing = false;

    const observer = new MutationObserver((mutations) => {
      // 防抖：在100ms内只处理一次
      if (isProcessing) return;

      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        isProcessing = true;
        startTranslationActivity();

        mutations.forEach((mutation) => {
          if (mutation.type === "childList") {
            mutation.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                // 只翻译可见元素
                if (isElementVisible(node)) {
                  translateElement(node, false, 0);
                }
              }
            });
          } else if (mutation.type === "characterData") {
            // 处理文本内容变化
            const target = mutation.target;
            if (target.nodeType === Node.TEXT_NODE && target.parentElement) {
              translateElement(target.parentElement, false, 0);
            }
          }
        });

        // 使用requestAnimationFrame避免阻塞
        requestAnimationFrame(() => {
          isProcessing = false;
          endTranslationActivity();
        });
      }, 100);
    });

    // 开始监听
    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
      characterData: true, // 启用 characterData 监听
      characterDataOldValue: false,
    });
  }

  // 检查元素是否可见
  function isElementVisible(element) {
    try {
      const style = window.getComputedStyle(element);

      // 检查基本 CSS 属性
      if (
        style.display === "none" ||
        style.visibility === "hidden" ||
        style.opacity === "0"
      ) {
        return false;
      }

      // 检查元素是否在视口内
      const rect = element.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        return false;
      }

      // 检查所有父元素是否可见
      let parent = element.parentElement;
      while (parent && parent !== document.body) {
        const parentStyle = window.getComputedStyle(parent);
        if (
          parentStyle.display === "none" ||
          parentStyle.visibility === "hidden"
        ) {
          return false;
        }
        parent = parent.parentElement;
      }

      return true;
    } catch (e) {
      return true; // 如果无法获取样式，默认可见
    }
  }

  // ========== 初始化 ==========
  function init() {
    console.log("========================================");
    console.log("MapGenie 森林之子地图汉化插件已加载");
    console.log("版本: 1.0.2");
    console.log("翻译词库数量:", Object.keys(locals).length - 1); // 减去 regex
    console.log("当前模式:", config.mode);
    console.log("========================================");

    // 加载配置
    loadConfig();

    // 等待页面完全加载后再翻译
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        setTimeout(() => {
          initAfterLoad();
        }, 500);
      });
    } else {
      setTimeout(() => {
        initAfterLoad();
      }, 500);
    }
  }

  // 页面加载完成后的初始化
  function initAfterLoad() {
    // 创建控制菜单
    createControlMenu();

    // 设置 DOM 监听
    setupDOMObserver();

    // 设置搜索拦截
    setupSearchInterception();

    // 自动清理缓存（如果启用）
    if (config.autoCacheCleanup) {
      const cleaned = cleanupCache();
      if (cleaned > 0) {
        console.log(`自动清理了 ${cleaned} 条过期缓存`);
      }
    }

    // 初始翻译
    console.log("开始翻译页面...");
    retranslatePage();
    console.log("页面翻译完成");

    // 设置轮询机制处理动态内容
    setupPeriodicTranslation();

    // 设置 tooltip 翻译
    setupTooltipTranslation();

    // 设置 tooltip Observer
    setupTooltipObserver();

    // 添加延迟翻译（处理延迟加载的内容）
    setTimeout(() => {
      console.log("执行延迟翻译...");
      retranslatePage();
    }, 2000);

    setTimeout(() => {
      console.log("执行第二次延迟翻译...");
      retranslatePage();
    }, 5000);
  }

  // 轮询机制处理动态内容
  function setupPeriodicTranslation() {
    // 每3秒检查一次未翻译的元素
    setInterval(() => {
      try {
        startTranslationActivity();

        // 查找所有文本节点
        const walker = document.createTreeWalker(
          document.body,
          NodeFilter.SHOW_TEXT,
          {
            acceptNode: (node) => {
              // 跳过空白节点
              if (!node.textContent.trim()) {
                return NodeFilter.FILTER_REJECT;
              }
              // 跳过已忽略的元素
              if (node.parentElement && shouldIgnore(node.parentElement)) {
                return NodeFilter.FILTER_REJECT;
              }
              return NodeFilter.FILTER_ACCEPT;
            },
          },
        );

        let translatedCount = 0;
        const processedNodes = new Set();

        while (walker.nextNode()) {
          const node = walker.currentNode;
          const text = node.textContent.trim();
          const parentElement = node.parentElement;

          // 避免重复处理
          if (processedNodes.has(node)) {
            continue;
          }
          processedNodes.add(node);

          // 检查是否需要翻译
          if (text && config.mode !== "original") {
            // 检查是否已翻译
            const originalText = parentElement
              ? parentElement.getAttribute(ORIGINAL_TEXT_ATTR)
              : null;
            if (originalText && text === originalText) {
              // 已标记但未翻译，尝试翻译
              const translatedText = translate(originalText, originalText);
              if (translatedText !== originalText) {
                node.textContent = translatedText;
                translatedCount++;
              }
            } else if (!originalText && text.length > 0 && text.length < 100) {
              // 未标记的新元素，尝试翻译（只翻译短文本）

              // 只处理英文文本，避免覆盖正确的原始文本
              if (isEnglishText(text)) {
                const translatedText = translate(text, text);
                if (translatedText !== text && parentElement) {
                  parentElement.setAttribute(ORIGINAL_TEXT_ATTR, text);
                  node.textContent = translatedText;
                  translatedCount++;
                }
              }
            }
          }
        }

        if (translatedCount > 0) {
          console.log(`轮询翻译了 ${translatedCount} 个元素`);
        }

        endTranslationActivity();
      } catch (e) {
        console.warn("轮询翻译出错:", e);
        endTranslationActivity();
      }
    }, 3000);
  }

  // 设置 tooltip 翻译
  function setupTooltipTranslation() {
    // 使用事件委托监听鼠标悬停事件
    document.addEventListener(
      "mouseover",
      (e) => {
        const target = e.target;

        // 检查是否有 title 属性
        if (target.hasAttribute("title")) {
          const title = target.getAttribute("title");
          const originalTitle = target.getAttribute(
            `${ORIGINAL_TEXT_ATTR}-title`,
          );

          // 如果没有保存原始值，保存它
          if (!originalTitle) {
            target.setAttribute(`${ORIGINAL_TEXT_ATTR}-title`, title);
          }

          // 翻译 tooltip
          if (config.mode !== "original" && title) {
            startTranslationActivity();
            const translatedTitle = translate(title, originalTitle || title);
            if (translatedTitle !== title) {
              target.setAttribute("title", translatedTitle);
            }
            endTranslationActivity();
          }
        }

        // 检查是否有自定义 tooltip 元素
        const tooltipElement = document.querySelector(
          '.tooltip, [role="tooltip"], .tippy-box, .popover',
        );
        if (tooltipElement && tooltipElement.textContent.trim()) {
          const text = tooltipElement.textContent.trim();
          const originalText = tooltipElement.getAttribute(ORIGINAL_TEXT_ATTR);

          if (!originalText) {
            tooltipElement.setAttribute(ORIGINAL_TEXT_ATTR, text);
          }

          if (config.mode !== "original" && text && text.length < 100) {
            startTranslationActivity();
            const translatedText = translate(text, originalText || text);
            if (translatedText !== text) {
              tooltipElement.textContent = translatedText;
            }
            endTranslationActivity();
          }
        }
      },
      true,
    ); // 使用捕获阶段，确保在其他事件处理器之前执行

    // 监听鼠标离开事件，恢复原始 tooltip
    document.addEventListener(
      "mouseout",
      (e) => {
        const target = e.target;

        if (target.hasAttribute(`${ORIGINAL_TEXT_ATTR}-title`)) {
          const originalTitle = target.getAttribute(
            `${ORIGINAL_TEXT_ATTR}-title`,
          );
          if (originalTitle && config.mode !== "original") {
            target.setAttribute("title", originalTitle);
          }
        }
      },
      true,
    );
  }

  // 设置 tooltip Observer
  function setupTooltipObserver() {
    // 监听所有 tooltip 相关的变化
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              // 检查是否是 tooltip 元素
              if (
                node.classList.contains("tooltip") ||
                node.getAttribute("role") === "tooltip" ||
                node.classList.contains("tippy-box") ||
                node.classList.contains("popover")
              ) {
                // 翻译 tooltip 内容
                const textNodes = getTextNodes(node);
                textNodes.forEach((textNode) => {
                  const text = textNode.textContent.trim();
                  if (text && config.mode !== "original" && text.length < 100) {
                    const translatedText = translate(text, text);
                    if (translatedText !== text) {
                      node.setAttribute(ORIGINAL_TEXT_ATTR, text);
                      textNode.textContent = translatedText;
                    }
                  }
                });
              }
            }
          });
        } else if (mutation.type === "characterData") {
          // 处理文本内容变化
          const target = mutation.target;
          if (target.nodeType === Node.TEXT_NODE && target.parentElement) {
            const parent = target.parentElement;
            // 检查是否是 tooltip 元素
            if (
              parent.classList.contains("tooltip") ||
              parent.getAttribute("role") === "tooltip" ||
              parent.classList.contains("tippy-box") ||
              parent.classList.contains("popover")
            ) {
              const text = target.textContent.trim();
              if (text && config.mode !== "original" && text.length < 100) {
                const translatedText = translate(text, text);
                if (translatedText !== text) {
                  parent.setAttribute(ORIGINAL_TEXT_ATTR, text);
                  target.textContent = translatedText;
                }
              }
            }
          }
        }
      });
    });

    // 开始监听
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  // 启动插件
  init();
})();
