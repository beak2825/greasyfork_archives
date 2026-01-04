// ==UserScript==
// @name AcFun视频下载
// @namespace https://gitee.com/u2222223/greasyfork_scripts/raw/master/AcFun/index.js
// @version 5.1.0
// @description 2026新脚本，长期维护。下载AcFun视频，支持4K/1080P/720P多画质。
// @icon https://cdn.aixifan.com/ico/favicon.ico
// @match *://www.acfun.cn/*
// @match *://dajiaoniu.site/* 
// @match *://localhost:6688/*
// @author       大角牛
// @supportURL   https://gitee.com/u2222223/greasyfork_scripts/issues
// @license      MIT
// @connect acfun.cn
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
                if (!GM.info.script.namespace.includes(name_en)) {
                    console.log(`当前：${name_en}, 拒绝：${GM.info.script.namespace}`)
                    return;
                } else {
                    console.log(`当前：${name_en}, 允许：${GM.info.script.namespace}`)
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
    // =============================================================================================================
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

    // 添加自定义样式
    GM_addStyle(`
        #url-jump-container {
            position: fixed;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: red;
            color: white;
            border: none;
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
        }
        #url-jump-btn {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background: transparent;
            border: none;
            color: white;
            font-size: 20px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        #url-jump-btn:hover {
            background-color: rgba(255, 255, 255, 0.1);
        }
        #url-jump-btn::after {
            content: "⇓";
            font-weight: bold;
        }
        #drag-handle {
            cursor: move;
        }
        #drag-handle::after {
            content: "☰"; /* 汉堡菜单图标，表示可拖动 */
            font-size: 14px;
            line-height: 1;
        }
        #drag-handle:hover {
            background-color: #666666;
            cursor: grab; /* 悬停时的抓取光标 */
        }
        #drag-handle:active {
            cursor: grabbing; /* 按住时的抓取中光标 */
        }
        #toolsBox {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            right: -24px;
            display: flex;
            gap: 4px;
            display: flex;
            flex-direction: column;
        }
        #toolsBox > div{
            width: 20px;
            height: 20px;
            background: #444444;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 1000001;
            border: 2px solid gray;
        }
        #toolsBox > div:hover {
            background-color: #666666;
        }
        #settings-btn::after {
            content: "⚙️";
            font-size: 14px;
            line-height: 1;
        }
        #buyPointsBtn::after {
            content: "💰"; /* 金钱/购买的图标 */
            font-size: 14px;
            line-height: 1;
        }
        #contactDevBtn::after {
            content: "💬"; /* 对话气泡图标 */
            font-size: 14px;
            line-height: 1;
        }
        #settings-modal{
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 1000002;
            width: 300px;
            user-select: none;
        }
    `);
    const uiWrapper = document.createElement('div');
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
            <div style="margin-bottom: 20px; font-weight: bold;font-size: 16px;">设置</div>
            <div style="margin-bottom: 14px;">
                <label style="display: block; margin-bottom: 6px;">快捷键:</label>
                <select id="shortcut" style="width: 100%; padding: 6px;">
                    <option value="ctrl+s">Ctrl + S</option>
                    <option value="alt+s">Alt + S</option>
                </select>
            </div>
            <div style="margin-bottom: 14px;">
                <label style="display: block; margin-bottom: 6px;">只找到1个资源时，自动下载:</label>
                <select id="autoDownload" style="width: 100%; padding: 6px;">
                <option value="1">是</option>
                <option value="0">否</option>
                </select>
            </div>
            <div style="margin-bottom: 14px;">
                <label style="display: block; margin-bottom: 6px;">下载窗口位置</label>
                <select id="downloadWindow" style="width: 100%; padding: 6px;">
                    <option value="1">本页面</option>
                    <option value="0">新标签栏</option>
                </select>
            </div>
            <div style="margin-bottom: 14px;">
                <label style="display: block; margin-bottom: 6px;">自动下载最好的视频</label>
                <select id="autoDownloadBestVideo" style="width: 100%; padding: 6px;">
                    <option value="1">是</option>
                    <option value="0">否</option>
                </select>
            </div>
            <div style="margin-bottom: 14px;">
                <label style="display: block; margin-bottom: 6px;">自动下载最好的音频</label>
                <select id="autoDownloadBestAudio" style="width: 100%; padding: 6px;">
                    <option value="1">是</option>
                    <option value="0">否</option>
                </select>
            </div>
            <div style="text-align: right;">
                <button id="settings-save" style="padding: 5px 10px; cursor: pointer;">保存</button>
                <button id="settings-cancel" style="padding: 5px 10px; cursor: pointer; margin-left: 6px;">取消</button>
            </div>
        </div>
    `;

    // 解决 TrustedHTML 报错问题
    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        try {
            // 使用全局变量防止重复创建同名策略导致报错
            if (!window._dajn_ui_policy) {
                window._dajn_ui_policy = window.trustedTypes.createPolicy('da_jiao_niu_ui_policy', {
                    createHTML: (string) => string
                });
            }
            uiWrapper.innerHTML = window._dajn_ui_policy.createHTML(uiHtmlContent);
        } catch (e) {
            // 如果策略创建被CSP禁止，尝试直接赋值
            console.warn('TrustedTypes policy creation failed, fallback to raw assignment:', e);
            uiWrapper.innerHTML = uiHtmlContent;
        }
    } else {
        uiWrapper.innerHTML = uiHtmlContent;
    }

    document.body.appendChild(uiWrapper);

    const container = document.getElementById('url-jump-container');
    const jumpBtn = document.getElementById('url-jump-btn');
    const dragHandle = document.getElementById('drag-handle');
    const settingsBtn = document.getElementById('settings-btn');
    const settingsModal = document.getElementById('settings-modal');

    // 添加按钮点击事件
    document.getElementById('buyPointsBtn').addEventListener('click', () => {
        window.open(`${host}/Download/buy_points.html`, '_blank');
    });

    document.getElementById('contactDevBtn').addEventListener('click', () => {
        window.open('https://origin.dajiaoniu.site/Niu/config/get-qq-number', '_blank');
    });

    // 添加一些基本样式
    GM_addStyle(`
        #toolsBox button {
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 3px;
            padding: 5px 10px;
            cursor: pointer;
            margin-left: 5px;
        }
        #toolsBox button:hover {
            background: #f0f0f0;
        }
    `);

    // 默认配置
    const defaultConfig = {
        // 打开大角牛助手的快捷键
        shortcut: 'ctrl+s',
        // 只有一个资源时自动获取
        autoDownload: 1,
        // 大角牛助手的打开方式
        downloadWindow: 1,
        // 是否自动下载最好的视频
        autoDownloadBestVideo: 0,
        // 是否自动下载最好的音频
        autoDownloadBestAudio: 0
    };

    // 读取配置
    function getScriptConfig() {
        // 读取存储的配置
        const storedConfig = GM_getValue('scriptConfig', {});
        // 合并默认配置
        return { ...defaultConfig, ...storedConfig };
    }

    // 保存配置
    function setScriptConfig(newConfig) {
        const currentConfig = getScriptConfig();
        const mergedConfig = { ...currentConfig, ...newConfig };
        GM_setValue('scriptConfig', mergedConfig);
    }

    // 显示配置
    settingsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const config = getScriptConfig();
        document.getElementById('shortcut').value = config.shortcut;
        document.getElementById('autoDownload').value = config.autoDownload;
        document.getElementById('downloadWindow').value = config.downloadWindow;
        document.getElementById('autoDownloadBestVideo').value = config.autoDownloadBestVideo;
        document.getElementById('autoDownloadBestAudio').value = config.autoDownloadBestAudio;
        settingsModal.style.display = 'block';
    });

    document.getElementById('settings-save').addEventListener('click', () => {
        setScriptConfig({
            shortcut: document.getElementById('shortcut').value,
            autoDownload: document.getElementById('autoDownload').value,
            downloadWindow: document.getElementById('downloadWindow').value,
            autoDownloadBestVideo: document.getElementById('autoDownloadBestVideo').value,
            autoDownloadBestAudio: document.getElementById('autoDownloadBestAudio').value,
        });
        settingsModal.style.display = 'none';
        alert('设置已保存');
    });

    document.getElementById('settings-cancel').addEventListener('click', () => {
        settingsModal.style.display = 'none';
    });

    // 从本地存储获取上次位置，没有则使用默认位置
    const savedPosition = GM_getValue('buttonPosition', {
        right: '5%',
        bottom: '5%'
    });
    const host = `https://dajiaoniu.site`
    // const host = `http://localhost:6688`
    container.style.right = savedPosition.right;
    container.style.bottom = savedPosition.bottom;
    let newWindow = null;
    jumpBtn.addEventListener('click', async function () {
        let config = getScriptConfig();
        let urlParams = {
            config,
            url: window.location.href,
            name_en: `AcFun`,
        }
        // let targetUrl = `https://www.baidu.com`;
        let targetUrl = `${host}/Download/index.html`;
        // let targetUrl = `http://127.0.0.1:5500/public/Download/index.html`;
        try {
            if (urlParams.url.includes("douyin")) {
                let videoInfo = null;
                try {
                    videoInfo = await extractVideoInfo();
                    if (videoInfo && videoInfo.d) {
                        urlParams.x = videoInfo.d;
                    }
                } catch (e) {
                    alert(`请截图联系开发者，抖音视频信息提取失败${e}`);
                    return;
                }
            } else if (urlParams.url.includes("music.youtube")) {
                // 获取url中的v参数
                const urls = new URLSearchParams(window.location.search);
                const videoId = urls.get('v');
                if (videoId) {
                    urlParams.url = `https://www.youtube.com/watch?v=${videoId}`;
                } else {
                    alert("请检查是否有播放的音乐？")
                    return;
                }
            } else if (urlParams.url.includes("tiktok")) {
                if (!localStorage.oldTiktoUser) {
                    const result = confirm("用户您好，本软件将复制视频链接，用于解析视频，请允许软件读取剪贴板。");
                    if (!result) {
                        alert("异常");
                        return;
                    }
                }
                // 有视频id的页面
                if (urlParams.url.includes("/video/")) {
                    console.log(`有视频ID，无需处理`)
                } else {
                    // 有分享按钮的页面
                    try {
                        let videos = document.getElementsByTagName("video");
                        // 如果没有2个视频，则返回（当前可能不是视频）
                        if (videos.length < 2) {
                            alert("当前页面可能不是视频页面");
                            return;
                        }
                        let tiktokNowVideo = videos[0];
                        const articleElement = tiktokNowVideo.closest('article');
                        let scBtn = articleElement.querySelector('button[aria-label^="添加到收藏"], button[aria-label*="添加到收藏"]');
                        if (!scBtn) {
                            // 如果没有收藏按钮，则返回，当前可能是直播
                            alert("当前页面可能是直播页面");
                            return
                        }
                        articleElement.querySelector('button[aria-label^="分享视频"], button[aria-label*="分享视频"]').click();
                        for (let i = 0; i < 40; i++) {
                            if (document.querySelector('[data-e2e="share-copy"]')) {
                                document.querySelector('[data-e2e="share-copy"]').click()
                                break;
                            }
                            await sleep(100);
                        }
                        const copyUrl = await readClipboardTextCompat();
                        if (copyUrl) {
                            urlParams.url = copyUrl;
                        } else {
                            new Error(`获取剪贴板内容失败`);
                        }
                    } catch (e) {
                        alert(`tiktok视频信息提取失败${e}`);
                        return;
                    }
                }
                localStorage.oldTiktoUser = '1';
            } else if (getWp()) {
                let { selectedList, encrypted } = getSelectFile();
                if (selectedList.length > 0) {
                    urlParams.x = encrypted;
                } else {
                    alert("请选择文件");
                    return;
                }
            }
        } catch (e) {
            alert(`跳转失败${e}`);
            return;
        }
        targetUrl += `?${objToUrlParams(urlParams)}`;

        const windowName = 'dajiaoniu_download_window';

        let features = '';
        if (config.downloadWindow === '1' || config.downloadWindow === 1) {
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const windowWidth = screenWidth * 0.7;  // 窗口宽度
            const windowHeight = screenHeight * 0.7; // 窗口高度
            const left = (screenWidth - windowWidth) / 2;
            const top = (screenHeight - windowHeight) / 2;
            features = `width=${windowWidth},height=${windowHeight},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`;
        }
        // 根据配置决定打开方式：命名窗口用于复用，_blank 打开新标签
        if (config.downloadWindow === '1' || config.downloadWindow === 1) {
            window.open(targetUrl, windowName, features);
        } else {
            window.open(targetUrl, '_blank');
        }
    });
    document.addEventListener('keydown', (e) => {
        const currentShortcut = getScriptConfig().shortcut;
        let matched = false;

        if (currentShortcut === 'ctrl+s') {
            if (e.ctrlKey && e.key.toLowerCase() === 's') matched = true;
        } else if (currentShortcut === 'alt+s') {
            if (e.altKey && e.key.toLowerCase() === 's') matched = true;
        }

        if (matched) {
            e.preventDefault(); // 必须阻止默认行为（避免弹出保存对话框）
            e.stopPropagation(); // 阻止事件冒泡（增强防冲突）
            jumpBtn.click(); // 手动触发点击事件
        }
    });
    let isDragging = false;
    let offsetX, offsetY;

    dragHandle.addEventListener('mousedown', function (e) {
        isDragging = true;
        const rect = container.getBoundingClientRect();
        offsetX = e.clientX - rect.left;
        offsetY = e.clientY - rect.top;
        e.stopPropagation();
        e.preventDefault();
    });

    document.addEventListener('mousemove', function (e) {
        if (!isDragging) return;
        const rightPx = window.innerWidth - e.clientX - (container.offsetWidth - offsetX);
        const bottomPx = window.innerHeight - e.clientY - (container.offsetHeight - offsetY);
        const rightPct = Math.max(0, Math.min(100, (Math.max(0, rightPx) / window.innerWidth) * 100));
        const bottomPct = Math.max(0, Math.min(100, (Math.max(0, bottomPx) / window.innerHeight) * 100));
        container.style.right = rightPct.toFixed(2) + '%';
        container.style.bottom = bottomPct.toFixed(2) + '%';
    });

    document.addEventListener('mouseup', function () {
        if (isDragging) {
            isDragging = false;

            // 保存当前位置到本地存储
            GM_setValue('buttonPosition', {
                right: container.style.right,
                bottom: container.style.bottom
            });
        }
    });

    function extractVideoInfo() {
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
    };

    const base = {
        findReact(dom, traverseUp = 0) {
            const key = Object.keys(dom).find(key => {
                return key.startsWith("__reactFiber$")
                    || key.startsWith("__reactInternalInstance$");
            });
            const domFiber = dom[key];
            if (domFiber == null) return null;

            if (domFiber._currentElement) {
                let compFiber = domFiber._currentElement._owner;
                for (let i = 0; i < traverseUp; i++) {
                    compFiber = compFiber._currentElement._owner;
                }
                return compFiber._instance;
            }

            const GetCompFiber = fiber => {
                let parentFiber = fiber.return;
                while (typeof parentFiber.type == "string") {
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
    }
    const controlswp = {
        baidu: {
            getSelectedList() {
                try {
                    return require('system-core:context/context.js').instanceForSystem.list.getSelected();
                } catch (e) {
                    return document.querySelector('.wp-s-core-pan').__vue__.selectedList;
                }
            }
        },
        ali: {
            getSelectedList() {
                try {
                    let selectedList = [];
                    let reactDom = document.querySelector(pan.dom.list);
                    let reactObj = base.findReact(reactDom, 1);
                    let props = reactObj.pendingProps;
                    if (props) {
                        let fileList = props.dataSource || [];
                        let selectedKeys = props.selectedKeys.split(',');
                        fileList.forEach((val) => {
                            if (selectedKeys.includes(val.fileId)) {
                                selectedList.push(val);
                            }
                        });
                    }
                    return selectedList;
                } catch (e) {
                    return [];
                }
            }
        },
        tianyi: {
            getSelectedList() {
                try {
                    return document.querySelector(".c-file-list").__vue__.selectedList;
                } catch (e) {
                    return [document.querySelector(".info-detail").__vue__.fileDetail];
                }
            }
        },
        xunlei: {
            getSelectedList() {
                try {
                    let doms = document.querySelectorAll('.SourceListItem__item--XxpOC');
                    let selectedList = [];
                    for (let dom of doms) {
                        let domVue = dom.__vue__;
                        if (domVue.selected.includes(domVue.info.id)) {
                            selectedList.push(domVue.info);
                        }
                    }
                    return selectedList;
                } catch (e) {
                    return [];
                }
            },
        },
        quark: {
            getSelectedList() {
                try {
                    let selectedList = [];
                    let reactDom = document.getElementsByClassName('file-list')[0];
                    let reactObj = base.findReact(reactDom);
                    let props = reactObj.props;
                    if (props) {
                        let fileList = props.list || [];
                        let selectedKeys = props.selectedRowKeys || [];
                        fileList.forEach((val) => {
                            if (selectedKeys.includes(val.fid)) {
                                selectedList.push(val);
                            }
                        });
                    }
                    return selectedList;
                } catch (e) {
                    return [];
                }
            }
        },
        yidong: {
            getSelectedList() {
                try {
                    return document.querySelector(".main_file_list").__vue__.selectList.map(val => val.item);
                } catch (e) {
                    let vueDom = document.querySelector(".home-page").__vue__;
                    let fileList = vueDom._computedWatchers.fileList.value;
                    let dirList = vueDom._computedWatchers.dirList.value;
                    let selectedFileIndex = vueDom.selectedFile;
                    let selectedDirIndex = vueDom.selectedDir;
                    let selectFileList = fileList.filter((v, i) => {
                        return selectedFileIndex.includes(i);
                    });
                    let selectDirList = dirList.filter((v, i) => {
                        return selectedDirIndex.includes(i);
                    });
                    return [...selectFileList, ...selectDirList];
                }
            },
        }
    };
    function getWp() {
        return false;
        let name = null
        if (/(pan|yun).baidu.com/.test(location.host)) {
            name = 'baidu';
        } else if (/openapi.baidu.com\/oauth/.test(location.href)) {
            name = 'baidu';
        } else if (/www.(aliyundrive|alipan).com/.test(location.host)) {
            name = 'ali';
        } else if (/cloud.189.cn/.test(location.host)) {
            name = 'tianyi';
        } else if (/pan.xunlei.com/.test(location.host)) {
            name = 'xunlei';
        } else if (/pan.quark.cn/.test(location.host)) {
            name = 'quark';
        } else if (/(yun|caiyun).139.com/.test(location.host)) {
            name = 'yidong';
        }
        return name
    }
    function getSelectFile() {
        let selectListArr = controlswp[getWp()].getSelectedList();
        const encrypted = encodeURIComponent(JSON.stringify(selectListArr.map(item => ({
            fid: item.fid,
            name: item.file_name,
        }))));
        return {
            selectedList: selectListArr,
            encrypted: encrypted,
        };
    }
    // js对象转url参数，注意有中文，兼容性好些，属性值可能是对象
    function objToUrlParams(obj) {
        return Object.keys(obj).map(key => `${key}=${isPlainObjectSimple(obj[key]) ? encodeURIComponent(JSON.stringify(obj[key])) : encodeURIComponent(obj[key])}`).join('&');
    }
    function isPlainObjectSimple(value) {
        return Object.prototype.toString.call(value) === '[object Object]';
    }
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function readClipboardTextCompat(options = {}) {
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
})();
})({}, {});