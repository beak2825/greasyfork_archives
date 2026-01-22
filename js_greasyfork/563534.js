// ==UserScript==
// @name FORGEXHACK
// @description we do a little trolling
// @version 4.0.5(No Update)
// @author FORGEX
// @homepage https://github.com/crackbob/Minebuns
// @supportURL https://github.com/crackbob/Minebuns
// @match *://minefun.io/*
// @grant none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/563534/FORGEXHACK.user.js
// @updateURL https://update.greasyfork.org/scripts/563534/FORGEXHACK.meta.js
// ==/UserScript==

(() => {
    "use strict";
    var __webpack_modules__ = {
            679: (e, t, n) => {
                n.d(t, {
                    A: () => r
                });
                var o = n(601),
                    s = n.n(o),
                    i = n(314),
                    a = n.n(i)()(s());
                a.push([e.id, "@font-face {\n    font-family: \"Product Sans\";\n    src: url(https://fonts.gstatic.com/s/productsans/v19/pxiDypQkot1TnFhsFMOfGShVF9eO.woff2);\n}\n\n:root {\n    --Minebuns-accent-color: linear-gradient(90deg, rgb(64, 190, 255) 0%, rgb(129, 225, 255) 100%);\n    --button-color: rgb(40, 40, 40, 0.9);\n    --hover-color: rgb(50, 50, 50, 0.9);\n    --panel-bg: rgb(34, 34, 34, 0.85);\n    --panel-bg: rgb(10, 10, 10, 0.85);\n    --text-color: #ffffff;\n    --header-text-size: 25px;\n    --button-text-size: 20px;\n    --setting-text-size: 15px;\n}\n\n.gui-panel {\n    position: fixed;\n    z-index: 1000;\n    width: 200px;\n    border-radius: 8px;\n    background-color: var(--panel-bg);\n    box-shadow: 0 4px 8px rgba(0,0,0,0.3);\n    font-family: 'Product Sans', sans-serif;\n    color: var(--text-color);\n    overflow: hidden;\n}\n\n.gui-header {\n    background-color: var(--header-bg);\n    height: 40px;\n    font-weight: 900;\n    display: flex;\n    align-items: center;\n    justify-content: center;\n    font-size: var(--header-text-size);\n    cursor: grab;\n}\n\n.gui-header:active {\n    cursor: grabbing;\n}\n\n.gui-button {\n    height: 35px;\n    display: flex;\n    align-items: center;\n    padding-left: 10px;\n    box-sizing: border-box;\n    cursor: pointer;\n    border-radius: 0;\n    transition: all 0.3s;\n    font-size: var(--button-text-size);\n    font-weight: 200;\n    outline: none;\n    background: var(--button-color);\n    color: var(--text-color);\n}\n\n.gui-button.enabled {\n    background: var(--Minebuns-accent-color);\n}\n\n.gui-button:not(.enabled):hover {\n    background: var(--hover-color);\n}\n\n.gui-background {\n    position: absolute;\n    left: 0;\n    top: 0;\n    z-index: 999;\n    height: 100%;\n    width: 100%;\n    backdrop-filter: blur(15px);\n    background: rgba(0, 0, 0, 0.3);\n}\n\n.gui-setting-container {\n    display: flex;\n    align-items: center;\n    justify-content: space-between;\n    background-color: var(--panel-bg);\n    padding: 2px;\n}\n\n.gui-setting-label {\n    font-size: var(--setting-text-size);\n    margin-left: 10px;\n    font-weight: 300;\n    color: var(--text-color);\n}\n\n.gui-checkbox {\n    width: 15px;\n    height: 15px;\n    border-radius: 4px;\n    background: var(--button-color);\n    position: relative;\n    margin: 8px;\n    cursor: pointer;\n    transition: background 0.3s;\n}\n\n.gui-checkbox.enabled {\n    background: var(--Minebuns-accent-color);\n}\n\n.gui-color-picker {\n    width: 15px;\n    height: 15px;\n    border-radius: 4px;\n    position: relative;\n    margin: 8px;\n    cursor: pointer;\n}\n\n.gui-color-input {\n    width: 20px;\n    height: 20px;\n    opacity: 0;\n    cursor: pointer;\n}\n\n.gui-button-container {\n    background-color: var(--panel-bg);\n    display: flex;\n    flex-direction: column;\n}\n\n.gui-text-input {\n    background: var(--button-color);\n    border: none;\n    color: var(--text-color);\n    font-family: 'Product Sans', sans-serif;\n    font-size: var(--setting-text-size);\n    width: 40px;\n    border-radius: 4px;\n    outline: none;\n    transition: background 0.3s;\n    text-align: center;\n    margin: 5px;\n    margin-right: 10px;\n}\n\n.gui-text-input:hover {\n    background: var(--hover-color);\n}\n\n.gui-text-input:focus {\n    background: var(--hover-color);\n}\n\n.with-animations .gui-panel {\n    animation: fadeInScale 0.3s ease-out;\n}\n\n@keyframes fadeInScale {\n    from {\n        opacity: 0;\n        transform: scale(0.9);\n    }\n    to {\n        opacity: 1;\n        transform: scale(1);\n    }\n}\n\n.with-animations .gui-background {\n    animation: fadeIn 0.3s ease-out;\n}\n\n@keyframes fadeIn {\n    from { opacity: 0; }\n    to { opacity: 1; }\n}\n\n.with-animations .gui-button {\n    transition: transform 0.2s ease, background 0.2s ease;\n}\n\n.with-animations .gui-button:hover {\n    transform: scale(1.01);\n}\n\n.with-animations .gui-setting-container {\n    will-change: transform, opacity;\n    transform-origin: top;\n    animation: slideDown 0.25s ease-out forwards;\n}\n\n@keyframes slideDown {\n    from {\n        opacity: 0;\n        transform: scaleY(0.8);\n    }\n    to {\n        opacity: 1;\n        transform: scaleY(1);\n    }\n}\n", ""]);
                const r = a
            },
            314: e => {
                e.exports = function(e) {
                    var t = [];
                    return t.toString = function() {
                        return this.map((function(t) {
                            var n = "",
                                o = void 0 !== t[5];
                            return t[4] && (n += "@supports (".concat(t[4], ") {")), t[2] && (n += "@media ".concat(t[2], " {")), o && (n += "@layer".concat(t[5].length > 0 ? " ".concat(t[5]) : "", " {")), n += e(t), o && (n += "}"), t[2] && (n += "}"), t[4] && (n += "}"), n
                        })).join("")
                    }, t.i = function(e, n, o, s, i) {
                        "string" == typeof e && (e = [
                            [null, e, void 0]
                        ]);
                        var a = {};
                        if (o)
                            for (var r = 0; r < this.length; r++) {
                                var l = this[r][0];
                                null != l && (a[l] = !0)
                            }
                        for (var d = 0; d < e.length; d++) {
                            var c = [].concat(e[d]);
                            o && a[c[0]] || (void 0 !== i && (void 0 === c[5] || (c[1] = "@layer".concat(c[5].length > 0 ? " ".concat(c[5]) : "", " {").concat(c[1], "}")), c[5] = i), n && (c[2] ? (c[1] = "@media ".concat(c[2], " {").concat(c[1], "}"), c[2] = n) : c[2] = n), s && (c[4] ? (c[1] = "@supports (".concat(c[4], ") {").concat(c[1], "}"), c[4] = s) : c[4] = "".concat(s)), t.push(c))
                        }
                    }, t
                }
            },
            601: e => {
                e.exports = function(e) {
                    return e[1]
                }
            },
            72: e => {
                var t = [];

                function n(e) {
                    for (var n = -1, o = 0; o < t.length; o++)
                        if (t[o].identifier === e) {
                            n = o;
                            break
                        } return n
                }

                function o(e, o) {
                    for (var i = {}, a = [], r = 0; r < e.length; r++) {
                        var l = e[r],
                            d = o.base ? l[0] + o.base : l[0],
                            c = i[d] || 0,
                            u = "".concat(d, " ").concat(c);
                        i[d] = c + 1;
                        var p = n(u),
                            h = {
                                css: l[1],
                                media: l[2],
                                sourceMap: l[3],
                                supports: l[4],
                                layer: l[5]
                            };
                        if (-1 !== p) t[p].references++, t[p].updater(h);
                        else {
                            var m = s(h, o);
                            o.byIndex = r, t.splice(r, 0, {
                                identifier: u,
                                updater: m,
                                references: 1
                            })
                        }
                        a.push(u)
                    }
                    return a
                }

                function s(e, t) {
                    var n = t.domAPI(t);
                    return n.update(e),
                        function(t) {
                            if (t) {
                                if (t.css === e.css && t.media === e.media && t.sourceMap === e.sourceMap && t.supports === e.supports && t.layer === e.layer) return;
                                n.update(e = t)
                            } else n.remove()
                        }
                }
                e.exports = function(e, s) {
                    var i = o(e = e || [], s = s || {});
                    return function(e) {
                        e = e || [];
                        for (var a = 0; a < i.length; a++) {
                            var r = n(i[a]);
                            t[r].references--
                        }
                        for (var l = o(e, s), d = 0; d < i.length; d++) {
                            var c = n(i[d]);
                            0 === t[c].references && (t[c].updater(), t.splice(c, 1))
                        }
                        i = l
                    }
                }
            },
            659: e => {
                var t = {};
                e.exports = function(e, n) {
                    var o = function(e) {
                        if (void 0 === t[e]) {
                            var n = document.querySelector(e);
                            if (window.HTMLIFrameElement && n instanceof window.HTMLIFrameElement) try {
                                n = n.contentDocument.head
                            } catch (e) {
                                n = null
                            }
                            t[e] = n
                        }
                        return t[e]
                    }(e);
                    if (!o) throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");
                    o.appendChild(n)
                }
            },
            540: e => {
                e.exports = function(e) {
                    var t = document.createElement("style");
                    return e.setAttributes(t, e.attributes), e.insert(t, e.options), t
                }
            },
            56: (e, t, n) => {
                e.exports = function(e) {
                    var t = n.nc;
                    t && e.setAttribute("nonce", t)
                }
            },
            825: e => {
                e.exports = function(e) {
                    if ("undefined" == typeof document) return {
                        update: function() {},
                        remove: function() {}
                    };
                    var t = e.insertStyleElement(e);
                    return {
                        update: function(n) {
                            ! function(e, t, n) {
                                var o = "";
                                n.supports && (o += "@supports (".concat(n.supports, ") {")), n.media && (o += "@media ".concat(n.media, " {"));
                                var s = void 0 !== n.layer;
                                s && (o += "@layer".concat(n.layer.length > 0 ? " ".concat(n.layer) : "", " {")), o += n.css, s && (o += "}"), n.media && (o += "}"), n.supports && (o += "}");
                                var i = n.sourceMap;
                                i && "undefined" != typeof btoa && (o += "\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(i)))), " */")), t.styleTagTransform(o, e, t.options)
                            }(t, e, n)
                        },
                        remove: function() {
                            ! function(e) {
                                if (null === e.parentNode) return !1;
                                e.parentNode.removeChild(e)
                            }(t)
                        }
                    }
                }
            },
            113: e => {
                e.exports = function(e, t) {
                    if (t.styleSheet) t.styleSheet.cssText = e;
                    else {
                        for (; t.firstChild;) t.removeChild(t.firstChild);
                        t.appendChild(document.createTextNode(e))
                    }
                }
            },
            548: (__unused_webpack_module, __webpack_exports__, __webpack_require__) => {
                __webpack_require__.d(__webpack_exports__, {
                    A: () => __WEBPACK_DEFAULT_EXPORT__
                });
                const __WEBPACK_DEFAULT_EXPORT__ = {
                    init: async function() {
                        let safeImport = src => eval(`(async () => { return await import("${src}")})()`),
                            preloadedModules = Array.from(document.querySelectorAll('link[rel="modulepreload"]')).map((e => e.href));
                        preloadedModules.push(Object.values(document.scripts).find((e => e?.src?.includes(location.origin))).src);
                        let importedModules = await Promise.all(preloadedModules.map((e => safeImport(e)))),
                            allModuleExports = importedModules.flatMap((e => Object.values(e)));
                        this.stores = Object.values(allModuleExports).filter((e => e?.$id)).reduce(((e, t) => (e[t.$id] = t(), e)), {}), this.network = Object.values(allModuleExports).find((e => e?.service))
                    },
                    get gameWorld() {
                        return this?.stores?.gameState?.gameWorld || null
                    }
                }
            }
        },
        __webpack_module_cache__ = {};

    function __webpack_require__(e) {
        var t = __webpack_module_cache__[e];
        if (void 0 !== t) return t.exports;
        var n = __webpack_module_cache__[e] = {
            id: e,
            exports: {}
        };
        return __webpack_modules__[e](n, n.exports, __webpack_require__), n.exports
    }
    __webpack_require__.n = e => {
        var t = e && e.__esModule ? () => e.default : () => e;
        return __webpack_require__.d(t, {
            a: t
        }), t
    }, __webpack_require__.d = (e, t) => {
        for (var n in t) __webpack_require__.o(t, n) && !__webpack_require__.o(e, n) && Object.defineProperty(e, n, {
            enumerable: !0,
            get: t[n]
        })
    }, __webpack_require__.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t), __webpack_require__.nc = void 0;
    var __webpack_exports__ = {};
    const events = {
        listeners: {},
        activeKeys: new Set,
        on: function(e, t) {
            this.listeners[e] || (this.listeners[e] = []), this.listeners[e].push(t)
        },
        remove: function(e, t) {
            this.listeners[e] && (this.listeners[e] = this.listeners[e].filter((e => e !== t)))
        },
        emit: function(e, t) {
            this.listeners[e] && this.listeners[e].forEach((e => e(t)))
        },
        trackKey: function(e, t, n) {
            "keydown" === e && moduleManager.handleKeyPress(n), "keydown" !== e || this.activeKeys.has(t) || (this.activeKeys.add(t), this.emit("keyPress", {
                key: t,
                code: n
            })), "keyup" === e && this.activeKeys.has(t) && (this.activeKeys.delete(t), this.emit("keyRelease", {
                key: t,
                code: n
            }))
        }
    };
    class Module {
        constructor(e, t, n, o) {
            this.name = e, this.category = t, this.options = n, this.keybind = o, this.waitingForBind = !1, this.isEnabled = !1, this.toggle = this.toggle.bind(this)
        }
        onEnable() {}
        onDisable() {}
        onRender() {}
        onSettingUpdate() {}
        enable() {
            this.isEnabled = !0, events.emit("module.update", this), this.onEnable()
        }
        disable() {
            this.isEnabled = !1, events.emit("module.update", this), this.onDisable()
        }
        toggle() {
            this.isEnabled ? this.disable() : this.enable()
        }
    }
    class ArrayList extends Module {
        constructor() {
            super("Arraylist", "Visual"), this.namesMap = {}, this.arraylistContainer = null, this.initialized = !1
        }
        update(e, t) {
            if (t) {
                if (!this.namesMap[e]) {
                    let t = document.createElement("div");
                    t.style.backgroundColor = "rgba(10, 10, 10, 0.7)", t.style.color = "white", t.style.padding = "2px 10px 2px 10px", t.style.display = "flex", t.style.alignItems = "center", t.style.boxSizing = "border-box", t.style.margin = "0", t.style.fontFamily = "'Product Sans', sans-serif", t.style.boxShadow = "rgb(0, 0, 0, 0.05) -5px 1px", t.style.transition = "max-height 0.2s ease-in-out, opacity 0.2s ease-in-out", t.style.overflow = "hidden", t.style.maxHeight = "0", t.style.opacity = "0";
                    let n = document.createElement("span");
                    n.style.fontWeight = "800", n.style.fontSize = "16px", n.style.backgroundImage = "var(--Minebuns-accent-color)", n.style.color = "transparent", n.style.backgroundClip = "text", n.innerHTML = e, t.appendChild(n), this.arraylistContainer.appendChild(t), setTimeout((() => {
                        t.style.maxHeight = "50px", t.style.opacity = "1"
                    }), 1), this.namesMap[e] = t
                }
            } else if (this.namesMap[e]) {
                const t = this.namesMap[e];
                t.style.maxHeight = "0", t.style.opacity = "0", setTimeout((() => {
                    this.arraylistContainer.removeChild(t), delete this.namesMap[e]
                }), 5)
            }
            const n = Object.values(this.namesMap).sort(((e, t) => this.measureElementWidth(t) - this.measureElementWidth(e)));
            this.arraylistContainer.innerHTML = "", n.forEach((e => {
                this.arraylistContainer.appendChild(e)
            }))
        }
        onEnable() {
            this.initialized ? this.arraylistContainer.style.opacity = "1" : (this.arraylistContainer = document.createElement("div"), this.arraylistContainer.style.flexDirection = "column", this.arraylistContainer.style.position = "absolute", this.arraylistContainer.style.zIndex = "1000", this.arraylistContainer.style.display = "flex", this.arraylistContainer.style.right = "5px", this.arraylistContainer.style.top = "5px", this.arraylistContainer.style.alignItems = "flex-end", this.arraylistContainer.style.pointerEvents = "none", this.arraylistContainer.style.textTransform = "lowercase", this.arraylistContainer.style.border = "2px solid transparent", this.arraylistContainer.style.borderImage = "var(--Minebuns-accent-color)", this.arraylistContainer.style.borderImageSlice = "1", this.arraylistContainer.style.borderBottom = "0", this.arraylistContainer.style.borderLeft = "0", document.body.appendChild(this.arraylistContainer), events.on("module.update", (e => {
                this.update(e.name, e.isEnabled)
            })), this.initialized = !0)
        }
        measureElementWidth(e) {
            return e.getBoundingClientRect().width
        }
        onDisable() {
            this.arraylistContainer.style.opacity = "0"
        }
    }
    var hooks = __webpack_require__(548);
    class Watermark extends Module {
        constructor() {
            super("Watermark", "Visual", {
                Text: "Minebuns"
            })
        }
        onSettingUpdate() {
            let e = document.querySelector(".Minebuns-overlay-title");
            e && (e.textContent = this.options.Text)
        }
        onEnable() {
            let e = document.querySelector(".Minebuns-overlay-title");
            e || (e = document.createElement("div"), e.className = "Minebuns-overlay-title", e.textContent = this.options.Text, e.style.position = "absolute", e.style.top = "0", e.style.left = "0", e.style.padding = "0.5em", e.style.userSelect = "none", e.style.display = "none", e.style.zIndex = "1000", e.style.textShadow = "var(--Minebuns-accent-color) 0px 0px 10px", e.style.fontFamily = "'Product Sans', sans-serif", e.style.fontSize = "24px", e.style.background = "var(--Minebuns-accent-color)", e.style.backgroundClip = "text", e.style.webkitFontSmoothing = "antialiased", e.style.webkitTextFillColor = "transparent", document.body.appendChild(e)), document.querySelector(".Minebuns-overlay-title").style.display = "flex"
        }
        onDisable() {
            document.querySelector(".Minebuns-overlay-title").style.display = "none"
        }
    }
    class ModuleSettings {
        constructor(e, t) {
            this.module = e, this.container = t, this.components = [], this.initialized = !1, this.isOpen = !1
        }
        initialize() {
            !this.initialized && this.module?.options && (Object.keys(this.module.options).forEach((e => {
                const t = this.module.options[e],
                    n = typeof t;
                e.toLowerCase().includes("color") ? this.addColorPicker(e) : "boolean" === n || "true" === t || "false" === t ? this.addCheckbox(e) : "string" === n ? this.addStringInput(e) : this.addNumberInput(e)
            })), this.components.forEach((e => e.style.display = "none")), this.initialized = !0)
        }
        toggle() {
            this.isOpen = !this.isOpen, this.components.forEach((e => {
                e.style.display = this.isOpen ? "flex" : "none", this.isOpen ? this.container.style.marginBottom = "5px" : this.container.style.marginBottom = "0px"
            }))
        }
        addNumberInput(e) {
            const t = document.createElement("div");
            t.className = "gui-setting-container";
            const n = document.createElement("span");
            n.className = "gui-setting-label", n.textContent = e;
            const o = document.createElement("input");
            o.type = "text", o.className = "gui-text-input", o.value = this.module.options[e];
            let s = o.value;
            o.addEventListener("input", (() => {
                const t = o.value.trim();
                isNaN(t) || "" === t || (s = t, this.module.options[e] = t, events.emit("setting.update", this.module))
            })), o.addEventListener("blur", (() => {
                (isNaN(o.value) || "" === o.value.trim()) && (o.value = s)
            })), o.addEventListener("keydown", (e => {
                "Enter" === e.key && o.blur()
            })), t.appendChild(n), t.appendChild(o), this.container.appendChild(t), this.components.push(t)
        }
        addStringInput(e) {
            const t = document.createElement("div");
            t.className = "gui-setting-container";
            const n = document.createElement("span");
            n.className = "gui-setting-label", n.textContent = e;
            const o = document.createElement("input");
            o.type = "text", o.className = "gui-text-input", o.value = this.module.options[e], o.addEventListener("input", (() => {
                const t = o.value.trim();
                this.module.options[e] = t, events.emit("setting.update", this.module)
            })), t.appendChild(n), t.appendChild(o), this.container.appendChild(t), this.components.push(t)
        }
        addCheckbox(e) {
            const t = document.createElement("div");
            t.className = "gui-setting-container";
            const n = document.createElement("span");
            n.className = "gui-setting-label", n.textContent = e;
            const o = document.createElement("div");
            o.className = "gui-checkbox", o.classList.toggle("enabled", !0 === this.module.options[e] || "true" === this.module.options[e]), o.addEventListener("click", (() => {
                const t = o.classList.contains("enabled");
                o.classList.toggle("enabled"), this.module.options[e] = (!t).toString(), events.emit("setting.update", this.module)
            })), t.appendChild(n), t.appendChild(o), this.container.appendChild(t), this.components.push(t)
        }
        addColorPicker(e) {
            const t = document.createElement("div");
            t.className = "gui-setting-container";
            const n = document.createElement("span");
            n.className = "gui-setting-label", n.textContent = e;
            const o = document.createElement("div");
            o.className = "gui-color-picker", o.style.background = this.module.options[e];
            const s = document.createElement("input");
            s.type = "color", s.className = "gui-color-input", o.appendChild(s), s.addEventListener("input", (t => {
                o.style.background = t.target.value, this.module.options[e] = t.target.value, events.emit("setting.update", this.module)
            })), t.appendChild(n), t.appendChild(o), this.container.appendChild(t), this.components.push(t)
        }
    }
    class Panel {
        constructor(e, t = {
            top: "200px",
            left: "200px"
        }) {
            this.panel = document.createElement("div"), this.panel.className = "gui-panel", this.panel.style.top = t.top, this.panel.style.left = t.left, this.header = document.createElement("div"), this.header.className = "gui-header", this.header.textContent = e, this.panel.appendChild(this.header), document.body.appendChild(this.panel), this.buttons = [], this.setupDragHandling()
        }
        setupDragHandling() {
            let e = !1,
                t = {
                    x: 0,
                    y: 0
                };
            this.header.addEventListener("mousedown", (n => {
                e = !0, t.x = n.clientX - this.panel.offsetLeft, t.y = n.clientY - this.panel.offsetTop
            })), document.addEventListener("mousemove", (n => {
                e && (this.panel.style.left = n.clientX - t.x + "px", this.panel.style.top = n.clientY - t.y + "px")
            })), document.addEventListener("mouseup", (() => e = !1))
        }
        addButton(e) {
            const t = document.createElement("div");
            t.className = "gui-button-container";
            const n = document.createElement("div");
            n.className = "gui-button " + (e.isEnabled ? "enabled" : ""), n.textContent = e.name;
            const o = new ModuleSettings(e, t);
            return n.addEventListener("mousedown", (t => {
                0 === t.button && (e.toggle(), n.classList.toggle("enabled", e.isEnabled)), 1 === t.button && (n.textContent = "waiting for bind..", e.waitingForBind = !0)
            })), n.addEventListener("contextmenu", (e => {
                e.preventDefault(), o.initialize(), o.toggle()
            })), n.setAttribute("tabindex", -1), n.addEventListener("keydown", (t => {
                n.textContent = e.name, e.waitingForBind && (t.preventDefault(), t.stopPropagation(), t.stopImmediatePropagation(), "Escape" === t.key ? e.keybind = null : e.keybind = String(t.code), e.waitingForBind = !1)
            })), t.appendChild(n), this.panel.appendChild(t), this.buttons.push(n), n
        }
        show() {
            this.panel.style.display = "block"
        }
        hide() {
            this.panel.style.display = "none"
        }
    }
    var injectStylesIntoStyleTag = __webpack_require__(72),
        injectStylesIntoStyleTag_default = __webpack_require__.n(injectStylesIntoStyleTag),
        styleDomAPI = __webpack_require__(825),
        styleDomAPI_default = __webpack_require__.n(styleDomAPI),
        insertBySelector = __webpack_require__(659),
        insertBySelector_default = __webpack_require__.n(insertBySelector),
        setAttributesWithoutAttributes = __webpack_require__(56),
        setAttributesWithoutAttributes_default = __webpack_require__.n(setAttributesWithoutAttributes),
        insertStyleElement = __webpack_require__(540),
        insertStyleElement_default = __webpack_require__.n(insertStyleElement),
        styleTagTransform = __webpack_require__(113),
        styleTagTransform_default = __webpack_require__.n(styleTagTransform),
        clickgui = __webpack_require__(679),
        options = {};
    options.styleTagTransform = styleTagTransform_default(), options.setAttributes = setAttributesWithoutAttributes_default(), options.insert = insertBySelector_default().bind(null, "head"), options.domAPI = styleDomAPI_default(), options.insertStyleElement = insertStyleElement_default();
    var update = injectStylesIntoStyleTag_default()(clickgui.A, options);
    const styles_clickgui = clickgui.A && clickgui.A.locals ? clickgui.A.locals : void 0;
    class ClickGUI extends Module {
        constructor() {
            super("ClickGUI", "Visual", {
                "Accent Color 1": "rgb(64, 190, 255)",
                "Accent Color 2": "rgb(129, 225, 255)",
                "Button Color": "rgb(40, 40, 40, 0.9)",
                "Hover Color": "rgb(50, 50, 50, 0.9)",
                "Header Color": "rgb(0, 0, 0, 0.85)",
                "Panel Color": "rgb(18 18 18)",
                "Text Color": "#ffffff",
                "Enable Animations": !0
            }, "Comma"), this.GUILoaded = !1, this.panels = [], this.blurredBackground = null, this.updateColors()
        }
        updateAnimations() {
            this.options["Enable Animations"] ? document.body.classList.add("with-animations") : document.body.classList.remove("with-animations")
        }
        updateColors() {
            document.body.style.setProperty("--Minebuns-accent-color", `linear-gradient(90deg, ${this.options["Accent Color 1"]} 0%, ${this.options["Accent Color 2"]} 100%)`), document.body.style.setProperty("--button-color", this.options["Button Color"]), document.body.style.setProperty("--hover-color", this.options["Hover Color"]), document.body.style.setProperty("--header-bg", this.options["Header Color"]), document.body.style.setProperty("--panel-bg", this.options["Panel Color"]), document.body.style.setProperty("--text-color", this.options["Text Color"])
        }
        onEnable() {
            document.pointerLockElement && document.exitPointerLock(), this.GUILoaded ? (this.showGUI(), this.updateAnimations()) : (this.setupBackground(), this.createPanels(), this.setupEventListeners(), this.GUILoaded = !0, this.updateAnimations())
        }
        setupBackground() {
            this.blurredBackground = document.createElement("div"), this.blurredBackground.className = "gui-background", document.body.appendChild(this.blurredBackground)
        }
        createPanels() {
            this.panels.forEach((e => {
                e.panel && e.panel.parentNode && e.panel.parentNode.removeChild(e.panel)
            })), this.panels = [], [{
                title: "Combat",
                position: {
                    top: "100px",
                    left: "100px"
                }
            }, {
                title: "Movement",
                position: {
                    top: "100px",
                    left: "320px"
                }
            }, {
                title: "Visual",
                position: {
                    top: "100px",
                    left: "540px"
                }
            }, {
                title: "Misc",
                position: {
                    top: "100px",
                    left: "760px"
                }
            }].forEach((e => {
                const t = new Panel(e.title, e.position);
                this.panels.push(t)
            }));
            const e = {};
            Object.values(module_moduleManager.modules).forEach((t => {
                e[t.category] || (e[t.category] = []), e[t.category].push(t)
            })), Object.entries(e).forEach((([e, t]) => {
                const n = this.panels.find((t => t.header.textContent === e));
                n && (t.sort(((e, t) => t.name.length - e.name.length)), t.forEach((e => n.addButton(e))))
            }))
        }
        setupEventListeners() {
            events.on("module.update", (e => {
                const t = this.panels.find((t => t.header.textContent === e.category));
                if (!t) return;
                const n = t.buttons.find((t => t.textContent === e.name));
                n && n.classList.toggle("enabled", e.isEnabled)
            }))
        }
        showGUI() {
            this.panels.forEach((e => e.show())), this.blurredBackground.style.display = "block"
        }
        onDisable() {
            this.panels.forEach((e => e.hide())), this.blurredBackground.style.display = "none"
        }
        onSettingUpdate() {
            this.updateColors(), this.updateAnimations()
        }
    }
    class Airjump extends Module {
        constructor() {
            super("Airjump", "Movement", null)
        }
        onRender() {
            hooks.A?.gameWorld?.player && (hooks.A.gameWorld.player.collision.isGrounded = !0)
        }
    }
    class Instabreak extends Module {
        constructor() {
            super("Instabreak", "Misc", null), this.originalHardness = new Map
        }
        onEnable() {
            Object.values(hooks.A.gameWorld.items).forEach((e => {
                e?.destruction && (this.originalHardness.has(e) || this.originalHardness.set(e, e.destruction.durability), e.destruction.durability = 0)
            }))
        }
        onDisable() {
            Object.values(hooks.A.gameWorld.items).forEach((e => {
                e?.destruction && this.originalHardness.has(e) && (e.destruction.durability = this.originalHardness.get(e))
            }))
        }
    }
    class Nuker extends Module {
    constructor() {
        super("Nuker", "Misc", {
            Radius: 1,
            "Chunk Interval": 1000
        });
        this.lastExecutionTime = 0;
    }

    onRender() {
        const world = hooks.A?.gameWorld;
        if (!world?.player || !world?.chunkManager) return;

        // Garantir tipos numéricos
        const radius = Math.max(0, parseInt(this.options.Radius) || 0);
        const interval = Math.max(0, parseInt(this.options["Chunk Interval"]) || 1000);

        const now = Date.now();
        if (now - this.lastExecutionTime < interval) return;
        this.lastExecutionTime = now;

        // Extrai e floor das coordenadas do jogador corretamente
        const playerPos = world.player.position;
        const playerX = Math.floor(playerPos.x);
        const playerY = Math.floor(playerPos.y);
        const playerZ = Math.floor(playerPos.z);

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                for (let dz = -radius; dz <= radius; dz++) {

                    const x = playerX + dx;
                    const y = playerY + dy;
                    const z = playerZ + dz;

                    // NÃO destruir **nenhum** bloco que esteja exatamente uma unidade abaixo dos pés do jogador
                    if (y === playerY - 1) continue;

                    try {
                        const block = world.chunkManager.getBlock(x, y, z);
                        if (block !== 0) {
                            world.chunkManager.setBlock(x, y, z, 0, true, true);
                        }
                    } catch (err) {
                        // falhas silenciosas para não quebrar o loop (p.ex. coordenadas fora do mapa)
                        //console.warn("Nuker: erro ao acessar bloco", x,y,z, err);
                    }
                }
            }
        }
    }
}


    class AdBypass extends Module {
        constructor() {
            super("AdBypass", "Misc")
        }
        onEnable() {
            this._reward = this._reward || hooks.A.stores.adsStore.rewardCommercialVideoWrapper, hooks.A.stores.adsStore.rewardCommercialVideoWrapper = () => !0
        }
        onDisable() {
            hooks.A.stores.adsStore.rewardCommercialVideoWrapper = this._reward;
        }
    }


