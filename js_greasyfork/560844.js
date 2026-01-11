// ==UserScript==
// @name AcFun视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/AcFun/index.js
// @version 2026.01.10
// @description 下载AcFun视频，支持4K/1080P/720P多画质。
// @icon https://cdn.aixifan.com/ico/favicon.ico
// @match *://www.acfun.cn/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect acfun.cn
// @connect *
// @connect localhost
// @grant        GM_addElement
// @grant        GM_addStyle
// @grant        GM_addValueChangeListener
// @grant        GM_cookie
// @grant        GM_deleteValue
// @grant        GM_deleteValues
// @grant        GM_download
// @grant        GM_getResourceText
// @grant        GM_getResourceURL
// @grant        GM_getTab
// @grant        GM_getTabs
// @grant        GM_getValue
// @grant        GM_getValues
// @grant        GM_info
// @grant        GM_listValues
// @grant        GM_log
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_removeValueChangeListener
// @grant        GM_saveTab
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_setValues
// @grant        GM_unregisterMenuCommand
// @grant        GM_webRequest
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @antifeature  ads  服务器需要成本，感谢理解
// @downloadURL https://update.greasyfork.org/scripts/560844/AcFun%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/560844/AcFun%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

/*
 * 查看许可（Viewing License）
 *
 * 版权声明
 * 版权所有 [大角牛软件科技]。保留所有权利。
 *
 * 许可证声明
 * 本协议适用于 [大角牛下载助手] 及其所有相关文件和代码（以下统称“软件”）。软件以开源形式提供，但仅允许查看，禁止使用、修改或分发。
 *
 * 授权条款
 * 1. 查看许可：任何人可以查看本软件的源代码，但仅限于个人学习和研究目的。
 * 2. 禁止使用：未经版权所有者（即 [你的名字或组织名称]）的明确书面授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 3. 明确授权：任何希望使用、修改或分发本软件的个人或组织，必须向版权所有者提交书面申请，说明使用目的、范围和方式。版权所有者有权根据自身判断决定是否授予授权。
 *
 * 限制条款
 * 1. 禁止未经授权的使用：未经版权所有者明确授权，任何人或组织不得使用、复制、修改、分发或以其他方式利用本软件的任何部分。
 * 2. 禁止商业使用：未经版权所有者明确授权，任何人或组织不得将本软件用于商业目的，包括但不限于在商业网站、应用程序或其他商业服务中使用。
 * 3. 禁止分发：未经版权所有者明确授权，任何人或组织不得将本软件或其任何修改版本分发给第三方。
 * 4. 禁止修改：未经版权所有者明确授权，任何人或组织不得对本软件进行任何形式的修改。
 *
 * 法律声明
 * 1. 版权保护：本软件受版权法保护。未经授权的使用、复制、修改或分发将构成侵权行为，版权所有者有权依法追究侵权者的法律责任。
 * 2. 免责声明：本软件按“原样”提供，不提供任何形式的明示或暗示的保证，包括但不限于对适销性、特定用途的适用性或不侵权的保证。在任何情况下，版权所有者均不对因使用或无法使用本软件而产生的任何直接、间接、偶然、特殊或后果性损害承担责任。
 *
 * 附加条款
 * 1. 协议变更：版权所有者有权随时修改本协议的条款。任何修改将在版权所有者通知后立即生效。
 * 2. 解释权：本协议的最终解释权归版权所有者所有。
 */

