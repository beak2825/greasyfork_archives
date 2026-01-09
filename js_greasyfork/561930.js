// ==UserScript==
// @name           Bilibili投稿合集排序辅助
// @description    支持按投稿的发布时间排序(升序/降序), 不再只能使用默认的按投稿标题排序.
// @version        1.0.0
// @author         Yiero
// @match          https://member.bilibili.com/platform/*
// @run-at         document-start
// @license        GPL-3
// @namespace      https://github.com/AliubYiero/Yiero_WebScripts
// @noframes
// @tag            bilibili
// @tag            upload
// @grant          GM_unregisterMenuCommand
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_addValueChangeListener
// @grant          GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/561930/Bilibili%E6%8A%95%E7%A8%BF%E5%90%88%E9%9B%86%E6%8E%92%E5%BA%8F%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/561930/Bilibili%E6%8A%95%E7%A8%BF%E5%90%88%E9%9B%86%E6%8E%92%E5%BA%8F%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
(function() {
  "use strict";
  /*
  * @module      : @yiero/gmlib
  * @author      : Yiero
  * @version     : 0.1.23
  * @description : GM Lib for Tampermonkey
  * @keywords    : tampermonkey, lib, scriptcat, utils
  * @license     : MIT
  * @repository  : git+https://github.com/AliubYiero/GmLib.git
  */
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  const parseResponseText = (responseText) => {
    try {
      return JSON.parse(responseText);
    } catch (e) {
      try {
        const domParser = new DOMParser();
        return domParser.parseFromString(responseText, "text/html");
      } catch (e2) {
        return responseText;
      }
    }
  };
  const hookXhr = (hookUrl, callback) => {
    const xhrOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function() {
      const xhr = this;
      if (hookUrl(arguments[1])) {
        const getter = Object.getOwnPropertyDescriptor(
          XMLHttpRequest.prototype,
          "responseText"
        ).get;
        Object.defineProperty(xhr, "responseText", {
          get: () => {
            const responseText = getter.call(xhr);
            return callback(parseResponseText(responseText), arguments[1]) || responseText;
          }
        });
      }
      return xhrOpen.apply(xhr, arguments);
    };
  };
  const returnElement = (selector, options, resolve, reject) => {
    setTimeout(() => {
      const element = options.parent.querySelector(selector);
      if (!element) {
        reject(new Error("Void Element"));
        return;
      }
      resolve(element);
    }, options.delayPerSecond * 1e3);
  };
  const getElementByTimer = (selector, options, resolve, reject) => {
    const intervalDelay = 100;
    let intervalCounter = 0;
    const maxIntervalCounter = Math.ceil(options.timeoutPerSecond * 1e3 / intervalDelay);
    const timer = window.setInterval(() => {
      if (++intervalCounter > maxIntervalCounter) {
        clearInterval(timer);
        returnElement(selector, options, resolve, reject);
        return;
      }
      const element = options.parent.querySelector(selector);
      if (element) {
        clearInterval(timer);
        returnElement(selector, options, resolve, reject);
      }
    }, intervalDelay);
  };
  const getElementByMutationObserver = (selector, options, resolve, reject) => {
    const timer = options.timeoutPerSecond && window.setTimeout(() => {
      observer.disconnect();
      returnElement(selector, options, resolve, reject);
    }, options.timeoutPerSecond * 1e3);
    const observeElementCallback = (mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((addNode) => {
          if (addNode.nodeType !== Node.ELEMENT_NODE) {
            return;
          }
          const addedElement = addNode;
          const element = addedElement.matches(selector) ? addedElement : addedElement.querySelector(selector);
          if (element) {
            timer && clearTimeout(timer);
            returnElement(selector, options, resolve, reject);
          }
        });
      });
    };
    const observer = new MutationObserver(observeElementCallback);
    observer.observe(options.parent, {
      subtree: true,
      childList: true
    });
    return true;
  };
  function elementWaiter(selector, options) {
    const elementWaiterOptions = {
      parent: document,
      timeoutPerSecond: 20,
      delayPerSecond: 0.5,
      ...options
    };
    return new Promise((resolve, reject) => {
      const targetElement = elementWaiterOptions.parent.querySelector(selector);
      if (targetElement) {
        returnElement(selector, elementWaiterOptions, resolve, reject);
        return;
      }
      if (MutationObserver) {
        getElementByMutationObserver(selector, elementWaiterOptions, resolve, reject);
        return;
      }
      getElementByTimer(selector, elementWaiterOptions, resolve, reject);
    });
  }
  let messageContainer = null;
  const messageTypes = {
    success: {
      backgroundColor: "#f0f9eb",
      borderColor: "#e1f3d8",
      textColor: "#67c23a",
      icon: "\u2713"
    },
    warning: {
      backgroundColor: "#fdf6ec",
      borderColor: "#faecd8",
      textColor: "#e6a23c",
      icon: "\u26A0"
    },
    error: {
      backgroundColor: "#fef0f0",
      borderColor: "#fde2e2",
      textColor: "#f56c6c",
      icon: "\u2715"
    },
    info: {
      backgroundColor: "#edf2fc",
      borderColor: "#e4e7ed",
      textColor: "#909399",
      icon: "i"
    }
  };
  const messagePositions = {
    "top": { top: "20px" },
    "top-left": { top: "20px", left: "20px" },
    "top-right": { top: "20px", right: "20px" },
    "left": { left: "20px" },
    "right": { right: "20px" },
    "bottom": { bottom: "20px" },
    "bottom-left": { bottom: "20px", left: "20px" },
    "bottom-right": { bottom: "20px", right: "20px" }
  };
  function createMessageContainer() {
    if (!messageContainer) {
      messageContainer = document.createElement("div");
      messageContainer.setAttribute("style", `
                    position: fixed;
                    z-index: 9999999999;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    pointer-events: none;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100vw;
                `);
      document.body.appendChild(messageContainer);
    }
    return messageContainer;
  }
  function Message(options) {
    const detail = {
      type: "info",
      duration: 3e3,
      position: "top",
      message: ""
    };
    if (typeof options === "string") {
      detail.message = options;
    } else {
      Object.assign(detail, options);
    }
    messageContainer = createMessageContainer();
    const messageEl = document.createElement("div");
    const typeConfig = messageTypes[detail.type] || messageTypes.info;
    messageEl.setAttribute("style", `
                position: absolute;
                min-width: 300px;
                max-width: 500px;
                padding: 15px 20px;
                border-radius: 8px;
                transform: translateY(-20px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                background-color: ${typeConfig.backgroundColor};
                border: 1px solid ${typeConfig.borderColor};
                color: ${typeConfig.textColor};
                display: flex;
                align-items: center;
                transition: all 0.3s ease;
                opacity: 0;
                pointer-events: auto;
                cursor: pointer;
                ${Object.entries(messagePositions[detail.position || "top"]).map(([k, v]) => `${k}: ${v};`).join(" ")}
            `);
    const iconEl = document.createElement("span");
    iconEl.setAttribute("style", `
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 24px;
                height: 24px;
                margin-right: 12px;
                font-size: 16px;
                font-weight: bold;
            `);
    iconEl.textContent = typeConfig.icon;
    messageEl.appendChild(iconEl);
    const contentEl = document.createElement("span");
    contentEl.setAttribute("style", `
                flex: 1;
                font-size: 14px;
                line-height: 1.5;
            `);
    contentEl.textContent = detail.message;
    messageEl.appendChild(contentEl);
    messageContainer.appendChild(messageEl);
    setTimeout(() => {
      messageEl.style.opacity = "1";
      messageEl.style.transform = "translateY(0)";
    }, 10);
    let timer = setTimeout(() => {
      closeMessage(messageEl);
    }, detail.duration);
    messageEl.addEventListener("click", () => {
      clearTimeout(timer);
      closeMessage(messageEl);
    });
  }
  function closeMessage(element) {
    element.style.opacity = "0";
    element.style.transform = "translateY(-20px)";
    setTimeout(() => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }, 300);
  }
  Message.success = (message, options) => Message({
    ...options,
    message,
    type: "success"
  });
  Message.warning = (message, options) => Message({
    ...options,
    message,
    type: "warning"
  });
  Message.error = (message, options) => Message({
    ...options,
    message,
    type: "error"
  });
  Message.info = (message, options) => Message({
    ...options,
    message,
    type: "info"
  });
  const _gmMenuCommand = class _gmMenuCommand2 {
    constructor() {
    }
    /**
     * 获取一个菜单按钮
     */
    static get(title) {
      const commandButton = this.list.find((commandButton2) => commandButton2.title === title);
      if (!commandButton) {
        throw new Error("\u83DC\u5355\u6309\u94AE\u4E0D\u5B58\u5728");
      }
      return commandButton;
    }
    /**
     * 创建一个带有状态的菜单按钮
     */
    static createToggle(details) {
      this.create(details.active.title, () => {
        this.toggleActive(details.active.title);
        this.toggleActive(details.inactive.title);
        details.active.onClick();
        this.render();
      }, true).create(details.inactive.title, () => {
        this.toggleActive(details.active.title);
        this.toggleActive(details.inactive.title);
        details.inactive.onClick();
        this.render();
      }, false);
      return _gmMenuCommand2;
    }
    /**
     * 手动激活一个菜单按钮
     */
    static click(title) {
      const commandButton = this.get(title);
      commandButton.onClick();
      return _gmMenuCommand2;
    }
    /**
     * 创建一个菜单按钮
     */
    static create(title, onClick, isActive = true) {
      if (this.list.some((commandButton) => commandButton.title === title)) {
        throw new Error("\u83DC\u5355\u6309\u94AE\u5DF2\u5B58\u5728");
      }
      this.list.push({ title, onClick, isActive, id: 0 });
      return _gmMenuCommand2;
    }
    /**
     * 删除一个菜单按钮
     */
    static remove(title) {
      this.list = this.list.filter((commandButton) => commandButton.title !== title);
      return _gmMenuCommand2;
    }
    /**
     * 修改两个菜单按钮的顺序
     */
    static swap(title1, title2) {
      const index1 = this.list.findIndex((commandButton) => commandButton.title === title1);
      const index2 = this.list.findIndex((commandButton) => commandButton.title === title2);
      if (index1 === -1 || index2 === -1) {
        throw new Error("\u83DC\u5355\u6309\u94AE\u4E0D\u5B58\u5728");
      }
      [this.list[index1], this.list[index2]] = [this.list[index2], this.list[index1]];
      return _gmMenuCommand2;
    }
    /**
     * 修改一个菜单按钮
     */
    static modify(title, details) {
      const commandButton = this.get(title);
      details.onClick && (commandButton.onClick = details.onClick);
      details.isActive && (commandButton.isActive = details.isActive);
      return _gmMenuCommand2;
    }
    /**
     * 切换菜单按钮激活状态
     */
    static toggleActive(title) {
      const commandButton = this.get(title);
      commandButton.isActive = !commandButton.isActive;
      return _gmMenuCommand2;
    }
    /**
     * 渲染所有激活的菜单按钮
     */
    static render() {
      this.list.forEach((commandButton) => {
        GM_unregisterMenuCommand(commandButton.id);
        if (commandButton.isActive) {
          commandButton.id = GM_registerMenuCommand(commandButton.title, commandButton.onClick);
        }
      });
    }
  };
  __publicField(_gmMenuCommand, "list", []);
  class GmStorage {
    constructor(key, defaultValue) {
      __publicField(this, "listenerId", 0);
      this.key = key;
      this.defaultValue = defaultValue;
      this.key = key;
      this.defaultValue = defaultValue;
    }
    /**
     * 获取当前存储的值
     *
     * @alias get()
     */
    get value() {
      return this.get();
    }
    /**
     * 获取当前存储的值
     */
    get() {
      return GM_getValue(this.key, this.defaultValue);
    }
    /**
     * 给当前存储设置一个新值
     */
    set(value) {
      return GM_setValue(this.key, value);
    }
    /**
     * 移除当前键
     */
    remove() {
      GM_deleteValue(this.key);
    }
    /**
     * 监听元素更新, 同时只能存在 1 个监听器
     */
    updateListener(callback) {
      this.removeListener();
      this.listenerId = GM_addValueChangeListener(this.key, (key, oldValue, newValue, remote) => {
        callback({
          key,
          oldValue,
          newValue,
          remote
        });
      });
    }
    /**
     * 移除元素更新回调
     */
    removeListener() {
      GM_removeValueChangeListener(this.listenerId);
    }
  }
  class EventListener {
    constructor(listener) {
      this.listener = listener;
      this.eventName = Math.random().toString(36).slice(2);
      this.element = document.createElement("div");
      this.element.addEventListener(this.eventName, (event) => {
        this.listener(event.detail, event);
      });
    }
    /**
     * 触发事件
     */
    dispatch(data) {
      this.element.dispatchEvent(new CustomEvent(this.eventName, {
        detail: data
      }));
    }
  }
  class SortButton extends HTMLElement {
    constructor() {
      super();
      this._status = "loading";
      this._countdown = 5;
      this.attachShadow({ mode: "open" });
      this.render();
    }
    // 观察的属性
    static get observedAttributes() {
      return ["status", "countdown"];
    }
    connectedCallback() {
      this.addEventListeners();
      this.updateDisplay();
    }
    disconnectedCallback() {
      this.removeEventListeners();
    }
    attributeChangedCallback(name, oldValue, newValue) {
      if (oldValue === newValue) return;
      switch (name) {
        case "status":
          this._status = newValue;
          this.updateStatusDisplay();
          break;
        case "countdown":
          const countdownValue = Number(newValue);
          if (!isNaN(countdownValue)) {
            this._countdown = countdownValue;
            this.updateCountdownDisplay();
          }
          break;
      }
    }
    // 属性访问器
    get status() {
      return this._status;
    }
    set status(value) {
      this.setAttribute("status", value);
    }
    get countdown() {
      return this._countdown;
    }
    set countdown(value) {
      this.setAttribute("countdown", value.toString());
    }
    // 渲染组件
    render() {
      if (!this.shadowRoot) return;
      this.shadowRoot.innerHTML = `
            <style>
                .sort-button-group {
                    text-align: center;
                    width: 154px;
                    height: 34px;
                    line-height: 34px;
                    border-radius: 4px;
                    font-size: 14px;
                    user-select: none;
                    overflow: hidden;
                    box-sizing: border-box !important;
                    background-color: #00a1d6;
                    color: #fff;
                    display: flex;
                    justify-content: space-around;
                    cursor: pointer;
                }
                
                .sort-button-group.loading > .ascend-sort-button,
                .sort-button-group.loading > .descend-sort-button,
                .sort-button-group.loaded > .loading-button {
                    display: none;
                }
                
                .sort-button-group.loaded > .ascend-sort-button,
                .sort-button-group.loaded > .descend-sort-button,
                .sort-button-group.loading > .loading-button {
                    display: inline-block;
                }
                
                .ascend-sort-button {
                    border-right: 1px solid #fff;
                }
                
                .ascend-sort-button,
                .descend-sort-button {
                    flex: 1;
                    cursor: pointer;
                }
                
                .ascend-sort-button:hover,
                .descend-sort-button:hover {
                    background-color: #008bb8;
                }
                
                .loading-button {
                    flex: 1;
                }
            </style>
            
            <div class="sort-button-group ${this._status}">
                <section class="loading-button">\u52A0\u8F7D\u6570\u636E\u4E2D...\u5269\u4F59${this._countdown.toFixed(1)}s</section>
                <section class="ascend-sort-button">\u5347\u5E8F\u6392\u5E8F</section>
                <section class="descend-sort-button">\u964D\u5E8F\u6392\u5E8F</section>
            </div>
        `;
    }
    // 更新状态显示
    updateStatusDisplay() {
      var _a;
      const container = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector(".sort-button-group");
      if (container) {
        container.className = `sort-button-group ${this._status}`;
      }
    }
    // 更新倒计时显示
    updateCountdownDisplay() {
      var _a;
      const loadingButton = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector(".loading-button");
      if (loadingButton) {
        loadingButton.textContent = `\u52A0\u8F7D\u6570\u636E\u4E2D...\u5269\u4F59${this._countdown.toFixed(1)}s`;
      }
    }
    // 更新显示
    updateDisplay() {
      this.updateStatusDisplay();
      this.updateCountdownDisplay();
    }
    // 添加事件监听器
    addEventListeners() {
      var _a, _b;
      const ascendButton = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector(".ascend-sort-button");
      const descendButton = (_b = this.shadowRoot) == null ? void 0 : _b.querySelector(".descend-sort-button");
      if (ascendButton) {
        ascendButton.addEventListener("click", this.handleAscendSort.bind(this));
      }
      if (descendButton) {
        descendButton.addEventListener("click", this.handleDescendSort.bind(this));
      }
    }
    // 移除事件监听器
    removeEventListeners() {
      var _a, _b;
      const ascendButton = (_a = this.shadowRoot) == null ? void 0 : _a.querySelector(".ascend-sort-button");
      const descendButton = (_b = this.shadowRoot) == null ? void 0 : _b.querySelector(".descend-sort-button");
      if (ascendButton) {
        ascendButton.removeEventListener("click", this.handleAscendSort.bind(this));
      }
      if (descendButton) {
        descendButton.removeEventListener("click", this.handleDescendSort.bind(this));
      }
    }
    // 处理升序排序点击
    handleAscendSort(event) {
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent("ascend-sort", {
        bubbles: true,
        composed: true,
        detail: { type: "ascend", timestamp: Date.now() }
      }));
    }
    // 处理降序排序点击
    handleDescendSort(event) {
      event.stopPropagation();
      this.dispatchEvent(new CustomEvent("descend-sort", {
        bubbles: true,
        composed: true,
        detail: { type: "descend", timestamp: Date.now() }
      }));
    }
    // 公共方法
    setLoading() {
      this.status = "loading";
    }
    setLoaded() {
      this.status = "loaded";
    }
    setCountdown(value) {
      this.countdown = value;
    }
    reset() {
      this.status = "loading";
      this.dispatchEvent(new CustomEvent("reset", {
        bubbles: true,
        composed: true
      }));
    }
  }
  const initSortButton = (container) => {
    if (!customElements.get("sort-button")) {
      customElements.define("sort-button", SortButton);
    }
    const sortButton = document.createElement("sort-button");
    container.appendChild(sortButton);
    return sortButton;
  };
  const sleep = (milliseconds) => {
    return new Promise((res) => setTimeout(res, milliseconds));
  };
  const normalizeHeaders = (headers) => {
    const normalized = {};
    for (const key in headers) normalized[key.toLowerCase()] = headers[key];
    return normalized;
  };
  const processBody = (body, headers) => {
    if (null == body) return null;
    if (body instanceof FormData || body instanceof URLSearchParams || body instanceof Blob || body instanceof ArrayBuffer || body instanceof ReadableStream || "string" == typeof body) return body;
    if ("object" == typeof body) {
      if (!headers["content-type"]) headers["content-type"] = "application/json;charset=UTF-8";
      return JSON.stringify(body);
    }
    return String(body);
  };
  async function xhrRequest(url, options = {}) {
    const { method = "GET", withCredentials = false, timeout = 2e4, onProgress } = options;
    const headers = normalizeHeaders(options.headers || {});
    const requestBody = processBody(options.body, headers);
    if (options.params) {
      const searchParams = new URLSearchParams(options.params);
      url += `?${searchParams.toString()}`;
    }
    let responseType = options.responseType;
    if (!responseType) {
      const accept = headers["accept"];
      responseType = (accept == null ? void 0 : accept.includes("text/html")) ? "document" : (accept == null ? void 0 : accept.includes("text/")) ? "text" : "json";
    }
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(method.toUpperCase(), url, true);
      xhr.timeout = timeout;
      xhr.withCredentials = withCredentials;
      xhr.responseType = responseType;
      Object.entries(headers).forEach(([key, value]) => {
        xhr.setRequestHeader(key, value);
      });
      if (onProgress) xhr.addEventListener("progress", onProgress);
      xhr.addEventListener("load", () => {
        if (xhr.status >= 200 && xhr.status < 300) resolve(xhr.response);
        else reject(new Error(`HTTP Error ${xhr.status}: ${xhr.statusText} @ ${url}`));
      });
      xhr.addEventListener("error", () => {
        reject(new Error(`Network Error: Failed to connect to ${url}`));
      });
      xhr.addEventListener("timeout", () => {
        xhr.abort();
        reject(new Error(`Request Timeout: Exceeded ${timeout}ms`));
      });
      xhr.send(requestBody);
    });
  }
  xhrRequest.get = (url, options) => xhrRequest(url, {
    ...options,
    method: "GET"
  });
  xhrRequest.getWithCredentials = (url, options) => xhrRequest(url, {
    ...options,
    method: "GET",
    withCredentials: true
  });
  xhrRequest.post = (url, options) => xhrRequest(url, {
    ...options,
    method: "POST"
  });
  xhrRequest.postWithCredentials = (url, options) => xhrRequest(url, {
    ...options,
    method: "POST",
    withCredentials: true
  });
  function api_getVideoInfo(id, login = false) {
    const params = {};
    if ("string" == typeof id && id.startsWith("BV")) params.bvid = id;
    else params.aid = id.toString();
    const url = "https://api.bilibili.com/x/web-interface/view";
    if (login) return xhrRequest.getWithCredentials(url, {
      params
    });
    return xhrRequest.get(url, {
      params
    });
  }
  const getCsrf = async () => {
    const csrfCookie = await cookieStore.get("bili_jct");
    if (!csrfCookie || !csrfCookie.value) throw new NotLoginError();
    return csrfCookie.value;
  };
  async function api_editSeasonSection(section, sorts) {
    const csrf = await getCsrf();
    section.title || (section.title = "\u6B63\u7247");
    return xhrRequest.postWithCredentials("https://member.bilibili.com/x2/creative/web/season/section/edit", {
      params: {
        csrf
      },
      body: {
        section,
        sorts
      }
    });
  }
  const publishTimeStore = new GmStorage("publishTime", {});
  const main = async () => {
    const requestQueue = [];
    const handleSeasonData = async (response) => {
      requestQueue.length = 0;
      const { episodes = [], section } = response;
      if (!episodes.length || !section) return;
      const isSectionEnabled = Boolean(document.querySelector(".upload-manage .ep-section-edit"));
      const containerSelector = isSectionEnabled ? ".ep-section-edit-video-list-nav" : ".ep-edit-section-list-nav";
      const container = await elementWaiter(containerSelector);
      const sortButton = initSortButton(container);
      sortButton.style.marginLeft = "22px";
      const initialCountdown = episodes.length * 0.2;
      sortButton.countdown = initialCountdown;
      const cachedPublishTimes = publishTimeStore.get();
      const videoPublishInfoList = [];
      const processEpisode = async (episode) => {
        const { id, aid } = episode;
        if (!id || !aid) return;
        const cachedTime = cachedPublishTimes[aid];
        if (cachedTime) {
          videoPublishInfoList.push({ id, publishTime: cachedTime });
          return;
        }
        const videoInfo = await api_getVideoInfo(aid, true);
        const publishTime = videoInfo.data.pubdate;
        cachedPublishTimes[aid] = publishTime;
        publishTimeStore.set(cachedPublishTimes);
        videoPublishInfoList.push({ id, publishTime });
        await sleep(200);
      };
      requestQueue.push(...episodes);
      while (requestQueue.length > 0) {
        const request = requestQueue.pop();
        if (!request) continue;
        await processEpisode(request);
        const remainingTime = requestQueue.length * 0.2;
        sortButton.countdown = remainingTime;
      }
      sortButton.status = "loaded";
      const executeSort = async (sortOrder) => {
        const sortedList = [...videoPublishInfoList].sort(
          (a, b) => sortOrder === "asc" ? a.publishTime - b.publishTime : b.publishTime - a.publishTime
        );
        const sortParams = sortedList.map((item, index) => ({
          id: item.id,
          sort: index + 1
        }));
        await api_editSeasonSection(
          {
            id: section.id,
            seasonId: section.seasonId,
            title: section.title,
            type: section.type
          },
          sortParams
        );
        const message = sortOrder === "asc" ? "\u5408\u96C6\u89C6\u9891\u6309\u53D1\u5E03\u65F6\u95F4\u5347\u5E8F\uFF08\u4ECE\u65E7\u5230\u65B0\uFF09\u6392\u5E8F\u5B8C\u6210" : "\u5408\u96C6\u89C6\u9891\u6309\u53D1\u5E03\u65F6\u95F4\u964D\u5E8F\uFF08\u4ECE\u65B0\u5230\u65E7\uFF09\u6392\u5E8F\u5B8C\u6210";
        Message({
          duration: 3e3,
          message: `${message}\uFF0C\u8BF7\u5237\u65B0\u9875\u9762\u67E5\u770B\u7ED3\u679C`,
          position: "top",
          type: "success"
        });
      };
      sortButton.addEventListener("ascend-sort", () => executeSort("asc"));
      sortButton.addEventListener("descend-sort", () => executeSort("desc"));
    };
    const eventListener = new EventListener(handleSeasonData);
    hookXhr(
      (url) => {
        return url.startsWith("https://member.bilibili.com/x2/creative/web/season/section  ") || url.startsWith("/x2/creative/web/season/section");
      },
      (response) => {
        if (response == null ? void 0 : response.data) {
          eventListener.dispatch(response.data);
        }
      }
    );
  };
  main().catch((error) => {
    console.error(error);
  });
})();