class Nuker1 extends Module {
    constructor() {
        super("Nuker1", "Misc", {
            // Opções do módulo
            Distance: 3,
            "Chunk Interval": 1000
        });

        // Adiciona a propriedade de atalho de tecla (KeyZ)
        // O nome da propriedade pode variar dependendo do seu framework,
        // mas vou usar 'toggleKey' conforme sua sintaxe de exemplo.
        this.toggleKey = "KeyZ";
        this.lastExecutionTime = 0;
    }

    // Função auxiliar para calcular o vetor de direção do olhar (look vector)
    getLookVector(playerRotation) {
        const yaw = playerRotation.y;
        const pitch = playerRotation.x;
        const x = -Math.sin(yaw) * Math.cos(pitch);
        const y = Math.sin(pitch);
        const z = Math.cos(yaw) * Math.cos(pitch);
        return { x, y, z };
    }

    onRender() {
        const world = hooks.A?.gameWorld;
        // O código de quebra só será executado se o módulo estiver ativo (this.enabled)
        if (!world?.player || !world?.chunkManager || !this.enabled) return;

        // Restante do código 3x3x1
        const distance = Math.max(1, parseInt(this.options.Distance) || 3);
        const interval = Math.max(0, parseInt(this.options["Chunk Interval"]) || 1000);
        const radius = 1;

        const now = Date.now();
        if (now - this.lastExecutionTime < interval) return;
        this.lastExecutionTime = now;

        const playerPos = world.player.position;
        const playerRot = world.player.rotation;
        const lookVector = this.getLookVector(playerRot);

        const center_X_float = playerPos.x + lookVector.x * distance;
        const center_Y_float = playerPos.y + world.player.height / 2 + lookVector.y * distance;
        const center_Z_float = playerPos.z + lookVector.z * distance;

        const centerX = Math.floor(center_X_float);
        const centerY = Math.floor(center_Y_float);
        const centerZ = Math.floor(center_Z_float);

        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {

                const x = centerX + dx;
                const y = centerY + dy;
                const z = centerZ;

                try {
                    const block = world.chunkManager.getBlock(x, y, z);
                    if (block !== 0) {
                        world.chunkManager.setBlock(x, y, z, 0, true, true);
                    }
                } catch (err) {
                    // Falhas silenciosas
                }
            }
        }
    }
}



