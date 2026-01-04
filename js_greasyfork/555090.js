// ==UserScript==
// @name         微博图片批量下载
// @author       Shawlj
// @namespace    https://greasyfork.org/
// @description  本程序适用于新版微博，提供支持微博首页、转发微博、用户微博、精选实时微博、搜索微博页图片下载
// @version      1.1
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

const i = {
  0: "xerror",
  1: "xsuccess",
  2: "xinfo"
}, n = {
  attributes: !1,
  childList: !0,
  subtree: !0
}, u = {
  t: "https://{0}weibo.com/",
  i: "https://wx{0}.sinaimg.cn",
  o: "https://greasyfork.org/zh-CN/scripts/555090"
}, m = {
  c: {
    l: "#eb7340",
    u: "#0000FF",
    $: "#02A642",
    m: "#FF0000",
    p: "woo-font woo-font--imgSave"
  },
  v: {
    g: "vue-recycle-scroller__item-wrapper",
    h: '[class^="Feed_body"]',
    _: '[class*="picture-tool-bar_toolbarSpin"]',
    M: "picture-viewer_previewList",
    A: "picture-viewer_listContentAnimate",
    G: "picture-viewer_imgWrap",
    S: "picture-viewer_showPictureViewer",
    Y: "a[usercard]>span,a[class^=head-info_time]",
    j: '[class^="picture-viewer_imgWrap"] img'
  },
  s: {
    C: "pl_feedlist_index",
    _: "ul.tab",
    k: "media-pic-zoom",
    F: "content",
    R: "choose-pic",
    D: "card-comment",
    Y: "a.name,.from a",
    H: "[suda-data^=key]",
    j: '[node-type="imgBox"]>img'
  }
};

function e() {
  if (L.L(48)) {
    var e = new MutationObserver((e, t) => {
      for (var r of e) {
        var i;
        "childList" === r.type && (i = r.addedNodes[0]) && S(m.s.k + "|" + m.v.S, i.className) && s(r.target, "xwb_btn");
      }
    }), t = document.querySelectorAll(`.${m.v.g}, ${m.v.h}, #` + m.s.C);
    if (!b(t)) {
      j(`微博图片批量下载程序准备就绪(${t.length})`);
      for (var r of t) e.observe(r, n);
    }
  }
}

$(document).ready(e), window.addEventListener("urlchange", () => {
  setTimeout(() => e(), 2e3);
});

const s = (e, t) => {
  let r, i = [];
  var n = S(D(u.t, "s."), location.href), s = e.querySelector((n ? m.s : m.v)._);
  if (n) {
    r = m.s.R;
    var o = $(e).closest("." + m.s.D).length;
    if ((i = (i = $(e).closest("." + m.s.F).find(m.s.Y).filter(m.s.H).toArray()).slice(0, o ? 4 : 2)).length) {
      const a = "YYYYMMDDHHmm";
      i = i.map((e, t) => {
        let r = e.innerText;
        return t % 2 != 0 ? (t = (e = (r = r.replace(/[\u4e00-\u9fa5:\s]/g, "")).length) < 3 ? a : e < 5 ? a.slice(0, 8) : e < 9 ? a.slice(0, 4) : null, 
        (r = t ? dayjs().format(t) + r : r).padEnd(14, 0)) : r.replace("@", "");
      });
    }
  } else s && b($(s).attr(t)) && ((i = $(e).closest("article").find(m.v.Y).toArray()).length && (i = i.map(e => (e.title || e.textContent).replace(/[@\-\:\s]/g, ""))), 
  o = $(e).find(`[class*="${m.v.A}"]`).length, r = 0 < o ? m.v.A : m.v.G);
  b(i) || c(e, s, i, r, n, t);
}, c = (e, t, r, i, n, s) => {
  var o = "<a style='color:{0}'>{1}</a>", a = $($(t.lastChild).context.outerHTML).empty()[0].outerHTML, i = $(e).find(`div[class*="${i}"] img`).toArray();
  const c = new Set(i.map((e, t) => e.src.split("/").pop()));
  let l = "", u = t.firstChild;
  n ? (u = u.firstChild, $(t.children[2]).remove()) : (l = $(t.children[1]).context.outerHTML, 
  $(t).append(l).attr(s, s));
  i = y("$xwbn-wsy") ? "无水印" : "默认";
  f(u, i, m.c.m), $(t).append($(a).append(D(o, m.c.u, "下载图片")).click(() => w(e, r, c, !0))).append(l), 
  $(t).append($(a).append(D(o, m.c.l, `下载全部(${c.size})`)).click(() => w(e, r, c))).append(l), 
  $(t).append($(a).append(D(o, m.c.$, `复制链接(${c.size})`)).click(() => p(c))).append(l);
};

function f(e, t, r) {
  if (e) {
    r && (e.style.color = r);
    for (var i = e.childNodes, n = 0; n < i.length; n++) if (i[n].nodeType === Node.TEXT_NODE) {
      i[n].nodeValue = t;
      break;
    }
  }
}

