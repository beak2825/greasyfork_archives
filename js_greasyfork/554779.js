// ==UserScript==
// @name         咱就喵咱就喵
// @namespace    https://bento.me/ranburiedbyacat
// @version      1.0.1
// @description  替换各种词语为咱喵与其他咱喵类似物
// @author       嵐 @ranburiedbyacat
// @license      CC-BY-NC-SA-4.0
// @match        *://*/*
// @exclude      *://greasyfork.org/*
// @compatible   Safari
// @compatible   Firefox
// @compatible   Chrome
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/554779/%E5%92%B1%E5%B0%B1%E5%96%B5%E5%92%B1%E5%B0%B1%E5%96%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/554779/%E5%92%B1%E5%B0%B1%E5%96%B5%E5%92%B1%E5%B0%B1%E5%96%B5.meta.js
// ==/UserScript==

const affectInput = false;

(function () {
  "use strict";

  const selector = [
    "title",
    "h1,h2,h3,h4,h5,h6",
    "p",
    "article",
    "section",
    "blockquote",
    "li",
    "a",
    "CC"
  ].join(",");

  // 是否启用随机口癖
  const enableOrophilia = false;

  // 随机口癖函数：约 66% 概率在“喵”后面追加“です”
  const orophilia = () => {
    if (!enableOrophilia) return "";
    return Math.random() < 0.66 ? "です" : "";
  };

  // 动物列表
  const animals = [

    /**
     * ───────────────────────────────────────────────
     * 哺乳动物
     * ───────────────────────────────────────────────
     */
    //肉食
    "犬","狗","狸","狼","虎","熊","豹","狮","獾","獒","貂","鼬","狸","猞","獴",
    //灵长
    "猩","猴","猿",
    //啮齿
    "鼠","猬","鼹","鼱",
    //偶蹄
    "牛","羊","鹿","马","猪","骆","犀","麋","羚","驼","羯","驴","骡","象","狍",
    //水生
    "鲸","豚","儒艮",
    //杂项
    "貘","兽","蝠","狒","穿山甲",

    /**
     * ───────────────────────────────────────────────
     * 鸟
     * ───────────────────────────────────────────────
     */
    //猛禽
    "鹰","雕","隼","鸢","鸷","鸮","鹞",
    //小型鸣禽
    "雀","燕","鹀","鹎","莺","鹌",
    //鸽类
    "鸽","鸠",
    //长腿涉禽
    "鹤","鹭","鹳","鹈鹕","鹬","鸻",
    //水禽
    "鸭","鹅","雁",
    //其他
    "鸡","鸦","鸵","鸨","鸟",

    /**
     * ───────────────────────────────────────────────
     * 爬行类
     * ───────────────────────────────────────────────
     */
    "龟","鳖","蛇","蚺","鳄","蜥","蜴","蟒",

    /**
     * ───────────────────────────────────────────────
     * 两栖类
     * ───────────────────────────────────────────────
     */
    "蛙","蟾","蜍","蛤","蟆","鲵","螈",

    /**
     * ───────────────────────────────────────────────
     * 鱼类
     * ───────────────────────────────────────────────
     */
    "鱼",

    /**
     * ───────────────────────────────────────────────
     * 昆虫类
     * ───────────────────────────────────────────────
     */
    "蚁","蝶","蛾","蟀","蜂","蜻","蜓","蝉","螳","蝗","螽","蝼","螨","蠼","蠓","蝇","虫","螂",

    /**
     * ───────────────────────────────────────────────
     * 无脊椎类
     * ───────────────────────────────────────────────
     */
    //甲壳类
    "虾","蟹","螯","螺","贝",
    //软体类
    "蚌","牡","蛎",
    //腔肠类
    "水母","珊瑚",
    //节肢类
    "蛛","蝎","蜈蚣",
    //棘皮类
    "海星","海胆","海参",
    //环节类
    "蚯","蛭",
    //其他
    "海葵","螅",

    /**
     * ───────────────────────────────────────────────
     * 神话幻想类
     * ───────────────────────────────────────────────
     */
    "龙","凤","凰","麒","麟","貔","貅","鲲","蛟","鹏","饕","餮"
  ];

  const animalRegex = new RegExp("(" + animals.join("|") + ")(?!.*猫)", "g");

  // =========================
  // 主替换函数
  // =========================
  const replacer = (str) =>
    str
      .replace(/我们(?!.*咱喵)/g, "咱喵和其它猫猫们")
      .replace(/我們(?!.*咱喵)/g, "咱喵和其它貓貓們")
      .replace(/大家(?!.*猫猫)/g, "各位猫猫们")
      .replace(/本人|(?<!自|本)我(?!喵)/g, "咱喵")
      .replace(/你们(?!.*汝等)/g, "汝等")
      .replace(/你們(?!.*汝等)/g, "汝等")
      .replace(/你|您(?!.*汝)/g, "汝")
      .replace(/妈妈|媽媽|母亲|母親/g, "猫")
      .replace(/爸爸|父亲|父親(?!.*猫)/g, "猫")
      .replace(/个人|人类|人民|人口|人们|人性|人群|人种|人/g, "顺÷")
      .replace(/個人|人類|人民|人口|人們|人性|人群|人種|人/g, "順÷")
      .replace(
        /(傻逼|脑瘫|废物|fw|fvv|脑残|弱智|畜生|孝子|xz|卫兵|小丑|资本|水军|海军|陆军|空军|二游|原神|米哈游|腾讯|华为|节奏|做题家|妈逼|妈屄|妈的)/g,
        "杂鱼"
      )
      .replace(
        /(恋爱|溜冰|爆改|白嫖|洗白|抄袭|借鉴|退坑|好似|撸管|自慰|手冲|打胶|0721|抠逼|抠屄|做爱|肏屄|操逼|交配|上厕所|拉尿|排尿|拉屎|尿尿|排泄|拉大便)/g,
        "援交"
      )
      .replace(/鸡巴|鸡鸡|阴茎(?!.*猫)/g, "猫猫尾巴")
      .replace(/雞巴|雞雞|陰莖(?!.*貓)/g, "貓貓尾巴")
      .replace(/龟头(?!.*猫)/g, "猫猫尾巴尖")
      .replace(/龜頭(?!.*貓)/g, "貓貓尾巴尖")
      .replace(/睾丸|蛋蛋|阴囊(?!.*猫)/g, "猫猫球")
      .replace(/睪丸|陰囊(?!.*貓)/g, "貓貓球")
      .replace(animalRegex, "猫") // 使用正则匹配所有动物替换为单字“猫”
      .replace(
        /([也矣兮乎者焉哉]|[啊吗呢吧哇呀哦嘛喔咯呜捏])([，。！？、,.!?\s]|$)/g,
        (_, $1, $2) => `喵${orophilia()}${$2}` // 随机口癖在句尾/语气词后
      )
      .replace(
        /([的了辣])([，。！？、,.!?\s]|$)/g,
        (_, $1, $2) => `${$1}喵${orophilia()}${$2}` // 随机口癖在“的了辣”后
      );

  // =========================
  // 遍历文本节点替换
  // =========================
  function replaceTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;

        if (
          !affectInput &&
          (parent.tagName === "INPUT" ||
            parent.tagName === "TEXTAREA" ||
            parent.isContentEditable)
        )
          return NodeFilter.FILTER_REJECT;

        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);

    for (const node of nodes) {
      if (node.__cat_processed) continue;
      const oldText = node.nodeValue;
      const newText = replacer(oldText);
      if (newText !== oldText) {
        node.nodeValue = newText;
        node.__cat_processed = true;
      }
    }
  }

  // =========================
  // 初始化与 DOM 监听
  // =========================
  function init() {
    replaceTextNodes(document.body);

    const obs = new MutationObserver((muts) => {
      const root = document.body;
      let needReplace = false;
      for (const mut of muts) {
        if (mut.type === "childList" || mut.type === "characterData") {
          needReplace = true;
          break;
        }
      }
      if (needReplace) {
        requestAnimationFrame(() => replaceTextNodes(root));
      }
    });

    obs.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();