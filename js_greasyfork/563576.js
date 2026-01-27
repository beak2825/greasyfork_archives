// ==UserScript==
// @name         JAV-FORUM
// @description  默认Q键激活菜单; 支持以图识图、磁力聚合、页面磁力提取...
// @version      0.1.1
// @author       JAV-FORUM
// @namespace    JAV-FORUM
// @license      MIT
// @icon         https://cdn-icons-png.flaticon.com/512/6576/6576105.png
// @include      *://*/*
// @exclude      *://*sleazyfork.org/*
// @exclude      *://*greasyfork.org/*
// @exclude      *://*gemini.google.com/*
// @exclude      *://*googletagmanager.com/*
// @exclude      *://*ogs.google.com/*
// @exclude      *://*javdb*.com/*
// @require      https://update.greasyfork.org/scripts/515994/1478507/gh_2215_make_GM_xhr_more_parallel_again.js
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/layui-layer@1.0.9/dist/layer.min.js
// @require      https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.js
// @require      https://cdn.jsdelivr.net/npm/viewerjs@1.11.1/dist/viewer.min.js
// @connect      whatslink.info
// @connect      u9a9.com
// @connect      sukebei.nyaa.si
// @connect      btsow.lol
// @connect      btdig.com
// @connect      cld139.buzz
// @connect      api.imgur.com
// @connect      115.com
// @connect      *
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/563576/JAV-FORUM.user.js
// @updateURL https://update.greasyfork.org/scripts/563576/JAV-FORUM.meta.js
// ==/UserScript==

var __defProp = Object.defineProperty, __typeError = msg => {
    throw TypeError(msg);
}, __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
    enumerable: !0,
    configurable: !0,
    writable: !0,
    value: value
}) : obj[key] = value, __publicField = (obj, key, value) => __defNormalProp(obj, "symbol" != typeof key ? key + "" : key, value), __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg), __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), 
getter ? getter.call(obj) : member.get(obj)), __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);

