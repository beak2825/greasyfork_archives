// ==UserScript==
// @name         linovelib 优化edge大声朗读体验
// @namespace    https://github.com/IronKinoko/userscripts/tree/master/packages/linovelib
// @version      1.4.12
// @license      MIT
// @description  优化 linovelib 阅读体验，新增移除隐藏元素功能优化edge大声朗读体验
// @author       IronKinoko
// @match        https://www.linovelib.com/*
// @match        https://w.linovelib.com/*
// @match        https://www.bilinovel.com/*
// @icon         https://www.google.com/s2/favicons?domain=w.linovelib.com
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/552010/linovelib%20%E4%BC%98%E5%8C%96edge%E5%A4%A7%E5%A3%B0%E6%9C%97%E8%AF%BB%E4%BD%93%E9%AA%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/552010/linovelib%20%E4%BC%98%E5%8C%96edge%E5%A4%A7%E5%A3%B0%E6%9C%97%E8%AF%BB%E4%BD%93%E9%AA%8C.meta.js
// ==/UserScript==
(function () {
  'use strict';

  function isMobile() {
    const re = /iphone|ipad|ipod|android|webos|blackberry|windows phone/i;
    const ua = navigator.userAgent;
    return re.test(ua);
  }

  function normalizeKeyEvent(e) {
    const SPECIAL_KEY_EN = "`-=[]\\;',./~!@#$%^&*()_+{}|:\"<>?".split("");
    const SPECIAL_KEY_ZH = "\xB7-=\u3010\u3011\u3001\uFF1B\u2018\uFF0C\u3002/\uFF5E\uFF01@#\xA5%\u2026&*\uFF08\uFF09\u2014+\u300C\u300D\uFF5C\uFF1A\u201C\u300A\u300B\uFF1F".split("");
    let key = e.key;
    if (e.code === "Space") {
      key = "Space";
    }
    if (/^[a-z]$/.test(key)) {
      key = key.toUpperCase();
    } else if (SPECIAL_KEY_ZH.includes(key)) {
      key = SPECIAL_KEY_EN[SPECIAL_KEY_ZH.indexOf(key)];
    }
    let keyArr = [];
    e.ctrlKey && keyArr.push("ctrl");
    e.metaKey && keyArr.push("meta");
    e.shiftKey && !SPECIAL_KEY_EN.includes(key) && keyArr.push("shift");
    e.altKey && keyArr.push("alt");
    if (!/Control|Meta|Shift|Alt/i.test(key))
      keyArr.push(key);
    keyArr = [...new Set(keyArr)];
    return keyArr.join("+");
  }
  function keybind(keys, keydown, keyup) {
    const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
    keys = keys.filter((key) => !key.includes(isMac ? "ctrl" : "meta"));
    function createProcess(callback) {
      return function(e) {
        var _a;
        if (((_a = document.activeElement) == null ? void 0 : _a.tagName) === "INPUT")
          return;
        const normalizedKey = normalizeKeyEvent(e).toLowerCase();
        for (const key of keys) {
          if (key.toLowerCase() === normalizedKey)
            callback(e, key);
        }
      };
    }
    window.addEventListener("keydown", createProcess(keydown));
    if (keyup)
      window.addEventListener("keyup", createProcess(keyup));
  }

  function matcher(source, regexp) {
    if (typeof regexp === "string")
      return source.includes(regexp);
    return !!source.match(regexp);
  }
  function router(config) {
    const opts = {
      domain: "",
      routes: []
    };
    if ("routes" in config) {
      opts.domain = config.domain;
      opts.routes = config.routes;
    } else {
      opts.routes = Array.isArray(config) ? config : [config];
    }
    if (opts.domain) {
      const domains = Array.isArray(opts.domain) ? opts.domain : [opts.domain];
      const match = domains.some(
        (domain) => matcher(window.location.origin, domain)
      );
      if (!match)
        return;
    }
    const pathSource = window.location.pathname + window.location.search + window.location.hash;
    if (typeof opts.routes === "function") {
      opts.routes();
      return;
    }
    const routes = Array.isArray(opts.routes) ? opts.routes : [opts.routes];
    const runRoutes = routes.filter((route) => {
      let match = true;
      if (route.path) {
        match = matcher(pathSource, route.path);
      }
      if (route.pathname) {
        match = matcher(window.location.pathname, route.pathname);
      }
      if (route.search) {
        match = matcher(window.location.search, route.search);
      }
      if (route.hash) {
        match = matcher(window.location.hash, route.hash);
      }
      return match;
    });
    runRoutes.forEach((route) => {
      if (route.setup)
        route.setup();
    });
    function run() {
      runRoutes.forEach((route) => {
        if (route.run)
          route.run();
      });
    }
    if (window.document.readyState === "complete") {
      run();
    } else {
      window.addEventListener("load", run);
    }
  }

  async function main$1() {
    if (!window.ReadTools)
      return;
    removeHiddenElements();
    resetPageEvent();
    if (isMobile())
      injectMovePageEvent();
    else
      injectShortcuts();
  }
  async function fixADBlock() {
    var _a;
    const res = await fetch(window.location.href);
    const text = await res.text();
    const html = new DOMParser().parseFromString(text, "text/html");
    const volumes = html.querySelector("#volumes");
    if (!volumes)
      return;
    (_a = document.querySelector("#volumes")) == null ? void 0 : _a.replaceWith(volumes);
    try {
      document.getElementById(
        "bookmarkX"
      ).innerHTML = `<div class="chapter-bar">\u9605\u8BFB\u8FDB\u5EA6</div><span class="historyChapter"><a href="/novel/${targetRecord.articleid}/${targetRecord.chapterid}_${targetRecord.page}.html" class="chapter-li-a "><span class="chapter-index blue">${targetRecord.chaptername}</span></a></span>`;
    } catch (error) {
    }
  }
  function resetPageEvent() {
    const $body = document.body;
    $body.onclick = (e) => {
      const toolsId = ["#toptools", "#bottomtools", "#readset"];
      if (toolsId.some(
        (id) => {
          var _a;
          return (_a = document.querySelector(id)) == null ? void 0 : _a.contains(e.target);
        }
      )) {
        return;
      }
      window.ReadPages.PageClick();
    };
  }
  function injectMovePageEvent() {
    let left, startX, startY, diffX, startTime, isMoved, direction;
    const $page = document.getElementById("apage");
    const isDisabled = (e) => {
      return window.ReadTools.pagemid != 1 || e.touches.length > 1 || window.visualViewport && window.visualViewport.scale !== 1 || window.getSelection() && window.getSelection().toString().length > 0;
    };
    window.addEventListener("touchstart", (e) => {
      if (isDisabled(e))
        return;
      left = parseFloat($page.style.left.replace("px", "")) || 0;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      startTime = Date.now();
      isMoved = false;
      direction = "";
    });
    window.addEventListener(
      "touchmove",
      (e) => {
        if (isDisabled(e))
          return;
        isMoved = true;
        diffX = e.touches[0].clientX - startX;
        let diffY = e.touches[0].clientY - startY;
        if (direction === "") {
          direction = Math.abs(diffX) > Math.abs(diffY) ? "x" : "y";
        }
        if (direction === "x") {
          e.preventDefault();
          $page.style.left = left + diffX + "px";
          $page.style.transition = "initail";
        }
      },
      { passive: false }
    );
    window.addEventListener("touchend", (e) => {
      if (isDisabled(e))
        return;
      if (!isMoved || direction === "y")
        return;
      const diffTime = Date.now() - startTime;
      const threshold = diffTime < 300 ? 10 : document.documentElement.clientWidth * 0.3;
      $page.style.transition = "";
      if (Math.abs(diffX) > threshold) {
        const type = diffX > 0 ? "previous" : "next";
        window.ReadPages.ShowPage(type);
        if (window.ReadPages.currentPage > window.ReadPages.totalPages || window.ReadPages.currentPage < 1) {
          window.ReadPages.ShowPage();
        }
      } else {
        window.ReadPages.ShowPage();
      }
    });
  }
  function injectShortcuts() {
    keybind(["a", "s", "w", "d", "space", "shift+space"], (e, key) => {
      if (window.ReadTools.pagemid != 1)
        return;
      switch (key) {
        case "shift+space":
        case "a":
        case "w":
          window.ReadPages.ShowPage("previous");
          break;
        case "space":
        case "d":
        case "s":
          window.ReadPages.ShowPage("next");
          break;
      }
    });
  }

  function main() {
    removeSelectEvent();
    removeHiddenElements();
    if (document.body.id === "readbg") {
      injectEvent();
    }
  }

  /**
   * 移除具有特定样式的隐藏元素
   * 遍历内容容器中的元素，如果元素包含以下样式则移除该元素：
   * position: absolute; 
   * transform: scale(0);
   */
  function removeHiddenElements() {
    // 等待DOM加载完成
    if (document.readyState !== "loading") {
      processHiddenElements();
    } else {
      document.addEventListener("DOMContentLoaded", processHiddenElements);
    }

    function processHiddenElements() {
      // 尝试多种可能的内容容器元素
      const contentContainers = [
        document.getElementById("TextContent"),
        document.getElementById("chapter-content"),
        document.querySelector(".chapter-content"),
        document.getElementById("apage"),
        document.querySelector("#apage .p-content"),
        document.querySelector(".p-content"),
        document.getElementById("content"),
        document.querySelector(".content"),
        // 如果以上都找不到，就直接在整个body中查找
        document.body
      ];

      // 找到第一个存在的容器元素
      const contentContainer = contentContainers.find(container => container !== null);
      
      if (!contentContainer) {
        console.log("未找到内容容器元素");
        return;
      }

      // 获取所有子元素
      const elements = contentContainer.querySelectorAll("*");
      
      let removedCount = 0;
      elements.forEach(element => {
        // 检查元素是否具有特定的data属性（用于识别可能的反爬虫元素）
        const hasDataAttribute = Array.from(element.attributes).some(attr => 
          attr.name.startsWith('data-') && attr.name.length > 5
        );
        
        const computedStyle = window.getComputedStyle(element);
        
        // 检查是否具有 position: absolute 样式
        const hasAbsolutePosition = computedStyle.position === "absolute";
        
        // 检查是否具有 transform: scale(0) 样式
        const transformValue = computedStyle.transform;
        const hasZeroScale = transformValue.includes("scale(0") || transformValue.includes("scale3d(0");
        
        // 检查是否具有非常小的尺寸（可能是隐藏元素的特征）
        const rect = element.getBoundingClientRect();
        const hasSmallDimensions = rect.width < 1 && rect.height < 1;
        
        // 如果元素具有指定的样式，或者具有data属性且尺寸很小，则移除该元素
        if ((hasAbsolutePosition && hasZeroScale) || 
            (hasDataAttribute && hasSmallDimensions) ||
            (hasDataAttribute && hasAbsolutePosition && (transformValue.includes("scale") || computedStyle.opacity === "0"))) {
          element.remove();
          removedCount++;
        }
      });
      
      // 输出日志信息
      if (removedCount > 0) {
        console.log(`已移除 ${removedCount} 个隐藏元素`);
      }
    }
  }
  function removeSelectEvent() {
    const dom = document.createElement("style");
    dom.innerHTML = `* { user-select: initial !important; }`;
    document.body.append(dom);
    document.body.removeAttribute("onselectstart");
  }
  function injectEvent() {
    const scripts = Array.from(document.scripts);
    const script = scripts.find(
      (script2) => script2.innerHTML.includes('prevpage="')
    );
    if (!script)
      return;
    const res = script.innerHTML.match(
      new RegExp('prevpage="(?<pre>.*?)";.*nextpage="(?<next>.*?)";')
    );
    if (!(res == null ? void 0 : res.groups))
      return;
    const { pre, next } = res.groups;
    keybind(
      ["w", "s", "a", "d"],
      (e, key) => {
        switch (key) {
          case "w":
          case "s":
            const direction = key === "w" ? -1 : 1;
            if (e.repeat)
              scroll.start(direction * 15);
            else
              window.scrollBy({ behavior: "smooth", top: direction * 200 });
            break;
          case "a":
          case "d":
            window.location.pathname = key === "a" ? pre : next;
            break;
        }
      },
      (e, key) => {
        switch (key) {
          case "w":
          case "s":
            scroll.stop();
            break;
        }
      }
    );
  }
  const scroll = (() => {
    let handle;
    function stop() {
      if (!handle)
        return;
      cancelAnimationFrame(handle);
      handle = void 0;
    }
    function start(step) {
      if (handle)
        return;
      function animate() {
        handle = requestAnimationFrame(animate);
        window.scrollBy({ top: step });
      }
      handle = requestAnimationFrame(animate);
    }
    return { start, stop };
  })();

  var e=[],t=[];function n(n,r){if(n&&"undefined"!=typeof document){var a,s=!0===r.prepend?"prepend":"append",d=!0===r.singleTag,i="string"==typeof r.container?document.querySelector(r.container):document.getElementsByTagName("head")[0];if(d){var u=e.indexOf(i);-1===u&&(u=e.push(i)-1,t[u]={}),a=t[u]&&t[u][s]?t[u][s]:t[u][s]=c();}else a=c();65279===n.charCodeAt(0)&&(n=n.substring(1)),a.styleSheet?a.styleSheet.cssText+=n:a.appendChild(document.createTextNode(n));}function c(){var e=document.createElement("style");if(e.setAttribute("type","text/css"),r.attributes)for(var t=Object.keys(r.attributes),n=0;n<t.length;n++)e.setAttribute(t[n],r.attributes[t[n]]);var a="prepend"===s?"afterbegin":"beforeend";return i.insertAdjacentElement(a,e),e}}

  var css = "@charset \"UTF-8\";\n.k-wrapper #catelogX .module-header-r {\n  min-width: 0;\n}\n.k-wrapper #catelogX .module-header-r .module-header-btn {\n  position: static;\n  padding: 0;\n}\n.k-wrapper #volumes .chapter-bar {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  position: relative;\n}\n.k-wrapper #volumes .chapter-bar::after {\n  content: none;\n}\n.k-wrapper #volumes .chapter-bar .download-btn {\n  border-radius: 4px;\n  background-color: rgba(255, 57, 84, 0.1);\n  padding: 4px 12px;\n  font-weight: 500;\n  color: #ff3955;\n  border: 0;\n  white-space: nowrap;\n  margin-left: 16px;\n}\n.k-wrapper #volumes .chapter-bar .download-btn::after {\n  content: \"下载\";\n}\n.k-wrapper #volumes .chapter-bar .download-btn:disabled {\n  opacity: 0.5;\n}\n.k-wrapper #volumes .chapter-bar .download-btn:disabled::after {\n  content: \"下载中...\";\n}\n.k-wrapper #volumes .chapter-bar .progress,\n.k-wrapper #volumes .chapter-bar .progress > div {\n  position: absolute;\n  pointer-events: none;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n}\n.k-wrapper #volumes .chapter-bar .progress > div {\n  background-color: rgba(255, 57, 84, 0.1);\n  transition: all 0.2s linear;\n}";
  n(css,{});

  document.body.classList.add("k-wrapper");
  router({ domain: ["//www.linovelib.com"], routes: [{ run: main }] });
  router({
    domain: ["//w.linovelib.com", "//www.bilinovel.com"],
    routes: [
      { run: main$1 },
      {
        pathname: /(\/novel\/.*\/catalog)|(\/download\/.*\.html)/,
        run: fixADBlock
      }
    ]
  });

})();