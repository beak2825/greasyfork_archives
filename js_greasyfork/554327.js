// ==UserScript==
// @name        pixiv内容屏蔽器
// @namespace   http://tampermonkey.net/
// @license     GPL-3.0
// @version     1.2
// @author      byhgz
// @description 对pixiv大部分页面内容进行屏蔽处理，主要作用域相关插画、小说、漫画列表，排行榜中的插画、小说、漫画列表 评论处鼠标移入可显示屏蔽按钮，点击可根据需求添加类型屏蔽。
// @icon        https://static.hdslb.com/images/favicon.ico
// @noframes    
// @run-at      document-start
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_deleteValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @exclude     http://localhost:3001/
// @match       *://localhost/*
// @match       *://www.pixiv.net/*
// @require     https://unpkg.com/vue@2.7.16/dist/vue.min.js
// @require     https://unpkg.com/element-ui@2.15.14/lib/index.js
// @downloadURL https://update.greasyfork.org/scripts/554327/pixiv%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/554327/pixiv%E5%86%85%E5%AE%B9%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==
"use strict";
(function(Vue){'use strict';var __typeError$1 = (msg) => {
  throw TypeError(msg);
};
var __accessCheck$1 = (obj, member, msg) => member.has(obj) || __typeError$1("Cannot " + msg);
var __privateGet$1 = (obj, member, getter) => (__accessCheck$1(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd$1 = (obj, member, value) => member.has(obj) ? __typeError$1("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateMethod = (obj, member, method) => (__accessCheck$1(obj, member, "access private method"), method);
var _regularEvents, _callbackEvents, _EventEmitter_instances, handlePendingEvents_fn, executePreHandle_fn;
class EventEmitter {
  constructor() {
    __privateAdd$1(this, _EventEmitter_instances);
    __privateAdd$1(this, _regularEvents, {
      events: {},
      futures: {},
      parametersDebounce: {},
      preHandles: {}
    });
    __privateAdd$1(this, _callbackEvents, {
      events: {},
      callbackInterval: 1500
    });
  }
  on(eventName, callback, overrideEvents = false) {
    const events = __privateGet$1(this, _regularEvents).events;
    if (events[eventName]) {
      if (overrideEvents) {
        events[eventName] = callback;
        __privateMethod(this, _EventEmitter_instances, handlePendingEvents_fn).call(this, eventName, callback);
      }
      return this;
    }
    events[eventName] = callback;
    __privateMethod(this, _EventEmitter_instances, handlePendingEvents_fn).call(this, eventName, callback);
    return this;
  }
  onPreHandle(eventName, callback) {
    const preHandles = __privateGet$1(this, _regularEvents).preHandles;
    preHandles[eventName] = callback;
    return this;
  }
  handler(eventName, callback) {
    const handlerEvents = __privateGet$1(this, _callbackEvents).events;
    if (handlerEvents[eventName]) {
      throw new Error("该事件名已经存在，请更换事件名");
    }
    handlerEvents[eventName] = callback;
  }
  invoke(eventName, ...data) {
    return new Promise((resolve) => {
      const handlerEvents = __privateGet$1(this, _callbackEvents).events;
      if (handlerEvents[eventName]) {
        resolve(handlerEvents[eventName](...data));
        return;
      }
      const i1 = setInterval(() => {
        if (handlerEvents[eventName]) {
          clearInterval(i1);
          resolve(handlerEvents[eventName](...data));
        }
      }, __privateGet$1(this, _callbackEvents).callbackInterval);
    });
  }
  send(eventName, ...data) {
    const ordinaryEvents = __privateGet$1(this, _regularEvents);
    const events = ordinaryEvents.events;
    const event = events[eventName];
    if (event) {
      const preHandleData = __privateMethod(this, _EventEmitter_instances, executePreHandle_fn).call(this, eventName, data);
      event.apply(null, preHandleData);
      return this;
    }
    const futures = ordinaryEvents.futures;
    if (futures[eventName]) {
      futures[eventName].push(data);
      return this;
    }
    futures[eventName] = [];
    futures[eventName].push(data);
    return this;
  }
  sendDebounce(eventName, ...data) {
    const parametersDebounce = __privateGet$1(this, _regularEvents).parametersDebounce;
    let timeOutConfig = parametersDebounce[eventName];
    if (timeOutConfig) {
      clearTimeout(timeOutConfig.timeOut);
      timeOutConfig.timeOut = null;
    } else {
      timeOutConfig = parametersDebounce[eventName] = { wait: 1500, timeOut: null };
    }
    timeOutConfig.timeOut = setTimeout(() => {
      this.send(eventName, ...data);
    }, timeOutConfig.wait);
    return this;
  }
  setDebounceWaitTime(eventName, wait) {
    const timeOutConfig = __privateGet$1(this, _regularEvents).parametersDebounce[eventName];
    if (timeOutConfig) {
      timeOutConfig.wait = wait;
    } else {
      __privateGet$1(this, _regularEvents).parametersDebounce[eventName] = {
        wait,
        timeOut: null
      };
    }
    return this;
  }
  emit(eventName, ...data) {
    const callback = __privateGet$1(this, _regularEvents).events[eventName];
    if (callback) {
      callback.apply(null, data);
    }
    return this;
  }
  off(eventName) {
    const events = __privateGet$1(this, _regularEvents).events;
    if (events[eventName]) {
      delete events[eventName];
      return true;
    }
    const handlerEvents = __privateGet$1(this, _callbackEvents).events;
    if (handlerEvents[eventName]) {
      delete handlerEvents[eventName];
      return true;
    }
    return false;
  }
  setInvokeInterval(interval) {
    __privateGet$1(this, _callbackEvents).callbackInterval = interval;
  }
  getEvents() {
    return {
      regularEvents: __privateGet$1(this, _regularEvents),
      callbackEvents: __privateGet$1(this, _callbackEvents)
    };
  }
}
_regularEvents = new WeakMap();
_callbackEvents = new WeakMap();
_EventEmitter_instances = new WeakSet();
handlePendingEvents_fn = function(eventName, callback) {
  const futureEvents = __privateGet$1(this, _regularEvents).futures;
  if (futureEvents[eventName]) {
    for (const eventData of futureEvents[eventName]) {
      const preHandleData = __privateMethod(this, _EventEmitter_instances, executePreHandle_fn).call(this, eventName, eventData);
      callback.apply(null, preHandleData);
    }
    delete futureEvents[eventName];
  }
};
executePreHandle_fn = function(eventName, data) {
  const preHandles = __privateGet$1(this, _regularEvents).preHandles;
  const callback = preHandles[eventName];
  if (callback) {
    return callback.apply(null, data);
  }
  return data;
};
const eventEmitter = new EventEmitter();GM_registerMenuCommand("主面板", () => {
  eventEmitter.send("主面板开关");
}, "Q");var defUtil = {
  debounce(func, wait = 1e3) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },
  toTimeString() {
    return ( new Date()).toLocaleString();
  },
  initVueApp(el, App, props = {}) {
    return new Vue({
      render: (h) => h(App, { props })
    }).$mount(el);
  },
  handleFileReader(event) {
    return new Promise((resolve, reject) => {
      const file = event.target.files[0];
      if (!file) {
        reject("未读取到文件");
        return;
      }
      let reader = new FileReader();
      reader.onload = (e) => {
        const fileContent = e.target.result;
        resolve({ file, content: fileContent });
        reader = null;
      };
      reader.readAsText(file);
    });
  },
  saveTextAsFile(text, filename = "data.txt") {
    const blob = new Blob([text], { type: "text/plain" });
    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    setTimeout(() => {
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(downloadLink.href);
    }, 100);
  }
};const getDrawerShortcutKeyGm = () => {
  return GM_getValue("drawer_shortcut_key_gm", "`");
};var script$e = {
  data() {
    return {
      drawerShortcutKeyVal: getDrawerShortcutKeyGm(),
      theKeyPressedKeyVal: ""
    };
  },
  methods: {
    setDrawerShortcutKeyBut() {
      const theKeyPressedKey = this.theKeyPressedKeyVal;
      const drawerShortcutKey = this.drawerShortcutKeyVal;
      if (drawerShortcutKey === theKeyPressedKey) {
        this.$message("不需要重复设置");
        return;
      }
      GM_setValue("drawer_shortcut_key_gm", theKeyPressedKey);
      this.$notify({ message: "已设置打开关闭主面板快捷键", type: "success" });
      this.drawerShortcutKeyVal = theKeyPressedKey;
    }
  },
  created() {
    eventEmitter.on("event-keydownEvent", (event) => {
      this.theKeyPressedKeyVal = event.key;
    });
  }
};function normalizeComponent(template, style, script, scopeId, isFunctionalTemplate, moduleIdentifier , shadowMode, createInjector, createInjectorSSR, createInjectorShadow) {
    const options = typeof script === 'function' ? script.options : script;
    if (template && template.render) {
        options.render = template.render;
        options.staticRenderFns = template.staticRenderFns;
        options._compiled = true;
    }
    return script;
}
const __vue_script__$e = script$e;
var __vue_render__$e = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('span',[_vm._v("快捷键")])]},proxy:true}])},[_vm._v(" "),_c('div',[_vm._v("1.默认情况下，按键盘tab键上的~键为展开关闭主面板")]),_vm._v(" "),_c('div',[_vm._v("2.当前展开关闭主面板快捷键：\n      "),_c('el-tag',[_vm._v(_vm._s(_vm.drawerShortcutKeyVal))])],1),_vm._v("\n    当前按下的键\n    "),_c('el-tag',[_vm._v(_vm._s(_vm.theKeyPressedKeyVal))]),_vm._v(" "),_c('el-button',{on:{"click":_vm.setDrawerShortcutKeyBut}},[_vm._v("设置打开关闭主面板快捷键")])],1)],1)};
var __vue_staticRenderFns__$e = [];
  const __vue_inject_styles__$e = undefined;
  const __vue_component__$e = normalizeComponent(
    { render: __vue_render__$e, staticRenderFns: __vue_staticRenderFns__$e },
    __vue_inject_styles__$e,
    __vue_script__$e);var script$d = {
  data() {
    return {
      visible: false,
      optionsList: [],
      dialogTitle: "",
      optionsClick: null,
      closeOnClickModal: true,
      contents: []
    };
  },
  methods: {
    handleClose() {
      this.visible = false;
      if (this.contents.length > 0) {
        this.contents = [];
      }
    },
    handleOptionsClick(item) {
      if (this.closeOnClickModal) {
        return;
      }
      let tempBool;
      const temp = this.optionsClick(item);
      if (temp === void 0) {
        tempBool = false;
      } else {
        tempBool = temp;
      }
      this.visible = tempBool === true;
    }
  },
  created() {
    eventEmitter.on("sheet-dialog", ({
      list,
      optionsClick,
      title = "选项",
      closeOnClickModal = false,
      contents
    }) => {
      this.visible = true;
      this.optionsList = list;
      this.dialogTitle = title;
      this.optionsClick = optionsClick;
      this.closeOnClickModal = closeOnClickModal;
      if (contents) {
        this.contents = contents;
      }
    });
  }
};
const __vue_script__$d = script$d;
var __vue_render__$d = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-dialog',{attrs:{"close-on-click-modal":_vm.closeOnClickModal,"title":_vm.dialogTitle,"visible":_vm.visible,"center":"","width":"30%"},on:{"close":_vm.handleClose}},[_c('div',[_c('el-row',[_c('el-col',_vm._l((_vm.contents),function(v){return _c('div',{key:v},[_vm._v(_vm._s(v))])}),0),_vm._v(" "),_vm._l((_vm.optionsList),function(item){return _c('el-col',{key:item.label},[_c('el-button',{staticStyle:{"width":"100%"},attrs:{"title":item.title},on:{"click":function($event){return _vm.handleOptionsClick(item)}}},[_vm._v(_vm._s(item.label)+"\n          ")])],1)})],2)],1)])],1)};
var __vue_staticRenderFns__$d = [];
  const __vue_inject_styles__$d = undefined;
  const __vue_component__$d = normalizeComponent(
    { render: __vue_render__$d, staticRenderFns: __vue_staticRenderFns__$d },
    __vue_inject_styles__$d,
    __vue_script__$d);const isDOMElement = (obj) => {
  return obj !== null && typeof obj === "object" && "nodeType" in obj;
};
const inProgressCache =  new Map();
const validationElFun = (config, selector) => {
  const element = config.doc.querySelector(selector);
  if (element === null)
    return null;
  return config.parseShadowRoot && element.shadowRoot ? element.shadowRoot : element;
};
const __privateValidationElFun = (config, selector) => {
  const result = config.validationElFun(config, selector);
  return isDOMElement(result) ? result : null;
};
const findElement = async (selector, config = {}) => {
  const defConfig = {
    doc: document,
    interval: 1e3,
    timeout: -1,
    parseShadowRoot: false,
    cacheInProgress: true,
    validationElFun
  };
  config = { ...defConfig, ...config };
  const result = __privateValidationElFun(config, selector);
  if (result !== null)
    return result;
  const cacheKey = `findElement:${selector}`;
  if (config.cacheInProgress) {
    const cachedPromise = inProgressCache.get(cacheKey);
    if (cachedPromise) {
      return cachedPromise;
    }
  }
  const p = new Promise((resolve) => {
    let timeoutId, IntervalId;
    IntervalId = setInterval(() => {
      const result2 = __privateValidationElFun(config, selector);
      if (result2 === null)
        return;
      resolve(result2);
    }, config.interval);
    const cleanup = () => {
      if (IntervalId)
        clearInterval(IntervalId);
      if (timeoutId)
        clearTimeout(timeoutId);
      if (config.cacheInProgress) {
        inProgressCache.delete(cacheKey);
      }
    };
    if (config.timeout > 0) {
      timeoutId = setTimeout(() => {
        resolve(null);
        cleanup();
      }, config.timeout);
    }
  });
  if (config.cacheInProgress) {
    inProgressCache.set(cacheKey, p);
  }
  return p;
};
const findElements = async (selector, config = {}) => {
  const defConfig = { doc: document, interval: 1e3, timeout: -1, parseShadowRoot: false };
  config = { ...defConfig, ...config };
  return new Promise((resolve) => {
    const i1 = setInterval(() => {
      const els = config.doc.querySelectorAll(selector);
      if (els.length > 0) {
        const list = [];
        for (const el of els) {
          if (config.parseShadowRoot) {
            const shadowRoot = el?.shadowRoot;
            list.push(shadowRoot ? shadowRoot : el);
            continue;
          }
          list.push(el);
        }
        resolve(list);
        clearInterval(i1);
      }
    }, config.interval);
    if (config.timeout > 0) {
      setTimeout(() => {
        clearInterval(i1);
        resolve([]);
      }, config.timeout);
    }
  });
};
const updateCssVModal = () => {
  const styleEl = document.createElement("style");
  styleEl.innerHTML = `.v-modal  {
    z-index: auto !important;
}`;
  document.head.appendChild(styleEl);
};
const createVueDiv = (el = null, cssTests = null) => {
  const panelDiv = document.createElement("div");
  if (cssTests !== null) {
    panelDiv.style.cssText = cssTests;
  }
  const vueDiv = document.createElement("div");
  panelDiv.appendChild(vueDiv);
  if (el !== null) {
    el.appendChild(panelDiv);
  }
  return { panelDiv, vueDiv };
};
var elUtil = {
  findElement,
  isDOMElement,
  findElements,
  updateCssVModal,
  createVueDiv
};var urlUtil = {
  getUrlUid(url) {
    const match = url.match(/^https:\/\/www.pixiv.net\/users\/(\d+)/)?.[1];
    if (match === void 0) {
      return -1;
    }
    return parseInt(match);
  },
  parseUrl(urlString) {
    const url = new URL(urlString);
    const pathSegments = url.pathname.split("/").filter((segment) => segment !== "");
    const searchParams = new URLSearchParams(url.search.slice(1));
    const queryParams = {};
    for (const [key, value] of searchParams.entries()) {
      queryParams[key] = value;
    }
    return {
      protocol: url.protocol,
      hostname: url.hostname,
      port: url.port,
      pathname: url.pathname,
      pathSegments,
      search: url.search,
      queryParams,
      hash: url.hash
    };
  }
};var ruleMatchingUtil = {
  exactMatch(ruleList, value) {
    if (ruleList === null || ruleList === void 0)
      return false;
    if (!Array.isArray(ruleList))
      return false;
    return ruleList.some((item) => item === value);
  },
  regexMatch(ruleList, value) {
    if (ruleList === null || ruleList === void 0)
      return null;
    if (!Array.isArray(ruleList))
      return null;
    const find = ruleList.find((item) => {
      try {
        return value.search(item) !== -1;
      } catch (e) {
        return false;
      }
    });
    return find === void 0 ? null : find;
  },
  fuzzyMatch(ruleList, value) {
    if (ruleList === null || ruleList === void 0 || value === null)
      return null;
    if (!Array.isArray(ruleList))
      return null;
    const find = ruleList.find((item) => value.includes(item));
    return find === void 0 ? null : find;
  }
};unsafeWindow.mk_win = window;
const returnTempVal = { state: false };
Promise.reject();
var globalValue = {
  group_url: "http://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=tFU0xLt1uO5u5CXI2ktQRLh_XGAHBl7C&authKey=KAf4rICQYjfYUi66WelJAGhYtbJLILVWumOm%2BO9nM5fNaaVuF9Iiw3dJoPsVRUak&noverify=0&group_code=876295632",
  b_url: "https://space.bilibili.com/473239155",
  scriptCat_js_url: "https://scriptcat.org/zh-CN/script-show-page/4523",
  greasyfork_js_url: "https://greasyfork.org/zh-CN/scripts/554327",
  github_url: "https://github.com/hgztask/mkPixivContentShield",
  update_log_url: "https://docs.qq.com/doc/DSnhjSVZmRkpCd0Nj"
};const blockExactAndFuzzyMatching = (val, config) => {
  if (!val)
    return returnTempVal;
  const { exactKey, exactTypeName, fuzzyKey, fuzzyTypeName, regexKey, regexTypeName } = config;
  let matching;
  if (exactKey) {
    if (ruleMatchingUtil.exactMatch(GM_getValue(exactKey, []), val)) {
      return { state: true, type: exactTypeName, matching: val };
    }
  }
  if (fuzzyKey) {
    matching = ruleMatchingUtil.fuzzyMatch(GM_getValue(fuzzyKey, []), val);
    if (matching) {
      return { state: true, type: fuzzyTypeName, matching };
    }
  }
  if (regexKey) {
    matching = ruleMatchingUtil.regexMatch(GM_getValue(regexKey, []), val);
    if (matching) {
      return { state: true, type: regexTypeName, matching };
    }
  }
  return returnTempVal;
};
const blockUserName = (name) => {
  return blockExactAndFuzzyMatching(name, {
    exactKey: "username_precise",
    exactTypeName: "精确用户名",
    fuzzyKey: "username",
    fuzzyTypeName: "模糊用户名",
    regexKey: "username_regex",
    regexTypeName: "正则用户名"
  });
};
const blockUserId = (id) => {
  if (ruleMatchingUtil.exactMatch(GM_getValue("userId_precise", []), id)) {
    return { state: true, type: "精确用户id", matching: id };
  }
  return returnTempVal;
};
const shieldingItem = (itemData) => {
  let res = blockUserId(itemData.userId);
  if (res.state)
    return res;
  const { userName } = itemData;
  if (userName) {
    res = blockUserName(userName);
  }
  if (res.state)
    return res;
  if (res.state)
    return res;
  return returnTempVal;
};
const shieldingItemDecorated = (list) => {
  for (const itemData of list) {
    const testResults = shieldingItem(itemData);
    const { state, type, matching } = testResults;
    if (state) {
      const { el, userName } = itemData;
      el.remove();
      eventEmitter.send("event:print-msg", `${type}规则【${matching}】屏蔽${userName}作品`);
      continue;
    }
    eventEmitter.emit("event:插入屏蔽按钮", itemData);
  }
};
eventEmitter.on("event:插入屏蔽按钮", (itemData) => {
  const { insertionPositionEl, el } = itemData;
  let but = el.querySelector("button[gz_type]");
  if (but !== null)
    return;
  but = document.createElement("button");
  but.setAttribute("gz_type", "");
  but.textContent = "屏蔽";
  but.addEventListener("click", (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();
    eventEmitter.emit("event:mask_options_dialog_box", itemData);
  });
  insertionPositionEl.appendChild(but);
  let explicitSubjectEl = itemData?.explicitSubjectEl;
  if (explicitSubjectEl === void 0) {
    explicitSubjectEl = el;
  }
  if (insertionPositionEl) {
    but.style.display = "none";
    explicitSubjectEl.addEventListener("mouseout", () => but.style.display = "none");
    explicitSubjectEl.addEventListener("mouseover", () => but.style.display = "");
  }
});
var shielding = {
  shieldingItem,
  shieldingItemDecorated
};var __defProp = Object.defineProperty;
var __typeError = (msg) => {
  throw TypeError(msg);
};
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, key + "" , value);
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), member.set(obj, value), value);
var _intervalExecutorList, _interval, _func, _config, _statusObj, _keyIntervalName;
const _IntervalExecutor = class _IntervalExecutor {
  constructor(func, config) {
    __privateAdd(this, _interval, null);
    __privateAdd(this, _func);
    __privateAdd(this, _config);
    __privateAdd(this, _statusObj, {});
    __privateAdd(this, _keyIntervalName, "");
    __publicField(this, "getKeyIntervalName", () => {
      return __privateGet(this, _keyIntervalName);
    });
    if (config === void 0) {
      throw new Error("请传入配置项");
    }
    const defConfig = { timeout: 1500, processTips: false, intervalName: null };
    __privateSet(this, _config, Object.assign(defConfig, config));
    if (__privateGet(this, _config).intervalName === null) {
      throw new Error("请设置间隔名称");
    }
    __privateSet(this, _func, func);
    const intervalName = __privateGet(this, _config).intervalName;
    const intervalExecutorList = __privateGet(_IntervalExecutor, _intervalExecutorList);
    const index = intervalExecutorList.length + 1;
    __privateSet(this, _keyIntervalName, `${intervalName}_${index}`);
    __privateSet(this, _statusObj, { status: false, key: __privateGet(this, _keyIntervalName), name: __privateGet(this, _config).intervalName });
    intervalExecutorList.push(this);
  }
  static setIntervalExecutorStatus(keyIntervalName, status) {
    const find = __privateGet(_IntervalExecutor, _intervalExecutorList).find((item) => item.getKeyIntervalName() === keyIntervalName);
    if (find === void 0)
      return;
    if (status) {
      find.start();
    } else {
      find.stop();
    }
  }
  stop(msg) {
    const i = __privateGet(this, _interval);
    if (i === null)
      return;
    clearInterval(i);
    __privateSet(this, _interval, null);
    const processTips = __privateGet(this, _config).processTips;
    const intervalName = __privateGet(this, _config).intervalName;
    if (msg) {
      console.log(`stop:手动停止${intervalName}，原因${msg}`);
    }
    if (processTips) {
      console.log(`stop:检测${intervalName}间隔执行器`);
    }
    __privateGet(this, _statusObj).status = false;
    eventEmitter.send("event:update:intervalExecutorStatus", __privateGet(this, _statusObj));
  }
  setTimeout(timeout) {
    __privateGet(this, _config).timeout = timeout;
  }
  start() {
    if (__privateGet(this, _interval) !== null)
      return;
    __privateGet(this, _statusObj).status = true;
    __privateSet(this, _interval, setInterval(__privateGet(this, _func), __privateGet(this, _config).timeout));
    const processTips = __privateGet(this, _config).processTips;
    if (processTips) {
      console.log(`start:检测${__privateGet(this, _config).intervalName}间隔执行器`);
    }
    eventEmitter.send("event:update:intervalExecutorStatus", __privateGet(this, _statusObj));
  }
};
_intervalExecutorList = new WeakMap();
_interval = new WeakMap();
_func = new WeakMap();
_config = new WeakMap();
_statusObj = new WeakMap();
_keyIntervalName = new WeakMap();
__privateAdd(_IntervalExecutor, _intervalExecutorList, []);
let IntervalExecutor = _IntervalExecutor;const getCommentList = async () => {
  const els = await elUtil.findElements('section ul[class^="CommentList"]>li');
  const list = [];
  for (const el of els) {
    const userAEl = el.querySelector('a[href^="/users/"]');
    const insertionPositionEl = el.querySelector("div.sc-3ebdb5af-2");
    const commentEl = el.querySelector("p");
    let comment = null;
    const userName = userAEl.getAttribute("data-user_name");
    const userUrl = userAEl.href;
    const userId = urlUtil.getUrlUid(userUrl);
    if (commentEl) {
      comment = commentEl.textContent.trim();
    }
    if (insertionPositionEl === null) {
      console.error("未找到插入位置元素", el);
      continue;
    }
    list.push({ comment, insertionPositionEl, userName, userId, el, userUrl });
  }
  return list;
};
var artworksPage = {
  isThisPage(url) {
    return url.includes("//www.pixiv.net/artworks/");
  },
  intervalCheckCommentListExecutor: new IntervalExecutor(async () => {
    const list = await getCommentList();
    shielding.shieldingItemDecorated(list);
  }, { processTips: true, intervalName: "评论列表" }),
  getAuthorInfo() {
    const el = document.querySelector('aside>section a[href^="/users"]>div[title]');
    if (el === null)
      return null;
    const userAEl = el.parentElement;
    const userName = el.getAttribute("title");
    const userUrl = userAEl.href;
    const userId = urlUtil.getUrlUid(userUrl);
    return { userName, userUrl, userId };
  }
};var usersPage = {
  getUserInfo() {
    const nameEl = document.querySelector("h1.sc-1740e64f-5");
    if (nameEl === null) {
      return null;
    }
    const userUrl = location.href;
    const userId = urlUtil.getUrlUid(userUrl);
    return { userName: nameEl.textContent, userId, userUrl };
  },
  isThisPage(url) {
    return url.includes("//www.pixiv.net/users/");
  }
};var script$c = {
  data() {
    return {
      blockUserButShow: false
    };
  },
  methods: {
    handleMouseEnter() {
      const divRef = this.$refs.divRef;
      divRef.style.transform = "translateX(0)";
    },
    handleMouseLeave() {
      const divRef = this.$refs.divRef;
      divRef.style.transform = "translateX(80%)";
    },
    blockUserBut() {
      let authorInfo = artworksPage.getAuthorInfo();
      if (authorInfo === null) {
        authorInfo = usersPage.getUserInfo();
      }
      if (authorInfo === null) {
        this.$message.error("获取作者信息失败，未找到作者信息");
        return;
      }
      eventEmitter.emit("event:mask_options_dialog_box", authorInfo);
    }
  },
  created() {
    eventEmitter.on("event:right_sidebar_show", (show) => {
      this.blockUserButShow = show;
    });
  }
};
const __vue_script__$c = script$c;
var __vue_render__$c = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{ref:"divRef",staticStyle:{"position":"fixed","right":"0","top":"15%","transition":"transform 0.5s","transform":"translateX(80%)"},on:{"mouseenter":_vm.handleMouseEnter,"mouseleave":_vm.handleMouseLeave}},[_c('el-button',{directives:[{name:"show",rawName:"v-show",value:(_vm.blockUserButShow),expression:"blockUserButShow"}],on:{"click":_vm.blockUserBut}},[_vm._v("屏蔽用户")])],1)};
var __vue_staticRenderFns__$c = [];
  const __vue_inject_styles__$c = undefined;
  const __vue_component__$c = normalizeComponent(
    { render: __vue_render__$c, staticRenderFns: __vue_staticRenderFns__$c },
    __vue_inject_styles__$c,
    __vue_script__$c);var ruleKeyDataList = [
  {
    "name": "用户名",
    "key": "username",
    "pattern": "模糊",
    "fullName": "模糊用户名"
  },
  {
    "name": "用户名",
    "key": "username_precise",
    "pattern": "精确",
    "fullName": "精确用户名"
  },
  {
    "name": "用户名",
    "key": "username_regex",
    "pattern": "正则",
    "fullName": "正则用户名"
  },
  {
    "name": "用户id",
    "key": "userId_precise",
    "pattern": "精确",
    "fullName": "精确用户id"
  }
];const verificationInputValue = (ruleValue, type) => {
  if (ruleValue === null)
    return { status: false, res: "内容不能为空" };
  if (type === "userId_precise") {
    ruleValue = parseInt(ruleValue);
    if (isNaN(ruleValue)) {
      return { status: false, res: "请输入数字！" };
    }
  } else {
    typeof ruleValue === "string" && (ruleValue = ruleValue.trim());
  }
  if (ruleValue === "") {
    return { status: false, res: "内容不能为空" };
  }
  return { status: true, res: ruleValue };
};
const addRule = (ruleValue, type) => {
  const verificationRes = verificationInputValue(ruleValue, type);
  if (!verificationRes.status) {
    return verificationRes;
  }
  const arr = GM_getValue(type, []);
  if (arr.includes(verificationRes.res)) {
    return { status: false, res: "已存在此内容" };
  }
  arr.push(verificationRes.res);
  GM_setValue(type, arr);
  return { status: true, res: "添加成功" };
};
const delRule = (type, value) => {
  const verificationRes = verificationInputValue(value, type);
  if (!verificationRes.status) {
    return verificationRes;
  }
  const res = verificationRes.res;
  const arr = GM_getValue(type, []);
  const indexOf = arr.indexOf(res);
  if (indexOf === -1) {
    return { status: false, res: "不存在此内容" };
  }
  arr.splice(indexOf, 1);
  GM_setValue(type, arr);
  return { status: true, res: "移除成功" };
};
const verificationRuleMap = (content) => {
  let parse;
  try {
    parse = JSON.parse(content);
  } catch (e) {
    alert("规则内容有误");
    return null;
  }
  const newRule = {};
  for (const key in parse) {
    if (!Array.isArray(parse[key])) {
      continue;
    }
    if (parse[key].length === 0) {
      continue;
    }
    newRule[key] = parse[key];
  }
  if (Object.keys(newRule).length === 0) {
    alert("规则内容为空");
    return null;
  }
  return newRule;
};
const addItemRule = (arr, key, coverage = true) => {
  const complianceList = [];
  for (let v of arr) {
    const { status, res } = verificationInputValue(v, key);
    if (!status)
      return { status: false, msg: `内容中有误:${res}` };
    complianceList.push(v);
  }
  if (coverage) {
    GM_setValue(key, complianceList);
    return { status: true, msg: `添加成功-覆盖模式，数量：${complianceList.length}` };
  }
  const oldArr = GM_getValue(key, []);
  const newList = complianceList.filter((item) => !oldArr.includes(item));
  if (newList.length === 0) {
    return { status: false, msg: "内容重复" };
  }
  GM_setValue(key, oldArr.concat(newList));
  return { status: true, msg: "添加成功-追加模式，新增数量：" + newList.length };
};
var ruleUtil = {
  addRule,
  batchAddRule(ruleValues, type) {
    const successList = [];
    const failList = [];
    const arr = GM_getValue(type, []);
    const isUidType = type.includes("userId_precise");
    for (let v of ruleValues) {
      if (isUidType) {
        if (typeof v !== "string" && typeof v !== "number") {
          failList.push(v);
          continue;
        }
        if (Number.isNaN(v)) {
          failList.push(v);
          continue;
        }
        if (arr.includes(v)) {
          failList.push(v);
          continue;
        }
        arr.push(v);
        successList.push(v);
      } else {
        if (arr.includes(v)) {
          failList.push(v);
          continue;
        }
        arr.push(v);
        successList.push(v);
      }
    }
    if (successList.length > 0) {
      GM_setValue(type, arr);
    }
    return {
      successList,
      failList
    };
  },
  async showDelRuleInput(type) {
    let ruleValue;
    try {
      const { value } = await eventEmitter.invoke("el-prompt", "请输入要删除的规则内容", "删除指定规则");
      ruleValue = value;
    } catch (e) {
      return;
    }
    const { status, res } = delRule(type, ruleValue);
    eventEmitter.send("el-msg", res);
    status && eventEmitter.emit("刷新规则信息", false);
  },
  getRuleContent(isToStr = true, space = 0) {
    const ruleMap = {};
    for (let ruleKeyListDatum of ruleKeyDataList) {
      const key = ruleKeyListDatum.key;
      const data = GM_getValue(key, []);
      if (data.length === 0)
        continue;
      ruleMap[key] = data;
    }
    if (isToStr) {
      return JSON.stringify(ruleMap, null, space);
    }
    return ruleMap;
  },
  overwriteImportRules(content) {
    const map = verificationRuleMap(content);
    if (map === null)
      return false;
    for (let key of Object.keys(map)) {
      const arr = map[key];
      GM_setValue(key, arr);
    }
    return true;
  },
  appendImportRules(content) {
    const map = verificationRuleMap(content);
    if (map === null)
      return false;
    for (let key of Object.keys(map)) {
      const arr = GM_getValue(key, []);
      for (let item of map[key]) {
        if (!arr.includes(item)) {
          arr.push(item);
        }
      }
      GM_setValue(key, arr);
    }
    return true;
  },
  addRulePreciseUserId(userId, isTip = true) {
    const results = addRule(userId, "userId_precise");
    if (isTip) {
      eventEmitter.send("el-notify", {
        title: "添加精确用户id操作提示",
        message: results.res,
        type: "success"
      });
      return results;
    }
    return results;
  },
  addRulePreciseName(name, tip = true) {
    const results = addRule(name, "precise_name");
    if (tip) {
      eventEmitter.send("el-msg", results.res);
    }
    return results;
  },
  delRUlePreciseUserId(userId, isTip = true) {
    const results = delRule("userId_precise", userId);
    if (isTip) {
      eventEmitter.send("el-alert", results.res);
      return null;
    }
    return results;
  },
  findRuleItemValue(type, value) {
    return GM_getValue(type, []).find((item) => item === value) || null;
  },
  addItemRule,
  addPreciseUserIdItemRule(userIdArr, isTip = true, coverage = true) {
    const { status, msg } = addItemRule(userIdArr, "userId_precise", coverage);
    if (isTip) {
      eventEmitter.send("el-alert", msg);
      return status;
    }
    return { status, msg };
  }
};var script$b = {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    ruleInfo: {
      type: Object,
      default: () => {
        return {
          key: "ruleInfo默认key值",
          name: "ruleInfo默认name值"
        };
      }
    }
  },
  data() {
    return {
      dialogTitle: "",
      dialogVisible: false,
      inputVal: "",
      fragments: [],
      separator: ",",
      successAfterCloseVal: true
    };
  },
  methods: {
    closeHandle() {
      this.inputVal = "";
    },
    addBut() {
      if (this.fragments.length === 0) {
        this.$message.warning("未有分割项，请输入");
        return;
      }
      const { successList, failList } = ruleUtil.batchAddRule(this.fragments, this.ruleInfo.key);
      this.$alert(`成功项${successList.length}个:${successList.join(this.separator)}
                失败项${failList.length}个:${failList.join(this.separator)}
                `, "tip");
      if (successList.length > 0) {
        eventEmitter.emit("event:刷新规则信息", false);
      }
      if (successList.length > 0 && this.successAfterCloseVal) {
        this.dialogVisible = false;
      }
    }
  },
  watch: {
    dialogVisible(val) {
      this.$emit("input", val);
    },
    value(val) {
      this.dialogVisible = val;
    },
    inputVal(val) {
      const list = [];
      for (let s of val.split(this.separator)) {
        if (s === "") continue;
        if (list.includes(s)) continue;
        s = s.trim();
        list.push(s);
      }
      this.fragments = list;
    }
  }
};
const __vue_script__$b = script$b;
var __vue_render__$b = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-dialog',{attrs:{"close-on-click-modal":false,"close-on-press-escape":false,"title":'批量添加'+_vm.ruleInfo.fullName+'-'+_vm.ruleInfo.key,"visible":_vm.dialogVisible},on:{"update:visible":function($event){_vm.dialogVisible=$event;},"close":_vm.closeHandle},scopedSlots:_vm._u([{key:"footer",fn:function(){return [_c('el-button',{on:{"click":_vm.addBut}},[_vm._v("添加")])]},proxy:true}])},[_c('el-card',{attrs:{"shadow":"never"}},[_c('el-row',[_c('el-col',{attrs:{"span":16}},[_c('div',[_vm._v("1.分割项唯一，即重复xxx，只算1个")]),_vm._v(" "),_c('div',[_vm._v("2.空项跳过")])]),_vm._v(" "),_c('el-col',{attrs:{"span":8}},[_c('el-input',{staticStyle:{"width":"200px"},scopedSlots:_vm._u([{key:"prepend",fn:function(){return [_vm._v("分隔符")]},proxy:true}]),model:{value:(_vm.separator),callback:function ($$v) {_vm.separator=$$v;},expression:"separator"}}),_vm._v(" "),_c('div',[_c('el-switch',{attrs:{"active-text":"添加成功后关闭对话框"},model:{value:(_vm.successAfterCloseVal),callback:function ($$v) {_vm.successAfterCloseVal=$$v;},expression:"successAfterCloseVal"}})],1)],1)],1)],1),_vm._v(" "),_c('el-form',[_c('el-form-item',{directives:[{name:"show",rawName:"v-show",value:(_vm.fragments.length!==0),expression:"fragments.length!==0"}],attrs:{"label":"分割项"}},[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("数量:\n            "),_c('el-tag',[_vm._v(_vm._s(_vm.fragments.length))])]},proxy:true}])},[_vm._v(" "),_vm._l((_vm.fragments),function(v){return _c('el-tag',{key:v,staticStyle:{"margin-left":"5px"}},[_vm._v(_vm._s(v))])})],2)],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"输入项"}},[_c('el-input',{attrs:{"type":"textarea"},model:{value:(_vm.inputVal),callback:function ($$v) {_vm.inputVal=$$v;},expression:"inputVal"}})],1)],1)],1)],1)};
var __vue_staticRenderFns__$b = [];
  const __vue_inject_styles__$b = undefined;
  const __vue_component__$b = normalizeComponent(
    { render: __vue_render__$b, staticRenderFns: __vue_staticRenderFns__$b },
    __vue_inject_styles__$b,
    __vue_script__$b);var script$a = {
  data() {
    return {
      show: false,
      ruleType: "",
      ruleName: "",
      ruleFullName: "",
      oldVal: "",
      newVal: ""
    };
  },
  methods: {
    okBut() {
      let tempOldVal = this.oldVal.trim();
      let tempNewVal = this.newVal.trim();
      if (tempOldVal.length === 0 || tempNewVal.length === 0) {
        this.$alert("请输入要修改的值或新值");
        return;
      }
      if (tempNewVal === tempOldVal) {
        this.$alert("新值不能和旧值相同");
        return;
      }
      const tempRuleType = this.ruleType;
      if (tempRuleType === "userId_precise") {
        tempOldVal = parseInt(tempOldVal);
        tempNewVal = parseInt(tempNewVal);
        if (isNaN(tempOldVal) || isNaN(tempNewVal)) {
          this.$alert("请输入整数数字");
          return;
        }
      }
      if (!ruleUtil.findRuleItemValue(tempRuleType, tempOldVal)) {
        this.$alert("要修改的值不存在");
        return;
      }
      if (ruleUtil.findRuleItemValue(tempRuleType, tempNewVal)) {
        this.$alert("新值已存在");
        return;
      }
      const ruleArr = GM_getValue(tempRuleType, []);
      const indexOf = ruleArr.indexOf(tempOldVal);
      ruleArr[indexOf] = tempNewVal;
      GM_setValue(tempRuleType, ruleArr);
      this.$alert(`已将旧值【${tempOldVal}】修改成【${tempNewVal}】`);
      this.show = false;
    }
  },
  watch: {
    show(newVal) {
      if (newVal === false) this.oldVal = this.newVal = "";
    }
  },
  created() {
    eventEmitter.on("event:修改规则对话框", (data) => {
      this.show = true;
      this.ruleType = data.key;
      this.ruleName = data.name;
      this.ruleFullName = data.fullName;
    });
  }
};
const __vue_script__$a = script$a;
var __vue_render__$a = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-dialog',{attrs:{"close-on-click-modal":false,"modal":false,"visible":_vm.show,"title":"修改单项规则值","width":"30%"},on:{"update:visible":function($event){_vm.show=$event;}},scopedSlots:_vm._u([{key:"footer",fn:function(){return [_c('el-button',{on:{"click":function($event){_vm.show=false;}}},[_vm._v("取消")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.okBut}},[_vm._v("确定")])]},proxy:true}])},[_vm._v("\n    "+_vm._s(_vm.ruleFullName)+"-"+_vm._s(_vm.ruleType)+"\n    "),_c('el-form',[_c('el-form-item',{attrs:{"label":"要修改的值"}},[_c('el-input',{attrs:{"clearable":"","type":"text"},model:{value:(_vm.oldVal),callback:function ($$v) {_vm.oldVal=$$v;},expression:"oldVal"}})],1),_vm._v(" "),_c('el-form-item',{attrs:{"label":"修改后的值"}},[_c('el-input',{attrs:{"clearable":""},model:{value:(_vm.newVal),callback:function ($$v) {_vm.newVal=$$v;},expression:"newVal"}})],1)],1)],1)],1)};
var __vue_staticRenderFns__$a = [];
  const __vue_inject_styles__$a = undefined;
  const __vue_component__$a = normalizeComponent(
    { render: __vue_render__$a, staticRenderFns: __vue_staticRenderFns__$a },
    __vue_inject_styles__$a,
    __vue_script__$a);var script$9 = {
  data() {
    return {
      dialogVisible: false,
      typeMap: {},
      showTags: []
    };
  },
  methods: {
    updateShowRuleTags() {
      this.showTags = GM_getValue(this.typeMap.key, []);
    },
    handleTagClose(tag, index) {
      if (tag === "") return;
      this.$confirm(`确定要删除 ${tag} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.showTags.splice(index, 1);
        GM_setValue(this.typeMap.key, this.showTags);
        this.$message.success(`已移除 ${tag}`);
        eventEmitter.send("刷新规则信息", false);
      });
    },
    closedHandle() {
      this.typeMap = {};
      this.showTags.splice(0, this.showTags.length);
    }
  },
  created() {
    eventEmitter.on("event-lookRuleDialog", (typeMap) => {
      this.typeMap = typeMap;
      this.dialogVisible = true;
      this.updateShowRuleTags();
    });
  }
};
const __vue_script__$9 = script$9;
var __vue_render__$9 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-dialog',{attrs:{"close-on-click-modal":false,"close-on-press-escape":false,"fullscreen":true,"modal":false,"visible":_vm.dialogVisible,"title":"查看规则内容"},on:{"update:visible":function($event){_vm.dialogVisible=$event;},"closed":_vm.closedHandle}},[_c('el-card',{scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("规则信息")]},proxy:true}])},[_vm._v(" "),_c('el-tag',[_vm._v(_vm._s(_vm.typeMap.fullName + '|' + _vm.typeMap.key))]),_vm._v(" "),_c('el-tag',[_vm._v(_vm._s(_vm.showTags.length)+"个")])],1),_vm._v(" "),_c('el-card',_vm._l((_vm.showTags),function(item,index){return _c('el-tag',{key:index,attrs:{"closable":""},on:{"close":function($event){return _vm.handleTagClose(item,index)}}},[_vm._v("\n        "+_vm._s(item)+"\n      ")])}),1)],1)],1)};
var __vue_staticRenderFns__$9 = [];
  const __vue_inject_styles__$9 = undefined;
  const __vue_component__$9 = normalizeComponent(
    { render: __vue_render__$9, staticRenderFns: __vue_staticRenderFns__$9 },
    __vue_inject_styles__$9,
    __vue_script__$9);const ruleCountList = [];
for (const item of ruleKeyDataList) {
  const key = item.key;
  ruleCountList.push({ ...item, len: GM_getValue(key, []).length });
}
var script$8 = {
  data() {
    return {
      ruleCountList
    };
  },
  methods: {
    refreshInfo(isTip = true) {
      for (let x of this.ruleCountList) {
        x.len = GM_getValue(x.key, []).length;
      }
      if (!isTip) return;
      this.$notify({ title: "tip", message: "刷新规则信息成功", type: "success" });
    },
    refreshInfoBut() {
      this.refreshInfo();
    },
    lookRuleBut(item) {
      if (item.len === 0) {
        this.$message.warning("当前规则信息为空");
        return;
      }
      eventEmitter.emit("event-lookRuleDialog", item);
    }
  },
  created() {
    this.refreshInfo(false);
    eventEmitter.on("刷新规则信息", (isTip = true) => {
      this.refreshInfo(isTip);
    });
  }
};
const __vue_script__$8 = script$8;
var __vue_render__$8 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('div',{staticClass:"el-horizontal-outside"},[_c('div',[_vm._v("基础规则信息")]),_vm._v(" "),_c('div',[_c('el-button',{on:{"click":_vm.refreshInfoBut}},[_vm._v("刷新信息")])],1)])]},proxy:true}])},[_vm._v(" "),_c('div',{staticStyle:{"display":"flex","flex-wrap":"wrap","row-gap":"2px","justify-content":"flex-start"}},_vm._l((_vm.ruleCountList),function(item){return _c('el-button',{key:item.fullName,attrs:{"size":"small"},on:{"click":function($event){return _vm.lookRuleBut(item)}}},[_vm._v("\n        "+_vm._s(item.fullName)+"\n        "),_c('el-tag',{attrs:{"effect":item.len>0?'dark':'light',"size":"mini"}},[_vm._v("\n          "+_vm._s(item.len)+"\n        ")])],1)}),1)])],1)};
var __vue_staticRenderFns__$8 = [];
  const __vue_inject_styles__$8 = undefined;
  const __vue_component__$8 = normalizeComponent(
    { render: __vue_render__$8, staticRenderFns: __vue_staticRenderFns__$8 },
    __vue_inject_styles__$8,
    __vue_script__$8);const ruleInfoArr = ruleKeyDataList;
var script$7 = {
  components: { AddRuleDialog: __vue_component__$b, RuleSetValueDialog: __vue_component__$a, ViewRulesRuleDialog: __vue_component__$9, RuleInformationView: __vue_component__$8 },
  data() {
    return {
      ruleInfoArr,
      cascaderVal: "userId_precise",
      addRuleDialogVisible: false,
      addRuleDialogRuleInfo: { key: "", name: "", fullName: "" }
    };
  },
  methods: {
    handleChangeCascader(val) {
      console.log(val);
    },
    batchAddBut() {
      const key = this.cascaderVal;
      this.addRuleDialogVisible = true;
      this.addRuleDialogRuleInfo = ruleInfoArr.find((item) => item.key === key);
    },
    setRuleBut() {
      const key = this.cascaderVal;
      const typeMap = ruleInfoArr.find((item) => item.key === key);
      eventEmitter.emit("event:修改规则对话框", typeMap);
    },
    findItemAllBut() {
      const key = this.cascaderVal;
      const typeMap = ruleInfoArr.find((item) => item.key === key);
      eventEmitter.send("event-lookRuleDialog", typeMap);
    },
    delBut() {
      const key = this.cascaderVal;
      ruleUtil.showDelRuleInput(key);
      eventEmitter.emit("刷新规则信息", false);
    },
    clearItemRuleBut() {
      const key = this.cascaderVal;
      const find = ruleInfoArr.find((item) => item.key === key);
      this.$confirm(`是要清空${find.fullName}的规则内容吗？`, "tip").then(() => {
        GM_deleteValue(key);
        this.$alert(`已清空${find.fullName}的规则内容`);
      });
      eventEmitter.emit("刷新规则信息", false);
    },
    delAllBut() {
      this.$confirm("确定要删除所有规则吗？").then(() => {
        for (const x of ruleInfoArr) {
          GM_deleteValue(x.key);
        }
        this.$message.success("删除全部规则成功");
        eventEmitter.emit("刷新规则信息", false);
      });
    }
  }
};
const __vue_script__$7 = script$7;
var __vue_render__$7 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-select',{attrs:{"placeholder":"请选择规则类型"},on:{"change":_vm.handleChangeCascader},model:{value:(_vm.cascaderVal),callback:function ($$v) {_vm.cascaderVal=$$v;},expression:"cascaderVal"}},_vm._l((_vm.ruleInfoArr),function(item){return _c('el-option',{key:item.key,attrs:{"label":item.fullName,"value":item.key}})}),1),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('el-button-group',[_c('el-button',{on:{"click":_vm.batchAddBut}},[_vm._v("批量添加")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.setRuleBut}},[_vm._v("修改")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.findItemAllBut}},[_vm._v("查看项内容")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.delBut}},[_vm._v("移除")])],1),_vm._v(" "),_c('el-button-group',[_c('el-button',{attrs:{"type":"danger"},on:{"click":_vm.clearItemRuleBut}},[_vm._v("清空项")]),_vm._v(" "),_c('el-button',{attrs:{"type":"danger"},on:{"click":_vm.delAllBut}},[_vm._v("全部移除")])],1),_vm._v(" "),_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("说明")]},proxy:true}])},[_vm._v(" "),_c('div',[_vm._v("1.规则的值唯一，且不重复。")]),_vm._v(" "),_c('div',[_c('el-link',{attrs:{"href":"https://www.jyshare.com/front-end/854/","target":"_blank","type":"primary"}},[_vm._v("\n        2.正则表达式测试地址\n      ")])],1)]),_vm._v(" "),_c('RuleInformationView'),_vm._v(" "),_c('AddRuleDialog',{attrs:{"rule-info":_vm.addRuleDialogRuleInfo},model:{value:(_vm.addRuleDialogVisible),callback:function ($$v) {_vm.addRuleDialogVisible=$$v;},expression:"addRuleDialogVisible"}}),_vm._v(" "),_c('RuleSetValueDialog'),_vm._v(" "),_c('ViewRulesRuleDialog')],1)};
var __vue_staticRenderFns__$7 = [];
  const __vue_inject_styles__$7 = undefined;
  const __vue_component__$7 = normalizeComponent(
    { render: __vue_render__$7, staticRenderFns: __vue_staticRenderFns__$7 },
    __vue_inject_styles__$7,
    __vue_script__$7);var script$6 = {
  data() {
    return {
      outputInfoArr: []
    };
  },
  methods: {
    clearInfoBut() {
      this.$confirm("是否清空信息", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        this.outputInfoArr = [];
        this.$notify({ title: "tip", message: "已清空信息", type: "success" });
      });
    },
    lookDataBut(row) {
      console.log(row);
    },
    addOutInfo(data) {
      const find = this.outputInfoArr.find((item) => item.msg === data.msg);
      const date =  new Date();
      const showTime = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
      if (find) {
        find.showTime = showTime;
        if (find.msg === data.msg) {
          return;
        }
        find.data = data.data;
      } else {
        data.showTime = showTime;
        this.outputInfoArr.unshift(data);
      }
    }
  },
  created() {
    eventEmitter.on("event:print-msg", (msgData) => {
      if (typeof msgData === "string") {
        this.addOutInfo({ msg: msgData, data: null });
        return;
      }
      this.addOutInfo(msgData);
    });
  }
};
const __vue_script__$6 = script$6;
var __vue_render__$6 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-table',{attrs:{"data":_vm.outputInfoArr,"border":"","stripe":""}},[_c('el-table-column',{attrs:{"label":"显示时间","prop":"showTime","width":"80"}}),_vm._v(" "),_c('el-table-column',{attrs:{"prop":"msg"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('el-button',{attrs:{"type":"info"},on:{"click":_vm.clearInfoBut}},[_vm._v("清空消息")])]},proxy:true}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"操作","width":"85"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('el-tooltip',{attrs:{"content":"内容打印在控制台中"}},[_c('el-button',{attrs:{"type":"primary"},on:{"click":function($event){return _vm.lookDataBut(scope.row)}}},[_vm._v("print")])],1)]}}])})],1)],1)};
var __vue_staticRenderFns__$6 = [];
  const __vue_inject_styles__$6 = undefined;
  const __vue_component__$6 = normalizeComponent(
    { render: __vue_render__$6, staticRenderFns: __vue_staticRenderFns__$6 },
    __vue_inject_styles__$6,
    __vue_script__$6);var script$5 = {
  data() {
    return {
      group_url: globalValue.group_url,
      b_url: globalValue.b_url,
      github_url: globalValue.github_url,
      update_urls: [
        {
          title: "脚本猫",
          url: globalValue.scriptCat_js_url
        },
        {
          title: "Greasyfork",
          url: globalValue.greasyfork_js_url
        }
      ],
      update_log_url: globalValue.update_log_url,
      activeName: ["1", "2"]
    };
  },
  methods: {
    lookImgBut() {
      eventEmitter.send("显示图片对话框", { image: "https://www.mikuchase.ltd/img/qq_group_876295632.webp" });
    }
  }
};
const __vue_script__$5 = script$5;
var __vue_render__$5 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-collapse',{model:{value:(_vm.activeName),callback:function ($$v) {_vm.activeName=$$v;},expression:"activeName"}},[_c('el-collapse-item',{attrs:{"name":"1","title":"作者b站"}},[_c('el-link',{attrs:{"href":_vm.b_url,"target":"_blank","type":"primary"}},[_vm._v("b站传送门")])],1),_vm._v(" "),_c('el-collapse-item',{attrs:{"name":"2","title":"反馈交流群"}},[_c('el-link',{attrs:{"href":_vm.group_url,"target":"_blank","type":"primary"}},[_vm._v("====》Q群传送门《====\n      ")]),_vm._v(" "),_c('el-tooltip',{attrs:{"content":"点击查看群二维码"}},[_c('el-tag',{on:{"click":_vm.lookImgBut}},[_vm._v("876295632")])],1)],1),_vm._v(" "),_c('el-collapse-item',{attrs:{"name":"3","title":"更新地址"}},[_vm._v("\n        目前优先在脚本猫平台上更新发布\n      "),_vm._l((_vm.update_urls),function(item){return _c('div',{key:item.title},[_c('el-link',{attrs:{"href":item.url,"target":"_blank","type":"primary"}},[_vm._v(_vm._s(item.title)+"更新地址")])],1)})],2),_vm._v(" "),_c('el-collapse-item',{attrs:{"name":"4","title":"开源地址"}},[_c('div',[_vm._v("本脚本源代码已开源，欢迎大家Star或提交PR")]),_vm._v(" "),_c('el-link',{attrs:{"href":_vm.github_url,"target":"_blank","type":"primary"}},[_vm._v("github开源地址")])],1)],1)],1)};
var __vue_staticRenderFns__$5 = [];
  const __vue_inject_styles__$5 = undefined;
  const __vue_component__$5 = normalizeComponent(
    { render: __vue_render__$5, staticRenderFns: __vue_staticRenderFns__$5 },
    __vue_inject_styles__$5,
    __vue_script__$5);var script$4 = {
  data() {
    return {
      show: false,
      title: "图片查看",
      imgList: [],
      imgSrc: "",
      isModal: true
    };
  },
  created() {
    eventEmitter.on("显示图片对话框", ({ image, title, images, isModal }) => {
      this.imgSrc = image;
      if (title) {
        this.title = title;
      }
      if (images) {
        this.imgList = images;
      } else {
        this.imgList = [image];
      }
      if (isModal) {
        this.isModal = isModal;
      }
      this.show = true;
    });
  }
};
const __vue_script__$4 = script$4;
var __vue_render__$4 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-dialog',{attrs:{"modal":_vm.isModal,"title":_vm.title,"visible":_vm.show,"center":""},on:{"update:visible":function($event){_vm.show=$event;}}},[_c('div',{staticClass:"el-vertical-center"},[_c('el-image',{attrs:{"preview-src-list":_vm.imgList,"src":_vm.imgSrc}})],1)])],1)};
var __vue_staticRenderFns__$4 = [];
  const __vue_inject_styles__$4 = undefined;
  const __vue_component__$4 = normalizeComponent(
    { render: __vue_render__$4, staticRenderFns: __vue_staticRenderFns__$4 },
    __vue_inject_styles__$4,
    __vue_script__$4);var script$3 = {
  data() {
    return {
      list: [
        { name: "支付宝赞助", alt: "支付宝支持", src: "https://www.mikuchase.ltd/img/paymentCodeZFB.webp" },
        { name: "微信赞助", alt: "微信支持", src: "https://www.mikuchase.ltd/img/paymentCodeWX.webp" },
        { name: "QQ赞助", alt: "QQ支持", src: "https://www.mikuchase.ltd/img/paymentCodeQQ.webp" }
      ],
      dialogIni: {
        title: "打赏点猫粮",
        show: false,
        srcList: []
      }
    };
  },
  methods: {
    showDialogBut() {
      this.dialogIni.show = true;
    }
  },
  created() {
    this.dialogIni.srcList = this.list.map((x) => x.src);
  }
};
const __vue_script__$3 = script$3;
var __vue_render__$3 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('span',[_vm._v("零钱赞助")])]},proxy:true}])},[_vm._v(" "),_c('span',[_vm._v("1元不嫌少，10元不嫌多，感谢支持！")]),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('span',[_vm._v("生活不易，作者叹息")]),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('span',[_vm._v("用爱发电不容易，您的支持是我最大的更新动力")])],1),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',{staticClass:"el-vertical-center"},[_c('el-button',{attrs:{"round":"","type":"primary"},on:{"click":_vm.showDialogBut}},[_vm._v("打赏点猫粮")])],1),_vm._v(" "),_c('el-dialog',{attrs:{"title":_vm.dialogIni.title,"visible":_vm.dialogIni.show,"center":""},on:{"update:visible":function($event){return _vm.$set(_vm.dialogIni, "show", $event)}}},[_c('div',{staticClass:"el-vertical-center"},_vm._l((_vm.list),function(item){return _c('el-image',{key:item.name,staticStyle:{"height":"300px"},attrs:{"preview-src-list":_vm.dialogIni.srcList,"src":item.src}})}),1)])],1)};
var __vue_staticRenderFns__$3 = [];
  const __vue_inject_styles__$3 = undefined;
  const __vue_component__$3 = normalizeComponent(
    { render: __vue_render__$3, staticRenderFns: __vue_staticRenderFns__$3 },
    __vue_inject_styles__$3,
    __vue_script__$3);var script$2 = {
  data() {
    return {
      intervalExecutorStatus: []
    };
  },
  methods: {
    setIntervalExecutorStatusBut(row, status) {
      IntervalExecutor.setIntervalExecutorStatus(row.key, status);
    }
  },
  created() {
    eventEmitter.on("event:update:intervalExecutorStatus", (data) => {
      const { status, key } = data;
      const find = this.intervalExecutorStatus.find((item) => item.key === key);
      if (find) {
        find.status = status;
      } else {
        this.intervalExecutorStatus.push(data);
      }
    });
    GM_addStyle(`
    #detectionStatusView .el-button {
    margin-left: 0!important
    }`);
  }
};
const __vue_script__$2 = script$2;
var __vue_render__$2 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',{attrs:{"id":"detectionStatusView"}},[_c('el-table',{attrs:{"data":_vm.intervalExecutorStatus,"border":"","stripe":""}},[_c('el-table-column',{attrs:{"label":"检测名","prop":"name"}}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"状态","width":"100"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('el-tag',{directives:[{name:"show",rawName:"v-show",value:(scope.row.status),expression:"scope.row.status"}],attrs:{"type":"success"}},[_vm._v("运行中")]),_vm._v(" "),_c('el-tag',{directives:[{name:"show",rawName:"v-show",value:(!scope.row.status),expression:"!scope.row.status"}],attrs:{"type":"danger"}},[_vm._v("已停止")])]}}])}),_vm._v(" "),_c('el-table-column',{attrs:{"label":"操作","width":"100"},scopedSlots:_vm._u([{key:"default",fn:function(scope){return [_c('div',[_c('el-button',{directives:[{name:"show",rawName:"v-show",value:(scope.row.status),expression:"scope.row.status"}],on:{"click":function($event){return _vm.setIntervalExecutorStatusBut(scope.row,false)}}},[_vm._v("停止")]),_vm._v(" "),_c('el-button',{directives:[{name:"show",rawName:"v-show",value:(!scope.row.status),expression:"!scope.row.status"}],on:{"click":function($event){return _vm.setIntervalExecutorStatusBut(scope.row,true)}}},[_vm._v("启动")])],1)]}}])})],1)],1)};
var __vue_staticRenderFns__$2 = [];
  const __vue_inject_styles__$2 = undefined;
  const __vue_component__$2 = normalizeComponent(
    { render: __vue_render__$2, staticRenderFns: __vue_staticRenderFns__$2 },
    __vue_inject_styles__$2,
    __vue_script__$2);var script$1 = {
  data() {
    return {
      ruleContentImport: "",
      select: {
        val: [],
        options: []
      }
    };
  },
  methods: {
    getSelectValRuleContent() {
      const val = this.select.val;
      if (val.length === 0) return;
      const map = {};
      for (const valKey of val) {
        const find = this.select.options.find((item) => item.key === valKey);
        if (find === void 0) continue;
        const { key } = find;
        const ruleItemList = GM_getValue(key, []);
        if (ruleItemList.length === 0) continue;
        map[key] = ruleItemList;
      }
      if (Object.keys(map).length === 0) {
        this.$message.warning(`选定的规则类型都为空`);
        return false;
      }
      return map;
    },
    overwriteImportRulesBut() {
      this.$confirm("是否要覆盖导入规则？").then(() => {
        const trim = this.ruleContentImport.trim();
        if (ruleUtil.overwriteImportRules(trim)) {
          this.$alert("已覆盖导入成功！");
          eventEmitter.emit("event:刷新规则信息");
        }
      });
    },
    appendImportRulesBut() {
      this.$confirm("是否要追加导入规则？").then(() => {
        const trim = this.ruleContentImport.trim();
        if (ruleUtil.appendImportRules(trim)) {
          this.$message("已追加导入成功！");
          eventEmitter.emit("event:刷新规则信息");
        }
      });
    },
    handleFileUpload(event) {
      defUtil.handleFileReader(event).then((data) => {
        const { content } = data;
        try {
          JSON.parse(content);
        } catch (e) {
          this.$message("文件内容有误");
          return;
        }
        this.ruleContentImport = content;
        this.$message("读取到内容，请按需覆盖或追加");
      });
    },
    inputFIleRuleBut() {
      const file = this.$refs.file;
      file.click();
    },
    outToInputBut() {
      this.ruleContentImport = ruleUtil.getRuleContent();
      this.$message("已导出到输入框中");
    },
    ruleOutToFIleBut() {
      const map = this.getSelectValRuleContent();
      if (map === false) return;
      this.$prompt("请输入文件名", "保存为", {
        inputValue: "b站屏蔽器规则-指定类型-" + defUtil.toTimeString()
      }).then((res) => {
        const value = res.value;
        if (value === "" && value.includes(" ")) {
          this.$alert("文件名不能为空或包含空格");
          return;
        }
        defUtil.saveTextAsFile(JSON.stringify(map, null, 4), value + ".json");
      });
    },
    basisRuleOutToFIleBut() {
      let fileName = "b站屏蔽器规则-" + defUtil.toTimeString();
      this.$prompt("请输入文件名", "保存为", {
        inputValue: fileName
      }).then((res) => {
        const value = res.value;
        if (res.value === "" && res.value.includes(" ")) {
          this.$alert("文件名不能为空或包含空格");
          return;
        }
        defUtil.saveTextAsFile(ruleUtil.getRuleContent(true, 4), value + ".json");
      });
    },
    ruleOutToConsoleBut() {
      const map = this.getSelectValRuleContent();
      if (map === false) return;
      console.log(map);
      this.$message.info("已导出到控制台上，F12打开控制台查看");
    },
    basisRuleOutToConsoleBut() {
      console.log(ruleUtil.getRuleContent(false));
      this.$message("已导出到控制台上，F12打开控制台查看");
    }
  },
  created() {
    for (const v of ruleKeyDataList) {
      this.select.options.push(v);
    }
  }
};
const __vue_script__$1 = script$1;
var __vue_render__$1 = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_c('span',[_vm._v("导出基础规则")])]},proxy:true}])},[_vm._v(" "),_c('el-button',{on:{"click":_vm.basisRuleOutToFIleBut}},[_vm._v("导出文件")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.outToInputBut}},[_vm._v("导出编辑框")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.basisRuleOutToConsoleBut}},[_vm._v("导出控制台")])],1),_vm._v(" "),_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("导出指定规则")]},proxy:true}])},[_vm._v(" "),_c('el-select',{attrs:{"clearable":"","filterable":"","multiple":"","placeholder":"请选择导出规则类型"},model:{value:(_vm.select.val),callback:function ($$v) {_vm.$set(_vm.select, "val", $$v);},expression:"select.val"}},_vm._l((_vm.select.options),function(item){return _c('el-option',{key:item.key,attrs:{"label":item.fullName,"value":item.key}})}),1),_vm._v(" "),_c('el-button',{on:{"click":_vm.ruleOutToFIleBut}},[_vm._v("导出文件")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.ruleOutToConsoleBut}},[_vm._v("导出控制台")])],1),_vm._v(" "),_c('el-card',{attrs:{"shadow":"never"},scopedSlots:_vm._u([{key:"header",fn:function(){return [_vm._v("导入规则")]},proxy:true}])},[_vm._v(" "),_c('div',[_vm._v("仅支持json格式内容导入,且最外层为对象(花括号)")]),_vm._v(" "),_c('div',[_vm._v("内容格式为{key: [规则列表]}")]),_vm._v(" "),_c('div',[_vm._v("可以只导入指定类型规则，最外层需为对象，key为规则的内部key，value为规则列表")]),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',[_c('el-button',{on:{"click":_vm.inputFIleRuleBut}},[_vm._v("读取外部规则文件")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.overwriteImportRulesBut}},[_vm._v("覆盖导入规则")]),_vm._v(" "),_c('el-button',{on:{"click":_vm.appendImportRulesBut}},[_vm._v("追加导入规则")])],1),_vm._v(" "),_c('el-divider'),_vm._v(" "),_c('div',[_c('el-input',{attrs:{"autosize":{ minRows: 10, maxRows: 50},"placeholder":"要导入的规则内容","type":"textarea"},model:{value:(_vm.ruleContentImport),callback:function ($$v) {_vm.ruleContentImport=$$v;},expression:"ruleContentImport"}})],1)],1),_vm._v(" "),_c('input',{ref:"file",staticStyle:{"display":"none"},attrs:{"accept":"application/json","type":"file"},on:{"change":_vm.handleFileUpload}})],1)};
var __vue_staticRenderFns__$1 = [];
  const __vue_inject_styles__$1 = undefined;
  const __vue_component__$1 = normalizeComponent(
    { render: __vue_render__$1, staticRenderFns: __vue_staticRenderFns__$1 },
    __vue_inject_styles__$1,
    __vue_script__$1);var script = {
  components: {
    ShowImgDialog: __vue_component__$4,
    RuleManagementView: __vue_component__$7,
    RightSidebarView: __vue_component__$c,
    PanelSettingsView: __vue_component__$e,
    SheetDialog: __vue_component__$d,
    OutputInformationView: __vue_component__$6,
    AboutAndFeedbackView: __vue_component__$5,
    DonateLayoutView: __vue_component__$3,
    DetectionStatusView: __vue_component__$2,
    RuleExportImportView: __vue_component__$1
  },
  data() {
    return {
      drawer: false,
      debug_panel_show: false
    };
  },
  methods: {},
  created() {
    eventEmitter.on("主面板开关", () => {
      this.drawer = !this.drawer;
    });
    document.addEventListener("keydown", (event) => {
      eventEmitter.emit("event-keydownEvent", event);
      if (event.key === "`") {
        this.drawer = !this.drawer;
      }
    });
    eventEmitter.on("el-notify", (options) => {
      if (!options["position"]) {
        options.position = "bottom-right";
      }
      this.$notify(options);
    });
    eventEmitter.on("el-msg", (...options) => {
      this.$message.apply(this, options);
    });
    eventEmitter.on("el-alert", (...options) => {
      this.$alert.apply(this, options);
    });
    eventEmitter.handler("el-confirm", (...options) => {
      return this.$confirm.apply(this, options);
    });
    eventEmitter.handler("el-prompt", (...options) => {
      return this.$prompt.apply(this, options);
    });
  }
};
const __vue_script__ = script;
var __vue_render__ = function () {var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;return _c('div',[_c('el-drawer',{staticStyle:{"position":"fixed"},attrs:{"visible":_vm.drawer,"direction":"rtl","size":"35%","title":"pixiv内容屏蔽器"},on:{"update:visible":function($event){_vm.drawer=$event;}}},[_c('el-tabs',{attrs:{"tab-position":"left","type":"border-card"}},[_c('el-tab-pane',{attrs:{"label":"规则管理","lazy":""}},[_c('RuleManagementView')],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"导出导入","lazy":""}},[_c('RuleExportImportView')],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"输出信息","lazy":""}},[_c('OutputInformationView')],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"检测状态","lazy":""}},[_c('DetectionStatusView')],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"面板设置","lazy":""}},[_c('PanelSettingsView')],1),_vm._v(" "),_c('el-tab-pane',{attrs:{"label":"关于反馈","lazy":""}},[_c('AboutAndFeedbackView'),_vm._v(" "),_c('DonateLayoutView')],1)],1)],1),_vm._v(" "),_c('SheetDialog'),_vm._v(" "),_c('RightSidebarView'),_vm._v(" "),_c('ShowImgDialog')],1)};
var __vue_staticRenderFns__ = [];
  const __vue_inject_styles__ = undefined;
  const __vue_component__ = normalizeComponent(
    { render: __vue_render__, staticRenderFns: __vue_staticRenderFns__ },
    __vue_inject_styles__,
    __vue_script__);window.addEventListener("DOMContentLoaded", () => {
  if (document.head.querySelector("#element-ui-css") === null) {
    const linkElement = document.createElement("link");
    linkElement.rel = "stylesheet";
    linkElement.href = "https://unpkg.com/element-ui@2.15.14/lib/theme-chalk/index.css";
    linkElement.id = "element-ui-css";
    document.head.appendChild(linkElement);
    linkElement.addEventListener("load", () => {
      console.log("element-ui样式加载完成");
    });
  }
  const { vueDiv } = elUtil.createVueDiv(document.body);
  defUtil.initVueApp(vueDiv, __vue_component__);
});window.parseUrl = urlUtil.parseUrl;
const getAListOfWorks = async (selector, intervalFind = true, doc = document) => {
  let els;
  if (intervalFind) {
    els = await elUtil.findElements(selector);
  } else {
    els = doc.querySelectorAll(selector);
  }
  const list = [];
  for (let el of els) {
    const userAel = el.querySelector('div[aria-haspopup]>a[href^="/users/"]');
    if (userAel === null)
      continue;
    let userName;
    const userNameEl = userAel.lastElementChild;
    if (userNameEl !== null) {
      userName = userNameEl.getAttribute("title");
    } else {
      userName = userAel.textContent.trim();
    }
    const userUrl = userAel.href;
    const userId = urlUtil.getUrlUid(userUrl);
    list.push({ insertionPositionEl: userAel.parentElement, userName, userUrl, userId, el });
  }
  return list;
};
window.getAListOfWorks = getAListOfWorks;
const getListData = async (selector, intervalFind = true) => {
  let els;
  if (intervalFind) {
    els = await elUtil.findElements(selector);
  } else {
    els = document.querySelectorAll(selector);
  }
  const list = [];
  for (const el of els) {
    const userAEl = el.querySelector('a[href^="/users/"][data-ga4-label="user_name_link"]');
    const userName = userAEl.textContent.trim();
    const userUrl = userAEl.href;
    const userId = urlUtil.getUrlUid(userUrl);
    list.push({ userName, userId, el, userUrl, insertionPositionEl: userAEl.parentElement });
  }
  return list;
};
window.getListData = getListData;
const getListOfRequestedWorks = async () => {
  const els = await elUtil.findElements(".sc-1453b7f5-2.dvNJyE,.sc-9ce51bf9-2.hDpden");
  const list = [];
  for (let el of els) {
    const userAEl = el.querySelector('a[href^="/users/"][data-ga4-label="user_name_link"]');
    const tagEls = el.querySelectorAll('a[href^="/tags/"]');
    let userName = null;
    if (userAEl) {
      userName = userAEl.textContent.trim();
    } else {
      continue;
    }
    const userUrl = userAEl.href;
    const userId = urlUtil.getUrlUid(userUrl);
    const tags = [];
    for (const tagEl of tagEls) {
      tags.push(tagEl.textContent.trim());
    }
    list.push({ insertionPositionEl: userAEl.parentElement, userName, userUrl, userId, tags, el });
  }
  return list;
};
const intervalListOfRequestedWorksExecutor = new IntervalExecutor(async () => {
  const list = await getListOfRequestedWorks();
  shielding.shieldingItemDecorated(list);
}, { processTips: true, intervalName: "约稿列表" });
var pageCommon = {
  getAListOfWorks,
  intervalListOfRequestedWorksExecutor,
  getListData
};const getHomeBelowRecommendWorksList = async () => {
  const els = await elUtil.findElements('.flex.flex-col.items-center[data-ga4-label="home_recommend"]>.w-full');
  const list = [];
  for (let el of els) {
    if (el.className.includes("bg-background")) {
      continue;
    }
    const dataGa4Label = el.getAttribute("data-ga4-label");
    if (dataGa4Label === "ranking_content") {
      continue;
    }
    const itemsCenterDiv = el.querySelector(".items-center[data-cr-label]");
    const userAEl = itemsCenterDiv.querySelector('div[title]>a[href^="/users/"]');
    const insertionPositionEl = userAEl.parentElement;
    const userName = userAEl.textContent.trim();
    const userUrl = userAEl.href;
    const userId = urlUtil.getUrlUid(userUrl);
    list.push({ userName, userUrl, userId, el, insertionPositionEl });
  }
  return list;
};
var homePage = {
  isHomeThisPage(url) {
    return url === "https://www.pixiv.net/";
  },
  isHomeMangaThisPage(url) {
    return url.endsWith("//www.pixiv.net/manga");
  },
  isHomeIllustrationThisPage(url) {
    return url.endsWith("//www.pixiv.net/illustration");
  },
  async checkHomeRecommendIllustrationList() {
    const list = await pageCommon.getAListOfWorks(".eqqsVu");
    shielding.shieldingItemDecorated(list);
    console.log("检查完首页子页面推荐作品列表");
  },
  intervalHomeWorksListExecutor: new IntervalExecutor(() => {
    const selector = 'li.p-0.list-none.overflow-hidden.col-span-2,li[data-ga4-label="thumbnail"]';
    const els = document.querySelectorAll(selector);
    const list = [];
    for (let el of els) {
      const userAEl = el.querySelector('a[data-ga4-label="user_name_link"]');
      const userName = userAEl.textContent.trim();
      const userUrl = userAEl.href;
      const userId = urlUtil.getUrlUid(userUrl);
      const insertionPositionEl = el.querySelector("div[aria-haspopup]");
      list.push({ userName, userUrl, userId, insertionPositionEl, el });
    }
    shielding.shieldingItemDecorated(list);
  }, { processTips: true, intervalName: "精选新作列表" }),
  checkHomeBelowRecommendWorksList() {
    getHomeBelowRecommendWorksList().then((list) => {
      shielding.shieldingItemDecorated(list);
    });
  }
};const getAreaElement = async (areaName) => {
  let find = document.querySelector(`[area-name=${areaName}]`);
  if (find) {
    return { areaNameEl: find, parentEl: find.parentElement };
  }
  const els = await elUtil.findElements("section>div:first-of-type");
  find = els.find((el) => el.textContent.includes(areaName)) ?? null;
  if (find === null) {
    return null;
  }
  find.setAttribute("area-name", areaName);
  return {
    areaNameEl: find,
    parentEl: find.parentElement
  };
};
var illustrationAndMangaCommon = {
  intervalIllustrationListExecutor: new IntervalExecutor(async () => {
    const list = await pageCommon.getAListOfWorks(".sc-e07c5bb9-2.eMLzTs,.sc-bf8cea3f-2", false);
    const dailyRanking = await getAreaElement("每日排行榜");
    if (dailyRanking) {
      list.push(...await pageCommon.getAListOfWorks("ul>div", false, dailyRanking.parentEl));
    }
    shielding.shieldingItemDecorated(list);
  }, { processTips: true, intervalName: "首页插画漫画列表" })
};const selectors = [
  "ul>li.sc-9a31d d94-0",
  "ul>li.sc-f59b1b7b-8",
  "ul>li.sc-fec4147b-4",
  "ul>li.sc-9111aad9-0",
  "sc-1453b7f5-2.dvNJyE"
];
const selector = selectors.join(",");
var commonIntervalCheckPage = {
  isCommonIntervalCheckPage(url) {
    return this.isThisPage(url) || //是否是发现小说页或发现页面
    url.includes("www.pixiv.net/novel/discovery") || url.includes("www.pixiv.net/discovery") || //是否是大家的新作页面侧边栏有时显示的是本站的最新作品
    url.includes("//www.pixiv.net/new_illust.php") || url.endsWith("//www.pixiv.net/novel/new.php") || //是否是小说编辑部推荐页面
    url.includes("//www.pixiv.net/novel/editors_picks") || //是否是分类小说页
    url.includes("//www.pixiv.net/genre/novel") || //是否是约稿页面
    url.includes("//www.pixiv.net/request") || //是否是用户企划页面
    url.includes("//www.pixiv.net/user_event.php");
  },
  isThisPage(url) {
    return url.endsWith("//www.pixiv.net/novel");
  },
  intervalCheckTheListOfSomePagesListExecutor: new IntervalExecutor(async () => {
    const list = await pageCommon.getListData(selector, false);
    shielding.shieldingItemDecorated(list);
  }, { processTips: true, intervalName: "部分页面列表" })
};const intervalRecommendedUsersListExecutor = new IntervalExecutor(async () => {
  const list = await pageCommon.getListData("ul.list-none>li");
  shielding.shieldingItemDecorated(list);
}, { processTips: true, intervalName: "发现推荐用户列表" });
var discoveryUsersPage = {
  isThisPage(url) {
    return url.endsWith("//www.pixiv.net/discovery/users");
  },
  intervalRecommendedUsersListExecutor
};const intervalIllustrationListExecutor = new IntervalExecutor(async () => {
  const list = await pageCommon.getAListOfWorks("ul.sc-5b55504a-1>li,ul.sc-e83d358-1>li", false);
  shielding.shieldingItemDecorated(list);
}, { processTips: true, intervalName: "插画·漫画列表" });
const checkTagUserList = async () => {
  const list = await pageCommon.getListData("div.grid>.list-none");
  shielding.shieldingItemDecorated(list);
};
const complyWithItemName = ["illustrations", "manga", "novels", "artworks"];
var tagTopPage = {
  isThisPage(url) {
    if (!url.includes("//www.pixiv.net/tags/")) {
      return false;
    }
    const parseUrl = urlUtil.parseUrl(url);
    const pathSegments = parseUrl.pathSegments;
    if (pathSegments.length <= 2) {
      return true;
    }
    const tabName = pathSegments[2];
    return complyWithItemName.includes(tabName);
  },
  isSearchUserPage(url) {
    return url.includes("https://www.pixiv.net/search/users");
  },
  checkTagUserList,
  intervalIllustrationListExecutor
};const getWorksList = () => {
  const els = document.querySelectorAll("div.ranking-items>section");
  const list = [];
  for (const el of els) {
    const userAEl = el.querySelector('a[href^="/users/"][data-user_name]');
    const userName = userAEl.getAttribute("data-user_name");
    const userUrl = userAEl.href;
    const userId = urlUtil.getUrlUid(userUrl);
    list.push({ insertionPositionEl: userAEl, el, userName, userUrl, userId });
  }
  const novelEls = document.querySelectorAll("section._ranking-items>._ranking-item");
  for (const el of novelEls) {
    const userAEl = el.querySelector('a[href^="/users/"]');
    const userName = userAEl.getAttribute("data-user_name");
    const userUrl = userAEl.href;
    const userId = urlUtil.getUrlUid(userUrl);
    list.push({ insertionPositionEl: userAEl.parentElement, el, userName, userUrl, userId });
  }
  return list;
};
window.getWorksList = getWorksList;
var rankingPage = {
  isThisPage(url) {
    return url.includes("//www.pixiv.net/ranking.php") || url.includes("//www.pixiv.net/novel/ranking.php");
  },
  intervalCheckRankingWorksListExecutor: new IntervalExecutor(async () => {
    const list = getWorksList();
    shielding.shieldingItemDecorated(list);
  }, { processTips: true, intervalName: "排行榜作品列表" })
};var router = {
  staticRoute(title, url) {
    console.log("静态路由", title, url);
    if (homePage.isHomeThisPage(url)) {
      homePage.intervalHomeWorksListExecutor.start();
      homePage.checkHomeBelowRecommendWorksList();
    }
    const urlIsIllustratedMangaPage = homePage.isHomeIllustrationThisPage(url) || homePage.isHomeMangaThisPage(url);
    const urlIsNovelPage = commonIntervalCheckPage.isThisPage(url);
    if (urlIsIllustratedMangaPage || urlIsNovelPage) {
      pageCommon.intervalListOfRequestedWorksExecutor.start();
    }
    if (urlIsIllustratedMangaPage) {
      illustrationAndMangaCommon.intervalIllustrationListExecutor.start();
    }
    if (homePage.isHomeIllustrationThisPage(url)) {
      homePage.checkHomeRecommendIllustrationList();
    }
    if (commonIntervalCheckPage.isCommonIntervalCheckPage(url)) {
      commonIntervalCheckPage.intervalCheckTheListOfSomePagesListExecutor.start();
    }
    if (discoveryUsersPage.isThisPage(url)) {
      discoveryUsersPage.intervalRecommendedUsersListExecutor.start();
    }
    const isUrlArtWorksPage = artworksPage.isThisPage(url);
    if (tagTopPage.isThisPage(url) || isUrlArtWorksPage) {
      tagTopPage.intervalIllustrationListExecutor.start();
    }
    if (isUrlArtWorksPage) {
      artworksPage.intervalCheckCommentListExecutor.start();
    }
    if (usersPage.isThisPage(url) || isUrlArtWorksPage) {
      eventEmitter.emit("event:right_sidebar_show", true);
    }
    if (tagTopPage.isSearchUserPage(url)) {
      tagTopPage.checkTagUserList();
    }
    if (rankingPage.isThisPage(url)) {
      rankingPage.intervalCheckRankingWorksListExecutor.start();
    }
  },
  dynamicRouting(title, url) {
    console.log("动态路由", title, url);
    if (homePage.isHomeThisPage(url)) {
      homePage.intervalHomeWorksListExecutor.start();
      homePage.checkHomeBelowRecommendWorksList();
    } else {
      homePage.intervalHomeWorksListExecutor.stop();
    }
    const urlIsIllustratedMangaPage = homePage.isHomeIllustrationThisPage(url) || homePage.isHomeMangaThisPage(url);
    if (commonIntervalCheckPage.isThisPage(url) || urlIsIllustratedMangaPage) {
      pageCommon.intervalListOfRequestedWorksExecutor.start();
    } else {
      pageCommon.intervalListOfRequestedWorksExecutor.stop();
    }
    if (urlIsIllustratedMangaPage) {
      illustrationAndMangaCommon.intervalIllustrationListExecutor.start();
    } else {
      illustrationAndMangaCommon.intervalIllustrationListExecutor.stop();
    }
    if (homePage.isHomeIllustrationThisPage(url)) {
      homePage.checkHomeRecommendIllustrationList();
    }
    if (commonIntervalCheckPage.isCommonIntervalCheckPage(url)) {
      commonIntervalCheckPage.intervalCheckTheListOfSomePagesListExecutor.start();
    } else {
      commonIntervalCheckPage.intervalCheckTheListOfSomePagesListExecutor.stop();
    }
    if (discoveryUsersPage.isThisPage(url)) {
      discoveryUsersPage.intervalRecommendedUsersListExecutor.start();
    } else {
      discoveryUsersPage.intervalRecommendedUsersListExecutor.stop();
    }
    if (tagTopPage.isThisPage(url)) {
      tagTopPage.intervalIllustrationListExecutor.start();
    } else {
      tagTopPage.intervalIllustrationListExecutor.stop();
    }
    if (tagTopPage.isSearchUserPage(url)) {
      tagTopPage.checkTagUserList();
    }
    const isArtWorksPage = artworksPage.isThisPage(url);
    eventEmitter.emit("event:right_sidebar_show", isArtWorksPage || usersPage.isThisPage(url));
    if (isArtWorksPage) {
      artworksPage.intervalCheckCommentListExecutor.start();
    } else {
      artworksPage.intervalCheckCommentListExecutor.stop();
    }
  }
};var watch = {
  addEventListenerUrlChange(callback) {
    let oldUrl = window.location.href;
    setInterval(() => {
      const newUrl = window.location.href;
      if (oldUrl === newUrl)
        return;
      oldUrl = newUrl;
      const title = document.title;
      callback(newUrl, oldUrl, title);
    }, 1e3);
  },
  addEventListenerScroll() {
    window.addEventListener("scroll", defUtil.debounce(() => {
      const href = location.href;
      if (homePage.isHomeThisPage(href)) {
        homePage.checkHomeBelowRecommendWorksList();
      }
    }));
  }
};eventEmitter.on("event:mask_options_dialog_box", (data) => {
  const { userId, userName } = data;
  const showList = [];
  if (userId) {
    showList.push({ label: `用户id精确屏蔽=${userId}`, value: "userId_precise" });
  }
  if (userName) {
    showList.push({ label: `用户名精确屏蔽=${userName}`, value: "username_precise" });
  }
  eventEmitter.send("sheet-dialog", {
    title: "屏蔽选项",
    list: showList,
    optionsClick: (item) => {
      const { value } = item;
      let results;
      if (value === "userId_precise") {
        results = ruleUtil.addRule(userId, value);
      } else if (value === "username_precise") {
        results = ruleUtil.addRule(userName, value);
      } else {
        eventEmitter.send("el-msg", "出现意外的选项值");
        return;
      }
      if (results) {
        eventEmitter.emit("el-msg", results.res).emit("event:刷新规则信息", false);
      }
    }
  });
});var defaultStyle = `
.el-vertical-center {
    display: flex;
    justify-content: center;
}
.el-horizontal-center {
    display: flex;
    align-items: center;
}
.el-horizontal-right {
    display: flex;
    justify-content: flex-end;
}
.el-horizontal-left {
    display: flex;
    justify-content: flex-start;
}
.el-horizontal-outside {
    display: flex;
    justify-content: space-between;
    align-items: center;
}`;var gzStyle = `button[gz_type] {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    border: 1px solid #dcdfe6;
    color: #F07775;
    -webkit-appearance: none;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 0;
    transition: .1s;
    font-weight: 500;
    -moz-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    padding: 10px 20px;
    font-size: 14px;
    border-radius: 8px;
}
button[gz_type="primary"] {
    color: #fff;
    background-color: #409eff;
    border-color: #409eff;
}
button[gz_type="success"] {
    color: #fff;
    background-color: #67c23a;
    border-color: #67c23a;
}
button[gz_type="info"] {
    color: #fff;
    background-color: #909399;
    border-color: #909399;
}
button[gz_type="warning"] {
    color: #fff;
    background-color: #e6a23c;
    border-color: #e6a23c;
}
button[gz_type="danger"] {
    color: #fff;
    background-color: #f56c6c;
    border-color: #f56c6c;
}
button[border] {
    border-radius: 20px;
    padding: 12px 23px;
}
input[gz_type] {
    font-family: 'Arial', sans-serif; 
    font-size: 16px; 
    padding: 10px; 
    margin: 10px; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    outline: none; 
}
input[gz_type]:focus {
    border-color: #007bff; 
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); 
}
select {
    font-family: 'Arial', sans-serif; 
    font-size: 16px; 
    padding: 10px; 
    margin: 10px; 
    border: 1px solid #ccc; 
    border-radius: 4px; 
    outline: none; 
    background-color: white; 
    color: #333; 
}
select:focus {
    border-color: #007bff; 
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.3); 
}
select:disabled {
    background-color: #f1f1f1; 
    border-color: #ccc; 
    color: #888; 
}
button:hover {
    border-color: #646cff;
}
button[gz_type]:focus,
button[gz_type]:focus-visible {
    outline: 4px auto -webkit-focus-ring-color;
}
`;window.addEventListener("load", () => {
  console.log("页面加载完成");
  watch.addEventListenerScroll();
});
window.addEventListener("DOMContentLoaded", () => {
  console.log("页面元素加载完成");
  router.staticRoute(document.title, window.location.href);
  watch.addEventListenerUrlChange((newUrl, oldUrl, title) => {
    router.dynamicRouting(title, newUrl);
  });
  GM_addStyle(defaultStyle);
  GM_addStyle(gzStyle);
  elUtil.updateCssVModal();
});})(Vue);