!function() {
    "use strict";
    var _timers, _intervalContainer;
    class NetUtil {
        constructor() {
            throw new Error("工具类不可实例化");
        }
        static getBaseUrl(url) {
            return new URL(url).origin;
        }
        static async retry(fun, tryCount = 3) {
            let runCount = 0;
            for (;runCount < tryCount; ) try {
                const result = await fun();
                runCount > 0 && console.debug(`[重试] 成功，共发起 ${runCount + 1} 次。`);
                return result;
            } catch (e) {
                let errorString = String(e);
                errorString.startsWith("Error: ") && (errorString = errorString.replace("Error: ", ""));
                if (errorString.includes("Just a moment") || errorString.includes("重定向") || errorString.toLowerCase().includes("404 page not found") || errorString.toLowerCase().includes("沒有您要的結果") || errorString.toLowerCase().includes("状态码:4") || errorString.toLowerCase().includes("404 not found")) throw e;
                runCount++;
                if (runCount === tryCount) {
                    errorString.length > 200 ? console.debug(`[重试] 达到最大重试次数 (${tryCount})，最终失败`) : console.debug(`[重试] 达到最大重试次数 (${tryCount})，最终失败：`, e);
                    throw e;
                }
                errorString.length > 200 ? console.debug(`[重试] 准备第 ${runCount + 1} 次重试`) : console.debug(`[重试] 准备第 ${runCount + 1} 次重试, 错误信息: ${errorString}`);
            }
        }
    }
    window.cacheManager = new class {
        constructor() {
            __publicField(this, "image_recognition_site_key", "jhs_image_recognition_site");
            __publicField(this, "image_recognition_history_key", "jhs_image_recognition_history");
            __publicField(this, "image_recognition_auto_open_key", "jhs_image_recognition_auto_open");
            __publicField(this, "magnetHubSortType_key", "jhs_magnetHubSortType");
            __publicField(this, "magnetHubEngines_key", "jhs_magnetHubEngines");
            __publicField(this, "magnetHubHistory_key", "jhs_magnetHistory");
            __publicField(this, "magnetExtractorCollapsed_key", "jhs_magnetExtractorCollapsed");
            __publicField(this, "menuSetting_key", "jhs_menuSetting");
        }
        setItem(key, value) {
            try {
                GM_setValue(key, value);
            } catch (error) {
                console.error(`【缓存失败】写入键名 "${key}" 时出错:`, error);
            }
        }
        getItem(key, defaultValue = null) {
            return GM_getValue(key, defaultValue);
        }
        removeItem(key) {
            GM_deleteValue(key);
        }
    };
    window.tempCacheManager = new class {
        setItem(key, value) {
            try {
                const stringValue = "string" == typeof value ? value : JSON.stringify(value);
                sessionStorage.setItem(key, stringValue);
            } catch (error) {
                console.error("【Session写入失败】数据过大或存储受限", error);
            }
        }
        getItem(key, defaultValue = null) {
            const rawData = sessionStorage.getItem(key);
            if (null === rawData) return defaultValue;
            try {
                return JSON.parse(rawData);
            } catch (e) {
                return rawData;
            }
        }
        removeItem(key) {
            sessionStorage.removeItem(key);
        }
        removeAll() {
            sessionStorage.clear();
        }
    };
    window.gmHttp = new class {
        async get(url, headers = {}, options = {}) {
            options.headers = headers;
            return this.gmRequest("GET", url, null, options);
        }
        postJson(url, data = {}, headers = {}, options = {}) {
            let jsonData = JSON.stringify(data);
            options.headers = {
                "Content-Type": "application/json",
                ...options.headers
            };
            return this.gmRequest("POST", url, jsonData, options);
        }
        postFormData(url, formData, headers = {}, options = {
            timeout: 1e4,
            retryCount: 2
        }) {
            if (!(formData instanceof FormData)) throw new Error("参数类型错误 需为 FormData 实例");
            options.headers = headers;
            return this.gmRequest("POST", url, formData, options);
        }
        async gmRequest(method, url, data, options = {}) {
            const {headers: headers = {}, noRedirect: noRedirect = !1, timeout: timeout = null, retryCount: retryCount = null} = options, httpTimeout = timeout || 2e3, httpRetryCount = retryCount || 5;
            data || (data = void 0);
            return await NetUtil.retry((() => new Promise(((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: method,
                    url: url,
                    headers: headers,
                    timeout: httpTimeout,
                    data: data,
                    onload: response => {
                        try {
                            noRedirect && response.finalUrl !== url && reject(`请求被重定向了, URL是: ${response.finalUrl} 内容:${response.responseText}`);
                            if (response.status >= 200 && response.status < 300) if (response.responseText) try {
                                resolve(JSON.parse(response.responseText));
                            } catch (e) {
                                resolve(response.responseText);
                            } else resolve(response.responseText || response); else {
                                console.error("请求失败,状态码:", response.status, url);
                                if (response.responseText) try {
                                    const errorData = JSON.parse(response.responseText);
                                    reject(errorData);
                                } catch {
                                    let rawText = response.responseText, errorMessage = "";
                                    if (rawText.includes("<html") || rawText.includes("<!DOCTYPE")) {
                                        const titleMatch = rawText.match(/<title>(.*?)<\/title>/i);
                                        errorMessage = titleMatch && titleMatch[1] ? `HTML Error: ${titleMatch[1].trim()}` : rawText.replace(/<[^>]+>/g, " ").slice(0, 100).trim() + "...";
                                    } else errorMessage = rawText.length > 200 ? rawText.slice(0, 200) + "..." : rawText;
                                    const finalMsg = `${errorMessage} (状态码:${response.status})`;
                                    reject(new Error(finalMsg || `请求发生错误 ${response.status}`));
                                } else reject(new Error(`请求发生错误 ${response.status}`));
                            }
                        } catch (e) {
                            reject(e);
                        }
                    },
                    onerror: error => {
                        console.error("网络错误:", url);
                        reject(new Error(error.error || "网络错误"));
                    },
                    ontimeout: () => {
                        reject(new Error("请求超时: " + url));
                    }
                });
            }))), httpRetryCount);
        }
    };
    document.head.insertAdjacentHTML("beforeend", "\n<style>\n/* 弹窗主容器样式 */\n.layui-layer {\n    border-radius: 6px !important;\n    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n    border: 1px solid #ddd;\n}\n\n/* 弹窗标题栏样式 */\n.layui-layer-title {\n    background-color: #f2f2f2 !important;\n    color: #333 !important;\n    font-size: 14px;\n    font-weight: 500;\n    border-radius: 6px 6px 0 0;\n    border-bottom: 1px solid #eee;\n}\n\n/* 弹窗内容区域 */\n.layui-layer-content {\n    font-size: 14px;\n    color: #444;\n}\n\n/* 弹窗底部按钮的容器 暂不需要美化 */\n.layui-layer-btn {\n}\n\n\n/* 确定按钮 */\n.layui-layer-btn a.layui-layer-btn0 { \n    background-color: #1E9FFF;\n    color: white;\n    border: none;\n    border-radius: 3px;\n}\n.layui-layer-btn a.layui-layer-btn0:hover {\n    background-color: #0081cc;\n}\n\n/* 取消按钮 */\n.layui-layer-btn a.layui-layer-btn1 { \n    background-color: #fff;\n    color: #666;\n    border: 1px solid #ccc;\n    border-radius: 3px;\n    margin-right: 10px;\n}\n.layui-layer-btn a.layui-layer-btn1:hover {\n    background-color: #f5f5f5;\n    color: #333;\n}\n\n.jhs-multi-confirm .layui-layer-btn a.layui-layer-btn0 { \n    background-color: #fff;\n    color: #666;\n    border: 1px solid #ccc;\n    border-radius: 3px;\n    margin-right: 10px;\n}\n.jhs-multi-confirm .layui-layer-btn a.layui-layer-btn0:hover {\n    background-color: #f5f5f5;\n    color: #333;\n}\n\n/* 第三个 */\n.layui-layer-btn a.layui-layer-btn2 { \n    background-color: #fff;\n    color: #666;\n    border: 1px solid #ccc;\n    border-radius: 3px;\n    margin-right: 10px;\n}\n.layui-layer-btn a.layui-layer-btn2:hover {\n    background-color: #f5f5f5;\n    color: #333;\n}\n\n.layui-layer-load {\n    background: url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 80'%3E%3Cstyle%3Erect%7Banimation:m 1.8s ease-in-out infinite%7D@keyframes m%7B0%25,100%25%7Btransform:translateX(20px)%7D50%25%7Btransform:translateX(-20px)%7D%3C/style%3E%3Crect x='40' y='14' width='40' height='12' rx='6' fill='%23ff758c'/%3E%3Crect x='30' y='34' width='60' height='12' rx='6' fill='%234facfe' style='animation-delay:-0.45s'/%3E%3Crect x='42' y='54' width='35' height='12' rx='6' fill='%23ff9a9e' style='animation-delay:-0.9s'/%3E%3C/svg%3E\") no-repeat center !important;\n    background-size: 120px auto !important;\n}\n</style>\n");
    const layerEscManager = {
        layerIndexStack: [],
        initialized: !1,
        init() {
            if (this.initialized) return;
            $(document).on("keydown.layerEsc", (e => this.handleKey(e)));
            this.initialized = !0;
        },
        handleKey(e) {
            if ("Escape" !== e.key && 27 !== e.keyCode) return;
            if (window.viewerManager && window.viewerManager.isShowing()) {
                window.viewerManager.close();
                return;
            }
            if (0 === this.layerIndexStack.length) return;
            if (this.layerIndexStack.length > 0) {
                const topLayerIndex2 = this.layerIndexStack[this.layerIndexStack.length - 1];
                try {
                    const $iframe = $(`#layui-layer-iframe${topLayerIndex2}`);
                    let hasNestedLayer = !1;
                    if ($iframe.length > 0) {
                        const iframeDoc = $iframe[0].contentDocument || $iframe[0].contentWindow.document;
                        hasNestedLayer = $(iframeDoc).find(".layui-layer").length > 0;
                    } else {
                        hasNestedLayer = $(`#layui-layer${topLayerIndex2}`).find(".layui-layer").length > 0;
                    }
                    if (hasNestedLayer) return;
                } catch (err) {
                    console.warn("[EscManager] 无法探测子窗口 (跨域限制)");
                }
            }
            const topLayerIndex = this.layerIndexStack.pop();
            layer.close(topLayerIndex);
        },
        push(layerIndex) {
            var _a;
            this.init();
            -1 === this.layerIndexStack.indexOf(layerIndex) && this.layerIndexStack.push(layerIndex);
            try {
                const $iframe = $(`#layui-layer-iframe${layerIndex}`), eventNamespace = "keydown.layerEscProxy", iframeDocument = null == (_a = $iframe[0]) ? void 0 : _a.contentDocument;
                iframeDocument && $(iframeDocument).off(eventNamespace).on(eventNamespace, (e => this.handleKey(e)));
            } catch (e) {
                console.error("[EscManager] Iframe 内部监听绑定失败 (可能是跨域):", e);
            }
        }
    }, originalLayerOpen = layer.open;
    layer.open = function(options) {
        if (!(options = options || {}).offset && 4 !== options.type && options.area) {
            const area = options.area, w = (Array.isArray(area) ? area[0] : area) || "50%", calculateOffset = (val, defaultPos) => val && "auto" !== val ? -1 !== val.indexOf("%") ? (100 - parseInt(val)) / 2 + "%" : -1 !== val.indexOf("px") ? `calc(50% - ${parseInt(val) / 2}px)` : defaultPos : defaultPos, top = calculateOffset((Array.isArray(area) ? area[1] : "") || "auto", "15%"), left = calculateOffset(w, "50%");
            options.offset = [ top, left ];
            options.fixed = !0;
        }
        const originalSuccess = options.success;
        options.success = function(layero, index) {
            "function" == typeof originalSuccess && originalSuccess.call(this, layero, index);
            layerEscManager.push(index);
            window.clog && window.clog.handleFrameClogZIndex();
        };
        return originalLayerOpen.call(this, options);
    };
    const originalLayerClose = layer.close;
    layer.close = function(index) {
        "function" == typeof originalLayerClose && originalLayerClose.call(this, index);
        setTimeout((() => {
            const openLayerCount = document.querySelectorAll(".layui-layer-shade").length;
            document.documentElement.style.overflow = openLayerCount > 0 ? "hidden" : "";
        }), 10);
    };
    const _DomUtil = class {
        constructor() {
            throw new Error("工具类不可实例化");
        }
        static importResource(url) {
            let tag;
            if (url.indexOf("css") >= 0) {
                tag = document.createElement("link");
                tag.setAttribute("rel", "stylesheet");
                tag.href = url;
            } else {
                tag = document.createElement("script");
                tag.setAttribute("type", "text/javascript");
                tag.src = url;
            }
            document.documentElement.appendChild(tag);
        }
        static htmlTo$dom(html, filterAvatarBox = !0) {
            const parser = new DOMParser;
            return $(parser.parseFromString(html, "text/html"));
        }
        static xmlTo$dom(xmlString) {
            const parser = new DOMParser, xmlDoc = parser.parseFromString(xmlString, "application/xml"), parseError = xmlDoc.getElementsByTagName("parsererror");
            if (parseError.length > 0) {
                console.error("XML Parse Error:", parseError[0].textContent);
                return $(parser.parseFromString(xmlString, "text/html"));
            }
            return $(xmlDoc);
        }
    };
    __publicField(_DomUtil, "insertStyle", ((css, id) => {
        if (!css) return;
        if (id && $(`#${id}`).length > 0) {
            console.warn(`[insertStyle] 插入失败：ID 为 "${id}" 的样式表已存在。`);
            return;
        }
        const finalCss = `<style${id ? ` id="${id}"` : ""}>${css.replace(/<\/?style>/gi, "")}</style>`;
        $("head").append(finalCss);
    }));
    __publicField(_DomUtil, "debounce", ((func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout((() => func.apply(_DomUtil, args)), delay);
        };
    }));
    let DomUtil = _DomUtil;
    const btnCss = `\n<style>\n    jhs-btn {\n        min-width: 80px;\n        display: inline-flex;\n        align-items: center;\n        justify-content: center;\n        padding: 7px 15px;\n        margin-right: 5px;\n        border-radius: 7px;\n        text-decoration: none;\n        font-weight: bold;\n        font-size: 12px;\n        transition: all 0.1s ease-in;\n        cursor: pointer;\n        white-space: nowrap;\n        box-sizing: border-box;\n        color: white; /* 默认字体颜色 */\n        box-shadow: 0 2px 3px rgba(0, 0, 0, 0.15);\n    }\n\n    jhs-btn:hover {\n        transform: translateY(-1px);\n        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);\n    }\n    \n    /* --- 内部 a 标签处理 --- */\n    jhs-btn a,\n    jhs-btn a:visited{\n        text-decoration: none; \n        color: inherit !important; \n    }\n    jhs-btn a:hover {\n        color: white;\n    }\n    \n    /* --- 动态生成的配色 --- */\n    ${Object.entries({
        aliceBlue: {
            background: "#f0f9ff",
            color: "#0369a1"
        },
        blue: {
            background: "#409EFF"
        },
        royalBlue: {
            background: "#2563eb"
        },
        denimBlue: {
            background: "#1d4ed8"
        },
        indigo: {
            background: "#3F51B5"
        },
        yellow: {
            background: "#E6A23C"
        },
        orange: {
            background: "#FF9800"
        },
        red: {
            background: "#d22020"
        },
        teal: {
            background: "#009688"
        },
        green: {
            background: "#67C23A"
        },
        brown: {
            background: "#795548"
        },
        white: {
            background: "#fff",
            color: "#424242"
        },
        whitesmoke: {
            background: "#F5F5F5",
            color: "#424242"
        },
        black: {
            background: "#212121"
        },
        pink: {
            background: "#E91E63"
        }
    }).map((([type, props]) => `\n    jhs-btn[type="${type}"] {\n        ${Object.entries(props).map((([key, value]) => `${key}: ${value};`)).join("\n\t\t")}\n    }`)).join("\n")}\n\n    /* --- 按钮尺寸 --- */\n    jhs-btn[size="mini"] {\n        padding: 5px 10px;\n        font-size: 10px;\n    }\n    \n    jhs-btn[size="small"] {\n        padding: 7px 10px;\n        font-size: 11px;\n    }\n    \n    jhs-btn[size="large"] {\n        padding: 10px 20px;\n        font-size: 14px;\n    }\n    \n</style>\n`;
    DomUtil.insertStyle(btnCss);
    !function() {
        const colors_infoStart = "#60A5FA", colors_infoEnd = "#93C5FD", colors_successStart = "#10B981", colors_successEnd = "#6EE7B7", colors_errorStart = "#EF4444", colors_errorEnd = "#FCA5A5", commonStyles = {
            borderRadius: "12px",
            color: "white",
            padding: "10px 16px",
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            minWidth: "150px",
            textAlign: "center",
            fontSize: "15px",
            zIndex: 99999999999
        }, typeStyles = {
            info: {
                ...commonStyles,
                background: `linear-gradient(to right, ${colors_infoStart}, ${colors_infoEnd})`
            },
            success: {
                ...commonStyles,
                background: `linear-gradient(to right, ${colors_successStart}, ${colors_successEnd})`
            },
            error: {
                ...commonStyles,
                background: `linear-gradient(to right, ${colors_errorStart}, ${colors_errorEnd})`
            }
        }, createToastInterface = (configOverrides = {}) => {
            const runShow = (type, ...msgParts) => {
                let msg = msgParts.map((part => {
                    if (part instanceof Error) return part.message;
                    if ("object" == typeof part && null !== part) try {
                        return JSON.stringify(part);
                    } catch (e) {}
                    return String(part);
                })).join(" ");
                msg.length > 500 && (msg = msg.substring(0, 500) + "... (内容超长已省略)");
                return ((msg, type, finalOptions) => {
                    "center" === finalOptions.gravity && (finalOptions.offset = {
                        y: "calc(50vh - 150px)"
                    });
                    let callback = finalOptions.callback || finalOptions.onClose || finalOptions.end;
                    const defaultConfig = {
                        text: msg,
                        escapeMarkup: !1,
                        duration: "error" === type ? 2500 : 2e3,
                        close: !1,
                        gravity: "bottom",
                        position: "right",
                        style: typeStyles[type],
                        stopOnFocus: !0,
                        oldestFirst: !1,
                        callback: callback,
                        ...finalOptions
                    };
                    -1 === defaultConfig.duration && (defaultConfig.close = !0);
                    const toast = Toastify(defaultConfig);
                    toast.showToast();
                    toast.closeShow = () => {
                        toast.toastElement.remove();
                    };
                    return toast;
                })(msg, type, configOverrides);
            };
            return {
                ok: (...msg) => runShow("success", ...msg),
                error: (...msg) => runShow("error", ...msg),
                info: (...msg) => runShow("info", ...msg)
            };
        }, BaseShow = createToastInterface({});
        BaseShow.config = options => createToastInterface(options);
        window.show = BaseShow;
    }();
    !function() {
        document.head.insertAdjacentHTML("beforeend", '\n        <style>\n            /* * loading-container-fixed: 用于 body，确保始终在视口中心\n             * loading-container-absolute: 用于特定元素，确保覆盖该元素\n             */\n            .loading-container-base {\n                top: 0;\n                left: 0;\n                width: 100%;\n                height: 100%;\n                display: flex;\n                flex-direction: column;\n                justify-content: center;\n                align-items: center;\n                background-color: rgba(0, 0, 0, 0.1);\n                z-index: 99999999;\n                box-sizing: border-box; \n                /* 确保内容不会溢出，如果需要更复杂的布局，可能需要调整 */\n                overflow: hidden; \n            }\n\n            .loading-container-absolute {\n                position: absolute; /* 相对于父元素定位 */\n            }\n            \n            .loading-container-fixed {\n                position: fixed; /* 相对于视口定位 */\n            }\n            \n            .loading-animation {\n                position: relative;\n                width: 60px;\n                height: 12px;\n                background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);\n                border-radius: 6px;\n                animation: loading-animate 1.8s ease-in-out infinite;\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n                margin-bottom: 30px; /* 增加底部间距以容纳自定义内容 */\n            }\n    \n            .loading-animation:before,\n            .loading-animation:after {\n                position: absolute;\n                display: block;\n                content: "";\n                animation: loading-animate 1.8s ease-in-out infinite;\n                height: 12px;\n                border-radius: 6px;\n                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n            }\n    \n            .loading-animation:before {\n                top: -20px;\n                left: 10px;\n                width: 40px;\n                background: linear-gradient(90deg, #ff758c 0%, #ff7eb3 100%);\n            }\n    \n            .loading-animation:after {\n                bottom: -20px;\n                width: 35px;\n                background: linear-gradient(90deg, #ff9a9e 0%, #fad0c4 100%);\n            }\n            \n            @keyframes loading-animate {\n                0% {\n                    transform: translateX(40px);\n                }\n                50% {\n                    transform: translateX(-30px);\n                }\n                100% {\n                    transform: translateX(40px);\n                }\n            }\n\n            /* 新增：自定义内容样式 */\n            .loading-custom-content {\n                color: #333; /* 默认颜色 */\n                padding: 10px 20px;\n                background-color: rgba(255, 255, 255, 0.9);\n                border-radius: 5px;\n                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);\n                max-width: 80%;\n                text-align: center;\n            }\n        </style>\n    ');
        window.loading = function(targetElement, options = {}) {
            let parentElement, isBody = !1;
            if ("string" == typeof targetElement && targetElement) parentElement = document.querySelector(targetElement); else if (targetElement instanceof HTMLElement) parentElement = targetElement; else if (targetElement && "object" == typeof targetElement && !targetElement.nodeType) {
                options = targetElement;
                parentElement = document.body;
            } else parentElement = document.body;
            "object" == typeof options && null !== options || (options = {});
            if (!parentElement) {
                console.error("Loading 目标元素未找到！");
                return null;
            }
            isBody = parentElement === document.body;
            const container = document.createElement("div");
            container.classList.add("loading-container-base");
            if (isBody) container.classList.add("loading-container-fixed"); else {
                container.classList.add("loading-container-absolute");
                "static" === window.getComputedStyle(parentElement).position && (parentElement.style.position = "relative");
            }
            const animation = document.createElement("div");
            animation.className = "loading-animation";
            const {contentHTML: contentHTML} = options;
            let contentElement = null;
            if (contentHTML) {
                contentElement = document.createElement("div");
                contentElement.className = "loading-custom-content";
                contentElement.innerHTML = contentHTML;
            }
            container.appendChild(animation);
            contentElement && container.appendChild(contentElement);
            parentElement.appendChild(container);
            return {
                close: () => {
                    container && container.parentNode && container.parentNode.removeChild(container);
                }
            };
        };
        window.isLoading = () => $(".loading-container-base").length > 0;
    }();
    class ViewerManager {
        constructor() {
            this.viewerInstance = null;
            this.$container = null;
        }
        _initStyles() {
            if (document.getElementById("viewer-manager-style")) return;
            const style = document.createElement("style");
            style.id = "viewer-manager-style";
            style.innerHTML = "\n            /* 1. 强制显示滚动条并增加容器布局 */\n            .viewer-canvas { \n                overflow: auto !important; \n                scrollbar-gutter: stable; /* 防止滚动条出现时画面闪烁 */\n            }\n    \n            /* 2. 定义滚动条整体宽度 */\n            .viewer-canvas::-webkit-scrollbar {\n                width: 18px !important;  /* 纵向滚动条宽度 */\n                height: 12px !important; /* 横向滚动条高度 */\n                display: block !important;\n            }\n    \n            /* 3. 滚动条轨道 (背景) */\n            .viewer-canvas::-webkit-scrollbar-track {\n                background: rgba(0, 0, 0, 0.1) !important;\n                border-radius: 10px;\n            }\n    \n            /* 4. 滚动条滑块 (滑块本身) */\n            .viewer-canvas::-webkit-scrollbar-thumb {\n                background: rgba(255, 255, 255, 0.3) !important; /* 半透明白色 */\n                border-radius: 10px;\n                border: 2px solid rgba(0, 0, 0, 0.2); /* 给滑块加个边框 */\n            }\n    \n            /* 5. 滑块悬停效果 */\n            .viewer-canvas::-webkit-scrollbar-thumb:hover {\n                background: rgba(255, 255, 255, 0.5) !important;\n                border: 1px solid rgba(255, 255, 255, 0.8);\n            }\n        \n            .viewer-canvas { overflow: auto !important; }\n            .viewer-close { background: rgba(255,0,0,0.6) !important; }\n            .viewer-close:hover { background: rgba(255,0,0,0.8) !important; }\n            #global-viewer-container { display: none; }\n            \n            /* 单图模式 UI 隐藏逻辑 */\n            .viewer-is-single .viewer-navbar,\n            .viewer-is-single .viewer-prev,\n            .viewer-is-single .viewer-next {\n                display: none !important;\n            }\n        ";
            document.head.appendChild(style);
        }
        _initContainer() {
            this.$container = $("#global-viewer-container");
            0 === this.$container.length && (this.$container = $('<div id="global-viewer-container"></div>').appendTo("body"));
        }
        _createInstance() {
            if (this.viewerInstance) return;
            this._initStyles();
            this._initContainer();
            this._boundWheelHandler = this._handleWheel.bind(this);
            const options = {
                zIndex: 999999990,
                navbar: !0,
                zoomOnWheel: !1,
                zoomRatio: .1,
                toggleOnDblclick: !1,
                transition: !0,
                toolbar: {
                    zoomIn: 1,
                    zoomOut: 1,
                    oneToOne: 1,
                    prev: 1,
                    next: 1
                },
                render: function(e) {
                    const $scrollBtn = $(e.currentTarget).find(".viewer-scrollDown");
                    $scrollBtn.html("↓");
                    $scrollBtn.attr("title", "向下滚动");
                },
                title: !1,
                keyboard: !1,
                show: () => {},
                shown: () => {
                    this._toggleScroll(!0);
                    document.addEventListener("keydown", this._handleKeydown.bind(this));
                    this.viewerInstance.canvas.addEventListener("wheel", this._boundWheelHandler, {
                        passive: !1
                    });
                },
                view() {},
                viewed: () => {
                    const instance = this.viewerInstance, imgSrc = instance.image.src;
                    if (this.currentConfig.initZoom) {
                        const targetRatio = imgSrc.includes("javfree") ? 1 : 1.4;
                        instance.zoomTo(targetRatio);
                    }
                    if (this.currentConfig.toTop) {
                        const left = (instance.viewerData.width - instance.imageData.width) / 2;
                        instance.moveTo(left, 0);
                    }
                },
                zoom: () => {},
                zoomed: () => {},
                move: () => {},
                moved: () => {},
                hide: () => {
                    document.activeElement && document.activeElement.blur();
                    document.body.focus();
                },
                hidden: () => {
                    this._toggleScroll(!1);
                    document.removeEventListener("keydown", this._handleKeydown.bind(this));
                    this.viewerInstance && this.viewerInstance.canvas && this.viewerInstance.canvas.removeEventListener("wheel", this._boundWheelHandler);
                    this._smartToggleBodyScroll();
                }
            };
            this.viewerInstance = new Viewer(this.$container[0], options);
        }
        _handleWheel(e) {
            if (!e.ctrlKey) return;
            e.preventDefault();
            const now = Date.now();
            if (this._lastZoomTime && now - this._lastZoomTime < 50) return;
            this._lastZoomTime = now;
            const ratio = e.deltaY < 0 ? .1 : -.1;
            requestAnimationFrame((() => {
                this.viewerInstance.zoom(ratio, !0, {
                    x: e.pageX,
                    y: e.pageY
                });
            }));
        }
        _toggleScroll(lock) {
            const action = lock ? "hidden" : "";
            document.documentElement.style.overflow = action;
            document.body.style.overflow = action;
        }
        _smartToggleBodyScroll(waitTime = 10) {
            setTimeout((() => {
                const hasShade = document.querySelectorAll(".layui-layer-shade").length > 0;
                document.documentElement.style.overflow = hasShade ? "hidden" : "";
            }), waitTime);
        }
        _handleKeydown(e) {
            if ("Escape" === e.key || " " === e.key) {
                e.preventDefault();
                this.close();
            }
        }
        showImageViewer(urls, config = {}) {
            if (!Array.isArray(urls)) {
                console.error("[ViewerLog] ❌ urls 必须是数组");
                return;
            }
            this.currentConfig = Object.assign({
                startIndex: 0,
                toTop: !0,
                initZoom: !0
            }, config);
            this._createInstance();
            const imgHtml = urls.map((url => `<img src="${url}" referrerPolicy="no-referrer" alt="">`)).join("");
            this.$container.html(imgHtml);
            this.viewerInstance.update();
            const isSingle = urls.length <= 1;
            this.viewerInstance.viewer.classList.toggle("viewer-is-single", isSingle);
            this.viewerInstance.view(this.currentConfig.startIndex);
            this.viewerInstance.show();
        }
        close() {
            this.viewerInstance && this.viewerInstance.hide();
        }
        isShowing() {
            return !(!this.viewerInstance || !this.viewerInstance.isShown);
        }
    }
    !async function() {
        window.viewerManager = new ViewerManager;
    }();
    class PluginManager {
        constructor() {
            this.plugins = new Map;
        }
        register(pluginClass) {
            if ("function" != typeof pluginClass) throw new Error("插件必须是一个类");
            const instance = new pluginClass;
            instance.pluginManager = this;
            if (!instance.getRegisterCondition()) return;
            const lowerName = instance.getName().toLowerCase();
            if (this.plugins.has(lowerName)) throw new Error(`插件"${name}"已注册`);
            this.plugins.set(lowerName, instance);
        }
        getBean(name2) {
            return this.plugins.get(name2.toLowerCase());
        }
        async processCss() {
            const failedCssLoads = (await Promise.allSettled(Array.from(this.plugins).map((async ([name2, instance]) => {
                try {
                    if ("function" == typeof instance.initCss) {
                        const css = await instance.initCss();
                        css && DomUtil.insertStyle(css, name2);
                        return {
                            name: name2,
                            status: "fulfilled"
                        };
                    }
                    return {
                        name: name2,
                        status: "skipped"
                    };
                } catch (e) {
                    console.error(`插件 ${name2} 加载 CSS 失败`, e);
                    return {
                        name: name2,
                        status: "rejected",
                        error: e
                    };
                }
            })))).filter((r => "rejected" === r.status));
            failedCssLoads.length && console.error("以下插件的 CSS 加载失败：", failedCssLoads.map((p => p.value.name)));
        }
        async processPlugins() {
            await Promise.all(Array.from(this.plugins).map((async ([name2, instance]) => {
                try {
                    "function" == typeof instance.handle && await instance.handle();
                } catch (e) {
                    console.error(`插件 ${name2} 执行失败`, e);
                }
            })));
        }
    }
    class BasePlugin {
        constructor() {
            __publicField(this, "pluginManager", null);
        }
        getName() {
            throw new Error(`${this.constructor.name} 未显示getName()`);
        }
        getBean(name2) {
            let bean = this.pluginManager.getBean(name2);
            if (!bean) {
                let msg = "容器中不存在: " + name2;
                show.error(msg);
                throw new Error(msg);
            }
            return bean;
        }
        getRegisterCondition() {
            throw new Error(`${this.constructor.name} 未返回注册条件getRegisterCondition()`);
        }
        async initCss() {
            return "";
        }
        async handle() {}
    }
    class DateUtil {
        constructor() {
            throw new Error("工具类不可实例化");
        }
        static formatDate(date, dateSplitStr = "-", timeSplitStr = ":") {
            let targetDate;
            if (date instanceof Date) targetDate = date; else {
                if ("string" != typeof date) throw new Error("Invalid date input: must be Date object or date string");
                targetDate = new Date(date);
                if (isNaN(targetDate.getTime())) throw new Error("Invalid date string");
            }
            const year = targetDate.getFullYear(), month = String(targetDate.getMonth() + 1).padStart(2, "0"), day = String(targetDate.getDate()).padStart(2, "0"), hours = String(targetDate.getHours()).padStart(2, "0"), minutes = String(targetDate.getMinutes()).padStart(2, "0"), seconds = String(targetDate.getSeconds()).padStart(2, "0");
            return `${[ year, month, day ].join(dateSplitStr)} ${[ hours, minutes, seconds ].join(timeSplitStr)}`;
        }
        static toTimestamp(input = new Date, isSecond = !1) {
            let date;
            if (input instanceof Date) date = input; else {
                if ("string" != typeof input) throw new Error("参数类型错误：仅支持 Date 对象或日期字符串");
                date = new Date(input);
            }
            const timestamp = date.getTime();
            if (isNaN(timestamp)) throw new Error(`无效的日期格式: ${input}`);
            return isSecond ? Math.floor(timestamp / 1e3) : timestamp;
        }
    }
    _timers = new WeakMap;
    __privateAdd(DateUtil, _timers, new Map);
    __publicField(DateUtil, "SECOND", 1e3);
    __publicField(DateUtil, "MINUTE", 6e4);
    __publicField(DateUtil, "HOUR", 36e5);
    __publicField(DateUtil, "DAY", 864e5);
    __publicField(DateUtil, "WEEK", 6048e5);
    __publicField(DateUtil, "MONTH", 2592e6);
    const _CommonUtil = class _CommonUtil {
        constructor() {
            throw new Error("工具类不可实例化");
        }
        static loopDetector(condition, after, detectInterval = 20, timeout = 1e4, runWhenTimeout = !1) {
            const uuid = Math.random(), start = (new Date).getTime(), stopAndRun = shouldRun => {
                clearInterval(__privateGet(_CommonUtil, _intervalContainer)[uuid]);
                shouldRun && after && after();
                delete __privateGet(_CommonUtil, _intervalContainer)[uuid];
            };
            __privateGet(_CommonUtil, _intervalContainer)[uuid] = setInterval((() => {
                const timeElapsed = (new Date).getTime() - start;
                condition() ? stopAndRun(!0) : timeElapsed >= timeout && stopAndRun(runWhenTimeout);
            }), detectInterval);
        }
        static copyToClipboard(text, thenFun, errorFun) {
            navigator.clipboard.writeText(text).then((() => {
                thenFun && thenFun();
            })).catch((err => {
                show.error("复制失败: ", err);
                errorFun && errorFun();
            }));
        }
        static isNull(value) {
            return null == value || ("string" == typeof value ? "" === value.trim() : Array.isArray(value) ? 0 === value.length : "object" == typeof value && 0 === Object.keys(value).length);
        }
        static isNotNull(value) {
            return !this.isNull(value);
        }
        static q(event, msg, fun, cancelFun, shade, area) {
            let offset;
            event && (offset = [ event.clientY - 120, event.clientX - 120 ]);
            shade || (shade = 0);
            let confirmIndex = layer.confirm(msg, {
                offset: offset,
                title: "提示",
                btn: [ "确定", "取消" ],
                shade: shade,
                area: area,
                zIndex: 9999999999999
            }, (function() {
                fun && fun();
                layer.close(confirmIndex);
            }), (function() {
                cancelFun && cancelFun();
            }));
            return confirmIndex;
        }
        static getResponsiveArea(defaultArea = [ "85%", "90%" ]) {
            return window.innerWidth >= 1200 ? defaultArea : [ "90%", "90%" ];
        }
    };
    _intervalContainer = new WeakMap;
    __privateAdd(_CommonUtil, _intervalContainer, {});
    let CommonUtil = _CommonUtil;
    class MagnetHubPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "fileEmoji", "📄");
            __publicField(this, "folderEmoji", "📁");
            __publicField(this, "maxHistoryCount", 20);
            __publicField(this, "currentSort", "");
            __publicField(this, "currentSearchTicket", 0);
            __publicField(this, "highlightKeywords", [ "-c", "破解", "流出", "-AI", "无码", "4k", "8k", "-uc", "-u" ]);
            __publicField(this, "engineConfig", [ {
                engineId: "cldcld",
                label: "磁力帝",
                targetPage: "https://www.cld139.buzz/search-{keyword}-0-0-1.html",
                url: "https://www.cld139.buzz/search-{keyword}-0-0-1.html",
                handler: (url, keyword) => this.parseCld(url, keyword)
            }, {
                engineId: "btdig",
                label: "BTDIG",
                targetPage: "https://btdig.com/search?q={keyword}",
                url: "https://btdig.com/search?q={keyword}",
                handler: (url, keyword) => this.parseBtdig(url, keyword)
            }, {
                engineId: "u9a9",
                label: "U9A9",
                targetPage: "https://u9a9.com/?type=2&search={keyword}",
                url: "https://u9a9.com/?type=2&search={keyword}",
                handler: (url, keyword) => this.commonParse(url, keyword),
                parseDetailPage: async detailUrl => {
                    const html = await gmHttp.get(detailUrl), $nodes = DomUtil.htmlTo$dom(html).find("#torrent-description p");
                    let fileListHtml = "", fileCount = 0;
                    for (let i = 0; i < $nodes.length; i++) {
                        const text = $($nodes[i]).text().trim();
                        if (text) {
                            fileListHtml += `<div class="file-item" title="${text}">${this.fileEmoji} ${text} </div>`;
                            fileCount++;
                        }
                    }
                    return {
                        fileListHtml: fileListHtml,
                        fileCount: fileCount
                    };
                }
            }, {
                engineId: "sukebei",
                label: "Sukebei",
                targetPage: "https://sukebei.nyaa.si/?f=0&c=0_0&q={keyword}",
                url: "https://sukebei.nyaa.si/?f=0&c=0_0&q={keyword}",
                handler: (url, keyword) => this.commonParse(url, keyword),
                parseDetailPage: async detailUrl => {
                    const html = await gmHttp.get(detailUrl), $liNodes = DomUtil.htmlTo$dom(html).find(".torrent-file-list.panel-body").find("li");
                    let fileListHtml = "", fileCount = 0;
                    for (let i = 0; i < $liNodes.length; i++) {
                        const $li = $($liNodes[i]), $folderLink = $li.children("a.folder"), paddingLeft = 12 * ($li.parents("ul").length - 1);
                        if ($folderLink.length > 0) {
                            const folderName = $folderLink.text().trim();
                            fileListHtml += `<div class="file-item file-item-folder" style="padding-left: ${paddingLeft}px;">${this.folderEmoji} ${folderName}</div>`;
                        } else {
                            let text = $li.contents().filter((function() {
                                return 3 === this.nodeType;
                            })).text().trim();
                            text || (text = $li.text().trim());
                            if (!text) continue;
                            fileListHtml += `<div class="file-item" style="padding-left: ${paddingLeft}px;" title="${text}">${this.fileEmoji} ${text}</div>`;
                            fileCount++;
                        }
                    }
                    return {
                        fileListHtml: fileListHtml,
                        fileCount: fileCount
                    };
                }
            }, {
                engineId: "btsow",
                label: "BTSOW",
                targetPage: "https://btsow.lol/search/{keyword}",
                url: "https://btsow.lol/bts/data/api/search",
                handler: (url, keyword) => this.parseBTSOW(url, keyword),
                parseDetailPage: async detailUrl => {
                    const hashMatch = detailUrl.match(/detail\/([A-F0-9]{40})/i), hashId = hashMatch ? hashMatch[1] : "";
                    if (!hashId) throw new Error("无法从URL解析Hash ID");
                    const res = await gmHttp.postJson("https://btsow.lol/bts/data/api/magnet", [ hashId ]);
                    if (!res || 200 !== res.code || !res.data) throw new Error(`API 请求失败: ${res ? res.code : "无响应"}`);
                    const files = res.data.files || [];
                    if (0 === files.length) throw new Error("该资源暂无文件明细");
                    let fileListHtml = "";
                    files.forEach((file => {
                        fileListHtml += `<div class="file-item">${this.fileEmoji} ${file.filename}</div>`;
                    }));
                    return {
                        fileListHtml: fileListHtml,
                        fileCount: files.length
                    };
                }
            } ]);
        }
        getName() {
            return "MagnetHubPlugin";
        }
        getRegisterCondition() {
            return !0;
        }
        async initCss() {
            return '\n            <style>\n                .magnet-container {\n                    margin: 0 auto;\n                    padding: 10px 20px;\n                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;\n                    width: 100%;             \n                    box-sizing: border-box;\n                }\n    \n                .magnet-engine-selector {\n                    display: flex;\n                    justify-content: space-between;\n                    align-items: center;\n                    background: #f8fafc;\n                    padding: 10px 15px;\n                    border-radius: 8px;\n                    margin-bottom: 15px;\n                    border: 1px solid #e2e8f0;\n                }\n                \n                .engine-group {\n                    display: flex;\n                    flex-wrap: wrap;\n                    gap: 15px;\n                    flex: 1;\n                }\n                \n                .engine-actions {\n                    display: flex;\n                    align-items: center;\n                    gap: 15px;\n                    padding-left: 20px;\n                }\n                \n                .magnet-results {\n                    min-height: 150px;\n                }\n                .magnet-result {\n                    background: #fff;\n                    border-radius: 10px;\n                    padding: 16px;\n                    margin-bottom: 12px;\n                    border: 1px solid #e2e8f0;\n                    transition: transform 0.2s, box-shadow 0.2s;\n                    display: flex;\n                    justify-content: space-between;\n                    flex-direction: column; \n                    border-left-color: #2563eb;\n                }\n                .magnet-result:hover {\n                    box-shadow: 0 4px 12px rgba(0,0,0,0.08);\n                }\n                \n                .magnet-info {\n                    display: flex; \n                    justify-content: space-between; \n                    align-items: flex-start;\n                    flex-wrap: wrap;\n                }\n    \n                .magnet-content {\n                    flex: 1;\n                    min-width: 0;\n                }\n                .magnet-title {\n                    font-size: 14px;\n                    font-weight: 500;\n                    color: #334155;\n                    margin-bottom: 6px;\n                    text-decoration: none !important;\n                    overflow: hidden;\n                    text-overflow: ellipsis;\n                    line-height: 1.4;\n                    word-wrap: break-word; \n                    overflow-wrap: break-word;\n                    white-space: normal;\n                }\n                .magnet-title:hover {\n                    color: #2563eb;\n                    text-decoration: underline !important;\n                }\n                .magnet-meta {\n                    display: flex;\n                    gap: 12px;\n                    font-size: 12px;\n                    color: #94a3b8;\n                    font-weight: 400;\n                    margin-top: 10px;\n                    flex-wrap: wrap;\n                }\n                .magnet-meta a:hover {\n                    text-decoration: underline !important;\n                    opacity: 0.8;\n                }\n\n    \n                .magnet-actions {\n                    display: flex;\n                    gap: 2px;\n                    flex-shrink: 0;\n                }\n                \n                .magnet-loading {\n                    display: flex;\n                    flex-direction: column;\n                    align-items: center;\n                    justify-content: center;\n                    padding: 40px 0;\n                    color: #94a3b8;\n                    font-size: 14px;\n                }\n\n                .magnet-error {\n                    text-align: center;\n                    padding: 20px;\n                    color: #ef4444;\n                    background: #fef2f2;\n                    border-radius: 8px;\n                    font-size: 13px;\n                    margin: 10px 0;\n                }\n    \n                .magnet-tools {\n                    display: flex;\n                    gap: 15px;\n                    padding: 0 5px 10px;\n                    font-size: 12px;\n                    color: #64748b;\n                    align-items: center;\n                }\n                .sort-item {\n                    cursor: pointer;\n                    transition: color 0.2s;\n                }\n                .sort-item.active {\n                    color: #2563eb;\n                    font-weight: bold;\n                }\n                .sort-item:hover {\n                    color: #2563eb;\n                }\n\n                .magnet-search-bar {\n                    display: flex;\n                    gap: 8px;\n                    margin-bottom: 15px;\n                    padding: 0 5px;\n                }\n                .magnet-input {\n                    flex: 1;\n                    padding: 8px 12px;\n                    border: 1px solid #e2e8f0;\n                    border-radius: 6px;\n                    font-size: 13px;\n                    outline: none;\n                    transition: border-color 0.2s;\n                }\n                .magnet-input:focus {\n                    border-color: #2563eb;\n                    box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);\n                }\n                .search-submit-btn {\n                    background-color: #2563eb;\n                    color: white;\n                    border: none;\n                    padding: 0 16px;\n                    border-radius: 6px;\n                    cursor: pointer;\n                    font-size: 13px;\n                    font-weight: 500;\n                }\n                .search-submit-btn:hover {\n                    background-color: #1d4ed8;\n                }\n\n                .engine-checkbox-wrapper {\n                    font-size: 13px;\n                    cursor: pointer;\n                    display: flex;\n                    align-items: center;\n                    gap: 6px;\n                    color: #475569;\n                    user-select: none;\n                    transition: all 0.3s;\n                    padding: 2px 6px;\n                    border-radius: 4px;\n                    border: 1px solid transparent;\n                }\n                .engine-loading {\n                    color: #2563eb !important;\n                    background: #eff6ff;\n                    border-color: #bfdbfe;\n                    animation: magnet-pulse 1.5s infinite;\n                }\n                .engine-success {\n                    color: #16a34a !important;\n                    background: #f0fdf4;\n                }\n                .engine-error {\n                    color: #dc2626 !important;\n                    background: #fef2f2;\n                }\n                @keyframes magnet-pulse {\n                    0% { opacity: 1; }\n                    50% { opacity: 0.5; }\n                    100% { opacity: 1; }\n                }\n                \n                .file-list-container {\n                    background: #f8fafc; border-radius: 6px; padding: 10px; margin-top: 12px; \n                    max-height: 300px; overflow-y: auto; border: 1px solid #e2e8f0; width: 100%; box-sizing: border-box;\n                }\n                .file-list-container::-webkit-scrollbar {\n                    width: 4px;\n                }\n                .file-list-container::-webkit-scrollbar-thumb {\n                    background: #e2e8f0;\n                    border-radius: 10px;\n                }\n                .file-list-container::-webkit-scrollbar-track {\n                    background: transparent;\n                }\n                .file-item {\n                    font-size: 12px; \n                    color: #475569; \n                    overflow: hidden; \n                    text-overflow: ellipsis; \n                    white-space: nowrap;\n                    padding: 2px 0;\n                }\n                .file-item-folder {\n                    font-weight: bold; \n                    color: #1e293b;\n                }\n                \n                .magnet-history-list {\n                    display: flex;\n                    flex-wrap: wrap;\n                    gap: 8px;\n                    margin: 0 5px 12px;\n                    align-items: center;\n                }\n                .history-item {\n                    display: inline-flex;\n                    align-items: center;\n                    background: #f1f5f9;\n                    color: #475569;\n                    padding: 1px 8px;\n                    border-radius: 4px;\n                    font-size: 11px;\n                    cursor: pointer;\n                    transition: all 0.2s;\n                }\n                .history-del-btn {\n                    margin-left: 5px;\n                    padding: 0 2px;\n                    color: #94a3b8;\n                    font-weight: bold;\n                    font-size: 12px;\n                    cursor: pointer;\n                }\n                .history-del-btn:hover {\n                    color: #ef4444;\n                }\n                .history-item:hover {\n                    background: #e2e8f0;\n                    color: #2563eb;\n                    border-color: #bfdbfe;\n                }\n                .clear-history {\n                    color: #94a3b8;\n                    font-size: 11px;\n                    cursor: pointer;\n                    align-self: center;\n                    margin-left:auto;\n                    user-select:none;\n                }\n                .clear-history:hover {\n                    color: #ef4444;\n                }\n                \n                @media (max-width: 1000px) {\n                    .magnet-info {\n                        flex-direction: column; /* 纵向排列，使子元素各自占据一行 */\n                        align-items: stretch;   /* 让子元素拉伸占满宽度 */\n                    }\n                \n                    .magnet-content {\n                        width: 100%;\n                        min-width: 100%;       /* 覆盖之前的 300px 设置 */\n                        margin-bottom: 12px;   /* 与下方的按钮组保持间距 */\n                    }\n                \n                    .magnet-actions {\n                        justify-content: flex-start; /* 按钮靠左对齐 */\n                        flex-wrap: wrap;             /* 如果按钮还是太多，允许按钮内部换行 */\n                        gap: 8px;                    /* 加大按钮间距方便点击 */\n                    }\n                }\n            </style>\n        ';
        }
        async handle() {}
        openMagnetHubDialog(carNum) {
            layer.open({
                type: 1,
                title: "磁力搜索",
                content: '<div id="magnetHubBox"></div>',
                area: CommonUtil.getResponsiveArea([ "70%", "95%" ]),
                shadeClose: !0,
                scrollbar: !1,
                anim: -1,
                success: () => {
                    this.createMagnetHub($("#magnetHubBox"), carNum).then();
                }
            });
        }
        async createMagnetHub($hubContainer, keyword) {
            if (!$hubContainer) throw new Error("未传入容器");
            let currentKeyword = (keyword || "").trim().replace("FC2-", "");
            this.currentSort = cacheManager.getItem(cacheManager.magnetHubSortType_key, this.currentSort);
            const savedEngines = cacheManager.getItem(cacheManager.magnetHubEngines_key, [ this.engineConfig[0].engineId ]), tabsHtml = this.engineConfig.map((engine => `\n            <label class="engine-checkbox-wrapper" data-engine-id="${engine.engineId}">\n                <input type="checkbox" class="engine-checkbox" value="${engine.engineId}" ${savedEngines.includes(engine.engineId) ? "checked" : ""}>\n                <span class="engine-label-text" data-url="${engine.targetPage || ""}" data-tip="右键点击，可前往原站">${engine.label}</span>\n            </label>\n        `)).join(""), $container = $(`\n            <div class="magnet-container">\n                <div class="magnet-search-bar">\n                    <input type="text" class="magnet-input" placeholder="输入番号或关键词..." value="${currentKeyword}">\n                    <button class="search-submit-btn">搜索</button>\n                </div>\n                \n                <div id="specialHint" style="display:none;"></div>\n                \n                <div class="magnet-history-list" id="magnetHistory"></div>\n                \n                <div class="magnet-engine-selector">\n                    <div class="engine-group">${tabsHtml}</div>\n                    <div class="engine-actions">\n                        <span class="select-all" style="cursor:pointer; color:#2563eb; font-size:12px;">全选</span>\n                    </div>\n                </div>\n                <div class="magnet-tools">\n                    <span>排序方式：</span>\n                    <span class="sort-item ${"" === this.currentSort ? "active" : ""}" data-sort="">默认</span>\n                    <span class="sort-item ${"date" === this.currentSort ? "active" : ""}" data-sort="date">日期最新</span>\n                    <span class="sort-item ${"size" === this.currentSort ? "active" : ""}" data-sort="size">文件最大</span>\n                    <div style="margin-left: auto; text-align: right;">\n                        <span id="resultCount" style="color: #94a3b8; font-weight: 500;"></span>\n                        <span id="dedupTip" style="display: none; font-size: 11px; background: #f1f5f9; padding: 2px 6px; border-radius: 4px; margin-left: 5px;"></span>\n                    </div>\n                </div>\n                <div class="magnet-results"></div>\n            </div>\n        `);
            $hubContainer.append($container);
            this.bindMagnetEvents($container);
        }
        bindMagnetEvents($container) {
            const $resultsContainer = $container.find(".magnet-results"), $searchInput = $container.find(".magnet-input"), $historyBox = $container.find("#magnetHistory"), renderHistory = () => {
                const history = cacheManager.getItem(cacheManager.magnetHubHistory_key, []);
                if (!history.length) {
                    $historyBox.hide();
                    return;
                }
                const tagsHtml = history.map((h => `\n                <span class="history-item" data-val="${h}">\n                    ${h}\n                    <i class="history-del-btn" title="删除">×</i>\n                </span>\n            `)).join("");
                $historyBox.html('<span style="font-size: 11px; color: #94a3b8; margin-right: 4px; user-select:none;">搜索历史:</span>' + tagsHtml + '<span class="clear-history">[清空]</span>').show();
            }, saveToHistory = kw => {
                if (!kw || kw.length < 2) return;
                let history = cacheManager.getItem(cacheManager.magnetHubHistory_key, []);
                history = [ kw, ...history.filter((i => i !== kw)) ].slice(0, this.maxHistoryCount);
                cacheManager.setItem(cacheManager.magnetHubHistory_key, history);
                renderHistory();
            }, performSearch = () => {
                const newKeyword = $searchInput.val().trim();
                (kw => {
                    const $hintContainer = $container.find("#specialHint");
                    $hintContainer.empty();
                    const matchedRule = [ {
                        pattern: /^MIUM-/i,
                        replace: "300MIUM-"
                    }, {
                        pattern: /^LUXU-/i,
                        replace: "259LUXU-"
                    }, {
                        pattern: /^GANA-/i,
                        replace: "200GANA-"
                    } ].find((r => r.pattern.test(kw)));
                    if (matchedRule) {
                        const specialNum = kw.replace(matchedRule.pattern, matchedRule.replace), $tip = $(`\n                    <div style="margin: -8px 5px 10px; font-size: 12px; color: #b45309; background: #fffbeb; padding: 6px 12px; border-radius: 6px; border: 1px solid #fde68a; display: inline-block;">\n                        <span>💡 猜你想搜：</span>\n                        <strong class="try-special-num" \n                                style="cursor: pointer; text-decoration: underline; color: #2563eb; transition: color 0.2s;"\n                                onmouseover="this.style.color='#1d4ed8'" \n                                onmouseout="this.style.color='#2563eb'">\n                            ${specialNum}\n                        </strong>\n                    </div>\n                `);
                        $tip.find(".try-special-num").on("click", (() => {
                            $searchInput.val(specialNum);
                            performSearch();
                        }));
                        $hintContainer.append($tip).show();
                    } else $hintContainer.hide();
                })(newKeyword);
                if (newKeyword) {
                    saveToHistory(newKeyword);
                    this.searchAllSelected($container, newKeyword);
                } else $resultsContainer.html('<div class="magnet-loading">请输入关键词进行搜索</div>');
            };
            $container.on("click", ".history-item", (e => {
                const $target = $(e.currentTarget);
                $searchInput.val($target.data("val"));
                performSearch();
            }));
            $container.on("click", ".history-del-btn", (e => {
                e.stopPropagation();
                const valToRemove = $(e.currentTarget).parent().data("val");
                let history = cacheManager.getItem(cacheManager.magnetHubHistory_key, []);
                history = history.filter((item => item !== valToRemove));
                cacheManager.setItem(cacheManager.magnetHubHistory_key, history);
                renderHistory();
            }));
            $container.on("click", ".clear-history", (() => {
                cacheManager.setItem(cacheManager.magnetHubHistory_key, []);
                renderHistory();
            }));
            $container.find(".search-submit-btn").on("click", performSearch);
            $searchInput.on("keypress", (e => {
                13 === e.which && performSearch();
            }));
            $container.on("click", ".sort-item", (e => {
                const $target = $(e.target);
                this.currentSort = $target.data("sort");
                cacheManager.setItem(cacheManager.magnetHubSortType_key, this.currentSort);
                $container.find(".sort-item").removeClass("active");
                $target.addClass("active");
                performSearch();
            }));
            $container.on("change", ".engine-checkbox", (() => {
                performSearch();
            }));
            $container.on("click", ".select-all", (() => {
                const allChecked = 0 === $container.find(".engine-checkbox:not(:checked)").length;
                $container.find(".engine-checkbox").prop("checked", !allChecked);
                performSearch();
            }));
            $container.off("click.copy").on("click.copy", ".magnet-copy-btn", (function(e) {
                e.preventDefault();
                const $btn = $(this), magnet = $btn.data("magnet");
                CommonUtil.copyToClipboard(magnet, (() => {
                    const originalText = $btn.text();
                    $btn.text("已复制");
                    setTimeout((() => {
                        $btn.text(originalText);
                    }), 1e3);
                }));
            }));
            $container.off("click.preview").on("click.preview", ".magnet-preview-btn", (async e => {
                e.preventDefault();
                const magnet = $(e.currentTarget).data("magnet"), cacheKey = "whatslink_" + magnet, cacheData = tempCacheManager.getItem(cacheKey, []);
                if (CommonUtil.isNotNull(cacheData)) {
                    window.viewerManager.showImageViewer(cacheData, {
                        toTop: !1,
                        initZoom: !1
                    });
                    return;
                }
                const loadObj = loading();
                try {
                    const url = `https://whatslink.info/api/v1/link?url=${magnet}`, res = await gmHttp.get(url);
                    if (!res || !Array.isArray(res.screenshots) || 0 === res.screenshots.length) {
                        show.error("该磁力链接暂无预览图");
                        return;
                    }
                    const imgList = [];
                    for (let item of res.screenshots) item && item.screenshot && imgList.push(item.screenshot);
                    if (CommonUtil.isNull(imgList)) {
                        show.error("未发现有效的预览图片地址");
                        return;
                    }
                    tempCacheManager.setItem(cacheKey, imgList);
                    window.viewerManager.showImageViewer(imgList, {
                        toTop: !1,
                        initZoom: !1
                    });
                } catch (e2) {
                    clog.errorAndShow(e2);
                } finally {
                    loadObj.close();
                }
            }));
            $container.on("contextmenu", ".engine-label-text", (e => {
                let targetUrl = $(e.currentTarget).attr("data-url");
                if (!targetUrl) return;
                e.preventDefault();
                const currentKw = $searchInput.val().trim();
                targetUrl = currentKw ? targetUrl.replace("{keyword}", encodeURIComponent(currentKw)) : targetUrl.replace("{keyword}", "");
                window.open(targetUrl, "_blank");
            }));
            renderHistory();
            performSearch();
        }
        async searchAllSelected($container, keyword) {
            const ticket = ++this.currentSearchTicket, selectedIds = [];
            $container.find(".engine-checkbox:checked").each(((i, el) => selectedIds.push($(el).val())));
            cacheManager.setItem(cacheManager.magnetHubEngines_key, selectedIds);
            $container.find(".engine-checkbox-wrapper").removeClass("engine-loading engine-success engine-error");
            const $resultsContainer = $container.find(".magnet-results");
            if (0 === selectedIds.length) {
                $resultsContainer.html('\n                <div style=" display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 40px 20px; background: #fff5f5; border: 1px dashed #feb2b2; border-radius: 12px; margin-top: 10px; ">\n                    <svg style="width: 48px; height: 48px; color: #f56565; margin-bottom: 12px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">\n                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>\n                    </svg>\n                    <div style="color: #c53030; font-size: 15px; font-weight: 500;">未选择搜索引擎</div>\n                    <div style="color: #f56565; font-size: 13px; margin-top: 4px;">请在上方勾选至少一个引擎以开始搜索</div>\n                </div>\n            ');
                return;
            }
            $resultsContainer.html('<div class="magnet-loading">正在聚合搜索中...</div>');
            let allResults = [], duplicateCount = 0;
            const searchPromises = selectedIds.map((async engineId => {
                const engine = this.engineConfig.find((e => e.engineId === engineId)), $engineWrapper = $container.find(`.engine-checkbox-wrapper[data-engine-id="${engineId}"]`);
                $engineWrapper.addClass("engine-loading");
                try {
                    let isFromFetch = !1;
                    const cacheKey = `${engine.engineId}_${keyword}`;
                    this.cacheKey = cacheKey;
                    let results = tempCacheManager.getItem(cacheKey, []);
                    if (CommonUtil.isNull(results)) {
                        const url = engine.url.replace("{keyword}", encodeURIComponent(keyword));
                        results = await engine.handler(url, keyword);
                        isFromFetch = !0;
                    }
                    if (ticket !== this.currentSearchTicket) return;
                    results.forEach((item => {
                        item.source = engine.label;
                        item.engineId = engine.engineId;
                        const hash = this._getMagnetHash(item.magnet), existingIndex = allResults.findIndex((existing => this._getMagnetHash(existing.magnet) === hash));
                        if (-1 === existingIndex) allResults.push(item); else {
                            duplicateCount++;
                            const existingItem = allResults[existingIndex], currentHasFileList = item.fileListHtml && item.fileListHtml.length > 0, existingHasFileList = existingItem.fileListHtml && existingItem.fileListHtml.length > 0, currentFileCount = item.fileCount || 0, existingFileCount = existingItem.fileCount || 0;
                            (currentHasFileList && !existingHasFileList || currentFileCount > existingFileCount) && (allResults[existingIndex] = item);
                        }
                    }));
                    isFromFetch && CommonUtil.isNotNull(results) && tempCacheManager.setItem(cacheKey, results);
                    $engineWrapper.removeClass("engine-loading").addClass("engine-success");
                    this.displayResults($resultsContainer, allResults, duplicateCount);
                } catch (e) {
                    console.error(`${engine.label} 搜索失败:`, e);
                    const errorMessage = e.message || "未知错误（可能是跨域或网络问题）";
                    $engineWrapper.removeClass("engine-loading").addClass("engine-error").attr("title", `错误详情: ${errorMessage}`);
                }
            }));
            await Promise.all(searchPromises);
            0 === allResults.length && ticket === this.currentSearchTicket && $resultsContainer.html('<div class="magnet-loading">未发现资源</div>');
        }
        _getMagnetHash(magnet) {
            if (!magnet) return "";
            const match = magnet.match(/xt=urn:btih:([a-fA-F0-9]{40}|[a-zA-Z2-7]{32})/i);
            return match ? match[1].toLowerCase() : magnet.toLowerCase();
        }
        displayResults($container, results, duplicateCount) {
            $container.empty();
            if (!results || 0 === results.length) {
                $container.append('<div class="magnet-loading" style="color:#c8a374;">未发现相关磁力资源</div>');
                return;
            }
            $("#resultCount").text(`共 ${results.length} 条`);
            const $dedupTip = $("#dedupTip");
            duplicateCount > 0 ? $dedupTip.text(`过滤重复: ${duplicateCount} 条`).show() : $dedupTip.hide();
            let sortedResults = [ ...results ];
            "date" === this.currentSort ? sortedResults.sort(((a, b) => {
                const timeA = this._parseRelativeDate(a.date);
                return this._parseRelativeDate(b.date) - timeA;
            })) : "size" === this.currentSort && sortedResults.sort(((a, b) => b.sizeByte - a.sizeByte));
            sortedResults.forEach((item => {
                let canFetch = !1, engineCfg = null;
                if (!item.fileListHtml) {
                    engineCfg = this.engineConfig.find((e => e.engineId === item.engineId));
                    engineCfg && "function" == typeof engineCfg.parseDetailPage && (canFetch = !0);
                }
                let highlightedTitle = item.title;
                this.highlightKeywords.forEach((word => {
                    const reg = new RegExp(`(${word})`, "gi");
                    highlightedTitle = highlightedTitle.replace(reg, '<span style="color: #ef4444; font-weight: bold; background: #fee2e2; padding: 0 2px; border-radius: 2px;">$1</span>');
                }));
                const $result = $(`\n                <div class="magnet-result">\n                    <div class="magnet-info">\n                        <div class="magnet-content">\n                            <a class="magnet-title" href="${item.detailPageUrl}" target="_blank" title="${item.title}">\n                                ${highlightedTitle}\n                            </a>\n                            <div class="magnet-meta">\n                                <span style="color: #007bff; font-weight: bold;">[ ${item.source} ]</span>\n                                <span style="margin: 0 4px;">|</span>\n                                <span>📦 ${item.size || "未知"}</span>\n                                <span style="margin: 0 4px;">|</span>\n                                <span>📅 ${item.date || "未知"}</span>\n                                <span class="file-count-wrapper">\n                                    ${item.fileCount ? `\n                                        <span style="margin: 0 4px;">|</span>\n                                        <span class="file-count-label">${this.fileEmoji} 文件数 ${item.fileCount}</span>\n                                    ` : ""}\n                                </span>\n                            </div>\n                        </div>\n            \n                        <div class="magnet-actions">\n                            <jhs-btn type="aliceBlue" class="magnet-preview-btn" data-magnet="${item.magnet}">预览</jhs-btn>\n                            <jhs-btn type="white" class="magnet-copy-btn" data-magnet="${item.magnet}">复制</jhs-btn>\n                            <jhs-btn type="royalBlue" class="magnet-btn-download"><a href="${item.magnet}">立即下载</a></jhs-btn>\n                            <jhs-btn type="denimBlue" class="magnet-115-btn magnet-down-115" data-magnet="${item.magnet}">115离线</jhs-btn>\n                        </div>\n                    </div>\n\n                    <div class="file-list-area" style="margin-top: 10px;">\n                        ${item.fileListHtml ? `<div class="file-list-container">${item.fileListHtml}</div>` : canFetch ? '<div class="fetch-placeholder"></div>' : ""}\n                    </div>\n                </div>\n            `);
                canFetch && this.renderLoadBtn($result.find(".fetch-placeholder"), item, engineCfg);
                $container.append($result);
            }));
        }
        renderLoadBtn($placeholder, item, engineCfg, isRetry = !1) {
            const $btnWrapper = $(`\n            <div class="fetch-action-container" style="padding: 12px; border: 1px dashed ${isRetry ? "#f87171" : "#e2e8f0"}; border-radius: 8px; background: ${isRetry ? "#fef2f2" : "#f8fafc"}; transition: all 0.3s;">\n                <jhs-btn type="white" class="load-files-btn" style="font-size: 12px; cursor: pointer; display: inline-flex; align-items: center; gap: 4px;">\n                    ${isRetry ? "<span>❌ 加载失败，点击重试</span>" : "<span>🔍 查看文件列表</span>"}\n                </jhs-btn>\n            </div>\n        `);
            $btnWrapper.find(".load-files-btn").on("click", (async e => {
                $(e.currentTarget).prop("disabled", !0).html("<span>⏳ 正在努力加载中...</span>");
                $btnWrapper.css("border-color", "#cbd5e1");
                try {
                    const detailData = await engineCfg.parseDetailPage(item.detailPageUrl);
                    if (detailData.fileListHtml) {
                        Object.assign(item, detailData);
                        let cachedResults = tempCacheManager.getItem(this.cacheKey, []);
                        if (cachedResults && cachedResults.length > 0) {
                            const targetIdx = cachedResults.findIndex((r => r.magnet === item.magnet));
                            if (-1 !== targetIdx) {
                                Object.assign(cachedResults[targetIdx], detailData);
                                tempCacheManager.setItem(this.cacheKey, cachedResults);
                            }
                        }
                        $placeholder.html(`<div class="file-list-container" style="animation: fadeIn 0.3s;">${item.fileListHtml}</div>`);
                    } else $placeholder.html('<div style="font-size: 12px; color: #94a3b8; text-align: center; padding: 10px;">暂无文件列表</div>');
                    if (detailData.fileCount) {
                        const $wrapper = $placeholder.closest(".magnet-result").find(".file-count-wrapper"), $label = $wrapper.find(".file-count-label");
                        $label.length > 0 ? $label.html(`${this.fileEmoji} 文件数 ${item.fileCount}`) : $wrapper.html(`<span style="margin: 0 4px;">|</span> <span class="file-count-label">${this.fileEmoji} 文件数 ${item.fileCount}</span> `);
                        $wrapper.find(".file-count-label").css("color", "#10b981").fadeOut(400).fadeIn(800, (function() {
                            setTimeout((() => {
                                $(this).css({
                                    color: "",
                                    transition: "color 0.5s"
                                });
                            }), 1e3);
                        }));
                    }
                } catch (err) {
                    console.error(`[${engineCfg.label}] 详情解析异常:`, err);
                    this.renderLoadBtn($placeholder, item, engineCfg, !0);
                }
            }));
            $placeholder.empty().append($btnWrapper);
        }
        async commonParse(url, keyword) {
            const baseUrl = NetUtil.getBaseUrl(url), html = await gmHttp.get(url), $dom = DomUtil.htmlTo$dom(html), results = [];
            $dom.find(".torrent-list tbody tr").each(((i, el) => {
                const $el = $(el);
                if ($el.text().includes("置顶")) return;
                const $a = $el.find("td:nth-child(2) a"), relativeUrl = $a.attr("href"), detailPageUrl = relativeUrl ? new URL(relativeUrl, baseUrl).href : "", title = $a.attr("title") || $a.text().trim();
                if (!title.toLowerCase().includes(keyword.toLowerCase())) return;
                const magnet = $el.find("td:nth-child(3) a[href^='magnet:']").attr("href"), size = $el.find("td:nth-child(4)").text().trim(), date = $el.find("td:nth-child(5)").text().trim();
                magnet && results.push({
                    detailPageUrl: detailPageUrl,
                    title: title,
                    magnet: magnet,
                    size: size,
                    date: date,
                    sizeByte: this._quickParseSize(size)
                });
            }));
            return results;
        }
        async parseBTSOW(url, keyword) {
            const data = [ {
                search: keyword
            }, 50, 1 ], dataList = (await gmHttp.postJson(url, data)).data, baseUrl = NetUtil.getBaseUrl(url), results = [];
            for (let i = 0; i < dataList.length; i++) {
                let item = dataList[i];
                const size = (item.size / 1073741824).toFixed(2) + " GB", detailPageUrl = `${baseUrl}/magnet/detail/${item.hash}`, title = item.name.replace(/<[^>]*>?/gm, "");
                title.toLowerCase().includes(keyword.toLowerCase()) && results.push({
                    detailPageUrl: detailPageUrl,
                    title: title,
                    magnet: "magnet:?xt=urn:btih:" + item.hash,
                    size: size,
                    sizeByte: this._quickParseSize(size),
                    date: DateUtil.formatDate(new Date(1e3 * item.lastUpdateTime))
                });
            }
            return results;
        }
        async parseBtdig(url, keyword) {
            const html = await gmHttp.get(url), $dom = DomUtil.htmlTo$dom(html), results = [];
            $dom.find(".one_result").each(((i, el) => {
                const $el = $(el), $link = $el.find(".torrent_name a"), detailPageUrl = $link.attr("href"), title = $link.text().trim();
                if (!title.toLowerCase().includes(keyword.toLowerCase())) return;
                const magnet = $el.find(".fa-magnet a[href^='magnet:']").attr("href"), size = $el.find(".torrent_size").text().trim(), fileCount = $el.find(".torrent_files").text().trim();
                const dateChinese = $el.find(".torrent_age").text().trim().replace(/found\s+/g, "").replace(/years?/g, "年").replace(/months?/g, "个月").replace(/weeks?/g, "周").replace(/days?/g, "天").replace(/hours?/g, "小时").replace(/minutes?/g, "分钟").replace(/ago/g, "前").replace(/\s+/g, ""), $fileNodes = $el.find(".torrent_excerpt div[class*='fa-']"), fileItems = [];
                let minPadding = 999;
                $fileNodes.each(((_, div) => {
                    const $div = $(div), text = $div.text().trim();
                    if (!text) return;
                    const paddingMatch = ($div.attr("style") || "").match(/padding-left:\s*([\d.]+)em/), emValue = paddingMatch ? parseFloat(paddingMatch[1]) : 0;
                    emValue < minPadding && (minPadding = emValue);
                    const isFolder = $div.hasClass("fa-folder-open") || $div.hasClass("fa-folder"), $nextSpan = $div.next("span"), sizeText = $nextSpan.length ? $nextSpan.text().trim() : "", fullText = sizeText ? `${text} (${sizeText})` : text;
                    fileItems.push({
                        text: fullText,
                        isFolder: isFolder,
                        em: emValue
                    });
                }));
                const fileListHtml = fileItems.map((item => {
                    const finalPadding = Math.max(0, 12 * (item.em - minPadding));
                    return `<div class="file-item ${item.isFolder ? "file-item-folder" : ""}" style="padding-left: ${finalPadding}px;" title="${item.text}">\n                            ${item.isFolder ? this.folderEmoji : this.fileEmoji} ${item.text}\n                        </div>`;
                })).join("");
                magnet && results.push({
                    detailPageUrl: detailPageUrl,
                    title: title,
                    magnet: magnet,
                    size: size,
                    date: dateChinese,
                    fileCount: fileCount,
                    fileListHtml: fileListHtml || '<div class="file-item">暂无文件列表</div>',
                    sizeByte: this._quickParseSize ? this._quickParseSize(size) : 0
                });
            }));
            return results;
        }
        async parseCld(url, keyword) {
            const html = await gmHttp.get(url), $dom = DomUtil.htmlTo$dom(html), results = [], baseUrl = NetUtil.getBaseUrl(url);
            $dom.find(".ssbox").each(((i, el) => {
                const $el = $(el), $link = $el.find(".title h3 a"), detailPageUrl = `${baseUrl}${$link.attr("href")}`, title = $link.text().trim();
                if (!title.toLowerCase().includes(keyword.toLowerCase())) return;
                const magnet = $el.find(".sbar a[href^='magnet:']").attr("href"), date = $el.find(".sbar span:contains('添加时间') b").text().trim(), size = $el.find(".sbar span:contains('大小') b").text().trim(), fileCount = $el.find(".slist ul li").length, fileList = $el.find(".slist ul li").map(((_, li) => $(li).text().trim())).get(), fileListHtml = fileList.length > 0 ? fileList.map((name2 => `<div class="file-item">${this.fileEmoji} ${name2}</div>`)).join("") : '<div class="file-item">暂无文件列表</div>';
                magnet && results.push({
                    detailPageUrl: detailPageUrl,
                    title: title,
                    magnet: magnet,
                    size: size,
                    date: date,
                    fileListHtml: fileListHtml,
                    fileCount: fileCount,
                    sizeByte: this._quickParseSize(size)
                });
            }));
            return results;
        }
        _parseRelativeDate(dateStr) {
            if (!dateStr) return 0;
            try {
                return DateUtil.toTimestamp(dateStr);
            } catch (e) {}
            const match = dateStr.match(/^(\d+)(年|个月|周|天|小时|分钟)前$/);
            if (match) {
                const value = parseInt(match[1]), unit = match[2], now = Date.now();
                switch (unit) {
                  case "分钟":
                    return now - value * DateUtil.MINUTE;

                  case "小时":
                    return now - value * DateUtil.HOUR;

                  case "天":
                    return now - value * DateUtil.DAY;

                  case "周":
                    return now - value * DateUtil.WEEK;

                  case "个月":
                    return now - value * DateUtil.MONTH;

                  case "年":
                    return now - 365 * value * DateUtil.DAY;

                  default:
                    return now;
                }
            }
            return 0;
        }
        _quickParseSize(str) {
            const num = parseFloat(str) || 0, strUpper = str.toUpperCase();
            return strUpper.includes("G") ? 1024 * num * 1024 * 1024 : strUpper.includes("M") ? 1024 * num * 1024 : strUpper.includes("K") ? 1024 * num : num;
        }
    }
    const _HotkeyManager = class {
        constructor() {
            throw new Error("工具类不可实例化");
        }
        static registerHotkey(hotkeyString, callback, keyupCallback = null) {
            if (Array.isArray(hotkeyString)) {
                let id_list = [];
                hotkeyString.forEach((hotkey => {
                    if (!this.isHotkeyFormat(hotkey)) throw new Error("快捷键格式错误");
                    let id = this.recordHotkey(hotkey, callback, keyupCallback);
                    id_list.push(id);
                }));
                return id_list;
            }
            if (!this.isHotkeyFormat(hotkeyString)) throw new Error("快捷键格式错误");
            return this.recordHotkey(hotkeyString, callback, keyupCallback);
        }
        static recordHotkey(hotkeyString, callback, keyupCallback) {
            let id = Math.random().toString(36).substr(2);
            this.registerHotKeyMap.set(id, {
                hotkeyString: hotkeyString,
                callback: callback,
                keyupCallback: keyupCallback
            });
            return id;
        }
        static unregisterHotkey(id) {
            this.registerHotKeyMap.has(id) && this.registerHotKeyMap.delete(id);
        }
        static isHotkeyFormat(hotkeyString) {
            return hotkeyString.toLowerCase().split("+").map((k => k.trim())).every((k => [ "ctrl", "shift", "alt" ].includes(k) || 1 === k.length));
        }
        static judgeHotkey(hotkeyString, event) {
            const keyList = hotkeyString.toLowerCase().split("+").map((k => k.trim())), mods_ctrl = keyList.includes("ctrl"), mods_shift = keyList.includes("shift"), mods_alt = keyList.includes("alt"), mainKey = (keyList.includes("meta") || keyList.includes("command"), 
            keyList.find((k => ![ "ctrl", "shift", "alt", "meta", "command" ].includes(k))));
            if (!mainKey) {
                const keyName = event.key.toLowerCase();
                return !(!keyList.includes("alt") || "alt" !== keyName) || (!(!keyList.includes("ctrl") || "control" !== keyName) || !(!keyList.includes("shift") || "shift" !== keyName));
            }
            const ctrlMatch = (this.isMac ? event.metaKey : event.ctrlKey) === mods_ctrl, shiftMatch = event.shiftKey === mods_shift, altMatch = event.altKey === mods_alt, keyMatch = event.key.toLowerCase() === mainKey.toLowerCase();
            return ctrlMatch && shiftMatch && altMatch && keyMatch;
        }
    };
    __publicField(_HotkeyManager, "isMac", 0 === navigator.platform.indexOf("Mac"));
    __publicField(_HotkeyManager, "registerHotKeyMap", new Map);
    __publicField(_HotkeyManager, "handleKeydown", (event => {
        if (!(event instanceof KeyboardEvent)) return;
        const activeElement = document.activeElement;
        if (!("INPUT" === activeElement.tagName || "TEXTAREA" === activeElement.tagName || activeElement.isContentEditable)) for (const [id, data] of _HotkeyManager.registerHotKeyMap) {
            let hotkeyString = data.hotkeyString, callback = data.callback;
            _HotkeyManager.judgeHotkey(hotkeyString, event) && callback(event);
        }
    }));
    __publicField(_HotkeyManager, "handleKeyup", (event => {
        for (const [id, data] of _HotkeyManager.registerHotKeyMap) {
            let hotkeyString = data.hotkeyString, keyupCallback = data.keyupCallback;
            keyupCallback && (_HotkeyManager.judgeHotkey(hotkeyString, event) && keyupCallback(event));
        }
    }));
    let HotkeyManager = _HotkeyManager;
    document.addEventListener("keydown", (event => {
        HotkeyManager.handleKeydown(event);
    }));
    document.addEventListener("keyup", (event => {
        HotkeyManager.handleKeyup(event);
    }));
    class MenuPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "settings", {
                triggerHotkey: "Q",
                blacklist: []
            });
            __publicField(this, "mousePos", {
                x: 0,
                y: 0
            });
            __publicField(this, "$menu", null);
            __publicField(this, "$currentTarget", null);
            __publicField(this, "menuConfig", [ {
                id: "imageSearch",
                index: 1,
                label: "🖼️ 以图识图",
                handler: async () => {
                    var _a;
                    const src = null == (_a = this.$currentTarget) ? void 0 : _a.attr("src");
                    this.getBean("ImageRecognitionPlugin").openRecognition(src);
                }
            }, {
                id: "magnetSearch",
                index: 2,
                label: "🧲 磁力聚合",
                handler: async () => {
                    const selectedText = window.getSelection().toString().trim();
                    this.getBean("MagnetHubPlugin").openMagnetHubDialog(selectedText);
                }
            }, {
                id: "magnetExtractor",
                index: 3,
                label: "🔍 提取本页磁力",
                handler: async () => {
                    this.getBean("MagnetExtractorPlugin").startExtractor();
                }
            } ]);
        }
        getName() {
            return "MenuPlugin";
        }
        getRegisterCondition() {
            return !0;
        }
        async handle() {
            await this.loadSettings();
            this.registerGMMenu();
            this.refreshHotkey();
            this.render();
            this.bindEvents();
        }
        async loadSettings() {
            const saved = cacheManager.getItem(cacheManager.menuSetting_key);
            saved && (this.settings = {
                ...this.settings,
                ...saved
            });
        }
        refreshHotkey() {
            this.hotkeyId && HotkeyManager.unregisterHotkey(this.hotkeyId);
            this.hotkeyId = HotkeyManager.registerHotkey(this.settings.triggerHotkey, (event => {
                if (this.$menu && this.$menu.is(":visible")) {
                    const elementAtMouse = document.elementFromPoint(this.mousePos.x, this.mousePos.y), $hoveredItem = $(elementAtMouse).closest(".plugin-alt-menu li");
                    if ($hoveredItem.length > 0) {
                        $hoveredItem.click();
                        return;
                    }
                    this.hideMenu();
                } else {
                    event.preventDefault();
                    this.hideMenu();
                    this.showMenu();
                }
            }));
        }
        registerGMMenu() {
            var _a;
            this.gmMenuIds && this.gmMenuIds.forEach((id => GM_unregisterMenuCommand(id)));
            this.gmMenuIds = [];
            const host = window.location.host, toggleLabel = (this.settings.blacklist || []).includes(host) ? "❌ 已禁用 (点击启用)" : "✅ 已启用 (点击禁用)";
            this.gmMenuIds.push(GM_registerMenuCommand(toggleLabel, (() => {
                this.toggleSite(host);
            })));
            this.gmMenuIds.push(GM_registerMenuCommand(`管理禁用列表 (${(null == (_a = this.settings.blacklist) ? void 0 : _a.length) || 0})`, (() => {
                this.openBlacklistManager();
            })));
            this.gmMenuIds.push(GM_registerMenuCommand(`设置触发快捷键 (${this.settings.triggerHotkey})`, (() => {
                this.openHotkeySetter();
            })));
        }
        toggleSite(host) {
            if (this.settings.blacklist.includes(host)) {
                this.settings.blacklist = this.settings.blacklist.filter((h => h !== host));
                show.ok("已启用，刷新页面后生效");
            } else {
                this.settings.blacklist.push(host);
                show.error("已禁用，刷新页面后生效");
            }
            cacheManager.setItem(cacheManager.menuSetting_key, this.settings);
            window.location.reload();
        }
        openBlacklistManager() {
            const list = this.settings.blacklist || [], content = `\n        <div class="blacklist-container" style="padding:15px; max-height:300px; overflow-y:auto;">\n            ${list.length > 0 ? list.map((site => `\n            <div class="blacklist-item" style="display:flex; justify-content:space-between; align-items:center; padding:10px; border-bottom:1px solid #eee;">\n                <span style="font-size:14px; color:#333;">${site}</span>\n                <button class="remove-site-btn" data-site="${site}" style="color:#ff4d4f; border:1px solid #ff4d4f; background:none; padding:2px 8px; border-radius:4px; cursor:pointer;">移除</button>\n            </div>\n        `)).join("") : '<div style="text-align:center; padding:20px; color:#999;">黑名单为空</div>'}\n        </div>\n    `;
            layer.open({
                type: 1,
                title: "📋 禁用网站管理",
                area: [ "350px", "400px" ],
                content: content,
                btn: [ "关闭" ],
                success: (layero, index) => {
                    layero.find(".remove-site-btn").on("click", (e => {
                        const siteToRemove = $(e.currentTarget).data("site");
                        this.settings.blacklist = this.settings.blacklist.filter((s => s !== siteToRemove));
                        cacheManager.setItem(cacheManager.menuSetting_key, this.settings);
                        $(e.currentTarget).closest(".blacklist-item").fadeOut(300, (function() {
                            $(this).remove();
                            0 === layero.find(".blacklist-item").length && layero.find(".blacklist-container").html('<div style="text-align:center; padding:20px; color:#999;">黑名单为空</div>');
                        }));
                        this.registerGMMenu();
                        show.ok(`已移除 ${siteToRemove}`);
                    }));
                }
            });
        }
        openHotkeySetter() {
            const content = `\n            <style>\n                .hotkey-container {\n                    padding: 24px;\n                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;\n                    background-color: #fff;\n                }\n                .hotkey-label {\n                    margin-bottom: 12px;\n                    color: #8c8c8c;\n                    font-size: 13px;\n                    line-height: 1.5;\n                }\n                .hotkey-input-group {\n                    display: flex;\n                    align-items: center;\n                    gap: 12px;\n                }\n                #triggerHotkey {\n                    flex: 1;\n                    height: 40px;\n                    text-align: center;\n                    font-weight: 600;\n                    font-size: 14px;\n                    color: #409eff;\n                    background-color: #f5f7fa;\n                    border: 1px solid #dcdfe6;\n                    border-radius: 6px;\n                    cursor: pointer;\n                    transition: all 0.2s cubic-bezier(.645,.045,.355,1);\n                    outline: none;\n                }\n                #triggerHotkey:hover {\n                    border-color: #c0c4cc;\n                }\n                #triggerHotkey:focus {\n                    border-color: #409eff;\n                    background-color: #ecf5ff;\n                    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);\n                }\n                #triggerHotkey::placeholder {\n                    color: #a8abb2;\n                    font-weight: normal;\n                }\n                #clearHotkey {\n                    height: 40px;\n                    padding: 0 16px;\n                    font-size: 13px;\n                    color: #606266;\n                    background: #fff;\n                    border: 1px solid #dcdfe6;\n                    border-radius: 6px;\n                    cursor: pointer;\n                    transition: all 0.2s;\n                }\n                #clearHotkey:hover {\n                    color: #ff4d4f;\n                    border-color: #ff4d4f;\n                    background-color: #fff1f0;\n                }\n                #clearHotkey:active {\n                    background-color: #ffccc7;\n                }\n            </style>\n            <div class="hotkey-container">\n                <div class="hotkey-label">\n                    快捷键录入：请直接在方框内按下组合键<br>\n                    <span style="font-size: 11px; color: #c0c4cc;">支持 Ctrl, Shift, Alt, Meta 与普通键组合</span>\n                </div>\n                <div class="hotkey-input-group">\n                    <input type="text" id="triggerHotkey" \n                        value="${this.settings.triggerHotkey}" \n                        readonly \n                        placeholder="点击此处按下按键..."\n                        autocomplete="off">\n                    <button type="button" id="clearHotkey">清空</button>\n                </div>\n            </div>\n        `;
            layer.open({
                type: 1,
                title: "⚙️ 设置触发快捷键",
                area: [ "400px", "250px" ],
                content: content,
                btn: [ "确定", "取消" ],
                shadeClose: !0,
                scrollbar: !1,
                anim: -1,
                success: (layero, index) => {
                    const $input = layero.find("#triggerHotkey"), $clearBtn = layero.find("#clearHotkey");
                    $input.focus();
                    $clearBtn.on("click", (() => $input.val("")));
                    $input.on("keydown", (event => {
                        event.preventDefault();
                        event.stopPropagation();
                        const hotkey = this.parseHotkey(event);
                        /[\u4e00-\u9fa5]/.test(hotkey) ? show.error("非法输入：不能输入中文或输入法转换错误") : $input.val(hotkey);
                    }));
                },
                yes: (index, layero) => {
                    const newKey = layero.find("#triggerHotkey").val();
                    if (newKey) {
                        this.settings.triggerHotkey = newKey;
                        cacheManager.setItem(cacheManager.menuSetting_key, this.settings);
                        this.refreshHotkey();
                        this.registerGMMenu();
                        layer.close(index);
                        show.ok("设置已生效");
                    } else show.error("快捷键不能为空");
                }
            });
        }
        parseHotkey(event) {
            if ("Backspace" === event.key || "Process" === event.key) return "";
            const keys = [];
            event.ctrlKey && keys.push("Ctrl");
            event.shiftKey && keys.push("Shift");
            event.altKey && keys.push("Alt");
            event.metaKey && keys.push("Cmd");
            const key = {
                " ": "Space",
                Control: "Ctrl",
                Meta: "Cmd",
                ArrowUp: "Up",
                ArrowDown: "Down",
                ArrowLeft: "Left",
                ArrowRight: "Right"
            }[event.key] || (event.key.length > 1 ? event.key.replace("Arrow", "") : event.key.toUpperCase());
            [ "Control", "Shift", "Alt", "Meta" ].includes(event.key) || keys.includes(key) || keys.push(key);
            return keys.join("+");
        }
        async initCss() {
            return "\n        <style>\n            .plugin-alt-menu, .plugin-submenu {\n                position: fixed; \n                z-index: 10001; \n                background: rgba(255, 255, 255, 0.85); /* 半透明背景 */\n                backdrop-filter: blur(12px); /* 毛玻璃特效 */\n                -webkit-backdrop-filter: blur(12px);\n                border: 1px solid rgba(255, 255, 255, 0.3); /* 柔和边框 */\n                border-radius: 10px; /* 大圆角 */\n                box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.12), \n                            0 1px 2px 0 rgba(0, 0, 0, 0.05); /* 层次感阴影 */\n                display: none; \n                list-style: none; \n                padding: 6px; \n                margin: 0;\n                min-width: 180px; \n                font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, sans-serif;\n                user-select: none;\n                animation: menu-fade-in 0.15s ease-out; /* 弹出动画 */\n            }\n\n            @keyframes menu-fade-in {\n                from { opacity: 0; transform: translateY(5px) scale(0.98); }\n                to { opacity: 1; transform: translateY(0) scale(1); }\n            }\n\n            .plugin-alt-menu li {\n                position: relative; \n                padding: 10px 14px; \n                font-size: 14px;\n                color: #303133; \n                cursor: pointer; \n                white-space: nowrap;\n                display: flex; \n                justify-content: space-between; \n                align-items: center;\n                border-radius: 6px; /* 每一项也有圆角 */\n                transition: all 0.2s ease;\n                margin-bottom: 2px;\n            }\n\n            .plugin-alt-menu li:last-child { margin-bottom: 0; }\n\n            .plugin-alt-menu li:hover { \n                background-color: rgba(64, 158, 255, 0.1); /* 轻微蓝色背景 */\n                color: #409eff; \n                padding-left: 18px; /* 悬停时的小位移 */\n            }\n\n            /* 带有二级菜单的箭头样式 */\n            .has-children::after { \n                content: ''; /* 使用细体箭头符号或图标 */\n                font-family: serif;\n                font-size: 12px; \n                color: #909399; \n                opacity: 0.6;\n            }\n\n            .plugin-alt-menu li:hover > .plugin-submenu {\n                display: block; \n                position: absolute; \n                left: calc(100% + 4px); \n                top: -6px;\n            }\n\n            /* 分隔线优化 */\n            .menu-divider { \n                height: 1px; \n                background: linear-gradient(to right, transparent, rgba(0,0,0,0.06), transparent);\n                margin: 6px 10px; \n            }\n\n            /* 响应式：暗色模式适配（可选） */\n            @media (prefers-color-scheme: dark) {\n                .plugin-alt-menu, .plugin-submenu {\n                    background: rgba(40, 44, 52, 0.8);\n                    border: 1px solid rgba(255, 255, 255, 0.1);\n                    color: #e0e0e0;\n                }\n                .plugin-alt-menu li { color: #e0e0e0; }\n                .plugin-alt-menu li:hover { background-color: rgba(255, 255, 255, 0.1); }\n                .menu-divider { background: rgba(255,255,255,0.1); }\n            }\n        </style>\n    ";
        }
        renderMenu($container, items) {
            items.forEach((item => {
                if ("divider" === item.type) {
                    $container.append('<div class="menu-divider"></div>');
                    return;
                }
                const $li = $(`<li class="${item.children ? "has-children" : ""}" \n                        data-id="${item.id || ""}" \n                        data-index="${item.index}"> \n                        <span>${item.label}</span> \n                      </li>`);
                item.handler && $li.data("menu-handler", item.handler);
                if (item.children) {
                    const $submenu = $('<ul class="plugin-submenu"></ul>');
                    this.renderMenu($submenu, item.children);
                    $li.append($submenu);
                }
                $container.append($li);
            }));
        }
        render() {
            if (!$(".plugin-alt-menu").length) {
                this.$menu = $('<ul class="plugin-alt-menu"></ul>').appendTo("body");
                this.renderMenu(this.$menu, this.menuConfig);
            }
        }
        bindEvents() {
            let ticking = !1;
            $(document).on("mousemove", (e => {
                if (!ticking) {
                    window.requestAnimationFrame((() => {
                        this.mousePos.x = e.clientX;
                        this.mousePos.y = e.clientY;
                        ticking = !1;
                    }));
                    ticking = !0;
                }
            }));
            const debouncedEntry = DomUtil.debounce((e => {
                const $target = $(e.target);
                $target.closest(".plugin-alt-menu").length || (this.$currentTarget = $target);
            }), 100);
            $(document).on("mouseenter", "*", (e => {
                debouncedEntry(e);
            }));
            $(document).on("mouseleave", "img", (e => {
                const nextElement = e.relatedTarget || e.originalEvent.relatedTarget;
                this.$menu && (this.$menu.is(nextElement) || this.$menu.has(nextElement).length > 0) || (this.$currentTarget = null);
            }));
            document.addEventListener("mousedown", (e => {
                $(e.target).closest(".plugin-alt-menu").length || this.hideMenu();
            }));
            this.$menu.off("click").on("click", "li", (e => {
                e.stopPropagation();
                const handler = $(e.currentTarget).data("menu-handler");
                if (handler && "function" == typeof handler) {
                    handler();
                    this.hideMenu();
                }
            }));
            window.addEventListener("scroll", (() => {
                this.hideMenu();
            }), {
                capture: !0,
                passive: !0
            });
        }
        showMenu() {
            if (!this.$menu) return;
            const selectedText = window.getSelection().toString().trim(), isImage = this.$currentTarget && this.$currentTarget.is("img");
            this.$menu.find("li").hide();
            isImage ? this.$menu.find('[data-id="imageSearch"]').show() : selectedText ? this.$menu.find('[data-id="magnetSearch"]').show() : this.$menu.find("li").show();
            this.renderPosition();
        }
        renderPosition() {
            this.$menu.css({
                visibility: "hidden",
                display: "block"
            });
            const menuWidth = this.$menu.outerWidth(), menuHeight = this.$menu.outerHeight(), winWidth = window.innerWidth, winHeight = window.innerHeight, x = this.mousePos.x, y = this.mousePos.y;
            let finalX = x + menuWidth > winWidth ? winWidth - menuWidth - 10 : x, finalY = y + menuHeight > winHeight ? y - menuHeight - 10 : y;
            this.$menu.css({
                top: Math.max(0, finalY),
                left: Math.max(0, finalX),
                visibility: "visible"
            }).show();
        }
        hideMenu() {
            this.$menu && this.$menu.is(":visible") && this.$menu.hide();
        }
    }
    const currentHref = window.location.href;
    class ImageRecognitionPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "siteList", [ {
                name: "Google旧版",
                url: "https://www.google.com/searchbyimage?image_url={占位符}&client=firefox-b-d",
                ico: "https://www.google.com/favicon.ico"
            }, {
                name: "Google",
                url: "https://lens.google.com/uploadbyurl?url={占位符}",
                ico: "https://www.google.com/favicon.ico"
            }, {
                name: "Yandex",
                url: "https://yandex.ru/images/search?rpt=imageview&url={占位符}",
                ico: "https://yandex.ru/favicon.ico"
            } ]);
            __publicField(this, "isUploading", !1);
            __publicField(this, "MAX_HISTORY", 12);
            __publicField(this, "autoOpenEnabled", cacheManager.getItem(cacheManager.image_recognition_auto_open_key, "no"));
        }
        getName() {
            return "ImageRecognitionPlugin";
        }
        getRegisterCondition() {
            return !0;
        }
        async initCss() {
            return "\n            <style>\n                #upload-area {\n                    border: 2px dashed #85af68;\n                    border-radius: 8px;\n                    padding: 40px;\n                    text-align: center;\n                    margin-bottom: 20px;\n                    transition: all 0.3s;\n                    background-color: #f9f9f9;\n                }\n                #upload-area:hover {\n                    border-color: #76b947;\n                    background-color: #f0f0f0;\n                }\n                /* 拖拽进入 */\n                #upload-area.highlight {\n                    border-color: #2196F3;\n                    background-color: #e3f2fd;\n                }\n                \n                \n                #select-image-btn {\n                    background-color: #4CAF50;\n                    color: white;\n                    border: none;\n                    padding: 10px 20px;\n                    border-radius: 4px;\n                    cursor: pointer;\n                    font-size: 16px;\n                    transition: background-color 0.3s;\n                }\n                #select-image-btn:hover {\n                    background-color: #45a049;\n                }\n                \n                .search-img-site-btns-container {\n                    display: flex;\n                    flex-wrap: wrap;\n                    gap: 10px;\n                    margin-top: 15px;\n                }\n                .search-img-site-btn {\n                    display: flex;\n                    align-items: center;\n                    padding: 8px 12px;\n                    background-color: #f5f5f5;\n                    border-radius: 4px;\n                    text-decoration: none;\n                    color: #333;\n                    transition: all 0.2s;\n                    font-size: 14px;\n                    border: 1px solid #ddd;\n                }\n                .search-img-site-btn:hover {\n                    background-color: #e0e0e0;\n                    transform: translateY(-2px);\n                    box-shadow: 0 2px 5px rgba(0,0,0,0.1);\n                }\n                .search-img-site-btn img {\n                    width: 16px;\n                    height: 16px;\n                    margin-right: 6px;\n                }\n                .search-img-site-btn span {\n                    white-space: nowrap;\n                }\n                \n                .history-title { font-weight: bold; margin-bottom: 10px; display: flex; justify-content: space-between; }\n\n                .history-container { \n                    margin-top: 25px; \n                    border-top: 1px solid #eee; \n                    padding-top: 15px; \n                }\n                .history-title {\n                    font-weight: bold;\n                    font-size: 15px;\n                    color: #333;\n                    margin-bottom: 15px;\n                    display: flex;\n                    justify-content: space-between;\n                    align-items: center;\n                }\n                .history-list { \n                    display: grid;\n                    grid-template-columns: repeat(4, 1fr); \n                    gap: 10px; /* 图片之间的间距 */\n                }\n                .recognition-history-item { \n                    aspect-ratio: 1 / 1; /* 保持正方形 */\n                    border-radius: 8px; \n                    cursor: pointer; \n                    border: 1px solid #ddd; \n                    background-color: #f9f9f9; \n                    overflow: hidden; \n                    transition: all 0.2s ease-in-out;\n                    display: flex;\n                    align-items: center;\n                    justify-content: center;\n                    position: relative;\n                }\n                .recognition-history-item:hover { \n                    border-color: #2196F3; \n                    box-shadow: 0 4px 12px rgba(33, 150, 243, 0.2);\n                    transform: translateY(-3px);\n                }\n                .recognition-history-item img { \n                    width: 100%; \n                    height: 100%; \n                    object-fit: contain; /* 保证图片完整显示 */\n                    display: block;\n                }\n                .delete-recognition-history-item {\n                    position: absolute;\n                    top: 2px;\n                    right: 2px;\n                    width: 20px;\n                    height: 20px;\n                    background: rgba(0, 0, 0, 0.5);\n                    color: white;\n                    border-radius: 50%;\n                    display: flex;\n                    align-items: center;\n                    justify-content: center;\n                    font-size: 16px;\n                    line-height: 1;\n                    cursor: pointer;\n                    opacity: 0;\n                    transition: opacity 0.2s;\n                    z-index: 10;\n                }\n                .recognition-history-item:hover .delete-recognition-history-item {\n                    opacity: 1;\n                }\n                .delete-recognition-history-item:hover {\n                    background: #f44336;\n                }\n                .clear-history {\n                    color: #f44336;\n                    cursor: pointer;\n                    font-size: 13px;\n                    font-weight: normal;\n                    padding: 2px 8px;\n                    border-radius: 4px;\n                }\n                .clear-history:hover {\n                    background-color: #ffebee;\n                }\n                \n                #search-results {\n                    margin-top: 20px;\n                    padding: 15px;\n                    background: #fcfcfc;\n                    border-radius: 8px;\n                    border: 1px solid #eee;\n                }\n                .search-header {\n                    display: flex;\n                    justify-content: space-between;\n                    align-items: center;\n                    margin-bottom: 12px;\n                    padding: 0 5px;\n                }\n                .search-header-title {\n                    font-size: 14px;\n                    color: #666;\n                    font-weight: 500;\n                }\n                #openAll {\n                    color: #2196F3;\n                    font-size: 13px;\n                    text-decoration: none;\n                    padding: 4px 10px;\n                    border: 1px solid #2196F3;\n                    border-radius: 4px;\n                    transition: all 0.2s;\n                    cursor: pointer;\n                }\n                #openAll:hover {\n                    background-color: #2196F3;\n                    color: #fff !important;\n                }\n                .search-img-site-btn {\n                    user-select: none;\n                }\n                .site-checkbox {\n                    cursor: pointer;\n                    width: 14px;\n                    height: 14px;\n                    margin-right: 5px;\n                    accent-color: #2196F3; /* 现代浏览器自定义勾选颜色 */\n                }\n                \n                .auto-open-wrapper {\n                    display: flex;\n                    align-items: center;\n                    cursor: pointer;\n                    user-select: none;\n                    font-size: 13px;\n                    color: #666;\n                    margin-right: 12px;\n                }\n                .auto-open-wrapper input {\n                    cursor: pointer;\n                    width: 14px;\n                    height: 14px;\n                    margin-right: 5px;\n                    accent-color: #2196F3; /* 现代浏览器自定义勾选颜色 */\n                }\n                .auto-open-wrapper:hover {\n                    color: #2196F3;\n                }\n            </style>\n        ";
        }
        getFullUrl(path) {
            if (!path) return "";
            if (/^(https?:|data:)/i.test(path)) return path;
            if (path.startsWith("/")) return window.location.origin + path;
            return window.location.href.substring(0, window.location.href.lastIndexOf("/") + 1) + path;
        }
        openRecognition(imgSrc) {
            let html = `\n            <div style="padding: 20px">\n                <div id="upload-area">\n                    <div style="color: #555;margin-bottom: 15px;">\n                        <p>拖拽图片到此处 或 点击按钮选择图片</p>\n                        <p>也可以直接 Ctrl+V 粘贴图片</p>\n                    </div>\n                    <button id="select-image-btn">选择图片</button>\n                    <input type="file" style="display: none" id="image-file" accept="image/*">\n                </div>\n                \n                <div style="text-align: center;">\n                    <img id="preview-image" alt="" src="" style="max-width: 100%; max-height: 300px; border-radius: 4px; box-shadow: 0 2px 5px rgba(0,0,0,0.1);">\n                    \n                    <div id="error-area" style="display: none; margin-top: 15px; padding: 10px; background: #fff1f0; border: 1px solid #ffa39e; border-radius: 4px;">\n                        <p id="error-message" style="color: #f5222d; margin-bottom: 10px; font-size: 14px;"></p>\n                        <button id="retry-btn" style="background-color: #faad14; color: white; border: none; padding: 5px 15px; border-radius: 4px; cursor: pointer;">重新尝试</button>\n                    </div>\n                    \n                    <div id="search-results" style="display: none;">\n                        <div class="search-header">\n                            <span class="search-header-title">选择识图网站</span>\n                            <div style="display: flex; align-items: center; gap: 10px;">\n                                <label class="auto-open-wrapper">\n                                    <input type="checkbox" id="auto-open-toggle" ${"yes" === this.autoOpenEnabled ? "checked" : ""} >\n                                    <span>完成后自动打开</span>\n                                </label>\n                                <a id="openAll" title="打开所有已勾选的引擎">全部打开</a>\n                            </div>\n                        </div>\n                        <div class="search-img-site-btns-container" id="search-img-site-btns-container"></div>\n                    </div>\n                </div>\n                \n                <div class="history-container" id="history-container" style="display: none;">\n                    <div class="history-title">\n                        最近搜索\n                        <span class="clear-history" id="clear-history">清空</span>\n                    </div>\n                    <div class="history-list" id="history-list"></div>\n                </div>  \n                \n            </div>\n        `;
            layer.open({
                type: 1,
                title: "以图识图",
                content: html,
                area: [ "50%", "95%" ],
                shadeClose: !0,
                scrollbar: !1,
                anim: -1,
                success: async layero => {
                    this.initEventListeners(layero);
                    this.renderHistory();
                    if (imgSrc) {
                        const fullSrc = this.getFullUrl(imgSrc);
                        $("#preview-image").attr("src", fullSrc);
                        this.searchByImage();
                    }
                },
                end: () => {
                    $(document).off("paste.searchImg");
                }
            });
        }
        initEventListeners($layero) {
            const $fileInput = $("#image-file");
            $layero.on("dragover", "#upload-area", (e => {
                e.preventDefault();
                $(e.currentTarget).addClass("highlight");
            }));
            $layero.on("dragleave drop", "#upload-area", (e => {
                e.preventDefault();
                $(e.currentTarget).removeClass("highlight");
                if ("drop" === e.type) {
                    const files = e.originalEvent.dataTransfer.files;
                    files && files[0] && this.handleImageFile(files[0]);
                }
            }));
            $layero.on("click", (e => {
                const $target = $(e.target).closest("button, a, #clear-history, #retry-btn, #select-image-btn, #openAll");
                if (!$target.length) return;
                const id = $target.attr("id");
                if ("select-image-btn" === id) $fileInput.trigger("click"); else if ("openAll" === id) {
                    let firstTabOpened = !1;
                    $layero.find(".search-img-site-btn").each((function() {
                        if ($(this).find(".site-checkbox").is(":checked")) {
                            const url = $(this).attr("href");
                            if (firstTabOpened) GM_openInTab(url, {
                                insert: 0,
                                active: !1
                            }); else {
                                GM_openInTab(url, {
                                    insert: 0,
                                    active: !0
                                });
                                firstTabOpened = !0;
                            }
                        }
                    }));
                } else if ("clear-history" === id) {
                    e.stopPropagation();
                    CommonUtil.q(e, "确认清空所有搜索历史吗？", (() => {
                        cacheManager.setItem(cacheManager.image_recognition_history_key, []);
                        this.renderHistory();
                    }));
                } else "retry-btn" === id && this.searchByImage().then();
            }));
            $layero.on("change", "#image-file", (e => {
                e.target.files && e.target.files[0] && this.handleImageFile(e.target.files[0]);
            }));
            $(document).off("paste.searchImg").on("paste.searchImg", (async e => {
                const items = e.originalEvent.clipboardData.items;
                for (let i = 0; i < items.length; i++) if (-1 !== items[i].type.indexOf("image")) {
                    const blob = items[i].getAsFile();
                    this.handleImageFile(blob);
                    break;
                }
            }));
            $layero.on("change", "#auto-open-toggle", (e => {
                this.autoOpenEnabled = $(e.target).is(":checked") ? "yes" : "no";
                cacheManager.setItem(cacheManager.image_recognition_auto_open_key, this.autoOpenEnabled);
            }));
        }
        handleImageFile(file) {
            const $previewImage = $("#preview-image");
            if (!file.type.match("image.*")) {
                show.info("请选择图片文件");
                return;
            }
            const reader = new FileReader;
            reader.onload = e => {
                $previewImage.attr("src", e.target.result);
                $previewImage.attr("data-original", e.target.result);
                this.searchByImage().then();
            };
            reader.readAsDataURL(file);
        }
        async searchByImage() {
            if (this.isUploading) return;
            const $previewImage = $("#preview-image"), imageSrc = $previewImage.attr("data-original") || $previewImage.attr("src");
            if (!imageSrc) {
                show.info("请粘贴或上传图片");
                return;
            }
            let loadObj = loading();
            const $searchResults = $("#search-results"), $siteBtnsContainer = $("#search-img-site-btns-container"), $errorArea = $("#error-area"), $errorMessage = $("#error-message");
            this.isUploading = !0;
            $searchResults.hide();
            $errorArea.hide();
            try {
                let finalImgUrl = this.getHistoryUrl(imageSrc);
                if (!finalImgUrl) {
                    let uploadData = imageSrc;
                    if (imageSrc.startsWith("http")) {
                        show.info("正在处理远程图片...");
                        uploadData = await this.fetchImageAsBase64(imageSrc);
                    }
                    show.info("开始上传图片...");
                    finalImgUrl = await async function(base64Data) {
                        var _a;
                        if ("string" != typeof base64Data || !base64Data.includes(";base64,")) {
                            console.error("无效的 Base64 数据");
                            return null;
                        }
                        const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, ""), formData = new FormData;
                        formData.append("image", cleanBase64);
                        formData.append("type", "base64");
                        formData.append("name", "image.png");
                        const data = await gmHttp.postFormData("https://api.imgur.com/3/upload?client_id=d70305e7c3ac5c6", formData, {
                            Referer: "https://imgur.com/"
                        });
                        if (data && data.success) return data.data.link;
                        throw new Error((null == (_a = data.data) ? void 0 : _a.error) || "上传失败");
                    }(uploadData);
                }
                if (!finalImgUrl) throw new Error("图床接口返回地址为空!");
                this.saveToHistory(imageSrc, finalImgUrl);
                $searchResults.show();
                $siteBtnsContainer.empty().show();
                const selectedSites = cacheManager.getItem(cacheManager.image_recognition_site_key, {});
                this.siteList.forEach((site => {
                    const siteUrl = site.url.replace("{占位符}", encodeURIComponent(finalImgUrl)), isChecked = !1 !== selectedSites[site.name], $btn = $(`\n                <a href="${siteUrl}" class="search-img-site-btn" target="_blank" title="${site.name}">\n                    <input type="checkbox" class="site-checkbox" data-site-name="${site.name}" \n                           style="margin-right: 5px" ${isChecked ? "checked" : ""}>\n                    <img src="${site.ico}" alt="${site.name}">\n                    <span>${site.name}</span>\n                </a>\n            `);
                    $siteBtnsContainer.append($btn);
                }));
                $siteBtnsContainer.off("change").on("change", ".site-checkbox", (function(e) {
                    e.stopPropagation();
                    const siteName = $(this).data("site-name"), currentSelected = cacheManager.getItem(cacheManager.image_recognition_site_key, {});
                    currentSelected[siteName] = $(this).is(":checked");
                    cacheManager.setItem(cacheManager.image_recognition_site_key, currentSelected);
                }));
                "yes" === this.autoOpenEnabled && setTimeout((() => {
                    $("#openAll").trigger("click");
                }), 200);
                return finalImgUrl;
            } catch (error) {
                show.error(error);
                console.error("[以图识图] 发生错误:", error);
                $errorMessage.text(`识别失败：${error.message || "未知错误"}`);
                $errorArea.show();
            } finally {
                this.isUploading = !1;
                loadObj.close();
            }
        }
        async fetchImageAsBase64(url) {
            return new Promise(((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: "GET",
                    url: url,
                    responseType: "blob",
                    headers: {
                        Referer: window.location.href,
                        "User-Agent": navigator.userAgent
                    },
                    onload: function(response) {
                        if (200 !== response.status) {
                            reject(new Error(`无法读取远程图片，链接: ${url} 状态码: ${response.status}`));
                            return;
                        }
                        const blob = response.response, reader = new FileReader;
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    },
                    onerror: function(err) {
                        reject(err);
                    }
                });
            }));
        }
        getHistoryUrl(imageSrc) {
            const currentKey = imageSrc.startsWith("data:") ? imageSrc.substring(0, 100) : imageSrc, cachedItem = cacheManager.getItem(cacheManager.image_recognition_history_key, []).find((item => item.original === currentKey || item.uploaded === imageSrc));
            return null == cachedItem ? void 0 : cachedItem.uploaded;
        }
        saveToHistory(originalUrl, uploadedUrl) {
            let history = cacheManager.getItem(cacheManager.image_recognition_history_key, []);
            const safeOriginal = originalUrl.startsWith("data:") ? originalUrl.substring(0, 100) : originalUrl;
            history = history.filter((item => item.original !== safeOriginal && item.uploaded !== uploadedUrl));
            history.unshift({
                original: safeOriginal,
                uploaded: uploadedUrl
            });
            history.length > this.MAX_HISTORY && (history = history.slice(0, this.MAX_HISTORY));
            cacheManager.setItem(cacheManager.image_recognition_history_key, history);
            this.renderHistory();
        }
        renderHistory() {
            const history = cacheManager.getItem(cacheManager.image_recognition_history_key, []), $container = $("#history-container"), $list = $("#history-list");
            if (history && 0 !== history.length) {
                $container.show();
                $list.empty();
                history.forEach((item => {
                    const displayUrl = item.uploaded, $item = $(`\n                <div class="recognition-history-item">\n                    <div class="delete-recognition-history-item" title="删除">×</div>\n                    <img src="${displayUrl}" loading="lazy" referrerpolicy="no-referrer" alt="${displayUrl}">\n                </div>\n            `);
                    $item.on("click", (() => {
                        $("#preview-image").attr("src", item.uploaded).attr("data-original", item.original);
                        this.searchByImage().then();
                    }));
                    $item.find(".delete-recognition-history-item").on("click", (e => {
                        e.stopPropagation();
                        this.deleteHistoryItem(e, item);
                    }));
                    $list.append($item);
                }));
            } else $container.hide();
        }
        deleteHistoryItem(e, item) {
            CommonUtil.q(e, "确认删除这条搜索记录吗？", (() => {
                let history = cacheManager.getItem(cacheManager.image_recognition_history_key, []);
                history = history.filter((data => data.original !== item.original));
                cacheManager.setItem(cacheManager.image_recognition_history_key, history);
                this.renderHistory();
            }));
        }
    }
    class SeHuaTangPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "currentImageIndex", 0);
            __publicField(this, "currentImageGroup", []);
            __publicField(this, "processedArticles", new Set);
        }
        getName() {
            return "SeHuaTangPlugin";
        }
        getRegisterCondition() {
            return currentHref.includes("sehuatang") || $("title").text().includes("色花堂");
        }
        async initCss() {
            return "\n            <style>\n                /*.icn{\n                    width: 85px !important;\n                }*/\n                .xst{\n                    font-size: 15px;\n                    color: #090909;\n                }\n                #threadlisttableid em{\n                    font-size: 15px;\n                }\n            </style>\n        ";
        }
        async handle() {
            let $enter = $(".enter-btn");
            $enter.length > 0 && $enter[0].click();
            if (!window.location.href.includes("viewthread")) {
                CommonUtil.loopDetector((() => $(".s.xst").length > 0), (() => {
                    this.parseArticleImg().then();
                }));
                CommonUtil.loopDetector((() => document.querySelector("#threadlisttableid")), (() => {
                    this.checkDom();
                }));
                this.handleImg();
            }
        }
        checkDom() {
            const targetNode = document.querySelector("#threadlisttableid");
            if (!targetNode) {
                console.error("没有找到容器节点", targetNode);
                return;
            }
            const observer = new MutationObserver((async mutations => {
                observer.disconnect();
                try {
                    this.parseArticleImg().then();
                } finally {
                    observer.observe(targetNode, config);
                }
            })), config = {
                childList: !0,
                subtree: !1
            };
            observer.observe(targetNode, config);
        }
        async parseArticleImg() {
            let allArticleImages = {};
            const cachedData = localStorage.getItem("articleImagesCache");
            cachedData && (allArticleImages = JSON.parse(cachedData));
            $(".s.xst").each((async (index, ele) => {
                const articleUrl = $(ele).attr("href");
                if (allArticleImages[articleUrl]) {
                    const $tbody = $(ele).closest("tbody");
                    $tbody.find(".imageBox").length || $tbody.append(allArticleImages[articleUrl]);
                    this.processedArticles.add(articleUrl);
                } else if (!this.processedArticles.has(articleUrl)) {
                    this.processedArticles.add(articleUrl);
                    try {
                        const $tbody = $(ele).closest("tbody");
                        if ($tbody.find(".imageBox").length) return;
                        if (!$tbody.is(":visible")) return;
                        const res = await fetch(articleUrl);
                        if (!res.ok) return;
                        const imgs = $($.parseHTML(await res.text())).find("img.zoom[file]:not([file*='static'], [file*='hrline'])").slice(0, 5);
                        if (!imgs.length) return;
                        const fullHTML = `\n                <tr class="imageBox">\n                    <td colspan="5">\n                        <div style="display:flex;gap:10px;overflow-x:auto;padding:5px 0">${imgs.map(((_, img) => `<img src="${$(img).attr("file")}" loading="lazy" style="width:300px;height:auto;max-width:300px;max-height:300px;object-fit:contain" onclick="zoom(this,this.src,0,0,0)" alt="">`)).get().join("")}</div>\n                    </td>\n                </tr>\n            `;
                        allArticleImages[articleUrl] = fullHTML;
                        localStorage.setItem("articleImagesCache", JSON.stringify(allArticleImages));
                        $tbody.append(fullHTML);
                    } catch (e) {
                        console.error("Error:", articleUrl, e);
                    }
                }
            }));
        }
        handleImg() {
            document.addEventListener("click", (event => {
                if ("IMG" === event.target.tagName && event.target.closest(".imageBox")) {
                    const previewTbody = event.target.closest(".imageBox");
                    this.currentImageGroup = Array.from(previewTbody.querySelectorAll("img"));
                    this.currentImageIndex = this.currentImageGroup.indexOf(event.target);
                    this.createNavigateBtn();
                }
            }));
        }
        createNavigateBtn() {
            CommonUtil.loopDetector((() => $("#imgzoom_picpage").length > 0), (() => {
                if (0 === $("#imgzoom_picpage").length) return;
                const zoomContainer = document.getElementById("imgzoom_picpage");
                if (!zoomContainer) return;
                zoomContainer.querySelectorAll("#zimg_prev, #zimg_next").forEach((btn => btn.remove()));
                const prevBtn = document.createElement("div");
                prevBtn.id = "zimg_prev";
                prevBtn.className = "zimg_prev";
                prevBtn.onclick = () => this.navigateImage(-1);
                const nextBtn = document.createElement("div");
                nextBtn.id = "zimg_next";
                nextBtn.className = "zimg_next";
                nextBtn.onclick = () => this.navigateImage(1);
                zoomContainer.append(prevBtn, nextBtn);
            }));
        }
        navigateImage(direction) {
            this.currentImageIndex = (this.currentImageIndex + direction + this.currentImageGroup.length) % this.currentImageGroup.length;
            const img = this.currentImageGroup[this.currentImageIndex];
            zoom(img, img.src, 0, 0, 0);
            this.createNavigateBtn();
        }
    }
    const cloud115Api_getSign = async () => {
        const res = await gmHttp.get("https://115.com/?ct=offline&ac=space&_=" + (new Date).getTime());
        return "object" == typeof res ? res : null;
    }, cloud115Api_getDownPathList = async () => await gmHttp.get("https://webapi.115.com/offine/downpath"), cloud115Api_saveDownPath = async dirId => {
        const formData = new FormData;
        formData.append("file_id", dirId);
        return await gmHttp.postFormData("https://webapi.115.com/offine/downpath", formData);
    }, cloud115Api_addTaskUrl = async (magnet, downPathId, uid, sign, time) => {
        const formData = new FormData;
        formData.append("url", magnet);
        formData.append("wp_path_id", downPathId);
        formData.append("uid", uid);
        formData.append("sign", sign);
        formData.append("time", time);
        return await gmHttp.postFormData("https://115.com/web/lixian/?ct=lixian&ac=add_task_url", formData);
    }, cloud115Api_addTaskUrls = async (magnets, downPathId, uid, sign, time) => {
        const formData = new FormData;
        formData.append("wp_path_id", downPathId);
        formData.append("uid", uid);
        formData.append("sign", sign);
        formData.append("time", time);
        magnets.forEach(((url, index) => {
            formData.append(`url[${index}]`, url);
        }));
        return await gmHttp.postFormData("https://115.com/web/lixian/?ct=lixian&ac=add_task_urls", formData);
    }, cloud115Api_getTaskLists = async (uid, sign, time) => {
        const formData = new FormData;
        formData.append("page", "1");
        formData.append("uid", uid);
        formData.append("sign", sign);
        formData.append("time", time);
        return (await gmHttp.postFormData("https://115.com/web/lixian/?ct=lixian&ac=task_lists", formData)).tasks;
    }, cloud115Api_addDir = async (dirName, pid = 0) => {
        const formData = new FormData;
        formData.append("pid", pid);
        formData.append("cname", dirName);
        return await gmHttp.postFormData("https://webapi.115.com/files/add", formData);
    };
    class WangPan115TaskPlugin extends BasePlugin {
        getName() {
            return "WangPan115TaskPlugin";
        }
        getRegisterCondition() {
            return !0;
        }
        async handle() {
            $(document).on("click", ".magnet-down-115", (async event => {
                const magnet = $(event.currentTarget).data("magnet");
                let loadObj = loading();
                try {
                    await this.handleAddTask(magnet);
                } catch (e) {
                    show.error("发生错误:" + e);
                    console.error(e);
                } finally {
                    loadObj.close();
                }
            }));
        }
        async handleAddTask(magnetLink) {
            let magnets = [];
            Array.isArray(magnetLink) ? magnets = magnetLink.map((m => m.trim())).filter((m => "" !== m)) : "string" == typeof magnetLink && (magnets = magnetLink.split("\n").map((m => m.trim())).filter((m => "" !== m)));
            if (0 === magnets.length) {
                show.error("未发现有效的磁力链接");
                return;
            }
            const singInfo = await cloud115Api_getSign();
            if (!singInfo) {
                show.error("未登录115网盘", {
                    close: !0,
                    duration: -1,
                    callback: () => window.open("https://115.com")
                });
                return;
            }
            const sign = singInfo.sign, time = singInfo.time, {downPathId: downPathId, userId: userId} = await this.getDownPathInfo();
            let result;
            const isBatch = magnets.length > 1;
            result = isBatch ? await cloud115Api_addTaskUrls(magnets, downPathId, userId, sign, time) : await cloud115Api_addTaskUrl(magnets[0], downPathId, userId, sign, time);
            console.log(isBatch ? "[115] 批量离线返回值:" : "[115] 单条离线返回值:", result);
            let title;
            title = !1 === result.state ? result.error_msg + " 是否前往查看?" : isBatch ? `成功添加 ${magnets.length} 个任务，是否前往查看?` : "添加成功, 是否前往查看?";
            CommonUtil.q(null, title, (async () => {
                let targetUrl = "https://115.com/?tab=offline&mode=wangpan";
                if (!isBatch) {
                    const fileId = await this.getFileId(userId, sign, time, result.info_hash);
                    console.log("[115] 获取文件id:", fileId);
                    fileId && (targetUrl = `https://115.com/?cid=${fileId}&offset=0&mode=wangpan`);
                }
                window.open(targetUrl);
            }));
        }
        async getDownPathInfo() {
            let res = await cloud115Api_getDownPathList(), downPathList = res.data;
            const mapInfo = item => ({
                downPathId: item.file_id,
                userId: item.user_id
            });
            if (downPathList && downPathList.length > 0) return mapInfo(downPathList[0]);
            show.info("没有默认离线目录, 正在创建中...");
            const dirId = (await cloud115Api_addDir("云下载")).file_id;
            await cloud115Api_saveDownPath(dirId);
            show.info("创建完成, 开始执行离线下载");
            res = await cloud115Api_getDownPathList();
            downPathList = res.data;
            if (downPathList && downPathList.length > 0) return mapInfo(downPathList[0]);
            throw new Error("获取115离线目录信息失败:" + res.error);
        }
        async getFileId(userId, sign, time, infoHash) {
            const taskList = await cloud115Api_getTaskLists(userId, sign, time);
            console.log("[115] 离线任务列表", taskList);
            let fileId = null;
            for (let i = 0; i < taskList.length; i++) {
                let task = taskList[i];
                if (task.info_hash === infoHash) {
                    fileId = task.file_id;
                    break;
                }
            }
            return fileId;
        }
    }
    const ICON_FOLD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>', ICON_UNFOLD = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>';
    class MagnetExtractorPlugin extends BasePlugin {
        constructor() {
            super(...arguments);
            __publicField(this, "links", []);
            __publicField(this, "isCollapsed", !1);
            __publicField(this, "position", {
                top: 0,
                right: 0
            });
            __publicField(this, "panelConfig", {
                expandedWidth: 350,
                collapsedWidth: 220
            });
        }
        getName() {
            return "MagnetExtractorPlugin";
        }
        getRegisterCondition() {
            return !0;
        }
        async initCss() {
            const prefix = "#magnet-extractor-side";
            return `\n            <style>\n                /* 基础容器：增加 ID 权重并强制重置 */\n                ${prefix} {\n                    all: initial; /* 清除继承样式 */\n                    position: fixed !important;\n                    width: ${this.panelConfig.expandedWidth}px !important;\n                    max-height: 85vh !important;\n                    background: #ffffff !important;\n                    box-shadow: 0 8px 32px rgba(0,0,0,0.2) !important;\n                    border-radius: 12px !important;\n                    display: flex !important;\n                    flex-direction: column !important;\n                    z-index: 1989101 !important; /* 置于顶层 */\n                    border: 1px solid #eeeeee !important;\n                    font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif !important;\n                    overscroll-behavior: contain !important;\n                    user-select: none !important;\n                    box-sizing: border-box !important;\n                    transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;\n                }\n    \n                ${prefix} * {\n                    box-sizing: border-box !important;\n                    font-family: inherit !important;\n                }\n                \n                /* 折叠状态 */\n                ${prefix}.collapsed {\n                    max-height: 48px !important;\n                    width: ${this.panelConfig.collapsedWidth}px !important;\n                    overflow: hidden !important;\n                }\n    \n                /* 头部区域 */\n                ${prefix} .magnet-header {\n                    padding: 12px 15px !important;\n                    background: #f8f9fa !important;\n                    border-bottom: 1px solid #eeeeee !important;\n                    display: flex !important;\n                    justify-content: space-between !important;\n                    align-items: center !important;\n                    border-radius: 12px 12px 0 0 !important;\n                    cursor: move !important;\n                    height: 48px !important;\n                }\n    \n                ${prefix} .magnet-header h3 {\n                    margin: 0 !important;\n                    padding: 0 !important;\n                    font-size: 14px !important;\n                    font-weight: bold !important;\n                    color: #333333 !important;\n                    white-space: nowrap !important;\n                    overflow: hidden !important;\n                    text-overflow: ellipsis !important;\n                    background: transparent !important;\n                }\n                \n                /* 控件组 */\n                ${prefix} .magnet-controls {\n                    display: flex !important;\n                    gap: 8px !important;\n                    align-items: center !important;\n                    background: transparent !important;\n                }\n    \n                /* 列表容器 */\n                ${prefix} .magnet-list-container {\n                    flex: 1 !important;\n                    overflow-y: auto !important;\n                    padding: 10px !important;\n                    background: #ffffff !important;\n                }\n                \n                /* 列表项 */\n                ${prefix} .magnet-item {\n                    padding: 8px 12px !important;\n                    border-bottom: 1px solid #f5f5f5 !important;\n                    display: flex !important;\n                    align-items: center !important;\n                    justify-content: space-between !important;\n                    background: #ffffff !important;\n                    gap: 5px;\n                }\n    \n                ${prefix} .magnet-link-text {\n                    font-size: 12px !important;\n                    color: #0066cc !important;\n                    \n                    display: inline-block !important;\n                    white-space: nowrap !important;\n                    overflow: hidden !important;\n                    text-overflow: ellipsis !important;\n                    \n                    vertical-align: middle !important;\n                    flex-grow: 1;\n                    cursor: pointer;\n                }\n                \n                /* 按钮组容器 */\n                ${prefix} .magnet-item-footer {\n                    display: flex !important;\n                    gap: 4px !important;\n                    flex-shrink: 0 !important;\n                }\n    \n                /* 按钮通用样式重置 */\n                ${prefix} .m-btn, \n                ${prefix} .copy-all-btn, \n                ${prefix} .down-all-115-btn {\n                    appearance: none !important;\n                    border: 1px solid #ddd !important;\n                    background: #fff !important;\n                    border-radius: 4px !important;\n                    cursor: pointer !important;\n                    font-size: 12px !important;\n                    line-height: 1 !important;\n                    padding: 6px 10px !important;\n                    text-align: center !important;\n                    transition: all 0.2s !important;\n                    outline: none !important;\n                }\n    \n                ${prefix} .m-btn-copy { color: #4CAF50 !important; border-color: #4CAF50 !important; }\n                ${prefix} .m-btn-copy:hover { background: #4CAF50 !important; color: #fff !important; }\n                \n                ${prefix} .magnet-down-115 { \n                    background-color: #2562ff !important; \n                    color: #ffffff !important; \n                    border: none !important; \n                    font-weight: bold !important;\n                }\n                ${prefix} .magnet-down-115:hover { background-color: #1a4cd8 !important; }\n    \n                /* 页脚 */\n                ${prefix} .magnet-panel-footer {\n                    padding: 12px !important;\n                    border-top: 1px solid #eeeeee !important;\n                    background: #ffffff !important;\n                    display: flex !important;\n                    flex-direction: column !important;\n                    gap: 8px !important;\n                }\n    \n                ${prefix} .copy-all-btn {\n                    background: #4CAF50 !important;\n                    color: white !important;\n                    padding: 10px !important;\n                    font-weight: bold !important;\n                }\n    \n                /* 图标样式 */\n                ${prefix} .magnet-ctrl-icon {\n                    width: 28px !important;\n                    height: 28px !important;\n                    display: flex !important;\n                    align-items: center !important;\n                    justify-content: center !important;\n                    border-radius: 6px !important;\n                    color: #666 !important;\n                    background: transparent !important;\n                }\n                \n                ${prefix} .magnet-ctrl-icon svg {\n                    width: 18px !important;\n                    height: 18px !important;\n                    stroke: currentColor !important;\n                    fill: none !important;\n                }\n    \n                /* 动画 */\n                @keyframes magnet-focus-elegant {\n                    0% { \n                        box-shadow: 0 0 0 0px rgba(33, 150, 243, 0.8);\n                        background-color: rgba(33, 150, 243, 0.1);\n                    }\n                    50% { \n                        box-shadow: 0 0 0 10px rgba(33, 150, 243, 0);\n                        background-color: rgba(33, 150, 243, 0.3);\n                    }\n                    100% { \n                        box-shadow: 0 0 0 0px rgba(33, 150, 243, 0);\n                        background-color: transparent;\n                    }\n                }\n\n                .magnet-target-highlight {\n                    /* 蓝色底色 + 粗下划线 */\n                    border-bottom: 3px solid #2196f3 !important;\n                    border-radius: 2px;\n                    animation: magnet-focus-elegant 1s cubic-bezier(0.4, 0, 0.2, 1) forwards !important;\n                    transition: all 0.2s ease;\n                }\n            </style>\n        `;
        }
        async handle() {
            const cachedStatus = cacheManager.getItem(cacheManager.magnetExtractorCollapsed_key);
            this.isCollapsed = !0 === cachedStatus;
            const cachedPos = cacheManager.getItem("magnet_extractor_pos_key");
            cachedPos && (this.position = {
                top: cachedPos.top,
                right: cachedPos.right
            });
            this.startExtractor(!0);
        }
        startExtractor(isSilent = !1) {
            this.extractLinks();
            0 !== this.links.length ? this.renderPanel() : isSilent || show.info("本页未发现磁力或 ed2k 链接");
        }
        extractLinks() {
            const regexes = [ /magnet:\?xt=urn:btih:[a-zA-Z0-9]{32,40}/gi, /ed2k:\/\/\|file\|[^|]+\|\d+\|[a-fA-F0-9]{32}\|/gi ], foundMap = new Map, collectMatches = (str, element) => {
                if (str) for (const reg of regexes) {
                    const matches = str.match(reg);
                    if (matches) for (const m of matches) {
                        const url = m.replace(/[\r\n]/g, "").trim();
                        foundMap.has(url) || foundMap.set(url, element);
                    }
                }
            };
            $("a[href]").each(((i, el) => collectMatches($(el).attr("href"), el)));
            const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
                acceptNode: node2 => {
                    const parentTag = node2.parentElement.tagName;
                    return [ "A", "SCRIPT", "STYLE" ].includes(parentTag) ? NodeFilter.FILTER_REJECT : NodeFilter.FILTER_ACCEPT;
                }
            });
            let node;
            for (;node = walker.nextNode(); ) collectMatches(node.nodeValue, node);
            this.links = Array.from(foundMap.entries()).map((([url, element]) => ({
                url: url,
                element: element
            })));
        }
        renderPanel() {
            $("#magnet-extractor-side").length && $("#magnet-extractor-side").remove();
            const allLinksCombined = this.links.map((m => m.url)).join("\n"), html = `\n            <div id="magnet-extractor-side" class="magnet-extractor-side-panel ${this.isCollapsed ? "collapsed" : ""}"\n                style="top: ${this.position.top}px; right: ${this.position.right}px;">\n                <div class="magnet-header">\n                    <h3>🧲 已提取 (${this.links.length})</h3>\n                    <div class="magnet-controls">\n                        <div class="magnet-ctrl-icon magnet-toggle-btn" title="折叠/展开">\n                            ${this.isCollapsed ? ICON_UNFOLD : ICON_FOLD}\n                        </div>\n                        <div class="magnet-ctrl-icon magnet-close" title="关闭">\n                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>\n                        </div>\n                    </div>\n                </div>\n                <div class="magnet-list-container">\n                    ${this.links.map(((item, index) => `\n                        <div class="magnet-item">\n                            <span class="magnet-link-text m-btn-locate" title="点击定位所在位置" data-index="${index}">${item.url}</span>\n                            <div class="magnet-item-footer">\n                                <button class="m-btn m-btn-copy" data-index="${index}">复制</button>\n                                <button class="m-btn magnet-down-115" data-magnet="${item.url}">115离线</button>\n                            </div>\n                        </div>\n                    `)).join("")}\n                </div>\n                <div class="magnet-panel-footer">\n                    <button class="down-all-115-btn magnet-down-115" data-magnet="${allLinksCombined}">一键离线所有</button>\n                    <button class="copy-all-btn">复制所有链接</button>\n                    <button class="m-btn go-115-btn" style="width: 100%; padding: 8px; margin-top: 5px; color: #2562ff; border-color: #2562ff;">前往 115 网页版</button>\n                </div>\n            </div>\n        `;
            $("body").append(html);
            this.initPanelEvents();
            this.initDragEvents();
        }
        initPanelEvents() {
            const $panel = $("#magnet-extractor-side"), toggleFold = () => {
                this.isCollapsed = !this.isCollapsed;
                cacheManager.setItem(cacheManager.magnetExtractorCollapsed_key, this.isCollapsed);
                $panel.toggleClass("collapsed", this.isCollapsed);
                $panel.find(".magnet-toggle-btn").html(this.isCollapsed ? ICON_UNFOLD : ICON_FOLD);
            };
            $panel.find(".magnet-toggle-btn").on("click", (e => {
                e.stopPropagation();
                toggleFold();
            }));
            $panel.on("click", ".go-115-btn", (() => {
                window.open("https://115.com/?cid=0&offset=0&mode=wangpan", "_blank");
            }));
            $panel.find(".magnet-close").on("click", (e => {
                e.stopPropagation();
                $panel.remove();
            }));
            $panel.on("click", ".m-btn-locate", (e => {
                const idx = $(e.currentTarget).data("index");
                let target = this.links[idx].element;
                if (target) {
                    if (3 === target.nodeType) {
                        const span = document.createElement("span");
                        target.before(span);
                        span.appendChild(target);
                        this.links[idx].element = span;
                        target = span;
                    }
                    const $target = $(target), offset = $target.offset().top - $(window).height() / 2;
                    $("html, body").stop().animate({
                        scrollTop: offset
                    }, 500, (() => {
                        $target.addClass("magnet-target-highlight");
                        setTimeout((() => $target.removeClass("magnet-target-highlight")), 1e3);
                    }));
                }
            }));
            $panel.on("click", ".m-btn-copy", (e => {
                const $btn = $(e.currentTarget);
                this.copyToClipboard(this.links[$btn.data("index")].url);
                const originalText = $btn.text();
                $btn.text("已复制 ✅");
                setTimeout((() => $btn.text(originalText)), 1500);
            }));
            $panel.on("click", ".copy-all-btn", (e => {
                const $btn = $(e.currentTarget);
                this.copyToClipboard(this.links.map((m => m.url)).join("\n"));
                const originalText = $btn.text();
                $btn.text("全部复制成功！ ✅");
                setTimeout((() => $btn.text(originalText)), 1500);
            }));
        }
        initDragEvents() {
            const $panel = $("#magnet-extractor-side"), $header = $panel.find(".magnet-header");
            let isDragging = !1, offset = {
                x: 0,
                y: 0
            };
            $header.on("mousedown", (e => {
                if ($(e.target).closest(".magnet-controls").length) return;
                isDragging = !0;
                const rect = $panel[0].getBoundingClientRect();
                offset = {
                    x: rect.right - e.clientX,
                    y: e.clientY - rect.top
                };
                $panel.css("transition", "none");
                $(document).on("mousemove.magnet_drag", (de => {
                    if (!isDragging) return;
                    const winW = window.innerWidth, winH = window.innerHeight, panelW = $panel.outerWidth(), panelH = $panel.outerHeight();
                    let newRight = winW - de.clientX - offset.x, newTop = de.clientY - offset.y;
                    newRight = Math.max(0, Math.min(newRight, winW - panelW));
                    newTop = Math.max(0, Math.min(newTop, winH - panelH));
                    $panel.css({
                        right: newRight + "px",
                        top: newTop + "px",
                        left: "auto"
                    });
                    this.position = {
                        top: newTop,
                        right: newRight
                    };
                }));
                $(document).on("mouseup.magnet_drag", (() => {
                    if (isDragging) {
                        isDragging = !1;
                        $(document).off(".magnet_drag");
                        $panel.css("transition", "width 0.3s cubic-bezier(0.4, 0, 0.2, 1)");
                        cacheManager.setItem("magnet_extractor_pos_key", this.position);
                    }
                }));
            }));
        }
        copyToClipboard(text) {
            const input = document.createElement("textarea");
            input.value = text;
            document.body.appendChild(input);
            input.select();
            document.execCommand("copy");
            document.body.removeChild(input);
        }
    }
    class Hjd2048Plugin extends BasePlugin {
        getName() {
            return "Hjd2048Plugin";
        }
        getRegisterCondition() {
            return $("title").text().includes("人人为我论坛");
        }
        async handle() {
            this.hookJs();
        }
        hookJs() {
            document.getElementsByClassName = function(className, oBox) {
                this.d = oBox && document.getElementById(oBox) || document;
                for (var children = this.d.getElementsByTagName("*") || document.all, elements = [], ii = 0; ii < children.length; ii++) for (var child = children[ii], classNames = ("string" == typeof child.className ? child.className : child.getAttribute("class") || "").split(" "), j = 0; j < classNames.length; j++) if (classNames[j] === className) {
                    elements.push(child);
                    break;
                }
                return elements;
            };
        }
    }
    !async function() {
        DomUtil.importResource("https://cdn.jsdelivr.net/npm/toastify-js@1.12.0/src/toastify.min.css");
        DomUtil.importResource("https://cdn.jsdelivr.net/npm/viewerjs@1.11.1/dist/viewer.min.css");
        const savedSettings = cacheManager.getItem(cacheManager.menuSetting_key), blacklist = (null == savedSettings ? void 0 : savedSettings.blacklist) || [], host = window.location.host;
        if (blacklist.includes(host)) {
            const menuPlugin = new MenuPlugin;
            await menuPlugin.loadSettings();
            menuPlugin.registerGMMenu();
            return;
        }
        const pluginManager = new PluginManager;
        pluginManager.register(MenuPlugin);
        pluginManager.register(ImageRecognitionPlugin);
        pluginManager.register(WangPan115TaskPlugin);
        pluginManager.register(MagnetHubPlugin);
        pluginManager.register(MagnetExtractorPlugin);
        pluginManager.register(SeHuaTangPlugin);
        pluginManager.register(Hjd2048Plugin);
        pluginManager.processCss().then();
        pluginManager.processPlugins().then();
    }();
}();