class Fly extends Module {
    constructor() {
        super("Fly", "Movement", {
            "Vertical Speed": 5
        });
        this.toggleKey = "KeyF"; // Tecla para ativar/desativar (F)
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
    }

    handleKeyPress(e) {
        if (e.code === this.toggleKey && !e.repeat) {
            this.toggle(); // ativa ou desativa o módulo
        }
    }

    onRender() {
        const player = hooks.A?.gameWorld?.player;
        if (!player) return;

        player.velocity.gravity = 0;

        if (player.inputs.jump) {
            player.velocity.velVec3.y = this.options["Vertical Speed"];
        } else if (player.inputs.crouch) {
            player.velocity.velVec3.y = -this.options["Vertical Speed"];
        } else {
            player.velocity.velVec3.y = 0;
        }
    }

    onDisable() {
        const player = hooks.A?.gameWorld?.player;
        if (player) player.velocity.gravity = 23;
    }
}
    class Speed extends Module {
        constructor() {
            super("Speed", "Movement", {
                Speed: 6
            })
        }
        onRender() {
            hooks.A?.gameWorld?.player && (hooks.A.gameWorld.player.velocity.moveSpeed = this.options.Speed, hooks.A.gameWorld.player.velocity.fastMoveSpeed = this.options.Speed)
        }
        onDisable() {
            hooks.A.gameWorld.player.velocity.moveSpeed = 4.5, hooks.A.gameWorld.player.velocity.fastMoveSpeed = 6.4
        }
    }


    class FreeMinebucks extends Module {
        constructor() {
            super("Minebucks", "Misc")
        }
        onEnable() {
            hooks.A.network.get("/users/freeHeadcoins"), hooks.A.stores.userState.user.balance.minebucks += 10, module_moduleManager.modules.minebucks.disable()
        }
    }

    class FreeSpins extends Module {
        constructor() {
            super("freeSpins", "Misc")
        }
        onEnable() {
            hooks.A.network.get("/users/freeSpinner"), hooks.A.stores.userState.user.balance.freeSpinner += 10, module_moduleManager.modules.freeSpinner.disable()
        }
    }



    class FreeHeadcoins extends Module {
        constructor() {
            super("FreeHeadcoins", "Misc")
        }
        onEnable() {
            hooks.A.network.get("/users/freeHeadcoins"), hooks.A.stores.userState.user.balance.headcoins += 10, module_moduleManager.modules.FreeHeadcoins.disable()
        }
    }
    class Fill extends Module {
        constructor() {
            super("Fill", "Misc", {
                Radius: 4,
                "Block ID": 472,
                "Chunk Interval": 500
            }), this.lastExecutionTime = 0
        }
        onRender() {
            if (!hooks.A?.gameWorld?.player) return;
            let e = this.options.Radius;
            const t = this.options["Chunk Interval"],
                n = Date.now();
            if (n - this.lastExecutionTime >= t) {
                this.lastExecutionTime = n;
                let t = Object.values(hooks.A.gameWorld.player.position).splice(0, 3).map(Math.floor);
                for (let n = -e; n <= e; n++)
                    for (let o = -e; o <= e; o++)
                        for (let s = -e; s <= e; s++) {
                            const [e, i, a] = [t[0] + n, t[1] + o, t[2] + s];
                            0 == hooks.A.gameWorld.chunkManager.getBlock(e, i, a) && hooks.A.gameWorld.chunkManager.setBlock(e, i, a, this.options["Block ID"], !0, !0)
                        }
            }
        }
    }
    class Chams extends Module {
    constructor() {
        super("Chams", "Visual", null);
    }

    onRender() {
        try {
            hooks.A?.gameWorld?.server?.players.forEach((plr) => {
                plr.playerMaterial.depthTest = false;
                if (plr.isHided) plr.model.visible = true;
            });
        } catch {}
    }

    onDisable() {
        try {
            hooks.A?.gameWorld?.server?.players.forEach((plr) => {
                plr.playerMaterial.depthTest = true;
            });
        } catch {}
    }
}
    class FOVChanger extends Module {
    constructor() {
        super("FOVChanger", "Visual", {
            FOV: 120
        });
        this.originalFOV = null;
    }

    onEnable() {
        let cam = hooks.A?.gameWorld?.threeScene?.camera;
        if (cam) {
            this.originalFOV = cam.fov; // salva o FOV original
        }
    }

    onRender() {
        let cam = hooks.A?.gameWorld?.threeScene?.camera;
        if (!cam) return;

        const newFOV = parseFloat(this.options.FOV);
        if (cam.fov !== newFOV) {
            cam.fov = newFOV;
            cam.updateProjectionMatrix();
            hooks.A.gameWorld.player.settings.fov = newFOV;
        }
    }

    onDisable() {
        let cam = hooks.A?.gameWorld?.threeScene?.camera;
        if (cam && this.originalFOV) {
            cam.fov = this.originalFOV; // restaura o original
            cam.updateProjectionMatrix();
            hooks.A.gameWorld.player.settings.fov = this.originalFOV;
        }
    }
}
    class Scaffold extends Module {
        constructor() {
            super("Scaffold", "Movement", null)
        }
        onRender() {
            if (!hooks.A?.gameWorld?.player) return;
            let e = Object.values(hooks.A.gameWorld.player.position).splice(0, 3).map(Math.floor);
            e[1]--;
            let t = hooks.A.gameWorld.player.currentInventoryItemId,
                n = hooks.A.gameWorld.chunkManager.getBlock(...e),
                o = hooks.A.gameWorld.items[n]?.replaceable || !1;
            (0 == n || o) && t && hooks.A.gameWorld.chunkManager.setBlock(...e, t, !0, !0)
        }
    }
    const mathUtils = {
            normalizeVector(e) {
                const t = e.x * e.x + e.y * e.y + e.z * e.z;
                if (t > 0) {
                    const n = 1 / Math.sqrt(t);
                    return [e.x * n, e.y * n, e.z * n]
                }
                return e
            },
            distanceBetween(e, t) {
                const n = t.x - e.x,
                    o = t.y - e.y,
                    s = t.z - e.z;
                return n * n + o * o + s * s
            },
            distanceBetweenSqrt(e, t) {
                return Math.sqrt(this.distanceBetween(e, t))
            },
            calculateDistance: (e, t) => Math.hypot(t.x - e.x, t.y - e.y, t.z - e.z)
        },
        gameUtils = {
            getClosestPlayer() {
                let e = hooks.A.gameWorld.player.position,
                    t = hooks.A.gameWorld.server.players,
                    n = [];
                return t.forEach((function(t, o) {
                    let s = mathUtils.distanceBetween(e, {
                        x: t._model.position.x,
                        y: t._model.position.y,
                        z: t._model.position.z
                    });
                    t.id = o, n.push({
                        player: t,
                        distance: s
                    })
                })), n.sort(((e, t) => e.distance - t.distance)), n.map((e => e.player))[0]
            },
            hexToRgb(e) {
                var t = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);
                return t ? {
                    r: parseInt(t[1], 16),
                    g: parseInt(t[2], 16),
                    b: parseInt(t[3], 16)
                } : null
            }
        };
    class Killaura extends Module {
  constructor() {
    super("Killaura", "Combat", {
      "Y Offset": 1.62,
      Reach: 25,
      Delay: 15
    });
    this.lastExecutionTime = 0; // more explicit
  }

  onRender() {
    const now = Date.now();
    // garante que jogador exista e que passou o delay
    if (!hooks?.A?.gameWorld?.player) return;

    const delay = Number(this.options?.Delay) || 100;
    if (now - this.lastExecutionTime < delay) return;

    this.lastExecutionTime = now;
    try {
      this.tryKill();
    } catch (err) {
      console.error("Killaura.tryKill erro:", err);
    }
  }

  tryKill() {
    // protege e converte opções
    const reach = Number(this.options?.Reach) || 5;
    const yOffset = Number(this.options?.["Y Offset"]) || 1.62;

    // pega o alvo mais próximo (pode retornar null)
    const target = (typeof gameUtils !== "undefined" && gameUtils.getClosestPlayer)
      ? gameUtils.getClosestPlayer()
      : null;
    if (!target) return;

    // aceita model ou _model (compatibilidade)
    const targetModel = target.model || target._model || null;
    const s = targetModel?.position;
    if (!s) return; // sem posição do alvo, sai

    const me = hooks?.A?.gameWorld?.player;
    if (!me?.position) return;

    const origin = {
      x: me.position.x,
      y: me.position.y + yOffset,
      z: me.position.z
    };

    const dx = origin.x - s.x;
    const dy = origin.y - s.y;
    const dz = origin.z - s.z;
    const dist = Math.hypot(dx, dy, dz);
    if (dist === 0) return;

    // normaliza e inverte (mantive sua inversão)
    const nx = -dx / dist;
    const ny = -dy / dist;
    const nz = -dz / dist;

    if (dist < reach) {
      // tenta pegar sessionId ou id (compatibilidade)
      const targetId = target.sessionId ?? target.id ?? target.sid ?? null;
      // pacote 13 preservado (se você tiver packetsOut.HIT prefira usar)
      hooks.A.gameWorld.server.sendData(
        13,
        [
          hooks.A.gameWorld.time.localServerTimeMs,
          origin.x, origin.y, origin.z,
          nx, ny, nz,
          dist,
          targetId
        ]
      );
    }
  }
}

