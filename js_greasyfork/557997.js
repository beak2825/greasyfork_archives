// ==UserScript==
// @name         JAV-JHS
// @namespace    https://sleazyfork.org/zh-CN/scripts/533695-jav-jhs
// @version      3.3.6
// @author       xie bro
// @description  Jav-鉴黄师 收藏、屏蔽、标记已下载; 屏蔽标签、屏蔽演员、同步收藏演员、新作品检测; 免VIP查看热播、Top250排行榜、Fc2ppv、可查看所有评论信息、相关清单; 支持云盘备份; 以图识图; 字幕搜索; JavDb|JavBus
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=javdb.com
// @match        https://javdb.com/*
// @match        https://www.javbus.com/*
// @include      https://javdb*.com/*
// @include      https://*javbus*/*
// @include      https://*javsee*/*
// @include      https://*seejav*/*
// @include      https://javtrailers.com/*
// @include      https://subtitlecat.com/*
// @include      https://www.aliyundrive.com/*
// @include      https://www.alipan.com/*
// @include      https://115.com/*
// @exclude      https://*javbus*/forum/*
// @exclude      https://*javbus*/*actresses
// @exclude      https://*javsee*/forum/*
// @exclude      https://*javsee*/*actresses
// @exclude      https://*seejav*/forum/*
// @exclude      https://*seejav*/*actresses
// @require      https://update.greasyfork.org/scripts/540597/1613170/parallel_GM_xmlhttpRequest.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/tabulator-tables@6.3.1/dist/js/tabulator.min.js
// @require      https://cdn.jsdelivr.net/npm/layui-layer@1.0.9/dist/layer.min.js
// @require      https://cdn.jsdelivr.net/npm/blueimp-md5@2.19.0/js/md5.min.js
// @require      https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js
// @require      https://cdn.jsdelivr.net/npm/localforage@1.10.0/dist/localforage.min.js
// @require      https://cdn.jsdelivr.net/npm/viewerjs@1.11.1/dist/viewer.min.js
// @require      https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js
// @connect      xunlei.com
// @connect      geilijiasu.com
// @connect      aliyundrive.com
// @connect      aliyundrive.net
// @connect      ja.wikipedia.org
// @connect      beta.magnet.pics
// @connect      jdforrepam.com
// @connect      cc3001.dmm.co.jp
// @connect      cc3001.dmm.com
// @connect      www.dmm.co.jp
// @connect      www.dmm.com
// @connect      api.dmm.com
// @connect      special.dmm.co.jp
// @connect      adult.contents.fc2.com
// @connect      fc2ppvdb.com
// @connect      123av.com
// @connect      u3c3.com
// @connect      u9a9.com
// @connect      btsow.lol
// @connect      sukebei.nyaa.si
// @connect      javstore.net
// @connect      3xplanet.com
// @connect      javbest.net
// @connect      missav.live
// @connect      jable.tv
// @connect      www.av.gl
// @connect      jav.rs
// @connect      javtrailers.com
// @connect      javdb.com
// @connect      javbus.com
// @connect      supjav.com
// @connect      115.com
// @connect      127.0.0.1
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        unsafeWindow
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/557997/JAV-JHS.user.js
// @updateURL https://update.greasyfork.org/scripts/557997/JAV-JHS.meta.js
// ==/UserScript==

var t, e, n, a, i = Object.defineProperty, s = t => {
    throw TypeError(t);
}, o = (t, e, n) => ((t, e, n) => e in t ? i(t, e, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: n
}) : t[e] = n)(t, "symbol" != typeof e ? e + "" : e, n), r = (t, e, n) => (((t, e, n) => {
    e.has(t) || s("Cannot " + n);
})(t, e, "access private method"), n);

const l = window.location.href, c = l.includes("javdb"), d = l.includes("javbus") || l.includes("seejav") || l.includes("bus") || l.includes("javsee") || "javbus" === (null == (t = $(".hidden-xs").attr("alt")) ? void 0 : t.trim().toLowerCase()), h = l.includes("/search?q") || l.includes("/search/") || l.includes("/users/"), p = "filter", g = "favorite", m = "hasDown", u = "hasWatch", v = "🚫 屏蔽", f = "🚫 已屏蔽", b = "#de3333", w = "⭐ 收藏", y = "⭐ 已收藏", x = "#25b1dc", k = "📥️ 已下载", S = "#7bc73b", C = "🔍 已观看", _ = "#d7a80c", T = "no", I = "yes", B = "javdb", P = "javbus", D = "actor", L = "actress", M = "censored", A = "uncensored", F = [ {
    id: "video-mhb",
    quality: "dmb_w",
    text: "旧视频源-中画质宽版 (404p)",
    canSelect: !1
}, {
    id: "video-mhb",
    quality: "sm_s",
    text: "旧视频源-低画质 (240p)",
    canSelect: !1
}, {
    id: "video-mhb",
    quality: "dm_s",
    text: "旧视频源-中画质 (360p)",
    canSelect: !1
}, {
    id: "video-mhb",
    quality: "dmb_s",
    text: "旧视频源-中画质 (480p)",
    canSelect: !1
}, {
    id: "video-mhb",
    quality: "mhb_w",
    text: "旧视频源-高画质宽版 (404p)",
    canSelect: !1
}, {
    id: "video-mmb",
    quality: "mmb",
    text: "中画质 (432p)",
    canSelect: !0
}, {
    id: "video-mhb",
    quality: "mhb",
    text: "高画质 (576p)",
    canSelect: !0
}, {
    id: "video-hmb",
    quality: "hmb",
    text: "HD (720p)",
    canSelect: !0
}, {
    id: "video-hhb",
    quality: "hhb",
    text: "FullHD (1080p)",
    canSelect: !0
}, {
    id: "video-hhbs",
    quality: "hhbs",
    text: "FullHD (1080p60fps)",
    canSelect: !0
}, {
    id: "video-4k",
    quality: "4k",
    text: "4K (2160p)",
    canSelect: !0
}, {
    id: "video-4ks",
    quality: "4ks",
    text: "4K (2160p60fps)",
    canSelect: !0
} ];

let j = "";

window.location.href.includes("hideNav=1") && (j = "\n         .navbar-default {\n            display: none !important;\n        }\n        body {\n            padding-top:0px!important;\n        }\n    ");

const N = `\n<style>\n    .top-bar {\n        z-index: 12345689 !important;\n    }\n    \n    ${j}\n\n    .masonry {\n        height: 100% !important;\n        width: 100% !important;\n        padding: 0 15px !important;\n    }\n    .masonry {\n        display: grid;\n        column-gap: 10px; /* 列间距*/\n        row-gap: 10px; /* 行间距 */\n        grid-template-columns: repeat(4, minmax(0, 1fr));\n        align-items: start;\n    }\n    .masonry .item {\n        /*position: initial !important;*/\n        top: initial !important;\n        left: initial !important;\n        float: none !important;\n        background-color:#c4b1b1;\n        position: relative !important;\n    }\n    \n    .masonry .item:hover {\n        box-shadow: 0 .5em 1em -.125em rgba(10, 10, 10, .1), 0 0 0 1px #485fc7;\n    }\n    .masonry .movie-box{\n        width: 100% !important;\n        height: 100% !important;\n        margin: 0 !important;\n        overflow: inherit !important;\n    }\n    .masonry .movie-box .photo-frame {\n        /*height: 70% !important;*/\n        height:auto !important;\n        margin: 0 !important;\n        position:relative; /* 方便预览视频定位*/\n    }\n    .masonry .movie-box img {\n        max-height: 500px;\n        height: 100% !important;\n        object-fit: contain;\n        object-position: top;\n    }\n    .masonry .movie-box img:hover {\n      transform: scale(1.04);\n      transition: transform 0.3s;\n    }\n    .masonry .photo-info{\n        /*height: 30% !important;*/\n    }\n    .masonry .photo-info span {\n      display: inline-block; /* 或者 block */\n      max-width: 100%;      /* 根据父容器限制宽度 */\n      white-space: nowrap;  /* 禁止换行 */\n      overflow: hidden;     /* 隐藏溢出内容 */\n      text-overflow: ellipsis; /* 显示省略号 */\n    }\n    \n    /* 无码页面的样式 */\n    .photo-frame .mheyzo,\n    .photo-frame .mcaribbeancom2{\n        margin-left: 0 !important;\n    }\n    .avatar-box{\n        width: 100% !important;\n        display: flex !important;\n        margin:0 !important;\n    }\n    .avatar-box .photo-info{\n        display: flex;\n        justify-content: center;\n        align-items: center;\n        gap: 30px;\n        flex-direction: row;\n        background-color:#fff !important;\n    }\n    \n    footer{\n        display: none!important;\n    }\n    \n        \n    .video-title {\n        white-space: normal !important;\n        height: 75px; /* 固定高度 容器就不会出现高低不一*/\n        \n        display: -webkit-box !important; /* 必须设置，使接下来的属性生效 */\n        -webkit-box-orient: vertical; /* 垂直方向堆叠行 */\n        -webkit-line-clamp: 3; /* 设置文本最多显示的行数*/\n    }\n\n    \n</style>\n`;

let E = "";

window.location.href.includes("hideNav=1") && (E = "\n        .main-nav,#search-bar-container {\n            display: none !important;\n        }\n        \n        html {\n            padding-top:0px!important;\n        }\n    ");

const H = `\n<style>\n    ${E}\n    \n    .navbar {\n        z-index: 12345679 !important;\n        padding: 0 0;\n    }\n    \n    .navbar-link:not(.is-arrowless) {\n        padding-right: 33px;\n    }\n    \n    .sub-header,\n    /*#search-bar-container, !*搜索框*!*/\n    #footer,\n    /*.search-recent-keywords, !*搜索框底部热搜词条*!*/\n    .app-desktop-banner,\n    div[data-controller="movie-tab"] .tabs,\n    h3.main-title,\n    div.video-detail > div:nth-child(4) > div > div.tabs.no-bottom > ul > li:nth-child(3), /* 相关清单*/\n    div.video-detail > div:nth-child(4) > div > div.tabs.no-bottom > ul > li:nth-child(2), /* 短评按钮*/\n    div.video-detail > div:nth-child(4) > div > div.tabs.no-bottom > ul > li:nth-child(1), /*磁力面板 按钮*/\n    .top-meta,\n    .float-buttons {\n        display: none !important;\n    }\n    \n    div.tabs.no-bottom,\n    .tabs ul {\n        border-bottom: none !important;\n    }\n    \n    \n    /* 视频列表项 相对相对 方便标签绝对定位*/\n    .movie-list .item {\n        position: relative !important;\n    }\n    \n    .video-title {\n        white-space: normal !important;\n        height: 80px; /* 固定高度 容器就不会出现高低不一*/\n        \n        display: -webkit-box; /* 必须设置，使接下来的属性生效 */\n        -webkit-box-orient: vertical; /* 垂直方向堆叠行 */\n        -webkit-line-clamp: 3; /* 设置文本最多显示的行数*/\n    }\n    \n    /* 列表页顶部分类自适应 */\n    .main-tabs, .tabs {\n        overflow-x:hidden;\n        flex-wrap: wrap;\n        justify-content: flex-start;\n    }\n    \n    .main-tabs ul, .tabs ul {\n        flex-wrap: wrap;\n        flex-grow: 0;\n    }\n    \n    \n    /* 二级工具栏 大小封面,可播放,含磁链...*/\n    .toolbar {\n        display: flex;\n    }\n\n</style>\n`;

const z = `\n<style>\n    /* 全局通用样式 */\n    .fr-btn {\n        float: right;\n        margin-left: 4px !important;\n    }\n    \n    .menu-box {\n        position: fixed;\n        right: 10px;\n        top: 50%;\n        transform: translateY(-50%);\n        display: flex;\n        flex-direction: column;\n        z-index: 1000;\n        gap: 6px;\n    }\n    \n    .menu-btn {\n        display: inline-block;\n        min-width: 80px;\n        padding: 7px 12px;\n        border-radius: 4px;\n        color: white !important;\n        text-decoration: none;\n        font-weight: bold;\n        font-size: 12px;\n        text-align: center;\n        cursor: pointer;\n        transition: all 0.3s ease;\n        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n        text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);\n        border: none;\n        line-height: 1.3;\n        margin: 0;\n    }\n    \n    .menu-btn:hover {\n        transform: translateY(-1px);\n        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);\n        opacity: 0.9;\n    }\n    \n    .menu-btn:active {\n        transform: translateY(0);\n        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);\n    }\n    \n    .do-hide {\n        display: none !important;\n    }\n    \n    .main-tab-btn {\n        border-bottom:none !important; \n        border-radius:3px !important; \n        height: 30px; \n        margin-left: 5px !important; \n    }\n\n    .jhs-icon {\n        width: 16px;\n        height: 16px;\n    }\n    \n    .tool-box .jhs-icon {\n        width: 1.5rem;\n        height: 1.5rem; \n    }\n     \n    .tabulator{\n        margin: 0 !important;\n    }\n    \n    /*表格内按钮溢出,防止被隐藏*/\n    .tabulator .tabulator-row .action-cell-dropdown {\n        overflow: visible !important;\n    }\n    /* 去除行内鼠标小手*/\n    .tabulator .tabulator-row.tabulator-selectable:hover {\n        cursor: default !important;\n    }\n    \n    /* 排序小箭头颜色 */\n    .tabulator .tabulator-col.tabulator-sortable[aria-sort="ascending"] .tabulator-arrow {\n        border-bottom-color: #337ab7 !important;\n    }\n    .tabulator .tabulator-col.tabulator-sortable[aria-sort="descending"] .tabulator-arrow {\n        border-top-color: #337ab7 !important;\n    }\n    \n    /* 针对折叠行的容器或内容进行样式修改 */\n    .tabulator-responsive-collapse {\n        border-top: none !important;\n    }\n    \n    .tabulator-responsive-collapse table{\n        margin-left: 50px !important;\n    }\n    \n    .tabulator-cell {\n        height:auto !important;\n    }\n    \n    /* 列允许换行,去除省略号 */\n    .tabulator .tabulator-cell {\n        white-space: normal !important; \n        text-overflow: clip !important; \n    }\n    \n    .tabulator-tableholder {\n        overflow-x: hidden !important;\n    }\n\n    ${function() {
    const t = [ ".jhs-scrollbar", ".content-panel", ".tabulator-tableholder", ".has-navbar-fixed-top", ".layui-layer-content" ], e = (t, e) => t.map((t => `${t}${e}`)).join(","), n = "::-webkit-scrollbar-track", a = "::-webkit-scrollbar-thumb", i = "::-webkit-scrollbar-thumb:hover";
    return `\n    ${e(t, "::-webkit-scrollbar")}{width:6px;height:6px;}\n    ${e(t, n)}{background:#f1f1f1;border-radius:10px;}\n    ${e(t, a)}{background:#888;border-radius:10px;}\n    ${e(t, i)}{background:#555;}\n    `.trim().replace(/\n/g, "");
}()}\n</style>\n`;

function U(t) {
    if (t) if (t.includes("<style>")) document.head.insertAdjacentHTML("beforeend", t); else {
        const e = document.createElement("style");
        e.textContent = t, document.head.appendChild(e);
    }
}

d && U(N), c && U(H), U("\n<style>\n    .a-normal, /* 白色 */\n    .a-primary, /* 浅蓝色 */\n    .a-success, /* 浅绿色 */\n    .a-danger, /* 浅粉色 */\n    .a-warning, /* 浅橙色 */\n    .a-info /* 灰色 */\n    {\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        padding: 6px 14px;\n        margin-right: 10px;\n        border-radius: 6px;\n        text-decoration: none;\n        font-size: 13px;\n        font-weight: 500;\n        transition: all 0.2s ease;\n        cursor: pointer;\n        border: 1px solid rgba(0, 0, 0, 0.08);\n        white-space: nowrap;\n    }\n    \n    .a-primary {\n        background: #e0f2fe;\n        color: #0369a1;\n        border-color: #bae6fd;\n    }\n    \n    .a-primary:hover {\n        background: #bae6fd;\n    }\n    \n    .a-success {\n        background: #dcfce7;\n        color: #166534;\n        border-color: #bbf7d0;\n    }\n    \n    .a-success:hover {\n        background: #bbf7d0;\n    }\n    \n    .a-danger {\n        background: #fee2e2;\n        color: #b91c1c;\n        border-color: #fecaca;\n    }\n    \n    .a-danger:hover {\n        background: #fecaca;\n    }\n    \n    .a-warning {\n        background: #ffedd5;\n        color: #9a3412;\n        border-color: #fed7aa;\n    }\n    \n    .a-warning:hover {\n        background: #fed7aa;\n    }\n    \n    .a-info {\n        background: #e2e8f0;\n        color: #334155;\n        border-color: #cbd5e1;\n    }\n    \n    .a-info:hover {\n        background: #cbd5e1;\n    }\n    \n    .a-normal {\n        background: transparent;\n        color: #64748b;\n        border-color: #cbd5e1;\n    }\n    \n    .a-normal:hover {\n        background: #f8fafc;\n    }\n</style>\n"), 
U(z);

e = new WeakSet, n = async function(t, e) {
    t === this.favorite_actresses_key && window.clean_cacheFavoriteActressList(), t === this.blacklist_car_list_key && window.clean_cacheBlacklistCarList(), 
    t === this.setting_key && window.clean_cacheSettingObj(), t === this.car_list_key && window.clean_cacheCarList(), 
    await this.forage.setItem(t, e);
}, a = async function(t, a, i) {
    let s;
    if (Array.isArray(t)) s = [ ...t ]; else {
        if (s = await this.forage.getItem(a) || [], s.includes(t)) {
            const e = `${t} ${i}已存在`;
            throw show.error(e), new Error(e);
        }
        s.push(t);
    }
    return await r(this, e, n).call(this, a, s), s;
};

let O = class t {
    constructor() {
        var n, a, i;
        if (n = this, (a = e).has(n) ? s("Cannot add the same private member more than once") : a instanceof WeakSet ? a.add(n) : a.set(n, i), 
        o(this, "car_list_key", "car_list"), o(this, "filter_keyword_title_key", "filter_keyword_title"), 
        o(this, "filter_keyword_review_key", "filter_keyword_review"), o(this, "setting_key", "setting"), 
        o(this, "blacklist_key", "blacklist"), o(this, "blacklist_car_list_key", "blacklist_car_list"), 
        o(this, "favorite_actresses_key", "favorite_actresses"), o(this, "highlighted_tags_key", "highlighted_tags"), 
        o(this, "forage", localforage.createInstance({
            driver: localforage.INDEXEDDB,
            name: "JAV-JHS",
            version: 1,
            storeName: "appData"
        })), o(this, "cacheCarList", null), o(this, "cacheBlacklistCarList", null), o(this, "cacheFavoriteActressList", null), 
        o(this, "cacheSettingObj", null), t.instance) throw new Error("StorageManager已被实例化过了!");
        t.instance = this;
    }
    async getCarList() {
        return this.cacheCarList || (this.cacheCarList = await this.forage.getItem(this.car_list_key) || []), 
        utils.copyObj(this.cacheCarList);
    }
    async getCar(t) {
        return (await this.getCarList()).find((e => e.carNum === t));
    }
    _handleSingleCar(t, e) {
        let {carNum: n, url: a, names: i, actionType: s, publishTime: o, starId: r} = t;
        if (!n) throw show.error("番号为空!"), new Error("番号为空!");
        if (!a) throw show.error("url为空!"), new Error("url为空!");
        a.includes("http") || (a = window.location.origin + a), i && (i = i.trim());
        let l = e.find((t => t.carNum === n));
        if (l) i && (l.names = i), a && (l.url = a), o && (l.publishTime = o), l.updateDate = utils.getNowStr(); else {
            let t = utils.getNowStr();
            l = {
                carNum: n,
                url: a,
                names: i,
                status: "",
                createDate: t,
                updateDate: t,
                publishTime: o
            }, r && (l.starId = r), e.push(l);
        }
        switch (s) {
          case p:
            if (l.status === p) {
                const t = `${n} 已在屏蔽列表中`;
                throw show.error(t), new Error(t);
            }
            l.status = p;
            break;

          case g:
            if (l.status === g) {
                const t = `${n} 已在收藏列表中`;
                throw show.error(t), new Error(t);
            }
            l.status = g;
            break;

          case m:
            l.status = m;
            break;

          case u:
            l.status = u;
            break;

          default:
            const t = "actionType错误, 请联系作者更正: " + s;
            throw show.error(t), new Error(t);
        }
    }
    async saveCar(t) {
        const a = await this.forage.getItem(this.car_list_key) || [];
        this._handleSingleCar(t, a), await r(this, e, n).call(this, this.car_list_key, a), 
        await this.removeNewVideoList([ t.carNum ]);
    }
    async updateCarInfo(t) {
        let {carNum: a, url: i, names: s, actionType: o, publishTime: l, remark: c} = t;
        if (!a) throw show.error("番号为空!"), new Error("番号为空!");
        if (!i) throw show.error("url为空!"), new Error("url为空!");
        s && (s = s.trim());
        const d = await this.forage.getItem(this.car_list_key) || [];
        let h = d.find((t => t.carNum === a));
        if (!h) {
            const t = "数据不存在: " + a;
            throw show.error(t), new Error(t);
        }
        switch (h.names = s, h.url = i, h.remark = c, h.updateDate = utils.getNowStr(), 
        o) {
          case p:
            h.status = p;
            break;

          case g:
            h.status = g;
            break;

          case m:
            h.status = m;
            break;

          case u:
            h.status = u;
            break;

          default:
            const t = "actionType错误, 请联系作者更正: " + o;
            throw show.error(t), new Error(t);
        }
        await r(this, e, n).call(this, this.car_list_key, d);
    }
    async saveCarList(t) {
        if (!t || !Array.isArray(t) || 0 === t.length) throw show.error("记录列表为空!"), new Error("记录列表为空!");
        const a = await this.forage.getItem(this.car_list_key) || [];
        for (const e of t) try {
            this._handleSingleCar(e, a);
        } catch (i) {
            throw i;
        }
        await r(this, e, n).call(this, this.car_list_key, a);
    }
    async removeNewVideoList(t) {
        const a = await this.getFavoriteActressList();
        let i = !1;
        const s = a.map((e => {
            if (!e.newVideoList || !Array.isArray(e.newVideoList)) return e;
            const n = e.newVideoList.filter((n => {
                const a = t.includes(n);
                return a && (clog.log("移除关联女优新作品", e.name, n), i = !0), !a;
            }));
            return {
                ...e,
                newVideoList: n
            };
        }));
        i && await r(this, e, n).call(this, this.favorite_actresses_key, s);
    }
    async removeCar(t) {
        const a = await this.getCarList(), i = a.length, s = a.filter((e => e.carNum !== t));
        return s.length === i ? (show.error(`${t} 不存在`), !1) : (await r(this, e, n).call(this, this.car_list_key, s), 
        !0);
    }
    async batchRemoveCars(t) {
        if (!t || 0 === t.length) throw new Error("未传入参数");
        const a = await this.getCarList(), i = a.length, s = new Set(t), o = a.filter((t => !s.has(t.carNum))), l = i - o.length;
        return 0 === l || await r(this, e, n).call(this, this.car_list_key, o), l;
    }
    async getBlacklist() {
        return await this.forage.getItem(this.blacklist_key) || [];
    }
    async addBlacklistItem(t) {
        let {starId: a, name: i, allName: s, role: o, movieType: l, url: c} = t;
        if (!a) throw new Error("缺失starId");
        if (!i) throw new Error("缺失name");
        if (!o) throw new Error("缺失role");
        const d = await this.getBlacklist(), h = d.find((t => t.starId === a));
        if (h) h.url = c, h.role = o, h.movieType = l, clog.log("更新黑名单演员信息", h); else {
            const t = {
                starId: a,
                name: i,
                allName: s || [ i ],
                createTime: utils.getNowStr(),
                role: o,
                movieType: l,
                url: c
            };
            d.push(t), clog.log("增加黑名单演员信息", t);
        }
        await r(this, e, n).call(this, this.blacklist_key, d);
    }
    async updateBlacklistItem(t) {
        if (!t || !t.starId) throw new Error("参数不全");
        const a = await this.getBlacklist(), i = a.find((e => e.starId === t.starId));
        if (!i) throw new Error(`未找到黑名单演员信息:${t.name} ${t.starId}`);
        t.checkTime && (i.checkTime = t.checkTime), t.lastPublishTime && (i.lastPublishTime = t.lastPublishTime), 
        await r(this, e, n).call(this, this.blacklist_key, a);
    }
    async deleteBlacklistItem(t) {
        const a = await this.getBlacklist(), i = a.filter((e => e.starId !== t));
        a.length !== i.length && await r(this, e, n).call(this, this.blacklist_key, i);
    }
    async getBlacklistCarList() {
        return this.cacheBlacklistCarList && this.cacheBlacklistCarList.length > 0 ? utils.deepFreeze(this.cacheBlacklistCarList) : (this.cacheBlacklistCarList = await this.forage.getItem(this.blacklist_car_list_key) || [], 
        setTimeout((() => {
            utils.deepFreeze(this.cacheBlacklistCarList);
        }), 0), this.cacheBlacklistCarList);
    }
    async batchSaveBlacklistCarList(t) {
        const a = await this.getCarList();
        let i = await this.getBlacklistCarList(), s = !1, o = null, l = [];
        for (const e of t) {
            let t = i.find((t => t.carNum === e.carNum));
            if (t) {
                console.log("已在鉴定记录中", t);
                continue;
            }
            let n = a.find((t => t.carNum === e.carNum));
            n ? console.log("已在鉴定记录中", n) : (o || (o = utils.copyObj(i)), this._handleSingleCar(e, o), 
            clog.log(`屏蔽演员番号: <span style="color: #f40">${e.names} ${e.carNum}</span>`), s = !0, 
            l.push(e.carNum));
        }
        if (s) {
            if (!o) throw new Error("程序异常, 黑名单番号数据对象为空!");
            await r(this, e, n).call(this, this.blacklist_car_list_key, o), await this.removeNewVideoList(l);
        }
    }
    async removeBlacklistCarList(t) {
        const a = await this.getBlacklistCarList(), i = a.filter((e => e.starId !== t));
        i.length !== a.length && await r(this, e, n).call(this, this.blacklist_car_list_key, i);
    }
    async batchRemoveBlacklistCars(t) {
        if (!t || 0 === t.length) throw new Error("未传入参数");
        const a = await this.getBlacklistCarList(), i = a.length, s = new Set(t), o = a.filter((t => !s.has(t.carNum))), l = i - o.length;
        return 0 === l || await r(this, e, n).call(this, this.blacklist_car_list_key, o), 
        l;
    }
    async getFavoriteActressList() {
        return this.cacheFavoriteActressList || (this.cacheFavoriteActressList = await this.forage.getItem(this.favorite_actresses_key) || []), 
        utils.copyObj(this.cacheFavoriteActressList);
    }
    async addFavoriteActressList(t) {
        const a = await this.getFavoriteActressList();
        let i = 0;
        for (const e of t) {
            let {starId: t, name: n, allName: s, avatar: o, lastCheckTime: r, lastPublishTime: l, actressType: c} = e;
            if (!t) throw new Error("缺失starId");
            if (!n) throw new Error("缺失name");
            s || (s = [ n ]);
            const d = "(無碼)";
            if (!c) {
                c = n.includes(d) || s.some((t => t.includes(d))) ? A : M;
            }
            n = n.replace(d, ""), s = s.map((t => t.replace(d, "")));
            let h = a.find((e => e.starId === t));
            if (h) {
                h.avatar && h.avatar.includes("https") || o && (clog.log(o), h.avatar = o, clog.log(`<span style="color: #f40">补全女优头像: ${n}</span>`), 
                i++), !h.actressType && c && (h.actressType = c, clog.log(`<span style="color: #f40">补全女优类别: ${n} ${c}</span>`), 
                i++), h.name.includes(d) && (h.name = n, h.allName = s, clog.log(`<span style="color: #f40">更正女优名字: ${n} ${s}</span>`), 
                i++);
                continue;
            }
            const p = utils.getNowStr();
            a.push({
                starId: t,
                name: n,
                allName: s,
                avatar: o,
                lastCheckTime: r,
                lastPublishTime: l,
                createDate: p,
                updateDate: p,
                actressType: c
            }), clog.log(`<span style="color: #f40">同步JavDB已收藏的演员: ${n}</span>`), i++;
        }
        return i > 0 ? await r(this, e, n).call(this, this.favorite_actresses_key, a) : clog.log("信息已记录, 无需要进行同步收藏的演员"), 
        i;
    }
    async removeFavoriteActress(t) {
        const a = await this.getFavoriteActressList(), i = a.length, s = a.filter((e => e.starId !== t));
        return s.length === i ? (clog.error(`移除演员失败, ${t} 不存在`), !1) : (await r(this, e, n).call(this, this.favorite_actresses_key, s), 
        !0);
    }
    async updateFavoriteActress(t) {
        const a = await this.getFavoriteActressList(), {starId: i, name: s, allName: o, avatar: l, lastCheckTime: c, newVideoList: d, lastPublishTime: h, actressType: p, remark: g} = t;
        if (!i) throw new Error("缺失starId");
        let m = a.find((t => t.starId === i));
        if (!m) return clog.error("未找到演员信息", i, s), !1;
        s && (m.name = s), o && (m.allName = o), l && (m.avatar = l), null != p && (m.actressType = p), 
        c && (m.lastCheckTime = c), d && (m.newVideoList = d), h && (m.lastPublishTime = h), 
        g && (m.remark = g), m.updateDate = utils.getNowStr(), await r(this, e, n).call(this, this.favorite_actresses_key, a);
    }
    async getHighlightedTags() {
        return await this.forage.getItem(this.highlighted_tags_key) || [];
    }
    async setHighlightedTags(t) {
        return await r(this, e, n).call(this, this.highlighted_tags_key, t);
    }
    async saveTitleFilterKeyword(t) {
        if (await r(this, e, a).call(this, t, this.filter_keyword_title_key, "标题关键词"), Array.isArray(t)) return null;
        const i = await this.getFavoriteActressList();
        let s = !1;
        const o = i.map((e => {
            if (!e.newVideoList || !Array.isArray(e.newVideoList)) return e;
            const n = e.newVideoList.filter((n => {
                const a = n.startsWith(t);
                return a && (clog.log("移除关联女优新作品", e.name, n), s = !0), !a;
            }));
            return {
                ...e,
                newVideoList: n
            };
        }));
        s && await r(this, e, n).call(this, this.favorite_actresses_key, o);
    }
    async getTitleFilterKeyword() {
        return await this.forage.getItem(this.filter_keyword_title_key) || [];
    }
    async getReviewFilterKeywordList() {
        return await this.forage.getItem(this.filter_keyword_review_key) || [];
    }
    async saveReviewFilterKeyword(t) {
        return r(this, e, a).call(this, t, this.filter_keyword_review_key, "评论关键词");
    }
    async getSetting(t = null, e) {
        this.cacheSettingObj || (this.cacheSettingObj = await this.forage.getItem(this.setting_key) || {});
        let n = utils.copyObj(this.cacheSettingObj);
        if (null === t) return n;
        const a = n[t];
        return a ? "true" === a || "false" === a ? "true" === a.toLowerCase() : "string" != typeof a || "" === a.trim() || isNaN(Number(a)) ? a : Number(a) : e;
    }
    async saveSetting(t) {
        t ? await r(this, e, n).call(this, this.setting_key, t) : show.error("设置对象为空");
    }
    async saveSettingItem(t, e) {
        if (!t) return void show.error("key 不能为空");
        let n = await this.getSetting();
        n[t] = e, await this.saveSetting(n);
    }
    async importData(t) {
        await this.forage.clear();
        const a = [];
        for (const i in t) {
            const s = t[i], o = r(this, e, n).call(this, i, s);
            a.push(o);
        }
        await Promise.all(a);
    }
    async exportData() {
        const t = {};
        if (await this.forage.iterate(((e, n) => {
            t[n] = e;
        })), 0 === Object.keys(t).length) throw new Error("没有可导出的数据");
        return t;
    }
    async merge_table_name() {
        let t = "filter_actor_actress_info_list", a = await this.forage.getItem(t) || [];
        a && a.length > 0 && (console.log("更正", t), await r(this, e, n).call(this, this.blacklist_key, a)), 
        await this.forage.removeItem(t), t = "favorite_actresses_info_list", a = await this.forage.getItem(t) || [], 
        a && a.length > 0 && (console.log("更正", t), await r(this, e, n).call(this, this.favorite_actresses_key, a)), 
        await this.forage.removeItem(t), t = "car_list_filter_actor_actress", a = await this.forage.getItem(t) || [], 
        a && a.length > 0 && (console.log("更正", t), await r(this, e, n).call(this, this.blacklist_car_list_key, a)), 
        await this.forage.removeItem(t), t = "title_filter_keyword", a = await this.forage.getItem(t) || [], 
        a && a.length > 0 && (console.log("更正", t), await r(this, e, n).call(this, this.filter_keyword_title_key, a)), 
        await this.forage.removeItem(t), t = "review_filter_keyword", a = await this.forage.getItem(t) || [], 
        a && a.length > 0 && (console.log("更正", t), await r(this, e, n).call(this, this.filter_keyword_review_key, a)), 
        await this.forage.removeItem(t), t = "highlightedTags", a = await this.forage.getItem(t) || [], 
        a && a.length > 0 && (console.log("更正", t), await r(this, e, n).call(this, this.highlighted_tags_key, a)), 
        await this.forage.removeItem(t);
    }
    async clean_no_url_blacklist() {
        const [t, a] = await Promise.all([ this.getBlacklistCarList(), this.getBlacklist() ]);
        if (t.length && !t[0].actress) return;
        const i = new Set(a.map((t => t.name))), s = t.filter((t => !t.actress || i.has(t.actress)));
        t.length !== s.length && (clog.debug("清理 blacklistCarList 前", t.length), clog.debug("清理 blacklistCarList 后", s.length), 
        await r(this, e, n).call(this, this.blacklist_car_list_key, s), this.cacheBlacklistCarList = null);
        const o = new Set(s.map((t => t.actress)));
        let l = a.filter((t => o.has(t.name)));
        l = l.map((t => {
            const {key: e, recordTime: n, ...a} = t, i = a;
            return void 0 !== n && (i.createTime = n), i;
        })), (a.length !== l.length || a.some((t => "key" in t || "recordTime" in t))) && (clog.debug("清理 Blacklist 前", a.length), 
        clog.debug("清理 Blacklist 后", l.length), await r(this, e, n).call(this, this.blacklist_key, l));
    }
    async async_merge_other() {
        const t = await this.getSetting();
        let e = !1;
        const n = {
            enableCheckFilterActorActress: "enableCheckBlacklist",
            checkIntervalTime_filterActorActress: "checkBlacklist_intervalTime",
            checkIntervalTime_ruleTime: "checkNewVideo_ruleTime",
            checkIntervalTime_newVideo: "checkNewVideo_intervalTime",
            checkIntervalTime_favoriteActress: "checkFavoriteActress_IntervalTime"
        };
        for (const a in n) {
            const i = n[a];
            Object.prototype.hasOwnProperty.call(t, a) && (t[i] = t[a], delete t[a], e = !0);
        }
        t.checkFilterTime && (delete t.checkFilterTime, e = !0), t.checkFilterConcurrencyCount && (delete t.checkFilterConcurrencyCount, 
        e = !0), t.checkFilterSleep && (delete t.checkFilterSleep, e = !0), t.downPath115 && (delete t.downPath115, 
        e = !0), e && (await this.saveSetting(t), clog.debug("配置数据已更正"));
    }
    async merge_blacklist() {
        const t = await this.getBlacklist();
        if (!t || 0 === t.length) return;
        let a = !1;
        const i = t.map((t => {
            let e = !1;
            if (Object.prototype.hasOwnProperty.call(t, "isActor") && !t.role && (t.role = t.isActor ? D : L, 
            delete t.isActor, e = !0), !t.starId && t.url) try {
                const n = new URL(t.url).pathname, a = n.split("/").filter((t => "" !== t.trim())).pop();
                t.starId !== a && (t.starId = a, e = !0);
            } catch (n) {
                clog.error("提取url-starId发生错误", t.url, n);
            }
            if (t.allName || (t.allName = t.name ? [ t.name ] : [], e = !0), t.movieType || (t.movieType = M, 
            e = !0), !t.url && t.url.includes("sort_type")) {
                const e = new URL(t.url);
                e.searchParams.delete("sort_type"), t.url = e.toString(), clog.debug("去除黑名单地址sort_type参数");
            }
            return e && (a = !0), t;
        }));
        a && (clog.debug("更正 Blacklist 数据结构"), await r(this, e, n).call(this, this.blacklist_key, i));
        const s = await this.getBlacklistCarList();
        a = !1;
        const o = s.map((e => {
            if (!e.starId) {
                let n = t.find((t => t.name === e.actress));
                n && (e.starId = n.starId), a = !0;
            }
            return e.type && (delete e.type, a = !0), e;
        }));
        a && (clog.debug("更正 blacklistCarList 数据结构"), await r(this, e, n).call(this, this.blacklist_car_list_key, o));
    }
    async merge_favoriteActress() {
        const t = await this.getFavoriteActressList();
        if (!t || 0 === t.length) return;
        let a = !1;
        const i = t.map((t => {
            let e = !1;
            return t.dbId && (t.starId = t.dbId, delete t.dbId, e = !0), e && (a = !0), t;
        }));
        a && (clog.debug("更正 favoriteActressesInfoList 数据结构"), await r(this, e, n).call(this, this.favorite_actresses_key, i));
    }
    async merge_tow_car_list_table() {
        const t = await this.getBlacklistCarList(), a = await this.getCarList();
        let i = !1;
        const s = t.map((t => {
            let e = !1;
            return void 0 !== t.actress && (t.names = t.actress, delete t.actress, e = !0), 
            e && (i = !0), t;
        }));
        i && (clog.debug("更正 blacklistCarList 数据结构 actress->names"), await r(this, e, n).call(this, this.blacklist_car_list_key, s)), 
        i = !1;
        const o = a.map((t => {
            let e = !1;
            return void 0 !== t.actress && (t.names = t.actress, delete t.actress, e = !0), 
            e && (i = !0), t;
        }));
        i && (clog.debug("更正 carList 数据结构 actress->names"), await r(this, e, n).call(this, this.car_list_key, o));
    }
    async merge_blacklist_movieType() {
        const t = await this.getBlacklist();
        let a = !1;
        const i = t.map((t => {
            let e = !1;
            return t.movieType !== M && t.movieType !== A && "虚拟演员" !== t.movieType && (t.movieType = "虚拟演员", 
            e = !0), e && (a = !0), t;
        }));
        a && (clog.debug("更正 blacklist-movieType"), await r(this, e, n).call(this, this.blacklist_key, i));
    }
};

const K = "https://jdforrepam.com/api";

function V() {
    const t = "jhs_review_ts", e = "jhs_review_sign", n = Math.floor(Date.now() / 1e3);
    if (n - (localStorage.getItem(t) || 0) <= 20) return localStorage.getItem(e);
    const a = `${n}.lpw6vgqzsp.${md5(`${n}71cf27bb3c0bcdf207b64abecddc970098c7421ee7203b9cdae54478478a199e7d5a6e1a57691123c1a931c057842fb73ba3b3c83bcd69c17ccf174081e3d8aa`)}`;
    return localStorage.setItem(t, n), localStorage.setItem(e, a), a;
}

const R = {
    getReviews: async (t, e = 1, n = 20) => {
        let a = `${K}/v1/movies/${t}/reviews`, i = {
            jdSignature: await V()
        };
        return (await gmHttp.get(a, {
            page: e,
            sort_by: "hotly",
            limit: n
        }, i)).data.reviews;
    },
    searchMovie: async t => {
        let e = `${K}/v2/search`, n = {
            "user-agent": "Dart/3.5 (dart:io)",
            "accept-language": "zh-TW",
            host: "jdforrepam.com",
            jdsignature: await V()
        }, a = {
            q: t,
            page: 1,
            type: "movie",
            limit: 1,
            movie_type: "all",
            from_recent: "false",
            movie_filter_by: "all",
            movie_sort_by: "relevance"
        };
        return (await gmHttp.get(e, a, n)).data.movies;
    },
    getMovieDetail: async t => {
        let e = `${K}/v4/movies/${t}`, n = {
            jdSignature: await V()
        };
        const a = await gmHttp.get(e, null, n);
        if (!a.data) throw show.error("获取视频详情失败: " + a.message), new Error(a.message);
        const i = a.data.movie, s = i.preview_images, o = [];
        return s.forEach((t => {
            o.push(t.large_url.replace("https://tp-iu.cmastd.com/rhe951l4q", "https://c0.jdbstatic.com"));
        })), {
            movieId: i.id,
            actors: i.actors,
            duration: i.duration,
            title: i.origin_title,
            carNum: i.number,
            score: i.score,
            releaseDate: i.release_date,
            watchedCount: i.watched_count,
            imgList: o
        };
    },
    related: async (t, e = 1, n = 20) => {
        let a = `${K}/v1/lists/related?movie_id=${t}&page=${e}&limit=${n}`, i = {
            jdSignature: await V()
        };
        const s = await gmHttp.get(a, null, i), o = [];
        return s.data.lists.forEach((t => {
            o.push({
                relatedId: t.id,
                name: t.name,
                movieCount: t.movies_count,
                collectionCount: t.collections_count,
                viewCount: t.views_count,
                createTime: utils.formatDate(t.created_at)
            });
        })), o;
    },
    getMagnets: async t => {
        let e = `${K}/v1/movies/${t}/magnets`, n = {
            jdSignature: await V()
        };
        return (await gmHttp.get(e, null, n)).data.magnets;
    },
    playback: async (t = "daily", e = "high_score") => {
        let n = `${K}/v1/rankings/playback?period=${t}&filter_by=${e}`, a = {
            jdSignature: await V()
        };
        return (await gmHttp.get(n, null, a)).data.movies;
    },
    login: async (t, e) => {
        let n = `${K}/v1/sessions?username=${encodeURIComponent(t)}&password=${encodeURIComponent(e)}&device_uuid=04b9534d-5118-53de-9f87-2ddded77111e&device_name=iPhone&device_model=iPhone&platform=ios&system_version=17.4&app_version=official&app_version_number=1.9.29&app_channel=official`, a = {
            "user-agent": "Dart/3.5 (dart:io)",
            "accept-language": "zh-TW",
            "content-type": "multipart/form-data; boundary=--dio-boundary-2210433284",
            jdsignature: await V()
        };
        return await gmHttp.post(n, null, a);
    },
    top250: async (t = "all", e = "", n = 1, a = 40) => {
        let i = `${K}/v1/movies/top?start_rank=1&type=${t}&type_value=${e}&ignore_watched=false&page=${n}&limit=${a}`, s = {
            "user-agent": "Dart/3.5 (dart:io)",
            "accept-language": "zh-TW",
            host: "jdforrepam.com",
            authorization: "Bearer " + localStorage.getItem("jhs_appAuthorization"),
            jdsignature: await V()
        };
        return await gmHttp.get(i, null, s);
    },
    buildSignature: V,
    markDataListHtml: t => {
        let e = "";
        return t.forEach((t => {
            e += `\n            <div class="item" id="${t.id}">\n                <a href="/v/${t.id}" class="box" title="${t.origin_title}">\n                    <div class="cover ">\n                        <img loading="lazy" src="${t.cover_url.replace("https://tp-iu.cmastd.com/rhe951l4q", "https://c0.jdbstatic.com")}" alt="">\n                    </div>\n                    <div class="video-title"><strong>${t.number}</strong> ${t.origin_title}</div>\n                    <div class="score" id="score_${t.id}">\n                    </div>\n                    <div class="meta">\n                        ${t.release_date}\n                    </div>\n                    <div class="tags has-addons">\n                       ${t.has_cnsub ? '<span class="tag is-warning">含中字磁鏈</span>' : t.magnets_count > 0 ? '<span class="tag is-success">含磁鏈</span>' : '<span class="tag is-info">无磁鏈</span>'}\n                       ${t.new_magnets ? '<span class="tag is-info">今日新種</span>' : ""}\n                    </div>\n                </a>\n            </div>\n        `;
        })), e;
    }
};

class W {
    constructor() {
        return o(this, "intervalContainer", {}), o(this, "mimeTypes", {
            txt: "text/plain",
            html: "text/html",
            css: "text/css",
            csv: "text/csv",
            json: "application/json",
            xml: "application/xml",
            jpg: "image/jpeg",
            jpeg: "image/jpeg",
            png: "image/png",
            gif: "image/gif",
            webp: "image/webp",
            svg: "image/svg+xml",
            pdf: "application/pdf",
            doc: "application/msword",
            docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            xls: "application/vnd.ms-excel",
            xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            ppt: "application/vnd.ms-powerpoint",
            pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            zip: "application/zip",
            rar: "application/x-rar-compressed",
            "7z": "application/x-7z-compressed",
            mp3: "audio/mpeg",
            wav: "audio/wav",
            mp4: "video/mp4",
            webm: "video/webm",
            ogg: "audio/ogg"
        }), o(this, "timers", new Map), o(this, "insertStyle", (t => {
            t && (-1 === t.indexOf("<style>") && (t = "<style>" + t + "</style>"), $("head").append(t));
        })), o(this, "layerIndexStack", []), W.instance || (W.instance = this), W.instance;
    }
    importResource(t) {
        let e;
        t.indexOf("css") >= 0 ? (e = document.createElement("link"), e.setAttribute("rel", "stylesheet"), 
        e.href = t) : (e = document.createElement("script"), e.setAttribute("type", "text/javascript"), 
        e.src = t), document.documentElement.appendChild(e);
    }
    openPage(t, e, n, a) {
        if (!t) throw new Error("未传入url");
        if (n = n ?? !0, a && (a.ctrlKey || a.metaKey)) return void GM_openInTab(t.includes("http") ? t : window.location.origin + t, {
            insert: 0
        });
        let i = t;
        t.includes("/actors/") || t.includes("/star/") || (i = t.includes("?") ? `${t}&hideNav=1` : `${t}?hideNav=1`), 
        layer.open({
            type: 2,
            title: e,
            content: i,
            scrollbar: !1,
            shadeClose: n,
            area: this.getResponsiveArea([ "85%", "90%" ]),
            isOutAnim: !1,
            anim: -1,
            success: (t, e) => {
                this.setupEscClose(e);
            }
        });
    }
    _handleGlobalEscKey(t) {
        if ("Escape" !== t.key && 27 !== t.keyCode) return;
        if (0 === this.layerIndexStack.length) return;
        const e = this.layerIndexStack[this.layerIndexStack.length - 1], n = $(`#layui-layer${e}`);
        let a = !1;
        if (n.find(".viewer-container").length > 0) a = !0; else {
            const t = n.find(`#layui-layer-iframe${e}`)[0];
            if (t && t.contentDocument) try {
                $(t.contentDocument).find(".viewer-container").length > 0 && (a = !0);
            } catch (i) {
                clog.warn("无法检查跨域 iframe 内的 .viewer-container");
            }
        }
        a || (this.layerIndexStack.pop(), layer.close(e));
    }
    setupEscClose(t) {
        var e;
        this._boundHandler || (this._boundHandler = this._handleGlobalEscKey.bind(this), 
        $(document).off("keydown.globalLayerEsc"), $(document).on("keydown.globalLayerEsc", this._boundHandler)), 
        -1 === this.layerIndexStack.indexOf(t) && this.layerIndexStack.push(t);
        const n = $(`#layui-layer-iframe${t}`), a = `keydown.layerEsc${t}`;
        try {
            const t = null == (e = n[0]) ? void 0 : e.contentDocument;
            if (t) {
                if ("yes" === n.attr("data-esc-bound")) return;
                $(t).off(a), $(t).on(a, this._boundHandler), n.attr("data-esc-bound", "yes");
            }
        } catch (i) {
            clog.error("iframe监听失败 (跨域或未加载完毕):", i);
        }
    }
    closePage() {
        storageManager.getSetting("needClosePage", "yes").then((t => {
            if ("yes" !== t) return;
            parent.document.documentElement.style.overflow = "auto";
            [ ".layui-layer-shade", ".layui-layer-move", ".layui-layer" ].forEach((function(t) {
                const e = parent.document.querySelectorAll(t);
                if (e.length > 0) {
                    const t = e.length > 1 ? e[e.length - 1] : e[0];
                    t.parentNode.removeChild(t);
                }
            })), window.close();
        }));
    }
    loopDetector(t, e, n = 20, a = 1e4, i = !0) {
        const s = Math.random(), o = (new Date).getTime(), r = t => {
            clearInterval(this.intervalContainer[s]), t && e && e(), delete this.intervalContainer[s];
        };
        this.intervalContainer[s] = setInterval((() => {
            const e = (new Date).getTime() - o;
            t() ? r(!0) : e >= a && r(i);
        }), n);
    }
    rightClick(t, e, n) {
        let a;
        "string" == typeof t ? a = document.querySelector(t) : t instanceof HTMLElement && (a = t), 
        a || (console.warn("rightClick(), 容器无效或未提供，将使用 document.body 进行全局委托。"), a = document.body), 
        "string" == typeof e && "" !== e.trim() ? a.addEventListener("contextmenu", (t => {
            const a = t.target.closest(e);
            a && n(t, a);
        })) : console.error("rightClick(), 必须提供有效的 targetSelector。");
    }
    q(t, e, n, a) {
        let i, s;
        t ? (i = t.clientX - 130, s = t.clientY - 120) : (i = window.innerWidth / 2 - 120, 
        s = window.innerHeight / 2 - 120);
        let o = layer.confirm(e, {
            offset: [ s, i ],
            title: "提示",
            btn: [ "确定", "取消" ],
            shade: 0,
            zIndex: 999999991
        }, (function() {
            n && n(), layer.close(o);
        }), (function() {
            a && a();
        }));
    }
    alert(t, e, n) {
        let a;
        t && (a = [ t.clientX - 200, t.clientY - 120 ]);
        let i = layer.alert(e, {
            offset: a,
            shade: 0,
            zIndex: 999999991
        }, (function() {
            n && n(), layer.close(i);
        }));
    }
    getNowStr(t = "-", e = ":", n = null) {
        let a;
        a = n ? new Date(n) : new Date;
        const i = a.getFullYear(), s = String(a.getMonth() + 1).padStart(2, "0"), o = String(a.getDate()).padStart(2, "0"), r = String(a.getHours()).padStart(2, "0"), l = String(a.getMinutes()).padStart(2, "0"), c = String(a.getSeconds()).padStart(2, "0");
        return `${[ i, s, o ].join(t)} ${[ r, l, c ].join(e)}`;
    }
    formatDate(t, e = "-", n = ":") {
        let a;
        if (t instanceof Date) a = t; else {
            if ("string" != typeof t) throw new Error("Invalid date input: must be Date object or date string");
            if (a = new Date(t), isNaN(a.getTime())) throw new Error("Invalid date string");
        }
        const i = a.getFullYear(), s = String(a.getMonth() + 1).padStart(2, "0"), o = String(a.getDate()).padStart(2, "0"), r = String(a.getHours()).padStart(2, "0"), l = String(a.getMinutes()).padStart(2, "0"), c = String(a.getSeconds()).padStart(2, "0");
        return `${[ i, s, o ].join(e)} ${[ r, l, c ].join(n)}`;
    }
    getHourDifference(t, e) {
        const n = t.getTime(), a = e.getTime(), i = Math.abs(a - n) / 36e5;
        return Math.floor(i);
    }
    download(t, e) {
        show.info("开始请求下载...");
        const n = e.split(".").pop().toLowerCase();
        let a, i = this.mimeTypes[n] || "application/octet-stream";
        if (t instanceof Blob) a = t; else if (t instanceof ArrayBuffer || ArrayBuffer.isView(t)) a = new Blob([ t ], {
            type: i
        }); else if ("string" == typeof t && t.startsWith("data:")) {
            const e = atob(t.split(",")[1]), n = new ArrayBuffer(e.length), s = new Uint8Array(n);
            for (let t = 0; t < e.length; t++) s[t] = e.charCodeAt(t);
            a = new Blob([ s ], {
                type: i
            });
        } else a = new Blob([ t ], {
            type: i
        });
        const s = URL.createObjectURL(a), o = document.createElement("a");
        o.href = s, o.download = e, document.body.appendChild(o), o.click(), setTimeout((() => {
            document.body.removeChild(o), URL.revokeObjectURL(s);
        }), 100);
    }
    smoothScrollToTop(t = 500) {
        return new Promise((e => {
            const n = performance.now(), a = window.pageYOffset;
            window.requestAnimationFrame((function i(s) {
                const o = s - n, r = Math.min(o / t, 1), l = r < .5 ? 4 * r * r * r : 1 - Math.pow(-2 * r + 2, 3) / 2;
                window.scrollTo(0, a * (1 - l)), r < 1 ? window.requestAnimationFrame(i) : e();
            }));
        }));
    }
    simpleId() {
        return crypto.randomUUID().replace("-", "");
    }
    isUrl(t) {
        try {
            return new URL(t), !0;
        } catch (e) {
            return !1;
        }
    }
    setHrefParam(t, e) {
        const n = new URL(window.location.href);
        n.searchParams.set(t, e), window.history.pushState({}, "", n.toString());
    }
    getUrlParam(t, e) {
        const n = t.split("?")[1];
        if (!n) return null;
        const a = new RegExp(`(?:^|&)${e}=([^&]*)`), i = n.match(a);
        let s = "";
        return i && i[1] && (s = decodeURIComponent(i[1].replace(/\+/g, " "))), s ? "true" === s || "false" === s ? "true" === s.toLowerCase() : "string" != typeof s || "" === s.trim() || isNaN(Number(s)) ? s : Number(s) : s;
    }
    reBuildSignature() {
        return R.buildSignature();
    }
    getResponsiveArea(t) {
        const e = window.innerWidth;
        return e >= 1200 ? t || this.getDefaultArea() : e >= 768 ? [ "70%", "90%" ] : [ "95%", "95%" ];
    }
    getDefaultArea() {
        return [ "85%", "90%" ];
    }
    isMobile() {
        const t = navigator.userAgent.toLowerCase();
        return [ "iphone", "ipod", "ipad", "android", "blackberry", "windows phone", "nokia", "webos", "opera mini", "mobile", "mobi", "tablet" ].some((e => t.includes(e)));
    }
    copyToClipboard(t, e) {
        navigator.clipboard.writeText(e).then((() => show.info(`${t}已复制到剪切板, ${e}`))).catch((t => console.error("复制失败: ", t)));
    }
    htmlTo$dom(t) {
        const e = new DOMParser;
        return $(e.parseFromString(t, "text/html"));
    }
    addCookie(t, e = {}) {
        const {maxAge: n = 604800, path: a = "/", domain: i = "", secure: s = !1, sameSite: o = "Lax"} = e;
        t.split(";").forEach((t => {
            const e = t.trim();
            if (e) {
                const t = e.split("=");
                if (t.length >= 2 && t[0].trim()) {
                    let e = [ `${t[0].trim()}=${t.slice(1).join("=")}` ];
                    n > 0 && e.push(`max-age=${n}`), e.push(`path=${a}`), i && e.push(`domain=${i}`), 
                    s && e.push("Secure"), o && e.push(`SameSite=${o}`), console.log("document.cookie = '" + e.join("; ") + "'"), 
                    document.cookie = e.join("; ");
                }
            }
        }));
    }
    isHidden(t) {
        const e = t.jquery ? t[0] : t;
        return !e || (e.offsetWidth <= 0 && e.offsetHeight <= 0 || "none" === window.getComputedStyle(e).display);
    }
    time(t = "default", e = "s", n = 2) {
        if (this.timers.has(t)) {
            const e = this.timers.get(t), n = performance.now() - e.startTime;
            let a, i;
            return "s" === e.unit ? (a = (n / 1e3).toFixed(e.precision), i = "秒") : (a = n.toFixed(e.precision), 
            i = "毫秒"), this.timers.delete(t), `${t}: ${a}${i}`;
        }
        this.timers.set(t, {
            startTime: performance.now(),
            unit: e,
            precision: n
        });
    }
    sleep(t = 1e3) {
        return new Promise((e => setTimeout(e, t)));
    }
    genericSort(t, e, n = !0) {
        if (!Array.isArray(t) || 0 === t.length) return [];
        if (!Array.isArray(e) || 0 === e.length) return [ ...t ];
        const a = [ ...t ], i = t => {
            if (t instanceof Date) return t;
            if ("string" == typeof t) {
                const e = new Date(t);
                if (!isNaN(e.getTime())) return e;
            }
            return t;
        };
        return a.sort(((t, a) => {
            for (const s of e) {
                const {key: e, order: o = "asc"} = s;
                let r = t, l = a;
                null != e && ("function" == typeof e ? (r = e(t), l = e(a)) : (r = t && "object" == typeof t ? t[e] : void 0, 
                l = a && "object" == typeof a ? a[e] : void 0));
                const c = i(r), d = i(l);
                let h = 0;
                const p = null == r, g = null == l;
                if (p && g) return 0;
                if (p) return n ? 1 : -1;
                if (g) return n ? 1 : -1;
                if (h = c instanceof Date && d instanceof Date ? c.getTime() - d.getTime() : "number" == typeof r && "number" == typeof l ? r - l : "string" == typeof r && "string" == typeof l ? r.localeCompare(l) : String(r).localeCompare(String(l)), 
                "desc" === o && (h *= -1), 0 !== h) return h;
            }
            return 0;
        }));
    }
    async retry(t, e = 3) {
        let n = 0;
        for (;n < e; ) try {
            const e = await t();
            return n > 0 && clog.debug(`[重试] 成功，共发起 ${n + 1} 次。`), e;
        } catch (a) {
            let t = String(a);
            if (t.startsWith("Error: ") && (t = t.replace("Error: ", "")), t.includes("Just a moment") || t.includes("重定向") || t.toLowerCase().includes("404 page not found") || t.toLowerCase().includes("404 not found")) throw a;
            if (n++, n === e) throw clog.debug(`[重试] 达到最大重试次数 (${e})，最终失败：`, a), a;
            clog.debug(`[重试] 准备第 ${n + 1} 次重试, 错误信息: ${t}`);
        }
    }
    copyObj(t) {
        return JSON.parse(JSON.stringify(t));
    }
    deepFreeze(t) {
        if (null === t || "object" != typeof t || Object.isFrozen(t)) return t;
        const e = Object.getOwnPropertyNames(t);
        for (const n of e) {
            const e = t[n];
            e && "object" == typeof e && this.deepFreeze(e);
        }
        return Object.freeze(t);
    }
}

unsafeWindow.utils = window.utils = new W, unsafeWindow.gmHttp = window.gmHttp = new class {
    async get(t, e = {}, n = {}, a) {
        return this.gmRequest("GET", t, null, e, n, a);
    }
    post(t, e = {}, n = {}) {
        n = {
            "Content-Type": "application/json",
            ...n
        };
        let a = JSON.stringify(e);
        return this.gmRequest("POST", t, a, null, n);
    }
    postForm(t, e = {}, n = {}) {
        n || (n = {}), n["Content-Type"] || (n["Content-Type"] = "application/x-www-form-urlencoded");
        let a = "";
        return e && Object.keys(e).length > 0 && (a = Object.entries(e).map((([t, e]) => `${t}=${e}`)).join("&")), 
        this.gmRequest("POST", t, a, null, n);
    }
    postFileFormData(t, e = {}, n = {}) {
        n || (n = {});
        const a = `----WebKitFormBoundary${Math.random().toString(36).substring(2)}`;
        n["Content-Type"] = `multipart/form-data; boundary=${a}`;
        let i = "";
        return e && Object.keys(e).length > 0 && (i = Object.entries(e).map((([t, e]) => `--${a}\r\nContent-Disposition: form-data; name="${t}"\r\n\r\n${e}\r\n`)).join("")), 
        i += `--${a}--`, this.gmRequest("POST", t, i, null, n);
    }
    async downloadFileInChunks(t, e = {}) {
        const n = await storageManager.getSetting("httpTimeout", 5e3), a = await storageManager.getSetting("httpRetryCount", 3);
        let i, s;
        clog.log("正在获取文件大小...");
        try {
            const o = await utils.retry((() => new Promise(((a, i) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: t,
                    headers: {
                        ...e,
                        Range: "bytes=0-0"
                    },
                    timeout: n,
                    onload: a,
                    onerror: t => i(new Error("网络错误：无法获取文件大小")),
                    ontimeout: () => i(new Error("超时：获取文件大小"))
                });
            }))), a);
            if (206 !== o.status && 200 !== o.status) throw new Error(`请求文件大小失败，状态码: ${o.status}`);
            {
                const t = o.responseHeaders.match(/content-range:\s*bytes\s*\d+-\d+\/(\d+)/i), e = o.responseHeaders.match(/content-type:\s*([^\s;]+)/i);
                if (t && t[1]) i = parseInt(t[1], 10); else {
                    if (!o.responseHeaders.match(/content-length:\s*(\d+)/i) || 200 !== o.status) throw new Error("无法从响应头中获取文件总大小，服务器可能不支持 Range 请求。");
                    {
                        const t = o.responseHeaders.match(/content-length:\s*(\d+)/i);
                        i = parseInt(t[1], 10), clog.warn("服务器返回 200 状态码，可能不支持 Range 请求。将尝试完整下载。");
                    }
                }
                e && e[1] && (s = e[1]), clog.log(`文件总大小：${(i / 1024 / 1024).toFixed(2)} MB, MIME 类型: ${s || "未知"}`);
            }
        } catch (h) {
            throw clog.error("获取文件大小失败:", h.message), h;
        }
        if (!i || i <= 0) throw new Error("获取到的文件大小无效或服务器拒绝提供大小信息。");
        const o = 1048576, r = Math.ceil(i / o), l = [], c = new Array(r);
        clog.log(`文件将被分为 ${r} 块进行下载 (每块约 ${1..toFixed(2)} MB)`);
        for (let p = 0; p < r; p++) {
            const s = p * o, d = `bytes=${s}-${Math.min(s + o - 1, i - 1)}`, h = await utils.retry((() => new Promise(((a, i) => {
                const s = {
                    ...e,
                    Range: d,
                    Accept: "application/octet-stream"
                };
                GM_xmlhttpRequest({
                    method: "GET",
                    url: t,
                    headers: s,
                    timeout: n,
                    responseType: "arraybuffer",
                    onload: t => {
                        206 === t.status || 200 === t.status ? t.response instanceof ArrayBuffer ? (c[p] = t.response, 
                        clog.log(`成功下载第 ${p + 1}/${r} 块 (${d})`), a()) : i(new Error(`第 ${p + 1} 块响应不是 ArrayBuffer。`)) : i(new Error(`第 ${p + 1} 块请求失败，状态码: ${t.status}`));
                    },
                    onerror: t => i(new Error(`第 ${p + 1} 块网络错误: ${t.error}`)),
                    ontimeout: () => i(new Error(`第 ${p + 1} 块超时。`))
                });
            }))), a);
            l.push(h);
        }
        try {
            await Promise.all(l), clog.log("所有分块下载完成，开始合并...");
        } catch (h) {
            throw clog.error("分块下载过程中发生错误:", h.message), h;
        }
        const d = new Blob(c);
        return d.size !== i && clog.warn(`警告：合并后的 Blob 大小 (${d.size}) 与预期文件大小 (${i}) 不匹配！`), 
        await d.text();
    }
    async gmRequest(t, e, n = {}, a = {}, i = {}, s = !1) {
        if (a && Object.keys(a).length) {
            const t = new URLSearchParams(a).toString();
            e += (e.includes("?") ? "&" : "?") + t;
        }
        const o = await storageManager.getSetting("httpTimeout", 5e3), r = await storageManager.getSetting("httpRetryCount", 3);
        return n || (n = void 0), await utils.retry((() => new Promise(((a, r) => {
            GM_xmlhttpRequest({
                method: t,
                url: e,
                headers: i,
                timeout: o,
                data: n,
                onload: t => {
                    try {
                        if (s && t.finalUrl !== e && r("请求被重定向了,URL是:" + t.finalUrl), t.status >= 200 && t.status < 300) if (t.responseText) try {
                            a(JSON.parse(t.responseText));
                        } catch (n) {
                            a(t.responseText);
                        } else a(t.responseText || t); else if (clog.error("请求失败,状态码:", t.status, e), t.responseText) try {
                            const e = JSON.parse(t.responseText);
                            r(e);
                        } catch {
                            r(new Error(t.responseText || `请求发生错误 ${t.status}`));
                        } else r(new Error(`请求发生错误 ${t.status}`));
                    } catch (n) {
                        r(n);
                    }
                },
                onerror: t => {
                    clog.error("网络错误:", e), r(new Error(t.error || "网络错误"));
                },
                ontimeout: () => {
                    r(new Error("请求超时: " + e));
                }
            });
        }))), r);
    }
}, unsafeWindow.storageManager = window.storageManager = new O;

const q = new BroadcastChannel("jhs-channel");

window.refresh = function() {
    q.postMessage({
        type: "refresh"
    });
}, window.clean_cacheBlacklistCarList = function() {
    storageManager.cacheBlacklistCarList && (storageManager.cacheBlacklistCarList = null), 
    q.postMessage({
        type: "clean_cacheBlacklistCarList"
    });
}, window.clean_cacheSettingObj = function() {
    storageManager.cacheSettingObj && (storageManager.cacheSettingObj = null), q.postMessage({
        type: "clean_cacheSettingObj"
    });
}, window.clean_cacheFavoriteActressList = function() {
    storageManager.cacheFavoriteActressList && (storageManager.cacheFavoriteActressList = null), 
    q.postMessage({
        type: "clean_cacheFavoriteActressList"
    });
}, window.clean_cacheCarList = function() {
    storageManager.cacheCarList && (storageManager.cacheCarList = null), q.postMessage({
        type: "clean_cacheCarList"
    });
};

new BroadcastChannel("jhs-channel").addEventListener("message", (async t => {
    let e = t.data.type;
    if ("refresh" === e) {
        const t = window.pluginManager.getBean("ListPagePlugin");
        await t.doFilter();
        const e = window.pluginManager.getBean("HistoryPlugin");
        e.tableObj && e.tableObj.setData();
        const n = window.pluginManager.getBean("NewVideoPlugin");
        n && (n.showNewVideoCount().then(), n.loadData());
    } else "clean_cacheBlacklistCarList" === e ? storageManager.cacheBlacklistCarList && (storageManager.cacheBlacklistCarList = null) : "clean_cacheSettingObj" === e ? storageManager.cacheSettingObj && (storageManager.cacheSettingObj = null) : "clean_cacheFavoriteActressList" === e ? storageManager.cacheFavoriteActressList && (storageManager.cacheFavoriteActressList = null) : "clean_cacheCarList" === e && storageManager.cacheCarList && (storageManager.cacheCarList = null);
})), document.head.insertAdjacentHTML("beforeend", '\n        <style>\n            .loading-container {\n                position: fixed;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                display: flex;\n                flex-direction: column; /* 垂直排列 */\n                justify-content: center;\n                align-items: center;\n                background-color: rgba(0, 0, 0, 0.1);\n                z-index: 99999999;\n            }\n    \n            .loading-animation {\n                position: relative;\n                width: 60px;\n                height: 12px;\n                background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);\n                border-radius: 6px;\n                animation: loading-animate 1.8s ease-in-out infinite;\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n                margin-bottom: 30px; /* 和按钮之间留出间距 */\n            }\n    \n            .loading-animation:before,\n            .loading-animation:after {\n                position: absolute;\n                display: block;\n                content: "";\n                animation: loading-animate 1.8s ease-in-out infinite;\n                height: 12px;\n                border-radius: 6px;\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n            }\n    \n            .loading-animation:before {\n                top: -20px;\n                left: 10px;\n                width: 40px;\n                background: linear-gradient(90deg, #ff758c 0%, #ff7eb3 100%);\n            }\n    \n            .loading-animation:after {\n                bottom: -20px;\n                width: 35px;\n                background: linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%);\n            }\n            \n            /* 新增按钮样式 */\n            .loading-close-btn {\n                padding: 8px 15px;\n                border: none;\n                border-radius: 4px;\n                background-color: #f44336; /* 红色背景 */\n                color: white;\n                cursor: pointer;\n                font-size: 14px;\n                opacity: 0; /* 默认隐藏 */\n                transition: opacity 0.3s ease; /* 渐变效果 */\n            }\n\n            .loading-close-btn.visible {\n                opacity: 1; /* 3秒后显示 */\n            }\n    \n            @keyframes loading-animate {\n                0% {\n                    transform: translateX(40px);\n                }\n                50% {\n                    transform: translateX(-30px);\n                }\n                100% {\n                    transform: translateX(40px);\n                }\n            }\n        </style>\n    '), 
unsafeWindow.loading = window.loading = function() {
    const t = document.createElement("div");
    t.className = "loading-container";
    const e = document.createElement("div");
    e.className = "loading-animation";
    const n = document.createElement("button");
    n.className = "loading-close-btn", n.textContent = "关闭", n.addEventListener("click", (() => {
        a();
    })), setTimeout((() => {
        n.classList.add("visible");
    }), 3e3), t.appendChild(e), t.appendChild(n), document.body.appendChild(t);
    const a = () => {
        t && t.parentNode && t.parentNode.removeChild(t);
    };
    return {
        close: a
    };
}, function() {
    const t = (t, e, n, a, i) => {
        let s;
        "object" == typeof n ? s = n : (s = "object" == typeof a ? a : i || {}, s.gravity = n || "top", 
        s.position = "string" == typeof a ? a : "center"), s.gravity && "center" !== s.gravity || (s.offset = {
            y: "calc(50vh - 150px)"
        });
        const o = "#60A5FA", r = "#93C5FD", l = "#10B981", c = "#6EE7B7", d = "#EF4444", h = "#FCA5A5", p = {
            borderRadius: "12px",
            color: "white",
            padding: "12px 16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            minWidth: "150px",
            textAlign: "center",
            zIndex: 999999999
        }, g = {
            text: t,
            duration: 1e3,
            close: !1,
            gravity: "top",
            position: "center",
            style: {
                info: {
                    ...p,
                    background: `linear-gradient(to right, ${o}, ${r})`
                },
                success: {
                    ...p,
                    background: `linear-gradient(to right, ${l}, ${c})`
                },
                error: {
                    ...p,
                    background: `linear-gradient(to right, ${d}, ${h})`
                }
            }[e],
            stopOnFocus: !0,
            oldestFirst: !1,
            ...s
        };
        -1 === g.duration && (g.close = !0);
        const m = Toastify(g);
        return m.showToast(), m.closeShow = () => {
            m.toastElement.remove();
        }, m;
    };
    unsafeWindow.show = window.show = {
        ok: (e, n = "center", a, i) => t(e, "success", n, a, i),
        error: (e, n = "center", a, i) => t(e, "error", n, a, i),
        info: (e, n = "center", a, i) => t(e, "info", n, a, i)
    };
}(), function() {
    function t(t = 10) {
        setTimeout((() => {
            const t = document.querySelectorAll(".layui-layer-shade").length;
            document.documentElement.style.overflow = t > 0 ? "hidden" : "";
        }), t);
    }
    document.head.insertAdjacentHTML("beforeend", "\n        <style>\n            .viewer-canvas {\n                overflow: auto !important;\n            }\n            \n            .viewer-close {\n                background: rgba(255,0,0,0.6) !important;\n            }\n            .viewer-close:hover {\n                background: rgba(255,0,0,0.8) !important;\n            }\n        </style>\n    "), 
    window.showImageViewer = function(e, n = "") {
        let a = null, i = !1;
        "string" == typeof e || e instanceof String ? (a = $('<div class="temporary-container" style="display:none;">').append(`<img src="${e}" alt="${n}">`).appendTo("body"), 
        i = !0) : a = $(e);
        const s = {
            zIndex: 999999990,
            navbar: !1,
            zoomOnWheel: !1,
            zoomRatio: .1,
            toggleOnDblclick: !1,
            toolbar: {
                zoomIn: 1,
                zoomOut: 1,
                reset: 1,
                rotateLeft: 0,
                rotateRight: 0,
                flipHorizontal: 0,
                flipVertical: 0
            },
            title: !1,
            keyboard: !1,
            viewed() {
                o.zoomTo(1.4);
                let t = (o.viewerData.width - o.imageData.width) / 2;
                o.moveTo(t, 0);
            },
            shown() {
                i && a.remove(), document.documentElement.style.overflow = "hidden", document.body.style.overflow = "hidden", 
                o.handleKeydown = function(e) {
                    "Escape" !== e.key && " " !== e.key || (e.preventDefault(), e.stopPropagation(), 
                    o.destroy(), document.removeEventListener("keydown", o.handleKeydown), document.documentElement.style.overflow = "", 
                    document.body.style.overflow = "", t());
                }, document.addEventListener("keydown", o.handleKeydown);
            },
            hidden() {
                o && o.handleKeydown && document.removeEventListener("keydown", o.handleKeydown), 
                o.destroy(), document.documentElement.style.overflow = "", document.body.style.overflow = "", 
                t();
            }
        }, o = new Viewer(a[0], s);
        o.show();
    };
}(), window.ImageHoverPreview = class {
    constructor(t = {}) {
        this.config = {
            selector: ".hover-preview",
            dataAttribute: "data-full",
            maxWidth: 1e3,
            maxHeight: 1e3,
            offsetX: 20,
            offsetY: 20,
            zIndex: 9999999999,
            transition: .2,
            autoAdjustPosition: !0,
            ...t
        }, this.preview = null, this.currentTarget = null, this.timer = null, this.imgElement = null, 
        this.boundElements = new WeakSet, this.init();
    }
    init() {
        this.injectStyles(), this.createPreviewElement(), this.bindEvents();
    }
    injectStyles() {
        const t = `\n                <style>\n                    .image-hover-preview {\n                        position: fixed;\n                        display: none;\n                        z-index: ${this.config.zIndex};\n                        border-radius: 4px;\n                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n                        overflow: hidden;\n                        pointer-events: none;\n                        opacity: 0;\n                        transition: opacity ${this.config.transition}s ease;\n                        background-color: #fff;\n                    }\n                    \n                    .image-hover-preview.active {\n                        opacity: 1;\n                    }\n                    \n                    .image-hover-preview img {\n                        max-width: ${this.config.maxWidth + "px"};\n                        max-height: ${this.config.maxHeight + "px"};\n                        display: block;\n                        object-fit: contain;\n                    }\n                    \n                    .image-hover-preview::after {\n                        content: '';\n                        position: absolute;\n                        top: 0;\n                        left: 0;\n                        right: 0;\n                        bottom: 0;\n                        background: rgba(0, 0, 0, 0.03);\n                        pointer-events: none;\n                    }\n                    \n                    .image-hover-preview.loading::before {\n                        content: '加载中...';\n                        position: absolute;\n                        top: 50%;\n                        left: 50%;\n                        transform: translate(-50%, -50%);\n                        color: #666;\n                        font-size: 14px;\n                    }\n                </style>\n            `;
        document.head.insertAdjacentHTML("beforeend", t);
    }
    createPreviewElement() {
        this.preview = document.createElement("div"), this.preview.className = "image-hover-preview", 
        document.body.appendChild(this.preview);
    }
    bindEvents() {
        document.querySelectorAll(this.config.selector).forEach((t => {
            this.boundElements.has(t) || (t.addEventListener("mouseenter", (t => this.handleMouseEnter(t))), 
            t.addEventListener("mouseleave", (t => this.handleMouseLeave(t))), t.addEventListener("mousemove", (t => this.handleMouseMove(t))), 
            this.boundElements.add(t));
        }));
    }
    handleMouseEnter(t) {
        clearTimeout(this.timer), this.currentTarget = t.currentTarget;
        const e = this.currentTarget.getAttribute(this.config.dataAttribute) || this.currentTarget.src;
        if (!e) return;
        this.preview.innerHTML = "", this.preview.classList.add("loading"), this.preview.style.display = "block", 
        this.preview.classList.remove("active");
        const n = new Image;
        n.onload = () => {
            this.preview.classList.remove("loading"), this.preview.innerHTML = `<img src="${e}" alt="预览图">`, 
            this.imgElement = this.preview.querySelector("img");
            const {width: a, height: i} = this.calculateImageSize(n);
            this.preview.style.width = `${a}px`, this.preview.style.height = `${i}px`, this.preview.offsetHeight, 
            this.preview.classList.add("active"), this.handleMouseMove(t);
        }, n.onerror = () => {
            this.preview.classList.remove("loading"), this.preview.innerHTML = '<div style="padding:10px;color:#f00;">图片加载失败</div>';
        }, n.src = e;
    }
    calculateImageSize(t) {
        let e = t.naturalWidth, n = t.naturalHeight;
        if (e > this.config.maxWidth || n > this.config.maxHeight) {
            const t = Math.min(this.config.maxWidth / e, this.config.maxHeight / n);
            e *= t, n *= t;
        }
        return {
            width: e,
            height: n
        };
    }
    handleMouseMove(t) {
        if (!this.currentTarget || !this.preview.classList.contains("active")) return;
        let {offsetX: e, offsetY: n} = this.config, a = t.clientX + e, i = t.clientY + n;
        if (this.config.autoAdjustPosition) {
            const s = this.preview.offsetWidth, o = this.preview.offsetHeight;
            a + s > window.innerWidth && (a = t.clientX - s - e), i + o > window.innerHeight && (i = t.clientY - o - n), 
            a = Math.max(0, a), i = Math.max(0, i);
        }
        this.preview.style.left = `${a}px`, this.preview.style.top = `${i}px`;
    }
    handleMouseLeave() {
        this.preview.classList.remove("active"), this.preview.style.display = "none", this.currentTarget = null, 
        this.imgElement = null;
    }
    destroy() {
        document.querySelectorAll(this.config.selector).forEach((t => {
            this.boundElements.has(t) && (t.removeEventListener("mouseenter", this.handleMouseEnter), 
            t.removeEventListener("mouseleave", this.handleMouseLeave), t.removeEventListener("mousemove", this.handleMouseMove), 
            this.boundElements.delete(t));
        })), this.preview && this.preview.parentNode && this.preview.parentNode.removeChild(this.preview);
    }
}, async function() {
    document.head.insertAdjacentHTML("beforeend", "\n        <style>\n            .console-logger-container {\n                position: fixed;\n                bottom: 0;\n                right: 0;\n                z-index: 99999999;\n                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n                display: flex;\n                flex-direction: column; \n                align-items: flex-end;\n                width: fit-content;\n            }\n\n            .console-logger-toggle {\n                width: 40px;\n                height: 30px;\n                background: #2c3e50;\n                border-radius: 120px 10px 0 0;\n                display: flex;\n                align-items: center;\n                justify-content: center;\n                cursor: pointer;\n                box-shadow: -2px 0 5px rgba(0, 0, 0, 0.1);\n                transition: all 0.3s ease;\n                color: white;\n                font-size: 16px;\n            }\n\n            .console-logger-toggle:hover {\n                background: #34495e;\n            }\n\n            .console-logger-toggle::after {\n                content: '▼';\n                transition: transform 0.3s ease;\n            }\n\n            .console-logger-toggle.collapsed::after {\n                content: '▲';\n            }\n\n            .console-logger-window {\n                width: 400px;\n                height: 400px;\n                background: white;\n                border-radius: 10px 0 10px 10px;\n                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);\n                display: flex;\n                flex-direction: column;\n                overflow: hidden;\n                transform: translateY(0);\n                opacity: 1;\n                /* 简化过渡属性 */\n                transition: width 0.3s ease, height 0.3s ease, opacity 0.3s ease, transform 0.3s ease;\n            }\n\n            .console-logger-window.maximized {\n                width: 600px !important;\n                height: 85vh !important;\n                border-radius: 10px 0 0 10px; /* 调整圆角以匹配右下角 */\n            }\n\n            .console-logger-window.collapsed {\n                height: 0 !important;\n                min-height: 0 !important; \n                opacity: 0;\n            }\n\n            .console-logger-header {\n                background: #2c3e50;\n                color: white;\n                padding: 12px 15px;\n                display: flex;\n                justify-content: space-between;\n                align-items: center;\n                flex-shrink: 0;\n            }\n\n            .console-logger-title {\n                font-weight: 600;\n                font-size: 16px;\n            }\n\n            .console-logger-controls {\n                display: flex;\n                gap: 10px;\n            }\n\n            .console-logger-controls button {\n                background: transparent;\n                border: 1px solid rgba(255, 255, 255, 0.3);\n                padding: 5px 10px;\n                font-size: 12px;\n                color: white;\n                border-radius: 4px;\n                cursor: pointer;\n                transition: background 0.3s;\n            }\n\n            .console-logger-controls button:hover {\n                background: rgba(255, 255, 255, 0.1);\n            }\n\n            /* 新增的按钮样式 */\n            .console-logger-maximize-toggle {\n                line-height: 1;\n                font-size: 14px !important; /* 使箭头看起来更大 */\n                padding: 5px 8px !important;\n            }\n            .console-logger-maximize-toggle::before {\n                content: '⇱'; /* Unicode symbol for maximized */\n            }\n            .console-logger-maximize-toggle.active::before {\n                content: '⇲'; /* Unicode symbol for minimized */\n            }\n\n\n            .console-logger-filters {\n                display: flex;\n                align-items: center;\n                gap: 5px;\n                padding: 10px;\n                background: #f8f9fa;\n                border-bottom: 1px solid #e9ecef;\n                flex-shrink: 0;\n                overflow-x: hidden; \n            }\n\n            /* 新增: 过滤器按钮组的容器，负责滚动 */\n            .console-logger-filter-group {\n                display: flex;\n                gap: 5px;\n                overflow-x: auto; /* 允许过滤器按钮滚动 */\n                flex-grow: 1; /* 占据剩余空间 */\n                padding-right: 10px; /* 避免滚动条影响按钮 */\n            }\n\n            .console-logger-filter {\n                padding: 5px 10px;\n                font-size: 12px;\n                border-radius: 15px;\n                background: #ecf0f1;\n                color: #7f8c8d;\n                border: 1px solid #ddd;\n                cursor: pointer;\n                transition: all 0.3s;\n                white-space: nowrap;\n                flex-shrink: 0; /* 确保不被压缩 */\n            }\n\n            .console-logger-filter.active {\n                background: #3498db;\n                color: white;\n                border-color: #3498db;\n            }\n\n            /* 新增: 滚动到底部按钮的样式 (位于 filtersContainer 内部右侧) */\n            .console-logger-scroll-to-bottom {\n                background: #3498db;\n                border: none;\n                padding: 5px 10px;\n                font-size: 12px;\n                color: white;\n                border-radius: 4px;\n                cursor: pointer;\n                transition: background 0.3s;\n                line-height: 1;\n                height: fit-content;\n                white-space: nowrap;\n                margin-left: auto; /* 将按钮推到最右侧 */\n                flex-shrink: 0; /* 确保不被压缩 */\n            }\n\n            .console-logger-scroll-to-bottom:hover {\n                background: #2980b9;\n            }\n\n\n            .console-logger-content {\n                flex: 1;\n                overflow-y: auto;\n                padding: 10px;\n                background: #ffffff;\n                word-wrap: break-word;\n                text-align: left;\n            }\n\n            .console-logger-entry {\n                padding: 8px 10px;\n                margin-bottom: 3px;\n                border-radius: 4px;\n                font-size: 12px;\n                line-height: 1.4;\n                /*animation: consoleFadeIn 0.3s ease;*/\n                border-left: 3px solid transparent;\n            }\n\n            @keyframes consoleFadeIn {\n                from { opacity: 0; transform: translateY(5px); }\n                to { opacity: 1; transform: translateY(0); }\n            }\n\n            .console-logger-timestamp {\n                color: #7f8c8d;\n                font-size: 11px;\n                margin-right: 2px;\n            }\n\n            @media (max-width: 768px) {\n                .console-logger-container {\n                    right: 10px;\n                    bottom: 10px;\n                }\n\n                .console-logger-window {\n                    width: calc(100vw - 20px);\n                    height: 300px;\n                }\n            }\n            \n            .console-logger-message[data-type=\"json\"] {\n                white-space: pre-wrap; \n            }\n        </style>\n    ");
    const t = {
        base: {
            label: "信息",
            background: "#e8f4fd",
            borderLeftColor: "#3498db"
        },
        warn: {
            label: "警告",
            background: "#fef9e7",
            borderLeftColor: "#f39c12"
        },
        error: {
            label: "错误",
            background: "#fdedec",
            borderLeftColor: "#e74c3c"
        },
        debug: {
            label: "调试",
            background: "#f4f6f6",
            borderLeftColor: "#95a5a6"
        }
    }, e = {
        base: [ "base", "warn", "error" ],
        warn: [ "warn" ],
        error: [ "error" ],
        debug: [ "base", "warn", "error", "debug" ]
    }, n = await storageManager.getSetting("clogMsgCount", 2e3), a = "jhs_clog_maximize", i = "jhs_clog_expand", s = "jhs_clog_filter";
    class o {
        constructor() {
            const e = localStorage.getItem(s);
            this.currentFilter = e && t[e] ? e : "base", this.logs = [], this.isInitialized = !1, 
            this.userScrolledUp = !1;
        }
        tryInitialize() {
            return "loading" !== document.readyState && (this.isInitialized || (this.init(), 
            this.isInitialized = !0), !0);
        }
        init() {
            this.createContainer(), this.bindEvents(), this.checkInitialMaximizeState(), this.checkInitialCollapseState();
        }
        createContainer() {
            this.container = document.createElement("div"), this.container.className = "console-logger-container", 
            this.container.style.display = "none", this.toggleBtn = document.createElement("div"), 
            this.toggleBtn.className = "console-logger-toggle collapsed", this.container.appendChild(this.toggleBtn), 
            this.window = document.createElement("div"), this.window.className = "console-logger-window collapsed";
            const e = document.createElement("div");
            e.className = "console-logger-header";
            const n = document.createElement("div");
            n.className = "console-logger-title", n.textContent = "JHS V3.3.6";
            const a = document.createElement("div");
            a.className = "console-logger-controls", this.maximizeBtn = document.createElement("button"), 
            this.maximizeBtn.textContent = "", this.maximizeBtn.classList.add("console-logger-maximize-toggle"), 
            a.appendChild(this.maximizeBtn);
            const i = document.createElement("button");
            i.textContent = "清空", i.addEventListener("click", (() => this.clear())), a.appendChild(i), 
            e.appendChild(n), e.appendChild(a), this.filtersContainer = document.createElement("div"), 
            this.filtersContainer.className = "console-logger-filters", this.filterButtonGroup = document.createElement("div"), 
            this.filterButtonGroup.className = "console-logger-filter-group", this.filtersContainer.appendChild(this.filterButtonGroup), 
            this.scrollToBottomBtn = document.createElement("button"), this.scrollToBottomBtn.className = "console-logger-scroll-to-bottom", 
            this.scrollToBottomBtn.textContent = "到底部", this.filtersContainer.appendChild(this.scrollToBottomBtn), 
            this.content = document.createElement("div"), this.content.className = "console-logger-content jhs-scrollbar", 
            this.window.appendChild(e), this.window.appendChild(this.filtersContainer), this.window.appendChild(this.content), 
            this.container.appendChild(this.window), document.body.appendChild(this.container), 
            Object.keys(t).forEach((e => {
                const n = document.createElement("div");
                n.className = "console-logger-filter", e === this.currentFilter && n.classList.add("active"), 
                n.textContent = t[e].label, n.dataset.type = e, n.addEventListener("click", (() => this.setFilter(e))), 
                this.filterButtonGroup.appendChild(n);
            }));
        }
        bindEvents() {
            this.toggleBtn.addEventListener("click", (() => {
                this.toggleExpandCollapsed();
            })), this.maximizeBtn.addEventListener("click", (() => this.toggleMaximize())), 
            this.scrollToBottomBtn.addEventListener("click", (() => {
                this.content.scrollTop = this.content.scrollHeight, this.userScrolledUp = !1;
            })), this.content.addEventListener("scroll", (() => {
                const t = this.content.scrollHeight - this.content.clientHeight <= this.content.scrollTop + 5;
                this.userScrolledUp = !t;
            })), this.content.addEventListener("wheel", (t => {
                const e = 0 === this.content.scrollTop, n = this.content.scrollHeight - this.content.clientHeight <= this.content.scrollTop + 1;
                (e && t.deltaY < 0 || n && t.deltaY > 0) && (t.preventDefault(), t.stopPropagation());
            }), {
                passive: !1
            });
        }
        toggleExpandCollapsed() {
            const t = this.window.classList.toggle("collapsed");
            this.toggleBtn.classList.toggle("collapsed"), t ? localStorage.setItem(i, "no") : (localStorage.setItem(i, "yes"), 
            this.reRenderAllLogs());
        }
        checkInitialCollapseState() {
            const t = localStorage.getItem(i);
            t && "no" !== t ? (this.window.classList.toggle("collapsed"), this.toggleBtn.classList.toggle("collapsed"), 
            setTimeout((() => {
                this.content.scrollTop = this.content.scrollHeight;
            }), 0)) : (this.window.classList.add("collapsed"), this.toggleBtn.classList.add("collapsed"));
        }
        checkInitialMaximizeState() {
            "maximized" === localStorage.getItem(a) && (this.window.classList.add("maximized"), 
            this.maximizeBtn.classList.add("active"));
        }
        toggleMaximize() {
            const t = this.window.classList.toggle("maximized");
            this.maximizeBtn.classList.toggle("active", t), t ? localStorage.setItem(a, "maximized") : localStorage.setItem(a, "minimized"), 
            this.window.classList.contains("collapsed") || (this.content.scrollTop = this.content.scrollHeight);
        }
        addLog(e, a = "base", ...i) {
            const s = this.tryInitialize();
            let o, r = [];
            t[a] ? (o = a, r = i) : (o = "base", r = [ a, ...i ]), o = t[o] ? o : "base";
            const l = [ e, ...r ];
            let c = "msg";
            const d = [];
            l.forEach((t => {
                if ("[object Error]" === Object.prototype.toString.call(t)) d.push(String(t)); else if ("object" == typeof t && null !== t) try {
                    d.push("<br/>" + JSON.stringify(t, null, 2)), c = "json";
                } catch (e) {
                    d.push(String(t)), c = "msg";
                } else d.push(String(t));
            }));
            let h = d.join("  ");
            h = h.replace(/(?:(?:https?|ftp):\/\/|www\.|(?:\/\/))[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|]/gi, (t => {
                const e = t.startsWith("http") || t.startsWith("ftp"), n = t.startsWith("//"), a = t.startsWith("www.");
                let i = t;
                return n ? i = `http:${t}` : !e && a && (i = `http://${t}`), `<a href="${i}" target="_blank">${t}</a>`;
            }));
            const p = {
                message: h,
                messageType: c,
                type: o,
                timestamp: new Date,
                id: Date.now() + Math.random()
            };
            if (this.logs.push(p), this.logs.length > n) {
                const t = this.logs[0];
                if (s) {
                    const e = this.content.querySelector(`.console-logger-entry[data-id="${t.id}"]`);
                    e && (this.logs.shift(), this.content.removeChild(e));
                }
            }
            s && this.renderLog(p);
        }
        log(...t) {
            const [e, ...n] = t;
            setTimeout((() => {
                this.addLog(e, "base", ...n);
            }), 0);
        }
        error(...t) {
            const [e, ...n] = t;
            console.error(...t), setTimeout((() => {
                this.addLog(e, "error", ...n);
            }), 0);
        }
        warn(...t) {
            const [e, ...n] = t;
            setTimeout((() => {
                this.addLog(e, "warn", ...n);
            }), 0);
        }
        debug(...t) {
            const [e, ...n] = t;
            setTimeout((() => {
                this.addLog(e, "debug", ...n);
            }), 0);
        }
        renderLog(t) {
            if ("none" === this.container.style.display) return;
            if (this.window.classList.contains("collapsed")) return;
            if (!(e[this.currentFilter] || []).includes(t.type)) return;
            const n = this._createLogElement(t);
            this.content.appendChild(n), this.window.classList.contains("collapsed") || this.userScrolledUp || (this.content.scrollTop = this.content.scrollHeight);
        }
        reRenderAllLogs() {
            "none" !== this.container.style.display && (this.window.classList.contains("collapsed") || setTimeout((() => {
                if (this.content.innerHTML = "", 0 === this.logs.length) return;
                const t = e[this.currentFilter] || [], n = document.createDocumentFragment();
                this.logs.forEach((e => {
                    if (t.includes(e.type)) {
                        const t = this._createLogElement(e);
                        n.appendChild(t);
                    }
                })), this.content.appendChild(n), this.content.scrollTop = this.content.scrollHeight;
            }), 0));
        }
        _createLogElement(e) {
            const n = document.createElement("div");
            n.className = "console-logger-entry", n.dataset.type = e.type, n.dataset.id = e.id;
            const a = t[e.type] || t.base;
            n.style.borderLeft = "3px solid " + a.borderLeftColor, n.style.background = a.background;
            const i = (e.timestamp instanceof Date ? e.timestamp : new Date(e.timestamp)).toTimeString().split(" ")[0];
            return n.innerHTML = `\n                <span class="console-logger-timestamp">[${i}]</span>\n                <span class="console-logger-message" data-type="${e.messageType}">${e.message}</span>\n            `, 
            n;
        }
        setFilter(t) {
            if (this.currentFilter === t) return;
            this.currentFilter = t, localStorage.setItem(s, t);
            this.filterButtonGroup.querySelectorAll(".console-logger-filter").forEach((e => {
                e.dataset.type === t ? e.classList.add("active") : e.classList.remove("active");
            })), this.reRenderAllLogs();
        }
        clear() {
            this.logs = [], this.content.innerHTML = "";
        }
        show() {
            (this.isInitialized && this.container || this.tryInitialize() && this.container) && (this.container.style.display = "", 
            this.reRenderAllLogs());
        }
        hide() {
            this.isInitialized && this.container && (this.container.style.display = "none");
        }
        lowZIndex() {
            this.isInitialized && this.container && (this.container.style.zIndex = "12345678");
        }
        highZIndex() {
            this.isInitialized && this.container && (this.container.style.zIndex = "999999999");
        }
    }
    if (d || c) {
        try {
            unsafeWindow.parent.clog && "function" == typeof unsafeWindow.parent.clog.log ? window.clog = unsafeWindow.clog = unsafeWindow.parent.clog : window.clog = unsafeWindow.clog = new o;
        } catch (r) {
            console.error("创建日志控制台出现异常", r), window.clog = unsafeWindow.clog = new o;
        }
        !function() {
            const t = window.clog || console;
            window.addEventListener("error", (function(e) {
                const n = e.filename, a = e.message;
                n.includes("javdb") || n.includes("javbus") || t.error(`[全局 Error 异常捕获] ${a} 来源: ${n}`);
            })), window.addEventListener("unhandledrejection", (function(e) {
                const n = e.reason, a = (null == n ? void 0 : n.message) ?? "";
                if (a.includes("play()")) return;
                if (a.includes("The element has no supported sources")) return show.error("播放失败, 请检查是否已对节点分流?"), 
                void t.error("播放失败, 请检查是否已对节点分流?");
                if (a.includes("<span>1005</span>") && a.includes("fc2ppvdb")) return;
                const i = `[全局 Promise 异常捕获] ${n.message || n}`;
                t.error(i, n), e.preventDefault();
            }));
        }(), document.addEventListener("mousedown", (t => {
            const e = window.clog;
            if (!e.isInitialized || !e.container) return;
            const n = t.target, a = [ ".console-logger-container", ".layui-layer-shade", ".loading-container" ].join(",");
            n.closest(a) ? e.highZIndex() : e.lowZIndex();
        }));
    }
}(), function() {
    function t(t, e, n) {
        const a = function(t) {
            const e = document.createElement("div");
            e.classList.add("js-tooltip");
            const n = document.createElement("div");
            return n.innerHTML = t, e.appendChild(n), document.body.appendChild(e), e;
        }(e);
        a.style.display = "block";
        const i = t.getBoundingClientRect(), s = a.getBoundingClientRect();
        a.style.display = "none";
        const o = window.innerWidth, r = window.innerHeight;
        let l, c, d = n;
        const h = t => t >= 8 && t + s.height <= r - 8, p = t => t >= 8 && t + s.width <= o - 8, g = i.left + i.width / 2 - s.width / 2, m = i.top + i.height / 2 - s.height / 2;
        switch (n) {
          case "top":
            c = i.top - s.height - 0, c < 8 && h(i.bottom + 0) && (c = i.bottom + 0, d = "bottom");
            break;

          case "bottom":
            c = i.bottom + 0, c + s.height > r - 8 && h(i.top - s.height - 0) && (c = i.top - s.height - 0, 
            d = "top");
            break;

          case "left":
            l = i.left - s.width - 0, l < 8 && p(i.right + 0) && (l = i.right + 0, d = "right");
            break;

          case "right":
            l = i.right + 0, l + s.width > o - 8 && p(i.left - s.width - 0) && (l = i.left - s.width - 0, 
            d = "left");
        }
        const u = "left" === d || "right" === d;
        "top" === d || "bottom" === d ? (l = g, l < 8 ? l = 8 : l + s.width > o - 8 && (l = o - s.width - 8)) : u && (c = m, 
        c < 8 ? c = 8 : c + s.height > r - 8 && (c = r - s.height - 8)), a.style.left = `${l}px`, 
        a.style.top = `${c}px`, a.classList.add("is-active"), t.tooltipElement = a;
    }
    document.head.insertAdjacentHTML("beforeend", "\n        <style>\n            .js-tooltip {\n                /* 通用样式 */\n                position: fixed;\n                padding: 8px 12px; \n                border-radius: 6px; \n                white-space: normal;\n                max-width: 600px; \n                \n                pointer-events: none;\n                font-size: 14px;\n                line-height: 1.5;\n                z-index: 9999999999;\n                \n                background: #F0FDF4; \n                color: #166534;      \n                border: none; \n                box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3); \n                \n                display: none; \n            }\n            .js-tooltip.is-active {\n                display: block !important;\n            }\n\n        </style>\n    ");
    const e = "[data-tip-top], [data-tip-bottom], [data-tip-left], [data-tip-right], [data-tip]";
    document.addEventListener("mouseover", (n => {
        const a = n.target.closest(e);
        if (a && !a.tooltipElement) {
            let e, n = "top";
            if (a.hasAttribute("data-tip-bottom") ? (e = a.getAttribute("data-tip-bottom"), 
            n = "bottom") : a.hasAttribute("data-tip-left") ? (e = a.getAttribute("data-tip-left"), 
            n = "left") : a.hasAttribute("data-tip-right") ? (e = a.getAttribute("data-tip-right"), 
            n = "right") : a.hasAttribute("data-tip-top") ? (e = a.getAttribute("data-tip-top"), 
            n = "top") : a.hasAttribute("data-tip") && (e = a.getAttribute("data-tip"), n = "top"), 
            !e) return;
            a.hoverTimeout = setTimeout((() => {
                a.matches(":hover") && !a.tooltipElement && t(a, e, n);
            }), 50);
        }
    })), document.addEventListener("mouseout", (t => {
        const n = t.target.closest(e);
        var a;
        n && (n.hoverTimeout && (clearTimeout(n.hoverTimeout), n.hoverTimeout = null), n.contains(t.relatedTarget) || n.tooltipElement && ((a = n.tooltipElement) && a.parentNode && a.remove(), 
        n.tooltipElement = null));
    }));
}();

class J {
    constructor() {
        this.plugins = new Map;
    }
    register(t) {
        if ("function" != typeof t) throw new Error("插件必须是一个类");
        const e = new t;
        e.pluginManager = this;
        const n = e.getName();
        if (this.plugins.has(n)) throw new Error(`插件"${name}"已注册`);
        this.plugins.set(n, e);
    }
    getBean(t) {
        return this.plugins.get(t);
    }
    async processCss() {
        const t = (await Promise.allSettled(Array.from(this.plugins).map((async ([t, e]) => {
            try {
                if ("function" == typeof e.initCss) {
                    const n = await e.initCss();
                    return n && utils.insertStyle(n), {
                        name: t,
                        status: "fulfilled"
                    };
                }
                return {
                    name: t,
                    status: "skipped"
                };
            } catch (n) {
                return console.error(`插件 ${t} 加载 CSS 失败`, n), {
                    name: t,
                    status: "rejected",
                    error: n
                };
            }
        })))).filter((t => "rejected" === t.status));
        t.length && console.error("以下插件的 CSS 加载失败：", t.map((t => t.value.name)));
    }
    async processPlugins() {
        const t = (await Promise.allSettled(Array.from(this.plugins).map((async ([t, e]) => {
            try {
                if ("function" == typeof e.handle) return await e.handle(), {
                    name: t,
                    status: "fulfilled"
                };
            } catch (n) {
                return clog.error(`插件 ${t} 执行失败`, n), {
                    name: t,
                    status: "rejected",
                    error: n
                };
            }
        })))).filter((t => "rejected" === t.status));
        t.length && console.error("以下插件执行失败：", t.map((t => t.value.name)));
    }
}

class G {
    constructor() {
        o(this, "pluginManager", null), o(this, "settingSvg", '<svg t="1760926954860" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4947" width="200" height="200"><path d="M511.099222 365.825763c-80.7786 0-146.26579 65.482515-146.26579 146.259556 0 80.7786 65.48719 146.259556 146.26579 146.259556 80.777041 0 146.259556-65.480957 146.259556-146.259556C657.358779 431.308278 591.876263 365.825763 511.099222 365.825763L511.099222 365.825763zM511.099222 585.215097c-40.391637 0-73.136012-32.742816-73.136012-73.129778 0-40.391637 32.742816-73.129778 73.136012-73.129778 40.386962 0 73.129778 32.738141 73.129778 73.129778C584.229 552.472281 551.486184 585.215097 511.099222 585.215097L511.099222 585.215097zM511.099222 585.215097M900.893017 568.24369l-26.451395-15.268032c3.065451-27.021784 3.138697-54.472139 0.077922-81.822754l26.373473-15.225955c69.953678-40.391637 93.920921-129.844512 53.533959-199.799749-40.390079-69.95212-129.839837-93.925596-199.799749-53.533959l-26.373473 15.225955c-22.153219-16.330888-45.963059-29.99217-70.896534-40.843585l0-30.545416c0-80.777041-65.48719-146.259556-146.26579-146.259556-80.7786 0-146.259556 65.482515-146.259556 146.259556l0 30.515806c-12.377127 5.421811-24.587501 11.55583-36.562551 18.473743-11.97505 6.917913-23.396854 14.420242-34.277879 22.432179l-26.431136-15.258682c-69.958353-40.391637-159.406553-16.424395-199.79819 53.533959C27.378272 326.082437 51.343956 415.535311 121.299193 455.922273l26.449837 15.275825c-3.063892 27.020226-3.137139 54.465905-0.077922 81.822754l-26.373473 15.224397c-69.953678 40.391637-93.920921 129.841395-53.533959 199.799749 40.391637 69.95212 129.839837 93.920921 199.79819 53.533959l26.375032-15.224397c22.153219 16.32933 45.963059 29.984378 70.896534 40.843585l0 30.537624c0 80.7786 65.48719 146.26579 146.26579 146.26579 80.777041 0 146.259556-65.48719 146.259556-146.26579l0-30.515806c12.377127-5.415577 24.587501-11.55583 36.567226-18.467509 11.97505-6.917913 23.398412-14.420242 34.277879-22.432179l26.423343 15.258682c69.959912 40.391637 159.408111 16.418162 199.799749-53.533959C994.813938 698.085085 970.848254 608.635327 900.893017 568.24369L900.893017 568.24369zM891.096666 731.474653c-20.198936 34.982294-64.923035 46.962019-99.900654 26.770875l-63.331869-36.567226 0 0 0 0-7.988562-4.611422c-18.134004 18.450366-39.024886 34.787489-62.516805 48.353705-23.49971 13.559983-48.091888 23.482568-73.129778 29.964118l0 9.222846 0 0 0 65.828489 0 7.301289c0 40.391637-32.742816 73.136012-73.136012 73.136012-40.386962 0-73.129778-32.742816-73.129778-73.136012l0-7.402588 0-65.72719 0 0 0-9.300768c-50.682014-13.090892-97.855981-39.682547-135.652816-78.232109l-7.983886 4.606747 0 0-63.331869 36.567226c-34.977618 20.191144-79.706394 8.206743-99.900654-26.770875-20.192702-34.977618-8.206743-79.701718 26.770875-99.899095l6.341291-3.657657 0 0 64.972905-37.516316c-14.487254-52.005129-13.929333-106.151555 0.073247-156.593569l-8.057133-4.650384 0 0-63.331869-36.567226c-34.982294-20.192702-46.963578-64.923035-26.770875-99.900654 20.192702-34.97606 64.923035-46.962019 99.900654-26.763083l6.324148 3.649866 0 0 64.996282 37.528784c18.132445-18.450366 39.024886-34.790606 62.516805-48.353705 23.493477-13.559983 48.085654-23.485685 73.129778-29.964118l0-9.229079L437.960093 153.739276l0-7.309082c0-40.385404 32.742816-73.129778 73.129778-73.129778 40.391637 0 73.129778 32.744375 73.129778 73.129778l0 7.404147 0 65.72719 0 9.307001c50.686689 13.086217 97.862215 39.684106 135.657491 78.232109l48.487732-27.997368 22.828023-13.176607c34.977618-20.192702 79.701718-8.212977 99.89442 26.763083 20.198936 34.982294 8.212977 79.706394-26.764641 99.900654l-30.822819 17.79738-32.50905 18.769847 0 0 0 0-7.983886 4.605189c14.488813 52.009805 13.929333 106.159347-0.077922 156.599803l64.979139 37.511641 0 0 6.414537 3.701294C899.303409 651.772936 911.289368 696.498594 891.096666 731.474653L891.096666 731.474653zM891.096666 731.474653M197.330785 324.240361c-1.932465 3.232203-3.824411 6.497135-5.649343 9.785442L197.330785 324.240361 197.330785 324.240361zM197.330785 324.240361M830.515443 690.133926l-5.655577 9.804144C826.793889 696.699632 828.685835 693.433143 830.515443 690.133926L830.515443 690.133926zM830.515443 690.133926M505.297151 146.430195l11.304921 0C512.835324 146.369416 509.067017 146.374091 505.297151 146.430195L505.297151 146.430195zM505.297151 146.430195M516.898176 877.740444l-11.31583 0C509.350653 877.796547 513.125193 877.796547 516.898176 877.740444L516.898176 877.740444zM516.898176 877.740444" fill="#272636" p-id="4948"></path></svg>'), 
        o(this, "editSvg", '<svg t="1760920692801" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3545" width="200" height="200"><path d="M1013.929675 128.26571a143.759824 143.759824 0 0 1 10.44409 53.858738 84.576649 84.576649 0 0 1-5.836403 30.308339 92.870485 92.870485 0 0 1-18.635533 29.284408 1314.726599 1314.726599 0 0 1-24.983901 24.574329c-7.372299 7.06512-13.82306 13.311095-19.249891 18.737926-6.143582 6.143582-12.082378 11.672806-17.406817 16.382886L720.266444 82.598415c9.317766-8.601015 20.478607-18.942712 33.277737-31.02509s23.448006-21.604931 31.946628-28.67005a102.085858 102.085858 0 0 1 68.193763-22.731255c11.263234 0.307179 22.116896 2.047861 32.560985 5.222045 10.546483 3.071791 19.659463 6.655547 27.441334 10.546483 16.280493 8.601015 34.301667 23.550399 54.063524 45.052936 19.864249 21.502538 35.120812 43.82422 46.076867 67.272226z m-907.20231 570.943576l32.560986-33.38013c17.099637-17.509209 38.397389-39.216533 64.098041-64.917186l84.986221-85.395793 94.303987-94.815953 250.350976-251.477299L850.817567 389.163169 600.46659 640.640468l-93.177663 94.815953c-31.02509 30.410732-58.978389 58.364031-83.859898 83.655111-24.779115 25.29108-45.360116 46.17926-61.743001 62.562146a504.797674 504.797674 0 0 1-55.804206 50.274981c-10.239304 7.884264-20.581 14.130239-31.537055 18.737926a507.152714 507.152714 0 0 1-47.715156 19.86425 1609.311367 1609.311367 0 0 1-131.063087 42.185931c-20.478607 5.426831-35.837563 8.908194-45.974474 10.546483-20.88818 2.35504-34.813633-0.819144-41.981145-9.42016-6.860333-8.601015-8.805801-22.93604-5.73401-43.312254a396.261054 396.261054 0 0 1 11.058448-47.305584c5.836403-20.683394 12.082378-42.185931 18.635532-64.40522 6.553154-22.219289 13.003916-42.697897 19.249891-61.435822 6.143582-18.635533 11.263234-31.537055 15.15417-38.602176 4.607687-10.853662 9.829732-20.785787 15.666135-29.796373a192.49891 192.49891 0 0 1 25.086294-29.796374z" fill="#FF9500" p-id="3546"></path></svg>'), 
        o(this, "deleteSvg", '<svg t="1760921450746" class="jhs-icon icon" viewBox="0 0 1194 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4530" width="200" height="200"><path d="M761.086847 36.028779s309.754321-147.538628 424.952209 231.50509c2.047962 6.570546 71.337359 253.862013-220.838618 415.139055-12.970429 7.167869-267.515096 145.746661-370.339877 341.327076 0 0-90.963666-205.649563-393.379455-351.566888-6.399883-3.071944-304.549083-156.583796-163.751664-487.2444 3.669266-8.533177 163.666333-336.20717 466.423449-99.411511l24.575549 27.391498L387.931021 324.279495l237.648977 159.570408-109.139333 145.746661L625.579998 849.069874l-30.719437-205.820227 166.226286-169.81022-216.486698-168.103585L761.086847 36.028779z" fill="#F4382E" p-id="4531"></path></svg>'), 
        o(this, "checkSvg", '<svg t="1760921633527" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5603" width="200" height="200"><path d="M924.928 544A413.76 413.76 0 0 1 544 924.736v3.264h-64v-3.2A413.696 413.696 0 0 1 99.072 544H96v-64h3.072A413.696 413.696 0 0 1 480 99.2V96h64v3.2a413.76 413.76 0 0 1 380.928 380.8h3.072v64h-3.072z m-64-64A350.016 350.016 0 0 0 544 163.2V288h-64V163.2A350.016 350.016 0 0 0 163.072 480H288v64H163.072A350.016 350.016 0 0 0 480 860.8V736h64v124.8a350.016 350.016 0 0 0 316.928-316.8H736v-64h124.928zM512 544a32 32 0 1 1 32-32 32 32 0 0 1-32 32z" fill="#333333" p-id="5604"></path></svg>'), 
        o(this, "actressSvg", '<svg t="1760926744637" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1948" width="200" height="200"><path d="M265.950168 668.467036V209.809493A209.809493 209.809493 0 0 1 475.759661 0h40.949536A209.809493 209.809493 0 0 1 726.564189 209.809493v440.435" p-id="1949"></path><path d="M916.558657 825.861124a193.463804 193.463804 0 0 0-137.442564-155.83573l-186.001889-45.795231-10.487631-124.293214H424.106373L412.231008 624.025416l-170.623063 44.44162a193.452429 193.452429 0 0 0-133.666108 154.698244L76.410695 1023.192384h871.189985z" fill="#FFE7D9" p-id="1950"></path><path d="M668.472724 265.682859c68.431223-29.187919 96.140409 100.349111 5.20969 151.774902z" fill="#FFCFB5" p-id="1951"></path><path d="M676.378259 334.421203c1.137487-99.814492-38.674561-172.158671-38.674561-172.15867l-59.740822 11.920865a493.805894 493.805894 0 0 1-80.761583 9.099896 493.669396 493.669396 0 0 1-80.761583-9.099896l-59.683948-11.88674s-39.812048 72.344179-38.776934 172.15867l-1.080613 92.05683c5.209691 56.271486 92.4777 121.381247 195.022161 119.163147 61.196805 0.034125 165.59537-51.573665 165.59537-119.197272z" fill="#FFE7D9" p-id="1952"></path><path d="M322.198905 274.703131c-68.419848-29.187919-96.140409 100.349111-5.209691 151.774902z" fill="#FFCFB5" p-id="1953"></path><path d="M297.390311 812.461526H742.034014a38.458438 38.458438 0 0 1 38.458438 38.458439V1020.325917H258.931873V850.90859a38.458438 38.458438 0 0 1 38.458438-38.447064z" fill="#FFD527" p-id="1954"></path><path d="M690.539973 92.284327c-20.645391 84.287793-275.613121 235.323328-424.589805 117.525166l104.955934-95.548915 139.399042-64.529643z" p-id="1955"></path><path d="M285.321573 383.708519h33.624119v177.118114h-33.624119zM675.855015 383.708519h33.624118v177.118114h-33.624118z" fill="#FFD527" p-id="1956"></path></svg>'), 
        o(this, "newSvg", '<svg t="1760926857487" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3954" width="200" height="200"><path d="M508.330667 733.994667c-11.008-7.338667-13.44-17.109333-7.338667-29.333334 28.117333-37.888 41.557333-98.986667 40.341333-183.317333v-165.013333c0-14.656 7.338667-23.210667 21.994667-25.664 37.888-1.216 82.496-5.504 133.845333-12.842667 13.44-2.432 21.376 3.072 23.829334 16.512 1.216 12.224-4.266667 19.562667-16.512 21.994667a1787.093333 1787.093333 0 0 1-113.664 11.008c-6.101333 0-9.173333 3.669333-9.173334 10.986666v84.330667h135.68c12.224 1.237333 18.944 7.957333 20.16 20.181333-1.216 10.986667-7.936 17.109333-20.16 18.346667h-36.672v223.658667c-1.216 12.202667-7.936 18.944-20.16 20.16-11.008-1.216-17.109333-7.957333-18.346666-20.16V501.162667h-60.48v18.346666c1.216 92.885333-13.44 161.92-44.010667 207.146667-6.101333 12.224-15.893333 14.677333-29.333333 7.338667z m-131.989334-282.325334c-1.237333 0-2.453333 0.618667-3.669333 1.834667h45.824a522.666667 522.666667 0 0 0 16.512-31.168c7.317333-12.224 12.224-20.778667 14.656-25.664 6.122667-11.008 15.274667-14.677333 27.52-11.008 9.770667 6.122667 12.202667 14.058667 7.317333 23.829333-4.906667 9.792-13.44 24.448-25.664 44.010667h49.493334c9.770667 1.216 15.274667 6.72 16.512 16.490667-1.237333 11.008-6.741333 17.109333-16.512 18.346666h-82.496a12.437333 12.437333 0 0 1 3.669333 9.173334v38.485333h69.653333c9.792 1.216 15.296 6.72 16.512 16.490667-1.216 11.008-6.72 17.130667-16.512 18.346666h-69.653333v108.16c0 34.218667-15.274667 51.946667-45.845333 53.162667h-16.490667a195.157333 195.157333 0 0 1-20.16 1.834667c-12.224 0-19.562667-6.72-22.016-20.16 1.237333-12.224 7.338667-18.944 18.346667-20.16 2.432 0 6.101333 0.597333 10.986666 1.834666h11.008c15.893333 0 23.829333-8.554667 23.829334-25.685333v-98.986667H314.026667c-11.008-1.216-17.109333-7.338667-18.346667-18.346666 1.237333-9.770667 7.338667-15.274667 18.346667-16.490667h75.157333V497.493333c0-3.669333 1.216-6.72 3.669333-9.173333h-89.813333c-11.029333-1.216-17.130667-7.317333-18.346667-18.325333 1.216-9.770667 7.317333-15.274667 18.346667-16.490667h56.810667c-3.669333-1.216-6.72-4.266667-9.173334-9.173333-1.216-1.216-3.050667-4.266667-5.482666-9.173334a758.336 758.336 0 0 0-14.677334-23.829333c-4.885333-9.770667-3.050667-17.706667 5.504-23.829333 11.008-3.669333 19.562667-1.216 25.664 7.338666 2.453333 2.432 6.122667 7.338667 11.008 14.656 6.101333 8.554667 9.770667 14.08 10.986667 16.512 4.906667 9.770667 2.453333 18.346667-7.317333 25.664z m-60.501333-71.509333c-9.792-1.216-15.274667-7.317333-16.512-18.346667 1.237333-9.749333 6.72-15.253333 16.512-16.490666h75.157333c-3.669333-12.202667-7.338667-21.973333-10.986666-29.333334-1.237333-12.202667 3.648-19.541333 14.656-21.973333 12.224-2.453333 21.397333 1.216 27.52 10.986667 0 1.216 0.597333 3.669333 1.813333 7.338666 4.906667 15.872 9.173333 26.88 12.842667 32.981334h60.48c11.008 1.237333 17.130667 6.741333 18.346666 16.512-1.216 11.008-7.338667 17.109333-18.346666 18.346666h-181.482667z m-14.677333 311.68c-8.533333-6.122667-10.986667-14.08-7.338667-23.829333a1659.648 1659.648 0 0 0 33.002667-66.005334c4.906667-9.792 12.224-12.842667 22.016-9.173333 9.770667 4.906667 13.44 12.224 10.986666 21.994667-3.669333 6.122667-9.173333 17.728-16.490666 34.837333-8.554667 15.893333-14.677333 27.52-18.346667 34.837333-4.885333 8.554667-12.821333 11.008-23.829333 7.338667z m201.664-25.664c-9.770667 4.885333-18.346667 2.432-25.664-7.338667a1138.56 1138.56 0 0 1-27.498667-44.010666c-4.885333-8.533333-3.050667-16.490667 5.504-23.829334 9.770667-3.669333 18.346667-1.216 25.664 7.338667l14.677333 21.994667c6.101333 9.770667 10.389333 17.109333 12.821334 21.994666 4.906667 8.554667 3.050667 16.512-5.504 23.850667z" fill="#333333" p-id="3955"></path><path d="M675.328 117.717333A425.429333 425.429333 0 0 0 512 85.333333C276.352 85.333333 85.333333 276.352 85.333333 512s191.018667 426.666667 426.666667 426.666667 426.666667-191.018667 426.666667-426.666667c0-56.746667-11.093333-112-32.384-163.328a21.333333 21.333333 0 0 0-39.402667 16.341333A382.762667 382.762667 0 0 1 896 512c0 212.074667-171.925333 384-384 384S128 724.074667 128 512 299.925333 128 512 128c51.114667 0 100.8 9.984 146.986667 29.12a21.333333 21.333333 0 0 0 16.341333-39.402667z" fill="#333333" p-id="3956"></path></svg>'), 
        o(this, "refreshSvg", '<svg t="1760926993643" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5942" width="200" height="200"><path d="M511.966722 0a511.966722 511.966722 0 1 0 179.828311 32.445891l-22.46254 59.964102A447.970882 447.970882 0 1 1 511.966722 63.99584a31.99792 31.99792 0 0 0 0-63.99584z" fill="#333333" p-id="5943"></path><path d="M649.2378 9.151405A30.909991 30.909991 0 0 1 671.316364 0h193.267438a31.99792 31.99792 0 0 1 31.357962 31.99792c0 17.662852-13.759106 31.99792-31.357962 31.99792H703.954243v160.629559a31.99792 31.99792 0 0 1-31.99792 31.357962 31.485953 31.485953 0 0 1-31.99792-31.357962V31.357962c0-8.511447 3.647763-16.318939 9.343392-21.950573z" fill="#333333" p-id="5944"></path></svg>'), 
        o(this, "blacklistSvg", '<svg t="1761386375897" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1936" width="200" height="200"><path d="M513.199827 65.667605c-246.537999 0-446.399933 199.861934-446.399933 446.399933 0 246.553349 199.861934 446.399933 446.399933 446.399933 246.553349 0 446.399933-199.846584 446.399933-446.399933C959.599759 265.529539 759.753175 65.667605 513.199827 65.667605zM513.199827 894.697075c-211.320916 0-382.629537-171.322947-382.629537-382.628514 0-94.183056 34.029024-180.417069 90.461291-247.080352l165.389818 165.389818c4.320399 39.651069 26.816762 73.840752 58.981323 94.068446-72.189136 27.369348-123.517151 97.156784-123.517151 178.936345l337.541643 0 100.846826 100.846826C693.608709 860.664981 607.375719 894.697075 513.199827 894.697075zM805.362956 759.14175 697.264982 651.0448c-16.556071-58.332547-60.10082-105.306394-116.275213-126.601396 35.888372-22.570042 59.752896-62.511729 59.752896-108.032482 0-70.436212-57.108672-127.542838-127.542838-127.542838-48.218188 0-90.184999 26.765597-111.865787 66.245773L266.120498 219.900316c66.663282-56.432267 152.897296-90.461291 247.079328-90.461291 211.304544 0 382.628514 171.308621 382.628514 382.629537C895.82834 606.244454 861.796246 692.476421 805.362956 759.14175z" fill="#272636" p-id="1937"></path></svg>'), 
        o(this, "removeSvg", '<svg t="1761958343616" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1939" width="200" height="200"><path d="M405.312 736a32 32 0 0 1-32-32V448a32 32 0 0 1 64 0v256a32 32 0 0 1-32 32zM650.688 448a32 32 0 0 0-64 0v256a32 32 0 1 0 64 0V448z" fill="#333333" p-id="1940"></path><path d="M514.816 53.312h-2.752c-21.504 0-39.808 0-55.04 1.408a116.672 116.672 0 0 0-45.568 12.352c-5.76 3.008-11.2 6.528-16.32 10.496a116.608 116.608 0 0 0-30.144 36.352c-7.552 13.248-15.168 29.888-24.128 49.536l-17.856 39.232H128a32 32 0 0 0 0 64h32V832A160 160 0 0 0 320 992h384a160 160 0 0 0 160-160V266.688h32a32 32 0 0 0 0-64h-190.912l-20.992-43.264c-9.152-18.944-16.896-35.008-24.576-47.744a116.608 116.608 0 0 0-30.208-35.072 117.376 117.376 0 0 0-16.064-10.112 116.608 116.608 0 0 0-44.736-11.84c-14.784-1.28-32.64-1.28-53.696-1.28zM800 266.688V832a96 96 0 0 1-96 96H320A96 96 0 0 1 224 832V266.688h576z m-166.016-64h-240.64l5.184-11.456c9.664-21.184 16.064-35.2 22.016-45.568a54.144 54.144 0 0 1 13.568-17.28 53.312 53.312 0 0 1 7.424-4.8 54.144 54.144 0 0 1 21.312-5.12c11.968-1.088 27.328-1.152 50.624-1.152 22.72 0 37.76 0 49.344 1.088 11.072 0.96 16.704 2.752 20.928 4.928 2.56 1.28 4.992 2.88 7.36 4.608 3.776 2.816 7.808 7.168 13.504 16.64 6.016 10.048 12.608 23.488 22.528 43.968l6.848 14.08z" fill="#333333" p-id="1941"></path></svg>'), 
        o(this, "copySvg", '<svg t="1749017229420" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9184" width="200" height="200"><path d="M512 74.666667C270.933333 74.666667 74.666667 270.933333 74.666667 512S270.933333 949.333333 512 949.333333 949.333333 753.066667 949.333333 512 753.066667 74.666667 512 74.666667z m0 810.666666c-204.8 0-373.333333-168.533333-373.333333-373.333333S307.2 138.666667 512 138.666667 885.333333 307.2 885.333333 512 716.8 885.333333 512 885.333333z" fill="#666666" p-id="9185"></path><path d="M512 512m-42.666667 0a42.666667 42.666667 0 1 0 85.333334 0 42.666667 42.666667 0 1 0-85.333334 0Z" fill="#666666" p-id="9186"></path><path d="M341.333333 512m-42.666666 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" fill="#666666" p-id="9187"></path><path d="M682.666667 512m-42.666667 0a42.666667 42.666667 0 1 0 85.333333 0 42.666667 42.666667 0 1 0-85.333333 0Z" fill="#666666" p-id="9188"></path></svg>'), 
        o(this, "titleSvg", '<svg t="1747553289744" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7507" width="200" height="200"><path d="M959.8 150.8c0-2.3-1.9-4.2-4.2-4.2H253.3c-2.3 0-4.2 1.9-4.2 4.2v115.9c0 2.3 1.9 4.2 4.2 4.2h702.3c2.3 0 4.2-1.9 4.2-4.2V150.8z" fill="" p-id="7508"></path><path d="M126.4 208.8m-62.2 0a62.2 62.2 0 1 0 124.4 0 62.2 62.2 0 1 0-124.4 0Z" fill="" p-id="7509"></path><path d="M851.5 453.7c0-2.1-1.8-3.9-3.9-3.9H252.9c-2.1 0-3.9 1.7-3.9 3.9v116.6c0 2.1 1.7 3.9 3.9 3.9h594.7c2.1 0 3.9-1.7 3.9-3.9V453.7z" fill="" p-id="7510"></path><path d="M126.4 512m-62.2 0a62.2 62.2 0 1 0 124.4 0 62.2 62.2 0 1 0-124.4 0Z" fill="" p-id="7511"></path><path d="M851.5 756.9c0-2.1-1.8-3.9-3.9-3.9H252.9c-2.1 0-3.9 1.8-3.9 3.9v116.6c0 2.1 1.7 3.9 3.9 3.9h594.7c2.1 0 3.9-1.7 3.9-3.9V756.9z" fill="" p-id="7512"></path><path d="M126.4 815.2m-62.2 0a62.2 62.2 0 1 0 124.4 0 62.2 62.2 0 1 0-124.4 0Z" fill="" p-id="7513"></path></svg>'), 
        o(this, "carNumSvg", '<svg t="1747552574854" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3539" width="200" height="200"><path d="M920.337035 447.804932c-6.067182-6.067182-10.918677-11.643178-16.985859-17.71036l48.536436-30.334889-42.469254-109.207238-121.340579 12.134365c-6.067182-6.067182-6.067182-12.134365-12.134365-18.201547-12.134365-12.134365-18.201547-24.267706-24.267706-30.334889-24.26873-36.402071-30.334889-42.469254-54.603619-42.469254H339.116511c-18.201547 0-24.267706 6.067182-54.603619 42.469254-6.067182 6.067182-12.134365 18.201547-24.267706 30.334889 0 0-6.067182 6.067182-12.134365 18.201547l-115.27442-12.134365-48.536436 109.207238 51.090608 24.378223c-6.067182 6.067182-30.334889 34.660404-30.334889 34.660405l-15.542998 22.280446-12.282744 17.018605c-6.067182 12.134365-5.064342 10.868535-5.064342 29.070082v224.480635c0 36.402071 18.201547 60.670801 54.603618 60.670801h115.273397c36.402071 0 54.603619-24.267706 54.603619-54.603619v-18.201547h424.693562v18.201547c0 30.334889 18.201547 54.603619 54.603618 54.603619h115.273397c36.402071 0 60.670801-24.267706 60.670801-60.670801V539.300786c0-42.469254 0.685615-46.662763-11.44875-64.863287-4.731768-6.744611-11.94403-16.196891-20.101827-26.632567z m-35.186383-78.381161l-30.334889 18.201547-12.134365-12.134365c-6.067182-8.899694-12.134365-12.134365-12.134365-18.201547l42.469254-6.067183 12.134365 18.201548z m-533.899776-97.072873h339.755054l78.871325 103.140055H272.378527l78.872349-103.140055zM175.305655 357.290429h36.402071c-6.067182 6.067182-6.067182 12.134365-12.134365 18.201547l-18.201547 6.067183-18.201547-12.134365 12.135388-12.134365z m667.375743 394.35765h-54.603619V678.843936H242.043638v72.804143H132.837424V527.167444c0-12.134365-0.041956-20.662599 1.216711-23.556508 1.258667-2.89391 9.955746-16.924461 21.193695-29.173437l35.722596-38.276768h639.576607l21.917172 20.938891c6.067182 6.067182 21.847587 21.366633 25.712615 28.732392 7.621585 9.996678 6.973832 10.999518 13.041014 23.133883v242.682182h-48.536436zM242.043638 533.234627h133.474944v60.670801H242.043638v-60.670801z m412.559197 0h133.474944v60.670801H654.602835v-60.670801z" p-id="3540"></path></svg>'), 
        o(this, "downSvg", '<svg t="1747552626242" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4551" width="200" height="200"><path d="M641.6 660l-8.64-64 32-4.32a211.2 211.2 0 0 0-26.72-420.32 215.36 215.36 0 0 0-213.12 192 94.56 94.56 0 0 0 0 11.52v41.28h-64V384v-7.04a153.12 153.12 0 0 1 0-19.52A279.84 279.84 0 0 1 636.16 108H640A275.2 275.2 0 0 1 673.28 656z" fill="#333333" p-id="4552"></path><path d="M490.4 446.24l-7.52-39.84a182.4 182.4 0 0 1 107.52-162.88l29.12-13.28L646.08 288l-29.12 13.28a117.92 117.92 0 0 0-70.08 101.28l6.24 30.4zM392.96 652.32h-78.72A202.24 202.24 0 0 1 256 256l30.72-9.12 18.24 61.28-30.72 9.12a138.24 138.24 0 0 0 39.68 270.72h78.72zM479.2 512h64v320h-64z" fill="#333333" p-id="4553"></path><path d="M510.4 908l-156.32-147.68 43.84-46.4 112.48 106.08 112.8-106.08 43.84 46.56-156.64 147.52z" fill="#333333" p-id="4554"></path></svg>'), 
        o(this, "handleSvg", '<svg t="1749106236917" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2628" width="200" height="200"><path d="M838 989.48a32 32 0 0 1-22.5-9.22L519.3 687.6 207.48 980.8a32 32 0 0 1-54-23.32V136.52A98.54 98.54 0 0 1 252 38.1h519.6A98.52 98.52 0 0 1 870 136.52v820.96a32 32 0 0 1-32 32zM252 102.1a34.46 34.46 0 0 0-34.42 34.42v746.96L498 619.84a32 32 0 0 1 44.42 0.56L806 880.88V136.52a34.46 34.46 0 0 0-34.4-34.42z" p-id="2629"></path><path d="M648 604.92a28 28 0 0 1-16.46-5.34l-112.84-82-112.84 82a28 28 0 0 1-43.08-31.32l43.1-132.64-112.84-82a28 28 0 0 1 16.46-50.66h139.48L492 170.34a28 28 0 0 1 53.26 0l43.1 132.64h139.48a28 28 0 0 1 16.46 50.66l-112.84 82 43.1 132.64A28 28 0 0 1 648 604.92z m-129.3-150a27.86 27.86 0 0 1 16.46 5.36l59.58 43.28-22.76-70a28 28 0 0 1 10.02-31.28l59.58-43.3H568a28 28 0 0 1-26.64-19.34l-22.76-70-22.76 70a28 28 0 0 1-26.62 19.34h-73.64l59.58 43.3a28 28 0 0 1 10.16 31.3l-22.76 70 59.58-43.28a28 28 0 0 1 16.46-5.32z" p-id="2630"></path></svg>'), 
        o(this, "siteSvg", '<svg t="1749107903569" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="12439" width="200" height="200"><path d="M882.758621 133.674884C882.758621 59.84828 822.91034 0 749.083736 0 675.25715 0 615.40887 59.84828 615.40887 133.674884 615.40887 163.358402 625.152318 191.656395 642.813352 214.773283L670.872117 193.336726 648.314739 166.170836 253.911693 493.666092 276.469054 520.831982 302.371681 496.834595C277.256669 469.725608 241.995388 453.990153 204.295574 453.990153 130.46897 453.990153 70.62069 513.838433 70.62069 587.66502 70.62069 661.491624 130.46897 721.339904 204.295574 721.339904 255.555319 721.339904 301.619094 692.208675 324.036714 647.136344L276.646223 663.002394 706.082022 877.440106 721.856794 845.849335 690.37312 829.861888C680.932829 848.452414 675.940882 869.068818 675.940882 890.325116 675.940882 964.15172 735.789162 1024 809.615766 1024 883.442353 1024 943.290633 964.15172 943.290633 890.325116 943.290633 874.050807 940.36533 858.125365 934.723584 843.16446L868.645076 868.0826C871.294817 875.109252 872.669943 882.595452 872.669943 890.325116 872.669943 925.14899 844.439623 953.37931 809.615766 953.37931 774.791892 953.37931 746.561571 925.14899 746.561571 890.325116 746.561571 880.245089 748.902894 870.575616 753.340487 861.836782L769.436089 830.140063 737.631567 814.258564 308.195769 599.820853 276.554929 584.02108 260.805279 615.686903C250.212352 636.984797 228.494795 650.719214 204.295574 650.719214 169.4717 650.719214 141.241379 622.488894 141.241379 587.66502 141.241379 552.841163 169.4717 524.610842 204.295574 524.610842 222.12269 524.610842 238.680594 531.99985 250.566444 544.829369L273.29589 569.363385 299.026432 547.997855 693.429478 220.502616 719.514606 198.84265 698.930882 171.900169C690.596687 160.991373 686.029559 147.727007 686.029559 133.674884 686.029559 98.85101 714.25988 70.62069 749.083736 70.62069 783.90761 70.62069 812.137931 98.85101 812.137931 133.674884 812.137931 148.208022 807.249885 161.899255 798.379608 172.996785L853.543883 217.089695C872.331935 193.584128 882.758621 164.379366 882.758621 133.674884ZM749.083736 196.729062C729.149334 196.729062 710.818745 187.460449 698.930882 171.900169L642.813352 214.773283C667.922573 247.639305 706.904064 267.349751 749.083736 267.349751 790.225902 267.349751 828.357809 248.599782 853.543883 217.089695L798.379608 172.996785C786.455411 187.915034 768.530291 196.729062 749.083736 196.729062ZM337.970441 587.66502C337.970441 553.551854 325.093782 521.360666 302.371681 496.834595L250.566444 544.829369C261.309069 556.424898 267.349751 571.526356 267.349751 587.66502 267.349751 597.565263 265.091478 607.069184 260.805279 615.686903L324.036714 647.136344C333.156105 628.801148 337.970441 608.540036 337.970441 587.66502ZM809.615766 756.650249C758.753986 756.650249 712.986006 785.330865 690.37312 829.861888L753.340487 861.836782C764.027215 840.791658 785.603302 827.270938 809.615766 827.270938 836.08553 827.270938 859.461862 843.730308 868.645076 868.0826L934.723584 843.16446C915.252259 791.529949 865.714547 756.650249 809.615766 756.650249Z" fill="#389BFF" p-id="12440"></path></svg>'), 
        o(this, "videoSvg", '<svg t="1749003664455" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1952" width="200" height="200"><path d="M825.6 153.6H198.4C124.5 153.6 64 214.1 64 288v448c0 73.9 60.5 134.4 134.4 134.4h627.2c73.9 0 134.4-60.5 134.4-134.4V288c0-73.9-60.5-134.4-134.4-134.4z m-138.2 44.8l112 112H706l-112-112h93.4z m-156.8 0l112 112H526.7l-112-112h115.9z m-179.2 0l112 112H347.5l-112-112h115.9zM108.8 288c0-41.4 28.4-76.1 66.7-86.3l108.7 108.7H108.8V288z m806.4 448c0 49.4-40.2 89.6-89.6 89.6H198.4c-49.4 0-89.6-40.2-89.6-89.6V355.2h806.4V736z m0-425.6h-52.5l-112-112h74.9c49.4 0 89.6 40.2 89.6 89.6v22.4z" p-id="1953"></path><path d="M454 687.2l149.3-77.6c27.5-13.8 27.5-53 0-66.8L468 472.2c-31.2-15.6-68 7.1-68 42v139.6c0 27.8 29.2 45.8 54 33.4zM444.8 512l134.4 67.2-134.4 67.2V512z" p-id="1954"></path></svg>'), 
        o(this, "screenSvg", '<svg t="1750691468062" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2693" width="200" height="200"><path d="M288 160a64 64 0 0 0-64 64v576a64 64 0 0 0 64 64h448a64 64 0 0 0 64-64v-576a64 64 0 0 0-64-64h-448m0-64h448a128 128 0 0 1 128 128v576a128 128 0 0 1-128 128h-448a128 128 0 0 1-128-128v-576a128 128 0 0 1 128-128z" fill="#4078FD" p-id="2694"></path><path d="M416 352m-64 0a64 64 0 1 0 128 0 64 64 0 1 0-128 0Z" fill="#FE9C23" p-id="2695"></path><path d="M352 732.448a32 32 0 0 1-32-32v-160a32 32 0 0 1 44.224-29.568l130.112 53.632 153.952-169.984a32 32 0 0 1 55.712 21.472v284.448a32 32 0 0 1-32 32z m0-32h320z" fill="#4078FD" opacity=".2" p-id="2696"></path><path d="M672 416l-169.088 186.656-150.912-62.208v160h320V416m0-32a32 32 0 0 1 32 32v284.448a32 32 0 0 1-32 32h-320a32 32 0 0 1-32-32v-160a32 32 0 0 1 44.192-29.6l130.112 53.632 153.984-169.984a32 32 0 0 1 23.712-10.496z" fill="#4078FD" p-id="2697"></path></svg>'), 
        o(this, "recoveryVideoSvg", '<svg t="1749003779161" class="jhs-icon icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8204" width="200" height="200"><path d="M938.666667 553.92V768c0 64.8-52.533333 117.333333-117.333334 117.333333H202.666667c-64.8 0-117.333333-52.533333-117.333334-117.333333V256c0-64.8 52.533333-117.333333 117.333334-117.333333h618.666666c64.8 0 117.333333 52.533333 117.333334 117.333333v297.92z m-64-74.624V256a53.333333 53.333333 0 0 0-53.333334-53.333333H202.666667a53.333333 53.333333 0 0 0-53.333334 53.333333v344.48A290.090667 290.090667 0 0 1 192 597.333333a286.88 286.88 0 0 1 183.296 65.845334C427.029333 528.384 556.906667 437.333333 704 437.333333c65.706667 0 126.997333 16.778667 170.666667 41.962667z m0 82.24c-5.333333-8.32-21.130667-21.653333-43.648-32.917333C796.768 511.488 753.045333 501.333333 704 501.333333c-121.770667 0-229.130667 76.266667-270.432 188.693334-2.730667 7.445333-7.402667 20.32-13.994667 38.581333-7.68 21.301333-34.453333 28.106667-51.370666 13.056-16.437333-14.634667-28.554667-25.066667-36.138667-31.146667A222.890667 222.890667 0 0 0 192 661.333333c-14.464 0-28.725333 1.365333-42.666667 4.053334V768a53.333333 53.333333 0 0 0 53.333334 53.333333h618.666666a53.333333 53.333333 0 0 0 53.333334-53.333333V561.525333zM320 480a96 96 0 1 1 0-192 96 96 0 0 1 0 192z m0-64a32 32 0 1 0 0-64 32 32 0 0 0 0 64z" fill="#000000" p-id="8205"></path></svg>');
    }
    getName() {
        throw new Error(`${this.constructor.name} 未显示getName()`);
    }
    getBean(t) {
        return this.pluginManager.getBean(t);
    }
    async initCss() {
        return "";
    }
    async handle() {}
    getPageInfo() {
        let t, e, n, a, i, s = window.location.href;
        return c && (t = $('a[title="複製番號"]').attr("data-clipboard-text"), e = s.split("?")[0].split("#")[0], 
        n = $(".female").prev().map(((t, e) => $(e).text())).get().join(" "), a = $(".male").prev().map(((t, e) => $(e).text())).get().join(" "), 
        i = $('strong:contains("日期:")').parent(".panel-block").find(".value").text().trim()), 
        d && (e = s.split("?")[0], t = e.split("/").filter(Boolean).pop().replace(/_\d{4}-\d{2}-\d{2}$/, ""), 
        n = $('span[onmouseover*="star_"] a').map(((t, e) => $(e).text())).get().join(" "), 
        a = "", i = $('span.header:contains("發行日期:")').parent("p").text().trim().replace("發行日期:", "").trim()), 
        {
            carNum: t,
            url: e,
            actress: n,
            actors: a,
            publishTime: i
        };
    }
    getActressId() {
        const t = l.match(/\/actors\/([^/?]+)/);
        return t && t.length > 1 ? t[1] : null;
    }
    getActressPageInfo() {
        let t = window.location.href;
        if (!t.includes("/actors/") && !t.includes("/star/")) throw new Error("接口调用错误, 非演员详情页");
        let e = [], n = c ? $(".actor-section-name") : $(".avatar-box .photo-info .pb10");
        n.length && n.text().trim().split(",").forEach((t => {
            e.push(t.trim());
        }));
        let a = $(".section-meta:not(:contains('影片'))");
        a.length && a.text().trim().split(",").forEach((t => {
            e.push(t.trim());
        }));
        let i = $(".section-meta:contains('男優')").length > 0 ? D : L, s = M;
        e.some((t => t.includes("無碼"))) && (s = A), t.includes("uncensored") && (s = A);
        let o = null, r = null;
        const l = new URL(t);
        if (c) {
            r = l.pathname.split("/").filter((t => "" !== t.trim())).pop();
            const t = l.searchParams;
            t.delete("sort_type"), t.delete("page"), o = l.toString();
        } else if (d) {
            const e = "/star/", n = t.split(e);
            if (n.length < 2) throw new Error("提取演员url失败");
            const a = n[0];
            r = n[1].split("/")[0], o = a + e + r;
        }
        return {
            starId: r,
            name: e[0],
            allName: e,
            role: i,
            movieType: s,
            blacklistUrl: o
        };
    }
    getSelector(t) {
        const e = t || (c ? B : d ? P : null), n = {
            javdb: {
                boxSelector: ".movie-list",
                itemSelector: ".movie-list .item",
                coverImgSelector: ".cover img",
                requestDomItemSelector: ".movie-list .item",
                nextPageSelector: ".pagination-next"
            },
            javbus: {
                boxSelector: ".masonry",
                itemSelector: ".masonry .item",
                coverImgSelector: ".masonry .movie-box .photo-frame img",
                requestDomItemSelector: "#waterfall .item",
                nextPageSelector: "#next"
            }
        };
        if (!e || !n[e]) throw new Error("类型错误: 无法确定选择器类型 (JavDb 或 JavBus)");
        return n[e];
    }
    parseMovieId(t) {
        return t.split("/").pop().split(/[?#]/)[0];
    }
    getBoxCarInfo(t) {
        var e, n, a;
        const i = t.find("a"), s = i.attr("href");
        let o = null, r = null, l = null;
        const c = t.find(".video-title");
        if (c.length > 0) {
            const n = c.find("strong");
            if (n.length > 0 && (o = n.text().trim()), r = null == (e = i.attr("title")) ? void 0 : e.trim(), 
            !r) {
                const t = c.text().trim();
                r = o && t.includes(o) ? t.replace(o, "").trim() : t;
            }
            l = t.find(".meta").text().trim();
        }
        if (!o) {
            const e = t.find("img");
            e.length > 0 && (r = (null == (n = e.attr("title")) ? void 0 : n.trim()) || (null == (a = e.attr("data-title")) ? void 0 : a.trim()));
            const i = t.find("date").map(((t, e) => $(e).text().trim())).get(), s = t => /^\d{4}-\d{1,2}-\d{1,2}$/.test(t);
            l = i.find(s) || null, o = i.find((t => !s(t))) || null;
        }
        if (!o) {
            const e = "提取番号信息失败: carNum 为空";
            throw console.error("Error in getBoxCarInfo:", e, "Box Element:", t.get(0)), show.error(e), 
            new Error(e);
        }
        return {
            carNum: o,
            url: s || "",
            aHref: s || "",
            title: r || "",
            publishTime: l || ""
        };
    }
    getBoxCarInfoList(t = null) {
        if (t || (t = $(this.getSelector().itemSelector)), 0 === t.length) return clog.error("获取当前列表页所有item的番号信息失败!"), 
        [];
        const e = [];
        return t.each(((t, n) => {
            const a = $(n);
            try {
                const t = this.getBoxCarInfo(a);
                e.push(t);
            } catch (i) {
                clog.error("[getBoxCarInfoList] 提取单个 boxCar 信息失败:", i.message, "元素索引:", t);
            }
        })), e;
    }
    checkDuplicateCarNumbers(t, e) {
        if (!t || 0 === t.length || !e || 0 === e.length) return !1;
        const n = new Set(t.map((t => t.carNum)).filter((t => t)));
        if (0 === n.size) return !1;
        let a = 0;
        for (let i = 0; i < e.length; i++) {
            const t = e[i] ? e[i].carNum : null;
            if (t && n.has(t)) {
                if (a++, a >= 2) return clog.warn("警告: 检测到连续番号信息重复, 该类别可能已被限制页码。"), !0;
            } else a = 0;
        }
        return !1;
    }
}

class Y extends G {
    getName() {
        return "DetailPagePlugin";
    }
    constructor() {
        super();
    }
    handle() {
        window.isDetailPage && ($(".video-meta-panel a").each((function() {
            const t = $(this).attr("href");
            t && (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/")) && $(this).attr("target", "_blank");
        })), this.handleFancyBox());
    }
    handleFancyBox() {
        if (document.addEventListener("click", (function(t) {
            if (t.target.closest(".fancybox-button--thumbs")) {
                const t = !$(".fancybox-thumbs").is(":hidden");
                localStorage.setItem("jhs_fancyboxThumbs", t.toString()), unsafeWindow.$.fancybox.defaults.thumbs.autoStart = t;
            }
        })), void 0 !== unsafeWindow.$.fancybox) {
            const t = localStorage.getItem("jhs_fancyboxThumbs");
            unsafeWindow.$.fancybox.defaults.thumbs.autoStart = "true" === t;
        }
    }
}

const X = (t, e) => {
    if (!t || 0 === t.length) return null;
    const n = new Set(t);
    if (n.has(e)) return e;
    const a = F.map((t => t.quality)).reverse();
    for (const i of a) if (n.has(i)) return i;
    return t[0];
}, Q = "jhs_dmm_video";

class Z {
    constructor(t, e = !0) {
        this.carNum = t, this.showErrorMessages = e;
    }
    _checkCache() {
        const t = localStorage.getItem(Q) ? JSON.parse(localStorage.getItem(Q)) : {};
        return t[this.carNum] ? (clog.debug("缓存中存在预览视频信息", t[this.carNum]), t[this.carNum]) : null;
    }
    _updateCache(t) {
        const e = localStorage.getItem(Q) ? JSON.parse(localStorage.getItem(Q)) : {};
        e[this.carNum] = t, clog.debug("成功解析出预览视频并已缓存:", t), localStorage.setItem(Q, JSON.stringify(e));
    }
    async _searchContentIds() {
        const t = this.carNum, e = t.replace(/-/g, ""), n = [ {
            keyword: t.replace("-", "00"),
            name: "00-替换关键词"
        }, {
            keyword: t,
            name: "原始番号关键词"
        }, {
            keyword: e,
            name: "无连字符关键词"
        } ], a = t.toLowerCase();
        for (const o of n) {
            const {keyword: t, name: n} = o, i = t.toLowerCase(), r = `https://api.dmm.com/affiliate/v3/ItemList?${new URLSearchParams({
                api_id: "UrwskPfkqQ0DuVry2gYL",
                affiliate_id: "10278-996",
                output: "json",
                site: "FANZA",
                sort: "match",
                keyword: t
            }).toString()}`;
            let l;
            try {
                l = await gmHttp.get(r);
            } catch (s) {
                clog.error(`API 请求失败，跳过 ${n}:`, s);
                continue;
            }
            if (!l || !l.result || !l.result.result_count) {
                clog.debug(`使用 ${n} (${t}) 进行 API 搜索 返回无结果，尝试下一个关键词。`);
                continue;
            }
            const c = [];
            for (const s of l.result.items) {
                if (c.length >= 2) break;
                const t = s.content_id || "", o = s.maker_product || "";
                (t.includes(i.replace("-", "")) || a === o.toLowerCase() || t.includes(e.toLowerCase())) && (c.push({
                    serviceCode: s.service_code,
                    floorCode: s.floor_code,
                    contentId: t,
                    pageUrl: s.URL
                }), clog.debug(`[${n}] cid|makerProduct 匹配成功:`, t, o));
            }
            if (c.length > 0) {
                clog.debug(`--- 成功通过 ${n} 找到 Content IDs ---`);
                const e = $("#fanzaBtn");
                let a = `https://www.dmm.co.jp/search/=/searchstr=${t}`, i = "single";
                c.length > 1 ? (e.attr("href", a), e.append('<span class="site-tag" style="top:-15px">多结果</span>'), 
                e.css("backgroundColor", "#7bc73b"), i = "multiple") : (a = c[0].pageUrl, e.attr("href", a), 
                e.css("backgroundColor", "#7bc73b"));
                const s = "jhs_other_site_dmm", o = localStorage.getItem(s) ? JSON.parse(localStorage.getItem(s)) : {};
                return o[this.carNum] = {
                    type: i,
                    url: a
                }, localStorage.setItem(s, JSON.stringify(o)), c;
            }
            clog.debug(`[${n}] API 返回结果数 ${l.result.result_count}，但无精确匹配的 Content ID。`);
        }
        clog.warn("所有关键词尝试均未找到匹配的Content ID, 解析Dmm视频失败");
        const i = $("#fanzaBtn");
        return i.attr("href", `https://www.dmm.co.jp/search/=/searchstr=${this.carNum}`), 
        i.attr("title", "未查询到, 点击前往搜索页"), i.css("backgroundColor", "#de3333"), null;
    }
    async _extractTrailerLinks({contentId: t, serviceCode: e, floorCode: n}) {
        const a = `https://www.dmm.co.jp/service/digitalapi/-/html5_player/=/cid=${t}/mtype=AhRVShI_/service=${e}/floor=${n}/mode=/`, i = await gmHttp.get(a, null, {
            "accept-language": "ja-JP,ja;q=0.9",
            Cookie: "age_check_done=1"
        });
        if ("string" != typeof i) throw clog.error(i), new Error("解析播放页内容失败, 非文本内容");
        if (i.includes("このサービスはお住まいの地域からは")) throw new Error("节点不可用，请将DMM域名分流到日本ip");
        const s = i.match(/const\s+args\s+=\s+(.*);/);
        if (!s) throw new Error("未在脚本中找到 const args = ... 变量");
        let o;
        try {
            ({bitrates: o} = JSON.parse(s[1]));
        } catch (d) {
            throw new Error(`解析播放器脚本 JSON 失败: ${d.message}`);
        }
        const r = {}, l = F.map((t => t.quality)).join("|"), c = new RegExp(`(${l})\\.mp4$`);
        if (!Array.isArray(o)) throw clog.error("解析画质链接失败: bitrates 字段不是一个数组或不存在"), new Error("解析画质链接失败: bitrates 字段不是一个数组或不存在");
        clog.debug("原始数据返回:", o);
        for (const h of o) {
            const t = null == h ? void 0 : h.src;
            if (!t || "string" != typeof t || !t.endsWith(".mp4")) continue;
            const e = t.match(c);
            let n = "";
            e && e[1] && (n = e[1]), n && !r[n] && (r[n] = t);
        }
        if (0 === Object.keys(r).length) throw new Error("未找到匹配要求的预览画质视频");
        return r;
    }
    async fetchVideo() {
        const t = this._checkCache();
        if (t) return t;
        let e;
        try {
            const t = this.carNum.toLowerCase();
            if (t.startsWith("heyzo") || /^(n\d+|\d+(-\d+)*)$/.test(t) || /^n\d+$/.test(t)) throw new Error("无码番号类型, 取消dmm解析");
            if (this.carNum.includes("VR-")) throw new Error("VR类型, 取消dmm解析");
            e = await this._searchContentIds();
        } catch (n) {
            clog.error("DMM API 搜索失败:", n);
            const t = $("#fanzaBtn");
            return t.attr("href", `https://www.dmm.co.jp/search/=/searchstr=${this.carNum}`), 
            t.attr("title", "未查询到, 点击前往搜索页"), t.css("backgroundColor", "#de3333"), null;
        }
        if (!e || 0 === e.length) return null;
        try {
            const t = await Promise.any(e.map((t => this._extractTrailerLinks(t))));
            return this._updateCache(t), t;
        } catch (a) {
            const t = a.errors || [ a ];
            if (t.some((t => t.message.includes("节点不可用")))) this.showErrorMessages && show.error("节点不可用，请将DMM域名分流到日本ip"); else {
                const e = t[0].message || t[0];
                clog.error(`解析失败: ${e}`, t), this.showErrorMessages && show.error(`解析失败: ${e}`);
            }
            const e = $("#fanzaBtn");
            return e.attr("href", `https://www.dmm.co.jp/search/=/searchstr=${this.carNum}`), 
            e.attr("title", "未查询到, 点击前往搜索页"), e.css("backgroundColor", "#de3333"), null;
        }
    }
}

const tt = async (t, e = !0) => new Z(t, e).fetchVideo();

class et extends G {
    getName() {
        return "PreviewVideoPlugin";
    }
    async initCss() {
        return "\n            .video-control-btn {\n                min-width:120px;\n                padding: 7px 12px;\n                font-size: 12px;\n                background: rgba(0,0,0,0.7);\n                color: white;\n                border: none;\n                border-radius: 4px;\n                cursor: pointer;\n            }\n            .video-control-btn.active {\n                background-color: #1890ff;\n                color: white;\n                font-weight: bold;\n                border: 2px solid #096dd9;\n            }\n        ";
    }
    async handle() {
        if (!isDetailPage) return;
        let t = await storageManager.getSetting();
        this.filterHotKey = t.filterHotKey, this.favoriteHotKey = t.favoriteHotKey, this.speedVideoHotKey = t.speedVideoHotKey;
        let e = $(".preview-video-container");
        e.on("click", (t => {
            utils.loopDetector((() => $(".fancybox-content #preview-video").length > 0), (() => {
                this.handleVideo().then();
            }));
        }));
        await storageManager.getSetting("enableLoadPreviewVideo", I) !== I || l.includes("autoPlay=1") || this.initDmm().then();
        let n = window.location.href;
        (n.includes("gallery-1") || n.includes("gallery-2")) && utils.loopDetector((() => $(".fancybox-content #preview-video").length > 0), (() => {
            $(".fancybox-content #preview-video").length > 0 && this.handleVideo().then();
        })), n.includes("autoPlay=1") && e.length > 0 && e[0].click();
    }
    async initDmm() {
        try {
            const t = await tt(this.getPageInfo().carNum, !1);
            if (!t) return;
            let e = await storageManager.getSetting("videoQuality");
            clog.debug("解析其它画质预览视频", "设置-期望画质", e);
            const n = t[X(Object.keys(t), e)];
            clog.log("切换其它画质预览视频: ", n);
            const a = $("#preview-video"), i = a.length ? a[0] : null, s = !i || utils.isHidden(a);
            if (a.length) {
                if (i) {
                    const t = i.currentTime;
                    a.attr("src", n), s || (clog.debug("播放器已手动打开, 变更进度条"), i.currentTime = t, i.play());
                }
            } else {
                clog.debug("JavDB没有视频播放元素, 开始创建...");
                const t = $(".column-video-cover img").attr("src");
                $(".preview-images").prepend(`\n                    <a class="preview-video-container" data-fancybox="gallery" href="#preview-video">\n                        <span>預告片</span>\n                        <img src="${t}" class="video-cover" style="width: 150px; height: auto;" alt="">\n                    </a>\n                `);
                $(".preview-video-container").on("click", (t => {
                    utils.loopDetector((() => $(".fancybox-content #preview-video").length > 0), (async () => {
                        await this.handleVideo();
                    }));
                }));
            }
        } catch (t) {
            clog.error("预加载dmm失败:", t);
        }
    }
    async handleVideo() {
        if (await storageManager.getSetting("enableLoadPreviewVideo", I) === T) return;
        const t = $("#preview-video");
        if (!t.length) return;
        const e = t.parent();
        e.css("position", "relative");
        const n = t[0], a = localStorage.getItem("jhs_videoMuted");
        a && (n.muted = "yes" === a), n.addEventListener("volumechange", (function() {
            localStorage.setItem("jhs_videoMuted", n.muted ? "yes" : "no");
        })), n.play();
        let i = this.getPageInfo().carNum;
        const s = await tt(i);
        let o = $("<div></div>").attr("id", "video-bottom-toolbar").css({
            display: "flex",
            gap: "5px",
            "align-items": "center",
            "flex-wrap": "wrap"
        }), r = $("<div></div>").css({
            display: "flex",
            gap: "5px",
            "align-items": "center"
        }), l = null;
        if (s) {
            let e = await storageManager.getSetting("videoQuality");
            l = X(Object.keys(s), e);
            let a = s[l];
            t.attr("src") !== a && (t.attr("src", a), n.load(), n.play()), F.forEach((t => {
                let e = s[t.quality];
                if (e) {
                    const n = l === t.quality;
                    let a = $(`\n                    <button class="video-control-btn${n ? " active" : ""}" \n                            id="${t.id}" \n                            data-quality="${t.quality}"\n                            data-video-src="${e}"\n                            style="min-width: 40px; border: 1px solid #ccc; background-color: ${n ? "#007bff" : "#fff"}; color: ${n ? "white" : "black"};">\n                        ${t.text}\n                    </button>\n                `);
                    r.append(a);
                }
            }));
        }
        o.append(r);
        let c = $("<div></div>").css({
            display: "flex",
            gap: "5px",
            "align-items": "center",
            "margin-left": "auto"
        }), d = $(`<button class="menu-btn" id="video-filterBtn" style="min-width: 120px; background-color:#de3333;">屏蔽 ${this.filterHotKey ? "(" + this.filterHotKey + ")" : ""}</button>`);
        c.append(d);
        let h = $(`<button class="menu-btn" id="video-favoriteBtn" style="min-width: 120px; background-color:#25b1dc;">收藏 ${this.favoriteHotKey ? "(" + this.favoriteHotKey + ")" : ""}</button>`);
        c.append(h);
        let p = $(`<button class="menu-btn" id="speed-btn" style="min-width: 120px; background-color:#76b45d;">快进 ${this.speedVideoHotKey ? "(" + this.speedVideoHotKey + ")" : ""}</button>`);
        c.append(p), o.append(c), e.append(o), o.on("click", ".video-control-btn", (async e => {
            const a = $(e.currentTarget), i = a.data("video-src");
            if (!a.hasClass("active")) try {
                const e = n.currentTime;
                t.attr("src", i), n.load(), n.currentTime = e, await n.play(), o.find(".video-control-btn").removeClass("active").css({
                    "background-color": "#fff",
                    color: "black"
                }), a.addClass("active").css({
                    "background-color": "#007bff",
                    color: "white"
                });
            } catch (s) {
                console.error("切换画质失败:", s);
            }
        })), $("#speed-btn").on("click", (() => {
            this.getBean("DetailPageButtonPlugin").speedVideo();
        })), utils.rightClick(document.body, "#speed-btn", (t => {
            this.getBean("DetailPageButtonPlugin").filterOne(t);
        })), $("#video-filterBtn").on("click", (t => {
            this.getBean("DetailPageButtonPlugin").filterOne(t);
        })), $("#video-favoriteBtn").on("click", (t => {
            this.getBean("DetailPageButtonPlugin").favoriteOne(t);
        }));
    }
}

const nt = class t {
    constructor() {
        if (new.target === t) throw new Error("HotkeyManager cannot be instantiated.");
    }
    static registerHotkey(t, e, n = null) {
        if (Array.isArray(t)) {
            let a = [];
            return t.forEach((t => {
                if (!this.isHotkeyFormat(t)) throw new Error("快捷键格式错误");
                let i = this.recordHotkey(t, e, n);
                a.push(i);
            })), a;
        }
        if (!this.isHotkeyFormat(t)) throw new Error("快捷键格式错误");
        return this.recordHotkey(t, e, n);
    }
    static recordHotkey(t, e, n) {
        let a = Math.random().toString(36).substr(2);
        return this.registerHotKeyMap.set(a, {
            hotkeyString: t,
            callback: e,
            keyupCallback: n
        }), a;
    }
    static unregisterHotkey(t) {
        this.registerHotKeyMap.has(t) && this.registerHotKeyMap.delete(t);
    }
    static isHotkeyFormat(t) {
        return t.toLowerCase().split("+").map((t => t.trim())).every((t => [ "ctrl", "shift", "alt" ].includes(t) || 1 === t.length));
    }
    static judgeHotkey(t, e) {
        const n = t.toLowerCase().split("+").map((t => t.trim())), a = n.includes("ctrl"), i = n.includes("shift"), s = n.includes("alt"), o = n.find((t => "ctrl" !== t && "shift" !== t && "alt" !== t));
        return (this.isMac ? e.metaKey : e.ctrlKey) === a && e.shiftKey === i && e.altKey === s && e.key.toLowerCase() === o;
    }
};

o(nt, "isMac", 0 === navigator.platform.indexOf("Mac")), o(nt, "registerHotKeyMap", new Map), 
o(nt, "handleKeydown", (t => {
    for (const [e, n] of nt.registerHotKeyMap) {
        let e = n.hotkeyString, a = n.callback;
        nt.judgeHotkey(e, t) && a(t);
    }
})), o(nt, "handleKeyup", (t => {
    for (const [e, n] of nt.registerHotKeyMap) {
        let e = n.hotkeyString, a = n.keyupCallback;
        a && (nt.judgeHotkey(e, t) && a(t));
    }
}));

let at = nt;

document.addEventListener("keydown", (t => {
    at.handleKeydown(t);
})), document.addEventListener("keyup", (t => {
    at.handleKeyup(t);
}));

class it extends G {
    getName() {
        return "JavTrailersPlugin";
    }
    constructor() {
        super(), this.hasBand = !1;
    }
    handle() {
        let t = window.location.href;
        if (!t.includes("handle=1")) return;
        if ($("h1:contains('Page not found')").length) {
            console.log("番号无法匹配, 跳搜索");
            let e = t.split("?")[0].split("video/")[1].toLowerCase().replace("00", "-");
            return void (window.location.href = "/search/" + encodeURIComponent(e) + window.location.search);
        }
        let e = $(".videos-list .video-link").toArray();
        if (e.length) {
            const n = t.split("?")[0].split("search/")[1].toLowerCase(), a = e.find((t => $(t).find(".vid-title").text().toLowerCase().includes(n)));
            if (a) return void (window.location.href = $(a).attr("href") + window.location.search);
        }
        this.handlePlayJavTrailers(), $("#videoPlayerContainer").on("click", (() => {
            this.handlePlayJavTrailers();
        })), window.addEventListener("message", (t => {
            let e = document.getElementById("vjs_video_3_html5_api");
            e && (e.currentTime += 5);
        }));
        const n = new URLSearchParams(window.location.search), a = n.get("filterHotKey"), i = n.get("favoriteHotKey"), s = n.get("speedVideoHotKey");
        a && at.registerHotkey(a, (() => window.parent.postMessage(a, "*"))), i && at.registerHotkey(i, (() => window.parent.postMessage(i, "*"))), 
        s && at.registerHotkey(s, (() => {
            const t = document.getElementById("vjs_video_3_html5_api");
            t && (t.currentTime += 5);
        }));
    }
    handlePlayJavTrailers() {
        this.hasBand || (utils.loopDetector((() => 0 !== $("#vjs_video_3_html5_api").length), (() => {
            setTimeout((() => {
                this.hasBand = !0;
                let t = document.getElementById("vjs_video_3_html5_api");
                console.log(t), t.play(), t.currentTime = 5, t.addEventListener("timeupdate", (function() {
                    t.currentTime >= 14 && t.currentTime < 16 && (t.currentTime += 2);
                })), $("#vjs_video_3_html5_api").css({
                    position: "fixed",
                    width: "100vw",
                    height: "100vh",
                    objectFit: "cover",
                    zIndex: "999999999"
                }), $(".vjs-control-bar").css({
                    position: "fixed",
                    bottom: "20px",
                    zIndex: "999999999"
                });
            }), 100);
        })), utils.loopDetector((() => $("#vjs_video_3 canvas").length > 0), (() => {
            0 !== $("#vjs_video_3 canvas").length && $("#vjs_video_3 canvas").css({
                position: "fixed",
                width: "100vw",
                height: "100vh",
                objectFit: "cover",
                top: "0",
                right: "0",
                zIndex: "999999998"
            });
        })));
    }
}

class st extends G {
    getName() {
        return "SubTitleCatPlugin";
    }
    handle() {
        $(".t-banner-inner").hide(), $("#navbar").hide();
        let t = new URLSearchParams(window.location.search).get("search").toLowerCase(), e = $(".sub-table tr td a").toArray(), n = 0;
        e.forEach((e => {
            let a = $(e);
            a.text().toLowerCase().includes(t) ? n++ : a.parent().parent().hide();
        })), 0 === n && show.error("该番号无字幕!");
        const a = $(".sec-title"), i = a.html().replace(/^\d+/, n);
        a.html(i);
    }
}

class ot extends G {
    getName() {
        return "Fc2Plugin";
    }
    async initCss() {
        return "\n            <style>\n                /* 弹层样式 */\n                .movie-detail-layer .layui-layer-title {\n                    font-size: 18px;\n                    color: #333;\n                    background: #f8f8f8;\n                }\n                \n                \n                /* 容器样式 */\n                .movie-detail-container {\n                    margin: 40px;\n                    height: 100%;\n                    background: #fff;\n                }\n                \n                .movie-poster-container {\n                    flex: 0 0 60%;\n                    padding: 15px;\n                }\n                \n                .right-box {\n                    flex: 1;\n                    padding: 20px;\n                    overflow-y: auto;\n                }\n                \n                /* 预告片iframe */\n                .movie-trailer {\n                    width: 100%;\n                    height: 100%;\n                    min-height: 400px;\n                    background: #000;\n                    border-radius: 4px;\n                }\n                \n                /* 电影信息样式 */\n                .movie-title {\n                    font-size: 24px;\n                    margin-bottom: 15px;\n                    color: #333;\n                }\n                \n                .movie-meta {\n                    margin-bottom: 20px;\n                    color: #666;\n                }\n                \n                .movie-meta span {\n                    margin-right: 15px;\n                }\n                \n                /* 演员列表 */\n                .actor-list {\n                    display: flex;\n                    flex-wrap: wrap;\n                    gap: 8px;\n                    margin-top: 10px;\n                }\n                \n                .actor-tag {\n                    padding: 4px 12px;\n                    background: #f0f0f0;\n                    border-radius: 15px;\n                    font-size: 12px;\n                    color: #555;\n                }\n                \n                /* 图片列表 */\n                .image-list {\n                    display: flex;\n                    flex-wrap: wrap;\n                    gap: 10px;\n                    margin-top: 10px;\n                }\n                \n                .movie-image-thumb {\n                    width: 120px;\n                    height: 80px;\n                    object-fit: cover;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    transition: transform 0.3s;\n                }\n                \n                .movie-image-thumb:hover {\n                    transform: scale(1.05);\n                }\n                \n                /* 加载中和错误状态 */\n                .search-loading, .movie-error {\n                    padding: 40px;\n                    text-align: center;\n                    color: #999;\n                }\n                \n                .movie-error {\n                    color: #f56c6c;\n                }\n                \n                .fancybox-container{\n                    z-index:99999999\n                 }\n                 \n                 \n                 /* 错误提示样式 */\n                .movie-not-found, .movie-error {\n                    text-align: center;\n                    padding: 30px;\n                    color: #666;\n                }\n                \n                .movie-not-found h3, .movie-error h3 {\n                    color: #f56c6c;\n                    margin: 15px 0;\n                }\n                \n                .icon-warning, .icon-error {\n                    font-size: 50px;\n                    color: #e6a23c;\n                }\n                \n                .icon-error {\n                    color: #f56c6c;\n                }\n                \n                .fc2-movie-panel-info .panel-block {\n                    padding: 0 !important;\n                }\n            </style>\n        ";
    }
    handle() {
        let t = "/advanced_search?type=3&score_min=0&d=1";
        if ($('.navbar-item:contains("FC2")').attr("href", t), $('.tabs a:contains("FC2")').attr("href", t), 
        l.includes("advanced_search?type=3")) {
            $("h2.section-title").contents().first().replaceWith("Fc2PPV"), $(".section .container > .box").remove();
        }
        if (l.includes("collection_codes?movieId")) {
            $("section").html("");
            const t = new URLSearchParams(window.location.search);
            let e = t.get("movieId"), n = t.get("carNum"), a = t.get("url");
            e && n && a && this.openFc2Dialog(e, n, a);
        }
    }
    openFc2Dialog(t, e, n) {
        let a = e.replace("FC2-", "");
        if (n.includes("123av")) return void this.getBean("Fc2By123AvPlugin").open123AvFc2Dialog(e, n);
        let i = `\n            <div class="movie-detail-container">\n                \x3c!--<div class="movie-poster-container">\n                    <iframe class="movie-trailer" frameborder="0" allowfullscreen scrolling="no"></iframe>\n                </div>--\x3e\n               \x3c!-- <div class="right-box">--\x3e\n                    <div class="movie-info-container">\n                        <div class="search-loading">加载中...</div>\n                    </div>\n                    \n                    <div class="movie-panel-info fc2-movie-panel-info" style="margin-top:20px"><strong>第三方资源: </strong></div>\n                    \n                    <div style="margin: 30px 0">\n                        <a id="filterBtn" class="menu-btn" style="background-color:${b}"><span>${v}</span></a>\n                        <a id="favoriteBtn" class="menu-btn" style="background-color:${x}"><span>${w}</span></a>\n                        <a id="hasDownBtn" class="menu-btn" style="background-color:${S}"><span>${k}</span></a>\n                        <a id="hasWatchBtn" class="menu-btn" style="background-color:${_};"><span>${C}</span></a>\n                        \n                        <a id="search-subtitle-btn" class="menu-btn fr-btn" style="background:linear-gradient(to bottom, #8d5656, rgb(196,159,91))">\n                            <span>字幕 (SubTitleCat)</span>\n                        </a>\n                        <a id="xunLeiSubtitleBtn" class="menu-btn fr-btn" style="background:linear-gradient(to left, #375f7c, #2196F3)">\n                            <span>字幕 (迅雷)</span>\n                        </a>\n                        <a id="magnetSearchBtn" class="menu-btn fr-btn" style="width: 120px; background: linear-gradient(to right, rgb(245,140,1), rgb(84,161,29)); color: white; text-align: center; padding: 8px 0;">\n                            <span>磁力搜索</span>\n                        </a>\n                    </div>\n                    <div class="message video-panel" style="margin-top:20px">\n                        <div id="magnets-content" class="magnet-links" style="margin: 0 0.75rem">\n                            <div class="search-loading">加载中...</div>\n                        </div>\n                    </div>\n                    <div id="reviews-content">\n                    </div>\n                    <div id="related-content">\n                    </div>\n                    <span id="data-actress" style="display: none"></span>\n                \x3c!--</div>--\x3e\n            </div>\n        `;
        layer.open({
            type: 1,
            title: e,
            content: i,
            area: utils.getResponsiveArea([ "70%", "90%" ]),
            skin: "movie-detail-layer",
            scrollbar: !1,
            success: (i, s) => {
                this.loadData(t, e), $("#favoriteBtn").on("click", (async t => {
                    const a = $("#data-actress").text(), i = $("#data-releaseDate").text();
                    await storageManager.saveCar({
                        carNum: e,
                        url: n,
                        names: a,
                        actionType: g,
                        publishTime: i
                    }), window.refresh(), layer.closeAll();
                })), $("#filterBtn").on("click", (t => {
                    utils.q(t, `是否屏蔽${e}?`, (async () => {
                        const t = $("#data-actress").text(), a = $("#data-releaseDate").text();
                        await storageManager.saveCar({
                            carNum: e,
                            url: n,
                            names: t,
                            actionType: p,
                            publishTime: a
                        }), window.refresh(), layer.closeAll(), window.location.href.includes("collection_codes?movieId") && utils.closePage();
                    }));
                })), $("#hasDownBtn").on("click", (async t => {
                    const a = $("#data-actress").text(), i = $("#data-releaseDate").text();
                    await storageManager.saveCar({
                        carNum: e,
                        url: n,
                        names: a,
                        actionType: m,
                        publishTime: i
                    }), window.refresh(), layer.closeAll();
                })), $("#hasWatchBtn").on("click", (async t => {
                    const a = $("#data-actress").text(), i = $("#data-releaseDate").text();
                    await storageManager.saveCar({
                        carNum: e,
                        url: n,
                        names: a,
                        actionType: u,
                        publishTime: i
                    }), window.refresh(), layer.closeAll();
                })), $("#search-subtitle-btn").on("click", (t => utils.openPage(`https://subtitlecat.com/index.php?search=${e}`, e, !1, t))), 
                $("#xunLeiSubtitleBtn").on("click", (() => this.getBean("DetailPageButtonPlugin").searchXunLeiSubtitle(e))), 
                $("#magnetSearchBtn").on("click", (() => {
                    let t = this.getBean("MagnetHubPlugin").createMagnetHub(e);
                    layer.open({
                        type: 1,
                        title: "磁力搜索",
                        content: '<div id="magnetHubBox"></div>',
                        area: utils.getResponsiveArea([ "60%", "80%" ]),
                        scrollbar: !1,
                        success: () => {
                            $("#magnetHubBox").append(t);
                        }
                    });
                })), this.getBean("OtherSitePlugin").loadOtherSite(a, e).then(), utils.setupEscClose(s);
            },
            end() {
                window.location.href.includes("collection_codes?movieId") && utils.closePage();
            }
        });
    }
    loadData(t, e) {
        let n = e.replace("FC2-", "");
        this.handleMovieDetail(t), this.handleLongImg(n), this.handleMagnets(t);
        this.getBean("ReviewPlugin").showReview(t, $("#reviews-content")).then(), this.getBean("RelatedPlugin").showRelated($("#related-content"), t).then();
    }
    handleMovieDetail(t) {
        R.getMovieDetail(t).then((t => {
            const e = t.actors || [], n = t.imgList || [];
            let a = "";
            if (e.length > 0) {
                let t = "";
                for (let n = 0; n < e.length; n++) {
                    let i = e[n];
                    a += `<span class="actor-tag"><a href="/actors/${i.id}" target="_blank">${i.name}</a></span>`, 
                    0 === i.gender && (t += i.name + " ");
                }
                $("#data-actress").text(t);
            } else a = '<span class="no-data">暂无演员信息</span>';
            let i = "";
            i = Array.isArray(n) && n.length > 0 ? n.map(((t, e) => `\n                <a href="${t}" data-fancybox="movie-gallery" data-caption="剧照 ${e + 1}">\n                    <img src="${t}" class="movie-image-thumb"  alt=""/>\n                </a>\n            `)).join("") : '<div class="no-data">暂无剧照</div>', 
            $(".movie-info-container").html(`\n                <h3 class="movie-title"><strong class="current-title">${t.title || "无标题"}</strong></h3>\n                <div class="movie-meta">\n                    <span><strong>番号: </strong>${t.carNum || "未知"}</span>\n                    <span><strong>年份: </strong>${t.releaseDate || "未知"}</span>\n                    <span><strong>评分: </strong>${t.score || "无"}</span>\n                    <span><strong>时长: </strong>${t.duration + " m" || "无"}</span>\n                </div>\n                <div class="movie-meta">\n                    <span>\n                        <strong>站点: </strong>\n                        <a href="https://fc2ppvdb.com/articles/${t.carNum.replace("FC2-", "")}" target="_blank">fc2ppvdb</a>\n                        <a style="margin-left: 5px;" href="https://adult.contents.fc2.com/article/${t.carNum.replace("FC2-", "")}/" target="_blank">fc2电子市场</a>\n                    </span>\n                </div>\n                <div class="movie-actors">\n                    <div class="actor-list"><strong>主演: </strong>${a}</div>\n                </div>\n                <div class="movie-gallery" style="margin-top:10px">\n                    <strong>剧照: </strong>\n                    <div class="image-list">${i}</div>\n                </div>\n                <div id="data-releaseDate" style="display: none">${t.releaseDate || ""}</div>\n            `), 
            this.getBean("TranslatePlugin").translate(t.carNum, !1).then();
        })).catch((t => {
            console.error(t), $(".movie-info-container").html(`\n                <div class="movie-error">加载失败: ${t.message}</div>\n            `);
        }));
    }
    handleLongImg(t) {
        utils.loopDetector((() => $(".movie-gallery .image-list").length > 0), (async () => {
            $(".movie-gallery .image-list").prepend(' <a class="tile-item screen-container" style="overflow:hidden;max-height: 150px;max-width:150px; text-align:center;"><div style="margin-top: 50px;color: #000;cursor: auto">正在加载缩略图</div></a> ');
            const e = this.getBean("ScreenShotPlugin"), n = await e.getScreenshot(t);
            n && await e.addImg("缩略图", n);
        }));
    }
    handleMagnets(t) {
        R.getMagnets(t).then((t => {
            let e = "";
            if (t.length > 0) for (let n = 0; n < t.length; n++) {
                let a = t[n], i = "";
                n % 2 == 0 && (i = "odd"), e += `\n                        <div class="item columns is-desktop ${i}">\n                            <div class="magnet-name column is-four-fifths">\n                                <a href="magnet:?xt=urn:btih:${a.hash}" title="右鍵點擊並選擇「複製鏈接地址」">\n                                    <span class="name">${a.name}</span>\n                                    <br>\n                                    <span class="meta">\n                                        ${(a.size / 1024).toFixed(2)}GB, ${a.files_count}個文件 \n                                     </span>\n                                    <br>\n                                    <div class="tags">\n                                        ${a.hd ? '<span class="tag is-primary is-small is-light">高清</span>' : ""}\n                                        ${a.cnsub ? '<span class="tag is-warning is-small is-light">字幕</span>' : ""}\n                                    </div>\n                                </a>\n                            </div>\n                            <div class="buttons column">\n                                <button class="button is-info is-small copy-to-clipboard" data-clipboard-text="magnet:?xt=urn:btih:${a.hash}" type="button">&nbsp;複製&nbsp;</button>\n                            </div>\n                            <div class="date column"><span class="time">${a.created_at}</span></div>\n                        </div>\n                    `;
            } else e = '<span class="no-data">暂无磁力信息</span>';
            $("#magnets-content").html(e), $(".buttons button[data-clipboard-text*='magnet:']").each(((t, e) => {
                $(e).parent().append($("<button>").text("115离线下载").addClass("button is-info is-small").click((async t => {
                    t.stopPropagation(), t.preventDefault();
                    let n = loading();
                    try {
                        await this.getBean("WangPan115TaskPlugin").handleAddTask($(e).attr("data-clipboard-text"));
                    } catch (a) {
                        show.error("发生错误:" + a), console.error(a);
                    } finally {
                        n.close();
                    }
                })));
            }));
        })).catch((t => {
            console.error(t), $("#magnets-content").html(`\n                <div class="movie-error">加载失败: ${t.message}</div>\n            `);
        }));
    }
    async openFc2Page(t, e, n) {
        const a = this.getBean("OtherSitePlugin");
        let i = await a.getJavDbUrl();
        window.open(`${i}/users/collection_codes?movieId=${t}&carNum=${e}&url=${n}`);
    }
}

class rt extends G {
    getName() {
        return "HighlightMagnetPlugin";
    }
    doFilterMagnet() {
        this.handleDb(), this.handleBus();
    }
    handleDb() {
        if (!c) return;
        let t = $("#magnets-content .name");
        if (0 === t.length) return;
        const e = [ "4k", "-c", "-u", "-uc" ];
        let n = !1;
        t.each(((t, a) => {
            const i = $(a), s = i.text().toLowerCase(), o = e.some((t => s.includes(t)));
            i.parent().parent().parent().addClass("magnet-row"), s.includes("4k") && i.css("color", "#f40"), 
            o && (n = !0, i.parent().parent().parent().addClass("high-quality"));
        })), n ? $("#magnets-content .magnet-row").not(".high-quality").hide() : $("#enable-magnets-filter").addClass("do-hide");
    }
    handleBus() {
        d && isDetailPage && utils.loopDetector((() => $("#magnet-table td a").length > 0), (() => {
            const t = $("#magnet-table tr"), e = [ "4k", "-c", "-u", "-uc" ];
            let n = !1;
            t.each(((t, a) => {
                const i = $(a), s = i.find("td:first-child"), o = s.find("a:first-child"), r = s.find("a:nth-child(2)"), l = o.text().toLowerCase();
                l.includes("4k") && o.css("color", "#f40");
                (e.some((t => l.includes(t))) || r.length && r.text().includes("字幕")) && (n = !0, 
                i.addClass("high-quality"));
            })), n ? t.each(((t, e) => {
                const n = $(e);
                n.hasClass("high-quality") || n.hide();
            })) : $("#enable-magnets-filter").addClass("do-hide");
        }));
    }
    showAll() {
        if (c) {
            $("#magnets-content .item").toArray().forEach((t => $(t).show()));
        }
        d && $("#magnet-table tr").toArray().forEach((t => $(t).show()));
    }
}

class lt extends G {
    getName() {
        return "FoldCategoryPlugin";
    }
    async initCss() {
        const t = await storageManager.getSetting();
        return `\n            <style>\n                #tags a.tag, .tags a.tag {\n                    position:relative;\n                }\n                .highlight-btn {\n                    position: absolute;\n                    top: -10px;\n                    right: -10px;\n                    background-color: #4CAF50;\n                    color: white;\n                    border: none;\n                    border-radius: 50%;\n                    width: 24px;\n                    height: 24px;\n                    font-size: 14px;\n                    line-height: 24px;\n                    text-align: center;\n                    cursor: pointer;\n                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);\n                    display: none;\n                    z-index: 999;\n                }\n                /* 当父元素被高亮时，按钮变为其他颜色 */\n                .highlighted .highlight-btn {\n                    background-color: #FF5722;\n                }\n                /* 高亮状态下的标签样式 */\n                .highlighted {\n                    /* 浅黄色 */\n                    border: ${t.highlightedTagNumber || 1}px solid ${t.highlightedTagColor || "#ce2222"};\n                }\n            </style>\n        `;
    }
    async handle() {
        window.isListPage && (l.includes("advanced_search") || (this.highlightTag(), utils.loopDetector((() => $("#waitCheckBtn").length), (() => {
            this.createFoldBtn();
        }), 1, 1e4, !0), $("#tags .tag-category .tag-expand").each(((t, e) => {
            $(e).parent().hasClass("collapse") && e.click();
        }))));
    }
    highlightTag() {
        (async () => {
            const t = await storageManager.getHighlightedTags();
            t && t.forEach((t => {
                $(`#tags a.tag:contains(${t})`).addClass("highlighted"), $(`.tags a.tag:contains(${t})`).addClass("highlighted");
            }));
        })().then(), $("#tags a.tag, .tags a.tag").hover((function() {
            const t = $(this), e = $('<button class="highlight-btn" title="高亮显示">★</button>');
            t.append(e), e.fadeIn(0);
        }), (function() {
            $(this).find(".highlight-btn").fadeOut(0, (function() {
                $(this).remove();
            }));
        })), $(document).on("click", ".highlight-btn", (async function(t) {
            t.stopPropagation(), t.preventDefault();
            const e = $(this).closest("a.tag"), n = e.clone();
            n.find(".highlight-btn").remove();
            const a = n.text().trim().replace(/\s*\(\d+\)$/, "");
            let i = await storageManager.getHighlightedTags();
            i.includes(a) ? (i = i.filter((t => t !== a)), e.removeClass("highlighted")) : (i.push(a), 
            e.addClass("highlighted")), await storageManager.setHighlightedTags(i);
        }));
    }
    async createFoldBtn() {
        const t = await storageManager.getSetting("foldCategoryHotKey");
        let e = $("#tags"), n = $("#tags dl div.tag.is-info").map((function() {
            return $(this).text().replaceAll("\n", "").replaceAll(" ", "");
        })).get().join(" ");
        if (!n) return;
        $(".tabs").append(`\n            <div style="display: flex;align-items: center;flex-grow:1;justify-content: flex-end;">\n                <div>已选分类: <span id="jhs-check-tag">${n}</span></div>\n                <a class="menu-btn  main-tab-btn" id="foldCategoryBtn" style="background-color:#d23e60 !important;">\n                    <span></span>\n                    ${t ? ` (${t})` : ""}\n                    <i style="margin-left: 10px"></i>\n                </a>\n\n            </div>\n        `);
        let a = $("h2.section-title");
        if (a.length > 0 && (a.append('\n                <div id="foldCategoryBtn">\n                    <a class="menu-btn" style="background-color:#d23e60 !important;margin-left: 20px;border-bottom:none !important;border-radius:3px;">\n                        <span></span>\n                        <i style="margin-left: 10px"></i>\n                    </a>\n                </div>\n            '), 
        e = $("section > div > div.box")), !e) return;
        let i = $("#foldCategoryBtn"), s = localStorage.getItem("jhs_foldCategory") === I, [o, r] = s ? [ "展开", "icon-angle-double-down" ] : [ "折叠", "icon-angle-double-up" ];
        i.find("span").text(o).end().find("i").attr("class", r), window.location.href.includes("noFold=1") || e[s ? "hide" : "show"](), 
        i.on("click", (async t => {
            t.preventDefault(), s = !s, localStorage.setItem("jhs_foldCategory", s ? I : T);
            const [n, a] = s ? [ "展开", "icon-angle-double-down" ] : [ "折叠", "icon-angle-double-up" ];
            i.find("span").text(n).end().find("i").attr("class", a), e[s ? "hide" : "show"]();
        }));
    }
}

class ct extends G {
    constructor() {
        super(...arguments), o(this, "apiUrl", "https://ja.wikipedia.org/wiki/");
    }
    getName() {
        return "ActressInfoPlugin";
    }
    async handle() {
        "yes" === await storageManager.getSetting("enableLoadActressInfo", "yes") && this.loadActressInfo();
    }
    loadActressInfo() {
        this.handleDetailPage().then(), this.handleStarPage().then();
    }
    async initCss() {
        return "\n            <style>\n                .info-tag {\n                    background-color: #ecf5ff;\n                    display: inline-block;\n                    height: 32px;\n                    padding: 0 10px;\n                    line-height: 30px;\n                    font-size: 12px;\n                    color: #409eff;\n                    border: 1px solid #d9ecff;\n                    border-radius: 4px;\n                    box-sizing: border-box;\n                    white-space: nowrap;\n                }\n            </style>\n        ";
    }
    async handleDetailPage() {
        if ($(".actress-info").length > 0) return;
        let t = $(".female").prev().map(((t, e) => $(e).text().trim())).get();
        if (!t.length) return;
        const e = "jhs_actress_info", n = localStorage.getItem(e) ? JSON.parse(localStorage.getItem(e)) : {};
        let a = null, i = "";
        for (let o = 0; o < t.length; o++) {
            let e = t[o];
            if (a = n[e], !a) try {
                a = await this.searchInfo(e), a && (n[e] = a);
            } catch (s) {
                console.error("该名称查询失败,尝试其它名称");
            }
            let r = "";
            r = a ? `\n                    <div class="panel-block actress-info">\n                        <strong>${e}:</strong>\n                        <a href="${a.url}" style="margin-left: 5px" target="_blank">\n                            <span class="info-tag">${a.birthday} ${a.age}</span>\n                            <span class="info-tag">${a.height} ${a.weight}</span>\n                            <span class="info-tag">${a.threeSizeText} ${a.braSize}</span>\n                        </a>\n                    </div>\n                ` : `<div class="panel-block actress-info"><a href="${this.apiUrl + e}" target="_blank"><strong>${e}:</strong></a></div> `, 
            i += r;
        }
        $('strong:contains("演員")').parent().after(i), localStorage.setItem(e, JSON.stringify(n));
    }
    async handleStarPage() {
        if ($(".actress-info").length > 0) return;
        let t = [], e = $(".actor-section-name");
        e.length && e.text().trim().split(",").forEach((e => {
            t.push(e.trim());
        }));
        let n = $(".section-meta:not(:contains('影片'))");
        if (n.length && n.text().trim().split(",").forEach((e => {
            t.push(e.trim());
        })), !t.length) return;
        const a = "jhs_actress_info", i = localStorage.getItem(a) ? JSON.parse(localStorage.getItem(a)) : {};
        let s = null;
        for (let l = 0; l < t.length; l++) {
            let e = t[l];
            if (s = i[e], s) break;
            try {
                s = await this.searchInfo(e);
            } catch (r) {
                console.error("该名称查询失败,尝试其它名称");
            }
            if (s) break;
        }
        s && t.forEach((t => {
            i[t] = s;
        }));
        let o = '<div class="actress-info" style="font-size: 17px; font-weight: normal; margin-top: 5px;">无此相关演员信息</div>';
        s && (o = `\n                <a class="actress-info" href="${s.url}" target="_blank">\n                    <div style="font-size: 17px; font-weight: normal; margin-top: 5px;">\n                        <div style="display: flex; margin-bottom: 10px;">\n                            <span style="width: 300px;">出生日期: ${s.birthday}</span>\n                            <span style="width: 200px;">年龄: ${s.age}</span>\n                            <span style="width: 200px;">身高: ${s.height}</span>\n                        </div>\n                        <div style="display: flex; margin-bottom: 10px;">\n                            <span style="width: 300px;">体重: ${s.weight}</span>\n                            <span style="width: 200px;">三围: ${s.threeSizeText}</span>\n                            <span style="width: 200px;">罩杯: ${s.braSize}</span>\n                        </div>\n                    </div>\n                </a>\n            `), 
        e.parent().append(o), localStorage.setItem(a, JSON.stringify(i));
    }
    async searchInfo(t) {
        "三上悠亞" === t && (t = "三上悠亜");
        let e = this.apiUrl + t;
        const n = await gmHttp.get(e), a = new DOMParser, i = $(a.parseFromString(n, "text/html"));
        let s = i.find('a[title="誕生日"]').parent().parent().find("td").text().trim(), o = i.find("th:contains('現年齢')").parent().find("td").text().trim() ? parseInt(i.find("th:contains('現年齢')").parent().find("td").text().trim()) + "岁" : "", r = i.find('tr:has(a[title="身長"]) td').text().trim().split(" ")[0] + "cm", l = i.find('tr:has(a[title="体重"]) td').text().trim().split("/")[1].trim();
        return "― kg" === l && (l = ""), {
            birthday: s,
            age: o,
            height: r,
            weight: l,
            threeSizeText: i.find('a[title="スリーサイズ"]').closest("tr").find("td").text().replace("cm", "").trim(),
            braSize: i.find('th:contains("ブラサイズ")').next("td").contents().first().text().trim(),
            url: e
        };
    }
}

class dt extends G {
    getName() {
        return "AliyunPanPlugin";
    }
    handle() {
        $("body").append('<a class="a-success" id="refresh-token-btn" style="position:fixed; right: 0; top:50%;z-index:99999">获取refresh_token</a>'), 
        $("#refresh-token-btn").on("click", (t => {
            let e = localStorage.getItem("token");
            if (!e) return void alert("请先登录!");
            let n = JSON.parse(e).refresh_token;
            navigator.clipboard.writeText(n).then((() => {
                alert("已复制到剪切板 如失败, 请手动复制: " + n);
            })).catch((t => {
                console.error("Failed to copy refresh token: ", t);
            }));
        }));
    }
}

class ht extends G {
    constructor() {
        super(), o(this, "$contentBox", $(".section .container"));
    }
    getName() {
        return "HitShowPlugin";
    }
    handle() {
        $('a[href*="rankings/playback"]').on("click", (t => {
            t.preventDefault(), t.stopPropagation(), window.location.href = "/advanced_search?handlePlayback=1&period=daily";
        })), this.handlePlayback().then();
    }
    hookPage() {
        let t = $("h2.section-title");
        t.contents().first().replaceWith("热播"), t.css("marginBottom", "0"), $(".empty-message").remove(), 
        $(".section .container .box").remove(), $("#sort-toggle-btn").remove(), this.$contentBox.append('<div class="tool-box" style="margin-top: 10px"></div>'), 
        this.$contentBox.append('<div class="movie-list h cols-4 vcols-8" style="margin-top: 10px"></div>');
    }
    async handlePlayback() {
        if (!window.location.href.includes("handlePlayback=1")) return;
        let t = new URLSearchParams(window.location.search).get("period");
        this.toolBar(t), this.hookPage();
        let e = $(".movie-list");
        e.html("");
        let n = loading();
        try {
            const n = await R.playback(t);
            let a = R.markDataListHtml(n);
            e.html(a);
        } catch (a) {
            clog.error("发生错误:", a);
        } finally {
            n.close();
        }
    }
    toolBar(t) {
        let e = `\n            <div class="button-group" style="margin-top:18px">\n                <div class="buttons has-addons" id="conditionBox">\n                    <a style="padding:18px 18px !important;" class="button is-small ${"daily" === t ? "is-info" : ""}" href="/advanced_search?handlePlayback=1&period=daily">日榜</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"weekly" === t ? "is-info" : ""}" href="/advanced_search?handlePlayback=1&period=weekly">周榜</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"monthly" === t ? "is-info" : ""}" href="/advanced_search?handlePlayback=1&period=monthly">月榜</a>\n                </div>\n            </div>\n        `;
        this.$contentBox.append(e);
    }
    getStarRating(t) {
        let e = "";
        const n = Math.floor(t);
        for (let a = 0; a < n; a++) e += '<i class="icon-star"></i>';
        for (let a = 0; a < 5 - n; a++) e += '<i class="icon-star gray"></i>';
        return e;
    }
    loadScore(t) {
        if (0 === t.length) return;
        (async () => {
            let e = "jhs_score_info";
            for (const a of t) try {
                const t = a.id;
                if (!$(`#score_${t}`).length) return;
                if ($(`#${t}`).is(":hidden")) continue;
                const n = localStorage.getItem(e) ? JSON.parse(localStorage.getItem(e)) : {}, i = n[t];
                if (i) {
                    this.appendScoreHtml(t, i);
                    continue;
                }
                for (;!document.hasFocus(); ) await new Promise((t => setTimeout(t, 500)));
                const s = await R.getMovieDetail(t);
                let o = s.score, r = s.watchedCount, l = `\n                        <span class="value">\n                            <span class="score-stars">${this.getStarRating(o)}</span> \n                            &nbsp; ${o}分，由${r}人評價\n                        </span>\n                    `;
                this.appendScoreHtml(t, l), n[t] = l, localStorage.setItem(e, JSON.stringify(n)), 
                await new Promise((t => setTimeout(t, 500)));
            } catch (n) {
                clog.error(`🚨 解析评分数据失败 | 编号: ${a.number}\n`, `错误详情: ${n.message}\n`, n.stack ? `调用栈:\n${n.stack}` : "");
            }
        })();
    }
    appendScoreHtml(t, e) {
        let n = $(`#score_${t}`);
        n.length && "" === n.html().trim() && n.slideUp(0, (function() {
            $(this).html(e).slideDown(500);
        }));
    }
}

const pt = "jhs_appAuthorization";

class gt extends G {
    constructor() {
        super(), o(this, "has_cnsub", ""), o(this, "$contentBox", $(".section .container")), 
        o(this, "movies", []);
    }
    getName() {
        return "TOP250Plugin";
    }
    handle() {
        $('.main-tabs ul li:contains("猜你喜歡")').html('<a href="/rankings/top"><span>Top250</span></a>'), 
        $('a[href*="rankings/top"]').on("click", (t => {
            t.preventDefault(), t.stopPropagation();
            const e = $(t.target), n = (e.is("a") ? e : e.closest("a")).attr("href");
            let a = n.includes("?") ? n.split("?")[1] : n;
            const i = new URLSearchParams(a);
            this.checkLogin(t, i);
        })), this.handleTop().then();
    }
    hookPage() {
        $("h2.section-title").contents().first().replaceWith("Top250"), $(".empty-message").remove(), 
        $(".section .container .box").remove(), $("#sort-toggle-btn").remove(), this.$contentBox.append('<div class="tool-box" style="margin-top: 10px"></div>'), 
        this.$contentBox.append('<div class="movie-list h cols-4 vcols-8" style="margin-top: 10px"></div>'), 
        this.renderPagination();
    }
    renderPagination() {
        const t = new URLSearchParams(window.location.search);
        let e = parseInt(t.get("page")) || 1;
        this.$contentBox.append((t => {
            const e = t >= 5;
            let n = "";
            for (let a = 1; a <= 5; a++) {
                n += `<li><a class="pagination-link ${t === a ? "is-current" : ""}" data-page="${a}">${a}</a></li>`;
            }
            return `\n                <nav class="pagination">\n                    <a class="pagination-previous ${t <= 1 ? "do-hide" : ""}" data-page="${t - 1}">上一頁</a>\n                    <a class="pagination-next ${e ? "do-hide" : ""}" data-page="${t + 1}">下一頁</a>\n                    \n                    <ul class="pagination-list">\n                        ${n}\n                    </ul>\n                </nav>\n            `;
        })(e)), this.$contentBox.on("click", ".pagination-link, .pagination-previous, .pagination-next", (e => {
            e.preventDefault();
            const n = parseInt($(e.currentTarget).data("page"));
            !isNaN(n) && n > 0 && (e => {
                t.set("page", e), window.history.pushState({}, "", "?" + t.toString()), window.location.reload();
            })(n);
        }));
    }
    async handleTop() {
        if (!window.location.href.includes("handleTop=1")) return;
        const t = new URLSearchParams(window.location.search);
        let e = t.get("handleType") || "all", n = t.get("type_value") || "";
        this.has_cnsub = t.get("has_cnsub") || "";
        let a = t.get("page") || 1;
        this.toolBar(e, n, a), this.hookPage();
        let i = $(".movie-list");
        i.html("");
        let s = loading();
        try {
            const t = await R.top250(e, n, a, 50);
            let o = t.success, r = t.message, l = t.action;
            if (1 === o) {
                let e = t.data.movies;
                if (0 === e.length) return show.error("无数据"), void s.close();
                this.movies = e;
                const n = e.filter((t => "1" === this.has_cnsub ? t.has_cnsub : "0" !== this.has_cnsub || !t.has_cnsub));
                let a = R.markDataListHtml(n);
                i.html(a);
            } else clog.error(t), i.html(`<h3>${r}</h3>`), show.error(r), "JWTVerificationError" === l && (await localStorage.removeItem(pt), 
            await this.checkLogin(null, new URLSearchParams(window.location.search)));
        } catch (o) {
            clog.error("发生错误:", o);
        } finally {
            s.close();
        }
    }
    toolBar(t, e, n) {
        "5" === n.toString() && $(".pagination-next").remove(), $(".pagination-ellipsis").closest("li").remove(), 
        $(".pagination-list li a").each((function() {
            parseInt($(this).text()) > 5 && $(this).closest("li").remove();
        }));
        let a = "";
        for (let s = (new Date).getFullYear(); s >= 2008; s--) a += `\n                <a style="padding:18px 18px !important;" \n                   class="button is-small ${e === s.toString() ? "is-info" : ""}" \n                   href="/advanced_search?handleTop=1&handleType=year&type_value=${s}&has_cnsub=${this.has_cnsub}">\n                  ${s}\n                </a>\n            `;
        let i = `\n            <div class="button-group">\n                <div class="buttons has-addons" id="conditionBox" style="margin-bottom: 0!important;">\n                    <a style="padding:18px 18px !important;" class="button is-small ${"all" === t ? "is-info" : ""}" href="/advanced_search?handleTop=1&handleType=all&type_value=&has_cnsub=${this.has_cnsub}">全部</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"0" === e ? "is-info" : ""}" href="/advanced_search?handleTop=1&handleType=video_type&type_value=0&has_cnsub=${this.has_cnsub}">有码</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"1" === e ? "is-info" : ""}" href="/advanced_search?handleTop=1&handleType=video_type&type_value=1&has_cnsub=${this.has_cnsub}">无码</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"2" === e ? "is-info" : ""}" href="/advanced_search?handleTop=1&handleType=video_type&type_value=2&has_cnsub=${this.has_cnsub}">欧美</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"3" === e ? "is-info" : ""}" href="/advanced_search?handleTop=1&handleType=video_type&type_value=3&has_cnsub=${this.has_cnsub}">Fc2</a>\n                    \n                    <a style="padding:18px 18px !important;margin-left: 50px" class="button is-small ${"1" === this.has_cnsub ? "is-info" : ""}" data-cnsub-value="1">含中字磁鏈</a>\n                    <a style="padding:18px 18px !important;" class="button is-small ${"0" === this.has_cnsub ? "is-info" : ""}" data-cnsub-value="0">无字幕</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-cnsub-value="">重置</a>\n                </div>\n                \n                <div class="buttons has-addons" id="conditionBox">\n                    ${a}\n                </div>\n            </div>\n        `;
        this.$contentBox.append(i), $("a[data-cnsub-value]").on("click", (t => {
            const e = $(t.currentTarget).data("cnsub-value");
            this.has_cnsub = e.toString(), $("a[data-cnsub-value]").removeClass("is-info"), 
            $(t.currentTarget).addClass("is-info"), $(".toolbar a.button").not("[data-cnsub-value]").each(((t, n) => {
                const a = $(n), i = new URL(a.attr("href"), window.location.origin);
                i.searchParams.set("has_cnsub", e), a.attr("href", i.toString());
            }));
            const n = this.movies.filter((t => "1" === this.has_cnsub ? t.has_cnsub : "0" !== this.has_cnsub || !t.has_cnsub));
            let a = R.markDataListHtml(n);
            $(".movie-list").html(a);
        }));
    }
    async checkLogin(t, e) {
        if (!localStorage.getItem(pt)) return show.error("该类别依赖移动端接口，请先完成登录"), void this.openLoginDialog();
        let n = "all", a = "", i = e.get("t") || "";
        /^y\d+$/.test(i) ? (n = "year", a = i.substring(1)) : "" !== i && (n = "video_type", 
        a = i);
        let s = `/advanced_search?handleTop=1&handleType=${n}&type_value=${a}`;
        t && (t.ctrlKey || t.metaKey) ? GM_openInTab(window.location.origin + s, {
            insert: 0
        }) : window.location.href = s;
    }
    openLoginDialog() {
        layer.open({
            type: 1,
            title: "JavDB",
            closeBtn: 1,
            area: [ "360px", "auto" ],
            shadeClose: !1,
            content: '\n                <div style="padding: 30px; font-family: \'Helvetica Neue\', Arial, sans-serif;">\n                    <div style="margin-bottom: 25px;">\n                        <input type="text" id="username" name="username" \n                            style="width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 4px; \n                                   box-sizing: border-box; transition: all 0.3s; font-size: 14px;\n                                   background: #f9f9f9; color: #333;"\n                            placeholder="用户名 | 邮箱"\n                            onfocus="this.style.borderColor=\'#4a8bfc\'; this.style.background=\'#fff\'"\n                            onblur="this.style.borderColor=\'#e0e0e0\'; this.style.background=\'#f9f9f9\'">\n                    </div>\n                    \n                    <div style="margin-bottom: 15px;">\n                        <input type="password" id="password" name="password" \n                            style="width: 100%; padding: 12px 15px; border: 1px solid #e0e0e0; border-radius: 4px; \n                                   box-sizing: border-box; transition: all 0.3s; font-size: 14px;\n                                   background: #f9f9f9; color: #333;"\n                            placeholder="密码"\n                            onfocus="this.style.borderColor=\'#4a8bfc\'; this.style.background=\'#fff\'"\n                            onblur="this.style.borderColor=\'#e0e0e0\'; this.style.background=\'#f9f9f9\'">\n                    </div>\n                    \n                    <button id="loginBtn" \n                            style="width: 100%; padding: 12px; background: #4a8bfc; color: white; \n                                   border: none; border-radius: 4px; font-size: 15px; cursor: pointer;\n                                   transition: background 0.3s;"\n                            onmouseover="this.style.background=\'#3a7be0\'"\n                            onmouseout="this.style.background=\'#4a8bfc\'">\n                        登录\n                    </button>\n                </div>\n            ',
            success: (t, e) => {
                $("#loginBtn").click((function() {
                    const t = $("#username").val(), n = $("#password").val();
                    if (!t || !n) return void show.error("请输入用户名和密码");
                    let a = loading();
                    R.login(t, n).then((async t => {
                        let n = t.success;
                        if (0 === n) show.error(t.message); else {
                            if (1 !== n) throw clog.error("登录失败", t), new Error(t.message);
                            {
                                let n = t.data.token;
                                await localStorage.setItem(pt, n), show.ok("登录成功"), layer.close(e), window.location.href = "/advanced_search?handleTop=1&period=daily";
                            }
                        }
                    })).catch((t => {
                        clog.error("登录异常:", t), show.error(t.message);
                    })).finally((() => {
                        a.close();
                    }));
                }));
            }
        });
    }
}

class mt extends G {
    getName() {
        return "NavBarPlugin";
    }
    async initCss() {
        return "\n            .highlight-red {\n    /* 核心要求：高亮红色文本 */\n    color: red !important; \n    \n    /* 建议：增加字体加粗，效果更明显 */\n    font-weight: bold;\n    \n    /* 建议：增加背景色，效果更突出 */\n    /* background-color: yellow; */ \n}\n        ";
    }
    handle() {
        if (this.margeNav(), this.hookSearch(), this.hookOldSearch(), this.toggleOtherNavItem(), 
        $(window).resize(this.toggleOtherNavItem), window.location.href.includes("/search")) {
            const t = new URLSearchParams(window.location.search);
            let e = t.get("q"), n = t.get("f");
            $("#search-keyword").val(e), n && $("#search-type").val(n), e && this.highlightKeyword(e);
        }
    }
    highlightKeyword(t) {
        const e = t.trim();
        if (!e) return;
        const n = e.toLowerCase();
        $(".video-title strong, .actor-box strong").each((function() {
            const t = $(this);
            t.text().toLowerCase().includes(n) && t.addClass("highlight-red");
        }));
    }
    hookSearch() {
        $("#navbar-menu-hero").after('\n            <div class="navbar-menu" id="search-box">\n                <div class="navbar-start" style="display: flex; align-items: center; gap: 5px;">\n                    <select id="search-type" style="padding: 8px 12px; border: 1px solid #555; border-radius: 4px; background-color: #333; color: #eee; font-size: 14px; outline: none;">\n                        <option value="all">影片</option>\n                        <option value="actor">演員</option>\n                        <option value="series">系列</option>\n                        <option value="maker">片商</option>\n                        <option value="director">導演</option>\n                        <option value="code">番號</option>\n                        <option value="list">清單</option>\n                    </select>\n                    <input id="search-keyword" type="text" placeholder="輸入影片番號，演員名等關鍵字進行檢索" style="padding: 8px 12px; border: 1px solid #555; border-radius: 4px; flex-grow: 1; font-size: 14px; background-color: #333; color: #eee; outline: none;">\n                    <a href="/advanced_search?noFold=1" title="進階檢索" style="padding: 6px 12px; background-color: #444; border-radius: 4px; text-decoration: none; color: #ddd; font-size: 14px; border: 1px solid #555;"><span>...</span></a>\n                    <a id="search-img-btn" style="padding: 6px 16px; background-color: #444; color: #fff; border-radius: 4px; text-decoration: none; font-weight: 500; cursor: pointer; border: 1px solid #555;">识图</a>\n                    <a id="search-btn" style="padding: 6px 16px; background-color: #444; color: #fff; border-radius: 4px; text-decoration: none; font-weight: 500; cursor: pointer; border: 1px solid #555;">檢索</a>\n                </div>\n            </div>\n        '), 
        $("#search-keyword").on("paste", (t => {
            const e = t.originalEvent.clipboardData.items;
            for (let n = 0; n < e.length; n++) if (-1 !== e[n].type.indexOf("image")) {
                const t = e[n].getAsFile();
                $("#search-keyword").blur();
                const a = this.getBean("ImageRecognitionPlugin");
                return void a.open((() => {
                    a.handleImageFile(t), a.resetSearchUI();
                }));
            }
            setTimeout((() => {
                $("#search-btn").click();
            }), 0);
        })).on("keypress", (t => {
            "Enter" === t.key && setTimeout((() => {
                $("#search-btn").click();
            }), 0);
        })), $("#search-btn").on("click", (t => {
            let e = $("#search-keyword").val(), n = $("#search-type option:selected").val();
            "" !== e && (window.location.href.includes("/search") ? window.location.href = "/search?q=" + e + "&f=" + n : window.open("/search?q=" + e + "&f=" + n));
        })), $("#search-img-btn").on("click", (() => {
            this.getBean("ImageRecognitionPlugin").open();
        }));
    }
    hookOldSearch() {
        const t = document.querySelector(".search-image");
        if (!t) return;
        const e = t.cloneNode(!0);
        t.parentNode.replaceChild(e, t), $("#button-search-image").attr("data-tooltip", "以图识图"), 
        $(".search-image").on("click", (t => {
            this.getBean("ImageRecognitionPlugin").open();
        }));
    }
    margeNav() {
        $('a[href*="/feedbacks/new"]').remove(), $('a[href*="theporndude.com"]').remove(), 
        $('a.navbar-link[href="/makers"]').parent().after('\n            <div class="navbar-item has-dropdown is-hoverable">\n                <a class="navbar-link">其它</a>\n                <div class="navbar-dropdown is-boxed">\n                  <a class="navbar-item" href="/feedbacks/new" target="_blank" >反饋</a>\n                  <a class="navbar-item" rel="nofollow noopener" target="_blank" href="https://theporndude.com/zh">ThePornDude</a>\n                </div>\n              </div>\n        ');
    }
    toggleOtherNavItem() {
        let t = $("#search-box"), e = $("#search-bar-container");
        $(window).width() < 1600 && $(window).width() > 1023 && (t.hide(), e.show()), $(window).width() > 1600 && (t.show(), 
        e.hide());
    }
}

class ut {
    constructor() {
        this.queue = Promise.resolve();
    }
    addTask(t) {
        this.queue = this.queue.then((() => t())).catch((t => {
            clog.error("执行异步队列任务失败:", t);
        }));
    }
    async waitAllFinished() {
        return this.queue;
    }
}

class vt extends G {
    constructor() {
        super(...arguments), o(this, "okBackgroundColor", "#7bc73b"), o(this, "errorBackgroundColor", "#de3333"), 
        o(this, "warnBackgroundColor", "#d7a80c"), o(this, "domainErrorBackgroundColor", "#d7780c"), 
        o(this, "asyncQueue", new ut), o(this, "siteConfigs", [ {
            id: "javTrailersBtn",
            getBaseUrl: async () => await this.getJavTrailersUrl(),
            itemSelector: ".videos-list .video-link",
            searchPath: (t, e) => `${t}/search/${e}`,
            getDetailPageHref: t => t.attr("href"),
            findCarNumOrTitle: t => t.find("p.card-text").text()
        }, {
            id: "123AvBtn",
            getBaseUrl: async () => await this.getAv123Url() + "/ja",
            itemSelector: ".box-item",
            searchPath: (t, e) => `${t}/search?keyword=${e}`,
            getDetailPageHref: t => t.find(".detail a").attr("href"),
            findCarNumOrTitle: t => t.find("img").attr("title")
        }, {
            id: "jableBtn",
            getBaseUrl: async () => await this.getjableUrl(),
            itemSelector: "#list_videos_videos_list_search_result .detail .title a",
            searchPath: (t, e) => `${t}/search/${e}/`,
            getDetailPageHref: t => t.attr("href"),
            findCarNumOrTitle: t => t.text()
        }, {
            id: "avgleBtn",
            getBaseUrl: async () => await this.getAvgleUrl(),
            itemSelector: ".text-secondary",
            searchPath: (t, e) => `${t}/vod/search.html?wd=${e}`,
            getDetailPageHref: t => t.attr("href"),
            findCarNumOrTitle: t => t.text()
        }, {
            id: "missAvBtn",
            getBaseUrl: async () => await this.getMissAvUrl(),
            itemSelector: ".text-secondary",
            searchPath: (t, e) => `${t}/search/${e}`,
            getDetailPageHref: t => t.attr("href"),
            findCarNumOrTitle: t => t.text()
        }, {
            id: "supJavBtn",
            getBaseUrl: async () => await this.getSupJavUrl(),
            itemSelector: ".posts post",
            searchPath: (t, e) => `${t}/?s=${e}`,
            getDetailPageHref: (t, e, n) => t.attr("href"),
            findCarNumOrTitle: t => t.attr("title")
        }, {
            id: "javDbBtn",
            getBaseUrl: async () => await this.getJavDbUrl(),
            itemSelector: ".movie-list .item",
            searchPath: (t, e) => `${t}/search?q=${e}`,
            getDetailPageHref: t => t.find("a").attr("href"),
            findCarNumOrTitle: t => t.find(".video-title").text(),
            condition: t => d
        }, {
            id: "javBusBtn",
            getBaseUrl: async () => await this.getJavBusUrl(),
            itemSelector: ".container h3",
            searchPath: (t, e) => `${t}/${e}`,
            getDetailPageHref: (t, e, n) => `${e}/${n}`,
            findCarNumOrTitle: t => t.text(),
            condition: t => c && t && !t.includes("FC2")
        }, {
            id: "fanzaBtn",
            noHandle: !0,
            initUrl: t => `https://www.dmm.co.jp/search/=/searchstr=${t}`,
            condition: t => t && !t.includes("FC2")
        } ]), o(this, "settingCache", null), o(this, "lastFetchTime", 0), o(this, "CACHE_DURATION", 1e4);
    }
    getName() {
        return "OtherSitePlugin";
    }
    async initCss() {
        return "\n            <style>\n                .site-btn {\n                    position: relative !important;\n                    min-width: 80px;\n                    display: inline-block;\n                    padding: 5px 10px;\n                    color: white !important;\n                    background-color:#938585;\n                    text-decoration: none;\n                    border-radius: 4px;\n                    text-align: center;\n                    margin-bottom: 5px;\n                }\n                .site-btn:hover {\n                    color: white;\n                    transform: translateY(-2px);\n                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);\n                }\n                .site-tag {\n                    position: absolute; \n                    top: -15px; \n                    right: 0; \n                    background-color: #ffc107; \n                    color: #333; \n                    font-size: 12px; \n                    padding: 2px 6px; \n                    border-radius: 4px;\n                }\n            </style>\n        ";
    }
    async handle() {
        isDetailPage && this.loadOtherSite().then();
    }
    async loadOtherSite(t, e) {
        if ("yes" !== await storageManager.getSetting("enableLoadOtherSite", "yes")) return;
        t || (t = this.getPageInfo().carNum);
        const n = this.getEnabledSites(), a = `\n            <div id="otherSiteBox" class="panel-block" style="${c ? "margin-top:8px;font-size:13px" : "margin-top:10px;font-size:13px"}; user-select: none; ">\n                <div style="display: flex;gap: 5px;flex-wrap: wrap">\n                    ${this.siteConfigs.map((t => {
            if (t.sourceCarNum = e, t.condition && !1 === t.condition(t.sourceCarNum)) return "";
            return `<a target="_blank" class="site-btn" style="${n.includes(t.id) ? "" : "display:none"}" id="${t.id}"><span>${t.id.replace("Btn", "")}</span></a>`;
        })).join("")}\n                    <a id="settingSiteBtn" class="site-btn"><span>设置</span></a>\n                </div>\n            </div>\n            \n            <div id="settingsArea" class="panel-block"  style="display: none; margin-top:10px; margin-bottom: 10px; user-select: none; ">\n                <div id="siteCheckboxes" style="display: flex;gap: 5px;flex-wrap: wrap">\n                </div>\n            </div>\n        `;
        $(".movie-panel-info").append(a), $(".container .info").append(a), $("#javTrailersBtn").on("click", (async e => {
            e.preventDefault();
            let n = await storageManager.getSetting();
            const a = n.filterHotKey, i = n.favoriteHotKey, s = n.speedVideoHotKey;
            let o = $("#javTrailersBtn").attr("href"), r = o + `?handle=1&filterHotKey=${a}&favoriteHotKey=${i}&speedVideoHotKey=${s}`;
            e && (e.ctrlKey || e.metaKey) && (r = o), utils.openPage(r, t, !1, e);
        })), await Promise.all(this.siteConfigs.map((async e => {
            e.condition && !1 === e.condition(e.sourceCarNum) || await this.handleSite(t, e);
        }))), this.renderSettingsArea(), this.setupEventListeners();
    }
    async handleSite(t, e) {
        const n = $(`#${e.id}`);
        if (e.initUrl && (n.attr("href", e.initUrl(t)), n.css("backgroundColor", this.warnBackgroundColor)), 
        e.noHandle && !0 === e.noHandle) {
            const e = "jhs_other_site_dmm", a = (localStorage.getItem(e) ? JSON.parse(localStorage.getItem(e)) : {})[t];
            a && ("single" === a.type ? (n.attr("href", a.url), n.css("backgroundColor", this.okBackgroundColor)) : "multiple" === a.type && (n.attr("href", a.url), 
            n.append('<span class="site-tag" style="top:-15px">多结果</span>'), n.css("backgroundColor", this.okBackgroundColor)));
        } else try {
            if (n.attr("href")) return;
            if (utils.isHidden(n)) return;
            const a = "jhs_other_site", i = localStorage.getItem(a) ? JSON.parse(localStorage.getItem(a)) : {}, s = t + "_" + e.id.replace("Btn", ""), o = i[s];
            if (o) return void ("single" === o.type ? (n.attr("href", o.url), n.css("backgroundColor", this.okBackgroundColor)) : "multiple" === o.type && (n.attr("href", o.url), 
            n.append('<span class="site-tag" style="top:-15px">多结果</span>'), n.css("backgroundColor", this.okBackgroundColor)));
            const r = await e.getBaseUrl(), l = e.searchPath(r, t);
            n.attr("href", l);
            const c = await gmHttp.get(l, null, e.headers, !0), d = utils.htmlTo$dom(c), h = [];
            d.find(e.itemSelector).each(((n, a) => {
                const i = $(a);
                if (!e.findCarNumOrTitle(i).toLowerCase().includes(t.toLowerCase())) return;
                let s = e.getDetailPageHref(i, r, t);
                if (!s) throw new Error("解析href失败");
                s.includes("http") || (s = r + (s.startsWith("/") ? s : "/" + s)), h.push(s);
            }));
            let p = "", g = null;
            if (1 === h.length) {
                let t = h[0];
                n.attr("href", t), n.css("backgroundColor", this.okBackgroundColor), g = {
                    type: "single",
                    url: t
                };
            } else h.length > 1 ? (n.attr("href", l), p += '<span class="site-tag" style="top:-15px">多结果</span>', 
            n.css("backgroundColor", this.okBackgroundColor), g = {
                type: "multiple",
                url: l
            }) : (n.attr("href", l), n.attr("title", "未查询到, 点击前往搜索页"), n.css("backgroundColor", this.errorBackgroundColor));
            g && this.asyncQueue.addTask((() => {
                const t = localStorage.getItem(a) ? JSON.parse(localStorage.getItem(a)) : {};
                t[s] = g, localStorage.setItem(a, JSON.stringify(t));
            })), p && n.append(p);
        } catch (a) {
            const t = String(a), i = e.id.replace("Btn", "");
            t.includes("Just a moment") ? (n.attr("title", "请求失败：Cloudflare 安全检查。"), n.css("backgroundColor", this.warnBackgroundColor), 
            clog.warn(`检测第三方资源失败, ${i} 需Cloudflare安全检查`)) : t.includes("重定向") ? (n.attr("title", "域名失效"), 
            n.css("backgroundColor", this.domainErrorBackgroundColor), clog.warn(`检测第三方资源失败, ${i} 域名被重定向`)) : t.includes("404 Page Not Found") ? (n.attr("title", "未查询到, 点击前往搜索页"), 
            n.css("backgroundColor", this.errorBackgroundColor)) : (console.error(a), n.attr("title", "请求失败。"), 
            n.css("backgroundColor", this.errorBackgroundColor), clog.warn(`检测第三方资源失败, ${i}`));
        }
    }
    async getSettingCache() {
        const t = Date.now();
        return (!this.settingCache || t - this.lastFetchTime > this.CACHE_DURATION) && (this.settingCache = await storageManager.getSetting(), 
        this.lastFetchTime = t), this.settingCache;
    }
    async getMissAvUrl() {
        return (await this.getSettingCache()).missAvUrl || "https://missav.live";
    }
    async getjableUrl() {
        return (await this.getSettingCache()).jableUrl || "https://jable.tv";
    }
    async getAvgleUrl() {
        return (await this.getSettingCache()).avgleUrl || "https://jav.rs";
    }
    async getJavTrailersUrl() {
        return (await this.getSettingCache()).javTrailersUrl || "https://javtrailers.com";
    }
    async getAv123Url() {
        return (await this.getSettingCache()).av123Url || "https://123av.com";
    }
    async getJavDbUrl() {
        return (await this.getSettingCache()).javDbUrl || "https://javdb.com";
    }
    async getJavBusUrl() {
        return (await this.getSettingCache()).javBusUrl || "https://www.javbus.com";
    }
    async getSupJavUrl() {
        return (await this.getSettingCache()).supJavUrl || "https://supjav.com";
    }
    getEnabledSites() {
        const t = localStorage.getItem("jhs_enabled_sites");
        return t ? JSON.parse(t) : this.siteConfigs.map((t => t.id));
    }
    saveEnabledSites(t) {
        localStorage.setItem("jhs_enabled_sites", JSON.stringify(t));
    }
    renderSettingsArea() {
        const t = this.getEnabledSites(), e = document.getElementById("siteCheckboxes");
        e && (e.innerHTML = this.siteConfigs.map((e => {
            const n = t.includes(e.id);
            return `\n                <div style="margin-right: 15px; display: flex; align-items: ${c ? "center" : "flex-start"};">\n                    <input type="checkbox" id="checkbox-${e.id}" data-site-id="${e.id}" ${n ? "checked" : ""} style="margin-right: 8px; cursor: pointer;">\n                    <label for="checkbox-${e.id}" style="color: #333; font-weight: 500; cursor: pointer;">${e.id.replace("Btn", "")}</label>\n                </div>\n            `;
        })).join(""));
    }
    setupEventListeners() {
        const t = document.getElementById("settingsArea");
        document.addEventListener("click", (e => {
            if ("settingSiteBtn" === e.target.id || e.target.closest("#settingSiteBtn")) {
                const e = "none" === t.style.display || "" === t.style.display;
                t.style.display = e ? "block" : "none";
            }
        })), t.addEventListener("change", (e => {
            if ("checkbox" === e.target.type) {
                const n = e.target.getAttribute("data-site-id");
                if (e.target.checked) {
                    $(`#${n}`).show();
                    const t = this.getPageInfo().carNum, e = this.siteConfigs.find((t => t.id === n));
                    this.handleSite(t, e).then();
                } else $(`#${n}`).hide();
                const a = Array.from(t.querySelectorAll('input[type="checkbox"]:checked')).map((t => t.getAttribute("data-site-id")));
                this.saveEnabledSites(a);
            }
        }));
    }
}

class ft extends G {
    getName() {
        return "BusDetailPagePlugin";
    }
    async initCss() {
        if (!window.isDetailPage) return "";
        $("h4:contains('推薦')").hide();
    }
    async handle() {
        if (window.location.href.includes("/star/")) {
            const t = $(".avatar-box");
            if (t.length > 0) {
                let e = t.parent();
                e.css("position", "initial"), e.insertBefore(e.parent());
            }
        }
        $(".genre a").each((function() {
            const t = $(this).attr("href");
            t && (t.startsWith("http://") || t.startsWith("https://") || t.startsWith("/")) && $(this).attr("target", "_blank");
        })), this.addCopyCarNumBtn();
    }
    addCopyCarNumBtn() {
        let t = null;
        const e = document.querySelectorAll("span.header");
        for (const n of e) if ("識別碼:" === n.textContent.trim()) {
            t = n;
            break;
        }
        if (t) {
            const e = t.nextElementSibling;
            if (e && "SPAN" === e.tagName) {
                const t = e.textContent.trim(), n = document.createElement("button");
                n.textContent = "复制", n.style.marginLeft = "10px", n.style.padding = "0 10px", n.style.cursor = "pointer", 
                n.style.border = "1px solid #ccc", n.style.borderRadius = "5px", n.style.backgroundColor = "#f0f0f0", 
                n.style.fontSize = "12px", n.addEventListener("click", (function(e) {
                    e.preventDefault();
                    const n = t => {
                        this.textContent = "已复制", setTimeout((() => {
                            this.textContent = "复制";
                        }), 1500);
                    };
                    navigator.clipboard && navigator.clipboard.writeText && navigator.clipboard.writeText(t).then((() => n())).catch((e => {
                        console.error("无法通过标准API复制:", e), alert("复制失败，请手动复制: " + t);
                    }));
                })), e.parentNode.insertBefore(n, e.nextSibling);
            }
        }
    }
}

class bt extends G {
    getName() {
        return "DetailPageButtonPlugin";
    }
    constructor() {
        super(), this.answerCount = 1;
    }
    async handle() {
        let t = await storageManager.getSetting();
        this.filterHotKey = t.filterHotKey, this.favoriteHotKey = t.favoriteHotKey, this.hasDownHotKey = t.hasDownHotKey, 
        this.hasWatchHotKey = t.hasWatchHotKey, this.speedVideoHotKey = t.speedVideoHotKey, 
        this.bindHotkey().then(), this.hideVideoControls(), window.isDetailPage && this.createMenuBtn();
    }
    async createMenuBtn() {
        const t = this.getPageInfo(), e = t.carNum, n = `\n            <div style="margin: 10px auto; display: flex; justify-content: space-between; align-items: center; flex-wrap:wrap;gap: 20px;">\n                <div style="display: flex; gap: 10px; flex-wrap:wrap;">\n                    <a id="filterBtn" class="menu-btn" style="width: 120px; background-color:${b}; color: white; text-align: center; padding: 8px 0;">\n                        <span>${v}</span>\n                    </a>\n                    <a id="favoriteBtn" class="menu-btn" style="width: 120px; background-color:${x}; color: white; text-align: center; padding: 8px 0;">\n                        <span>${w}</span>\n                    </a>\n                    <a id="hasDownBtn" class="menu-btn" style="width: 120px; background-color:${S}; color: white; text-align: center; padding: 8px 0;">\n                        <span>${k}</span>\n                    </a>\n                    <a id="hasWatchBtn" class="menu-btn" style="width: 120px; background-color:${_}; color: white; text-align: center; padding: 8px 0;">\n                        <span>${C}</span>\n                    </a>\n                </div>\n        \n                <div style="display: flex; gap: 10px; flex-wrap:wrap;">\n                    <a id="enable-magnets-filter" class="menu-btn" style="width: 140px; background-color: #c2bd4c; color: white; text-align: center; padding: 8px 0;">\n                        <span id="magnets-span">关闭磁力过滤</span>\n                    </a>\n                    <a id="magnetSearchBtn" class="menu-btn" style="width: 120px; background: linear-gradient(to right, rgb(245,140,1), rgb(84,161,29)); color: white; text-align: center; padding: 8px 0;">\n                        <span>磁力搜索</span>\n                    </a>\n                    <a id="xunLeiSubtitleBtn" class="menu-btn" style="width: 120px; background: linear-gradient(to left, #375f7c, #2196F3); color: white; text-align: center; padding: 8px 0;">\n                        <span>字幕 (迅雷)</span>\n                    </a>\n                    <a id="search-subtitle-btn" class="menu-btn" style="width: 160px; background: linear-gradient(to bottom, #8d5656, rgb(196,159,91)); color: white; text-align: center; padding: 8px 0;">\n                        <span>字幕 (SubTitleCat)</span>\n                    </a>\n                </div>\n            </div>\n        `;
        c && $(".tabs").after(n), d && $("#mag-submit-show").before(n), $("#favoriteBtn").on("click", (() => this.favoriteOne())), 
        $("#filterBtn").on("click", (t => this.filterOne(t))), $("#hasDownBtn").on("click", (async () => this.hasDownOne())), 
        $("#hasWatchBtn").on("click", (async () => this.hasWatchOne())), $("#magnetSearchBtn").on("click", (() => {
            let e = this.getBean("MagnetHubPlugin").createMagnetHub(t.carNum);
            layer.open({
                type: 1,
                title: "磁力搜索 " + t.carNum,
                content: '<div id="magnetHubBox"></div>',
                area: utils.getResponsiveArea([ "60%", "80%" ]),
                scrollbar: !1,
                success: () => {
                    $("#magnetHubBox").append(e);
                }
            });
        }));
        const a = this.getBean("HighlightMagnetPlugin"), i = await storageManager.getSetting("enableMagnetsFilter", I);
        $("#magnets-span").text(i === I ? "关闭磁力过滤" : "开启磁力过滤"), i === I && a.doFilterMagnet(), 
        $("#enable-magnets-filter").on("click", (t => {
            let e = $("#magnets-span");
            "关闭磁力过滤" === e.text() ? (a.showAll(), e.text("开启磁力过滤"), storageManager.saveSettingItem("enableMagnetsFilter", T)) : (a.doFilterMagnet(), 
            e.text("关闭磁力过滤"), storageManager.saveSettingItem("enableMagnetsFilter", I));
        })), $("#search-subtitle-btn").on("click", (t => utils.openPage(`https://subtitlecat.com/index.php?search=${e}`, e, !1, t))), 
        $("#xunLeiSubtitleBtn").on("click", (() => this.searchXunLeiSubtitle(e))), this.showStatus(e).then();
    }
    async showStatus(t) {
        const e = $("#filterBtn span"), n = $("#favoriteBtn span"), a = $("#hasDownBtn span"), i = $("#hasWatchBtn span"), s = t => t ? `(${t})` : "";
        e.text(`${v} ${s(this.filterHotKey)}`), n.text(`${w} ${s(this.favoriteHotKey)}`), 
        a.text(`${k} ${s(this.hasDownHotKey)}`), i.text(`${C} ${s(this.hasWatchHotKey)}`);
        const o = await storageManager.getCar(t);
        if (o) switch (o.status) {
          case p:
            e.text(`${f} ${s(this.filterHotKey)}`);
            break;

          case g:
            n.text(`${y} ${s(this.favoriteHotKey)}`);
            break;

          case m:
            a.text(`📥️ 已标记下载 ${s(this.hasDownHotKey)}`);
            break;

          case u:
            i.text(`🔍 已标记观看 ${s(this.hasWatchHotKey)}`);
        }
    }
    async favoriteOne() {
        let t = this.getPageInfo();
        await storageManager.saveCar({
            carNum: t.carNum,
            url: t.url,
            names: t.actress,
            actionType: g,
            publishTime: t.publishTime
        }), this.showStatus(t.carNum).then(), window.refresh(), utils.closePage();
    }
    async hasDownOne() {
        let t = this.getPageInfo();
        await storageManager.saveCar({
            carNum: t.carNum,
            url: t.url,
            names: t.actress,
            actionType: m,
            publishTime: t.publishTime
        }), this.showStatus(t.carNum).then(), window.refresh(), utils.closePage();
    }
    async hasWatchOne() {
        let t = this.getPageInfo();
        await storageManager.saveCar({
            carNum: t.carNum,
            url: t.url,
            names: t.actress,
            actionType: u,
            publishTime: t.publishTime
        }), this.showStatus(t.carNum).then(), window.refresh(), utils.closePage();
    }
    searchXunLeiSubtitle(t) {
        let e = loading();
        gmHttp.get(`https://api-shoulei-ssl.xunlei.com/oracle/subtitle?gcid=&cid=&name=${t}`).then((e => {
            let n = e.data;
            n && 0 !== n.length ? layer.open({
                type: 1,
                title: "迅雷字幕",
                content: '\n                    <div style="height: 100%;overflow:hidden;"> \n                        <div id="xunlei-table-container" style="height: 100%;padding-bottom: 20px"></div>\n                    </div>\n                ',
                scrollbar: !1,
                area: utils.getResponsiveArea([ "60%", "70%" ]),
                anim: -1,
                success: (e, a) => {
                    new Tabulator("#xunlei-table-container", {
                        layout: "fitColumns",
                        placeholder: "暂无数据",
                        virtualDom: !0,
                        data: n,
                        responsiveLayout: "collapse",
                        responsiveLayoutCollapse: !0,
                        columnDefaults: {
                            headerHozAlign: "center",
                            hozAlign: "center"
                        },
                        columns: [ {
                            title: "文件名",
                            field: "name",
                            headerSort: !1,
                            responsive: 0
                        }, {
                            title: "类型",
                            field: "ext",
                            headerSort: !1,
                            responsive: 0
                        }, {
                            title: "操作",
                            responsive: 0,
                            headerSort: !1,
                            formatter: (e, n, a) => {
                                const i = e.getData();
                                return a((() => {
                                    const n = e.getElement().querySelector(".a-primary"), a = e.getElement().querySelector(".a-success");
                                    n && n.addEventListener("click", (async e => {
                                        let n = i.url, a = t + "." + i.ext;
                                        this.previewSubtitle(n, a);
                                    })), a && a.addEventListener("click", (async e => {
                                        let n = i.url, a = t + "." + i.ext, s = await gmHttp.get(n);
                                        utils.download(s, a);
                                    }));
                                })), '\n                                        <a class="a-primary">预览</a>\n                                        <a class="a-success">下载</a>\n                                    ';
                            }
                        } ],
                        locale: "zh-cn",
                        langs: {
                            "zh-cn": {
                                pagination: {
                                    first: "首页",
                                    first_title: "首页",
                                    last: "尾页",
                                    last_title: "尾页",
                                    prev: "上一页",
                                    prev_title: "上一页",
                                    next: "下一页",
                                    next_title: "下一页",
                                    all: "所有",
                                    page_size: "每页行数"
                                }
                            }
                        }
                    }), utils.setupEscClose(a);
                }
            }) : show.error("迅雷中找不到相关字幕!");
        })).catch((t => {
            console.error(t), show.error(t);
        })).finally((() => {
            e.close();
        }));
    }
    async filterOne(t, e) {
        t && t.preventDefault();
        let n = this.getPageInfo();
        e ? (await storageManager.saveCar({
            carNum: n.carNum,
            url: n.url,
            names: n.actress,
            actionType: p,
            publishTime: n.publishTime
        }), this.showStatus(n.carNum).then(), window.refresh(), utils.closePage(), layer.closeAll(), 
        this.answerCount = 1) : utils.q(t, `是否屏蔽${n.carNum}?`, (async () => {
            await storageManager.saveCar({
                carNum: n.carNum,
                url: n.url,
                names: n.actress,
                actionType: p,
                publishTime: n.publishTime
            }), this.showStatus(n.carNum).then(), window.refresh(), utils.closePage();
        }), (() => {
            this.answerCount = 1;
        }));
    }
    speedVideo() {
        if ($("#preview-video").is(":visible")) {
            const t = document.getElementById("preview-video");
            return void (t && (t.muted = !1, t.controls = !1, t.currentTime + 5 < t.duration ? t.currentTime += 5 : (show.info("预览视频结束, 已回到开头"), 
            t.currentTime = 1)));
        }
        const t = $('iframe[id^="layui-layer-iframe"]');
        if (t.length > 0) return void t[0].contentWindow.postMessage("speedVideo", "*");
        let e = $(".preview-video-container");
        if (e.length > 0) {
            e[0].click();
            const t = document.getElementById("preview-video");
            t && (t.currentTime += 5, t.muted = !1);
        } else $("#javTrailersBtn").click();
    }
    hideVideoControls() {
        $(document).on("mouseenter", "#preview-video", (function() {
            $(this).prop("controls", !0);
        }));
    }
    async bindHotkey() {
        const t = {};
        this.filterHotKey && (t[this.filterHotKey] = () => {
            this.answerCount >= 2 ? this.filterOne(null, !0) : this.filterOne(null), this.answerCount++;
        }), this.favoriteHotKey && (t[this.favoriteHotKey] = () => this.favoriteOne(null)), 
        this.hasDownHotKey && (t[this.hasDownHotKey] = () => this.hasDownOne()), this.hasWatchHotKey && (t[this.hasWatchHotKey] = () => this.hasWatchOne()), 
        this.speedVideoHotKey && (t[this.speedVideoHotKey] = () => this.speedVideo());
        const e = (t, e) => {
            at.registerHotkey(t, (n => {
                const a = document.activeElement;
                "INPUT" === a.tagName || "TEXTAREA" === a.tagName || a.isContentEditable || (window.isDetailPage ? e() : (t => {
                    const e = $(".layui-layer-content iframe");
                    0 !== e.length && e[0].contentWindow.postMessage(t, "*");
                })(t));
            }));
        };
        window.isDetailPage && window.addEventListener("message", (e => {
            t[e.data] && t[e.data]();
        })), Object.entries(t).forEach((([t, n]) => {
            e(t, n);
        }));
    }
    async previewSubtitle(t, e) {
        if (!t) return void console.error("未提供文件URL");
        const n = t.split(".").pop().toLowerCase();
        if ("ass" === n || "srt" === n) try {
            let a = await gmHttp.get(t), i = "字幕预览";
            "ass" === n ? i = "ASS字幕预览 - " + e : "srt" === n && (i = "SRT字幕预览 - " + e);
            const s = a.split("\n");
            let o = "";
            const r = String(s.length).length;
            s.forEach(((t, e) => {
                const n = String(e + 1).padStart(r, " ");
                o += `<span style="color:#AAA;">${n}. </span>${t}\n`;
            }));
            const l = o;
            layer.open({
                type: 1,
                title: i,
                area: [ "80%", "80%" ],
                scrollbar: !1,
                content: `<div style="padding:15px 5px;background:#1E1E1E;color:#FFF;font-family:Consolas,Monaco,monospace;white-space:pre-wrap;overflow:auto;height:100%;">${l}</div>`,
                btn: [ "下载", "关闭" ],
                btn1: function(t, n, i) {
                    return utils.download(a, e), !1;
                }
            });
        } catch (a) {
            show.error(`预览失败: ${a.message}`), console.error("预览字幕文件出错:", a);
        } else show.error("仅支持预览ASS和SRT字幕文件");
    }
}

class wt extends G {
    constructor() {
        super(...arguments), o(this, "tableObj", null);
    }
    getName() {
        return "HistoryPlugin";
    }
    async initCss() {
        return "\n            <style>\n                /* 下拉菜单容器（相对定位） */\n                .sub-btns {\n                    position: relative;\n                    display: inline-block;\n                }\n                \n                /* 下拉菜单内容（默认隐藏） */\n                .sub-btns-menu {\n                    display: none;\n                    position: absolute;\n                    right: 80px;\n                    top:-10px;\n                    background: white;\n                    padding:10px;\n                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n                    z-index: 100;\n                    border-radius: 4px;\n                    overflow: hidden;\n                }\n                \n                \n                /* 点击后显示菜单（JS 控制） */\n                .sub-btns-menu.show {\n                    display: flex !important;\n                    flex-direction: column;\n                }\n                \n                .table-link-param {\n                    cursor: pointer;\n                }\n            </style\n        ";
    }
    handleResize() {
        $(".navbar-search").is(":hidden") ? ($(".historyBtnBox").show(), $(".miniHistoryBtnBox").hide()) : ($(".historyBtnBox").hide(), 
        $(".miniHistoryBtnBox").show());
    }
    handle() {
        c && ($(".navbar-end").prepend('<div class="navbar-item has-sub-btns is-hoverable historyBtnBox">\n                    <a id="historyBtn" class="navbar-link nav-btn" style="color: #aade66 !important;padding-right:15px !important;">\n                        鉴定记录\n                    </a>\n                </div>'), 
        $(".navbar-search").css("margin-left", "0").before('\n                <div class="navbar-item miniHistoryBtnBox">\n                    <a id="miniHistoryBtn" class="navbar-link nav-btn" style="color: #aade66 !important;padding-left:0 !important;padding-right:0 !important;">\n                        鉴定记录\n                    </a>\n                </div>\n            '), 
        this.handleResize(), $(window).resize((() => {
            this.handleResize();
        })), $("#historyBtn,#miniHistoryBtn").on("click", (t => this.openHistory()))), d && utils.loopDetector((() => $("#setting-btn").length), (() => {
            $("#top-right-box").append('\n                    <a id="historyBtn" class="menu-btn main-tab-btn" style="background-color:#b68625 !important;">\n                        鉴定记录\n                    </a>\n               '), 
            $("#historyBtn,#miniHistoryBtn").on("click", (t => this.openHistory()));
        }), 1, 1e4, !1), this.bindClick();
    }
    openHistory() {
        let t = `\n            <div style="padding: 10px 20px; height: 100%;overflow:hidden;"> \n                 <div id="filterBox" style="display: flex;gap: 5px;">\n                    <select id="dataType" style="text-align: center;min-width: 150px;">\n                        <option value="all" selected>所有</option>\n                        <option value="filter">${f}</option>\n                        <option value="favorite">${y}</option>\n                        <option value="hasDown">${k}</option>\n                        <option value="hasWatch">${C}</option>\n                    </select>\n                    <input id="searchCarNum" type="text" placeholder="搜索番号|演员" style="padding: 4px 5px;">\n                    <a id="clearSearchbtn" class="a-info" style="margin-left: 0">重置</a>\n                </div>\n                <div id="allSelectBox" style="margin-top: 8px;display: none">\n                    <a class="menu-btn multiple-history-deleteBtn" style="background-color:#8c8080; color:white; margin-bottom: 5px;"> <span>✂️ 移除</span> </a>\n                    <a class="menu-btn multiple-history-hasWatchBtn" style="background-color:${_};margin-bottom: 5px">${C}</a>\n                    <a class="menu-btn multiple-history-hasDownBtn" style="background-color:${S};margin-bottom: 5px">${k}</a>\n                    <a class="menu-btn multiple-history-favoriteBtn" style="background-color:${x};margin-bottom: 5px">${w}</a>\n                    <a class="menu-btn multiple-history-filterBtn" style="background-color:${b};margin-bottom: 5px">${v}</a>\n                </div>\n                <div id="table-container" style="margin-top:20px !important; height: calc(100% - 50px); overflow-x:hidden;"></div>\n            </div>\n        `;
        layer.open({
            type: 1,
            title: "鉴定记录",
            content: t,
            scrollbar: !1,
            shadeClose: !0,
            area: utils.getResponsiveArea([ "70%", "90%" ]),
            anim: -1,
            success: async t => {
                await this.loadTableData(), $(".layui-layer-content").on("click", "#clearSearchbtn", (async t => {
                    $("#searchCarNum").val(""), $("#dataType").val("all"), await this.reloadTable(), 
                    $("#allSelectBox").hide();
                })).on("focusout keydown", "#searchCarNum", (async t => {
                    if ("focusout" === t.type || "Enter" === t.key) {
                        if ("Enter" === t.key && t.preventDefault(), "keydown" === t.type && "Enter" !== t.key) return;
                        await this.reloadTable();
                    }
                })).on("click", ".table-link-param", (async t => {
                    let e = $(t.currentTarget);
                    $("#searchCarNum").val(e.text()), await this.reloadTable();
                })).on("change", "#dataType", (async () => {
                    await this.reloadTable();
                }));
            },
            end: () => {
                this.tableObj && (this.tableObj.destroy(), this.tableObj = null), window.refresh();
            }
        });
    }
    async reloadTable() {
        this.tableObj.deselectRow(), this.tableObj.setPage(1);
    }
    bindClick() {
        document.addEventListener("click", (function(t) {
            if (t.target.closest(".sub-btns-toggle")) {
                const e = t.target.closest(".sub-btns").querySelector(".sub-btns-menu");
                document.querySelectorAll(".sub-btns-menu.show").forEach((t => {
                    t !== e && t.classList.remove("show");
                })), e.classList.toggle("show");
            } else document.querySelectorAll(".sub-btns-menu.show").forEach((t => {
                t.classList.remove("show");
            }));
        })), $(document).on("click", ".history-deleteBtn, .history-filterBtn, .history-favoriteBtn, .history-hasDownBtn, .history-hasWatchBtn, .history-detailBtn", (t => {
            t.preventDefault(), t.stopPropagation();
            const e = $(t.currentTarget), n = e.closest(".action-btns"), a = n.attr("data-car-num"), i = n.attr("data-href"), s = async t => {
                await storageManager.saveCar({
                    carNum: a,
                    url: i,
                    names: null,
                    actionType: t
                }), window.refresh(), await this.reloadTable();
            };
            e.hasClass("history-filterBtn") ? utils.q(t, `是否屏蔽${a}?`, (() => s(p))) : e.hasClass("history-favoriteBtn") ? s(g).then() : e.hasClass("history-hasDownBtn") ? s(m).then() : e.hasClass("history-hasWatchBtn") ? s(u).then() : e.hasClass("history-deleteBtn") ? this.handleDelete(t, a) : e.hasClass("history-detailBtn") && this.handleClickDetail(t, {
                carNum: a,
                url: i
            }).then();
        })), $(document).on("click", ".multiple-history-deleteBtn, .multiple-history-filterBtn, .multiple-history-favoriteBtn, .multiple-history-hasDownBtn, .multiple-history-hasWatchBtn", (t => {
            t.preventDefault(), t.stopPropagation();
            const e = $(t.currentTarget);
            let n = this.tableObj.getSelectedData(), a = "", i = "";
            e.hasClass("multiple-history-filterBtn") ? (a = "屏蔽", i = p) : e.hasClass("multiple-history-favoriteBtn") ? (a = "收藏", 
            i = g) : e.hasClass("multiple-history-hasDownBtn") ? (a = "已下载", i = m) : e.hasClass("multiple-history-hasWatchBtn") ? (a = "已观看", 
            i = u) : e.hasClass("multiple-history-deleteBtn") && (a = "移除", i = "delete"), utils.q(t, `当前已勾选${n.length}条数据, 是否全标记为 ${a}?`, (async () => {
                let t = loading();
                try {
                    if ("delete" === i) {
                        const t = n.map((t => t.carNum)), e = await storageManager.batchRemoveCars(t);
                        e > 0 ? show.ok(`已成功删除 ${e} 个番号`) : !1 === e && show.error("提供的番号中没有一个存在于列表中。");
                    } else {
                        const t = JSON.parse(JSON.stringify(n));
                        t.forEach((t => {
                            t.actionType = i;
                        })), await storageManager.saveCarList(t), show.ok("操作成功");
                    }
                    this.tableObj.deselectRow(), this.reloadTable().then();
                } catch (e) {
                    console.error(e);
                } finally {
                    t.close();
                }
            }));
        }));
    }
    async getDataList(t, e, n) {
        let a = await storageManager.getCarList();
        this.allCount = a.length, this.filterCount = 0, this.favoriteCount = 0, this.hasDownCount = 0, 
        this.hasWatchCount = 0, a.forEach((t => {
            switch (t.status) {
              case p:
                this.filterCount++;
                break;

              case g:
                this.favoriteCount++;
                break;

              case m:
                this.hasDownCount++;
                break;

              case u:
                this.hasWatchCount++;
            }
        })), $('#dataType option[value="all"]').text(`所有 (${this.allCount})`), $('#dataType option[value="filter"]').text(`${f} (${this.filterCount})`), 
        $('#dataType option[value="favorite"]').text(`${y} (${this.favoriteCount})`), $('#dataType option[value="hasDown"]').text(`${k} (${this.hasDownCount})`), 
        $('#dataType option[value="hasWatch"]').text(`${C} (${this.hasWatchCount})`);
        const i = $("#dataType").val();
        let s = "all" === i ? a : a.filter((t => t.status === i));
        const o = $("#searchCarNum").val().trim();
        if (o) {
            let t = o.toLowerCase().replace("-c", "").replace("-uc", "").replace("-4k", "");
            s = s.filter((e => {
                const n = e.carNum.toLowerCase().includes(t);
                const a = (e.names ? e.names : "").toLowerCase().includes(t);
                return n || a;
            }));
        }
        if (n && n.length > 0) {
            const t = n[0], e = t.field, a = t.dir;
            s.sort(((t, n) => {
                const i = t[e], s = n[e], o = null == i || "" === i, r = null == s || "" === s;
                return o && !r ? 1 : !o && r ? -1 : o && r ? 0 : i < s ? "asc" === a ? -1 : 1 : i > s ? "asc" === a ? 1 : -1 : 0;
            }));
        }
        const r = s.length, l = Math.ceil(r / e), c = (t - 1) * e, d = c + e;
        return s = s.slice(c, d), {
            maxPage: l,
            dataList: s,
            totalCount: r
        };
    }
    async loadTableData() {
        this.tableObj = new Tabulator("#table-container", {
            layout: "fitColumns",
            placeholder: "暂无数据",
            virtualDom: !0,
            pagination: !0,
            paginationMode: "remote",
            sortMode: "remote",
            ajaxURL: "queryRealm",
            dataLoader: !1,
            ajaxRequestFunc: async (t, e, n) => {
                const a = n.page, i = n.size, s = n.sort;
                return await this.getDataList(a, i, s);
            },
            dataReceiveParams: {
                last_page: "maxPage",
                last_row: "totalCount",
                data: "dataList"
            },
            paginationSize: 50,
            paginationSizeSelector: [ 50, 100, 1e3, 99999 ],
            paginationCounter: (t, e, n, a, i) => `共 ${a} 条记录`,
            responsiveLayout: "collapse",
            responsiveLayoutCollapse: !0,
            columnDefaults: {
                headerHozAlign: "center",
                hozAlign: "center"
            },
            selectableRowsPersistence: !1,
            index: "carNum",
            columns: [ {
                formatter: "rowSelection",
                titleFormatter: "rowSelection",
                hozAlign: "center",
                headerSort: !1,
                responsive: 0,
                width: 40,
                titleFormatterParams: {
                    rowRange: "active"
                },
                cellClick: (t, e) => {
                    e.getRow().toggleSelect();
                }
            }, {
                title: "番号",
                field: "carNum",
                width: 120,
                sorter: "string",
                responsive: 0,
                formatter: (t, e, n) => {
                    const a = t.getData().carNum, i = a.indexOf("-");
                    if (-1 === i) return a;
                    return `<a class="table-link-param">${a.substring(0, i + 1)}</a>${a.substring(i + 1)}`;
                }
            }, {
                title: "演员",
                field: "names",
                minWidth: 200,
                sorter: "string",
                responsive: 5,
                headerSort: !0,
                formatter: (t, e, n) => (t.getData().names || "").split(" ").filter((t => "" !== t.trim())).map((t => `<a class="table-link-param">${t}</a>`)).join(" ")
            }, {
                title: "创建时间",
                field: "createDate",
                width: 170,
                sorter: "string",
                responsive: 4
            }, {
                title: "修改时间",
                field: "updateDate",
                width: 170,
                sorter: "string",
                responsive: 4
            }, {
                title: "发行时间",
                field: "publishTime",
                width: 170,
                sorter: "string",
                responsive: 4
            }, {
                title: "来源",
                field: "url",
                width: 80,
                sorter: "string",
                responsive: 5,
                hozAlign: "left",
                formatter: (t, e, n) => {
                    let a = t.getData().url;
                    return a ? a.includes("javdb") ? '<span style="color:#d34f9e">Javdb</span>' : a.includes("javbus") ? '<span style="color:#eaa813">JavBus</span>' : a.includes("123av") ? '<span style="color:#eaa813">123Av</span>' : `<span style="color:#050505">${a}</span>` : "";
                }
            }, {
                title: "状态",
                field: "status",
                width: 100,
                sorter: "string",
                responsive: 1,
                headerSort: !1,
                formatter: (t, e, n) => {
                    const a = t.getData().status;
                    let i = "", s = "";
                    switch (a) {
                      case "filter":
                        i = b, s = v;
                        break;

                      case "favorite":
                        i = x, s = w;
                        break;

                      case "hasDown":
                        i = S, s = k;
                        break;

                      case "hasWatch":
                        i = _, s = C;
                        break;

                      default:
                        s = a;
                    }
                    return `<span style="color:${i}">${s}</span>`;
                }
            }, {
                title: "备注",
                field: "remark",
                width: 100,
                sorter: "string",
                responsive: 6
            }, {
                title: "操作",
                sorter: "string",
                minWidth: 150,
                cssClass: "action-cell-dropdown",
                responsive: 0,
                headerSort: !1,
                formatter: (t, e, n) => {
                    const a = t.getData();
                    return n((() => {
                        var e;
                        null == (e = t.getElement().querySelector(".history-editBtn")) || e.addEventListener("click", (t => {
                            this.editRecord(a);
                        }));
                    })), `\n                            <div class="action-btns" style="display: flex; gap: 5px;justify-content:center" data-car-num="${a.carNum}" data-href="${a.url ? a.url : ""}">\n                                <div class="sub-btns">\n                                    <a class="menu-btn sub-btns-toggle" style="background-color:#c59d36; color:white; margin-bottom: 5px;">\n                                        <span>✏️ 变更</span>\n                                    </a>\n                                    <div class="sub-btns-menu">\n                                        <a class="menu-btn history-editBtn" style="background-color:#007bff; color:white; margin-bottom: 5px;"> <span>✏️ 编辑</span> </a>\n                                        <a class="menu-btn history-deleteBtn" style="background-color:#8c8080; color:white; margin-bottom: 5px;"> <span>✂️ 移除</span> </a>\n                                        <a class="menu-btn history-hasWatchBtn" style="background-color:${_};margin-bottom: 5px">${C}</a>\n                                        <a class="menu-btn history-hasDownBtn" style="background-color:${S};margin-bottom: 5px">${k}</a>\n                                        <a class="menu-btn history-favoriteBtn" style="background-color:${x};margin-bottom: 5px">${w}</a>\n                                        <a class="menu-btn history-filterBtn" style="background-color:${b};margin-bottom: 5px">${v}</a>\n                                    </div>\n                                </div>\n                                \n                                <a class="menu-btn history-detailBtn" style="background-color:#3397de; color:white; margin-bottom: 5px;"> <span>📄 详情页</span> </a>\n                                \n                            </div>\n                        `;
                }
            } ],
            initialSort: [ {
                column: "updateDate",
                dir: "desc"
            } ],
            locale: "zh-cn",
            langs: {
                "zh-cn": {
                    pagination: {
                        first: "首页",
                        first_title: "首页",
                        last: "尾页",
                        last_title: "尾页",
                        prev: "上一页",
                        prev_title: "上一页",
                        next: "下一页",
                        next_title: "下一页",
                        all: "所有",
                        page_size: "每页行数"
                    }
                }
            }
        }), this.tableObj.on("rowSelectionChanged", ((t, e, n, a) => {
            const i = $("#allSelectBox"), s = $("#filterBox");
            t && t.length > 0 ? (s.hide(), i.show()) : (s.show(), i.hide());
        })), this.tableObj.on("rowDblClick", (function(t, e) {
            e.toggleSelect();
        })), this.tableObj.on("tableBuilt", (async () => {}));
    }
    handleDelete(t, e) {
        utils.q(t, `是否移除${e}?`, (async () => {
            await storageManager.removeCar(e), this.reloadTable().then();
        }));
    }
    async handleClickDetail(t, e) {
        if (c) if (e.carNum.includes("FC2-")) {
            const t = this.parseMovieId(e.url);
            this.getBean("Fc2Plugin").openFc2Dialog(t, e.carNum, e.url);
        } else {
            if (!e.url) return void window.open("/search?q=" + e.carNum, "_blank");
            utils.openPage(e.url, e.carNum, !1, t);
        }
        if (d) {
            let n = e.url;
            if (n.includes("javdb")) if (e.carNum.includes("FC2-")) {
                const t = this.parseMovieId(n);
                await this.getBean("Fc2Plugin").openFc2Page(t, e.carNum, n);
            } else window.open(n, "_blank"); else utils.openPage(e.url, e.carNum, !1, t);
        }
    }
    async editRecord(t) {
        const e = t.carNum, n = t.names || "", a = t.url || "", i = t.status, s = t.remark || "", o = "width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; min-height: 60px; overflow-y: hidden;", r = "width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;", l = [ {
            value: p,
            text: v
        }, {
            value: g,
            text: w
        }, {
            value: m,
            text: k
        }, {
            value: u,
            text: C
        } ];
        console.log(l);
        const c = `\n            <div style="padding: 20px;">\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">番号:</label>\n                    <input type="text" id="edit-carNum" value="${e}" style="${r} background-color: #f0f0f0;" readonly>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">演员 (用空格隔开):</label>\n                    <textarea id="edit-names" style="${o}">${n}</textarea>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">状态:</label>\n                    <select id="edit-status" style="width: 100%; padding: 10px; border: 1px solid #ddd;">\n                        <option value="" ${"" === i ? "selected" : ""}>-- 请选择 --</option>\n                        ${l.map((t => `\n                            <option value="${t.value}" ${i === t.value ? "selected" : ""}>${t.text}</option>\n                        `)).join("")}\n                    </select>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">链接:</label>\n                    <input type="text" id="edit-url" value="${a}" style="${r}">\n                </div>\n                \n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">备注:</label>\n                    <textarea id="edit-remark" style="${o}">${s}</textarea>\n                </div>\n            </div>\n        `;
        layer.open({
            type: 1,
            title: `编辑记录: ${e}`,
            area: [ "500px", "650px" ],
            content: c,
            btn: [ "保存", "取消" ],
            success: (t, e) => {
                const n = t => {
                    t.css("height", "auto"), t.css("height", t[0].scrollHeight + 15 + "px");
                }, a = $("#edit-names");
                a.on("input", (function() {
                    n($(this));
                })), n(a);
                const i = $("#edit-remark");
                i.on("input", (function() {
                    n($(this));
                })), n(i);
            },
            yes: async e => {
                const n = $("#edit-names").val().trim(), a = $("#edit-status").val(), i = $("#edit-url").val().trim(), s = $("#edit-remark").val().trim(), o = {
                    ...t,
                    names: n,
                    actionType: a,
                    url: i,
                    remark: s
                };
                await storageManager.updateCarInfo(o), this.tableObj.setData(), layer.close(e);
            }
        });
    }
}

class yt extends G {
    constructor() {
        super(...arguments), o(this, "floorIndex", 1), o(this, "isInit", !1);
    }
    getName() {
        return "ReviewPlugin";
    }
    async handle() {
        if ($(document).on("click", ".down-115", (async t => {
            const e = $(t.currentTarget).data("magnet");
            let n = loading();
            try {
                await this.getBean("WangPan115TaskPlugin").handleAddTask(e);
            } catch (a) {
                show.error("发生错误:" + a), console.error(a);
            } finally {
                n.close();
            }
        })), window.isDetailPage) {
            if (c) {
                const t = this.parseMovieId(window.location.href);
                await this.showReview(t), await this.getBean("RelatedPlugin").showRelated($("#magnets-content"), t);
            }
            if (d) {
                let t = this.getPageInfo().carNum;
                const e = await R.searchMovie(t);
                let n = null;
                for (let a = 0; a < e.length; a++) {
                    let i = e[a];
                    if (i.number.toLowerCase() === t.toLowerCase()) {
                        n = i.id;
                        break;
                    }
                }
                if (!n) return;
                this.showReview(n, $("#sample-waterfall")).then();
            }
        }
    }
    async showReview(t, e) {
        const n = await storageManager.getSetting("enableLoadReview", I), a = e || $("#magnets-content");
        a.append(`\n            <div style="display: flex; align-items: center; margin: 16px 0; color: #666; font-size: 14px;">\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n                <span style="padding: 0 10px;" data-tip="想要发表评论? 滑上去, 点击上面的按钮-看过">❓ 评论区</span>\n                <a id="reviewsFold" style="margin-left: 8px; color: #1890ff; text-decoration: none; display: flex; align-items: center;">\n                    <span class="toggle-text">${n === I ? "折叠" : "展开"}</span>\n                    <span class="toggle-icon" style="margin-left: 4px;">${n === I ? "▲" : "▼"}</span>\n                </a>\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n            </div>\n        `), 
        $("#reviewsFold").on("click", (e => {
            e.preventDefault(), e.stopPropagation();
            const n = $("#reviewsFold .toggle-text"), a = $("#reviewsFold .toggle-icon"), i = "展开" === n.text();
            n.text(i ? "折叠" : "展开"), a.text(i ? "▲" : "▼"), i ? ($("#reviewsContainer").show(), 
            $("#reviewsFooter").show(), this.isInit || (this.fetchAndDisplayReviews(t), this.isInit = !0), 
            storageManager.saveSettingItem("enableLoadReview", I)) : ($("#reviewsContainer").hide(), 
            $("#reviewsFooter").hide(), storageManager.saveSettingItem("enableLoadReview", T));
        })), a.append('<div id="reviewsContainer"></div>'), a.append('<div id="reviewsFooter"></div>'), 
        n === I && await this.fetchAndDisplayReviews(t);
    }
    async fetchAndDisplayReviews(t) {
        const e = $("#reviewsContainer"), n = $("#reviewsFooter");
        e.append('<div id="reviewsLoading" style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">获取评论中...</div>');
        const a = await storageManager.getSetting("reviewCount", 20);
        let i = null;
        try {
            i = await R.getReviews(t, 1, a);
        } catch (o) {
            o.toString().includes("簽名已過期") && show.error("生成签名失败, 请检查系统时间及时区是否正确!"), clog.error("获取评论失败:", o), 
            console.error("获取评论失败:", o);
        } finally {
            $("#reviewsLoading").remove();
        }
        if (!i) return e.append('\n                <div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">\n                    获取评论失败\n                    <a id="retryFetchReviews" href="javascript:;" style="margin-left: 10px; color: #1890ff; text-decoration: none;">重试</a>\n                </div>\n            '), 
        void $("#retryFetchReviews").on("click", (async () => {
            $("#retryFetchReviews").parent().remove(), await this.fetchAndDisplayReviews(t);
        }));
        if (0 === i.length) return void e.append('<div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">无评论</div>');
        const s = await storageManager.getReviewFilterKeywordList();
        if (this.displayReviews(i, e, s), i.length === a) {
            n.html('\n                <button id="loadMoreReviews" style="width:100%; background-color: #e1f5fe; border:none; padding:10px; margin-top:10px; cursor:pointer; color:#0277bd; font-weight:bold; border-radius:4px;">\n                    加载更多评论\n                </button>\n                <div id="reviewsEnd" style="display:none; text-align:center; padding:10px; color:#666; margin-top:10px;">已加载全部评论</div>\n            ');
            let i = 1, r = $("#loadMoreReviews");
            r.on("click", (async () => {
                let n;
                r.text("加载中...").prop("disabled", !0), i++;
                try {
                    n = await R.getReviews(t, i, a);
                } catch (o) {
                    console.error("加载更多评论失败:", o);
                } finally {
                    r.text("加载失败, 请点击重试").prop("disabled", !1);
                }
                n && (this.displayReviews(n, e, s), n.length < a ? (r.remove(), $("#reviewsEnd").show()) : r.text("加载更多评论").prop("disabled", !1));
            }));
        } else n.html('<div style="text-align:center; padding:10px; color:#666; margin-top:10px;">已加载全部评论</div>');
    }
    displayReviews(t, e, n) {
        t.length && (t.forEach((t => {
            if (n.some((e => t.content.includes(e)))) return;
            const a = Array(t.score).fill('<i class="icon-star"></i>').join(""), i = t.content.replace(/ed2k:\/\/\|file\|[^|]+\|\d+\|[a-fA-F0-9]{32}\|\/|magnet:\?[^\s"'<>`\u4e00-\u9fa5，。？！（）【】]+|https?:\/\/[^\s"'<>`\u4e00-\u9fa5，。？！（）【】]+/g, (t => t.startsWith("ed2k://") ? `\n                            <span style="word-break: break-all;background: #e0f2fe;color: #0369a1;">${t}</span>\n                            <button class="button is-info down-115" data-magnet="${t}" style="font-size: 11px">115离线下载</button>\n                        ` : t.startsWith("magnet:") ? `\n                            <a href="${t}" class="a-primary" style="padding:0; word-break: break-all; white-space: pre-wrap;" target="_blank" rel="noopener noreferrer">${t}</a>\n                            <button class="button is-info down-115" data-magnet="${t}" style="font-size: 11px">115离线下载</button>\n                        ` : t.startsWith("http://") || t.startsWith("https://") ? `\n                            <a href="${t}" class="a-primary" style="padding:0; word-break: break-all; white-space: pre-wrap;" target="_blank" rel="noopener noreferrer">${t}</a>\n                        ` : t)), s = `\n                <div class="item columns is-desktop" style="display:block;margin-top:6px;background-color:#ffffff;padding:10px;margin-left: -10px;word-break: break-word;position:relative;">\n                    <span style="position:absolute;top:5px;right:10px;color:#999;font-size:12px;">#${this.floorIndex++}楼</span>\n                    ${t.username} &nbsp;&nbsp; <span class="score-stars">${a}</span> \n                    <span class="time">${utils.formatDate(t.created_at)}</span> \n                    &nbsp;&nbsp; 点赞:${t.likes_count}\n                    <p class="review-content" style="margin-top: 5px;"> ${i} </p>\n                </div>\n            `;
            e.append(s);
        })), this.rightClickFilter());
    }
    async rightClickFilter() {
        await storageManager.getSetting("enableTitleSelectFilter", I) === I && utils.rightClick(document.body, ".review-content", (async t => {
            const e = window.getSelection().toString();
            e && (t.preventDefault(), await utils.q(t, `是否将 '${e}' 加入评论区关键词?`, (async () => {
                await storageManager.saveReviewFilterKeyword(e), show.ok("操作成功, 刷新页面后生效");
            })));
        }));
    }
}

class xt extends G {
    getName() {
        return "FilterTitleKeywordPlugin";
    }
    async handle() {
        if (!isDetailPage && !isFc2Page) return;
        if (await storageManager.getSetting("enableTitleSelectFilter", I) !== I) return;
        let t;
        c ? t = ".title strong, .current-title" : d && (t = "h3"), utils.rightClick(document.body, t, (t => {
            const e = window.getSelection().toString();
            if (e) {
                t.preventDefault();
                let n = {
                    clientX: t.clientX,
                    clientY: t.clientY + 80
                };
                utils.q(n, `是否屏蔽标题关键词 ${e}?`, (async () => {
                    await storageManager.saveTitleFilterKeyword(e), window.refresh(), utils.closePage();
                }));
            }
        }));
    }
}

const $t = {
    p: "可播放",
    s: "單體作品",
    d: "含磁鏈",
    c: "含字幕",
    1: "高中女生",
    2: "其他戀物癖",
    3: "眼鏡",
    4: "制服外套",
    5: "美少女",
    6: "白人",
    7: "處女",
    8: "精選綜合",
    9: "國外進口",
    10: "4小時以上作品",
    11: "戲劇",
    12: "成人電影",
    13: "性愛",
    14: "乳交",
    15: "熟女",
    16: "婆婆",
    17: "巨乳",
    18: "中出",
    19: "蘿莉塔",
    20: "已婚婦女",
    21: "凌辱",
    22: "無毛",
    23: "淫亂真實",
    24: "多P",
    25: "69",
    26: "介紹影片",
    27: "藝人",
    28: "單體作品",
    29: "捆綁",
    30: "女大學生",
    31: "緊縛",
    32: "偶像",
    33: "學校作品",
    34: "妄想",
    36: "淫語",
    37: "女上位",
    38: "自慰",
    39: "跳蛋",
    41: "輪姦",
    42: "放尿",
    43: "角色扮演",
    44: "姐姐",
    45: "第一人稱攝影",
    46: "顏射",
    47: "各種職業",
    48: "蕩婦",
    49: "內衣",
    50: "玩具",
    51: "出軌",
    52: "強姦",
    53: "監禁",
    54: "亂倫",
    55: "母親",
    56: "溫泉",
    57: "美臀",
    58: "制服",
    60: "SM",
    61: "足交",
    62: "高挑",
    63: "M男",
    64: "女同性戀",
    65: "苗條",
    66: "戶外",
    67: "辣妹",
    68: "潮吹",
    69: "按摩",
    70: "妓女",
    71: "乳液",
    72: "口交",
    73: "舔陰",
    74: "肛門・肛交",
    75: "跳舞",
    76: "按摩棒",
    77: "手指插入",
    78: "水手服",
    79: "羞恥",
    80: "首次亮相",
    81: "吞精",
    82: "明星臉",
    83: "薄馬賽克",
    84: "泳裝",
    85: "數位馬賽克",
    86: "企畫",
    87: "投稿",
    88: "業餘",
    89: "裸體圍裙",
    90: "女優按摩棒",
    91: "美乳",
    92: "孕婦",
    93: "拘束",
    94: "調教",
    95: "和服，喪服",
    96: "女忍者",
    97: "紀錄片",
    98: "巨大陰莖",
    99: "身體意識",
    100: "母乳",
    101: "新娘，年輕妻子",
    102: "手淫",
    103: "戀物癖",
    104: "胖女人",
    105: "大小姐",
    106: "連褲襪",
    107: "戀腿癖",
    108: "秘書",
    109: "戀乳癖",
    110: "濫交",
    111: "惡作劇",
    112: "獵豔",
    113: "女傭",
    114: "OL",
    115: "護士",
    116: "貓耳女",
    117: "去背影片",
    118: "角色扮演者",
    120: "插入異物",
    121: "獨立製作",
    123: "深喉",
    124: "接吻",
    125: "短裙",
    126: "學校泳裝",
    127: "運動短褲",
    128: "運動",
    129: "迷你裙",
    130: "倒追",
    131: "大屁股",
    132: "女同接吻",
    133: "賽車女郎",
    134: "瘦小身型",
    135: "美容院",
    136: "家教",
    137: "黑人演員",
    138: "灌腸",
    139: "妹妹",
    140: "寡婦",
    141: "拳交",
    142: "女醫生",
    143: "浴衣",
    144: "老闆娘，女主人",
    145: "偷窺",
    146: "平胸",
    147: "變性者",
    148: "主觀視角",
    149: "奴隸",
    150: "戰鬥行動",
    151: "女戰士",
    152: "特效",
    153: "女主播",
    154: "校服",
    155: "藥物",
    156: "猥褻穿著",
    157: "白天出軌",
    158: "女教師",
    159: "露出",
    160: "流汗",
    161: "16小時以上作品",
    162: "性騷擾",
    163: "其他學生",
    164: "故事集",
    165: "洗澡",
    166: "肌肉",
    168: "局部特寫",
    169: "模特兒",
    170: "立即口交",
    171: "汽車性愛",
    172: "格鬥家",
    173: "情侶",
    175: "經典",
    176: "催眠",
    177: "緊身衣",
    178: "戀愛",
    179: "鴨嘴",
    180: "糞便",
    181: "娃娃",
    182: "蘿莉角色扮演",
    184: "爛醉如泥的",
    185: "魔鬼系",
    187: "處男",
    188: "展場女孩",
    189: "重印版",
    190: "禮儀小姐",
    191: "歷史劇",
    192: "女裝人妖",
    194: "寫真偶像",
    195: "飲尿",
    196: "殘忍畫面",
    197: "騎乗位",
    198: "絲襪、過膝襪",
    199: "泡泡襪",
    200: "性感的",
    201: "女檢察官",
    202: "排便",
    203: "空中小姐",
    204: "講師",
    206: "曬黑",
    207: "旗袍",
    209: "食糞",
    211: "雙性人",
    212: "VR",
    213: "感謝祭",
    216: "兔女郎",
    217: "超乳",
    218: "全裸",
    221: "正太控",
    223: "女祭司",
    224: "服務生",
    225: "脫衣",
    227: "3D",
    230: "動畫人物",
    232: "子宮頸",
    233: "伴侶",
    234: "觸手",
    236: "給女性觀眾",
    237: "車掌小姐",
    238: "原作改編",
    242: "訪問",
    243: "正常",
    244: "奇異的",
    245: "女兒",
    246: "年輕女孩",
    248: "迷你裙警察",
    249: "蠻橫嬌羞",
    250: "教學",
    253: "恐怖",
    254: "西洋片",
    258: "性轉換·女體化",
    264: "公主",
    265: "童年朋友",
    266: "科幻",
    267: "行動",
    270: "修女",
    271: "綜合短篇",
    273: "滑稽模仿",
    274: "飛特族",
    277: "男同性戀",
    280: "男性",
    282: "亞洲女演員",
    284: "冒險",
    285: "模擬",
    291: "韓國",
    292: "愛好，文化",
    293: "偷窺",
    296: "懸疑",
    297: "COSPLAY服飾",
    300: "形象俱樂部",
    305: "友誼",
    311: "R-15",
    312: "美少女電影",
    314: "感官作品",
    315: "導尿",
    316: "亞洲",
    318: "暗黑系",
    323: "天賦",
    325: "觸摸打字",
    330: "素人作品",
    335: "HDTV",
    338: "素人",
    339: "美腳",
    340: "剃毛",
    341: "痴漢",
    342: "二穴同入",
    343: "被外國人幹",
    344: "刺青紋身",
    345: "無碼流出",
    346: "蒙面・面罩",
    347: "4K",
    348: "無碼破解",
    349: "黑白配",
    350: "唾液敷面",
    351: "綜藝",
    352: "高跟鞋",
    353: "乳釘、穿孔、乳環",
    354: "兩女一男",
    355: "兩男兩女",
    356: "兩男一女",
    357: "口球",
    358: "靴子",
    360: "絕頂高潮",
    361: "運動",
    362: "純欲",
    363: "御宅族",
    364: "輔助自慰",
    365: "老太婆",
    366: "老年男性",
    367: "心理驚悚",
    368: "打屁股",
    369: "夫妻交換",
    370: "養尊處優",
    371: "拉拉隊",
    372: "假陽具",
    373: "約會",
    374: "不穿內褲",
    375: "不穿胸罩",
    376: "後入",
    377: "媽媽的朋友",
    378: "瑜伽·健身",
    379: "白眼失神",
    380: "鼻鉤",
    381: "共演",
    382: "蠟燭",
    383: "養女",
    384: "女王",
    385: "搔癢",
    386: "經歷告白",
    387: "濕身",
    388: "多毛",
    389: "站立後入",
    2001: "2001",
    2002: "2002",
    2003: "2003",
    2004: "2004",
    2005: "2005",
    2006: "2006",
    2007: "2007",
    2008: "2008",
    2009: "2009",
    2010: "2010",
    2011: "2011",
    2012: "2012",
    2013: "2013",
    2014: "2014",
    2015: "2015",
    2016: "2016",
    2017: "2017",
    2018: "2018",
    2019: "2019",
    2020: "2020",
    2021: "2021",
    2022: "2022",
    2023: "2023",
    2024: "2024",
    2025: "2025",
    "lt-45": "45分鍾以內",
    "45-90": "45-90分鍾",
    "90-120": "90-120分鍾",
    "gt-120": "120分鍾以上"
};

class kt extends G {
    getName() {
        return "BlacklistPlugin";
    }
    async addBlacklist(t) {
        let e = {
            clientX: t.clientX,
            clientY: t.clientY + 80
        };
        const n = $("#addBlacklistBtn span").text().includes("已加入");
        let a, i;
        if (l.includes("/tags")) {
            const t = new URL(l);
            t.searchParams.delete("page");
            const e = $("#jhs-check-tag").text().trim();
            a = {
                starId: "no-" + e,
                name: "虚拟演员-" + e,
                allName: [ "虚拟演员" ],
                role: "虚拟演员",
                movieType: "虚拟演员",
                blacklistUrl: t.toString()
            }, i = `是否将分类 <span style="color: #f40">${e}</span> 加入到黑名单中?`, n && (i = `分类 <span style="color: #f40">${e}</span> 已在黑名单中, 是否从当前页开始追加屏蔽?`);
        } else a = this.getActressPageInfo(), i = `是否将该演员 <span style="color: #f40">${a.name}</span> 加入到黑名单中?`, 
        n && (i = `演员 <span style="color: #f40">${a.name}</span> 已在黑名单中, 是否从当前页开始追加屏蔽?`);
        const {starId: s, name: o, allName: r, role: c, movieType: h, blacklistUrl: p} = a;
        if (l.includes("page") && !l.includes("page=1") && (i += "<br/> 注意: 当前页面非第一页, 屏蔽数据将从此页面开始"), 
        d) {
            const t = l.split("/star/")[1].split("/");
            if (t.length > 1) {
                parseInt(t[1]) > 1 && (i += "<br/> 注意: 当前页面非第一页, 屏蔽数据将从此页面开始");
            }
        }
        utils.q(e, i, (async () => {
            const t = this.getBean("TaskPlugin");
            navigator.locks.request(t.singleTaskKey, {
                ifAvailable: !0
            }, (async t => {
                if (t) {
                    this.loadObj = loading();
                    try {
                        await storageManager.addBlacklistItem({
                            starId: s,
                            name: o,
                            allName: r,
                            role: c,
                            movieType: h,
                            url: p
                        }), await this.filterActorVideo(o, s);
                        const t = show.ok(`屏蔽结束,是否跳转到最后一页: ${this.lastPageLink || "无"}`, {
                            duration: -1,
                            close: !0,
                            onClick: () => {
                                t.closeShow(), this.lastPageLink && (window.location.href = this.lastPageLink);
                            }
                        });
                    } catch (e) {
                        clog.error(e);
                        const t = show.error("发生错误, 是否填转到解析失败的那一页? (点击并跳转)", {
                            duration: -1,
                            close: !0,
                            onClick: () => {
                                t.closeShow(), window.location.href = this.nextPageLink;
                            }
                        });
                    } finally {
                        this.loadObj.close();
                    }
                } else show.error("当前有定时任务在后台执行中, 无法发起此操作");
            })).catch((t => {
                console.error("锁任务出现错误:", t), clog.error("锁任务出现错误:", t);
            }));
        }));
    }
    async resetBtnTip() {
        const t = this.getBean("TaskPlugin"), e = localStorage.getItem(t.lastCheckBlacklistTimeKey) || "无", n = await storageManager.getSetting("checkBlacklist_intervalTime", 12);
        this.checkBlacklist_ruleTime = await storageManager.getSetting("checkBlacklist_ruleTime", 8760), 
        $("#checkBlacklistBtn").attr("data-tip", `上次检测时间: ${e}; 检测间隔时间: ${n}小时`);
    }
    async openBlacklistDialog() {
        const t = this.getBean("TaskPlugin"), e = await storageManager.getSetting();
        let n = `\n            <div style="padding: 10px 20px; height: 100%;overflow:hidden;"> \n                 <div style="display: flex;justify-content: space-between;">\n                    <div style="display: flex; gap:5px">\n                        <a id="checkBlacklistBtn" class="a-danger" data-tip="上次检测时间: ${localStorage.getItem(t.lastCheckBlacklistTimeKey) || "无"}; 检测间隔时间: ${e.checkBlacklist_intervalTime}小时">${this.blacklistSvg} &nbsp;手动检测黑名单</a>\n                        <a class="a-warning" id="clearKeywordBlacklist" data-tip="检测黑名单番号数据列表, 是否包含标题关键词">${this.removeSvg} &nbsp;&nbsp; 清理数据</a>\n                        <a class="a-info" id="toSetting">${this.settingSvg} &nbsp;&nbsp; 配置</a>\n                    </div>\n                    <div style="display: flex; gap:5px">\n                        <select id="dataType" style="text-align: center;min-width: 150px;">\n                            <option value="" selected>所有</option>\n                            <option value="actor">男演员</option>\n                            <option value="actress">女演员</option>\n                            <option value="虚拟演员">虚拟演员</option>\n                        </select>\n                        <select id="statusType" style="text-align: center;min-width: 150px;">\n                            <option value="" selected>--检测状态--</option>\n                            <option value="normal">正常检测</option>\n                            <option value="stop">停止检测</option>\n                        </select>\n                        <select id="urlType" data-tip="在演员页屏蔽时,是否选择了分类" style="text-align: center;min-width: 150px; ${c ? "" : "display: none;"}">\n                            <option value="" selected>--屏蔽类型--</option>\n                            <option value="hasT">按所选分类屏蔽</option>\n                            <option value="noT">所有分类</option>\n                        </select>\n                        <input id="searchValue" type="text" placeholder="搜索演员" style="padding: 4px 5px;">\n                        <a id="cleanQueryBtn" class="a-info" style="margin-left: 0">重置</a>\n                    </div>\n\n                 </div>\n                 <div id="table-container" style="margin-top:20px !important; height: calc(100% - 50px);"></div>\n            </div>\n        `;
        layer.open({
            type: 1,
            title: "演员黑名单",
            content: n,
            scrollbar: !1,
            area: utils.getResponsiveArea([ "80%", "90%" ]),
            anim: -1,
            success: async e => {
                await this.loadTableData(), $(".layui-layer-content").on("click", "#cleanQueryBtn", (async t => {
                    $("#searchValue").val(""), $("#dataType").val(""), $("#statusType").val(""), await this.reloadTable();
                })).on("focusout keydown", "#searchValue", (async t => {
                    if ("focusout" === t.type || "Enter" === t.key) {
                        if ("Enter" === t.key && t.preventDefault(), "keydown" === t.type && "Enter" !== t.key) return;
                        $("#dataType").val(""), await this.reloadTable();
                    }
                })).on("change", "#dataType", (async () => {
                    $("#searchValue").val(""), await this.reloadTable();
                })).on("change", "#statusType", (async () => {
                    await this.reloadTable();
                })).on("change", "#urlType", (async () => {
                    await this.reloadTable();
                })).on("click", "#toSetting", (() => {
                    this.getBean("SettingPlugin").openSettingDialog("task-panel", (() => {
                        $("#setting-blacklist").css({
                            border: "1px solid #f40"
                        });
                    }));
                })).on("click", "#clearKeywordBlacklist", (async () => {
                    await this.clearKeywordBlacklist();
                })).on("click", ".open-url", (t => {
                    t.preventDefault();
                    const e = $(t.currentTarget), n = e.attr("data-url"), a = e.attr("data-name");
                    utils.openPage(n, a, !0, t);
                })).on("click", "#checkBlacklistBtn", (e => {
                    utils.q({
                        clientX: e.clientX,
                        clientY: e.clientY + 20
                    }, "是否手动检测黑名单?", (() => {
                        navigator.locks.request(t.singleTaskKey, {
                            ifAvailable: !0
                        }, (async e => {
                            e ? (await t.loadConfig(), await t.checkBlacklist(!0)) : show.error("当前有定时任务在后台执行中, 无法发起手动任务");
                        })).catch((t => {
                            console.error("锁任务出现错误:", t), clog.error("锁任务出现错误:", t);
                        }));
                    }));
                }));
            },
            end: () => {
                this.tableObj && (this.tableObj.destroy(), this.tableObj = null), window.refresh();
            }
        });
    }
    async reloadTable() {
        if (!this.tableObj) return;
        const t = await this.getTableData();
        this.tableObj.setData(t);
    }
    async getTableData() {
        const t = this.getBean("TaskPlugin"), e = await storageManager.getBlacklist(), n = await storageManager.getBlacklistCarList(), a = $("#searchValue").val(), i = $("#statusType").val(), s = $("#dataType"), o = s.val(), r = $("#urlType").val(), l = e.length;
        let c = 0, d = 0, h = 0;
        const p = e.map((e => {
            e.role === D ? c++ : e.role === L ? d++ : "虚拟演员" === e.role && h++;
            let n = !1;
            return e.lastPublishTime && (n = !t.isUnnecessaryCheck(e.lastPublishTime, this.checkBlacklist_ruleTime)), 
            {
                ...e,
                isUnCheck: n
            };
        })).filter((t => !(a && !t.name.includes(a)) && (("normal" !== i || !t.isUnCheck) && (!("stop" === i && !t.isUnCheck) && (o ? t.role === o : !("hasT" === r && !t.url.includes("t=") && !t.url.includes("/tags")) && ("noT" !== r || !t.url.includes("t=") && !t.url.includes("/tags")))))));
        s.html(`\n            <option value="">所有 (${l})</option>\n            <option value="actor">男演员 (${c})</option>\n            <option value="actress">女演员 (${d})</option>\n            <option value="虚拟演员">虚拟演员 (${h})</option>\n        `), 
        s.val(o);
        const g = new Map;
        for (const u of n) {
            const t = u.starId;
            g.has(t) || g.set(t, []), g.get(t).push(u);
        }
        const m = p.map((t => {
            const e = t.starId, n = g.get(e) || [];
            return {
                ...t,
                carList: n,
                count: n.length
            };
        }));
        return this.currentCarCount = m.reduce(((t, e) => t + (e.count || 0)), 0), m;
    }
    async loadTableData() {
        this.checkBlacklist_ruleTime = await storageManager.getSetting("checkBlacklist_ruleTime") || 8760;
        const t = await this.getTableData();
        this.tableObj = new Tabulator("#table-container", {
            layout: "fitColumns",
            placeholder: "暂无数据",
            virtualDom: !0,
            data: t,
            pagination: !0,
            paginationMode: "local",
            paginationSize: 20,
            paginationSizeSelector: [ 20, 50, 100, 1e3, 99999 ],
            paginationCounter: (t, e, n, a, i) => `演员: ${a} &nbsp;&nbsp;&nbsp;番号总数: ${this.currentCarCount}  <span id="checkBlacklistMsg" style="margin-left: 10px"></span>`,
            responsiveLayout: "collapse",
            responsiveLayoutCollapse: !0,
            columnDefaults: {
                headerHozAlign: "center",
                hozAlign: "center"
            },
            index: "starId",
            columns: [ {
                title: "演员",
                field: "name",
                sorter: "string",
                minWidth: 100,
                responsive: 0,
                headerSort: !1,
                formatter: (t, e, n) => {
                    const a = t.getData();
                    return `<a class="open-url" data-url="${a.url}" href="${a.url}" data-name="${a.name}" target="_blank">${a.name}</a>`;
                }
            }, {
                title: "性别角色",
                field: "role",
                sorter: "string",
                width: 120,
                responsive: 5,
                formatter: (t, e, n) => {
                    const a = t.getData().role;
                    let i = a;
                    return a === D ? i = "男演员" : a === L && (i = "女演员"), i;
                }
            }, {
                title: "影视类别",
                field: "movieType",
                sorter: "string",
                width: 120,
                responsive: 5,
                formatter: (t, e, n) => {
                    const a = t.getData().movieType;
                    let i = a;
                    return a === M ? i = "有码" : a === A && (i = "无码"), i;
                }
            }, {
                title: "屏蔽类型",
                field: "url",
                sorter: "string",
                minWidth: 120,
                responsive: 4,
                visible: c,
                formatter: (t, e, n) => {
                    const a = t.getData();
                    if ("虚拟演员" === a.role) {
                        const t = a.name.split("-");
                        return `<span style="color:#cc4444">${t.length > 0 ? t[1] : a.name}</span>`;
                    }
                    const i = utils.getUrlParam(a.url, "t");
                    if (!i) return "<span>所有分类</span>";
                    {
                        const t = i.toString().split(",");
                        let e = "";
                        if (t.forEach((t => {
                            let n = $t[t];
                            e += n ? n + " " : "未知类别:" + t + " ";
                        })), e = e.trim(), e) return `<span style="color:#cc4444">${e}</span>`;
                    }
                }
            }, {
                title: "番号数量",
                field: "count",
                sorter: "number",
                width: 170,
                responsive: 1
            }, {
                title: "创建时间",
                field: "createTime",
                sorter: "string",
                width: 170,
                responsive: 5
            }, {
                title: "最后发行时间",
                field: "lastPublishTime",
                sorter: "string",
                width: 170,
                responsive: 1
            }, {
                title: "状态",
                field: "isUnCheck",
                sorter: "string",
                width: 120,
                responsive: 1,
                formatter: (t, e, n) => {
                    let a = "", i = "正常检测";
                    return t.getData().isUnCheck && (a = `停更${this.checkBlacklist_ruleTime / 24 / 365}年以上, 下轮任务不再进行检测`, 
                    i = "停止检测"), `<span data-tip="${a}" style="${a ? "color: #cc4444;" : ""}">${i}</span>`;
                }
            }, {
                title: "操作",
                sorter: "string",
                cssClass: "action-cell-dropdown",
                minWidth: 150,
                responsive: 0,
                headerSort: !1,
                formatter: (t, e, n) => {
                    const a = t.getData();
                    return n((() => {
                        var e, n;
                        null == (e = t.getElement().querySelector(".delete-btn")) || e.addEventListener("click", (t => {
                            const e = a.name, n = a.starId;
                            e ? n ? utils.q(t, `是否移除对 ${e} 的屏蔽?`, (async () => {
                                await storageManager.removeBlacklistCarList(n), await storageManager.deleteBlacklistItem(n), 
                                show.info("操作成功"), this.reloadTable().then();
                            })) : show.error("获取starId失败") : show.error("获取名称失败");
                        })), null == (n = t.getElement().querySelector(".keyword-btn")) || n.addEventListener("click", (t => {
                            const e = a.carList.reduce(((t, e) => {
                                const n = e.carNum.split("-")[0] + "-";
                                return t[n] = (t[n] || 0) + 1, t;
                            }), {}), n = Object.entries(e).map((([t, e]) => ({
                                prefix: t,
                                count: e
                            }))).sort(((t, e) => e.count - t.count));
                            console.log(n);
                        }));
                    })), '\n                           \x3c!-- <a class="a-normal keyword-btn"> <span>提取屏蔽词</span> </a>--\x3e\n                            <a class="a-danger delete-btn"> <span>✂️ 删除</span> </a>\n                        ';
                }
            } ],
            initialSort: [ {
                column: "createTime",
                dir: "desc"
            } ],
            locale: "zh-cn",
            langs: {
                "zh-cn": {
                    pagination: {
                        first: "首页",
                        first_title: "首页",
                        last: "尾页",
                        last_title: "尾页",
                        prev: "上一页",
                        prev_title: "上一页",
                        next: "下一页",
                        next_title: "下一页",
                        all: "所有",
                        page_size: "每页行数"
                    }
                }
            }
        });
    }
    getCurrentStarUrl() {
        let t = window.location.href.replace(/([&?])sort_type=[^&]+(&|$)/, "$1");
        t = t.replace(/[&?]$/, ""), t = t.replace(/\?&/, "?");
        let e = t;
        return e = e.replace(/([&?])page=\d+(&|$)/, "$1"), e = e.replace(/[&?]$/, ""), e = e.replace(/\?&/, "?"), 
        e = e.replace(/\/(\d+)(?:\/(\d+))?(\?|$)/, ((t, e, n, a) => void 0 !== n ? `/${e}${a}` : t)), 
        e;
    }
    parseUrlId(t) {
        if (!t) throw new Error("url未传入");
        return new URL(t).pathname.split("/").filter((t => "" !== t.trim())).pop();
    }
    async filterAllVideo(t, e) {
        let n, a;
        if (e ? (d && e.find(".avatar-box").length > 0 && e.find(".avatar-box").parent().remove(), 
        n = e.find(this.getSelector().requestDomItemSelector), a = e.find(this.getSelector().nextPageSelector).attr("href")) : (n = $(this.getSelector().itemSelector), 
        a = $(this.getSelector().nextPageSelector).attr("href")), a && 0 === n.length) throw show.error("解析列表失败"), 
        new Error("解析列表失败");
        for (const s of n) {
            const e = $(s), {carNum: n, url: a, publishTime: o} = this.getBoxCarInfo(e);
            if (a && n) try {
                if (await storageManager.getCar(n)) continue;
                await storageManager.saveCar({
                    carNum: n,
                    url: a,
                    names: t,
                    actionType: p,
                    publishTime: o
                }), clog.log("屏蔽演员番号", t, n);
            } catch (i) {
                console.error(`保存失败 [${n}]:`, i);
            }
        }
        if (a) {
            show.info("请不要关闭窗口, 正在解析下一页:" + a), await new Promise((t => setTimeout(t, 500)));
            const e = await gmHttp.get(a), n = new DOMParser, i = $(n.parseFromString(e, "text/html"));
            await this.filterAllVideo(t, i);
        } else show.ok("执行结束!"), window.refresh();
    }
    async filterActorVideo(t, e, n) {
        let {nextPageLink: a} = await this.parseAndSaveFilterInfo(n, t, e);
        if (this.nextPageLink = a, a) {
            let n;
            this.lastPageLink = a, show.info("请不要关闭窗口, 正在解析下一页:" + a);
            const i = utils.getUrlParam(a, "page") || 0, s = this.getBean("Beyond60Plugin");
            if (c && s && i > 60) {
                let {html: t, nextUrl: e, hasMore: i} = await s.handleBeyond60(a), o = `\n                    <div class ='movie-list'>${t}</div>\n                    ${e ? `<a class="pagination-next" href="${e}"></a>` : ""}\n                `;
                n = utils.htmlTo$dom(o);
            } else {
                clog.log("正在请求下一页内容:", a);
                const t = await gmHttp.get(a);
                n = utils.htmlTo$dom(t);
            }
            await this.filterActorVideo(t, e, n);
        } else show.ok("执行结束!"), window.refresh();
    }
    async parseAndSaveFilterInfo(t, e, n) {
        let a, i;
        if (t) {
            let e = !1, n = B;
            t.text().includes(P) && (e = !0, n = P), e && t.find(".avatar-box").length > 0 && t.find(".avatar-box").parent().remove(), 
            a = t.find(this.getSelector(n).requestDomItemSelector), i = t.find(this.getSelector(n).nextPageSelector).attr("href");
        } else a = $(this.getSelector().itemSelector), i = $(this.getSelector().nextPageSelector).attr("href");
        if (i && 0 === a.length) return {
            nextPageLink: null,
            lastPublishTime: null
        };
        const s = await storageManager.getTitleFilterKeyword();
        let o = [], r = null;
        for (const l of a) {
            const t = $(l), {carNum: a, url: i, publishTime: c, title: d} = this.getBoxCarInfo(t);
            r || (r = c);
            s.find((t => d.includes(t) || a.startsWith(t))) || i && a && o.push({
                carNum: a,
                url: i,
                names: e,
                actionType: p,
                starId: n,
                publishTime: c
            });
        }
        return await storageManager.batchSaveBlacklistCarList(o), {
            nextPageLink: i,
            lastPublishTime: r
        };
    }
    async clearKeywordBlacklist() {
        let t = await storageManager.getTitleFilterKeyword();
        const e = new Set;
        if (t.forEach((t => {
            /^[a-z]{2,}-/i.test(t) && e.add(t);
        })), 0 === e.size) return void show.info("没有需要清理的关键词数据");
        const n = await storageManager.getCarList(), a = await storageManager.getBlacklistCarList(), i = new Set(n.map((t => t.carNum))), s = Array.from(e), o = [], r = [];
        for (const c of a) {
            const t = c.carNum;
            let e = !1;
            for (const n of s) if (t.startsWith(n)) {
                r.push({
                    carNum: t,
                    names: c.names,
                    matchedKeyword: n
                }), o.push(t), e = !0;
                break;
            }
            e || i.has(t) && (r.push({
                carNum: t,
                names: c.names,
                matchedKeyword: "已在鉴定记录中"
            }), o.push(t));
        }
        const l = o.length;
        0 !== l ? layer.open({
            type: 1,
            title: `确认清理黑名单数据 (共 ${l} 个番号)`,
            area: [ "80%", "70%" ],
            anim: -1,
            content: `\n                <div style="height: 100%;overflow:hidden;">\n                    <div style="padding: 10px; overflow-y: auto;">\n                        <p>以下匹配到 <strong style="color: red;">${l}</strong> 个黑名单番号存在于屏蔽关键词中, 是否移除?</p>\n                    </div>\n                    <div id="wait-remove-table"  style="height: calc(100% - 70px);"></div>\n                </div>\n            `,
            btn: [ "确定清理", "取消" ],
            success: function(t, e) {
                new Tabulator("#wait-remove-table", {
                    data: r,
                    virtualDom: !0,
                    layout: "fitColumns",
                    pagination: !0,
                    paginationMode: "local",
                    paginationSize: 50,
                    paginationSizeSelector: [ 50, 100, 1e3, 99999 ],
                    columns: [ {
                        title: "演员",
                        field: "names"
                    }, {
                        title: "番号",
                        field: "carNum"
                    }, {
                        title: "匹配关键词",
                        field: "matchedKeyword"
                    } ],
                    locale: "zh-cn",
                    initialSort: [ {
                        column: "names",
                        dir: "asc"
                    } ],
                    langs: {
                        "zh-cn": {
                            pagination: {
                                first: "首页",
                                first_title: "首页",
                                last: "尾页",
                                last_title: "尾页",
                                prev: "上一页",
                                prev_title: "上一页",
                                next: "下一页",
                                next_title: "下一页",
                                all: "所有",
                                page_size: "每页行数"
                            }
                        }
                    }
                });
            },
            yes: async t => {
                const e = await storageManager.batchRemoveBlacklistCars(o);
                0 === e ? show.error("移除失败") : (show.ok(`🎉 清理完成！已移除${e}个相关黑名单番号数据`), await this.reloadTable(), 
                layer.close(t));
            },
            btn2: function(t) {
                layer.close(t);
            }
        }) : show.info("没有需要清理的黑名单番号数据");
    }
}

class St extends G {
    getName() {
        return "ListPageButtonPlugin";
    }
    async handle() {
        if (!window.isListPage) return;
        await this.createMenuBtn(), this.bindEvent();
        await storageManager.getSetting("autoPage") === I ? $("#sort-toggle-btn").hide() : this.sortItems().then();
    }
    async createMenuBtn() {
        const t = await storageManager.getSetting("showWaitCheckBtn", I), e = await storageManager.getSetting("showWaitDownBtn", I);
        if (c) {
            const n = l.includes("/actors/");
            let a = $(".main-tabs, .tabs"), i = "加入黑名单", s = "#d22020", o = "", r = null;
            if (n) {
                a = $(".toolbar, .section-addition").filter(":last");
                const t = await storageManager.getBlacklist(), e = this.getActressPageInfo();
                t.find((t => t.starId === e.starId)) && (i = "已加入黑名单", s = "#885d5d");
            } else l.includes("/tags") && utils.loopDetector((() => $("#jhs-check-tag").text().trim()), (async () => {
                const t = $("#addBlacklistBtn");
                t.attr("data-tip", "将当前分类标签加入到黑名单, 后续有作品更新也会纳入屏蔽中");
                const e = $("#jhs-check-tag").text().trim();
                if (!e) return;
                const n = "no-" + e, a = await storageManager.getBlacklist();
                r = a.find((t => t.starId === n)), r && (t.css("backgroundColor", "#885d5d"), $("#addBlacklistBtn span").text("已加入黑名单"));
            }));
            const c = l.includes("advanced_search");
            c ? a = $("h2.section-title") : o = "flex-grow:1;";
            const d = localStorage.getItem("jhs_sortMethod"), p = "当前排序方式: " + ("rateCount" === d ? "评价人数" : "date" === d ? "时间" : "默认");
            a.append(`\n                <div style="display: flex;align-items: center; ${o} ">\n                    <a id="waitCheckBtn" class="menu-btn main-tab-btn" data-tip="打开未鉴定的列表项, 并自动播放视频" style="background-color:#56c938 !important; ${t === T ? "display: none" : ""}"><span>打开待鉴定</span></a>\n                    <a id="waitDownBtn" class="menu-btn main-tab-btn" style="background-color:#2caac0 !important; ${e === T ? "display: none" : ""}"><span>打开已收藏</span></a>\n                    ${n ? `\n                     <a id="addBlacklistBtn" class="menu-btn main-tab-btn" style="background-color:${s} !important;" data-tip="将演员加入黑名单, 后续有作品更新也会纳入屏蔽中"><span>${i}</span></a>\n                     <a id="filterAllVideo" class="menu-btn main-tab-btn" style="background-color:#e8ab39 !important;margin-right: 30px!important;" data-tip="一键屏蔽已选分类的视频列表至鉴定记录中"><span>一键屏蔽所有作品</span></a>\n                    ` : ""}\n                    ${l.includes("/tags") ? `\n                      <a id="addBlacklistBtn" class="menu-btn main-tab-btn" style="background-color:${s} !important;" data-tip="将演员加入黑名单, 后续有作品更新也会纳入屏蔽中"><span>${i}</span></a>\n                    ` : ""}\n                </div>\n                <div style="display: flex;align-items: center;">\n                    <a id="newVideoBtn" class="menu-btn main-tab-btn" style="background-color:#2c6cc0 !important;"><span>新作品检测 (<span id="newVideoCount">0</span>)</span></a>\n                    <a id="blacklistBtn" class="menu-btn main-tab-btn" style="background-color:#34393f !important;"><span>演员黑名单</span></a>\n                    ${h || c ? "" : `<a id="sort-toggle-btn" class="menu-btn main-tab-btn" style="background-color:#8783ab !important;"> ${p} </a>`}\n                </div>\n            `);
        }
        if (d) {
            const n = l.includes("/star/");
            let a = "加入黑名单", i = "#d22020";
            if (n) {
                const t = await storageManager.getBlacklist(), e = this.getActressPageInfo();
                t.find((t => t.starId === e.starId)) && (a = "已加入黑名单", i = "#885d5d");
            }
            $(".masonry").parent().prepend(`\n                <div style="margin: 10px; display: flex;">\n                    <a id="waitCheckBtn" class="menu-btn main-tab-btn" style="background-color:#56c938 !important; ${t === T ? "display: none" : ""}"><span>打开待鉴定</span></a>\n                    <a id="waitDownBtn" class="menu-btn main-tab-btn" style="background-color:#2caac0 !important; ${e === T ? "display: none" : ""}"><span>打开已收藏</span></a>\n                    \n                    ${n ? `    \n                        <a id="addBlacklistBtn" class="menu-btn main-tab-btn" style="background-color:${i} !important;" data-tip="将演员加入黑名单, 后续有作品更新也会纳入屏蔽中"><span>${a}</span></a>\n                        <a id="filterAllVideo" class="menu-btn main-tab-btn" style="background-color:#e8ab39 !important;" data-tip="一键屏蔽已选分类的视频列表至鉴定记录中"><span>一键屏蔽所有作品</span></a>\n                    ` : '<a id="blacklistBtn" class="menu-btn main-tab-btn" style="background-color:#34393f !important;"><span>演员黑名单</span></a>'}\n                </div>\n            `);
        }
        const n = window.pluginManager.getBean("NewVideoPlugin");
        n && n.showNewVideoCount().then();
    }
    bindEvent() {
        $("#waitCheckBtn").on("click", (t => {
            this.openWaitCheck(t).then();
        })), $("#waitDownBtn").on("click", (t => {
            this.openFavorite(t).then();
        })), $("#newVideoBtn").on("click", (t => {
            this.getBean("NewVideoPlugin").openDialog();
        })), $("#blacklistBtn").on("click", (t => {
            this.getBean("BlacklistPlugin").openBlacklistDialog();
        })), $("#sort-toggle-btn").on("click", (t => {
            const e = localStorage.getItem("jhs_sortMethod");
            let n;
            n = e && "default" !== e ? "rateCount" === e ? "date" : "default" : "rateCount";
            const a = {
                default: "默认",
                rateCount: "评价人数",
                date: "时间"
            }[n];
            $(t.target).text(`当前排序方式: ${a}`), localStorage.setItem("jhs_sortMethod", n), this.sortItems().then();
        }));
        const t = this.getBean("BlacklistPlugin");
        $("#addBlacklistBtn").on("click", (async e => {
            await t.addBlacklist(e);
        })), $("#filterAllVideo").on("click", (async e => {
            let n = {
                clientX: e.clientX,
                clientY: e.clientY + 80
            }, a = c ? $(".actor-section-name") : $(".avatar-box .photo-info .pb10");
            if (0 === a.length) return void show.error("获取演员名称失败");
            let i = a.text().trim().split(",")[0];
            utils.q(n, "一键屏蔽已选分类的视频列表至鉴定记录中?", (async () => {
                this.loadObj = loading();
                try {
                    await t.filterAllVideo(i), window.refresh();
                } catch (e) {
                    console.error(e);
                } finally {
                    this.loadObj.close();
                }
            }));
        }));
    }
    async sortItems() {
        if (l.includes("handle") || l.includes("advanced_search")) return;
        const t = await storageManager.getSetting("autoPage");
        if (h || t === I) return;
        const e = localStorage.getItem("jhs_sortMethod");
        if (!e) return;
        $(".movie-list .item").each((function(t) {
            $(this).attr("data-original-index") || $(this).attr("data-original-index", t);
        }));
        const n = $(".movie-list"), a = $(".item", n);
        if ("default" === e) a.sort((function(t, e) {
            return $(t).data("original-index") - $(e).data("original-index");
        })).appendTo(n); else {
            const t = a.get();
            t.sort((function(t, n) {
                if ("rateCount" === e) {
                    const e = t => {
                        const e = $(t).find(".score .value").text().match(/由(\d+)人/);
                        return e ? parseFloat(e[1]) : 0;
                    };
                    return e(n) - e(t);
                }
                {
                    const e = t => {
                        const e = $(t).find(".meta").text().trim();
                        return new Date(e);
                    };
                    return e(n) - e(t);
                }
            })), n.empty().append(t);
        }
    }
    async openWaitCheck(t) {
        const e = await storageManager.getSetting("waitCheckCount", 5);
        let n = 0;
        $(`${this.getSelector().itemSelector}:visible`).each(((t, a) => {
            if (n >= e) return !1;
            const i = $(a);
            if (i.find(".status-tag").length > 0) return;
            const {carNum: s, aHref: o} = this.getBoxCarInfo(i);
            if (s.includes("FC2-")) {
                const t = this.parseMovieId(o);
                this.getBean("Fc2Plugin").openFc2Page(t, s, o);
            } else {
                let t = o + (o.includes("?") ? "&autoPlay=1" : "?autoPlay=1");
                window.open(t);
            }
            n++;
        })), 0 === n && show.info("没有需鉴定的视频");
    }
    async openFavorite() {
        let t, e = await storageManager.getSetting("waitCheckCount", 5), n = await storageManager.getSetting("randomOpenWaitDown", T), a = await storageManager.getCarList();
        t = n === I ? a.filter((t => t.status === g)).sort((() => Math.random() - .5)) : a.filter((t => t.status === g)).sort(((t, e) => e.createDate - t.createDate));
        for (let i = 0; i < e; i++) {
            if (i >= t.length) return;
            let e = t[i], n = e.carNum, a = e.url;
            if (n.includes("FC2-")) {
                const t = this.parseMovieId(a);
                await this.getBean("Fc2Plugin").openFc2Page(t, n, a);
            } else window.open(a);
            clog.debug("打开已收藏", n, a);
        }
    }
}

const Ct = async (t, e = "ja", n = "zh-CN") => {
    if (!t) throw new Error("翻译文本不能为空");
    const a = "https://translate-pa.googleapis.com/v1/translate?" + new URLSearchParams({
        "params.client": "gtx",
        dataTypes: "TRANSLATION",
        key: "AIzaSyDLEeFI5OtFBwYBIoK_jj5m32rZK5CkCXA",
        "query.sourceLanguage": e,
        "query.targetLanguage": n,
        "query.text": t
    }), i = await fetch(a);
    if (!i.ok) throw new Error(`${i.status} ${i.statusText}`);
    return (await i.json()).translation;
}, _t = {
    IS_FILTERED: {
        text: f,
        color: b,
        reasonType: "单番号屏蔽",
        isCounted: !0,
        countKey: "currentPageFilterCount"
    },
    IS_FAVORITE: {
        text: y,
        color: x,
        reasonType: "",
        isCounted: !0,
        countKey: "currentPageFavoriteCount"
    },
    IS_HAS_DOWN: {
        text: k,
        color: S,
        reasonType: "",
        isCounted: !0,
        countKey: "currentPageHasDownCount"
    },
    IS_HAS_WATCH: {
        text: C,
        color: _,
        reasonType: "",
        isCounted: !0,
        countKey: "currentPageHasWatchCount"
    },
    IS_KEYWORD_FILTER: {
        text: "❌ 关键词屏蔽",
        color: "#de3333",
        reasonType: "",
        isCounted: !0,
        countKey: "currentPageKeywordFilterCount"
    },
    IS_ACTOR_FILTER: {
        text: "♂️ 男演员屏蔽",
        color: "#b22222",
        reasonType: "",
        isCounted: !0,
        countKey: "currentPageActorFilterCount"
    },
    IS_ACTRESS_FILTER: {
        text: "♀️ 女演员屏蔽",
        color: "#cd5c5c",
        reasonType: "",
        isCounted: !0,
        countKey: "currentPageActorFilterCount"
    },
    IS_WAIT_CHECK: {
        text: "",
        color: "",
        reasonType: "",
        isCounted: !0,
        countKey: "currentPageWaitCheckCount"
    }
};

class Tt extends G {
    constructor() {
        super(...arguments), o(this, "currentPageFilterCount", 0), o(this, "currentPageFavoriteCount", 0), 
        o(this, "currentPageHasDownCount", 0), o(this, "currentPageHasWatchCount", 0), o(this, "currentPageKeywordFilterCount", 0), 
        o(this, "currentPageActorFilterCount", 0), o(this, "currentPageWaitCheckCount", 0), 
        o(this, "currentPageTotalCount", 0), o(this, "cache", localStorage.getItem("jhs_translate") ? JSON.parse(localStorage.getItem("jhs_translate")) : {}), 
        o(this, "writeQueue", Promise.resolve());
    }
    getName() {
        return "ListPagePlugin";
    }
    async handle() {
        this.cleanRepeatId(), this.replaceHdImg(), this.addJumpPageControl(), this.fixBusTitleBox(), 
        await this.doFilter(), this.bindClick().then(), this.bindListPageHotKey().then(), 
        this.rememberTagExpand(), $(this.getSelector().itemSelector + " a").attr("target", "_blank"), 
        this.checkDom();
    }
    rememberTagExpand() {
        if (!window.location.href.includes("actors")) return;
        const t = $(".tag-expand");
        if (0 === t.length) return;
        const e = "jhs_tag_expand", n = "true" === localStorage.getItem(e), a = $(".actor-tags .content");
        n && a.hasClass("collapse") && t[0].click(), t.on("click", (function() {
            const t = !a.hasClass("collapse");
            localStorage.setItem(e, t.toString());
        }));
    }
    checkDom() {
        if (!window.isListPage) return;
        const t = this.getSelector(), e = document.querySelector(t.boxSelector);
        if (!e) return void console.error("没有找到容器节点!");
        const n = new MutationObserver((async t => {
            n.disconnect();
            try {
                this.replaceHdImg(), this.addJumpPageControl(), this.fixBusTitleBox(), await this.doFilter(), 
                await this.getBean("ListPageButtonPlugin").sortItems(), this.getBean("CoverButtonPlugin").addSvgBtn().then(), 
                $(this.getSelector().itemSelector + " a").attr("target", "_blank"), this.getBean("AutoPagePlugin").checkLoad();
            } finally {
                n.observe(e, a);
            }
        })), a = {
            childList: !0,
            subtree: !1
        };
        n.observe(e, a);
    }
    fixBusTitleBox() {
        if (!d) return;
        $(this.getSelector().itemSelector).toArray().forEach((t => {
            var e;
            let n = $(t);
            if (n.find(".avatar-box").length > 0) return;
            const a = (null == (e = n.find("img").attr("title")) ? void 0 : e.trim()) || "";
            n.find(".photo-info span:first").contents().first().wrap(`<span class="video-title" title="${a}">${a}</span>`), 
            n.find("br").remove();
        }));
    }
    cleanRepeatId() {
        if (!d) return;
        $("#waterfall_h").removeAttr("id").attr("id", "no-page");
        const t = $('[id="waterfall"]');
        0 !== t.length && t.each((function() {
            const t = $(this);
            if (!t.hasClass("masonry")) {
                t.children().insertAfter(t), t.remove();
            }
        }));
    }
    async doFilter() {
        if (!window.isListPage) return;
        let t = $(this.getSelector().itemSelector).toArray();
        t.length && (await this.filterMovieList(t), await this.getBean("WangPan115MatchPlugin").matchMovieList(t), 
        d && await this.getBean("BusImgPlugin").logImageHeightsByRow());
    }
    async filterMovieList(t) {
        utils.time("累计耗费时间"), utils.time("读取数据耗时");
        const [e, n, a, i, s] = await Promise.all([ storageManager.getCarList(), storageManager.getTitleFilterKeyword(), storageManager.getBlacklist(), storageManager.getBlacklistCarList(), storageManager.getSetting() ]), o = utils.time("读取数据耗时"), r = e.reduce(((t, e) => {
            const n = e.status;
            return t.hasOwnProperty(n) && t[n].add(e.carNum), t;
        }), {
            [p]: new Set,
            [g]: new Set,
            [m]: new Set,
            [u]: new Set
        });
        utils.time("组装数据耗时");
        const l = new Map(a.map((t => [ t.starId, t.role ]))), {actorCarNumToNameMap: v, actressCarNumToNameMap: f} = i.reduce(((t, e) => {
            const n = l.get(e.starId);
            if (!n) return clog.error("黑名单数据源丢失演员信息", e), t;
            const a = n === D ? t.actorCarNumToNameMap : t.actressCarNumToNameMap;
            return a.has(e.carNum) || a.set(e.carNum, e.names), t;
        }), {
            actorCarNumToNameMap: new Map,
            actressCarNumToNameMap: new Map
        }), b = utils.time("组装数据耗时"), w = {
            showFilterItem: (null == s ? void 0 : s.showFilterItem) ?? T,
            showFilterActorItem: (null == s ? void 0 : s.showFilterActorItem) ?? T,
            showFilterKeywordItem: (null == s ? void 0 : s.showFilterKeywordItem) ?? T,
            showFavoriteItem: (null == s ? void 0 : s.showFavoriteItem) ?? I,
            showHasDownItem: (null == s ? void 0 : s.showHasDownItem) ?? I,
            showHasWatchItem: (null == s ? void 0 : s.showHasWatchItem) ?? I,
            showAllItem: (null == s ? void 0 : s.showAllItem) ?? T,
            tagPosition: (null == s ? void 0 : s.tagPosition) || "rightTop",
            movieShowType: (null == s ? void 0 : s.movieShowType) || "hide"
        };
        this.currentPageFilterCount = 0, this.currentPageFavoriteCount = 0, this.currentPageHasDownCount = 0, 
        this.currentPageHasWatchCount = 0, this.currentPageKeywordFilterCount = 0, this.currentPageActorFilterCount = 0, 
        this.currentPageWaitCheckCount = 0, this.currentPageTotalCount = 0, utils.time("处理页面耗时"), 
        await Promise.all(t.map((async t => {
            let e = $(t);
            if (d && e.find(".avatar-box").length > 0) return;
            const {carNum: a, title: i} = this.getBoxCarInfo(e), {filter: s, favorite: o, hasDown: l, hasWatch: p} = r, g = o.has(a), m = l.has(a), u = p.has(a), b = s.has(a), y = v.has(a), x = f.has(a), k = y || x, S = n.find((t => i.includes(t) || a.startsWith(t))), C = !!S;
            if (!h) {
                let t = w.showFavoriteItem === T && g || w.showHasDownItem === T && m || w.showHasWatchItem === T && u || w.showFilterItem === T && b && !(g || m || u) || w.showFilterActorItem === T && k || w.showFilterKeywordItem === T && C;
                e.attr("data-movieShowType") !== w.movieShowType && (e.css("border", ""), e.children().css("visibility", ""), 
                e.removeAttr("data-hide"), e.show());
                const n = e.attr("data-hide") === I;
                w.showAllItem === I && (t = !1);
                if (t !== n) {
                    if (t ? e.attr("data-hide", I) : e.removeAttr("data-hide"), "hide" === w.movieShowType) t ? e.hide() : e.show(); else {
                        if ("visibility" !== w.movieShowType) throw new Error("movieShowType值有误:" + w.movieShowType);
                        {
                            const n = e.children(), a = t ? "1px solid rgb(192 176 176)" : "none", i = t ? "hidden" : "visible";
                            e.css("border", a), n.css("visibility", i);
                        }
                    }
                    e.attr("data-movieShowType") !== w.movieShowType && e.attr("data-movieShowType", w.movieShowType);
                }
            }
            let _ = _t.IS_WAIT_CHECK, B = null;
            b ? _ = _t.IS_FILTERED : g ? _ = _t.IS_FAVORITE : m ? _ = _t.IS_HAS_DOWN : u ? _ = _t.IS_HAS_WATCH : C ? (_ = _t.IS_KEYWORD_FILTER, 
            B = S || "未知") : y ? (_ = _t.IS_ACTOR_FILTER, B = v.get(a) || "") : x && (_ = _t.IS_ACTRESS_FILTER, 
            B = f.get(a) || ""), B || (B = _.reasonType), _.isCounted && this[_.countKey]++, 
            this.currentPageTotalCount++, e.find(".status-tag").remove();
            const P = "rightTop" === w.tagPosition ? "right: 0; top:5px;" : "left: 0; top:5px;";
            if (_.text) {
                const t = c ? `<span class="tag is-success status-tag" data-tip="${B}" title=""\n                        style="margin-right: 5px; border-radius:10px; position:absolute; \n                        z-index:10; background-color: ${_.color} !important; ${P}">\n                        ${_.text}\n                    </span>` : `<a class="a-primary status-tag" data-tip="${B}"  title=""\n                        style="margin-right: 5px; padding: 0 5px; color: #fff !important; border-radius:10px; position:absolute; \n                        z-index:10; background-color: ${_.color} !important; ${P}">\n                        <span class="tag" style="color:#fff !important;">${_.text}</span>\n                    </a>`;
                if (c && e.find(".tags").append(t), d) {
                    const n = e.find(".item-tag");
                    n.length ? n.append(t) : e.find(".photo-info > span > div").append(t);
                }
            }
            await this.translate(e);
        })));
        const y = utils.time("处理页面耗时"), x = utils.time("累计耗费时间");
        $("#waitDownBtn span").text(`打开已收藏 (${r.favorite.size})`), clog.log(`\n            <table class="countTable" style='border-collapse: collapse; width: 100%'>\n                <tr>\n                    <td colspan="2" style='padding: 3px; border: 1px solid #ccc;'>${o}</td>\n                    <td colspan="2" style='padding: 3px; border: 1px solid #ccc;'>${b}</td>\n                </tr>\n                \n                <tr>\n                    <td colspan="2" style='padding: 3px; border: 1px solid #ccc;'>${y}</td>\n                    <td colspan="2" style='padding: 3px; border: 1px solid #ccc;'>${x}</td>\n                </tr>\n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc; font-weight: bold;'>项目</td>\n                    <td style='padding: 3px; border: 1px solid #ccc; font-weight: bold;'>数量</td>\n                    <td style='padding: 3px; border: 1px solid #ccc; font-weight: bold;'>项目</td>\n                    <td style='padding: 3px; border: 1px solid #ccc; font-weight: bold;'>数量</td>\n                </tr>\n                \n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>屏蔽单番号</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageFilterCount}</strong></td>\n                     <td style='padding: 3px; border: 1px solid #ccc;'>收藏</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageFavoriteCount}</strong></td>\n                </tr>\n                \n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>屏蔽演员</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageActorFilterCount}</strong></td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>已下载</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageHasDownCount}</strong></td>\n                </tr>\n                \n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>屏蔽关键词</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageKeywordFilterCount}</strong></td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>已观看</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageHasWatchCount}</strong></td>\n                </tr>\n                \n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc;'>待鉴定</td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageWaitCheckCount}</strong></td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'></td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'></td>\n                </tr>\n        \n                <tr>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>总数</strong></td>\n                    <td style='padding: 3px; border: 1px solid #ccc;'><strong>${this.currentPageTotalCount}</strong></td>\n                </tr>\n            </table>\n        `);
    }
    async bindClick() {
        let t = this.getSelector();
        $(t.boxSelector).on("click", ".item img", (async t => {
            if (t.preventDefault(), t.stopPropagation(), $(t.target).closest("div.meta-buttons").length) return;
            const e = $(t.target).closest(".item"), {carNum: n, aHref: a} = this.getBoxCarInfo(e);
            let i = await storageManager.getSetting("dialogOpenDetail", I);
            if (n.includes("FC2-")) {
                let t = this.parseMovieId(a);
                this.getBean("Fc2Plugin").openFc2Dialog(t, n, a);
            } else i === I ? (utils.openPage(a, n, !0, t), this.$currentImage = null) : window.open(a);
        })), $(t.boxSelector).on("click", ".item video", (async t => {
            const e = t.currentTarget;
            e.paused ? e.play().catch((t => console.error("播放失败:", t))) : e.pause(), t.preventDefault(), 
            t.stopPropagation();
        })), $(t.boxSelector).on("click", ".item .video-title", (async t => {
            if ($(t.target).closest('[class^="jhs-match-"]').length) return;
            const e = $(t.currentTarget).closest(".item"), {carNum: n, aHref: a} = this.getBoxCarInfo(e);
            if (n.includes("FC2-")) {
                t.preventDefault();
                let e = this.parseMovieId(a);
                this.getBean("Fc2Plugin").openFc2Dialog(e, n, a);
            }
        })), $(t.boxSelector).on("contextmenu", ".item img, .item video", (async t => {
            t.preventDefault();
            const e = $(t.target).closest(".item"), {carNum: n, url: a, publishTime: i} = this.getBoxCarInfo(e);
            let s = c ? $(".actor-section-name") : $(".avatar-box .photo-info .pb10"), o = "";
            s.length && (o = s.text().trim().split(",")[0].replace("(無碼)", "")), utils.q(t, `是否屏蔽番号 ${n}?`, (async () => {
                setTimeout((async () => {
                    o || (o = await this.parseActressName(a)), await storageManager.saveCar({
                        carNum: n,
                        url: a,
                        names: o,
                        actionType: p,
                        publishTime: i
                    }), window.refresh(), show.ok("操作成功");
                }));
            }));
        }));
    }
    async parseActressName(t) {
        let e = null;
        if (await storageManager.getSetting("enableSaveActressCarInfo", T) === I) {
            clog.debug("鉴定补录演员信息-已启用, 开始解析详情页"), clog.debug("开始解析演员详情页", t);
            const n = await gmHttp.get(t), a = utils.htmlTo$dom(n);
            c ? e = a.find(".female").prev().map(((t, e) => $(e).text())).get().join(" ") : d && (e = a.find('span[onmouseover*="star_"] a').map(((t, e) => $(e).text())).get().join(" ")), 
            clog.debug("解析到名称:", e);
        }
        return e;
    }
    async bindListPageHotKey() {
        this.$currentImage = null, $(document).on("mouseenter", this.getSelector().coverImgSelector, (t => {
            this.$currentImage = $(t.currentTarget);
        })).on("mouseleave", this.getSelector().coverImgSelector, (() => {
            this.$currentImage = null;
        }));
        let t = await storageManager.getSetting();
        this.filterHotKey = t.filterHotKey, this.favoriteHotKey = t.favoriteHotKey, this.hasDownHotKey = t.hasDownHotKey, 
        this.hasWatchHotKey = t.hasWatchHotKey, this.enableImageHotKey = t.enableImageHotKey || T, 
        this.clogHotKey = t.clogHotKey, this.foldCategoryHotKey = t.foldCategoryHotKey, 
        this.showFilterItemHotKey = t.showFilterItemHotKey, this.showFilterActorItemHotKey = t.showFilterActorItemHotKey, 
        this.showFilterKeywordItemHotKey = t.showFilterKeywordItemHotKey, this.showFavoriteItemHotKey = t.showFavoriteItemHotKey, 
        this.showHasDownItemHotKey = t.showHasDownItemHotKey, this.showHasWatchItemHotKey = t.showHasWatchItemHotKey, 
        this.showAllItemHotKey = t.showAllItemHotKey;
        const e = {
            showFilterItemHotKey: "showFilterItem",
            showFilterActorItemHotKey: "showFilterActorItem",
            showFilterKeywordItemHotKey: "showFilterKeywordItem",
            showFavoriteItemHotKey: "showFavoriteItem",
            showHasDownItemHotKey: "showHasDownItem",
            showHasWatchItemHotKey: "showHasWatchItem",
            showAllItemHotKey: "showAllItem"
        }, n = (t, e) => {
            const n = this[t];
            n && at.registerHotkey(n, (async t => {
                const n = await storageManager.getSetting(e) === I ? T : I;
                await storageManager.saveSettingItem(e, n), window.refresh();
            }));
        };
        for (const o in e) if (e.hasOwnProperty(o)) {
            n(o, e[o]);
        }
        if (this.enableImageHotKey === T) return;
        const a = async (t, e) => {
            setTimeout((async () => {
                let n = await this.parseActressName(t.url);
                await storageManager.saveCar({
                    carNum: t.carNum,
                    url: t.url,
                    names: n,
                    actionType: e,
                    publishTime: t.publishTime
                }), window.refresh(), show.ok("操作成功");
            }));
        }, i = {};
        this.filterHotKey && (i[this.filterHotKey] = t => {
            a(t, p);
        }), this.favoriteHotKey && (i[this.favoriteHotKey] = t => {
            a(t, g);
        }), this.hasDownHotKey && (i[this.hasDownHotKey] = t => {
            a(t, m);
        }), this.hasWatchHotKey && (i[this.hasWatchHotKey] = t => {
            a(t, u);
        }), this.clogHotKey && at.registerHotkey(this.clogHotKey, (t => {
            clog.toggleExpandCollapsed();
        })), this.foldCategoryHotKey && at.registerHotkey(this.foldCategoryHotKey, (t => {
            const e = $("#foldCategoryBtn");
            e.length && e[0].click();
        }));
        const s = (t, e) => {
            at.registerHotkey(t, (t => {
                const n = document.activeElement;
                if (!("INPUT" === n.tagName || "TEXTAREA" === n.tagName || n.isContentEditable) && this.$currentImage) {
                    const t = this.$currentImage.closest(".item"), n = this.getBoxCarInfo(t);
                    e(n);
                }
            }));
        };
        Object.entries(i).forEach((([t, e]) => {
            s(t, e);
        }));
    }
    replaceHdImg(t) {
        if (t && "string" == typeof t.jquery && (t = t.toArray()), t || (t = document.querySelectorAll(this.getSelector().coverImgSelector)), 
        c && t.forEach((t => {
            t.src = t.src.replace("thumbs", "covers"), t.title = "";
        })), d) {
            const e = /\/(imgs|pics)\/(thumb|thumbs)\//, n = /(\.jpg|\.jpeg|\.png)$/i, a = t => {
                t.src && e.test(t.src) && "true" !== t.dataset.hdReplaced && (t.src = t.src.replace(e, "/$1/cover/").replace(n, "_b$1"), 
                t.dataset.hdReplaced = "true", t.dataset.title = t.title, t.title = "");
            }, i = /ps(\.jpg|\.jpeg|\.png)$/i, s = t => {
                t.src && i.test(t.src) && "true" !== t.dataset.hdReplaced && (t.src = t.src.replace(i, "pl$1"), 
                t.dataset.hdReplaced = "true", t.dataset.title = t.title, t.title = "");
            };
            t.forEach((t => {
                a(t), s(t);
            }));
        }
        storageManager.getSetting("hoverBigImg", T).then((t => {
            t === I && (window.imageHoverPreviewObj ? window.imageHoverPreviewObj.bindEvents() : window.imageHoverPreviewObj = new ImageHoverPreview({
                selector: this.getSelector().coverImgSelector
            }));
        }));
    }
    async translate(t) {
        if (await storageManager.getSetting("translateTitle", I) !== I) return;
        let e, n, a = t.find(".video-title");
        if (c ? (e = a.contents().filter(((t, e) => 3 === e.nodeType && "" !== e.textContent.trim())).text().trim(), 
        n = t.find(".video-title strong").text().trim()) : (e = t.find("img").attr("data-title").trim(), 
        n = t.find("a").attr("href").split("/").filter(Boolean).pop().trim()), this.cache[n]) {
            let t = this;
            return a.contents().each((function() {
                3 === this.nodeType && "" !== this.textContent.trim() && (this.textContent = " " + t.cache[n] + " ");
            })), void a.attr("title", t.cache[n]);
        }
        Ct(e).then((t => {
            c ? (a.contents().each((function() {
                3 !== this.nodeType || "" === this.textContent.trim() || this.textContent.includes(n) || (this.textContent = " " + t + " ");
            })), a.attr("title", t)) : a.text(t), this.writeQueue = this.writeQueue.then((() => {
                this.cache[n] = t, localStorage.setItem("jhs_translate", JSON.stringify(this.cache));
            }));
        })).catch((t => {
            console.error("翻译失败:", t);
        }));
    }
    async revertTranslation() {
        $(this.getSelector().itemSelector).toArray().forEach((t => {
            let e = $(t);
            const n = e.find(".box").attr("title") || e.find(".video-title").attr("title") || e.find("img").attr("data-title");
            let a;
            c && (a = e.find(".video-title strong").text().trim());
            const i = e.find(".video-title");
            i.contents().each((function() {
                3 !== this.nodeType || "" === this.textContent.trim() || this.textContent.includes(a) || (this.textContent = " " + n + " ");
            })), i.removeAttr("title");
        }));
    }
    addJumpPageControl() {
        const t = "gemini-jump-page-control";
        if ($("#" + t).length > 0) return;
        if (0 === $(".pagination-link.is-current").length) return;
        const e = utils.getUrlParam(l, "page") || 1, n = $("<input>", {
            type: "number",
            id: "jumpPageInput",
            placeholder: "页码",
            min: "1",
            style: "width: 60px; margin-left: 10px; padding: 10px; border: 1px solid #ccc; font-size: 14px;",
            value: e + 1
        }), a = $("<button>", {
            text: "跳转",
            style: "margin-left: 5px; padding: 9px 8px; cursor: pointer; border: 1px solid #ccc; background-color: #f0f0f0; font-size: 14px;"
        }), i = $("<li>", {
            id: t
        }).append(n).append(a);
        $(".pagination-list").append(i);
        const s = () => {
            const t = parseInt(n.val(), 10);
            if (isNaN(t) || t < 1) return void n.focus();
            const e = new URL(window.location.href);
            e.searchParams.set("page", t.toString()), window.location.href = e.toString();
        };
        a.on("click", s), n.on("keypress", (function(t) {
            13 === t.which && (s(), t.preventDefault());
        }));
    }
}

class It extends G {
    constructor() {
        super(...arguments), o(this, "preloadDistance", 500), o(this, "currentPage", this.getInitialPageNumber()), 
        o(this, "pageItems", []);
    }
    getName() {
        return "AutoPagePlugin";
    }
    async initCss() {
        return "\n            <style>\n                .jhs-scroll {\n                    text-align: center;\n                    padding-top: 20px;\n                    font-size: 14px;\n                }\n                .jhs-scroll.waterfall-loading { color: #000; }\n                .jhs-scroll.waterfall-error { color: #f44336; cursor: pointer; }\n                .jhs-scroll.waterfall-no-more { color: #4CAF50; }\n            </style>\n        ";
    }
    async handle() {
        this.waterfall().then();
    }
    getInitialPageNumber() {
        if (d) {
            const t = l.match(/\/(page|star\/[^/]+)\/(\d+)/);
            return t ? parseInt(t[2], 10) : 1;
        }
        if (c) {
            const t = l.match(/[?&]page=(\d+)/);
            return t ? parseInt(t[1], 10) : 1;
        }
        return 1;
    }
    async waterfall() {
        if (await this.shouldDisablePaging()) return;
        const t = this.getSelector();
        if (this.container = document.querySelector(t.boxSelector), !this.container) return void console.error("没有找到容器节点,停止瀑布流!");
        this.loader = document.createElement("div"), this.loader.className = "jhs-scroll", 
        this.container.parentNode.insertBefore(this.loader, this.container.nextSibling), 
        this.pageItems.push({
            page: this.currentPage,
            top: 0,
            url: window.location.href
        }), this.loader.addEventListener("click", (() => {
            this.loader.classList.contains("waterfall-error") && this.loadNextPage().then();
        })), window.addEventListener("scroll", (() => {
            this.checkLoad(), this.checkScrollPosition();
        }));
        const e = document.querySelector(t.nextPageSelector);
        this.nextUrl = null == e ? void 0 : e.href, this.hasMore = !!this.nextUrl, setTimeout((() => {
            this.checkLoad();
        }), 1e3), this.hasMore || this.setState("waterfall-no-more", "已经到底了");
    }
    async loadNextPage() {
        var t;
        if (await storageManager.getSetting("autoPage", I) === T) return void this.setState("waterfall-loading", "");
        if (this.isLoading || !this.nextUrl) return;
        this.isLoading = !0, this.setState("waterfall-loading", "加载中...");
        const e = this.getSelector();
        try {
            const n = utils.getUrlParam(this.nextUrl, "page");
            let a = 60;
            if (l.includes("c11") && (a = 30), c && n > a || l.includes("month")) {
                const t = this.getBean("Beyond60Plugin");
                if (t) {
                    const {html: e, nextUrl: a, hasMore: i} = await t.handleBeyond60(this.nextUrl);
                    if (e) {
                        const t = this.container.scrollHeight;
                        this.pageItems.push({
                            page: this.currentPage + 1,
                            top: t,
                            url: this.nextUrl
                        }), $(".movie-list").append(e);
                    }
                    this.hasMore = i, this.nextUrl = a;
                    const s = t.createPagination(n, i);
                    return $(".pagination").html(s), this.setState("waterfall-loading", ""), void (this.hasMore || this.setState("waterfall-no-more", "已经到底了"));
                }
            }
            const i = await gmHttp.get(this.nextUrl);
            clog.log("请求下一页内容:", this.nextUrl);
            const s = utils.htmlTo$dom(i);
            d && s.find(".avatar-box").length > 0 && s.find(".avatar-box").parent().remove();
            let o = s.find(this.getSelector().requestDomItemSelector);
            const r = this.getBoxCarInfoList(), h = this.getBoxCarInfoList(o);
            if (this.checkDuplicateCarNumbers(r, h)) return this.nextUrl = null, this.hasMore = !1, 
            void this.setState("waterfall-error", "翻页内容出现重复数据, 页码受JavDB限制, 已停止瀑布流");
            const p = this.container.scrollHeight;
            this.pageItems.push({
                page: this.currentPage + 1,
                top: p,
                url: this.nextUrl
            });
            const g = this.getBean("ListPagePlugin");
            let m = s.find(this.getSelector().coverImgSelector);
            g.replaceHdImg(m), $(this.getSelector().boxSelector).append(o), this.nextUrl = null == (t = s.find(e.nextPageSelector)) ? void 0 : t.attr("href"), 
            this.hasMore = !!this.nextUrl;
            let u = s.find(".pagination");
            $(".pagination").replaceWith(u), this.setState("waterfall-loading", ""), this.hasMore || this.setState("waterfall-no-more", "已经到底了");
        } catch (n) {
            clog.error("加载失败:", n), this.setState("waterfall-error", "加载失败，点击重试");
        } finally {
            this.isLoading = !1;
        }
    }
    checkScrollPosition() {
        const t = window.scrollY;
        for (let e = this.pageItems.length - 1; e >= 0; e--) {
            const n = this.pageItems[e];
            if (t >= n.top) {
                this.currentPage !== n.page && (this.currentPage = n.page, this.updatePageUrl(n.url));
                break;
            }
        }
    }
    checkLoad() {
        if (!this.loader) return;
        this.loader.getBoundingClientRect().top < window.innerHeight + this.preloadDistance && this.loadNextPage().then();
    }
    async shouldDisablePaging() {
        if (!window.isListPage) return !0;
        return await storageManager.getSetting("autoPage", I), [ "search?q", "handlePlayback=1", "handleTop=1", "/want_watch_videos", "/watched_videos", "/advanced_search?type=100" ].some((t => l.includes(t)));
    }
    updatePageUrl_old(t) {
        if (window.history.pushState({}, "", t), d) {
            const e = t.match(/\/(page|star\/.*?)\/(\d+)/), n = e ? parseInt(e[2], 10) : null;
            document.title = document.title.replace(/第\d+頁/, "第" + n + "頁");
        }
    }
    updatePageUrl(t) {
        window.history.replaceState({}, "", t), d && (document.title = document.title.replace(/第\d+頁/, `第${this.currentPage}頁`));
    }
    setState(t, e) {
        this.loader.className = `jhs-scroll ${t}`, this.loader.textContent = e;
    }
}

class Bt {
    constructor(t) {
        this.baseApiUrl = "https://api.aliyundrive.com", this.refresh_token = t, this.authorization = null, 
        this.default_drive_id = null, this.backupFolderId = null;
    }
    async getDefaultDriveId() {
        return this.default_drive_id || (this.userInfo = await this.getUserInfo(), this.default_drive_id = this.userInfo.default_drive_id), 
        this.default_drive_id;
    }
    async getHeaders() {
        return this.authorization || (this.authorization = await this.getAuthorization()), 
        {
            authorization: this.authorization
        };
    }
    async getAuthorization() {
        let t = this.baseApiUrl + "/v2/account/token", e = {
            refresh_token: this.refresh_token,
            grant_type: "refresh_token"
        };
        try {
            return "Bearer " + (await gmHttp.post(t, e)).access_token;
        } catch (n) {
            throw n.message.includes("is not valid") ? new Error("refresh_token无效, 请重新填写并保存") : n;
        }
    }
    async getUserInfo() {
        const t = await this.getHeaders();
        let e = this.baseApiUrl + "/v2/user/get";
        return await gmHttp.post(e, {}, t);
    }
    async deleteFile(t, e = null) {
        if (!t) throw new Error("未传入file_id");
        e || (e = await this.getDefaultDriveId());
        let n = {
            file_id: t,
            drive_id: e
        }, a = this.baseApiUrl + "/v2/recyclebin/trash";
        const i = await this.getHeaders();
        return await gmHttp.post(a, n, i), {};
    }
    async createFolder(t, e = null, n = "root") {
        e || (e = await this.getDefaultDriveId());
        let a = this.baseApiUrl + "/adrive/v2/file/createWithFolders", i = {
            name: t,
            type: "folder",
            parent_file_id: n,
            check_name_mode: "auto_rename",
            content_hash_name: "sha1",
            drive_id: e
        };
        const s = await this.getHeaders();
        return await gmHttp.post(a, i, s);
    }
    async getFileList(t = "root", e = null) {
        e || (e = await this.getDefaultDriveId());
        let n = this.baseApiUrl + "/adrive/v3/file/list";
        const a = {
            drive_id: e,
            parent_file_id: t,
            limit: 200,
            all: !1,
            url_expire_sec: 14400,
            image_thumbnail_process: "image/resize,w_256/format,avif",
            image_url_process: "image/resize,w_1920/format,avif",
            video_thumbnail_process: "video/snapshot,t_120000,f_jpg,m_lfit,w_256,ar_auto,m_fast",
            fields: "*",
            order_by: "updated_at",
            order_direction: "DESC"
        }, i = await this.getHeaders();
        return (await gmHttp.post(n, a, i)).items;
    }
    async uploadFile(t, e, n, a = null) {
        show.info("请求存储空间中...");
        let i = this.baseApiUrl + "/adrive/v2/file/createWithFolders";
        a || (a = await this.getDefaultDriveId());
        let s = {
            drive_id: a,
            part_info_list: [ {
                part_number: 1
            } ],
            parent_file_id: t,
            name: e,
            type: "file",
            check_name_mode: "auto_rename"
        };
        const o = await this.getHeaders(), r = await gmHttp.post(i, s, o), l = r.upload_id, c = r.file_id, d = r.part_info_list[0].upload_url;
        show.info("开始上传文件..."), await this._doUpload(d, n);
        await gmHttp.post("https://api.aliyundrive.com/v2/file/complete", s = {
            drive_id: a,
            file_id: c,
            upload_id: l
        }, o);
    }
    _doUpload(t, e) {
        return new Promise(((n, a) => {
            $.ajax({
                type: "PUT",
                url: t,
                data: e,
                contentType: " ",
                processData: !1,
                success: (t, e, i) => {
                    200 === i.status ? n({}) : a(i);
                },
                error: t => {
                    clog.error("上传失败", t.responseText), a(t);
                }
            });
        }));
    }
    async getDownloadUrl(t, e = null) {
        e || (e = await this.getDefaultDriveId());
        let n = this.baseApiUrl + "/v2/file/get_download_url";
        const a = await this.getHeaders();
        let i = {
            file_id: t,
            drive_id: e
        };
        return (await gmHttp.post(n, i, a)).url;
    }
    async _createBackupFolder(t) {
        const e = await this.getFileList();
        let n = null;
        for (let a = 0; a < e.length; a++) {
            let i = e[a];
            if (i.name === t) {
                n = i;
                break;
            }
        }
        n || (show.info("不存在备份目录, 进行创建"), n = await this.createFolder(t)), this.backupFolderId = n.file_id;
    }
    async backup(t, e, n) {
        this.backupFolderId || await this._createBackupFolder(t), await this.uploadFile(this.backupFolderId, e, n);
    }
    async getBackupList(t) {
        let e;
        this.backupFolderId || await this._createBackupFolder(t), e = await this.getFileList(this.backupFolderId);
        const n = [];
        return e.forEach((t => {
            n.push({
                name: t.name,
                fileId: t.file_id,
                createTime: t.created_at,
                size: t.size
            });
        })), n;
    }
}

class Pt {
    constructor(t, e, n) {
        this.davUrl = t.endsWith("/") ? t : t + "/", this.username = e, this.password = n, 
        this.folderName = null;
    }
    _getAuthHeaders() {
        return {
            Authorization: `Basic ${btoa(`${this.username}:${this.password}`)}`,
            Depth: "1"
        };
    }
    _sendRequest(t, e, n = {}, a) {
        return new Promise(((i, s) => {
            const o = this.davUrl + e, r = {
                ...this._getAuthHeaders(),
                ...n
            };
            GM_xmlhttpRequest({
                method: t,
                url: o,
                headers: r,
                data: a,
                onload: t => {
                    t.status >= 200 && t.status < 300 ? i(t) : (console.error(t), s(new Error(`请求失败 ${t.status}: ${t.statusText}`)));
                },
                onerror: t => {
                    console.error("请求WebDav发生错误:", t), s(new Error("请求WebDav失败, 请检查服务是否启动, 凭证是否正确"));
                }
            });
        }));
    }
    async backup(t, e, n) {
        await this._sendRequest("MKCOL", t);
        const a = t + "/" + e;
        await this._sendRequest("PUT", a, {
            "Content-Type": "text/plain"
        }, n);
    }
    async getFileList(t) {
        var e, n, a;
        const i = (await this._sendRequest("PROPFIND", t, {
            "Content-Type": "application/xml"
        }, '<?xml version="1.0"?>\n                <d:propfind xmlns:d="DAV:">\n                    <d:prop>\n                        <d:displayname />\n                        <d:getcontentlength />\n                        <d:creationdate />\n                        <d:getlastmodified />\n                        <d:iscollection />\n                    </d:prop>\n                </d:propfind>\n            ')).responseText, s = (new DOMParser).parseFromString(i, "text/xml").getElementsByTagNameNS("DAV:", "response"), o = [];
        for (let r = 0; r < s.length; r++) {
            if (0 === r) continue;
            let t = s[r];
            console.log(t);
            const i = t.getElementsByTagNameNS("DAV:", "displayname")[0].textContent, l = (null == (e = t.getElementsByTagNameNS("DAV:", "getcontentlength")[0]) ? void 0 : e.textContent) || "0", c = (null == (n = t.getElementsByTagNameNS("DAV:", "creationdate")[0]) ? void 0 : n.textContent) || (null == (a = t.getElementsByTagNameNS("DAV:", "getlastmodified")[0]) ? void 0 : a.textContent) || "";
            "0" !== l && o.push({
                fileId: i,
                name: i,
                size: Number(l),
                createTime: c
            });
        }
        return o.reverse(), o;
    }
    async deleteFile(t) {
        let e = this.folderName + "/" + encodeURI(t);
        await this._sendRequest("DELETE", e, {
            "Cache-Control": "no-cache"
        });
    }
    async getBackupList(t) {
        return this.folderName = t, await this._sendRequest("MKCOL", t), this.getFileList(t);
    }
    async getFileContent(t) {
        let e = this.folderName + "/" + t;
        return (await this._sendRequest("GET", e, {
            Accept: "application/octet-stream"
        })).responseText;
    }
}

class Dt extends G {
    constructor() {
        super(...arguments), o(this, "folderName", "JHS-数据备份"), o(this, "cacheItems", [ {
            key: "jhs_dmm_video",
            text: "🎥 预览视频缓存",
            title: "预览视频缓存"
        }, {
            key: "jhs_other_site",
            text: "🌍 第三方站点缓存",
            title: "第三方站点资源检测结果, 如missav,123Av等"
        }, {
            key: "jhs_screenShot",
            text: "🖼️ 缩略图缓存",
            title: "缩略图缓存"
        }, {
            key: "jhs_translate",
            text: "🆎 标题翻译",
            title: "标题翻译"
        }, {
            key: "jhs_actress_info",
            text: "👩 演员信息",
            title: "演员的年龄三围等数据信息"
        }, {
            key: "jhs_score_info",
            text: "⭐ Top250|热播 评分数据",
            title: "Top250及热播的评分数据"
        } ]);
    }
    getName() {
        return "SettingPlugin";
    }
    async initCss() {
        const t = await storageManager.getSetting();
        let e = (null == t ? void 0 : t.containerWidth) ?? "100", n = utils.isMobile() && window.innerWidth < 1e3 ? 1 : (null == t ? void 0 : t.containerColumns) ?? 5;
        this.applyImageMode().then();
        let a = `\n            section .container{\n                max-width: 1000px !important;\n                min-width: ${e}%;\n            }\n            .movie-list, .movie-list.v{\n                grid-template-columns: repeat(${n}, minmax(0, 1fr));\n            }\n        `;
        return d && (a = `\n                .container-fluid .row{\n                    max-width: 1000px !important;\n                    min-width: ${e}%;\n                    margin: auto auto;\n                }\n                \n                .container {\n                    max-width: 1000px !important;\n                    min-width: 80%;\n                    margin: auto auto;\n                }\n                \n                .masonry {\n                    grid-template-columns: repeat(${n}, minmax(0, 1fr));\n                }\n            `), 
        `\n            <style>\n                ${a}\n                .nav-btn::after {\n                    content:none !important;\n                }\n                \n                #cache-data-display pre {\n                    font-family: Consolas, Monaco, 'Andale Mono', monospace;\n                    white-space: pre-wrap;\n                    word-wrap: break-word;\n                    line-height: 1.5;\n                    color: #333;\n                    border: 1px solid #ddd;\n                }\n                \n                .cache-item {\n                    transition: all 0.2s ease;\n                }\n                .cache-item:hover {\n                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);\n                    transform: translateY(-2px);\n                }\n\n                .tooltip-icon {\n                    display: inline-block;\n                    width: 16px;\n                    height: 16px;\n                    line-height: 16px;\n                    text-align: center;\n                    border-radius: 50%;\n                    background-color: #ccc;\n                    color: white;\n                    font-size: 12px;\n                    margin-right: 5px;\n                    cursor: help;\n                }\n                .setting-item {\n                    display: flex;\n                    align-items: baseline;\n                    justify-content: space-between;\n                    margin-bottom: 3px;\n                    padding: 3px;\n                    /*border: 1px solid #ddd;\n                    border-radius: 5px;*/\n                }\n                .simple-setting .setting-item{\n                    align-items:center;\n                }\n                .setting-label {\n                    font-size: 14px;\n                    min-width: 160px;\n                    font-weight: bold;\n                    margin-right: 10px;\n                }\n                .form-content{\n                    max-width: 160px;\n                    min-width: 160px;\n                }\n                .form-content * {\n                    width: 100%;\n                    padding: 5px;\n                    margin-right: 10px;\n                    text-align: center;\n                }\n                \n                .keyword-label {\n                    display: inline-flex;\n                    align-items: center;\n                    padding: 4px 8px;\n                    border-radius: 4px;\n                    font-size: 14px;\n                    position: relative;\n                    margin-left: 8px;\n                    margin-bottom: 5px;\n                }\n                .keyword-remove {\n                    margin-left: 6px;\n                    cursor: pointer;\n                    font-size: 12px;\n                    line-height: 1;\n                }\n                .keyword-input {\n                    padding: 6px 12px;\n                    border: 1px solid #ccc;\n                    border-radius: 4px;\n                    font-size: 14px;\n                    float:right;\n                }\n                .add-tag-btn {\n                    padding: 6px 12px;\n                    background-color: #e2e8f0;\n                    color: #334155;\n                    border: none;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 14px;\n                    margin-left: 8px;\n                    float:right;\n                }\n                .add-tag-btn:hover {\n                    background-color: #cbd5e1;\n                }\n                .tag-box {\n                    margin-top:15px;\n                }\n                \n                \n                #saveBtn,#moreBtn,#helpBtn,#clean-all {\n                    padding: 8px 20px;\n                    background-color: #4CAF50;\n                    color: white;\n                    border: none;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 16px;\n                    margin-top: 10px;\n                }\n                #saveBtn:hover {\n                    background-color: #45a049;\n                }\n                #moreBtn {\n                    background-color: #5cb85c;\n                    color: white;\n                }\n                #moreBtn:hover {\n                    background-color: #4cae4c;\n                }\n                #helpBtn {\n                    background-color: #e67e22;\n                    color: white;\n                }\n                #helpBtn:hover {\n                    background-color: #d35400;\n                }\n                .simple-setting, .mini-simple-setting {\n                    display: none;\n                    background: rgba(255,255,255,1); \n                    position: absolute;\n                    top: ${c ? "35px" : "25px"};\n                    right: ${c ? "-300%" : "0"};\n                    z-index: 1000;\n                    border: 1px solid #ddd;\n                    border-radius: 4px;\n                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);\n                    padding: 0;\n                    margin-top: 5px; /* 稍微拉开一点距离 */\n                    color: #333;\n                }\n                \n                .mini-switch {\n                  appearance: none;\n                  -webkit-appearance: none;\n                  width: 40px;\n                  height: 20px;\n                  background: #e0e0e0;\n                  border-radius: 20px;\n                  position: relative;\n                  cursor: pointer;\n                  outline: none;\n                  /*transition: all 0.2s ease;*/\n                }\n                \n                .mini-switch:checked {\n                  background: #4CAF50;\n                }\n                \n                .mini-switch::before {\n                  content: "";\n                  position: absolute;\n                  width: 16px;\n                  height: 16px;\n                  border-radius: 50%;\n                  background: white;\n                  top: 2px;\n                  left: 2px;\n                  box-shadow: 0 1px 3px rgba(0,0,0,0.2);\n                  /*transition: all 0.2s ease;*/\n                }\n                \n                .mini-switch:checked::before {\n                  left: calc(100% - 18px);\n                }\n                \n                .side-menu-item {\n                    padding: 12px 12px;\n                    cursor: pointer;\n                    color: #333;\n                    border-left: 3px solid transparent;\n                    transition: all 0.2s;\n                    display: flex;\n                    gap: 5px;\n                }\n                \n                .side-menu-item .icon {\n                     height: 24px; \n                     width: 24px;\n                }\n                \n                .side-menu-item:hover {\n                    background-color: #e9e9e9;\n                }\n                \n                .side-menu-item.active {\n                    background-color: #e0e0e0;\n                    border-left: 3px solid #5d87c2;\n                    font-weight: bold;\n                }\n                \n                .content-panel {\n                    display: none;\n                    margin-top:20px;\n                    padding: 0 10px 10px 0;\n                    height: 100%;\n                    overflow-x: hidden;\n                    overflow-y: auto;\n                }\n                \n                .content-panel.active {\n                    display: block;\n                }\n                \n                input[type="checkbox"]:disabled {\n                    opacity: 0.6; \n                    cursor: default !important;\n                }\n            </style>\n        `;
    }
    async handle() {
        if (await storageManager.getSetting("enableClog", I) === I && clog.show(), c) {
            let t = function() {
                $(".navbar-search").is(":hidden") ? ($(".mini-setting-box").hide(), $(".setting-box").show()) : ($(".mini-setting-box").show(), 
                $(".setting-box").hide());
            };
            $("#navbar-menu-user .navbar-end").prepend('<div class="navbar-item has-dropdown is-hoverable setting-box" style="position:relative;">\n                    <a id="setting-btn" class="navbar-link nav-btn" style="color: #ff8400 !important;padding-right:15px !important;">\n                        设置\n                    </a>\n                    <div class="simple-setting"></div>\n                </div>'), 
            utils.loopDetector((() => $("#miniHistoryBtn").length > 0), (() => {
                $(".miniHistoryBtnBox").before('\n                    <div class="navbar-item mini-setting-box" style="position:relative;margin-left: auto;">\n                        <a id="mini-setting-btn" class="navbar-link nav-btn" style="color: #ff8400 !important;padding-left:0 !important;padding-right:0 !important;">\n                            设置\n                        </a>\n                        <div class="mini-simple-setting"></div>\n                    </div>\n                '), 
                t();
            })), $(window).resize(t);
        }
        d && (utils.loopDetector((() => $("#waitCheckBtn").length), (() => {
            $("#waitCheckBtn").parent().append('\n                    <div id="top-right-box" style="position: relative; display: flex; flex-grow: 1;justify-content: flex-end;z-index: 12345679 !important;">\n                        <div class="setting-box">\n                            <a id="setting-btn" class="menu-btn main-tab-btn" style="background-color:#6e685e !important;">\n                                <span>设置</span>\n                            </a>\n                            <div class="simple-setting"></div>\n                        </div>\n                    </div>\n               ');
        }), 1, 1e4, !1), isDetailPage && $("h3").before('\n                    <div class="container-fluid" style="margin-top:20px">\n                        <div id="top-right-box" style="position: relative; display: flex; flex-grow: 1;justify-content: flex-end;z-index: 12345679 !important;">\n                            <div class="setting-box">\n                                <a id="setting-btn" class="menu-btn main-tab-btn" style="background-color:#6e685e !important;">\n                                    <span>设置</span>\n                                </a>\n                                <div class="simple-setting"></div>\n                            </div>\n                        </div>\n                    </div>\n               ')), 
        $(".main-nav, .container-fluid").on("click", "#setting-btn, #mini-setting-btn", (() => {
            clog.lowZIndex(), this.openSettingDialog();
        })), $(".main-nav, .container-fluid").on("mouseenter", ".setting-box", (async () => {
            $(".simple-setting").html(await this.simpleSetting()).show(), this.initSimpleSettingForm().then(), 
            clog.lowZIndex();
        })).on("mouseleave", ".setting-box", (() => {
            $(".simple-setting").html("").hide();
        })), $(".main-nav, .container-fluid").on("mouseenter", ".mini-setting-box", (async () => {
            $(".mini-simple-setting").html(await this.simpleSetting()).show(), this.initSimpleSettingForm().then(), 
            clog.lowZIndex();
        })).on("mouseleave", ".mini-setting-box", (() => {
            $(".mini-simple-setting").html("").hide();
        }));
    }
    async openSettingDialog(t = "backup-panel", e) {
        const n = this.cacheItems.map((t => `\n            <div class="cache-item" style="border: 1px solid #eee; border-radius: 8px; padding: 12px;">\n                <div style="font-weight: bold; margin-bottom: 8px;">${t.text}</div>\n                <div style="display: flex; gap: 8px;">\n                    <a class="menu-btn clean-btn" data-key="${t.key}" style="background-color:#448cc2; flex:1; text-align:center;" title="${t.title}">\n                        <span>清理</span>\n                    </a>\n                    <a class="menu-btn view-btn" data-key="${t.key}" style="background-color:#b2bec0; flex:1; text-align:center;" >\n                        <span>查看</span>\n                    </a>\n                </div>\n            </div>\n        `)).join("");
        let a = "";
        F.forEach((t => {
            t.canSelect && (a += `<option value="${t.quality}">${t.text}</option>`);
        }));
        const i = this.getBean("CoverButtonPlugin");
        let s = `\n            <div style="display: flex; height: 100%;">\n                <div style="width: 140px; flex-shrink: 0; padding: 15px 0; background: #f5f5f5; border-right: 1px solid #ddd;">\n                    <div class="side-menu-item ${"backup-panel" === t ? "active" : ""}" data-panel="backup-panel">💾 数据备份</div>\n                    <div class="side-menu-item ${"base-panel" === t ? "active" : ""}" data-panel="base-panel">⚙️ 基础配置</div>\n                    <div class="side-menu-item ${"filter-panel" === t ? "active" : ""}" data-panel="filter-panel">🚫 屏蔽配置</div>\n                    <div class="side-menu-item ${"task-panel" === t ? "active" : ""}" data-panel="task-panel">📋 定时任务</div>\n                    <div class="side-menu-item ${"domain-panel" === t ? "active" : ""}" data-panel="domain-panel" title="第三方视频资源域名配置">🌐 外部网站</div>\n                    <div class="side-menu-item ${"hotkey-panel" === t ? "active" : ""}" data-panel="hotkey-panel">⌨️ 快捷键配置</div>\n                    <div class="side-menu-item ${"cache-panel" === t ? "active" : ""}" data-panel="cache-panel">🧹 清理缓存</div>\n                    <div class="side-menu-item ${"tip-author-panel" === t ? "active" : ""}" data-panel="tip-author-panel">💵 打赏作者</div>\n                </div>\n        \n                <div style="flex: 1; display: flex; flex-direction: column; height: 100%; ">\n                    <div style="flex: 1; margin: 0 10px; padding-bottom: 20px;overflow: hidden">\n                    \n                        \x3c!-- 阿里云盘面板 --\x3e\n                        <div id="backup-panel" class="content-panel" style="display: ${"backup-panel" === t ? "block" : "none"};">\n                            <div style="margin-bottom: 20px">\n                                <a id="importBtn" class="menu-btn" style="background-color:#d25a88"><span>导入数据</span></a>\n                                <a id="exportBtn" class="menu-btn" style="background-color:#85d0a3"><span>导出数据</span></a>\n                                <a id="getRefreshTokenBtn" class="menu-btn fr-btn" style="background-color:#c4a35e"><span>获取refresh_token</span></a>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">阿里云盘备份</span>\n                                <div>\n                                    <a id="backupListBtn" class="menu-btn" style="background-color:#5d87c2"><span>查看备份</span></a>\n                                    <a id="backupBtn" class="menu-btn" style="background-color:#64bb69"><span>备份数据</span></a>\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">refresh_token:</span>\n                                <div class="form-content">\n                                    <input id="refresh_token">\n                                </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">WebDav备份</span>\n                                <div>\n                                    <a id="webdavBackupListBtn" class="menu-btn" style="background-color:#5d87c2"><span>查看备份</span></a>\n                                    <a id="webdavBackupBtn" class="menu-btn" style="background-color:#64bb69"><span>备份数据</span></a>\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">服务地址:</span>\n                                <div class="form-content">\n                                    <input id="webDavUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">用户名:</span>\n                                <div class="form-content">\n                                    <input id="webDavUsername">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">密码:</span>\n                                <div class="form-content">\n                                    <input id="webDavPassword">\n                                </div>\n                            </div>\n                        </div>\n                        \n                        \n                        \x3c!-- 基础设置面板 --\x3e\n                        <div id="base-panel" class="content-panel" style="display: ${"base-panel" === t ? "block" : "none"};">\n                            <div class="setting-item">\n                                <span class="setting-label">已鉴定标签展示位置:</span>\n                                <div class="form-content">\n                                    <select id="tagPosition">\n                                        <option value="rightTop">右上</option>\n                                        <option value="leftTop">左上</option>\n                                    </select>\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">已鉴定内容处理方式:</span>\n                                <div class="form-content">\n                                    <select id="movieShowType">\n                                        <option value="hide">隐藏</option>\n                                        <option value="visibility">透明</option>\n                                    </select>\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    鉴定补录演员信息 <span data-tip="在列表页进行鉴定是获取不到演员名称的, 开启后, 额外解析详情页补录演员名称, 因发请求解析费时, 会被以往慢1秒左右">❓</span>\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableSaveActressCarInfo" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div class="setting-item" style="margin-top:10px">\n                                <span class="setting-label">\n                                    列表页功能按钮\n                                </span>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">按钮-打开待鉴定:</span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="showWaitCheckBtn" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">按钮-打开已收藏:</span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="showWaitDownBtn" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">打开待鉴定|已收藏 窗口数:</span>\n                                <div class="form-content">\n                                    <input type="number" id="waitCheckCount" min="1" max="20" style="width: 100%;">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">随机打开已收藏:</span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="randomOpenWaitDown" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div class="setting-item" style="margin-top:10px">\n                                <span class="setting-label">\n                                    封面快捷按钮\n                                </span>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    ${i.screenSvg}长缩略图:\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableScreenSvg" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    ${i.videoSvg}预览视频:\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableVideoSvg" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    ${i.handleSvg}鉴定按钮:\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableHandleSvg" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    ${i.siteSvg}第三方跳转:\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableSiteSvg" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label" style="display:flex; align-items:center; gap:5px">\n                                    ${i.copySvg}复制按钮:\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableCopySvg" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n\n                            <div class="setting-item">\n                                <span class="setting-label">预览视频默认画质:</span>\n                                <div class="form-content">\n                                    <select id="videoQuality">\n                                        ${a}\n                                    </select>\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">评论区条数:</span>\n                                <div class="form-content">\n                                    <select id="reviewCount">\n                                        <option value="10">10条</option>\n                                        <option value="20">20条</option>\n                                        <option value="30">30条</option>\n                                        <option value="40">40条</option>\n                                        <option value="50">50条</option>\n                                    </select>\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item ${c ? "" : "do-hide"}">\n                                <span class="setting-label">\n                                    高亮已收藏演员 <span data-tip="详情页, 对已收藏的演员进行边框高亮提醒">❓</span>\n                                </span>\n                                <div class="form-content">\n                                    <input type="checkbox" id="enableFavoriteActresses" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item ${c ? "" : "do-hide"}">\n                                <span id="highlightedTagLabel" class="setting-label">\n                                    分类标签|高亮演员-边框样式:\n                                </span>\n                                <div class="form-content" style="display: flex; align-items: center;">\n                                    <input type="number" id="highlightedTagNumber" min="0" max="20">\n                                    <input type="color" id="highlightedTagColor">\n                                </div>\n                            </div>\n\n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">请求超时时间(毫秒):</span>\n                                <div class="form-content">\n                                    <input type="number" id="httpTimeout" min="1000" max="10000" style="width: 100%;">\n                                </div>\n                            </div>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">请求失败重试次数:</span>\n                                <div class="form-content">\n                                    <input type="number" id="httpRetryCount" min="0" max="10" style="width: 100%;">\n                                </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div class="setting-item">\n                                <span class="setting-label">\n                                    启用控制台日志:\n                                </span>\n                                <div class="form-content">\n                                    <select id="enableClog">\n                                        <option value="no">禁用</option>\n                                        <option value="yes">开启</option>\n                                    </select>\n                                </div>\n                            </div>\n\n                            <div class="setting-item">\n                                <span class="setting-label">日志最大行数:</span>\n                                <div class="form-content">\n                                    <input type="number" id="clogMsgCount" min="100" max="3000" style="width: 100%;">\n                                </div>\n                            </div>\n                        </div>\n                        \n                        \x3c!-- 定时任务 --\x3e\n                        <div id="task-panel" class="content-panel" style="display: ${"task-panel" === t ? "block" : "none"};">\n                        \n                            <div class="setting-item">\n                                <span class="setting-label">请求并发数量:</span>\n                                <div class="form-content">\n                                    <input type="number" id="checkConcurrencyCount" min="2" max="5" style="width: 100%;">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">请求间隔时间(毫秒):</span>\n                                <div class="form-content">\n                                    <input type="number" id="checkRequestSleep" min="0" max="3000" style="width: 100%;">\n                                </div>\n                            </div>\n                        \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                        \n                            <div id="setting-blacklist" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;">\n                                <span style="font-size: 14px; font-weight: bold; padding:3px">自动检测屏蔽黑名单演员</span>\n                                <div class="setting-item">\n                                    <span class="setting-label">\n                                        任务开关: <span data-tip="变更后, 刷新页面生效">❓</span> \n                                    </span>\n                                    <div class="form-content">\n                                        <select id="enableCheckBlacklist">\n                                            <option value="no">禁用</option>\n                                            <option value="yes">开启</option>\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">任务间隔时间:</span>\n                                    <div class="form-content">\n                                         <select id="checkBlacklist_intervalTime">\n                                            <option value="2">每2小时</option>\n                                            <option value="3">每3小时</option>\n                                            <option value="6">每6小时</option>\n                                            <option value="12">每12小时</option>\n                                            <option value="24">每24小时</option>\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">检测规则:</span>\n                                    <div class="form-content">\n                                         <select id="checkBlacklist_ruleTime">\n                                            <option value="0">全部检测</option>\n                                            <option value="8760">不检测停更1年以上</option>\n                                            <option value="17520">不检测停更2年以上</option>\n                                            <option value="26280">不检测停更3年以上</option>\n                                        </select>\n                                    </div>\n                                </div>\n                            </div>\n                        \n                            <div id="setting-checkFavoriteActress" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;" class="${c ? "" : "do-hide"}">\n                                <span style="font-size: 14px; font-weight: bold; padding:3px">自动同步已收藏的演员</span>\n                                <div class="setting-item">\n                                    <span class="setting-label">\n                                        任务开关: <span data-tip="变更后, 刷新页面生效">❓</span> \n                                    </span>\n                                    <div class="form-content">\n                                        <select id="enableCheckFavoriteActress">\n                                            <option value="no">禁用</option>\n                                            <option value="yes">开启</option>\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">任务间隔时间:</span>\n                                    <div class="form-content">\n                                         <select id="checkFavoriteActress_IntervalTime">\n                                            <option value="12">每12小时</option>\n                                            <option value="24">每24小时</option>\n                                        </select>\n                                    </div>\n                                </div>\n                            </div>\n                        \n                            <div id="setting-checkNewVideo" style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;" class="${c ? "" : "do-hide"}">\n                                <span style="font-size: 14px; font-weight: bold; padding:3px">自动检测已收藏演员的最新作品</span>\n                                <div class="setting-item">\n                                    <span class="setting-label">\n                                        任务开关: <span data-tip="变更后, 刷新页面生效">❓</span> \n                                    </span>\n                                    <div class="form-content">\n                                        <select id="enableCheckNewVideo">\n                                            <option value="no">禁用</option>\n                                            <option value="yes">开启</option>\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">任务间隔时间:</span>\n                                    <div class="form-content">\n                                         <select id="checkNewVideo_intervalTime">\n                                            <option value="2">每2小时</option>\n                                            <option value="3">每3小时</option>\n                                            <option value="6">每6小时</option>\n                                            <option value="12">每12小时</option>\n                                            <option value="24">每24小时</option>\n                                        </select>\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">检测规则:</span>\n                                    <div class="form-content">\n                                         <select id="checkNewVideo_ruleTime">\n                                            <option value="0">全部检测</option>\n                                            <option value="8760">不检测停更1年以上</option>\n                                            <option value="17520">不检测停更2年以上</option>\n                                            <option value="26280">不检测停更3年以上</option>\n                                        </select>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>               \n         \n                        \x3c!-- 域名设置面板 --\x3e\n                        <div id="domain-panel" class="content-panel" style="display: ${"domain-panel" === t ? "block" : "none"};">\n                            <div class="setting-item">\n                                <span class="setting-label">域名 - MissAv:</span>\n                                <div class="form-content">\n                                    <input id="missAvUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">域名 - Jable:</span>\n                                <div class="form-content">\n                                    <input id="jableUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">域名 - Avgle:</span>\n                                <div class="form-content">\n                                    <input id="avgleUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">域名 - JavTrailer:</span>\n                                <div class="form-content">\n                                    <input id="javTrailersUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">域名 - 123Av:</span>\n                                <div class="form-content">\n                                    <input id="av123Url">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">域名 - JavDb:</span>\n                                <div class="form-content">\n                                    <input id="javDbUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">域名 - JavBus:</span>\n                                <div class="form-content">\n                                    <input id="javBusUrl">\n                                </div>\n                            </div>\n                            <div class="setting-item">\n                                <span class="setting-label">域名 - SupJav:</span>\n                                <div class="form-content">\n                                    <input id="supJavUrl">\n                                </div>\n                            </div>           \n                        </div>\n                         \n                         \x3c!-- 快捷键 --\x3e\n                        <div id="hotkey-panel" class="content-panel" style="display: ${"hotkey-panel" === t ? "block" : "none"};">\n                            <p style="color: #c62222; font-size: 14px;font-weight: bold;margin-bottom: 10px;">快捷键修改后, 刷新页面生效</p>\n                            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;">\n                                <div class="setting-item">\n                                    <span class="setting-label">${v}:</span>\n                                    <div class="form-content">\n                                        <input id="filterHotKey" placeholder="录入快捷键" data-default-hotkey="a">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">${w}:</span>\n                                    <div class="form-content">\n                                        <input id="favoriteHotKey" placeholder="录入快捷键" data-default-hotkey="s">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">${k}:</span>\n                                    <div class="form-content">\n                                        <input id="hasDownHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">${C}:</span>\n                                    <div class="form-content">\n                                        <input id="hasWatchHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>\n                                \n                                <div class="setting-item">\n                                    <span class="setting-label">\n                                        <span data-tip="列表页,鼠标放置图片上时可使用快捷键">❓ </span> 对视频列表页启用快捷键:\n                                    </span>\n                                    <div class="form-content">\n                                        <input type="checkbox" id="enableImageHotKey" class="mini-switch">\n                                    </div>\n                                </div>\n                            </div>\n                            \n                            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;">\n                                <div class="setting-item">\n                                    <span class="setting-label">⏩ 快进:</span>\n                                    <div class="form-content">\n                                        <input id="speedVideoHotKey" placeholder="录入快捷键" data-default-hotkey="z">\n                                    </div>\n                                </div>\n                                \n                                <div class="setting-item">\n                                    <span class="setting-label">▲ 折叠:</span>\n                                    <div class="form-content">\n                                        <input id="foldCategoryHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>\n                                \n                                <div class="setting-item">\n                                    <span class="setting-label">💻 控制台:</span>\n                                    <div class="form-content">\n                                        <input id="clogHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>\n                            </div>\n\n\n                            <div style="border: 1px solid #ccc; padding: 10px; margin-bottom: 15px;">\n                                <span style="font-size: 14px; font-weight: bold; padding:3px">显示已鉴定内容</span>\n                                <div class="setting-item">\n                                    <span class="setting-label">屏蔽单番号:</span>\n                                    <div class="form-content">\n                                        <input id="showFilterItemHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">屏蔽演员:</span>\n                                    <div class="form-content">\n                                        <input id="showFilterActorItemHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">屏蔽关键词:</span>\n                                    <div class="form-content">\n                                        <input id="showFilterKeywordItemHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">收藏:</span>\n                                    <div class="form-content">\n                                        <input id="showFavoriteItemHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">已下载:</span>\n                                    <div class="form-content">\n                                        <input id="showHasDownItemHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">已观看:</span>\n                                    <div class="form-content">\n                                        <input id="showHasWatchItemHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>\n                                <div class="setting-item">\n                                    <span class="setting-label">显示所有:</span>\n                                    <div class="form-content">\n                                        <input id="showAllItemHotKey" placeholder="录入快捷键">\n                                    </div>\n                                </div>                                \n                            </div>\n\n                        </div>\n                        \n                        \x3c!-- 屏蔽设置面板 --\x3e\n                        <div id="filter-panel" class="content-panel" style="display: ${"filter-panel" === t ? "block" : "none"};">\n                            <div class="setting-item">\n                                <span class="setting-label">\n                                     启用划词屏蔽 <span data-tip="视频详情页中, 标题或评论区选中文字, 按右键可快捷加入屏蔽词">❓ </span>\n                                </span>\n                                <div style="display: flex">\n                                    <input type="checkbox" id="enableTitleSelectFilter" class="mini-switch">\n                                </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div id="reviewKeywordContainer">\n                                <div class="setting-item">\n                                    <span class="setting-label">评论区屏蔽词:</span>\n                                    <div style="display: flex">\n                                        <input type="text" class="keyword-input" placeholder="添加屏蔽词">\n                                        <button class="add-tag-btn">添加</button>\n                                    </div>\n                                </div>\n                                <div class="tag-box"> </div>\n                            </div>\n                            \n                            <hr style="border: 0; height: 1px; margin:20px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                            \n                            <div id="filterKeywordContainer">\n                                <div class="setting-item">\n                                    <span class="setting-label">视频标题屏蔽词:</span>\n                                    <div style="display: flex">\n                                        <input type="text" class="keyword-input" placeholder="添加屏蔽词">\n                                        <button class="add-tag-btn">添加</button>\n                                    </div>\n                                </div>\n                                <div class="tag-box"> </div>\n                            </div>\n                        </div>\n                        <div id="cache-panel" class="content-panel" style="display: ${"cache-panel" === t ? "block" : "none"};">\n                            <h1 style="text-align:center;font-size: 20px;font-weight: bold">以下操作, 不会对核心数据造成影响</h1>\n                            <br/>               \n                            <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; margin-top: 20px;">\n                                ${n}\n                            </div>    \n                            <div id="cache-data-display" style="margin-top: 20px; display: none;">\n                                <pre style="background: #f5f5f5; padding: 10px; border-radius: 5px; max-height: 400px; overflow: auto;"></pre>\n                            </div>\n                        </div>                        \n                        <div id="tip-author-panel" class="content-panel" style="display: ${"tip-author-panel" === t ? "block" : "none"};">\n                            <p style="color: #666; font-size: 0.9em;">如果JAV-JHS给您带来了便捷和价值，请考虑给予一点支持，您的鼓励是我持续创作的最大动力！感谢您的慷慨支持！</p>\n                            <div>\n                                <div style="display: flex; justify-content: space-around; align-items: flex-start; margin-bottom: 20px; flex-wrap: wrap;">\n                                    <div style="text-align: center; margin: 10px; flex: 1 1 30%; min-width: 150px;">\n                                        <img src="https://imgur.com/AvF0r3r.png" alt="TRC20-USDT二维码" style="width: 350px; height: 350px; border: 1px solid #ddd; padding: 5px; display: block; margin: 0 auto 5px;">\n                                        <p>TRC20-USDT</p>\n                                        <input type="text" readonly value="TYphgzpJ2hoDTa3J7kzj5xaHWbcPAyhbd5" onclick="this.select();document.execCommand('copy');alert('地址已复制！');" \n                                            style="width: 90%; padding: 5px; margin-top: 5px; border: 1px solid #a99087; background-color: #fff; text-align: center; font-size: 0.8em; cursor: pointer; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">\n                                        <p style="font-size: 0.75em; color: #5a504c; margin-top: 4px;">点击地址可复制</p>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    \n                    <div style="flex-shrink: 0; padding: 15px 20px; text-align: right; border-top: 1px solid #eee; background: white;">   \n                        <button id="saveBtn">保存设置</button>\n                        <button id="clean-all" style="display: none">♾️ 清理全部缓存</button>\n                    </div>\n                </div>\n            </div>\n        `;
        layer.open({
            type: 1,
            title: "设置",
            content: s,
            area: utils.getResponsiveArea([ "55%", "90%" ]),
            scrollbar: !1,
            success: (t, n) => {
                $(t).find(".layui-layer-content").css("position", "relative"), this.loadForm(), 
                this.bindClick(), utils.setupEscClose(n), e && e();
            },
            end: () => {
                this.getBean("CoverButtonPlugin").enableSvgBtn();
            }
        });
    }
    async simpleSetting() {
        let t = await storageManager.getSetting();
        const e = t.showFilterItemHotKey, n = t.showFilterActorItemHotKey, a = t.showFilterKeywordItemHotKey, i = t.showFavoriteItemHotKey, s = t.showHasDownItemHotKey, o = t.showHasWatchItemHotKey, r = t.showAllItemHotKey;
        return `\n             <div class="jhs-scrollbar" style="margin-top:20px;max-height:90vh; overflow-y:auto;">\n                <div style="margin: 0 10px;">\n                    <div class="setting-item">\n                        <span class="setting-label">\n                            显示已鉴定内容:\n                        </span>\n                        <div class="form-content" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end;">\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">屏蔽单番号${e ? `(${e})` : ""}: </span><input type="checkbox" id="showFilterItem" class="mini-switch"><br/>\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">屏蔽演员${n ? `(${n})` : ""}: </span><input type="checkbox" id="showFilterActorItem" class="mini-switch"><br/>\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">屏蔽关键词${a ? `(${a})` : ""}: </span><input type="checkbox" id="showFilterKeywordItem" class="mini-switch"><br/>\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">收藏${i ? `(${i})` : ""}: </span><input type="checkbox" id="showFavoriteItem" class="mini-switch"><br/>\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">已下载${s ? `(${s})` : ""}: </span><input type="checkbox" id="showHasDownItem" class="mini-switch"><br/>\n                            <span style="display:inline-block; width: 100px; font-size:13px; font-weight:bold; text-align: left">已观看${o ? `(${o})` : ""}: </span><input type="checkbox" id="showHasWatchItem" class="mini-switch"><br/>\n                        </div>\n                    </div>\n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="快速显示所有已鉴定内容,减少对以上开关的频繁操作">❓ </span> 显示所有${r ? `(${r})` : ""}:\n                        </span>\n                        <div class="form-content" style="display: flex; flex-wrap: wrap; align-items: center; justify-content: flex-end;">\n                            <input type="checkbox" id="showAllItem" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <hr style="border: 0; height: 1px; margin:10px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="点击封面的打开方式,弹窗|新窗口">❓ </span>弹窗方式打开页面:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                             <input type="checkbox" id="dialogOpenDetail" class="mini-switch">\n                        </div>\n                    </div>      \n                    \n                    <div class="setting-item">\n                        <span class="setting-label">鉴定后立即关闭页面:</span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="needClosePage" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <hr style="border: 0; height: 1px; margin:10px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n\n                    <div class="setting-item">\n                        <span class="setting-label">\n                             <span data-tip="使用瀑布流模式, 排序方式将调整为默认">❓ </span>瀑布流模式:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="autoPage" class="mini-switch">\n                        </div>\n                    </div>\n       \n                    <div class="setting-item">\n                        <span class="setting-label">启用标题翻译:</span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="translateTitle" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">启用悬浮大图:</span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="hoverBigImg" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                                        \n                    <div class="setting-item">\n                        <span class="setting-label">启用115视频匹配: </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enable115Match" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <hr style="border: 0; height: 1px; margin:10px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n\n                    ${c ? '\n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="详情页是否展示女优年龄、三围等信息">❓ </span>加载女优信息:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enableLoadActressInfo" class="mini-switch">\n                        </div>\n                    </div>' : ""}\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="详情页第三方资源检测,如missAv,123AV">❓ </span>加载第三方视频资源:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enableLoadOtherSite" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="详情页图片区首列位置加载长缩略图">❓ </span>加载长缩略图:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enableLoadScreenShot" class="mini-switch">\n                        </div>\n                    </div>\n                    \n                     <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="详情页解析更多更高画质的预览视频">❓ </span>更高画质预览视频:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enableLoadPreviewVideo" class="mini-switch">\n                        </div>\n                    </div>\n\n                    <hr style="border: 0; height: 1px; margin:10px 0;background-image: linear-gradient(to right, rgba(0,0,0,0), rgba(159,137,137,0.75), rgba(0,0,0,0));"/>\n\n                    <div class="setting-item">\n                        <span class="setting-label">\n                            <span data-tip="列数6以上,建议开启竖图">❓ </span>竖图模式:\n                        </span>\n                        <div class="form-content" style="text-align: right;">\n                            <input type="checkbox" id="enableVerticalModel" class="mini-switch">\n                        </div>\n                    </div>\n                                    \n                    <div class="setting-item">\n                        <span class="setting-label">页面列数: <span id="showContainerColumns"></span></span>\n                        <div class="form-content">\n                            <input type="range" id="containerColumns" min="2" max="10" step="1" style="padding:5px 0">\n                        </div>\n                    </div>\n                    \n                    <div class="setting-item">\n                        <span class="setting-label">页面宽度: <span id="showContainerWidth"></span></span>\n                        <div class="form-content">\n                            <input type="range" id="containerWidth" min="0" max="30" step="1" style="padding:5px 0">\n                        </div>\n                    </div>\n                </div>\n                <div style="padding: 0 20px 15px; text-align: right; border-top: 1px solid #eee;">   \n                    <button id="helpBtn" style="float:left;">常见问题</button>\n                    <button id="moreBtn">更多设置</button>\n                </div>\n            </div>\n        `;
    }
    async loadForm() {
        let t = await storageManager.getSetting();
        $("#videoQuality").val(t.videoQuality), $("#reviewCount").val(t.reviewCount || 20), 
        $("#tagPosition").val(t.tagPosition || "rightTop"), $("#movieShowType").val(t.movieShowType || "hide"), 
        $("#waitCheckCount").val(t.waitCheckCount || 5), $("#showWaitCheckBtn").prop("checked", !t.showWaitCheckBtn || t.showWaitCheckBtn === I), 
        $("#showWaitDownBtn").prop("checked", !t.showWaitDownBtn || t.showWaitDownBtn === I), 
        $("#randomOpenWaitDown").prop("checked", !!t.randomOpenWaitDown && t.randomOpenWaitDown === I), 
        $("#checkConcurrencyCount").val(t.checkConcurrencyCount || 2), $("#checkRequestSleep").val(t.checkRequestSleep || 100), 
        $("#enableCheckBlacklist").val(t.enableCheckBlacklist || I), $("#checkBlacklist_intervalTime").val(t.checkBlacklist_intervalTime || 12), 
        $("#checkBlacklist_ruleTime").val(t.checkBlacklist_ruleTime || 8760), $("#enableCheckFavoriteActress").val(t.enableCheckFavoriteActress || I), 
        $("#checkFavoriteActress_IntervalTime").val(t.checkFavoriteActress_IntervalTime || 24), 
        $("#enableCheckNewVideo").val(t.enableCheckNewVideo || I), $("#checkNewVideo_intervalTime").val(t.checkNewVideo_intervalTime || 12), 
        $("#checkNewVideo_ruleTime").val(t.checkNewVideo_ruleTime || 8760);
        const e = t.highlightedTagNumber || 1, n = t.highlightedTagColor || "#ce2222";
        $("#highlightedTagNumber").val(t.highlightedTagNumber || 1), $("#highlightedTagColor").val(t.highlightedTagColor || "#ce2222"), 
        $("#highlightedTagLabel").css("border", `${e}px solid ${n}`), $("#enableClog").val(t.enableClog || I), 
        $("#clogMsgCount").val(t.clogMsgCount || 2e3), $("#refresh_token").val(t.refresh_token || ""), 
        $("#httpTimeout").val(t.httpTimeout || 5e3), $("#httpRetryCount").val(t.httpRetryCount || 3), 
        $("#webDavUrl").val(t.webDavUrl || ""), $("#webDavUsername").val(t.webDavUsername || ""), 
        $("#webDavPassword").val(t.webDavPassword || ""), $("#enableTitleSelectFilter").prop("checked", !t.enableTitleSelectFilter || t.enableTitleSelectFilter === I), 
        $("#enableFavoriteActresses").prop("checked", !t.enableFavoriteActresses || t.enableFavoriteActresses === I), 
        $("#enableSaveActressCarInfo").prop("checked", !!t.enableSaveActressCarInfo && t.enableSaveActressCarInfo === I), 
        $("#enableScreenSvg").prop("checked", !t.enableScreenSvg || t.enableScreenSvg === I), 
        $("#enableVideoSvg").prop("checked", !t.enableVideoSvg || t.enableVideoSvg === I), 
        $("#enableHandleSvg").prop("checked", !t.enableHandleSvg || t.enableHandleSvg === I), 
        $("#enableSiteSvg").prop("checked", !t.enableSiteSvg || t.enableSiteSvg === I), 
        $("#enableCopySvg").prop("checked", !t.enableCopySvg || t.enableCopySvg === I);
        const a = this.getBean("OtherSitePlugin"), i = await a.getMissAvUrl(), s = await a.getjableUrl(), o = await a.getAvgleUrl(), r = await a.getJavTrailersUrl(), l = await a.getAv123Url(), c = await a.getJavDbUrl(), d = await a.getJavBusUrl(), h = await a.getSupJavUrl();
        $("#missAvUrl").val(i), $("#jableUrl").val(s), $("#avgleUrl").val(o), $("#javTrailersUrl").val(r), 
        $("#av123Url").val(l), $("#javDbUrl").val(c), $("#javBusUrl").val(d), $("#supJavUrl").val(h);
        let p = await storageManager.getReviewFilterKeywordList(), g = await storageManager.getTitleFilterKeyword();
        p && p.forEach((t => {
            this.addLabelTag("#reviewKeywordContainer", t);
        })), g && g.forEach((t => {
            this.addLabelTag("#filterKeywordContainer", t);
        })), [ "#reviewKeywordContainer", "#filterKeywordContainer" ].forEach((t => {
            $(`${t} .add-tag-btn`).on("click", (e => this.addKeyword(e, t))), $(`${t} .keyword-input`).on("keypress", (e => {
                "Enter" === e.key && this.addKeyword(e, t);
            }));
        })), $("#hotkey-panel [id]").map(((t, e) => e.id)).get().forEach((e => {
            const n = $(`#${e}`), a = void 0 !== t[e] ? t[e] : n.attr("data-default-hotkey") || "";
            n.val(a).on("input", (t => {
                let e = $(t.target).val();
                (/[\u4e00-\u9fa5]/.test(e) || /^Shift[a-zA-Z0-9]+$/.test(e)) && ($(t.target).val(""), 
                show.error("非法输入：不能输入中文或输入法转换错误"));
            })).on("keydown", (t => this.handleHotkeyInput(t, n)));
        })), $("#enableImageHotKey").prop("checked", !!t.enableImageHotKey && t.enableImageHotKey === I);
    }
    handleHotkeyInput(t, e) {
        t.preventDefault();
        const n = this.parseHotkey(t);
        "" !== n ? this.isDuplicateHotkey(n, e.attr("id")) ? show.error("该快捷键已被其他功能使用！") : e.val(n) : e.val("");
    }
    parseHotkey(t) {
        if ("Backspace" === t.key || "Process" === t.key) return "";
        const e = [];
        t.ctrlKey && e.push("Ctrl"), t.shiftKey && e.push("Shift"), t.altKey && e.push("Alt"), 
        t.metaKey && e.push("Cmd");
        const n = {
            " ": "Space",
            Control: "Ctrl",
            Meta: "Cmd",
            ArrowUp: "Up",
            ArrowDown: "Down",
            ArrowLeft: "Left",
            ArrowRight: "Right"
        }[t.key] || (t.key.length > 1 ? t.key.replace("Arrow", "") : t.key);
        return [ "Control", "Shift", "Alt", "Meta" ].includes(t.key) || e.push(n), e.length > 0 ? e.join("+") : "";
    }
    isDuplicateHotkey(t, e) {
        let n = !1;
        return $("#hotkey-panel [id]").each(((a, i) => {
            if (i.id !== e && t && t === $(i).val()) return n = !0, !1;
        })), n;
    }
    async initSimpleSettingForm() {
        let t = await storageManager.getSetting();
        $("#containerColumns").val(t.containerColumns || 5), $("#showContainerColumns").text(t.containerColumns || 5), 
        $("#containerWidth").val((t.containerWidth || 100) - 70), $("#showContainerWidth").text((t.containerWidth || 100) + "%"), 
        $("#dialogOpenDetail").prop("checked", !t.dialogOpenDetail || t.dialogOpenDetail === I), 
        $("#needClosePage").prop("checked", !t.needClosePage || t.needClosePage === I), 
        $("#autoPage").prop("checked", !t.autoPage || t.autoPage === I), $("#translateTitle").prop("checked", !t.translateTitle || t.translateTitle === I), 
        $("#enableLoadActressInfo").prop("checked", !t.enableLoadActressInfo || t.enableLoadActressInfo === I), 
        $("#enableLoadOtherSite").prop("checked", !t.enableLoadOtherSite || t.enableLoadOtherSite === I), 
        $("#containerColumns").on("input", (async t => {
            let e = $("#containerColumns").val();
            if ($("#showContainerColumns").text(e), c) {
                document.querySelector(".movie-list").style.gridTemplateColumns = `repeat(${e}, minmax(0, 1fr))`;
            }
            if (d) {
                document.querySelector(".masonry").style.gridTemplateColumns = `repeat(${e}, minmax(0, 1fr))`;
            }
            await storageManager.saveSettingItem("containerColumns", e), this.applyImageMode();
        })), $("#containerWidth").on("input", (async t => {
            let e = parseInt($(t.target).val());
            const n = e + 70 + "%";
            if ($("#showContainerWidth").text(n), c) {
                document.querySelector("section .container").style.minWidth = n;
            }
            if (d) {
                document.querySelector(".container-fluid .row").style.minWidth = n;
            }
            storageManager.saveSettingItem("containerWidth", e + 70);
        })), $("#dialogOpenDetail").on("change", (t => {
            let e = $("#dialogOpenDetail").is(":checked") ? I : T;
            storageManager.saveSettingItem("dialogOpenDetail", e);
        })), $("#showFilterItem").prop("checked", !!t.showFilterItem && t.showFilterItem === I), 
        $("#showFilterActorItem").prop("checked", !!t.showFilterActorItem && t.showFilterActorItem === I), 
        $("#showFilterKeywordItem").prop("checked", !!t.showFilterKeywordItem && t.showFilterKeywordItem === I), 
        $("#showFavoriteItem").prop("checked", !t.showFavoriteItem || t.showFavoriteItem === I), 
        $("#showHasDownItem").prop("checked", !t.showHasDownItem || t.showHasDownItem === I), 
        $("#showHasWatchItem").prop("checked", !t.showHasWatchItem || t.showHasWatchItem === I), 
        $("#showFilterItem").on("change", (async t => {
            let e = $("#showFilterItem").is(":checked") ? I : T;
            await storageManager.saveSettingItem("showFilterItem", e), window.refresh();
        })), $("#showFilterActorItem").on("change", (async t => {
            let e = $("#showFilterActorItem").is(":checked") ? I : T;
            await storageManager.saveSettingItem("showFilterActorItem", e), window.refresh();
        })), $("#showFilterKeywordItem").on("change", (async t => {
            let e = $("#showFilterKeywordItem").is(":checked") ? I : T;
            await storageManager.saveSettingItem("showFilterKeywordItem", e), window.refresh();
        })), $("#showFavoriteItem").on("change", (async t => {
            let e = $("#showFavoriteItem").is(":checked") ? I : T;
            await storageManager.saveSettingItem("showFavoriteItem", e), window.refresh();
        })), $("#showHasDownItem").on("change", (async t => {
            let e = $("#showHasDownItem").is(":checked") ? I : T;
            await storageManager.saveSettingItem("showHasDownItem", e), window.refresh();
        })), $("#showHasWatchItem").on("change", (async t => {
            let e = $("#showHasWatchItem").is(":checked") ? I : T;
            await storageManager.saveSettingItem("showHasWatchItem", e), window.refresh();
        }));
        const e = $("#showFilterItem, #showFilterActorItem, #showFilterKeywordItem, #showFavoriteItem, #showHasDownItem, #showHasWatchItem"), n = () => {
            const t = $("#showAllItem").is(":checked");
            e.prop("disabled", t), t ? e.attr("data-tip", "请先关闭显示所有才可点击") : e.removeAttr("data-tip");
        };
        $("#showAllItem").prop("checked", !!t.showAllItem && t.showAllItem === I), $("#showAllItem").on("change", (async t => {
            let e = $("#showAllItem").is(":checked") ? I : T;
            await storageManager.saveSettingItem("showAllItem", e), n(), window.refresh();
        })), n(), $("#needClosePage").on("change", (async t => {
            await storageManager.saveSettingItem("needClosePage", $("#needClosePage").is(":checked") ? I : T), 
            window.refresh();
        })), $("#autoPage").on("change", (async t => {
            const e = $("#autoPage").is(":checked") ? I : T;
            await storageManager.saveSettingItem("autoPage", e), e === I ? $("#sort-toggle-btn").hide() : $("#sort-toggle-btn").show();
        })), $("#translateTitle").on("change", (async t => {
            const e = $("#translateTitle").is(":checked") ? I : T;
            await storageManager.saveSettingItem("translateTitle", e), e === I ? (await this.getBean("ListPagePlugin").doFilter(), 
            isDetailPage && await this.getBean("TranslatePlugin").translate()) : (await this.getBean("ListPagePlugin").revertTranslation(), 
            $(".translated-title").remove());
        })), $("#hoverBigImg").prop("checked", !!t.hoverBigImg && t.hoverBigImg === I), 
        $("#hoverBigImg").on("change", (async t => {
            const e = $("#hoverBigImg").is(":checked") ? I : T;
            await storageManager.saveSettingItem("hoverBigImg", e), e === I ? window.imageHoverPreviewObj = new ImageHoverPreview({
                selector: this.getSelector().coverImgSelector
            }) : window.imageHoverPreviewObj && window.imageHoverPreviewObj.destroy();
        })), $("#enableLoadActressInfo").on("change", (async t => {
            const e = $("#enableLoadActressInfo").is(":checked") ? I : T;
            await storageManager.saveSettingItem("enableLoadActressInfo", e), e === I ? this.getBean("ActressInfoPlugin").loadActressInfo() : $(".actress-info").remove();
        })), $("#enableLoadOtherSite").on("change", (async t => {
            const e = $("#enableLoadOtherSite").is(":checked") ? I : T;
            await storageManager.saveSettingItem("enableLoadOtherSite", e), e === I ? this.getBean("OtherSitePlugin").loadOtherSite().then() : $("#otherSiteBox").remove();
        })), $("#enableLoadScreenShot").prop("checked", !t.enableLoadScreenShot || t.enableLoadScreenShot === I), 
        $("#enableLoadScreenShot").on("change", (async t => {
            const e = $("#enableLoadScreenShot").is(":checked") ? I : T;
            await storageManager.saveSettingItem("enableLoadScreenShot", e), e === I ? this.getBean("ScreenShotPlugin").loadScreenShot().then() : $(".screen-container").remove();
        })), $("#enableLoadPreviewVideo").prop("checked", !t.enableLoadPreviewVideo || t.enableLoadPreviewVideo === I), 
        $("#enableLoadPreviewVideo").on("change", (async t => {
            const e = $("#enableLoadPreviewVideo").is(":checked") ? I : T;
            await storageManager.saveSettingItem("enableLoadPreviewVideo", e);
        })), $("#enable115Match").prop("checked", !!t.enable115Match && t.enable115Match === I), 
        $("#enable115Match").on("change", (async t => {
            const e = $("#enable115Match").is(":checked") ? I : T;
            await storageManager.saveSettingItem("enable115Match", e);
            let n = $(this.getSelector().itemSelector).toArray();
            await this.getBean("WangPan115MatchPlugin").matchMovieList(n);
        })), $("#enableVerticalModel").prop("checked", !!t.enableVerticalModel && t.enableVerticalModel === I), 
        $("#enableVerticalModel").on("change", (async t => {
            const e = $("#enableVerticalModel").is(":checked") ? I : T;
            await storageManager.saveSettingItem("enableVerticalModel", e), this.applyImageMode();
        })), $("#moreBtn").on("click", (() => {
            $(".simple-setting").html("").hide(), this.openSettingDialog("base-panel");
        })), $("#helpBtn").on("click", (() => {
            layer.open({
                type: 1,
                title: "",
                shadeClose: !0,
                scrollbar: !1,
                content: '\n<style>\n    .help-container {\n        font-family: \'Segoe UI\', Tahoma, Geneva, Verdana, sans-serif;\n        color: #333;\n        padding: 15px;\n        max-height: 100%;\n        overflow-y: auto;\n    }\n    \n    .help-section {\n        margin-bottom: 25px;\n    }\n    \n    .help-section summary {\n        font-size: 18px;\n        color: #3498db;\n        margin-bottom: 12px;\n        cursor: pointer;\n    }\n    \n    .help-content {\n        background-color: #f9f9f9;\n        border-radius: 5px;\n        padding: 15px;\n        border-left: 4px solid #3498db;\n    }\n    \n    .help-content p {\n        line-height: 1.6;\n        margin-bottom: 10px;\n    }\n    .help-section img {\n        max-width: 100%;\n        height: auto;\n        border: 1px solid #ddd;\n        border-radius: 4px;\n        box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n    }\n\n</style>\n\n<div class="help-container">\n    <h1 style="font-size: 22px; margin-bottom: 20px; color: #2c3e50; border-bottom: 1px solid #eee; padding-bottom: 10px;">使用说明</h1>\n    \n    <details class="help-section">\n        <summary>1. 无法查看预览视频，提示分流?</summary>\n        <div class="help-content">\n            <p>JavDB限制日本IP的访问，而预览视频来自DMM，需要日本IP才能访问。</p>\n            <p>这样会导致二者无法同时使用，需要对其一进行代理转发。</p>\n            <p>将 cc3001.dmm.co.jp 及 dmm.co 分流到日本ip。</p>\n            <p><a href="https://youtu.be/wQUK8z_YeU4?t=121" target="_blank">Clash Verge分流规则设置 </a> (如果你是别的代理软件，自行搜索如何分流)</p>\n        </div>\n    </details>\n    \n    <details class="help-section">\n        <summary>2. 如何屏蔽某一系列的番号?</summary>\n        <div class="help-content">\n            <p>方法一：设置中-添加视频标题关键词，如: VENX-</p>\n            <p>方法二：进入详情页，选中标题文字，右键可加入</p>\n            <img src="https://i.imgur.com/lVnhK5A.png" alt="进入详情页，选中标题，进行右键"/>\n        </div>\n    </details>\n\n    <details class="help-section">\n        <summary>3. 屏蔽某演员，如何只屏蔽单体影片?</summary>\n        <div class="help-content">\n            <p>屏蔽演员前，先筛选分类，再点屏蔽</p>\n            <img src="https://imgur.com/Ue7eCAi.png" alt="屏蔽演员前，先筛选分类，再点屏蔽"/>\n        </div>\n    </details>\n    \n    <details class="help-section">\n        <summary>4. 如何多浏览器同时登录115网盘?</summary>\n        <div class="help-content">\n            <p>① 访问115登录页, 选择JHS-扫码面板, 并扫码登录</p>\n            <img src="https://imgur.com/XbaisWD.png" alt=""/>\n        </div>\n        <div class="help-content">\n            <p>② 进入网盘后, 右下角悬浮按钮, 复制Cookie</p>\n            <img src="https://imgur.com/GvzJ2Gy.png" alt=""/>\n        </div>\n        <div class="help-content">\n            <p>③ 打开另一个浏览器(需装JHS脚本), 进入登录页面, 选择JHS-扫码面板, 输入Cookie并回车</p>\n            <img src="https://imgur.com/FX08qdO.png" alt=""/>\n        </div>\n    </details>\n</div>\n',
                area: utils.getResponsiveArea([ "50%", "90%" ])
            });
        }));
    }
    async applyImageMode() {
        $("#verticalImgStyle").remove();
        if (await storageManager.getSetting("enableVerticalModel", T) === I) {
            let t = "100% 50% !important";
            window.location.href.includes("/advanced_search?type=100") && (t = "50% 50% !important");
            const e = `\n                .cover {\n                    min-height: 350px !important;\n                    overflow: hidden !important;\n                    padding-top: 142% !important;\n                }\n                \n                .cover img {\n                    object-fit: cover !important;\n                    object-position: ${t};\n                }\n                \n                /* bus的 */\n                .masonry .movie-box img {\n                    min-height: 500px !important;\n                    object-fit: cover !important;\n                    object-position: top right;\n                }\n            `;
            $("<style>").attr("id", "verticalImgStyle").text(e).appendTo("head");
        } else {
            const t = "\n                .cover {\n                    min-height:auto !important;\n                    padding-top: 67% !important;\n                }\n                .cover img {\n                    object-fit: contain !important;\n                    object-position: 50% 50% !important\n                }\n                \n                /* bus的 */\n                 .masonry .movie-box img {\n                    min-height:auto !important;\n                    object-fit: contain !important;\n                    object-position: top;\n                }\n            ";
            $("<style>").attr("id", "verticalImgStyle").text(t).appendTo("head");
        }
        d && this.getBean("BusImgPlugin").logImageHeightsByRow();
    }
    bindClick() {
        $(".side-menu-item").on("click", (function() {
            $(".side-menu-item").removeClass("active"), $(this).addClass("active"), $(".content-panel").hide();
            const t = $(this).data("panel");
            $("#" + t).show(), "cache-panel" === t ? ($("#saveBtn").hide(), $("#clean-all").show()) : ($("#saveBtn").show(), 
            $("#clean-all").hide());
        })), $("#importBtn").on("click", (t => this.importData(t))), $("#exportBtn").on("click", (t => this.exportData(t))), 
        $("#backupBtn").on("click", (t => this.backupData(t))), $("#backupListBtn").on("click", (t => this.backupListBtn(t))), 
        $("#webdavBackupBtn").on("click", (t => this.backupDataByWebDav(t))), $("#webdavBackupListBtn").on("click", (t => this.backupListBtnByWebDav(t))), 
        $("#getRefreshTokenBtn").on("click", (t => layer.alert("即将跳转阿里云盘, 请登录后, 点击最右侧悬浮按钮获取refresh_token", {
            yes: function(t, e, n) {
                window.open("https://www.aliyundrive.com/drive/home"), layer.close(t);
            }
        }))), $("#saveBtn").on("click", (() => this.saveForm())), $(".clean-btn").on("click", (t => {
            const e = $(t.currentTarget).data("key"), n = this.cacheItems.find((t => t.key === e));
            localStorage.removeItem(e), show.ok(`${n.text} 清理成功`), $("#cache-data-display").hide(), 
            "jhs_dmm_video" === e && localStorage.removeItem("jhs_other_site_dmm");
        })), $("#clean-all").on("click", (() => {
            this.cacheItems.forEach((t => localStorage.removeItem(t.key))), show.ok("全部缓存已清理"), 
            $("#cache-data-display").hide(), localStorage.removeItem("jhs_other_site_dmm");
        })), $(".view-btn").on("click", (t => {
            const e = $(t.currentTarget).data("key"), n = localStorage.getItem(e), a = $("#cache-data-display"), i = a.find("pre");
            if (a.show(), n) try {
                const t = JSON.parse(n);
                i.text(JSON.stringify(t, null, 2));
            } catch {
                i.text(n);
            } else i.text("无数据");
        }));
        const t = $("#highlightedTagNumber"), e = $("#highlightedTagColor"), n = $("#highlightedTagLabel");
        function a() {
            const a = t.val(), i = e.val();
            n.css("border", `${a}px solid ${i}`);
        }
        t.on("input", a), e.on("input", a);
    }
    async saveForm() {
        let t = await storageManager.getSetting();
        t.videoQuality = $("#videoQuality").val(), t.reviewCount = $("#reviewCount").val(), 
        t.tagPosition = $("#tagPosition").val(), t.movieShowType = $("#movieShowType").val(), 
        t.waitCheckCount = $("#waitCheckCount").val(), t.refresh_token = $("#refresh_token").val(), 
        t.highlightedTagNumber = $("#highlightedTagNumber").val(), t.highlightedTagColor = $("#highlightedTagColor").val(), 
        t.showWaitCheckBtn = $("#showWaitCheckBtn").is(":checked") ? I : T, t.showWaitCheckBtn === I ? $("#waitCheckBtn").show() : $("#waitCheckBtn").hide(), 
        t.showWaitDownBtn = $("#showWaitDownBtn").is(":checked") ? I : T, t.showWaitDownBtn === I ? $("#waitDownBtn").show() : $("#waitDownBtn").hide(), 
        t.randomOpenWaitDown = $("#randomOpenWaitDown").is(":checked") ? I : T, t.checkConcurrencyCount = $("#checkConcurrencyCount").val(), 
        t.checkRequestSleep = $("#checkRequestSleep").val(), t.enableCheckBlacklist = $("#enableCheckBlacklist").val(), 
        t.checkBlacklist_intervalTime = $("#checkBlacklist_intervalTime").val(), t.checkBlacklist_ruleTime = $("#checkBlacklist_ruleTime").val(), 
        t.enableCheckFavoriteActress = $("#enableCheckFavoriteActress").val(), t.checkFavoriteActress_IntervalTime = $("#checkFavoriteActress_IntervalTime").val(), 
        t.enableCheckNewVideo = $("#enableCheckNewVideo").val(), t.checkNewVideo_intervalTime = $("#checkNewVideo_intervalTime").val(), 
        t.checkNewVideo_ruleTime = $("#checkNewVideo_ruleTime").val(), t.httpTimeout = $("#httpTimeout").val(), 
        t.httpRetryCount = $("#httpRetryCount").val(), t.enableClog = $("#enableClog").val(), 
        t.enableClog === I ? clog.show() : clog.hide(), t.clogMsgCount = $("#clogMsgCount").val(), 
        t.webDavUrl = $("#webDavUrl").val(), t.webDavUsername = $("#webDavUsername").val(), 
        t.webDavPassword = $("#webDavPassword").val(), t.missAvUrl = $("#missAvUrl").val().replace(/\/$/, ""), 
        t.jableUrl = $("#jableUrl").val().replace(/\/$/, ""), t.avgleUrl = $("#avgleUrl").val().replace(/\/$/, ""), 
        t.javTrailersUrl = $("#javTrailersUrl").val().replace(/\/$/, ""), t.av123Url = $("#av123Url").val().replace(/\/$/, ""), 
        t.javDbUrl = $("#javDbUrl").val().replace(/\/$/, ""), t.javBusUrl = $("#javBusUrl").val().replace(/\/$/, ""), 
        t.supJavUrl = $("#supJavUrl").val().replace(/\/$/, ""), t.enableTitleSelectFilter = $("#enableTitleSelectFilter").is(":checked") ? I : T, 
        t.enableFavoriteActresses = $("#enableFavoriteActresses").is(":checked") ? I : T, 
        t.enableSaveActressCarInfo = $("#enableSaveActressCarInfo").is(":checked") ? I : T, 
        t.enableScreenSvg = $("#enableScreenSvg").is(":checked") ? I : T, t.enableVideoSvg = $("#enableVideoSvg").is(":checked") ? I : T, 
        t.enableHandleSvg = $("#enableHandleSvg").is(":checked") ? I : T, t.enableSiteSvg = $("#enableSiteSvg").is(":checked") ? I : T, 
        t.enableCopySvg = $("#enableCopySvg").is(":checked") ? I : T, $("#hotkey-panel [id]").map(((t, e) => e.id)).get().forEach((e => {
            t[e] = $(`#${e}`).val();
        })), t.enableImageHotKey = $("#enableImageHotKey").is(":checked") ? I : T, await storageManager.saveSetting(t);
        let e = [];
        $("#reviewKeywordContainer .keyword-label").toArray().forEach((t => {
            let n = $(t).text().replace("×", "").replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
            e.push(n);
        })), await storageManager.saveReviewFilterKeyword(e);
        let n = [];
        $("#filterKeywordContainer .keyword-label").toArray().forEach((t => {
            let e = $(t).text().replace("×", "").replace(/[\r\n]+/g, " ").replace(/\s{2,}/g, " ").trim();
            n.push(e);
        })), await storageManager.saveTitleFilterKeyword(n), show.ok("保存成功"), window.refresh();
        const a = this.getBean("NewVideoPlugin");
        a && a.resetBtnTip(), this.getBean("BlacklistPlugin").resetBtnTip(), this.getBean("BlacklistPlugin").reloadTable();
    }
    addLabelTag(t, e) {
        const n = $(`${t} .tag-box`);
        let a, i = "#cbd5e1", s = "#333";
        /^[a-z]{2,}-/i.test(e) && c ? (s = "#3477ad", a = $(`\n                <a class="keyword-label" data-keyword="${e}" style="background-color: ${i}; color: ${s}" href="/video_codes/${e.replace("-", "")}" target="_blank">\n                    ${e}\n                    <span class="keyword-remove">×</span>\n                </a>\n            `)) : a = $(`\n                <div class="keyword-label" data-keyword="${e}" style="background-color: ${i}; color: ${s}">\n                    ${e}\n                    <span class="keyword-remove">×</span>\n                </div>\n            `), 
        a.find(".keyword-remove").click((t => {
            t.stopPropagation(), t.preventDefault();
            const e = $(t.currentTarget);
            const n = e.closest(".keyword-label").attr("data-keyword").split(" ")[0];
            utils.q(t, `是否移除屏蔽词  ${n}?`, (async () => {
                e.parent().remove();
            }));
        })), n.append(a);
    }
    addKeyword(t, e) {
        let n = $(`${e} .keyword-input`);
        const a = n.val().trim();
        a && (this.addLabelTag(e, a), n.val(""));
    }
    importData() {
        try {
            const t = document.createElement("input");
            t.type = "file", t.accept = ".json", t.onchange = t => {
                const e = t.target.files[0];
                if (!e) return;
                const n = new FileReader;
                n.onload = t => {
                    try {
                        const e = t.target.result.toString(), n = JSON.parse(e);
                        layer.confirm("确定是否要覆盖导入？", {
                            icon: 3,
                            title: "确认覆盖",
                            btn: [ "确定", "取消" ]
                        }, (async function(t) {
                            await storageManager.importData(n), show.ok("数据导入成功"), layer.close(t), location.reload();
                        }));
                    } catch (e) {
                        console.error(e), show.error("导入失败：文件内容不是有效的JSON格式 " + e);
                    }
                }, n.onerror = () => {
                    show.error("读取文件时出错");
                }, n.readAsText(e);
            }, document.body.appendChild(t), t.click(), setTimeout((() => document.body.removeChild(t)), 1e3);
        } catch (t) {
            console.error(t), show.error("导入数据时出错: " + t.message);
        }
    }
    async backupData(t) {
        let e = loading();
        try {
            const t = await storageManager.getSetting("refresh_token");
            if (!t) return void show.error("请填写refresh_token并保存后, 再试此功能");
            show.info("正在整理数据...");
            let e = utils.getNowStr("_", "_") + ".json", n = JSON.stringify(await storageManager.exportData());
            n = Mt(n);
            const a = new Bt(t);
            await a.backup(this.folderName, e, n), show.ok("备份完成");
        } catch (n) {
            console.error(n), show.error(n.toString());
        } finally {
            e.close();
        }
    }
    async backupListBtn(t) {
        const e = await storageManager.getSetting("refresh_token");
        if (!e) return void show.error("请填写refresh_token并保存后, 再试此功能");
        let n = loading();
        try {
            const t = new Bt(e), n = await t.getBackupList(this.folderName);
            this.openFileListDialog(n, t, "阿里云盘");
        } catch (a) {
            console.error(a), show.error(`发生错误: ${a ? a.message : a}`);
        } finally {
            n.close();
        }
    }
    async backupDataByWebDav(t) {
        const e = await storageManager.getSetting(), n = e.webDavUrl;
        if (!n) return void show.error("请填写webDav服务地址并保存后, 再试此功能");
        const a = e.webDavUsername;
        if (!a) return void show.error("请填写webDav用户名并保存后, 再试此功能");
        const i = e.webDavPassword;
        if (!i) return void show.error("请填写webDav密码并保存后, 再试此功能");
        let s = utils.getNowStr("_", "_") + ".json", o = JSON.stringify(await storageManager.exportData());
        o = Mt(o);
        let r = loading();
        try {
            const t = new Pt(n, a, i);
            await t.backup(this.folderName, s, o), show.ok("备份完成");
        } catch (l) {
            console.error(l), show.error(l.toString());
        } finally {
            r.close();
        }
    }
    async backupListBtnByWebDav(t) {
        const e = await storageManager.getSetting(), n = e.webDavUrl;
        if (!n) return void show.error("请填写webDav服务地址并保存后, 再试此功能");
        const a = e.webDavUsername;
        if (!a) return void show.error("请填写webDav用户名并保存后, 再试此功能");
        const i = e.webDavPassword;
        if (!i) return void show.error("请填写webDav密码并保存后, 再试此功能");
        let s = loading();
        try {
            const t = new Pt(n, a, i), e = await t.getBackupList(this.folderName);
            this.openFileListDialog(e, t, "WebDav");
        } catch (o) {
            console.error(o), show.error(`发生错误: ${o ? o.message : o}`);
        } finally {
            s.close();
        }
    }
    openFileListDialog(t, e, n) {
        layer.open({
            type: 1,
            title: n + "备份文件",
            content: '\n                <div style="height: 100%;overflow:hidden;"> \n                    <div id="table-container" style="height: calc(100%);"></div>\n                </div>\n            ',
            area: [ "800px", "70%" ],
            anim: -1,
            success: a => {
                const i = new Tabulator("#table-container", {
                    layout: "fitColumns",
                    placeholder: "暂无数据",
                    virtualDom: !0,
                    data: t,
                    responsiveLayout: "collapse",
                    responsiveLayoutCollapse: !0,
                    columnDefaults: {
                        headerHozAlign: "center",
                        hozAlign: "center"
                    },
                    columns: [ {
                        title: "文件名",
                        field: "name",
                        width: 200,
                        headerSort: !1,
                        responsive: 0
                    }, {
                        title: "文件大小",
                        field: "size",
                        responsive: 1,
                        headerSort: !1,
                        formatter: (t, e, n) => {
                            const a = [ "B", "KB", "MB", "GB", "TB", "PB" ];
                            let i = 0, s = t.getData().size;
                            for (;s >= 1024 && i < a.length - 1; ) s /= 1024, i++;
                            return `${s % 1 == 0 ? s.toFixed(0) : s.toFixed(2)} ${a[i]}`;
                        }
                    }, {
                        title: "备份日期",
                        field: "createTime",
                        responsive: 2,
                        headerSort: !1,
                        formatter: (t, e, n) => {
                            const a = t.getData();
                            return `${utils.getNowStr("-", ":", a.createTime)}`;
                        }
                    }, {
                        title: "操作",
                        minWidth: 250,
                        responsive: 0,
                        headerSort: !1,
                        formatter: (t, a, s) => {
                            const o = t.getData();
                            return s((() => {
                                const a = t.getElement().querySelector(".a-danger"), s = t.getElement().querySelector(".a-primary"), r = t.getElement().querySelector(".a-success");
                                a && a.addEventListener("click", (t => {
                                    utils.q(t, `是否删除 ${o.name} ?`, (async a => {
                                        let s = loading();
                                        try {
                                            await e.deleteFile(o.fileId);
                                            let a = await e.getBackupList(this.folderName);
                                            i.replaceData(a), "阿里云盘" === n ? utils.alert(t, "已移至回收站, 请到阿里云盘回收站二次删除") : utils.alert(t, "删除成功");
                                        } catch (r) {
                                            console.error(r), show.error(`发生错误: ${r ? r.message : r}`);
                                        } finally {
                                            s.close();
                                        }
                                    }));
                                })), s && s.addEventListener("click", (async t => {
                                    let a = loading();
                                    try {
                                        if ("阿里云盘" === n) {
                                            show.info("获取下载地址...");
                                            const t = await e.getDownloadUrl(o.fileId);
                                            show.info("获取文件内容...");
                                            let n = At(await gmHttp.downloadFileInChunks(t, {
                                                Referer: "https://www.aliyundrive.com/"
                                            }));
                                            utils.download(n, o.name);
                                        } else {
                                            const t = At(await e.getFileContent(o.fileId));
                                            utils.download(t, o.name);
                                        }
                                    } catch (i) {
                                        clog.error(i), show.error("下载失败: " + i);
                                    } finally {
                                        a.close();
                                    }
                                })), r && r.addEventListener("click", (async t => {
                                    layer.confirm(`是否将该云备份数据 ${o.name} 导入?`, {
                                        icon: 3,
                                        title: "提示",
                                        btn: [ "确定", "取消" ]
                                    }, (async t => {
                                        layer.close(t);
                                        let a = loading();
                                        try {
                                            let t;
                                            if ("阿里云盘" === n) {
                                                show.info("获取下载地址...");
                                                const n = await e.getDownloadUrl(o.fileId);
                                                show.info("获取文件内容..."), t = await gmHttp.downloadFileInChunks(n, {
                                                    Referer: "https://www.aliyundrive.com/"
                                                });
                                            } else t = await e.getFileContent(o.fileId);
                                            show.info("解密文件内容...");
                                            const a = At(t);
                                            show.info("解密完成, 开始导入...");
                                            const i = JSON.parse(a);
                                            await storageManager.importData(i), show.ok("导入成功!"), window.location.reload();
                                        } catch (i) {
                                            console.error(i), show.error(i);
                                        } finally {
                                            a.close();
                                        }
                                    }));
                                }));
                            })), '\n                                    <a class="a-danger">删除</a>\n                                    <a class="a-primary">下载</a>\n                                    <a class="a-success">导入</a>\n                                ';
                        }
                    } ],
                    locale: "zh-cn",
                    langs: {
                        "zh-cn": {
                            pagination: {
                                first: "首页",
                                first_title: "首页",
                                last: "尾页",
                                last_title: "尾页",
                                prev: "上一页",
                                prev_title: "上一页",
                                next: "下一页",
                                next_title: "下一页",
                                all: "所有",
                                page_size: "每页行数"
                            }
                        }
                    }
                });
            }
        });
    }
    async exportData(t) {
        try {
            const t = JSON.stringify(await storageManager.exportData()), e = `${utils.getNowStr("_", "_")}.json`;
            utils.download(t, e), show.ok("数据导出成功");
        } catch (e) {
            console.error(e), show.error("导出数据时出错: " + e.message);
        }
    }
}

const Lt = "x7k9p3";

function Mt(t) {
    return (Lt + t + Lt).split("").map((t => {
        const e = t.codePointAt(0);
        return String.fromCodePoint(e + 5);
    })).join("");
}

function At(t) {
    return t.split("").map((t => {
        const e = t.codePointAt(0);
        return String.fromCodePoint(e - 5);
    })).join("").slice(Lt.length, -Lt.length);
}

class Ft extends G {
    getName() {
        return "BusPreviewVideoPlugin";
    }
    async initCss() {
        return "\n            /* 弹窗/Modal 样式 */\n            .bus-preview-modal {\n                position: fixed;\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                background-color: rgba(0, 0, 0, 0.95); \n                /* 关键修改：更新 z-index */\n                z-index: 12345699; \n                display: flex;\n                justify-content: center;\n                align-items: center;\n                opacity: 0; \n                visibility: hidden; \n                transition: opacity 0.2s ease;\n            }\n            .bus-preview-modal.is-open {\n                opacity: 1;\n                visibility: visible;\n            }\n            /* 垂直排列视频和按钮，并居中 */\n            .bus-preview-modal-content {\n                position: relative;\n                max-width: 95%; \n                max-height: 95%;\n                display: flex; \n                flex-direction: column; \n                align-items: center; \n                gap: 15px; \n            }\n            \n            /* 移除 .bus-preview-close-btn 的样式 */\n\n            /* 视频播放器容器 */\n            .video-player-wrapper {\n                /* 关键修改：更新 width 和 max-height */\n                width: 80vw; \n                max-height: 85vh; \n                aspect-ratio: 16 / 9; \n                position: relative; \n                background-color: black; \n                max-width: 100%; \n            }\n            /* 视频元素 */\n            .video-player-wrapper #preview-video {\n                position: absolute; \n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                display: block;\n            }\n\n            /* 画质控制盒 (底部按钮) */\n            .video-control-box {\n                display: flex;\n                flex-direction: row; \n                justify-content: center; \n                flex-wrap: wrap; \n                gap: 10px;\n                padding: 10px 0; \n            }\n\n            /* 按钮样式 (保留) */\n            .video-control-btn {\n                min-width:80px;\n                padding: 6px 12px;\n                background: rgba(255,255,255,0.2);\n                color: white;\n                border: 1px solid rgba(255,255,255,0.5);\n                border-radius: 4px;\n                cursor: pointer;\n                text-align: center;\n                font-size: 14px;\n                transition: background-color 0.2s, border-color 0.2s;\n            }\n            .video-control-btn:hover {\n                background: rgba(255,255,255,0.4);\n            }\n            .video-control-btn.active {\n                background-color: #1890ff; \n                color: white;\n                font-weight: bold;\n                border: 1px solid #096dd9;\n            }\n        ";
    }
    initModal() {
        if (0 === $("#bus-preview-modal").length) {
            $("body").append('\n                <div id="bus-preview-modal" class="bus-preview-modal">\n                    <div class="bus-preview-modal-content">\n                        </div>\n                </div>\n            ');
            const t = $("#bus-preview-modal");
            t.on("click", (t => {
                "bus-preview-modal" === t.target.id && this.closeVideoModal();
            })), $(document).on("keydown", (e => {
                "Escape" === e.key && t.hasClass("is-open") && this.closeVideoModal();
            }));
        }
    }
    closeVideoModal() {
        const t = $("#preview-video");
        t.length > 0 && t[0].pause(), $("#bus-preview-modal").removeClass("is-open");
    }
    async handle() {
        if (!isDetailPage) return;
        this.initModal();
        const t = $("#sample-waterfall .sample-box .photo-frame img:first").attr("src"), e = $(`\n            <a class="preview-video-container sample-box" style="cursor: pointer">\n                <div class="photo-frame" style="position:relative;">\n                    <img src="${t}" class="video-cover" alt="">\n                    <div class="play-icon" style="position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); \n                                color:white; font-size:40px; text-shadow:0 0 10px rgba(0,0,0,0.5);">\n                        ▶\n                    </div>\n                </div>\n            </a>`);
        $("#sample-waterfall").prepend(e);
        "yes" === await storageManager.getSetting("enableLoadPreviewVideo", "yes") && tt(this.getPageInfo().carNum, !1).then();
        let n = !1, a = $(".preview-video-container");
        a.on("click", (async t => {
            if (t.preventDefault(), t.stopPropagation(), n) show.info("正在加载中, 勿重复点击"); else {
                n = !0;
                try {
                    await this.handleVideo();
                } finally {
                    n = !1;
                }
            }
        })), window.location.href.includes("autoPlay=1") && a.trigger("click");
    }
    async handleVideo() {
        const t = $("#bus-preview-modal"), e = t.find(".bus-preview-modal-content");
        let n = $("#preview-video");
        if (n.length > 0) return t.addClass("is-open"), void n[0].play().catch((t => console.warn("尝试播放失败 (可能被浏览器阻止):", t)));
        let a = this.getPageInfo().carNum;
        const i = await tt(a);
        i && 0 !== Object.keys(i).length ? (await this.createVideoPlayerAndControls(i, e), 
        n = $("#preview-video"), n.length > 0 ? (t.addClass("is-open"), n[0].play().catch((t => console.warn("尝试播放失败 (可能被浏览器阻止):", t)))) : show.error("视频播放器创建失败。")) : show.error("未找到可用的视频源。");
    }
    async createVideoPlayerAndControls(t, e) {
        let n = await storageManager.getSetting("videoQuality");
        n = X(Object.keys(t), n);
        let a = t[n];
        e.html(`\n            <div class="video-player-wrapper">\n                <video id="preview-video" controls playsinline>\n                    <source src="${a}" />\n                </video>\n            </div>\n            <div class="video-control-box">\n                </div>\n        `);
        const i = $("#preview-video"), s = i.find("source"), o = e.find(".video-control-box");
        if (!i.length || !s.length) return;
        const r = i[0], l = localStorage.getItem("jhs_videoMuted");
        r.muted = !l || "yes" === l, r.addEventListener("volumechange", (function() {
            localStorage.setItem("jhs_videoMuted", r.muted ? "yes" : "no");
        }));
        let c = "";
        F.forEach((e => {
            let a = t[e.quality];
            if (a) {
                const t = n === e.quality;
                c += `\n                    <button class="video-control-btn${t ? " active" : ""}" \n                            data-quality="${e.quality}"\n                            data-video-src="${a}">\n                        ${e.text}\n                    </button>\n                `;
            }
        })), o.html(c);
        const d = o.find(".video-control-btn");
        o.off("click").on("click", ".video-control-btn", (async t => {
            try {
                const e = $(t.currentTarget);
                if (e.hasClass("active")) return;
                let n = e.attr("data-video-src");
                s.attr("src", n);
                const a = r.currentTime;
                r.load(), r.currentTime = a, await r.play(), d.removeClass("active"), e.addClass("active");
            } catch (e) {
                console.error("切换画质失败:", e);
            }
        }));
    }
}

class jt extends G {
    constructor() {
        super(...arguments), o(this, "siteList", [ {
            name: "Google旧版",
            url: "https://www.google.com/searchbyimage?image_url={占位符}&client=firefox-b-d",
            ico: "https://www.google.com/favicon.ico"
        }, {
            name: "Google",
            url: "https://lens.google.com/uploadbyurl?url={占位符}",
            ico: "https://www.google.com/favicon.ico"
        }, {
            name: "Yandex",
            url: "https://yandex.ru/images/search?rpt=imageview&url={占位符}",
            ico: "https://yandex.ru/favicon.ico"
        } ]), o(this, "isUploading", !1);
    }
    getName() {
        return "ImageRecognitionPlugin";
    }
    async initCss() {
        return "\n            <style>\n                #upload-area {\n                    border: 2px dashed #85af68;\n                    border-radius: 8px;\n                    padding: 40px;\n                    text-align: center;\n                    margin-bottom: 20px;\n                    transition: all 0.3s;\n                    background-color: #f9f9f9;\n                }\n                #upload-area:hover {\n                    border-color: #76b947;\n                    background-color: #f0f0f0;\n                }\n                /* 拖拽进入 */\n                #upload-area.highlight {\n                    border-color: #2196F3;\n                    background-color: #e3f2fd;\n                }\n                \n                \n                #select-image-btn {\n                    background-color: #4CAF50;\n                    color: white;\n                    border: none;\n                    padding: 10px 20px;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 16px;\n                    transition: background-color 0.3s;\n                }\n                #select-image-btn:hover {\n                    background-color: #45a049;\n                }\n                \n                \n                #handle-btn, #cancel-btn {\n                    padding: 8px 16px;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 14px;\n                    border: none;\n                    transition: opacity 0.3s;\n                }\n                #handle-btn {\n                    background-color: #2196F3;\n                    color: white;\n                }\n                #handle-btn:hover {\n                    opacity: 0.9;\n                }\n                #cancel-btn {\n                    background-color: #f44336;\n                    color: white;\n                }\n                #cancel-btn:hover {\n                    opacity: 0.9;\n                }\n                \n                .search-img-site-btns-container {\n                    display: flex;\n                    flex-wrap: wrap;\n                    gap: 10px;\n                    margin-top: 15px;\n                }\n                .search-img-site-btn {\n                    display: flex;\n                    align-items: center;\n                    padding: 8px 12px;\n                    background-color: #f5f5f5;\n                    border-radius: 4px;\n                    text-decoration: none;\n                    color: #333;\n                    transition: all 0.2s;\n                    font-size: 14px;\n                    border: 1px solid #ddd;\n                }\n                .search-img-site-btn:hover {\n                    background-color: #e0e0e0;\n                    transform: translateY(-2px);\n                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);\n                }\n                .search-img-site-btn img {\n                    width: 16px;\n                    height: 16px;\n                    margin-right: 6px;\n                }\n                .search-img-site-btn span {\n                    white-space: nowrap;\n                }\n            </style>\n        ";
    }
    open(t) {
        layer.open({
            type: 1,
            title: "以图识图",
            content: '\n            <div style="padding: 20px">\n                <div id="upload-area">\n                    <div style="color: #555;margin-bottom: 15px;">\n                        <p>拖拽图片到此处 或 点击按钮选择图片</p>\n                        <p>也可以直接 Ctrl+V 粘贴图片或 图片URL</p>\n                    </div>\n                    <button id="select-image-btn">选择图片</button>\n                    <input type="file" style="display: none" id="image-file" accept="image/*">\n                </div>\n                \n                <div id="url-input-container" style="margin-top: 15px;display: none;">\n                    <input type="text" id="image-url" placeholder="粘贴图片URL地址..." style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">\n                </div>\n                \n                <div id="preview-area" style="margin-bottom: 20px; text-align: center; display: none;">\n                    <img id="preview-image" alt="" src="" style="max-width: 100%; max-height: 300px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">\n                    <div style="margin-top: 15px; display: flex; justify-content: center; gap: 10px;" id="action-btns">\n                        <button id="handle-btn">搜索图片</button>\n                        <button id="cancel-btn">取消</button>\n                    </div>\n                    \n                    <div id="search-results" style="display: none;">\n                        <p style="margin: 20px auto">请选择识图网站：<a id="openAll" style="cursor: pointer">全部打开</a></p>\n                        <div class="search-img-site-btns-container" id="search-img-site-btns-container"></div>\n                    </div>\n                </div>\n                \n            </div>\n        ',
            area: utils.isMobile() ? utils.getResponsiveArea() : [ "40%", "80%" ],
            success: async e => {
                this.initEventListeners(), t && t();
            },
            end: () => {
                $(document).off("paste.searchImg");
            }
        });
    }
    initEventListeners() {
        const t = $("#upload-area"), e = $("#image-file"), n = $("#select-image-btn"), a = $("#preview-area"), i = $("#preview-image"), s = $("#action-btns"), o = $("#handle-btn"), r = $("#cancel-btn"), l = $("#url-input-container"), c = $("#image-url"), d = $("#search-results"), h = $("#search-img-site-btns-container");
        t.on("dragover", (e => {
            e.preventDefault(), t.addClass("highlight");
        })).on("dragleave", (() => {
            t.removeClass("highlight");
        })).on("drop", (e => {
            e.preventDefault(), t.removeClass("highlight"), e.originalEvent.dataTransfer.files && e.originalEvent.dataTransfer.files[0] && (this.handleImageFile(e.originalEvent.dataTransfer.files[0]), 
            this.resetSearchUI());
        })), n.on("click", (() => {
            e.trigger("click");
        })), e.on("change", (t => {
            t.target.files && t.target.files[0] && (this.handleImageFile(t.target.files[0]), 
            this.resetSearchUI());
        })), $(document).on("paste.searchImg", (async t => {
            const e = t.originalEvent.clipboardData.items;
            for (let a = 0; a < e.length; a++) if (-1 !== e[a].type.indexOf("image")) {
                const t = e[a].getAsFile();
                return this.handleImageFile(t), void this.resetSearchUI();
            }
            const n = t.originalEvent.clipboardData.getData("text");
            n && utils.isUrl(n) && (l.show(), c.val(n), i.attr("src", n), a.show(), this.resetSearchUI());
        })), o.on("click", (async () => {
            const t = i.attr("src");
            if (t) {
                if (!this.isUploading) {
                    this.isUploading = !0;
                    try {
                        const e = await this.searchByImage(t);
                        s.hide(), d.show(), h.empty();
                        const n = "jhs_selectedSites", a = JSON.parse(localStorage.getItem(n) || "{}");
                        this.siteList.forEach((t => {
                            const n = t.url.replace("{占位符}", encodeURIComponent(e)), i = !1 !== a[t.name];
                            h.append(`\n                        <a href="${n}" class="search-img-site-btn" target="_blank" title="${t.name}">\n                        <input type="checkbox" \n                               class="site-checkbox" \n                               data-site-name="${t.name}" \n                               style="margin-right: 5px"\n                               ${i ? "checked" : ""}>\n                            <img src="${t.ico}" alt="${t.name}">\n                            <span>${t.name}</span>\n                        </a>\n                    `);
                        })), h.on("change", ".site-checkbox", (function() {
                            const t = $(this).data("site-name");
                            a[t] = $(this).is(":checked"), localStorage.setItem(n, JSON.stringify(a));
                        })), h.show();
                    } finally {
                        this.isUploading = !1;
                    }
                }
            } else show.info("请粘贴或上传图片");
        })), r.on("click", (() => {
            a.hide(), l.hide(), e.val(""), c.val("");
        })), c.on("change", (() => {
            utils.isUrl(c.val()) && (i.attr("src", c.val()), a.show());
        })), $("#openAll").on("click", (() => {
            $(".search-img-site-btn").each((function() {
                $(this).find(".site-checkbox").is(":checked") && window.open($(this).attr("href"));
            }));
        }));
    }
    resetSearchUI() {
        $("#action-btns").show(), $("#search-results").hide(), $("#search-img-site-btns-container").hide().empty();
    }
    handleImageFile(t) {
        const e = document.getElementById("preview-image"), n = document.getElementById("preview-area"), a = document.getElementById("url-input-container");
        if (!t.type.match("image.*")) return void show.info("请选择图片文件");
        const i = new FileReader;
        i.onload = t => {
            e.src = t.target.result, n.style.display = "block", a.style.display = "none", $("#handle-btn")[0].click();
        }, i.readAsDataURL(t);
    }
    async searchByImage(t) {
        let e = loading();
        try {
            let e = t;
            if (t.startsWith("data:")) {
                show.info("开始上传图片...");
                const n = await async function(t) {
                    var e;
                    const n = t.match(/^data:(.+);base64,(.+)$/);
                    if (!n || n.length < 3) throw new Error("无效的Base64图片数据");
                    const a = n[1], i = n[2], s = atob(i), o = new Array(s.length);
                    for (let p = 0; p < s.length; p++) o[p] = s.charCodeAt(p);
                    const r = new Uint8Array(o), l = new Blob([ r ], {
                        type: a
                    }), c = new FormData;
                    c.append("image", l);
                    const d = await fetch("https://api.imgur.com/3/image", {
                        method: "POST",
                        headers: {
                            Authorization: "Client-ID d70305e7c3ac5c6"
                        },
                        body: c
                    }), h = await d.json();
                    if (h.success && h.data && h.data.link) return h.data.link;
                    throw new Error((null == (e = h.data) ? void 0 : e.error) || "上传到Imgur失败");
                }(t);
                if (!n) return void show.error("上传到失败");
                e = n;
            }
            return e;
        } catch (n) {
            show.error(`搜索失败: ${n.message}`), console.error("搜索失败:", n);
        } finally {
            e.close();
        }
    }
}

class Nt extends G {
    getName() {
        return "BusNavBarPlugin";
    }
    handle() {
        $("#navbar > div > div > span").append('\n            <button class="btn btn-default" style="color: #0d9488" id="search-img-btn">识图</button>\n       '), 
        $("#search-img-btn").on("click", (() => {
            this.getBean("ImageRecognitionPlugin").open();
        }));
    }
}

class Et extends G {
    constructor() {
        super(...arguments), o(this, "floorIndex", 1), o(this, "isInit", !1);
    }
    getName() {
        return "RelatedPlugin";
    }
    async showRelated(t, e) {
        const n = await storageManager.getSetting("enableLoadRelated", T), a = t;
        e ? (a.append(`\n            <div style="display: flex; align-items: center; margin: 16px 0; color: #666; font-size: 14px;">\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n                <span style="padding: 0 10px;">相关清单</span>\n                <a id="relatedFold" style="margin-left: 8px; color: #1890ff; text-decoration: none; display: flex; align-items: center;">\n                    <span class="toggle-text">${n === I ? "折叠" : "展开"}</span>\n                    <span class="toggle-icon" style="margin-left: 4px;">${n === I ? "▲" : "▼"}</span>\n                </a>\n                <span style="flex: 1; height: 1px; background: linear-gradient(to right, transparent, #999, transparent);"></span>\n            </div>\n        `), 
        $("#relatedFold").on("click", (t => {
            t.preventDefault(), t.stopPropagation();
            const n = $("#relatedFold .toggle-text"), a = $("#relatedFold .toggle-icon"), i = "展开" === n.text();
            n.text(i ? "折叠" : "展开"), a.text(i ? "▲" : "▼"), i ? ($("#relatedContainer").show(), 
            $("#relatedFooter").show(), this.isInit || (this.fetchAndDisplayRelateds(e), this.isInit = !0), 
            storageManager.saveSettingItem("enableLoadRelated", I)) : ($("#relatedContainer").hide(), 
            $("#relatedFooter").hide(), storageManager.saveSettingItem("enableLoadRelated", T));
        })), a.append('<div id="relatedContainer"></div>'), a.append('<div id="relatedFooter"></div>'), 
        n === I && await this.fetchAndDisplayRelateds(e)) : show.error("未传入movieId");
    }
    async fetchAndDisplayRelateds(t) {
        const e = $("#relatedContainer"), n = $("#relatedFooter");
        e.append('<div id="relatedLoading" style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">获取清单中...</div>');
        let a = null;
        try {
            a = await R.related(t, 1, 20);
        } catch (i) {
            console.error("获取清单失败:", i);
        } finally {
            $("#relatedLoading").remove();
        }
        if (!a) return e.append('\n                <div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">\n                    获取清单失败\n                    <a id="retryFetchRelateds" href="javascript:;" style="margin-left: 10px; color: #1890ff; text-decoration: none;">重试</a>\n                </div>\n            '), 
        void $("#retryFetchRelateds").on("click", (async () => {
            $("#retryFetchRelateds").parent().remove(), await this.fetchAndDisplayRelateds(t);
        }));
        if (0 !== a.length) if (this.displayRelateds(a, e), 20 === a.length) {
            n.html('\n                <button id="loadMoreRelateds" style="width:100%; background-color: #e1f5fe; border:none; padding:10px; margin-top:10px; cursor:pointer; color:#0277bd; font-weight:bold; border-radius:4px;">\n                    加载更多清单\n                </button>\n                <div id="relatedEnd" style="display:none; text-align:center; padding:10px; color:#666; margin-top:10px;">已加载全部清单</div>\n            ');
            let a = 1, s = $("#loadMoreRelateds");
            s.on("click", (async () => {
                let n;
                s.text("加载中...").prop("disabled", !0), a++;
                try {
                    n = await R.related(t, a, 20);
                } catch (i) {
                    console.error("加载更多清单失败:", i);
                } finally {
                    s.text("加载失败, 请点击重试").prop("disabled", !1);
                }
                n && (this.displayRelateds(n, e), n.length < 20 ? (s.remove(), $("#relatedEnd").show()) : s.text("加载更多清单").prop("disabled", !1));
            }));
        } else n.html('<div style="text-align:center; padding:10px; color:#666; margin-top:10px;">已加载全部清单</div>'); else e.append('<div style="margin-top:15px;background-color:#ffffff;padding:10px;margin-left: -10px;">无清单</div>');
    }
    displayRelateds(t, e) {
        t.length && t.forEach((t => {
            let n = `\n                <div class="item columns is-desktop" style="display:block;margin-top:6px;background-color:#ffffff;padding:10px;margin-left: -10px;word-break: break-word;position:relative;">\n                   <span style="position:absolute;top:5px;right:10px;color:#999;font-size:12px;">#${this.floorIndex++}</span>\n                   <span style="position:absolute;bottom:5px;right:10px;color:#999;font-size:12px;">创建时间: ${t.createTime}</span>\n                   <p><a href="/lists/${t.relatedId}" target="_blank" style="color:#2e8abb">${t.name}</a></p>\n                   <p style="margin-top: 5px;">视频个数: ${t.movieCount}</p>\n                   <p style="margin-top: 5px;">收藏次数: ${t.collectionCount} 被查看次数: ${t.viewCount}</p>\n                </div>\n            `;
            e.append(n);
        }));
    }
}

class Ht extends G {
    constructor() {
        super(...arguments), o(this, "type", null);
    }
    getName() {
        return "WantAndWatchedVideosPlugin";
    }
    async handle() {
        window.location.href.includes("/want_watch_videos") && ($("h3").append('<a class="a-primary" id="wantWatchBtn" style="padding:10px;">导入至 JHS</a>'), 
        $("#wantWatchBtn").on("click", (t => {
            this.type = g, this.importWantWatchVideos(t, "是否将 想看的影片 导入到 JHS-收藏?");
        }))), window.location.href.includes("/watched_videos") && ($("h3").append('<a class="a-success" id="wantWatchBtn" style="padding:10px;">导入至 JHS</a>'), 
        $("#wantWatchBtn").on("click", (t => {
            this.type = m, this.importWantWatchVideos(t, "是否将 看过的影片 导入到 JHS-已下载?");
        })));
    }
    importWantWatchVideos(t, e) {
        utils.q(null, `${e} <br/> <span style='color: #f40'>执行此功能前请记得备份数据</span>`, (async () => {
            let t = loading();
            try {
                await this.parseMovieList();
            } catch (e) {
                console.error(e);
            } finally {
                t.close();
            }
        }));
    }
    async parseMovieList(t) {
        let e, n;
        t ? (e = t.find(this.getSelector().itemSelector), n = t.find(".pagination-next").attr("href")) : (e = $(this.getSelector().itemSelector), 
        n = $(".pagination-next").attr("href"));
        for (const i of e) {
            const t = $(i), e = t.find("a").attr("href"), n = t.find(".video-title strong").text().trim(), s = t.find(".meta").text().trim();
            if (e && n) try {
                if (await storageManager.getCar(n)) {
                    show.info(`${n} 已存在, 跳过`);
                    continue;
                }
                await storageManager.saveCar({
                    carNum: n,
                    url: e,
                    names: null,
                    actionType: this.type,
                    publishTime: s
                });
            } catch (a) {
                console.error(`保存失败 [${n}]:`, a);
            }
        }
        n ? (show.info("发现下一页，正在解析:", n), await new Promise((t => setTimeout(t, 1e3))), 
        $.ajax({
            url: n,
            method: "GET",
            success: t => {
                const e = new DOMParser, n = $(e.parseFromString(t, "text/html"));
                this.parseMovieList(n);
            },
            error: function(t) {
                console.error(t), show.error("加载下一页失败:" + t.message);
            }
        })) : (show.ok("导入结束!"), window.refresh());
    }
}

class zt extends G {
    getName() {
        return "CoverButtonPlugin";
    }
    async initCss() {
        return `\n            <style>\n                .box .tags {\n                    justify-content: space-between;\n                }\n                .tool-box span{\n                    opacity:.3\n                }\n                .tool-box span:hover{\n                    opacity:1\n                }\n                ${d ? ".tool-box .icon, .setting-label .icon{ height: 24px; width: 24px; }" : ""}\n                .tool-box svg path {\n                  fill: blue;\n                }\n                [data-theme="dark"] .tool-box svg path {\n                  fill: white;\n                }\n                \n                \n                /* 鼠标移入时的弹性动画 */\n                .elastic-in {\n                    animation: elasticIn 0.2s ease-out forwards;  /* 动画名称 | 时长 | 缓动函数 | 保持最终状态 */\n                }\n                \n                /* 鼠标移出时的弹性动画 */\n                .elastic-out {\n                    animation: elasticOut 0.2s ease-in forwards;\n                }\n                /* 弹性进入动画（像果冻弹入） */\n                @keyframes elasticIn {\n                    0% {\n                        opacity: 0;\n                        transform: scale(0.8);  /* 起始状态：80% 大小 */\n                    }\n                    50% {\n                        opacity: 1;\n                        transform: scale(1.1);  /* 弹到 110%（超调一点） */\n                    }\n                    70% {\n                        transform: scale(0.95); /* 回弹到 95%（模拟弹性阻尼） */\n                    }\n                    100% {\n                        opacity: 1;\n                        transform: scale(1);    /* 最终恢复正常大小 */\n                    }\n                }\n                /* 弹性离开动画（像果冻弹出） */\n                @keyframes elasticOut {\n                    0% {\n                        opacity: 1;\n                        transform: scale(1);    /* 起始状态：正常大小 */\n                    }\n                    30% {\n                        transform: scale(1.05); /* 先弹大一点（105%） */\n                    }\n                    100% {\n                        opacity: 0;\n                        transform: scale(0.8);  /* 最终缩小并消失 */\n                    }\n                }\n                \n                \n                .loading {\n                    opacity: 0.7;\n                    filter: blur(1px);\n                }\n                .loading-spinner {\n                    position: absolute;\n                    top: 50%;\n                    left: 50%;\n                    transform: translate(-50%, -50%);\n                    width: 40px;\n                    height: 40px;\n                    border: 3px solid rgba(255,255,255,.3);\n                    border-radius: 50%;\n                    border-top-color: #fff;\n                    animation: spin 1s ease-in-out infinite;\n                    z-index: 20;\n                }\n                @keyframes spin {\n                    to { transform: translate(-50%, -50%) rotate(360deg); }\n                }\n            </style>\n        `;
    }
    handle() {
        window.isListPage && (this.addSvgBtn(), this.bindClick().then());
    }
    async addSvgBtn() {
        $(this.getSelector().itemSelector).toArray().forEach((t => {
            let e = $(t);
            if (!(e.find(".tool-box").length > 0) && (c && e.find(".tags").append(`\n                    <div class="tool-box" style="margin-left: auto; display: flex; align-items: center">\n                        <span class="screenSvg" title="长缩略图" style="margin-right: 15px;">${this.screenSvg}</span>\n                        \n                        <span class="videoSvg" title="播放视频" style="margin-right: 15px;">${this.videoSvg}</span>\n                        \n                        <div class="more-tools-container handleSvg" style="position: relative; margin-right: 15px;">\n                            <div title="鉴定处理" style="padding: 5px; margin: -5px;opacity:.3">${this.handleSvg}</div>\n                            \n                            <div class="more-tools" style=" position: absolute; bottom: 33px; right: -30px; display: none;\n                                background-color: rgba(255, 255, 255, 0);z-index: 10;">\n                                <a class="menu-btn hasWatchBtn" style="background-color:${_};color:white !important;margin-bottom: 5px"><span style="opacity: 1;">${C}</span></a>\n                                <a class="menu-btn hasDownBtn" style="background-color:${S}; color:white !important;margin-bottom: 5px"><span style="opacity: 1;">${k}</span></a>\n                                <a class="menu-btn favoriteBtn" style="background-color:${x}; color:white !important;margin-bottom: 5px"><span style="opacity: 1;">${w}</span></a>\n                                <a class="menu-btn filterBtn" style="background-color:${b};   color:white !important;margin-bottom: 5px"><span style="opacity: 1;">${v}</span></a>\n                            </div>\n                        </div>\n                        \n                        <div class="more-tools-container siteSvg"  style="position: relative; margin-right: 15px;">\n                            <div title="第三方网站" style="padding: 5px; margin: -5px;opacity:.3">${this.siteSvg}</div>\n                            \n                             <div class="more-tools" style=" position: absolute; bottom: 33px; right: -30px; display: none;\n                                background-color: rgba(255, 255, 255, 0);z-index: 10;">\n                                <a class="site-btn site-jable" style="color:white !important;margin-bottom: 5px;background-color:#71bb59;">\n                                    <span style="opacity: 1;">Jable</span>\n                                </a>\n                                <a class="site-btn site-avgle" style="margin-bottom: 5px;background-color:#71bb59;">\n                                    <span style="opacity: 1;">Avgle</span>\n                                </a>\n                                <a class="site-btn site-miss-av" style="color:white !important;margin-bottom: 5px;background-color:#71bb59;">\n                                    <span style="opacity: 1;">MissAv</span>\n                                </a>\n                                <a class="site-btn site-123-av" style="color:white !important;margin-bottom: 5px;background-color:#71bb59;">\n                                    <span style="opacity: 1;">123Av</span>\n                                </a>\n                            </div>\n                        </div>\n                        \n                        <div class="more-tools-container copySvg" style="position: relative; margin-right: 15px;">\n                            <div title="复制按钮" style="padding: 5px; margin: -5px;opacity:.3">${this.copySvg}</div>\n                            \n                            <div class="more-tools" style="\n                                position: absolute;\n                                bottom: 20px;\n                                right: -10px;\n                                display: none;\n                                background: white;\n                                box-shadow: 0 2px 8px rgba(0,0,0,0.15);\n                                border-radius: 20px;\n                                padding: 10px 0;\n                                margin-bottom: 15px;\n                                z-index: 10;\n                            ">\n                                <span class="carNumSvg" title="复制番号" style="padding: 5px 10px; white-space: nowrap;">${this.carNumSvg}</span>\n                                <span class="titleSvg" title="复制标题" style="padding: 5px 10px; white-space: nowrap;">${this.titleSvg}</span>\n                                <span class="downSvg" title="下载封面" style="padding: 5px 10px; white-space: nowrap;">${this.downSvg}</span>\n                            </div>\n                        </div>\n                    </div>\n                `), 
            d)) {
                if (e.find(".avatar-box").length > 0) return;
                e.find(".photo-info").append(`\n                    <div class="tool-box" style="display: flex; align-items: center;justify-content: flex-end">\n                        <span class="screenSvg" title="长缩略图" style="margin-right: 15px;">${this.screenSvg}</span>\n\n                        <span class="videoSvg" title="播放视频" style="margin-right: 15px;">${this.videoSvg}</span>\n                        \n                        <div class="more-tools-container handleSvg" style="position: relative; margin-right: 15px;">\n                            <div title="鉴定处理" style="padding: 5px; margin: -5px;opacity:.3">${this.handleSvg}</div>\n                            \n                            <div class="more-tools" style=" position: absolute; bottom: 33px; right: -30px; display: none;\n                                background-color: rgba(255, 255, 255, 0);z-index: 10;">\n                                <a class="menu-btn hasWatchBtn" style="background-color:${_};color:white;margin-bottom: 5px"><span style="opacity: 1;display: inline; color:white !important">${C}</span></a>\n                                <a class="menu-btn hasDownBtn" style="background-color:${S}; color:white;margin-bottom: 5px"><span style="opacity: 1;display: inline; color:white !important">${k}</span></a>\n                                <a class="menu-btn favoriteBtn" style="background-color:${x}; color:white;margin-bottom: 5px"><span style="opacity: 1;display: inline; color:white !important">${w}</span></a>\n                                <a class="menu-btn filterBtn" style="background-color:${b};   color:white;margin-bottom: 5px"><span style="opacity: 1;display: inline; color:white !important">${v}</span></a>\n                            </div>\n                        </div>\n                        \n                        <div class="more-tools-container siteSvg" style="position: relative; margin-right: 15px;">\n                            <div title="第三方网站" style="padding: 5px; margin: -5px;opacity:.3">${this.siteSvg}</div>\n                            \n                             <div class="more-tools" style=" position: absolute; bottom: 33px; right: -30px; display: none;\n                                background-color: rgba(255, 255, 255, 0);z-index: 10;">\n                                <a class="site-btn site-jable" style="color:white;margin-bottom: 5px;background-color:#71bb59;">\n                                    <span style="opacity: 1;display: inline; color:white !important">Jable</span>\n                                </a>\n                                <a class="site-btn site-avgle" style="margin-bottom: 5px;background-color:#71bb59;">\n                                    <span style="opacity: 1;display: inline; color:white !important">Avgle</span>\n                                </a>\n                                <a class="site-btn site-miss-av" style="color:white;margin-bottom: 5px;background-color:#71bb59;">\n                                    <span style="opacity: 1;display: inline; color:white !important">MissAv</span>\n                                </a>\n                                <a class="site-btn site-123-av" style="color:white;margin-bottom: 5px;background-color:#71bb59;">\n                                    <span style="opacity: 1;display: inline; color:white !important">123Av</span>\n                                </a>\n                            </div>\n                        </div>\n                      \n                        <div class="more-tools-container copySvg" style="position: relative;">\n                            <div title="复制按钮" style="padding: 5px; margin: -5px;opacity:.3">${this.copySvg}</div>\n                            \n                            <div class="more-tools" style="\n                                max-width: 44px;\n                                position: absolute;\n                                bottom: 20px;\n                                right: -10px;\n                                display: none;\n                                background: white;\n                                box-shadow: 0 2px 8px rgba(0,0,0,0.15);\n                                border-radius: 20px;\n                                padding: 10px 0;\n                                margin-bottom: 15px;\n                                z-index: 10;\n                                text-align: center;\n                            ">\n                                <span class="carNumSvg" title="复制番号" style="padding: 5px 10px; white-space: nowrap;display: inline">${this.carNumSvg}</span>\n                                <span class="titleSvg" title="复制标题"  style="padding: 5px 10px; white-space: nowrap;display: inline">${this.titleSvg}</span>\n                                <span class="downSvg" title="下载封面"   style="padding: 5px 10px; white-space: nowrap;display: inline">${this.downSvg}</span>\n                            </div>\n                        </div>\n                    </div>\n                `);
            }
        })), this.enableSvgBtn();
    }
    async enableSvgBtn() {
        const t = await storageManager.getSetting(), {enableScreenSvg: e = I, enableVideoSvg: n = I, enableHandleSvg: a = I, enableSiteSvg: i = I, enableCopySvg: s = I} = t;
        [ {
            selector: ".screenSvg",
            enabled: e
        }, {
            selector: ".videoSvg",
            enabled: n
        }, {
            selector: ".handleSvg",
            enabled: a
        }, {
            selector: ".siteSvg",
            enabled: i
        }, {
            selector: ".copySvg",
            enabled: s
        } ].forEach((({selector: t, enabled: e}) => {
            $(t).toggle(e === I);
        }));
    }
    async bindClick() {
        this.getSelector();
        const t = this.getBean("ListPagePlugin");
        $(document).on("click", ".more-tools-container", (t => {
            t.preventDefault();
            var e = $(t.target).closest(".more-tools-container").find(".more-tools");
            $(".more-tools").not(e).stop(!0, !0).removeClass("elastic-in").addClass("elastic-out").hide(), 
            e.is(":visible") ? e.stop(!0, !0).removeClass("elastic-in").addClass("elastic-out").hide() : e.stop(!0, !0).removeClass("elastic-out").addClass("elastic-in").show();
        })), $(document).on("click", (function(t) {
            $(t.target).closest(".more-tools-container").length || $(".more-tools").stop(!0, !0).removeClass("elastic-in").addClass("elastic-out").hide();
        })), $(document).on("click", ".videoSvg", (t => {
            t.preventDefault(), $('.videoSvg[title!="播放视频"]').each(((t, e) => {
                const n = $(e);
                let a = n.closest(".item"), i = a.find("img"), {carNum: s} = this.getBoxCarInfo(a);
                this.showImg(n, i, s), n.html(this.videoSvg).attr("title", "播放视频");
            }));
            const e = $(t.target).closest(".item"), n = e.find(".videoSvg");
            if ("播放视频" === n.attr("title")) {
                n.html(this.recoveryVideoSvg).attr("title", "切回封面");
                const {carNum: t} = this.getBoxCarInfo(e);
                let a = e.find("img");
                if (!a.length) return void show.error("没有找到图片");
                this.showVideo(n, a, t).then();
            }
        })), $(document).on("click", ".screenSvg", (async t => {
            t.preventDefault();
            let e = loading();
            try {
                const n = $(t.currentTarget).closest(".item");
                let {carNum: a} = this.getBoxCarInfo(n);
                a = a.replace("FC2-", "");
                const i = await this.getBean("ScreenShotPlugin").getScreenshot(a);
                e.close(), showImageViewer(i);
            } catch (n) {
                console.error("图片预览出错:", n), show.error("图片预览出错:" + n);
            } finally {
                e.close();
            }
        })), $(document).on("click", ".filterBtn, .favoriteBtn, .hasDownBtn, .hasWatchBtn", (e => {
            e.preventDefault(), e.stopPropagation();
            const n = $(e.target).closest(".menu-btn"), a = n.closest(".item"), {carNum: i, url: s, publishTime: o} = this.getBoxCarInfo(a), r = async e => {
                let n = await t.parseActressName(s);
                await storageManager.saveCar({
                    carNum: i,
                    url: s,
                    names: n,
                    actionType: e,
                    publishTime: o
                }), window.refresh(), show.ok("操作成功");
            };
            n.hasClass("filterBtn") ? utils.q(e, `是否屏蔽${i}?`, (() => r(p))) : n.hasClass("favoriteBtn") ? r(g).then() : n.hasClass("hasDownBtn") ? r(m).then() : n.hasClass("hasWatchBtn") && r(u).then(), 
            $(".more-tools").stop(!0, !0).removeClass("elastic-in").addClass("elastic-out").hide();
        }));
        const e = this.getBean("OtherSitePlugin"), n = await e.getMissAvUrl(), a = await e.getjableUrl(), i = await e.getAvgleUrl(), s = await e.getAv123Url();
        $(document).on("click", ".site-jable, .site-avgle, .site-miss-av, .site-123-av", (t => {
            t.preventDefault(), t.stopPropagation();
            const e = $(t.currentTarget), o = e.closest(".item"), {carNum: r} = this.getBoxCarInfo(o);
            let l = null;
            e.hasClass("site-jable") ? l = `${a}/search/${r}/` : e.hasClass("site-avgle") ? l = `${i}/vod/search.html?wd=${r}` : e.hasClass("site-miss-av") ? l = `${n}/search/${r}` : e.hasClass("site-123-av") && (l = `${s}/ja/search?keyword=${r}`), 
            t && (t.ctrlKey || t.metaKey) ? GM_openInTab(l, {
                insert: 0
            }) : window.open(l);
        })), $(document).on("click", ".titleSvg, .carNumSvg, .downSvg", (t => {
            t.preventDefault(), t.stopPropagation();
            const e = $(t.currentTarget).closest(".item"), {carNum: n, title: a} = this.getBoxCarInfo(e), i = e.find(d ? ".photo-frame img" : ".cover img");
            $(t.currentTarget).hasClass("titleSvg") ? utils.copyToClipboard("标题", a) : $(t.currentTarget).hasClass("carNumSvg") ? utils.copyToClipboard("番号", n) : $(t.currentTarget).hasClass("downSvg") && fetch(i.attr("src")).then((t => t.blob())).then((t => {
                utils.download(t, n + " " + a + ".jpg");
            }));
        }));
    }
    showImg(t, e, n) {
        t.html(this.videoSvg).attr("title", "播放视频");
        let a = $(`#${`${n}_preview_video`}`);
        a.length > 0 && (a[0].pause(), a.parent().hide()), e.show(), e.removeClass("loading"), 
        e.next(".loading-spinner").remove();
    }
    async showVideo(t, e, n) {
        const a = `${n}_preview_video`;
        let i = $(`#${a}`);
        if (i.length > 0) return i.parent().show(), i[0].play(), void e.hide();
        e.addClass("loading"), e.after('<div class="loading-spinner"></div>');
        const s = e.attr("src"), o = await tt(n);
        if (!o) return show.error("未解析到视频"), void this.showImg(t, e, n);
        let r = await storageManager.getSetting("videoQuality");
        r = X(Object.keys(o), r);
        let l = o[r], c = `\n            <div style="display: flex; justify-content: center; align-items: center; position: absolute; top:0; left:0; height: 100%; width: 100%; z-index: 10; overflow: hidden">\n                <video \n                    src="${l}" \n                    poster="${s}" \n                    id="${a}" \n                    controls \n                    loop \n                    muted \n                    playsinline\n                    style="max-height: 100%; max-width: 100%; object-fit: contain"\n                ></video>\n            </div>\n        `;
        d && (c = `\n                <div>\n                    <video \n                        src="${l}" \n                        poster="${s}" \n                        id="${a}" \n                        controls \n                        loop \n                        muted \n                        playsinline\n                        style="max-height: 100%; max-width: 100%; object-fit: contain"\n                    ></video>\n                </div>\n            `), 
        e.parent().append(c), e.hide(), e.removeClass("loading"), e.next(".loading-spinner").remove(), 
        i = $(`#${a}`);
        let h = i[0];
        h.load(), h.muted = !1, h.play(), i.trigger("focus");
    }
}

class Ut extends G {
    constructor() {
        super(...arguments), o(this, "$contentBox", $(".section .container")), o(this, "urlParams", new URLSearchParams(window.location.search)), 
        o(this, "sortVal", this.urlParams.get("sort") || "release_date"), o(this, "currentPage", this.urlParams.get("page") ? parseInt(this.urlParams.get("page")) : 1), 
        o(this, "maxPage", null), o(this, "keyword", this.urlParams.get("keyword") || null);
    }
    getName() {
        return "Fc2By123AvPlugin";
    }
    async getBaseUrl() {
        const t = this.getBean("OtherSitePlugin");
        return await t.getAv123Url() + "/ja";
    }
    handle() {
        $("#navbar-menu-hero > div > div:nth-child(1) > div > a:nth-child(4)").after('<a class="navbar-item" href="/advanced_search?type=100&released_start=2099-09">123Av-Fc2</a>'), 
        $('.tabs li:contains("FC2")').after('<li><a href="/advanced_search?type=100&released_start=2099-09"><span>123Av-Fc2</span></a></li>'), 
        l.includes("/advanced_search?type=100") && (this.hookPage(), this.handleQuery().then());
    }
    hookPage() {
        let t = $("h2.section-title");
        t.contents().first().replaceWith("123Av"), t.css("marginBottom", "0"), t.append('\n            <div style="margin-left: 100px; width: 400px;">\n                <input id="search-123av-keyword" type="text" placeholder="搜索123Av Fc2ppv内容" style="padding: 4px 5px;margin-right: 0">\n                <a id="search-123av-btn" class="a-primary" style="margin-left: 0">搜索</a>\n                <a id="clear-123av-btn" class="a-info" style="margin-left: 0">重置</a>\n            </div>\n        '), 
        $("#search-123av-keyword").val(this.keyword), $("#search-123av-btn").on("click", (async () => {
            let t = $("#search-123av-keyword").val().trim();
            t && (this.keyword = t, utils.setHrefParam("keyword", t), await this.handleQuery());
        })), $("#clear-123av-btn").on("click", (async () => {
            $("#search-123av-keyword").val(""), this.keyword = "", utils.setHrefParam("keyword", ""), 
            $(".page-box").show(), $(".tool-box").show(), await this.handleQuery();
        })), $(".empty-message").remove(), $("#foldCategoryBtn").remove(), $(".section .container .box").remove(), 
        $("#sort-toggle-btn").remove(), this.$contentBox.append('<div class="tool-box" style="margin-top: 10px"></div>'), 
        this.$contentBox.append('<div class="movie-list h cols-4 vcols-8" style="margin-top: 10px"></div>'), 
        this.$contentBox.append('<div class="page-box"></div>');
        $(".tool-box").append('\n            <div class="button-group">\n                <div class="buttons has-addons" id="conditionBox">\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="release_date">发布日期</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="recent_update">最近更新</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="trending">热门</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed_today">今天最多观看</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed_week">本周最多观看</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed_month">本月最多观看</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_viewed">最多观看</a>\n                    <a style="padding:18px 18px !important;" class="button is-small" data-sort="most_favourited">最受欢迎</a>\n                </div>\n            </div>\n        '), 
        $(`#conditionBox a[data-sort="${this.sortVal}"]`).addClass("is-info"), utils.setHrefParam("sort", this.sortVal), 
        utils.setHrefParam("page", this.currentPage), $("#conditionBox").on("click", "a.button", (t => {
            let e = $(t.target);
            this.sortVal = e.data("sort"), utils.setHrefParam("sort", this.sortVal), e.siblings().removeClass("is-info"), 
            e.addClass("is-info"), this.handleQuery();
        }));
        $(".page-box").append('\n            <nav class="pagination">\n                <a class="pagination-previous">上一页</a>\n                <ul class="pagination-list"></ul>\n                <a class="pagination-next">下一页</a>\n            </nav>\n        '), 
        $(document).on("click", ".pagination-link", (t => {
            t.preventDefault(), this.currentPage = parseInt($(t.target).data("page")), utils.setHrefParam("page", this.currentPage), 
            this.renderPagination(), this.handleQuery();
        })), $(".pagination-previous").on("click", (t => {
            t.preventDefault(), this.currentPage > 1 && (this.currentPage--, utils.setHrefParam("page", this.currentPage), 
            this.renderPagination(), this.handleQuery());
        })), $(".pagination-next").on("click", (t => {
            t.preventDefault(), this.currentPage < this.maxPage && (this.currentPage++, utils.setHrefParam("page", this.currentPage), 
            this.renderPagination(), this.handleQuery());
        }));
    }
    renderPagination() {
        const t = $(".pagination-list");
        t.empty();
        let e = Math.max(1, this.currentPage - 2), n = Math.min(this.maxPage, this.currentPage + 2);
        this.currentPage <= 3 ? n = Math.min(6, this.maxPage) : this.currentPage >= this.maxPage - 2 && (e = Math.max(this.maxPage - 5, 1)), 
        e > 1 && (t.append('<li><a class="pagination-link" data-page="1">1</a></li>'), e > 2 && t.append('<li><span class="pagination-ellipsis">…</span></li>'));
        for (let a = e; a <= n; a++) {
            const e = a === this.currentPage ? " is-current" : "";
            t.append(`<li><a class="pagination-link${e}" data-page="${a}">${a}</a></li>`);
        }
        n < this.maxPage && (n < this.maxPage - 1 && t.append('<li><span class="pagination-ellipsis">…</span></li>'), 
        t.append(`<li><a class="pagination-link" data-page="${this.maxPage}">${this.maxPage}</a></li>`));
    }
    async handleQuery() {
        let t = loading();
        try {
            let t = [];
            t = 1 === this.currentPage ? [ 1, 2 ] : [ 2 * this.currentPage - 1, 2 * this.currentPage ], 
            this.keyword && (t = [ 1 ], $(".page-box").hide(), $(".tool-box").hide());
            const e = await this.getBaseUrl(), n = t.map((t => {
                let n = `${e}/tags/fc2?sort=${this.sortVal}&page=${t}`;
                return this.keyword && (n = `${e}/search?keyword=${this.keyword}`), gmHttp.get(n);
            })), a = await Promise.all(n);
            let i = [];
            for (const o of a) {
                let t = $(o);
                if (t.find(".box-item").each(((t, n) => {
                    const a = $(n), s = a.find("img").attr("data-src");
                    let o = a.find("img").attr("title");
                    const r = a.find(".detail a"), l = r.attr("href"), c = e + (l.startsWith("/") ? l : "/" + l), d = r.text().trim().replace(o + " - ", "");
                    o = o.replace("FC2-PPV", "FC2"), i.push({
                        imgSrc: s,
                        carNum: o,
                        href: c,
                        title: d
                    });
                })), !this.maxPage) {
                    let e, n = t.find(".page-item:not(.disabled)").last();
                    if (n.find("a.page-link").length) {
                        let t = n.find("a.page-link").attr("href");
                        e = parseInt(t.split("page=")[1]);
                    } else e = parseInt(n.find("span.page-link").text());
                    this.maxPage = Math.ceil(e / 2), this.renderPagination();
                }
            }
            if (0 === i.length) {
                console.log(i), show.error("无结果");
                let t = `${e}/dm4/tags/fc2?sort=${this.sortVal}`;
                this.keyword && (t = `${e}/search?keyword=${this.keyword}`), console.error("获取数据失败!", t);
            }
            let s = this.markDataListHtml(i);
            $(".movie-list").html(s), await utils.smoothScrollToTop();
        } catch (e) {
            console.error(e);
        } finally {
            t.close();
        }
    }
    async open123AvFc2Dialog(t, e) {
        let n = "";
        await storageManager.getSetting("enableLoadOtherSite", I) === I && (n = '<div class="movie-panel-info fc2-movie-panel-info" style="margin-top:20px"><strong>第三方站点: </strong></div>');
        let a = `\n            <div class="movie-detail-container">\n               \x3c!-- <div class="movie-poster-container">\n                    <iframe class="movie-trailer" frameborder="0" allowfullscreen scrolling="no"></iframe>\n                </div>\n                <div class="right-box">--\x3e\n                    <div class="movie-info-container">\n                        <div class="search-loading">加载中...</div>\n                    </div>\n                    \n                    ${n}\n                    \n                    <div style="margin: 10px 0">\n                        <a id="filterBtn" class="menu-btn" style="background-color:${b}"><span>${v}</span></a>\n                        <a id="favoriteBtn" class="menu-btn" style="background-color:${x}"><span>${w}</span></a>\n                        <a id="hasDownBtn" class="menu-btn" style="background-color:${S}"><span>${k}</span></a>\n                        <a id="hasWatchBtn" class="menu-btn" style="background-color:${_};"><span>${C}</span></a>\n                        \n                        <a id="search-subtitle-btn" class="menu-btn fr-btn" style="background:linear-gradient(to bottom, #8d5656, rgb(196,159,91))">\n                            <span>字幕 (SubTitleCat)</span>\n                        </a>\n                        <a id="xunLeiSubtitleBtn" class="menu-btn fr-btn" style="background:linear-gradient(to left, #375f7c, #2196F3)">\n                            <span>字幕 (迅雷)</span>\n                        </a>\n                    </div>\n                    <div class="message video-panel" style="margin-top:20px">\n                        <div id="magnets-content" class="magnet-links">\n                        </div>\n                    </div>\n                    <div id="reviews-content">\n                    </div>\n                    <div id="related-content">\n                    </div>\n                    <span id="data-actress" style="display: none"></span>\n               \x3c!-- </div>--\x3e\n            </div>\n        `;
        layer.open({
            type: 1,
            title: t,
            content: a,
            area: utils.getDefaultArea(),
            skin: "movie-detail-layer",
            scrollbar: !1,
            success: (n, a) => {
                utils.setupEscClose(a), this.loadData(t, e);
                let i = t.replace("FC2-", "");
                $("#magnets-content").append(this.getBean("MagnetHubPlugin").createMagnetHub(i)), 
                $("#favoriteBtn").on("click", (async n => {
                    const a = $("#data-actress").text(), i = $("#data-publishTime").text();
                    await storageManager.saveCar({
                        carNum: t,
                        url: e,
                        names: a,
                        actionType: g,
                        publishTime: i
                    }), window.refresh(), layer.closeAll();
                })), $("#filterBtn").on("click", (n => {
                    utils.q(n, `是否屏蔽${t}?`, (async () => {
                        const n = $("#data-actress").text(), a = $("#data-publishTime").text();
                        await storageManager.saveCar({
                            carNum: t,
                            url: e,
                            names: n,
                            actionType: p,
                            publishTime: a
                        }), window.refresh(), layer.closeAll(), window.location.href.includes("collection_codes?movieId") && utils.closePage();
                    }));
                })), $("#hasDownBtn").on("click", (async n => {
                    const a = $("#data-actress").text(), i = $("#data-publishTime").text();
                    await storageManager.saveCar({
                        carNum: t,
                        url: e,
                        names: a,
                        actionType: m,
                        publishTime: i
                    }), window.refresh(), layer.closeAll();
                })), $("#hasWatchBtn").on("click", (async n => {
                    const a = $("#data-actress").text(), i = $("#data-publishTime").text();
                    await storageManager.saveCar({
                        carNum: t,
                        url: e,
                        names: a,
                        actionType: u,
                        publishTime: i
                    }), window.refresh(), layer.closeAll();
                })), $("#search-subtitle-btn").on("click", (e => utils.openPage(`https://subtitlecat.com/index.php?search=${t}`, t, !1, e))), 
                $("#xunLeiSubtitleBtn").on("click", (() => this.getBean("DetailPageButtonPlugin").searchXunLeiSubtitle(t)));
                let s = t.replace("FC2-", "");
                this.getBean("OtherSitePlugin").loadOtherSite(s, t).then();
            }
        });
    }
    async loadData(t, e) {
        let n = loading();
        try {
            const {id: n, publishDate: a, title: i, moviePoster: s} = await this.get123AvVideoInfo(e);
            $(".movie-info-container").html(`\n                    <h3 class="movie-title" style="margin-bottom: 10px"><strong class="current-title">${i || "无标题"}</strong></h3>\n                    <div class="movie-meta" style="margin-bottom: 10px">\n                        <span><strong>番号: </strong>${t || "未知"}</span>\n                        <span><strong>年份: </strong>${a || "未知"}</span>\n                        <span>\n                            <strong>站点: </strong>\n                            <a href="https://fc2ppvdb.com/articles/${t.replace("FC2-", "")}" target="_blank">fc2ppvdb</a>\n                            <a style="margin-left: 5px;" href="https://adult.contents.fc2.com/article/${t.replace("FC2-", "")}/" target="_blank">fc2电子市场</a>\n                        </span>\n                    </div>\n                    <div class="movie-actors" style="margin-bottom: 10px">\n                        <div class="actor-list"><strong>主演: </strong></div>\n                    </div>\n                    <div class="movie-seller" style="margin-bottom: 10px">\n                        <span><strong>販売者: </strong></span>\n                    </div>\n                    <div class="movie-gallery" style="margin-bottom: 10px">\n                        <strong>剧照: </strong>\n                        <div class="image-list"></div>\n                    </div>\n                    \n                    <div id="data-publishTime" style="display: none">${a || ""}</div>\n\n                `), 
            this.getImgList(t).then(), this.getActressInfo(t).then(), this.getBean("TranslatePlugin").translate(t, !1).then();
        } catch (a) {
            console.error(a);
        } finally {
            n.close();
        }
    }
    handleLongImg(t) {
        utils.loopDetector((() => $(".movie-gallery .image-list").length > 0), (async () => {
            $(".movie-gallery .image-list").prepend(' <a class="tile-item screen-container" style="overflow:hidden;max-height: 150px;max-width:150px; text-align:center;"><div style="margin-top: 50px;color: #000;cursor: auto">正在加载缩略图</div></a> ');
            const e = await this.getBean("ScreenShotPlugin").getScreenshot(t);
            e && ($(".screen-container").html(`<img src="${e}" alt="" loading="lazy" style="width: 100%;">`), 
            $(".screen-container").on("click", (t => {
                t.stopPropagation(), t.preventDefault(), showImageViewer(t.currentTarget);
            })));
        }));
    }
    async get123AvVideoInfo(t) {
        const e = await gmHttp.get(t), n = e.match(/v-scope="Movie\({id:\s*(\d+),/), a = n ? n[1] : null, i = utils.htmlTo$dom(e);
        return {
            id: a,
            publishDate: i.find('span:contains("リリース日:")').next("span").text(),
            title: i.find("h1").text().trim(),
            moviePoster: i.find("#player").attr("data-poster")
        };
    }
    async getActressInfo(t) {
        let e = `https://fc2ppvdb.com/articles/${t.replace("FC2-", "")}`;
        const n = await gmHttp.get(e), a = $(n), i = a.find("div").filter((function() {
            return 0 === $(this).text().trim().indexOf("女優：");
        }));
        if (0 === i.length || i.length > 1) return void show.error("解析女优信息失败");
        const s = $(i[0]).find("a");
        let o = "<strong>主演: </strong>";
        if (s.length > 0) {
            let t = "";
            s.each(((e, n) => {
                let a = $(n), i = a.text(), s = a.attr("href");
                o += `<span class="actor-tag"><a href="https://fc2ppvdb.com${s}" target="_blank">${i}</a></span>`, 
                t += i + " ";
            })), $("#data-actress").text(t);
        } else o += "<span>暂无演员信息</span>";
        $(".actor-list").html(o);
        const r = a.find("div").filter((function() {
            return 0 === $(this).text().trim().indexOf("販売者：");
        }));
        if (r.length > 0) {
            const t = $(r[0]).find("a");
            if (t.length > 0) {
                const e = $(t[0]);
                let n = e.text(), a = e.attr("href");
                $(".movie-seller").html(`<span><strong>販売者: </strong><a href="https://fc2ppvdb.com${a}" target="_blank">${n}</a></span>`);
            }
        }
    }
    async getImgList(t) {
        let e = t.replace("FC2-", ""), n = `https://adult.contents.fc2.com/article/${t.replace("FC2-", "")}/`;
        const a = await gmHttp.get(n, null, {
            referer: n
        });
        let i = $(a).find(".items_article_SampleImagesArea img").map((function() {
            return $(this).attr("src");
        })).get(), s = "";
        Array.isArray(i) && i.length > 0 ? s = i.map(((t, e) => `\n                <a href="${t}" data-fancybox="movie-gallery" data-caption="剧照 ${e + 1}">\n                    <img src="${t}" class="movie-image-thumb"  alt=""/>\n                </a>\n            `)).join("") : $(".movie-gallery").html("<h4>剧照: 暂无剧照</h4>"), 
        $(".image-list").html(s), this.handleLongImg(e);
    }
    async getMovie(t, e) {
        let n = `${await this.getBaseUrl()}/ajax/v/${t}/videos`, a = loading();
        try {
            let t = (await gmHttp.get(n)).result.watch;
            return t.length > 0 ? (t.forEach((t => {
                t.url = t.url + "?poster=" + e;
            })), t) : null;
        } catch (i) {
            console.error(i);
        } finally {
            a.close();
        }
    }
    markDataListHtml(t) {
        let e = "";
        return t.forEach((t => {
            e += `\n                <div class="item">\n                    <a href="${t.href}" class="box" title="${t.title}">\n                        <div class="cover ">\n                            <img loading="lazy" src="${t.imgSrc.replace("/s360", "")}" alt="">\n                        </div>\n                        <div class="video-title"><strong>${t.carNum}</strong> ${t.title}</div>\n                        <div class="score">\n                        </div>\n                        <div class="meta">\n                        </div>\n                        <div class="tags has-addons">\n                        </div>\n                    </a>\n                </div>\n            `;
        })), e;
    }
}

class Ot extends G {
    constructor() {
        super(...arguments), o(this, "currentEngine", null), o(this, "searchEngines", [ {
            name: "U9A9",
            id: "u9a9",
            url: "https://u9a9.com/?type=2&search={keyword}",
            targetPage: "https://u9a9.com/?type=2&search={keyword}",
            parseHtml: this.parseU3C3
        }, {
            name: "U3C3",
            id: "u3c3",
            url: "https://u3c3.com/?search2=a8lr16lo&search={keyword}",
            targetPage: "https://u3c3.com/?search2=a8lr16lo&search={keyword}",
            parseHtml: this.parseU3C3
        }, {
            name: "Sukebei",
            id: "Sukebei",
            url: "https://sukebei.nyaa.si/?f=0&c=0_0&q={keyword}",
            targetPage: "https://sukebei.nyaa.si/?f=0&c=0_0&q={keyword}",
            parseHtml: this.parseSukebei
        } ]);
    }
    getName() {
        return "MagnetHubPlugin";
    }
    async initCss() {
        return "\n            <style>\n                .magnet-container {\n                    margin: 20px auto;\n                    width: 100%;\n                    font-family: Arial, sans-serif;\n                }\n                .magnet-tabs {\n                    display: flex;\n                    border-bottom: 1px solid #ddd;\n                    margin-bottom: 15px;\n                    justify-content: space-between;\n                }\n                .magnet-tab {\n                    padding: 5px 12px;\n                    cursor: pointer;\n                    border: 1px solid transparent;\n                    border-bottom: none;\n                    margin-right: 5px;\n                    background: #f5f5f5;\n                    border-radius: 5px 5px 0 0;\n                }\n                .magnet-tab.active {\n                    background: #fff;\n                    border-color: #ddd;\n                    border-bottom: 1px solid #fff;\n                    margin-bottom: -1px;\n                    font-weight: bold;\n                }\n                .magnet-tab:hover:not(.active) {\n                    background: #e9e9e9;\n                }\n                \n                .magnet-results {\n                    min-height: 200px;\n                }\n                .magnet-result {\n                    padding: 15px;\n                    border-bottom: 1px solid #eee;\n                    position: relative; \n                }\n                .magnet-result:hover {\n                    background-color: #f9f9f9;\n                }\n                .magnet-title {\n                    font-weight: bold;\n                    margin-bottom: 5px;\n                    white-space: nowrap;\n                    overflow: hidden; \n                    text-overflow: ellipsis;\n                    padding-right: 80px; \n                }\n                .magnet-info {\n                    display: flex;\n                    justify-content: space-between;\n                    font-size: 12px;\n                    color: #666;\n                    margin-bottom: 5px;\n                }\n                .magnet-loading {\n                    text-align: center;\n                    padding: 20px;\n                }\n                .magnet-error {\n                    color: #f44336;\n                    padding: 10px;\n                }\n                \n                .magnet-copy {\n                    position: absolute;\n                    right: 15px;\n                    top: 12px;\n                }\n                .magnet-hub-btn {\n                    background-color: #f0f0f0;\n                    color: #555;\n                    border: 1px solid #ddd;\n                    padding: 3px 8px;\n                    border-radius: 3px;\n                    cursor: pointer;\n                    font-size: 12px;\n                    transition: all 0.2s;\n                    margin-left: 10px;\n                }\n                .magnet-hub-btn:hover {\n                    background-color: #e0e0e0;\n                    border-color: #ccc;\n                }\n                .magnet-hub-btn.copied {\n                    background-color: #4CAF50;\n                    color: white;\n                    border-color: #4CAF50;\n                }\n            </style>\n        ";
    }
    createMagnetHub(t) {
        t = t.replace("FC2-", "");
        const e = $('<div class="magnet-container"></div>'), n = $('<div class="magnet-tabs"></div>'), a = "jhs_magnetHub_selectedEngine", i = localStorage.getItem(a);
        let s = 0;
        const o = $('<div style="display: flex;"></div>');
        this.searchEngines.forEach(((t, e) => {
            const n = $(`<div class="magnet-tab" data-engine="${t.id}">${t.name}</div>`);
            i && t.id === i ? (n.addClass("active"), this.currentEngine = t, s = e) : 0 !== e || i || (n.addClass("active"), 
            this.currentEngine = t), o.append(n);
        })), n.append(o), n.append(`<a style="margin-right: 20px;margin-top:3px" id="targetBox" href="${this.currentEngine.targetPage.replace("{keyword}", encodeURIComponent(t))}" target="_blank">原网页</a>`), 
        e.append(n);
        const r = $('<div class="magnet-results"></div>');
        return e.append(r), e.on("click", ".magnet-tab", (n => {
            const i = $(n.target).data("engine");
            this.currentEngine = this.searchEngines.find((t => t.id === i)), $("#targetBox").attr("href", this.currentEngine.targetPage.replace("{keyword}", encodeURIComponent(t))), 
            localStorage.setItem(a, i), e.find(".magnet-tab").removeClass("active"), $(n.target).addClass("active"), 
            this.searchEngine(r, this.currentEngine, t);
        })), this.searchEngine(r, this.currentEngine || this.searchEngines[s], t), e;
    }
    searchEngine(t, e, n) {
        t.html(`<div class="magnet-loading">正在从 ${e.name} 搜索 "${n}"...</div>`);
        const a = `${e.name}_${n}`;
        sessionStorage.getItem(a);
        const i = e.url.replace("{keyword}", encodeURIComponent(n));
        e.parseHtml && GM_xmlhttpRequest({
            method: "GET",
            url: i,
            onload: i => {
                try {
                    const s = e.parseHtml.call(this, i.responseText, n);
                    s.length > 0 && sessionStorage.setItem(a, JSON.stringify(s)), this.displayResults(t, s, e.name);
                } catch (s) {
                    t.html(`<div class="magnet-error">解析 ${e.name} 结果失败: ${s.message}</div>`);
                }
            },
            onerror: n => {
                t.html(`<div class="magnet-error">从 ${e.name} 获取数据失败: ${n.statusText}</div>`);
            }
        }), e.parseJson && e.parseJson.call(this, t, e, n, a);
    }
    displayResults(t, e, n) {
        function a(t) {
            const e = t.text();
            t.addClass("copied").text("已复制"), setTimeout((() => {
                t.removeClass("copied").text(e);
            }), 2e3);
        }
        function i(t, e) {
            const n = document.createElement("textarea");
            n.value = t, n.style.position = "fixed", document.body.appendChild(n), n.select();
            try {
                document.execCommand("copy"), a(e);
            } catch (i) {
                console.error("复制失败:", i), alert("复制失败，请手动复制链接");
            }
            document.body.removeChild(n);
        }
        t.empty(), 0 !== e.length ? (e.forEach((e => {
            const n = $(`\n                <div class="magnet-result">\n                    <div class="magnet-title"><a href="${e.magnet}">${e.title}</a></div>\n                    <div class="magnet-info">\n                        <span>大小: ${e.size || "未知"}</span>\n                        <span>日期: ${e.date || "未知"}</span>\n                    </div>\n                    <div class="magnet-copy">\n                        <button class="magnet-hub-btn copy-btn" data-magnet="${e.magnet}">复制链接</button>\n                        <button class="magnet-hub-btn down-115" data-magnet="${e.magnet}">115离线下载</button>\n                    </div>\n                </div>\n            `);
            t.append(n);
        })), t.on("click", ".copy-btn", (function() {
            const t = $(this), e = t.data("magnet");
            navigator.clipboard ? navigator.clipboard.writeText(e).then((() => {
                a(t);
            })).catch((n => {
                i(e, t);
            })) : i(e, t);
        })), t.on("click", ".down-115", (async t => {
            const e = $(t.currentTarget).data("magnet");
            let n = loading();
            try {
                await this.getBean("WangPan115TaskPlugin").handleAddTask(e);
            } catch (a) {
                show.error("发生错误:" + a), console.error(a);
            } finally {
                n.close();
            }
        }))) : t.append('<div class="magnet-error">没有找到相关结果</div>');
    }
    parseBTSOW(t, e, n, a) {
        const i = this;
        GM_xmlhttpRequest({
            method: "POST",
            url: e.url,
            headers: {
                "Content-Type": "application/json"
            },
            data: `[{"search":"${n}"},50,1]`,
            onload: n => {
                try {
                    const s = JSON.parse(n.responseText).data, o = [];
                    for (let t = 0; t < s.length; t++) {
                        let e = s[t];
                        o.push({
                            title: e.name,
                            magnet: "magnet:?xt=urn:btih:" + e.hash,
                            size: (e.size / 1073741824).toFixed(2) + " GB",
                            date: utils.formatDate(new Date(1e3 * e.lastUpdateTime))
                        });
                    }
                    o.length > 0 && sessionStorage.setItem(a, JSON.stringify(o)), i.displayResults(t, o, e.name);
                } catch (s) {
                    t.html(`<div class="magnet-error">解析 ${e.name} 结果失败: ${s.message}</div>`);
                }
            },
            onerror: n => {
                t.html(`<div class="magnet-error">从 ${e.name} 获取数据失败: ${n.statusText}</div>`);
            }
        });
    }
    parseU3C3(t, e) {
        const n = utils.htmlTo$dom(t), a = [];
        return n.find(".torrent-list tbody tr").each(((t, n) => {
            const i = $(n);
            if (i.text().includes("置顶")) return;
            const s = i.find("td:nth-child(2) a").attr("title") || i.find("td:nth-child(2) a").text().trim();
            if (!s.toLowerCase().includes(e.toLowerCase())) return;
            const o = i.find("td:nth-child(3) a[href^='magnet:']").attr("href"), r = i.find("td:nth-child(4)").text().trim(), l = i.find("td:nth-child(5)").text().trim();
            o && a.push({
                title: s,
                magnet: o,
                size: r,
                date: l
            });
        })), a;
    }
    parseSukebei(t, e) {
        const n = utils.htmlTo$dom(t), a = [];
        return n.find(".torrent-list tbody tr").each(((t, n) => {
            const i = $(n);
            if (i.text().includes("置顶")) return;
            const s = i.find("td:nth-child(2) a").attr("title") || i.find("td:nth-child(2) a").text().trim();
            if (!s.toLowerCase().includes(e.toLowerCase())) return;
            const o = i.find("td:nth-child(3) a[href^='magnet:']").attr("href"), r = i.find("td:nth-child(4)").text().trim(), l = i.find("td:nth-child(5)").text().trim();
            o && a.push({
                title: s,
                magnet: o,
                size: r,
                date: l
            });
        })), a;
    }
}

class Kt extends G {
    getName() {
        return "ScreenShotPlugin";
    }
    async handle() {
        this.loadScreenShot().then();
    }
    async loadScreenShot() {
        if (!isDetailPage) return;
        if ("yes" !== await storageManager.getSetting("enableLoadScreenShot", "yes")) return;
        let t = this.getPageInfo().carNum;
        c && $(".preview-images .tile-item").first().before(' <a class="tile-item screen-container" style="overflow:hidden;max-height: 215px;text-align:center;"><div style="margin-top: 50px;color: #000;cursor: auto">正在加载缩略图</div></a> '), 
        d && $("#sample-waterfall .sample-box:first").after(' <a class="sample-box screen-container" style="overflow:hidden; height: 110px; text-align:center;"><div style="margin-top: 30px;color: #000;cursor: auto">正在加载缩略图</div></a> ');
        try {
            const e = await this.getScreenshot(t);
            this.addImg("缩略图", e), clog.log("加载缩略图:", e);
        } catch (e) {
            this.showErrorFallback(t, e);
        }
    }
    async getScreenshot(t) {
        const e = localStorage.getItem("jhs_screenShot") ? JSON.parse(localStorage.getItem("jhs_screenShot")) : {};
        if (e[t]) return clog.debug("缓存中存在缩略图:", t, e[t]), e[t];
        let n;
        try {
            n = await Promise.any([ this.getJavStoreScreenShot(t) ]);
        } catch (i) {
            throw clog.error("获取缩略图资源失败:", n, i), i;
        }
        if (!n) return this.showErrorFallback(t, null), null;
        const a = n.indexOf("https://");
        return -1 !== a && (n = n.substring(a)), e[t] = n, clog.log("缩略图获取成功:", n), localStorage.setItem("jhs_screenShot", JSON.stringify(e)), 
        n;
    }
    async getJavStoreScreenShot(t) {
        let e = `https://javstore.net/search/${t}.html`;
        clog.log("正在解析缩略图:", e);
        let n = await gmHttp.get(e);
        const a = utils.htmlTo$dom(n);
        let i = null;
        if (a.find("#content_news h3 span a").each((function() {
            if ($(this).attr("title").toLowerCase().includes(t.toLowerCase())) return i = $(this).attr("href"), 
            !1;
        })), !i) return clog.error("JavStore, 查询番号失败:", e), null;
        let s = await gmHttp.get(i);
        const o = utils.htmlTo$dom(s);
        let r = o.find("a:contains('CLICK HERE')").attr("href") || o.find("img[src*='_s.jpg']").attr("src");
        return r ? r.replace(".th", "") : (clog.error("JavStore, 解析预览图失败:", e), null);
    }
    async getJavBestScreenShot(t) {
        let e = `https://javbest.net/?s=${t}`;
        clog.log("正在解析缩略图:", e);
        let n = await gmHttp.get(e);
        const a = utils.htmlTo$dom(n), i = a.find(".app_loop_thumb a").first().attr("href");
        if (!i) throw clog.error("解析JavBest搜索页失败:", e), new Error("解析JavBest搜索页失败");
        const s = a.find(".app_loop_thumb a").first().attr("title");
        if (!s.toLowerCase().includes(t.toLowerCase())) throw clog.error("解析JavBest搜索页失败:", s), 
        new Error("解析JavBest搜索页失败");
        const o = await gmHttp.get(i);
        let r = $(o).find('#content a img[src*="_t.jpg"]').attr("src");
        if (!r) throw clog.error("解析JavBest缩略图失败:", e), new Error("解析JavBest缩略图失败");
        return r = r.replace("_t", "").replace("http:", "https:"), r;
    }
    async getJavFreeScreenShot(t) {
        let e = `https://javfree.me/search/${t}/`, n = await gmHttp.get(e);
        const a = utils.htmlTo$dom(n).find("article h2.entry-title a");
        if (!a || 0 === a.length) throw clog.error("解析JavFree搜索页失败:", e), new Error("解析JavFree搜索页失败");
        let i = $(a[0]).attr("href"), s = await gmHttp.get(i);
        const o = utils.htmlTo$dom(s).find("#main > article > .entry-content > p img");
        if (!o || 0 === o.length) throw clog.error("解析JavFree详情页失败:", i), new Error("解析JavFree详情页失败");
        const r = o.filter((function() {
            const t = $(this).attr("src");
            return t && t.toLowerCase().endsWith(".jpeg");
        })).map((function() {
            return $(this).attr("src");
        })).get();
        return console.log(r), r.at(-1);
    }
    addImg(t, e) {
        e && (c && $(".screen-container").html(`<img src="${e}" alt="${t}" loading="lazy" style="width: 100%;">`), 
        d && $(".screen-container").html(`<div class="photo-frame"><img src="${e}" style="height: inherit;width: 100%;" title="${t}" alt="${t}"></div>`), 
        $(".screen-container").on("click", (t => {
            t.stopPropagation(), t.preventDefault(), showImageViewer(t.currentTarget);
        })));
    }
    showErrorFallback(t, e) {
        var n;
        console.error("获取缩略图失败:", null == (n = null == e ? void 0 : e.message) ? void 0 : n.substring(0, 100));
        let a = d ? "margin-top: 30px" : "margin-top: 50px";
        $(".screen-container").html(`<div style="${a}; cursor:auto;color:#000;">获取缩略图失败</div><br/><a href='#' class='retry-link'>点击重试</a> 或 <a class="check-link" href='https://javstore.net/search/${t}.html' target='_blank'>前往确认</a>`).off("click", ".retry-link").off("click", ".check-link").on("click", ".retry-link", (async e => {
            e.stopPropagation(), e.preventDefault(), $(".screen-container").html(`<div style="${a};cursor:auto;color:#000;">正在重新加载...</div>`);
            try {
                const e = await this.getScreenshot(t);
                this.addImg("缩略图", e);
            } catch (n) {
                this.showErrorFallback(t, n);
            }
        })).on("click", ".check-link", (async e => {
            e.stopPropagation(), e.preventDefault(), window.open(`https://javstore.net/search/${t}.html`, "_blank");
        }));
    }
}

const Vt = async () => {
    const t = await gmHttp.get("https://webapi.115.com/offine/downpath");
    return "object" == typeof t ? t.data : null;
}, Rt = async (t, e = 0, n = 30) => {
    const a = `https://webapi.115.com/files/search?search_value=${encodeURIComponent(t)}&offset=${e}&limit=${n}`;
    return await gmHttp.get(a);
};

class Wt extends G {
    getName() {
        return "WangPan115TaskPlugin";
    }
    async handle() {
        $(".buttons button[data-clipboard-text*='magnet:']").each(((t, e) => {
            $(e).parent().append($("<button>").text("115离线下载").addClass("button is-info is-small").click((async t => {
                t.stopPropagation(), t.preventDefault();
                let n = loading();
                try {
                    await this.handleAddTask($(e).attr("data-clipboard-text"));
                } catch (a) {
                    show.error("发生错误:" + a), console.error(a);
                } finally {
                    n.close();
                }
            })));
        })), d && isDetailPage && utils.loopDetector((() => $("#magnet-table td a").length > 0), (() => {
            this.bus115Down();
        }));
    }
    async bus115Down() {
        $("#magnet-table tr").each(((t, e) => {
            const n = $(e).find("td:nth-child(1) a").attr("href");
            if (n && n.includes("magnet:")) {
                const t = $("<td>").addClass("action-cell");
                $("<button>").text("115离线下载").addClass("button is-info is-small").click((async t => {
                    t.stopPropagation(), t.preventDefault();
                    let e = loading();
                    try {
                        await this.handleAddTask(n);
                    } catch (a) {
                        show.error("发生错误:" + a), console.error(a);
                    } finally {
                        e.close();
                    }
                })).appendTo(t), $(e).append(t);
            }
        })), $("#magnet-table tbody").length > 0 && $("#magnet-table tbody tr").append($("<td>").text("操作"));
    }
    async getSavePathId(t) {
        let e = await storageManager.getSetting("savePath115", "云下载");
        t && (e = e.replaceAll("{ny}", t)), e = e.replaceAll("{date}", utils.formatDate(new Date));
    }
    async handleAddTask(t, e) {
        const n = await (async () => {
            const t = await gmHttp.get("https://115.com/?ct=offline&ac=space&_=" + (new Date).getTime());
            return "object" == typeof t ? t : null;
        })();
        if (!n) return void show.error("未登录115网盘", {
            close: !0,
            duration: -1,
            callback: async () => {
                window.open("https://115.com");
            }
        });
        const a = n.sign, i = n.time, s = this.getUserId(), o = await (async (t, e = "", n, a, i) => {
            const s = {
                url: encodeURIComponent(t),
                wp_path_id: "",
                uid: n,
                sign: a,
                time: i
            };
            return await gmHttp.postForm("https://115.com/web/lixian/?ct=lixian&ac=add_task_url", s);
        })(t, s, a, i);
        console.log("离线下载返回值:", o);
        let r = o.info_hash, l = await this.getFileId(s, a, i, r), c = "https://115.com/?tab=offline&mode=wangpan";
        l && (c = `https://115.com/?cid=${l}&offset=0&mode=wangpan`);
        let d = "添加成功, 是否前往查看?";
        !1 === o.state && (d = o.error_msg + " 是否前往查看?"), utils.q(null, d, (async () => {
            let t = await this.getFileId(s, a, i, r);
            t && (c = `https://115.com/?cid=${t}&offset=0&mode=wangpan`), window.open(c);
        }));
    }
    async getUserId() {
        let t = await Vt();
        if (t && t.length > 0) return t[0].id;
        {
            show.info("没有默认离线目录, 正在创建中...");
            const e = (await (async (t, e = 0) => {
                const n = {
                    pid: e,
                    cname: t
                };
                return await gmHttp.postFileFormData("https://webapi.115.com/files/add", n);
            })("云下载")).file_id;
            if (await (async t => {
                const e = {
                    file_id: t
                };
                return await gmHttp.postFileFormData("https://webapi.115.com/offine/downpath", e);
            })(e), show.info("创建完成, 开始执行离线下载"), t = await Vt(), t && t.length > 0) return t[0].id;
            throw new Error("获取115用户Id失败");
        }
    }
    async getFileId(t, e, n, a) {
        const i = await (async (t, e, n) => {
            const a = {
                page: 1,
                uid: t,
                sign: e,
                time: n
            };
            return (await gmHttp.postForm("https://115.com/web/lixian/?ct=lixian&ac=task_lists", a)).tasks;
        })(t, e, n);
        console.log("云离线列表:", i);
        let s = null;
        for (let o = 0; o < i.length; o++) {
            let t = i[o];
            if (t.info_hash === a) {
                s = t.file_id;
                break;
            }
        }
        return s;
    }
}

class qt extends G {
    constructor() {
        super(...arguments), o(this, "JHS_115_COOKIE", "jhs_115_cookie"), o(this, "JHS_115_MAX_AGE", "jhs_115_max_age");
    }
    getName() {
        return "WangPan115Plugin";
    }
    async initCss() {
        return "\n            <style>\n                .login-box .ltab-office {\n                    border: 1px solid #DEE4EE;\n                }\n                \n                .change-bg::before {\n                    background-color:#F9FAFB !important;\n                }\n                \n                .site-login-wrap {\n                    height: auto;\n                }\n                \n                #jhs-cookie-panel {\n                    width: 200px;\n                    position: fixed;\n                    bottom: 20px;\n                    right: 20px;\n                    z-index: 10000;\n                    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;\n                    cursor: pointer;\n                    background-color: #FFFFFF;\n                    color: #333333;\n                    padding: 0;\n                    border-radius: 6px;\n                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n                    transition: all 0.3s ease;\n                    border: 1px solid #E0E0E0;\n                }\n    \n                #jhs-cookie-panel.expanded {\n                    padding: 0;\n                    border-radius: 8px;\n                    background-color: #FFFFFF;\n                    color: #333333;\n                    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);\n                }\n    \n                #jhs-cookie-header {\n                    padding: 10px 15px;\n                    background-color: #0078D4;\n                    color: white;\n                    border-radius: 6px 6px 0 0;\n                    display: flex;\n                    justify-content: space-between;\n                    align-items: center;\n                    font-weight: 600;\n                }\n                \n                #jhs-cookie-panel:not(.expanded) #jhs-cookie-header {\n                    border-radius: 6px;\n                    padding: 8px 15px;\n                }\n    \n                #jhs-cookie-content {\n                    max-height: 0;\n                    overflow: hidden;\n                    transition: max-height 0.3s ease-out;\n                    padding: 0 15px;\n                }\n    \n                #jhs-cookie-panel.expanded #jhs-cookie-content {\n                    max-height: 250px;\n                    padding: 15px;\n                }\n    \n                #jhs-cookie-value {\n                    max-height: 100px;\n                    overflow-y: auto;\n                    white-space: pre-wrap;\n                    word-break: break-all;\n                    margin-bottom: 15px;\n                    padding: 10px;\n                    border: 1px solid #CCCCCC;\n                    background-color: #F8F8F8;\n                    font-size: 12px;\n                    border-radius: 4px;\n                    color: #555;\n                }\n    \n                #jhs-copy-btn {\n                    background-color: #10B981;\n                    color: white;\n                    border: none;\n                    padding: 8px 15px;\n                    text-align: center;\n                    text-decoration: none;\n                    display: inline-block;\n                    font-size: 14px;\n                    margin: 0;\n                    cursor: pointer;\n                    border-radius: 4px;\n                    width: 100%;\n                    font-weight: 600;\n                    transition: background-color 0.2s ease;\n                }\n                \n                #jhs-copy-btn:hover {\n                    background-color: #059669;\n                }\n            </style>\n        ";
    }
    async handle() {
        l.includes("&ac=userfile") || l.includes("115") && (utils.loopDetector((() => $("#js-login-box").length > 0), (() => {
            0 !== $("#js-login-box").length && (this.reLogin(), this.hookPage(), this.bindClick());
        }), 20, 4e3, !0), this.createCookiePanel());
    }
    reLogin() {
        utils.loopDetector((() => $(".login-finished").length > 0), (() => {
            if ($(".login-finished").length > 0 || 0 === $("#js-login-box").length) return;
            const t = localStorage.getItem(this.JHS_115_COOKIE), e = localStorage.getItem(this.JHS_115_MAX_AGE);
            document.cookie.includes("SEID") || null === t || utils.q(null, "检测到上次登录已有缓存cookie, 是否使用并登录?", (() => {
                utils.addCookie(t, {
                    maxAge: parseInt(e),
                    domain: ".115.com"
                }), window.location.href = "https://115.com/?cid=0&offset=0&mode=wangpan";
            }));
        }), 20, 1500, !0);
    }
    hookPage() {
        const t = $('<a id="jhs-cookie"><s>🔰 JHS-扫码</s></a>');
        $(".ltab-office").after(t);
        const e = $(`\n            <div id="jhs_cookie_box" style="display: none; padding: 0 20px; max-width: 300px; margin: auto;">\n                <div style="margin-bottom: 15px; text-align: center;">\n                    <span style="font-size: 18px; font-weight: bold; color: #333; display: block; margin-bottom: 10px;"> 使用115App扫码登录 </span>\n                    <div style="text-align: left;">\n                        <select id="login-115-type" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ddd; font-size: 14px; box-sizing: border-box; background-color: white;">\n                            <option value="" style="color: #999;">请选择登录方式</option>\n                            <option value="wechatmini">微信小程序</option>\n                            <option value="alipaymini">支付宝小程序</option>\n                        </select>\n                    </div>\n                </div>\n                \n                <div style="text-align: left;">\n                    <select id="cookie-expiry-select" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ddd; font-size: 14px; box-sizing: border-box; background-color: white;">\n                        ${[ {
            label: "有效期: 会话 (关闭浏览器)",
            value: 0
        }, {
            label: "有效期: 1 天",
            value: 86400
        }, {
            label: "有效期: 7 天",
            value: 604800
        }, {
            label: "有效期: 30 天",
            value: 2592e3,
            default: !0
        }, {
            label: "有效期: 60 天",
            value: 5184e3
        }, {
            label: "有效期: 180 天",
            value: 15552e3
        } ].map((t => `<option value="${t.value}"  ${t.default ? "selected" : ""} > ${t.label} </option>`)).join("")}\n                    </select>\n                </div>\n                \n                <div id="qrcode-box" style="display: none; justify-content:center; min-height: 100px; border: 1px dashed #aaa; padding: 15px; text-align: center; margin-top: 15px; border-radius: 4px; background-color: #fff; line-height: 70px; color: #666;">\n                    二维码占位区域\n                </div>\n                \n                                \n                <div style="margin-bottom: 15px; text-align: center; margin-top:50px">\n                    <span style="font-size: 18px; font-weight: bold; color: #333; display: block; margin-bottom: 10px;">已有Cookie? 在此输入并回车</span>\n                    <div style="text-align: left;">\n                        <input type="text" id="cookie-str-input" style="width: 100%; padding: 10px; border-radius: 4px; border: 1px solid #ddd; font-size: 14px; box-sizing: border-box; background-color: white;">\n                    </div>\n                </div>\n            </div>\n        `);
        $("#js-login_box").find(".login-footer").before(e);
    }
    bindClick() {
        $("#jhs-cookie").on("click", (() => {
            const t = document.querySelector('[lg_rel="finished"]');
            t ? t.style.display = "none" : (document.querySelector('[lg_rel="qrcode"]').style.display = "none", 
            document.querySelector(".login-footer").style.display = "none", document.querySelector(".list-other-login").style.display = "none"), 
            document.querySelectorAll("#js-login_way > *").forEach((t => {
                t.classList.remove("current");
            })), document.querySelector("#jhs_cookie_box").style.display = "block", $("#jhs-cookie").css("background", "#fff"), 
            $(".ltab-cloud").addClass("change-bg");
        })), $(".ltab-cloud").on("click", (() => {
            document.querySelector("#jhs_cookie_box").style.display = "none";
            const t = document.querySelector('[lg_rel="finished"]');
            t ? t.style.display = "flex" : (document.querySelector('[lg_rel="qrcode"]').style.display = "block", 
            document.querySelector(".login-footer").style.display = "block", document.querySelector(".list-other-login").style.display = "block"), 
            $("#jhs-cookie").css("background", "#F9FAFB"), $(".ltab-cloud").removeClass("change-bg");
        }));
        let t = null;
        $("#login-115-type").on("change", (async e => {
            let n = $("#login-115-type").val();
            if (!n) return;
            const a = (await (async t => {
                let e = `https://qrcodeapi.115.com/api/1.0/${t}/1.0/token/`;
                return await gmHttp.get(e);
            })(n)).data, i = a.qrcode, s = a.sign, o = a.time, r = a.uid;
            console.log("生成二维码:", a);
            const l = $("#qrcode-box");
            l.css("display", "flex"), l.html(""), new QRCode(l[0], {
                text: i,
                width: 150,
                height: 150,
                correctLevel: QRCode.CorrectLevel.H
            }), t && clearTimeout(t);
            const c = async () => {
                try {
                    const e = await (async (t, e, n) => {
                        let a = `https://qrcodeapi.115.com/get/status/?uid=${t}&time=${e}&sign=${n}`;
                        return await gmHttp.get(a);
                    })(r, o, s);
                    console.log("已扫码, 正在获取结果:", e);
                    let a = e.data, i = a.msg, l = a.status;
                    if (i && (console.log(i), show.info(i)), 2 === l) {
                        show.ok("扫码登录成功");
                        const t = await (async (t, e) => {
                            const n = {
                                app: t,
                                account: e
                            }, a = `https://passportapi.115.com/app/1.0/${t}/1.0/login/qrcode/`;
                            return await gmHttp.postFileFormData(a, n);
                        })(n, r);
                        if (console.log("扫码登录成功:", t), t.data && t.data.cookie) {
                            const e = t.data.cookie, n = `UID=${e.UID}; CID=${e.CID}; SEID=${e.SEID}; KID=${e.KID}`;
                            console.log("解析出cookie:", n), localStorage.setItem(this.JHS_115_COOKIE, n), localStorage.setItem(this.JHS_115_MAX_AGE, $("#cookie-expiry-select").val()), 
                            window.location.href = "https://115.com/?cid=0&offset=0&mode=wangpan";
                        }
                        return;
                    }
                    t = setTimeout(c, 500);
                } catch (e) {
                    console.error("登录检查失败:", e);
                }
            };
            await c();
        }));
        const e = document.getElementById("cookie-str-input");
        e.addEventListener("keydown", (function(t) {
            if ("Enter" === t.key) {
                t.preventDefault();
                const n = e.value, a = document.getElementById("cookie-expiry-select");
                let i = parseInt(a.value);
                utils.addCookie(n, {
                    maxAge: i,
                    domain: ".115.com"
                }), window.location.href = "https://115.com/?cid=0&offset=0&mode=wangpan";
            }
        }));
    }
    showMessage(t) {
        const e = document.createElement("div");
        e.textContent = t, e.style.cssText = "\n            position: fixed;\n            top: 20px;\n            right: 20px;\n            background-color: #333;\n            color: white;\n            padding: 10px 20px;\n            border-radius: 5px;\n            z-index: 20000;\n            opacity: 0;\n            transition: opacity 0.5s ease-in-out;\n        ", 
        document.body.appendChild(e), setTimeout((() => {
            e.style.opacity = "1";
        }), 10), setTimeout((() => {
            e.style.opacity = "0", setTimeout((() => e.remove()), 500);
        }), 3e3);
    }
    createCookiePanel() {
        const t = localStorage.getItem(this.JHS_115_COOKIE);
        if (!t) return;
        const e = document.createElement("div");
        e.id = "jhs-cookie-panel", e.innerHTML = `\n            <div id="jhs-cookie-header">\n                <span>JHS-115-Cookie</span>\n                <span id="jhs-toggle-icon">▼</span>\n            </div>\n            <div id="jhs-cookie-content">\n                <div id="jhs-cookie-value">${t}</div>\n                <button id="jhs-copy-btn">复制 Cookie</button>\n            </div>\n        `, 
        document.body.appendChild(e);
        const n = document.getElementById("jhs-cookie-header");
        document.getElementById("jhs-cookie-content");
        const a = document.getElementById("jhs-toggle-icon"), i = document.getElementById("jhs-copy-btn");
        n.addEventListener("click", (() => {
            const t = e.classList.toggle("expanded");
            a.textContent = t ? "▲" : "▼";
        })), i.addEventListener("click", (async e => {
            e.stopPropagation();
            try {
                await navigator.clipboard.writeText(t), this.showMessage("Cookie 已成功复制到剪贴板!");
            } catch (n) {
                console.error("Failed to copy text using clipboard API: ", n);
                const e = document.createElement("textarea");
                e.value = t, document.body.appendChild(e), e.select(), document.execCommand("copy"), 
                document.body.removeChild(e), this.showMessage("Cookie 已复制! (回退方案)");
            }
        })), e.classList.remove("expanded");
    }
}

const Jt = class t extends G {
    constructor() {
        super(...arguments), o(this, "loginStatus", t.LoginStatus.UNCHECKED);
    }
    getName() {
        return "WangPan115MatchPlugin";
    }
    async initCss() {
        return "\n            <style>\n                [class^='jhs-match-'] {\n                    padding: 1px 2px;\n                    margin-left: 0;\n                    margin-right: 5px;\n                }\n                \n                .jhs-match-detail {\n                    display: inline-block;\n                    width: 50%;\n                    z-index: 1000;\n                    background: #fff;\n                    border: 1px solid #ddd;\n                    border-radius: 4px;\n                    padding: 10px;\n                    overflow-y: auto;\n                }\n                .jhs-match-detail.isListPage{\n                    position: absolute;\n                    box-shadow: 0 2px 10px rgba(0,0,0,0.2);\n                }\n                .jhs-match-detail table {\n                    width: 100%;\n                    border-collapse: collapse;\n                }\n                .jhs-match-detail th, .jhs-match-detail td {\n                    padding: 4px 8px;\n                    border: 1px solid #eee;\n                    text-align: left;\n                }\n                .jhs-match-detail th {\n                    background-color: #f5f5f5;\n                }\n                .jhs-match-detail tr:hover {\n                    background-color: #f9f9f9;\n                }\n            </style>\n        ";
    }
    async handle() {
        $(document).on("click", ".jhs-match-no-login-btn", (async t => {
            t.preventDefault(), t.stopPropagation(), await this.handleLoginRedirect();
        })), $(document).on("click", ".jhs-match-btn", (t => {
            t.preventDefault(), t.stopImmediatePropagation(), this.showMatchDetail(t.currentTarget);
        })), $(document).on("click", ".jhs-match-error-btn", (async t => {
            t.preventDefault(), t.stopPropagation(), await this.retryMatch(t.currentTarget);
        })), await this.matchDetailPage(), $(document).on("click", ".jhs-match-detail-error-btn", (async t => {
            t.preventDefault(), t.stopPropagation();
            $(t.currentTarget).replaceWith("<a class='jhs-match-btn' title=\"匹配中...\">匹配中...</a>");
            try {
                const t = this.getPageInfo().carNum, e = await this.searchFiles(t);
                $(".jhs-115-match-detail").remove(), await this.matchDetailPage(e);
            } catch (e) {
                console.error(`重新匹配失败 [${carNum}]:`, e), this.showMatchError($box, carNum, e);
            }
        }));
    }
    async matchDetailPage(e) {
        if (!isDetailPage) return;
        if (await storageManager.getSetting("enable115Match", T) === T) return;
        const n = $('\n            <div class="jhs-match-detail jhs-115-match-detail" id="115-match-table">\n                <table>\n                    <thead>\n                        <tr style="text-align: center">\n                            <th colspan="4">115匹配</th>\n                        </tr>\n                        <tr>\n                            <th>名称</th>\n                            <th>大小</th>\n                            <th>时间</th>\n                            <th>播放</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                    </tbody>\n                </table>\n            </div>\n        '), a = n.find("tbody");
        try {
            const n = this.getPageInfo().carNum;
            if (e || (e = await this.searchFiles(n)), await this.checkLoginStatus(), this.loginStatus === t.LoginStatus.LOGGED_OUT) a.append(`<tr><td colspan="4">\n                     <a class='jhs-match-no-login-btn a-info'\n                        data-keyword="${n}"\n                        title="未登录115网盘">未登录</a>\n                 </td></tr>`); else if (e.length > 0) {
                const t = e.map((t => `\n                <tr>\n                    <td>${t.name}</td>\n                    <td>${this.formatSize(t.size)}</td>\n                    <td>${t.createTime}</td>\n                    <td>\n                        <a href="https://115vod.com/?pickcode=${t.videoId}&share_id=0"\n                           target="_blank"\n                           class="a-success"\n                           title="播放">播放</a>\n                    </td>\n                </tr>\n            `)).join("");
                a.append(t);
            } else a.append(`<tr><td colspan="4">\n                     <a class='jhs-match-detail-error-btn a-info'\n                        data-keyword="${n}"\n                        title="未匹配,点击重试">未匹配</a>\n                 </td></tr>`);
        } catch (i) {
            a.append(`<tr><td colspan="4">\n                 <a class="a-danger jhs-match-detail-error-btn" title="${i.message || "加载失败"}">加载失败，请重试</a>\n             </td></tr>`), 
            console.error("加载文件列表时发生错误:", i);
        }
        c ? ($("#all-match-box").length || $("#tabs-container").before("<div style='display: flex' id='all-match-box'></div>"), 
        $("#all-match-box").append(n)) : $(".container .info").append(n);
    }
    async matchMovieList(t) {
        await storageManager.getSetting("enable115Match", T) !== T ? (await this.checkLoginStatus(), 
        await this.processMovieElements(t)) : $(".video-title [class^='jhs-match-']").remove();
    }
    showMatchDetail(t) {
        const e = $(t), n = e.attr("data-match");
        $(".jhs-match-detail").remove();
        const a = this.parseMatchData(n);
        if (0 === a.length) return;
        if (1 === a.length) {
            const t = a[0].videoId;
            return void window.open(`https://115vod.com/?pickcode=${t}&share_id=0`, "_blank");
        }
        const i = this.createMatchDetailElement(a);
        this.positionDetailElement(i, e), this.addOutsideClickHandler(i), i.on("click", (t => {
            t.stopPropagation();
        }));
    }
    parseMatchData(t) {
        try {
            return JSON.parse(t) || [];
        } catch (e) {
            return console.error("解析匹配数据失败:", e), [];
        }
    }
    createMatchDetailElement(t) {
        const e = $(`\n            <div class="jhs-match-detail isListPage">\n                <table>\n                    <thead>\n                        <tr>\n                            <th>名称</th>\n                            <th>大小</th>\n                            <th>时间</th>\n                            <th>播放</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                        ${t.map((t => `\n                            <tr>\n                                <td>${t.name}</td>\n                                <td>${this.formatSize(t.size)}</td>\n                                <td>${t.createTime}</td>\n                                <td>\n                                    <a href="https://115vod.com/?pickcode=${t.videoId}&share_id=0" \n                                       target="_blank" \n                                       class="a-success"\n                                       title="播放">播放</a>\n                                </td>\n                            </tr>\n                        `)).join("")}\n                    </tbody>\n                </table>\n            </div>\n        `);
        return $("body").append(e), e;
    }
    positionDetailElement(t, e) {
        const n = e.offset();
        t.css({
            top: n.top - t.outerHeight() + 20,
            left: n.left
        });
    }
    addOutsideClickHandler(t) {
        const e = "click.jhs-match-detail";
        setTimeout((() => {
            $(document).on(e, (n => {
                t.is(n.target) || 0 !== t.has(n.target).length || (t.remove(), $(document).off(e));
            }));
        }), 100);
    }
    async retryMatch(t) {
        const e = $(t), n = e.closest(".movie-box, .item"), a = e.attr("data-keyword");
        e.replaceWith("<a class='jhs-match-btn' title=\"匹配中...\">匹配中...</a>");
        try {
            const t = await this.searchFiles(a);
            this.updateMatchStatus(n, a, t);
        } catch (i) {
            console.error(`重新匹配失败 [${a}]:`, i), this.showMatchError(n, a, i);
        }
    }
    updateMatchStatus(t, e, n) {
        n.length > 0 ? t.find(".jhs-match-btn").replaceWith(`<a class='jhs-match-btn a-success' \n                   data-keyword="${e}"\n                   data-match='${JSON.stringify(n)}'\n                   title="点击查看匹配详情">匹配${n.length}个</a>`) : t.find(".jhs-match-btn").replaceWith(`<a class='jhs-match-error-btn a-info' data-keyword="${e}" \n                  title="点击重新尝试匹配">未匹配</a>`);
    }
    async handleLoginRedirect() {
        window.open("https://115.com");
    }
    async searchFiles(t) {
        var e;
        let n = t.toLowerCase().replace("fc2-", "");
        return (null == (e = (await Rt(n)).data) ? void 0 : e.map((t => ({
            folderId: t.fid,
            videoId: t.pc,
            name: t.n,
            createTime: utils.formatDate(new Date(1e3 * t.te)),
            size: t.s,
            isVideo: [ ".mp4", ".avi", ".mov", ".mkv", ".flv", ".wmv" ].some((e => {
                var n;
                return null == (n = t.n) ? void 0 : n.toLowerCase().endsWith(e);
            }))
        }))).filter((t => t.folderId && t.isVideo && t.name.toLowerCase().includes(n)))) || [];
    }
    showMatchError(t, e, n) {
        t.find(".jhs-match-btn").replaceWith(`<a class='jhs-match-error-btn' data-keyword="${e}" \n              title="匹配失败，点击重试">匹配失败</a>`), 
        show.error(`${e} 匹配失败: ${n.message || "网络错误"}`);
    }
    async checkLoginStatus() {
        var e;
        if (this.loginStatus === t.LoginStatus.UNCHECKED) try {
            const n = await Rt("test");
            this.loginStatus = (null == (e = n.error) ? void 0 : e.includes("登录")) ? t.LoginStatus.LOGGED_OUT : t.LoginStatus.LOGGED_IN;
        } catch {
            this.loginStatus = t.LoginStatus.LOGGED_OUT;
        }
    }
    async processMovieElements(t) {
        const e = Array.from(t).filter((t => !utils.isHidden(t))).filter((t => !(d && $(t).find(".avatar-box").length > 0))).map((t => this.processSingleMovieElement(t)));
        await Promise.all(e);
    }
    async processSingleMovieElement(e) {
        const n = $(e), {carNum: a} = this.getBoxCarInfo(n);
        if (!(n.find("[class^='jhs-match-']").length > 0)) if (this.loginStatus !== t.LoginStatus.LOGGED_OUT) try {
            const t = await this.searchFiles(a);
            this.addTag(n, a, t);
        } catch (i) {
            console.error(`搜索失败 [${a}]:`, i), this.addTag(n, a, []);
        } else this.addTag(n, a, []);
    }
    addTag(e, n, a) {
        if (!(e.find("[class^='jhs-match-']").length > 0)) if (this.loginStatus === t.LoginStatus.LOGGED_OUT) e.find(".video-title").prepend(`<a class='jhs-match-no-login-btn a-info' \n                   data-keyword="${n}" \n                   title="未登录115网盘">未登录</a>`); else if (a.length > 0) {
            const t = 1 === a.length ? "点击直接播放" : `点击查看${a.length}个匹配结果`;
            e.find(".video-title").prepend(`<a class='jhs-match-btn a-success' \n                       data-keyword="${n}"\n                       data-match='${JSON.stringify(a)}'\n                       title="${t}">匹配${a.length}个</a>`);
        } else e.find(".video-title").prepend(`<a class='jhs-match-error-btn a-info' \n                   data-keyword="${n}" \n                   title="未匹配,点击重试">未匹配</a>`);
    }
    formatSize(t) {
        if (!t) return "-";
        const e = [ "B", "KB", "MB", "GB", "TB" ];
        let n = parseFloat(t), a = 0;
        for (;n >= 1024 && a < e.length - 1; ) n /= 1024, a++;
        return `${n.toFixed(2)} ${e[a]}`;
    }
};

o(Jt, "LoginStatus", {
    UNCHECKED: -1,
    LOGGED_OUT: 0,
    LOGGED_IN: 1
});

let Gt = Jt;

class Yt extends G {
    getName() {
        return "FavoriteActressesPlugin";
    }
    async handle() {
        this.bindEvent(), await this.highlightActress(), this.replaceActressAvatar();
    }
    async highlightActress() {
        if (!isDetailPage) return;
        if (await storageManager.getSetting("enableFavoriteActresses", I) !== I) return;
        const t = await storageManager.getFavoriteActressList();
        if (!t || 0 === t.length) return;
        const e = new Set;
        t.forEach((t => {
            t.starId && e.add(String(t.starId).trim());
        })), 0 !== e.size && $(".female").prev().each(((t, n) => {
            const a = $(n), i = a.attr("href");
            let s = null;
            if (i) {
                const t = (i.endsWith("/") ? i.slice(0, -1) : i).split("/"), e = t[t.length - 1];
                e && (s = e.trim());
            }
            let o = !1;
            s && (o = e.has(s)), o && (a.addClass("highlighted"), a.attr("title", "高亮已收藏演员, 可在设置-基础配置中关闭"));
        }));
    }
    async removeActorFromStorage(t) {
        await storageManager.removeFavoriteActress(t) && clog.log("移除演员成功");
    }
    bindEvent() {
        const t = /\/actors\/(\w+)\/(collect|uncollect)/;
        $(document).on("confirm:complete", 'a[href*="/actors/"][href*="/uncollect"]', (async e => {
            const [n] = e.detail;
            if (!n) return;
            const a = $(e.currentTarget).attr("href").match(t), i = a ? a[1] : null;
            i && await this.removeActorFromStorage(i);
        })), $("#button-collect-actor").click((async e => {
            const n = $("#button-collect-actor").attr("href").match(t), a = n ? n[1] : null;
            let i = [], s = $(".actor-section-name");
            s.length && s.text().trim().split(",").forEach((t => {
                i.push(t.trim());
            }));
            let o = $(".section-meta:not(:contains('影片'))");
            if (o.length && o.text().trim().split(",").forEach((t => {
                i.push(t.trim());
            })), !i) return void clog.error("获取演员名称失败");
            const r = i[0];
            if (!a) return void clog.error("无法获取演员ID进行收藏操作。");
            const l = ($(".avatar").first().css("background-image") || "").replace(/^url\(["']?|["']?\)$/g, ""), c = {
                starId: a,
                name: r,
                allName: i,
                avatar: l
            };
            1 === await storageManager.addFavoriteActressList([ c ]) ? clog.log(`收藏演员成功: ${r} (ID: ${a})`) : clog.log(`收藏演员失败: ${r} (ID: ${a})`);
        })), $("#button-uncollect-actor").click((async e => {
            const n = $("#button-uncollect-actor").attr("href").match(t), a = n ? n[1] : null;
            a ? await this.removeActorFromStorage(a) : clog.error("无法获取演员ID进行取消收藏操作。");
        }));
    }
    async replaceActressAvatar() {
        const t = this.getActressId();
        if (!t) return;
        const e = (await storageManager.getFavoriteActressList()).find((e => e.starId === t));
        if (e && e.avatar) {
            const t = `url('${e.avatar}')`;
            let n = $(".avatar").first();
            if (0 === n.length) {
                const t = '<div class="column actor-avatar"> <div class="image"> <span class="avatar"></span> </div> </div>';
                $(".section-columns").prepend(t), n = $(".avatar").first();
            }
            if (0 === n.length) return;
            n.css("background-image").trim().toLowerCase() !== t.trim().toLowerCase() && (n.css("background-image", t), 
            n.css("background-size", "cover"), n.css("background-position", "top center"), n.css("background-repeat", "no-repeat"));
        }
    }
}

class Xt extends G {
    getName() {
        return "BusImgPlugin";
    }
    handle() {}
    async getVisibleImageItems(t, e) {
        let n = [];
        const a = document.querySelectorAll(t);
        for (const i of a) {
            if (!utils.isHidden(i)) {
                const t = i.querySelector(e);
                if (!(t instanceof HTMLImageElement)) continue;
                t.style.removeProperty("height");
                let a = t.offsetHeight;
                a > 0 && n.push({
                    element: i,
                    imgElement: t,
                    height: a
                });
            }
        }
        return n;
    }
    async logImageHeightsByRow() {
        if (await storageManager.getSetting("enableVerticalModel", T) === I) return;
        const t = this.getSelector().itemSelector, e = await storageManager.getSetting("containerColumns", 5), n = await this.getVisibleImageItems(t, "img");
        if (0 === n.length) return;
        const a = [];
        for (let i = 0; i < n.length; i++) {
            const t = Math.floor(i / e);
            a[t] || (a[t] = []), a[t].push(n[i]);
        }
        a.forEach(((t, e) => {
            const n = t.map((t => t.height));
            if (n.length < 2) return;
            const a = Math.min(...n), i = Math.max(...n);
            let s = 0;
            i - a > 50 && (s = a, t.forEach((t => {
                if (t.height !== s) {
                    const e = `${s}px`;
                    t.imgElement.style.setProperty("height", e, "important");
                }
            })));
        }));
    }
}

class Qt extends G {
    getName() {
        return "TranslatePlugin";
    }
    async initCss() {
        return "\n            <style> \n                .translated-title {\n                    margin-top: 8px; \n                    padding: 12px; \n                    border-radius: 5px; \n                    border-left: 4px solid rgb(76, 175, 80);\n                    background: linear-gradient(135deg, rgb(255, 255, 255) 0%, rgb(245, 245, 245) 100%); \n                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);\n                    font-size: 20px;\n                }\n            </style>\n        ";
    }
    handle() {
        isDetailPage && this.translate();
    }
    async translate(t, e = !0) {
        if (await storageManager.getSetting("translateTitle", I) !== I) return;
        d && (e = !1);
        let n = $(".origin-title");
        if (n.length || (n = $(".current-title")), n.length || (n = $("h3")), !n.length) return;
        const a = n.text().trim();
        if (!a) return void show.error("获取标题失败, 无法进行翻译");
        n.after('<div class="translated-title">翻译中...</div>');
        const i = n.next(".translated-title");
        t || (t = this.getPageInfo().carNum);
        const s = localStorage.getItem("jhs_translate") ? JSON.parse(localStorage.getItem("jhs_translate")) : {};
        s[t] ? i.html(e ? t + "&nbsp;&nbsp;&nbsp;" + s[t] : s[t]) : Ct(a, "ja", "zh-CN").then((n => {
            i.html(e ? t + "&nbsp;&nbsp;&nbsp;" + n : n);
        })).catch((t => {
            console.error("翻译失败:", t), i.replaceWith(`<div class="translated-title" style="color: red;">翻译失败: ${t.message}</div>`);
        }));
    }
}

class Zt extends G {
    constructor() {
        super(...arguments), o(this, "singleTaskKey", "checkNewActressActorFilterCar"), 
        o(this, "taskConfig", null), o(this, "storageQueue", new ut), o(this, "lastCheckFavoriteActressTimeKey", "jhs_time_checkFavoriteActress"), 
        o(this, "lastCheckBlacklistTimeKey", "jhs_time_checkBlacklist"), o(this, "lastCheckNewVideoTimeKey", "jhs_time_checkNewVideo");
    }
    getName() {
        return "TaskPlugin";
    }
    async limitConcurrency(t, e, n, a) {
        this.showIsRun();
        const i = [], s = t.length;
        let o = 0;
        for (const r of t) {
            const t = a(r).finally((() => {
                i.splice(i.indexOf(t), 1);
            }));
            if (i.push(t), o++, i.length >= e) {
                const t = s - o;
                clog.debug(`剩余任务数: <span style="color: #f40">${t}</span>`), await Promise.race(i), 
                await utils.sleep(n);
            }
        }
        await Promise.all(i);
    }
    isUnnecessaryCheck(t, e) {
        if (!e) throw new Error("未传入checkIntervalTime");
        e = parseInt(e);
        return utils.getHourDifference(new Date(t), new Date) < e;
    }
    handle() {
        this.doTask().then();
    }
    showIsRun() {
        show.info("正在执行检测任务中, 请勿关闭当前窗口", {
            duration: 3e3
        });
    }
    async doTask() {
        if (isListPage) return await this.loadConfig(), this.javDbUrl = await this.getBean("OtherSitePlugin").getJavDbUrl(), 
        navigator.locks.request(this.singleTaskKey, {
            ifAvailable: !0
        }, (async t => {
            if (t) {
                if (isListPage && (this.taskConfig.enableCheckBlacklist === I ? await this.checkBlacklist() : clog.warn("自动检测屏蔽黑名单-禁用"), 
                !d)) {
                    if (this.taskConfig.enableCheckFavoriteActress === I) {
                        const t = localStorage.getItem(this.lastCheckFavoriteActressTimeKey), e = this.taskConfig.checkFavoriteActress_IntervalTime, n = t && this.isUnnecessaryCheck(t, e), a = $('a[href*="/users/profile"]').length > 0;
                        n && clog.debug(`检测同步演员, 上次检测时间: ${t} 检测间隔时间: ${e}小时 未到时间`), !n && a && await this.checkFavoriteActress();
                    } else clog.warn("自动同步已收藏的演员-禁用");
                    this.taskConfig.enableCheckNewVideo === I ? await this.checkNewVideo() : clog.warn("自动检测已收藏演员的最新作品-禁用");
                }
            } else clog.debug("争夺任务锁失败, 跳过执行");
        })).catch((t => {
            console.error("锁任务出现错误:", t), clog.error("锁任务出现错误:", t);
        })).finally((() => {
            setTimeout((() => {
                this.doTask();
            }), 3e5);
        }));
    }
    async loadConfig() {
        const t = await storageManager.getSetting();
        this.taskConfig = {
            checkConcurrencyCount: t.checkConcurrencyCount ? Number(t.checkConcurrencyCount) : 2,
            checkRequestSleep: t.checkRequestSleep ? Number(t.checkRequestSleep) : 100,
            enableCheckBlacklist: t.enableCheckBlacklist || I,
            checkBlacklist_intervalTime: t.checkBlacklist_intervalTime ? Number(t.checkBlacklist_intervalTime) : 12,
            checkBlacklist_ruleTime: t.checkBlacklist_ruleTime ? Number(t.checkBlacklist_ruleTime) : 8760,
            enableCheckFavoriteActress: t.enableCheckFavoriteActress || I,
            checkFavoriteActress_IntervalTime: t.checkFavoriteActress_IntervalTime ? Number(t.checkFavoriteActress_IntervalTime) : 24,
            enableCheckNewVideo: t.enableCheckNewVideo || I,
            checkNewVideo_intervalTime: t.checkNewVideo_intervalTime ? Number(t.checkNewVideo_intervalTime) : 12,
            checkNewVideo_ruleTime: t.checkNewVideo_ruleTime ? Number(t.checkNewVideo_ruleTime) : 8760
        };
    }
    async checkBlacklist(t) {
        let e = await storageManager.getBlacklist();
        if (0 === e.length) return;
        e = e.sort(((t, e) => t.createTime < e.createTime ? 1 : t.createTime > e.createTime ? -1 : 0));
        const n = this.taskConfig.checkConcurrencyCount, a = this.taskConfig.checkRequestSleep, i = this.taskConfig.checkBlacklist_intervalTime, s = this.taskConfig.checkBlacklist_ruleTime, o = localStorage.getItem(this.lastCheckBlacklistTimeKey);
        if (!t && o && this.isUnnecessaryCheck(o, i)) return void clog.debug(`检测黑名单, 上次检测时间: ${o} 检测间隔时间: ${i}小时 未到时间`);
        const r = [], l = [];
        for (const h of e) {
            let e = h.name, n = h.checkTime, a = h.lastPublishTime, o = h.url;
            if (new URL(window.location.href).hostname === new URL(o).hostname) {
                if (t || !n || !this.isUnnecessaryCheck(n, i)) if (!a || 0 === s || this.isUnnecessaryCheck(a, s)) r.push(h); else {
                    let t = `检测黑名单: ${e} ${a} 停更超过${s / 24 / 365}年,跳过检测`;
                    l.push(t), $("#checkBlacklistMsg").text(t);
                }
            } else clog.log("黑名单地址非同域名,跳过", o);
        }
        if (0 === r.length) return;
        l.forEach((t => {
            clog.log(t);
        })), clog.log(`<span style='color: #f40'>检测屏蔽黑名单, 总任务数: ${r.length}, 并发限制:${n}, 请求间隔时间:${a}ms</span>`);
        const c = this.getBean("BlacklistPlugin");
        await this.limitConcurrency(r, n, a, (async t => {
            let {starId: e, name: n, url: a} = t;
            try {
                clog.log("正在检屏黑名单演员:", n, a), $("#checkBlacklistMsg").text(`正在检屏黑名单演员: ${n} ${a}`);
                const t = await gmHttp.get(a), i = utils.htmlTo$dom(t);
                this.storageQueue.addTask((async () => {
                    let {lastPublishTime: t} = await c.parseAndSaveFilterInfo(i, n, e);
                    await storageManager.updateBlacklistItem({
                        starId: e,
                        name: n,
                        checkTime: utils.getNowStr(),
                        lastPublishTime: t
                    });
                }));
            } catch (i) {
                $("#checkBlacklistMsg").text(`检测屏蔽演员信息, 发生错误: ${a}`), clog.error("检测屏蔽演员信息, 发生错误:", a, i), 
                show.error("检测屏蔽演员信息, 发生错误:" + i, "bottom", "right");
            }
        })), await this.storageQueue.waitAllFinished();
        const d = utils.getNowStr();
        localStorage.setItem(this.lastCheckBlacklistTimeKey, d), clog.log('<span style="color: #f40">-------- END 检测屏蔽黑名单 END --------</span>'), 
        $("#checkBlacklistMsg").text("检测屏蔽黑名单, 结束"), this.getBean("BlacklistPlugin").resetBtnTip().then();
    }
    async checkFavoriteActress() {
        const t = `${this.javDbUrl}/users/collection_actors`, e = [];
        await this.scrapeActorInfo(t, e), clog.log("所有演员信息已收集, 总计数量:", e.length), $("#checkNewVideoMsg").text("同步完成"), 
        e.length > 0 && (await storageManager.addFavoriteActressList(e), localStorage.setItem(this.lastCheckFavoriteActressTimeKey, utils.getNowStr()), 
        this.getBean("NewVideoPlugin").resetBtnTip().then());
    }
    async scrapeActorInfo(t, e) {
        clog.log(`正在抓取页面: ${t}`), $("#checkNewVideoMsg").text(`正在解析已收藏的演员: ${t}`);
        try {
            const n = await gmHttp.get(t), a = utils.htmlTo$dom(n);
            a.find("#actors .actor-box a").each(((t, n) => {
                const a = $(n), i = a.attr("title"), s = a.attr("href");
                if (i && s) {
                    const t = i.split(",").map((t => t.trim())).filter((t => t.length > 0)), n = t[0] || "", o = new URL(s, this.javDbUrl).pathname.split("/").filter((t => t.length > 0));
                    let r = "";
                    o.length > 0 && (r = o[o.length - 1]);
                    let l = M;
                    const c = a.find("img").attr("src"), d = a.find(".info");
                    d.length && d.text().trim().includes("無碼") && (l = A), e.push({
                        starId: r,
                        name: n,
                        allName: t,
                        avatar: c,
                        actressType: l,
                        lastCheckTime: null,
                        lastUpdateTime: null
                    });
                }
            }));
            const i = a.find(".pagination-next").attr("href");
            if (i) {
                const t = new URL(i, this.javDbUrl).href;
                await this.scrapeActorInfo(t, e);
            }
        } catch (n) {
            clog.error(`抓取 ${t} 时发生错误:`, n);
        }
    }
    async checkNewVideo(t) {
        const e = await storageManager.getFavoriteActressList(), n = utils.genericSort(e, [ {
            key: t => {
                var e;
                return (null == (e = t.newVideoList) ? void 0 : e.length) ?? 0;
            },
            order: "desc"
        }, {
            key: "lastPublishTime",
            order: "desc"
        } ]), a = this.taskConfig.checkConcurrencyCount, i = this.taskConfig.checkRequestSleep, s = this.taskConfig.checkNewVideo_intervalTime, o = this.taskConfig.checkNewVideo_ruleTime, r = localStorage.getItem(this.lastCheckNewVideoTimeKey);
        if (!t && r && this.isUnnecessaryCheck(r, s)) return void clog.debug(`检测新作品, 上次检测时间: ${r} 检测间隔时间: ${s}小时 未到时间`);
        const l = [], c = [];
        for (const m of n) {
            const {lastCheckTime: e, lastPublishTime: n, name: a} = m;
            !t && e && this.isUnnecessaryCheck(e, s) || (!n || 0 === o || this.isUnnecessaryCheck(n, o) ? l.push(m) : c.push(`检测新作品: ${a} ${n} 停更超过${o / 24 / 365}年,跳过检测`));
        }
        if (0 === l.length) return;
        c.forEach((t => {
            clog.log(t);
        })), clog.log(`<span style='color: #f40'>检测最新作品, 总任务数: ${l.length}, 并发限制:${a}, 请求间隔时间:${i}ms</span>`);
        const d = await storageManager.getTitleFilterKeyword(), h = await storageManager.getBlacklistCarList(), p = new Set(h.map((t => t.carNum)));
        await this.limitConcurrency(l, a, i, (async t => {
            const {lastCheckTime: e, name: n, starId: a} = t;
            let i = `${this.javDbUrl}/actors/${a}?t=d`;
            try {
                clog.log("正在检测最新作品, 演员:", n, i), $("#checkNewVideoMsg").text(`正在检测最新作品, 演员: ${n}`);
                const t = await gmHttp.get(i), e = utils.htmlTo$dom(t);
                this.storageQueue.addTask((async () => {
                    await this.parsePage(e, a, n, d, p);
                }));
            } catch (s) {
                clog.error("检测屏蔽演员信息, 发生错误:", i, s), console.error("检测屏蔽演员信息, 发生错误:", i, s), show.error("检测屏蔽演员信息, 发生错误:" + s, "bottom", "right");
            }
        })), await this.storageQueue.waitAllFinished(), localStorage.setItem(this.lastCheckNewVideoTimeKey, utils.getNowStr()), 
        clog.log('<span style="color: #f40">检测最新作品---结束</span>'), $("#checkNewVideoMsg").text("检测完毕");
        const g = this.getBean("NewVideoPlugin");
        g.loadData(), g.resetBtnTip().then();
    }
    async parsePage(t, e, n, a, i) {
        let s, o, r = !1, l = B;
        if (t.text().includes(P) && (r = !0, l = P), r && t.find(".avatar-box").length > 0 && t.find(".avatar-box").parent().remove(), 
        s = t.find(this.getSelector(l).requestDomItemSelector), o = t.find(this.getSelector(l).nextPageSelector).attr("href"), 
        o && 0 === s.length) throw clog.error("新作品检测-解析列表失败"), show.error("新作品检测-解析列表失败"), 
        new Error("新作品检测-解析列表失败");
        let c = [], d = null;
        for (const m of s) {
            const t = $(m), {carNum: e, url: n, title: s, publishTime: o} = this.getBoxCarInfo(t);
            if (!e) continue;
            a.find((t => s.includes(t) || e.startsWith(t))) || (i.has(e) || (d || (d = o), c.push(e)));
        }
        const h = await storageManager.getCarList(), p = new Set(h.map((t => t.carNum))), g = c.filter((t => !p.has(t)));
        g.length > 0 && clog.log(`<span style='color: #f40'>检测出新作品, ${n}, 共${g.length}部</span>`), 
        await storageManager.updateFavoriteActress({
            starId: e,
            lastCheckTime: utils.getNowStr(),
            newVideoList: g,
            lastPublishTime: d
        });
    }
    async checkOneNewVideo(t) {
        const e = await storageManager.getTitleFilterKeyword(), n = await storageManager.getBlacklistCarList(), a = new Set(n.map((t => t.carNum))), {lastCheckTime: i, name: s, starId: o} = t;
        let r = `${this.javDbUrl}/actors/${o}?t=d`;
        const l = $("#checkNewVideoMsg");
        try {
            clog.log("正在检测最新作品, 演员:", s, r), l.text(`正在检测最新作品, 演员: ${s}`);
            const t = await gmHttp.get(r), n = utils.htmlTo$dom(t);
            await this.parsePage(n, o, s, e, a), clog.log('<span style="color: #f40">检测最新作品---结束</span>'), 
            l.text("检测完毕");
            this.getBean("NewVideoPlugin").loadData();
        } catch (c) {
            clog.error("检测屏蔽演员信息, 发生错误:", r, c), show.error("检测屏蔽演员信息, 发生错误:" + c, "bottom", "right"), 
            l.text(`检测屏蔽演员信息, 发生错误: ${r}`);
        }
    }
}

const te = [ {
    name: "jsDelivr (全球CDN)",
    json: "https://cdn.jsdelivr.net/gh/gfriends/gfriends/Filetree.json",
    base: "https://cdn.jsdelivr.net/gh/gfriends/gfriends/Content/"
}, {
    name: "GitHub Raw (备用)",
    json: "https://raw.githubusercontent.com/gfriends/gfriends/master/Filetree.json",
    base: "https://raw.githubusercontent.com/gfriends/gfriends/master/Content/"
} ], ee = "jhs_img_cdn_index";

let ne = parseInt(localStorage.getItem(ee) || "0", 10);

(ne >= te.length || ne < 0) && (ne = 0);

let ae = te[ne].json, ie = te[ne].base;

const se = "filetreeStore", oe = "filetree_data", re = {
    db: null,
    async open() {
        return this.db ? this.db : new Promise(((t, e) => {
            const n = indexedDB.open("GfriendsAvatarDB", 1);
            n.onupgradeneeded = t => {
                this.db = t.target.result, this.db.objectStoreNames.contains(se) || this.db.createObjectStore(se);
            }, n.onsuccess = e => {
                this.db = e.target.result, t(this.db);
            }, n.onerror = t => {
                console.error("IndexedDB open error:", t.target.errorCode), e(new Error("Failed to open IndexedDB"));
            };
        }));
    },
    async get(t) {
        return await this.open(), new Promise((e => {
            const n = this.db.transaction([ se ], "readonly").objectStore(se).get(t);
            n.onsuccess = () => e(n.result), n.onerror = () => e(null);
        }));
    },
    async set(t, e) {
        return await this.open(), new Promise(((n, a) => {
            const i = this.db.transaction([ se ], "readwrite").objectStore(se).put(e, t);
            i.onsuccess = () => n(), i.onerror = t => {
                console.error("IndexedDB set error:", t.target.errorCode), a(new Error("Failed to write to IndexedDB"));
            };
        }));
    }
};

let le = null, ce = null;

function de(t) {
    if (!t || !t.Content) return null;
    const e = {}, n = t.Content;
    for (const a in n) {
        const t = encodeURIComponent(a);
        for (const i in n[a]) {
            let s = i.replace(/\.jpg$/i, "").split("-")[0];
            s.startsWith("AI-Fix-") && (s = s.substring(7));
            const o = s.toLowerCase().trim();
            if (o.length > 0) {
                const s = n[a][i], r = s.indexOf("?");
                let l, c = "";
                r > -1 ? (l = encodeURIComponent(s.substring(0, r)), c = s.substring(r)) : l = encodeURIComponent(s);
                const d = `${ie}${t}/${l}${c}`;
                e[o] || (e[o] = []), e[o].includes(d) || e[o].push(d);
            }
        }
    }
    return e;
}

async function he(t) {
    let e = loading();
    try {
        await async function() {
            if (le && ce) return le;
            let t = null;
            try {
                t = await re.get(oe);
            } catch (a) {
                console.error("读取 IndexedDB 失败:", a);
            }
            if (t && t.Content && (le = t, ce = de(t), ce)) return le;
            show.info("正在载入头像数据源...");
            const e = await fetch(ae);
            if (!e.ok) throw new Error(`请求头像源失败: ${e.status}`);
            const n = await e.json();
            if (n && n.Content) {
                le = n, ce = de(n);
                try {
                    await re.set(oe, n), clog.debug("载入头像数据源并写入缓存成功!");
                } catch (a) {
                    clog.error(a), show.error("头像数据源写入缓存失败，可能磁盘已满或其他权限问题。");
                }
                return le;
            }
            throw console.log(n), new Error("解析头像数据源失败");
        }();
    } catch (i) {
        return show.error(i), [];
    } finally {
        e.close();
    }
    if (!ce) return [];
    const n = new Set, a = t.map((t => t.toLowerCase().trim())).filter((t => t.length > 0));
    if (0 === a.length) return [];
    for (const s of a) {
        const t = ce[s];
        t && t.forEach((t => n.add(t)));
    }
    return Array.from(n);
}

class pe extends G {
    constructor() {
        super(...arguments), o(this, "currentPage", 1), o(this, "pageSize", 30);
    }
    getName() {
        return "NewVideoPlugin";
    }
    async initCss() {
        return "\n            <style>\n                #actress-card-container {\n                    display: grid;\n                    grid-template-columns: repeat(auto-fill, minmax(243px, 1fr)); /* 响应式3-5列 */\n                    gap: 20px;\n                    padding-bottom: 20px;\n                    padding-right: 10px;\n                    background: #f9f9f9;\n                    border-radius: 5px;\n                    overflow-y: auto;\n                }\n                .actress-card {\n                    background: #fff;\n                    border: 1px solid #e0e0e0;\n                    border-radius: 8px;\n                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);\n                    padding: 15px;\n                    text-align: center;\n                    display: flex;\n                    flex-direction: column;\n                    justify-content: space-between;\n                    position: relative;\n                    overflow: hidden;\n                }\n                .actress-card:hover {\n                    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.15);\n                }\n                .actress-card-name {\n                    font-size: 1.2em;\n                    font-weight: bold;\n                    color: #007bff;\n                    margin-top: 10px;\n                }\n                .actress-card-allname {\n                    font-size: 0.9em;\n                    color: #999;\n                    margin-top: 5px;\n                    height: 30px; /* 保证高度一致性 */\n                    overflow: hidden;\n                    white-space: nowrap;      /* 防止文字换行 */\n                    text-overflow: ellipsis;  /* 当文本溢出时，显示省略号 */\n                }\n                .actress-card-avatar {\n                    width: 100px;\n                    height: 100px;\n                    border-radius: 50%;\n                    object-fit: contain;\n                    margin: 0 auto;\n                    border: 4px solid #f0f0f0;\n                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);\n                }\n                \n                .card-tag {\n                    position: absolute;\n                    top: 15px; /* 调整标签距离顶部的距离 */\n                    right: -50px; /* 调整标签距离右侧的距离，负值让它移到外面一点 */\n                    \n                    width: 150px; /* 标签的宽度，影响斜角长度 */\n                    padding: 5px 0; /* 上下内边距 */\n                    text-align: center;\n                    \n                    background-color: #ff4757; /* 标签颜色 */\n                    color: white; /* 文字颜色 */\n                    font-size: 14px;\n                    font-weight: bold;\n                    z-index: 10; /* 确保标签在其他内容之上 */\n                \n                    /* 3. 核心：旋转标签，使其倾斜 */\n                    transform: rotate(45deg); /* 45度斜角 */\n                    \n                    /* 可选：添加一些阴影或边框效果 */\n                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);\n                }\n                \n                .card-new-count-tag {\n                    position: absolute;\n                    top: 5px;\n                    text-align: center;\n                    font-size: 14px;\n                    font-weight: bold;\n                    z-index: 10;\n                }\n                \n                #actress-pagination {\n                    padding-top: 10px;\n                    text-align: center;\n                    border-top: 1px solid #ddd;\n                }\n                @media (max-width: 600px) {\n                    .page-number-btn {\n                        display: none !important;\n                    }\n                }\n                \n                \n                .card-btn {\n                    width: 44px;\n                    height: 44px;\n                    border-radius: 50%;\n                    display: flex;\n                    justify-content: center;\n                    align-items: center;\n                    text-decoration: none;\n                    border: none;\n                    cursor: pointer;\n                    background: linear-gradient(145deg, #e0e0e0 0%, #f7f7f7 100%);\n                    box-shadow: 8px 8px 16px rgba(0, 0, 0, 0.08),\n                                -8px -8px 16px rgba(255, 255, 255, 1.0);\n                    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);\n                }\n                \n                .card-btn svg,\n                .card-btn svg path {\n                    transition: fill 0.3s ease;\n                }\n                \n                .card-btn:hover {\n                    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.1),\n                                inset -5px -5px 10px rgba(255, 255, 255, 0.9);\n                    transform: scale(0.97);\n                    background: #e0e0e0;\n                }\n                \n                .btn-check-actress svg path {\n                    fill: #4CAF50;\n                }\n                .btn-check-actress:hover svg path {\n                    fill: #388E3C;\n                }\n                \n                .btn-edit-actress svg path {\n                    fill: #FFC107;\n                }\n                .btn-edit-actress:hover svg path {\n                    fill: #FFB300;\n                }\n                \n                .btn-delete-actress svg path {\n                    fill: #F44336;\n                }\n                .btn-delete-actress:hover svg path {\n                    fill: #D32F2F;\n                }\n            </style>\n        ";
    }
    async showNewVideoCount() {
        const t = (await storageManager.getFavoriteActressList()).reduce(((t, e) => {
            var n;
            return t + ((null == (n = e.newVideoList) ? void 0 : n.length) ?? 0);
        }), 0);
        $("#newVideoCount").text(`${t}`);
    }
    async resetBtnTip() {
        const t = this.getBean("TaskPlugin"), e = await storageManager.getSetting(), n = localStorage.getItem(t.lastCheckFavoriteActressTimeKey) || "无", a = e.checkFavoriteActress_IntervalTime, i = localStorage.getItem(t.lastCheckNewVideoTimeKey) || "无", s = e.checkNewVideo_intervalTime;
        $("#checkFavoriteActress").attr("data-tip", `上次自动同步时间: ${n}; 检测间隔时间: ${a}小时`), $("#checkNewVideo").attr("data-tip", `上次检测时间: ${i}; 检测间隔时间: ${s}小时`);
    }
    async openDialog() {
        const t = this.getBean("TaskPlugin"), e = await storageManager.getSetting(), n = localStorage.getItem(t.lastCheckFavoriteActressTimeKey) || "无", a = e.checkFavoriteActress_IntervalTime, i = localStorage.getItem(t.lastCheckNewVideoTimeKey) || "无", s = e.checkNewVideo_intervalTime;
        let o = `\n            <div class="newVideoToolBox" style="display: flex; flex-direction: column; height: 100%; overflow: hidden; padding:10px">\n                <div style="margin-bottom: 15px;display: flex; justify-content: space-between;">\n                    <div>\n                        <a class="a-danger" id="checkFavoriteActress" data-tip="上次自动同步时间: ${n}; 检测间隔时间: ${a}小时">${this.actressSvg} &nbsp;&nbsp; 手动同步演员</a>\n                        <a class="a-warning" id="checkNewVideo" data-tip="上次检测时间: ${i}; 检测间隔时间: ${s}小时">${this.newSvg} &nbsp;&nbsp; 手动检测最新作品</a>\n                        <a class="a-info" id="toSetting">${this.settingSvg} &nbsp;&nbsp; 配置</a>\n                        <span id="checkNewVideoMsg"></span>\n                    </div>\n                    <div style="display: flex; align-items: flex-start;">\n                        <select id="paramActressType" style="text-align: center; height: 100%; min-width: 150px; border: 1px solid #ddd; margin-right: 10px">\n                            <option value="all" selected>所有</option>\n                            <option value="uncensored">无码</option>\n                            <option value="censored">有码</option>\n                            <option value="">未知</option>\n                        </select>\n                        \n                        <a class="a-normal" id="reLoad">${this.refreshSvg} &nbsp;&nbsp; 刷新</a>\n                    </div>\n\n                </div>\n                <div id="actress-card-container" class="jhs-scrollbar"></div>\n                <div id="actress-pagination"></div>\n            </div>\n        `;
        layer.open({
            type: 1,
            title: '<span style="padding: 0 10px;" data-tip="数据来源: 女优页面首页,含磁链分类">新作品检测 ❓</span>',
            content: o,
            scrollbar: !1,
            area: utils.getResponsiveArea([ "80%", "90%" ]),
            anim: -1,
            success: async (t, e) => {
                this.loadData(), this.bindClick(), utils.setupEscClose(e);
            }
        });
    }
    bindClick() {
        const t = this.getBean("TaskPlugin");
        $("#reLoad").on("click", (t => {
            this.loadData(), $("#checkNewVideoMsg").text("");
        })), $("#toSetting").on("click", (t => {
            this.getBean("SettingPlugin").openSettingDialog("task-panel", (() => {
                $("#setting-checkFavoriteActress").css({
                    border: "1px solid #f40"
                }), $("#setting-checkNewVideo").css({
                    border: "1px solid #f40"
                });
            }));
        }));
        $("#checkFavoriteActress").on("click", (e => {
            utils.q({
                clientX: e.clientX,
                clientY: e.clientY + 20
            }, "是否手动同步演员?", (() => {
                navigator.locks.request(t.singleTaskKey, {
                    ifAvailable: !0
                }, (async e => {
                    if (!e) return void show.error("当前有定时任务在后台执行中, 无法发起手动任务");
                    $('a[href*="/users/profile"]').length > 0 ? (await t.checkFavoriteActress(), this.loadData()) : show.error("未登录JavDb, 同步失败");
                })).catch((t => {
                    console.error("锁任务出现错误:", t), clog.error("锁任务出现错误:", t);
                }));
            }));
        })), $("#checkNewVideo").on("click", (e => {
            utils.q({
                clientX: e.clientX,
                clientY: e.clientY + 20
            }, "是否手动检测最新作品?", (() => {
                navigator.locks.request(t.singleTaskKey, {
                    ifAvailable: !0
                }, (async e => {
                    e ? await t.checkNewVideo(!0) : show.error("当前有定时任务在后台执行中, 无法发起手动任务");
                })).catch((t => {
                    console.error("锁任务出现错误:", t), clog.error("锁任务出现错误:", t);
                }));
            }));
        })), $("#paramActressType").on("change", (t => {
            this.loadData();
        }));
    }
    loadData() {
        this.currentPage = 1, this.renderActressCards().then();
    }
    async renderActressCards() {
        const t = $("#actress-card-container");
        if (!t.length) return;
        let e = await storageManager.getFavoriteActressList();
        const n = $("#paramActressType").val();
        "all" !== n && (e = e.filter((t => t.actressType === n)));
        const a = utils.genericSort(e, [ {
            key: t => {
                var e;
                return (null == (e = t.newVideoList) ? void 0 : e.length) ?? 0;
            },
            order: "desc"
        }, {
            key: "lastPublishTime",
            order: "desc"
        } ]), i = a.length, s = Math.ceil(i / this.pageSize), o = (this.currentPage - 1) * this.pageSize, r = o + this.pageSize, l = a.slice(o, r), c = await this.getBean("OtherSitePlugin").getJavDbUrl(), d = this.getBean("TaskPlugin"), h = await storageManager.getSetting("checkNewVideo_ruleTime") || 8760, p = l.map((t => {
            var e, n, a;
            const i = Array.isArray(t.allName) ? t.allName.join("，") : "";
            Array.isArray(t.newVideoList) && t.newVideoList.join("，");
            const s = `${c}/actors/${t.starId}?t=d`;
            let o = !1;
            t.lastPublishTime && (o = !d.isUnnecessaryCheck(t.lastPublishTime, h));
            let r = "未知", l = "#9E9E9E";
            t.actressType === A ? (r = "无码", l = "#4CAF50") : t.actressType === M && (r = "有码", 
            l = "#FF9800");
            let p = "";
            return o && (p = "background: linear-gradient(145deg, #e0e0e0 0%, #cabdbd 100%);box-shadow: none"), 
            `\n                <div class="actress-card" data-starId="${t.starId}" style="${o ? "background: #d4cece;" : ""} min-height: 370px;">\n                    <a href="${s}" target="_blank" style="text-decoration: none; color: inherit; display: block; flex-grow: 1;">\n                        <img src="${t.avatar || "https://c0.jdbstatic.com/images/actor_unknow.jpg"}" alt="${i}" class="actress-card-avatar">\n                    </a>\n\n                    <div>\n                        <a href="${s}" target="_blank" style="text-decoration: none; color: inherit; display: block; flex-grow: 1;">\n                            <div class="actress-card-name">${t.name}</div>\n                        </a>\n                        <div class="actress-card-allname" title="${i}">${i}</div>\n                    </div>\n                    \n                    <div style="font-size: 0.8em; margin-top: 5px;">\n                         <span>上次检测: ${t.lastCheckTime || ""}</span>\n                    </div>\n                    <div style="font-size: 0.8em; margin-top: 5px;">\n                         <span>最后发行作品: ${t.lastPublishTime || ""}</span>\n                    </div>\n\n                    <div style="font-size: 0.7em; color: #cc4444; margin-top: 5px; min-height: 18px">\n                         <span>${o ? "停更" + h / 24 / 365 + "年以上, 下轮任务不再进行检测" : ""}</span>\n                    </div>\n                    \n                    <div style="font-size: 0.8em; margin-top: 5px; color: #3765c5; min-height: 10px">\n                         <span>${t.remark || ""}</span>\n                    </div>\n                    \n                    <div style="margin-top: 10px;display: flex; justify-content:center; gap: 10px;">\n                        <a title="编辑" class="card-btn btn-edit-actress" style="${p}" data-starId="${t.starId}">${this.editSvg}</a>\n                        <a title="取消收藏" class="card-btn btn-delete-actress" style="${p}" data-starId="${t.starId}">${this.deleteSvg}</a>\n                        <a title="重新检测该演员" class="card-btn btn-check-actress" style="${p}" data-starId="${t.starId}">${this.checkSvg}</a>\n                    </div>\n                    \n                    <div class="card-tag" style="background-color:${l}">${r}</div>\n                    <div class="card-new-count-tag" data-tip="最新作品数量: ${(null == (e = t.newVideoList) ? void 0 : e.length) || 0}"\n                        style="${(null == (n = t.newVideoList) ? void 0 : n.length) > 0 ? "color: #4CAF50;" : ""}"> \n                        🔔 ${(null == (a = t.newVideoList) ? void 0 : a.length) || 0} \n                    </div>\n                </div>\n            `;
        })).join("");
        t.html(p), $(".btn-delete-actress").off("click").on("click", (t => {
            t.preventDefault();
            const e = $(t.currentTarget).attr("data-starId"), n = a.find((t => t.starId === e));
            utils.q(t, `是否取消收藏 ${n.name}?`, (async () => {
                let t = `${await this.getBean("OtherSitePlugin").getJavDbUrl()}/actors/${e}/uncollect`;
                const n = document.querySelector("meta[name=csrf-token]").content, a = await gmHttp.post(t, null, {
                    "x-csrf-token": n
                });
                a.includes("removeClass") ? (await storageManager.removeFavoriteActress(e), this.loadData()) : (show.error("移除失败"), 
                clog.error("移除失败,返回值:", a));
            }));
        })), $(".btn-edit-actress").off("click").on("click", (t => {
            t.preventDefault();
            const e = $(t.currentTarget).attr("data-starId"), n = a.find((t => t.starId === e));
            n ? this.editActress(n) : show.error(`未找到 starId 为 ${e} 的女优记录。`);
        })), $(".btn-check-actress").off("click").on("click", (t => {
            t.preventDefault(), navigator.locks.request(d.singleTaskKey, {
                ifAvailable: !0
            }, (async e => {
                if (!e) return void show.error("当前有定时任务在后台执行中, 无法发起手动任务");
                const n = $(t.currentTarget).attr("data-starId"), i = a.find((t => t.starId === n));
                await d.checkOneNewVideo(i);
            })).catch((t => {
                console.error("锁任务出现错误:", t), clog.error("锁任务出现错误:", t);
            }));
        })), this.renderPagination(i, s), show.ok("加载完成");
    }
    async editActress(t) {
        const e = t.name, n = t.avatar, a = t.remark || "", i = Array.isArray(t.allName) ? t.allName.join("，") : "", s = Array.isArray(t.newVideoList) ? t.newVideoList.join("，") : "", o = t.starId, r = "width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px; min-height: 60px; overflow-y: hidden;", l = t.actressType || "", c = `\n            <div style="padding: 20px;">\n                <div style="margin-bottom: 15px; text-align: center;">\n                    <img id="edit-avatar-preview" src="${n}" alt="Avatar Preview" \n                         style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover; margin-bottom: 10px; border: 2px solid #ddd;">\n                    <div style="text-align: left">\n                        <label style="display: block; margin-bottom: 5px; font-weight: bold;">头像链接:</label>\n                        <input type="text" id="edit-actress-avatar" value="${n}" \n                               style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">\n                       <div style="display: flex; gap: 5px; margin-top: 5px;">\n                            <button type="button" id="search-avatar-btn" \n                                style="flex-grow: 1; padding: 8px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer;">\n                                搜索头像\n                            </button>\n                            <button type="button" id="select-cdn-btn" \n                                style="width: 100px; padding: 8px; background-color: #6c757d; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">\n                                选择 CDN 源\n                            </button>\n                        </div>\n                    </div>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">主名称:</label>\n                    <input type="text" id="edit-actress-name" value="${e}" \n                           style="width: 100%; padding: 8px; border: 1px solid #ccc; border-radius: 4px;">\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">所有别名(用逗号隔开):</label>\n                    <textarea id="edit-actress-allname" style="${r}">${i}</textarea>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">演员类别:</label>\n                    <select id="actressType" style="width: 100%; padding: 10px; border: 1px solid #ddd;">\n                        <option value="" ${"" === l ? "selected" : ""}>未知</option>\n                        <option value="censored" ${"censored" === l ? "selected" : ""}>有码</option>\n                        <option value="uncensored" ${"uncensored" === l ? "selected" : ""}>无码</option>\n                    </select>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">最新作品(用逗号隔开):</label>\n                    <textarea id="edit-actress-newvideolist" style="${r}">${s}</textarea>\n                </div>\n                <div style="margin-bottom: 15px;">\n                    <label style="display: block; margin-bottom: 5px; font-weight: bold;">备注:</label>\n                   <textarea id="edit-remark" style="${r}">${a}</textarea>\n                </div>\n            </div>\n        `;
        layer.open({
            type: 1,
            title: `编辑女优: ${e} (${o})`,
            area: [ "500px", "750px" ],
            content: c,
            btn: [ "保存", "取消" ],
            success: (t, e) => {
                const n = t => {
                    t.css("height", "auto"), t.css("height", t[0].scrollHeight + 15 + "px");
                };
                $("#edit-actress-avatar").on("input", (function() {
                    const t = $(this).val();
                    $("#edit-avatar-preview").attr("src", t);
                }));
                const a = $("#edit-actress-allname");
                a.on("input", (function() {
                    n($(this));
                })), n(a);
                const i = $("#edit-actress-newvideolist");
                i.on("input", (function() {
                    n($(this));
                })), n(i), $("#search-avatar-btn").on("click", (async () => {
                    await this.searchAvatar();
                })), $("#select-cdn-btn").on("click", (async () => {
                    await async function() {
                        const t = ne, e = te.map(((e, n) => `\n        <div style="margin-bottom: 10px;">\n            <input type="radio" id="cdn-${n}" name="cdn-source" value="${n}" ${n === t ? "checked" : ""} style="margin-right: 10px;">\n            <label for="cdn-${n}">${e.name} ${e.json.includes("jsdelivr") ? "(推荐)" : ""}</label>\n        </div>\n    `)).join(""), n = `\n        <div style="padding: 20px;">\n            <p style="margin-bottom: 15px; font-weight: bold; color: #333;">请选择头像数据源 (当前: ${te[t].name}):</p>\n            ${e}\n            <p style="margin-top: 20px; color: #555; font-size: 12px;">切换源会清除本地缓存的数据，并在下次搜索时重新加载。</p>\n        </div>\n    `;
                        layer.open({
                            type: 1,
                            title: "选择 CDN 源",
                            area: [ "400px", "auto" ],
                            content: n,
                            btn: [ "确定", "取消" ],
                            success: (t, e) => {
                                utils.setupEscClose(e);
                            },
                            yes: async t => {
                                const e = $('input[name="cdn-source"]:checked').val(), n = parseInt(e, 10);
                                if (n !== ne) {
                                    ne = n, localStorage.setItem(ee, n.toString()), ae = te[n].json, ie = te[n].base, 
                                    le = null, ce = null;
                                    try {
                                        await re.set(oe, null);
                                    } catch (a) {
                                        clog.error("清除 IndexedDB 缓存失败:", a);
                                    }
                                    show.ok(`CDN 源已切换为: ${te[n].name}`), layer.close(t);
                                } else layer.close(t);
                            }
                        });
                    }();
                })), utils.setupEscClose(e);
            },
            yes: async e => {
                const n = $("#edit-actress-avatar").val().trim(), a = $("#edit-actress-name").val().trim(), i = $("#edit-actress-allname").val().trim(), s = $("#edit-actress-newvideolist").val().trim(), o = $("#edit-remark").val().trim(), r = $("#actressType").val();
                if (!a) return show.error("主名称不能为空"), !1;
                const l = i.split(/[\uff0c,]/).map((t => t.trim())).filter((t => t.length > 0)), c = s.split(/[\uff0c,]/).map((t => t.trim())).filter((t => t.length > 0));
                t.avatar = n, t.name = a, t.allName = l, t.newVideoList = c, t.actressType = r, 
                t.remark = o;
                await storageManager.updateFavoriteActress(t) ? show.error("修改失败") : (show.ok(`女优 ${a} 信息已更新`), 
                await this.renderActressCards(), layer.close(e));
            }
        });
    }
    renderPagination(t, e) {
        const n = this.currentPage;
        let a = "";
        const i = $("#actress-pagination");
        if (0 === e) return a = '<span style="color: #666;">共 0 条记录</span>', void i.html(a);
        n > 1 && e > 5 && (a += '<button class="pagination-btn" data-page="1" style="padding: 8px 12px; margin: 0 5px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">首页</button>'), 
        n > 1 && (a += `<button class="pagination-btn" data-page="${n - 1}" style="padding: 8px 12px; margin: 0 5px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">上一页</button>`);
        let s = Math.max(1, n - Math.floor(2.5)), o = Math.min(e, s + 5 - 1);
        o - s < 4 && (s = Math.max(1, o - 5 + 1));
        for (let r = s; r <= o; r++) {
            a += `<button class="pagination-btn page-number-btn ${r === n ? "active" : ""}" data-page="${r}" style="padding: 8px 12px; margin: 0 3px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer; ${r === n ? "background: #007bff; color: white; border-color: #007bff;" : ""}">${r}</button>`;
        }
        n < e && (a += `<button class="pagination-btn" data-page="${n + 1}" style="padding: 8px 12px; margin: 0 5px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">下一页</button>`), 
        n < e && e > 5 && (a += `<button class="pagination-btn" data-page="${e}" style="padding: 8px 12px; margin: 0 5px; background: #f0f0f0; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;">尾页</button>`), 
        a += `<span style="margin-left: 20px; color: #666;">共 ${t} 条记录 (第 ${n}/${e} 页)</span>`, 
        i.html(a), $(".pagination-btn").off("click").on("click", (t => {
            if ($(t.currentTarget).is("[disabled]")) return;
            const n = parseInt($(t.currentTarget).data("page"));
            n >= 1 && n <= e && n !== this.currentPage && (this.currentPage = n, this.renderActressCards());
        }));
    }
    async searchAvatar() {
        const t = $("#edit-actress-name"), e = $("#edit-actress-allname"), n = t.val().trim(), a = e.val().trim().split(/[\uff0c,]/).map((t => t.trim())).filter((t => t.length > 0));
        if (n && a.unshift(n), 0 === a.length) return void show.error("请先填写女优主名称或别名进行搜索。");
        const i = loading("正在搜索头像...");
        let s = [];
        try {
            s = await he(a);
        } catch (c) {
            return void show.error(`头像数据加载或搜索失败: ${c.message || c}`);
        } finally {
            i.close();
        }
        if (0 === s.length) return void show.error(`未找到与 '${a.join("、")}' 相关的头像。请检查名称。`);
        const o = s.map(((t, e) => `\n        <div id="wrapper-${e}" class="gfriends-image-item-wrapper">\n            <img alt="" src="${t}" data-url="${t}" class="gfriends-selectable-img" data-wrapper-id="wrapper-${e}" >\n            <div class="gfriends-size-tag" data-size-for="wrapper-${e}">...</div> \n        </div>\n    `)).join(""), r = `\n        <style>\n            /* 保持上一个回答的美化样式 */\n            #gfriends-image-list-container { padding: 15px; height: 100%; box-sizing: border-box; background-color: #f8f9fa; }\n            #gfriends-prompt { color: #555; font-weight: 500; border-bottom: 1px solid #eee; padding-bottom: 10px; }\n            #gfriends-image-list { display: flex; flex-wrap: wrap; gap: 15px; justify-content: center; }\n            .gfriends-image-item-wrapper {\n                width: 160px; height: 225px; /* 增加高度以容纳尺寸标签 */\n                overflow: hidden; border-radius: 6px;\n                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); transition: transform 0.2s ease, box-shadow 0.2s ease;\n                cursor: pointer; position: relative; \n                padding-bottom: 25px; /* 为尺寸标签留出空间 */\n            }\n            .gfriends-selectable-img {\n                width: 100%; height: 200px; /* 固定图片高度 */\n                object-fit: cover; border: 3px solid transparent; \n                border-radius: 6px; transition: border 0.2s ease;\n            }\n            .gfriends-image-item-wrapper:hover {\n                transform: translateY(-4px) scale(1.02);\n                box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);\n            }\n            .gfriends-selectable-img.is-selected {\n                border-color: #ff6347;\n                box-shadow: 0 0 0 3px #ff6347;\n            }\n            /* 新增：尺寸标签样式 */\n            .gfriends-size-tag {\n                position: absolute;\n                bottom: 0; /* 定位到图片容器底部 */\n                left: 0;\n                right: 0;\n                height: 25px;\n                line-height: 25px;\n                text-align: center;\n                background-color: rgba(0, 0, 0, 0.7); /* 半透明背景 */\n                color: #fff;\n                font-size: 11px;\n                font-weight: bold;\n                border-bottom-left-radius: 6px;\n                border-bottom-right-radius: 6px;\n                user-select: none;\n            }\n        </style>\n        \n        <div id="gfriends-image-list-container">\n            <p id="gfriends-prompt" style="text-align: center; font-size: 15px; margin-bottom: 15px;">\n                点击图片即可选择（初始共 ${s.length} 张）\n            </p>\n            <div style="overflow-y: auto; height: calc(100% - 40px);">\n                <div id="gfriends-image-list">\n                    ${o}\n                </div>\n            </div>\n        </div>\n    `;
        let l = 0;
        layer.open({
            type: 1,
            title: `选择女优头像 (${s.length} 张)`,
            area: utils.getResponsiveArea([ "900px", "85%" ]),
            content: r,
            btn: [ "关闭" ],
            success: (t, e) => {
                const n = $(t), a = n.find(".gfriends-selectable-img"), i = n.find("#gfriends-prompt");
                a.each((function() {
                    const t = $(this), a = t.data("wrapper-id"), o = n.find(`#${a}`), r = n.find(`.gfriends-size-tag[data-size-for="${a}"]`);
                    t.on("load", (function() {
                        const t = this.naturalWidth, e = this.naturalHeight;
                        r.text(`${t} x ${e}`);
                    })), t.on("error", (function() {
                        o.remove(), l++;
                        const t = s.length - l;
                        i.text(`点击图片即可选择（已移除 ${l} 张错误图片，剩余 ${t} 张）`), 0 === t && (show.error("所有搜索到的头像链接均已失效，无法选择。"), 
                        layer.close(e));
                    })), this.complete && (this.naturalWidth > 0 ? t.trigger("load") : t.trigger("error"));
                })), a.on("click", (function() {
                    const t = $(this), n = t.data("url");
                    $("#edit-actress-avatar").val(n), $("#edit-avatar-preview").attr("src", n), a.removeClass("is-selected"), 
                    t.addClass("is-selected"), setTimeout((() => {
                        layer.close(e);
                    }), 150);
                })), utils.setupEscClose(e);
            }
        });
    }
}

class ge extends G {
    constructor() {
        super(...arguments), o(this, "baseUrl", "http://127.0.0.1:7890");
    }
    getName() {
        return "LocalPlugin";
    }
    async http(t, e, n) {
        return n || (n = void 0), new Promise(((a, i) => {
            GM_xmlhttpRequest({
                method: t,
                url: e,
                data: n,
                onload: t => {
                    try {
                        if (t.status >= 200 && t.status < 300) if (t.responseText) try {
                            a(JSON.parse(t.responseText));
                        } catch (e) {
                            a(t.responseText);
                        } else a(t.responseText || t); else if (t.responseText) try {
                            const e = JSON.parse(t.responseText);
                            i(e);
                        } catch {
                            i(new Error(t.responseText || `请求发生错误 ${t.status}`));
                        } else i(new Error(`请求发生错误 ${t.status}`));
                    } catch (e) {
                        i(e);
                    }
                },
                onerror: t => {
                    i(new Error(t.error || "网络错误"));
                },
                ontimeout: () => {
                    i(new Error("请求超时: " + e));
                }
            });
        }));
    }
    async handle() {
        c && !window.location.href.includes("/actors/") && (isListPage && utils.loopDetector((() => $("#addBlacklistBtn").length || $("#waitDownBtn").length), (() => {
            this.createBtn();
        }), 1, 1e4, !1), isDetailPage && this.matchLocalFile().then());
    }
    async testPing(t) {
        try {
            if (200 !== (await this.http("GET", `${this.baseUrl}/ping?sourceType=${t}`)).code) return !1;
        } catch (e) {
            return !1;
        }
        return !0;
    }
    async createBtn() {
        if (!(await this.testPing("createBtn"))) return;
        $("#addBlacklistBtn,#waitDownBtn").last().after('\n            <a id="archiveBtn" class="menu-btn main-tab-btn" style="background-color:#39babe !important;margin-left: 20px!important;"><span>视频归档</span></a>\n            <a id="checkSubtitleBtn" class="menu-btn main-tab-btn" style="background-color:#d08736 !important;"><span>检查字幕</span></a>\n        '), 
        $("#archiveBtn").on("click", (t => {
            this.archiveFile().then();
        })), $("#checkSubtitleBtn").on("click", (t => {
            this.checkSubTitle().then();
        }));
    }
    async matchLocalFile() {
        if (!(await this.testPing("matchLocalFile"))) return;
        const t = this.getPageInfo().carNum, e = await this.http("GET", `${this.baseUrl}/matchLocalFile?carNum=${t}`), n = $('\n            <div class="jhs-match-detail" id="local-match-table">\n                <table>\n                    <thead>\n                        <tr style="text-align: center">\n                            <th colspan="4">本地匹配</th>\n                        </tr>\n                        <tr>\n                            <th>路径</th>\n                            <th>大小</th>\n                            <th>状态</th>\n                            <th>打开</th>\n                        </tr>\n                    </thead>\n                    <tbody>\n                    </tbody>\n                </table>\n            </div>\n        '), a = n.find("tbody");
        if (e.length > 0) {
            const t = e.map((t => `\n                    <tr>\n                        <td>${t.filePath}</td>\n                        <td>${t.fileSize}</td>\n                        <td>${t.status}</td>\n                        <td>\n                            <a data-filePath="${t.filePath}" class="a-success local-file-link">打开路径</a>\n                        </td>\n                    </tr>\n                `)).join("");
            a.append(t);
        } else a.append('<tr><td colspan="4"> 未匹配 </td></tr>');
        const i = $("#115-match-table");
        i.length ? i.before(n) : ($("#all-match-box").length || $("#tabs-container").before("<div style='display: flex' id='all-match-box'></div>"), 
        $("#all-match-box").append(n)), $("#local-match-table").on("click", ".local-file-link", (t => {
            t.preventDefault(), t.stopPropagation();
            const e = $(t.currentTarget).attr("data-filePath");
            this.http("GET", `${this.baseUrl}/openFilePath?filePath=${e}`).then();
        }));
    }
    async archiveFile() {
        let t = await storageManager.getCarList();
        const e = await this.http("POST", this.baseUrl + "/archiveFile", {
            carList: t
        });
        let n = e.dataList, a = e.updateHasDownCarNumList;
        if (a && a.length) {
            const e = new Set(a), n = Array.from(e);
            for (const a of n) {
                const e = t.find((t => t.carNum === a));
                e && (await storageManager.saveCar({
                    carNum: a,
                    url: e.url,
                    actionType: m
                }), show.ok(`归档成功, ${a}标记为已下载`));
            }
        }
        n.length > 0 ? layer.open({
            type: 1,
            title: "归档信息",
            shadeClose: !0,
            scrollbar: !1,
            content: '\n                    <div style="height: 100%;overflow:hidden;"> \n                        <div id="archive-container" style="height: 100%;"></div>\n                    </div>\n                ',
            anim: -1,
            area: [ "50%", "70%" ],
            success: t => {
                new Tabulator("#archive-container", {
                    layout: "fitColumns",
                    placeholder: "暂无数据",
                    virtualDom: !0,
                    data: n,
                    responsiveLayout: "collapse",
                    responsiveLayoutCollapse: !0,
                    columnDefaults: {
                        headerHozAlign: "center",
                        hozAlign: "center"
                    },
                    columns: [ {
                        title: "信息",
                        field: "msg",
                        headerSort: !1,
                        formatter: (t, e, n) => {
                            const a = t.getData();
                            return "ok" === a.type ? `<span style="color:#58ad67">${a.msg}</span>` : `<span style="color:#c52323">${a.msg}</span>`;
                        }
                    }, {
                        title: "操作",
                        headerSort: !1,
                        width: 200,
                        formatter: (t, e, n) => {
                            const a = t.getData();
                            return n((() => {
                                var e;
                                null == (e = t.getElement().querySelector(".a-primary")) || e.addEventListener("click", (t => {
                                    this.http("GET", this.baseUrl + "/openFilePath", {
                                        filePath: a.file
                                    });
                                }));
                            })), '<a class="a-primary">打开路径</a>';
                        }
                    } ],
                    locale: "zh-cn",
                    langs: {
                        "zh-cn": {
                            pagination: {
                                first: "首页",
                                first_title: "首页",
                                last: "尾页",
                                last_title: "尾页",
                                prev: "上一页",
                                prev_title: "上一页",
                                next: "下一页",
                                next_title: "下一页",
                                all: "所有",
                                page_size: "每页行数"
                            }
                        }
                    }
                });
            },
            end() {
                window.refresh();
            }
        }) : show.info("没有可归档文件");
    }
    async checkSubTitle() {
        let t = await storageManager.getCarList();
        let e = (await this.http("POST", this.baseUrl + "/checkSubTitle", {
            dataList: t
        })).data;
        0 !== e.length ? layer.open({
            type: 1,
            title: "检测缺失字幕",
            shadeClose: !0,
            scrollbar: !1,
            content: '\n                    <div style="height: 100%;overflow:hidden;"> \n                        <div id="checkSubTitle-table-container" style="height: 100%;padding-bottom: 10px"></div>\n                    </div>\n                ',
            anim: -1,
            area: [ "70%", "70%" ],
            success: t => {
                new Tabulator("#checkSubTitle-table-container", {
                    layout: "fitColumns",
                    placeholder: "暂无数据",
                    virtualDom: !0,
                    data: e,
                    responsiveLayout: "collapse",
                    responsiveLayoutCollapse: !0,
                    columnDefaults: {
                        headerHozAlign: "center",
                        hozAlign: "center"
                    },
                    columns: [ {
                        title: "番号",
                        width: 150,
                        field: "carNum",
                        headerSort: !1,
                        formatter: (t, e, n) => {
                            const a = t.getData(), i = a.type;
                            return a.msg, "error" === i ? `<span style="color: #f40">${a.msg}</span>` : a.carNum;
                        }
                    }, {
                        title: "文件路径",
                        field: "filePath",
                        headerSort: !1,
                        formatter: (t, e, n) => t.getData().filePath
                    }, {
                        title: "操作",
                        headerSort: !1,
                        responsive: 0,
                        formatter: (t, e, n) => {
                            const a = t.getData();
                            return n((() => {
                                var e, n, i, s, o;
                                null == (e = t.getElement().querySelector(".a-success")) || e.addEventListener("click", (t => {
                                    this.http("GET", this.baseUrl + "/openFilePath", {
                                        filePath: a.filePath
                                    });
                                })), null == (n = t.getElement().querySelector(".a-info")) || n.addEventListener("click", (t => {
                                    let e = a.carNum, n = a.url;
                                    if (n) if (e.includes("FC2-")) {
                                        let t = this.parseMovieId(n);
                                        this.getBean("Fc2Plugin").openFc2Dialog(t, e, n);
                                    } else utils.openPage(n, e, !0, t); else show.error("没有找到url");
                                })), null == (i = t.getElement().querySelector(".a-warning")) || i.addEventListener("click", (t => {
                                    this.getBean("DetailPageButtonPlugin").searchXunLeiSubtitle(a.carNum);
                                })), null == (s = t.getElement().querySelector(".a-primary")) || s.addEventListener("click", (t => {
                                    utils.openPage("" + ("https://subtitlecat.com/index.php?search=" + a.carNum.replace("FC2-", "")), a.carNum.replace("FC2-", ""), !0, t);
                                })), null == (o = t.getElement().querySelector(".a-danger")) || o.addEventListener("click", (t => {
                                    const e = a.filePath.split("<br/>").filter((t => "" !== t.trim()));
                                    utils.q(t, `是否调用AI程序生成字幕,共${e.length}个视频文件`, (() => {
                                        this.aiSubtitle(e);
                                    }));
                                }));
                            })), '\n                                    <a class="a-success">打开路径</a>\n                                    <a class="a-info">详情页</a>\n                                    <a class="a-warning">迅雷字幕</a>\n                                    <a class="a-primary">SubTitleCat字幕</a>\n                                    <a class="a-danger">AI字幕</a>\n                                ';
                        }
                    } ],
                    locale: "zh-cn",
                    langs: {
                        "zh-cn": {
                            pagination: {
                                first: "首页",
                                first_title: "首页",
                                last: "尾页",
                                last_title: "尾页",
                                prev: "上一页",
                                prev_title: "上一页",
                                next: "下一页",
                                next_title: "下一页",
                                all: "所有",
                                page_size: "每页行数"
                            }
                        }
                    }
                });
            },
            end() {
                window.refresh();
            }
        }) : show.info("视频字幕完整");
    }
    async aiSubtitle(t) {
        const e = await this.http("POST", this.baseUrl + "/aiSubtitle", {
            fileList: t
        });
        200 === e.code ? show.info("已调用后台程序, 请自行确认") : show.error(e.msg);
    }
}

const me = layer.close;

layer.close = function(t) {
    const e = me.call(this, t);
    return function(t = 10) {
        setTimeout((() => {
            const t = document.querySelectorAll(".layui-layer-shade").length;
            document.documentElement.style.overflow = t > 0 ? "hidden" : "";
        }), t);
    }(), e;
};

const ue = layer.open;

layer.open = function(t) {
    const e = (t = t || {}).success;
    return t.success = function(t, n) {
        "function" == typeof e && e.call(this, t, n), utils.setupEscClose(n);
    }, ue.call(this, t);
}, utils.importResource("https://cdn.jsdelivr.net/npm/layui-layer@1.0.9/layer.min.css"), 
utils.importResource("https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css"), 
utils.importResource("https://cdn.jsdelivr.net/npm/viewerjs@1.11.1/dist/viewer.min.css"), 
utils.importResource("https://cdn.jsdelivr.net/npm/tabulator-tables@6.3.1/dist/css/tabulator_semanticui.min.css");

const ve = function() {
    const t = new J;
    unsafeWindow.pluginManager = window.pluginManager = t;
    let e = window.location.hostname;
    return c && (t.register(Tt), t.register(It), t.register(ot), t.register(lt), t.register(St), 
    t.register(wt), t.register(Dt), t.register(mt), t.register(ht), t.register(gt), 
    t.register(zt), t.register(jt), t.register(Ut), t.register(Gt), t.register(Y), t.register(yt), 
    t.register(Et), t.register(bt), t.register(rt), t.register(et), t.register(xt), 
    t.register(ct), t.register(vt), t.register(Wt), t.register(Qt), t.register(Ht), 
    t.register(Ot), t.register(Kt), t.register(kt), t.register(Yt), t.register(pe), 
    t.register(Zt), t.register(ge)), d && (t.register(Tt), t.register(St), t.register(Dt), 
    t.register(wt), t.register(It), t.register(jt), t.register(Nt), t.register(zt), 
    t.register(Gt), t.register(Xt), t.register(ft), t.register(bt), t.register(yt), 
    t.register(xt), t.register(rt), t.register(Ft), t.register(Ot), t.register(Kt), 
    t.register(vt), t.register(Wt), t.register(Qt), t.register(kt), t.register(Zt)), 
    e.includes("javtrailers") && t.register(it), e.includes("subtitlecat") && t.register(st), 
    (e.includes("aliyundrive") || e.includes("alipan")) && t.register(dt), e.includes("115.com") && t.register(qt), 
    t;
}();

ve.processCss().then(), async function() {
    window.isDetailPage = function() {
        let t = window.location.href;
        return c ? t.split("?")[0].includes("/v/") : !!d && $("#magnet-table").length > 0;
    }(), window.isListPage = function() {
        let t = window.location.href;
        return c ? $(".movie-list").length > 0 || t.includes("advanced_search") : !!d && $(".masonry > div .item").length > 0;
    }(), window.isFc2Page = function() {
        let t = window.location.href;
        return t.includes("advanced_search?type=3") || t.includes("advanced_search?type=100");
    }(), await storageManager.merge_table_name(), await storageManager.clean_no_url_blacklist(), 
    await storageManager.async_merge_other(), await storageManager.merge_blacklist(), 
    await storageManager.merge_favoriteActress(), await storageManager.merge_tow_car_list_table(), 
    await storageManager.merge_blacklist_movieType(), c && /(^|;)\s*locale\s*=\s*en\s*($|;)/i.test(document.cookie) && show.error("请切换到中文语言下才可正常使用本脚本", {
        duration: -1
    }), ve.processPlugins().then();
}();
