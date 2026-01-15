// ==UserScript==
// @name         微博图片批量下载
// @author       Shawlj
// @namespace    https://greasyfork.org/
// @description  本程序适用于新版微博，提供支持微博首页、转发微博、用户微博、精选实时微博、搜索微博页图片下载
// @version      1.2.1
// @match        https://weibo.com
// @match        https://weibo.com/*
// @match        https://d.weibo.com/*
// @match        https://s.weibo.com/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/1.11.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/jszip/3.2.0/jszip.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/dayjs/1.11.10/dayjs.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/1.3.8/FileSaver.min.js
// @resource xinfo https://cdn.jsdelivr.net/gh/Mr-Po/weibo-resource-download/out/media/info.png
// @resource xsuccess https://cdn.jsdelivr.net/gh/Mr-Po/weibo-resource-download/out/media/success.png
// @resource xerror https://cdn.jsdelivr.net/gh/Mr-Po/weibo-resource-download/out/media/error.png
// @connect      sinaimg.cn
// @connect      weibo.com
// @compatible   edge
// @compatible   chrome
// @compatible   firefox
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_notification
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_deleteValue
// @grant        GM_openInTab
// @grant        GM_download
// @grant        window.onurlchange
// @downloadURL https://update.greasyfork.org/scripts/555090/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/555090/%E5%BE%AE%E5%8D%9A%E5%9B%BE%E7%89%87%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
"use strict";
  const r = {
    0: "xerror",
    1: "xsuccess",
    2: "xinfo"
  }, i = {
    attributes: !1,
    childList: !0,
    subtree: !0
  }, u = {
    t: "https://{0}weibo.com/",
    i: "https://wx{0}.sinaimg.cn",
    o: "https://greasyfork.org/zh-CN/scripts/555090"
  }, l = {
    c: {
      0: "#0000FF",
      1: "#eb7340",
      2: "#02A642",
      3: "#FF0000",
      l: "woo-font woo-font--imgSave"
    },
    u: {
      m: 'div[class*="vue-recycle-scroller"]',
      $: '[class^="Feed_body"]',
      p: "wbpro-feed-content",
      v: 'div[class*="_feed"][class*="_retweet"]',
      g: '[class*="_toolbarSpin"]',
      h: 'div[class*="_listContentAnimate"]',
      _: 'div[class*="_imgWrap"]',
      M: "_showPictureViewer",
      A: "picture _row",
      G: "a>span[usercard],a[usercard]>span,a[class*=_time]",
      Y: '[class^="picture-viewer_imgWrap"] img',
      S: "_imgWrap"
    },
    s: {
      j: "pl_feedlist_index",
      g: "ul.tab",
      C: "media-pic-zoom",
      H: "content",
      F: 'div[class="choose-pic"]',
      L: "card-comment",
      G: "a.name,.from a",
      R: "[suda-data^=key]",
      Y: '[node-type="imgBox"]>img'
    }
  };
  function t() {
    if (M.T(48)) {
      var t = new MutationObserver((t, e) => {
        for (var s of t) {
          var r;
          "childList" === s.type && (r = s.addedNodes[0]) && g(`${l.s.C}|${l.u.M}|${l.u.p}|` + l.u.S, r.className) && n(s.target, "xwb_btn");
        }
      }), e = document.querySelectorAll(`${l.u.m}, #${l.s.j}, [class*="${l.u.p}"], ` + l.u.v);
      if (!p(e)) {
        x(`微博图片下载程序准备就绪(${e.length})`);
        for (var s of e) t.observe(s, i);
      }
    }
  }
  $(document).ready(t), window.addEventListener("urlchange", () => {
    setTimeout(() => t(), 2e3);
  });
  const n = (t, e) => {
    let s = [];
    var r = g(_(u.t, "s."), location.href), i = t.querySelector((r ? l.s : l.u).g);
    if (r) {
      var n = $(t).closest("." + l.s.L).length;
      if (0 < (s = (s = $(t).closest("." + l.s.H).find(l.s.G).filter(l.s.R).toArray()).slice(0, n ? 4 : 2)).length) {
        const a = t => t.replace(/[\u4e00-\u9fa5:\s]/g, ""), c = "YYYYMMDDHHmm";
        var o = dayjs();
        s = s.map((t, e) => {
          let s = t.innerText;
          return e % 2 != 0 ? (s = -1 < s.indexOf("秒") ? o.format(c) : -1 < s.indexOf("分") ? o.subtract(parseInt(s), "minute").format(c) : -1 < s.indexOf("今") ? o.format(c.slice(0, 8)) + a(s) : s.indexOf("年") < 0 ? o.format(c.slice(0, 4)) + a(s) : a(s)).padEnd(12, 0).slice(0, 12) : s.replace("@", "");
        });
      }
    } else if (i && $(i).find(`[${e}]`).length < 1) {
      if ((s = $(t).closest("article").find(l.u.G).toArray()).length < 2) return x("页面结构已发生变化[用户昵称或发布时间获取失败");
      s = s.map((t, e) => {
        let s = t.title || t.textContent;
        var r, i, n;
        return e % 2 != 0 ? ((t = (s = s.replace(/[\u4e00-\u9fa5]/g, "")).match(/(\d{1,4})-(\d{1,2})-(\d{1,2})\s+(\d{1,2}):(\d{1,2})/)) && ([ , e, t, r, i, n ] = t, 
        s = "" + e.padStart(4, "20") + t.padStart(2, "0") + r.padStart(2, "0") + i + n), 
        s.padEnd(12, 0)) : s.replace("@", "");
      });
    }
    p(s) || m(t, $(i), s, r, e);
  }, m = (s, r, i, t, n) => {
    var e = t ? l.s.F : l.u.h, e = $(s).find(`${e} img, ${l.u._} img`).toArray();
    const o = new Set(e.map(t => t.src.split("/").pop()));
    e = r.children();
    let a = e.eq(-1).clone().empty().prop("outerHTML");
    a = a.replace(/(<(\w+)[^>]*>)(<\/\2>)/, "$1<a style='color:{0}'>{1}</a>$3"), 
    t ? e.slice(2, 3).remove() : a = e.eq(-2).clone().prop("outerHTML") + a, r.children().eq(0).find("i").each((t, e) => {
      var s, e = e.nextSibling;
      e?.nodeType === Node.TEXT_NODE && (s = v("$xwbn-wsy") ? "无水印" : "默认", $("<span>").css("color", l.c[3]).text(s).replaceAll($(e)));
    });
    var kk = ["\u4e0b\u8f7d\u56fe\u7247", "\u4e0b\u8f7d\u5168\u90e8({0})", "\u590d\u5236\u94fe\u63a5({0})"];
    kk.forEach((t, e) => {
      t = _(t, o.size);
      t = $(_(a, l.c[e], t));
      t.find("a").addBack("a").attr(n, n), 1 < e ? t.click(() => c(o)) : t.click(() => async function(t, e, s, r) {
        let i, n = [ ...t ];
        r && 1 < n.length && 0 < (t = $(e).find('div[class*="_cur"] img, li[class*="cur"] img').toArray()).length && (r = w(/\/([^\/?#]+)[^\/]*$/, t[0].src), 
        i = n.indexOf(r), n = [ r ]);
        (async function(n, o, a) {
          let c = f();
          const l = encodeURIComponent(_(u.t, "")), t = [];
          for (let i = 0; i < n.length; i++) t.push(new Promise(async (t, e) => {
            var s = `${_(u.i, h(4))}/${c}/${n[i]}?referer=` + l, r = await fetch(s), e = (r.ok || e({
              error: r.status,
              k: s
            }), await r.blob()), s = p(a) ? i : a;
            saveAs(e, o + "-" + String(s + 1).padStart(2, 0)), t();
          })), await new Promise(t => setTimeout(t, 200));
          Promise.all(t).then(() => {
            b("图片下载完成 (提示: 若【无水印】下载数量缺少, 请单独下载剩余图片)", 1);
          }).catch(t => {
            b("请求异常: " + t.error, 0), x("当前服务器访问失败，请再次尝试下载", t.k);
          });
        })(n, d(s), i);
      }(o, s, i, e < 1)), r.append(t);
    });
  };
  const c = t => {
    e([ ...t ].map(t => `${_(u.i, h(4))}/${f()}/` + t).join("\n"));
  }, f = () => M.T(50) ? "oslarge" : "large", d = s => {
    const r = new Array(), i = M.T(55);
    return x(M), o(M.D, (t, e) => {
      x(t), v(t[0]) && (t = s[e - 3]) && (e % 3 != 0 ? r.push(i ? t : t.slice(0, 8)) : r.push(t));
    }, [ 3, 6 ]), M.T(56) && r.push(dayjs().format("YYYYMMDDHHmmssSSS")), r.join("-");
  };
  const w = (t, e) => {
    e = e.match(t);
    return 1 < e.length ? e[1] : null;
  }, e = t => {
    navigator.clipboard.writeText(t).then(function() {
      x("复制成功！");
    }, function(t) {
      x("复制失败：", t);
    });
  }, o = (i, n, t = [ 0, i.length ]) => {
    if (i) {
      let s = t[0], r = t[1];
      if ("object" == typeof i) Object.values(i).forEach((t, e) => {
        e >= s && e <= r && n(t, e, i);
      }); else for (let t = s; t < r; t++) n(i[t], t, i);
    }
  }, p = t => void 0 === t || "undefined" == t || void 0 === t || null == t || t.length < 1 || "" === t || "object" == typeof t && 0 == t.length;
  const a = (t, e) => (GM_setValue(t, e), e), v = t => GM_getValue(t);
  const g = (t, e) => new RegExp(t).test(e);
  const x = (...t) => console.log(...t);
  const b = (t, e, s) => {
    M.T(49) && GM_notification({
      title: s,
      text: t,
      P: GM_getResourceURL(r[e]),
      timeout: 3e3
    });
  }, h = t => Math.floor(Math.random() * t) + 1, _ = function() {
    if (0 == arguments.length) return null;
    for (var t = arguments[0], e = 1; e < arguments.length; e++) var s = new RegExp("\\{" + (e - 1) + "\\}", "gm"), t = t.replace(s, arguments[e]);
    return t;
  };
  const M = new class {
    constructor() {
      this.V = new Array(9), this.D = {
        48: [ "$xwbp-xdn", "脚本启用", !0, "(Alt+0)" ],
        49: [ "$xwbn-xms", "消息通知", !0, "(Alt+1)" ],
        50: [ "$xwbn-wsy", "开启无水印下载 (画质压缩)", !0, "(Alt+2)" ],
        51: [ "$xwbf-xn1", "文件名：昵称 (原)", !0, "(Alt+3)" ],
        52: [ "$xwbf-xt1", "文件名：时间 (原)", !0, "(Alt+4)" ],
        53: [ "$xwbf-xn2", "文件名：昵称 (转)", !1, "(Alt+5)" ],
        54: [ "$xwbf-xt2", "文件名：时间 (转)", !1, "(Alt+6)" ],
        55: [ "$xwbf-sfm", "文件名：时分秒", !0, "(Alt+7)" ],
        56: [ "$xwbf-stm", "文件名：时间戳", !0, "(Alt+8)" ]
      };
    }
    O() {
      return this.V.forEach(t => GM_unregisterMenuCommand(t)), Object.values(this.D).forEach((t, e) => {
        var s, r;
        t.splice(2, 1, (s = t[0], r = t[2], p(v(s)) && a(s, r), v(s))), this.V[e] = GM_registerMenuCommand(`${t[2] ? "✅" : "❌"} ${t[1]} ` + t[3], () => this.W(t)), 
        7 < e && this.V.push(GM_registerMenuCommand("💬 反馈 & 建议", () => GM_openInTab(u.o)));
      }), this;
    }
    W(t) {
      t && this.O(a(t[0], !t[2]));
    }
    I() {
      return $(document).keydown(t => {
        var t = t || window.event, e = t.keyCode || t.which;
        return t.altKey && e && this.W(this.D[e]), !0;
      }), this;
    }
    T(t) {
      return v(this.D[t][0]);
    }
  }().O().I();