class KnockbackDisabler extends Module {
    constructor() {
        super("KnockbackDisabler", "Misc");

        // Configurações internas
        this.blocks = 10;     // knockback
        this.damage = 2;      // dano
    }

    applyKnockbackAndDamage(target, attacker) {
        let dx = target.x - attacker.x;
        let dy = target.y - attacker.y;
        let length = Math.sqrt(dx * dx + dy * dy);

        if (!length) return;

        dx /= length;
        dy /= length;

        // Knockback
        target.x += dx * this.blocks;
        target.y += dy * this.blocks;

        // Dano
        if (typeof target.health === "number") {
            target.health -= this.damage;
            if (target.health < 0) target.health = 0;
        }
    }

    onRender() {
        // Simulação de evento "onHit"
        if (window.player && window.attacker && window.playerWasHit) {
            this.applyKnockbackAndDamage(window.player, window.attacker);

            // Reseta evento
            window.playerWasHit = false;
        }
    }
}


  class GunModifier extends Module {
    constructor() {
        super("GunModifier", "Combat", {
            "Spread": 0.0,
            "Bullets per shot": 1,
            "Bullet distance": 1000,
            "Reload Time": 1,
            "Recoil": 0,
            "isAuto": true
        });

        this.originalValuesMap = new Map(); // Salva os valores por arma
        this.toggleKey = "KeyJ"; // Tecla para ativar/desativar
        document.addEventListener("keydown", this.handleKeyPress.bind(this));
    }

    handleKeyPress(e) {
        if (e.code === this.toggleKey && !e.repeat) {
            this.toggle();
        }
    }

    get gunSystem() {
        return hooks.A.stores.gameState.gameWorld.systemsManager.activeSystems.find(e => e?.bulletsSystem);
    }

    backupGun(gun) {
        if (!this.originalValuesMap.has(gun)) {
            this.originalValuesMap.set(gun, {
                bulletsPerShot: gun.bulletsPerShot,
                isAuto: gun.isAuto,
                distance: gun.distance,
                startSpread: gun.startSpread,
                reloadTimeMs: gun.reloadTimeMs,
                recoilAttackY: gun.recoilAttackY,
                recoilAttackX: gun.recoilAttackX,
            });
        }
    }

    applyMods(gun) {
        gun.bulletsPerShot = this.options["Bullets per shot"];
        gun.isAuto = this.options["isAuto"];
        gun.distance = this.options["Bullet distance"];
        gun.startSpread = this.options["Spread"];
        gun.reloadTimeMs = this.options["Reload Time"];
        if (this.options["Recoil"] === 0) {
            gun.recoilAttackY = 0;
            gun.recoilAttackX = 0;
        }
    }

    onEnable() {
        const gun = this.gunSystem?.playerShooter?.currPlayerWeaponSpec;
        if (!gun) return;

        this.backupGun(gun);
        this.applyMods(gun);
    }

    onDisable() {
        const gun = this.gunSystem?.playerShooter?.currPlayerWeaponSpec;
        if (!gun) return;

        const original = this.originalValuesMap.get(gun);
        if (!original) return;

        // Restaura valores originais
        gun.bulletsPerShot = original.bulletsPerShot;
        gun.isAuto = original.isAuto;
        gun.distance = original.distance;
        gun.startSpread = original.startSpread;
        gun.reloadTimeMs = original.reloadTimeMs;
        gun.recoilAttackY = original.recoilAttackY;
        gun.recoilAttackX = original.recoilAttackX;

        // Remove backup (opcional)
        this.originalValuesMap.delete(gun);
    }
}

    class Disabler extends Module {
        constructor() {
            super("Disabler", "Misc"), this.packetID = null
        }
        insaneBypass() {}
        onRender() {
            if (!hooks.A?.gameWorld?.player) return;
            let e = hooks.A.stores.gameState.gameWorld.server.msgsListeners;
            this.packetID || (this.packetID = Object.keys(e).find((t => e[t].toString().includes("correct pos")))), e[this.packetID] !== this.insaneBypass && (e[this.packetID] = this.insaneBypass)
        }
    }
     class Aimbot extends Module {
        constructor() {
            super("Aimbot", "Combat", {
                "On Aim": "false",
                "On Shoot": "false",
                "Y Offset": .1
            }), this.lastExecutionTime = null
        }
        getClosestEnemy(e, t) {
            let n = null,
                o = 1 / 0;
            return t.forEach((t => {
                if (t?.model?.position && t.isAlive) {
                    let s = mathUtils.calculateDistance(e.position, t.model.position);
                    s < o && (o = s, n = t)
                }
            })), n
        }
        aimAtEnemy() {
            let e = hooks.A.stores.gameState,
                t = e.gameWorld.player,
                n = e.gameWorld.server.players;
            if (!t || !n) return;
            let o = this.getClosestEnemy(t, n);
            if (o) {
                let e = o.model.position,
                    n = t.position,
                    s = {
                        x: e.x - n.x,
                        z: e.z - n.z
                    },
                    i = Math.atan2(s.x, s.z),
                    a = parseFloat(this.options["Y Offset"]),
                    r = e.y + a - n.y,
                    l = Math.hypot(s.x, s.z),
                    d = Math.atan2(r, l);
                d = Math.max(Math.min(d, Math.PI / 2), -Math.PI / 2);
                let c = (i + Math.PI) % (2 * Math.PI);
                t.rotation.y = c, t.rotation.x = d
            }
        }
        onRender() {
            hooks.A?.stores?.gameState?.gameWorld?.server && ("true" == this.options["On Aim"] && hooks.A.stores.gameState.gameWorld.player.inputs.rightMB || "true" == this.options["On Shoot"] && hooks.A.stores.gameState.gameWorld.player.inputs.leftMB || "true" !== this.options["On Shoot"] && "true" !== this.options["On Aim"]) && this.aimAtEnemy()
        }
    }

    class NoClip extends Module {
    constructor() {
        super("NoClip", "Movement");
        this.toggleKey = "KeyG"; // Tecla para ativar/desativar (letra N)
        this._og = null;

        document.addEventListener("keydown", this.handleKeyPress.bind(this));
    }

    handleKeyPress(e) {
        if (e.code === this.toggleKey && !e.repeat) {
            this.toggle();
        }
    }

    get playerPhysicsSystem() {
        return hooks.A?.gameWorld?.systemsManager?.activeSystems?.find((e => e?.playerPhysicsSystem))?.playerPhysicsSystem;
    }

    onRender() {
        const system = this.playerPhysicsSystem;
        if (!system || !hooks.A?.gameWorld?.player) return;

        if (!this._og) this._og = system.resolveBlockCollision;

        if (system.resolveBlockCollision === this._og) {
            system.resolveBlockCollision = () => {};
        }
    }

    onDisable() {
        const system = this.playerPhysicsSystem;
        if (system && this._og) {
            system.resolveBlockCollision = this._og;
        }
    }
}



    class HitAllModule extends Module {
    constructor() {
        super("1HitAll", "Combat", null, "KeyU"); // Atalho: tecla U
    }

    hitAll() {
        try {
        window.hooked.gameWorld.server.players.forEach(plr => {
            const { x, y, z } = plr.model.position;
            if (plr.hasOwnProperty('isBlock')) { // HNS
                if (plr.isHunter) return;
                window.hooked.gameWorld.server.sendData(packetsOut.HNS_ATTACK_BLOCK, [x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, window.hooked.gameWorld.time.localServerTimeMs, plr.sessionId]);
            } if (plr.hasOwnProperty('isZombie')) { // Infection
                if (plr.isZombie) return;
                window.hooked.gameWorld.server.sendData(packetsOut.HIT, [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]);
            } else { // Other
                window.hooked.gameWorld.server.sendData(packetsOut.HIT, [window.hooked.gameWorld.time.localServerTimeMs, x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]);
            }
        });
    } catch {}
    }

    onEnable() {
        this.hitAll();
    }
}

