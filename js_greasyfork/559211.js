// ==UserScript==
// @name       wos
// @namespace  npm/vite-plugin-monkey
// @version    2026.1.8
// @icon       https://webofscience.clarivate.cn/wos/static/favicon.png
// @match      https://webofscience.clarivate.cn/wos/woscc/summary/*/relevance/*
// @require    https://cdn.jsdelivr.net/npm/vue@3.5.25/dist/vue.global.prod.js
// @grant      GM_addStyle
// @grant      GM_xmlhttpRequest
// @license    MIT
// @description WOS数据库下载器
// @downloadURL https://update.greasyfork.org/scripts/559211/wos.user.js
// @updateURL https://update.greasyfork.org/scripts/559211/wos.meta.js
// ==/UserScript==

(function (vue) {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  const styleCss = "#bnt{margin-left:10px;padding:8px 20px;background-color:#008cba;color:#fff;border:none;border-radius:4px;transition:background-color .3s}#bnt:hover{background-color:#005f73}";
  importCSS(styleCss);
  var _GM_xmlhttpRequest = (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const params = vue.reactive({
        QID: "",
        SID: "",
        Size: 1,
        Flag: true,
        Type: ""
      });
      _GM_xmlhttpRequest({
        method: "GET",
        url: "https://webofscience.clarivate.cn/",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "User-Agent": navigator.userAgent
        },
        onload: function(response) {
          const regex = /SID=([^&]+)/;
          const sid = response.finalUrl.match(regex);
          if (sid) {
            params.SID = sid[1];
          } else {
            alert("获取权限ID失败");
          }
        }
      });
      function ToNumber(str) {
        return Number(str.replace(/[,\s]/g, ""));
      }
      setInterval(() => {
        const url = window.location.href;
        if (url.includes("overlay:export")) {
          if (params.Flag) {
            const select = document.querySelector("div.flex-align.margin-top-20");
            if (select) {
              params.Flag = false;
              const newButton = document.createElement("button");
              newButton.textContent = "全部下载";
              newButton.id = "bnt";
              select.appendChild(newButton);
              const bnt = document.querySelector("#bnt");
              params.QID = url.match(/summary\/(.+?)\//)[1];
              const size = document.querySelector(".brand-blue");
              params.Size = ToNumber(size.textContent);
              params.Type = url.match(/export\/(.+?)\)/)[1];
              bnt.addEventListener(
                "click",
                () => {
                  openNewWindow();
                }
              );
            }
          }
        } else {
          params.Flag = true;
        }
      }, 1e3);
      function openNewWindow() {
        const url = `http://127.0.0.1:8000/?qid=${params.QID}&sid=${params.SID}&size=${params.Size}&type=${params.Type}`;
        const width = 1200;
        const height = 800;
        const left = (window.screen.width - width) / 2;
        const top = (window.screen.height - height) / 2;
        const windowFeatures = `
                width=${width},
                height=${height},
                left=${left},
                top=${top},
                toolbar=no,
                location=no,
                status=no,
                menubar=no,
                scrollbars=yes,
                resizable=yes
            `.replace(/\s+/g, "");
        window.open(url, "_blank", windowFeatures);
      }
      return () => {
      };
    }
  };
  const app = vue.createApp(_sfc_main);
  app.mount((() => {
    const app2 = document.createElement("div");
    document.body.append(app2);
    return app2;
  })());

})(Vue);