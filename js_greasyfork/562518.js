// ==UserScript==
// @name         mn-video
// @namespace    mn-video
// @version      0.1.1
// @description  Monster Nest 视频链接播放器增强脚本
// @license      MIT
// @icon         https://monster-nest.com/favicon.ico
// @match        https://monster-nest.com/forum*
// @downloadURL https://update.greasyfork.org/scripts/562518/mn-video.user.js
// @updateURL https://update.greasyfork.org/scripts/562518/mn-video.meta.js
// ==/UserScript==

(function () {
  'use strict';

  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var require_main_001 = __commonJS({
    "main-CVT7AFRg.js"(exports$1, module) {
      !(function(e2, t, r, a, o, i, n, s) {
        var l = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof self ? self : "undefined" != typeof window ? window : "undefined" != typeof global ? global : {}, c = "function" == typeof l[a] && l[a], p = c.i || {}, u = c.cache || {}, d = "undefined" != typeof module && "function" == typeof module.require && module.require.bind(module);
        function f(t2, r2) {
          if (!u[t2]) {
            if (!e2[t2]) {
              if (o[t2]) return o[t2];
              var i2 = "function" == typeof l[a] && l[a];
              if (!r2 && i2) return i2(t2, true);
              if (c) return c(t2, true);
              if (d && "string" == typeof t2) return d(t2);
              var n2 = Error("Cannot find module '" + t2 + "'");
              throw n2.code = "MODULE_NOT_FOUND", n2;
            }
            p2.resolve = function(r3) {
              var a2 = e2[t2][1][r3];
              return null != a2 ? a2 : r3;
            }, p2.cache = {};
            var s2 = u[t2] = new f.Module(t2);
            e2[t2][0].call(s2.exports, p2, s2, s2.exports, l);
          }
          return u[t2].exports;
          function p2(e3) {
            var t3 = p2.resolve(e3);
            return false === t3 ? {} : f(t3);
          }
        }
        f.isParcelRequire = true, f.Module = function(e3) {
          this.id = e3, this.bundle = f, this.require = d, this.exports = {};
        }, f.modules = e2, f.cache = u, f.parent = c, f.distDir = void 0, f.publicUrl = void 0, f.devServer = void 0, f.i = p, f.register = function(t2, r2) {
          e2[t2] = [function(e3, t3) {
            t3.exports = r2;
          }, {}];
        }, Object.defineProperty(f, "root", { get: function() {
          return l[a];
        } }), l[a] = f;
        for (var h = 0; h < t.length; h++) f(t[h]);
        {
          var m = f(r);
          "object" == typeof exports$1 && "undefined" != typeof module ? module.exports = m : "function" == typeof define && define.amd && define(function() {
            return m;
          });
        }
      })({ esqvp: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("bundle-text:./style/index.less"), n = o.interopDefault(i), s = e2("option-validator"), l = o.interopDefault(s), c = e2("../package.json"), p = e2("./config"), u = o.interopDefault(p), d = e2("./contextmenu"), f = o.interopDefault(d), h = e2("./control"), m = o.interopDefault(h), g = e2("./events"), v = o.interopDefault(g), y = e2("./hotkey"), b = o.interopDefault(y), x = e2("./i18n"), w = o.interopDefault(x), j = e2("./icons"), k = o.interopDefault(j), E = e2("./info"), S = o.interopDefault(E), $ = e2("./layer"), M = o.interopDefault($), I = e2("./loading"), T = o.interopDefault(I), C = e2("./mask"), F = o.interopDefault(C), q = e2("./notice"), D = o.interopDefault(q), A = e2("./player"), R = o.interopDefault(A), B = e2("./plugins"), L = o.interopDefault(B), O = e2("./scheme"), P = o.interopDefault(O), z = e2("./setting"), X = o.interopDefault(z), V = e2("./storage"), _ = o.interopDefault(V), H = e2("./subtitle"), N = o.interopDefault(H), W = e2("./template"), U = o.interopDefault(W), Y = e2("./utils"), Z = e2("./utils/emitter"), K = o.interopDefault(Z);
        let G = 0, J = [];
        class Q extends K.default {
          constructor(e3, t2) {
            if (super(), !Y.isBrowser) throw Error("Artplayer can only be used in the browser environment");
            this.id = ++G;
            let r2 = Y.mergeDeep(Q.option, e3);
            if (r2.container = e3.container, this.option = (0, l.default)(r2, P.default), this.isLock = false, this.isReady = false, this.isFocus = false, this.isInput = false, this.isRotate = false, this.isDestroy = false, this.template = new U.default(this), this.events = new v.default(this), this.storage = new _.default(this), this.icons = new k.default(this), this.i18n = new w.default(this), this.notice = new D.default(this), this.player = new R.default(this), this.layers = new M.default(this), this.controls = new m.default(this), this.contextmenu = new f.default(this), this.subtitle = new N.default(this), this.info = new S.default(this), this.loading = new T.default(this), this.hotkey = new b.default(this), this.mask = new F.default(this), this.setting = new X.default(this), this.plugins = new L.default(this), "function" == typeof t2 && this.on("ready", () => t2.call(this, this)), Q.DEBUG) {
              let e4 = (e5) => console.log(`[ART.${this.id}] -> ${e5}`);
              e4(`Version@${Q.version}`);
              for (let t3 = 0; t3 < u.default.events.length; t3++) this.on(`video:${u.default.events[t3]}`, (t4) => e4(`Event@${t4.type}`));
            }
            J.push(this);
          }
          static get instances() {
            return J;
          }
          static get version() {
            return c.version;
          }
          static get config() {
            return u.default;
          }
          static get utils() {
            return Y;
          }
          static get scheme() {
            return P.default;
          }
          static get Emitter() {
            return K.default;
          }
          static get validator() {
            return l.default;
          }
          static get kindOf() {
            return l.default.kindOf;
          }
          static get html() {
            return U.default.html;
          }
          static get option() {
            return { id: "", container: "#artplayer", url: "", poster: "", type: "", theme: "#f00", volume: 0.7, isLive: false, muted: false, autoplay: false, autoSize: false, autoMini: false, loop: false, flip: false, playbackRate: false, aspectRatio: false, screenshot: false, setting: false, hotkey: true, pip: false, mutex: true, backdrop: true, fullscreen: false, fullscreenWeb: false, subtitleOffset: false, miniProgressBar: false, useSSR: false, playsInline: true, lock: false, gesture: true, fastForward: false, autoPlayback: false, autoOrientation: false, airplay: false, proxy: void 0, layers: [], contextmenu: [], controls: [], settings: [], quality: [], highlight: [], plugins: [], thumbnails: { url: "", number: 60, column: 10, width: 0, height: 0, scale: 1 }, subtitle: { url: "", type: "", style: {}, name: "", escape: true, encoding: "utf-8", onVttLoad: (e3) => e3 }, moreVideoAttr: { controls: false, preload: Y.isSafari ? "auto" : "metadata" }, i18n: {}, icons: {}, cssVar: {}, customType: {}, lang: navigator?.language.toLowerCase() };
          }
          get proxy() {
            return this.events.proxy;
          }
          get query() {
            return this.template.query;
          }
          get video() {
            return this.template.$video;
          }
          destroy(e3 = true) {
            Q.REMOVE_SRC_WHEN_DESTROY && this.video.removeAttribute("src"), this.events.destroy(), this.template.destroy(e3), J.splice(J.indexOf(this), 1), this.isDestroy = true, this.emit("destroy");
          }
        }
        r.default = Q, Q.STYLE = n.default, Q.DEBUG = false, Q.CONTEXTMENU = true, Q.NOTICE_TIME = 2e3, Q.SETTING_WIDTH = 250, Q.SETTING_ITEM_WIDTH = 200, Q.SETTING_ITEM_HEIGHT = 35, Q.RESIZE_TIME = 200, Q.SCROLL_TIME = 200, Q.SCROLL_GAP = 50, Q.AUTO_PLAYBACK_MAX = 10, Q.AUTO_PLAYBACK_MIN = 5, Q.AUTO_PLAYBACK_TIMEOUT = 3e3, Q.RECONNECT_TIME_MAX = 5, Q.RECONNECT_SLEEP_TIME = 1e3, Q.CONTROL_HIDE_TIME = 3e3, Q.DBCLICK_TIME = 300, Q.DBCLICK_FULLSCREEN = true, Q.MOBILE_DBCLICK_PLAY = true, Q.MOBILE_CLICK_PLAY = false, Q.AUTO_ORIENTATION_TIME = 200, Q.INFO_LOOP_TIME = 1e3, Q.FAST_FORWARD_VALUE = 3, Q.FAST_FORWARD_TIME = 1e3, Q.TOUCH_MOVE_RATIO = 0.5, Q.VOLUME_STEP = 0.1, Q.SEEK_STEP = 5, Q.PLAYBACK_RATE = [0.5, 0.75, 1, 1.25, 1.5, 2], Q.ASPECT_RATIO = ["default", "4:3", "16:9"], Q.FLIP = ["normal", "horizontal", "vertical"], Q.FULLSCREEN_WEB_IN_BODY = false, Q.LOG_VERSION = true, Q.USE_RAF = false, Q.REMOVE_SRC_WHEN_DESTROY = true, Y.isBrowser && (window.Artplayer = Q, Y.setStyleText("artplayer-style", n.default), setTimeout(() => {
          Q.LOG_VERSION && console.log(`%c ArtPlayer %c ${Q.version} %c https://artplayer.org`, "color: #fff; background: #5f5f5f", "color: #fff; background: #4bc729", "");
        }, 100));
      }, { "bundle-text:./style/index.less": "2wh8D", "option-validator": "g7VGh", "../package.json": "lh3R5", "./config": "eJfh8", "./contextmenu": "9zso8", "./control": "dp1yk", "./events": "jmVSD", "./hotkey": "dswts", "./i18n": "d9ktO", "./icons": "fFHY0", "./info": "kZ0F8", "./layer": "j9lbi", "./loading": "bMjWd", "./mask": "k1nkQ", "./notice": "fPVaU", "./player": "uR0Sw", "./plugins": "cjxJL", "./scheme": "biLjm", "./setting": "bwLGT", "./storage": "kwqbK", "./subtitle": "k5613", "./template": "fwOA1", "./utils": "aBlEo", "./utils/emitter": "4NM7P", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "2wh8D": [function(e2, t, r, a) {
        t.exports = '.art-video-player{--art-theme:red;--art-font-color:#fff;--art-background-color:#000;--art-text-shadow-color:#00000080;--art-transition-duration:.2s;--art-padding:10px;--art-border-radius:3px;--art-progress-height:6px;--art-progress-color:#ffffff40;--art-hover-color:#ffffff40;--art-loaded-color:#ffffff40;--art-state-size:80px;--art-state-opacity:.8;--art-bottom-height:100px;--art-bottom-offset:20px;--art-bottom-gap:5px;--art-highlight-width:8px;--art-highlight-color:#ffffff80;--art-control-height:46px;--art-control-opacity:.75;--art-control-icon-size:36px;--art-control-icon-scale:1.1;--art-volume-height:120px;--art-volume-handle-size:14px;--art-lock-size:36px;--art-indicator-scale:0;--art-indicator-size:16px;--art-fullscreen-web-index:9999;--art-settings-icon-size:24px;--art-settings-max-height:300px;--art-selector-max-height:300px;--art-contextmenus-min-width:250px;--art-subtitle-font-size:20px;--art-subtitle-gap:5px;--art-subtitle-bottom:15px;--art-subtitle-border:#000;--art-widget-background:#000000d9;--art-tip-background:#000000b3;--art-scrollbar-size:4px;--art-scrollbar-background:#ffffff40;--art-scrollbar-background-hover:#ffffff80;--art-mini-progress-height:2px}.art-bg-cover{background-position:50%;background-repeat:no-repeat;background-size:cover}.art-bottom-gradient{background-image:linear-gradient(#0000,#0006,#000);background-position:bottom;background-repeat:repeat-x}.art-backdrop-filter{backdrop-filter:saturate(180%)blur(20px);background-color:#000000bf!important}.art-truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.art-video-player{zoom:1;text-align:left;user-select:none;box-sizing:border-box;width:100%;height:100%;color:var(--art-font-color);background-color:var(--art-background-color);text-shadow:0 0 2px var(--art-text-shadow-color);-webkit-tap-highlight-color:#0000;-ms-touch-action:manipulation;touch-action:manipulation;-ms-high-contrast-adjust:none;direction:ltr;outline:0;margin:0 auto;padding:0;font-family:PingFang SC,Helvetica Neue,Microsoft YaHei,Roboto,Arial,sans-serif;font-size:14px;line-height:1.3;position:relative}.art-video-player *,.art-video-player :before,.art-video-player :after{box-sizing:border-box}.art-video-player ::-webkit-scrollbar{width:var(--art-scrollbar-size);height:var(--art-scrollbar-size)}.art-video-player ::-webkit-scrollbar-thumb{background-color:var(--art-scrollbar-background)}.art-video-player ::-webkit-scrollbar-thumb:hover{background-color:var(--art-scrollbar-background-hover)}.art-video-player img{vertical-align:top;max-width:100%}.art-video-player svg{fill:var(--art-font-color)}.art-video-player a{color:var(--art-font-color);text-decoration:none}.art-icon{justify-content:center;align-items:center;line-height:1;display:flex}.art-video-player.art-backdrop .art-contextmenus,.art-video-player.art-backdrop .art-info,.art-video-player.art-backdrop .art-settings,.art-video-player.art-backdrop .art-layer-auto-playback,.art-video-player.art-backdrop .art-selector-list,.art-video-player.art-backdrop .art-volume-inner{backdrop-filter:saturate(180%)blur(20px);background-color:#000000bf!important}.art-video{z-index:10;cursor:pointer;width:100%;height:100%;position:absolute;inset:0}.art-poster{z-index:11;pointer-events:none;background-position:50%;background-repeat:no-repeat;background-size:cover;width:100%;height:100%;position:absolute;inset:0}.art-video-player .art-subtitle{z-index:20;text-align:center;pointer-events:none;justify-content:center;align-items:center;gap:var(--art-subtitle-gap);width:100%;bottom:var(--art-subtitle-bottom);font-size:var(--art-subtitle-font-size);transition:bottom var(--art-transition-duration)ease;text-shadow:var(--art-subtitle-border)1px 0 1px,var(--art-subtitle-border)0 1px 1px,var(--art-subtitle-border)-1px 0 1px,var(--art-subtitle-border)0 -1px 1px,var(--art-subtitle-border)1px 1px 1px,var(--art-subtitle-border)-1px -1px 1px,var(--art-subtitle-border)1px -1px 1px,var(--art-subtitle-border)-1px 1px 1px;flex-direction:column;padding:0 5%;display:none;position:absolute}.art-video-player.art-subtitle-show .art-subtitle{display:flex}.art-video-player.art-control-show .art-subtitle{bottom:calc(var(--art-control-height) + var(--art-subtitle-bottom))}.art-danmuku{z-index:30;pointer-events:none;width:100%;height:100%;position:absolute;inset:0;overflow:hidden}.art-video-player .art-layers{z-index:40;pointer-events:none;width:100%;height:100%;display:none;position:absolute;inset:0}.art-video-player .art-layers .art-layer{pointer-events:auto}.art-video-player.art-layer-show .art-layers{display:flex}.art-video-player .art-mask{z-index:50;pointer-events:none;justify-content:center;align-items:center;width:100%;height:100%;display:flex;position:absolute;inset:0}.art-video-player .art-mask .art-state{opacity:0;width:var(--art-state-size);height:var(--art-state-size);transition:all var(--art-transition-duration)ease;justify-content:center;align-items:center;display:flex;transform:scale(2)}.art-video-player.art-mask-show .art-state{cursor:pointer;pointer-events:auto;opacity:var(--art-state-opacity);transform:scale(1)}.art-video-player.art-loading-show .art-state{display:none}.art-video-player .art-loading{z-index:70;pointer-events:none;justify-content:center;align-items:center;width:100%;height:100%;display:none;position:absolute;inset:0}.art-video-player.art-loading-show .art-loading{display:flex}.art-video-player .art-bottom{z-index:60;opacity:0;pointer-events:none;width:100%;height:100%;padding:0 var(--art-padding);transition:all var(--art-transition-duration)ease;background-size:100% var(--art-bottom-height);background-image:linear-gradient(#0000,#0006,#000);background-position:bottom;background-repeat:repeat-x;flex-direction:column;justify-content:flex-end;display:flex;position:absolute;inset:0;overflow:hidden}.art-video-player .art-bottom .art-controls,.art-video-player .art-bottom .art-progress{transform:translateY(var(--art-bottom-offset));transition:transform var(--art-transition-duration)ease}.art-video-player.art-control-show .art-bottom,.art-video-player.art-hover .art-bottom{opacity:1}.art-video-player.art-control-show .art-bottom .art-controls,.art-video-player.art-hover .art-bottom .art-controls,.art-video-player.art-control-show .art-bottom .art-progress,.art-video-player.art-hover .art-bottom .art-progress{transform:translateY(0)}.art-bottom .art-progress{z-index:0;pointer-events:auto;padding-bottom:var(--art-bottom-gap);position:relative}.art-bottom .art-progress .art-control-progress{cursor:pointer;height:var(--art-progress-height);justify-content:center;align-items:center;display:flex;position:relative}.art-bottom .art-progress .art-control-progress .art-control-progress-inner{width:100%;height:50%;transition:height var(--art-transition-duration)ease;background-color:var(--art-progress-color);align-items:center;display:flex;position:relative}.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-hover{z-index:0;background-color:var(--art-hover-color);width:0%;height:100%;position:absolute;inset:0}.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-loaded{z-index:10;background-color:var(--art-loaded-color);width:0%;height:100%;position:absolute;inset:0}.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-played{z-index:20;background-color:var(--art-theme);width:0%;height:100%;position:absolute;inset:0}.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight{z-index:30;pointer-events:none;width:100%;height:100%;position:absolute;inset:0}.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-highlight span{z-index:0;pointer-events:auto;width:100%;height:100%;transform:translateX(calc(var(--art-highlight-width)/-2));background-color:var(--art-highlight-color);position:absolute;inset:0 auto 0 0;width:var(--art-highlight-width)!important}.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator{z-index:40;width:var(--art-indicator-size);height:var(--art-indicator-size);transform:scale(var(--art-indicator-scale));margin-left:calc(var(--art-indicator-size)/-2);transition:transform var(--art-transition-duration)ease;border-radius:50%;justify-content:center;align-items:center;display:flex;position:absolute;left:0}.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator .art-icon{pointer-events:none;width:100%;height:100%}.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator:hover{transform:scale(1.2)!important}.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator:active{transform:scale(1)!important}.art-bottom .art-progress .art-control-progress .art-control-progress-inner .art-progress-tip{z-index:50;border-radius:var(--art-border-radius);white-space:nowrap;background-color:var(--art-tip-background);padding:3px 5px;font-size:12px;line-height:1;display:none;position:absolute;top:-25px;left:0}.art-bottom .art-progress .art-control-progress:hover .art-control-progress-inner{height:100%}.art-bottom .art-progress .art-control-thumbnails{bottom:calc(var(--art-bottom-gap) + 10px);border-radius:var(--art-border-radius);pointer-events:none;background-color:var(--art-widget-background);display:none;position:absolute;left:0;box-shadow:0 1px 3px #0003,0 1px 2px -1px #0003}.art-bottom:hover .art-progress .art-control-progress .art-control-progress-inner .art-progress-indicator{transform:scale(1)}.art-controls{z-index:10;pointer-events:auto;height:var(--art-control-height);justify-content:space-between;align-items:center;display:flex;position:relative}.art-controls .art-controls-left,.art-controls .art-controls-right{height:100%;display:flex}.art-controls .art-controls-center{flex:1;justify-content:center;align-items:center;height:100%;padding:0 10px;display:none}.art-controls .art-controls-right{justify-content:flex-end}.art-controls .art-control{cursor:pointer;white-space:nowrap;opacity:var(--art-control-opacity);min-height:var(--art-control-height);min-width:var(--art-control-height);transition:opacity var(--art-transition-duration)ease;flex-shrink:0;justify-content:center;align-items:center;display:flex}.art-controls .art-control .art-icon{height:var(--art-control-icon-size);width:var(--art-control-icon-size);transform:scale(var(--art-control-icon-scale));transition:transform var(--art-transition-duration)ease}.art-controls .art-control .art-icon:active{transform:scale(calc(var(--art-control-icon-scale)*.8))}.art-controls .art-control:hover{opacity:1}.art-control-volume{position:relative}.art-control-volume .art-volume-panel{text-align:center;cursor:default;opacity:0;pointer-events:none;left:0;right:0;bottom:var(--art-control-height);width:var(--art-control-height);height:var(--art-volume-height);transition:all var(--art-transition-duration)ease;justify-content:center;align-items:center;padding:0 5px;font-size:12px;display:flex;position:absolute;transform:translateY(10px)}.art-control-volume .art-volume-panel .art-volume-inner{border-radius:var(--art-border-radius);background-color:var(--art-widget-background);flex-direction:column;align-items:center;gap:10px;width:100%;height:100%;padding:10px 0 12px;display:flex}.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider{cursor:pointer;flex:1;justify-content:center;width:100%;display:flex;position:relative}.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-handle{border-radius:var(--art-border-radius);background-color:#ffffff40;justify-content:center;width:2px;display:flex;position:relative;overflow:hidden}.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-handle .art-volume-loaded{z-index:0;background-color:var(--art-theme);width:100%;height:100%;position:absolute;inset:0}.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider .art-volume-indicator{width:var(--art-volume-handle-size);height:var(--art-volume-handle-size);margin-top:calc(var(--art-volume-handle-size)/-2);background-color:var(--art-theme);transition:transform var(--art-transition-duration)ease;border-radius:100%;flex-shrink:0;position:absolute;transform:scale(1)}.art-control-volume .art-volume-panel .art-volume-inner .art-volume-slider:active .art-volume-indicator{transform:scale(.9)}.art-control-volume:hover .art-volume-panel{opacity:1;pointer-events:auto;transform:translateY(0)}.art-video-player .art-notice{z-index:80;width:100%;height:auto;padding:var(--art-padding);pointer-events:none;display:none;position:absolute;inset:0 0 auto}.art-video-player .art-notice .art-notice-inner{border-radius:var(--art-border-radius);background-color:var(--art-tip-background);padding:5px;line-height:1;display:inline-flex}.art-video-player.art-notice-show .art-notice{display:flex}.art-video-player .art-contextmenus{z-index:120;border-radius:var(--art-border-radius);background-color:var(--art-widget-background);min-width:var(--art-contextmenus-min-width);flex-direction:column;padding:5px 0;font-size:12px;display:none;position:absolute}.art-video-player .art-contextmenus .art-contextmenu{cursor:pointer;border-bottom:1px solid #ffffff1a;padding:10px 15px;display:flex}.art-video-player .art-contextmenus .art-contextmenu span{padding:0 8px}.art-video-player .art-contextmenus .art-contextmenu span:hover,.art-video-player .art-contextmenus .art-contextmenu span.art-current{color:var(--art-theme)}.art-video-player .art-contextmenus .art-contextmenu:hover{background-color:#ffffff1a}.art-video-player .art-contextmenus .art-contextmenu:last-child{border-bottom:none}.art-video-player.art-contextmenu-show .art-contextmenus{display:flex}.art-video-player .art-settings{z-index:90;border-radius:var(--art-border-radius);max-height:var(--art-settings-max-height);left:auto;right:var(--art-padding);bottom:var(--art-control-height);transition:all var(--art-transition-duration)ease;background-color:var(--art-widget-background);flex-direction:column;display:none;position:absolute;overflow:hidden auto}.art-video-player .art-settings .art-setting-panel{flex-direction:column;display:none}.art-video-player .art-settings .art-setting-panel.art-current{display:flex}.art-video-player .art-settings .art-setting-panel .art-setting-item{cursor:pointer;transition:background-color var(--art-transition-duration)ease;justify-content:space-between;align-items:center;padding:0 5px;display:flex;overflow:hidden}.art-video-player .art-settings .art-setting-panel .art-setting-item:hover{background-color:#ffffff1a}.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current{color:var(--art-theme)}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-icon-check{visibility:hidden;height:15px}.art-video-player .art-settings .art-setting-panel .art-setting-item.art-current .art-icon-check{visibility:visible}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left{flex-shrink:0;justify-content:center;align-items:center;gap:5px;display:flex}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-left .art-setting-item-left-icon{height:var(--art-settings-icon-size);width:var(--art-settings-icon-size);justify-content:center;align-items:center;display:flex}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right{justify-content:center;align-items:center;gap:5px;font-size:12px;display:flex}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-tooltip{white-space:nowrap;color:#ffffff80}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-item-right-icon{justify-content:center;align-items:center;min-width:32px;height:24px;display:flex}.art-video-player .art-settings .art-setting-panel .art-setting-item .art-setting-item-right .art-setting-range{appearance:none;background-color:#fff3;outline:none;width:80px;height:3px}.art-video-player .art-settings .art-setting-panel .art-setting-item-back{border-bottom:1px solid #ffffff1a}.art-video-player.art-setting-show .art-settings{display:flex}.art-video-player .art-info{left:var(--art-padding);top:var(--art-padding);z-index:100;border-radius:var(--art-border-radius);background-color:var(--art-widget-background);padding:10px;font-size:12px;display:none;position:absolute}.art-video-player .art-info .art-info-panel{flex-direction:column;gap:5px;display:flex}.art-video-player .art-info .art-info-panel .art-info-item{align-items:center;gap:5px;display:flex}.art-video-player .art-info .art-info-panel .art-info-item .art-info-title{text-align:right;width:100px}.art-video-player .art-info .art-info-panel .art-info-item .art-info-content{text-overflow:ellipsis;white-space:nowrap;user-select:all;width:250px;overflow:hidden}.art-video-player .art-info .art-info-close{cursor:pointer;position:absolute;top:5px;right:5px}.art-video-player.art-info-show .art-info{display:flex}.art-hide-cursor *{cursor:none!important}.art-video-player[data-aspect-ratio]{overflow:hidden}.art-video-player[data-aspect-ratio] .art-video{object-fit:fill;box-sizing:content-box}.art-fullscreen{--art-progress-height:8px;--art-indicator-size:20px;--art-control-height:60px;--art-control-icon-scale:1.3}.art-fullscreen-web{--art-progress-height:8px;--art-indicator-size:20px;--art-control-height:60px;--art-control-icon-scale:1.3;z-index:var(--art-fullscreen-web-index);width:100%;height:100%;position:fixed;inset:0}.art-mini-popup{z-index:9999;border-radius:var(--art-border-radius);cursor:move;user-select:none;background:#000;width:320px;height:180px;transition:opacity .2s;position:fixed;overflow:hidden;box-shadow:0 0 5px #00000080}.art-mini-popup svg{fill:#fff}.art-mini-popup .art-video{pointer-events:none}.art-mini-popup .art-mini-close{z-index:20;cursor:pointer;opacity:0;transition:opacity .2s;position:absolute;top:10px;right:10px}.art-mini-popup .art-mini-state{z-index:30;pointer-events:none;opacity:0;background-color:#00000040;justify-content:center;align-items:center;width:100%;height:100%;transition:opacity .2s;display:flex;position:absolute;inset:0}.art-mini-popup .art-mini-state .art-icon{opacity:.75;cursor:pointer;pointer-events:auto;transition:transform .2s;transform:scale(3)}.art-mini-popup .art-mini-state .art-icon:active{transform:scale(2.5)}.art-mini-popup.art-mini-dragging{opacity:.9}.art-mini-popup:hover .art-mini-close,.art-mini-popup:hover .art-mini-state{opacity:1}.art-video-player[data-flip=horizontal] .art-video{transform:scaleX(-1)}.art-video-player[data-flip=vertical] .art-video{transform:scaleY(-1)}.art-video-player .art-layer-lock{height:var(--art-lock-size);width:var(--art-lock-size);top:50%;left:var(--art-padding);background-color:var(--art-tip-background);border-radius:50%;justify-content:center;align-items:center;display:none;position:absolute;transform:translateY(-50%)}.art-video-player .art-layer-auto-playback{border-radius:var(--art-border-radius);left:var(--art-padding);bottom:calc(var(--art-control-height) + var(--art-bottom-gap) + 10px);background-color:var(--art-widget-background);align-items:center;gap:10px;padding:10px;line-height:1;display:none;position:absolute}.art-video-player .art-layer-auto-playback .art-auto-playback-close{cursor:pointer;justify-content:center;align-items:center;display:flex}.art-video-player .art-layer-auto-playback .art-auto-playback-close svg{width:15px;height:15px;fill:var(--art-theme)}.art-video-player .art-layer-auto-playback .art-auto-playback-jump{color:var(--art-theme);cursor:pointer}.art-video-player.art-lock .art-subtitle{bottom:var(--art-subtitle-bottom)!important}.art-video-player.art-mini-progress-bar .art-bottom,.art-video-player.art-lock .art-bottom{opacity:1;background-image:none;padding:0}.art-video-player.art-mini-progress-bar .art-bottom .art-controls,.art-video-player.art-lock .art-bottom .art-controls,.art-video-player.art-mini-progress-bar .art-bottom .art-progress,.art-video-player.art-lock .art-bottom .art-progress{transform:translateY(calc(var(--art-control-height) + var(--art-bottom-gap) + var(--art-progress-height)/4))}.art-video-player.art-mini-progress-bar .art-bottom .art-progress-indicator,.art-video-player.art-lock .art-bottom .art-progress-indicator{display:none!important}.art-video-player.art-control-show .art-layer-lock{display:flex}.art-control-selector{justify-content:center;display:flex;position:relative}.art-control-selector .art-selector-list{text-align:center;border-radius:var(--art-border-radius);opacity:0;pointer-events:none;bottom:var(--art-control-height);max-height:var(--art-selector-max-height);background-color:var(--art-widget-background);transition:all var(--art-transition-duration)ease;flex-direction:column;align-items:center;display:flex;position:absolute;overflow:hidden auto;transform:translateY(10px)}.art-control-selector .art-selector-list .art-selector-item{flex-shrink:0;justify-content:center;align-items:center;width:100%;padding:10px 15px;line-height:1;display:flex}.art-control-selector .art-selector-list .art-selector-item:hover{background-color:#ffffff1a}.art-control-selector .art-selector-list .art-selector-item:hover,.art-control-selector .art-selector-list .art-selector-item.art-current{color:var(--art-theme)}.art-control-selector:hover .art-selector-list{opacity:1;pointer-events:auto;transform:translateY(0)}[class*=hint--]{font-style:normal;display:inline-block;position:relative}[class*=hint--]:before,[class*=hint--]:after{visibility:hidden;opacity:0;z-index:1000000;pointer-events:none;transition:all .3s;position:absolute;transform:translate(0,0)}[class*=hint--]:hover:before,[class*=hint--]:hover:after{visibility:visible;opacity:1;transition-delay:.1s}[class*=hint--]:before{content:"";z-index:1000001;background:0 0;border:6px solid #0000;position:absolute}[class*=hint--]:after{color:#fff;white-space:nowrap;background:#000;padding:8px 10px;font-family:Helvetica Neue,Helvetica,Arial,sans-serif;font-size:12px;line-height:12px}[class*=hint--][aria-label]:after{content:attr(aria-label)}[class*=hint--][data-hint]:after{content:attr(data-hint)}[aria-label=""]:before,[aria-label=""]:after,[data-hint=""]:before,[data-hint=""]:after{display:none!important}.hint--top-left:before,.hint--top-right:before,.hint--top:before{border-top-color:#000}.hint--bottom-left:before,.hint--bottom-right:before,.hint--bottom:before{border-bottom-color:#000}.hint--left:before{border-left-color:#000}.hint--right:before{border-right-color:#000}.hint--top:before{margin-bottom:-11px}.hint--top:before,.hint--top:after{bottom:100%;left:50%}.hint--top:before{left:calc(50% - 6px)}.hint--top:after{transform:translate(-50%)}.hint--top:hover:before{transform:translateY(-8px)}.hint--top:hover:after{transform:translate(-50%)translateY(-8px)}.hint--bottom:before{margin-top:-11px}.hint--bottom:before,.hint--bottom:after{top:100%;left:50%}.hint--bottom:before{left:calc(50% - 6px)}.hint--bottom:after{transform:translate(-50%)}.hint--bottom:hover:before{transform:translateY(8px)}.hint--bottom:hover:after{transform:translate(-50%)translateY(8px)}.hint--right:before{margin-bottom:-6px;margin-left:-11px}.hint--right:after{margin-bottom:-14px}.hint--right:before,.hint--right:after{bottom:50%;left:100%}.hint--right:hover:before,.hint--right:hover:after{transform:translate(8px)}.hint--left:before{margin-bottom:-6px;margin-right:-11px}.hint--left:after{margin-bottom:-14px}.hint--left:before,.hint--left:after{bottom:50%;right:100%}.hint--left:hover:before,.hint--left:hover:after{transform:translate(-8px)}.hint--top-left:before{margin-bottom:-11px}.hint--top-left:before,.hint--top-left:after{bottom:100%;left:50%}.hint--top-left:before{left:calc(50% - 6px)}.hint--top-left:after{margin-left:12px;transform:translate(-100%)}.hint--top-left:hover:before{transform:translateY(-8px)}.hint--top-left:hover:after{transform:translate(-100%)translateY(-8px)}.hint--top-right:before{margin-bottom:-11px}.hint--top-right:before,.hint--top-right:after{bottom:100%;left:50%}.hint--top-right:before{left:calc(50% - 6px)}.hint--top-right:after{margin-left:-12px;transform:translate(0)}.hint--top-right:hover:before,.hint--top-right:hover:after{transform:translateY(-8px)}.hint--bottom-left:before{margin-top:-11px}.hint--bottom-left:before,.hint--bottom-left:after{top:100%;left:50%}.hint--bottom-left:before{left:calc(50% - 6px)}.hint--bottom-left:after{margin-left:12px;transform:translate(-100%)}.hint--bottom-left:hover:before{transform:translateY(8px)}.hint--bottom-left:hover:after{transform:translate(-100%)translateY(8px)}.hint--bottom-right:before{margin-top:-11px}.hint--bottom-right:before,.hint--bottom-right:after{top:100%;left:50%}.hint--bottom-right:before{left:calc(50% - 6px)}.hint--bottom-right:after{margin-left:-12px;transform:translate(0)}.hint--bottom-right:hover:before,.hint--bottom-right:hover:after{transform:translateY(8px)}.hint--small:after,.hint--medium:after,.hint--large:after{white-space:normal;word-wrap:break-word;line-height:1.4em}.hint--small:after{width:80px}.hint--medium:after{width:150px}.hint--large:after{width:300px}[class*=hint--]:after{text-shadow:0 -1px #000;box-shadow:4px 4px 8px #0000004d}.hint--error:after{text-shadow:0 -1px #592726;background-color:#b34e4d}.hint--error.hint--top-left:before,.hint--error.hint--top-right:before,.hint--error.hint--top:before{border-top-color:#b34e4d}.hint--error.hint--bottom-left:before,.hint--error.hint--bottom-right:before,.hint--error.hint--bottom:before{border-bottom-color:#b34e4d}.hint--error.hint--left:before{border-left-color:#b34e4d}.hint--error.hint--right:before{border-right-color:#b34e4d}.hint--warning:after{text-shadow:0 -1px #6c5328;background-color:#c09854}.hint--warning.hint--top-left:before,.hint--warning.hint--top-right:before,.hint--warning.hint--top:before{border-top-color:#c09854}.hint--warning.hint--bottom-left:before,.hint--warning.hint--bottom-right:before,.hint--warning.hint--bottom:before{border-bottom-color:#c09854}.hint--warning.hint--left:before{border-left-color:#c09854}.hint--warning.hint--right:before{border-right-color:#c09854}.hint--info:after{text-shadow:0 -1px #1a3c4d;background-color:#3986ac}.hint--info.hint--top-left:before,.hint--info.hint--top-right:before,.hint--info.hint--top:before{border-top-color:#3986ac}.hint--info.hint--bottom-left:before,.hint--info.hint--bottom-right:before,.hint--info.hint--bottom:before{border-bottom-color:#3986ac}.hint--info.hint--left:before{border-left-color:#3986ac}.hint--info.hint--right:before{border-right-color:#3986ac}.hint--success:after{text-shadow:0 -1px #1a321a;background-color:#458746}.hint--success.hint--top-left:before,.hint--success.hint--top-right:before,.hint--success.hint--top:before{border-top-color:#458746}.hint--success.hint--bottom-left:before,.hint--success.hint--bottom-right:before,.hint--success.hint--bottom:before{border-bottom-color:#458746}.hint--success.hint--left:before{border-left-color:#458746}.hint--success.hint--right:before{border-right-color:#458746}.hint--always:after,.hint--always:before{opacity:1;visibility:visible}.hint--always.hint--top:before{transform:translateY(-8px)}.hint--always.hint--top:after{transform:translate(-50%)translateY(-8px)}.hint--always.hint--top-left:before{transform:translateY(-8px)}.hint--always.hint--top-left:after{transform:translate(-100%)translateY(-8px)}.hint--always.hint--top-right:before,.hint--always.hint--top-right:after{transform:translateY(-8px)}.hint--always.hint--bottom:before{transform:translateY(8px)}.hint--always.hint--bottom:after{transform:translate(-50%)translateY(8px)}.hint--always.hint--bottom-left:before{transform:translateY(8px)}.hint--always.hint--bottom-left:after{transform:translate(-100%)translateY(8px)}.hint--always.hint--bottom-right:before,.hint--always.hint--bottom-right:after{transform:translateY(8px)}.hint--always.hint--left:before,.hint--always.hint--left:after{transform:translate(-8px)}.hint--always.hint--right:before,.hint--always.hint--right:after{transform:translate(8px)}.hint--rounded:after{border-radius:4px}.hint--no-animate:before,.hint--no-animate:after{transition-duration:0s}.hint--bounce:before,.hint--bounce:after{-webkit-transition:opacity .3s,visibility .3s,-webkit-transform .3s cubic-bezier(.71,1.7,.77,1.24);-moz-transition:opacity .3s,visibility .3s,-moz-transform .3s cubic-bezier(.71,1.7,.77,1.24);transition:opacity .3s,visibility .3s,transform .3s cubic-bezier(.71,1.7,.77,1.24)}.hint--no-shadow:before,.hint--no-shadow:after{text-shadow:initial;box-shadow:initial}.hint--no-arrow:before{display:none}.art-video-player.art-mobile{--art-bottom-gap:10px;--art-control-height:38px;--art-control-icon-scale:1;--art-state-size:60px;--art-settings-max-height:180px;--art-selector-max-height:180px;--art-indicator-scale:1;--art-control-opacity:1}.art-video-player.art-mobile .art-controls-left{margin-left:calc(var(--art-padding)/-1)}.art-video-player.art-mobile .art-controls-right{margin-right:calc(var(--art-padding)/-1)}';
      }, {}], g7VGh: [function(e2, t, r, a) {
        t.exports = (function() {
          function e3(t3) {
            return (e3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(e4) {
              return typeof e4;
            } : function(e4) {
              return e4 && "function" == typeof Symbol && e4.constructor === Symbol && e4 !== Symbol.prototype ? "symbol" : typeof e4;
            })(t3);
          }
          var t2 = Object.prototype.toString, r2 = function(r3) {
            if (void 0 === r3) return "undefined";
            if (null === r3) return "null";
            var o2 = e3(r3);
            if ("boolean" === o2) return "boolean";
            if ("string" === o2) return "string";
            if ("number" === o2) return "number";
            if ("symbol" === o2) return "symbol";
            if ("function" === o2) return "GeneratorFunction" === a2(r3) ? "generatorfunction" : "function";
            if (Array.isArray ? Array.isArray(r3) : r3 instanceof Array) return "array";
            if (r3.constructor && "function" == typeof r3.constructor.isBuffer && r3.constructor.isBuffer(r3)) return "buffer";
            if ((function(e4) {
              try {
                if ("number" == typeof e4.length && "function" == typeof e4.callee) return true;
              } catch (e5) {
                if (-1 !== e5.message.indexOf("callee")) return true;
              }
              return false;
            })(r3)) return "arguments";
            if (r3 instanceof Date || "function" == typeof r3.toDateString && "function" == typeof r3.getDate && "function" == typeof r3.setDate) return "date";
            if (r3 instanceof Error || "string" == typeof r3.message && r3.constructor && "number" == typeof r3.constructor.stackTraceLimit) return "error";
            if (r3 instanceof RegExp || "string" == typeof r3.flags && "boolean" == typeof r3.ignoreCase && "boolean" == typeof r3.multiline && "boolean" == typeof r3.global) return "regexp";
            switch (a2(r3)) {
              case "Symbol":
                return "symbol";
              case "Promise":
                return "promise";
              case "WeakMap":
                return "weakmap";
              case "WeakSet":
                return "weakset";
              case "Map":
                return "map";
              case "Set":
                return "set";
              case "Int8Array":
                return "int8array";
              case "Uint8Array":
                return "uint8array";
              case "Uint8ClampedArray":
                return "uint8clampedarray";
              case "Int16Array":
                return "int16array";
              case "Uint16Array":
                return "uint16array";
              case "Int32Array":
                return "int32array";
              case "Uint32Array":
                return "uint32array";
              case "Float32Array":
                return "float32array";
              case "Float64Array":
                return "float64array";
            }
            if ("function" == typeof r3.throw && "function" == typeof r3.return && "function" == typeof r3.next) return "generator";
            switch (o2 = t2.call(r3)) {
              case "[object Object]":
                return "object";
              case "[object Map Iterator]":
                return "mapiterator";
              case "[object Set Iterator]":
                return "setiterator";
              case "[object String Iterator]":
                return "stringiterator";
              case "[object Array Iterator]":
                return "arrayiterator";
            }
            return o2.slice(8, -1).toLowerCase().replace(/\s/g, "");
          };
          function a2(e4) {
            return e4.constructor ? e4.constructor.name : null;
          }
          function o(e4, t3) {
            var a3 = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : ["option"];
            return i(e4, t3, a3), n(e4, t3, a3), (function(e5, t4, a4) {
              var s = r2(t4), l = r2(e5);
              if ("object" === s) {
                if ("object" !== l) throw Error("[Type Error]: '".concat(a4.join("."), "' require 'object' type, but got '").concat(l, "'"));
                Object.keys(t4).forEach(function(r3) {
                  var s2 = e5[r3], l2 = t4[r3], c = a4.slice();
                  c.push(r3), i(s2, l2, c), n(s2, l2, c), o(s2, l2, c);
                });
              }
              if ("array" === s) {
                if ("array" !== l) throw Error("[Type Error]: '".concat(a4.join("."), "' require 'array' type, but got '").concat(l, "'"));
                e5.forEach(function(r3, s2) {
                  var l2 = e5[s2], c = t4[s2] || t4[0], p = a4.slice();
                  p.push(s2), i(l2, c, p), n(l2, c, p), o(l2, c, p);
                });
              }
            })(e4, t3, a3), e4;
          }
          function i(e4, t3, a3) {
            if ("string" === r2(t3)) {
              var o2 = r2(e4);
              if ("?" === t3[0] && (t3 = t3.slice(1) + "|undefined"), !(-1 < t3.indexOf("|") ? t3.split("|").map(function(e5) {
                return e5.toLowerCase().trim();
              }).filter(Boolean).some(function(e5) {
                return o2 === e5;
              }) : t3.toLowerCase().trim() === o2)) throw Error("[Type Error]: '".concat(a3.join("."), "' require '").concat(t3, "' type, but got '").concat(o2, "'"));
            }
          }
          function n(e4, t3, a3) {
            if ("function" === r2(t3)) {
              var o2 = t3(e4, r2(e4), a3);
              if (true !== o2) {
                var i2 = r2(o2);
                throw "string" === i2 ? Error(o2) : "error" === i2 ? o2 : Error("[Validator Error]: The scheme for '".concat(a3.join("."), "' validator require return true, but got '").concat(o2, "'"));
              }
            }
          }
          return o.kindOf = r2, o;
        })();
      }, {}], lh3R5: [function(e2, t, r, a) {
        t.exports = JSON.parse('{"name":"artplayer","version":"5.3.0","description":"ArtPlayer.js is a modern and full featured HTML5 video player","author":"Harvey Zack <laozhaochaguan@gmail.com>","license":"MIT","homepage":"https://artplayer.org","repository":{"type":"git","url":"git+https://github.com/zhw2590582/ArtPlayer.git"},"bugs":{"url":"https://github.com/zhw2590582/ArtPlayer/issues"},"keywords":["html5","video","player"],"exports":{".":{"types":"./types/artplayer.d.ts","import":"./dist/artplayer.mjs","require":"./dist/artplayer.js"},"./legacy":{"types":"./types/artplayer.d.ts","import":"./dist/artplayer.legacy.js","require":"./dist/artplayer.legacy.js"},"./i18n/*":{"types":"./types/i18n.d.ts","import":"./dist/i18n/*.mjs","require":"./dist/i18n/*.js"}},"main":"./dist/artplayer.js","module":"./dist/artplayer.mjs","types":"./types/artplayer.d.ts","typesVersions":{"*":{"i18n/*":["types/i18n.d.ts"],"legacy":["types/artplayer.d.ts"]}},"legacy":"./dist/artplayer.legacy.js","browserslist":"last 1 Chrome version","dependencies":{"option-validator":"^2.0.6"}}');
      }, {}], eJfh8: [function(e2, t, r, a) {
        e2("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r), r.default = { properties: ["audioTracks", "autoplay", "buffered", "controller", "controls", "crossOrigin", "currentSrc", "currentTime", "defaultMuted", "defaultPlaybackRate", "duration", "ended", "error", "loop", "mediaGroup", "muted", "networkState", "paused", "playbackRate", "played", "preload", "readyState", "seekable", "seeking", "src", "startDate", "textTracks", "videoTracks", "volume"], methods: ["addTextTrack", "canPlayType", "load", "play", "pause"], events: ["abort", "canplay", "canplaythrough", "durationchange", "emptied", "ended", "error", "loadeddata", "loadedmetadata", "loadstart", "pause", "play", "playing", "progress", "ratechange", "seeked", "seeking", "stalled", "suspend", "timeupdate", "volumechange", "waiting"], prototypes: ["width", "height", "videoWidth", "videoHeight", "poster", "webkitDecodedFrameCount", "webkitDroppedFrameCount", "playsInline", "webkitSupportsFullscreen", "webkitDisplayingFullscreen", "onenterpictureinpicture", "onleavepictureinpicture", "disablePictureInPicture", "cancelVideoFrameCallback", "requestVideoFrameCallback", "getVideoPlaybackQuality", "requestPictureInPicture", "webkitEnterFullScreen", "webkitEnterFullscreen", "webkitExitFullScreen", "webkitExitFullscreen"] };
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], loqXi: [function(e2, t, r, a) {
        r.interopDefault = function(e3) {
          return e3 && e3.__esModule ? e3 : { default: e3 };
        }, r.defineInteropFlag = function(e3) {
          Object.defineProperty(e3, "__esModule", { value: true });
        }, r.exportAll = function(e3, t2) {
          return Object.keys(e3).forEach(function(r2) {
            "default" === r2 || "__esModule" === r2 || Object.prototype.hasOwnProperty.call(t2, r2) || Object.defineProperty(t2, r2, { enumerable: true, get: function() {
              return e3[r2];
            } });
          }), t2;
        }, r.export = function(e3, t2, r2) {
          Object.defineProperty(e3, t2, { enumerable: true, get: r2 });
        };
      }, {}], "9zso8": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("../utils"), n = e2("../utils/component"), s = o.interopDefault(n), l = e2("./aspectRatio"), c = o.interopDefault(l), p = e2("./close"), u = o.interopDefault(p), d = e2("./flip"), f = o.interopDefault(d), h = e2("./info"), m = o.interopDefault(h), g = e2("./playbackRate"), v = o.interopDefault(g), y = e2("./version"), b = o.interopDefault(y);
        class x extends s.default {
          constructor(e3) {
            super(e3), this.name = "contextmenu", this.$parent = e3.template.$contextmenu, i.isMobile || this.init();
          }
          init() {
            let { option: e3, proxy: t2, template: { $player: r2, $contextmenu: a2 } } = this.art;
            e3.playbackRate && this.add((0, v.default)({ name: "playbackRate", index: 10 })), e3.aspectRatio && this.add((0, c.default)({ name: "aspectRatio", index: 20 })), e3.flip && this.add((0, f.default)({ name: "flip", index: 30 })), this.add((0, m.default)({ name: "info", index: 40 })), this.add((0, b.default)({ name: "version", index: 50 })), this.add((0, u.default)({ name: "close", index: 60 }));
            for (let t3 = 0; t3 < e3.contextmenu.length; t3++) this.add(e3.contextmenu[t3]);
            t2(r2, "contextmenu", (e4) => {
              if (!this.art.constructor.CONTEXTMENU) return;
              e4.preventDefault(), this.show = true;
              let t3 = e4.clientX, o2 = e4.clientY, { height: n2, width: s2, left: l2, top: c2 } = (0, i.getRect)(r2), { height: p2, width: u2 } = (0, i.getRect)(a2), d2 = t3 - l2, f2 = o2 - c2;
              t3 + u2 > l2 + s2 && (d2 = s2 - u2), o2 + p2 > c2 + n2 && (f2 = n2 - p2), (0, i.setStyles)(a2, { top: `${f2}px`, left: `${d2}px` });
            }), t2(r2, "click", (e4) => {
              (0, i.includeFromEvent)(e4, a2) || (this.show = false);
            }), this.art.on("blur", () => {
              this.show = false;
            });
          }
        }
        r.default = x;
      }, { "../utils": "aBlEo", "../utils/component": "idCEj", "./aspectRatio": "6XHP2", "./close": "eF6AX", "./flip": "7Wg1P", "./info": "fjRnU", "./playbackRate": "hm1DY", "./version": "aJBeL", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], aBlEo: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("./compatibility");
        o.exportAll(i, r);
        var n = e2("./dom");
        o.exportAll(n, r);
        var s = e2("./error");
        o.exportAll(s, r);
        var l = e2("./file");
        o.exportAll(l, r);
        var c = e2("./format");
        o.exportAll(c, r);
        var p = e2("./property");
        o.exportAll(p, r);
        var u = e2("./subtitle");
        o.exportAll(u, r);
        var d = e2("./time");
        o.exportAll(d, r);
      }, { "./compatibility": "jg0yq", "./dom": "eANXw", "./error": "4FwTI", "./file": "i2JbS", "./format": "dy9GH", "./property": "jY49c", "./subtitle": "ke7ox", "./time": "f7gsx", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], jg0yq: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "userAgent", () => i), o.export(r, "isSafari", () => n), o.export(r, "isIOS", () => s), o.export(r, "isIOS13", () => l), o.export(r, "isMobile", () => c), o.export(r, "isBrowser", () => p);
        let i = globalThis?.CUSTOM_USER_AGENT ?? ("undefined" != typeof navigator ? navigator.userAgent : ""), n = /^(?:(?!chrome|android).)*safari/i.test(i), s = /iPad|iPhone|iPod/i.test(i) && !window.MSStream, l = s || i.includes("Macintosh") && navigator.maxTouchPoints >= 1, c = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(i) || l, p = "undefined" != typeof window && "undefined" != typeof document;
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], eANXw: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "query", () => n), o.export(r, "queryAll", () => s), o.export(r, "addClass", () => l), o.export(r, "removeClass", () => c), o.export(r, "hasClass", () => p), o.export(r, "append", () => u), o.export(r, "remove", () => d), o.export(r, "setStyle", () => f), o.export(r, "setStyles", () => h), o.export(r, "getStyle", () => m), o.export(r, "siblings", () => g), o.export(r, "inverseClass", () => v), o.export(r, "tooltip", () => y), o.export(r, "isInViewport", () => b), o.export(r, "includeFromEvent", () => x), o.export(r, "replaceElement", () => w), o.export(r, "createElement", () => j), o.export(r, "getIcon", () => k), o.export(r, "setStyleText", () => E), o.export(r, "supportsFlex", () => S), o.export(r, "getRect", () => $), o.export(r, "loadImg", () => M), o.export(r, "getComposedPath", () => I);
        var i = e2("./compatibility");
        function n(e3, t2 = document) {
          return t2.querySelector(e3);
        }
        function s(e3, t2 = document) {
          return Array.from(t2.querySelectorAll(e3));
        }
        function l(e3, t2) {
          return e3.classList.add(t2);
        }
        function c(e3, t2) {
          return e3.classList.remove(t2);
        }
        function p(e3, t2) {
          return e3.classList.contains(t2);
        }
        function u(e3, t2) {
          return t2 instanceof Element ? e3.appendChild(t2) : e3.insertAdjacentHTML("beforeend", String(t2)), e3.lastElementChild || e3.lastChild;
        }
        function d(e3) {
          return e3.parentNode.removeChild(e3);
        }
        function f(e3, t2, r2) {
          return e3.style[t2] = r2, e3;
        }
        function h(e3, t2) {
          for (let r2 in t2) f(e3, r2, t2[r2]);
          return e3;
        }
        function m(e3, t2, r2 = true) {
          let a2 = window.getComputedStyle(e3, null).getPropertyValue(t2);
          return r2 ? Number.parseFloat(a2) : a2;
        }
        function g(e3) {
          return Array.from(e3.parentElement.children).filter((t2) => t2 !== e3);
        }
        function v(e3, t2) {
          g(e3).forEach((e4) => c(e4, t2)), l(e3, t2);
        }
        function y(e3, t2, r2 = "top") {
          i.isMobile || (e3.setAttribute("aria-label", t2), l(e3, "hint--rounded"), l(e3, `hint--${r2}`));
        }
        function b(e3, t2 = 0) {
          let r2 = e3.getBoundingClientRect(), a2 = window.innerHeight || document.documentElement.clientHeight, o2 = window.innerWidth || document.documentElement.clientWidth, i2 = r2.top - t2 <= a2 && r2.top + r2.height + t2 >= 0, n2 = r2.left - t2 <= o2 + t2 && r2.left + r2.width + t2 >= 0;
          return i2 && n2;
        }
        function x(e3, t2) {
          return I(e3).includes(t2);
        }
        function w(e3, t2) {
          return t2.parentNode.replaceChild(e3, t2), e3;
        }
        function j(e3) {
          return document.createElement(e3);
        }
        function k(e3 = "", t2 = "") {
          let r2 = j("i");
          return l(r2, "art-icon"), l(r2, `art-icon-${e3}`), u(r2, t2), r2;
        }
        function E(e3, t2) {
          let r2 = document.getElementById(e3);
          r2 || ((r2 = document.createElement("style")).id = e3, "loading" === document.readyState ? document.addEventListener("DOMContentLoaded", () => {
            document.head.appendChild(r2);
          }) : (document.head || document.documentElement).appendChild(r2)), r2.textContent = t2;
        }
        function S() {
          let e3 = document.createElement("div");
          return e3.style.display = "flex", "flex" === e3.style.display;
        }
        function $(e3) {
          return e3.getBoundingClientRect();
        }
        function M(e3, t2) {
          return new Promise((r2, a2) => {
            let o2 = new Image();
            o2.onload = function() {
              if (t2 && 1 !== t2) {
                let i2 = document.createElement("canvas"), n2 = i2.getContext("2d");
                i2.width = o2.width * t2, i2.height = o2.height * t2, n2.drawImage(o2, 0, 0, i2.width, i2.height), i2.toBlob((t3) => {
                  let o3 = URL.createObjectURL(t3), i3 = new Image();
                  i3.onload = function() {
                    r2(i3);
                  }, i3.onerror = function() {
                    URL.revokeObjectURL(o3), a2(Error(`Image load failed: ${e3}`));
                  }, i3.src = o3;
                });
              } else r2(o2);
            }, o2.onerror = function() {
              a2(Error(`Image load failed: ${e3}`));
            }, o2.src = e3;
          });
        }
        function I(e3) {
          if (e3.composedPath) return e3.composedPath();
          let t2 = [], r2 = e3.target;
          for (; r2; ) t2.push(r2), r2 = r2.parentNode;
          return t2.includes(window) || void 0 === window || t2.push(window), t2;
        }
      }, { "./compatibility": "jg0yq", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "4FwTI": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "ArtPlayerError", () => i), o.export(r, "errorHandle", () => n);
        class i extends Error {
          constructor(e3, t2) {
            super(e3), "function" == typeof Error.captureStackTrace && Error.captureStackTrace(this, t2 || this.constructor), this.name = "ArtPlayerError";
          }
        }
        function n(e3, t2) {
          if (!e3) throw new i(t2);
          return e3;
        }
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], i2JbS: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3, t2) {
          let r2 = document.createElement("a");
          r2.style.display = "none", r2.href = e3, r2.download = t2, document.body.appendChild(r2), r2.click(), document.body.removeChild(r2);
        }
        o.defineInteropFlag(r), o.export(r, "getExt", () => function e3(t2) {
          return t2.includes("?") ? e3(t2.split("?")[0]) : t2.includes("#") ? e3(t2.split("#")[0]) : t2.trim().toLowerCase().split(".").pop();
        }), o.export(r, "download", () => i);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], dy9GH: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3, t2, r2) {
          return Math.max(Math.min(e3, Math.max(t2, r2)), Math.min(t2, r2));
        }
        function n(e3) {
          return e3.charAt(0).toUpperCase() + e3.slice(1);
        }
        function s(e3) {
          if (!e3) return "00:00";
          let t2 = Math.floor(e3 / 3600), r2 = Math.floor((e3 - 3600 * t2) / 60), a2 = Math.floor(e3 - 3600 * t2 - 60 * r2);
          return (t2 > 0 ? [t2, r2, a2] : [r2, a2]).map((e4) => e4 < 10 ? `0${e4}` : String(e4)).join(":");
        }
        function l(e3) {
          return e3.replace(/[&<>'"]/g, (e4) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[e4] || e4);
        }
        function c(e3) {
          let t2 = { "&amp;": "&", "&lt;": "<", "&gt;": ">", "&#39;": "'", "&quot;": '"' }, r2 = RegExp(`(${Object.keys(t2).join("|")})`, "g");
          return e3.replace(r2, (e4) => t2[e4] || e4);
        }
        o.defineInteropFlag(r), o.export(r, "clamp", () => i), o.export(r, "capitalize", () => n), o.export(r, "secondToTime", () => s), o.export(r, "escape", () => l), o.export(r, "unescape", () => c);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], jY49c: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "def", () => i), o.export(r, "has", () => s), o.export(r, "get", () => l), o.export(r, "mergeDeep", () => function e3(...t2) {
          let r2 = (e4) => e4 && "object" == typeof e4 && !Array.isArray(e4);
          return t2.reduce((t3, a2) => (Object.keys(a2).forEach((o2) => {
            let i2 = t3[o2], n2 = a2[o2];
            Array.isArray(i2) && Array.isArray(n2) ? t3[o2] = i2.concat(...n2) : r2(i2) && r2(n2) ? t3[o2] = e3(i2, n2) : t3[o2] = n2;
          }), t3), {});
        });
        let i = Object.defineProperty, { hasOwnProperty: n } = Object.prototype;
        function s(e3, t2) {
          return n.call(e3, t2);
        }
        function l(e3, t2) {
          return Object.getOwnPropertyDescriptor(e3, t2);
        }
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], ke7ox: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3) {
          return "WEBVTT \r\n\r\n".concat(e3.replace(/(\d\d:\d\d:\d\d)[,.](\d+)/g, (e4, t2, r2) => {
            let a2 = r2.slice(0, 3);
            return 1 === r2.length && (a2 = `${r2}00`), 2 === r2.length && (a2 = `${r2}0`), `${t2},${a2}`;
          }).replace(/\{\\([ibu])\}/g, "</$1>").replace(/\{\\([ibu])1\}/g, "<$1>").replace(/\{([ibu])\}/g, "<$1>").replace(/\{\/([ibu])\}/g, "</$1>").replace(/(\d\d:\d\d:\d\d),(\d\d\d)/g, "$1.$2").replace(/\{[\s\S]*?\}/g, "").concat("\r\n\r\n"));
        }
        function n(e3) {
          return URL.createObjectURL(new Blob([e3], { type: "text/vtt" }));
        }
        function s(e3) {
          let t2 = RegExp("Dialogue:\\s\\d,(\\d+:\\d\\d:\\d\\d.\\d\\d),(\\d+:\\d\\d:\\d\\d.\\d\\d),([^,]*),([^,]*),(?:[^,]*,){4}([\\s\\S]*)$", "i");
          function r2(e4 = "") {
            return e4.split(/[:.]/).map((e5, t3, r3) => {
              if (t3 === r3.length - 1) {
                if (1 === e5.length) return `.${e5}00`;
                if (2 === e5.length) return `.${e5}0`;
              } else if (1 === e5.length) return (0 === t3 ? "0" : ":0") + e5;
              return 0 === t3 ? e5 : t3 === r3.length - 1 ? `.${e5}` : `:${e5}`;
            }).join("");
          }
          return `WEBVTT ${e3.split(/\r?\n/).map((e4) => {
          let a2 = e4.match(t2);
          return a2 ? { start: r2(a2[1].trim()), end: r2(a2[2].trim()), text: a2[5].replace(/\{[\s\S]*?\}/g, "").replace(/(\\N)/g, "\n").trim().split(/\r?\n/).map((e5) => e5.trim()).join("\n") } : null;
        }).filter((e4) => e4).map((e4, t3) => e4 ? `${t3 + 1} ${e4.start} --> ${e4.end} ${e4.text}` : "").filter((e4) => e4.trim()).join("\n\n")}`;
        }
        o.defineInteropFlag(r), o.export(r, "srtToVtt", () => i), o.export(r, "vttToBlob", () => n), o.export(r, "assToVtt", () => s);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], f7gsx: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3 = 0) {
          return new Promise((t2) => setTimeout(t2, e3));
        }
        function n(e3, t2) {
          let r2;
          return function(...a2) {
            let o2 = () => (r2 = null, e3.apply(this, a2));
            clearTimeout(r2), r2 = setTimeout(o2, t2);
          };
        }
        function s(e3, t2) {
          let r2 = false;
          return function(...a2) {
            r2 || (e3.apply(this, a2), r2 = true, setTimeout(() => {
              r2 = false;
            }, t2));
          };
        }
        o.defineInteropFlag(r), o.export(r, "sleep", () => i), o.export(r, "debounce", () => n), o.export(r, "throttle", () => s);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], idCEj: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("option-validator"), n = o.interopDefault(i), s = e2("../scheme"), l = e2("./dom"), c = e2("./error");
        r.default = class {
          constructor(e3) {
            this.id = 0, this.art = e3, this.cache = new Map(), this.add = this.add.bind(this), this.remove = this.remove.bind(this), this.update = this.update.bind(this);
          }
          get show() {
            return (0, l.hasClass)(this.art.template.$player, `art-${this.name}-show`);
          }
          set show(e3) {
            let { $player: t2 } = this.art.template, r2 = `art-${this.name}-show`;
            e3 ? (0, l.addClass)(t2, r2) : (0, l.removeClass)(t2, r2), this.art.emit(this.name, e3);
          }
          toggle() {
            this.show = !this.show;
          }
          add(e3) {
            let t2 = "function" == typeof e3 ? e3(this.art) : e3;
            if (t2.html = t2.html || "", (0, n.default)(t2, s.ComponentOption), !this.$parent || !this.name || t2.disable) return;
            let r2 = t2.name || `${this.name}${this.id}`, a2 = this.cache.get(r2);
            (0, c.errorHandle)(!a2, `Can't add an existing [${r2}] to the [${this.name}]`), this.id += 1;
            let o2 = (0, l.createElement)("div");
            (0, l.addClass)(o2, `art-${this.name}`), (0, l.addClass)(o2, `art-${this.name}-${r2}`);
            let i2 = Array.from(this.$parent.children);
            o2.dataset.index = t2.index || this.id;
            let p = i2.find((e4) => Number(e4.dataset.index) >= Number(o2.dataset.index));
            p ? p.insertAdjacentElement("beforebegin", o2) : (0, l.append)(this.$parent, o2), t2.html && (0, l.append)(o2, t2.html), t2.style && (0, l.setStyles)(o2, t2.style), t2.tooltip && (0, l.tooltip)(o2, t2.tooltip);
            let u = [];
            if (t2.click) {
              let e4 = this.art.events.proxy(o2, "click", (e5) => {
                e5.preventDefault(), t2.click.call(this.art, this, e5);
              });
              u.push(e4);
            }
            return t2.selector && ["left", "right"].includes(t2.position) && this.selector(t2, o2, u), this[r2] = o2, this.cache.set(r2, { $ref: o2, events: u, option: t2 }), t2.mounted && t2.mounted.call(this.art, o2), o2;
          }
          remove(e3) {
            let t2 = this.cache.get(e3);
            (0, c.errorHandle)(t2, `Can't find [${e3}] from the [${this.name}]`), t2.option.beforeUnmount && t2.option.beforeUnmount.call(this.art, t2.$ref);
            for (let e4 = 0; e4 < t2.events.length; e4++) this.art.events.remove(t2.events[e4]);
            this.cache.delete(e3), delete this[e3], (0, l.remove)(t2.$ref);
          }
          update(e3) {
            let t2 = this.cache.get(e3.name);
            return t2 && (e3 = Object.assign(t2.option, e3), this.remove(e3.name)), this.add(e3);
          }
        };
      }, { "option-validator": "g7VGh", "../scheme": "biLjm", "./dom": "eANXw", "./error": "4FwTI", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], biLjm: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "ComponentOption", () => f);
        var i = e2("../utils");
        let n = "array", s = "boolean", l = "string", c = "number", p = "object", u = "function";
        function d(e3, t2, r2) {
          return (0, i.errorHandle)(t2 === l || t2 === c || e3 instanceof Element, `${r2.join(".")} require '${l}' or 'Element' type`);
        }
        let f = { html: d, disable: `?${s}`, name: `?${l}`, index: `?${c}`, style: `?${p}`, click: `?${u}`, mounted: `?${u}`, tooltip: `?${l}|${c}`, width: `?${c}`, selector: `?${n}`, onSelect: `?${u}`, switch: `?${s}`, onSwitch: `?${u}`, range: `?${n}`, onRange: `?${u}`, onChange: `?${u}` };
        r.default = { id: l, container: d, url: l, poster: l, type: l, theme: l, lang: l, volume: c, isLive: s, muted: s, autoplay: s, autoSize: s, autoMini: s, loop: s, flip: s, playbackRate: s, aspectRatio: s, screenshot: s, setting: s, hotkey: s, pip: s, mutex: s, backdrop: s, fullscreen: s, fullscreenWeb: s, subtitleOffset: s, miniProgressBar: s, useSSR: s, playsInline: s, lock: s, gesture: s, fastForward: s, autoPlayback: s, autoOrientation: s, airplay: s, proxy: `?${u}`, plugins: [u], layers: [f], contextmenu: [f], settings: [f], controls: [{ ...f, position: (e3, t2, r2) => {
          let a2 = ["top", "left", "right"];
          return (0, i.errorHandle)(a2.includes(e3), `${r2.join(".")} only accept ${a2.toString()} as parameters`);
        } }], quality: [{ default: `?${s}`, html: l, url: l }], highlight: [{ time: c, text: l }], thumbnails: { url: l, number: c, column: c, width: c, height: c, scale: c }, subtitle: { url: l, name: l, type: l, style: p, escape: s, encoding: l, onVttLoad: u }, moreVideoAttr: p, i18n: p, icons: p, cssVar: p, customType: p };
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "6XHP2": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => {
            let { i18n: r2, constructor: { ASPECT_RATIO: a2 } } = t2, o2 = a2.map((e4) => `<span data-value="${e4}">${"default" === e4 ? r2.get("Default") : e4}</span>`).join("");
            return { ...e3, html: `${r2.get("Aspect Ratio")}: ${o2}`, click: (e4, r3) => {
              let { value: a3 } = r3.target.dataset;
              a3 && (t2.aspectRatio = a3, e4.show = false);
            }, mounted: (e4) => {
              let r3 = (0, i.query)('[data-value="default"]', e4);
              r3 && (0, i.inverseClass)(r3, "art-current"), t2.on("aspectRatio", (t3) => {
                let r4 = (0, i.queryAll)("span", e4).find((e5) => e5.dataset.value === t3);
                r4 && (0, i.inverseClass)(r4, "art-current");
              });
            } };
          };
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], eF6AX: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3) {
          return (t2) => ({ ...e3, html: t2.i18n.get("Close"), click: (e4) => {
            e4.show = false;
          } });
        }
        o.defineInteropFlag(r), o.export(r, "default", () => i);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "7Wg1P": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => {
            let { i18n: r2, constructor: { FLIP: a2 } } = t2, o2 = a2.map((e4) => `<span data-value="${e4}">${r2.get((0, i.capitalize)(e4))}</span>`).join("");
            return { ...e3, html: `${r2.get("Video Flip")}: ${o2}`, click: (e4, r3) => {
              let { value: a3 } = r3.target.dataset;
              a3 && (t2.flip = a3.toLowerCase(), e4.show = false);
            }, mounted: (e4) => {
              let r3 = (0, i.query)('[data-value="normal"]', e4);
              r3 && (0, i.inverseClass)(r3, "art-current"), t2.on("flip", (t3) => {
                let r4 = (0, i.queryAll)("span", e4).find((e5) => e5.dataset.value === t3);
                r4 && (0, i.inverseClass)(r4, "art-current");
              });
            } };
          };
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], fjRnU: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3) {
          return (t2) => ({ ...e3, html: t2.i18n.get("Video Info"), click: (e4) => {
            t2.info.show = true, e4.show = false;
          } });
        }
        o.defineInteropFlag(r), o.export(r, "default", () => i);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], hm1DY: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => {
            let { i18n: r2, constructor: { PLAYBACK_RATE: a2 } } = t2, o2 = a2.map((e4) => `<span data-value="${e4}">${1 === e4 ? r2.get("Normal") : e4.toFixed(1)}</span>`).join("");
            return { ...e3, html: `${r2.get("Play Speed")}: ${o2}`, click: (e4, r3) => {
              let { value: a3 } = r3.target.dataset;
              a3 && (t2.playbackRate = Number(a3), e4.show = false);
            }, mounted: (e4) => {
              let r3 = (0, i.query)('[data-value="1"]', e4);
              r3 && (0, i.inverseClass)(r3, "art-current"), t2.on("video:ratechange", () => {
                let r4 = (0, i.queryAll)("span", e4).find((e5) => Number(e5.dataset.value) === t2.playbackRate);
                r4 && (0, i.inverseClass)(r4, "art-current");
              });
            } };
          };
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], aJBeL: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => function(e3) {
          return { ...e3, html: `<a href="https://artplayer.org" target="_blank">ArtPlayer ${i.version}</a>` };
        });
        var i = e2("../../package.json");
      }, { "../../package.json": "lh3R5", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], dp1yk: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("../utils"), n = e2("../utils/component"), s = o.interopDefault(n), l = e2("./airplay"), c = o.interopDefault(l), p = e2("./fullscreen"), u = o.interopDefault(p), d = e2("./fullscreenWeb"), f = o.interopDefault(d), h = e2("./pip"), m = o.interopDefault(h), g = e2("./playAndPause"), v = o.interopDefault(g), y = e2("./progress"), b = o.interopDefault(y), x = e2("./screenshot"), w = o.interopDefault(x), j = e2("./setting"), k = o.interopDefault(j), E = e2("./time"), S = o.interopDefault(E), $ = e2("./volume"), M = o.interopDefault($);
        class I extends s.default {
          constructor(e3) {
            super(e3), this.isHover = false, this.name = "control", this.timer = Date.now();
            let { constructor: t2 } = e3, { $player: r2, $bottom: a2 } = this.art.template;
            e3.on("mousemove", () => {
              i.isMobile || (this.show = true);
            }), e3.on("click", () => {
              i.isMobile ? this.toggle() : this.show = true;
            }), e3.on("document:mousemove", (e4) => {
              this.isHover = (0, i.includeFromEvent)(e4, a2);
            }), e3.on("video:timeupdate", () => {
              !e3.setting.show && !this.isHover && !e3.isInput && e3.playing && this.show && Date.now() - this.timer >= t2.CONTROL_HIDE_TIME && (this.show = false);
            }), e3.on("control", (e4) => {
              e4 ? ((0, i.removeClass)(r2, "art-hide-cursor"), (0, i.addClass)(r2, "art-hover"), this.timer = Date.now()) : ((0, i.addClass)(r2, "art-hide-cursor"), (0, i.removeClass)(r2, "art-hover"));
            }), this.init();
          }
          init() {
            let { option: e3 } = this.art;
            e3.isLive || this.add((0, b.default)({ name: "progress", position: "top", index: 10 })), this.add({ name: "thumbnails", position: "top", index: 20 }), this.add((0, v.default)({ name: "playAndPause", position: "left", index: 10 })), this.add((0, M.default)({ name: "volume", position: "left", index: 20 })), e3.isLive || this.add((0, S.default)({ name: "time", position: "left", index: 30 })), e3.quality.length && (0, i.sleep)().then(() => {
              this.art.quality = e3.quality;
            }), e3.screenshot && !i.isMobile && this.add((0, w.default)({ name: "screenshot", position: "right", index: 20 })), e3.setting && this.add((0, k.default)({ name: "setting", position: "right", index: 30 })), e3.pip && this.add((0, m.default)({ name: "pip", position: "right", index: 40 })), e3.airplay && window.WebKitPlaybackTargetAvailabilityEvent && this.add((0, c.default)({ name: "airplay", position: "right", index: 50 })), e3.fullscreenWeb && this.add((0, f.default)({ name: "fullscreenWeb", position: "right", index: 60 })), e3.fullscreen && this.add((0, u.default)({ name: "fullscreen", position: "right", index: 70 }));
            for (let t2 = 0; t2 < e3.controls.length; t2++) this.add(e3.controls[t2]);
          }
          add(e3) {
            let t2 = "function" == typeof e3 ? e3(this.art) : e3, { $progress: r2, $controlsLeft: a2, $controlsRight: o2 } = this.art.template;
            switch (t2.position) {
              case "top":
                this.$parent = r2;
                break;
              case "left":
                this.$parent = a2;
                break;
              case "right":
                this.$parent = o2;
                break;
              default:
                (0, i.errorHandle)(false, "Control option.position must one of 'top', 'left', 'right'");
            }
            super.add(t2);
          }
          check(e3) {
            e3.$control_value.innerHTML = e3.html;
            for (let t2 = 0; t2 < e3.$control_option.length; t2++) {
              let r2 = e3.$control_option[t2];
              r2.default = r2 === e3, r2.default && (0, i.inverseClass)(r2.$control_item, "art-current");
            }
          }
          selector(e3, t2, r2) {
            let { proxy: a2 } = this.art.events;
            (0, i.addClass)(t2, "art-control-selector");
            let o2 = (0, i.createElement)("div");
            (0, i.addClass)(o2, "art-selector-value"), (0, i.append)(o2, e3.html), t2.textContent = "", (0, i.append)(t2, o2);
            let n2 = (0, i.createElement)("div");
            (0, i.addClass)(n2, "art-selector-list"), (0, i.append)(t2, n2);
            for (let t3 = 0; t3 < e3.selector.length; t3++) {
              let r3 = e3.selector[t3], a3 = (0, i.createElement)("div");
              (0, i.addClass)(a3, "art-selector-item"), r3.default && (0, i.addClass)(a3, "art-current"), a3.dataset.index = t3, a3.dataset.value = r3.value, a3.innerHTML = r3.html, (0, i.append)(n2, a3), (0, i.def)(r3, "$control_option", { get: () => e3.selector }), (0, i.def)(r3, "$control_item", { get: () => a3 }), (0, i.def)(r3, "$control_value", { get: () => o2 });
            }
            let s2 = a2(n2, "click", async (t3) => {
              let r3 = (0, i.getComposedPath)(t3), a3 = e3.selector.find((e4) => e4.$control_item === r3.find((t4) => e4.$control_item === t4));
              this.check(a3), e3.onSelect && (o2.innerHTML = await e3.onSelect.call(this.art, a3, a3.$control_item, t3));
            });
            r2.push(s2);
          }
        }
        r.default = I;
      }, { "../utils": "aBlEo", "../utils/component": "idCEj", "./airplay": "amOzz", "./fullscreen": "3GuBU", "./fullscreenWeb": "jj1KV", "./pip": "jMeHN", "./playAndPause": "u3h8M", "./progress": "1XZSS", "./screenshot": "dIscA", "./setting": "aqA0g", "./time": "ihweO", "./volume": "fJVWn", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], amOzz: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => ({ ...e3, tooltip: t2.i18n.get("AirPlay"), mounted: (e4) => {
            let { proxy: r2, icons: a2 } = t2;
            (0, i.append)(e4, a2.airplay), r2(e4, "click", () => t2.airplay());
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "3GuBU": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => ({ ...e3, tooltip: t2.i18n.get("Fullscreen"), mounted: (e4) => {
            let { proxy: r2, icons: a2, i18n: o2 } = t2, n2 = (0, i.append)(e4, a2.fullscreenOn), s = (0, i.append)(e4, a2.fullscreenOff);
            (0, i.setStyle)(s, "display", "none"), r2(e4, "click", () => {
              t2.fullscreen = !t2.fullscreen;
            }), t2.on("fullscreen", (t3) => {
              t3 ? ((0, i.tooltip)(e4, o2.get("Exit Fullscreen")), (0, i.setStyle)(n2, "display", "none"), (0, i.setStyle)(s, "display", "inline-flex")) : ((0, i.tooltip)(e4, o2.get("Fullscreen")), (0, i.setStyle)(n2, "display", "inline-flex"), (0, i.setStyle)(s, "display", "none"));
            });
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], jj1KV: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => ({ ...e3, tooltip: t2.i18n.get("Web Fullscreen"), mounted: (e4) => {
            let { proxy: r2, icons: a2, i18n: o2 } = t2, n2 = (0, i.append)(e4, a2.fullscreenWebOn), s = (0, i.append)(e4, a2.fullscreenWebOff);
            (0, i.setStyle)(s, "display", "none"), r2(e4, "click", () => {
              t2.fullscreenWeb = !t2.fullscreenWeb;
            }), t2.on("fullscreenWeb", (t3) => {
              t3 ? ((0, i.tooltip)(e4, o2.get("Exit Web Fullscreen")), (0, i.setStyle)(n2, "display", "none"), (0, i.setStyle)(s, "display", "inline-flex")) : ((0, i.tooltip)(e4, o2.get("Web Fullscreen")), (0, i.setStyle)(n2, "display", "inline-flex"), (0, i.setStyle)(s, "display", "none"));
            });
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], jMeHN: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => ({ ...e3, tooltip: t2.i18n.get("PIP Mode"), mounted: (e4) => {
            let { proxy: r2, icons: a2, i18n: o2 } = t2;
            (0, i.append)(e4, a2.pip), r2(e4, "click", () => {
              t2.pip = !t2.pip;
            }), t2.on("pip", (t3) => {
              (0, i.tooltip)(e4, o2.get(t3 ? "Exit PIP Mode" : "PIP Mode"));
            });
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], u3h8M: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => ({ ...e3, mounted: (e4) => {
            let { proxy: r2, icons: a2, i18n: o2 } = t2, n2 = (0, i.append)(e4, a2.play), s = (0, i.append)(e4, a2.pause);
            function l() {
              (0, i.setStyle)(n2, "display", "flex"), (0, i.setStyle)(s, "display", "none");
            }
            function c() {
              (0, i.setStyle)(n2, "display", "none"), (0, i.setStyle)(s, "display", "flex");
            }
            (0, i.tooltip)(n2, o2.get("Play")), (0, i.tooltip)(s, o2.get("Pause")), r2(n2, "click", () => {
              t2.play();
            }), r2(s, "click", () => {
              t2.pause();
            }), t2.playing ? c() : l(), t2.on("video:playing", () => {
              c();
            }), t2.on("video:pause", () => {
              l();
            });
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "1XZSS": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "getPosFromEvent", () => n), o.export(r, "setCurrentTime", () => s), o.export(r, "default", () => l);
        var i = e2("../utils");
        function n(e3, t2) {
          let { $progress: r2 } = e3.template, { left: a2 } = (0, i.getRect)(r2), o2 = i.isMobile ? t2.touches[0].clientX : t2.clientX, n2 = (0, i.clamp)(o2 - a2, 0, r2.clientWidth), s2 = n2 / r2.clientWidth * e3.duration, l2 = (0, i.secondToTime)(s2), c = (0, i.clamp)(n2 / r2.clientWidth, 0, 1);
          return { second: s2, time: l2, width: n2, percentage: c };
        }
        function s(e3, t2) {
          if (e3.isRotate) {
            let r2 = t2.touches[0].clientY / e3.height, a2 = r2 * e3.duration;
            e3.emit("setBar", "played", r2, t2), e3.seek = a2;
          } else {
            let { second: r2, percentage: a2 } = n(e3, t2);
            e3.emit("setBar", "played", a2, t2), e3.seek = r2;
          }
        }
        function l(e3) {
          return (t2) => {
            let { icons: r2, option: a2, proxy: o2 } = t2;
            return { ...e3, html: `<div class="art-control-progress-inner"><div class="art-progress-hover"></div><div class="art-progress-loaded"></div><div class="art-progress-played"></div><div class="art-progress-highlight"></div><div class="art-progress-indicator"></div><div class="art-progress-tip"></div></div>`, mounted: (e4) => {
              let l2 = null, c = false, p = (0, i.query)(".art-progress-hover", e4), u = (0, i.query)(".art-progress-loaded", e4), d = (0, i.query)(".art-progress-played", e4), f = (0, i.query)(".art-progress-highlight", e4), h = (0, i.query)(".art-progress-indicator", e4), m = (0, i.query)(".art-progress-tip", e4);
              function g(r3, a3) {
                let { width: o3, time: s2 } = a3 || n(t2, r3);
                m.textContent = s2;
                let l3 = m.clientWidth;
                o3 <= l3 / 2 ? (0, i.setStyle)(m, "left", 0) : o3 > e4.clientWidth - l3 / 2 ? (0, i.setStyle)(m, "left", `${e4.clientWidth - l3}px`) : (0, i.setStyle)(m, "left", `${o3 - l3 / 2}px`);
              }
              r2.indicator ? (0, i.append)(h, r2.indicator) : (0, i.setStyle)(h, "backgroundColor", "var(--art-theme)"), t2.on("setBar", function(r3, a3, o3) {
                let n2 = "played" === r3 && o3 && i.isMobile;
                "loaded" === r3 && (0, i.setStyle)(u, "width", `${100 * a3}%`), "hover" === r3 && (0, i.setStyle)(p, "width", `${100 * a3}%`), "played" === r3 && ((0, i.setStyle)(d, "width", `${100 * a3}%`), (0, i.setStyle)(h, "left", `${100 * a3}%`)), n2 && ((0, i.setStyle)(m, "display", "flex"), g(o3, { width: e4.clientWidth * a3, time: (0, i.secondToTime)(a3 * t2.duration) }), clearTimeout(l2), l2 = setTimeout(() => {
                  (0, i.setStyle)(m, "display", "none");
                }, 500));
              }), t2.on("video:loadedmetadata", function() {
                f.textContent = "";
                for (let e5 = 0; e5 < a2.highlight.length; e5++) {
                  let r3 = a2.highlight[e5], o3 = (0, i.clamp)(r3.time, 0, t2.duration) / t2.duration * 100, n2 = `<span data-text="${r3.text}" data-time="${r3.time}" style="left: ${o3}%"></span>`;
                  (0, i.append)(f, n2);
                }
              }), t2.constructor.USE_RAF ? t2.on("raf", () => {
                t2.emit("setBar", "played", t2.played), t2.emit("setBar", "loaded", t2.loaded);
              }) : (t2.on("video:timeupdate", () => {
                t2.emit("setBar", "played", t2.played);
              }), t2.on("video:progress", () => {
                t2.emit("setBar", "loaded", t2.loaded);
              }), t2.on("video:ended", () => {
                t2.emit("setBar", "played", 1);
              })), t2.emit("setBar", "loaded", t2.loaded || 0), i.isMobile || (o2(e4, "click", (e5) => {
                e5.target !== h && s(t2, e5);
              }), o2(e4, "mousemove", (r3) => {
                let { percentage: a3 } = n(t2, r3);
                if (t2.emit("setBar", "hover", a3, r3), (0, i.setStyle)(m, "display", "flex"), (0, i.includeFromEvent)(r3, f)) {
                  let { width: a4 } = n(t2, r3), { text: o3 } = r3.target.dataset;
                  m.textContent = o3;
                  let s2 = m.clientWidth;
                  a4 <= s2 / 2 ? (0, i.setStyle)(m, "left", 0) : a4 > e4.clientWidth - s2 / 2 ? (0, i.setStyle)(m, "left", `${e4.clientWidth - s2}px`) : (0, i.setStyle)(m, "left", `${a4 - s2 / 2}px`);
                } else g(r3);
              }), o2(e4, "mouseleave", (e5) => {
                (0, i.setStyle)(m, "display", "none"), t2.emit("setBar", "hover", 0, e5);
              }), o2(e4, "mousedown", (e5) => {
                c = 0 === e5.button;
              }), t2.on("document:mousemove", (e5) => {
                if (c) {
                  let { second: r3, percentage: a3 } = n(t2, e5);
                  t2.emit("setBar", "played", a3, e5), t2.seek = r3;
                }
              }), t2.on("document:mouseup", () => {
                c && (c = false);
              }));
            } };
          };
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], dIscA: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => ({ ...e3, tooltip: t2.i18n.get("Screenshot"), mounted: (e4) => {
            let { proxy: r2, icons: a2 } = t2;
            (0, i.append)(e4, a2.screenshot), r2(e4, "click", () => {
              t2.screenshot();
            });
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], aqA0g: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => ({ ...e3, tooltip: t2.i18n.get("Show Setting"), mounted: (e4) => {
            let { proxy: r2, icons: a2, i18n: o2 } = t2;
            (0, i.append)(e4, a2.setting), r2(e4, "click", () => {
              t2.setting.toggle(), t2.setting.resize();
            }), t2.on("setting", (t3) => {
              (0, i.tooltip)(e4, o2.get(t3 ? "Hide Setting" : "Show Setting"));
            });
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], ihweO: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => ({ ...e3, style: i.isMobile ? { fontSize: "12px", padding: "0 5px" } : { cursor: "auto", padding: "0 10px" }, mounted: (e4) => {
            function r2() {
              let r3 = `${(0, i.secondToTime)(t2.currentTime)} / ${(0, i.secondToTime)(t2.duration)}`;
              r3 !== e4.textContent && (e4.textContent = r3);
            }
            r2();
            let a2 = ["video:loadedmetadata", "video:timeupdate", "video:progress"];
            for (let e5 = 0; e5 < a2.length; e5++) t2.on(a2[e5], r2);
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], fJVWn: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return (t2) => ({ ...e3, mounted: (e4) => {
            let { proxy: r2, icons: a2 } = t2, o2 = (0, i.append)(e4, a2.volume), n2 = (0, i.append)(e4, a2.volumeClose), s = (0, i.append)(e4, '<div class="art-volume-panel"></div>'), l = (0, i.append)(s, '<div class="art-volume-inner"></div>'), c = (0, i.append)(l, '<div class="art-volume-val"></div>'), p = (0, i.append)(l, '<div class="art-volume-slider"></div>'), u = (0, i.append)(p, '<div class="art-volume-handle"></div>'), d = (0, i.append)(u, '<div class="art-volume-loaded"></div>'), f = (0, i.append)(p, '<div class="art-volume-indicator"></div>');
            function h(e5) {
              let { top: t3, height: r3 } = (0, i.getRect)(p);
              return 1 - (e5.clientY - t3) / r3;
            }
            function m() {
              if (t2.muted || 0 === t2.volume) (0, i.setStyle)(o2, "display", "none"), (0, i.setStyle)(n2, "display", "flex"), (0, i.setStyle)(f, "top", "100%"), (0, i.setStyle)(d, "top", "100%"), c.textContent = 0;
              else {
                let e5 = 100 * t2.volume;
                (0, i.setStyle)(o2, "display", "flex"), (0, i.setStyle)(n2, "display", "none"), (0, i.setStyle)(f, "top", `${100 - e5}%`), (0, i.setStyle)(d, "top", `${100 - e5}%`), c.textContent = Math.floor(e5);
              }
            }
            if (m(), t2.on("video:volumechange", m), r2(o2, "click", () => {
              t2.muted = true;
            }), r2(n2, "click", () => {
              t2.muted = false;
            }), i.isMobile) (0, i.setStyle)(s, "display", "none");
            else {
              let e5 = false;
              r2(p, "mousedown", (r3) => {
                e5 = 0 === r3.button, t2.volume = h(r3);
              }), t2.on("document:mousemove", (r3) => {
                e5 && (t2.muted = false, t2.volume = h(r3));
              }), t2.on("document:mouseup", () => {
                e5 && (e5 = false);
              });
            }
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], jmVSD: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("./clickInit"), n = o.interopDefault(i), s = e2("./gestureInit"), l = o.interopDefault(s), c = e2("./globalInit"), p = o.interopDefault(c), u = e2("./hoverInit"), d = o.interopDefault(u), f = e2("./moveInit"), h = o.interopDefault(f), m = e2("./resizeInit"), g = o.interopDefault(m), v = e2("./updateInit"), y = o.interopDefault(v), b = e2("./viewInit"), x = o.interopDefault(b);
        r.default = class {
          constructor(e3) {
            this.destroyEvents = [], this.proxy = this.proxy.bind(this), this.hover = this.hover.bind(this), (0, n.default)(e3, this), (0, d.default)(e3, this), (0, h.default)(e3, this), (0, g.default)(e3, this), (0, l.default)(e3, this), (0, x.default)(e3, this), (0, p.default)(e3, this), (0, y.default)(e3, this);
          }
          proxy(e3, t2, r2, a2 = {}) {
            if (Array.isArray(t2)) return t2.map((t3) => this.proxy(e3, t3, r2, a2));
            e3.addEventListener(t2, r2, a2);
            let o2 = () => e3.removeEventListener(t2, r2, a2);
            return this.destroyEvents.push(o2), o2;
          }
          hover(e3, t2, r2) {
            t2 && this.proxy(e3, "mouseenter", t2), r2 && this.proxy(e3, "mouseleave", r2);
          }
          remove(e3) {
            let t2 = this.destroyEvents.indexOf(e3);
            t2 > -1 && (e3(), this.destroyEvents.splice(t2, 1));
          }
          destroy() {
            for (let e3 = 0; e3 < this.destroyEvents.length; e3++) this.destroyEvents[e3]();
          }
        };
      }, { "./clickInit": "i8G6V", "./gestureInit": "9wEzB", "./globalInit": "ikBrS", "./hoverInit": "jwNq0", "./moveInit": "eqSsP", "./resizeInit": "42JNz", "./updateInit": "7kM1M", "./viewInit": "2IW9m", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], i8G6V: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3, t2) {
          let { constructor: r2, template: { $player: a2, $video: o2 } } = e3;
          function n2(t3) {
            (0, i.includeFromEvent)(t3, a2) ? (e3.isInput = "INPUT" === t3.target.tagName, e3.isFocus = true, e3.emit("focus", t3)) : (e3.isInput = false, e3.isFocus = false, e3.emit("blur", t3));
          }
          e3.on("document:click", n2), e3.on("document:contextmenu", n2);
          let s = [];
          t2.proxy(o2, "click", (t3) => {
            let a3 = Date.now();
            s.push(a3);
            let { MOBILE_CLICK_PLAY: o3, DBCLICK_TIME: n3, MOBILE_DBCLICK_PLAY: l, DBCLICK_FULLSCREEN: c } = r2, p = s.filter((e4) => a3 - e4 <= n3);
            switch (p.length) {
              case 1:
                e3.emit("click", t3), i.isMobile ? !e3.isLock && o3 && e3.toggle() : e3.toggle(), s = p;
                break;
              case 2:
                e3.emit("dblclick", t3), i.isMobile ? !e3.isLock && l && e3.toggle() : c && (e3.fullscreen = !e3.fullscreen), s = [];
                break;
              default:
                s = [];
            }
          });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "9wEzB": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => s);
        var i = e2("../control/progress"), n = e2("../utils");
        function s(e3, t2) {
          if (n.isMobile && !e3.option.isLive) {
            let { $video: r2, $progress: a2 } = e3.template, o2 = null, s2 = false, l = 0, c = 0, p = 0, u = (t3) => {
              if (1 === t3.touches.length && !e3.isLock) {
                o2 === a2 && (0, i.setCurrentTime)(e3, t3), s2 = true;
                let { pageX: r3, pageY: n2 } = t3.touches[0];
                l = r3, c = n2, p = e3.currentTime;
              }
            }, d = (t3) => {
              if (1 === t3.touches.length && s2 && e3.duration) {
                let { pageX: a3, pageY: i2 } = t3.touches[0], s3 = (function(e4, t4, r3, a4) {
                  let o3 = t4 - a4, i3 = r3 - e4, n2 = 0;
                  if (2 > Math.abs(i3) && 2 > Math.abs(o3)) return n2;
                  let s4 = 180 * Math.atan2(o3, i3) / Math.PI;
                  return s4 >= -45 && s4 < 45 ? n2 = 4 : s4 >= 45 && s4 < 135 ? n2 = 1 : s4 >= -135 && s4 < -45 ? n2 = 2 : (s4 >= 135 && s4 <= 180 || s4 >= -180 && s4 < -135) && (n2 = 3), n2;
                })(l, c, a3, i2), u2 = [3, 4].includes(s3), d2 = [1, 2].includes(s3);
                if (u2 && !e3.isRotate || d2 && e3.isRotate) {
                  let s4 = (0, n.clamp)((a3 - l) / e3.width, -1, 1), u3 = (0, n.clamp)((i2 - c) / e3.height, -1, 1), d3 = e3.isRotate ? u3 : s4, f = o2 === r2 ? e3.constructor.TOUCH_MOVE_RATIO : 1, h = (0, n.clamp)(p + e3.duration * d3 * f, 0, e3.duration);
                  e3.seek = h, e3.emit("setBar", "played", (0, n.clamp)(h / e3.duration, 0, 1), t3), e3.notice.show = `${(0, n.secondToTime)(h)} / ${(0, n.secondToTime)(e3.duration)}`;
                }
              }
            };
            e3.option.gesture && (t2.proxy(r2, "touchstart", (e4) => {
              o2 = r2, u(e4);
            }), t2.proxy(r2, "touchmove", d)), t2.proxy(a2, "touchstart", (e4) => {
              o2 = a2, u(e4);
            }), t2.proxy(a2, "touchmove", d), e3.on("document:touchend", () => {
              s2 && (l = 0, c = 0, p = 0, s2 = false, o2 = null);
            });
          }
        }
      }, { "../control/progress": "1XZSS", "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], ikBrS: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3, t2) {
          let r2 = ["click", "mouseup", "keydown", "touchend", "touchmove", "mousemove", "pointerup", "contextmenu", "pointermove", "visibilitychange", "webkitfullscreenchange"], a2 = ["resize", "scroll", "orientationchange"], o2 = [];
          function i2(n = {}) {
            for (let e4 = 0; e4 < o2.length; e4++) t2.remove(o2[e4]);
            o2.length = 0;
            let { $player: s } = e3.template;
            r2.forEach((r3) => {
              let a3 = n.document || s.ownerDocument || document, i3 = t2.proxy(a3, r3, (t3) => {
                e3.emit(`document:${r3}`, t3);
              });
              o2.push(i3);
            }), a2.forEach((r3) => {
              let a3 = n.window || s.ownerDocument?.defaultView || window, i3 = t2.proxy(a3, r3, (t3) => {
                e3.emit(`window:${r3}`, t3);
              });
              o2.push(i3);
            });
          }
          i2(), t2.bindGlobalEvents = i2;
        }
        o.defineInteropFlag(r), o.export(r, "default", () => i);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], jwNq0: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3, t2) {
          let { $player: r2 } = e3.template;
          t2.hover(r2, (t3) => {
            (0, i.addClass)(r2, "art-hover"), e3.emit("hover", true, t3);
          }, (t3) => {
            (0, i.removeClass)(r2, "art-hover"), e3.emit("hover", false, t3);
          });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], eqSsP: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3, t2) {
          let { $player: r2 } = e3.template;
          t2.proxy(r2, "mousemove", (t3) => {
            e3.emit("mousemove", t3);
          });
        }
        o.defineInteropFlag(r), o.export(r, "default", () => i);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "42JNz": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3, t2) {
          let { option: r2, constructor: a2 } = e3;
          e3.on("resize", () => {
            let { aspectRatio: t3, notice: a3 } = e3;
            "standard" === e3.state && r2.autoSize && e3.autoSize(), e3.aspectRatio = t3, a3.show = "";
          });
          let o2 = (0, i.debounce)(() => e3.emit("resize"), a2.RESIZE_TIME);
          e3.on("window:orientationchange", () => o2()), e3.on("window:resize", () => o2()), screen && screen.orientation && screen.orientation.onchange && t2.proxy(screen.orientation, "change", () => o2());
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "7kM1M": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3) {
          if (e3.constructor.USE_RAF) {
            let t2 = null;
            !(function r2() {
              e3.playing && e3.emit("raf"), e3.isDestroy || (t2 = requestAnimationFrame(r2));
            })(), e3.on("destroy", () => {
              cancelAnimationFrame(t2);
            });
          }
        }
        o.defineInteropFlag(r), o.export(r, "default", () => i);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "2IW9m": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { option: t2, constructor: r2, template: { $container: a2 } } = e3, o2 = (0, i.throttle)(() => {
            e3.emit("view", (0, i.isInViewport)(a2, r2.SCROLL_GAP));
          }, r2.SCROLL_TIME);
          e3.on("window:scroll", () => o2()), e3.on("view", (r3) => {
            t2.autoMini && (e3.mini = !r3);
          });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], dswts: [function(e2, t, r, a) {
        e2("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r);
        var o = e2("./utils");
        r.default = class {
          constructor(e3) {
            this.art = e3, this.keys = {}, e3.option.hotkey && !o.isMobile && this.init();
          }
          init() {
            let { constructor: e3 } = this.art;
            this.add("Escape", () => {
              this.art.fullscreenWeb && (this.art.fullscreenWeb = false);
            }), this.add("Space", () => {
              this.art.toggle();
            }), this.add("ArrowLeft", () => {
              this.art.backward = e3.SEEK_STEP;
            }), this.add("ArrowUp", () => {
              this.art.volume += e3.VOLUME_STEP;
            }), this.add("ArrowRight", () => {
              this.art.forward = e3.SEEK_STEP;
            }), this.add("ArrowDown", () => {
              this.art.volume -= e3.VOLUME_STEP;
            }), this.art.on("document:keydown", (e4) => {
              if (this.art.isFocus) {
                let t2 = document.activeElement.tagName.toUpperCase(), r2 = document.activeElement.getAttribute("contenteditable");
                if ("INPUT" !== t2 && "TEXTAREA" !== t2 && "" !== r2 && "true" !== r2 && !e4.altKey && !e4.ctrlKey && !e4.metaKey && !e4.shiftKey) {
                  let t3 = this.keys[e4.code];
                  if (t3) {
                    e4.preventDefault();
                    for (let r3 = 0; r3 < t3.length; r3++) t3[r3].call(this.art, e4);
                    this.art.emit("hotkey", e4);
                  }
                }
              }
              this.art.emit("keydown", e4);
            });
          }
          add(e3, t2) {
            return this.keys[e3] ? this.keys[e3].push(t2) : this.keys[e3] = [t2], this;
          }
          remove(e3, t2) {
            if (this.keys[e3]) {
              let r2 = this.keys[e3].indexOf(t2);
              -1 !== r2 && this.keys[e3].splice(r2, 1);
            }
            return this;
          }
        };
      }, { "./utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], d9ktO: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("../utils"), n = e2("./zh-cn"), s = o.interopDefault(n);
        r.default = class {
          constructor(e3) {
            this.art = e3, this.languages = { "zh-cn": s.default }, this.language = {}, this.update(e3.option.i18n);
          }
          init() {
            let e3 = this.art.option.lang.toLowerCase();
            this.language = this.languages[e3] || {};
          }
          get(e3) {
            return this.language[e3] || e3;
          }
          update(e3) {
            this.languages = (0, i.mergeDeep)(this.languages, e3), this.init();
          }
        };
      }, { "../utils": "aBlEo", "./zh-cn": "3hyaR", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "3hyaR": [function(e2, t, r, a) {
        e2("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r);
        let o = { "Video Info": "统计信息", Close: "关闭", "Video Load Failed": "加载失败", Volume: "音量", Play: "播放", Pause: "暂停", Rate: "速度", Mute: "静音", "Video Flip": "画面翻转", Horizontal: "水平", Vertical: "垂直", Reconnect: "重新连接", "Show Setting": "显示设置", "Hide Setting": "隐藏设置", Screenshot: "截图", "Play Speed": "播放速度", "Aspect Ratio": "画面比例", Default: "默认", Normal: "正常", Open: "打开", "Switch Video": "切换", "Switch Subtitle": "切换字幕", Fullscreen: "全屏", "Exit Fullscreen": "退出全屏", "Web Fullscreen": "网页全屏", "Exit Web Fullscreen": "退出网页全屏", "Mini Player": "迷你播放器", "PIP Mode": "开启画中画", "Exit PIP Mode": "退出画中画", "PIP Not Supported": "不支持画中画", "Fullscreen Not Supported": "不支持全屏", "Subtitle Offset": "字幕偏移", "Last Seen": "上次看到", "Jump Play": "跳转播放", AirPlay: "隔空播放", "AirPlay Not Available": "隔空播放不可用" };
        r.default = o, "undefined" != typeof window && (window["artplayer-i18n-zh-cn"] = o);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], fFHY0: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("bundle-text:./airplay.svg"), n = o.interopDefault(i), s = e2("bundle-text:./arrow-left.svg"), l = o.interopDefault(s), c = e2("bundle-text:./arrow-right.svg"), p = o.interopDefault(c), u = e2("bundle-text:./aspect-ratio.svg"), d = o.interopDefault(u), f = e2("bundle-text:./check.svg"), h = o.interopDefault(f), m = e2("bundle-text:./close.svg"), g = o.interopDefault(m), v = e2("bundle-text:./config.svg"), y = o.interopDefault(v), b = e2("bundle-text:./error.svg"), x = o.interopDefault(b), w = e2("bundle-text:./flip.svg"), j = o.interopDefault(w), k = e2("bundle-text:./fullscreen-off.svg"), E = o.interopDefault(k), S = e2("bundle-text:./fullscreen-on.svg"), $ = o.interopDefault(S), M = e2("bundle-text:./fullscreen-web-off.svg"), I = o.interopDefault(M), T = e2("bundle-text:./fullscreen-web-on.svg"), C = o.interopDefault(T), F = e2("bundle-text:./loading.svg"), q = o.interopDefault(F), D = e2("bundle-text:./lock.svg"), A = o.interopDefault(D), R = e2("bundle-text:./pause.svg"), B = o.interopDefault(R), L = e2("bundle-text:./pip.svg"), O = o.interopDefault(L), P = e2("bundle-text:./play.svg"), z = o.interopDefault(P), X = e2("bundle-text:./playback-rate.svg"), V = o.interopDefault(X), _ = e2("bundle-text:./screenshot.svg"), H = o.interopDefault(_), N = e2("bundle-text:./setting.svg"), W = o.interopDefault(N), U = e2("bundle-text:./state.svg"), Y = o.interopDefault(U), Z = e2("bundle-text:./switch-off.svg"), K = o.interopDefault(Z), G = e2("bundle-text:./switch-on.svg"), J = o.interopDefault(G), Q = e2("bundle-text:./unlock.svg"), ee = o.interopDefault(Q), et = e2("bundle-text:./volume-close.svg"), er = o.interopDefault(et), ea = e2("bundle-text:./volume.svg"), eo = o.interopDefault(ea), ei = e2("../utils");
        r.default = class {
          constructor(e3) {
            let t2 = { loading: q.default, state: Y.default, play: z.default, pause: B.default, check: h.default, volume: eo.default, volumeClose: er.default, screenshot: H.default, setting: W.default, pip: O.default, arrowLeft: l.default, arrowRight: p.default, playbackRate: V.default, aspectRatio: d.default, config: y.default, lock: A.default, flip: j.default, unlock: ee.default, fullscreenOff: E.default, fullscreenOn: $.default, fullscreenWebOff: I.default, fullscreenWebOn: C.default, switchOn: J.default, switchOff: K.default, error: x.default, close: g.default, airplay: n.default, ...e3.option.icons };
            for (let e4 in t2) (0, ei.def)(this, e4, { get: () => (0, ei.getIcon)(e4, t2[e4]) });
          }
        };
      }, { "bundle-text:./airplay.svg": "gkZgZ", "bundle-text:./arrow-left.svg": "kQyD4", "bundle-text:./arrow-right.svg": "64ztm", "bundle-text:./aspect-ratio.svg": "72LvA", "bundle-text:./check.svg": "4QmBo", "bundle-text:./close.svg": "j1hoe", "bundle-text:./config.svg": "hNZaT", "bundle-text:./error.svg": "dKh4l", "bundle-text:./flip.svg": "lIEIE", "bundle-text:./fullscreen-off.svg": "1533e", "bundle-text:./fullscreen-on.svg": "76ut3", "bundle-text:./fullscreen-web-off.svg": "3NzMk", "bundle-text:./fullscreen-web-on.svg": "12xHc", "bundle-text:./loading.svg": "iVcUF", "bundle-text:./lock.svg": "1J4so", "bundle-text:./pause.svg": "1KgkK", "bundle-text:./pip.svg": "4h4tM", "bundle-text:./play.svg": "jecAY", "bundle-text:./playback-rate.svg": "anPe9", "bundle-text:./screenshot.svg": "9BPYQ", "bundle-text:./setting.svg": "hsI9k", "bundle-text:./state.svg": "gr1ZU", "bundle-text:./switch-off.svg": "6kdAr", "bundle-text:./switch-on.svg": "ksdMo", "bundle-text:./unlock.svg": "iz5Qc", "bundle-text:./volume-close.svg": "3OZoa", "bundle-text:./volume.svg": "hRYA4", "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], gkZgZ: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18"><path d="M16 1H2a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3v-2H3V3h12v8h-2v2h3a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1"/><path d="M4 17h10l-5-6Z"/></svg>';
      }, {}], kQyD4: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="m19.41 20.09-4.58-4.59 4.58-4.59L18 9.5l-6 6 6 6Z"/></svg>';
      }, {}], "64ztm": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><path d="m12.59 20.34 4.58-4.59-4.58-4.59L14 9.75l6 6-6 6Z"/></svg>';
      }, {}], "72LvA": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%;transform:translate(0)" viewBox="0 0 88 88"><defs><clipPath id="__lottie_element_216"><path d="M0 0h88v88H0Z"/></clipPath></defs><g clip-path="url(#__lottie_element_216)"><g style="display:block"><path d="m12.438-12.702-2.82 2.82c-.79.79-.79 2.05 0 2.83l7.07 7.07-7.07 7.07c-.79.79-.79 2.05 0 2.83l2.82 2.83c.79.78 2.05.78 2.83 1.4495849676166017e-7l11.32-11.31c.78-.78.78-2.05 0-2.83l-11.32-11.31C14.488-13.492 13.228-13.492 12.438-12.702m-24.88 0c-.74-.74-1.92-.78-2.7-.12l-.13.12-11.31 11.31a2 2 0 0 0-.12 2.7l.12.13 11.31 11.31a2 2 0 0 0 2.7.12l.13-.12 2.83-2.83c.74-.74.78-1.91.11-2.7l-.11-.13-7.07-7.07 7.07-7.07c.74-.74.78-1.91.11-2.7l-.11-.13ZM28-28c4.42 0 8 3.58 8 8v40c0 4.42-3.58 8-8 8h-56c-4.42 0-8-3.58-8-8v-40c0-4.42 3.58-8 8-8Z" style="--darkreader-inline-fill:#a8a6a4" transform="translate(44 44)"/></g></g></svg>';
      }, {}], "4QmBo": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" style="width:100%;height:100%" viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4Z"/></svg>';
      }, {}], j1hoe: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" class="icon" viewBox="0 0 1024 1024"><path d="m571.733 512 268.8-268.8c17.067-17.067 17.067-42.667 0-59.733C823.467 166.4 797.867 166.4 780.8 183.466L512 452.267l-268.8-268.8C226.133 166.4 200.533 166.4 183.467 183.466c-17.067 17.066-17.067 42.666 0 59.733l268.8 268.8-268.8 268.8c-17.067 17.067-17.067 42.667 0 59.733 8.533 8.534 19.2 12.8 29.866 12.8s21.334-4.266 29.867-12.8l268.8-268.8 268.8 268.8c8.533 8.534 19.2 12.8 29.867 12.8s21.333-4.266 29.866-12.8c17.067-17.066 17.067-42.666 0-59.733Z"/></svg>';
      }, {}], hNZaT: [function(e2, t, r, a) {
        t.exports = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M15 17h6v1h-6Zm-4 0H3v1h8v2h1v-5h-1Zm3-9h1V3h-1v2H3v1h11Zm4-3v1h3V5ZM6 14h1V9H6v2H3v1h3Zm4-2h11v-1H10Z" style="--darkreader-inline-fill:#a8a6a4"/></svg>';
      }, {}], dKh4l: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 1024 1024"><path d="M593.818 168.55 949.82 763.76c26.153 43.746 10.732 99.738-34.447 125.052-14.397 8.069-30.72 12.308-47.37 12.308H155.976c-52.224 0-94.536-40.96-94.536-91.505 0-16.097 4.383-31.928 12.718-45.875l356.004-595.19c26.173-43.724 84.009-58.654 129.208-33.341a93.1 93.1 0 0 1 34.447 33.341M512 819.2a61.44 61.44 0 1 0 0-122.88 61.44 61.44 0 0 0 0 122.88m0-512a72.315 72.315 0 0 0-71.762 81.306l25.723 205.721a46.408 46.408 0 0 0 92.078 0l25.723-205.742A72.315 72.315 0 0 0 512 307.2"/></svg>';
      }, {}], lIEIE: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" class="icon" viewBox="0 0 1024 1024"><path d="M554.667 810.667V896h-85.333v-85.333Zm-384-632.662a42.67 42.67 0 0 1 34.987 18.219l203.903 291.328a42.67 42.67 0 0 1 0 48.896L205.611 827.776A42.667 42.667 0 0 1 128 803.328V220.672a42.667 42.667 0 0 1 42.667-42.667m682.666 0a42.667 42.667 0 0 1 42.368 37.717l.299 4.95v582.656a42.667 42.667 0 0 1-74.24 28.63l-3.413-4.182-203.904-291.328a42.67 42.67 0 0 1-3.03-43.861l3.03-5.035 203.946-291.328a42.67 42.67 0 0 1 34.944-18.219M554.667 640v85.333h-85.333V640Zm-358.4-320.896V716.8L335.957 512 196.31 319.104Zm358.4 150.23v85.333h-85.333v-85.333Zm0-170.667V384h-85.333v-85.333Zm0-170.667v85.333h-85.333V128Z"/></svg>';
      }, {}], "1533e": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" class="icon" viewBox="0 0 1024 1024"><path d="M768 298.667h170.667V384h-256V128H768ZM341.333 384h-256v-85.333H256V128h85.333ZM768 725.333V896h-85.333V640h256v85.333ZM341.333 640v256H256V725.333H85.333V640Z"/></svg>';
      }, {}], "76ut3": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" class="icon" viewBox="0 0 1024 1024"><path d="M625.778 256H768v142.222h113.778v-256h-256ZM256 398.222V256h142.222V142.222h-256v256Zm512 227.556V768H625.778v113.778h256v-256ZM398.222 768H256V625.778H142.222v256h256Z"/></svg>';
      }, {}], "3NzMk": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" class="icon" viewBox="0 0 1152 1024"><path d="M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4a76.8 76.8 0 0 0 76.8 76.8h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0M1024 128v768H128V128ZM896 512a64 64 0 0 1 7.488 127.552L896 640H768v128a64 64 0 0 1-56.512 63.552L704 832a64 64 0 0 1-63.552-56.512L640 768V582.592c0-34.496 25.024-66.112 61.632-70.208l8-.384Zm-640 0a64 64 0 0 1-7.488-127.552L256 384h128V256a64 64 0 0 1 56.512-63.552L448 192a64 64 0 0 1 63.552 56.512L512 256v185.408c0 34.432-25.024 66.112-61.632 70.144l-8 .448Z"/></svg>';
      }, {}], "12xHc": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" class="icon" viewBox="0 0 1152 1024"><path d="M1075.2 0H76.8A76.8 76.8 0 0 0 0 76.8v870.4a76.8 76.8 0 0 0 76.8 76.8h998.4a76.8 76.8 0 0 0 76.8-76.8V76.8A76.8 76.8 0 0 0 1075.2 0M1024 128v768H128V128Zm-576 64a64 64 0 0 1 7.488 127.552L448 320H320v128a64 64 0 0 1-56.512 63.552L256 512a64 64 0 0 1-63.552-56.512L192 448V262.592c0-34.432 25.024-66.112 61.632-70.144l8-.448Zm256 640a64 64 0 0 1-7.488-127.552L704 704h128V576a64 64 0 0 1 56.512-63.552L896 512a64 64 0 0 1 63.552 56.512L960 576v185.408c0 34.496-25.024 66.112-61.632 70.208l-8 .384Z"/></svg>';
      }, {}], iVcUF: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" class="uil-default" preserveAspectRatio="xMidYMid" viewBox="0 0 100 100"><path fill="none" d="M0 0h100v100H0Z" class="bk"/><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="translate(0 -30)"><animate attributeName="opacity" begin="-1s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="rotate(30 105.98 65)"><animate attributeName="opacity" begin="-0.9166666666666666s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="rotate(60 75.98 65)"><animate attributeName="opacity" begin="-0.8333333333333334s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="rotate(90 65 65)"><animate attributeName="opacity" begin="-0.75s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="rotate(120 58.66 65)"><animate attributeName="opacity" begin="-0.6666666666666666s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="rotate(150 54.02 65)"><animate attributeName="opacity" begin="-0.5833333333333334s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="matrix(-1 0 0 -1 100 130)"><animate attributeName="opacity" begin="-0.5s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="rotate(210 45.98 65)"><animate attributeName="opacity" begin="-0.4166666666666667s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="rotate(240 41.34 65)"><animate attributeName="opacity" begin="-0.3333333333333333s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="rotate(-90 35 65)"><animate attributeName="opacity" begin="-0.25s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="rotate(-60 24.02 65)"><animate attributeName="opacity" begin="-0.16666666666666666s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect><rect width="6" height="20" x="47" y="40" rx="5" ry="5" transform="rotate(-30 -5.98 65)"><animate attributeName="opacity" begin="-0.08333333333333333s" dur="1s" from="1" repeatCount="indefinite" to="0"/></rect></svg>';
      }, {}], "1J4so": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="icon" viewBox="0 0 1024 1024"><path d="M298.667 426.667v-85.333a213.333 213.333 0 1 1 426.667 0v85.333H768A85.333 85.333 0 0 1 853.333 512v256A85.333 85.333 0 0 1 768 853.333H256A85.333 85.333 0 0 1 170.667 768V512A85.333 85.333 0 0 1 256 426.667ZM512 213.333a128 128 0 0 0-128 128v85.333h256v-85.333a128 128 0 0 0-128-128"/></svg>';
      }, {}], "1KgkK": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path d="M7 3a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2m8 0a2 2 0 0 0-2 2v12a2 2 0 1 0 4 0V5a2 2 0 0 0-2-2"/></svg>';
      }, {}], "4h4tM": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 1024 1024"><path d="M844.8 219.648H179.2c-6.144 0-10.24 4.608-10.24 10.752v563.2c0 5.632 4.096 10.24 10.24 10.24h256V896h-256A102.4 102.4 0 0 1 76.8 793.6V230.4c0-56.832 45.568-102.4 102.4-102.4h665.6a102.4 102.4 0 0 1 102.4 102.4v204.8h-92.16V230.4c0-6.144-4.608-10.752-10.24-10.752M614.4 588.8c-28.672 0-51.2 22.528-51.2 51.2v204.8c0 28.16 22.528 51.2 51.2 51.2H896c28.16 0 51.2-23.04 51.2-51.2V640c0-28.672-23.04-51.2-51.2-51.2Z"/></svg>';
      }, {}], jecAY: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path d="M17.982 9.275 8.06 3.27A2.013 2.013 0 0 0 5 4.994v12.011a2.017 2.017 0 0 0 3.06 1.725l9.922-6.005a2.017 2.017 0 0 0 0-3.45"/></svg>';
      }, {}], anPe9: [function(e2, t, r, a) {
        t.exports = '<svg width="24" height="24" viewBox="0 0 24 24"><path d="M10 8v8l6-4ZM6.3 5l-.6-.8C7.2 3 9 2.2 11 2l.1 1c-1.8.2-3.4.9-4.8 2M5 6.3l-.8-.6C3 7.2 2.2 9 2 11l1 .1c.2-1.8.9-3.4 2-4.8m0 11.4c-1.1-1.4-1.8-3.1-2-4.8L2 13c.2 2 1 3.8 2.2 5.4Zm6.1 3.3c-1.8-.2-3.4-.9-4.8-2l-.6.8C7.2 21 9 21.8 11 22ZM22 12c0-5.2-3.9-9.4-9-10l-.1 1c4.6.5 8.1 4.3 8.1 9s-3.5 8.5-8.1 9l.1 1c5.2-.5 9-4.8 9-10" style="--darkreader-inline-fill:#a8a6a4"/></svg>';
      }, {}], "9BPYQ": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 50 50"><path d="M19.402 6a5 5 0 0 0-4.902 4.012L14.098 12H9a5 5 0 0 0-5 5v21a5 5 0 0 0 5 5h32a5 5 0 0 0 5-5V17a5 5 0 0 0-5-5h-5.098l-.402-1.988A5 5 0 0 0 30.598 6ZM25 17c5.52 0 10 4.48 10 10s-4.48 10-10 10-10-4.48-10-10 4.48-10 10-10m0 2c-4.41 0-8 3.59-8 8s3.59 8 8 8 8-3.59 8-8-3.59-8-8-8"/></svg>';
      }, {}], hsI9k: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><circle cx="11" cy="11" r="2"/><path d="M19.164 8.861 17.6 8.6a7 7 0 0 0-1.186-2.099l.574-1.533a1 1 0 0 0-.436-1.217l-1.997-1.153a1 1 0 0 0-1.272.23l-1.008 1.225a7 7 0 0 0-2.55.001L8.716 2.829a1 1 0 0 0-1.272-.23L5.447 3.751a1 1 0 0 0-.436 1.217l.574 1.533A7 7 0 0 0 4.4 8.6l-1.564.261A1 1 0 0 0 2 9.847v2.306c0 .489.353.906.836.986l1.613.269a7 7 0 0 0 1.228 2.075l-.558 1.487a1 1 0 0 0 .436 1.217l1.997 1.153c.423.244.961.147 1.272-.23l1.04-1.263a7.1 7.1 0 0 0 2.272 0l1.04 1.263a1 1 0 0 0 1.272.23l1.997-1.153a1 1 0 0 0 .436-1.217l-.557-1.487c.521-.61.94-1.31 1.228-2.075l1.613-.269a1 1 0 0 0 .835-.986V9.847a1 1 0 0 0-.836-.986M11 15a4 4 0 1 1 0-8 4 4 0 0 1 0 8"/></svg>';
      }, {}], gr1ZU: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 24 24"><path d="M9.5 9.325v5.35q0 .575.525.875t1.025-.05l4.15-2.65q.475-.3.475-.85t-.475-.85L11.05 8.5q-.5-.35-1.025-.05t-.525.875M12 22q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12t.788-3.9 2.137-3.175q1.35-1.35 3.175-2.137T12 2t3.9.788 3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22"/></svg>';
      }, {}], "6kdAr": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" class="icon" viewBox="0 0 1740 1024"><path d="M511.898 1024h670.515c282.419-.41 511.18-229.478 511.18-511.898 0-282.419-228.761-511.488-511.18-511.897H511.898C229.478.615.717 229.683.717 512.102c0 282.42 228.761 511.488 511.18 511.898m-.564-975.36A464.589 464.589 0 1 1 48.025 513.024 463.87 463.87 0 0 1 511.335 48.435Z"/></svg>';
      }, {}], ksdMo: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" class="icon" viewBox="0 0 1664 1024"><path fill="#648ffc" d="M1152 0H512a512 512 0 0 0 0 1024h640a512 512 0 0 0 0-1024m0 960a448 448 0 1 1 448-448 448 448 0 0 1-448 448"/></svg>';
      }, {}], iz5Qc: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" class="icon" viewBox="0 0 1024 1024"><path d="m666.752 194.517-49.365 74.112A128 128 0 0 0 384 341.333l.043 85.334h384A85.333 85.333 0 0 1 853.376 512v256a85.333 85.333 0 0 1-85.333 85.333H256A85.333 85.333 0 0 1 170.667 768V512A85.333 85.333 0 0 1 256 426.667h42.667v-85.333a213.333 213.333 0 0 1 368.085-146.816"/></svg>';
      }, {}], "3OZoa": [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path d="M15 11a4 4 0 0 0-2-3.465v2.636l1.865 1.865A4 4 0 0 0 15 11"/><path d="M13.583 5.583A6 6 0 0 1 17 11a6 6 0 0 1-.585 2.587l1.477 1.477a8 8 0 0 0-3.446-11.286 1 1 0 0 0-.863 1.805m5.195 13.195-2.121-2.121-1.414-1.414-1.415-1.415L13 13l-2-2-3.889-3.889-3.889-3.889a.999.999 0 1 0-1.414 1.414L5.172 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39v-3.131l2.587 2.587-.01.005a1 1 0 0 0 .86 1.806q.322-.154.627-.333l2.3 2.3a1.001 1.001 0 0 0 1.414-1.416M11 5.04a.5.5 0 0 0-.813-.39L8.682 5.854 11 8.172Z"/></svg>';
      }, {}], hRYA4: [function(e2, t, r, a) {
        t.exports = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22"><path d="M10.188 4.65 6 8H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h1l4.188 3.35a.5.5 0 0 0 .812-.39V5.04a.498.498 0 0 0-.812-.39m4.258-.872a1 1 0 0 0-.862 1.804 6.002 6.002 0 0 1-.007 10.838 1 1 0 0 0 .86 1.806A8 8 0 0 0 19 11a8 8 0 0 0-4.554-7.222"/><path d="M15 11a4 4 0 0 0-2-3.465v6.93A4 4 0 0 0 15 11"/></svg>';
      }, {}], kZ0F8: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("./utils"), n = e2("./utils/component"), s = o.interopDefault(n);
        class l extends s.default {
          constructor(e3) {
            super(e3), this.name = "info", i.isMobile || this.init();
          }
          init() {
            let { proxy: e3, constructor: t2, template: { $infoPanel: r2, $infoClose: a2, $video: o2 } } = this.art;
            e3(a2, "click", () => {
              this.show = false;
            });
            let n2 = null, s2 = (0, i.queryAll)("[data-video]", r2) || [];
            this.art.on("destroy", () => clearTimeout(n2)), !(function e4() {
              for (let e5 = 0; e5 < s2.length; e5++) {
                let t3 = s2[e5], r3 = o2[t3.dataset.video], a3 = "number" == typeof r3 ? r3.toFixed(2) : r3;
                t3.textContent !== a3 && (t3.textContent = a3);
              }
              n2 = setTimeout(e4, t2.INFO_LOOP_TIME);
            })();
          }
        }
        r.default = l;
      }, { "./utils": "aBlEo", "./utils/component": "idCEj", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], j9lbi: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("./utils/component"), n = o.interopDefault(i);
        class s extends n.default {
          constructor(e3) {
            super(e3);
            let { option: t2, template: { $layer: r2 } } = e3;
            this.name = "layer", this.$parent = r2;
            for (let e4 = 0; e4 < t2.layers.length; e4++) this.add(t2.layers[e4]);
          }
        }
        r.default = s;
      }, { "./utils/component": "idCEj", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], bMjWd: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("./utils"), n = e2("./utils/component"), s = o.interopDefault(n);
        class l extends s.default {
          constructor(e3) {
            super(e3), this.name = "loading", (0, i.append)(e3.template.$loading, e3.icons.loading);
          }
        }
        r.default = l;
      }, { "./utils": "aBlEo", "./utils/component": "idCEj", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], k1nkQ: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("./utils"), n = e2("./utils/component"), s = o.interopDefault(n);
        class l extends s.default {
          constructor(e3) {
            super(e3), this.name = "mask";
            let { template: t2, icons: r2, events: a2 } = e3, o2 = (0, i.append)(t2.$state, r2.state), n2 = (0, i.append)(t2.$state, r2.error);
            (0, i.setStyle)(n2, "display", "none"), e3.on("destroy", () => {
              (0, i.setStyle)(o2, "display", "none"), (0, i.setStyle)(n2, "display", null);
            }), a2.proxy(t2.$state, "click", () => e3.play());
          }
        }
        r.default = l;
      }, { "./utils": "aBlEo", "./utils/component": "idCEj", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], fPVaU: [function(e2, t, r, a) {
        e2("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r);
        var o = e2("./utils");
        r.default = class {
          constructor(e3) {
            this.art = e3, this.timer = null;
          }
          set show(e3) {
            let { constructor: t2, template: { $player: r2, $noticeInner: a2 } } = this.art;
            e3 ? (a2.textContent = e3 instanceof Error ? e3.message.trim() : e3, (0, o.addClass)(r2, "art-notice-show"), clearTimeout(this.timer), this.timer = setTimeout(() => {
              a2.textContent = "", (0, o.removeClass)(r2, "art-notice-show");
            }, t2.NOTICE_TIME)) : (0, o.removeClass)(r2, "art-notice-show");
          }
          get show() {
            let { template: { $player: e3 } } = this.art;
            return e3.classList.contains("art-notice-show");
          }
        };
      }, { "./utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], uR0Sw: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("./airplayMix"), n = o.interopDefault(i), s = e2("./aspectRatioMix"), l = o.interopDefault(s), c = e2("./attrMix"), p = o.interopDefault(c), u = e2("./autoHeightMix"), d = o.interopDefault(u), f = e2("./autoSizeMix"), h = o.interopDefault(f), m = e2("./cssVarMix"), g = o.interopDefault(m), v = e2("./currentTimeMix"), y = o.interopDefault(v), b = e2("./durationMix"), x = o.interopDefault(b), w = e2("./eventInit"), j = o.interopDefault(w), k = e2("./flipMix"), E = o.interopDefault(k), S = e2("./fullscreenMix"), $ = o.interopDefault(S), M = e2("./fullscreenWebMix"), I = o.interopDefault(M), T = e2("./loadedMix"), C = o.interopDefault(T), F = e2("./miniMix"), q = o.interopDefault(F), D = e2("./optionInit"), A = o.interopDefault(D), R = e2("./pauseMix"), B = o.interopDefault(R), L = e2("./pipMix"), O = o.interopDefault(L), P = e2("./playbackRateMix"), z = o.interopDefault(P), X = e2("./playedMix"), V = o.interopDefault(X), _ = e2("./playingMix"), H = o.interopDefault(_), N = e2("./playMix"), W = o.interopDefault(N), U = e2("./posterMix"), Y = o.interopDefault(U), Z = e2("./qualityMix"), K = o.interopDefault(Z), G = e2("./rectMix"), J = o.interopDefault(G), Q = e2("./screenshotMix"), ee = o.interopDefault(Q), et = e2("./seekMix"), er = o.interopDefault(et), ea = e2("./stateMix"), eo = o.interopDefault(ea), ei = e2("./subtitleOffsetMix"), en = o.interopDefault(ei), es = e2("./switchMix"), el = o.interopDefault(es), ec = e2("./themeMix"), ep = o.interopDefault(ec), eu = e2("./thumbnailsMix"), ed = o.interopDefault(eu), ef = e2("./toggleMix"), eh = o.interopDefault(ef), em = e2("./typeMix"), eg = o.interopDefault(em), ev = e2("./urlMix"), ey = o.interopDefault(ev), eb = e2("./volumeMix"), ex = o.interopDefault(eb);
        r.default = class {
          constructor(e3) {
            (0, ey.default)(e3), (0, p.default)(e3), (0, W.default)(e3), (0, B.default)(e3), (0, eh.default)(e3), (0, er.default)(e3), (0, ex.default)(e3), (0, y.default)(e3), (0, x.default)(e3), (0, el.default)(e3), (0, z.default)(e3), (0, l.default)(e3), (0, ee.default)(e3), (0, $.default)(e3), (0, I.default)(e3), (0, O.default)(e3), (0, C.default)(e3), (0, V.default)(e3), (0, H.default)(e3), (0, h.default)(e3), (0, J.default)(e3), (0, E.default)(e3), (0, q.default)(e3), (0, Y.default)(e3), (0, d.default)(e3), (0, g.default)(e3), (0, ep.default)(e3), (0, eg.default)(e3), (0, eo.default)(e3), (0, en.default)(e3), (0, n.default)(e3), (0, K.default)(e3), (0, ed.default)(e3), (0, j.default)(e3), (0, A.default)(e3);
          }
        };
      }, { "./airplayMix": "d8BTB", "./aspectRatioMix": "aQNJl", "./attrMix": "5DA9e", "./autoHeightMix": "1swKn", "./autoSizeMix": "lSbiD", "./cssVarMix": "32Hp1", "./currentTimeMix": "kfZbu", "./durationMix": "eV1ag", "./eventInit": "f8NQq", "./flipMix": "ea3Qm", "./fullscreenMix": "ffXE3", "./fullscreenWebMix": "8tarF", "./loadedMix": "f9syH", "./miniMix": "dLuS7", "./optionInit": "d1F69", "./pauseMix": "kewk9", "./pipMix": "4XzDs", "./playbackRateMix": "jphfi", "./playedMix": "iNpeS", "./playingMix": "aBIWL", "./playMix": "hRBri", "./posterMix": "fgfXC", "./qualityMix": "17rUP", "./rectMix": "55qzI", "./screenshotMix": "bC6TG", "./seekMix": "j8GRO", "./stateMix": "cn7iR", "./subtitleOffsetMix": "2k4nP", "./switchMix": "6SU6j", "./themeMix": "7iMuh", "./thumbnailsMix": "6P0RS", "./toggleMix": "eNi78", "./typeMix": "7AUBD", "./urlMix": "cnlLL", "./volumeMix": "iX66j", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], d8BTB: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { i18n: t2, notice: r2, proxy: a2, template: { $video: o2 } } = e3, n2 = true;
          window.WebKitPlaybackTargetAvailabilityEvent && o2.webkitShowPlaybackTargetPicker ? a2(o2, "webkitplaybacktargetavailabilitychanged", (e4) => {
            switch (e4.availability) {
              case "available":
                n2 = true;
                break;
              case "not-available":
                n2 = false;
            }
          }) : n2 = false, (0, i.def)(e3, "airplay", { value() {
            n2 ? (o2.webkitShowPlaybackTargetPicker(), e3.emit("airplay")) : r2.show = t2.get("AirPlay Not Available");
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], aQNJl: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { i18n: t2, notice: r2, template: { $video: a2, $player: o2 } } = e3;
          (0, i.def)(e3, "aspectRatio", { get: () => o2.dataset.aspectRatio || "default", set(n2) {
            if (n2 || (n2 = "default"), "default" === n2) (0, i.setStyle)(a2, "width", null), (0, i.setStyle)(a2, "height", null), (0, i.setStyle)(a2, "margin", null), delete o2.dataset.aspectRatio;
            else {
              let e4 = n2.split(":").map(Number), { clientWidth: t3, clientHeight: r3 } = o2, s = e4[0] / e4[1];
              t3 / r3 > s ? ((0, i.setStyle)(a2, "width", `${s * r3}px`), (0, i.setStyle)(a2, "height", "100%"), (0, i.setStyle)(a2, "margin", "0 auto")) : ((0, i.setStyle)(a2, "width", "100%"), (0, i.setStyle)(a2, "height", `${t3 / s}px`), (0, i.setStyle)(a2, "margin", "auto 0")), o2.dataset.aspectRatio = n2;
            }
            r2.show = `${t2.get("Aspect Ratio")}: ${"default" === n2 ? t2.get("Default") : n2}`, e3.emit("aspectRatio", n2);
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "5DA9e": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { template: { $video: t2 } } = e3;
          (0, i.def)(e3, "attr", { value(e4, r2) {
            if (void 0 === r2) return t2[e4];
            t2[e4] = r2;
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "1swKn": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { template: { $container: t2, $video: r2 } } = e3;
          (0, i.def)(e3, "autoHeight", { value() {
            let { clientWidth: a2 } = t2, { videoHeight: o2, videoWidth: n2 } = r2, s = a2 / n2 * o2;
            (0, i.setStyle)(t2, "height", `${s}px`), e3.emit("autoHeight", s);
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], lSbiD: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { $container: t2, $player: r2, $video: a2 } = e3.template;
          (0, i.def)(e3, "autoSize", { value() {
            let { videoWidth: o2, videoHeight: n2 } = a2, { width: s, height: l } = (0, i.getRect)(t2), c = o2 / n2;
            s / l > c ? ((0, i.setStyle)(r2, "width", `${l * c / s * 100}%`), (0, i.setStyle)(r2, "height", "100%")) : ((0, i.setStyle)(r2, "width", "100%"), (0, i.setStyle)(r2, "height", `${s / c / l * 100}%`)), e3.emit("autoSize", { width: e3.width, height: e3.height });
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "32Hp1": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { $player: t2 } = e3.template;
          (0, i.def)(e3, "cssVar", { value: (e4, r2) => r2 ? t2.style.setProperty(e4, r2) : getComputedStyle(t2).getPropertyValue(e4) });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], kfZbu: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { $video: t2 } = e3.template;
          (0, i.def)(e3, "currentTime", { get: () => t2.currentTime || 0, set: (r2) => {
            Number.isNaN(r2 = Number.parseFloat(r2)) || (t2.currentTime = (0, i.clamp)(r2, 0, e3.duration));
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], eV1ag: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          (0, i.def)(e3, "duration", { get: () => {
            let { duration: t2 } = e3.template.$video;
            return t2 === 1 / 0 ? 0 : t2 || 0;
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], f8NQq: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => l);
        var i = e2("../config"), n = o.interopDefault(i), s = e2("../utils");
        function l(e3) {
          let { i18n: t2, notice: r2, option: a2, constructor: o2, proxy: i2, template: { $player: l2, $video: c, $poster: p } } = e3, u = 0;
          for (let t3 = 0; t3 < n.default.events.length; t3++) i2(c, n.default.events[t3], (t4) => {
            e3.emit(`video:${t4.type}`, t4);
          });
          e3.on("video:canplay", () => {
            u = 0, e3.loading.show = false;
          }), e3.once("video:canplay", () => {
            e3.loading.show = false, e3.controls.show = true, e3.mask.show = true, e3.isReady = true, e3.emit("ready");
          }), e3.on("video:ended", () => {
            a2.loop ? (e3.seek = 0, e3.play(), e3.controls.show = false, e3.mask.show = false) : (e3.controls.show = true, e3.mask.show = true);
          }), e3.on("video:error", async (i3) => {
            u < o2.RECONNECT_TIME_MAX ? (await (0, s.sleep)(o2.RECONNECT_SLEEP_TIME), u += 1, e3.url = a2.url, r2.show = `${t2.get("Reconnect")}: ${u}`, e3.emit("error", i3, u)) : (e3.mask.show = true, e3.loading.show = false, e3.controls.show = true, (0, s.addClass)(l2, "art-error"), await (0, s.sleep)(o2.RECONNECT_SLEEP_TIME), r2.show = t2.get("Video Load Failed"));
          }), e3.on("video:loadedmetadata", () => {
            e3.emit("resize"), s.isMobile && (e3.loading.show = false, e3.controls.show = true, e3.mask.show = true);
          }), e3.on("video:loadstart", () => {
            e3.loading.show = true, e3.mask.show = false, e3.controls.show = true;
          }), e3.on("video:pause", () => {
            e3.controls.show = true, e3.mask.show = true;
          }), e3.on("video:play", () => {
            e3.mask.show = false, (0, s.setStyle)(p, "display", "none");
          }), e3.on("video:playing", () => {
            e3.mask.show = false;
          }), e3.on("video:progress", () => {
            e3.playing && (e3.loading.show = false);
          }), e3.on("video:seeked", () => {
            e3.loading.show = false, e3.mask.show = true;
          }), e3.on("video:seeking", () => {
            e3.loading.show = true, e3.mask.show = false;
          }), e3.on("video:timeupdate", () => {
            e3.mask.show = false;
          }), e3.on("video:waiting", () => {
            e3.loading.show = true, e3.mask.show = false;
          });
        }
      }, { "../config": "eJfh8", "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], ea3Qm: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { template: { $player: t2 }, i18n: r2, notice: a2 } = e3;
          (0, i.def)(e3, "flip", { get: () => t2.dataset.flip || "normal", set(o2) {
            o2 || (o2 = "normal"), "normal" === o2 ? delete t2.dataset.flip : t2.dataset.flip = o2, a2.show = `${r2.get("Video Flip")}: ${r2.get((0, i.capitalize)(o2))}`, e3.emit("flip", o2);
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], ffXE3: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => l);
        var i = e2("../libs/screenfull"), n = o.interopDefault(i), s = e2("../utils");
        function l(e3) {
          let { i18n: t2, notice: r2, template: { $video: a2, $player: o2 } } = e3;
          e3.once("video:loadedmetadata", () => {
            n.default.isEnabled ? (n.default.on("change", () => {
              e3.emit("fullscreen", n.default.isFullscreen), n.default.isFullscreen ? (e3.state = "fullscreen", (0, s.addClass)(o2, "art-fullscreen")) : (0, s.removeClass)(o2, "art-fullscreen"), e3.emit("resize");
            }), n.default.on("error", (t3) => {
              e3.emit("fullscreenError", t3);
            }), (0, s.def)(e3, "fullscreen", { get: () => n.default.isFullscreen, async set(e4) {
              e4 ? await n.default.request(o2) : await n.default.exit();
            } })) : a2.webkitSupportsFullscreen ? (e3.on("document:webkitfullscreenchange", () => {
              e3.emit("fullscreen", e3.fullscreen), e3.emit("resize");
            }), (0, s.def)(e3, "fullscreen", { get: () => document.fullscreenElement === a2, set(t3) {
              t3 ? (e3.state = "fullscreen", a2.webkitEnterFullscreen()) : a2.webkitExitFullscreen();
            } })) : (0, s.def)(e3, "fullscreen", { get: () => false, set() {
              r2.show = t2.get("Fullscreen Not Supported");
            } }), (0, s.def)(e3, "fullscreen", (0, s.get)(e3, "fullscreen"));
          });
        }
      }, { "../libs/screenfull": "iSPAQ", "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], iSPAQ: [function(e2, t, r, a) {
        e2("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r);
        let o = [["requestFullscreen", "exitFullscreen", "fullscreenElement", "fullscreenEnabled", "fullscreenchange", "fullscreenerror"], ["webkitRequestFullscreen", "webkitExitFullscreen", "webkitFullscreenElement", "webkitFullscreenEnabled", "webkitfullscreenchange", "webkitfullscreenerror"], ["webkitRequestFullScreen", "webkitCancelFullScreen", "webkitCurrentFullScreenElement", "webkitCancelFullScreen", "webkitfullscreenchange", "webkitfullscreenerror"], ["mozRequestFullScreen", "mozCancelFullScreen", "mozFullScreenElement", "mozFullScreenEnabled", "mozfullscreenchange", "mozfullscreenerror"], ["msRequestFullscreen", "msExitFullscreen", "msFullscreenElement", "msFullscreenEnabled", "MSFullscreenChange", "MSFullscreenError"]], i = (() => {
          if ("undefined" == typeof document) return false;
          let e3 = o[0], t2 = {};
          for (let r2 of o) if (r2[1] in document) {
            for (let [a2, o2] of r2.entries()) t2[e3[a2]] = o2;
            return t2;
          }
          return false;
        })(), n = { change: i.fullscreenchange, error: i.fullscreenerror }, s = { request: (e3 = document.documentElement, t2) => new Promise((r2, a2) => {
          let o2 = () => {
            s.off("change", o2), r2();
          };
          s.on("change", o2);
          let n2 = e3[i.requestFullscreen](t2);
          n2 instanceof Promise && n2.then(o2).catch(a2);
        }), exit: () => new Promise((e3, t2) => {
          if (!s.isFullscreen) return void e3();
          let r2 = () => {
            s.off("change", r2), e3();
          };
          s.on("change", r2);
          let a2 = document[i.exitFullscreen]();
          a2 instanceof Promise && a2.then(r2).catch(t2);
        }), toggle: (e3, t2) => s.isFullscreen ? s.exit() : s.request(e3, t2), onchange(e3) {
          s.on("change", e3);
        }, onerror(e3) {
          s.on("error", e3);
        }, on(e3, t2) {
          let r2 = n[e3];
          r2 && document.addEventListener(r2, t2, false);
        }, off(e3, t2) {
          let r2 = n[e3];
          r2 && document.removeEventListener(r2, t2, false);
        }, raw: i };
        Object.defineProperties(s, { isFullscreen: { get: () => !!document[i.fullscreenElement] }, element: { enumerable: true, get: () => document[i.fullscreenElement] }, isEnabled: { enumerable: true, get: () => !!document[i.fullscreenEnabled] } }), r.default = s;
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "8tarF": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { constructor: t2, template: { $container: r2, $player: a2 } } = e3, o2 = "";
          (0, i.def)(e3, "fullscreenWeb", { get: () => (0, i.hasClass)(a2, "art-fullscreen-web"), set(n2) {
            n2 ? (o2 = a2.style.cssText, t2.FULLSCREEN_WEB_IN_BODY && (0, i.append)(document.body, a2), e3.state = "fullscreenWeb", (0, i.setStyle)(a2, "width", "100%"), (0, i.setStyle)(a2, "height", "100%"), (0, i.addClass)(a2, "art-fullscreen-web"), e3.emit("fullscreenWeb", true)) : (t2.FULLSCREEN_WEB_IN_BODY && (0, i.append)(r2, a2), o2 && (a2.style.cssText = o2, o2 = ""), (0, i.removeClass)(a2, "art-fullscreen-web"), e3.emit("fullscreenWeb", false)), e3.emit("resize");
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], f9syH: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { $video: t2 } = e3.template;
          (0, i.def)(e3, "loaded", { get: () => e3.loadedTime / t2.duration }), (0, i.def)(e3, "loadedTime", { get: () => t2.buffered.length ? t2.buffered.end(t2.buffered.length - 1) : 0 });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], dLuS7: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { icons: t2, proxy: r2, storage: a2, template: { $player: o2, $video: n2 } } = e3, s = false, l = 0, c = 0;
          function p() {
            let { $mini: t3 } = e3.template;
            t3 && ((0, i.removeClass)(o2, "art-mini"), (0, i.setStyle)(t3, "display", "none"), o2.prepend(n2), e3.emit("mini", false));
          }
          function u(t3, r3) {
            e3.playing ? ((0, i.setStyle)(t3, "display", "none"), (0, i.setStyle)(r3, "display", "flex")) : ((0, i.setStyle)(t3, "display", "flex"), (0, i.setStyle)(r3, "display", "none"));
          }
          function d() {
            let { $mini: t3 } = e3.template, r3 = (0, i.getRect)(t3), o3 = window.innerHeight - r3.height - 50, n3 = window.innerWidth - r3.width - 50;
            a2.set("top", o3), a2.set("left", n3), (0, i.setStyle)(t3, "top", `${o3}px`), (0, i.setStyle)(t3, "left", `${n3}px`);
          }
          (0, i.def)(e3, "mini", { get: () => (0, i.hasClass)(o2, "art-mini"), set(f) {
            if (f) {
              e3.state = "mini", (0, i.addClass)(o2, "art-mini");
              let f2 = (function() {
                let { $mini: o3 } = e3.template;
                if (o3) return (0, i.append)(o3, n2), (0, i.setStyle)(o3, "display", "flex");
                {
                  let o4 = (0, i.createElement)("div");
                  (0, i.addClass)(o4, "art-mini-popup"), (0, i.append)(document.body, o4), e3.template.$mini = o4, (0, i.append)(o4, n2);
                  let d2 = (0, i.append)(o4, '<div class="art-mini-close"></div>');
                  (0, i.append)(d2, t2.close), r2(d2, "click", p);
                  let f3 = (0, i.append)(o4, '<div class="art-mini-state"></div>'), h2 = (0, i.append)(f3, t2.play), m2 = (0, i.append)(f3, t2.pause);
                  return r2(h2, "click", () => e3.play()), r2(m2, "click", () => e3.pause()), u(h2, m2), e3.on("video:playing", () => u(h2, m2)), e3.on("video:pause", () => u(h2, m2)), e3.on("video:timeupdate", () => u(h2, m2)), r2(o4, "mousedown", (e4) => {
                    s = 0 === e4.button, l = e4.pageX, c = e4.pageY;
                  }), e3.on("document:mousemove", (e4) => {
                    if (s) {
                      (0, i.addClass)(o4, "art-mini-dragging");
                      let t3 = e4.pageX - l, r3 = e4.pageY - c;
                      (0, i.setStyle)(o4, "transform", `translate(${t3}px, ${r3}px)`);
                    }
                  }), e3.on("document:mouseup", () => {
                    if (s) {
                      s = false, (0, i.removeClass)(o4, "art-mini-dragging");
                      let e4 = (0, i.getRect)(o4);
                      a2.set("left", e4.left), a2.set("top", e4.top), (0, i.setStyle)(o4, "left", `${e4.left}px`), (0, i.setStyle)(o4, "top", `${e4.top}px`), (0, i.setStyle)(o4, "transform", null);
                    }
                  }), o4;
                }
              })(), h = a2.get("top"), m = a2.get("left");
              "number" == typeof h && "number" == typeof m ? ((0, i.setStyle)(f2, "top", `${h}px`), (0, i.setStyle)(f2, "left", `${m}px`), (0, i.isInViewport)(f2) || d()) : d(), e3.emit("mini", true);
            } else p();
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], d1F69: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { option: t2, storage: r2, template: { $video: a2, $poster: o2 } } = e3;
          for (let r3 in t2.moreVideoAttr) e3.attr(r3, t2.moreVideoAttr[r3]);
          t2.muted && (e3.muted = t2.muted), t2.volume && (a2.volume = (0, i.clamp)(t2.volume, 0, 1));
          let n2 = r2.get("volume");
          for (let r3 in "number" == typeof n2 && (a2.volume = (0, i.clamp)(n2, 0, 1)), t2.poster && (0, i.setStyle)(o2, "backgroundImage", `url(${t2.poster})`), t2.autoplay && (a2.autoplay = t2.autoplay), t2.playsInline && (a2.playsInline = true, a2["webkit-playsinline"] = true), t2.theme && (t2.cssVar["--art-theme"] = t2.theme), t2.cssVar) e3.cssVar(r3, t2.cssVar[r3]);
          e3.url = t2.url;
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], kewk9: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { template: { $video: t2 }, i18n: r2, notice: a2 } = e3;
          (0, i.def)(e3, "pause", { value() {
            let o2 = t2.pause();
            return a2.show = r2.get("Pause"), e3.emit("pause"), o2;
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "4XzDs": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { i18n: t2, notice: r2, template: { $video: a2 } } = e3;
          if (document.pictureInPictureEnabled) {
            let { template: { $video: t3 }, proxy: r3, notice: a3 } = e3;
            t3.disablePictureInPicture = false, (0, i.def)(e3, "pip", { get: () => document.pictureInPictureElement, set(r4) {
              r4 ? (e3.state = "pip", t3.requestPictureInPicture().catch((e4) => {
                throw a3.show = e4, e4;
              })) : document.exitPictureInPicture().catch((e4) => {
                throw a3.show = e4, e4;
              });
            } }), r3(t3, "enterpictureinpicture", () => {
              e3.emit("pip", true);
            }), r3(t3, "leavepictureinpicture", () => {
              e3.emit("pip", false);
            });
          } else if (a2.webkitSupportsPresentationMode) {
            let { $video: t3 } = e3.template;
            t3.webkitSetPresentationMode("inline"), (0, i.def)(e3, "pip", { get: () => "picture-in-picture" === t3.webkitPresentationMode, set(r3) {
              r3 ? (e3.state = "pip", t3.webkitSetPresentationMode("picture-in-picture"), e3.emit("pip", true)) : (t3.webkitSetPresentationMode("inline"), e3.emit("pip", false));
            } });
          } else (0, i.def)(e3, "pip", { get: () => false, set() {
            r2.show = t2.get("PIP Not Supported");
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], jphfi: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { template: { $video: t2 }, i18n: r2, notice: a2 } = e3;
          (0, i.def)(e3, "playbackRate", { get: () => t2.playbackRate, set(o2) {
            o2 ? o2 !== t2.playbackRate && (t2.playbackRate = o2, a2.show = `${r2.get("Rate")}: ${1 === o2 ? r2.get("Normal") : `${o2}x`}`) : e3.playbackRate = 1;
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], iNpeS: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          (0, i.def)(e3, "played", { get: () => e3.currentTime / e3.duration });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], aBIWL: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { $video: t2 } = e3.template;
          (0, i.def)(e3, "playing", { get: () => "boolean" == typeof t2.playing ? t2.playing : !!(t2.currentTime > 0 && !t2.paused && !t2.ended && t2.readyState > 2) });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], hRBri: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { i18n: t2, notice: r2, option: a2, constructor: { instances: o2 }, template: { $video: n2 } } = e3;
          (0, i.def)(e3, "play", { async value() {
            let i2 = await n2.play();
            if (r2.show = t2.get("Play"), e3.emit("play"), a2.mutex) for (let t3 = 0; t3 < o2.length; t3++) {
              let r3 = o2[t3];
              r3 !== e3 && r3.pause();
            }
            return i2;
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], fgfXC: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { template: { $poster: t2 } } = e3;
          (0, i.def)(e3, "poster", { get: () => {
            try {
              return t2.style.backgroundImage.match(/"(.*)"/)[1];
            } catch {
              return "";
            }
          }, set(e4) {
            (0, i.setStyle)(t2, "backgroundImage", `url(${e4})`);
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "17rUP": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          (0, i.def)(e3, "quality", { set(t2) {
            let { controls: r2, notice: a2, i18n: o2 } = e3, i2 = t2.find((e4) => e4.default) || t2[0];
            r2.update({ name: "quality", position: "right", index: 10, style: { marginRight: "10px" }, html: i2?.html || "", selector: t2, onSelect: async (t3) => (await e3.switchQuality(t3.url), a2.show = `${o2.get("Switch Video")}: ${t3.html}`, t3.html) });
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "55qzI": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          (0, i.def)(e3, "rect", { get: () => (0, i.getRect)(e3.template.$player) });
          let t2 = ["bottom", "height", "left", "right", "top", "width"];
          for (let r2 = 0; r2 < t2.length; r2++) {
            let a2 = t2[r2];
            (0, i.def)(e3, a2, { get: () => e3.rect[a2] });
          }
          (0, i.def)(e3, "x", { get: () => e3.left + window.pageXOffset }), (0, i.def)(e3, "y", { get: () => e3.top + window.pageYOffset });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], bC6TG: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { notice: t2, template: { $video: r2 } } = e3, a2 = (0, i.createElement)("canvas");
          (0, i.def)(e3, "getDataURL", { value: () => new Promise((e4, o2) => {
            try {
              a2.width = r2.videoWidth, a2.height = r2.videoHeight, a2.getContext("2d").drawImage(r2, 0, 0), e4(a2.toDataURL("image/png"));
            } catch (e5) {
              t2.show = e5, o2(e5);
            }
          }) }), (0, i.def)(e3, "getBlobUrl", { value: () => new Promise((e4, o2) => {
            try {
              a2.width = r2.videoWidth, a2.height = r2.videoHeight, a2.getContext("2d").drawImage(r2, 0, 0), a2.toBlob((t3) => {
                e4(URL.createObjectURL(t3));
              });
            } catch (e5) {
              t2.show = e5, o2(e5);
            }
          }) }), (0, i.def)(e3, "screenshot", { value: async (t3) => {
            let a3 = await e3.getDataURL(), o2 = t3 || `artplayer_${(0, i.secondToTime)(r2.currentTime)}`;
            return (0, i.download)(a3, `${o2}.png`), e3.emit("screenshot", a3), a3;
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], j8GRO: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { notice: t2 } = e3;
          (0, i.def)(e3, "seek", { set(r2) {
            e3.currentTime = r2, e3.duration && (t2.show = `${(0, i.secondToTime)(e3.currentTime)} / ${(0, i.secondToTime)(e3.duration)}`), e3.emit("seek", e3.currentTime);
          } }), (0, i.def)(e3, "forward", { set(t3) {
            e3.seek = e3.currentTime + t3;
          } }), (0, i.def)(e3, "backward", { set(t3) {
            e3.seek = e3.currentTime - t3;
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], cn7iR: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let t2 = ["mini", "pip", "fullscreen", "fullscreenWeb"];
          (0, i.def)(e3, "state", { get: () => t2.find((t3) => e3[t3]) || "standard", set(r2) {
            for (let a2 = 0; a2 < t2.length; a2++) {
              let o2 = t2[a2];
              o2 !== r2 && e3[o2] && (e3[o2] = false);
            }
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "2k4nP": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { notice: t2, i18n: r2, template: a2 } = e3;
          (0, i.def)(e3, "subtitleOffset", { get: () => a2.$track?.offset || 0, set(o2) {
            let { cues: n2 } = e3.subtitle;
            if (!a2.$track || 0 === n2.length) return;
            let s = (0, i.clamp)(o2, -10, 10);
            a2.$track.offset = s;
            for (let t3 = 0; t3 < n2.length; t3++) {
              let r3 = n2[t3];
              r3.originalStartTime = r3.originalStartTime ?? r3.startTime, r3.originalEndTime = r3.originalEndTime ?? r3.endTime, r3.startTime = (0, i.clamp)(r3.originalStartTime + s, 0, e3.duration), r3.endTime = (0, i.clamp)(r3.originalEndTime + s, 0, e3.duration);
            }
            e3.subtitle.update(), t2.show = `${r2.get("Subtitle Offset")}: ${o2}s`, e3.emit("subtitleOffset", o2);
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "6SU6j": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          function t2(t3, r2) {
            return new Promise((a2, o2) => {
              if (t3 === e3.url) return;
              let { playing: i2, aspectRatio: n2, playbackRate: s } = e3;
              e3.pause(), e3.url = t3, e3.notice.show = "", e3.once("video:error", o2), e3.once("video:loadedmetadata", () => {
                e3.currentTime = r2;
              }), e3.once("video:canplay", async () => {
                e3.playbackRate = s, e3.aspectRatio = n2, i2 && await e3.play(), e3.notice.show = "", a2();
              });
            });
          }
          (0, i.def)(e3, "switchQuality", { value: (r2) => t2(r2, e3.currentTime) }), (0, i.def)(e3, "switchUrl", { value: (e4) => t2(e4, 0) }), (0, i.def)(e3, "switch", { set: e3.switchUrl });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "7iMuh": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          (0, i.def)(e3, "theme", { get: () => e3.cssVar("--art-theme"), set(t2) {
            e3.cssVar("--art-theme", t2);
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "6P0RS": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { events: t2, option: r2, template: { $progress: a2, $video: o2 } } = e3, n2 = null, s = null, l = false, c = false, p = false;
          t2.hover(a2, () => {
            p = true;
          }, () => {
            p = false;
          }), e3.on("setBar", async (t3, u, d) => {
            let f = e3.controls?.thumbnails, { url: h, scale: m } = r2.thumbnails;
            if (!f || !h) return;
            let g = "played" === t3 && d && i.isMobile;
            if ("hover" === t3 || g) {
              if (l || (l = true, s = await (0, i.loadImg)(h, m), c = true), !c || !p) return;
              let t4 = a2.clientWidth * u;
              (0, i.setStyle)(f, "display", "flex"), t4 > 0 && t4 < a2.clientWidth ? (function(t5) {
                let n3 = e3.controls?.thumbnails;
                if (!n3) return;
                let { number: l2, column: c2, width: p2, height: u2, scale: d2 } = r2.thumbnails, f2 = p2 * d2 || s.naturalWidth / c2, h2 = u2 * d2 || f2 / (o2.videoWidth / o2.videoHeight), m2 = Math.floor(t5 / (a2.clientWidth / l2)), g2 = Math.ceil(m2 / c2) - 1;
                (0, i.setStyle)(n3, "backgroundImage", `url(${s.src})`), (0, i.setStyle)(n3, "height", `${h2}px`), (0, i.setStyle)(n3, "width", `${f2}px`), (0, i.setStyle)(n3, "backgroundPosition", `-${(m2 % c2 || c2 - 1) * f2}px -${g2 * h2}px`), t5 <= f2 / 2 ? (0, i.setStyle)(n3, "left", 0) : t5 > a2.clientWidth - f2 / 2 ? (0, i.setStyle)(n3, "left", `${a2.clientWidth - f2}px`) : (0, i.setStyle)(n3, "left", `${t5 - f2 / 2}px`);
              })(t4) : i.isMobile || (0, i.setStyle)(f, "display", "none"), g && (clearTimeout(n2), n2 = setTimeout(() => {
                (0, i.setStyle)(f, "display", "none");
              }, 500));
            }
          }), (0, i.def)(e3, "thumbnails", { get: () => e3.option.thumbnails, set(t3) {
            t3.url && !e3.option.isLive && (e3.option.thumbnails = t3, clearTimeout(n2), n2 = null, s = null, l = false, c = false);
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], eNi78: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          (0, i.def)(e3, "toggle", { value: () => e3.playing ? e3.pause() : e3.play() });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "7AUBD": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          (0, i.def)(e3, "type", { get: () => e3.option.type, set(t2) {
            e3.option.type = t2;
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], cnlLL: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { option: t2, template: { $video: r2 } } = e3;
          (0, i.def)(e3, "url", { get: () => r2.src, async set(a2) {
            if (a2) {
              let o2 = e3.url, n2 = t2.type || (0, i.getExt)(a2), s = t2.customType[n2];
              n2 && s ? (await (0, i.sleep)(), e3.loading.show = true, s.call(e3, r2, a2, e3)) : (URL.revokeObjectURL(o2), r2.src = a2), o2 !== e3.url && (e3.option.url = a2, e3.isReady && o2 && e3.once("video:canplay", () => {
                e3.emit("restart", a2);
              }));
            } else await (0, i.sleep)(), e3.loading.show = true;
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], iX66j: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { template: { $video: t2 }, i18n: r2, notice: a2, storage: o2 } = e3;
          (0, i.def)(e3, "volume", { get: () => t2.volume || 0, set: (e4) => {
            t2.volume = (0, i.clamp)(e4, 0, 1), a2.show = `${r2.get("Volume")}: ${Number.parseInt(100 * t2.volume, 10)}`, 0 !== t2.volume && o2.set("volume", t2.volume);
          } }), (0, i.def)(e3, "muted", { get: () => t2.muted, set: (r3) => {
            t2.muted = r3, e3.emit("muted", r3);
          } });
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], cjxJL: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("../utils"), n = e2("./autoOrientation"), s = o.interopDefault(n), l = e2("./autoPlayback"), c = o.interopDefault(l), p = e2("./fastForward"), u = o.interopDefault(p), d = e2("./lock"), f = o.interopDefault(d), h = e2("./miniProgressBar"), m = o.interopDefault(h);
        r.default = class {
          constructor(e3) {
            this.art = e3, this.id = 0;
            let { option: t2 } = e3;
            t2.miniProgressBar && !t2.isLive && this.add(m.default), t2.lock && i.isMobile && this.add(f.default), t2.autoPlayback && !t2.isLive && this.add(c.default), t2.autoOrientation && i.isMobile && this.add(s.default), t2.fastForward && i.isMobile && !t2.isLive && this.add(u.default);
            for (let e4 = 0; e4 < t2.plugins.length; e4++) this.add(t2.plugins[e4]);
          }
          add(e3) {
            this.id += 1;
            let t2 = e3.call(this.art, this.art);
            return t2 instanceof Promise ? t2.then((t3) => this.next(e3, t3)) : this.next(e3, t2);
          }
          next(e3, t2) {
            let r2 = t2 && t2.name || e3.name || `plugin${this.id}`;
            return (0, i.errorHandle)(!(0, i.has)(this, r2), `Cannot add a plugin that already has the same name: ${r2}`), (0, i.def)(this, r2, { value: t2 }), this;
          }
        };
      }, { "../utils": "aBlEo", "./autoOrientation": "jb9jb", "./autoPlayback": "21HWM", "./fastForward": "4sxBO", "./lock": "fjy9V", "./miniProgressBar": "d0xRp", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], jb9jb: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { notice: t2, constructor: r2, template: { $player: a2, $video: o2 } } = e3, n2 = "art-auto-orientation", s = "art-auto-orientation-fullscreen", l = false;
          function c() {
            let { videoWidth: e4, videoHeight: t3 } = o2, r3 = document.documentElement.clientWidth, a3 = document.documentElement.clientHeight;
            return e4 > t3 && r3 < a3 || e4 < t3 && r3 > a3;
          }
          return e3.on("fullscreenWeb", (t3) => {
            t3 ? c() && setTimeout(() => {
              e3.fullscreenWeb && !(0, i.hasClass)(a2, n2) && (function() {
                let t4 = document.documentElement.clientWidth, r3 = document.documentElement.clientHeight;
                (0, i.setStyle)(a2, "width", `${r3}px`), (0, i.setStyle)(a2, "height", `${t4}px`), (0, i.setStyle)(a2, "transform-origin", "0 0"), (0, i.setStyle)(a2, "transform", `rotate(90deg) translate(0, -${t4}px)`), (0, i.addClass)(a2, n2), e3.isRotate = true, e3.emit("resize");
              })();
            }, Number(r2.AUTO_ORIENTATION_TIME ?? 0)) : (0, i.hasClass)(a2, n2) && ((0, i.setStyle)(a2, "width", ""), (0, i.setStyle)(a2, "height", ""), (0, i.setStyle)(a2, "transform-origin", ""), (0, i.setStyle)(a2, "transform", ""), (0, i.removeClass)(a2, n2), e3.isRotate = false, e3.emit("resize"));
          }), e3.on("fullscreen", async (e4) => {
            let r3 = !!screen?.orientation?.lock;
            if (e4) {
              if (r3 && c()) try {
                let e5 = screen.orientation.type.startsWith("portrait") ? "landscape" : "portrait";
                await screen.orientation.lock(e5), l = true, (0, i.addClass)(a2, s);
              } catch (e5) {
                l = false, t2.show = e5;
              }
            } else if ((0, i.hasClass)(a2, s) && (0, i.removeClass)(a2, s), r3 && l) {
              try {
                screen.orientation.unlock();
              } catch {
              }
              l = false;
            }
          }), { name: "autoOrientation", get state() {
            return (0, i.hasClass)(a2, n2);
          } };
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "21HWM": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { i18n: t2, icons: r2, storage: a2, constructor: o2, proxy: n2, template: { $poster: s } } = e3, l = e3.layers.add({ name: "auto-playback", html: `<div class="art-auto-playback-close"></div><div class="art-auto-playback-last"></div><div class="art-auto-playback-jump"></div>` }), c = (0, i.query)(".art-auto-playback-last", l), p = (0, i.query)(".art-auto-playback-jump", l), u = (0, i.query)(".art-auto-playback-close", l);
          (0, i.append)(u, r2.close);
          let d = null;
          function f() {
            let r3 = (a2.get("times") || {})[e3.option.id || e3.option.url];
            clearTimeout(d), (0, i.setStyle)(l, "display", "none"), r3 && r3 >= o2.AUTO_PLAYBACK_MIN && ((0, i.setStyle)(l, "display", "flex"), c.textContent = `${t2.get("Last Seen")} ${(0, i.secondToTime)(r3)}`, p.textContent = t2.get("Jump Play"), n2(u, "click", () => {
              (0, i.setStyle)(l, "display", "none");
            }), n2(p, "click", () => {
              e3.seek = r3, e3.play(), (0, i.setStyle)(s, "display", "none"), (0, i.setStyle)(l, "display", "none");
            }), e3.once("video:timeupdate", () => {
              d = setTimeout(() => {
                (0, i.setStyle)(l, "display", "none");
              }, o2.AUTO_PLAYBACK_TIMEOUT);
            }));
          }
          return e3.on("video:timeupdate", () => {
            if (e3.playing) {
              let t3 = a2.get("times") || {}, r3 = Object.keys(t3);
              r3.length > o2.AUTO_PLAYBACK_MAX && delete t3[r3[0]], t3[e3.option.id || e3.option.url] = e3.currentTime, a2.set("times", t3);
            }
          }), e3.on("ready", f), e3.on("restart", f), { name: "auto-playback", get times() {
            return a2.get("times") || {};
          }, clear: () => a2.del("times"), delete(e4) {
            let t3 = a2.get("times") || {};
            return delete t3[e4], a2.set("times", t3), t3;
          } };
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "4sxBO": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { constructor: t2, proxy: r2, template: { $player: a2, $video: o2 } } = e3, n2 = null, s = false, l = 1, c = () => {
            clearTimeout(n2), s && (s = false, e3.playbackRate = l, (0, i.removeClass)(a2, "art-fast-forward"));
          };
          return r2(o2, "touchstart", (r3) => {
            1 === r3.touches.length && e3.playing && !e3.isLock && (n2 = setTimeout(() => {
              s = true, l = e3.playbackRate, e3.playbackRate = t2.FAST_FORWARD_VALUE, (0, i.addClass)(a2, "art-fast-forward");
            }, t2.FAST_FORWARD_TIME));
          }), e3.on("document:touchmove", c), e3.on("document:touchend", c), { name: "fastForward", get state() {
            return (0, i.hasClass)(a2, "art-fast-forward");
          } };
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], fjy9V: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { layers: t2, icons: r2, template: { $player: a2 } } = e3;
          function o2() {
            return (0, i.hasClass)(a2, "art-lock");
          }
          function n2() {
            (0, i.addClass)(a2, "art-lock"), e3.isLock = true, e3.emit("lock", true);
          }
          function s() {
            (0, i.removeClass)(a2, "art-lock"), e3.isLock = false, e3.emit("lock", false);
          }
          return t2.add({ name: "lock", mounted(t3) {
            let a3 = (0, i.append)(t3, r2.lock), o3 = (0, i.append)(t3, r2.unlock);
            (0, i.setStyle)(a3, "display", "none"), e3.on("lock", (e4) => {
              e4 ? ((0, i.setStyle)(a3, "display", "inline-flex"), (0, i.setStyle)(o3, "display", "none")) : ((0, i.setStyle)(a3, "display", "none"), (0, i.setStyle)(o3, "display", "inline-flex"));
            });
          }, click() {
            o2() ? s() : n2();
          } }), { name: "lock", get state() {
            return o2();
          }, set state(value) {
            value ? n2() : s();
          } };
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], d0xRp: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          return e3.on("control", (t2) => {
            t2 ? (0, i.removeClass)(e3.template.$player, "art-mini-progress-bar") : (0, i.addClass)(e3.template.$player, "art-mini-progress-bar");
          }), { name: "mini-progress-bar" };
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], bwLGT: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("../utils"), n = e2("../utils/component"), s = o.interopDefault(n), l = e2("./aspectRatio"), c = o.interopDefault(l), p = e2("./flip"), u = o.interopDefault(p), d = e2("./playbackRate"), f = o.interopDefault(d), h = e2("./subtitleOffset"), m = o.interopDefault(h);
        class g extends s.default {
          constructor(e3) {
            super(e3);
            let { option: t2, controls: r2, template: { $setting: a2 } } = e3;
            this.name = "setting", this.$parent = a2, this.id = 0, this.active = null, this.cache = new Map(), this.option = [...this.builtin, ...t2.settings], t2.setting && (this.format(), this.render(), e3.on("blur", () => {
              this.show && (this.show = false, this.render());
            }), e3.on("focus", (e4) => {
              let t3 = (0, i.includeFromEvent)(e4, r2.setting), a3 = (0, i.includeFromEvent)(e4, this.$parent);
              !this.show || t3 || a3 || (this.show = false, this.render());
            }), e3.on("resize", () => this.resize()));
          }
          get builtin() {
            let e3 = [], { option: t2 } = this.art;
            return t2.playbackRate && e3.push((0, f.default)(this.art)), t2.aspectRatio && e3.push((0, c.default)(this.art)), t2.flip && e3.push((0, u.default)(this.art)), t2.subtitleOffset && e3.push((0, m.default)(this.art)), e3;
          }
          traverse(e3, t2 = this.option) {
            for (let r2 = 0; r2 < t2.length; r2++) {
              let a2 = t2[r2];
              e3(a2), a2.selector?.length && this.traverse(e3, a2.selector);
            }
          }
          check(e3) {
            e3.$parent.tooltip = e3.html, this.traverse((t2) => {
              t2.default = t2 === e3, t2.default && t2.$item && (0, i.inverseClass)(t2.$item, "art-current");
            }, e3.$option), this.render(e3.$parents);
          }
          format(e3 = this.option, t2, r2, a2 = []) {
            for (let o2 = 0; o2 < e3.length; o2++) {
              let n2 = e3[o2];
              if (n2?.name ? ((0, i.errorHandle)(!a2.includes(n2.name), `The [${n2.name}] already exists in [setting]`), a2.push(n2.name)) : n2.name = `setting-${this.id++}`, !n2.$formatted) {
                (0, i.def)(n2, "$parent", { get: () => t2 }), (0, i.def)(n2, "$parents", { get: () => r2 }), (0, i.def)(n2, "$option", { get: () => e3 });
                let a3 = [];
                (0, i.def)(n2, "$events", { get: () => a3 }), (0, i.def)(n2, "$formatted", { get: () => true });
              }
              this.format(n2.selector || [], n2, e3, a2);
            }
            this.option = e3;
          }
          find(e3 = "") {
            let t2 = null;
            return this.traverse((r2) => {
              r2.name === e3 && (t2 = r2);
            }), t2;
          }
          resize() {
            let { controls: e3, constructor: { SETTING_WIDTH: t2, SETTING_ITEM_HEIGHT: r2 }, template: { $player: a2, $setting: o2 } } = this.art;
            if (e3.setting && this.show) {
              let n2 = this.active[0]?.$parent?.width || t2, { left: s2, width: l2 } = (0, i.getRect)(e3.setting), { left: c2, width: p2 } = (0, i.getRect)(a2), u2 = s2 - c2 + l2 / 2 - n2 / 2, d2 = this.active === this.option ? this.active.length * r2 : (this.active.length + 1) * r2;
              if ((0, i.setStyle)(o2, "height", `${d2}px`), (0, i.setStyle)(o2, "width", `${n2}px`), this.art.isRotate || i.isMobile) return;
              u2 + n2 > p2 ? ((0, i.setStyle)(o2, "left", null), (0, i.setStyle)(o2, "right", null)) : ((0, i.setStyle)(o2, "left", `${u2}px`), (0, i.setStyle)(o2, "right", "auto"));
            }
          }
          inactivate(e3) {
            for (let t2 = 0; t2 < e3.$events.length; t2++) this.art.events.remove(e3.$events[t2]);
            e3.$events.length = 0;
          }
          remove(e3) {
            let t2 = this.find(e3);
            (0, i.errorHandle)(t2, `Can't find [${e3}] in the [setting]`);
            let r2 = t2.$option.indexOf(t2);
            t2.$option.splice(r2, 1), this.inactivate(t2), t2.$item && (0, i.remove)(t2.$item), this.render();
          }
          update(e3) {
            let t2 = this.find(e3.name);
            return t2 ? (this.inactivate(t2), Object.assign(t2, e3), this.format(), this.createItem(t2, true), this.render(), t2) : this.add(e3);
          }
          add(e3, t2 = this.option) {
            return t2.push(e3), this.format(), this.createItem(e3), this.render(), e3;
          }
          createHeader(e3) {
            if (!this.cache.has(e3.$option)) return;
            let t2 = this.cache.get(e3.$option), { proxy: r2, icons: { arrowLeft: a2 }, constructor: { SETTING_ITEM_HEIGHT: o2 } } = this.art, n2 = (0, i.createElement)("div");
            (0, i.setStyle)(n2, "height", `${o2}px`), (0, i.addClass)(n2, "art-setting-item"), (0, i.addClass)(n2, "art-setting-item-back");
            let s2 = (0, i.append)(n2, '<div class="art-setting-item-left"></div>'), l2 = (0, i.createElement)("div");
            (0, i.addClass)(l2, "art-setting-item-left-icon"), (0, i.append)(l2, a2), (0, i.append)(s2, l2), (0, i.append)(s2, e3.$parent.html);
            let c2 = r2(n2, "click", () => this.render(e3.$parents));
            e3.$parent.$events.push(c2), (0, i.append)(t2, n2);
          }
          createItem(e3, t2 = false) {
            if (!this.cache.has(e3.$option)) return;
            let r2 = this.cache.get(e3.$option), a2 = e3.$item, o2 = "selector";
            (0, i.has)(e3, "switch") && (o2 = "switch"), (0, i.has)(e3, "range") && (o2 = "range"), (0, i.has)(e3, "onClick") && (o2 = "button");
            let { icons: n2, proxy: s2, constructor: l2 } = this.art, c2 = (0, i.createElement)("div");
            (0, i.addClass)(c2, "art-setting-item"), (0, i.setStyle)(c2, "height", `${l2.SETTING_ITEM_HEIGHT}px`), c2.dataset.name = e3.name || "", c2.dataset.value = e3.value || "";
            let p2 = (0, i.append)(c2, '<div class="art-setting-item-left"></div>'), u2 = (0, i.append)(c2, '<div class="art-setting-item-right"></div>'), d2 = (0, i.createElement)("div");
            switch ((0, i.addClass)(d2, "art-setting-item-left-icon"), o2) {
              case "button":
              case "switch":
              case "range":
                (0, i.append)(d2, e3.icon || n2.config);
                break;
              case "selector":
                e3.selector?.length ? (0, i.append)(d2, e3.icon || n2.config) : (0, i.append)(d2, n2.check);
            }
            (0, i.append)(p2, d2), (0, i.def)(e3, "$icon", { configurable: true, get: () => d2 }), (0, i.def)(e3, "icon", { configurable: true, get: () => d2.innerHTML, set(e4) {
              d2.innerHTML = "", (0, i.append)(d2, e4);
            } });
            let f2 = (0, i.createElement)("div");
            (0, i.addClass)(f2, "art-setting-item-left-text"), (0, i.append)(f2, e3.html || ""), (0, i.append)(p2, f2), (0, i.def)(e3, "$html", { configurable: true, get: () => f2 }), (0, i.def)(e3, "html", { configurable: true, get: () => f2.innerHTML, set(e4) {
              f2.innerHTML = "", (0, i.append)(f2, e4);
            } });
            let h2 = (0, i.createElement)("div");
            switch ((0, i.addClass)(h2, "art-setting-item-right-tooltip"), (0, i.append)(h2, e3.tooltip || ""), (0, i.append)(u2, h2), (0, i.def)(e3, "$tooltip", { configurable: true, get: () => h2 }), (0, i.def)(e3, "tooltip", { configurable: true, get: () => h2.innerHTML, set(e4) {
              h2.innerHTML = "", (0, i.append)(h2, e4);
            } }), o2) {
              case "switch": {
                let t3 = (0, i.createElement)("div");
                (0, i.addClass)(t3, "art-setting-item-right-icon");
                let r3 = (0, i.append)(t3, n2.switchOn), a3 = (0, i.append)(t3, n2.switchOff);
                (0, i.setStyle)(e3.switch ? a3 : r3, "display", "none"), (0, i.append)(u2, t3), (0, i.def)(e3, "$switch", { configurable: true, get: () => t3 });
                let o3 = e3.switch;
                (0, i.def)(e3, "switch", { configurable: true, get: () => o3, set(e4) {
                  o3 = e4, e4 ? ((0, i.setStyle)(a3, "display", "none"), (0, i.setStyle)(r3, "display", null)) : ((0, i.setStyle)(a3, "display", null), (0, i.setStyle)(r3, "display", "none"));
                } });
                break;
              }
              case "range":
                {
                  let t3 = (0, i.createElement)("div");
                  (0, i.addClass)(t3, "art-setting-item-right-icon");
                  let r3 = (0, i.append)(t3, '<input type="range">');
                  r3.value = e3.range[0], r3.min = e3.range[1], r3.max = e3.range[2], r3.step = e3.range[3], (0, i.addClass)(r3, "art-setting-range"), (0, i.append)(u2, t3), (0, i.def)(e3, "$range", { configurable: true, get: () => r3 });
                  let a3 = [...e3.range];
                  (0, i.def)(e3, "range", { configurable: true, get: () => a3, set(e4) {
                    a3 = [...e4], r3.value = e4[0], r3.min = e4[1], r3.max = e4[2], r3.step = e4[3];
                  } });
                }
                break;
              case "selector":
                if (e3.selector?.length) {
                  let e4 = (0, i.createElement)("div");
                  (0, i.addClass)(e4, "art-setting-item-right-icon"), (0, i.append)(e4, n2.arrowRight), (0, i.append)(u2, e4);
                }
            }
            switch (o2) {
              case "switch":
                if (e3.onSwitch) {
                  let t3 = s2(c2, "click", async (t4) => {
                    e3.switch = await e3.onSwitch.call(this.art, e3, c2, t4);
                  });
                  e3.$events.push(t3);
                }
                break;
              case "range":
                if (e3.$range) {
                  if (e3.onRange) {
                    let t3 = s2(e3.$range, "change", async (t4) => {
                      e3.range[0] = e3.$range.valueAsNumber, e3.tooltip = await e3.onRange.call(this.art, e3, c2, t4);
                    });
                    e3.$events.push(t3);
                  }
                  if (e3.onChange) {
                    let t3 = s2(e3.$range, "input", async (t4) => {
                      e3.range[0] = e3.$range.valueAsNumber, e3.tooltip = await e3.onChange.call(this.art, e3, c2, t4);
                    });
                    e3.$events.push(t3);
                  }
                }
                break;
              case "selector":
                {
                  let t3 = s2(c2, "click", async (t4) => {
                    e3.selector?.length ? this.render(e3.selector) : (this.check(e3), e3.$parent.onSelect && (e3.$parent.tooltip = await e3.$parent.onSelect.call(this.art, e3, c2, t4)));
                  });
                  e3.$events.push(t3), e3.default && (0, i.addClass)(c2, "art-current");
                }
                break;
              case "button":
                if (e3.onClick) {
                  let t3 = s2(c2, "click", async (t4) => {
                    e3.tooltip = await e3.onClick.call(this.art, e3, c2, t4);
                  });
                  e3.$events.push(t3);
                }
            }
            (0, i.def)(e3, "$item", { configurable: true, get: () => c2 }), t2 ? (0, i.replaceElement)(c2, a2) : (0, i.append)(r2, c2), e3.mounted && setTimeout(() => e3.mounted.call(this.art, e3.$item, e3), 0);
          }
          render(e3 = this.option) {
            if (this.active = e3, this.cache.has(e3)) {
              let t2 = this.cache.get(e3);
              (0, i.inverseClass)(t2, "art-current");
            } else {
              let t2 = (0, i.createElement)("div");
              this.cache.set(e3, t2), (0, i.addClass)(t2, "art-setting-panel"), (0, i.append)(this.$parent, t2), (0, i.inverseClass)(t2, "art-current"), e3[0]?.$parent && this.createHeader(e3[0]);
              for (let t3 = 0; t3 < e3.length; t3++) this.createItem(e3[t3]);
            }
            this.resize();
          }
        }
        r.default = g;
      }, { "../utils": "aBlEo", "../utils/component": "idCEj", "./aspectRatio": "cb8VK", "./flip": "ljJTO", "./playbackRate": "3QcSQ", "./subtitleOffset": "eB5hg", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], cb8VK: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3) {
          let { i18n: t2, icons: r2, constructor: { SETTING_ITEM_WIDTH: a2, ASPECT_RATIO: o2 } } = e3;
          function i2(e4) {
            return "default" === e4 ? t2.get("Default") : e4;
          }
          function n() {
            let t3 = e3.setting.find(`aspect-ratio-${e3.aspectRatio}`);
            e3.setting.check(t3);
          }
          return { width: a2, name: "aspect-ratio", html: t2.get("Aspect Ratio"), icon: r2.aspectRatio, tooltip: i2(e3.aspectRatio), selector: o2.map((t3) => ({ value: t3, name: `aspect-ratio-${t3}`, default: t3 === e3.aspectRatio, html: i2(t3) })), onSelect: (t3) => (e3.aspectRatio = t3.value, t3.html), mounted: () => {
            n(), e3.on("aspectRatio", () => n());
          } };
        }
        o.defineInteropFlag(r), o.export(r, "default", () => i);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], ljJTO: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r), o.export(r, "default", () => n);
        var i = e2("../utils");
        function n(e3) {
          let { i18n: t2, icons: r2, constructor: { SETTING_ITEM_WIDTH: a2, FLIP: o2 } } = e3;
          function n2(e4) {
            return t2.get((0, i.capitalize)(e4));
          }
          function s() {
            let t3 = e3.setting.find(`flip-${e3.flip}`);
            e3.setting.check(t3);
          }
          return { width: a2, name: "flip", html: t2.get("Video Flip"), tooltip: n2(e3.flip), icon: r2.flip, selector: o2.map((t3) => ({ value: t3, name: `flip-${t3}`, default: t3 === e3.flip, html: n2(t3) })), onSelect: (t3) => (e3.flip = t3.value, t3.html), mounted: () => {
            s(), e3.on("flip", () => s());
          } };
        }
      }, { "../utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "3QcSQ": [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3) {
          let { i18n: t2, icons: r2, constructor: { SETTING_ITEM_WIDTH: a2, PLAYBACK_RATE: o2 } } = e3;
          function i2(e4) {
            return 1 === e4 ? t2.get("Normal") : e4.toFixed(1);
          }
          function n() {
            let t3 = e3.setting.find(`playback-rate-${e3.playbackRate}`);
            e3.setting.check(t3);
          }
          return { width: a2, name: "playback-rate", html: t2.get("Play Speed"), tooltip: i2(e3.playbackRate), icon: r2.playbackRate, selector: o2.map((t3) => ({ value: t3, name: `playback-rate-${t3}`, default: t3 === e3.playbackRate, html: i2(t3) })), onSelect: (t3) => (e3.playbackRate = t3.value, t3.html), mounted: () => {
            n(), e3.on("video:ratechange", () => n());
          } };
        }
        o.defineInteropFlag(r), o.export(r, "default", () => i);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], eB5hg: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        function i(e3) {
          let { i18n: t2, icons: r2, constructor: a2 } = e3;
          return { width: a2.SETTING_ITEM_WIDTH, name: "subtitle-offset", html: t2.get("Subtitle Offset"), icon: r2.subtitle, tooltip: "0s", range: [0, -10, 10, 0.1], onChange: (t3) => (e3.subtitleOffset = t3.range[0], `${t3.range[0]}s`), mounted: (t3, r3) => {
            e3.on("subtitleOffset", (e4) => {
              r3.$range.value = e4, r3.tooltip = `${e4}s`;
            });
          } };
        }
        o.defineInteropFlag(r), o.export(r, "default", () => i);
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], kwqbK: [function(e2, t, r, a) {
        e2("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r), r.default = class {
          constructor() {
            this.name = "artplayer_settings", this.settings = {};
          }
          get(e3) {
            try {
              let t2 = JSON.parse(window.localStorage.getItem(this.name)) || {};
              return e3 ? t2[e3] : t2;
            } catch {
              return e3 ? this.settings[e3] : this.settings;
            }
          }
          set(e3, t2) {
            try {
              let r2 = Object.assign({}, this.get(), { [e3]: t2 });
              window.localStorage.setItem(this.name, JSON.stringify(r2));
            } catch {
              this.settings[e3] = t2;
            }
          }
          del(e3) {
            try {
              let t2 = this.get();
              delete t2[e3], window.localStorage.setItem(this.name, JSON.stringify(t2));
            } catch {
              delete this.settings[e3];
            }
          }
          clear() {
            try {
              window.localStorage.removeItem(this.name);
            } catch {
              this.settings = {};
            }
          }
        };
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], k5613: [function(e2, t, r, a) {
        var o = e2("@parcel/transformer-js/src/esmodule-helpers.js");
        o.defineInteropFlag(r);
        var i = e2("option-validator"), n = o.interopDefault(i), s = e2("./scheme"), l = o.interopDefault(s), c = e2("./utils"), p = e2("./utils/component"), u = o.interopDefault(p);
        class d extends u.default {
          constructor(e3) {
            super(e3), this.name = "subtitle", this.option = null, this.destroyEvent = () => null, this.init(e3.option.subtitle);
            let t2 = false;
            e3.on("video:timeupdate", () => {
              if (!this.url) return;
              let e4 = this.art.template.$video.webkitDisplayingFullscreen;
              "boolean" == typeof e4 && e4 !== t2 && (t2 = e4, this.createTrack(e4 ? "subtitles" : "metadata", this.url));
            });
          }
          get url() {
            return this.art.template.$track.src;
          }
          set url(e3) {
            this.switch(e3);
          }
          get textTrack() {
            return this.art.template.$video?.textTracks?.[0];
          }
          get activeCues() {
            return this.textTrack ? Array.from(this.textTrack.activeCues) : [];
          }
          get cues() {
            return this.textTrack ? Array.from(this.textTrack.cues) : [];
          }
          style(e3, t2) {
            let { $subtitle: r2 } = this.art.template;
            return "object" == typeof e3 ? (0, c.setStyles)(r2, e3) : (0, c.setStyle)(r2, e3, t2);
          }
          update() {
            let { option: { subtitle: e3 }, template: { $subtitle: t2 } } = this.art;
            t2.innerHTML = "", this.activeCues.length && (this.art.emit("subtitleBeforeUpdate", this.activeCues), t2.innerHTML = this.activeCues.map((t3, r2) => t3.text.split(/\r?\n/).filter((e4) => e4.trim()).map((t4) => `<div class="art-subtitle-line" data-group="${r2}">${e3.escape ? (0, c.escape)(t4) : t4}</div>`).join("")).join(""), this.art.emit("subtitleAfterUpdate", this.activeCues));
          }
          async switch(e3, t2 = {}) {
            let { i18n: r2, notice: a2, option: o2 } = this.art, i2 = { ...o2.subtitle, ...t2, url: e3 }, n2 = await this.init(i2);
            return t2.name && (a2.show = `${r2.get("Switch Subtitle")}: ${t2.name}`), n2;
          }
          createTrack(e3, t2) {
            let { template: r2, proxy: a2, option: o2 } = this.art, { $video: i2, $track: n2 } = r2, s2 = (0, c.createElement)("track");
            s2.default = true, s2.kind = e3, s2.src = t2, s2.label = o2.subtitle.name || "Artplayer", s2.track.mode = "hidden", s2.onload = () => {
              this.art.emit("subtitleLoad", this.cues, this.option);
            }, this.art.events.remove(this.destroyEvent), n2.onload = null, (0, c.remove)(n2), (0, c.append)(i2, s2), r2.$track = s2, this.destroyEvent = a2(this.textTrack, "cuechange", () => this.update());
          }
          async init(e3) {
            let { notice: t2, template: { $subtitle: r2 } } = this.art;
            return this.textTrack ? ((0, n.default)(e3, l.default.subtitle), e3.url) ? (this.option = e3, this.style(e3.style), fetch(e3.url).then((e4) => e4.arrayBuffer()).then((t3) => {
              let r3 = new TextDecoder(e3.encoding).decode(t3);
              switch (e3.type || (0, c.getExt)(e3.url)) {
                case "srt": {
                  let t4 = (0, c.srtToVtt)(r3), a2 = e3.onVttLoad(t4);
                  return (0, c.vttToBlob)(a2);
                }
                case "ass": {
                  let t4 = (0, c.assToVtt)(r3), a2 = e3.onVttLoad(t4);
                  return (0, c.vttToBlob)(a2);
                }
                case "vtt": {
                  let t4 = e3.onVttLoad(r3);
                  return (0, c.vttToBlob)(t4);
                }
                default:
                  return e3.url;
              }
            }).then((e4) => (r2.innerHTML = "", this.url === e4 || (URL.revokeObjectURL(this.url), this.createTrack("metadata", e4)), e4)).catch((e4) => {
              throw r2.innerHTML = "", t2.show = e4, e4;
            })) : void 0 : null;
          }
        }
        r.default = d;
      }, { "option-validator": "g7VGh", "./scheme": "biLjm", "./utils": "aBlEo", "./utils/component": "idCEj", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], fwOA1: [function(e2, t, r, a) {
        e2("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r);
        var o = e2("../package.json"), i = e2("./utils");
        class n {
          constructor(e3) {
            this.art = e3;
            let { option: t2, constructor: r2 } = e3;
            t2.container instanceof Element ? this.$container = t2.container : (this.$container = (0, i.query)(t2.container), (0, i.errorHandle)(this.$container, `No container element found by ${t2.container}`)), (0, i.errorHandle)((0, i.supportsFlex)(), "The current browser does not support flex layout");
            let a2 = this.$container.tagName.toLowerCase();
            (0, i.errorHandle)("div" === a2, `Unsupported container element type, only support 'div' but got '${a2}'`), (0, i.errorHandle)(r2.instances.every((e4) => e4.template.$container !== this.$container), "Cannot mount multiple instances on the same dom element"), this.query = this.query.bind(this), this.$container.dataset.artId = e3.id, this.init();
          }
          static get html() {
            return `<div class="art-video-player art-subtitle-show art-layer-show art-control-show art-mask-show"><video class="art-video"><track default kind="metadata" src=""></track></video><div class="art-poster"></div><div class="art-subtitle"></div><div class="art-danmuku"></div><div class="art-layers"></div><div class="art-mask"><div class="art-state"></div></div><div class="art-bottom"><div class="art-progress"></div><div class="art-controls"><div class="art-controls-left"></div><div class="art-controls-center"></div><div class="art-controls-right"></div></div></div><div class="art-loading"></div><div class="art-notice"><div class="art-notice-inner"></div></div><div class="art-settings"></div><div class="art-info"><div class="art-info-panel"><div class="art-info-item"><div class="art-info-title">Player version:</div><div class="art-info-content">${o.version}</div></div><div class="art-info-item"><div class="art-info-title">Video url:</div><div class="art-info-content" data-video="src"></div></div><div class="art-info-item"><div class="art-info-title">Video volume:</div><div class="art-info-content" data-video="volume"></div></div><div class="art-info-item"><div class="art-info-title">Video time:</div><div class="art-info-content" data-video="currentTime"></div></div><div class="art-info-item"><div class="art-info-title">Video duration:</div><div class="art-info-content" data-video="duration"></div></div><div class="art-info-item"><div class="art-info-title">Video resolution:</div><div class="art-info-content"><span data-video="videoWidth"></span>x<span data-video="videoHeight"></span></div></div></div><div class="art-info-close">[x]</div></div><div class="art-contextmenus"></div></div>`;
          }
          query(e3) {
            return (0, i.query)(e3, this.$container);
          }
          init() {
            let { option: e3 } = this.art;
            if (e3.useSSR || (this.$container.innerHTML = n.html), this.$player = this.query(".art-video-player"), this.$video = this.query(".art-video"), this.$track = this.query("track"), this.$poster = this.query(".art-poster"), this.$subtitle = this.query(".art-subtitle"), this.$danmuku = this.query(".art-danmuku"), this.$bottom = this.query(".art-bottom"), this.$progress = this.query(".art-progress"), this.$controls = this.query(".art-controls"), this.$controlsLeft = this.query(".art-controls-left"), this.$controlsCenter = this.query(".art-controls-center"), this.$controlsRight = this.query(".art-controls-right"), this.$layer = this.query(".art-layers"), this.$loading = this.query(".art-loading"), this.$notice = this.query(".art-notice"), this.$noticeInner = this.query(".art-notice-inner"), this.$mask = this.query(".art-mask"), this.$state = this.query(".art-state"), this.$setting = this.query(".art-settings"), this.$info = this.query(".art-info"), this.$infoPanel = this.query(".art-info-panel"), this.$infoClose = this.query(".art-info-close"), this.$contextmenu = this.query(".art-contextmenus"), e3.proxy) {
              let t2 = e3.proxy.call(this.art, this.art);
              (0, i.errorHandle)(t2 instanceof HTMLVideoElement || t2 instanceof HTMLCanvasElement, "Function 'option.proxy' needs to return 'HTMLVideoElement' or 'HTMLCanvasElement'"), (0, i.replaceElement)(t2, this.$video), t2.className = "art-video", this.$video = t2;
            }
            e3.backdrop && (0, i.addClass)(this.$player, "art-backdrop"), i.isMobile && (0, i.addClass)(this.$player, "art-mobile");
          }
          destroy(e3) {
            e3 ? this.$container.innerHTML = "" : (0, i.addClass)(this.$player, "art-destroy");
          }
        }
        r.default = n;
      }, { "../package.json": "lh3R5", "./utils": "aBlEo", "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }], "4NM7P": [function(e2, t, r, a) {
        e2("@parcel/transformer-js/src/esmodule-helpers.js").defineInteropFlag(r), r.default = class {
          on(e3, t2, r2) {
            let a2 = this.e || (this.e = {});
            return (a2[e3] || (a2[e3] = [])).push({ fn: t2, ctx: r2 }), this;
          }
          once(e3, t2, r2) {
            let a2 = this;
            function o(...i) {
              a2.off(e3, o), t2.apply(r2, i);
            }
            return o._ = t2, this.on(e3, o, r2);
          }
          emit(e3, ...t2) {
            let r2 = ((this.e || (this.e = {}))[e3] || []).slice();
            for (let e4 = 0; e4 < r2.length; e4 += 1) r2[e4].fn.apply(r2[e4].ctx, t2);
            return this;
          }
          off(e3, t2) {
            let r2 = this.e || (this.e = {}), a2 = r2[e3], o = [];
            if (a2 && t2) for (let e4 = 0, r3 = a2.length; e4 < r3; e4 += 1) a2[e4].fn !== t2 && a2[e4].fn._ !== t2 && o.push(a2[e4]);
            return o.length ? r2[e3] = o : delete r2[e3], this;
          }
        };
      }, { "@parcel/transformer-js/src/esmodule-helpers.js": "loqXi" }] }, ["esqvp"], "esqvp", "parcelRequire4dc0", {});
      let { default: e } = parcelRequire4dc0("esqvp");
      const isVideoLink = (href) => {
        if (!href) return false;
        if (!/^https?:\/\//i.test(href)) return false;
        return /\.(mp4|webm|ogg|mov|m4v)(\?|$)/i.test(href);
      };
      const buildPlayer = (link) => {
        const href = link.href;
        if (!isVideoLink(href)) return;
        if (link.dataset.mnVideo === "done") return;
        link.dataset.mnVideo = "done";
        const container = document.createElement("div");
        container.className = "mn-video-player";
        container.style.maxWidth = "960px";
        container.style.width = "100%";
        container.style.aspectRatio = "16/9";
        container.style.margin = "12px 0";
        container.style.backgroundColor = "#000";
        link.replaceWith(container);
        const mountPlayer = (useCors) => {
          try {
            const art = new e({
              container,
              url: href,

volume: 0.5,
              isLive: false,
              muted: false,
              autoplay: false,
              pip: true,
              autoSize: false,
autoMini: false,
screenshot: useCors,
setting: true,
              loop: false,
              flip: true,
              playbackRate: true,
              aspectRatio: true,
fullscreen: true,
              fullscreenWeb: true,
              subtitleOffset: true,
              miniProgressBar: true,
              mutex: true,
              backdrop: true,
              playsInline: true,
              autoPlayback: true,
              airplay: true,
              theme: "#23ade5",
              lang: "zh-cn",
lock: true,
              fastForward: true,
...useCors ? {
                moreVideoAttr: {
                  crossOrigin: "anonymous"
                }
              } : {}
            });
            art.once("video:error", () => {
              art.destroy(false);
              if (useCors) {
                console.warn(
                  "mn-video: playback error detected, retrying without CORS features..."
                );
                mountPlayer(false);
              } else {
                container.replaceWith(link);
                const errorSpan = document.createElement("span");
                errorSpan.innerText = "（视频加载错误）";
                errorSpan.style.cssText = "color: #ff4d4f; font-weight: bold; margin-left: 4px;";
                link.after(errorSpan);
              }
            });
          } catch (error) {
            console.error("mn-video: failed to init Artplayer", error);
            if (!useCors) {
              container.replaceWith(link);
              const errorSpan = document.createElement("span");
              errorSpan.innerText = "（视频初始化失败）";
              errorSpan.style.cssText = "color: #ff4d4f; font-weight: bold; margin-left: 4px;";
              link.after(errorSpan);
            } else {
              mountPlayer(false);
            }
          }
        };
        mountPlayer(true);
      };
      const processLinks = (root = document) => {
        const anchors = Array.from(
          root.querySelectorAll("a[href]")
        );
        anchors.filter((a) => isVideoLink(a.href)).forEach(buildPlayer);
      };
      const observe = () => {
        if (!document.body) return;
        const observer = new MutationObserver((records) => {
          for (const record of records) {
            record.addedNodes.forEach((node) => {
              if (node.nodeType === Node.ELEMENT_NODE) {
                processLinks(node);
              }
            });
          }
        });
        observer.observe(document.body, { childList: true, subtree: true });
      };
      const init = () => {
        try {
          processLinks();
          observe();
        } catch (error) {
          console.error("mn-video: initialization failed", error);
        }
      };
      if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
      } else {
        init();
      }
    }
  });
  require_main_001();

})();