// ==UserScript==
// @name Miss Player | 影院模式 (单手播放器)
// @name:en Miss Player | Theater Mode (One-handed Player)
// @name:ja Miss Player | シアターモード (片手プレーヤー)
// @name:vi Miss Player | Chế Độ Rạp Hát (Trình Phát Một Tay)
// @name:zh-CN Miss Player | 影院模式 (单手播放器)
// @name:zh-TW Miss Player | 影院模式 (單手播放器)
// @description MissAV去广告|单手模式|MissAV自动展开详情|MissAV自动高画质|MissAV重定向支持|MissAV自动登录|定制播放器|多语言支持 支持 jable po*nhub 等通用
// @description:en MissAV ad-free|one-handed mode|MissAV auto-expand details|MissAV auto high quality|MissAV redirect support|MissAV auto login|custom player|multilingual support for jable po*nhub etc.
// @description:ja MissAV広告ブロック|片手モード|MissAV自動詳細表示|MissAV自動高画質|MissAVリダイレクト対応|MissAV自動ログイン|カスタムプレーヤー|jable po*nhubなどに対応した多言語サポート
// @description:vi MissAV không quảng cáo|chế độ một tay|MissAV tự động mở rộng chi tiết|MissAV tự động chất lượng cao|Hỗ trợ chuyển hướng MissAV|MissAV tự động đăng nhập|trình phát tùy chỉnh|hỗ trợ đa ngôn ngữ cho jable po*nhub v.v.
// @description:zh-CN MissAV去广告|单手模式|MissAV自动展开详情|MissAV自动高画质|MissAV重定向支持|MissAV自动登录|定制播放器|多语言支持 支持 jable po*nhub 等通用
// @description:zh-TW MissAV去廣告|單手模式|MissAV自動展開詳情|MissAV自動高畫質|MissAV重定向支持|MissAV自動登錄|定制播放器|多語言支持 支持 jable po*nhub 等通用
// @version 5.1.9
// @author Chris_C
// @match *://*/*
// @grant none
// @icon https://missav.ws/img/favicon.ico
// @license MIT
// @namespace loadingi.local
// @noframes 
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/556156/Miss%20Player%20%7C%20%E5%BD%B1%E9%99%A2%E6%A8%A1%E5%BC%8F%20%28%E5%8D%95%E6%89%8B%E6%92%AD%E6%94%BE%E5%99%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/556156/Miss%20Player%20%7C%20%E5%BD%B1%E9%99%A2%E6%A8%A1%E5%BC%8F%20%28%E5%8D%95%E6%89%8B%E6%92%AD%E6%94%BE%E5%99%A8%29.meta.js
// ==/UserScript==

