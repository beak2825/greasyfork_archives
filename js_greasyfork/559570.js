// ==UserScript==
// @name         视频网页全屏
// @namespace    npm/vite-plugin-monkey
// @version      3.8.7
// @author       Feny
// @description  快捷键：P-网页全屏，Enter-全屏；支持侧边点击切换网页全屏；支持自动网页全屏
// @license      GPL-3.0-only
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAAAXNSR0IArs4c6QAABNNJREFUeF7tm09oHFUcx79vNtkElgQDwYMgaUJulVhIwXoIFAvtQRAPXnopQXZfchD00ksPKoh4KUQJksx7C4UUihREcvFQhB70UMmuYhXBGMRDmrAJ+Wf+2MSwP/kNb5fNZrPzkt3ZzCT7IIfszve93+/z+/NmZmcEzvkQ59x/HAIgpXwI4AoRrRHR9XQ6nWNIUsonAF6zAHZfKXWLj0smk72O4/xloQER3dZa3zW6m47jPLDRAbihlHrEx46MjHxORO9b6DYB/EJE6gAAKSWViR8ppW7wZ8PDwy/E4/E/ALzot4AQ4q7rureNUdeI6Ds/DX9PRLe01vcN8DsAPrXQ5WKx2PWJiYmnRjcN4C0LnXdIEYCU8ihhMaKpVOqSEOJnm8lLIyqlTALQNrrSiEopWcPaqoOInra3tw+Nj4//YyD8CuAVP105gGcAXqokKo2olPJtAN/YTF4WUY4mR9Vv5IQQQ67r/mmc4ey55icCUMzW0dHRC/l8/jcACT9daQaUp/8BbVlEPwAw5je5+X5IKfWDKYcHRHTTT8cRFUJcVkr9Z0rvJwC9fjoApf3nquM4j/001gBMjb6jtf7aOGPbcHL5fP5yOp2eNxG1babFiB6n9EqzNZVKDQsh7lWDcCwAPJFxJmucsWo4HFGt9ausMen5o00zLY3ocUoPwHtKqS+NjR8D+OgoCMcGACD3/Pnzi1NTUysmPb+3bDjFiCaTSav0NEZ/opT60DhjXXpCiDdd1/3WZOs9Ihqu2N8KH1bYAo/MnNKImvTkGvdtOACUUmqEJ7ZJz4IBQoh3Xdf1UllKyb2HQfgOIcRF13V/N+s9FkJcLRedJAO8OYhoWmvNOwIbdZyd4Y7W+jOb9Cwz9g2llNfUpJS8C3lr+4xcIpHoHRsb+9eUHusvlGpODMBA+EJr7UVDSmmdnrwTaK2/8kvPcuccx+mdnJz825QeO3PJj4AQ4onruq/zcZVKr3kt4EfwrH9fzICZmZlDDeKsO8/+FQFkMpmqZ4JnFUYTQCGyzQxolkCzBzSb4Fnt9NX8au4CjdoFOjo6EI/HEYvFsLW1hZ2dnVAkXOAZ0NLSgv7+fiQSB6+Wt7e3kcvlsLa2dqogAgfQ19eHrq6uI51kAAyCgZzGCBzAwMAAWltbfX1jCEtLS9jb2/M9tp4HBA5gcHDQ2l52niEwjEaNUAEoON3I/hBKAAUQjegPoQZQABFkf4gEAAYRVH+IDICg+kPkABRALC4uYmFhoebNIrIA2PN6QIg0gM3NTczOztaUBZEGwJ5ns97vtCcekQawsbGBubm5EzvPwkgDOLc9YH9/H/Pz81hZWakp+pHMgOXlZe9iaXd3t2bnIwVgfX3du1Lkzl/PEfoewLfOOOKrq6v19Ls4V2gBcJ2z4/xHFNwd+1ACqHedV0udUAEIqs5PFYDNPcGg6/xUAVS7K9yoOj9VALx4T08Puru7i3bk83nvJKae+/lJt4jAe0DBsM7OTrS1tXn/8r0+jn4YRsMAhMHZSjY0ARSoNB+RaT4i03xEJrgT7rB2wEbcEQqx755pxV0gm80+I6KKL02F3Yla7Ct9VnhaCGH9vl0ti4ZJe+Bx+fO4FR56XyCTyTwkoitCiJfDFKk621L51dk6LxKJ6c79GyP/A7T+4JsF5qmXAAAAAElFTkSuQmCC
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_unregisterMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/559570/%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/559570/%E8%A7%86%E9%A2%91%E7%BD%91%E9%A1%B5%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(o=>{const e=Symbol("styleAdded"),t=document.createElement("style");t.textContent=o,window.gmStyle=t,document.addEventListener("addStyle",r=>{const{shadowRoot:n}=r.detail;n[e]||n instanceof Document||(n.prepend(t.cloneNode(!0)),n[e]=!0)}),(GM_addStyle??(()=>document.head.append(t.cloneNode(!0))))(o)})(' @charset "UTF-8";[gm_webfullscreen],body[gm_webfullscreen] [gm_webfullscreen]{top:0!important;left:0!important;margin:0!important;padding:0!important;zoom:normal!important;border:none!important;width:100vw!important;height:100vh!important;position:fixed!important;transform:none!important;max-width:none!important;max-height:none!important;border-radius:0!important;transition:none!important;z-index:2147483646!important;background-color:#000!important;flex-direction:column!important;overflow:hidden!important;display:flex!important}[gm_webfullscreen]~*:not(.monkey-web-fullscreen){display:none!important}[gm_webfullscreen] video,body[gm_webfullscreen] [gm_webfullscreen] video{top:0!important;left:0!important;width:100vw!important;border:none!important;transform:none!important;object-fit:contain!important;height:clamp(100vh - 100%,100vh,100%)!important}.video-edge-click{cursor:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAWCAYAAADEtGw7AAAAAXNSR0IArs4c6QAAAaBJREFUSEutlL8vBEEcxT9fpxSdVtQkGqqrHP8CoqDXSZTC7VpcRa3SCBJEclcgEQmNShDFKVRXKSj8atmv7Gbvsrd2Zydhus2+75v33rwZwXKpx0UAlTIlmxGxAQUY9dCI2GrGCvRn4tCu8CJLTCadmBTrCgcoPfGY2hRHgAmEwyR5FnHWzK8osoDq0hdm7NJoujEJSc24NdDJgCzwkHbAWqGfL+pp7kIBWa1QjyEpc2NqjQlj3QrbWjZxucQty3CHsMU3u+LylreRRDdqJAa8xmdaXB7D/rp00cFngmgPZUccTrM2SCNu4FNKnP42ykwKSdCQbaAqZe7i/3OjCFWvUsTnKsf+GUKVb2ri8mRFHJIvc48wmJct8AHMZdetQn+8w+oxC2xaEAeQdfMFgeFml7VCD188G4hfgRpKVRxq1lc6euECxYHy+LpEOKHAcdyh9SMU5TyGcN5GqyyKw1rSSTux4dlsPTzLXCEUo+93fEbF5dZIbHMw6jEPbIRY5UgcxtPmrOvWUuzQS4E60IUyJQ77/0IcZe0C3eKE6lPXDznkqgSwYj+tAAAAAElFTkSuQmCC),pointer!important;left:0!important;top:6%!important;width:25px!important;height:70%!important;position:absolute!important;z-index:2147483647!important;background-color:transparent!important;user-select:none!important;opacity:0!important}.video-edge-click.right{right:0!important;left:auto!important} ');

