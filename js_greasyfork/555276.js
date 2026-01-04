// ==UserScript==
// @name         划词翻译
// @namespace    https://www.github.com/huanfe1/
// @version      0.0.2
// @author       huanfei
// @description  划词翻译，支持选中英文文本后快速翻译成中文。
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        *://*/*
// @require      https://cdn.jsdelivr.net/npm/react@18.3.1/umd/react.production.min.js
// @require      https://cdn.jsdelivr.net/npm/react-dom@18.3.1/umd/react-dom.production.min.js
// @connect      translate.googleapis.com
// @grant        GM_addElement
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/555276/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.user.js
// @updateURL https://update.greasyfork.org/scripts/555276/%E5%88%92%E8%AF%8D%E7%BF%BB%E8%AF%91.meta.js
// ==/UserScript==

(async function (require$$0, require$$0$1) {
  'use strict';

  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production_min = {};
  /**
   * @license React
   * react-jsx-runtime.production.min.js
   *
   * Copyright (c) Facebook, Inc. and its affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var f = require$$0, k = Symbol.for("react.element"), l = Symbol.for("react.fragment"), m$1 = Object.prototype.hasOwnProperty, n = f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner, p = { key: true, ref: true, __self: true, __source: true };
  function q(c, a, g) {
    var b, d = {}, e = null, h = null;
    void 0 !== g && (e = "" + g);
    void 0 !== a.key && (e = "" + a.key);
    void 0 !== a.ref && (h = a.ref);
    for (b in a) m$1.call(a, b) && !p.hasOwnProperty(b) && (d[b] = a[b]);
    if (c && c.defaultProps) for (b in a = c.defaultProps, a) void 0 === d[b] && (d[b] = a[b]);
    return { $$typeof: k, type: c, key: e, ref: h, props: d, _owner: n.current };
  }
  reactJsxRuntime_production_min.Fragment = l;
  reactJsxRuntime_production_min.jsx = q;
  reactJsxRuntime_production_min.jsxs = q;
  {
    jsxRuntime.exports = reactJsxRuntime_production_min;
  }
  var jsxRuntimeExports = jsxRuntime.exports;
  var _GM_addElement = /* @__PURE__ */ (() => typeof GM_addElement != "undefined" ? GM_addElement : void 0)();
  var _GM_getValue = /* @__PURE__ */ (() => typeof GM_getValue != "undefined" ? GM_getValue : void 0)();
  var _GM_setValue = /* @__PURE__ */ (() => typeof GM_setValue != "undefined" ? GM_setValue : void 0)();
  var _GM_xmlhttpRequest = /* @__PURE__ */ (() => typeof GM_xmlhttpRequest != "undefined" ? GM_xmlhttpRequest : void 0)();
  var _unsafeWindow = /* @__PURE__ */ (() => typeof unsafeWindow != "undefined" ? unsafeWindow : void 0)();
  var createRoot;
  var m = require$$0$1;
  {
    createRoot = m.createRoot;
    m.hydrateRoot;
  }
  let translate = null;
  if ("Translator" in self) {
    const translator = await( _unsafeWindow.Translator.create({
      sourceLanguage: "en",
      targetLanguage: "zh"
    }));
    translate = translator.translate;
  }
  translate = (text) => {
    return new Promise((resolve, reject) => {
      _GM_xmlhttpRequest({
        url: `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=zh-CN&dt=t&q=${encodeURIComponent(text)}`,
        method: "GET",
        onload: (response) => {
          var _a;
          try {
            const data = JSON.parse(response.responseText);
            const translatedText = ((_a = data[0]) == null ? void 0 : _a.map((item) => item[0]).join("")) || text;
            resolve(translatedText);
          } catch (err) {
            reject(new Error("解析翻译结果失败"));
          }
        },
        onerror: () => {
          reject(new Error("翻译请求失败"));
        }
      });
    });
  };
  function Panel({ text, style }) {
    const [translation, setTranslation] = require$$0.useState("");
    const [loading, setLoading] = require$$0.useState(false);
    const [error, setError] = require$$0.useState("");
    const textRef = require$$0.useRef("");
    const [rawTextVisible, setRawTextVisible] = require$$0.useState(_GM_getValue("rawTextVisible", false));
    const panelRef = require$$0.useRef(null);
    const [position, setPosition] = require$$0.useState(null);
    const [isDragging, setIsDragging] = require$$0.useState(false);
    const dragOffsetRef = require$$0.useRef(null);
    require$$0.useEffect(() => {
      if ((style == null ? void 0 : style.left) !== void 0 && (style == null ? void 0 : style.top) !== void 0 && !position) {
        setPosition({ x: Number(style.left), y: Number(style.top) });
      }
    }, [style, position]);
    require$$0.useEffect(() => {
      if (textRef.current === text) return;
      textRef.current = text;
      setTranslation("");
      setError("");
      translateText(text);
    }, [text]);
    require$$0.useEffect(() => _GM_setValue("rawTextVisible", rawTextVisible), [rawTextVisible]);
    const translateText = async (textToTranslate) => {
      if (!textToTranslate.trim()) return;
      setLoading(true);
      setError("");
      try {
        const translatedText = await translate(textToTranslate);
        setTranslation(translatedText);
      } catch (err) {
        setError("翻译失败，请稍后重试");
        console.error("翻译错误:", err);
      } finally {
        setLoading(false);
      }
    };
    const handleCopy = () => {
      navigator.clipboard.writeText(translation || text);
    };
    require$$0.useEffect(() => {
      if (!isDragging) return;
      const handleMouseMove = (e) => {
        if (!dragOffsetRef.current || position === null) return;
        const newX = e.clientX - dragOffsetRef.current.offsetX;
        const newY = e.clientY - dragOffsetRef.current.offsetY;
        setPosition({ x: newX, y: newY });
      };
      const handleMouseUp = () => {
        setIsDragging(false);
        dragOffsetRef.current = null;
      };
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
      };
    }, [isDragging, position]);
    const handleMouseDown = (e) => {
      if (!panelRef.current || position === null) return;
      const rect = panelRef.current.getBoundingClientRect();
      dragOffsetRef.current = {
        offsetX: e.clientX - rect.left,
        offsetY: e.clientY - rect.top
      };
      setIsDragging(true);
      e.preventDefault();
      e.stopPropagation();
    };
    const currentStyle = {
      ...style,
      left: (position == null ? void 0 : position.x) ?? (style == null ? void 0 : style.left),
      top: (position == null ? void 0 : position.y) ?? (style == null ? void 0 : style.top),
      cursor: isDragging ? "grabbing" : "default"
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: panelRef, className: "fixed z-50 w-80 overflow-hidden rounded-lg border bg-white shadow", style: currentStyle, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "p-4", children: loading ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-center gap-2 py-4 text-gray-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "i-mingcute-loading-line animate-spin text-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "翻译中..." })
      ] }) : error ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 py-4 text-red-500", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "i-mingcute-alert-line text-lg" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: error })
      ] }) : translation ? /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-2 text-sm leading-relaxed text-gray-800", children: [
        rawTextVisible && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "opacity-50", children: text }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-lg", children: translation })
      ] }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-4 text-gray-400", children: "等待翻译..." }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex cursor-grab items-center justify-between border-t border-gray-200 bg-gray-100 px-4 py-3 active:cursor-grabbing", onMouseDown: handleMouseDown, children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-xs text-gray-500", children: "Google Translator" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              title: "是否显示原始文本",
              className: "flex items-center text-gray-400 transition-colors hover:text-gray-600",
              onClick: () => setRawTextVisible(!rawTextVisible),
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "i-mingcute-translate-2-line text-lg" })
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              title: "复制文本",
              onClick: handleCopy,
              className: "flex items-center text-gray-400 transition-colors hover:text-gray-600",
              disabled: loading || !translation,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "i-mingcute-copy-line text-lg" })
            }
          )
        ] })
      ] })
    ] });
  }
  function App() {
    const [iconStyle, setIconStyle] = require$$0.useState(void 0);
    const [panelText, setPanelText] = require$$0.useState("");
    const [panelStyle, setPanelStyle] = require$$0.useState(void 0);
    const containerRef = require$$0.useRef(null);
    const iconClick = (e) => {
      setIconStyle(void 0);
      setPanelStyle({ left: e.clientX - 160, top: e.clientY - 50, width: 320 });
    };
    require$$0.useEffect(() => {
      const handleSelection = (e) => {
        if (!containerRef.current) return;
        if (containerRef.current.contains(e.composedPath()[0])) return;
        requestAnimationFrame(() => {
          var _a;
          if (panelStyle) setPanelStyle(void 0);
          const selection = (_a = window.getSelection()) == null ? void 0 : _a.toString();
          if (!selection || !/[a-zA-Z]/.test(selection)) {
            setIconStyle(void 0);
            return;
          }
          setIconStyle({ left: e.clientX + 5, top: e.clientY + 20 });
          setPanelText(selection);
        });
      };
      document.addEventListener("mouseup", handleSelection);
      return () => document.removeEventListener("mouseup", handleSelection);
    }, [iconStyle]);
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { ref: containerRef, children: [
      iconStyle && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          onClick: iconClick,
          className: "fixed flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-gray-200 p-1.5 shadow-sm hover:bg-gray-300",
          style: iconStyle,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "i-mingcute-translate-2-line text-2xl" })
        }
      ),
      panelStyle && /* @__PURE__ */ jsxRuntimeExports.jsx(Panel, { text: panelText, style: panelStyle })
    ] });
  }
  const tailwindcss = `*,:before,:after{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }::backdrop{--tw-border-spacing-x: 0;--tw-border-spacing-y: 0;--tw-translate-x: 0;--tw-translate-y: 0;--tw-rotate: 0;--tw-skew-x: 0;--tw-skew-y: 0;--tw-scale-x: 1;--tw-scale-y: 1;--tw-pan-x: ;--tw-pan-y: ;--tw-pinch-zoom: ;--tw-scroll-snap-strictness: proximity;--tw-gradient-from-position: ;--tw-gradient-via-position: ;--tw-gradient-to-position: ;--tw-ordinal: ;--tw-slashed-zero: ;--tw-numeric-figure: ;--tw-numeric-spacing: ;--tw-numeric-fraction: ;--tw-ring-inset: ;--tw-ring-offset-width: 0px;--tw-ring-offset-color: #fff;--tw-ring-color: rgb(59 130 246 / .5);--tw-ring-offset-shadow: 0 0 #0000;--tw-ring-shadow: 0 0 #0000;--tw-shadow: 0 0 #0000;--tw-shadow-colored: 0 0 #0000;--tw-blur: ;--tw-brightness: ;--tw-contrast: ;--tw-grayscale: ;--tw-hue-rotate: ;--tw-invert: ;--tw-saturate: ;--tw-sepia: ;--tw-drop-shadow: ;--tw-backdrop-blur: ;--tw-backdrop-brightness: ;--tw-backdrop-contrast: ;--tw-backdrop-grayscale: ;--tw-backdrop-hue-rotate: ;--tw-backdrop-invert: ;--tw-backdrop-opacity: ;--tw-backdrop-saturate: ;--tw-backdrop-sepia: ;--tw-contain-size: ;--tw-contain-layout: ;--tw-contain-paint: ;--tw-contain-style: }*,:before,:after{box-sizing:border-box;border-width:0;border-style:solid;border-color:#e5e7eb}:before,:after{--tw-content: ""}html,:host{line-height:1.5;-webkit-text-size-adjust:100%;-moz-tab-size:4;-o-tab-size:4;tab-size:4;font-family:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji",Segoe UI Symbol,"Noto Color Emoji";font-feature-settings:normal;font-variation-settings:normal;-webkit-tap-highlight-color:transparent}body{margin:0;line-height:inherit}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,Liberation Mono,Courier New,monospace;font-feature-settings:normal;font-variation-settings:normal;font-size:1em}small{font-size:80%}sub,sup{font-size:75%;line-height:0;position:relative;vertical-align:baseline}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}button,input,optgroup,select,textarea{font-family:inherit;font-feature-settings:inherit;font-variation-settings:inherit;font-size:100%;font-weight:inherit;line-height:inherit;letter-spacing:inherit;color:inherit;margin:0;padding:0}button,select{text-transform:none}button,input:where([type=button]),input:where([type=reset]),input:where([type=submit]){-webkit-appearance:button;background-color:transparent;background-image:none}:-moz-focusring{outline:auto}:-moz-ui-invalid{box-shadow:none}progress{vertical-align:baseline}::-webkit-inner-spin-button,::-webkit-outer-spin-button{height:auto}[type=search]{-webkit-appearance:textfield;outline-offset:-2px}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-file-upload-button{-webkit-appearance:button;font:inherit}summary{display:list-item}blockquote,dl,dd,h1,h2,h3,h4,h5,h6,hr,figure,p,pre{margin:0}fieldset{margin:0;padding:0}legend{padding:0}ol,ul,menu{list-style:none;margin:0;padding:0}dialog{padding:0}textarea{resize:vertical}input::-moz-placeholder,textarea::-moz-placeholder{opacity:1;color:#9ca3af}input::placeholder,textarea::placeholder{opacity:1;color:#9ca3af}button,[role=button]{cursor:pointer}:disabled{cursor:default}img,svg,video,canvas,audio,iframe,embed,object{display:block;vertical-align:middle}img,video{max-width:100%;height:auto}[hidden]:where(:not([hidden=until-found])){display:none}.i-mingcute-alert-line{display:inline-block;width:1em;height:1em;background-color:currentColor;-webkit-mask-image:var(--svg);mask-image:var(--svg);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cg fill='none'%3E%3Cpath d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='black' d='m13.299 3.148l8.634 14.954a1.5 1.5 0 0 1-1.299 2.25H3.366a1.5 1.5 0 0 1-1.299-2.25l8.634-14.954c.577-1 2.02-1 2.598 0M12 4.898L4.232 18.352h15.536zM12 15a1 1 0 1 1 0 2a1 1 0 0 1 0-2m0-7a1 1 0 0 1 1 1v4a1 1 0 1 1-2 0V9a1 1 0 0 1 1-1'/%3E%3C/g%3E%3C/svg%3E")}.i-mingcute-copy-line{display:inline-block;width:1em;height:1em;background-color:currentColor;-webkit-mask-image:var(--svg);mask-image:var(--svg);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cg fill='none'%3E%3Cpath d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='black' d='M19 2a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-2v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2V4a2 2 0 0 1 2-2zm-4 6H5v12h10zm-5 7a1 1 0 1 1 0 2H8a1 1 0 1 1 0-2zm9-11H9v2h6a2 2 0 0 1 2 2v8h2zm-7 7a1 1 0 0 1 .117 1.993L12 13H8a1 1 0 0 1-.117-1.993L8 11z'/%3E%3C/g%3E%3C/svg%3E")}.i-mingcute-loading-line{display:inline-block;width:1em;height:1em;background-color:currentColor;-webkit-mask-image:var(--svg);mask-image:var(--svg);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cdefs%3E%3ClinearGradient id='SVGz0tT9cEa' x1='50%25' x2='50%25' y1='5.271%25' y2='91.793%25'%3E%3Cstop offset='0%25' stop-color='black'/%3E%3Cstop offset='100%25' stop-color='black' stop-opacity='.55'/%3E%3C/linearGradient%3E%3ClinearGradient id='SVGeV2mEcji' x1='50%25' x2='50%25' y1='8.877%25' y2='90.415%25'%3E%3Cstop offset='0%25' stop-color='black' stop-opacity='0'/%3E%3Cstop offset='100%25' stop-color='black' stop-opacity='.55'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cg fill='none'%3E%3Cpath d='m12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035q-.016-.005-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.017-.018m.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093q.019.005.029-.008l.004-.014l-.034-.614q-.005-.018-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='url(%23SVGz0tT9cEa)' d='M8.886.006a1 1 0 0 1 .22 1.988A8.001 8.001 0 0 0 10 17.944v2c-5.523 0-10-4.476-10-10C0 4.838 3.848.566 8.886.007Z' transform='translate(2 2.055)'/%3E%3Cpath fill='url(%23SVGeV2mEcji)' d='M14.322 1.985a1 1 0 0 1 1.392-.248A9.99 9.99 0 0 1 20 9.945c0 5.523-4.477 10-10 10v-2a8 8 0 0 0 4.57-14.567a1 1 0 0 1-.248-1.393' transform='translate(2 2.055)'/%3E%3C/g%3E%3C/svg%3E")}.i-mingcute-translate-2-line{display:inline-block;width:1em;height:1em;background-color:currentColor;-webkit-mask-image:var(--svg);mask-image:var(--svg);-webkit-mask-repeat:no-repeat;mask-repeat:no-repeat;-webkit-mask-size:100% 100%;mask-size:100% 100%;--svg: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' width='24' height='24'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cpath d='m12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036q-.016-.004-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427q-.004-.016-.016-.018m.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092q.019.005.029-.008l.004-.014l-.034-.614q-.005-.019-.02-.022m-.715.002a.02.02 0 0 0-.027.006l-.006.014l-.034.614q.001.018.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01z'/%3E%3Cpath fill='black' d='M9 3a1 1 0 0 1 .993.883L10 4v1h4a1 1 0 0 1 .116 1.993L14 7h-1.055c-.223 2.032-1.116 3.99-2.545 5.688q.785.683 1.735 1.266l.386.228l2.067-4.592a1 1 0 0 1 1.763-.115l.06.115l4.5 10a1 1 0 0 1-1.77.924l-.053-.104L18.003 18h-5.007l-1.084 2.41a1 1 0 0 1-1.866-.711l.042-.11l1.61-3.576a15.2 15.2 0 0 1-2.7-1.894c-1.287 1.136-2.848 2.098-4.627 2.81a1 1 0 1 1-.743-1.857c1.557-.623 2.887-1.441 3.972-2.382a11.5 11.5 0 0 1-1.978-3.34a1 1 0 0 1 1.873-.702A9.4 9.4 0 0 0 9 11.244c.989-1.227 1.625-2.576 1.877-3.931L10.928 7H4a1 1 0 0 1-.117-1.993L4 5h4V4a1 1 0 0 1 1-1m8.103 13L15.5 12.437L13.898 16z'/%3E%3C/g%3E%3C/svg%3E")}.fixed{position:fixed}.z-50{z-index:50}.flex{display:flex}.w-80{width:20rem}.max-w-xs{max-width:20rem}.transform{transform:translate(var(--tw-translate-x),var(--tw-translate-y)) rotate(var(--tw-rotate)) skew(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y))}@keyframes spin{to{transform:rotate(360deg)}}.animate-spin{animation:spin 1s linear infinite}.cursor-grab{cursor:grab}.cursor-pointer{cursor:pointer}.items-center{align-items:center}.justify-center{justify-content:center}.justify-between{justify-content:space-between}.gap-2{gap:.5rem}.gap-3{gap:.75rem}.space-y-2>:not([hidden])~:not([hidden]){--tw-space-y-reverse: 0;margin-top:calc(.5rem * calc(1 - var(--tw-space-y-reverse)));margin-bottom:calc(.5rem * var(--tw-space-y-reverse))}.overflow-hidden{overflow:hidden}.text-nowrap{text-wrap:nowrap}.rounded-lg{border-radius:.5rem}.rounded-md{border-radius:.375rem}.rounded-xl{border-radius:.75rem}.border{border-width:1px}.border-t{border-top-width:1px}.border-gray-200{--tw-border-opacity: 1;border-color:rgb(229 231 235 / var(--tw-border-opacity, 1))}.border-gray-300{--tw-border-opacity: 1;border-color:rgb(209 213 219 / var(--tw-border-opacity, 1))}.bg-gray-100{--tw-bg-opacity: 1;background-color:rgb(243 244 246 / var(--tw-bg-opacity, 1))}.bg-gray-200{--tw-bg-opacity: 1;background-color:rgb(229 231 235 / var(--tw-bg-opacity, 1))}.bg-gray-900{--tw-bg-opacity: 1;background-color:rgb(17 24 39 / var(--tw-bg-opacity, 1))}.bg-white{--tw-bg-opacity: 1;background-color:rgb(255 255 255 / var(--tw-bg-opacity, 1))}.p-1\\.5{padding:.375rem}.p-4{padding:1rem}.px-3{padding-left:.75rem;padding-right:.75rem}.px-4{padding-left:1rem;padding-right:1rem}.py-2{padding-top:.5rem;padding-bottom:.5rem}.py-3{padding-top:.75rem;padding-bottom:.75rem}.py-4{padding-top:1rem;padding-bottom:1rem}.text-2xl{font-size:1.5rem;line-height:2rem}.text-lg{font-size:1.125rem;line-height:1.75rem}.text-sm{font-size:.875rem;line-height:1.25rem}.text-xs{font-size:.75rem;line-height:1rem}.leading-relaxed{line-height:1.625}.text-gray-400{--tw-text-opacity: 1;color:rgb(156 163 175 / var(--tw-text-opacity, 1))}.text-gray-500{--tw-text-opacity: 1;color:rgb(107 114 128 / var(--tw-text-opacity, 1))}.text-gray-800{--tw-text-opacity: 1;color:rgb(31 41 55 / var(--tw-text-opacity, 1))}.text-red-500{--tw-text-opacity: 1;color:rgb(239 68 68 / var(--tw-text-opacity, 1))}.text-white{--tw-text-opacity: 1;color:rgb(255 255 255 / var(--tw-text-opacity, 1))}.opacity-50{opacity:.5}.shadow{--tw-shadow: 0 1px 3px 0 rgb(0 0 0 / .1), 0 1px 2px -1px rgb(0 0 0 / .1);--tw-shadow-colored: 0 1px 3px 0 var(--tw-shadow-color), 0 1px 2px -1px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-lg{--tw-shadow: 0 10px 15px -3px rgb(0 0 0 / .1), 0 4px 6px -4px rgb(0 0 0 / .1);--tw-shadow-colored: 0 10px 15px -3px var(--tw-shadow-color), 0 4px 6px -4px var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.shadow-sm{--tw-shadow: 0 1px 2px 0 rgb(0 0 0 / .05);--tw-shadow-colored: 0 1px 2px 0 var(--tw-shadow-color);box-shadow:var(--tw-ring-offset-shadow, 0 0 #0000),var(--tw-ring-shadow, 0 0 #0000),var(--tw-shadow)}.transition-colors{transition-property:color,background-color,border-color,text-decoration-color,fill,stroke;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}.transition-opacity{transition-property:opacity;transition-timing-function:cubic-bezier(.4,0,.2,1);transition-duration:.15s}:host{font-family:PingFang SC,HarmonyOS Sans SC,Microsoft YaHei,SimSun,Arial,sans-serif}.hover\\:bg-gray-300:hover{--tw-bg-opacity: 1;background-color:rgb(209 213 219 / var(--tw-bg-opacity, 1))}.hover\\:text-gray-600:hover{--tw-text-opacity: 1;color:rgb(75 85 99 / var(--tw-text-opacity, 1))}.active\\:cursor-grabbing:active{cursor:grabbing}`;
  const sheet = new CSSStyleSheet();
  sheet.replaceSync(tailwindcss);
  const host = _GM_addElement(document.body, "div");
  const shadow = host.attachShadow({ mode: "open" });
  shadow.adoptedStyleSheets = [sheet];
  createRoot(shadow).render(
    /* @__PURE__ */ jsxRuntimeExports.jsx(require$$0.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(App, {}) })
  );

})(React, ReactDOM);