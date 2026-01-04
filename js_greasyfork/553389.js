// ==UserScript==
// @name               Manual de l'Expert
// @namespace          http://github.com/GangPeter
// @version            4.0.2
// @author             GangPeter
// @description        Compatible amb missav, jable.tv, pornhub, 18comic, 91porn, xvideos i més. Amb 100+ funcions: elimina la majoria d'anuncis (bàners, popups), personalitza el disseny, mode de privadesa (desenfoca vídeos i títols), mostra títols complets i m3u8, login automàtic, canvi a versió sense censura i selecció automàtica de la màxima qualitat. Per a PC i mòbil.
// @license            None
// @icon               https://missav.ws/favicon.ico
// @homepageURL        https://github.com/GangPeter/porn-enhance
// @supportURL         https://github.com/GangPeter/porn-enhance
// @match              *://*.missav.com/*
// @match              *://*.missav.ws/*
// @match              *://*.missav.ai/*
// @match              *://*.jable.tv/*
// @match              *://*.pornhub.com/*
// @match              *://*.18comic.org/*
// @match              *://*.18comic.vip/*
// @match              *://*.91porn.com/*
// @match              *://*.91porna.com/*
// @match              *://*.xvideos.com/*
// @require            https://registry.npmmirror.com/vue/3.5.13/files/dist/vue.global.prod.js
// @grant              GM_addStyle
// @grant              GM_getValue
// @grant              GM_registerMenuCommand
// @grant              GM_setValue
// @grant              unsafeWindow
// @run-at             document-start
// @downloadURL https://update.greasyfork.org/scripts/553389/Manual%20de%20l%27Expert.user.js
// @updateURL https://update.greasyfork.org/scripts/553389/Manual%20de%20l%27Expert.meta.js
// ==/UserScript==

(o=>{if(typeof GM_addStyle=="function"){GM_addStyle(o);return}const e=document.createElement("style");e.textContent=o,document.head.append(e)})(" .m3u8-input-group[data-v-70ae07f7]{display:flex;align-items:center;height:50px;margin:15px 0;border-radius:999px;background-color:#1b1b1b;font-size:15px;border:none}.m3u8-span[data-v-70ae07f7]{align-content:center;width:10%;height:50px;color:#fff;padding:1em}.m3u8-input[data-v-70ae07f7]{width:75%;height:50px;color:#c6c6c6;border:none;background:transparent}.m3u8-button--copy[data-v-70ae07f7]{width:7.5%;height:50px;border-radius:0 999px 999px 0;background-color:#ff9000;color:#000;cursor:pointer;border:none}.m3u8-button--open[data-v-70ae07f7]{width:7.5%;height:50px;background-color:#ff9000;color:#000;cursor:pointer;border:none}.m3u8-button--open[data-v-70ae07f7]:hover,.m3u8-button--copy[data-v-70ae07f7]:hover{color:#fff} ");

