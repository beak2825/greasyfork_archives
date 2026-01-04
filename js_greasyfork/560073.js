// ==UserScript==
// @name       .日期金额改色（优化正则实验版）
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  左上角隐藏的日期金额（文章重要的两条主线）改色按钮，点击按钮后页面重加载
// @author       ChenHongJiang
// @match        *://*/*
// @grant        none
// @license      MIT
// @icon        https://pic1.imgdb.cn/item/6946258629a616e5285f3e8c.png
// @require     https://cdn.jsdelivr.net/npm/opencc-js@1.0.5/dist/umd/full.min.js
// @downloadURL https://update.greasyfork.org/scripts/560073/%E6%97%A5%E6%9C%9F%E9%87%91%E9%A2%9D%E6%94%B9%E8%89%B2%EF%BC%88%E4%BC%98%E5%8C%96%E6%AD%A3%E5%88%99%E5%AE%9E%E9%AA%8C%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/560073/%E6%97%A5%E6%9C%9F%E9%87%91%E9%A2%9D%E6%94%B9%E8%89%B2%EF%BC%88%E4%BC%98%E5%8C%96%E6%AD%A3%E5%88%99%E5%AE%9E%E9%AA%8C%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /****************************************
   * 1. 按钮 UI
   ****************************************/

  const btn = document.createElement("div");
  btn.textContent = "";
  btn.style.position = "fixed";
  btn.style.top = "0px";
  btn.style.left = "39px";
  btn.style.zIndex = 99999999;
  btn.style.backgroundColor = "rgba(0,0,0,0)";
  btn.style.color = "white";
  btn.style.border = "none";
  btn.style.borderRadius = "0 0 10px 10px";
  btn.style.cursor = "pointer";
  btn.style.width = "25px";
  btn.style.height = "20px";
  // 定义背景色
  const dateStyle = `#133F2A`;

  // 添加鼠标悬停事件
  btn.addEventListener("mouseenter", () => {
    btn.style.background = dateStyle; // 鼠标悬停时显示黄色
  });

  // 添加鼠标离开事件
  btn.addEventListener("mouseleave", () => {
    btn.style.background = "transparent"; // 鼠标离开时恢复透明背景
  });

  document.body.appendChild(btn);

  /****************************************
   * 2. 点击按钮触发
   ****************************************/
  btn.addEventListener("click", () => {
    localStorage.setItem("highlight_date_flag", "1");
    location.reload();
  });

  /****************************************
   * 3. 执行真正的日期高亮逻辑（只在刷新后）
   ****************************************/
  const shouldRun = localStorage.getItem("highlight_date_flag") === "1";
  if (!shouldRun) return;
  localStorage.removeItem("highlight_date_flag");

  // ⬇️ 以下是你的原始逻辑（保持不动，只封装到函数中）
  window.addEventListener("load", () => {
    runDateHighlight();
    highlightMoney();
  });


  /* 1. 建转换器（只跑一次） */
  const toTrad = OpenCC.Converter({ from: 'cn', to: 'tw' });

  /* ===== 公共片段 ===== */
  const ws = '\\s{0,3}'; // 原 (?: |\\s*)?
  const notEnd = '(?!公里|辆|次|个|台|件|机器人|倍|亿件|人|载|吨|年|家|英里|多|桶|亩|英亩|寸|英寸)';


  /********************************************
   * 日期改色函数
   ********************************************/
  function runDateHighlight() {

    const hanNum = '(?:一|二|三|四|五|六|七|八|九|十)?'+ '(?:一|单|两|二|三|四|两|五|六|七|八|九|十)';
    const liangCi = '(?:亿万|万亿|千亿|百亿|十亿|千万|百万|十万|亿|万|千|百|十|个|\\+)?';

    /* 英文公共 */
    const prepEN =
      '(?:in|to|for|into|of|by|since|at|on|with|from|about|through|over|under|between|among|across|toward|towards|against|beside|before|after|except|including|like|without|year|trends)?';
    const monthEN =
      '(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec|' +
      'January|February|March|April|May|June|July|August|' +
      'September|October|November|December|early)';
    const weekEN =
      '(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun|' +
      'Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)';

    const kg = '(?: |\\s*)?';
    const noNum = '(?!\\d)';

    /* ===== 日期规则 ===== */
    const datePatterns = [

      // 0000.00.00 / 0000/00/00
      noNum + '\\d{4}' + noNum + ws + '(?:-|\\.|/)' + ws +
      noNum + '\\d{2}' + noNum + ws + '(?:-|\\.|/)' + ws +
      noNum + '\\d{2}' + noNum,

      // 0000-00-00
      '\\b\\d{4}' + ws + '-' + ws + '\\d{2}' + ws + '-' + ws + '\\d{2}\\b',

      // 00小时00分00秒
      '(?:截(?:至|止))?\\d+' + ws + '(?:年|小时|时)' + ws +
      '\\d+' + ws + '(?:月|分钟|分)' + ws +
      '\\d+' + ws + '(?:日|秒钟|秒)',

      // 00年00月~00月
      '\\d+' + ws + '年' + ws + '\\d+' + ws +
      '(?:月)?' + ws + '(?:-|~)' + ws + '\\d+月',

      // 0000年00月00日（宽匹配）
      '\\d+' + ws + '(?:年|月)' + ws + '\\d+' + ws + '(?:月|日)',

      // 今年第一季度
      '(?:(?:\\d+)|(?:上个|最新|春节|连续|今|去|前|明|本)|' + hanNum + ')' +
      ws + '(?:年)?(?:的)?(?:整个)?' +
      ws + '第?' + hanNum + '?个?(?:季度|多月|月份)',

      // 00-00
      '\\b' + noNum + '\\d{1,2}' + noNum + ws + '-' + ws +
      noNum + '\\d{1,2}' + ws + '(?=\\s|$)',

      // 截止0000年xx月xx日
      '(?:(?:截(?:至|止))|(?:前|今|明|去|后|同)年)?' + ws +
      '(?:\\d+|' + hanNum + ')' + ws +
      '(?:月份|月)' + ws +
      '(?:\\d+|' + hanNum + ')?' + ws +
      '(?:日|底|号|初|中|末)?',

      // 过去0000年-0000年
      '(?:过去|最近|未来|半年|凌晨|那|这|上|下|第)?(?:的)?' + ws +
      noNum + '(?:\\d{1,4}|' + hanNum + ')' +
      '(?:财年|年)?' +
      '(?:-|~|、|—|to|至|到)' +
      '(?:\\d{1,4}|' + hanNum + ')' + noNum +
      '(?:财年|年|个月|月)?' + notEnd,

      /* ===== 英文日期 ===== */

      prepEN + weekEN + ws + '[A-Za-z]' + ws + '\\d{1,2},' + ws + '\\d{4}(?=\\s|$)',

      prepEN + monthEN + ws + '\\d{1,2},' + ws + '\\d{4}',

      prepEN + monthEN + ws + '\\d{1,2}',

      prepEN + '\\d{1,2}' + ws + monthEN + ws + '\\d{4}',

      prepEN + 'Q\\d+' + ws + '\\d{4}' + noNum,

      prepEN + ws + '\\d{4}(?!.)' + noNum,

      prepEN + 'q' + ws + '\\d+' + ws + prepEN + ws + '\\d{4}' + noNum,

      prepEN + '\\d+' + ws + '\\+?' + ws +
      '(?:days|day|hours|hour|years|year|minutes|minute|min|weeks|week|seconds|second)' +
      '(?:\\s+(?:ago|later))?',

      // 00岁
      '\\d+岁',

      // 指定词
      '(?:一战|二战|创立)(?:同时|期间|中|于)?',

      /* ===== 大一统兜底（必须最后） ===== */
      '(?:过去|最近|未来|半年|凌晨|那|这|上|下|中午|第|到了|到|接下来|前面|后面|进入|数|几)?' +
      '(?:的|每)?' + ws +
      '(?:7(?:x|X|×))?' +
      '(?:\\d{1,4}(?:\\.\\d+)?|' + hanNum + ')' + ws +
      liangCi +
      '(?:周岁|周年|财年|年底|小时|分钟|月份|秒钟|毫秒|微秒|世纪|年代|月|天|周|年|秒|点)' + ws +
      '(?:之前|前|来|内|中期|初期|初|中|末期|末|晚期|多|之后|后|上半叶|下半叶|开始|结束)?' +
      '(?:之内|内)?'
    ];

    /* toTrad() 把繁体版追加到原数组尾部 */
    datePatterns.push(
      ...datePatterns.map(p => toTrad(p))
    );

    const dateFormatRegex = new RegExp(datePatterns.join("|"), "g");

    const style = `
            color: #5bae23 !important;
            text-shadow: none !important;
        `;

    const elements = document.querySelectorAll("*");

    setTimeout(() => {
      elements.forEach(el => {
        const nodes = getTextNodes(el);

        nodes.forEach(node => {
          const text = node.nodeValue;
          const matches = [...text.matchAll(dateFormatRegex)];

          if (!matches.length) return;

          const frag = document.createDocumentFragment();
          let lastIndex = 0;

          for (const m of matches) {
            const start = m.index;
            const end = start + m[0].length;

            // 普通文本
            frag.appendChild(
              document.createTextNode(text.slice(lastIndex, start))
            );

            // 日期 span
            const span = document.createElement('dateChange');
            span.style.cssText = style;
            span.textContent = m[0];
            frag.appendChild(span);

            lastIndex = end;
          }

          // 尾部文本
          frag.appendChild(
            document.createTextNode(text.slice(lastIndex))
          );

          node.parentNode.replaceChild(frag, node);
        });
      });
    }, 0);


    function getTextNodes(node) {
      let out = [];
      if (node.nodeType === Node.TEXT_NODE) return [node];
      for (let c of node.childNodes) {
        // 跳过我们自定义的元素，避免再次遍历里面的文本
        if (c.nodeName === 'DATECHANGE') continue;
        out.push(...getTextNodes(c));
      }
      return out;
    }
  }

  /********************************************
   * 金额改色函数
   ********************************************/
  function highlightMoney() {
    /* ===== 公共片段 ===== */
    const ws = '\\s{0,2}'; // 原 (?:\\s)?
    const notEnd = '(?!公里|辆|次|个|台|件|机器人|倍|亿件|人|载|吨|年|家|英里|多|桶|亩|英亩|寸|英寸)';

    const hanNum =
      '(?:二|三|四|五|六|七|八|九|十|多)?' +
      '(?:一|单|两|二|三|四|两|五|六|七|八|九|十)?';

    const shuLiang_Zh =
      '(?:亿万|万亿|千亿|百亿|十亿|亿|千万|百万|十万|' +
      '块钱|千块|毛钱|分钱|万|千|百|十)(?:多)?';

    const country_Zh =
      '(?:美|港|欧|日|韩|澳大利亚|加拿大|瑞士|新西兰|新加坡|' +
      '瑞典|挪威|墨西哥|南非|俄罗斯|马来西亚|阿联酋|沙特|' +
      '圆|元|币)?';

    const danWei_Zh =
      '(?:块钱|千块|毛钱|分钱|人民币|英镑|法郎|克朗|比索|' +
      '兰特|卢布|林吉特|迪拉姆|里亚尔|USD|圆|金|元|块|币|角)?';

    /* 数字金额（结构化，避免灾难回溯） */
    const numAmount =
      '\\d+(?:\\.\\d+)?' +          // 主金额
      '(?:' + ws + '-' + ws +       // 可选区间
      '\\d+(?:\\.\\d+)?' +
      ')?';

    /* ===== 金额规则 ===== */
    const moneyPatterns = [

      // ￥100.5-200.8 万美元
      '(?:\\$|￥|USD|HK\\$|HK)?' + ws +
      numAmount +
      ws + hanNum +
      ws + shuLiang_Zh +
      ws + country_Zh +
      ws + danWei_Zh +
      notEnd,

      // 数十亿人民币
      '(?:数)' +
      hanNum +
      ws + shuLiang_Zh +
      ws + country_Zh +
      ws + danWei_Zh +
      notEnd,

      // 100.5 Million / Billion / Trillion
      '(?:\\$|￥|USD|HK\\$|HK)?' + ws +
      numAmount +
      ws +
      '(?:Trillion|Billion|Million)',

      // 100.5万
      '\\d+(?:\\.\\d+)?' +
      hanNum +
      ws +
      shuLiang_Zh +
      notEnd,

      // 免费
      '(?:免费)'
    ];

    /* toTrad() 把繁体版追加到原数组尾部 */
    moneyPatterns.push(
      ...moneyPatterns.map(p => toTrad(p))
    );

    const reg = new RegExp(moneyPatterns.join("|"), "gi");
    const style = `color:#F18A00!important;`;

    const elements = document.querySelectorAll("*");

    setTimeout(() => {
      elements.forEach(el => {
        const textNodes = getTextNodes1(el);

        textNodes.forEach(node => {
          const text = node.nodeValue;
          const matches = [...text.matchAll(reg)];

          if (!matches.length) return;

          const frag = document.createDocumentFragment();
          let lastIndex = 0;

          for (const m of matches) {
            const start = m.index;
            const end = start + m[0].length;

            // 前面的普通文本
            frag.appendChild(
              document.createTextNode(text.slice(lastIndex, start))
            );

            // 命中的金额
            const span = document.createElement('moneyChange');
            span.style.cssText = style;
            span.textContent = m[0];
            frag.appendChild(span);

            lastIndex = end;
          }

          // 结尾文本
          frag.appendChild(
            document.createTextNode(text.slice(lastIndex))
          );

          node.parentNode.replaceChild(frag, node);
        });
      });
    }, 0);

    function getTextNodes1(node) {
      let out = [];
      if (node.nodeType === Node.TEXT_NODE) return [node];
      for (let c of node.childNodes)  {
        if (c.nodeName === 'MONEYCHANGE') continue; // ② 跳过已包裹节点
        out.push(...getTextNodes1(c));
      }
      return out;
    }
  }
})();