(() => {
  "use strict";
  var r = {
    "56": (r, o, a) => {
      function setAttributesWithoutAttributes(r) {
        var o = true ? a.nc : 0;
        if (o) {
          r.setAttribute("nonce", o);
        }
      }
      r.exports = setAttributesWithoutAttributes;
    },
    "72": r => {
      var o = [];
      function getIndexByIdentifier(r) {
        var a = -1;
        for (var l = 0; l < o.length; l++) {
          if (o[l].identifier === r) {
            a = l;
            break;
          }
        }
        return a;
      }
      function modulesToDom(r, a) {
        var l = {};
        var u = [];
        for (var p = 0; p < r.length; p++) {
          var v = r[p];
          var y = a.base ? v[0] + a.base : v[0];
          var b = l[y] || 0;
          var k = "".concat(y, " ").concat(b);
          l[y] = b + 1;
          var C = getIndexByIdentifier(k);
          var _ = {
            "css": v[1],
            "media": v[2],
            "sourceMap": v[3],
            "supports": v[4],
            "layer": v[5]
          };
          if (-1 !== C) {
            o[C].references++;
            o[C].updater(_);
          } else {
            var P = addElementStyle(_, a);
            a.byIndex = p;
            o.splice(p, 0, {
              "identifier": k,
              "updater": P,
              "references": 1
            });
          }
          u.push(k);
        }
        return u;
      }
      function addElementStyle(r, o) {
        var a = o.domAPI(o);
        a.update(r);
        var l;
        return function updater(o) {
          if (o) {
            if (o.css === r.css && o.media === r.media && o.sourceMap === r.sourceMap && o.supports === r.supports && o.layer === r.layer) {
              return;
            }
            a.update(r = o);
          } else {
            a.remove();
          }
        };
      }
      r.exports = function(r, a) {
        var l = modulesToDom(r = r || [], a = a || {});
        return function update(r) {
          r = r || [];
          for (var u = 0; u < l.length; u++) {
            var p;
            var v = getIndexByIdentifier(l[u]);
            o[v].references--;
          }
          var y = modulesToDom(r, a);
          for (var b = 0; b < l.length; b++) {
            var k;
            var C = getIndexByIdentifier(l[b]);
            if (0 === o[C].references) {
              o[C].updater();
              o.splice(C, 1);
            }
          }
          l = y;
        };
      };
    },
    "113": r => {
      function styleTagTransform(r, o) {
        if (o.styleSheet) {
          o.styleSheet.cssText = r;
        } else {
          while (o.firstChild) {
            o.removeChild(o.firstChild);
          }
          o.appendChild(document.createTextNode(r));
        }
      }
      r.exports = styleTagTransform;
    },
    "314": r => {
      r.exports = function(r) {
        var o = [];
        o.toString = function toString() {
          return this.map((function(o) {
            var a = "";
            var l = "undefined" !== typeof o[5];
            if (o[4]) {
              a += "@supports (".concat(o[4], ") {");
            }
            if (o[2]) {
              a += "@media ".concat(o[2], " {");
            }
            if (l) {
              a += "@layer".concat(o[5].length > 0 ? " ".concat(o[5]) : "", " {");
            }
            a += r(o);
            if (l) {
              a += "}";
            }
            if (o[2]) {
              a += "}";
            }
            if (o[4]) {
              a += "}";
            }
            return a;
          })).join("");
        };
        o.i = function i(r, a, l, u, p) {
          if ("string" === typeof r) {
            r = [ [ null, r, void 0 ] ];
          }
          var v = {};
          if (l) {
            for (var y = 0; y < this.length; y++) {
              var b = this[y][0];
              if (null != b) {
                v[b] = true;
              }
            }
          }
          for (var k = 0; k < r.length; k++) {
            var C = [].concat(r[k]);
            if (l && v[C[0]]) {
              continue;
            }
            if ("undefined" !== typeof p) {
              if ("undefined" === typeof C[5]) {
                C[5] = p;
              } else {
                C[1] = "@layer".concat(C[5].length > 0 ? " ".concat(C[5]) : "", " {").concat(C[1], "}");
                C[5] = p;
              }
            }
            if (a) {
              if (!C[2]) {
                C[2] = a;
              } else {
                C[1] = "@media ".concat(C[2], " {").concat(C[1], "}");
                C[2] = a;
              }
            }
            if (u) {
              if (!C[4]) {
                C[4] = "".concat(u);
              } else {
                C[1] = "@supports (".concat(C[4], ") {").concat(C[1], "}");
                C[4] = u;
              }
            }
            o.push(C);
          }
        };
        return o;
      };
    },
    "540": r => {
      function insertStyleElement(r) {
        var o = document.createElement("style");
        r.setAttributes(o, r.attributes);
        r.insert(o, r.options);
        return o;
      }
      r.exports = insertStyleElement;
    },
    "601": r => {
      r.exports = function(r) {
        return r[1];
      };
    },
    "659": r => {
      var o = {};
      function getTarget(r) {
        if ("undefined" === typeof o[r]) {
          var a = document.querySelector(r);
          if (window.HTMLIFrameElement && a instanceof window.HTMLIFrameElement) {
            try {
              a = a.contentDocument.head;
            } catch (r) {
              a = null;
            }
          }
          o[r] = a;
        }
        return o[r];
      }
      function insertBySelector(r, o) {
        var a = getTarget(r);
        if (!a) {
          throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
        }
        a.appendChild(o);
      }
      r.exports = insertBySelector;
    },
    "703": (r, o, a) => {
      a.d(o, {
        "A": () => b
      });
      var l = a(601);
      var u = a.n(l);
      var p = a(314);
      var v;
      var y = a.n(p)()(u());
      y.push([ r.id, `:root{\n    --shadcn-background:0 0% 0%;\n    --shadcn-foreground:0 0% 100%;\n    --shadcn-card:0 0% 5%;\n    --shadcn-card-foreground:0 0% 95%;\n    --shadcn-popover:0 0% 10%;\n    --shadcn-popover-foreground:0 0% 95%;\n    --shadcn-primary:210 10% 90%;\n    --shadcn-primary-foreground:210 20% 10%;\n    --shadcn-secondary:0 0% 15%;\n    --shadcn-secondary-foreground:0 0% 95%;\n    --shadcn-muted:0 0% 30%;\n    --shadcn-muted-foreground:0 0% 70%;\n    --shadcn-accent:212 40% 30%;\n    --shadcn-accent-foreground:0 0% 95%;\n    --shadcn-destructive:0 50% 40%;\n    --shadcn-destructive-foreground:0 0% 95%;\n    --shadcn-border:0 0% 30%;\n    --shadcn-input:0 0% 15%;\n    --shadcn-ring:212 70% 45%;\n    --shadcn-green:142 50% 45%;\n    --shadcn-green-foreground:0 0% 95%;\n    --shadcn-blue:211 70% 55%;\n    --shadcn-blue-foreground:0 0% 95%;\n    --shadcn-red:0 60% 50%;\n    --shadcn-red-foreground:0 0% 95%;\n    --shadcn-orange:25 80% 50%;\n    --shadcn-orange-foreground:0 0% 95%;\n    --shadcn-purple:262 60% 60%;\n    --shadcn-purple-foreground:0 0% 95%;\n    --shadcn-radius:0.5rem;\n    --shadcn-radius-sm:0.3rem;\n    --shadcn-radius-lg:0.8rem;\n    --button-sm:20px;\n    --button-md:32px;\n    --button-lg:40px;\n    --button-xl:48px;\n    --anim-quick:0.2s cubic-bezier(0.4, 0, 0.2, 1);\n    --anim-smooth:0.3s cubic-bezier(0.16, 1, 0.3, 1);\n    --anim-bounce:0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275);\n    --shadow-sm:0 2px 5px rgba(0, 0, 0, 0.2);\n    --shadow-md:0 4px 10px rgba(0, 0, 0, 0.25);\n    --shadow-lg:0 8px 20px rgba(0, 0, 0, 0.3);\n    --font-sans:"SF Pro Display", "SF Pro", "Segoe UI", "Microsoft YaHei", "微软雅黑", "PingFang SC", "苹方", "Helvetica Neue", Arial, "Noto Sans", sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";\n}\nhtml, body, button, input, select, textarea{\n    font-family:var(--font-sans);\n}\n*, *::before, *::after{\n    font-family:inherit;\n}\n\n.tm-video-overlay *{\n    font-family:var(--font-sans);\n}\n.tm-floating-button{\n    position:fixed;\n    bottom:30px;\n    left:50%;\n    transform:translateX(-50%);\n    padding:0;\n    width:56px;\n    height:56px;\n    border-radius:50%;\n    background-color:transparent;\n    color:rgb(254, 98, 142);\n    border:none;\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    z-index:9980;\n    cursor:pointer;\n    transition:all var(--anim-smooth);\n    overflow:visible;\n}\n\n.tm-floating-button svg{\n    width:48px;\n    height:48px;\n    filter:drop-shadow(0 0 10px rgba(254, 98, 142, 0.9));\n    transition:all var(--anim-smooth);\n    animation:breathing-glow 3s infinite ease-in-out;\n}\n\n.tm-floating-button:hover{\n    transform:translateX(-50%) scale(1.1);\n}\n\n.tm-floating-button:hover svg{\n    animation-play-state:paused;\n    filter:drop-shadow(0 0 20px rgba(254, 98, 142, 1.0));\n}\n\n.tm-floating-button:active{\n    transform:translateX(-50%) scale(0.95);\n}\n@keyframes breathing-glow{\n    0%{\n        filter:drop-shadow(0 0 8px rgba(254, 98, 142, 0.7));\n        transform:scale(0.97);\n    }\n    50%{\n        filter:drop-shadow(0 0 25px rgba(254, 98, 142, 1.0));\n        transform:scale(1.03);\n    }\n    100%{\n        filter:drop-shadow(0 0 8px rgba(254, 98, 142, 0.7));\n        transform:scale(0.97);\n    }\n}\n@media screen and (orientation: landscape){\n    .tm-floating-button{\n        left:auto;\n        right:20px;\n        transform:translateX(0);\n    }\n    \n    .tm-floating-button:hover{\n        transform:translateX(0) scale(1.1);\n    }\n    \n    .tm-floating-button:active{\n        transform:translateX(0) scale(0.95);\n    }\n    \n    .tm-floating-button svg{\n        animation:breathing-glow-landscape 3s infinite ease-in-out;\n    }\n}\n@keyframes breathing-glow-landscape{\n    0%{\n        filter:drop-shadow(0 0 8px rgba(254, 98, 142, 0.7));\n        transform:scale(0.97);\n    }\n    50%{\n        filter:drop-shadow(0 0 25px rgba(254, 98, 142, 1.0));\n        transform:scale(1.03);\n    }\n    100%{\n        filter:drop-shadow(0 0 8px rgba(254, 98, 142, 0.7));\n        transform:scale(0.97);\n    }\n}\n.tm-video-overlay{\n    position:fixed;\n    top:0;\n    left:0;\n    right:0;\n    height:100vh;\n    background-color:rgba(35, 17, 29, 0.8);\n    z-index:9990;\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    justify-content:flex-start;\n    backdrop-filter:blur(30px);\n    -webkit-backdrop-filter:blur(30px);\n    padding:0;\n}\n.tm-player-container{\n    position:fixed;\n    top:0;\n    bottom:0;\n    left:0;\n    right:0;\n    width:100%;\n    background-color:transparent;\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    justify-content:flex-start;\n    z-index:9991;\n    height:100%;\n    overflow:visible;\n    pointer-events:auto;\n}\n.tm-button-container{\n    width:100%;\n    display:flex;\n    justify-content:space-between;\n    padding:6px 10px;\n    box-sizing:border-box;\n    z-index:9993;\n    position:absolute;\n    top:0;\n    left:0;\n}\n\n.tm-video-container{\n    position:relative;\n    overflow:hidden;\n    width:100%;\n    height:auto;\n    max-height:80vh;\n    margin-top:44px;\n    display:flex;\n    align-items:flex-start;\n    justify-content:center;\n    background-color:hsl(var(--shadcn-card));\n    border-radius:var(--shadcn-radius-lg);\n    box-shadow:var(--shadow-lg);\n    z-index:9992;\n}\n\n.tm-video-wrapper{\n    position:relative;\n    overflow:hidden;\n    width:100%;\n    height:100%;\n    display:flex;\n    justify-content:center;\n    align-items:center;\n    will-change:transform;\n    border-radius:var(--shadcn-radius) var(--shadcn-radius) 0 0;\n}\n.tm-video-wrapper video{\n    width:auto !important; \n    height:100% !important; \n    max-width:none !important; \n    object-fit:contain !important; \n    transition:transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);\n    touch-action:pan-y; \n    cursor:grab; \n}\n.tm-handle-container{\n    left:0;\n    right:0;\n    bottom:10px;\n    height:30px;\n    display:flex;\n    justify-content:center;\n    align-items:center;\n    z-index:9992;\n    width:100%;\n}\n\n.tm-resize-handle{\n    position:absolute;\n    height:5px;\n    width:134px;\n    max-width:134px;\n    background-color:hsla(var(--shadcn-foreground) / 0.6);\n    border-radius:2.5px;\n    cursor:ns-resize;\n    touch-action:none;\n    opacity:0.5;\n    will-change:transform;\n    transition:all var(--anim-quick);\n    box-shadow:none;\n}\n\n.tm-resize-handle::after{\n    content:'';\n    position:absolute;\n    left:-10px;\n    right:-10px;\n    top:-15px;\n    bottom:-15px;\n    background:transparent;\n}\n\n.tm-resize-handle:hover{\n    opacity:1;\n    background-color:hsla(var(--shadcn-foreground) / 0.8);\n}\n.tm-control-button-base{\n    color:hsl(var(--shadcn-secondary-foreground));\n    border-radius:50%;\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    cursor:pointer;\n    transition:all var(--anim-quick);\n    backdrop-filter:blur(12px);\n    -webkit-backdrop-filter:blur(12px);\n    box-shadow:var(--shadow-sm);\n}\n.tm-close-button{\n    position:relative;\n    width:var(--button-md);\n    height:var(--button-md);\n    border-radius:calc(var(--button-md) / 2);\n    background-color:hsla(var(--shadcn-secondary) / 0.5);\n    color:hsl(var(--shadcn-secondary-foreground));\n    border:1px solid hsla(var(--shadcn-border) / 0.1);\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    cursor:pointer;\n    transition:all var(--anim-smooth);\n    z-index:9994;\n}\n\n.tm-close-button:hover{\n    background-color:hsl(var(--shadcn-destructive));\n    transform:scale(1.1);\n    box-shadow:var(--shadow-md);\n}\n\n.tm-close-button:active{\n    transform:scale(0.9);\n}\n.tm-settings-button{\n    position:relative;\n    width:var(--button-md);\n    height:var(--button-md);\n    border-radius:calc(var(--button-md) / 2);\n    background-color:hsla(var(--shadcn-secondary) / 0.7);\n    color:hsl(var(--shadcn-secondary-foreground));\n    border:1px solid hsla(var(--shadcn-border) / 0.2);\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    z-index:9993;\n    cursor:pointer;\n    transition:all var(--anim-quick);\n    backdrop-filter:blur(8px);\n    -webkit-backdrop-filter:blur(8px);\n    box-shadow:var(--shadow-sm);\n}\n\n.tm-settings-button:hover{\n    background-color:hsla(var(--shadcn-accent) / 0.9);\n    transform:scale(1.1) rotate(30deg);\n    box-shadow:var(--shadow-md);\n}\n\n.tm-settings-button:active{\n    transform:scale(0.9);\n}\n.tm-settings-panel{\n    position:absolute;\n    top:calc(env(safe-area-inset-top, 8px) + 60px);\n    right:16px;\n    background-color:hsla(var(--shadcn-card) / 0.7);\n    backdrop-filter:blur(15px);\n    -webkit-backdrop-filter:blur(15px);\n    border-radius:var(--shadcn-radius);\n    border:1px solid hsla(var(--shadcn-border) / 0.1);\n    padding:12px;\n    box-shadow:var(--shadow-md);\n    z-index:9996;\n    min-width:200px;\n    transform:translateY(-10px);\n    opacity:0;\n    pointer-events:none;\n    transition:transform var(--anim-smooth), opacity var(--anim-smooth);\n}\n\n.tm-settings-panel.active{\n    transform:translateY(0);\n    opacity:1;\n    pointer-events:auto;\n}\n.tm-settings-option{\n    display:flex;\n    justify-content:space-between;\n    align-items:center;\n    padding:10px;\n    border-radius:var(--shadcn-radius-sm);\n    margin-bottom:8px;\n    transition:background-color var(--anim-quick);\n}\n\n.tm-settings-option:hover{\n    background-color:hsla(var(--shadcn-muted) / 0.5);\n}\n\n.tm-settings-option:last-child{\n    margin-bottom:0;\n}\n.tm-settings-label{\n    cursor:pointer;\n    flex:1;\n}\n.tm-toggle-input{\n    position:absolute;\n    left:-9999px;\n}\n.tm-settings-panel{\n    display:none;\n}\n\n.tm-settings-panel.visible{\n    display:block;\n}\n.tm-start-time-container.active{\n    background-color:hsl(var(--shadcn-green) / 0.15);\n    border-color:hsl(var(--shadcn-green) / 0.4);\n}\n\n.tm-start-time-container:not(.active){\n    background-color:hsl(var(--shadcn-secondary) / 0.5);\n    border-color:hsl(var(--shadcn-border) / 0.1);\n}\n.tm-end-time-container.active{\n    background-color:hsl(var(--shadcn-orange) / 0.15);\n    border-color:hsl(var(--shadcn-orange) / 0.4);\n}\n\n.tm-end-time-container:not(.active){\n    background-color:hsl(var(--shadcn-secondary) / 0.5);\n    border-color:hsl(var(--shadcn-border) / 0.1);\n}\n.tm-set-loop-start-label.active{\n    color:hsl(var(--shadcn-green));\n    opacity:1;\n}\n\n.tm-set-loop-start-label:not(.active){\n    opacity:0.9;\n}\n.tm-set-loop-end-label.active{\n    color:hsl(var(--shadcn-orange));\n    opacity:1;\n}\n\n.tm-set-loop-end-label:not(.active){\n    opacity:0.9;\n}\n.tm-loop-start-position.active, .tm-loop-end-position.active{\n    color:hsl(var(--shadcn-foreground));\n    opacity:1;\n}\n\n.tm-loop-start-position:not(.active), .tm-loop-end-position:not(.active){\n    color:hsl(var(--shadcn-muted-foreground));\n    opacity:0.9;\n}\n.tm-loop-toggle-button.active{\n    background-color:hsl(var(--shadcn-red) / 0.1);\n    border-color:hsl(var(--shadcn-red) / 0.3);\n}\n\n.tm-loop-toggle-button:active{\n    transform:scale(0.98);\n}\n.tm-loop-range{\n    position:absolute;\n    height:4px;\n    background:linear-gradient(90deg, \n        hsla(var(--shadcn-green) / 0.3) 0%, \n        hsla(var(--shadcn-orange) / 0.3) 100%);\n    top:50%;\n    transform:translateY(-50%);\n    border-radius:2px;\n    opacity:0;\n    transition:opacity 0.3s ease;\n    z-index:1;\n    pointer-events:none;\n}\n\n.tm-loop-range.active{\n    opacity:0.7;\n    box-shadow:0 0 8px rgba(0, 0, 0, 0.1);\n}\n.tm-progress-bar-container:hover .tm-loop-range.active{\n    opacity:0.9;\n    height:6px;\n}\n.tm-loop-marker{\n    position:absolute;\n    width:4px;\n    height:100%;\n    top:0;\n    transform:translateX(-50%);\n    z-index:3;\n    transition:opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1),  transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.2s cubic-bezier(0.25, 0.1, 0.25, 1);\n    backdrop-filter:blur(4px);\n    -webkit-backdrop-filter:blur(4px);\n}\n.tm-loop-start-marker{\n    background-color:hsla(var(--shadcn-green) / 0.5);\n    border-radius:2px;\n    box-shadow:0 0 6px hsla(var(--shadcn-green) / 0.3);\n}\n.tm-loop-end-marker{\n    background-color:hsla(var(--shadcn-orange) / 0.5);\n    border-radius:2px;\n    box-shadow:0 0 6px hsla(var(--shadcn-orange) / 0.3);\n}\n.tm-loop-marker:hover{\n    cursor:pointer;\n    z-index:4;\n}\n\n.tm-loop-start-marker:hover{\n    background-color:hsla(var(--shadcn-green) / 0.7);\n    box-shadow:0 0 10px hsla(var(--shadcn-green) / 0.5);\n}\n\n.tm-loop-end-marker:hover{\n    background-color:hsla(var(--shadcn-orange) / 0.7);\n    box-shadow:0 0 10px hsla(var(--shadcn-orange) / 0.5);\n}\n.tm-loop-marker.active{\n    opacity:1;\n}\n\n.tm-loop-marker:not(.active){\n    opacity:0.7;\n}\n.tm-loop-marker::before{\n    content:attr(data-label);\n    position:absolute;\n    top:-24px;\n    left:50%;\n    transform:translateX(-50%);\n    background-color:hsla(var(--shadcn-card) / 0.7);\n    color:hsl(var(--shadcn-card-foreground));\n    font-size:10px;\n    font-weight:600;\n    padding:2px 8px;\n    border-radius:10px;\n    opacity:0;\n    transition:opacity 0.2s ease, transform 0.2s ease;\n    backdrop-filter:blur(8px);\n    -webkit-backdrop-filter:blur(8px);\n    box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);\n    border:1px solid hsla(var(--shadcn-border) / 0.1);\n    white-space:nowrap;\n    z-index:5;\n}\n\n.tm-loop-start-marker::before{\n    content:"循环起点";\n}\n\n.tm-loop-end-marker::before{\n    content:"循环终点";\n}\n\n.tm-loop-marker:hover::before{\n    opacity:1;\n    transform:translateX(-50%) translateY(-4px);\n}\n.tm-start-time-container-hover{\n    background-color:hsl(var(--shadcn-green) / 0.1);\n    border-color:hsl(var(--shadcn-green) / 0.3);\n}\n\n.tm-start-time-container-default{\n    background-color:hsl(var(--shadcn-secondary) / 0.5);\n    border-color:hsl(var(--shadcn-border) / 0.1);\n}\n\n.tm-end-time-container-hover{\n    background-color:hsl(var(--shadcn-orange) / 0.1);\n    border-color:hsl(var(--shadcn-orange) / 0.3);\n}\n\n.tm-end-time-container-default{\n    background-color:hsl(var(--shadcn-secondary) / 0.5);\n    border-color:hsl(var(--shadcn-border) / 0.1);\n}\n.tm-loop-button-hover{\n    background-color:hsl(var(--shadcn-accent) / 0.3);\n    transform:translateY(-1px);\n}\n\n.tm-loop-button-active{\n    background-color:hsl(var(--shadcn-muted) / 0.7);\n}\n\n.tm-loop-button-default{\n    background-color:hsl(var(--shadcn-secondary) / 0.5);\n    transform:translateY(0);\n}\n.tm-indicator-base{\n    position:absolute;\n    padding:8px 16px;\n    background-color:hsla(var(--shadcn-card) / 0.6);\n    color:hsl(var(--shadcn-card-foreground));\n    border-radius:var(--shadcn-radius);\n    opacity:0;\n    backdrop-filter:blur(15px);\n    -webkit-backdrop-filter:blur(15px);\n    box-shadow:var(--shadow-md);\n    border:1px solid hsla(var(--shadcn-border) / 0.1);\n    transform:translateY(20px);\n    transition:opacity var(--anim-smooth), transform var(--anim-smooth);\n    pointer-events:none;\n    z-index:9994;\n    font-size:15px;\n    font-weight:500;\n}\n\n.tm-indicator-base.visible{\n    opacity:1;\n    transform:translateY(0);\n    pointer-events:auto;\n}\n.tm-pause-indicator{\n    width:80px;\n    height:80px;\n}\n.tm-playback-rate-indicator{\n    top:30%;\n    border-radius:var(--shadcn-radius);\n    padding:10px 16px;\n    font-size:16px;\n    font-weight:bold;\n}\n.tm-progress-row{\n    display:flex;\n    flex-direction:column;\n    width:100%;\n    box-sizing:border-box;\n}\n\n.tm-seek-control-row{\n    display:flex;\n    flex-direction:row;\n    justify-content:space-between;\n    width:100%;\n    box-sizing:border-box;\n}\n\n.tm-loop-control-row{\n    display:flex;\n    justify-content:space-between;\n    align-items:center;\n    width:100%;\n    box-sizing:border-box;\n    position:relative;\n}\n\n.tm-playback-control-row{\n    display:flex;\n    justify-content:space-between;\n    align-items:center;\n    position:relative;\n    width:100%;\n    max-height:45px;\n    height:45px;\n    border-radius:8px;\n    box-sizing:border-box;\n}\n.tm-left-controls, .tm-center-controls, .tm-right-controls{\n    flex:1;\n    display:flex;\n    height:100%;\n    align-items:center;\n}\n\n.tm-left-controls{\n    justify-content:flex-start;\n}\n\n.tm-center-controls{\n    justify-content:center;\n}\n\n.tm-right-controls{\n    justify-content:flex-end;\n}\n.tm-time-display{\n    display:flex;\n    justify-content:space-between;\n    color:hsl(var(--shadcn-foreground) / 0.9);\n    font-size:12px;\n    margin-top:-2px;\n    font-variant-numeric:tabular-nums;\n    gap:8px;\n}\n\n.tm-time-display-container{\n    display:flex;\n    justify-content:space-between;\n    width:100%;\n    padding:0px 1px;\n    margin-bottom:4px;\n}\n\n.tm-current-time, .tm-total-duration{\n    color:hsl(var(--shadcn-card-foreground) / 0.9);\n    font-size:0.8rem;\n    min-width:60px;\n    font-variant-numeric:tabular-nums;\n    font-weight:400;\n    line-height:1;\n}\n\n.tm-current-time{\n    text-align:left;\n}\n\n.tm-total-duration{\n    text-align:right;\n}\n\n.tm-loop-control{\n    display:flex;\n    align-items:center;\n    gap:6px;\n}\n\n.tm-start-time-container, .tm-end-time-container{\n    display:flex;\n    align-items:center;\n    background-color:hsl(var(--shadcn-secondary) / 0.5);\n    border:1px solid hsl(var(--shadcn-border) / 0.1);\n    border-radius:6px;\n    padding:4px 4px;\n    cursor:pointer;\n    transition:all 0.2s ease;\n}\n.tm-start-time-container:hover{\n    background-color:hsl(var(--shadcn-green) / 0.1);\n    border-color:hsl(var(--shadcn-green) / 0.3);\n    transform:translateY(-1px);\n}\n\n.tm-end-time-container:hover{\n    background-color:hsl(var(--shadcn-orange) / 0.1);\n    border-color:hsl(var(--shadcn-orange) / 0.3);\n    transform:translateY(-1px);\n}\n\n.tm-set-loop-start-label, .tm-set-loop-end-label{\n    font-size:1rem;\n    font-weight:600;\n    padding:0px 4px;\n    display:flex;\n    align-items:center;\n    justify-content:center;\n}\n.tm-set-loop-start-label{\n    color:hsl(var(--shadcn-green));\n}\n.tm-set-loop-end-label{\n    color:hsl(var(--shadcn-orange));\n}\n\n.tm-loop-toggle-button{\n    display:flex;\n    align-items:center;\n    background-color:hsl(var(--shadcn-secondary) / 0.5);\n    border:1px solid hsl(var(--shadcn-border) / 0.1);\n    border-radius:6px;\n    padding:4px 8px;\n    font-size:0.875rem;\n    cursor:pointer;\n    transition:all 0.2s ease;\n    font-weight:500;\n    gap:6px;\n    color:hsl(var(--shadcn-foreground));\n}\n.tm-loop-toggle-label{\n    font-size:1rem;\n    font-weight:600;\n    padding:0px 4px;\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    color:hsl(var(--shadcn-muted-foreground) / 0.9);\n    transition:color 0.2s ease;\n}\n.tm-loop-toggle-label.active{\n    color:hsl(var(--shadcn-red));\n}\n.tm-loop-toggle-button.active{\n    background-color:hsl(var(--shadcn-red) / 0.1);\n    border-color:hsl(var(--shadcn-red) / 0.3);\n}\n\n.tm-loop-toggle-button:not(.active){\n    background-color:hsl(var(--shadcn-secondary) / 0.5);\n    border-color:hsl(var(--shadcn-border) / 0.1);\n}\n\n.tm-loop-toggle-button:active{\n    transform:scale(0.98);\n}\n\n.tm-loop-indicator-circle{\n    transition:fill 0.2s ease;\n}\n\n.tm-loop-toggle-button.active .tm-loop-indicator-circle{\n    fill:hsl(var(--shadcn-red));\n}\n.tm-rewind-group, .tm-forward-group{\n    display:flex;\n    flex-direction:column;\n    width:50%;\n    gap:8px;\n    align-items:center;\n}\n\n.tm-rewind-buttons-container{\n    display:flex;\n    flex-direction:row-reverse;\n    flex-wrap:wrap;\n    width:100%;\n    justify-content:flex-end;\n    align-content:flex-start;\n    gap:6px;\n}\n\n.tm-forward-buttons-container{\n    display:flex;\n    flex-direction:row;\n    flex-wrap:wrap;\n    width:100%;\n    justify-content:flex-end;\n    align-content:flex-start;\n    gap:6px;\n}\n.tm-loop-start-position, .tm-loop-end-position{\n    color:hsl(var(--shadcn-muted-foreground));\n    font-size:0.875rem;\n    min-width:70px;\n    text-align:center;\n    display:inline-block;\n    font-variant-numeric:tabular-nums;\n}\n.tm-time-control-button{\n    background-color:hsl(var(--shadcn-secondary) / 0.5);\n    color:hsl(var(--shadcn-secondary-foreground));\n    border:1px solid hsl(var(--shadcn-border) / 0.1);\n    border-radius:var(--shadcn-radius-sm);\n    padding:0;\n    font-size:0.75rem;\n    cursor:pointer;\n    transition:all 0.2s cubic-bezier(.25,.8,.25,1);\n    white-space:nowrap;\n    font-weight:500;\n    box-shadow:0 1px 2px rgba(0,0,0,0.05);\n    width:var(--button-xl);\n    height:var(--button-lg);\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    flex:0 0 auto;\n}\n\n.tm-time-control-button:hover{\n    background-color:hsl(var(--shadcn-accent) / 0.6);\n    transform:translateY(-1px);\n    box-shadow:0 2px 4px rgba(0,0,0,0.1);\n}\n\n.tm-time-control-button:active{\n    transform:scale(0.95);\n    box-shadow:none;\n}\n\n.tm-time-control-button-active{\n    transform:scale(0.95);\n    box-shadow:none;\n}\n\n.tm-time-control-button-after-active{\n    transform:none;\n    box-shadow:0 2px 5px rgba(0, 0, 0, 0.15);\n}\n\n.tm-time-control-button-inner{\n    display:flex;\n    align-items:center;\n    justify-content:center;\n}\n\n.tm-rewind-icon{\n    margin-right:-2px;\n}\n\n.tm-forward-icon{\n    margin-left:-2px;\n}\n\n.tm-time-text-margin-left{\n    margin-left:2px;\n}\n\n.tm-time-text-margin-right{\n    margin-right:2px;\n}\n.tm-control-button-hover{\n    background-color:hsl(var(--shadcn-accent) / 0.3);\n    transform:none;\n}\n\n.tm-control-button-default{\n    background-color:hsl(var(--shadcn-secondary) / 0.5);\n    transform:none;\n}\n.tm-control-buttons{\n    position:absolute;\n    bottom:calc(10px + env(safe-area-inset-bottom, 0px));\n    left:50%;\n    transform:translateX(-50%);\n    width:95%;\n    max-width:700px;\n    min-width:350px;\n    background-color:hsla(var(--shadcn-card) / 0.8);\n    backdrop-filter:blur(8px);\n    -webkit-backdrop-filter:blur(8px);\n    z-index:9991;\n    padding:12px;\n    padding-bottom:12px;\n    border-radius:12px;\n    border:1px solid hsla(var(--shadcn-border) / 0.1);\n    box-shadow:0 2px 10px rgba(0, 0, 0, 0.2);\n    transition:opacity 0.3s ease, transform 0.3s ease;\n    gap:10px;\n    display:flex;\n    flex-direction:column;\n    align-items:center;\n    justify-content:center;\n}\nbody.controls-hidden .tm-player-container .tm-control-buttons{\n    opacity:0;\n    transform:translateX(-50%) translateY(20px);\n    pointer-events:none;\n}\nbody:not(.controls-hidden) .tm-player-container .tm-control-buttons{\n    opacity:1;\n    transform:translateX(-50%) translateY(0);\n    pointer-events:auto;\n}\nbody.controls-hidden .tm-player-container .tm-button-container{\n    opacity:0;\n    transform:translateY(-20px);\n    pointer-events:none;\n}\nbody:not(.controls-hidden) .tm-player-container .tm-button-container{\n    opacity:1;\n    transform:translateY(0);\n    pointer-events:auto;\n}\n.tm-control-button{\n    position:relative;\n    width:var(--button-md);\n    height:var(--button-md);\n    border-radius:calc(var(--button-md) / 2);\n    background-color:hsla(var(--shadcn-secondary) / 0.6);\n    color:hsl(var(--shadcn-secondary-foreground));\n    border:1px solid hsla(var(--shadcn-border) / 0.1);\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    cursor:pointer;\n    transition:all var(--anim-quick);\n}\n\n.tm-control-button:hover{\n    background-color:hsla(var(--shadcn-accent) / 0.7);\n    transform:translateY(-2px);\n    box-shadow:var(--shadow-sm);\n}\n\n.tm-control-button:active{\n    transform:scale(0.95);\n    box-shadow:none;\n}\n\n.tm-control-button.active{\n    background-color:hsla(var(--shadcn-blue) / 0.7);\n    color:hsl(var(--shadcn-blue-foreground));\n    box-shadow:0 0 0 2px hsla(var(--shadcn-blue) / 0.3);\n}\n\n.tm-control-button svg,\n.tm-control-button img{\n    width:16px;\n    height:16px;\n}\n.tm-control-row{\n    display:flex;\n    justify-content:center;\n    align-items:center;\n    gap:8px;\n    margin-top:4px;\n    opacity:1;\n    transition:opacity var(--anim-quick), height var(--anim-quick);\n    height:auto;\n    overflow:hidden;\n}\n\n.tm-control-row.hidden{\n    opacity:0;\n    height:0;\n    margin:0;\n}\n.tm-time-control-button-hover{\n    background-color:hsl(var(--shadcn-accent) / 0.6);\n    transform:none;\n    box-shadow:0 2px 4px rgba(0,0,0,0.1);\n}\n\n.tm-time-control-button-active{\n    transform:scale(0.95);\n    box-shadow:none;\n}\n\n.tm-time-control-button-default{\n    transform:translateY(0);\n    box-shadow:0 1px 2px rgba(0,0,0,0.05);\n}\n\n.tm-time-control-button-after-active{\n    transform:none;\n    box-shadow:0 2px 5px rgba(0, 0, 0, 0.15);\n}\n@media screen and (orientation: landscape){\n    .tm-video-container{\n        width:100%;\n        height:100vh !important;\n        max-height:100vh !important;\n        min-height:auto !important;\n        margin:0;\n        padding:0;\n        padding-left:env(safe-area-inset-left, 16px);\n        padding-right:env(safe-area-inset-right, 16px);\n        border-radius:0;\n        box-shadow:none;\n        display:flex;\n        justify-content:center;\n        align-items:center;\n        background-color:black;\n    }\n    .tm-video-wrapper{\n        width:100%;\n        height:100%;\n        border-radius:0;\n        display:flex;\n        justify-content:center;\n        align-items:center;\n        overflow:hidden;\n    }\n    .tm-video-wrapper video{\n        width:100% !important;\n        height:auto !important;\n        max-height:100vh !important;\n        object-fit:contain !important;\n    }\n    .tm-video-wrapper.video-portrait video{\n        width:auto !important;\n        height:100% !important;\n        max-width:100% !important;\n    }\n    .tm-button-container{\n        position:absolute;\n        top:0;\n        left:0;\n        right:0;\n        z-index:9995;\n        background-color:transparent;\n        padding:16px;\n        padding-top:calc(env(safe-area-inset-top, 8px) + 8px);\n        display:flex;\n        justify-content:space-between;\n        transition:opacity 0.3s ease, transform 0.3s ease;\n    }\n    .tm-video-overlay.controls-hidden .tm-button-container{\n        opacity:0;\n        transform:translateY(-20px);\n        pointer-events:none;\n    }\n    .tm-video-overlay .tm-button-container{\n        opacity:1;\n        transform:translateY(0);\n        pointer-events:auto;\n    }\n    .tm-settings-button{\n        display:flex;\n        background-color:hsla(var(--shadcn-secondary) / 0.3);\n        backdrop-filter:blur(4px);\n        -webkit-backdrop-filter:blur(4px);\n    }\n    .tm-close-button{\n        background-color:hsla(var(--shadcn-secondary) / 0.3);\n        backdrop-filter:blur(4px);\n        -webkit-backdrop-filter:blur(4px);\n    }\n    .tm-control-buttons{\n        position:absolute;\n        bottom:calc(10px + env(safe-area-inset-bottom, 0px));\n        left:50%;\n        transform:translateX(-50%);\n        width:90%;\n        max-width:700px;\n        min-width:350px;\n        background-color:hsla(var(--shadcn-card) / 0.3);\n        backdrop-filter:blur(8px);\n        -webkit-backdrop-filter:blur(8px);\n        z-index:9994;\n        padding:12px;\n        padding-bottom:12px;\n        border-radius:12px;\n        border:1px solid hsla(var(--shadcn-border) / 0.1);\n        box-shadow:0 2px 10px rgba(0, 0, 0, 0.2);\n        transition:opacity 0.3s ease, transform 0.3s ease;\n    }\n    .tm-video-overlay.controls-hidden .tm-control-buttons{\n        opacity:0;\n        transform:translateX(-50%) translateY(20px);\n        pointer-events:none;\n    }\n    .tm-video-overlay .tm-control-buttons{\n        opacity:1;\n        transform:translateX(-50%) translateY(0);\n        pointer-events:auto;\n    }\n    .tm-video-overlay{\n        background-color:black;\n        backdrop-filter:none;\n        -webkit-backdrop-filter:none;\n    }\n    .tm-floating-button{\n        bottom:30px;\n        left:50%;\n        transform:translateX(-50%);\n        padding:0;\n        width:calc(var(--button-xl));\n        height:calc(var(--button-xl));\n    }\n}\n.tm-time-indicator{\n    position:absolute;\n    background-color:hsla(var(--shadcn-card) / 0.8);\n    color:hsl(var(--shadcn-card-foreground));\n    padding:4px 8px;\n    border-radius:4px;\n    font-size:12px;\n    font-weight:500;\n    pointer-events:none;\n    z-index:9995;\n    opacity:0;\n    transform:translateY(-8px);\n    transition:opacity 0.2s, transform 0.2s;\n    box-shadow:0 2px 8px rgba(0, 0, 0, 0.2);\n    border:1px solid hsla(var(--shadcn-border) / 0.1);\n    backdrop-filter:blur(8px);\n    -webkit-backdrop-filter:blur(8px);\n}\n.tm-volume-control{\n    display:flex;\n    align-items:center;\n    gap:8px;\n    height:40px;\n    padding:0 8px;\n    background-color:transparent;\n    transition:opacity 0.3s ease;\n}\n.tm-volume-control-no-slider{\n    width:auto;\n    padding:0;\n}\n\n.tm-volume-control-no-slider .tm-volume-button{\n    margin:0 8px;\n}\n.tm-volume-button{\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    width:32px;\n    height:32px;\n    padding:4px;\n    border:none;\n    border-radius:50%;\n    background:transparent;\n    color:#fff;\n    cursor:pointer;\n    transition:background-color 0.2s ease;\n}\n\n.tm-volume-button:hover{\n    background-color:hsla(var(--shadcn-secondary) / 0.2);\n}\n\n.tm-volume-button svg{\n    width:20px;\n    height:20px;\n}\n.tm-volume-slider-container{\n    position:relative;\n    width:0;\n    height:40px;\n    display:flex;\n    align-items:center;\n    overflow:hidden;\n    transition:width 0.3s ease;\n    opacity:0;\n}\n@media (hover: hover){\n    .tm-volume-control:hover .tm-volume-slider-container{\n        width:80px;\n        opacity:1;\n    }\n}\n.tm-volume-control.dragging .tm-volume-slider-container{\n    width:80px;\n    opacity:1;\n}\n.tm-volume-slider-track{\n    position:relative;\n    width:100%;\n    height:4px;\n    background-color:hsla(var(--shadcn-secondary) / 0.3);\n    border-radius:2px;\n    cursor:pointer;\n}\n.tm-volume-slider-level{\n    position:absolute;\n    left:0;\n    top:0;\n    height:100%;\n    background-color:#fff;\n    border-radius:2px;\n    pointer-events:none;\n    transition:width 0.1s ease;\n}\n.tm-volume-value{\n    position:absolute;\n    top:-24px;\n    left:50%;\n    transform:translateX(-50%);\n    background-color:hsla(var(--shadcn-secondary) / 0.8);\n    color:#fff;\n    padding:2px 6px;\n    border-radius:4px;\n    font-size:12px;\n    opacity:0;\n    transition:opacity 0.2s ease;\n    pointer-events:none;\n    backdrop-filter:blur(4px);\n}\n.tm-volume-control.dragging .tm-volume-value{\n    opacity:1;\n}\n@media (hover: none){\n    .tm-volume-control{\n        touch-action:none;\n    }\n    \n    .tm-volume-slider-track{\n        height:6px;\n    }\n    \n    .tm-volume-button{\n        width:40px;\n        height:40px;\n    }\n}\n@media (prefers-color-scheme: dark){\n    .tm-volume-slider-level{\n        background-color:hsl(var(--shadcn-primary));\n    }\n    \n    .tm-volume-button svg{\n        stroke:hsl(var(--shadcn-primary));\n    }\n}\n.tm-toggle-switch{\n    position:relative;\n    display:inline-block;\n    width:40px;\n    height:24px;\n}\n\n.tm-toggle-switch input{\n    opacity:0;\n    width:0;\n    height:0;\n}\n\n.tm-toggle-slider{\n    position:absolute;\n    cursor:pointer;\n    top:0;\n    left:0;\n    right:0;\n    bottom:0;\n    background-color:hsla(var(--shadcn-muted) / 0.7);\n    border-radius:12px;\n    transition:var(--anim-quick);\n}\n\n.tm-toggle-slider:before{\n    position:absolute;\n    content:"";\n    height:20px;\n    width:20px;\n    left:2px;\n    bottom:2px;\n    background-color:hsl(var(--shadcn-foreground));\n    border-radius:50%;\n    transition:var(--anim-quick);\n    box-shadow:0 2px 4px rgba(0, 0, 0, 0.1);\n}\n\n.tm-toggle-slider.checked{\n    background-color:hsl(var(--shadcn-blue));\n}\n\n.tm-toggle-slider.checked:before{\n    transform:translateX(16px);\n}\n.tm-playback-rate-slider{\n    display:flex;\n    align-items:center;\n    margin-left:0;\n    height:30px;\n    width:100%;\n    max-width:110px;\n    background:hsl(var(--shadcn-card) / 0.85);\n    border-radius:6px;\n    backdrop-filter:blur(8px);\n    -webkit-backdrop-filter:blur(8px);\n    position:relative;\n    overflow:hidden;\n    box-shadow:0 1px 3px rgba(0, 0, 0, 0.08);\n    transition:box-shadow 0.2s ease, transform 0.2s ease;\n    cursor:pointer;\n}\n\n.tm-playback-rate-slider:hover{\n    box-shadow:0 2px 6px rgba(0, 0, 0, 0.1);\n    transform:translateY(-1px);\n}\n\n.tm-playback-rate-slider.dragging{\n    box-shadow:0 1px 4px rgba(0, 0, 0, 0.12);\n    background:hsla(var(--shadcn-card) / 0.9);\n}\n\n.tm-slider-container{\n    width:100%;\n    height:100%;\n    background:hsla(var(--shadcn-secondary) / 0.5);\n    position:relative;\n    overflow:hidden;\n    display:flex;\n    align-items:center;\n}\n\n.tm-slider-level{\n    position:absolute;\n    top:0;\n    left:0;\n    height:100%;\n    background:hsl(0 0% 50% / 0.8);\n    width:50%;\n    transform-origin:left;\n    transition:width 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n    z-index:1;\n}\n\n.tm-slider-text{\n    display:flex;\n    justify-content:space-between;\n    width:100%;\n    padding:0 10px;\n    z-index:2;\n    position:relative;\n}\n.tm-speed-label{\n    color:hsl(var(--shadcn-muted-foreground));\n    font-size:12px;\n    font-weight:400;\n    transition:color var(--anim-quick);\n}\n\n.tm-playback-rate-slider:hover .tm-speed-label{\n    color:hsl(var(--shadcn-foreground));\n}\n\n.tm-speed-value{\n    color:hsl(var(--shadcn-foreground));\n    font-size:12px;\n    font-weight:600;\n    font-variant-numeric:tabular-nums;\n}\n.tm-speed-value.fast{\n    color:hsl(var(--shadcn-orange));\n}\n\n.tm-speed-value.slow{\n    color:hsl(var(--shadcn-blue));\n}\n\n.tm-speed-value.normal{\n    color:hsl(var(--shadcn-foreground));\n}\n.tm-progress-controls{\n    position:relative;\n    width:100%;\n    bottom:0;\n    left:0;\n    right:0;\n    display:flex;\n    flex-direction:column;\n    z-index:9991;\n    border-radius:0 0 var(--shadcn-radius-lg) var(--shadcn-radius-lg);\n    font-family:var(--font-sans);\n    transition:opacity var(--anim-smooth);\n}\n.tm-progress-bar-container{\n    position:relative;\n    height:12px;\n    display:flex;\n    align-items:center;\n    cursor:pointer;\n    user-select:none;\n    -webkit-user-select:none;\n    -moz-user-select:none;\n    -ms-user-select:none;\n    touch-action:none;\n}\n.tm-progress-bar{\n    width:100%;\n    height:8px;\n    background-color:hsla(var(--shadcn-muted) / 0.5);\n    border-radius:8px;\n    overflow:hidden;\n    position:relative;\n    transition:height 0.15s;\n}\n\n.tm-progress-bar:hover{\n    height:6px;\n}\n.tm-progress-bar-expanded{\n    height:16px !important;\n}\n\n.tm-progress-bar-normal{\n    height:8px !important;\n}\n.tm-progress-bar.tm-dragging{\n    height:16px !important;\n    background-color:hsla(var(--shadcn-muted-foreground) / 0.7);\n    cursor:grabbing;\n}\n.tm-progress-bar-container:has(.tm-dragging){\n    cursor:grabbing;\n}\n.tm-progress-indicator{\n    height:100%;\n    width:0%;\n    background-color:hsla(var(--shadcn-muted) / 0.8);\n    border-radius:0;\n    position:absolute;\n    left:0;\n    top:0;\n    transition:width 0.1s linear;\n    overflow:hidden;\n}\n.tm-dragging .tm-progress-indicator{\n    background-color:hsl(var(--shadcn-card-foreground));\n    box-shadow:none;\n    transition:none;\n}\n.tm-progress-handle{\n    width:12px;\n    height:12px;\n    background-color:hsl(var(--shadcn-blue));\n    border:2px solid hsl(var(--shadcn-card));\n    border-radius:50%;\n    position:absolute;\n    top:50%;\n    left:0%;\n    transform:translate(0, -50%);\n    z-index:2;\n    opacity:1;\n    transition:opacity 0.15s, width 0.15s, height 0.15s, box-shadow 0.15s;\n    box-shadow:0 0 0 4px hsl(var(--shadcn-blue) / 0.2);\n    cursor:grab;\n}\n\n.tm-progress-handle:hover,\n.tm-progress-handle.dragging{\n    transform:translate(0, -50%) scale(1.1);\n    box-shadow:0 0 0 6px hsl(var(--shadcn-blue) / 0.3);\n}\n.tm-settings-label{\n    cursor:pointer;\n    flex:1;\n    font-family:var(--font-sans);\n    font-size:14px;\n    color:hsl(var(--shadcn-foreground));\n}\n.tm-playback-control-row button{\n    display:flex;\n    align-items:center;\n    justify-content:center;\n    width:36px;\n    height:36px;\n    padding:0px;\n    border:none;\n    border-radius:50%;\n    background-color:transparent;\n    color:#fff;\n    cursor:pointer;\n    transition:all 0.15s ease;\n    -webkit-tap-highlight-color:transparent;\n}\n\n.tm-playback-control-row button:hover{\n    background-color:hsla(var(--shadcn-secondary) / 0.15);\n    transform:scale(1.05);\n}\n\n.tm-playback-control-row button:active{\n    transform:scale(0.95);\n}\n\n.tm-playback-control-row button svg{\n    width:22px;\n    height:22px;\n    stroke:currentColor;\n    stroke-width:2;\n    fill:none;\n}\n@media (hover: none){\n    .tm-playback-control-row button{\n        width:36px;\n        height:36px;\n    }\n}\n@media (prefers-color-scheme: dark){\n    .tm-playback-control-row button svg{\n        stroke:hsl(var(--shadcn-primary));\n    }\n} `, "" ]);
      const b = y;
    },
    "825": r => {
      function apply(r, o, a) {
        var l = "";
        if (a.supports) {
          l += "@supports (".concat(a.supports, ") {");
        }
        if (a.media) {
          l += "@media ".concat(a.media, " {");
        }
        var u = "undefined" !== typeof a.layer;
        if (u) {
          l += "@layer".concat(a.layer.length > 0 ? " ".concat(a.layer) : "", " {");
        }
        l += a.css;
        if (u) {
          l += "}";
        }
        if (a.media) {
          l += "}";
        }
        if (a.supports) {
          l += "}";
        }
        var p = a.sourceMap;
        if (p && "undefined" !== typeof btoa) {
          l += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(p)))), " */");
        }
        o.styleTagTransform(l, r, o.options);
      }
      function removeStyleElement(r) {
        if (null === r.parentNode) {
          return false;
        }
        r.parentNode.removeChild(r);
      }
      function domAPI(r) {
        if ("undefined" === typeof document) {
          return {
            "update": function update() {},
            "remove": function remove() {}
          };
        }
        var o = r.insertStyleElement(r);
        return {
          "update": function update(a) {
            apply(o, r, a);
          },
          "remove": function remove() {
            removeStyleElement(o);
          }
        };
      }
      r.exports = domAPI;
    },
    "964": (r, o, a) => {
      a.r(o);
      a.d(o, {
        "default": () => V
      });
      var l = a(72);
      var u = a.n(l);
      var p = a(825);
      var v = a.n(p);
      var y = a(659);
      var b = a.n(y);
      var k = a(56);
      var C = a.n(k);
      var _ = a(540);
      var P = a.n(_);
      var S = a(113);
      var M = a.n(S);
      var E = a(703);
      var L = {};
      L.styleTagTransform = M();
      L.setAttributes = C();
      L.insert = b().bind(null, "head");
      L.domAPI = v();
      L.insertStyleElement = P();
      var T = u()(E.A, L);
      const V = E.A && E.A.locals ? E.A.locals : void 0;
    }
  };
  var o = {};
  function __webpack_require__(a) {
    var l = o[a];
    if (void 0 !== l) {
      return l.exports;
    }
    var u = o[a] = {
      "id": a,
      "exports": {}
    };
    r[a](u, u.exports, __webpack_require__);
    return u.exports;
  }
  (() => {
    __webpack_require__.n = r => {
      var o = r && r.__esModule ? () => r["default"] : () => r;
      __webpack_require__.d(o, {
        "a": o
      });
      return o;
    };
  })();
  (() => {
    __webpack_require__.d = (r, o) => {
      for (var a in o) {
        if (__webpack_require__.o(o, a) && !__webpack_require__.o(r, a)) {
          Object.defineProperty(r, a, {
            "enumerable": true,
            "get": o[a]
          });
        }
      }
    };
  })();
  (() => {
    __webpack_require__.o = (r, o) => Object.prototype.hasOwnProperty.call(r, o);
  })();
  (() => {
    __webpack_require__.r = r => {
      if ("undefined" !== typeof Symbol && Symbol.toStringTag) {
        Object.defineProperty(r, Symbol.toStringTag, {
          "value": "Module"
        });
      }
      Object.defineProperty(r, "__esModule", {
        "value": true
      });
    };
  })();
  (() => {
    __webpack_require__.nc = void 0;
  })();
  function initCSSVariables() {
    __webpack_require__(964);
  }
  function _typeof(r) {
    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, _typeof(r);
  }
  function _classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, _toPropertyKey(l.key), l);
    }
  }
  function _createClass(r, o, a) {
    return o && _defineProperties(r.prototype, o), a && _defineProperties(r, a), Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function _defineProperty(r, o, a) {
    return (o = _toPropertyKey(o)) in r ? Object.defineProperty(r, o, {
      "value": a,
      "enumerable": !0,
      "configurable": !0,
      "writable": !0
    }) : r[o] = a, r;
  }
  function _toPropertyKey(r) {
    var o = _toPrimitive(r, "string");
    return "symbol" == _typeof(o) ? o : o + "";
  }
  function _toPrimitive(r, o) {
    if ("object" != _typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != _typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var a = function() {
    function Utils() {
      _classCallCheck(this, Utils);
    }
    return _createClass(Utils, null, [ {
      "key": "throttle",
      "value": function throttle(r) {
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 200;
        var a = 0;
        return function() {
          var l = Date.now();
          if (l - a < o) {
            return;
          }
          a = l;
          for (var u = arguments.length, p = new Array(u), v = 0; v < u; v++) {
            p[v] = arguments[v];
          }
          return r.apply(this, p);
        };
      }
    }, {
      "key": "debounce",
      "value": function debounce(r) {
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 200;
        var a = null;
        return function() {
          var l = this;
          for (var u = arguments.length, p = new Array(u), v = 0; v < u; v++) {
            p[v] = arguments[v];
          }
          if (a) {
            clearTimeout(a);
          }
          a = setTimeout((function() {
            r.apply(l, p);
            a = null;
          }), o);
        };
      }
    }, {
      "key": "isIOS",
      "value": function isIOS() {
        if (null === this._cache.isIOS) {
          this._cache.isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
        }
        return this._cache.isIOS;
      }
    }, {
      "key": "isSafari",
      "value": function isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      }
    }, {
      "key": "isPortrait",
      "value": function isPortrait() {
        return window.innerHeight > window.innerWidth;
      }
    }, {
      "key": "checkDeviceAndOrientation",
      "value": function checkDeviceAndOrientation() {
        return this.isPortrait();
      }
    }, {
      "key": "getSafeAreaInsets",
      "value": function getSafeAreaInsets() {
        var r = 44;
        var o = 34;
        var a = 16;
        var l = window.getComputedStyle(document.documentElement);
        return {
          "top": parseInt(l.getPropertyValue("--sat") || l.getPropertyValue("--safe-area-inset-top") || "0", 10) || r,
          "right": parseInt(l.getPropertyValue("--sar") || l.getPropertyValue("--safe-area-inset-right") || "0", 10) || a,
          "bottom": parseInt(l.getPropertyValue("--sab") || l.getPropertyValue("--safe-area-inset-bottom") || "0", 10) || o,
          "left": parseInt(l.getPropertyValue("--sal") || l.getPropertyValue("--safe-area-inset-left") || "0", 10) || a
        };
      }
    }, {
      "key": "createElementWithStyle",
      "value": function createElementWithStyle(r, o, a) {
        var l = document.createElement(r);
        if (o) {
          l.className = o;
        }
        if (a) {
          l.style.cssText = a;
        }
        return l;
      }
    }, {
      "key": "createSVGIcon",
      "value": function createSVGIcon(r) {
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 24;
        var a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        a.setAttribute("width", o);
        a.setAttribute("height", o);
        a.setAttribute("viewBox", "0 0 24 24");
        a.setAttribute("fill", "none");
        a.setAttribute("stroke", "currentColor");
        a.setAttribute("stroke-width", "2");
        a.setAttribute("stroke-linecap", "round");
        a.setAttribute("stroke-linejoin", "round");
        var l = document.createElementNS("http://www.w3.org/2000/svg", "path");
        l.setAttribute("d", r);
        a.appendChild(l);
        return a;
      }
    }, {
      "key": "findVideoElement",
      "value": function findVideoElement() {
        var r;
        for (var o = 0, a = [ "#player video", "#video video", "div.plyr__video-wrapper video", ".video-js video", "#player > video", "#video-player > video", "video[preload]:not([muted])", "video[src]", "video.video-main", "main video", "video" ]; o < a.length; o++) {
          var l = a[o];
          var u = document.querySelectorAll(l);
          if (u.length > 0) {
            return u[0];
          }
        }
        return null;
      }
    }, {
      "key": "formatTime",
      "value": function formatTime(r) {
        var o = Math.floor(r / 3600);
        var a = Math.floor(r % 3600 / 60);
        var l = Math.floor(r % 60);
        if (o > 0) {
          return "".concat(o, ":").concat(a < 10 ? "0" : "").concat(a, ":").concat(l < 10 ? "0" : "").concat(l);
        }
        return "".concat(a, ":").concat(l < 10 ? "0" : "").concat(l);
      }
    }, {
      "key": "updateSafariThemeColor",
      "value": function updateSafariThemeColor() {
        var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "#000000";
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : false;
        if (!this.isSafari() && !this.isIOS()) {
          return;
        }
        var a = document.querySelector('meta[name="theme-color"]');
        if (o && a && !this._theme.original.dark) {
          this._theme.original.dark = a.content;
        }
        if (!a) {
          (a = document.createElement("meta")).name = "theme-color";
          document.head.appendChild(a);
        }
        a.content = r;
      }
    }, {
      "key": "restoreSafariThemeColor",
      "value": function restoreSafariThemeColor() {
        if (this._theme.original.dark) {
          this.updateSafariThemeColor(this._theme.original.dark);
        } else {
          var r = document.querySelector('meta[name="theme-color"]');
          if (r && r.parentNode) {
            r.parentNode.removeChild(r);
          }
        }
      }
    } ]);
  }();
  _defineProperty(a, "_cache", {
    "isIOS": null,
    "safeAreaInsets": null,
    "lastOrientation": null
  });
  _defineProperty(a, "_theme", {
    "original": {
      "light": null,
      "dark": null
    }
  });
  function PlayerCore_typeof(r) {
    return PlayerCore_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, PlayerCore_typeof(r);
  }
  function ownKeys(r, o) {
    var a = Object.keys(r);
    if (Object.getOwnPropertySymbols) {
      var l = Object.getOwnPropertySymbols(r);
      o && (l = l.filter((function(o) {
        return Object.getOwnPropertyDescriptor(r, o).enumerable;
      }))), a.push.apply(a, l);
    }
    return a;
  }
  function _objectSpread(r) {
    for (var o = 1; o < arguments.length; o++) {
      var a = null != arguments[o] ? arguments[o] : {};
      o % 2 ? ownKeys(Object(a), !0).forEach((function(o) {
        PlayerCore_defineProperty(r, o, a[o]);
      })) : Object.getOwnPropertyDescriptors ? Object.defineProperties(r, Object.getOwnPropertyDescriptors(a)) : ownKeys(Object(a)).forEach((function(o) {
        Object.defineProperty(r, o, Object.getOwnPropertyDescriptor(a, o));
      }));
    }
    return r;
  }
  function PlayerCore_defineProperty(r, o, a) {
    return (o = PlayerCore_toPropertyKey(o)) in r ? Object.defineProperty(r, o, {
      "value": a,
      "enumerable": !0,
      "configurable": !0,
      "writable": !0
    }) : r[o] = a, r;
  }
  function PlayerCore_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function PlayerCore_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, PlayerCore_toPropertyKey(l.key), l);
    }
  }
  function PlayerCore_createClass(r, o, a) {
    return o && PlayerCore_defineProperties(r.prototype, o), a && PlayerCore_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function PlayerCore_toPropertyKey(r) {
    var o = PlayerCore_toPrimitive(r, "string");
    return "symbol" == PlayerCore_typeof(o) ? o : o + "";
  }
  function PlayerCore_toPrimitive(r, o) {
    if ("object" != PlayerCore_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != PlayerCore_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var l = function() {
    function PlayerCore() {
      var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      PlayerCore_classCallCheck(this, PlayerCore);
      this.defaultPlaybackRate = 1;
      this.targetVideo = null;
      this.videoState = {
        "currentTime": 0,
        "isPlaying": false,
        "volume": 1,
        "playbackRate": 1
      };
      this.options = Object.assign({
        "containerId": "tm-video-container",
        "startLooped": false,
        "startMuted": false
      }, r);
      this.callingButton = this.options.callingButton || null;
      this.initialized = false;
    }
    return PlayerCore_createClass(PlayerCore, [ {
      "key": "init",
      "value": function init() {
        if (this.initialized) {
          return;
        }
        this.cleanupExistingOverlays();
        this.targetVideo = this.findTargetVideo();
        if (!this.targetVideo) {
          if (this.callingButton) {
            this.callingButton.style.display = "flex";
          }
          return;
        }
        this.saveVideoState();
        this.initialized = true;
        return this.targetVideo;
      }
    }, {
      "key": "cleanupExistingOverlays",
      "value": function cleanupExistingOverlays() {
        var r = document.querySelectorAll(".tm-video-overlay");
        if (r.length > 0) {
          r.forEach((function(r) {
            if (r && r.parentNode) {
              r.parentNode.removeChild(r);
            }
          }));
        }
      }
    }, {
      "key": "findTargetVideo",
      "value": function findTargetVideo() {
        var r = null;
        var o;
        for (var a = 0, l = [ "#player video", "#video video", "div.plyr__video-wrapper video", ".video-js video", "#player > video", "#video-player > video", "video[preload]:not([muted])" ]; a < l.length; a++) {
          var u = l[a];
          if (r = document.querySelector(u)) {
            return r;
          }
        }
        var p = Array.from(document.querySelectorAll("video"));
        if (0 === p.length) {
          return null;
        }
        if (1 === p.length) {
          return p[0];
        }
        var v = p.map((function(r) {
          return {
            "element": r,
            "rect": r.getBoundingClientRect()
          };
        })).filter((function(r) {
          return r.rect.width > 50 && r.rect.height > 50;
        })).map((function(r) {
          return _objectSpread(_objectSpread({}, r), {}, {
            "area": r.rect.width * r.rect.height
          });
        })).sort((function(r, o) {
          return o.area - r.area;
        }));
        if (v.length > 0) {
          return v[0].element;
        }
        return p[0];
      }
    }, {
      "key": "saveVideoState",
      "value": function saveVideoState() {
        if (!this.targetVideo) {
          return;
        }
        this.originalParent = this.targetVideo.parentNode;
        this.originalIndex = Array.from(this.originalParent.children).indexOf(this.targetVideo);
        this.videoState = {
          "currentTime": this.targetVideo.currentTime,
          "isPaused": this.targetVideo.paused,
          "videoSrc": this.targetVideo.src,
          "posterSrc": this.targetVideo.poster,
          "wasMuted": this.targetVideo.muted,
          "controls": this.targetVideo.controls
        };
      }
    }, {
      "key": "restoreVideoState",
      "value": function restoreVideoState() {
        try {
          this.targetVideo.playbackRate = this.defaultPlaybackRate;
          this.targetVideo.currentTime = this.videoState.currentTime;
          var r = this.targetVideo.play();
          if (void 0 !== r) {
            r["catch"]((function(r) {}));
          }
        } catch (r) {}
      }
    }, {
      "key": "close",
      "value": function close(r, o, l) {
        if (!r) {
          return;
        }
        this.videoState.currentTime = this.targetVideo.currentTime;
        this.videoState.isPlaying = !this.targetVideo.paused;
        this.videoState.volume = this.targetVideo.volume;
        this.videoState.playbackRate = this.targetVideo.playbackRate;
        if (!this.targetVideo.paused) {
          this.targetVideo.pause();
        }
        if (this.originalParent && this.targetVideo && this.targetVideo.parentNode) {
          if (this.targetVideo.parentNode !== this.originalParent) {
            if (-1 !== this.originalIndex && this.originalParent.childNodes.length > this.originalIndex) {
              this.originalParent.insertBefore(this.targetVideo, this.originalParent.childNodes[this.originalIndex]);
            } else {
              this.originalParent.appendChild(this.targetVideo);
            }
            this.targetVideo.style.width = "";
            this.targetVideo.style.height = "";
            this.targetVideo.style.maxHeight = "";
            this.targetVideo.style.margin = "";
            this.targetVideo.style.position = "";
          }
        }
        if (r.parentNode) {
          r.parentNode.removeChild(r);
        }
        if (l && l.parentNode) {
          l.parentNode.removeChild(l);
        }
        document.body.classList.remove("controls-hidden");
        var u = document.getElementById("tm-fullscreen-style");
        if (u) {
          u.parentNode.removeChild(u);
        }
        this.initialized = false;
        a.restoreSafariThemeColor();
        if (this.callingButton) {
          this.callingButton.style.display = "flex";
        }
      }
    } ]);
  }();
  function DOMUtils_typeof(r) {
    return DOMUtils_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, DOMUtils_typeof(r);
  }
  function DOMUtils_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function DOMUtils_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, DOMUtils_toPropertyKey(l.key), l);
    }
  }
  function DOMUtils_createClass(r, o, a) {
    return o && DOMUtils_defineProperties(r.prototype, o), a && DOMUtils_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function DOMUtils_toPropertyKey(r) {
    var o = DOMUtils_toPrimitive(r, "string");
    return "symbol" == DOMUtils_typeof(o) ? o : o + "";
  }
  function DOMUtils_toPrimitive(r, o) {
    if ("object" != DOMUtils_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != DOMUtils_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var u = function() {
    function DOMUtils() {
      DOMUtils_classCallCheck(this, DOMUtils);
    }
    return DOMUtils_createClass(DOMUtils, null, [ {
      "key": "createElementWithStyle",
      "value": function createElementWithStyle(r, o, a) {
        var l = document.createElement(r);
        if (o) {
          l.className = o;
        }
        if (a) {
          l.style.cssText = a;
        }
        return l;
      }
    }, {
      "key": "createSVGIcon",
      "value": function createSVGIcon(r) {
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 24;
        var a = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        a.setAttribute("width", o);
        a.setAttribute("height", o);
        a.setAttribute("viewBox", "0 0 24 24");
        a.setAttribute("fill", "none");
        a.setAttribute("stroke", "currentColor");
        a.setAttribute("stroke-width", "2");
        a.setAttribute("stroke-linecap", "round");
        a.setAttribute("stroke-linejoin", "round");
        var l = document.createElementNS("http://www.w3.org/2000/svg", "path");
        l.setAttribute("d", r);
        a.appendChild(l);
        return a;
      }
    }, {
      "key": "delegateEvent",
      "value": function delegateEvent(r, o, a, l, u) {
        r.addEventListener(o, (function(o) {
          var u = o.target.closest(a);
          if (u && r.contains(u)) {
            l.call(u, o);
          }
        }), u);
      }
    } ]);
  }();
  function PerformanceMonitor_typeof(r) {
    return PerformanceMonitor_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, PerformanceMonitor_typeof(r);
  }
  function _toConsumableArray(r) {
    return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread();
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _unsupportedIterableToArray(r, o) {
    if (r) {
      if ("string" == typeof r) {
        return _arrayLikeToArray(r, o);
      }
      var a = {}.toString.call(r).slice(8, -1);
      return "Object" === a && r.constructor && (a = r.constructor.name), "Map" === a || "Set" === a ? Array.from(r) : "Arguments" === a || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a) ? _arrayLikeToArray(r, o) : void 0;
    }
  }
  function _iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) {
      return Array.from(r);
    }
  }
  function _arrayWithoutHoles(r) {
    if (Array.isArray(r)) {
      return _arrayLikeToArray(r);
    }
  }
  function _arrayLikeToArray(r, o) {
    (null == o || o > r.length) && (o = r.length);
    for (var a = 0, l = Array(o); a < o; a++) {
      l[a] = r[a];
    }
    return l;
  }
  function PerformanceMonitor_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function PerformanceMonitor_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, PerformanceMonitor_toPropertyKey(l.key), l);
    }
  }
  function PerformanceMonitor_createClass(r, o, a) {
    return o && PerformanceMonitor_defineProperties(r.prototype, o), a && PerformanceMonitor_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function PerformanceMonitor_toPropertyKey(r) {
    var o = PerformanceMonitor_toPrimitive(r, "string");
    return "symbol" == PerformanceMonitor_typeof(o) ? o : o + "";
  }
  function PerformanceMonitor_toPrimitive(r, o) {
    if ("object" != PerformanceMonitor_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != PerformanceMonitor_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var p;
  var v = new (function() {
    function PerformanceMonitor() {
      PerformanceMonitor_classCallCheck(this, PerformanceMonitor);
      this.measurements = {};
      this.ongoing = {};
      this.frames = [];
      this.listeners = {};
      this.isMonitoringFPS = false;
      this.lastFrameTime = 0;
      this.frameCount = 0;
    }
    return PerformanceMonitor_createClass(PerformanceMonitor, [ {
      "key": "startMeasure",
      "value": function startMeasure(r) {
        this.ongoing[r] = performance.now();
      }
    }, {
      "key": "endMeasure",
      "value": function endMeasure(r) {
        if (!this.ongoing[r]) {
          return 0;
        }
        var o;
        var a = performance.now() - this.ongoing[r];
        if (!this.measurements[r]) {
          this.measurements[r] = [];
        }
        this.measurements[r].push(a);
        delete this.ongoing[r];
        return a;
      }
    }, {
      "key": "startFPSMonitoring",
      "value": function startFPSMonitoring() {
        var r = this;
        if (this.isMonitoringFPS) {
          return;
        }
        this.isMonitoringFPS = true;
        this.lastFrameTime = performance.now();
        this.frameCount = 0;
        this.frames = [];
        var o = function measureFPS(a) {
          if (!r.isMonitoringFPS) {
            return;
          }
          var l = performance.now();
          var u = l - r.lastFrameTime;
          if (u > 1e3) {
            var p = 1e3 * r.frameCount / u;
            r.frames.push(p);
            r.frameCount = 0;
            r.lastFrameTime = l;
          }
          r.frameCount++;
          requestAnimationFrame(o);
        };
        requestAnimationFrame(o);
      }
    }, {
      "key": "stopFPSMonitoring",
      "value": function stopFPSMonitoring() {
        this.isMonitoringFPS = false;
      }
    }, {
      "key": "getAverageFPS",
      "value": function getAverageFPS() {
        if (0 === this.frames.length) {
          return 0;
        }
        var r;
        return this.frames.reduce((function(r, o) {
          return r + o;
        }), 0) / this.frames.length;
      }
    }, {
      "key": "getStats",
      "value": function getStats(r) {
        if (!this.measurements[r] || 0 === this.measurements[r].length) {
          return {
            "min": 0,
            "max": 0,
            "avg": 0,
            "count": 0
          };
        }
        var o = this.measurements[r];
        var a;
        var l;
        var u;
        return {
          "min": Math.min.apply(Math, _toConsumableArray(o)),
          "max": Math.max.apply(Math, _toConsumableArray(o)),
          "avg": o.reduce((function(r, o) {
            return r + o;
          }), 0) / o.length,
          "count": o.length
        };
      }
    } ]);
  }());
  function AnimationTimer_typeof(r) {
    return AnimationTimer_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, AnimationTimer_typeof(r);
  }
  function AnimationTimer_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function AnimationTimer_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, AnimationTimer_toPropertyKey(l.key), l);
    }
  }
  function AnimationTimer_createClass(r, o, a) {
    return o && AnimationTimer_defineProperties(r.prototype, o), a && AnimationTimer_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function AnimationTimer_toPropertyKey(r) {
    var o = AnimationTimer_toPrimitive(r, "string");
    return "symbol" == AnimationTimer_typeof(o) ? o : o + "";
  }
  function AnimationTimer_toPrimitive(r, o) {
    if ("object" != AnimationTimer_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != AnimationTimer_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var y;
  var b = new (function() {
    function AnimationTimer() {
      AnimationTimer_classCallCheck(this, AnimationTimer);
      this.timers = new Map;
    }
    return AnimationTimer_createClass(AnimationTimer, [ {
      "key": "setTimeout",
      "value": function setTimeout(r, o) {
        var a = this;
        var l;
        var u = (arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : null) || Math.random().toString(36).substr(2, 9);
        var p = performance.now();
        var v = function timerLoop(l) {
          if (!a.timers.has(u)) {
            return;
          }
          var y;
          if (l - p >= o) {
            r();
            a.clearTimeout(u);
          } else {
            var b = a.timers.get(u);
            b.rafId = requestAnimationFrame(v);
            a.timers.set(u, b);
          }
        };
        this.timers.set(u, {
          "rafId": requestAnimationFrame(v),
          "callback": r,
          "type": "timeout"
        });
        return u;
      }
    }, {
      "key": "clearTimeout",
      "value": function clearTimeout(r) {
        if (this.timers.has(r)) {
          var o = this.timers.get(r);
          cancelAnimationFrame(o.rafId);
          this.timers["delete"](r);
        }
      }
    }, {
      "key": "clearAll",
      "value": function clearAll() {
        this.timers.forEach((function(r) {
          cancelAnimationFrame(r.rafId);
        }));
        this.timers.clear();
      }
    } ]);
  }());
  function UIManager_typeof(r) {
    return UIManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, UIManager_typeof(r);
  }
  function UIManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function UIManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, UIManager_toPropertyKey(l.key), l);
    }
  }
  function UIManager_createClass(r, o, a) {
    return o && UIManager_defineProperties(r.prototype, o), a && UIManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function UIManager_toPropertyKey(r) {
    var o = UIManager_toPrimitive(r, "string");
    return "symbol" == UIManager_typeof(o) ? o : o + "";
  }
  function UIManager_toPrimitive(r, o) {
    if ("object" != UIManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != UIManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var k = function() {
    function UIManager(r) {
      UIManager_classCallCheck(this, UIManager);
      this.playerCore = r;
      this.targetVideo = r.targetVideo;
      this.overlay = null;
      this.container = null;
      this.playerContainer = null;
      this.videoWrapper = null;
      this.handleContainer = null;
      this.handle = null;
      this.closeBtn = null;
      this.settingsBtn = null;
      this.settingsPanel = null;
      this.buttonContainer = null;
      this.safeArea = {
        "top": 44,
        "bottom": 34
      };
      this.isLandscape = false;
      this.controlsVisible = true;
      this.controlsHideTimerId = null;
      this.isMouseOverControls = false;
      this.loadStyles();
    }
    return UIManager_createClass(UIManager, [ {
      "key": "loadStyles",
      "value": function loadStyles() {}
    }, {
      "key": "createUI",
      "value": function createUI() {
        this.createOverlayAndContainer();
        this.createPlayerContainer();
        this.createVideoWrapper();
        this.createResizeHandle();
        this.createCloseButton();
        this.createSettingsButton();
        this.createButtonContainer();
        this.createSettingsPanel();
        this.setupOrientationListener();
        return {
          "overlay": this.overlay,
          "container": this.container,
          "playerContainer": this.playerContainer,
          "videoWrapper": this.videoWrapper,
          "handleContainer": this.handleContainer,
          "handle": this.handle,
          "closeBtn": this.closeBtn,
          "settingsBtn": this.settingsBtn,
          "settingsPanel": this.settingsPanel,
          "buttonContainer": this.buttonContainer
        };
      }
    }, {
      "key": "createOverlayAndContainer",
      "value": function createOverlayAndContainer() {
        this.overlay = document.createElement("div");
        this.overlay.className = "tm-video-overlay";
        this.overlay.style.zIndex = "9990";
        var r = window.innerWidth * (4 / 5);
        var o = window.innerWidth * (9 / 16);
        this.container = document.createElement("div");
        this.container.className = "tm-video-container";
        this.container.style.height = "".concat(r, "px");
        this.container.style.minHeight = "".concat(o, "px");
      }
    }, {
      "key": "createPlayerContainer",
      "value": function createPlayerContainer() {
        this.playerContainer = document.createElement("div");
        this.playerContainer.className = "tm-player-container";
      }
    }, {
      "key": "createVideoWrapper",
      "value": function createVideoWrapper() {
        var r = this;
        this.videoWrapper = document.createElement("div");
        this.videoWrapper.className = "tm-video-wrapper";
        if (this.targetVideo && this.targetVideo.parentNode) {
          this.targetVideo.parentNode.removeChild(this.targetVideo);
        }
        this.targetVideo.controls = false;
        this.videoWrapper.appendChild(this.targetVideo);
        this.targetVideo.addEventListener("loadedmetadata", (function() {
          r.updateVideoAspectRatio();
        }));
        var o = null;
        var a = false;
        var l = 1;
        var u = function handlePointerDown(u) {
          if (u.target.closest(".tm-control-buttons, .tm-button-container, .tm-control-button, .tm-close-button, .tm-settings-button")) {
            return;
          }
          if (o) {
            clearTimeout(o);
          }
          l = r.playerCore.targetVideo.playbackRate;
          a = false;
          o = setTimeout((function() {
            a = true;
            l = r.playerCore.targetVideo.playbackRate;
            r.playerCore.targetVideo.playbackRate = 3;
            var o = document.createElement("div");
            o.className = "tm-speed-indicator";
            o.textContent = "3x";
            o.style.position = "absolute";
            o.style.top = "50%";
            o.style.left = "50%";
            o.style.transform = "translate(-50%, -50%)";
            o.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
            o.style.color = "white";
            o.style.padding = "8px 16px";
            o.style.borderRadius = "4px";
            o.style.fontSize = "24px";
            o.style.fontWeight = "bold";
            o.style.zIndex = "9999";
            r.videoWrapper.appendChild(o);
            if (window.navigator.vibrate) {
              window.navigator.vibrate(50);
            }
            if (r.playerCore.targetVideo.paused) {
              r.playerCore.targetVideo.play();
            }
          }), 800);
        };
        var p = function handlePointerUp(u) {
          if (o) {
            clearTimeout(o);
            o = null;
          }
          if (a) {
            r.playerCore.targetVideo.playbackRate = l;
            var p = r.videoWrapper.querySelector(".tm-speed-indicator");
            if (p) {
              p.remove();
            }
            u.preventDefault();
            u.stopPropagation();
            a = false;
            return;
          }
        };
        var v = function handlePointerLeave(u) {
          if (o) {
            clearTimeout(o);
            o = null;
          }
          if (a) {
            r.playerCore.targetVideo.playbackRate = l;
            var p = r.videoWrapper.querySelector(".tm-speed-indicator");
            if (p) {
              p.remove();
            }
            a = false;
          }
        };
        this.videoWrapper.addEventListener("mousedown", u);
        this.videoWrapper.addEventListener("mouseup", p);
        this.videoWrapper.addEventListener("mouseleave", v);
        this.videoWrapper.addEventListener("touchstart", u, {
          "passive": true
        });
        this.videoWrapper.addEventListener("touchend", p);
        this.videoWrapper.addEventListener("touchcancel", v);
        this.videoWrapper.addEventListener("click", (function(o) {
          if (a) {
            return;
          }
          if (o.target.closest(".tm-control-buttons, .tm-button-container, .tm-control-button, .tm-close-button, .tm-settings-button")) {
            return;
          }
          var l = function togglePlayPause() {
            if (!r.playerCore.targetVideo) {
              return;
            }
            if (r.playerCore.targetVideo.paused) {
              r.playerCore.targetVideo.play();
            } else {
              r.playerCore.targetVideo.pause();
              if (r.playerCore.controlManager) {
                r.playerCore.controlManager.showPauseIndicator();
              }
            }
            if (r.playerCore.controlManager) {
              r.playerCore.controlManager.updatePlayPauseButton();
            }
          };
          if (r.isLandscape) {
            if (!r.controlsVisible) {
              r.showControls();
              r.autoHideControls();
              return;
            }
            l();
          } else {
            l();
          }
        }));
      }
    }, {
      "key": "createResizeHandle",
      "value": function createResizeHandle() {
        var r = this;
        this.handleContainer = document.createElement("div");
        this.handleContainer.className = "tm-handle-container";
        this.handle = document.createElement("div");
        this.handle.className = "tm-resize-handle";
        this.handle.insertAdjacentHTML("beforeend", '\n            <div style="\n                position: absolute;\n                left: -10px;\n                right: -10px;\n                top: -15px;\n                bottom: -15px;\n                background: transparent;\n            "></div>\n        ');
        this.handle.addEventListener("mouseenter", (function() {
          r.handle.style.opacity = "1";
          r.handle.style.backgroundColor = "hsla(var(--shadcn-foreground) / 0.8)";
        }));
        this.handle.addEventListener("mouseleave", (function() {
          if (!r.isDraggingHandle) {
            r.handle.style.opacity = "0.5";
            r.handle.style.backgroundColor = "hsla(var(--shadcn-foreground) / 0.6)";
          }
        }));
        this.handle.addEventListener("mousedown", (function() {
          r.handle.style.cursor = "grabbing";
          if (window.navigator.vibrate) {
            window.navigator.vibrate(5);
          }
        }));
        document.addEventListener("mouseup", (function() {
          if (!r.isDraggingHandle) {
            r.handle.style.cursor = "grab";
          }
        }));
        this.handle.addEventListener("touchstart", (function() {
          r.handle.style.opacity = "1";
          r.handle.style.backgroundColor = "hsla(var(--shadcn-foreground) / 0.8)";
          if (window.navigator.vibrate) {
            window.navigator.vibrate(5);
          }
        }), {
          "passive": true
        });
        this.handle.addEventListener("touchend", (function() {
          if (!r.isDraggingHandle) {
            r.handle.style.opacity = "0.5";
            r.handle.style.backgroundColor = "hsla(var(--shadcn-foreground) / 0.6)";
          }
        }));
        this.handleContainer.appendChild(this.handle);
      }
    }, {
      "key": "createCloseButton",
      "value": function createCloseButton() {
        var r = this;
        this.closeBtn = document.createElement("button");
        this.closeBtn.className = "tm-close-button tm-control-button-base";
        var o = '\n            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n            </svg>\n        ';
        this.closeBtn.innerHTML = o;
        this.closeBtn.addEventListener("mouseenter", (function() {
          r.closeBtn.style.backgroundColor = "hsla(var(--shadcn-destructive) / 0.9)";
          r.closeBtn.style.transform = "scale(1.1)";
        }));
        this.closeBtn.addEventListener("mouseleave", (function() {
          r.closeBtn.style.backgroundColor = "hsla(var(--shadcn-background) / 0.7)";
          r.closeBtn.style.transform = "scale(1)";
        }));
      }
    }, {
      "key": "createSettingsButton",
      "value": function createSettingsButton() {
        var r = this;
        this.settingsBtn = document.createElement("button");
        this.settingsBtn.className = "tm-settings-button tm-control-button-base";
        var o = '\n            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M19.4 15C19.1277 15.6171 19.2583 16.3378 19.73 16.82L19.79 16.88C20.1837 17.2737 20.4009 17.7994 20.4009 18.345C20.4009 18.8906 20.1837 19.4163 19.79 19.81C19.4163 20.2037 18.8906 20.4209 18.345 20.4209C17.7994 20.4209 17.2737 20.2037 16.91 19.81L16.85 19.75C16.3678 19.2783 15.6471 19.1477 15.03 19.42C14.4301 19.6801 14.0386 20.2502 14.03 20.89V21C14.03 21.5304 13.8193 22.0391 13.4442 22.4142C13.0691 22.7893 12.5604 23 12.03 23C11.4996 23 10.9909 22.7893 10.6158 22.4142C10.2407 22.0391 10.03 21.5304 10.03 21V20.91C10.0112 20.2556 9.5979 19.6818 8.98 19.43C8.36289 19.1577 7.64221 19.2883 7.16 19.76L7.1 19.82C6.73629 20.2137 6.21056 20.4309 5.665 20.4309C5.11944 20.4309 4.59371 20.2137 4.23 19.82C3.83628 19.4463 3.61911 18.9206 3.61911 18.375C3.61911 17.8294 3.83628 17.3037 4.23 16.93L4.29 16.87C4.76167 16.3878 4.89231 15.6671 4.62 15.05C4.35995 14.4501 3.78985 14.0586 3.15 14.05H3C2.46957 14.05 1.96086 13.8393 1.58579 13.4642C1.21071 13.0891 1 12.5804 1 12.05C1 11.5196 1.21071 11.0109 1.58579 10.6358C1.96086 10.2607 2.46957 10.05 3 10.05H3.09C3.74435 10.0312 4.31814 9.61788 4.57 9C4.84231 8.38289 4.71167 7.66221 4.24 7.18L4.18 7.12C3.78628 6.75629 3.56911 6.23056 3.56911 5.685C3.56911 5.13944 3.78628 4.61371 4.18 4.25C4.55371 3.85628 5.07944 3.63911 5.625 3.63911C6.17056 3.63911 6.69629 3.85628 7.07 4.25L7.13 4.31C7.61221 4.78167 8.33289 4.91231 8.95 4.64H9C9.59994 4.37995 9.99144 3.80985 10 3.17V3C10 2.46957 10.2107 1.96086 10.5858 1.58579C10.9609 1.21071 11.4696 1 12 1C12.5304 1 13.0391 1.21071 13.4142 1.58579C13.7893 1.96086 14 2.46957 14 3V3.09C14.0086 3.72985 14.4001 4.29995 15 4.56C15.6171 4.83231 16.3378 4.70167 16.82 4.23L16.88 4.17C17.2437 3.77628 17.7694 3.55911 18.325 3.55911C18.8806 3.55911 19.4063 3.77628 19.77 4.17C20.1637 4.54371 20.3809 5.06944 20.3809 5.615C20.3809 6.16056 20.1637 6.68629 19.77 7.06L19.71 7.12C19.2383 7.60221 19.1077 8.32289 19.38 8.94L19.4 9C19.66 9.59994 20.2301 9.99144 20.87 10H21C21.5304 10 22.0391 10.2107 22.4142 10.5858C22.7893 10.9609 23 11.4696 23 12C23 12.5304 22.7893 13.0391 22.4142 13.4142C22.0391 13.7893 21.5304 14 21 14H20.91C20.2702 14.0086 19.7001 14.4001 19.44 15H19.4Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n            </svg>\n        ';
        this.settingsBtn.innerHTML = o;
        this.settingsBtn.addEventListener("mouseenter", (function() {
          r.settingsBtn.style.backgroundColor = "hsla(var(--shadcn-accent) / 0.9)";
          r.settingsBtn.style.transform = "rotate(45deg)";
        }));
        this.settingsBtn.addEventListener("mouseleave", (function() {
          r.settingsBtn.style.backgroundColor = "hsla(var(--shadcn-background) / 0.7)";
          r.settingsBtn.style.transform = "rotate(0deg)";
        }));
      }
    }, {
      "key": "createSettingsPanel",
      "value": function createSettingsPanel() {
        this.settingsPanel = document.createElement("div");
        this.settingsPanel.className = "tm-settings-panel";
        this.settingsPanel.style.display = "none";
      }
    }, {
      "key": "createButtonContainer",
      "value": function createButtonContainer() {
        this.buttonContainer = document.createElement("div");
        this.buttonContainer.className = "tm-button-container";
        this.buttonContainer.style.display = "flex";
        this.buttonContainer.style.alignItems = "center";
        this.buttonContainer.style.gap = "10px";
        this.buttonContainer.style.zIndex = "99999";
      }
    }, {
      "key": "setupOrientationListener",
      "value": function setupOrientationListener() {
        var r = this;
        this.checkOrientation();
        window.addEventListener("orientationchange", (function() {
          setTimeout((function() {
            r.checkOrientation();
          }), 300);
        }));
        window.addEventListener("resize", (function() {
          r.checkOrientation();
        }));
      }
    }, {
      "key": "setupInteractionListeners",
      "value": function setupInteractionListeners() {
        var r = this;
        if (!this.overlay) {
          return;
        }
        v.startMeasure("setupEvents");
        this.overlay.addEventListener("mousemove", (function() {
          if (r.isLandscape) {
            r.showControls();
            r.autoHideControls();
          }
        }));
        this.overlay.addEventListener("touchmove", (function() {
          if (r.isLandscape) {
            r.showControls();
            r.autoHideControls();
          }
        }), {
          "passive": true
        });
        this.overlay.addEventListener("touchstart", (function(o) {
          if (r.isLandscape && o.target.closest(".tm-control-button, .tm-time-control-button, .tm-close-button")) {
            r.showControls();
            r.autoHideControls();
            o.stopPropagation();
          }
        }), {
          "passive": false
        });
        u.delegateEvent(this.playerContainer, "mouseenter", ".tm-control-buttons, .tm-settings-button, .tm-button-container, .tm-settings-panel", (function() {
          r.isMouseOverControls = true;
          if (r.controlsHideTimerId) {
            b.clearTimeout(r.controlsHideTimerId);
            r.controlsHideTimerId = null;
          }
        }));
        u.delegateEvent(this.playerContainer, "mouseleave", ".tm-control-buttons, .tm-settings-button, .tm-button-container, .tm-settings-panel", (function() {
          r.isMouseOverControls = false;
          if (r.isLandscape) {
            r.autoHideControls();
          }
        }));
        var o = v.endMeasure("setupEvents");
      }
    }, {
      "key": "checkOrientation",
      "value": function checkOrientation() {
        var r = window.innerWidth > window.innerHeight;
        if (this.isLandscape !== r) {
          this.isLandscape = r;
          this.handleOrientationChange();
        }
      }
    }, {
      "key": "handleOrientationChange",
      "value": function handleOrientationChange() {
        this.updateContainerMinHeight();
        this.updateVideoAspectRatio();
        if (this.playerCore.controlManager) {
          this.playerCore.controlManager.updateProgressBar();
          this.playerCore.controlManager.updateCurrentTimeDisplay();
          this.updateControlPanelVisibility();
        }
        if (this.handleContainer) {
          this.handleContainer.style.display = this.isLandscape ? "none" : "flex";
        }
        if (this.isLandscape) {
          this.showControls();
          this.autoHideControls();
        } else {
          this.showControls();
          if (this.controlsHideTimerId) {
            b.clearTimeout(this.controlsHideTimerId);
            this.controlsHideTimerId = null;
          }
        }
      }
    }, {
      "key": "updateControlPanelVisibility",
      "value": function updateControlPanelVisibility() {
        if (!this.playerCore.controlManager) {
          return;
        }
        var r = this.playerCore.controlManager.controlButtonsContainer;
        if (!r) {
          return;
        }
        var o = r.querySelector(".tm-progress-row");
        var a = r.querySelector(".tm-seek-control-row");
        var l = r.querySelector(".tm-loop-control-row");
        var u = r.querySelector(".tm-playback-control-row");
        if (this.isLandscape) {
          if (o) {
            o.style.display = "flex";
            o.style.backgroundColor = "transparent";
          }
          if (a) {
            a.style.display = "flex";
            a.style.justifyContent = "center";
            a.style.alignItems = "center";
            a.style.gap = "20px";
            a.style.backgroundColor = "transparent";
          }
          if (l) {
            l.style.display = "flex";
            l.style.backgroundColor = "transparent";
          }
          if (u) {
            u.style.display = "flex";
            u.style.backgroundColor = "transparent";
          }
          if (this.settingsBtn) {
            this.settingsBtn.style.display = "flex";
            this.settingsBtn.style.backgroundColor = "hsla(var(--shadcn-secondary) / 0.3)";
            this.settingsBtn.style.backdropFilter = "blur(4px)";
          }
          var p = r.querySelector(".tm-rewind-group");
          var v = r.querySelector(".tm-forward-group");
          if (p) {
            p.style.width = "auto";
            p.style.flex = "0 1 auto";
          }
          if (v) {
            v.style.width = "auto";
            v.style.flex = "0 1 auto";
          }
        } else {
          if (o) {
            o.style.display = "";
          }
          if (a) {
            a.style.display = "";
            a.style.justifyContent = "";
            a.style.alignItems = "";
            a.style.gap = "";
          }
          if (l) {
            l.style.display = "";
          }
          if (u) {
            u.style.display = "";
          }
          if (this.settingsBtn) {
            this.settingsBtn.style.display = "";
            this.settingsBtn.style.backgroundColor = "";
            this.settingsBtn.style.backdropFilter = "";
          }
          var y = r.querySelector(".tm-rewind-group");
          var b = r.querySelector(".tm-forward-group");
          if (y) {
            y.style.width = "";
            y.style.flex = "";
          }
          if (b) {
            b.style.width = "";
            b.style.flex = "";
          }
        }
      }
    }, {
      "key": "updateVideoAspectRatio",
      "value": function updateVideoAspectRatio() {
        if (!this.videoWrapper || !this.targetVideo) {
          return;
        }
        var r = this.targetVideo.videoWidth;
        var o = this.targetVideo.videoHeight;
        if (r && o) {
          var a;
          var l;
          if (r / o < 1) {
            this.videoWrapper.classList.add("video-portrait");
          } else {
            this.videoWrapper.classList.remove("video-portrait");
          }
        }
      }
    }, {
      "key": "showControls",
      "value": function showControls() {
        if (!this.overlay) {
          return;
        }
        this.overlay.classList.remove("controls-hidden");
        document.body.classList.remove("controls-hidden");
        this.controlsVisible = true;
        if (this.controlsHideTimerId) {
          b.clearTimeout(this.controlsHideTimerId);
          this.controlsHideTimerId = null;
        }
      }
    }, {
      "key": "hideControls",
      "value": function hideControls() {
        if (!this.overlay || !this.isLandscape) {
          return;
        }
        this.overlay.classList.add("controls-hidden");
        document.body.classList.add("controls-hidden");
        this.controlsVisible = false;
      }
    }, {
      "key": "toggleControlsVisibility",
      "value": function toggleControlsVisibility() {
        if (this.controlsVisible) {
          this.hideControls();
        } else {
          this.showControls();
          this.autoHideControls();
        }
      }
    }, {
      "key": "autoHideControls",
      "value": function autoHideControls() {
        var r = this;
        v.startMeasure("autoHideControls");
        if (!this.isLandscape) {
          v.endMeasure("autoHideControls");
          return;
        }
        if (this.isMouseOverControls) {
          v.endMeasure("autoHideControls");
          return;
        }
        if (this.controlsHideTimerId) {
          b.clearTimeout(this.controlsHideTimerId);
        }
        this.controlsHideTimerId = b.setTimeout((function() {
          r.hideControls();
        }), 3e3, "controlsHide");
        v.endMeasure("autoHideControls");
      }
    }, {
      "key": "updateContainerMinHeight",
      "value": function updateContainerMinHeight() {
        if (!this.container || !this.targetVideo) {
          return;
        }
        if (this.isLandscape) {
          return;
        }
        var r = this.targetVideo.videoWidth || this.targetVideo.naturalWidth;
        var o = this.targetVideo.videoHeight || this.targetVideo.naturalHeight;
        if (r && o) {
          var a = window.innerWidth * (o / r);
          this.container.style.minHeight = "".concat(a, "px");
        }
      }
    }, {
      "key": "assembleDOM",
      "value": function assembleDOM() {
        this.container.appendChild(this.videoWrapper);
        this.buttonContainer.appendChild(this.closeBtn);
        this.buttonContainer.appendChild(this.settingsBtn);
        this.playerContainer.appendChild(this.buttonContainer);
        this.playerContainer.appendChild(this.container);
        this.playerContainer.appendChild(this.handleContainer);
        this.playerContainer.appendChild(this.settingsPanel);
        if (this.playerCore.controlManager && this.playerCore.controlManager.controlButtonsContainer) {
          this.playerContainer.appendChild(this.playerCore.controlManager.controlButtonsContainer);
        }
        document.body.appendChild(this.overlay);
        document.body.appendChild(this.playerContainer);
        this.updateContainerMinHeight();
        this.setupInteractionListeners();
      }
    } ]);
  }();
  function ControlManager_typeof(r) {
    return ControlManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, ControlManager_typeof(r);
  }
  function _createForOfIteratorHelper(r, o) {
    var a = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!a) {
      if (Array.isArray(r) || (a = ControlManager_unsupportedIterableToArray(r)) || o && r && "number" == typeof r.length) {
        a && (r = a);
        var l = 0, u = function F() {};
        return {
          "s": u,
          "n": function n() {
            return l >= r.length ? {
              "done": !0
            } : {
              "done": !1,
              "value": r[l++]
            };
          },
          "e": function e(r) {
            throw r;
          },
          "f": u
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var p, v = !0, y = !1;
    return {
      "s": function s() {
        a = a.call(r);
      },
      "n": function n() {
        var r = a.next();
        return v = r.done, r;
      },
      "e": function e(r) {
        y = !0, p = r;
      },
      "f": function f() {
        try {
          v || null == a["return"] || a["return"]();
        } finally {
          if (y) {
            throw p;
          }
        }
      }
    };
  }
  function ControlManager_unsupportedIterableToArray(r, o) {
    if (r) {
      if ("string" == typeof r) {
        return ControlManager_arrayLikeToArray(r, o);
      }
      var a = {}.toString.call(r).slice(8, -1);
      return "Object" === a && r.constructor && (a = r.constructor.name), "Map" === a || "Set" === a ? Array.from(r) : "Arguments" === a || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a) ? ControlManager_arrayLikeToArray(r, o) : void 0;
    }
  }
  function ControlManager_arrayLikeToArray(r, o) {
    (null == o || o > r.length) && (o = r.length);
    for (var a = 0, l = Array(o); a < o; a++) {
      l[a] = r[a];
    }
    return l;
  }
  function ControlManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function ControlManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, ControlManager_toPropertyKey(l.key), l);
    }
  }
  function ControlManager_createClass(r, o, a) {
    return o && ControlManager_defineProperties(r.prototype, o), a && ControlManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function ControlManager_toPropertyKey(r) {
    var o = ControlManager_toPrimitive(r, "string");
    return "symbol" == ControlManager_typeof(o) ? o : o + "";
  }
  function ControlManager_toPrimitive(r, o) {
    if ("object" != ControlManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != ControlManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var C = function() {
    function ControlManager(r, o) {
      ControlManager_classCallCheck(this, ControlManager);
      this.playerCore = r;
      this.targetVideo = r.targetVideo;
      this.uiElements = o;
      this.controlButtonsContainer = null;
      this.playPauseButton = null;
      this.muteButton = null;
      this.progressBarElement = null;
      this.progressIndicator = null;
      this.currentTimeDisplay = null;
      this.totalDurationDisplay = null;
      this.timeIndicator = null;
      this.progressControlsContainer = null;
      this.pauseIndicator = null;
      this.playbackRateIndicator = null;
      this.loopManager = null;
      this.loopStartMarker = null;
      this.loopEndMarker = null;
      this.loopStartDisplay = null;
      this.loopEndDisplay = null;
      this.isDraggingProgress = false;
      this.clickLock = false;
      this.clickLockTimeout = null;
      this.volumeSlider = null;
      this.volumeLevel = null;
      this.volumeValue = null;
      this.lastVolume = 1;
      this.supportsVolumeControl = this.checkVolumeControlSupport();
    }
    return ControlManager_createClass(ControlManager, [ {
      "key": "checkVolumeControlSupport",
      "value": function checkVolumeControlSupport() {
        var r;
        return !(/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream);
      }
    }, {
      "key": "init",
      "value": function init() {
        this.progressControlsContainer = this.createProgressControls();
        this.controlButtonsContainer = this.createControlButtonsContainer();
        this.initEventListeners();
        return {
          "progressControlsContainer": this.progressControlsContainer,
          "controlButtonsContainer": this.controlButtonsContainer
        };
      }
    }, {
      "key": "setLoopManager",
      "value": function setLoopManager(r) {
        this.loopManager = r;
      }
    }, {
      "key": "initEventListeners",
      "value": function initEventListeners() {
        var r = this;
        this.targetVideo.addEventListener("timeupdate", this.updateProgressBar.bind(this));
        this.targetVideo.addEventListener("timeupdate", this.updateCurrentTimeDisplay.bind(this));
        this.targetVideo.addEventListener("loadedmetadata", (function() {
          r.updateProgressBar();
          r.updateLoopTimeDisplay();
          r.updateLoopMarkers();
        }));
        this.progressBarElement.addEventListener("click", this.handleProgressClick.bind(this));
        this.progressBarElement.addEventListener("mousedown", this.startProgressDrag.bind(this));
        this.progressBarElement.addEventListener("touchstart", this.startProgressDrag.bind(this), {
          "passive": false
        });
        this.targetVideo.addEventListener("play", (function() {
          r.updatePlayPauseButton();
        }));
        this.targetVideo.addEventListener("pause", (function() {
          r.updatePlayPauseButton();
          r.showPauseIndicator();
        }));
        this.targetVideo.addEventListener("volumechange", (function() {
          r.updateMuteButton();
        }));
        this.targetVideo.addEventListener("ratechange", (function() {
          if (r.playbackRateSlider) {
            var o = r.targetVideo.playbackRate;
            var a = (o - .1) / (3 - .1) * 100;
            if (r.updatePlaybackRateSlider) {
              r.updatePlaybackRateSlider(a);
            }
            r.showPlaybackRateIndicator(o);
          }
        }));
        if (this.loopManager) {
          this.targetVideo.addEventListener("timeupdate", (function() {
            r.loopManager.checkAndLoop();
          }));
        }
      }
    }, {
      "key": "createProgressControls",
      "value": function createProgressControls() {
        var r = this;
        this.progressControlsContainer = document.createElement("div");
        this.progressControlsContainer.className = "tm-progress-controls";
        var o = document.createElement("div");
        o.className = "tm-time-display-container";
        this.currentTimeDisplay = document.createElement("span");
        this.currentTimeDisplay.className = "tm-current-time";
        this.currentTimeDisplay.textContent = "00:00:00";
        this.totalDurationDisplay = document.createElement("span");
        this.totalDurationDisplay.className = "tm-total-duration";
        this.totalDurationDisplay.textContent = "-00:00:00";
        var a = document.createElement("div");
        a.className = "tm-progress-bar-container";
        this.progressBarElement = document.createElement("div");
        this.progressBarElement.className = "tm-progress-bar";
        this.progressIndicator = document.createElement("div");
        this.progressIndicator.className = "tm-progress-indicator";
        a.addEventListener("mouseenter", (function() {
          r.progressBarElement.classList.add("tm-progress-bar-expanded");
        }));
        a.addEventListener("mouseleave", (function() {
          if (!r.isDraggingProgress) {
            r.progressBarElement.classList.add("tm-progress-bar-normal");
            r.progressBarElement.classList.remove("tm-progress-bar-expanded");
          }
        }));
        a.addEventListener("touchstart", (function() {
          r.progressBarElement.classList.add("tm-progress-bar-expanded");
          r.progressBarElement.classList.remove("tm-progress-bar-normal");
        }), {
          "passive": true
        });
        a.addEventListener("touchend", (function() {
          if (!r.isDraggingProgress) {
            r.progressBarElement.classList.add("tm-progress-bar-normal");
            r.progressBarElement.classList.remove("tm-progress-bar-expanded");
          }
        }));
        this.loopStartMarker = document.createElement("div");
        this.loopStartMarker.className = "tm-loop-marker tm-loop-start-marker";
        this.loopStartMarker.style.display = "none";
        this.loopEndMarker = document.createElement("div");
        this.loopEndMarker.className = "tm-loop-marker tm-loop-end-marker";
        this.loopEndMarker.style.display = "none";
        this.loopRangeElement = document.createElement("div");
        this.loopRangeElement.className = "tm-loop-range";
        this.loopRangeElement.style.display = "none";
        o.appendChild(this.currentTimeDisplay);
        o.appendChild(this.totalDurationDisplay);
        this.progressBarElement.appendChild(this.progressIndicator);
        a.appendChild(this.progressBarElement);
        a.appendChild(this.loopStartMarker);
        a.appendChild(this.loopEndMarker);
        a.appendChild(this.loopRangeElement);
        this.progressControlsContainer.appendChild(o);
        this.progressControlsContainer.appendChild(a);
        return this.progressControlsContainer;
      }
    }, {
      "key": "createControlButtonsContainer",
      "value": function createControlButtonsContainer() {
        var r = this;
        this.controlButtonsContainer = document.createElement("div");
        this.controlButtonsContainer.className = "tm-control-buttons";
        var o = document.createElement("div");
        o.className = "tm-progress-row";
        o.appendChild(this.progressControlsContainer);
        this.controlButtonsContainer.appendChild(o);
        var a = document.createElement("div");
        a.className = "tm-seek-control-row";
        var l = document.createElement("div");
        l.className = "tm-loop-control-row";
        var u = document.createElement("div");
        u.className = "tm-time-display";
        var p = document.createElement("div");
        p.className = "tm-loop-control";
        var v = document.createElement("div");
        v.className = "tm-rewind-group";
        var y = document.createElement("div");
        y.className = "tm-forward-group";
        var b = document.createElement("div");
        b.className = "tm-rewind-buttons-container";
        var k = document.createElement("div");
        k.className = "tm-forward-buttons-container";
        v.appendChild(b);
        y.appendChild(k);
        a.appendChild(v);
        a.appendChild(y);
        this.addTimeControlButton(b, "-5s", (function() {
          return r.seekRelative(-5);
        }));
        this.addTimeControlButton(b, "-10s", (function() {
          return r.seekRelative(-10);
        }));
        this.addTimeControlButton(b, "-30s", (function() {
          return r.seekRelative(-30);
        }));
        this.addTimeControlButton(b, "-1m", (function() {
          return r.seekRelative(-60);
        }));
        this.addTimeControlButton(b, "-5m", (function() {
          return r.seekRelative(-300);
        }));
        this.addTimeControlButton(b, "-10m", (function() {
          return r.seekRelative(-600);
        }));
        this.addTimeControlButton(k, "+5s", (function() {
          return r.seekRelative(5);
        }));
        this.addTimeControlButton(k, "+10s", (function() {
          return r.seekRelative(10);
        }));
        this.addTimeControlButton(k, "+30s", (function() {
          return r.seekRelative(30);
        }));
        this.addTimeControlButton(k, "+1m", (function() {
          return r.seekRelative(60);
        }));
        this.addTimeControlButton(k, "+5m", (function() {
          return r.seekRelative(300);
        }));
        this.addTimeControlButton(k, "+10m", (function() {
          return r.seekRelative(600);
        }));
        this.currentPositionDisplay = document.createElement("span");
        this.currentPositionDisplay.className = "tm-loop-start-position";
        this.currentPositionDisplay.textContent = "00:00:00";
        this.setLoopStartButton = document.createElement("span");
        this.setLoopStartButton.className = "tm-set-loop-start-label";
        this.setLoopStartButton.innerHTML = "A";
        this.durationDisplay = document.createElement("span");
        this.durationDisplay.className = "tm-loop-end-position";
        this.durationDisplay.textContent = "00:00:00";
        this.setLoopEndButton = document.createElement("span");
        this.setLoopEndButton.className = "tm-set-loop-end-label";
        this.setLoopEndButton.innerHTML = "B";
        var C = document.createElement("div");
        C.className = "tm-start-time-container";
        var _ = document.createElement("div");
        _.className = "tm-end-time-container";
        C.addEventListener("click", (function() {
          if (r.loopManager) {
            r.loopManager.setLoopStart();
          }
        }));
        C.addEventListener("mouseover", (function() {
          return;
        }));
        C.addEventListener("mouseout", (function() {
          return;
        }));
        _.addEventListener("click", (function() {
          if (r.loopManager) {
            r.loopManager.setLoopEnd();
          }
        }));
        _.addEventListener("mouseover", (function() {
          return;
        }));
        _.addEventListener("mouseout", (function() {
          return;
        }));
        C.appendChild(this.setLoopStartButton);
        C.appendChild(this.currentPositionDisplay);
        _.appendChild(this.setLoopEndButton);
        _.appendChild(this.durationDisplay);
        var P = document.createElement("div");
        P.className = "tm-loop-toggle-button";
        P.innerHTML = '\n            <span class="tm-loop-toggle-label">Loop</span>\n            <svg width="12" height="12" style="vertical-align: middle;">\n                <circle class="tm-loop-indicator-circle" cx="6" cy="6" r="5" fill="hsl(var(--shadcn-muted-foreground) / 0.5)"></circle>\n            </svg>\n        ';
        p.appendChild(P);
        var S = P;
        S.addEventListener("mouseover", (function() {
          return;
        }));
        S.addEventListener("mouseout", (function() {
          return;
        }));
        S.addEventListener("click", (function() {
          if (r.loopManager) {
            r.loopManager.toggleLoop();
          }
        }));
        this.loopToggleButton = S;
        u.appendChild(C);
        u.appendChild(_);
        l.appendChild(u);
        l.appendChild(p);
        this.controlButtonsContainer.appendChild(a);
        this.controlButtonsContainer.appendChild(l);
        var M = document.createElement("div");
        M.className = "tm-playback-control-row";
        var E = document.createElement("div");
        E.className = "tm-left-controls";
        E.style.display = "flex";
        E.style.alignItems = "center";
        E.style.gap = "6px";
        E.style.flex = "1";
        this.createVolumeSlider(E);
        var L = document.createElement("div");
        L.className = "tm-center-controls";
        L.style.display = "flex";
        L.style.alignItems = "center";
        L.style.justifyContent = "center";
        L.style.flex = "1";
        var T = document.createElement("div");
        T.className = "tm-right-controls";
        T.style.display = "flex";
        T.style.alignItems = "center";
        T.style.justifyContent = "flex-end";
        T.style.flex = "1";
        T.style.gap = "6px";
        M.appendChild(E);
        M.appendChild(L);
        M.appendChild(T);
        this.playPauseButton = this.addControlButton(L, "", (function() {
          if (r.targetVideo.paused) {
            r.targetVideo.play();
            r.updatePlayPauseButton();
          } else {
            r.targetVideo.pause();
            r.updatePlayPauseButton();
          }
        }));
        this.createPlaybackRateSlider(T);
        this.controlButtonsContainer.appendChild(M);
        this.updatePlayPauseButton();
        this.updateMuteButton();
        return this.controlButtonsContainer;
      }
    }, {
      "key": "createPlaybackRateSlider",
      "value": function createPlaybackRateSlider(r) {
        var o = this;
        var a = document.createElement("div");
        a.className = "tm-playback-rate-slider";
        var l = .1;
        var u = 3;
        var p = .1;
        var v = false;
        var y = 30;
        var b = 1;
        var k = null;
        var C = document.createElement("div");
        C.className = "tm-slider-container";
        var _ = document.createElement("div");
        _.className = "tm-slider-level";
        var P = document.createElement("div");
        P.className = "tm-slider-marks";
        var S = [ {
          "pos": Math.round((.5 - l) / (u - l) * 100),
          "label": "0.5x"
        }, {
          "pos": Math.round((1 - l) / (u - l) * 100),
          "label": "1.0x"
        }, {
          "pos": Math.round((1.5 - l) / (u - l) * 100),
          "label": "1.5x"
        }, {
          "pos": Math.round((2 - l) / (u - l) * 100),
          "label": "2.0x"
        }, {
          "pos": Math.round((3 - l) / (u - l) * 100),
          "label": "3.0x"
        } ];
        S.forEach((function(r) {
          var o = r.pos, a = r.label;
          var l = document.createElement("div");
          l.className = "tm-slider-mark";
          l.style.left = "".concat(o, "%");
          P.appendChild(l);
        }));
        var M = document.createElement("div");
        M.className = "tm-slider-text";
        var E = document.createElement("div");
        E.className = "tm-speed-label";
        E.textContent = "Speed";
        var L = document.createElement("div");
        L.className = "tm-speed-value";
        L.textContent = "1.0x";
        M.appendChild(E);
        M.appendChild(L);
        C.appendChild(P);
        C.appendChild(_);
        C.appendChild(M);
        a.appendChild(C);
        r.appendChild(a);
        var T = function updateSlider(r) {
          _.style.width = "".concat(r, "%");
          var a;
          var v = l + r / 100 * (u - l);
          v = Math.round(v / p) * p;
          if ((v = Math.max(l, Math.min(u, v))) !== b) {
            b = v;
            o.targetVideo.playbackRate = v;
            L.textContent = "".concat(v.toFixed(1), "x");
            L.classList.remove("tm-speed-value-fast", "tm-speed-value-slow", "tm-speed-value-normal");
            if (v > 1.5) {
              L.classList.add("tm-speed-value-fast");
            } else if (v < .8) {
              L.classList.add("tm-speed-value-slow");
            } else {
              L.classList.add("tm-speed-value-normal");
            }
          }
        };
        var V = function drag(r) {
          if (!v) {
            return;
          }
          D(r);
        };
        var B = function startDrag(r) {
          v = true;
          a.classList.add("dragging");
          a.classList.add("tm-playback-slider-dragging");
          D(r);
        };
        var I = function endDrag() {
          if (!v) {
            return;
          }
          v = false;
          a.classList.remove("dragging");
          a.classList.remove("tm-playback-slider-dragging");
          a.classList.add("tm-playback-slider-default");
          if (k) {
            cancelAnimationFrame(k);
            k = null;
          }
        };
        var D = function handleDragEvent(r) {
          r.preventDefault();
          var o = r.type.includes("touch") ? r.touches[0].clientX : r.clientX;
          var a = C.getBoundingClientRect();
          var l = a.width;
          if (k) {
            cancelAnimationFrame(k);
          }
          k = requestAnimationFrame((function() {
            var r = (o - a.left) / l * 100;
            r = Math.max(0, Math.min(100, r));
            var u;
            var p = 5;
            var v = _createForOfIteratorHelper(S.map((function(r) {
              return r.pos;
            }))), b;
            try {
              for (v.s(); !(b = v.n()).done; ) {
                var k = b.value;
                if (Math.abs(r - k) < p) {
                  r = k;
                  if (window.navigator.vibrate) {
                    window.navigator.vibrate(5);
                  }
                  break;
                }
              }
            } catch (r) {
              v.e(r);
            } finally {
              v.f();
            }
            y = r;
            T(r);
          }));
        };
        C.addEventListener("mousedown", B, {
          "passive": false
        });
        C.addEventListener("touchstart", B, {
          "passive": false
        });
        window.addEventListener("mousemove", V, {
          "passive": false
        });
        window.addEventListener("touchmove", V, {
          "passive": false
        });
        window.addEventListener("mouseup", I);
        window.addEventListener("touchend", I);
        window.addEventListener("mouseleave", I);
        a.addEventListener("dblclick", (function() {
          y = 30;
          T(30);
        }));
        T(30);
        this.playbackRateSlider = a;
        this.updatePlaybackRateSlider = T;
      }
    }, {
      "key": "createVolumeSlider",
      "value": function createVolumeSlider(r) {
        var o = this;
        var a = document.createElement("div");
        a.className = "tm-volume-control";
        var l = document.createElement("button");
        l.className = "tm-volume-button";
        l.innerHTML = this.getVolumeIcon(this.targetVideo.volume);
        var u = document.createElement("div");
        u.className = "tm-volume-slider-container";
        var p = document.createElement("div");
        p.className = "tm-volume-slider-track";
        this.volumeLevel = document.createElement("div");
        this.volumeLevel.className = "tm-volume-slider-level";
        this.volumeLevel.style.width = "".concat(100 * this.targetVideo.volume, "%");
        this.volumeValue = document.createElement("div");
        this.volumeValue.className = "tm-volume-value";
        this.volumeValue.textContent = "".concat(Math.round(100 * this.targetVideo.volume), "%");
        p.appendChild(this.volumeLevel);
        u.appendChild(p);
        u.appendChild(this.volumeValue);
        a.appendChild(l);
        if (this.supportsVolumeControl) {
          a.appendChild(u);
        } else {
          a.classList.add("tm-volume-control-no-slider");
        }
        this.volumeSlider = a;
        var v = false;
        var y = false;
        var b = null;
        var k = function updateVolume(r) {
          if (!o.supportsVolumeControl) {
            return;
          }
          var a = p.getBoundingClientRect();
          var l = a.width;
          var u = (r - a.left) / l * 100;
          u = Math.max(0, Math.min(100, u));
          o.targetVideo.volume = u / 100;
          o.targetVideo.muted = false;
          o.updateVolumeUI();
        };
        var C = function expandSlider() {
          if (!o.supportsVolumeControl) {
            return;
          }
          if (b) {
            clearTimeout(b);
          }
          a.classList.add("expanded");
          y = true;
        };
        var _ = function collapseSlider() {
          if (!o.supportsVolumeControl) {
            return;
          }
          if (!v) {
            a.classList.remove("expanded");
            y = false;
          }
        };
        l.addEventListener("click", (function(r) {
          r.stopPropagation();
          if (o.supportsVolumeControl && !y) {
            C();
            b = setTimeout(_, 3e3);
          } else {
            if (0 === o.targetVideo.volume || o.targetVideo.muted) {
              o.targetVideo.muted = false;
              if (o.supportsVolumeControl) {
                o.targetVideo.volume = o.lastVolume;
              }
            } else if (o.supportsVolumeControl) {
              o.lastVolume = o.targetVideo.volume;
              o.targetVideo.volume = 0;
            } else {
              o.targetVideo.muted = true;
            }
            o.updateVolumeUI();
          }
        }));
        if (this.supportsVolumeControl) {
          p.addEventListener("click", (function(r) {
            r.stopPropagation();
            k(r.clientX);
          }));
          p.addEventListener("touchstart", (function(r) {
            r.stopPropagation();
            v = true;
            a.classList.add("dragging");
            C();
            k(r.touches[0].clientX);
          }), {
            "passive": false
          });
          p.addEventListener("touchmove", (function(r) {
            if (!v) {
              return;
            }
            r.preventDefault();
            k(r.touches[0].clientX);
          }), {
            "passive": false
          });
          p.addEventListener("touchend", (function() {
            v = false;
            a.classList.remove("dragging");
            setTimeout(_, 1500);
          }));
          p.addEventListener("mousedown", (function(r) {
            r.stopPropagation();
            v = true;
            a.classList.add("dragging");
            C();
            k(r.clientX);
          }));
          document.addEventListener("mousemove", (function(r) {
            if (!v) {
              return;
            }
            r.preventDefault();
            k(r.clientX);
          }));
          document.addEventListener("mouseup", (function() {
            if (v) {
              v = false;
              a.classList.remove("dragging");
              setTimeout(_, 1500);
            }
          }));
        }
        r.appendChild(a);
      }
    }, {
      "key": "getVolumeIcon",
      "value": function getVolumeIcon(r) {
        if (this.targetVideo.muted || 0 === r) {
          return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M23 9L17 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M17 9L23 15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n            </svg>';
        } else if (this.supportsVolumeControl && r < .5) {
          return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n            </svg>';
        } else {
          return '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M15.54 8.46C16.4774 9.39764 17.0039 10.6692 17.0039 12C17.0039 13.3308 16.4774 14.6024 15.54 15.54" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n                <path d="M19.07 4.93C20.9447 6.80527 21.9979 9.34855 21.9979 12C21.9979 14.6515 20.9447 17.1947 19.07 19.07" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n            </svg>';
        }
      }
    }, {
      "key": "updateVolumeUI",
      "value": function updateVolumeUI() {
        if (!this.volumeSlider) {
          return;
        }
        var r;
        if (this.supportsVolumeControl) {
          r = this.targetVideo.muted ? 0 : this.targetVideo.volume;
        } else {
          r = this.targetVideo.muted ? 0 : 1;
        }
        var o = this.volumeSlider.querySelector(".tm-volume-button");
        if (o) {
          o.innerHTML = this.getVolumeIcon(r);
        }
        if (!this.supportsVolumeControl) {
          return;
        }
        if (this.volumeLevel) {
          var a = Math.max(0, Math.min(100, 100 * r));
          this.volumeLevel.style.width = "calc(".concat(a, "% - 2px)");
        }
        if (this.volumeValue) {
          var l = Math.round(100 * r);
          this.volumeValue.textContent = "".concat(l, "%");
          this.volumeValue.classList.remove("volume-high", "volume-medium", "volume-low", "volume-muted");
          if (0 === r || this.targetVideo.muted) {
            this.volumeValue.classList.add("volume-muted");
          } else if (r < .3) {
            this.volumeValue.classList.add("volume-low");
          } else if (r < .7) {
            this.volumeValue.classList.add("volume-medium");
          } else {
            this.volumeValue.classList.add("volume-high");
          }
        }
      }
    }, {
      "key": "updatePlayPauseButton",
      "value": function updatePlayPauseButton() {
        if (!this.playPauseButton) {
          return;
        }
        if (this.targetVideo.paused) {
          this.playPauseButton.innerHTML = '\n                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M18 12L7 5V19L18 12Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                </svg>\n            ';
        } else {
          this.playPauseButton.innerHTML = '\n                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M10 4H6V20H10V4Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                    <path d="M18 4H14V20H18V4Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                </svg>\n            ';
        }
      }
    }, {
      "key": "updateMuteButton",
      "value": function updateMuteButton() {
        if (!this.muteButton) {
          return;
        }
        if (this.targetVideo.muted) {
          this.muteButton.innerHTML = '\n                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                    <path d="M23 9L17 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                    <path d="M17 9L23 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                </svg>\n            ';
        } else {
          this.muteButton.innerHTML = '\n                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">\n                    <path d="M11 5L6 9H2V15H6L11 19V5Z" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                    <path d="M15.54 8.46C16.4774 9.39764 17.004 10.6692 17.004 11.995C17.004 13.3208 16.4774 14.5924 15.54 15.53" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                    <path d="M18.54 5.46C20.4246 7.34535 21.4681 9.90302 21.4681 12.575C21.4681 15.247 20.4246 17.8047 18.54 19.69" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>\n                </svg>\n            ';
        }
      }
    }, {
      "key": "updateProgressBar",
      "value": function updateProgressBar() {
        if (!this.targetVideo || !this.progressBarElement || !this.progressIndicator) {
          return;
        }
        var r = this.targetVideo.currentTime;
        var o = this.targetVideo.duration;
        if (isNaN(o) || o <= 0) {
          return;
        }
        var a = r / o * 100;
        this.progressIndicator.style.width = "".concat(a, "%");
        this.updateCurrentTimeDisplay();
        if (this.loopManager && this.loopManager.loopActive && null !== this.loopManager.loopStartTime && null !== this.loopManager.loopEndTime) {
          if (r >= this.loopManager.loopEndTime) {
            this.targetVideo.currentTime = this.loopManager.loopStartTime;
          }
        }
      }
    }, {
      "key": "updateCurrentTimeDisplay",
      "value": function updateCurrentTimeDisplay() {
        if (!this.targetVideo || !this.currentTimeDisplay || !this.totalDurationDisplay) {
          return;
        }
        var r = this.targetVideo.currentTime;
        var o = this.targetVideo.duration;
        if (isNaN(o)) {
          return;
        }
        this.currentTimeDisplay.textContent = this.formatTime(r);
        var a = o - r;
        this.totalDurationDisplay.textContent = "-".concat(this.formatTime(a));
      }
    }, {
      "key": "addTimeControlButton",
      "value": function addTimeControlButton(r, o, a) {
        var l = function calculateOpacity(r) {
          var o = parseInt(r.replace(/[+-]/g, ""));
          var a = r.includes("m") ? "m" : "s";
          var l = .5;
          if ("s" === a) {
            if (o <= 5) {
              l = .5;
            } else if (o <= 10) {
              l = .6;
            } else {
              l = .7;
            }
          } else if ("m" === a) {
            if (1 === o) {
              l = .8;
            } else if (5 === o) {
              l = .9;
            } else {
              l = 1;
            }
          }
          return l;
        };
        var u = l(o);
        var p = document.createElement("button");
        p.className = "tm-time-control-button";
        p.style.backgroundColor = "hsl(var(--shadcn-secondary) / ".concat(u, ")");
        var v = o.includes("-");
        var y = o.includes("+");
        var b = o.replace(/[+-]/g, "");
        var k = '<svg width="14" height="14" viewBox="0 0 12 24" fill="none" class="tm-rewind-icon">\n            <path fill-rule="evenodd" clip-rule="evenodd" d="M3.70711 4.29289C3.31658 3.90237 2.68342 3.90237 2.29289 4.29289L-4.70711 11.2929C-5.09763 11.6834 -5.09763 12.3166 -4.70711 12.7071L2.29289 19.7071C2.68342 20.0976 3.31658 20.0976 3.70711 19.7071C4.09763 19.3166 4.09763 18.6834 3.70711 18.2929L-2.58579 12L3.70711 5.70711C4.09763 5.31658 4.09763 4.68342 3.70711 4.29289Z" fill="currentColor"/>\n        </svg>';
        var C = '<svg width="14" height="14" viewBox="0 0 12 24" fill="none" class="tm-forward-icon">\n            <path fill-rule="evenodd" clip-rule="evenodd" d="M8.29289 4.29289C8.68342 3.90237 9.31658 3.90237 9.70711 4.29289L16.7071 11.2929C17.0976 11.6834 17.0976 12.3166 16.7071 12.7071L9.70711 19.7071C9.31658 20.0976 8.68342 20.0976 8.29289 19.7071C7.90237 19.3166 7.90237 18.6834 8.29289 18.2929L14.5858 12L8.29289 5.70711C7.90237 5.31658 7.90237 4.68342 8.29289 4.29289Z" fill="currentColor"/>\n        </svg>';
        if (v) {
          p.innerHTML = '<div class="tm-time-control-button-inner">'.concat(k, '<span class="tm-time-text-margin-left">').concat(b, "</span></div>");
        } else if (y) {
          p.innerHTML = '<div class="tm-time-control-button-inner"><span class="tm-time-text-margin-right">'.concat(b, "</span>").concat(C, "</div>");
        } else {
          p.textContent = o;
        }
        p.addEventListener("click", a);
        p.addEventListener("mouseover", (function() {
          p.classList.add("tm-time-control-button-hover");
          p.classList.remove("tm-time-control-button-default");
        }));
        p.addEventListener("mouseout", (function() {
          p.classList.add("tm-time-control-button-default");
          p.classList.remove("tm-time-control-button-hover", "tm-time-control-button-active", "tm-time-control-button-after-active");
        }));
        p.addEventListener("mousedown", (function() {
          p.classList.add("tm-time-control-button-active");
          p.classList.remove("tm-time-control-button-hover", "tm-time-control-button-default", "tm-time-control-button-after-active");
        }));
        p.addEventListener("mouseup", (function() {
          p.classList.add("tm-time-control-button-after-active");
          p.classList.remove("tm-time-control-button-active", "tm-time-control-button-hover", "tm-time-control-button-default");
        }));
        r.appendChild(p);
        return p;
      }
    }, {
      "key": "seekRelative",
      "value": function seekRelative(r) {
        if (!this.targetVideo) {
          return;
        }
        var o = Math.max(0, Math.min(this.targetVideo.duration, this.targetVideo.currentTime + r));
        this.targetVideo.currentTime = o;
      }
    }, {
      "key": "formatTime",
      "value": function formatTime(r) {
        var o = Math.floor(r / 3600);
        var a = Math.floor(r % 3600 / 60);
        var l = Math.floor(r % 60);
        return "".concat(o, ":").concat(a.toString().padStart(2, "0"), ":").concat(l.toString().padStart(2, "0"));
      }
    }, {
      "key": "addControlButton",
      "value": function addControlButton(r, o, a) {
        var l = document.createElement("button");
        l.className = "tm-control-button";
        l.textContent = o;
        l.addEventListener("click", a);
        l.addEventListener("mouseover", (function() {
          l.classList.add("tm-control-button-hover");
          l.classList.remove("tm-control-button-default");
        }));
        l.addEventListener("mouseout", (function() {
          l.classList.add("tm-control-button-default");
          l.classList.remove("tm-control-button-hover");
        }));
        r.appendChild(l);
        return l;
      }
    }, {
      "key": "showPauseIndicator",
      "value": function showPauseIndicator() {
        var r = this;
        if (this.pauseIndicator) {
          if (this.pauseIndicator.parentNode) {
            this.pauseIndicator.parentNode.removeChild(this.pauseIndicator);
          }
          this.pauseIndicator = null;
        }
        this.pauseIndicator = document.createElement("div");
        this.pauseIndicator.className = "tm-indicator-base tm-pause-indicator";
        this.pauseIndicator.style.position = "absolute";
        this.pauseIndicator.style.top = "50%";
        this.pauseIndicator.style.left = "50%";
        this.pauseIndicator.style.transform = "translate(-50%, -50%)";
        this.pauseIndicator.style.display = "flex";
        this.pauseIndicator.style.justifyContent = "center";
        this.pauseIndicator.style.alignItems = "center";
        this.pauseIndicator.innerHTML = '\n            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">\n                <path d="M14,6v20c0,1.1-0.9,2-2,2H8c-1.1,0-2-0.9-2-2V6c0-1.1,0.9-2,2-2h4C13.1,4,14,4.9,14,6z M24,4h-4\n                c-1.1,0-2,0.9-2,2v20c0,1.1,0.9,2,2,2h4c1.1,0,2-0.9,2-2V6C26,4.9,25.1,4,24,4z" fill="white"/>\n            </svg>\n        ';
        this.uiElements.videoWrapper.appendChild(this.pauseIndicator);
        requestAnimationFrame((function() {
          r.pauseIndicator.classList.add("visible");
        }));
        setTimeout((function() {
          if (r.pauseIndicator) {
            r.pauseIndicator.classList.remove("visible");
            setTimeout((function() {
              if (r.pauseIndicator && r.pauseIndicator.parentNode) {
                r.pauseIndicator.parentNode.removeChild(r.pauseIndicator);
                r.pauseIndicator = null;
              }
            }), 300);
          }
        }), 1e3);
      }
    }, {
      "key": "showPlaybackRateIndicator",
      "value": function showPlaybackRateIndicator(r) {
        var o = this;
        if (this.playbackRateIndicator) {
          clearTimeout(this.playbackRateIndicator.hideTimeout);
          if (this.playbackRateIndicator.parentNode) {
            this.playbackRateIndicator.parentNode.removeChild(this.playbackRateIndicator);
          }
          this.playbackRateIndicator = null;
        }
        this.playbackRateIndicator = document.createElement("div");
        this.playbackRateIndicator.className = "tm-indicator-base tm-playback-rate-indicator";
        this.playbackRateIndicator.style.position = "absolute";
        this.playbackRateIndicator.style.top = "20%";
        this.playbackRateIndicator.style.left = "50%";
        this.playbackRateIndicator.style.transform = "translateX(-50%)";
        this.playbackRateIndicator.textContent = "".concat(r.toFixed(1), "x");
        if (r > 1.5) {
          this.playbackRateIndicator.style.color = "hsl(var(--shadcn-orange))";
        } else if (r < .8) {
          this.playbackRateIndicator.style.color = "hsl(var(--shadcn-blue))";
        }
        this.uiElements.videoWrapper.appendChild(this.playbackRateIndicator);
        requestAnimationFrame((function() {
          o.playbackRateIndicator.classList.add("visible");
        }));
        this.playbackRateIndicator.hideTimeout = setTimeout((function() {
          if (o.playbackRateIndicator) {
            o.playbackRateIndicator.classList.remove("visible");
            setTimeout((function() {
              if (o.playbackRateIndicator && o.playbackRateIndicator.parentNode) {
                o.playbackRateIndicator.parentNode.removeChild(o.playbackRateIndicator);
                o.playbackRateIndicator = null;
              }
            }), 300);
          }
        }), 1500);
      }
    } ]);
  }();
  function DragManager_typeof(r) {
    return DragManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, DragManager_typeof(r);
  }
  function DragManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function DragManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, DragManager_toPropertyKey(l.key), l);
    }
  }
  function DragManager_createClass(r, o, a) {
    return o && DragManager_defineProperties(r.prototype, o), a && DragManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function DragManager_toPropertyKey(r) {
    var o = DragManager_toPrimitive(r, "string");
    return "symbol" == DragManager_typeof(o) ? o : o + "";
  }
  function DragManager_toPrimitive(r, o) {
    if ("object" != DragManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != DragManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var _ = function() {
    function DragManager(r, o) {
      DragManager_classCallCheck(this, DragManager);
      this.playerCore = r;
      this.targetVideo = r.targetVideo;
      this.uiElements = o;
      this.container = o.container;
      this.handle = o.handle;
      this.isDraggingHandle = false;
      this.startX = 0;
      this.startY = 0;
      this.startWidth = 0;
      this.startHeight = 0;
      this.handleMoveHandler = null;
      this.handleEndHandler = null;
    }
    return DragManager_createClass(DragManager, [ {
      "key": "init",
      "value": function init() {
        this.handle.addEventListener("mousedown", this.startHandleDrag.bind(this));
        this.handle.addEventListener("touchstart", this.startHandleDrag.bind(this), {
          "passive": false
        });
        return this;
      }
    }, {
      "key": "updateHandlePosition",
      "value": function updateHandlePosition() {
        if (!this.uiElements.handleContainer || !this.container) {
          return;
        }
        var r = this.container.getBoundingClientRect();
        var o = this.uiElements.videoWrapper.getBoundingClientRect();
        this.uiElements.handleContainer.style.top = "".concat(o.bottom, "px");
      }
    }, {
      "key": "startHandleDrag",
      "value": function startHandleDrag(r) {
        this.isDraggingHandle = true;
        this.handle.style.cursor = "grabbing";
        var o = r.type.includes("touch");
        this.startY = o ? r.touches[0].clientY : r.clientY;
        this.startHeight = this.container.offsetHeight;
        var a = this._handleDragMove.bind(this);
        var l = this._handleDragEnd.bind(this);
        if (o) {
          document.addEventListener("touchmove", a, {
            "passive": false
          });
          document.addEventListener("touchend", l);
          document.addEventListener("touchcancel", l);
        } else {
          document.addEventListener("mousemove", a);
          document.addEventListener("mouseup", l);
        }
        this.handleMoveHandler = a;
        this.handleEndHandler = l;
        r.preventDefault();
      }
    }, {
      "key": "_handleDragMove",
      "value": function _handleDragMove(r) {
        if (!this.isDraggingHandle) {
          return;
        }
        r.preventDefault();
        var o;
        var a;
        var l = (r.type.includes("touch") ? r.touches[0].clientY : r.clientY) - this.startY;
        var u = parseFloat(this.container.style.minHeight) || window.innerWidth * (9 / 16);
        var p = Math.max(u, this.startHeight + l);
        this.container.style.height = p + "px";
      }
    }, {
      "key": "_handleDragEnd",
      "value": function _handleDragEnd(r) {
        if (!this.isDraggingHandle) {
          return;
        }
        this.isDraggingHandle = false;
        this.handle.style.cursor = "grab";
        document.removeEventListener("touchmove", this.handleMoveHandler);
        document.removeEventListener("touchend", this.handleEndHandler);
        document.removeEventListener("touchcancel", this.handleEndHandler);
        document.removeEventListener("mousemove", this.handleMoveHandler);
        document.removeEventListener("mouseup", this.handleEndHandler);
        this.handleMoveHandler = null;
        this.handleEndHandler = null;
        if (r.type.startsWith("touch")) {
          r.preventDefault();
        }
      }
    }, {
      "key": "handleMouseDown",
      "value": function handleMouseDown(r) {
        if (0 !== r.button) {
          return;
        }
        this.isDraggingHandle = true;
        this.startY = r.clientY;
        this.startHeight = this.uiElements.handleContainer.offsetHeight;
        this.handleMoveHandler = this.handleMouseMove.bind(this);
        this.handleEndHandler = this.handleMouseUp.bind(this);
        document.addEventListener("mousemove", this.handleMoveHandler);
        document.addEventListener("mouseup", this.handleEndHandler);
        this.updateHandlePosition();
      }
    }, {
      "key": "handleMouseMove",
      "value": function handleMouseMove(r) {
        if (!this.isDraggingHandle) {
          return;
        }
        var o = r.clientY - this.startY;
        var a = this.startHeight + o;
        if (a < 50 || a > 200) {
          return;
        }
        this.uiElements.handleContainer.style.height = "".concat(a, "px");
        this.updateHandlePosition();
      }
    }, {
      "key": "handleMouseUp",
      "value": function handleMouseUp(r) {
        this.isDraggingHandle = false;
        document.removeEventListener("mousemove", this.handleMoveHandler);
        document.removeEventListener("mouseup", this.handleEndHandler);
        this.updateHandlePosition();
      }
    }, {
      "key": "handleMouseLeave",
      "value": function handleMouseLeave(r) {
        this.isDraggingHandle = false;
        document.removeEventListener("mousemove", this.handleMoveHandler);
        document.removeEventListener("mouseup", this.handleEndHandler);
        this.updateHandlePosition();
      }
    } ]);
  }();
  function LoopManager_typeof(r) {
    return LoopManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, LoopManager_typeof(r);
  }
  function _slicedToArray(r, o) {
    return _arrayWithHoles(r) || _iterableToArrayLimit(r, o) || LoopManager_unsupportedIterableToArray(r, o) || _nonIterableRest();
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function LoopManager_unsupportedIterableToArray(r, o) {
    if (r) {
      if ("string" == typeof r) {
        return LoopManager_arrayLikeToArray(r, o);
      }
      var a = {}.toString.call(r).slice(8, -1);
      return "Object" === a && r.constructor && (a = r.constructor.name), "Map" === a || "Set" === a ? Array.from(r) : "Arguments" === a || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a) ? LoopManager_arrayLikeToArray(r, o) : void 0;
    }
  }
  function LoopManager_arrayLikeToArray(r, o) {
    (null == o || o > r.length) && (o = r.length);
    for (var a = 0, l = Array(o); a < o; a++) {
      l[a] = r[a];
    }
    return l;
  }
  function _iterableToArrayLimit(r, o) {
    var a = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != a) {
      var l, u, p, v, y = [], b = !0, k = !1;
      try {
        if (p = (a = a.call(r)).next, 0 === o) {
          if (Object(a) !== a) {
            return;
          }
          b = !1;
        } else {
          for (;!(b = (l = p.call(a)).done) && (y.push(l.value), y.length !== o); b = !0) {}
        }
      } catch (r) {
        k = !0, u = r;
      } finally {
        try {
          if (!b && null != a["return"] && (v = a["return"](), Object(v) !== v)) {
            return;
          }
        } finally {
          if (k) {
            throw u;
          }
        }
      }
      return y;
    }
  }
  function _arrayWithHoles(r) {
    if (Array.isArray(r)) {
      return r;
    }
  }
  function LoopManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function LoopManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, LoopManager_toPropertyKey(l.key), l);
    }
  }
  function LoopManager_createClass(r, o, a) {
    return o && LoopManager_defineProperties(r.prototype, o), a && LoopManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function LoopManager_toPropertyKey(r) {
    var o = LoopManager_toPrimitive(r, "string");
    return "symbol" == LoopManager_typeof(o) ? o : o + "";
  }
  function LoopManager_toPrimitive(r, o) {
    if ("object" != LoopManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != LoopManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var P = function() {
    function LoopManager(r, o) {
      LoopManager_classCallCheck(this, LoopManager);
      this.playerCore = r;
      this.targetVideo = r.targetVideo;
      this.uiElements = o;
      this.loopStartTime = null;
      this.loopEndTime = null;
      this.loopActive = false;
      this.loopStartMarker = null;
      this.loopEndMarker = null;
      this.loopRangeElement = null;
      this.currentPositionDisplay = null;
      this.durationDisplay = null;
      this.loopToggleButton = null;
      this._handleLoopTimeUpdate = this._handleLoopTimeUpdate.bind(this);
    }
    return LoopManager_createClass(LoopManager, [ {
      "key": "init",
      "value": function init(r) {
        this.loopStartMarker = r.loopStartMarker;
        this.loopEndMarker = r.loopEndMarker;
        this.loopRangeElement = r.loopRangeElement;
        this.currentPositionDisplay = r.currentPositionDisplay;
        this.durationDisplay = r.durationDisplay;
        this.loopToggleButton = r.loopToggleButton;
        this._parseUrlHashParams();
        return this;
      }
    }, {
      "key": "setState",
      "value": function setState(r) {
        Object.assign(this, r);
        this._updateUI();
        return this;
      }
    }, {
      "key": "_parseUrlHashParams",
      "value": function _parseUrlHashParams() {
        var r = this;
        if (!window.location.hash) {
          return;
        }
        var o = window.location.hash.substring(1);
        if (o.includes("-")) {
          var a, l = _slicedToArray(o.split("-"), 2), u = l[0], p = l[1];
          var v = this._parseTimeString(u);
          var y = this._parseTimeString(p);
          if (null !== v && null !== y) {
            var b = {
              "loopStartTime": v,
              "loopEndTime": y
            };
            var k = function handleMetadata() {
              if (r.currentPositionDisplay) {
                r.currentPositionDisplay.textContent = r.formatTimeWithHours(v);
                r.currentPositionDisplay.classList.add("active");
                var o = document.querySelector(".tm-start-time-container");
                if (o) {
                  o.classList.add("active");
                }
              }
              if (r.durationDisplay) {
                r.durationDisplay.textContent = r.formatTimeWithHours(y);
                r.durationDisplay.classList.add("active");
                var a = document.querySelector(".tm-end-time-container");
                if (a) {
                  a.classList.add("active");
                }
              }
              r.targetVideo.currentTime = v;
              if (window.location.hostname.includes("missav")) {
                b.loopActive = true;
              } else {
                b.loopActive = true;
              }
              r.setState(b);
              r.updateLoopMarkers();
              r.targetVideo.removeEventListener("timeupdate", r._handleLoopTimeUpdate);
              r.targetVideo.addEventListener("timeupdate", r._handleLoopTimeUpdate);
              if (r.targetVideo.paused) {
                r.targetVideo.play()["catch"]((function(r) {}));
              }
              r.targetVideo.removeEventListener("loadedmetadata", k);
            };
            if (this.targetVideo.readyState >= 1) {
              k();
            } else {
              this.targetVideo.addEventListener("loadedmetadata", k);
            }
          }
        } else if (o.match(/^\d{2}:\d{2}:\d{2}$/)) {
          var C = this._parseTimeString(o);
          if (null !== C) {
            var _ = function handleMetadata() {
              if (r.currentPositionDisplay) {
                r.currentPositionDisplay.textContent = r.formatTimeWithHours(C);
                r.currentPositionDisplay.classList.add("active");
                var o = document.querySelector(".tm-start-time-container");
                if (o) {
                  o.classList.add("active");
                }
              }
              r.targetVideo.currentTime = C;
              r.setState({
                "loopStartTime": C
              });
              r.updateLoopMarkers();
              r.targetVideo.removeEventListener("loadedmetadata", _);
            };
            if (this.targetVideo.readyState >= 1) {
              _();
            } else {
              this.targetVideo.addEventListener("loadedmetadata", _);
            }
          }
        }
      }
    }, {
      "key": "_parseTimeString",
      "value": function _parseTimeString(r) {
        if (!r) {
          return null;
        }
        var o = r.match(/^(\d{2}):(\d{2}):(\d{2})$/);
        if (!o) {
          return null;
        }
        var a;
        var l;
        var u;
        return 3600 * parseInt(o[1], 10) + 60 * parseInt(o[2], 10) + parseInt(o[3], 10);
      }
    }, {
      "key": "_updateUrlHash",
      "value": function _updateUrlHash() {
        var r = "";
        if (null !== this.loopStartTime) {
          r = this.formatTimeWithHours(this.loopStartTime);
          if (null !== this.loopEndTime) {
            r += "-".concat(this.formatTimeWithHours(this.loopEndTime));
          }
        }
        if (r) {
          var o = window.location.pathname + window.location.search + "#" + r;
          window.history.replaceState(null, "", o);
        }
      }
    }, {
      "key": "_clickCopyStartTime",
      "value": function _clickCopyStartTime() {
        var r;
        document.querySelector("input#clip-start-time + a").click();
      }
    }, {
      "key": "_clickCopyEndTime",
      "value": function _clickCopyEndTime() {
        var r;
        document.querySelector("input#clip-end-time + a").click();
      }
    }, {
      "key": "_toggleLooping",
      "value": function _toggleLooping() {
        var r;
        document.querySelector(".sm\\:ml-6 button").click();
      }
    }, {
      "key": "setLoopEnd",
      "value": function setLoopEnd() {
        if (!this.targetVideo) {
          return;
        }
        var r = this.targetVideo.currentTime;
        if (window.location.hostname.includes("missav")) {
          this._clickCopyEndTime();
          this.setState({
            "loopEndTime": r
          });
        } else {
          if (null !== this.loopStartTime && r <= this.loopStartTime) {
            return;
          }
          this.setState({
            "loopEndTime": r
          });
          this._updateUrlHash();
        }
        if (window.navigator.vibrate) {
          window.navigator.vibrate(10);
        }
      }
    }, {
      "key": "setLoopStart",
      "value": function setLoopStart() {
        if (!this.targetVideo) {
          return;
        }
        var r = this.targetVideo.currentTime;
        if (window.location.hostname.includes("missav")) {
          this._clickCopyStartTime();
          this.setState({
            "loopStartTime": r
          });
        } else {
          if (null !== this.loopEndTime && r >= this.loopEndTime) {
            return;
          }
          this.setState({
            "loopStartTime": r
          });
          this._updateUrlHash();
        }
        if (window.navigator.vibrate) {
          window.navigator.vibrate(10);
        }
      }
    }, {
      "key": "toggleLoop",
      "value": function toggleLoop() {
        if (window.location.hostname.includes("missav")) {
          this._toggleLooping();
        } else {
          if (null === this.loopStartTime || null === this.loopEndTime) {
            return;
          }
          var r;
          if (!this.loopActive) {
            this.enableLoop();
          } else {
            this.disableLoop();
          }
        }
      }
    }, {
      "key": "enableLoop",
      "value": function enableLoop() {
        if (!this.targetVideo || null === this.loopStartTime || null === this.loopEndTime) {
          return;
        }
        this.setState({
          "loopActive": true
        });
        this.targetVideo.removeEventListener("timeupdate", this._handleLoopTimeUpdate);
        this.targetVideo.addEventListener("timeupdate", this._handleLoopTimeUpdate);
        if (this.targetVideo.currentTime < this.loopStartTime || this.targetVideo.currentTime > this.loopEndTime) {
          this.targetVideo.currentTime = this.loopStartTime;
        }
        if (this.targetVideo.paused) {
          this.targetVideo.play()["catch"]((function(r) {}));
        }
        if (window.navigator.vibrate) {
          window.navigator.vibrate([ 10, 30, 10 ]);
        }
      }
    }, {
      "key": "disableLoop",
      "value": function disableLoop() {
        if (!this.loopActive) {
          return;
        }
        this.targetVideo.removeEventListener("timeupdate", this._handleLoopTimeUpdate);
        this.setState({
          "loopActive": false
        });
      }
    }, {
      "key": "_handleLoopTimeUpdate",
      "value": function _handleLoopTimeUpdate() {
        if (!this.loopActive || null === this.loopStartTime || null === this.loopEndTime) {
          return;
        }
        var r = this.targetVideo.currentTime;
        if (r >= this.loopEndTime || r < this.loopStartTime) {
          this.targetVideo.currentTime = this.loopStartTime;
        }
      }
    }, {
      "key": "_updateUI",
      "value": function _updateUI() {
        this.updateLoopTimeDisplay();
        this.updateLoopMarkers();
        this._updateLoopButtonStyle();
      }
    }, {
      "key": "_updateLoopButtonStyle",
      "value": function _updateLoopButtonStyle() {
        if (!this.loopToggleButton) {
          return;
        }
        if (this.loopActive) {
          this.loopToggleButton.classList.add("active");
          var r = this.loopToggleButton.querySelector(".tm-loop-indicator-circle");
          if (r) {
            r.setAttribute("fill", "hsl(var(--shadcn-red))");
          }
          var o = this.loopToggleButton.querySelector(".tm-loop-toggle-label");
          if (o) {
            o.classList.add("active");
          }
        } else {
          this.loopToggleButton.classList.remove("active");
          var a = this.loopToggleButton.querySelector(".tm-loop-indicator-circle");
          if (a) {
            a.setAttribute("fill", "hsl(var(--shadcn-muted-foreground) / 0.5)");
          }
          var l = this.loopToggleButton.querySelector(".tm-loop-toggle-label");
          if (l) {
            l.classList.remove("active");
          }
        }
      }
    }, {
      "key": "_updateStartTimeContainerStyle",
      "value": function _updateStartTimeContainerStyle() {
        var r = document.querySelector(".tm-start-time-container");
        if (!r) {
          return;
        }
        if (null !== this.loopStartTime) {
          this.currentPositionDisplay.textContent = this.formatTimeWithHours(this.loopStartTime);
          this.currentPositionDisplay.classList.add("active");
          r.classList.add("active");
          var o = r.querySelector(".tm-loop-start-button");
          if (o) {
            o.classList.add("active");
          }
        } else {
          this.currentPositionDisplay.textContent = "00:00:00";
          this.currentPositionDisplay.classList.remove("active");
          r.classList.remove("active");
          var a = r.querySelector(".tm-loop-start-button");
          if (a) {
            a.classList.remove("active");
          }
        }
      }
    }, {
      "key": "_updateEndTimeContainerStyle",
      "value": function _updateEndTimeContainerStyle() {
        var r = document.querySelector(".tm-end-time-container");
        if (!r) {
          return;
        }
        if (null !== this.loopEndTime) {
          this.durationDisplay.textContent = this.formatTimeWithHours(this.loopEndTime);
          this.durationDisplay.classList.add("active");
          r.classList.add("active");
          var o = r.querySelector(".tm-loop-end-button");
          if (o) {
            o.classList.add("active");
          }
        } else {
          this.durationDisplay.textContent = "00:00:00";
          this.durationDisplay.classList.remove("active");
          r.classList.remove("active");
          var a = r.querySelector(".tm-loop-end-button");
          if (a) {
            a.classList.remove("active");
          }
        }
      }
    }, {
      "key": "updateLoopTimeDisplay",
      "value": function updateLoopTimeDisplay() {
        this._updateStartTimeContainerStyle();
        this._updateEndTimeContainerStyle();
      }
    }, {
      "key": "updateLoopMarkers",
      "value": function updateLoopMarkers() {
        var r = this;
        if (!this.targetVideo || !this.loopStartMarker || !this.loopEndMarker) {
          return;
        }
        var o = document.querySelector(".tm-progress-bar");
        if (!o) {
          return;
        }
        var a = o.offsetWidth;
        var l = this.targetVideo.duration;
        if (l <= 0 || !a) {
          return;
        }
        var u = function createMarker(o, a) {
          var u = a ? r.loopStartMarker : r.loopEndMarker;
          if (null !== o && !isNaN(o) && o >= 0 && o <= l) {
            var p = o / l * 100;
            u.style.left = "".concat(p, "%");
            u.style.display = "block";
            if (r.loopActive) {
              u.classList.add("active");
            } else {
              u.classList.remove("active");
            }
            u.setAttribute("title", a ? "循环起点: ".concat(r.formatTimeWithHours(o)) : "循环终点: ".concat(r.formatTimeWithHours(o)));
            u.setAttribute("data-time", r.formatTimeWithHours(o));
          } else {
            u.style.display = "none";
          }
        };
        u(this.loopStartTime, true);
        u(this.loopEndTime, false);
        if (this.loopActive && null !== this.loopStartTime && null !== this.loopEndTime) {
          this.loopStartMarker.classList.add("active");
          this.loopEndMarker.classList.add("active");
          if (this.loopRangeElement) {
            var p = this.loopStartTime / l * 100;
            var v;
            var y = this.loopEndTime / l * 100 - p;
            if (y > 0) {
              this.loopRangeElement.style.left = "".concat(p, "%");
              this.loopRangeElement.style.width = "".concat(y, "%");
              this.loopRangeElement.style.display = "block";
              this.loopRangeElement.classList.add("active");
            } else {
              this.loopRangeElement.style.display = "none";
            }
          }
        } else {
          this.loopStartMarker.classList.remove("active");
          this.loopEndMarker.classList.remove("active");
          if (this.loopRangeElement) {
            this.loopRangeElement.classList.remove("active");
            this.loopRangeElement.style.display = "none";
          }
        }
      }
    }, {
      "key": "formatTimeWithHours",
      "value": function formatTimeWithHours(r) {
        if (isNaN(r) || r < 0) {
          return "00:00:00";
        }
        var o = Math.floor(r);
        var a = Math.floor(o / 3600);
        var l = Math.floor(o % 3600 / 60);
        var u = o % 60;
        return "".concat(a.toString().padStart(2, "0"), ":").concat(l.toString().padStart(2, "0"), ":").concat(u.toString().padStart(2, "0"));
      }
    } ]);
  }();
  function ProgressManager_typeof(r) {
    return ProgressManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, ProgressManager_typeof(r);
  }
  function ProgressManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function ProgressManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, ProgressManager_toPropertyKey(l.key), l);
    }
  }
  function ProgressManager_createClass(r, o, a) {
    return o && ProgressManager_defineProperties(r.prototype, o), a && ProgressManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function ProgressManager_toPropertyKey(r) {
    var o = ProgressManager_toPrimitive(r, "string");
    return "symbol" == ProgressManager_typeof(o) ? o : o + "";
  }
  function ProgressManager_toPrimitive(r, o) {
    if ("object" != ProgressManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != ProgressManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var S = function() {
    function ProgressManager(r, o) {
      ProgressManager_classCallCheck(this, ProgressManager);
      this.playerCore = r;
      this.targetVideo = r.targetVideo;
      this.uiElements = o;
      this.progressBarElement = null;
      this.progressIndicator = null;
      this.currentTimeDisplay = null;
      this.totalDurationDisplay = null;
      this.timeIndicator = null;
      this.isDraggingProgress = false;
      this.progressHandleMoveHandler = null;
      this.progressHandleUpHandler = null;
      this.lastDragX = 0;
      this.isTouchDevice = "ontouchstart" in window;
    }
    return ProgressManager_createClass(ProgressManager, [ {
      "key": "init",
      "value": function init(r) {
        this.progressBarElement = r.progressBarElement;
        this.progressIndicator = r.progressIndicator;
        this.currentTimeDisplay = r.currentTimeDisplay;
        this.totalDurationDisplay = r.totalDurationDisplay;
        this.timeIndicator = r.timeIndicator;
        this.progressBarContainer = this.progressBarElement.parentElement;
        this.progressBarElement.addEventListener("click", this.handleProgressClick.bind(this));
        this.progressBarContainer.addEventListener("mousedown", this.startProgressDrag.bind(this));
        this.progressBarContainer.addEventListener("touchstart", this.startProgressDrag.bind(this), {
          "passive": false
        });
        this.targetVideo.addEventListener("timeupdate", this.updateProgressBar.bind(this));
        return this;
      }
    }, {
      "key": "updateProgressBar",
      "value": function updateProgressBar() {
        if (!this.targetVideo || !this.progressBarElement || !this.progressIndicator) {
          return;
        }
        var r = this.targetVideo.currentTime;
        var o = this.targetVideo.duration;
        if (isNaN(o) || o <= 0) {
          return;
        }
        var a = r / o * 100;
        this.progressIndicator.style.width = "".concat(a, "%");
        this.updateCurrentTimeDisplay();
      }
    }, {
      "key": "updateCurrentTimeDisplay",
      "value": function updateCurrentTimeDisplay() {
        if (!this.targetVideo || !this.currentTimeDisplay || !this.totalDurationDisplay) {
          return;
        }
        var r = this.targetVideo.currentTime;
        var o = this.targetVideo.duration;
        if (isNaN(o)) {
          return;
        }
        this.currentTimeDisplay.textContent = this.formatTime(r);
        var a = o - r;
        this.totalDurationDisplay.textContent = "-".concat(this.formatTime(a));
      }
    }, {
      "key": "formatTime",
      "value": function formatTime(r) {
        if (isNaN(r) || r < 0) {
          return "00:00:00";
        }
        var o = Math.floor(r);
        var a = Math.floor(o / 3600);
        var l = Math.floor(o % 3600 / 60);
        var u = o % 60;
        return "".concat(a.toString().padStart(2, "0"), ":").concat(l.toString().padStart(2, "0"), ":").concat(u.toString().padStart(2, "0"));
      }
    }, {
      "key": "handleProgressClick",
      "value": function handleProgressClick(r) {
        if (this.isDraggingProgress) {
          return;
        }
        var o = this.progressBarElement.getBoundingClientRect();
        var a = (r.clientX - o.left) / o.width;
        var l = this.targetVideo.duration;
        if (isNaN(l)) {
          return;
        }
        var u = l * a;
        this.targetVideo.currentTime = u;
        this.updateProgressBar();
      }
    }, {
      "key": "seekRelative",
      "value": function seekRelative(r) {
        if (!this.targetVideo) {
          return;
        }
        var o = Math.max(0, Math.min(this.targetVideo.duration, this.targetVideo.currentTime + r));
        this.targetVideo.currentTime = o;
      }
    }, {
      "key": "startProgressDrag",
      "value": function startProgressDrag(r) {
        r.preventDefault();
        r.stopPropagation();
        this.isDraggingProgress = true;
        this.lastDragX = r.type.includes("touch") ? r.touches[0].clientX : r.clientX;
        this.progressBarElement.classList.add("tm-progress-bar-expanded");
        this.progressBarElement.classList.remove("tm-progress-bar-normal");
        this.progressBarElement.classList.add("tm-dragging");
        if (this.timeIndicator) {
          this.timeIndicator.style.display = "block";
          this.timeIndicator.style.opacity = "1";
          this.updateTimeIndicator(r);
        }
        var o = this.handleProgressMove.bind(this);
        var a = this.handleProgressUp.bind(this);
        this.removeProgressEventListeners();
        if (r.type.includes("touch")) {
          document.addEventListener("touchmove", o, {
            "passive": false
          });
          document.addEventListener("touchend", a, {
            "passive": false
          });
          document.addEventListener("touchcancel", a, {
            "passive": false
          });
        } else {
          document.addEventListener("mousemove", o);
          document.addEventListener("mouseup", a);
          document.addEventListener("mouseleave", a);
        }
        this.progressHandleMoveHandler = o;
        this.progressHandleUpHandler = a;
        var l = this.progressBarElement.getBoundingClientRect();
        var u;
        var p = ((r.type.includes("touch") ? r.touches[0].clientX : r.clientX) - l.left) / l.width;
        p = Math.max(0, Math.min(1, p));
        var v = this.targetVideo.duration;
        if (!isNaN(v)) {
          var y = v * p;
          this.targetVideo.currentTime = y;
          this.progressIndicator.style.width = "".concat(100 * p, "%");
          this.updateCurrentTimeDisplay();
        }
      }
    }, {
      "key": "handleProgressMove",
      "value": function handleProgressMove(r) {
        if (!this.isDraggingProgress) {
          return;
        }
        r.preventDefault();
        var o = r.type.includes("touch") ? r.touches[0].clientX : r.clientX;
        this.updateTimeIndicator(r);
        var a = this.progressBarElement.getBoundingClientRect();
        if (a.width <= 0) {
          return;
        }
        var l = (o - a.left) / a.width;
        l = Math.max(0, Math.min(1, l));
        var u = this.targetVideo.duration;
        if (isNaN(u)) {
          return;
        }
        var p = u * l;
        this.progressIndicator.style.width = "".concat(100 * l, "%");
        this.targetVideo.currentTime = p;
        this.currentTimeDisplay.textContent = this.formatTime(p);
        var v = u - p;
        this.totalDurationDisplay.textContent = "-".concat(this.formatTime(v));
        this.lastDragX = o;
      }
    }, {
      "key": "handleProgressUp",
      "value": function handleProgressUp(r) {
        if (!this.isDraggingProgress) {
          return;
        }
        var o = this.progressBarElement.getBoundingClientRect();
        var a;
        var l = ((r.type.includes("touch") ? r.changedTouches && r.changedTouches[0] ? r.changedTouches[0].clientX : this.lastDragX : r.clientX || this.lastDragX) - o.left) / o.width;
        l = Math.max(0, Math.min(1, l));
        var u = this.targetVideo.duration;
        if (!isNaN(u)) {
          this.targetVideo.currentTime = u * l;
        }
        if (this.timeIndicator) {
          this.timeIndicator.style.opacity = "0";
        }
        this.progressBarElement.classList.remove("tm-dragging");
        if (!this.progressBarElement.classList.contains("tm-progress-bar-hovered")) {
          this.progressBarElement.classList.add("tm-progress-bar-normal");
          this.progressBarElement.classList.remove("tm-progress-bar-expanded");
        }
        this.isDraggingProgress = false;
        this.lastDragX = 0;
        this.removeProgressEventListeners();
      }
    }, {
      "key": "removeProgressEventListeners",
      "value": function removeProgressEventListeners() {
        if (this.progressHandleMoveHandler) {
          document.removeEventListener("mousemove", this.progressHandleMoveHandler);
          document.removeEventListener("touchmove", this.progressHandleMoveHandler);
        }
        if (this.progressHandleUpHandler) {
          document.removeEventListener("mouseup", this.progressHandleUpHandler);
          document.removeEventListener("touchend", this.progressHandleUpHandler);
          document.removeEventListener("touchcancel", this.progressHandleUpHandler);
          document.removeEventListener("mouseleave", this.progressHandleUpHandler);
        }
        this.progressHandleMoveHandler = null;
        this.progressHandleUpHandler = null;
      }
    }, {
      "key": "updateTimeIndicator",
      "value": function updateTimeIndicator(r) {
        if (!this.timeIndicator || !this.targetVideo) {
          return;
        }
        var o = r.type.includes("touch") ? r.touches[0].clientX : r.clientX;
        var a = r.type.includes("touch") ? r.touches[0].clientY : r.clientY;
        var l = this.uiElements.videoWrapper.getBoundingClientRect();
        var u = this.progressBarElement.getBoundingClientRect();
        var p = Math.max(l.left + 10, Math.min(l.right - 10, o));
        var v = u.top - 20;
        this.timeIndicator.style.left = "".concat(p, "px");
        this.timeIndicator.style.top = "".concat(v, "px");
        var y = (o - u.left) / u.width;
        var b = Math.max(0, Math.min(1, y));
        var k = this.targetVideo.duration;
        if (isNaN(k)) {
          return;
        }
        var C = k * b;
        this.timeIndicator.textContent = "".concat(this.formatTime(C), " / ").concat(this.formatTime(k));
      }
    } ]);
  }();
  function EventManager_typeof(r) {
    return EventManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, EventManager_typeof(r);
  }
  function EventManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function EventManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, EventManager_toPropertyKey(l.key), l);
    }
  }
  function EventManager_createClass(r, o, a) {
    return o && EventManager_defineProperties(r.prototype, o), a && EventManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function EventManager_toPropertyKey(r) {
    var o = EventManager_toPrimitive(r, "string");
    return "symbol" == EventManager_typeof(o) ? o : o + "";
  }
  function EventManager_toPrimitive(r, o) {
    if ("object" != EventManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != EventManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var M = function() {
    function EventManager(r, o, a) {
      EventManager_classCallCheck(this, EventManager);
      this.playerCore = r;
      this.targetVideo = r.targetVideo;
      this.uiElements = o;
      this.managers = a;
      this.resizeObserver = null;
      this.clickLock = false;
      this.clickLockTimeout = null;
    }
    return EventManager_createClass(EventManager, [ {
      "key": "init",
      "value": function init() {
        this.handleWindowResizeBound = this.handleWindowResize.bind(this);
        this.handleContainerResizeBound = this.handleContainerResize.bind(this);
        this.handleOverlayTouchMoveBound = function(r) {
          return r.preventDefault();
        };
        this.clickLock = false;
        this.clickLockTimeout = null;
        this.handleCloseButtonClickBound = this.handleCloseButtonClick.bind(this);
        if (this.uiElements.closeBtn) {
          this.uiElements.closeBtn.addEventListener("click", this.handleCloseButtonClickBound);
        }
        this.handleSettingsButtonClickBound = this.handleSettingsButtonClick.bind(this);
        if (this.uiElements.settingsBtn) {
          this.uiElements.settingsBtn.addEventListener("click", this.handleSettingsButtonClickBound);
        }
        window.addEventListener("resize", this.handleWindowResizeBound);
        if (this.uiElements.container && "undefined" !== typeof ResizeObserver) {
          this.resizeObserver = new ResizeObserver(this.handleContainerResizeBound);
          this.resizeObserver.observe(this.uiElements.container);
        }
        if (this.uiElements.overlay) {
          this.uiElements.overlay.addEventListener("touchmove", this.handleOverlayTouchMoveBound, {
            "passive": false
          });
        }
        this.initVideoEventListeners();
      }
    }, {
      "key": "initVideoEventListeners",
      "value": function initVideoEventListeners() {
        var r = this;
        this.handleMetadataLoadedBound = function() {
          if (r.managers.progressManager) {
            r.managers.progressManager.updateProgressBar();
          }
          if (r.managers.loopManager) {
            r.managers.loopManager.updateLoopTimeDisplay();
            r.managers.loopManager.updateLoopMarkers();
          }
          if (r.managers.dragManager) {
            r.managers.dragManager.updateHandlePosition();
          }
          if (r.managers.uiManager) {
            r.managers.uiManager.updateContainerMinHeight();
          }
          if (r.managers.swipeManager) {
            r.managers.swipeManager.updateSize();
          }
        };
        this.targetVideo.addEventListener("loadedmetadata", this.handleMetadataLoadedBound);
        this.handleCanPlayBound = function() {
          if (r.managers.uiManager) {
            r.managers.uiManager.updateContainerMinHeight();
          }
          if (r.managers.swipeManager) {
            r.managers.swipeManager.updateSize();
          }
        };
        this.targetVideo.addEventListener("canplay", this.handleCanPlayBound);
        this.handleVideoResizeBound = function() {
          if (r.managers.uiManager) {
            r.managers.uiManager.updateContainerMinHeight();
          }
          if (r.managers.swipeManager) {
            r.managers.swipeManager.updateSize();
          }
        };
        this.targetVideo.addEventListener("resize", this.handleVideoResizeBound);
        this.handlePlayBound = function() {
          if (r.managers.controlManager) {
            r.managers.controlManager.updatePlayPauseButton();
          }
        };
        this.targetVideo.addEventListener("play", this.handlePlayBound);
        this.handlePauseBound = function() {
          if (r.managers.controlManager) {
            r.managers.controlManager.updatePlayPauseButton();
            r.managers.controlManager.showPauseIndicator();
          }
        };
        this.targetVideo.addEventListener("pause", this.handlePauseBound);
      }
    }, {
      "key": "handleVideoWrapperClick",
      "value": function handleVideoWrapperClick(r) {
        var o = this;
        if (r.target === this.uiElements.videoWrapper || r.target === this.targetVideo) {
          if (this.clickLock) {
            return;
          }
          if (this.managers.swipeManager && "function" === typeof this.managers.swipeManager.wasRecentlyDragging && this.managers.swipeManager.wasRecentlyDragging()) {
            return;
          }
          this.clickLock = true;
          if (this.clickLockTimeout) {
            clearTimeout(this.clickLockTimeout);
          }
          this.clickLockTimeout = setTimeout((function() {
            o.clickLock = false;
            o.clickLockTimeout = null;
          }), 500);
          if (this.targetVideo.paused) {
            this.targetVideo.play();
          } else {
            this.targetVideo.pause();
            if (this.managers.controlManager) {
              this.managers.controlManager.showPauseIndicator();
            }
          }
          if (this.managers.controlManager) {
            this.managers.controlManager.updatePlayPauseButton();
          }
        }
      }
    }, {
      "key": "handleCloseButtonClick",
      "value": function handleCloseButtonClick() {
        this.cleanup();
        this.playerCore.close(this.uiElements.overlay, this.uiElements.container, this.uiElements.playerContainer);
      }
    }, {
      "key": "handleSettingsButtonClick",
      "value": function handleSettingsButtonClick() {
        if (this.managers.settingsManager) {
          this.managers.settingsManager.toggleSettingsPanel();
        }
      }
    }, {
      "key": "handleWindowResize",
      "value": function handleWindowResize() {
        if (this.managers.uiManager) {
          this.managers.uiManager.updateContainerMinHeight();
        }
        if (this.managers.dragManager) {
          this.managers.dragManager.updateHandlePosition();
        }
        if (this.managers.swipeManager) {
          this.managers.swipeManager.updateSize();
        }
      }
    }, {
      "key": "handleContainerResize",
      "value": function handleContainerResize() {
        if (this.managers.dragManager) {
          this.managers.dragManager.updateHandlePosition();
        }
        if (this.managers.swipeManager) {
          this.managers.swipeManager.updateSize();
        }
      }
    }, {
      "key": "cleanup",
      "value": function cleanup() {
        window.removeEventListener("resize", this.handleWindowResizeBound);
        if (this.resizeObserver) {
          this.resizeObserver.disconnect();
          this.resizeObserver = null;
        }
        if (this.clickLockTimeout) {
          clearTimeout(this.clickLockTimeout);
          this.clickLockTimeout = null;
        }
        if (this.uiElements.closeBtn) {
          this.uiElements.closeBtn.removeEventListener("click", this.handleCloseButtonClickBound);
        }
        if (this.uiElements.settingsBtn) {
          this.uiElements.settingsBtn.removeEventListener("click", this.handleSettingsButtonClickBound);
        }
        if (this.targetVideo) {
          this.targetVideo.removeEventListener("loadedmetadata", this.handleMetadataLoadedBound);
          this.targetVideo.removeEventListener("canplay", this.handleCanPlayBound);
          this.targetVideo.removeEventListener("resize", this.handleVideoResizeBound);
          this.targetVideo.removeEventListener("play", this.handlePlayBound);
          this.targetVideo.removeEventListener("pause", this.handlePauseBound);
        }
        if (this.uiElements.overlay) {
          this.uiElements.overlay.removeEventListener("touchmove", this.handleOverlayTouchMoveBound);
        }
      }
    } ]);
  }();
  function SettingsManager_typeof(r) {
    return SettingsManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, SettingsManager_typeof(r);
  }
  function SettingsManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function SettingsManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, SettingsManager_toPropertyKey(l.key), l);
    }
  }
  function SettingsManager_createClass(r, o, a) {
    return o && SettingsManager_defineProperties(r.prototype, o), a && SettingsManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function SettingsManager_toPropertyKey(r) {
    var o = SettingsManager_toPrimitive(r, "string");
    return "symbol" == SettingsManager_typeof(o) ? o : o + "";
  }
  function SettingsManager_toPrimitive(r, o) {
    if ("object" != SettingsManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != SettingsManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var E = function() {
    function SettingsManager(r, o) {
      SettingsManager_classCallCheck(this, SettingsManager);
      this.playerCore = r;
      this.targetVideo = r.targetVideo;
      this.uiElements = o;
      this.settingsPanel = o.settingsPanel;
      this.overlayClickHandler = null;
      this.settings = {
        "showSeekControlRow": true,
        "showLoopControlRow": true,
        "showPlaybackControlRow": true,
        "showProgressBar": true
      };
    }
    return SettingsManager_createClass(SettingsManager, [ {
      "key": "init",
      "value": function init() {
        this.loadSettings();
        this.createSettingsPanel();
        return this;
      }
    }, {
      "key": "createSettingsPanel",
      "value": function createSettingsPanel() {
        var r = this;
        var o = document.createElement("div");
        o.className = "tm-settings-options";
        o.style.display = "flex";
        o.style.flexDirection = "column";
        o.style.gap = "12px";
        var a = this.createSettingOption("显示-进度条", "showProgressBar", this.settings.showProgressBar, (function(o) {
          r.settings.showProgressBar = o;
          r.saveSettings();
          r.updateControlRowsVisibility();
        }));
        var l = this.createSettingOption("显示-进度跳转", "showSeekControlRow", this.settings.showSeekControlRow, (function(o) {
          r.settings.showSeekControlRow = o;
          r.saveSettings();
          r.updateControlRowsVisibility();
        }));
        var u = this.createSettingOption("显示-循环控制", "showLoopControlRow", this.settings.showLoopControlRow, (function(o) {
          r.settings.showLoopControlRow = o;
          r.saveSettings();
          r.updateControlRowsVisibility();
        }));
        var p = this.createSettingOption("显示-播放倍速", "showPlaybackControlRow", this.settings.showPlaybackControlRow, (function(o) {
          r.settings.showPlaybackControlRow = o;
          r.saveSettings();
          r.updateControlRowsVisibility();
        }));
        o.appendChild(a);
        o.appendChild(l);
        o.appendChild(u);
        o.appendChild(p);
        this.settingsPanel.appendChild(o);
      }
    }, {
      "key": "createSettingOption",
      "value": function createSettingOption(r, o, a, l) {
        var u = document.createElement("div");
        u.className = "tm-settings-option";
        u.id = "tm-setting-".concat(o);
        var p = document.createElement("label");
        p.className = "tm-settings-label";
        p.textContent = r;
        var v = document.createElement("div");
        v.className = "tm-toggle-switch";
        var y = document.createElement("input");
        y.type = "checkbox";
        y.checked = a;
        y.className = "tm-toggle-input";
        var b = document.createElement("span");
        b.className = a ? "tm-toggle-slider checked" : "tm-toggle-slider";
        u.tabIndex = 0;
        v.appendChild(y);
        v.appendChild(b);
        var k = function toggleSwitch(r) {
          r.preventDefault();
          r.stopPropagation();
          y.checked = !y.checked;
          if (y.checked) {
            b.className = "tm-toggle-slider checked";
          } else {
            b.className = "tm-toggle-slider";
          }
          if ("function" === typeof l) {
            l(y.checked);
          }
        };
        u.addEventListener("click", k);
        u.addEventListener("keydown", (function(r) {
          if ("Enter" === r.key || " " === r.key) {
            r.preventDefault();
            k(r);
          }
        }));
        u.appendChild(p);
        u.appendChild(v);
        return u;
      }
    }, {
      "key": "toggleSettingsPanel",
      "value": function toggleSettingsPanel() {
        var r = this;
        var o;
        if (this.settingsPanel.classList.contains("active")) {
          this.closeSettingsPanel();
        } else {
          this.settingsPanel.style.display = "block";
          setTimeout((function() {
            r.settingsPanel.classList.add("active");
          }), 10);
          this.overlayClickHandler = function(o) {
            if (!r.settingsPanel.contains(o.target) && o.target !== r.uiElements.settingsBtn) {
              r.closeSettingsPanel();
            }
          };
          setTimeout((function() {
            if (r.uiElements.overlay) {
              r.uiElements.overlay.addEventListener("click", r.overlayClickHandler);
            }
          }), 50);
        }
      }
    }, {
      "key": "closeSettingsPanel",
      "value": function closeSettingsPanel() {
        var r = this;
        this.settingsPanel.classList.remove("active");
        if (this.uiElements.overlay && this.overlayClickHandler) {
          this.uiElements.overlay.removeEventListener("click", this.overlayClickHandler);
          this.overlayClickHandler = null;
        }
        setTimeout((function() {
          r.settingsPanel.style.display = "none";
        }), 300);
      }
    }, {
      "key": "loadSettings",
      "value": function loadSettings() {
        try {
          var r = function getValue(r, o) {
            try {
              if ("function" === typeof GM_getValue) {
                return GM_getValue(r, o);
              } else {
                var a = localStorage.getItem("missNoAD_".concat(r));
                return null !== a ? JSON.parse(a) : o;
              }
            } catch (r) {
              return o;
            }
          };
          this.settings.showProgressBar = r("showProgressBar", true);
          this.settings.showSeekControlRow = r("showSeekControlRow", true);
          this.settings.showLoopControlRow = r("showLoopControlRow", true);
          this.settings.showPlaybackControlRow = r("showPlaybackControlRow", true);
        } catch (r) {}
      }
    }, {
      "key": "saveSettings",
      "value": function saveSettings() {
        try {
          var r = function setValue(r, o) {
            try {
              if ("function" === typeof GM_setValue) {
                GM_setValue(r, o);
                return true;
              } else {
                localStorage.setItem("missNoAD_".concat(r), JSON.stringify(o));
                return true;
              }
            } catch (r) {
              return false;
            }
          };
          r("showProgressBar", this.settings.showProgressBar);
          r("showSeekControlRow", this.settings.showSeekControlRow);
          r("showLoopControlRow", this.settings.showLoopControlRow);
          r("showPlaybackControlRow", this.settings.showPlaybackControlRow);
        } catch (r) {}
      }
    }, {
      "key": "updateControlRowsVisibility",
      "value": function updateControlRowsVisibility() {
        var r = document.querySelector(".tm-control-buttons");
        if (!r) {
          return;
        }
        var o = r.querySelector(".tm-seek-control-row");
        var a = r.querySelector(".tm-loop-control-row");
        var l = r.querySelector(".tm-playback-control-row");
        var u = r.querySelector(".tm-progress-row");
        if (u) {
          u.style.display = this.settings.showProgressBar ? "flex" : "none";
        }
        if (o) {
          o.style.display = this.settings.showSeekControlRow ? "flex" : "none";
        }
        if (a) {
          a.style.display = this.settings.showLoopControlRow ? "flex" : "none";
        }
        if (l) {
          l.style.display = this.settings.showPlaybackControlRow ? "flex" : "none";
        }
      }
    }, {
      "key": "updateSetting",
      "value": function updateSetting(r, o) {
        if (this.settings.hasOwnProperty(r)) {
          this.settings[r] = o;
          this.saveSettings();
          if (r.startsWith("show") && r.endsWith("Row")) {
            this.updateControlRowsVisibility();
          }
        }
      }
    } ]);
  }();
  function videoSwipeManager_typeof(r) {
    return videoSwipeManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, videoSwipeManager_typeof(r);
  }
  function videoSwipeManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function videoSwipeManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, videoSwipeManager_toPropertyKey(l.key), l);
    }
  }
  function videoSwipeManager_createClass(r, o, a) {
    return o && videoSwipeManager_defineProperties(r.prototype, o), a && videoSwipeManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function videoSwipeManager_toPropertyKey(r) {
    var o = videoSwipeManager_toPrimitive(r, "string");
    return "symbol" == videoSwipeManager_typeof(o) ? o : o + "";
  }
  function videoSwipeManager_toPrimitive(r, o) {
    if ("object" != videoSwipeManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != videoSwipeManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var L = function() {
    function VideoSwipeManager(r, o, a) {
      videoSwipeManager_classCallCheck(this, VideoSwipeManager);
      this.video = r;
      this.container = o;
      this.handle = a;
      this.offset = 0;
      this.maxOffset = 0;
      this.isDragging = false;
      this.isHandleDragging = false;
      this.startX = 0;
      this.startOffset = 0;
      this.lastSnapPosition = null;
      this.wasDragging = false;
      this.dragEndTimestamp = 0;
      this.dragDistance = 0;
      this.minDragDistance = 10;
      this.videoWidth = 0;
      this.videoHeight = 0;
      this.containerWidth = 0;
      this.containerHeight = 0;
      this.videoScale = 1;
      this.velocityTracker = {
        "positions": [],
        "lastTimestamp": 0,
        "currentVelocity": 0
      };
      this.handleVelocityTracker = {
        "positions": [],
        "lastTimestamp": 0,
        "currentVelocity": 0
      };
      this.animation = {
        "active": false,
        "rafId": null,
        "targetOffset": 0,
        "startTime": 0,
        "duration": 0
      };
      this._pointerDownHandler = this._handlePointerDown.bind(this);
      this._pointerMoveHandler = this._handlePointerMove.bind(this);
      this._pointerUpHandler = this._handlePointerUp.bind(this);
      this._handlePointerDownHandler = this._handleHandlePointerDown.bind(this);
      this._handlePointerMoveHandler = this._handleHandlePointerMove.bind(this);
      this._handlePointerUpHandler = this._handleHandlePointerUp.bind(this);
      this._init();
    }
    return videoSwipeManager_createClass(VideoSwipeManager, [ {
      "key": "_init",
      "value": function _init() {
        var r = this;
        this.video.style.willChange = "transform";
        this.video.style.transition = "transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)";
        this.video.addEventListener("pointerdown", this._pointerDownHandler);
        if (this.handle) {
          this.handle.style.willChange = "transform, left";
          this.handle.style.transition = "left 0.2s cubic-bezier(0.215, 0.61, 0.355, 1), width 0.2s ease";
          this.handle.addEventListener("pointerdown", this._handlePointerDownHandler);
        }
        this._updateConstraints();
        this.video.addEventListener("loadedmetadata", (function() {
          r._updateConstraints();
        }));
        this.video.addEventListener("canplay", (function() {
          r._updateConstraints();
        }));
      }
    }, {
      "key": "_updateVideoDimensions",
      "value": function _updateVideoDimensions() {
        this.videoWidth = this.video.videoWidth || this.video.naturalWidth || 0;
        this.videoHeight = this.video.videoHeight || this.video.naturalHeight || 0;
        this.containerWidth = this.container.offsetWidth;
        this.containerHeight = this.container.offsetHeight;
        if (this.videoWidth <= 0 || this.videoHeight <= 0 || this.containerWidth <= 0 || this.containerHeight <= 0) {
          this.videoScale = 1;
          this.maxOffset = 0;
          return false;
        }
        var r = this.video.getBoundingClientRect();
        var o = r.width;
        var a = r.height;
        this.videoScale = a / this.videoHeight;
        var l = Math.max(0, o - this.containerWidth);
        this.maxOffset = l / 2;
        return true;
      }
    }, {
      "key": "_updateConstraints",
      "value": function _updateConstraints() {
        var r;
        if (!this._updateVideoDimensions() || this.maxOffset <= 0) {
          this._applyOffset(0, false);
          this._updateHandleState(false);
          return false;
        }
        this.offset = Math.max(-this.maxOffset, Math.min(this.offset, this.maxOffset));
        this._applyOffset(this.offset, false);
        this._updateHandleState(true);
        return true;
      }
    }, {
      "key": "_applyOffset",
      "value": function _applyOffset(r) {
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : true;
        this.offset = Math.max(-this.maxOffset, Math.min(r, this.maxOffset));
        if (o) {
          this.video.style.transition = "transform 0.2s cubic-bezier(0.215, 0.61, 0.355, 1)";
        } else {
          this.video.style.transition = "none";
        }
        this.video.style.transform = "translateX(".concat(this.offset, "px)");
        this._updateHandlePosition();
        return this;
      }
    }, {
      "key": "_updateHandleState",
      "value": function _updateHandleState(r) {
        if (!this.handle) {
          return;
        }
        this._updateHandleWidth();
        if (r) {
          this.handle.style.cursor = "grab";
          this.video.style.cursor = "grab";
          var o = this.handle.parentElement;
          if (o) {
            o.style.cursor = "grab";
          }
        } else {
          this.handle.style.cursor = "default";
          this.video.style.cursor = "default";
        }
        this._updateHandlePosition();
      }
    }, {
      "key": "_updateHandleWidth",
      "value": function _updateHandleWidth() {
        if (!this.handle) {
          return;
        }
        var r = 30;
        this.handle.style.width = "".concat(r, "%");
      }
    }, {
      "key": "_updateHandlePosition",
      "value": function _updateHandlePosition() {
        if (!this.handle) {
          return;
        }
        var r = this.handle.parentElement;
        if (!r) {
          return;
        }
        if (this.maxOffset <= 0) {
          this.handle.style.left = "50%";
          this.handle.style.transform = "translateX(-50%)";
          return;
        }
        var o = r.offsetWidth;
        var a;
        var l = o - this.handle.offsetWidth;
        var u;
        var p;
        var v = (1 - (this.offset + this.maxOffset) / (2 * this.maxOffset)) * l / o * 100;
        this.handle.style.left = "".concat(v, "%");
        this.handle.style.transform = "";
      }
    }, {
      "key": "_trackVelocity",
      "value": function _trackVelocity(r) {
        var o = Date.now();
        var a = this.velocityTracker;
        a.positions.push({
          "x": r,
          "time": o
        });
        while (a.positions.length > 1 && o - a.positions[0].time > 100) {
          a.positions.shift();
        }
        if (a.positions.length > 1) {
          var l = a.positions[0];
          var u = a.positions[a.positions.length - 1];
          var p = u.time - l.time;
          if (p > 0) {
            a.currentVelocity = (u.x - l.x) / p;
          }
        }
        a.lastTimestamp = o;
      }
    }, {
      "key": "_applyInertia",
      "value": function _applyInertia() {
        if (Math.abs(this.velocityTracker.currentVelocity) < .1) {
          return;
        }
        var r = this.velocityTracker.currentVelocity;
        var o = .002;
        var a = r * r / (2 * o) * Math.sign(r);
        var l = this.offset + a;
        l = Math.max(-this.maxOffset, Math.min(l, this.maxOffset));
        var u = Math.min(.8 * Math.abs(r / o), 400);
        this._animateTo(l, u);
      }
    }, {
      "key": "_animateTo",
      "value": function _animateTo(r) {
        var o = this;
        var a = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 300;
        if (this.animation.active) {
          cancelAnimationFrame(this.animation.rafId);
        }
        this.animation.active = true;
        this.animation.targetOffset = r;
        this.animation.startTime = Date.now();
        this.animation.duration = a;
        var l = function animate() {
          var u;
          var p = Date.now() - o.animation.startTime;
          if (p >= a) {
            o._applyOffset(r, false);
            o.animation.active = false;
            return;
          }
          var v = 1 - Math.pow(1 - p / a, 3);
          var y = o.offset + (r - o.offset) * v;
          o._applyOffset(y, false);
          o.animation.rafId = requestAnimationFrame(l);
        };
        this.animation.rafId = requestAnimationFrame(l);
      }
    }, {
      "key": "_handlePointerDown",
      "value": function _handlePointerDown(r) {
        if (this.maxOffset <= 0) {
          return;
        }
        if (!r.isPrimary) {
          return;
        }
        if (this.animation.active) {
          cancelAnimationFrame(this.animation.rafId);
          this.animation.active = false;
        }
        this.isDragging = true;
        this.startX = r.clientX;
        this.startOffset = this.offset;
        this.dragDistance = 0;
        this.velocityTracker.positions = [];
        this.velocityTracker.lastTimestamp = Date.now();
        this.velocityTracker.currentVelocity = 0;
        this._trackVelocity(r.clientX);
        this.video.style.cursor = "grabbing";
        this.video.style.transition = "none";
        if (this.video.setPointerCapture) {
          this.video.setPointerCapture(r.pointerId);
        }
        this.video.addEventListener("pointermove", this._pointerMoveHandler);
        this.video.addEventListener("pointerup", this._pointerUpHandler);
        this.video.addEventListener("pointercancel", this._pointerUpHandler);
        if (window.navigator.vibrate) {
          window.navigator.vibrate(5);
        }
        r.preventDefault();
      }
    }, {
      "key": "_handlePointerMove",
      "value": function _handlePointerMove(r) {
        if (!this.isDragging || !r.isPrimary) {
          return;
        }
        var o = r.clientX - this.startX;
        this.dragDistance = Math.max(this.dragDistance, Math.abs(o));
        var a = Math.max(-this.maxOffset, Math.min(this.startOffset + o, this.maxOffset));
        this._applyOffset(a, false);
        this._trackVelocity(r.clientX);
        r.preventDefault();
      }
    }, {
      "key": "_handlePointerUp",
      "value": function _handlePointerUp(r) {
        if (!this.isDragging || !r.isPrimary) {
          return;
        }
        this.isDragging = false;
        if (this.dragDistance > this.minDragDistance) {
          this.wasDragging = true;
          this.dragEndTimestamp = Date.now();
        } else {
          this.wasDragging = false;
        }
        if (this.video.releasePointerCapture) {
          this.video.releasePointerCapture(r.pointerId);
        }
        this.video.removeEventListener("pointermove", this._pointerMoveHandler);
        this.video.removeEventListener("pointerup", this._pointerUpHandler);
        this.video.removeEventListener("pointercancel", this._pointerUpHandler);
        this.video.style.cursor = "grab";
        this._applyInertia();
        r.preventDefault();
      }
    }, {
      "key": "_handleHandlePointerDown",
      "value": function _handleHandlePointerDown(r) {
        if (this.maxOffset <= 0) {
          return;
        }
        if (!r.isPrimary) {
          return;
        }
        if (this.animation.active) {
          cancelAnimationFrame(this.animation.rafId);
          this.animation.active = false;
        }
        this.isHandleDragging = true;
        this.startX = r.clientX;
        this.dragDistance = 0;
        this.startOffset = this.offset;
        var o = this.handle.parentElement;
        var a = o ? o.offsetWidth : 0;
        if (a > 0) {
          var l = this.handle.getBoundingClientRect();
          this.startHandleLeft = l.left - o.getBoundingClientRect().left;
          this.startHandleLeftPercent = this.startHandleLeft / a * 100;
        } else {
          this.startHandleLeft = 0;
          this.startHandleLeftPercent = 0;
        }
        this.handle.style.cursor = "grabbing";
        this.handle.style.transition = "none";
        if (this.handle.setPointerCapture) {
          this.handle.setPointerCapture(r.pointerId);
        }
        this.handle.addEventListener("pointermove", this._handlePointerMoveHandler);
        this.handle.addEventListener("pointerup", this._handlePointerUpHandler);
        this.handle.addEventListener("pointercancel", this._handlePointerUpHandler);
        if (window.navigator.vibrate) {
          window.navigator.vibrate(5);
        }
        r.preventDefault();
      }
    }, {
      "key": "_handleHandlePointerMove",
      "value": function _handleHandlePointerMove(r) {
        if (!this.isHandleDragging || !r.isPrimary) {
          return;
        }
        var o = this.handle.parentElement;
        if (!o) {
          return;
        }
        var a = o.offsetWidth;
        var l = this.handle.offsetWidth;
        if (a <= 0 || l <= 0) {
          return;
        }
        var u = r.clientX - this.startX;
        this.dragDistance = Math.max(this.dragDistance, Math.abs(u));
        var p = this.startHandleLeft + u;
        var v = a - l;
        p = Math.max(0, Math.min(p, v));
        this._trackHandleVelocity(p);
        var y;
        var b = 15;
        var k = false;
        for (var C = 0, _ = [ 0, v / 2, v ]; C < _.length; C++) {
          var P = _[C];
          if (Math.abs(p - P) < b) {
            p = P;
            k = true;
            if (window.navigator.vibrate && (!this.lastSnapPosition || this.lastSnapPosition !== P)) {
              window.navigator.vibrate(15);
              this.lastSnapPosition = P;
            }
            break;
          }
        }
        if (!k) {
          this.lastSnapPosition = null;
        }
        var S = p / a * 100;
        this.handle.style.left = "".concat(S, "%");
        var M;
        var E = 2 * (1 - (v > 0 ? p / v : 0)) * this.maxOffset - this.maxOffset;
        this.video.style.transform = "translateX(".concat(E, "px)");
        this.video.style.transition = "none";
        this.offset = E;
        r.preventDefault();
      }
    }, {
      "key": "_handleHandlePointerUp",
      "value": function _handleHandlePointerUp(r) {
        if (!this.isHandleDragging || !r.isPrimary) {
          return;
        }
        this.isHandleDragging = false;
        if (this.dragDistance > this.minDragDistance) {
          this.wasDragging = true;
          this.dragEndTimestamp = Date.now();
        } else {
          this.wasDragging = false;
        }
        this.lastSnapPosition = null;
        if (this.handle.releasePointerCapture) {
          this.handle.releasePointerCapture(r.pointerId);
        }
        this.handle.removeEventListener("pointermove", this._handlePointerMoveHandler);
        this.handle.removeEventListener("pointerup", this._handlePointerUpHandler);
        this.handle.removeEventListener("pointercancel", this._handlePointerUpHandler);
        this.handle.style.cursor = "grab";
        this._applyHandleInertia();
        r.preventDefault();
      }
    }, {
      "key": "_trackHandleVelocity",
      "value": function _trackHandleVelocity(r) {
        var o = Date.now();
        var a = this.handleVelocityTracker;
        a.positions.push({
          "position": r,
          "time": o
        });
        while (a.positions.length > 1 && o - a.positions[0].time > 100) {
          a.positions.shift();
        }
        if (a.positions.length > 1) {
          var l = a.positions[0];
          var u = a.positions[a.positions.length - 1];
          var p = u.time - l.time;
          if (p > 0) {
            a.currentVelocity = (u.position - l.position) / p;
          }
        }
        a.lastTimestamp = o;
      }
    }, {
      "key": "_applyHandleInertia",
      "value": function _applyHandleInertia() {
        if (Math.abs(this.handleVelocityTracker.currentVelocity) < .1) {
          return;
        }
        var r = this.handle.parentElement;
        if (!r) {
          return;
        }
        var o = r.offsetWidth;
        var a;
        var l = o - this.handle.offsetWidth;
        var u = this.handle.getBoundingClientRect();
        var p = r.getBoundingClientRect();
        var v = u.left - p.left;
        var y = this.handleVelocityTracker.currentVelocity;
        var b;
        var k;
        var C = v + y * y / (2 * .002) * Math.sign(y);
        var _ = [ 0, l / 2, l ];
        var P = 30;
        var S = C = Math.max(0, Math.min(C, l));
        var M = Number.MAX_VALUE;
        for (var E = 0, L = _; E < L.length; E++) {
          var T = L[E];
          var V = Math.abs(C - T);
          if (V < P && V < M) {
            S = T;
            M = V;
          }
        }
        if (M < Number.MAX_VALUE) {
          C = S;
        }
        var B = C / o * 100;
        var I;
        var D = 2 * (1 - (l > 0 ? C / l : 0)) * this.maxOffset - this.maxOffset;
        this.handle.style.transition = "left 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        this.video.style.transition = "transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
        this.handle.style.left = "".concat(B, "%");
        this.video.style.transform = "translateX(".concat(D, "px)");
        this.offset = D;
        if (M < Number.MAX_VALUE && window.navigator.vibrate) {
          window.navigator.vibrate(10);
        }
        this.handleVelocityTracker.positions = [];
        this.handleVelocityTracker.currentVelocity = 0;
      }
    }, {
      "key": "setOffset",
      "value": function setOffset(r) {
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : true;
        return this._applyOffset(r, o);
      }
    }, {
      "key": "reset",
      "value": function reset() {
        var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : true;
        this._applyOffset(0, r);
        this.wasDragging = false;
        return this;
      }
    }, {
      "key": "updateSize",
      "value": function updateSize() {
        if (this.video && this.container) {
          var r = this.video.getBoundingClientRect();
          var o = this.container.getBoundingClientRect();
          var a = this._updateConstraints();
        }
        return this;
      }
    }, {
      "key": "destroy",
      "value": function destroy() {
        if (this.video) {
          this.video.removeEventListener("pointerdown", this._pointerDownHandler);
          this.video.style.transform = "";
          this.video.style.willChange = "";
          this.video.style.transition = "";
          this.video.style.cursor = "";
        }
        if (this.handle) {
          this.handle.removeEventListener("pointerdown", this._handlePointerDownHandler);
          this.handle.style.willChange = "";
          this.handle.style.transition = "";
          this.handle.style.left = "";
          this.handle.style.width = "";
          this.handle.style.cursor = "";
        }
        if (this.animation.active) {
          cancelAnimationFrame(this.animation.rafId);
          this.animation.active = false;
        }
        this.wasDragging = false;
      }
    }, {
      "key": "wasRecentlyDragging",
      "value": function wasRecentlyDragging() {
        var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 150;
        if (!this.wasDragging) {
          return false;
        }
        var o;
        if (Date.now() - this.dragEndTimestamp > r) {
          this.wasDragging = false;
          return false;
        }
        return true;
      }
    } ]);
  }();
  function CustomVideoPlayer_typeof(r) {
    return CustomVideoPlayer_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, CustomVideoPlayer_typeof(r);
  }
  function CustomVideoPlayer_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function CustomVideoPlayer_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, CustomVideoPlayer_toPropertyKey(l.key), l);
    }
  }
  function CustomVideoPlayer_createClass(r, o, a) {
    return o && CustomVideoPlayer_defineProperties(r.prototype, o), a && CustomVideoPlayer_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function CustomVideoPlayer_toPropertyKey(r) {
    var o = CustomVideoPlayer_toPrimitive(r, "string");
    return "symbol" == CustomVideoPlayer_typeof(o) ? o : o + "";
  }
  function CustomVideoPlayer_toPrimitive(r, o) {
    if ("object" != CustomVideoPlayer_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != CustomVideoPlayer_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var T = function() {
    function CustomVideoPlayer() {
      var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      CustomVideoPlayer_classCallCheck(this, CustomVideoPlayer);
      this.playerCore = new l(r);
      this.callingButton = r.callingButton || null;
      this.managers = {};
      this.initialized = false;
    }
    return CustomVideoPlayer_createClass(CustomVideoPlayer, [ {
      "key": "init",
      "value": function init() {
        var r = this;
        if (this.initialized) {
          return;
        }
        if (!this.playerCore) {
          this.playerCore = new l({
            "callingButton": this.callingButton
          });
        }
        this.playerCore.init();
        if (!this.playerCore.targetVideo) {
          if (this.callingButton) {
            this.callingButton.style.display = "flex";
          }
          return;
        }
        var o = new k(this.playerCore);
        var u = o.createUI();
        this.managers.uiManager = o;
        var p = new E(this.playerCore, u);
        p.init();
        this.managers.settingsManager = p;
        var v = new C(this.playerCore, u);
        var y = v.createProgressControls();
        var b = v.createControlButtonsContainer();
        this.managers.controlManager = v;
        this.playerCore.controlManager = v;
        var T = new S(this.playerCore, u);
        T.init({
          "progressBarElement": v.progressBarElement,
          "progressIndicator": v.progressIndicator,
          "currentTimeDisplay": v.currentTimeDisplay,
          "totalDurationDisplay": v.totalDurationDisplay,
          "timeIndicator": v.timeIndicator
        });
        this.managers.progressManager = T;
        var V = new P(this.playerCore, u);
        V.init({
          "loopStartMarker": v.loopStartMarker,
          "loopEndMarker": v.loopEndMarker,
          "loopRangeElement": v.loopRangeElement,
          "currentPositionDisplay": v.currentPositionDisplay,
          "durationDisplay": v.durationDisplay,
          "loopToggleButton": v.loopToggleButton
        });
        this.managers.loopManager = V;
        v.setLoopManager(V);
        var B = new _(this.playerCore, u);
        B.init();
        this.managers.dragManager = B;
        if (this.playerCore.targetVideo && u.videoWrapper && u.handle) {
          this.swipeManager = new L(this.playerCore.targetVideo, u.videoWrapper, u.handle);
          this.managers.swipeManager = this.swipeManager;
        }
        var I = new M(this.playerCore, u, this.managers);
        I.init();
        this.managers.eventManager = I;
        o.assembleDOM();
        p.updateControlRowsVisibility();
        this.playerCore.restoreVideoState();
        T.updateProgressBar();
        T.updateCurrentTimeDisplay();
        a.updateSafariThemeColor("#000000", true);
        setTimeout((function() {
          if (r.swipeManager) {
            r.swipeManager.updateSize();
          }
          B.updateHandlePosition();
        }), 100);
        setTimeout((function() {
          if (V) {
            V._updateUI();
            V.updateLoopTimeDisplay();
            V.updateLoopMarkers();
          }
          if (T) {
            T.updateProgressBar();
            T.updateCurrentTimeDisplay();
          }
        }), 500);
        this.initialized = true;
      }
    }, {
      "key": "close",
      "value": function close() {
        this.playerCore.close(this.managers.uiManager.overlay, this.managers.uiManager.container, this.managers.uiManager.playerContainer);
        if (this.managers.eventManager) {
          this.managers.eventManager.cleanup();
        }
        if (this.swipeManager) {
          this.swipeManager.destroy();
          this.swipeManager = null;
        }
        for (var r in this.managers) {
          if (this.managers[r] && "function" === typeof this.managers[r].cleanup) {
            this.managers[r].cleanup();
          }
          this.managers[r] = null;
        }
        this.initialized = false;
        this.managers = {};
        this.playerCore = null;
      }
    } ]);
  }();
  function FloatingButton_typeof(r) {
    return FloatingButton_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, FloatingButton_typeof(r);
  }
  function FloatingButton_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function FloatingButton_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, FloatingButton_toPropertyKey(l.key), l);
    }
  }
  function FloatingButton_createClass(r, o, a) {
    return o && FloatingButton_defineProperties(r.prototype, o), a && FloatingButton_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function FloatingButton_toPropertyKey(r) {
    var o = FloatingButton_toPrimitive(r, "string");
    return "symbol" == FloatingButton_typeof(o) ? o : o + "";
  }
  function FloatingButton_toPrimitive(r, o) {
    if ("object" != FloatingButton_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != FloatingButton_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var V = function() {
    function FloatingButton() {
      var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      FloatingButton_classCallCheck(this, FloatingButton);
      this.button = null;
      this.videoPlayer = null;
      this.resizeTimeout = null;
      this.playerState = r.playerState || null;
      this.videoCheckInterval = null;
      this.mutationObserver = null;
    }
    return FloatingButton_createClass(FloatingButton, [ {
      "key": "init",
      "value": function init() {
        this.cleanupExistingButtons();
        if (a.findVideoElement()) {
          this.createButton();
          window.addEventListener("resize", this.handleResize.bind(this));
          window.matchMedia("(orientation: portrait)").addEventListener("change", this.handleResize.bind(this));
          this.setupMutationObserver();
        } else {
          this.startVideoElementCheck();
          this.setupMutationObserver();
        }
      }
    }, {
      "key": "setupMutationObserver",
      "value": function setupMutationObserver() {
        if (this.mutationObserver) {
          this.mutationObserver.disconnect();
        }
        this.mutationObserver = new MutationObserver(this.handleDomMutations.bind(this));
        this.mutationObserver.observe(document.body, {
          "childList": true,
          "subtree": true
        });
      }
    }, {
      "key": "handleDomMutations",
      "value": function handleDomMutations() {
        var r = this;
        if (this.mutationTimeout) {
          clearTimeout(this.mutationTimeout);
        }
        this.mutationTimeout = setTimeout((function() {
          var o = a.findVideoElement();
          if (o && !r.button) {
            r.createButton();
            window.addEventListener("resize", r.handleResize.bind(r));
            window.matchMedia("(orientation: portrait)").addEventListener("change", r.handleResize.bind(r));
          } else if (!o && r.button) {
            r.button.style.display = "none";
          } else if (o && r.button && "none" === r.button.style.display) {
            r.button.style.display = "flex";
          }
        }), 300);
      }
    }, {
      "key": "startVideoElementCheck",
      "value": function startVideoElementCheck() {
        var r = this;
        if (this.videoCheckInterval) {
          clearInterval(this.videoCheckInterval);
        }
        this.videoCheckInterval = setInterval((function() {
          if (a.findVideoElement()) {
            if (!r.button) {
              r.createButton();
              window.addEventListener("resize", r.handleResize.bind(r));
              window.matchMedia("(orientation: portrait)").addEventListener("change", r.handleResize.bind(r));
            } else if ("none" === r.button.style.display) {
              r.button.style.display = "flex";
            }
            clearInterval(r.videoCheckInterval);
            r.videoCheckInterval = null;
          }
        }), 2e3);
      }
    }, {
      "key": "cleanupExistingButtons",
      "value": function cleanupExistingButtons() {
        var r = document.querySelectorAll(".tm-floating-button");
        if (r.length > 0) {
          r.forEach((function(r) {
            if (r && r.parentNode) {
              r.parentNode.removeChild(r);
            }
          }));
        }
      }
    }, {
      "key": "handleResize",
      "value": function handleResize() {
        var r = this;
        if (this.resizeTimeout) {
          clearTimeout(this.resizeTimeout);
        }
        this.resizeTimeout = setTimeout((function() {
          if (a.findVideoElement()) {
            r.button.style.display = "flex";
            r.updateButtonPosition();
          } else if (r.button) {
            r.button.style.display = "none";
          }
        }), 200);
      }
    }, {
      "key": "createButton",
      "value": function createButton() {
        var r = this;
        this.button = a.createElementWithStyle("button", "tm-floating-button");
        var o = '\n            <svg width="48" height="48" viewBox="0 0 68 48" fill="none">\n                <path class="tm-play-button-bg" d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z" fill="rgb(254, 98, 142)"></path>\n                <path d="M 45,24 27,14 27,34" fill="#fff"></path>\n            </svg>\n        ';
        this.button.innerHTML = o;
        this.button.addEventListener("click", (function() {
          r.handleButtonClick();
        }));
        this.button.style.display = "flex";
        document.body.appendChild(this.button);
        this.updateButtonPosition();
        return this.button;
      }
    }, {
      "key": "updateButtonPosition",
      "value": function updateButtonPosition() {
        if (!this.button) {
          return;
        }
        var r = a.getSafeAreaInsets();
        var o;
        if (a.isPortrait()) {
          this.button.style.bottom = "".concat(Math.max(20, r.bottom), "px");
          this.button.style.right = "auto";
          this.button.style.left = "50%";
          this.button.style.transform = "translateX(-50%)";
        } else {
          this.button.style.bottom = "".concat(Math.max(20, r.bottom + 10), "px");
          this.button.style.right = "".concat(Math.max(20, r.right + 10), "px");
          this.button.style.left = "auto";
          this.button.style.transform = "translateX(0)";
        }
        this.button.style.zIndex = "9980";
      }
    }, {
      "key": "handleButtonClick",
      "value": function handleButtonClick() {
        this.button.style.display = "none";
        this.videoPlayer = new T({
          "playerState": this.playerState,
          "callingButton": this.button
        });
        this.videoPlayer.init();
      }
    }, {
      "key": "remove",
      "value": function remove() {
        if (this.button && this.button.parentNode) {
          this.button.parentNode.removeChild(this.button);
        }
        window.removeEventListener("resize", this.handleResize);
        if (this.videoCheckInterval) {
          clearInterval(this.videoCheckInterval);
          this.videoCheckInterval = null;
        }
        if (this.mutationObserver) {
          this.mutationObserver.disconnect();
          this.mutationObserver = null;
        }
        this.button = null;
      }
    } ]);
  }();
  function PlayerState_typeof(r) {
    return PlayerState_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, PlayerState_typeof(r);
  }
  function PlayerState_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function PlayerState_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, PlayerState_toPropertyKey(l.key), l);
    }
  }
  function PlayerState_createClass(r, o, a) {
    return o && PlayerState_defineProperties(r.prototype, o), a && PlayerState_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function PlayerState_toPropertyKey(r) {
    var o = PlayerState_toPrimitive(r, "string");
    return "symbol" == PlayerState_typeof(o) ? o : o + "";
  }
  function PlayerState_toPrimitive(r, o) {
    if ("object" != PlayerState_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != PlayerState_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var B = function() {
    function PlayerState() {
      PlayerState_classCallCheck(this, PlayerState);
      this.settings = {
        "showSeekControlRow": true,
        "showLoopControlRow": true,
        "showPlaybackControlRow": true
      };
      this._setupStorageMethods();
    }
    return PlayerState_createClass(PlayerState, [ {
      "key": "_setupStorageMethods",
      "value": function _setupStorageMethods() {
        this.hasGMAPI = "function" === typeof GM_getValue && "function" === typeof GM_setValue;
      }
    }, {
      "key": "getValue",
      "value": function getValue(r, o) {
        try {
          if (this.hasGMAPI) {
            return GM_getValue(r, o);
          } else {
            var a = localStorage.getItem("missNoAD_".concat(r));
            return null !== a ? JSON.parse(a) : o;
          }
        } catch (r) {
          return o;
        }
      }
    }, {
      "key": "setValue",
      "value": function setValue(r, o) {
        try {
          if (this.hasGMAPI) {
            GM_setValue(r, o);
            return true;
          } else {
            localStorage.setItem("missNoAD_".concat(r), JSON.stringify(o));
            return true;
          }
        } catch (r) {
          return false;
        }
      }
    }, {
      "key": "loadSettings",
      "value": function loadSettings() {
        try {
          this.settings.showSeekControlRow = this.getValue("showSeekControlRow", true);
          this.settings.showLoopControlRow = this.getValue("showLoopControlRow", true);
          this.settings.showPlaybackControlRow = this.getValue("showPlaybackControlRow", true);
        } catch (r) {}
      }
    }, {
      "key": "saveSettings",
      "value": function saveSettings() {
        try {
          this.setValue("showSeekControlRow", this.settings.showSeekControlRow);
          this.setValue("showLoopControlRow", this.settings.showLoopControlRow);
          this.setValue("showPlaybackControlRow", this.settings.showPlaybackControlRow);
        } catch (r) {}
      }
    }, {
      "key": "updateSetting",
      "value": function updateSetting(r, o) {
        if (r in this.settings) {
          this.settings[r] = o;
          this.saveSettings();
        }
      }
    } ]);
  }();
  function utils_typeof(r) {
    return utils_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, utils_typeof(r);
  }
  function utils_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function utils_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, utils_toPropertyKey(l.key), l);
    }
  }
  function utils_createClass(r, o, a) {
    return o && utils_defineProperties(r.prototype, o), a && utils_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function utils_toPropertyKey(r) {
    var o = utils_toPrimitive(r, "string");
    return "symbol" == utils_typeof(o) ? o : o + "";
  }
  function utils_toPrimitive(r, o) {
    if ("object" != utils_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != utils_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var I = function() {
    function LoginUtils() {
      utils_classCallCheck(this, LoginUtils);
    }
    return utils_createClass(LoginUtils, null, [ {
      "key": "toast",
      "value": function toast(r) {
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3e3;
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "rgba(0, 0, 0, 0.8)";
        var l = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "#fff";
        var u = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "top";
        var toast = document.createElement("div");
        toast.innerText = r;
        toast.style.cssText = "\n            position: fixed;\n            z-index: 100000;\n            left: 50%;\n            transform: translateX(-50%);\n            padding: 10px 15px;\n            border-radius: 4px;\n            color: ".concat(l, ";\n            background: ").concat(a, ";\n            font-size: 14px;\n            max-width: 80%;\n            text-align: center;\n            word-break: break-all;\n        ");
        if ("top" === u) {
          toast.style.top = "10%";
        } else if ("bottom" === u) {
          toast.style.bottom = "10%";
        } else if ("center" === u) {
          toast.style.top = "50%";
          toast.style.transform = "translate(-50%, -50%)";
        }
        document.body.appendChild(toast);
        setTimeout((function() {
          toast.style.opacity = "0";
          toast.style.transition = "opacity 0.5s";
          setTimeout((function() {
            document.body.removeChild(toast);
          }), 500);
        }), o);
      }
    }, {
      "key": "throttle",
      "value": function throttle(r, o) {
        var a = 0;
        return function() {
          var l = Date.now();
          if (l - a >= o) {
            a = l;
            for (var u = arguments.length, p = new Array(u), v = 0; v < u; v++) {
              p[v] = arguments[v];
            }
            return r.apply(this, p);
          }
        };
      }
    }, {
      "key": "waitForElement",
      "value": function waitForElement(r) {
        var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1e4;
        var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 100;
        return new Promise((function(l, u) {
          var p = document.querySelector(r);
          if (p) {
            return l(p);
          }
          var v = Date.now();
          var y = setInterval((function() {
            var a = document.querySelector(r);
            if (a) {
              clearInterval(y);
              return l(a);
            }
            if (Date.now() - v > o) {
              clearInterval(y);
              u(new Error("等待元素 ".concat(r, " 超时")));
            }
          }), a);
        }));
      }
    }, {
      "key": "getValue",
      "value": function getValue(r, o) {
        try {
          var a = localStorage.getItem("autologin_".concat(r));
          if (null !== a) {
            try {
              return JSON.parse(a);
            } catch (r) {
              return a;
            }
          }
          return o;
        } catch (r) {
          return o;
        }
      }
    }, {
      "key": "setValue",
      "value": function setValue(r, o) {
        try {
          var a = "object" === utils_typeof(o) ? JSON.stringify(o) : o;
          localStorage.setItem("autologin_".concat(r), a);
        } catch (r) {}
      }
    } ]);
  }();
  function i18n_typeof(r) {
    return i18n_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, i18n_typeof(r);
  }
  function i18n_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function i18n_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, i18n_toPropertyKey(l.key), l);
    }
  }
  function i18n_createClass(r, o, a) {
    return o && i18n_defineProperties(r.prototype, o), a && i18n_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function i18n_defineProperty(r, o, a) {
    return (o = i18n_toPropertyKey(o)) in r ? Object.defineProperty(r, o, {
      "value": a,
      "enumerable": !0,
      "configurable": !0,
      "writable": !0
    }) : r[o] = a, r;
  }
  function i18n_toPropertyKey(r) {
    var o = i18n_toPrimitive(r, "string");
    return "symbol" == i18n_typeof(o) ? o : o + "";
  }
  function i18n_toPrimitive(r, o) {
    if ("object" != i18n_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != i18n_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var D = function() {
    function I18n() {
      i18n_classCallCheck(this, I18n);
    }
    return i18n_createClass(I18n, null, [ {
      "key": "userLang",
      "get": function get() {
        return navigator.languages && navigator.languages[0] || navigator.language || "en";
      }
    }, {
      "key": "translate",
      "value": function translate(r) {
        var o;
        var a = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "") || this.userLang;
        return (this.strings[a] || this.strings.en)[r] || this.strings.en[r];
      }
    } ]);
  }();
  i18n_defineProperty(D, "strings", {
    "en": {
      "accountNull": "Error: Email or password is empty.",
      "loginSuccess": "Login successful, refreshing the page.",
      "networkFailed": "Status code error.",
      "loginFailed": "Login failed, incorrect email or password. Check console for error details.",
      "autoLogin": "Auto Login"
    },
    "zh-CN": {
      "accountNull": "邮箱或密码为空",
      "loginSuccess": "登录成功，即将刷新页面。",
      "networkFailed": "状态码错误",
      "loginFailed": "登录失败，邮箱或密码错误，可以在控制台查看错误信息。",
      "autoLogin": "自动登录"
    },
    "zh-TW": {
      "accountNull": "郵箱或密碼為空",
      "loginSuccess": "登錄成功，即將刷新頁面。",
      "networkFailed": "狀態碼錯誤",
      "loginFailed": "登錄失敗，郵箱或密碼錯誤，可以在控制台查看錯誤信息。",
      "autoLogin": "自動登錄"
    },
    "ja": {
      "accountNull": "エラー：メールアドレスまたはパスワードが空です。",
      "loginSuccess": "ログイン成功、ページを更新します。",
      "networkFailed": "ステータスコードエラー",
      "loginFailed": "ログインに失敗しました。メールアドレスまたはパスワードが間違っています。エラーの詳細はコンソールで確認できます。",
      "autoLogin": "自動ログイン"
    },
    "vi": {
      "accountNull": "Lỗi: Email hoặc mật khẩu trống.",
      "loginSuccess": "Đăng nhập thành công, đang làm mới trang.",
      "networkFailed": "Lỗi mã trạng thái.",
      "loginFailed": "Đăng nhập không thành công, email hoặc mật khẩu không chính xác. Xem chi tiết lỗi trên bảng điều khiển.",
      "autoLogin": "Đăng nhập tự động"
    }
  });
  function MissavLoginProvider_typeof(r) {
    return MissavLoginProvider_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, MissavLoginProvider_typeof(r);
  }
  function _regeneratorRuntime() {
    _regeneratorRuntime = function _regeneratorRuntime() {
      return o;
    };
    var r, o = {}, a = Object.prototype, l = a.hasOwnProperty, u = "function" == typeof Symbol ? Symbol : {}, p = u.iterator || "@@iterator", v = u.asyncIterator || "@@asyncIterator", y = u.toStringTag || "@@toStringTag";
    function c(r, o, a, l) {
      return Object.defineProperty(r, o, {
        "value": a,
        "enumerable": !l,
        "configurable": !l,
        "writable": !l
      });
    }
    try {
      c({}, "");
    } catch (r) {
      c = function c(r, o, a) {
        return r[o] = a;
      };
    }
    function h(o, a, l, u) {
      var p = a && a.prototype instanceof Generator ? a : Generator, v = Object.create(p.prototype);
      return c(v, "_invoke", function(o, a, l) {
        var u = 1;
        return function(p, v) {
          if (3 === u) {
            throw Error("Generator is already running");
          }
          if (4 === u) {
            if ("throw" === p) {
              throw v;
            }
            return {
              "value": r,
              "done": !0
            };
          }
          for (l.method = p, l.arg = v; ;) {
            var y = l.delegate;
            if (y) {
              var k = d(y, l);
              if (k) {
                if (k === b) {
                  continue;
                }
                return k;
              }
            }
            if ("next" === l.method) {
              l.sent = l._sent = l.arg;
            } else if ("throw" === l.method) {
              if (1 === u) {
                throw u = 4, l.arg;
              }
              l.dispatchException(l.arg);
            } else {
              "return" === l.method && l.abrupt("return", l.arg);
            }
            u = 3;
            var C = s(o, a, l);
            if ("normal" === C.type) {
              if (u = l.done ? 4 : 2, C.arg === b) {
                continue;
              }
              return {
                "value": C.arg,
                "done": l.done
              };
            }
            "throw" === C.type && (u = 4, l.method = "throw", l.arg = C.arg);
          }
        };
      }(o, l, new Context(u || [])), !0), v;
    }
    function s(r, o, a) {
      try {
        return {
          "type": "normal",
          "arg": r.call(o, a)
        };
      } catch (r) {
        return {
          "type": "throw",
          "arg": r
        };
      }
    }
    o.wrap = h;
    var b = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var k = {};
    c(k, p, (function() {
      return this;
    }));
    var C = Object.getPrototypeOf, _ = C && C(C(x([])));
    _ && _ !== a && l.call(_, p) && (k = _);
    var P = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(k);
    function g(r) {
      [ "next", "throw", "return" ].forEach((function(o) {
        c(r, o, (function(r) {
          return this._invoke(o, r);
        }));
      }));
    }
    function AsyncIterator(r, o) {
      function e(a, u, p, v) {
        var y = s(r[a], r, u);
        if ("throw" !== y.type) {
          var b = y.arg, k = b.value;
          return k && "object" == MissavLoginProvider_typeof(k) && l.call(k, "__await") ? o.resolve(k.__await).then((function(r) {
            e("next", r, p, v);
          }), (function(r) {
            e("throw", r, p, v);
          })) : o.resolve(k).then((function(r) {
            b.value = r, p(b);
          }), (function(r) {
            return e("throw", r, p, v);
          }));
        }
        v(y.arg);
      }
      var a;
      c(this, "_invoke", (function(r, l) {
        function i() {
          return new o((function(o, a) {
            e(r, l, o, a);
          }));
        }
        return a = a ? a.then(i, i) : i();
      }), !0);
    }
    function d(o, a) {
      var l = a.method, u = o.i[l];
      if (u === r) {
        return a.delegate = null, "throw" === l && o.i["return"] && (a.method = "return", 
        a.arg = r, d(o, a), "throw" === a.method) || "return" !== l && (a.method = "throw", 
        a.arg = new TypeError("The iterator does not provide a '" + l + "' method")), b;
      }
      var p = s(u, o.i, a.arg);
      if ("throw" === p.type) {
        return a.method = "throw", a.arg = p.arg, a.delegate = null, b;
      }
      var v = p.arg;
      return v ? v.done ? (a[o.r] = v.value, a.next = o.n, "return" !== a.method && (a.method = "next", 
      a.arg = r), a.delegate = null, b) : v : (a.method = "throw", a.arg = new TypeError("iterator result is not an object"), 
      a.delegate = null, b);
    }
    function w(r) {
      this.tryEntries.push(r);
    }
    function m(o) {
      var a = o[4] || {};
      a.type = "normal", a.arg = r, o[4] = a;
    }
    function Context(r) {
      this.tryEntries = [ [ -1 ] ], r.forEach(w, this), this.reset(!0);
    }
    function x(o) {
      if (null != o) {
        var a = o[p];
        if (a) {
          return a.call(o);
        }
        if ("function" == typeof o.next) {
          return o;
        }
        if (!isNaN(o.length)) {
          var u = -1, v = function e() {
            for (;++u < o.length; ) {
              if (l.call(o, u)) {
                return e.value = o[u], e.done = !1, e;
              }
            }
            return e.value = r, e.done = !0, e;
          };
          return v.next = v;
        }
      }
      throw new TypeError(MissavLoginProvider_typeof(o) + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(P, "constructor", GeneratorFunctionPrototype), 
    c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, y, "GeneratorFunction"), 
    o.isGeneratorFunction = function(r) {
      var o = "function" == typeof r && r.constructor;
      return !!o && (o === GeneratorFunction || "GeneratorFunction" === (o.displayName || o.name));
    }, o.mark = function(r) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(r, GeneratorFunctionPrototype) : (r.__proto__ = GeneratorFunctionPrototype, 
      c(r, y, "GeneratorFunction")), r.prototype = Object.create(P), r;
    }, o.awrap = function(r) {
      return {
        "__await": r
      };
    }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, v, (function() {
      return this;
    })), o.AsyncIterator = AsyncIterator, o.async = function(r, a, l, u, p) {
      void 0 === p && (p = Promise);
      var v = new AsyncIterator(h(r, a, l, u), p);
      return o.isGeneratorFunction(a) ? v : v.next().then((function(r) {
        return r.done ? r.value : v.next();
      }));
    }, g(P), c(P, y, "Generator"), c(P, p, (function() {
      return this;
    })), c(P, "toString", (function() {
      return "[object Generator]";
    })), o.keys = function(r) {
      var o = Object(r), a = [];
      for (var l in o) {
        a.unshift(l);
      }
      return function t() {
        for (;a.length; ) {
          if ((l = a.pop()) in o) {
            return t.value = l, t.done = !1, t;
          }
        }
        return t.done = !0, t;
      };
    }, o.values = x, Context.prototype = {
      "constructor": Context,
      "reset": function reset(o) {
        if (this.prev = this.next = 0, this.sent = this._sent = r, this.done = !1, this.delegate = null, 
        this.method = "next", this.arg = r, this.tryEntries.forEach(m), !o) {
          for (var a in this) {
            "t" === a.charAt(0) && l.call(this, a) && !isNaN(+a.slice(1)) && (this[a] = r);
          }
        }
      },
      "stop": function stop() {
        this.done = !0;
        var r = this.tryEntries[0][4];
        if ("throw" === r.type) {
          throw r.arg;
        }
        return this.rval;
      },
      "dispatchException": function dispatchException(o) {
        if (this.done) {
          throw o;
        }
        var a = this;
        function n(r) {
          p.type = "throw", p.arg = o, a.next = r;
        }
        for (var l = a.tryEntries.length - 1; l >= 0; --l) {
          var u = this.tryEntries[l], p = u[4], v = this.prev, y = u[1], b = u[2];
          if (-1 === u[0]) {
            return n("end"), !1;
          }
          if (!y && !b) {
            throw Error("try statement without catch or finally");
          }
          if (null != u[0] && u[0] <= v) {
            if (v < y) {
              return this.method = "next", this.arg = r, n(y), !0;
            }
            if (v < b) {
              return n(b), !1;
            }
          }
        }
      },
      "abrupt": function abrupt(r, o) {
        for (var a = this.tryEntries.length - 1; a >= 0; --a) {
          var l = this.tryEntries[a];
          if (l[0] > -1 && l[0] <= this.prev && this.prev < l[2]) {
            var u = l;
            break;
          }
        }
        u && ("break" === r || "continue" === r) && u[0] <= o && o <= u[2] && (u = null);
        var p = u ? u[4] : {};
        return p.type = r, p.arg = o, u ? (this.method = "next", this.next = u[2], b) : this.complete(p);
      },
      "complete": function complete(r, o) {
        if ("throw" === r.type) {
          throw r.arg;
        }
        return "break" === r.type || "continue" === r.type ? this.next = r.arg : "return" === r.type ? (this.rval = this.arg = r.arg, 
        this.method = "return", this.next = "end") : "normal" === r.type && o && (this.next = o), 
        b;
      },
      "finish": function finish(r) {
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var a = this.tryEntries[o];
          if (a[2] === r) {
            return this.complete(a[4], a[3]), m(a), b;
          }
        }
      },
      "catch": function _catch(r) {
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var a = this.tryEntries[o];
          if (a[0] === r) {
            var l = a[4];
            if ("throw" === l.type) {
              var u = l.arg;
              m(a);
            }
            return u;
          }
        }
        throw Error("illegal catch attempt");
      },
      "delegateYield": function delegateYield(o, a, l) {
        return this.delegate = {
          "i": x(o),
          "r": a,
          "n": l
        }, "next" === this.method && (this.arg = r), b;
      }
    }, o;
  }
  function asyncGeneratorStep(r, o, a, l, u, p, v) {
    try {
      var y = r[p](v), b = y.value;
    } catch (r) {
      return void a(r);
    }
    y.done ? o(b) : Promise.resolve(b).then(l, u);
  }
  function _asyncToGenerator(r) {
    return function() {
      var o = this, a = arguments;
      return new Promise((function(l, u) {
        var p = r.apply(o, a);
        function _next(r) {
          asyncGeneratorStep(p, l, u, _next, _throw, "next", r);
        }
        function _throw(r) {
          asyncGeneratorStep(p, l, u, _next, _throw, "throw", r);
        }
        _next(void 0);
      }));
    };
  }
  function MissavLoginProvider_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function MissavLoginProvider_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, MissavLoginProvider_toPropertyKey(l.key), l);
    }
  }
  function MissavLoginProvider_createClass(r, o, a) {
    return o && MissavLoginProvider_defineProperties(r.prototype, o), a && MissavLoginProvider_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function MissavLoginProvider_toPropertyKey(r) {
    var o = MissavLoginProvider_toPrimitive(r, "string");
    return "symbol" == MissavLoginProvider_typeof(o) ? o : o + "";
  }
  function MissavLoginProvider_toPrimitive(r, o) {
    if ("object" != MissavLoginProvider_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != MissavLoginProvider_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var A = function() {
    function MissavLoginProvider() {
      MissavLoginProvider_classCallCheck(this, MissavLoginProvider);
      this.domains = [ "missav.ws", "missav.ai", "missav.com", "thisav.com" ];
    }
    return MissavLoginProvider_createClass(MissavLoginProvider, [ {
      "key": "isSupportedSite",
      "value": function isSupportedSite() {
        var r = window.location.hostname;
        return this.domains.some((function(o) {
          return r.includes(o);
        }));
      }
    }, {
      "key": "login",
      "value": function() {
        var r = _asyncToGenerator(_regeneratorRuntime().mark((function _callee(r, o) {
          var a, l, u, p, v;
          return _regeneratorRuntime().wrap((function _callee$(y) {
            while (1) {
              switch (y.prev = y.next) {
               case 0:
                if (!(!r || !o)) {
                  y.next = 3;
                  break;
                }
                I.toast(D.translate("accountNull"), 2e3, "#FF0000", "#ffffff", "top");
                return y.abrupt("return", false);

               case 3:
                y.prev = 3;
                y.next = 6;
                return fetch("https://missav.ws/cn/api/login", {
                  "method": "POST",
                  "headers": {
                    "Content-Type": "application/json"
                  },
                  "body": JSON.stringify({
                    "email": r,
                    "password": o,
                    "remember": true
                  })
                });

               case 6:
                if ((l = y.sent).ok) {
                  y.next = 13;
                  break;
                }
                y.next = 10;
                return l.text();

               case 10:
                u = y.sent;
                I.toast("登录失败: ".concat(u), 2e3, "#FF0000", "#ffffff", "top");
                throw new Error(D.translate("networkFailed"));

               case 13:
                if (!(null !== (a = l.headers.get("Content-Type")) && void 0 !== a && a.includes("application/json"))) {
                  y.next = 19;
                  break;
                }
                y.next = 16;
                return l.json();

               case 16:
                p = y.sent;
                y.next = 24;
                break;

               case 19:
                y.next = 21;
                return l.text();

               case 21:
                v = y.sent;
                I.toast(D.translate("loginFailed"), 2e3, "#FF0000", "#ffffff", "top");
                throw new Error(D.translate("loginFailed"));

               case 24:
                I.toast(D.translate("loginSuccess"), 2e3, "rgb(18, 187, 2)", "#ffffff", "top");
                setTimeout((function() {
                  location.reload();
                }), 1e3);
                return y.abrupt("return", true);

               case 29:
                y.prev = 29;
                y.t0 = y["catch"](3);
                I.toast("错误发生: ".concat(y.t0.message), 2e3, "#FF0000", "#ffffff", "top");
                return y.abrupt("return", false);

               case 33:
               case "end":
                return y.stop();
              }
            }
          }), _callee, null, [ [ 3, 29 ] ]);
        })));
        function login(o, a) {
          return r.apply(this, arguments);
        }
        return login;
      }()
    }, {
      "key": "checkLoginStatus",
      "value": function() {
        var r = _asyncToGenerator(_regeneratorRuntime().mark((function _callee2() {
          var r;
          return _regeneratorRuntime().wrap((function _callee2$(o) {
            while (1) {
              switch (o.prev = o.next) {
               case 0:
                o.prev = 0;
                o.next = 3;
                return this.checkLoginByAPI();

               case 3:
                if (!(null !== (r = o.sent))) {
                  o.next = 6;
                  break;
                }
                return o.abrupt("return", r);

               case 6:
                return o.abrupt("return", this.checkLoginByDOM());

               case 9:
                o.prev = 9;
                o.t0 = o["catch"](0);
                return o.abrupt("return", false);

               case 12:
               case "end":
                return o.stop();
              }
            }
          }), _callee2, this, [ [ 0, 9 ] ]);
        })));
        function checkLoginStatus() {
          return r.apply(this, arguments);
        }
        return checkLoginStatus;
      }()
    }, {
      "key": "checkLoginByAPI",
      "value": function() {
        var r = _asyncToGenerator(_regeneratorRuntime().mark((function _callee3() {
          var r, o, a;
          return _regeneratorRuntime().wrap((function _callee3$(l) {
            while (1) {
              switch (l.prev = l.next) {
               case 0:
                l.prev = 0;
                r = "https://missav.ws/api/actresses/1016525/view";
                l.next = 4;
                return fetch(r, {
                  "method": "GET",
                  "credentials": "include"
                });

               case 4:
                if ((o = l.sent).ok) {
                  l.next = 7;
                  break;
                }
                return l.abrupt("return", null);

               case 7:
                l.next = 9;
                return o.json();

               case 9:
                a = l.sent;
                return l.abrupt("return", null !== a.user);

               case 13:
                l.prev = 13;
                l.t0 = l["catch"](0);
                return l.abrupt("return", null);

               case 16:
               case "end":
                return l.stop();
              }
            }
          }), _callee3, null, [ [ 0, 13 ] ]);
        })));
        function checkLoginByAPI() {
          return r.apply(this, arguments);
        }
        return checkLoginByAPI;
      }()
    }, {
      "key": "checkLoginByDOM",
      "value": function checkLoginByDOM() {
        try {
          var r = document.querySelector("button[x-on\\:click=\"currentPage = 'login'\"]");
          var o = document.querySelector(".relative.ml-3 img.h-8.w-8.rounded-full");
          var a = document.querySelector('[x-data="{userDropdownOpen: false}"]');
          return !r || o || a;
        } catch (r) {
          return false;
        }
      }
    }, {
      "key": "addAutoLoginOption",
      "value": function() {
        var r = _asyncToGenerator(_regeneratorRuntime().mark((function _callee4(r) {
          var o, a, l, u, p, v;
          return _regeneratorRuntime().wrap((function _callee4$(y) {
            while (1) {
              switch (y.prev = y.next) {
               case 0:
                y.prev = 0;
                y.next = 3;
                return I.waitForElement("form[x-show=\"currentPage === 'login'\"] .relative.flex.items-start.justify-between");

               case 3:
                o = y.sent;
                (a = document.createElement("div")).className = "flex";
                a.innerHTML = '\n                <div class="flex items-center h-5">\n                    <input id="auto_login" type="checkbox" class="focus:ring-primary h-4 w-4 text-primary border-gray-300 rounded __text_mode_custom_bg__">\n                </div>\n                <div class="ml-3 text-sm">\n                    <label for="auto_login" class="font-medium text-nord4">'.concat(D.translate("autoLogin"), "</label>\n                </div>\n            ");
                (l = o.querySelector(".flex")).parentNode.insertBefore(a, l.nextSibling);
                u = I.getValue("autoLogin", true);
                document.getElementById("auto_login").checked = u;
                document.getElementById("auto_login").addEventListener("change", (function() {
                  var o = document.getElementById("auto_login").checked;
                  I.setValue("autoLogin", o);
                  if (r) {
                    r({
                      "autoLogin": o
                    });
                  }
                }));
                if (p = document.querySelector("form[x-show=\"currentPage === 'login'\"]")) {
                  if (v = p.querySelector('button[type="submit"]')) {
                    v.addEventListener("click", (function() {
                      setTimeout((function() {
                        var o = document.getElementById("login_email");
                        var a = document.getElementById("login_password");
                        var l = document.getElementById("auto_login");
                        if (o && a && l && l.checked) {
                          var u = o.value;
                          var p = a.value;
                          I.setValue("userEmail", u);
                          I.setValue("userPassword", p);
                          if (r) {
                            r({
                              "email": u,
                              "password": p,
                              "autoLogin": true
                            });
                          }
                        }
                      }), 100);
                    }));
                  }
                }
                y.next = 18;
                break;

               case 16:
                y.prev = 16;
                y.t0 = y["catch"](0);

               case 18:
               case "end":
                return y.stop();
              }
            }
          }), _callee4, null, [ [ 0, 16 ] ]);
        })));
        function addAutoLoginOption(o) {
          return r.apply(this, arguments);
        }
        return addAutoLoginOption;
      }()
    } ]);
  }();
  function LoginManager_typeof(r) {
    return LoginManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, LoginManager_typeof(r);
  }
  function LoginManager_createForOfIteratorHelper(r, o) {
    var a = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!a) {
      if (Array.isArray(r) || (a = LoginManager_unsupportedIterableToArray(r)) || o && r && "number" == typeof r.length) {
        a && (r = a);
        var l = 0, u = function F() {};
        return {
          "s": u,
          "n": function n() {
            return l >= r.length ? {
              "done": !0
            } : {
              "done": !1,
              "value": r[l++]
            };
          },
          "e": function e(r) {
            throw r;
          },
          "f": u
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var p, v = !0, y = !1;
    return {
      "s": function s() {
        a = a.call(r);
      },
      "n": function n() {
        var r = a.next();
        return v = r.done, r;
      },
      "e": function e(r) {
        y = !0, p = r;
      },
      "f": function f() {
        try {
          v || null == a["return"] || a["return"]();
        } finally {
          if (y) {
            throw p;
          }
        }
      }
    };
  }
  function LoginManager_unsupportedIterableToArray(r, o) {
    if (r) {
      if ("string" == typeof r) {
        return LoginManager_arrayLikeToArray(r, o);
      }
      var a = {}.toString.call(r).slice(8, -1);
      return "Object" === a && r.constructor && (a = r.constructor.name), "Map" === a || "Set" === a ? Array.from(r) : "Arguments" === a || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a) ? LoginManager_arrayLikeToArray(r, o) : void 0;
    }
  }
  function LoginManager_arrayLikeToArray(r, o) {
    (null == o || o > r.length) && (o = r.length);
    for (var a = 0, l = Array(o); a < o; a++) {
      l[a] = r[a];
    }
    return l;
  }
  function LoginManager_regeneratorRuntime() {
    LoginManager_regeneratorRuntime = function _regeneratorRuntime() {
      return o;
    };
    var r, o = {}, a = Object.prototype, l = a.hasOwnProperty, u = "function" == typeof Symbol ? Symbol : {}, p = u.iterator || "@@iterator", v = u.asyncIterator || "@@asyncIterator", y = u.toStringTag || "@@toStringTag";
    function c(r, o, a, l) {
      return Object.defineProperty(r, o, {
        "value": a,
        "enumerable": !l,
        "configurable": !l,
        "writable": !l
      });
    }
    try {
      c({}, "");
    } catch (r) {
      c = function c(r, o, a) {
        return r[o] = a;
      };
    }
    function h(o, a, l, u) {
      var p = a && a.prototype instanceof Generator ? a : Generator, v = Object.create(p.prototype);
      return c(v, "_invoke", function(o, a, l) {
        var u = 1;
        return function(p, v) {
          if (3 === u) {
            throw Error("Generator is already running");
          }
          if (4 === u) {
            if ("throw" === p) {
              throw v;
            }
            return {
              "value": r,
              "done": !0
            };
          }
          for (l.method = p, l.arg = v; ;) {
            var y = l.delegate;
            if (y) {
              var k = d(y, l);
              if (k) {
                if (k === b) {
                  continue;
                }
                return k;
              }
            }
            if ("next" === l.method) {
              l.sent = l._sent = l.arg;
            } else if ("throw" === l.method) {
              if (1 === u) {
                throw u = 4, l.arg;
              }
              l.dispatchException(l.arg);
            } else {
              "return" === l.method && l.abrupt("return", l.arg);
            }
            u = 3;
            var C = s(o, a, l);
            if ("normal" === C.type) {
              if (u = l.done ? 4 : 2, C.arg === b) {
                continue;
              }
              return {
                "value": C.arg,
                "done": l.done
              };
            }
            "throw" === C.type && (u = 4, l.method = "throw", l.arg = C.arg);
          }
        };
      }(o, l, new Context(u || [])), !0), v;
    }
    function s(r, o, a) {
      try {
        return {
          "type": "normal",
          "arg": r.call(o, a)
        };
      } catch (r) {
        return {
          "type": "throw",
          "arg": r
        };
      }
    }
    o.wrap = h;
    var b = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var k = {};
    c(k, p, (function() {
      return this;
    }));
    var C = Object.getPrototypeOf, _ = C && C(C(x([])));
    _ && _ !== a && l.call(_, p) && (k = _);
    var P = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(k);
    function g(r) {
      [ "next", "throw", "return" ].forEach((function(o) {
        c(r, o, (function(r) {
          return this._invoke(o, r);
        }));
      }));
    }
    function AsyncIterator(r, o) {
      function e(a, u, p, v) {
        var y = s(r[a], r, u);
        if ("throw" !== y.type) {
          var b = y.arg, k = b.value;
          return k && "object" == LoginManager_typeof(k) && l.call(k, "__await") ? o.resolve(k.__await).then((function(r) {
            e("next", r, p, v);
          }), (function(r) {
            e("throw", r, p, v);
          })) : o.resolve(k).then((function(r) {
            b.value = r, p(b);
          }), (function(r) {
            return e("throw", r, p, v);
          }));
        }
        v(y.arg);
      }
      var a;
      c(this, "_invoke", (function(r, l) {
        function i() {
          return new o((function(o, a) {
            e(r, l, o, a);
          }));
        }
        return a = a ? a.then(i, i) : i();
      }), !0);
    }
    function d(o, a) {
      var l = a.method, u = o.i[l];
      if (u === r) {
        return a.delegate = null, "throw" === l && o.i["return"] && (a.method = "return", 
        a.arg = r, d(o, a), "throw" === a.method) || "return" !== l && (a.method = "throw", 
        a.arg = new TypeError("The iterator does not provide a '" + l + "' method")), b;
      }
      var p = s(u, o.i, a.arg);
      if ("throw" === p.type) {
        return a.method = "throw", a.arg = p.arg, a.delegate = null, b;
      }
      var v = p.arg;
      return v ? v.done ? (a[o.r] = v.value, a.next = o.n, "return" !== a.method && (a.method = "next", 
      a.arg = r), a.delegate = null, b) : v : (a.method = "throw", a.arg = new TypeError("iterator result is not an object"), 
      a.delegate = null, b);
    }
    function w(r) {
      this.tryEntries.push(r);
    }
    function m(o) {
      var a = o[4] || {};
      a.type = "normal", a.arg = r, o[4] = a;
    }
    function Context(r) {
      this.tryEntries = [ [ -1 ] ], r.forEach(w, this), this.reset(!0);
    }
    function x(o) {
      if (null != o) {
        var a = o[p];
        if (a) {
          return a.call(o);
        }
        if ("function" == typeof o.next) {
          return o;
        }
        if (!isNaN(o.length)) {
          var u = -1, v = function e() {
            for (;++u < o.length; ) {
              if (l.call(o, u)) {
                return e.value = o[u], e.done = !1, e;
              }
            }
            return e.value = r, e.done = !0, e;
          };
          return v.next = v;
        }
      }
      throw new TypeError(LoginManager_typeof(o) + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(P, "constructor", GeneratorFunctionPrototype), 
    c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, y, "GeneratorFunction"), 
    o.isGeneratorFunction = function(r) {
      var o = "function" == typeof r && r.constructor;
      return !!o && (o === GeneratorFunction || "GeneratorFunction" === (o.displayName || o.name));
    }, o.mark = function(r) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(r, GeneratorFunctionPrototype) : (r.__proto__ = GeneratorFunctionPrototype, 
      c(r, y, "GeneratorFunction")), r.prototype = Object.create(P), r;
    }, o.awrap = function(r) {
      return {
        "__await": r
      };
    }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, v, (function() {
      return this;
    })), o.AsyncIterator = AsyncIterator, o.async = function(r, a, l, u, p) {
      void 0 === p && (p = Promise);
      var v = new AsyncIterator(h(r, a, l, u), p);
      return o.isGeneratorFunction(a) ? v : v.next().then((function(r) {
        return r.done ? r.value : v.next();
      }));
    }, g(P), c(P, y, "Generator"), c(P, p, (function() {
      return this;
    })), c(P, "toString", (function() {
      return "[object Generator]";
    })), o.keys = function(r) {
      var o = Object(r), a = [];
      for (var l in o) {
        a.unshift(l);
      }
      return function t() {
        for (;a.length; ) {
          if ((l = a.pop()) in o) {
            return t.value = l, t.done = !1, t;
          }
        }
        return t.done = !0, t;
      };
    }, o.values = x, Context.prototype = {
      "constructor": Context,
      "reset": function reset(o) {
        if (this.prev = this.next = 0, this.sent = this._sent = r, this.done = !1, this.delegate = null, 
        this.method = "next", this.arg = r, this.tryEntries.forEach(m), !o) {
          for (var a in this) {
            "t" === a.charAt(0) && l.call(this, a) && !isNaN(+a.slice(1)) && (this[a] = r);
          }
        }
      },
      "stop": function stop() {
        this.done = !0;
        var r = this.tryEntries[0][4];
        if ("throw" === r.type) {
          throw r.arg;
        }
        return this.rval;
      },
      "dispatchException": function dispatchException(o) {
        if (this.done) {
          throw o;
        }
        var a = this;
        function n(r) {
          p.type = "throw", p.arg = o, a.next = r;
        }
        for (var l = a.tryEntries.length - 1; l >= 0; --l) {
          var u = this.tryEntries[l], p = u[4], v = this.prev, y = u[1], b = u[2];
          if (-1 === u[0]) {
            return n("end"), !1;
          }
          if (!y && !b) {
            throw Error("try statement without catch or finally");
          }
          if (null != u[0] && u[0] <= v) {
            if (v < y) {
              return this.method = "next", this.arg = r, n(y), !0;
            }
            if (v < b) {
              return n(b), !1;
            }
          }
        }
      },
      "abrupt": function abrupt(r, o) {
        for (var a = this.tryEntries.length - 1; a >= 0; --a) {
          var l = this.tryEntries[a];
          if (l[0] > -1 && l[0] <= this.prev && this.prev < l[2]) {
            var u = l;
            break;
          }
        }
        u && ("break" === r || "continue" === r) && u[0] <= o && o <= u[2] && (u = null);
        var p = u ? u[4] : {};
        return p.type = r, p.arg = o, u ? (this.method = "next", this.next = u[2], b) : this.complete(p);
      },
      "complete": function complete(r, o) {
        if ("throw" === r.type) {
          throw r.arg;
        }
        return "break" === r.type || "continue" === r.type ? this.next = r.arg : "return" === r.type ? (this.rval = this.arg = r.arg, 
        this.method = "return", this.next = "end") : "normal" === r.type && o && (this.next = o), 
        b;
      },
      "finish": function finish(r) {
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var a = this.tryEntries[o];
          if (a[2] === r) {
            return this.complete(a[4], a[3]), m(a), b;
          }
        }
      },
      "catch": function _catch(r) {
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var a = this.tryEntries[o];
          if (a[0] === r) {
            var l = a[4];
            if ("throw" === l.type) {
              var u = l.arg;
              m(a);
            }
            return u;
          }
        }
        throw Error("illegal catch attempt");
      },
      "delegateYield": function delegateYield(o, a, l) {
        return this.delegate = {
          "i": x(o),
          "r": a,
          "n": l
        }, "next" === this.method && (this.arg = r), b;
      }
    }, o;
  }
  function LoginManager_asyncGeneratorStep(r, o, a, l, u, p, v) {
    try {
      var y = r[p](v), b = y.value;
    } catch (r) {
      return void a(r);
    }
    y.done ? o(b) : Promise.resolve(b).then(l, u);
  }
  function LoginManager_asyncToGenerator(r) {
    return function() {
      var o = this, a = arguments;
      return new Promise((function(l, u) {
        var p = r.apply(o, a);
        function _next(r) {
          LoginManager_asyncGeneratorStep(p, l, u, _next, _throw, "next", r);
        }
        function _throw(r) {
          LoginManager_asyncGeneratorStep(p, l, u, _next, _throw, "throw", r);
        }
        _next(void 0);
      }));
    };
  }
  function LoginManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function LoginManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, LoginManager_toPropertyKey(l.key), l);
    }
  }
  function LoginManager_createClass(r, o, a) {
    return o && LoginManager_defineProperties(r.prototype, o), a && LoginManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function LoginManager_toPropertyKey(r) {
    var o = LoginManager_toPrimitive(r, "string");
    return "symbol" == LoginManager_typeof(o) ? o : o + "";
  }
  function LoginManager_toPrimitive(r, o) {
    if ("object" != LoginManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != LoginManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var O = function() {
    function LoginManager() {
      LoginManager_classCallCheck(this, LoginManager);
      this.userEmail = "";
      this.userPassword = "";
      this.autoLogin = true;
      this.providers = [ new A ];
      this.activeProvider = null;
    }
    return LoginManager_createClass(LoginManager, [ {
      "key": "init",
      "value": function() {
        var r = LoginManager_asyncToGenerator(LoginManager_regeneratorRuntime().mark((function _callee() {
          return LoginManager_regeneratorRuntime().wrap((function _callee$(r) {
            while (1) {
              switch (r.prev = r.next) {
               case 0:
                this.loadLoginInfo();
                this.activeProvider = this.getMatchingProvider();
                if (this.activeProvider) {
                  r.next = 4;
                  break;
                }
                return r.abrupt("return");

               case 4:
                r.next = 6;
                return this.activeProvider.addAutoLoginOption(this.handleLoginInfoChange.bind(this));

               case 6:
                r.next = 8;
                return this.checkLoginAndAutoLogin();

               case 8:
               case "end":
                return r.stop();
              }
            }
          }), _callee, this);
        })));
        function init() {
          return r.apply(this, arguments);
        }
        return init;
      }()
    }, {
      "key": "handleLoginInfoChange",
      "value": function handleLoginInfoChange(r) {
        if (void 0 !== r.email) {
          this.userEmail = r.email;
          I.setValue("userEmail", r.email);
        }
        if (void 0 !== r.password) {
          this.userPassword = r.password;
          I.setValue("userPassword", r.password);
        }
        if (void 0 !== r.autoLogin) {
          this.autoLogin = r.autoLogin;
          I.setValue("autoLogin", r.autoLogin);
        }
      }
    }, {
      "key": "loadLoginInfo",
      "value": function loadLoginInfo() {
        this.userEmail = I.getValue("userEmail", "");
        this.userPassword = I.getValue("userPassword", "");
        this.autoLogin = I.getValue("autoLogin", true);
      }
    }, {
      "key": "getMatchingProvider",
      "value": function getMatchingProvider() {
        var r = LoginManager_createForOfIteratorHelper(this.providers), o;
        try {
          for (r.s(); !(o = r.n()).done; ) {
            var a = o.value;
            if (a.isSupportedSite()) {
              return a;
            }
          }
        } catch (o) {
          r.e(o);
        } finally {
          r.f();
        }
        return null;
      }
    }, {
      "key": "checkLoginAndAutoLogin",
      "value": function() {
        var r = LoginManager_asyncToGenerator(LoginManager_regeneratorRuntime().mark((function _callee2() {
          var r;
          return LoginManager_regeneratorRuntime().wrap((function _callee2$(o) {
            while (1) {
              switch (o.prev = o.next) {
               case 0:
                if (this.activeProvider) {
                  o.next = 2;
                  break;
                }
                return o.abrupt("return");

               case 2:
                o.prev = 2;
                o.next = 5;
                return this.activeProvider.checkLoginStatus();

               case 5:
                if (!(!(r = o.sent) && this.autoLogin && this.userEmail && this.userPassword)) {
                  o.next = 9;
                  break;
                }
                o.next = 9;
                return this.activeProvider.login(this.userEmail, this.userPassword);

               case 9:
                o.next = 13;
                break;

               case 11:
                o.prev = 11;
                o.t0 = o["catch"](2);

               case 13:
               case "end":
                return o.stop();
              }
            }
          }), _callee2, this, [ [ 2, 11 ] ]);
        })));
        function checkLoginAndAutoLogin() {
          return r.apply(this, arguments);
        }
        return checkLoginAndAutoLogin;
      }()
    }, {
      "key": "login",
      "value": function() {
        var r = LoginManager_asyncToGenerator(LoginManager_regeneratorRuntime().mark((function _callee3(r, o) {
          return LoginManager_regeneratorRuntime().wrap((function _callee3$(a) {
            while (1) {
              switch (a.prev = a.next) {
               case 0:
                if (this.activeProvider) {
                  a.next = 2;
                  break;
                }
                return a.abrupt("return", false);

               case 2:
                this.handleLoginInfoChange({
                  "email": r,
                  "password": o
                });
                a.next = 5;
                return this.activeProvider.login(r, o);

               case 5:
                return a.abrupt("return", a.sent);

               case 6:
               case "end":
                return a.stop();
              }
            }
          }), _callee3, this);
        })));
        function login(o, a) {
          return r.apply(this, arguments);
        }
        return login;
      }()
    } ]);
  }();
  function autologin_typeof(r) {
    return autologin_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, autologin_typeof(r);
  }
  function autologin_regeneratorRuntime() {
    autologin_regeneratorRuntime = function _regeneratorRuntime() {
      return o;
    };
    var r, o = {}, a = Object.prototype, l = a.hasOwnProperty, u = "function" == typeof Symbol ? Symbol : {}, p = u.iterator || "@@iterator", v = u.asyncIterator || "@@asyncIterator", y = u.toStringTag || "@@toStringTag";
    function c(r, o, a, l) {
      return Object.defineProperty(r, o, {
        "value": a,
        "enumerable": !l,
        "configurable": !l,
        "writable": !l
      });
    }
    try {
      c({}, "");
    } catch (r) {
      c = function c(r, o, a) {
        return r[o] = a;
      };
    }
    function h(o, a, l, u) {
      var p = a && a.prototype instanceof Generator ? a : Generator, v = Object.create(p.prototype);
      return c(v, "_invoke", function(o, a, l) {
        var u = 1;
        return function(p, v) {
          if (3 === u) {
            throw Error("Generator is already running");
          }
          if (4 === u) {
            if ("throw" === p) {
              throw v;
            }
            return {
              "value": r,
              "done": !0
            };
          }
          for (l.method = p, l.arg = v; ;) {
            var y = l.delegate;
            if (y) {
              var k = d(y, l);
              if (k) {
                if (k === b) {
                  continue;
                }
                return k;
              }
            }
            if ("next" === l.method) {
              l.sent = l._sent = l.arg;
            } else if ("throw" === l.method) {
              if (1 === u) {
                throw u = 4, l.arg;
              }
              l.dispatchException(l.arg);
            } else {
              "return" === l.method && l.abrupt("return", l.arg);
            }
            u = 3;
            var C = s(o, a, l);
            if ("normal" === C.type) {
              if (u = l.done ? 4 : 2, C.arg === b) {
                continue;
              }
              return {
                "value": C.arg,
                "done": l.done
              };
            }
            "throw" === C.type && (u = 4, l.method = "throw", l.arg = C.arg);
          }
        };
      }(o, l, new Context(u || [])), !0), v;
    }
    function s(r, o, a) {
      try {
        return {
          "type": "normal",
          "arg": r.call(o, a)
        };
      } catch (r) {
        return {
          "type": "throw",
          "arg": r
        };
      }
    }
    o.wrap = h;
    var b = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var k = {};
    c(k, p, (function() {
      return this;
    }));
    var C = Object.getPrototypeOf, _ = C && C(C(x([])));
    _ && _ !== a && l.call(_, p) && (k = _);
    var P = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(k);
    function g(r) {
      [ "next", "throw", "return" ].forEach((function(o) {
        c(r, o, (function(r) {
          return this._invoke(o, r);
        }));
      }));
    }
    function AsyncIterator(r, o) {
      function e(a, u, p, v) {
        var y = s(r[a], r, u);
        if ("throw" !== y.type) {
          var b = y.arg, k = b.value;
          return k && "object" == autologin_typeof(k) && l.call(k, "__await") ? o.resolve(k.__await).then((function(r) {
            e("next", r, p, v);
          }), (function(r) {
            e("throw", r, p, v);
          })) : o.resolve(k).then((function(r) {
            b.value = r, p(b);
          }), (function(r) {
            return e("throw", r, p, v);
          }));
        }
        v(y.arg);
      }
      var a;
      c(this, "_invoke", (function(r, l) {
        function i() {
          return new o((function(o, a) {
            e(r, l, o, a);
          }));
        }
        return a = a ? a.then(i, i) : i();
      }), !0);
    }
    function d(o, a) {
      var l = a.method, u = o.i[l];
      if (u === r) {
        return a.delegate = null, "throw" === l && o.i["return"] && (a.method = "return", 
        a.arg = r, d(o, a), "throw" === a.method) || "return" !== l && (a.method = "throw", 
        a.arg = new TypeError("The iterator does not provide a '" + l + "' method")), b;
      }
      var p = s(u, o.i, a.arg);
      if ("throw" === p.type) {
        return a.method = "throw", a.arg = p.arg, a.delegate = null, b;
      }
      var v = p.arg;
      return v ? v.done ? (a[o.r] = v.value, a.next = o.n, "return" !== a.method && (a.method = "next", 
      a.arg = r), a.delegate = null, b) : v : (a.method = "throw", a.arg = new TypeError("iterator result is not an object"), 
      a.delegate = null, b);
    }
    function w(r) {
      this.tryEntries.push(r);
    }
    function m(o) {
      var a = o[4] || {};
      a.type = "normal", a.arg = r, o[4] = a;
    }
    function Context(r) {
      this.tryEntries = [ [ -1 ] ], r.forEach(w, this), this.reset(!0);
    }
    function x(o) {
      if (null != o) {
        var a = o[p];
        if (a) {
          return a.call(o);
        }
        if ("function" == typeof o.next) {
          return o;
        }
        if (!isNaN(o.length)) {
          var u = -1, v = function e() {
            for (;++u < o.length; ) {
              if (l.call(o, u)) {
                return e.value = o[u], e.done = !1, e;
              }
            }
            return e.value = r, e.done = !0, e;
          };
          return v.next = v;
        }
      }
      throw new TypeError(autologin_typeof(o) + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(P, "constructor", GeneratorFunctionPrototype), 
    c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, y, "GeneratorFunction"), 
    o.isGeneratorFunction = function(r) {
      var o = "function" == typeof r && r.constructor;
      return !!o && (o === GeneratorFunction || "GeneratorFunction" === (o.displayName || o.name));
    }, o.mark = function(r) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(r, GeneratorFunctionPrototype) : (r.__proto__ = GeneratorFunctionPrototype, 
      c(r, y, "GeneratorFunction")), r.prototype = Object.create(P), r;
    }, o.awrap = function(r) {
      return {
        "__await": r
      };
    }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, v, (function() {
      return this;
    })), o.AsyncIterator = AsyncIterator, o.async = function(r, a, l, u, p) {
      void 0 === p && (p = Promise);
      var v = new AsyncIterator(h(r, a, l, u), p);
      return o.isGeneratorFunction(a) ? v : v.next().then((function(r) {
        return r.done ? r.value : v.next();
      }));
    }, g(P), c(P, y, "Generator"), c(P, p, (function() {
      return this;
    })), c(P, "toString", (function() {
      return "[object Generator]";
    })), o.keys = function(r) {
      var o = Object(r), a = [];
      for (var l in o) {
        a.unshift(l);
      }
      return function t() {
        for (;a.length; ) {
          if ((l = a.pop()) in o) {
            return t.value = l, t.done = !1, t;
          }
        }
        return t.done = !0, t;
      };
    }, o.values = x, Context.prototype = {
      "constructor": Context,
      "reset": function reset(o) {
        if (this.prev = this.next = 0, this.sent = this._sent = r, this.done = !1, this.delegate = null, 
        this.method = "next", this.arg = r, this.tryEntries.forEach(m), !o) {
          for (var a in this) {
            "t" === a.charAt(0) && l.call(this, a) && !isNaN(+a.slice(1)) && (this[a] = r);
          }
        }
      },
      "stop": function stop() {
        this.done = !0;
        var r = this.tryEntries[0][4];
        if ("throw" === r.type) {
          throw r.arg;
        }
        return this.rval;
      },
      "dispatchException": function dispatchException(o) {
        if (this.done) {
          throw o;
        }
        var a = this;
        function n(r) {
          p.type = "throw", p.arg = o, a.next = r;
        }
        for (var l = a.tryEntries.length - 1; l >= 0; --l) {
          var u = this.tryEntries[l], p = u[4], v = this.prev, y = u[1], b = u[2];
          if (-1 === u[0]) {
            return n("end"), !1;
          }
          if (!y && !b) {
            throw Error("try statement without catch or finally");
          }
          if (null != u[0] && u[0] <= v) {
            if (v < y) {
              return this.method = "next", this.arg = r, n(y), !0;
            }
            if (v < b) {
              return n(b), !1;
            }
          }
        }
      },
      "abrupt": function abrupt(r, o) {
        for (var a = this.tryEntries.length - 1; a >= 0; --a) {
          var l = this.tryEntries[a];
          if (l[0] > -1 && l[0] <= this.prev && this.prev < l[2]) {
            var u = l;
            break;
          }
        }
        u && ("break" === r || "continue" === r) && u[0] <= o && o <= u[2] && (u = null);
        var p = u ? u[4] : {};
        return p.type = r, p.arg = o, u ? (this.method = "next", this.next = u[2], b) : this.complete(p);
      },
      "complete": function complete(r, o) {
        if ("throw" === r.type) {
          throw r.arg;
        }
        return "break" === r.type || "continue" === r.type ? this.next = r.arg : "return" === r.type ? (this.rval = this.arg = r.arg, 
        this.method = "return", this.next = "end") : "normal" === r.type && o && (this.next = o), 
        b;
      },
      "finish": function finish(r) {
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var a = this.tryEntries[o];
          if (a[2] === r) {
            return this.complete(a[4], a[3]), m(a), b;
          }
        }
      },
      "catch": function _catch(r) {
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var a = this.tryEntries[o];
          if (a[0] === r) {
            var l = a[4];
            if ("throw" === l.type) {
              var u = l.arg;
              m(a);
            }
            return u;
          }
        }
        throw Error("illegal catch attempt");
      },
      "delegateYield": function delegateYield(o, a, l) {
        return this.delegate = {
          "i": x(o),
          "r": a,
          "n": l
        }, "next" === this.method && (this.arg = r), b;
      }
    }, o;
  }
  function autologin_asyncGeneratorStep(r, o, a, l, u, p, v) {
    try {
      var y = r[p](v), b = y.value;
    } catch (r) {
      return void a(r);
    }
    y.done ? o(b) : Promise.resolve(b).then(l, u);
  }
  function autologin_asyncToGenerator(r) {
    return function() {
      var o = this, a = arguments;
      return new Promise((function(l, u) {
        var p = r.apply(o, a);
        function _next(r) {
          autologin_asyncGeneratorStep(p, l, u, _next, _throw, "next", r);
        }
        function _throw(r) {
          autologin_asyncGeneratorStep(p, l, u, _next, _throw, "throw", r);
        }
        _next(void 0);
      }));
    };
  }
  function initAutoLogin() {
    return _initAutoLogin.apply(this, arguments);
  }
  function _initAutoLogin() {
    return (_initAutoLogin = autologin_asyncToGenerator(autologin_regeneratorRuntime().mark((function _callee() {
      var r;
      return autologin_regeneratorRuntime().wrap((function _callee$(o) {
        while (1) {
          switch (o.prev = o.next) {
           case 0:
            o.prev = 0;
            r = new O;
            o.next = 4;
            return r.init();

           case 4:
            return o.abrupt("return", r);

           case 7:
            o.prev = 7;
            o.t0 = o["catch"](0);
            return o.abrupt("return", null);

           case 10:
           case "end":
            return o.stop();
          }
        }
      }), _callee, null, [ [ 0, 7 ] ]);
    })))).apply(this, arguments);
  }
  var j = function Toast(r) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 3e3;
    var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "rgba(0, 0, 0, 0.8)";
    var l = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : "#fff";
    var u = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : "top";
    var p = document.createElement("div");
    p.innerText = r;
    p.style.cssText = "\n      position: fixed;\n      z-index: 100000;\n      left: 50%;\n      transform: translateX(-50%);\n      padding: 10px 15px;\n      border-radius: 4px;\n      color: ".concat(l, ";\n      background: ").concat(a, ";\n      font-size: 14px;\n      max-width: 80%;\n      text-align: center;\n      word-break: break-all;\n    ");
    if ("top" === u) {
      p.style.top = "10%";
    } else if ("bottom" === u) {
      p.style.bottom = "10%";
    } else if ("center" === u) {
      p.style.top = "50%";
      p.style.transform = "translate(-50%, -50%)";
    }
    document.body.appendChild(p);
    setTimeout((function() {
      p.style.opacity = "0";
      p.style.transition = "opacity 0.5s";
      setTimeout((function() {
        document.body.removeChild(p);
      }), 500);
    }), o);
  }, R = function throttle(r, o) {
    var a = 0;
    return function() {
      var l = Date.now();
      if (l - a >= o) {
        a = l;
        for (var u = arguments.length, p = new Array(u), v = 0; v < u; v++) {
          p[v] = arguments[v];
        }
        return r.apply(this, p);
      }
    };
  }, H = function waitForElement(r) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1e4;
    var a = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 100;
    return new Promise((function(l, u) {
      var p = document.querySelector(r);
      if (p) {
        return l(p);
      }
      var v = Date.now();
      var y = setInterval((function() {
        var a = document.querySelector(r);
        if (a) {
          clearInterval(y);
          return l(a);
        }
        if (Date.now() - v > o) {
          clearInterval(y);
          u(new Error("等待元素 ".concat(r, " 超时")));
        }
      }), a);
    }));
  }, N = function loadScript(r) {
    return new Promise((function(o, a) {
      var l = document.createElement("script");
      l.src = r;
      l.onload = function() {
        return o();
      };
      l.onerror = function(o) {
        return a(new Error("脚本加载失败: ".concat(r)));
      };
      document.head.appendChild(l);
    }));
  }, z = function isInViewport(r) {
    var o = r.getBoundingClientRect();
    return o.top >= 0 && o.left >= 0 && o.bottom <= (window.innerHeight || document.documentElement.clientHeight) && o.right <= (window.innerWidth || document.documentElement.clientWidth);
  }, U = function formatTime(r) {
    var o = Math.floor(r / 3600);
    var a = Math.floor(r % 3600 / 60);
    var l = Math.floor(r % 60);
    var u;
    var p;
    var v;
    return (o > 0 ? String(o).padStart(2, "0") + ":" : "") + (String(a).padStart(2, "0") + ":") + String(l).padStart(2, "0");
  };
  function AdBlockConfig_typeof(r) {
    return AdBlockConfig_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, AdBlockConfig_typeof(r);
  }
  function AdBlockConfig_createForOfIteratorHelper(r, o) {
    var a = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!a) {
      if (Array.isArray(r) || (a = AdBlockConfig_unsupportedIterableToArray(r)) || o && r && "number" == typeof r.length) {
        a && (r = a);
        var l = 0, u = function F() {};
        return {
          "s": u,
          "n": function n() {
            return l >= r.length ? {
              "done": !0
            } : {
              "done": !1,
              "value": r[l++]
            };
          },
          "e": function e(r) {
            throw r;
          },
          "f": u
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var p, v = !0, y = !1;
    return {
      "s": function s() {
        a = a.call(r);
      },
      "n": function n() {
        var r = a.next();
        return v = r.done, r;
      },
      "e": function e(r) {
        y = !0, p = r;
      },
      "f": function f() {
        try {
          v || null == a["return"] || a["return"]();
        } finally {
          if (y) {
            throw p;
          }
        }
      }
    };
  }
  function AdBlockConfig_unsupportedIterableToArray(r, o) {
    if (r) {
      if ("string" == typeof r) {
        return AdBlockConfig_arrayLikeToArray(r, o);
      }
      var a = {}.toString.call(r).slice(8, -1);
      return "Object" === a && r.constructor && (a = r.constructor.name), "Map" === a || "Set" === a ? Array.from(r) : "Arguments" === a || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a) ? AdBlockConfig_arrayLikeToArray(r, o) : void 0;
    }
  }
  function AdBlockConfig_arrayLikeToArray(r, o) {
    (null == o || o > r.length) && (o = r.length);
    for (var a = 0, l = Array(o); a < o; a++) {
      l[a] = r[a];
    }
    return l;
  }
  function AdBlockConfig_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function AdBlockConfig_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, AdBlockConfig_toPropertyKey(l.key), l);
    }
  }
  function AdBlockConfig_createClass(r, o, a) {
    return o && AdBlockConfig_defineProperties(r.prototype, o), a && AdBlockConfig_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function AdBlockConfig_toPropertyKey(r) {
    var o = AdBlockConfig_toPrimitive(r, "string");
    return "symbol" == AdBlockConfig_typeof(o) ? o : o + "";
  }
  function AdBlockConfig_toPrimitive(r, o) {
    if ("object" != AdBlockConfig_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != AdBlockConfig_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var G;
  const q = function() {
    function AdBlockConfig() {
      var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
      AdBlockConfig_classCallCheck(this, AdBlockConfig);
      this.adSelectors = r.adSelectors || [];
      this.customStyles = r.customStyles || [];
      this.blockedUrlPatternsSet = new Set(r.blockedUrlPatterns || []);
      this.adKeywordsRegex = /ads|analytics|tracker|affiliate|stat|pixel|banner|pop|click|outstream\.video|vast|vmap|preroll|midroll|postroll|adserve/i;
    }
    return AdBlockConfig_createClass(AdBlockConfig, [ {
      "key": "isEmpty",
      "value": function isEmpty() {
        return 0 === this.adSelectors.length && 0 === this.customStyles.length && 0 === this.blockedUrlPatternsSet.size;
      }
    }, {
      "key": "shouldBlockUrl",
      "value": function shouldBlockUrl(r) {
        if (!r || "string" !== typeof r) {
          return false;
        }
        if (this.adKeywordsRegex.test(r)) {
          return true;
        }
        var o = AdBlockConfig_createForOfIteratorHelper(this.blockedUrlPatternsSet), a;
        try {
          for (o.s(); !(a = o.n()).done; ) {
            var l = a.value;
            if (r.includes(l)) {
              return true;
            }
          }
        } catch (r) {
          o.e(r);
        } finally {
          o.f();
        }
        return false;
      }
    } ]);
  }();
  function StyleManager_typeof(r) {
    return StyleManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, StyleManager_typeof(r);
  }
  function StyleManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function StyleManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, StyleManager_toPropertyKey(l.key), l);
    }
  }
  function StyleManager_createClass(r, o, a) {
    return o && StyleManager_defineProperties(r.prototype, o), a && StyleManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function StyleManager_toPropertyKey(r) {
    var o = StyleManager_toPrimitive(r, "string");
    return "symbol" == StyleManager_typeof(o) ? o : o + "";
  }
  function StyleManager_toPrimitive(r, o) {
    if ("object" != StyleManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != StyleManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var W;
  const K = function() {
    function StyleManager(r) {
      StyleManager_classCallCheck(this, StyleManager);
      this.config = r;
    }
    return StyleManager_createClass(StyleManager, [ {
      "key": "applyAdBlockStyles",
      "value": function applyAdBlockStyles() {
        if (0 === this.config.adSelectors.length && 0 === this.config.customStyles.length) {
          return;
        }
        var r = document.createElement("style");
        r.id = "adblock-styles";
        r.type = "text/css";
        var o = "";
        if (this.config.adSelectors.length > 0) {
          o += this.config.adSelectors.join(", ") + " { display: none !important; visibility: hidden !important; height: 0 !important; min-height: 0 !important; }";
        }
        if (this.config.customStyles.length > 0) {
          o += "\n" + this.config.customStyles.map((function(r) {
            return "".concat(r.selector, " { ").concat(r.styles, " }");
          })).join("\n");
        }
        r.textContent = o;
        document.head.appendChild(r);
      }
    } ]);
  }();
  function DOMCleaner_typeof(r) {
    return DOMCleaner_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, DOMCleaner_typeof(r);
  }
  function DOMCleaner_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function DOMCleaner_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, DOMCleaner_toPropertyKey(l.key), l);
    }
  }
  function DOMCleaner_createClass(r, o, a) {
    return o && DOMCleaner_defineProperties(r.prototype, o), a && DOMCleaner_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function DOMCleaner_toPropertyKey(r) {
    var o = DOMCleaner_toPrimitive(r, "string");
    return "symbol" == DOMCleaner_typeof(o) ? o : o + "";
  }
  function DOMCleaner_toPrimitive(r, o) {
    if ("object" != DOMCleaner_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != DOMCleaner_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var X;
  const Q = function() {
    function DOMCleaner(r) {
      DOMCleaner_classCallCheck(this, DOMCleaner);
      this.config = r;
      this.CLEANUP_THROTTLE = 500;
      this.observer = null;
    }
    return DOMCleaner_createClass(DOMCleaner, [ {
      "key": "cleanIframes",
      "value": function cleanIframes() {
        var r;
        var o = (arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : null) || document.getElementsByTagName("iframe");
        for (var a = 0; a < o.length; a++) {
          var l = o[a];
          if (l.src && !l.src.includes("plyr.io")) {
            l.remove();
          }
        }
      }
    }, {
      "key": "removeAdElements",
      "value": function removeAdElements() {
        var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : false;
        if (0 === this.config.adSelectors.length) {
          return;
        }
        for (var o = 0; o < this.config.adSelectors.length; o++) {
          try {
            var a = document.querySelectorAll(this.config.adSelectors[o]);
            for (var l = 0; l < a.length; l++) {
              a[l].remove();
            }
          } catch (r) {}
        }
      }
    }, {
      "key": "observeDOMChanges",
      "value": function observeDOMChanges() {
        var r = this;
        if (this.observer) {
          return;
        }
        var o = false;
        var a = false;
        var l = null;
        var u = function processChanges() {
          if (o) {
            r.removeAdElements();
            o = false;
          }
          if (a) {
            r.cleanIframes();
            a = false;
          }
          l = null;
        };
        this.observer = new MutationObserver((function(r) {
          var p = false;
          var v = false;
          for (var y = 0; y < r.length; y++) {
            var b = r[y];
            if (b.addedNodes.length) {
              p = true;
              for (var k = 0; k < b.addedNodes.length; k++) {
                var C;
                if ("IFRAME" === b.addedNodes[k].nodeName) {
                  v = true;
                  break;
                }
              }
            }
            if (p && v) {
              break;
            }
          }
          if (p) {
            o = true;
          }
          if (v) {
            a = true;
          }
          if ((o || a) && !l) {
            l = setTimeout(u, 50);
          }
        }));
        this.observer.observe(document.documentElement, {
          "childList": true,
          "subtree": true
        });
      }
    }, {
      "key": "disconnect",
      "value": function disconnect() {
        if (this.observer) {
          this.observer.disconnect();
          this.observer = null;
        }
      }
    } ]);
  }();
  function RequestBlocker_typeof(r) {
    return RequestBlocker_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, RequestBlocker_typeof(r);
  }
  function RequestBlocker_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function RequestBlocker_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, RequestBlocker_toPropertyKey(l.key), l);
    }
  }
  function RequestBlocker_createClass(r, o, a) {
    return o && RequestBlocker_defineProperties(r.prototype, o), a && RequestBlocker_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function RequestBlocker_toPropertyKey(r) {
    var o = RequestBlocker_toPrimitive(r, "string");
    return "symbol" == RequestBlocker_typeof(o) ? o : o + "";
  }
  function RequestBlocker_toPrimitive(r, o) {
    if ("object" != RequestBlocker_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != RequestBlocker_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var Y;
  const $ = function() {
    function RequestBlocker(r) {
      RequestBlocker_classCallCheck(this, RequestBlocker);
      this.config = r;
    }
    return RequestBlocker_createClass(RequestBlocker, [ {
      "key": "blockTrackingRequests",
      "value": function blockTrackingRequests() {
        var r = XMLHttpRequest.prototype.open;
        var o = this.config;
        XMLHttpRequest.prototype.open = function(a, l) {
          if ("string" === typeof l && o.shouldBlockUrl(l)) {
            this.send = function() {};
            this.onload = null;
            this.onerror = null;
            return;
          }
          return r.apply(this, arguments);
        };
        var a = window.fetch;
        window.fetch = function(r, l) {
          var u = r;
          if (r instanceof Request) {
            u = r.url;
          }
          if ("string" === typeof u && o.shouldBlockUrl(u)) {
            return Promise.resolve(new Response("", {
              "status": 200,
              "headers": {
                "Content-Type": "text/plain"
              }
            }));
          }
          return a.apply(this, arguments);
        };
      }
    }, {
      "key": "blockIframeLoading",
      "value": function blockIframeLoading() {
        var r = document.createElement;
        var o = this.config;
        document.createElement = function(a) {
          var l = r.call(document, a);
          if ("iframe" === a.toLowerCase()) {
            var u = l.src;
            Object.defineProperty(l, "src", {
              "set": function set(r) {
                if ("string" === typeof r && o.shouldBlockUrl(r)) {
                  return;
                }
                u = r;
              },
              "get": function get() {
                return u;
              }
            });
            var p = l.setAttribute;
            l.setAttribute = function(r, a) {
              if ("src" === r && "string" === typeof a && o.shouldBlockUrl(a)) {
                return;
              }
              return p.call(this, r, a);
            };
          }
          return l;
        };
      }
    }, {
      "key": "blockPopups",
      "value": function blockPopups() {
        window.open = function() {
          return null;
        };
        if ("undefined" !== typeof unsafeWindow) {
          unsafeWindow.open = function() {
            return null;
          };
        }
      }
    }, {
      "key": "init",
      "value": function init() {
        this.blockIframeLoading();
        this.blockTrackingRequests();
        this.blockPopups();
      }
    } ]);
  }();
  var Z;
  var J;
  var tt;
  const et = {
    "adSelectors": [ 'div[class="space-y-6 mb-6"]', 'div[class*="root--"][class*="bottomRight--"]', 'div[class="grid md:grid-cols-2 gap-8"]', 'ul[class="mb-4 list-none text-nord14 grid grid-cols-2 gap-2"]', 'div[class="space-y-5 mb-5"]', 'iframe[src*="ads"]', 'iframe[src*="banner"]', 'iframe[src*="pop"]', "iframe[data-ad]", 'iframe[id*="ads"]', 'iframe[class*="ads"]', 'iframe:not([src*="plyr.io"])' ],
    "customStyles": [ {
      "selector": 'div[class="my-2 text-sm text-nord4 truncate"]',
      "styles": "white-space: normal !important;"
    }, {
      "selector": "body",
      "styles": "background-color: #000000 !important;"
    }, {
      "selector": 'div[class*="z-max"]',
      "styles": "z-index: 9000 !important;"
    } ],
    "blockedUrlPatterns": [ "exoclick.com", "juicyads.com", "popads.net", "adsterra.com", "trafficjunky.com", "adnium.com", "ad-maven.com", "browser-update.org", "mopvip.icu", "toppages.pw", "cpmstar.com", "propellerads.com", "tsyndicate.com", "syndication.exosrv.com", "ads.exosrv.com", "tsyndicate.com/sdk", "cdn.tsyndicate.com", "adsco.re", "adscpm.site", "a-ads.com", "ad-delivery.net", "outbrain.com", "taboola.com", "mgid.com", "revcontent.com", "adnxs.com", "pubmatic.com", "rubiconproject.com", "openx.net", "criteo.com", "doubleclick.net" ],
    "isVideoSite": true,
    "domains": [ "missav.ws", "missav.ai", "missav.com", "thisav.com" ]
  };
  function adblock_typeof(r) {
    return adblock_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, adblock_typeof(r);
  }
  function adblock_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function adblock_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, adblock_toPropertyKey(l.key), l);
    }
  }
  function adblock_createClass(r, o, a) {
    return o && adblock_defineProperties(r.prototype, o), a && adblock_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function adblock_toPropertyKey(r) {
    var o = adblock_toPrimitive(r, "string");
    return "symbol" == adblock_typeof(o) ? o : o + "";
  }
  function adblock_toPrimitive(r, o) {
    if ("object" != adblock_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != adblock_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  function getSiteConfig(r) {
    if (/^https?:\/\/(www\.)?(missav|thisav)\.(com|ws|ai)/.test(r)) {
      return et;
    }
    return {
      "adSelectors": [],
      "customStyles": [],
      "blockedUrlPatterns": []
    };
  }
  var nt;
  const rt = function() {
    function AdBlocker() {
      adblock_classCallCheck(this, AdBlocker);
      var r = getSiteConfig(window.location.href);
      this.config = new q(r);
      this.styleManager = new K(this.config);
      this.domCleaner = new Q(this.config);
      this.requestBlocker = new $(this.config);
    }
    return adblock_createClass(AdBlocker, [ {
      "key": "preventDetection",
      "value": function preventDetection() {
        window.AdBlock = false;
        window.adblock = false;
        window.adsbygoogle = {
          "loaded": true
        };
        if ("undefined" !== typeof unsafeWindow) {
          unsafeWindow.AdBlock = false;
          unsafeWindow.adblock = false;
          unsafeWindow.adsbygoogle = {
            "loaded": true
          };
        }
      }
    }, {
      "key": "setupPeriodicCleaning",
      "value": function setupPeriodicCleaning() {
        var r = this;
        this.domCleaner.removeAdElements(true);
        this.domCleaner.observeDOMChanges();
        setInterval((function() {
          return r.domCleaner.removeAdElements();
        }), 2e3);
      }
    }, {
      "key": "init",
      "value": function init() {
        var r = this;
        if (this.config.isEmpty()) {
          return;
        }
        this.preventDetection();
        this.styleManager.applyAdBlockStyles();
        this.requestBlocker.init();
        if ("loading" === document.readyState) {
          document.addEventListener("DOMContentLoaded", (function() {
            return r.setupPeriodicCleaning();
          }));
        } else {
          this.setupPeriodicCleaning();
        }
      }
    } ]);
  }();
  function DetailExpander_typeof(r) {
    return DetailExpander_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, DetailExpander_typeof(r);
  }
  function DetailExpander_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function DetailExpander_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, DetailExpander_toPropertyKey(l.key), l);
    }
  }
  function DetailExpander_createClass(r, o, a) {
    return o && DetailExpander_defineProperties(r.prototype, o), a && DetailExpander_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function DetailExpander_toPropertyKey(r) {
    var o = DetailExpander_toPrimitive(r, "string");
    return "symbol" == DetailExpander_typeof(o) ? o : o + "";
  }
  function DetailExpander_toPrimitive(r, o) {
    if ("object" != DetailExpander_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != DetailExpander_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var ot = function() {
    function DetailExpander() {
      DetailExpander_classCallCheck(this, DetailExpander);
      this.maxAttempts = 3;
      this.attemptInterval = 1e3;
    }
    return DetailExpander_createClass(DetailExpander, [ {
      "key": "SHOW_MORE_SELECTOR",
      "get": function get() {
        return "a.text-nord13.font-medium.flex.items-center";
      }
    }, {
      "key": "autoExpandDetails",
      "value": function autoExpandDetails() {
        var r = this;
        this.expandDetailsSingle();
        var o = 0;
        var a = setInterval((function() {
          if (r.expandDetailsSingle() || ++o >= r.maxAttempts) {
            clearInterval(a);
          }
        }), this.attemptInterval);
      }
    }, {
      "key": "expandDetailsSingle",
      "value": function expandDetailsSingle() {
        try {
          var r = document.querySelector(this.SHOW_MORE_SELECTOR);
          if (r) {
            r.click();
            return true;
          }
        } catch (r) {}
        return false;
      }
    } ]);
  }();
  function QualityManager_typeof(r) {
    return QualityManager_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, QualityManager_typeof(r);
  }
  function QualityManager_toConsumableArray(r) {
    return QualityManager_arrayWithoutHoles(r) || QualityManager_iterableToArray(r) || QualityManager_unsupportedIterableToArray(r) || QualityManager_nonIterableSpread();
  }
  function QualityManager_nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function QualityManager_unsupportedIterableToArray(r, o) {
    if (r) {
      if ("string" == typeof r) {
        return QualityManager_arrayLikeToArray(r, o);
      }
      var a = {}.toString.call(r).slice(8, -1);
      return "Object" === a && r.constructor && (a = r.constructor.name), "Map" === a || "Set" === a ? Array.from(r) : "Arguments" === a || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a) ? QualityManager_arrayLikeToArray(r, o) : void 0;
    }
  }
  function QualityManager_iterableToArray(r) {
    if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) {
      return Array.from(r);
    }
  }
  function QualityManager_arrayWithoutHoles(r) {
    if (Array.isArray(r)) {
      return QualityManager_arrayLikeToArray(r);
    }
  }
  function QualityManager_arrayLikeToArray(r, o) {
    (null == o || o > r.length) && (o = r.length);
    for (var a = 0, l = Array(o); a < o; a++) {
      l[a] = r[a];
    }
    return l;
  }
  function QualityManager_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function QualityManager_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, QualityManager_toPropertyKey(l.key), l);
    }
  }
  function QualityManager_createClass(r, o, a) {
    return o && QualityManager_defineProperties(r.prototype, o), a && QualityManager_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function QualityManager_toPropertyKey(r) {
    var o = QualityManager_toPrimitive(r, "string");
    return "symbol" == QualityManager_typeof(o) ? o : o + "";
  }
  function QualityManager_toPrimitive(r, o) {
    if ("object" != QualityManager_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != QualityManager_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var it = function() {
    function QualityManager() {
      QualityManager_classCallCheck(this, QualityManager);
      this.maxAttempts = 20;
      this.attemptInterval = 500;
    }
    return QualityManager_createClass(QualityManager, [ {
      "key": "setupAutoHighestQuality",
      "value": function setupAutoHighestQuality() {
        var r = this;
        if (this.setHighestQualitySingle()) {
          return;
        }
        var o = 0;
        var a = setInterval((function() {
          if (r.setHighestQualitySingle() || ++o >= r.maxAttempts) {
            clearInterval(a);
          }
        }), this.attemptInterval);
        window.addEventListener("load", (function() {
          return r.setHighestQualitySingle();
        }));
      }
    }, {
      "key": "setHighestQualitySingle",
      "value": function setHighestQualitySingle() {
        try {
          var r = window.player || ("undefined" !== typeof unsafeWindow ? unsafeWindow.player : null);
          if (!r || !r.config || !r.config.quality || !r.config.quality.options || !r.config.quality.options.length) {
            return false;
          }
          var o = Math.max.apply(Math, QualityManager_toConsumableArray(r.config.quality.options));
          r.quality = o;
          r.config.quality.selected = o;
          if ("function" === typeof r.quality) {
            r.quality(o);
          }
          return true;
        } catch (r) {
          return false;
        }
      }
    } ]);
  }();
  function UrlRedirector_typeof(r) {
    return UrlRedirector_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, UrlRedirector_typeof(r);
  }
  function UrlRedirector_createForOfIteratorHelper(r, o) {
    var a = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (!a) {
      if (Array.isArray(r) || (a = UrlRedirector_unsupportedIterableToArray(r)) || o && r && "number" == typeof r.length) {
        a && (r = a);
        var l = 0, u = function F() {};
        return {
          "s": u,
          "n": function n() {
            return l >= r.length ? {
              "done": !0
            } : {
              "done": !1,
              "value": r[l++]
            };
          },
          "e": function e(r) {
            throw r;
          },
          "f": u
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var p, v = !0, y = !1;
    return {
      "s": function s() {
        a = a.call(r);
      },
      "n": function n() {
        var r = a.next();
        return v = r.done, r;
      },
      "e": function e(r) {
        y = !0, p = r;
      },
      "f": function f() {
        try {
          v || null == a["return"] || a["return"]();
        } finally {
          if (y) {
            throw p;
          }
        }
      }
    };
  }
  function UrlRedirector_unsupportedIterableToArray(r, o) {
    if (r) {
      if ("string" == typeof r) {
        return UrlRedirector_arrayLikeToArray(r, o);
      }
      var a = {}.toString.call(r).slice(8, -1);
      return "Object" === a && r.constructor && (a = r.constructor.name), "Map" === a || "Set" === a ? Array.from(r) : "Arguments" === a || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(a) ? UrlRedirector_arrayLikeToArray(r, o) : void 0;
    }
  }
  function UrlRedirector_arrayLikeToArray(r, o) {
    (null == o || o > r.length) && (o = r.length);
    for (var a = 0, l = Array(o); a < o; a++) {
      l[a] = r[a];
    }
    return l;
  }
  function UrlRedirector_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function UrlRedirector_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, UrlRedirector_toPropertyKey(l.key), l);
    }
  }
  function UrlRedirector_createClass(r, o, a) {
    return o && UrlRedirector_defineProperties(r.prototype, o), a && UrlRedirector_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function UrlRedirector_toPropertyKey(r) {
    var o = UrlRedirector_toPrimitive(r, "string");
    return "symbol" == UrlRedirector_typeof(o) ? o : o + "";
  }
  function UrlRedirector_toPrimitive(r, o) {
    if ("object" != UrlRedirector_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != UrlRedirector_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var at;
  function userExperienceEnhancer_typeof(r) {
    return userExperienceEnhancer_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, userExperienceEnhancer_typeof(r);
  }
  function userExperienceEnhancer_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function userExperienceEnhancer_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, userExperienceEnhancer_toPropertyKey(l.key), l);
    }
  }
  function userExperienceEnhancer_createClass(r, o, a) {
    return o && userExperienceEnhancer_defineProperties(r.prototype, o), a && userExperienceEnhancer_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function userExperienceEnhancer_toPropertyKey(r) {
    var o = userExperienceEnhancer_toPrimitive(r, "string");
    return "symbol" == userExperienceEnhancer_typeof(o) ? o : o + "";
  }
  function userExperienceEnhancer_toPrimitive(r, o) {
    if ("object" != userExperienceEnhancer_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != userExperienceEnhancer_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var st = new (function() {
    function UrlRedirector() {
      UrlRedirector_classCallCheck(this, UrlRedirector);
      this.redirectRules = [ {
        "pattern": /^https?:\/\/(www\.)?(missav|thisav|missav123)\.com\/?|^https?:\/\/(www\.)?missav\.ws\/?|^https?:\/\/(www\.)?missav\.live\/?/i,
        "targetDomain": "missav.ai"
      } ];
      this.immediateRedirect();
    }
    return UrlRedirector_createClass(UrlRedirector, [ {
      "key": "immediateRedirect",
      "value": function immediateRedirect() {
        this.checkAndRedirect();
      }
    }, {
      "key": "checkAndRedirect",
      "value": function checkAndRedirect() {
        var r = window.location.href;
        var o = UrlRedirector_createForOfIteratorHelper(this.redirectRules), a;
        try {
          for (o.s(); !(a = o.n()).done; ) {
            var l = a.value;
            if (l.pattern.test(r)) {
              var u = this.applyRedirect(r, l);
              if (u !== r) {
                window.location.replace(u);
                return true;
              }
            }
          }
        } catch (r) {
          o.e(r);
        } finally {
          o.f();
        }
        return false;
      }
    }, {
      "key": "applyRedirect",
      "value": function applyRedirect(r, o) {
        if (o.targetDomain) {
          var a = r;
          if ((a = a.replace(/^(https?:\/\/)(www\.)?(missav|thisav|missav123)\.com\/?/i, "$1".concat(o.targetDomain, "/"))) === r) {
            a = r.replace(/^(https?:\/\/)(www\.)?missav\.ws\/?/i, "$1".concat(o.targetDomain, "/"));
          }
          if (a === r) {
            a = r.replace(/^(https?:\/\/)(www\.)?missav\.live\/?/i, "$1".concat(o.targetDomain, "/"));
          }
          return a;
        }
        return r;
      }
    } ]);
  }());
  var lt = function() {
    function UserExperienceEnhancer() {
      userExperienceEnhancer_classCallCheck(this, UserExperienceEnhancer);
      this.detailExpander = new ot;
      this.qualityManager = new it;
      this.urlRedirector = st;
    }
    return userExperienceEnhancer_createClass(UserExperienceEnhancer, [ {
      "key": "init",
      "value": function init() {
        var r = this;
        var o;
        if (!(arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : false)) {
          if (this.urlRedirector.checkAndRedirect()) {
            return;
          }
        }
        if ("loading" === document.readyState) {
          document.addEventListener("DOMContentLoaded", (function() {
            r.initFeatures();
          }));
        } else {
          this.initFeatures();
        }
      }
    }, {
      "key": "initFeatures",
      "value": function initFeatures() {
        try {
          this.detailExpander.autoExpandDetails();
          this.qualityManager.setupAutoHighestQuality();
        } catch (r) {}
      }
    } ]);
  }();
  function initUserExperienceEnhancer() {
    var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : false;
    var o = new lt;
    o.init(r);
    return o;
  }
  function constants_i18n_typeof(r) {
    return constants_i18n_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, constants_i18n_typeof(r);
  }
  function constants_i18n_classCallCheck(r, o) {
    if (!(r instanceof o)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function constants_i18n_defineProperties(r, o) {
    for (var a = 0; a < o.length; a++) {
      var l = o[a];
      l.enumerable = l.enumerable || !1, l.configurable = !0, "value" in l && (l.writable = !0), 
      Object.defineProperty(r, constants_i18n_toPropertyKey(l.key), l);
    }
  }
  function constants_i18n_createClass(r, o, a) {
    return o && constants_i18n_defineProperties(r.prototype, o), a && constants_i18n_defineProperties(r, a), 
    Object.defineProperty(r, "prototype", {
      "writable": !1
    }), r;
  }
  function constants_i18n_defineProperty(r, o, a) {
    return (o = constants_i18n_toPropertyKey(o)) in r ? Object.defineProperty(r, o, {
      "value": a,
      "enumerable": !0,
      "configurable": !0,
      "writable": !0
    }) : r[o] = a, r;
  }
  function constants_i18n_toPropertyKey(r) {
    var o = constants_i18n_toPrimitive(r, "string");
    return "symbol" == constants_i18n_typeof(o) ? o : o + "";
  }
  function constants_i18n_toPrimitive(r, o) {
    if ("object" != constants_i18n_typeof(r) || !r) {
      return r;
    }
    var a = r[Symbol.toPrimitive];
    if (void 0 !== a) {
      var l = a.call(r, o || "default");
      if ("object" != constants_i18n_typeof(l)) {
        return l;
      }
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return ("string" === o ? String : Number)(r);
  }
  var ct = function() {
    function I18n() {
      constants_i18n_classCallCheck(this, I18n);
    }
    return constants_i18n_createClass(I18n, null, [ {
      "key": "userLang",
      "get": function get() {
        return navigator.languages && navigator.languages[0] || navigator.language || "en";
      }
    }, {
      "key": "translate",
      "value": function translate(r) {
        var o;
        var a = (arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "") || this.userLang;
        var l;
        return (this.strings[a] || this.strings[a.split("-")[0]] || this.strings.en)[r] || this.strings.en[r];
      }
    } ]);
  }();
  constants_i18n_defineProperty(ct, "strings", {
    "en": {
      "scriptName": "Miss Player | Cinema Mode (One-handed Player)",
      "scriptDescription": "MissAV ad-free|One-handed mode|MissAV auto-expand details|MissAV auto high quality|MissAV redirect support|MissAV auto login|Custom player supporting jable po*nhub etc",
      "viewportConfigured": "Viewport configured to support safe area",
      "stylesInjected": "Styles injected",
      "enhancerInitialized": "User experience enhancer module initialized",
      "loginModuleInitialized": "Auto login module initialized",
      "initializationComplete": "Initialization complete",
      "initializationFailed": "Initialization failed",
      "play": "Play",
      "pause": "Pause",
      "mute": "Mute",
      "unmute": "Unmute",
      "fullscreen": "Fullscreen",
      "exitFullscreen": "Exit Fullscreen",
      "settings": "Settings",
      "quality": "Quality",
      "speed": "Speed",
      "autoplay": "Auto Play",
      "loop": "Loop",
      "autoQuality": "Auto Quality",
      "loadingError": "Failed to load video",
      "networkError": "Network error",
      "loginSuccess": "Login successful",
      "loginFailed": "Login failed"
    },
    "zh-CN": {
      "scriptName": "Miss Player | 影院模式 (单手播放器)",
      "scriptDescription": "MissAV去广告|单手模式|MissAV自动展开详情|MissAV自动高画质|MissAV重定向支持|MissAV自动登录|定制播放器 支持 jable po*nhub 等通用",
      "viewportConfigured": "已配置viewport以支持安全区域",
      "stylesInjected": "样式注入完成",
      "enhancerInitialized": "用户体验增强模块已初始化",
      "loginModuleInitialized": "自动登录模块已初始化",
      "initializationComplete": "初始化完成",
      "initializationFailed": "初始化失败",
      "play": "播放",
      "pause": "暂停",
      "mute": "静音",
      "unmute": "取消静音",
      "fullscreen": "全屏",
      "exitFullscreen": "退出全屏",
      "settings": "设置",
      "quality": "画质",
      "speed": "速度",
      "autoplay": "自动播放",
      "loop": "循环播放",
      "autoQuality": "自动画质",
      "loadingError": "视频加载失败",
      "networkError": "网络错误",
      "loginSuccess": "登录成功",
      "loginFailed": "登录失败"
    },
    "zh-TW": {
      "scriptName": "Miss Player | 影院模式 (單手播放器)",
      "scriptDescription": "MissAV去廣告|單手模式|MissAV自動展開詳情|MissAV自動高畫質|MissAV重定向支持|MissAV自動登錄|定制播放器 支持 jable po*nhub 等通用",
      "viewportConfigured": "已配置viewport以支持安全區域",
      "stylesInjected": "樣式注入完成",
      "enhancerInitialized": "用戶體驗增強模塊已初始化",
      "loginModuleInitialized": "自動登錄模塊已初始化",
      "initializationComplete": "初始化完成",
      "initializationFailed": "初始化失敗",
      "play": "播放",
      "pause": "暫停",
      "mute": "靜音",
      "unmute": "取消靜音",
      "fullscreen": "全屏",
      "exitFullscreen": "退出全屏",
      "settings": "設置",
      "quality": "畫質",
      "speed": "速度",
      "autoplay": "自動播放",
      "loop": "循環播放",
      "autoQuality": "自動畫質",
      "loadingError": "視頻加載失敗",
      "networkError": "網絡錯誤",
      "loginSuccess": "登錄成功",
      "loginFailed": "登錄失敗"
    },
    "ja": {
      "scriptName": "Miss Player | シネマモード (片手プレーヤー)",
      "scriptDescription": "MissAV広告なし|片手モード|MissAV自動詳細展開|MissAV自動高画質|MissAVリダイレクトサポート|MissAV自動ログイン|jable po*nhub などをサポートするカスタムプレーヤー",
      "viewportConfigured": "セーフエリアをサポートするためにビューポートを設定しました",
      "stylesInjected": "スタイルが注入されました",
      "enhancerInitialized": "ユーザー体験向上モジュールが初期化されました",
      "loginModuleInitialized": "自動ログインモジュールが初期化されました",
      "initializationComplete": "初期化が完了しました",
      "initializationFailed": "初期化に失敗しました",
      "play": "再生",
      "pause": "一時停止",
      "mute": "ミュート",
      "unmute": "ミュート解除",
      "fullscreen": "全画面",
      "exitFullscreen": "全画面解除",
      "settings": "設定",
      "quality": "画質",
      "speed": "速度",
      "autoplay": "自動再生",
      "loop": "ループ再生",
      "autoQuality": "自動画質",
      "loadingError": "動画の読み込みに失敗しました",
      "networkError": "ネットワークエラー",
      "loginSuccess": "ログイン成功",
      "loginFailed": "ログイン失敗"
    },
    "vi": {
      "scriptName": "Miss Player | Chế độ Rạp chiếu phim (Trình phát một tay)",
      "scriptDescription": "MissAV không quảng cáo|Chế độ một tay|MissAV tự động mở rộng chi tiết|MissAV tự động chất lượng cao|Hỗ trợ chuyển hướng MissAV|Đăng nhập tự động MissAV|Trình phát tùy chỉnh hỗ trợ jable po*nhub v.v.",
      "viewportConfigured": "Đã cấu hình viewport để hỗ trợ vùng an toàn",
      "stylesInjected": "Đã tiêm CSS",
      "enhancerInitialized": "Đã khởi tạo mô-đun nâng cao trải nghiệm người dùng",
      "loginModuleInitialized": "Đã khởi tạo mô-đun đăng nhập tự động",
      "initializationComplete": "Khởi tạo hoàn tất",
      "initializationFailed": "Khởi tạo thất bại",
      "play": "Phát",
      "pause": "Tạm dừng",
      "mute": "Tắt tiếng",
      "unmute": "Bật tiếng",
      "fullscreen": "Toàn màn hình",
      "exitFullscreen": "Thoát toàn màn hình",
      "settings": "Cài đặt",
      "quality": "Chất lượng",
      "speed": "Tốc độ",
      "autoplay": "Tự động phát",
      "loop": "Lặp lại",
      "autoQuality": "Chất lượng tự động",
      "loadingError": "Không thể tải video",
      "networkError": "Lỗi mạng",
      "loginSuccess": "Đăng nhập thành công",
      "loginFailed": "Đăng nhập thất bại"
    }
  });
  function __(r) {
    var o = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
    return ct.translate(r, o);
  }
  function src_typeof(r) {
    return src_typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(r) {
      return typeof r;
    } : function(r) {
      return r && "function" == typeof Symbol && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
    }, src_typeof(r);
  }
  function src_regeneratorRuntime() {
    src_regeneratorRuntime = function _regeneratorRuntime() {
      return o;
    };
    var r, o = {}, a = Object.prototype, l = a.hasOwnProperty, u = "function" == typeof Symbol ? Symbol : {}, p = u.iterator || "@@iterator", v = u.asyncIterator || "@@asyncIterator", y = u.toStringTag || "@@toStringTag";
    function c(r, o, a, l) {
      return Object.defineProperty(r, o, {
        "value": a,
        "enumerable": !l,
        "configurable": !l,
        "writable": !l
      });
    }
    try {
      c({}, "");
    } catch (r) {
      c = function c(r, o, a) {
        return r[o] = a;
      };
    }
    function h(o, a, l, u) {
      var p = a && a.prototype instanceof Generator ? a : Generator, v = Object.create(p.prototype);
      return c(v, "_invoke", function(o, a, l) {
        var u = 1;
        return function(p, v) {
          if (3 === u) {
            throw Error("Generator is already running");
          }
          if (4 === u) {
            if ("throw" === p) {
              throw v;
            }
            return {
              "value": r,
              "done": !0
            };
          }
          for (l.method = p, l.arg = v; ;) {
            var y = l.delegate;
            if (y) {
              var k = d(y, l);
              if (k) {
                if (k === b) {
                  continue;
                }
                return k;
              }
            }
            if ("next" === l.method) {
              l.sent = l._sent = l.arg;
            } else if ("throw" === l.method) {
              if (1 === u) {
                throw u = 4, l.arg;
              }
              l.dispatchException(l.arg);
            } else {
              "return" === l.method && l.abrupt("return", l.arg);
            }
            u = 3;
            var C = s(o, a, l);
            if ("normal" === C.type) {
              if (u = l.done ? 4 : 2, C.arg === b) {
                continue;
              }
              return {
                "value": C.arg,
                "done": l.done
              };
            }
            "throw" === C.type && (u = 4, l.method = "throw", l.arg = C.arg);
          }
        };
      }(o, l, new Context(u || [])), !0), v;
    }
    function s(r, o, a) {
      try {
        return {
          "type": "normal",
          "arg": r.call(o, a)
        };
      } catch (r) {
        return {
          "type": "throw",
          "arg": r
        };
      }
    }
    o.wrap = h;
    var b = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var k = {};
    c(k, p, (function() {
      return this;
    }));
    var C = Object.getPrototypeOf, _ = C && C(C(x([])));
    _ && _ !== a && l.call(_, p) && (k = _);
    var P = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(k);
    function g(r) {
      [ "next", "throw", "return" ].forEach((function(o) {
        c(r, o, (function(r) {
          return this._invoke(o, r);
        }));
      }));
    }
    function AsyncIterator(r, o) {
      function e(a, u, p, v) {
        var y = s(r[a], r, u);
        if ("throw" !== y.type) {
          var b = y.arg, k = b.value;
          return k && "object" == src_typeof(k) && l.call(k, "__await") ? o.resolve(k.__await).then((function(r) {
            e("next", r, p, v);
          }), (function(r) {
            e("throw", r, p, v);
          })) : o.resolve(k).then((function(r) {
            b.value = r, p(b);
          }), (function(r) {
            return e("throw", r, p, v);
          }));
        }
        v(y.arg);
      }
      var a;
      c(this, "_invoke", (function(r, l) {
        function i() {
          return new o((function(o, a) {
            e(r, l, o, a);
          }));
        }
        return a = a ? a.then(i, i) : i();
      }), !0);
    }
    function d(o, a) {
      var l = a.method, u = o.i[l];
      if (u === r) {
        return a.delegate = null, "throw" === l && o.i["return"] && (a.method = "return", 
        a.arg = r, d(o, a), "throw" === a.method) || "return" !== l && (a.method = "throw", 
        a.arg = new TypeError("The iterator does not provide a '" + l + "' method")), b;
      }
      var p = s(u, o.i, a.arg);
      if ("throw" === p.type) {
        return a.method = "throw", a.arg = p.arg, a.delegate = null, b;
      }
      var v = p.arg;
      return v ? v.done ? (a[o.r] = v.value, a.next = o.n, "return" !== a.method && (a.method = "next", 
      a.arg = r), a.delegate = null, b) : v : (a.method = "throw", a.arg = new TypeError("iterator result is not an object"), 
      a.delegate = null, b);
    }
    function w(r) {
      this.tryEntries.push(r);
    }
    function m(o) {
      var a = o[4] || {};
      a.type = "normal", a.arg = r, o[4] = a;
    }
    function Context(r) {
      this.tryEntries = [ [ -1 ] ], r.forEach(w, this), this.reset(!0);
    }
    function x(o) {
      if (null != o) {
        var a = o[p];
        if (a) {
          return a.call(o);
        }
        if ("function" == typeof o.next) {
          return o;
        }
        if (!isNaN(o.length)) {
          var u = -1, v = function e() {
            for (;++u < o.length; ) {
              if (l.call(o, u)) {
                return e.value = o[u], e.done = !1, e;
              }
            }
            return e.value = r, e.done = !0, e;
          };
          return v.next = v;
        }
      }
      throw new TypeError(src_typeof(o) + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, c(P, "constructor", GeneratorFunctionPrototype), 
    c(GeneratorFunctionPrototype, "constructor", GeneratorFunction), GeneratorFunction.displayName = c(GeneratorFunctionPrototype, y, "GeneratorFunction"), 
    o.isGeneratorFunction = function(r) {
      var o = "function" == typeof r && r.constructor;
      return !!o && (o === GeneratorFunction || "GeneratorFunction" === (o.displayName || o.name));
    }, o.mark = function(r) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(r, GeneratorFunctionPrototype) : (r.__proto__ = GeneratorFunctionPrototype, 
      c(r, y, "GeneratorFunction")), r.prototype = Object.create(P), r;
    }, o.awrap = function(r) {
      return {
        "__await": r
      };
    }, g(AsyncIterator.prototype), c(AsyncIterator.prototype, v, (function() {
      return this;
    })), o.AsyncIterator = AsyncIterator, o.async = function(r, a, l, u, p) {
      void 0 === p && (p = Promise);
      var v = new AsyncIterator(h(r, a, l, u), p);
      return o.isGeneratorFunction(a) ? v : v.next().then((function(r) {
        return r.done ? r.value : v.next();
      }));
    }, g(P), c(P, y, "Generator"), c(P, p, (function() {
      return this;
    })), c(P, "toString", (function() {
      return "[object Generator]";
    })), o.keys = function(r) {
      var o = Object(r), a = [];
      for (var l in o) {
        a.unshift(l);
      }
      return function t() {
        for (;a.length; ) {
          if ((l = a.pop()) in o) {
            return t.value = l, t.done = !1, t;
          }
        }
        return t.done = !0, t;
      };
    }, o.values = x, Context.prototype = {
      "constructor": Context,
      "reset": function reset(o) {
        if (this.prev = this.next = 0, this.sent = this._sent = r, this.done = !1, this.delegate = null, 
        this.method = "next", this.arg = r, this.tryEntries.forEach(m), !o) {
          for (var a in this) {
            "t" === a.charAt(0) && l.call(this, a) && !isNaN(+a.slice(1)) && (this[a] = r);
          }
        }
      },
      "stop": function stop() {
        this.done = !0;
        var r = this.tryEntries[0][4];
        if ("throw" === r.type) {
          throw r.arg;
        }
        return this.rval;
      },
      "dispatchException": function dispatchException(o) {
        if (this.done) {
          throw o;
        }
        var a = this;
        function n(r) {
          p.type = "throw", p.arg = o, a.next = r;
        }
        for (var l = a.tryEntries.length - 1; l >= 0; --l) {
          var u = this.tryEntries[l], p = u[4], v = this.prev, y = u[1], b = u[2];
          if (-1 === u[0]) {
            return n("end"), !1;
          }
          if (!y && !b) {
            throw Error("try statement without catch or finally");
          }
          if (null != u[0] && u[0] <= v) {
            if (v < y) {
              return this.method = "next", this.arg = r, n(y), !0;
            }
            if (v < b) {
              return n(b), !1;
            }
          }
        }
      },
      "abrupt": function abrupt(r, o) {
        for (var a = this.tryEntries.length - 1; a >= 0; --a) {
          var l = this.tryEntries[a];
          if (l[0] > -1 && l[0] <= this.prev && this.prev < l[2]) {
            var u = l;
            break;
          }
        }
        u && ("break" === r || "continue" === r) && u[0] <= o && o <= u[2] && (u = null);
        var p = u ? u[4] : {};
        return p.type = r, p.arg = o, u ? (this.method = "next", this.next = u[2], b) : this.complete(p);
      },
      "complete": function complete(r, o) {
        if ("throw" === r.type) {
          throw r.arg;
        }
        return "break" === r.type || "continue" === r.type ? this.next = r.arg : "return" === r.type ? (this.rval = this.arg = r.arg, 
        this.method = "return", this.next = "end") : "normal" === r.type && o && (this.next = o), 
        b;
      },
      "finish": function finish(r) {
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var a = this.tryEntries[o];
          if (a[2] === r) {
            return this.complete(a[4], a[3]), m(a), b;
          }
        }
      },
      "catch": function _catch(r) {
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var a = this.tryEntries[o];
          if (a[0] === r) {
            var l = a[4];
            if ("throw" === l.type) {
              var u = l.arg;
              m(a);
            }
            return u;
          }
        }
        throw Error("illegal catch attempt");
      },
      "delegateYield": function delegateYield(o, a, l) {
        return this.delegate = {
          "i": x(o),
          "r": a,
          "n": l
        }, "next" === this.method && (this.arg = r), b;
      }
    }, o;
  }
  function src_asyncGeneratorStep(r, o, a, l, u, p, v) {
    try {
      var y = r[p](v), b = y.value;
    } catch (r) {
      return void a(r);
    }
    y.done ? o(b) : Promise.resolve(b).then(l, u);
  }
  function src_asyncToGenerator(r) {
    return function() {
      var o = this, a = arguments;
      return new Promise((function(l, u) {
        var p = r.apply(o, a);
        function _next(r) {
          src_asyncGeneratorStep(p, l, u, _next, _throw, "next", r);
        }
        function _throw(r) {
          src_asyncGeneratorStep(p, l, u, _next, _throw, "throw", r);
        }
        _next(void 0);
      }));
    };
  }
  st.checkAndRedirect();
  function setupViewport() {
    var r = document.querySelector('meta[name="viewport"]');
    if (!r) {
      (r = document.createElement("meta")).name = "viewport";
      document.head.appendChild(r);
    }
    r.content = "width=device-width, initial-scale=1.0, viewport-fit=cover";
  }
  !function() {
    var r = null;
    var o = null;
    function injectStyles() {
      if (document.getElementById("tm-player-styles")) {
        return;
      }
      setupViewport();
      initCSSVariables();
    }
    function startScript() {
      return _startScript.apply(this, arguments);
    }
    function _startScript() {
      return (_startScript = src_asyncToGenerator(src_regeneratorRuntime().mark((function _callee() {
        var o, a, l, u;
        return src_regeneratorRuntime().wrap((function _callee$(p) {
          while (1) {
            switch (p.prev = p.next) {
             case 0:
              p.prev = 0;
              injectStyles();
              o = initUserExperienceEnhancer(true);
              (r = new B).loadSettings();
              (a = new V({
                "playerState": r
              })).init();
              p.next = 9;
              return initAutoLogin();

             case 9:
              if (l = p.sent) {}
              (u = new rt).init();
              p.next = 17;
              break;

             case 15:
              p.prev = 15;
              p.t0 = p["catch"](0);

             case 17:
             case "end":
              return p.stop();
            }
          }
        }), _callee, null, [ [ 0, 15 ] ]);
      })))).apply(this, arguments);
    }
    if ("complete" === document.readyState || "interactive" === document.readyState) {
      setTimeout(startScript, 100);
    } else {
      document.addEventListener("DOMContentLoaded", (function() {
        return setTimeout(startScript, 100);
      }));
    }
  }();
})();