(function (e$1) {
  'use strict';

  function _interopNamespaceDefault(e) {
    const n = Object.create(null, { [Symbol.toStringTag]: { value: 'Module' } });
    if (e) {
      for (const k in e) {
        if (k !== 'default') {
          const d = Object.getOwnPropertyDescriptor(e, k);
          Object.defineProperty(n, k, d.get ? d : {
            enumerable: true,
            get: () => e[k]
          });
        }
      }
    }
    n.default = e;
    return Object.freeze(n);
  }

  const e$1__namespace = /*#__PURE__*/_interopNamespaceDefault(e$1);

  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : undefined)();
  var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : undefined)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : undefined)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : undefined)();
  /*!
   * pinia v2.3.1
   * (c) 2025 Eduardo San Martin Morote
   * @license MIT
   */
  let activePinia;
  const setActivePinia = (pinia) => activePinia = pinia;
  const piniaSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function isPlainObject(o2) {
    return o2 && typeof o2 === "object" && Object.prototype.toString.call(o2) === "[object Object]" && typeof o2.toJSON !== "function";
  }
  var MutationType;
  (function(MutationType2) {
    MutationType2["direct"] = "direct";
    MutationType2["patchObject"] = "patch object";
    MutationType2["patchFunction"] = "patch function";
  })(MutationType || (MutationType = {}));
  function createPinia() {
    const scope = e$1.effectScope(true);
    const state = scope.run(() => e$1.ref({}));
    let _p = [];
    let toBeInstalled = [];
    const pinia = e$1.markRaw({
      install(app) {
        setActivePinia(pinia);
        pinia._a = app;
        app.provide(piniaSymbol, pinia);
        app.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      },
      use(plugin) {
        if (!this._a) {
          toBeInstalled.push(plugin);
        } else {
          _p.push(plugin);
        }
        return this;
      },
      _p,
      _a: null,
      _e: scope,
      _s: /* @__PURE__ */ new Map(),
      state
    });
    return pinia;
  }
  const skipHydrateSymbol = (
    /* istanbul ignore next */
    Symbol()
  );
  function defineStore(idOrOptions, setup, setupOptions) {
    let id;
    let options;
    const isSetupStore = typeof setup === "function";
    if (typeof idOrOptions === "string") {
      id = idOrOptions;
      options = isSetupStore ? setupOptions || {} : setup;
    } else {
      options = idOrOptions;
      id = idOrOptions.id;
    }
    function useStore(pinia) {
      const currentInstance = e$1.getCurrentInstance();
      pinia = pinia || currentInstance && e$1.inject(piniaSymbol);
      if (pinia)
        setActivePinia(pinia);
      pinia = activePinia;
      if (!pinia._s.has(id)) {
        if (isSetupStore) {
          createSetupStore(id, setup, options, pinia);
        } else {
          createOptionsStore(id, options, pinia);
        }
      }
      const store = pinia._s.get(id);
      return store;
    }
    useStore.$id = id;
    return useStore;
  }
  function createOptionsStore(id, options, pinia, hot) {
    const { state, actions, getters } = options;
    const initialState = pinia.state.value[id];
    let store;
    function setup() {
      if (!initialState && !hot) {
        pinia.state.value[id] = state ? state() : {};
      }
      const localState = e$1.toRefs(pinia.state.value[id]);
      return Object.assign(
        localState,
        actions,
        Object.keys(getters || {}).reduce((computedGetters, name) => {
          computedGetters[name] = e$1.markRaw(
            e$1.computed(() => {
              setActivePinia(pinia);
              const store2 = pinia._s.get(id);
              return getters[name].call(store2, store2);
            })
          );
          return computedGetters;
        }, {})
      );
    }
    store = createSetupStore(id, setup, options, pinia, hot);
    store.$reset = function $reset() {
      const newState = state ? state() : {};
      this.$patch(($state) => {
        Object.assign($state, newState);
      });
    };
    return store;
  }
  function createSetupStore($id, setup, options = {}, pinia, hot) {
    let scope;
    const { state: stateFromOptions, actions: actionsFromOptions, getters: gettersFromOptions } = options;
    const initialState = pinia.state.value[$id];
    if (!initialState && !hot) {
      if (stateFromOptions) {
        pinia.state.value[$id] = stateFromOptions();
      }
    }
    const hotState = e$1.toRefs(pinia.state.value);
    let isListening;
    let isSyncing;
    let subscriptions = [];
    let actionSubscriptions = [];
    let partialSubscriptions = [];
    const skippedHydrate = /* @__PURE__ */ e$1.ref(false);
    function $patch(partialStateOrMutator) {
      let subscriptionMutation;
      isListening = isSyncing = false;
      if (typeof partialStateOrMutator === "function") {
        partialStateOrMutator(pinia.state.value[$id]);
        subscriptionMutation = {
          type: MutationType.patchFunction,
          storeId: $id,
          events: void 0
        };
      } else {
        mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
        subscriptionMutation = {
          type: MutationType.patchObject,
          payload: partialStateOrMutator,
          storeId: $id,
          events: void 0
        };
      }
      const myListenerId = newListenerId++;
      const afterListener = () => {
        if (myListenerId === lastListenerId) {
          isListening = true;
        }
      };
      e$1.nextTick().then(afterListener);
      isSyncing = true;
      triggerSubscriptions(
        subscriptions,
        subscriptionMutation,
        pinia.state.value[$id]
      );
    }
    const $subscribe = (callback, options2 = {}) => {
      subscriptions.push(callback);
      const removeSubscription = () => {
        const index = subscriptions.indexOf(callback);
        if (index > -1) {
          subscriptions.splice(index, 1);
        }
      };
      return removeSubscription;
    };
    const $onAction = addSubscription.bind(null, actionSubscriptions);
    let lastListenerId = 0;
    let newListenerId = 0;
    function partialStore(names) {
      const partial = {};
      for (const key of names) {
        const prop = store[key];
        if (e$1.isRef(prop) || e$1.isReactive(prop)) {
          partial[key] = prop;
        }
      }
      return partial;
    }
    function addSubscription(subscriptions2, callback) {
      subscriptions2.push(callback);
      return () => {
        const index = subscriptions2.indexOf(callback);
        if (index > -1) {
          subscriptions2.splice(index, 1);
        }
      };
    }
    function triggerSubscriptions(subscriptions2, ...args) {
      subscriptions2.slice().forEach((callback) => {
        callback(...args);
      });
    }
    const store = e$1.reactive(
      /* @__PURE__ */ Object.assign(
        {
          _p: pinia,
          // TODO: remove in next major
          $id,
          $patch,
          $subscribe,
          $onAction,
          $dispose() {
            scope.stop();
            subscriptions = [];
            actionSubscriptions = [];
            pinia._s.delete($id);
          }
        }
      )
    );
    pinia._s.set($id, store);
    const setupStore = pinia._e.run(() => {
      scope = e$1.effectScope();
      return scope.run(() => setup());
    });
    for (const key in setupStore) {
      const prop = setupStore[key];
      if (e$1.isRef(prop) && prop.constructor.name !== "ComputedRef" || e$1.isReactive(prop)) {
        if (!skippedHydrate.value && !hotState[$id].value.hasOwnProperty(key)) {
          if (stateFromOptions) {
            if (isPlainObject(prop)) {
              pinia.state.value[$id][key] = e$1.reactive(prop);
            } else {
              pinia.state.value[$id][key] = prop;
            }
          }
        }
      } else if (typeof prop === "function") {
        const actionValue = wrapAction(key, prop);
        setupStore[key] = actionValue;
      }
    }
    e$1.stop(
      pinia._e.run(() => e$1.watch(
        () => pinia.state.value[$id],
        (state) => {
          if (isListening) {
            $patch(() => {
              Object.assign(store, state);
            });
          }
        },
        { deep: true, flush: "sync" }
      ))
    );
    Object.assign(store, setupStore);
    Object.assign(e$1.toRaw(store), setupStore);
    Object.defineProperty(store, "$state", {
      get: () => pinia.state.value[$id],
      set: (newState) => {
        $patch(($state) => {
          Object.assign($state, newState);
        });
      }
    });
    pinia._p.forEach((ext) => {
      Object.assign(
        store,
        scope.run(() => ext({ store, app: pinia._a, pinia, options }))
      );
    });
    if (initialState && skippedHydrate.value && stateFromOptions) {
      const newHydratedState = stateFromOptions();
      const patch = {};
      for (const key in newHydratedState) {
        if (!initialState.hasOwnProperty(key)) {
          patch[key] = newHydratedState[key];
        }
      }
      if (Object.keys(patch).length) {
        $patch(patch);
      }
    }
    skippedHydrate.value = true;
    isListening = true;
    function wrapAction(name, action) {
      return function() {
        setActivePinia(pinia);
        const args = Array.from(arguments);
        let afterCallback;
        let onErrorCallback;
        const after = (callback) => {
          afterCallback = callback;
        };
        const onError = (callback) => {
          onErrorCallback = callback;
        };
        triggerSubscriptions(actionSubscriptions, {
          args,
          name,
          store,
          after,
          onError
        });
        let ret;
        try {
          ret = action.apply(this, args);
        } catch (error) {
          if (onErrorCallback) {
            onErrorCallback(error);
          }
          throw error;
        }
        if (ret instanceof Promise) {
          return ret.then((value) => {
            if (afterCallback)
              afterCallback(value);
            return value;
          }).catch((error) => {
            if (onErrorCallback)
              onErrorCallback(error);
            return Promise.reject(error);
          });
        }
        if (afterCallback)
          afterCallback(ret);
        return ret;
      };
    }
    function mergeReactiveObjects(target, patchToApply) {
      for (const key in patchToApply) {
        const subPatch = patchToApply[key];
        const targetValue = target[key];
        if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !e$1.isRef(subPatch) && !e$1.isReactive(subPatch)) {
          target[key] = mergeReactiveObjects(targetValue, subPatch);
        } else {
          target[key] = subPatch;
        }
      }
      return target;
    }
    return store;
  }
  const isHydrating = /* @__PURE__ */ e$1.ref(false);
  const storesToHydrate = /* @__PURE__ */ e$1.ref([]);
  const PiniaVuePlugin = (pinia, { app, store, options: options2 }) => {
    if (store.$state) {
      if (typeof store.$state === "object") {
        store.$patch(store.$state);
      } else {
        store.$patch((state) => {
          Object.assign(state, store.$state);
        });
      }
      delete store.$state;
    }
  };
  function storeToRefs(store) {
    store = e$1.toRaw(store);
    const refs = {};
    for (const key in store) {
      const value = store[key];
      if (e$1.isRef(value) || e$1.isReactive(value)) {
        refs[key] = e$1.toRef(store, key);
      }
    }
    return refs;
  }

  // lib/utils.ts
  var CommonUtils = class {
    constructor() {
    }
    /**
     * @description 生成随机字符串
     * @param length 字符串长度
     * @param chars 字符集
     * @returns 随机字符串
     */
    static randomString(length = 6, chars = "abcdefghijklmnopqrstuvwxyz") {
      let result = "";
      for (let i = length; i > 0; --i)
        result += chars[Math.floor(Math.random() * chars.length)];
      return result;
    }
    /**
     * @description 检查是否是移动端
     * @returns boolean
     */
    static isMobile() {
      return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    /**
     * @description 检查是否是PC端
     * @returns boolean
     */
    static isPC() {
      return !this.isMobile();
    }
    /**
     * @description 尝试从 localStorage 中获取数据
     * @param key 键
     * @returns value || null
     */
    static getFromLocalStorage(key) {
      try {
        const value = localStorage.getItem(key);
        if (value) {
          return JSON.parse(value);
        }
      } catch (e) {
        return null;
      }
    }
    /**
     * @description 尝试向 localStorage 中存储数据
     * @param key 键
     * @param value 值
     */
    static setInLocalStorage(key, value) {
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch (e) {
      }
    }
    /**
     * @description 尝试从 localStorage 中删除数据
     * @param key 键
     */
    static deleteFromLocalStorage(key) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
      }
    }
    /**
     * @description 滚动到顶部
     * @param behavior 滚动行为
     */
    static scrollToTop(behavior = "smooth") {
      window.scrollTo({
        top: 0,
        behavior
      });
    }
    /**
     * @description 滚动到底部
     * @param behavior 滚动行为
     */
    static scrollToBottom(behavior = "smooth") {
      window.scrollTo({
        top: document.body.scrollHeight,
        behavior
      });
    }
  };

  // lib/logger.ts
  var Logger = class {
    constructor(prefix) {
      __publicField(this, "prefix");
      this.prefix = prefix;
    }
    log(message, ...args) {
      console.log(`%c[${this.prefix}]`, "color: #ff9000; font-weight: bold;", message, ...args);
    }
    info(message, ...args) {
      console.info(`%c[${this.prefix}]`, "color: #26a2ff; font-weight: bold;", message, ...args);
    }
    error(message, ...args) {
      console.error(`%c[${this.prefix}]`, "color: #ff5252; font-weight: bold;", message, ...args);
    }
    warn(message, ...args) {
      console.warn(`%c[${this.prefix}]`, "color: #ffc107; font-weight: bold;", message, ...args);
    }
  };

  // lib/tampermonkey.ts
  var Tampermonkey = class {
    constructor() {
    }
    /**
     * @description 设置值
     * @param key 键
     * @param value 值
     */
    static setValue(key, value) {
      _GM_setValue(key, value);
    }
    /**
     * @description 获取值
     * @param key 键
     * @param defaultValue 默认值
     * @returns value
     */
    static getValue(key, defaultValue) {
      return _GM_getValue(key, defaultValue);
    }
    /**
     * @description 注册菜单
     * @param name 菜单名
     * @param callback 回调
     */
    static registerMenuCommand(name, callback) {
      _GM_registerMenuCommand(name, callback);
    }
  };

  // stores/config.ts
  var useConfigStore = defineStore("config", {
    state: () => ({
      version: "",
      // 版本号
      language: "zh-CN",
      // 语言
      site: {
        id: "",
        name: "",
        url: ""
      },
      enable: true,
      // 是否启用
      autoSwitchUncensored: true,
      // 自动切换无码
      autoJump: true,
      // 自动跳转
      autoLogin: {
        // 自动登录
        enable: false,
        account: "",
        password: ""
      },
      removeAds: true,
      // 去广告
      privacyMode: false,
      // 隐私模式
      darkMode: false,
      // 暗黑模式
      showFullTitle: false,
      // 显示完整标题
      loadMoreVideo: 99,
      // 加载更多视频
      player: {
        autoPlay: false,
        // 自动播放
        autoHighestQuality: true,
        // 自动最高画质
        autoWebFullScreen: false,
        // 自动网页全屏
        autoFullScreen: false,
        // 自动全屏
        pauseWhenInactive: false
        // 非激活暂停
      },
      showM3U8: true,
      // 显示 M3U8
      custom: {
        // 自定义
        layout: {
          // 布局
          enable: false,
          // 是否启用
          leftSidebar: true,
          // 左侧边栏
          rightSidebar: false,
          // 右侧边栏
          header: true,
          // 顶栏
          footer: false,
          // 底栏
          relatedVideos: false,
          // 相关视频
          comments: false
          // 评论
        }
      }
    }),
    getters: {},
    actions: {
      /**
       * @description 保存配置
       */
      saveConfig() {
        const config = JSON.parse(JSON.stringify(this.$state));
        Tampermonkey.setValue("config", config);
      },
      /**
       * @description 重置配置
       */
      resetConfig() {
        const defaultConfig = useConfigStore().$state;
        this.$patch(defaultConfig);
        this.saveConfig();
      }
    }
  });

  // main.ts
  var Main = class {
    /**
     * 构造函数
     * @param siteId 站点 ID
     */
    constructor(siteId) {
      __publicField(this, "logger");
      __publicField(this, "configStore");
      __publicField(this, "siteId");
      __publicField(this, "initFlag", false);
      this.logger = new Logger("Main");
      this.configStore = useConfigStore();
      this.siteId = siteId;
    }
    /**
     * @description 初始化
     */
    init() {
      if (this.initFlag)
        return;
      this.initConfig();
      this.logger.info("初始化成功");
      this.initFlag = true;
    }
    /**
     * @description 加载配置
     */
    loadConfig() {
      const localConfig = Tampermonkey.getValue("config", {});
      this.configStore.$patch(localConfig);
    }
    /**
     * @description 初始化配置
     */
    initConfig() {
      this.loadConfig();
      const currentVersion = "4.0.2";
      if (this.configStore.version !== currentVersion) {
        this.logger.info("版本更新，初始化配置");
        this.configStore.version = currentVersion;
      }
      this.configStore.site.id = this.siteId;
      this.configStore.site.name = document.title;
      this.configStore.site.url = window.location.href;
      this.configStore.saveConfig();
    }
  };

  // sites/missav/index.ts
  var MissAV = class {
    /**
     * 构造函数
     */
    constructor() {
      __publicField(this, "logger");
      __publicField(this, "main");
      __publicField(this, "initFlag", false);
      this.logger = new Logger("MissAV");
      this.main = new Main("missav");
      this.init();
    }
    /**
     * 初始化
     */
    init() {
      if (this.initFlag)
        return;
      this.main.init();
      this.logger.info("初始化成功");
      this.initFlag = true;
    }
  };

  // sites/jable/index.ts
  var Jable = class {
    /**
     * 构造函数
     */
    constructor() {
      __publicField(this, "logger");
      __publicField(this, "main");
      __publicField(this, "initFlag", false);
      this.logger = new Logger("Jable");
      this.main = new Main("jable");
      this.init();
    }
    /**
     * 初始化
     */
    init() {
      if (this.initFlag)
        return;
      this.main.init();
      this.logger.info("初始化成功");
      this.initFlag = true;
    }
  };

  // sites/pornhub/index.ts
  var Pornhub = class {
    /**
     * 构造函数
     */
    constructor() {
      __publicField(this, "logger");
      __publicField(this, "main");
      __publicField(this, "initFlag", false);
      this.logger = new Logger("Pornhub");
      this.main = new Main("pornhub");
      this.init();
    }
    /**
     * 初始化
     */
    init() {
      if (this.initFlag)
        return;
      this.main.init();
      this.logger.info("初始化成功");
      this.initFlag = true;
    }
  };

  // sites/18comic/index.ts
  var Comic18 = class {
    /**
     * 构造函数
     */
    constructor() {
      __publicField(this, "logger");
      __publicField(this, "main");
      __publicField(this, "initFlag", false);
      this.logger = new Logger("18Comic");
      this.main = new Main("18comic");
      this.init();
    }
    /**
     * 初始化
     */
    init() {
      if (this.initFlag)
        return;
      this.main.init();
      this.logger.info("初始化成功");
      this.initFlag = true;
    }
  };

  // sites/91porn/index.ts
  var Porn91 = class {
    /**
     * 构造函数
     */
    constructor() {
      __publicField(this, "logger");
      __publicField(this, "main");
      __publicField(this, "initFlag", false);
      this.logger = new Logger("91Porn");
      this.main = new Main("91porn");
      this.init();
    }
    /**
     * 初始化
     */
    init() {
      if (this.initFlag)
        return;
      this.main.init();
      this.logger.info("初始化成功");
      this.initFlag = true;
    }
  };

  // sites/91porna/index.ts
  var PornA91 = class {
    /**
     * 构造函数
     */
    constructor() {
      __publicField(this, "logger");
      __publicField(this, "main");
      __publicField(this, "initFlag", false);
      this.logger = new Logger("91PornA");
      this.main = new Main("91porna");
      this.init();
    }
    /**
     * 初始化
     */
    init() {
      if (this.initFlag)
        return;
      this.main.init();
      this.logger.info("初始化成功");
      this.initFlag = true;
    }
  };

  // sites/xvideos/index.ts
  var XVideos = class {
    /**
     * 构造函数
     */
    constructor() {
      __publicField(this, "logger");
      __publicField(this, "main");
      __publicField(this, "initFlag", false);
      this.logger = new Logger("XVideos");
      this.main = new Main("xvideos");
      this.init();
    }
    /**
     * 初始化
     */
    init() {
      if (this.initFlag)
        return;
      this.main.init();
      this.logger.info("初始化成功");
      this.initFlag = true;
    }
  };
  var _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };

  // components/m3u8.vue
  var m3u8_vue_vue_type_style_index_0_scoped_70ae07f7_lang = "";
  var _sfc_main$2 = e$1.defineComponent({
    props: {
      m3u8: {
        type: String,
        default: ""
      }
    },
    setup(props) {
      const copy = async () => {
        await navigator.clipboard.writeText(props.m3u8);
      };
      const open = () => {
        window.open(props.m3u8);
      };
      return {
        copy,
        open
      };
    }
  });
  var _hoisted_1$2 = { class: "m3u8-input-group" };
  var _hoisted_2$1 = /* @__PURE__ */ e$1.createElementVNode("span", { class: "m3u8-span" }, "M3U8", -1);
  function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
    return e$1.openBlock(), e$1.createElementBlock("div", _hoisted_1$2, [
      _hoisted_2$1,
      e$1.createElementVNode("input", {
        class: "m3u8-input",
        type: "text",
        value: _ctx.m3u8,
        readonly: ""
      }, null, 8, ["value"]),
      e$1.createElementVNode("button", {
        class: "m3u8-button--open",
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.open && _ctx.open(...args))
      }, " \u6253\u5F00 "),
      e$1.createElementVNode("button", {
        class: "m3u8-button--copy",
        onClick: _cache[1] || (_cache[1] = (...args) => _ctx.copy && _ctx.copy(...args))
      }, " \u590D\u5236 ")
    ]);
  }
  var M3U8 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-70ae07f7"]]);

  // components/settings.vue
  var settings_vue_vue_type_style_index_0_lang = "";
  var _sfc_main$1 = e$1.defineComponent({
    setup() {
      const visible = e$1.ref(false);
      const open = () => {
        visible.value = true;
      };
      const configStore = useConfigStore();
      const saveConfig = () => {
        configStore.saveConfig();
        alert("保存成功");
      };
      const resetConfig = () => {
        configStore.resetConfig();
        alert("重置成功");
      };
      return {
        visible,
        open,
        ...storeToRefs(configStore),
        saveConfig,
        resetConfig
      };
    }
  });
  function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
    return e$1.openBlock(), e$1.createElementBlock("div");
  }
  var Settings = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);

  // components/app.vue
  var _sfc_main = e$1.defineComponent({
    components: {
      Settings,
      M3U8
    },
    setup() {
      const settingsRef = e$1.ref();
      const m3u8 = e$1.ref("");
      e$1.onMounted(() => {
        Tampermonkey.registerMenuCommand("\u{1F47B} \u8BBE\u7F6E", () => {
          settingsRef.value.open();
        });
      });
      return {
        settingsRef,
        m3u8
      };
    }
  });
  var _hoisted_1$1 = { id: "porn-enhance" };
  var _hoisted_2 = /* @__PURE__ */ e$1.createElementVNode("h1", null, "Porn Enhance", -1);
  function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
    const _component_M3U8 = e$1.resolveComponent("M3U8");
    const _component_Settings = e$1.resolveComponent("Settings");
    return e$1.openBlock(), e$1.createElementBlock("div", _hoisted_1$1, [
      _hoisted_2,
      e$1.createVNode(_component_M3U8, { m3u8: _ctx.m3u8 }, null, 8, ["m3u8"]),
      e$1.createVNode(_component_Settings, { ref: "settingsRef" }, null, 512)
    ]);
  }
  var App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);

  // index.ts
  var _hoisted_1 = { id: "app" };
  var pinia = createPinia();
  var app = e$1__namespace.createApp({
    render: () => e$1__namespace.h("div", _hoisted_1, [e$1__namespace.h(App)])
  });
  app.use(pinia);
  app.mount("#app");
  var logger = new Logger("PornEnhance");
  logger.info("脚本开始运行");
  var hostname = window.location.hostname;
  if (hostname.includes("missav")) {
    new MissAV();
  } else if (hostname.includes("jable.tv")) {
    new Jable();
  } else if (hostname.includes("pornhub.com")) {
    new Pornhub();
  } else if (hostname.includes("18comic")) {
    new Comic18();
  } else if (hostname.includes("91porn.com")) {
    new Porn91();
  } else if (hostname.includes("91porna.com")) {
    new PornA91();
  } else if (hostname.includes("xvideos.com")) {
    new XVideos();
  } else {
    logger.error("不支持的站点");
  }
})(Vue);