async function w(e, t, r, i) {
  let n, s = [ ...r ], o = !0;
  i && ((r = $(e).find(m.v.j + "," + m.s.j)) ? (i = d(/\/([^\/?#]+)[^\/]*$/, r[0].src), 
  n = s.indexOf(i), s = [ i ]) : o = k("下载发生错误，页面元素已变更，请前往官方升级最新版")), o && await a(s, l(t), n);
}

async function a(s, o, a) {
  let c = t();
  const l = encodeURIComponent(D(u.t, ""));
  var e = [];
  for (let n = 0; n < s.length; n++) e.push(new Promise(async (e, t) => {
    var r = `${D(u.i, R(4))}/${c}/${s[n]}?referer=` + l, i = await fetch(r), t = (i.ok || t({
      error: i.status,
      P: r
    }), await i.blob()), r = b(a) ? n : a;
    saveAs(t, o + "-" + String(r + 1).padStart(2, 0)), e();
  })), await new Promise(e => setTimeout(e, 200));
  Promise.all(e).then(() => {
    F("图片下载完成 (提示: 若【无水印】下载数量缺少, 请单独下载剩余图片)", 1);
  }).catch(e => {
    F("请求异常: " + e.error, 0), j("当前服务器访问失败，请再次尝试下载", e.P);
  });
}

const p = e => {
  o([ ...e ].map(e => `${D(u.i, R(4))}/${t()}/` + e).join("\n"));
}, t = () => L.L(50) ? "oslarge" : "large", l = r => {
  const i = new Array(), n = L.L(55);
  return j(L), v(L.V, (e, t) => {
    j(e), y(e[0]) && (e = r[t - 3], j(e), j("新循环迭代值： " + e), e) && (t % 3 != 0 ? i.push(n ? e : e.slice(0, 8)) : i.push(e));
  }, [ 3, 6 ]), L.L(56) && i.push(dayjs().format("YYYYMMDDHHmmssSSS")), i.join("-");
}, r = (e, t) => $(D(u.href, e)).click(t), d = (e, t) => {
  t = t.match(e);
  return 1 < t.length ? t[1] : null;
}, o = e => {
  navigator.clipboard.writeText(e).then(function() {
    j("复制成功！");
  }, function(e) {
    j("复制失败：", e);
  });
}, v = (n, s, e = [ 0, n.length ]) => {
  if (n) {
    let r = e[0], i = e[1];
    if ("object" == typeof n) Object.values(n).forEach((e, t) => {
      t >= r && t <= i && s(e, t, n);
    }); else for (let e = r; e < i; e++) s(n[e], e, n);
  }
}, b = e => void 0 === e || "undefined" == e || void 0 === e || null == e || e.length < 1 || "" === e || "object" == typeof e && 0 == e.length, x = (e, t) => b(t) ? ($.each(e, (e, t) => M(e, t)), 
e) : M(e, t), g = (...e) => e.forEach(e => A(e)), h = (e, t, r) => (b(y(e)) && M(e, t), 
y(e)), _ = (r, e, t) => {
  1 == t && (r = new Map()), $.each(e, (e, t) => {
    r.set(e, t);
  });
}, M = (e, t) => (GM_setValue(e, t), t), y = e => GM_getValue(e), A = e => GM_deleteValue(e), G = e => GM_addStyle(e), S = (e, t) => new RegExp(e).test(t), Y = e => /^true$/i.test(e), j = (...e) => console.log(...e), C = (...e) => console.error(...e), k = (...e) => {
  console.log(...e), alert(e[0]);
}, F = (e, t, r) => {
  L.L(49) && GM_notification({
    title: r,
    text: e,
    O: GM_getResourceURL(i[t]),
    timeout: 3e3
  });
}, R = e => Math.floor(Math.random() * e) + 1, D = function() {
  if (0 == arguments.length) return null;
  for (var e = arguments[0], t = 1; t < arguments.length; t++) var r = new RegExp("\\{" + (t - 1) + "\\}", "gm"), e = e.replace(r, arguments[t]);
  return e;
};

class H {
  constructor() {
    this.T = new Array(9), this.V = {
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
  I() {
    return this.T.forEach(e => GM_unregisterMenuCommand(e)), Object.values(this.V).forEach((e, t) => {
      e.splice(2, 1, h(e[0], e[2])), this.T[t] = GM_registerMenuCommand(`${e[2] ? "✅" : "❌"} ${e[1]} ` + e[3], () => this.N(e)), 
      7 < t && this.T.push(GM_registerMenuCommand("💬 反馈 & 建议", () => GM_openInTab(u.o)));
    }), this;
  }
  N(e) {
    e && this.I(M(e[0], !e[2]));
  }
  U() {
    return $(document).keydown(e => {
      var e = e || window.event, t = e.keyCode || e.which;
      return e.altKey && t && this.N(this.V[t]), !0;
    }), this;
  }
  L(e) {
    return y(this.V[e][0]);
  }
}

const L = new H().I().U();