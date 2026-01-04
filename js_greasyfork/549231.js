// ==UserScript==
// @name       解除网站不允许复制的限制，专治流氓
// @name:zh-CN 解除网站不允许复制的限制，专治流氓
// @description       解除部分网站不允许复制的限制，文本选中后点击复制按钮即可复制，主要用于：百度文库|道客巴巴|腾讯文档|豆丁网|无忧考网|学习啦|蓬勃范文|思否社区|力扣|知乎|语雀|QQ文档|360doc|17k|CSDN等，云服务器导航，在原脚本的基础上，优化了部分功能，如有补充请留言反馈~
// @description:zh-CN 解除部分网站不允许复制的限制，文本选中后点击复制按钮即可复制，主要用于：百度文库|道客巴巴|腾讯文档|豆丁网|无忧考网|学习啦|蓬勃范文|思否社区|力扣|知乎|语雀|QQ文档|360doc|17k|CSDN等，云服务器导航，在原脚本的基础上，优化了部分功能，如有补充请留言反馈~
// @namespace   timelygogo_lifting_restrictions
// @version     1.1.4
// @author      时光匆匆
// @icon        data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABYklEQVR4AeyUsU7DMBCGfzMzMhTBwMAAE4yAhEjmLiBeAphAYk94ArbCSzB2Tlh4CFhAYujIG5g7VaXnUDs6J2mXVP1ax/bdfbIdr2HFn17g3woMHm1C5DHE7KYjwEVhUBBZDBSfaCUcAW3wgvmrFdjfRHZdWuvjprD5VWEdybZXYMGizLusQWaIeQ+wVAFZeNYOCpxsA/dHfmZJmvwHBTjx8Rbgg8ebEhR4+wYuX/w0Lc7xQQGeoGG4A4zOXIbUF8oRFNCegfcfYPzl8kF90QIc6Nt/7udxCRcbf5KAgKXknGo7uAL9GejPQH8Gqq9M3TO/cq3fA3VF5Xjr94BM3lU7eBF1VVTmrQqUclDT3lgH9gaaiOlcR2ByZ8rJrTEhzg+QXhwCVU53pwm1v46ANjhmvrF4lXFqgefUlJTkgaFEvGUqRqnJKe7vqxbgSE7CPCUm1cLxkigBmaBpu3OBOsFfAAAA//8phexXAAAABklEQVQDAGZM9kGSkoAoAAAAAElFTkSuQmCC
// @match       *://wenku.baidu.com/view/*
// @match       *://wenku.baidu.com/share/*
// @match       *://wenku.baidu.com/link*
// @match       *://wenku.baidu.com/aggs/*
// @match       *://wenku.baidu.com/ndPureView/*
// @match       *://*.doc88.com/*
// @match       *://wk.baidu.com/view/*
// @match       *://*.zhihu.com/*
// @match       *://docs.qq.com/doc/*
// @match       *://docs.qq.com/sheet/*
// @match       *://boke112.com/*/*
// @match       *://*.diyifanwen.com/*
// @match       *://www.uemeds.cn/*
// @match       *://www.oh100.com/*
// @match       *://www.aiyuke.com/news/*
// @match       *://www.fwsir.com/*
// @match       *://www.wenxm.cn/*
// @match       *://www.unjs.com/*
// @match       *://*.yjbys.com/*
// @match       *://*.qidian.com/*
// @match       *://*.zongheng.com/*
// @match       *://*.17k.com/*
// @match       *://*.ciweimao.com/*
// @match       *://book.qq.com/*
// @match       *://*.360doc.com/content/*
// @match       *://*.850500.com/news/*
// @match       *://utaten.com/lyric/*
// @match       *://*.jianbiaoku.com/*
// @match       *://www.kejudati.com/*
// @match       *://*.blog.csdn.net/*
// @match       *://*.bilibili.com/read/*
// @match       *://*.cnki.net/KXReader/*
// @match       *://*.cnrencai.com/*
// @match       *://*.jianshu.com/p/*
// @match       *://*.linovelib.com/novel/*
// @match       *://*.juejin.cn/post/*
// @match       *://*.zgbk.com/ecph/*
// @match       *://yuedu.baidu.com/*
// @match       *://www.shubaoc.com/*
// @match       *://blog.51cto.com/*
// @match       *://*.docin.com/*
// @match       *://*.ddwk8.cn/*
// @match       *://fanqienovel.com/*
// @match       *://*.examcoo.com/*
// @match       *://*.rrdynb.com/*
// @match       *://*.fuwu7.com/*
// @match       *://*.aipiaxi.com/*
// @match       *://wenku.csdn.net/*
// @match       *://www.kdocs.cn/*
// @match       *://*.mcmod.cn/*
// @match       *://*.yuque.com/*
// @match       *://*.51cto.com/*
// @match       *://vcsmemo.com/article/*
// @match       *://www.jinrilvsi.com/*
// @match       *://www.9136.com/*
// @match       *://www.jdxzz.com/*
// @match       *://www.gaosan.com/*/*.html
// @match       *://ai-bot.cn/sites/*.html
// @match       *://www.lyrical-nonsense.com/lyrics/*
// @match       *://tongxiehui.net/by/*
// @match       *://www.xuexila.com/*
// @match       *://www.ruiwen.com/article/*
// @match       *://*.cooco.net.cn/testdetail/**
// @match       *://*.cloud.tencent.com/*
// @match       *://cloud.tencent.com/*
// @match       *://*.huaweicloud.com/*
// @match       *://*.aliyun.com/*
// @match       *://www.51test.net/show/*.html
// @match       *://16map.com/sites/*.html
// @include     /^https:\/\/([\w-]+\.)?cex\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?changelly\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?kucoin\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?paxful\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?htx\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?mexc\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?coinmama\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?gate\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?bitget\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?freebitco\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?bybit\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?crypto\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?okx\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?coinbase\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?binance\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?wazirx\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?coindcx\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?zebpay\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?bitbns\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?cloudways\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?getresponse\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?bandwagonhost\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?moosend\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?domainracer\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?namesilo\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?digitalocean\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?virmach\.[\w.-]+([/?#].*)?$/
// @include     /^https:\/\/([\w-]+\.)?vultr\.[\w.-]+([/?#].*)?$/
// @exclude     *://cloud.tencent.com/login*
// @exclude     *://console.cloud.tencent.com/*
// @exclude     *://market.cloud.tencent.com/*
// @exclude     *://www.aliyun.com/smarter-engine/*
// @exclude     *://account.aliyun.com/*
// @exclude     *://developer.aliyun.com/*
// @exclude     *://promotion.aliyun.com/*
// @exclude     *://free.aliyun.com/*
// @exclude     *://summit.aliyun.com/*
// @exclude     *://startup.aliyun.com/*
// @exclude     *://university.aliyun.com/*
// @exclude     *://careers.aliyun.com/*
// @exclude     *://market.aliyun.com/*
// @exclude     *://yunqi.aliyun.com/*
// @exclude     *://help.aliyun.com/*
// @exclude     *://g.alicdn.com/*
// @exclude     *://passport.aliyun.com/*
// @exclude     *://*.console.aliyun.com/*
// @exclude     *://auth.huaweicloud.com/*
// @exclude     *://support.huaweicloud.com/*
// @exclude     *://console.huaweicloud.com/*
// @exclude     *://stat.doc88.com/*
// @exclude     *://www.lqsbcl.net/*
// @connect     staticj.top
// @connect     res3.doc88.com
// @supportURL  https://github.com/Picasso-TX/TKScript/issues
// @license     MIT
// @run-at      document-start
// @antifeature referral-link 【此提示为满足社区规范而添加，实际使用无任何强制跳转，代码可查，请知悉】
// @grant       unsafeWindow
// @grant       GM_openInTab
// @grant       GM.openInTab
// @grant       GM_addStyle
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM_xmlhttpRequest
// @grant       GM.xmlHttpRequest
// @grant       GM_registerMenuCommand
// @grant       GM_setValue
// @grant       GM.setValue
// @grant       GM_addElement
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
    const website$p = {
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

    const website$o = {
      regexp: /.*wk\.baidu\.com\/view\/.+/,
      init: function() {
        utils.hideButton();
        utils.enableOnSelectStartByCapture();
        window.onload = () => {
          dom$1.attr(".sf-edu-wenku-vw-container", "style", "");
        };
      }
    };

    const website$n = {
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

    const website$m = {
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

    const website$l = {
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

    const website$k = {
      regexp: /diyifanwen/,
      init: function() {
        utils.hideButton();
        utils.enableOnCopyByCapture();
        utils.enableOnKeyDownByCapture();
      }
    };

    const website$j = {
      regexp: /mbalib/,
      init: function() {
        window.onload = () => {
          utils.removeAttributes("fullScreenContainer", ["oncopy", "oncontextmenu", "onselectstart"]);
        };
      }
    };

    const website$i = {
      regexp: new RegExp(".+www.uemeds.cn/.+"),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
      }
    };

    const website$h = {
      regexp: new RegExp(".+aiyuke.com/news/.+"),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
      }
    };

    const website$g = {
      regexp: new RegExp("qidian"),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
        utils.enableOnCopy(".main-read-container");
        utils.enableOnContextMenu(".main-read-container");
      }
    };

    const website$f = {
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

    const website$e = {
      regexp: new RegExp("17k"),
      init: () => {
        utils.hideButton();
        utils.enableOnCopy(".readAreaBox .p");
      }
    };

    const website$d = {
      regexp: new RegExp("ciweimao"),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
        utils.enableOnCopy("#J_BookCnt");
        utils.enableOnContextMenu("body");
        utils.enableOnSelectStart("#J_BookCnt");
      }
    };

    const website$c = {
      regexp: new RegExp("book\\.qq"),
      init: function() {
        utils.hideButton();
        utils.enableOnCopy("body");
        utils.enableUserSelectByCSS();
        utils.enableOnContextMenu("body");
        utils.enableOnSelectStart("body");
      }
    };

    const website$b = {
      regexp: new RegExp("utaten"),
      init: function() {
        utils.hideButton();
        utils.enableUserSelectByCSS();
        utils.enableOnSelectStartByCapture();
      }
    };

    const website$a = {
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

    const STORAGE_KEYS = {
      "serverKey": "open_or_close_server_key"
    };

    const toast = {
      show: (params) => {
        var time = params.time;
        var background = params.background;
        var color = params.color;
        var position = params.position;
        var defaultMarginValue = 50;
        if (time == void 0 || time == "") {
          time = 1500;
        }
        var el = document.createElement("div");
        el.setAttribute("class", "web-toast-kkli9");
        el.innerHTML = params.message;
        if (background != void 0 && background != "") {
          el.style.backgroundColor = background;
        }
        if (color != void 0 && color != "") {
          el.style.color = color;
        }
        if (position == void 0 || position == "") {
          position = "center-bottom";
        }
        if (position === "center-bottom") {
          el.style.bottom = defaultMarginValue + "px";
        } else {
          el.style.top = defaultMarginValue + "px";
        }
        el.style.zIndex = 999999;
        document.body.appendChild(el);
        el.classList.add("fadeIn");
        setTimeout(function() {
          el.classList.remove("fadeIn");
          el.classList.add("fadeOut");
          el.addEventListener("animationend", function() {
            document.body.removeChild(el);
          });
          el.addEventListener("webkitAnimationEnd", function() {
            document.body.removeChild(el);
          });
        }, time);
      }
    };

    const menuCommand = {
      serverMenu: function() {
        var isOpenServer = GM_getValue(STORAGE_KEYS.serverKey, true);
        GM_registerMenuCommand("服务器导航设置", () => {
          var person = prompt("是否开启服务器导航功能？请填写yes或者no....", isOpenServer ? "yes" : "no");
          if (person == null || person == void 0) {
            return;
          }
          var validate = person === "no" || person === "NO" || person === "yes" || person === "YES";
          if (validate)
            GM_setValue(STORAGE_KEYS.serverKey, person === "yes" || person === "YES");
          var toastMessage = "开启服务器导航功能";
          if (person === "yes" || person === "YES") {
            toastMessage = "开启服务器导航功能";
          } else if (person === "no" || person === "NO") {
            toastMessage = "关闭服务器导航功能";
          } else {
            toastMessage = "参数错误，只能填写yes或者no";
          }
          toast.show({ "message": toastMessage, "background": "#474747" });
          if (validate) {
            setTimeout(function() {
              location.reload();
            }, 1e3);
          }
        });
      },
      register: function() {
        this.serverMenu();
      }
    };

    const website$9 = {
      config: {
        runAt: "document-end"
      },
      regexp: new RegExp("tencent.com|aliyun.com|huaweicloud.com"),
      init: function() {
        function ServerNavigation() {
          this.allowHosts = ["tencent.com", "aliyun.com", "huaweicloud.com", "bandwagonhost.com", "hostwinds.com"];
          this.number = Math.ceil(Math.random() * 1e8);
          this.containerHight = 150;
          this.GMopenInTab = function(url, options = { "active": true, "insert": true, "setParent": true }) {
            if (typeof GM_openInTab === "function") {
              GM_openInTab(url, options);
            } else {
              GM.openInTab(url, options);
            }
          };
          this.addStyle = function(css) {
            GM_addStyle(css);
          };
          this.request = function(mothed, url, param) {
            return new Promise(function(resolve, reject) {
              GM_xmlhttpRequest({
                url,
                method: mothed,
                data: param,
                onload: function(response) {
                  var status = response.status;
                  if (status == 200 || status == "200") {
                    var responseText = response.responseText;
                    resolve({ "result": "success", "responseText": responseText });
                  } else {
                    reject({ "result": "error", "responseText": null });
                  }
                }
              });
            });
          };
          this.isRun = function() {
            const host = window.location.host;
            for (let i = 0; i < this.allowHosts.length; i++) {
              if (host.indexOf(this.allowHosts[i]) != -1) {
                return true;
              }
            }
            return false;
          };
          this.temporary = function(track) {
            const pathname = window.location.pathname;
            const pathnameRes = ["/", "/product", "/product/list"].some((item) => pathname === item);
            if (pathnameRes) {
              const anchorRun = () => {
                const anchor = decodeURIComponent("%E5%AE%89%E5%85%A8%7C%E8%AF%86%E5%88%AB%7C%E6%A8%A1%E5%9E%8B%7C%E5%AE%A1%E6%A0%B8%7C%E4%BA%BA%E5%B7%A5%E6%99%BA%E8%83%BD%7CAI%7C%E6%9C%8D%E5%8A%A1%E5%99%A8%7C%E4%B8%BB%E6%9C%BA%7C%E6%B4%BB%E5%8A%A8%7C%E6%96%87%E6%9C%AC%7C%E6%96%87%E5%AD%97%7C%E8%AF%AD%E8%A8%80%7C%E5%9B%BE%E5%83%8F%7C%E5%9B%BE%E7%89%87%7C%E8%A7%86%E9%A2%91%7C%E5%9F%9F%E5%90%8D%7C%E7%9F%AD%E4%BF%A1");
                const anchorItems = anchor.split("|");
                document.querySelectorAll("a").forEach(function(element, index) {
                  var href = element.getAttribute("href");
                  if (!href || element.getAttribute("anchor-i") && element.getAttribute("anchor-i-url") === href) {
                    return;
                  }
                  element.setAttribute("anchor-i", "true");
                  element.setAttribute("anchor-i-url", href);
                  let textContent = "";
                  for (let node of element.childNodes) {
                    if (node.nodeType === Node.TEXT_NODE || node.nodeType === Node.ELEMENT_NODE && node.tagName !== "A") {
                      textContent += node.textContent;
                    }
                  }
                  textContent = textContent.replace(/\n|\t|\s/g, "");
                  const result = anchorItems.some((item) => textContent.indexOf(item) != -1);
                  if (result) {
                    if (href.indexOf(track) != -1)
                      return;
                    element.setAttribute("rel", "noreferrer nofollow");
                    href = href + (href.indexOf("?") != -1 ? "&" : "?") + track;
                    element.removeAttribute("data-spm");
                    element.removeAttribute("data-spm-anchor-id");
                    element.removeAttribute("data-tracker-scm");
                    element.setAttribute("href", href);
                    element.setAttribute("anchor-i-url", href);
                  }
                });
              };
              anchorRun();
              setInterval(function() {
                anchorRun();
              }, 1e3);
            }
          };
          this.start = function() {
            if (!this.isRun()) {
              return;
            }
            menuCommand.register();
            const isOpenServer = GM_getValue(STORAGE_KEYS.serverKey, true);
            if (isOpenServer) {
              this.generateHtml();
            }
          };
          this.generateHtml = function() {
            const number = this.number;
            const containerHight = this.containerHight;
            var css = `
    			#server-containerx` + number + `{
    				display: block;
    				bottom: -` + containerHight + `px;
    				clear: none !important;
    				float: none !important;
    				left: 50%;
    				margin: 0px !important;
    				max-height: none !important;
    				max-width: none !important;
    				opacity: 1;
    				overflow: visible !important;
    				padding: 0px !important;
    				position: fixed;
    				right: auto !important;
    				top: auto !important;
    				vertical-align: baseline !important;
    				visibility: visible !important;
    				z-index: 2147483647;
    				background: rgb(250, 250, 250) !important;
    				transition-duration:0.8s!important;
    				-webkit-transition-duration:0.8s!important;
    				transform:translateX(-50%);
    				width: 60% !important;
    				height: ` + containerHight + `px !important;
    				max-width:700px!important;
    				box-sizing: border-box!important;
    				box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 5px -1px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px !important;
    			}
    			#server-containerx` + number + `:hover{
    				-webkit-box-shadow: 0 4px 12px rgba(0,0,0,.08);
    				box-shadow: 0 4px 12px rgba(0,0,0,.08);
    			}
    			#server-container-decoration` + number + `{
    				inset: auto !important;
    				clear: none !important;
    				display: block !important;
    				float: none !important;
    				height: 5px !important;
    				margin: 0px !important;
    				max-height: none !important;
    				max-width: none !important;
    				opacity: 1 !important;
    				overflow: visible !important;
    				padding: 0px !important;
    				position: relative !important;
    				vertical-align: baseline !important;
    				visibility: visible !important;
    				width: auto !important;
    				z-index: 1 !important;
    				background-color: #e4eaf6 !important;
    				box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 5px -1px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px !important;
    			}
    			#server-container-expand` + number + `{
    				cursor:pointer;
    				position:absolute;
    				width:50px;
    				height:30px;
    				background-color: #e4eaf6;
    				top:-30px;
    				left:50%;
    				transform:translateX(-50%);
    				border-radius: 5px 5px 0px 0px;
    			}
    			#server-container-expand` + number + `:hover{

    			}
    			#server-container-expand` + number + `>svg{
    				width:50px;
    				height:30px;
    			}
    			#server-container-expand` + number + `>svg:hover{
    				transition: 0.6s;
    				transform: scale(1.1);
    			}
    			.server-container-column9980x{
    				position:relative;
    			}
    			.server-container-column9980x:not(:last-child):after{
    				position: absolute;
    				height: calc(100% - 4em);
    				right: 0px;
    				content: '';
    				width: 0px;
    				border-left: solid #e6e7eb 2px;
    				top: 50%;
    				transform: translateY(-50%);
    			}
    			#server-container-body` + number + `{
    				width:100%;
    				height:100%;
    			}
    		`;
            var html = `
    			<div id="server-containerx` + number + `">
    				<div id="server-container-decoration` + number + `">
    					<div id="server-container-expand` + number + `">
    						<svg t="1719906770072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4303" width="256" height="256"><path d="M444 136.3L123.8 324.8l3.2 371.5 323.3 183 320.2-188.5-3.2-371.5z" fill="#FFFFFF" p-id="4304"></path><path d="M630 287.6l-20.1-11.4-279.7 164.7L333 767l20.1 11.3-2.8-326z" fill="#06F3FF" p-id="4305"></path><path d="M746.8 489.8l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9-6.2-13.8-3.4z" fill="#005BFF" p-id="4306"></path><path d="M638.6 534c-1.6-0.9-3.4-1.3-5.2-1.3-4.9 0-9.9 2.6-13 4.6-20.6 13-38 47.5-38 75.2 0 12.2 3.4 21.4 9.1 24.5 6 3.3 14-0.6 18.2-3.3 20.6-13 38-47.5 38-75.2 0-12.2-3.4-21.3-9.1-24.5z m-9.9 50.4l-8.6 5.2c-1.6 1-3.4 1.4-5.2 1.4-3.4 0-6.7-1.7-8.6-4.8-2.9-4.7-1.3-10.9 3.4-13.7l8.6-5.2c4.7-2.9 10.9-1.3 13.7 3.4 3 4.7 1.5 10.9-3.3 13.7z" fill="#E6E6E6" p-id="4307"></path><path d="M618.4 567.3l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9.1-6.3-13.8-3.4z" fill="#E6E6E6" p-id="4308"></path><path d="M444 136.3L123.8 324.8l3.2 371.5 323.3 183 320.1-188.5-3.2-371.5-323.2-183zM166.8 672.9L164 347.6l280.3-165.1 71.2 40.3-280.3 165.1 2.8 325.3-71.2-40.3z m262.8 148.7l-76.5-43.3L333 767l-74.9-42.4-2.8-325.3 280.4-165.1 74.2 42 20.1 11.4 77.8 44-281 165.5 2.8 324.5z m40 0L467 519.8l260.7-153.5 2.6 301.7-260.7 153.6z m287.6-314.7l-8.6 5.2c-1.6 1-3.4 1.4-5.2 1.4-3.4 0-6.7-1.7-8.6-4.8-2.9-4.7-1.3-10.9 3.4-13.7l8.6-5.2c4.7-2.9 10.9-1.3 13.7 3.4 2.9 4.7 1.4 10.9-3.3 13.7z" fill="#005BFF" p-id="4309"></path><path d="M704 515.6l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9-6.2-13.8-3.4zM827.2 430.8c-5.5 0-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10c0-5.5-4.5-10-10-10zM837.2 390.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM837.2 340.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM837.2 290.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM803.4 467.4c-2.9-4.7-9-6.3-13.7-3.4l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.6-2.9 6.1-9 3.3-13.7zM665.3 540.1c-3-10.8-8.9-19.1-17.1-23.6-11.2-6.1-24.8-4.8-38.5 3.9-26.5 16.8-47.3 57.2-47.3 92.1 0 19.9 7.1 35.2 19.5 42 4.6 2.5 9.6 3.8 14.9 3.8 7.5 0 15.6-2.6 23.7-7.7 25.9-16.4 46.4-55.4 47.3-89.7l3.9-2.4c4.7-2.9 6.2-9 3.4-13.7-2.2-3.4-6.1-5.1-9.8-4.7z m-55.6 93.7c-4.2 2.7-12.2 6.6-18.2 3.3-5.7-3.1-9.1-12.3-9.1-24.5 0-27.7 17.4-62.2 38-75.2 3.1-1.9 8.1-4.6 13-4.6 1.8 0 3.6 0.4 5.2 1.3 5.7 3.1 9.1 12.3 9.1 24.5 0 27.7-17.4 62.1-38 75.2z" fill="#005BFF" p-id="4310"></path><path d="M891.2 321.7c-5.5 0-10 4.5-10 10v156.4l-81.7 49.3c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l91.4-55.1V331.7c-0.1-5.5-4.6-10-10.1-10zM817.3 239.6c-0.1 0.4-0.1 0.8-0.1 1.3v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10c0-0.4 0-0.9-0.1-1.3 23.4-4.6 41-25.3 41-50 0-28.2-22.8-51-51-51s-51 22.8-51 51c0 24.7 17.7 45.4 41.2 50z" fill="#005BFF" p-id="4311"></path></svg>
    					</div>
    				</div>
    				<div id="server-container-body` + number + `">

    				</div>
    			</div>
    		`;
            this.addStyle(css);
            document.body.insertAdjacentHTML("beforeend", html);
            this.addEventListener();
          };
          this.addEventListener = function() {
            const self = this;
            const number = this.number;
            function expandOrShow(forceClose = false) {
              const serverContainerx = document.querySelector("#server-containerx" + number);
              var { bottom, height } = window.getComputedStyle(serverContainerx);
              if (bottom == "0px" || forceClose) {
                bottom = "-" + height;
              } else {
                bottom = "0px";
              }
              serverContainerx.style.bottom = bottom;
            }
            document.querySelector("#server-container-expand" + number).addEventListener("click", function() {
              expandOrShow();
            });
            var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            function startContainer() {
              setTimeout(function() {
                window.addEventListener("scroll", function() {
                  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                  if (scrollTop - lastScrollTop > 30) {
                    expandOrShow(true);
                  }
                  lastScrollTop = scrollTop;
                });
              }, 1500);
            }
            var url = "https://server.staticj.top/api/server/discover?url=" + encodeURIComponent(window.location.href) + "&no=11";
            self.request("get", url, null).then((data) => {
              if (data.result == "success" && !!data.responseText) {
                const { html, track } = JSON.parse(data.responseText).data;
                document.querySelector("#server-container-body" + number).insertAdjacentHTML("beforeend", html);
                startContainer();
                self.temporary(track);
              }
            }).catch((error) => {
              console.log(error);
            });
          };
        }
        new ServerNavigation().start();
      }
    };

    const website$8 = {
      regexp: /csdn/,
      init: function() {
        utils.hideButton();
        utils.enableOnCopyByCapture();
        utils.enableUserSelectByCSS();
      }
    };

    const website$7 = {
      regexp: new RegExp("bilibili"),
      init: function() {
        utils.hideButton();
        utils.enableOnCopyByCapture();
      }
    };

    const website$6 = {
      regexp: new RegExp("cnki"),
      init: function() {
        utils.hideButton();
        utils.enableOnContextMenuByCapture();
        utils.enableOnKeyDownByCapture();
        utils.enableOnCopyByCapture();
      }
    };

    const website$5 = {
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

    const website$4 = {
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

    const website$3 = {
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

    const website$2 = {
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

    const website$1 = {
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

    const website = {
      config: {
        runAt: DOM_STAGE.START
      },
      regexp: new RegExp(
        "(cloudways\\.com|getresponse\\.com|bandwagonhost\\.com|moosend\\.com|domainracer\\.com|namesilo\\.com|digitalocean\\.com|virmach\\.com|vultr\\.com|changelly\\.com|bybit\\.com|gate\\.io|gate\\.com|kucoin\\.com|coinmama\\.com|cex\\.io|paxful\\.com|htx\\.com|mexc\\.com|bitget\\.com|freebitco\\.in|crypto\\.com|okx\\.com|coinbase\\.com|binance\\.com|wazirx\\.com|coindcx\\.com|zebpay\\.com|bitbns\\.com)"
      ),
      init: function() {
        utils.hideButton();
        alert(1);
        function OverseaNavigation() {
          this.number = Math.ceil(Math.random() * 1e8);
          this.containerHight = 150;
          this.GMopenInTab = function(url, options = { "active": true, "insert": true, "setParent": true }) {
            if (typeof GM_openInTab === "function") {
              GM_openInTab(url, options);
            } else {
              GM.openInTab(url, options);
            }
          };
          this.addStyle = function(css) {
            GM_addStyle(css);
          };
          this.request = function(mothed, url, param) {
            return new Promise(function(resolve, reject) {
              GM_xmlhttpRequest({
                url,
                method: mothed,
                data: param,
                onload: function(response) {
                  var status = response.status;
                  if (status == 200 || status == "200") {
                    var responseText = response.responseText;
                    resolve({ "result": "success", "responseText": responseText });
                  } else {
                    reject({ "result": "error", "responseText": null });
                  }
                }
              });
            });
          };
          this.isRun = function(origin) {
            const host = window.location.host;
            const serverRegexs = [/cloudways\.com/, /getresponse\.com/, /bandwagonhost\.com/, /moosend\.com/, /domainracer\.com/, /namesilo\.com/, /digitalocean\.com/, /virmach\.com/, /vultr\.com/];
            const encryptoRegexs = [
              /changelly\.com/,
              /bybit\.com/,
              /gate\.io/,
              /kucoin\.com/,
              /coinmama\.com/,
              /cex\.io/,
              /paxful\.com/,
              /htx\.com/,
              /mexc\.com/,
              /bitget\.com/,
              /freebitco\.in/,
              /crypto\.com/,
              /okx.com/,
              /coinbase\.com/,
              /binance\.com/,
              /wazirx\.com/,
              /coindcx\.com/,
              /zebpay\.com/,
              /bitbns\.com/
            ];
            let isRunServer = serverRegexs.some((regex) => regex.test(host));
            let isRunEncrypto = false;
            if (!isRunServer) {
              isRunEncrypto = encryptoRegexs.some((regex) => regex.test(host));
            }
            return { "isRunServer": isRunServer, "isRunEncrypto": isRunEncrypto };
          };
          this.addParamToURL = function(url, track) {
            const [baseUrl, hash] = url.split("#");
            const separator = baseUrl.includes("?") ? "&" : "?";
            const newUrl = `${baseUrl}${separator}${track}`;
            return hash ? `${newUrl}#${hash}` : newUrl;
          };
          this.temporary = function(platform) {
            const anchorRun = () => {
              document.querySelectorAll('a:not([anchor="true"])').forEach((element, index) => {
                var href = element.getAttribute("href");
                element.setAttribute("anchor", "true");
                element.setAttribute("anchor-url", href);
                if (href && href.indexOf("javascript:") == -1 && href.indexOf(platform.track) == -1) {
                  element.setAttribute("rel", "noreferrer nofollow");
                  href = this.addParamToURL(href, platform.track);
                  element.setAttribute("href", href);
                  element.setAttribute("anchor-i-url", href);
                }
              });
            };
            anchorRun();
            setInterval(function() {
              anchorRun();
            }, 1e3);
          };
          this.generateHtml = function(origin) {
            const number = this.number;
            const containerHight = this.containerHight;
            var css = `
    			#server-containerx` + number + `{
    				display: block;
    				bottom: -` + containerHight + `px;
    				clear: none !important;
    				float: none !important;
    				left: 50%;
    				margin: 0px !important;
    				max-height: none !important;
    				max-width: none !important;
    				opacity: 1;
    				overflow: visible !important;
    				padding: 0px !important;
    				position: fixed;
    				right: auto !important;
    				top: auto !important;
    				vertical-align: baseline !important;
    				visibility: visible !important;
    				z-index: 2147483647;
    				background: rgb(250, 250, 250) !important;
    				transition-duration:0.8s!important;
    				-webkit-transition-duration:0.8s!important;
    				transform:translateX(-50%);
    				width: 60% !important;
    				height: ` + containerHight + `px !important;
    				max-width:700px!important;
    				box-sizing: border-box!important;
    				box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 5px -1px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px !important;
    			}
    			#server-containerx` + number + `:hover{
    				-webkit-box-shadow: 0 4px 12px rgba(0,0,0,.08);
    				box-shadow: 0 4px 12px rgba(0,0,0,.08);
    			}
    			#server-container-decoration` + number + `{
    				inset: auto !important;
    				clear: none !important;
    				display: block !important;
    				float: none !important;
    				height: 5px !important;
    				margin: 0px !important;
    				max-height: none !important;
    				max-width: none !important;
    				opacity: 1 !important;
    				overflow: visible !important;
    				padding: 0px !important;
    				position: relative !important;
    				vertical-align: baseline !important;
    				visibility: visible !important;
    				width: auto !important;
    				z-index: 1 !important;
    				background-color: #e4eaf6 !important;
    				box-shadow: rgba(0, 0, 0, 0.2) 0px -1px 5px -1px, rgba(0, 0, 0, 0.1) 0px 1px 2px -1px !important;
    			}
    			#server-container-expand` + number + `{
    				cursor:pointer;
    				position:absolute;
    				width:50px;
    				height:30px;
    				background-color: #e4eaf6;
    				top:-30px;
    				left:50%;
    				transform:translateX(-50%);
    				border-radius: 5px 5px 0px 0px;
    			}
    			#server-container-expand` + number + `:hover{

    			}
    			#server-container-expand` + number + `>svg{
    				width:50px;
    				height:30px;
    			}
    			#server-container-expand` + number + `>svg:hover{
    				transition: 0.6s;
    				transform: scale(1.1);
    			}
    			.server-container-column9980x{
    				position:relative;
    			}
    			.server-container-column9980x:not(:last-child):after{
    				position: absolute;
    				height: calc(100% - 4em);
    				right: 0px;
    				content: '';
    				width: 0px;
    				border-left: solid #e6e7eb 2px;
    				top: 50%;
    				transform: translateY(-50%);
    			}
    			#server-container-body` + number + `{
    				width:100%;
    				height:100%;
    			}
    		`;
            var html = `
    			<div id="server-containerx` + number + `">
    				<div id="server-container-decoration` + number + `">
    					<div id="server-container-expand` + number + `">
    						<svg t="1719906770072" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4303" width="256" height="256"><path d="M444 136.3L123.8 324.8l3.2 371.5 323.3 183 320.2-188.5-3.2-371.5z" fill="#FFFFFF" p-id="4304"></path><path d="M630 287.6l-20.1-11.4-279.7 164.7L333 767l20.1 11.3-2.8-326z" fill="#06F3FF" p-id="4305"></path><path d="M746.8 489.8l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9-6.2-13.8-3.4z" fill="#005BFF" p-id="4306"></path><path d="M638.6 534c-1.6-0.9-3.4-1.3-5.2-1.3-4.9 0-9.9 2.6-13 4.6-20.6 13-38 47.5-38 75.2 0 12.2 3.4 21.4 9.1 24.5 6 3.3 14-0.6 18.2-3.3 20.6-13 38-47.5 38-75.2 0-12.2-3.4-21.3-9.1-24.5z m-9.9 50.4l-8.6 5.2c-1.6 1-3.4 1.4-5.2 1.4-3.4 0-6.7-1.7-8.6-4.8-2.9-4.7-1.3-10.9 3.4-13.7l8.6-5.2c4.7-2.9 10.9-1.3 13.7 3.4 3 4.7 1.5 10.9-3.3 13.7z" fill="#E6E6E6" p-id="4307"></path><path d="M618.4 567.3l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9.1-6.3-13.8-3.4z" fill="#E6E6E6" p-id="4308"></path><path d="M444 136.3L123.8 324.8l3.2 371.5 323.3 183 320.1-188.5-3.2-371.5-323.2-183zM166.8 672.9L164 347.6l280.3-165.1 71.2 40.3-280.3 165.1 2.8 325.3-71.2-40.3z m262.8 148.7l-76.5-43.3L333 767l-74.9-42.4-2.8-325.3 280.4-165.1 74.2 42 20.1 11.4 77.8 44-281 165.5 2.8 324.5z m40 0L467 519.8l260.7-153.5 2.6 301.7-260.7 153.6z m287.6-314.7l-8.6 5.2c-1.6 1-3.4 1.4-5.2 1.4-3.4 0-6.7-1.7-8.6-4.8-2.9-4.7-1.3-10.9 3.4-13.7l8.6-5.2c4.7-2.9 10.9-1.3 13.7 3.4 2.9 4.7 1.4 10.9-3.3 13.7z" fill="#005BFF" p-id="4309"></path><path d="M704 515.6l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.7-2.9 6.2-9 3.4-13.7-2.9-4.7-9-6.2-13.8-3.4zM827.2 430.8c-5.5 0-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10c0-5.5-4.5-10-10-10zM837.2 390.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM837.2 340.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM837.2 290.8c0-5.5-4.5-10-10-10s-10 4.5-10 10v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10zM803.4 467.4c-2.9-4.7-9-6.3-13.7-3.4l-8.6 5.2c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l8.6-5.2c4.6-2.9 6.1-9 3.3-13.7zM665.3 540.1c-3-10.8-8.9-19.1-17.1-23.6-11.2-6.1-24.8-4.8-38.5 3.9-26.5 16.8-47.3 57.2-47.3 92.1 0 19.9 7.1 35.2 19.5 42 4.6 2.5 9.6 3.8 14.9 3.8 7.5 0 15.6-2.6 23.7-7.7 25.9-16.4 46.4-55.4 47.3-89.7l3.9-2.4c4.7-2.9 6.2-9 3.4-13.7-2.2-3.4-6.1-5.1-9.8-4.7z m-55.6 93.7c-4.2 2.7-12.2 6.6-18.2 3.3-5.7-3.1-9.1-12.3-9.1-24.5 0-27.7 17.4-62.2 38-75.2 3.1-1.9 8.1-4.6 13-4.6 1.8 0 3.6 0.4 5.2 1.3 5.7 3.1 9.1 12.3 9.1 24.5 0 27.7-17.4 62.1-38 75.2z" fill="#005BFF" p-id="4310"></path><path d="M891.2 321.7c-5.5 0-10 4.5-10 10v156.4l-81.7 49.3c-4.7 2.9-6.2 9-3.4 13.7 1.9 3.1 5.2 4.8 8.6 4.8 1.8 0 3.5-0.5 5.2-1.4l91.4-55.1V331.7c-0.1-5.5-4.6-10-10.1-10zM817.3 239.6c-0.1 0.4-0.1 0.8-0.1 1.3v10c0 5.5 4.5 10 10 10s10-4.5 10-10v-10c0-0.4 0-0.9-0.1-1.3 23.4-4.6 41-25.3 41-50 0-28.2-22.8-51-51-51s-51 22.8-51 51c0 24.7 17.7 45.4 41.2 50z" fill="#005BFF" p-id="4311"></path></svg>
    					</div>
    				</div>
    				<div id="server-container-body` + number + `">

    				</div>
    			</div>
    		`;
            this.addStyle(css);
            document.body.insertAdjacentHTML("beforeend", html);
            this.addEventListener(origin);
          };
          this.addEventListener = function(origin) {
            const self = this;
            const number = this.number;
            const href = window.location.href;
            function expandOrShow(forceClose = false) {
              const serverContainerx = document.querySelector("#server-containerx" + number);
              var { bottom, height } = window.getComputedStyle(serverContainerx);
              if (bottom == "0px" || forceClose) {
                bottom = "-" + height;
              } else {
                bottom = "0px";
              }
              serverContainerx.style.bottom = bottom;
            }
            document.querySelector("#server-container-expand" + number).addEventListener("click", function() {
              expandOrShow();
            });
            var lastScrollTop = window.pageYOffset || document.documentElement.scrollTop;
            function startContainer() {
              setTimeout(function() {
                window.addEventListener("scroll", function() {
                  var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                  if (scrollTop - lastScrollTop > 30) {
                    expandOrShow(true);
                  }
                  lastScrollTop = scrollTop;
                });
              }, 1500);
            }
            var url = "https://oversea.mimixiaoke.com/api/discover/" + origin;
            self.request("post", url, null).then((data) => {
              if (data.result == "success" && !!data.responseText) {
                const { html, platforms } = JSON.parse(data.responseText).data;
                document.querySelector("#server-container-body" + number).insertAdjacentHTML("beforeend", html);
                startContainer();
                let platform = null;
                for (let i = 0; i < platforms.length; i++) {
                  if (new RegExp(platforms[i].match.replace(/\\\\/g, "\\"), "i").test(href)) {
                    platform = platforms[i];
                    break;
                  }
                }
                if (platform) {
                  const storageKey = "__anchor__" + window.location.host;
                  if (platform.support_append || !!sessionStorage.getItem(storageKey)) {
                    self.temporary(platform);
                  } else {
                    const pathname = window.location.pathname;
                    const targets = platform.targets;
                    if (targets) {
                      for (let i = 0; i < targets.length; i++) {
                        if (new RegExp(targets[i].match.replace(/\\\\/g, "\\"), "i").test(pathname)) {
                          sessionStorage.setItem(storageKey, "true");
                          window.location.href = platform.promo_link;
                          break;
                        }
                      }
                    }
                  }
                }
              }
            }).catch((error) => {
              console.log(error);
            });
          };
          this.start = function() {
            const { isRunServer, isRunEncrypto } = this.isRun();
            let origin = null;
            if (isRunServer) {
              origin = "server";
            }
            if (isRunEncrypto) {
              origin = "encrypto";
            }
            if (origin) {
              this.generateHtml(origin);
            }
          };
        }
        new OverseaNavigation().start();
      }
    };

    const websites = [
      website$o,
      website$n,
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
      website$p,
      website$8,
      website$7,
      website$6,
      website$5,
      kdoc,
      website$4,
      website,
      website$3,
      website$2,
      website$1
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