(function (vue, ElementPlus) {
    'use strict';
    // iframe不执行，例如formats.html
    try {
        const inFrame = window.top !== window.self;
        if (inFrame) {
            if (!window.location.pathname.includes('formats')) {
                return;
            }
        }
    } catch (e) { }
    // 解决多脚本冲突问题
    if (window.location.origin.includes('dajiaoniu.site') || window.location.origin.includes('localhost:6688')) {
        // 获取url的name_en，url中包含name_en的参数
        const urlParams = new URLSearchParams(window.location.search);
        try {
            // 全能脚本，不处理
            if(GM.info.script.namespace.includes('tools')){

            } else {
                const name_en = urlParams.get('name_en');
                if (!name_en) {
                    return;
                }
            }  
        } catch (e) { }
    }
    const _export_sfc = (sfc, props) => {
        const target = sfc.__vccOpts || sfc;
        for (const [key, val] of props) {
            target[key] = val;
        }
        return target;
    };
    const _sfc_main$2 = {
        name: "FireButton",
        props: {
            isProcessing: {
                type: Boolean,
                default: false
            }
        },
        emits: ["click"],
        methods: {
            handleClick() {
                this.$emit("click");
            }
        }
    };
    const _hoisted_1$2 = {
        id: "download-assistant",
        class: "download-assistant"
    };
    function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1$2, [
            vue.createElementVNode("div", {
                class: vue.normalizeClass(["download-button fire", { active: $props.isProcessing }]),
                onClick: _cache[0] || (_cache[0] = (...args) => $options.handleClick && $options.handleClick(...args))
            }, _cache[1] || (_cache[1] = [
                vue.createStaticVNode('<span class="fire__tongue fire__tongue--1" data-v-29ed8f79></span><span class="fire__tongue fire__tongue--2" data-v-29ed8f79></span><span class="fire__tongue fire__tongue--3" data-v-29ed8f79></span><span class="fire__eye fire__eye--right" data-v-29ed8f79></span><span class="fire__eye fire__eye--left" data-v-29ed8f79></span><span class="fire__mouth" data-v-29ed8f79></span><span class="fire__food" data-v-29ed8f79></span>', 7)
            ]), 2)
        ]);
    }
    const FireButton = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2], ["__scopeId", "data-v-29ed8f79"]]);
    class WebViewCapabilities {
        constructor(config2) {
            this.config = config2;
            this.capabilities = /* @__PURE__ */ new Map();
        }
        /**
         * 注册能力
         */
        register(capability) {
            if (!capability.name) {
                return;
            }
            this.capabilities.set(capability.name, capability);
            if (typeof capability.onRegister === "function") {
                capability.onRegister(this.config);
            }
        }
        /**
         * 移除能力
         */
        unregister(name) {
            const capability = this.capabilities.get(name);
            if (capability && typeof capability.onUnregister === "function") {
                capability.onUnregister();
            }
            this.capabilities.delete(name);
        }
        /**
         * 处理消息
         */
        handleMessage(message2, event) {
            for (const [name, capability] of this.capabilities) {
                if (typeof capability.handleMessage === "function") {
                    try {
                        if (capability.handleMessage(message2, event, this.config)) {
                            return true;
                        }
                    } catch (error) {
                        console.error(`[DaJiaoNiu] 能力 ${name} 处理消息失败:`, error);
                    }
                }
            }
            return false;
        }
        /**
         * 获取能力
         */
        get(name) {
            return this.capabilities.get(name);
        }
        /**
         * 销毁能力系统
         */
        destroy() {
            for (const [name, capability] of this.capabilities) {
                if (typeof capability.onDestroy === "function") {
                    capability.onDestroy();
                }
            }
            this.capabilities.clear();
        }
    }
    const evalCapability = {
        name: "eval",
        onRegister(config2) {
            this.config = config2;
        },
        handleMessage(message2, event, config2) {
            if (message2.type === "eval") {
                this.handleEval(message2, config2);
                return true;
            }
            if (message2.type === "eval-sync") {
                this.handleEvalSync(message2, config2);
                return true;
            }
            return false;
        },
        handleEval(message, config) {
            const requestId = message.requestId;
            const { code } = message.data || message;
            try {
                const result = eval(code);
                if (result && typeof result.then === "function") {
                    result.then((resolvedResult) => {
                        config.sendResponse(requestId, resolvedResult);
                    }).catch((error) => {
                        config.sendError(requestId, error.message);
                    });
                } else {
                    config.sendResponse(requestId, result);
                }
            } catch (error) {
                config.sendError(requestId, error.message);
            }
        },
        handleEvalSync(message, config) {
            const { code } = message.data || message;
            try {
                eval(code);
            } catch (error) {
                console.error("[DaJiaoNiu] 同步执行代码失败:", error);
            }
        },
        onDestroy() {
        }
    };
    var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
    var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
    var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
    var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
    var _GM_cookie = /* @__PURE__ */ (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
    var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
    var _GM_deleteValues = /* @__PURE__ */ (() => typeof GM_deleteValues != "undefined" ? GM_deleteValues : void 0)();
    var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
    var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
    var _GM_getResourceURL = /* @__PURE__ */ (() => typeof GM_getResourceURL != "undefined" ? GM_getResourceURL : void 0)();
    var _GM_getTab = /* @__PURE__ */ (() => typeof GM_getTab != "undefined" ? GM_getTab : void 0)();
    var _GM_getTabs = /* @__PURE__ */ (() => typeof GM_getTabs != "undefined" ? GM_getTabs : void 0)();
    var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
    var _GM_getValues = /* @__PURE__ */ (() => typeof GM_getValues != "undefined" ? GM_getValues : void 0)();
    var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
    var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
    var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
    var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
    var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
    var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
    var _GM_removeValueChangeListener = /* @__PURE__ */ (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
    var _GM_saveTab = /* @__PURE__ */ (() => typeof GM_saveTab != "undefined" ? GM_saveTab : void 0)();
    var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
    var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
    var _GM_setValues = /* @__PURE__ */ (() => typeof GM_setValues != "undefined" ? GM_setValues : void 0)();
    var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
    var _GM_webRequest = /* @__PURE__ */ (() => typeof GM_webRequest != "undefined" ? GM_webRequest : void 0)();
    var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
    var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
    var _monkeyWindow = /* @__PURE__ */ (() => window)();
    const GM$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
        __proto__: null,
        GM: _GM,
        GM_addElement: _GM_addElement,
        GM_addStyle: _GM_addStyle,
        GM_addValueChangeListener: _GM_addValueChangeListener,
        GM_cookie: _GM_cookie,
        GM_deleteValue: _GM_deleteValue,
        GM_deleteValues: _GM_deleteValues,
        GM_download: _GM_download,
        GM_getResourceText: _GM_getResourceText,
        GM_getResourceURL: _GM_getResourceURL,
        GM_getTab: _GM_getTab,
        GM_getTabs: _GM_getTabs,
        GM_getValue: _GM_getValue,
        GM_getValues: _GM_getValues,
        GM_info: _GM_info,
        GM_listValues: _GM_listValues,
        GM_log: _GM_log,
        GM_notification: _GM_notification,
        GM_openInTab: _GM_openInTab,
        GM_registerMenuCommand: _GM_registerMenuCommand,
        GM_removeValueChangeListener: _GM_removeValueChangeListener,
        GM_saveTab: _GM_saveTab,
        GM_setClipboard: _GM_setClipboard,
        GM_setValue: _GM_setValue,
        GM_setValues: _GM_setValues,
        GM_unregisterMenuCommand: _GM_unregisterMenuCommand,
        GM_webRequest: _GM_webRequest,
        GM_xmlhttpRequest: _GM_xmlhttpRequest,
        monkeyWindow: _monkeyWindow,
        unsafeWindow: _unsafeWindow
    }, Symbol.toStringTag, { value: "Module" }));
    class RequestCapability {
        constructor() {
            this.name = "request";
            this.GM = GM$1;
            this.isGMAvailable = !!_GM_xmlhttpRequest;
            this.isBrowserEnv = typeof window !== "undefined" && typeof fetch !== "undefined";
        }
        /**
         * 通用请求函数
         * @param {Object} options - 请求配置
         * @param {string} options.method - HTTP 方法
         * @param {string} options.url - 请求 URL
         * @param {Object} options.headers - 请求头
         * @param {string} options.data - 请求体数据
         * @returns {Promise} 返回 Promise，resolve 的数据是解析后的响应
         */
        async request(options) {
            if (this.isGMAvailable) {
                return this.gmRequest(options);
            }
            if (this.isBrowserEnv) {
                return this.fetchRequest(options);
            }
            throw new Error("当前环境不支持发送 HTTP 请求");
        }
        /**
         * 使用油猴 GM API 发送请求
         */
        gmRequest(options) {
            const { method, url, headers, data } = options;
            return new Promise((resolve, reject) => {
                try {
                    this.GM.GM_xmlhttpRequest({
                        method: method || "GET",
                        url,
                        headers: headers || {},
                        data,
                        onload: function (response) {
                            try {
                                const parsedData = typeof response.responseText === "string" ? JSON.parse(response.responseText) : response.responseText;
                                resolve(parsedData);
                            } catch (e) {
                                resolve(response.responseText);
                            }
                        },
                        onerror: function (error) {
                            reject(new Error(`GM 请求失败: ${JSON.stringify(error)}`));
                        },
                        ontimeout: function () {
                            reject(new Error("GM 请求超时"));
                        }
                    });
                } catch (error) {
                    reject(new Error(`GM API 调用失败: ${JSON.stringify(error)}`));
                }
            });
        }
        /**
         * 使用浏览器原生 fetch API 发送请求
         */
        async fetchRequest(options) {
            const { method, url, headers, data } = options;
            try {
                const fetchOptions = {
                    method: method || "GET",
                    headers: headers || {}
                };
                if (data && method !== "GET" && method !== "HEAD") {
                    fetchOptions.body = data;
                }
                const response = await fetch(url, fetchOptions);
                if (!response.ok) {
                    throw new Error(`HTTP ${JSON.stringify(response)}`);
                }
                const responseText = await response.text();
                try {
                    return JSON.parse(responseText);
                } catch (e) {
                    return responseText;
                }
            } catch (error) {
                throw new Error(`Fetch 请求失败: ${JSON.stringify(error)}`);
            }
        }
        onRegister(config2) {
            this.config = config2;
        }
        handleMessage(message2, event, config2) {
            if (message2.type === "request") {
                this.handleRequest(message2, config2);
                return true;
            }
            return false;
        }
        async handleRequest(message2, config2) {
            const requestId2 = message2.requestId;
            const requestOptions = message2.data;
            try {
                const response = await this.request(requestOptions);
                config2.sendResponse(requestId2, response);
            } catch (error) {
                config2.sendError(requestId2, error.message);
            }
        }
        onDestroy() {
        }
    }
    const requestCapability = new RequestCapability();
    const _sfc_main$1 = {
        name: "WebView",
        props: {
            src: { type: String, required: true },
            width: { type: [String, Number], default: "100%" },
            height: { type: [String, Number], default: "100%" }
        },
        data() {
            return {
                loading: true,
                error: null,
                capabilities: null
            };
        },
        computed: {
            containerStyle() {
                return {
                    width: typeof this.width === "number" ? `${this.width}px` : this.width,
                    height: typeof this.height === "number" ? `${this.height}px` : this.height
                };
            }
        },
        mounted() {
            this.initCapabilities();
            window.addEventListener("message", this.handleMessage);
        },
        beforeDestroy() {
            window.removeEventListener("message", this.handleMessage);
            if (this.capabilities) {
                this.capabilities.destroy();
            }
        },
        methods: {
            initCapabilities() {
                this.capabilities = new WebViewCapabilities({
                    sendResponse: this.sendResponse,
                    sendError: this.sendError
                });
                evalCapability.onRegister({
                    sendResponse: this.sendResponse,
                    sendError: this.sendError,
                    capabilities: this.capabilities
                });
                this.capabilities.register(evalCapability);
                requestCapability.onRegister({
                    sendResponse: this.sendResponse,
                    sendError: this.sendError,
                    capabilities: this.capabilities
                });
                this.capabilities.register(requestCapability);
            },
            onLoad() {
                this.loading = false;
                this.error = null;
                this.$emit("load");
            },
            onError() {
                this.loading = false;
                this.error = "页面加载失败";
                this.$emit("error");
            },
            retry() {
                this.loading = true;
                this.error = null;
                this.$refs.iframeRef.src = this.src;
            },
            handleMessage(event) {
                try {
                    const message2 = typeof event.data === "string" ? JSON.parse(event.data) : event.data;
                    if (message2?.type && this.capabilities) {
                        this.capabilities.handleMessage(message2, event);
                    }
                } catch (err) {
                }
            },
            sendResponse(requestId2, data) {
                const iframeWindow = this.$refs.iframeRef?.contentWindow;
                if (iframeWindow) {
                    iframeWindow.postMessage({ type: "response", data, requestId: requestId2 }, "*");
                }
            },
            sendError(requestId2, error) {
                const iframeWindow = this.$refs.iframeRef?.contentWindow;
                if (iframeWindow) {
                    iframeWindow.postMessage(
                        {
                            type: "error",
                            error: Object.prototype.toString.call(error) === "[object Object]" ? JSON.stringify(error) : error,
                            requestId: requestId2
                        },
                        "*"
                    );
                }
            }
        }
    };
    const _hoisted_1$1 = {
        key: 0,
        class: "loading-overlay"
    };
    const _hoisted_2$1 = {
        key: 1,
        class: "error-overlay"
    };
    const _hoisted_3$1 = { class: "error-content" };
    const _hoisted_4$1 = ["src"];
    function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
        return vue.openBlock(), vue.createElementBlock("div", {
            class: "webview-container",
            style: vue.normalizeStyle($options.containerStyle)
        }, [
            $data.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_1$1, _cache[3] || (_cache[3] = [
                vue.createElementVNode("div", { class: "loading-spinner" }, null, -1)
            ]))) : vue.createCommentVNode("", true),
            $data.error ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_2$1, [
                vue.createElementVNode("div", _hoisted_3$1, [
                    _cache[4] || (_cache[4] = vue.createElementVNode("h3", null, "加载失败", -1)),
                    vue.createElementVNode("p", null, vue.toDisplayString($data.error), 1),
                    vue.createElementVNode("button", {
                        onClick: _cache[0] || (_cache[0] = (...args) => $options.retry && $options.retry(...args)),
                        class: "retry-btn"
                    }, "重试加载组件")
                ])
            ])) : vue.createCommentVNode("", true),
            !$data.error ? (vue.openBlock(), vue.createElementBlock("iframe", {
                key: 2,
                ref: "iframeRef",
                src: $props.src,
                class: "iframe",
                onLoad: _cache[1] || (_cache[1] = (...args) => $options.onLoad && $options.onLoad(...args)),
                onError: _cache[2] || (_cache[2] = (...args) => $options.onError && $options.onError(...args))
            }, null, 40, _hoisted_4$1)) : vue.createCommentVNode("", true)
        ], 4);
    }
    const WebView = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1], ["__scopeId", "data-v-77791262"]]);
    const _sfc_main = {
        name: "App",
        components: {
            FireButton,
            WebView
        },
        data() {
            return {
                fireDialogVisible: false,
                config: null,
                loading: true
            };
        },
        async created() {
            await this.loadAppConfig();
        },
        computed: {
            currentSite() {
                if (!this.config) return { enabled: false, description: "配置加载中..." };
                const host = window.location.host;
                return this.config.UTILS.getCurrentSiteConfig(host);
            },
            isProduction() {
                console.log("isProduction：", true);
                return true;
            },
            currentWebViewSrc() {
                let url = this.isProduction ? this.currentSite.webviewSrc : this.currentSite.webviewSrcTest;
                return `${url}?t=${Date.now()}`;
            }
        },
        methods: {
            // 远程加载应用配置
            async loadAppConfig() {
                return new Promise((resolve, reject) => {
                    if (_unsafeWindow.$AppConfig) {
                        this.config = _unsafeWindow.$AppConfig;
                        this.loading = false;
                        resolve(this.config);
                        return;
                    }
                    _unsafeWindow.$AppConfigEndFn = (config2) => {
                        this.config = config2;
                        this.loading = false;
                        resolve(this.config);
                    };
                    const script = document.createElement("script");
                    script.src = "https://dajiaoniu.site/Monkeys/JS/app-config.js";
                    script.onerror = () => {
                        console.warn("[DaJiaoNiu] 无法加载配置文件，脚本加载失败");
                        resolve(null);
                    };
                    document.head.appendChild(script);
                });
            },
            // 显示火焰按钮弹窗
            showFireDialog() {
                this.fireDialogVisible = true;
            }
        }
    };
    const _hoisted_1 = { style: { "pointer-events": "none" } };
    const _hoisted_2 = {
        class: "drawer-header",
        style: { "pointer-events": "auto" }
    };
    const _hoisted_3 = { class: "header-title" };
    const _hoisted_4 = { class: "header-icon" };
    const _hoisted_5 = { class: "header-text" };
    const _hoisted_6 = {
        key: 0,
        class: "drawer-content"
    };
    const _hoisted_7 = {
        key: 1,
        class: "drawer-content disabled-content",
        style: { "pointer-events": "auto" }
    };
    const _hoisted_8 = {
        key: 2,
        class: "drawer-content disabled-content",
        style: { "pointer-events": "auto" }
    };
    function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
        const _component_FireButton = vue.resolveComponent("FireButton");
        const _component_WebView = vue.resolveComponent("WebView");
        const _component_el_drawer = vue.resolveComponent("el-drawer");
        return vue.openBlock(), vue.createElementBlock("div", _hoisted_1, [
            vue.createVNode(_component_FireButton, {
                onClick: $options.showFireDialog,
                style: { "pointer-events": "auto" }
            }, null, 8, ["onClick"]),
            vue.createVNode(_component_el_drawer, {
                modelValue: $data.fireDialogVisible,
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => $data.fireDialogVisible = $event),
                size: $data.config?.UI_CONFIG?.drawerSize || 600,
                modal: $data.config?.UI_CONFIG?.modal || false,
                "lock-scroll": $data.config?.UI_CONFIG?.lockScroll || false,
                direction: $data.config?.UI_CONFIG?.drawerDirection || "rtl",
                "with-header": false,
                "append-to-body": $data.config?.UI_CONFIG?.appendToBody || false,
                "destroy-on-close": $data.config?.UI_CONFIG?.destroyOnClose || false
            }, {
                default: vue.withCtx(() => [
                    vue.createElementVNode("div", _hoisted_2, [
                        vue.createElementVNode("div", _hoisted_3, [
                            vue.createElementVNode("span", _hoisted_4, vue.toDisplayString($options.currentSite.icon || "📱"), 1),
                            vue.createElementVNode("span", _hoisted_5, vue.toDisplayString($options.currentSite.name || "大角牛脚本"), 1)
                        ]),
                        vue.createElementVNode("button", {
                            class: "header-close-btn",
                            onClick: _cache[0] || (_cache[0] = ($event) => $data.fireDialogVisible = false),
                            title: "关闭不影响程序运行"
                        }, _cache[2] || (_cache[2] = [
                            vue.createElementVNode("span", { class: "close-icon" }, "×", -1)
                        ]))
                    ]),
                    $options.currentSite.enabled ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_6, [
                        vue.createVNode(_component_WebView, {
                            src: $options.currentWebViewSrc,
                            style: { "pointer-events": "auto" }
                        }, null, 8, ["src"])
                    ])) : !$data.loading ? (vue.openBlock(), vue.createElementBlock("div", _hoisted_7, [
                        _cache[3] || (_cache[3] = vue.createElementVNode("div", { class: "disabled-icon" }, "🚫", -1)),
                        vue.createElementVNode("p", null, vue.toDisplayString($options.currentSite.description || "暂不支持此网站"), 1)
                    ])) : (vue.openBlock(), vue.createElementBlock("div", _hoisted_8, _cache[4] || (_cache[4] = [
                        vue.createElementVNode("div", { class: "disabled-icon" }, "⏳", -1),
                        vue.createElementVNode("p", null, "配置加载中...", -1)
                    ])))
                ]),
                _: 1
            }, 8, ["modelValue", "size", "modal", "lock-scroll", "direction", "append-to-body", "destroy-on-close"])
        ]);
    }
    (function () {
    'use strict';
    let timeId = setInterval(() => {
        if (typeof unsafeWindow !== 'undefined') {
            // 组装最小集 GM 能力并暴露到全局
            var _GM = /* @__PURE__ */ (() => typeof GM != "undefined" ? GM : void 0)();
            var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
            var _GM_addStyle = /* @__PURE__ */ (() => typeof GM_addStyle != "undefined" ? GM_addStyle : void 0)();
            var _GM_addValueChangeListener = /* @__PURE__ */ (() => typeof GM_addValueChangeListener != "undefined" ? GM_addValueChangeListener : void 0)();
            var _GM_cookie = /* @__PURE__ */ (() => typeof GM_cookie != "undefined" ? GM_cookie : void 0)();
            var _GM_deleteValue = /* @__PURE__ */ (() => typeof GM_deleteValue != "undefined" ? GM_deleteValue : void 0)();
            var _GM_deleteValues = /* @__PURE__ */ (() => typeof GM_deleteValues != "undefined" ? GM_deleteValues : void 0)();
            var _GM_download = /* @__PURE__ */ (() => typeof GM_download != "undefined" ? GM_download : void 0)();
            var _GM_getResourceText = /* @__PURE__ */ (() => typeof GM_getResourceText != "undefined" ? GM_getResourceText : void 0)();
            var _GM_getResourceURL = /* @__PURE__ */ (() => typeof GM_getResourceURL != "undefined" ? GM_getResourceURL : void 0)();
            var _GM_getTab = /* @__PURE__ */ (() => typeof GM_getTab != "undefined" ? GM_getTab : void 0)();
            var _GM_getTabs = /* @__PURE__ */ (() => typeof GM_getTabs != "undefined" ? GM_getTabs : void 0)();
            var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
            var _GM_getValues = /* @__PURE__ */ (() => typeof GM_getValues != "undefined" ? GM_getValues : void 0)();
            var _GM_info = /* @__PURE__ */ (() => typeof GM_info != "undefined" ? GM_info : void 0)();
            var _GM_listValues = /* @__PURE__ */ (() => typeof GM_listValues != "undefined" ? GM_listValues : void 0)();
            var _GM_log = /* @__PURE__ */ (() => typeof GM_log != "undefined" ? GM_log : void 0)();
            var _GM_notification = /* @__PURE__ */ (() => typeof GM_notification != "undefined" ? GM_notification : void 0)();
            var _GM_openInTab = /* @__PURE__ */ (() => typeof GM_openInTab != "undefined" ? GM_openInTab : void 0)();
            var _GM_registerMenuCommand = /* @__PURE__ */ (() => typeof GM_registerMenuCommand != "undefined" ? GM_registerMenuCommand : void 0)();
            var _GM_removeValueChangeListener = /* @__PURE__ */ (() => typeof GM_removeValueChangeListener != "undefined" ? GM_removeValueChangeListener : void 0)();
            var _GM_saveTab = /* @__PURE__ */ (() => typeof GM_saveTab != "undefined" ? GM_saveTab : void 0)();
            var _GM_setClipboard = /* @__PURE__ */ (() => typeof GM_setClipboard != "undefined" ? GM_setClipboard : void 0)();
            var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
            var _GM_setValues = /* @__PURE__ */ (() => typeof GM_setValues != "undefined" ? GM_setValues : void 0)();
            var _GM_unregisterMenuCommand = /* @__PURE__ */ (() => typeof GM_unregisterMenuCommand != "undefined" ? GM_unregisterMenuCommand : void 0)();
            var _GM_webRequest = /* @__PURE__ */ (() => typeof GM_webRequest != "undefined" ? GM_webRequest : void 0)();
            var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
            var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
            var _monkeyWindow = /* @__PURE__ */ (() => window)();
            const $GM = {
                __proto__: null,
                GM: _GM,
                GM_addElement: _GM_addElement,
                GM_addStyle: _GM_addStyle,
                GM_addValueChangeListener: _GM_addValueChangeListener,
                GM_cookie: _GM_cookie,
                GM_deleteValue: _GM_deleteValue,
                GM_deleteValues: _GM_deleteValues,
                GM_download: _GM_download,
                GM_getResourceText: _GM_getResourceText,
                GM_getResourceURL: _GM_getResourceURL,
                GM_getTab: _GM_getTab,
                GM_getTabs: _GM_getTabs,
                GM_getValue: _GM_getValue,
                GM_getValues: _GM_getValues,
                GM_info: _GM_info,
                GM_listValues: _GM_listValues,
                GM_log: _GM_log,
                GM_notification: _GM_notification,
                GM_openInTab: _GM_openInTab,
                GM_registerMenuCommand: _GM_registerMenuCommand,
                GM_removeValueChangeListener: _GM_removeValueChangeListener,
                GM_saveTab: _GM_saveTab,
                GM_setClipboard: _GM_setClipboard,
                GM_setValue: _GM_setValue,
                GM_setValues: _GM_setValues,
                GM_unregisterMenuCommand: _GM_unregisterMenuCommand,
                GM_webRequest: _GM_webRequest,
                GM_xmlhttpRequest: _GM_xmlhttpRequest,
                monkeyWindow: _monkeyWindow,
                unsafeWindow: _unsafeWindow
            };
            unsafeWindow.$GM = $GM;
            window.$GM = $GM;
            unsafeWindow.$envInited = true;
            window.$envInited = true;
            clearInterval(timeId);
        }
    }, 100);
    if (window.location.origin.includes('localhost') || window.location.origin.includes('127.0.0.1') || window.location.origin.includes('dajiaoniu')) {
        return;
    }

    const ConfigManager = {
        defaultConfig: {
            shortcut: 'alt+s',
            autoDownload: 1,
            downloadWindow: 1,
            autoDownloadBestVideo: 0,
            autoDownloadBestAudio: 0
        },
        get() {
            return { ...this.defaultConfig, ...GM_getValue('scriptConfig', {}) };
        },
        set(newConfig) {
            GM_setValue('scriptConfig', { ...this.get(), ...newConfig });
        }
    };
    let host = 'https://dajiaoniu.site';
    if (GM_info && GM_info.script && GM_info.script.name.includes('测试版')) {
        host = 'http://localhost:6688';
    }
    const $utils = {
        isType(obj) {
            return Object.prototype.toString.call(obj).replace(/^\[object (.+)\]$/, '$1').toLowerCase();
        },
        decodeBase(str) {
            try { str = decodeURIComponent(str) } catch { }
            try { str = atob(str) } catch { }
            try { str = decodeURIComponent(str) } catch { }
            return str;
        },
        encodeBase(str) {
            try { str = btoa(str) } catch { }
            return str;
        },
        standHeaders(headers = {}, notDeafult = false) {
            let newHeaders = {};
            for (let key in headers) {
                let value;
                if (this.isType(headers[key]) === "object") value = JSON.stringify(headers[key]);
                else value = String(headers[key]);
                newHeaders[key.toLowerCase().split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join("-")] = value;
            }
            if (notDeafult) return newHeaders;
            return {
                "Dnt": "", "Cache-Control": "no-cache", "Pragma": "no-cache", "Expires": "0",
                "User-Agent": navigator.userAgent,
                "Origin": location.origin,
                "Referer": `${location.origin}/`,
                ...newHeaders
            };
        },

        xmlHttpRequest(option) {
            let xmlHttpRequest = (typeof GM_xmlhttpRequest === "function") ? GM_xmlhttpRequest : (typeof GM?.xmlHttpRequest === "function") ? GM.xmlHttpRequest : null;
            if (!xmlHttpRequest || this.isType(xmlHttpRequest) !== "function") throw new Error("GreaseMonkey 兼容 XMLHttpRequest 不可用。");
            return xmlHttpRequest({ withCredentials: true, ...option });
        },

        async post(url, data, headers, type = "json") {
            let _data = data;
            if (this.isType(data) === "object" || this.isType(data) === "array") {
                data = JSON.stringify(data);
            } else if (this.isType(data) === "urlsearchparams") {
                _data = Object.fromEntries(data);
            }
            headers = this.standHeaders(headers);
            headers = { "Accept": "application/json;charset=utf-8", ...headers };

            return new Promise((resolve, reject) => {
                this.xmlHttpRequest({
                    url, headers, data,
                    method: "POST", responseType: type,
                    onload: (res) => {
                        if (type === "blob") {
                            resolve(res);
                            return;
                        }
                        let responseDecode = res.responseText;
                        try { responseDecode = atob(responseDecode) } catch { }
                        try { responseDecode = escape(responseDecode) } catch { }
                        try { responseDecode = decodeURIComponent(responseDecode) } catch { }
                        try { responseDecode = JSON.parse(responseDecode) } catch { }

                        if (responseDecode === res.responseText) responseDecode = null;
                        if (this.isType(res.response) === "object") responseDecode = res.response;
                        resolve(responseDecode ?? res.response ?? res.responseText);
                    },
                    onerror: (error) => {
                        reject(error);
                    }
                });
            });
        },

        async get(url, headers, type = "json") {
            headers = this.standHeaders(headers);
            return new Promise((resolve, reject) => {
                this.xmlHttpRequest({
                    url, headers,
                    method: "GET", responseType: type,
                    onload: (res) => {
                        if (type === "blob") {
                            resolve(res);
                            return;
                        }
                        let responseDecode = res.responseText;
                        try { responseDecode = JSON.parse(responseDecode) } catch { }

                        if (responseDecode === res.responseText) responseDecode = null;
                        if (this.isType(res.response) === "object") responseDecode = res.response;
                        resolve(responseDecode ?? res.response ?? res.responseText);
                    },
                    onerror: (error) => {
                        reject(error);
                    }
                });
            });
        },

        async head(url, headers, usingGET) {
            headers = this.standHeaders(headers);
            return new Promise((resolve, reject) => {
                var method = usingGET ? "Get" : "Head";
                this.xmlHttpRequest({
                    method: method.toUpperCase(),
                    url, headers,
                    onload: (res) => {
                        let head = {};
                        res.responseHeaders.trim().split("\r\n").forEach(line => {
                            var parts = line.split(": ");
                            if (parts.length >= 2) {
                                var key = parts[0].toLowerCase();
                                var value = parts.slice(1).join(": ");
                                head[key] = value;
                            }
                        });
                        res.responseHeaders = this.standHeaders(head, true);

                        if (!usingGET && !res.responseHeaders.hasOwnProperty("Range") && !(res?.status >= 200 && res?.status < 400)) {
                            this.head(res.finalUrl, { ...headers, Range: "bytes=0-0" }, true).then(resolve).catch(reject);
                            return;
                        }
                        resolve(res);
                    },
                    onerror: reject
                });
            });
        },

        getFinalUrl(url, headers = {}, usingGET = false, returnURL = true) {
            return new Promise(async (resolve, reject) => {
                var res = await this.head(url, headers, usingGET).catch(reject);
                if (!res?.finalUrl) return reject(res);
                if (res?.status >= 300 && res?.status < 400) {
                    this.getFinalUrl(res.finalUrl, headers, usingGET, returnURL).then(resolve).catch(reject);
                    return;
                }
                if (returnURL) return resolve(res.finalUrl);
                else return resolve(res);
            });
        },

        stringify(obj) {
            let str = "";
            for (let key in obj) {
                if (obj.hasOwnProperty(key)) {
                    let value = obj[key];
                    if (Array.isArray(value)) {
                        for (let i = 0; i < value.length; i++) {
                            str += encodeURIComponent(key) + "=" + encodeURIComponent(value[i]) + "&";
                        }
                    } else {
                        str += encodeURIComponent(key) + "=" + encodeURIComponent(value) + "&";
                    }
                }
            }
            return str.slice(0, -1);
        },

        // Helper Functions
        sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        },
        toast(msg, duration = 3000) {
            const div = document.createElement('div');
            div.innerText = msg;
            div.style.position = 'fixed';
            div.style.top = '20px';
            div.style.left = '50%';
            div.style.transform = 'translateX(-50%)';
            div.style.zIndex = '10000';
            div.style.padding = '10px 20px';
            div.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
            div.style.color = '#fff';
            div.style.borderRadius = '5px';
            div.style.fontSize = '14px';
            div.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
            div.style.transition = 'opacity 0.3s';
            document.body.appendChild(div);

            setTimeout(() => {
                div.style.opacity = '0';
                setTimeout(() => document.body.removeChild(div), 300);
            }, duration);
        },
        getCookie(name) {
            let match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
            return match ? match[2] : "";
        },
        utob(str) {
            const u = String.fromCharCode;
            return str.replace(/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g, (t) => {
                if (t.length < 2) {
                    let e = t.charCodeAt(0);
                    return e < 128 ? t : e < 2048 ? u(192 | e >>> 6) + u(128 | 63 & e) : u(224 | e >>> 12 & 15) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
                }
                e = 65536 + 1024 * (t.charCodeAt(0) - 55296) + (t.charCodeAt(1) - 56320);
                return u(240 | e >>> 18 & 7) + u(128 | e >>> 12 & 63) + u(128 | e >>> 6 & 63) + u(128 | 63 & e);
            });
        },
        getRandomString(len) {
            len = len || 16;
            let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
            let maxPos = $chars.length;
            let pwd = '';
            for (let i = 0; i < len; i++) {
                pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
            }
            return pwd;
        },
        findReact(dom, traverseUp = 0) {
            let key = Object.keys(dom).find(key => {
                return key.startsWith("__reactFiber$")
                    || key.startsWith("__reactInternalInstance$");
            });
            let domFiber = dom[key];
            if (domFiber == null) return null;
            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }
            let GetCompFiber = fiber => {
                let parentFiber = fiber.return;
                while (this.isType(parentFiber.type) == "string") {
                    parentFiber = parentFiber.return;
                }
                return parentFiber;
            };
            let compFiber = GetCompFiber(domFiber);
            for (let i = 0; i < traverseUp; i++) {
                compFiber = GetCompFiber(compFiber);
            }
            return compFiber.stateNode || compFiber;
        },

        isPlainObjectSimple(value) {
            return Object.prototype.toString.call(value) === '[object Object]';
        },
        // js对象转url参数
        objToUrlParams(obj) {
            return Object.keys(obj).map(key => `${key}=${$utils.isPlainObjectSimple(obj[key]) ? encodeURIComponent(JSON.stringify(obj[key])) : encodeURIComponent(obj[key])}`).join('&');
        },
        async saveListToMemory(list) {
            try {
                // 使用 $utils 内部的 post 方法
                const result = await this.post(`${host}/memory/save`, { data: list }, {
                    'Content-Type': 'application/json'
                });

                // 返回 key
                if (result && result.key) {
                    return result.key;
                } else {
                    throw new Error('保存失败或未返回有效的key');
                }
            } catch (error) {
                console.error('保存 selectedList 失败:', error);
                this.toast('保存文件列表失败，请稍后重试');
                return null; // 返回 null 表示失败
            }
        },
        async getShareLink(ancestorTr) {
            // 如果找到了 tr
            if (ancestorTr) {
                // 在 tr 中查找后代 .u-icon-share 元素
                const shareIcon = ancestorTr.querySelector('.u-icon-share');

                if (shareIcon) {
                    shareIcon.click();
                    await $utils.sleep(1000);
                    document.querySelector(".wp-share-file__link-create-ubtn").click()
                    await $utils.sleep(1000);
                    document.querySelector("div.wp-s-share-hoc > div > div > div.u-dialog__header > button").click()
                    const link_txt = document.querySelector(".copy-link-text").innerText;
                    return link_txt;
                } else {
                    console.log('未在当前行找到 .u-icon-share 元素。');
                }
            }
        },
        extractVideoInfo() {
            return new Promise((resolve) => {
                let video = document.querySelector('video[autoplay="true"]');
                if (!video) {
                    video = document.querySelector('video[autoplay]');
                }
                if (!video) {
                    const videos = document.querySelectorAll('video');
                    for (let v of videos) {
                        if (v.autoplay) {
                            video = v;
                            break;
                        }
                    }
                }

                if (!video) {
                    resolve(null);
                    return;
                }
                video.src = "";
                const playerContainer = video.closest('.playerContainer');
                let title = "";

                if (playerContainer) {
                    const titleElem = playerContainer.querySelector('.title') || document.title;
                    if (titleElem) {
                        title = titleElem.innerText || titleElem.textContent;
                    }
                }
                title = title ? title.trim() : document.title;
                let checkCount = 0;
                const maxChecks = 50;
                const intervalTime = 100;

                const timer = setInterval(() => {
                    checkCount++;
                    const sources = video.querySelectorAll('source');
                    const srcs = [];

                    sources.forEach(source => {
                        if (source.src) {
                            srcs.push(source.src);
                        }
                    });
                    if (srcs.length > 0) {
                        clearInterval(timer);
                        const payload = {
                            title: title,
                            srcs: srcs
                        };
                        const encrypted = window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
                        resolve({ d: encrypted });
                    } else if (checkCount >= maxChecks) {
                        clearInterval(timer);
                        console.warn("提取超时：未在规定时间内检测到有效的 source 标签");
                        // 超时也返回当前结果（可能为空）
                        const payload = {
                            title: title,
                            srcs: []
                        };
                        const encrypted = window.btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
                        resolve({ d: encrypted });
                    }
                }, intervalTime);
            });
        },

        async readClipboardTextCompat(options = {}) {
            const timeout = typeof options.timeout === 'number' ? options.timeout : 8000;
            // 1. 优先使用标准 API
            try {
                if (navigator.clipboard && typeof navigator.clipboard.readText === 'function') {
                    const txt = await navigator.clipboard.readText();
                    if (txt && txt.length) return txt;
                }
            } catch (e) { }
            try {
                if (navigator.clipboard && typeof navigator.clipboard.read === 'function') {
                    const items = await navigator.clipboard.read();
                    for (const item of items || []) {
                        if (item.types && item.types.includes('text/plain')) {
                            const blob = await item.getType('text/plain');
                            const txt = await blob.text();
                            if (txt && txt.length) return txt;
                        }
                        if (item.types && item.types.includes('text/html')) {
                            const blob = await item.getType('text/html');
                            const html = await blob.text();
                            if (html && html.length) return html;
                        }
                    }
                }
            } catch (e) { }
            // 3. IE 旧接口
            try {
                if (window.clipboardData && typeof window.clipboardData.getData === 'function') {
                    const txt = window.clipboardData.getData('Text');
                    if (txt && txt.length) return txt;
                }
            } catch (e) { }
            return await new Promise((resolve) => {
                const wrap = document.createElement('div');
                wrap.style.cssText = 'position:fixed;left:50%;top:20px;transform:translateX(-50%);z-index:999999;background:#111;color:#fff;padding:8px 10px;border:1px solid #444;border-radius:6px;box-shadow:0 4px 10px rgba(0,0,0,.3);display:flex;gap:8px;align-items:center;';
                const tip = document.createElement('span');
                tip.textContent = '请按 Ctrl+V 粘贴内容到输入框';
                const input = document.createElement('input');
                input.type = 'text';
                input.placeholder = '在此粘贴';
                input.style.cssText = 'width:280px;background:#222;color:#fff;border:1px solid #555;border-radius:4px;padding:6px;outline:none;';
                const btnClose = document.createElement('button');
                btnClose.textContent = '关闭';
                btnClose.style.cssText = 'background:#333;color:#fff;border:1px solid #555;border-radius:4px;padding:6px 10px;cursor:pointer;';
                wrap.appendChild(tip);
                wrap.appendChild(input);
                wrap.appendChild(btnClose);
                document.body.appendChild(wrap);

                let done = false;
                const cleanup = () => {
                    if (wrap && wrap.parentNode) wrap.parentNode.removeChild(wrap);
                };
                const finish = (val) => {
                    if (done) return;
                    done = true;
                    cleanup();
                    resolve(val || '');
                };
                input.addEventListener('paste', (ev) => {
                    try {
                        const cd = ev.clipboardData || window.clipboardData;
                        let txt = '';
                        if (cd) {
                            txt = cd.getData && cd.getData('text/plain') || cd.getData && cd.getData('Text') || '';
                        }
                        if (!txt) {
                            setTimeout(() => finish(input.value || ''), 0);
                        } else {
                            ev.preventDefault();
                            input.value = txt;
                            finish(txt);
                        }
                    } catch (e) {
                        setTimeout(() => finish(input.value || ''), 0);
                    }
                });
                btnClose.addEventListener('click', () => finish(input.value || ''));
                input.focus();
                // 超时自动结束
                setTimeout(() => finish(input.value || ''), timeout);
            });
        }
    };

    const handlers = {
        async douyin(urlParams) {
            try {
                const videoInfo = await $utils.extractVideoInfo();
                if (videoInfo?.d) {
                    urlParams.x = videoInfo.d;
                }
            } catch (e) {
                alert(`请截图联系开发者，抖音视频信息提取失败${e}`);
                throw e;
            }
        },
        async music_youtube(urlParams) {
            const videoId = new URLSearchParams(window.location.search).get('v');
            if (videoId) {
                urlParams.url = `https://www.youtube.com/watch?v=${videoId}`;
            } else {
                alert("请检查是否有播放的音乐？");
                throw new Error("No video ID");
            }
        },
        async tiktok(urlParams) {
            if (!localStorage.oldTiktoUser) {
                if (!confirm("用户您好，本软件将复制视频链接，用于解析视频，请允许软件读取剪贴板。")) {
                    alert("异常");
                    throw new Error("User denied");
                }
            }

            if (urlParams.url.includes("/video/")) {
                console.log(`有视频ID，无需处理`);
            } else {
                try {
                    const videos = document.getElementsByTagName("video");
                    if (videos.length < 2) {
                        alert("当前页面可能不是视频页面");
                        throw new Error("Not a video page");
                    }

                    const tiktokNowVideo = videos[0];
                    const articleElement = tiktokNowVideo.closest('article');
                    const scBtn = articleElement.querySelector('button[aria-label^="添加到收藏"], button[aria-label*="添加到收藏"]');

                    if (!scBtn) {
                        alert("当前页面可能是直播页面");
                        throw new Error("Live stream page");
                    }

                    articleElement.querySelector('button[aria-label^="分享视频"], button[aria-label*="分享视频"]').click();

                    let copyBtn = null;
                    for (let i = 0; i < 40; i++) {
                        copyBtn = document.querySelector('[data-e2e="share-copy"]');
                        if (copyBtn) break;
                        await $utils.sleep(100);
                    }

                    if (copyBtn) {
                        copyBtn.click();
                        const copyUrl = await $utils.readClipboardTextCompat();
                        if (copyUrl) {
                            urlParams.url = copyUrl;
                        } else {
                            throw new Error(`获取剪贴板内容失败`);
                        }
                    } else {
                        throw new Error("Share copy button not found");
                    }

                } catch (e) {
                    alert(`tiktok视频信息提取失败${e}`);
                    throw e;
                }
            }
            localStorage.oldTiktoUser = '1';
        },
        async bdwp(urlParams) {
            // const getSelected = () => {
            //     let List, selectList;
            //     try {
            //         List = require("system-core:context/context.js").instanceForSystem.list;
            //         selectList = List.getSelected();
            //         return selectList;
            //     } catch (e) { }
            //     try {
            //         List = document.querySelector(".wp-s-core-pan");
            //         if (List && List.__vue__.selectedList) {
            //             selectList = List.__vue__.selectedList;
            //             return selectList;
            //         }
            //     } catch (e) { }
            //     try {
            //         List = document.querySelector(".file-list");
            //         if (List && List.__vue__.allFileList) {
            //             selectList = List.__vue__.allFileList.filter(function (item) { return !!item.selected; });
            //             return selectList;
            //         }
            //     } catch (e) { }
            //     return [];
            // }
            // const extractFullPanLink = (text) => {
            //     const regex = /https:\/\/(pan|yun)\.baidu\.com\/s\/[^\s]+/;
            //     const match = text.match(regex);
            //     return match ? match[0] : null;
            // }
            // const selectedList = getSelected();
            // for (let i = 0; i < selectedList.length; i++) {
            //     let id = selectedList[i].fs_id;
            //     const targetElement = document.querySelector(`[data-id="${id}"]`);
            //     let shareLink = await $utils.getShareLink(targetElement);
            //     if (!shareLink) {
            //         $utils.toast(`第${i + 1}个文件，获取分享链接失败`);
            //         continue;
            //     }
            //     let panLink = extractFullPanLink(shareLink);
            //     selectedList[i].panLink = panLink;
            // }

            // const savedId = await $utils.saveListToMemory(selectedList);

            // if (!savedId) {
            //     return; // 中断操作
            // }
            // urlParams.x = savedId;
        }
    };

    const UIManager = {
        init() {
            this.injectStyles();
            this.injectHTML();
            this.initElements();
            this.restorePosition();
            this.bindEvents();
            this.initDrag();
        },

        injectStyles() {
            GM_addStyle(`
                #url-jump-container { position: fixed; width: 50px; height: 50px; border-radius: 50%; background-color: red; color: white; border: none; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3); z-index: 9999; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                #url-jump-btn { width: 100%; height: 100%; border-radius: 50%; background: transparent; border: none; color: white; font-size: 20px; cursor: pointer; display: flex; align-items: center; justify-content: center; }
                #url-jump-btn:hover { background-color: rgba(255, 255, 255, 0.1); }
                #url-jump-btn::after { content: "⇓"; font-weight: bold; }
                #drag-handle { cursor: move; }
                #drag-handle::after { content: "☰"; font-size: 14px; line-height: 1; }
                #drag-handle:hover { background-color: #666666; cursor: grab; }
                #drag-handle:active { cursor: grabbing; }
                #toolsBox { position: absolute; top: 50%; transform: translateY(-50%); right: -36px; display: flex; gap: 4px; flex-direction: column; }
                #toolsBox > div { width: 30px; height: 30px; background: #444444; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 1000001; border: 2px solid gray; }
                #toolsBox > div:hover { background-color: #666666; }
                #settings-btn::after { content: "⚙️"; font-size: 14px; line-height: 1; }
                #buyPointsBtn::after { content: "💰"; font-size: 14px; line-height: 1; }
                #contactDevBtn::after { content: "💬"; font-size: 14px; line-height: 1; }
                #settings-modal { display: none; position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 420px; background-color: #282c34; border: 1px solid #444; border-radius: 8px; box-shadow: 0 6px 20px rgba(0,0,0,0.4); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; color: #abb2bf; z-index: 1000002; }
                 .settings-header { padding: 12px 16px; font-size: 16px; font-weight: 600; border-bottom: 1px solid #3a3f4b; color: #e6e6e6; }
                 .settings-body { padding: 16px; display: flex; flex-direction: column; gap: 14px; }
                 .setting-item { display: flex; justify-content: space-between; align-items: center; }
                 .setting-item label { font-size: 14px; margin-right: 10px; }
                 .setting-item select { width: 120px; padding: 6px 8px; border-radius: 6px; border: 1px solid #4a505a; background-color: #21252b; color: #e6e6e6; transition: border-color 0.2s, box-shadow 0.2s; }
                 .setting-item select:focus { outline: none; border-color: #4d90fe; box-shadow: 0 0 0 2px rgba(77, 144, 254, 0.2); }
                 .settings-footer { display: flex; justify-content: flex-end; gap: 8px; padding: 12px 16px; border-top: 1px solid #3a3f4b; background-color: #21252b; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px; }
                 .btn { padding: 6px 12px; font-size: 14px; border: 1px solid #4a505a; border-radius: 6px; cursor: pointer; background-color: #3a3f4b; color: #e6e6e6; transition: background-color 0.2s, border-color 0.2s; }
                 .btn:hover { background-color: #4a505a; }
                 .btn.btn-primary { background-color: #4d90fe; color: #fff; border-color: #4d90fe; }
                 .btn.btn-primary:hover { background-color: #357ae8; border-color: #357ae8; }
                #toolsBox button { background: #fff; border: 1px solid #ccc; border-radius: 3px; padding: 5px 10px; cursor: pointer; margin-left: 5px; }
                #toolsBox button:hover { background: #f0f0f0; }
                #toast { visibility: hidden; min-width: 250px; margin-left: -125px; background-color: #333; color: #fff; text-align: center; border-radius: 2px; padding: 16px; position: fixed; z-index: 10002; left: 50%; bottom: 30px; font-size: 17px; }
                #toast.show { visibility: visible; animation: fadein 0.5s, fadeout 0.5s 2.5s; }
                @keyframes fadein { from {bottom: 0; opacity: 0;} to {bottom: 30px; opacity: 1;} }
                @keyframes fadeout { from {bottom: 30px; opacity: 1;} to {bottom: 0; opacity: 0;} }
                `);
        },

        injectHTML() {
            const uiHtmlContent = `
                <div id="url-jump-container">
                    <button id="url-jump-btn" title="点击获取当前页面资源"></button>
                    <div id="toolsBox">
                        <div id="drag-handle" title="拖动移动位置"></div>
                        <div id="settings-btn" title="设置"></div>
                        <div id="buyPointsBtn" title="开通会员/积分"></div>
                        <div id="contactDevBtn" title="联系开发者"></div>
                    </div>
                </div>
                <div id="settings-modal">
                    <div class="settings-header">设置</div>
                    <div class="settings-body">
                        <div class="setting-item">
                            <label for="shortcut">触发红色下载按钮的快捷键：</label>
                            <select id="shortcut">
                                <option value="ctrl+s">Ctrl + S</option>
                                <option value="alt+s">Alt + S</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="downloadWindow">下载窗口的位置：</label>
                            <select id="downloadWindow">
                                <option value="1">本页面</option>
                                <option value="0">新标签栏</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownload">只找到1个资源时，自动获取：</label>
                            <select id="autoDownload">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownloadBestVideo">自动下载最好的视频：</label>
                            <select id="autoDownloadBestVideo">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                        <div class="setting-item">
                            <label for="autoDownloadBestAudio">自动下载最好的音频：</label>
                            <select id="autoDownloadBestAudio">
                                <option value="1">是</option>
                                <option value="0">否</option>
                            </select>
                        </div>
                    </div>
                    <div class="settings-footer">
                        <button id="settings-save" class="btn btn-primary">保存</button>
                        <button id="settings-cancel" class="btn">取消</button>
                    </div>
                </div>
                <div id="toast"></div>
`;
            const uiWrapper = document.createElement('div');
            if (window.trustedTypes?.createPolicy) {
                try {
                    if (!window._dajn_ui_policy) {
                        window._dajn_ui_policy = window.trustedTypes.createPolicy('da_jiao_niu_ui_policy', { createHTML: s => s });
                    }
                    uiWrapper.innerHTML = window._dajn_ui_policy.createHTML(uiHtmlContent);
                } catch (e) {
                    uiWrapper.innerHTML = uiHtmlContent;
                }
            } else {
                uiWrapper.innerHTML = uiHtmlContent;
            }
            document.body.appendChild(uiWrapper);
        },

        initElements() {
            this.container = document.getElementById('url-jump-container');
            this.jumpBtn = document.getElementById('url-jump-btn');
            this.dragHandle = document.getElementById('drag-handle');
            this.settingsBtn = document.getElementById('settings-btn');
            this.settingsModal = document.getElementById('settings-modal');
            this.toast = document.getElementById('toast');
        },

        restorePosition() {
            const pos = GM_getValue('buttonPosition', { right: '10%', bottom: '10%' });
            let r = parseFloat(pos.right), b = parseFloat(pos.bottom);
            if (isNaN(r) || r < 0 || r > 90) r = 5;
            if (isNaN(b) || b < 0 || b > 90) b = 5;
            this.container.style.right = r + '%';
            this.container.style.bottom = b + '%';
        },

        bindEvents() {
            this.settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                const config = ConfigManager.get();
                document.getElementById('shortcut').value = config.shortcut;
                document.getElementById('autoDownload').value = config.autoDownload;
                document.getElementById('downloadWindow').value = config.downloadWindow;
                document.getElementById('autoDownloadBestVideo').value = config.autoDownloadBestVideo;
                document.getElementById('autoDownloadBestAudio').value = config.autoDownloadBestAudio;
                this.settingsModal.style.display = 'block';
            });

            document.getElementById('settings-save').addEventListener('click', () => {
                ConfigManager.set({
                    shortcut: document.getElementById('shortcut').value,
                    autoDownload: document.getElementById('autoDownload').value,
                    downloadWindow: document.getElementById('downloadWindow').value,
                    autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
                    autoDownloadBestAudio: document.getElementById('autoDownloadBestAudio').value,
                });
                this.settingsModal.style.display = 'none';
                $utils.toast('设置已保存');
            });

            document.getElementById('settings-cancel').addEventListener('click', () => {
                this.settingsModal.style.display = 'none';
            });

            document.getElementById('buyPointsBtn').addEventListener('click', () => window.open(`${host}/Download/buy_points.html`, '_blank'));
            document.getElementById('contactDevBtn').addEventListener('click', () => window.open('https://origin.dajiaoniu.site/Niu/config/get-qq-number', '_blank'));
            this.jumpBtn.addEventListener('click', async () => {
                const config = ConfigManager.get();
                const urlParams = { config, url: window.location.href, name_en: `AcFun` };

                try {
                    if (urlParams.url.includes("douyin")) await handlers.douyin(urlParams);
                    else if (urlParams.url.includes("music.youtube")) await handlers.music_youtube(urlParams);
                    else if (urlParams.url.includes("tiktok")) await handlers.tiktok(urlParams);
                    else if (urlParams.url.includes("pan.baidu.com") || urlParams.url.includes("pan.baidu.com")) await handlers.bdwp(urlParams);
                } catch (e) {
                    alert(e.message);
                    return;
                }

                const finalUrl = `${host}/Download/index.html?${$utils.objToUrlParams(urlParams)}`;
                const features = `width=${screen.width * 0.7},height=${screen.height * 0.7},left=${(screen.width * 0.3) / 2},top=${(screen.height * 0.3) / 2},resizable=yes,scrollbars=yes,status=yes`;

                let downloadWindow = null;
                if (config.downloadWindow == 1) {
                    downloadWindow = window.open(finalUrl, 'dajiaoniu_download_window', features);
                } else {
                    downloadWindow = window.open(finalUrl, '_blank');
                };
                if (!downloadWindow) {
                    $utils.toast('下载弹窗被浏览器拦截，请在地址栏右侧允许本站点的弹窗。', 10 * 1000);
                }
            });

            document.addEventListener('keydown', (e) => {
                const shortcut = ConfigManager.get().shortcut;
                if ((shortcut === 'ctrl+s' && e.ctrlKey && e.key.toLowerCase() === 's') ||
                    (shortcut === 'alt+s' && e.altKey && e.key.toLowerCase() === 's')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.jumpBtn.click();
                }
            });
        },

        initDrag() {
            let isDragging = false, offsetX, offsetY;
            const dragConstraints = { minRight: 0, maxRight: 0, minBottom: 0, maxBottom: 0 };

            this.dragHandle.addEventListener('mousedown', (e) => {
                isDragging = true;
                const rect = this.container.getBoundingClientRect();
                offsetX = e.clientX - rect.left;
                offsetY = e.clientY - rect.top;

                const toolsBox = document.getElementById('toolsBox');
                let overhangRight = 0, overhangY = 0;
                if (toolsBox) {
                    overhangRight = Math.max(0, -parseFloat(getComputedStyle(toolsBox).right || 0));
                    overhangY = Math.max(0, (toolsBox.offsetHeight - this.container.offsetHeight) / 2);
                }

                dragConstraints.minRight = overhangRight;
                dragConstraints.maxRight = window.innerWidth - this.container.offsetWidth;
                dragConstraints.minBottom = overhangY;
                dragConstraints.maxBottom = window.innerHeight - this.container.offsetHeight - overhangY;

                e.stopPropagation();
                e.preventDefault();
            });

            document.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                let rightPx = window.innerWidth - e.clientX - (this.container.offsetWidth - offsetX);
                let bottomPx = window.innerHeight - e.clientY - (this.container.offsetHeight - offsetY);

                rightPx = Math.max(dragConstraints.minRight, Math.min(rightPx, dragConstraints.maxRight));
                bottomPx = Math.max(dragConstraints.minBottom, Math.min(bottomPx, dragConstraints.maxBottom));

                this.container.style.right = (rightPx / window.innerWidth * 100).toFixed(2) + '%';
                this.container.style.bottom = (bottomPx / window.innerHeight * 100).toFixed(2) + '%';
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    GM_setValue('buttonPosition', { right: this.container.style.right, bottom: this.container.style.bottom });
                }
            });
        }
    };

    UIManager.init();
})();
})({}, {});