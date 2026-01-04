// ==UserScript==
// @name         Microsoft Bing Rewards每日任务脚本自动执行版
// @version      V3.3.1
// @description  自动完成微软Rewards每日搜索任务,每次运行时获取抖音/微博/哔哩哔哩/百度/头条热门词,避免使用同样的搜索词被封号。
// @note         更新于 2025年12月27日
// @author       grayrat
// @match        https://*.bing.com/*
// @exclude      https://rewards.bing.com/*
// @license      GNU GPLv3
// @icon         https://www.bing.com/favicon.ico
// @run-at       document-end
// @grant        GM_registerMenuCommand
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @namespace    https://greasyfork.org/zh-CN/scripts/560495
// @downloadURL https://update.greasyfork.org/scripts/560498/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/560498/Microsoft%20Bing%20Rewards%E6%AF%8F%E6%97%A5%E4%BB%BB%E5%8A%A1%E8%84%9A%E6%9C%AC%E8%87%AA%E5%8A%A8%E6%89%A7%E8%A1%8C%E7%89%88.meta.js
// ==/UserScript==

const server_url = "http://www.powerscheduler.tech:3000";
// 重复执行的次数
var max_rewards = 30;
// 最小暂停时间
var min_pause_time = 20 * 1000;
// 最大暂停时间
var max_pause_time = 60 * 1000;
// 故梦热门词API接口网站
const Hot_words_apis = "https://api.gmya.net/Api/";
// 网站申请的热门词接口APIKEY
const appkey = "";
// 搜索词
var search_words = [];

//默认搜索词，热门搜索词请求失败时使用
var default_search_words = [
  "盛年不重来，一日难再晨",
  "千里之行，始于足下",
  "少年易学老难成，一寸光阴不可轻",
  "敏而好学，不耻下问",
  "海内存知已，天涯若比邻",
  "三人行，必有我师焉",
  "莫愁前路无知已，天下谁人不识君",
  "人生贵相知，何用金与钱",
  "天生我材必有用",
  "海纳百川有容乃大；壁立千仞无欲则刚",
  "穷则独善其身，达则兼济天下",
  "读书破万卷，下笔如有神",
  "学而不思则罔，思而不学则殆",
  "一年之计在于春，一日之计在于晨",
  "莫等闲，白了少年头，空悲切",
  "少壮不努力，老大徒伤悲",
  "一寸光阴一寸金，寸金难买寸光阴",
  "近朱者赤，近墨者黑",
  "吾生也有涯，而知也无涯",
  "纸上得来终觉浅，绝知此事要躬行",
  "学无止境",
  "己所不欲，勿施于人",
  "天将降大任于斯人也",
  "鞠躬尽瘁，死而后已",
  "书到用时方恨少",
  "天下兴亡，匹夫有责",
  "人无远虑，必有近忧",
  "为中华之崛起而读书",
  "一日无书，百事荒废",
  "岂能尽如人意，但求无愧我心",
  "人生自古谁无死，留取丹心照汗青",
  "吾生也有涯，而知也无涯",
  "生于忧患，死于安乐",
  "言必信，行必果",
  "读书破万卷，下笔如有神",
  "夫君子之行，静以修身，俭以养德",
  "老骥伏枥，志在千里",
  "一日不读书，胸臆无佳想",
  "王侯将相宁有种乎",
  "淡泊以明志。宁静而致远,",
  "卧龙跃马终黄土",
];
//{weibohot}微博热搜榜//{douyinhot}抖音热搜榜/{zhihuhot}知乎热搜榜/{baiduhot}百度热搜榜/{toutiaohot}今日头条热搜榜/
var keywords_sources = ["BaiduHot", "TouTiaoHot", "DouYinHot", "WeiBoHot"];

const today = new Date().toISOString().slice(0, 10);
const todayCnt = GM_getValue(today, 0);

// 将当天的计数器重置
GM_setValue("Cnt", todayCnt);

// 清理过去的计数器
GM_listValues().forEach((key) => {
  console.log(key + ":" + GM_getValue(key));
  if (key != today && key != "Cnt") {
    GM_deleteValue(key);
  }
});

