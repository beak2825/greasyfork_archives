// ==UserScript==
// @name         LINUX DO - Modern Clean Card (极简清爽版)
// @namespace    http://tampermonkey.net/
// @version      1.0.5.1
// @author       YourName
// @description  LINUX DO 论坛美化：严格的扁平化卡片布局 + 极简白底 + [青/粉]微点缀 + 强制“花枝丸”字体。
// @license      MIT
// @icon         https://linux.do/uploads/default/optimized/4X/c/c/d/ccd8c210609d498cbeb3d5201d4c259348447562_2_32x32.png
// @match        https://linux.do/*
// @grant        GM_addStyle
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/557640/LINUX%20DO%20-%20Modern%20Clean%20Card%20%28%E6%9E%81%E7%AE%80%E6%B8%85%E7%88%BD%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/557640/LINUX%20DO%20-%20Modern%20Clean%20Card%20%28%E6%9E%81%E7%AE%80%E6%B8%85%E7%88%BD%E7%89%88%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):(document.head||document.documentElement).appendChild(document.createElement("style")).append(t);})(e));};

  const styleCss = ':root{--c-accent-green: #B4DEBD;--c-accent-green-deep: #3D7A4E;--c-accent-pink: #FFA4A4;--c-highlight-alpha: #3D7A4E;--c-highlight-numeric: #FFA4A4;--bg-body: #f8f9fa;--bg-card: #ffffff;--border-card: #eaecf0;--my-font-stack: "Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "荆南麦圆体", "素材集市康康体","苍耳舒圆体 W01", "PingFang SC", "HarmonyOS Sans", "Microsoft YaHei", sans-serif;--font-shadow: .05px .05px 0px rgba(0, 0, 0, .05);--letter-spacing: .8px;--text-title: #111827;--text-desc: #4b5563;--text-meta: #9ca3af}html.dark{--bg-body: #101010;--bg-card: #1c1c1c;--border-card: #2a2a2a;--text-title: #f3f4f6;--text-desc: #d1d5db;--text-meta: #6b7280;--c-accent-green: #2F4F4F;--c-accent-green-deep: #81C784;--c-accent-pink: #8B4040;--c-highlight-alpha: #81C784;--c-highlight-numeric: #FFA4A4}:root{--font-family: var(--my-font-stack) !important;--d-header-background: var(--bg-card) !important;--d-content-background: var(--bg-card) !important;--primary: var(--text-title) !important}.d-header{box-shadow:none!important;border-bottom:1px solid var(--border-card)!important}html,body,input,button,select,textarea,.topic-list .title,span,p,a,div{font-family:var(--my-font-stack)!important;text-shadow:var(--font-shadow)!important;letter-spacing:var(--letter-spacing)!important}.d-icon,.fa{text-shadow:none!important}.topic-list .topic-list-header{display:none!important}.topic-list tbody{display:flex;flex-direction:column;gap:12px;padding:12px 0;border:none!important}.topic-list tbody tr.topic-list-item{display:grid;grid-template-columns:68px 1fr auto auto auto;grid-template-areas:"avatar content posts views activity";align-items:center;gap:16px;background:var(--bg-card);border:1px solid var(--c-accent-green)!important;border-radius:12px;padding:20px 24px;box-shadow:0 0 8px var(--c-accent-green);transition:all .2s ease}.topic-list-item.was-read{border-color:var(--border-card)!important;box-shadow:0 1px 2px #00000008!important}.topic-list tbody tr.topic-list-item:hover{transform:translateY(-2px);box-shadow:0 4px 4px -8px #00000014!important;border-color:var(--c-accent-pink)!important}.topic-list-item .topic-status .new-indicator{display:none!important}body #main-outlet .topic-list .topic-list-item.was-read .main-link{border-left:none!important}.topic-list td{padding:0!important;border:none!important;display:block}.topic-list .posters{grid-area:avatar;margin-top:4px}.topic-list .posters>a:not(:first-child){display:none}.topic-list .posters a{margin:0}.topic-list .posters img.avatar{width:48px!important;height:48px!important;border-radius:12px;background:var(--bg-body)}.topic-list .main-link{grid-area:content;display:flex;flex-direction:column;gap:12px}.topic-list .link-top-line>.title{font-size:1.15rem!important;font-weight:500!important;color:var(--text-title)!important;line-height:1.6;margin-bottom:0;overflow-wrap:break-word;word-break:break-word;padding:0!important}.topic-excerpt{font-size:.9rem;color:var(--text-desc);line-height:1.6;margin-bottom:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.topic-list .link-bottom-line{display:flex;flex-wrap:wrap;align-items:center;gap:8px;margin-top:0}.discourse-tag{background:#f0fdf4;color:#374151!important;border:1px solid var(--c-accent-green);padding:1px 10px;border-radius:100px;font-size:.75rem!important;font-weight:400}.badge-wrapper.box{border-radius:6px;padding:2px 8px;font-size:.75rem;text-transform:uppercase;letter-spacing:.5px}.topic-list .posts{grid-area:posts}.topic-list .views{grid-area:views}.topic-list .activity{grid-area:activity}.topic-list .posts,.topic-list .views,.topic-list .activity{position:static!important;display:flex!important;align-items:center;justify-content:flex-end;gap:4px;font-size:.8rem!important;color:var(--text-meta)!important;white-space:nowrap;padding:0!important;border:none!important;width:auto!important;height:auto!important}.topic-list .posts span{background:none!important;color:var(--text-desc)!important;font-weight:600!important;padding:0!important;font-size:inherit!important;border-radius:0!important;min-width:auto!important}.topic-list .posts:after{content:"回复";margin-left:4px}.topic-list .views:after{content:"浏览";margin-left:4px}.topic-list .activity span{color:var(--text-meta)!important}.sidebar-section-link{padding:10px 16px!important;border-radius:8px!important;font-size:.9rem!important;font-weight:500!important;transition:background-color .2s ease;border-left:3px solid transparent!important}.sidebar-section-link:hover{background-color:var(--bg-body)!important}.sidebar-section-link.active{background-color:transparent!important;color:var(--c-accent-green-deep)!important;font-weight:600!important;border-left-color:var(--c-accent-green)!important}.sidebar-section-link .d-icon{color:var(--text-meta);font-size:1.1em;margin-right:8px}.sidebar-section-link.active .d-icon{color:var(--c-accent-green-deep)!important}.container.posts{background-color:var(--bg-card)!important;padding:12px 0}.post-stream{display:flex;flex-direction:column;gap:24px}article[id^=post_]{background:var(--bg-card);border:1px solid var(--border-card);border-radius:12px;padding:24px;box-shadow:0 1px 3px #0000000a}.timeline-container{border-left:1px solid var(--border-card)!important;padding-left:24px!important;margin-left:24px!important;background:transparent!important}.btn-primary{background:var(--c-accent-pink)!important;color:#fff!important;border:none;font-weight:700}.highlight-alpha{color:var(--c-highlight-alpha)!important;font-weight:600}.highlight-numeric{color:var(--c-highlight-numeric)!important;font-weight:500}.more-topics__container{background:var(--bg-card);border:1px solid var(--border-card);border-radius:12px;padding:24px;margin-top:24px;box-shadow:0 1px 3px #0000000a;display:block}.more-topics__container .nav-pills{display:flex!important;gap:24px;border-bottom:1px solid var(--border-card);padding-bottom:12px;flex-shrink:0;margin-bottom:24px}.more-topics__container .nav-pills .btn{color:var(--text-meta);font-weight:500;padding:4px 8px;border:none;background:none!important;box-shadow:none!important;border-bottom:2px solid transparent;transition:all .2s ease;border-radius:0}.more-topics__container .nav-pills .btn:hover{color:var(--text-title)}.more-topics__container .nav-pills .btn.active{color:var(--c-accent-green-deep)!important;border-bottom-color:var(--c-accent-green-deep);font-weight:600}@media(max-width:768px){.topic-list tbody tr.topic-list-item{grid-template-columns:1fr auto;grid-template-areas:"content replies" "content activity";padding:16px}.topic-list .posters,.topic-list .views{display:none!important}.topic-list .posts{position:relative;top:0;right:0;margin-bottom:10px}.topic-list .activity{position:relative;bottom:0;right:0}.topic-list .main-link{padding-right:10px}}.topic-post .cooked{line-height:1.8;font-size:1rem}.cooked h1,.cooked h2,.cooked h3{border-bottom:1px solid var(--border-card);padding-bottom:10px;margin-top:2em;margin-bottom:1em}.cooked h1{font-size:1.8rem}.cooked h2{font-size:1.5rem}.cooked h3{font-size:1.25rem}.cooked a{color:#007bff;text-decoration:none;border-bottom:1px solid transparent;transition:border-bottom .2s ease}.cooked a:hover{border-bottom-color:#007bff}.cooked blockquote{background-color:#f0fdf4;border-left:4px solid var(--c-accent-green);padding:12px 20px;margin:1.5em 0;border-radius:8px}.cooked pre{background-color:var(--bg-body);border:1px solid var(--border-card);border-radius:8px;padding:16px;overflow-x:auto}.cooked code{background-color:#ffe5e5;color:#c53030;padding:2px 6px;border-radius:4px;font-size:.9em}.cooked pre code{background:none;color:inherit;padding:0;border-radius:0}.cooked ul,.cooked ol{padding-left:2em}.cooked hr{border:none;border-top:1px solid var(--border-card);margin:2em 0}.topic-post .cooked img:not(.emoji){display:block;max-width:100%;height:auto;margin:20px auto;border-radius:12px;box-shadow:2px 2px 5px #0000004d!important;transition:box-shadow .3s ease-in-out}.topic-post .cooked img:not(.emoji):hover{box-shadow:0 0 8px var(--c-accent-green)!important}.cooked details{background-color:var(--bg-card)!important;border:1px solid var(--border-card);border-radius:8px;padding:16px;margin:1.5em 0}.cooked details summary{font-weight:700;cursor:pointer}.topic-post .cooked a:has(>img:not(.emoji)):hover,.topic-post .cooked div:has(>img:not(.emoji)):hover{box-shadow:none!important;background:none!important}';
  importCSS(styleCss);
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }
  function highlight(element) {
    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
    let node;
    const nodesToProcess = [];
    while (node = walker.nextNode()) {
      if (node.parentElement.tagName.match(/^(STYLE|SCRIPT|TEXTAREA)$/i) || node.parentElement.classList.contains("highlight-alpha") || node.parentElement.classList.contains("highlight-numeric")) {
        continue;
      }
      nodesToProcess.push(node);
    }
    nodesToProcess.forEach((node2) => {
      const text = node2.nodeValue;
      const regex = /([a-zA-Z]+)|([0-9\.\-]+)/g;
      if (!text.match(regex)) return;
      const fragment = document.createDocumentFragment();
      let lastIndex = 0;
      let match;
      regex.lastIndex = 0;
      while ((match = regex.exec(text)) !== null) {
        if (match.index > lastIndex) {
          fragment.appendChild(document.createTextNode(text.substring(lastIndex, match.index)));
        }
        const span = document.createElement("span");
        if (match[1]) {
          span.className = "highlight-alpha";
          span.textContent = match[1];
        } else if (match[2]) {
          span.className = "highlight-numeric";
          span.textContent = match[2];
        }
        fragment.appendChild(span);
        lastIndex = regex.lastIndex;
      }
      if (lastIndex < text.length) {
        fragment.appendChild(document.createTextNode(text.substring(lastIndex)));
      }
      if (fragment.childNodes.length > 0) {
        node2.parentNode.replaceChild(fragment, node2);
      }
    });
  }
  const runHighlight = () => {
    const targetNode = document.querySelector(".topic-list, .topic-post");
    if (targetNode) {
      highlight(targetNode);
    }
  };
  const debouncedHighlight = debounce(runHighlight, 300);
  const observer = new MutationObserver((mutations) => {
    let shouldRun = false;
    for (const mutation of mutations) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        shouldRun = true;
        break;
      }
    }
    if (shouldRun) {
      debouncedHighlight();
    }
  });
  function setupObserver() {
    observer.observe(document.body, { childList: true, subtree: true });
  }
  function initMoreTopicsTabs() {
    const moreTopicsContainer = document.querySelector(".more-topics__container");
    if (!moreTopicsContainer) return;
    const tabs = moreTopicsContainer.querySelectorAll(".nav-pills .btn");
    const tabContents = moreTopicsContainer.querySelectorAll(".topic-list");
    if (!tabs.length || !tabContents.length) return;
    tabs.forEach((tab, index) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tabContents.forEach((c) => c.style.display = "none");
        tab.classList.add("active");
        if (tabContents[index]) {
          tabContents[index].style.display = "";
        }
      });
    });
    if (tabs[0]) tabs[0].click();
  }
  function moveMoreTopicsList() {
    const container = document.querySelector(".more-topics__container");
    if (container) {
      const row = container.querySelector(".row");
      if (row) {
        container.parentNode.insertBefore(row, container);
      }
    }
  }
  function setupMoreTopicsObserver() {
    const moreTopicsObserver = new MutationObserver((mutations) => {
      let shouldInit = false;
      for (const mutation of mutations) {
        if (mutation.type === "childList") {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE && (node.classList.contains("more-topics__container") || node.querySelector && node.querySelector(".more-topics__container"))) {
              shouldInit = true;
              break;
            }
          }
        }
        if (shouldInit) break;
      }
      if (shouldInit) {
        setTimeout(() => {
          initMoreTopicsTabs();
          moveMoreTopicsList();
        }, 100);
      }
    });
    moreTopicsObserver.observe(document.body, { childList: true, subtree: true });
  }
  var _GM_getValue = (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  const DEFAULT_FONT = `"Inter", system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "荆南麦圆体", "素材集市康康体","苍耳舒圆体 W01", "PingFang SC", "HarmonyOS Sans", "Microsoft YaHei", sans-serif`;
  function applyCustomFont() {
    const savedFont = _GM_getValue("customFont", DEFAULT_FONT);
    const styleId = "custom-font-override";
    let styleElement = document.getElementById(styleId);
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }
    styleElement.textContent = `:root { --my-font-stack: ${savedFont} !important; }`;
  }
  function setupFontMenu() {
    _GM_registerMenuCommand("设置自定义字体", () => {
      const currentFont = _GM_getValue("customFont", DEFAULT_FONT);
      const newFont = prompt("请输入你想要的字体，用英文逗号隔开：", currentFont);
      if (newFont && newFont.trim() !== "") {
        _GM_setValue("customFont", newFont.trim());
        applyCustomFont();
        alert("字体已更新！");
      }
    });
    _GM_registerMenuCommand("恢复默认字体", () => {
      _GM_setValue("customFont", DEFAULT_FONT);
      applyCustomFont();
      alert("已恢复默认字体！");
    });
  }
  (function() {
    applyCustomFont();
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => {
        runHighlight();
        setupObserver();
        initMoreTopicsTabs();
        moveMoreTopicsList();
        setupMoreTopicsObserver();
        setupFontMenu();
      });
    } else {
      runHighlight();
      setupObserver();
      initMoreTopicsTabs();
      moveMoreTopicsList();
      setupMoreTopicsObserver();
      setupFontMenu();
    }
  })();

})();