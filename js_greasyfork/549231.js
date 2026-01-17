// ==UserScript==
// @name       解除网站不允许复制的限制，专治流氓
// @name:zh-CN 解除网站不允许复制的限制，专治流氓
// @description       解除部分网站不允许复制的限制，文本选中后点击复制按钮即可复制，主要用于：百度文库|道客巴巴|腾讯文档|豆丁网|无忧考网|学习啦|蓬勃范文|思否社区|力扣|知乎|语雀|QQ文档|360doc|17k|CSDN等，云服务器导航，在原脚本的基础上，优化了部分功能，如有补充请留言反馈~
// @description:zh-CN 解除部分网站不允许复制的限制，文本选中后点击复制按钮即可复制，主要用于：百度文库|道客巴巴|腾讯文档|豆丁网|无忧考网|学习啦|蓬勃范文|思否社区|力扣|知乎|语雀|QQ文档|360doc|17k|CSDN等，云服务器导航，在原脚本的基础上，优化了部分功能，如有补充请留言反馈~
// @namespace  timelygogo_lifting_restrictions
// @version    1.1.7
// @author     时光匆匆
// @icon       data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABYklEQVR4AeyUsU7DMBCGfzMzMhTBwMAAE4yAhEjmLiBeAphAYk94ArbCSzB2Tlh4CFhAYujIG5g7VaXnUDs6J2mXVP1ax/bdfbIdr2HFn17g3woMHm1C5DHE7KYjwEVhUBBZDBSfaCUcAW3wgvmrFdjfRHZdWuvjprD5VWEdybZXYMGizLusQWaIeQ+wVAFZeNYOCpxsA/dHfmZJmvwHBTjx8Rbgg8ebEhR4+wYuX/w0Lc7xQQGeoGG4A4zOXIbUF8oRFNCegfcfYPzl8kF90QIc6Nt/7udxCRcbf5KAgKXknGo7uAL9GejPQH8Gqq9M3TO/cq3fA3VF5Xjr94BM3lU7eBF1VVTmrQqUclDT3lgH9gaaiOlcR2ByZ8rJrTEhzg+QXhwCVU53pwm1v46ANjhmvrF4lXFqgefUlJTkgaFEvGUqRqnJKe7vqxbgSE7CPCUm1cLxkigBmaBpu3OBOsFfAAAA//8phexXAAAABklEQVQDAGZM9kGSkoAoAAAAAElFTkSuQmCC
// @match      *://wenku.baidu.com/view/*
// @match      *://wenku.baidu.com/share/*
// @match      *://wenku.baidu.com/link*
// @match      *://wenku.baidu.com/aggs/*
// @match      *://wenku.baidu.com/ndPureView/*
// @match      *://*.doc88.com/*
// @match      *://wk.baidu.com/view/*
// @match      *://*.zhihu.com/*
// @match      *://docs.qq.com/doc/*
// @match      *://docs.qq.com/sheet/*
// @match      *://boke112.com/*/*
// @match      *://*.diyifanwen.com/*
// @match      *://www.uemeds.cn/*
// @match      *://www.oh100.com/*
// @match      *://www.aiyuke.com/news/*
// @match      *://www.fwsir.com/*
// @match      *://www.wenxm.cn/*
// @match      *://www.unjs.com/*
// @match      *://*.yjbys.com/*
// @match      *://*.qidian.com/*
// @match      *://*.zongheng.com/*
// @match      *://*.17k.com/*
// @match      *://*.ciweimao.com/*
// @match      *://book.qq.com/*
// @match      *://*.360doc.com/content/*
// @match      *://*.850500.com/news/*
// @match      *://utaten.com/lyric/*
// @match      *://*.jianbiaoku.com/*
// @match      *://www.kejudati.com/*
// @match      *://*.blog.csdn.net/*
// @match      *://*.bilibili.com/read/*
// @match      *://*.cnki.net/KXReader/*
// @match      *://*.cnrencai.com/*
// @match      *://*.jianshu.com/p/*
// @match      *://*.linovelib.com/novel/*
// @match      *://*.juejin.cn/post/*
// @match      *://*.zgbk.com/ecph/*
// @match      *://yuedu.baidu.com/*
// @match      *://www.shubaoc.com/*
// @match      *://blog.51cto.com/*
// @match      *://*.docin.com/*
// @match      *://*.ddwk8.cn/*
// @match      *://fanqienovel.com/*
// @match      *://*.examcoo.com/*
// @match      *://*.rrdynb.com/*
// @match      *://*.fuwu7.com/*
// @match      *://*.aipiaxi.com/*
// @match      *://wenku.csdn.net/*
// @match      *://www.kdocs.cn/*
// @match      *://*.mcmod.cn/*
// @match      *://*.yuque.com/*
// @match      *://*.51cto.com/*
// @match      *://vcsmemo.com/article/*
// @match      *://www.jinrilvsi.com/*
// @match      *://www.9136.com/*
// @match      *://www.jdxzz.com/*
// @match      *://www.gaosan.com/*/*.html
// @match      *://ai-bot.cn/sites/*.html
// @match      *://www.lyrical-nonsense.com/lyrics/*
// @match      *://tongxiehui.net/by/*
// @match      *://www.xuexila.com/*
// @match      *://www.ruiwen.com/article/*
// @match      *://*.cooco.net.cn/testdetail/**
// @match      *://www.51test.net/show/*.html
// @match      *://16map.com/sites/*.html
// @exclude    *://stat.doc88.com/*
// @exclude    *://www.lqsbcl.net/*
// @connect    staticj.top
// @connect    res3.doc88.com
// @supportURL https://github.com/Picasso-TX/TKScript/issues
// @license    MIT
// @run-at     document-start
// @grant      unsafeWindow
// @grant      GM_openInTab
// @grant      GM.openInTab
// @grant      GM_addStyle
// @grant      GM.getValue
// @grant      GM_getValue
// @grant      GM_xmlhttpRequest
// @grant      GM.xmlHttpRequest
// @grant      GM_registerMenuCommand
// @grant      GM_setValue
// @grant      GM.setValue
// @grant      GM_addElement
// @downloadURL https://update.greasyfork.org/scripts/549231/%E8%A7%A3%E9%99%A4%E7%BD%91%E7%AB%99%E4%B8%8D%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%E7%9A%84%E9%99%90%E5%88%B6%EF%BC%8C%E4%B8%93%E6%B2%BB%E6%B5%81%E6%B0%93.user.js
// @updateURL https://update.greasyfork.org/scripts/549231/%E8%A7%A3%E9%99%A4%E7%BD%91%E7%AB%99%E4%B8%8D%E5%85%81%E8%AE%B8%E5%A4%8D%E5%88%B6%E7%9A%84%E9%99%90%E5%88%B6%EF%BC%8C%E4%B8%93%E6%B2%BB%E6%B5%81%E6%B0%93.meta.js
// ==/UserScript==
(function () {
    'use strict';

    var css_248z$2 = ".__copied-button{align-items:center;background:#000;border-radius:3px;color:#fff;cursor:pointer;display:flex;font-size:12px;justify-content:center;opacity:0;padding:4px 10px;position:absolute;transition:opacity .3s;z-index:-1000}";

    var css_248z$1 = "#select-tooltip,#sfModal,.modal-backdrop,div[id^=reader-helper]{display:none!important}.modal-open{overflow:auto!important}._sf_adjust_body{padding-right:0!important}";

    var css_248z = "@keyframes fadeIn{0%{opacity:0}to{opacity:1}}@-webkit-keyframes fadeIn{0%{opacity:0}to{opacity:1}}@-moz-keyframes fadeIn{0%{opacity:0}to{opacity:1}}@-o-keyframes fadeIn{0%{opacity:0}to{opacity:1}}@-ms-keyframes fadeIn{0%{opacity:0}to{opacity:1}}@keyframes fadeOut{0%{opacity:1}to{opacity:0}}@-webkit-keyframes fadeOut{0%{opacity:1}to{opacity:0}}@-moz-keyframes fadeOut{0%{opacity:1}to{opacity:0}}@-o-keyframes fadeOut{0%{opacity:1}to{opacity:0}}@-ms-keyframes fadeOut{0%{opacity:1}to{opacity:0}}.web-toast-kkli9{background:rgba(0,0,0,.7);border-radius:3px;color:#fff;font-size:14px;left:50%;line-height:1;padding:10px;position:fixed;transform:translateX(-50%);-webkit-transform:translateX(-50%);-moz-transform:translateX(-50%);-o-transform:translateX(-50%);-ms-transform:translateX(-50%);white-space:nowrap;z-index:1e+27}.fadeOut{animation:fadeOut .5s}.fadeIn{animation:fadeIn .5s}";

    /*!
    * 版权说明：原脚本https://github.com/WindrunnerMax/TKScript/ 采用MIT开源协议
    * 本脚本开源地址：https://github.com/Picasso-TX/TKScript 继承原脚本，以MIT协议开源
    *
    * MIT协议是一种开放源代码软件授权协议，全称为Massachusetts Institute of Technology License。
    * 该协议允许自由地使用、复制、修改、合并、发布、分发、再授权和销售软件及其副本的任何部分。
    * MIT协议要求在软件的所有副本中包含版权声明和许可声明
    *
    * 特此声明！
    */
    const DOM_STAGE = {
      START: "document-start",
      END: "document-end"
    };
    const DOM_READY = "DOMContentLoaded";
    const PAGE_LOADED = "load";
    const MOUSE_UP = "mouseup";
    const COPY = "copy";
    const SELECT_START = "selectstart";
    const CONTEXT_MENU = "contextmenu";
    const KEY_DOWN = "keydown";

    const opt = Object.prototype.toString;
    function isString(value) {
      return opt.call(value) === "[object String]";
    }

    const dom$1 = {
      query: function(selector) {
        return document.querySelector(selector);
      },
      attr: function(selector, attr, value) {
        const dom2 = document.querySelector(selector);
        dom2 && dom2.setAttribute(attr, value);
      },
      append: function(selector, content) {
        const container = document.createElement("div");
        if (isString(content)) {
          container.innerHTML = content;
        } else {
          container.appendChild(content);
        }
        const targetDOM = document.querySelector(selector);
        targetDOM && targetDOM.append(container);
        return container;
      },
      remove: function(selector) {
        const targetDOM = document.querySelector(selector);
        targetDOM && targetDOM.remove();
      }
    };

    const initBaseEvent = (websiteConfig) => {
      window.addEventListener(DOM_READY, () => {
        if (websiteConfig.initCopyEvent) {
          document.oncopy = (e) => e.stopPropagation();
          document.body.oncopy = (e) => e.stopPropagation();
          document.addEventListener(COPY, (e) => e.stopPropagation());
          document.body.addEventListener(COPY, (e) => e.stopPropagation());
        }
      });
    };
    const initBaseStyle = () => {
      window.addEventListener(DOM_READY, () => {
        dom$1.append("head", `<style>${css_248z$2}</style>`);
        dom$1.append("head", `<style>${css_248z$1}</style>`);
        dom$1.append("head", `<style>${css_248z}</style>`);
      });
    };

    /*!
     * 外部引用`static.doc88.com`声明
     * 此部分是在处理`doc88.com`才会加载的资源文件，此资源文件由该网站加载时提供
     */
    let path = "";
    const website$n = {
      regexp: /.*doc88\.com\/.+/,
      init: () => {
        dom$1.append(
          "body",
          `<style id="copy-element-hide">#left-menu{display: none !important;}</style>`
        );
        GM_xmlhttpRequest({
          method: "GET",
          url: "https://res3.doc88.com/resources/js/modules/main-v2.min.js?v=3.55",
          onload: function(response) {
            const result = /\("#cp_textarea"\).val\(([\S]*?)\);/.exec(response.responseText);
            if (result)
              path = result[1];
          }
        });
        window.addEventListener("load", () => {
          const cpFn = unsafeWindow.copyText.toString();
          const fnResult = /<textarea[\s\S]*?>'\+([\S]*?)\+"<\/textarea>/.exec(cpFn);
          if (fnResult)
            path = fnResult[1];
        });
      },
      getSelectedText: () => {
        let select = unsafeWindow;
        path.split(".").forEach((v) => {
          select = select[v];
        });
        if (!select) {
          unsafeWindow.Config.vip = 1;
          unsafeWindow.Config.logined = 1;
          dom$1.remove("#copy-element-hide");
        }
        return select;
      }
    };

    const TEXT_PLAIN = "text/plain";
    const TEXT_HTML = "text/html";
    const execCopyCommand = (data) => {
      const textarea = document.createElement("textarea");
      const handler = (event) => {
        event.preventDefault();
        event.stopImmediatePropagation();
        for (const [key, value] of Object.entries(data)) {
          event.clipboardData && event.clipboardData.setData(key, value);
        }
      };
      textarea.addEventListener(COPY, handler, true);
      textarea.style.position = "fixed";
      textarea.style.left = "-999999999px";
      textarea.style.top = "-999999999px";
      textarea.value = data[TEXT_PLAIN] || " ";
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.removeEventListener(COPY, handler);
      document.body.removeChild(textarea);
    };
    const isEmptyContent = (data) => {
      if (!data)
        return true;
      return isString(data) ? !data : !data[TEXT_PLAIN];
    };
    const copy = (data) => {
      const params = isString(data) ? { [TEXT_PLAIN]: data } : data;
      const plainText = params[TEXT_PLAIN];
      if (!plainText)
        return false;
      if (navigator.clipboard && window.ClipboardItem) {
        const dataItems = {};
        for (const [key, value] of Object.entries(params)) {
          const blob = new Blob([value], { type: key });
          dataItems[key] = blob;
        }
        navigator.clipboard.write([new ClipboardItem(dataItems)]).catch(() => {
          execCopyCommand(params);
        });
      } else {
        execCopyCommand(params);
      }
      return true;
    };

    let dom = null;
    let isReadyToHidden = false;
    const instance = {
      id: "__copy",
      className: "__copied-button",
      init: function(name) {
        const container = document.createElement("div");
        container.id = this.id;
        container.className = this.className;
        container.innerText = name || "复制";
        container.addEventListener("mouseup", (e) => e.stopPropagation(), true);
        container.addEventListener("mousedown", (e) => e.stopPropagation(), true);
        dom = container;
        document.body.appendChild(dom);
      },
      getInstance: function() {
        if (dom === null) {
          this.init();
        }
        return dom;
      },
      show: function(event) {
        if (isReadyToHidden)
          return void 0;
        const dom2 = this.getInstance();
        dom2.style.left = `${event.pageX + 30}px`;
        dom2.style.top = `${event.pageY}px`;
        dom2.style.opacity = "1";
        dom2.style.zIndex = "1000";
      },
      hide: function(keep = 350) {
        const dom2 = this.getInstance();
        dom2.style.opacity = "0";
        if (keep) {
          isReadyToHidden = true;
          setTimeout(() => {
            dom2.style.zIndex = "-10000";
            isReadyToHidden = false;
          }, keep);
        }
      },
      onCopy: function(content, event) {
        const dom2 = this.getInstance();
        this.show(event);
        dom2.onclick = () => {
          copy(content);
          this.hide();
        };
      },
      enable: function() {
        const dom2 = this.getInstance();
        dom2.style.display = "flex";
      },
      disable: function() {
        const dom2 = this.getInstance();
        dom2.style.display = "none";
      },
      destroy: function() {
        const el = this.getInstance();
        el.remove();
        dom = null;
      }
    };

    const stopNativePropagation = (event) => {
      event.stopPropagation();
    };
    var utils = {
      hideButton: () => {
        instance.disable();
      },
      showButton: () => {
        instance.enable();
      },
      removeAttributes: (selector, attr = []) => {
        const dom = isString(selector) ? document.querySelector(selector) : selector;
        dom && attr.forEach((item) => dom.removeAttribute(item));
      },
      enableUserSelectByCSS: (css) => {
        const defaultCss = `
      *{-webkit-touch-callout: auto !important;-webkit-user-select: auto !important;-moz-user-select: auto !important;-khtml-user-select: auto !important;-ms-user-select: auto !important;}
    `;
        const style = document.createElement("style");
        style.innerHTML = !!css ? css : defaultCss;
        const head = document.getElementsByTagName("head")[0];
        if (head) {
          head.appendChild(style);
        } else {
          window.addEventListener(
            PAGE_LOADED,
            () => document.getElementsByTagName("head")[0].appendChild(style)
          );
        }
      },
      enableOnSelectStart: (selector) => {
        const dom = document.querySelector(selector);
        dom && dom.addEventListener(SELECT_START, stopNativePropagation);
      },
      enableOnContextMenu: (selector) => {
        const dom = document.querySelector(selector);
        dom && dom.addEventListener(CONTEXT_MENU, stopNativePropagation);
      },
      enableOnCopy: (selector) => {
        const dom = document.querySelector(selector);
        dom && dom.addEventListener(COPY, stopNativePropagation);
      },
      enableOnKeyDown: (selector) => {
        const dom = document.querySelector(selector);
        dom && dom.addEventListener(KEY_DOWN, (e) => {
          if (e.key === "c" && e.ctrlKey)
            return e.stopPropagation();
        });
      },
      enableOnSelectStartByCapture: () => {
        window.addEventListener(SELECT_START, stopNativePropagation, true);
        document.addEventListener(SELECT_START, stopNativePropagation, true);
      },
      enableOnContextMenuByCapture: () => {
        window.addEventListener(CONTEXT_MENU, stopNativePropagation, true);
        document.addEventListener(CONTEXT_MENU, stopNativePropagation, true);
      },
      enableOnCopyByCapture: () => {
        window.addEventListener(COPY, stopNativePropagation, true);
        document.addEventListener(COPY, stopNativePropagation, true);
      },
      enableOnKeyDownByCapture: () => {
        document.addEventListener(
          KEY_DOWN,
          (e) => e.ctrlKey && e.key.toLocaleUpperCase() === "C" && e.stopPropagation(),
          true
        );
      }
    };

    const website$m = {
      regexp: /.*wk\.baidu\.com\/view\/.+/,
      init: function() {
        utils.hideButton();
        utils.enableOnSelectStartByCapture();
        window.onload = () => {
          dom$1.attr(".sf-edu-wenku-vw-container", "style", "");
        };
      }
    };

    const website$l = {
      regexp: /.*zhihu\.com\/.*/,
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
        utils.enableOnCopyByCapture();
        if (location.hostname === "zhuanlan.zhihu.com") {
          const removeFocalPointModal = (mutationsList) => {
            for (const mutation of mutationsList) {
              const addedNodes = mutation.addedNodes;
              for (let i = 0; i < addedNodes.length; i++) {
                const target = addedNodes[i];
                if (target.nodeType != 1)
                  return void 0;
                if (target instanceof HTMLDivElement && target.querySelector("[data-focus-scope-start]")) {
                  const element = target.querySelector("[data-focus-scope-start]");
                  element && element.parentElement && element.parentElement.textContent && element.parentElement.textContent.indexOf("立即登录/注册") > -1 && element.parentElement.parentElement && element.parentElement.parentElement.removeChild(element.parentElement);
                }
              }
            }
          };
          const observer = new MutationObserver(removeFocalPointModal);
          observer.observe(document, { childList: true, subtree: true });
        }
      }
    };

    const website$k = {
      regexp: /.*docs\.qq\.com\/.+/,
      config: {
        initCopyEvent: false,
        captureInstance: true,
        delay: 100
      },
      init: function() {
        window.onload = () => {
          utils.hideButton();
        };
      },
      getSelectedText: function() {
        if (unsafeWindow.pad && unsafeWindow.pad.editor && !unsafeWindow.pad.editor.isCopyable()) {
          utils.showButton();
          const editor = unsafeWindow.pad.editor;
          if (editor.getCopyContent) {
            const content = editor.getCopyContent() || {};
            const plainText = content.plain || "";
            const htmlText = content.html || "";
            return {
              [TEXT_PLAIN]: plainText,
              [TEXT_HTML]: htmlText
            };
          } else {
            editor._docEnv.copyable = true;
            editor.clipboardManager.copy();
            const plainText = editor.clipboardManager.customClipboard.plain || "";
            const htmlText = editor.clipboardManager.customClipboard.html || "";
            editor._docEnv.copyable = false;
            return {
              [TEXT_PLAIN]: plainText,
              [TEXT_HTML]: htmlText
            };
          }
        } else if (unsafeWindow.SpreadsheetApp && unsafeWindow.SpreadsheetApp.permissions && unsafeWindow.SpreadsheetApp.permissions.sheetStatus && unsafeWindow.SpreadsheetApp.permissions.sheetStatus.canCopy === false && unsafeWindow.SpreadsheetApp.permissions.sheetStatus.canEdit && unsafeWindow.SpreadsheetApp.permissions.sheetStatus.canEdit() === false) {
          utils.showButton();
          const SpreadsheetApp = unsafeWindow.SpreadsheetApp;
          const [selection] = SpreadsheetApp.view.getSelectionRanges();
          if (selection) {
            const text = [];
            const { startColIndex, startRowIndex, endColIndex, endRowIndex } = selection;
            for (let i = startRowIndex; i <= endRowIndex; i++) {
              for (let k = startColIndex; k <= endColIndex; k++) {
                const cell = SpreadsheetApp.workbook.activeSheet.getCellDataAtPosition(i, k);
                if (!cell)
                  continue;
                text.push(" ", cell.formattedValue?.value || cell.value || "");
              }
              i !== endRowIndex && text.push("\n");
            }
            const str = text.join("");
            return /^\s*$/.test(str) ? "" : str;
          }
          return "";
        }
        return "";
      }
    };

    const website$j = {
      regexp: new RegExp("boke112\\.com"),
      init: function() {
        utils.enableOnCopyByCapture();
        const template = `
            <style>
                :not(input):not(textarea)::selection {
                    background-color: #2440B3 !important;
                    color: #fff !important;
                }

                :not(input):not(textarea)::-moz-selection {
                    background-color: #2440B3 !important;
                    color: #fff !important;
                }
            </style>
        `;
        dom$1.append("head", template);
      }
    };

    const website$i = {
      regexp: /diyifanwen/,
      init: function() {
        utils.hideButton();
        utils.enableOnCopyByCapture();
        utils.enableOnKeyDownByCapture();
      }
    };

    const website$h = {
      regexp: /mbalib/,
      init: function() {
        window.onload = () => {
          utils.removeAttributes("fullScreenContainer", ["oncopy", "oncontextmenu", "onselectstart"]);
        };
      }
    };

    const website$g = {
      regexp: new RegExp(".+www.uemeds.cn/.+"),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
      }
    };

    const website$f = {
      regexp: new RegExp(".+aiyuke.com/news/.+"),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
      }
    };

    const website$e = {
      regexp: new RegExp("qidian"),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
        utils.enableOnCopy(".main-read-container");
        utils.enableOnContextMenu(".main-read-container");
      }
    };

    const website$d = {
      regexp: new RegExp("zongheng"),
      init: function() {
        utils.removeAttributes(".reader_box", ["style", "unselectable", "onselectstart"]);
        utils.removeAttributes(".reader_main", ["style", "unselectable", "onselectstart"]);
        utils.hideButton();
        utils.enableOnKeyDown("body");
        utils.enableUserSelectByCSS();
        utils.enableOnCopy(".content");
        utils.enableOnContextMenu("body");
        utils.enableOnSelectStart(".content");
      }
    };

    const website$c = {
      regexp: new RegExp("17k"),
      init: () => {
        utils.hideButton();
        utils.enableOnCopy(".readAreaBox .p");
      }
    };

    const website$b = {
      regexp: new RegExp("ciweimao"),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
        utils.enableOnCopy("#J_BookCnt");
        utils.enableOnContextMenu("body");
        utils.enableOnSelectStart("#J_BookCnt");
      }
    };

    const website$a = {
      regexp: new RegExp("book\\.qq"),
      init: function() {
        utils.hideButton();
        utils.enableOnCopy("body");
        utils.enableUserSelectByCSS();
        utils.enableOnContextMenu("body");
        utils.enableOnSelectStart("body");
      }
    };

    const website$9 = {
      regexp: new RegExp("utaten"),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
        utils.enableOnSelectStartByCapture();
      }
    };

    const website$8 = {
      config: {
        runAt: "document-start"
      },
      regexp: new RegExp("wenku.baidu.com/(view|link|aggs).*"),
      init: function() {
        dom$1.append("head", `<style>@media print { body{ display:block; } }</style>`);
        let canvasDataGroup = [];
        const originObject = {
          context2DPrototype: unsafeWindow.document.createElement("canvas").getContext("2d").__proto__
        };
        document.createElement = new Proxy(document.createElement, {
          apply: function(target, thisArg, argumentsList) {
            const element = Reflect.apply(target, thisArg, argumentsList);
            if (argumentsList[0] === "canvas") {
              const tmpData = {
                canvas: element,
                data: []
              };
              element.getContext("2d").fillText = function(...args) {
                tmpData.data.push(args);
                originObject.context2DPrototype.fillText.apply(this, args);
              };
              canvasDataGroup.push(tmpData);
            }
            return element;
          }
        });
        let pageData = {};
        Object.defineProperty(unsafeWindow, "pageData", {
          set: (v) => pageData = v,
          get: function() {
            if (!pageData.vipInfo)
              return pageData.vipInfo = {};
            pageData.vipInfo.global_svip_status = 1;
            pageData.vipInfo.global_vip_status = 1;
            pageData.vipInfo.isVip = 1;
            pageData.vipInfo.isWenkuVip = 1;
            return pageData;
          }
        });
        const templateCSS = [
          "<style id='copy-template-css'>",
          "body{overflow: hidden !important}",
          "#copy-template-html{position: fixed; top: 0; right: 0; bottom: 0; left: 0; display: flex; align-items: center; justify-content: center;z-index: 999999; background: rgba(0,0,0,0.5);}",
          "#copy-template-html > .template-container{height: 80%; width: 80%; background: #fff; }",
          ".template-container > .title-container{display: flex; align-items: center; justify-content: space-between;padding: 10px;border-bottom: 1px solid #eee;}",
          "#copy-template-text{height: 100%; width: 100%;position: relative; overflow: auto;background: #fff;}",
          "#copy-template-html #template-close{cursor: pointer;}",
          "</style>"
        ].join("");
        const render = () => {
          canvasDataGroup = canvasDataGroup.filter((item) => item.canvas.id);
          var templateText = canvasDataGroup.map((canvasData, index) => {
            const computedTop = index * Number(canvasData.canvas.clientHeight);
            const textItem = canvasData.data.map(
              (item) => `<div style="position: absolute; left: ${item[1]}px; top: ${item[2] + computedTop}px">${item[0]}</div>`
            );
            return textItem.join("");
          });
          const editorView = document.querySelector("#editor-view");
          if (editorView) {
            templateText = [editorView.innerHTML];
          }
          const templateHTML = [
            "<div id='copy-template-html'>",
            "<div class='template-container'>",
            "<div class='title-container'>",
            "<div>请自行复制</div>",
            "<div id='template-close'>关闭</div>",
            "</div>",
            "<div id='copy-template-text'>",
            templateText.join(""),
            "</div>",
            "</div>",
            "</div>"
          ].join("");
          dom$1.append("body", templateHTML);
          dom$1.append("body", templateCSS);
          const closeButton = document.querySelector("#copy-template-html #template-close");
          const close = () => {
            dom$1.remove("#copy-template-html");
            dom$1.remove("#copy-template-css");
            closeButton && closeButton.removeEventListener("click", close);
          };
          closeButton && closeButton.addEventListener("click", close);
        };
        document.addEventListener("DOMContentLoaded", () => {
          dom$1.append(
            "head",
            `<style>#copy-btn-wk{padding: 10px; background: rgba(0,0,0,0.5);position: fixed; left:0; top: 40%;cursor: pointer;color: #fff; z-index: 99999;}</style>`
          );
          dom$1.append("body", "<div id='copy-btn-wk'>复制</div>");
          const btn = dom$1.query("#copy-btn-wk");
          btn && (btn.onclick = render);
        });
      },
      getSelectedText: () => {
        if (window.getSelection && (window.getSelection() || "").toString()) {
          return (window.getSelection() || "").toString();
        }
        const result = /查看全部包含“([\s\S]*?)”的文档/.exec(document.body.innerHTML);
        if (result)
          return result[1];
        return "";
      }
    };

    const website$7 = {
      regexp: /csdn/,
      init: function() {
        utils.hideButton();
        utils.enableOnCopyByCapture();
        utils.enableUserSelectByCSS();
      }
    };

    const website$6 = {
      regexp: new RegExp("bilibili"),
      init: function() {
        utils.hideButton();
        utils.enableOnCopyByCapture();
      }
    };

    const website$5 = {
      regexp: new RegExp("cnki"),
      init: function() {
        utils.hideButton();
        utils.enableOnContextMenuByCapture();
        utils.enableOnKeyDownByCapture();
        utils.enableOnCopyByCapture();
      }
    };

    const website$4 = {
      regexp: new RegExp("docin.com/.*"),
      config: {
        initCopyEvent: false,
        captureInstance: true,
        delay: 100
      },
      init: function() {
        window.addEventListener(PAGE_LOADED, () => dom$1.query("#j_select")?.click());
        dom$1.append("head", "<style>#reader-copy-el{display: none;}</style>");
      },
      getSelectedText: function() {
        if (unsafeWindow.docinReader && unsafeWindow.docinReader.st) {
          return unsafeWindow.docinReader.st;
        }
        return "";
      }
    };

    const website$3 = {
      regexp: new RegExp(
        [
          "cnki",
          "oh100",
          "fwsir",
          "wenxm",
          "unjs",
          "yjbys",
          "360doc",
          "850500",
          "jianbiaoku",
          "kejudati",
          "yuque",
          "cnrencai",
          "ndPureView",
          "jianshu",
          "linovelib",
          "chazidian",
          "juejin",
          "zgbk",
          "yuedu\\.baidu",
          "shubaoc",
          "51cto",
          "ddwk8",
          "fanqienovel\\.com/reader",
          "cooco\\.net\\.cn",
          "aipiaxi",
          "wenku\\.csdn\\.net",
          "mcmod\\.cn",
          "51cto\\.com",
          "vcsmemo\\.com",
          "www\\.lyrical-nonsense\\.com",
          "tongxiehui\\.net",
          "www\\.xuexila\\.com",
          "www\\.ruiwen\\.com",
          "cooco\\.net\\.cn",
          "www\\.51test\\.net"
        ].join("|")
      ),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
        utils.enableOnCopyByCapture();
      }
    };

    const website$2 = {
      regexp: new RegExp([
        "rrdynb",
        "fuwu7",
        "jinrilvsi\\.com",
        "www\\.9136\\.com",
        "www\\.jdxzz\\.com",
        "www\\.gaosan\\.com",
        "lqsbcl\\.net"
      ].join("|")),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
        utils.enableOnCopyByCapture();
        utils.enableOnKeyDownByCapture();
        utils.enableOnSelectStartByCapture();
        utils.enableOnContextMenuByCapture();
      }
    };

    const website$1 = {
      config: {
        runAt: DOM_STAGE.START
      },
      regexp: new RegExp(["examcoo"].join("|")),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
        utils.enableOnCopyByCapture();
        utils.enableOnKeyDownByCapture();
        utils.enableOnSelectStartByCapture();
        utils.enableOnContextMenuByCapture();
      }
    };

    const kdoc = {
      config: {
        runAt: DOM_STAGE.START
      },
      regexp: new RegExp("kdocs"),
      init: function() {
        const patch = () => {
          unsafeWindow.APP && (unsafeWindow.APP.canCopy = () => true);
        };
        if (unsafeWindow.APP) {
          patch();
        } else {
          let APP = void 0;
          Object.defineProperty(unsafeWindow, "APP", {
            configurable: false,
            set: (value) => {
              APP = value;
              value && patch();
            },
            get: () => APP
          });
        }
      }
    };

    const website = {
      config: {
        runAt: DOM_STAGE.END
      },
      regexp: new RegExp(
        [
          "16map\\.com",
          "ai-bot\\.cn"
        ].join("|")
      ),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS(
          `
      body * :not(input):not(textarea) {-webkit-touch-callout: auto !important;-webkit-user-select: auto !important;-moz-user-select: auto !important;-khtml-user-select: auto !important;-ms-user-select: auto !important;}
    `
        );
      }
    };

    const websites = [
      website$m,
      website$l,
      website$k,
      website$j,
      website$i,
      website$h,
      website$g,
      website$f,
      website$e,
      website$d,
      website$c,
      website$b,
      website$a,
      website$9,
      website$8,
      website$n,
      website$7,
      website$6,
      website$5,
      website$4,
      kdoc,
      website$3,
      website$2,
      website$1,
      website
    ];

    let siteGetSelectedText = null;
    const initWebsite = () => {
      let websiteConfig = {
        initCopyEvent: true,
        runAt: DOM_STAGE.END,
        captureInstance: false,
        delay: 0
      };
      const mather = (regex, website) => {
        if (regex.test(window.location.href)) {
          if (website.config)
            websiteConfig = Object.assign(websiteConfig, website.config);
          if (websiteConfig.runAt === DOM_STAGE.END) {
            window.addEventListener(DOM_READY, () => website.init());
          } else {
            website.init();
          }
          if (website.getSelectedText)
            siteGetSelectedText = website.getSelectedText;
          return true;
        }
        return false;
      };
      websites.some((website) => mather(website.regexp, website));
      return websiteConfig;
    };
    const getSelectedText = () => {
      if (siteGetSelectedText)
        return siteGetSelectedText();
      if (window.getSelection)
        return (window.getSelection() || "").toString();
      if (document.getSelection)
        return (document.getSelection() || "").toString();
      if (document.selection)
        return document.selection.createRange().text;
      return "";
    };

    (function() {
      const websiteConfig = initWebsite();
      initBaseEvent(websiteConfig);
      initBaseStyle();
      window.addEventListener(
        MOUSE_UP,
        (e) => {
          const handler = () => {
            const content = getSelectedText();
            if (isEmptyContent(content)) {
              instance.hide();
              return void 0;
            }
            instance.onCopy(content, e);
          };
          websiteConfig.delay ? setTimeout(handler, websiteConfig.delay) : handler();
        },
        websiteConfig.captureInstance
      );
    })();

}());