class TeleportModule extends Module {
    constructor() {
        super("Teleport", "Misc");

        // Atalho fixo: tecla T (não ativa/desativa o módulo)
        this.key = "KeyT";

        document.addEventListener("keydown", (e) => {
            if (e.code === this.key && !e.repeat) {
                this.tpToSelectedBlock();
            }
        });
    }

    /** Função de teleporte */
    tp(x = 0, y = 0, z = 0, relative = true) {
        try {
            const player = hooks.A?.gameWorld?.player;
            if (!player) return;

            const position = player.position;
            if (relative) {
                position.x += x;
                position.y += y;
                position.z += z;
            } else {
                Object.assign(position, { x, y, z });
            }
            player.physicsPosComp.copyPos(position);
        } catch (err) {
            console.warn("Teleport falhou:", err);
        }
    }

    /** Teleporta até o bloco selecionado (crosshair) */
    tpToSelectedBlock() {
        try {
            const gameWorld = hooks.A?.gameWorld;
            if (!gameWorld) return;

            const outlineSystem = gameWorld.systemsManager.activeSystems.find(s => s.currBlockPos);
            if (!outlineSystem) return;

            outlineSystem.intersectAndShow(true, 500);
            if (!outlineSystem.currBlockPos) return;

            const { x, y, z } = outlineSystem.currBlockPos;
            this.tp(x, y + 1, z, false);
        } catch (err) {
            console.warn("Erro ao teleportar:", err);
        }
    }
}



     class HitModule extends Module {
    constructor() {
        super("2HitAll", "Combat", null, "KeyX"); // Atalho: tecla X
    }

    hitAll() {
        try {
            hooks.A?.gameWorld?.server?.players.forEach(plr => {
                const { x, y, z } = plr.model.position;

                if (plr.hasOwnProperty('isBlock')) { // HNS
                    if (plr.isHunter) return;
                    hooks.A.gameWorld.server.sendData(
                        packetsOut.HNS_ATTACK_BLOCK,
                        [x, y + 0.1, z, 0.00000001, -0.9999999, 0.00000001,
                         hooks.A.gameWorld.time.localServerTimeMs, plr.sessionId]
                    );
                } else if (plr.hasOwnProperty('isZombie')) { // Infection
                    if (plr.isZombie) return;
                    hooks.A.gameWorld.server.sendData(
                        packetsOut.HIT,
                        [hooks.A.gameWorld.time.localServerTimeMs, x, y + 0.1, z,
                         0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]
                    );
                } else { // Other
                    hooks.A.gameWorld.server.sendData(
                        packetsOut.HIT,
                        [hooks.A.gameWorld.time.localServerTimeMs, x, y + 0.1, z,
                         0.00000001, -0.9999999, 0.00000001, 2, plr.sessionId]
                    );
                }
            });
        } catch {}
    }

    onEnable() {
        this.hitAll(); // executa quando ativado pelo menu ou tecla X
    }
}



