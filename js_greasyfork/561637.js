// ==UserScript==
// @name           Bilibili直播时间点标记
// @description    在Bilibili直播中标记时间, 方便用户查阅
// @version        1.0.2
// @author         Yiero
// @match          https://live.bilibili.com/*
// @tag            bilibili
// @tag            live
// @tag            mark
// @license        GPL-3
// @namespace      https://github.com/AliubYiero/Yiero_WebScripts
// @grant          GM_addStyle
// @grant          GM_unregisterMenuCommand
// @grant          GM_registerMenuCommand
// @grant          GM_getValue
// @grant          GM_setValue
// @grant          GM_deleteValue
// @grant          GM_addValueChangeListener
// @grant          GM_removeValueChangeListener
// @downloadURL https://update.greasyfork.org/scripts/561637/Bilibili%E7%9B%B4%E6%92%AD%E6%97%B6%E9%97%B4%E7%82%B9%E6%A0%87%E8%AE%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/561637/Bilibili%E7%9B%B4%E6%92%AD%E6%97%B6%E9%97%B4%E7%82%B9%E6%A0%87%E8%AE%B0.meta.js
// ==/UserScript==
(function(exports) {
  "use strict";
  var _a;
  const clearChatInputRadius = () => {
    GM_addStyle(`#chat-control-panel-vm {border-radius: 0 !important;}`);
  };
  const api_GetRoomBaseInfo = async (roomId) => {
    const domain = "https://api.live.bilibili.com/xlive/web-room/v1/index/getRoomBaseInfo";
    const param = {
      req_biz: "web_room_componet",
      room_ids: roomId
    };
    const requestUrl = `${domain}?${new URLSearchParams(param).toString()}`;
    return fetch(requestUrl).then((r2) => r2.json());
  };
  const api_getLiveStatus = async (roomId) => {
    const roomInfo = await api_GetRoomBaseInfo(roomId);
    const roomData = Object.values(roomInfo.data.by_room_ids)[0];
    return {
      roomId: roomData.room_id,
      isLive: Boolean(roomData.live_status),
      liveTime: Date.parse(roomData.live_time),
      title: roomData.title,
      uid: roomData.uid,
      name: roomData.uname
    };
  };
  /*
  * @module      : @yiero/gmlib
  * @author      : Yiero
  * @version     : 0.1.23
  * @description : GM Lib for Tampermonkey
  * @keywords    : tampermonkey, lib, scriptcat, utils
  * @license     : MIT
  * @repository  : git+https://github.com/AliubYiero/GmLib.git
  */
  var __defProp$2 = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp$2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
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
  /**
   * @license
   * Copyright 2019 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t$2 = globalThis, e$2 = t$2.ShadowRoot && (void 0 === t$2.ShadyCSS || t$2.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, s$2 = Symbol(), o$4 = /* @__PURE__ */ new WeakMap();
  let n$3 = class n {
    constructor(t2, e2, o2) {
      if (this._$cssResult$ = true, o2 !== s$2) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
      this.cssText = t2, this.t = e2;
    }
    get styleSheet() {
      let t2 = this.o;
      const s2 = this.t;
      if (e$2 && void 0 === t2) {
        const e2 = void 0 !== s2 && 1 === s2.length;
        e2 && (t2 = o$4.get(s2)), void 0 === t2 && ((this.o = t2 = new CSSStyleSheet()).replaceSync(this.cssText), e2 && o$4.set(s2, t2));
      }
      return t2;
    }
    toString() {
      return this.cssText;
    }
  };
  const r$4 = (t2) => new n$3("string" == typeof t2 ? t2 : t2 + "", void 0, s$2), i$3 = (t2, ...e2) => {
    const o2 = 1 === t2.length ? t2[0] : e2.reduce((e3, s2, o3) => e3 + ((t3) => {
      if (true === t3._$cssResult$) return t3.cssText;
      if ("number" == typeof t3) return t3;
      throw Error("Value passed to 'css' function must be a 'css' function result: " + t3 + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
    })(s2) + t2[o3 + 1], t2[0]);
    return new n$3(o2, t2, s$2);
  }, S$1 = (s2, o2) => {
    if (e$2) s2.adoptedStyleSheets = o2.map((t2) => t2 instanceof CSSStyleSheet ? t2 : t2.styleSheet);
    else for (const e2 of o2) {
      const o3 = document.createElement("style"), n2 = t$2.litNonce;
      void 0 !== n2 && o3.setAttribute("nonce", n2), o3.textContent = e2.cssText, s2.appendChild(o3);
    }
  }, c$2 = e$2 ? (t2) => t2 : (t2) => t2 instanceof CSSStyleSheet ? ((t3) => {
    let e2 = "";
    for (const s2 of t3.cssRules) e2 += s2.cssText;
    return r$4(e2);
  })(t2) : t2;
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const { is: i$2, defineProperty: e$1, getOwnPropertyDescriptor: h$1, getOwnPropertyNames: r$3, getOwnPropertySymbols: o$3, getPrototypeOf: n$2 } = Object, a$1 = globalThis, c$1 = a$1.trustedTypes, l$1 = c$1 ? c$1.emptyScript : "", p$1 = a$1.reactiveElementPolyfillSupport, d$1 = (t2, s2) => t2, u$1 = { toAttribute(t2, s2) {
    switch (s2) {
      case Boolean:
        t2 = t2 ? l$1 : null;
        break;
      case Object:
      case Array:
        t2 = null == t2 ? t2 : JSON.stringify(t2);
    }
    return t2;
  }, fromAttribute(t2, s2) {
    let i2 = t2;
    switch (s2) {
      case Boolean:
        i2 = null !== t2;
        break;
      case Number:
        i2 = null === t2 ? null : Number(t2);
        break;
      case Object:
      case Array:
        try {
          i2 = JSON.parse(t2);
        } catch (t3) {
          i2 = null;
        }
    }
    return i2;
  } }, f$1 = (t2, s2) => !i$2(t2, s2), b$1 = { attribute: true, type: String, converter: u$1, reflect: false, useDefault: false, hasChanged: f$1 };
  Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), a$1.litPropertyMetadata ?? (a$1.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
  let y$1 = class y extends HTMLElement {
    static addInitializer(t2) {
      this._$Ei(), (this.l ?? (this.l = [])).push(t2);
    }
    static get observedAttributes() {
      return this.finalize(), this._$Eh && [...this._$Eh.keys()];
    }
    static createProperty(t2, s2 = b$1) {
      if (s2.state && (s2.attribute = false), this._$Ei(), this.prototype.hasOwnProperty(t2) && ((s2 = Object.create(s2)).wrapped = true), this.elementProperties.set(t2, s2), !s2.noAccessor) {
        const i2 = Symbol(), h2 = this.getPropertyDescriptor(t2, i2, s2);
        void 0 !== h2 && e$1(this.prototype, t2, h2);
      }
    }
    static getPropertyDescriptor(t2, s2, i2) {
      const { get: e2, set: r2 } = h$1(this.prototype, t2) ?? { get() {
        return this[s2];
      }, set(t3) {
        this[s2] = t3;
      } };
      return { get: e2, set(s3) {
        const h2 = e2 == null ? void 0 : e2.call(this);
        r2 == null ? void 0 : r2.call(this, s3), this.requestUpdate(t2, h2, i2);
      }, configurable: true, enumerable: true };
    }
    static getPropertyOptions(t2) {
      return this.elementProperties.get(t2) ?? b$1;
    }
    static _$Ei() {
      if (this.hasOwnProperty(d$1("elementProperties"))) return;
      const t2 = n$2(this);
      t2.finalize(), void 0 !== t2.l && (this.l = [...t2.l]), this.elementProperties = new Map(t2.elementProperties);
    }
    static finalize() {
      if (this.hasOwnProperty(d$1("finalized"))) return;
      if (this.finalized = true, this._$Ei(), this.hasOwnProperty(d$1("properties"))) {
        const t3 = this.properties, s2 = [...r$3(t3), ...o$3(t3)];
        for (const i2 of s2) this.createProperty(i2, t3[i2]);
      }
      const t2 = this[Symbol.metadata];
      if (null !== t2) {
        const s2 = litPropertyMetadata.get(t2);
        if (void 0 !== s2) for (const [t3, i2] of s2) this.elementProperties.set(t3, i2);
      }
      this._$Eh = /* @__PURE__ */ new Map();
      for (const [t3, s2] of this.elementProperties) {
        const i2 = this._$Eu(t3, s2);
        void 0 !== i2 && this._$Eh.set(i2, t3);
      }
      this.elementStyles = this.finalizeStyles(this.styles);
    }
    static finalizeStyles(s2) {
      const i2 = [];
      if (Array.isArray(s2)) {
        const e2 = new Set(s2.flat(1 / 0).reverse());
        for (const s3 of e2) i2.unshift(c$2(s3));
      } else void 0 !== s2 && i2.push(c$2(s2));
      return i2;
    }
    static _$Eu(t2, s2) {
      const i2 = s2.attribute;
      return false === i2 ? void 0 : "string" == typeof i2 ? i2 : "string" == typeof t2 ? t2.toLowerCase() : void 0;
    }
    constructor() {
      super(), this._$Ep = void 0, this.isUpdatePending = false, this.hasUpdated = false, this._$Em = null, this._$Ev();
    }
    _$Ev() {
      var _a2;
      this._$ES = new Promise((t2) => this.enableUpdating = t2), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (_a2 = this.constructor.l) == null ? void 0 : _a2.forEach((t2) => t2(this));
    }
    addController(t2) {
      var _a2;
      (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t2), void 0 !== this.renderRoot && this.isConnected && ((_a2 = t2.hostConnected) == null ? void 0 : _a2.call(t2));
    }
    removeController(t2) {
      var _a2;
      (_a2 = this._$EO) == null ? void 0 : _a2.delete(t2);
    }
    _$E_() {
      const t2 = /* @__PURE__ */ new Map(), s2 = this.constructor.elementProperties;
      for (const i2 of s2.keys()) this.hasOwnProperty(i2) && (t2.set(i2, this[i2]), delete this[i2]);
      t2.size > 0 && (this._$Ep = t2);
    }
    createRenderRoot() {
      const t2 = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
      return S$1(t2, this.constructor.elementStyles), t2;
    }
    connectedCallback() {
      var _a2;
      this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(true), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
        var _a3;
        return (_a3 = t2.hostConnected) == null ? void 0 : _a3.call(t2);
      });
    }
    enableUpdating(t2) {
    }
    disconnectedCallback() {
      var _a2;
      (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t2) => {
        var _a3;
        return (_a3 = t2.hostDisconnected) == null ? void 0 : _a3.call(t2);
      });
    }
    attributeChangedCallback(t2, s2, i2) {
      this._$AK(t2, i2);
    }
    _$ET(t2, s2) {
      var _a2;
      const i2 = this.constructor.elementProperties.get(t2), e2 = this.constructor._$Eu(t2, i2);
      if (void 0 !== e2 && true === i2.reflect) {
        const h2 = (void 0 !== ((_a2 = i2.converter) == null ? void 0 : _a2.toAttribute) ? i2.converter : u$1).toAttribute(s2, i2.type);
        this._$Em = t2, null == h2 ? this.removeAttribute(e2) : this.setAttribute(e2, h2), this._$Em = null;
      }
    }
    _$AK(t2, s2) {
      var _a2, _b;
      const i2 = this.constructor, e2 = i2._$Eh.get(t2);
      if (void 0 !== e2 && this._$Em !== e2) {
        const t3 = i2.getPropertyOptions(e2), h2 = "function" == typeof t3.converter ? { fromAttribute: t3.converter } : void 0 !== ((_a2 = t3.converter) == null ? void 0 : _a2.fromAttribute) ? t3.converter : u$1;
        this._$Em = e2;
        const r2 = h2.fromAttribute(s2, t3.type);
        this[e2] = r2 ?? ((_b = this._$Ej) == null ? void 0 : _b.get(e2)) ?? r2, this._$Em = null;
      }
    }
    requestUpdate(t2, s2, i2, e2 = false, h2) {
      var _a2;
      if (void 0 !== t2) {
        const r2 = this.constructor;
        if (false === e2 && (h2 = this[t2]), i2 ?? (i2 = r2.getPropertyOptions(t2)), !((i2.hasChanged ?? f$1)(h2, s2) || i2.useDefault && i2.reflect && h2 === ((_a2 = this._$Ej) == null ? void 0 : _a2.get(t2)) && !this.hasAttribute(r2._$Eu(t2, i2)))) return;
        this.C(t2, s2, i2);
      }
      false === this.isUpdatePending && (this._$ES = this._$EP());
    }
    C(t2, s2, { useDefault: i2, reflect: e2, wrapped: h2 }, r2) {
      i2 && !(this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Map())).has(t2) && (this._$Ej.set(t2, r2 ?? s2 ?? this[t2]), true !== h2 || void 0 !== r2) || (this._$AL.has(t2) || (this.hasUpdated || i2 || (s2 = void 0), this._$AL.set(t2, s2)), true === e2 && this._$Em !== t2 && (this._$Eq ?? (this._$Eq = /* @__PURE__ */ new Set())).add(t2));
    }
    async _$EP() {
      this.isUpdatePending = true;
      try {
        await this._$ES;
      } catch (t3) {
        Promise.reject(t3);
      }
      const t2 = this.scheduleUpdate();
      return null != t2 && await t2, !this.isUpdatePending;
    }
    scheduleUpdate() {
      return this.performUpdate();
    }
    performUpdate() {
      var _a2;
      if (!this.isUpdatePending) return;
      if (!this.hasUpdated) {
        if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
          for (const [t4, s3] of this._$Ep) this[t4] = s3;
          this._$Ep = void 0;
        }
        const t3 = this.constructor.elementProperties;
        if (t3.size > 0) for (const [s3, i2] of t3) {
          const { wrapped: t4 } = i2, e2 = this[s3];
          true !== t4 || this._$AL.has(s3) || void 0 === e2 || this.C(s3, void 0, i2, e2);
        }
      }
      let t2 = false;
      const s2 = this._$AL;
      try {
        t2 = this.shouldUpdate(s2), t2 ? (this.willUpdate(s2), (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
          var _a3;
          return (_a3 = t3.hostUpdate) == null ? void 0 : _a3.call(t3);
        }), this.update(s2)) : this._$EM();
      } catch (s3) {
        throw t2 = false, this._$EM(), s3;
      }
      t2 && this._$AE(s2);
    }
    willUpdate(t2) {
    }
    _$AE(t2) {
      var _a2;
      (_a2 = this._$EO) == null ? void 0 : _a2.forEach((t3) => {
        var _a3;
        return (_a3 = t3.hostUpdated) == null ? void 0 : _a3.call(t3);
      }), this.hasUpdated || (this.hasUpdated = true, this.firstUpdated(t2)), this.updated(t2);
    }
    _$EM() {
      this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = false;
    }
    get updateComplete() {
      return this.getUpdateComplete();
    }
    getUpdateComplete() {
      return this._$ES;
    }
    shouldUpdate(t2) {
      return true;
    }
    update(t2) {
      this._$Eq && (this._$Eq = this._$Eq.forEach((t3) => this._$ET(t3, this[t3]))), this._$EM();
    }
    updated(t2) {
    }
    firstUpdated(t2) {
    }
  };
  y$1.elementStyles = [], y$1.shadowRootOptions = { mode: "open" }, y$1[d$1("elementProperties")] = /* @__PURE__ */ new Map(), y$1[d$1("finalized")] = /* @__PURE__ */ new Map(), p$1 == null ? void 0 : p$1({ ReactiveElement: y$1 }), (a$1.reactiveElementVersions ?? (a$1.reactiveElementVersions = [])).push("2.1.2");
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t$1 = globalThis, i$1 = (t2) => t2, s$1 = t$1.trustedTypes, e = s$1 ? s$1.createPolicy("lit-html", { createHTML: (t2) => t2 }) : void 0, h = "$lit$", o$2 = `lit$${Math.random().toFixed(9).slice(2)}$`, n$1 = "?" + o$2, r$2 = `<${n$1}>`, l = document, c = () => l.createComment(""), a = (t2) => null === t2 || "object" != typeof t2 && "function" != typeof t2, u = Array.isArray, d = (t2) => u(t2) || "function" == typeof (t2 == null ? void 0 : t2[Symbol.iterator]), f = "[ 	\n\f\r]", v = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, _ = /-->/g, m = />/g, p = RegExp(`>|${f}(?:([^\\s"'>=/]+)(${f}*=${f}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), g = /'/g, $ = /"/g, y = /^(?:script|style|textarea|title)$/i, x = (t2) => (i2, ...s2) => ({ _$litType$: t2, strings: i2, values: s2 }), b = x(1), E = Symbol.for("lit-noChange"), A = Symbol.for("lit-nothing"), C = /* @__PURE__ */ new WeakMap(), P = l.createTreeWalker(l, 129);
  function V(t2, i2) {
    if (!u(t2) || !t2.hasOwnProperty("raw")) throw Error("invalid template strings array");
    return void 0 !== e ? e.createHTML(i2) : i2;
  }
  const N = (t2, i2) => {
    const s2 = t2.length - 1, e2 = [];
    let n2, l2 = 2 === i2 ? "<svg>" : 3 === i2 ? "<math>" : "", c2 = v;
    for (let i3 = 0; i3 < s2; i3++) {
      const s3 = t2[i3];
      let a2, u2, d2 = -1, f2 = 0;
      for (; f2 < s3.length && (c2.lastIndex = f2, u2 = c2.exec(s3), null !== u2); ) f2 = c2.lastIndex, c2 === v ? "!--" === u2[1] ? c2 = _ : void 0 !== u2[1] ? c2 = m : void 0 !== u2[2] ? (y.test(u2[2]) && (n2 = RegExp("</" + u2[2], "g")), c2 = p) : void 0 !== u2[3] && (c2 = p) : c2 === p ? ">" === u2[0] ? (c2 = n2 ?? v, d2 = -1) : void 0 === u2[1] ? d2 = -2 : (d2 = c2.lastIndex - u2[2].length, a2 = u2[1], c2 = void 0 === u2[3] ? p : '"' === u2[3] ? $ : g) : c2 === $ || c2 === g ? c2 = p : c2 === _ || c2 === m ? c2 = v : (c2 = p, n2 = void 0);
      const x2 = c2 === p && t2[i3 + 1].startsWith("/>") ? " " : "";
      l2 += c2 === v ? s3 + r$2 : d2 >= 0 ? (e2.push(a2), s3.slice(0, d2) + h + s3.slice(d2) + o$2 + x2) : s3 + o$2 + (-2 === d2 ? i3 : x2);
    }
    return [V(t2, l2 + (t2[s2] || "<?>") + (2 === i2 ? "</svg>" : 3 === i2 ? "</math>" : "")), e2];
  };
  class S {
    constructor({ strings: t2, _$litType$: i2 }, e2) {
      let r2;
      this.parts = [];
      let l2 = 0, a2 = 0;
      const u2 = t2.length - 1, d2 = this.parts, [f2, v2] = N(t2, i2);
      if (this.el = S.createElement(f2, e2), P.currentNode = this.el.content, 2 === i2 || 3 === i2) {
        const t3 = this.el.content.firstChild;
        t3.replaceWith(...t3.childNodes);
      }
      for (; null !== (r2 = P.nextNode()) && d2.length < u2; ) {
        if (1 === r2.nodeType) {
          if (r2.hasAttributes()) for (const t3 of r2.getAttributeNames()) if (t3.endsWith(h)) {
            const i3 = v2[a2++], s2 = r2.getAttribute(t3).split(o$2), e3 = /([.?@])?(.*)/.exec(i3);
            d2.push({ type: 1, index: l2, name: e3[2], strings: s2, ctor: "." === e3[1] ? I : "?" === e3[1] ? L : "@" === e3[1] ? z : H }), r2.removeAttribute(t3);
          } else t3.startsWith(o$2) && (d2.push({ type: 6, index: l2 }), r2.removeAttribute(t3));
          if (y.test(r2.tagName)) {
            const t3 = r2.textContent.split(o$2), i3 = t3.length - 1;
            if (i3 > 0) {
              r2.textContent = s$1 ? s$1.emptyScript : "";
              for (let s2 = 0; s2 < i3; s2++) r2.append(t3[s2], c()), P.nextNode(), d2.push({ type: 2, index: ++l2 });
              r2.append(t3[i3], c());
            }
          }
        } else if (8 === r2.nodeType) if (r2.data === n$1) d2.push({ type: 2, index: l2 });
        else {
          let t3 = -1;
          for (; -1 !== (t3 = r2.data.indexOf(o$2, t3 + 1)); ) d2.push({ type: 7, index: l2 }), t3 += o$2.length - 1;
        }
        l2++;
      }
    }
    static createElement(t2, i2) {
      const s2 = l.createElement("template");
      return s2.innerHTML = t2, s2;
    }
  }
  function M(t2, i2, s2 = t2, e2) {
    var _a2, _b;
    if (i2 === E) return i2;
    let h2 = void 0 !== e2 ? (_a2 = s2._$Co) == null ? void 0 : _a2[e2] : s2._$Cl;
    const o2 = a(i2) ? void 0 : i2._$litDirective$;
    return (h2 == null ? void 0 : h2.constructor) !== o2 && ((_b = h2 == null ? void 0 : h2._$AO) == null ? void 0 : _b.call(h2, false), void 0 === o2 ? h2 = void 0 : (h2 = new o2(t2), h2._$AT(t2, s2, e2)), void 0 !== e2 ? (s2._$Co ?? (s2._$Co = []))[e2] = h2 : s2._$Cl = h2), void 0 !== h2 && (i2 = M(t2, h2._$AS(t2, i2.values), h2, e2)), i2;
  }
  class R {
    constructor(t2, i2) {
      this._$AV = [], this._$AN = void 0, this._$AD = t2, this._$AM = i2;
    }
    get parentNode() {
      return this._$AM.parentNode;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    u(t2) {
      const { el: { content: i2 }, parts: s2 } = this._$AD, e2 = ((t2 == null ? void 0 : t2.creationScope) ?? l).importNode(i2, true);
      P.currentNode = e2;
      let h2 = P.nextNode(), o2 = 0, n2 = 0, r2 = s2[0];
      for (; void 0 !== r2; ) {
        if (o2 === r2.index) {
          let i3;
          2 === r2.type ? i3 = new k(h2, h2.nextSibling, this, t2) : 1 === r2.type ? i3 = new r2.ctor(h2, r2.name, r2.strings, this, t2) : 6 === r2.type && (i3 = new Z(h2, this, t2)), this._$AV.push(i3), r2 = s2[++n2];
        }
        o2 !== (r2 == null ? void 0 : r2.index) && (h2 = P.nextNode(), o2++);
      }
      return P.currentNode = l, e2;
    }
    p(t2) {
      let i2 = 0;
      for (const s2 of this._$AV) void 0 !== s2 && (void 0 !== s2.strings ? (s2._$AI(t2, s2, i2), i2 += s2.strings.length - 2) : s2._$AI(t2[i2])), i2++;
    }
  }
  class k {
    get _$AU() {
      var _a2;
      return ((_a2 = this._$AM) == null ? void 0 : _a2._$AU) ?? this._$Cv;
    }
    constructor(t2, i2, s2, e2) {
      this.type = 2, this._$AH = A, this._$AN = void 0, this._$AA = t2, this._$AB = i2, this._$AM = s2, this.options = e2, this._$Cv = (e2 == null ? void 0 : e2.isConnected) ?? true;
    }
    get parentNode() {
      let t2 = this._$AA.parentNode;
      const i2 = this._$AM;
      return void 0 !== i2 && 11 === (t2 == null ? void 0 : t2.nodeType) && (t2 = i2.parentNode), t2;
    }
    get startNode() {
      return this._$AA;
    }
    get endNode() {
      return this._$AB;
    }
    _$AI(t2, i2 = this) {
      t2 = M(this, t2, i2), a(t2) ? t2 === A || null == t2 || "" === t2 ? (this._$AH !== A && this._$AR(), this._$AH = A) : t2 !== this._$AH && t2 !== E && this._(t2) : void 0 !== t2._$litType$ ? this.$(t2) : void 0 !== t2.nodeType ? this.T(t2) : d(t2) ? this.k(t2) : this._(t2);
    }
    O(t2) {
      return this._$AA.parentNode.insertBefore(t2, this._$AB);
    }
    T(t2) {
      this._$AH !== t2 && (this._$AR(), this._$AH = this.O(t2));
    }
    _(t2) {
      this._$AH !== A && a(this._$AH) ? this._$AA.nextSibling.data = t2 : this.T(l.createTextNode(t2)), this._$AH = t2;
    }
    $(t2) {
      var _a2;
      const { values: i2, _$litType$: s2 } = t2, e2 = "number" == typeof s2 ? this._$AC(t2) : (void 0 === s2.el && (s2.el = S.createElement(V(s2.h, s2.h[0]), this.options)), s2);
      if (((_a2 = this._$AH) == null ? void 0 : _a2._$AD) === e2) this._$AH.p(i2);
      else {
        const t3 = new R(e2, this), s3 = t3.u(this.options);
        t3.p(i2), this.T(s3), this._$AH = t3;
      }
    }
    _$AC(t2) {
      let i2 = C.get(t2.strings);
      return void 0 === i2 && C.set(t2.strings, i2 = new S(t2)), i2;
    }
    k(t2) {
      u(this._$AH) || (this._$AH = [], this._$AR());
      const i2 = this._$AH;
      let s2, e2 = 0;
      for (const h2 of t2) e2 === i2.length ? i2.push(s2 = new k(this.O(c()), this.O(c()), this, this.options)) : s2 = i2[e2], s2._$AI(h2), e2++;
      e2 < i2.length && (this._$AR(s2 && s2._$AB.nextSibling, e2), i2.length = e2);
    }
    _$AR(t2 = this._$AA.nextSibling, s2) {
      var _a2;
      for ((_a2 = this._$AP) == null ? void 0 : _a2.call(this, false, true, s2); t2 !== this._$AB; ) {
        const s3 = i$1(t2).nextSibling;
        i$1(t2).remove(), t2 = s3;
      }
    }
    setConnected(t2) {
      var _a2;
      void 0 === this._$AM && (this._$Cv = t2, (_a2 = this._$AP) == null ? void 0 : _a2.call(this, t2));
    }
  }
  class H {
    get tagName() {
      return this.element.tagName;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    constructor(t2, i2, s2, e2, h2) {
      this.type = 1, this._$AH = A, this._$AN = void 0, this.element = t2, this.name = i2, this._$AM = e2, this.options = h2, s2.length > 2 || "" !== s2[0] || "" !== s2[1] ? (this._$AH = Array(s2.length - 1).fill(new String()), this.strings = s2) : this._$AH = A;
    }
    _$AI(t2, i2 = this, s2, e2) {
      const h2 = this.strings;
      let o2 = false;
      if (void 0 === h2) t2 = M(this, t2, i2, 0), o2 = !a(t2) || t2 !== this._$AH && t2 !== E, o2 && (this._$AH = t2);
      else {
        const e3 = t2;
        let n2, r2;
        for (t2 = h2[0], n2 = 0; n2 < h2.length - 1; n2++) r2 = M(this, e3[s2 + n2], i2, n2), r2 === E && (r2 = this._$AH[n2]), o2 || (o2 = !a(r2) || r2 !== this._$AH[n2]), r2 === A ? t2 = A : t2 !== A && (t2 += (r2 ?? "") + h2[n2 + 1]), this._$AH[n2] = r2;
      }
      o2 && !e2 && this.j(t2);
    }
    j(t2) {
      t2 === A ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t2 ?? "");
    }
  }
  class I extends H {
    constructor() {
      super(...arguments), this.type = 3;
    }
    j(t2) {
      this.element[this.name] = t2 === A ? void 0 : t2;
    }
  }
  class L extends H {
    constructor() {
      super(...arguments), this.type = 4;
    }
    j(t2) {
      this.element.toggleAttribute(this.name, !!t2 && t2 !== A);
    }
  }
  class z extends H {
    constructor(t2, i2, s2, e2, h2) {
      super(t2, i2, s2, e2, h2), this.type = 5;
    }
    _$AI(t2, i2 = this) {
      if ((t2 = M(this, t2, i2, 0) ?? A) === E) return;
      const s2 = this._$AH, e2 = t2 === A && s2 !== A || t2.capture !== s2.capture || t2.once !== s2.once || t2.passive !== s2.passive, h2 = t2 !== A && (s2 === A || e2);
      e2 && this.element.removeEventListener(this.name, this, s2), h2 && this.element.addEventListener(this.name, this, t2), this._$AH = t2;
    }
    handleEvent(t2) {
      var _a2;
      "function" == typeof this._$AH ? this._$AH.call(((_a2 = this.options) == null ? void 0 : _a2.host) ?? this.element, t2) : this._$AH.handleEvent(t2);
    }
  }
  class Z {
    constructor(t2, i2, s2) {
      this.element = t2, this.type = 6, this._$AN = void 0, this._$AM = i2, this.options = s2;
    }
    get _$AU() {
      return this._$AM._$AU;
    }
    _$AI(t2) {
      M(this, t2);
    }
  }
  const B = t$1.litHtmlPolyfillSupport;
  B == null ? void 0 : B(S, k), (t$1.litHtmlVersions ?? (t$1.litHtmlVersions = [])).push("3.3.2");
  const D = (t2, i2, s2) => {
    const e2 = (s2 == null ? void 0 : s2.renderBefore) ?? i2;
    let h2 = e2._$litPart$;
    if (void 0 === h2) {
      const t3 = (s2 == null ? void 0 : s2.renderBefore) ?? null;
      e2._$litPart$ = h2 = new k(i2.insertBefore(c(), t3), t3, void 0, s2 ?? {});
    }
    return h2._$AI(t2), h2;
  };
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const s = globalThis;
  class i extends y$1 {
    constructor() {
      super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
    }
    createRenderRoot() {
      var _a2;
      const t2 = super.createRenderRoot();
      return (_a2 = this.renderOptions).renderBefore ?? (_a2.renderBefore = t2.firstChild), t2;
    }
    update(t2) {
      const r2 = this.render();
      this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t2), this._$Do = D(r2, this.renderRoot, this.renderOptions);
    }
    connectedCallback() {
      var _a2;
      super.connectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(true);
    }
    disconnectedCallback() {
      var _a2;
      super.disconnectedCallback(), (_a2 = this._$Do) == null ? void 0 : _a2.setConnected(false);
    }
    render() {
      return E;
    }
  }
  i._$litElement$ = true, i["finalized"] = true, (_a = s.litElementHydrateSupport) == null ? void 0 : _a.call(s, { LitElement: i });
  const o$1 = s.litElementPolyfillSupport;
  o$1 == null ? void 0 : o$1({ LitElement: i });
  (s.litElementVersions ?? (s.litElementVersions = [])).push("4.2.2");
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const t = (t2) => (e2, o2) => {
    void 0 !== o2 ? o2.addInitializer(() => {
      customElements.define(t2, e2);
    }) : customElements.define(t2, e2);
  };
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  const o = { attribute: true, type: String, converter: u$1, reflect: false, hasChanged: f$1 }, r$1 = (t2 = o, e2, r2) => {
    const { kind: n2, metadata: i2 } = r2;
    let s2 = globalThis.litPropertyMetadata.get(i2);
    if (void 0 === s2 && globalThis.litPropertyMetadata.set(i2, s2 = /* @__PURE__ */ new Map()), "setter" === n2 && ((t2 = Object.create(t2)).wrapped = true), s2.set(r2.name, t2), "accessor" === n2) {
      const { name: o2 } = r2;
      return { set(r3) {
        const n3 = e2.get.call(this);
        e2.set.call(this, r3), this.requestUpdate(o2, n3, t2, true, r3);
      }, init(e3) {
        return void 0 !== e3 && this.C(o2, void 0, t2, e3), e3;
      } };
    }
    if ("setter" === n2) {
      const { name: o2 } = r2;
      return function(r3) {
        const n3 = this[o2];
        e2.call(this, r3), this.requestUpdate(o2, n3, t2, true, r3);
      };
    }
    throw Error("Unsupported decorator location: " + n2);
  };
  function n(t2) {
    return (e2, o2) => "object" == typeof o2 ? r$1(t2, e2, o2) : ((t3, e3, o3) => {
      const r2 = e3.hasOwnProperty(o3);
      return e3.constructor.createProperty(o3, t3), r2 ? Object.getOwnPropertyDescriptor(e3, o3) : void 0;
    })(t2, e2, o2);
  }
  /**
   * @license
   * Copyright 2017 Google LLC
   * SPDX-License-Identifier: BSD-3-Clause
   */
  function r(r2) {
    return n({ ...r2, state: true, attribute: false });
  }
  var __defProp$1 = Object.defineProperty;
  var __getOwnPropDesc$1 = Object.getOwnPropertyDescriptor;
  var __decorateClass$1 = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc$1(target, key) : target;
    for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
      if (decorator = decorators[i2])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp$1(target, key, result);
    return result;
  };
  let TimestampRecorder = class extends i {
    // ========== 生命周期方法 ==========
    constructor() {
      super();
      this.currentTime = /* @__PURE__ */ new Date();
      this.currentLiveTime = this.formatLiveTime();
      this.inputValue = "";
      this.isTimerConnected = false;
      this.intervalId = null;
      this.connectTimingId = null;
      this.keyboardEventListener = null;
      this.isLive = false;
      this.liveStartTime = 0;
      this.timePrefix = "\u8BB0\u5F55\u5F53\u524D\u65F6\u95F4\u70B9: ";
      this.autoBlurTimeout = 3e4;
      this.enableShortcut = true;
      this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    // ========== 计算属性 ==========
    /**
     * 获取修剪后的输入值
     */
    get trimmedInputValue() {
      return this.inputValue.trim();
    }
    /**
     * 提交按钮是否可用
     */
    get isSubmitEnabled() {
      return this.isLive && this.trimmedInputValue.length > 0;
    }
    connectedCallback() {
      super.connectedCallback();
      this.startTimer();
      this.setupKeyboardShortcut();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this.cleanup();
    }
    /**
     * 清理所有定时器和事件监听器
     */
    cleanup() {
      this.stopTimer();
      this.clearConnectTiming();
      this.removeKeyboardShortcut();
    }
    // ========== 定时器管理 ==========
    /**
     * 启动时间更新定时器
     */
    startTimer() {
      if (this.isTimerConnected || this.intervalId) {
        return;
      }
      this.isTimerConnected = true;
      this.updateTimes();
      this.intervalId = window.setInterval(() => {
        this.updateTimes();
      }, 1e3);
    }
    /**
     * 停止时间更新定时器
     */
    stopTimer() {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.isTimerConnected = false;
      }
    }
    /**
     * 更新所有时间显示
     */
    updateTimes() {
      this.currentTime = /* @__PURE__ */ new Date();
      if (this.isLive) {
        this.currentLiveTime = this.formatLiveTime();
      }
    }
    // ========== 键盘快捷键 ==========
    /**
     * 设置Alt+E键盘快捷键
     */
    setupKeyboardShortcut() {
      if (!this.enableShortcut || this.keyboardEventListener) {
        return;
      }
      this.keyboardEventListener = this.handleKeyDown.bind(this);
      window.addEventListener("keydown", this.keyboardEventListener);
    }
    /**
     * 移除键盘快捷键监听器
     */
    removeKeyboardShortcut() {
      if (this.keyboardEventListener) {
        window.removeEventListener("keydown", this.keyboardEventListener);
        this.keyboardEventListener = null;
      }
    }
    /**
     * 键盘事件处理器
     * 支持 Alt+E 聚焦输入框
     */
    handleKeyDown(event) {
      var _a2;
      if (event.altKey && event.key === "e" && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        if (((_a2 = this.shadowRoot) == null ? void 0 : _a2.activeElement) === this.textarea) {
          this.blurInput();
        } else {
          this.focusInput();
        }
      }
    }
    /**
     * 聚焦到输入框
     */
    focusInput() {
      var _a2;
      const textarea = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("textarea");
      if (textarea) {
        textarea.focus();
        const length = this.inputValue.length;
        textarea.setSelectionRange(length, length);
      }
    }
    /**
     * 失焦输入框
     */
    blurInput() {
      var _a2;
      const textarea = (_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("textarea");
      if (textarea) {
        textarea.blur();
      }
    }
    /**
     * 按下 Ctrl + Enter 键, 触发提交
     */
    handleEnter(e2) {
      if (e2.key === "Enter" && e2.ctrlKey && !e2.altKey) {
        this.handleSubmit();
      }
    }
    // ========== 输入框相关方法 ==========
    /**
     * 获取textarea元素（用于类型安全）
     */
    get textarea() {
      var _a2;
      return ((_a2 = this.shadowRoot) == null ? void 0 : _a2.querySelector("textarea")) || null;
    }
    /**
     * 输入框聚焦事件处理器
     * 暂停自动计时，开始连接计时
     */
    handleFocusInput(event) {
      this.stopTimer();
      const target = event.target;
      this.startConnectTiming(target);
    }
    /**
     * 输入框失焦事件处理器
     * 恢复自动计时，清除连接计时
     */
    handleBlurInput() {
      this.startTimer();
      this.clearConnectTiming();
    }
    /**
     * 开始连接计时（输入框自动失焦）
     */
    startConnectTiming(target) {
      this.clearConnectTiming();
      this.connectTimingId = window.setTimeout(() => {
        if (!this.trimmedInputValue && document.activeElement === target) {
          target.blur();
        }
      }, this.autoBlurTimeout);
    }
    /**
     * 清除连接计时
     */
    clearConnectTiming() {
      if (this.connectTimingId) {
        clearTimeout(this.connectTimingId);
        this.connectTimingId = null;
      }
    }
    /**
     * 输入事件处理器
     */
    handleInputChange(event) {
      const target = event.target;
      this.inputValue = target.value;
      if (document.activeElement === target) {
        this.startConnectTiming(target);
      }
    }
    // ========== 时间格式化方法 ==========
    /**
     * 格式化世界时间 (HH:MM:SS)
     */
    formatWorldTime(date) {
      const hours = date.getHours().toString().padStart(2, "0");
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const seconds = date.getSeconds().toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }
    /**
     * 格式化直播时间 (HH:MM:SS)
     */
    formatLiveTime() {
      const elapsed = Date.now() - this.liveStartTime;
      const totalSeconds = Math.floor(elapsed / 1e3);
      const hours = Math.floor(totalSeconds / 3600).toString().padStart(2, "0");
      const minutes = Math.floor(totalSeconds % 3600 / 60).toString().padStart(2, "0");
      const seconds = (totalSeconds % 60).toString().padStart(2, "0");
      return `${hours}:${minutes}:${seconds}`;
    }
    // ========== 业务逻辑方法 ==========
    /**
     * 打开记录列表（待实现）
     */
    handleOpenRecordList() {
      this.dispatchEvent(new CustomEvent("open-record-list", {
        bubbles: true,
        composed: true
      }));
    }
    /**
     * 提交时间记录
     */
    handleSubmit() {
      if (!this.isSubmitEnabled) {
        return;
      }
      const detail = {
        // 记录的世界时间
        timestamp: this.currentTime.getTime(),
        // 记录的直播时间
        liveTimestamp: this.currentLiveTime,
        // 记录内容
        note: this.trimmedInputValue,
        // 直播开始时间
        liveStartTime: this.liveStartTime
      };
      this.dispatchEvent(new CustomEvent("timestamp-recorded", {
        detail,
        bubbles: true,
        composed: true
      }));
      this.inputValue = "";
      this.focusInput();
    }
    // ========== 渲染方法 ==========
    render() {
      return b`
			<section class="container">
				<header class="header">
					<span class="time-prefix">${this.timePrefix}</span>
					<span
						class="time world-time">${this.formatWorldTime(this.currentTime)}</span>
					<span
						class="time live-time">${this.currentLiveTime}</span>
				</header>
				<main class="main">
                <textarea
	                class="input"
	                .value=${this.inputValue}
	                @input=${this.handleInputChange}
	                @focus=${this.handleFocusInput}
	                @blur=${this.handleBlurInput}
	                @keydown=${this.handleEnter}
	                placeholder="输入时间点备注..."
	                rows="3"
                ></textarea>
				</main>
				<footer class="footer">
					<button
						class="action-button query-button"
						@click=${this.handleOpenRecordList}
					>
						查询记录
					</button>
					<button
						class="action-button submit-button"
						@click=${this.handleSubmit}
						?disabled=${!(this.isLive && this.inputValue.trim())}
					>
						记录
					</button>
				</footer>
			</section>
		`;
    }
  };
  TimestampRecorder.styles = i$3`
		
		.container {
			padding: 12px;
			position: relative;
			background-color: #F6F7F8;
			display: flex;
			align-content: center;
			justify-content: center;
			flex-direction: column;
			gap: 8px;
			border-top: 1px solid #E3E5E7;
		}
		
		.container:hover .world-time,
		.container:has(.input:focus) .world-time {
			display: none;
		}
		
		.container:hover .live-time,
		.container:has(.input:focus) .live-time {
			display: block;
		}
		
		.header {
			color: #9499A0;
			line-height: 20px;
			display: flex;
			justify-content: space-between;
		}
		
		.time-prefix {
			font-size: 15px;
			user-select: none;
		}
		
		.time {
			font-size: 12px;
		}
		
		.live-time {
			display: none;
			color: #3e4744;
		}
		
		
		.main {
			display: flex;
			font-size: 0;
			border: 1px solid #E3E5E7;
			background-color: #FFFFFF;
			border-radius: 4px;
			flex-direction: column;
		}
		
		.input {
			height: 56px;
			width: 100%;
			resize: none;
			outline: 0;
			border: 0;
			background-color: #FFFFFF;
			border-radius: 4px;
			padding: 8px;
			color: #2F3238;
			overflow: hidden;
			font-size: 12px;
			line-height: 19px;
			box-sizing: border-box;
			font-family: inherit;
		}
		
		.input:focus-visible {
			outline: 2px solid #E3E5E7;
		}
		
		.footer {
			align-self: flex-end;
			display: flex;
			justify-content: space-between;
			width: 100%;
		}
		
		.action-button {
			width: 80px;
			min-width: 80px;
			height: 24px;
			font-size: 12px;
			background-color: #23ade5;
			color: #fff;
			border-radius: 4px;
			box-sizing: border-box;
			line-height: 1;
			border: 0;
			outline: 0;
			overflow: hidden;
			cursor: pointer;
			font-family: inherit;
			transition: background-color 0.2s;
		}
		
		.query-button {
			background-color: #9499A0;
		}
		
		.query-button:hover {
			background-color: #7f8287;
		}
		
		.submit-button:hover {
			background-color: #1c9bc9;
		}
		
		.submit-button:active {
			background-color: #1787b0;
		}
		
		.submit-button:disabled {
			background-color: #ccc;
			cursor: not-allowed;
		}
	`;
  __decorateClass$1([
    r()
  ], TimestampRecorder.prototype, "currentTime", 2);
  __decorateClass$1([
    r()
  ], TimestampRecorder.prototype, "currentLiveTime", 2);
  __decorateClass$1([
    r()
  ], TimestampRecorder.prototype, "inputValue", 2);
  __decorateClass$1([
    r()
  ], TimestampRecorder.prototype, "isTimerConnected", 2);
  __decorateClass$1([
    n({ type: Boolean, attribute: "is-live" })
  ], TimestampRecorder.prototype, "isLive", 2);
  __decorateClass$1([
    n({ type: Number })
  ], TimestampRecorder.prototype, "liveStartTime", 2);
  __decorateClass$1([
    n({ type: String })
  ], TimestampRecorder.prototype, "timePrefix", 2);
  __decorateClass$1([
    n({ type: Number })
  ], TimestampRecorder.prototype, "autoBlurTimeout", 2);
  __decorateClass$1([
    n({ type: Boolean, attribute: "enable-shortcut" })
  ], TimestampRecorder.prototype, "enableShortcut", 2);
  TimestampRecorder = __decorateClass$1([
    t("timestamp-recorder")
  ], TimestampRecorder);
  const initTimestampRecorder = async (liveStartTime = 0, isLive = true) => {
    const timestampRecorder = document.createElement("timestamp-recorder");
    timestampRecorder.isLive = isLive;
    timestampRecorder.liveStartTime = liveStartTime;
    const container = await elementWaiter(".aside-area");
    container.append(timestampRecorder);
    return timestampRecorder;
  };
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __decorateClass = (decorators, target, key, kind) => {
    var result = kind > 1 ? void 0 : kind ? __getOwnPropDesc(target, key) : target;
    for (var i2 = decorators.length - 1, decorator; i2 >= 0; i2--)
      if (decorator = decorators[i2])
        result = (kind ? decorator(target, key, result) : decorator(result)) || result;
    if (kind && result) __defProp(target, key, result);
    return result;
  };
  let HistoryModal = class extends i {
    constructor() {
      super(...arguments);
      this.open = false;
      this.roomId = 0;
      this.expandedSession = 0;
      this.historyData = [];
      this.handleKeyDown = (e2) => {
        if (e2.key === "Escape" && this.open) this.closeModal();
      };
    }
    connectedCallback() {
      super.connectedCallback();
      window.addEventListener("keydown", this.handleKeyDown);
      this.expandedSession = this.historyData.length > 0 ? this.historyData[0].liveStartTime : 0;
    }
    disconnectedCallback() {
      window.removeEventListener("keydown", this.handleKeyDown);
      super.disconnectedCallback();
    }
    closeModal() {
      this.dispatchEvent(new CustomEvent("close", { bubbles: true }));
    }
    saveHistory() {
      this.dispatchEvent(new CustomEvent("history-updated", {
        detail: this.historyData,
        bubbles: true
      }));
    }
    toggleSession(sessionTime) {
      this.expandedSession = this.expandedSession === sessionTime ? 0 : sessionTime;
    }
    downloadSession(sessionTime) {
      const session = this.historyData.find((s2) => s2.liveStartTime === sessionTime);
      if (!session) return;
      this.dispatchEvent(new CustomEvent("download-session", {
        detail: session,
        bubbles: true
      }));
    }
    deleteSession(sessionTime) {
      if (!confirm("\u786E\u5B9A\u8981\u5220\u9664\u6B64\u573A\u6B21\u8BB0\u5F55\uFF1F")) return;
      this.historyData = this.historyData.filter((s2) => s2.liveStartTime !== sessionTime);
      this.saveHistory();
      if (this.expandedSession === sessionTime) {
        this.expandedSession = 0;
      }
    }
    clearAll() {
      if (!confirm("\u786E\u5B9A\u8981\u6E05\u7A7A\u6240\u6709\u5386\u53F2\u8BB0\u5F55\uFF1F\u6B64\u64CD\u4F5C\u4E0D\u53EF\u6062\u590D\uFF01")) return;
      this.historyData = [];
      this.expandedSession = 0;
      this.saveHistory();
    }
    formatDate(timestamp) {
      return new Date(timestamp).toLocaleDateString("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
      });
    }
    formatTime(timeStr) {
      if (typeof timeStr === "number") {
        const date = new Date(timeStr);
        return date.toLocaleString();
      }
      return timeStr.length === 5 ? `${timeStr}:00` : timeStr;
    }
    renderEmptyState() {
      return b`
			<div class="empty-state">
				<p class="empty-text">暂无任何标记记录，开始你的第一次标记吧！</p>
			</div>
		`;
    }
    renderSessionRow(session) {
      const isExpanded = this.expandedSession === session.liveStartTime;
      const markerRows = session.records.map((marker, index) => b`
			<tr class="marker-row">
				<td>${index + 1}</td>
				<td>${this.formatTime(marker.localTime)}</td>
				<td>${this.formatTime(marker.liveTime)}</td>
				<td class="content-cell">${marker.content}</td>
			</tr>
		`);
      return b`
			<tr class="session-row ${isExpanded ? "expanded" : ""}">
				<td>${this.formatDate(session.liveStartTime)}</td>
				<td class="title-cell">${session.liveTitle}</td>
				<td>${session.records.length}</td>
				<td class="actions">
					<button
						class="detail-btn"
						@click=${() => this.toggleSession(session.liveStartTime)}
						aria-expanded=${isExpanded}
					>
						详情 ${isExpanded ? "\u25B4" : "\u25BE"}
					</button>
					<button class="download-btn"
					        @click=${() => this.downloadSession(session.liveStartTime)}>
						${this.renderDownloadIcon()}
					</button>
					<button class="delete-btn"
					        @click=${() => this.deleteSession(session.liveStartTime)}>
						${this.renderDeleteIcon()}
					</button>
				</td>
			</tr>
			<tr class="sub-table-row ${isExpanded ? "visible" : ""}">
				<td colspan="4">
					<div class="sub-table-container">
						<table class="sub-table">
							<thead>
							<tr>
								<th>#</th>
								<th>本地时间</th>
								<th>直播时间</th>
								<th>标记内容</th>
							</tr>
							</thead>
							<tbody>
							${markerRows}
							</tbody>
						</table>
					</div>
				</td>
			</tr>
		`;
    }
    renderDownloadIcon() {
      return b`
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
			     viewBox="0 0 24 24" fill="none" stroke="currentColor"
			     stroke-width="2">
				<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
				<polyline points="7 10 12 15 17 10"></polyline>
				<line x1="12" y1="15" x2="12" y2="3"></line>
			</svg>
		`;
    }
    renderDeleteIcon() {
      return b`
			<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
			     viewBox="0 0 24 24" fill="none" stroke="currentColor"
			     stroke-width="2">
				<circle cx="12" cy="12" r="10"></circle>
				<line x1="15" y1="9" x2="9" y2="15"></line>
				<line x1="9" y1="9" x2="15" y2="15"></line>
			</svg>
		`;
    }
    renderCloseIcon() {
      return b`
			<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
			     viewBox="0 0 24 24" fill="none" stroke="currentColor"
			     stroke-width="2">
				<line x1="18" y1="6" x2="6" y2="18"></line>
				<line x1="6" y1="6" x2="18" y2="18"></line>
			</svg>
		`;
    }
    render() {
      return b`
			${this.open ? b`
				<div class="overlay" @click=${this.closeModal}></div>
				<div class="modal">
					<div class="modal-content glass-card">
						<div class="modal-header">
							<h2 class="modal-title">直播标记历史记录</h2>
							<button class="close-btn"
							        @click=${this.closeModal}
							        aria-label="关闭">
								${this.renderCloseIcon()}
							</button>
						</div>
						
						${this.historyData.length === 0 ? this.renderEmptyState() : b`
								<div class="table-container">
									<table class="main-table">
										<thead>
										<tr>
											<th>直播日期</th>
											<th>直播标题</th>
											<th>标记数量</th>
											<th>操作</th>
										</tr>
										</thead>
										<tbody>
										${this.historyData.map((session) => this.renderSessionRow(session))}
										</tbody>
									</table>
								</div>
							`}
						
						<div class="modal-footer">
							<button
								class="clear-btn"
								?disabled=${this.historyData.length === 0}
								@click=${this.clearAll}
							>
								清除所有记录
							</button>
						</div>
					</div>
				</div>
			` : A}
		`;
    }
  };
  HistoryModal.styles = i$3`
		:host {
			display: block;
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			z-index: 1000;
			pointer-events: none;
		}
		
		.overlay {
			position: fixed;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			background: rgba(0, 0, 0, 0.5);
			backdrop-filter: blur(4px);
			animation: fade-in 0.3s ease-out;
			pointer-events: auto;
		}
		
		.modal {
			position: fixed;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			width: 70vw;
			min-width: 650px;
			height: 50vh;
			min-height: 400px;
			display: flex;
			justify-content: center;
			align-items: center;
			pointer-events: none;
		}
		
		.modal-content {
			width: 100%;
			height: 100%;
			display: flex;
			flex-direction: column;
			border-radius: 20px;
			overflow: hidden;
			pointer-events: auto;
		}
		
		.glass-card {
			background: rgba(255, 255, 255, 0.85);
			backdrop-filter: blur(12px);
			-webkit-backdrop-filter: blur(12px);
			border: 1px solid rgba(255, 255, 255, 0.4);
			box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
		}
		
		.modal-header {
			padding: 1.25rem 1.5rem;
			display: flex;
			justify-content: space-between;
			align-items: center;
			border-bottom: 1px solid rgba(0, 0, 0, 0.06);
			flex-shrink: 0;
		}
		
		.modal-title {
			font-size: 1.5rem;
			font-weight: 700;
			color: #1e293b;
			margin: 0;
		}
		
		.close-btn {
			width: 36px;
			height: 36px;
			border-radius: 50%;
			background: rgba(0, 0, 0, 0.03);
			border: none;
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.2s ease;
			color: #64748b;
		}
		
		.close-btn:hover {
			background: rgba(0, 0, 0, 0.08);
			color: #475569;
			transform: rotate(90deg);
		}
		
		.table-container {
			flex: 1;
			overflow: auto;
			padding: 0 1.5rem;
			margin-top: 0.5rem;
			scrollbar-width: thin;
		}
		
		/* 精确控制一级表格列宽 */
		
		.main-table {
			width: 100%;
			border-collapse: collapse;
			table-layout: fixed;
			font-size: 0.95rem;
		}
		
		.main-table thead > tr {
			border-bottom: 2px solid #e2e8f0;
		}
		
		.main-table th:nth-child(1),
		.main-table td:nth-child(1) {
			width: 150px;
		}
		
		.main-table th:nth-child(2),
		.main-table td:nth-child(2) {
			width: auto;
			min-width: 240px;
			white-space: normal;
			word-wrap: break-word;
			padding-right: 1.5rem; /* 为操作列留出空间 */
		}
		
		.main-table th:nth-child(3),
		.main-table td:nth-child(3) {
			width: 100px;
		}
		
		.main-table th:nth-child(4),
		.main-table td:nth-child(4) {
			width: 150px;
		}
		
		.main-table th {
			text-align: left;
			padding: 0.75rem 0.5rem;
			font-weight: 600;
			color: #475569;
		}
		
		.main-table td {
			padding: 0.85rem 0.5rem;
			color: #334155;
		}
		
		.title-cell {
			font-weight: 500;
			line-height: 1.4;
		}
		
		.session-row {
			border-bottom: 1px solid #f1f5f9;
		}
		
		.session-row:nth-child(4n+1) {
			background-color: rgba(99, 102, 241, 0.03);
		}
		
		.session-row.expanded {
			background-color: rgba(99, 102, 241, 0.08);
		}
		
		.sub-table-row {
			display: none;
		}
		
		.sub-table-row.visible {
			display: table-row;
		}
		
		.sub-table-container {
			max-height: 0;
			overflow: hidden;
			transition: max-height 0.4s ease-in-out;
			padding: 0 1rem 1rem;
		}
		
		.sub-table-row.visible .sub-table-container {
			max-height: 500px;
		}
		
		/* 精确控制二级表格列宽 */
		
		.sub-table {
			width: 100%;
			background: rgba(248, 250, 252, 0.7);
			border: 1px solid rgba(148, 163, 184, 0.2);
			table-layout: fixed;
			border-radius: 6px;
			overflow: hidden;
		}
		
		.sub-table th:nth-child(1),
		.sub-table td:nth-child(1) {
			width: 50px;
		}
		
		.sub-table th:nth-child(2),
		.sub-table td:nth-child(2) {
			width: 100px;
		}
		
		.sub-table th:nth-child(3),
		.sub-table td:nth-child(3) {
			width: 100px;
		}
		
		.sub-table th:nth-child(4),
		.sub-table td:nth-child(4) {
			width: auto;
			white-space: normal;
			word-wrap: break-word;
		}
		
		.sub-table th {
			background: rgba(99, 102, 241, 0.08);
			padding: 0.6rem 0.5rem;
			font-size: 0.85rem;
			color: #334155;
			text-align: left;
		}
		
		.sub-table td {
			padding: 0.65rem 0.5rem;
			font-size: 0.875rem;
			color: #475569;
			border-bottom: 1px solid rgba(148, 163, 184, 0.1);
		}
		
		.content-cell {
			line-height: 1.4;
		}
		
		.marker-row:last-child td {
			border-bottom: none;
		}
		
		.marker-row:nth-child(odd) {
			background-color: rgba(241, 245, 249, 0.6);
		}
		
		.actions {
			display: flex;
			gap: 8px;
			align-items: center;
		}
		
		.detail-btn, .download-btn, .delete-btn {
			height: 28px;
			border-radius: 8px;
			border: none;
			background: rgba(0, 0, 0, 0.02);
			cursor: pointer;
			display: flex;
			align-items: center;
			justify-content: center;
			transition: all 0.2s ease;
			color: #64748b;
			font-size: 0.85rem;
		}
		
		.detail-btn:hover {
			background: rgba(99, 102, 241, 0.12);
			color: #6366f1;
		}
		
		.download-btn:hover {
			background: rgba(16, 185, 129, 0.12);
			color: #10b981;
		}
		
		.delete-btn:hover {
			background: rgba(239, 68, 68, 0.12);
			color: #ef4444;
		}
		
		.empty-state {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			height: 100%;
			padding: 2rem;
			text-align: center;
		}
		
		.empty-illustration {
			width: 160px;
			height: 160px;
			border-radius: 20px;
			object-fit: cover;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
			margin-bottom: 1.5rem;
			border: 1px solid rgba(0, 0, 0, 0.05);
		}
		
		.empty-text {
			font-size: 1.25rem;
			font-weight: 500;
			color: #64748b;
			max-width: 80%;
			line-height: 1.5;
		}
		
		.modal-footer {
			padding: 0.75rem 1.5rem;
			border-top: 1px solid rgba(0, 0, 0, 0.06);
			display: flex;
			justify-content: flex-end;
			flex-shrink: 0;
		}
		
		.clear-btn {
			background: rgba(239, 68, 68, 0.1);
			color: #ef4444;
			border: none;
			padding: 0.5rem 1.25rem;
			border-radius: 12px;
			font-weight: 500;
			cursor: pointer;
			transition: all 0.2s ease;
		}
		
		.clear-btn:hover:not(:disabled) {
			background: rgba(239, 68, 68, 0.15);
			transform: translateY(-1px);
		}
		
		.clear-btn:disabled {
			opacity: 0.5;
			cursor: not-allowed;
		}
		
		@keyframes fade-in {
			from {
				opacity: 0;
			}
			to {
				opacity: 1;
			}
		}
		
		.main-table, .detail-btn {
			font-size: 14px;
		}
	`;
  __decorateClass([
    n({ type: Boolean })
  ], HistoryModal.prototype, "open", 2);
  __decorateClass([
    n({ type: Number })
  ], HistoryModal.prototype, "roomId", 2);
  __decorateClass([
    r()
  ], HistoryModal.prototype, "expandedSession", 2);
  __decorateClass([
    n()
  ], HistoryModal.prototype, "historyData", 2);
  HistoryModal = __decorateClass([
    t("history-modal")
  ], HistoryModal);
  const initHistoryModal = async (roomId, records = []) => {
    const historyModal = document.createElement("history-modal");
    historyModal.roomId = roomId;
    historyModal.historyData = records;
    const container = await elementWaiter("body");
    container.append(historyModal);
    return historyModal;
  };
  const getRoomId = () => {
    const liveId = location.pathname.split("/").find((item) => /^\d+$/.test(item)) || "";
    if (!liveId) {
      throw new Error("\u83B7\u53D6\u76F4\u64AD\u95F4id\u5931\u8D25");
    }
    return liveId;
  };
  const main = async () => {
    clearChatInputRadius();
    const roomId = getRoomId();
    const data = await api_getLiveStatus(roomId);
    const recordStorage = new GmStorage(`room_${data.roomId}`, [{
      liveRoomId: data.roomId,
      liveTitle: data.title,
      liveStartTime: data.liveTime,
      records: []
    }]);
    const historyModal = await initHistoryModal(Number(roomId), recordStorage.get());
    historyModal.addEventListener("close", () => {
      historyModal.open = false;
    });
    historyModal.addEventListener("history-updated", (e2) => {
      recordStorage.set(e2.detail);
    });
    historyModal.addEventListener("download-session", (e2) => {
      const session = e2.detail;
      const blob = new Blob([JSON.stringify(session, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a2 = document.createElement("a");
      a2.href = url;
      const dateContent = new Date(session.liveStartTime).toLocaleString().replace(/[\/:]/g, "-");
      a2.download = `[${dateContent}]${data.name}_${data.title}.json`;
      a2.click();
      URL.revokeObjectURL(url);
    });
    const timestampRecorder = await initTimestampRecorder(data.liveTime, data.isLive);
    timestampRecorder.addEventListener("timestamp-recorded", (e2) => {
      const recordInfo = recordStorage.get();
      const recordItem = recordInfo.find((item) => item.liveStartTime === e2.detail.liveStartTime);
      const mark = {
        id: 1,
        liveTime: e2.detail.liveTimestamp,
        localTime: e2.detail.timestamp,
        content: e2.detail.note
      };
      if (!recordItem) {
        recordInfo.unshift({
          liveRoomId: data.roomId,
          liveTitle: data.title,
          liveStartTime: e2.detail.liveStartTime,
          records: [mark]
        });
      } else {
        mark.id = recordItem.records.length + 1;
        recordItem.records.push(mark);
      }
      recordStorage.set(recordInfo);
      /* @__PURE__ */ (() => {
      })(recordStorage.get());
    });
    timestampRecorder.addEventListener("open-record-list", () => {
      historyModal.historyData = recordStorage.get();
      historyModal.open = true;
    });
  };
  main().catch((error) => {
    console.error(error);
  });
  exports.getRoomId = getRoomId;
  Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
})(this["bilibili-live-record"] = this["bilibili-live-record"] || {});