// 进入页面后自动执行搜索
if (todayCnt < max_rewards) {
  fetchHotList()
    .then((names) => {
      search_words = names;
      exec();
    })
    .catch((error) => {
      console.error(error);
    });
}

/**
 * 尝试从多个搜索词来源获取搜索词，如果所有来源都失败，则返回默认搜索词。
 * @returns {Promise<string[]>} 返回搜索到的name属性值列表或默认搜索词列表
 */
async function fetchHotList() {
  for (const source of keywords_sources) {
    let url;
    //根据 appkey 是否为空来决定如何构建 URL地址,如果appkey为空,则直接请求接口地址
    if (appkey) {
      url = Hot_words_apis + source + "?format=json&appkey=" + appkey;
    } else {
      url = Hot_words_apis + source;
    }
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("HTTP error! status: " + response.status);
      }
      console.log(`使用 ${source} 的热门话题`);
      const data = await response.json();
      const names = data.data.map((item) => item.title);
      return names;
    } catch (error) {
      console.error("搜索词来源请求失败:", error);
    }
  }
  console.error("所有搜索词来源请求失败");
  return default_search_words;
}

function exec() {
  ("use strict");

  // 检查计数器的值，若为空则设置为超过最大搜索次数
  if (GM_getValue("Cnt") == null) {
    setCnt(max_rewards + 10);
  }
  // 随机暂停时间
  let randomDelay =
    Math.floor(Math.random() * min_pause_time) +
    (max_pause_time - min_pause_time);

  let currentSearchCount = GM_getValue("Cnt");
  if (currentSearchCount < max_rewards) {
    let tt = document.getElementsByTagName("title")[0];
    tt.innerHTML = `[${currentSearchCount}/${max_rewards}] ${tt.innerHTML}`;
    smoothScrollToBottom();
    setTimeout(() => {
      search();
      setCnt(currentSearchCount + 1);
    }, randomDelay);
  }

  // 执行查询操作
  function search() {
    let nowtxt = search_words[currentSearchCount];
    nowtxt = AutoStrTrans(nowtxt);
    nowtxt = encodeURI(nowtxt);
    let randomString = generateRandomString(4);
    let randomCvid = generateRandomString(32);
    let url = `https://www.bing.com/search?q=${nowtxt}&form=${randomString}&cvid=${randomCvid}`;
    location.href = url;
  }
}

// 注册菜单命令：开始
const menu1 = GM_registerMenuCommand(
  "重跑",
  () => {
    setCnt(0);
    location.href = "https://www.bing.com/?br_msg=Please-Wait";
  },
  "o"
);

// 注册菜单命令：停止
const menu2 = GM_registerMenuCommand(
  "终止",
  () => {
    setCnt(max_rewards + 10);
  },
  "o"
);

function setCnt(cnt) {
  GM_setValue("Cnt", cnt);
  GM_setValue(today, cnt);
  console.log("Cnt: " + GM_getValue("Cnt"));
}

// 自动将字符串中的字符进行替换
function AutoStrTrans(st) {
  let yStr = st; // 原字符串
  let rStr = ""; // 插入的混淆字符，可以自定义自己的混淆字符串
  let zStr = ""; // 结果字符串
  let prePo = 0;
  for (let i = 0; i < yStr.length; ) {
    let step = parseInt(Math.random() * 5) + 1; // 随机生成步长
    if (i > 0) {
      zStr = zStr + yStr.substr(prePo, i - prePo) + rStr; // 将插入字符插入到相应位置
      prePo = i;
    }
    i = i + step;
  }
  if (prePo < yStr.length) {
    zStr = zStr + yStr.substr(prePo, yStr.length - prePo); // 将剩余部分添加到结果字符串中
  }
  return zStr;
}

// 生成指定长度的包含大写字母、小写字母和数字的随机字符串
function generateRandomString(length) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    // 从字符集中随机选择字符，并拼接到结果字符串中
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// 实现平滑滚动到页面底部的函数
function smoothScrollToBottom() {
  document.documentElement.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}
