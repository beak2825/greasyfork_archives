// ==UserScript==
// @name         universalis-zh-data
// @name:zh      Universalis 中文数据补全
// @namespace    http://tanimodori.com/
// @version      0.0.1
// @description  Universalis Chinese data localization script
// @description:zh Universalis 中文数据补全脚本
// @author       Tanimodori
// @match        https://universalis.app/*
// @include      https://universalis.app/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/561201/universalis-zh-data.user.js
// @updateURL https://update.greasyfork.org/scripts/561201/universalis-zh-data.meta.js
// ==/UserScript==
(function() {
  "use strict";
  const origFetch = window.fetch;
  const injectFetch = (injector) => {
    window.fetch = async (...args) => {
      let response = await origFetch(...args);
      const pkg = {
        url: args[0].toString(),
        response,
        json: await response.clone().json()
      };
      response = await injector(pkg);
      return response;
    };
  };
  const UICategory = {
    0: { UICategory: 0, UICategoryName: "", Icon: 0 },
    1: { UICategory: 1, UICategoryName: "格斗武器", Icon: 60101 },
    2: { UICategory: 2, UICategoryName: "单手剑", Icon: 60102 },
    3: { UICategory: 3, UICategoryName: "大斧", Icon: 60103 },
    4: { UICategory: 4, UICategoryName: "弓", Icon: 60105 },
    5: { UICategory: 5, UICategoryName: "长枪", Icon: 60104 },
    6: { UICategory: 6, UICategoryName: "单手咒杖", Icon: 60108 },
    7: { UICategory: 7, UICategoryName: "双手咒杖", Icon: 60108 },
    8: { UICategory: 8, UICategoryName: "单手幻杖", Icon: 60107 },
    9: { UICategory: 9, UICategoryName: "双手幻杖", Icon: 60107 },
    10: { UICategory: 10, UICategoryName: "魔导书", Icon: 60109 },
    11: { UICategory: 11, UICategoryName: "盾", Icon: 60110 },
    12: { UICategory: 12, UICategoryName: "刻木工具（主工具）", Icon: 60112 },
    13: { UICategory: 13, UICategoryName: "刻木工具（副工具）", Icon: 60112 },
    14: { UICategory: 14, UICategoryName: "锻铁工具（主工具）", Icon: 60113 },
    15: { UICategory: 15, UICategoryName: "锻铁工具（副工具）", Icon: 60113 },
    16: { UICategory: 16, UICategoryName: "铸甲工具（主工具）", Icon: 60114 },
    17: { UICategory: 17, UICategoryName: "铸甲工具（副工具）", Icon: 60114 },
    18: { UICategory: 18, UICategoryName: "雕金工具（主工具）", Icon: 60115 },
    19: { UICategory: 19, UICategoryName: "雕金工具（副工具）", Icon: 60115 },
    20: { UICategory: 20, UICategoryName: "制革工具（主工具）", Icon: 60116 },
    21: { UICategory: 21, UICategoryName: "制革工具（副工具）", Icon: 60116 },
    22: { UICategory: 22, UICategoryName: "裁衣工具（主工具）", Icon: 60117 },
    23: { UICategory: 23, UICategoryName: "裁衣工具（副工具）", Icon: 60117 },
    24: { UICategory: 24, UICategoryName: "炼金工具（主工具）", Icon: 60118 },
    25: { UICategory: 25, UICategoryName: "炼金工具（副工具）", Icon: 60118 },
    26: { UICategory: 26, UICategoryName: "烹调工具（主工具）", Icon: 60119 },
    27: { UICategory: 27, UICategoryName: "烹调工具（副工具）", Icon: 60119 },
    28: { UICategory: 28, UICategoryName: "采矿工具（主工具）", Icon: 60120 },
    29: { UICategory: 29, UICategoryName: "采矿工具（副工具）", Icon: 60120 },
    30: { UICategory: 30, UICategoryName: "园艺工具（主工具）", Icon: 60121 },
    31: { UICategory: 31, UICategoryName: "园艺工具（副工具）", Icon: 60121 },
    32: { UICategory: 32, UICategoryName: "捕鱼用具（主工具）", Icon: 60122 },
    33: { UICategory: 33, UICategoryName: "钓饵", Icon: 60123 },
    34: { UICategory: 34, UICategoryName: "头部防具", Icon: 60124 },
    35: { UICategory: 35, UICategoryName: "身体防具", Icon: 60126 },
    36: { UICategory: 36, UICategoryName: "腿部防具", Icon: 60128 },
    37: { UICategory: 37, UICategoryName: "手部防具", Icon: 60129 },
    38: { UICategory: 38, UICategoryName: "脚部防具", Icon: 60130 },
    39: { UICategory: 39, UICategoryName: "停止流通道具", Icon: 60131 },
    40: { UICategory: 40, UICategoryName: "项链", Icon: 60132 },
    41: { UICategory: 41, UICategoryName: "耳饰", Icon: 60133 },
    42: { UICategory: 42, UICategoryName: "手镯", Icon: 60134 },
    43: { UICategory: 43, UICategoryName: "戒指", Icon: 60135 },
    44: { UICategory: 44, UICategoryName: "药品", Icon: 60136 },
    45: { UICategory: 45, UICategoryName: "食材", Icon: 60137 },
    46: { UICategory: 46, UICategoryName: "食品", Icon: 60146 },
    47: { UICategory: 47, UICategoryName: "水产品", Icon: 60138 },
    48: { UICategory: 48, UICategoryName: "石材", Icon: 60139 },
    49: { UICategory: 49, UICategoryName: "金属", Icon: 60140 },
    50: { UICategory: 50, UICategoryName: "木材", Icon: 60141 },
    51: { UICategory: 51, UICategoryName: "布料", Icon: 60142 },
    52: { UICategory: 52, UICategoryName: "皮革", Icon: 60143 },
    53: { UICategory: 53, UICategoryName: "骨材", Icon: 60144 },
    54: { UICategory: 54, UICategoryName: "炼金原料", Icon: 60145 },
    55: { UICategory: 55, UICategoryName: "染料", Icon: 60147 },
    56: { UICategory: 56, UICategoryName: "部件", Icon: 60148 },
    57: { UICategory: 57, UICategoryName: "家具", Icon: 60164 },
    58: { UICategory: 58, UICategoryName: "魔晶石", Icon: 60150 },
    59: { UICategory: 59, UICategoryName: "水晶", Icon: 60151 },
    60: { UICategory: 60, UICategoryName: "触媒", Icon: 60152 },
    61: { UICategory: 61, UICategoryName: "杂货", Icon: 60153 },
    62: { UICategory: 62, UICategoryName: "灵魂水晶", Icon: 60157 },
    63: { UICategory: 63, UICategoryName: "其他", Icon: 60159 },
    64: { UICategory: 64, UICategoryName: "房产证书", Icon: 60160 },
    65: { UICategory: 65, UICategoryName: "房顶", Icon: 60160 },
    66: { UICategory: 66, UICategoryName: "外墙", Icon: 60160 },
    67: { UICategory: 67, UICategoryName: "窗户", Icon: 60160 },
    68: { UICategory: 68, UICategoryName: "房门", Icon: 60160 },
    69: { UICategory: 69, UICategoryName: "房顶装饰", Icon: 60160 },
    70: { UICategory: 70, UICategoryName: "外墙装饰", Icon: 60160 },
    71: { UICategory: 71, UICategoryName: "门牌", Icon: 60160 },
    72: { UICategory: 72, UICategoryName: "院墙", Icon: 60160 },
    73: { UICategory: 73, UICategoryName: "内墙", Icon: 60161 },
    74: { UICategory: 74, UICategoryName: "地板", Icon: 60161 },
    75: { UICategory: 75, UICategoryName: "屋顶照明", Icon: 60161 },
    76: { UICategory: 76, UICategoryName: "庭具", Icon: 60168 },
    77: { UICategory: 77, UICategoryName: "桌台", Icon: 60162 },
    78: { UICategory: 78, UICategoryName: "桌上", Icon: 60163 },
    79: { UICategory: 79, UICategoryName: "壁挂", Icon: 60166 },
    80: { UICategory: 80, UICategoryName: "地毯", Icon: 60167 },
    81: { UICategory: 81, UICategoryName: "宠物", Icon: 60155 },
    82: { UICategory: 82, UICategoryName: "栽培用品", Icon: 60153 },
    83: { UICategory: 83, UICategoryName: "半魔晶石", Icon: 60150 },
    84: { UICategory: 84, UICategoryName: "双剑", Icon: 60106 },
    85: { UICategory: 85, UICategoryName: "杂货（季节活动）", Icon: 60154 },
    86: { UICategory: 86, UICategoryName: "九宫幻卡", Icon: 60156 },
    87: { UICategory: 87, UICategoryName: "双手剑", Icon: 60170 },
    88: { UICategory: 88, UICategoryName: "火枪", Icon: 60172 },
    89: { UICategory: 89, UICategoryName: "天球仪", Icon: 60171 },
    90: { UICategory: 90, UICategoryName: "飞空艇部件（船体）", Icon: 60169 },
    91: { UICategory: 91, UICategoryName: "飞空艇部件（舾装）", Icon: 60169 },
    92: { UICategory: 92, UICategoryName: "飞空艇部件（船尾）", Icon: 60169 },
    93: { UICategory: 93, UICategoryName: "飞空艇部件（船首）", Icon: 60169 },
    94: { UICategory: 94, UICategoryName: "管弦乐琴乐谱", Icon: 60173 },
    95: { UICategory: 95, UICategoryName: "绘画作品", Icon: 60175 },
    96: { UICategory: 96, UICategoryName: "武士刀", Icon: 60177 },
    97: { UICategory: 97, UICategoryName: "刺剑", Icon: 60176 },
    98: { UICategory: 98, UICategoryName: "魔导书（学者专用）", Icon: 60178 },
    99: { UICategory: 99, UICategoryName: "捕鱼用具（副工具）", Icon: 60122 },
    100: { UICategory: 100, UICategoryName: "货币", Icon: 60179 },
    101: { UICategory: 101, UICategoryName: "潜水艇部件（船体）", Icon: 60169 },
    102: { UICategory: 102, UICategoryName: "潜水艇部件（船尾）", Icon: 60169 },
    103: { UICategory: 103, UICategoryName: "潜水艇部件（船首）", Icon: 60169 },
    104: { UICategory: 104, UICategoryName: "潜水艇部件（舰桥）", Icon: 60169 },
    105: { UICategory: 105, UICategoryName: "青魔杖", Icon: 60180 },
    106: { UICategory: 106, UICategoryName: "枪刃", Icon: 60181 },
    107: { UICategory: 107, UICategoryName: "投掷武器", Icon: 60182 },
    108: { UICategory: 108, UICategoryName: "双手镰刀", Icon: 60183 },
    109: { UICategory: 109, UICategoryName: "贤具", Icon: 60184 },
    110: { UICategory: 110, UICategoryName: "蝰蛇对剑", Icon: 60187 },
    111: { UICategory: 111, UICategoryName: "画笔", Icon: 60188 },
    112: { UICategory: 112, UICategoryName: "套装", Icon: 60159 }
  };
  const SearchCategory = {
    0: { SearchCategory: 0, SearchCategoryName: "", Icon: 0, ParentCategory: 0 },
    1: {
      SearchCategory: 1,
      SearchCategoryName: "武器",
      Icon: 60102,
      ParentCategory: 0
    },
    2: {
      SearchCategory: 2,
      SearchCategoryName: "制作工具",
      Icon: 60113,
      ParentCategory: 0
    },
    3: {
      SearchCategory: 3,
      SearchCategoryName: "采集工具",
      Icon: 60120,
      ParentCategory: 0
    },
    4: {
      SearchCategory: 4,
      SearchCategoryName: "防具",
      Icon: 60126,
      ParentCategory: 0
    },
    5: {
      SearchCategory: 5,
      SearchCategoryName: "饰品",
      Icon: 60135,
      ParentCategory: 0
    },
    6: {
      SearchCategory: 6,
      SearchCategoryName: "药品食品",
      Icon: 60136,
      ParentCategory: 0
    },
    7: {
      SearchCategory: 7,
      SearchCategoryName: "素材",
      Icon: 60137,
      ParentCategory: 0
    },
    8: {
      SearchCategory: 8,
      SearchCategoryName: "其他",
      Icon: 60159,
      ParentCategory: 0
    },
    9: {
      SearchCategory: 9,
      SearchCategoryName: "格斗武器",
      Icon: 60101,
      ParentCategory: 1
    },
    10: {
      SearchCategory: 10,
      SearchCategoryName: "剑",
      Icon: 60102,
      ParentCategory: 1
    },
    11: {
      SearchCategory: 11,
      SearchCategoryName: "斧",
      Icon: 60103,
      ParentCategory: 1
    },
    12: {
      SearchCategory: 12,
      SearchCategoryName: "弓",
      Icon: 60105,
      ParentCategory: 1
    },
    13: {
      SearchCategory: 13,
      SearchCategoryName: "长枪",
      Icon: 60104,
      ParentCategory: 1
    },
    14: {
      SearchCategory: 14,
      SearchCategoryName: "咒杖",
      Icon: 60108,
      ParentCategory: 1
    },
    15: {
      SearchCategory: 15,
      SearchCategoryName: "幻杖",
      Icon: 60107,
      ParentCategory: 1
    },
    16: {
      SearchCategory: 16,
      SearchCategoryName: "魔导书",
      Icon: 60109,
      ParentCategory: 1
    },
    17: {
      SearchCategory: 17,
      SearchCategoryName: "盾",
      Icon: 60110,
      ParentCategory: 2
    },
    18: {
      SearchCategory: 18,
      SearchCategoryName: "投掷武器",
      Icon: 60111,
      ParentCategory: 0
    },
    19: {
      SearchCategory: 19,
      SearchCategoryName: "刻木工具",
      Icon: 60112,
      ParentCategory: 1
    },
    20: {
      SearchCategory: 20,
      SearchCategoryName: "锻铁工具",
      Icon: 60113,
      ParentCategory: 1
    },
    21: {
      SearchCategory: 21,
      SearchCategoryName: "铸甲工具",
      Icon: 60114,
      ParentCategory: 1
    },
    22: {
      SearchCategory: 22,
      SearchCategoryName: "雕金工具",
      Icon: 60115,
      ParentCategory: 1
    },
    23: {
      SearchCategory: 23,
      SearchCategoryName: "制革工具",
      Icon: 60116,
      ParentCategory: 1
    },
    24: {
      SearchCategory: 24,
      SearchCategoryName: "裁衣工具",
      Icon: 60117,
      ParentCategory: 1
    },
    25: {
      SearchCategory: 25,
      SearchCategoryName: "炼金工具",
      Icon: 60118,
      ParentCategory: 1
    },
    26: {
      SearchCategory: 26,
      SearchCategoryName: "烹调工具",
      Icon: 60119,
      ParentCategory: 1
    },
    27: {
      SearchCategory: 27,
      SearchCategoryName: "采矿工具",
      Icon: 60120,
      ParentCategory: 1
    },
    28: {
      SearchCategory: 28,
      SearchCategoryName: "园艺工具",
      Icon: 60121,
      ParentCategory: 1
    },
    29: {
      SearchCategory: 29,
      SearchCategoryName: "捕鱼用具",
      Icon: 60122,
      ParentCategory: 1
    },
    30: {
      SearchCategory: 30,
      SearchCategoryName: "钓饵",
      Icon: 60123,
      ParentCategory: 1
    },
    31: {
      SearchCategory: 31,
      SearchCategoryName: "头部防具",
      Icon: 60124,
      ParentCategory: 2
    },
    32: {
      SearchCategory: 32,
      SearchCategoryName: "内衣",
      Icon: 60125,
      ParentCategory: 0
    },
    33: {
      SearchCategory: 33,
      SearchCategoryName: "身体防具",
      Icon: 60126,
      ParentCategory: 2
    },
    34: {
      SearchCategory: 34,
      SearchCategoryName: "内裤",
      Icon: 60127,
      ParentCategory: 0
    },
    35: {
      SearchCategory: 35,
      SearchCategoryName: "腿部防具",
      Icon: 60128,
      ParentCategory: 2
    },
    36: {
      SearchCategory: 36,
      SearchCategoryName: "手部防具",
      Icon: 60129,
      ParentCategory: 2
    },
    37: {
      SearchCategory: 37,
      SearchCategoryName: "脚部防具",
      Icon: 60130,
      ParentCategory: 2
    },
    38: {
      SearchCategory: 38,
      SearchCategoryName: "腰部防具",
      Icon: 60131,
      ParentCategory: 0
    },
    39: {
      SearchCategory: 39,
      SearchCategoryName: "项链",
      Icon: 60132,
      ParentCategory: 2
    },
    40: {
      SearchCategory: 40,
      SearchCategoryName: "耳饰",
      Icon: 60133,
      ParentCategory: 2
    },
    41: {
      SearchCategory: 41,
      SearchCategoryName: "手镯",
      Icon: 60134,
      ParentCategory: 2
    },
    42: {
      SearchCategory: 42,
      SearchCategoryName: "戒指",
      Icon: 60135,
      ParentCategory: 2
    },
    43: {
      SearchCategory: 43,
      SearchCategoryName: "药品",
      Icon: 60136,
      ParentCategory: 3
    },
    44: {
      SearchCategory: 44,
      SearchCategoryName: "食材",
      Icon: 60137,
      ParentCategory: 3
    },
    45: {
      SearchCategory: 45,
      SearchCategoryName: "食品",
      Icon: 60146,
      ParentCategory: 3
    },
    46: {
      SearchCategory: 46,
      SearchCategoryName: "水产品",
      Icon: 60138,
      ParentCategory: 3
    },
    47: {
      SearchCategory: 47,
      SearchCategoryName: "石材",
      Icon: 60139,
      ParentCategory: 3
    },
    48: {
      SearchCategory: 48,
      SearchCategoryName: "金属",
      Icon: 60140,
      ParentCategory: 3
    },
    49: {
      SearchCategory: 49,
      SearchCategoryName: "木材",
      Icon: 60141,
      ParentCategory: 3
    },
    50: {
      SearchCategory: 50,
      SearchCategoryName: "布料",
      Icon: 60142,
      ParentCategory: 3
    },
    51: {
      SearchCategory: 51,
      SearchCategoryName: "皮革",
      Icon: 60143,
      ParentCategory: 3
    },
    52: {
      SearchCategory: 52,
      SearchCategoryName: "骨材",
      Icon: 60144,
      ParentCategory: 3
    },
    53: {
      SearchCategory: 53,
      SearchCategoryName: "炼金原料",
      Icon: 60145,
      ParentCategory: 3
    },
    54: {
      SearchCategory: 54,
      SearchCategoryName: "染料",
      Icon: 60147,
      ParentCategory: 3
    },
    55: {
      SearchCategory: 55,
      SearchCategoryName: "部件",
      Icon: 60148,
      ParentCategory: 3
    },
    56: {
      SearchCategory: 56,
      SearchCategoryName: "一般家具",
      Icon: 60164,
      ParentCategory: 4
    },
    57: {
      SearchCategory: 57,
      SearchCategoryName: "魔晶石",
      Icon: 60150,
      ParentCategory: 3
    },
    58: {
      SearchCategory: 58,
      SearchCategoryName: "水晶",
      Icon: 60151,
      ParentCategory: 3
    },
    59: {
      SearchCategory: 59,
      SearchCategoryName: "触媒",
      Icon: 60152,
      ParentCategory: 3
    },
    60: {
      SearchCategory: 60,
      SearchCategoryName: "杂货",
      Icon: 60153,
      ParentCategory: 3
    },
    61: {
      SearchCategory: 61,
      SearchCategoryName: "灵魂水晶",
      Icon: 60157,
      ParentCategory: 0
    },
    62: {
      SearchCategory: 62,
      SearchCategoryName: "箭",
      Icon: 60153,
      ParentCategory: 0
    },
    63: {
      SearchCategory: 63,
      SearchCategoryName: "任务道具",
      Icon: 60158,
      ParentCategory: 0
    },
    64: {
      SearchCategory: 64,
      SearchCategoryName: "其他",
      Icon: 60159,
      ParentCategory: 0
    },
    65: {
      SearchCategory: 65,
      SearchCategoryName: "室外建材",
      Icon: 60160,
      ParentCategory: 4
    },
    66: {
      SearchCategory: 66,
      SearchCategoryName: "室内建材",
      Icon: 60161,
      ParentCategory: 4
    },
    67: {
      SearchCategory: 67,
      SearchCategoryName: "庭具",
      Icon: 60168,
      ParentCategory: 4
    },
    68: {
      SearchCategory: 68,
      SearchCategoryName: "椅子睡床",
      Icon: 60165,
      ParentCategory: 4
    },
    69: {
      SearchCategory: 69,
      SearchCategoryName: "桌台",
      Icon: 60162,
      ParentCategory: 4
    },
    70: {
      SearchCategory: 70,
      SearchCategoryName: "桌上",
      Icon: 60163,
      ParentCategory: 4
    },
    71: {
      SearchCategory: 71,
      SearchCategoryName: "壁挂",
      Icon: 60166,
      ParentCategory: 4
    },
    72: {
      SearchCategory: 72,
      SearchCategoryName: "地毯",
      Icon: 60167,
      ParentCategory: 4
    },
    73: {
      SearchCategory: 73,
      SearchCategoryName: "双剑",
      Icon: 60106,
      ParentCategory: 1
    },
    74: {
      SearchCategory: 74,
      SearchCategoryName: "杂货（季节活动）",
      Icon: 60154,
      ParentCategory: 3
    },
    75: {
      SearchCategory: 75,
      SearchCategoryName: "宠物",
      Icon: 60155,
      ParentCategory: 3
    },
    76: {
      SearchCategory: 76,
      SearchCategoryName: "双手剑",
      Icon: 60170,
      ParentCategory: 1
    },
    77: {
      SearchCategory: 77,
      SearchCategoryName: "火枪",
      Icon: 60172,
      ParentCategory: 1
    },
    78: {
      SearchCategory: 78,
      SearchCategoryName: "天球仪",
      Icon: 60171,
      ParentCategory: 1
    },
    79: {
      SearchCategory: 79,
      SearchCategoryName: "飞空艇/潜水艇部件",
      Icon: 60169,
      ParentCategory: 3
    },
    80: {
      SearchCategory: 80,
      SearchCategoryName: "管弦乐琴关联物品",
      Icon: 60173,
      ParentCategory: 3
    },
    81: {
      SearchCategory: 81,
      SearchCategoryName: "栽培用品",
      Icon: 60174,
      ParentCategory: 4
    },
    82: {
      SearchCategory: 82,
      SearchCategoryName: "绘画作品",
      Icon: 60175,
      ParentCategory: 4
    },
    83: {
      SearchCategory: 83,
      SearchCategoryName: "武士刀",
      Icon: 60177,
      ParentCategory: 1
    },
    84: {
      SearchCategory: 84,
      SearchCategoryName: "刺剑",
      Icon: 60176,
      ParentCategory: 1
    },
    85: {
      SearchCategory: 85,
      SearchCategoryName: "魔导书（学者专用）",
      Icon: 60178,
      ParentCategory: 1
    },
    86: {
      SearchCategory: 86,
      SearchCategoryName: "枪刃",
      Icon: 60181,
      ParentCategory: 1
    },
    87: {
      SearchCategory: 87,
      SearchCategoryName: "投掷武器",
      Icon: 60182,
      ParentCategory: 1
    },
    88: {
      SearchCategory: 88,
      SearchCategoryName: "双手镰刀",
      Icon: 60183,
      ParentCategory: 1
    },
    89: {
      SearchCategory: 89,
      SearchCategoryName: "贤具",
      Icon: 60184,
      ParentCategory: 1
    },
    90: {
      SearchCategory: 90,
      SearchCategoryName: "杂货（学习/收录类）",
      Icon: 60185,
      ParentCategory: 3
    },
    91: {
      SearchCategory: 91,
      SearchCategoryName: "蝰蛇对剑",
      Icon: 60187,
      ParentCategory: 1
    },
    92: {
      SearchCategory: 92,
      SearchCategoryName: "画笔",
      Icon: 60188,
      ParentCategory: 1
    },
    93: {
      SearchCategory: 93,
      SearchCategoryName: "",
      Icon: 0,
      ParentCategory: 0
    },
    94: {
      SearchCategory: 94,
      SearchCategoryName: "",
      Icon: 0,
      ParentCategory: 0
    },
    95: {
      SearchCategory: 95,
      SearchCategoryName: "",
      Icon: 0,
      ParentCategory: 0
    },
    96: {
      SearchCategory: 96,
      SearchCategoryName: "",
      Icon: 0,
      ParentCategory: 0
    },
    97: {
      SearchCategory: 97,
      SearchCategoryName: "",
      Icon: 0,
      ParentCategory: 0
    },
    98: {
      SearchCategory: 98,
      SearchCategoryName: "",
      Icon: 0,
      ParentCategory: 0
    },
    99: {
      SearchCategory: 99,
      SearchCategoryName: "",
      Icon: 0,
      ParentCategory: 0
    },
    100: {
      SearchCategory: 100,
      SearchCategoryName: "",
      Icon: 0,
      ParentCategory: 0
    }
  };
  const isCafeMakerPackage = (pkg) => {
    const url = new URL(pkg.url);
    if (url.hostname === "cafemaker.wakingsands.com" && url.pathname === "/search") {
      return true;
    }
    return false;
  };
  const getIconUrl = (iconId) => {
    const padded = iconId.toString().padStart(6, "0");
    return `/i/${padded.substring(0, 3)}000/${padded}.png`;
  };
  const getItemCategory = (UICategoryId) => {
    const category = {
      Icon: -1,
      UICategory: UICategoryId,
      UICategoryName: "",
      SearchCategory: -1,
      SearchCategoryName: "",
      ParentCategory: -1,
      ParentCategoryName: ""
    };
    const target = UICategory[UICategoryId];
    if (target) {
      category.Icon = target.Icon;
      category.UICategoryName = target.UICategoryName;
    }
    if (category.Icon !== 0) {
      for (const target2 of Object.values(SearchCategory)) {
        if (target2.Icon === category.Icon) {
          category.SearchCategory = target2.SearchCategory;
          category.SearchCategoryName = target2.SearchCategoryName;
          category.ParentCategory = target2.ParentCategory;
          const parent = SearchCategory[category.ParentCategory];
          if (parent) {
            category.ParentCategoryName = parent.SearchCategoryName;
          }
        }
      }
    }
    return category;
  };
  const getGarlandItem = async (itemId) => {
    const GARLAND_API_ITEM_ENDPOINT = `https://www.garlandtools.cn/db/doc/item/chs/3/${itemId}.json`;
    const response = await fetch(GARLAND_API_ITEM_ENDPOINT);
    const json = await response.json();
    return json.item;
  };
  const searchGarlandItem = async (item) => {
    const result = {
      ID: item.id,
      Icon: "",
      ItemKind: {
        Name: ""
      },
      ItemSearchCategory: {
        ID: -1,
        Name: ""
      },
      LevelItem: item.obj.l,
      Name: item.obj.n,
      Rarity: item.obj.r ?? 0
    };
    try {
      const itemDetail = await getGarlandItem(item.id);
      if (itemDetail.tradeable !== 1) {
        return null;
      }
      result.Icon = getIconUrl(itemDetail.icon);
      result.Rarity = itemDetail.rarity;
      const category = getItemCategory(itemDetail.category);
      result.ItemKind.Name = category.UICategoryName;
      result.ItemSearchCategory.ID = category.SearchCategory;
      result.ItemSearchCategory.Name = category.SearchCategoryName;
    } catch (e) {
      console.error("Failed to parse Garland API response:", e);
    }
    return result;
  };
  const searchGarland = async (searchString) => {
    const newParams = new URLSearchParams({
      text: searchString,
      lang: "chs",
      type: "item"
    });
    const GARLAND_API_SEARCH_ENDPOINT = "https://www.garlandtools.cn/api/search.php";
    const response = await fetch(
      `${GARLAND_API_SEARCH_ENDPOINT}?${newParams.toString()}`
    );
    const data = await response.json();
    const result = await Promise.all(
      data.map(async (item) => await searchGarlandItem(item))
    );
    return result.filter((item) => item);
  };
  const processPackage = async (pkg) => {
    if (!isCafeMakerPackage(pkg)) {
      return pkg.response;
    }
    const json = pkg.json;
    const searchParams = new URL(pkg.url).searchParams;
    const searchString = searchParams.get("string") || "";
    const result = await searchGarland(searchString);
    if (result.length > 0) {
      const resultJson = {
        ...json,
        Pagination: {
          ...json.Pagination,
          Results: result.length,
          ResultsTotal: result.length
        },
        Results: result
      };
      return new Response(JSON.stringify(resultJson));
    }
    return pkg.response;
  };
  injectFetch(processPackage);
  const getIconElement = () => {
    return document.querySelector("img.item-icon");
  };
  const injectItemImage = () => {
    document.addEventListener("DOMContentLoaded", async () => {
      let iconUrl = "";
      let threshold = 100;
      const getIconUrl2 = async () => {
        if (iconUrl) {
          return;
        }
        const id = parseInt(document.location.pathname.split("/").pop() || "0");
        const itemDetail = await getGarlandItem(id);
        iconUrl = `https://www.garlandtools.cn/files/icons/item/${itemDetail.icon}.png`;
      };
      const check = async () => {
        const currentImg = getIconElement();
        if (!currentImg) {
          requestAnimationFrame(check);
          return;
        }
        const url = new URL(currentImg.src);
        if (url.pathname === "/i/universalis/error.png") {
          await getIconUrl2();
          currentImg.src = iconUrl;
          requestAnimationFrame(check);
          return;
        }
        if (currentImg.complete === false) {
          requestAnimationFrame(check);
          return;
        }
        --threshold;
        if (threshold) {
          requestAnimationFrame(check);
          return;
        }
      };
      requestAnimationFrame(check);
    });
  };
  injectItemImage();
})();