class CustomCrosshair extends Module {
    constructor() {
        super("CustomCrosshair", "Visual", {
            Style: "myrrr"
        });
        this.crosshair = null;
    }

    createCrosshair() {
        if (this.crosshair) return;

        const crosshair = document.createElement("div");
        crosshair.id = "custom-crosshair";
        crosshair.style.position = "fixed";
        crosshair.style.top = "50%";
        crosshair.style.left = "50%";
        crosshair.style.transform = "translate(-50%, -50%)";
        crosshair.style.zIndex = "9999";
        crosshair.style.pointerEvents = "none";
        document.body.appendChild(crosshair);

        this.crosshair = crosshair;
    }

    clearCrosshair() {
        if (!this.crosshair) return;
        this.crosshair.innerHTML = "";
        this.crosshair.style.background = "";
        this.crosshair.style.border = "";
        this.crosshair.style.borderRadius = "";
        this.crosshair.style.filter = "";
        this.crosshair.style.width = "";
        this.crosshair.style.height = "";
        this.crosshair.style.maskImage = "";
        this.crosshair.style.webkitMaskImage = "";
        this.crosshair.style.display = "none";
    }

    applyCrosshair(style) {
        if (!this.crosshair) this.createCrosshair();
        this.clearCrosshair();

        this.crosshair.style.display = "flex";
        this.crosshair.style.alignItems = "center";
        this.crosshair.style.justifyContent = "center";

        switch (style) {
            case "myrrr":
                this.crosshair.style.width = "15px";
                this.crosshair.style.height = "15px";
                this.crosshair.style.filter = "drop-shadow(0 0 5px #fff) drop-shadow(0 0 10px #ccf) drop-shadow(0 0 15px #ddf)";
                const horiz = document.createElement("div");
                Object.assign(horiz.style, {
                    position: "absolute",
                    width: "15px",
                    height: "4px",
                    background: "linear-gradient(to bottom, #ffffff, #e0ccff)",
                    borderRadius: "1px"
                });
                const vert = document.createElement("div");
                Object.assign(vert.style, {
                    position: "absolute",
                    width: "4px",
                    height: "15px",
                    background: "linear-gradient(to bottom, #ffffff, #e0ccff)",
                    borderRadius: "1px"
                });
                this.crosshair.appendChild(horiz);
                this.crosshair.appendChild(vert);
                break;

            case "dot":
                this.crosshair.style.width = "8px";
                this.crosshair.style.height = "8px";
                this.crosshair.style.borderRadius = "50%";
                this.crosshair.style.background = "#fff";
                this.crosshair.style.filter = "drop-shadow(0 0 4px #66f)";
                break;

            case "shotgun":
                this.crosshair.style.width = "20px";
                this.crosshair.style.height = "20px";
                this.crosshair.style.border = "2px solid #0ff";
                this.crosshair.style.borderRadius = "50%";
                this.crosshair.style.boxSizing = "border-box";
                this.crosshair.style.background = "rgba(255, 255, 255, 0.1)";
                this.crosshair.style.filter = "drop-shadow(0 0 6px #0ff)";
                break;

            case "ceborix":
            default:
                this.crosshair.style.width = "12px";
                this.crosshair.style.height = "12px";
                const horizC = document.createElement("div");
                Object.assign(horizC.style, {
                    position: "absolute",
                    width: "12px",
                    height: "4px",
                    background: "#fff",
                    borderRadius: "1px"
                });
                const vertC = document.createElement("div");
                Object.assign(vertC.style, {
                    position: "absolute",
                    width: "4px",
                    height: "12px",
                    background: "#fff",
                    borderRadius: "1px"
                });
                this.crosshair.appendChild(horizC);
                this.crosshair.appendChild(vertC);
                break;
        }
    }