(function () {
  'use strict';

  const isElement = (node) => node instanceof Element;
  const isDocument = (node) => node instanceof Document;
  const getSRoot = (node) => node?._shadowRoot ?? node?.shadowRoot ?? null;
  function* getShadowRoots(node, deep = false) {
    if (!node || !isElement(node) && !isDocument(node)) return;
    if (isElement(node) && getSRoot(node)) yield getSRoot(node);
    const doc = isDocument(node) ? node : node.getRootNode({ composed: true });
    if (!doc.createTreeWalker) return;
    let currentNode;
    const toWalk = [node];
    while (currentNode = toWalk.pop()) {
      const walker = doc.createTreeWalker(currentNode, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_DOCUMENT_FRAGMENT, {
        acceptNode: (child) => isElement(child) && getSRoot(child) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP
      });
      let walkerNode = walker.nextNode();
      while (walkerNode) {
        const shadowRoot = getSRoot(walkerNode);
        if (isElement(walkerNode) && shadowRoot) {
          if (deep) toWalk.push(shadowRoot);
          yield shadowRoot;
        }
        walkerNode = walker.nextNode();
      }
    }
    return;
  }
  function querySelector(selector, subject = document) {
    const immediate = subject.querySelector(selector);
    if (immediate) return immediate;
    const shadowRoots = [...getShadowRoots(subject, true)];
    for (const root of shadowRoots) {
      const match = root.querySelector(selector);
      if (match) return match;
    }
    return null;
  }
  function querySelectorAll(selector, subject = document) {
    const results = [...subject.querySelectorAll(selector)];
    const shadowRoots = [...getShadowRoots(subject, true)];
    for (const root of shadowRoots) {
      results.push(...root.querySelectorAll(selector));
    }
    return results;
  }
  const Consts = Object.freeze({
    P: "P",
    EMPTY: "",
    HALF_SEC: 500,
    ONE_SEC: 1e3,
    webFull: "gm_webfullscreen",
    MSG_SOURCE: "SCRIPTS_VIDEO_FULLSCREEN"
  });
  const Tools = {
    isTopWin: () => window.top === window,
    scrollTop: (top) => window.scrollTo({ top }),
    getElementRect: (el) => el?.getBoundingClientRect(),
    microTask: (callback) => Promise.resolve().then(callback),
    query: (selector, context) => querySelector(selector, context),
    querys: (selector, context) => querySelectorAll(selector, context),
    sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
    postMessage: (win, data) => win?.postMessage({ source: Consts.MSG_SOURCE, ...data }, "*"),
    getIFrames: () => querySelectorAll("iframe:not([src=''], [src='#'], [id='buffer'], [id='install'])"),
    isVisible: (el) => !!(el && getComputedStyle(el).visibility !== "hidden" && (el.offsetWidth || el.offsetHeight)),
    preventDefault: (event) => event.preventDefault() & event.stopPropagation() & event.stopImmediatePropagation(),
    attr: (el, name, val) => el && name && el[val ? "setAttribute" : "removeAttribute"](name, val),
    emitEvent: (type, detail = {}) => document.dispatchEvent(new CustomEvent(type, { detail })),
    isInputable: (el) => ["INPUT", "TEXTAREA"].includes(el?.tagName) || el?.isContentEditable,
    sendToIFrames(data) {
      this.getIFrames().forEach((iframe) => this.postMessage(iframe?.contentWindow, data));
    },
    freqTimes: /* @__PURE__ */ new Map(),
    isThrottle(key = "throttle", gap = 300) {
      const now = Date.now();
      const last = this.freqTimes.get(key) ?? 0;
      const diff = now - last;
      return diff >= gap ? this.freqTimes.set(key, now) && false : true;
    },
    limitCountMap: /* @__PURE__ */ new Map(),
    isOverLimit(key = "default", maxCount = 5) {
      const count = this.limitCountMap.get(key) ?? 0;
      if (count < maxCount) return this.limitCountMap.set(key, count + 1) && false;
      return true;
    },
    resetLimit(...keys) {
      const keyList = keys.length > 0 ? keys : ["default"];
      keyList.forEach((key) => this.limitCountMap.set(key, 0));
    },
    pointInElement(pointX, pointY, element) {
      if (!element) return false;
      const { top, left, right, bottom } = this.getElementRect(element);
      return pointX >= left && pointX <= right && pointY >= top && pointY <= bottom;
    },
    getParent(element) {
      if (!element) return null;
      const parent = element.parentNode;
      if (parent instanceof ShadowRoot) return parent.host;
      return parent === document ? null : parent;
    },
    getParents(element, withSelf = false, maxLevel = Infinity) {
      const parents = withSelf && element ? [element] : [];
      for (let current = element, level = 0; current && level < maxLevel; level++) {
        current = this.getParent(current);
        current && parents.unshift(current);
      }
      return parents;
    },
    cloneAttrs(source, target, ...attrs) {
      attrs.flat().forEach((attr) => {
        const value = source.getAttribute(attr);
        if (value) target.setAttribute(attr, value);
      });
    },
    setStyle(eles, prop, val, priority) {
      if (!eles || !prop) return;
      const fn = val ? "setProperty" : "removeProperty";
      [].concat(eles).forEach((el) => el?.style?.[fn]?.(prop, val, priority));
    },
    isAttached(el) {
      if (!el) return false;
      const root = el.getRootNode?.();
      return el.isConnected && (!root || !(root instanceof ShadowRoot) || root.host.isConnected);
    }
  };
  class VideoEnhancer {
    static hackAttachShadow() {
      if (Element.prototype.__attachShadow) return;
      Element.prototype.__attachShadow = Element.prototype.attachShadow;
      Element.prototype.attachShadow = function(options) {
        if (this._shadowRoot) return this._shadowRoot;
        const shadowRoot = this._shadowRoot = this.__attachShadow.call(this, options);
        VideoEnhancer.detectShadowVideoElement();
        return shadowRoot;
      };
      Element.prototype.attachShadow.toString = () => Element.prototype.__attachShadow.toString();
    }
    static detectShadowVideoElement() {
      if (Tools.isThrottle("shadow", 100)) return;
      const videos = Tools.querys("video:not([received])");
      if (!videos.length) return;
      videos.forEach((video) => {
        const root = video.getRootNode();
        if (!(root instanceof ShadowRoot)) return;
        Tools.emitEvent("shadow-video", { video });
        Tools.emitEvent("addStyle", { shadowRoot: root });
      });
    }
  }
  VideoEnhancer.hackAttachShadow();
  const Listen = {
    noVideo: () => !window.videoInfo && !window.topWin,
    isBackgroundVideo: (video) => video?.muted && video?.loop,
    init(isNonFirst = false) {
      this.docElement = document.documentElement;
      this.setupKeydownListener();
      this.setupMouseMoveListener();
      this.setupFullscreenListener();
      this.setupVideoListeners();
      if (isNonFirst) return;
      this.setupDocumentObserver();
      this.observeFullscreenChange();
      this.setupIgnoreUrlsChangeListener();
      this.setupShadowVideoListeners();
    },
    setupDocumentObserver() {
      new MutationObserver(() => {
        if (this.docElement === document.documentElement) return;
        this.init(true), document.head.append(gmStyle.cloneNode(true));
      }).observe(document, { childList: true });
    },
    setupFullscreenListener() {
      document.addEventListener("fullscreenchange", () => {
        Tools.postMessage(window.top, { isFullscreen: !!document.fullscreenElement });
      });
    },
    observeFullscreenChange() {
      Object.defineProperty(this, "isFullscreen", {
        get: () => this._isFullscreen ?? false,
        set: (value) => {
          this._isFullscreen = value;
          !value && this.fsWrapper && this.dispatchShortcutKey(Consts.P);
        }
      });
    },
    setupMouseMoveListener() {
      const handle = ({ type, clientX, clientY }) => {
        if (Tools.isThrottle(type)) return;
        const video = this.getVideoForCoord(clientX, clientY);
        video && this.createEdgeClickElement(video);
      };
      document.addEventListener("mousemove", handle, { passive: true });
    },
    getVideoForCoord(clientX, clientY) {
      return Tools.querys("video").find((video) => Tools.pointInElement(clientX, clientY, video));
    },
    createEdgeClickElement(video) {
      const container = this.getEdgeClickContainer(video);
      if (video.lArea?.parentNode === container) return;
      if (container instanceof Element && this.lacksRelativePosition(container)) {
        Tools.setStyle(container, "position", "relative");
      }
      if (video.lArea) return container.prepend(video.lArea, video.rArea);
      const createEdge = (clas = "") => {
        const element = Object.assign(document.createElement("div"), { video, className: `video-edge-click ${clas}` });
        element.onclick = (e) => {
          Tools.preventDefault(e);
          const vid = e.target.video;
          if (this.player !== vid) this.player = vid, this.setVideoInfo(vid);
          Tools.microTask(() => this.dispatchShortcutKey(Consts.P, true));
        };
        return element;
      };
      [video.lArea, video.rArea] = [createEdge(), createEdge("right")];
      container.prepend(video.lArea, video.rArea);
    },
    getEdgeClickContainer(video) {
      if (this.fsWrapper) return video.closest(`[${Consts.webFull}]`) ?? this.fsWrapper;
      const parentNode = video.parentNode;
      const sroot = video.getRootNode() instanceof ShadowRoot;
      return sroot ? parentNode : this.findVideoParentContainer(parentNode, void 0, false);
    },
    lacksRelativePosition(element) {
      return Tools.getParents(element, true, 2).every((el) => el && getComputedStyle(el).position === "static");
    }
  };
  var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  const Keydown = {
    dispatchShortcutKey: (key, isTrusted = false) => Tools.postMessage(window.top, { key: key.toUpperCase(), isTrusted }),
    setupKeydownListener() {
      _unsafeWindow.addEventListener("message", ({ data }) => this.handleMessage(data));
      _unsafeWindow.addEventListener("keydown", (event) => this.handleKeydown(event), true);
      _unsafeWindow.addEventListener("scroll", () => this.fsWrapper && Tools.scrollTop(this.fsWrapper.scrollY));
    },
    handleKeydown(event) {
      const { key, isTrusted } = event;
      const target = event.composedPath()[0];
      if (this.noVideo() || Tools.isInputable(target) || !["p", "Enter"].includes(key)) return;
      Tools.preventDefault(event);
      this.dispatchShortcutKey(key, isTrusted);
    },
    handleMessage(data) {
      if (!data?.source?.includes(Consts.MSG_SOURCE)) return;
      if (data?.videoInfo) return this.syncVideoToParentWin(data.videoInfo);
      if ("isFullscreen" in data) this.isFullscreen = data.isFullscreen;
      if (data?.topWin) window.topWin = this.topWin = data.topWin;
      this.processEvent(data);
    },
    processEvent(data) {
      if (!this.player) Tools.sendToIFrames(data);
      if (data?.key) this.execHotKeyActions(data);
    },
    execHotKeyActions: ({ key, isTrusted }) => key === Consts.P ? App.toggleWebFullscreen(isTrusted) : App.toggleFullscreen()
  };
  const Events = {
    videoEvents: ["loadedmetadata", "timeupdate", "playing"],
    setupVideoListeners(video) {
      const handleEvent = (event) => this[event.type](video ?? event.target);
      this.videoEvents.forEach((type) => (video ?? document).addEventListener(type, handleEvent, true));
    },
    setupShadowVideoListeners() {
      document.addEventListener("shadow-video", (e) => {
        const { video } = e.detail;
        if (!video || video.hasAttribute("received")) return;
        this.setupVideoListeners(video), video.setAttribute("received", true);
        Tools.microTask(() => this.createEdgeClickElement(video));
      });
    },
    loadedmetadata(video) {
      this.initVideoProps(video);
      if (!this.player) this.setCurrentVideo(video);
    },
    timeupdate(video) {
      if (isNaN(video.duration)) return;
      this.autoWebFullscreen(video);
    },
    playing(video) {
      this.setCurrentVideo(video);
    },
    initVideoProps(video) {
      delete video.__isWide;
      Tools.resetLimit("autoWide");
      if (!Tools.isAttached(this.player)) delete this.player;
    },
    setCurrentVideo(video) {
      if (!video || this.player === video || video.offsetWidth < 240 || this.isBackgroundVideo(video)) return;
      if (this.player && !this.player.paused && !isNaN(this.player.duration)) return;
      this.player = video;
      this.setVideoInfo(video);
    },
    setVideoInfo(video) {
      const videoInfo = { isLive: video.duration === Infinity };
      this.syncVideoToParentWin(videoInfo);
    },
    syncVideoToParentWin(videoInfo) {
      window.videoInfo = this.videoInfo = videoInfo;
      if (!Tools.isTopWin()) return Tools.postMessage(window.parent, { videoInfo: { ...videoInfo, iFrame: location.href } });
      Tools.microTask(() => this.setupScriptMenuCommand());
      this.sendTopWinInfo();
    },
    sendTopWinInfo() {
      const { host, href: url } = location;
      const { innerWidth: viewWidth, innerHeight: viewHeight } = window;
      const topWin = { url, host, viewWidth, viewHeight };
      window.topWin = this.topWin = topWin;
      Tools.sendToIFrames({ topWin });
    }
  };
  class BasicStorage {
    constructor(name, defVal, parser = (v) => v) {
      Object.assign(this, { name, defVal, parser });
      this.storage = { getItem: _GM_getValue, setItem: _GM_setValue };
    }
    #getFinalKey(suffix) {
      if (!suffix) throw new Error(`${this.name} 后缀不能为空！`);
      return this.name + suffix;
    }
    set(value, key) {
      this.storage.setItem(this.#getFinalKey(key), value);
    }
    get(key) {
      const value = this.storage.getItem(this.#getFinalKey(key));
      return this.parser(value ?? this.defVal);
    }
  }
  const Storage = {
    IS_AUTO: new BasicStorage("IS_AUTO_", false, Boolean),
    DETACH_THRESHOLD: new BasicStorage("DETACH_THRESHOLD_", 20, Number),
    CUSTOM_CONTAINER: new BasicStorage("CUSTOM_CONTAINER_", ""),
    IGNORE_URLS: new BasicStorage("IGNORE_URLS_", "")
  };
  const WebFull = {
    toggleFullscreen() {
      if (!Tools.isTopWin() || Tools.isThrottle("toggleFull")) return;
      this.isFullscreen ? document.exitFullscreen() : this.getVideoHostContainer()?.requestFullscreen();
      if (this.isFullscreen || !this.fsWrapper) this.dispatchShortcutKey(Consts.P);
    },
    toggleWebFullscreen(isTrusted) {
      if (this.noVideo() || Tools.isThrottle("toggleWeb")) return;
      if (this.isFullscreen && isTrusted) return document.fullscreenElement && document.exitFullscreen();
      this.fsWrapper ? this.exitWebFullscreen() : this.enterWebFullscreen();
    },
    enterWebFullscreen() {
      const container = this.fsWrapper = this.getVideoHostContainer();
      if (!container || container.matches(":is(html, body)")) return this.ensureWebFullscreen();
      container.scrollY = window.scrollY;
      const parents = Tools.getParents(container, true);
      container instanceof HTMLIFrameElement || parents.length < Storage.DETACH_THRESHOLD.get(location.host) ? parents.forEach((el) => {
        Tools.emitEvent("addStyle", { shadowRoot: el.getRootNode() });
        Tools.attr(el, Consts.webFull, true);
      }) : this.detachForFullscreen();
      this.ensureWebFullscreen();
    },
    detachForFullscreen() {
      if (this.fsParent) return;
      this.fsParent = Tools.getParent(this.fsWrapper);
      this.fsPlaceholder = document.createElement("div");
      Tools.cloneAttrs(this.fsWrapper, this.fsPlaceholder, ["id", "class", "style"]);
      this.fsParent.replaceChild(this.fsPlaceholder, this.fsWrapper);
      document.body.insertAdjacentElement("beforeend", this.fsWrapper);
      this.fsWrapper.querySelector("video")?.play();
      Tools.attr(this.fsWrapper, Consts.webFull, true);
    },
    exitWebFullscreen() {
      if (!this.fsWrapper) return;
      const { scrollY } = this.fsWrapper;
      Tools.setStyle(this.docElement, "scroll-behavior", "auto", "important");
      if (this.fsParent?.contains(this.fsPlaceholder)) this.fsParent?.replaceChild(this.fsWrapper, this.fsPlaceholder);
      Tools.querys(`[${Consts.webFull}]`).forEach((el) => Tools.attr(el, Consts.webFull));
      requestAnimationFrame(() => (Tools.scrollTop(scrollY), Tools.setStyle(this.docElement, "scroll-behavior")));
      this.videoParents.clear();
      this.fsPlaceholder = this.fsWrapper = this.fsParent = null;
    },
    getVideoHostContainer() {
      if (this.player) return this.getVideoContainer();
      return this.getVideoIFrame() ?? Tools.getIFrames().find(Tools.isVisible);
    },
    getVideoIFrame() {
      if (!this.videoInfo?.iFrame) return null;
      const { pathname, search } = new URL(this.videoInfo.iFrame);
      const partial = ((s) => s.slice(0, s.length * 0.8))(decodeURIComponent(search));
      return Tools.query(`iframe[src*="${pathname + partial}"]`);
    },
    getVideoContainer() {
      const selector = Storage.CUSTOM_CONTAINER.get(this.topWin?.host)?.trim();
      const container = selector ? this.player.closest(selector) ?? Tools.query(selector) : null;
      return container ?? this.findVideoParentContainer(this.findControlBarContainer());
    },
    findControlBarContainer() {
      const ignore = ":not(.Drag-Control, .vjs-controls-disabled, .vjs-control-text, .xgplayer-prompt)";
      const selector = `[class*="contr" i]${ignore}, [id*="control"], [class*="ctrl"], [class*="progress"], [class*="volume"]`;
      let parent = Tools.getParent(this.player);
      while (parent && parent.offsetHeight <= this.player.offsetHeight) {
        if (Tools.query(selector, parent)) return parent;
        parent = Tools.getParent(parent);
      }
      return null;
    },
    videoParents: /* @__PURE__ */ new Set(),
    findVideoParentContainer(container, maxLevel = 4, track = true) {
      container = container ?? Tools.getParent(this.player);
      if (!container.offsetHeight) container = Tools.getParent(container);
      const { offsetWidth: cw, offsetHeight: ch } = container;
      if (track) this.videoParents.clear();
      for (let parent = container, level = 0; parent && level < maxLevel; parent = Tools.getParent(parent), level++) {
        if (parent.offsetWidth === cw && parent.offsetHeight === ch) container = parent;
        if (this.hasExplicitlySize(parent)) return container;
        if (track) this.videoParents.add(parent);
      }
      return container;
    },
    hasExplicitlySize(element) {
      const style = element.style;
      const sizeRegex = /^\d+(\.\d+)?(px|em|rem)$/;
      return ["width", "height"].some((prop) => {
        const value = style?.getPropertyValue(prop);
        return value && sizeRegex.test(value);
      });
    },
    ensureWebFullscreen() {
      const { viewWidth, viewHeight } = this.topWin;
      const elements = [...this.videoParents].reverse();
      for (const element of elements) {
        if (!this.fsWrapper.contains(element)) continue;
        const { offsetWidth: width, offsetHeight: height } = this.player;
        if (width === viewWidth && height === viewHeight && element.offsetHeight === viewHeight) continue;
        Tools.attr(element, Consts.webFull, true);
      }
    }
  };
  const Automatic = {
    async autoWebFullscreen(video) {
      if (!this.topWin || !video.offsetWidth || this.player !== video) return;
      if (video.__isWide || Tools.isThrottle("autoWide", Consts.ONE_SEC) || !this.isAuto()) return;
      if (this.isIgnoreUrl() || await this.isWebFull(video) || Tools.isOverLimit("autoWide")) return video.__isWide = true;
      this.dispatchShortcutKey(Consts.P);
    },
    async isWebFull(video) {
      const { viewWidth } = this.topWin;
      if (video.offsetWidth < viewWidth) return false;
      await Tools.sleep(Consts.HALF_SEC);
      return video.offsetWidth >= viewWidth;
    }
  };
  const Ignore = {
    initIgnoreUrls: () => App.urlFilter = App.getIgnoreUrls(),
    setupIgnoreUrlsChangeListener() {
      _GM_addValueChangeListener(Storage.IGNORE_URLS.name, (_, oldVal, newVal) => oldVal !== newVal && this.initIgnoreUrls());
    },
    isIgnoreUrl() {
      if (!this.urlFilter) this.initIgnoreUrls();
      return this.isBlocked(this.urlFilter);
    },
    getIgnoreUrls() {
      const urlsStr = Storage.IGNORE_URLS.get(this.topWin.host);
      return urlsStr.split(/[;\n]/).filter((url) => url.trim());
    },
    isBlocked(urls = []) {
      const { href, pathname } = new URL(this.topWin.url);
      return pathname === "/" || urls.some((u) => href.startsWith(u));
    }
  };
  const Menu = {
    isAuto: () => Storage.IS_AUTO.get(Tools.isTopWin() ? location.host : window.topWin?.host),
    setupScriptMenuCommand() {
      if (this.hasMenu || !Tools.isTopWin()) return;
      const key = Storage.IS_AUTO.name + location.host;
      _GM_addValueChangeListener(key, () => this.registMenuCommand());
      this.registMenuCommand();
      this.hasMenu = true;
    },
    registMenuCommand() {
      const host = location.host;
      const isAuto = `此站${this.isAuto() ? "禁" : "启"}用自动网页全屏`;
      const configs = [
        { title: isAuto, cache: Storage.IS_AUTO, fn: (cache, val) => cache.set(!val, host) },
        { title: "此站脱离式全屏阈值", cache: Storage.DETACH_THRESHOLD },
        { title: "自动时忽略的网址", cache: Storage.IGNORE_URLS },
        { title: "自定义视频容器", cache: Storage.CUSTOM_CONTAINER }
      ];
      configs.forEach(({ title, cache, fn }) => {
        const id = `${cache.name}_MENU_ID`;
        _GM_unregisterMenuCommand(this[id]);
        this[id] = _GM_registerMenuCommand(title, () => {
          const value = cache.get(host);
          if (fn) return fn.call(this, cache, value);
          const input = prompt(title, value);
          if (input !== null) cache.set(input, host);
        });
      });
    }
  };
  window.App = {};
  const handlers = [Listen, Keydown, Events, WebFull, Automatic, Ignore, Menu];
  handlers.forEach((handler) => {
    const entries = Object.entries(handler);
    for (const [key, value] of entries) {
      App[key] = value instanceof Function ? value.bind(App) : value;
    }
  });
  App.init();

})();