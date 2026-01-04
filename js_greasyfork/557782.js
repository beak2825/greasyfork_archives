// ==UserScript==
// @name           Bilibili视频观看状态标记
// @description    基于收藏夹内容, 自动标记Bilibili视频的观看状态(已看/未看)
// @version        1.0.2
// @author         Yiero
// @match          https://*.bilibili.com/*
// @icon           https://www.bilibili.com/favicon.ico
// @connect        api.bilibili.com
// @license        GPL-3
// @namespace      https://github.com/AliubYiero/Yiero_WebScripts
// @noframes       
// @grant          GM_addStyle
// @grant          GM_xmlhttpRequest
// @grant          GM_unregisterMenuCommand
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/557782/Bilibili%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/557782/Bilibili%E8%A7%86%E9%A2%91%E8%A7%82%E7%9C%8B%E7%8A%B6%E6%80%81%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==
var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
const styleContent = `/* \u901A\u7528\u5DF2\u770B\u6837\u5F0F */
.watch-mark {
	position: relative;
}

.watch-mark.watched, .watch-mark.same-watch {
	opacity: .6;
}

.watch-mark::after {
	position: absolute;
	text-align: center;
	font-size: 12px;
	align-items: center;
	border-radius: 2px;
	display: flex;
	height: 18px;
	padding: 0 5px;
	pointer-events: none;
	top: 8px;
	z-index: 10;
}

.watch-mark.watched::after {
	content: '\u5DF2\u770B';
	background-color: #9E9E9EDE;
	color: #F5F5F5DE;
}

.watch-mark.same-watch::after {
	content: '\u770B\u8FC7\u7C7B\u4F3C';
	background-color: #FF9800DE;
	color: #F5F5F5DE;
}

.watch-mark.unwatched::after {
	content: '\u672A\u770B';
	background-color: #00BCD4;
	color: #F5F5F5;
}

.watch-mark.watching::after {
	content: '\u6B63\u5728\u770B';
	background-color: #FF9800DE;
	color: #F5F5F5DE;
}

.watch-mark.ep::after {
	content: '\u756A\u5267';
	background-color: rgba(109, 221, 132);
	color: #F5F5F5DE;
}

.watch-mark.left::after {
	left: 8px;
}

.watch-mark.right::after {
	right: 8px;
}

/* \u6D6E\u52A8\u65F6\u9690\u85CF */
.watch-mark:hover::after {
	opacity: 0;
}
.watch-mark.watched:hover, .watch-mark.same-watch:hover {
	opacity: 1;
}

/* \u5408\u96C6\u5217\u8868\u5DF2\u770B\u6837\u5F0F */
.video-pod__item.simple.watch-mark {
	display: flex;
	align-items: center;
	
	& > .single-p {
		flex: 1;
	}
}
.video-pod__item.simple.watch-mark::after {
	position: static;
	width: 28px;
	height: 16px;
	line-height: 16px;
	opacity: .9;
}
`;
const addReadSignStyle = () => {
  return GM_addStyle(styleContent);
};
const getVideoId = (url) => {
  try {
    const videoId = new URL(url).pathname.split("/").findLast(
      (item) => item.startsWith("BV1") || item.startsWith("ep") || item.startsWith("av")
    );
    if (!videoId) return null;
    return videoId;
  } catch (e) {
    return null;
  }
};
const codeConfig = {
  XOR_CODE: 23442827791579n,
  MASK_CODE: 2251799813685247n,
  BASE: 58n,
  data: "FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf"
};
function bvToAv(bvid) {
  const { MASK_CODE, XOR_CODE, data, BASE } = codeConfig;
  const bvidArr = Array.from(bvid);
  [bvidArr[3], bvidArr[9]] = [bvidArr[9], bvidArr[3]];
  [bvidArr[4], bvidArr[7]] = [bvidArr[7], bvidArr[4]];
  bvidArr.splice(0, 3);
  const tmp = bvidArr.reduce((pre, bvidChar) => pre * BASE + BigInt(data.indexOf(bvidChar)), 0n);
  return Number(tmp & MASK_CODE ^ XOR_CODE);
}
/*
* @module      : @yiero/gmlib
* @author      : Yiero
* @version     : 0.1.23
* @description : GM Lib for Tampermonkey
* @keywords    : tampermonkey, lib, scriptcat, utils
* @license     : MIT
* @repository  : git+https://github.com/AliubYiero/GmLib.git
*/
var __defProp2 = Object.defineProperty;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField2 = (obj, key, value) => __defNormalProp2(obj, key + "", value);
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
function gmRequest(param1, method, body, GMXmlHttpRequestConfig) {
  const unifiedParameters = () => {
    if (typeof param1 !== "string") {
      return {
        url: param1.url,
        method: param1.method || "GET",
        param: param1.method === "POST" ? param1.data : void 0,
        GMXmlHttpRequestConfig: param1
      };
    }
    return {
      url: param1,
      method,
      param: body,
      GMXmlHttpRequestConfig: {}
    };
  };
  const params = unifiedParameters();
  if (params.method === "GET" && params.param && typeof params.param === "object") {
    params.url = `${params.url}?${new URLSearchParams(params.param).toString()}`;
  }
  if (params.method === "POST" && params.param) {
    params.GMXmlHttpRequestConfig.data = JSON.stringify(params.param);
  }
  return new Promise((resolve, reject) => {
    const newGMXmlHttpRequestConfig = {
      // 默认20s的超时等待
      timeout: 2e4,
      // 请求地址, 请求方法和请求返回
      url: params.url,
      method: params.method,
      onload(response) {
        resolve(parseResponseText(response.responseText));
      },
      onerror(error) {
        reject(error);
      },
      ontimeout() {
        reject(new Error("Request timed out"));
      },
      headers: {
        "Content-Type": "application/json"
      },
      // 用户自定义的油猴配置项
      ...params.GMXmlHttpRequestConfig
    };
    GM_xmlhttpRequest(newGMXmlHttpRequestConfig);
  });
}
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
__publicField2(_gmMenuCommand, "list", []);
const api_getEpInfo = async (epId) => {
  const response = await gmRequest("https://api.bilibili.com/pgc/view/web/season", "GET", {
    ep_id: epId
  });
  const episode = response.result.episodes.find((item) => item.id === Number(epId));
  if (!episode) return Promise.reject("\u83B7\u53D6\u756A\u5267\u4FE1\u606F\u5931\u8D25");
  return episode;
};
const getVideoAvId = async (videoId) => {
  if (videoId.startsWith("BV1")) {
    videoId = String(bvToAv(videoId));
  }
  if (videoId.startsWith("av")) {
    videoId = videoId.slice(2);
  }
  if (videoId.startsWith("ep")) {
    const epId = videoId.slice(2);
    const epInfo = await api_getEpInfo(epId);
    /* @__PURE__ */ (() => {
    })(`\u89E3\u6790\u756A\u5267ID: ep${epId} => av${epInfo.aid}`);
    videoId = String(epInfo.aid);
  }
  return Number(videoId);
};
const api_isFavorVideo = async (videoId) => {
  const aid = await getVideoAvId(videoId);
  const res = await gmRequest(
    "https://api.bilibili.com/x/v2/fav/video/favoured",
    "GET",
    {
      aid: String(aid)
    }
  );
  if (res.code !== 0) {
    throw new Error(res.message);
  }
  return res.data.favoured;
};
const sleep = (milliseconds) => {
  return new Promise((res) => setTimeout(res, milliseconds));
};
class DelayedQueue {
  constructor(processor, delay = 500) {
    __publicField(this, "queue", []);
    __publicField(this, "isProcessing", false);
    this.processor = processor;
    this.delay = delay;
  }
  push(...item) {
    this.queue.push(...item);
    this.process();
  }
  /**
   * 立即清空队列中所有**尚未开始处理**的任务。
   * 注意：当前正在处理的任务会继续完成，不会被中断。
   */
  reset() {
    this.queue = [];
  }
  async process() {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }
    this.isProcessing = true;
    while (this.queue.length > 0) {
      const item = this.queue.shift();
      /* @__PURE__ */ (() => {
      })("this.queue", this.queue);
      let nextDelay = this.delay;
      try {
        const result = await this.processor(item);
        typeof result === "number" && (nextDelay = result);
      } catch (err) {
        console.error("Queue task error:", err);
      }
      await sleep(nextDelay);
    }
    this.isProcessing = false;
  }
}
const handleAddSign = (videoItem, watchStatus = "unwatched", position = "left") => {
  if (videoItem.tagContainer.classList.contains("watch-mark")) return;
  videoItem.tagContainer.classList.add("watch-mark", position, watchStatus);
  videoItem.tagContainer.dataset.key = videoItem.videoId;
};
class CacheWatchedStore {
  constructor() {
    // 储存名
    __publicField(this, "stoneName", "cacheWatched");
    // 存储的值
    __publicField(this, "watchedMapper", {});
  }
  /**
   * 判断当前 bvId 是否在缓存中
   */
  has(bvId) {
    if (!bvId.startsWith("BV1")) {
      return false;
    }
    const childStore = this.getChildStore(bvId);
    return childStore.includes(this.getBvIdValue(bvId));
  }
  /**
   * 添加当前 bvId 到缓存中
   */
  add(bvId) {
    if (!bvId.startsWith("BV1")) {
      return;
    }
    const watchedList = this.getChildStore(bvId);
    const saveValue = this.getBvIdValue(bvId);
    if (watchedList.includes(saveValue)) {
      return;
    }
    watchedList.push(saveValue);
    this.setChildStore(bvId, watchedList);
  }
  /**
   * 获取子存储
   */
  getChildStore(bvId) {
    const prevKey = this.getPrevKey(bvId);
    if (!this.watchedMapper[prevKey]) {
      this.watchedMapper[prevKey] = GM_getValue(`${this.stoneName}_${prevKey}`, []);
    }
    return this.watchedMapper[prevKey];
  }
  /**
   * 设置子存储
   */
  setChildStore(bvId, value) {
    const prevKey = this.getPrevKey(bvId);
    GM_setValue(`${this.stoneName}_${prevKey}`, value);
  }
  /**
   * 获取子存储的 key 值
   */
  getPrevKey(bvId) {
    return bvId.slice(3, 6);
  }
  /**
   * 获取 bvId 的值 (去除前缀 BV1 )
   */
  getBvIdValue(bvId) {
    return bvId.slice(3);
  }
}
const cacheWatchedStore = new CacheWatchedStore();
class CacheWatchedSessionStore {
  constructor() {
    __publicField(this, "stoneName", "cacheWatched");
    __publicField(this, "mapper", {});
  }
  getState(bvId) {
    return this.get()[bvId];
  }
  setState(bvId, value) {
    this.get()[bvId] = value;
    this.set(this.get());
  }
  set(value) {
    sessionStorage.setItem(this.stoneName, JSON.stringify(value));
  }
  get() {
    if (this.mapper) {
      return this.mapper;
    }
    const mapper = JSON.parse(sessionStorage.getItem(this.stoneName) || "{}");
    Object.assign(this.mapper, mapper);
    return this.mapper;
  }
}
const cacheWatchedSessionStore = new CacheWatchedSessionStore();
const handleVideoSign = async (item) => {
  item.position || (item.position = "left");
  if (item.videoId.startsWith("ep")) {
    handleAddSign(item, "ep", item.position);
    return Promise.resolve(0);
  }
  if (!item.container.contains(item.tagContainer)) {
    return Promise.resolve(0);
  }
  const watchStatus = cacheWatchedSessionStore.getState(item.videoId);
  if (watchStatus) {
    handleAddSign(item, watchStatus, item.position);
    /* @__PURE__ */ (() => {
    })("\u4ECE\u672C\u5730\u4F1A\u8BDD\u7F13\u5B58\u4E2D\u83B7\u53D6\u6536\u85CF\u72B6\u6001", item.videoId);
    return Promise.resolve(0);
  }
  if (cacheWatchedStore.has(item.videoId)) {
    handleAddSign(item, "watched", item.position);
    /* @__PURE__ */ (() => {
    })("\u4ECE\u7F13\u5B58\u4E2D\u83B7\u53D6\u6536\u85CF\u72B6\u6001", item.videoId);
    return Promise.resolve(0);
  }
  const isFavor = await api_isFavorVideo(item.videoId);
  const videoTag = isFavor ? "watched" : "unwatched";
  handleAddSign(item, videoTag, item.position);
  cacheWatchedSessionStore.setState(item.videoId, videoTag);
  if (isFavor) {
    cacheWatchedStore.add(item.videoId);
  }
  return Promise.resolve();
};
const videoSignProcessingQueue = new DelayedQueue(handleVideoSign, 500);
const createMutationObserver = (target, callback, options = { childList: true, attributes: true }) => {
  if (target.dataset.bindObserver) {
    return null;
  }
  const observer = new MutationObserver((records) => {
    for (let record of records) {
      for (let addedNode of record.addedNodes) {
        if (addedNode.nodeType !== Node.ELEMENT_NODE) continue;
        callback(addedNode);
      }
    }
  });
  observer.observe(target, options);
  target.dataset.bindObserver = "true";
  return observer;
};
const baseParser = (container, selectorList, config = {}) => {
  const {
    isAd = false,
    position = "left",
    isWatchLater = false
  } = config;
  const videoLink = container.querySelector(selectorList.videoLink);
  if (!videoLink) return null;
  let { href } = videoLink;
  if (isAd) {
    href = videoLink.dataset.targetUrl || "";
  }
  let videoId = getVideoId(href);
  if (isWatchLater) {
    videoId = new URL(href).searchParams.get("bvid");
  }
  if (!videoId) return null;
  const tagContainer = selectorList.tagContainer ? container.querySelector(selectorList.tagContainer) || container : container;
  return {
    container,
    videoId,
    tagContainer,
    position
  };
};
const baseVideoSignLoader = async (selectorList, parser, options = {}) => {
  options = {
    observe: true,
    elementGetter: true,
    throttle: false,
    ...options
  };
  try {
    await elementWaiter(selectorList.container, { delayPerSecond: 0 });
  } catch (e) {
    return null;
  }
  const observerList = [];
  const loadedContainerList = document.querySelectorAll(selectorList.container);
  for (let loadedContainer of loadedContainerList) {
    if (options.elementGetter || !(options.throttle && loadedContainer.dataset.bindObserver)) {
      const loadedItemList = Array.from(loadedContainer.querySelectorAll(selectorList.item)).map(parser);
      for (let loadedItem of loadedItemList) {
        if (!loadedItem) {
          continue;
        }
        if (cacheWatchedStore.has(loadedItem.videoId)) {
          handleAddSign(loadedItem, "watched", loadedItem.position);
          continue;
        }
        videoSignProcessingQueue.push(loadedItem);
      }
    }
    if (options.observe) {
      const observer = createMutationObserver(loadedContainer, (item) => {
        if (!item.closest(selectorList.item)) {
          return;
        }
        const loadedItem = parser(item);
        if (!loadedItem) {
          return;
        }
        if (cacheWatchedStore.has(loadedItem.videoId)) {
          handleAddSign(loadedItem, "watched", loadedItem.position);
          return;
        }
        videoSignProcessingQueue.push(loadedItem);
      });
      if (observer) {
        ObserverList.add(observer);
        observerList.push(observer);
      }
    }
  }
  return observerList;
};
class ObserverList {
  static get list() {
    return this.observerSet;
  }
  static get size() {
    return this.observerSet.size;
  }
  static reset() {
    this.remove(...Array.from(this.observerSet));
    /* @__PURE__ */ (() => {
    })("this.observerSet", this.observerSet);
  }
  static add(observer) {
    this.observerSet.add(observer);
    return observer;
  }
  static remove(...observers) {
    for (const observer of observers) {
      observer.disconnect();
      this.observerSet.delete(observer);
    }
  }
}
// 通用视频元素标记观察者列表
__publicField(ObserverList, "observerSet", /* @__PURE__ */ new Set());
const updatePageEvent = () => window.dispatchEvent(new Event("updatePage"));
const updateStatusEvent = () => window.dispatchEvent(new Event("updateStatus"));
class BindUpdatePageButton {
  static async base(containerSelector, buttonSelector, updateWay = "updatePage") {
    const container = await elementWaiter(containerSelector);
    if (container.dataset.bindUpdate) return;
    container.addEventListener("click", ({ target }) => {
      const element = target;
      if (element.closest(buttonSelector)) {
        updateWay === "updatePage" && updatePageEvent();
        updateWay === "updateStatus" && updateStatusEvent();
      }
    });
    container.dataset.bindUpdate = "true";
  }
  /**
   * 分页按钮触发的页面更新
   */
  static pagination() {
    return this.base(
      ".vui_pagenation--btns",
      ".vui_button"
    );
  }
  /**
   * 分页按钮触发的状态更新
   */
  static paginationWithStatus() {
    return this.base(
      ".vui_pagenation--btns",
      ".vui_button",
      "updateStatus"
    );
  }
  /**
   * 视频过滤器触发的页面更新
   */
  static filter() {
    return this.base(
      ".radio-filter",
      ".radio-filter__item"
    );
  }
  /**
   * UP主对应的动态
   */
  static upDynamic() {
    return this.base(
      ".bili-dyn-up-list__content",
      ".bili-dyn-up-list__item"
    );
  }
  /**
   * 侧边栏
   */
  static sidebar() {
    return this.base(
      ".side-nav",
      ".side-nav__item"
    );
  }
  /**
   * 稍后再看过滤器
   */
  static watchLaterFilter() {
    return this.base(
      ".list-header",
      ".list-header-filter__btn"
    );
  }
  /**
   * 首页刷新按钮
   */
  static indexRefresh() {
    return Promise.any([
      this.base(
        ".feed-roll-btn",
        ".feed-roll-btn"
      ),
      this.base(
        ".palette-button-wrap",
        ".flexible-roll-btn"
      )
    ]);
  }
}
const dynamicItemParser = (container) => {
  const referenceContainer = container.querySelector(
    ".bili-dyn-content__orig.reference:has(.bili-dyn-card-video)"
  );
  if (referenceContainer) {
    container = referenceContainer;
  }
  return baseParser(container, {
    tagContainer: ".bili-dyn-card-video",
    videoLink: ".bili-dyn-card-video"
  }) || baseParser(container, {
    tagContainer: ".bili-dyn-card-pgc",
    videoLink: ".bili-dyn-card-pgc"
  });
};
const handleDynamicPage = async () => {
  baseVideoSignLoader({
    container: ".bili-dyn-list__items",
    item: ".bili-dyn-list__item"
  }, dynamicItemParser);
  BindUpdatePageButton.upDynamic();
};
const elementGetter = (selector, container = document) => {
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject("timeout"), 2e4);
    const timer = setInterval(() => {
      const target = container.querySelector(selector);
      if (target) {
        clearInterval(timer);
        clearTimeout(timeout);
        resolve(target);
      }
    }, 100);
  });
};
const adVideoItemParser = (container) => {
  return baseParser(container, {
    tagContainer: ".vcd",
    videoLink: ".ad-report-inner"
  }, { isAd: true });
};
const nextPlayVideoItemParser = (container) => {
  return baseParser(container, {
    tagContainer: ".card-box",
    videoLink: ".framepreview-box > a"
  });
};
const operatorCardVideoItemParser = (container) => {
  return baseParser(container, {
    tagContainer: ".card-box",
    videoLink: ".framepreview-box > .box-a"
  });
};
const recommendVideoItemParser = (container) => {
  return baseParser(container, {
    tagContainer: "",
    videoLink: ".video-awesome-img"
  });
};
const albumItemParser = (container) => {
  const { key: bvId } = container.dataset;
  if (!bvId) return null;
  return {
    videoId: bvId,
    container,
    tagContainer: container
  };
};
const handleVideoPage = async () => {
  await elementGetter(".bpx-player-loading-panel:not(.bpx-state-loading)");
  baseVideoSignLoader({
    container: ".video-card-ad-small",
    item: ".video-card-ad-small-inner"
  }, adVideoItemParser, { observe: false });
  baseVideoSignLoader({
    container: ".next-play",
    item: ".video-page-card-small"
  }, nextPlayVideoItemParser, { observe: false });
  const albumSelectorList = {
    container: ".video-pod__list.section",
    item: ".video-pod__item.simple"
  };
  baseVideoSignLoader(albumSelectorList, albumItemParser, { observe: false });
  baseVideoSignLoader({
    container: ".rec-list",
    item: ".video-page-operator-card-small"
  }, operatorCardVideoItemParser, { observe: false });
  baseVideoSignLoader({
    container: ".rec-list",
    item: ".video-page-card-small"
  }, recommendVideoItemParser);
};
const handleSpaceDynamicPage = async () => {
  baseVideoSignLoader({
    container: ".bili-dyn-list__items",
    item: ".bili-dyn-list__item"
  }, dynamicItemParser);
  BindUpdatePageButton.sidebar();
};
const baseVideoCardParser = (container) => {
  return baseParser(container, {
    tagContainer: ".bili-video-card",
    videoLink: ".bili-video-card__cover > .bili-cover-card"
  });
};
const spaceIndexTopVideoCardParser = (container) => {
  return baseParser(container, {
    tagContainer: ".section-wrap__content",
    videoLink: ".bili-video-card__cover > .bili-cover-card"
  });
};
const handleSpaceIndexPage = async () => {
  const sectionWrap = await elementWaiter(".section-wrap");
  if (sectionWrap.classList.contains("top-section")) {
    baseVideoSignLoader({
      container: ".section-wrap.top-section",
      item: ".top-video"
    }, spaceIndexTopVideoCardParser);
  }
  baseVideoSignLoader({
    container: ".items",
    item: ".items__item"
  }, baseVideoCardParser);
  baseVideoSignLoader({
    container: ".items",
    item: ".bili-video-card"
  }, baseVideoCardParser);
  baseVideoSignLoader({
    container: ".video-list__content",
    item: ".video-list__item"
  }, baseVideoCardParser);
  BindUpdatePageButton.filter();
};
const handleSpaceVideoPage = async () => {
  baseVideoSignLoader(
    {
      container: ".video-body > .video-list",
      item: ".upload-video-card"
    },
    baseVideoCardParser,
    { observe: true }
  );
  BindUpdatePageButton.paginationWithStatus();
};
const handleSpaceAlbumListPage = async () => {
  baseVideoSignLoader({
    container: ".video-list",
    item: ".video-list__item"
  }, baseVideoCardParser);
};
const handleSpaceAlbumContentPage = async () => {
  baseVideoSignLoader({
    container: ".list-content",
    item: ".list-video-item"
  }, baseVideoCardParser);
  BindUpdatePageButton.pagination();
};
const handleSpaceFavListPage = async () => {
  const selectorList = {
    container: ".fav-list-main > .items",
    item: ".items__item"
  };
  const loadedContainer = await elementWaiter(selectorList.container, { delayPerSecond: 0 });
  const loadedItemList = Array.from(loadedContainer.querySelectorAll(selectorList.item)).map(baseVideoCardParser);
  for (let loadedItem of loadedItemList) {
    if (!loadedItem) {
      continue;
    }
    handleAddSign(loadedItem, "watched", loadedItem.position);
    cacheWatchedStore.add(loadedItem.videoId);
  }
  createMutationObserver(loadedContainer, (item) => {
    if (!item.closest(selectorList.item)) {
      return;
    }
    const loadedItem = baseVideoCardParser(item);
    if (!loadedItem) {
      return;
    }
    handleAddSign(loadedItem, "watched", loadedItem.position);
    cacheWatchedStore.add(loadedItem.videoId);
  });
};
const handleSpaceFollowCollectPage = async () => {
  const selectorList = {
    container: ".fav-list-main > .items",
    item: ".items__item"
  };
  baseVideoSignLoader(selectorList, baseVideoCardParser);
  BindUpdatePageButton.paginationWithStatus();
};
const indexBannerCardParser = (container) => baseParser(container, {
  tagContainer: ".carousel-area",
  videoLink: ".carousel-item"
});
const indexVideoCardParser = (container) => {
  return baseParser(container, {
    tagContainer: ".bili-video-card__wrap",
    videoLink: ".bili-video-card__image--link"
  }) || baseParser(container, {
    tagContainer: ".bili-video-card__wrap",
    videoLink: ".bili-video-card__image--link"
  }, { isAd: true });
};
const handleIndexPage = async () => {
  await sleep(500);
  baseVideoSignLoader({
    container: ".vui_carousel__slides",
    item: ".vui_carousel__slide"
  }, indexBannerCardParser, { observe: false });
  baseVideoSignLoader({
    container: ".recommended-container_floor-aside > .container",
    item: ".bili-feed-card"
  }, indexVideoCardParser);
  BindUpdatePageButton.indexRefresh();
};
const indexChildTypeBannerCardParser = (container) => baseParser(container, {
  tagContainer: ".banner-carousel__item",
  videoLink: ".cover-wrap"
});
const handleIndexChildPage = async () => {
  await elementGetter("#biliMainHeader[data-v-app]");
  baseVideoSignLoader({
    container: ".vui_carousel__slides",
    item: ".vui_carousel__slide"
  }, indexChildTypeBannerCardParser);
  baseVideoSignLoader({
    container: ".head-cards",
    item: ".feed-card.head-card"
  }, baseVideoCardParser);
  baseVideoSignLoader({
    container: ".feed-cards",
    item: ".feed-card"
  }, baseVideoCardParser);
};
const rankingVideoCardParser = (container) => baseParser(container, {
  tagContainer: "",
  videoLink: ".video-card__content > a"
});
const handlePopularPage = async () => {
  await elementGetter("#biliMainHeader[data-v-app]");
  baseVideoSignLoader({
    container: ".card-list",
    item: ".video-card"
  }, rankingVideoCardParser);
};
const handlePopularWeeklyPage = async () => {
  elementGetter("#biliMainHeader[data-v-app]");
  baseVideoSignLoader({
    container: ".video-list",
    item: ".video-card"
  }, rankingVideoCardParser);
};
const rankVideoCardParser = (container) => {
  const result = baseParser(container, {
    tagContainer: ".img",
    videoLink: ".img > a"
  });
  if (result) {
    result.position = "right";
  }
  return result;
};
const handlePopularRankPage = async () => {
  await elementGetter("#biliMainHeader[data-v-app]");
  await sleep(200);
  baseVideoSignLoader({
    container: ".rank-list",
    item: ".rank-item"
  }, rankVideoCardParser);
};
const watchLaterParser = (container) => baseParser(container, {
  tagContainer: ".video-card__left",
  videoLink: ".bili-video-card__cover > .bili-cover-card"
}, { isWatchLater: true });
const handleWatchLaterPage = async () => {
  baseVideoSignLoader({
    container: ".watchlater-list-container",
    item: ".video-card"
  }, watchLaterParser);
  BindUpdatePageButton.watchLaterFilter();
};
const searchVideoCardParser = (container) => {
  return baseParser(container, {
    tagContainer: ".bili-video-card",
    videoLink: 'a[data-mod="search-card"]'
  });
};
const handleSearchPage = async () => {
  await sleep(200);
  baseVideoSignLoader({
    container: ".user-video-info > .video-list",
    item: ".video-list-item"
  }, searchVideoCardParser, { observe: false });
  baseVideoSignLoader({
    container: ".search-all-list > .video-list",
    item: "div:has(> .bili-video-card)"
  }, searchVideoCardParser);
  baseVideoSignLoader({
    container: ".search-page-video > .video-list",
    item: "div:has(> .bili-video-card)"
  }, searchVideoCardParser);
};
const handleMapper = /* @__PURE__ */ new Map();
handleMapper.set(/^https:\/\/t\.bilibili\.com\/.*/, handleDynamicPage);
handleMapper.set(/^https:\/\/www\.bilibili\.com\/video.*/, handleVideoPage);
handleMapper.set(/^https:\/\/space\.bilibili\.com\/\d+\/upload\/video.*/, handleSpaceVideoPage);
handleMapper.set(/^https:\/\/space\.bilibili\.com\/\d+\/dynamic.*/, handleSpaceDynamicPage);
handleMapper.set(/^https:\/\/space\.bilibili\.com\/\d+\/lists\/\d+.*/, handleSpaceAlbumContentPage);
handleMapper.set(/^https:\/\/space\.bilibili\.com\/\d+\/lists.*/, handleSpaceAlbumListPage);
handleMapper.set(/^https:\/\/space\.bilibili\.com\/\d+\/favlist\?fid=\d+&ftype=create.*/, handleSpaceFavListPage);
handleMapper.set(/^https:\/\/space\.bilibili\.com\/\d+\/favlist\?fid=\d+&ftype=collect.*/, handleSpaceFollowCollectPage);
handleMapper.set(/^https:\/\/space\.bilibili\.com\/\d+.*/, handleSpaceIndexPage);
handleMapper.set(/^https:\/\/www\.bilibili\.com\/watchlater.*/, handleWatchLaterPage);
handleMapper.set(/^https:\/\/www\.bilibili\.com\/v\/popular\/weekly.*/, handlePopularWeeklyPage);
handleMapper.set(/^https:\/\/www\.bilibili\.com\/v\/popular\/rank.*/, handlePopularRankPage);
handleMapper.set(/^https:\/\/www\.bilibili\.com\/v\/popular\/(history|all).*/, handlePopularPage);
handleMapper.set(/^https:\/\/www\.bilibili\.com\/c.*/, handleIndexChildPage);
handleMapper.set(/^https:\/\/www\.bilibili\.com.*/, handleIndexPage);
handleMapper.set(/^https:\/\/search\.bilibili\.com.*/, handleSearchPage);
const getVideoSignHandler = () => {
  const url = window.location.href;
  const entry = Array.from(handleMapper.entries()).find(([reg, handle]) => {
    if (!reg.test(url)) {
      return false;
    }
    return handle;
  });
  if (!entry) return null;
  return entry[1];
};
async function freshListenerPushState(callback, delayPerSecond = 1) {
  let _pushState = window.history.pushState.bind(window.history);
  window.history.pushState = function() {
    setTimeout(callback, delayPerSecond * 1e3);
    return _pushState.apply(this, arguments);
  };
  window.addEventListener("updatePage", () => {
    setTimeout(callback, delayPerSecond * 1e3);
  });
  const originalReplaceState = history.replaceState;
  window.history.replaceState = function() {
    setTimeout(callback, delayPerSecond * 1e3);
    return originalReplaceState.apply(this, arguments);
  };
}
const updatePage = async () => {
  document.querySelectorAll(".watch-mark").forEach((item) => {
    item.classList.remove(
      "watch-mark",
      "left",
      "right",
      "watching",
      "watched",
      "same-watch",
      "unwatched",
      "ep"
    );
    item.dataset.key = "";
  });
  videoSignProcessingQueue.reset();
  ObserverList.reset();
  document.querySelectorAll("[data-bind-observer]").forEach((item) => item.dataset.bindObserver = "");
  await sleep(200);
  const videoSignHandler = getVideoSignHandler();
  videoSignHandler && videoSignHandler();
};
const main = async () => {
  addReadSignStyle();
  const videoSignHandler = getVideoSignHandler();
  videoSignHandler && videoSignHandler();
  freshListenerPushState(updatePage, 0);
  window.addEventListener("updateStatus", () => {
    videoSignProcessingQueue.reset();
  });
  document.addEventListener("mousedown", (e) => {
    if (![0, 1].includes(e.button)) {
      return;
    }
    const target = e.target;
    const videoItem = target.closest(".watch-mark.unwatched");
    if (videoItem) {
      videoItem.classList.remove("unwatched");
      videoItem.classList.add("watching");
      cacheWatchedSessionStore.setState(videoItem.dataset.key, "watching");
    }
  });
};
main().catch((error) => {
  console.error(error);
});