    onEnable() {
        this.createCrosshair();
        this.applyCrosshair(this.options.Style);
    }

    onSettingUpdate() {
        this.applyCrosshair(this.options.Style);
    }

    onDisable() {
        if (this.crosshair) this.crosshair.style.display = "none";
    }
}

 class GhostMode extends Module {
    constructor() {
        super("GhostMode", "Movement", {
            Fade: true,
            Duration: 500
        });
        this.isGhost = false;
    }

    onEnable() {
        const player = hooks.A?.gameWorld?.player;
        if (!player || !player.model) return;
        const model = player.model;

        if (this.settings.Fade) {
            this.fadeModel(model, this.settings.Duration, false);
        } else {
            model.visible = false;
        }

        this.isGhost = true;
        console.log("[GhostMode] Modelo oculto localmente.");
    }

    onDisable() {
        const player = hooks.A?.gameWorld?.player;
        if (!player || !player.model) return;
        const model = player.model;

        if (this.settings.Fade) {
            this.fadeModel(model, this.settings.Duration, true);
        } else {
            model.visible = true;
        }

        this.isGhost = false;
        console.log("[GhostMode] Modelo visível novamente.");
    }

    // Função utilitária para fade in/out do modelo (educacional)
    fadeModel(model, duration = 600, visible = false) {
        if (!model) return;
        const meshes = [];
        model.traverse(obj => {
            if (obj.isMesh) {
                obj.material = obj.material.clone();
                obj.material.transparent = true;
                obj.material.depthWrite = false;
                meshes.push(obj);
            }
        });

        const start = performance.now();
        const from = visible ? 0 : 1;
        const to = visible ? 1 : 0;

        function animate(now) {
            const t = Math.min(1, (now - start) / duration);
            const value = from + (to - from) * t;
            meshes.forEach(m => {
                m.material.opacity = value;
                m.visible = value > 0.01;
            });
            if (t < 1) requestAnimationFrame(animate);
        }

        requestAnimationFrame(animate);
    }
}


