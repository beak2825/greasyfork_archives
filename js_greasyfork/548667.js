// ==UserScript==
// @name         xiaoliABC 网课助手｜超星学习通｜智慧树｜🚀自动答题｜💯自动刷课｜▶️一键操作｜🏆超全题库（每日更新、自动收录）｜支持划词搜题
// @namespace    xiaoli
// @version      1.1
// @author       xiaoli
// @description  555555555
// @license      MIT
// @icon         http://pan-yz.chaoxing.com/favicon.ico
// @match        *://*.chaoxing.com/*
// @match        *://*.neauce.com/*
// @match        *://*.zhihuishu.com/*
// @match        *://*.edu.cn/*
// @require      https://lib.baomitu.com/vue/3.4.31/vue.global.prod.js
// @require      https://lib.baomitu.com/vue-demi/0.14.7/index.iife.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://lib.baomitu.com/pinia/2.1.7/pinia.iife.min.js
// @require      https://unpkg.com/dayjs/dayjs.min.js
// @require      https://lib.baomitu.com/dompurify/3.1.6/purify.min.js
// @require      https://unpkg.com/dayjs/plugin/customParseFormat.js
// @require      https://unpkg.com/dayjs/plugin/weekday.js
// @require      https://unpkg.com/dayjs/plugin/localeData.js
// @require      https://unpkg.com/dayjs/plugin/weekOfYear.js
// @require      https://unpkg.com/dayjs/plugin/weekYear.js
// @require      https://unpkg.com/dayjs/plugin/advancedFormat.js
// @require      https://unpkg.com/dayjs/plugin/quarterOfYear.js
// @require      https://lib.baomitu.com/ant-design-vue/4.2.6/antd.min.js
// @require      https://lib.baomitu.com/blueimp-md5/2.19.0/js/md5.min.js
// @require      https://lib.baomitu.com/rxjs/7.8.1/rxjs.umd.min.js
// @require      https://lib.baomitu.com/marked/16.1.1/lib/marked.umd.min.js
// @resource     ttf  https://www.forestpolice.org/ttf/2.0/table.json
// @connect      bytecdntp.com
// @connect      jpush.cn
// @connect      www.e-campus.top
// @connect      gaoxiaobang.com
// @connect      aichathelper.top
// @connect      toyaml.com
// @connect      ahjxjy.cn
// @connect      154.44.26.234
// @connect      aigcfun.com
// @connect      168wangxiao.com
// @connect      shou.org.cn
// @connect      sswpdd.xyz
// @connect      coxpan.com
// @connect      node2.sswpdd.xyz
// @connect      dkjdda.top
// @connect      metost.com
// @connect      unipus.cn
// @connect      chaoxing.com
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-start
// @antifeature  payment  使用第三方题库需付费
// @downloadURL https://update.greasyfork.org/scripts/548667/xiaoliABC%20%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%EF%BD%9C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%E6%99%BA%E6%85%A7%E6%A0%91%EF%BD%9C%F0%9F%9A%80%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%F0%9F%92%AF%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BD%9C%E2%96%B6%EF%B8%8F%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%EF%BD%9C%F0%9F%8F%86%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BC%88%E6%AF%8F%E6%97%A5%E6%9B%B4%E6%96%B0%E3%80%81%E8%87%AA%E5%8A%A8%E6%94%B6%E5%BD%95%EF%BC%89%EF%BD%9C%E6%94%AF%E6%8C%81%E5%88%92%E8%AF%8D%E6%90%9C%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/548667/xiaoliABC%20%E7%BD%91%E8%AF%BE%E5%8A%A9%E6%89%8B%EF%BD%9C%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9A%EF%BD%9C%E6%99%BA%E6%85%A7%E6%A0%91%EF%BD%9C%F0%9F%9A%80%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98%EF%BD%9C%F0%9F%92%AF%E8%87%AA%E5%8A%A8%E5%88%B7%E8%AF%BE%EF%BD%9C%E2%96%B6%EF%B8%8F%E4%B8%80%E9%94%AE%E6%93%8D%E4%BD%9C%EF%BD%9C%F0%9F%8F%86%E8%B6%85%E5%85%A8%E9%A2%98%E5%BA%93%EF%BC%88%E6%AF%8F%E6%97%A5%E6%9B%B4%E6%96%B0%E3%80%81%E8%87%AA%E5%8A%A8%E6%94%B6%E5%BD%95%EF%BC%89%EF%BD%9C%E6%94%AF%E6%8C%81%E5%88%92%E8%AF%8D%E6%90%9C%E9%A2%98.meta.js
// ==/UserScript==

(e=>{if(typeof GM_addStyle=="function"){GM_addStyle(e);return}const o=document.createElement("style");o.textContent=e,document.head.append(o)})(' .no-select{-webkit-user-select:none!important;-moz-user-select:none!important;-ms-user-select:none!important;user-select:none!important}input{outline:none;border:none}div{box-sizing:border-box}.log-wrap{font:14px Menlo,Monaco,Consolas,Courier New,monospace}.log-wrap .console{height:300px;overflow-y:scroll;scroll-behavior:smooth;background-color:#292929;padding:12px 6px;color:#ececec;font-size:12px}.log-wrap .console div{padding:3px 0}.log-wrap .console div span{margin:0 2px}.log-wrap .console div span .module{background-color:#ececec;color:#292929}.log-wrap .console .log{background-color:#9e9e9ec4}.log-wrap .console .warning{background-color:#ffc107db}.home-wrap[data-v-f39340c3]{font:14px Menlo,Monaco,Consolas,Courier New,monospace}.home-wrap a[data-v-f39340c3]{color:red}.home-wrap ul[data-v-f39340c3],.home-wrap ol[data-v-f39340c3]{padding-inline-start:20px}.home-wrap ol li[data-v-f39340c3]{line-height:26px;list-style-type:decimal;list-style-position:inside}.home-wrap .tips ul li span[data-v-f39340c3]{color:red}.answer-wrap .search-info{-webkit-user-select:none!important;user-select:none!important;box-sizing:border-box;display:flex;align-items:center;justify-content:center;width:25px;height:25px;border-radius:3px;border:1px solid #b6b6b6;margin-right:5px;font-weight:500}.answer-wrap .search-info.default{box-shadow:none}.answer-wrap .search-info.searching{box-shadow:0 0 2px 1px #63b4ffcc}.answer-wrap .search-info.success{color:#fff;border:0;background-color:#09b4ffcc;box-shadow:0 0 2px 1px #63b4ffcc}.answer-wrap .search-info.ai-success{color:#fff;border:0;background-color:#21d181cc;box-shadow:0 0 2px 1px #21d181cc}.answer-wrap .search-info.warning{color:#ff4d4f;border:0;box-shadow:0 0 3px 1px #e44b17cc}.answer-wrap .answer-tips{font-size:13px;color:gray}.answer-wrap .answer-tips span{margin-right:5px}.answer-wrap .answer-tips .box-tips{display:flex;align-items:center}.answer-wrap .answer-tips .box-tips div{margin:0 5px 0 0!important}.answer-wrap .answer-tips .box-tips span{margin-right:10px}.answer-wrap .answer-list{flex-wrap:wrap;color:#636363;display:flex}.answer-wrap .answer-list .search-info{cursor:pointer!important}.answer-wrap .answer-list div{margin:0 10px 10px 0!important;cursor:pointer!important}.answer-wrap .answer-detail{position:relative;max-height:200px;overflow-y:scroll;scroll-behavior:smooth}.answer-wrap .answer-detail .answer-item{margin-bottom:10px}.answer-wrap .answer-detail .answer-content{margin-top:5px;padding:10px;border-radius:5px;background-color:#f4f4f4;font-weight:600}.answer-wrap .answer-detail .answer-content .module{padding:2px;border-radius:5px;color:gray;border:1px solid #dcdcdc}.ant-tooltip,.ant-select-dropdown{z-index:99999!important}.config-wrap{min-width:470px;max-width:500px;color:#636363}.config-wrap .buy-btn{background-color:#1677ff;padding:5px 7px;border-radius:5px;height:24px;color:#fff;cursor:pointer}.config-wrap .buy-btn a{color:#fff}.config-wrap .config{margin-bottom:5px;display:flex;justify-content:space-between;align-items:center}.config-wrap .config .config-name{display:flex;align-items:center;width:160px}.config-wrap .config .config-input{text-align:right;flex:1}.ant-message{z-index:999999!important}.online-search-wrap{color:#636363}.online-search-wrap .config{padding:10px 10px 5px;display:flex}.online-search-wrap .config .config-name{width:160px}.online-search-wrap .config .config-input{display:flex;justify-content:right;flex:1}.online-search-wrap .searth-input-wrap{padding:10px 10px 5px;display:flex}.online-search-wrap .searth-input-wrap .title{padding-top:5px}.online-search-wrap .searth-input-wrap .searth-input{margin-left:20px;flex:1}.online-search-wrap .search-btn{padding-right:10px;display:flex;justify-content:right}.online-search-wrap .result-list{margin-top:10px;max-height:300px;overflow:auto}.online-search-wrap .result-list .result-item{margin-bottom:10px}.online-search-wrap .result-list .result-item em{font-weight:600;color:red}.online-search-wrap .result-list .result-answer{margin-top:5px;padding:10px;border-radius:5px;background-color:#f4f4f4;font-weight:600}div{margin:0}.ai-wrapper{width:500px}.ai-message-role-avatar{margin:0}.ai-message-content{margin:0;padding:5px;border-radius:10px;background-color:#0000000d;font-size:14px;-webkit-user-select:text;user-select:text;word-break:break-word;border:1px solid #dedede;position:relative;transition:all .3s ease}.ai-message-content pre{white-space:pre-wrap;background-color:#1a1b25;color:#fff;padding:10px;border-radius:5px}.ai-message-container{display:flex;flex-direction:column;align-items:flex-start}.ai-message-container.user-message{align-items:flex-end}.ai-message-list{height:500px;overflow-y:auto;display:flex;flex-direction:column;gap:10px}.ai-message-item{width:100%}.user-avatar{display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:11px;border:1px solid #dedede;background-color:#e7f8ff;box-shadow:0 2px 4px #0000000d;margin-bottom:5px}.ai-input-wrapper{padding:10px 5px;margin-top:10px;border-radius:10px;border:1px solid #dedede;display:flex;align-items:center;justify-content:center}.ai-input-wrapper textarea{flex:1;height:50px;border:none;margin-right:10px}.send-message-btn{display:flex;align-items:center;justify-content:center;height:40px;border-radius:10px;border:1px solid #dedede;padding:0 10px;background-color:#1677ff;color:#fff;cursor:pointer!important;gap:5px}.loading-container{display:flex;align-items:center;justify-content:center;gap:5px}.tab-content{min-width:470px;max-width:500px}.ant-tabs-nav-operations{display:none!important}.ant-tabs-nav-list{margin:0!important}.box-content{min-width:300px;width:fit-content}.separator{display:flex;align-items:center;text-align:center;padding:4px 0 8px}.separator:after,.separator:before{content:"";flex:1;border-bottom:1px solid #63636346}.tips{padding:0 8px;background:#0099ff0e;border-left:4px solid #0099ff65;width:-webkit-fill-available;margin:0 8px;line-height:26px;letter-spacing:1px}.main-wrap{position:fixed;top:0;z-index:99999!important;user-select:none;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none}.message-container{margin-bottom:4px;position:absolute;bottom:100%;left:50%;width:100%;transform:translate(-50%);min-width:300px}.main-box{padding:5px 10px;font:14px Menlo,Monaco,Consolas,Courier New,monospace;color:#636363;background-color:#fff;box-shadow:0 0 24px -12px #3f3f3f;border-radius:8px;letter-spacing:.5px}.main-box.mini{width:120px}.main-box .box-header{display:flex;justify-content:space-between;align-items:center;height:30px;cursor:move}.main-box .box-header div{margin:0}.main-box .box-header .script-info{-webkit-user-select:none!important;user-select:none!important}.main-box .box-content{display:block}.main-box .box-content.mini{display:none} ');

(function (vue, Antd, pinia, rxjs, md5) {
  'use strict';

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var _a;
  function bound01(n, max) {
    if (isOnePointZero(n)) {
      n = "100%";
    }
    var isPercent = isPercentage(n);
    n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));
    if (isPercent) {
      n = parseInt(String(n * max), 10) / 100;
    }
    if (Math.abs(n - max) < 1e-6) {
      return 1;
    }
    if (max === 360) {
      n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
    } else {
      n = n % max / parseFloat(String(max));
    }
    return n;
  }
  function isOnePointZero(n) {
    return typeof n === "string" && n.indexOf(".") !== -1 && parseFloat(n) === 1;
  }
  function isPercentage(n) {
    return typeof n === "string" && n.indexOf("%") !== -1;
  }
  function boundAlpha(a) {
    a = parseFloat(a);
    if (isNaN(a) || a < 0 || a > 1) {
      a = 1;
    }
    return a;
  }
  function convertToPercentage(n) {
    if (n <= 1) {
      return "".concat(Number(n) * 100, "%");
    }
    return n;
  }
  function pad2(c) {
    return c.length === 1 ? "0" + c : String(c);
  }
  function rgbToRgb(r, g, b2) {
    return {
      r: bound01(r, 255) * 255,
      g: bound01(g, 255) * 255,
      b: bound01(b2, 255) * 255
    };
  }
  function hue2rgb(p, q2, t) {
    if (t < 0) {
      t += 1;
    }
    if (t > 1) {
      t -= 1;
    }
    if (t < 1 / 6) {
      return p + (q2 - p) * (6 * t);
    }
    if (t < 1 / 2) {
      return q2;
    }
    if (t < 2 / 3) {
      return p + (q2 - p) * (2 / 3 - t) * 6;
    }
    return p;
  }
  function hslToRgb(h2, s, l3) {
    var r;
    var g;
    var b2;
    h2 = bound01(h2, 360);
    s = bound01(s, 100);
    l3 = bound01(l3, 100);
    if (s === 0) {
      g = l3;
      b2 = l3;
      r = l3;
    } else {
      var q2 = l3 < 0.5 ? l3 * (1 + s) : l3 + s - l3 * s;
      var p = 2 * l3 - q2;
      r = hue2rgb(p, q2, h2 + 1 / 3);
      g = hue2rgb(p, q2, h2);
      b2 = hue2rgb(p, q2, h2 - 1 / 3);
    }
    return { r: r * 255, g: g * 255, b: b2 * 255 };
  }
  function rgbToHsv(r, g, b2) {
    r = bound01(r, 255);
    g = bound01(g, 255);
    b2 = bound01(b2, 255);
    var max = Math.max(r, g, b2);
    var min = Math.min(r, g, b2);
    var h2 = 0;
    var v2 = max;
    var d2 = max - min;
    var s = max === 0 ? 0 : d2 / max;
    if (max === min) {
      h2 = 0;
    } else {
      switch (max) {
        case r:
          h2 = (g - b2) / d2 + (g < b2 ? 6 : 0);
          break;
        case g:
          h2 = (b2 - r) / d2 + 2;
          break;
        case b2:
          h2 = (r - g) / d2 + 4;
          break;
      }
      h2 /= 6;
    }
    return { h: h2, s, v: v2 };
  }
  function hsvToRgb(h2, s, v2) {
    h2 = bound01(h2, 360) * 6;
    s = bound01(s, 100);
    v2 = bound01(v2, 100);
    var i = Math.floor(h2);
    var f = h2 - i;
    var p = v2 * (1 - s);
    var q2 = v2 * (1 - f * s);
    var t = v2 * (1 - (1 - f) * s);
    var mod = i % 6;
    var r = [v2, q2, p, p, t, v2][mod];
    var g = [t, v2, v2, q2, p, p][mod];
    var b2 = [p, p, t, v2, v2, q2][mod];
    return { r: r * 255, g: g * 255, b: b2 * 255 };
  }
  function rgbToHex(r, g, b2, allow3Char) {
    var hex = [
      pad2(Math.round(r).toString(16)),
      pad2(Math.round(g).toString(16)),
      pad2(Math.round(b2).toString(16))
    ];
    return hex.join("");
  }
  function convertHexToDecimal(h2) {
    return parseIntFromHex(h2) / 255;
  }
  function parseIntFromHex(val) {
    return parseInt(val, 16);
  }
  var names = {
    aliceblue: "#f0f8ff",
    antiquewhite: "#faebd7",
    aqua: "#00ffff",
    aquamarine: "#7fffd4",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    bisque: "#ffe4c4",
    black: "#000000",
    blanchedalmond: "#ffebcd",
    blue: "#0000ff",
    blueviolet: "#8a2be2",
    brown: "#a52a2a",
    burlywood: "#deb887",
    cadetblue: "#5f9ea0",
    chartreuse: "#7fff00",
    chocolate: "#d2691e",
    coral: "#ff7f50",
    cornflowerblue: "#6495ed",
    cornsilk: "#fff8dc",
    crimson: "#dc143c",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgoldenrod: "#b8860b",
    darkgray: "#a9a9a9",
    darkgreen: "#006400",
    darkgrey: "#a9a9a9",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkseagreen: "#8fbc8f",
    darkslateblue: "#483d8b",
    darkslategray: "#2f4f4f",
    darkslategrey: "#2f4f4f",
    darkturquoise: "#00ced1",
    darkviolet: "#9400d3",
    deeppink: "#ff1493",
    deepskyblue: "#00bfff",
    dimgray: "#696969",
    dimgrey: "#696969",
    dodgerblue: "#1e90ff",
    firebrick: "#b22222",
    floralwhite: "#fffaf0",
    forestgreen: "#228b22",
    fuchsia: "#ff00ff",
    gainsboro: "#dcdcdc",
    ghostwhite: "#f8f8ff",
    goldenrod: "#daa520",
    gold: "#ffd700",
    gray: "#808080",
    green: "#008000",
    greenyellow: "#adff2f",
    grey: "#808080",
    honeydew: "#f0fff0",
    hotpink: "#ff69b4",
    indianred: "#cd5c5c",
    indigo: "#4b0082",
    ivory: "#fffff0",
    khaki: "#f0e68c",
    lavenderblush: "#fff0f5",
    lavender: "#e6e6fa",
    lawngreen: "#7cfc00",
    lemonchiffon: "#fffacd",
    lightblue: "#add8e6",
    lightcoral: "#f08080",
    lightcyan: "#e0ffff",
    lightgoldenrodyellow: "#fafad2",
    lightgray: "#d3d3d3",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightsalmon: "#ffa07a",
    lightseagreen: "#20b2aa",
    lightskyblue: "#87cefa",
    lightslategray: "#778899",
    lightslategrey: "#778899",
    lightsteelblue: "#b0c4de",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    limegreen: "#32cd32",
    linen: "#faf0e6",
    magenta: "#ff00ff",
    maroon: "#800000",
    mediumaquamarine: "#66cdaa",
    mediumblue: "#0000cd",
    mediumorchid: "#ba55d3",
    mediumpurple: "#9370db",
    mediumseagreen: "#3cb371",
    mediumslateblue: "#7b68ee",
    mediumspringgreen: "#00fa9a",
    mediumturquoise: "#48d1cc",
    mediumvioletred: "#c71585",
    midnightblue: "#191970",
    mintcream: "#f5fffa",
    mistyrose: "#ffe4e1",
    moccasin: "#ffe4b5",
    navajowhite: "#ffdead",
    navy: "#000080",
    oldlace: "#fdf5e6",
    olive: "#808000",
    olivedrab: "#6b8e23",
    orange: "#ffa500",
    orangered: "#ff4500",
    orchid: "#da70d6",
    palegoldenrod: "#eee8aa",
    palegreen: "#98fb98",
    paleturquoise: "#afeeee",
    palevioletred: "#db7093",
    papayawhip: "#ffefd5",
    peachpuff: "#ffdab9",
    peru: "#cd853f",
    pink: "#ffc0cb",
    plum: "#dda0dd",
    powderblue: "#b0e0e6",
    purple: "#800080",
    rebeccapurple: "#663399",
    red: "#ff0000",
    rosybrown: "#bc8f8f",
    royalblue: "#4169e1",
    saddlebrown: "#8b4513",
    salmon: "#fa8072",
    sandybrown: "#f4a460",
    seagreen: "#2e8b57",
    seashell: "#fff5ee",
    sienna: "#a0522d",
    silver: "#c0c0c0",
    skyblue: "#87ceeb",
    slateblue: "#6a5acd",
    slategray: "#708090",
    slategrey: "#708090",
    snow: "#fffafa",
    springgreen: "#00ff7f",
    steelblue: "#4682b4",
    tan: "#d2b48c",
    teal: "#008080",
    thistle: "#d8bfd8",
    tomato: "#ff6347",
    turquoise: "#40e0d0",
    violet: "#ee82ee",
    wheat: "#f5deb3",
    white: "#ffffff",
    whitesmoke: "#f5f5f5",
    yellow: "#ffff00",
    yellowgreen: "#9acd32"
  };
  function inputToRGB(color) {
    var rgb = { r: 0, g: 0, b: 0 };
    var a = 1;
    var s = null;
    var v2 = null;
    var l3 = null;
    var ok = false;
    var format = false;
    if (typeof color === "string") {
      color = stringInputToObject(color);
    }
    if (typeof color === "object") {
      if (isValidCSSUnit(color.r) && isValidCSSUnit(color.g) && isValidCSSUnit(color.b)) {
        rgb = rgbToRgb(color.r, color.g, color.b);
        ok = true;
        format = String(color.r).substr(-1) === "%" ? "prgb" : "rgb";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.v)) {
        s = convertToPercentage(color.s);
        v2 = convertToPercentage(color.v);
        rgb = hsvToRgb(color.h, s, v2);
        ok = true;
        format = "hsv";
      } else if (isValidCSSUnit(color.h) && isValidCSSUnit(color.s) && isValidCSSUnit(color.l)) {
        s = convertToPercentage(color.s);
        l3 = convertToPercentage(color.l);
        rgb = hslToRgb(color.h, s, l3);
        ok = true;
        format = "hsl";
      }
      if (Object.prototype.hasOwnProperty.call(color, "a")) {
        a = color.a;
      }
    }
    a = boundAlpha(a);
    return {
      ok,
      format: color.format || format,
      r: Math.min(255, Math.max(rgb.r, 0)),
      g: Math.min(255, Math.max(rgb.g, 0)),
      b: Math.min(255, Math.max(rgb.b, 0)),
      a
    };
  }
  var CSS_INTEGER = "[-\\+]?\\d+%?";
  var CSS_NUMBER = "[-\\+]?\\d*\\.\\d+%?";
  var CSS_UNIT = "(?:".concat(CSS_NUMBER, ")|(?:").concat(CSS_INTEGER, ")");
  var PERMISSIVE_MATCH3 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var PERMISSIVE_MATCH4 = "[\\s|\\(]+(".concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")[,|\\s]+(").concat(CSS_UNIT, ")\\s*\\)?");
  var matchers = {
    CSS_UNIT: new RegExp(CSS_UNIT),
    rgb: new RegExp("rgb" + PERMISSIVE_MATCH3),
    rgba: new RegExp("rgba" + PERMISSIVE_MATCH4),
    hsl: new RegExp("hsl" + PERMISSIVE_MATCH3),
    hsla: new RegExp("hsla" + PERMISSIVE_MATCH4),
    hsv: new RegExp("hsv" + PERMISSIVE_MATCH3),
    hsva: new RegExp("hsva" + PERMISSIVE_MATCH4),
    hex3: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex6: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
    hex4: /^#?([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
    hex8: /^#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/
  };
  function stringInputToObject(color) {
    color = color.trim().toLowerCase();
    if (color.length === 0) {
      return false;
    }
    var named = false;
    if (names[color]) {
      color = names[color];
      named = true;
    } else if (color === "transparent") {
      return { r: 0, g: 0, b: 0, a: 0, format: "name" };
    }
    var match = matchers.rgb.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3] };
    }
    match = matchers.rgba.exec(color);
    if (match) {
      return { r: match[1], g: match[2], b: match[3], a: match[4] };
    }
    match = matchers.hsl.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3] };
    }
    match = matchers.hsla.exec(color);
    if (match) {
      return { h: match[1], s: match[2], l: match[3], a: match[4] };
    }
    match = matchers.hsv.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3] };
    }
    match = matchers.hsva.exec(color);
    if (match) {
      return { h: match[1], s: match[2], v: match[3], a: match[4] };
    }
    match = matchers.hex8.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        a: convertHexToDecimal(match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex6.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1]),
        g: parseIntFromHex(match[2]),
        b: parseIntFromHex(match[3]),
        format: named ? "name" : "hex"
      };
    }
    match = matchers.hex4.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        a: convertHexToDecimal(match[4] + match[4]),
        format: named ? "name" : "hex8"
      };
    }
    match = matchers.hex3.exec(color);
    if (match) {
      return {
        r: parseIntFromHex(match[1] + match[1]),
        g: parseIntFromHex(match[2] + match[2]),
        b: parseIntFromHex(match[3] + match[3]),
        format: named ? "name" : "hex"
      };
    }
    return false;
  }
  function isValidCSSUnit(color) {
    return Boolean(matchers.CSS_UNIT.exec(String(color)));
  }
  var hueStep = 2;
  var saturationStep = 0.16;
  var saturationStep2 = 0.05;
  var brightnessStep1 = 0.05;
  var brightnessStep2 = 0.15;
  var lightColorCount = 5;
  var darkColorCount = 4;
  var darkColorMap = [{
    index: 7,
    opacity: 0.15
  }, {
    index: 6,
    opacity: 0.25
  }, {
    index: 5,
    opacity: 0.3
  }, {
    index: 5,
    opacity: 0.45
  }, {
    index: 5,
    opacity: 0.65
  }, {
    index: 5,
    opacity: 0.85
  }, {
    index: 4,
    opacity: 0.9
  }, {
    index: 3,
    opacity: 0.95
  }, {
    index: 2,
    opacity: 0.97
  }, {
    index: 1,
    opacity: 0.98
  }];
  function toHsv(_ref) {
    var r = _ref.r, g = _ref.g, b2 = _ref.b;
    var hsv = rgbToHsv(r, g, b2);
    return {
      h: hsv.h * 360,
      s: hsv.s,
      v: hsv.v
    };
  }
  function toHex(_ref2) {
    var r = _ref2.r, g = _ref2.g, b2 = _ref2.b;
    return "#".concat(rgbToHex(r, g, b2));
  }
  function mix(rgb1, rgb2, amount) {
    var p = amount / 100;
    var rgb = {
      r: (rgb2.r - rgb1.r) * p + rgb1.r,
      g: (rgb2.g - rgb1.g) * p + rgb1.g,
      b: (rgb2.b - rgb1.b) * p + rgb1.b
    };
    return rgb;
  }
  function getHue(hsv, i, light) {
    var hue;
    if (Math.round(hsv.h) >= 60 && Math.round(hsv.h) <= 240) {
      hue = light ? Math.round(hsv.h) - hueStep * i : Math.round(hsv.h) + hueStep * i;
    } else {
      hue = light ? Math.round(hsv.h) + hueStep * i : Math.round(hsv.h) - hueStep * i;
    }
    if (hue < 0) {
      hue += 360;
    } else if (hue >= 360) {
      hue -= 360;
    }
    return hue;
  }
  function getSaturation(hsv, i, light) {
    if (hsv.h === 0 && hsv.s === 0) {
      return hsv.s;
    }
    var saturation;
    if (light) {
      saturation = hsv.s - saturationStep * i;
    } else if (i === darkColorCount) {
      saturation = hsv.s + saturationStep;
    } else {
      saturation = hsv.s + saturationStep2 * i;
    }
    if (saturation > 1) {
      saturation = 1;
    }
    if (light && i === lightColorCount && saturation > 0.1) {
      saturation = 0.1;
    }
    if (saturation < 0.06) {
      saturation = 0.06;
    }
    return Number(saturation.toFixed(2));
  }
  function getValue(hsv, i, light) {
    var value;
    if (light) {
      value = hsv.v + brightnessStep1 * i;
    } else {
      value = hsv.v - brightnessStep2 * i;
    }
    if (value > 1) {
      value = 1;
    }
    return Number(value.toFixed(2));
  }
  function generate$1(color) {
    var opts = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var patterns = [];
    var pColor = inputToRGB(color);
    for (var i = lightColorCount; i > 0; i -= 1) {
      var hsv = toHsv(pColor);
      var colorString = toHex(inputToRGB({
        h: getHue(hsv, i, true),
        s: getSaturation(hsv, i, true),
        v: getValue(hsv, i, true)
      }));
      patterns.push(colorString);
    }
    patterns.push(toHex(pColor));
    for (var _i = 1; _i <= darkColorCount; _i += 1) {
      var _hsv = toHsv(pColor);
      var _colorString = toHex(inputToRGB({
        h: getHue(_hsv, _i),
        s: getSaturation(_hsv, _i),
        v: getValue(_hsv, _i)
      }));
      patterns.push(_colorString);
    }
    if (opts.theme === "dark") {
      return darkColorMap.map(function(_ref3) {
        var index = _ref3.index, opacity = _ref3.opacity;
        var darkColorString = toHex(mix(inputToRGB(opts.backgroundColor || "#141414"), inputToRGB(patterns[index]), opacity * 100));
        return darkColorString;
      });
    }
    return patterns;
  }
  var presetPrimaryColors = {
    red: "#F5222D",
    volcano: "#FA541C",
    orange: "#FA8C16",
    gold: "#FAAD14",
    yellow: "#FADB14",
    lime: "#A0D911",
    green: "#52C41A",
    cyan: "#13C2C2",
    blue: "#1890FF",
    geekblue: "#2F54EB",
    purple: "#722ED1",
    magenta: "#EB2F96",
    grey: "#666666"
  };
  var presetPalettes = {};
  var presetDarkPalettes = {};
  Object.keys(presetPrimaryColors).forEach(function(key) {
    presetPalettes[key] = generate$1(presetPrimaryColors[key]);
    presetPalettes[key].primary = presetPalettes[key][5];
    presetDarkPalettes[key] = generate$1(presetPrimaryColors[key], {
      theme: "dark",
      backgroundColor: "#141414"
    });
    presetDarkPalettes[key].primary = presetDarkPalettes[key][5];
  });
  var blue = presetPalettes.blue;
  var contextKey = Symbol("iconContext");
  var useInjectIconContext = function useInjectIconContext2() {
    return vue.inject(contextKey, {
      prefixCls: vue.ref("anticon"),
      rootClassName: vue.ref(""),
      csp: vue.ref()
    });
  };
  function canUseDom() {
    return !!(typeof window !== "undefined" && window.document && window.document.createElement);
  }
  function contains(root, n) {
    if (!root) {
      return false;
    }
    if (root.contains) {
      return root.contains(n);
    }
    return false;
  }
  var APPEND_ORDER = "data-vc-order";
  var MARK_KEY = "vc-icon-key";
  var containerCache = /* @__PURE__ */ new Map();
  function getMark() {
    var _ref = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, mark = _ref.mark;
    if (mark) {
      return mark.startsWith("data-") ? mark : "data-".concat(mark);
    }
    return MARK_KEY;
  }
  function getContainer(option) {
    if (option.attachTo) {
      return option.attachTo;
    }
    var head = document.querySelector("head");
    return head || document.body;
  }
  function getOrder(prepend) {
    if (prepend === "queue") {
      return "prependQueue";
    }
    return prepend ? "prepend" : "append";
  }
  function findStyles(container) {
    return Array.from((containerCache.get(container) || container).children).filter(function(node) {
      return node.tagName === "STYLE";
    });
  }
  function injectCSS(css) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (!canUseDom()) {
      return null;
    }
    var csp = option.csp, prepend = option.prepend;
    var styleNode = document.createElement("style");
    styleNode.setAttribute(APPEND_ORDER, getOrder(prepend));
    if (csp && csp.nonce) {
      styleNode.nonce = csp.nonce;
    }
    styleNode.innerHTML = css;
    var container = getContainer(option);
    var firstChild = container.firstChild;
    if (prepend) {
      if (prepend === "queue") {
        var existStyle = findStyles(container).filter(function(node) {
          return ["prepend", "prependQueue"].includes(node.getAttribute(APPEND_ORDER));
        });
        if (existStyle.length) {
          container.insertBefore(styleNode, existStyle[existStyle.length - 1].nextSibling);
          return styleNode;
        }
      }
      container.insertBefore(styleNode, firstChild);
    } else {
      container.appendChild(styleNode);
    }
    return styleNode;
  }
  function findExistNode(key) {
    var option = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    var container = getContainer(option);
    return findStyles(container).find(function(node) {
      return node.getAttribute(getMark(option)) === key;
    });
  }
  function syncRealContainer(container, option) {
    var cachedRealContainer = containerCache.get(container);
    if (!cachedRealContainer || !contains(document, cachedRealContainer)) {
      var placeholderStyle = injectCSS("", option);
      var parentNode = placeholderStyle.parentNode;
      containerCache.set(container, parentNode);
      container.removeChild(placeholderStyle);
    }
  }
  function updateCSS(css, key) {
    var option = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
    var container = getContainer(option);
    syncRealContainer(container, option);
    var existNode = findExistNode(key, option);
    if (existNode) {
      if (option.csp && option.csp.nonce && existNode.nonce !== option.csp.nonce) {
        existNode.nonce = option.csp.nonce;
      }
      if (existNode.innerHTML !== css) {
        existNode.innerHTML = css;
      }
      return existNode;
    }
    var newNode = injectCSS(css, option);
    newNode.setAttribute(getMark(option), key);
    return newNode;
  }
  function _objectSpread$8(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$8(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$8(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function warning(valid, message2) {
  }
  function isIconDefinition(target) {
    return typeof target === "object" && typeof target.name === "string" && typeof target.theme === "string" && (typeof target.icon === "object" || typeof target.icon === "function");
  }
  function generate(node, key, rootProps) {
    if (!rootProps) {
      return vue.h(node.tag, _objectSpread$8({
        key
      }, node.attrs), (node.children || []).map(function(child, index) {
        return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
      }));
    }
    return vue.h(node.tag, _objectSpread$8({
      key
    }, rootProps, node.attrs), (node.children || []).map(function(child, index) {
      return generate(child, "".concat(key, "-").concat(node.tag, "-").concat(index));
    }));
  }
  function getSecondaryColor(primaryColor) {
    return generate$1(primaryColor)[0];
  }
  function normalizeTwoToneColors(twoToneColor) {
    if (!twoToneColor) {
      return [];
    }
    return Array.isArray(twoToneColor) ? twoToneColor : [twoToneColor];
  }
  var iconStyles = "\n.anticon {\n  display: inline-block;\n  color: inherit;\n  font-style: normal;\n  line-height: 0;\n  text-align: center;\n  text-transform: none;\n  vertical-align: -0.125em;\n  text-rendering: optimizeLegibility;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n\n.anticon > * {\n  line-height: 1;\n}\n\n.anticon svg {\n  display: inline-block;\n}\n\n.anticon::before {\n  display: none;\n}\n\n.anticon .anticon-icon {\n  display: block;\n}\n\n.anticon[tabindex] {\n  cursor: pointer;\n}\n\n.anticon-spin::before,\n.anticon-spin {\n  display: inline-block;\n  -webkit-animation: loadingCircle 1s infinite linear;\n  animation: loadingCircle 1s infinite linear;\n}\n\n@-webkit-keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n\n@keyframes loadingCircle {\n  100% {\n    -webkit-transform: rotate(360deg);\n    transform: rotate(360deg);\n  }\n}\n";
  function getRoot(ele) {
    return ele && ele.getRootNode && ele.getRootNode();
  }
  function inShadow(ele) {
    if (!canUseDom()) {
      return false;
    }
    return getRoot(ele) instanceof ShadowRoot;
  }
  function getShadowRoot(ele) {
    return inShadow(ele) ? getRoot(ele) : null;
  }
  var useInsertStyles = function useInsertStyles2() {
    var _useInjectIconContext = useInjectIconContext(), prefixCls = _useInjectIconContext.prefixCls, csp = _useInjectIconContext.csp;
    var instance = vue.getCurrentInstance();
    var mergedStyleStr = iconStyles;
    if (prefixCls) {
      mergedStyleStr = mergedStyleStr.replace(/anticon/g, prefixCls.value);
    }
    vue.nextTick(function() {
      if (!canUseDom()) {
        return;
      }
      var ele = instance.vnode.el;
      var shadowRoot = getShadowRoot(ele);
      updateCSS(mergedStyleStr, "@ant-design-vue-icons", {
        prepend: true,
        csp: csp.value,
        attachTo: shadowRoot
      });
    });
  };
  var _excluded$1 = ["icon", "primaryColor", "secondaryColor"];
  function _objectWithoutProperties$1(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose$1(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose$1(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  function _objectSpread$7(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$7(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$7(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var twoToneColorPalette = vue.reactive({
    primaryColor: "#333",
    secondaryColor: "#E6E6E6",
    calculated: false
  });
  function setTwoToneColors(_ref) {
    var primaryColor = _ref.primaryColor, secondaryColor = _ref.secondaryColor;
    twoToneColorPalette.primaryColor = primaryColor;
    twoToneColorPalette.secondaryColor = secondaryColor || getSecondaryColor(primaryColor);
    twoToneColorPalette.calculated = !!secondaryColor;
  }
  function getTwoToneColors() {
    return _objectSpread$7({}, twoToneColorPalette);
  }
  var IconBase = function IconBase2(props, context) {
    var _props$context$attrs = _objectSpread$7({}, props, context.attrs), icon = _props$context$attrs.icon, primaryColor = _props$context$attrs.primaryColor, secondaryColor = _props$context$attrs.secondaryColor, restProps = _objectWithoutProperties$1(_props$context$attrs, _excluded$1);
    var colors = twoToneColorPalette;
    if (primaryColor) {
      colors = {
        primaryColor,
        secondaryColor: secondaryColor || getSecondaryColor(primaryColor)
      };
    }
    warning(isIconDefinition(icon));
    if (!isIconDefinition(icon)) {
      return null;
    }
    var target = icon;
    if (target && typeof target.icon === "function") {
      target = _objectSpread$7({}, target, {
        icon: target.icon(colors.primaryColor, colors.secondaryColor)
      });
    }
    return generate(target.icon, "svg-".concat(target.name), _objectSpread$7({}, restProps, {
      "data-icon": target.name,
      width: "1em",
      height: "1em",
      fill: "currentColor",
      "aria-hidden": "true"
    }));
  };
  IconBase.props = {
    icon: Object,
    primaryColor: String,
    secondaryColor: String,
    focusable: String
  };
  IconBase.inheritAttrs = false;
  IconBase.displayName = "IconBase";
  IconBase.getTwoToneColors = getTwoToneColors;
  IconBase.setTwoToneColors = setTwoToneColors;
  function _slicedToArray$1(arr, i) {
    return _arrayWithHoles$1(arr) || _iterableToArrayLimit$1(arr, i) || _unsupportedIterableToArray$1(arr, i) || _nonIterableRest$1();
  }
  function _nonIterableRest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray$1(o, minLen);
  }
  function _arrayLikeToArray$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit$1(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e2;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e2 = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e2;
      }
    }
    return _arr;
  }
  function _arrayWithHoles$1(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function setTwoToneColor(twoToneColor) {
    var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray$1(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
    return IconBase.setTwoToneColors({
      primaryColor,
      secondaryColor
    });
  }
  function getTwoToneColor() {
    var colors = IconBase.getTwoToneColors();
    if (!colors.calculated) {
      return colors.primaryColor;
    }
    return [colors.primaryColor, colors.secondaryColor];
  }
  var InsertStyles = vue.defineComponent({
    name: "InsertStyles",
    setup: function setup() {
      useInsertStyles();
      return function() {
        return null;
      };
    }
  });
  var _excluded = ["class", "icon", "spin", "rotate", "tabindex", "twoToneColor", "onClick"];
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
  function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e2;
    try {
      for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);
        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e2 = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e2;
      }
    }
    return _arr;
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _objectSpread$6(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$6(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$6(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
      var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
      for (i = 0; i < sourceSymbolKeys.length; i++) {
        key = sourceSymbolKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
        target[key] = source[key];
      }
    }
    return target;
  }
  function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for (i = 0; i < sourceKeys.length; i++) {
      key = sourceKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      target[key] = source[key];
    }
    return target;
  }
  setTwoToneColor(blue.primary);
  var Icon = function Icon2(props, context) {
    var _classObj;
    var _props$context$attrs = _objectSpread$6({}, props, context.attrs), cls = _props$context$attrs["class"], icon = _props$context$attrs.icon, spin = _props$context$attrs.spin, rotate = _props$context$attrs.rotate, tabindex = _props$context$attrs.tabindex, twoToneColor = _props$context$attrs.twoToneColor, onClick = _props$context$attrs.onClick, restProps = _objectWithoutProperties(_props$context$attrs, _excluded);
    var _useInjectIconContext = useInjectIconContext(), prefixCls = _useInjectIconContext.prefixCls, rootClassName = _useInjectIconContext.rootClassName;
    var classObj = (_classObj = {}, _defineProperty$6(_classObj, rootClassName.value, !!rootClassName.value), _defineProperty$6(_classObj, prefixCls.value, true), _defineProperty$6(_classObj, "".concat(prefixCls.value, "-").concat(icon.name), Boolean(icon.name)), _defineProperty$6(_classObj, "".concat(prefixCls.value, "-spin"), !!spin || icon.name === "loading"), _classObj);
    var iconTabIndex = tabindex;
    if (iconTabIndex === void 0 && onClick) {
      iconTabIndex = -1;
    }
    var svgStyle = rotate ? {
      msTransform: "rotate(".concat(rotate, "deg)"),
      transform: "rotate(".concat(rotate, "deg)")
    } : void 0;
    var _normalizeTwoToneColo = normalizeTwoToneColors(twoToneColor), _normalizeTwoToneColo2 = _slicedToArray(_normalizeTwoToneColo, 2), primaryColor = _normalizeTwoToneColo2[0], secondaryColor = _normalizeTwoToneColo2[1];
    return vue.createVNode("span", _objectSpread$6({
      "role": "img",
      "aria-label": icon.name
    }, restProps, {
      "onClick": onClick,
      "class": [classObj, cls],
      "tabindex": iconTabIndex
    }), [vue.createVNode(IconBase, {
      "icon": icon,
      "primaryColor": primaryColor,
      "secondaryColor": secondaryColor,
      "style": svgStyle
    }, null), vue.createVNode(InsertStyles, null, null)]);
  };
  Icon.props = {
    spin: Boolean,
    rotate: Number,
    icon: Object,
    twoToneColor: [String, Array]
  };
  Icon.displayName = "AntdIcon";
  Icon.inheritAttrs = false;
  Icon.getTwoToneColor = getTwoToneColor;
  Icon.setTwoToneColor = setTwoToneColor;
  var BulbOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M632 888H392c-4.4 0-8 3.6-8 8v32c0 17.7 14.3 32 32 32h192c17.7 0 32-14.3 32-32v-32c0-4.4-3.6-8-8-8zM512 64c-181.1 0-328 146.9-328 328 0 121.4 66 227.4 164 284.1V792c0 17.7 14.3 32 32 32h264c17.7 0 32-14.3 32-32V676.1c98-56.7 164-162.7 164-284.1 0-181.1-146.9-328-328-328zm127.9 549.8L604 634.6V752H420V634.6l-35.9-20.8C305.4 568.3 256 484.5 256 392c0-141.4 114.6-256 256-256s256 114.6 256 256c0 92.5-49.4 176.3-128.1 221.8z" } }] }, "name": "bulb", "theme": "outlined" };
  function _objectSpread$5(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$5(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$5(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var BulbOutlined = function BulbOutlined2(props, context) {
    var p = _objectSpread$5({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$5({}, p, {
      "icon": BulbOutlined$1
    }), null);
  };
  BulbOutlined.displayName = "BulbOutlined";
  BulbOutlined.inheritAttrs = false;
  var ExpandOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "defs", "attrs": {}, "children": [{ "tag": "style", "attrs": {} }] }, { "tag": "path", "attrs": { "d": "M342 88H120c-17.7 0-32 14.3-32 32v224c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16V168h174c8.8 0 16-7.2 16-16v-48c0-8.8-7.2-16-16-16zm578 576h-48c-8.8 0-16 7.2-16 16v176H682c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h222c17.7 0 32-14.3 32-32V680c0-8.8-7.2-16-16-16zM342 856H168V680c0-8.8-7.2-16-16-16h-48c-8.8 0-16 7.2-16 16v224c0 17.7 14.3 32 32 32h222c8.8 0 16-7.2 16-16v-48c0-8.8-7.2-16-16-16zM904 88H682c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h174v176c0 8.8 7.2 16 16 16h48c8.8 0 16-7.2 16-16V120c0-17.7-14.3-32-32-32z" } }] }, "name": "expand", "theme": "outlined" };
  function _objectSpread$4(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$4(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$4(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var ExpandOutlined = function ExpandOutlined2(props, context) {
    var p = _objectSpread$4({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$4({}, p, {
      "icon": ExpandOutlined$1
    }), null);
  };
  ExpandOutlined.displayName = "ExpandOutlined";
  ExpandOutlined.inheritAttrs = false;
  var LoadingOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "0 0 1024 1024", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M988 548c-19.9 0-36-16.1-36-36 0-59.4-11.6-117-34.6-171.3a440.45 440.45 0 00-94.3-139.9 437.71 437.71 0 00-139.9-94.3C629 83.6 571.4 72 512 72c-19.9 0-36-16.1-36-36s16.1-36 36-36c69.1 0 136.2 13.5 199.3 40.3C772.3 66 827 103 874 150c47 47 83.9 101.8 109.7 162.7 26.7 63.1 40.2 130.2 40.2 199.3.1 19.9-16 36-35.9 36z" } }] }, "name": "loading", "theme": "outlined" };
  function _objectSpread$3(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$3(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$3(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var LoadingOutlined = function LoadingOutlined2(props, context) {
    var p = _objectSpread$3({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$3({}, p, {
      "icon": LoadingOutlined$1
    }), null);
  };
  LoadingOutlined.displayName = "LoadingOutlined";
  LoadingOutlined.inheritAttrs = false;
  var SendOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "defs", "attrs": {}, "children": [{ "tag": "style", "attrs": {} }] }, { "tag": "path", "attrs": { "d": "M931.4 498.9L94.9 79.5c-3.4-1.7-7.3-2.1-11-1.2a15.99 15.99 0 00-11.7 19.3l86.2 352.2c1.3 5.3 5.2 9.6 10.4 11.3l147.7 50.7-147.6 50.7c-5.2 1.8-9.1 6-10.3 11.3L72.2 926.5c-.9 3.7-.5 7.6 1.2 10.9 3.9 7.9 13.5 11.1 21.5 7.2l836.5-417c3.1-1.5 5.6-4.1 7.2-7.1 3.9-8 .7-17.6-7.2-21.6zM170.8 826.3l50.3-205.6 295.2-101.3c2.3-.8 4.2-2.6 5-5 1.4-4.2-.8-8.7-5-10.2L221.1 403 171 198.2l628 314.9-628.2 313.2z" } }] }, "name": "send", "theme": "outlined" };
  function _objectSpread$2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$2(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$2(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var SendOutlined = function SendOutlined2(props, context) {
    var p = _objectSpread$2({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$2({}, p, {
      "icon": SendOutlined$1
    }), null);
  };
  SendOutlined.displayName = "SendOutlined";
  SendOutlined.inheritAttrs = false;
  var SettingOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M924.8 625.7l-65.5-56c3.1-19 4.7-38.4 4.7-57.8s-1.6-38.8-4.7-57.8l65.5-56a32.03 32.03 0 009.3-35.2l-.9-2.6a443.74 443.74 0 00-79.7-137.9l-1.8-2.1a32.12 32.12 0 00-35.1-9.5l-81.3 28.9c-30-24.6-63.5-44-99.7-57.6l-15.7-85a32.05 32.05 0 00-25.8-25.7l-2.7-.5c-52.1-9.4-106.9-9.4-159 0l-2.7.5a32.05 32.05 0 00-25.8 25.7l-15.8 85.4a351.86 351.86 0 00-99 57.4l-81.9-29.1a32 32 0 00-35.1 9.5l-1.8 2.1a446.02 446.02 0 00-79.7 137.9l-.9 2.6c-4.5 12.5-.8 26.5 9.3 35.2l66.3 56.6c-3.1 18.8-4.6 38-4.6 57.1 0 19.2 1.5 38.4 4.6 57.1L99 625.5a32.03 32.03 0 00-9.3 35.2l.9 2.6c18.1 50.4 44.9 96.9 79.7 137.9l1.8 2.1a32.12 32.12 0 0035.1 9.5l81.9-29.1c29.8 24.5 63.1 43.9 99 57.4l15.8 85.4a32.05 32.05 0 0025.8 25.7l2.7.5a449.4 449.4 0 00159 0l2.7-.5a32.05 32.05 0 0025.8-25.7l15.7-85a350 350 0 0099.7-57.6l81.3 28.9a32 32 0 0035.1-9.5l1.8-2.1c34.8-41.1 61.6-87.5 79.7-137.9l.9-2.6c4.5-12.3.8-26.3-9.3-35zM788.3 465.9c2.5 15.1 3.8 30.6 3.8 46.1s-1.3 31-3.8 46.1l-6.6 40.1 74.7 63.9a370.03 370.03 0 01-42.6 73.6L721 702.8l-31.4 25.8c-23.9 19.6-50.5 35-79.3 45.8l-38.1 14.3-17.9 97a377.5 377.5 0 01-85 0l-17.9-97.2-37.8-14.5c-28.5-10.8-55-26.2-78.7-45.7l-31.4-25.9-93.4 33.2c-17-22.9-31.2-47.6-42.6-73.6l75.5-64.5-6.5-40c-2.4-14.9-3.7-30.3-3.7-45.5 0-15.3 1.2-30.6 3.7-45.5l6.5-40-75.5-64.5c11.3-26.1 25.6-50.7 42.6-73.6l93.4 33.2 31.4-25.9c23.7-19.5 50.2-34.9 78.7-45.7l37.9-14.3 17.9-97.2c28.1-3.2 56.8-3.2 85 0l17.9 97 38.1 14.3c28.7 10.8 55.4 26.2 79.3 45.8l31.4 25.8 92.8-32.9c17 22.9 31.2 47.6 42.6 73.6L781.8 426l6.5 39.9zM512 326c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm79.2 255.2A111.6 111.6 0 01512 614c-29.9 0-58-11.7-79.2-32.8A111.6 111.6 0 01400 502c0-29.9 11.7-58 32.8-79.2C454 401.6 482.1 390 512 390c29.9 0 58 11.6 79.2 32.8A111.6 111.6 0 01624 502c0 29.9-11.7 58-32.8 79.2z" } }] }, "name": "setting", "theme": "outlined" };
  function _objectSpread$1(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty$1(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty$1(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var SettingOutlined = function SettingOutlined2(props, context) {
    var p = _objectSpread$1({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread$1({}, p, {
      "icon": SettingOutlined$1
    }), null);
  };
  SettingOutlined.displayName = "SettingOutlined";
  SettingOutlined.inheritAttrs = false;
  var ShrinkOutlined$1 = { "icon": { "tag": "svg", "attrs": { "viewBox": "64 64 896 896", "focusable": "false" }, "children": [{ "tag": "path", "attrs": { "d": "M881.7 187.4l-45.1-45.1a8.03 8.03 0 00-11.3 0L667.8 299.9l-54.7-54.7a7.94 7.94 0 00-13.5 4.7L576.1 439c-.6 5.2 3.7 9.5 8.9 8.9l189.2-23.5c6.6-.8 9.3-8.8 4.7-13.5l-54.7-54.7 157.6-157.6c3-3 3-8.1-.1-11.2zM439 576.1l-189.2 23.5c-6.6.8-9.3 8.9-4.7 13.5l54.7 54.7-157.5 157.5a8.03 8.03 0 000 11.3l45.1 45.1c3.1 3.1 8.2 3.1 11.3 0l157.6-157.6 54.7 54.7a7.94 7.94 0 0013.5-4.7L447.9 585a7.9 7.9 0 00-8.9-8.9z" } }] }, "name": "shrink", "theme": "outlined" };
  function _objectSpread(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? Object(arguments[i]) : {};
      var ownKeys = Object.keys(source);
      if (typeof Object.getOwnPropertySymbols === "function") {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }
      ownKeys.forEach(function(key) {
        _defineProperty(target, key, source[key]);
      });
    }
    return target;
  }
  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var ShrinkOutlined = function ShrinkOutlined2(props, context) {
    var p = _objectSpread({}, props, context.attrs);
    return vue.createVNode(Icon, _objectSpread({}, p, {
      "icon": ShrinkOutlined$1
    }), null);
  };
  ShrinkOutlined.displayName = "ShrinkOutlined";
  ShrinkOutlined.inheritAttrs = false;
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const getScriptInfo = () => {
    return {
      name: _GM_info.script.name,
      author: _GM_info.script.author,
      namespace: _GM_info.script.namespace,
      version: _GM_info.script.version,
      description: _GM_info.script.description
    };
  };
  const formatDateTime = (dt) => {
    dt.getFullYear();
    dt.getMonth() + 1;
    dt.getDate();
    let hours = dt.getHours();
    let minutes = dt.getMinutes();
    let seconds = dt.getSeconds();
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  };
  const pad = (n) => {
    return n < 10 ? "0" + n : n.toString();
  };
  const getDateTime = () => {
    let now = /* @__PURE__ */ new Date();
    return formatDateTime(now);
  };
  const useLogStore = pinia.defineStore("log", {
    state: () => ({
      logList: []
    }),
    actions: {
      insertLog(text2, type = null, tabIndex = null) {
        const logItem = {
          text: text2,
          time: getDateTime(),
          type,
          tabIndex
        };
        this.logList.push(logItem);
      }
    }
  });
  const _hoisted_1$7 = { class: "log-wrap" };
  const _hoisted_2$6 = ["innerHTML"];
  const _hoisted_3$5 = { key: 0 };
  const _sfc_main$8 = {
    __name: "UserLog",
    setup(__props) {
      const log = useLogStore();
      const logList = vue.ref(log.logList);
      const logDom = vue.ref(null);
      vue.watch(
        () => log.logList,
        () => {
          vue.nextTick(() => {
            logDom.value.scrollTop = logDom.value.scrollHeight;
          });
        },
        { deep: true }
      );
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$7, [
          vue.createElementVNode("div", {
            class: "console",
            ref_key: "logDom",
            ref: logDom
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(logList.value, (item, index) => {
              return vue.openBlock(), vue.createElementBlock("div", { key: index }, [
                vue.createElementVNode("span", null, vue.toDisplayString(item.time), 1),
                vue.createElementVNode("span", {
                  class: vue.normalizeClass(item.type == null ? "log" : "warning")
                }, "[" + vue.toDisplayString(item.type == null ? "日志" : "警告") + "]", 3),
                vue.createElementVNode("span", {
                  innerHTML: item.text
                }, null, 8, _hoisted_2$6)
              ]);
            }), 128)),
            logList.value.length == 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_3$5, _cache[0] || (_cache[0] = [
              vue.createElementVNode("span", { class: "log" }, "[日志]", -1),
              vue.createElementVNode("span", null, "等待用户进入正确页面..", -1)
            ]))) : vue.createCommentVNode("", true)
          ], 512)
        ]);
      };
    }
  };
  const useSettingStore = pinia.defineStore("setting", {
    state: () => {
      const scriptInfo = getScriptInfo();
      const defaultSetting = {
        tabIndex: "0",
        version: scriptInfo.version,
        position: {
          left: "calc(50vw - 100px)",
          top: "20vh"
        },
        shopLink: "",
        latestVersion: "",
        serverNode: "default",
        config: {
          // tikuConfig:{
          //   serverChoice:{
          //     text: "题库节点",
          //     value: 1,
          //     type: "select",
          //     tips: "如果请求超时，请尝试选择其他节点"
          //   }
          // },
          cxConfig: {},
          basicConfig: {
            token: {
              text: "密钥",
              value: "",
              type: "input",
              tips: "输入密钥后，点击一下其他区域或者刷新页面"
            },
            videoPlayrate: {
              text: "视频倍速",
              value: 1,
              type: "select",
              tips: "视频观看倍速，高倍速可能面临进度清空风险，请慎重选择，建议（1-2倍速）"
            },
            reqIntervalTime: {
              text: "搜题间隔（秒）",
              value: 2,
              type: "input-number",
              min: 1,
              max: 3,
              tips: "每题搜题间隔，不建议太低，避免服务器压力过大"
            },
            accuracy: {
              text: "正确率",
              value: 80,
              type: "slider",
              tips: "作业、测验、考试满足设定的正确率才会提交，不满足自动保存,建议80%"
            },
            aiAnswer: {
              text: "AI答题",
              value: true,
              type: "switch",
              tips: "（建议开启）开启后，没有答案的题目自动AI答题，AI正确率约为80%"
            },
            autoSubmit: {
              text: "章节、作业自动提交",
              value: true,
              type: "switch",
              tips: "（建议开启）开启后，满足正确率则自动提交作业、章节，手动答题时建议关闭此功能"
            },
            autoChangeChapter: {
              text: "自动切换章节",
              value: true,
              type: "switch",
              tips: "（建议开启）开启后，自动切换章节，手动答题时，建议关闭"
            },
            autoAnswer: {
              text: "自动答题",
              value: true,
              type: "switch",
              tips: "手动答题时，建议关闭，刷课时，建议开始"
            }
          },
          examConfig: {
            autoChangeNext: {
              value: true,
              text: "自动切换下一题",
              type: "switch",
              tips: "手动考试时，建议关闭，自动考试答题，请开启。"
            }
          },
          searchConfig: {
            searchBySelectedText: {
              value: false,
              text: "划词搜题"
            }
          }
        },
        userInfo: {
          remainCount: 0
        }
      };
      try {
        const localStore = JSON.parse(_GM_getValue("setting"));
        if (localStore && scriptInfo.version === localStore.version) {
          return localStore;
        }
      } catch (error) {
        console.log("localStore rrror:", error);
      }
      return defaultSetting;
    }
  });
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1$6 = { class: "home-wrap" };
  const _hoisted_2$5 = { class: "tips" };
  const _hoisted_3$4 = { key: 0 };
  const _sfc_main$7 = {
    __name: "ScriptHome",
    setup(__props) {
      const scriptInfo = getScriptInfo();
      const setting = useSettingStore();
      const { latestVersion } = pinia.storeToRefs(setting);
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$6, [
          _cache[4] || (_cache[4] = vue.createElementVNode("div", { class: "separator" }, "💡 使用提示", -1)),
          vue.createElementVNode("div", _hoisted_2$5, [
            vue.createElementVNode("ul", null, [
              vue.unref(scriptInfo).version !== vue.unref(latestVersion) ? (vue.openBlock(), vue.createElementBlock("li", _hoisted_3$4, _cache[0] || (_cache[0] = [
                vue.createTextVNode("检测到脚本非最新版本，"),
                vue.createElementVNode("a", {
                  href: "https://scriptcat.org/zh-CN/script-show-page/4150",
                  target: "_blank"
                }, "点我更新", -1)
              ]))) : vue.createCommentVNode("", true),
              _cache[1] || (_cache[1] = vue.createElementVNode("li", null, "请手动进入视频、作业、考试页面，脚本会自动运行。", -1)),
              _cache[2] || (_cache[2] = vue.createElementVNode("li", null, [
                vue.createTextVNode("如脚本无法正常运行，请使用 "),
                vue.createElementVNode("a", {
                  target: "_blank",
                  href: "https://www.google.com/intl/zh-CN/chrome/"
                }, "Chrome"),
                vue.createTextVNode(" 、 "),
                vue.createElementVNode("a", {
                  target: "_blank",
                  href: "http://www.firefox.com.cn/"
                }, "火狐浏览器")
              ], -1)),
              _cache[3] || (_cache[3] = vue.createElementVNode("li", null, [
                vue.createTextVNode("如果遇到服务器异常，请前往设置"),
                vue.createElementVNode("span", null, "更换节点")
              ], -1))
            ])
          ]),
          _cache[5] || (_cache[5] = vue.createElementVNode("div", { class: "separator" }, "📖 使用教程", -1)),
          _cache[6] || (_cache[6] = vue.createElementVNode("ol", null, [
            vue.createElementVNode("li", null, "打开任意网课平台，等待脚本加载。"),
            vue.createElementVNode("li", null, "如果自动答题搜索不到，可尝试在线搜索，答案基本都有。"),
            vue.createElementVNode("li", null, "如果不支持当前网课，则不会有相应的提示以及设置面板。"),
            vue.createElementVNode("li", null, [
              vue.createElementVNode("span", null, "最后温馨提示: "),
              vue.createElementVNode("div", null, "- 禁止与其他脚本一起使用，否则出现答案选不上或者页面卡死，无限刷新，等问题一律后果自负。"),
              vue.createElementVNode("div", null, "- 请将浏览器页面保持最大化，或者缩小窗口，不能最小化，否则可能导致脚本卡死！")
            ])
          ], -1))
        ]);
      };
    }
  };
  const ScriptHome = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-f39340c3"]]);
  const useQuestionStore = pinia.defineStore("questionStore", {
    state: () => ({
      questionList: [],
      currentQuestionIndex: 0,
      accuracy: -1,
      searchText: "",
      fuzzySearchResult: []
    }),
    actions: {
      clearQuestion() {
        this.questionList = [];
      },
      clearFuzzySearchResult() {
        this.fuzzySearchResult = [];
      }
    }
  });
  const _hoisted_1$5 = { class: "answer-wrap" };
  const _hoisted_2$4 = { class: "tips" };
  const _hoisted_3$3 = { class: "answer-tips" };
  const _hoisted_4$3 = { style: { "margin-bottom": "10px" } };
  const _hoisted_5$3 = { key: 0 };
  const _hoisted_6$3 = { key: 1 };
  const _hoisted_7$3 = { key: 2 };
  const _hoisted_8$3 = {
    key: 0,
    style: { "text-align": "center" }
  };
  const _hoisted_9$3 = { key: 1 };
  const _hoisted_10$2 = { class: "answer-list" };
  const _hoisted_11$2 = ["onClick"];
  const _hoisted_12$2 = { key: 0 };
  const _hoisted_13$1 = ["innerHTML"];
  const _hoisted_14 = { class: "answer-content" };
  const _hoisted_15 = ["innerHTML"];
  const _hoisted_16 = {
    key: 0,
    style: { "color": "#f94f17" }
  };
  const _sfc_main$6 = {
    __name: "AutoAnswer",
    emits: ["changeTab"],
    setup(__props, { emit: __emit }) {
      const codeMap = {
        1: "success",
        "-1": "default",
        2: "ai-success"
      };
      const questionStore = useQuestionStore();
      const selectedIndex = vue.ref(0);
      const answerDom = vue.ref(null);
      const setting = useSettingStore();
      const {
        questionList,
        currentQuestionIndex: currentIndex,
        accuracy
      } = pinia.storeToRefs(questionStore);
      const {
        userInfo
      } = pinia.storeToRefs(setting);
      const emit = __emit;
      const goSetting = () => {
        emit("changeTab", "4");
      };
      const checkAnswer = (index) => {
        if (index > currentIndex.value) return;
        const dom = answerDom.value.getElementsByClassName("answer-item")[index];
        answerDom.value.scrollTo({ top: dom.offsetTop });
        selectedIndex.value = index;
      };
      return (_ctx, _cache) => {
        const _component_a_button = vue.resolveComponent("a-button");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$5, [
          vue.createElementVNode("div", _hoisted_2$4, [
            vue.createElementVNode("ul", null, [
              vue.createElementVNode("li", null, [
                _cache[1] || (_cache[1] = vue.createTextVNode(" 使用自动答题功能，请先 ")),
                vue.createVNode(_component_a_button, {
                  onClick: goSetting,
                  size: "small",
                  type: "primary"
                }, {
                  icon: vue.withCtx(() => [
                    vue.createVNode(vue.unref(SettingOutlined))
                  ]),
                  default: vue.withCtx(() => [
                    _cache[0] || (_cache[0] = vue.createTextVNode("配置密钥 "))
                  ]),
                  _: 1
                })
              ]),
              _cache[2] || (_cache[2] = vue.createElementVNode("li", null, "如需手动答题，建议关闭自动切换功能", -1)),
              _cache[3] || (_cache[3] = vue.createElementVNode("li", null, "每次自动答题开始前，都会清空上一次的搜索结果", -1))
            ])
          ]),
          _cache[10] || (_cache[10] = vue.createElementVNode("div", {
            class: "separator",
            style: { "margin": "5px 0" }
          }, null, -1)),
          vue.createElementVNode("div", _hoisted_3$3, [
            vue.createElementVNode("div", _hoisted_4$3, [
              vue.createElementVNode("span", null, "答题进度：" + vue.toDisplayString(vue.unref(currentIndex)) + " / " + vue.toDisplayString(vue.unref(questionList).length), 1),
              _cache[5] || (_cache[5] = vue.createElementVNode("span", null, "｜", -1)),
              vue.createElementVNode("span", null, [
                _cache[4] || (_cache[4] = vue.createTextVNode(" 准确率： ")),
                vue.unref(questionList).length == 0 ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_5$3, "未答题")) : vue.unref(accuracy) != -1 ? (vue.openBlock(), vue.createElementBlock("span", _hoisted_6$3, vue.toDisplayString(vue.unref(accuracy)) + "%", 1)) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_7$3, "作业中.."))
              ]),
              _cache[6] || (_cache[6] = vue.createElementVNode("span", null, "｜", -1)),
              vue.createElementVNode("span", null, "剩余次数：" + vue.toDisplayString(vue.unref(userInfo).remainCount), 1)
            ]),
            _cache[7] || (_cache[7] = vue.createStaticVNode('<div class="box-tips"><div class="search-info searching"></div><span>搜索中</span><div class="search-info success"></div><span>题库答案</span><div class="search-info ai-success"></div><span>AI答案</span><div class="search-info warning"></div><span>异常</span></div>', 1))
          ]),
          _cache[11] || (_cache[11] = vue.createElementVNode("div", {
            class: "separator",
            style: { "margin": "5px 0" }
          }, null, -1)),
          vue.unref(questionList).length == 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_8$3, " ❗️ 未检测到试题 ")) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_9$3, [
            vue.createElementVNode("div", _hoisted_10$2, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(questionList), (question, index) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  onClick: ($event) => checkAnswer(index),
                  class: vue.normalizeClass(`search-info ${index === vue.unref(currentIndex) ? "searching" : ""} ${codeMap[question.answer.code] || "warning"}`),
                  key: index
                }, vue.toDisplayString(index + 1), 11, _hoisted_11$2);
              }), 128))
            ]),
            _cache[9] || (_cache[9] = vue.createElementVNode("div", {
              class: "separator",
              style: { "margin": "5px 0" }
            }, null, -1)),
            vue.unref(questionList).length != 0 ? (vue.openBlock(), vue.createElementBlock("div", {
              key: 0,
              ref_key: "answerDom",
              ref: answerDom,
              class: "answer-detail"
            }, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(currentIndex), (index) => {
                return vue.openBlock(), vue.createElementBlock("div", {
                  class: "answer-item",
                  key: index
                }, [
                  index <= vue.unref(questionList).length ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12$2, [
                    vue.createElementVNode("div", null, [
                      vue.createElementVNode("span", null, vue.toDisplayString(index) + ".", 1),
                      vue.createElementVNode("div", {
                        style: { "display": "inline-block" },
                        innerHTML: vue.unref(questionList)[index - 1].title
                      }, null, 8, _hoisted_13$1)
                    ]),
                    vue.createElementVNode("div", _hoisted_14, [
                      _cache[8] || (_cache[8] = vue.createElementVNode("span", null, "答案：", -1)),
                      vue.createElementVNode("div", {
                        innerHTML: vue.unref(questionList)[index - 1].answer.answer.join()
                      }, null, 8, _hoisted_15),
                      vue.unref(questionList)[index - 1].answer.code === 0 ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_16, "有答案（不完全匹配），请手动选择")) : vue.createCommentVNode("", true)
                    ])
                  ])) : vue.createCommentVNode("", true)
                ]);
              }), 128))
            ], 512)) : vue.createCommentVNode("", true)
          ]))
        ]);
      };
    }
  };
  const _hoisted_1$4 = { class: "config-wrap" };
  const _hoisted_2$3 = { class: "tips" };
  const _hoisted_3$2 = { class: "buy-btn" };
  const _hoisted_4$2 = ["href"];
  const _hoisted_5$2 = { class: "config" };
  const _hoisted_6$2 = { class: "config-name" };
  const _hoisted_7$2 = { class: "config-input" };
  const _hoisted_8$2 = { key: 5 };
  const _hoisted_9$2 = { class: "config-name" };
  const _hoisted_10$1 = { class: "config-input" };
  const _hoisted_11$1 = { key: 5 };
  const _hoisted_12$1 = { class: "config-name" };
  const _hoisted_13 = { class: "config-input" };
  const _sfc_main$5 = {
    __name: "UserConfig",
    setup(__props) {
      const setting = useSettingStore();
      const { shopLink } = pinia.storeToRefs(setting);
      vue.watch(
        () => setting.config.basicConfig.token,
        (newVal) => {
          window.location.reload();
        },
        {
          deep: true
        }
      );
      vue.watch(
        () => setting.config.basicConfig.videoPlayrate,
        (newVal) => {
          window.location.reload();
        },
        {
          deep: true
        }
      );
      const servers = vue.ref([
        {
          value: "default",
          label: "默认节点"
        },
        {
          value: "server2",
          label: "节点2"
        }
      ]);
      const playrates = vue.ref([
        {
          value: 1,
          label: "1 x"
        },
        {
          value: 1.5,
          label: "1.5 x"
        },
        {
          value: 2,
          label: "2 x"
        },
        {
          value: 3,
          label: "3 x"
        },
        {
          value: 4,
          label: "4 x"
        }
      ]);
      const cxConfig = vue.ref([
        {
          name: "编辑时显示自定义编辑框",
          value: true
        },
        {
          name: "出现人脸识别时通知我",
          value: true
        }
        // {
        //   name: "超星防检测",
        //   value: true,
        // },
      ]);
      const formatter = (value) => {
        return `${value}%`;
      };
      const closeAllAuto = () => {
        const hasAnyEnabled = setting.config.basicConfig.autoSubmit.value || setting.config.basicConfig.autoChangeChapter.value || setting.config.basicConfig.autoAnswer.value;
        const newState = !hasAnyEnabled;
        setting.config.basicConfig.autoSubmit.value = newState;
        setting.config.basicConfig.autoChangeChapter.value = newState;
        setting.config.basicConfig.autoAnswer.value = newState;
      };
      return (_ctx, _cache) => {
        const _component_a_tooltip = vue.resolveComponent("a-tooltip");
        const _component_a_select = vue.resolveComponent("a-select");
        const _component_a_slider = vue.resolveComponent("a-slider");
        const _component_a_input_number = vue.resolveComponent("a-input-number");
        const _component_a_switch = vue.resolveComponent("a-switch");
        const _component_a_input = vue.resolveComponent("a-input");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$4, [
          vue.createElementVNode("div", _hoisted_2$3, [
            vue.createElementVNode("ul", null, [
              vue.createElementVNode("li", null, [
                _cache[1] || (_cache[1] = vue.createTextVNode("自动答题功能需填写密钥，请联系vx:fendouxiaoli_购买密钥 ")),
                vue.createElementVNode("span", _hoisted_3$2, [
                  vue.createVNode(vue.unref(BulbOutlined), { style: { "color": "#fff", "margin-right": "2px" } }),
                  vue.createElementVNode("a", {
                    href: vue.unref(shopLink),
                    target: "_blank"
                  },  8, _hoisted_4$2)
                ])
              ]),
              _cache[7] || (_cache[7] = vue.createElementVNode("li", null, "设置后进入章节测试，作业，考试页面即可自动答题", -1)),
              vue.createElementVNode("li", null, [
                _cache[2] || (_cache[2] = vue.createTextVNode("使用")),
                _cache[3] || (_cache[3] = vue.createElementVNode("span", { style: { "color": "#ff4d4f" } }, "AI、在线搜题", -1)),
                _cache[4] || (_cache[4] = vue.createTextVNode("，")),
                _cache[5] || (_cache[5] = vue.createElementVNode("span", { style: { "color": "#ff4d4f" } }, "关闭所有自动操作", -1)),
                _cache[6] || (_cache[6] = vue.createTextVNode("，防止冲突。 ")),
                vue.createVNode(_component_a_tooltip, { title: "开启/关闭所有自动操作" }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("span", {
                      onClick: closeAllAuto,
                      class: "buy-btn"
                    }, "一键关闭/开启")
                  ]),
                  _: 1
                })
              ]),
              _cache[8] || (_cache[8] = vue.createElementVNode("li", null, [
                vue.createTextVNode("⚠️视频中出现题目，可以忽略，"),
                vue.createElementVNode("span", { style: { "color": "#ff4d4f" } }, "不影响学习进度")
              ], -1))
            ])
          ]),
          _cache[11] || (_cache[11] = vue.createElementVNode("div", { class: "separator" }, "基本设置", -1)),
          vue.createElementVNode("div", null, [
            vue.createElementVNode("div", _hoisted_5$2, [
              _cache[9] || (_cache[9] = vue.createElementVNode("div", null, "剩余次数：", -1)),
              vue.createElementVNode("div", null, vue.toDisplayString(vue.unref(setting).userInfo.remainCount), 1)
            ]),
            vue.createElementVNode("div", null, [
              vue.createVNode(_component_a_tooltip, {
                class: "config",
                title: "切换题库节点，如果请求超时，请尝试选择其他节点"
              }, {
                default: vue.withCtx(() => [
                  _cache[10] || (_cache[10] = vue.createElementVNode("div", null, "题库节点：", -1)),
                  vue.createElementVNode("div", null, [
                    vue.createVNode(_component_a_select, {
                      value: vue.unref(setting).serverNode,
                      "onUpdate:value": _cache[0] || (_cache[0] = ($event) => vue.unref(setting).serverNode = $event),
                      options: servers.value
                    }, null, 8, ["value", "options"])
                  ])
                ]),
                _: 1
              })
            ]),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(setting).config.basicConfig, (config2) => {
              return vue.openBlock(), vue.createElementBlock("div", { key: config2 }, [
                vue.createVNode(_component_a_tooltip, {
                  class: "config",
                  placement: "topRight",
                  zIndex: 9999,
                  title: config2.tips
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_6$2, vue.toDisplayString(config2.text), 1),
                    vue.createElementVNode("div", _hoisted_7$2, [
                      config2.type === "slider" ? (vue.openBlock(), vue.createBlock(_component_a_slider, {
                        key: 0,
                        value: config2.value,
                        "onUpdate:value": ($event) => config2.value = $event,
                        "tip-formatter": formatter
                      }, null, 8, ["value", "onUpdate:value"])) : config2.type === "input-number" ? (vue.openBlock(), vue.createBlock(_component_a_input_number, {
                        key: 1,
                        precision: 0,
                        value: config2.value,
                        "onUpdate:value": ($event) => config2.value = $event,
                        min: config2.min,
                        max: config2.max
                      }, null, 8, ["value", "onUpdate:value", "min", "max"])) : config2.type === "switch" ? (vue.openBlock(), vue.createBlock(_component_a_switch, {
                        key: 2,
                        size: "small",
                        checked: config2.value,
                        "onUpdate:checked": ($event) => config2.value = $event
                      }, null, 8, ["checked", "onUpdate:checked"])) : config2.type === "input" ? (vue.openBlock(), vue.createBlock(_component_a_input, {
                        key: 3,
                        value: config2.value,
                        "onUpdate:value": ($event) => config2.value = $event,
                        valueModifiers: { lazy: true, trim: true },
                        placeholder: "输入您的密钥"
                      }, null, 8, ["value", "onUpdate:value"])) : config2.type === "select" ? (vue.openBlock(), vue.createBlock(_component_a_select, {
                        key: 4,
                        style: { "width": "100px" },
                        ref_for: true,
                        ref: "select",
                        value: config2.value,
                        "onUpdate:value": ($event) => config2.value = $event,
                        options: playrates.value
                      }, null, 8, ["value", "onUpdate:value", "options"])) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_8$2, vue.toDisplayString(config2.value), 1))
                    ])
                  ]),
                  _: 2
                }, 1032, ["title"])
              ]);
            }), 128))
          ]),
          _cache[12] || (_cache[12] = vue.createElementVNode("div", { class: "separator" }, "考试设置", -1)),
          vue.createElementVNode("div", null, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(setting).config.examConfig, (config2) => {
              return vue.openBlock(), vue.createElementBlock("div", { key: config2 }, [
                vue.createVNode(_component_a_tooltip, {
                  class: "config",
                  placement: "topRight",
                  zIndex: 9999,
                  title: config2.tips
                }, {
                  default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_9$2, vue.toDisplayString(config2.text), 1),
                    vue.createElementVNode("div", _hoisted_10$1, [
                      config2.type === "slider" ? (vue.openBlock(), vue.createBlock(_component_a_slider, {
                        key: 0,
                        value: config2.value,
                        "onUpdate:value": ($event) => config2.value = $event,
                        "tip-formatter": formatter
                      }, null, 8, ["value", "onUpdate:value"])) : config2.type === "input-number" ? (vue.openBlock(), vue.createBlock(_component_a_input_number, {
                        key: 1,
                        precision: 0,
                        value: config2.value,
                        "onUpdate:value": ($event) => config2.value = $event,
                        min: config2.min,
                        max: config2.max
                      }, null, 8, ["value", "onUpdate:value", "min", "max"])) : config2.type === "switch" ? (vue.openBlock(), vue.createBlock(_component_a_switch, {
                        key: 2,
                        size: "small",
                        checked: config2.value,
                        "onUpdate:checked": ($event) => config2.value = $event
                      }, null, 8, ["checked", "onUpdate:checked"])) : config2.type === "input" ? (vue.openBlock(), vue.createBlock(_component_a_input, {
                        key: 3,
                        value: config2.value,
                        "onUpdate:value": ($event) => config2.value = $event,
                        valueModifiers: { lazy: true, trim: true },
                        placeholder: "输入您的密钥"
                      }, null, 8, ["value", "onUpdate:value"])) : config2.type === "select" ? (vue.openBlock(), vue.createBlock(_component_a_select, {
                        key: 4,
                        style: { "width": "100px" },
                        ref_for: true,
                        ref: "select",
                        value: config2.value,
                        "onUpdate:value": ($event) => config2.value = $event,
                        options: playrates.value
                      }, null, 8, ["value", "onUpdate:value", "options"])) : (vue.openBlock(), vue.createElementBlock("span", _hoisted_11$1, vue.toDisplayString(config2.value), 1))
                    ])
                  ]),
                  _: 2
                }, 1032, ["title"])
              ]);
            }), 128))
          ]),
          _cache[13] || (_cache[13] = vue.createElementVNode("div", { class: "separator" }, "超星设置", -1)),
          (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(cxConfig.value, (config2) => {
            return vue.openBlock(), vue.createElementBlock("div", {
              class: "config",
              key: config2.name
            }, [
              vue.createElementVNode("div", _hoisted_12$1, vue.toDisplayString(config2.name), 1),
              vue.createElementVNode("div", _hoisted_13, [
                vue.createVNode(_component_a_switch, {
                  size: "small",
                  checked: config2.value,
                  "onUpdate:checked": ($event) => config2.value = $event
                }, null, 8, ["checked", "onUpdate:checked"])
              ])
            ]);
          }), 128))
        ]);
      };
    }
  };
  const sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms * 1e3));
  };
  const getApiBaseUrl = () => {
    try {
      const setting = useSettingStore();
      const selector = setting.serverNode;
      switch (selector) {
        case "server2":
          return "http://154.44.26.234";
        default:
          return "http://cs.dkjdda.top";
      }
    } catch (error) {
      return "http://cs.dkjdda.top";
    }
  };
  const handleError$1 = (msg) => ({
    code: 10003,
    data: {
      answer: [],
      num: "",
      usenum: ""
    },
    msg
  });
  const getAccurateAnswer = async (question) => {
    var _a2;
    const _self = _unsafeWindow;
    const url2 = getApiBaseUrl() + "/question/accurateSearch";
    const setting = useSettingStore();
    const headers = {
      "Content-Type": "application/json",
      referer: question.refer,
      u: _self.uid || _self.getCookie("UID") || _self.getCookie("_uid") || "",
      t: Math.floor((/* @__PURE__ */ new Date()).getTime() / 1e3).toString()
    };
    const scriptInfo = getScriptInfo();
    const data = JSON.stringify({
      author: scriptInfo.author,
      version: scriptInfo.version,
      referer: "me",
      question: question.title,
      options: question.optionsText,
      type: question.type,
      questionData: "question.element.outerHTML",
      workType: question.workType,
      id: ((_a2 = question.refer.match(/courseId=(\d+)/)) == null ? void 0 : _a2[1]) || question.id,
      token: setting.config.basicConfig.token.value
    });
    await sleep(setting.config.basicConfig.reqIntervalTime.value);
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        url: url2,
        method: "POST",
        headers,
        data,
        timeout: 15e3,
        onload: (response) => {
          try {
            const apiResponse = JSON.parse(response.responseText);
            resolve(apiResponse);
          } catch (e) {
            resolve(handleError$1("解析出错"));
          }
        },
        onerror: () => resolve(handleError$1("服务器维护中..自动刷课功能正常使用")),
        ontimeout: () => resolve(handleError$1("请求超时"))
      });
    });
  };
  const fetchFuzzySearch = async (question) => {
    const url2 = getApiBaseUrl() + "/question/fuzzySearch";
    const setting = useSettingStore();
    const headers = {
      "Content-Type": "application/json"
    };
    const data = JSON.stringify({
      text: question,
      token: setting.config.basicConfig.token.value
    });
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        url: url2,
        method: "POST",
        headers,
        data,
        timeout: 1e4,
        onload: (response) => {
          try {
            const apiResponse = JSON.parse(response.responseText);
            resolve(apiResponse);
          } catch (e) {
            resolve(handleError$1("解析出错"));
          }
        },
        onerror: () => resolve(handleError$1("服务器维护中..自动刷课功能正常使用")),
        ontimeout: () => resolve(handleError$1("请求超时"))
      });
    });
  };
  const getAIAnswer = async (question) => {
    const url2 = getApiBaseUrl() + "/ai/answer";
    const setting = useSettingStore();
    const headers = {
      "Content-Type": "application/json"
    };
    const data = JSON.stringify({
      question: question.title,
      options: question.optionsText,
      type: question.type,
      token: setting.config.basicConfig.token.value
    });
    console.log("data", data);
    await sleep(setting.config.basicConfig.reqIntervalTime.value);
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        url: url2,
        method: "POST",
        headers,
        data,
        timeout: 15e3,
        onload: (response) => {
          try {
            const apiResponse = JSON.parse(response.responseText);
            resolve(apiResponse);
          } catch (e) {
            resolve(handleError$1("解析出错"));
          }
        },
        onerror: () => resolve(handleError$1("服务器维护中..自动刷课功能正常使用")),
        ontimeout: () => resolve(handleError$1("请求超时"))
      });
    });
  };
  const _hoisted_1$3 = { class: "online-search-wrap" };
  const _hoisted_2$2 = { class: "tips" };
  const _hoisted_3$1 = { class: "config" };
  const _hoisted_4$1 = { class: "config-input" };
  const _hoisted_5$1 = { class: "searth-input-wrap" };
  const _hoisted_6$1 = { class: "searth-input" };
  const _hoisted_7$1 = { class: "search-btn" };
  const _hoisted_8$1 = { class: "result-list" };
  const _hoisted_9$1 = ["innerHTML"];
  const _hoisted_10 = ["innerHTML"];
  const _hoisted_11 = ["innerHTML"];
  const _hoisted_12 = {
    key: 0,
    style: { "text-align": "center", "font-size": "15px" }
  };
  const _sfc_main$4 = {
    __name: "OnlineSearch",
    emits: ["changeTab"],
    setup(__props, { emit: __emit }) {
      const [messageApi, contextHolder] = Antd.message.useMessage();
      const setting = useSettingStore();
      const questionStore = useQuestionStore();
      const { searchText } = pinia.storeToRefs(questionStore);
      const errInfo = vue.ref("");
      const isLoading = vue.ref(false);
      const isComposing = vue.ref(false);
      const emit = __emit;
      const goSetting = () => {
        emit("changeTab", "4");
      };
      const typeMap = {
        单选题: "0",
        多选题: "1",
        填空题: "2",
        判断题: "3",
        简答题: "4",
        问答题: "4",
        名词解释: "5",
        论述题: "6",
        计算题: "7",
        分录题: "9",
        资料题: "10",
        连线题: "11",
        匹配题: "11",
        排序题: "13",
        完型填空: "14",
        完形填空题: "14",
        阅读理解: "15",
        程序题: "17",
        口语题: "18",
        听力题: "19",
        共用选项题: "20",
        测评题: "21",
        钟表题: "23",
        选词填空: "24",
        选做题: "25",
        其它: "8"
      };
      const getTypeByCode = vue.computed(() => {
        return function(type) {
          let key = Object.keys(typeMap).find((key2) => typeMap[key2] === String(type));
          return key || "";
        };
      });
      const answerJoin = vue.computed(() => {
        return function(answerList) {
          try {
            return JSON.parse(answerList).join(";");
          } catch {
            return answerList;
          }
        };
      });
      const { fuzzySearchResult } = pinia.storeToRefs(questionStore);
      const fuzzySearch = async (e) => {
        e.preventDefault();
        if (!setting.config.basicConfig.token.value) {
          messageApi.info("未配置密钥，请先前往“设置”模块填写密钥..");
          return;
        }
        if (!searchText.value || isComposing.value) return;
        if (searchText.value) {
          errInfo.value = "";
          questionStore.clearFuzzySearchResult();
          isLoading.value = true;
          const res = await fetchFuzzySearch(searchText.value);
          isLoading.value = false;
          if (res.code === 1) {
            const {
              data: { items }
            } = res;
            questionStore.fuzzySearchResult = items;
          } else {
            errInfo.value = res.msg;
          }
        } else {
          messageApi.info("请输入题目..");
        }
      };
      return (_ctx, _cache) => {
        const _component_a_button = vue.resolveComponent("a-button");
        const _component_a_switch = vue.resolveComponent("a-switch");
        const _component_a_textarea = vue.resolveComponent("a-textarea");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$3, [
          vue.createVNode(vue.unref(contextHolder)),
          vue.createElementVNode("div", _hoisted_2$2, [
            vue.createElementVNode("ul", null, [
              vue.createElementVNode("li", null, [
                _cache[5] || (_cache[5] = vue.createTextVNode(" 使用在线搜题前，请先前往 ")),
                vue.createVNode(_component_a_button, {
                  onClick: goSetting,
                  size: "small",
                  type: "primary"
                }, {
                  icon: vue.withCtx(() => [
                    vue.createVNode(vue.unref(SettingOutlined))
                  ]),
                  default: vue.withCtx(() => [
                    _cache[4] || (_cache[4] = vue.createTextVNode("配置密钥 "))
                  ]),
                  _: 1
                })
              ]),
              _cache[6] || (_cache[6] = vue.createElementVNode("li", null, "如需手动答题，建议关闭自动切换功能，防止操作冲突", -1))
            ])
          ]),
          vue.createElementVNode("div", _hoisted_3$1, [
            _cache[7] || (_cache[7] = vue.createElementVNode("div", { class: "config-name" }, "划词搜题", -1)),
            vue.createElementVNode("div", _hoisted_4$1, [
              vue.createVNode(_component_a_switch, {
                size: "small",
                checked: vue.unref(setting).config.searchConfig.searchBySelectedText.value,
                "onUpdate:checked": _cache[0] || (_cache[0] = ($event) => vue.unref(setting).config.searchConfig.searchBySelectedText.value = $event)
              }, null, 8, ["checked"])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_5$1, [
            _cache[8] || (_cache[8] = vue.createElementVNode("div", { class: "title" }, "搜索题目", -1)),
            vue.createElementVNode("div", _hoisted_6$1, [
              vue.createVNode(_component_a_textarea, {
                onKeydown: vue.withKeys(vue.withModifiers(fuzzySearch, ["exact"]), ["enter"]),
                onCompositionstart: _cache[1] || (_cache[1] = ($event) => isComposing.value = true),
                onCompositionend: _cache[2] || (_cache[2] = ($event) => isComposing.value = false),
                value: vue.unref(searchText),
                "onUpdate:value": _cache[3] || (_cache[3] = ($event) => vue.isRef(searchText) ? searchText.value = $event : null),
                placeholder: "请输入题目",
                rows: 4
              }, null, 8, ["onKeydown", "value"])
            ])
          ]),
          vue.createElementVNode("div", _hoisted_7$1, [
            vue.createVNode(_component_a_button, {
              onClick: fuzzySearch,
              style: { "width": "120px" },
              type: "primary",
              size: "small"
            }, {
              default: vue.withCtx(() => _cache[9] || (_cache[9] = [
                vue.createTextVNode("搜索")
              ])),
              _: 1
            })
          ]),
          vue.createElementVNode("div", _hoisted_8$1, [
            vue.createElementVNode("div", { innerHTML: errInfo.value }, null, 8, _hoisted_9$1),
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(vue.unref(fuzzySearchResult), (result, index) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                class: "result-item",
                key: index
              }, [
                vue.createElementVNode("div", null, [
                  vue.createElementVNode("span", null, vue.toDisplayString(`${index + 1}.【${getTypeByCode.value(result.type)}】`), 1),
                  vue.createElementVNode("span", {
                    innerHTML: result.title
                  }, null, 8, _hoisted_10)
                ]),
                vue.createElementVNode("div", null, [
                  (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(JSON.parse(result.options), (option, index2) => {
                    return vue.openBlock(), vue.createElementBlock("div", { key: index2 }, [
                      vue.createElementVNode("span", null, vue.toDisplayString(String.fromCharCode(65 + index2)) + ".", 1),
                      vue.createElementVNode("span", null, vue.toDisplayString(option), 1)
                    ]);
                  }), 128))
                ]),
                vue.createElementVNode("div", {
                  class: "result-answer",
                  innerHTML: answerJoin.value(result.answer)
                }, null, 8, _hoisted_11)
              ]);
            }), 128)),
            isLoading.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_12, [
              _cache[10] || (_cache[10] = vue.createElementVNode("span", { style: { "margin-right": "10px" } }, "搜索中", -1)),
              vue.createVNode(vue.unref(LoadingOutlined))
            ])) : vue.createCommentVNode("", true)
          ])
        ]);
      };
    }
  };
  function L() {
    return { async: false, breaks: false, extensions: null, gfm: true, hooks: null, pedantic: false, renderer: null, silent: false, tokenizer: null, walkTokens: null };
  }
  var O = L();
  function H(l3) {
    O = l3;
  }
  var E = { exec: () => null };
  function h(l3, e = "") {
    let t = typeof l3 == "string" ? l3 : l3.source, n = { replace: (r, i) => {
      let s = typeof i == "string" ? i : i.source;
      return s = s.replace(m.caret, "$1"), t = t.replace(r, s), n;
    }, getRegex: () => new RegExp(t, e) };
    return n;
  }
  var m = { codeRemoveIndent: /^(?: {1,4}| {0,3}\t)/gm, outputLinkReplace: /\\([\[\]])/g, indentCodeCompensation: /^(\s+)(?:```)/, beginningSpace: /^\s+/, endingHash: /#$/, startingSpaceChar: /^ /, endingSpaceChar: / $/, nonSpaceChar: /[^ ]/, newLineCharGlobal: /\n/g, tabCharGlobal: /\t/g, multipleSpaceGlobal: /\s+/g, blankLine: /^[ \t]*$/, doubleBlankLine: /\n[ \t]*\n[ \t]*$/, blockquoteStart: /^ {0,3}>/, blockquoteSetextReplace: /\n {0,3}((?:=+|-+) *)(?=\n|$)/g, blockquoteSetextReplace2: /^ {0,3}>[ \t]?/gm, listReplaceTabs: /^\t+/, listReplaceNesting: /^ {1,4}(?=( {4})*[^ ])/g, listIsTask: /^\[[ xX]\] /, listReplaceTask: /^\[[ xX]\] +/, anyLine: /\n.*\n/, hrefBrackets: /^<(.*)>$/, tableDelimiter: /[:|]/, tableAlignChars: /^\||\| *$/g, tableRowBlankLine: /\n[ \t]*$/, tableAlignRight: /^ *-+: *$/, tableAlignCenter: /^ *:-+: *$/, tableAlignLeft: /^ *:-+ *$/, startATag: /^<a /i, endATag: /^<\/a>/i, startPreScriptTag: /^<(pre|code|kbd|script)(\s|>)/i, endPreScriptTag: /^<\/(pre|code|kbd|script)(\s|>)/i, startAngleBracket: /^</, endAngleBracket: />$/, pedanticHrefTitle: /^([^'"]*[^\s])\s+(['"])(.*)\2/, unicodeAlphaNumeric: /[\p{L}\p{N}]/u, escapeTest: /[&<>"']/, escapeReplace: /[&<>"']/g, escapeTestNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/, escapeReplaceNoEncode: /[<>"']|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/g, unescapeTest: /&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/ig, caret: /(^|[^\[])\^/g, percentDecode: /%25/g, findPipe: /\|/g, splitPipe: / \|/, slashPipe: /\\\|/g, carriageReturn: /\r\n|\r/g, spaceLine: /^ +$/gm, notSpaceStart: /^\S*/, endingNewline: /\n$/, listItemRegex: (l3) => new RegExp(`^( {0,3}${l3})((?:[	 ][^\\n]*)?(?:\\n|$))`), nextBulletRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}(?:[*+-]|\\d{1,9}[.)])((?:[ 	][^\\n]*)?(?:\\n|$))`), hrRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}((?:- *){3,}|(?:_ *){3,}|(?:\\* *){3,})(?:\\n+|$)`), fencesBeginRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}(?:\`\`\`|~~~)`), headingBeginRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}#`), htmlBeginRegex: (l3) => new RegExp(`^ {0,${Math.min(3, l3 - 1)}}<(?:[a-z].*>|!--)`, "i") }, xe = /^(?:[ \t]*(?:\n|$))+/, be = /^((?: {4}| {0,3}\t)[^\n]+(?:\n(?:[ \t]*(?:\n|$))*)?)+/, Re = /^ {0,3}(`{3,}(?=[^`\n]*(?:\n|$))|~{3,})([^\n]*)(?:\n|$)(?:|([\s\S]*?)(?:\n|$))(?: {0,3}\1[~`]* *(?=\n|$)|$)/, C = /^ {0,3}((?:-[\t ]*){3,}|(?:_[ \t]*){3,}|(?:\*[ \t]*){3,})(?:\n+|$)/, Oe = /^ {0,3}(#{1,6})(?=\s|$)(.*)(?:\n+|$)/, j = /(?:[*+-]|\d{1,9}[.)])/, se = /^(?!bull |blockCode|fences|blockquote|heading|html|table)((?:.|\n(?!\s*?\n|bull |blockCode|fences|blockquote|heading|html|table))+?)\n {0,3}(=+|-+) *(?:\n+|$)/, ie = h(se).replace(/bull/g, j).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/\|table/g, "").getRegex(), Te = h(se).replace(/bull/g, j).replace(/blockCode/g, /(?: {4}| {0,3}\t)/).replace(/fences/g, / {0,3}(?:`{3,}|~{3,})/).replace(/blockquote/g, / {0,3}>/).replace(/heading/g, / {0,3}#{1,6}/).replace(/html/g, / {0,3}<[^\n>]+>\n/).replace(/table/g, / {0,3}\|?(?:[:\- ]*\|)+[\:\- ]*\n/).getRegex(), F = /^([^\n]+(?:\n(?!hr|heading|lheading|blockquote|fences|list|html|table| +\n)[^\n]+)*)/, we = /^[^\n]+/, Q = /(?!\s*\])(?:\\.|[^\[\]\\])+/, ye = h(/^ {0,3}\[(label)\]: *(?:\n[ \t]*)?([^<\s][^\s]*|<.*?>)(?:(?: +(?:\n[ \t]*)?| *\n[ \t]*)(title))? *(?:\n+|$)/).replace("label", Q).replace("title", /(?:"(?:\\"?|[^"\\])*"|'[^'\n]*(?:\n[^'\n]+)*\n?'|\([^()]*\))/).getRegex(), Pe = h(/^( {0,3}bull)([ \t][^\n]+?)?(?:\n|$)/).replace(/bull/g, j).getRegex(), v = "address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h[1-6]|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|meta|nav|noframes|ol|optgroup|option|p|param|search|section|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul", U = /<!--(?:-?>|[\s\S]*?(?:-->|$))/, Se = h("^ {0,3}(?:<(script|pre|style|textarea)[\\s>][\\s\\S]*?(?:</\\1>[^\\n]*\\n+|$)|comment[^\\n]*(\\n+|$)|<\\?[\\s\\S]*?(?:\\?>\\n*|$)|<![A-Z][\\s\\S]*?(?:>\\n*|$)|<!\\[CDATA\\[[\\s\\S]*?(?:\\]\\]>\\n*|$)|</?(tag)(?: +|\\n|/?>)[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|<(?!script|pre|style|textarea)([a-z][\\w-]*)(?:attribute)*? */?>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$)|</(?!script|pre|style|textarea)[a-z][\\w-]*\\s*>(?=[ \\t]*(?:\\n|$))[\\s\\S]*?(?:(?:\\n[ 	]*)+\\n|$))", "i").replace("comment", U).replace("tag", v).replace("attribute", / +[a-zA-Z:_][\w.:-]*(?: *= *"[^"\n]*"| *= *'[^'\n]*'| *= *[^\s"'=<>`]+)?/).getRegex(), oe = h(F).replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("|table", "").replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex(), $e = h(/^( {0,3}> ?(paragraph|[^\n]*)(?:\n|$))+/).replace("paragraph", oe).getRegex(), K = { blockquote: $e, code: be, def: ye, fences: Re, heading: Oe, hr: C, html: Se, lheading: ie, list: Pe, newline: xe, paragraph: oe, table: E, text: we }, re = h("^ *([^\\n ].*)\\n {0,3}((?:\\| *)?:?-+:? *(?:\\| *:?-+:? *)*(?:\\| *)?)(?:\\n((?:(?! *\\n|hr|heading|blockquote|code|fences|list|html).*(?:\\n|$))*)\\n*|$)").replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("blockquote", " {0,3}>").replace("code", "(?: {4}| {0,3}	)[^\\n]").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex(), _e = { ...K, lheading: Te, table: re, paragraph: h(F).replace("hr", C).replace("heading", " {0,3}#{1,6}(?:\\s|$)").replace("|lheading", "").replace("table", re).replace("blockquote", " {0,3}>").replace("fences", " {0,3}(?:`{3,}(?=[^`\\n]*\\n)|~{3,})[^\\n]*\\n").replace("list", " {0,3}(?:[*+-]|1[.)]) ").replace("html", "</?(?:tag)(?: +|\\n|/?>)|<(?:script|pre|style|textarea|!--)").replace("tag", v).getRegex() }, Le = { ...K, html: h(`^ *(?:comment *(?:\\n|\\s*$)|<(tag)[\\s\\S]+?</\\1> *(?:\\n{2,}|\\s*$)|<tag(?:"[^"]*"|'[^']*'|\\s[^'"/>\\s]*)*?/?> *(?:\\n{2,}|\\s*$))`).replace("comment", U).replace(/tag/g, "(?!(?:a|em|strong|small|s|cite|q|dfn|abbr|data|time|code|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo|span|br|wbr|ins|del|img)\\b)\\w+(?!:|[^\\w\\s@]*@)\\b").getRegex(), def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +(["(][^\n]+[")]))? *(?:\n+|$)/, heading: /^(#{1,6})(.*)(?:\n+|$)/, fences: E, lheading: /^(.+?)\n {0,3}(=+|-+) *(?:\n+|$)/, paragraph: h(F).replace("hr", C).replace("heading", ` *#{1,6} *[^
]`).replace("lheading", ie).replace("|table", "").replace("blockquote", " {0,3}>").replace("|fences", "").replace("|list", "").replace("|html", "").replace("|tag", "").getRegex() }, Me = /^\\([!"#$%&'()*+,\-./:;<=>?@\[\]\\^_`{|}~])/, ze = /^(`+)([^`]|[^`][\s\S]*?[^`])\1(?!`)/, ae = /^( {2,}|\\)\n(?!\s*$)/, Ae = /^(`+|[^`])(?:(?= {2,}\n)|[\s\S]*?(?:(?=[\\<!\[`*_]|\b_|$)|[^ ](?= {2,}\n)))/, D = /[\p{P}\p{S}]/u, X = /[\s\p{P}\p{S}]/u, le = /[^\s\p{P}\p{S}]/u, Ee = h(/^((?![*_])punctSpace)/, "u").replace(/punctSpace/g, X).getRegex(), ue = /(?!~)[\p{P}\p{S}]/u, Ce = /(?!~)[\s\p{P}\p{S}]/u, Ie = /(?:[^\s\p{P}\p{S}]|~)/u, Be = /\[[^[\]]*?\]\((?:\\.|[^\\\(\)]|\((?:\\.|[^\\\(\)])*\))*\)|`[^`]*?`|<(?! )[^<>]*?>/g, pe = /^(?:\*+(?:((?!\*)punct)|[^\s*]))|^_+(?:((?!_)punct)|([^\s_]))/, qe = h(pe, "u").replace(/punct/g, D).getRegex(), ve = h(pe, "u").replace(/punct/g, ue).getRegex(), ce = "^[^_*]*?__[^_*]*?\\*[^_*]*?(?=__)|[^*]+(?=[^*])|(?!\\*)punct(\\*+)(?=[\\s]|$)|notPunctSpace(\\*+)(?!\\*)(?=punctSpace|$)|(?!\\*)punctSpace(\\*+)(?=notPunctSpace)|[\\s](\\*+)(?!\\*)(?=punct)|(?!\\*)punct(\\*+)(?!\\*)(?=punct)|notPunctSpace(\\*+)(?=notPunctSpace)", De = h(ce, "gu").replace(/notPunctSpace/g, le).replace(/punctSpace/g, X).replace(/punct/g, D).getRegex(), Ze = h(ce, "gu").replace(/notPunctSpace/g, Ie).replace(/punctSpace/g, Ce).replace(/punct/g, ue).getRegex(), Ge = h("^[^_*]*?\\*\\*[^_*]*?_[^_*]*?(?=\\*\\*)|[^_]+(?=[^_])|(?!_)punct(_+)(?=[\\s]|$)|notPunctSpace(_+)(?!_)(?=punctSpace|$)|(?!_)punctSpace(_+)(?=notPunctSpace)|[\\s](_+)(?!_)(?=punct)|(?!_)punct(_+)(?!_)(?=punct)", "gu").replace(/notPunctSpace/g, le).replace(/punctSpace/g, X).replace(/punct/g, D).getRegex(), He = h(/\\(punct)/, "gu").replace(/punct/g, D).getRegex(), Ne = h(/^<(scheme:[^\s\x00-\x1f<>]*|email)>/).replace("scheme", /[a-zA-Z][a-zA-Z0-9+.-]{1,31}/).replace("email", /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(@)[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+(?![-_])/).getRegex(), je = h(U).replace("(?:-->|$)", "-->").getRegex(), Fe = h("^comment|^</[a-zA-Z][\\w:-]*\\s*>|^<[a-zA-Z][\\w-]*(?:attribute)*?\\s*/?>|^<\\?[\\s\\S]*?\\?>|^<![a-zA-Z]+\\s[\\s\\S]*?>|^<!\\[CDATA\\[[\\s\\S]*?\\]\\]>").replace("comment", je).replace("attribute", /\s+[a-zA-Z:_][\w.:-]*(?:\s*=\s*"[^"]*"|\s*=\s*'[^']*'|\s*=\s*[^\s"'=<>`]+)?/).getRegex(), q = /(?:\[(?:\\.|[^\[\]\\])*\]|\\.|`[^`]*`|[^\[\]\\`])*?/, Qe = h(/^!?\[(label)\]\(\s*(href)(?:(?:[ \t]*(?:\n[ \t]*)?)(title))?\s*\)/).replace("label", q).replace("href", /<(?:\\.|[^\n<>\\])+>|[^ \t\n\x00-\x1f]*/).replace("title", /"(?:\\"?|[^"\\])*"|'(?:\\'?|[^'\\])*'|\((?:\\\)?|[^)\\])*\)/).getRegex(), he = h(/^!?\[(label)\]\[(ref)\]/).replace("label", q).replace("ref", Q).getRegex(), de = h(/^!?\[(ref)\](?:\[\])?/).replace("ref", Q).getRegex(), Ue = h("reflink|nolink(?!\\()", "g").replace("reflink", he).replace("nolink", de).getRegex(), W = { _backpedal: E, anyPunctuation: He, autolink: Ne, blockSkip: Be, br: ae, code: ze, del: E, emStrongLDelim: qe, emStrongRDelimAst: De, emStrongRDelimUnd: Ge, escape: Me, link: Qe, nolink: de, punctuation: Ee, reflink: he, reflinkSearch: Ue, tag: Fe, text: Ae, url: E }, Ke = { ...W, link: h(/^!?\[(label)\]\((.*?)\)/).replace("label", q).getRegex(), reflink: h(/^!?\[(label)\]\s*\[([^\]]*)\]/).replace("label", q).getRegex() }, N = { ...W, emStrongRDelimAst: Ze, emStrongLDelim: ve, url: h(/^((?:ftp|https?):\/\/|www\.)(?:[a-zA-Z0-9\-]+\.?)+[^\s<]*|^email/, "i").replace("email", /[A-Za-z0-9._+-]+(@)[a-zA-Z0-9-_]+(?:\.[a-zA-Z0-9-_]*[a-zA-Z0-9])+(?![-_])/).getRegex(), _backpedal: /(?:[^?!.,:;*_'"~()&]+|\([^)]*\)|&(?![a-zA-Z0-9]+;$)|[?!.,:;*_'"~)]+(?!$))+/, del: /^(~~?)(?=[^\s~])((?:\\.|[^\\])*?(?:\\.|[^\s~\\]))\1(?=[^~]|$)/, text: /^([`~]+|[^`~])(?:(?= {2,}\n)|(?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)|[\s\S]*?(?:(?=[\\<!\[`*~_]|\b_|https?:\/\/|ftp:\/\/|www\.|$)|[^ ](?= {2,}\n)|[^a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-](?=[a-zA-Z0-9.!#$%&'*+\/=?_`{\|}~-]+@)))/ }, Xe = { ...N, br: h(ae).replace("{2,}", "*").getRegex(), text: h(N.text).replace("\\b_", "\\b_| {2,}\\n").replace(/\{2,\}/g, "*").getRegex() }, I = { normal: K, gfm: _e, pedantic: Le }, M = { normal: W, gfm: N, breaks: Xe, pedantic: Ke };
  var We = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }, ke = (l3) => We[l3];
  function w(l3, e) {
    if (e) {
      if (m.escapeTest.test(l3)) return l3.replace(m.escapeReplace, ke);
    } else if (m.escapeTestNoEncode.test(l3)) return l3.replace(m.escapeReplaceNoEncode, ke);
    return l3;
  }
  function J(l3) {
    try {
      l3 = encodeURI(l3).replace(m.percentDecode, "%");
    } catch {
      return null;
    }
    return l3;
  }
  function V(l3, e) {
    var _a2;
    let t = l3.replace(m.findPipe, (i, s, o) => {
      let a = false, u = s;
      for (; --u >= 0 && o[u] === "\\"; ) a = !a;
      return a ? "|" : " |";
    }), n = t.split(m.splitPipe), r = 0;
    if (n[0].trim() || n.shift(), n.length > 0 && !((_a2 = n.at(-1)) == null ? void 0 : _a2.trim()) && n.pop(), e) if (n.length > e) n.splice(e);
    else for (; n.length < e; ) n.push("");
    for (; r < n.length; r++) n[r] = n[r].trim().replace(m.slashPipe, "|");
    return n;
  }
  function z(l3, e, t) {
    let n = l3.length;
    if (n === 0) return "";
    let r = 0;
    for (; r < n; ) {
      let i = l3.charAt(n - r - 1);
      if (i === e && !t) r++;
      else if (i !== e && t) r++;
      else break;
    }
    return l3.slice(0, n - r);
  }
  function ge(l3, e) {
    if (l3.indexOf(e[1]) === -1) return -1;
    let t = 0;
    for (let n = 0; n < l3.length; n++) if (l3[n] === "\\") n++;
    else if (l3[n] === e[0]) t++;
    else if (l3[n] === e[1] && (t--, t < 0)) return n;
    return t > 0 ? -2 : -1;
  }
  function fe(l3, e, t, n, r) {
    let i = e.href, s = e.title || null, o = l3[1].replace(r.other.outputLinkReplace, "$1");
    n.state.inLink = true;
    let a = { type: l3[0].charAt(0) === "!" ? "image" : "link", raw: t, href: i, title: s, text: o, tokens: n.inlineTokens(o) };
    return n.state.inLink = false, a;
  }
  function Je(l3, e, t) {
    let n = l3.match(t.other.indentCodeCompensation);
    if (n === null) return e;
    let r = n[1];
    return e.split(`
`).map((i) => {
      let s = i.match(t.other.beginningSpace);
      if (s === null) return i;
      let [o] = s;
      return o.length >= r.length ? i.slice(r.length) : i;
    }).join(`
`);
  }
  var y = class {
    constructor(e) {
      __publicField(this, "options");
      __publicField(this, "rules");
      __publicField(this, "lexer");
      this.options = e || O;
    }
    space(e) {
      let t = this.rules.block.newline.exec(e);
      if (t && t[0].length > 0) return { type: "space", raw: t[0] };
    }
    code(e) {
      let t = this.rules.block.code.exec(e);
      if (t) {
        let n = t[0].replace(this.rules.other.codeRemoveIndent, "");
        return { type: "code", raw: t[0], codeBlockStyle: "indented", text: this.options.pedantic ? n : z(n, `
`) };
      }
    }
    fences(e) {
      let t = this.rules.block.fences.exec(e);
      if (t) {
        let n = t[0], r = Je(n, t[3] || "", this.rules);
        return { type: "code", raw: n, lang: t[2] ? t[2].trim().replace(this.rules.inline.anyPunctuation, "$1") : t[2], text: r };
      }
    }
    heading(e) {
      let t = this.rules.block.heading.exec(e);
      if (t) {
        let n = t[2].trim();
        if (this.rules.other.endingHash.test(n)) {
          let r = z(n, "#");
          (this.options.pedantic || !r || this.rules.other.endingSpaceChar.test(r)) && (n = r.trim());
        }
        return { type: "heading", raw: t[0], depth: t[1].length, text: n, tokens: this.lexer.inline(n) };
      }
    }
    hr(e) {
      let t = this.rules.block.hr.exec(e);
      if (t) return { type: "hr", raw: z(t[0], `
`) };
    }
    blockquote(e) {
      let t = this.rules.block.blockquote.exec(e);
      if (t) {
        let n = z(t[0], `
`).split(`
`), r = "", i = "", s = [];
        for (; n.length > 0; ) {
          let o = false, a = [], u;
          for (u = 0; u < n.length; u++) if (this.rules.other.blockquoteStart.test(n[u])) a.push(n[u]), o = true;
          else if (!o) a.push(n[u]);
          else break;
          n = n.slice(u);
          let p = a.join(`
`), c = p.replace(this.rules.other.blockquoteSetextReplace, `
    $1`).replace(this.rules.other.blockquoteSetextReplace2, "");
          r = r ? `${r}
${p}` : p, i = i ? `${i}
${c}` : c;
          let f = this.lexer.state.top;
          if (this.lexer.state.top = true, this.lexer.blockTokens(c, s, true), this.lexer.state.top = f, n.length === 0) break;
          let k = s.at(-1);
          if ((k == null ? void 0 : k.type) === "code") break;
          if ((k == null ? void 0 : k.type) === "blockquote") {
            let x = k, g = x.raw + `
` + n.join(`
`), T = this.blockquote(g);
            s[s.length - 1] = T, r = r.substring(0, r.length - x.raw.length) + T.raw, i = i.substring(0, i.length - x.text.length) + T.text;
            break;
          } else if ((k == null ? void 0 : k.type) === "list") {
            let x = k, g = x.raw + `
` + n.join(`
`), T = this.list(g);
            s[s.length - 1] = T, r = r.substring(0, r.length - k.raw.length) + T.raw, i = i.substring(0, i.length - x.raw.length) + T.raw, n = g.substring(s.at(-1).raw.length).split(`
`);
            continue;
          }
        }
        return { type: "blockquote", raw: r, tokens: s, text: i };
      }
    }
    list(e) {
      let t = this.rules.block.list.exec(e);
      if (t) {
        let n = t[1].trim(), r = n.length > 1, i = { type: "list", raw: "", ordered: r, start: r ? +n.slice(0, -1) : "", loose: false, items: [] };
        n = r ? `\\d{1,9}\\${n.slice(-1)}` : `\\${n}`, this.options.pedantic && (n = r ? n : "[*+-]");
        let s = this.rules.other.listItemRegex(n), o = false;
        for (; e; ) {
          let u = false, p = "", c = "";
          if (!(t = s.exec(e)) || this.rules.block.hr.test(e)) break;
          p = t[0], e = e.substring(p.length);
          let f = t[2].split(`
`, 1)[0].replace(this.rules.other.listReplaceTabs, (Z) => " ".repeat(3 * Z.length)), k = e.split(`
`, 1)[0], x = !f.trim(), g = 0;
          if (this.options.pedantic ? (g = 2, c = f.trimStart()) : x ? g = t[1].length + 1 : (g = t[2].search(this.rules.other.nonSpaceChar), g = g > 4 ? 1 : g, c = f.slice(g), g += t[1].length), x && this.rules.other.blankLine.test(k) && (p += k + `
`, e = e.substring(k.length + 1), u = true), !u) {
            let Z = this.rules.other.nextBulletRegex(g), ee = this.rules.other.hrRegex(g), te = this.rules.other.fencesBeginRegex(g), ne = this.rules.other.headingBeginRegex(g), me = this.rules.other.htmlBeginRegex(g);
            for (; e; ) {
              let G = e.split(`
`, 1)[0], A;
              if (k = G, this.options.pedantic ? (k = k.replace(this.rules.other.listReplaceNesting, "  "), A = k) : A = k.replace(this.rules.other.tabCharGlobal, "    "), te.test(k) || ne.test(k) || me.test(k) || Z.test(k) || ee.test(k)) break;
              if (A.search(this.rules.other.nonSpaceChar) >= g || !k.trim()) c += `
` + A.slice(g);
              else {
                if (x || f.replace(this.rules.other.tabCharGlobal, "    ").search(this.rules.other.nonSpaceChar) >= 4 || te.test(f) || ne.test(f) || ee.test(f)) break;
                c += `
` + k;
              }
              !x && !k.trim() && (x = true), p += G + `
`, e = e.substring(G.length + 1), f = A.slice(g);
            }
          }
          i.loose || (o ? i.loose = true : this.rules.other.doubleBlankLine.test(p) && (o = true));
          let T = null, Y;
          this.options.gfm && (T = this.rules.other.listIsTask.exec(c), T && (Y = T[0] !== "[ ] ", c = c.replace(this.rules.other.listReplaceTask, ""))), i.items.push({ type: "list_item", raw: p, task: !!T, checked: Y, loose: false, text: c, tokens: [] }), i.raw += p;
        }
        let a = i.items.at(-1);
        if (a) a.raw = a.raw.trimEnd(), a.text = a.text.trimEnd();
        else return;
        i.raw = i.raw.trimEnd();
        for (let u = 0; u < i.items.length; u++) if (this.lexer.state.top = false, i.items[u].tokens = this.lexer.blockTokens(i.items[u].text, []), !i.loose) {
          let p = i.items[u].tokens.filter((f) => f.type === "space"), c = p.length > 0 && p.some((f) => this.rules.other.anyLine.test(f.raw));
          i.loose = c;
        }
        if (i.loose) for (let u = 0; u < i.items.length; u++) i.items[u].loose = true;
        return i;
      }
    }
    html(e) {
      let t = this.rules.block.html.exec(e);
      if (t) return { type: "html", block: true, raw: t[0], pre: t[1] === "pre" || t[1] === "script" || t[1] === "style", text: t[0] };
    }
    def(e) {
      let t = this.rules.block.def.exec(e);
      if (t) {
        let n = t[1].toLowerCase().replace(this.rules.other.multipleSpaceGlobal, " "), r = t[2] ? t[2].replace(this.rules.other.hrefBrackets, "$1").replace(this.rules.inline.anyPunctuation, "$1") : "", i = t[3] ? t[3].substring(1, t[3].length - 1).replace(this.rules.inline.anyPunctuation, "$1") : t[3];
        return { type: "def", tag: n, raw: t[0], href: r, title: i };
      }
    }
    table(e) {
      var _a2;
      let t = this.rules.block.table.exec(e);
      if (!t || !this.rules.other.tableDelimiter.test(t[2])) return;
      let n = V(t[1]), r = t[2].replace(this.rules.other.tableAlignChars, "").split("|"), i = ((_a2 = t[3]) == null ? void 0 : _a2.trim()) ? t[3].replace(this.rules.other.tableRowBlankLine, "").split(`
`) : [], s = { type: "table", raw: t[0], header: [], align: [], rows: [] };
      if (n.length === r.length) {
        for (let o of r) this.rules.other.tableAlignRight.test(o) ? s.align.push("right") : this.rules.other.tableAlignCenter.test(o) ? s.align.push("center") : this.rules.other.tableAlignLeft.test(o) ? s.align.push("left") : s.align.push(null);
        for (let o = 0; o < n.length; o++) s.header.push({ text: n[o], tokens: this.lexer.inline(n[o]), header: true, align: s.align[o] });
        for (let o of i) s.rows.push(V(o, s.header.length).map((a, u) => ({ text: a, tokens: this.lexer.inline(a), header: false, align: s.align[u] })));
        return s;
      }
    }
    lheading(e) {
      let t = this.rules.block.lheading.exec(e);
      if (t) return { type: "heading", raw: t[0], depth: t[2].charAt(0) === "=" ? 1 : 2, text: t[1], tokens: this.lexer.inline(t[1]) };
    }
    paragraph(e) {
      let t = this.rules.block.paragraph.exec(e);
      if (t) {
        let n = t[1].charAt(t[1].length - 1) === `
` ? t[1].slice(0, -1) : t[1];
        return { type: "paragraph", raw: t[0], text: n, tokens: this.lexer.inline(n) };
      }
    }
    text(e) {
      let t = this.rules.block.text.exec(e);
      if (t) return { type: "text", raw: t[0], text: t[0], tokens: this.lexer.inline(t[0]) };
    }
    escape(e) {
      let t = this.rules.inline.escape.exec(e);
      if (t) return { type: "escape", raw: t[0], text: t[1] };
    }
    tag(e) {
      let t = this.rules.inline.tag.exec(e);
      if (t) return !this.lexer.state.inLink && this.rules.other.startATag.test(t[0]) ? this.lexer.state.inLink = true : this.lexer.state.inLink && this.rules.other.endATag.test(t[0]) && (this.lexer.state.inLink = false), !this.lexer.state.inRawBlock && this.rules.other.startPreScriptTag.test(t[0]) ? this.lexer.state.inRawBlock = true : this.lexer.state.inRawBlock && this.rules.other.endPreScriptTag.test(t[0]) && (this.lexer.state.inRawBlock = false), { type: "html", raw: t[0], inLink: this.lexer.state.inLink, inRawBlock: this.lexer.state.inRawBlock, block: false, text: t[0] };
    }
    link(e) {
      let t = this.rules.inline.link.exec(e);
      if (t) {
        let n = t[2].trim();
        if (!this.options.pedantic && this.rules.other.startAngleBracket.test(n)) {
          if (!this.rules.other.endAngleBracket.test(n)) return;
          let s = z(n.slice(0, -1), "\\");
          if ((n.length - s.length) % 2 === 0) return;
        } else {
          let s = ge(t[2], "()");
          if (s === -2) return;
          if (s > -1) {
            let a = (t[0].indexOf("!") === 0 ? 5 : 4) + t[1].length + s;
            t[2] = t[2].substring(0, s), t[0] = t[0].substring(0, a).trim(), t[3] = "";
          }
        }
        let r = t[2], i = "";
        if (this.options.pedantic) {
          let s = this.rules.other.pedanticHrefTitle.exec(r);
          s && (r = s[1], i = s[3]);
        } else i = t[3] ? t[3].slice(1, -1) : "";
        return r = r.trim(), this.rules.other.startAngleBracket.test(r) && (this.options.pedantic && !this.rules.other.endAngleBracket.test(n) ? r = r.slice(1) : r = r.slice(1, -1)), fe(t, { href: r && r.replace(this.rules.inline.anyPunctuation, "$1"), title: i && i.replace(this.rules.inline.anyPunctuation, "$1") }, t[0], this.lexer, this.rules);
      }
    }
    reflink(e, t) {
      let n;
      if ((n = this.rules.inline.reflink.exec(e)) || (n = this.rules.inline.nolink.exec(e))) {
        let r = (n[2] || n[1]).replace(this.rules.other.multipleSpaceGlobal, " "), i = t[r.toLowerCase()];
        if (!i) {
          let s = n[0].charAt(0);
          return { type: "text", raw: s, text: s };
        }
        return fe(n, i, n[0], this.lexer, this.rules);
      }
    }
    emStrong(e, t, n = "") {
      let r = this.rules.inline.emStrongLDelim.exec(e);
      if (!r || r[3] && n.match(this.rules.other.unicodeAlphaNumeric)) return;
      if (!(r[1] || r[2] || "") || !n || this.rules.inline.punctuation.exec(n)) {
        let s = [...r[0]].length - 1, o, a, u = s, p = 0, c = r[0][0] === "*" ? this.rules.inline.emStrongRDelimAst : this.rules.inline.emStrongRDelimUnd;
        for (c.lastIndex = 0, t = t.slice(-1 * e.length + s); (r = c.exec(t)) != null; ) {
          if (o = r[1] || r[2] || r[3] || r[4] || r[5] || r[6], !o) continue;
          if (a = [...o].length, r[3] || r[4]) {
            u += a;
            continue;
          } else if ((r[5] || r[6]) && s % 3 && !((s + a) % 3)) {
            p += a;
            continue;
          }
          if (u -= a, u > 0) continue;
          a = Math.min(a, a + u + p);
          let f = [...r[0]][0].length, k = e.slice(0, s + r.index + f + a);
          if (Math.min(s, a) % 2) {
            let g = k.slice(1, -1);
            return { type: "em", raw: k, text: g, tokens: this.lexer.inlineTokens(g) };
          }
          let x = k.slice(2, -2);
          return { type: "strong", raw: k, text: x, tokens: this.lexer.inlineTokens(x) };
        }
      }
    }
    codespan(e) {
      let t = this.rules.inline.code.exec(e);
      if (t) {
        let n = t[2].replace(this.rules.other.newLineCharGlobal, " "), r = this.rules.other.nonSpaceChar.test(n), i = this.rules.other.startingSpaceChar.test(n) && this.rules.other.endingSpaceChar.test(n);
        return r && i && (n = n.substring(1, n.length - 1)), { type: "codespan", raw: t[0], text: n };
      }
    }
    br(e) {
      let t = this.rules.inline.br.exec(e);
      if (t) return { type: "br", raw: t[0] };
    }
    del(e) {
      let t = this.rules.inline.del.exec(e);
      if (t) return { type: "del", raw: t[0], text: t[2], tokens: this.lexer.inlineTokens(t[2]) };
    }
    autolink(e) {
      let t = this.rules.inline.autolink.exec(e);
      if (t) {
        let n, r;
        return t[2] === "@" ? (n = t[1], r = "mailto:" + n) : (n = t[1], r = n), { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    url(e) {
      var _a2;
      let t;
      if (t = this.rules.inline.url.exec(e)) {
        let n, r;
        if (t[2] === "@") n = t[0], r = "mailto:" + n;
        else {
          let i;
          do
            i = t[0], t[0] = ((_a2 = this.rules.inline._backpedal.exec(t[0])) == null ? void 0 : _a2[0]) ?? "";
          while (i !== t[0]);
          n = t[0], t[1] === "www." ? r = "http://" + t[0] : r = t[0];
        }
        return { type: "link", raw: t[0], text: n, href: r, tokens: [{ type: "text", raw: n, text: n }] };
      }
    }
    inlineText(e) {
      let t = this.rules.inline.text.exec(e);
      if (t) {
        let n = this.lexer.state.inRawBlock;
        return { type: "text", raw: t[0], text: t[0], escaped: n };
      }
    }
  };
  var b = class l {
    constructor(e) {
      __publicField(this, "tokens");
      __publicField(this, "options");
      __publicField(this, "state");
      __publicField(this, "tokenizer");
      __publicField(this, "inlineQueue");
      this.tokens = [], this.tokens.links = /* @__PURE__ */ Object.create(null), this.options = e || O, this.options.tokenizer = this.options.tokenizer || new y(), this.tokenizer = this.options.tokenizer, this.tokenizer.options = this.options, this.tokenizer.lexer = this, this.inlineQueue = [], this.state = { inLink: false, inRawBlock: false, top: true };
      let t = { other: m, block: I.normal, inline: M.normal };
      this.options.pedantic ? (t.block = I.pedantic, t.inline = M.pedantic) : this.options.gfm && (t.block = I.gfm, this.options.breaks ? t.inline = M.breaks : t.inline = M.gfm), this.tokenizer.rules = t;
    }
    static get rules() {
      return { block: I, inline: M };
    }
    static lex(e, t) {
      return new l(t).lex(e);
    }
    static lexInline(e, t) {
      return new l(t).inlineTokens(e);
    }
    lex(e) {
      e = e.replace(m.carriageReturn, `
`), this.blockTokens(e, this.tokens);
      for (let t = 0; t < this.inlineQueue.length; t++) {
        let n = this.inlineQueue[t];
        this.inlineTokens(n.src, n.tokens);
      }
      return this.inlineQueue = [], this.tokens;
    }
    blockTokens(e, t = [], n = false) {
      var _a2, _b, _c;
      for (this.options.pedantic && (e = e.replace(m.tabCharGlobal, "    ").replace(m.spaceLine, "")); e; ) {
        let r;
        if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.block) == null ? void 0 : _b.some((s) => (r = s.call({ lexer: this }, e, t)) ? (e = e.substring(r.raw.length), t.push(r), true) : false)) continue;
        if (r = this.tokenizer.space(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          r.raw.length === 1 && s !== void 0 ? s.raw += `
` : t.push(r);
          continue;
        }
        if (r = this.tokenizer.code(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          (s == null ? void 0 : s.type) === "paragraph" || (s == null ? void 0 : s.type) === "text" ? (s.raw += `
` + r.raw, s.text += `
` + r.text, this.inlineQueue.at(-1).src = s.text) : t.push(r);
          continue;
        }
        if (r = this.tokenizer.fences(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.heading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.hr(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.blockquote(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.list(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.html(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.def(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          (s == null ? void 0 : s.type) === "paragraph" || (s == null ? void 0 : s.type) === "text" ? (s.raw += `
` + r.raw, s.text += `
` + r.raw, this.inlineQueue.at(-1).src = s.text) : this.tokens.links[r.tag] || (this.tokens.links[r.tag] = { href: r.href, title: r.title });
          continue;
        }
        if (r = this.tokenizer.table(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        if (r = this.tokenizer.lheading(e)) {
          e = e.substring(r.raw.length), t.push(r);
          continue;
        }
        let i = e;
        if ((_c = this.options.extensions) == null ? void 0 : _c.startBlock) {
          let s = 1 / 0, o = e.slice(1), a;
          this.options.extensions.startBlock.forEach((u) => {
            a = u.call({ lexer: this }, o), typeof a == "number" && a >= 0 && (s = Math.min(s, a));
          }), s < 1 / 0 && s >= 0 && (i = e.substring(0, s + 1));
        }
        if (this.state.top && (r = this.tokenizer.paragraph(i))) {
          let s = t.at(-1);
          n && (s == null ? void 0 : s.type) === "paragraph" ? (s.raw += `
` + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r), n = i.length !== e.length, e = e.substring(r.raw.length);
          continue;
        }
        if (r = this.tokenizer.text(e)) {
          e = e.substring(r.raw.length);
          let s = t.at(-1);
          (s == null ? void 0 : s.type) === "text" ? (s.raw += `
` + r.raw, s.text += `
` + r.text, this.inlineQueue.pop(), this.inlineQueue.at(-1).src = s.text) : t.push(r);
          continue;
        }
        if (e) {
          let s = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(s);
            break;
          } else throw new Error(s);
        }
      }
      return this.state.top = true, t;
    }
    inline(e, t = []) {
      return this.inlineQueue.push({ src: e, tokens: t }), t;
    }
    inlineTokens(e, t = []) {
      var _a2, _b, _c;
      let n = e, r = null;
      if (this.tokens.links) {
        let o = Object.keys(this.tokens.links);
        if (o.length > 0) for (; (r = this.tokenizer.rules.inline.reflinkSearch.exec(n)) != null; ) o.includes(r[0].slice(r[0].lastIndexOf("[") + 1, -1)) && (n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.reflinkSearch.lastIndex));
      }
      for (; (r = this.tokenizer.rules.inline.anyPunctuation.exec(n)) != null; ) n = n.slice(0, r.index) + "++" + n.slice(this.tokenizer.rules.inline.anyPunctuation.lastIndex);
      for (; (r = this.tokenizer.rules.inline.blockSkip.exec(n)) != null; ) n = n.slice(0, r.index) + "[" + "a".repeat(r[0].length - 2) + "]" + n.slice(this.tokenizer.rules.inline.blockSkip.lastIndex);
      let i = false, s = "";
      for (; e; ) {
        i || (s = ""), i = false;
        let o;
        if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.inline) == null ? void 0 : _b.some((u) => (o = u.call({ lexer: this }, e, t)) ? (e = e.substring(o.raw.length), t.push(o), true) : false)) continue;
        if (o = this.tokenizer.escape(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.tag(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.link(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.reflink(e, this.tokens.links)) {
          e = e.substring(o.raw.length);
          let u = t.at(-1);
          o.type === "text" && (u == null ? void 0 : u.type) === "text" ? (u.raw += o.raw, u.text += o.text) : t.push(o);
          continue;
        }
        if (o = this.tokenizer.emStrong(e, n, s)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.codespan(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.br(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.del(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (o = this.tokenizer.autolink(e)) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        if (!this.state.inLink && (o = this.tokenizer.url(e))) {
          e = e.substring(o.raw.length), t.push(o);
          continue;
        }
        let a = e;
        if ((_c = this.options.extensions) == null ? void 0 : _c.startInline) {
          let u = 1 / 0, p = e.slice(1), c;
          this.options.extensions.startInline.forEach((f) => {
            c = f.call({ lexer: this }, p), typeof c == "number" && c >= 0 && (u = Math.min(u, c));
          }), u < 1 / 0 && u >= 0 && (a = e.substring(0, u + 1));
        }
        if (o = this.tokenizer.inlineText(a)) {
          e = e.substring(o.raw.length), o.raw.slice(-1) !== "_" && (s = o.raw.slice(-1)), i = true;
          let u = t.at(-1);
          (u == null ? void 0 : u.type) === "text" ? (u.raw += o.raw, u.text += o.text) : t.push(o);
          continue;
        }
        if (e) {
          let u = "Infinite loop on byte: " + e.charCodeAt(0);
          if (this.options.silent) {
            console.error(u);
            break;
          } else throw new Error(u);
        }
      }
      return t;
    }
  };
  var P = class {
    constructor(e) {
      __publicField(this, "options");
      __publicField(this, "parser");
      this.options = e || O;
    }
    space(e) {
      return "";
    }
    code({ text: e, lang: t, escaped: n }) {
      var _a2;
      let r = (_a2 = (t || "").match(m.notSpaceStart)) == null ? void 0 : _a2[0], i = e.replace(m.endingNewline, "") + `
`;
      return r ? '<pre><code class="language-' + w(r) + '">' + (n ? i : w(i, true)) + `</code></pre>
` : "<pre><code>" + (n ? i : w(i, true)) + `</code></pre>
`;
    }
    blockquote({ tokens: e }) {
      return `<blockquote>
${this.parser.parse(e)}</blockquote>
`;
    }
    html({ text: e }) {
      return e;
    }
    heading({ tokens: e, depth: t }) {
      return `<h${t}>${this.parser.parseInline(e)}</h${t}>
`;
    }
    hr(e) {
      return `<hr>
`;
    }
    list(e) {
      let t = e.ordered, n = e.start, r = "";
      for (let o = 0; o < e.items.length; o++) {
        let a = e.items[o];
        r += this.listitem(a);
      }
      let i = t ? "ol" : "ul", s = t && n !== 1 ? ' start="' + n + '"' : "";
      return "<" + i + s + `>
` + r + "</" + i + `>
`;
    }
    listitem(e) {
      var _a2;
      let t = "";
      if (e.task) {
        let n = this.checkbox({ checked: !!e.checked });
        e.loose ? ((_a2 = e.tokens[0]) == null ? void 0 : _a2.type) === "paragraph" ? (e.tokens[0].text = n + " " + e.tokens[0].text, e.tokens[0].tokens && e.tokens[0].tokens.length > 0 && e.tokens[0].tokens[0].type === "text" && (e.tokens[0].tokens[0].text = n + " " + w(e.tokens[0].tokens[0].text), e.tokens[0].tokens[0].escaped = true)) : e.tokens.unshift({ type: "text", raw: n + " ", text: n + " ", escaped: true }) : t += n + " ";
      }
      return t += this.parser.parse(e.tokens, !!e.loose), `<li>${t}</li>
`;
    }
    checkbox({ checked: e }) {
      return "<input " + (e ? 'checked="" ' : "") + 'disabled="" type="checkbox">';
    }
    paragraph({ tokens: e }) {
      return `<p>${this.parser.parseInline(e)}</p>
`;
    }
    table(e) {
      let t = "", n = "";
      for (let i = 0; i < e.header.length; i++) n += this.tablecell(e.header[i]);
      t += this.tablerow({ text: n });
      let r = "";
      for (let i = 0; i < e.rows.length; i++) {
        let s = e.rows[i];
        n = "";
        for (let o = 0; o < s.length; o++) n += this.tablecell(s[o]);
        r += this.tablerow({ text: n });
      }
      return r && (r = `<tbody>${r}</tbody>`), `<table>
<thead>
` + t + `</thead>
` + r + `</table>
`;
    }
    tablerow({ text: e }) {
      return `<tr>
${e}</tr>
`;
    }
    tablecell(e) {
      let t = this.parser.parseInline(e.tokens), n = e.header ? "th" : "td";
      return (e.align ? `<${n} align="${e.align}">` : `<${n}>`) + t + `</${n}>
`;
    }
    strong({ tokens: e }) {
      return `<strong>${this.parser.parseInline(e)}</strong>`;
    }
    em({ tokens: e }) {
      return `<em>${this.parser.parseInline(e)}</em>`;
    }
    codespan({ text: e }) {
      return `<code>${w(e, true)}</code>`;
    }
    br(e) {
      return "<br>";
    }
    del({ tokens: e }) {
      return `<del>${this.parser.parseInline(e)}</del>`;
    }
    link({ href: e, title: t, tokens: n }) {
      let r = this.parser.parseInline(n), i = J(e);
      if (i === null) return r;
      e = i;
      let s = '<a href="' + e + '"';
      return t && (s += ' title="' + w(t) + '"'), s += ">" + r + "</a>", s;
    }
    image({ href: e, title: t, text: n, tokens: r }) {
      r && (n = this.parser.parseInline(r, this.parser.textRenderer));
      let i = J(e);
      if (i === null) return w(n);
      e = i;
      let s = `<img src="${e}" alt="${n}"`;
      return t && (s += ` title="${w(t)}"`), s += ">", s;
    }
    text(e) {
      return "tokens" in e && e.tokens ? this.parser.parseInline(e.tokens) : "escaped" in e && e.escaped ? e.text : w(e.text);
    }
  };
  var S = class {
    strong({ text: e }) {
      return e;
    }
    em({ text: e }) {
      return e;
    }
    codespan({ text: e }) {
      return e;
    }
    del({ text: e }) {
      return e;
    }
    html({ text: e }) {
      return e;
    }
    text({ text: e }) {
      return e;
    }
    link({ text: e }) {
      return "" + e;
    }
    image({ text: e }) {
      return "" + e;
    }
    br() {
      return "";
    }
  };
  var R = class l2 {
    constructor(e) {
      __publicField(this, "options");
      __publicField(this, "renderer");
      __publicField(this, "textRenderer");
      this.options = e || O, this.options.renderer = this.options.renderer || new P(), this.renderer = this.options.renderer, this.renderer.options = this.options, this.renderer.parser = this, this.textRenderer = new S();
    }
    static parse(e, t) {
      return new l2(t).parse(e);
    }
    static parseInline(e, t) {
      return new l2(t).parseInline(e);
    }
    parse(e, t = true) {
      var _a2, _b;
      let n = "";
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.renderers) == null ? void 0 : _b[i.type]) {
          let o = i, a = this.options.extensions.renderers[o.type].call({ parser: this }, o);
          if (a !== false || !["space", "hr", "heading", "code", "table", "blockquote", "list", "html", "paragraph", "text"].includes(o.type)) {
            n += a || "";
            continue;
          }
        }
        let s = i;
        switch (s.type) {
          case "space": {
            n += this.renderer.space(s);
            continue;
          }
          case "hr": {
            n += this.renderer.hr(s);
            continue;
          }
          case "heading": {
            n += this.renderer.heading(s);
            continue;
          }
          case "code": {
            n += this.renderer.code(s);
            continue;
          }
          case "table": {
            n += this.renderer.table(s);
            continue;
          }
          case "blockquote": {
            n += this.renderer.blockquote(s);
            continue;
          }
          case "list": {
            n += this.renderer.list(s);
            continue;
          }
          case "html": {
            n += this.renderer.html(s);
            continue;
          }
          case "paragraph": {
            n += this.renderer.paragraph(s);
            continue;
          }
          case "text": {
            let o = s, a = this.renderer.text(o);
            for (; r + 1 < e.length && e[r + 1].type === "text"; ) o = e[++r], a += `
` + this.renderer.text(o);
            t ? n += this.renderer.paragraph({ type: "paragraph", raw: a, text: a, tokens: [{ type: "text", raw: a, text: a, escaped: true }] }) : n += a;
            continue;
          }
          default: {
            let o = 'Token with "' + s.type + '" type was not found.';
            if (this.options.silent) return console.error(o), "";
            throw new Error(o);
          }
        }
      }
      return n;
    }
    parseInline(e, t = this.renderer) {
      var _a2, _b;
      let n = "";
      for (let r = 0; r < e.length; r++) {
        let i = e[r];
        if ((_b = (_a2 = this.options.extensions) == null ? void 0 : _a2.renderers) == null ? void 0 : _b[i.type]) {
          let o = this.options.extensions.renderers[i.type].call({ parser: this }, i);
          if (o !== false || !["escape", "html", "link", "image", "strong", "em", "codespan", "br", "del", "text"].includes(i.type)) {
            n += o || "";
            continue;
          }
        }
        let s = i;
        switch (s.type) {
          case "escape": {
            n += t.text(s);
            break;
          }
          case "html": {
            n += t.html(s);
            break;
          }
          case "link": {
            n += t.link(s);
            break;
          }
          case "image": {
            n += t.image(s);
            break;
          }
          case "strong": {
            n += t.strong(s);
            break;
          }
          case "em": {
            n += t.em(s);
            break;
          }
          case "codespan": {
            n += t.codespan(s);
            break;
          }
          case "br": {
            n += t.br(s);
            break;
          }
          case "del": {
            n += t.del(s);
            break;
          }
          case "text": {
            n += t.text(s);
            break;
          }
          default: {
            let o = 'Token with "' + s.type + '" type was not found.';
            if (this.options.silent) return console.error(o), "";
            throw new Error(o);
          }
        }
      }
      return n;
    }
  };
  var $ = (_a = class {
    constructor(e) {
      __publicField(this, "options");
      __publicField(this, "block");
      this.options = e || O;
    }
    preprocess(e) {
      return e;
    }
    postprocess(e) {
      return e;
    }
    processAllTokens(e) {
      return e;
    }
    provideLexer() {
      return this.block ? b.lex : b.lexInline;
    }
    provideParser() {
      return this.block ? R.parse : R.parseInline;
    }
  }, __publicField(_a, "passThroughHooks", /* @__PURE__ */ new Set(["preprocess", "postprocess", "processAllTokens"])), _a);
  var B = class {
    constructor(...e) {
      __publicField(this, "defaults", L());
      __publicField(this, "options", this.setOptions);
      __publicField(this, "parse", this.parseMarkdown(true));
      __publicField(this, "parseInline", this.parseMarkdown(false));
      __publicField(this, "Parser", R);
      __publicField(this, "Renderer", P);
      __publicField(this, "TextRenderer", S);
      __publicField(this, "Lexer", b);
      __publicField(this, "Tokenizer", y);
      __publicField(this, "Hooks", $);
      this.use(...e);
    }
    walkTokens(e, t) {
      var _a2, _b;
      let n = [];
      for (let r of e) switch (n = n.concat(t.call(this, r)), r.type) {
        case "table": {
          let i = r;
          for (let s of i.header) n = n.concat(this.walkTokens(s.tokens, t));
          for (let s of i.rows) for (let o of s) n = n.concat(this.walkTokens(o.tokens, t));
          break;
        }
        case "list": {
          let i = r;
          n = n.concat(this.walkTokens(i.items, t));
          break;
        }
        default: {
          let i = r;
          ((_b = (_a2 = this.defaults.extensions) == null ? void 0 : _a2.childTokens) == null ? void 0 : _b[i.type]) ? this.defaults.extensions.childTokens[i.type].forEach((s) => {
            let o = i[s].flat(1 / 0);
            n = n.concat(this.walkTokens(o, t));
          }) : i.tokens && (n = n.concat(this.walkTokens(i.tokens, t)));
        }
      }
      return n;
    }
    use(...e) {
      let t = this.defaults.extensions || { renderers: {}, childTokens: {} };
      return e.forEach((n) => {
        let r = { ...n };
        if (r.async = this.defaults.async || r.async || false, n.extensions && (n.extensions.forEach((i) => {
          if (!i.name) throw new Error("extension name required");
          if ("renderer" in i) {
            let s = t.renderers[i.name];
            s ? t.renderers[i.name] = function(...o) {
              let a = i.renderer.apply(this, o);
              return a === false && (a = s.apply(this, o)), a;
            } : t.renderers[i.name] = i.renderer;
          }
          if ("tokenizer" in i) {
            if (!i.level || i.level !== "block" && i.level !== "inline") throw new Error("extension level must be 'block' or 'inline'");
            let s = t[i.level];
            s ? s.unshift(i.tokenizer) : t[i.level] = [i.tokenizer], i.start && (i.level === "block" ? t.startBlock ? t.startBlock.push(i.start) : t.startBlock = [i.start] : i.level === "inline" && (t.startInline ? t.startInline.push(i.start) : t.startInline = [i.start]));
          }
          "childTokens" in i && i.childTokens && (t.childTokens[i.name] = i.childTokens);
        }), r.extensions = t), n.renderer) {
          let i = this.defaults.renderer || new P(this.defaults);
          for (let s in n.renderer) {
            if (!(s in i)) throw new Error(`renderer '${s}' does not exist`);
            if (["options", "parser"].includes(s)) continue;
            let o = s, a = n.renderer[o], u = i[o];
            i[o] = (...p) => {
              let c = a.apply(i, p);
              return c === false && (c = u.apply(i, p)), c || "";
            };
          }
          r.renderer = i;
        }
        if (n.tokenizer) {
          let i = this.defaults.tokenizer || new y(this.defaults);
          for (let s in n.tokenizer) {
            if (!(s in i)) throw new Error(`tokenizer '${s}' does not exist`);
            if (["options", "rules", "lexer"].includes(s)) continue;
            let o = s, a = n.tokenizer[o], u = i[o];
            i[o] = (...p) => {
              let c = a.apply(i, p);
              return c === false && (c = u.apply(i, p)), c;
            };
          }
          r.tokenizer = i;
        }
        if (n.hooks) {
          let i = this.defaults.hooks || new $();
          for (let s in n.hooks) {
            if (!(s in i)) throw new Error(`hook '${s}' does not exist`);
            if (["options", "block"].includes(s)) continue;
            let o = s, a = n.hooks[o], u = i[o];
            $.passThroughHooks.has(s) ? i[o] = (p) => {
              if (this.defaults.async) return Promise.resolve(a.call(i, p)).then((f) => u.call(i, f));
              let c = a.call(i, p);
              return u.call(i, c);
            } : i[o] = (...p) => {
              let c = a.apply(i, p);
              return c === false && (c = u.apply(i, p)), c;
            };
          }
          r.hooks = i;
        }
        if (n.walkTokens) {
          let i = this.defaults.walkTokens, s = n.walkTokens;
          r.walkTokens = function(o) {
            let a = [];
            return a.push(s.call(this, o)), i && (a = a.concat(i.call(this, o))), a;
          };
        }
        this.defaults = { ...this.defaults, ...r };
      }), this;
    }
    setOptions(e) {
      return this.defaults = { ...this.defaults, ...e }, this;
    }
    lexer(e, t) {
      return b.lex(e, t ?? this.defaults);
    }
    parser(e, t) {
      return R.parse(e, t ?? this.defaults);
    }
    parseMarkdown(e) {
      return (n, r) => {
        let i = { ...r }, s = { ...this.defaults, ...i }, o = this.onError(!!s.silent, !!s.async);
        if (this.defaults.async === true && i.async === false) return o(new Error("marked(): The async option was set to true by an extension. Remove async: false from the parse options object to return a Promise."));
        if (typeof n > "u" || n === null) return o(new Error("marked(): input parameter is undefined or null"));
        if (typeof n != "string") return o(new Error("marked(): input parameter is of type " + Object.prototype.toString.call(n) + ", string expected"));
        s.hooks && (s.hooks.options = s, s.hooks.block = e);
        let a = s.hooks ? s.hooks.provideLexer() : e ? b.lex : b.lexInline, u = s.hooks ? s.hooks.provideParser() : e ? R.parse : R.parseInline;
        if (s.async) return Promise.resolve(s.hooks ? s.hooks.preprocess(n) : n).then((p) => a(p, s)).then((p) => s.hooks ? s.hooks.processAllTokens(p) : p).then((p) => s.walkTokens ? Promise.all(this.walkTokens(p, s.walkTokens)).then(() => p) : p).then((p) => u(p, s)).then((p) => s.hooks ? s.hooks.postprocess(p) : p).catch(o);
        try {
          s.hooks && (n = s.hooks.preprocess(n));
          let p = a(n, s);
          s.hooks && (p = s.hooks.processAllTokens(p)), s.walkTokens && this.walkTokens(p, s.walkTokens);
          let c = u(p, s);
          return s.hooks && (c = s.hooks.postprocess(c)), c;
        } catch (p) {
          return o(p);
        }
      };
    }
    onError(e, t) {
      return (n) => {
        if (n.message += `
Please report this to https://github.com/markedjs/marked.`, e) {
          let r = "<p>An error occurred:</p><pre>" + w(n.message + "", true) + "</pre>";
          return t ? Promise.resolve(r) : r;
        }
        if (t) return Promise.reject(n);
        throw n;
      };
    }
  };
  var _ = new B();
  function d(l3, e) {
    return _.parse(l3, e);
  }
  d.options = d.setOptions = function(l3) {
    return _.setOptions(l3), d.defaults = _.defaults, H(d.defaults), d;
  };
  d.getDefaults = L;
  d.defaults = O;
  d.use = function(...l3) {
    return _.use(...l3), d.defaults = _.defaults, H(d.defaults), d;
  };
  d.walkTokens = function(l3, e) {
    return _.walkTokens(l3, e);
  };
  d.parseInline = _.parseInline;
  d.Parser = R;
  d.parser = R.parse;
  d.Renderer = P;
  d.TextRenderer = S;
  d.Lexer = b;
  d.lexer = b.lex;
  d.Tokenizer = y;
  d.Hooks = $;
  d.parse = d;
  d.options;
  d.setOptions;
  d.use;
  d.walkTokens;
  d.parseInline;
  R.parse;
  b.lex;
  const _hoisted_1$2 = { class: "ai-wrapper" };
  const _hoisted_2$1 = { class: "ai-message-role-avatar" };
  const _hoisted_3 = {
    key: 0,
    fill: "#333",
    "fill-rule": "evenodd",
    height: "30",
    style: { "flex": "0 0 auto", "line-height": "1" },
    viewBox: "0 0 30 30",
    width: "30",
    xmlns: "http://www.w3.org/2000/svg",
    class: "user-avatar"
  };
  const _hoisted_4 = {
    key: 1,
    class: "user-avatar"
  };
  const _hoisted_5 = { class: "ai-message-content" };
  const _hoisted_6 = {
    key: 0,
    class: "loading-container"
  };
  const _hoisted_7 = ["innerHTML"];
  const _hoisted_8 = { class: "ai-input-wrapper" };
  const _hoisted_9 = ["onKeydown"];
  const _sfc_main$3 = {
    __name: "AiHome",
    setup(__props) {
      const [messageApi, contextHolder] = Antd.message.useMessage();
      const setting = useSettingStore();
      const currentAbortController = vue.ref(null);
      const isLoading = vue.ref(false);
      const messages = vue.ref([{
        role: "system",
        content: "你好，有什么可以帮你的吗？"
      }]);
      const input = vue.ref("");
      const messageContainer = vue.ref(null);
      const isComposing = vue.ref(false);
      const scrollToBottom = () => {
        vue.nextTick(() => {
          if (messageContainer.value) {
            messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
          }
        });
        setTimeout(() => {
          if (messageContainer.value) {
            messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
          }
        }, 100);
      };
      const formatMessage = (message2) => {
        return d(message2);
      };
      const triggerAi = async (event) => {
        event.preventDefault();
        if (isLoading.value) return;
        if (!input.value || isComposing.value) return;
        if (!setting.config.basicConfig.token.value) {
          messageApi.info("未配置密钥，请先前往“设置”模块填写密钥..");
          return;
        }
        const inputValue = input.value;
        input.value = "";
        messages.value.push({
          role: "user",
          content: inputValue
        });
        messages.value.push({
          role: "system",
          content: "思考中"
        });
        scrollToBottom();
        try {
          const requestData = {
            content: inputValue,
            token: setting.config.basicConfig.token.value
          };
          const controller = new AbortController();
          const signal = controller.signal;
          currentAbortController.value = controller;
          isLoading.value = true;
          const response = await fetch("https://she.aichathelper.top/ai/ds", {
            method: "POST",
            signal,
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(requestData)
          });
          if (!response.ok) {
            messages.value[messages.value.length - 1].content = "发送消息失败，请重试";
            currentAbortController.value = null;
            isLoading.value = false;
            return;
          }
          const reader = response.body.getReader();
          const decoder = new TextDecoder("utf-8");
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            console.log("收到数据块:", chunk);
            const lines = chunk.split("\n").filter((line) => line.trim() !== "");
            const jsonStr = lines.find((line) => line.startsWith("{") && line.endsWith("}"));
            if (jsonStr) {
              const { code, msg } = JSON.parse(jsonStr);
              if (code) {
                messages.value[messages.value.length - 1].content = msg;
                currentAbortController.value = null;
                isLoading.value = false;
                return;
              }
            }
            for (const line of lines) {
              if (line.startsWith("0:")) {
                const jsonStr2 = line.slice(2);
                try {
                  const content = JSON.parse(jsonStr2);
                  console.log("解析的内容:", content);
                  const lastMessage = messages.value[messages.value.length - 1];
                  lastMessage.content = lastMessage.content === "思考中" ? content : lastMessage.content + content;
                  scrollToBottom();
                } catch (e) {
                  console.error("解析错误:", e, "行内容:", line);
                }
              }
            }
          }
          isLoading.value = false;
        } catch (error) {
          if (error.name === "AbortError") {
            console.log("请求被终止");
          } else {
            console.error("发送消息错误:", error);
            messages.value[messages.value.length - 1].content = "发送消息失败，请重试";
          }
          currentAbortController.value = null;
          isLoading.value = false;
        }
      };
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
          vue.createVNode(vue.unref(contextHolder)),
          vue.createElementVNode("div", {
            class: "ai-message-list",
            ref_key: "messageContainer",
            ref: messageContainer
          }, [
            (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(messages.value, (m2, index) => {
              return vue.openBlock(), vue.createElementBlock("div", {
                class: "ai-message-item",
                key: index
              }, [
                vue.createElementVNode("div", {
                  class: vue.normalizeClass(["ai-message-container", { "user-message": m2.role === "user" }])
                }, [
                  vue.createElementVNode("div", _hoisted_2$1, [
                    m2.role === "system" ? (vue.openBlock(), vue.createElementBlock("svg", _hoisted_3, _cache[3] || (_cache[3] = [
                      vue.createElementVNode("rect", {
                        width: "30",
                        height: "30",
                        fill: "#E7F8FF",
                        rx: "6"
                      }, null, -1),
                      vue.createElementVNode("path", { d: "M24.55 13.004a5.416 5.416 0 0 0-.478-4.501c-1.217-2.09-3.662-3.166-6.05-2.66A5.59 5.59 0 0 0 13.831 4c-2.441-.005-4.607 1.546-5.358 3.838a5.553 5.553 0 0 0-3.713 2.658 5.487 5.487 0 0 0 .691 6.5 5.416 5.416 0 0 0 .477 4.502c1.217 2.09 3.662 3.165 6.05 2.66A5.586 5.586 0 0 0 16.168 26c2.443.006 4.61-1.546 5.361-3.84a5.553 5.553 0 0 0 3.715-2.66 5.488 5.488 0 0 0-.693-6.497v.001zm-8.381 11.558a4.199 4.199 0 0 1-2.675-.954c.034-.018.093-.05.132-.074l4.44-2.53a.71.71 0 0 0 .364-.623v-6.176l1.877 1.069c.02.01.033.029.036.05v5.115c-.003 2.274-1.87 4.118-4.174 4.123zM7.192 20.78a4.059 4.059 0 0 1-.498-2.763c.032.02.09.055.131.078l4.44 2.53c.225.13.504.13.73 0l5.42-3.088v2.138a.068.068 0 0 1-.027.057L12.9 22.288c-1.999 1.136-4.552.46-5.707-1.51h-.001zm-1.169-9.564A4.15 4.15 0 0 1 8.198 9.41l-.002.151v5.06a.711.711 0 0 0 .364.624l5.42 3.087-1.876 1.07a.067.067 0 0 1-.063.005l-4.489-2.559c-1.995-1.14-2.679-3.658-1.53-5.63h.001zm15.417 3.54-5.42-3.088 1.876-1.068a.067.067 0 0 1 .063-.006l4.489 2.557c1.998 1.14 2.683 3.662 1.529 5.633a4.163 4.163 0 0 1-2.174 1.807V15.38a.71.71 0 0 0-.363-.623zm1.867-2.773a6.04 6.04 0 0 0-.132-.078l-4.44-2.53a.731.731 0 0 0-.729 0l-5.42 3.088v-2.138a.068.068 0 0 1 .027-.057L17.1 7.713c2-1.137 4.555-.46 5.707 1.513.487.833.664 1.809.499 2.757h.001zm-11.741 3.81-1.877-1.068a.065.065 0 0 1-.036-.051V9.559c.001-2.277 1.873-4.122 4.181-4.12.976 0 1.92.338 2.671.954-.034.018-.092.05-.131.073l-4.44 2.53a.71.71 0 0 0-.365.623l-.003 6.173v.002zm1.02-2.168L15 12.25l2.414 1.375v2.75L15 17.75l-2.415-1.375v-2.75z" }, null, -1)
                    ]))) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_4, " 🙂 "))
                  ]),
                  vue.createElementVNode("div", _hoisted_5, [
                    m2.content === "思考中" ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
                      _cache[4] || (_cache[4] = vue.createElementVNode("span", null, "思考中", -1)),
                      vue.createVNode(vue.unref(LoadingOutlined), { class: "loading-icon" })
                    ])) : (vue.openBlock(), vue.createElementBlock("div", {
                      key: 1,
                      innerHTML: formatMessage(m2.content)
                    }, null, 8, _hoisted_7))
                  ])
                ], 2)
              ]);
            }), 128))
          ], 512),
          vue.createElementVNode("div", _hoisted_8, [
            vue.withDirectives(vue.createElementVNode("textarea", {
              "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => input.value = $event),
              placeholder: "请输入你的问题...",
              rows: "2",
              onKeydown: vue.withKeys(vue.withModifiers(triggerAi, ["exact"]), ["enter"]),
              maxlength: "500",
              onCompositionstart: _cache[1] || (_cache[1] = ($event) => isComposing.value = true),
              onCompositionend: _cache[2] || (_cache[2] = ($event) => isComposing.value = false)
            }, null, 40, _hoisted_9), [
              [vue.vModelText, input.value]
            ]),
            vue.createElementVNode("div", {
              class: "send-message-btn",
              onClick: triggerAi
            }, [
              _cache[5] || (_cache[5] = vue.createElementVNode("span", null, "发送", -1)),
              vue.createVNode(vue.unref(SendOutlined))
            ])
          ])
        ]);
      };
    }
  };
  var Typr$1 = {};
  var Typr = {};
  Typr.parse = function(buff) {
    var bin = Typr._bin;
    var data = new Uint8Array(buff);
    var tag = bin.readASCII(data, 0, 4);
    if (tag == "ttcf") {
      var offset = 4;
      bin.readUshort(data, offset);
      offset += 2;
      bin.readUshort(data, offset);
      offset += 2;
      var numF = bin.readUint(data, offset);
      offset += 4;
      var fnts = [];
      for (var i = 0; i < numF; i++) {
        var foff = bin.readUint(data, offset);
        offset += 4;
        fnts.push(Typr._readFont(data, foff));
      }
      return fnts;
    } else
      return [Typr._readFont(data, 0)];
  };
  Typr._readFont = function(data, offset) {
    var bin = Typr._bin;
    var ooff = offset;
    bin.readFixed(data, offset);
    offset += 4;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var tags = [
      "cmap",
      "head",
      "hhea",
      "maxp",
      "hmtx",
      "name",
      "OS/2",
      "post",
      //"cvt",
      //"fpgm",
      "loca",
      "glyf",
      "kern",
      //"prep"
      //"gasp"
      "CFF ",
      "GPOS",
      "GSUB",
      "SVG "
      //"VORG",
    ];
    var obj = { _data: data, _offset: ooff };
    var tabs = {};
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      var length = bin.readUint(data, offset);
      offset += 4;
      tabs[tag] = { offset: toffset, length };
    }
    for (var i = 0; i < tags.length; i++) {
      var t = tags[i];
      if (tabs[t])
        obj[t.trim()] = Typr[t.trim()].parse(data, tabs[t].offset, tabs[t].length, obj);
    }
    return obj;
  };
  Typr._tabOffset = function(data, tab, foff) {
    var bin = Typr._bin;
    var numTables = bin.readUshort(data, foff + 4);
    var offset = foff + 12;
    for (var i = 0; i < numTables; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      var toffset = bin.readUint(data, offset);
      offset += 4;
      bin.readUint(data, offset);
      offset += 4;
      if (tag == tab)
        return toffset;
    }
    return 0;
  };
  Typr._bin = {
    readFixed: function(data, o) {
      return (data[o] << 8 | data[o + 1]) + (data[o + 2] << 8 | data[o + 3]) / (256 * 256 + 4);
    },
    readF2dot14: function(data, o) {
      var num = Typr._bin.readShort(data, o);
      return num / 16384;
    },
    readInt: function(buff, p) {
      return Typr._bin._view(buff).getInt32(p);
    },
    readInt8: function(buff, p) {
      return Typr._bin._view(buff).getInt8(p);
    },
    readShort: function(buff, p) {
      return Typr._bin._view(buff).getInt16(p);
    },
    readUshort: function(buff, p) {
      return Typr._bin._view(buff).getUint16(p);
    },
    readUshorts: function(buff, p, len) {
      var arr = [];
      for (var i = 0; i < len; i++)
        arr.push(Typr._bin.readUshort(buff, p + i * 2));
      return arr;
    },
    readUint: function(buff, p) {
      return Typr._bin._view(buff).getUint32(p);
    },
    readUint64: function(buff, p) {
      return Typr._bin.readUint(buff, p) * (4294967295 + 1) + Typr._bin.readUint(buff, p + 4);
    },
    readASCII: function(buff, p, l3) {
      var s = "";
      for (var i = 0; i < l3; i++)
        s += String.fromCharCode(buff[p + i]);
      return s;
    },
    readUnicode: function(buff, p, l3) {
      var s = "";
      for (var i = 0; i < l3; i++) {
        var c = buff[p++] << 8 | buff[p++];
        s += String.fromCharCode(c);
      }
      return s;
    },
    _tdec: typeof window !== "undefined" && window["TextDecoder"] ? new window["TextDecoder"]() : null,
    readUTF8: function(buff, p, l3) {
      var tdec = Typr._bin._tdec;
      if (tdec && p == 0 && l3 == buff.length)
        return tdec["decode"](buff);
      return Typr._bin.readASCII(buff, p, l3);
    },
    readBytes: function(buff, p, l3) {
      var arr = [];
      for (var i = 0; i < l3; i++)
        arr.push(buff[p + i]);
      return arr;
    },
    readASCIIArray: function(buff, p, l3) {
      var s = [];
      for (var i = 0; i < l3; i++)
        s.push(String.fromCharCode(buff[p + i]));
      return s;
    },
    _view: function(buff) {
      return buff._dataView || (buff._dataView = buff.buffer ? new DataView(buff.buffer, buff.byteOffset, buff.byteLength) : new DataView(new Uint8Array(buff).buffer));
    }
  };
  Typr._lctf = {};
  Typr._lctf.parse = function(data, offset, length, font, subt) {
    var bin = Typr._bin;
    var obj = {};
    var offset0 = offset;
    bin.readFixed(data, offset);
    offset += 4;
    var offScriptList = bin.readUshort(data, offset);
    offset += 2;
    var offFeatureList = bin.readUshort(data, offset);
    offset += 2;
    var offLookupList = bin.readUshort(data, offset);
    offset += 2;
    obj.scriptList = Typr._lctf.readScriptList(data, offset0 + offScriptList);
    obj.featureList = Typr._lctf.readFeatureList(data, offset0 + offFeatureList);
    obj.lookupList = Typr._lctf.readLookupList(data, offset0 + offLookupList, subt);
    return obj;
  };
  Typr._lctf.readLookupList = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var lut = Typr._lctf.readLookupTable(data, offset0 + noff, subt);
      obj.push(lut);
    }
    return obj;
  };
  Typr._lctf.readLookupTable = function(data, offset, subt) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = { tabs: [] };
    obj.ltype = bin.readUshort(data, offset);
    offset += 2;
    obj.flag = bin.readUshort(data, offset);
    offset += 2;
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    var ltype = obj.ltype;
    for (var i = 0; i < cnt; i++) {
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var tab = subt(data, ltype, offset0 + noff, obj);
      obj.tabs.push(tab);
    }
    return obj;
  };
  Typr._lctf.numOfOnes = function(n) {
    var num = 0;
    for (var i = 0; i < 32; i++)
      if ((n >>> i & 1) != 0)
        num++;
    return num;
  };
  Typr._lctf.readClassDef = function(data, offset) {
    var bin = Typr._bin;
    var obj = [];
    var format = bin.readUshort(data, offset);
    offset += 2;
    if (format == 1) {
      var startGlyph = bin.readUshort(data, offset);
      offset += 2;
      var glyphCount = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < glyphCount; i++) {
        obj.push(startGlyph + i);
        obj.push(startGlyph + i);
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    if (format == 2) {
      var count = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < count; i++) {
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
        obj.push(bin.readUshort(data, offset));
        offset += 2;
      }
    }
    return obj;
  };
  Typr._lctf.getInterval = function(tab, val) {
    for (var i = 0; i < tab.length; i += 3) {
      var start = tab[i], end = tab[i + 1];
      tab[i + 2];
      if (start <= val && val <= end)
        return i;
    }
    return -1;
  };
  Typr._lctf.readCoverage = function(data, offset) {
    var bin = Typr._bin;
    var cvg = {};
    cvg.fmt = bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    if (cvg.fmt == 1)
      cvg.tab = bin.readUshorts(data, offset, count);
    if (cvg.fmt == 2)
      cvg.tab = bin.readUshorts(data, offset, count * 3);
    return cvg;
  };
  Typr._lctf.coverageIndex = function(cvg, val) {
    var tab = cvg.tab;
    if (cvg.fmt == 1)
      return tab.indexOf(val);
    if (cvg.fmt == 2) {
      var ind = Typr._lctf.getInterval(tab, val);
      if (ind != -1)
        return tab[ind + 2] + (val - tab[ind]);
    }
    return -1;
  };
  Typr._lctf.readFeatureList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = [];
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      var feat = Typr._lctf.readFeatureTable(data, offset0 + noff);
      feat.tag = tag.trim();
      obj.push(feat);
    }
    return obj;
  };
  Typr._lctf.readFeatureTable = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var feat = {};
    var featureParams = bin.readUshort(data, offset);
    offset += 2;
    if (featureParams > 0) {
      feat.featureParams = offset0 + featureParams;
    }
    var lookupCount = bin.readUshort(data, offset);
    offset += 2;
    feat.tab = [];
    for (var i = 0; i < lookupCount; i++)
      feat.tab.push(bin.readUshort(data, offset + 2 * i));
    return feat;
  };
  Typr._lctf.readScriptList = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var count = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < count; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var noff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readScriptTable(data, offset0 + noff);
    }
    return obj;
  };
  Typr._lctf.readScriptTable = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    var defLangSysOff = bin.readUshort(data, offset);
    offset += 2;
    if (defLangSysOff > 0) {
      obj["default"] = Typr._lctf.readLangSysTable(data, offset0 + defLangSysOff);
    }
    var langSysCount = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < langSysCount; i++) {
      var tag = bin.readASCII(data, offset, 4);
      offset += 4;
      var langSysOff = bin.readUshort(data, offset);
      offset += 2;
      obj[tag.trim()] = Typr._lctf.readLangSysTable(data, offset0 + langSysOff);
    }
    return obj;
  };
  Typr._lctf.readLangSysTable = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    obj.reqFeature = bin.readUshort(data, offset);
    offset += 2;
    var featureCount = bin.readUshort(data, offset);
    offset += 2;
    obj.features = bin.readUshorts(data, offset, featureCount);
    return obj;
  };
  Typr.CFF = {};
  Typr.CFF.parse = function(data, offset, length) {
    var bin = Typr._bin;
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    data[offset];
    offset++;
    var ninds = [];
    offset = Typr.CFF.readIndex(data, offset, ninds);
    var names2 = [];
    for (var i = 0; i < ninds.length - 1; i++)
      names2.push(bin.readASCII(data, offset + ninds[i], ninds[i + 1] - ninds[i]));
    offset += ninds[ninds.length - 1];
    var tdinds = [];
    offset = Typr.CFF.readIndex(data, offset, tdinds);
    var topDicts = [];
    for (var i = 0; i < tdinds.length - 1; i++)
      topDicts.push(Typr.CFF.readDict(data, offset + tdinds[i], offset + tdinds[i + 1]));
    offset += tdinds[tdinds.length - 1];
    var topdict = topDicts[0];
    var sinds = [];
    offset = Typr.CFF.readIndex(data, offset, sinds);
    var strings = [];
    for (var i = 0; i < sinds.length - 1; i++)
      strings.push(bin.readASCII(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
    offset += sinds[sinds.length - 1];
    Typr.CFF.readSubrs(data, offset, topdict);
    if (topdict.CharStrings) {
      offset = topdict.CharStrings;
      var sinds = [];
      offset = Typr.CFF.readIndex(data, offset, sinds);
      var cstr = [];
      for (var i = 0; i < sinds.length - 1; i++)
        cstr.push(bin.readBytes(data, offset + sinds[i], sinds[i + 1] - sinds[i]));
      topdict.CharStrings = cstr;
    }
    if (topdict.ROS) {
      offset = topdict.FDArray;
      var fdind = [];
      offset = Typr.CFF.readIndex(data, offset, fdind);
      topdict.FDArray = [];
      for (var i = 0; i < fdind.length - 1; i++) {
        var dict = Typr.CFF.readDict(data, offset + fdind[i], offset + fdind[i + 1]);
        Typr.CFF._readFDict(data, dict, strings);
        topdict.FDArray.push(dict);
      }
      offset += fdind[fdind.length - 1];
      offset = topdict.FDSelect;
      topdict.FDSelect = [];
      var fmt = data[offset];
      offset++;
      if (fmt == 3) {
        var rns = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < rns + 1; i++) {
          topdict.FDSelect.push(bin.readUshort(data, offset), data[offset + 2]);
          offset += 3;
        }
      } else
        throw fmt;
    }
    if (topdict.Encoding)
      topdict.Encoding = Typr.CFF.readEncoding(data, topdict.Encoding, topdict.CharStrings.length);
    if (topdict.charset)
      topdict.charset = Typr.CFF.readCharset(data, topdict.charset, topdict.CharStrings.length);
    Typr.CFF._readFDict(data, topdict, strings);
    return topdict;
  };
  Typr.CFF._readFDict = function(data, dict, ss) {
    var offset;
    if (dict.Private) {
      offset = dict.Private[1];
      dict.Private = Typr.CFF.readDict(data, offset, offset + dict.Private[0]);
      if (dict.Private.Subrs)
        Typr.CFF.readSubrs(data, offset + dict.Private.Subrs, dict.Private);
    }
    for (var p in dict)
      if (["FamilyName", "FontName", "FullName", "Notice", "version", "Copyright"].indexOf(p) != -1)
        dict[p] = ss[dict[p] - 426 + 35];
  };
  Typr.CFF.readSubrs = function(data, offset, obj) {
    var bin = Typr._bin;
    var gsubinds = [];
    offset = Typr.CFF.readIndex(data, offset, gsubinds);
    var bias, nSubrs = gsubinds.length;
    if (nSubrs < 1240)
      bias = 107;
    else if (nSubrs < 33900)
      bias = 1131;
    else
      bias = 32768;
    obj.Bias = bias;
    obj.Subrs = [];
    for (var i = 0; i < gsubinds.length - 1; i++)
      obj.Subrs.push(bin.readBytes(data, offset + gsubinds[i], gsubinds[i + 1] - gsubinds[i]));
  };
  Typr.CFF.tableSE = [
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
    31,
    32,
    33,
    34,
    35,
    36,
    37,
    38,
    39,
    40,
    41,
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51,
    52,
    53,
    54,
    55,
    56,
    57,
    58,
    59,
    60,
    61,
    62,
    63,
    64,
    65,
    66,
    67,
    68,
    69,
    70,
    71,
    72,
    73,
    74,
    75,
    76,
    77,
    78,
    79,
    80,
    81,
    82,
    83,
    84,
    85,
    86,
    87,
    88,
    89,
    90,
    91,
    92,
    93,
    94,
    95,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    96,
    97,
    98,
    99,
    100,
    101,
    102,
    103,
    104,
    105,
    106,
    107,
    108,
    109,
    110,
    0,
    111,
    112,
    113,
    114,
    0,
    115,
    116,
    117,
    118,
    119,
    120,
    121,
    122,
    0,
    123,
    0,
    124,
    125,
    126,
    127,
    128,
    129,
    130,
    131,
    0,
    132,
    133,
    0,
    134,
    135,
    136,
    137,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    138,
    0,
    139,
    0,
    0,
    0,
    0,
    140,
    141,
    142,
    143,
    0,
    0,
    0,
    0,
    0,
    144,
    0,
    0,
    0,
    145,
    0,
    0,
    146,
    147,
    148,
    149,
    0,
    0,
    0,
    0
  ];
  Typr.CFF.glyphByUnicode = function(cff, code) {
    for (var i = 0; i < cff.charset.length; i++)
      if (cff.charset[i] == code)
        return i;
    return -1;
  };
  Typr.CFF.glyphBySE = function(cff, charcode) {
    if (charcode < 0 || charcode > 255)
      return -1;
    return Typr.CFF.glyphByUnicode(cff, Typr.CFF.tableSE[charcode]);
  };
  Typr.CFF.readEncoding = function(data, offset, num) {
    Typr._bin;
    var array = [".notdef"];
    var format = data[offset];
    offset++;
    if (format == 0) {
      var nCodes = data[offset];
      offset++;
      for (var i = 0; i < nCodes; i++)
        array.push(data[offset + i]);
    } else
      throw "error: unknown encoding format: " + format;
    return array;
  };
  Typr.CFF.readCharset = function(data, offset, num) {
    var bin = Typr._bin;
    var charset = [".notdef"];
    var format = data[offset];
    offset++;
    if (format == 0) {
      for (var i = 0; i < num; i++) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        charset.push(first);
      }
    } else if (format == 1 || format == 2) {
      while (charset.length < num) {
        var first = bin.readUshort(data, offset);
        offset += 2;
        var nLeft = 0;
        if (format == 1) {
          nLeft = data[offset];
          offset++;
        } else {
          nLeft = bin.readUshort(data, offset);
          offset += 2;
        }
        for (var i = 0; i <= nLeft; i++) {
          charset.push(first);
          first++;
        }
      }
    } else
      throw "error: format: " + format;
    return charset;
  };
  Typr.CFF.readIndex = function(data, offset, inds) {
    var bin = Typr._bin;
    var count = bin.readUshort(data, offset) + 1;
    offset += 2;
    var offsize = data[offset];
    offset++;
    if (offsize == 1)
      for (var i = 0; i < count; i++)
        inds.push(data[offset + i]);
    else if (offsize == 2)
      for (var i = 0; i < count; i++)
        inds.push(bin.readUshort(data, offset + i * 2));
    else if (offsize == 3)
      for (var i = 0; i < count; i++)
        inds.push(bin.readUint(data, offset + i * 3 - 1) & 16777215);
    else if (count != 1)
      throw "unsupported offset size: " + offsize + ", count: " + count;
    offset += count * offsize;
    return offset - 1;
  };
  Typr.CFF.getCharString = function(data, offset, o) {
    var bin = Typr._bin;
    var b0 = data[offset], b1 = data[offset + 1];
    data[offset + 2];
    data[offset + 3];
    data[offset + 4];
    var vs = 1;
    var op = null, val = null;
    if (b0 <= 20) {
      op = b0;
      vs = 1;
    }
    if (b0 == 12) {
      op = b0 * 100 + b1;
      vs = 2;
    }
    if (21 <= b0 && b0 <= 27) {
      op = b0;
      vs = 1;
    }
    if (b0 == 28) {
      val = bin.readShort(data, offset + 1);
      vs = 3;
    }
    if (29 <= b0 && b0 <= 31) {
      op = b0;
      vs = 1;
    }
    if (32 <= b0 && b0 <= 246) {
      val = b0 - 139;
      vs = 1;
    }
    if (247 <= b0 && b0 <= 250) {
      val = (b0 - 247) * 256 + b1 + 108;
      vs = 2;
    }
    if (251 <= b0 && b0 <= 254) {
      val = -(b0 - 251) * 256 - b1 - 108;
      vs = 2;
    }
    if (b0 == 255) {
      val = bin.readInt(data, offset + 1) / 65535;
      vs = 5;
    }
    o.val = val != null ? val : "o" + op;
    o.size = vs;
  };
  Typr.CFF.readCharString = function(data, offset, length) {
    var end = offset + length;
    var bin = Typr._bin;
    var arr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var op = null, val = null;
      if (b0 <= 20) {
        op = b0;
        vs = 1;
      }
      if (b0 == 12) {
        op = b0 * 100 + b1;
        vs = 2;
      }
      if (b0 == 19 || b0 == 20) {
        op = b0;
        vs = 2;
      }
      if (21 <= b0 && b0 <= 27) {
        op = b0;
        vs = 1;
      }
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (29 <= b0 && b0 <= 31) {
        op = b0;
        vs = 1;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
      }
      arr.push(val != null ? val : "o" + op);
      offset += vs;
    }
    return arr;
  };
  Typr.CFF.readDict = function(data, offset, end) {
    var bin = Typr._bin;
    var dict = {};
    var carr = [];
    while (offset < end) {
      var b0 = data[offset], b1 = data[offset + 1];
      data[offset + 2];
      data[offset + 3];
      data[offset + 4];
      var vs = 1;
      var key = null, val = null;
      if (b0 == 28) {
        val = bin.readShort(data, offset + 1);
        vs = 3;
      }
      if (b0 == 29) {
        val = bin.readInt(data, offset + 1);
        vs = 5;
      }
      if (32 <= b0 && b0 <= 246) {
        val = b0 - 139;
        vs = 1;
      }
      if (247 <= b0 && b0 <= 250) {
        val = (b0 - 247) * 256 + b1 + 108;
        vs = 2;
      }
      if (251 <= b0 && b0 <= 254) {
        val = -(b0 - 251) * 256 - b1 - 108;
        vs = 2;
      }
      if (b0 == 255) {
        val = bin.readInt(data, offset + 1) / 65535;
        vs = 5;
        throw "unknown number";
      }
      if (b0 == 30) {
        var nibs = [];
        vs = 1;
        while (true) {
          var b2 = data[offset + vs];
          vs++;
          var nib0 = b2 >> 4, nib1 = b2 & 15;
          if (nib0 != 15)
            nibs.push(nib0);
          if (nib1 != 15)
            nibs.push(nib1);
          if (nib1 == 15)
            break;
        }
        var s = "";
        var chars = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ".", "e", "e-", "reserved", "-", "endOfNumber"];
        for (var i = 0; i < nibs.length; i++)
          s += chars[nibs[i]];
        val = parseFloat(s);
      }
      if (b0 <= 21) {
        var keys = [
          "version",
          "Notice",
          "FullName",
          "FamilyName",
          "Weight",
          "FontBBox",
          "BlueValues",
          "OtherBlues",
          "FamilyBlues",
          "FamilyOtherBlues",
          "StdHW",
          "StdVW",
          "escape",
          "UniqueID",
          "XUID",
          "charset",
          "Encoding",
          "CharStrings",
          "Private",
          "Subrs",
          "defaultWidthX",
          "nominalWidthX"
        ];
        key = keys[b0];
        vs = 1;
        if (b0 == 12) {
          var keys = [
            "Copyright",
            "isFixedPitch",
            "ItalicAngle",
            "UnderlinePosition",
            "UnderlineThickness",
            "PaintType",
            "CharstringType",
            "FontMatrix",
            "StrokeWidth",
            "BlueScale",
            "BlueShift",
            "BlueFuzz",
            "StemSnapH",
            "StemSnapV",
            "ForceBold",
            0,
            0,
            "LanguageGroup",
            "ExpansionFactor",
            "initialRandomSeed",
            "SyntheticBase",
            "PostScript",
            "BaseFontName",
            "BaseFontBlend",
            0,
            0,
            0,
            0,
            0,
            0,
            "ROS",
            "CIDFontVersion",
            "CIDFontRevision",
            "CIDFontType",
            "CIDCount",
            "UIDBase",
            "FDArray",
            "FDSelect",
            "FontName"
          ];
          key = keys[b1];
          vs = 2;
        }
      }
      if (key != null) {
        dict[key] = carr.length == 1 ? carr[0] : carr;
        carr = [];
      } else
        carr.push(val);
      offset += vs;
    }
    return dict;
  };
  Typr.cmap = {};
  Typr.cmap.parse = function(data, offset, length) {
    data = new Uint8Array(data.buffer, offset, length);
    offset = 0;
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var numTables = bin.readUshort(data, offset);
    offset += 2;
    var offs = [];
    obj.tables = [];
    for (var i = 0; i < numTables; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUint(data, offset);
      offset += 4;
      var id = "p" + platformID + "e" + encodingID;
      var tind = offs.indexOf(noffset);
      if (tind == -1) {
        tind = obj.tables.length;
        var subt;
        offs.push(noffset);
        var format = bin.readUshort(data, noffset);
        if (format == 0)
          subt = Typr.cmap.parse0(data, noffset);
        else if (format == 4)
          subt = Typr.cmap.parse4(data, noffset);
        else if (format == 6)
          subt = Typr.cmap.parse6(data, noffset);
        else if (format == 12)
          subt = Typr.cmap.parse12(data, noffset);
        else
          console.warn("unknown format: " + format, platformID, encodingID, noffset);
        obj.tables.push(subt);
      }
      if (obj[id] != null)
        throw "multiple tables for one platform+encoding";
      obj[id] = tind;
    }
    return obj;
  };
  Typr.cmap.parse0 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var len = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.map = [];
    for (var i = 0; i < len - 6; i++)
      obj.map.push(data[offset + i]);
    return obj;
  };
  Typr.cmap.parse4 = function(data, offset) {
    var bin = Typr._bin;
    var offset0 = offset;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    var length = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var segCountX2 = bin.readUshort(data, offset);
    offset += 2;
    var segCount = segCountX2 / 2;
    obj.searchRange = bin.readUshort(data, offset);
    offset += 2;
    obj.entrySelector = bin.readUshort(data, offset);
    offset += 2;
    obj.rangeShift = bin.readUshort(data, offset);
    offset += 2;
    obj.endCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    offset += 2;
    obj.startCount = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.idDelta = [];
    for (var i = 0; i < segCount; i++) {
      obj.idDelta.push(bin.readShort(data, offset));
      offset += 2;
    }
    obj.idRangeOffset = bin.readUshorts(data, offset, segCount);
    offset += segCount * 2;
    obj.glyphIdArray = [];
    while (offset < offset0 + length) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };
  Typr.cmap.parse6 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    obj.firstCode = bin.readUshort(data, offset);
    offset += 2;
    var entryCount = bin.readUshort(data, offset);
    offset += 2;
    obj.glyphIdArray = [];
    for (var i = 0; i < entryCount; i++) {
      obj.glyphIdArray.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return obj;
  };
  Typr.cmap.parse12 = function(data, offset) {
    var bin = Typr._bin;
    var obj = {};
    obj.format = bin.readUshort(data, offset);
    offset += 2;
    offset += 2;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    var nGroups = bin.readUint(data, offset);
    offset += 4;
    obj.groups = [];
    for (var i = 0; i < nGroups; i++) {
      var off = offset + i * 12;
      var startCharCode = bin.readUint(data, off + 0);
      var endCharCode = bin.readUint(data, off + 4);
      var startGlyphID = bin.readUint(data, off + 8);
      obj.groups.push([startCharCode, endCharCode, startGlyphID]);
    }
    return obj;
  };
  Typr.glyf = {};
  Typr.glyf.parse = function(data, offset, length, font) {
    var obj = [];
    for (var g = 0; g < font.maxp.numGlyphs; g++)
      obj.push(null);
    return obj;
  };
  Typr.glyf._parseGlyf = function(font, g) {
    var bin = Typr._bin;
    var data = font._data;
    var offset = Typr._tabOffset(data, "glyf", font._offset) + font.loca[g];
    if (font.loca[g] == font.loca[g + 1])
      return null;
    var gl = {};
    gl.noc = bin.readShort(data, offset);
    offset += 2;
    gl.xMin = bin.readShort(data, offset);
    offset += 2;
    gl.yMin = bin.readShort(data, offset);
    offset += 2;
    gl.xMax = bin.readShort(data, offset);
    offset += 2;
    gl.yMax = bin.readShort(data, offset);
    offset += 2;
    if (gl.xMin >= gl.xMax || gl.yMin >= gl.yMax)
      return null;
    if (gl.noc > 0) {
      gl.endPts = [];
      for (var i = 0; i < gl.noc; i++) {
        gl.endPts.push(bin.readUshort(data, offset));
        offset += 2;
      }
      var instructionLength = bin.readUshort(data, offset);
      offset += 2;
      if (data.length - offset < instructionLength)
        return null;
      gl.instructions = bin.readBytes(data, offset, instructionLength);
      offset += instructionLength;
      var crdnum = gl.endPts[gl.noc - 1] + 1;
      gl.flags = [];
      for (var i = 0; i < crdnum; i++) {
        var flag = data[offset];
        offset++;
        gl.flags.push(flag);
        if ((flag & 8) != 0) {
          var rep = data[offset];
          offset++;
          for (var j2 = 0; j2 < rep; j2++) {
            gl.flags.push(flag);
            i++;
          }
        }
      }
      gl.xs = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 2) != 0, same = (gl.flags[i] & 16) != 0;
        if (i8) {
          gl.xs.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same)
            gl.xs.push(0);
          else {
            gl.xs.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      gl.ys = [];
      for (var i = 0; i < crdnum; i++) {
        var i8 = (gl.flags[i] & 4) != 0, same = (gl.flags[i] & 32) != 0;
        if (i8) {
          gl.ys.push(same ? data[offset] : -data[offset]);
          offset++;
        } else {
          if (same)
            gl.ys.push(0);
          else {
            gl.ys.push(bin.readShort(data, offset));
            offset += 2;
          }
        }
      }
      var x = 0, y2 = 0;
      for (var i = 0; i < crdnum; i++) {
        x += gl.xs[i];
        y2 += gl.ys[i];
        gl.xs[i] = x;
        gl.ys[i] = y2;
      }
    } else {
      var ARG_1_AND_2_ARE_WORDS = 1 << 0;
      var ARGS_ARE_XY_VALUES = 1 << 1;
      var WE_HAVE_A_SCALE = 1 << 3;
      var MORE_COMPONENTS = 1 << 5;
      var WE_HAVE_AN_X_AND_Y_SCALE = 1 << 6;
      var WE_HAVE_A_TWO_BY_TWO = 1 << 7;
      var WE_HAVE_INSTRUCTIONS = 1 << 8;
      gl.parts = [];
      var flags;
      do {
        flags = bin.readUshort(data, offset);
        offset += 2;
        var part = { m: { a: 1, b: 0, c: 0, d: 1, tx: 0, ty: 0 }, p1: -1, p2: -1 };
        gl.parts.push(part);
        part.glyphIndex = bin.readUshort(data, offset);
        offset += 2;
        if (flags & ARG_1_AND_2_ARE_WORDS) {
          var arg1 = bin.readShort(data, offset);
          offset += 2;
          var arg2 = bin.readShort(data, offset);
          offset += 2;
        } else {
          var arg1 = bin.readInt8(data, offset);
          offset++;
          var arg2 = bin.readInt8(data, offset);
          offset++;
        }
        if (flags & ARGS_ARE_XY_VALUES) {
          part.m.tx = arg1;
          part.m.ty = arg2;
        } else {
          part.p1 = arg1;
          part.p2 = arg2;
        }
        if (flags & WE_HAVE_A_SCALE) {
          part.m.a = part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_AN_X_AND_Y_SCALE) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        } else if (flags & WE_HAVE_A_TWO_BY_TWO) {
          part.m.a = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.b = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.c = bin.readF2dot14(data, offset);
          offset += 2;
          part.m.d = bin.readF2dot14(data, offset);
          offset += 2;
        }
      } while (flags & MORE_COMPONENTS);
      if (flags & WE_HAVE_INSTRUCTIONS) {
        var numInstr = bin.readUshort(data, offset);
        offset += 2;
        gl.instr = [];
        for (var i = 0; i < numInstr; i++) {
          gl.instr.push(data[offset]);
          offset++;
        }
      }
    }
    return gl;
  };
  Typr.GPOS = {};
  Typr.GPOS.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GPOS.subt);
  };
  Typr.GPOS.subt = function(data, ltype, offset, ltable) {
    var bin = Typr._bin, offset0 = offset, tab = {};
    tab.fmt = bin.readUshort(data, offset);
    offset += 2;
    if (ltype == 1 || ltype == 2 || ltype == 3 || ltype == 7 || ltype == 8 && tab.fmt <= 2) {
      var covOff = bin.readUshort(data, offset);
      offset += 2;
      tab.coverage = Typr._lctf.readCoverage(data, covOff + offset0);
    }
    if (ltype == 1 && tab.fmt == 1) {
      var valFmt1 = bin.readUshort(data, offset);
      offset += 2;
      var ones1 = Typr._lctf.numOfOnes(valFmt1);
      if (valFmt1 != 0)
        tab.pos = Typr.GPOS.readValueRecord(data, offset, valFmt1);
    } else if (ltype == 2 && tab.fmt >= 1 && tab.fmt <= 2) {
      var valFmt1 = bin.readUshort(data, offset);
      offset += 2;
      var valFmt2 = bin.readUshort(data, offset);
      offset += 2;
      var ones1 = Typr._lctf.numOfOnes(valFmt1);
      var ones2 = Typr._lctf.numOfOnes(valFmt2);
      if (tab.fmt == 1) {
        tab.pairsets = [];
        var psc = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < psc; i++) {
          var psoff = offset0 + bin.readUshort(data, offset);
          offset += 2;
          var pvc = bin.readUshort(data, psoff);
          psoff += 2;
          var arr = [];
          for (var j2 = 0; j2 < pvc; j2++) {
            var gid2 = bin.readUshort(data, psoff);
            psoff += 2;
            var value1, value2;
            if (valFmt1 != 0) {
              value1 = Typr.GPOS.readValueRecord(data, psoff, valFmt1);
              psoff += ones1 * 2;
            }
            if (valFmt2 != 0) {
              value2 = Typr.GPOS.readValueRecord(data, psoff, valFmt2);
              psoff += ones2 * 2;
            }
            arr.push({ gid2, val1: value1, val2: value2 });
          }
          tab.pairsets.push(arr);
        }
      }
      if (tab.fmt == 2) {
        var classDef1 = bin.readUshort(data, offset);
        offset += 2;
        var classDef2 = bin.readUshort(data, offset);
        offset += 2;
        var class1Count = bin.readUshort(data, offset);
        offset += 2;
        var class2Count = bin.readUshort(data, offset);
        offset += 2;
        tab.classDef1 = Typr._lctf.readClassDef(data, offset0 + classDef1);
        tab.classDef2 = Typr._lctf.readClassDef(data, offset0 + classDef2);
        tab.matrix = [];
        for (var i = 0; i < class1Count; i++) {
          var row = [];
          for (var j2 = 0; j2 < class2Count; j2++) {
            var value1 = null, value2 = null;
            if (valFmt1 != 0) {
              value1 = Typr.GPOS.readValueRecord(data, offset, valFmt1);
              offset += ones1 * 2;
            }
            if (valFmt2 != 0) {
              value2 = Typr.GPOS.readValueRecord(data, offset, valFmt2);
              offset += ones2 * 2;
            }
            row.push({ val1: value1, val2: value2 });
          }
          tab.matrix.push(row);
        }
      }
    } else if (ltype == 9 && tab.fmt == 1) {
      var extType = bin.readUshort(data, offset);
      offset += 2;
      var extOffset = bin.readUint(data, offset);
      offset += 4;
      if (ltable.ltype == 9) {
        ltable.ltype = extType;
      } else if (ltable.ltype != extType) {
        throw "invalid extension substitution";
      }
      return Typr.GPOS.subt(data, ltable.ltype, offset0 + extOffset);
    } else
      console.warn("unsupported GPOS table LookupType", ltype, "format", tab.fmt);
    return tab;
  };
  Typr.GPOS.readValueRecord = function(data, offset, valFmt) {
    var bin = Typr._bin;
    var arr = [];
    arr.push(valFmt & 1 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 1 ? 2 : 0;
    arr.push(valFmt & 2 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 2 ? 2 : 0;
    arr.push(valFmt & 4 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 4 ? 2 : 0;
    arr.push(valFmt & 8 ? bin.readShort(data, offset) : 0);
    offset += valFmt & 8 ? 2 : 0;
    return arr;
  };
  Typr.GSUB = {};
  Typr.GSUB.parse = function(data, offset, length, font) {
    return Typr._lctf.parse(data, offset, length, font, Typr.GSUB.subt);
  };
  Typr.GSUB.subt = function(data, ltype, offset, ltable) {
    var bin = Typr._bin, offset0 = offset, tab = {};
    tab.fmt = bin.readUshort(data, offset);
    offset += 2;
    if (ltype != 1 && ltype != 4 && ltype != 5 && ltype != 6)
      return null;
    if (ltype == 1 || ltype == 4 || ltype == 5 && tab.fmt <= 2 || ltype == 6 && tab.fmt <= 2) {
      var covOff = bin.readUshort(data, offset);
      offset += 2;
      tab.coverage = Typr._lctf.readCoverage(data, offset0 + covOff);
    }
    if (ltype == 1 && tab.fmt >= 1 && tab.fmt <= 2) {
      if (tab.fmt == 1) {
        tab.delta = bin.readShort(data, offset);
        offset += 2;
      } else if (tab.fmt == 2) {
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        tab.newg = bin.readUshorts(data, offset, cnt);
        offset += tab.newg.length * 2;
      }
    } else if (ltype == 4) {
      tab.vals = [];
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      for (var i = 0; i < cnt; i++) {
        var loff = bin.readUshort(data, offset);
        offset += 2;
        tab.vals.push(Typr.GSUB.readLigatureSet(data, offset0 + loff));
      }
    } else if (ltype == 5 && tab.fmt == 2) {
      if (tab.fmt == 2) {
        var cDefOffset = bin.readUshort(data, offset);
        offset += 2;
        tab.cDef = Typr._lctf.readClassDef(data, offset0 + cDefOffset);
        tab.scset = [];
        var subClassSetCount = bin.readUshort(data, offset);
        offset += 2;
        for (var i = 0; i < subClassSetCount; i++) {
          var scsOff = bin.readUshort(data, offset);
          offset += 2;
          tab.scset.push(scsOff == 0 ? null : Typr.GSUB.readSubClassSet(data, offset0 + scsOff));
        }
      }
    } else if (ltype == 6 && tab.fmt == 3) {
      if (tab.fmt == 3) {
        for (var i = 0; i < 3; i++) {
          var cnt = bin.readUshort(data, offset);
          offset += 2;
          var cvgs = [];
          for (var j2 = 0; j2 < cnt; j2++)
            cvgs.push(Typr._lctf.readCoverage(data, offset0 + bin.readUshort(data, offset + j2 * 2)));
          offset += cnt * 2;
          if (i == 0)
            tab.backCvg = cvgs;
          if (i == 1)
            tab.inptCvg = cvgs;
          if (i == 2)
            tab.ahedCvg = cvgs;
        }
        var cnt = bin.readUshort(data, offset);
        offset += 2;
        tab.lookupRec = Typr.GSUB.readSubstLookupRecords(data, offset, cnt);
      }
    } else if (ltype == 7 && tab.fmt == 1) {
      var extType = bin.readUshort(data, offset);
      offset += 2;
      var extOffset = bin.readUint(data, offset);
      offset += 4;
      if (ltable.ltype == 9) {
        ltable.ltype = extType;
      } else if (ltable.ltype != extType) {
        throw "invalid extension substitution";
      }
      return Typr.GSUB.subt(data, ltable.ltype, offset0 + extOffset);
    } else
      console.warn("unsupported GSUB table LookupType", ltype, "format", tab.fmt);
    return tab;
  };
  Typr.GSUB.readSubClassSet = function(data, offset) {
    var rUs = Typr._bin.readUshort, offset0 = offset, lset = [];
    var cnt = rUs(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = rUs(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readSubClassRule(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readSubClassRule = function(data, offset) {
    var rUs = Typr._bin.readUshort, rule = {};
    var gcount = rUs(data, offset);
    offset += 2;
    var scount = rUs(data, offset);
    offset += 2;
    rule.input = [];
    for (var i = 0; i < gcount - 1; i++) {
      rule.input.push(rUs(data, offset));
      offset += 2;
    }
    rule.substLookupRecords = Typr.GSUB.readSubstLookupRecords(data, offset, scount);
    return rule;
  };
  Typr.GSUB.readSubstLookupRecords = function(data, offset, cnt) {
    var rUs = Typr._bin.readUshort;
    var out = [];
    for (var i = 0; i < cnt; i++) {
      out.push(rUs(data, offset), rUs(data, offset + 2));
      offset += 4;
    }
    return out;
  };
  Typr.GSUB.readChainSubClassSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < cnt; i++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readChainSubClassRule(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readChainSubClassRule = function(data, offset) {
    var bin = Typr._bin, rule = {};
    var pps = ["backtrack", "input", "lookahead"];
    for (var pi = 0; pi < pps.length; pi++) {
      var cnt = bin.readUshort(data, offset);
      offset += 2;
      if (pi == 1)
        cnt--;
      rule[pps[pi]] = bin.readUshorts(data, offset, cnt);
      offset += rule[pps[pi]].length * 2;
    }
    var cnt = bin.readUshort(data, offset);
    offset += 2;
    rule.subst = bin.readUshorts(data, offset, cnt * 2);
    offset += rule.subst.length * 2;
    return rule;
  };
  Typr.GSUB.readLigatureSet = function(data, offset) {
    var bin = Typr._bin, offset0 = offset, lset = [];
    var lcnt = bin.readUshort(data, offset);
    offset += 2;
    for (var j2 = 0; j2 < lcnt; j2++) {
      var loff = bin.readUshort(data, offset);
      offset += 2;
      lset.push(Typr.GSUB.readLigature(data, offset0 + loff));
    }
    return lset;
  };
  Typr.GSUB.readLigature = function(data, offset) {
    var bin = Typr._bin, lig = { chain: [] };
    lig.nglyph = bin.readUshort(data, offset);
    offset += 2;
    var ccnt = bin.readUshort(data, offset);
    offset += 2;
    for (var k = 0; k < ccnt - 1; k++) {
      lig.chain.push(bin.readUshort(data, offset));
      offset += 2;
    }
    return lig;
  };
  Typr.head = {};
  Typr.head.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.fontRevision = bin.readFixed(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    obj.flags = bin.readUshort(data, offset);
    offset += 2;
    obj.unitsPerEm = bin.readUshort(data, offset);
    offset += 2;
    obj.created = bin.readUint64(data, offset);
    offset += 8;
    obj.modified = bin.readUint64(data, offset);
    offset += 8;
    obj.xMin = bin.readShort(data, offset);
    offset += 2;
    obj.yMin = bin.readShort(data, offset);
    offset += 2;
    obj.xMax = bin.readShort(data, offset);
    offset += 2;
    obj.yMax = bin.readShort(data, offset);
    offset += 2;
    obj.macStyle = bin.readUshort(data, offset);
    offset += 2;
    obj.lowestRecPPEM = bin.readUshort(data, offset);
    offset += 2;
    obj.fontDirectionHint = bin.readShort(data, offset);
    offset += 2;
    obj.indexToLocFormat = bin.readShort(data, offset);
    offset += 2;
    obj.glyphDataFormat = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.hhea = {};
  Typr.hhea.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readFixed(data, offset);
    offset += 4;
    obj.ascender = bin.readShort(data, offset);
    offset += 2;
    obj.descender = bin.readShort(data, offset);
    offset += 2;
    obj.lineGap = bin.readShort(data, offset);
    offset += 2;
    obj.advanceWidthMax = bin.readUshort(data, offset);
    offset += 2;
    obj.minLeftSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.minRightSideBearing = bin.readShort(data, offset);
    offset += 2;
    obj.xMaxExtent = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRise = bin.readShort(data, offset);
    offset += 2;
    obj.caretSlopeRun = bin.readShort(data, offset);
    offset += 2;
    obj.caretOffset = bin.readShort(data, offset);
    offset += 2;
    offset += 4 * 2;
    obj.metricDataFormat = bin.readShort(data, offset);
    offset += 2;
    obj.numberOfHMetrics = bin.readUshort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.hmtx = {};
  Typr.hmtx.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = {};
    obj.aWidth = [];
    obj.lsBearing = [];
    var aw = 0, lsb = 0;
    for (var i = 0; i < font.maxp.numGlyphs; i++) {
      if (i < font.hhea.numberOfHMetrics) {
        aw = bin.readUshort(data, offset);
        offset += 2;
        lsb = bin.readShort(data, offset);
        offset += 2;
      }
      obj.aWidth.push(aw);
      obj.lsBearing.push(lsb);
    }
    return obj;
  };
  Typr.kern = {};
  Typr.kern.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var version = bin.readUshort(data, offset);
    offset += 2;
    if (version == 1)
      return Typr.kern.parseV1(data, offset - 2, length, font);
    var nTables = bin.readUshort(data, offset);
    offset += 2;
    var map2 = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
      offset += 2;
      var length = bin.readUshort(data, offset);
      offset += 2;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0)
        offset = Typr.kern.readFormat0(data, offset, map2);
      else
        throw "unknown kern table format: " + format;
    }
    return map2;
  };
  Typr.kern.parseV1 = function(data, offset, length, font) {
    var bin = Typr._bin;
    bin.readFixed(data, offset);
    offset += 4;
    var nTables = bin.readUint(data, offset);
    offset += 4;
    var map2 = { glyph1: [], rval: [] };
    for (var i = 0; i < nTables; i++) {
      bin.readUint(data, offset);
      offset += 4;
      var coverage = bin.readUshort(data, offset);
      offset += 2;
      bin.readUshort(data, offset);
      offset += 2;
      var format = coverage >>> 8;
      format &= 15;
      if (format == 0)
        offset = Typr.kern.readFormat0(data, offset, map2);
      else
        throw "unknown kern table format: " + format;
    }
    return map2;
  };
  Typr.kern.readFormat0 = function(data, offset, map2) {
    var bin = Typr._bin;
    var pleft = -1;
    var nPairs = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    for (var j2 = 0; j2 < nPairs; j2++) {
      var left = bin.readUshort(data, offset);
      offset += 2;
      var right = bin.readUshort(data, offset);
      offset += 2;
      var value = bin.readShort(data, offset);
      offset += 2;
      if (left != pleft) {
        map2.glyph1.push(left);
        map2.rval.push({ glyph2: [], vals: [] });
      }
      var rval = map2.rval[map2.rval.length - 1];
      rval.glyph2.push(right);
      rval.vals.push(value);
      pleft = left;
    }
    return offset;
  };
  Typr.loca = {};
  Typr.loca.parse = function(data, offset, length, font) {
    var bin = Typr._bin;
    var obj = [];
    var ver = font.head.indexToLocFormat;
    var len = font.maxp.numGlyphs + 1;
    if (ver == 0)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUshort(data, offset + (i << 1)) << 1);
    if (ver == 1)
      for (var i = 0; i < len; i++)
        obj.push(bin.readUint(data, offset + (i << 2)));
    return obj;
  };
  Typr.maxp = {};
  Typr.maxp.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    var ver = bin.readUint(data, offset);
    offset += 4;
    obj.numGlyphs = bin.readUshort(data, offset);
    offset += 2;
    if (ver == 65536) {
      obj.maxPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositePoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxCompositeContours = bin.readUshort(data, offset);
      offset += 2;
      obj.maxZones = bin.readUshort(data, offset);
      offset += 2;
      obj.maxTwilightPoints = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStorage = bin.readUshort(data, offset);
      offset += 2;
      obj.maxFunctionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxInstructionDefs = bin.readUshort(data, offset);
      offset += 2;
      obj.maxStackElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxSizeOfInstructions = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentElements = bin.readUshort(data, offset);
      offset += 2;
      obj.maxComponentDepth = bin.readUshort(data, offset);
      offset += 2;
    }
    return obj;
  };
  Typr.name = {};
  Typr.name.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    bin.readUshort(data, offset);
    offset += 2;
    var count = bin.readUshort(data, offset);
    offset += 2;
    bin.readUshort(data, offset);
    offset += 2;
    var names2 = [
      "copyright",
      "fontFamily",
      "fontSubfamily",
      "ID",
      "fullName",
      "version",
      "postScriptName",
      "trademark",
      "manufacturer",
      "designer",
      "description",
      "urlVendor",
      "urlDesigner",
      "licence",
      "licenceURL",
      "---",
      "typoFamilyName",
      "typoSubfamilyName",
      "compatibleFull",
      "sampleText",
      "postScriptCID",
      "wwsFamilyName",
      "wwsSubfamilyName",
      "lightPalette",
      "darkPalette"
    ];
    var offset0 = offset;
    for (var i = 0; i < count; i++) {
      var platformID = bin.readUshort(data, offset);
      offset += 2;
      var encodingID = bin.readUshort(data, offset);
      offset += 2;
      var languageID = bin.readUshort(data, offset);
      offset += 2;
      var nameID = bin.readUshort(data, offset);
      offset += 2;
      var slen = bin.readUshort(data, offset);
      offset += 2;
      var noffset = bin.readUshort(data, offset);
      offset += 2;
      var cname = names2[nameID];
      var soff = offset0 + count * 12 + noffset;
      var str;
      if (platformID == 0)
        str = bin.readUnicode(data, soff, slen / 2);
      else if (platformID == 3 && encodingID == 0)
        str = bin.readUnicode(data, soff, slen / 2);
      else if (encodingID == 0)
        str = bin.readASCII(data, soff, slen);
      else if (encodingID == 1)
        str = bin.readUnicode(data, soff, slen / 2);
      else if (encodingID == 3)
        str = bin.readUnicode(data, soff, slen / 2);
      else if (platformID == 1) {
        str = bin.readASCII(data, soff, slen);
        console.warn("reading unknown MAC encoding " + encodingID + " as ASCII");
      } else
        throw "unknown encoding " + encodingID + ", platformID: " + platformID;
      var tid = "p" + platformID + "," + languageID.toString(16);
      if (obj[tid] == null)
        obj[tid] = {};
      obj[tid][cname !== void 0 ? cname : nameID] = str;
      obj[tid]._lang = languageID;
    }
    for (var p in obj)
      if (obj[p].postScriptName != null && obj[p]._lang == 1033)
        return obj[p];
    for (var p in obj)
      if (obj[p].postScriptName != null && obj[p]._lang == 0)
        return obj[p];
    for (var p in obj)
      if (obj[p].postScriptName != null && obj[p]._lang == 3084)
        return obj[p];
    for (var p in obj)
      if (obj[p].postScriptName != null)
        return obj[p];
    var tname;
    for (var p in obj) {
      tname = p;
      break;
    }
    console.warn("returning name table with languageID " + obj[tname]._lang);
    return obj[tname];
  };
  Typr["OS/2"] = {};
  Typr["OS/2"].parse = function(data, offset, length) {
    var bin = Typr._bin;
    var ver = bin.readUshort(data, offset);
    offset += 2;
    var obj = {};
    if (ver == 0)
      Typr["OS/2"].version0(data, offset, obj);
    else if (ver == 1)
      Typr["OS/2"].version1(data, offset, obj);
    else if (ver == 2 || ver == 3 || ver == 4)
      Typr["OS/2"].version2(data, offset, obj);
    else if (ver == 5)
      Typr["OS/2"].version5(data, offset, obj);
    else
      throw "unknown OS/2 table version: " + ver;
    return obj;
  };
  Typr["OS/2"].version0 = function(data, offset, obj) {
    var bin = Typr._bin;
    obj.xAvgCharWidth = bin.readShort(data, offset);
    offset += 2;
    obj.usWeightClass = bin.readUshort(data, offset);
    offset += 2;
    obj.usWidthClass = bin.readUshort(data, offset);
    offset += 2;
    obj.fsType = bin.readUshort(data, offset);
    offset += 2;
    obj.ySubscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySubscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYSize = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptXOffset = bin.readShort(data, offset);
    offset += 2;
    obj.ySuperscriptYOffset = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutSize = bin.readShort(data, offset);
    offset += 2;
    obj.yStrikeoutPosition = bin.readShort(data, offset);
    offset += 2;
    obj.sFamilyClass = bin.readShort(data, offset);
    offset += 2;
    obj.panose = bin.readBytes(data, offset, 10);
    offset += 10;
    obj.ulUnicodeRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange2 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange3 = bin.readUint(data, offset);
    offset += 4;
    obj.ulUnicodeRange4 = bin.readUint(data, offset);
    offset += 4;
    obj.achVendID = [bin.readInt8(data, offset), bin.readInt8(data, offset + 1), bin.readInt8(data, offset + 2), bin.readInt8(data, offset + 3)];
    offset += 4;
    obj.fsSelection = bin.readUshort(data, offset);
    offset += 2;
    obj.usFirstCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.usLastCharIndex = bin.readUshort(data, offset);
    offset += 2;
    obj.sTypoAscender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoDescender = bin.readShort(data, offset);
    offset += 2;
    obj.sTypoLineGap = bin.readShort(data, offset);
    offset += 2;
    obj.usWinAscent = bin.readUshort(data, offset);
    offset += 2;
    obj.usWinDescent = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr["OS/2"].version1 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version0(data, offset, obj);
    obj.ulCodePageRange1 = bin.readUint(data, offset);
    offset += 4;
    obj.ulCodePageRange2 = bin.readUint(data, offset);
    offset += 4;
    return offset;
  };
  Typr["OS/2"].version2 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version1(data, offset, obj);
    obj.sxHeight = bin.readShort(data, offset);
    offset += 2;
    obj.sCapHeight = bin.readShort(data, offset);
    offset += 2;
    obj.usDefault = bin.readUshort(data, offset);
    offset += 2;
    obj.usBreak = bin.readUshort(data, offset);
    offset += 2;
    obj.usMaxContext = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr["OS/2"].version5 = function(data, offset, obj) {
    var bin = Typr._bin;
    offset = Typr["OS/2"].version2(data, offset, obj);
    obj.usLowerOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    obj.usUpperOpticalPointSize = bin.readUshort(data, offset);
    offset += 2;
    return offset;
  };
  Typr.post = {};
  Typr.post.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = {};
    obj.version = bin.readFixed(data, offset);
    offset += 4;
    obj.italicAngle = bin.readFixed(data, offset);
    offset += 4;
    obj.underlinePosition = bin.readShort(data, offset);
    offset += 2;
    obj.underlineThickness = bin.readShort(data, offset);
    offset += 2;
    return obj;
  };
  Typr.SVG = {};
  Typr.SVG.parse = function(data, offset, length) {
    var bin = Typr._bin;
    var obj = { entries: [] };
    var offset0 = offset;
    bin.readUshort(data, offset);
    offset += 2;
    var svgDocIndexOffset = bin.readUint(data, offset);
    offset += 4;
    bin.readUint(data, offset);
    offset += 4;
    offset = svgDocIndexOffset + offset0;
    var numEntries = bin.readUshort(data, offset);
    offset += 2;
    for (var i = 0; i < numEntries; i++) {
      var startGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var endGlyphID = bin.readUshort(data, offset);
      offset += 2;
      var svgDocOffset = bin.readUint(data, offset);
      offset += 4;
      var svgDocLength = bin.readUint(data, offset);
      offset += 4;
      var sbuf = new Uint8Array(data.buffer, offset0 + svgDocOffset + svgDocIndexOffset, svgDocLength);
      var svg2 = bin.readUTF8(sbuf, 0, sbuf.length);
      for (var f = startGlyphID; f <= endGlyphID; f++) {
        obj.entries[f] = svg2;
      }
    }
    return obj;
  };
  Typr.SVG.toPath = function(str) {
    var pth = { cmds: [], crds: [] };
    if (str == null)
      return pth;
    var prsr = new DOMParser();
    var doc = prsr["parseFromString"](str, "image/svg+xml");
    var svg2 = doc.firstChild;
    while (svg2.tagName != "svg")
      svg2 = svg2.nextSibling;
    var vb = svg2.getAttribute("viewBox");
    if (vb)
      vb = vb.trim().split(" ").map(parseFloat);
    else
      vb = [0, 0, 1e3, 1e3];
    Typr.SVG._toPath(svg2.children, pth);
    for (var i = 0; i < pth.crds.length; i += 2) {
      var x = pth.crds[i], y2 = pth.crds[i + 1];
      x -= vb[0];
      y2 -= vb[1];
      y2 = -y2;
      pth.crds[i] = x;
      pth.crds[i + 1] = y2;
    }
    return pth;
  };
  Typr.SVG._toPath = function(nds, pth, fill) {
    for (var ni = 0; ni < nds.length; ni++) {
      var nd = nds[ni], tn = nd.tagName;
      var cfl = nd.getAttribute("fill");
      if (cfl == null)
        cfl = fill;
      if (tn == "g")
        Typr.SVG._toPath(nd.children, pth, cfl);
      else if (tn == "path") {
        pth.cmds.push(cfl ? cfl : "#000000");
        var d2 = nd.getAttribute("d");
        var toks = Typr.SVG._tokens(d2);
        Typr.SVG._toksToPath(toks, pth);
        pth.cmds.push("X");
      } else if (tn == "defs") ;
      else
        console.warn(tn, nd);
    }
  };
  Typr.SVG._tokens = function(d2) {
    var ts = [], off = 0, rn = false, cn = "";
    while (off < d2.length) {
      var cc = d2.charCodeAt(off), ch = d2.charAt(off);
      off++;
      var isNum = 48 <= cc && cc <= 57 || ch == "." || ch == "-";
      if (rn) {
        if (ch == "-") {
          ts.push(parseFloat(cn));
          cn = ch;
        } else if (isNum)
          cn += ch;
        else {
          ts.push(parseFloat(cn));
          if (ch != "," && ch != " ")
            ts.push(ch);
          rn = false;
        }
      } else {
        if (isNum) {
          cn = ch;
          rn = true;
        } else if (ch != "," && ch != " ")
          ts.push(ch);
      }
    }
    if (rn)
      ts.push(parseFloat(cn));
    return ts;
  };
  Typr.SVG._toksToPath = function(ts, pth) {
    var i = 0, x = 0, y2 = 0, ox = 0, oy = 0;
    var pc = { "M": 2, "L": 2, "H": 1, "V": 1, "S": 4, "C": 6 };
    var cmds = pth.cmds, crds = pth.crds;
    while (i < ts.length) {
      var cmd = ts[i];
      i++;
      if (cmd == "z") {
        cmds.push("Z");
        x = ox;
        y2 = oy;
      } else {
        var cmu = cmd.toUpperCase();
        var ps = pc[cmu], reps = Typr.SVG._reps(ts, i, ps);
        for (var j2 = 0; j2 < reps; j2++) {
          var xi = 0, yi = 0;
          if (cmd != cmu) {
            xi = x;
            yi = y2;
          }
          if (cmu == "M") {
            x = xi + ts[i++];
            y2 = yi + ts[i++];
            cmds.push("M");
            crds.push(x, y2);
            ox = x;
            oy = y2;
          } else if (cmu == "L") {
            x = xi + ts[i++];
            y2 = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y2);
          } else if (cmu == "H") {
            x = xi + ts[i++];
            cmds.push("L");
            crds.push(x, y2);
          } else if (cmu == "V") {
            y2 = yi + ts[i++];
            cmds.push("L");
            crds.push(x, y2);
          } else if (cmu == "C") {
            var x1 = xi + ts[i++], y1 = yi + ts[i++], x2 = xi + ts[i++], y22 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y22, x3, y3);
            x = x3;
            y2 = y3;
          } else if (cmu == "S") {
            var co = Math.max(crds.length - 4, 0);
            var x1 = x + x - crds[co], y1 = y2 + y2 - crds[co + 1];
            var x2 = xi + ts[i++], y22 = yi + ts[i++], x3 = xi + ts[i++], y3 = yi + ts[i++];
            cmds.push("C");
            crds.push(x1, y1, x2, y22, x3, y3);
            x = x3;
            y2 = y3;
          } else
            console.warn("Unknown SVG command " + cmd);
        }
      }
    }
  };
  Typr.SVG._reps = function(ts, off, ps) {
    var i = off;
    while (i < ts.length) {
      if (typeof ts[i] == "string")
        break;
      i += ps;
    }
    return (i - off) / ps;
  };
  if (Typr == null)
    Typr = {};
  if (Typr.U == null)
    Typr.U = {};
  Typr.U.codeToGlyph = function(font, code) {
    var cmap = font.cmap;
    for (var _i = 0, _a2 = [cmap.p0e4, cmap.p3e1, cmap.p3e10, cmap.p0e3, cmap.p1e0]; _i < _a2.length; _i++) {
      var tind = _a2[_i];
      if (tind == null)
        continue;
      var tab = cmap.tables[tind];
      if (tab.format == 0) {
        if (code >= tab.map.length)
          continue;
        return tab.map[code];
      } else if (tab.format == 4) {
        var sind = -1;
        for (var i = 0; i < tab.endCount.length; i++) {
          if (code <= tab.endCount[i]) {
            sind = i;
            break;
          }
        }
        if (sind == -1)
          continue;
        if (tab.startCount[sind] > code)
          continue;
        var gli = 0;
        if (tab.idRangeOffset[sind] != 0) {
          gli = tab.glyphIdArray[code - tab.startCount[sind] + (tab.idRangeOffset[sind] >> 1) - (tab.idRangeOffset.length - sind)];
        } else {
          gli = code + tab.idDelta[sind];
        }
        return gli & 65535;
      } else if (tab.format == 12) {
        if (code > tab.groups[tab.groups.length - 1][1])
          continue;
        for (var i = 0; i < tab.groups.length; i++) {
          var grp = tab.groups[i];
          if (grp[0] <= code && code <= grp[1])
            return grp[2] + (code - grp[0]);
        }
        continue;
      } else {
        throw "unknown cmap table format " + tab.format;
      }
    }
    return 0;
  };
  Typr.U.glyphToPath = function(font, gid) {
    var path = { cmds: [], crds: [] };
    if (font.SVG && font.SVG.entries[gid]) {
      var p = font.SVG.entries[gid];
      if (p == null)
        return path;
      if (typeof p == "string") {
        p = Typr.SVG.toPath(p);
        font.SVG.entries[gid] = p;
      }
      return p;
    } else if (font.CFF) {
      var state = { x: 0, y: 0, stack: [], nStems: 0, haveWidth: false, width: font.CFF.Private ? font.CFF.Private.defaultWidthX : 0, open: false };
      var cff = font.CFF, pdct = font.CFF.Private;
      if (cff.ROS) {
        var gi = 0;
        while (cff.FDSelect[gi + 2] <= gid)
          gi += 2;
        pdct = cff.FDArray[cff.FDSelect[gi + 1]].Private;
      }
      Typr.U._drawCFF(font.CFF.CharStrings[gid], state, cff, pdct, path);
    } else if (font.glyf) {
      Typr.U._drawGlyf(gid, font, path);
    }
    return path;
  };
  Typr.U._drawGlyf = function(gid, font, path) {
    var gl = font.glyf[gid];
    if (gl == null)
      gl = font.glyf[gid] = Typr.glyf._parseGlyf(font, gid);
    if (gl != null) {
      if (gl.noc > -1) {
        Typr.U._simpleGlyph(gl, path);
      } else {
        Typr.U._compoGlyph(gl, font, path);
      }
    }
  };
  Typr.U._simpleGlyph = function(gl, p) {
    for (var c = 0; c < gl.noc; c++) {
      var i0 = c == 0 ? 0 : gl.endPts[c - 1] + 1;
      var il = gl.endPts[c];
      for (var i = i0; i <= il; i++) {
        var pr = i == i0 ? il : i - 1;
        var nx = i == il ? i0 : i + 1;
        var onCurve = gl.flags[i] & 1;
        var prOnCurve = gl.flags[pr] & 1;
        var nxOnCurve = gl.flags[nx] & 1;
        var x = gl.xs[i], y2 = gl.ys[i];
        if (i == i0) {
          if (onCurve) {
            if (prOnCurve) {
              Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
            } else {
              Typr.U.P.moveTo(p, x, y2);
              continue;
            }
          } else {
            if (prOnCurve) {
              Typr.U.P.moveTo(p, gl.xs[pr], gl.ys[pr]);
            } else {
              Typr.U.P.moveTo(p, (gl.xs[pr] + x) / 2, (gl.ys[pr] + y2) / 2);
            }
          }
        }
        if (onCurve) {
          if (prOnCurve)
            Typr.U.P.lineTo(p, x, y2);
        } else {
          if (nxOnCurve) {
            Typr.U.P.qcurveTo(p, x, y2, gl.xs[nx], gl.ys[nx]);
          } else {
            Typr.U.P.qcurveTo(p, x, y2, (x + gl.xs[nx]) / 2, (y2 + gl.ys[nx]) / 2);
          }
        }
      }
      Typr.U.P.closePath(p);
    }
  };
  Typr.U._compoGlyph = function(gl, font, p) {
    for (var j2 = 0; j2 < gl.parts.length; j2++) {
      var path = { cmds: [], crds: [] };
      var prt = gl.parts[j2];
      Typr.U._drawGlyf(prt.glyphIndex, font, path);
      var m2 = prt.m;
      for (var i = 0; i < path.crds.length; i += 2) {
        var x = path.crds[i], y2 = path.crds[i + 1];
        p.crds.push(x * m2.a + y2 * m2.b + m2.tx);
        p.crds.push(x * m2.c + y2 * m2.d + m2.ty);
      }
      for (var i = 0; i < path.cmds.length; i++) {
        p.cmds.push(path.cmds[i]);
      }
    }
  };
  Typr.U._getGlyphClass = function(g, cd) {
    var intr = Typr._lctf.getInterval(cd, g);
    return intr == -1 ? 0 : cd[intr + 2];
  };
  Typr.U.getPairAdjustment = function(font, g1, g2) {
    var hasGPOSkern = false;
    if (font.GPOS) {
      var gpos = font["GPOS"];
      var llist = gpos.lookupList, flist = gpos.featureList;
      var tused = [];
      for (var i = 0; i < flist.length; i++) {
        var fl = flist[i];
        if (fl.tag != "kern")
          continue;
        hasGPOSkern = true;
        for (var ti = 0; ti < fl.tab.length; ti++) {
          if (tused[fl.tab[ti]])
            continue;
          tused[fl.tab[ti]] = true;
          var tab = llist[fl.tab[ti]];
          for (var j2 = 0; j2 < tab.tabs.length; j2++) {
            if (tab.tabs[j2] == null)
              continue;
            var ltab = tab.tabs[j2], ind;
            if (ltab.coverage) {
              ind = Typr._lctf.coverageIndex(ltab.coverage, g1);
              if (ind == -1)
                continue;
            }
            if (tab.ltype == 1) ;
            else if (tab.ltype == 2) {
              var adj = null;
              if (ltab.fmt == 1) {
                var right = ltab.pairsets[ind];
                for (var i = 0; i < right.length; i++) {
                  if (right[i].gid2 == g2)
                    adj = right[i];
                }
              } else if (ltab.fmt == 2) {
                var c1 = Typr.U._getGlyphClass(g1, ltab.classDef1);
                var c2 = Typr.U._getGlyphClass(g2, ltab.classDef2);
                adj = ltab.matrix[c1][c2];
              }
              if (adj) {
                var offset = 0;
                if (adj.val1 && adj.val1[2])
                  offset += adj.val1[2];
                if (adj.val2 && adj.val2[0])
                  offset += adj.val2[0];
                return offset;
              }
            }
          }
        }
      }
    }
    if (font.kern && !hasGPOSkern) {
      var ind1 = font.kern.glyph1.indexOf(g1);
      if (ind1 != -1) {
        var ind2 = font.kern.rval[ind1].glyph2.indexOf(g2);
        if (ind2 != -1)
          return font.kern.rval[ind1].vals[ind2];
      }
    }
    return 0;
  };
  Typr.U.stringToGlyphs = function(font, str) {
    var gls = [];
    for (var i = 0; i < str.length; i++) {
      var cc = str.codePointAt(i);
      if (cc > 65535)
        i++;
      gls.push(Typr.U.codeToGlyph(font, cc));
    }
    for (var i = 0; i < str.length; i++) {
      var cc = str.codePointAt(i);
      if (cc == 2367) {
        var t = gls[i - 1];
        gls[i - 1] = gls[i];
        gls[i] = t;
      }
      if (cc > 65535)
        i++;
    }
    var gsub = font["GSUB"];
    if (gsub == null)
      return gls;
    var llist = gsub.lookupList, flist = gsub.featureList;
    var cligs = [
      "rlig",
      "liga",
      "mset",
      "isol",
      "init",
      "fina",
      "medi",
      "half",
      "pres",
      "blws"
      /* Tibetan fonts like Himalaya.ttf */
    ];
    var tused = [];
    for (var fi = 0; fi < flist.length; fi++) {
      var fl = flist[fi];
      if (cligs.indexOf(fl.tag) == -1)
        continue;
      for (var ti = 0; ti < fl.tab.length; ti++) {
        if (tused[fl.tab[ti]])
          continue;
        tused[fl.tab[ti]] = true;
        var tab = llist[fl.tab[ti]];
        for (var ci = 0; ci < gls.length; ci++) {
          var feat = Typr.U._getWPfeature(str, ci);
          if ("isol,init,fina,medi".indexOf(fl.tag) != -1 && fl.tag != feat)
            continue;
          Typr.U._applySubs(gls, ci, tab, llist);
        }
      }
    }
    return gls;
  };
  Typr.U._getWPfeature = function(str, ci) {
    var wsep = '\n	" ,.:;!?()  ،';
    var R2 = "آأؤإاةدذرزوٱٲٳٵٶٷڈډڊڋڌڍڎڏڐڑڒړڔڕږڗژڙۀۃۄۅۆۇۈۉۊۋۍۏےۓەۮۯܐܕܖܗܘܙܞܨܪܬܯݍݙݚݛݫݬݱݳݴݸݹࡀࡆࡇࡉࡔࡧࡩࡪࢪࢫࢬࢮࢱࢲࢹૅેૉ૊૎૏ૐ૑૒૝ૡ૤૯஁ஃ஄அஉ஌எஏ஑னப஫஬";
    var L2 = "ꡲ્૗";
    var slft = ci == 0 || wsep.indexOf(str[ci - 1]) != -1;
    var srgt = ci == str.length - 1 || wsep.indexOf(str[ci + 1]) != -1;
    if (!slft && R2.indexOf(str[ci - 1]) != -1)
      slft = true;
    if (!srgt && R2.indexOf(str[ci]) != -1)
      srgt = true;
    if (!srgt && L2.indexOf(str[ci + 1]) != -1)
      srgt = true;
    if (!slft && L2.indexOf(str[ci]) != -1)
      slft = true;
    var feat = null;
    if (slft) {
      feat = srgt ? "isol" : "init";
    } else {
      feat = srgt ? "fina" : "medi";
    }
    return feat;
  };
  Typr.U._applySubs = function(gls, ci, tab, llist) {
    var rlim = gls.length - ci - 1;
    for (var j2 = 0; j2 < tab.tabs.length; j2++) {
      if (tab.tabs[j2] == null)
        continue;
      var ltab = tab.tabs[j2], ind;
      if (ltab.coverage) {
        ind = Typr._lctf.coverageIndex(ltab.coverage, gls[ci]);
        if (ind == -1)
          continue;
      }
      if (tab.ltype == 1) {
        gls[ci];
        if (ltab.fmt == 1)
          gls[ci] = gls[ci] + ltab.delta;
        else
          gls[ci] = ltab.newg[ind];
      } else if (tab.ltype == 4) {
        var vals = ltab.vals[ind];
        for (var k = 0; k < vals.length; k++) {
          var lig = vals[k], rl = lig.chain.length;
          if (rl > rlim)
            continue;
          var good = true, em1 = 0;
          for (var l3 = 0; l3 < rl; l3++) {
            while (gls[ci + em1 + (1 + l3)] == -1)
              em1++;
            if (lig.chain[l3] != gls[ci + em1 + (1 + l3)])
              good = false;
          }
          if (!good)
            continue;
          gls[ci] = lig.nglyph;
          for (var l3 = 0; l3 < rl + em1; l3++)
            gls[ci + l3 + 1] = -1;
          break;
        }
      } else if (tab.ltype == 5 && ltab.fmt == 2) {
        var cind = Typr._lctf.getInterval(ltab.cDef, gls[ci]);
        var cls = ltab.cDef[cind + 2], scs = ltab.scset[cls];
        for (var i = 0; i < scs.length; i++) {
          var sc = scs[i], inp = sc.input;
          if (inp.length > rlim)
            continue;
          var good = true;
          for (var l3 = 0; l3 < inp.length; l3++) {
            var cind2 = Typr._lctf.getInterval(ltab.cDef, gls[ci + 1 + l3]);
            if (cind == -1 && ltab.cDef[cind2 + 2] != inp[l3]) {
              good = false;
              break;
            }
          }
          if (!good)
            continue;
          var lrs = sc.substLookupRecords;
          for (var k = 0; k < lrs.length; k += 2) {
            lrs[k];
            lrs[k + 1];
          }
        }
      } else if (tab.ltype == 6 && ltab.fmt == 3) {
        if (!Typr.U._glsCovered(gls, ltab.backCvg, ci - ltab.backCvg.length))
          continue;
        if (!Typr.U._glsCovered(gls, ltab.inptCvg, ci))
          continue;
        if (!Typr.U._glsCovered(gls, ltab.ahedCvg, ci + ltab.inptCvg.length))
          continue;
        var lr = ltab.lookupRec;
        for (var i = 0; i < lr.length; i += 2) {
          var cind = lr[i], tab2 = llist[lr[i + 1]];
          Typr.U._applySubs(gls, ci + cind, tab2, llist);
        }
      }
    }
  };
  Typr.U._glsCovered = function(gls, cvgs, ci) {
    for (var i = 0; i < cvgs.length; i++) {
      var ind = Typr._lctf.coverageIndex(cvgs[i], gls[ci + i]);
      if (ind == -1)
        return false;
    }
    return true;
  };
  Typr.U.glyphsToPath = function(font, gls, clr) {
    var tpath = { cmds: [], crds: [] };
    var x = 0;
    for (var i = 0; i < gls.length; i++) {
      var gid = gls[i];
      if (gid == -1)
        continue;
      var gid2 = i < gls.length - 1 && gls[i + 1] != -1 ? gls[i + 1] : 0;
      var path = Typr.U.glyphToPath(font, gid);
      for (var j2 = 0; j2 < path.crds.length; j2 += 2) {
        tpath.crds.push(path.crds[j2] + x);
        tpath.crds.push(path.crds[j2 + 1]);
      }
      if (clr)
        tpath.cmds.push(clr);
      for (var j2 = 0; j2 < path.cmds.length; j2++)
        tpath.cmds.push(path.cmds[j2]);
      if (clr)
        tpath.cmds.push("X");
      x += font.hmtx.aWidth[gid];
      if (i < gls.length - 1)
        x += Typr.U.getPairAdjustment(font, gid, gid2);
    }
    return tpath;
  };
  Typr.U.pathToSVG = function(path, prec) {
    if (prec == null)
      prec = 5;
    var out = [], co = 0, lmap = { "M": 2, "L": 2, "Q": 4, "C": 6 };
    for (var i = 0; i < path.cmds.length; i++) {
      var cmd = path.cmds[i], cn = co + (lmap[cmd] ? lmap[cmd] : 0);
      out.push(cmd);
      while (co < cn) {
        var c = path.crds[co++];
        out.push(parseFloat(c.toFixed(prec)) + (co == cn ? "" : " "));
      }
    }
    return out.join("");
  };
  Typr.U.pathToContext = function(path, ctx) {
    var c = 0, crds = path.crds;
    for (var j2 = 0; j2 < path.cmds.length; j2++) {
      var cmd = path.cmds[j2];
      if (cmd == "M") {
        ctx.moveTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "L") {
        ctx.lineTo(crds[c], crds[c + 1]);
        c += 2;
      } else if (cmd == "C") {
        ctx.bezierCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3], crds[c + 4], crds[c + 5]);
        c += 6;
      } else if (cmd == "Q") {
        ctx.quadraticCurveTo(crds[c], crds[c + 1], crds[c + 2], crds[c + 3]);
        c += 4;
      } else if (cmd.charAt(0) == "#") {
        ctx.beginPath();
        ctx.fillStyle = cmd;
      } else if (cmd == "Z") {
        ctx.closePath();
      } else if (cmd == "X") {
        ctx.fill();
      }
    }
  };
  Typr.U.P = {};
  Typr.U.P.moveTo = function(p, x, y2) {
    p.cmds.push("M");
    p.crds.push(x, y2);
  };
  Typr.U.P.lineTo = function(p, x, y2) {
    p.cmds.push("L");
    p.crds.push(x, y2);
  };
  Typr.U.P.curveTo = function(p, a, b2, c, d2, e, f) {
    p.cmds.push("C");
    p.crds.push(a, b2, c, d2, e, f);
  };
  Typr.U.P.qcurveTo = function(p, a, b2, c, d2) {
    p.cmds.push("Q");
    p.crds.push(a, b2, c, d2);
  };
  Typr.U.P.closePath = function(p) {
    p.cmds.push("Z");
  };
  Typr.U._drawCFF = function(cmds, state, font, pdct, p) {
    var stack = state.stack;
    var nStems = state.nStems, haveWidth = state.haveWidth, width = state.width, open = state.open;
    var i = 0;
    var x = state.x, y2 = state.y, c1x = 0, c1y = 0, c2x = 0, c2y = 0, c3x = 0, c3y = 0, c4x = 0, c4y = 0, jpx = 0, jpy = 0;
    var o = { val: 0, size: 0 };
    while (i < cmds.length) {
      Typr.CFF.getCharString(cmds, i, o);
      var v2 = o.val;
      i += o.size;
      if (v2 == "o1" || v2 == "o18") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v2 == "o3" || v2 == "o23") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
      } else if (v2 == "o4") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
          haveWidth = true;
        }
        if (open)
          Typr.U.P.closePath(p);
        y2 += stack.pop();
        Typr.U.P.moveTo(p, x, y2);
        open = true;
      } else if (v2 == "o5") {
        while (stack.length > 0) {
          x += stack.shift();
          y2 += stack.shift();
          Typr.U.P.lineTo(p, x, y2);
        }
      } else if (v2 == "o6" || v2 == "o7") {
        var count = stack.length;
        var isX = v2 == "o6";
        for (var j2 = 0; j2 < count; j2++) {
          var sval = stack.shift();
          if (isX) {
            x += sval;
          } else {
            y2 += sval;
          }
          isX = !isX;
          Typr.U.P.lineTo(p, x, y2);
        }
      } else if (v2 == "o8" || v2 == "o24") {
        var count = stack.length;
        var index = 0;
        while (index + 6 <= count) {
          c1x = x + stack.shift();
          c1y = y2 + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y2 = c2y + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y2);
          index += 6;
        }
        if (v2 == "o24") {
          x += stack.shift();
          y2 += stack.shift();
          Typr.U.P.lineTo(p, x, y2);
        }
      } else if (v2 == "o11") {
        break;
      } else if (v2 == "o1234" || v2 == "o1235" || v2 == "o1236" || v2 == "o1237") {
        if (v2 == "o1234") {
          c1x = x + stack.shift();
          c1y = y2;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = y2;
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y2);
        }
        if (v2 == "o1235") {
          c1x = x + stack.shift();
          c1y = y2 + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          y2 = c4y + stack.shift();
          stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y2);
        }
        if (v2 == "o1236") {
          c1x = x + stack.shift();
          c1y = y2 + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y;
          c3x = jpx + stack.shift();
          c3y = c2y;
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          x = c4x + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y2);
        }
        if (v2 == "o1237") {
          c1x = x + stack.shift();
          c1y = y2 + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          jpx = c2x + stack.shift();
          jpy = c2y + stack.shift();
          c3x = jpx + stack.shift();
          c3y = jpy + stack.shift();
          c4x = c3x + stack.shift();
          c4y = c3y + stack.shift();
          if (Math.abs(c4x - x) > Math.abs(c4y - y2)) {
            x = c4x + stack.shift();
          } else {
            y2 = c4y + stack.shift();
          }
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, jpx, jpy);
          Typr.U.P.curveTo(p, c3x, c3y, c4x, c4y, x, y2);
        }
      } else if (v2 == "o14") {
        if (stack.length > 0 && !haveWidth) {
          width = stack.shift() + font.nominalWidthX;
          haveWidth = true;
        }
        if (stack.length == 4) {
          var adx = stack.shift();
          var ady = stack.shift();
          var bchar = stack.shift();
          var achar = stack.shift();
          var bind2 = Typr.CFF.glyphBySE(font, bchar);
          var aind = Typr.CFF.glyphBySE(font, achar);
          Typr.U._drawCFF(font.CharStrings[bind2], state, font, pdct, p);
          state.x = adx;
          state.y = ady;
          Typr.U._drawCFF(font.CharStrings[aind], state, font, pdct, p);
        }
        if (open) {
          Typr.U.P.closePath(p);
          open = false;
        }
      } else if (v2 == "o19" || v2 == "o20") {
        var hasWidthArg;
        hasWidthArg = stack.length % 2 !== 0;
        if (hasWidthArg && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
        }
        nStems += stack.length >> 1;
        stack.length = 0;
        haveWidth = true;
        i += nStems + 7 >> 3;
      } else if (v2 == "o21") {
        if (stack.length > 2 && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
          haveWidth = true;
        }
        y2 += stack.pop();
        x += stack.pop();
        if (open)
          Typr.U.P.closePath(p);
        Typr.U.P.moveTo(p, x, y2);
        open = true;
      } else if (v2 == "o22") {
        if (stack.length > 1 && !haveWidth) {
          width = stack.shift() + pdct.nominalWidthX;
          haveWidth = true;
        }
        x += stack.pop();
        if (open)
          Typr.U.P.closePath(p);
        Typr.U.P.moveTo(p, x, y2);
        open = true;
      } else if (v2 == "o25") {
        while (stack.length > 6) {
          x += stack.shift();
          y2 += stack.shift();
          Typr.U.P.lineTo(p, x, y2);
        }
        c1x = x + stack.shift();
        c1y = y2 + stack.shift();
        c2x = c1x + stack.shift();
        c2y = c1y + stack.shift();
        x = c2x + stack.shift();
        y2 = c2y + stack.shift();
        Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y2);
      } else if (v2 == "o26") {
        if (stack.length % 2) {
          x += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x;
          c1y = y2 + stack.shift();
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x;
          y2 = c2y + stack.shift();
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y2);
        }
      } else if (v2 == "o27") {
        if (stack.length % 2) {
          y2 += stack.shift();
        }
        while (stack.length > 0) {
          c1x = x + stack.shift();
          c1y = y2;
          c2x = c1x + stack.shift();
          c2y = c1y + stack.shift();
          x = c2x + stack.shift();
          y2 = c2y;
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y2);
        }
      } else if (v2 == "o10" || v2 == "o29") {
        var obj = v2 == "o10" ? pdct : font;
        if (stack.length == 0) {
          console.warn("error: empty stack");
        } else {
          var ind = stack.pop();
          var subr = obj.Subrs[ind + obj.Bias];
          state.x = x;
          state.y = y2;
          state.nStems = nStems;
          state.haveWidth = haveWidth;
          state.width = width;
          state.open = open;
          Typr.U._drawCFF(subr, state, font, pdct, p);
          x = state.x;
          y2 = state.y;
          nStems = state.nStems;
          haveWidth = state.haveWidth;
          width = state.width;
          open = state.open;
        }
      } else if (v2 == "o30" || v2 == "o31") {
        var count, count1 = stack.length;
        var index = 0;
        var alternate = v2 == "o31";
        count = count1 & ~2;
        index += count1 - count;
        while (index < count) {
          if (alternate) {
            c1x = x + stack.shift();
            c1y = y2;
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            y2 = c2y + stack.shift();
            if (count - index == 5) {
              x = c2x + stack.shift();
              index++;
            } else {
              x = c2x;
            }
            alternate = false;
          } else {
            c1x = x;
            c1y = y2 + stack.shift();
            c2x = c1x + stack.shift();
            c2y = c1y + stack.shift();
            x = c2x + stack.shift();
            if (count - index == 5) {
              y2 = c2y + stack.shift();
              index++;
            } else {
              y2 = c2y;
            }
            alternate = true;
          }
          Typr.U.P.curveTo(p, c1x, c1y, c2x, c2y, x, y2);
          index += 4;
        }
      } else if ((v2 + "").charAt(0) == "o") {
        console.warn("Unknown operation: " + v2, cmds);
        throw v2;
      } else
        stack.push(v2);
    }
    state.x = x;
    state.y = y2;
    state.nStems = nStems;
    state.haveWidth = haveWidth;
    state.width = width;
    state.open = open;
  };
  Typr$1.Typr = Typr;
  var Typr_js_1 = Typr$1;
  var friendlyTags = { "aalt": "Access All Alternates", "abvf": "Above-base Forms", "abvm": "Above - base Mark Positioning", "abvs": "Above - base Substitutions", "afrc": "Alternative Fractions", "akhn": "Akhands", "blwf": "Below - base Forms", "blwm": "Below - base Mark Positioning", "blws": "Below - base Substitutions", "calt": "Contextual Alternates", "case": "Case - Sensitive Forms", "ccmp": "Glyph Composition / Decomposition", "cfar": "Conjunct Form After Ro", "cjct": "Conjunct Forms", "clig": "Contextual Ligatures", "cpct": "Centered CJK Punctuation", "cpsp": "Capital Spacing", "cswh": "Contextual Swash", "curs": "Cursive Positioning", "c2pc": "Petite Capitals From Capitals", "c2sc": "Small Capitals From Capitals", "dist": "Distances", "dlig": "Discretionary Ligatures", "dnom": "Denominators", "dtls": "Dotless Forms", "expt": "Expert Forms", "falt": "Final Glyph on Line Alternates", "fin2": "Terminal Forms #2", "fin3": "Terminal Forms #3", "fina": "Terminal Forms", "flac": "Flattened accent forms", "frac": "Fractions", "fwid": "Full Widths", "half": "Half Forms", "haln": "Halant Forms", "halt": "Alternate Half Widths", "hist": "Historical Forms", "hkna": "Horizontal Kana Alternates", "hlig": "Historical Ligatures", "hngl": "Hangul", "hojo": "Hojo Kanji Forms(JIS X 0212 - 1990 Kanji Forms)", "hwid": "Half Widths", "init": "Initial Forms", "isol": "Isolated Forms", "ital": "Italics", "jalt": "Justification Alternates", "jp78": "JIS78 Forms", "jp83": "JIS83 Forms", "jp90": "JIS90 Forms", "jp04": "JIS2004 Forms", "kern": "Kerning", "lfbd": "Left Bounds", "liga": "Standard Ligatures", "ljmo": "Leading Jamo Forms", "lnum": "Lining Figures", "locl": "Localized Forms", "ltra": "Left - to - right alternates", "ltrm": "Left - to - right mirrored forms", "mark": "Mark Positioning", "med2": "Medial Forms #2", "medi": "Medial Forms", "mgrk": "Mathematical Greek", "mkmk": "Mark to Mark Positioning", "mset": "Mark Positioning via Substitution", "nalt": "Alternate Annotation Forms", "nlck": "NLC Kanji Forms", "nukt": "Nukta Forms", "numr": "Numerators", "onum": "Oldstyle Figures", "opbd": "Optical Bounds", "ordn": "Ordinals", "ornm": "Ornaments", "palt": "Proportional Alternate Widths", "pcap": "Petite Capitals", "pkna": "Proportional Kana", "pnum": "Proportional Figures", "pref": "Pre - Base Forms", "pres": "Pre - base Substitutions", "pstf": "Post - base Forms", "psts": "Post - base Substitutions", "pwid": "Proportional Widths", "qwid": "Quarter Widths", "rand": "Randomize", "rclt": "Required Contextual Alternates", "rkrf": "Rakar Forms", "rlig": "Required Ligatures", "rphf": "Reph Forms", "rtbd": "Right Bounds", "rtla": "Right - to - left alternates", "rtlm": "Right - to - left mirrored forms", "ruby": "Ruby Notation Forms", "rvrn": "Required Variation Alternates", "salt": "Stylistic Alternates", "sinf": "Scientific Inferiors", "size": "Optical size", "smcp": "Small Capitals", "smpl": "Simplified Forms", "ssty": "Math script style alternates", "stch": "Stretching Glyph Decomposition", "subs": "Subscript", "sups": "Superscript", "swsh": "Swash", "titl": "Titling", "tjmo": "Trailing Jamo Forms", "tnam": "Traditional Name Forms", "tnum": "Tabular Figures", "trad": "Traditional Forms", "twid": "Third Widths", "unic": "Unicase", "valt": "Alternate Vertical Metrics", "vatu": "Vattu Variants", "vert": "Vertical Writing", "vhal": "Alternate Vertical Half Metrics", "vjmo": "Vowel Jamo Forms", "vkna": "Vertical Kana Alternates", "vkrn": "Vertical Kerning", "vpal": "Proportional Alternate Vertical Metrics", "vrt2": "Vertical Alternates and Rotation", "vrtr": "Vertical Alternates for Rotation", "zero": "Slashed Zero" };
  var Font = (
    /** @class */
    function() {
      function Font2(data) {
        var obj = Typr_js_1.Typr.parse(data);
        if (!obj.length || typeof obj[0] !== "object" || typeof obj[0].hasOwnProperty !== "function") {
          throw "unable to parse font";
        }
        for (var n in obj[0]) {
          this[n] = obj[0][n];
        }
        this.enabledGSUB = {};
      }
      Font2.prototype.getFamilyName = function() {
        return this.name && (this.name.typoFamilyName || this.name.fontFamily) || "";
      };
      Font2.prototype.getSubFamilyName = function() {
        return this.name && (this.name.typoSubfamilyName || this.name.fontSubfamily) || "";
      };
      Font2.prototype.glyphToPath = function(gid) {
        return Typr_js_1.Typr.U.glyphToPath(this, gid);
      };
      Font2.prototype.getPairAdjustment = function(gid1, gid2) {
        return Typr_js_1.Typr.U.getPairAdjustment(this, gid1, gid2);
      };
      Font2.prototype.stringToGlyphs = function(str) {
        return Typr_js_1.Typr.U.stringToGlyphs(this, str);
      };
      Font2.prototype.glyphsToPath = function(gls) {
        return Typr_js_1.Typr.U.glyphsToPath(this, gls);
      };
      Font2.prototype.pathToSVG = function(path, prec) {
        return Typr_js_1.Typr.U.pathToSVG(path, prec);
      };
      Font2.prototype.pathToContext = function(path, ctx) {
        return Typr_js_1.Typr.U.pathToContext(path, ctx);
      };
      Font2.prototype.lookupFriendlyName = function(table, feature) {
        if (this[table] !== void 0) {
          var tbl = this[table];
          var feat = tbl.featureList[feature];
          return this.featureFriendlyName(feat);
        }
        return "";
      };
      Font2.prototype.featureFriendlyName = function(feature) {
        if (friendlyTags[feature.tag]) {
          return friendlyTags[feature.tag];
        }
        if (feature.tag.match(/ss[0-2][0-9]/)) {
          var name_1 = "Stylistic Set " + Number(feature.tag.substr(2, 2)).toString();
          if (feature.featureParams) {
            var version = Typr_js_1.Typr._bin.readUshort(this._data, feature.featureParams);
            if (version === 0) {
              var nameID = Typr_js_1.Typr._bin.readUshort(this._data, feature.featureParams + 2);
              if (this.name && this.name[nameID] !== void 0) {
                return name_1 + " - " + this.name[nameID];
              }
            }
          }
          return name_1;
        }
        if (feature.tag.match(/cv[0-9][0-9]/)) {
          return "Character Variant " + Number(feature.tag.substr(2, 2)).toString();
        }
        return "";
      };
      Font2.prototype.enableGSUB = function(featureNumber) {
        if (this.GSUB) {
          var feature = this.GSUB.featureList[featureNumber];
          if (feature) {
            for (var i = 0; i < feature.tab.length; ++i) {
              this.enabledGSUB[feature.tab[i]] = (this.enabledGSUB[feature.tab[i]] || 0) + 1;
            }
          }
        }
      };
      Font2.prototype.disableGSUB = function(featureNumber) {
        if (this.GSUB) {
          var feature = this.GSUB.featureList[featureNumber];
          if (feature) {
            for (var i = 0; i < feature.tab.length; ++i) {
              if (this.enabledGSUB[feature.tab[i]] > 1) {
                --this.enabledGSUB[feature.tab[i]];
              } else {
                delete this.enabledGSUB[feature.tab[i]];
              }
            }
          }
        }
      };
      Font2.prototype.codeToGlyph = function(code) {
        var g = Typr_js_1.Typr.U.codeToGlyph(this, code);
        if (this.GSUB) {
          var gls = [g];
          for (var n in this.enabledGSUB) {
            var l3 = this.GSUB.lookupList[n];
            Typr_js_1.Typr.U._applySubs(gls, 0, l3, this.GSUB.lookupList);
          }
          if (gls.length === 1)
            return gls[0];
        }
        return g;
      };
      return Font2;
    }()
  );
  var Font_1 = Font;
  function decrypt(iframeDocument) {
    var _a2, _b, _c;
    const styles = iframeDocument.querySelectorAll("style");
    let tip;
    for (let i = 0; i < styles.length; i++) {
      if ((_a2 = styles[i].textContent) == null ? void 0 : _a2.includes("font-cxsecret")) {
        tip = styles[i];
        break;
      }
    }
    if (!tip) return;
    const fontData = (_c = (_b = tip.textContent) == null ? void 0 : _b.match(/base64,([\w\W]+?)'/)) == null ? void 0 : _c[1];
    if (!fontData) return;
    const fontArray = base64ToUint8Array(fontData);
    const font = new Font_1(fontArray);
    console.log("ttf:", GM_getResourceText("ttf"));
    const table = JSON.parse(GM_getResourceText("ttf"));
    const match = {};
    for (let i = 19968; i < 40870; i++) {
      const glyph = font.codeToGlyph(i);
      if (!glyph) continue;
      const path = font.glyphToPath(glyph);
      const hash = md5(JSON.stringify(path)).slice(24);
      match[i] = table[hash];
    }
    const elements = iframeDocument.querySelectorAll(".font-cxsecret");
    for (let i = 0; i < elements.length; i++) {
      const el = elements[i];
      let html2 = el.innerHTML;
      for (const key in match) {
        const value = String.fromCharCode(match[key]);
        const regExp = new RegExp(String.fromCharCode(Number(key)), "g");
        html2 = html2.replace(regExp, value);
      }
      el.classList.remove("font-cxsecret");
      el.innerHTML = html2;
    }
    function base64ToUint8Array(base64) {
      const data = window.atob(base64);
      const buffer = new Uint8Array(data.length);
      for (let i = 0; i < data.length; ++i) {
        buffer[i] = data.charCodeAt(i);
      }
      return buffer;
    }
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function hasLift(source) {
    return isFunction(source === null || source === void 0 ? void 0 : source.lift);
  }
  function operate(init) {
    return function(source) {
      if (hasLift(source)) {
        return source.lift(function(liftedSource) {
          try {
            return init(liftedSource, this);
          } catch (err) {
            this.error(err);
          }
        });
      }
      throw new TypeError("Unable to lift unknown Observable type");
    };
  }
  var extendStatics = function(d2, b2) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d3, b3) {
      d3.__proto__ = b3;
    } || function(d3, b3) {
      for (var p in b3) if (Object.prototype.hasOwnProperty.call(b3, p)) d3[p] = b3[p];
    };
    return extendStatics(d2, b2);
  };
  function __extends(d2, b2) {
    if (typeof b2 !== "function" && b2 !== null)
      throw new TypeError("Class extends value " + String(b2) + " is not a constructor or null");
    extendStatics(d2, b2);
    function __() {
      this.constructor = d2;
    }
    d2.prototype = b2 === null ? Object.create(b2) : (__.prototype = b2.prototype, new __());
  }
  function __awaiter(thisArg, _arguments, P2, generator) {
    function adopt(value) {
      return value instanceof P2 ? value : new P2(function(resolve) {
        resolve(value);
      });
    }
    return new (P2 || (P2 = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _2 = { label: 0, sent: function() {
      if (t[0] & 1) throw t[1];
      return t[1];
    }, trys: [], ops: [] }, f, y2, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n) {
      return function(v2) {
        return step([n, v2]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_2 = 0)), _2) try {
        if (f = 1, y2 && (t = op[0] & 2 ? y2["return"] : op[0] ? y2["throw"] || ((t = y2["return"]) && t.call(y2), 0) : y2.next) && !(t = t.call(y2, op[1])).done) return t;
        if (y2 = 0, t) op = [op[0] & 2, t.value];
        switch (op[0]) {
          case 0:
          case 1:
            t = op;
            break;
          case 4:
            _2.label++;
            return { value: op[1], done: false };
          case 5:
            _2.label++;
            y2 = op[1];
            op = [0];
            continue;
          case 7:
            op = _2.ops.pop();
            _2.trys.pop();
            continue;
          default:
            if (!(t = _2.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _2 = 0;
              continue;
            }
            if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
              _2.label = op[1];
              break;
            }
            if (op[0] === 6 && _2.label < t[1]) {
              _2.label = t[1];
              t = op;
              break;
            }
            if (t && _2.label < t[2]) {
              _2.label = t[2];
              _2.ops.push(op);
              break;
            }
            if (t[2]) _2.ops.pop();
            _2.trys.pop();
            continue;
        }
        op = body.call(thisArg, _2);
      } catch (e) {
        op = [6, e];
        y2 = 0;
      } finally {
        f = t = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __values(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m2 = s && o[s], i = 0;
    if (m2) return m2.call(o);
    if (o && typeof o.length === "number") return {
      next: function() {
        if (o && i >= o.length) o = void 0;
        return { value: o && o[i++], done: !o };
      }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
  }
  function __read(o, n) {
    var m2 = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m2) return o;
    var i = m2.call(o), r, ar = [], e;
    try {
      while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    } catch (error) {
      e = { error };
    } finally {
      try {
        if (r && !r.done && (m2 = i["return"])) m2.call(i);
      } finally {
        if (e) throw e.error;
      }
    }
    return ar;
  }
  function __spreadArray(to, from2, pack) {
    if (arguments.length === 2) for (var i = 0, l3 = from2.length, ar; i < l3; i++) {
      if (ar || !(i in from2)) {
        if (!ar) ar = Array.prototype.slice.call(from2, 0, i);
        ar[i] = from2[i];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from2));
  }
  function __await(v2) {
    return this instanceof __await ? (this.v = v2, this) : new __await(v2);
  }
  function __asyncGenerator(thisArg, _arguments, generator) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var g = generator.apply(thisArg, _arguments || []), i, q2 = [];
    return i = Object.create((typeof AsyncIterator === "function" ? AsyncIterator : Object).prototype), verb("next"), verb("throw"), verb("return", awaitReturn), i[Symbol.asyncIterator] = function() {
      return this;
    }, i;
    function awaitReturn(f) {
      return function(v2) {
        return Promise.resolve(v2).then(f, reject);
      };
    }
    function verb(n, f) {
      if (g[n]) {
        i[n] = function(v2) {
          return new Promise(function(a, b2) {
            q2.push([n, v2, a, b2]) > 1 || resume(n, v2);
          });
        };
        if (f) i[n] = f(i[n]);
      }
    }
    function resume(n, v2) {
      try {
        step(g[n](v2));
      } catch (e) {
        settle(q2[0][3], e);
      }
    }
    function step(r) {
      r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q2[0][2], r);
    }
    function fulfill(value) {
      resume("next", value);
    }
    function reject(value) {
      resume("throw", value);
    }
    function settle(f, v2) {
      if (f(v2), q2.shift(), q2.length) resume(q2[0][0], q2[0][1]);
    }
  }
  function __asyncValues(o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m2 = o[Symbol.asyncIterator], i;
    return m2 ? m2.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function() {
      return this;
    }, i);
    function verb(n) {
      i[n] = o[n] && function(v2) {
        return new Promise(function(resolve, reject) {
          v2 = o[n](v2), settle(resolve, reject, v2.done, v2.value);
        });
      };
    }
    function settle(resolve, reject, d2, v2) {
      Promise.resolve(v2).then(function(v3) {
        resolve({ value: v3, done: d2 });
      }, reject);
    }
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message2) {
    var e = new Error(message2);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
  };
  var isArrayLike = function(x) {
    return x && typeof x.length === "number" && typeof x !== "function";
  };
  function isPromise(value) {
    return isFunction(value === null || value === void 0 ? void 0 : value.then);
  }
  function createErrorClass(createImpl) {
    var _super = function(instance) {
      Error.call(instance);
      instance.stack = new Error().stack;
    };
    var ctorFunc = createImpl(_super);
    ctorFunc.prototype = Object.create(Error.prototype);
    ctorFunc.prototype.constructor = ctorFunc;
    return ctorFunc;
  }
  var UnsubscriptionError = createErrorClass(function(_super) {
    return function UnsubscriptionErrorImpl(errors) {
      _super(this);
      this.message = errors ? errors.length + " errors occurred during unsubscription:\n" + errors.map(function(err, i) {
        return i + 1 + ") " + err.toString();
      }).join("\n  ") : "";
      this.name = "UnsubscriptionError";
      this.errors = errors;
    };
  });
  function arrRemove(arr, item) {
    if (arr) {
      var index = arr.indexOf(item);
      0 <= index && arr.splice(index, 1);
    }
  }
  var Subscription = function() {
    function Subscription2(initialTeardown) {
      this.initialTeardown = initialTeardown;
      this.closed = false;
      this._parentage = null;
      this._finalizers = null;
    }
    Subscription2.prototype.unsubscribe = function() {
      var e_1, _a2, e_2, _b;
      var errors;
      if (!this.closed) {
        this.closed = true;
        var _parentage = this._parentage;
        if (_parentage) {
          this._parentage = null;
          if (Array.isArray(_parentage)) {
            try {
              for (var _parentage_1 = __values(_parentage), _parentage_1_1 = _parentage_1.next(); !_parentage_1_1.done; _parentage_1_1 = _parentage_1.next()) {
                var parent_1 = _parentage_1_1.value;
                parent_1.remove(this);
              }
            } catch (e_1_1) {
              e_1 = { error: e_1_1 };
            } finally {
              try {
                if (_parentage_1_1 && !_parentage_1_1.done && (_a2 = _parentage_1.return)) _a2.call(_parentage_1);
              } finally {
                if (e_1) throw e_1.error;
              }
            }
          } else {
            _parentage.remove(this);
          }
        }
        var initialFinalizer = this.initialTeardown;
        if (isFunction(initialFinalizer)) {
          try {
            initialFinalizer();
          } catch (e) {
            errors = e instanceof UnsubscriptionError ? e.errors : [e];
          }
        }
        var _finalizers = this._finalizers;
        if (_finalizers) {
          this._finalizers = null;
          try {
            for (var _finalizers_1 = __values(_finalizers), _finalizers_1_1 = _finalizers_1.next(); !_finalizers_1_1.done; _finalizers_1_1 = _finalizers_1.next()) {
              var finalizer = _finalizers_1_1.value;
              try {
                execFinalizer(finalizer);
              } catch (err) {
                errors = errors !== null && errors !== void 0 ? errors : [];
                if (err instanceof UnsubscriptionError) {
                  errors = __spreadArray(__spreadArray([], __read(errors)), __read(err.errors));
                } else {
                  errors.push(err);
                }
              }
            }
          } catch (e_2_1) {
            e_2 = { error: e_2_1 };
          } finally {
            try {
              if (_finalizers_1_1 && !_finalizers_1_1.done && (_b = _finalizers_1.return)) _b.call(_finalizers_1);
            } finally {
              if (e_2) throw e_2.error;
            }
          }
        }
        if (errors) {
          throw new UnsubscriptionError(errors);
        }
      }
    };
    Subscription2.prototype.add = function(teardown) {
      var _a2;
      if (teardown && teardown !== this) {
        if (this.closed) {
          execFinalizer(teardown);
        } else {
          if (teardown instanceof Subscription2) {
            if (teardown.closed || teardown._hasParent(this)) {
              return;
            }
            teardown._addParent(this);
          }
          (this._finalizers = (_a2 = this._finalizers) !== null && _a2 !== void 0 ? _a2 : []).push(teardown);
        }
      }
    };
    Subscription2.prototype._hasParent = function(parent) {
      var _parentage = this._parentage;
      return _parentage === parent || Array.isArray(_parentage) && _parentage.includes(parent);
    };
    Subscription2.prototype._addParent = function(parent) {
      var _parentage = this._parentage;
      this._parentage = Array.isArray(_parentage) ? (_parentage.push(parent), _parentage) : _parentage ? [_parentage, parent] : parent;
    };
    Subscription2.prototype._removeParent = function(parent) {
      var _parentage = this._parentage;
      if (_parentage === parent) {
        this._parentage = null;
      } else if (Array.isArray(_parentage)) {
        arrRemove(_parentage, parent);
      }
    };
    Subscription2.prototype.remove = function(teardown) {
      var _finalizers = this._finalizers;
      _finalizers && arrRemove(_finalizers, teardown);
      if (teardown instanceof Subscription2) {
        teardown._removeParent(this);
      }
    };
    Subscription2.EMPTY = function() {
      var empty = new Subscription2();
      empty.closed = true;
      return empty;
    }();
    return Subscription2;
  }();
  Subscription.EMPTY;
  function isSubscription(value) {
    return value instanceof Subscription || value && "closed" in value && isFunction(value.remove) && isFunction(value.add) && isFunction(value.unsubscribe);
  }
  function execFinalizer(finalizer) {
    if (isFunction(finalizer)) {
      finalizer();
    } else {
      finalizer.unsubscribe();
    }
  }
  var config = {
    Promise: void 0,
    useDeprecatedNextContext: false
  };
  var timeoutProvider = {
    setTimeout: function(handler, timeout) {
      var args = [];
      for (var _i = 2; _i < arguments.length; _i++) {
        args[_i - 2] = arguments[_i];
      }
      return setTimeout.apply(void 0, __spreadArray([handler, timeout], __read(args)));
    },
    clearTimeout: function(handle) {
      return clearTimeout(handle);
    },
    delegate: void 0
  };
  function reportUnhandledError(err) {
    timeoutProvider.setTimeout(function() {
      {
        throw err;
      }
    });
  }
  function noop() {
  }
  function errorContext(cb) {
    {
      cb();
    }
  }
  var Subscriber = function(_super) {
    __extends(Subscriber2, _super);
    function Subscriber2(destination) {
      var _this = _super.call(this) || this;
      _this.isStopped = false;
      if (destination) {
        _this.destination = destination;
        if (isSubscription(destination)) {
          destination.add(_this);
        }
      } else {
        _this.destination = EMPTY_OBSERVER;
      }
      return _this;
    }
    Subscriber2.create = function(next, error, complete) {
      return new SafeSubscriber(next, error, complete);
    };
    Subscriber2.prototype.next = function(value) {
      if (this.isStopped) ;
      else {
        this._next(value);
      }
    };
    Subscriber2.prototype.error = function(err) {
      if (this.isStopped) ;
      else {
        this.isStopped = true;
        this._error(err);
      }
    };
    Subscriber2.prototype.complete = function() {
      if (this.isStopped) ;
      else {
        this.isStopped = true;
        this._complete();
      }
    };
    Subscriber2.prototype.unsubscribe = function() {
      if (!this.closed) {
        this.isStopped = true;
        _super.prototype.unsubscribe.call(this);
        this.destination = null;
      }
    };
    Subscriber2.prototype._next = function(value) {
      this.destination.next(value);
    };
    Subscriber2.prototype._error = function(err) {
      try {
        this.destination.error(err);
      } finally {
        this.unsubscribe();
      }
    };
    Subscriber2.prototype._complete = function() {
      try {
        this.destination.complete();
      } finally {
        this.unsubscribe();
      }
    };
    return Subscriber2;
  }(Subscription);
  var _bind = Function.prototype.bind;
  function bind(fn, thisArg) {
    return _bind.call(fn, thisArg);
  }
  var ConsumerObserver = function() {
    function ConsumerObserver2(partialObserver) {
      this.partialObserver = partialObserver;
    }
    ConsumerObserver2.prototype.next = function(value) {
      var partialObserver = this.partialObserver;
      if (partialObserver.next) {
        try {
          partialObserver.next(value);
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    ConsumerObserver2.prototype.error = function(err) {
      var partialObserver = this.partialObserver;
      if (partialObserver.error) {
        try {
          partialObserver.error(err);
        } catch (error) {
          handleUnhandledError(error);
        }
      } else {
        handleUnhandledError(err);
      }
    };
    ConsumerObserver2.prototype.complete = function() {
      var partialObserver = this.partialObserver;
      if (partialObserver.complete) {
        try {
          partialObserver.complete();
        } catch (error) {
          handleUnhandledError(error);
        }
      }
    };
    return ConsumerObserver2;
  }();
  var SafeSubscriber = function(_super) {
    __extends(SafeSubscriber2, _super);
    function SafeSubscriber2(observerOrNext, error, complete) {
      var _this = _super.call(this) || this;
      var partialObserver;
      if (isFunction(observerOrNext) || !observerOrNext) {
        partialObserver = {
          next: observerOrNext !== null && observerOrNext !== void 0 ? observerOrNext : void 0,
          error: error !== null && error !== void 0 ? error : void 0,
          complete: complete !== null && complete !== void 0 ? complete : void 0
        };
      } else {
        var context_1;
        if (_this && config.useDeprecatedNextContext) {
          context_1 = Object.create(observerOrNext);
          context_1.unsubscribe = function() {
            return _this.unsubscribe();
          };
          partialObserver = {
            next: observerOrNext.next && bind(observerOrNext.next, context_1),
            error: observerOrNext.error && bind(observerOrNext.error, context_1),
            complete: observerOrNext.complete && bind(observerOrNext.complete, context_1)
          };
        } else {
          partialObserver = observerOrNext;
        }
      }
      _this.destination = new ConsumerObserver(partialObserver);
      return _this;
    }
    return SafeSubscriber2;
  }(Subscriber);
  function handleUnhandledError(error) {
    {
      reportUnhandledError(error);
    }
  }
  function defaultErrorHandler(err) {
    throw err;
  }
  var EMPTY_OBSERVER = {
    closed: true,
    next: noop,
    error: defaultErrorHandler,
    complete: noop
  };
  var observable = function() {
    return typeof Symbol === "function" && Symbol.observable || "@@observable";
  }();
  function identity(x) {
    return x;
  }
  function pipeFromArray(fns) {
    if (fns.length === 0) {
      return identity;
    }
    if (fns.length === 1) {
      return fns[0];
    }
    return function piped(input) {
      return fns.reduce(function(prev, fn) {
        return fn(prev);
      }, input);
    };
  }
  var Observable = function() {
    function Observable2(subscribe) {
      if (subscribe) {
        this._subscribe = subscribe;
      }
    }
    Observable2.prototype.lift = function(operator) {
      var observable2 = new Observable2();
      observable2.source = this;
      observable2.operator = operator;
      return observable2;
    };
    Observable2.prototype.subscribe = function(observerOrNext, error, complete) {
      var _this = this;
      var subscriber = isSubscriber(observerOrNext) ? observerOrNext : new SafeSubscriber(observerOrNext, error, complete);
      errorContext(function() {
        var _a2 = _this, operator = _a2.operator, source = _a2.source;
        subscriber.add(operator ? operator.call(subscriber, source) : source ? _this._subscribe(subscriber) : _this._trySubscribe(subscriber));
      });
      return subscriber;
    };
    Observable2.prototype._trySubscribe = function(sink) {
      try {
        return this._subscribe(sink);
      } catch (err) {
        sink.error(err);
      }
    };
    Observable2.prototype.forEach = function(next, promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var subscriber = new SafeSubscriber({
          next: function(value) {
            try {
              next(value);
            } catch (err) {
              reject(err);
              subscriber.unsubscribe();
            }
          },
          error: reject,
          complete: resolve
        });
        _this.subscribe(subscriber);
      });
    };
    Observable2.prototype._subscribe = function(subscriber) {
      var _a2;
      return (_a2 = this.source) === null || _a2 === void 0 ? void 0 : _a2.subscribe(subscriber);
    };
    Observable2.prototype[observable] = function() {
      return this;
    };
    Observable2.prototype.pipe = function() {
      var operations = [];
      for (var _i = 0; _i < arguments.length; _i++) {
        operations[_i] = arguments[_i];
      }
      return pipeFromArray(operations)(this);
    };
    Observable2.prototype.toPromise = function(promiseCtor) {
      var _this = this;
      promiseCtor = getPromiseCtor(promiseCtor);
      return new promiseCtor(function(resolve, reject) {
        var value;
        _this.subscribe(function(x) {
          return value = x;
        }, function(err) {
          return reject(err);
        }, function() {
          return resolve(value);
        });
      });
    };
    Observable2.create = function(subscribe) {
      return new Observable2(subscribe);
    };
    return Observable2;
  }();
  function getPromiseCtor(promiseCtor) {
    var _a2;
    return (_a2 = promiseCtor !== null && promiseCtor !== void 0 ? promiseCtor : config.Promise) !== null && _a2 !== void 0 ? _a2 : Promise;
  }
  function isObserver(value) {
    return value && isFunction(value.next) && isFunction(value.error) && isFunction(value.complete);
  }
  function isSubscriber(value) {
    return value && value instanceof Subscriber || isObserver(value) && isSubscription(value);
  }
  function isInteropObservable(input) {
    return isFunction(input[observable]);
  }
  function isAsyncIterable(obj) {
    return Symbol.asyncIterator && isFunction(obj === null || obj === void 0 ? void 0 : obj[Symbol.asyncIterator]);
  }
  function createInvalidObservableTypeError(input) {
    return new TypeError("You provided " + (input !== null && typeof input === "object" ? "an invalid object" : "'" + input + "'") + " where a stream was expected. You can provide an Observable, Promise, ReadableStream, Array, AsyncIterable, or Iterable.");
  }
  function getSymbolIterator() {
    if (typeof Symbol !== "function" || !Symbol.iterator) {
      return "@@iterator";
    }
    return Symbol.iterator;
  }
  var iterator = getSymbolIterator();
  function isIterable(input) {
    return isFunction(input === null || input === void 0 ? void 0 : input[iterator]);
  }
  function readableStreamLikeToAsyncGenerator(readableStream) {
    return __asyncGenerator(this, arguments, function readableStreamLikeToAsyncGenerator_1() {
      var reader, _a2, value, done;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            reader = readableStream.getReader();
            _b.label = 1;
          case 1:
            _b.trys.push([1, , 9, 10]);
            _b.label = 2;
          case 2:
            return [4, __await(reader.read())];
          case 3:
            _a2 = _b.sent(), value = _a2.value, done = _a2.done;
            if (!done) return [3, 5];
            return [4, __await(void 0)];
          case 4:
            return [2, _b.sent()];
          case 5:
            return [4, __await(value)];
          case 6:
            return [4, _b.sent()];
          case 7:
            _b.sent();
            return [3, 2];
          case 8:
            return [3, 10];
          case 9:
            reader.releaseLock();
            return [7];
          case 10:
            return [2];
        }
      });
    });
  }
  function isReadableStreamLike(obj) {
    return isFunction(obj === null || obj === void 0 ? void 0 : obj.getReader);
  }
  function innerFrom(input) {
    if (input instanceof Observable) {
      return input;
    }
    if (input != null) {
      if (isInteropObservable(input)) {
        return fromInteropObservable(input);
      }
      if (isArrayLike(input)) {
        return fromArrayLike(input);
      }
      if (isPromise(input)) {
        return fromPromise(input);
      }
      if (isAsyncIterable(input)) {
        return fromAsyncIterable(input);
      }
      if (isIterable(input)) {
        return fromIterable(input);
      }
      if (isReadableStreamLike(input)) {
        return fromReadableStreamLike(input);
      }
    }
    throw createInvalidObservableTypeError(input);
  }
  function fromInteropObservable(obj) {
    return new Observable(function(subscriber) {
      var obs = obj[observable]();
      if (isFunction(obs.subscribe)) {
        return obs.subscribe(subscriber);
      }
      throw new TypeError("Provided object does not correctly implement Symbol.observable");
    });
  }
  function fromArrayLike(array) {
    return new Observable(function(subscriber) {
      for (var i = 0; i < array.length && !subscriber.closed; i++) {
        subscriber.next(array[i]);
      }
      subscriber.complete();
    });
  }
  function fromPromise(promise) {
    return new Observable(function(subscriber) {
      promise.then(function(value) {
        if (!subscriber.closed) {
          subscriber.next(value);
          subscriber.complete();
        }
      }, function(err) {
        return subscriber.error(err);
      }).then(null, reportUnhandledError);
    });
  }
  function fromIterable(iterable) {
    return new Observable(function(subscriber) {
      var e_1, _a2;
      try {
        for (var iterable_1 = __values(iterable), iterable_1_1 = iterable_1.next(); !iterable_1_1.done; iterable_1_1 = iterable_1.next()) {
          var value = iterable_1_1.value;
          subscriber.next(value);
          if (subscriber.closed) {
            return;
          }
        }
      } catch (e_1_1) {
        e_1 = { error: e_1_1 };
      } finally {
        try {
          if (iterable_1_1 && !iterable_1_1.done && (_a2 = iterable_1.return)) _a2.call(iterable_1);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
      subscriber.complete();
    });
  }
  function fromAsyncIterable(asyncIterable) {
    return new Observable(function(subscriber) {
      process(asyncIterable, subscriber).catch(function(err) {
        return subscriber.error(err);
      });
    });
  }
  function fromReadableStreamLike(readableStream) {
    return fromAsyncIterable(readableStreamLikeToAsyncGenerator(readableStream));
  }
  function process(asyncIterable, subscriber) {
    var asyncIterable_1, asyncIterable_1_1;
    var e_2, _a2;
    return __awaiter(this, void 0, void 0, function() {
      var value, e_2_1;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 5, 6, 11]);
            asyncIterable_1 = __asyncValues(asyncIterable);
            _b.label = 1;
          case 1:
            return [4, asyncIterable_1.next()];
          case 2:
            if (!(asyncIterable_1_1 = _b.sent(), !asyncIterable_1_1.done)) return [3, 4];
            value = asyncIterable_1_1.value;
            subscriber.next(value);
            if (subscriber.closed) {
              return [2];
            }
            _b.label = 3;
          case 3:
            return [3, 1];
          case 4:
            return [3, 11];
          case 5:
            e_2_1 = _b.sent();
            e_2 = { error: e_2_1 };
            return [3, 11];
          case 6:
            _b.trys.push([6, , 9, 10]);
            if (!(asyncIterable_1_1 && !asyncIterable_1_1.done && (_a2 = asyncIterable_1.return))) return [3, 8];
            return [4, _a2.call(asyncIterable_1)];
          case 7:
            _b.sent();
            _b.label = 8;
          case 8:
            return [3, 10];
          case 9:
            if (e_2) throw e_2.error;
            return [7];
          case 10:
            return [7];
          case 11:
            subscriber.complete();
            return [2];
        }
      });
    });
  }
  function createOperatorSubscriber(destination, onNext, onComplete, onError, onFinalize) {
    return new OperatorSubscriber(destination, onNext, onComplete, onError, onFinalize);
  }
  var OperatorSubscriber = function(_super) {
    __extends(OperatorSubscriber2, _super);
    function OperatorSubscriber2(destination, onNext, onComplete, onError, onFinalize, shouldUnsubscribe) {
      var _this = _super.call(this, destination) || this;
      _this.onFinalize = onFinalize;
      _this.shouldUnsubscribe = shouldUnsubscribe;
      _this._next = onNext ? function(value) {
        try {
          onNext(value);
        } catch (err) {
          destination.error(err);
        }
      } : _super.prototype._next;
      _this._error = onError ? function(err) {
        try {
          onError(err);
        } catch (err2) {
          destination.error(err2);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._error;
      _this._complete = onComplete ? function() {
        try {
          onComplete();
        } catch (err) {
          destination.error(err);
        } finally {
          this.unsubscribe();
        }
      } : _super.prototype._complete;
      return _this;
    }
    OperatorSubscriber2.prototype.unsubscribe = function() {
      var _a2;
      if (!this.shouldUnsubscribe || this.shouldUnsubscribe()) {
        var closed_1 = this.closed;
        _super.prototype.unsubscribe.call(this);
        !closed_1 && ((_a2 = this.onFinalize) === null || _a2 === void 0 ? void 0 : _a2.call(this));
      }
    };
    return OperatorSubscriber2;
  }(Subscriber);
  function map(project, thisArg) {
    return operate(function(source, subscriber) {
      var index = 0;
      source.subscribe(createOperatorSubscriber(subscriber, function(value) {
        subscriber.next(project.call(thisArg, value, index++));
      }));
    });
  }
  function mergeInternals(source, subscriber, project, concurrent, onBeforeNext, expand, innerSubScheduler, additionalFinalizer) {
    var buffer = [];
    var active = 0;
    var index = 0;
    var isComplete = false;
    var checkComplete = function() {
      if (isComplete && !buffer.length && !active) {
        subscriber.complete();
      }
    };
    var outerNext = function(value) {
      return active < concurrent ? doInnerSub(value) : buffer.push(value);
    };
    var doInnerSub = function(value) {
      active++;
      var innerComplete = false;
      innerFrom(project(value, index++)).subscribe(createOperatorSubscriber(subscriber, function(innerValue) {
        {
          subscriber.next(innerValue);
        }
      }, function() {
        innerComplete = true;
      }, void 0, function() {
        if (innerComplete) {
          try {
            active--;
            var _loop_1 = function() {
              var bufferedValue = buffer.shift();
              if (innerSubScheduler) ;
              else {
                doInnerSub(bufferedValue);
              }
            };
            while (buffer.length && active < concurrent) {
              _loop_1();
            }
            checkComplete();
          } catch (err) {
            subscriber.error(err);
          }
        }
      }));
    };
    source.subscribe(createOperatorSubscriber(subscriber, outerNext, function() {
      isComplete = true;
      checkComplete();
    }));
    return function() {
    };
  }
  function mergeMap(project, resultSelector, concurrent) {
    if (concurrent === void 0) {
      concurrent = Infinity;
    }
    if (isFunction(resultSelector)) {
      return mergeMap(function(a, i) {
        return map(function(b2, ii) {
          return resultSelector(a, b2, i, ii);
        })(innerFrom(project(a, i)));
      }, concurrent);
    } else if (typeof resultSelector === "number") {
      concurrent = resultSelector;
    }
    return operate(function(source, subscriber) {
      return mergeInternals(source, subscriber, project, concurrent);
    });
  }
  function mergeAll(concurrent) {
    return mergeMap(identity, concurrent);
  }
  function concatAll() {
    return mergeAll(1);
  }
  function concatMap(project, resultSelector) {
    return isFunction(resultSelector) ? mergeMap(project, resultSelector, 1) : mergeMap(project, 1);
  }
  /*! @license DOMPurify 3.2.1 | (c) Cure53 and other contributors | Released under the Apache license 2.0 and Mozilla Public License 2.0 | github.com/cure53/DOMPurify/blob/3.2.1/LICENSE */
  const {
    entries,
    setPrototypeOf,
    isFrozen,
    getPrototypeOf,
    getOwnPropertyDescriptor
  } = Object;
  let {
    freeze,
    seal,
    create
  } = Object;
  let {
    apply,
    construct
  } = typeof Reflect !== "undefined" && Reflect;
  if (!freeze) {
    freeze = function freeze2(x) {
      return x;
    };
  }
  if (!seal) {
    seal = function seal2(x) {
      return x;
    };
  }
  if (!apply) {
    apply = function apply2(fun, thisValue, args) {
      return fun.apply(thisValue, args);
    };
  }
  if (!construct) {
    construct = function construct2(Func, args) {
      return new Func(...args);
    };
  }
  const arrayForEach = unapply(Array.prototype.forEach);
  const arrayPop = unapply(Array.prototype.pop);
  const arrayPush = unapply(Array.prototype.push);
  const stringToLowerCase = unapply(String.prototype.toLowerCase);
  const stringToString = unapply(String.prototype.toString);
  const stringMatch = unapply(String.prototype.match);
  const stringReplace = unapply(String.prototype.replace);
  const stringIndexOf = unapply(String.prototype.indexOf);
  const stringTrim = unapply(String.prototype.trim);
  const objectHasOwnProperty = unapply(Object.prototype.hasOwnProperty);
  const regExpTest = unapply(RegExp.prototype.test);
  const typeErrorCreate = unconstruct(TypeError);
  function unapply(func) {
    return function(thisArg) {
      for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }
      return apply(func, thisArg, args);
    };
  }
  function unconstruct(func) {
    return function() {
      for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }
      return construct(func, args);
    };
  }
  function addToSet(set, array) {
    let transformCaseFunc = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : stringToLowerCase;
    if (setPrototypeOf) {
      setPrototypeOf(set, null);
    }
    let l3 = array.length;
    while (l3--) {
      let element = array[l3];
      if (typeof element === "string") {
        const lcElement = transformCaseFunc(element);
        if (lcElement !== element) {
          if (!isFrozen(array)) {
            array[l3] = lcElement;
          }
          element = lcElement;
        }
      }
      set[element] = true;
    }
    return set;
  }
  function cleanArray(array) {
    for (let index = 0; index < array.length; index++) {
      const isPropertyExist = objectHasOwnProperty(array, index);
      if (!isPropertyExist) {
        array[index] = null;
      }
    }
    return array;
  }
  function clone(object) {
    const newObject = create(null);
    for (const [property, value] of entries(object)) {
      const isPropertyExist = objectHasOwnProperty(object, property);
      if (isPropertyExist) {
        if (Array.isArray(value)) {
          newObject[property] = cleanArray(value);
        } else if (value && typeof value === "object" && value.constructor === Object) {
          newObject[property] = clone(value);
        } else {
          newObject[property] = value;
        }
      }
    }
    return newObject;
  }
  function lookupGetter(object, prop) {
    while (object !== null) {
      const desc = getOwnPropertyDescriptor(object, prop);
      if (desc) {
        if (desc.get) {
          return unapply(desc.get);
        }
        if (typeof desc.value === "function") {
          return unapply(desc.value);
        }
      }
      object = getPrototypeOf(object);
    }
    function fallbackValue() {
      return null;
    }
    return fallbackValue;
  }
  const html$1 = freeze(["a", "abbr", "acronym", "address", "area", "article", "aside", "audio", "b", "bdi", "bdo", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "decorator", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "element", "em", "fieldset", "figcaption", "figure", "font", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "head", "header", "hgroup", "hr", "html", "i", "img", "input", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "marquee", "menu", "menuitem", "meter", "nav", "nobr", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "shadow", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "tr", "track", "tt", "u", "ul", "var", "video", "wbr"]);
  const svg$1 = freeze(["svg", "a", "altglyph", "altglyphdef", "altglyphitem", "animatecolor", "animatemotion", "animatetransform", "circle", "clippath", "defs", "desc", "ellipse", "filter", "font", "g", "glyph", "glyphref", "hkern", "image", "line", "lineargradient", "marker", "mask", "metadata", "mpath", "path", "pattern", "polygon", "polyline", "radialgradient", "rect", "stop", "style", "switch", "symbol", "text", "textpath", "title", "tref", "tspan", "view", "vkern"]);
  const svgFilters = freeze(["feBlend", "feColorMatrix", "feComponentTransfer", "feComposite", "feConvolveMatrix", "feDiffuseLighting", "feDisplacementMap", "feDistantLight", "feDropShadow", "feFlood", "feFuncA", "feFuncB", "feFuncG", "feFuncR", "feGaussianBlur", "feImage", "feMerge", "feMergeNode", "feMorphology", "feOffset", "fePointLight", "feSpecularLighting", "feSpotLight", "feTile", "feTurbulence"]);
  const svgDisallowed = freeze(["animate", "color-profile", "cursor", "discard", "font-face", "font-face-format", "font-face-name", "font-face-src", "font-face-uri", "foreignobject", "hatch", "hatchpath", "mesh", "meshgradient", "meshpatch", "meshrow", "missing-glyph", "script", "set", "solidcolor", "unknown", "use"]);
  const mathMl$1 = freeze(["math", "menclose", "merror", "mfenced", "mfrac", "mglyph", "mi", "mlabeledtr", "mmultiscripts", "mn", "mo", "mover", "mpadded", "mphantom", "mroot", "mrow", "ms", "mspace", "msqrt", "mstyle", "msub", "msup", "msubsup", "mtable", "mtd", "mtext", "mtr", "munder", "munderover", "mprescripts"]);
  const mathMlDisallowed = freeze(["maction", "maligngroup", "malignmark", "mlongdiv", "mscarries", "mscarry", "msgroup", "mstack", "msline", "msrow", "semantics", "annotation", "annotation-xml", "mprescripts", "none"]);
  const text = freeze(["#text"]);
  const html = freeze(["accept", "action", "align", "alt", "autocapitalize", "autocomplete", "autopictureinpicture", "autoplay", "background", "bgcolor", "border", "capture", "cellpadding", "cellspacing", "checked", "cite", "class", "clear", "color", "cols", "colspan", "controls", "controlslist", "coords", "crossorigin", "datetime", "decoding", "default", "dir", "disabled", "disablepictureinpicture", "disableremoteplayback", "download", "draggable", "enctype", "enterkeyhint", "face", "for", "headers", "height", "hidden", "high", "href", "hreflang", "id", "inputmode", "integrity", "ismap", "kind", "label", "lang", "list", "loading", "loop", "low", "max", "maxlength", "media", "method", "min", "minlength", "multiple", "muted", "name", "nonce", "noshade", "novalidate", "nowrap", "open", "optimum", "pattern", "placeholder", "playsinline", "popover", "popovertarget", "popovertargetaction", "poster", "preload", "pubdate", "radiogroup", "readonly", "rel", "required", "rev", "reversed", "role", "rows", "rowspan", "spellcheck", "scope", "selected", "shape", "size", "sizes", "span", "srclang", "start", "src", "srcset", "step", "style", "summary", "tabindex", "title", "translate", "type", "usemap", "valign", "value", "width", "wrap", "xmlns", "slot"]);
  const svg = freeze(["accent-height", "accumulate", "additive", "alignment-baseline", "amplitude", "ascent", "attributename", "attributetype", "azimuth", "basefrequency", "baseline-shift", "begin", "bias", "by", "class", "clip", "clippathunits", "clip-path", "clip-rule", "color", "color-interpolation", "color-interpolation-filters", "color-profile", "color-rendering", "cx", "cy", "d", "dx", "dy", "diffuseconstant", "direction", "display", "divisor", "dur", "edgemode", "elevation", "end", "exponent", "fill", "fill-opacity", "fill-rule", "filter", "filterunits", "flood-color", "flood-opacity", "font-family", "font-size", "font-size-adjust", "font-stretch", "font-style", "font-variant", "font-weight", "fx", "fy", "g1", "g2", "glyph-name", "glyphref", "gradientunits", "gradienttransform", "height", "href", "id", "image-rendering", "in", "in2", "intercept", "k", "k1", "k2", "k3", "k4", "kerning", "keypoints", "keysplines", "keytimes", "lang", "lengthadjust", "letter-spacing", "kernelmatrix", "kernelunitlength", "lighting-color", "local", "marker-end", "marker-mid", "marker-start", "markerheight", "markerunits", "markerwidth", "maskcontentunits", "maskunits", "max", "mask", "media", "method", "mode", "min", "name", "numoctaves", "offset", "operator", "opacity", "order", "orient", "orientation", "origin", "overflow", "paint-order", "path", "pathlength", "patterncontentunits", "patterntransform", "patternunits", "points", "preservealpha", "preserveaspectratio", "primitiveunits", "r", "rx", "ry", "radius", "refx", "refy", "repeatcount", "repeatdur", "restart", "result", "rotate", "scale", "seed", "shape-rendering", "slope", "specularconstant", "specularexponent", "spreadmethod", "startoffset", "stddeviation", "stitchtiles", "stop-color", "stop-opacity", "stroke-dasharray", "stroke-dashoffset", "stroke-linecap", "stroke-linejoin", "stroke-miterlimit", "stroke-opacity", "stroke", "stroke-width", "style", "surfacescale", "systemlanguage", "tabindex", "tablevalues", "targetx", "targety", "transform", "transform-origin", "text-anchor", "text-decoration", "text-rendering", "textlength", "type", "u1", "u2", "unicode", "values", "viewbox", "visibility", "version", "vert-adv-y", "vert-origin-x", "vert-origin-y", "width", "word-spacing", "wrap", "writing-mode", "xchannelselector", "ychannelselector", "x", "x1", "x2", "xmlns", "y", "y1", "y2", "z", "zoomandpan"]);
  const mathMl = freeze(["accent", "accentunder", "align", "bevelled", "close", "columnsalign", "columnlines", "columnspan", "denomalign", "depth", "dir", "display", "displaystyle", "encoding", "fence", "frame", "height", "href", "id", "largeop", "length", "linethickness", "lspace", "lquote", "mathbackground", "mathcolor", "mathsize", "mathvariant", "maxsize", "minsize", "movablelimits", "notation", "numalign", "open", "rowalign", "rowlines", "rowspacing", "rowspan", "rspace", "rquote", "scriptlevel", "scriptminsize", "scriptsizemultiplier", "selection", "separator", "separators", "stretchy", "subscriptshift", "supscriptshift", "symmetric", "voffset", "width", "xmlns"]);
  const xml = freeze(["xlink:href", "xml:id", "xlink:title", "xml:space", "xmlns:xlink"]);
  const MUSTACHE_EXPR = seal(/\{\{[\w\W]*|[\w\W]*\}\}/gm);
  const ERB_EXPR = seal(/<%[\w\W]*|[\w\W]*%>/gm);
  const TMPLIT_EXPR = seal(/\${[\w\W]*}/gm);
  const DATA_ATTR = seal(/^data-[\-\w.\u00B7-\uFFFF]/);
  const ARIA_ATTR = seal(/^aria-[\-\w]+$/);
  const IS_ALLOWED_URI = seal(
    /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i
    // eslint-disable-line no-useless-escape
  );
  const IS_SCRIPT_OR_DATA = seal(/^(?:\w+script|data):/i);
  const ATTR_WHITESPACE = seal(
    /[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g
    // eslint-disable-line no-control-regex
  );
  const DOCTYPE_NAME = seal(/^html$/i);
  const CUSTOM_ELEMENT = seal(/^[a-z][.\w]*(-[.\w]+)+$/i);
  var EXPRESSIONS = /* @__PURE__ */ Object.freeze({
    __proto__: null,
    ARIA_ATTR,
    ATTR_WHITESPACE,
    CUSTOM_ELEMENT,
    DATA_ATTR,
    DOCTYPE_NAME,
    ERB_EXPR,
    IS_ALLOWED_URI,
    IS_SCRIPT_OR_DATA,
    MUSTACHE_EXPR,
    TMPLIT_EXPR
  });
  const NODE_TYPE = {
    element: 1,
    text: 3,
    // Deprecated
    progressingInstruction: 7,
    comment: 8,
    document: 9
  };
  const getGlobal = function getGlobal2() {
    return typeof window === "undefined" ? null : window;
  };
  const _createTrustedTypesPolicy = function _createTrustedTypesPolicy2(trustedTypes, purifyHostElement) {
    if (typeof trustedTypes !== "object" || typeof trustedTypes.createPolicy !== "function") {
      return null;
    }
    let suffix = null;
    const ATTR_NAME = "data-tt-policy-suffix";
    if (purifyHostElement && purifyHostElement.hasAttribute(ATTR_NAME)) {
      suffix = purifyHostElement.getAttribute(ATTR_NAME);
    }
    const policyName = "dompurify" + (suffix ? "#" + suffix : "");
    try {
      return trustedTypes.createPolicy(policyName, {
        createHTML(html2) {
          return html2;
        },
        createScriptURL(scriptUrl) {
          return scriptUrl;
        }
      });
    } catch (_2) {
      console.warn("TrustedTypes policy " + policyName + " could not be created.");
      return null;
    }
  };
  function createDOMPurify() {
    let window2 = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : getGlobal();
    const DOMPurify = (root) => createDOMPurify(root);
    DOMPurify.version = "3.2.1";
    DOMPurify.removed = [];
    if (!window2 || !window2.document || window2.document.nodeType !== NODE_TYPE.document) {
      DOMPurify.isSupported = false;
      return DOMPurify;
    }
    let {
      document: document2
    } = window2;
    const originalDocument = document2;
    const currentScript = originalDocument.currentScript;
    const {
      DocumentFragment,
      HTMLTemplateElement,
      Node,
      Element,
      NodeFilter,
      NamedNodeMap = window2.NamedNodeMap || window2.MozNamedAttrMap,
      HTMLFormElement,
      DOMParser: DOMParser2,
      trustedTypes
    } = window2;
    const ElementPrototype = Element.prototype;
    const cloneNode = lookupGetter(ElementPrototype, "cloneNode");
    const remove = lookupGetter(ElementPrototype, "remove");
    const getNextSibling = lookupGetter(ElementPrototype, "nextSibling");
    const getChildNodes = lookupGetter(ElementPrototype, "childNodes");
    const getParentNode = lookupGetter(ElementPrototype, "parentNode");
    if (typeof HTMLTemplateElement === "function") {
      const template = document2.createElement("template");
      if (template.content && template.content.ownerDocument) {
        document2 = template.content.ownerDocument;
      }
    }
    let trustedTypesPolicy;
    let emptyHTML = "";
    const {
      implementation,
      createNodeIterator,
      createDocumentFragment,
      getElementsByTagName
    } = document2;
    const {
      importNode
    } = originalDocument;
    let hooks = {};
    DOMPurify.isSupported = typeof entries === "function" && typeof getParentNode === "function" && implementation && implementation.createHTMLDocument !== void 0;
    const {
      MUSTACHE_EXPR: MUSTACHE_EXPR2,
      ERB_EXPR: ERB_EXPR2,
      TMPLIT_EXPR: TMPLIT_EXPR2,
      DATA_ATTR: DATA_ATTR2,
      ARIA_ATTR: ARIA_ATTR2,
      IS_SCRIPT_OR_DATA: IS_SCRIPT_OR_DATA2,
      ATTR_WHITESPACE: ATTR_WHITESPACE2,
      CUSTOM_ELEMENT: CUSTOM_ELEMENT2
    } = EXPRESSIONS;
    let {
      IS_ALLOWED_URI: IS_ALLOWED_URI$1
    } = EXPRESSIONS;
    let ALLOWED_TAGS = null;
    const DEFAULT_ALLOWED_TAGS = addToSet({}, [...html$1, ...svg$1, ...svgFilters, ...mathMl$1, ...text]);
    let ALLOWED_ATTR = null;
    const DEFAULT_ALLOWED_ATTR = addToSet({}, [...html, ...svg, ...mathMl, ...xml]);
    let CUSTOM_ELEMENT_HANDLING = Object.seal(create(null, {
      tagNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      attributeNameCheck: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: null
      },
      allowCustomizedBuiltInElements: {
        writable: true,
        configurable: false,
        enumerable: true,
        value: false
      }
    }));
    let FORBID_TAGS = null;
    let FORBID_ATTR = null;
    let ALLOW_ARIA_ATTR = true;
    let ALLOW_DATA_ATTR = true;
    let ALLOW_UNKNOWN_PROTOCOLS = false;
    let ALLOW_SELF_CLOSE_IN_ATTR = true;
    let SAFE_FOR_TEMPLATES = false;
    let SAFE_FOR_XML = true;
    let WHOLE_DOCUMENT = false;
    let SET_CONFIG = false;
    let FORCE_BODY = false;
    let RETURN_DOM = false;
    let RETURN_DOM_FRAGMENT = false;
    let RETURN_TRUSTED_TYPE = false;
    let SANITIZE_DOM = true;
    let SANITIZE_NAMED_PROPS = false;
    const SANITIZE_NAMED_PROPS_PREFIX = "user-content-";
    let KEEP_CONTENT = true;
    let IN_PLACE = false;
    let USE_PROFILES = {};
    let FORBID_CONTENTS = null;
    const DEFAULT_FORBID_CONTENTS = addToSet({}, ["annotation-xml", "audio", "colgroup", "desc", "foreignobject", "head", "iframe", "math", "mi", "mn", "mo", "ms", "mtext", "noembed", "noframes", "noscript", "plaintext", "script", "style", "svg", "template", "thead", "title", "video", "xmp"]);
    let DATA_URI_TAGS = null;
    const DEFAULT_DATA_URI_TAGS = addToSet({}, ["audio", "video", "img", "source", "image", "track"]);
    let URI_SAFE_ATTRIBUTES = null;
    const DEFAULT_URI_SAFE_ATTRIBUTES = addToSet({}, ["alt", "class", "for", "id", "label", "name", "pattern", "placeholder", "role", "summary", "title", "value", "style", "xmlns"]);
    const MATHML_NAMESPACE = "http://www.w3.org/1998/Math/MathML";
    const SVG_NAMESPACE = "http://www.w3.org/2000/svg";
    const HTML_NAMESPACE = "http://www.w3.org/1999/xhtml";
    let NAMESPACE = HTML_NAMESPACE;
    let IS_EMPTY_INPUT = false;
    let ALLOWED_NAMESPACES = null;
    const DEFAULT_ALLOWED_NAMESPACES = addToSet({}, [MATHML_NAMESPACE, SVG_NAMESPACE, HTML_NAMESPACE], stringToString);
    let MATHML_TEXT_INTEGRATION_POINTS = addToSet({}, ["mi", "mo", "mn", "ms", "mtext"]);
    let HTML_INTEGRATION_POINTS = addToSet({}, ["annotation-xml"]);
    const COMMON_SVG_AND_HTML_ELEMENTS = addToSet({}, ["title", "style", "font", "a", "script"]);
    let PARSER_MEDIA_TYPE = null;
    const SUPPORTED_PARSER_MEDIA_TYPES = ["application/xhtml+xml", "text/html"];
    const DEFAULT_PARSER_MEDIA_TYPE = "text/html";
    let transformCaseFunc = null;
    let CONFIG = null;
    const formElement = document2.createElement("form");
    const isRegexOrFunction = function isRegexOrFunction2(testValue) {
      return testValue instanceof RegExp || testValue instanceof Function;
    };
    const _parseConfig = function _parseConfig2() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      if (CONFIG && CONFIG === cfg) {
        return;
      }
      if (!cfg || typeof cfg !== "object") {
        cfg = {};
      }
      cfg = clone(cfg);
      PARSER_MEDIA_TYPE = // eslint-disable-next-line unicorn/prefer-includes
      SUPPORTED_PARSER_MEDIA_TYPES.indexOf(cfg.PARSER_MEDIA_TYPE) === -1 ? DEFAULT_PARSER_MEDIA_TYPE : cfg.PARSER_MEDIA_TYPE;
      transformCaseFunc = PARSER_MEDIA_TYPE === "application/xhtml+xml" ? stringToString : stringToLowerCase;
      ALLOWED_TAGS = objectHasOwnProperty(cfg, "ALLOWED_TAGS") ? addToSet({}, cfg.ALLOWED_TAGS, transformCaseFunc) : DEFAULT_ALLOWED_TAGS;
      ALLOWED_ATTR = objectHasOwnProperty(cfg, "ALLOWED_ATTR") ? addToSet({}, cfg.ALLOWED_ATTR, transformCaseFunc) : DEFAULT_ALLOWED_ATTR;
      ALLOWED_NAMESPACES = objectHasOwnProperty(cfg, "ALLOWED_NAMESPACES") ? addToSet({}, cfg.ALLOWED_NAMESPACES, stringToString) : DEFAULT_ALLOWED_NAMESPACES;
      URI_SAFE_ATTRIBUTES = objectHasOwnProperty(cfg, "ADD_URI_SAFE_ATTR") ? addToSet(clone(DEFAULT_URI_SAFE_ATTRIBUTES), cfg.ADD_URI_SAFE_ATTR, transformCaseFunc) : DEFAULT_URI_SAFE_ATTRIBUTES;
      DATA_URI_TAGS = objectHasOwnProperty(cfg, "ADD_DATA_URI_TAGS") ? addToSet(clone(DEFAULT_DATA_URI_TAGS), cfg.ADD_DATA_URI_TAGS, transformCaseFunc) : DEFAULT_DATA_URI_TAGS;
      FORBID_CONTENTS = objectHasOwnProperty(cfg, "FORBID_CONTENTS") ? addToSet({}, cfg.FORBID_CONTENTS, transformCaseFunc) : DEFAULT_FORBID_CONTENTS;
      FORBID_TAGS = objectHasOwnProperty(cfg, "FORBID_TAGS") ? addToSet({}, cfg.FORBID_TAGS, transformCaseFunc) : {};
      FORBID_ATTR = objectHasOwnProperty(cfg, "FORBID_ATTR") ? addToSet({}, cfg.FORBID_ATTR, transformCaseFunc) : {};
      USE_PROFILES = objectHasOwnProperty(cfg, "USE_PROFILES") ? cfg.USE_PROFILES : false;
      ALLOW_ARIA_ATTR = cfg.ALLOW_ARIA_ATTR !== false;
      ALLOW_DATA_ATTR = cfg.ALLOW_DATA_ATTR !== false;
      ALLOW_UNKNOWN_PROTOCOLS = cfg.ALLOW_UNKNOWN_PROTOCOLS || false;
      ALLOW_SELF_CLOSE_IN_ATTR = cfg.ALLOW_SELF_CLOSE_IN_ATTR !== false;
      SAFE_FOR_TEMPLATES = cfg.SAFE_FOR_TEMPLATES || false;
      SAFE_FOR_XML = cfg.SAFE_FOR_XML !== false;
      WHOLE_DOCUMENT = cfg.WHOLE_DOCUMENT || false;
      RETURN_DOM = cfg.RETURN_DOM || false;
      RETURN_DOM_FRAGMENT = cfg.RETURN_DOM_FRAGMENT || false;
      RETURN_TRUSTED_TYPE = cfg.RETURN_TRUSTED_TYPE || false;
      FORCE_BODY = cfg.FORCE_BODY || false;
      SANITIZE_DOM = cfg.SANITIZE_DOM !== false;
      SANITIZE_NAMED_PROPS = cfg.SANITIZE_NAMED_PROPS || false;
      KEEP_CONTENT = cfg.KEEP_CONTENT !== false;
      IN_PLACE = cfg.IN_PLACE || false;
      IS_ALLOWED_URI$1 = cfg.ALLOWED_URI_REGEXP || IS_ALLOWED_URI;
      NAMESPACE = cfg.NAMESPACE || HTML_NAMESPACE;
      MATHML_TEXT_INTEGRATION_POINTS = cfg.MATHML_TEXT_INTEGRATION_POINTS || MATHML_TEXT_INTEGRATION_POINTS;
      HTML_INTEGRATION_POINTS = cfg.HTML_INTEGRATION_POINTS || HTML_INTEGRATION_POINTS;
      CUSTOM_ELEMENT_HANDLING = cfg.CUSTOM_ELEMENT_HANDLING || {};
      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.tagNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.tagNameCheck;
      }
      if (cfg.CUSTOM_ELEMENT_HANDLING && isRegexOrFunction(cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)) {
        CUSTOM_ELEMENT_HANDLING.attributeNameCheck = cfg.CUSTOM_ELEMENT_HANDLING.attributeNameCheck;
      }
      if (cfg.CUSTOM_ELEMENT_HANDLING && typeof cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements === "boolean") {
        CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements = cfg.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements;
      }
      if (SAFE_FOR_TEMPLATES) {
        ALLOW_DATA_ATTR = false;
      }
      if (RETURN_DOM_FRAGMENT) {
        RETURN_DOM = true;
      }
      if (USE_PROFILES) {
        ALLOWED_TAGS = addToSet({}, text);
        ALLOWED_ATTR = [];
        if (USE_PROFILES.html === true) {
          addToSet(ALLOWED_TAGS, html$1);
          addToSet(ALLOWED_ATTR, html);
        }
        if (USE_PROFILES.svg === true) {
          addToSet(ALLOWED_TAGS, svg$1);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.svgFilters === true) {
          addToSet(ALLOWED_TAGS, svgFilters);
          addToSet(ALLOWED_ATTR, svg);
          addToSet(ALLOWED_ATTR, xml);
        }
        if (USE_PROFILES.mathMl === true) {
          addToSet(ALLOWED_TAGS, mathMl$1);
          addToSet(ALLOWED_ATTR, mathMl);
          addToSet(ALLOWED_ATTR, xml);
        }
      }
      if (cfg.ADD_TAGS) {
        if (ALLOWED_TAGS === DEFAULT_ALLOWED_TAGS) {
          ALLOWED_TAGS = clone(ALLOWED_TAGS);
        }
        addToSet(ALLOWED_TAGS, cfg.ADD_TAGS, transformCaseFunc);
      }
      if (cfg.ADD_ATTR) {
        if (ALLOWED_ATTR === DEFAULT_ALLOWED_ATTR) {
          ALLOWED_ATTR = clone(ALLOWED_ATTR);
        }
        addToSet(ALLOWED_ATTR, cfg.ADD_ATTR, transformCaseFunc);
      }
      if (cfg.ADD_URI_SAFE_ATTR) {
        addToSet(URI_SAFE_ATTRIBUTES, cfg.ADD_URI_SAFE_ATTR, transformCaseFunc);
      }
      if (cfg.FORBID_CONTENTS) {
        if (FORBID_CONTENTS === DEFAULT_FORBID_CONTENTS) {
          FORBID_CONTENTS = clone(FORBID_CONTENTS);
        }
        addToSet(FORBID_CONTENTS, cfg.FORBID_CONTENTS, transformCaseFunc);
      }
      if (KEEP_CONTENT) {
        ALLOWED_TAGS["#text"] = true;
      }
      if (WHOLE_DOCUMENT) {
        addToSet(ALLOWED_TAGS, ["html", "head", "body"]);
      }
      if (ALLOWED_TAGS.table) {
        addToSet(ALLOWED_TAGS, ["tbody"]);
        delete FORBID_TAGS.tbody;
      }
      if (cfg.TRUSTED_TYPES_POLICY) {
        if (typeof cfg.TRUSTED_TYPES_POLICY.createHTML !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createHTML" hook.');
        }
        if (typeof cfg.TRUSTED_TYPES_POLICY.createScriptURL !== "function") {
          throw typeErrorCreate('TRUSTED_TYPES_POLICY configuration option must provide a "createScriptURL" hook.');
        }
        trustedTypesPolicy = cfg.TRUSTED_TYPES_POLICY;
        emptyHTML = trustedTypesPolicy.createHTML("");
      } else {
        if (trustedTypesPolicy === void 0) {
          trustedTypesPolicy = _createTrustedTypesPolicy(trustedTypes, currentScript);
        }
        if (trustedTypesPolicy !== null && typeof emptyHTML === "string") {
          emptyHTML = trustedTypesPolicy.createHTML("");
        }
      }
      if (freeze) {
        freeze(cfg);
      }
      CONFIG = cfg;
    };
    const ALL_SVG_TAGS = addToSet({}, [...svg$1, ...svgFilters, ...svgDisallowed]);
    const ALL_MATHML_TAGS = addToSet({}, [...mathMl$1, ...mathMlDisallowed]);
    const _checkValidNamespace = function _checkValidNamespace2(element) {
      let parent = getParentNode(element);
      if (!parent || !parent.tagName) {
        parent = {
          namespaceURI: NAMESPACE,
          tagName: "template"
        };
      }
      const tagName = stringToLowerCase(element.tagName);
      const parentTagName = stringToLowerCase(parent.tagName);
      if (!ALLOWED_NAMESPACES[element.namespaceURI]) {
        return false;
      }
      if (element.namespaceURI === SVG_NAMESPACE) {
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === "svg";
        }
        if (parent.namespaceURI === MATHML_NAMESPACE) {
          return tagName === "svg" && (parentTagName === "annotation-xml" || MATHML_TEXT_INTEGRATION_POINTS[parentTagName]);
        }
        return Boolean(ALL_SVG_TAGS[tagName]);
      }
      if (element.namespaceURI === MATHML_NAMESPACE) {
        if (parent.namespaceURI === HTML_NAMESPACE) {
          return tagName === "math";
        }
        if (parent.namespaceURI === SVG_NAMESPACE) {
          return tagName === "math" && HTML_INTEGRATION_POINTS[parentTagName];
        }
        return Boolean(ALL_MATHML_TAGS[tagName]);
      }
      if (element.namespaceURI === HTML_NAMESPACE) {
        if (parent.namespaceURI === SVG_NAMESPACE && !HTML_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }
        if (parent.namespaceURI === MATHML_NAMESPACE && !MATHML_TEXT_INTEGRATION_POINTS[parentTagName]) {
          return false;
        }
        return !ALL_MATHML_TAGS[tagName] && (COMMON_SVG_AND_HTML_ELEMENTS[tagName] || !ALL_SVG_TAGS[tagName]);
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && ALLOWED_NAMESPACES[element.namespaceURI]) {
        return true;
      }
      return false;
    };
    const _forceRemove = function _forceRemove2(node) {
      arrayPush(DOMPurify.removed, {
        element: node
      });
      try {
        getParentNode(node).removeChild(node);
      } catch (_2) {
        remove(node);
      }
    };
    const _removeAttribute = function _removeAttribute2(name, element) {
      try {
        arrayPush(DOMPurify.removed, {
          attribute: element.getAttributeNode(name),
          from: element
        });
      } catch (_2) {
        arrayPush(DOMPurify.removed, {
          attribute: null,
          from: element
        });
      }
      element.removeAttribute(name);
      if (name === "is" && !ALLOWED_ATTR[name]) {
        if (RETURN_DOM || RETURN_DOM_FRAGMENT) {
          try {
            _forceRemove(element);
          } catch (_2) {
          }
        } else {
          try {
            element.setAttribute(name, "");
          } catch (_2) {
          }
        }
      }
    };
    const _initDocument = function _initDocument2(dirty) {
      let doc = null;
      let leadingWhitespace = null;
      if (FORCE_BODY) {
        dirty = "<remove></remove>" + dirty;
      } else {
        const matches = stringMatch(dirty, /^[\r\n\t ]+/);
        leadingWhitespace = matches && matches[0];
      }
      if (PARSER_MEDIA_TYPE === "application/xhtml+xml" && NAMESPACE === HTML_NAMESPACE) {
        dirty = '<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>' + dirty + "</body></html>";
      }
      const dirtyPayload = trustedTypesPolicy ? trustedTypesPolicy.createHTML(dirty) : dirty;
      if (NAMESPACE === HTML_NAMESPACE) {
        try {
          doc = new DOMParser2().parseFromString(dirtyPayload, PARSER_MEDIA_TYPE);
        } catch (_2) {
        }
      }
      if (!doc || !doc.documentElement) {
        doc = implementation.createDocument(NAMESPACE, "template", null);
        try {
          doc.documentElement.innerHTML = IS_EMPTY_INPUT ? emptyHTML : dirtyPayload;
        } catch (_2) {
        }
      }
      const body = doc.body || doc.documentElement;
      if (dirty && leadingWhitespace) {
        body.insertBefore(document2.createTextNode(leadingWhitespace), body.childNodes[0] || null);
      }
      if (NAMESPACE === HTML_NAMESPACE) {
        return getElementsByTagName.call(doc, WHOLE_DOCUMENT ? "html" : "body")[0];
      }
      return WHOLE_DOCUMENT ? doc.documentElement : body;
    };
    const _createNodeIterator = function _createNodeIterator2(root) {
      return createNodeIterator.call(
        root.ownerDocument || root,
        root,
        // eslint-disable-next-line no-bitwise
        NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_COMMENT | NodeFilter.SHOW_TEXT | NodeFilter.SHOW_PROCESSING_INSTRUCTION | NodeFilter.SHOW_CDATA_SECTION,
        null
      );
    };
    const _isClobbered = function _isClobbered2(element) {
      return element instanceof HTMLFormElement && (typeof element.nodeName !== "string" || typeof element.textContent !== "string" || typeof element.removeChild !== "function" || !(element.attributes instanceof NamedNodeMap) || typeof element.removeAttribute !== "function" || typeof element.setAttribute !== "function" || typeof element.namespaceURI !== "string" || typeof element.insertBefore !== "function" || typeof element.hasChildNodes !== "function");
    };
    const _isNode = function _isNode2(value) {
      return typeof Node === "function" && value instanceof Node;
    };
    function _executeHook(entryPoint, currentNode, data) {
      if (!hooks[entryPoint]) {
        return;
      }
      arrayForEach(hooks[entryPoint], (hook) => {
        hook.call(DOMPurify, currentNode, data, CONFIG);
      });
    }
    const _sanitizeElements = function _sanitizeElements2(currentNode) {
      let content = null;
      _executeHook("beforeSanitizeElements", currentNode, null);
      if (_isClobbered(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      const tagName = transformCaseFunc(currentNode.nodeName);
      _executeHook("uponSanitizeElement", currentNode, {
        tagName,
        allowedTags: ALLOWED_TAGS
      });
      if (currentNode.hasChildNodes() && !_isNode(currentNode.firstElementChild) && regExpTest(/<[/\w]/g, currentNode.innerHTML) && regExpTest(/<[/\w]/g, currentNode.textContent)) {
        _forceRemove(currentNode);
        return true;
      }
      if (currentNode.nodeType === NODE_TYPE.progressingInstruction) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_XML && currentNode.nodeType === NODE_TYPE.comment && regExpTest(/<[/\w]/g, currentNode.data)) {
        _forceRemove(currentNode);
        return true;
      }
      if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
        if (!FORBID_TAGS[tagName] && _isBasicCustomElement(tagName)) {
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, tagName)) {
            return false;
          }
          if (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(tagName)) {
            return false;
          }
        }
        if (KEEP_CONTENT && !FORBID_CONTENTS[tagName]) {
          const parentNode = getParentNode(currentNode) || currentNode.parentNode;
          const childNodes = getChildNodes(currentNode) || currentNode.childNodes;
          if (childNodes && parentNode) {
            const childCount = childNodes.length;
            for (let i = childCount - 1; i >= 0; --i) {
              const childClone = cloneNode(childNodes[i], true);
              childClone.__removalCount = (currentNode.__removalCount || 0) + 1;
              parentNode.insertBefore(childClone, getNextSibling(currentNode));
            }
          }
        }
        _forceRemove(currentNode);
        return true;
      }
      if (currentNode instanceof Element && !_checkValidNamespace(currentNode)) {
        _forceRemove(currentNode);
        return true;
      }
      if ((tagName === "noscript" || tagName === "noembed" || tagName === "noframes") && regExpTest(/<\/no(script|embed|frames)/i, currentNode.innerHTML)) {
        _forceRemove(currentNode);
        return true;
      }
      if (SAFE_FOR_TEMPLATES && currentNode.nodeType === NODE_TYPE.text) {
        content = currentNode.textContent;
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          content = stringReplace(content, expr, " ");
        });
        if (currentNode.textContent !== content) {
          arrayPush(DOMPurify.removed, {
            element: currentNode.cloneNode()
          });
          currentNode.textContent = content;
        }
      }
      _executeHook("afterSanitizeElements", currentNode, null);
      return false;
    };
    const _isValidAttribute = function _isValidAttribute2(lcTag, lcName, value) {
      if (SANITIZE_DOM && (lcName === "id" || lcName === "name") && (value in document2 || value in formElement)) {
        return false;
      }
      if (ALLOW_DATA_ATTR && !FORBID_ATTR[lcName] && regExpTest(DATA_ATTR2, lcName)) ;
      else if (ALLOW_ARIA_ATTR && regExpTest(ARIA_ATTR2, lcName)) ;
      else if (!ALLOWED_ATTR[lcName] || FORBID_ATTR[lcName]) {
        if (
          // First condition does a very basic check if a) it's basically a valid custom element tagname AND
          // b) if the tagName passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          // and c) if the attribute name passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.attributeNameCheck
          _isBasicCustomElement(lcTag) && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, lcTag) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(lcTag)) && (CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.attributeNameCheck, lcName) || CUSTOM_ELEMENT_HANDLING.attributeNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.attributeNameCheck(lcName)) || // Alternative, second condition checks if it's an `is`-attribute, AND
          // the value passes whatever the user has configured for CUSTOM_ELEMENT_HANDLING.tagNameCheck
          lcName === "is" && CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements && (CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof RegExp && regExpTest(CUSTOM_ELEMENT_HANDLING.tagNameCheck, value) || CUSTOM_ELEMENT_HANDLING.tagNameCheck instanceof Function && CUSTOM_ELEMENT_HANDLING.tagNameCheck(value))
        ) ;
        else {
          return false;
        }
      } else if (URI_SAFE_ATTRIBUTES[lcName]) ;
      else if (regExpTest(IS_ALLOWED_URI$1, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
      else if ((lcName === "src" || lcName === "xlink:href" || lcName === "href") && lcTag !== "script" && stringIndexOf(value, "data:") === 0 && DATA_URI_TAGS[lcTag]) ;
      else if (ALLOW_UNKNOWN_PROTOCOLS && !regExpTest(IS_SCRIPT_OR_DATA2, stringReplace(value, ATTR_WHITESPACE2, ""))) ;
      else if (value) {
        return false;
      } else ;
      return true;
    };
    const _isBasicCustomElement = function _isBasicCustomElement2(tagName) {
      return tagName !== "annotation-xml" && stringMatch(tagName, CUSTOM_ELEMENT2);
    };
    const _sanitizeAttributes = function _sanitizeAttributes2(currentNode) {
      _executeHook("beforeSanitizeAttributes", currentNode, null);
      const {
        attributes
      } = currentNode;
      if (!attributes) {
        return;
      }
      const hookEvent = {
        attrName: "",
        attrValue: "",
        keepAttr: true,
        allowedAttributes: ALLOWED_ATTR,
        forceKeepAttr: void 0
      };
      let l3 = attributes.length;
      while (l3--) {
        const attr = attributes[l3];
        const {
          name,
          namespaceURI,
          value: attrValue
        } = attr;
        const lcName = transformCaseFunc(name);
        let value = name === "value" ? attrValue : stringTrim(attrValue);
        hookEvent.attrName = lcName;
        hookEvent.attrValue = value;
        hookEvent.keepAttr = true;
        hookEvent.forceKeepAttr = void 0;
        _executeHook("uponSanitizeAttribute", currentNode, hookEvent);
        value = hookEvent.attrValue;
        if (SANITIZE_NAMED_PROPS && (lcName === "id" || lcName === "name")) {
          _removeAttribute(name, currentNode);
          value = SANITIZE_NAMED_PROPS_PREFIX + value;
        }
        if (SAFE_FOR_XML && regExpTest(/((--!?|])>)|<\/(style|title)/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (hookEvent.forceKeepAttr) {
          continue;
        }
        _removeAttribute(name, currentNode);
        if (!hookEvent.keepAttr) {
          continue;
        }
        if (!ALLOW_SELF_CLOSE_IN_ATTR && regExpTest(/\/>/i, value)) {
          _removeAttribute(name, currentNode);
          continue;
        }
        if (SAFE_FOR_TEMPLATES) {
          arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
            value = stringReplace(value, expr, " ");
          });
        }
        const lcTag = transformCaseFunc(currentNode.nodeName);
        if (!_isValidAttribute(lcTag, lcName, value)) {
          continue;
        }
        if (trustedTypesPolicy && typeof trustedTypes === "object" && typeof trustedTypes.getAttributeType === "function") {
          if (namespaceURI) ;
          else {
            switch (trustedTypes.getAttributeType(lcTag, lcName)) {
              case "TrustedHTML": {
                value = trustedTypesPolicy.createHTML(value);
                break;
              }
              case "TrustedScriptURL": {
                value = trustedTypesPolicy.createScriptURL(value);
                break;
              }
            }
          }
        }
        try {
          if (namespaceURI) {
            currentNode.setAttributeNS(namespaceURI, name, value);
          } else {
            currentNode.setAttribute(name, value);
          }
          if (_isClobbered(currentNode)) {
            _forceRemove(currentNode);
          } else {
            arrayPop(DOMPurify.removed);
          }
        } catch (_2) {
        }
      }
      _executeHook("afterSanitizeAttributes", currentNode, null);
    };
    const _sanitizeShadowDOM = function _sanitizeShadowDOM2(fragment) {
      let shadowNode = null;
      const shadowIterator = _createNodeIterator(fragment);
      _executeHook("beforeSanitizeShadowDOM", fragment, null);
      while (shadowNode = shadowIterator.nextNode()) {
        _executeHook("uponSanitizeShadowNode", shadowNode, null);
        if (_sanitizeElements(shadowNode)) {
          continue;
        }
        if (shadowNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM2(shadowNode.content);
        }
        _sanitizeAttributes(shadowNode);
      }
      _executeHook("afterSanitizeShadowDOM", fragment, null);
    };
    DOMPurify.sanitize = function(dirty) {
      let cfg = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      let body = null;
      let importedNode = null;
      let currentNode = null;
      let returnNode = null;
      IS_EMPTY_INPUT = !dirty;
      if (IS_EMPTY_INPUT) {
        dirty = "<!-->";
      }
      if (typeof dirty !== "string" && !_isNode(dirty)) {
        if (typeof dirty.toString === "function") {
          dirty = dirty.toString();
          if (typeof dirty !== "string") {
            throw typeErrorCreate("dirty is not a string, aborting");
          }
        } else {
          throw typeErrorCreate("toString is not a function");
        }
      }
      if (!DOMPurify.isSupported) {
        return dirty;
      }
      if (!SET_CONFIG) {
        _parseConfig(cfg);
      }
      DOMPurify.removed = [];
      if (typeof dirty === "string") {
        IN_PLACE = false;
      }
      if (IN_PLACE) {
        if (dirty.nodeName) {
          const tagName = transformCaseFunc(dirty.nodeName);
          if (!ALLOWED_TAGS[tagName] || FORBID_TAGS[tagName]) {
            throw typeErrorCreate("root node is forbidden and cannot be sanitized in-place");
          }
        }
      } else if (dirty instanceof Node) {
        body = _initDocument("<!---->");
        importedNode = body.ownerDocument.importNode(dirty, true);
        if (importedNode.nodeType === NODE_TYPE.element && importedNode.nodeName === "BODY") {
          body = importedNode;
        } else if (importedNode.nodeName === "HTML") {
          body = importedNode;
        } else {
          body.appendChild(importedNode);
        }
      } else {
        if (!RETURN_DOM && !SAFE_FOR_TEMPLATES && !WHOLE_DOCUMENT && // eslint-disable-next-line unicorn/prefer-includes
        dirty.indexOf("<") === -1) {
          return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(dirty) : dirty;
        }
        body = _initDocument(dirty);
        if (!body) {
          return RETURN_DOM ? null : RETURN_TRUSTED_TYPE ? emptyHTML : "";
        }
      }
      if (body && FORCE_BODY) {
        _forceRemove(body.firstChild);
      }
      const nodeIterator = _createNodeIterator(IN_PLACE ? dirty : body);
      while (currentNode = nodeIterator.nextNode()) {
        if (_sanitizeElements(currentNode)) {
          continue;
        }
        if (currentNode.content instanceof DocumentFragment) {
          _sanitizeShadowDOM(currentNode.content);
        }
        _sanitizeAttributes(currentNode);
      }
      if (IN_PLACE) {
        return dirty;
      }
      if (RETURN_DOM) {
        if (RETURN_DOM_FRAGMENT) {
          returnNode = createDocumentFragment.call(body.ownerDocument);
          while (body.firstChild) {
            returnNode.appendChild(body.firstChild);
          }
        } else {
          returnNode = body;
        }
        if (ALLOWED_ATTR.shadowroot || ALLOWED_ATTR.shadowrootmode) {
          returnNode = importNode.call(originalDocument, returnNode, true);
        }
        return returnNode;
      }
      let serializedHTML = WHOLE_DOCUMENT ? body.outerHTML : body.innerHTML;
      if (WHOLE_DOCUMENT && ALLOWED_TAGS["!doctype"] && body.ownerDocument && body.ownerDocument.doctype && body.ownerDocument.doctype.name && regExpTest(DOCTYPE_NAME, body.ownerDocument.doctype.name)) {
        serializedHTML = "<!DOCTYPE " + body.ownerDocument.doctype.name + ">\n" + serializedHTML;
      }
      if (SAFE_FOR_TEMPLATES) {
        arrayForEach([MUSTACHE_EXPR2, ERB_EXPR2, TMPLIT_EXPR2], (expr) => {
          serializedHTML = stringReplace(serializedHTML, expr, " ");
        });
      }
      return trustedTypesPolicy && RETURN_TRUSTED_TYPE ? trustedTypesPolicy.createHTML(serializedHTML) : serializedHTML;
    };
    DOMPurify.setConfig = function() {
      let cfg = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
      _parseConfig(cfg);
      SET_CONFIG = true;
    };
    DOMPurify.clearConfig = function() {
      CONFIG = null;
      SET_CONFIG = false;
    };
    DOMPurify.isValidAttribute = function(tag, attr, value) {
      if (!CONFIG) {
        _parseConfig({});
      }
      const lcTag = transformCaseFunc(tag);
      const lcName = transformCaseFunc(attr);
      return _isValidAttribute(lcTag, lcName, value);
    };
    DOMPurify.addHook = function(entryPoint, hookFunction) {
      if (typeof hookFunction !== "function") {
        return;
      }
      hooks[entryPoint] = hooks[entryPoint] || [];
      arrayPush(hooks[entryPoint], hookFunction);
    };
    DOMPurify.removeHook = function(entryPoint) {
      if (hooks[entryPoint]) {
        return arrayPop(hooks[entryPoint]);
      }
    };
    DOMPurify.removeHooks = function(entryPoint) {
      if (hooks[entryPoint]) {
        hooks[entryPoint] = [];
      }
    };
    DOMPurify.removeAllHooks = function() {
      hooks = {};
    };
    return DOMPurify;
  }
  var purify = createDOMPurify();
  class BasicQuestionHandler {
    constructor() {
      this._document = document;
      this._window = _unsafeWindow;
      this.questions = [];
      this.correctNum = 0;
      this.setting = useSettingStore();
      this.log = useLogStore();
      this.questionStore = useQuestionStore();
      this.parseHtml = () => {
        throw new Error("请使用继承类的重写方法");
      };
      this.fillQuestion = (question) => {
        throw new Error("请使用继承类的重写方法");
      };
      this.questionType = {
        "单选题": "0",
        "A1型题": "0",
        "多选题": "1",
        "X型题": "1",
        "填空题": "2",
        "判断题": "3",
        "简答题": "4",
        "名词解释": "5",
        "论述题": "6",
        "计算题": "7",
        "单选": "0",
        "A1型": "0",
        "多选": "1",
        "填空": "2",
        "判断": "3",
        "简答": "4",
        "论述": "6",
        "计算": "7"
      };
      this.removeHtml = (htmlStr, replacen = true) => {
        const textArea = document.createElement("textarea");
        textArea.innerHTML = htmlStr;
        htmlStr = textArea.value;
        htmlStr = htmlStr.replace(/[\t\r\xa0]/g, " ");
        htmlStr = htmlStr.replace(/[\u2000-\u200a]/g, " ");
        htmlStr = htmlStr.replace(/<br\s*\/?>/g, "\n");
        if (replacen) {
          htmlStr = htmlStr.replace(/<(\/)?(p|div).*?>/g, "\n");
        }
        htmlStr = htmlStr.replace(/ {2,}/g, " ");
        htmlStr = htmlStr.replace(/\n{2,}/g, "\n");
        htmlStr = htmlStr.replace(/<xmp.*?>/g, "<pre>");
        htmlStr = htmlStr.replace(/<\/xmp>/g, "</pre>");
        htmlStr = purify.sanitize(htmlStr, { ALLOWED_TAGS: ["img", "br", "sub", "sup"], ALLOWED_ATTR: ["src", "href"], ALLOW_DATA_ATTR: false, KEEP_CONTENT: true });
        htmlStr = htmlStr.replace(/<((?!img|sub|sup|br)[^>]+)>/g, "").replace(/<br\s*\/?>/g, "\n");
        let imgReg = /<img.*?src="(.*?)".*?>/g;
        let imgArr = htmlStr.match(imgReg);
        if (imgArr) {
          htmlStr = htmlStr.replace(new RegExp("<img([^>]*)(?<!\\/)>", "g"), "<img$1/>");
          imgArr.forEach((item) => {
            let src = item.match(/src="(.*?)"/);
            if (src) {
              if (src[1].indexOf("http") == -1 && !src[1].includes("data:image")) {
                if (src[1].startsWith("/")) {
                  htmlStr = htmlStr.replace(src[1], location.origin + src[1]);
                } else {
                  const fullURL = new URL(src[1], document.baseURI).href;
                  htmlStr = htmlStr.replace(src[1], fullURL);
                }
              }
            }
          });
        }
        return htmlStr.trim();
      };
      this.removeAllTags = (htmlStr) => {
        htmlStr = purify.sanitize(htmlStr, { ALLOWED_TAGS: ["img"], ALLOWED_ATTR: ["src", "href"], ALLOW_DATA_ATTR: false, KEEP_CONTENT: true });
        let imgReg = /<img.*?src="(.*?)".*?>/g;
        let imgArr = htmlStr.match(imgReg);
        if (imgArr) {
          htmlStr = htmlStr.replace(new RegExp("<img([^>]*)(?<!\\/)>", "g"), "<img$1/>");
          imgArr.forEach((item) => {
            let src = item.match(/src="(.*?)"/);
            if (src) {
              if (src[1].indexOf("http") == -1 && !src[1].includes("data:image")) {
                if (src[1].startsWith("/")) {
                  htmlStr = htmlStr.replace(src[1], location.origin + src[1]);
                } else {
                  const fullURL = new URL(src[1], document.baseURI).href;
                  htmlStr = htmlStr.replace(src[1], fullURL);
                }
              }
            }
          });
        } else {
          htmlStr = htmlStr.replace(/[\p{P}\s]/gu, "").toLowerCase();
        }
        htmlStr = htmlStr.replace(/&nbsp;|nbsp/g, "");
        return htmlStr.trim();
      };
      this.clean = (str) => {
        return str.replace(/^【.*?】\s*/, "").replace(/\s*（\d+\.\d+分）$/, "");
      };
      this.clearMark = (str) => {
        return str.replace(/[\p{P}\p{S}]/gu, "");
      };
    }
  }
  let QuestionHandler$1 = class QuestionHandler extends BasicQuestionHandler {
    constructor(type, iframe) {
      super();
      // _document = document;
      // _window = unsafeWindow;
      // questions = [];
      __publicField(this, "type");
      // correctNum = 0;
      // _document;
      // _window;
      // setting = useSettingStore();
      // log = useLogStore();
      // questionStore = useQuestionStore();
      // questionType = {
      //   单选题: "0",
      //   A1型题: "0",
      //   多选题: "1",
      //   X型题: "1",
      //   填空题: "2",
      //   判断题: "3",
      //   简答题: "4",
      //   名词解释: "5",
      //   论述题: "6",
      //   计算题: "7",
      // };
      __publicField(this, "AI_ALLOW_QUESTION_TYPE", ["0", "1", "2", "3", "4", "5"]);
      __publicField(this, "init", async () => {
        var _that = this;
        this.parseHtml();
        if (this.questions.length) {
          this.log.insertLog(
            `成功解析到${this.questions.length}个题目，开始答题..`
          );
          setTimeout(() => {
            _that.setting.tabIndex = "2";
          }, 1e3);
          const { aiAnswer } = this.setting.config.basicConfig;
          for (const [index, question] of this.questions.entries()) {
            this.questionStore.currentQuestionIndex = index;
            const answerData = await getAccurateAnswer(question);
            if (answerData.code === 1) {
              question.answer = {
                code: 1,
                answer: answerData.data.answer
              };
              this.setting.userInfo.remainCount = answerData.data.remainCount;
              this.fillQuestion(question);
              this.correctNum += 1;
            } else if (this.AI_ALLOW_QUESTION_TYPE.includes(question.type) && aiAnswer.value && answerData.code === -1004) {
              console.log("使用AI获取答案", question);
              const answerData2 = await getAIAnswer(question);
              console.log("answerData", answerData2);
              if (answerData2.code === 1) {
                question.answer = {
                  code: 2,
                  answer: answerData2.data.answer
                };
                this.setting.userInfo.remainCount = answerData2.data.remainCount;
                this.fillQuestion(question);
                this.correctNum += 1;
              } else {
                question.answer = {
                  code: answerData2.code,
                  answer: [answerData2.msg]
                };
              }
            } else {
              question.answer = {
                code: answerData.code,
                answer: [answerData.msg]
              };
            }
          }
          this.questionStore.currentQuestionIndex += 1;
        } else
          this.log.insertLog(
            "没有解析到题目，请检查是否进入正确页面...",
            "warning"
          );
        setTimeout(() => {
          _that.setting.tabIndex = "1";
        }, 2e3);
        return Promise.resolve(
          (this.correctNum / this.questions.length * 100).toFixed(1)
        );
      });
      __publicField(this, "parseHtml", () => {
        this.questionStore.currentQuestionIndex = 0;
        if (!this._document) return [];
        if (["zj"].includes(this.type)) {
          const questionElements = this._document.querySelectorAll(".TiMu");
          this.addQuestions(questionElements);
        } else if (["zy", "ks"].includes(this.type)) {
          const questionElements = this._document.querySelectorAll(".questionLi");
          this.addQuestions(questionElements);
        }
        this.questionStore.questionList = this.questions;
      });
      __publicField(this, "fillQuestion", (question) => {
        var _a2, _b;
        if (!this._window) return;
        if (question.type === "0" || question.type === "1") {
          question.answer.answer.forEach((answer) => {
            const clearAnswer = this.removeHtml(answer);
            let isSelected = false;
            for (const key in question.options) {
              if (key === clearAnswer) {
                if (["zj", "zy"].includes(this.type)) {
                  const optionElement = question.options[key];
                  if (optionElement.getAttribute("aria-checked") === "true") return;
                  optionElement == null ? void 0 : optionElement.click();
                  isSelected = true;
                } else if (["ks"].includes(this.type)) {
                  const optionElement = question.options[key];
                  if (optionElement.querySelector(".check_answer")) return;
                  if (optionElement.querySelector(".check_answer_dx")) return;
                  optionElement == null ? void 0 : optionElement.click();
                  isSelected = true;
                }
              }
            }
            if (!isSelected) {
              for (const key in question.options) {
                const clearKey = this.clearMark(key);
                if (clearKey === this.clearMark(clearAnswer)) {
                  if (["zj", "zy"].includes(this.type)) {
                    const optionElement = question.options[key];
                    if (optionElement.getAttribute("aria-checked") === "true")
                      return;
                    optionElement == null ? void 0 : optionElement.click();
                  } else if (["ks"].includes(this.type)) {
                    const optionElement = question.options[key];
                    if (optionElement.querySelector(".check_answer")) return;
                    if (optionElement.querySelector(".check_answer_dx")) return;
                    optionElement == null ? void 0 : optionElement.click();
                  }
                }
              }
            }
          });
        } else if (question.type === "2") {
          const textareaElements = question.element.querySelectorAll("textarea");
          if (textareaElements.length === 0) return;
          textareaElements.forEach((textareaElement, index) => {
            try {
              const ueditor = this._window.UE.getEditor(textareaElement.name);
              ueditor.setContent(question.answer.answer[index]);
            } catch (e) {
              textareaElement.value = "";
            }
          });
        } else if (question.type === "3") {
          let answer = "true";
          if (question.answer.answer[0].match(
            /(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/
          )) {
            answer = "true";
          } else if (question.answer.answer[0].match(
            /(^|,)(错误|否|错|×|F|wr|wrong|false)(,|$)/
          )) {
            answer = "false";
          }
          const trueOrFalse = {
            true: "对",
            false: "错"
          };
          for (const key in question.options) {
            if (["zj", "zy"].includes(this.type)) {
              if ((_a2 = question.options[key].getAttribute("aria-label")) == null ? void 0 : _a2.includes(`${trueOrFalse[answer]}选择`)) {
                if (question.options[key].getAttribute("aria-checked") === "true")
                  return;
                (_b = question.options[key]) == null ? void 0 : _b.click();
              }
            } else if (["ks"].includes(this.type)) {
              const optionElement = question.options[key].querySelector(
                `span[data='${answer}']`
              );
              if (optionElement == null ? void 0 : optionElement.querySelector(".check_answer")) return;
              optionElement == null ? void 0 : optionElement.click();
            }
          }
        } else if (question.type === "4" || question.type === "5" || question.type === "6") {
          const textareaElement = question.element.querySelector("textarea");
          if (!textareaElement) return;
          const ueditor = this._window.UE.getEditor(textareaElement.name);
          ueditor.setContent(question.answer.answer[0]);
        } else {
          this.log.insertLog(
            `异常题目type:${question.type}，请联系客服..`,
            "warning"
          );
        }
      });
      __publicField(this, "addQuestions", (questionElements) => {
        questionElements.forEach((element) => {
          var _a2, _b, _c, _d;
          let questionTitle = "";
          let questionTypeText = "";
          let optionElements;
          let optionsObject = {};
          let optionTexts = [];
          if (["zj"].includes(this.type)) {
            questionTitle = this.removeHtml(
              ((_a2 = element.querySelector(".fontLabel")) == null ? void 0 : _a2.innerHTML) || ""
            );
            questionTypeText = this.removeHtml(
              ((_b = element.querySelector(".newZy_TItle")) == null ? void 0 : _b.innerHTML) || ""
            );
            optionElements = element.querySelectorAll('[class*="before-after"]');
            [optionsObject, optionTexts] = this.extractOptions(
              optionElements,
              ".fl.after"
            );
          } else if (["zy", "ks"].includes(this.type)) {
            const titleElement = ((_c = element == null ? void 0 : element.querySelector("h3")) == null ? void 0 : _c.innerHTML) || "";
            const colorShallowElement = ((_d = element.querySelector(".colorShallow")) == null ? void 0 : _d.outerHTML) || "";
            if (["zy"].includes(this.type)) {
              questionTypeText = (element == null ? void 0 : element.getAttribute("typename")) || "";
            } else if (["ks"].includes(this.type)) {
              questionTypeText = this.removeHtml(colorShallowElement).slice(1, 4) || "";
            }
            questionTitle = this.removeHtml(
              titleElement.split(colorShallowElement || "")[1] || ""
            );
            optionElements = element.querySelectorAll(".answerBg");
            [optionsObject, optionTexts] = this.extractOptions(
              optionElements,
              ".answer_p"
            );
          }
          this.questions.push({
            element,
            type: this.questionType[questionTypeText.replace("【", "").replace("】", "")] || "999",
            title: this.clean(questionTitle),
            optionsText: optionTexts,
            options: optionsObject,
            answer: { code: -1, answer: [] },
            workType: this.type,
            refer: this._window.location.href
          });
        });
      });
      this.type = type;
      if (iframe) {
        this._document = iframe.contentDocument;
        this._window = iframe.contentWindow;
      }
    }
    extractOptions(optionElements, optionSelector) {
      const optionsObject = {};
      const optionTexts = [];
      optionElements.forEach((optionElement) => {
        var _a2;
        const optionTextContent = this.removeHtml(
          ((_a2 = optionElement.querySelector(optionSelector)) == null ? void 0 : _a2.innerHTML) || ""
        );
        optionsObject[optionTextContent] = optionElement;
        optionTexts.push(optionTextContent);
      });
      return [optionsObject, optionTexts];
    }
  };
  class IframeUtils {
    static getIframes(element) {
      return Array.from(element.querySelectorAll("iframe"));
    }
    static getAllNestedIframes(element) {
      const iframes = IframeUtils.getIframes(element);
      if (iframes.length === 0) {
        return rxjs.of([]);
      } else {
        return rxjs.from(iframes).pipe(
          mergeMap(
            (iframe) => new rxjs.Observable((subscriber) => {
              if (iframe.contentDocument) {
                const iframeDocument = iframe.contentDocument;
                const nestedIframes = IframeUtils.getAllNestedIframes(
                  iframeDocument.documentElement
                );
                nestedIframes.subscribe((nestedIframes2) => {
                  subscriber.next([iframe, ...nestedIframes2]);
                  subscriber.complete();
                });
              } else {
                subscriber.next([]);
                subscriber.complete();
              }
            })
          ),
          concatAll(),
          rxjs.toArray()
        );
      }
    }
  }
  const selectTextSearchLogic = async (iframeDocument, iframeWindow) => {
    const questionStore = useQuestionStore();
    const setting = useSettingStore();
    _unsafeWindow.document.getSelection = function() {
      return {
        removeAllRanges: function() {
        }
      };
    };
    _unsafeWindow.document.onselectstart = true;
    _unsafeWindow.document.oncontextmenu = true;
    _unsafeWindow.document.oncut = true;
    _unsafeWindow.document.oncopy = true;
    _unsafeWindow.document.onpaste = true;
    const getSelectedText = () => {
      if (!setting.config.searchConfig.searchBySelectedText.value) return;
      let selectedText = "";
      if (iframeWindow.getSelection) {
        selectedText = iframeWindow.getSelection().toString();
      } else if (iframeDocument.selection) {
        selectedText = iframeDocument.selection.createRange().text;
      }
      if (selectedText != "") {
        questionStore.searchText = selectedText;
        setting.tabIndex = "3";
      }
    };
    iframeDocument.addEventListener("mouseup", getSelectedText);
  };
  const hookVedio = (video, playbackRate = 2) => {
    const log = useLogStore();
    function applyHookToVideo(video2) {
      try {
        video2.playbackRate = playbackRate;
      } catch (e) {
        log.insertLog(`[hook] 设置播放速度失败: ${e.message}`);
      }
      try {
        Object.defineProperty(video2, "playbackRate", {
          configurable: true,
          get: () => playbackRate,
          set: () => {
          }
          // 阻止外部修改
        });
      } catch (e) {
        log.insertLog(`[hook] 无法锁定 playbackRate: ${e.message}`);
      }
    }
    applyHookToVideo(video);
  };
  const cxChapterLogic = () => {
    const log = useLogStore();
    const init = () => {
      const currentUrl = window.location.href;
      if (!currentUrl.includes("&mooc2=1")) {
        window.location.href = currentUrl + "&mooc2=1";
      }
    };
    log.insertLog("进入学习页面，脚本开始工作中..");
    const setting = useSettingStore();
    const questionStore = useQuestionStore();
    const processIframeTask = () => {
      const documentElement = document.documentElement;
      const iframe = documentElement.querySelector("iframe");
      if (!iframe) {
        console.warn("No iframe found.");
        return;
      }
      watchIframe(documentElement);
      iframe.addEventListener("load", function() {
        watchIframe(documentElement);
      });
    };
    const waitIframeLoad = async (iframe) => {
      return new Promise((resolve) => {
        const intervalId = setInterval(async () => {
          var _a2;
          if (iframe.contentDocument && ((_a2 = iframe.contentDocument) == null ? void 0 : _a2.readyState) == "complete") {
            resolve();
            clearInterval(intervalId);
          }
        }, 500);
      });
    };
    const processWork = async (iframe, iframeDocument, iframeWindow) => {
      const workName = iframeDocument.documentElement.querySelector(
        "#RightCon > div.radiusBG > div > div.ceyan_name>h3"
      ).innerText;
      log.insertLog(`发现测验：${workName}，正在解析..`);
      return new Promise(async (resolve) => {
        if (!iframeDocument) return resolve();
        if (iframeDocument.documentElement.innerText.includes("已完成") || iframeDocument.documentElement.innerText.includes("待批阅")) {
          log.insertLog("测验已经完成，跳转中..");
          return resolve();
        }
        decrypt(iframeDocument);
        if (!setting.config.basicConfig.autoAnswer.value) {
          log.insertLog(
            `自动答题已关闭，请前往<span class='module'>设置</span>模块中更改`
          );
          return;
        }
        questionStore.accuracy = -1;
        const accuracy = await new QuestionHandler$1("zj", iframe).init();
        questionStore.accuracy = accuracy;
        iframeWindow.alert = () => {
        };
        if (setting.config.basicConfig.autoSubmit.value) {
          log.insertLog("自动提交已开启，提交中...");
          if (accuracy < Number(setting.config.basicConfig.accuracy.value)) {
            log.insertLog(
              `正确率小于${setting.config.basicConfig.accuracy.value}%，暂存，如需调整正确率请前往<span class='module'>设置</span>模块中更改`,
              "warning",
              4
            );
            await iframeWindow.noSubmit();
          } else {
            log.insertLog(
              `正确率大于${setting.config.basicConfig.accuracy.value}%，提交中...`
            );
            await iframeWindow.btnBlueSubmit();
            await sleep(setting.config.basicConfig.reqIntervalTime.value / 2);
            await iframeWindow.submitCheckTimes();
            log.insertLog("提交成功");
          }
        } else {
          log.insertLog(
            "自动提交未开启，已暂存，可前往<span class='module'>设置</span>模块中更改",
            "warning",
            4
          );
          await iframeWindow.noSubmit();
        }
        return resolve();
      });
    };
    const setupInterceptor = () => {
      let currentUrl = window.location.href;
      setInterval(() => {
        if (currentUrl !== window.location.href) {
          currentUrl = window.location.href;
          processIframeTask();
        }
      }, 2e3);
    };
    let currentWatchIframeTaskId = 0;
    const watchIframe = (documentElement) => {
      const thisTaskId = ++currentWatchIframeTaskId;
      IframeUtils.getAllNestedIframes(documentElement).subscribe((allIframes) => {
        rxjs.from(allIframes).pipe(concatMap((iframe) => processIframe(iframe))).subscribe({
          complete: async () => {
            const chapterName = documentElement.querySelector(
              ".posCatalog_select.posCatalog_active>.posCatalog_name"
            ).innerText;
            if (thisTaskId === currentWatchIframeTaskId) {
              log.insertLog(`任务点 ${chapterName} 已完成，即将跳转`);
              if (setting.config.basicConfig.autoChangeChapter.value) {
                const nextBtn = documentElement.querySelector("#prevNextFocusNext");
                if (!nextBtn || nextBtn.style.display === "none") {
                  log.insertLog(`已是最后一个章节，无法跳转`);
                } else {
                  await sleep(setting.config.basicConfig.reqIntervalTime.value);
                  document.querySelector(".jb_btn.jb_btn_92.fr.fs14.nextChapter").click();
                }
              } else {
                log.insertLog(
                  `自动切换章节未开启，前往<span class='module'>设置</span>模块中更改`,
                  "warning",
                  4
                );
              }
            }
          }
        });
      });
    };
    const processPpt = (iframeWindow) => {
      return new Promise((resolve) => {
        const iframe = iframeWindow.document.querySelector("#panView");
        log.insertLog("发现一个PPT，正在解析...");
        const startScrolling = async () => {
          const pptWindow = iframe.contentWindow;
          const scrollHeight = pptWindow.document.body.scrollHeight;
          await pptWindow.scrollTo({
            top: scrollHeight,
            behavior: "smooth"
          });
          log.insertLog("阅读完成");
          resolve();
        };
        const checkReadyState = () => {
          if (iframe.contentWindow.document.readyState === "complete") {
            startScrolling();
          } else {
            setTimeout(checkReadyState, 100);
          }
        };
        checkReadyState();
      });
    };
    const processBook = async (iframeWindow) => {
      log.insertLog("发现一个电子书，正在解析");
      unsafeWindow.top.onchangepage(iframeWindow.getFrameAttr("end"));
      log.insertLog("阅读完成");
      return Promise.resolve();
    };
    const processMedia = async (mediaType, iframeDocument) => {
      return new Promise((resolve) => {
        const playRate = setting.config.basicConfig.videoPlayrate.value;
        log.insertLog(`发现一个${mediaType},正在播放${mediaType}..`);
        let isExecuted = false;
        log.insertLog(`播放成功，当前视频播放倍速为${playRate}x.`);
        const intervalId = setInterval(async () => {
          const mediaElement = iframeDocument.documentElement.querySelector(mediaType);
          if (mediaElement && !isExecuted) {
            await mediaElement.pause();
            mediaElement.muted = true;
            await mediaElement.play();
            hookVedio(mediaElement, playRate);
            const listener = async () => {
              await sleep(1);
              await mediaElement.play();
            };
            mediaElement.addEventListener("pause", listener);
            mediaElement.addEventListener("ended", () => {
              log.insertLog(`${mediaType}已播放完成`);
              mediaElement.removeEventListener("pause", listener);
              resolve();
            });
            isExecuted = true;
            clearInterval(intervalId);
          }
        }, 2500);
      });
    };
    const processIframe = async (iframe) => {
      var _a2, _b;
      const iframeSrc = iframe.src;
      const iframeDocument = iframe.contentDocument;
      const iframeWindow = iframe.contentWindow;
      if (!iframeDocument || !iframeWindow) return Promise.resolve();
      if (iframeSrc.includes("javascript:")) return Promise.resolve();
      await waitIframeLoad(iframe);
      const parentClass = ((_a2 = iframe.parentElement) == null ? void 0 : _a2.className) || "";
      if (parentClass.includes("ans-job-finished")) ;
      else {
        if (iframeSrc.includes("api/work")) {
          selectTextSearchLogic(iframeDocument, iframeWindow);
          return processWork(iframe, iframeDocument, iframeWindow);
        }
        const ansJobIcon = (_b = iframe.parentElement) == null ? void 0 : _b.querySelector(".ans-job-icon");
        if (ansJobIcon) {
          if (iframeSrc.includes("video")) {
            return processMedia("video", iframeDocument);
          } else if (iframeSrc.includes("audio")) {
            return processMedia("audio", iframeDocument);
          } else if (["ppt", "doc", "pptx", "docx", "pdf"].some(
            (type) => iframeSrc.includes("modules/" + type)
          )) {
            return processPpt(iframeWindow);
          } else if (["innerbook"].some((type) => iframeSrc.includes("modules/" + type))) {
            return processBook(iframeWindow);
          }
        }
      }
      return Promise.resolve();
    };
    init();
    processIframeTask();
    setupInterceptor();
  };
  const useMessageStore = pinia.defineStore("messageStore", {
    state: () => ({
      messageList: []
    }),
    actions: {
      insertMessage(text2, type = "success") {
        const message2 = {
          text: text2,
          type
        };
        this.messageList.push(message2);
      },
      clearMessage() {
        this.messageList = [];
      }
    }
  });
  const cxHomeworkLogic = async () => {
    const log = useLogStore();
    const questionStore = useQuestionStore();
    const setting = useSettingStore();
    log.insertLog(`进入新版作业页面，开始准备答题..`);
    if (!setting.config.basicConfig.autoAnswer.value) {
      log.insertLog(
        `自动答题已关闭，请前往<span class='module'>设置</span>模块中更改`
      );
      return;
    }
    questionStore.accuracy = -1;
    const accuracy = await new QuestionHandler$1("zy").init();
    questionStore.accuracy = accuracy;
    log.insertLog(
      `答题完毕,正确率为${accuracy}%,详情请前往<span class='module'>答题</span>模块查看..`
    );
  };
  const cxExamLogic = async () => {
    const log = useLogStore();
    const setting = useSettingStore();
    log.insertLog(`进入新版考试页面，开始准备答题..`);
    if (!setting.config.basicConfig.autoAnswer.value) {
      log.insertLog(
        `自动答题已关闭，请前往<span class='module'>设置</span>模块中更改`
      );
      return;
    }
    await new QuestionHandler$1("ks").init();
    if (setting.config.examConfig.autoChangeNext.value) {
      log.insertLog("自动切换已开启，正在前往下一题");
      await sleep(setting.config.basicConfig.reqIntervalTime.value);
      document.querySelector(".nextDiv>.jb_btn.jb_btn_92.fs14").click();
    } else {
      log.insertLog(
        "自动切换未开启，请前往<span class='module'>设置</span>模块中更改",
        "warning",
        4
      );
    }
  };
  class QuestionHandler2 extends BasicQuestionHandler {
    constructor(type, iframe) {
      super();
      __publicField(this, "type");
      __publicField(this, "init", async () => {
        var _that = this;
        this.questions = [];
        this.parseHtml();
        if (this.questions.length) {
          this.log.insertLog(
            `成功解析到${this.questions.length}个题目，开始答题..`
          );
          setTimeout(() => {
            _that.setting.tabIndex = "2";
          }, 1e3);
          for (const [index, question] of this.questions.entries()) {
            this.questionStore.currentQuestionIndex = index;
            const answerData = await getAccurateAnswer(question);
            if (answerData.code === 1) {
              question.answer = {
                code: 1,
                answer: answerData.data.answer
              };
              this.setting.userInfo.remainCount = answerData.data.remainCount;
              const errorStatus = !this.fillQuestion(question, index);
              if (errorStatus) {
                question.answer.code = 0;
                continue;
              }
              this.correctNum += 1;
            } else {
              question.answer = {
                code: answerData.code,
                answer: [answerData.msg]
              };
            }
            if (this.type == "zy") {
              const nextBtn = this._document.querySelectorAll(
                "div.switch-btn-box > button:nth-child(2) > span"
              )[0];
              if (nextBtn.innerText === "下一题") {
                nextBtn.click();
              }
            }
          }
          this.questionStore.currentQuestionIndex += 1;
        } else
          this.log.insertLog(
            "没有解析到题目，请检查是否进入正确页面...",
            "warning"
          );
        setTimeout(() => {
          _that.setting.tabIndex = "1";
        }, 2e3);
        return Promise.resolve(
          (this.correctNum / this.questions.length * 100).toFixed(1)
        );
      });
      __publicField(this, "parseHtml", () => {
        this.questionStore.currentQuestionIndex = 0;
        if (!this._document) return [];
        this.addQuestions(this.questionStore.questionList);
        this.questionStore.questionList = this.questions;
      });
      __publicField(this, "fillQuestion", (question, index) => {
        let isSelected = false;
        if (!this._window) return;
        const optionsDOM = document.querySelectorAll(".subject_node")[index].querySelectorAll(".node_detail");
        if (question.type === "单选题" || question.type === "多选题") {
          question.answer.answer.forEach((answer) => {
            optionsDOM.forEach((optionDOM) => {
              if (answer == this.removeHtml(optionDOM.innerHTML)) {
                isSelected = true;
                optionDOM.click();
              } else if (this.removeAllTags(answer) == this.removeAllTags(optionDOM.innerHTML)) {
                isSelected = true;
                optionDOM.click();
              }
            });
          });
        } else if (question.type === "判断题") {
          let answer = "对";
          if (question.answer.answer[0].match(
            /(^|,)(正确|是|对|√|T|ri|right|true)(,|$)/
          )) {
            answer = "对";
          } else if (question.answer.answer[0].match(
            /(^|,)(错误|否|错|×|F|wr|wrong|false)(,|$)/
          )) {
            answer = "错";
          }
          optionsDOM.forEach((optionDOM) => {
            if (answer == this.removeHtml(optionDOM.innerHTML)) {
              isSelected = true;
              optionDOM.click();
            }
          });
        } else ;
        return isSelected;
      });
      __publicField(this, "extractOptions", (questionOptions, questionType) => {
        const optionsObject = {};
        const optionTexts = [];
        questionOptions.forEach((questionOption) => {
          const optionTextContent = this.removeHtml(questionOption.content);
          optionsObject[optionTextContent] = questionOption.content;
          if (questionType !== "判断题") optionTexts.push(optionTextContent);
        });
        return [optionsObject, optionTexts];
      });
      __publicField(this, "addQuestions", (questions) => {
        questions.forEach((question) => {
          const questionTitle = this.removeHtml(question.name);
          const questionType = question.questionType.name;
          const [optionsObject, optionTexts] = this.extractOptions(
            question.questionOptions,
            questionType
          );
          this.questions.push({
            element: JSON.stringify(questions),
            type: questionType,
            title: questionTitle,
            optionsText: optionTexts,
            options: optionsObject,
            answer: { code: -1, answer: [] },
            workType: "zhs",
            refer: this._window.location.href,
            id: "zhs"
          });
        });
      });
      this.type = type;
      if (iframe) {
        this._document = iframe.contentDocument;
        this._window = iframe.contentWindow;
      }
    }
  }
  const fetchHook = (url2, callback) => {
    const questionStore = useQuestionStore();
    function addXMLRequestCallback(callback2) {
      var oldSend, i;
      if (XMLHttpRequest.callbacks) {
        XMLHttpRequest.callbacks.push(callback2);
      } else {
        XMLHttpRequest.callbacks = [callback2];
        oldSend = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.send = function() {
          for (i = 0; i < XMLHttpRequest.callbacks.length; i++) {
            XMLHttpRequest.callbacks[i](this);
          }
          oldSend.apply(this, arguments);
        };
      }
    }
    addXMLRequestCallback(function(xhr) {
      xhr.addEventListener("load", function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          if (xhr.responseURL.includes(url2)) {
            const keywords = ["doExam", "doHomework"];
            if (keywords.some((keyword) => xhr.responseURL.includes(keyword))) {
              let questions = [];
              const questionsParts = JSON.parse(xhr.response).rt.examBase.workExamParts;
              questionsParts.forEach((part) => {
                console.log("part", part.questionDtos);
                questions = questions.concat(part.questionDtos);
              });
              questionStore.questionList = questions;
            }
            callback();
          }
        }
      });
    });
  };
  const autoAnswerLogic = async () => {
    const log = useLogStore();
    const questionStore = useQuestionStore();
    log.insertLog("进入作业页面，脚本开始工作中..");
    questionStore.accuracy = -1;
    const handleFetchHook = async () => {
      const accuracy = await new QuestionHandler2("zy").init();
      questionStore.accuracy = accuracy;
      log.insertLog(`答题完毕,正确率为${accuracy}%,详情请前往<span class='module'>答题</span>模块查看..`);
    };
    ["doHomework", "doExam"].forEach((type) => {
      fetchHook(type, () => handleFetchHook());
    });
  };
  const handleError = (msg) => ({
    code: 10003,
    data: {
      answer: [],
      num: "",
      usenum: ""
    },
    msg
  });
  const fetchBasicInfo = async () => {
    const scriptInfo = getScriptInfo();
    const url2 = getApiBaseUrl() + `/info/baseInfo?version=${scriptInfo.version}&author=${scriptInfo.author}`;
    console.log(url2);
    const headers = {
      "Content-Type": "application/json"
    };
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        url: url2,
        method: "GET",
        headers,
        timeout: 15e3,
        onload: (response) => {
          try {
            const apiResponse = JSON.parse(response.responseText);
            resolve(apiResponse);
          } catch (e) {
            resolve(handleError("解析出错"));
          }
        },
        onerror: (e) => {
          console.log(e);
          resolve(handleError("服务器维护中..自动刷课功能正常使用"));
        },
        ontimeout: () => {
          resolve(handleError("请求超时"));
        }
      });
    });
  };
  const getTokenInfo = async () => {
    const setting = useSettingStore();
    const token = setting.config.basicConfig.token.value;
    const url2 = getApiBaseUrl() + `/info/remains?token=${token}`;
    const headers = {
      "Content-Type": "application/json"
    };
    return new Promise((resolve) => {
      GM_xmlhttpRequest({
        url: url2,
        method: "GET",
        headers,
        timeout: 15e3,
        onload: (response) => {
          try {
            const apiResponse = JSON.parse(response.responseText);
            resolve(apiResponse);
          } catch (e) {
            resolve(handleError("解析出错"));
          }
        },
        onerror: (e) => {
          console.log(e);
          resolve(handleError("服务器维护中..自动刷课功能正常使用"));
        },
        ontimeout: () => {
          resolve(handleError("请求超时"));
        }
      });
    });
  };
  const _hoisted_1$1 = { class: "box-content" };
  const _sfc_main$2 = {
    __name: "index",
    emits: ["customEvent"],
    setup(__props, { emit: __emit }) {
      const isShow = vue.ref(false);
      const log = useLogStore();
      const setting = useSettingStore();
      const emit = __emit;
      const url2 = window.location.href;
      const activeKey = vue.ref(setting.tabIndex);
      const messageStore = useMessageStore();
      const contentMap = [
        {
          tab: "🏠 首页",
          component: ScriptHome
        },
        {
          tab: "📄 日志",
          component: _sfc_main$8
        },
        {
          tab: "🖥️ 答题",
          component: _sfc_main$6
        },
        {
          tab: "🔎 在线搜题",
          component: _sfc_main$4
        },
        // 仅在 URL 包含 "chaoxing.com" 时添加 AI 选项
        ...url2.includes("chaoxing.com") ? [{
          tab: "🤖 AI",
          component: _sfc_main$3
        }] : [],
        {
          tab: "👤 设置",
          component: _sfc_main$5
        }
      ];
      const logicMap = [
        {
          keyword: "/base",
          logic: () => {
            setting.tabIndex = "0";
          }
        },
        {
          keyword: "/space/index",
          logic: () => {
            setting.tabIndex = "0";
          }
        },
        {
          keyword: "mycourse/stu?courseid",
          logic: () => {
            setting.tabIndex = "0";
          }
        },
        {
          keyword: "/mycourse/studentstudy",
          logic: () => {
            setting.tabIndex = "1";
            cxChapterLogic();
          }
        },
        {
          keyword: "/mooc2/work/dowork",
          logic: () => {
            setting.tabIndex = "1";
            cxHomeworkLogic();
          }
        },
        {
          keyword: "/examcode/examnotes",
          logic: () => {
            setting.tabIndex = "0";
            log.insertLog("等待用户进入答题页面中..");
          }
        },
        {
          keyword: "/exam/test/reVersionTestStartNew",
          logic: () => {
            setting.tabIndex = "1";
            cxExamLogic();
          }
        },
        {
          keyword: "exam/preview",
          logic: () => {
            setting.tabIndex = "1";
            log.insertLog("答题完毕，请检阅.如有未作答的题目，可手动进行搜题..");
          }
        },
        {
          keyword: "/stuExamWeb.html",
          logic: () => {
            setting.tabIndex = "1";
            autoAnswerLogic();
          }
        },
        {
          keyword: "/webExamList?",
          logic: () => {
            setting.tabIndex = "0";
          }
        }
      ];
      const chooseLogicByUrl = () => {
        for (const { keyword, logic } of logicMap) {
          if (url2.includes(keyword)) {
            if (!setting.config.basicConfig.token.value) {
              messageStore.insertMessage(
                "检测到未配置密钥，无法使用自动答题功能，请联系vx:fendouxiaoli_购买题库，小李甄选流量卡https://ym.kashijiehaoka.cn/?s=QOHuZsCx513460",
                "warning"
              );
            }
            fetchBasicInfo().then((res) => {
              console.log("fetchBasicInfo", res);
              if (res.code) {
                const { shopLink, version } = res.data;
                setting.shopLink = shopLink;
                setting.latestVersion = version;
              }
            });
            updateTokenInfo();
            logic();
            if (setting.config.searchConfig.searchBySelectedText.value) {
              log.insertLog("划词搜题已开启..");
            }
            selectTextSearchLogic(document, window);
            isShow.value = true;
            return;
          }
        }
        isShow.value = false;
      };
      const updateTokenInfo = () => {
        if (setting.config.basicConfig.token.value) {
          getTokenInfo().then((res) => {
            if (res.code && res.code === 1) {
              const { count, usedCount } = res.data;
              console.log("getTokenInfo", res.data);
              setting.userInfo.remainCount = count - usedCount;
            } else {
              setting.userInfo.remainCount = 0;
            }
          });
        } else {
          setting.userInfo.remainCount = 0;
        }
      };
      const changeTabIndex = (activeKey2) => {
        setting.tabIndex = activeKey2;
      };
      vue.watch(
        () => setting.tabIndex,
        (newVal) => {
          activeKey.value = newVal;
          if (newVal == contentMap.length - 1) {
            updateTokenInfo();
          }
        }
      );
      const changeNewVersion = () => {
        if (url2.includes("/mycourse/studentcourse")) {
          const changeBtn = document.querySelector("a[class='experience']");
          if (changeBtn) {
            changeBtn.click();
          }
        }
      };
      changeNewVersion();
      chooseLogicByUrl();
      emit("customEvent", isShow.value);
      return (_ctx, _cache) => {
        const _component_a_tab_pane = vue.resolveComponent("a-tab-pane");
        const _component_a_tabs = vue.resolveComponent("a-tabs");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, [
          vue.createVNode(_component_a_tabs, {
            activeKey: activeKey.value,
            "onUpdate:activeKey": _cache[1] || (_cache[1] = ($event) => activeKey.value = $event),
            onChange: changeTabIndex
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(), vue.createElementBlock(vue.Fragment, null, vue.renderList(contentMap, (item, index) => {
                return vue.createVNode(_component_a_tab_pane, {
                  tab: item.tab,
                  key: `${index}`
                }, {
                  default: vue.withCtx(() => [
                    (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(item.component), {
                      class: "tab-content",
                      onChangeTab: _cache[0] || (_cache[0] = (newValue) => activeKey.value = newValue)
                    }, null, 32))
                  ]),
                  _: 2
                }, 1032, ["tab"]);
              }), 64))
            ]),
            _: 1
          }, 8, ["activeKey"])
        ]);
      };
    }
  };
  const _hoisted_1 = {
    key: 0,
    class: "message-container"
  };
  const _hoisted_2 = { class: "script-info" };
  const _sfc_main$1 = {
    __name: "index",
    setup(__props) {
      const scriptInfo = getScriptInfo();
      const isMini = vue.ref(false);
      const mainWrapRef = vue.ref(null);
      const boxSize = vue.ref({ width: 400, height: 700 });
      const setting = useSettingStore();
      const isShow = vue.ref(true);
      const messageStore = useMessageStore();
      const messageList = vue.ref(messageStore.messageList);
      vue.watch(
        setting,
        (newVal) => {
          GM_setValue("setting", JSON.stringify(newVal));
        },
        { deep: true }
      );
      const position = vue.ref({
        right: setting.position.right || 0,
        // 添加默认值
        top: setting.position.top || 0
      });
      const isDragging = vue.ref(false);
      const dragOffset = vue.ref({ x: 0, y: 0 });
      const changeBoxSize = () => {
        isMini.value = !isMini.value;
      };
      const startDrag = (event) => {
        event.preventDefault();
        isDragging.value = true;
        const currentRight = parseInt(position.value.right) || 0;
        const currentTop = parseInt(position.value.top) || 0;
        dragOffset.value = {
          x: window.innerWidth - event.clientX - currentRight,
          y: event.clientY - currentTop
        };
        document.addEventListener("mousemove", drag);
        document.addEventListener("mouseup", endDrag);
      };
      const drag = (e) => {
        if (!isDragging.value) return;
        let newRight = window.innerWidth - e.clientX - dragOffset.value.x;
        let newY = e.clientY - dragOffset.value.y;
        if (newRight < 0) {
          newRight = 0;
        }
        if (newRight + boxSize.value.width > window.innerWidth) {
          newRight = window.innerWidth - boxSize.value.width;
        }
        if (newY < 0) {
          newY = 0;
        }
        if (newY + boxSize.value.height > window.innerHeight) {
          newY = window.innerHeight - boxSize.value.height;
        }
        position.value = {
          right: newRight + "px",
          top: newY + "px"
        };
      };
      const endDrag = () => {
        isDragging.value = false;
        setting.position.right = position.value.right;
        setting.position.top = position.value.top;
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("mouseup", endDrag);
      };
      const updateBoxSize = () => {
        if (mainWrapRef.value) {
          const rect = mainWrapRef.value.getBoundingClientRect();
          boxSize.value = {
            width: rect.width,
            height: rect.height
          };
        }
      };
      vue.onMounted(async () => {
        await vue.nextTick();
        updateBoxSize();
        if (window.ResizeObserver) {
          const resizeObserver = new ResizeObserver(() => {
            updateBoxSize();
          });
          if (mainWrapRef.value) {
            resizeObserver.observe(mainWrapRef.value);
          }
        }
      });
      return (_ctx, _cache) => {
        const _component_a_alert = vue.resolveComponent("a-alert");
        return isShow.value ? (vue.openBlock(), vue.createElementBlock("div", {
          key: 0,
          class: "main-wrap",
          style: vue.normalizeStyle(position.value),
          ref_key: "mainWrapRef",
          ref: mainWrapRef
        }, [
          vue.createElementVNode("div", null, [
            !isMini.value ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
              (vue.openBlock(true), vue.createElementBlock(vue.Fragment, null, vue.renderList(messageList.value, (message2) => {
                return vue.openBlock(), vue.createBlock(_component_a_alert, {
                  key: message2,
                  style: { "margin-top": "5px" },
                  message: message2.text,
                  type: message2.type,
                  closable: ""
                }, null, 8, ["message", "type"]);
              }), 128))
            ])) : vue.createCommentVNode("", true)
          ]),
          vue.createElementVNode("div", {
            class: vue.normalizeClass(`main-box ${isMini.value ? "mini" : ""}`)
          }, [
            vue.createElementVNode("div", {
              class: "box-header",
              onMousedown: startDrag
            }, [
              vue.createElementVNode("span", _hoisted_2, "小李-" + vue.toDisplayString(vue.unref(scriptInfo).version), 1),
              vue.createElementVNode("div", {
                onClick: vue.withModifiers(changeBoxSize, ["stop"]),
                onMousedown: _cache[0] || (_cache[0] = vue.withModifiers(() => {
                }, ["stop"])),
                style: { "cursor": "pointer" }
              }, [
                isMini.value ? (vue.openBlock(), vue.createBlock(vue.unref(ExpandOutlined), { key: 0 })) : (vue.openBlock(), vue.createBlock(vue.unref(ShrinkOutlined), { key: 1 }))
              ], 32)
            ], 32),
            vue.createVNode(_sfc_main$2, {
              class: vue.normalizeClass(`box-content ${isMini.value ? "mini" : ""}`),
              onCustomEvent: _cache[1] || (_cache[1] = (newValue) => isShow.value = newValue)
            }, null, 8, ["class"])
          ], 2)
        ], 4)) : vue.createCommentVNode("", true);
      };
    }
  };
  const _sfc_main = /* @__PURE__ */ vue.defineComponent({
    __name: "App",
    setup(__props) {
      return (_ctx, _cache) => {
        return vue.openBlock(), vue.createBlock(_sfc_main$1);
      };
    }
  });
  const hookError = () => {
    console.log("hookError");
    const oldset = _unsafeWindow.setInterval;
    const oldout = _unsafeWindow.setTimeout;
    _unsafeWindow.setInterval = function(...args) {
      const err = new Error("");
      if (err.stack && err.stack.indexOf("checkoutNotTrustScript") !== -1) {
        return -1;
      }
      return oldset.call(this, ...args);
    };
    _unsafeWindow.setTimeout = function(...args) {
      const err = new Error("");
      if (err.stack && err.stack.indexOf("checkoutNotTrustScript") !== -1) {
        return -1;
      }
      return oldout.call(this, ...args);
    };
  };
  const url = _unsafeWindow.location.href;
  if (url.includes("zhihuishu.com")) {
    hookError();
  }
  const timer = setInterval(() => {
    if (document.readyState === "complete") {
      clearInterval(timer);
      const app = vue.createApp(_sfc_main);
      const pinia$1 = pinia.createPinia();
      app.use(pinia$1);
      app.use(Antd);
      app.mount(
        (() => {
          const app2 = document.createElement("div");
          document.body.appendChild(app2);
          return app2;
        })()
      );
    }
  }, 100);

})(Vue, antd, Pinia, rxjs, md5);