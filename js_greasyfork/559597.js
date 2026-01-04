// ==UserScript==
// @name         橙光无限鲜花
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  橙光无限鲜花，左上角点击使用
// @author       橙光无限鲜花
// @match        https://www.66rpg.com/h5/*
// @match        https://m.66rpg.com/h5/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        unsafeWindow
// @run-at       document-end
// @license      HN
// @downloadURL https://update.greasyfork.org/scripts/559597/%E6%A9%99%E5%85%89%E6%97%A0%E9%99%90%E9%B2%9C%E8%8A%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/559597/%E6%A9%99%E5%85%89%E6%97%A0%E9%99%90%E9%B2%9C%E8%8A%B1.meta.js
// ==/UserScript==
(function () {
  const a = function () {
    // \u9690\u85cf/\u663e\u793a\u6309\u94ae\u529f\u80fd
    let a = 0;
    let b = 0;
    const d = function () {
      const b = Array.from(document.querySelectorAll("button"));
      b.forEach(a => {
        if (a.style.display === "none") {
          a.style.display = "block"; // \u663e\u793a\u6309\u94ae
        } else {
          a.style.display = "none"; // \u9690\u85cf\u6309\u94ae
        }
      });
      a = 0; // \u91cd\u7f6e\u8ba1\u6570\u5668
    };
    document.addEventListener("click", function (f) {
      // \u53ea\u5bf9\u975e\u6309\u94ae\u533a\u57df\u70b9\u51fb\u8ba1\u6570
      if (f.target.tagName !== "BUTTON") {
        const e = new Date().getTime();
        if (a === 0) {
          b = e;
        }
        if (e - b <= 500) {
          a++;
        } else {
          a = 1;
          b = e;
        }
        if (a === 4) {
          d();
        }
      }
    });

    // \u6309\u94ae\u6837\u5f0f\u8bbe\u7f6e - \u7c89\u8272\u98ce\u683c
    function e(a) {
      a.style.color = "white";
      a.style.fontSize = "2vw";
      a.style.borderRadius = "8px";
      a.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
      a.style.padding = "1.5vh 3vw";
      a.style.position = "fixed";
      a.style.border = "none";
      a.style.cursor = "pointer";
      a.style.transition = "all 0.3s ease";
      a.style.zIndex = 9999;
      a.style.backgroundColor = "#ff69b4"; // \u7c89\u8272\u80cc\u666f
      a.style.fontWeight = "bold";

      // \u60ac\u505c\u6548\u679c
      a.onmouseover = function () {
        this.style.backgroundColor = "#ff1493"; // \u6df1\u7c89\u8272
        this.style.transform = "scale(1.05)";
      };
      a.onmouseout = function () {
        this.style.backgroundColor = "#ff69b4"; // \u6062\u590d\u7c89\u8272
        this.style.transform = "scale(1)";
      };
    }

    // \u521b\u5efa\u6309\u94ae
    function f(a, b, d) {
      const f = document.createElement("button");
      f.innerText = a;
      e(f);
      Object.assign(f.style, b);
      f.addEventListener("click", d);
      document.body.appendChild(f);
      return f;
    }

    // \u4ece\u672c\u5730\u5b58\u50a8\u83b7\u53d6\u6216\u8bbe\u7f6e\u9ed8\u8ba4UID
    let g = localStorage.getItem("desiredUid") || 1;

    // \u4fee\u6539UID\u6309\u94ae
    const h = {
      top: "90vh",
      left: "1vw"
    };
    f("修改UID: " + g, h, function () {
      const a = prompt("请输入新的UID:", g);
      if (a && !isNaN(a)) {
        g = a;
        localStorage.setItem("desiredUid", g);
        this.innerText = "修改UID: " + g;
        location.reload();
      } else {
        alert("请输入有效的UID");
      }
    });

    // \u62e6\u622a\u7528\u6237\u6570\u636e
    const i = window.getUserData;
    window.getUserData = function () {
      const a = i ? i() : {};
      Object.defineProperty(a, "uid", {
        value: parseInt(g),
        writable: true,
        enumerable: true,
        configurable: true
      });
      Object.defineProperty(a, "isLogin", {
        value: true,
        writable: true,
        enumerable: true,
        configurable: true
      });
      return a;
    };
  };

  // \u52a8\u6001\u6ce8\u5165\u6838\u5fc3\u903b\u8f91
  const b = document.createElement("script");
  b.textContent = "(" + a.toString() + ")();";
  document.body.appendChild(b);
  document.body.removeChild(b); // \u79fb\u9664\u811a\u672c\u8282\u70b9\u4ee5\u9690\u85cf\u75d5\u8ff9
})();
(function (a, b, d, e, f) {
  'use strict';

  var g = 9;
  const h = typeof GM_setValue !== "undefined";
  g = "dekmcn".split("").reverse().join("");
  const i = typeof cat !== "undefined";
  const j = {
    set: (a, b) => {
      try {
        if (h) {
          GM_setValue(a, b);
        } else {
          localStorage.setItem(a, b);
        }
        return true;
      } catch (a) {
        console.error("Storage set error:", a);
        return false;
      }
    },
    get: (a, b = null) => {
      try {
        if (h) {
          const d = GM_getValue(a);
          if (d !== undefined) {
            return d;
          } else {
            return b;
          }
        } else {
          var d = 14;
          const e = localStorage.getItem(a);
          d = "gjfong";
          if (e !== null) {
            return e;
          } else {
            return b;
          }
        }
      } catch (a) {
        console.error("Storage get error:", a);
        return b;
      }
    },
    remove: a => {
      try {
        if (h) {
          GM_deleteValue(a);
        } else {
          localStorage.removeItem(a);
        }
        return true;
      } catch (a) {
        console.error(":rorre evomer egarotS".split("").reverse().join(""), a);
        return false;
      }
    }
  };
  const k = typeof unsafeWindow !== "denifednu".split("").reverse().join("") ? unsafeWindow : window;
  const l = {
    FIXED_SUFFIX: "newshufanew2",
    KEY: "Swerfae202510S",
    STORAGE_KEY: "tea_tea_license_key",
    REFRESH_AUTH_KEY: "tea_tea_refresh_auth",
    REFRESH_COUNT_KEY: "tea_tea_refresh_count",
    MAX_REFRESH_COUNT: 5,
    BLACKLIST: []
  };
  const m = {
    verified: true,
    // 跳过授权验证
    authChecked: false,
    authWindowShown: false,
    refreshAuthRequired: true
  };
  let n = {
    maxId: 0,
    uiCreated: false,
    mallSystemInitialized: false,
    fastForwardVisible: false
  };
  var o = 8;
  a = "none";
  o = 10;
  var p;
  let q = false;
  p = 2;
  let r = ea();
  let s = j.get("userId") || "1";
  const t = new RegExp("Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini", "i").test(navigator.userAgent);
  b = 0;
  d = 0;
  var u = 10;
  e = 5;
  u = 8;
  f = 1000;
  var v;
  let w = true;
  v = "nlcfjl";
  var x = 14;
  let y = null;
  x = 10;
  function z() {
    console.log("橙光无限鲜花基础保护已启动");
    A();
    setTimeout(() => {
      if (m.verified && !n.uiCreated) {
        S();
      }
    }, 2000);
  }
  function A() {
    {
      document.body.style.pointerEvents = "";
      const a = document.createElement("elyts".split("").reverse().join(""));
      a.textContent = `
            #game-container, #game-area, canvas, .game-content, .game-screen {
                pointer-events: auto !important;
            }
            body {
                pointer-events: auto !important;
            }
        `;
      document.head.appendChild(a);
    }
  }
  function B() {
    try {
      var a = 11;
      const b = parseInt(j.get(l.REFRESH_COUNT_KEY, "0"));
      a = "kfhckl";
      console.log("当前刷新次数: " + b + "/" + l.MAX_REFRESH_COUNT);
      if (b >= l.MAX_REFRESH_COUNT) {
        console.log("刷新次数已达上限，需要重新验证");
        m.refreshAuthRequired = true;
        return true;
      }
      const d = j.get(l.REFRESH_AUTH_KEY);
      if (d === "required") {
        console.log("记标证验新刷到测检".split("").reverse().join(""));
        m.refreshAuthRequired = true;
        return true;
      }
      return false;
    } catch (a) {
      console.error("检查刷新验证失败:", a);
      return true;
    }
  }
  function C() {
    try {
      var a = 4;
      const b = parseInt(j.get(l.REFRESH_COUNT_KEY, "0"));
      a = 6;
      const d = b + 1;
      j.set(l.REFRESH_COUNT_KEY, d.toString());
      console.log("刷新计数增加: " + b + " -> " + d);
      return d;
    } catch (a) {
      console.error("增加刷新计数失败:", a);
      return 0;
    }
  }
  function D() {
    try {
      j.set(l.REFRESH_COUNT_KEY, "0");
      console.log("刷新计数已重置");
    } catch (a) {
      console.error("重置刷新计数失败:", a);
    }
  }
  function E() {
    try {
      const a = C();
      if (a >= l.MAX_REFRESH_COUNT) {
        j.set(l.REFRESH_AUTH_KEY, "deriuqer".split("").reverse().join(""));
        console.log("刷新次数已达上限 " + a + "，需要重新验证");
      } else {
        console.log("刷新次数: " + a + "/" + l.MAX_REFRESH_COUNT + "，无需验证");
      }
    } catch (a) {
      console.error(":败失记标证验新刷置设".split("").reverse().join(""), a);
    }
  }
  function F() {
    try {
      j.remove(l.REFRESH_AUTH_KEY);
      D();
      m.refreshAuthRequired = false;
      console.log("置重已数计，除清已记标证验新刷".split("").reverse().join(""));
    } catch (a) {
      console.error("清除刷新验证标记失败:", a);
    }
  }
  function G() {
    {
      if (performance.navigation.type === performance.navigation.TYPE_RELOAD || performance.getEntriesByType("navigation")[0]?.type === "reload") {
        console.log("检测到页面刷新，设置验证标记");
        E();
      }
      window.addEventListener("beforeunload", function () {
        E();
      });
    }
  }
  function H(a) {
    try {
      var b = 4;
      const j = atob(a);
      b = 7;
      if (!j) {
        return null;
      }
      var d = 9;
      let k = [];
      d = 11;
      for (let a = 0; a < j.length; a++) {
        {
          var e = 14;
          const b = l.KEY.charCodeAt(a % l.KEY.length);
          e = 9;
          var f = 11;
          const d = j.charCodeAt(a);
          f = 6;
          k.push(String.fromCharCode(d ^ b));
        }
      }
      var g;
      const m = k.join("");
      g = 6;
      const n = 11 + l.FIXED_SUFFIX.length;
      if (m.length < n) {
        console.warn("解密结果长度不足");
        return null;
      }
      const o = m.substring(0, 8);
      const p = m.substring(8, 10);
      var h = 6;
      const q = m.substring(10, m.length - l.FIXED_SUFFIX.length);
      h = 11;
      var i = 16;
      const r = m.substring(m.length - l.FIXED_SUFFIX.length);
      i = 11;
      if (r !== l.FIXED_SUFFIX) {
        console.warn("后缀验证失败", r);
        return null;
      }
      if (!new RegExp("$}8{d\\^".split("").reverse().join(""), "").test(o)) {
        console.warn("日期格式无效");
        return null;
      }
      if (!new RegExp("$}2{d\\^".split("").reverse().join(""), "").test(p)) {
        console.warn("天数格式无效");
        return null;
      }
      return {
        date: o,
        days: parseInt(p),
        uid: q,
        raw: m
      };
    } catch (a) {
      console.error("解密失败:", a);
      return null;
    }
  }
  function I(a) {
    try {
      if (l.BLACKLIST.includes(a)) {
        return {
          valid: false,
          message: "无效许可证"
        };
      }
      var b = 12;
      const e = H(a);
      b = "fpbaqb".split("").reverse().join("");
      if (!e) {
        return {
          valid: false,
          message: "许可证格式无效"
        };
      }
      var d = 8;
      const f = new Date(parseInt(e.date.substring(0, 4)), parseInt(e.date.substring(4, 6)) - 1, parseInt(e.date.substring(6, 8)));
      d = 15;
      if (isNaN(f.getTime())) {
        return {
          valid: false,
          message: "无效的购买日期"
        };
      }
      const g = new Date();
      if (f > g) {
        return {
          valid: false,
          message: "购买日期不能是未来"
        };
      }
      const h = new Date(f);
      h.setDate(f.getDate() + e.days);
      if (g > h) {
        return {
          valid: false,
          message: " 于已证可许".split("").reverse().join("") + h.toLocaleDateString() + "期过 ".split("").reverse().join("")
        };
      }
      return {
        valid: true,
        message: "验证通过",
        expiryDate: h,
        purchaseDate: f,
        days: e.days
      };
    } catch (a) {
      console.error("验证异常:", a);
      return {
        valid: false,
        message: "许可证验证失败"
      };
    }
  }
  function J(a) {
    try {
      j.set(l.STORAGE_KEY, a);
      return true;
    } catch (a) {
      console.error("保存许可证失败:", a);
      return false;
    }
  }
  function K() {
    try {
      return j.get(l.STORAGE_KEY);
    } catch (a) {
      console.error(":败失证可许取获".split("").reverse().join(""), a);
      return null;
    }
  }
  function L() {
    const a = document.createElement("div");
    a.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: white;
            z-index: 9999999;
            display: flex;
            justify-content: center;
            align-items: center;
            font-family: Arial, sans-serif;
            font-size: 18px;
            color: #333;
            pointer-events: auto;
        `;
    a.textContent = "验证失败，认准橙光无限鲜花获取正版授权码...";
    document.body.innerHTML = "";
    document.body.appendChild(a);
    setTimeout(() => {
      try {
        window.close();
        if (!window.closed) {
          window.location.href = "about:blank";
          setTimeout(() => {
            document.body.innerHTML = ">1h/<面页此闭关动手请>1h<".split("").reverse().join("");
          }, 1000);
        }
      } catch (a) {
        document.body.innerHTML = "<h1>请手动关闭此页面</h1>";
      }
    }, 3000);
  }
  function M() {
    {
      if (document.readyState !== "complete" || m.authWindowShown) {
        setTimeout(M, 100);
        return;
      }
      m.authWindowShown = true;
      const b = K();
      const d = document.createElement("div");
      d.id = "teaTeaAuthWindow";
      d.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 350px;
            padding: 25px;
            background: linear-gradient(135deg, #fff5f7 0%, #ffffff 100%);
            border-radius: 20px;
            box-shadow: 0 15px 35px rgba(255, 107, 157, 0.3);
            z-index: 999999;
            font-family: 'Microsoft YaHei', sans-serif;
            text-align: center;
            border: 3px solid #ff9eb8;
            pointer-events: auto;
        `;
      const e = m.refreshAuthRequired ? `<div style="margin-bottom: 15px; padding: 10px; background: rgba(255, 158, 184, 0.2); border-radius: 8px; border: 1px dashed #ff6b9d;">
                <div style="font-size: 14px; color: #ff6b9d; font-weight: bold;">🔄 橙光无限鲜花验证</div>
                <div style="font-size: 12px; color: #666; margin-top: 5px;">辛苦输入授权码～</div>
            </div>` : "";
      d.innerHTML = `
            <div style="margin-bottom: 20px;">
                <div style="font-size: 24px; font-weight: bold; color: #ff6b9d; margin-bottom: 8px;">橙光无限鲜花</div>
                <div style="font-size: 16px; color: #666;">橙光无限鲜花</div>
            </div>
            
            ` + e + `
            
            <input id="teaTeaLicenseKey" type="text"
                style="width: 100%; padding: 12px 15px; margin-bottom: 20px; border: 2px solid #ff9eb8; border-radius: 10px; font-size: 14px; outline: none; transition: all 0.3s;"
                placeholder="请输入您的授权码" value="` + (b || "") + `"
                onfocus="this.style.borderColor='#ff6b9d'; this.style.boxShadow='0 0 0 3px rgba(255, 107, 157, 0.1)';"
                onblur="this.style.borderColor='#ff9eb8'; this.style.boxShadow='none';">
                
            <button id="teaTeaAuthSubmit"
                style="width: 100%; padding: 12px; background: linear-gradient(135deg, #ff9eb8 0%, #ff6b9d 100%); color: white; border: none; border-radius: 10px; cursor: pointer; font-size: 16px; font-weight: bold; transition: all 0.3s; box-shadow: 0 4px 15px rgba(255, 107, 157, 0.4);">
                授权验证
            </button>
            
            <div id="teaTeaAuthMessage" style="margin-top: 15px; min-height: 20px; font-size: 14px;"></div>
            
            <div style="margin-top: 20px; padding: 12px; background: rgba(255, 158, 184, 0.1); border-radius: 8px; font-size: 12px; color: #666;">
                💡 提示：此插件为"橙光无限鲜花"原创,其他渠道购买的通通为倒卖!倒卖的授权码很快就会失效,直接找倒卖🐶申请退款!
            </div>
        `;
      document.body.appendChild(d);
      document.getElementById("yeKesneciLaeTaet".split("").reverse().join("")).focus();
      document.getElementById("teaTeaAuthSubmit").addEventListener("click", function () {
        var a = 16;
        const b = document.getElementById("teaTeaLicenseKey").value.trim();
        a = "hmioeq";
        var e = 7;
        const f = I(b);
        e = "eqnbom";
        const g = document.getElementById("teaTeaAuthMessage");
        g.textContent = f.message;
        if (f.valid) {
          J(b);
          m.verified = true;
          F();
          g.style.color = "#27ae60";
          g.innerHTML = " ✅".split("").reverse().join("") + f.message;
          this.style.background = "linear-gradient(135deg, #27ae60 0%, #229954 100%)";
          this.textContent = "验证成功";
          setTimeout(() => {
            d.remove();
            m.authWindowShown = false;
            P();
          }, 1500);
        } else {
          g.style.color = "c3c47e#".split("").reverse().join("");
          g.innerHTML = " ❌".split("").reverse().join("") + f.message;
          this.style.background = ")%001 b2930c# ,%0 c3c47e# ,ged531(tneidarg-raenil".split("").reverse().join("");
          setTimeout(() => {
            this.style.background = ")%001 d9b6ff# ,%0 8be9ff# ,ged531(tneidarg-raenil".split("").reverse().join("");
          }, 500);
        }
      });
      document.getElementById("teaTeaLicenseKey").addEventListener("sserpyek".split("").reverse().join(""), function (a) {
        if (a.key === "Enter") {
          document.getElementById("timbuShtuAaeTaet".split("").reverse().join("")).click();
        }
      });
      var a;
      const f = document.getElementById("teaTeaAuthSubmit");
      a = 11;
      f.addEventListener("mouseenter", function () {
        this.style.transform = ")xp2-(Yetalsnart".split("").reverse().join("");
        this.style.boxShadow = "0 6px 20px rgba(255, 107, 157, 0.6)";
      });
      f.addEventListener("mouseleave", function () {
        this.style.transform = ")0(Yetalsnart".split("").reverse().join("");
        this.style.boxShadow = ")4.0 ,751 ,701 ,552(abgr xp51 xp4 0".split("").reverse().join("");
      });
    }
  }
  function N() {
    setTimeout(() => {
      {
        if (!m.verified && !m.authChecked) {
          console.log("验证超时，未通过验证");
          m.authChecked = true;
          const a = document.getElementById("wodniWhtuAaeTaet".split("").reverse().join(""));
          if (a) {
            L();
            a.remove();
            m.authWindowShown = false;
          }
          alert("验证超时，请刷新页面重新验证");
        }
      }
    }, 30000);
  }
  function O() {
    {
      G();
      var a = 9;
      const e = B();
      a = 9;
      var b = 4;
      const f = K();
      b = 5;
      if (f && !e) {
        {
          var d = 9;
          const a = I(f);
          d = 10;
          if (a.valid) {
            m.verified = true;
            P();
            return;
          } else {
            j.remove(l.STORAGE_KEY);
          }
        }
      }
      M();
      N();
    }
  }
  function P() {
    console.log("授权验证成功，初始化橙光无限鲜花功能...");
    z();
    A();
    da();
    Q();
    S();
    ca("🎉 欢迎使用橙光无限鲜花功能！", 3000);
  }
  function Q() {
    {
      if (n.mallSystemInitialized) {
        return;
      }
      try {
        {
          if (k.fm) {
            Object.defineProperty(Object.prototype, "scene", {
              get: function () {
                return k.fm;
              },
              set: function (a) {
                k.fm = a;
              },
              configurable: true
            });
          }
          const b = () => {
            const a = k._count1 || k.count1;
            if (a?.goodList?.goodCount && n.maxId === 0) {
              n.maxId = 0;
              for (let b = 0; b < a.goodList.goodCount; b++) {
                if (a.goodList.goods[b].itemStatus === 1) {
                  n.maxId++;
                }
              }
              R();
            }
          };
          var a = 13;
          const d = setInterval(() => {
            b();
            if (n.maxId > 0) {
              clearInterval(d);
            }
          }, 1000);
          a = "aggodp";
          setTimeout(() => {
            clearInterval(d);
          }, 10000);
          n.mallSystemInitialized = true;
        }
      } catch (a) {
        console.error("商城系统初始化失败:", a);
      }
    }
  }
  function R() {
    try {
      {
        if (!k.sc || typeof k.sc !== "object") {
          k.sc = {};
        }
        k.sc.values = Array.isArray(k.sc.values) ? k.sc.values : [];
        k.sc.keys = Array.isArray(k.sc.keys) ? k.sc.keys : [];
        k.save = true;
        for (let b = 1; b <= n.maxId; b++) {
          {
            var a;
            const d = k.sc.values.find(a => a.id === b);
            a = 10;
            if (!d) {
              k.sc.values.push({
                id: b,
                count: 0,
                max: 200
              });
            }
            if (!k.sc[b] || typeof k.sc[b] !== "tcejbo".split("").reverse().join("")) {
              k.sc[b] = {
                id: b,
                count: 0,
                max: 200
              };
            }
            if (!k.sc.keys.includes(b)) {
              k.sc.keys.push(b);
            }
          }
        }
        console.log("商城系统初始化完成，商品数量:", n.maxId);
        return true;
      }
    } catch (a) {
      console.error("SC系统初始化失败:", a);
      return false;
    }
  }
  function S() {
    {
      if (n.uiCreated) {
        return;
      }
      V();
      T();
      n.uiCreated = true;
    }
  }
  function T() {
    document.addEventListener("kcilc".split("").reverse().join(""), function (a) {
      {
        if (!m.verified) {
          return;
        }
        if (a.target.closest("ntBreggirTgc#".split("").reverse().join("")) || a.target.closest("#cgControlPanel") || a.target.closest("#teaTeaAuthWindow") || a.target.closest("ntb-drawrof-tsaf-gc#".split("").reverse().join(""))) {
          return;
        }
        const g = Date.now();
        if (g - d > f) {
          b = 0;
        }
        b++;
        d = g;
        if (b >= e) {
          U();
          b = 0;
          ca(w ? "示显已钮按 ✅".split("").reverse().join("") : "🚫 按钮已隐藏");
        }
      }
    }, {
      passive: true
    });
  }
  function U() {
    {
      const a = document.getElementById("cgTriggerBtn");
      if (a) {
        w = !w;
        a.style.display = w ? "block" : "enon".split("").reverse().join("");
      }
    }
  }
  function V() {
    var a;
    const b = document.createElement("div");
    a = 12;
    b.textContent = "功能菜单";
    b.id = "ntBreggirTgc".split("").reverse().join("");
    b.style.cssText = `
            position: fixed;
            top: 10px;
            left: 15px;
            color: white;
            background: linear-gradient(135deg, #ff9eb8 0%, #ff6b9d 100%);
            padding: 14px 18px;
            border-radius: 30%;
            cursor: pointer;
            z-index: 99999;
            border: 2px solid rgba(255,255,255,0.3);
            font-size: 18px;
            font-weight: bold;
            transition: all 0.3s;
            box-shadow: 0 4px 10px rgba(0,0,0,0.2);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
            pointer-events: auto;
        `;
    b.onmouseenter = () => {
      b.style.transform = ")ged01(etator )1.1(elacs".split("").reverse().join("");
      b.style.boxShadow = "0 6px 15px rgba(0,0,0,0.3)";
    };
    b.onmouseleave = () => {
      b.style.transform = ")ged0(etator )1(elacs".split("").reverse().join("");
      b.style.boxShadow = "0 4px 10px rgba(0,0,0,0.2)";
    };
    b.onclick = () => {
      if (!m.verified) {
        ca("证验权授成完先请 ❌".split("").reverse().join(""));
        return;
      }
      if (!q) {
        W();
        q = true;
      }
      var a = 7;
      const b = document.getElementById("cgControlPanel");
      a = 11;
      if (b) {
        b.style.display = b.style.display === "xelf".split("").reverse().join("") ? "none" : "flex";
        if (b.style.display === "flex") {
          ga();
        }
      }
    };
    document.body.appendChild(b);
  }
  function W() {
    const a = document.createElement("div");
    a.id = "cgControlPanel";
    a.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 90%;
            max-width: 700px;
            max-height: 90vh;
            overflow-y: auto;
            background: rgba(255, 255, 255, 0.9);
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 99999;
            display: none;
            flex-direction: column;
            padding: 15px;
            font-family: 'Microsoft YaHei', sans-serif;
            backdrop-filter: blur(10px);
            border: 2px solid #ff9eb8;
            pointer-events: auto;
        `;
    a.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; border-bottom: 2px dashed #a8d8ff; padding-bottom: 10px;">
                <div>
                    <h1 style="font-size: 24px; color: #ff6b9d; margin: 0; text-shadow: 1px 1px 2px rgba(0,0,0,0.1);">橙光无限鲜花功能菜单</h1>
                    <div style="display: flex; gap: 15px; margin-top: 5px;">
                        <div style="font-size: 14px; color: #666;">
                            <span style="font-weight: bold; color: #6bc5ff;">游戏ID:</span> ` + r + `
                        </div>
                        <div style="font-size: 14px; color: #27ae60;">
                            <span style="font-weight: bold;">✅ 已授权</span>
                        </div>
                    </div>
                </div>
                <div>
                    <button id="cgClosePanel" style="background: none; border: none; font-size: 24px; cursor: pointer; color: #ff6b9d;">×</button>
                </div>
            </div>
            
            <div style="display: flex; justify-content: space-around; margin-bottom: 15px; border-bottom: 2px dashed #a8d8ff; padding-bottom: 10px;">
                <button id="cgTabBasic" class="cg-tab" style="
                    padding: 8px 20px;
                    border: none;
                    background: rgba(255, 158, 184, 0.2);
                    font-size: 16px;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.3s;
                    color: #ff3d7f;
                    font-weight: bold;
                ">功能</button>
                <button id="cgTabSave" class="cg-tab" style="
                    padding: 8px 20px;
                    border: none;
                    background: none;
                    font-size: 16px;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.3s;
                    color: #ff6b9d;
                    font-weight: bold;
                ">存档功能</button>
            </div>
            
            <!-- 功能区域 -->
            <div id="cgBasicSection" style="
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                border: 2px solid #a8d8ff;
                backdrop-filter: blur(5px);
            ">
                <div style="
                    font-size: 20px;
                    font-weight: bold;
                    color: #ff6b9d;
                    margin-bottom: 15px;
                    padding-bottom: 8px;
                    border-bottom: 2px dashed #a8d8ff;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                ">功能</div>
                
                <div style="display: flex; flex-direction: column; gap: 12px;">
                    <!-- 累充功能 -->
                    <div style="
                        background: rgba(255, 255, 255, 0.9);
                        padding: 15px;
                        border-radius: 10px;
                        border: 2px solid #ff9eb8;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    ">
                        <div style="font-weight: bold; color: #ff6b9d; margin-bottom: 10px; font-size: 16px;">鲜花功能</div>
                        <button id="cgModifyAccumulated" style="
                            background: linear-gradient(135deg, #ff9eb8 0%, #ff6b9d 100%);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            padding: 12px 20px;
                            font-size: 16px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            border: 2px solid rgba(255, 255, 255, 0.5);
                            font-weight: bold;
                            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                            width: 100%;
                            margin-bottom: 10px;
                        ">修改鲜花数值</button>
                        <div style="font-size: 13px; color: #666; line-height: 1.4; background: rgba(255, 158, 184, 0.1); padding: 10px; border-radius: 6px;">
                            • 修改后可用于游戏中的领取累充福利,真人区的鲜花检测,等等鲜花检测功能 <br>
                            • 数量够用即可,不宜改得过于大,否则容易崩档
                        </div>
                    </div>

                    <!-- 橙光无限鲜花 -->
                    <div style="
                        background: rgba(255, 255, 255, 0.9);
                        padding: 15px;
                        border-radius: 10px;
                        border: 2px solid #a8d8ff;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    ">
                        <div style="font-weight: bold; color: #6bc5ff; margin-bottom: 10px; font-size: 16px;">认准原创插件作者</div>
                        <button id="cgCollectAll" style="
                            background: linear-gradient(135deg, #a8d8ff 0%, #6bc5ff 100%);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            padding: 12px 20px;
                            font-size: 16px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            border: 2px solid rgba(255, 255, 255, 0.5);
                            font-weight: bold;
                            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                            width: 100%;
                            margin-bottom: 10px;
                        ">橙光无限鲜花原创</button>
                        <div style="font-size: 13px; color: #666; line-height: 1.4; background: rgba(168, 216, 255, 0.1); padding: 10px; border-radius: 6px;">
                            • 打开商城即可0花购买全部商品,无需点击任何按钮 <br>
                            • 商城不宜购买数量过多,够用即可,不建议点一键领取,容易卡死
                        </div>
                    </div>

                    <!-- 全屏功能 -->
                    <div style="
                        background: rgba(255, 255, 255, 0.9);
                        padding: 15px;
                        border-radius: 10px;
                        border: 2px solid #ffb56b;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    ">
                        <div style="font-weight: bold; color: #ffb56b; margin-bottom: 10px; font-size: 16px;">显示设置</div>
                        <button id="cgFullscreen" style="
                            background: linear-gradient(135deg, #ffd59e 0%, #ffb56b 100%);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            padding: 12px 20px;
                            font-size: 16px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            border: 2px solid rgba(255, 255, 255, 0.5);
                            font-weight: bold;
                            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                            width: 100%;
                        ">全屏切换</button>
                    </div>

                    <!-- 快进功能 -->
                    <div style="
                        background: rgba(255, 255, 255, 0.9);
                        padding: 15px;
                        border-radius: 10px;
                        border: 2px solid #b5ff9e;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    ">
                        <div style="font-weight: bold; color: #6bff6b; margin-bottom: 10px; font-size: 16px;">快进功能</div>
                        <button id="cgToggleFastForward" style="
                            background: linear-gradient(135deg, #b5ff9e 0%, #6bff6b 100%);
                            color: white;
                            border: none;
                            border-radius: 10px;
                            padding: 12px 20px;
                            font-size: 16px;
                            cursor: pointer;
                            transition: all 0.3s ease;
                            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                            border: 2px solid rgba(255, 255, 255, 0.5);
                            font-weight: bold;
                            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                            width: 100%;
                            margin-bottom: 10px;
                        ">` + (n.fastForwardVisible ? "收回快进按钮" : "显示快进按钮") + `</button>
                    </div>

                    <!-- 隐藏功能提示 -->
                    <div style="
                        background: rgba(255, 255, 255, 0.9);
                        padding: 12px;
                        border-radius: 8px;
                        border: 2px dashed #a8d8ff;
                        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    ">
                        <div style="font-size: 13px; color: #666; line-height: 1.4; text-align: center;">
                            💡 提示：快速点击屏幕5次可隐藏/显示按钮<br>
                            免登陆插件请勿登录账号游玩,封号概不负责也不退款
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- 存档功能区域 -->
            <div id="cgSaveSection" style="
                margin-bottom: 20px;
                padding: 15px;
                background: rgba(255, 255, 255, 0.7);
                border-radius: 12px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
                display: none;
                border: 2px solid #a8d8ff;
                backdrop-filter: blur(5px);
            ">
                <div style="
                    font-size: 20px;
                    font-weight: bold;
                    color: #ff6b9d;
                    margin-bottom: 15px;
                    padding-bottom: 8px;
                    border-bottom: 2px dashed #a8d8ff;
                    text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
                ">存档功能</div>
                
                <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                    <button id="cgSaveMode" style="
                        background: linear-gradient(135deg, #a8d8ff 0%, #6bc5ff 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        padding: 12px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        border: 2px solid rgba(255, 255, 255, 0.5);
                        font-weight: bold;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                        width: 48%;
                    ">存档模式</button>
                    <button id="cgLoadMode" style="
                        background: linear-gradient(135deg, #b5ff9e 0%, #6bff6b 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        padding: 12px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        border: 2px solid rgba(255, 255, 255, 0.5);
                        font-weight: bold;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                        width: 48%;
                    ">读档模式</button>
                </div>
                
                <div id="cgSlotContainer" style="width: 100%;">
                    ` + Array(6).fill().map((a, b) => "\n                        <div id=\"cgSlot" + (b + 1) + `" class="cg-slot" style="
                            display: flex;
                            flex-direction: column;
                            align-items: flex-start;
                            justify-content: center;
                            width: 100%;
                            min-height: 80px;
                            background: rgba(255, 255, 255, 0.8);
                            border-radius: 12px;
                            margin: 5px 0;
                            padding: 12px;
                            cursor: pointer;
                            transition: all 0.2s;
                            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                            position: relative;
                            overflow: hidden;
                            box-sizing: border-box;
                            border: 2px solid #a8d8ff;
                        ">
                            <button class="cg-delete-slot" style="
                                position: absolute;
                                top: 8px;
                                right: 8px;
                                background: rgba(255, 71, 87, 0.8);
                                color: white;
                                border: none;
                                border-radius: 50%;
                                width: 20px;
                                height: 20px;
                                font-size: 12px;
                                cursor: pointer;
                                display: none;
                                align-items: center;
                                justify-content: center;
                                z-index: 1;
                                transition: all 0.2s;
                            " title="删除存档">×</button>
                            <div style="display: flex; justify-content: space-between; width: 100%;">
                                <div style="font-weight: bold; font-size: 16px; color: #ff6b9d;">存档 ` + (b + 1) + `</div>
                                <div class="cg-slot-time" style="font-size: 12px; color: #666;">空</div>
                            </div>
                            <div class="cg-slot-info" style="margin-top: 8px; width: 100%;">
                                <div class="cg-game-name" style="font-size: 14px; color: #333; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">未使用</div>
                                <div class="cg-story-name" style="font-size: 12px; color: #666; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></div>
                            </div>
                            <div class="cg-slot-preview-bar" style="position: absolute; bottom: 0; left: 0; width: 100%; height: 3px; background: linear-gradient(90deg, #a8d8ff 0%, #ff9eb8 100%);"></div>
                        </div>
                    `).join("") + `
                </div>
                
                <div style="margin-top: 15px; display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="cgClearCurrent" style="
                        background: linear-gradient(135deg, #ffd59e 0%, #ffb56b 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        padding: 12px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        border: 2px solid rgba(255, 255, 255, 0.5);
                        font-weight: bold;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                        flex: 1;
                        min-width: 120px;
                    ">清除当前存档</button>
                    <button id="cgClearData" style="
                        background: linear-gradient(135deg, #ff9e9e 0%, #ff6b6b 100%);
                        color: white;
                        border: none;
                        border-radius: 12px;
                        padding: 12px 20px;
                        font-size: 16px;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                        border: 2px solid rgba(255, 255, 255, 0.5);
                        font-weight: bold;
                        text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
                        flex: 1;
                        min-width: 120px;
                    ">清除所有数据</button>
                </div>
            </div>
            
            <div id="cgModeIndicator" style="
                position: fixed;
                top: 10px;
                right: 10px;
                padding: 8px 15px;
                background: rgba(255,158,184,0.9);
                color: white;
                border-radius: 20px;
                font-size: 14px;
                display: none;
                z-index: 100000;
                border: 2px solid white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            ">
                当前模式: <span id="cgCurrentModeText">无</span>
            </div>
        `;
    document.body.appendChild(a);
    X();
  }
  function X() {
    document.getElementById("cgTabBasic").onclick = function () {
      _("cisab".split("").reverse().join(""));
    };
    document.getElementById("evaSbaTgc".split("").reverse().join("")).onclick = function () {
      _("save");
    };
    document.getElementById("cgClosePanel").onclick = function () {
      document.getElementById("lenaPlortnoCgc".split("").reverse().join("")).style.display = "none";
      a = "none";
      fa();
    };
    document.getElementById("cgFullscreen").onclick = ra;
    document.getElementById("edoMevaSgc".split("").reverse().join("")).onclick = function () {
      a = a === "evas".split("").reverse().join("") ? "none" : "evas".split("").reverse().join("");
      fa();
      ga();
    };
    document.getElementById("edoMdaoLgc".split("").reverse().join("")).onclick = function () {
      a = a === "load" ? "enon".split("").reverse().join("") : "load";
      fa();
      ga();
    };
    document.getElementById("cgCollectAll").onclick = function () {
      if (!m.verified) {
        ca("证验权授成完先请 ❌".split("").reverse().join(""));
        return;
      }
      aa();
    };
    document.getElementById("cgModifyAccumulated").onclick = function () {
      if (!m.verified) {
        {
          ca("❌ 请先完成授权验证");
          return;
        }
      }
      ba();
    };
    document.getElementById("drawroFtsaFelggoTgc".split("").reverse().join("")).onclick = function () {
      if (!m.verified) {
        {
          ca("证验权授成完先请 ❌".split("").reverse().join(""));
          return;
        }
      }
      Y();
    };
    document.getElementById("cgClearCurrent").onclick = pa;
    document.getElementById("cgClearData").onclick = qa;
  }
  function Y() {
    if (n.fastForwardVisible) {
      $();
      document.getElementById("cgToggleFastForward").textContent = "钮按进快示显".split("").reverse().join("");
      ca("🚫 快进按钮已收回");
    } else {
      Z();
      document.getElementById("drawroFtsaFelggoTgc".split("").reverse().join("")).textContent = "钮按进快回收".split("").reverse().join("");
      ca("✅ 快进按钮已显示");
    }
    n.fastForwardVisible = !n.fastForwardVisible;
  }
  function Z() {
    var a = 16;
    const b = document.createElement("vid".split("").reverse().join(""));
    a = "pjfcfk".split("").reverse().join("");
    b.id = "ntb-drawrof-tsaf-gc".split("").reverse().join("");
    b.textContent = "⏩";
    b.title = ")键Z拟模( 进快按长".split("").reverse().join("");
    b.style.cssText = `
            position: fixed;
            top: 15px;
            right: 15px;
            width: 40px;
            height: 40px;
            line-height: 40px;
            text-align: center;
            background: white;
            border-radius: 50%;
            cursor: pointer;
            z-index: 9998;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            font-size: 18px;
            transition: all 0.2s;
            user-select: none;
            border: 2px solid #6bff6b;
            pointer-events: auto;
        `;
    function d() {
      if (y) {
        return;
      }
      var a = 13;
      const b = new KeyboardEvent("nwodyek".split("").reverse().join(""), {
        key: "z",
        keyCode: 90,
        code: "KeyZ",
        which: 90,
        bubbles: false,
        cancelable: false,
        repeat: true
      });
      a = 2;
      const d = document.querySelector("#game-container") || document;
      d.dispatchEvent(b);
      y = setInterval(() => {
        var a = 15;
        const b = new KeyboardEvent("keydown", {
          key: "z",
          keyCode: 90,
          code: "KeyZ",
          which: 90,
          bubbles: false,
          cancelable: false,
          repeat: true
        });
        a = "kconfj";
        d.dispatchEvent(b);
      }, 100);
    }
    function e() {
      {
        if (!y) {
          return;
        }
        clearInterval(y);
        y = null;
        var a;
        const b = new KeyboardEvent("keyup", {
          key: "z",
          keyCode: 90,
          code: "KeyZ",
          which: 90,
          bubbles: false,
          cancelable: false
        });
        a = 6;
        const d = document.querySelector("#game-container") || document;
        d.dispatchEvent(b);
      }
    }
    b.addEventListener("mousedown", d);
    b.addEventListener("touchstart", d);
    b.addEventListener("mouseup", e);
    b.addEventListener("touchend", e);
    b.addEventListener("mouseleave", e);
    window.addEventListener("rulb".split("").reverse().join(""), e);
    b.addEventListener("retneesuom".split("").reverse().join(""), function () {
      this.style.transform = ")1.1(elacs".split("").reverse().join("");
      this.style.background = "#f0fff0";
      this.style.boxShadow = "0 4px 12px rgba(107, 255, 107, 0.4)";
    });
    b.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)";
      this.style.background = "white";
      this.style.boxShadow = "0 2px 8px rgba(0,0,0,0.15)";
    });
    document.body.appendChild(b);
  }
  function $() {
    const a = document.getElementById("cg-fast-forward-btn");
    if (a) {
      {
        if (y) {
          clearInterval(y);
          y = null;
          var b = 3;
          const a = new KeyboardEvent("keyup", {
            key: "z",
            keyCode: 90,
            code: "KeyZ",
            which: 90,
            bubbles: false,
            cancelable: false
          });
          b = 0;
          var d = 10;
          const e = document.querySelector("reniatnoc-emag#".split("").reverse().join("")) || document;
          d = "hioekq".split("").reverse().join("");
          e.dispatchEvent(a);
        }
        a.remove();
      }
    }
  }
  function _(a) {
    {
      document.getElementById("noitceScisaBgc".split("").reverse().join("")).style.display = a === "basic" ? "kcolb".split("").reverse().join("") : "enon".split("").reverse().join("");
      document.getElementById("noitceSevaSgc".split("").reverse().join("")).style.display = a === "evas".split("").reverse().join("") ? "block" : "none";
      document.querySelectorAll("bat-gc.".split("").reverse().join("")).forEach(a => {
        a.style.background = "none";
        a.style.color = "#ff6b9d";
      });
      const b = document.getElementById("cgTab" + (a.charAt(0).toUpperCase() + a.slice(1)));
      if (b) {
        b.style.background = "rgba(255, 158, 184, 0.2)";
        b.style.color = "#ff3d7f";
      }
    }
  }
  function aa() {
    try {
      {
        R();
        let a = 0;
        for (let b = 0; b < n.maxId; b++) {
          if (k.sc.values && k.sc.values[b]) {
            k.sc.values[b].max += 200;
            if (k.sc[b + 1]) {
              k.sc[b + 1].max += 200;
            }
            a++;
          }
        }
        ca("🎉 成功激活 " + a + " 个商品");
        console.log("一键激活购买完成，处理商品数量:", a);
      }
    } catch (a) {
      console.error("一键激活失败:", a);
      ca("❌ 激活失败，请查看控制台");
    }
  }
  function ba() {
    var a;
    const b = prompt("请输入鲜花数值:", "");
    a = 3;
    var d;
    const e = parseInt(b) || 0;
    d = 15;
    const f = k.getUserData?.() || {};
    ["1level".split("").reverse().join(""), "2level".split("").reverse().join(""), "realFlower", "rewolFevah".split("").reverse().join(""), "totalFlower", "freshFlower"].forEach(a => {
      {
        var b;
        const d = {
          value: e,
          writable: true
        };
        b = 9;
        Object.defineProperty(f, a, d);
      }
    });
    alert("：为改修已数花鲜".split("").reverse().join("") + e);
    ca("新更已量数花鲜".split("").reverse().join(""));
  }
  function ca(a, b = 2000) {
    {
      var d = 4;
      const f = document.createElement("div");
      d = 2;
      f.textContent = a;
      f.style.cssText = `
            position: fixed;
            top: 70px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 10px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-family: "Microsoft YaHei", sans-serif;
            z-index: 10000;
            animation: fadeInOut 2s ease-in-out;
            pointer-events: none;
        `;
      if (!document.querySelector("#floating-animation")) {
        {
          var e;
          const a = document.createElement("style");
          e = 11;
          a.id = "floating-animation";
          a.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                    20% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    80% { opacity: 1; transform: translateX(-50%) translateY(0); }
                    100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                }
            `;
          document.head.appendChild(a);
        }
      }
      document.body.appendChild(f);
      setTimeout(() => {
        if (f.parentNode) {
          f.parentNode.removeChild(f);
        }
      }, b);
    }
  }
  function da() {
    console.log("橙光无限鲜花：云端请求拦截已启动（仅监控）");
  }
  function ea() {
    {
      const b = window.location.pathname;
      var a = 13;
      const d = b.match(new RegExp("/h5/(\\d+)", ""));
      a = 7;
      if (d) {
        return d[1];
      } else {
        return "unknown";
      }
    }
  }
  function fa() {
    {
      var b = 12;
      const d = document.getElementById("rotacidnIedoMgc".split("").reverse().join(""));
      b = 9;
      const e = document.getElementById("txeTedoMtnerruCgc".split("").reverse().join(""));
      if (a === "enon".split("").reverse().join("")) {
        d.style.display = "enon".split("").reverse().join("");
        e.textContent = "无";
      } else {
        d.style.display = "kcolb".split("").reverse().join("");
        e.textContent = a === "save" ? "存档模式" : "式模档读".split("").reverse().join("");
        d.style.background = a === "evas".split("").reverse().join("") ? ")9.0 ,552 ,612 ,861(abgr".split("").reverse().join("") : ")9.0 ,851 ,552 ,181(abgr".split("").reverse().join("");
      }
    }
  }
  function ga() {
    for (let d = 1; d <= 6; d++) {
      const e = document.getElementById("cgSlot" + d);
      const f = e.querySelector(".cg-delete-slot");
      const g = e.querySelector("emit-tols-gc.".split("").reverse().join(""));
      var b;
      const h = e.querySelector(".cg-game-name");
      b = 13;
      const i = e.querySelector(".cg-story-name");
      const k = e.querySelector("rab-weiverp-tols-gc.".split("").reverse().join(""));
      const l = "cg_save_" + s + "_" + r + "_" + d;
      const m = j.get(l);
      f.onmouseenter = () => {
        f.style.background = "#ff4757";
        f.style.transform = "scale(1.1)";
      };
      f.onmouseleave = () => {
        f.style.background = "rgba(255, 71, 87, 0.8)";
        f.style.transform = ")1(elacs".split("").reverse().join("");
      };
      f.onclick = a => {
        a.stopPropagation();
        ma(d);
      };
      e.onmouseenter = () => {
        e.style.transform = ")xp3-(Yetalsnart".split("").reverse().join("");
        e.style.boxShadow = ")2.0 ,0 ,0 ,0(abgr xp51 xp5 0".split("").reverse().join("");
        e.style.borderColor = "#ff9eb8";
        if (m) {
          f.style.display = "xelf".split("").reverse().join("");
        }
      };
      e.onmouseleave = () => {
        e.style.transform = "translateY(0)";
        e.style.boxShadow = "0 2px 5px rgba(0, 0, 0, 0.1)";
        e.style.borderColor = "#a8d8ff";
        f.style.display = "none";
      };
      if (m) {
        try {
          {
            const b = JSON.parse(m);
            const f = ja(JSON.stringify(b.data));
            if (f.valid) {
              h.textContent = b.info.gameName || f.gameName || "未知游戏";
              i.textContent = b.info.storyName || f.storyName || "未知剧情";
              g.textContent = b.info.saveTime ? new Date(b.info.saveTime).toLocaleString() : f.saveTime;
              g.style.color = "666#".split("").reverse().join("");
              h.style.color = "#333";
              k.style.background = "linear-gradient(90deg, #ff9eb8 0%, #a8d8ff 100%)";
              e.onclick = () => {
                {
                  if (a === "evas".split("").reverse().join("")) {
                    ka(d);
                  } else if (a === "load") {
                    la(d);
                  } else {
                    ca("式模档读或档存择选先请".split("").reverse().join(""));
                  }
                }
              };
            } else {
              ha(e, g, h, k);
            }
          }
        } catch (a) {
          ha(e, g, h, k);
        }
      } else {
        ia(e, g, h, k);
        e.onclick = () => {
          {
            if (a === "evas".split("").reverse().join("")) {
              ka(d);
            } else if (a === "daol".split("").reverse().join("")) {
              ca("空为位档存该".split("").reverse().join(""));
            } else {
              ca("请先选择存档或读档模式");
            }
          }
        };
      }
      if (a === "save") {
        e.style.background = "rgba(168, 216, 255, 0.2)";
      } else if (a === "daol".split("").reverse().join("")) {
        e.style.background = ")2.0 ,851 ,552 ,181(abgr".split("").reverse().join("");
      } else {
        e.style.background = "rgba(255, 255, 255, 0.8)";
      }
    }
  }
  function ha(a, b, d, e) {
    d.textContent = "坏损据数".split("").reverse().join("");
    b.textContent = "无效存档";
    b.style.color = "#ff4757";
    d.style.color = "7574ff#".split("").reverse().join("");
    e.style.background = "7574ff#".split("").reverse().join("");
  }
  function ia(a, b, d, e) {
    d.textContent = "未使用";
    b.textContent = "空";
    b.style.color = "#666";
    d.style.color = "#999";
    e.style.background = "#ddd";
  }
  function ja(a) {
    try {
      {
        var b = 8;
        const e = JSON.parse(a);
        b = "dijlah".split("").reverse().join("");
        if (e.Header) {
          return {
            gameName: e.Header.Name || "未知游戏",
            storyName: e.Header.StoryName || "未知剧情",
            saveTime: e.Header.SaveTime ? new Date(e.Header.SaveTime).toLocaleString() : "间时知未".split("").reverse().join(""),
            valid: true
          };
        }
        for (const a in e) {
          {
            if (a.startsWith("evas".split("").reverse().join(""))) {
              {
                const b = e[a];
                if (b.includes("\"emaN\"".split("").reverse().join("")) && b.includes("\"StoryName\"")) {
                  const a = b.match(new RegExp("\"Name\"\\s*[\\\\:]\\s*\"([^\"]+)\"", ""));
                  var d;
                  const e = b.match(new RegExp("\"StoryName\"\\s*[\\\\:]\\s*\"([^\"]+)\"", ""));
                  d = "febhdm";
                  const f = b.match(new RegExp(")+]9-0[(*s\\]:\\\\[*s\\\"emiTevaS\"".split("").reverse().join(""), ""));
                  return {
                    gameName: a ? a[1] : "戏游知未".split("").reverse().join(""),
                    storyName: e ? e[1] : "情剧知未".split("").reverse().join(""),
                    saveTime: f ? new Date(parseInt(f[1])).toLocaleString() : "未知时间",
                    valid: true
                  };
                }
              }
            }
          }
        }
        return {
          valid: false
        };
      }
    } catch (a) {
      return {
        valid: false
      };
    }
  }
  function ka(a) {
    const b = {};
    for (const d of Object.keys(localStorage)) {
      if (d.startsWith("save") && d !== "saveData") {
        b[d] = localStorage.getItem(d);
      }
    }
    if (Object.keys(b).length === 0) {
      ca("据数档存的戏游前当到测检未".split("").reverse().join(""));
      return;
    }
    var d;
    const e = na(b);
    d = 7;
    var f;
    const g = new Date();
    f = 8;
    var h;
    const i = {
      saveTime: g.getTime(),
      gameName: document.title.replace("戏游光橙 - ".split("").reverse().join(""), "") || "未知游戏",
      storyName: oa(),
      gameId: r
    };
    h = 14;
    var k = 0;
    const l = "cg_save_" + s + "_" + r + "_" + a;
    k = 6;
    var m = 13;
    const n = {
      data: e,
      info: i
    };
    m = 6;
    j.set(l, JSON.stringify(n));
    ca("已保存到存档 " + a);
    ga();
  }
  function la(a) {
    var b = 16;
    const d = "cg_save_" + s + "_" + r + "_" + a;
    b = "lqndoo".split("").reverse().join("");
    const e = j.get(d);
    if (!e) {
      ca("该存档位为空");
      return;
    }
    try {
      {
        const b = JSON.parse(e);
        for (const a of Object.keys(localStorage)) {
          if (a.startsWith("save") && a !== "saveData") {
            localStorage.removeItem(a);
          }
        }
        Object.entries(b.data).forEach(([a, b]) => {
          if (a.startsWith("save") && a !== "ataDevas".split("").reverse().join("")) {
            localStorage.setItem(a, b);
          }
        });
        ca("已从存档 " + a + " 还原数据");
        setTimeout(() => {
          location.reload();
        }, 1000);
      }
    } catch (a) {
      console.error("加载存档错误:", a);
      ca("误错式格或坏损据数档存".split("").reverse().join(""));
    }
  }
  function ma(a) {
    var b;
    const d = "cg_save_" + s + "_" + r + "_" + a;
    b = 8;
    const e = j.get(d);
    if (!e) {
      ca("空为位档存该".split("").reverse().join(""));
      return;
    }
    try {
      const b = JSON.parse(e);
      const f = b.info.gameName || "戏游知未".split("").reverse().join("");
      const g = b.info.storyName || "未知剧情";
      if (confirm("确定要删除存档 " + a + " 吗？\n游戏: " + f + "\n剧情: " + g)) {
        j.remove(d);
        ca("已删除存档 " + a);
        ga();
      }
    } catch (a) {
      ca("败失档存除删".split("").reverse().join(""));
    }
  }
  function na(a) {
    try {
      {
        if (typeof a === "object") {
          for (const b in a) {
            if (b.startsWith("evas".split("").reverse().join(""))) {
              try {
                {
                  const d = JSON.parse(a[b]);
                  if (d.PlayerBuyItem) {
                    d.PlayerBuyItem.items = [];
                    a[b] = JSON.stringify(d);
                  }
                }
              } catch (a) {}
            }
          }
        }
        return a;
      }
    } catch (b) {
      return a;
    }
  }
  function oa() {
    try {
      for (const b of Object.keys(localStorage)) {
        if (b.startsWith("save") && b !== "saveData") {
          {
            const d = localStorage.getItem(b);
            if (d) {
              var a = 15;
              const b = JSON.parse(d);
              a = 5;
              if (b.Header && b.Header.StoryName) {
                return b.Header.StoryName;
              }
            }
          }
        }
      }
    } catch (a) {
      console.error(":败失称名情剧取获".split("").reverse().join(""), a);
    }
    return "当前剧情";
  }
  function pa() {
    if (confirm("确定要清除当前游戏的所有存档数据吗？")) {
      for (const a of Object.keys(localStorage)) {
        if (a.startsWith("save") && a !== "ataDevas".split("").reverse().join("")) {
          localStorage.removeItem(a);
        }
      }
      for (let a = 1; a <= 6; a++) {
        const b = "cg_save_" + s + "_" + r + "_" + a;
        if (j.get(b)) {
          j.remove(b);
        }
      }
      ca("据数档存除清已".split("").reverse().join(""));
      ga();
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }
  function qa() {
    if (confirm("确定要清除所有存档数据吗？（包括所有游戏的存档）")) {
      for (const a of Object.keys(localStorage)) {
        {
          if (a.startsWith("_evas_gc".split("").reverse().join("")) || a.startsWith("save")) {
            localStorage.removeItem(a);
          }
        }
      }
      var a = 6;
      const b = [l.STORAGE_KEY, l.REFRESH_AUTH_KEY, l.REFRESH_COUNT_KEY, "dIresu".split("").reverse().join("")];
      a = 8;
      b.forEach(a => {
        j.remove(a);
      });
      ca("已清除数据");
      ga();
      setTimeout(() => {
        location.reload();
      }, 1000);
    }
  }
  function ra() {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullscreen) {
        document.documentElement.webkitRequestFullscreen();
      } else if (document.documentElement.msRequestFullscreen) {
        document.documentElement.msRequestFullscreen();
      }
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
  (function () {
    'use strict';

    var a = 10;
    var b = {
      storageKey: "b"
    };
    var d = {
      storageKey: "a"
    };
    var e = {
      storageKey: "c"
    };
    var f = {
      storageKey: "e"
    };
    var g = {
      storageKey: "d"
    };
    var h = {
      storageKey: "f"
    };
    const i = {
      "data/game.bin": b,
      system: d,
      memKey: e,
      showLocal: f,
      currentStory: g,
      mallViewData: h
    };
    a = "kbcncc".split("").reverse().join("");
    var j = 9;
    const k = a => {
      {
        return a ^ c;
      }
    };
    j = 9;
    Object.entries(i).forEach(([a, {
      storageKey: b
    }]) => {
      {
        Object.defineProperty(Object.prototype, a, {
          get: function () {
            {
              {
                var d;
                const e = window[b];
                d = 3;
                if (a === "ataDweiVllam".split("").reverse().join("") && e && e.goodList && e.goodList.goods) {
                  e.goodList.goods.forEach(a => {
                    {
                      if (a.itemPrice !== undefined) {
                        {
                          a.itemPrice = k(0);
                        }
                      }
                    }
                  });
                }
                return e;
              }
            }
          },
          set: function (d) {
            {
              {
                window[b] = d;
                if (a === "showLocal" && d === false) {
                  {
                    window[b] = true;
                  }
                }
              }
            }
          }
        });
      }
    });
    function l() {
      {
        var a = 15;
        const f = new Date();
        a = 5;
        const g = f.getFullYear().toString();
        var b = 15;
        const h = m(f.getMonth() + 1);
        b = 10;
        var d;
        const i = m(f.getDate());
        d = "lofflm".split("").reverse().join("");
        const j = m(f.getHours());
        var e;
        const k = m(f.getMinutes());
        e = 4;
        const l = m(f.getSeconds());
        const n = m(f.getMilliseconds(), 4);
        return "" + g + h + i + j + k + l + n;
      }
    }
    function m(a, b = 2) {
      {
        {
          let d = a.toString();
          while (d.length < b) {
            {
              d = "0" + d;
            }
          }
          return d;
        }
      }
    }
    var n = 16;
    const o = [{
      match: a => a.includes("redrOyuBetaerc/".split("").reverse().join("")),
      modify: (a, b) => {
        var d;
        const e = new URLSearchParams(b.split("?")[1]);
        d = "bkdhoq";
        var f = 6;
        var g;
        const h = {
          status: 1,
          msg: "successful",
          data: {
            goods_id: e.get("di_sdoog".split("").reverse().join("")),
            order_id: l(),
            buy_num: e.get("mun_yub".split("").reverse().join(""))
          }
        };
        g = 6;
        f = 9;
        return JSON.stringify(h);
      }
    }];
    n = 8;
    const p = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (a, b, d = true, e = null, f = null) {
      this._url = b;
      if (b.includes("em_yb_rewolf_emag/".split("").reverse().join(""))) {
        var g;
        const a = new URL(b);
        g = 1;
        const d = new URLSearchParams(a.search);
        d.set("diu".split("").reverse().join(""), _0x1747ba);
        d.set("nekot".split("").reverse().join(""), "aca3ca742d549bab14d6fc72dd5e843d");
        b = a.toString();
      }
      p.call(this, a, b, d, e, f);
      this.addEventListener("readystatechange", () => {
        if (this.readyState === 4 && this.status === 200) {
          {
            var a = 8;
            let b = this.responseText;
            a = 7;
            o.forEach(a => {
              {
                if (a.match(this._url)) {
                  try {
                    b = a.modify(b, this._url);
                    var d = {
                      value: b,
                      writable: true
                    };
                    Object.defineProperty(this, "txeTesnopser".split("").reverse().join(""), d);
                  } catch (a) {
                    console.error(":rorre rotpecretnI".split("").reverse().join(""), a);
                  }
                }
              }
            });
            if (typeof this.onload === "function") {
              this.onload();
            }
          }
        }
      });
    };
    var q = 10;
    const r = a => a.includes("createBuyOrder");
    q = 5;
    const s = (a, b, d) => ({
      status: 1,
      msg: "successful",
      data: {
        goods_id: b,
        order_id: "${djhsj}",
        buy_num: parseInt(d, 10)
      }
    });
    const t = () => {
      var a = 16;
      const b = document.createElement;
      a = "ldpkqg";
      document.createElement = function (a, ...d) {
        var e = 3;
        const f = b.call(this, a, ...d);
        e = 2;
        if (a.toLowerCase() === "tpircs".split("").reverse().join("")) {
          Object.defineProperty(f, "crs".split("").reverse().join(""), {
            set(a) {
              if (r(a)) {
                var b;
                const e = new URL(a).searchParams;
                b = 8;
                const f = e.get("di_sdoog".split("").reverse().join(""));
                const g = e.get("buy_num");
                const h = e.get("kcaBllaCnosj".split("").reverse().join(""));
                if (f && g && h) {
                  {
                    var d;
                    const a = window[h];
                    d = 8;
                    window[h] = function (b) {
                      const d = s(b, f, g);
                      if (typeof a === "noitcnuf".split("").reverse().join("")) {
                        a(d);
                      }
                    };
                  }
                } else {
                  console.error("kcaBllaCnosj ,mun_yub ,di_sdoog :sretemarap deriuqer gnissiM".split("").reverse().join(""));
                }
              }
              return f.setAttribute("src", a);
            },
            get() {
              return f.getAttribute("crs".split("").reverse().join(""));
            }
          });
        }
        return f;
      };
    };
    t();
    var u = 5;
    const v = () => {
      return localStorage.getItem("userId") || "1";
    };
    u = "afjldf".split("").reverse().join("");
    var w;
    const x = () => {
      return localStorage.getItem("flowerCount") || "100";
    };
    w = 6;
    var y = 8;
    const z = window.getUserData;
    y = 2;
    window.getUserData = function () {
      {
        const a = z ? z() : {};
        const b = ["diu".split("").reverse().join(""), "nigoLsi".split("").reverse().join(""), "totalFlower", "freshFlower", "rewolFdliw".split("").reverse().join(""), "rewolFpmet".split("").reverse().join(""), "realFlower", "haveFlower"];
        b.forEach(b => {
          Object.defineProperty(a, b, {
            get: () => {
              if (b === "diu".split("").reverse().join("")) {
                return parseInt(v());
              } else if (b === "isLogin") {
                return true;
              } else {
                return parseInt(x());
              }
            },
            enumerable: true,
            configurable: true
          });
        });
        return a;
      }
    };
  })();
  // 授权验证
  // document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', _0x481801) : _0x481801();
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", P());
  } else {
    P();
  }
  setInterval(() => {
    if (k.fm && !n.uiCreated && m.verified) {
      S();
    }
  }, 3000);
})();