class NoFog extends Module {
    constructor() {
        super("NoFog", "Visual", null);
    }

    onRender() {
        try {
            if (hooks.A?.gameWorld?.threeScene?.scene?.fog) {
                Object.assign(
                    hooks.A.gameWorld.threeScene.scene.fog,
                    {
                        near: 9999,
                        far: 10000
                    }
                );
            }
        } catch {}
    }
}

    const module_moduleManager = {
        modules: {},
        addModules: function(...e) {
            for (const t of e) this.modules[t.name] = t
        },
        addModule: function(e) {
            this.modules[e.name] = e
        },
        handleKeyPress: function(e) {
            for (let t in this.modules) {
                let n = this.modules[t];
                n.waitingForBind ? (n.keybind = e, n.waitingForBind = !1) : n.keybind == e && n.toggle()
            }
        },
        init() {
            this.addModules(new ArrayList, new Watermark, new ClickGUI, new Airjump, new Instabreak, new Nuker, new Nuker1, new AdBypass, new Fly, new Speed, new FreeHeadcoins, new FreeMinebucks, new FreeSpins, new Fill, new Chams, new FOVChanger, new Scaffold, new Killaura, new GunModifier, new Disabler, new GhostMode, new Aimbot, new NoClip, new HitAllModule, new TeleportModule, new NoFog, new CustomCrosshair, new HitModule, new KnockbackDisabler), events.on("render", (() => {
                for (let e in this.modules) this.modules[e].isEnabled && this.modules[e].onRender()
            })), events.on("keydown", this.handleKeyPress.bind(this)), events.on("setting.update", (() => {
                for (let e in this.modules) this.modules[e].isEnabled && this.modules[e].onSettingUpdate()
            })), this.modules.Arraylist.enable(), this.modules.Watermark.disable()
        }
    };
    class Minebuns {
        constructor() {
            this.version = "1.0.0", this.init()
        }
        init() {
            setInterval((() => {
                events.emit("render")
            }), 1e3 / 60), document.addEventListener("keydown", (e => {
                events.emit("keydown", e.code)
            })), hooks.A.init(), module_moduleManager.init(), window.hooks = hooks.A
        }
        disable() {}
    }
    const main = new Minebuns
})();