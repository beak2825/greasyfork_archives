// ==UserScript==
// @name         一些 TronClass 功能
// @namespace    https://github.com/a3510377/ulearn-script
// @version      v0.0.2
// @description  移除頁腳、修復部份樣式、繞過下載限制、繞過快轉限制、繞過複製限制、繞過畫面切換檢測、繞過全螢幕檢測等等，開發時使用 NFU ULearn，其它學校可能不適用
// @license      MIT
// @author       MonkeyCat
// @match        https://ulearn.nfu.edu.tw/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/553084/%E4%B8%80%E4%BA%9B%20TronClass%20%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/553084/%E4%B8%80%E4%BA%9B%20TronClass%20%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

var ULearn = (function(exports) {
  "use strict";
  class FeatureManager {
    features = /* @__PURE__ */ new Map();
    register(name, enableFn, disableFn) {
      if (!this.features.has(name)) {
        this.features.set(name, { enabled: false });
      }
      const feature = this.features.get(name);
      return {
        enable: () => {
          if (feature.enabled) return;
          const cleanup = enableFn() ?? void 0;
          feature.cleanup = cleanup;
          feature.enabled = true;
          console.log(`[Feature] "${name}" 已啟用`);
        },
        disable: () => {
          if (!feature.enabled) return;
          if (disableFn) {
            disableFn();
          } else {
            feature.cleanup?.();
          }
          feature.enabled = false;
          feature.cleanup = void 0;
          console.log(`[Feature] "${name}" 已停用`);
        },
        isEnabled: () => feature.enabled
      };
    }
    isEnabled(name) {
      return this.features.get(name)?.enabled ?? false;
    }
    cleanupAll() {
      this.features.forEach((feature, name) => {
        if (feature.cleanup) {
          feature.cleanup();
          console.log(`[Feature] "${name}" 已清理`);
        }
      });
      this.features.clear();
    }
  }
  const featureManager = new FeatureManager();
  const SVG_MENU = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z"/></svg>`;
  const SVG_CLOSE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z"/></svg>`;
  const SVG_INFO = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="M440-280h80v-240h-80v240Zm40-320q17 0 28.5-11.5T520-640q0-17-11.5-28.5T480-680q-17 0-28.5 11.5T440-640q0 17 11.5 28.5T480-600Zm0 520q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z"/></svg>`;
  const SVG_SUCCESS = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="M382-240 154-468l57-57 171 171 367-367 57 57-424 424Z"/></svg>`;
  const SVG_WARN = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960" fill="#e3e3e3"><path d="m40-120 440-760 440 760H40Zm138-80h604L480-720 178-200Zm302-40q17 0 28.5-11.5T520-280q0-17-11.5-28.5T480-320q-17 0-28.5 11.5T440-280q0 17 11.5 28.5T480-240Zm-40-120h80v-200h-80v200Zm40-100Z"/></svg>`;
  const MK_CUSTOM_COMPONENT = "mk-component";
  const MK_HIDDEN_SCROLL_CLASS = "mk-hide-scroll";
  const parseClass = (...classNames) => {
    return classNames.flatMap(
      (className) => Array.isArray(className) ? className : className?.trim().split(/\s+/).filter(Boolean) || []
    );
  };
  const createElement = (tagName, ...className) => {
    const element = document.createElement(tagName);
    element.classList.add(MK_CUSTOM_COMPONENT, ...parseClass(...className));
    return element;
  };
  const waitForElement = (selector, timeoutMs = 1e4) => {
    return new Promise((resolve, reject) => {
      const query = () => document.querySelector(selector);
      const el = query();
      if (el) {
        resolve(el);
        return;
      }
      let observer = null;
      const timeoutId = setTimeout(() => {
        if (observer) observer.disconnect();
        reject(
          new Error(
            `waitForElement: '${selector}' not found within ${timeoutMs}ms`
          )
        );
      }, timeoutMs);
      observer = new MutationObserver(() => {
        const el2 = query();
        if (el2) {
          clearTimeout(timeoutId);
          observer?.disconnect();
          resolve(el2);
        }
      });
      const startObservingDOM = () => {
        observer.observe(document.body, { childList: true, subtree: true });
      };
      if (!document.body) {
        window.addEventListener("DOMContentLoaded", startObservingDOM, {
          once: true
        });
      } else startObservingDOM();
    });
  };
  const createStyle = (code, node = document.head) => {
    const css = createElement("style", "mk-style");
    css.textContent = code;
    node.appendChild(css);
    return css;
  };
  const createSvgFromString = (svgString, className) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svgString, "image/svg+xml");
    const svgElement = doc.documentElement;
    svgElement.classList.add(
      ...parseClass(className),
      "mk-svg",
      MK_CUSTOM_COMPONENT
    );
    return svgElement;
  };
  const onClickOutside = (target, handler, ignore = []) => {
    if (!target) return () => {
    };
    const shouldIgnore = (event) => ignore.some((item) => {
      if (typeof item === "string") {
        return Array.from(document.querySelectorAll(item)).some(
          (el) => el === event.target || event.composedPath().includes(el)
        );
      } else {
        return item && (item === event.target || event.composedPath().includes(item));
      }
    });
    const listener = (event) => {
      if (event.target && !target.contains(event.target) && !shouldIgnore(event)) {
        handler(event);
      }
    };
    document.addEventListener("click", listener);
    return () => document.removeEventListener("click", listener);
  };
  const addHref = async (querySelector, href, className) => {
    const el = await waitForElement(querySelector).catch(() => null);
    if (el) {
      const hrefEl = createElement("a", "mk-custom-link", className);
      hrefEl.setAttribute("ng-href", href);
      el.parentNode?.insertBefore(hrefEl, el);
      hrefEl.appendChild(el);
    }
  };
  const TOAST_ICONS = {
    warn: SVG_WARN,
    info: SVG_INFO,
    success: SVG_SUCCESS,
    error: SVG_WARN
  };
  class ToastManager {
    viewport;
    activeToasts;
    constructor() {
      this.activeToasts = /* @__PURE__ */ new Set();
      this.viewport = createElement("div", "mk-toast-viewport");
      this.viewport.tabIndex = 0;
      document.body.appendChild(this.viewport);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          const last = Array.from(this.activeToasts).pop();
          if (last) this.close(last, true);
        }
      });
      createStyle(`.mk-toast-viewport{z-index:9999;outline:none;flex-direction:column;gap:8px;display:flex;position:fixed;bottom:16px;right:16px}.mk-toast{color:#fff;opacity:1;-webkit-user-select:none;-moz-user-select:none;user-select:none;touch-action:none;background:#333;border-radius:8px;align-items:center;gap:8px;min-width:200px;max-width:320px;padding:12px 2em 12px 1em;font-size:1.3rem;transition:opacity .25s,transform .25s;display:flex;position:relative;transform:translate(0);box-shadow:0 4px 10px #0003}.mk-toast.hidden{opacity:0;transform:translateX(calc(100%*var(--direction,1)))}.mk-toast-icon{width:2.2rem;height:2.2rem}.mk-toast-close{cursor:pointer;border-radius:50%;width:1.8rem;height:1.8rem;padding:6px;position:absolute;top:5px;right:5px}.mk-toast-close:hover{background:#ffffff26!important}`);
    }
    show(message, {
      duration = 5e3,
      type = "success"
    } = {}) {
      const toastEl = this.createToastElement(message, type);
      this.viewport.appendChild(toastEl);
      this.activeToasts.add(toastEl);
      let timer = null;
      let startTime = Date.now();
      let remaining = duration < 0 ? Infinity : duration;
      const startTimer = () => {
        if (remaining === Infinity) return;
        timer = window.setTimeout(() => this.close(toastEl), remaining);
        startTime = Date.now();
      };
      const pauseTimer = () => {
        if (timer !== null) {
          clearTimeout(timer);
          remaining -= Date.now() - startTime;
        }
      };
      if (remaining > 0 && remaining !== Infinity) {
        startTimer();
      }
      toastEl.addEventListener("mouseenter", pauseTimer);
      toastEl.addEventListener("mouseleave", startTimer);
      let pointerStart = null;
      let deltaX = 0;
      toastEl.addEventListener("pointerdown", (e) => {
        pointerStart = { x: e.clientX, y: e.clientY };
      });
      toastEl.addEventListener("pointermove", (e) => {
        if (!pointerStart) return;
        deltaX = e.clientX - pointerStart.x;
        if (Math.abs(deltaX) > 10) {
          toastEl.style.transform = `translateX(${deltaX}px)`;
        }
      });
      const tryClose = () => {
        if (Math.abs(deltaX) > 80) {
          toastEl.style.setProperty("--direction", deltaX > 0 ? "-1" : "1");
          this.close(toastEl);
        } else toastEl.style.transform = "";
        deltaX = 0;
        pointerStart = null;
      };
      toastEl.addEventListener("pointerup", tryClose);
      toastEl.addEventListener("pointercancel", tryClose);
      toastEl.addEventListener("pointerleave", tryClose);
      return { close: () => this.close(toastEl) };
    }
    close(toast, byEsc = false) {
      if (!this.activeToasts.has(toast)) return;
      toast.replaceWith(toast);
      toast.classList.add("hidden");
      setTimeout(() => {
        this.activeToasts.delete(toast);
        toast.remove();
        if (byEsc) this.viewport.focus();
      }, 250);
    }
    createToastElement(message, type) {
      const toastEl = createElement("div", `mk-toast mk-toast-${type}`);
      const toastTextEl = createElement("div", "mk-toast-text");
      const toastIconEl = createSvgFromString(
        TOAST_ICONS[type] || TOAST_ICONS.info,
        "mk-toast-icon"
      );
      const toastCloseIconEl = createSvgFromString(SVG_CLOSE, "mk-toast-close");
      toastTextEl.textContent = message;
      toastEl.append(toastIconEl, toastTextEl, toastCloseIconEl);
      toastCloseIconEl.addEventListener("click", () => this.close(toastEl));
      return toastEl;
    }
  }
  const toastManager = new ToastManager();
  const useToast = () => toastManager;
  class NotificationManager {
    toast = useToast();
    notify(message, options = {}) {
      if (options.silent) return;
      const { duration = 3e3, type = "info" } = options;
      this.toast.show(message, { duration, type });
    }
    settingChanged(featureName, value, silent = false) {
      if (value) {
        this.notify(`${this.getFeatureLabel(featureName)} 已啟用`, {
          type: "success",
          duration: 2e3,
          silent
        });
      } else {
        this.notify(`${this.getFeatureLabel(featureName)} 已停用`, {
          type: "warn",
          duration: 2e3,
          silent
        });
      }
    }
    error(message, error) {
      this.notify(message, { type: "error", duration: 5e3 });
      if (error) {
        console.error("[Notification] Error details:", error);
      }
    }
    success(message, options) {
      this.notify(message, { ...options, type: "success" });
    }
    warning(message, options) {
      this.notify(message, { ...options, type: "warn" });
    }
    info(message, options) {
      this.notify(message, { ...options, type: "info" });
    }
    getFeatureLabel(featureName) {
      const labels = {
        removeFooter: "移除頁腳",
        blockEvents: "阻擋檢測",
        enableUserSelect: "文字選取",
        fixStyle: "RWD優化",
        allowDownload: "允許下載",
        autoNext: "自動下一個",
        playbackRate: "播放速度",
        autoNextThreshold: "觸發比例",
        autoNextThresholdVariance: "隨機偏移",
        theme: "主題"
      };
      return labels[featureName] || featureName;
    }
  }
  const notificationManager = new NotificationManager();
  class BaseStore {
    _id;
    _state;
    _storeExclude;
    _listeners = {};
    constructor(id, initialState, storeExclude) {
      this._id = id;
      this._state = { ...initialState };
      this._storeExclude = [...storeExclude || []];
    }
    get(key) {
      if (key) return this._state[key];
      return Object.freeze({ ...this._state });
    }
    set(key, value) {
      const oldValue = this._state[key];
      if (oldValue !== value) {
        this._state[key] = value;
        this.notify(key, oldValue);
      }
      this.save();
      return this;
    }
    subscribe(key, fn, initialCall = true) {
      if (!this._listeners[key]) this._listeners[key] = [];
      this._listeners[key].push(fn);
      if (initialCall) {
        fn({ value: this._state[key], oldValue: this._state[key] });
      }
      return () => this.unsubscribe(key, fn);
    }
    unsubscribe(key, fn) {
      this._listeners[key] = this._listeners[key]?.filter((l) => l !== fn);
    }
    setBatch(settings) {
      Object.keys(settings).forEach((key) => {
        this.set(key, settings[key]);
      });
      return this;
    }
    reset(key) {
      const defaultValue = this.getDefault();
      if (key) this.set(key, defaultValue[key]);
      else this.setBatch({ ...defaultValue });
    }
    save() {
      const stateToSave = { ...this._state };
      for (const key of this._storeExclude) {
        delete stateToSave[key];
      }
      GM_setValue(this._id, stateToSave);
    }
    load() {
      const savedState = GM_getValue(this._id, {});
      for (const key of this._storeExclude) {
        delete savedState[key];
      }
      this.setBatch(savedState);
    }
    notify(key, oldValue) {
      this._listeners[key]?.forEach(
        (fn) => fn({ value: this._state[key], oldValue })
      );
    }
  }
  const DEFAULT_SETTINGS$1 = Object.freeze({
    // Feature toggles
    removeFooter: true,
    blockEvents: true,
    enableUserSelect: true,
    fixStyle: true,
    allowDownload: true,
    // Floating ball settings
    fabPeekEnabled: true
  });
  class SettingsStore extends BaseStore {
    constructor(initialSettings) {
      super("setting", { ...DEFAULT_SETTINGS$1, ...initialSettings });
    }
    getDefault() {
      return DEFAULT_SETTINGS$1;
    }
  }
  const settingsStore = new SettingsStore();
  const DEFAULT_SETTINGS = Object.freeze({
    autoNext: true,
    autoNextThreshold: 0.95,
    autoNextThresholdVariance: 0.05,
    customAutoNextThreshold: 0,
    playbackRate: 1.75
  });
  class VideoSettingStore extends BaseStore {
    constructor(initialSettings) {
      super("settings", { ...DEFAULT_SETTINGS, ...initialSettings }, [
        "customAutoNextThreshold"
      ]);
      this.subscribe("autoNextThreshold", () => {
        this.set("customAutoNextThreshold", this.getRandomAutoNextThreshold());
      });
      this.subscribe("autoNextThresholdVariance", () => {
        this.set("customAutoNextThreshold", this.getRandomAutoNextThreshold());
      });
    }
    getRandomAutoNextThreshold() {
      const base = this.get("autoNextThreshold");
      const variance = this.get("autoNextThresholdVariance");
      const offset = (Math.random() * 2 - 1) * variance;
      return Math.max(0, Math.min(1, base + offset));
    }
    getDefault() {
      return DEFAULT_SETTINGS;
    }
  }
  const videoSettingsStore = new VideoSettingStore();
  class SettingsManager {
    version = "1.0.0";
    exportSettings() {
      return {
        version: this.version,
        timestamp: Date.now(),
        settings: settingsStore.get(),
        videoSettings: videoSettingsStore.get()
      };
    }
    downloadSettings() {
      try {
        const data = this.exportSettings();
        const json = JSON.stringify(data, null, 2);
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const hrefEl = createElement("a");
        hrefEl.href = url;
        hrefEl.download = `TronClass-settings-${(/* @__PURE__ */ new Date()).toISOString().split("T")[0]}.json`;
        hrefEl.click();
        URL.revokeObjectURL(url);
        hrefEl.remove();
        notificationManager.success("設定已匯出");
      } catch (error) {
        notificationManager.error("匯出失敗", error);
      }
    }
    importSettings(data, silent = false) {
      try {
        if (!data.version || !data.settings || !data.videoSettings) {
          throw new Error("Invalid settings data");
        }
        settingsStore.setBatch(data.settings);
        videoSettingsStore.setBatch(data.videoSettings);
        if (!silent) {
          notificationManager.success("設定已匯入");
        }
      } catch (error) {
        notificationManager.error("匯入失敗：資料格式不正確", error);
        throw error;
      }
    }
    importFromFile() {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".json";
      input.onchange = async (e) => {
        try {
          const file = e.target.files?.[0];
          if (!file) return;
          const text = await file.text();
          this.importSettings(JSON.parse(text));
        } catch (error) {
          notificationManager.error("匯入失敗：檔案格式不正確", error);
        }
      };
      input.click();
    }
    resetAll() {
      if (!confirm("確定要重置所有設定為預設值嗎？此操作無法復原。")) {
        return;
      }
      settingsStore.reset();
      videoSettingsStore.reset();
      notificationManager.success("所有設定已重置");
    }
  }
  const settingsManager = new SettingsManager();
  const featBulletinListCourseLink = async () => {
    addHref(
      ".bulletin-container .course-name-label",
      "/course/[[bulletin.course_id]]/content",
      "mk-course-link"
    );
  };
  const fixSomeBulletinListStyle = () => {
    createStyle(`.filter-area .bulletin-form{justify-content:space-between}`);
  };
  const featCoursesLink = async () => {
    addHref(
      ".courses .course .item",
      "/course/[[course.id]]/content",
      "mk-course-link"
    );
  };
  const fixCoursesStyle = () => {
    createStyle(`.user-courses .course{padding:0!important}.user-courses .course .mk-course-link{padding:20px;display:block}.user-courses .course .item{align-items:center;display:flex;padding:0!important}.user-courses .course,.user-courses .course a{transition:all .2s ease-out}.user-courses .course .item .course-code-row{width:unset!important}@media (width<=920px){.user-courses .filter-conditions{grid-template-columns:repeat(2,minmax(180px,1fr))}}`);
  };
  const customAddEventHandles = {};
  let _setup = false;
  const setupCustomAddEvent = () => {
    if (_setup) return;
    _setup = true;
    const origAdd = EventTarget.prototype.addEventListener;
    const origRemove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function(type, listener, options) {
      if (customAddEventHandles[type]?.some(
        (fn) => fn.call(this, type, listener, options) === true
      )) {
        return;
      }
      return origAdd.call(this, type, listener, options);
    };
    [origAdd, origRemove].forEach((fn, i) => {
      const name = i === 0 ? "addEventListener" : "removeEventListener";
      Function.prototype.toString = new Proxy(Function.prototype.toString, {
        apply(target, thisArg, args) {
          if (thisArg === fn) {
            return `function ${name}() { [native code] }`;
          }
          return Reflect.apply(target, thisArg, args);
        }
      });
    });
  };
  const addEventHook = (event, fn) => {
    (customAddEventHandles[event] ||= []).push(fn);
  };
  const removeEventHook = (event, fn) => {
    if (!customAddEventHandles[event]) return;
    const index = customAddEventHandles[event].indexOf(fn);
    if (index > -1) customAddEventHandles[event].splice(index, 1);
  };
  const defineBlockedHandler = (target, ev) => {
    const prop = `on${ev}`;
    if (!(prop in target)) return;
    if (Object.getOwnPropertyDescriptor(target, prop)?.configurable === false) {
      return;
    }
    Object.defineProperty(target, prop, {
      configurable: true,
      get: () => void 0,
      set: () => console.log(`[blockEvents] Prevented assignment to ${prop}`)
    });
  };
  const blockEvents = (events, target = window, strategy = "propagation") => {
    const handler = (e) => {
      if (strategy === "propagation") e.stopPropagation();
      if (strategy === "immediate") e.stopImmediatePropagation();
      if (strategy === "prevent") e.preventDefault();
    };
    events.forEach((ev) => {
      defineBlockedHandler(target, ev);
      target.addEventListener(ev, handler, true);
      addEventHook(ev, () => true);
    });
  };
  const blockEventsSetup = () => {
    setupCustomAddEvent();
    const cleanups = [];
    const origHidden = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "hidden"
    );
    const origVisibilityState = Object.getOwnPropertyDescriptor(
      Document.prototype,
      "visibilityState"
    );
    const origHasFocus = Document.prototype.hasFocus;
    Object.defineProperty(Document.prototype, "hidden", { get: () => false });
    Object.defineProperty(Document.prototype, "visibilityState", {
      get: () => "visible"
    });
    Document.prototype.hasFocus = () => true;
    cleanups.push(() => {
      if (origHidden) {
        Object.defineProperty(Document.prototype, "hidden", origHidden);
      }
      if (origVisibilityState) {
        Object.defineProperty(
          Document.prototype,
          "visibilityState",
          origVisibilityState
        );
      }
      Document.prototype.hasFocus = origHasFocus;
    });
    const alwaysTrue = () => true;
    const visibilityEvents = [
      "visibilitychange",
      "webkitvisibilitychange",
      "mozvisibilitychange",
      "msvisibilitychange",
      "fullscreenchange",
      "webkitfullscreenchange",
      "mozfullscreenchange",
      "MSFullscreenChange",
      "focus"
    ];
    visibilityEvents.forEach((ev) => {
      defineBlockedHandler(window, ev);
      window.addEventListener(ev, (e) => e.stopPropagation(), true);
      addEventHook(ev, alwaysTrue);
    });
    cleanups.push(() => {
      visibilityEvents.forEach((ev) => {
        removeEventHook(ev, alwaysTrue);
      });
    });
    blockEvents(
      [
        "contextmenu",
        "copy",
        "cut",
        "paste",
        "drag",
        "dragstart",
        "select",
        "selectstart"
      ],
      document,
      "propagation"
    );
    const focusHandler = (e) => e.stopPropagation();
    ["focus", "focusin", "focusout"].forEach((ev) => {
      window.addEventListener(ev, focusHandler, true);
      document.addEventListener(ev, focusHandler, true);
    });
    cleanups.push(() => {
      ["focus", "focusin", "focusout"].forEach((ev) => {
        window.removeEventListener(ev, focusHandler, true);
        document.removeEventListener(ev, focusHandler, true);
      });
    });
    const blurHook = function() {
      return this instanceof Window || this instanceof Document;
    };
    addEventHook("blur", blurHook);
    defineBlockedHandler(window, "blur");
    cleanups.push(() => {
      removeEventHook("blur", blurHook);
    });
    const unloadHandler = (e) => e.stopImmediatePropagation();
    const unloadEvents = ["beforeunload", "unload", "pagehide", "pageshow"];
    unloadEvents.forEach((ev) => {
      window.addEventListener(ev, unloadHandler, true);
      defineBlockedHandler(window, ev);
    });
    cleanups.push(() => {
      unloadEvents.forEach((ev) => {
        window.removeEventListener(ev, unloadHandler, true);
      });
    });
    const _raf = window.requestAnimationFrame;
    window.requestAnimationFrame = (cb) => {
      return _raf.call(window, (ts) => cb(ts || performance.now()));
    };
    cleanups.push(() => {
      window.requestAnimationFrame = _raf;
    });
    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  };
  const removeFooter = () => {
    const style = createStyle(`.main-content{padding-bottom:0!important}[data-category=tronclass-footer]{display:none!important}`);
    return () => style.remove();
  };
  const fixSomeStyle = () => {
    const cleanups = [];
    const removeMark = (el) => {
      const originalBg = el.style.background;
      el.style.background = "";
      cleanups.push(() => el.style.background = originalBg);
    };
    waitForElement("#Symbol(water-mark)").then(removeMark).catch(() => {
    });
    waitForElement("#symbol-water-mark").then(removeMark).catch(() => {
    });
    waitForElement(".layout-row.default-layout").then((layout) => {
      const customLayout = createElement("div", "custom-layout");
      const customDropMenu = createElement("div", "custom-drop-menu");
      customLayout.append(
        ...document.querySelectorAll(
          ".layout-row.default-layout>li,.layout-row.default-layout>ul"
        )
      );
      customDropMenu.append(createSvgFromString(SVG_MENU));
      layout.appendChild(customLayout);
      layout.appendChild(customDropMenu);
      const bodyClassList = document.body.classList;
      const customLayoutClassList = customLayout.classList;
      const removeOutsideClick = onClickOutside(layout, () => {
        bodyClassList.remove(MK_HIDDEN_SCROLL_CLASS);
        customLayoutClassList.remove("mk-open-menu");
      });
      const resizeHandler = () => {
        if (window.innerWidth >= 920) {
          bodyClassList.remove(MK_HIDDEN_SCROLL_CLASS);
          customLayoutClassList.remove("mk-open-menu");
        }
      };
      window.addEventListener("resize", resizeHandler);
      const clickHandler = () => {
        bodyClassList.toggle(
          MK_HIDDEN_SCROLL_CLASS,
          customLayoutClassList.toggle("mk-open-menu")
        );
      };
      customDropMenu.addEventListener("click", clickHandler);
      const customDropMenuStyles = createStyle(`.mk-component.custom-drop-menu{display:none}.mk-component.custom-layout{width:100%}.layout-row.default-layout{justify-content:space-between;display:flex}.mobile-header .left-header img.logo{margin:unset!important}@media (width<=920px){.header .mk-component.custom-layout:not(.mk-open-menu) ul,.header .mk-component.custom-layout:not(.mk-open-menu) li{display:none!important}.header .profile-item{gap:8px}.header .profile .dropdown-list,.header .profile .dropdown-list .dropdown-item{left:unset!important;right:unset!important}.header .profile .dropdown-list .autocollapse-container ul{left:182px!important;right:unset!important}.header .profile-item .current-user-name{height:auto!important}.mk-component.custom-drop-menu{align-items:center;margin-left:1rem;margin-right:-1rem;display:flex!important}.mk-component.custom-drop-menu>svg{cursor:pointer;border-radius:1rem;width:2.5rem;padding:8px;transition:all .2s ease-in-out}.mk-component.custom-drop-menu>svg:hover{fill:#ffffffb5!important;background:#00000026!important}.mk-component.custom-layout.mk-open-menu{z-index:999;background-color:#313e5c;flex-direction:column;display:flex;position:absolute;top:50px;left:0;right:0}.mk-component.custom-layout.mk-open-menu li{display:inline-block!important}.mk-component.custom-layout.mk-open-menu .header-vertical-split-line.header-item{border:unset;height:0!important;display:block!important}.mk-component.custom-layout.mk-open-menu>ul{height:auto;position:unset}.mk-component.custom-layout.mk-open-menu>ul>li{height:auto;margin-left:2.5rem;line-height:initial!important}}`);
      cleanups.push(() => {
        customDropMenuStyles.remove();
        customLayout.remove();
        customDropMenu.remove();
        removeOutsideClick();
        window.removeEventListener("resize", resizeHandler);
        customDropMenu.removeEventListener("click", clickHandler);
      });
    }).catch(() => {
      console.log("Failed to fix some styles");
    });
    const hideScrollStyle = createStyle(`body.mk-hide-scroll{visibility:visible;padding-right:14px;overflow:hidden}`);
    cleanups.push(() => hideScrollStyle.remove());
    const mainContentDesignStyle = createStyle(`.main-content .with-loading.content-under-nav-1{padding:0 2rem}.user-index{max-width:100rem}.user-index .menu-side{position:sticky;top:20px}@media (width<=1120px){body{min-width:unset!important}.user-index .menu-side{display:none}.user-index .right-side.column.collapse{width:100%!important;margin-left:0!important}}@media (width<=710px){.teaching-class-header{justify-content:space-between;align-items:center;display:flex}}@media (width<=640px){.teaching-class-header{justify-content:space-between;align-items:center;display:flex}.teaching-class-header>div{float:unset!important;position:unset!important}.user-courses .course .item{flex-direction:column;display:flex}.user-courses .course .item .course-cover{width:unset!important}.user-courses .course .item .course-content{margin:20px 20px 0;width:unset!important}.user-courses .filter-conditions{grid-template-columns:minmax(180px,1fr)}.user-courses .course .item .course-cover>img{margin:0 auto;width:80%!important;height:unset!important}}`);
    cleanups.push(() => mainContentDesignStyle.remove());
    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  };
  const enableUserSelectStyle = () => {
    const style = createStyle(`:not(.mk-component){-webkit-user-select:text!important;-moz-user-select:text!important;user-select:text!important}`);
    return () => style.remove();
  };
  const buildRow = (opts) => {
    const row = createElement("div", "mk-settings-row");
    const left = createElement("div");
    const right = createElement("div", "mk-settings-field");
    const label = createElement("div", "mk-settings-label");
    label.textContent = opts.label;
    left.appendChild(label);
    if (opts.desc) {
      const desc = createElement("div", "mk-settings-desc");
      desc.textContent = opts.desc;
      left.appendChild(desc);
    }
    const fieldEl = opts.field();
    right.appendChild(fieldEl);
    if (opts.kv) {
      const kv = createElement("div", "mk-kv");
      const update = () => kv.textContent = opts.kv();
      update();
      fieldEl.addEventListener("input", update);
      fieldEl.addEventListener("change", update);
      right.appendChild(kv);
    }
    if (fieldEl.querySelector("input[type=range]")) {
      row.classList.add("mk-field-split");
    }
    row.append(left, right);
    return row;
  };
  const buildToggle = (key, store) => {
    const input = createElement("input", "mk-checkbox");
    input.type = "checkbox";
    input.checked = store.get(key);
    input.addEventListener("change", () => store.set(key, input.checked));
    store.subscribe(
      key,
      ({ value }) => {
        input.checked = value;
      },
      false
    );
    return input;
  };
  const makeRange = (initial, min, max, step, onChange) => {
    const wrap = createElement("div", "mk-settings-field");
    const input = createElement("input", "mk-input");
    input.type = "range";
    input.min = String(min);
    input.max = String(max);
    input.step = String(step);
    input.value = String(initial);
    const num = createElement("input", "mk-input");
    num.type = "number";
    num.min = String(min);
    num.max = String(max);
    num.step = String(step);
    num.value = String(initial);
    num.style.width = "64px";
    const sync = (v) => {
      const clamped = Math.max(min, Math.min(max, v));
      if (parseFloat(input.value) !== clamped) input.value = String(clamped);
      if (parseFloat(num.value) !== clamped) num.value = String(clamped);
    };
    input.addEventListener("input", () => {
      const v = parseFloat(input.value);
      sync(v);
      onChange(v);
    });
    num.addEventListener("change", () => {
      const v = parseFloat(num.value);
      sync(v);
      onChange(v);
    });
    wrap.append(input, num);
    return wrap;
  };
  const buildFeaturesPane = () => {
    const pane = createElement("div");
    pane.appendChild(
      buildRow({
        label: "移除頁腳",
        desc: "隱藏頁面底部的頁腳區域",
        field: () => buildToggle("removeFooter", settingsStore),
        kv: () => settingsStore.get("removeFooter") ? "開啟" : "關閉"
      })
    );
    pane.appendChild(
      buildRow({
        label: "阻擋頁面切換檢測",
        desc: "繞過全螢幕/視窗切換的檢測",
        field: () => buildToggle("blockEvents", settingsStore),
        kv: () => settingsStore.get("blockEvents") ? "開啟" : "關閉"
      })
    );
    pane.appendChild(
      buildRow({
        label: "啟用文字選取",
        desc: "允許複製與選取頁面文字",
        field: () => buildToggle("enableUserSelect", settingsStore),
        kv: () => settingsStore.get("enableUserSelect") ? "開啟" : "關閉"
      })
    );
    pane.appendChild(
      buildRow({
        label: "RWD/樣式優化",
        desc: "響應式設計與介面優化",
        field: () => buildToggle("fixStyle", settingsStore),
        kv: () => settingsStore.get("fixStyle") ? "開啟" : "關閉"
      })
    );
    pane.appendChild(
      buildRow({
        label: "強制允許下載",
        desc: "繞過影片下載限制",
        field: () => buildToggle("allowDownload", settingsStore),
        kv: () => settingsStore.get("allowDownload") ? "開啟" : "關閉"
      })
    );
    return pane;
  };
  const buildManagePane = () => {
    const pane = createElement("div");
    pane.appendChild(
      buildRow({
        label: "匯出設定",
        desc: "下載設定為檔案",
        field: () => {
          const btn = createElement("button", "mk-btn");
          btn.textContent = "匯出";
          btn.addEventListener("click", () => {
            settingsManager.downloadSettings?.();
          });
          return btn;
        }
      })
    );
    pane.appendChild(
      buildRow({
        label: "匯入設定",
        desc: "從檔案匯入設定",
        field: () => {
          const btn = createElement("button", "mk-btn");
          btn.textContent = "匯入";
          btn.addEventListener("click", () => {
            settingsManager.importFromFile();
          });
          return btn;
        }
      })
    );
    pane.appendChild(
      buildRow({
        label: "重置所有設定",
        desc: "將所有設定恢復到預設值",
        field: () => {
          const btn = createElement("button", "mk-btn");
          btn.textContent = "重置";
          btn.addEventListener("click", () => {
            if (confirm("確定要重置所有設定嗎？")) {
              settingsManager.resetAll();
            }
          });
          return btn;
        }
      })
    );
    return pane;
  };
  const buildVideoPane = () => {
    const pane = createElement("div");
    pane.appendChild(
      buildRow({
        label: "自動下一個",
        desc: "影片結束自動播放下一個",
        field: () => buildToggle("autoNext", videoSettingsStore),
        kv: () => videoSettingsStore.get("autoNext") ? "開啟" : "關閉"
      })
    );
    pane.appendChild(
      buildRow({
        label: "播放速度",
        desc: "倍速播放設定",
        field: () => {
          const selectEl = createElement("select", "mk-select");
          const rates = [1, 1.25, 1.5, 1.75, 2, 2.25, 2.5];
          const current = videoSettingsStore.get("playbackRate");
          rates.forEach((r) => {
            const opt = document.createElement("option");
            opt.value = String(r);
            opt.textContent = `${r}x`;
            if (r === current) opt.selected = true;
            selectEl.appendChild(opt);
          });
          selectEl.addEventListener("change", () => {
            videoSettingsStore.set("playbackRate", parseFloat(selectEl.value));
          });
          videoSettingsStore.subscribe(
            "playbackRate",
            ({ value }) => {
              if (parseFloat(selectEl.value) !== value) {
                selectEl.value = String(value);
              }
            },
            false
          );
          return selectEl;
        },
        kv: () => `${videoSettingsStore.get("playbackRate")}x`
      })
    );
    pane.appendChild(
      buildRow({
        label: "自動下一個觸發比例",
        desc: "達到比例後視為完成 (0.5~0.99)",
        field: () => {
          return makeRange(
            videoSettingsStore.get("autoNextThreshold"),
            0.5,
            0.99,
            0.01,
            (v) => videoSettingsStore.set("autoNextThreshold", v)
          );
        },
        kv: () => String(videoSettingsStore.get("autoNextThreshold").toFixed(2))
      })
    );
    pane.appendChild(
      buildRow({
        label: "觸發比例隨機偏移",
        desc: "每次播放時±偏移，避免固定",
        field: () => {
          return makeRange(
            videoSettingsStore.get("autoNextThresholdVariance"),
            0,
            0.2,
            0.01,
            (v) => videoSettingsStore.set("autoNextThresholdVariance", v)
          );
        },
        kv: () => String(videoSettingsStore.get("autoNextThresholdVariance").toFixed(2))
      })
    );
    return pane;
  };
  const buildPanel = (panel, onClose) => {
    const title = createElement("div", "mk-settings-title");
    title.textContent = "腳本設定";
    panel.appendChild(title);
    const tabs = createElement("div", "mk-settings-tabs");
    const tabButtons = [
      { id: "features", label: "功能開關", icon: "⚙️" },
      { id: "video", label: "影片設定", icon: "🎬" },
      // { id: 'interface', label: '介面設定', icon: '🎨' },
      { id: "manage", label: "管理", icon: "🛠️" }
    ];
    const tabContents = {};
    tabButtons.forEach(({ id, label, icon }, index) => {
      const btn = createElement("button", "mk-settings-tab");
      btn.textContent = `${icon} ${label}`;
      btn.dataset.tab = id;
      if (index === 0) btn.classList.add("active");
      tabs.appendChild(btn);
    });
    panel.appendChild(tabs);
    const content = createElement("div", "mk-settings-content");
    tabContents["features"] = buildFeaturesPane();
    tabContents["video"] = buildVideoPane();
    tabContents["manage"] = buildManagePane();
    Object.entries(tabContents).forEach(([id, pane], index) => {
      pane.classList.add("mk-settings-tab-pane");
      pane.dataset.pane = id;
      if (index === 0) pane.classList.add("active");
      content.appendChild(pane);
    });
    panel.appendChild(content);
    tabs.addEventListener("click", (e) => {
      const btn = e.target.closest(
        ".mk-settings-tab"
      );
      if (!btn) return;
      const targetTab = btn.dataset.tab;
      tabs.querySelectorAll(".mk-settings-tab").forEach((tab) => tab.classList.remove("active"));
      btn.classList.add("active");
      content.querySelectorAll(".mk-settings-tab-pane").forEach((pane) => pane.classList.remove("active"));
      const targetPane = content.querySelector(`[data-pane="${targetTab}"]`);
      if (targetPane) targetPane.classList.add("active");
    });
    const onKeyDown = (ev) => {
      if (ev.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  };
  const setupSettingsMenuStyle = () => {
    const settingsMenuStyle = createStyle(`.mk-settings-menu{z-index:99999;-webkit-user-select:none;-moz-user-select:none;user-select:none;font-family:Arial,sans-serif;position:relative}.mk-hide{display:none!important}.mk-settings-fab{opacity:.4;color:#fff;cursor:pointer;width:10px;height:10rem;transform:translateY(var(--drag-offset,-50%));touch-action:none;will-change:transform,left,top,right,width,height,border-radius,opacity;background-color:#a8d0ff;border-radius:0 8px 8px 0;justify-content:center;align-items:center;transition:all .3s;display:flex;position:fixed;top:50%;left:0;box-shadow:0 0 8px 2px #000}.mk-settings-fab.right{border-radius:8px 0 0 8px}.mk-settings-fab.dragging{opacity:.6;border-radius:50%;height:1.5rem;transition:width .2s,height .2s,background-color .2s,border-radius .2s,opacity .2s,box-shadow .2s,transform .2s;width:1.5rem!important}.mk-settings-fab:before{content:"";background-color:#fff;border-radius:1.5px;width:3px;height:1.2rem;transition:height .3s;display:block;box-shadow:0 -.4rem #fff,0 .4rem #fff}.mk-settings-fab.dragging:before{height:0}.mk-settings-fab:hover,.mk-settings-fab.dragging,.mk-settings-menu-panel:not(.mk-hide)~.mk-settings-fab{opacity:.6;background-color:#6fc3c3;width:1rem;box-shadow:0 0 12px 4px #000}`);
    const settingsPanelStyle = createStyle(`.mk-settings-menu-panel{z-index:99999;opacity:0;pointer-events:none;transform-origin:0;background-color:#9bdad6;border-radius:1rem;width:80%;max-width:40rem;padding:1rem;transition:opacity .2s,transform .2s;position:fixed;top:0;left:0;transform:scale(.95);box-shadow:0 4px 20px #0000004d}.mk-settings-menu-panel:not(.mk-hide){opacity:1;pointer-events:auto;transform:scale(1)}.mk-settings-menu-panel.right{transform-origin:100%}.mk-settings-menu-panel .mk-settings-title{text-align:center;margin-bottom:1rem;font-size:1.7rem;font-weight:700}.mk-settings-menu-panel .mk-settings-tabs{justify-content:space-between;gap:.5rem;margin-bottom:1rem;padding:0 .5rem;display:flex}.mk-settings-menu-panel .mk-settings-tab{color:#333;cursor:pointer;white-space:nowrap;text-overflow:ellipsis;background-color:#f5f5f5;border:none;border-radius:.5rem;flex:1 1 0;padding:.5rem .75rem;transition:background-color .2s,color .2s,box-shadow .2s,transform .2s;overflow:hidden}.mk-settings-menu-panel .mk-settings-tab:hover{background-color:#e8e8e8}.mk-settings-menu-panel .mk-settings-tab.active{color:#fff;background-color:#4a90e2;transform:scale(1.05);box-shadow:inset 0 0 0 1px #00000026}.mk-settings-menu-panel .mk-settings-content{scrollbar-gutter:stable;scrollbar-width:auto;overscroll-behavior-y:contain;scrollbar-width:thin;scrollbar-color:#00000073 #00000014;min-height:20rem;max-height:20rem;padding-right:1rem;overflow-y:auto}.mk-settings-menu-panel .mk-settings-content::-webkit-scrollbar{width:.6rem}.mk-settings-menu-panel .mk-settings-content::-webkit-scrollbar-track{background:#00000014;border-radius:.5rem}.mk-settings-menu-panel .mk-settings-content::-webkit-scrollbar-thumb{background-color:#00000059;background-clip:content-box;border:2px solid #0000;border-radius:.5rem}.mk-settings-menu-panel .mk-settings-content:hover::-webkit-scrollbar-thumb{background-color:#00000080}.mk-settings-menu-panel .mk-settings-content:active::-webkit-scrollbar-thumb,.mk-settings-menu-panel .mk-settings-content::-webkit-scrollbar-thumb:active{background-color:#0009}.mk-settings-menu-panel .mk-settings-tab-pane{display:none}.mk-settings-menu-panel .mk-settings-tab-pane.active{flex-direction:column;gap:1rem;display:flex}.mk-settings-menu-panel .mk-settings-field{align-items:center;gap:.5rem;display:flex}.mk-settings-menu-panel .mk-settings-row{justify-content:space-between;align-items:center;gap:1rem;padding:.25rem 0;display:flex}.mk-settings-menu-panel .mk-settings-row.mk-field-split{align-items:unset;flex-direction:column}.mk-settings-menu-panel .mk-settings-row.mk-field-split .mk-settings-field{justify-content:flex-end}.mk-settings-menu-panel .mk-settings-label{color:#1a1a1a;font-size:1.2rem;font-weight:600}.mk-settings-menu-panel .mk-settings-desc{color:#3a3a3a;opacity:.9;margin-top:.25rem;font-size:.95rem}.mk-settings-menu-panel .mk-input[type=number],.mk-settings-menu-panel .mk-select{color:#111;background-color:#fff;border:1px solid #0000002b;border-radius:.375rem;height:2rem;padding:0 .5rem}.mk-settings-menu-panel .mk-input[type=number]:focus,.mk-settings-menu-panel .mk-select:focus{border-color:#5eb3ff;outline:none;box-shadow:0 0 0 3px #5eb3ff40}.mk-settings-menu-panel .mk-input[type=range]{width:12rem}.mk-settings-menu-panel .mk-checkbox{accent-color:#4a9fff;width:1.2rem;height:1.2rem}.mk-settings-menu-panel .mk-kv{color:#2a2a2a;opacity:.9;text-align:end;min-width:2.5rem;margin-left:.5rem;font-size:1rem}`);
    return () => {
      settingsMenuStyle.remove();
      settingsPanelStyle.remove();
    };
  };
  const DRAG_THRESHOLD = 5;
  const DRAG_DELAY = 150;
  const BOUNDARY_PADDING = 16;
  const initSettingsMenu = () => {
    const existing = document.querySelector(".mk-settings-menu");
    if (existing) return;
    const settingsMenuEl = createElement("div", "mk-settings-menu");
    const menuPanelEl = createElement("div", "mk-settings-menu-panel", "mk-hide");
    const fabButtonEl = createElement("div", "mk-settings-fab");
    const cleanupSettingsMenuStyle = setupSettingsMenuStyle();
    const updateMenuPanelPosition = () => {
      const fabRect = fabButtonEl.getBoundingClientRect();
      const isRight = fabButtonEl.classList.contains("right");
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const gap = 12;
      const wasHidden = menuPanelEl.classList.contains("mk-hide");
      if (wasHidden) {
        menuPanelEl.style.visibility = "hidden";
        menuPanelEl.classList.remove("mk-hide");
      }
      const panelRect = menuPanelEl.getBoundingClientRect();
      const panelWidth = panelRect.width;
      const panelHeight = panelRect.height;
      if (wasHidden) {
        menuPanelEl.classList.add("mk-hide");
        menuPanelEl.style.visibility = "";
      }
      let left;
      let right = null;
      if (isRight) {
        const rightPos = viewportWidth - fabRect.left + gap;
        const leftEdge = viewportWidth - rightPos - panelWidth;
        if (leftEdge < BOUNDARY_PADDING) {
          const spaceOnLeft = fabRect.left - gap - BOUNDARY_PADDING;
          const spaceOnRight = viewportWidth - fabRect.right - gap - BOUNDARY_PADDING;
          if (spaceOnLeft >= panelWidth) {
            right = viewportWidth - fabRect.left + gap;
          } else if (spaceOnRight >= panelWidth) {
            right = viewportWidth - fabRect.right - gap;
          } else {
            if (spaceOnLeft > spaceOnRight) {
              right = BOUNDARY_PADDING;
            } else {
              right = viewportWidth - fabRect.right - gap;
            }
          }
        } else {
          right = rightPos;
        }
        menuPanelEl.style.right = `${right}px`;
        menuPanelEl.style.left = "unset";
      } else {
        left = fabRect.right + gap;
        if (left + panelWidth > viewportWidth - BOUNDARY_PADDING) {
          const spaceOnRight = viewportWidth - fabRect.right - gap - BOUNDARY_PADDING;
          const spaceOnLeft = fabRect.left - gap - BOUNDARY_PADDING;
          if (spaceOnRight >= panelWidth) {
            left = fabRect.right + gap;
          } else if (spaceOnLeft >= panelWidth) {
            left = Math.max(BOUNDARY_PADDING, fabRect.left - panelWidth - gap);
          } else if (spaceOnRight > spaceOnLeft) {
            left = fabRect.right + gap;
          } else {
            left = Math.max(
              BOUNDARY_PADDING,
              viewportWidth - panelWidth - BOUNDARY_PADDING
            );
          }
        }
        menuPanelEl.style.left = `${left}px`;
        menuPanelEl.style.right = "unset";
      }
      let top = fabRect.top + fabRect.height / 2 - panelHeight / 2;
      const minTop = BOUNDARY_PADDING;
      const maxTop = viewportHeight - panelHeight - BOUNDARY_PADDING;
      top = Math.max(minTop, Math.min(maxTop, top));
      const topPercentage = top / viewportHeight * 100;
      menuPanelEl.style.top = `${topPercentage}%`;
      menuPanelEl.classList.toggle("right", isRight);
    };
    let suppressNextClick = false;
    fabButtonEl.addEventListener("click", () => {
      if (suppressNextClick) {
        suppressNextClick = false;
        return;
      }
      const isCurrentlyHidden = menuPanelEl.classList.contains("mk-hide");
      if (isCurrentlyHidden) {
        updateMenuPanelPosition();
        requestAnimationFrame(() => {
          menuPanelEl.classList.remove("mk-hide");
        });
      } else {
        menuPanelEl.classList.add("mk-hide");
      }
    });
    let rafId = 0;
    let startX = 0;
    let startY = 0;
    let isDragging = false;
    let isPointerDown = false;
    let timeoutID;
    let nextPos = null;
    const setDraggingState = (dragging) => {
      fabButtonEl.classList.toggle("dragging", dragging);
      document.body.style.userSelect = dragging ? "none" : "";
      if (dragging) {
        menuPanelEl.classList.add("mk-hide");
      }
    };
    const onPointerDown = (e) => {
      isPointerDown = true;
      startX = e.clientX;
      startY = e.clientY;
      suppressNextClick = false;
      clearTimeout(timeoutID);
      timeoutID = window.setTimeout(() => {
        if (isPointerDown) {
          isDragging = true;
          suppressNextClick = true;
          setDraggingState(true);
          const updateTransform = () => {
            fabButtonEl.style.transform = `translateY(${e.clientY - fabButtonEl.getBoundingClientRect().top}px)`;
          };
          updateTransform();
          fabButtonEl.addEventListener("transitionrun", updateTransform);
          fabButtonEl.addEventListener(
            "transitionend",
            () => {
              fabButtonEl.removeEventListener("transitionrun", updateTransform);
            },
            { once: true }
          );
          fabButtonEl.setPointerCapture(e.pointerId);
        }
      }, DRAG_DELAY);
    };
    const applyNextPos = () => {
      rafId = 0;
      if (!nextPos) return;
      const { x, y } = nextPos;
      nextPos = null;
      const { offsetWidth: width, offsetHeight: height } = fabButtonEl;
      const viewportHeight = window.innerHeight;
      const maxTop = viewportHeight - height - BOUNDARY_PADDING;
      const clampedY = Math.max(
        BOUNDARY_PADDING,
        Math.min(maxTop, y - height / 2)
      );
      const clampedX = Math.min(window.innerWidth - width, x - width / 2);
      const isLeft = clampedX + width / 2 < window.innerWidth / 2;
      if (isLeft) {
        fabButtonEl.style.left = `${clampedX}px`;
        fabButtonEl.style.right = "unset";
      } else {
        fabButtonEl.style.left = "unset";
        fabButtonEl.style.right = `${window.innerWidth - clampedX - width}px`;
      }
      fabButtonEl.style.top = `${Math.round(clampedY / viewportHeight * 100)}%`;
      fabButtonEl.style.transform = "translateY(0)";
    };
    const onPointerMove = (e) => {
      const moved = Math.abs(e.clientX - startX) > DRAG_THRESHOLD || Math.abs(e.clientY - startY) > DRAG_THRESHOLD;
      if (moved && isPointerDown && !isDragging) {
        fabButtonEl.classList.remove("right");
        isDragging = true;
        suppressNextClick = true;
        clearTimeout(timeoutID);
        setDraggingState(true);
      }
      if (isDragging) {
        nextPos = { x: e.clientX, y: e.clientY };
        if (!rafId) rafId = requestAnimationFrame(applyNextPos);
      }
    };
    const snapToEdge = () => {
      const rect = fabButtonEl.getBoundingClientRect();
      const isLeft = rect.left + rect.width / 2 < window.innerWidth / 2;
      if (isLeft) {
        fabButtonEl.style.left = "0px";
        fabButtonEl.style.right = "unset";
      } else {
        fabButtonEl.style.left = "unset";
        fabButtonEl.style.right = "0px";
      }
      fabButtonEl.classList.toggle("right", !isLeft);
      fabButtonEl.style.transform = "translateY(0)";
      if (!menuPanelEl.classList.contains("mk-hide")) {
        updateMenuPanelPosition();
      }
    };
    const onPointerUp = () => {
      isPointerDown = false;
      clearTimeout(timeoutID);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
      if (isDragging) {
        isDragging = false;
        setDraggingState(false);
        snapToEdge();
      } else {
        fabButtonEl.style.transform = "";
      }
    };
    const panelCleanup = buildPanel(menuPanelEl, () => {
      menuPanelEl.classList.add("mk-hide");
    });
    settingsMenuEl.append(menuPanelEl, fabButtonEl);
    document.body.appendChild(settingsMenuEl);
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("pointermove", onPointerMove);
    fabButtonEl.addEventListener("pointerdown", onPointerDown);
    const cleanupClickOutside = onClickOutside(menuPanelEl, (e) => {
      if (e.target === fabButtonEl) return;
      menuPanelEl.classList.add("mk-hide");
    });
    return () => {
      panelCleanup();
      cleanupSettingsMenuStyle();
      fabButtonEl.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      cleanupClickOutside();
    };
  };
  createStyle(`.mk-component{box-sizing:border-box}input.mk-component,select.mk-component{margin:0!important}`);
  class HttpRequestInterceptor {
    hooks = [];
    toast;
    constructor(toast) {
      this.toast = toast || {
        show: (msg, opt) => {
          console.log("[toast]", msg, opt || "");
        }
      };
      this.initXHR();
      this.initFetch();
    }
    registerHook(urlMatcher, transform) {
      const hook = { urlMatcher, transform };
      this.hooks.push(hook);
      return () => {
        const index = this.hooks.indexOf(hook);
        if (index > -1) {
          this.hooks.splice(index, 1);
        }
      };
    }
    runHooks(url, text) {
      let newText = text;
      for (const { urlMatcher, transform } of this.hooks) {
        try {
          if (urlMatcher(url)) {
            const result = transform(newText);
            if (result !== null && result !== newText) {
              newText = result;
            }
          }
        } catch (e) {
          console.error("[XHRFetchHookManager] hook error", e);
        }
      }
      return newText;
    }
    initXHR() {
      const root = typeof window !== "undefined" ? window : globalThis;
      const XHR = root.XMLHttpRequest;
      if (!XHR) {
        console.error("XMLHttpRequest not found, not installing hook");
        return;
      }
      const origOpen = XHR.prototype.open;
      const origSend = XHR.prototype.send;
      XHR.prototype.open = function(method, url, async, username, password) {
        this.__xhr_url = url;
        return origOpen.apply(this, [
          method,
          url,
          async ?? true,
          username ?? null,
          password ?? null
        ]);
      };
      XHR.prototype.send = function(body) {
        const xhr = this;
        const tryOverrideResponse = (rawText) => {
          const newText = requestHook.runHooks(xhr.__xhr_url ?? "", rawText);
          if (newText === rawText) return false;
          Object.defineProperty(xhr, "responseText", {
            configurable: true,
            enumerable: true,
            get: () => newText
          });
          Object.defineProperty(xhr, "response", {
            configurable: true,
            enumerable: true,
            get: () => {
              try {
                return JSON.parse(newText);
              } catch {
                return newText;
              }
            }
          });
          return true;
        };
        const onReady = () => {
          try {
            const raw = xhr.responseText;
            if (typeof raw === "string" && raw.length > 0) {
              tryOverrideResponse(raw);
            }
          } catch (e) {
            console.error("[XHRFetchHookManager] onReady error", e);
          }
        };
        xhr.addEventListener("readystatechange", () => {
          if (xhr.readyState >= 3) onReady();
        });
        xhr.addEventListener("load", onReady);
        return origSend.apply(this, [
          body instanceof ReadableStream ? null : body
        ]);
      };
    }
    initFetch() {
      const root = typeof window !== "undefined" ? window : globalThis;
      const origFetch = root.fetch.bind(root);
      root.fetch = async (input, init) => {
        const requestUrl = typeof input === "string" ? input : input.url;
        const response = await origFetch(input, init);
        const contentType = response.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
          const clone = response.clone();
          const text = await clone.text();
          const newText = this.runHooks(requestUrl, text);
          if (newText !== text) {
            this.toast.show("Response modified by hook");
            return new Response(newText, {
              status: response.status,
              statusText: response.statusText,
              headers: response.headers
            });
          }
        }
        return response;
      };
    }
  }
  const requestHook = new HttpRequestInterceptor();
  const withDownload = () => {
    const toast = useToast();
    return requestHook.registerHook(
      (url) => url.startsWith("/api/activities"),
      (responseText) => {
        let changeAllowDownload = false;
        let changeAllowForwardSeeking = false;
        const data = JSON.parse(responseText, (key, value) => {
          if (key === "allow_download" && value === false) {
            changeAllowDownload = true;
            return true;
          }
          if (key === "allow_forward_seeking" && value === false) {
            changeAllowForwardSeeking = true;
            return true;
          }
          return value;
        });
        if (changeAllowDownload) toast.show("以強制允許下載");
        if (changeAllowForwardSeeking) toast.show("以強制允許快轉");
        return JSON.stringify(data);
      }
    );
  };
  const tryPlayVideo = async () => {
    const toast = useToast();
    const goToNext = async () => {
      const btn = await waitForElement(
        'button[ng-click="changeActivity(nextActivity)"]'
      ).catch(() => null);
      if (!btn) {
        toast.show("未找到下一個活動按鈕", { type: "warn" });
      } else {
        toast.show("正在跳轉下一個活動", { type: "info" });
        btn.click();
      }
    };
    const video = await waitForElement("video").catch(
      () => null
    );
    if (!video) {
      toast.show("未找到影片元素", { type: "error" });
      return;
    }
    video.scrollIntoView({ behavior: "smooth" });
    let playButton = null;
    waitForElement(".mvp-toggle-play").then((btn) => playButton = btn);
    const changeRate = async (playbackRate) => {
      const el = await waitForElement("div[data-name=PLAY_RATE]>span");
      el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true }));
      toast.show("正在更改倍速...", { type: "info" });
      setTimeout(() => {
        const options = [
          ...document.querySelectorAll(".mvp-control-collapse-menu>div")
        ].map((el2) => ({ el: el2, text: el2.textContent?.trim() || "" })).filter(({ text }) => /^(\d+(\.\d+)?)x$/.test(text));
        if (options.length === 0) {
          toast.show("未找到倍速選項，改為直接設置", { type: "warn" });
          video.playbackRate = playbackRate;
          return;
        }
        const target = options.find(({ text }) => text === `${playbackRate}x`);
        if (target) {
          toast.show(`設置倍速為 ${playbackRate}x`, { type: "success" });
          target.el.click();
        } else {
          toast.show(`倍速以強制設為 ${playbackRate}x`, { type: "success" });
          video.playbackRate = playbackRate;
        }
        el.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true }));
      }, 400);
    };
    const unsubscribePlaybackRate = videoSettingsStore.subscribe(
      "playbackRate",
      ({ value }) => changeRate(value),
      false
    );
    const tryingToPlayToast = toast.show("正在嘗試撥放影片...", {
      type: "info",
      duration: -1
    });
    const loop = setInterval(() => {
      if (!playButton) return;
      if (video.paused || video.ended || video.readyState <= 2) {
        playButton.click();
      } else {
        tryingToPlayToast.close();
        toast.show("影片播放中...", { type: "success" });
        clearInterval(loop);
        changeRate(videoSettingsStore.get("playbackRate"));
      }
    }, 1e3);
    const handleProgress = () => {
      if (!videoSettingsStore.get("autoNext")) return;
      if (video.duration > 0) {
        const ratio = video.currentTime / video.duration;
        if (ratio >= videoSettingsStore.get("customAutoNextThreshold")) {
          handleFinish();
        }
      }
    };
    const watchVideoChange = (() => {
      const observer = new MutationObserver((mutations) => {
        for (const m of mutations) {
          for (const n of m.removedNodes) {
            if (n === video) {
              console.log("[watchRemove] Video removed, re-init");
              close();
              tryPlayVideo();
              return;
            }
          }
          for (const n of m.addedNodes) {
            if (n.tagName === "VIDEO" && n !== video) {
              console.log("[watchRemove] New video appeared");
              close();
              tryPlayVideo();
              return;
            }
          }
        }
      });
      const close = () => observer.disconnect();
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["src"]
      });
      return close;
    })();
    let isFinished = false;
    const handleFinish = () => {
      if (isFinished) return;
      isFinished = true;
      clearInterval(loop);
      video.removeEventListener("timeupdate", handleProgress);
      unsubscribePlaybackRate();
      tryingToPlayToast.close();
      goToNext();
    };
    handleProgress();
    video.addEventListener("timeupdate", handleProgress);
    video.addEventListener("ended", handleFinish, { once: true });
    return () => {
      watchVideoChange();
    };
  };
  const PATH_MATCH = /^\/course\/(?<learningID>\d+)(?<viewing>\/learning-activity(\/full-screen)?)?/;
  const { pathname } = location;
  const { learningID, viewing } = pathname.match(PATH_MATCH)?.groups || {};
  settingsStore.load();
  videoSettingsStore.load();
  const features = {
    removeFooter: featureManager.register("removeFooter", removeFooter),
    blockEvents: featureManager.register("blockEvents", blockEventsSetup),
    enableUserSelect: featureManager.register(
      "enableUserSelect",
      enableUserSelectStyle
    ),
    fixStyle: featureManager.register("fixStyle", fixSomeStyle),
    allowDownload: featureManager.register("allowDownload", withDownload)
  };
  const setupReactiveFeatures = () => {
    const featureKeys = Object.keys(features);
    const wireFeature = (key) => {
      const feature = features[key];
      if (settingsStore.get(key)) feature.enable();
      settingsStore.subscribe(
        key,
        ({ value }) => {
          if (value) feature.enable();
          else feature.disable();
          notificationManager.settingChanged(key, value);
        },
        false
      );
    };
    featureKeys.forEach(wireFeature);
    const videoSettingKeys = ["autoNext", "playbackRate"];
    videoSettingKeys.forEach(
      (k) => videoSettingsStore.subscribe(
        k,
        ({ value }) => notificationManager.settingChanged(k, value),
        false
      )
    );
  };
  setupReactiveFeatures();
  if (/^\/bulletin-list\/?$/.test(pathname)) {
    fixSomeBulletinListStyle();
    featBulletinListCourseLink();
  } else if (/^\/user\/courses\/?$/.test(pathname)) {
    featCoursesLink();
    fixCoursesStyle();
  } else if (viewing && learningID) {
    tryPlayVideo();
  }
  try {
    initSettingsMenu();
  } catch (error) {
    console.error("Initialization error:", error);
  }
  setInterval(() => document.dispatchEvent(new Event("mousemove")), 5e3);
  exports.features = features;
  exports.notificationManager = notificationManager;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
  return exports;
})({});
