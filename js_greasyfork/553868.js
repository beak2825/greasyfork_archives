// ==UserScript==
// @name         chou-xiang-style
// @namespace    npm/chou-xiang-style
// @version      1.0.1
// @author       MAXLZ
// @description  页面改造
// @license      MIT
// @icon
// @match        http://175.178.29.106/chouxiang.html
// @require      https://cdn.jsdelivr.net/npm/umd-react@19.2.0/dist/react.production.min.js
// @require      data:application/javascript,window.react%3DReact
// @require      https://cdn.jsdelivr.net/npm/umd-react@19.2.0/dist/react-dom.production.min.js
// @require      https://cdn.jsdelivr.net/npm/flv.js@1.6.2/dist/flv.min.js
// @require      https://cdn.jsdelivr.net/npm/clsx@2.1.1/dist/clsx.min.js
// @require      https://cdn.jsdelivr.net/npm/lucide-react@0.546.0/dist/umd/lucide-react.min.js
// @require      https://cdn.jsdelivr.net/npm/jotai@2.15.0/umd/vanilla/internals.production.js
// @require      https://cdn.jsdelivr.net/npm/jotai@2.15.0/umd/vanilla.production.js
// @require      https://cdn.jsdelivr.net/npm/jotai@2.15.0/umd/react.production.js
// @require      https://cdn.jsdelivr.net/npm/jotai@2.15.0/umd/index.production.js
// @require      https://cdn.jsdelivr.net/npm/jotai@2.15.0/umd/vanilla/utils.production.js
// @require      https://cdn.jsdelivr.net/npm/cos-js-sdk-v5@1.10.1/dist/cos-js-sdk-v5.min.js
// @require      https://cdn.jsdelivr.net/npm/react-hook-form@7.65.0/dist/index.umd.js
// @connect      live.kuaishou.com
// @connect      weibo.com
// @connect      live.bilibili.com
// @grant        GM.cookie
// @grant        GM.xmlHttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/553868/chou-xiang-style.user.js
// @updateURL https://update.greasyfork.org/scripts/553868/chou-xiang-style.meta.js
// ==/UserScript==

(function (React, ReactDOM$1, jotai, utils, flv_js, COS, clsx, lucideReact, reactHookForm) {
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

  const React__namespace = _interopNamespaceDefault(React);

  const d=new Set;const importCSS = async e=>{d.has(e)||(d.add(e),(t=>{typeof GM_addStyle=="function"?GM_addStyle(t):document.head.appendChild(document.createElement("style")).append(t);})(e));};

  function getDefaultExportFromCjs(x2) {
    return x2 && x2.__esModule && Object.prototype.hasOwnProperty.call(x2, "default") ? x2["default"] : x2;
  }
  var jsxRuntime = { exports: {} };
  var reactJsxRuntime_production = {};
  /**
   * @license React
   * react-jsx-runtime.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var hasRequiredReactJsxRuntime_production;
  function requireReactJsxRuntime_production() {
    if (hasRequiredReactJsxRuntime_production) return reactJsxRuntime_production;
    hasRequiredReactJsxRuntime_production = 1;
    var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element"), REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
    function jsxProd(type, config2, maybeKey) {
      var key = null;
      void 0 !== maybeKey && (key = "" + maybeKey);
      void 0 !== config2.key && (key = "" + config2.key);
      if ("key" in config2) {
        maybeKey = {};
        for (var propName in config2)
          "key" !== propName && (maybeKey[propName] = config2[propName]);
      } else maybeKey = config2;
      config2 = maybeKey.ref;
      return {
        $$typeof: REACT_ELEMENT_TYPE,
        type,
        key,
        ref: void 0 !== config2 ? config2 : null,
        props: maybeKey
      };
    }
    reactJsxRuntime_production.Fragment = REACT_FRAGMENT_TYPE;
    reactJsxRuntime_production.jsx = jsxProd;
    reactJsxRuntime_production.jsxs = jsxProd;
    return reactJsxRuntime_production;
  }
  var hasRequiredJsxRuntime;
  function requireJsxRuntime() {
    if (hasRequiredJsxRuntime) return jsxRuntime.exports;
    hasRequiredJsxRuntime = 1;
    {
      jsxRuntime.exports = requireReactJsxRuntime_production();
    }
    return jsxRuntime.exports;
  }
  var jsxRuntimeExports = requireJsxRuntime();
  const indexCss = `/*! tailwindcss v4.1.14 | MIT License | https://tailwindcss.com */@layer properties{@supports (((-webkit-hyphens:none)) and (not (margin-trim:inline))) or ((-moz-orient:inline) and (not (color:rgb(from red r g b)))){*,:before,:after,::backdrop{--tw-translate-x:0;--tw-translate-y:0;--tw-translate-z:0;--tw-scale-x:1;--tw-scale-y:1;--tw-scale-z:1;--tw-rotate-x:initial;--tw-rotate-y:initial;--tw-rotate-z:initial;--tw-skew-x:initial;--tw-skew-y:initial;--tw-space-y-reverse:0;--tw-border-style:solid;--tw-gradient-position:initial;--tw-gradient-from:#0000;--tw-gradient-via:#0000;--tw-gradient-to:#0000;--tw-gradient-stops:initial;--tw-gradient-via-stops:initial;--tw-gradient-from-position:0%;--tw-gradient-via-position:50%;--tw-gradient-to-position:100%;--tw-leading:initial;--tw-font-weight:initial;--tw-tracking:initial;--tw-shadow:0 0 #0000;--tw-shadow-color:initial;--tw-shadow-alpha:100%;--tw-inset-shadow:0 0 #0000;--tw-inset-shadow-color:initial;--tw-inset-shadow-alpha:100%;--tw-ring-color:initial;--tw-ring-shadow:0 0 #0000;--tw-inset-ring-color:initial;--tw-inset-ring-shadow:0 0 #0000;--tw-ring-inset:initial;--tw-ring-offset-width:0px;--tw-ring-offset-color:#fff;--tw-ring-offset-shadow:0 0 #0000;--tw-outline-style:solid;--tw-blur:initial;--tw-brightness:initial;--tw-contrast:initial;--tw-grayscale:initial;--tw-hue-rotate:initial;--tw-invert:initial;--tw-opacity:initial;--tw-saturate:initial;--tw-sepia:initial;--tw-drop-shadow:initial;--tw-drop-shadow-color:initial;--tw-drop-shadow-alpha:100%;--tw-drop-shadow-size:initial;--tw-backdrop-blur:initial;--tw-backdrop-brightness:initial;--tw-backdrop-contrast:initial;--tw-backdrop-grayscale:initial;--tw-backdrop-hue-rotate:initial;--tw-backdrop-invert:initial;--tw-backdrop-opacity:initial;--tw-backdrop-saturate:initial;--tw-backdrop-sepia:initial;--tw-duration:initial;--tw-ease:initial;--tw-animation-delay:0s;--tw-animation-direction:normal;--tw-animation-duration:initial;--tw-animation-fill-mode:none;--tw-animation-iteration-count:1;--tw-enter-blur:0;--tw-enter-opacity:1;--tw-enter-rotate:0;--tw-enter-scale:1;--tw-enter-translate-x:0;--tw-enter-translate-y:0;--tw-exit-blur:0;--tw-exit-opacity:1;--tw-exit-rotate:0;--tw-exit-scale:1;--tw-exit-translate-x:0;--tw-exit-translate-y:0}}}@layer theme{:root,:host{--font-sans:ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji";--font-mono:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace;--color-red-400:oklch(70.4% .191 22.216);--color-red-500:oklch(63.7% .237 25.331);--color-amber-500:oklch(76.9% .188 70.08);--color-green-400:oklch(79.2% .209 151.711);--color-green-500:oklch(72.3% .219 149.579);--color-emerald-400:oklch(76.5% .177 163.223);--color-blue-500:oklch(62.3% .214 259.815);--color-blue-600:oklch(54.6% .245 262.881);--color-rose-400:oklch(71.2% .194 13.428);--color-gray-200:oklch(92.8% .006 264.531);--color-gray-600:oklch(44.6% .03 256.802);--color-black:#000;--color-white:#fff;--spacing:.25rem;--container-2xs:18rem;--container-sm:24rem;--container-lg:32rem;--text-xs:.75rem;--text-xs--line-height:calc(1/.75);--text-sm:.875rem;--text-sm--line-height:calc(1.25/.875);--text-base:1rem;--text-base--line-height: 1.5 ;--text-lg:1.125rem;--text-lg--line-height:calc(1.75/1.125);--text-2xl:1.5rem;--text-2xl--line-height:calc(2/1.5);--font-weight-normal:400;--font-weight-medium:500;--font-weight-semibold:600;--tracking-tight:-.025em;--tracking-widest:.1em;--leading-snug:1.375;--leading-normal:1.5;--leading-relaxed:1.625;--radius-xs:.125rem;--radius-2xl:1rem;--ease-in-out:cubic-bezier(.4,0,.2,1);--animate-spin:spin 1s linear infinite;--animate-pulse:pulse 2s cubic-bezier(.4,0,.6,1)infinite;--animate-bounce:bounce 1s infinite;--blur-md:12px;--default-transition-duration:.15s;--default-transition-timing-function:cubic-bezier(.4,0,.2,1);--default-font-family:var(--font-sans);--default-mono-font-family:var(--font-mono);--color-background:var(--background)}}@layer base{*,:after,:before,::backdrop{box-sizing:border-box;border:0 solid;margin:0;padding:0}::file-selector-button{box-sizing:border-box;border:0 solid;margin:0;padding:0}html,:host{-webkit-text-size-adjust:100%;tab-size:4;line-height:1.5;font-family:var(--default-font-family,ui-sans-serif,system-ui,sans-serif,"Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji");font-feature-settings:var(--default-font-feature-settings,normal);font-variation-settings:var(--default-font-variation-settings,normal);-webkit-tap-highlight-color:transparent}hr{height:0;color:inherit;border-top-width:1px}abbr:where([title]){-webkit-text-decoration:underline dotted;text-decoration:underline dotted}h1,h2,h3,h4,h5,h6{font-size:inherit;font-weight:inherit}a{color:inherit;-webkit-text-decoration:inherit;text-decoration:inherit}b,strong{font-weight:bolder}code,kbd,samp,pre{font-family:var(--default-mono-font-family,ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace);font-feature-settings:var(--default-mono-font-feature-settings,normal);font-variation-settings:var(--default-mono-font-variation-settings,normal);font-size:1em}small{font-size:80%}sub,sup{vertical-align:baseline;font-size:75%;line-height:0;position:relative}sub{bottom:-.25em}sup{top:-.5em}table{text-indent:0;border-color:inherit;border-collapse:collapse}:-moz-focusring{outline:auto}progress{vertical-align:baseline}summary{display:list-item}ol,ul,menu{list-style:none}img,svg,video,canvas,audio,iframe,embed,object{vertical-align:middle;display:block}img,video{max-width:100%;height:auto}button,input,select,optgroup,textarea{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}::file-selector-button{font:inherit;font-feature-settings:inherit;font-variation-settings:inherit;letter-spacing:inherit;color:inherit;opacity:1;background-color:#0000;border-radius:0}:where(select:is([multiple],[size])) optgroup{font-weight:bolder}:where(select:is([multiple],[size])) optgroup option{padding-inline-start:20px}::file-selector-button{margin-inline-end:4px}::placeholder{opacity:1}@supports (not ((-webkit-appearance:-apple-pay-button))) or (contain-intrinsic-size:1px){::placeholder{color:currentColor}@supports (color:color-mix(in lab,red,red)){::placeholder{color:color-mix(in oklab,currentcolor 50%,transparent)}}}textarea{resize:vertical}::-webkit-search-decoration{-webkit-appearance:none}::-webkit-date-and-time-value{min-height:1lh;text-align:inherit}::-webkit-datetime-edit{display:inline-flex}::-webkit-datetime-edit-fields-wrapper{padding:0}::-webkit-datetime-edit{padding-block:0}::-webkit-datetime-edit-year-field{padding-block:0}::-webkit-datetime-edit-month-field{padding-block:0}::-webkit-datetime-edit-day-field{padding-block:0}::-webkit-datetime-edit-hour-field{padding-block:0}::-webkit-datetime-edit-minute-field{padding-block:0}::-webkit-datetime-edit-second-field{padding-block:0}::-webkit-datetime-edit-millisecond-field{padding-block:0}::-webkit-datetime-edit-meridiem-field{padding-block:0}::-webkit-calendar-picker-indicator{line-height:1}:-moz-ui-invalid{box-shadow:none}button,input:where([type=button],[type=reset],[type=submit]){appearance:button}::file-selector-button{appearance:button}::-webkit-inner-spin-button{height:auto}::-webkit-outer-spin-button{height:auto}[hidden]:where(:not([hidden=until-found])){display:none!important}*{border-color:var(--border);outline-color:var(--ring)}@supports (color:color-mix(in lab,red,red)){*{outline-color:color-mix(in oklab,var(--ring)50%,transparent)}}body{background-color:var(--background);color:var(--foreground)}button:not(:disabled),[role=button]:not(:disabled){cursor:pointer}}@layer components;@layer utilities{.\\@container\\/card-header{container:card-header/inline-size}.\\@container\\/field-group{container:field-group/inline-size}.pointer-events-none{pointer-events:none}.invisible{visibility:hidden}.visible{visibility:visible}.sr-only{clip-path:inset(50%);white-space:nowrap;border-width:0;width:1px;height:1px;margin:-1px;padding:0;position:absolute;overflow:hidden}.absolute{position:absolute}.fixed{position:fixed}.relative{position:relative}.inset-0{inset:calc(var(--spacing)*0)}.top-0{top:calc(var(--spacing)*0)}.top-1\\/2{top:50%}.top-4{top:calc(var(--spacing)*4)}.top-8{top:calc(var(--spacing)*8)}.top-18{top:calc(var(--spacing)*18)}.top-\\[20px\\]{top:20px}.top-\\[50\\%\\]{top:50%}.-right-0,.right-0{right:calc(var(--spacing)*0)}.right-2\\.5{right:calc(var(--spacing)*2.5)}.right-3{right:calc(var(--spacing)*3)}.right-4{right:calc(var(--spacing)*4)}.-bottom-0\\.5{bottom:calc(var(--spacing)*-.5)}.bottom-2{bottom:calc(var(--spacing)*2)}.left-0{left:calc(var(--spacing)*0)}.left-1\\/2{left:50%}.left-2{left:calc(var(--spacing)*2)}.left-4{left:calc(var(--spacing)*4)}.left-\\[20px\\]{left:20px}.left-\\[50\\%\\]{left:50%}.isolate{isolation:isolate}.z-10{z-index:10}.z-50{z-index:50}.col-start-2{grid-column-start:2}.row-span-2{grid-row:span 2/span 2}.row-start-1{grid-row-start:1}.container{width:100%}@media (min-width:40rem){.container{max-width:40rem}}@media (min-width:48rem){.container{max-width:48rem}}@media (min-width:64rem){.container{max-width:64rem}}@media (min-width:80rem){.container{max-width:80rem}}@media (min-width:96rem){.container{max-width:96rem}}.\\!m-0{margin:calc(var(--spacing)*0)!important}.-mx-1{margin-inline:calc(var(--spacing)*-1)}.mx-4{margin-inline:calc(var(--spacing)*4)}.mx-6{margin-inline:calc(var(--spacing)*6)}.mx-auto{margin-inline:auto}.-my-2{margin-block:calc(var(--spacing)*-2)}.my-1{margin-block:calc(var(--spacing)*1)}.mt-2{margin-top:calc(var(--spacing)*2)}.mb-2{margin-bottom:calc(var(--spacing)*2)}.mb-3{margin-bottom:calc(var(--spacing)*3)}.ml-2{margin-left:calc(var(--spacing)*2)}.ml-4{margin-left:calc(var(--spacing)*4)}.ml-6{margin-left:calc(var(--spacing)*6)}.ml-auto{margin-left:auto}.block{display:block}.flex{display:flex}.grid{display:grid}.hidden{display:none}.inline{display:inline}.inline-block{display:inline-block}.inline-flex{display:inline-flex}.field-sizing-content{field-sizing:content}.size-2{width:calc(var(--spacing)*2);height:calc(var(--spacing)*2)}.size-2\\.5{width:calc(var(--spacing)*2.5);height:calc(var(--spacing)*2.5)}.size-3\\.5{width:calc(var(--spacing)*3.5);height:calc(var(--spacing)*3.5)}.size-4{width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}.size-4\\.5{width:calc(var(--spacing)*4.5);height:calc(var(--spacing)*4.5)}.size-5{width:calc(var(--spacing)*5);height:calc(var(--spacing)*5)}.size-6{width:calc(var(--spacing)*6);height:calc(var(--spacing)*6)}.size-7{width:calc(var(--spacing)*7);height:calc(var(--spacing)*7)}.size-8{width:calc(var(--spacing)*8);height:calc(var(--spacing)*8)}.size-9{width:calc(var(--spacing)*9);height:calc(var(--spacing)*9)}.size-10{width:calc(var(--spacing)*10);height:calc(var(--spacing)*10)}.size-13{width:calc(var(--spacing)*13);height:calc(var(--spacing)*13)}.size-\\[1\\.2rem\\]{width:1.2rem;height:1.2rem}.size-full{width:100%;height:100%}.h-2\\.5{height:calc(var(--spacing)*2.5)}.h-4\\.5{height:calc(var(--spacing)*4.5)}.h-5{height:calc(var(--spacing)*5)}.h-8{height:calc(var(--spacing)*8)}.h-9{height:calc(var(--spacing)*9)}.h-10{height:calc(var(--spacing)*10)}.h-12{height:calc(var(--spacing)*12)}.h-40{height:calc(var(--spacing)*40)}.h-80{height:calc(var(--spacing)*80)}.h-\\[1\\.15rem\\]{height:1.15rem}.h-\\[400px\\]{height:400px}.h-\\[calc\\(100\\%-1px\\)\\]{height:calc(100% - 1px)}.h-full{height:100%}.h-px{height:1px}.h-screen{height:100vh}.max-h-\\(--radix-dropdown-menu-content-available-height\\){max-height:var(--radix-dropdown-menu-content-available-height)}.max-h-4\\/5{max-height:80%}.max-h-20{max-height:calc(var(--spacing)*20)}.min-h-0{min-height:calc(var(--spacing)*0)}.min-h-5{min-height:calc(var(--spacing)*5)}.min-h-15{min-height:calc(var(--spacing)*15)}.min-h-16{min-height:calc(var(--spacing)*16)}.w-2\\.5{width:calc(var(--spacing)*2.5)}.w-2xs{width:var(--container-2xs)}.w-8{width:calc(var(--spacing)*8)}.w-15{width:calc(var(--spacing)*15)}.w-20{width:calc(var(--spacing)*20)}.w-26{width:calc(var(--spacing)*26)}.w-40{width:calc(var(--spacing)*40)}.w-50{width:calc(var(--spacing)*50)}.w-72{width:calc(var(--spacing)*72)}.w-88{width:calc(var(--spacing)*88)}.w-96{width:calc(var(--spacing)*96)}.w-\\[600px\\]{width:600px}.w-fit{width:fit-content}.w-full{width:100%}.w-screen{width:100vw}.max-w-4\\/5{max-width:80%}.max-w-\\[calc\\(100\\%-2rem\\)\\]{max-width:calc(100% - 2rem)}.max-w-sm{max-width:var(--container-sm)}.min-w-0{min-width:calc(var(--spacing)*0)}.min-w-\\[8rem\\]{min-width:8rem}.flex-1{flex:1}.shrink-0{flex-shrink:0}.origin-\\(--radix-dropdown-menu-content-transform-origin\\){transform-origin:var(--radix-dropdown-menu-content-transform-origin)}.origin-\\(--radix-popover-content-transform-origin\\){transform-origin:var(--radix-popover-content-transform-origin)}.origin-\\(--radix-tooltip-content-transform-origin\\){transform-origin:var(--radix-tooltip-content-transform-origin)}.-translate-x-1\\/2{--tw-translate-x: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-x-\\[-50\\%\\]{--tw-translate-x:-50%;translate:var(--tw-translate-x)var(--tw-translate-y)}.-translate-y-1\\/2{--tw-translate-y: -50% ;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-1\\/6{--tw-translate-y:calc(1/6*100%);translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-\\[-50\\%\\]{--tw-translate-y:-50%;translate:var(--tw-translate-x)var(--tw-translate-y)}.translate-y-\\[calc\\(-50\\%_-_2px\\)\\]{--tw-translate-y: calc(-50% - 2px) ;translate:var(--tw-translate-x)var(--tw-translate-y)}.scale-0{--tw-scale-x:0%;--tw-scale-y:0%;--tw-scale-z:0%;scale:var(--tw-scale-x)var(--tw-scale-y)}.scale-90{--tw-scale-x:90%;--tw-scale-y:90%;--tw-scale-z:90%;scale:var(--tw-scale-x)var(--tw-scale-y)}.scale-100{--tw-scale-x:100%;--tw-scale-y:100%;--tw-scale-z:100%;scale:var(--tw-scale-x)var(--tw-scale-y)}.rotate-0{rotate:none}.rotate-45{rotate:45deg}.rotate-90{rotate:90deg}.transform{transform:var(--tw-rotate-x,)var(--tw-rotate-y,)var(--tw-rotate-z,)var(--tw-skew-x,)var(--tw-skew-y,)}.animate-bounce{animation:var(--animate-bounce)}.animate-in{animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.animate-pulse{animation:var(--animate-pulse)}.animate-spin{animation:var(--animate-spin)}.cursor-default{cursor:default}.cursor-pointer{cursor:pointer}.touch-none{touch-action:none}.resize{resize:both}.resize-none{resize:none}.list-disc{list-style-type:disc}.auto-rows-min{grid-auto-rows:min-content}.grid-cols-1{grid-template-columns:repeat(1,minmax(0,1fr))}.grid-cols-7{grid-template-columns:repeat(7,minmax(0,1fr))}.grid-cols-\\[1fr_auto_auto\\]{grid-template-columns:1fr auto auto}.grid-rows-\\[auto_auto\\]{grid-template-rows:auto auto}.flex-col{flex-direction:column}.flex-col-reverse{flex-direction:column-reverse}.flex-row{flex-direction:row}.flex-nowrap{flex-wrap:nowrap}.items-center{align-items:center}.items-end{align-items:flex-end}.items-start{align-items:flex-start}.items-stretch{align-items:stretch}.justify-between{justify-content:space-between}.justify-center{justify-content:center}.justify-stretch{justify-content:stretch}.justify-items-center{justify-items:center}.gap-0{gap:calc(var(--spacing)*0)}.gap-0\\.5{gap:calc(var(--spacing)*.5)}.gap-1{gap:calc(var(--spacing)*1)}.gap-1\\.5{gap:calc(var(--spacing)*1.5)}.gap-2{gap:calc(var(--spacing)*2)}.gap-3{gap:calc(var(--spacing)*3)}.gap-4{gap:calc(var(--spacing)*4)}.gap-5{gap:calc(var(--spacing)*5)}.gap-6{gap:calc(var(--spacing)*6)}.gap-7{gap:calc(var(--spacing)*7)}:where(.space-y-4>:not(:last-child)){--tw-space-y-reverse:0;margin-block-start:calc(calc(var(--spacing)*4)*var(--tw-space-y-reverse));margin-block-end:calc(calc(var(--spacing)*4)*calc(1 - var(--tw-space-y-reverse)))}.self-center{align-self:center}.self-start{align-self:flex-start}.self-stretch{align-self:stretch}.justify-self-end{justify-self:flex-end}.truncate{text-overflow:ellipsis;white-space:nowrap;overflow:hidden}.overflow-hidden{overflow:hidden}.overflow-x-hidden{overflow-x:hidden}.overflow-y-auto{overflow-y:auto}.rounded{border-radius:.25rem}.rounded-2xl{border-radius:var(--radius-2xl)}.rounded-\\[2px\\]{border-radius:2px}.rounded-\\[inherit\\]{border-radius:inherit}.rounded-full{border-radius:3.40282e38px}.rounded-lg{border-radius:var(--radius)}.rounded-md{border-radius:calc(var(--radius) - 2px)}.rounded-sm{border-radius:calc(var(--radius) - 4px)}.rounded-xl{border-radius:calc(var(--radius) + 4px)}.rounded-xs{border-radius:var(--radius-xs)}.border{border-style:var(--tw-border-style);border-width:1px}.border-0{border-style:var(--tw-border-style);border-width:0}.border-t{border-top-style:var(--tw-border-style);border-top-width:1px}.border-t-2{border-top-style:var(--tw-border-style);border-top-width:2px}.border-b{border-bottom-style:var(--tw-border-style);border-bottom-width:1px}.border-l{border-left-style:var(--tw-border-style);border-left-width:1px}.border-dashed{--tw-border-style:dashed;border-style:dashed}.border-border{border-color:var(--border)}.border-input{border-color:var(--input)}.border-transparent{border-color:#0000}.border-white\\/20{border-color:#fff3}@supports (color:color-mix(in lab,red,red)){.border-white\\/20{border-color:color-mix(in oklab,var(--color-white)20%,transparent)}}.border-t-transparent{border-top-color:#0000}.border-l-transparent{border-left-color:#0000}.bg-accent{background-color:var(--accent)}.bg-background{background-color:var(--background)}.bg-black\\/50{background-color:#00000080}@supports (color:color-mix(in lab,red,red)){.bg-black\\/50{background-color:color-mix(in oklab,var(--color-black)50%,transparent)}}.bg-black\\/70{background-color:#000000b3}@supports (color:color-mix(in lab,red,red)){.bg-black\\/70{background-color:color-mix(in oklab,var(--color-black)70%,transparent)}}.bg-border{background-color:var(--border)}.bg-card{background-color:var(--card)}.bg-destructive{background-color:var(--destructive)}.bg-foreground{background-color:var(--foreground)}.bg-gray-200{background-color:var(--color-gray-200)}.bg-input{background-color:var(--input)}.bg-muted{background-color:var(--muted)}.bg-popover{background-color:var(--popover)}.bg-primary,.bg-primary\\/35{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.bg-primary\\/35{background-color:color-mix(in oklab,var(--primary)35%,transparent)}}.bg-primary\\/90{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.bg-primary\\/90{background-color:color-mix(in oklab,var(--primary)90%,transparent)}}.bg-secondary{background-color:var(--secondary)}.bg-transparent{background-color:#0000}.bg-gradient-to-r{--tw-gradient-position:to right in oklab;background-image:linear-gradient(var(--tw-gradient-stops))}.from-green-400\\/70{--tw-gradient-from:#05df72b3}@supports (color:color-mix(in lab,red,red)){.from-green-400\\/70{--tw-gradient-from:color-mix(in oklab,var(--color-green-400)70%,transparent)}}.from-green-400\\/70{--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.from-red-400\\/70{--tw-gradient-from:#ff6568b3}@supports (color:color-mix(in lab,red,red)){.from-red-400\\/70{--tw-gradient-from:color-mix(in oklab,var(--color-red-400)70%,transparent)}}.from-red-400\\/70{--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-emerald-400\\/60{--tw-gradient-to:#00d29499}@supports (color:color-mix(in lab,red,red)){.to-emerald-400\\/60{--tw-gradient-to:color-mix(in oklab,var(--color-emerald-400)60%,transparent)}}.to-emerald-400\\/60{--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.to-rose-400\\/60{--tw-gradient-to:#ff667f99}@supports (color:color-mix(in lab,red,red)){.to-rose-400\\/60{--tw-gradient-to:color-mix(in oklab,var(--color-rose-400)60%,transparent)}}.to-rose-400\\/60{--tw-gradient-stops:var(--tw-gradient-via-stops,var(--tw-gradient-position),var(--tw-gradient-from)var(--tw-gradient-from-position),var(--tw-gradient-to)var(--tw-gradient-to-position))}.fill-amber-500{fill:var(--color-amber-500)}.fill-blue-500{fill:var(--color-blue-500)}.fill-current{fill:currentColor}.fill-foreground{fill:var(--foreground)}.fill-green-500{fill:var(--color-green-500)}.fill-red-500{fill:var(--color-red-500)}.object-contain{object-fit:contain}.p-0{padding:calc(var(--spacing)*0)}.p-0\\.5{padding:calc(var(--spacing)*.5)}.p-1{padding:calc(var(--spacing)*1)}.p-2{padding:calc(var(--spacing)*2)}.p-3{padding:calc(var(--spacing)*3)}.p-4{padding:calc(var(--spacing)*4)}.p-6{padding:calc(var(--spacing)*6)}.p-\\[3px\\]{padding:3px}.p-px{padding:1px}.px-2{padding-inline:calc(var(--spacing)*2)}.px-3{padding-inline:calc(var(--spacing)*3)}.px-3\\.5{padding-inline:calc(var(--spacing)*3.5)}.px-4{padding-inline:calc(var(--spacing)*4)}.px-6{padding-inline:calc(var(--spacing)*6)}.px-14{padding-inline:calc(var(--spacing)*14)}.py-0{padding-block:calc(var(--spacing)*0)}.py-0\\.5{padding-block:calc(var(--spacing)*.5)}.py-1{padding-block:calc(var(--spacing)*1)}.py-1\\.5{padding-block:calc(var(--spacing)*1.5)}.py-2{padding-block:calc(var(--spacing)*2)}.py-3{padding-block:calc(var(--spacing)*3)}.py-3\\.5{padding-block:calc(var(--spacing)*3.5)}.py-6{padding-block:calc(var(--spacing)*6)}.py-8{padding-block:calc(var(--spacing)*8)}.pt-0{padding-top:calc(var(--spacing)*0)}.pr-2{padding-right:calc(var(--spacing)*2)}.pb-4{padding-bottom:calc(var(--spacing)*4)}.pl-8{padding-left:calc(var(--spacing)*8)}.text-center{text-align:center}.align-bottom{vertical-align:bottom}.align-top{vertical-align:top}.text-2xl{font-size:var(--text-2xl);line-height:var(--tw-leading,var(--text-2xl--line-height))}.text-base{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.text-lg{font-size:var(--text-lg);line-height:var(--tw-leading,var(--text-lg--line-height))}.text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.text-sm\\/relaxed{font-size:var(--text-sm);line-height:var(--leading-relaxed)}.text-xs{font-size:var(--text-xs);line-height:var(--tw-leading,var(--text-xs--line-height))}.leading-5{--tw-leading:calc(var(--spacing)*5);line-height:calc(var(--spacing)*5)}.leading-none{--tw-leading:1;line-height:1}.leading-normal{--tw-leading:var(--leading-normal);line-height:var(--leading-normal)}.leading-snug{--tw-leading:var(--leading-snug);line-height:var(--leading-snug)}.font-medium{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.font-normal{--tw-font-weight:var(--font-weight-normal);font-weight:var(--font-weight-normal)}.font-semibold{--tw-font-weight:var(--font-weight-semibold);font-weight:var(--font-weight-semibold)}.tracking-tight{--tw-tracking:var(--tracking-tight);letter-spacing:var(--tracking-tight)}.tracking-widest{--tw-tracking:var(--tracking-widest);letter-spacing:var(--tracking-widest)}.text-balance{text-wrap:balance}.break-all{word-break:break-all}.break-keep{word-break:keep-all}.whitespace-nowrap{white-space:nowrap}.text-background{color:var(--background)}.text-black\\/40{color:#0006}@supports (color:color-mix(in lab,red,red)){.text-black\\/40{color:color-mix(in oklab,var(--color-black)40%,transparent)}}.text-blue-600{color:var(--color-blue-600)}.text-card-foreground{color:var(--card-foreground)}.text-destructive{color:var(--destructive)}.text-foreground{color:var(--foreground)}.text-gray-200{color:var(--color-gray-200)}.text-gray-600{color:var(--color-gray-600)}.text-muted-foreground{color:var(--muted-foreground)}.text-popover-foreground{color:var(--popover-foreground)}.text-primary{color:var(--primary)}.text-primary-foreground{color:var(--primary-foreground)}.text-secondary-foreground{color:var(--secondary-foreground)}.text-white{color:var(--color-white)}.underline-offset-4{text-underline-offset:4px}.opacity-70{opacity:.7}.shadow-lg{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-md{--tw-shadow:0 4px 6px -1px var(--tw-shadow-color,#0000001a),0 2px 4px -2px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-none{--tw-shadow:0 0 #0000;box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-sm{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.shadow-xs{--tw-shadow:0 1px 2px 0 var(--tw-shadow-color,#0000000d);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-0{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(0px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.ring-offset-background{--tw-ring-offset-color:var(--background)}.outline-hidden{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.outline-hidden{outline-offset:2px;outline:2px solid #0000}}.outline{outline-style:var(--tw-outline-style);outline-width:1px}.grayscale{--tw-grayscale:grayscale(100%);filter:var(--tw-blur,)var(--tw-brightness,)var(--tw-contrast,)var(--tw-grayscale,)var(--tw-hue-rotate,)var(--tw-invert,)var(--tw-saturate,)var(--tw-sepia,)var(--tw-drop-shadow,)}.backdrop-blur-md{--tw-backdrop-blur:blur(var(--blur-md));-webkit-backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,);backdrop-filter:var(--tw-backdrop-blur,)var(--tw-backdrop-brightness,)var(--tw-backdrop-contrast,)var(--tw-backdrop-grayscale,)var(--tw-backdrop-hue-rotate,)var(--tw-backdrop-invert,)var(--tw-backdrop-opacity,)var(--tw-backdrop-saturate,)var(--tw-backdrop-sepia,)}.transition{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to,opacity,box-shadow,transform,translate,scale,rotate,filter,-webkit-backdrop-filter,backdrop-filter,display,content-visibility,overlay,pointer-events;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-\\[color\\,box-shadow\\]{transition-property:color,box-shadow;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-all{transition-property:all;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-colors{transition-property:color,background-color,border-color,outline-color,text-decoration-color,fill,stroke,--tw-gradient-from,--tw-gradient-via,--tw-gradient-to;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-opacity{transition-property:opacity;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.transition-transform{transition-property:transform,translate,scale,rotate;transition-timing-function:var(--tw-ease,var(--default-transition-timing-function));transition-duration:var(--tw-duration,var(--default-transition-duration))}.duration-200{--tw-duration:.2s;transition-duration:.2s}.ease-in-out{--tw-ease:var(--ease-in-out);transition-timing-function:var(--ease-in-out)}.fade-in-0{--tw-enter-opacity:0}.outline-none{--tw-outline-style:none;outline-style:none}.select-none{-webkit-user-select:none;user-select:none}.zoom-in-95{--tw-enter-scale:.95}.group-focus-within\\:bg-primary:is(:where(.group):focus-within *){background-color:var(--primary)}.group-has-\\[\\[data-orientation\\=horizontal\\]\\]\\/field\\:text-balance:is(:where(.group\\/field):has([data-orientation=horizontal]) *){text-wrap:balance}.group-data-\\[disabled\\=true\\]\\:pointer-events-none:is(:where(.group)[data-disabled=true] *){pointer-events:none}.group-data-\\[disabled\\=true\\]\\:opacity-50:is(:where(.group)[data-disabled=true] *),.group-data-\\[disabled\\=true\\]\\/field\\:opacity-50:is(:where(.group\\/field)[data-disabled=true] *){opacity:.5}.group-data-\\[variant\\=outline\\]\\/field-group\\:-mb-2:is(:where(.group\\/field-group)[data-variant=outline] *){margin-bottom:calc(var(--spacing)*-2)}.peer-disabled\\:cursor-not-allowed:is(:where(.peer):disabled~*){cursor:not-allowed}.peer-disabled\\:opacity-50:is(:where(.peer):disabled~*){opacity:.5}.selection\\:bg-primary ::selection{background-color:var(--primary)}.selection\\:bg-primary::selection{background-color:var(--primary)}.selection\\:text-primary-foreground ::selection{color:var(--primary-foreground)}.selection\\:text-primary-foreground::selection{color:var(--primary-foreground)}.file\\:inline-flex::file-selector-button{display:inline-flex}.file\\:h-7::file-selector-button{height:calc(var(--spacing)*7)}.file\\:border-0::file-selector-button{border-style:var(--tw-border-style);border-width:0}.file\\:bg-transparent::file-selector-button{background-color:#0000}.file\\:text-sm::file-selector-button{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.file\\:font-medium::file-selector-button{--tw-font-weight:var(--font-weight-medium);font-weight:var(--font-weight-medium)}.file\\:text-foreground::file-selector-button{color:var(--foreground)}.placeholder\\:text-muted-foreground::placeholder{color:var(--muted-foreground)}.last\\:mt-0:last-child{margin-top:calc(var(--spacing)*0)}.focus-within\\:border-primary:focus-within{border-color:var(--primary)}@media (hover:hover){.hover\\:scale-110:hover{--tw-scale-x:110%;--tw-scale-y:110%;--tw-scale-z:110%;scale:var(--tw-scale-x)var(--tw-scale-y)}.hover\\:bg-accent:hover{background-color:var(--accent)}.hover\\:bg-destructive\\/90:hover{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-destructive\\/90:hover{background-color:color-mix(in oklab,var(--destructive)90%,transparent)}}.hover\\:bg-primary\\/90:hover{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-primary\\/90:hover{background-color:color-mix(in oklab,var(--primary)90%,transparent)}}.hover\\:bg-secondary:hover,.hover\\:bg-secondary\\/80:hover{background-color:var(--secondary)}@supports (color:color-mix(in lab,red,red)){.hover\\:bg-secondary\\/80:hover{background-color:color-mix(in oklab,var(--secondary)80%,transparent)}}.hover\\:text-accent-foreground:hover{color:var(--accent-foreground)}.hover\\:text-primary:hover{color:var(--primary)}.hover\\:no-underline:hover{text-decoration-line:none}.hover\\:underline:hover{text-decoration-line:underline}.hover\\:opacity-100:hover{opacity:1}.hover\\:shadow-lg:hover{--tw-shadow:0 10px 15px -3px var(--tw-shadow-color,#0000001a),0 4px 6px -4px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}}.focus\\:bg-accent:focus{background-color:var(--accent)}.focus\\:text-accent-foreground:focus{color:var(--accent-foreground)}.focus\\:ring-2:focus{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(2px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus\\:ring-ring:focus{--tw-ring-color:var(--ring)}.focus\\:ring-offset-2:focus{--tw-ring-offset-width:2px;--tw-ring-offset-shadow:var(--tw-ring-inset,)0 0 0 var(--tw-ring-offset-width)var(--tw-ring-offset-color)}.focus\\:outline-hidden:focus{--tw-outline-style:none;outline-style:none}@media (forced-colors:active){.focus\\:outline-hidden:focus{outline-offset:2px;outline:2px solid #0000}}.focus-visible\\:border-ring:focus-visible{border-color:var(--ring)}.focus-visible\\:ring-0:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(0px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-visible\\:ring-\\[3px\\]:focus-visible{--tw-ring-shadow:var(--tw-ring-inset,)0 0 0 calc(3px + var(--tw-ring-offset-width))var(--tw-ring-color,currentcolor);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.focus-visible\\:ring-destructive\\/20:focus-visible{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.focus-visible\\:ring-destructive\\/20:focus-visible{--tw-ring-color:color-mix(in oklab,var(--destructive)20%,transparent)}}.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:var(--ring)}@supports (color:color-mix(in lab,red,red)){.focus-visible\\:ring-ring\\/50:focus-visible{--tw-ring-color:color-mix(in oklab,var(--ring)50%,transparent)}}.focus-visible\\:outline-1:focus-visible{outline-style:var(--tw-outline-style);outline-width:1px}.focus-visible\\:outline-ring:focus-visible{outline-color:var(--ring)}.disabled\\:pointer-events-none:disabled{pointer-events:none}.disabled\\:cursor-not-allowed:disabled{cursor:not-allowed}.disabled\\:opacity-50:disabled{opacity:.5}.has-data-\\[slot\\=card-action\\]\\:grid-cols-\\[1fr_auto\\]:has([data-slot=card-action]){grid-template-columns:1fr auto}.has-data-\\[state\\=checked\\]\\:border-primary:has([data-state=checked]){border-color:var(--primary)}.has-data-\\[state\\=checked\\]\\:bg-primary\\/5:has([data-state=checked]){background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.has-data-\\[state\\=checked\\]\\:bg-primary\\/5:has([data-state=checked]){background-color:color-mix(in oklab,var(--primary)5%,transparent)}}.has-\\[\\>\\[data-slot\\=button-group\\]\\]\\:gap-2:has(>[data-slot=button-group]){gap:calc(var(--spacing)*2)}.has-\\[\\>\\[data-slot\\=checkbox-group\\]\\]\\:gap-3:has(>[data-slot=checkbox-group]){gap:calc(var(--spacing)*3)}.has-\\[\\>\\[data-slot\\=field-content\\]\\]\\:items-start:has(>[data-slot=field-content]){align-items:flex-start}.has-\\[\\>\\[data-slot\\=field\\]\\]\\:w-full:has(>[data-slot=field]){width:100%}.has-\\[\\>\\[data-slot\\=field\\]\\]\\:flex-col:has(>[data-slot=field]){flex-direction:column}.has-\\[\\>\\[data-slot\\=field\\]\\]\\:rounded-md:has(>[data-slot=field]){border-radius:calc(var(--radius) - 2px)}.has-\\[\\>\\[data-slot\\=field\\]\\]\\:border:has(>[data-slot=field]){border-style:var(--tw-border-style);border-width:1px}.has-\\[\\>\\[data-slot\\=radio-group\\]\\]\\:gap-3:has(>[data-slot=radio-group]){gap:calc(var(--spacing)*3)}.has-\\[\\>svg\\]\\:px-2\\.5:has(>svg){padding-inline:calc(var(--spacing)*2.5)}.has-\\[\\>svg\\]\\:px-3:has(>svg){padding-inline:calc(var(--spacing)*3)}.has-\\[\\>svg\\]\\:px-4:has(>svg){padding-inline:calc(var(--spacing)*4)}.aria-invalid\\:border-destructive[aria-invalid=true]{border-color:var(--destructive)}.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.aria-invalid\\:ring-destructive\\/20[aria-invalid=true]{--tw-ring-color:color-mix(in oklab,var(--destructive)20%,transparent)}}.data-\\[disabled\\]\\:pointer-events-none[data-disabled]{pointer-events:none}.data-\\[disabled\\]\\:opacity-50[data-disabled]{opacity:.5}.data-\\[inset\\]\\:pl-8[data-inset]{padding-left:calc(var(--spacing)*8)}.data-\\[invalid\\=true\\]\\:text-destructive[data-invalid=true]{color:var(--destructive)}.data-\\[orientation\\=horizontal\\]\\:h-px[data-orientation=horizontal]{height:1px}.data-\\[orientation\\=horizontal\\]\\:w-full[data-orientation=horizontal]{width:100%}.data-\\[orientation\\=vertical\\]\\:h-auto[data-orientation=vertical]{height:auto}.data-\\[orientation\\=vertical\\]\\:h-full[data-orientation=vertical]{height:100%}.data-\\[orientation\\=vertical\\]\\:w-px[data-orientation=vertical]{width:1px}.data-\\[side\\=bottom\\]\\:slide-in-from-top-2[data-side=bottom]{--tw-enter-translate-y:calc(2*var(--spacing)*-1)}.data-\\[side\\=left\\]\\:slide-in-from-right-2[data-side=left]{--tw-enter-translate-x:calc(2*var(--spacing))}.data-\\[side\\=right\\]\\:slide-in-from-left-2[data-side=right]{--tw-enter-translate-x:calc(2*var(--spacing)*-1)}.data-\\[side\\=top\\]\\:slide-in-from-bottom-2[data-side=top]{--tw-enter-translate-y:calc(2*var(--spacing))}.data-\\[slot\\=checkbox-group\\]\\:gap-3[data-slot=checkbox-group]{gap:calc(var(--spacing)*3)}.data-\\[state\\=active\\]\\:bg-background[data-state=active]{background-color:var(--background)}.data-\\[state\\=active\\]\\:shadow-sm[data-state=active]{--tw-shadow:0 1px 3px 0 var(--tw-shadow-color,#0000001a),0 1px 2px -1px var(--tw-shadow-color,#0000001a);box-shadow:var(--tw-inset-shadow),var(--tw-inset-ring-shadow),var(--tw-ring-offset-shadow),var(--tw-ring-shadow),var(--tw-shadow)}.data-\\[state\\=checked\\]\\:translate-x-\\[calc\\(100\\%-2px\\)\\][data-state=checked]{--tw-translate-x: calc(100% - 2px) ;translate:var(--tw-translate-x)var(--tw-translate-y)}.data-\\[state\\=checked\\]\\:bg-primary[data-state=checked]{background-color:var(--primary)}.data-\\[state\\=closed\\]\\:animate-out[data-state=closed]{animation:exit var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.data-\\[state\\=closed\\]\\:fade-out-0[data-state=closed]{--tw-exit-opacity:0}.data-\\[state\\=closed\\]\\:zoom-out-95[data-state=closed]{--tw-exit-scale:.95}.data-\\[state\\=inactive\\]\\:hidden[data-state=inactive]{display:none}.data-\\[state\\=open\\]\\:animate-in[data-state=open]{animation:enter var(--tw-animation-duration,var(--tw-duration,.15s))var(--tw-ease,ease)var(--tw-animation-delay,0s)var(--tw-animation-iteration-count,1)var(--tw-animation-direction,normal)var(--tw-animation-fill-mode,none)}.data-\\[state\\=open\\]\\:bg-accent[data-state=open]{background-color:var(--accent)}.data-\\[state\\=open\\]\\:text-accent-foreground[data-state=open]{color:var(--accent-foreground)}.data-\\[state\\=open\\]\\:text-muted-foreground[data-state=open]{color:var(--muted-foreground)}.data-\\[state\\=open\\]\\:fade-in-0[data-state=open]{--tw-enter-opacity:0}.data-\\[state\\=open\\]\\:zoom-in-95[data-state=open]{--tw-enter-scale:.95}.data-\\[state\\=unchecked\\]\\:translate-x-0[data-state=unchecked]{--tw-translate-x:calc(var(--spacing)*0);translate:var(--tw-translate-x)var(--tw-translate-y)}.data-\\[state\\=unchecked\\]\\:bg-input[data-state=unchecked]{background-color:var(--input)}.data-\\[variant\\=destructive\\]\\:text-destructive[data-variant=destructive]{color:var(--destructive)}.data-\\[variant\\=destructive\\]\\:focus\\:bg-destructive\\/10[data-variant=destructive]:focus{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.data-\\[variant\\=destructive\\]\\:focus\\:bg-destructive\\/10[data-variant=destructive]:focus{background-color:color-mix(in oklab,var(--destructive)10%,transparent)}}.data-\\[variant\\=destructive\\]\\:focus\\:text-destructive[data-variant=destructive]:focus{color:var(--destructive)}.data-\\[variant\\=label\\]\\:text-sm[data-variant=label]{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}.data-\\[variant\\=legend\\]\\:text-base[data-variant=legend]{font-size:var(--text-base);line-height:var(--tw-leading,var(--text-base--line-height))}.nth-last-2\\:-mt-1:nth-last-child(2){margin-top:calc(var(--spacing)*-1)}@media (min-width:40rem){.sm\\:max-w-lg{max-width:var(--container-lg)}.sm\\:flex-row{flex-direction:row}.sm\\:justify-end{justify-content:flex-end}.sm\\:text-left{text-align:left}}@media (min-width:48rem){.md\\:p-12{padding:calc(var(--spacing)*12)}.md\\:text-sm{font-size:var(--text-sm);line-height:var(--tw-leading,var(--text-sm--line-height))}}@media (min-width:64rem){.lg\\:grid-cols-2{grid-template-columns:repeat(2,minmax(0,1fr))}}@media (min-width:80rem){.xl\\:grid-cols-3{grid-template-columns:repeat(3,minmax(0,1fr))}.xl\\:px-16{padding-inline:calc(var(--spacing)*16)}}@media (min-width:96rem){.\\32xl\\:grid-cols-4{grid-template-columns:repeat(4,minmax(0,1fr))}}@container field-group (min-width:28rem){.\\@md\\/field-group\\:flex-row{flex-direction:row}.\\@md\\/field-group\\:items-center{align-items:center}.\\@md\\/field-group\\:has-\\[\\>\\[data-slot\\=field-content\\]\\]\\:items-start:has(>[data-slot=field-content]){align-items:flex-start}}.dark\\:scale-0:is(.dark *){--tw-scale-x:0%;--tw-scale-y:0%;--tw-scale-z:0%;scale:var(--tw-scale-x)var(--tw-scale-y)}.dark\\:scale-100:is(.dark *){--tw-scale-x:100%;--tw-scale-y:100%;--tw-scale-z:100%;scale:var(--tw-scale-x)var(--tw-scale-y)}.dark\\:-rotate-90:is(.dark *){rotate:-90deg}.dark\\:rotate-0:is(.dark *){rotate:none}.dark\\:border-input:is(.dark *){border-color:var(--input)}.dark\\:bg-destructive\\/60:is(.dark *){background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:bg-destructive\\/60:is(.dark *){background-color:color-mix(in oklab,var(--destructive)60%,transparent)}}.dark\\:bg-input\\/30:is(.dark *){background-color:var(--input)}@supports (color:color-mix(in lab,red,red)){.dark\\:bg-input\\/30:is(.dark *){background-color:color-mix(in oklab,var(--input)30%,transparent)}}.dark\\:text-muted-foreground:is(.dark *){color:var(--muted-foreground)}@media (hover:hover){.dark\\:hover\\:bg-accent\\/50:is(.dark *):hover{background-color:var(--accent)}@supports (color:color-mix(in lab,red,red)){.dark\\:hover\\:bg-accent\\/50:is(.dark *):hover{background-color:color-mix(in oklab,var(--accent)50%,transparent)}}.dark\\:hover\\:bg-input\\/50:is(.dark *):hover{background-color:var(--input)}@supports (color:color-mix(in lab,red,red)){.dark\\:hover\\:bg-input\\/50:is(.dark *):hover{background-color:color-mix(in oklab,var(--input)50%,transparent)}}}.dark\\:focus-visible\\:ring-destructive\\/40:is(.dark *):focus-visible{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:focus-visible\\:ring-destructive\\/40:is(.dark *):focus-visible{--tw-ring-color:color-mix(in oklab,var(--destructive)40%,transparent)}}.dark\\:has-data-\\[state\\=checked\\]\\:bg-primary\\/10:is(.dark *):has([data-state=checked]){background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){.dark\\:has-data-\\[state\\=checked\\]\\:bg-primary\\/10:is(.dark *):has([data-state=checked]){background-color:color-mix(in oklab,var(--primary)10%,transparent)}}.dark\\:aria-invalid\\:ring-destructive\\/40:is(.dark *)[aria-invalid=true]{--tw-ring-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:aria-invalid\\:ring-destructive\\/40:is(.dark *)[aria-invalid=true]{--tw-ring-color:color-mix(in oklab,var(--destructive)40%,transparent)}}.dark\\:data-\\[state\\=active\\]\\:border-input:is(.dark *)[data-state=active]{border-color:var(--input)}.dark\\:data-\\[state\\=active\\]\\:bg-input\\/30:is(.dark *)[data-state=active]{background-color:var(--input)}@supports (color:color-mix(in lab,red,red)){.dark\\:data-\\[state\\=active\\]\\:bg-input\\/30:is(.dark *)[data-state=active]{background-color:color-mix(in oklab,var(--input)30%,transparent)}}.dark\\:data-\\[state\\=active\\]\\:text-foreground:is(.dark *)[data-state=active]{color:var(--foreground)}.dark\\:data-\\[state\\=checked\\]\\:bg-primary-foreground:is(.dark *)[data-state=checked]{background-color:var(--primary-foreground)}.dark\\:data-\\[state\\=unchecked\\]\\:bg-foreground:is(.dark *)[data-state=unchecked]{background-color:var(--foreground)}.dark\\:data-\\[state\\=unchecked\\]\\:bg-input\\/80:is(.dark *)[data-state=unchecked]{background-color:var(--input)}@supports (color:color-mix(in lab,red,red)){.dark\\:data-\\[state\\=unchecked\\]\\:bg-input\\/80:is(.dark *)[data-state=unchecked]{background-color:color-mix(in oklab,var(--input)80%,transparent)}}.dark\\:data-\\[variant\\=destructive\\]\\:focus\\:bg-destructive\\/20:is(.dark *)[data-variant=destructive]:focus{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){.dark\\:data-\\[variant\\=destructive\\]\\:focus\\:bg-destructive\\/20:is(.dark *)[data-variant=destructive]:focus{background-color:color-mix(in oklab,var(--destructive)20%,transparent)}}.\\[\\&_svg\\]\\:pointer-events-none svg{pointer-events:none}.\\[\\&_svg\\]\\:shrink-0 svg{flex-shrink:0}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-4 svg:not([class*=size-]){width:calc(var(--spacing)*4);height:calc(var(--spacing)*4)}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'size-\\'\\]\\)\\]\\:size-6 svg:not([class*=size-]){width:calc(var(--spacing)*6);height:calc(var(--spacing)*6)}.\\[\\&_svg\\:not\\(\\[class\\*\\=\\'text-\\'\\]\\)\\]\\:text-muted-foreground svg:not([class*=text-]){color:var(--muted-foreground)}.\\[\\.border-b\\]\\:pb-6.border-b{padding-bottom:calc(var(--spacing)*6)}.\\[\\.border-t\\]\\:pt-6.border-t{padding-top:calc(var(--spacing)*6)}:is(.data-\\[variant\\=destructive\\]\\:\\*\\:\\[svg\\]\\:\\!text-destructive[data-variant=destructive]>*):is(svg){color:var(--destructive)!important}.\\[\\&\\>\\*\\]\\:w-full>*{width:100%}.\\[\\&\\>\\*\\]\\:focus-visible\\:relative>:focus-visible{position:relative}.\\[\\&\\>\\*\\]\\:focus-visible\\:z-10>:focus-visible{z-index:10}.\\[\\&\\>\\*\\]\\:data-\\[slot\\=field\\]\\:p-4>[data-slot=field]{padding:calc(var(--spacing)*4)}@container field-group (min-width:28rem){.\\@md\\/field-group\\:\\[\\&\\>\\*\\]\\:w-auto>*{width:auto}}.\\[\\&\\>\\*\\:not\\(\\:first-child\\)\\]\\:rounded-t-none>:not(:first-child){border-top-left-radius:0;border-top-right-radius:0}.\\[\\&\\>\\*\\:not\\(\\:first-child\\)\\]\\:rounded-l-none>:not(:first-child){border-top-left-radius:0;border-bottom-left-radius:0}.\\[\\&\\>\\*\\:not\\(\\:first-child\\)\\]\\:border-t-0>:not(:first-child){border-top-style:var(--tw-border-style);border-top-width:0}.\\[\\&\\>\\*\\:not\\(\\:first-child\\)\\]\\:border-l-0>:not(:first-child){border-left-style:var(--tw-border-style);border-left-width:0}.\\[\\&\\>\\*\\:not\\(\\:last-child\\)\\]\\:rounded-r-none>:not(:last-child){border-top-right-radius:0;border-bottom-right-radius:0}.\\[\\&\\>\\*\\:not\\(\\:last-child\\)\\]\\:rounded-b-none>:not(:last-child){border-bottom-right-radius:0;border-bottom-left-radius:0}.\\[\\&\\>\\.sr-only\\]\\:w-auto>.sr-only{width:auto}.\\[\\&\\>\\[data-slot\\=field-group\\]\\]\\:gap-4>[data-slot=field-group]{gap:calc(var(--spacing)*4)}.\\[\\&\\>\\[data-slot\\=field-label\\]\\]\\:flex-auto>[data-slot=field-label]{flex:auto}@container field-group (min-width:28rem){.\\@md\\/field-group\\:\\[\\&\\>\\[data-slot\\=field-label\\]\\]\\:flex-auto>[data-slot=field-label]{flex:auto}}.has-\\[select\\[aria-hidden\\=true\\]\\:last-child\\]\\:\\[\\&\\>\\[data-slot\\=select-trigger\\]\\:last-of-type\\]\\:rounded-r-md:has(:is(select[aria-hidden=true]:last-child))>[data-slot=select-trigger]:last-of-type{border-top-right-radius:calc(var(--radius) - 2px);border-bottom-right-radius:calc(var(--radius) - 2px)}.\\[\\&\\>\\[data-slot\\=select-trigger\\]\\:not\\(\\[class\\*\\=\\'w-\\'\\]\\)\\]\\:w-fit>[data-slot=select-trigger]:not([class*=w-]){width:fit-content}.has-\\[\\>\\[data-slot\\=field-content\\]\\]\\:\\[\\&\\>\\[role\\=checkbox\\]\\,\\[role\\=radio\\]\\]\\:mt-px:has(>[data-slot=field-content])>[role=checkbox],.has-\\[\\>\\[data-slot\\=field-content\\]\\]\\:\\[\\&\\>\\[role\\=checkbox\\]\\,\\[role\\=radio\\]\\]\\:mt-px:has(>[data-slot=field-content]) [role=radio]{margin-top:1px}@container field-group (min-width:28rem){.\\@md\\/field-group\\:has-\\[\\>\\[data-slot\\=field-content\\]\\]\\:\\[\\&\\>\\[role\\=checkbox\\]\\,\\[role\\=radio\\]\\]\\:mt-px:has(>[data-slot=field-content])>[role=checkbox],.\\@md\\/field-group\\:has-\\[\\>\\[data-slot\\=field-content\\]\\]\\:\\[\\&\\>\\[role\\=checkbox\\]\\,\\[role\\=radio\\]\\]\\:mt-px:has(>[data-slot=field-content]) [role=radio]{margin-top:1px}}.\\[\\&\\>a\\]\\:underline>a{text-decoration-line:underline}.\\[\\&\\>a\\]\\:underline-offset-4>a{text-underline-offset:4px}.\\[\\&\\>a\\:hover\\]\\:text-primary>a:hover{color:var(--primary)}.\\[\\&\\>div\\]\\:\\!block>div{display:block!important}.\\[\\&\\>input\\]\\:flex-1>input{flex:1}.\\[\\&\\>svg\\]\\:pointer-events-none>svg{pointer-events:none}.\\[\\&\\>svg\\]\\:size-2\\.5>svg{width:calc(var(--spacing)*2.5);height:calc(var(--spacing)*2.5)}.\\[\\&\\>svg\\]\\:size-3>svg{width:calc(var(--spacing)*3);height:calc(var(--spacing)*3)}[data-variant=legend]+.\\[\\[data-variant\\=legend\\]\\+\\&\\]\\:-mt-1\\.5{margin-top:calc(var(--spacing)*-1.5)}@media (hover:hover){a.\\[a\\&\\]\\:hover\\:bg-accent:hover{background-color:var(--accent)}a.\\[a\\&\\]\\:hover\\:bg-destructive\\/90:hover{background-color:var(--destructive)}@supports (color:color-mix(in lab,red,red)){a.\\[a\\&\\]\\:hover\\:bg-destructive\\/90:hover{background-color:color-mix(in oklab,var(--destructive)90%,transparent)}}a.\\[a\\&\\]\\:hover\\:bg-primary\\/90:hover{background-color:var(--primary)}@supports (color:color-mix(in lab,red,red)){a.\\[a\\&\\]\\:hover\\:bg-primary\\/90:hover{background-color:color-mix(in oklab,var(--primary)90%,transparent)}}a.\\[a\\&\\]\\:hover\\:bg-secondary\\/90:hover{background-color:var(--secondary)}@supports (color:color-mix(in lab,red,red)){a.\\[a\\&\\]\\:hover\\:bg-secondary\\/90:hover{background-color:color-mix(in oklab,var(--secondary)90%,transparent)}}a.\\[a\\&\\]\\:hover\\:text-accent-foreground:hover{color:var(--accent-foreground)}}}@property --tw-animation-delay{syntax:"*";inherits:false;initial-value:0s}@property --tw-animation-direction{syntax:"*";inherits:false;initial-value:normal}@property --tw-animation-duration{syntax:"*";inherits:false}@property --tw-animation-fill-mode{syntax:"*";inherits:false;initial-value:none}@property --tw-animation-iteration-count{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-blur{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-opacity{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-rotate{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-scale{syntax:"*";inherits:false;initial-value:1}@property --tw-enter-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-enter-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-blur{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-opacity{syntax:"*";inherits:false;initial-value:1}@property --tw-exit-rotate{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-scale{syntax:"*";inherits:false;initial-value:1}@property --tw-exit-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-exit-translate-y{syntax:"*";inherits:false;initial-value:0}:root{--radius:.625rem;--background:oklch(100% 0 0);--foreground:oklch(14.5% 0 0);--card:oklch(100% 0 0);--card-foreground:oklch(14.5% 0 0);--popover:oklch(100% 0 0);--popover-foreground:oklch(14.5% 0 0);--primary:oklch(70.5% .213 47.604);--primary-foreground:oklch(98.5% 0 0);--secondary:oklch(97% 0 0);--secondary-foreground:oklch(20.5% 0 0);--muted:oklch(97% 0 0);--muted-foreground:oklch(55.6% 0 0);--accent:oklch(97% 0 0);--accent-foreground:oklch(20.5% 0 0);--destructive:oklch(57.7% .245 27.325);--border:oklch(92.2% 0 0);--input:oklch(92.2% 0 0);--ring:oklch(70.8% 0 0);--chart-1:oklch(64.6% .222 41.116);--chart-2:oklch(60% .118 184.704);--chart-3:oklch(39.8% .07 227.392);--chart-4:oklch(82.8% .189 84.429);--chart-5:oklch(76.9% .188 70.08);--sidebar:oklch(98.5% 0 0);--sidebar-foreground:oklch(14.5% 0 0);--sidebar-primary:oklch(20.5% 0 0);--sidebar-primary-foreground:oklch(98.5% 0 0);--sidebar-accent:oklch(97% 0 0);--sidebar-accent-foreground:oklch(20.5% 0 0);--sidebar-border:oklch(92.2% 0 0);--sidebar-ring:oklch(70.8% 0 0)}.dark{--background:oklch(14.5% 0 0);--foreground:oklch(98.5% 0 0);--card:oklch(20.5% 0 0);--card-foreground:oklch(98.5% 0 0);--popover:oklch(20.5% 0 0);--popover-foreground:oklch(98.5% 0 0);--primary:oklch(70.5% .213 47.604);--primary-foreground:oklch(20.5% 0 0);--secondary:oklch(26.9% 0 0);--secondary-foreground:oklch(98.5% 0 0);--muted:oklch(26.9% 0 0);--muted-foreground:oklch(70.8% 0 0);--accent:oklch(26.9% 0 0);--accent-foreground:oklch(98.5% 0 0);--destructive:oklch(70.4% .191 22.216);--border:oklch(100% 0 0/.1);--input:oklch(100% 0 0/.15);--ring:oklch(55.6% 0 0);--chart-1:oklch(48.8% .243 264.376);--chart-2:oklch(69.6% .17 162.48);--chart-3:oklch(76.9% .188 70.08);--chart-4:oklch(62.7% .265 303.9);--chart-5:oklch(64.5% .246 16.439);--sidebar:oklch(20.5% 0 0);--sidebar-foreground:oklch(98.5% 0 0);--sidebar-primary:oklch(48.8% .243 264.376);--sidebar-primary-foreground:oklch(98.5% 0 0);--sidebar-accent:oklch(26.9% 0 0);--sidebar-accent-foreground:oklch(98.5% 0 0);--sidebar-border:oklch(100% 0 0/.1);--sidebar-ring:oklch(55.6% 0 0)}::view-transition-new(root){animation:none}::view-transition-old(root){animation:none}@property --tw-translate-x{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-y{syntax:"*";inherits:false;initial-value:0}@property --tw-translate-z{syntax:"*";inherits:false;initial-value:0}@property --tw-scale-x{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-y{syntax:"*";inherits:false;initial-value:1}@property --tw-scale-z{syntax:"*";inherits:false;initial-value:1}@property --tw-rotate-x{syntax:"*";inherits:false}@property --tw-rotate-y{syntax:"*";inherits:false}@property --tw-rotate-z{syntax:"*";inherits:false}@property --tw-skew-x{syntax:"*";inherits:false}@property --tw-skew-y{syntax:"*";inherits:false}@property --tw-space-y-reverse{syntax:"*";inherits:false;initial-value:0}@property --tw-border-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-gradient-position{syntax:"*";inherits:false}@property --tw-gradient-from{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-via{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-to{syntax:"<color>";inherits:false;initial-value:#0000}@property --tw-gradient-stops{syntax:"*";inherits:false}@property --tw-gradient-via-stops{syntax:"*";inherits:false}@property --tw-gradient-from-position{syntax:"<length-percentage>";inherits:false;initial-value:0%}@property --tw-gradient-via-position{syntax:"<length-percentage>";inherits:false;initial-value:50%}@property --tw-gradient-to-position{syntax:"<length-percentage>";inherits:false;initial-value:100%}@property --tw-leading{syntax:"*";inherits:false}@property --tw-font-weight{syntax:"*";inherits:false}@property --tw-tracking{syntax:"*";inherits:false}@property --tw-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-shadow-color{syntax:"*";inherits:false}@property --tw-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-inset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-shadow-color{syntax:"*";inherits:false}@property --tw-inset-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-ring-color{syntax:"*";inherits:false}@property --tw-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-inset-ring-color{syntax:"*";inherits:false}@property --tw-inset-ring-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-ring-inset{syntax:"*";inherits:false}@property --tw-ring-offset-width{syntax:"<length>";inherits:false;initial-value:0}@property --tw-ring-offset-color{syntax:"*";inherits:false;initial-value:#fff}@property --tw-ring-offset-shadow{syntax:"*";inherits:false;initial-value:0 0 #0000}@property --tw-outline-style{syntax:"*";inherits:false;initial-value:solid}@property --tw-blur{syntax:"*";inherits:false}@property --tw-brightness{syntax:"*";inherits:false}@property --tw-contrast{syntax:"*";inherits:false}@property --tw-grayscale{syntax:"*";inherits:false}@property --tw-hue-rotate{syntax:"*";inherits:false}@property --tw-invert{syntax:"*";inherits:false}@property --tw-opacity{syntax:"*";inherits:false}@property --tw-saturate{syntax:"*";inherits:false}@property --tw-sepia{syntax:"*";inherits:false}@property --tw-drop-shadow{syntax:"*";inherits:false}@property --tw-drop-shadow-color{syntax:"*";inherits:false}@property --tw-drop-shadow-alpha{syntax:"<percentage>";inherits:false;initial-value:100%}@property --tw-drop-shadow-size{syntax:"*";inherits:false}@property --tw-backdrop-blur{syntax:"*";inherits:false}@property --tw-backdrop-brightness{syntax:"*";inherits:false}@property --tw-backdrop-contrast{syntax:"*";inherits:false}@property --tw-backdrop-grayscale{syntax:"*";inherits:false}@property --tw-backdrop-hue-rotate{syntax:"*";inherits:false}@property --tw-backdrop-invert{syntax:"*";inherits:false}@property --tw-backdrop-opacity{syntax:"*";inherits:false}@property --tw-backdrop-saturate{syntax:"*";inherits:false}@property --tw-backdrop-sepia{syntax:"*";inherits:false}@property --tw-duration{syntax:"*";inherits:false}@property --tw-ease{syntax:"*";inherits:false}@keyframes spin{to{transform:rotate(360deg)}}@keyframes pulse{50%{opacity:.5}}@keyframes bounce{0%,to{animation-timing-function:cubic-bezier(.8,0,1,1);transform:translateY(-25%)}50%{animation-timing-function:cubic-bezier(0,0,.2,1);transform:none}}@keyframes enter{0%{opacity:var(--tw-enter-opacity,1);transform:translate3d(var(--tw-enter-translate-x,0),var(--tw-enter-translate-y,0),0)scale3d(var(--tw-enter-scale,1),var(--tw-enter-scale,1),var(--tw-enter-scale,1))rotate(var(--tw-enter-rotate,0));filter:blur(var(--tw-enter-blur,0))}}@keyframes exit{to{opacity:var(--tw-exit-opacity,1);transform:translate3d(var(--tw-exit-translate-x,0),var(--tw-exit-translate-y,0),0)scale3d(var(--tw-exit-scale,1),var(--tw-exit-scale,1),var(--tw-exit-scale,1))rotate(var(--tw-exit-rotate,0));filter:blur(var(--tw-exit-blur,0))}}`;
  importCSS(indexCss);
  const prefix$1 = "cx-style";
  const _bannedWordsAtom = utils.atomWithStorage(
    `${prefix$1}-banned_words`,
    []
  );
  const _bannedUsersAtom = utils.atomWithStorage(
    `${prefix$1}-banned_users`,
    []
  );
  const bannedWordsAtom = jotai.atom(
    (get2) => get2(_bannedWordsAtom),
    (get2, set2, action) => {
      const prev = get2(_bannedWordsAtom);
      let next;
      switch (action.type) {
        case "add":
          const { word } = action;
          next = [word, ...prev.filter((i2) => i2 !== word)];
          break;
        case "remove":
          next = prev.filter((i2) => i2 !== action.word);
          break;
        case "clear":
          next = [];
          break;
        default:
          next = prev;
      }
      set2(_bannedWordsAtom, next);
    }
  );
  const bannedUsersAtom = jotai.atom(
    (get2) => get2(_bannedUsersAtom),
    (get2, set2, action) => {
      const prev = get2(_bannedUsersAtom);
      let next;
      switch (action.type) {
        case "add": {
          const { user } = action;
          next = [user, ...prev.filter((i2) => i2.id !== user.id)];
          break;
        }
        case "remove": {
          next = prev.filter((i2) => i2.id !== action.id);
          break;
        }
        case "clear":
          next = [];
          break;
        default:
          next = prev;
      }
      set2(_bannedUsersAtom, next);
    }
  );
  async function fetchStreamers() {
    const response = await fetch("http://175.178.29.106/webhook/n8n/query");
    return response.json();
  }
  async function fetchImage(key) {
    const response = await fetch(
      `http://175.178.29.106:5678/webhook/queryByEmojiName?emojiName=${encodeURIComponent(key)}`
    );
    return response.json();
  }
  async function fetchEmoji() {
    const response = await fetch("http://175.178.29.106/webhook/n8n/emojiQuery");
    return response.json();
  }
  async function fetchStsToken() {
    const response = await fetch("http://175.178.29.106:8001/sts-token");
    return response.json();
  }
  async function submitEmojiUrl(url) {
    const response = await fetch(
      "http://175.178.29.106/webhook/n8n/emojiSubmit",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      }
    );
    return response.json();
  }
  const storagePrefix = "cx-style";
  const _pinnedIdsAtom = utils.atomWithStorage(
    `${storagePrefix}-pinned_streamers`,
    []
  );
  const _streamerRemarksAtom = utils.atomWithStorage(
    `${storagePrefix}-streamer_remarks`,
    []
  );
  const pinnedIdsAtom = jotai.atom(
    (get2) => get2(_pinnedIdsAtom),
    (get2, set2, action) => {
      const prev = get2(_pinnedIdsAtom);
      let next;
      switch (action.type) {
        case "add": {
          const id2 = action.id;
          next = [id2, ...prev.filter((i2) => i2 !== id2)];
          break;
        }
        case "remove": {
          next = prev.filter((i2) => i2 !== action.id);
          break;
        }
        case "clear": {
          next = [];
          break;
        }
        default:
          next = prev;
      }
      const unique = Array.from(new Set(next));
      set2(_pinnedIdsAtom, unique);
    }
  );
  const streamersAtom = jotai.atom([]);
  const streamersStatusAtom = jotai.atom(
    "idle"
  );
  const lastUpdatedAtom = jotai.atom(null);
  const fetchStreamersAtom = jotai.atom(null, async (_, set2) => {
    set2(streamersStatusAtom, "loading");
    try {
      const data = await fetchStreamers();
      set2(streamersAtom, data);
      set2(lastUpdatedAtom, new Date());
      set2(streamersStatusAtom, "done");
    } catch (e) {
      set2(streamersStatusAtom, "error");
    }
  });
  const liveStreamersAtom = jotai.atom(async (get2) => {
    const pinned = new Set(get2(_pinnedIdsAtom));
    const streamers = await get2(streamersAtom);
    return streamers.filter((s2) => s2.status === 1 && !pinned.has(s2.id));
  });
  const offlineStreamersAtom = jotai.atom(async (get2) => {
    const pinned = new Set(get2(_pinnedIdsAtom));
    const streamers = await get2(streamersAtom);
    return streamers.filter((s2) => s2.status === 0 && !pinned.has(s2.id));
  });
  const pinnedStreamersAtom = jotai.atom(async (get2) => {
    const pinned = get2(_pinnedIdsAtom);
    const streamers = await get2(streamersAtom);
    const pinnedSet = new Set(pinned);
    return [
      ...streamers.filter((s2) => pinnedSet.has(s2.id)).sort((a2, b) => b.status - a2.status)
    ];
  });
  const streamerRemarksAtom = jotai.atom(
    (get2) => get2(_streamerRemarksAtom),
    (get2, set2, action) => {
      const prev = get2(_streamerRemarksAtom);
      let next = [];
      switch (action.type) {
        case "add": {
          const { remark } = action;
          next = [remark, ...prev.filter((i2) => i2.id !== remark.id)];
          break;
        }
        case "remove": {
          next = prev.filter((i2) => i2.id !== action.id);
          break;
        }
        case "clear": {
          next = [];
          break;
        }
        default:
          next = prev;
      }
      set2(_streamerRemarksAtom, next);
    }
  );
  const streamerRemarkAtom = utils.atomFamily(
    (id2) => jotai.atom((get2) => {
      const remarks = get2(_streamerRemarksAtom);
      return remarks.find((r2) => r2.id === id2) ?? null;
    })
  );
  const userAtom = jotai.atom(null);
  function injectCSS(css) {
    const style2 = document.createElement("style");
    style2.textContent = css;
    document.head.appendChild(style2);
  }
  function formatDate(date) {
    let dateObj;
    if (date instanceof Date) {
      dateObj = date;
    } else {
      dateObj = new Date(date);
    }
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
    const day = dateObj.getDate().toString().padStart(2, "0");
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");
    const seconds = dateObj.getSeconds().toString().padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }
  function formatLiveDuration(dateStr) {
    const startTime = Date.now() - new Date(dateStr).getTime() + 8 * 3600 * 1e3;
    const totalSeconds = Math.ceil(startTime / 1e3);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.ceil(totalSeconds / 60) % 60;
    return hours > 0 ? `${hours}h${minutes}min` : `${minutes}min`;
  }
  function debounce(func, delay2, immediate = false) {
    let timer = null;
    return (...args) => {
      const callNow = immediate && !timer;
      if (timer) clearTimeout(timer);
      timer = window.setTimeout(() => {
        timer = null;
        if (!immediate) func(...args);
      }, delay2);
      if (callNow) func(...args);
    };
  }
  const prefix = "[chou-xiang-style]";
  function log(...args) {
    console.log(`${prefix} `, ...args);
  }
  function error(...args) {
    console.error(`${prefix} `, ...args);
  }
  function parseMessage(text) {
    if (!text) return [];
    const parts = [];
    const regex = /(https?:\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|])|\[([^\]]+)\]/g;
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(text)) !== null) {
      const [_, url, bracketContent] = match;
      if (match.index > lastIndex) {
        parts.push({ type: "text", text: text.slice(lastIndex, match.index) });
      }
      if (url) {
        parts.push({ type: "link", url });
      } else if (bracketContent) {
        parts.push({
          type: /no\.\d+/.test(bracketContent) ? "image" : "emoji",
          key: bracketContent
        });
      }
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push({ type: "text", text: text.slice(lastIndex) });
    }
    return parts;
  }
  const DB_NAME = "emojiDB";
  const STORE_NAME$1 = "emojis";
  const DB_VERSION = Number("2");
  let dbPromise = null;
  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (db.objectStoreNames.contains(STORE_NAME$1)) {
          db.deleteObjectStore(STORE_NAME$1);
        }
        const store = db.createObjectStore(STORE_NAME$1, {
          keyPath: "id",
          autoIncrement: true
        });
        store.createIndex("key", "key", { unique: true });
        store.createIndex("timestamp", "timestamp", { unique: false });
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
    return dbPromise;
  }
  const STORE_NAME = "emojis";
  const EXPIRE_DAYS = Number("30");
  function isCacheExpired(timestamp) {
    if (EXPIRE_DAYS === 0) return true;
    return Date.now() - timestamp > EXPIRE_DAYS * 24 * 60 * 60 * 1e3;
  }
  async function getCachedImage(key) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const request = db.transaction(STORE_NAME).objectStore(STORE_NAME).index("key").get(key);
      request.onsuccess = (e) => {
        const result = e.target.result;
        if (result && !isCacheExpired(result.timestamp)) {
          const blob = new Blob([result.blob], { type: result.type });
          resolve(URL.createObjectURL(blob));
        } else {
          resolve(null);
        }
      };
      request.onerror = (e) => {
        error("getting cache image error");
        reject(e);
      };
    });
  }
  async function setCachedImage(record) {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add(record);
      request.onsuccess = () => resolve();
      request.onerror = () => {
        error(`setting cache image error`);
        reject(request.error);
      };
    });
  }
  function getCacheKey(emoji) {
    return emoji.emojiname || `no.${emoji.id}`;
  }
  async function getEmojiImageUrl(key) {
    try {
      const cachedUrl = await getCachedImage(key);
      if (cachedUrl) return cachedUrl;
      const data = await fetchImage(key);
      if (!data || !data.url) {
        error("fetch image failed:", data);
        return null;
      }
      const emoji = {
        emojiname: data.emoji_name,
        id: data.id,
        url: data.url
      };
      const blobUrl = await cacheEmojiImage(emoji);
      return blobUrl;
    } catch (e) {
      error(`${key} image load failed`, e);
      throw e;
    }
  }
  async function cacheEmojiImage(emoji) {
    const key = getCacheKey(emoji);
    try {
      const cachedUrl = await getCachedImage(key);
      if (cachedUrl) return cachedUrl;
      const response = await fetch(emoji.url);
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const blob = await response.blob();
      const blobBuffer = await blob.arrayBuffer();
      await setCachedImage({
        key,
        blob: blobBuffer,
        type: blob.type,
        timestamp: Date.now(),
        url: emoji.url
      });
      return URL.createObjectURL(blob);
    } catch (e) {
      const cachedUrl = await getCachedImage(key);
      if (cachedUrl) return cachedUrl;
      error("缓存图片失败:", e);
      throw e;
    }
  }
  function uploadFile(file, stsToken) {
    const { credentials, cosConfig, startTime, expiredTime } = stsToken.data;
    const folder = cosConfig.folder || "emojis/";
    const extension = file.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}.${extension}`;
    const key = folder + fileName;
    const cos = new COS({
      getAuthorization(_, callback) {
        callback({
          TmpSecretId: credentials.tmpSecretId,
          TmpSecretKey: credentials.tmpSecretKey,
          SecurityToken: credentials.sessionToken,
          StartTime: startTime,
          ExpiredTime: expiredTime
        });
      }
    });
    return new Promise((resolve, reject) => {
      cos.putObject(
        {
          Bucket: cosConfig.bucket,
          Region: cosConfig.region,
          Key: key,
          Body: file,
          onProgress: (progressData) => {
            log(`上传进度: ${Math.round(progressData.percent * 100)}%`);
          }
        },
        (err, data) => {
          if (err) return reject(err);
          const cosUrl = `https://${data.Location}`;
          resolve(cosUrl);
        }
      );
    });
  }
  function skipMessageByBannedWords(message, bannedWords) {
    return bannedWords.length > 0 && bannedWords.some((word) => {
      if (!word || !message.message) return false;
      try {
        return new RegExp(word, "i").test(message.message);
      } catch (e) {
        return message.message.includes(word);
      }
    });
  }
  function skipMessageByBannedUsers(message, bannedUsers) {
    return bannedUsers.length > 0 && bannedUsers.some((user) => user.id === message.id);
  }
  const maxMessageCount = Number("300");
  const maxRetry = Number("5");
  function useChatWebSocket(url) {
    const [messages, setMessages] = React.useState([]);
    const [onlineCount, setOnlineCount] = React.useState(-1);
    const [isConnected, setIsConnected] = React.useState(false);
    const wsRef = React.useRef(null);
    const fetchStreamers2 = jotai.useSetAtom(fetchStreamersAtom);
    const [user, setUser] = jotai.useAtom(userAtom);
    const bannedWords = jotai.useAtomValue(bannedWordsAtom);
    const bannedUsers = jotai.useAtomValue(bannedUsersAtom);
    const retryCountRef = React.useRef(0);
    const reconnectTimer = React.useRef(0);
    const bannedWordsRef = React.useRef([]);
    const bannedUsersRef = React.useRef([]);
    bannedWordsRef.current = bannedWords;
    bannedUsersRef.current = bannedUsers;
    const handleOpen = () => {
      log("chat websocket open");
      setIsConnected(true);
      retryCountRef.current = 0;
      clearTimeout(reconnectTimer.current);
    };
    const handleMessage = (e) => {
      try {
        const msg = JSON.parse(e.data);
        const { type } = msg;
        msg.helpId = `${Date.now()}-${Math.random().toFixed(8)}`;
        if (type === "message" || type === "history_message" || type === "system") {
          if (!skipMessageByBannedWords(msg, bannedWordsRef.current) && !skipMessageByBannedUsers(msg, bannedUsersRef.current)) {
            setMessages((prev) => [...prev, msg].splice(-maxMessageCount));
          }
        } else if (type === "status_change") {
          fetchStreamers2();
          if (msg.content.status === "1") {
            setMessages((prev) => [...prev, msg].splice(-maxMessageCount));
          }
        } else if (type === "join" || type === "leave") {
          setOnlineCount(msg.count);
          if (type === "join") {
          }
        } else if (type === "user") {
          setUser(msg);
        }
      } catch (err) {
        error("chat websocket message parse error:", err);
      }
    };
    const handleError = (e) => {
      error("chat websocket error:", e);
      wsRef.current?.close();
    };
    const handleClose = () => {
      log("chat websocket closed");
      setIsConnected(false);
      if (retryCountRef.current < maxRetry) {
        const delay2 = Math.min(1e3 * 2 ** retryCountRef.current, 1e4);
        retryCountRef.current++;
        log(`attempting reconnect in ${delay2 / 1e3}s...`);
        reconnectTimer.current = window.setTimeout(connect, delay2);
      } else {
        error("max reconnect attempts reached");
      }
    };
    const connect = () => {
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.addEventListener("open", handleOpen);
      ws.addEventListener("message", handleMessage);
      ws.addEventListener("error", handleError);
      ws.addEventListener("close", handleClose);
    };
    const cleanupWebSocket = () => {
      const ws = wsRef.current;
      if (!ws) return;
      ws.removeEventListener("open", handleOpen);
      ws.removeEventListener("message", handleMessage);
      ws.removeEventListener("error", handleError);
      ws.removeEventListener("close", handleClose);
      ws.close();
    };
    React.useEffect(() => {
      connect();
      return () => {
        clearTimeout(reconnectTimer.current);
        cleanupWebSocket();
      };
    }, [url]);
    const sendMessage = (message) => {
      if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
      if (!user) return;
      const newMsg = {
        type: "message",
        ip: user.ip,
        username: user.username,
        message
      };
      wsRef.current.send(JSON.stringify(newMsg));
    };
    return {
      messages,
      onlineCount,
      isConnected,
      sendMessage
    };
  }
  function useUnreadMessages(messages, isAutoScrollEnabled) {
    const lastHelpIdRef = React.useRef(null);
    const stopTrackingRef = React.useRef(false);
    const newMessages = React.useMemo(() => {
      if (isAutoScrollEnabled) {
        stopTrackingRef.current = false;
        lastHelpIdRef.current = messages.length ? messages[messages.length - 1].helpId : null;
        return [];
      }
      if (!stopTrackingRef.current) {
        lastHelpIdRef.current = messages.length ? messages[messages.length - 1].helpId : null;
        stopTrackingRef.current = true;
        return [];
      }
      if (!lastHelpIdRef.current) return messages;
      const index2 = messages.findIndex((m) => m.helpId === lastHelpIdRef.current);
      if (index2 === -1) return messages;
      return messages.slice(index2 + 1);
    }, [messages, isAutoScrollEnabled]);
    return newMessages;
  }
  function useSmartAutoScroll(options) {
    const behavior = "instant";
    const containerRef = React.useRef(null);
    const [isAutoScrollEnabled, setIsAutoScrollEnabled] = React.useState(true);
    const handleScroll2 = React.useCallback(() => {
      const el = containerRef.current;
      if (!el) return;
      const isAtBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
      setIsAutoScrollEnabled(isAtBottom);
    }, []);
    const debounceScroll = React.useRef(debounce(handleScroll2, 100)).current;
    React.useEffect(() => {
      const el = containerRef.current;
      if (!el) return;
      el.addEventListener("scroll", debounceScroll);
      return () => el.removeEventListener("scroll", debounceScroll);
    }, [debounceScroll]);
    const scrollToBottom = () => {
      const el = containerRef.current;
      if (!el) return;
      el.scrollTo({
        top: el.scrollHeight,
        behavior
      });
    };
    return { containerRef, scrollToBottom, isAutoScrollEnabled };
  }
  const requestCache = new Map();
  function useRequest(service, options = {}) {
    const {
      manual = false,
      cacheKey,
      onError,
      onSuccess,
      staleTime = 0,
      defaultParams = []
    } = options;
    const [data, setData] = React.useState();
    const [error2, setError] = React.useState(null);
    const hasFetched = React.useRef(false);
    const [loading, setLoading] = React.useState(false);
    const run = async (...params) => {
      setLoading(true);
      setError(null);
      try {
        if (cacheKey && staleTime > 0) {
          const cached2 = requestCache.get(cacheKey);
          const isValid = cached2 && Date.now() - cached2.timestamp < staleTime;
          if (isValid) {
            setData(cached2.data);
            return cached2.data;
          }
        }
        const result = await service(...params);
        setData(result);
        onSuccess?.(result);
        if (cacheKey) {
          requestCache.set(cacheKey, {
            data: result,
            timestamp: Date.now()
          });
        }
        return result;
      } catch (e) {
        setError(e);
        onError?.(e);
        throw e;
      } finally {
        setLoading(false);
      }
    };
    React.useEffect(() => {
      if (!manual && !hasFetched.current) {
        hasFetched.current = true;
        run(...defaultParams);
      }
    }, [manual]);
    return { data, loading, error: error2, run };
  }
  function useImageUrl(imgKey) {
    const [url, setUrl] = React.useState(void 0);
    const [isError, setIsError] = React.useState(false);
    const promiseRef = React.useRef(null);
    React.useEffect(() => {
      let cancelled = false;
      const p = getEmojiImageUrl(imgKey);
      promiseRef.current = p;
      p.then((url2) => {
        if (!cancelled) setUrl(url2 ?? void 0);
      }).catch(() => {
        setIsError(true);
      });
      return () => {
        cancelled = true;
      };
    }, [imgKey]);
    return { url, isError, promiseRef };
  }
  var reactDom = { exports: {} };
  var reactDom_production = {};
  /**
   * @license React
   * react-dom.production.js
   *
   * Copyright (c) Meta Platforms, Inc. and affiliates.
   *
   * This source code is licensed under the MIT license found in the
   * LICENSE file in the root directory of this source tree.
   */
  var hasRequiredReactDom_production;
  function requireReactDom_production() {
    if (hasRequiredReactDom_production) return reactDom_production;
    hasRequiredReactDom_production = 1;
    var React2 = React;
    function formatProdErrorMessage(code) {
      var url = "https://react.dev/errors/" + code;
      if (1 < arguments.length) {
        url += "?args[]=" + encodeURIComponent(arguments[1]);
        for (var i2 = 2; i2 < arguments.length; i2++)
          url += "&args[]=" + encodeURIComponent(arguments[i2]);
      }
      return "Minified React error #" + code + "; visit " + url + " for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";
    }
    function noop3() {
    }
    var Internals = {
      d: {
        f: noop3,
        r: function() {
          throw Error(formatProdErrorMessage(522));
        },
        D: noop3,
        C: noop3,
        L: noop3,
        m: noop3,
        X: noop3,
        S: noop3,
        M: noop3
      },
      p: 0,
      findDOMNode: null
    }, REACT_PORTAL_TYPE = Symbol.for("react.portal");
    function createPortal$1(children, containerInfo, implementation) {
      var key = 3 < arguments.length && void 0 !== arguments[3] ? arguments[3] : null;
      return {
        $$typeof: REACT_PORTAL_TYPE,
        key: null == key ? null : "" + key,
        children,
        containerInfo,
        implementation
      };
    }
    var ReactSharedInternals = React2.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE;
    function getCrossOriginStringAs(as, input) {
      if ("font" === as) return "";
      if ("string" === typeof input)
        return "use-credentials" === input ? input : "";
    }
    reactDom_production.__DOM_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = Internals;
    reactDom_production.createPortal = function(children, container) {
      var key = 2 < arguments.length && void 0 !== arguments[2] ? arguments[2] : null;
      if (!container || 1 !== container.nodeType && 9 !== container.nodeType && 11 !== container.nodeType)
        throw Error(formatProdErrorMessage(299));
      return createPortal$1(children, container, null, key);
    };
    reactDom_production.flushSync = function(fn) {
      var previousTransition = ReactSharedInternals.T, previousUpdatePriority = Internals.p;
      try {
        if (ReactSharedInternals.T = null, Internals.p = 2, fn) return fn();
      } finally {
        ReactSharedInternals.T = previousTransition, Internals.p = previousUpdatePriority, Internals.d.f();
      }
    };
    reactDom_production.preconnect = function(href, options) {
      "string" === typeof href && (options ? (options = options.crossOrigin, options = "string" === typeof options ? "use-credentials" === options ? options : "" : void 0) : options = null, Internals.d.C(href, options));
    };
    reactDom_production.prefetchDNS = function(href) {
      "string" === typeof href && Internals.d.D(href);
    };
    reactDom_production.preinit = function(href, options) {
      if ("string" === typeof href && options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin), integrity = "string" === typeof options.integrity ? options.integrity : void 0, fetchPriority = "string" === typeof options.fetchPriority ? options.fetchPriority : void 0;
        "style" === as ? Internals.d.S(
          href,
          "string" === typeof options.precedence ? options.precedence : void 0,
          {
            crossOrigin,
            integrity,
            fetchPriority
          }
        ) : "script" === as && Internals.d.X(href, {
          crossOrigin,
          integrity,
          fetchPriority,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0
        });
      }
    };
    reactDom_production.preinitModule = function(href, options) {
      if ("string" === typeof href)
        if ("object" === typeof options && null !== options) {
          if (null == options.as || "script" === options.as) {
            var crossOrigin = getCrossOriginStringAs(
              options.as,
              options.crossOrigin
            );
            Internals.d.M(href, {
              crossOrigin,
              integrity: "string" === typeof options.integrity ? options.integrity : void 0,
              nonce: "string" === typeof options.nonce ? options.nonce : void 0
            });
          }
        } else null == options && Internals.d.M(href);
    };
    reactDom_production.preload = function(href, options) {
      if ("string" === typeof href && "object" === typeof options && null !== options && "string" === typeof options.as) {
        var as = options.as, crossOrigin = getCrossOriginStringAs(as, options.crossOrigin);
        Internals.d.L(href, as, {
          crossOrigin,
          integrity: "string" === typeof options.integrity ? options.integrity : void 0,
          nonce: "string" === typeof options.nonce ? options.nonce : void 0,
          type: "string" === typeof options.type ? options.type : void 0,
          fetchPriority: "string" === typeof options.fetchPriority ? options.fetchPriority : void 0,
          referrerPolicy: "string" === typeof options.referrerPolicy ? options.referrerPolicy : void 0,
          imageSrcSet: "string" === typeof options.imageSrcSet ? options.imageSrcSet : void 0,
          imageSizes: "string" === typeof options.imageSizes ? options.imageSizes : void 0,
          media: "string" === typeof options.media ? options.media : void 0
        });
      }
    };
    reactDom_production.preloadModule = function(href, options) {
      if ("string" === typeof href)
        if (options) {
          var crossOrigin = getCrossOriginStringAs(options.as, options.crossOrigin);
          Internals.d.m(href, {
            as: "string" === typeof options.as && "script" !== options.as ? options.as : void 0,
            crossOrigin,
            integrity: "string" === typeof options.integrity ? options.integrity : void 0
          });
        } else Internals.d.m(href);
    };
    reactDom_production.requestFormReset = function(form) {
      Internals.d.r(form);
    };
    reactDom_production.unstable_batchedUpdates = function(fn, a2) {
      return fn(a2);
    };
    reactDom_production.useFormState = function(action, initialState2, permalink) {
      return ReactSharedInternals.H.useFormState(action, initialState2, permalink);
    };
    reactDom_production.useFormStatus = function() {
      return ReactSharedInternals.H.useHostTransitionStatus();
    };
    reactDom_production.version = "19.2.0";
    return reactDom_production;
  }
  var hasRequiredReactDom;
  function requireReactDom() {
    if (hasRequiredReactDom) return reactDom.exports;
    hasRequiredReactDom = 1;
    function checkDCE() {
      if (typeof __REACT_DEVTOOLS_GLOBAL_HOOK__ === "undefined" || typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE !== "function") {
        return;
      }
      try {
        __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(checkDCE);
      } catch (err) {
        console.error(err);
      }
    }
    {
      checkDCE();
      reactDom.exports = requireReactDom_production();
    }
    return reactDom.exports;
  }
  var reactDomExports = requireReactDom();
  const ReactDOM = getDefaultExportFromCjs(reactDomExports);
  function setRef$1(ref, value) {
    if (typeof ref === "function") {
      return ref(value);
    } else if (ref !== null && ref !== void 0) {
      ref.current = value;
    }
  }
  function composeRefs$1(...refs) {
    return (node) => {
      let hasCleanup = false;
      const cleanups = refs.map((ref) => {
        const cleanup = setRef$1(ref, node);
        if (!hasCleanup && typeof cleanup == "function") {
          hasCleanup = true;
        }
        return cleanup;
      });
      if (hasCleanup) {
        return () => {
          for (let i2 = 0; i2 < cleanups.length; i2++) {
            const cleanup = cleanups[i2];
            if (typeof cleanup == "function") {
              cleanup();
            } else {
              setRef$1(refs[i2], null);
            }
          }
        };
      }
    };
  }
  function useComposedRefs$1(...refs) {
    return React__namespace.useCallback(composeRefs$1(...refs), refs);
  }
function createSlot(ownerName) {
    const SlotClone = createSlotClone(ownerName);
    const Slot2 = React__namespace.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      const childrenArray = React__namespace.Children.toArray(children);
      const slottable = childrenArray.find(isSlottable);
      if (slottable) {
        const newElement = slottable.props.children;
        const newChildren = childrenArray.map((child) => {
          if (child === slottable) {
            if (React__namespace.Children.count(newElement) > 1) return React__namespace.Children.only(null);
            return React__namespace.isValidElement(newElement) ? newElement.props.children : null;
          } else {
            return child;
          }
        });
        return jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: React__namespace.isValidElement(newElement) ? React__namespace.cloneElement(newElement, void 0, newChildren) : null });
      }
      return jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
    });
    Slot2.displayName = `${ownerName}.Slot`;
    return Slot2;
  }
  var Slot$3 = createSlot("Slot");
function createSlotClone(ownerName) {
    const SlotClone = React__namespace.forwardRef((props, forwardedRef) => {
      const { children, ...slotProps } = props;
      if (React__namespace.isValidElement(children)) {
        const childrenRef = getElementRef$1(children);
        const props2 = mergeProps(slotProps, children.props);
        if (children.type !== React__namespace.Fragment) {
          props2.ref = forwardedRef ? composeRefs$1(forwardedRef, childrenRef) : childrenRef;
        }
        return React__namespace.cloneElement(children, props2);
      }
      return React__namespace.Children.count(children) > 1 ? React__namespace.Children.only(null) : null;
    });
    SlotClone.displayName = `${ownerName}.SlotClone`;
    return SlotClone;
  }
  var SLOTTABLE_IDENTIFIER = Symbol("radix.slottable");
function createSlottable(ownerName) {
    const Slottable2 = ({ children }) => {
      return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children });
    };
    Slottable2.displayName = `${ownerName}.Slottable`;
    Slottable2.__radixId = SLOTTABLE_IDENTIFIER;
    return Slottable2;
  }
  function isSlottable(child) {
    return React__namespace.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
  }
  function mergeProps(slotProps, childProps) {
    const overrideProps = { ...childProps };
    for (const propName in childProps) {
      const slotPropValue = slotProps[propName];
      const childPropValue = childProps[propName];
      const isHandler = /^on[A-Z]/.test(propName);
      if (isHandler) {
        if (slotPropValue && childPropValue) {
          overrideProps[propName] = (...args) => {
            const result = childPropValue(...args);
            slotPropValue(...args);
            return result;
          };
        } else if (slotPropValue) {
          overrideProps[propName] = slotPropValue;
        }
      } else if (propName === "style") {
        overrideProps[propName] = { ...slotPropValue, ...childPropValue };
      } else if (propName === "className") {
        overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
      }
    }
    return { ...slotProps, ...overrideProps };
  }
  function getElementRef$1(element) {
    let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }
  var NODES = [
    "a",
    "button",
    "div",
    "form",
    "h2",
    "h3",
    "img",
    "input",
    "label",
    "li",
    "nav",
    "ol",
    "p",
    "select",
    "span",
    "svg",
    "ul"
  ];
  var Primitive = NODES.reduce((primitive, node) => {
    const Slot2 = createSlot(`Primitive.${node}`);
    const Node2 = React__namespace.forwardRef((props, forwardedRef) => {
      const { asChild, ...primitiveProps } = props;
      const Comp = asChild ? Slot2 : node;
      if (typeof window !== "undefined") {
        window[Symbol.for("radix-ui")] = true;
      }
      return jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
    });
    Node2.displayName = `Primitive.${node}`;
    return { ...primitive, [node]: Node2 };
  }, {});
  function dispatchDiscreteCustomEvent(target, event) {
    if (target) reactDomExports.flushSync(() => target.dispatchEvent(event));
  }
  var useLayoutEffect2 = globalThis?.document ? React__namespace.useLayoutEffect : () => {
  };
  function useStateMachine$1(initialState2, machine) {
    return React__namespace.useReducer((state, event) => {
      const nextState = machine[state][event];
      return nextState ?? state;
    }, initialState2);
  }
  var Presence = (props) => {
    const { present, children } = props;
    const presence = usePresence$1(present);
    const child = typeof children === "function" ? children({ present: presence.isPresent }) : React__namespace.Children.only(children);
    const ref = useComposedRefs$1(presence.ref, getElementRef(child));
    const forceMount = typeof children === "function";
    return forceMount || presence.isPresent ? React__namespace.cloneElement(child, { ref }) : null;
  };
  Presence.displayName = "Presence";
  function usePresence$1(present) {
    const [node, setNode] = React__namespace.useState();
    const stylesRef = React__namespace.useRef(null);
    const prevPresentRef = React__namespace.useRef(present);
    const prevAnimationNameRef = React__namespace.useRef("none");
    const initialState2 = present ? "mounted" : "unmounted";
    const [state, send] = useStateMachine$1(initialState2, {
      mounted: {
        UNMOUNT: "unmounted",
        ANIMATION_OUT: "unmountSuspended"
      },
      unmountSuspended: {
        MOUNT: "mounted",
        ANIMATION_END: "unmounted"
      },
      unmounted: {
        MOUNT: "mounted"
      }
    });
    React__namespace.useEffect(() => {
      const currentAnimationName = getAnimationName(stylesRef.current);
      prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
    }, [state]);
    useLayoutEffect2(() => {
      const styles = stylesRef.current;
      const wasPresent = prevPresentRef.current;
      const hasPresentChanged = wasPresent !== present;
      if (hasPresentChanged) {
        const prevAnimationName = prevAnimationNameRef.current;
        const currentAnimationName = getAnimationName(styles);
        if (present) {
          send("MOUNT");
        } else if (currentAnimationName === "none" || styles?.display === "none") {
          send("UNMOUNT");
        } else {
          const isAnimating = prevAnimationName !== currentAnimationName;
          if (wasPresent && isAnimating) {
            send("ANIMATION_OUT");
          } else {
            send("UNMOUNT");
          }
        }
        prevPresentRef.current = present;
      }
    }, [present, send]);
    useLayoutEffect2(() => {
      if (node) {
        let timeoutId;
        const ownerWindow = node.ownerDocument.defaultView ?? window;
        const handleAnimationEnd = (event) => {
          const currentAnimationName = getAnimationName(stylesRef.current);
          const isCurrentAnimation = currentAnimationName.includes(CSS.escape(event.animationName));
          if (event.target === node && isCurrentAnimation) {
            send("ANIMATION_END");
            if (!prevPresentRef.current) {
              const currentFillMode = node.style.animationFillMode;
              node.style.animationFillMode = "forwards";
              timeoutId = ownerWindow.setTimeout(() => {
                if (node.style.animationFillMode === "forwards") {
                  node.style.animationFillMode = currentFillMode;
                }
              });
            }
          }
        };
        const handleAnimationStart = (event) => {
          if (event.target === node) {
            prevAnimationNameRef.current = getAnimationName(stylesRef.current);
          }
        };
        node.addEventListener("animationstart", handleAnimationStart);
        node.addEventListener("animationcancel", handleAnimationEnd);
        node.addEventListener("animationend", handleAnimationEnd);
        return () => {
          ownerWindow.clearTimeout(timeoutId);
          node.removeEventListener("animationstart", handleAnimationStart);
          node.removeEventListener("animationcancel", handleAnimationEnd);
          node.removeEventListener("animationend", handleAnimationEnd);
        };
      } else {
        send("ANIMATION_END");
      }
    }, [node, send]);
    return {
      isPresent: ["mounted", "unmountSuspended"].includes(state),
      ref: React__namespace.useCallback((node2) => {
        stylesRef.current = node2 ? getComputedStyle(node2) : null;
        setNode(node2);
      }, [])
    };
  }
  function getAnimationName(styles) {
    return styles?.animationName || "none";
  }
  function getElementRef(element) {
    let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
    let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.ref;
    }
    getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
    mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
    if (mayWarn) {
      return element.props.ref;
    }
    return element.props.ref || element.ref;
  }
  function createContext2(rootComponentName, defaultContext) {
    const Context = React__namespace.createContext(defaultContext);
    const Provider2 = (props) => {
      const { children, ...context } = props;
      const value = React__namespace.useMemo(() => context, Object.values(context));
      return jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider2.displayName = rootComponentName + "Provider";
    function useContext2(consumerName) {
      const context = React__namespace.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider2, useContext2];
  }
  function createContextScope(scopeName, createContextScopeDeps = []) {
    let defaultContexts = [];
    function createContext3(rootComponentName, defaultContext) {
      const BaseContext = React__namespace.createContext(defaultContext);
      const index2 = defaultContexts.length;
      defaultContexts = [...defaultContexts, defaultContext];
      const Provider2 = (props) => {
        const { scope, children, ...context } = props;
        const Context = scope?.[scopeName]?.[index2] || BaseContext;
        const value = React__namespace.useMemo(() => context, Object.values(context));
        return jsxRuntimeExports.jsx(Context.Provider, { value, children });
      };
      Provider2.displayName = rootComponentName + "Provider";
      function useContext2(consumerName, scope) {
        const Context = scope?.[scopeName]?.[index2] || BaseContext;
        const context = React__namespace.useContext(Context);
        if (context) return context;
        if (defaultContext !== void 0) return defaultContext;
        throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
      }
      return [Provider2, useContext2];
    }
    const createScope = () => {
      const scopeContexts = defaultContexts.map((defaultContext) => {
        return React__namespace.createContext(defaultContext);
      });
      return function useScope(scope) {
        const contexts = scope?.[scopeName] || scopeContexts;
        return React__namespace.useMemo(
          () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
          [scope, contexts]
        );
      };
    };
    createScope.scopeName = scopeName;
    return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
  }
  function composeContextScopes(...scopes) {
    const baseScope = scopes[0];
    if (scopes.length === 1) return baseScope;
    const createScope = () => {
      const scopeHooks = scopes.map((createScope2) => ({
        useScope: createScope2(),
        scopeName: createScope2.scopeName
      }));
      return function useComposedScopes(overrideScopes) {
        const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
          const scopeProps = useScope(overrideScopes);
          const currentScope = scopeProps[`__scope${scopeName}`];
          return { ...nextScopes2, ...currentScope };
        }, {});
        return React__namespace.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
      };
    };
    createScope.scopeName = baseScope.scopeName;
    return createScope;
  }
  function useCallbackRef$1(callback) {
    const callbackRef = React__namespace.useRef(callback);
    React__namespace.useEffect(() => {
      callbackRef.current = callback;
    });
    return React__namespace.useMemo(() => (...args) => callbackRef.current?.(...args), []);
  }
  var DirectionContext = React__namespace.createContext(void 0);
  function useDirection(localDir) {
    const globalDir = React__namespace.useContext(DirectionContext);
    return localDir || globalDir || "ltr";
  }
  function clamp$2(value, [min2, max2]) {
    return Math.min(max2, Math.max(min2, value));
  }
  function composeEventHandlers(originalEventHandler, ourEventHandler, { checkForDefaultPrevented = true } = {}) {
    return function handleEvent(event) {
      originalEventHandler?.(event);
      if (checkForDefaultPrevented === false || !event.defaultPrevented) {
        return ourEventHandler?.(event);
      }
    };
  }
  function useStateMachine(initialState2, machine) {
    return React__namespace.useReducer((state, event) => {
      const nextState = machine[state][event];
      return nextState ?? state;
    }, initialState2);
  }
  var SCROLL_AREA_NAME = "ScrollArea";
  var [createScrollAreaContext] = createContextScope(SCROLL_AREA_NAME);
  var [ScrollAreaProvider, useScrollAreaContext] = createScrollAreaContext(SCROLL_AREA_NAME);
  var ScrollArea$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeScrollArea,
        type = "hover",
        dir,
        scrollHideDelay = 600,
        ...scrollAreaProps
      } = props;
      const [scrollArea, setScrollArea] = React__namespace.useState(null);
      const [viewport, setViewport] = React__namespace.useState(null);
      const [content, setContent] = React__namespace.useState(null);
      const [scrollbarX, setScrollbarX] = React__namespace.useState(null);
      const [scrollbarY, setScrollbarY] = React__namespace.useState(null);
      const [cornerWidth, setCornerWidth] = React__namespace.useState(0);
      const [cornerHeight, setCornerHeight] = React__namespace.useState(0);
      const [scrollbarXEnabled, setScrollbarXEnabled] = React__namespace.useState(false);
      const [scrollbarYEnabled, setScrollbarYEnabled] = React__namespace.useState(false);
      const composedRefs = useComposedRefs$1(forwardedRef, (node) => setScrollArea(node));
      const direction = useDirection(dir);
      return jsxRuntimeExports.jsx(
        ScrollAreaProvider,
        {
          scope: __scopeScrollArea,
          type,
          dir: direction,
          scrollHideDelay,
          scrollArea,
          viewport,
          onViewportChange: setViewport,
          content,
          onContentChange: setContent,
          scrollbarX,
          onScrollbarXChange: setScrollbarX,
          scrollbarXEnabled,
          onScrollbarXEnabledChange: setScrollbarXEnabled,
          scrollbarY,
          onScrollbarYChange: setScrollbarY,
          scrollbarYEnabled,
          onScrollbarYEnabledChange: setScrollbarYEnabled,
          onCornerWidthChange: setCornerWidth,
          onCornerHeightChange: setCornerHeight,
          children: jsxRuntimeExports.jsx(
            Primitive.div,
            {
              dir: direction,
              ...scrollAreaProps,
              ref: composedRefs,
              style: {
                position: "relative",
["--radix-scroll-area-corner-width"]: cornerWidth + "px",
                ["--radix-scroll-area-corner-height"]: cornerHeight + "px",
                ...props.style
              }
            }
          )
        }
      );
    }
  );
  ScrollArea$1.displayName = SCROLL_AREA_NAME;
  var VIEWPORT_NAME = "ScrollAreaViewport";
  var ScrollAreaViewport = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeScrollArea, children, nonce, ...viewportProps } = props;
      const context = useScrollAreaContext(VIEWPORT_NAME, __scopeScrollArea);
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs$1(forwardedRef, ref, context.onViewportChange);
      return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(
          "style",
          {
            dangerouslySetInnerHTML: {
              __html: `[data-radix-scroll-area-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-scroll-area-viewport]::-webkit-scrollbar{display:none}`
            },
            nonce
          }
        ),
jsxRuntimeExports.jsx(
          Primitive.div,
          {
            "data-radix-scroll-area-viewport": "",
            ...viewportProps,
            ref: composedRefs,
            style: {
overflowX: context.scrollbarXEnabled ? "scroll" : "hidden",
              overflowY: context.scrollbarYEnabled ? "scroll" : "hidden",
              ...props.style
            },
            children: jsxRuntimeExports.jsx("div", { ref: context.onContentChange, style: { minWidth: "100%", display: "table" }, children })
          }
        )
      ] });
    }
  );
  ScrollAreaViewport.displayName = VIEWPORT_NAME;
  var SCROLLBAR_NAME = "ScrollAreaScrollbar";
  var ScrollAreaScrollbar = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { forceMount, ...scrollbarProps } = props;
      const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
      const { onScrollbarXEnabledChange, onScrollbarYEnabledChange } = context;
      const isHorizontal = props.orientation === "horizontal";
      React__namespace.useEffect(() => {
        isHorizontal ? onScrollbarXEnabledChange(true) : onScrollbarYEnabledChange(true);
        return () => {
          isHorizontal ? onScrollbarXEnabledChange(false) : onScrollbarYEnabledChange(false);
        };
      }, [isHorizontal, onScrollbarXEnabledChange, onScrollbarYEnabledChange]);
      return context.type === "hover" ? jsxRuntimeExports.jsx(ScrollAreaScrollbarHover, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "scroll" ? jsxRuntimeExports.jsx(ScrollAreaScrollbarScroll, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "auto" ? jsxRuntimeExports.jsx(ScrollAreaScrollbarAuto, { ...scrollbarProps, ref: forwardedRef, forceMount }) : context.type === "always" ? jsxRuntimeExports.jsx(ScrollAreaScrollbarVisible, { ...scrollbarProps, ref: forwardedRef }) : null;
    }
  );
  ScrollAreaScrollbar.displayName = SCROLLBAR_NAME;
  var ScrollAreaScrollbarHover = React__namespace.forwardRef((props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const [visible, setVisible] = React__namespace.useState(false);
    React__namespace.useEffect(() => {
      const scrollArea = context.scrollArea;
      let hideTimer = 0;
      if (scrollArea) {
        const handlePointerEnter = () => {
          window.clearTimeout(hideTimer);
          setVisible(true);
        };
        const handlePointerLeave = () => {
          hideTimer = window.setTimeout(() => setVisible(false), context.scrollHideDelay);
        };
        scrollArea.addEventListener("pointerenter", handlePointerEnter);
        scrollArea.addEventListener("pointerleave", handlePointerLeave);
        return () => {
          window.clearTimeout(hideTimer);
          scrollArea.removeEventListener("pointerenter", handlePointerEnter);
          scrollArea.removeEventListener("pointerleave", handlePointerLeave);
        };
      }
    }, [context.scrollArea, context.scrollHideDelay]);
    return jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: jsxRuntimeExports.jsx(
      ScrollAreaScrollbarAuto,
      {
        "data-state": visible ? "visible" : "hidden",
        ...scrollbarProps,
        ref: forwardedRef
      }
    ) });
  });
  var ScrollAreaScrollbarScroll = React__namespace.forwardRef((props, forwardedRef) => {
    const { forceMount, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const isHorizontal = props.orientation === "horizontal";
    const debounceScrollEnd = useDebounceCallback(() => send("SCROLL_END"), 100);
    const [state, send] = useStateMachine("hidden", {
      hidden: {
        SCROLL: "scrolling"
      },
      scrolling: {
        SCROLL_END: "idle",
        POINTER_ENTER: "interacting"
      },
      interacting: {
        SCROLL: "interacting",
        POINTER_LEAVE: "idle"
      },
      idle: {
        HIDE: "hidden",
        SCROLL: "scrolling",
        POINTER_ENTER: "interacting"
      }
    });
    React__namespace.useEffect(() => {
      if (state === "idle") {
        const hideTimer = window.setTimeout(() => send("HIDE"), context.scrollHideDelay);
        return () => window.clearTimeout(hideTimer);
      }
    }, [state, context.scrollHideDelay, send]);
    React__namespace.useEffect(() => {
      const viewport = context.viewport;
      const scrollDirection = isHorizontal ? "scrollLeft" : "scrollTop";
      if (viewport) {
        let prevScrollPos = viewport[scrollDirection];
        const handleScroll2 = () => {
          const scrollPos = viewport[scrollDirection];
          const hasScrollInDirectionChanged = prevScrollPos !== scrollPos;
          if (hasScrollInDirectionChanged) {
            send("SCROLL");
            debounceScrollEnd();
          }
          prevScrollPos = scrollPos;
        };
        viewport.addEventListener("scroll", handleScroll2);
        return () => viewport.removeEventListener("scroll", handleScroll2);
      }
    }, [context.viewport, isHorizontal, send, debounceScrollEnd]);
    return jsxRuntimeExports.jsx(Presence, { present: forceMount || state !== "hidden", children: jsxRuntimeExports.jsx(
      ScrollAreaScrollbarVisible,
      {
        "data-state": state === "hidden" ? "hidden" : "visible",
        ...scrollbarProps,
        ref: forwardedRef,
        onPointerEnter: composeEventHandlers(props.onPointerEnter, () => send("POINTER_ENTER")),
        onPointerLeave: composeEventHandlers(props.onPointerLeave, () => send("POINTER_LEAVE"))
      }
    ) });
  });
  var ScrollAreaScrollbarAuto = React__namespace.forwardRef((props, forwardedRef) => {
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const { forceMount, ...scrollbarProps } = props;
    const [visible, setVisible] = React__namespace.useState(false);
    const isHorizontal = props.orientation === "horizontal";
    const handleResize = useDebounceCallback(() => {
      if (context.viewport) {
        const isOverflowX = context.viewport.offsetWidth < context.viewport.scrollWidth;
        const isOverflowY = context.viewport.offsetHeight < context.viewport.scrollHeight;
        setVisible(isHorizontal ? isOverflowX : isOverflowY);
      }
    }, 10);
    useResizeObserver(context.viewport, handleResize);
    useResizeObserver(context.content, handleResize);
    return jsxRuntimeExports.jsx(Presence, { present: forceMount || visible, children: jsxRuntimeExports.jsx(
      ScrollAreaScrollbarVisible,
      {
        "data-state": visible ? "visible" : "hidden",
        ...scrollbarProps,
        ref: forwardedRef
      }
    ) });
  });
  var ScrollAreaScrollbarVisible = React__namespace.forwardRef((props, forwardedRef) => {
    const { orientation = "vertical", ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const thumbRef = React__namespace.useRef(null);
    const pointerOffsetRef = React__namespace.useRef(0);
    const [sizes, setSizes] = React__namespace.useState({
      content: 0,
      viewport: 0,
      scrollbar: { size: 0, paddingStart: 0, paddingEnd: 0 }
    });
    const thumbRatio = getThumbRatio(sizes.viewport, sizes.content);
    const commonProps = {
      ...scrollbarProps,
      sizes,
      onSizesChange: setSizes,
      hasThumb: Boolean(thumbRatio > 0 && thumbRatio < 1),
      onThumbChange: (thumb) => thumbRef.current = thumb,
      onThumbPointerUp: () => pointerOffsetRef.current = 0,
      onThumbPointerDown: (pointerPos) => pointerOffsetRef.current = pointerPos
    };
    function getScrollPosition(pointerPos, dir) {
      return getScrollPositionFromPointer(pointerPos, pointerOffsetRef.current, sizes, dir);
    }
    if (orientation === "horizontal") {
      return jsxRuntimeExports.jsx(
        ScrollAreaScrollbarX,
        {
          ...commonProps,
          ref: forwardedRef,
          onThumbPositionChange: () => {
            if (context.viewport && thumbRef.current) {
              const scrollPos = context.viewport.scrollLeft;
              const offset2 = getThumbOffsetFromScroll(scrollPos, sizes, context.dir);
              thumbRef.current.style.transform = `translate3d(${offset2}px, 0, 0)`;
            }
          },
          onWheelScroll: (scrollPos) => {
            if (context.viewport) context.viewport.scrollLeft = scrollPos;
          },
          onDragScroll: (pointerPos) => {
            if (context.viewport) {
              context.viewport.scrollLeft = getScrollPosition(pointerPos, context.dir);
            }
          }
        }
      );
    }
    if (orientation === "vertical") {
      return jsxRuntimeExports.jsx(
        ScrollAreaScrollbarY,
        {
          ...commonProps,
          ref: forwardedRef,
          onThumbPositionChange: () => {
            if (context.viewport && thumbRef.current) {
              const scrollPos = context.viewport.scrollTop;
              const offset2 = getThumbOffsetFromScroll(scrollPos, sizes);
              thumbRef.current.style.transform = `translate3d(0, ${offset2}px, 0)`;
            }
          },
          onWheelScroll: (scrollPos) => {
            if (context.viewport) context.viewport.scrollTop = scrollPos;
          },
          onDragScroll: (pointerPos) => {
            if (context.viewport) context.viewport.scrollTop = getScrollPosition(pointerPos);
          }
        }
      );
    }
    return null;
  });
  var ScrollAreaScrollbarX = React__namespace.forwardRef((props, forwardedRef) => {
    const { sizes, onSizesChange, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const [computedStyle, setComputedStyle] = React__namespace.useState();
    const ref = React__namespace.useRef(null);
    const composeRefs2 = useComposedRefs$1(forwardedRef, ref, context.onScrollbarXChange);
    React__namespace.useEffect(() => {
      if (ref.current) setComputedStyle(getComputedStyle(ref.current));
    }, [ref]);
    return jsxRuntimeExports.jsx(
      ScrollAreaScrollbarImpl,
      {
        "data-orientation": "horizontal",
        ...scrollbarProps,
        ref: composeRefs2,
        sizes,
        style: {
          bottom: 0,
          left: context.dir === "rtl" ? "var(--radix-scroll-area-corner-width)" : 0,
          right: context.dir === "ltr" ? "var(--radix-scroll-area-corner-width)" : 0,
          ["--radix-scroll-area-thumb-width"]: getThumbSize(sizes) + "px",
          ...props.style
        },
        onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.x),
        onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.x),
        onWheelScroll: (event, maxScrollPos) => {
          if (context.viewport) {
            const scrollPos = context.viewport.scrollLeft + event.deltaX;
            props.onWheelScroll(scrollPos);
            if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
              event.preventDefault();
            }
          }
        },
        onResize: () => {
          if (ref.current && context.viewport && computedStyle) {
            onSizesChange({
              content: context.viewport.scrollWidth,
              viewport: context.viewport.offsetWidth,
              scrollbar: {
                size: ref.current.clientWidth,
                paddingStart: toInt$1(computedStyle.paddingLeft),
                paddingEnd: toInt$1(computedStyle.paddingRight)
              }
            });
          }
        }
      }
    );
  });
  var ScrollAreaScrollbarY = React__namespace.forwardRef((props, forwardedRef) => {
    const { sizes, onSizesChange, ...scrollbarProps } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, props.__scopeScrollArea);
    const [computedStyle, setComputedStyle] = React__namespace.useState();
    const ref = React__namespace.useRef(null);
    const composeRefs2 = useComposedRefs$1(forwardedRef, ref, context.onScrollbarYChange);
    React__namespace.useEffect(() => {
      if (ref.current) setComputedStyle(getComputedStyle(ref.current));
    }, [ref]);
    return jsxRuntimeExports.jsx(
      ScrollAreaScrollbarImpl,
      {
        "data-orientation": "vertical",
        ...scrollbarProps,
        ref: composeRefs2,
        sizes,
        style: {
          top: 0,
          right: context.dir === "ltr" ? 0 : void 0,
          left: context.dir === "rtl" ? 0 : void 0,
          bottom: "var(--radix-scroll-area-corner-height)",
          ["--radix-scroll-area-thumb-height"]: getThumbSize(sizes) + "px",
          ...props.style
        },
        onThumbPointerDown: (pointerPos) => props.onThumbPointerDown(pointerPos.y),
        onDragScroll: (pointerPos) => props.onDragScroll(pointerPos.y),
        onWheelScroll: (event, maxScrollPos) => {
          if (context.viewport) {
            const scrollPos = context.viewport.scrollTop + event.deltaY;
            props.onWheelScroll(scrollPos);
            if (isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos)) {
              event.preventDefault();
            }
          }
        },
        onResize: () => {
          if (ref.current && context.viewport && computedStyle) {
            onSizesChange({
              content: context.viewport.scrollHeight,
              viewport: context.viewport.offsetHeight,
              scrollbar: {
                size: ref.current.clientHeight,
                paddingStart: toInt$1(computedStyle.paddingTop),
                paddingEnd: toInt$1(computedStyle.paddingBottom)
              }
            });
          }
        }
      }
    );
  });
  var [ScrollbarProvider, useScrollbarContext] = createScrollAreaContext(SCROLLBAR_NAME);
  var ScrollAreaScrollbarImpl = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      __scopeScrollArea,
      sizes,
      hasThumb,
      onThumbChange,
      onThumbPointerUp,
      onThumbPointerDown,
      onThumbPositionChange,
      onDragScroll,
      onWheelScroll,
      onResize,
      ...scrollbarProps
    } = props;
    const context = useScrollAreaContext(SCROLLBAR_NAME, __scopeScrollArea);
    const [scrollbar, setScrollbar] = React__namespace.useState(null);
    const composeRefs2 = useComposedRefs$1(forwardedRef, (node) => setScrollbar(node));
    const rectRef = React__namespace.useRef(null);
    const prevWebkitUserSelectRef = React__namespace.useRef("");
    const viewport = context.viewport;
    const maxScrollPos = sizes.content - sizes.viewport;
    const handleWheelScroll = useCallbackRef$1(onWheelScroll);
    const handleThumbPositionChange = useCallbackRef$1(onThumbPositionChange);
    const handleResize = useDebounceCallback(onResize, 10);
    function handleDragScroll(event) {
      if (rectRef.current) {
        const x2 = event.clientX - rectRef.current.left;
        const y = event.clientY - rectRef.current.top;
        onDragScroll({ x: x2, y });
      }
    }
    React__namespace.useEffect(() => {
      const handleWheel = (event) => {
        const element = event.target;
        const isScrollbarWheel = scrollbar?.contains(element);
        if (isScrollbarWheel) handleWheelScroll(event, maxScrollPos);
      };
      document.addEventListener("wheel", handleWheel, { passive: false });
      return () => document.removeEventListener("wheel", handleWheel, { passive: false });
    }, [viewport, scrollbar, maxScrollPos, handleWheelScroll]);
    React__namespace.useEffect(handleThumbPositionChange, [sizes, handleThumbPositionChange]);
    useResizeObserver(scrollbar, handleResize);
    useResizeObserver(context.content, handleResize);
    return jsxRuntimeExports.jsx(
      ScrollbarProvider,
      {
        scope: __scopeScrollArea,
        scrollbar,
        hasThumb,
        onThumbChange: useCallbackRef$1(onThumbChange),
        onThumbPointerUp: useCallbackRef$1(onThumbPointerUp),
        onThumbPositionChange: handleThumbPositionChange,
        onThumbPointerDown: useCallbackRef$1(onThumbPointerDown),
        children: jsxRuntimeExports.jsx(
          Primitive.div,
          {
            ...scrollbarProps,
            ref: composeRefs2,
            style: { position: "absolute", ...scrollbarProps.style },
            onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
              const mainPointer = 0;
              if (event.button === mainPointer) {
                const element = event.target;
                element.setPointerCapture(event.pointerId);
                rectRef.current = scrollbar.getBoundingClientRect();
                prevWebkitUserSelectRef.current = document.body.style.webkitUserSelect;
                document.body.style.webkitUserSelect = "none";
                if (context.viewport) context.viewport.style.scrollBehavior = "auto";
                handleDragScroll(event);
              }
            }),
            onPointerMove: composeEventHandlers(props.onPointerMove, handleDragScroll),
            onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
              const element = event.target;
              if (element.hasPointerCapture(event.pointerId)) {
                element.releasePointerCapture(event.pointerId);
              }
              document.body.style.webkitUserSelect = prevWebkitUserSelectRef.current;
              if (context.viewport) context.viewport.style.scrollBehavior = "";
              rectRef.current = null;
            })
          }
        )
      }
    );
  });
  var THUMB_NAME = "ScrollAreaThumb";
  var ScrollAreaThumb = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { forceMount, ...thumbProps } = props;
      const scrollbarContext = useScrollbarContext(THUMB_NAME, props.__scopeScrollArea);
      return jsxRuntimeExports.jsx(Presence, { present: forceMount || scrollbarContext.hasThumb, children: jsxRuntimeExports.jsx(ScrollAreaThumbImpl, { ref: forwardedRef, ...thumbProps }) });
    }
  );
  var ScrollAreaThumbImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeScrollArea, style: style2, ...thumbProps } = props;
      const scrollAreaContext = useScrollAreaContext(THUMB_NAME, __scopeScrollArea);
      const scrollbarContext = useScrollbarContext(THUMB_NAME, __scopeScrollArea);
      const { onThumbPositionChange } = scrollbarContext;
      const composedRef = useComposedRefs$1(
        forwardedRef,
        (node) => scrollbarContext.onThumbChange(node)
      );
      const removeUnlinkedScrollListenerRef = React__namespace.useRef(void 0);
      const debounceScrollEnd = useDebounceCallback(() => {
        if (removeUnlinkedScrollListenerRef.current) {
          removeUnlinkedScrollListenerRef.current();
          removeUnlinkedScrollListenerRef.current = void 0;
        }
      }, 100);
      React__namespace.useEffect(() => {
        const viewport = scrollAreaContext.viewport;
        if (viewport) {
          const handleScroll2 = () => {
            debounceScrollEnd();
            if (!removeUnlinkedScrollListenerRef.current) {
              const listener = addUnlinkedScrollListener(viewport, onThumbPositionChange);
              removeUnlinkedScrollListenerRef.current = listener;
              onThumbPositionChange();
            }
          };
          onThumbPositionChange();
          viewport.addEventListener("scroll", handleScroll2);
          return () => viewport.removeEventListener("scroll", handleScroll2);
        }
      }, [scrollAreaContext.viewport, debounceScrollEnd, onThumbPositionChange]);
      return jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": scrollbarContext.hasThumb ? "visible" : "hidden",
          ...thumbProps,
          ref: composedRef,
          style: {
            width: "var(--radix-scroll-area-thumb-width)",
            height: "var(--radix-scroll-area-thumb-height)",
            ...style2
          },
          onPointerDownCapture: composeEventHandlers(props.onPointerDownCapture, (event) => {
            const thumb = event.target;
            const thumbRect = thumb.getBoundingClientRect();
            const x2 = event.clientX - thumbRect.left;
            const y = event.clientY - thumbRect.top;
            scrollbarContext.onThumbPointerDown({ x: x2, y });
          }),
          onPointerUp: composeEventHandlers(props.onPointerUp, scrollbarContext.onThumbPointerUp)
        }
      );
    }
  );
  ScrollAreaThumb.displayName = THUMB_NAME;
  var CORNER_NAME = "ScrollAreaCorner";
  var ScrollAreaCorner = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const context = useScrollAreaContext(CORNER_NAME, props.__scopeScrollArea);
      const hasBothScrollbarsVisible = Boolean(context.scrollbarX && context.scrollbarY);
      const hasCorner = context.type !== "scroll" && hasBothScrollbarsVisible;
      return hasCorner ? jsxRuntimeExports.jsx(ScrollAreaCornerImpl, { ...props, ref: forwardedRef }) : null;
    }
  );
  ScrollAreaCorner.displayName = CORNER_NAME;
  var ScrollAreaCornerImpl = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeScrollArea, ...cornerProps } = props;
    const context = useScrollAreaContext(CORNER_NAME, __scopeScrollArea);
    const [width, setWidth] = React__namespace.useState(0);
    const [height, setHeight] = React__namespace.useState(0);
    const hasSize = Boolean(width && height);
    useResizeObserver(context.scrollbarX, () => {
      const height2 = context.scrollbarX?.offsetHeight || 0;
      context.onCornerHeightChange(height2);
      setHeight(height2);
    });
    useResizeObserver(context.scrollbarY, () => {
      const width2 = context.scrollbarY?.offsetWidth || 0;
      context.onCornerWidthChange(width2);
      setWidth(width2);
    });
    return hasSize ? jsxRuntimeExports.jsx(
      Primitive.div,
      {
        ...cornerProps,
        ref: forwardedRef,
        style: {
          width,
          height,
          position: "absolute",
          right: context.dir === "ltr" ? 0 : void 0,
          left: context.dir === "rtl" ? 0 : void 0,
          bottom: 0,
          ...props.style
        }
      }
    ) : null;
  });
  function toInt$1(value) {
    return value ? parseInt(value, 10) : 0;
  }
  function getThumbRatio(viewportSize, contentSize) {
    const ratio = viewportSize / contentSize;
    return isNaN(ratio) ? 0 : ratio;
  }
  function getThumbSize(sizes) {
    const ratio = getThumbRatio(sizes.viewport, sizes.content);
    const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
    const thumbSize = (sizes.scrollbar.size - scrollbarPadding) * ratio;
    return Math.max(thumbSize, 18);
  }
  function getScrollPositionFromPointer(pointerPos, pointerOffset, sizes, dir = "ltr") {
    const thumbSizePx = getThumbSize(sizes);
    const thumbCenter = thumbSizePx / 2;
    const offset2 = pointerOffset || thumbCenter;
    const thumbOffsetFromEnd = thumbSizePx - offset2;
    const minPointerPos = sizes.scrollbar.paddingStart + offset2;
    const maxPointerPos = sizes.scrollbar.size - sizes.scrollbar.paddingEnd - thumbOffsetFromEnd;
    const maxScrollPos = sizes.content - sizes.viewport;
    const scrollRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
    const interpolate2 = linearScale([minPointerPos, maxPointerPos], scrollRange);
    return interpolate2(pointerPos);
  }
  function getThumbOffsetFromScroll(scrollPos, sizes, dir = "ltr") {
    const thumbSizePx = getThumbSize(sizes);
    const scrollbarPadding = sizes.scrollbar.paddingStart + sizes.scrollbar.paddingEnd;
    const scrollbar = sizes.scrollbar.size - scrollbarPadding;
    const maxScrollPos = sizes.content - sizes.viewport;
    const maxThumbPos = scrollbar - thumbSizePx;
    const scrollClampRange = dir === "ltr" ? [0, maxScrollPos] : [maxScrollPos * -1, 0];
    const scrollWithoutMomentum = clamp$2(scrollPos, scrollClampRange);
    const interpolate2 = linearScale([0, maxScrollPos], [0, maxThumbPos]);
    return interpolate2(scrollWithoutMomentum);
  }
  function linearScale(input, output) {
    return (value) => {
      if (input[0] === input[1] || output[0] === output[1]) return output[0];
      const ratio = (output[1] - output[0]) / (input[1] - input[0]);
      return output[0] + ratio * (value - input[0]);
    };
  }
  function isScrollingWithinScrollbarBounds(scrollPos, maxScrollPos) {
    return scrollPos > 0 && scrollPos < maxScrollPos;
  }
  var addUnlinkedScrollListener = (node, handler = () => {
  }) => {
    let prevPosition = { left: node.scrollLeft, top: node.scrollTop };
    let rAF = 0;
    (function loop() {
      const position = { left: node.scrollLeft, top: node.scrollTop };
      const isHorizontalScroll = prevPosition.left !== position.left;
      const isVerticalScroll = prevPosition.top !== position.top;
      if (isHorizontalScroll || isVerticalScroll) handler();
      prevPosition = position;
      rAF = window.requestAnimationFrame(loop);
    })();
    return () => window.cancelAnimationFrame(rAF);
  };
  function useDebounceCallback(callback, delay2) {
    const handleCallback = useCallbackRef$1(callback);
    const debounceTimerRef = React__namespace.useRef(0);
    React__namespace.useEffect(() => () => window.clearTimeout(debounceTimerRef.current), []);
    return React__namespace.useCallback(() => {
      window.clearTimeout(debounceTimerRef.current);
      debounceTimerRef.current = window.setTimeout(handleCallback, delay2);
    }, [handleCallback, delay2]);
  }
  function useResizeObserver(element, onResize) {
    const handleResize = useCallbackRef$1(onResize);
    useLayoutEffect2(() => {
      let rAF = 0;
      if (element) {
        const resizeObserver = new ResizeObserver(() => {
          cancelAnimationFrame(rAF);
          rAF = window.requestAnimationFrame(handleResize);
        });
        resizeObserver.observe(element);
        return () => {
          window.cancelAnimationFrame(rAF);
          resizeObserver.unobserve(element);
        };
      }
    }, [element, handleResize]);
  }
  var Root$6 = ScrollArea$1;
  var Viewport = ScrollAreaViewport;
  var Corner = ScrollAreaCorner;
  const CLASS_PART_SEPARATOR = "-";
  const createClassGroupUtils = (config2) => {
    const classMap = createClassMap(config2);
    const {
      conflictingClassGroups,
      conflictingClassGroupModifiers
    } = config2;
    const getClassGroupId = (className) => {
      const classParts = className.split(CLASS_PART_SEPARATOR);
      if (classParts[0] === "" && classParts.length !== 1) {
        classParts.shift();
      }
      return getGroupRecursive(classParts, classMap) || getGroupIdForArbitraryProperty(className);
    };
    const getConflictingClassGroupIds = (classGroupId, hasPostfixModifier) => {
      const conflicts = conflictingClassGroups[classGroupId] || [];
      if (hasPostfixModifier && conflictingClassGroupModifiers[classGroupId]) {
        return [...conflicts, ...conflictingClassGroupModifiers[classGroupId]];
      }
      return conflicts;
    };
    return {
      getClassGroupId,
      getConflictingClassGroupIds
    };
  };
  const getGroupRecursive = (classParts, classPartObject) => {
    if (classParts.length === 0) {
      return classPartObject.classGroupId;
    }
    const currentClassPart = classParts[0];
    const nextClassPartObject = classPartObject.nextPart.get(currentClassPart);
    const classGroupFromNextClassPart = nextClassPartObject ? getGroupRecursive(classParts.slice(1), nextClassPartObject) : void 0;
    if (classGroupFromNextClassPart) {
      return classGroupFromNextClassPart;
    }
    if (classPartObject.validators.length === 0) {
      return void 0;
    }
    const classRest = classParts.join(CLASS_PART_SEPARATOR);
    return classPartObject.validators.find(({
      validator
    }) => validator(classRest))?.classGroupId;
  };
  const arbitraryPropertyRegex = /^\[(.+)\]$/;
  const getGroupIdForArbitraryProperty = (className) => {
    if (arbitraryPropertyRegex.test(className)) {
      const arbitraryPropertyClassName = arbitraryPropertyRegex.exec(className)[1];
      const property = arbitraryPropertyClassName?.substring(0, arbitraryPropertyClassName.indexOf(":"));
      if (property) {
        return "arbitrary.." + property;
      }
    }
  };
  const createClassMap = (config2) => {
    const {
      theme,
      classGroups
    } = config2;
    const classMap = {
      nextPart: new Map(),
      validators: []
    };
    for (const classGroupId in classGroups) {
      processClassesRecursively(classGroups[classGroupId], classMap, classGroupId, theme);
    }
    return classMap;
  };
  const processClassesRecursively = (classGroup, classPartObject, classGroupId, theme) => {
    classGroup.forEach((classDefinition) => {
      if (typeof classDefinition === "string") {
        const classPartObjectToEdit = classDefinition === "" ? classPartObject : getPart(classPartObject, classDefinition);
        classPartObjectToEdit.classGroupId = classGroupId;
        return;
      }
      if (typeof classDefinition === "function") {
        if (isThemeGetter(classDefinition)) {
          processClassesRecursively(classDefinition(theme), classPartObject, classGroupId, theme);
          return;
        }
        classPartObject.validators.push({
          validator: classDefinition,
          classGroupId
        });
        return;
      }
      Object.entries(classDefinition).forEach(([key, classGroup2]) => {
        processClassesRecursively(classGroup2, getPart(classPartObject, key), classGroupId, theme);
      });
    });
  };
  const getPart = (classPartObject, path) => {
    let currentClassPartObject = classPartObject;
    path.split(CLASS_PART_SEPARATOR).forEach((pathPart) => {
      if (!currentClassPartObject.nextPart.has(pathPart)) {
        currentClassPartObject.nextPart.set(pathPart, {
          nextPart: new Map(),
          validators: []
        });
      }
      currentClassPartObject = currentClassPartObject.nextPart.get(pathPart);
    });
    return currentClassPartObject;
  };
  const isThemeGetter = (func) => func.isThemeGetter;
  const createLruCache = (maxCacheSize) => {
    if (maxCacheSize < 1) {
      return {
        get: () => void 0,
        set: () => {
        }
      };
    }
    let cacheSize = 0;
    let cache = new Map();
    let previousCache = new Map();
    const update = (key, value) => {
      cache.set(key, value);
      cacheSize++;
      if (cacheSize > maxCacheSize) {
        cacheSize = 0;
        previousCache = cache;
        cache = new Map();
      }
    };
    return {
      get(key) {
        let value = cache.get(key);
        if (value !== void 0) {
          return value;
        }
        if ((value = previousCache.get(key)) !== void 0) {
          update(key, value);
          return value;
        }
      },
      set(key, value) {
        if (cache.has(key)) {
          cache.set(key, value);
        } else {
          update(key, value);
        }
      }
    };
  };
  const IMPORTANT_MODIFIER = "!";
  const MODIFIER_SEPARATOR = ":";
  const MODIFIER_SEPARATOR_LENGTH = MODIFIER_SEPARATOR.length;
  const createParseClassName = (config2) => {
    const {
      prefix: prefix2,
      experimentalParseClassName
    } = config2;
    let parseClassName = (className) => {
      const modifiers = [];
      let bracketDepth = 0;
      let parenDepth = 0;
      let modifierStart = 0;
      let postfixModifierPosition;
      for (let index2 = 0; index2 < className.length; index2++) {
        let currentCharacter = className[index2];
        if (bracketDepth === 0 && parenDepth === 0) {
          if (currentCharacter === MODIFIER_SEPARATOR) {
            modifiers.push(className.slice(modifierStart, index2));
            modifierStart = index2 + MODIFIER_SEPARATOR_LENGTH;
            continue;
          }
          if (currentCharacter === "/") {
            postfixModifierPosition = index2;
            continue;
          }
        }
        if (currentCharacter === "[") {
          bracketDepth++;
        } else if (currentCharacter === "]") {
          bracketDepth--;
        } else if (currentCharacter === "(") {
          parenDepth++;
        } else if (currentCharacter === ")") {
          parenDepth--;
        }
      }
      const baseClassNameWithImportantModifier = modifiers.length === 0 ? className : className.substring(modifierStart);
      const baseClassName = stripImportantModifier(baseClassNameWithImportantModifier);
      const hasImportantModifier = baseClassName !== baseClassNameWithImportantModifier;
      const maybePostfixModifierPosition = postfixModifierPosition && postfixModifierPosition > modifierStart ? postfixModifierPosition - modifierStart : void 0;
      return {
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      };
    };
    if (prefix2) {
      const fullPrefix = prefix2 + MODIFIER_SEPARATOR;
      const parseClassNameOriginal = parseClassName;
      parseClassName = (className) => className.startsWith(fullPrefix) ? parseClassNameOriginal(className.substring(fullPrefix.length)) : {
        isExternal: true,
        modifiers: [],
        hasImportantModifier: false,
        baseClassName: className,
        maybePostfixModifierPosition: void 0
      };
    }
    if (experimentalParseClassName) {
      const parseClassNameOriginal = parseClassName;
      parseClassName = (className) => experimentalParseClassName({
        className,
        parseClassName: parseClassNameOriginal
      });
    }
    return parseClassName;
  };
  const stripImportantModifier = (baseClassName) => {
    if (baseClassName.endsWith(IMPORTANT_MODIFIER)) {
      return baseClassName.substring(0, baseClassName.length - 1);
    }
    if (baseClassName.startsWith(IMPORTANT_MODIFIER)) {
      return baseClassName.substring(1);
    }
    return baseClassName;
  };
  const createSortModifiers = (config2) => {
    const orderSensitiveModifiers = Object.fromEntries(config2.orderSensitiveModifiers.map((modifier) => [modifier, true]));
    const sortModifiers = (modifiers) => {
      if (modifiers.length <= 1) {
        return modifiers;
      }
      const sortedModifiers = [];
      let unsortedModifiers = [];
      modifiers.forEach((modifier) => {
        const isPositionSensitive = modifier[0] === "[" || orderSensitiveModifiers[modifier];
        if (isPositionSensitive) {
          sortedModifiers.push(...unsortedModifiers.sort(), modifier);
          unsortedModifiers = [];
        } else {
          unsortedModifiers.push(modifier);
        }
      });
      sortedModifiers.push(...unsortedModifiers.sort());
      return sortedModifiers;
    };
    return sortModifiers;
  };
  const createConfigUtils = (config2) => ({
    cache: createLruCache(config2.cacheSize),
    parseClassName: createParseClassName(config2),
    sortModifiers: createSortModifiers(config2),
    ...createClassGroupUtils(config2)
  });
  const SPLIT_CLASSES_REGEX = /\s+/;
  const mergeClassList = (classList, configUtils) => {
    const {
      parseClassName,
      getClassGroupId,
      getConflictingClassGroupIds,
      sortModifiers
    } = configUtils;
    const classGroupsInConflict = [];
    const classNames = classList.trim().split(SPLIT_CLASSES_REGEX);
    let result = "";
    for (let index2 = classNames.length - 1; index2 >= 0; index2 -= 1) {
      const originalClassName = classNames[index2];
      const {
        isExternal,
        modifiers,
        hasImportantModifier,
        baseClassName,
        maybePostfixModifierPosition
      } = parseClassName(originalClassName);
      if (isExternal) {
        result = originalClassName + (result.length > 0 ? " " + result : result);
        continue;
      }
      let hasPostfixModifier = !!maybePostfixModifierPosition;
      let classGroupId = getClassGroupId(hasPostfixModifier ? baseClassName.substring(0, maybePostfixModifierPosition) : baseClassName);
      if (!classGroupId) {
        if (!hasPostfixModifier) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        classGroupId = getClassGroupId(baseClassName);
        if (!classGroupId) {
          result = originalClassName + (result.length > 0 ? " " + result : result);
          continue;
        }
        hasPostfixModifier = false;
      }
      const variantModifier = sortModifiers(modifiers).join(":");
      const modifierId = hasImportantModifier ? variantModifier + IMPORTANT_MODIFIER : variantModifier;
      const classId = modifierId + classGroupId;
      if (classGroupsInConflict.includes(classId)) {
        continue;
      }
      classGroupsInConflict.push(classId);
      const conflictGroups = getConflictingClassGroupIds(classGroupId, hasPostfixModifier);
      for (let i2 = 0; i2 < conflictGroups.length; ++i2) {
        const group = conflictGroups[i2];
        classGroupsInConflict.push(modifierId + group);
      }
      result = originalClassName + (result.length > 0 ? " " + result : result);
    }
    return result;
  };
  function twJoin() {
    let index2 = 0;
    let argument;
    let resolvedValue;
    let string2 = "";
    while (index2 < arguments.length) {
      if (argument = arguments[index2++]) {
        if (resolvedValue = toValue(argument)) {
          string2 && (string2 += " ");
          string2 += resolvedValue;
        }
      }
    }
    return string2;
  }
  const toValue = (mix2) => {
    if (typeof mix2 === "string") {
      return mix2;
    }
    let resolvedValue;
    let string2 = "";
    for (let k = 0; k < mix2.length; k++) {
      if (mix2[k]) {
        if (resolvedValue = toValue(mix2[k])) {
          string2 && (string2 += " ");
          string2 += resolvedValue;
        }
      }
    }
    return string2;
  };
  function createTailwindMerge(createConfigFirst, ...createConfigRest) {
    let configUtils;
    let cacheGet;
    let cacheSet;
    let functionToCall = initTailwindMerge;
    function initTailwindMerge(classList) {
      const config2 = createConfigRest.reduce((previousConfig, createConfigCurrent) => createConfigCurrent(previousConfig), createConfigFirst());
      configUtils = createConfigUtils(config2);
      cacheGet = configUtils.cache.get;
      cacheSet = configUtils.cache.set;
      functionToCall = tailwindMerge;
      return tailwindMerge(classList);
    }
    function tailwindMerge(classList) {
      const cachedResult = cacheGet(classList);
      if (cachedResult) {
        return cachedResult;
      }
      const result = mergeClassList(classList, configUtils);
      cacheSet(classList, result);
      return result;
    }
    return function callTailwindMerge() {
      return functionToCall(twJoin.apply(null, arguments));
    };
  }
  const fromTheme = (key) => {
    const themeGetter = (theme) => theme[key] || [];
    themeGetter.isThemeGetter = true;
    return themeGetter;
  };
  const arbitraryValueRegex = /^\[(?:(\w[\w-]*):)?(.+)\]$/i;
  const arbitraryVariableRegex = /^\((?:(\w[\w-]*):)?(.+)\)$/i;
  const fractionRegex = /^\d+\/\d+$/;
  const tshirtUnitRegex = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/;
  const lengthUnitRegex = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/;
  const colorFunctionRegex = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/;
  const shadowRegex = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/;
  const imageRegex = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/;
  const isFraction = (value) => fractionRegex.test(value);
  const isNumber = (value) => !!value && !Number.isNaN(Number(value));
  const isInteger = (value) => !!value && Number.isInteger(Number(value));
  const isPercent = (value) => value.endsWith("%") && isNumber(value.slice(0, -1));
  const isTshirtSize = (value) => tshirtUnitRegex.test(value);
  const isAny = () => true;
  const isLengthOnly = (value) => (


lengthUnitRegex.test(value) && !colorFunctionRegex.test(value)
  );
  const isNever = () => false;
  const isShadow = (value) => shadowRegex.test(value);
  const isImage = (value) => imageRegex.test(value);
  const isAnyNonArbitrary = (value) => !isArbitraryValue(value) && !isArbitraryVariable(value);
  const isArbitrarySize = (value) => getIsArbitraryValue(value, isLabelSize, isNever);
  const isArbitraryValue = (value) => arbitraryValueRegex.test(value);
  const isArbitraryLength = (value) => getIsArbitraryValue(value, isLabelLength, isLengthOnly);
  const isArbitraryNumber = (value) => getIsArbitraryValue(value, isLabelNumber, isNumber);
  const isArbitraryPosition = (value) => getIsArbitraryValue(value, isLabelPosition, isNever);
  const isArbitraryImage = (value) => getIsArbitraryValue(value, isLabelImage, isImage);
  const isArbitraryShadow = (value) => getIsArbitraryValue(value, isLabelShadow, isShadow);
  const isArbitraryVariable = (value) => arbitraryVariableRegex.test(value);
  const isArbitraryVariableLength = (value) => getIsArbitraryVariable(value, isLabelLength);
  const isArbitraryVariableFamilyName = (value) => getIsArbitraryVariable(value, isLabelFamilyName);
  const isArbitraryVariablePosition = (value) => getIsArbitraryVariable(value, isLabelPosition);
  const isArbitraryVariableSize = (value) => getIsArbitraryVariable(value, isLabelSize);
  const isArbitraryVariableImage = (value) => getIsArbitraryVariable(value, isLabelImage);
  const isArbitraryVariableShadow = (value) => getIsArbitraryVariable(value, isLabelShadow, true);
  const getIsArbitraryValue = (value, testLabel, testValue) => {
    const result = arbitraryValueRegex.exec(value);
    if (result) {
      if (result[1]) {
        return testLabel(result[1]);
      }
      return testValue(result[2]);
    }
    return false;
  };
  const getIsArbitraryVariable = (value, testLabel, shouldMatchNoLabel = false) => {
    const result = arbitraryVariableRegex.exec(value);
    if (result) {
      if (result[1]) {
        return testLabel(result[1]);
      }
      return shouldMatchNoLabel;
    }
    return false;
  };
  const isLabelPosition = (label) => label === "position" || label === "percentage";
  const isLabelImage = (label) => label === "image" || label === "url";
  const isLabelSize = (label) => label === "length" || label === "size" || label === "bg-size";
  const isLabelLength = (label) => label === "length";
  const isLabelNumber = (label) => label === "number";
  const isLabelFamilyName = (label) => label === "family-name";
  const isLabelShadow = (label) => label === "shadow";
  const getDefaultConfig = () => {
    const themeColor = fromTheme("color");
    const themeFont = fromTheme("font");
    const themeText = fromTheme("text");
    const themeFontWeight = fromTheme("font-weight");
    const themeTracking = fromTheme("tracking");
    const themeLeading = fromTheme("leading");
    const themeBreakpoint = fromTheme("breakpoint");
    const themeContainer = fromTheme("container");
    const themeSpacing = fromTheme("spacing");
    const themeRadius = fromTheme("radius");
    const themeShadow = fromTheme("shadow");
    const themeInsetShadow = fromTheme("inset-shadow");
    const themeTextShadow = fromTheme("text-shadow");
    const themeDropShadow = fromTheme("drop-shadow");
    const themeBlur = fromTheme("blur");
    const themePerspective = fromTheme("perspective");
    const themeAspect = fromTheme("aspect");
    const themeEase = fromTheme("ease");
    const themeAnimate = fromTheme("animate");
    const scaleBreak = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"];
    const scalePosition = () => [
      "center",
      "top",
      "bottom",
      "left",
      "right",
      "top-left",
"left-top",
      "top-right",
"right-top",
      "bottom-right",
"right-bottom",
      "bottom-left",
"left-bottom"
    ];
    const scalePositionWithArbitrary = () => [...scalePosition(), isArbitraryVariable, isArbitraryValue];
    const scaleOverflow = () => ["auto", "hidden", "clip", "visible", "scroll"];
    const scaleOverscroll = () => ["auto", "contain", "none"];
    const scaleUnambiguousSpacing = () => [isArbitraryVariable, isArbitraryValue, themeSpacing];
    const scaleInset = () => [isFraction, "full", "auto", ...scaleUnambiguousSpacing()];
    const scaleGridTemplateColsRows = () => [isInteger, "none", "subgrid", isArbitraryVariable, isArbitraryValue];
    const scaleGridColRowStartAndEnd = () => ["auto", {
      span: ["full", isInteger, isArbitraryVariable, isArbitraryValue]
    }, isInteger, isArbitraryVariable, isArbitraryValue];
    const scaleGridColRowStartOrEnd = () => [isInteger, "auto", isArbitraryVariable, isArbitraryValue];
    const scaleGridAutoColsRows = () => ["auto", "min", "max", "fr", isArbitraryVariable, isArbitraryValue];
    const scaleAlignPrimaryAxis = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"];
    const scaleAlignSecondaryAxis = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"];
    const scaleMargin = () => ["auto", ...scaleUnambiguousSpacing()];
    const scaleSizing = () => [isFraction, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...scaleUnambiguousSpacing()];
    const scaleColor = () => [themeColor, isArbitraryVariable, isArbitraryValue];
    const scaleBgPosition = () => [...scalePosition(), isArbitraryVariablePosition, isArbitraryPosition, {
      position: [isArbitraryVariable, isArbitraryValue]
    }];
    const scaleBgRepeat = () => ["no-repeat", {
      repeat: ["", "x", "y", "space", "round"]
    }];
    const scaleBgSize = () => ["auto", "cover", "contain", isArbitraryVariableSize, isArbitrarySize, {
      size: [isArbitraryVariable, isArbitraryValue]
    }];
    const scaleGradientStopPosition = () => [isPercent, isArbitraryVariableLength, isArbitraryLength];
    const scaleRadius = () => [
"",
      "none",
      "full",
      themeRadius,
      isArbitraryVariable,
      isArbitraryValue
    ];
    const scaleBorderWidth = () => ["", isNumber, isArbitraryVariableLength, isArbitraryLength];
    const scaleLineStyle = () => ["solid", "dashed", "dotted", "double"];
    const scaleBlendMode = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"];
    const scaleMaskImagePosition = () => [isNumber, isPercent, isArbitraryVariablePosition, isArbitraryPosition];
    const scaleBlur = () => [
"",
      "none",
      themeBlur,
      isArbitraryVariable,
      isArbitraryValue
    ];
    const scaleRotate = () => ["none", isNumber, isArbitraryVariable, isArbitraryValue];
    const scaleScale = () => ["none", isNumber, isArbitraryVariable, isArbitraryValue];
    const scaleSkew = () => [isNumber, isArbitraryVariable, isArbitraryValue];
    const scaleTranslate = () => [isFraction, "full", ...scaleUnambiguousSpacing()];
    return {
      cacheSize: 500,
      theme: {
        animate: ["spin", "ping", "pulse", "bounce"],
        aspect: ["video"],
        blur: [isTshirtSize],
        breakpoint: [isTshirtSize],
        color: [isAny],
        container: [isTshirtSize],
        "drop-shadow": [isTshirtSize],
        ease: ["in", "out", "in-out"],
        font: [isAnyNonArbitrary],
        "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
        "inset-shadow": [isTshirtSize],
        leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
        perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
        radius: [isTshirtSize],
        shadow: [isTshirtSize],
        spacing: ["px", isNumber],
        text: [isTshirtSize],
        "text-shadow": [isTshirtSize],
        tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
      },
      classGroups: {



aspect: [{
          aspect: ["auto", "square", isFraction, isArbitraryValue, isArbitraryVariable, themeAspect]
        }],
container: ["container"],
columns: [{
          columns: [isNumber, isArbitraryValue, isArbitraryVariable, themeContainer]
        }],
"break-after": [{
          "break-after": scaleBreak()
        }],
"break-before": [{
          "break-before": scaleBreak()
        }],
"break-inside": [{
          "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
        }],
"box-decoration": [{
          "box-decoration": ["slice", "clone"]
        }],
box: [{
          box: ["border", "content"]
        }],
display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
sr: ["sr-only", "not-sr-only"],
float: [{
          float: ["right", "left", "none", "start", "end"]
        }],
clear: [{
          clear: ["left", "right", "both", "none", "start", "end"]
        }],
isolation: ["isolate", "isolation-auto"],
"object-fit": [{
          object: ["contain", "cover", "fill", "none", "scale-down"]
        }],
"object-position": [{
          object: scalePositionWithArbitrary()
        }],
overflow: [{
          overflow: scaleOverflow()
        }],
"overflow-x": [{
          "overflow-x": scaleOverflow()
        }],
"overflow-y": [{
          "overflow-y": scaleOverflow()
        }],
overscroll: [{
          overscroll: scaleOverscroll()
        }],
"overscroll-x": [{
          "overscroll-x": scaleOverscroll()
        }],
"overscroll-y": [{
          "overscroll-y": scaleOverscroll()
        }],
position: ["static", "fixed", "absolute", "relative", "sticky"],
inset: [{
          inset: scaleInset()
        }],
"inset-x": [{
          "inset-x": scaleInset()
        }],
"inset-y": [{
          "inset-y": scaleInset()
        }],
start: [{
          start: scaleInset()
        }],
end: [{
          end: scaleInset()
        }],
top: [{
          top: scaleInset()
        }],
right: [{
          right: scaleInset()
        }],
bottom: [{
          bottom: scaleInset()
        }],
left: [{
          left: scaleInset()
        }],
visibility: ["visible", "invisible", "collapse"],
z: [{
          z: [isInteger, "auto", isArbitraryVariable, isArbitraryValue]
        }],



basis: [{
          basis: [isFraction, "full", "auto", themeContainer, ...scaleUnambiguousSpacing()]
        }],
"flex-direction": [{
          flex: ["row", "row-reverse", "col", "col-reverse"]
        }],
"flex-wrap": [{
          flex: ["nowrap", "wrap", "wrap-reverse"]
        }],
flex: [{
          flex: [isNumber, isFraction, "auto", "initial", "none", isArbitraryValue]
        }],
grow: [{
          grow: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
shrink: [{
          shrink: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
order: [{
          order: [isInteger, "first", "last", "none", isArbitraryVariable, isArbitraryValue]
        }],
"grid-cols": [{
          "grid-cols": scaleGridTemplateColsRows()
        }],
"col-start-end": [{
          col: scaleGridColRowStartAndEnd()
        }],
"col-start": [{
          "col-start": scaleGridColRowStartOrEnd()
        }],
"col-end": [{
          "col-end": scaleGridColRowStartOrEnd()
        }],
"grid-rows": [{
          "grid-rows": scaleGridTemplateColsRows()
        }],
"row-start-end": [{
          row: scaleGridColRowStartAndEnd()
        }],
"row-start": [{
          "row-start": scaleGridColRowStartOrEnd()
        }],
"row-end": [{
          "row-end": scaleGridColRowStartOrEnd()
        }],
"grid-flow": [{
          "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
        }],
"auto-cols": [{
          "auto-cols": scaleGridAutoColsRows()
        }],
"auto-rows": [{
          "auto-rows": scaleGridAutoColsRows()
        }],
gap: [{
          gap: scaleUnambiguousSpacing()
        }],
"gap-x": [{
          "gap-x": scaleUnambiguousSpacing()
        }],
"gap-y": [{
          "gap-y": scaleUnambiguousSpacing()
        }],
"justify-content": [{
          justify: [...scaleAlignPrimaryAxis(), "normal"]
        }],
"justify-items": [{
          "justify-items": [...scaleAlignSecondaryAxis(), "normal"]
        }],
"justify-self": [{
          "justify-self": ["auto", ...scaleAlignSecondaryAxis()]
        }],
"align-content": [{
          content: ["normal", ...scaleAlignPrimaryAxis()]
        }],
"align-items": [{
          items: [...scaleAlignSecondaryAxis(), {
            baseline: ["", "last"]
          }]
        }],
"align-self": [{
          self: ["auto", ...scaleAlignSecondaryAxis(), {
            baseline: ["", "last"]
          }]
        }],
"place-content": [{
          "place-content": scaleAlignPrimaryAxis()
        }],
"place-items": [{
          "place-items": [...scaleAlignSecondaryAxis(), "baseline"]
        }],
"place-self": [{
          "place-self": ["auto", ...scaleAlignSecondaryAxis()]
        }],

p: [{
          p: scaleUnambiguousSpacing()
        }],
px: [{
          px: scaleUnambiguousSpacing()
        }],
py: [{
          py: scaleUnambiguousSpacing()
        }],
ps: [{
          ps: scaleUnambiguousSpacing()
        }],
pe: [{
          pe: scaleUnambiguousSpacing()
        }],
pt: [{
          pt: scaleUnambiguousSpacing()
        }],
pr: [{
          pr: scaleUnambiguousSpacing()
        }],
pb: [{
          pb: scaleUnambiguousSpacing()
        }],
pl: [{
          pl: scaleUnambiguousSpacing()
        }],
m: [{
          m: scaleMargin()
        }],
mx: [{
          mx: scaleMargin()
        }],
my: [{
          my: scaleMargin()
        }],
ms: [{
          ms: scaleMargin()
        }],
me: [{
          me: scaleMargin()
        }],
mt: [{
          mt: scaleMargin()
        }],
mr: [{
          mr: scaleMargin()
        }],
mb: [{
          mb: scaleMargin()
        }],
ml: [{
          ml: scaleMargin()
        }],
"space-x": [{
          "space-x": scaleUnambiguousSpacing()
        }],
"space-x-reverse": ["space-x-reverse"],
"space-y": [{
          "space-y": scaleUnambiguousSpacing()
        }],
"space-y-reverse": ["space-y-reverse"],



size: [{
          size: scaleSizing()
        }],
w: [{
          w: [themeContainer, "screen", ...scaleSizing()]
        }],
"min-w": [{
          "min-w": [
            themeContainer,
            "screen",
"none",
            ...scaleSizing()
          ]
        }],
"max-w": [{
          "max-w": [
            themeContainer,
            "screen",
            "none",
"prose",
{
              screen: [themeBreakpoint]
            },
            ...scaleSizing()
          ]
        }],
h: [{
          h: ["screen", "lh", ...scaleSizing()]
        }],
"min-h": [{
          "min-h": ["screen", "lh", "none", ...scaleSizing()]
        }],
"max-h": [{
          "max-h": ["screen", "lh", ...scaleSizing()]
        }],



"font-size": [{
          text: ["base", themeText, isArbitraryVariableLength, isArbitraryLength]
        }],
"font-smoothing": ["antialiased", "subpixel-antialiased"],
"font-style": ["italic", "not-italic"],
"font-weight": [{
          font: [themeFontWeight, isArbitraryVariable, isArbitraryNumber]
        }],
"font-stretch": [{
          "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", isPercent, isArbitraryValue]
        }],
"font-family": [{
          font: [isArbitraryVariableFamilyName, isArbitraryValue, themeFont]
        }],
"fvn-normal": ["normal-nums"],
"fvn-ordinal": ["ordinal"],
"fvn-slashed-zero": ["slashed-zero"],
"fvn-figure": ["lining-nums", "oldstyle-nums"],
"fvn-spacing": ["proportional-nums", "tabular-nums"],
"fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
tracking: [{
          tracking: [themeTracking, isArbitraryVariable, isArbitraryValue]
        }],
"line-clamp": [{
          "line-clamp": [isNumber, "none", isArbitraryVariable, isArbitraryNumber]
        }],
leading: [{
          leading: [
themeLeading,
            ...scaleUnambiguousSpacing()
          ]
        }],
"list-image": [{
          "list-image": ["none", isArbitraryVariable, isArbitraryValue]
        }],
"list-style-position": [{
          list: ["inside", "outside"]
        }],
"list-style-type": [{
          list: ["disc", "decimal", "none", isArbitraryVariable, isArbitraryValue]
        }],
"text-alignment": [{
          text: ["left", "center", "right", "justify", "start", "end"]
        }],
"placeholder-color": [{
          placeholder: scaleColor()
        }],
"text-color": [{
          text: scaleColor()
        }],
"text-decoration": ["underline", "overline", "line-through", "no-underline"],
"text-decoration-style": [{
          decoration: [...scaleLineStyle(), "wavy"]
        }],
"text-decoration-thickness": [{
          decoration: [isNumber, "from-font", "auto", isArbitraryVariable, isArbitraryLength]
        }],
"text-decoration-color": [{
          decoration: scaleColor()
        }],
"underline-offset": [{
          "underline-offset": [isNumber, "auto", isArbitraryVariable, isArbitraryValue]
        }],
"text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
"text-overflow": ["truncate", "text-ellipsis", "text-clip"],
"text-wrap": [{
          text: ["wrap", "nowrap", "balance", "pretty"]
        }],
indent: [{
          indent: scaleUnambiguousSpacing()
        }],
"vertical-align": [{
          align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", isArbitraryVariable, isArbitraryValue]
        }],
whitespace: [{
          whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
        }],
break: [{
          break: ["normal", "words", "all", "keep"]
        }],
wrap: [{
          wrap: ["break-word", "anywhere", "normal"]
        }],
hyphens: [{
          hyphens: ["none", "manual", "auto"]
        }],
content: [{
          content: ["none", isArbitraryVariable, isArbitraryValue]
        }],



"bg-attachment": [{
          bg: ["fixed", "local", "scroll"]
        }],
"bg-clip": [{
          "bg-clip": ["border", "padding", "content", "text"]
        }],
"bg-origin": [{
          "bg-origin": ["border", "padding", "content"]
        }],
"bg-position": [{
          bg: scaleBgPosition()
        }],
"bg-repeat": [{
          bg: scaleBgRepeat()
        }],
"bg-size": [{
          bg: scaleBgSize()
        }],
"bg-image": [{
          bg: ["none", {
            linear: [{
              to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
            }, isInteger, isArbitraryVariable, isArbitraryValue],
            radial: ["", isArbitraryVariable, isArbitraryValue],
            conic: [isInteger, isArbitraryVariable, isArbitraryValue]
          }, isArbitraryVariableImage, isArbitraryImage]
        }],
"bg-color": [{
          bg: scaleColor()
        }],
"gradient-from-pos": [{
          from: scaleGradientStopPosition()
        }],
"gradient-via-pos": [{
          via: scaleGradientStopPosition()
        }],
"gradient-to-pos": [{
          to: scaleGradientStopPosition()
        }],
"gradient-from": [{
          from: scaleColor()
        }],
"gradient-via": [{
          via: scaleColor()
        }],
"gradient-to": [{
          to: scaleColor()
        }],



rounded: [{
          rounded: scaleRadius()
        }],
"rounded-s": [{
          "rounded-s": scaleRadius()
        }],
"rounded-e": [{
          "rounded-e": scaleRadius()
        }],
"rounded-t": [{
          "rounded-t": scaleRadius()
        }],
"rounded-r": [{
          "rounded-r": scaleRadius()
        }],
"rounded-b": [{
          "rounded-b": scaleRadius()
        }],
"rounded-l": [{
          "rounded-l": scaleRadius()
        }],
"rounded-ss": [{
          "rounded-ss": scaleRadius()
        }],
"rounded-se": [{
          "rounded-se": scaleRadius()
        }],
"rounded-ee": [{
          "rounded-ee": scaleRadius()
        }],
"rounded-es": [{
          "rounded-es": scaleRadius()
        }],
"rounded-tl": [{
          "rounded-tl": scaleRadius()
        }],
"rounded-tr": [{
          "rounded-tr": scaleRadius()
        }],
"rounded-br": [{
          "rounded-br": scaleRadius()
        }],
"rounded-bl": [{
          "rounded-bl": scaleRadius()
        }],
"border-w": [{
          border: scaleBorderWidth()
        }],
"border-w-x": [{
          "border-x": scaleBorderWidth()
        }],
"border-w-y": [{
          "border-y": scaleBorderWidth()
        }],
"border-w-s": [{
          "border-s": scaleBorderWidth()
        }],
"border-w-e": [{
          "border-e": scaleBorderWidth()
        }],
"border-w-t": [{
          "border-t": scaleBorderWidth()
        }],
"border-w-r": [{
          "border-r": scaleBorderWidth()
        }],
"border-w-b": [{
          "border-b": scaleBorderWidth()
        }],
"border-w-l": [{
          "border-l": scaleBorderWidth()
        }],
"divide-x": [{
          "divide-x": scaleBorderWidth()
        }],
"divide-x-reverse": ["divide-x-reverse"],
"divide-y": [{
          "divide-y": scaleBorderWidth()
        }],
"divide-y-reverse": ["divide-y-reverse"],
"border-style": [{
          border: [...scaleLineStyle(), "hidden", "none"]
        }],
"divide-style": [{
          divide: [...scaleLineStyle(), "hidden", "none"]
        }],
"border-color": [{
          border: scaleColor()
        }],
"border-color-x": [{
          "border-x": scaleColor()
        }],
"border-color-y": [{
          "border-y": scaleColor()
        }],
"border-color-s": [{
          "border-s": scaleColor()
        }],
"border-color-e": [{
          "border-e": scaleColor()
        }],
"border-color-t": [{
          "border-t": scaleColor()
        }],
"border-color-r": [{
          "border-r": scaleColor()
        }],
"border-color-b": [{
          "border-b": scaleColor()
        }],
"border-color-l": [{
          "border-l": scaleColor()
        }],
"divide-color": [{
          divide: scaleColor()
        }],
"outline-style": [{
          outline: [...scaleLineStyle(), "none", "hidden"]
        }],
"outline-offset": [{
          "outline-offset": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"outline-w": [{
          outline: ["", isNumber, isArbitraryVariableLength, isArbitraryLength]
        }],
"outline-color": [{
          outline: scaleColor()
        }],



shadow: [{
          shadow: [
"",
            "none",
            themeShadow,
            isArbitraryVariableShadow,
            isArbitraryShadow
          ]
        }],
"shadow-color": [{
          shadow: scaleColor()
        }],
"inset-shadow": [{
          "inset-shadow": ["none", themeInsetShadow, isArbitraryVariableShadow, isArbitraryShadow]
        }],
"inset-shadow-color": [{
          "inset-shadow": scaleColor()
        }],
"ring-w": [{
          ring: scaleBorderWidth()
        }],
"ring-w-inset": ["ring-inset"],
"ring-color": [{
          ring: scaleColor()
        }],
"ring-offset-w": [{
          "ring-offset": [isNumber, isArbitraryLength]
        }],
"ring-offset-color": [{
          "ring-offset": scaleColor()
        }],
"inset-ring-w": [{
          "inset-ring": scaleBorderWidth()
        }],
"inset-ring-color": [{
          "inset-ring": scaleColor()
        }],
"text-shadow": [{
          "text-shadow": ["none", themeTextShadow, isArbitraryVariableShadow, isArbitraryShadow]
        }],
"text-shadow-color": [{
          "text-shadow": scaleColor()
        }],
opacity: [{
          opacity: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"mix-blend": [{
          "mix-blend": [...scaleBlendMode(), "plus-darker", "plus-lighter"]
        }],
"bg-blend": [{
          "bg-blend": scaleBlendMode()
        }],
"mask-clip": [{
          "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
        }, "mask-no-clip"],
"mask-composite": [{
          mask: ["add", "subtract", "intersect", "exclude"]
        }],
"mask-image-linear-pos": [{
          "mask-linear": [isNumber]
        }],
        "mask-image-linear-from-pos": [{
          "mask-linear-from": scaleMaskImagePosition()
        }],
        "mask-image-linear-to-pos": [{
          "mask-linear-to": scaleMaskImagePosition()
        }],
        "mask-image-linear-from-color": [{
          "mask-linear-from": scaleColor()
        }],
        "mask-image-linear-to-color": [{
          "mask-linear-to": scaleColor()
        }],
        "mask-image-t-from-pos": [{
          "mask-t-from": scaleMaskImagePosition()
        }],
        "mask-image-t-to-pos": [{
          "mask-t-to": scaleMaskImagePosition()
        }],
        "mask-image-t-from-color": [{
          "mask-t-from": scaleColor()
        }],
        "mask-image-t-to-color": [{
          "mask-t-to": scaleColor()
        }],
        "mask-image-r-from-pos": [{
          "mask-r-from": scaleMaskImagePosition()
        }],
        "mask-image-r-to-pos": [{
          "mask-r-to": scaleMaskImagePosition()
        }],
        "mask-image-r-from-color": [{
          "mask-r-from": scaleColor()
        }],
        "mask-image-r-to-color": [{
          "mask-r-to": scaleColor()
        }],
        "mask-image-b-from-pos": [{
          "mask-b-from": scaleMaskImagePosition()
        }],
        "mask-image-b-to-pos": [{
          "mask-b-to": scaleMaskImagePosition()
        }],
        "mask-image-b-from-color": [{
          "mask-b-from": scaleColor()
        }],
        "mask-image-b-to-color": [{
          "mask-b-to": scaleColor()
        }],
        "mask-image-l-from-pos": [{
          "mask-l-from": scaleMaskImagePosition()
        }],
        "mask-image-l-to-pos": [{
          "mask-l-to": scaleMaskImagePosition()
        }],
        "mask-image-l-from-color": [{
          "mask-l-from": scaleColor()
        }],
        "mask-image-l-to-color": [{
          "mask-l-to": scaleColor()
        }],
        "mask-image-x-from-pos": [{
          "mask-x-from": scaleMaskImagePosition()
        }],
        "mask-image-x-to-pos": [{
          "mask-x-to": scaleMaskImagePosition()
        }],
        "mask-image-x-from-color": [{
          "mask-x-from": scaleColor()
        }],
        "mask-image-x-to-color": [{
          "mask-x-to": scaleColor()
        }],
        "mask-image-y-from-pos": [{
          "mask-y-from": scaleMaskImagePosition()
        }],
        "mask-image-y-to-pos": [{
          "mask-y-to": scaleMaskImagePosition()
        }],
        "mask-image-y-from-color": [{
          "mask-y-from": scaleColor()
        }],
        "mask-image-y-to-color": [{
          "mask-y-to": scaleColor()
        }],
        "mask-image-radial": [{
          "mask-radial": [isArbitraryVariable, isArbitraryValue]
        }],
        "mask-image-radial-from-pos": [{
          "mask-radial-from": scaleMaskImagePosition()
        }],
        "mask-image-radial-to-pos": [{
          "mask-radial-to": scaleMaskImagePosition()
        }],
        "mask-image-radial-from-color": [{
          "mask-radial-from": scaleColor()
        }],
        "mask-image-radial-to-color": [{
          "mask-radial-to": scaleColor()
        }],
        "mask-image-radial-shape": [{
          "mask-radial": ["circle", "ellipse"]
        }],
        "mask-image-radial-size": [{
          "mask-radial": [{
            closest: ["side", "corner"],
            farthest: ["side", "corner"]
          }]
        }],
        "mask-image-radial-pos": [{
          "mask-radial-at": scalePosition()
        }],
        "mask-image-conic-pos": [{
          "mask-conic": [isNumber]
        }],
        "mask-image-conic-from-pos": [{
          "mask-conic-from": scaleMaskImagePosition()
        }],
        "mask-image-conic-to-pos": [{
          "mask-conic-to": scaleMaskImagePosition()
        }],
        "mask-image-conic-from-color": [{
          "mask-conic-from": scaleColor()
        }],
        "mask-image-conic-to-color": [{
          "mask-conic-to": scaleColor()
        }],
"mask-mode": [{
          mask: ["alpha", "luminance", "match"]
        }],
"mask-origin": [{
          "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
        }],
"mask-position": [{
          mask: scaleBgPosition()
        }],
"mask-repeat": [{
          mask: scaleBgRepeat()
        }],
"mask-size": [{
          mask: scaleBgSize()
        }],
"mask-type": [{
          "mask-type": ["alpha", "luminance"]
        }],
"mask-image": [{
          mask: ["none", isArbitraryVariable, isArbitraryValue]
        }],



filter: [{
          filter: [
"",
            "none",
            isArbitraryVariable,
            isArbitraryValue
          ]
        }],
blur: [{
          blur: scaleBlur()
        }],
brightness: [{
          brightness: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
contrast: [{
          contrast: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"drop-shadow": [{
          "drop-shadow": [
"",
            "none",
            themeDropShadow,
            isArbitraryVariableShadow,
            isArbitraryShadow
          ]
        }],
"drop-shadow-color": [{
          "drop-shadow": scaleColor()
        }],
grayscale: [{
          grayscale: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"hue-rotate": [{
          "hue-rotate": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
invert: [{
          invert: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
saturate: [{
          saturate: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
sepia: [{
          sepia: ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"backdrop-filter": [{
          "backdrop-filter": [
"",
            "none",
            isArbitraryVariable,
            isArbitraryValue
          ]
        }],
"backdrop-blur": [{
          "backdrop-blur": scaleBlur()
        }],
"backdrop-brightness": [{
          "backdrop-brightness": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"backdrop-contrast": [{
          "backdrop-contrast": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"backdrop-grayscale": [{
          "backdrop-grayscale": ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"backdrop-hue-rotate": [{
          "backdrop-hue-rotate": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"backdrop-invert": [{
          "backdrop-invert": ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"backdrop-opacity": [{
          "backdrop-opacity": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"backdrop-saturate": [{
          "backdrop-saturate": [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
"backdrop-sepia": [{
          "backdrop-sepia": ["", isNumber, isArbitraryVariable, isArbitraryValue]
        }],



"border-collapse": [{
          border: ["collapse", "separate"]
        }],
"border-spacing": [{
          "border-spacing": scaleUnambiguousSpacing()
        }],
"border-spacing-x": [{
          "border-spacing-x": scaleUnambiguousSpacing()
        }],
"border-spacing-y": [{
          "border-spacing-y": scaleUnambiguousSpacing()
        }],
"table-layout": [{
          table: ["auto", "fixed"]
        }],
caption: [{
          caption: ["top", "bottom"]
        }],



transition: [{
          transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", isArbitraryVariable, isArbitraryValue]
        }],
"transition-behavior": [{
          transition: ["normal", "discrete"]
        }],
duration: [{
          duration: [isNumber, "initial", isArbitraryVariable, isArbitraryValue]
        }],
ease: [{
          ease: ["linear", "initial", themeEase, isArbitraryVariable, isArbitraryValue]
        }],
delay: [{
          delay: [isNumber, isArbitraryVariable, isArbitraryValue]
        }],
animate: [{
          animate: ["none", themeAnimate, isArbitraryVariable, isArbitraryValue]
        }],



backface: [{
          backface: ["hidden", "visible"]
        }],
perspective: [{
          perspective: [themePerspective, isArbitraryVariable, isArbitraryValue]
        }],
"perspective-origin": [{
          "perspective-origin": scalePositionWithArbitrary()
        }],
rotate: [{
          rotate: scaleRotate()
        }],
"rotate-x": [{
          "rotate-x": scaleRotate()
        }],
"rotate-y": [{
          "rotate-y": scaleRotate()
        }],
"rotate-z": [{
          "rotate-z": scaleRotate()
        }],
scale: [{
          scale: scaleScale()
        }],
"scale-x": [{
          "scale-x": scaleScale()
        }],
"scale-y": [{
          "scale-y": scaleScale()
        }],
"scale-z": [{
          "scale-z": scaleScale()
        }],
"scale-3d": ["scale-3d"],
skew: [{
          skew: scaleSkew()
        }],
"skew-x": [{
          "skew-x": scaleSkew()
        }],
"skew-y": [{
          "skew-y": scaleSkew()
        }],
transform: [{
          transform: [isArbitraryVariable, isArbitraryValue, "", "none", "gpu", "cpu"]
        }],
"transform-origin": [{
          origin: scalePositionWithArbitrary()
        }],
"transform-style": [{
          transform: ["3d", "flat"]
        }],
translate: [{
          translate: scaleTranslate()
        }],
"translate-x": [{
          "translate-x": scaleTranslate()
        }],
"translate-y": [{
          "translate-y": scaleTranslate()
        }],
"translate-z": [{
          "translate-z": scaleTranslate()
        }],
"translate-none": ["translate-none"],



accent: [{
          accent: scaleColor()
        }],
appearance: [{
          appearance: ["none", "auto"]
        }],
"caret-color": [{
          caret: scaleColor()
        }],
"color-scheme": [{
          scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
        }],
cursor: [{
          cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", isArbitraryVariable, isArbitraryValue]
        }],
"field-sizing": [{
          "field-sizing": ["fixed", "content"]
        }],
"pointer-events": [{
          "pointer-events": ["auto", "none"]
        }],
resize: [{
          resize: ["none", "", "y", "x"]
        }],
"scroll-behavior": [{
          scroll: ["auto", "smooth"]
        }],
"scroll-m": [{
          "scroll-m": scaleUnambiguousSpacing()
        }],
"scroll-mx": [{
          "scroll-mx": scaleUnambiguousSpacing()
        }],
"scroll-my": [{
          "scroll-my": scaleUnambiguousSpacing()
        }],
"scroll-ms": [{
          "scroll-ms": scaleUnambiguousSpacing()
        }],
"scroll-me": [{
          "scroll-me": scaleUnambiguousSpacing()
        }],
"scroll-mt": [{
          "scroll-mt": scaleUnambiguousSpacing()
        }],
"scroll-mr": [{
          "scroll-mr": scaleUnambiguousSpacing()
        }],
"scroll-mb": [{
          "scroll-mb": scaleUnambiguousSpacing()
        }],
"scroll-ml": [{
          "scroll-ml": scaleUnambiguousSpacing()
        }],
"scroll-p": [{
          "scroll-p": scaleUnambiguousSpacing()
        }],
"scroll-px": [{
          "scroll-px": scaleUnambiguousSpacing()
        }],
"scroll-py": [{
          "scroll-py": scaleUnambiguousSpacing()
        }],
"scroll-ps": [{
          "scroll-ps": scaleUnambiguousSpacing()
        }],
"scroll-pe": [{
          "scroll-pe": scaleUnambiguousSpacing()
        }],
"scroll-pt": [{
          "scroll-pt": scaleUnambiguousSpacing()
        }],
"scroll-pr": [{
          "scroll-pr": scaleUnambiguousSpacing()
        }],
"scroll-pb": [{
          "scroll-pb": scaleUnambiguousSpacing()
        }],
"scroll-pl": [{
          "scroll-pl": scaleUnambiguousSpacing()
        }],
"snap-align": [{
          snap: ["start", "end", "center", "align-none"]
        }],
"snap-stop": [{
          snap: ["normal", "always"]
        }],
"snap-type": [{
          snap: ["none", "x", "y", "both"]
        }],
"snap-strictness": [{
          snap: ["mandatory", "proximity"]
        }],
touch: [{
          touch: ["auto", "none", "manipulation"]
        }],
"touch-x": [{
          "touch-pan": ["x", "left", "right"]
        }],
"touch-y": [{
          "touch-pan": ["y", "up", "down"]
        }],
"touch-pz": ["touch-pinch-zoom"],
select: [{
          select: ["none", "text", "all", "auto"]
        }],
"will-change": [{
          "will-change": ["auto", "scroll", "contents", "transform", isArbitraryVariable, isArbitraryValue]
        }],



fill: [{
          fill: ["none", ...scaleColor()]
        }],
"stroke-w": [{
          stroke: [isNumber, isArbitraryVariableLength, isArbitraryLength, isArbitraryNumber]
        }],
stroke: [{
          stroke: ["none", ...scaleColor()]
        }],



"forced-color-adjust": [{
          "forced-color-adjust": ["auto", "none"]
        }]
      },
      conflictingClassGroups: {
        overflow: ["overflow-x", "overflow-y"],
        overscroll: ["overscroll-x", "overscroll-y"],
        inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
        "inset-x": ["right", "left"],
        "inset-y": ["top", "bottom"],
        flex: ["basis", "grow", "shrink"],
        gap: ["gap-x", "gap-y"],
        p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
        px: ["pr", "pl"],
        py: ["pt", "pb"],
        m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
        mx: ["mr", "ml"],
        my: ["mt", "mb"],
        size: ["w", "h"],
        "font-size": ["leading"],
        "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
        "fvn-ordinal": ["fvn-normal"],
        "fvn-slashed-zero": ["fvn-normal"],
        "fvn-figure": ["fvn-normal"],
        "fvn-spacing": ["fvn-normal"],
        "fvn-fraction": ["fvn-normal"],
        "line-clamp": ["display", "overflow"],
        rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
        "rounded-s": ["rounded-ss", "rounded-es"],
        "rounded-e": ["rounded-se", "rounded-ee"],
        "rounded-t": ["rounded-tl", "rounded-tr"],
        "rounded-r": ["rounded-tr", "rounded-br"],
        "rounded-b": ["rounded-br", "rounded-bl"],
        "rounded-l": ["rounded-tl", "rounded-bl"],
        "border-spacing": ["border-spacing-x", "border-spacing-y"],
        "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
        "border-w-x": ["border-w-r", "border-w-l"],
        "border-w-y": ["border-w-t", "border-w-b"],
        "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
        "border-color-x": ["border-color-r", "border-color-l"],
        "border-color-y": ["border-color-t", "border-color-b"],
        translate: ["translate-x", "translate-y", "translate-none"],
        "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
        "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
        "scroll-mx": ["scroll-mr", "scroll-ml"],
        "scroll-my": ["scroll-mt", "scroll-mb"],
        "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
        "scroll-px": ["scroll-pr", "scroll-pl"],
        "scroll-py": ["scroll-pt", "scroll-pb"],
        touch: ["touch-x", "touch-y", "touch-pz"],
        "touch-x": ["touch"],
        "touch-y": ["touch"],
        "touch-pz": ["touch"]
      },
      conflictingClassGroupModifiers: {
        "font-size": ["leading"]
      },
      orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
    };
  };
  const twMerge = createTailwindMerge(getDefaultConfig);
  function cn$1(...inputs) {
    return twMerge(clsx.clsx(inputs));
  }
  function ScrollArea({
    className,
    children,
    ref,
    ...props
  }) {
    return jsxRuntimeExports.jsxs(
      Root$6,
      {
        "data-slot": "scroll-area",
        className: cn$1("relative", className),
        ...props,
        children: [
jsxRuntimeExports.jsx(
            Viewport,
            {
              ref,
              "data-slot": "scroll-area-viewport",
              className: "focus-visible:ring-ring/50 size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:outline-1 [&>div]:!block",
              children
            }
          ),
jsxRuntimeExports.jsx(ScrollBar, {}),
jsxRuntimeExports.jsx(Corner, {})
        ]
      }
    );
  }
  function ScrollBar({
    className,
    orientation = "vertical",
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      ScrollAreaScrollbar,
      {
        "data-slot": "scroll-area-scrollbar",
        orientation,
        className: cn$1(
          "flex touch-none p-px transition-colors select-none",
          orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent",
          orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent",
          className
        ),
        ...props,
        children: jsxRuntimeExports.jsx(
          ScrollAreaThumb,
          {
            "data-slot": "scroll-area-thumb",
            className: "bg-border relative flex-1 rounded-full"
          }
        )
      }
    );
  }
  const SvgImageError = (props) => React__namespace.createElement("svg", { t: 1760857878018, className: "icon", viewBox: "0 0 1024 1024", xmlns: "http://www.w3.org/2000/svg", "p-id": 1823, xmlnsXlink: "http://www.w3.org/1999/xlink", width: 200, height: 200, ...props }, React__namespace.createElement("path", { d: "M540.042 675.4l-322.6-305.8c-6.8 3.5-12.9 8.1-18.1 13.7l-134.4 141-7.1-262.7c-0.9-31.6 24.6-58.3 56.2-59.1l237.9-6.4 55.8-59-295.3 8c-63.8 1.8-114.1 54.6-112.4 118.1l8.6 320 5.4 196.6c1.7 63.5 54.8 113.5 118.6 111.8l207.5-5.6 14.1-0.4 55.8-59 137-144.6-7-6.6z m189.5-218.5c47.9 0 86.7-38.6 86.7-86.2s-38.9-86.2-86.7-86.2c-47.8 0-86.7 38.6-86.7 86.2s38.8 86.2 86.7 86.2z", "p-id": 1824, fill: "currentColor" }), React__namespace.createElement("path", { d: "M924.342 161.6l-286.3-40-65 48.9 343.3 47.9c31.5 4.4 53.5 33.5 49.3 65l-64.1 459.3-142.4-187.5c-23.5-30.9-67.5-37-98.5-13.8l-51.9 39 76.8 101.6-65.2 49.3-93.8 70.9-64.8 48.8 40.3 5.6 319.2 44.5c61.4 8.8 118.8-32.7 129.6-93.9 0.4-1.3 0.6-2.7 0.8-4.1l71.4-511.9c8.7-62.7-35.4-120.8-98.7-129.6z", "p-id": 1825, fill: "currentColor" }));
  function LoadingIcon(props) {
    const { className, strokeWidth = 80 } = props;
    return jsxRuntimeExports.jsxs(
      "svg",
      {
        className: `animate-spin ${className}`,
        viewBox: "0 0 1024 1024",
        version: "1.1",
        "p-id": "1869",
        width: "200",
        height: "200",
        xmlns: "http://www.w3.org/2000/svg",
        children: [
jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "513",
              cy: "512",
              r: "400",
              fill: "none",
              stroke: "rgba(223, 223, 223, .5)",
              strokeWidth
            }
          ),
jsxRuntimeExports.jsx(
            "circle",
            {
              cx: "513",
              cy: "512",
              r: "400",
              fill: "none",
              stroke: "currentColor",
              strokeLinecap: "round",
              strokeWidth: strokeWidth - 20,
              strokeDasharray: "2512",
              children: jsxRuntimeExports.jsx(
                "animate",
                {
                  attributeName: "stroke-dashoffset",
                  values: "2512;1000;2512",
                  dur: "2s",
                  repeatCount: "indefinite"
                }
              )
            }
          )
        ]
      }
    );
  }
  const LayoutGroupContext = React.createContext({});
  function useConstant(init) {
    const ref = React.useRef(null);
    if (ref.current === null) {
      ref.current = init();
    }
    return ref.current;
  }
  const isBrowser = typeof window !== "undefined";
  const useIsomorphicLayoutEffect$1 = isBrowser ? React.useLayoutEffect : React.useEffect;
  const PresenceContext = React.createContext(null);
  function addUniqueItem(arr, item) {
    if (arr.indexOf(item) === -1)
      arr.push(item);
  }
  function removeItem(arr, item) {
    const index2 = arr.indexOf(item);
    if (index2 > -1)
      arr.splice(index2, 1);
  }
  const clamp$1 = (min2, max2, v) => {
    if (v > max2)
      return max2;
    if (v < min2)
      return min2;
    return v;
  };
  let invariant = () => {
  };
  const MotionGlobalConfig = {};
  const isNumericalString = (v) => /^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(v);
  function isObject$1(value) {
    return typeof value === "object" && value !== null;
  }
  const isZeroValueString = (v) => /^0[^.\s]+$/u.test(v);
function memo(callback) {
    let result;
    return () => {
      if (result === void 0)
        result = callback();
      return result;
    };
  }
  const noop$1 = (any) => any;
  const combineFunctions = (a2, b) => (v) => b(a2(v));
  const pipe = (...transformers) => transformers.reduce(combineFunctions);
  const progress = (from, to, value) => {
    const toFromDifference = to - from;
    return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
  };
  class SubscriptionManager {
    constructor() {
      this.subscriptions = [];
    }
    add(handler) {
      addUniqueItem(this.subscriptions, handler);
      return () => removeItem(this.subscriptions, handler);
    }
    notify(a2, b, c) {
      const numSubscriptions = this.subscriptions.length;
      if (!numSubscriptions)
        return;
      if (numSubscriptions === 1) {
        this.subscriptions[0](a2, b, c);
      } else {
        for (let i2 = 0; i2 < numSubscriptions; i2++) {
          const handler = this.subscriptions[i2];
          handler && handler(a2, b, c);
        }
      }
    }
    getSize() {
      return this.subscriptions.length;
    }
    clear() {
      this.subscriptions.length = 0;
    }
  }
  const secondsToMilliseconds = (seconds) => seconds * 1e3;
  const millisecondsToSeconds = (milliseconds) => milliseconds / 1e3;
  function velocityPerSecond(velocity, frameDuration) {
    return frameDuration ? velocity * (1e3 / frameDuration) : 0;
  }
  const calcBezier = (t2, a1, a2) => (((1 - 3 * a2 + 3 * a1) * t2 + (3 * a2 - 6 * a1)) * t2 + 3 * a1) * t2;
  const subdivisionPrecision = 1e-7;
  const subdivisionMaxIterations = 12;
  function binarySubdivide(x2, lowerBound, upperBound, mX1, mX2) {
    let currentX;
    let currentT;
    let i2 = 0;
    do {
      currentT = lowerBound + (upperBound - lowerBound) / 2;
      currentX = calcBezier(currentT, mX1, mX2) - x2;
      if (currentX > 0) {
        upperBound = currentT;
      } else {
        lowerBound = currentT;
      }
    } while (Math.abs(currentX) > subdivisionPrecision && ++i2 < subdivisionMaxIterations);
    return currentT;
  }
  function cubicBezier(mX1, mY1, mX2, mY2) {
    if (mX1 === mY1 && mX2 === mY2)
      return noop$1;
    const getTForX = (aX) => binarySubdivide(aX, 0, 1, mX1, mX2);
    return (t2) => t2 === 0 || t2 === 1 ? t2 : calcBezier(getTForX(t2), mY1, mY2);
  }
  const mirrorEasing = (easing) => (p) => p <= 0.5 ? easing(2 * p) / 2 : (2 - easing(2 * (1 - p))) / 2;
  const reverseEasing = (easing) => (p) => 1 - easing(1 - p);
  const backOut = cubicBezier(0.33, 1.53, 0.69, 0.99);
  const backIn = reverseEasing(backOut);
  const backInOut = mirrorEasing(backIn);
  const anticipate = (p) => (p *= 2) < 1 ? 0.5 * backIn(p) : 0.5 * (2 - Math.pow(2, -10 * (p - 1)));
  const circIn = (p) => 1 - Math.sin(Math.acos(p));
  const circOut = reverseEasing(circIn);
  const circInOut = mirrorEasing(circIn);
  const easeIn = cubicBezier(0.42, 0, 1, 1);
  const easeOut = cubicBezier(0, 0, 0.58, 1);
  const easeInOut = cubicBezier(0.42, 0, 0.58, 1);
  const isEasingArray = (ease2) => {
    return Array.isArray(ease2) && typeof ease2[0] !== "number";
  };
  const isBezierDefinition = (easing) => Array.isArray(easing) && typeof easing[0] === "number";
  const easingLookup = {
    linear: noop$1,
    easeIn,
    easeInOut,
    easeOut,
    circIn,
    circInOut,
    circOut,
    backIn,
    backInOut,
    backOut,
    anticipate
  };
  const isValidEasing = (easing) => {
    return typeof easing === "string";
  };
  const easingDefinitionToFunction = (definition) => {
    if (isBezierDefinition(definition)) {
      invariant(definition.length === 4);
      const [x1, y1, x2, y2] = definition;
      return cubicBezier(x1, y1, x2, y2);
    } else if (isValidEasing(definition)) {
      return easingLookup[definition];
    }
    return definition;
  };
  const stepsOrder = [
    "setup",
"read",
"resolveKeyframes",
"preUpdate",
"update",
"preRender",
"render",
"postRender"
];
  function createRenderStep(runNextFrame, stepName) {
    let thisFrame = new Set();
    let nextFrame = new Set();
    let isProcessing = false;
    let flushNextFrame = false;
    const toKeepAlive = new WeakSet();
    let latestFrameData = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    };
    function triggerCallback(callback) {
      if (toKeepAlive.has(callback)) {
        step.schedule(callback);
        runNextFrame();
      }
      callback(latestFrameData);
    }
    const step = {
schedule: (callback, keepAlive = false, immediate = false) => {
        const addToCurrentFrame = immediate && isProcessing;
        const queue = addToCurrentFrame ? thisFrame : nextFrame;
        if (keepAlive)
          toKeepAlive.add(callback);
        if (!queue.has(callback))
          queue.add(callback);
        return callback;
      },
cancel: (callback) => {
        nextFrame.delete(callback);
        toKeepAlive.delete(callback);
      },
process: (frameData2) => {
        latestFrameData = frameData2;
        if (isProcessing) {
          flushNextFrame = true;
          return;
        }
        isProcessing = true;
        [thisFrame, nextFrame] = [nextFrame, thisFrame];
        thisFrame.forEach(triggerCallback);
        thisFrame.clear();
        isProcessing = false;
        if (flushNextFrame) {
          flushNextFrame = false;
          step.process(frameData2);
        }
      }
    };
    return step;
  }
  const maxElapsed = 40;
  function createRenderBatcher(scheduleNextBatch, allowKeepAlive) {
    let runNextFrame = false;
    let useDefaultElapsed = true;
    const state = {
      delta: 0,
      timestamp: 0,
      isProcessing: false
    };
    const flagRunNextFrame = () => runNextFrame = true;
    const steps = stepsOrder.reduce((acc, key) => {
      acc[key] = createRenderStep(flagRunNextFrame);
      return acc;
    }, {});
    const { setup, read, resolveKeyframes, preUpdate, update, preRender, render, postRender } = steps;
    const processBatch = () => {
      const timestamp = MotionGlobalConfig.useManualTiming ? state.timestamp : performance.now();
      runNextFrame = false;
      if (!MotionGlobalConfig.useManualTiming) {
        state.delta = useDefaultElapsed ? 1e3 / 60 : Math.max(Math.min(timestamp - state.timestamp, maxElapsed), 1);
      }
      state.timestamp = timestamp;
      state.isProcessing = true;
      setup.process(state);
      read.process(state);
      resolveKeyframes.process(state);
      preUpdate.process(state);
      update.process(state);
      preRender.process(state);
      render.process(state);
      postRender.process(state);
      state.isProcessing = false;
      if (runNextFrame && allowKeepAlive) {
        useDefaultElapsed = false;
        scheduleNextBatch(processBatch);
      }
    };
    const wake = () => {
      runNextFrame = true;
      useDefaultElapsed = true;
      if (!state.isProcessing) {
        scheduleNextBatch(processBatch);
      }
    };
    const schedule = stepsOrder.reduce((acc, key) => {
      const step = steps[key];
      acc[key] = (process, keepAlive = false, immediate = false) => {
        if (!runNextFrame)
          wake();
        return step.schedule(process, keepAlive, immediate);
      };
      return acc;
    }, {});
    const cancel = (process) => {
      for (let i2 = 0; i2 < stepsOrder.length; i2++) {
        steps[stepsOrder[i2]].cancel(process);
      }
    };
    return { schedule, cancel, state, steps };
  }
  const { schedule: frame, cancel: cancelFrame, state: frameData, steps: frameSteps } = createRenderBatcher(typeof requestAnimationFrame !== "undefined" ? requestAnimationFrame : noop$1, true);
  let now;
  function clearTime() {
    now = void 0;
  }
  const time = {
    now: () => {
      if (now === void 0) {
        time.set(frameData.isProcessing || MotionGlobalConfig.useManualTiming ? frameData.timestamp : performance.now());
      }
      return now;
    },
    set: (newTime) => {
      now = newTime;
      queueMicrotask(clearTime);
    }
  };
  const checkStringStartsWith = (token) => (key) => typeof key === "string" && key.startsWith(token);
  const isCSSVariableName = checkStringStartsWith("--");
  const startsAsVariableToken = checkStringStartsWith("var(--");
  const isCSSVariableToken = (value) => {
    const startsWithToken = startsAsVariableToken(value);
    if (!startsWithToken)
      return false;
    return singleCssVariableRegex.test(value.split("/*")[0].trim());
  };
  const singleCssVariableRegex = /var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu;
  const number = {
    test: (v) => typeof v === "number",
    parse: parseFloat,
    transform: (v) => v
  };
  const alpha = {
    ...number,
    transform: (v) => clamp$1(0, 1, v)
  };
  const scale = {
    ...number,
    default: 1
  };
  const sanitize = (v) => Math.round(v * 1e5) / 1e5;
  const floatRegex = /-?(?:\d+(?:\.\d+)?|\.\d+)/gu;
  function isNullish(v) {
    return v == null;
  }
  const singleColorRegex = /^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu;
  const isColorString = (type, testProp) => (v) => {
    return Boolean(typeof v === "string" && singleColorRegex.test(v) && v.startsWith(type) || testProp && !isNullish(v) && Object.prototype.hasOwnProperty.call(v, testProp));
  };
  const splitColor = (aName, bName, cName) => (v) => {
    if (typeof v !== "string")
      return v;
    const [a2, b, c, alpha2] = v.match(floatRegex);
    return {
      [aName]: parseFloat(a2),
      [bName]: parseFloat(b),
      [cName]: parseFloat(c),
      alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
    };
  };
  const clampRgbUnit = (v) => clamp$1(0, 255, v);
  const rgbUnit = {
    ...number,
    transform: (v) => Math.round(clampRgbUnit(v))
  };
  const rgba = {
    test: isColorString("rgb", "red"),
    parse: splitColor("red", "green", "blue"),
    transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
  };
  function parseHex(v) {
    let r2 = "";
    let g = "";
    let b = "";
    let a2 = "";
    if (v.length > 5) {
      r2 = v.substring(1, 3);
      g = v.substring(3, 5);
      b = v.substring(5, 7);
      a2 = v.substring(7, 9);
    } else {
      r2 = v.substring(1, 2);
      g = v.substring(2, 3);
      b = v.substring(3, 4);
      a2 = v.substring(4, 5);
      r2 += r2;
      g += g;
      b += b;
      a2 += a2;
    }
    return {
      red: parseInt(r2, 16),
      green: parseInt(g, 16),
      blue: parseInt(b, 16),
      alpha: a2 ? parseInt(a2, 16) / 255 : 1
    };
  }
  const hex = {
    test: isColorString("#"),
    parse: parseHex,
    transform: rgba.transform
  };
  const createUnitType = (unit) => ({
    test: (v) => typeof v === "string" && v.endsWith(unit) && v.split(" ").length === 1,
    parse: parseFloat,
    transform: (v) => `${v}${unit}`
  });
  const degrees = createUnitType("deg");
  const percent = createUnitType("%");
  const px = createUnitType("px");
  const vh = createUnitType("vh");
  const vw = createUnitType("vw");
  const progressPercentage = (() => ({
    ...percent,
    parse: (v) => percent.parse(v) / 100,
    transform: (v) => percent.transform(v * 100)
  }))();
  const hsla = {
    test: isColorString("hsl", "hue"),
    parse: splitColor("hue", "saturation", "lightness"),
    transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
      return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
    }
  };
  const color = {
    test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
    parse: (v) => {
      if (rgba.test(v)) {
        return rgba.parse(v);
      } else if (hsla.test(v)) {
        return hsla.parse(v);
      } else {
        return hex.parse(v);
      }
    },
    transform: (v) => {
      return typeof v === "string" ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
    },
    getAnimatableNone: (v) => {
      const parsed = color.parse(v);
      parsed.alpha = 0;
      return color.transform(parsed);
    }
  };
  const colorRegex = /(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu;
  function test(v) {
    return isNaN(v) && typeof v === "string" && (v.match(floatRegex)?.length || 0) + (v.match(colorRegex)?.length || 0) > 0;
  }
  const NUMBER_TOKEN = "number";
  const COLOR_TOKEN = "color";
  const VAR_TOKEN = "var";
  const VAR_FUNCTION_TOKEN = "var(";
  const SPLIT_TOKEN = "${}";
  const complexRegex = /var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;
  function analyseComplexValue(value) {
    const originalValue = value.toString();
    const values = [];
    const indexes = {
      color: [],
      number: [],
      var: []
    };
    const types = [];
    let i2 = 0;
    const tokenised = originalValue.replace(complexRegex, (parsedValue) => {
      if (color.test(parsedValue)) {
        indexes.color.push(i2);
        types.push(COLOR_TOKEN);
        values.push(color.parse(parsedValue));
      } else if (parsedValue.startsWith(VAR_FUNCTION_TOKEN)) {
        indexes.var.push(i2);
        types.push(VAR_TOKEN);
        values.push(parsedValue);
      } else {
        indexes.number.push(i2);
        types.push(NUMBER_TOKEN);
        values.push(parseFloat(parsedValue));
      }
      ++i2;
      return SPLIT_TOKEN;
    });
    const split = tokenised.split(SPLIT_TOKEN);
    return { values, split, indexes, types };
  }
  function parseComplexValue(v) {
    return analyseComplexValue(v).values;
  }
  function createTransformer(source) {
    const { split, types } = analyseComplexValue(source);
    const numSections = split.length;
    return (v) => {
      let output = "";
      for (let i2 = 0; i2 < numSections; i2++) {
        output += split[i2];
        if (v[i2] !== void 0) {
          const type = types[i2];
          if (type === NUMBER_TOKEN) {
            output += sanitize(v[i2]);
          } else if (type === COLOR_TOKEN) {
            output += color.transform(v[i2]);
          } else {
            output += v[i2];
          }
        }
      }
      return output;
    };
  }
  const convertNumbersToZero = (v) => typeof v === "number" ? 0 : color.test(v) ? color.getAnimatableNone(v) : v;
  function getAnimatableNone$1(v) {
    const parsed = parseComplexValue(v);
    const transformer = createTransformer(v);
    return transformer(parsed.map(convertNumbersToZero));
  }
  const complex = {
    test,
    parse: parseComplexValue,
    createTransformer,
    getAnimatableNone: getAnimatableNone$1
  };
  function hueToRgb(p, q, t2) {
    if (t2 < 0)
      t2 += 1;
    if (t2 > 1)
      t2 -= 1;
    if (t2 < 1 / 6)
      return p + (q - p) * 6 * t2;
    if (t2 < 1 / 2)
      return q;
    if (t2 < 2 / 3)
      return p + (q - p) * (2 / 3 - t2) * 6;
    return p;
  }
  function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
    hue /= 360;
    saturation /= 100;
    lightness /= 100;
    let red = 0;
    let green = 0;
    let blue = 0;
    if (!saturation) {
      red = green = blue = lightness;
    } else {
      const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
      const p = 2 * lightness - q;
      red = hueToRgb(p, q, hue + 1 / 3);
      green = hueToRgb(p, q, hue);
      blue = hueToRgb(p, q, hue - 1 / 3);
    }
    return {
      red: Math.round(red * 255),
      green: Math.round(green * 255),
      blue: Math.round(blue * 255),
      alpha: alpha2
    };
  }
  function mixImmediate(a2, b) {
    return (p) => p > 0 ? b : a2;
  }
  const mixNumber$1 = (from, to, progress2) => {
    return from + (to - from) * progress2;
  };
  const mixLinearColor = (from, to, v) => {
    const fromExpo = from * from;
    const expo = v * (to * to - fromExpo) + fromExpo;
    return expo < 0 ? 0 : Math.sqrt(expo);
  };
  const colorTypes = [hex, rgba, hsla];
  const getColorType = (v) => colorTypes.find((type) => type.test(v));
  function asRGBA(color2) {
    const type = getColorType(color2);
    if (!Boolean(type))
      return false;
    let model = type.parse(color2);
    if (type === hsla) {
      model = hslaToRgba(model);
    }
    return model;
  }
  const mixColor = (from, to) => {
    const fromRGBA = asRGBA(from);
    const toRGBA = asRGBA(to);
    if (!fromRGBA || !toRGBA) {
      return mixImmediate(from, to);
    }
    const blended = { ...fromRGBA };
    return (v) => {
      blended.red = mixLinearColor(fromRGBA.red, toRGBA.red, v);
      blended.green = mixLinearColor(fromRGBA.green, toRGBA.green, v);
      blended.blue = mixLinearColor(fromRGBA.blue, toRGBA.blue, v);
      blended.alpha = mixNumber$1(fromRGBA.alpha, toRGBA.alpha, v);
      return rgba.transform(blended);
    };
  };
  const invisibleValues = new Set(["none", "hidden"]);
  function mixVisibility(origin, target) {
    if (invisibleValues.has(origin)) {
      return (p) => p <= 0 ? origin : target;
    } else {
      return (p) => p >= 1 ? target : origin;
    }
  }
  function mixNumber(a2, b) {
    return (p) => mixNumber$1(a2, b, p);
  }
  function getMixer(a2) {
    if (typeof a2 === "number") {
      return mixNumber;
    } else if (typeof a2 === "string") {
      return isCSSVariableToken(a2) ? mixImmediate : color.test(a2) ? mixColor : mixComplex;
    } else if (Array.isArray(a2)) {
      return mixArray;
    } else if (typeof a2 === "object") {
      return color.test(a2) ? mixColor : mixObject;
    }
    return mixImmediate;
  }
  function mixArray(a2, b) {
    const output = [...a2];
    const numValues = output.length;
    const blendValue = a2.map((v, i2) => getMixer(v)(v, b[i2]));
    return (p) => {
      for (let i2 = 0; i2 < numValues; i2++) {
        output[i2] = blendValue[i2](p);
      }
      return output;
    };
  }
  function mixObject(a2, b) {
    const output = { ...a2, ...b };
    const blendValue = {};
    for (const key in output) {
      if (a2[key] !== void 0 && b[key] !== void 0) {
        blendValue[key] = getMixer(a2[key])(a2[key], b[key]);
      }
    }
    return (v) => {
      for (const key in blendValue) {
        output[key] = blendValue[key](v);
      }
      return output;
    };
  }
  function matchOrder(origin, target) {
    const orderedOrigin = [];
    const pointers = { color: 0, var: 0, number: 0 };
    for (let i2 = 0; i2 < target.values.length; i2++) {
      const type = target.types[i2];
      const originIndex = origin.indexes[type][pointers[type]];
      const originValue = origin.values[originIndex] ?? 0;
      orderedOrigin[i2] = originValue;
      pointers[type]++;
    }
    return orderedOrigin;
  }
  const mixComplex = (origin, target) => {
    const template = complex.createTransformer(target);
    const originStats = analyseComplexValue(origin);
    const targetStats = analyseComplexValue(target);
    const canInterpolate = originStats.indexes.var.length === targetStats.indexes.var.length && originStats.indexes.color.length === targetStats.indexes.color.length && originStats.indexes.number.length >= targetStats.indexes.number.length;
    if (canInterpolate) {
      if (invisibleValues.has(origin) && !targetStats.values.length || invisibleValues.has(target) && !originStats.values.length) {
        return mixVisibility(origin, target);
      }
      return pipe(mixArray(matchOrder(originStats, targetStats), targetStats.values), template);
    } else {
      return mixImmediate(origin, target);
    }
  };
  function mix(from, to, p) {
    if (typeof from === "number" && typeof to === "number" && typeof p === "number") {
      return mixNumber$1(from, to, p);
    }
    const mixer = getMixer(from);
    return mixer(from, to);
  }
  const frameloopDriver = (update) => {
    const passTimestamp = ({ timestamp }) => update(timestamp);
    return {
      start: (keepAlive = true) => frame.update(passTimestamp, keepAlive),
      stop: () => cancelFrame(passTimestamp),
now: () => frameData.isProcessing ? frameData.timestamp : time.now()
    };
  };
  const generateLinearEasing = (easing, duration, resolution = 10) => {
    let points = "";
    const numPoints = Math.max(Math.round(duration / resolution), 2);
    for (let i2 = 0; i2 < numPoints; i2++) {
      points += Math.round(easing(i2 / (numPoints - 1)) * 1e4) / 1e4 + ", ";
    }
    return `linear(${points.substring(0, points.length - 2)})`;
  };
  const maxGeneratorDuration = 2e4;
  function calcGeneratorDuration(generator) {
    let duration = 0;
    const timeStep = 50;
    let state = generator.next(duration);
    while (!state.done && duration < maxGeneratorDuration) {
      duration += timeStep;
      state = generator.next(duration);
    }
    return duration >= maxGeneratorDuration ? Infinity : duration;
  }
  function createGeneratorEasing(options, scale2 = 100, createGenerator) {
    const generator = createGenerator({ ...options, keyframes: [0, scale2] });
    const duration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
    return {
      type: "keyframes",
      ease: (progress2) => {
        return generator.next(duration * progress2).value / scale2;
      },
      duration: millisecondsToSeconds(duration)
    };
  }
  const velocitySampleDuration = 5;
  function calcGeneratorVelocity(resolveValue, t2, current) {
    const prevT = Math.max(t2 - velocitySampleDuration, 0);
    return velocityPerSecond(current - resolveValue(prevT), t2 - prevT);
  }
  const springDefaults = {
stiffness: 100,
    damping: 10,
    mass: 1,
    velocity: 0,
duration: 800,
bounce: 0.3,
    visualDuration: 0.3,

restSpeed: {
      granular: 0.01,
      default: 2
    },
    restDelta: {
      granular: 5e-3,
      default: 0.5
    },
minDuration: 0.01,
maxDuration: 10,
minDamping: 0.05,
    maxDamping: 1
  };
  const safeMin = 1e-3;
  function findSpring({ duration = springDefaults.duration, bounce = springDefaults.bounce, velocity = springDefaults.velocity, mass = springDefaults.mass }) {
    let envelope;
    let derivative;
    let dampingRatio = 1 - bounce;
    dampingRatio = clamp$1(springDefaults.minDamping, springDefaults.maxDamping, dampingRatio);
    duration = clamp$1(springDefaults.minDuration, springDefaults.maxDuration, millisecondsToSeconds(duration));
    if (dampingRatio < 1) {
      envelope = (undampedFreq2) => {
        const exponentialDecay = undampedFreq2 * dampingRatio;
        const delta = exponentialDecay * duration;
        const a2 = exponentialDecay - velocity;
        const b = calcAngularFreq(undampedFreq2, dampingRatio);
        const c = Math.exp(-delta);
        return safeMin - a2 / b * c;
      };
      derivative = (undampedFreq2) => {
        const exponentialDecay = undampedFreq2 * dampingRatio;
        const delta = exponentialDecay * duration;
        const d = delta * velocity + velocity;
        const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
        const f = Math.exp(-delta);
        const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
        const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
        return factor * ((d - e) * f) / g;
      };
    } else {
      envelope = (undampedFreq2) => {
        const a2 = Math.exp(-undampedFreq2 * duration);
        const b = (undampedFreq2 - velocity) * duration + 1;
        return -safeMin + a2 * b;
      };
      derivative = (undampedFreq2) => {
        const a2 = Math.exp(-undampedFreq2 * duration);
        const b = (velocity - undampedFreq2) * (duration * duration);
        return a2 * b;
      };
    }
    const initialGuess = 5 / duration;
    const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
    duration = secondsToMilliseconds(duration);
    if (isNaN(undampedFreq)) {
      return {
        stiffness: springDefaults.stiffness,
        damping: springDefaults.damping,
        duration
      };
    } else {
      const stiffness = Math.pow(undampedFreq, 2) * mass;
      return {
        stiffness,
        damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
        duration
      };
    }
  }
  const rootIterations = 12;
  function approximateRoot(envelope, derivative, initialGuess) {
    let result = initialGuess;
    for (let i2 = 1; i2 < rootIterations; i2++) {
      result = result - envelope(result) / derivative(result);
    }
    return result;
  }
  function calcAngularFreq(undampedFreq, dampingRatio) {
    return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
  }
  const durationKeys = ["duration", "bounce"];
  const physicsKeys = ["stiffness", "damping", "mass"];
  function isSpringType(options, keys) {
    return keys.some((key) => options[key] !== void 0);
  }
  function getSpringOptions(options) {
    let springOptions = {
      velocity: springDefaults.velocity,
      stiffness: springDefaults.stiffness,
      damping: springDefaults.damping,
      mass: springDefaults.mass,
      isResolvedFromDuration: false,
      ...options
    };
    if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
      if (options.visualDuration) {
        const visualDuration = options.visualDuration;
        const root = 2 * Math.PI / (visualDuration * 1.2);
        const stiffness = root * root;
        const damping = 2 * clamp$1(0.05, 1, 1 - (options.bounce || 0)) * Math.sqrt(stiffness);
        springOptions = {
          ...springOptions,
          mass: springDefaults.mass,
          stiffness,
          damping
        };
      } else {
        const derived = findSpring(options);
        springOptions = {
          ...springOptions,
          ...derived,
          mass: springDefaults.mass
        };
        springOptions.isResolvedFromDuration = true;
      }
    }
    return springOptions;
  }
  function spring(optionsOrVisualDuration = springDefaults.visualDuration, bounce = springDefaults.bounce) {
    const options = typeof optionsOrVisualDuration !== "object" ? {
      visualDuration: optionsOrVisualDuration,
      keyframes: [0, 1],
      bounce
    } : optionsOrVisualDuration;
    let { restSpeed, restDelta } = options;
    const origin = options.keyframes[0];
    const target = options.keyframes[options.keyframes.length - 1];
    const state = { done: false, value: origin };
    const { stiffness, damping, mass, duration, velocity, isResolvedFromDuration } = getSpringOptions({
      ...options,
      velocity: - millisecondsToSeconds(options.velocity || 0)
    });
    const initialVelocity = velocity || 0;
    const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
    const initialDelta = target - origin;
    const undampedAngularFreq = millisecondsToSeconds(Math.sqrt(stiffness / mass));
    const isGranularScale = Math.abs(initialDelta) < 5;
    restSpeed || (restSpeed = isGranularScale ? springDefaults.restSpeed.granular : springDefaults.restSpeed.default);
    restDelta || (restDelta = isGranularScale ? springDefaults.restDelta.granular : springDefaults.restDelta.default);
    let resolveSpring;
    if (dampingRatio < 1) {
      const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
      resolveSpring = (t2) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t2);
        return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t2) + initialDelta * Math.cos(angularFreq * t2));
      };
    } else if (dampingRatio === 1) {
      resolveSpring = (t2) => target - Math.exp(-undampedAngularFreq * t2) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t2);
    } else {
      const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
      resolveSpring = (t2) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t2);
        const freqForT = Math.min(dampedAngularFreq * t2, 300);
        return target - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
      };
    }
    const generator = {
      calculatedDuration: isResolvedFromDuration ? duration || null : null,
      next: (t2) => {
        const current = resolveSpring(t2);
        if (!isResolvedFromDuration) {
          let currentVelocity = t2 === 0 ? initialVelocity : 0;
          if (dampingRatio < 1) {
            currentVelocity = t2 === 0 ? secondsToMilliseconds(initialVelocity) : calcGeneratorVelocity(resolveSpring, t2, current);
          }
          const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
          const isBelowDisplacementThreshold = Math.abs(target - current) <= restDelta;
          state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
        } else {
          state.done = t2 >= duration;
        }
        state.value = state.done ? target : current;
        return state;
      },
      toString: () => {
        const calculatedDuration = Math.min(calcGeneratorDuration(generator), maxGeneratorDuration);
        const easing = generateLinearEasing((progress2) => generator.next(calculatedDuration * progress2).value, calculatedDuration, 30);
        return calculatedDuration + "ms " + easing;
      },
      toTransition: () => {
      }
    };
    return generator;
  }
  spring.applyToOptions = (options) => {
    const generatorOptions = createGeneratorEasing(options, 100, spring);
    options.ease = generatorOptions.ease;
    options.duration = secondsToMilliseconds(generatorOptions.duration);
    options.type = "keyframes";
    return options;
  };
  function inertia({ keyframes: keyframes2, velocity = 0, power = 0.8, timeConstant = 325, bounceDamping = 10, bounceStiffness = 500, modifyTarget, min: min2, max: max2, restDelta = 0.5, restSpeed }) {
    const origin = keyframes2[0];
    const state = {
      done: false,
      value: origin
    };
    const isOutOfBounds = (v) => min2 !== void 0 && v < min2 || max2 !== void 0 && v > max2;
    const nearestBoundary = (v) => {
      if (min2 === void 0)
        return max2;
      if (max2 === void 0)
        return min2;
      return Math.abs(min2 - v) < Math.abs(max2 - v) ? min2 : max2;
    };
    let amplitude = power * velocity;
    const ideal = origin + amplitude;
    const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
    if (target !== ideal)
      amplitude = target - origin;
    const calcDelta = (t2) => -amplitude * Math.exp(-t2 / timeConstant);
    const calcLatest = (t2) => target + calcDelta(t2);
    const applyFriction = (t2) => {
      const delta = calcDelta(t2);
      const latest = calcLatest(t2);
      state.done = Math.abs(delta) <= restDelta;
      state.value = state.done ? target : latest;
    };
    let timeReachedBoundary;
    let spring$1;
    const checkCatchBoundary = (t2) => {
      if (!isOutOfBounds(state.value))
        return;
      timeReachedBoundary = t2;
      spring$1 = spring({
        keyframes: [state.value, nearestBoundary(state.value)],
        velocity: calcGeneratorVelocity(calcLatest, t2, state.value),
damping: bounceDamping,
        stiffness: bounceStiffness,
        restDelta,
        restSpeed
      });
    };
    checkCatchBoundary(0);
    return {
      calculatedDuration: null,
      next: (t2) => {
        let hasUpdatedFrame = false;
        if (!spring$1 && timeReachedBoundary === void 0) {
          hasUpdatedFrame = true;
          applyFriction(t2);
          checkCatchBoundary(t2);
        }
        if (timeReachedBoundary !== void 0 && t2 >= timeReachedBoundary) {
          return spring$1.next(t2 - timeReachedBoundary);
        } else {
          !hasUpdatedFrame && applyFriction(t2);
          return state;
        }
      }
    };
  }
  function createMixers(output, ease2, customMixer) {
    const mixers = [];
    const mixerFactory = customMixer || MotionGlobalConfig.mix || mix;
    const numMixers = output.length - 1;
    for (let i2 = 0; i2 < numMixers; i2++) {
      let mixer = mixerFactory(output[i2], output[i2 + 1]);
      if (ease2) {
        const easingFunction = Array.isArray(ease2) ? ease2[i2] || noop$1 : ease2;
        mixer = pipe(easingFunction, mixer);
      }
      mixers.push(mixer);
    }
    return mixers;
  }
  function interpolate(input, output, { clamp: isClamp = true, ease: ease2, mixer } = {}) {
    const inputLength = input.length;
    invariant(inputLength === output.length);
    if (inputLength === 1)
      return () => output[0];
    if (inputLength === 2 && output[0] === output[1])
      return () => output[1];
    const isZeroDeltaRange = input[0] === input[1];
    if (input[0] > input[inputLength - 1]) {
      input = [...input].reverse();
      output = [...output].reverse();
    }
    const mixers = createMixers(output, ease2, mixer);
    const numMixers = mixers.length;
    const interpolator = (v) => {
      if (isZeroDeltaRange && v < input[0])
        return output[0];
      let i2 = 0;
      if (numMixers > 1) {
        for (; i2 < input.length - 2; i2++) {
          if (v < input[i2 + 1])
            break;
        }
      }
      const progressInRange = progress(input[i2], input[i2 + 1], v);
      return mixers[i2](progressInRange);
    };
    return isClamp ? (v) => interpolator(clamp$1(input[0], input[inputLength - 1], v)) : interpolator;
  }
  function fillOffset(offset2, remaining) {
    const min2 = offset2[offset2.length - 1];
    for (let i2 = 1; i2 <= remaining; i2++) {
      const offsetProgress = progress(0, remaining, i2);
      offset2.push(mixNumber$1(min2, 1, offsetProgress));
    }
  }
  function defaultOffset(arr) {
    const offset2 = [0];
    fillOffset(offset2, arr.length - 1);
    return offset2;
  }
  function convertOffsetToTimes(offset2, duration) {
    return offset2.map((o2) => o2 * duration);
  }
  function defaultEasing(values, easing) {
    return values.map(() => easing || easeInOut).splice(0, values.length - 1);
  }
  function keyframes({ duration = 300, keyframes: keyframeValues, times, ease: ease2 = "easeInOut" }) {
    const easingFunctions = isEasingArray(ease2) ? ease2.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease2);
    const state = {
      done: false,
      value: keyframeValues[0]
    };
    const absoluteTimes = convertOffsetToTimes(

times && times.length === keyframeValues.length ? times : defaultOffset(keyframeValues),
      duration
    );
    const mapTimeToKeyframe = interpolate(absoluteTimes, keyframeValues, {
      ease: Array.isArray(easingFunctions) ? easingFunctions : defaultEasing(keyframeValues, easingFunctions)
    });
    return {
      calculatedDuration: duration,
      next: (t2) => {
        state.value = mapTimeToKeyframe(t2);
        state.done = t2 >= duration;
        return state;
      }
    };
  }
  const isNotNull$2 = (value) => value !== null;
  function getFinalKeyframe$1(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe, speed = 1) {
    const resolvedKeyframes = keyframes2.filter(isNotNull$2);
    const useFirstKeyframe = speed < 0 || repeat && repeatType !== "loop" && repeat % 2 === 1;
    const index2 = useFirstKeyframe ? 0 : resolvedKeyframes.length - 1;
    return !index2 || finalKeyframe === void 0 ? resolvedKeyframes[index2] : finalKeyframe;
  }
  const transitionTypeMap = {
    decay: inertia,
    inertia,
    tween: keyframes,
    keyframes,
    spring
  };
  function replaceTransitionType(transition) {
    if (typeof transition.type === "string") {
      transition.type = transitionTypeMap[transition.type];
    }
  }
  class WithPromise {
    constructor() {
      this.updateFinished();
    }
    get finished() {
      return this._finished;
    }
    updateFinished() {
      this._finished = new Promise((resolve) => {
        this.resolve = resolve;
      });
    }
    notifyFinished() {
      this.resolve();
    }
then(onResolve, onReject) {
      return this.finished.then(onResolve, onReject);
    }
  }
  const percentToProgress = (percent2) => percent2 / 100;
  class JSAnimation extends WithPromise {
    constructor(options) {
      super();
      this.state = "idle";
      this.startTime = null;
      this.isStopped = false;
      this.currentTime = 0;
      this.holdTime = null;
      this.playbackSpeed = 1;
      this.stop = () => {
        const { motionValue: motionValue2 } = this.options;
        if (motionValue2 && motionValue2.updatedAt !== time.now()) {
          this.tick(time.now());
        }
        this.isStopped = true;
        if (this.state === "idle")
          return;
        this.teardown();
        this.options.onStop?.();
      };
      this.options = options;
      this.initAnimation();
      this.play();
      if (options.autoplay === false)
        this.pause();
    }
    initAnimation() {
      const { options } = this;
      replaceTransitionType(options);
      const { type = keyframes, repeat = 0, repeatDelay = 0, repeatType, velocity = 0 } = options;
      let { keyframes: keyframes$1 } = options;
      const generatorFactory = type || keyframes;
      if (generatorFactory !== keyframes && typeof keyframes$1[0] !== "number") {
        this.mixKeyframes = pipe(percentToProgress, mix(keyframes$1[0], keyframes$1[1]));
        keyframes$1 = [0, 100];
      }
      const generator = generatorFactory({ ...options, keyframes: keyframes$1 });
      if (repeatType === "mirror") {
        this.mirroredGenerator = generatorFactory({
          ...options,
          keyframes: [...keyframes$1].reverse(),
          velocity: -velocity
        });
      }
      if (generator.calculatedDuration === null) {
        generator.calculatedDuration = calcGeneratorDuration(generator);
      }
      const { calculatedDuration } = generator;
      this.calculatedDuration = calculatedDuration;
      this.resolvedDuration = calculatedDuration + repeatDelay;
      this.totalDuration = this.resolvedDuration * (repeat + 1) - repeatDelay;
      this.generator = generator;
    }
    updateTime(timestamp) {
      const animationTime = Math.round(timestamp - this.startTime) * this.playbackSpeed;
      if (this.holdTime !== null) {
        this.currentTime = this.holdTime;
      } else {
        this.currentTime = animationTime;
      }
    }
    tick(timestamp, sample = false) {
      const { generator, totalDuration, mixKeyframes, mirroredGenerator, resolvedDuration, calculatedDuration } = this;
      if (this.startTime === null)
        return generator.next(0);
      const { delay: delay2 = 0, keyframes: keyframes2, repeat, repeatType, repeatDelay, type, onUpdate, finalKeyframe } = this.options;
      if (this.speed > 0) {
        this.startTime = Math.min(this.startTime, timestamp);
      } else if (this.speed < 0) {
        this.startTime = Math.min(timestamp - totalDuration / this.speed, this.startTime);
      }
      if (sample) {
        this.currentTime = timestamp;
      } else {
        this.updateTime(timestamp);
      }
      const timeWithoutDelay = this.currentTime - delay2 * (this.playbackSpeed >= 0 ? 1 : -1);
      const isInDelayPhase = this.playbackSpeed >= 0 ? timeWithoutDelay < 0 : timeWithoutDelay > totalDuration;
      this.currentTime = Math.max(timeWithoutDelay, 0);
      if (this.state === "finished" && this.holdTime === null) {
        this.currentTime = totalDuration;
      }
      let elapsed = this.currentTime;
      let frameGenerator = generator;
      if (repeat) {
        const progress2 = Math.min(this.currentTime, totalDuration) / resolvedDuration;
        let currentIteration = Math.floor(progress2);
        let iterationProgress = progress2 % 1;
        if (!iterationProgress && progress2 >= 1) {
          iterationProgress = 1;
        }
        iterationProgress === 1 && currentIteration--;
        currentIteration = Math.min(currentIteration, repeat + 1);
        const isOddIteration = Boolean(currentIteration % 2);
        if (isOddIteration) {
          if (repeatType === "reverse") {
            iterationProgress = 1 - iterationProgress;
            if (repeatDelay) {
              iterationProgress -= repeatDelay / resolvedDuration;
            }
          } else if (repeatType === "mirror") {
            frameGenerator = mirroredGenerator;
          }
        }
        elapsed = clamp$1(0, 1, iterationProgress) * resolvedDuration;
      }
      const state = isInDelayPhase ? { done: false, value: keyframes2[0] } : frameGenerator.next(elapsed);
      if (mixKeyframes) {
        state.value = mixKeyframes(state.value);
      }
      let { done } = state;
      if (!isInDelayPhase && calculatedDuration !== null) {
        done = this.playbackSpeed >= 0 ? this.currentTime >= totalDuration : this.currentTime <= 0;
      }
      const isAnimationFinished = this.holdTime === null && (this.state === "finished" || this.state === "running" && done);
      if (isAnimationFinished && type !== inertia) {
        state.value = getFinalKeyframe$1(keyframes2, this.options, finalKeyframe, this.speed);
      }
      if (onUpdate) {
        onUpdate(state.value);
      }
      if (isAnimationFinished) {
        this.finish();
      }
      return state;
    }
then(resolve, reject) {
      return this.finished.then(resolve, reject);
    }
    get duration() {
      return millisecondsToSeconds(this.calculatedDuration);
    }
    get iterationDuration() {
      const { delay: delay2 = 0 } = this.options || {};
      return this.duration + millisecondsToSeconds(delay2);
    }
    get time() {
      return millisecondsToSeconds(this.currentTime);
    }
    set time(newTime) {
      newTime = secondsToMilliseconds(newTime);
      this.currentTime = newTime;
      if (this.startTime === null || this.holdTime !== null || this.playbackSpeed === 0) {
        this.holdTime = newTime;
      } else if (this.driver) {
        this.startTime = this.driver.now() - newTime / this.playbackSpeed;
      }
      this.driver?.start(false);
    }
    get speed() {
      return this.playbackSpeed;
    }
    set speed(newSpeed) {
      this.updateTime(time.now());
      const hasChanged = this.playbackSpeed !== newSpeed;
      this.playbackSpeed = newSpeed;
      if (hasChanged) {
        this.time = millisecondsToSeconds(this.currentTime);
      }
    }
    play() {
      if (this.isStopped)
        return;
      const { driver = frameloopDriver, startTime } = this.options;
      if (!this.driver) {
        this.driver = driver((timestamp) => this.tick(timestamp));
      }
      this.options.onPlay?.();
      const now2 = this.driver.now();
      if (this.state === "finished") {
        this.updateFinished();
        this.startTime = now2;
      } else if (this.holdTime !== null) {
        this.startTime = now2 - this.holdTime;
      } else if (!this.startTime) {
        this.startTime = startTime ?? now2;
      }
      if (this.state === "finished" && this.speed < 0) {
        this.startTime += this.calculatedDuration;
      }
      this.holdTime = null;
      this.state = "running";
      this.driver.start();
    }
    pause() {
      this.state = "paused";
      this.updateTime(time.now());
      this.holdTime = this.currentTime;
    }
    complete() {
      if (this.state !== "running") {
        this.play();
      }
      this.state = "finished";
      this.holdTime = null;
    }
    finish() {
      this.notifyFinished();
      this.teardown();
      this.state = "finished";
      this.options.onComplete?.();
    }
    cancel() {
      this.holdTime = null;
      this.startTime = 0;
      this.tick(0);
      this.teardown();
      this.options.onCancel?.();
    }
    teardown() {
      this.state = "idle";
      this.stopDriver();
      this.startTime = this.holdTime = null;
    }
    stopDriver() {
      if (!this.driver)
        return;
      this.driver.stop();
      this.driver = void 0;
    }
    sample(sampleTime) {
      this.startTime = 0;
      return this.tick(sampleTime, true);
    }
    attachTimeline(timeline) {
      if (this.options.allowFlatten) {
        this.options.type = "keyframes";
        this.options.ease = "linear";
        this.initAnimation();
      }
      this.driver?.stop();
      return timeline.observe(this);
    }
  }
  function fillWildcards(keyframes2) {
    for (let i2 = 1; i2 < keyframes2.length; i2++) {
      keyframes2[i2] ?? (keyframes2[i2] = keyframes2[i2 - 1]);
    }
  }
  const radToDeg = (rad) => rad * 180 / Math.PI;
  const rotate = (v) => {
    const angle = radToDeg(Math.atan2(v[1], v[0]));
    return rebaseAngle(angle);
  };
  const matrix2dParsers = {
    x: 4,
    y: 5,
    translateX: 4,
    translateY: 5,
    scaleX: 0,
    scaleY: 3,
    scale: (v) => (Math.abs(v[0]) + Math.abs(v[3])) / 2,
    rotate,
    rotateZ: rotate,
    skewX: (v) => radToDeg(Math.atan(v[1])),
    skewY: (v) => radToDeg(Math.atan(v[2])),
    skew: (v) => (Math.abs(v[1]) + Math.abs(v[2])) / 2
  };
  const rebaseAngle = (angle) => {
    angle = angle % 360;
    if (angle < 0)
      angle += 360;
    return angle;
  };
  const rotateZ = rotate;
  const scaleX = (v) => Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  const scaleY = (v) => Math.sqrt(v[4] * v[4] + v[5] * v[5]);
  const matrix3dParsers = {
    x: 12,
    y: 13,
    z: 14,
    translateX: 12,
    translateY: 13,
    translateZ: 14,
    scaleX,
    scaleY,
    scale: (v) => (scaleX(v) + scaleY(v)) / 2,
    rotateX: (v) => rebaseAngle(radToDeg(Math.atan2(v[6], v[5]))),
    rotateY: (v) => rebaseAngle(radToDeg(Math.atan2(-v[2], v[0]))),
    rotateZ,
    rotate: rotateZ,
    skewX: (v) => radToDeg(Math.atan(v[4])),
    skewY: (v) => radToDeg(Math.atan(v[1])),
    skew: (v) => (Math.abs(v[1]) + Math.abs(v[4])) / 2
  };
  function defaultTransformValue(name) {
    return name.includes("scale") ? 1 : 0;
  }
  function parseValueFromTransform(transform, name) {
    if (!transform || transform === "none") {
      return defaultTransformValue(name);
    }
    const matrix3dMatch = transform.match(/^matrix3d\(([-\d.e\s,]+)\)$/u);
    let parsers;
    let match;
    if (matrix3dMatch) {
      parsers = matrix3dParsers;
      match = matrix3dMatch;
    } else {
      const matrix2dMatch = transform.match(/^matrix\(([-\d.e\s,]+)\)$/u);
      parsers = matrix2dParsers;
      match = matrix2dMatch;
    }
    if (!match) {
      return defaultTransformValue(name);
    }
    const valueParser = parsers[name];
    const values = match[1].split(",").map(convertTransformToNumber);
    return typeof valueParser === "function" ? valueParser(values) : values[valueParser];
  }
  const readTransformValue = (instance, name) => {
    const { transform = "none" } = getComputedStyle(instance);
    return parseValueFromTransform(transform, name);
  };
  function convertTransformToNumber(value) {
    return parseFloat(value.trim());
  }
  const transformPropOrder = [
    "transformPerspective",
    "x",
    "y",
    "z",
    "translateX",
    "translateY",
    "translateZ",
    "scale",
    "scaleX",
    "scaleY",
    "rotate",
    "rotateX",
    "rotateY",
    "rotateZ",
    "skew",
    "skewX",
    "skewY"
  ];
  const transformProps = (() => new Set(transformPropOrder))();
  const isNumOrPxType = (v) => v === number || v === px;
  const transformKeys = new Set(["x", "y", "z"]);
  const nonTranslationalTransformKeys = transformPropOrder.filter((key) => !transformKeys.has(key));
  function removeNonTranslationalTransform(visualElement) {
    const removedTransforms = [];
    nonTranslationalTransformKeys.forEach((key) => {
      const value = visualElement.getValue(key);
      if (value !== void 0) {
        removedTransforms.push([key, value.get()]);
        value.set(key.startsWith("scale") ? 1 : 0);
      }
    });
    return removedTransforms;
  }
  const positionalValues = {
width: ({ x: x2 }, { paddingLeft = "0", paddingRight = "0" }) => x2.max - x2.min - parseFloat(paddingLeft) - parseFloat(paddingRight),
    height: ({ y }, { paddingTop = "0", paddingBottom = "0" }) => y.max - y.min - parseFloat(paddingTop) - parseFloat(paddingBottom),
    top: (_bbox, { top }) => parseFloat(top),
    left: (_bbox, { left }) => parseFloat(left),
    bottom: ({ y }, { top }) => parseFloat(top) + (y.max - y.min),
    right: ({ x: x2 }, { left }) => parseFloat(left) + (x2.max - x2.min),
x: (_bbox, { transform }) => parseValueFromTransform(transform, "x"),
    y: (_bbox, { transform }) => parseValueFromTransform(transform, "y")
  };
  positionalValues.translateX = positionalValues.x;
  positionalValues.translateY = positionalValues.y;
  const toResolve = new Set();
  let isScheduled = false;
  let anyNeedsMeasurement = false;
  let isForced = false;
  function measureAllKeyframes() {
    if (anyNeedsMeasurement) {
      const resolversToMeasure = Array.from(toResolve).filter((resolver) => resolver.needsMeasurement);
      const elementsToMeasure = new Set(resolversToMeasure.map((resolver) => resolver.element));
      const transformsToRestore = new Map();
      elementsToMeasure.forEach((element) => {
        const removedTransforms = removeNonTranslationalTransform(element);
        if (!removedTransforms.length)
          return;
        transformsToRestore.set(element, removedTransforms);
        element.render();
      });
      resolversToMeasure.forEach((resolver) => resolver.measureInitialState());
      elementsToMeasure.forEach((element) => {
        element.render();
        const restore = transformsToRestore.get(element);
        if (restore) {
          restore.forEach(([key, value]) => {
            element.getValue(key)?.set(value);
          });
        }
      });
      resolversToMeasure.forEach((resolver) => resolver.measureEndState());
      resolversToMeasure.forEach((resolver) => {
        if (resolver.suspendedScrollY !== void 0) {
          window.scrollTo(0, resolver.suspendedScrollY);
        }
      });
    }
    anyNeedsMeasurement = false;
    isScheduled = false;
    toResolve.forEach((resolver) => resolver.complete(isForced));
    toResolve.clear();
  }
  function readAllKeyframes() {
    toResolve.forEach((resolver) => {
      resolver.readKeyframes();
      if (resolver.needsMeasurement) {
        anyNeedsMeasurement = true;
      }
    });
  }
  function flushKeyframeResolvers() {
    isForced = true;
    readAllKeyframes();
    measureAllKeyframes();
    isForced = false;
  }
  class KeyframeResolver {
    constructor(unresolvedKeyframes, onComplete, name, motionValue2, element, isAsync = false) {
      this.state = "pending";
      this.isAsync = false;
      this.needsMeasurement = false;
      this.unresolvedKeyframes = [...unresolvedKeyframes];
      this.onComplete = onComplete;
      this.name = name;
      this.motionValue = motionValue2;
      this.element = element;
      this.isAsync = isAsync;
    }
    scheduleResolve() {
      this.state = "scheduled";
      if (this.isAsync) {
        toResolve.add(this);
        if (!isScheduled) {
          isScheduled = true;
          frame.read(readAllKeyframes);
          frame.resolveKeyframes(measureAllKeyframes);
        }
      } else {
        this.readKeyframes();
        this.complete();
      }
    }
    readKeyframes() {
      const { unresolvedKeyframes, name, element, motionValue: motionValue2 } = this;
      if (unresolvedKeyframes[0] === null) {
        const currentValue = motionValue2?.get();
        const finalKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
        if (currentValue !== void 0) {
          unresolvedKeyframes[0] = currentValue;
        } else if (element && name) {
          const valueAsRead = element.readValue(name, finalKeyframe);
          if (valueAsRead !== void 0 && valueAsRead !== null) {
            unresolvedKeyframes[0] = valueAsRead;
          }
        }
        if (unresolvedKeyframes[0] === void 0) {
          unresolvedKeyframes[0] = finalKeyframe;
        }
        if (motionValue2 && currentValue === void 0) {
          motionValue2.set(unresolvedKeyframes[0]);
        }
      }
      fillWildcards(unresolvedKeyframes);
    }
    setFinalKeyframe() {
    }
    measureInitialState() {
    }
    renderEndStyles() {
    }
    measureEndState() {
    }
    complete(isForcedComplete = false) {
      this.state = "complete";
      this.onComplete(this.unresolvedKeyframes, this.finalKeyframe, isForcedComplete);
      toResolve.delete(this);
    }
    cancel() {
      if (this.state === "scheduled") {
        toResolve.delete(this);
        this.state = "pending";
      }
    }
    resume() {
      if (this.state === "pending")
        this.scheduleResolve();
    }
  }
  const isCSSVar = (name) => name.startsWith("--");
  function setStyle(element, name, value) {
    isCSSVar(name) ? element.style.setProperty(name, value) : element.style[name] = value;
  }
  const supportsScrollTimeline = memo(() => window.ScrollTimeline !== void 0);
  const supportsFlags = {};
  function memoSupports(callback, supportsFlag) {
    const memoized = memo(callback);
    return () => supportsFlags[supportsFlag] ?? memoized();
  }
  const supportsLinearEasing = memoSupports(() => {
    try {
      document.createElement("div").animate({ opacity: 0 }, { easing: "linear(0, 1)" });
    } catch (e) {
      return false;
    }
    return true;
  }, "linearEasing");
  const cubicBezierAsString = ([a2, b, c, d]) => `cubic-bezier(${a2}, ${b}, ${c}, ${d})`;
  const supportedWaapiEasing = {
    linear: "linear",
    ease: "ease",
    easeIn: "ease-in",
    easeOut: "ease-out",
    easeInOut: "ease-in-out",
    circIn: cubicBezierAsString([0, 0.65, 0.55, 1]),
    circOut: cubicBezierAsString([0.55, 0, 1, 0.45]),
    backIn: cubicBezierAsString([0.31, 0.01, 0.66, -0.59]),
    backOut: cubicBezierAsString([0.33, 1.53, 0.69, 0.99])
  };
  function mapEasingToNativeEasing(easing, duration) {
    if (!easing) {
      return void 0;
    } else if (typeof easing === "function") {
      return supportsLinearEasing() ? generateLinearEasing(easing, duration) : "ease-out";
    } else if (isBezierDefinition(easing)) {
      return cubicBezierAsString(easing);
    } else if (Array.isArray(easing)) {
      return easing.map((segmentEasing) => mapEasingToNativeEasing(segmentEasing, duration) || supportedWaapiEasing.easeOut);
    } else {
      return supportedWaapiEasing[easing];
    }
  }
  function startWaapiAnimation(element, valueName, keyframes2, { delay: delay2 = 0, duration = 300, repeat = 0, repeatType = "loop", ease: ease2 = "easeOut", times } = {}, pseudoElement = void 0) {
    const keyframeOptions = {
      [valueName]: keyframes2
    };
    if (times)
      keyframeOptions.offset = times;
    const easing = mapEasingToNativeEasing(ease2, duration);
    if (Array.isArray(easing))
      keyframeOptions.easing = easing;
    const options = {
      delay: delay2,
      duration,
      easing: !Array.isArray(easing) ? easing : "linear",
      fill: "both",
      iterations: repeat + 1,
      direction: repeatType === "reverse" ? "alternate" : "normal"
    };
    if (pseudoElement)
      options.pseudoElement = pseudoElement;
    const animation = element.animate(keyframeOptions, options);
    return animation;
  }
  function isGenerator(type) {
    return typeof type === "function" && "applyToOptions" in type;
  }
  function applyGeneratorOptions({ type, ...options }) {
    if (isGenerator(type) && supportsLinearEasing()) {
      return type.applyToOptions(options);
    } else {
      options.duration ?? (options.duration = 300);
      options.ease ?? (options.ease = "easeOut");
    }
    return options;
  }
  class NativeAnimation extends WithPromise {
    constructor(options) {
      super();
      this.finishedTime = null;
      this.isStopped = false;
      if (!options)
        return;
      const { element, name, keyframes: keyframes2, pseudoElement, allowFlatten = false, finalKeyframe, onComplete } = options;
      this.isPseudoElement = Boolean(pseudoElement);
      this.allowFlatten = allowFlatten;
      this.options = options;
      invariant(typeof options.type !== "string");
      const transition = applyGeneratorOptions(options);
      this.animation = startWaapiAnimation(element, name, keyframes2, transition, pseudoElement);
      if (transition.autoplay === false) {
        this.animation.pause();
      }
      this.animation.onfinish = () => {
        this.finishedTime = this.time;
        if (!pseudoElement) {
          const keyframe = getFinalKeyframe$1(keyframes2, this.options, finalKeyframe, this.speed);
          if (this.updateMotionValue) {
            this.updateMotionValue(keyframe);
          } else {
            setStyle(element, name, keyframe);
          }
          this.animation.cancel();
        }
        onComplete?.();
        this.notifyFinished();
      };
    }
    play() {
      if (this.isStopped)
        return;
      this.animation.play();
      if (this.state === "finished") {
        this.updateFinished();
      }
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.finish?.();
    }
    cancel() {
      try {
        this.animation.cancel();
      } catch (e) {
      }
    }
    stop() {
      if (this.isStopped)
        return;
      this.isStopped = true;
      const { state } = this;
      if (state === "idle" || state === "finished") {
        return;
      }
      if (this.updateMotionValue) {
        this.updateMotionValue();
      } else {
        this.commitStyles();
      }
      if (!this.isPseudoElement)
        this.cancel();
    }
commitStyles() {
      if (!this.isPseudoElement) {
        this.animation.commitStyles?.();
      }
    }
    get duration() {
      const duration = this.animation.effect?.getComputedTiming?.().duration || 0;
      return millisecondsToSeconds(Number(duration));
    }
    get iterationDuration() {
      const { delay: delay2 = 0 } = this.options || {};
      return this.duration + millisecondsToSeconds(delay2);
    }
    get time() {
      return millisecondsToSeconds(Number(this.animation.currentTime) || 0);
    }
    set time(newTime) {
      this.finishedTime = null;
      this.animation.currentTime = secondsToMilliseconds(newTime);
    }
get speed() {
      return this.animation.playbackRate;
    }
    set speed(newSpeed) {
      if (newSpeed < 0)
        this.finishedTime = null;
      this.animation.playbackRate = newSpeed;
    }
    get state() {
      return this.finishedTime !== null ? "finished" : this.animation.playState;
    }
    get startTime() {
      return Number(this.animation.startTime);
    }
    set startTime(newStartTime) {
      this.animation.startTime = newStartTime;
    }
attachTimeline({ timeline, observe }) {
      if (this.allowFlatten) {
        this.animation.effect?.updateTiming({ easing: "linear" });
      }
      this.animation.onfinish = null;
      if (timeline && supportsScrollTimeline()) {
        this.animation.timeline = timeline;
        return noop$1;
      } else {
        return observe(this);
      }
    }
  }
  const unsupportedEasingFunctions = {
    anticipate,
    backInOut,
    circInOut
  };
  function isUnsupportedEase(key) {
    return key in unsupportedEasingFunctions;
  }
  function replaceStringEasing(transition) {
    if (typeof transition.ease === "string" && isUnsupportedEase(transition.ease)) {
      transition.ease = unsupportedEasingFunctions[transition.ease];
    }
  }
  const sampleDelta = 10;
  class NativeAnimationExtended extends NativeAnimation {
    constructor(options) {
      replaceStringEasing(options);
      replaceTransitionType(options);
      super(options);
      if (options.startTime) {
        this.startTime = options.startTime;
      }
      this.options = options;
    }
updateMotionValue(value) {
      const { motionValue: motionValue2, onUpdate, onComplete, element, ...options } = this.options;
      if (!motionValue2)
        return;
      if (value !== void 0) {
        motionValue2.set(value);
        return;
      }
      const sampleAnimation = new JSAnimation({
        ...options,
        autoplay: false
      });
      const sampleTime = secondsToMilliseconds(this.finishedTime ?? this.time);
      motionValue2.setWithVelocity(sampleAnimation.sample(sampleTime - sampleDelta).value, sampleAnimation.sample(sampleTime).value, sampleDelta);
      sampleAnimation.stop();
    }
  }
  const isAnimatable = (value, name) => {
    if (name === "zIndex")
      return false;
    if (typeof value === "number" || Array.isArray(value))
      return true;
    if (typeof value === "string" &&
(complex.test(value) || value === "0") &&
!value.startsWith("url(")) {
      return true;
    }
    return false;
  };
  function hasKeyframesChanged(keyframes2) {
    const current = keyframes2[0];
    if (keyframes2.length === 1)
      return true;
    for (let i2 = 0; i2 < keyframes2.length; i2++) {
      if (keyframes2[i2] !== current)
        return true;
    }
  }
  function canAnimate(keyframes2, name, type, velocity) {
    const originKeyframe = keyframes2[0];
    if (originKeyframe === null)
      return false;
    if (name === "display" || name === "visibility")
      return true;
    const targetKeyframe = keyframes2[keyframes2.length - 1];
    const isOriginAnimatable = isAnimatable(originKeyframe, name);
    const isTargetAnimatable = isAnimatable(targetKeyframe, name);
    if (!isOriginAnimatable || !isTargetAnimatable) {
      return false;
    }
    return hasKeyframesChanged(keyframes2) || (type === "spring" || isGenerator(type)) && velocity;
  }
  function makeAnimationInstant(options) {
    options.duration = 0;
    options.type = "keyframes";
  }
  const acceleratedValues = new Set([
    "opacity",
    "clipPath",
    "filter",
    "transform"

]);
  const supportsWaapi = memo(() => Object.hasOwnProperty.call(Element.prototype, "animate"));
  function supportsBrowserAnimation(options) {
    const { motionValue: motionValue2, name, repeatDelay, repeatType, damping, type } = options;
    const subject = motionValue2?.owner?.current;
    if (!(subject instanceof HTMLElement)) {
      return false;
    }
    const { onUpdate, transformTemplate } = motionValue2.owner.getProps();
    return supportsWaapi() && name && acceleratedValues.has(name) && (name !== "transform" || !transformTemplate) &&
!onUpdate && !repeatDelay && repeatType !== "mirror" && damping !== 0 && type !== "inertia";
  }
  const MAX_RESOLVE_DELAY = 40;
  class AsyncMotionValueAnimation extends WithPromise {
    constructor({ autoplay = true, delay: delay2 = 0, type = "keyframes", repeat = 0, repeatDelay = 0, repeatType = "loop", keyframes: keyframes2, name, motionValue: motionValue2, element, ...options }) {
      super();
      this.stop = () => {
        if (this._animation) {
          this._animation.stop();
          this.stopTimeline?.();
        }
        this.keyframeResolver?.cancel();
      };
      this.createdAt = time.now();
      const optionsWithDefaults = {
        autoplay,
        delay: delay2,
        type,
        repeat,
        repeatDelay,
        repeatType,
        name,
        motionValue: motionValue2,
        element,
        ...options
      };
      const KeyframeResolver$1 = element?.KeyframeResolver || KeyframeResolver;
      this.keyframeResolver = new KeyframeResolver$1(keyframes2, (resolvedKeyframes, finalKeyframe, forced) => this.onKeyframesResolved(resolvedKeyframes, finalKeyframe, optionsWithDefaults, !forced), name, motionValue2, element);
      this.keyframeResolver?.scheduleResolve();
    }
    onKeyframesResolved(keyframes2, finalKeyframe, options, sync) {
      this.keyframeResolver = void 0;
      const { name, type, velocity, delay: delay2, isHandoff, onUpdate } = options;
      this.resolvedAt = time.now();
      if (!canAnimate(keyframes2, name, type, velocity)) {
        if (MotionGlobalConfig.instantAnimations || !delay2) {
          onUpdate?.(getFinalKeyframe$1(keyframes2, options, finalKeyframe));
        }
        keyframes2[0] = keyframes2[keyframes2.length - 1];
        makeAnimationInstant(options);
        options.repeat = 0;
      }
      const startTime = sync ? !this.resolvedAt ? this.createdAt : this.resolvedAt - this.createdAt > MAX_RESOLVE_DELAY ? this.resolvedAt : this.createdAt : void 0;
      const resolvedOptions = {
        startTime,
        finalKeyframe,
        ...options,
        keyframes: keyframes2
      };
      const animation = !isHandoff && supportsBrowserAnimation(resolvedOptions) ? new NativeAnimationExtended({
        ...resolvedOptions,
        element: resolvedOptions.motionValue.owner.current
      }) : new JSAnimation(resolvedOptions);
      animation.finished.then(() => this.notifyFinished()).catch(noop$1);
      if (this.pendingTimeline) {
        this.stopTimeline = animation.attachTimeline(this.pendingTimeline);
        this.pendingTimeline = void 0;
      }
      this._animation = animation;
    }
    get finished() {
      if (!this._animation) {
        return this._finished;
      } else {
        return this.animation.finished;
      }
    }
    then(onResolve, _onReject) {
      return this.finished.finally(onResolve).then(() => {
      });
    }
    get animation() {
      if (!this._animation) {
        this.keyframeResolver?.resume();
        flushKeyframeResolvers();
      }
      return this._animation;
    }
    get duration() {
      return this.animation.duration;
    }
    get iterationDuration() {
      return this.animation.iterationDuration;
    }
    get time() {
      return this.animation.time;
    }
    set time(newTime) {
      this.animation.time = newTime;
    }
    get speed() {
      return this.animation.speed;
    }
    get state() {
      return this.animation.state;
    }
    set speed(newSpeed) {
      this.animation.speed = newSpeed;
    }
    get startTime() {
      return this.animation.startTime;
    }
    attachTimeline(timeline) {
      if (this._animation) {
        this.stopTimeline = this.animation.attachTimeline(timeline);
      } else {
        this.pendingTimeline = timeline;
      }
      return () => this.stop();
    }
    play() {
      this.animation.play();
    }
    pause() {
      this.animation.pause();
    }
    complete() {
      this.animation.complete();
    }
    cancel() {
      if (this._animation) {
        this.animation.cancel();
      }
      this.keyframeResolver?.cancel();
    }
  }
  const splitCSSVariableRegex = (
/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u
  );
  function parseCSSVariable(current) {
    const match = splitCSSVariableRegex.exec(current);
    if (!match)
      return [,];
    const [, token1, token2, fallback] = match;
    return [`--${token1 ?? token2}`, fallback];
  }
  function getVariableValue(current, element, depth = 1) {
    const [token, fallback] = parseCSSVariable(current);
    if (!token)
      return;
    const resolved = window.getComputedStyle(element).getPropertyValue(token);
    if (resolved) {
      const trimmed = resolved.trim();
      return isNumericalString(trimmed) ? parseFloat(trimmed) : trimmed;
    }
    return isCSSVariableToken(fallback) ? getVariableValue(fallback, element, depth + 1) : fallback;
  }
  function getValueTransition(transition, key) {
    return transition?.[key] ?? transition?.["default"] ?? transition;
  }
  const positionalKeys = new Set([
    "width",
    "height",
    "top",
    "left",
    "right",
    "bottom",
    ...transformPropOrder
  ]);
  const auto = {
    test: (v) => v === "auto",
    parse: (v) => v
  };
  const testValueType = (v) => (type) => type.test(v);
  const dimensionValueTypes = [number, px, percent, degrees, vw, vh, auto];
  const findDimensionValueType = (v) => dimensionValueTypes.find(testValueType(v));
  function isNone(value) {
    if (typeof value === "number") {
      return value === 0;
    } else if (value !== null) {
      return value === "none" || value === "0" || isZeroValueString(value);
    } else {
      return true;
    }
  }
  const maxDefaults = new Set(["brightness", "contrast", "saturate", "opacity"]);
  function applyDefaultFilter(v) {
    const [name, value] = v.slice(0, -1).split("(");
    if (name === "drop-shadow")
      return v;
    const [number2] = value.match(floatRegex) || [];
    if (!number2)
      return v;
    const unit = value.replace(number2, "");
    let defaultValue = maxDefaults.has(name) ? 1 : 0;
    if (number2 !== value)
      defaultValue *= 100;
    return name + "(" + defaultValue + unit + ")";
  }
  const functionRegex = /\b([a-z-]*)\(.*?\)/gu;
  const filter = {
    ...complex,
    getAnimatableNone: (v) => {
      const functions = v.match(functionRegex);
      return functions ? functions.map(applyDefaultFilter).join(" ") : v;
    }
  };
  const int = {
    ...number,
    transform: Math.round
  };
  const transformValueTypes = {
    rotate: degrees,
    rotateX: degrees,
    rotateY: degrees,
    rotateZ: degrees,
    scale,
    scaleX: scale,
    scaleY: scale,
    scaleZ: scale,
    skew: degrees,
    skewX: degrees,
    skewY: degrees,
    distance: px,
    translateX: px,
    translateY: px,
    translateZ: px,
    x: px,
    y: px,
    z: px,
    perspective: px,
    transformPerspective: px,
    opacity: alpha,
    originX: progressPercentage,
    originY: progressPercentage,
    originZ: px
  };
  const numberValueTypes = {
borderWidth: px,
    borderTopWidth: px,
    borderRightWidth: px,
    borderBottomWidth: px,
    borderLeftWidth: px,
    borderRadius: px,
    radius: px,
    borderTopLeftRadius: px,
    borderTopRightRadius: px,
    borderBottomRightRadius: px,
    borderBottomLeftRadius: px,
width: px,
    maxWidth: px,
    height: px,
    maxHeight: px,
    top: px,
    right: px,
    bottom: px,
    left: px,
padding: px,
    paddingTop: px,
    paddingRight: px,
    paddingBottom: px,
    paddingLeft: px,
    margin: px,
    marginTop: px,
    marginRight: px,
    marginBottom: px,
    marginLeft: px,
backgroundPositionX: px,
    backgroundPositionY: px,
    ...transformValueTypes,
    zIndex: int,
fillOpacity: alpha,
    strokeOpacity: alpha,
    numOctaves: int
  };
  const defaultValueTypes = {
    ...numberValueTypes,
color,
    backgroundColor: color,
    outlineColor: color,
    fill: color,
    stroke: color,
borderColor: color,
    borderTopColor: color,
    borderRightColor: color,
    borderBottomColor: color,
    borderLeftColor: color,
    filter,
    WebkitFilter: filter
  };
  const getDefaultValueType = (key) => defaultValueTypes[key];
  function getAnimatableNone(key, value) {
    let defaultValueType = getDefaultValueType(key);
    if (defaultValueType !== filter)
      defaultValueType = complex;
    return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
  }
  const invalidTemplates = new Set(["auto", "none", "0"]);
  function makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name) {
    let i2 = 0;
    let animatableTemplate = void 0;
    while (i2 < unresolvedKeyframes.length && !animatableTemplate) {
      const keyframe = unresolvedKeyframes[i2];
      if (typeof keyframe === "string" && !invalidTemplates.has(keyframe) && analyseComplexValue(keyframe).values.length) {
        animatableTemplate = unresolvedKeyframes[i2];
      }
      i2++;
    }
    if (animatableTemplate && name) {
      for (const noneIndex of noneKeyframeIndexes) {
        unresolvedKeyframes[noneIndex] = getAnimatableNone(name, animatableTemplate);
      }
    }
  }
  class DOMKeyframesResolver extends KeyframeResolver {
    constructor(unresolvedKeyframes, onComplete, name, motionValue2, element) {
      super(unresolvedKeyframes, onComplete, name, motionValue2, element, true);
    }
    readKeyframes() {
      const { unresolvedKeyframes, element, name } = this;
      if (!element || !element.current)
        return;
      super.readKeyframes();
      for (let i2 = 0; i2 < unresolvedKeyframes.length; i2++) {
        let keyframe = unresolvedKeyframes[i2];
        if (typeof keyframe === "string") {
          keyframe = keyframe.trim();
          if (isCSSVariableToken(keyframe)) {
            const resolved = getVariableValue(keyframe, element.current);
            if (resolved !== void 0) {
              unresolvedKeyframes[i2] = resolved;
            }
            if (i2 === unresolvedKeyframes.length - 1) {
              this.finalKeyframe = keyframe;
            }
          }
        }
      }
      this.resolveNoneKeyframes();
      if (!positionalKeys.has(name) || unresolvedKeyframes.length !== 2) {
        return;
      }
      const [origin, target] = unresolvedKeyframes;
      const originType = findDimensionValueType(origin);
      const targetType = findDimensionValueType(target);
      if (originType === targetType)
        return;
      if (isNumOrPxType(originType) && isNumOrPxType(targetType)) {
        for (let i2 = 0; i2 < unresolvedKeyframes.length; i2++) {
          const value = unresolvedKeyframes[i2];
          if (typeof value === "string") {
            unresolvedKeyframes[i2] = parseFloat(value);
          }
        }
      } else if (positionalValues[name]) {
        this.needsMeasurement = true;
      }
    }
    resolveNoneKeyframes() {
      const { unresolvedKeyframes, name } = this;
      const noneKeyframeIndexes = [];
      for (let i2 = 0; i2 < unresolvedKeyframes.length; i2++) {
        if (unresolvedKeyframes[i2] === null || isNone(unresolvedKeyframes[i2])) {
          noneKeyframeIndexes.push(i2);
        }
      }
      if (noneKeyframeIndexes.length) {
        makeNoneKeyframesAnimatable(unresolvedKeyframes, noneKeyframeIndexes, name);
      }
    }
    measureInitialState() {
      const { element, unresolvedKeyframes, name } = this;
      if (!element || !element.current)
        return;
      if (name === "height") {
        this.suspendedScrollY = window.pageYOffset;
      }
      this.measuredOrigin = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
      unresolvedKeyframes[0] = this.measuredOrigin;
      const measureKeyframe = unresolvedKeyframes[unresolvedKeyframes.length - 1];
      if (measureKeyframe !== void 0) {
        element.getValue(name, measureKeyframe).jump(measureKeyframe, false);
      }
    }
    measureEndState() {
      const { element, name, unresolvedKeyframes } = this;
      if (!element || !element.current)
        return;
      const value = element.getValue(name);
      value && value.jump(this.measuredOrigin, false);
      const finalKeyframeIndex = unresolvedKeyframes.length - 1;
      const finalKeyframe = unresolvedKeyframes[finalKeyframeIndex];
      unresolvedKeyframes[finalKeyframeIndex] = positionalValues[name](element.measureViewportBox(), window.getComputedStyle(element.current));
      if (finalKeyframe !== null && this.finalKeyframe === void 0) {
        this.finalKeyframe = finalKeyframe;
      }
      if (this.removedTransforms?.length) {
        this.removedTransforms.forEach(([unsetTransformName, unsetTransformValue]) => {
          element.getValue(unsetTransformName).set(unsetTransformValue);
        });
      }
      this.resolveNoneKeyframes();
    }
  }
  function resolveElements(elementOrSelector, scope, selectorCache) {
    if (elementOrSelector instanceof EventTarget) {
      return [elementOrSelector];
    } else if (typeof elementOrSelector === "string") {
      let root = document;
      const elements = root.querySelectorAll(elementOrSelector);
      return elements ? Array.from(elements) : [];
    }
    return Array.from(elementOrSelector);
  }
  const getValueAsType = (value, type) => {
    return type && typeof value === "number" ? type.transform(value) : value;
  };
  function isHTMLElement$1(element) {
    return isObject$1(element) && "offsetHeight" in element;
  }
  const MAX_VELOCITY_DELTA = 30;
  const isFloat = (value) => {
    return !isNaN(parseFloat(value));
  };
  class MotionValue {
constructor(init, options = {}) {
      this.canTrackVelocity = null;
      this.events = {};
      this.updateAndNotify = (v) => {
        const currentTime = time.now();
        if (this.updatedAt !== currentTime) {
          this.setPrevFrameValue();
        }
        this.prev = this.current;
        this.setCurrent(v);
        if (this.current !== this.prev) {
          this.events.change?.notify(this.current);
          if (this.dependents) {
            for (const dependent of this.dependents) {
              dependent.dirty();
            }
          }
        }
      };
      this.hasAnimated = false;
      this.setCurrent(init);
      this.owner = options.owner;
    }
    setCurrent(current) {
      this.current = current;
      this.updatedAt = time.now();
      if (this.canTrackVelocity === null && current !== void 0) {
        this.canTrackVelocity = isFloat(this.current);
      }
    }
    setPrevFrameValue(prevFrameValue = this.current) {
      this.prevFrameValue = prevFrameValue;
      this.prevUpdatedAt = this.updatedAt;
    }
onChange(subscription) {
      return this.on("change", subscription);
    }
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = new SubscriptionManager();
      }
      const unsubscribe = this.events[eventName].add(callback);
      if (eventName === "change") {
        return () => {
          unsubscribe();
          frame.read(() => {
            if (!this.events.change.getSize()) {
              this.stop();
            }
          });
        };
      }
      return unsubscribe;
    }
    clearListeners() {
      for (const eventManagers in this.events) {
        this.events[eventManagers].clear();
      }
    }
attach(passiveEffect, stopPassiveEffect) {
      this.passiveEffect = passiveEffect;
      this.stopPassiveEffect = stopPassiveEffect;
    }
set(v) {
      if (!this.passiveEffect) {
        this.updateAndNotify(v);
      } else {
        this.passiveEffect(v, this.updateAndNotify);
      }
    }
    setWithVelocity(prev, current, delta) {
      this.set(current);
      this.prev = void 0;
      this.prevFrameValue = prev;
      this.prevUpdatedAt = this.updatedAt - delta;
    }
jump(v, endAnimation = true) {
      this.updateAndNotify(v);
      this.prev = v;
      this.prevUpdatedAt = this.prevFrameValue = void 0;
      endAnimation && this.stop();
      if (this.stopPassiveEffect)
        this.stopPassiveEffect();
    }
    dirty() {
      this.events.change?.notify(this.current);
    }
    addDependent(dependent) {
      if (!this.dependents) {
        this.dependents = new Set();
      }
      this.dependents.add(dependent);
    }
    removeDependent(dependent) {
      if (this.dependents) {
        this.dependents.delete(dependent);
      }
    }
get() {
      return this.current;
    }
getPrevious() {
      return this.prev;
    }
getVelocity() {
      const currentTime = time.now();
      if (!this.canTrackVelocity || this.prevFrameValue === void 0 || currentTime - this.updatedAt > MAX_VELOCITY_DELTA) {
        return 0;
      }
      const delta = Math.min(this.updatedAt - this.prevUpdatedAt, MAX_VELOCITY_DELTA);
      return velocityPerSecond(parseFloat(this.current) - parseFloat(this.prevFrameValue), delta);
    }
start(startAnimation) {
      this.stop();
      return new Promise((resolve) => {
        this.hasAnimated = true;
        this.animation = startAnimation(resolve);
        if (this.events.animationStart) {
          this.events.animationStart.notify();
        }
      }).then(() => {
        if (this.events.animationComplete) {
          this.events.animationComplete.notify();
        }
        this.clearAnimation();
      });
    }
stop() {
      if (this.animation) {
        this.animation.stop();
        if (this.events.animationCancel) {
          this.events.animationCancel.notify();
        }
      }
      this.clearAnimation();
    }
isAnimating() {
      return !!this.animation;
    }
    clearAnimation() {
      delete this.animation;
    }
destroy() {
      this.dependents?.clear();
      this.events.destroy?.notify();
      this.clearListeners();
      this.stop();
      if (this.stopPassiveEffect) {
        this.stopPassiveEffect();
      }
    }
  }
  function motionValue(init, options) {
    return new MotionValue(init, options);
  }
  const { schedule: microtask } = createRenderBatcher(queueMicrotask, false);
  const isDragging = {
    x: false,
    y: false
  };
  function isDragActive() {
    return isDragging.x || isDragging.y;
  }
  function setDragLock(axis) {
    if (axis === "x" || axis === "y") {
      if (isDragging[axis]) {
        return null;
      } else {
        isDragging[axis] = true;
        return () => {
          isDragging[axis] = false;
        };
      }
    } else {
      if (isDragging.x || isDragging.y) {
        return null;
      } else {
        isDragging.x = isDragging.y = true;
        return () => {
          isDragging.x = isDragging.y = false;
        };
      }
    }
  }
  function setupGesture(elementOrSelector, options) {
    const elements = resolveElements(elementOrSelector);
    const gestureAbortController = new AbortController();
    const eventOptions = {
      passive: true,
      ...options,
      signal: gestureAbortController.signal
    };
    const cancel = () => gestureAbortController.abort();
    return [elements, eventOptions, cancel];
  }
  function isValidHover(event) {
    return !(event.pointerType === "touch" || isDragActive());
  }
  function hover(elementOrSelector, onHoverStart, options = {}) {
    const [elements, eventOptions, cancel] = setupGesture(elementOrSelector, options);
    const onPointerEnter = (enterEvent) => {
      if (!isValidHover(enterEvent))
        return;
      const { target } = enterEvent;
      const onHoverEnd = onHoverStart(target, enterEvent);
      if (typeof onHoverEnd !== "function" || !target)
        return;
      const onPointerLeave = (leaveEvent) => {
        if (!isValidHover(leaveEvent))
          return;
        onHoverEnd(leaveEvent);
        target.removeEventListener("pointerleave", onPointerLeave);
      };
      target.addEventListener("pointerleave", onPointerLeave, eventOptions);
    };
    elements.forEach((element) => {
      element.addEventListener("pointerenter", onPointerEnter, eventOptions);
    });
    return cancel;
  }
  const isNodeOrChild = (parent, child) => {
    if (!child) {
      return false;
    } else if (parent === child) {
      return true;
    } else {
      return isNodeOrChild(parent, child.parentElement);
    }
  };
  const isPrimaryPointer = (event) => {
    if (event.pointerType === "mouse") {
      return typeof event.button !== "number" || event.button <= 0;
    } else {
      return event.isPrimary !== false;
    }
  };
  const focusableElements = new Set([
    "BUTTON",
    "INPUT",
    "SELECT",
    "TEXTAREA",
    "A"
  ]);
  function isElementKeyboardAccessible(element) {
    return focusableElements.has(element.tagName) || element.tabIndex !== -1;
  }
  const isPressing = new WeakSet();
  function filterEvents(callback) {
    return (event) => {
      if (event.key !== "Enter")
        return;
      callback(event);
    };
  }
  function firePointerEvent(target, type) {
    target.dispatchEvent(new PointerEvent("pointer" + type, { isPrimary: true, bubbles: true }));
  }
  const enableKeyboardPress = (focusEvent, eventOptions) => {
    const element = focusEvent.currentTarget;
    if (!element)
      return;
    const handleKeydown = filterEvents(() => {
      if (isPressing.has(element))
        return;
      firePointerEvent(element, "down");
      const handleKeyup = filterEvents(() => {
        firePointerEvent(element, "up");
      });
      const handleBlur = () => firePointerEvent(element, "cancel");
      element.addEventListener("keyup", handleKeyup, eventOptions);
      element.addEventListener("blur", handleBlur, eventOptions);
    });
    element.addEventListener("keydown", handleKeydown, eventOptions);
    element.addEventListener("blur", () => element.removeEventListener("keydown", handleKeydown), eventOptions);
  };
  function isValidPressEvent(event) {
    return isPrimaryPointer(event) && !isDragActive();
  }
  function press(targetOrSelector, onPressStart, options = {}) {
    const [targets, eventOptions, cancelEvents] = setupGesture(targetOrSelector, options);
    const startPress = (startEvent) => {
      const target = startEvent.currentTarget;
      if (!isValidPressEvent(startEvent))
        return;
      isPressing.add(target);
      const onPressEnd = onPressStart(target, startEvent);
      const onPointerEnd = (endEvent, success) => {
        window.removeEventListener("pointerup", onPointerUp);
        window.removeEventListener("pointercancel", onPointerCancel);
        if (isPressing.has(target)) {
          isPressing.delete(target);
        }
        if (!isValidPressEvent(endEvent)) {
          return;
        }
        if (typeof onPressEnd === "function") {
          onPressEnd(endEvent, { success });
        }
      };
      const onPointerUp = (upEvent) => {
        onPointerEnd(upEvent, target === window || target === document || options.useGlobalTarget || isNodeOrChild(target, upEvent.target));
      };
      const onPointerCancel = (cancelEvent) => {
        onPointerEnd(cancelEvent, false);
      };
      window.addEventListener("pointerup", onPointerUp, eventOptions);
      window.addEventListener("pointercancel", onPointerCancel, eventOptions);
    };
    targets.forEach((target) => {
      const pointerDownTarget = options.useGlobalTarget ? window : target;
      pointerDownTarget.addEventListener("pointerdown", startPress, eventOptions);
      if (isHTMLElement$1(target)) {
        target.addEventListener("focus", (event) => enableKeyboardPress(event, eventOptions));
        if (!isElementKeyboardAccessible(target) && !target.hasAttribute("tabindex")) {
          target.tabIndex = 0;
        }
      }
    });
    return cancelEvents;
  }
  function isSVGElement(element) {
    return isObject$1(element) && "ownerSVGElement" in element;
  }
  function isSVGSVGElement(element) {
    return isSVGElement(element) && element.tagName === "svg";
  }
  const isMotionValue = (value) => Boolean(value && value.getVelocity);
  const valueTypes = [...dimensionValueTypes, color, complex];
  const findValueType = (v) => valueTypes.find(testValueType(v));
  const MotionConfigContext = React.createContext({
    transformPagePoint: (p) => p,
    isStatic: false,
    reducedMotion: "never"
  });
  function setRef(ref, value) {
    if (typeof ref === "function") {
      return ref(value);
    } else if (ref !== null && ref !== void 0) {
      ref.current = value;
    }
  }
  function composeRefs(...refs) {
    return (node) => {
      let hasCleanup = false;
      const cleanups = refs.map((ref) => {
        const cleanup = setRef(ref, node);
        if (!hasCleanup && typeof cleanup === "function") {
          hasCleanup = true;
        }
        return cleanup;
      });
      if (hasCleanup) {
        return () => {
          for (let i2 = 0; i2 < cleanups.length; i2++) {
            const cleanup = cleanups[i2];
            if (typeof cleanup === "function") {
              cleanup();
            } else {
              setRef(refs[i2], null);
            }
          }
        };
      }
    };
  }
  function useComposedRefs(...refs) {
    return React__namespace.useCallback(composeRefs(...refs), refs);
  }
  class PopChildMeasure extends React__namespace.Component {
    getSnapshotBeforeUpdate(prevProps) {
      const element = this.props.childRef.current;
      if (element && prevProps.isPresent && !this.props.isPresent) {
        const parent = element.offsetParent;
        const parentWidth = isHTMLElement$1(parent) ? parent.offsetWidth || 0 : 0;
        const size2 = this.props.sizeRef.current;
        size2.height = element.offsetHeight || 0;
        size2.width = element.offsetWidth || 0;
        size2.top = element.offsetTop;
        size2.left = element.offsetLeft;
        size2.right = parentWidth - size2.width - size2.left;
      }
      return null;
    }
componentDidUpdate() {
    }
    render() {
      return this.props.children;
    }
  }
  function PopChild({ children, isPresent, anchorX, root }) {
    const id2 = React.useId();
    const ref = React.useRef(null);
    const size2 = React.useRef({
      width: 0,
      height: 0,
      top: 0,
      left: 0,
      right: 0
    });
    const { nonce } = React.useContext(MotionConfigContext);
    const composedRef = useComposedRefs(ref, children?.ref);
    React.useInsertionEffect(() => {
      const { width, height, top, left, right } = size2.current;
      if (isPresent || !ref.current || !width || !height)
        return;
      const x2 = anchorX === "left" ? `left: ${left}` : `right: ${right}`;
      ref.current.dataset.motionPopId = id2;
      const style2 = document.createElement("style");
      if (nonce)
        style2.nonce = nonce;
      const parent = root ?? document.head;
      parent.appendChild(style2);
      if (style2.sheet) {
        style2.sheet.insertRule(`
          [data-motion-pop-id="${id2}"] {
            position: absolute !important;
            width: ${width}px !important;
            height: ${height}px !important;
            ${x2}px !important;
            top: ${top}px !important;
          }
        `);
      }
      return () => {
        if (parent.contains(style2)) {
          parent.removeChild(style2);
        }
      };
    }, [isPresent]);
    return jsxRuntimeExports.jsx(PopChildMeasure, { isPresent, childRef: ref, sizeRef: size2, children: React__namespace.cloneElement(children, { ref: composedRef }) });
  }
  const PresenceChild = ({ children, initial, isPresent, onExitComplete, custom, presenceAffectsLayout, mode, anchorX, root }) => {
    const presenceChildren = useConstant(newChildrenMap);
    const id2 = React.useId();
    let isReusedContext = true;
    let context = React.useMemo(() => {
      isReusedContext = false;
      return {
        id: id2,
        initial,
        isPresent,
        custom,
        onExitComplete: (childId) => {
          presenceChildren.set(childId, true);
          for (const isComplete of presenceChildren.values()) {
            if (!isComplete)
              return;
          }
          onExitComplete && onExitComplete();
        },
        register: (childId) => {
          presenceChildren.set(childId, false);
          return () => presenceChildren.delete(childId);
        }
      };
    }, [isPresent, presenceChildren, onExitComplete]);
    if (presenceAffectsLayout && isReusedContext) {
      context = { ...context };
    }
    React.useMemo(() => {
      presenceChildren.forEach((_, key) => presenceChildren.set(key, false));
    }, [isPresent]);
    React__namespace.useEffect(() => {
      !isPresent && !presenceChildren.size && onExitComplete && onExitComplete();
    }, [isPresent]);
    if (mode === "popLayout") {
      children = jsxRuntimeExports.jsx(PopChild, { isPresent, anchorX, root, children });
    }
    return jsxRuntimeExports.jsx(PresenceContext.Provider, { value: context, children });
  };
  function newChildrenMap() {
    return new Map();
  }
  function usePresence(subscribe = true) {
    const context = React.useContext(PresenceContext);
    if (context === null)
      return [true, null];
    const { isPresent, onExitComplete, register } = context;
    const id2 = React.useId();
    React.useEffect(() => {
      if (subscribe) {
        return register(id2);
      }
    }, [subscribe]);
    const safeToRemove = React.useCallback(() => subscribe && onExitComplete && onExitComplete(id2), [id2, onExitComplete, subscribe]);
    return !isPresent && onExitComplete ? [false, safeToRemove] : [true];
  }
  const getChildKey = (child) => child.key || "";
  function onlyElements(children) {
    const filtered = [];
    React.Children.forEach(children, (child) => {
      if (React.isValidElement(child))
        filtered.push(child);
    });
    return filtered;
  }
  const AnimatePresence = ({ children, custom, initial = true, onExitComplete, presenceAffectsLayout = true, mode = "sync", propagate = false, anchorX = "left", root }) => {
    const [isParentPresent, safeToRemove] = usePresence(propagate);
    const presentChildren = React.useMemo(() => onlyElements(children), [children]);
    const presentKeys = propagate && !isParentPresent ? [] : presentChildren.map(getChildKey);
    const isInitialRender = React.useRef(true);
    const pendingPresentChildren = React.useRef(presentChildren);
    const exitComplete = useConstant(() => new Map());
    const [diffedChildren, setDiffedChildren] = React.useState(presentChildren);
    const [renderedChildren, setRenderedChildren] = React.useState(presentChildren);
    useIsomorphicLayoutEffect$1(() => {
      isInitialRender.current = false;
      pendingPresentChildren.current = presentChildren;
      for (let i2 = 0; i2 < renderedChildren.length; i2++) {
        const key = getChildKey(renderedChildren[i2]);
        if (!presentKeys.includes(key)) {
          if (exitComplete.get(key) !== true) {
            exitComplete.set(key, false);
          }
        } else {
          exitComplete.delete(key);
        }
      }
    }, [renderedChildren, presentKeys.length, presentKeys.join("-")]);
    const exitingChildren = [];
    if (presentChildren !== diffedChildren) {
      let nextChildren = [...presentChildren];
      for (let i2 = 0; i2 < renderedChildren.length; i2++) {
        const child = renderedChildren[i2];
        const key = getChildKey(child);
        if (!presentKeys.includes(key)) {
          nextChildren.splice(i2, 0, child);
          exitingChildren.push(child);
        }
      }
      if (mode === "wait" && exitingChildren.length) {
        nextChildren = exitingChildren;
      }
      setRenderedChildren(onlyElements(nextChildren));
      setDiffedChildren(presentChildren);
      return null;
    }
    const { forceRender } = React.useContext(LayoutGroupContext);
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: renderedChildren.map((child) => {
      const key = getChildKey(child);
      const isPresent = propagate && !isParentPresent ? false : presentChildren === renderedChildren || presentKeys.includes(key);
      const onExit = () => {
        if (exitComplete.has(key)) {
          exitComplete.set(key, true);
        } else {
          return;
        }
        let isEveryExitComplete = true;
        exitComplete.forEach((isExitComplete) => {
          if (!isExitComplete)
            isEveryExitComplete = false;
        });
        if (isEveryExitComplete) {
          forceRender?.();
          setRenderedChildren(pendingPresentChildren.current);
          propagate && safeToRemove?.();
          onExitComplete && onExitComplete();
        }
      };
      return jsxRuntimeExports.jsx(PresenceChild, { isPresent, initial: !isInitialRender.current || initial ? void 0 : false, custom, presenceAffectsLayout, mode, root, onExitComplete: isPresent ? void 0 : onExit, anchorX, children: child }, key);
    }) });
  };
  const LazyContext = React.createContext({ strict: false });
  const featureProps = {
    animation: [
      "animate",
      "variants",
      "whileHover",
      "whileTap",
      "exit",
      "whileInView",
      "whileFocus",
      "whileDrag"
    ],
    exit: ["exit"],
    drag: ["drag", "dragControls"],
    focus: ["whileFocus"],
    hover: ["whileHover", "onHoverStart", "onHoverEnd"],
    tap: ["whileTap", "onTap", "onTapStart", "onTapCancel"],
    pan: ["onPan", "onPanStart", "onPanSessionStart", "onPanEnd"],
    inView: ["whileInView", "onViewportEnter", "onViewportLeave"],
    layout: ["layout", "layoutId"]
  };
  const featureDefinitions = {};
  for (const key in featureProps) {
    featureDefinitions[key] = {
      isEnabled: (props) => featureProps[key].some((name) => !!props[name])
    };
  }
  function loadFeatures(features) {
    for (const key in features) {
      featureDefinitions[key] = {
        ...featureDefinitions[key],
        ...features[key]
      };
    }
  }
  const validMotionProps = new Set([
    "animate",
    "exit",
    "variants",
    "initial",
    "style",
    "values",
    "variants",
    "transition",
    "transformTemplate",
    "custom",
    "inherit",
    "onBeforeLayoutMeasure",
    "onAnimationStart",
    "onAnimationComplete",
    "onUpdate",
    "onDragStart",
    "onDrag",
    "onDragEnd",
    "onMeasureDragConstraints",
    "onDirectionLock",
    "onDragTransitionEnd",
    "_dragX",
    "_dragY",
    "onHoverStart",
    "onHoverEnd",
    "onViewportEnter",
    "onViewportLeave",
    "globalTapTarget",
    "ignoreStrict",
    "viewport"
  ]);
  function isValidMotionProp(key) {
    return key.startsWith("while") || key.startsWith("drag") && key !== "draggable" || key.startsWith("layout") || key.startsWith("onTap") || key.startsWith("onPan") || key.startsWith("onLayout") || validMotionProps.has(key);
  }
  let shouldForward = (key) => !isValidMotionProp(key);
  function loadExternalIsValidProp(isValidProp) {
    if (typeof isValidProp !== "function")
      return;
    shouldForward = (key) => key.startsWith("on") ? !isValidMotionProp(key) : isValidProp(key);
  }
  try {
    loadExternalIsValidProp(require("@emotion/is-prop-valid").default);
  } catch {
  }
  function filterProps(props, isDom, forwardMotionProps) {
    const filteredProps = {};
    for (const key in props) {
      if (key === "values" && typeof props.values === "object")
        continue;
      if (shouldForward(key) || forwardMotionProps === true && isValidMotionProp(key) || !isDom && !isValidMotionProp(key) ||
props["draggable"] && key.startsWith("onDrag")) {
        filteredProps[key] = props[key];
      }
    }
    return filteredProps;
  }
  const MotionContext = React.createContext({});
  function isAnimationControls(v) {
    return v !== null && typeof v === "object" && typeof v.start === "function";
  }
  function isVariantLabel(v) {
    return typeof v === "string" || Array.isArray(v);
  }
  const variantPriorityOrder = [
    "animate",
    "whileInView",
    "whileFocus",
    "whileHover",
    "whileTap",
    "whileDrag",
    "exit"
  ];
  const variantProps = ["initial", ...variantPriorityOrder];
  function isControllingVariants(props) {
    return isAnimationControls(props.animate) || variantProps.some((name) => isVariantLabel(props[name]));
  }
  function isVariantNode(props) {
    return Boolean(isControllingVariants(props) || props.variants);
  }
  function getCurrentTreeVariants(props, context) {
    if (isControllingVariants(props)) {
      const { initial, animate } = props;
      return {
        initial: initial === false || isVariantLabel(initial) ? initial : void 0,
        animate: isVariantLabel(animate) ? animate : void 0
      };
    }
    return props.inherit !== false ? context : {};
  }
  function useCreateMotionContext(props) {
    const { initial, animate } = getCurrentTreeVariants(props, React.useContext(MotionContext));
    return React.useMemo(() => ({ initial, animate }), [variantLabelsAsDependency(initial), variantLabelsAsDependency(animate)]);
  }
  function variantLabelsAsDependency(prop) {
    return Array.isArray(prop) ? prop.join(" ") : prop;
  }
  const scaleCorrectors = {};
  function addScaleCorrector(correctors) {
    for (const key in correctors) {
      scaleCorrectors[key] = correctors[key];
      if (isCSSVariableName(key)) {
        scaleCorrectors[key].isCSSVariable = true;
      }
    }
  }
  function isForcedMotionValue(key, { layout: layout2, layoutId }) {
    return transformProps.has(key) || key.startsWith("origin") || (layout2 || layoutId !== void 0) && (!!scaleCorrectors[key] || key === "opacity");
  }
  const translateAlias = {
    x: "translateX",
    y: "translateY",
    z: "translateZ",
    transformPerspective: "perspective"
  };
  const numTransforms = transformPropOrder.length;
  function buildTransform(latestValues, transform, transformTemplate) {
    let transformString = "";
    let transformIsDefault = true;
    for (let i2 = 0; i2 < numTransforms; i2++) {
      const key = transformPropOrder[i2];
      const value = latestValues[key];
      if (value === void 0)
        continue;
      let valueIsDefault = true;
      if (typeof value === "number") {
        valueIsDefault = value === (key.startsWith("scale") ? 1 : 0);
      } else {
        valueIsDefault = parseFloat(value) === 0;
      }
      if (!valueIsDefault || transformTemplate) {
        const valueAsType = getValueAsType(value, numberValueTypes[key]);
        if (!valueIsDefault) {
          transformIsDefault = false;
          const transformName = translateAlias[key] || key;
          transformString += `${transformName}(${valueAsType}) `;
        }
        if (transformTemplate) {
          transform[key] = valueAsType;
        }
      }
    }
    transformString = transformString.trim();
    if (transformTemplate) {
      transformString = transformTemplate(transform, transformIsDefault ? "" : transformString);
    } else if (transformIsDefault) {
      transformString = "none";
    }
    return transformString;
  }
  function buildHTMLStyles(state, latestValues, transformTemplate) {
    const { style: style2, vars, transformOrigin: transformOrigin2 } = state;
    let hasTransform2 = false;
    let hasTransformOrigin = false;
    for (const key in latestValues) {
      const value = latestValues[key];
      if (transformProps.has(key)) {
        hasTransform2 = true;
        continue;
      } else if (isCSSVariableName(key)) {
        vars[key] = value;
        continue;
      } else {
        const valueAsType = getValueAsType(value, numberValueTypes[key]);
        if (key.startsWith("origin")) {
          hasTransformOrigin = true;
          transformOrigin2[key] = valueAsType;
        } else {
          style2[key] = valueAsType;
        }
      }
    }
    if (!latestValues.transform) {
      if (hasTransform2 || transformTemplate) {
        style2.transform = buildTransform(latestValues, state.transform, transformTemplate);
      } else if (style2.transform) {
        style2.transform = "none";
      }
    }
    if (hasTransformOrigin) {
      const { originX = "50%", originY = "50%", originZ = 0 } = transformOrigin2;
      style2.transformOrigin = `${originX} ${originY} ${originZ}`;
    }
  }
  const createHtmlRenderState = () => ({
    style: {},
    transform: {},
    transformOrigin: {},
    vars: {}
  });
  function copyRawValuesOnly(target, source, props) {
    for (const key in source) {
      if (!isMotionValue(source[key]) && !isForcedMotionValue(key, props)) {
        target[key] = source[key];
      }
    }
  }
  function useInitialMotionValues({ transformTemplate }, visualState) {
    return React.useMemo(() => {
      const state = createHtmlRenderState();
      buildHTMLStyles(state, visualState, transformTemplate);
      return Object.assign({}, state.vars, state.style);
    }, [visualState]);
  }
  function useStyle(props, visualState) {
    const styleProp = props.style || {};
    const style2 = {};
    copyRawValuesOnly(style2, styleProp, props);
    Object.assign(style2, useInitialMotionValues(props, visualState));
    return style2;
  }
  function useHTMLProps(props, visualState) {
    const htmlProps = {};
    const style2 = useStyle(props, visualState);
    if (props.drag && props.dragListener !== false) {
      htmlProps.draggable = false;
      style2.userSelect = style2.WebkitUserSelect = style2.WebkitTouchCallout = "none";
      style2.touchAction = props.drag === true ? "none" : `pan-${props.drag === "x" ? "y" : "x"}`;
    }
    if (props.tabIndex === void 0 && (props.onTap || props.onTapStart || props.whileTap)) {
      htmlProps.tabIndex = 0;
    }
    htmlProps.style = style2;
    return htmlProps;
  }
  const dashKeys = {
    offset: "stroke-dashoffset",
    array: "stroke-dasharray"
  };
  const camelKeys = {
    offset: "strokeDashoffset",
    array: "strokeDasharray"
  };
  function buildSVGPath(attrs, length, spacing = 1, offset2 = 0, useDashCase = true) {
    attrs.pathLength = 1;
    const keys = useDashCase ? dashKeys : camelKeys;
    attrs[keys.offset] = px.transform(-offset2);
    const pathLength = px.transform(length);
    const pathSpacing = px.transform(spacing);
    attrs[keys.array] = `${pathLength} ${pathSpacing}`;
  }
  function buildSVGAttrs(state, {
    attrX,
    attrY,
    attrScale,
    pathLength,
    pathSpacing = 1,
    pathOffset = 0,
...latest
  }, isSVGTag2, transformTemplate, styleProp) {
    buildHTMLStyles(state, latest, transformTemplate);
    if (isSVGTag2) {
      if (state.style.viewBox) {
        state.attrs.viewBox = state.style.viewBox;
      }
      return;
    }
    state.attrs = state.style;
    state.style = {};
    const { attrs, style: style2 } = state;
    if (attrs.transform) {
      style2.transform = attrs.transform;
      delete attrs.transform;
    }
    if (style2.transform || attrs.transformOrigin) {
      style2.transformOrigin = attrs.transformOrigin ?? "50% 50%";
      delete attrs.transformOrigin;
    }
    if (style2.transform) {
      style2.transformBox = styleProp?.transformBox ?? "fill-box";
      delete attrs.transformBox;
    }
    if (attrX !== void 0)
      attrs.x = attrX;
    if (attrY !== void 0)
      attrs.y = attrY;
    if (attrScale !== void 0)
      attrs.scale = attrScale;
    if (pathLength !== void 0) {
      buildSVGPath(attrs, pathLength, pathSpacing, pathOffset, false);
    }
  }
  const createSvgRenderState = () => ({
    ...createHtmlRenderState(),
    attrs: {}
  });
  const isSVGTag = (tag) => typeof tag === "string" && tag.toLowerCase() === "svg";
  function useSVGProps(props, visualState, _isStatic, Component2) {
    const visualProps = React.useMemo(() => {
      const state = createSvgRenderState();
      buildSVGAttrs(state, visualState, isSVGTag(Component2), props.transformTemplate, props.style);
      return {
        ...state.attrs,
        style: { ...state.style }
      };
    }, [visualState]);
    if (props.style) {
      const rawStyles = {};
      copyRawValuesOnly(rawStyles, props.style, props);
      visualProps.style = { ...rawStyles, ...visualProps.style };
    }
    return visualProps;
  }
  const lowercaseSVGElements = [
    "animate",
    "circle",
    "defs",
    "desc",
    "ellipse",
    "g",
    "image",
    "line",
    "filter",
    "marker",
    "mask",
    "metadata",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "rect",
    "stop",
    "switch",
    "symbol",
    "svg",
    "text",
    "tspan",
    "use",
    "view"
  ];
  function isSVGComponent(Component2) {
    if (
typeof Component2 !== "string" ||
Component2.includes("-")
    ) {
      return false;
    } else if (
lowercaseSVGElements.indexOf(Component2) > -1 ||
/[A-Z]/u.test(Component2)
    ) {
      return true;
    }
    return false;
  }
  function useRender(Component2, props, ref, { latestValues }, isStatic, forwardMotionProps = false) {
    const useVisualProps = isSVGComponent(Component2) ? useSVGProps : useHTMLProps;
    const visualProps = useVisualProps(props, latestValues, isStatic, Component2);
    const filteredProps = filterProps(props, typeof Component2 === "string", forwardMotionProps);
    const elementProps = Component2 !== React.Fragment ? { ...filteredProps, ...visualProps, ref } : {};
    const { children } = props;
    const renderedChildren = React.useMemo(() => isMotionValue(children) ? children.get() : children, [children]);
    return React.createElement(Component2, {
      ...elementProps,
      children: renderedChildren
    });
  }
  function getValueState(visualElement) {
    const state = [{}, {}];
    visualElement?.values.forEach((value, key) => {
      state[0][key] = value.get();
      state[1][key] = value.getVelocity();
    });
    return state;
  }
  function resolveVariantFromProps(props, definition, custom, visualElement) {
    if (typeof definition === "function") {
      const [current, velocity] = getValueState(visualElement);
      definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
    }
    if (typeof definition === "string") {
      definition = props.variants && props.variants[definition];
    }
    if (typeof definition === "function") {
      const [current, velocity] = getValueState(visualElement);
      definition = definition(custom !== void 0 ? custom : props.custom, current, velocity);
    }
    return definition;
  }
  function resolveMotionValue(value) {
    return isMotionValue(value) ? value.get() : value;
  }
  function makeState({ scrapeMotionValuesFromProps: scrapeMotionValuesFromProps2, createRenderState }, props, context, presenceContext) {
    const state = {
      latestValues: makeLatestValues(props, context, presenceContext, scrapeMotionValuesFromProps2),
      renderState: createRenderState()
    };
    return state;
  }
  function makeLatestValues(props, context, presenceContext, scrapeMotionValues) {
    const values = {};
    const motionValues = scrapeMotionValues(props, {});
    for (const key in motionValues) {
      values[key] = resolveMotionValue(motionValues[key]);
    }
    let { initial, animate } = props;
    const isControllingVariants$1 = isControllingVariants(props);
    const isVariantNode$1 = isVariantNode(props);
    if (context && isVariantNode$1 && !isControllingVariants$1 && props.inherit !== false) {
      if (initial === void 0)
        initial = context.initial;
      if (animate === void 0)
        animate = context.animate;
    }
    let isInitialAnimationBlocked = presenceContext ? presenceContext.initial === false : false;
    isInitialAnimationBlocked = isInitialAnimationBlocked || initial === false;
    const variantToSet = isInitialAnimationBlocked ? animate : initial;
    if (variantToSet && typeof variantToSet !== "boolean" && !isAnimationControls(variantToSet)) {
      const list = Array.isArray(variantToSet) ? variantToSet : [variantToSet];
      for (let i2 = 0; i2 < list.length; i2++) {
        const resolved = resolveVariantFromProps(props, list[i2]);
        if (resolved) {
          const { transitionEnd, transition, ...target } = resolved;
          for (const key in target) {
            let valueTarget = target[key];
            if (Array.isArray(valueTarget)) {
              const index2 = isInitialAnimationBlocked ? valueTarget.length - 1 : 0;
              valueTarget = valueTarget[index2];
            }
            if (valueTarget !== null) {
              values[key] = valueTarget;
            }
          }
          for (const key in transitionEnd) {
            values[key] = transitionEnd[key];
          }
        }
      }
    }
    return values;
  }
  const makeUseVisualState = (config2) => (props, isStatic) => {
    const context = React.useContext(MotionContext);
    const presenceContext = React.useContext(PresenceContext);
    const make = () => makeState(config2, props, context, presenceContext);
    return isStatic ? make() : useConstant(make);
  };
  function scrapeMotionValuesFromProps$1(props, prevProps, visualElement) {
    const { style: style2 } = props;
    const newValues = {};
    for (const key in style2) {
      if (isMotionValue(style2[key]) || prevProps.style && isMotionValue(prevProps.style[key]) || isForcedMotionValue(key, props) || visualElement?.getValue(key)?.liveStyle !== void 0) {
        newValues[key] = style2[key];
      }
    }
    return newValues;
  }
  const useHTMLVisualState = makeUseVisualState({
    scrapeMotionValuesFromProps: scrapeMotionValuesFromProps$1,
    createRenderState: createHtmlRenderState
  });
  function scrapeMotionValuesFromProps(props, prevProps, visualElement) {
    const newValues = scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
    for (const key in props) {
      if (isMotionValue(props[key]) || isMotionValue(prevProps[key])) {
        const targetKey = transformPropOrder.indexOf(key) !== -1 ? "attr" + key.charAt(0).toUpperCase() + key.substring(1) : key;
        newValues[targetKey] = props[key];
      }
    }
    return newValues;
  }
  const useSVGVisualState = makeUseVisualState({
    scrapeMotionValuesFromProps,
    createRenderState: createSvgRenderState
  });
  const motionComponentSymbol = Symbol.for("motionComponentSymbol");
  function isRefObject(ref) {
    return ref && typeof ref === "object" && Object.prototype.hasOwnProperty.call(ref, "current");
  }
  function useMotionRef(visualState, visualElement, externalRef) {
    return React.useCallback(
      (instance) => {
        if (instance) {
          visualState.onMount && visualState.onMount(instance);
        }
        if (visualElement) {
          if (instance) {
            visualElement.mount(instance);
          } else {
            visualElement.unmount();
          }
        }
        if (externalRef) {
          if (typeof externalRef === "function") {
            externalRef(instance);
          } else if (isRefObject(externalRef)) {
            externalRef.current = instance;
          }
        }
      },
[visualElement]
    );
  }
  const camelToDash = (str) => str.replace(/([a-z])([A-Z])/gu, "$1-$2").toLowerCase();
  const optimizedAppearDataId = "framerAppearId";
  const optimizedAppearDataAttribute = "data-" + camelToDash(optimizedAppearDataId);
  const SwitchLayoutGroupContext = React.createContext({});
  function useVisualElement(Component2, visualState, props, createVisualElement, ProjectionNodeConstructor) {
    const { visualElement: parent } = React.useContext(MotionContext);
    const lazyContext = React.useContext(LazyContext);
    const presenceContext = React.useContext(PresenceContext);
    const reducedMotionConfig = React.useContext(MotionConfigContext).reducedMotion;
    const visualElementRef = React.useRef(null);
    createVisualElement = createVisualElement || lazyContext.renderer;
    if (!visualElementRef.current && createVisualElement) {
      visualElementRef.current = createVisualElement(Component2, {
        visualState,
        parent,
        props,
        presenceContext,
        blockInitialAnimation: presenceContext ? presenceContext.initial === false : false,
        reducedMotionConfig
      });
    }
    const visualElement = visualElementRef.current;
    const initialLayoutGroupConfig = React.useContext(SwitchLayoutGroupContext);
    if (visualElement && !visualElement.projection && ProjectionNodeConstructor && (visualElement.type === "html" || visualElement.type === "svg")) {
      createProjectionNode$1(visualElementRef.current, props, ProjectionNodeConstructor, initialLayoutGroupConfig);
    }
    const isMounted = React.useRef(false);
    React.useInsertionEffect(() => {
      if (visualElement && isMounted.current) {
        visualElement.update(props, presenceContext);
      }
    });
    const optimisedAppearId = props[optimizedAppearDataAttribute];
    const wantsHandoff = React.useRef(Boolean(optimisedAppearId) && !window.MotionHandoffIsComplete?.(optimisedAppearId) && window.MotionHasOptimisedAnimation?.(optimisedAppearId));
    useIsomorphicLayoutEffect$1(() => {
      if (!visualElement)
        return;
      isMounted.current = true;
      window.MotionIsMounted = true;
      visualElement.updateFeatures();
      visualElement.scheduleRenderMicrotask();
      if (wantsHandoff.current && visualElement.animationState) {
        visualElement.animationState.animateChanges();
      }
    });
    React.useEffect(() => {
      if (!visualElement)
        return;
      if (!wantsHandoff.current && visualElement.animationState) {
        visualElement.animationState.animateChanges();
      }
      if (wantsHandoff.current) {
        queueMicrotask(() => {
          window.MotionHandoffMarkAsComplete?.(optimisedAppearId);
        });
        wantsHandoff.current = false;
      }
      visualElement.enteringChildren = void 0;
    });
    return visualElement;
  }
  function createProjectionNode$1(visualElement, props, ProjectionNodeConstructor, initialPromotionConfig) {
    const { layoutId, layout: layout2, drag: drag2, dragConstraints, layoutScroll, layoutRoot, layoutCrossfade } = props;
    visualElement.projection = new ProjectionNodeConstructor(visualElement.latestValues, props["data-framer-portal-id"] ? void 0 : getClosestProjectingNode(visualElement.parent));
    visualElement.projection.setOptions({
      layoutId,
      layout: layout2,
      alwaysMeasureLayout: Boolean(drag2) || dragConstraints && isRefObject(dragConstraints),
      visualElement,
animationType: typeof layout2 === "string" ? layout2 : "both",
      initialPromotionConfig,
      crossfade: layoutCrossfade,
      layoutScroll,
      layoutRoot
    });
  }
  function getClosestProjectingNode(visualElement) {
    if (!visualElement)
      return void 0;
    return visualElement.options.allowProjection !== false ? visualElement.projection : getClosestProjectingNode(visualElement.parent);
  }
  function createMotionComponent(Component2, { forwardMotionProps = false } = {}, preloadedFeatures, createVisualElement) {
    preloadedFeatures && loadFeatures(preloadedFeatures);
    const useVisualState = isSVGComponent(Component2) ? useSVGVisualState : useHTMLVisualState;
    function MotionDOMComponent(props, externalRef) {
      let MeasureLayout2;
      const configAndProps = {
        ...React.useContext(MotionConfigContext),
        ...props,
        layoutId: useLayoutId(props)
      };
      const { isStatic } = configAndProps;
      const context = useCreateMotionContext(props);
      const visualState = useVisualState(props, isStatic);
      if (!isStatic && isBrowser) {
        useStrictMode();
        const layoutProjection = getProjectionFunctionality(configAndProps);
        MeasureLayout2 = layoutProjection.MeasureLayout;
        context.visualElement = useVisualElement(Component2, visualState, configAndProps, createVisualElement, layoutProjection.ProjectionNode);
      }
      return jsxRuntimeExports.jsxs(MotionContext.Provider, { value: context, children: [MeasureLayout2 && context.visualElement ? jsxRuntimeExports.jsx(MeasureLayout2, { visualElement: context.visualElement, ...configAndProps }) : null, useRender(Component2, props, useMotionRef(visualState, context.visualElement, externalRef), visualState, isStatic, forwardMotionProps)] });
    }
    MotionDOMComponent.displayName = `motion.${typeof Component2 === "string" ? Component2 : `create(${Component2.displayName ?? Component2.name ?? ""})`}`;
    const ForwardRefMotionComponent = React.forwardRef(MotionDOMComponent);
    ForwardRefMotionComponent[motionComponentSymbol] = Component2;
    return ForwardRefMotionComponent;
  }
  function useLayoutId({ layoutId }) {
    const layoutGroupId = React.useContext(LayoutGroupContext).id;
    return layoutGroupId && layoutId !== void 0 ? layoutGroupId + "-" + layoutId : layoutId;
  }
  function useStrictMode(configAndProps, preloadedFeatures) {
    React.useContext(LazyContext).strict;
  }
  function getProjectionFunctionality(props) {
    const { drag: drag2, layout: layout2 } = featureDefinitions;
    if (!drag2 && !layout2)
      return {};
    const combined = { ...drag2, ...layout2 };
    return {
      MeasureLayout: drag2?.isEnabled(props) || layout2?.isEnabled(props) ? combined.MeasureLayout : void 0,
      ProjectionNode: combined.ProjectionNode
    };
  }
  function createMotionProxy(preloadedFeatures, createVisualElement) {
    if (typeof Proxy === "undefined") {
      return createMotionComponent;
    }
    const componentCache = new Map();
    const factory = (Component2, options) => {
      return createMotionComponent(Component2, options, preloadedFeatures, createVisualElement);
    };
    const deprecatedFactoryFunction = (Component2, options) => {
      return factory(Component2, options);
    };
    return new Proxy(deprecatedFactoryFunction, {
get: (_target, key) => {
        if (key === "create")
          return factory;
        if (!componentCache.has(key)) {
          componentCache.set(key, createMotionComponent(key, void 0, preloadedFeatures, createVisualElement));
        }
        return componentCache.get(key);
      }
    });
  }
  function convertBoundingBoxToBox({ top, left, right, bottom }) {
    return {
      x: { min: left, max: right },
      y: { min: top, max: bottom }
    };
  }
  function convertBoxToBoundingBox({ x: x2, y }) {
    return { top: y.min, right: x2.max, bottom: y.max, left: x2.min };
  }
  function transformBoxPoints(point, transformPoint2) {
    if (!transformPoint2)
      return point;
    const topLeft = transformPoint2({ x: point.left, y: point.top });
    const bottomRight = transformPoint2({ x: point.right, y: point.bottom });
    return {
      top: topLeft.y,
      left: topLeft.x,
      bottom: bottomRight.y,
      right: bottomRight.x
    };
  }
  function isIdentityScale(scale2) {
    return scale2 === void 0 || scale2 === 1;
  }
  function hasScale({ scale: scale2, scaleX: scaleX2, scaleY: scaleY2 }) {
    return !isIdentityScale(scale2) || !isIdentityScale(scaleX2) || !isIdentityScale(scaleY2);
  }
  function hasTransform(values) {
    return hasScale(values) || has2DTranslate(values) || values.z || values.rotate || values.rotateX || values.rotateY || values.skewX || values.skewY;
  }
  function has2DTranslate(values) {
    return is2DTranslate(values.x) || is2DTranslate(values.y);
  }
  function is2DTranslate(value) {
    return value && value !== "0%";
  }
  function scalePoint(point, scale2, originPoint) {
    const distanceFromOrigin = point - originPoint;
    const scaled = scale2 * distanceFromOrigin;
    return originPoint + scaled;
  }
  function applyPointDelta(point, translate, scale2, originPoint, boxScale) {
    if (boxScale !== void 0) {
      point = scalePoint(point, boxScale, originPoint);
    }
    return scalePoint(point, scale2, originPoint) + translate;
  }
  function applyAxisDelta(axis, translate = 0, scale2 = 1, originPoint, boxScale) {
    axis.min = applyPointDelta(axis.min, translate, scale2, originPoint, boxScale);
    axis.max = applyPointDelta(axis.max, translate, scale2, originPoint, boxScale);
  }
  function applyBoxDelta(box, { x: x2, y }) {
    applyAxisDelta(box.x, x2.translate, x2.scale, x2.originPoint);
    applyAxisDelta(box.y, y.translate, y.scale, y.originPoint);
  }
  const TREE_SCALE_SNAP_MIN = 0.999999999999;
  const TREE_SCALE_SNAP_MAX = 1.0000000000001;
  function applyTreeDeltas(box, treeScale, treePath, isSharedTransition = false) {
    const treeLength = treePath.length;
    if (!treeLength)
      return;
    treeScale.x = treeScale.y = 1;
    let node;
    let delta;
    for (let i2 = 0; i2 < treeLength; i2++) {
      node = treePath[i2];
      delta = node.projectionDelta;
      const { visualElement } = node.options;
      if (visualElement && visualElement.props.style && visualElement.props.style.display === "contents") {
        continue;
      }
      if (isSharedTransition && node.options.layoutScroll && node.scroll && node !== node.root) {
        transformBox(box, {
          x: -node.scroll.offset.x,
          y: -node.scroll.offset.y
        });
      }
      if (delta) {
        treeScale.x *= delta.x.scale;
        treeScale.y *= delta.y.scale;
        applyBoxDelta(box, delta);
      }
      if (isSharedTransition && hasTransform(node.latestValues)) {
        transformBox(box, node.latestValues);
      }
    }
    if (treeScale.x < TREE_SCALE_SNAP_MAX && treeScale.x > TREE_SCALE_SNAP_MIN) {
      treeScale.x = 1;
    }
    if (treeScale.y < TREE_SCALE_SNAP_MAX && treeScale.y > TREE_SCALE_SNAP_MIN) {
      treeScale.y = 1;
    }
  }
  function translateAxis(axis, distance2) {
    axis.min = axis.min + distance2;
    axis.max = axis.max + distance2;
  }
  function transformAxis(axis, axisTranslate, axisScale, boxScale, axisOrigin = 0.5) {
    const originPoint = mixNumber$1(axis.min, axis.max, axisOrigin);
    applyAxisDelta(axis, axisTranslate, axisScale, originPoint, boxScale);
  }
  function transformBox(box, transform) {
    transformAxis(box.x, transform.x, transform.scaleX, transform.scale, transform.originX);
    transformAxis(box.y, transform.y, transform.scaleY, transform.scale, transform.originY);
  }
  function measureViewportBox(instance, transformPoint2) {
    return convertBoundingBoxToBox(transformBoxPoints(instance.getBoundingClientRect(), transformPoint2));
  }
  function measurePageBox(element, rootProjectionNode2, transformPagePoint) {
    const viewportBox = measureViewportBox(element, transformPagePoint);
    const { scroll } = rootProjectionNode2;
    if (scroll) {
      translateAxis(viewportBox.x, scroll.offset.x);
      translateAxis(viewportBox.y, scroll.offset.y);
    }
    return viewportBox;
  }
  const createAxisDelta = () => ({
    translate: 0,
    scale: 1,
    origin: 0,
    originPoint: 0
  });
  const createDelta = () => ({
    x: createAxisDelta(),
    y: createAxisDelta()
  });
  const createAxis = () => ({ min: 0, max: 0 });
  const createBox = () => ({
    x: createAxis(),
    y: createAxis()
  });
  const prefersReducedMotion = { current: null };
  const hasReducedMotionListener = { current: false };
  function initPrefersReducedMotion() {
    hasReducedMotionListener.current = true;
    if (!isBrowser)
      return;
    if (window.matchMedia) {
      const motionMediaQuery = window.matchMedia("(prefers-reduced-motion)");
      const setReducedMotionPreferences = () => prefersReducedMotion.current = motionMediaQuery.matches;
      motionMediaQuery.addEventListener("change", setReducedMotionPreferences);
      setReducedMotionPreferences();
    } else {
      prefersReducedMotion.current = false;
    }
  }
  const visualElementStore = new WeakMap();
  function updateMotionValuesFromProps(element, next, prev) {
    for (const key in next) {
      const nextValue = next[key];
      const prevValue = prev[key];
      if (isMotionValue(nextValue)) {
        element.addValue(key, nextValue);
      } else if (isMotionValue(prevValue)) {
        element.addValue(key, motionValue(nextValue, { owner: element }));
      } else if (prevValue !== nextValue) {
        if (element.hasValue(key)) {
          const existingValue = element.getValue(key);
          if (existingValue.liveStyle === true) {
            existingValue.jump(nextValue);
          } else if (!existingValue.hasAnimated) {
            existingValue.set(nextValue);
          }
        } else {
          const latestValue = element.getStaticValue(key);
          element.addValue(key, motionValue(latestValue !== void 0 ? latestValue : nextValue, { owner: element }));
        }
      }
    }
    for (const key in prev) {
      if (next[key] === void 0)
        element.removeValue(key);
    }
    return next;
  }
  const propEventHandlers = [
    "AnimationStart",
    "AnimationComplete",
    "Update",
    "BeforeLayoutMeasure",
    "LayoutMeasure",
    "LayoutAnimationStart",
    "LayoutAnimationComplete"
  ];
  class VisualElement {
scrapeMotionValuesFromProps(_props, _prevProps, _visualElement) {
      return {};
    }
    constructor({ parent, props, presenceContext, reducedMotionConfig, blockInitialAnimation, visualState }, options = {}) {
      this.current = null;
      this.children = new Set();
      this.isVariantNode = false;
      this.isControllingVariants = false;
      this.shouldReduceMotion = null;
      this.values = new Map();
      this.KeyframeResolver = KeyframeResolver;
      this.features = {};
      this.valueSubscriptions = new Map();
      this.prevMotionValues = {};
      this.events = {};
      this.propEventSubscriptions = {};
      this.notifyUpdate = () => this.notify("Update", this.latestValues);
      this.render = () => {
        if (!this.current)
          return;
        this.triggerBuild();
        this.renderInstance(this.current, this.renderState, this.props.style, this.projection);
      };
      this.renderScheduledAt = 0;
      this.scheduleRender = () => {
        const now2 = time.now();
        if (this.renderScheduledAt < now2) {
          this.renderScheduledAt = now2;
          frame.render(this.render, false, true);
        }
      };
      const { latestValues, renderState } = visualState;
      this.latestValues = latestValues;
      this.baseTarget = { ...latestValues };
      this.initialValues = props.initial ? { ...latestValues } : {};
      this.renderState = renderState;
      this.parent = parent;
      this.props = props;
      this.presenceContext = presenceContext;
      this.depth = parent ? parent.depth + 1 : 0;
      this.reducedMotionConfig = reducedMotionConfig;
      this.options = options;
      this.blockInitialAnimation = Boolean(blockInitialAnimation);
      this.isControllingVariants = isControllingVariants(props);
      this.isVariantNode = isVariantNode(props);
      if (this.isVariantNode) {
        this.variantChildren = new Set();
      }
      this.manuallyAnimateOnMount = Boolean(parent && parent.current);
      const { willChange, ...initialMotionValues } = this.scrapeMotionValuesFromProps(props, {}, this);
      for (const key in initialMotionValues) {
        const value = initialMotionValues[key];
        if (latestValues[key] !== void 0 && isMotionValue(value)) {
          value.set(latestValues[key]);
        }
      }
    }
    mount(instance) {
      this.current = instance;
      visualElementStore.set(instance, this);
      if (this.projection && !this.projection.instance) {
        this.projection.mount(instance);
      }
      if (this.parent && this.isVariantNode && !this.isControllingVariants) {
        this.removeFromVariantTree = this.parent.addVariantChild(this);
      }
      this.values.forEach((value, key) => this.bindToMotionValue(key, value));
      if (!hasReducedMotionListener.current) {
        initPrefersReducedMotion();
      }
      this.shouldReduceMotion = this.reducedMotionConfig === "never" ? false : this.reducedMotionConfig === "always" ? true : prefersReducedMotion.current;
      this.parent?.addChild(this);
      this.update(this.props, this.presenceContext);
    }
    unmount() {
      this.projection && this.projection.unmount();
      cancelFrame(this.notifyUpdate);
      cancelFrame(this.render);
      this.valueSubscriptions.forEach((remove) => remove());
      this.valueSubscriptions.clear();
      this.removeFromVariantTree && this.removeFromVariantTree();
      this.parent?.removeChild(this);
      for (const key in this.events) {
        this.events[key].clear();
      }
      for (const key in this.features) {
        const feature = this.features[key];
        if (feature) {
          feature.unmount();
          feature.isMounted = false;
        }
      }
      this.current = null;
    }
    addChild(child) {
      this.children.add(child);
      this.enteringChildren ?? (this.enteringChildren = new Set());
      this.enteringChildren.add(child);
    }
    removeChild(child) {
      this.children.delete(child);
      this.enteringChildren && this.enteringChildren.delete(child);
    }
    bindToMotionValue(key, value) {
      if (this.valueSubscriptions.has(key)) {
        this.valueSubscriptions.get(key)();
      }
      const valueIsTransform = transformProps.has(key);
      if (valueIsTransform && this.onBindTransform) {
        this.onBindTransform();
      }
      const removeOnChange = value.on("change", (latestValue) => {
        this.latestValues[key] = latestValue;
        this.props.onUpdate && frame.preRender(this.notifyUpdate);
        if (valueIsTransform && this.projection) {
          this.projection.isTransformDirty = true;
        }
        this.scheduleRender();
      });
      let removeSyncCheck;
      if (window.MotionCheckAppearSync) {
        removeSyncCheck = window.MotionCheckAppearSync(this, key, value);
      }
      this.valueSubscriptions.set(key, () => {
        removeOnChange();
        if (removeSyncCheck)
          removeSyncCheck();
        if (value.owner)
          value.stop();
      });
    }
    sortNodePosition(other) {
      if (!this.current || !this.sortInstanceNodePosition || this.type !== other.type) {
        return 0;
      }
      return this.sortInstanceNodePosition(this.current, other.current);
    }
    updateFeatures() {
      let key = "animation";
      for (key in featureDefinitions) {
        const featureDefinition = featureDefinitions[key];
        if (!featureDefinition)
          continue;
        const { isEnabled, Feature: FeatureConstructor } = featureDefinition;
        if (!this.features[key] && FeatureConstructor && isEnabled(this.props)) {
          this.features[key] = new FeatureConstructor(this);
        }
        if (this.features[key]) {
          const feature = this.features[key];
          if (feature.isMounted) {
            feature.update();
          } else {
            feature.mount();
            feature.isMounted = true;
          }
        }
      }
    }
    triggerBuild() {
      this.build(this.renderState, this.latestValues, this.props);
    }
measureViewportBox() {
      return this.current ? this.measureInstanceViewportBox(this.current, this.props) : createBox();
    }
    getStaticValue(key) {
      return this.latestValues[key];
    }
    setStaticValue(key, value) {
      this.latestValues[key] = value;
    }
update(props, presenceContext) {
      if (props.transformTemplate || this.props.transformTemplate) {
        this.scheduleRender();
      }
      this.prevProps = this.props;
      this.props = props;
      this.prevPresenceContext = this.presenceContext;
      this.presenceContext = presenceContext;
      for (let i2 = 0; i2 < propEventHandlers.length; i2++) {
        const key = propEventHandlers[i2];
        if (this.propEventSubscriptions[key]) {
          this.propEventSubscriptions[key]();
          delete this.propEventSubscriptions[key];
        }
        const listenerName = "on" + key;
        const listener = props[listenerName];
        if (listener) {
          this.propEventSubscriptions[key] = this.on(key, listener);
        }
      }
      this.prevMotionValues = updateMotionValuesFromProps(this, this.scrapeMotionValuesFromProps(props, this.prevProps, this), this.prevMotionValues);
      if (this.handleChildMotionValue) {
        this.handleChildMotionValue();
      }
    }
    getProps() {
      return this.props;
    }
getVariant(name) {
      return this.props.variants ? this.props.variants[name] : void 0;
    }
getDefaultTransition() {
      return this.props.transition;
    }
    getTransformPagePoint() {
      return this.props.transformPagePoint;
    }
    getClosestVariantNode() {
      return this.isVariantNode ? this : this.parent ? this.parent.getClosestVariantNode() : void 0;
    }
addVariantChild(child) {
      const closestVariantNode = this.getClosestVariantNode();
      if (closestVariantNode) {
        closestVariantNode.variantChildren && closestVariantNode.variantChildren.add(child);
        return () => closestVariantNode.variantChildren.delete(child);
      }
    }
addValue(key, value) {
      const existingValue = this.values.get(key);
      if (value !== existingValue) {
        if (existingValue)
          this.removeValue(key);
        this.bindToMotionValue(key, value);
        this.values.set(key, value);
        this.latestValues[key] = value.get();
      }
    }
removeValue(key) {
      this.values.delete(key);
      const unsubscribe = this.valueSubscriptions.get(key);
      if (unsubscribe) {
        unsubscribe();
        this.valueSubscriptions.delete(key);
      }
      delete this.latestValues[key];
      this.removeValueFromRenderState(key, this.renderState);
    }
hasValue(key) {
      return this.values.has(key);
    }
    getValue(key, defaultValue) {
      if (this.props.values && this.props.values[key]) {
        return this.props.values[key];
      }
      let value = this.values.get(key);
      if (value === void 0 && defaultValue !== void 0) {
        value = motionValue(defaultValue === null ? void 0 : defaultValue, { owner: this });
        this.addValue(key, value);
      }
      return value;
    }
readValue(key, target) {
      let value = this.latestValues[key] !== void 0 || !this.current ? this.latestValues[key] : this.getBaseTargetFromProps(this.props, key) ?? this.readValueFromInstance(this.current, key, this.options);
      if (value !== void 0 && value !== null) {
        if (typeof value === "string" && (isNumericalString(value) || isZeroValueString(value))) {
          value = parseFloat(value);
        } else if (!findValueType(value) && complex.test(target)) {
          value = getAnimatableNone(key, target);
        }
        this.setBaseTarget(key, isMotionValue(value) ? value.get() : value);
      }
      return isMotionValue(value) ? value.get() : value;
    }
setBaseTarget(key, value) {
      this.baseTarget[key] = value;
    }
getBaseTarget(key) {
      const { initial } = this.props;
      let valueFromInitial;
      if (typeof initial === "string" || typeof initial === "object") {
        const variant = resolveVariantFromProps(this.props, initial, this.presenceContext?.custom);
        if (variant) {
          valueFromInitial = variant[key];
        }
      }
      if (initial && valueFromInitial !== void 0) {
        return valueFromInitial;
      }
      const target = this.getBaseTargetFromProps(this.props, key);
      if (target !== void 0 && !isMotionValue(target))
        return target;
      return this.initialValues[key] !== void 0 && valueFromInitial === void 0 ? void 0 : this.baseTarget[key];
    }
    on(eventName, callback) {
      if (!this.events[eventName]) {
        this.events[eventName] = new SubscriptionManager();
      }
      return this.events[eventName].add(callback);
    }
    notify(eventName, ...args) {
      if (this.events[eventName]) {
        this.events[eventName].notify(...args);
      }
    }
    scheduleRenderMicrotask() {
      microtask.render(this.render);
    }
  }
  class DOMVisualElement extends VisualElement {
    constructor() {
      super(...arguments);
      this.KeyframeResolver = DOMKeyframesResolver;
    }
    sortInstanceNodePosition(a2, b) {
      return a2.compareDocumentPosition(b) & 2 ? 1 : -1;
    }
    getBaseTargetFromProps(props, key) {
      return props.style ? props.style[key] : void 0;
    }
    removeValueFromRenderState(key, { vars, style: style2 }) {
      delete vars[key];
      delete style2[key];
    }
    handleChildMotionValue() {
      if (this.childSubscription) {
        this.childSubscription();
        delete this.childSubscription;
      }
      const { children } = this.props;
      if (isMotionValue(children)) {
        this.childSubscription = children.on("change", (latest) => {
          if (this.current) {
            this.current.textContent = `${latest}`;
          }
        });
      }
    }
  }
  function renderHTML(element, { style: style2, vars }, styleProp, projection) {
    const elementStyle = element.style;
    let key;
    for (key in style2) {
      elementStyle[key] = style2[key];
    }
    projection?.applyProjectionStyles(elementStyle, styleProp);
    for (key in vars) {
      elementStyle.setProperty(key, vars[key]);
    }
  }
  function getComputedStyle$2(element) {
    return window.getComputedStyle(element);
  }
  class HTMLVisualElement extends DOMVisualElement {
    constructor() {
      super(...arguments);
      this.type = "html";
      this.renderInstance = renderHTML;
    }
    readValueFromInstance(instance, key) {
      if (transformProps.has(key)) {
        return this.projection?.isProjecting ? defaultTransformValue(key) : readTransformValue(instance, key);
      } else {
        const computedStyle = getComputedStyle$2(instance);
        const value = (isCSSVariableName(key) ? computedStyle.getPropertyValue(key) : computedStyle[key]) || 0;
        return typeof value === "string" ? value.trim() : value;
      }
    }
    measureInstanceViewportBox(instance, { transformPagePoint }) {
      return measureViewportBox(instance, transformPagePoint);
    }
    build(renderState, latestValues, props) {
      buildHTMLStyles(renderState, latestValues, props.transformTemplate);
    }
    scrapeMotionValuesFromProps(props, prevProps, visualElement) {
      return scrapeMotionValuesFromProps$1(props, prevProps, visualElement);
    }
  }
  const camelCaseAttributes = new Set([
    "baseFrequency",
    "diffuseConstant",
    "kernelMatrix",
    "kernelUnitLength",
    "keySplines",
    "keyTimes",
    "limitingConeAngle",
    "markerHeight",
    "markerWidth",
    "numOctaves",
    "targetX",
    "targetY",
    "surfaceScale",
    "specularConstant",
    "specularExponent",
    "stdDeviation",
    "tableValues",
    "viewBox",
    "gradientTransform",
    "pathLength",
    "startOffset",
    "textLength",
    "lengthAdjust"
  ]);
  function renderSVG(element, renderState, _styleProp, projection) {
    renderHTML(element, renderState, void 0, projection);
    for (const key in renderState.attrs) {
      element.setAttribute(!camelCaseAttributes.has(key) ? camelToDash(key) : key, renderState.attrs[key]);
    }
  }
  class SVGVisualElement extends DOMVisualElement {
    constructor() {
      super(...arguments);
      this.type = "svg";
      this.isSVGTag = false;
      this.measureInstanceViewportBox = createBox;
    }
    getBaseTargetFromProps(props, key) {
      return props[key];
    }
    readValueFromInstance(instance, key) {
      if (transformProps.has(key)) {
        const defaultType = getDefaultValueType(key);
        return defaultType ? defaultType.default || 0 : 0;
      }
      key = !camelCaseAttributes.has(key) ? camelToDash(key) : key;
      return instance.getAttribute(key);
    }
    scrapeMotionValuesFromProps(props, prevProps, visualElement) {
      return scrapeMotionValuesFromProps(props, prevProps, visualElement);
    }
    build(renderState, latestValues, props) {
      buildSVGAttrs(renderState, latestValues, this.isSVGTag, props.transformTemplate, props.style);
    }
    renderInstance(instance, renderState, styleProp, projection) {
      renderSVG(instance, renderState, styleProp, projection);
    }
    mount(instance) {
      this.isSVGTag = isSVGTag(instance.tagName);
      super.mount(instance);
    }
  }
  const createDomVisualElement = (Component2, options) => {
    return isSVGComponent(Component2) ? new SVGVisualElement(options) : new HTMLVisualElement(options, {
      allowProjection: Component2 !== React.Fragment
    });
  };
  function resolveVariant(visualElement, definition, custom) {
    const props = visualElement.getProps();
    return resolveVariantFromProps(props, definition, custom !== void 0 ? custom : props.custom, visualElement);
  }
  const isKeyframesTarget = (v) => {
    return Array.isArray(v);
  };
  function setMotionValue(visualElement, key, value) {
    if (visualElement.hasValue(key)) {
      visualElement.getValue(key).set(value);
    } else {
      visualElement.addValue(key, motionValue(value));
    }
  }
  function resolveFinalValueInKeyframes(v) {
    return isKeyframesTarget(v) ? v[v.length - 1] || 0 : v;
  }
  function setTarget(visualElement, definition) {
    const resolved = resolveVariant(visualElement, definition);
    let { transitionEnd = {}, transition = {}, ...target } = resolved || {};
    target = { ...target, ...transitionEnd };
    for (const key in target) {
      const value = resolveFinalValueInKeyframes(target[key]);
      setMotionValue(visualElement, key, value);
    }
  }
  function isWillChangeMotionValue(value) {
    return Boolean(isMotionValue(value) && value.add);
  }
  function addValueToWillChange(visualElement, key) {
    const willChange = visualElement.getValue("willChange");
    if (isWillChangeMotionValue(willChange)) {
      return willChange.add(key);
    } else if (!willChange && MotionGlobalConfig.WillChange) {
      const newWillChange = new MotionGlobalConfig.WillChange("auto");
      visualElement.addValue("willChange", newWillChange);
      newWillChange.add(key);
    }
  }
  function getOptimisedAppearId(visualElement) {
    return visualElement.props[optimizedAppearDataAttribute];
  }
  const isNotNull$1 = (value) => value !== null;
  function getFinalKeyframe(keyframes2, { repeat, repeatType = "loop" }, finalKeyframe) {
    const resolvedKeyframes = keyframes2.filter(isNotNull$1);
    const index2 = repeat && repeatType !== "loop" && repeat % 2 === 1 ? 0 : resolvedKeyframes.length - 1;
    return resolvedKeyframes[index2];
  }
  const underDampedSpring = {
    type: "spring",
    stiffness: 500,
    damping: 25,
    restSpeed: 10
  };
  const criticallyDampedSpring = (target) => ({
    type: "spring",
    stiffness: 550,
    damping: target === 0 ? 2 * Math.sqrt(550) : 30,
    restSpeed: 10
  });
  const keyframesTransition = {
    type: "keyframes",
    duration: 0.8
  };
  const ease = {
    type: "keyframes",
    ease: [0.25, 0.1, 0.35, 1],
    duration: 0.3
  };
  const getDefaultTransition = (valueKey, { keyframes: keyframes2 }) => {
    if (keyframes2.length > 2) {
      return keyframesTransition;
    } else if (transformProps.has(valueKey)) {
      return valueKey.startsWith("scale") ? criticallyDampedSpring(keyframes2[1]) : underDampedSpring;
    }
    return ease;
  };
  function isTransitionDefined({ when, delay: _delay, delayChildren, staggerChildren, staggerDirection, repeat, repeatType, repeatDelay, from, elapsed, ...transition }) {
    return !!Object.keys(transition).length;
  }
  const animateMotionValue = (name, value, target, transition = {}, element, isHandoff) => (onComplete) => {
    const valueTransition = getValueTransition(transition, name) || {};
    const delay2 = valueTransition.delay || transition.delay || 0;
    let { elapsed = 0 } = transition;
    elapsed = elapsed - secondsToMilliseconds(delay2);
    const options = {
      keyframes: Array.isArray(target) ? target : [null, target],
      ease: "easeOut",
      velocity: value.getVelocity(),
      ...valueTransition,
      delay: -elapsed,
      onUpdate: (v) => {
        value.set(v);
        valueTransition.onUpdate && valueTransition.onUpdate(v);
      },
      onComplete: () => {
        onComplete();
        valueTransition.onComplete && valueTransition.onComplete();
      },
      name,
      motionValue: value,
      element: isHandoff ? void 0 : element
    };
    if (!isTransitionDefined(valueTransition)) {
      Object.assign(options, getDefaultTransition(name, options));
    }
    options.duration && (options.duration = secondsToMilliseconds(options.duration));
    options.repeatDelay && (options.repeatDelay = secondsToMilliseconds(options.repeatDelay));
    if (options.from !== void 0) {
      options.keyframes[0] = options.from;
    }
    let shouldSkip = false;
    if (options.type === false || options.duration === 0 && !options.repeatDelay) {
      makeAnimationInstant(options);
      if (options.delay === 0) {
        shouldSkip = true;
      }
    }
    if (MotionGlobalConfig.instantAnimations || MotionGlobalConfig.skipAnimations) {
      shouldSkip = true;
      makeAnimationInstant(options);
      options.delay = 0;
    }
    options.allowFlatten = !valueTransition.type && !valueTransition.ease;
    if (shouldSkip && !isHandoff && value.get() !== void 0) {
      const finalKeyframe = getFinalKeyframe(options.keyframes, valueTransition);
      if (finalKeyframe !== void 0) {
        frame.update(() => {
          options.onUpdate(finalKeyframe);
          options.onComplete();
        });
        return;
      }
    }
    return valueTransition.isSync ? new JSAnimation(options) : new AsyncMotionValueAnimation(options);
  };
  function shouldBlockAnimation({ protectedKeys, needsAnimating }, key) {
    const shouldBlock = protectedKeys.hasOwnProperty(key) && needsAnimating[key] !== true;
    needsAnimating[key] = false;
    return shouldBlock;
  }
  function animateTarget(visualElement, targetAndTransition, { delay: delay2 = 0, transitionOverride, type } = {}) {
    let { transition = visualElement.getDefaultTransition(), transitionEnd, ...target } = targetAndTransition;
    if (transitionOverride)
      transition = transitionOverride;
    const animations2 = [];
    const animationTypeState = type && visualElement.animationState && visualElement.animationState.getState()[type];
    for (const key in target) {
      const value = visualElement.getValue(key, visualElement.latestValues[key] ?? null);
      const valueTarget = target[key];
      if (valueTarget === void 0 || animationTypeState && shouldBlockAnimation(animationTypeState, key)) {
        continue;
      }
      const valueTransition = {
        delay: delay2,
        ...getValueTransition(transition || {}, key)
      };
      const currentValue = value.get();
      if (currentValue !== void 0 && !value.isAnimating && !Array.isArray(valueTarget) && valueTarget === currentValue && !valueTransition.velocity) {
        continue;
      }
      let isHandoff = false;
      if (window.MotionHandoffAnimation) {
        const appearId = getOptimisedAppearId(visualElement);
        if (appearId) {
          const startTime = window.MotionHandoffAnimation(appearId, key, frame);
          if (startTime !== null) {
            valueTransition.startTime = startTime;
            isHandoff = true;
          }
        }
      }
      addValueToWillChange(visualElement, key);
      value.start(animateMotionValue(key, value, valueTarget, visualElement.shouldReduceMotion && positionalKeys.has(key) ? { type: false } : valueTransition, visualElement, isHandoff));
      const animation = value.animation;
      if (animation) {
        animations2.push(animation);
      }
    }
    if (transitionEnd) {
      Promise.all(animations2).then(() => {
        frame.update(() => {
          transitionEnd && setTarget(visualElement, transitionEnd);
        });
      });
    }
    return animations2;
  }
  function calcChildStagger(children, child, delayChildren, staggerChildren = 0, staggerDirection = 1) {
    const index2 = Array.from(children).sort((a2, b) => a2.sortNodePosition(b)).indexOf(child);
    const numChildren = children.size;
    const maxStaggerDuration = (numChildren - 1) * staggerChildren;
    const delayIsFunction = typeof delayChildren === "function";
    return delayIsFunction ? delayChildren(index2, numChildren) : staggerDirection === 1 ? index2 * staggerChildren : maxStaggerDuration - index2 * staggerChildren;
  }
  function animateVariant(visualElement, variant, options = {}) {
    const resolved = resolveVariant(visualElement, variant, options.type === "exit" ? visualElement.presenceContext?.custom : void 0);
    let { transition = visualElement.getDefaultTransition() || {} } = resolved || {};
    if (options.transitionOverride) {
      transition = options.transitionOverride;
    }
    const getAnimation = resolved ? () => Promise.all(animateTarget(visualElement, resolved, options)) : () => Promise.resolve();
    const getChildAnimations = visualElement.variantChildren && visualElement.variantChildren.size ? (forwardDelay = 0) => {
      const { delayChildren = 0, staggerChildren, staggerDirection } = transition;
      return animateChildren(visualElement, variant, forwardDelay, delayChildren, staggerChildren, staggerDirection, options);
    } : () => Promise.resolve();
    const { when } = transition;
    if (when) {
      const [first, last] = when === "beforeChildren" ? [getAnimation, getChildAnimations] : [getChildAnimations, getAnimation];
      return first().then(() => last());
    } else {
      return Promise.all([getAnimation(), getChildAnimations(options.delay)]);
    }
  }
  function animateChildren(visualElement, variant, delay2 = 0, delayChildren = 0, staggerChildren = 0, staggerDirection = 1, options) {
    const animations2 = [];
    for (const child of visualElement.variantChildren) {
      child.notify("AnimationStart", variant);
      animations2.push(animateVariant(child, variant, {
        ...options,
        delay: delay2 + (typeof delayChildren === "function" ? 0 : delayChildren) + calcChildStagger(visualElement.variantChildren, child, delayChildren, staggerChildren, staggerDirection)
      }).then(() => child.notify("AnimationComplete", variant)));
    }
    return Promise.all(animations2);
  }
  function animateVisualElement(visualElement, definition, options = {}) {
    visualElement.notify("AnimationStart", definition);
    let animation;
    if (Array.isArray(definition)) {
      const animations2 = definition.map((variant) => animateVariant(visualElement, variant, options));
      animation = Promise.all(animations2);
    } else if (typeof definition === "string") {
      animation = animateVariant(visualElement, definition, options);
    } else {
      const resolvedDefinition = typeof definition === "function" ? resolveVariant(visualElement, definition, options.custom) : definition;
      animation = Promise.all(animateTarget(visualElement, resolvedDefinition, options));
    }
    return animation.then(() => {
      visualElement.notify("AnimationComplete", definition);
    });
  }
  function shallowCompare(next, prev) {
    if (!Array.isArray(prev))
      return false;
    const prevLength = prev.length;
    if (prevLength !== next.length)
      return false;
    for (let i2 = 0; i2 < prevLength; i2++) {
      if (prev[i2] !== next[i2])
        return false;
    }
    return true;
  }
  const numVariantProps = variantProps.length;
  function getVariantContext(visualElement) {
    if (!visualElement)
      return void 0;
    if (!visualElement.isControllingVariants) {
      const context2 = visualElement.parent ? getVariantContext(visualElement.parent) || {} : {};
      if (visualElement.props.initial !== void 0) {
        context2.initial = visualElement.props.initial;
      }
      return context2;
    }
    const context = {};
    for (let i2 = 0; i2 < numVariantProps; i2++) {
      const name = variantProps[i2];
      const prop = visualElement.props[name];
      if (isVariantLabel(prop) || prop === false) {
        context[name] = prop;
      }
    }
    return context;
  }
  const reversePriorityOrder = [...variantPriorityOrder].reverse();
  const numAnimationTypes = variantPriorityOrder.length;
  function animateList(visualElement) {
    return (animations2) => Promise.all(animations2.map(({ animation, options }) => animateVisualElement(visualElement, animation, options)));
  }
  function createAnimationState(visualElement) {
    let animate = animateList(visualElement);
    let state = createState();
    let isInitialRender = true;
    const buildResolvedTypeValues = (type) => (acc, definition) => {
      const resolved = resolveVariant(visualElement, definition, type === "exit" ? visualElement.presenceContext?.custom : void 0);
      if (resolved) {
        const { transition, transitionEnd, ...target } = resolved;
        acc = { ...acc, ...target, ...transitionEnd };
      }
      return acc;
    };
    function setAnimateFunction(makeAnimator) {
      animate = makeAnimator(visualElement);
    }
    function animateChanges(changedActiveType) {
      const { props } = visualElement;
      const context = getVariantContext(visualElement.parent) || {};
      const animations2 = [];
      const removedKeys = new Set();
      let encounteredKeys = {};
      let removedVariantIndex = Infinity;
      for (let i2 = 0; i2 < numAnimationTypes; i2++) {
        const type = reversePriorityOrder[i2];
        const typeState = state[type];
        const prop = props[type] !== void 0 ? props[type] : context[type];
        const propIsVariant = isVariantLabel(prop);
        const activeDelta = type === changedActiveType ? typeState.isActive : null;
        if (activeDelta === false)
          removedVariantIndex = i2;
        let isInherited = prop === context[type] && prop !== props[type] && propIsVariant;
        if (isInherited && isInitialRender && visualElement.manuallyAnimateOnMount) {
          isInherited = false;
        }
        typeState.protectedKeys = { ...encounteredKeys };
        if (
!typeState.isActive && activeDelta === null ||
!prop && !typeState.prevProp ||
isAnimationControls(prop) || typeof prop === "boolean"
        ) {
          continue;
        }
        const variantDidChange = checkVariantsDidChange(typeState.prevProp, prop);
        let shouldAnimateType = variantDidChange ||
type === changedActiveType && typeState.isActive && !isInherited && propIsVariant ||
i2 > removedVariantIndex && propIsVariant;
        let handledRemovedValues = false;
        const definitionList = Array.isArray(prop) ? prop : [prop];
        let resolvedValues = definitionList.reduce(buildResolvedTypeValues(type), {});
        if (activeDelta === false)
          resolvedValues = {};
        const { prevResolvedValues = {} } = typeState;
        const allKeys = {
          ...prevResolvedValues,
          ...resolvedValues
        };
        const markToAnimate = (key) => {
          shouldAnimateType = true;
          if (removedKeys.has(key)) {
            handledRemovedValues = true;
            removedKeys.delete(key);
          }
          typeState.needsAnimating[key] = true;
          const motionValue2 = visualElement.getValue(key);
          if (motionValue2)
            motionValue2.liveStyle = false;
        };
        for (const key in allKeys) {
          const next = resolvedValues[key];
          const prev = prevResolvedValues[key];
          if (encounteredKeys.hasOwnProperty(key))
            continue;
          let valueHasChanged = false;
          if (isKeyframesTarget(next) && isKeyframesTarget(prev)) {
            valueHasChanged = !shallowCompare(next, prev);
          } else {
            valueHasChanged = next !== prev;
          }
          if (valueHasChanged) {
            if (next !== void 0 && next !== null) {
              markToAnimate(key);
            } else {
              removedKeys.add(key);
            }
          } else if (next !== void 0 && removedKeys.has(key)) {
            markToAnimate(key);
          } else {
            typeState.protectedKeys[key] = true;
          }
        }
        typeState.prevProp = prop;
        typeState.prevResolvedValues = resolvedValues;
        if (typeState.isActive) {
          encounteredKeys = { ...encounteredKeys, ...resolvedValues };
        }
        if (isInitialRender && visualElement.blockInitialAnimation) {
          shouldAnimateType = false;
        }
        const willAnimateViaParent = isInherited && variantDidChange;
        const needsAnimating = !willAnimateViaParent || handledRemovedValues;
        if (shouldAnimateType && needsAnimating) {
          animations2.push(...definitionList.map((animation) => {
            const options = { type };
            if (typeof animation === "string" && isInitialRender && !willAnimateViaParent && visualElement.manuallyAnimateOnMount && visualElement.parent) {
              const { parent } = visualElement;
              const parentVariant = resolveVariant(parent, animation);
              if (parent.enteringChildren && parentVariant) {
                const { delayChildren } = parentVariant.transition || {};
                options.delay = calcChildStagger(parent.enteringChildren, visualElement, delayChildren);
              }
            }
            return {
              animation,
              options
            };
          }));
        }
      }
      if (removedKeys.size) {
        const fallbackAnimation = {};
        if (typeof props.initial !== "boolean") {
          const initialTransition = resolveVariant(visualElement, Array.isArray(props.initial) ? props.initial[0] : props.initial);
          if (initialTransition && initialTransition.transition) {
            fallbackAnimation.transition = initialTransition.transition;
          }
        }
        removedKeys.forEach((key) => {
          const fallbackTarget = visualElement.getBaseTarget(key);
          const motionValue2 = visualElement.getValue(key);
          if (motionValue2)
            motionValue2.liveStyle = true;
          fallbackAnimation[key] = fallbackTarget ?? null;
        });
        animations2.push({ animation: fallbackAnimation });
      }
      let shouldAnimate = Boolean(animations2.length);
      if (isInitialRender && (props.initial === false || props.initial === props.animate) && !visualElement.manuallyAnimateOnMount) {
        shouldAnimate = false;
      }
      isInitialRender = false;
      return shouldAnimate ? animate(animations2) : Promise.resolve();
    }
    function setActive(type, isActive) {
      if (state[type].isActive === isActive)
        return Promise.resolve();
      visualElement.variantChildren?.forEach((child) => child.animationState?.setActive(type, isActive));
      state[type].isActive = isActive;
      const animations2 = animateChanges(type);
      for (const key in state) {
        state[key].protectedKeys = {};
      }
      return animations2;
    }
    return {
      animateChanges,
      setActive,
      setAnimateFunction,
      getState: () => state,
      reset: () => {
        state = createState();
      }
    };
  }
  function checkVariantsDidChange(prev, next) {
    if (typeof next === "string") {
      return next !== prev;
    } else if (Array.isArray(next)) {
      return !shallowCompare(next, prev);
    }
    return false;
  }
  function createTypeState(isActive = false) {
    return {
      isActive,
      protectedKeys: {},
      needsAnimating: {},
      prevResolvedValues: {}
    };
  }
  function createState() {
    return {
      animate: createTypeState(true),
      whileInView: createTypeState(),
      whileHover: createTypeState(),
      whileTap: createTypeState(),
      whileDrag: createTypeState(),
      whileFocus: createTypeState(),
      exit: createTypeState()
    };
  }
  class Feature {
    constructor(node) {
      this.isMounted = false;
      this.node = node;
    }
    update() {
    }
  }
  class AnimationFeature extends Feature {
constructor(node) {
      super(node);
      node.animationState || (node.animationState = createAnimationState(node));
    }
    updateAnimationControlsSubscription() {
      const { animate } = this.node.getProps();
      if (isAnimationControls(animate)) {
        this.unmountControls = animate.subscribe(this.node);
      }
    }
mount() {
      this.updateAnimationControlsSubscription();
    }
    update() {
      const { animate } = this.node.getProps();
      const { animate: prevAnimate } = this.node.prevProps || {};
      if (animate !== prevAnimate) {
        this.updateAnimationControlsSubscription();
      }
    }
    unmount() {
      this.node.animationState.reset();
      this.unmountControls?.();
    }
  }
  let id$1 = 0;
  class ExitAnimationFeature extends Feature {
    constructor() {
      super(...arguments);
      this.id = id$1++;
    }
    update() {
      if (!this.node.presenceContext)
        return;
      const { isPresent, onExitComplete } = this.node.presenceContext;
      const { isPresent: prevIsPresent } = this.node.prevPresenceContext || {};
      if (!this.node.animationState || isPresent === prevIsPresent) {
        return;
      }
      const exitAnimation = this.node.animationState.setActive("exit", !isPresent);
      if (onExitComplete && !isPresent) {
        exitAnimation.then(() => {
          onExitComplete(this.id);
        });
      }
    }
    mount() {
      const { register, onExitComplete } = this.node.presenceContext || {};
      if (onExitComplete) {
        onExitComplete(this.id);
      }
      if (register) {
        this.unmount = register(this.id);
      }
    }
    unmount() {
    }
  }
  const animations = {
    animation: {
      Feature: AnimationFeature
    },
    exit: {
      Feature: ExitAnimationFeature
    }
  };
  function addDomEvent(target, eventName, handler, options = { passive: true }) {
    target.addEventListener(eventName, handler, options);
    return () => target.removeEventListener(eventName, handler);
  }
  function extractEventInfo(event) {
    return {
      point: {
        x: event.pageX,
        y: event.pageY
      }
    };
  }
  const addPointerInfo = (handler) => {
    return (event) => isPrimaryPointer(event) && handler(event, extractEventInfo(event));
  };
  function addPointerEvent(target, eventName, handler, options) {
    return addDomEvent(target, eventName, addPointerInfo(handler), options);
  }
  const SCALE_PRECISION = 1e-4;
  const SCALE_MIN = 1 - SCALE_PRECISION;
  const SCALE_MAX = 1 + SCALE_PRECISION;
  const TRANSLATE_PRECISION = 0.01;
  const TRANSLATE_MIN = 0 - TRANSLATE_PRECISION;
  const TRANSLATE_MAX = 0 + TRANSLATE_PRECISION;
  function calcLength(axis) {
    return axis.max - axis.min;
  }
  function isNear(value, target, maxDistance) {
    return Math.abs(value - target) <= maxDistance;
  }
  function calcAxisDelta(delta, source, target, origin = 0.5) {
    delta.origin = origin;
    delta.originPoint = mixNumber$1(source.min, source.max, delta.origin);
    delta.scale = calcLength(target) / calcLength(source);
    delta.translate = mixNumber$1(target.min, target.max, delta.origin) - delta.originPoint;
    if (delta.scale >= SCALE_MIN && delta.scale <= SCALE_MAX || isNaN(delta.scale)) {
      delta.scale = 1;
    }
    if (delta.translate >= TRANSLATE_MIN && delta.translate <= TRANSLATE_MAX || isNaN(delta.translate)) {
      delta.translate = 0;
    }
  }
  function calcBoxDelta(delta, source, target, origin) {
    calcAxisDelta(delta.x, source.x, target.x, origin ? origin.originX : void 0);
    calcAxisDelta(delta.y, source.y, target.y, origin ? origin.originY : void 0);
  }
  function calcRelativeAxis(target, relative, parent) {
    target.min = parent.min + relative.min;
    target.max = target.min + calcLength(relative);
  }
  function calcRelativeBox(target, relative, parent) {
    calcRelativeAxis(target.x, relative.x, parent.x);
    calcRelativeAxis(target.y, relative.y, parent.y);
  }
  function calcRelativeAxisPosition(target, layout2, parent) {
    target.min = layout2.min - parent.min;
    target.max = target.min + calcLength(layout2);
  }
  function calcRelativePosition(target, layout2, parent) {
    calcRelativeAxisPosition(target.x, layout2.x, parent.x);
    calcRelativeAxisPosition(target.y, layout2.y, parent.y);
  }
  function eachAxis(callback) {
    return [callback("x"), callback("y")];
  }
  const getContextWindow = ({ current }) => {
    return current ? current.ownerDocument.defaultView : null;
  };
  const distance = (a2, b) => Math.abs(a2 - b);
  function distance2D(a2, b) {
    const xDelta = distance(a2.x, b.x);
    const yDelta = distance(a2.y, b.y);
    return Math.sqrt(xDelta ** 2 + yDelta ** 2);
  }
  class PanSession {
    constructor(event, handlers, { transformPagePoint, contextWindow = window, dragSnapToOrigin = false, distanceThreshold = 3 } = {}) {
      this.startEvent = null;
      this.lastMoveEvent = null;
      this.lastMoveEventInfo = null;
      this.handlers = {};
      this.contextWindow = window;
      this.updatePoint = () => {
        if (!(this.lastMoveEvent && this.lastMoveEventInfo))
          return;
        const info2 = getPanInfo(this.lastMoveEventInfo, this.history);
        const isPanStarted = this.startEvent !== null;
        const isDistancePastThreshold = distance2D(info2.offset, { x: 0, y: 0 }) >= this.distanceThreshold;
        if (!isPanStarted && !isDistancePastThreshold)
          return;
        const { point: point2 } = info2;
        const { timestamp: timestamp2 } = frameData;
        this.history.push({ ...point2, timestamp: timestamp2 });
        const { onStart, onMove } = this.handlers;
        if (!isPanStarted) {
          onStart && onStart(this.lastMoveEvent, info2);
          this.startEvent = this.lastMoveEvent;
        }
        onMove && onMove(this.lastMoveEvent, info2);
      };
      this.handlePointerMove = (event2, info2) => {
        this.lastMoveEvent = event2;
        this.lastMoveEventInfo = transformPoint(info2, this.transformPagePoint);
        frame.update(this.updatePoint, true);
      };
      this.handlePointerUp = (event2, info2) => {
        this.end();
        const { onEnd, onSessionEnd, resumeAnimation } = this.handlers;
        if (this.dragSnapToOrigin)
          resumeAnimation && resumeAnimation();
        if (!(this.lastMoveEvent && this.lastMoveEventInfo))
          return;
        const panInfo = getPanInfo(event2.type === "pointercancel" ? this.lastMoveEventInfo : transformPoint(info2, this.transformPagePoint), this.history);
        if (this.startEvent && onEnd) {
          onEnd(event2, panInfo);
        }
        onSessionEnd && onSessionEnd(event2, panInfo);
      };
      if (!isPrimaryPointer(event))
        return;
      this.dragSnapToOrigin = dragSnapToOrigin;
      this.handlers = handlers;
      this.transformPagePoint = transformPagePoint;
      this.distanceThreshold = distanceThreshold;
      this.contextWindow = contextWindow || window;
      const info = extractEventInfo(event);
      const initialInfo = transformPoint(info, this.transformPagePoint);
      const { point } = initialInfo;
      const { timestamp } = frameData;
      this.history = [{ ...point, timestamp }];
      const { onSessionStart } = handlers;
      onSessionStart && onSessionStart(event, getPanInfo(initialInfo, this.history));
      this.removeListeners = pipe(addPointerEvent(this.contextWindow, "pointermove", this.handlePointerMove), addPointerEvent(this.contextWindow, "pointerup", this.handlePointerUp), addPointerEvent(this.contextWindow, "pointercancel", this.handlePointerUp));
    }
    updateHandlers(handlers) {
      this.handlers = handlers;
    }
    end() {
      this.removeListeners && this.removeListeners();
      cancelFrame(this.updatePoint);
    }
  }
  function transformPoint(info, transformPagePoint) {
    return transformPagePoint ? { point: transformPagePoint(info.point) } : info;
  }
  function subtractPoint(a2, b) {
    return { x: a2.x - b.x, y: a2.y - b.y };
  }
  function getPanInfo({ point }, history) {
    return {
      point,
      delta: subtractPoint(point, lastDevicePoint(history)),
      offset: subtractPoint(point, startDevicePoint(history)),
      velocity: getVelocity(history, 0.1)
    };
  }
  function startDevicePoint(history) {
    return history[0];
  }
  function lastDevicePoint(history) {
    return history[history.length - 1];
  }
  function getVelocity(history, timeDelta) {
    if (history.length < 2) {
      return { x: 0, y: 0 };
    }
    let i2 = history.length - 1;
    let timestampedPoint = null;
    const lastPoint = lastDevicePoint(history);
    while (i2 >= 0) {
      timestampedPoint = history[i2];
      if (lastPoint.timestamp - timestampedPoint.timestamp > secondsToMilliseconds(timeDelta)) {
        break;
      }
      i2--;
    }
    if (!timestampedPoint) {
      return { x: 0, y: 0 };
    }
    const time2 = millisecondsToSeconds(lastPoint.timestamp - timestampedPoint.timestamp);
    if (time2 === 0) {
      return { x: 0, y: 0 };
    }
    const currentVelocity = {
      x: (lastPoint.x - timestampedPoint.x) / time2,
      y: (lastPoint.y - timestampedPoint.y) / time2
    };
    if (currentVelocity.x === Infinity) {
      currentVelocity.x = 0;
    }
    if (currentVelocity.y === Infinity) {
      currentVelocity.y = 0;
    }
    return currentVelocity;
  }
  function applyConstraints(point, { min: min2, max: max2 }, elastic) {
    if (min2 !== void 0 && point < min2) {
      point = elastic ? mixNumber$1(min2, point, elastic.min) : Math.max(point, min2);
    } else if (max2 !== void 0 && point > max2) {
      point = elastic ? mixNumber$1(max2, point, elastic.max) : Math.min(point, max2);
    }
    return point;
  }
  function calcRelativeAxisConstraints(axis, min2, max2) {
    return {
      min: min2 !== void 0 ? axis.min + min2 : void 0,
      max: max2 !== void 0 ? axis.max + max2 - (axis.max - axis.min) : void 0
    };
  }
  function calcRelativeConstraints(layoutBox, { top, left, bottom, right }) {
    return {
      x: calcRelativeAxisConstraints(layoutBox.x, left, right),
      y: calcRelativeAxisConstraints(layoutBox.y, top, bottom)
    };
  }
  function calcViewportAxisConstraints(layoutAxis, constraintsAxis) {
    let min2 = constraintsAxis.min - layoutAxis.min;
    let max2 = constraintsAxis.max - layoutAxis.max;
    if (constraintsAxis.max - constraintsAxis.min < layoutAxis.max - layoutAxis.min) {
      [min2, max2] = [max2, min2];
    }
    return { min: min2, max: max2 };
  }
  function calcViewportConstraints(layoutBox, constraintsBox) {
    return {
      x: calcViewportAxisConstraints(layoutBox.x, constraintsBox.x),
      y: calcViewportAxisConstraints(layoutBox.y, constraintsBox.y)
    };
  }
  function calcOrigin(source, target) {
    let origin = 0.5;
    const sourceLength = calcLength(source);
    const targetLength = calcLength(target);
    if (targetLength > sourceLength) {
      origin = progress(target.min, target.max - sourceLength, source.min);
    } else if (sourceLength > targetLength) {
      origin = progress(source.min, source.max - targetLength, target.min);
    }
    return clamp$1(0, 1, origin);
  }
  function rebaseAxisConstraints(layout2, constraints) {
    const relativeConstraints = {};
    if (constraints.min !== void 0) {
      relativeConstraints.min = constraints.min - layout2.min;
    }
    if (constraints.max !== void 0) {
      relativeConstraints.max = constraints.max - layout2.min;
    }
    return relativeConstraints;
  }
  const defaultElastic = 0.35;
  function resolveDragElastic(dragElastic = defaultElastic) {
    if (dragElastic === false) {
      dragElastic = 0;
    } else if (dragElastic === true) {
      dragElastic = defaultElastic;
    }
    return {
      x: resolveAxisElastic(dragElastic, "left", "right"),
      y: resolveAxisElastic(dragElastic, "top", "bottom")
    };
  }
  function resolveAxisElastic(dragElastic, minLabel, maxLabel) {
    return {
      min: resolvePointElastic(dragElastic, minLabel),
      max: resolvePointElastic(dragElastic, maxLabel)
    };
  }
  function resolvePointElastic(dragElastic, label) {
    return typeof dragElastic === "number" ? dragElastic : dragElastic[label] || 0;
  }
  const elementDragControls = new WeakMap();
  class VisualElementDragControls {
    constructor(visualElement) {
      this.openDragLock = null;
      this.isDragging = false;
      this.currentDirection = null;
      this.originPoint = { x: 0, y: 0 };
      this.constraints = false;
      this.hasMutatedConstraints = false;
      this.elastic = createBox();
      this.latestPointerEvent = null;
      this.latestPanInfo = null;
      this.visualElement = visualElement;
    }
    start(originEvent, { snapToCursor = false, distanceThreshold } = {}) {
      const { presenceContext } = this.visualElement;
      if (presenceContext && presenceContext.isPresent === false)
        return;
      const onSessionStart = (event) => {
        const { dragSnapToOrigin: dragSnapToOrigin2 } = this.getProps();
        dragSnapToOrigin2 ? this.pauseAnimation() : this.stopAnimation();
        if (snapToCursor) {
          this.snapToCursor(extractEventInfo(event).point);
        }
      };
      const onStart = (event, info) => {
        const { drag: drag2, dragPropagation, onDragStart } = this.getProps();
        if (drag2 && !dragPropagation) {
          if (this.openDragLock)
            this.openDragLock();
          this.openDragLock = setDragLock(drag2);
          if (!this.openDragLock)
            return;
        }
        this.latestPointerEvent = event;
        this.latestPanInfo = info;
        this.isDragging = true;
        this.currentDirection = null;
        this.resolveConstraints();
        if (this.visualElement.projection) {
          this.visualElement.projection.isAnimationBlocked = true;
          this.visualElement.projection.target = void 0;
        }
        eachAxis((axis) => {
          let current = this.getAxisMotionValue(axis).get() || 0;
          if (percent.test(current)) {
            const { projection } = this.visualElement;
            if (projection && projection.layout) {
              const measuredAxis = projection.layout.layoutBox[axis];
              if (measuredAxis) {
                const length = calcLength(measuredAxis);
                current = length * (parseFloat(current) / 100);
              }
            }
          }
          this.originPoint[axis] = current;
        });
        if (onDragStart) {
          frame.postRender(() => onDragStart(event, info));
        }
        addValueToWillChange(this.visualElement, "transform");
        const { animationState } = this.visualElement;
        animationState && animationState.setActive("whileDrag", true);
      };
      const onMove = (event, info) => {
        this.latestPointerEvent = event;
        this.latestPanInfo = info;
        const { dragPropagation, dragDirectionLock, onDirectionLock, onDrag } = this.getProps();
        if (!dragPropagation && !this.openDragLock)
          return;
        const { offset: offset2 } = info;
        if (dragDirectionLock && this.currentDirection === null) {
          this.currentDirection = getCurrentDirection(offset2);
          if (this.currentDirection !== null) {
            onDirectionLock && onDirectionLock(this.currentDirection);
          }
          return;
        }
        this.updateAxis("x", info.point, offset2);
        this.updateAxis("y", info.point, offset2);
        this.visualElement.render();
        onDrag && onDrag(event, info);
      };
      const onSessionEnd = (event, info) => {
        this.latestPointerEvent = event;
        this.latestPanInfo = info;
        this.stop(event, info);
        this.latestPointerEvent = null;
        this.latestPanInfo = null;
      };
      const resumeAnimation = () => eachAxis((axis) => this.getAnimationState(axis) === "paused" && this.getAxisMotionValue(axis).animation?.play());
      const { dragSnapToOrigin } = this.getProps();
      this.panSession = new PanSession(originEvent, {
        onSessionStart,
        onStart,
        onMove,
        onSessionEnd,
        resumeAnimation
      }, {
        transformPagePoint: this.visualElement.getTransformPagePoint(),
        dragSnapToOrigin,
        distanceThreshold,
        contextWindow: getContextWindow(this.visualElement)
      });
    }
stop(event, panInfo) {
      const finalEvent = event || this.latestPointerEvent;
      const finalPanInfo = panInfo || this.latestPanInfo;
      const isDragging2 = this.isDragging;
      this.cancel();
      if (!isDragging2 || !finalPanInfo || !finalEvent)
        return;
      const { velocity } = finalPanInfo;
      this.startAnimation(velocity);
      const { onDragEnd } = this.getProps();
      if (onDragEnd) {
        frame.postRender(() => onDragEnd(finalEvent, finalPanInfo));
      }
    }
cancel() {
      this.isDragging = false;
      const { projection, animationState } = this.visualElement;
      if (projection) {
        projection.isAnimationBlocked = false;
      }
      this.panSession && this.panSession.end();
      this.panSession = void 0;
      const { dragPropagation } = this.getProps();
      if (!dragPropagation && this.openDragLock) {
        this.openDragLock();
        this.openDragLock = null;
      }
      animationState && animationState.setActive("whileDrag", false);
    }
    updateAxis(axis, _point, offset2) {
      const { drag: drag2 } = this.getProps();
      if (!offset2 || !shouldDrag(axis, drag2, this.currentDirection))
        return;
      const axisValue = this.getAxisMotionValue(axis);
      let next = this.originPoint[axis] + offset2[axis];
      if (this.constraints && this.constraints[axis]) {
        next = applyConstraints(next, this.constraints[axis], this.elastic[axis]);
      }
      axisValue.set(next);
    }
    resolveConstraints() {
      const { dragConstraints, dragElastic } = this.getProps();
      const layout2 = this.visualElement.projection && !this.visualElement.projection.layout ? this.visualElement.projection.measure(false) : this.visualElement.projection?.layout;
      const prevConstraints = this.constraints;
      if (dragConstraints && isRefObject(dragConstraints)) {
        if (!this.constraints) {
          this.constraints = this.resolveRefConstraints();
        }
      } else {
        if (dragConstraints && layout2) {
          this.constraints = calcRelativeConstraints(layout2.layoutBox, dragConstraints);
        } else {
          this.constraints = false;
        }
      }
      this.elastic = resolveDragElastic(dragElastic);
      if (prevConstraints !== this.constraints && layout2 && this.constraints && !this.hasMutatedConstraints) {
        eachAxis((axis) => {
          if (this.constraints !== false && this.getAxisMotionValue(axis)) {
            this.constraints[axis] = rebaseAxisConstraints(layout2.layoutBox[axis], this.constraints[axis]);
          }
        });
      }
    }
    resolveRefConstraints() {
      const { dragConstraints: constraints, onMeasureDragConstraints } = this.getProps();
      if (!constraints || !isRefObject(constraints))
        return false;
      const constraintsElement = constraints.current;
      const { projection } = this.visualElement;
      if (!projection || !projection.layout)
        return false;
      const constraintsBox = measurePageBox(constraintsElement, projection.root, this.visualElement.getTransformPagePoint());
      let measuredConstraints = calcViewportConstraints(projection.layout.layoutBox, constraintsBox);
      if (onMeasureDragConstraints) {
        const userConstraints = onMeasureDragConstraints(convertBoxToBoundingBox(measuredConstraints));
        this.hasMutatedConstraints = !!userConstraints;
        if (userConstraints) {
          measuredConstraints = convertBoundingBoxToBox(userConstraints);
        }
      }
      return measuredConstraints;
    }
    startAnimation(velocity) {
      const { drag: drag2, dragMomentum, dragElastic, dragTransition, dragSnapToOrigin, onDragTransitionEnd } = this.getProps();
      const constraints = this.constraints || {};
      const momentumAnimations = eachAxis((axis) => {
        if (!shouldDrag(axis, drag2, this.currentDirection)) {
          return;
        }
        let transition = constraints && constraints[axis] || {};
        if (dragSnapToOrigin)
          transition = { min: 0, max: 0 };
        const bounceStiffness = dragElastic ? 200 : 1e6;
        const bounceDamping = dragElastic ? 40 : 1e7;
        const inertia2 = {
          type: "inertia",
          velocity: dragMomentum ? velocity[axis] : 0,
          bounceStiffness,
          bounceDamping,
          timeConstant: 750,
          restDelta: 1,
          restSpeed: 10,
          ...dragTransition,
          ...transition
        };
        return this.startAxisValueAnimation(axis, inertia2);
      });
      return Promise.all(momentumAnimations).then(onDragTransitionEnd);
    }
    startAxisValueAnimation(axis, transition) {
      const axisValue = this.getAxisMotionValue(axis);
      addValueToWillChange(this.visualElement, axis);
      return axisValue.start(animateMotionValue(axis, axisValue, 0, transition, this.visualElement, false));
    }
    stopAnimation() {
      eachAxis((axis) => this.getAxisMotionValue(axis).stop());
    }
    pauseAnimation() {
      eachAxis((axis) => this.getAxisMotionValue(axis).animation?.pause());
    }
    getAnimationState(axis) {
      return this.getAxisMotionValue(axis).animation?.state;
    }
getAxisMotionValue(axis) {
      const dragKey = `_drag${axis.toUpperCase()}`;
      const props = this.visualElement.getProps();
      const externalMotionValue = props[dragKey];
      return externalMotionValue ? externalMotionValue : this.visualElement.getValue(axis, (props.initial ? props.initial[axis] : void 0) || 0);
    }
    snapToCursor(point) {
      eachAxis((axis) => {
        const { drag: drag2 } = this.getProps();
        if (!shouldDrag(axis, drag2, this.currentDirection))
          return;
        const { projection } = this.visualElement;
        const axisValue = this.getAxisMotionValue(axis);
        if (projection && projection.layout) {
          const { min: min2, max: max2 } = projection.layout.layoutBox[axis];
          axisValue.set(point[axis] - mixNumber$1(min2, max2, 0.5));
        }
      });
    }
scalePositionWithinConstraints() {
      if (!this.visualElement.current)
        return;
      const { drag: drag2, dragConstraints } = this.getProps();
      const { projection } = this.visualElement;
      if (!isRefObject(dragConstraints) || !projection || !this.constraints)
        return;
      this.stopAnimation();
      const boxProgress = { x: 0, y: 0 };
      eachAxis((axis) => {
        const axisValue = this.getAxisMotionValue(axis);
        if (axisValue && this.constraints !== false) {
          const latest = axisValue.get();
          boxProgress[axis] = calcOrigin({ min: latest, max: latest }, this.constraints[axis]);
        }
      });
      const { transformTemplate } = this.visualElement.getProps();
      this.visualElement.current.style.transform = transformTemplate ? transformTemplate({}, "") : "none";
      projection.root && projection.root.updateScroll();
      projection.updateLayout();
      this.resolveConstraints();
      eachAxis((axis) => {
        if (!shouldDrag(axis, drag2, null))
          return;
        const axisValue = this.getAxisMotionValue(axis);
        const { min: min2, max: max2 } = this.constraints[axis];
        axisValue.set(mixNumber$1(min2, max2, boxProgress[axis]));
      });
    }
    addListeners() {
      if (!this.visualElement.current)
        return;
      elementDragControls.set(this.visualElement, this);
      const element = this.visualElement.current;
      const stopPointerListener = addPointerEvent(element, "pointerdown", (event) => {
        const { drag: drag2, dragListener = true } = this.getProps();
        drag2 && dragListener && this.start(event);
      });
      const measureDragConstraints = () => {
        const { dragConstraints } = this.getProps();
        if (isRefObject(dragConstraints) && dragConstraints.current) {
          this.constraints = this.resolveRefConstraints();
        }
      };
      const { projection } = this.visualElement;
      const stopMeasureLayoutListener = projection.addEventListener("measure", measureDragConstraints);
      if (projection && !projection.layout) {
        projection.root && projection.root.updateScroll();
        projection.updateLayout();
      }
      frame.read(measureDragConstraints);
      const stopResizeListener = addDomEvent(window, "resize", () => this.scalePositionWithinConstraints());
      const stopLayoutUpdateListener = projection.addEventListener("didUpdate", (({ delta, hasLayoutChanged }) => {
        if (this.isDragging && hasLayoutChanged) {
          eachAxis((axis) => {
            const motionValue2 = this.getAxisMotionValue(axis);
            if (!motionValue2)
              return;
            this.originPoint[axis] += delta[axis].translate;
            motionValue2.set(motionValue2.get() + delta[axis].translate);
          });
          this.visualElement.render();
        }
      }));
      return () => {
        stopResizeListener();
        stopPointerListener();
        stopMeasureLayoutListener();
        stopLayoutUpdateListener && stopLayoutUpdateListener();
      };
    }
    getProps() {
      const props = this.visualElement.getProps();
      const { drag: drag2 = false, dragDirectionLock = false, dragPropagation = false, dragConstraints = false, dragElastic = defaultElastic, dragMomentum = true } = props;
      return {
        ...props,
        drag: drag2,
        dragDirectionLock,
        dragPropagation,
        dragConstraints,
        dragElastic,
        dragMomentum
      };
    }
  }
  function shouldDrag(direction, drag2, currentDirection) {
    return (drag2 === true || drag2 === direction) && (currentDirection === null || currentDirection === direction);
  }
  function getCurrentDirection(offset2, lockThreshold = 10) {
    let direction = null;
    if (Math.abs(offset2.y) > lockThreshold) {
      direction = "y";
    } else if (Math.abs(offset2.x) > lockThreshold) {
      direction = "x";
    }
    return direction;
  }
  class DragGesture extends Feature {
    constructor(node) {
      super(node);
      this.removeGroupControls = noop$1;
      this.removeListeners = noop$1;
      this.controls = new VisualElementDragControls(node);
    }
    mount() {
      const { dragControls } = this.node.getProps();
      if (dragControls) {
        this.removeGroupControls = dragControls.subscribe(this.controls);
      }
      this.removeListeners = this.controls.addListeners() || noop$1;
    }
    unmount() {
      this.removeGroupControls();
      this.removeListeners();
    }
  }
  const asyncHandler = (handler) => (event, info) => {
    if (handler) {
      frame.postRender(() => handler(event, info));
    }
  };
  class PanGesture extends Feature {
    constructor() {
      super(...arguments);
      this.removePointerDownListener = noop$1;
    }
    onPointerDown(pointerDownEvent) {
      this.session = new PanSession(pointerDownEvent, this.createPanHandlers(), {
        transformPagePoint: this.node.getTransformPagePoint(),
        contextWindow: getContextWindow(this.node)
      });
    }
    createPanHandlers() {
      const { onPanSessionStart, onPanStart, onPan, onPanEnd } = this.node.getProps();
      return {
        onSessionStart: asyncHandler(onPanSessionStart),
        onStart: asyncHandler(onPanStart),
        onMove: onPan,
        onEnd: (event, info) => {
          delete this.session;
          if (onPanEnd) {
            frame.postRender(() => onPanEnd(event, info));
          }
        }
      };
    }
    mount() {
      this.removePointerDownListener = addPointerEvent(this.node.current, "pointerdown", (event) => this.onPointerDown(event));
    }
    update() {
      this.session && this.session.updateHandlers(this.createPanHandlers());
    }
    unmount() {
      this.removePointerDownListener();
      this.session && this.session.end();
    }
  }
  const globalProjectionState = {
hasAnimatedSinceResize: true,
hasEverUpdated: false
  };
  function pixelsToPercent(pixels, axis) {
    if (axis.max === axis.min)
      return 0;
    return pixels / (axis.max - axis.min) * 100;
  }
  const correctBorderRadius = {
    correct: (latest, node) => {
      if (!node.target)
        return latest;
      if (typeof latest === "string") {
        if (px.test(latest)) {
          latest = parseFloat(latest);
        } else {
          return latest;
        }
      }
      const x2 = pixelsToPercent(latest, node.target.x);
      const y = pixelsToPercent(latest, node.target.y);
      return `${x2}% ${y}%`;
    }
  };
  const correctBoxShadow = {
    correct: (latest, { treeScale, projectionDelta }) => {
      const original = latest;
      const shadow = complex.parse(latest);
      if (shadow.length > 5)
        return original;
      const template = complex.createTransformer(latest);
      const offset2 = typeof shadow[0] !== "number" ? 1 : 0;
      const xScale = projectionDelta.x.scale * treeScale.x;
      const yScale = projectionDelta.y.scale * treeScale.y;
      shadow[0 + offset2] /= xScale;
      shadow[1 + offset2] /= yScale;
      const averageScale = mixNumber$1(xScale, yScale, 0.5);
      if (typeof shadow[2 + offset2] === "number")
        shadow[2 + offset2] /= averageScale;
      if (typeof shadow[3 + offset2] === "number")
        shadow[3 + offset2] /= averageScale;
      return template(shadow);
    }
  };
  let hasTakenAnySnapshot = false;
  class MeasureLayoutWithContext extends React.Component {
componentDidMount() {
      const { visualElement, layoutGroup, switchLayoutGroup, layoutId } = this.props;
      const { projection } = visualElement;
      addScaleCorrector(defaultScaleCorrectors);
      if (projection) {
        if (layoutGroup.group)
          layoutGroup.group.add(projection);
        if (switchLayoutGroup && switchLayoutGroup.register && layoutId) {
          switchLayoutGroup.register(projection);
        }
        if (hasTakenAnySnapshot) {
          projection.root.didUpdate();
        }
        projection.addEventListener("animationComplete", () => {
          this.safeToRemove();
        });
        projection.setOptions({
          ...projection.options,
          onExitComplete: () => this.safeToRemove()
        });
      }
      globalProjectionState.hasEverUpdated = true;
    }
    getSnapshotBeforeUpdate(prevProps) {
      const { layoutDependency, visualElement, drag: drag2, isPresent } = this.props;
      const { projection } = visualElement;
      if (!projection)
        return null;
      projection.isPresent = isPresent;
      hasTakenAnySnapshot = true;
      if (drag2 || prevProps.layoutDependency !== layoutDependency || layoutDependency === void 0 || prevProps.isPresent !== isPresent) {
        projection.willUpdate();
      } else {
        this.safeToRemove();
      }
      if (prevProps.isPresent !== isPresent) {
        if (isPresent) {
          projection.promote();
        } else if (!projection.relegate()) {
          frame.postRender(() => {
            const stack = projection.getStack();
            if (!stack || !stack.members.length) {
              this.safeToRemove();
            }
          });
        }
      }
      return null;
    }
    componentDidUpdate() {
      const { projection } = this.props.visualElement;
      if (projection) {
        projection.root.didUpdate();
        microtask.postRender(() => {
          if (!projection.currentAnimation && projection.isLead()) {
            this.safeToRemove();
          }
        });
      }
    }
    componentWillUnmount() {
      const { visualElement, layoutGroup, switchLayoutGroup: promoteContext } = this.props;
      const { projection } = visualElement;
      hasTakenAnySnapshot = true;
      if (projection) {
        projection.scheduleCheckAfterUnmount();
        if (layoutGroup && layoutGroup.group)
          layoutGroup.group.remove(projection);
        if (promoteContext && promoteContext.deregister)
          promoteContext.deregister(projection);
      }
    }
    safeToRemove() {
      const { safeToRemove } = this.props;
      safeToRemove && safeToRemove();
    }
    render() {
      return null;
    }
  }
  function MeasureLayout(props) {
    const [isPresent, safeToRemove] = usePresence();
    const layoutGroup = React.useContext(LayoutGroupContext);
    return jsxRuntimeExports.jsx(MeasureLayoutWithContext, { ...props, layoutGroup, switchLayoutGroup: React.useContext(SwitchLayoutGroupContext), isPresent, safeToRemove });
  }
  const defaultScaleCorrectors = {
    borderRadius: {
      ...correctBorderRadius,
      applyTo: [
        "borderTopLeftRadius",
        "borderTopRightRadius",
        "borderBottomLeftRadius",
        "borderBottomRightRadius"
      ]
    },
    borderTopLeftRadius: correctBorderRadius,
    borderTopRightRadius: correctBorderRadius,
    borderBottomLeftRadius: correctBorderRadius,
    borderBottomRightRadius: correctBorderRadius,
    boxShadow: correctBoxShadow
  };
  function animateSingleValue(value, keyframes2, options) {
    const motionValue$1 = isMotionValue(value) ? value : motionValue(value);
    motionValue$1.start(animateMotionValue("", motionValue$1, keyframes2, options));
    return motionValue$1.animation;
  }
  const compareByDepth = (a2, b) => a2.depth - b.depth;
  class FlatTree {
    constructor() {
      this.children = [];
      this.isDirty = false;
    }
    add(child) {
      addUniqueItem(this.children, child);
      this.isDirty = true;
    }
    remove(child) {
      removeItem(this.children, child);
      this.isDirty = true;
    }
    forEach(callback) {
      this.isDirty && this.children.sort(compareByDepth);
      this.isDirty = false;
      this.children.forEach(callback);
    }
  }
  function delay(callback, timeout) {
    const start = time.now();
    const checkElapsed = ({ timestamp }) => {
      const elapsed = timestamp - start;
      if (elapsed >= timeout) {
        cancelFrame(checkElapsed);
        callback(elapsed - timeout);
      }
    };
    frame.setup(checkElapsed, true);
    return () => cancelFrame(checkElapsed);
  }
  const borders = ["TopLeft", "TopRight", "BottomLeft", "BottomRight"];
  const numBorders = borders.length;
  const asNumber = (value) => typeof value === "string" ? parseFloat(value) : value;
  const isPx = (value) => typeof value === "number" || px.test(value);
  function mixValues(target, follow, lead, progress2, shouldCrossfadeOpacity, isOnlyMember) {
    if (shouldCrossfadeOpacity) {
      target.opacity = mixNumber$1(0, lead.opacity ?? 1, easeCrossfadeIn(progress2));
      target.opacityExit = mixNumber$1(follow.opacity ?? 1, 0, easeCrossfadeOut(progress2));
    } else if (isOnlyMember) {
      target.opacity = mixNumber$1(follow.opacity ?? 1, lead.opacity ?? 1, progress2);
    }
    for (let i2 = 0; i2 < numBorders; i2++) {
      const borderLabel = `border${borders[i2]}Radius`;
      let followRadius = getRadius(follow, borderLabel);
      let leadRadius = getRadius(lead, borderLabel);
      if (followRadius === void 0 && leadRadius === void 0)
        continue;
      followRadius || (followRadius = 0);
      leadRadius || (leadRadius = 0);
      const canMix = followRadius === 0 || leadRadius === 0 || isPx(followRadius) === isPx(leadRadius);
      if (canMix) {
        target[borderLabel] = Math.max(mixNumber$1(asNumber(followRadius), asNumber(leadRadius), progress2), 0);
        if (percent.test(leadRadius) || percent.test(followRadius)) {
          target[borderLabel] += "%";
        }
      } else {
        target[borderLabel] = leadRadius;
      }
    }
    if (follow.rotate || lead.rotate) {
      target.rotate = mixNumber$1(follow.rotate || 0, lead.rotate || 0, progress2);
    }
  }
  function getRadius(values, radiusName) {
    return values[radiusName] !== void 0 ? values[radiusName] : values.borderRadius;
  }
  const easeCrossfadeIn = compress(0, 0.5, circOut);
  const easeCrossfadeOut = compress(0.5, 0.95, noop$1);
  function compress(min2, max2, easing) {
    return (p) => {
      if (p < min2)
        return 0;
      if (p > max2)
        return 1;
      return easing( progress(min2, max2, p));
    };
  }
  function copyAxisInto(axis, originAxis) {
    axis.min = originAxis.min;
    axis.max = originAxis.max;
  }
  function copyBoxInto(box, originBox) {
    copyAxisInto(box.x, originBox.x);
    copyAxisInto(box.y, originBox.y);
  }
  function copyAxisDeltaInto(delta, originDelta) {
    delta.translate = originDelta.translate;
    delta.scale = originDelta.scale;
    delta.originPoint = originDelta.originPoint;
    delta.origin = originDelta.origin;
  }
  function removePointDelta(point, translate, scale2, originPoint, boxScale) {
    point -= translate;
    point = scalePoint(point, 1 / scale2, originPoint);
    if (boxScale !== void 0) {
      point = scalePoint(point, 1 / boxScale, originPoint);
    }
    return point;
  }
  function removeAxisDelta(axis, translate = 0, scale2 = 1, origin = 0.5, boxScale, originAxis = axis, sourceAxis = axis) {
    if (percent.test(translate)) {
      translate = parseFloat(translate);
      const relativeProgress = mixNumber$1(sourceAxis.min, sourceAxis.max, translate / 100);
      translate = relativeProgress - sourceAxis.min;
    }
    if (typeof translate !== "number")
      return;
    let originPoint = mixNumber$1(originAxis.min, originAxis.max, origin);
    if (axis === originAxis)
      originPoint -= translate;
    axis.min = removePointDelta(axis.min, translate, scale2, originPoint, boxScale);
    axis.max = removePointDelta(axis.max, translate, scale2, originPoint, boxScale);
  }
  function removeAxisTransforms(axis, transforms, [key, scaleKey, originKey], origin, sourceAxis) {
    removeAxisDelta(axis, transforms[key], transforms[scaleKey], transforms[originKey], transforms.scale, origin, sourceAxis);
  }
  const xKeys = ["x", "scaleX", "originX"];
  const yKeys = ["y", "scaleY", "originY"];
  function removeBoxTransforms(box, transforms, originBox, sourceBox) {
    removeAxisTransforms(box.x, transforms, xKeys, originBox ? originBox.x : void 0, sourceBox ? sourceBox.x : void 0);
    removeAxisTransforms(box.y, transforms, yKeys, originBox ? originBox.y : void 0, sourceBox ? sourceBox.y : void 0);
  }
  function isAxisDeltaZero(delta) {
    return delta.translate === 0 && delta.scale === 1;
  }
  function isDeltaZero(delta) {
    return isAxisDeltaZero(delta.x) && isAxisDeltaZero(delta.y);
  }
  function axisEquals(a2, b) {
    return a2.min === b.min && a2.max === b.max;
  }
  function boxEquals(a2, b) {
    return axisEquals(a2.x, b.x) && axisEquals(a2.y, b.y);
  }
  function axisEqualsRounded(a2, b) {
    return Math.round(a2.min) === Math.round(b.min) && Math.round(a2.max) === Math.round(b.max);
  }
  function boxEqualsRounded(a2, b) {
    return axisEqualsRounded(a2.x, b.x) && axisEqualsRounded(a2.y, b.y);
  }
  function aspectRatio(box) {
    return calcLength(box.x) / calcLength(box.y);
  }
  function axisDeltaEquals(a2, b) {
    return a2.translate === b.translate && a2.scale === b.scale && a2.originPoint === b.originPoint;
  }
  class NodeStack {
    constructor() {
      this.members = [];
    }
    add(node) {
      addUniqueItem(this.members, node);
      node.scheduleRender();
    }
    remove(node) {
      removeItem(this.members, node);
      if (node === this.prevLead) {
        this.prevLead = void 0;
      }
      if (node === this.lead) {
        const prevLead = this.members[this.members.length - 1];
        if (prevLead) {
          this.promote(prevLead);
        }
      }
    }
    relegate(node) {
      const indexOfNode = this.members.findIndex((member) => node === member);
      if (indexOfNode === 0)
        return false;
      let prevLead;
      for (let i2 = indexOfNode; i2 >= 0; i2--) {
        const member = this.members[i2];
        if (member.isPresent !== false) {
          prevLead = member;
          break;
        }
      }
      if (prevLead) {
        this.promote(prevLead);
        return true;
      } else {
        return false;
      }
    }
    promote(node, preserveFollowOpacity) {
      const prevLead = this.lead;
      if (node === prevLead)
        return;
      this.prevLead = prevLead;
      this.lead = node;
      node.show();
      if (prevLead) {
        prevLead.instance && prevLead.scheduleRender();
        node.scheduleRender();
        node.resumeFrom = prevLead;
        if (preserveFollowOpacity) {
          node.resumeFrom.preserveOpacity = true;
        }
        if (prevLead.snapshot) {
          node.snapshot = prevLead.snapshot;
          node.snapshot.latestValues = prevLead.animationValues || prevLead.latestValues;
        }
        if (node.root && node.root.isUpdating) {
          node.isLayoutDirty = true;
        }
        const { crossfade } = node.options;
        if (crossfade === false) {
          prevLead.hide();
        }
      }
    }
    exitAnimationComplete() {
      this.members.forEach((node) => {
        const { options, resumingFrom } = node;
        options.onExitComplete && options.onExitComplete();
        if (resumingFrom) {
          resumingFrom.options.onExitComplete && resumingFrom.options.onExitComplete();
        }
      });
    }
    scheduleRender() {
      this.members.forEach((node) => {
        node.instance && node.scheduleRender(false);
      });
    }
removeLeadSnapshot() {
      if (this.lead && this.lead.snapshot) {
        this.lead.snapshot = void 0;
      }
    }
  }
  function buildProjectionTransform(delta, treeScale, latestTransform) {
    let transform = "";
    const xTranslate = delta.x.translate / treeScale.x;
    const yTranslate = delta.y.translate / treeScale.y;
    const zTranslate = latestTransform?.z || 0;
    if (xTranslate || yTranslate || zTranslate) {
      transform = `translate3d(${xTranslate}px, ${yTranslate}px, ${zTranslate}px) `;
    }
    if (treeScale.x !== 1 || treeScale.y !== 1) {
      transform += `scale(${1 / treeScale.x}, ${1 / treeScale.y}) `;
    }
    if (latestTransform) {
      const { transformPerspective, rotate: rotate2, rotateX, rotateY, skewX, skewY } = latestTransform;
      if (transformPerspective)
        transform = `perspective(${transformPerspective}px) ${transform}`;
      if (rotate2)
        transform += `rotate(${rotate2}deg) `;
      if (rotateX)
        transform += `rotateX(${rotateX}deg) `;
      if (rotateY)
        transform += `rotateY(${rotateY}deg) `;
      if (skewX)
        transform += `skewX(${skewX}deg) `;
      if (skewY)
        transform += `skewY(${skewY}deg) `;
    }
    const elementScaleX = delta.x.scale * treeScale.x;
    const elementScaleY = delta.y.scale * treeScale.y;
    if (elementScaleX !== 1 || elementScaleY !== 1) {
      transform += `scale(${elementScaleX}, ${elementScaleY})`;
    }
    return transform || "none";
  }
  const transformAxes = ["", "X", "Y", "Z"];
  const animationTarget = 1e3;
  let id = 0;
  function resetDistortingTransform(key, visualElement, values, sharedAnimationValues) {
    const { latestValues } = visualElement;
    if (latestValues[key]) {
      values[key] = latestValues[key];
      visualElement.setStaticValue(key, 0);
      if (sharedAnimationValues) {
        sharedAnimationValues[key] = 0;
      }
    }
  }
  function cancelTreeOptimisedTransformAnimations(projectionNode) {
    projectionNode.hasCheckedOptimisedAppear = true;
    if (projectionNode.root === projectionNode)
      return;
    const { visualElement } = projectionNode.options;
    if (!visualElement)
      return;
    const appearId = getOptimisedAppearId(visualElement);
    if (window.MotionHasOptimisedAnimation(appearId, "transform")) {
      const { layout: layout2, layoutId } = projectionNode.options;
      window.MotionCancelOptimisedAnimation(appearId, "transform", frame, !(layout2 || layoutId));
    }
    const { parent } = projectionNode;
    if (parent && !parent.hasCheckedOptimisedAppear) {
      cancelTreeOptimisedTransformAnimations(parent);
    }
  }
  function createProjectionNode({ attachResizeListener, defaultParent, measureScroll, checkIsScrollRoot, resetTransform }) {
    return class ProjectionNode {
      constructor(latestValues = {}, parent = defaultParent?.()) {
        this.id = id++;
        this.animationId = 0;
        this.animationCommitId = 0;
        this.children = new Set();
        this.options = {};
        this.isTreeAnimating = false;
        this.isAnimationBlocked = false;
        this.isLayoutDirty = false;
        this.isProjectionDirty = false;
        this.isSharedProjectionDirty = false;
        this.isTransformDirty = false;
        this.updateManuallyBlocked = false;
        this.updateBlockedByResize = false;
        this.isUpdating = false;
        this.isSVG = false;
        this.needsReset = false;
        this.shouldResetTransform = false;
        this.hasCheckedOptimisedAppear = false;
        this.treeScale = { x: 1, y: 1 };
        this.eventHandlers = new Map();
        this.hasTreeAnimated = false;
        this.updateScheduled = false;
        this.scheduleUpdate = () => this.update();
        this.projectionUpdateScheduled = false;
        this.checkUpdateFailed = () => {
          if (this.isUpdating) {
            this.isUpdating = false;
            this.clearAllSnapshots();
          }
        };
        this.updateProjection = () => {
          this.projectionUpdateScheduled = false;
          this.nodes.forEach(propagateDirtyNodes);
          this.nodes.forEach(resolveTargetDelta);
          this.nodes.forEach(calcProjection);
          this.nodes.forEach(cleanDirtyNodes);
        };
        this.resolvedRelativeTargetAt = 0;
        this.hasProjected = false;
        this.isVisible = true;
        this.animationProgress = 0;
        this.sharedNodes = new Map();
        this.latestValues = latestValues;
        this.root = parent ? parent.root || parent : this;
        this.path = parent ? [...parent.path, parent] : [];
        this.parent = parent;
        this.depth = parent ? parent.depth + 1 : 0;
        for (let i2 = 0; i2 < this.path.length; i2++) {
          this.path[i2].shouldResetTransform = true;
        }
        if (this.root === this)
          this.nodes = new FlatTree();
      }
      addEventListener(name, handler) {
        if (!this.eventHandlers.has(name)) {
          this.eventHandlers.set(name, new SubscriptionManager());
        }
        return this.eventHandlers.get(name).add(handler);
      }
      notifyListeners(name, ...args) {
        const subscriptionManager = this.eventHandlers.get(name);
        subscriptionManager && subscriptionManager.notify(...args);
      }
      hasListeners(name) {
        return this.eventHandlers.has(name);
      }
mount(instance) {
        if (this.instance)
          return;
        this.isSVG = isSVGElement(instance) && !isSVGSVGElement(instance);
        this.instance = instance;
        const { layoutId, layout: layout2, visualElement } = this.options;
        if (visualElement && !visualElement.current) {
          visualElement.mount(instance);
        }
        this.root.nodes.add(this);
        this.parent && this.parent.children.add(this);
        if (this.root.hasTreeAnimated && (layout2 || layoutId)) {
          this.isLayoutDirty = true;
        }
        if (attachResizeListener) {
          let cancelDelay;
          let innerWidth2 = 0;
          const resizeUnblockUpdate = () => this.root.updateBlockedByResize = false;
          frame.read(() => {
            innerWidth2 = window.innerWidth;
          });
          attachResizeListener(instance, () => {
            const newInnerWidth = window.innerWidth;
            if (newInnerWidth === innerWidth2)
              return;
            innerWidth2 = newInnerWidth;
            this.root.updateBlockedByResize = true;
            cancelDelay && cancelDelay();
            cancelDelay = delay(resizeUnblockUpdate, 250);
            if (globalProjectionState.hasAnimatedSinceResize) {
              globalProjectionState.hasAnimatedSinceResize = false;
              this.nodes.forEach(finishAnimation);
            }
          });
        }
        if (layoutId) {
          this.root.registerSharedNode(layoutId, this);
        }
        if (this.options.animate !== false && visualElement && (layoutId || layout2)) {
          this.addEventListener("didUpdate", ({ delta, hasLayoutChanged, hasRelativeLayoutChanged, layout: newLayout }) => {
            if (this.isTreeAnimationBlocked()) {
              this.target = void 0;
              this.relativeTarget = void 0;
              return;
            }
            const layoutTransition = this.options.transition || visualElement.getDefaultTransition() || defaultLayoutTransition;
            const { onLayoutAnimationStart, onLayoutAnimationComplete } = visualElement.getProps();
            const hasTargetChanged = !this.targetLayout || !boxEqualsRounded(this.targetLayout, newLayout);
            const hasOnlyRelativeTargetChanged = !hasLayoutChanged && hasRelativeLayoutChanged;
            if (this.options.layoutRoot || this.resumeFrom || hasOnlyRelativeTargetChanged || hasLayoutChanged && (hasTargetChanged || !this.currentAnimation)) {
              if (this.resumeFrom) {
                this.resumingFrom = this.resumeFrom;
                this.resumingFrom.resumingFrom = void 0;
              }
              const animationOptions = {
                ...getValueTransition(layoutTransition, "layout"),
                onPlay: onLayoutAnimationStart,
                onComplete: onLayoutAnimationComplete
              };
              if (visualElement.shouldReduceMotion || this.options.layoutRoot) {
                animationOptions.delay = 0;
                animationOptions.type = false;
              }
              this.startAnimation(animationOptions);
              this.setAnimationOrigin(delta, hasOnlyRelativeTargetChanged);
            } else {
              if (!hasLayoutChanged) {
                finishAnimation(this);
              }
              if (this.isLead() && this.options.onExitComplete) {
                this.options.onExitComplete();
              }
            }
            this.targetLayout = newLayout;
          });
        }
      }
      unmount() {
        this.options.layoutId && this.willUpdate();
        this.root.nodes.remove(this);
        const stack = this.getStack();
        stack && stack.remove(this);
        this.parent && this.parent.children.delete(this);
        this.instance = void 0;
        this.eventHandlers.clear();
        cancelFrame(this.updateProjection);
      }
blockUpdate() {
        this.updateManuallyBlocked = true;
      }
      unblockUpdate() {
        this.updateManuallyBlocked = false;
      }
      isUpdateBlocked() {
        return this.updateManuallyBlocked || this.updateBlockedByResize;
      }
      isTreeAnimationBlocked() {
        return this.isAnimationBlocked || this.parent && this.parent.isTreeAnimationBlocked() || false;
      }
startUpdate() {
        if (this.isUpdateBlocked())
          return;
        this.isUpdating = true;
        this.nodes && this.nodes.forEach(resetSkewAndRotation);
        this.animationId++;
      }
      getTransformTemplate() {
        const { visualElement } = this.options;
        return visualElement && visualElement.getProps().transformTemplate;
      }
      willUpdate(shouldNotifyListeners = true) {
        this.root.hasTreeAnimated = true;
        if (this.root.isUpdateBlocked()) {
          this.options.onExitComplete && this.options.onExitComplete();
          return;
        }
        if (window.MotionCancelOptimisedAnimation && !this.hasCheckedOptimisedAppear) {
          cancelTreeOptimisedTransformAnimations(this);
        }
        !this.root.isUpdating && this.root.startUpdate();
        if (this.isLayoutDirty)
          return;
        this.isLayoutDirty = true;
        for (let i2 = 0; i2 < this.path.length; i2++) {
          const node = this.path[i2];
          node.shouldResetTransform = true;
          node.updateScroll("snapshot");
          if (node.options.layoutRoot) {
            node.willUpdate(false);
          }
        }
        const { layoutId, layout: layout2 } = this.options;
        if (layoutId === void 0 && !layout2)
          return;
        const transformTemplate = this.getTransformTemplate();
        this.prevTransformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
        this.updateSnapshot();
        shouldNotifyListeners && this.notifyListeners("willUpdate");
      }
      update() {
        this.updateScheduled = false;
        const updateWasBlocked = this.isUpdateBlocked();
        if (updateWasBlocked) {
          this.unblockUpdate();
          this.clearAllSnapshots();
          this.nodes.forEach(clearMeasurements);
          return;
        }
        if (this.animationId <= this.animationCommitId) {
          this.nodes.forEach(clearIsLayoutDirty);
          return;
        }
        this.animationCommitId = this.animationId;
        if (!this.isUpdating) {
          this.nodes.forEach(clearIsLayoutDirty);
        } else {
          this.isUpdating = false;
          this.nodes.forEach(resetTransformStyle);
          this.nodes.forEach(updateLayout);
          this.nodes.forEach(notifyLayoutUpdate);
        }
        this.clearAllSnapshots();
        const now2 = time.now();
        frameData.delta = clamp$1(0, 1e3 / 60, now2 - frameData.timestamp);
        frameData.timestamp = now2;
        frameData.isProcessing = true;
        frameSteps.update.process(frameData);
        frameSteps.preRender.process(frameData);
        frameSteps.render.process(frameData);
        frameData.isProcessing = false;
      }
      didUpdate() {
        if (!this.updateScheduled) {
          this.updateScheduled = true;
          microtask.read(this.scheduleUpdate);
        }
      }
      clearAllSnapshots() {
        this.nodes.forEach(clearSnapshot);
        this.sharedNodes.forEach(removeLeadSnapshots);
      }
      scheduleUpdateProjection() {
        if (!this.projectionUpdateScheduled) {
          this.projectionUpdateScheduled = true;
          frame.preRender(this.updateProjection, false, true);
        }
      }
      scheduleCheckAfterUnmount() {
        frame.postRender(() => {
          if (this.isLayoutDirty) {
            this.root.didUpdate();
          } else {
            this.root.checkUpdateFailed();
          }
        });
      }
updateSnapshot() {
        if (this.snapshot || !this.instance)
          return;
        this.snapshot = this.measure();
        if (this.snapshot && !calcLength(this.snapshot.measuredBox.x) && !calcLength(this.snapshot.measuredBox.y)) {
          this.snapshot = void 0;
        }
      }
      updateLayout() {
        if (!this.instance)
          return;
        this.updateScroll();
        if (!(this.options.alwaysMeasureLayout && this.isLead()) && !this.isLayoutDirty) {
          return;
        }
        if (this.resumeFrom && !this.resumeFrom.instance) {
          for (let i2 = 0; i2 < this.path.length; i2++) {
            const node = this.path[i2];
            node.updateScroll();
          }
        }
        const prevLayout = this.layout;
        this.layout = this.measure(false);
        this.layoutCorrected = createBox();
        this.isLayoutDirty = false;
        this.projectionDelta = void 0;
        this.notifyListeners("measure", this.layout.layoutBox);
        const { visualElement } = this.options;
        visualElement && visualElement.notify("LayoutMeasure", this.layout.layoutBox, prevLayout ? prevLayout.layoutBox : void 0);
      }
      updateScroll(phase = "measure") {
        let needsMeasurement = Boolean(this.options.layoutScroll && this.instance);
        if (this.scroll && this.scroll.animationId === this.root.animationId && this.scroll.phase === phase) {
          needsMeasurement = false;
        }
        if (needsMeasurement && this.instance) {
          const isRoot = checkIsScrollRoot(this.instance);
          this.scroll = {
            animationId: this.root.animationId,
            phase,
            isRoot,
            offset: measureScroll(this.instance),
            wasRoot: this.scroll ? this.scroll.isRoot : isRoot
          };
        }
      }
      resetTransform() {
        if (!resetTransform)
          return;
        const isResetRequested = this.isLayoutDirty || this.shouldResetTransform || this.options.alwaysMeasureLayout;
        const hasProjection = this.projectionDelta && !isDeltaZero(this.projectionDelta);
        const transformTemplate = this.getTransformTemplate();
        const transformTemplateValue = transformTemplate ? transformTemplate(this.latestValues, "") : void 0;
        const transformTemplateHasChanged = transformTemplateValue !== this.prevTransformTemplateValue;
        if (isResetRequested && this.instance && (hasProjection || hasTransform(this.latestValues) || transformTemplateHasChanged)) {
          resetTransform(this.instance, transformTemplateValue);
          this.shouldResetTransform = false;
          this.scheduleRender();
        }
      }
      measure(removeTransform = true) {
        const pageBox = this.measurePageBox();
        let layoutBox = this.removeElementScroll(pageBox);
        if (removeTransform) {
          layoutBox = this.removeTransform(layoutBox);
        }
        roundBox(layoutBox);
        return {
          animationId: this.root.animationId,
          measuredBox: pageBox,
          layoutBox,
          latestValues: {},
          source: this.id
        };
      }
      measurePageBox() {
        const { visualElement } = this.options;
        if (!visualElement)
          return createBox();
        const box = visualElement.measureViewportBox();
        const wasInScrollRoot = this.scroll?.wasRoot || this.path.some(checkNodeWasScrollRoot);
        if (!wasInScrollRoot) {
          const { scroll } = this.root;
          if (scroll) {
            translateAxis(box.x, scroll.offset.x);
            translateAxis(box.y, scroll.offset.y);
          }
        }
        return box;
      }
      removeElementScroll(box) {
        const boxWithoutScroll = createBox();
        copyBoxInto(boxWithoutScroll, box);
        if (this.scroll?.wasRoot) {
          return boxWithoutScroll;
        }
        for (let i2 = 0; i2 < this.path.length; i2++) {
          const node = this.path[i2];
          const { scroll, options } = node;
          if (node !== this.root && scroll && options.layoutScroll) {
            if (scroll.wasRoot) {
              copyBoxInto(boxWithoutScroll, box);
            }
            translateAxis(boxWithoutScroll.x, scroll.offset.x);
            translateAxis(boxWithoutScroll.y, scroll.offset.y);
          }
        }
        return boxWithoutScroll;
      }
      applyTransform(box, transformOnly = false) {
        const withTransforms = createBox();
        copyBoxInto(withTransforms, box);
        for (let i2 = 0; i2 < this.path.length; i2++) {
          const node = this.path[i2];
          if (!transformOnly && node.options.layoutScroll && node.scroll && node !== node.root) {
            transformBox(withTransforms, {
              x: -node.scroll.offset.x,
              y: -node.scroll.offset.y
            });
          }
          if (!hasTransform(node.latestValues))
            continue;
          transformBox(withTransforms, node.latestValues);
        }
        if (hasTransform(this.latestValues)) {
          transformBox(withTransforms, this.latestValues);
        }
        return withTransforms;
      }
      removeTransform(box) {
        const boxWithoutTransform = createBox();
        copyBoxInto(boxWithoutTransform, box);
        for (let i2 = 0; i2 < this.path.length; i2++) {
          const node = this.path[i2];
          if (!node.instance)
            continue;
          if (!hasTransform(node.latestValues))
            continue;
          hasScale(node.latestValues) && node.updateSnapshot();
          const sourceBox = createBox();
          const nodeBox = node.measurePageBox();
          copyBoxInto(sourceBox, nodeBox);
          removeBoxTransforms(boxWithoutTransform, node.latestValues, node.snapshot ? node.snapshot.layoutBox : void 0, sourceBox);
        }
        if (hasTransform(this.latestValues)) {
          removeBoxTransforms(boxWithoutTransform, this.latestValues);
        }
        return boxWithoutTransform;
      }
      setTargetDelta(delta) {
        this.targetDelta = delta;
        this.root.scheduleUpdateProjection();
        this.isProjectionDirty = true;
      }
      setOptions(options) {
        this.options = {
          ...this.options,
          ...options,
          crossfade: options.crossfade !== void 0 ? options.crossfade : true
        };
      }
      clearMeasurements() {
        this.scroll = void 0;
        this.layout = void 0;
        this.snapshot = void 0;
        this.prevTransformTemplateValue = void 0;
        this.targetDelta = void 0;
        this.target = void 0;
        this.isLayoutDirty = false;
      }
      forceRelativeParentToResolveTarget() {
        if (!this.relativeParent)
          return;
        if (this.relativeParent.resolvedRelativeTargetAt !== frameData.timestamp) {
          this.relativeParent.resolveTargetDelta(true);
        }
      }
      resolveTargetDelta(forceRecalculation = false) {
        const lead = this.getLead();
        this.isProjectionDirty || (this.isProjectionDirty = lead.isProjectionDirty);
        this.isTransformDirty || (this.isTransformDirty = lead.isTransformDirty);
        this.isSharedProjectionDirty || (this.isSharedProjectionDirty = lead.isSharedProjectionDirty);
        const isShared = Boolean(this.resumingFrom) || this !== lead;
        const canSkip = !(forceRecalculation || isShared && this.isSharedProjectionDirty || this.isProjectionDirty || this.parent?.isProjectionDirty || this.attemptToResolveRelativeTarget || this.root.updateBlockedByResize);
        if (canSkip)
          return;
        const { layout: layout2, layoutId } = this.options;
        if (!this.layout || !(layout2 || layoutId))
          return;
        this.resolvedRelativeTargetAt = frameData.timestamp;
        if (!this.targetDelta && !this.relativeTarget) {
          const relativeParent = this.getClosestProjectingParent();
          if (relativeParent && relativeParent.layout && this.animationProgress !== 1) {
            this.relativeParent = relativeParent;
            this.forceRelativeParentToResolveTarget();
            this.relativeTarget = createBox();
            this.relativeTargetOrigin = createBox();
            calcRelativePosition(this.relativeTargetOrigin, this.layout.layoutBox, relativeParent.layout.layoutBox);
            copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
          } else {
            this.relativeParent = this.relativeTarget = void 0;
          }
        }
        if (!this.relativeTarget && !this.targetDelta)
          return;
        if (!this.target) {
          this.target = createBox();
          this.targetWithTransforms = createBox();
        }
        if (this.relativeTarget && this.relativeTargetOrigin && this.relativeParent && this.relativeParent.target) {
          this.forceRelativeParentToResolveTarget();
          calcRelativeBox(this.target, this.relativeTarget, this.relativeParent.target);
        } else if (this.targetDelta) {
          if (Boolean(this.resumingFrom)) {
            this.target = this.applyTransform(this.layout.layoutBox);
          } else {
            copyBoxInto(this.target, this.layout.layoutBox);
          }
          applyBoxDelta(this.target, this.targetDelta);
        } else {
          copyBoxInto(this.target, this.layout.layoutBox);
        }
        if (this.attemptToResolveRelativeTarget) {
          this.attemptToResolveRelativeTarget = false;
          const relativeParent = this.getClosestProjectingParent();
          if (relativeParent && Boolean(relativeParent.resumingFrom) === Boolean(this.resumingFrom) && !relativeParent.options.layoutScroll && relativeParent.target && this.animationProgress !== 1) {
            this.relativeParent = relativeParent;
            this.forceRelativeParentToResolveTarget();
            this.relativeTarget = createBox();
            this.relativeTargetOrigin = createBox();
            calcRelativePosition(this.relativeTargetOrigin, this.target, relativeParent.target);
            copyBoxInto(this.relativeTarget, this.relativeTargetOrigin);
          } else {
            this.relativeParent = this.relativeTarget = void 0;
          }
        }
      }
      getClosestProjectingParent() {
        if (!this.parent || hasScale(this.parent.latestValues) || has2DTranslate(this.parent.latestValues)) {
          return void 0;
        }
        if (this.parent.isProjecting()) {
          return this.parent;
        } else {
          return this.parent.getClosestProjectingParent();
        }
      }
      isProjecting() {
        return Boolean((this.relativeTarget || this.targetDelta || this.options.layoutRoot) && this.layout);
      }
      calcProjection() {
        const lead = this.getLead();
        const isShared = Boolean(this.resumingFrom) || this !== lead;
        let canSkip = true;
        if (this.isProjectionDirty || this.parent?.isProjectionDirty) {
          canSkip = false;
        }
        if (isShared && (this.isSharedProjectionDirty || this.isTransformDirty)) {
          canSkip = false;
        }
        if (this.resolvedRelativeTargetAt === frameData.timestamp) {
          canSkip = false;
        }
        if (canSkip)
          return;
        const { layout: layout2, layoutId } = this.options;
        this.isTreeAnimating = Boolean(this.parent && this.parent.isTreeAnimating || this.currentAnimation || this.pendingAnimation);
        if (!this.isTreeAnimating) {
          this.targetDelta = this.relativeTarget = void 0;
        }
        if (!this.layout || !(layout2 || layoutId))
          return;
        copyBoxInto(this.layoutCorrected, this.layout.layoutBox);
        const prevTreeScaleX = this.treeScale.x;
        const prevTreeScaleY = this.treeScale.y;
        applyTreeDeltas(this.layoutCorrected, this.treeScale, this.path, isShared);
        if (lead.layout && !lead.target && (this.treeScale.x !== 1 || this.treeScale.y !== 1)) {
          lead.target = lead.layout.layoutBox;
          lead.targetWithTransforms = createBox();
        }
        const { target } = lead;
        if (!target) {
          if (this.prevProjectionDelta) {
            this.createProjectionDeltas();
            this.scheduleRender();
          }
          return;
        }
        if (!this.projectionDelta || !this.prevProjectionDelta) {
          this.createProjectionDeltas();
        } else {
          copyAxisDeltaInto(this.prevProjectionDelta.x, this.projectionDelta.x);
          copyAxisDeltaInto(this.prevProjectionDelta.y, this.projectionDelta.y);
        }
        calcBoxDelta(this.projectionDelta, this.layoutCorrected, target, this.latestValues);
        if (this.treeScale.x !== prevTreeScaleX || this.treeScale.y !== prevTreeScaleY || !axisDeltaEquals(this.projectionDelta.x, this.prevProjectionDelta.x) || !axisDeltaEquals(this.projectionDelta.y, this.prevProjectionDelta.y)) {
          this.hasProjected = true;
          this.scheduleRender();
          this.notifyListeners("projectionUpdate", target);
        }
      }
      hide() {
        this.isVisible = false;
      }
      show() {
        this.isVisible = true;
      }
      scheduleRender(notifyAll = true) {
        this.options.visualElement?.scheduleRender();
        if (notifyAll) {
          const stack = this.getStack();
          stack && stack.scheduleRender();
        }
        if (this.resumingFrom && !this.resumingFrom.instance) {
          this.resumingFrom = void 0;
        }
      }
      createProjectionDeltas() {
        this.prevProjectionDelta = createDelta();
        this.projectionDelta = createDelta();
        this.projectionDeltaWithTransform = createDelta();
      }
      setAnimationOrigin(delta, hasOnlyRelativeTargetChanged = false) {
        const snapshot = this.snapshot;
        const snapshotLatestValues = snapshot ? snapshot.latestValues : {};
        const mixedValues = { ...this.latestValues };
        const targetDelta = createDelta();
        if (!this.relativeParent || !this.relativeParent.options.layoutRoot) {
          this.relativeTarget = this.relativeTargetOrigin = void 0;
        }
        this.attemptToResolveRelativeTarget = !hasOnlyRelativeTargetChanged;
        const relativeLayout = createBox();
        const snapshotSource = snapshot ? snapshot.source : void 0;
        const layoutSource = this.layout ? this.layout.source : void 0;
        const isSharedLayoutAnimation = snapshotSource !== layoutSource;
        const stack = this.getStack();
        const isOnlyMember = !stack || stack.members.length <= 1;
        const shouldCrossfadeOpacity = Boolean(isSharedLayoutAnimation && !isOnlyMember && this.options.crossfade === true && !this.path.some(hasOpacityCrossfade));
        this.animationProgress = 0;
        let prevRelativeTarget;
        this.mixTargetDelta = (latest) => {
          const progress2 = latest / 1e3;
          mixAxisDelta(targetDelta.x, delta.x, progress2);
          mixAxisDelta(targetDelta.y, delta.y, progress2);
          this.setTargetDelta(targetDelta);
          if (this.relativeTarget && this.relativeTargetOrigin && this.layout && this.relativeParent && this.relativeParent.layout) {
            calcRelativePosition(relativeLayout, this.layout.layoutBox, this.relativeParent.layout.layoutBox);
            mixBox(this.relativeTarget, this.relativeTargetOrigin, relativeLayout, progress2);
            if (prevRelativeTarget && boxEquals(this.relativeTarget, prevRelativeTarget)) {
              this.isProjectionDirty = false;
            }
            if (!prevRelativeTarget)
              prevRelativeTarget = createBox();
            copyBoxInto(prevRelativeTarget, this.relativeTarget);
          }
          if (isSharedLayoutAnimation) {
            this.animationValues = mixedValues;
            mixValues(mixedValues, snapshotLatestValues, this.latestValues, progress2, shouldCrossfadeOpacity, isOnlyMember);
          }
          this.root.scheduleUpdateProjection();
          this.scheduleRender();
          this.animationProgress = progress2;
        };
        this.mixTargetDelta(this.options.layoutRoot ? 1e3 : 0);
      }
      startAnimation(options) {
        this.notifyListeners("animationStart");
        this.currentAnimation?.stop();
        this.resumingFrom?.currentAnimation?.stop();
        if (this.pendingAnimation) {
          cancelFrame(this.pendingAnimation);
          this.pendingAnimation = void 0;
        }
        this.pendingAnimation = frame.update(() => {
          globalProjectionState.hasAnimatedSinceResize = true;
          this.motionValue || (this.motionValue = motionValue(0));
          this.currentAnimation = animateSingleValue(this.motionValue, [0, 1e3], {
            ...options,
            velocity: 0,
            isSync: true,
            onUpdate: (latest) => {
              this.mixTargetDelta(latest);
              options.onUpdate && options.onUpdate(latest);
            },
            onStop: () => {
            },
            onComplete: () => {
              options.onComplete && options.onComplete();
              this.completeAnimation();
            }
          });
          if (this.resumingFrom) {
            this.resumingFrom.currentAnimation = this.currentAnimation;
          }
          this.pendingAnimation = void 0;
        });
      }
      completeAnimation() {
        if (this.resumingFrom) {
          this.resumingFrom.currentAnimation = void 0;
          this.resumingFrom.preserveOpacity = void 0;
        }
        const stack = this.getStack();
        stack && stack.exitAnimationComplete();
        this.resumingFrom = this.currentAnimation = this.animationValues = void 0;
        this.notifyListeners("animationComplete");
      }
      finishAnimation() {
        if (this.currentAnimation) {
          this.mixTargetDelta && this.mixTargetDelta(animationTarget);
          this.currentAnimation.stop();
        }
        this.completeAnimation();
      }
      applyTransformsToTarget() {
        const lead = this.getLead();
        let { targetWithTransforms, target, layout: layout2, latestValues } = lead;
        if (!targetWithTransforms || !target || !layout2)
          return;
        if (this !== lead && this.layout && layout2 && shouldAnimatePositionOnly(this.options.animationType, this.layout.layoutBox, layout2.layoutBox)) {
          target = this.target || createBox();
          const xLength = calcLength(this.layout.layoutBox.x);
          target.x.min = lead.target.x.min;
          target.x.max = target.x.min + xLength;
          const yLength = calcLength(this.layout.layoutBox.y);
          target.y.min = lead.target.y.min;
          target.y.max = target.y.min + yLength;
        }
        copyBoxInto(targetWithTransforms, target);
        transformBox(targetWithTransforms, latestValues);
        calcBoxDelta(this.projectionDeltaWithTransform, this.layoutCorrected, targetWithTransforms, latestValues);
      }
      registerSharedNode(layoutId, node) {
        if (!this.sharedNodes.has(layoutId)) {
          this.sharedNodes.set(layoutId, new NodeStack());
        }
        const stack = this.sharedNodes.get(layoutId);
        stack.add(node);
        const config2 = node.options.initialPromotionConfig;
        node.promote({
          transition: config2 ? config2.transition : void 0,
          preserveFollowOpacity: config2 && config2.shouldPreserveFollowOpacity ? config2.shouldPreserveFollowOpacity(node) : void 0
        });
      }
      isLead() {
        const stack = this.getStack();
        return stack ? stack.lead === this : true;
      }
      getLead() {
        const { layoutId } = this.options;
        return layoutId ? this.getStack()?.lead || this : this;
      }
      getPrevLead() {
        const { layoutId } = this.options;
        return layoutId ? this.getStack()?.prevLead : void 0;
      }
      getStack() {
        const { layoutId } = this.options;
        if (layoutId)
          return this.root.sharedNodes.get(layoutId);
      }
      promote({ needsReset, transition, preserveFollowOpacity } = {}) {
        const stack = this.getStack();
        if (stack)
          stack.promote(this, preserveFollowOpacity);
        if (needsReset) {
          this.projectionDelta = void 0;
          this.needsReset = true;
        }
        if (transition)
          this.setOptions({ transition });
      }
      relegate() {
        const stack = this.getStack();
        if (stack) {
          return stack.relegate(this);
        } else {
          return false;
        }
      }
      resetSkewAndRotation() {
        const { visualElement } = this.options;
        if (!visualElement)
          return;
        let hasDistortingTransform = false;
        const { latestValues } = visualElement;
        if (latestValues.z || latestValues.rotate || latestValues.rotateX || latestValues.rotateY || latestValues.rotateZ || latestValues.skewX || latestValues.skewY) {
          hasDistortingTransform = true;
        }
        if (!hasDistortingTransform)
          return;
        const resetValues = {};
        if (latestValues.z) {
          resetDistortingTransform("z", visualElement, resetValues, this.animationValues);
        }
        for (let i2 = 0; i2 < transformAxes.length; i2++) {
          resetDistortingTransform(`rotate${transformAxes[i2]}`, visualElement, resetValues, this.animationValues);
          resetDistortingTransform(`skew${transformAxes[i2]}`, visualElement, resetValues, this.animationValues);
        }
        visualElement.render();
        for (const key in resetValues) {
          visualElement.setStaticValue(key, resetValues[key]);
          if (this.animationValues) {
            this.animationValues[key] = resetValues[key];
          }
        }
        visualElement.scheduleRender();
      }
      applyProjectionStyles(targetStyle, styleProp) {
        if (!this.instance || this.isSVG)
          return;
        if (!this.isVisible) {
          targetStyle.visibility = "hidden";
          return;
        }
        const transformTemplate = this.getTransformTemplate();
        if (this.needsReset) {
          this.needsReset = false;
          targetStyle.visibility = "";
          targetStyle.opacity = "";
          targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
          targetStyle.transform = transformTemplate ? transformTemplate(this.latestValues, "") : "none";
          return;
        }
        const lead = this.getLead();
        if (!this.projectionDelta || !this.layout || !lead.target) {
          if (this.options.layoutId) {
            targetStyle.opacity = this.latestValues.opacity !== void 0 ? this.latestValues.opacity : 1;
            targetStyle.pointerEvents = resolveMotionValue(styleProp?.pointerEvents) || "";
          }
          if (this.hasProjected && !hasTransform(this.latestValues)) {
            targetStyle.transform = transformTemplate ? transformTemplate({}, "") : "none";
            this.hasProjected = false;
          }
          return;
        }
        targetStyle.visibility = "";
        const valuesToRender = lead.animationValues || lead.latestValues;
        this.applyTransformsToTarget();
        let transform = buildProjectionTransform(this.projectionDeltaWithTransform, this.treeScale, valuesToRender);
        if (transformTemplate) {
          transform = transformTemplate(valuesToRender, transform);
        }
        targetStyle.transform = transform;
        const { x: x2, y } = this.projectionDelta;
        targetStyle.transformOrigin = `${x2.origin * 100}% ${y.origin * 100}% 0`;
        if (lead.animationValues) {
          targetStyle.opacity = lead === this ? valuesToRender.opacity ?? this.latestValues.opacity ?? 1 : this.preserveOpacity ? this.latestValues.opacity : valuesToRender.opacityExit;
        } else {
          targetStyle.opacity = lead === this ? valuesToRender.opacity !== void 0 ? valuesToRender.opacity : "" : valuesToRender.opacityExit !== void 0 ? valuesToRender.opacityExit : 0;
        }
        for (const key in scaleCorrectors) {
          if (valuesToRender[key] === void 0)
            continue;
          const { correct, applyTo, isCSSVariable } = scaleCorrectors[key];
          const corrected = transform === "none" ? valuesToRender[key] : correct(valuesToRender[key], lead);
          if (applyTo) {
            const num = applyTo.length;
            for (let i2 = 0; i2 < num; i2++) {
              targetStyle[applyTo[i2]] = corrected;
            }
          } else {
            if (isCSSVariable) {
              this.options.visualElement.renderState.vars[key] = corrected;
            } else {
              targetStyle[key] = corrected;
            }
          }
        }
        if (this.options.layoutId) {
          targetStyle.pointerEvents = lead === this ? resolveMotionValue(styleProp?.pointerEvents) || "" : "none";
        }
      }
      clearSnapshot() {
        this.resumeFrom = this.snapshot = void 0;
      }
resetTree() {
        this.root.nodes.forEach((node) => node.currentAnimation?.stop());
        this.root.nodes.forEach(clearMeasurements);
        this.root.sharedNodes.clear();
      }
    };
  }
  function updateLayout(node) {
    node.updateLayout();
  }
  function notifyLayoutUpdate(node) {
    const snapshot = node.resumeFrom?.snapshot || node.snapshot;
    if (node.isLead() && node.layout && snapshot && node.hasListeners("didUpdate")) {
      const { layoutBox: layout2, measuredBox: measuredLayout } = node.layout;
      const { animationType } = node.options;
      const isShared = snapshot.source !== node.layout.source;
      if (animationType === "size") {
        eachAxis((axis) => {
          const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
          const length = calcLength(axisSnapshot);
          axisSnapshot.min = layout2[axis].min;
          axisSnapshot.max = axisSnapshot.min + length;
        });
      } else if (shouldAnimatePositionOnly(animationType, snapshot.layoutBox, layout2)) {
        eachAxis((axis) => {
          const axisSnapshot = isShared ? snapshot.measuredBox[axis] : snapshot.layoutBox[axis];
          const length = calcLength(layout2[axis]);
          axisSnapshot.max = axisSnapshot.min + length;
          if (node.relativeTarget && !node.currentAnimation) {
            node.isProjectionDirty = true;
            node.relativeTarget[axis].max = node.relativeTarget[axis].min + length;
          }
        });
      }
      const layoutDelta = createDelta();
      calcBoxDelta(layoutDelta, layout2, snapshot.layoutBox);
      const visualDelta = createDelta();
      if (isShared) {
        calcBoxDelta(visualDelta, node.applyTransform(measuredLayout, true), snapshot.measuredBox);
      } else {
        calcBoxDelta(visualDelta, layout2, snapshot.layoutBox);
      }
      const hasLayoutChanged = !isDeltaZero(layoutDelta);
      let hasRelativeLayoutChanged = false;
      if (!node.resumeFrom) {
        const relativeParent = node.getClosestProjectingParent();
        if (relativeParent && !relativeParent.resumeFrom) {
          const { snapshot: parentSnapshot, layout: parentLayout } = relativeParent;
          if (parentSnapshot && parentLayout) {
            const relativeSnapshot = createBox();
            calcRelativePosition(relativeSnapshot, snapshot.layoutBox, parentSnapshot.layoutBox);
            const relativeLayout = createBox();
            calcRelativePosition(relativeLayout, layout2, parentLayout.layoutBox);
            if (!boxEqualsRounded(relativeSnapshot, relativeLayout)) {
              hasRelativeLayoutChanged = true;
            }
            if (relativeParent.options.layoutRoot) {
              node.relativeTarget = relativeLayout;
              node.relativeTargetOrigin = relativeSnapshot;
              node.relativeParent = relativeParent;
            }
          }
        }
      }
      node.notifyListeners("didUpdate", {
        layout: layout2,
        snapshot,
        delta: visualDelta,
        layoutDelta,
        hasLayoutChanged,
        hasRelativeLayoutChanged
      });
    } else if (node.isLead()) {
      const { onExitComplete } = node.options;
      onExitComplete && onExitComplete();
    }
    node.options.transition = void 0;
  }
  function propagateDirtyNodes(node) {
    if (!node.parent)
      return;
    if (!node.isProjecting()) {
      node.isProjectionDirty = node.parent.isProjectionDirty;
    }
    node.isSharedProjectionDirty || (node.isSharedProjectionDirty = Boolean(node.isProjectionDirty || node.parent.isProjectionDirty || node.parent.isSharedProjectionDirty));
    node.isTransformDirty || (node.isTransformDirty = node.parent.isTransformDirty);
  }
  function cleanDirtyNodes(node) {
    node.isProjectionDirty = node.isSharedProjectionDirty = node.isTransformDirty = false;
  }
  function clearSnapshot(node) {
    node.clearSnapshot();
  }
  function clearMeasurements(node) {
    node.clearMeasurements();
  }
  function clearIsLayoutDirty(node) {
    node.isLayoutDirty = false;
  }
  function resetTransformStyle(node) {
    const { visualElement } = node.options;
    if (visualElement && visualElement.getProps().onBeforeLayoutMeasure) {
      visualElement.notify("BeforeLayoutMeasure");
    }
    node.resetTransform();
  }
  function finishAnimation(node) {
    node.finishAnimation();
    node.targetDelta = node.relativeTarget = node.target = void 0;
    node.isProjectionDirty = true;
  }
  function resolveTargetDelta(node) {
    node.resolveTargetDelta();
  }
  function calcProjection(node) {
    node.calcProjection();
  }
  function resetSkewAndRotation(node) {
    node.resetSkewAndRotation();
  }
  function removeLeadSnapshots(stack) {
    stack.removeLeadSnapshot();
  }
  function mixAxisDelta(output, delta, p) {
    output.translate = mixNumber$1(delta.translate, 0, p);
    output.scale = mixNumber$1(delta.scale, 1, p);
    output.origin = delta.origin;
    output.originPoint = delta.originPoint;
  }
  function mixAxis(output, from, to, p) {
    output.min = mixNumber$1(from.min, to.min, p);
    output.max = mixNumber$1(from.max, to.max, p);
  }
  function mixBox(output, from, to, p) {
    mixAxis(output.x, from.x, to.x, p);
    mixAxis(output.y, from.y, to.y, p);
  }
  function hasOpacityCrossfade(node) {
    return node.animationValues && node.animationValues.opacityExit !== void 0;
  }
  const defaultLayoutTransition = {
    duration: 0.45,
    ease: [0.4, 0, 0.1, 1]
  };
  const userAgentContains = (string2) => typeof navigator !== "undefined" && navigator.userAgent && navigator.userAgent.toLowerCase().includes(string2);
  const roundPoint = userAgentContains("applewebkit/") && !userAgentContains("chrome/") ? Math.round : noop$1;
  function roundAxis(axis) {
    axis.min = roundPoint(axis.min);
    axis.max = roundPoint(axis.max);
  }
  function roundBox(box) {
    roundAxis(box.x);
    roundAxis(box.y);
  }
  function shouldAnimatePositionOnly(animationType, snapshot, layout2) {
    return animationType === "position" || animationType === "preserve-aspect" && !isNear(aspectRatio(snapshot), aspectRatio(layout2), 0.2);
  }
  function checkNodeWasScrollRoot(node) {
    return node !== node.root && node.scroll?.wasRoot;
  }
  const DocumentProjectionNode = createProjectionNode({
    attachResizeListener: (ref, notify) => addDomEvent(ref, "resize", notify),
    measureScroll: () => ({
      x: document.documentElement.scrollLeft || document.body.scrollLeft,
      y: document.documentElement.scrollTop || document.body.scrollTop
    }),
    checkIsScrollRoot: () => true
  });
  const rootProjectionNode = {
    current: void 0
  };
  const HTMLProjectionNode = createProjectionNode({
    measureScroll: (instance) => ({
      x: instance.scrollLeft,
      y: instance.scrollTop
    }),
    defaultParent: () => {
      if (!rootProjectionNode.current) {
        const documentNode = new DocumentProjectionNode({});
        documentNode.mount(window);
        documentNode.setOptions({ layoutScroll: true });
        rootProjectionNode.current = documentNode;
      }
      return rootProjectionNode.current;
    },
    resetTransform: (instance, value) => {
      instance.style.transform = value !== void 0 ? value : "none";
    },
    checkIsScrollRoot: (instance) => Boolean(window.getComputedStyle(instance).position === "fixed")
  });
  const drag = {
    pan: {
      Feature: PanGesture
    },
    drag: {
      Feature: DragGesture,
      ProjectionNode: HTMLProjectionNode,
      MeasureLayout
    }
  };
  function handleHoverEvent(node, event, lifecycle) {
    const { props } = node;
    if (node.animationState && props.whileHover) {
      node.animationState.setActive("whileHover", lifecycle === "Start");
    }
    const eventName = "onHover" + lifecycle;
    const callback = props[eventName];
    if (callback) {
      frame.postRender(() => callback(event, extractEventInfo(event)));
    }
  }
  class HoverGesture extends Feature {
    mount() {
      const { current } = this.node;
      if (!current)
        return;
      this.unmount = hover(current, (_element, startEvent) => {
        handleHoverEvent(this.node, startEvent, "Start");
        return (endEvent) => handleHoverEvent(this.node, endEvent, "End");
      });
    }
    unmount() {
    }
  }
  class FocusGesture extends Feature {
    constructor() {
      super(...arguments);
      this.isActive = false;
    }
    onFocus() {
      let isFocusVisible = false;
      try {
        isFocusVisible = this.node.current.matches(":focus-visible");
      } catch (e) {
        isFocusVisible = true;
      }
      if (!isFocusVisible || !this.node.animationState)
        return;
      this.node.animationState.setActive("whileFocus", true);
      this.isActive = true;
    }
    onBlur() {
      if (!this.isActive || !this.node.animationState)
        return;
      this.node.animationState.setActive("whileFocus", false);
      this.isActive = false;
    }
    mount() {
      this.unmount = pipe(addDomEvent(this.node.current, "focus", () => this.onFocus()), addDomEvent(this.node.current, "blur", () => this.onBlur()));
    }
    unmount() {
    }
  }
  function handlePressEvent(node, event, lifecycle) {
    const { props } = node;
    if (node.current instanceof HTMLButtonElement && node.current.disabled) {
      return;
    }
    if (node.animationState && props.whileTap) {
      node.animationState.setActive("whileTap", lifecycle === "Start");
    }
    const eventName = "onTap" + (lifecycle === "End" ? "" : lifecycle);
    const callback = props[eventName];
    if (callback) {
      frame.postRender(() => callback(event, extractEventInfo(event)));
    }
  }
  class PressGesture extends Feature {
    mount() {
      const { current } = this.node;
      if (!current)
        return;
      this.unmount = press(current, (_element, startEvent) => {
        handlePressEvent(this.node, startEvent, "Start");
        return (endEvent, { success }) => handlePressEvent(this.node, endEvent, success ? "End" : "Cancel");
      }, { useGlobalTarget: this.node.props.globalTapTarget });
    }
    unmount() {
    }
  }
  const observerCallbacks = new WeakMap();
  const observers = new WeakMap();
  const fireObserverCallback = (entry) => {
    const callback = observerCallbacks.get(entry.target);
    callback && callback(entry);
  };
  const fireAllObserverCallbacks = (entries) => {
    entries.forEach(fireObserverCallback);
  };
  function initIntersectionObserver({ root, ...options }) {
    const lookupRoot = root || document;
    if (!observers.has(lookupRoot)) {
      observers.set(lookupRoot, {});
    }
    const rootObservers = observers.get(lookupRoot);
    const key = JSON.stringify(options);
    if (!rootObservers[key]) {
      rootObservers[key] = new IntersectionObserver(fireAllObserverCallbacks, { root, ...options });
    }
    return rootObservers[key];
  }
  function observeIntersection(element, options, callback) {
    const rootInteresectionObserver = initIntersectionObserver(options);
    observerCallbacks.set(element, callback);
    rootInteresectionObserver.observe(element);
    return () => {
      observerCallbacks.delete(element);
      rootInteresectionObserver.unobserve(element);
    };
  }
  const thresholdNames = {
    some: 0,
    all: 1
  };
  class InViewFeature extends Feature {
    constructor() {
      super(...arguments);
      this.hasEnteredView = false;
      this.isInView = false;
    }
    startObserver() {
      this.unmount();
      const { viewport = {} } = this.node.getProps();
      const { root, margin: rootMargin, amount = "some", once } = viewport;
      const options = {
        root: root ? root.current : void 0,
        rootMargin,
        threshold: typeof amount === "number" ? amount : thresholdNames[amount]
      };
      const onIntersectionUpdate = (entry) => {
        const { isIntersecting } = entry;
        if (this.isInView === isIntersecting)
          return;
        this.isInView = isIntersecting;
        if (once && !isIntersecting && this.hasEnteredView) {
          return;
        } else if (isIntersecting) {
          this.hasEnteredView = true;
        }
        if (this.node.animationState) {
          this.node.animationState.setActive("whileInView", isIntersecting);
        }
        const { onViewportEnter, onViewportLeave } = this.node.getProps();
        const callback = isIntersecting ? onViewportEnter : onViewportLeave;
        callback && callback(entry);
      };
      return observeIntersection(this.node.current, options, onIntersectionUpdate);
    }
    mount() {
      this.startObserver();
    }
    update() {
      if (typeof IntersectionObserver === "undefined")
        return;
      const { props, prevProps } = this.node;
      const hasOptionsChanged = ["amount", "margin", "root"].some(hasViewportOptionChanged(props, prevProps));
      if (hasOptionsChanged) {
        this.startObserver();
      }
    }
    unmount() {
    }
  }
  function hasViewportOptionChanged({ viewport = {} }, { viewport: prevViewport = {} } = {}) {
    return (name) => viewport[name] !== prevViewport[name];
  }
  const gestureAnimations = {
    inView: {
      Feature: InViewFeature
    },
    tap: {
      Feature: PressGesture
    },
    focus: {
      Feature: FocusGesture
    },
    hover: {
      Feature: HoverGesture
    }
  };
  const layout = {
    layout: {
      ProjectionNode: HTMLProjectionNode,
      MeasureLayout
    }
  };
  const featureBundle = {
    ...animations,
    ...gestureAnimations,
    ...drag,
    ...layout
  };
  const motion = createMotionProxy(featureBundle, createDomVisualElement);
  function ZoomableImage({
    className,
    ...props
  }) {
    if (!props.src) return jsxRuntimeExports.jsx("img", { ...props, className });
    const [isOpen, setIsOpen] = React.useState(false);
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(
        "img",
        {
          ...props,
          onClick: (e) => {
            setIsOpen(true);
            props.onClick?.(e);
          },
          className: cn$1("cursor-pointer", className)
        }
      ),
jsxRuntimeExports.jsx(AnimatePresence, { children: isOpen && jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "fixed inset-0 bg-black/70 flex items-center justify-center z-50",
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
          onClick: () => setIsOpen(false),
          children: jsxRuntimeExports.jsx(
            "img",
            {
              ...props,
              className: "object-contain max-h-4/5 max-w-4/5"
            }
          )
        }
      ) })
    ] });
  }
  function Image$1(props) {
    const {
      loadingPlaceholder: loadingPlaceholder2 = jsxRuntimeExports.jsx(LoadingIcon, { className: "size-8" }),
      errorFallback: errorFallback2 = jsxRuntimeExports.jsx(SvgImageError, { className: "size-8" }),
      zoomable = false,
      className,
      onLoad,
      onError,
      ...rest
    } = props;
    const [loading, setLoading] = React.useState(true);
    const [error2, setError] = React.useState(false);
    const handleLoad = (e) => {
      setLoading(false);
      onLoad?.(e);
    };
    const handleError = (e) => {
      setLoading(false);
      setError(true);
      onError?.(e);
    };
    if (error2) {
      return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: errorFallback2 });
    }
    return jsxRuntimeExports.jsxs("div", { className: "relative inline", children: [
      loading && jsxRuntimeExports.jsx("div", { className: "absolute inset-0 flex items-center justify-center", children: loadingPlaceholder2 }),
      zoomable ? jsxRuntimeExports.jsx(
        ZoomableImage,
        {
          ...rest,
          className: `${loading ? "invisible" : "visible"} ${className ?? ""}`,
          onLoad: handleLoad,
          onError: handleError
        }
      ) : jsxRuntimeExports.jsx(
        "img",
        {
          ...rest,
          className: `${loading ? "invisible" : "visible"} ${className ?? ""}`,
          onLoad: handleLoad,
          onError: handleError
        }
      )
    ] });
  }
  function ImageInMessage(props) {
    const { imgKey, isEmoji = false, onImageDone } = props;
    const { url, isError, promiseRef } = useImageUrl(imgKey);
    const handleDone = () => {
      promiseRef.current && onImageDone?.(promiseRef.current);
    };
    React.useEffect(() => {
      if (isError) {
        promiseRef.current && onImageDone?.(promiseRef.current);
      }
    }, [isError]);
    const loadingPlaceholder2 = jsxRuntimeExports.jsx(LoadingIcon, { className: "size-8" });
    const errorFallback2 = jsxRuntimeExports.jsx(SvgImageError, { className: "w-20 h-40 text-black/40" });
    if (isError) return `[${imgKey}]`;
    if (isEmoji)
      return jsxRuntimeExports.jsx(
        Image$1,
        {
          src: url,
          className: "w-8 inline-block",
          onLoad: handleDone,
          onError: handleDone,
          alt: imgKey,
          loadingPlaceholder: loadingPlaceholder2,
          errorFallback: errorFallback2
        }
      );
    return jsxRuntimeExports.jsx("div", { className: "align-top p-1 rounded-lg bg-secondary w-40 inline-flex justify-center items-center", children: jsxRuntimeExports.jsx(
      Image$1,
      {
        src: url,
        className: "rounded-lg min-h-15",
        onLoad: handleDone,
        onError: handleDone,
        alt: imgKey,
        loadingPlaceholder: loadingPlaceholder2,
        errorFallback: errorFallback2,
        zoomable: true
      }
    ) });
  }
  function Message(props) {
    const { text, onImageDone } = props;
    const parts = parseMessage(text);
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: parts.map((part, index2) => {
      switch (part.type) {
        case "text":
          return part.text;
        case "link":
          return jsxRuntimeExports.jsx(
            "a",
            {
              href: part.url,
              target: "_blank",
              rel: "noopener noreferrer",
              className: "text-blue-600 hover:underline break-all",
              children: part.url
            },
            index2
          );
        case "emoji":
          return jsxRuntimeExports.jsx(
            ImageInMessage,
            {
              imgKey: part.key,
              isEmoji: true,
              onImageDone
            },
            index2
          );
        case "image":
          return jsxRuntimeExports.jsx(
            ImageInMessage,
            {
              imgKey: part.key,
              onImageDone
            },
            index2
          );
        default:
          return;
      }
    }) });
  }
  const falsyToString = (value) => typeof value === "boolean" ? `${value}` : value === 0 ? "0" : value;
  const cx = clsx.clsx;
  const cva = (base, config2) => (props) => {
    var _config_compoundVariants;
    if ((config2 === null || config2 === void 0 ? void 0 : config2.variants) == null) return cx(base, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
    const { variants, defaultVariants } = config2;
    const getVariantClassNames = Object.keys(variants).map((variant) => {
      const variantProp = props === null || props === void 0 ? void 0 : props[variant];
      const defaultVariantProp = defaultVariants === null || defaultVariants === void 0 ? void 0 : defaultVariants[variant];
      if (variantProp === null) return null;
      const variantKey = falsyToString(variantProp) || falsyToString(defaultVariantProp);
      return variants[variant][variantKey];
    });
    const propsWithoutUndefined = props && Object.entries(props).reduce((acc, param) => {
      let [key, value] = param;
      if (value === void 0) {
        return acc;
      }
      acc[key] = value;
      return acc;
    }, {});
    const getCompoundVariantClassNames = config2 === null || config2 === void 0 ? void 0 : (_config_compoundVariants = config2.compoundVariants) === null || _config_compoundVariants === void 0 ? void 0 : _config_compoundVariants.reduce((acc, param) => {
      let { class: cvClass, className: cvClassName, ...compoundVariantOptions } = param;
      return Object.entries(compoundVariantOptions).every((param2) => {
        let [key, value] = param2;
        return Array.isArray(value) ? value.includes({
          ...defaultVariants,
          ...propsWithoutUndefined
        }[key]) : {
          ...defaultVariants,
          ...propsWithoutUndefined
        }[key] === value;
      }) ? [
        ...acc,
        cvClass,
        cvClassName
      ] : acc;
    }, []);
    return cx(base, getVariantClassNames, getCompoundVariantClassNames, props === null || props === void 0 ? void 0 : props.class, props === null || props === void 0 ? void 0 : props.className);
  };
  const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
    {
      variants: {
        variant: {
          default: "bg-primary text-primary-foreground hover:bg-primary/90",
          destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
          outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
          secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
          ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
          link: "text-primary underline-offset-4 hover:underline"
        },
        size: {
          default: "h-9 px-4 py-2 has-[>svg]:px-3",
          sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
          lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
          icon: "size-9",
          "icon-sm": "size-8",
          "icon-lg": "size-10"
        }
      },
      defaultVariants: {
        variant: "default",
        size: "default"
      }
    }
  );
  function Button({
    className,
    variant,
    size: size2,
    asChild = false,
    ...props
  }) {
    const Comp = asChild ? Slot$3 : "button";
    return jsxRuntimeExports.jsx(
      Comp,
      {
        "data-slot": "button",
        className: cn$1(buttonVariants({ variant, size: size2, className })),
        ...props
      }
    );
  }
  const badgeVariants = cva(
    "inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden",
    {
      variants: {
        variant: {
          default: "border-transparent bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
          secondary: "border-transparent bg-secondary text-secondary-foreground [a&]:hover:bg-secondary/90",
          destructive: "border-transparent bg-destructive text-white [a&]:hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
          outline: "text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground"
        }
      },
      defaultVariants: {
        variant: "default"
      }
    }
  );
  function Badge({
    className,
    variant,
    asChild = false,
    ...props
  }) {
    const Comp = asChild ? Slot$3 : "span";
    return jsxRuntimeExports.jsx(
      Comp,
      {
        "data-slot": "badge",
        className: cn$1(badgeVariants({ variant }), className),
        ...props
      }
    );
  }
  var useInsertionEffect = React__namespace[" useInsertionEffect ".trim().toString()] || useLayoutEffect2;
  function useControllableState({
    prop,
    defaultProp,
    onChange = () => {
    },
    caller
  }) {
    const [uncontrolledProp, setUncontrolledProp, onChangeRef] = useUncontrolledState({
      defaultProp,
      onChange
    });
    const isControlled = prop !== void 0;
    const value = isControlled ? prop : uncontrolledProp;
    {
      const isControlledRef = React__namespace.useRef(prop !== void 0);
      React__namespace.useEffect(() => {
        const wasControlled = isControlledRef.current;
        if (wasControlled !== isControlled) {
          const from = wasControlled ? "controlled" : "uncontrolled";
          const to = isControlled ? "controlled" : "uncontrolled";
          console.warn(
            `${caller} is changing from ${from} to ${to}. Components should not switch from controlled to uncontrolled (or vice versa). Decide between using a controlled or uncontrolled value for the lifetime of the component.`
          );
        }
        isControlledRef.current = isControlled;
      }, [isControlled, caller]);
    }
    const setValue = React__namespace.useCallback(
      (nextValue) => {
        if (isControlled) {
          const value2 = isFunction(nextValue) ? nextValue(prop) : nextValue;
          if (value2 !== prop) {
            onChangeRef.current?.(value2);
          }
        } else {
          setUncontrolledProp(nextValue);
        }
      },
      [isControlled, prop, setUncontrolledProp, onChangeRef]
    );
    return [value, setValue];
  }
  function useUncontrolledState({
    defaultProp,
    onChange
  }) {
    const [value, setValue] = React__namespace.useState(defaultProp);
    const prevValueRef = React__namespace.useRef(value);
    const onChangeRef = React__namespace.useRef(onChange);
    useInsertionEffect(() => {
      onChangeRef.current = onChange;
    }, [onChange]);
    React__namespace.useEffect(() => {
      if (prevValueRef.current !== value) {
        onChangeRef.current?.(value);
        prevValueRef.current = value;
      }
    }, [value, prevValueRef]);
    return [value, setValue, onChangeRef];
  }
  function isFunction(value) {
    return typeof value === "function";
  }
  function createCollection(name) {
    const PROVIDER_NAME2 = name + "CollectionProvider";
    const [createCollectionContext, createCollectionScope2] = createContextScope(PROVIDER_NAME2);
    const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
      PROVIDER_NAME2,
      { collectionRef: { current: null }, itemMap: new Map() }
    );
    const CollectionProvider = (props) => {
      const { scope, children } = props;
      const ref = React.useRef(null);
      const itemMap = React.useRef( new Map()).current;
      return jsxRuntimeExports.jsx(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
    };
    CollectionProvider.displayName = PROVIDER_NAME2;
    const COLLECTION_SLOT_NAME = name + "CollectionSlot";
    const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
    const CollectionSlot = React.forwardRef(
      (props, forwardedRef) => {
        const { scope, children } = props;
        const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
        const composedRefs = useComposedRefs$1(forwardedRef, context.collectionRef);
        return jsxRuntimeExports.jsx(CollectionSlotImpl, { ref: composedRefs, children });
      }
    );
    CollectionSlot.displayName = COLLECTION_SLOT_NAME;
    const ITEM_SLOT_NAME = name + "CollectionItemSlot";
    const ITEM_DATA_ATTR = "data-radix-collection-item";
    const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
    const CollectionItemSlot = React.forwardRef(
      (props, forwardedRef) => {
        const { scope, children, ...itemData } = props;
        const ref = React.useRef(null);
        const composedRefs = useComposedRefs$1(forwardedRef, ref);
        const context = useCollectionContext(ITEM_SLOT_NAME, scope);
        React.useEffect(() => {
          context.itemMap.set(ref, { ref, ...itemData });
          return () => void context.itemMap.delete(ref);
        });
        return jsxRuntimeExports.jsx(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
      }
    );
    CollectionItemSlot.displayName = ITEM_SLOT_NAME;
    function useCollection2(scope) {
      const context = useCollectionContext(name + "CollectionConsumer", scope);
      const getItems = React.useCallback(() => {
        const collectionNode = context.collectionRef.current;
        if (!collectionNode) return [];
        const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
        const items = Array.from(context.itemMap.values());
        const orderedItems = items.sort(
          (a2, b) => orderedNodes.indexOf(a2.ref.current) - orderedNodes.indexOf(b.ref.current)
        );
        return orderedItems;
      }, [context.collectionRef, context.itemMap]);
      return getItems;
    }
    return [
      { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
      useCollection2,
      createCollectionScope2
    ];
  }
  function useEscapeKeydown(onEscapeKeyDownProp, ownerDocument = globalThis?.document) {
    const onEscapeKeyDown = useCallbackRef$1(onEscapeKeyDownProp);
    React__namespace.useEffect(() => {
      const handleKeyDown = (event) => {
        if (event.key === "Escape") {
          onEscapeKeyDown(event);
        }
      };
      ownerDocument.addEventListener("keydown", handleKeyDown, { capture: true });
      return () => ownerDocument.removeEventListener("keydown", handleKeyDown, { capture: true });
    }, [onEscapeKeyDown, ownerDocument]);
  }
  var DISMISSABLE_LAYER_NAME = "DismissableLayer";
  var CONTEXT_UPDATE = "dismissableLayer.update";
  var POINTER_DOWN_OUTSIDE = "dismissableLayer.pointerDownOutside";
  var FOCUS_OUTSIDE = "dismissableLayer.focusOutside";
  var originalBodyPointerEvents;
  var DismissableLayerContext = React__namespace.createContext({
    layers: new Set(),
    layersWithOutsidePointerEventsDisabled: new Set(),
    branches: new Set()
  });
  var DismissableLayer = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        disableOutsidePointerEvents = false,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside,
        onInteractOutside,
        onDismiss,
        ...layerProps
      } = props;
      const context = React__namespace.useContext(DismissableLayerContext);
      const [node, setNode] = React__namespace.useState(null);
      const ownerDocument = node?.ownerDocument ?? globalThis?.document;
      const [, force] = React__namespace.useState({});
      const composedRefs = useComposedRefs$1(forwardedRef, (node2) => setNode(node2));
      const layers = Array.from(context.layers);
      const [highestLayerWithOutsidePointerEventsDisabled] = [...context.layersWithOutsidePointerEventsDisabled].slice(-1);
      const highestLayerWithOutsidePointerEventsDisabledIndex = layers.indexOf(highestLayerWithOutsidePointerEventsDisabled);
      const index2 = node ? layers.indexOf(node) : -1;
      const isBodyPointerEventsDisabled = context.layersWithOutsidePointerEventsDisabled.size > 0;
      const isPointerEventsEnabled = index2 >= highestLayerWithOutsidePointerEventsDisabledIndex;
      const pointerDownOutside = usePointerDownOutside((event) => {
        const target = event.target;
        const isPointerDownOnBranch = [...context.branches].some((branch) => branch.contains(target));
        if (!isPointerEventsEnabled || isPointerDownOnBranch) return;
        onPointerDownOutside?.(event);
        onInteractOutside?.(event);
        if (!event.defaultPrevented) onDismiss?.();
      }, ownerDocument);
      const focusOutside = useFocusOutside((event) => {
        const target = event.target;
        const isFocusInBranch = [...context.branches].some((branch) => branch.contains(target));
        if (isFocusInBranch) return;
        onFocusOutside?.(event);
        onInteractOutside?.(event);
        if (!event.defaultPrevented) onDismiss?.();
      }, ownerDocument);
      useEscapeKeydown((event) => {
        const isHighestLayer = index2 === context.layers.size - 1;
        if (!isHighestLayer) return;
        onEscapeKeyDown?.(event);
        if (!event.defaultPrevented && onDismiss) {
          event.preventDefault();
          onDismiss();
        }
      }, ownerDocument);
      React__namespace.useEffect(() => {
        if (!node) return;
        if (disableOutsidePointerEvents) {
          if (context.layersWithOutsidePointerEventsDisabled.size === 0) {
            originalBodyPointerEvents = ownerDocument.body.style.pointerEvents;
            ownerDocument.body.style.pointerEvents = "none";
          }
          context.layersWithOutsidePointerEventsDisabled.add(node);
        }
        context.layers.add(node);
        dispatchUpdate();
        return () => {
          if (disableOutsidePointerEvents && context.layersWithOutsidePointerEventsDisabled.size === 1) {
            ownerDocument.body.style.pointerEvents = originalBodyPointerEvents;
          }
        };
      }, [node, ownerDocument, disableOutsidePointerEvents, context]);
      React__namespace.useEffect(() => {
        return () => {
          if (!node) return;
          context.layers.delete(node);
          context.layersWithOutsidePointerEventsDisabled.delete(node);
          dispatchUpdate();
        };
      }, [node, context]);
      React__namespace.useEffect(() => {
        const handleUpdate = () => force({});
        document.addEventListener(CONTEXT_UPDATE, handleUpdate);
        return () => document.removeEventListener(CONTEXT_UPDATE, handleUpdate);
      }, []);
      return jsxRuntimeExports.jsx(
        Primitive.div,
        {
          ...layerProps,
          ref: composedRefs,
          style: {
            pointerEvents: isBodyPointerEventsDisabled ? isPointerEventsEnabled ? "auto" : "none" : void 0,
            ...props.style
          },
          onFocusCapture: composeEventHandlers(props.onFocusCapture, focusOutside.onFocusCapture),
          onBlurCapture: composeEventHandlers(props.onBlurCapture, focusOutside.onBlurCapture),
          onPointerDownCapture: composeEventHandlers(
            props.onPointerDownCapture,
            pointerDownOutside.onPointerDownCapture
          )
        }
      );
    }
  );
  DismissableLayer.displayName = DISMISSABLE_LAYER_NAME;
  var BRANCH_NAME = "DismissableLayerBranch";
  var DismissableLayerBranch = React__namespace.forwardRef((props, forwardedRef) => {
    const context = React__namespace.useContext(DismissableLayerContext);
    const ref = React__namespace.useRef(null);
    const composedRefs = useComposedRefs$1(forwardedRef, ref);
    React__namespace.useEffect(() => {
      const node = ref.current;
      if (node) {
        context.branches.add(node);
        return () => {
          context.branches.delete(node);
        };
      }
    }, [context.branches]);
    return jsxRuntimeExports.jsx(Primitive.div, { ...props, ref: composedRefs });
  });
  DismissableLayerBranch.displayName = BRANCH_NAME;
  function usePointerDownOutside(onPointerDownOutside, ownerDocument = globalThis?.document) {
    const handlePointerDownOutside = useCallbackRef$1(onPointerDownOutside);
    const isPointerInsideReactTreeRef = React__namespace.useRef(false);
    const handleClickRef = React__namespace.useRef(() => {
    });
    React__namespace.useEffect(() => {
      const handlePointerDown = (event) => {
        if (event.target && !isPointerInsideReactTreeRef.current) {
          let handleAndDispatchPointerDownOutsideEvent2 = function() {
            handleAndDispatchCustomEvent(
              POINTER_DOWN_OUTSIDE,
              handlePointerDownOutside,
              eventDetail,
              { discrete: true }
            );
          };
          const eventDetail = { originalEvent: event };
          if (event.pointerType === "touch") {
            ownerDocument.removeEventListener("click", handleClickRef.current);
            handleClickRef.current = handleAndDispatchPointerDownOutsideEvent2;
            ownerDocument.addEventListener("click", handleClickRef.current, { once: true });
          } else {
            handleAndDispatchPointerDownOutsideEvent2();
          }
        } else {
          ownerDocument.removeEventListener("click", handleClickRef.current);
        }
        isPointerInsideReactTreeRef.current = false;
      };
      const timerId = window.setTimeout(() => {
        ownerDocument.addEventListener("pointerdown", handlePointerDown);
      }, 0);
      return () => {
        window.clearTimeout(timerId);
        ownerDocument.removeEventListener("pointerdown", handlePointerDown);
        ownerDocument.removeEventListener("click", handleClickRef.current);
      };
    }, [ownerDocument, handlePointerDownOutside]);
    return {
onPointerDownCapture: () => isPointerInsideReactTreeRef.current = true
    };
  }
  function useFocusOutside(onFocusOutside, ownerDocument = globalThis?.document) {
    const handleFocusOutside = useCallbackRef$1(onFocusOutside);
    const isFocusInsideReactTreeRef = React__namespace.useRef(false);
    React__namespace.useEffect(() => {
      const handleFocus = (event) => {
        if (event.target && !isFocusInsideReactTreeRef.current) {
          const eventDetail = { originalEvent: event };
          handleAndDispatchCustomEvent(FOCUS_OUTSIDE, handleFocusOutside, eventDetail, {
            discrete: false
          });
        }
      };
      ownerDocument.addEventListener("focusin", handleFocus);
      return () => ownerDocument.removeEventListener("focusin", handleFocus);
    }, [ownerDocument, handleFocusOutside]);
    return {
      onFocusCapture: () => isFocusInsideReactTreeRef.current = true,
      onBlurCapture: () => isFocusInsideReactTreeRef.current = false
    };
  }
  function dispatchUpdate() {
    const event = new CustomEvent(CONTEXT_UPDATE);
    document.dispatchEvent(event);
  }
  function handleAndDispatchCustomEvent(name, handler, detail, { discrete }) {
    const target = detail.originalEvent.target;
    const event = new CustomEvent(name, { bubbles: false, cancelable: true, detail });
    if (handler) target.addEventListener(name, handler, { once: true });
    if (discrete) {
      dispatchDiscreteCustomEvent(target, event);
    } else {
      target.dispatchEvent(event);
    }
  }
  var count$1 = 0;
  function useFocusGuards() {
    React__namespace.useEffect(() => {
      const edgeGuards = document.querySelectorAll("[data-radix-focus-guard]");
      document.body.insertAdjacentElement("afterbegin", edgeGuards[0] ?? createFocusGuard());
      document.body.insertAdjacentElement("beforeend", edgeGuards[1] ?? createFocusGuard());
      count$1++;
      return () => {
        if (count$1 === 1) {
          document.querySelectorAll("[data-radix-focus-guard]").forEach((node) => node.remove());
        }
        count$1--;
      };
    }, []);
  }
  function createFocusGuard() {
    const element = document.createElement("span");
    element.setAttribute("data-radix-focus-guard", "");
    element.tabIndex = 0;
    element.style.outline = "none";
    element.style.opacity = "0";
    element.style.position = "fixed";
    element.style.pointerEvents = "none";
    return element;
  }
  var AUTOFOCUS_ON_MOUNT = "focusScope.autoFocusOnMount";
  var AUTOFOCUS_ON_UNMOUNT = "focusScope.autoFocusOnUnmount";
  var EVENT_OPTIONS$1 = { bubbles: false, cancelable: true };
  var FOCUS_SCOPE_NAME = "FocusScope";
  var FocusScope = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      loop = false,
      trapped = false,
      onMountAutoFocus: onMountAutoFocusProp,
      onUnmountAutoFocus: onUnmountAutoFocusProp,
      ...scopeProps
    } = props;
    const [container, setContainer] = React__namespace.useState(null);
    const onMountAutoFocus = useCallbackRef$1(onMountAutoFocusProp);
    const onUnmountAutoFocus = useCallbackRef$1(onUnmountAutoFocusProp);
    const lastFocusedElementRef = React__namespace.useRef(null);
    const composedRefs = useComposedRefs$1(forwardedRef, (node) => setContainer(node));
    const focusScope = React__namespace.useRef({
      paused: false,
      pause() {
        this.paused = true;
      },
      resume() {
        this.paused = false;
      }
    }).current;
    React__namespace.useEffect(() => {
      if (trapped) {
        let handleFocusIn2 = function(event) {
          if (focusScope.paused || !container) return;
          const target = event.target;
          if (container.contains(target)) {
            lastFocusedElementRef.current = target;
          } else {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }, handleFocusOut2 = function(event) {
          if (focusScope.paused || !container) return;
          const relatedTarget = event.relatedTarget;
          if (relatedTarget === null) return;
          if (!container.contains(relatedTarget)) {
            focus(lastFocusedElementRef.current, { select: true });
          }
        }, handleMutations2 = function(mutations) {
          const focusedElement = document.activeElement;
          if (focusedElement !== document.body) return;
          for (const mutation of mutations) {
            if (mutation.removedNodes.length > 0) focus(container);
          }
        };
        document.addEventListener("focusin", handleFocusIn2);
        document.addEventListener("focusout", handleFocusOut2);
        const mutationObserver = new MutationObserver(handleMutations2);
        if (container) mutationObserver.observe(container, { childList: true, subtree: true });
        return () => {
          document.removeEventListener("focusin", handleFocusIn2);
          document.removeEventListener("focusout", handleFocusOut2);
          mutationObserver.disconnect();
        };
      }
    }, [trapped, container, focusScope.paused]);
    React__namespace.useEffect(() => {
      if (container) {
        focusScopesStack.add(focusScope);
        const previouslyFocusedElement = document.activeElement;
        const hasFocusedCandidate = container.contains(previouslyFocusedElement);
        if (!hasFocusedCandidate) {
          const mountEvent = new CustomEvent(AUTOFOCUS_ON_MOUNT, EVENT_OPTIONS$1);
          container.addEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          container.dispatchEvent(mountEvent);
          if (!mountEvent.defaultPrevented) {
            focusFirst$2(removeLinks(getTabbableCandidates(container)), { select: true });
            if (document.activeElement === previouslyFocusedElement) {
              focus(container);
            }
          }
        }
        return () => {
          container.removeEventListener(AUTOFOCUS_ON_MOUNT, onMountAutoFocus);
          setTimeout(() => {
            const unmountEvent = new CustomEvent(AUTOFOCUS_ON_UNMOUNT, EVENT_OPTIONS$1);
            container.addEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            container.dispatchEvent(unmountEvent);
            if (!unmountEvent.defaultPrevented) {
              focus(previouslyFocusedElement ?? document.body, { select: true });
            }
            container.removeEventListener(AUTOFOCUS_ON_UNMOUNT, onUnmountAutoFocus);
            focusScopesStack.remove(focusScope);
          }, 0);
        };
      }
    }, [container, onMountAutoFocus, onUnmountAutoFocus, focusScope]);
    const handleKeyDown = React__namespace.useCallback(
      (event) => {
        if (!loop && !trapped) return;
        if (focusScope.paused) return;
        const isTabKey = event.key === "Tab" && !event.altKey && !event.ctrlKey && !event.metaKey;
        const focusedElement = document.activeElement;
        if (isTabKey && focusedElement) {
          const container2 = event.currentTarget;
          const [first, last] = getTabbableEdges(container2);
          const hasTabbableElementsInside = first && last;
          if (!hasTabbableElementsInside) {
            if (focusedElement === container2) event.preventDefault();
          } else {
            if (!event.shiftKey && focusedElement === last) {
              event.preventDefault();
              if (loop) focus(first, { select: true });
            } else if (event.shiftKey && focusedElement === first) {
              event.preventDefault();
              if (loop) focus(last, { select: true });
            }
          }
        }
      },
      [loop, trapped, focusScope.paused]
    );
    return jsxRuntimeExports.jsx(Primitive.div, { tabIndex: -1, ...scopeProps, ref: composedRefs, onKeyDown: handleKeyDown });
  });
  FocusScope.displayName = FOCUS_SCOPE_NAME;
  function focusFirst$2(candidates, { select = false } = {}) {
    const previouslyFocusedElement = document.activeElement;
    for (const candidate of candidates) {
      focus(candidate, { select });
      if (document.activeElement !== previouslyFocusedElement) return;
    }
  }
  function getTabbableEdges(container) {
    const candidates = getTabbableCandidates(container);
    const first = findVisible(candidates, container);
    const last = findVisible(candidates.reverse(), container);
    return [first, last];
  }
  function getTabbableCandidates(container) {
    const nodes = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_ELEMENT, {
      acceptNode: (node) => {
        const isHiddenInput = node.tagName === "INPUT" && node.type === "hidden";
        if (node.disabled || node.hidden || isHiddenInput) return NodeFilter.FILTER_SKIP;
        return node.tabIndex >= 0 ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
      }
    });
    while (walker.nextNode()) nodes.push(walker.currentNode);
    return nodes;
  }
  function findVisible(elements, container) {
    for (const element of elements) {
      if (!isHidden(element, { upTo: container })) return element;
    }
  }
  function isHidden(node, { upTo }) {
    if (getComputedStyle(node).visibility === "hidden") return true;
    while (node) {
      if (upTo !== void 0 && node === upTo) return false;
      if (getComputedStyle(node).display === "none") return true;
      node = node.parentElement;
    }
    return false;
  }
  function isSelectableInput(element) {
    return element instanceof HTMLInputElement && "select" in element;
  }
  function focus(element, { select = false } = {}) {
    if (element && element.focus) {
      const previouslyFocusedElement = document.activeElement;
      element.focus({ preventScroll: true });
      if (element !== previouslyFocusedElement && isSelectableInput(element) && select)
        element.select();
    }
  }
  var focusScopesStack = createFocusScopesStack();
  function createFocusScopesStack() {
    let stack = [];
    return {
      add(focusScope) {
        const activeFocusScope = stack[0];
        if (focusScope !== activeFocusScope) {
          activeFocusScope?.pause();
        }
        stack = arrayRemove(stack, focusScope);
        stack.unshift(focusScope);
      },
      remove(focusScope) {
        stack = arrayRemove(stack, focusScope);
        stack[0]?.resume();
      }
    };
  }
  function arrayRemove(array, item) {
    const updatedArray = [...array];
    const index2 = updatedArray.indexOf(item);
    if (index2 !== -1) {
      updatedArray.splice(index2, 1);
    }
    return updatedArray;
  }
  function removeLinks(items) {
    return items.filter((item) => item.tagName !== "A");
  }
  var useReactId = React__namespace[" useId ".trim().toString()] || (() => void 0);
  var count = 0;
  function useId(deterministicId) {
    const [id2, setId] = React__namespace.useState(useReactId());
    useLayoutEffect2(() => {
      setId((reactId) => reactId ?? String(count++));
    }, [deterministicId]);
    return id2 ? `radix-${id2}` : "";
  }
  const sides = ["top", "right", "bottom", "left"];
  const min = Math.min;
  const max = Math.max;
  const round$1 = Math.round;
  const floor = Math.floor;
  const createCoords = (v) => ({
    x: v,
    y: v
  });
  const oppositeSideMap = {
    left: "right",
    right: "left",
    bottom: "top",
    top: "bottom"
  };
  const oppositeAlignmentMap = {
    start: "end",
    end: "start"
  };
  function clamp(start, value, end) {
    return max(start, min(value, end));
  }
  function evaluate(value, param) {
    return typeof value === "function" ? value(param) : value;
  }
  function getSide(placement) {
    return placement.split("-")[0];
  }
  function getAlignment(placement) {
    return placement.split("-")[1];
  }
  function getOppositeAxis(axis) {
    return axis === "x" ? "y" : "x";
  }
  function getAxisLength(axis) {
    return axis === "y" ? "height" : "width";
  }
  const yAxisSides = new Set(["top", "bottom"]);
  function getSideAxis(placement) {
    return yAxisSides.has(getSide(placement)) ? "y" : "x";
  }
  function getAlignmentAxis(placement) {
    return getOppositeAxis(getSideAxis(placement));
  }
  function getAlignmentSides(placement, rects, rtl) {
    if (rtl === void 0) {
      rtl = false;
    }
    const alignment = getAlignment(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const length = getAxisLength(alignmentAxis);
    let mainAlignmentSide = alignmentAxis === "x" ? alignment === (rtl ? "end" : "start") ? "right" : "left" : alignment === "start" ? "bottom" : "top";
    if (rects.reference[length] > rects.floating[length]) {
      mainAlignmentSide = getOppositePlacement(mainAlignmentSide);
    }
    return [mainAlignmentSide, getOppositePlacement(mainAlignmentSide)];
  }
  function getExpandedPlacements(placement) {
    const oppositePlacement = getOppositePlacement(placement);
    return [getOppositeAlignmentPlacement(placement), oppositePlacement, getOppositeAlignmentPlacement(oppositePlacement)];
  }
  function getOppositeAlignmentPlacement(placement) {
    return placement.replace(/start|end/g, (alignment) => oppositeAlignmentMap[alignment]);
  }
  const lrPlacement = ["left", "right"];
  const rlPlacement = ["right", "left"];
  const tbPlacement = ["top", "bottom"];
  const btPlacement = ["bottom", "top"];
  function getSideList(side, isStart, rtl) {
    switch (side) {
      case "top":
      case "bottom":
        if (rtl) return isStart ? rlPlacement : lrPlacement;
        return isStart ? lrPlacement : rlPlacement;
      case "left":
      case "right":
        return isStart ? tbPlacement : btPlacement;
      default:
        return [];
    }
  }
  function getOppositeAxisPlacements(placement, flipAlignment, direction, rtl) {
    const alignment = getAlignment(placement);
    let list = getSideList(getSide(placement), direction === "start", rtl);
    if (alignment) {
      list = list.map((side) => side + "-" + alignment);
      if (flipAlignment) {
        list = list.concat(list.map(getOppositeAlignmentPlacement));
      }
    }
    return list;
  }
  function getOppositePlacement(placement) {
    return placement.replace(/left|right|bottom|top/g, (side) => oppositeSideMap[side]);
  }
  function expandPaddingObject(padding) {
    return {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
      ...padding
    };
  }
  function getPaddingObject(padding) {
    return typeof padding !== "number" ? expandPaddingObject(padding) : {
      top: padding,
      right: padding,
      bottom: padding,
      left: padding
    };
  }
  function rectToClientRect(rect) {
    const {
      x: x2,
      y,
      width,
      height
    } = rect;
    return {
      width,
      height,
      top: y,
      left: x2,
      right: x2 + width,
      bottom: y + height,
      x: x2,
      y
    };
  }
  function computeCoordsFromPlacement(_ref, placement, rtl) {
    let {
      reference,
      floating
    } = _ref;
    const sideAxis = getSideAxis(placement);
    const alignmentAxis = getAlignmentAxis(placement);
    const alignLength = getAxisLength(alignmentAxis);
    const side = getSide(placement);
    const isVertical = sideAxis === "y";
    const commonX = reference.x + reference.width / 2 - floating.width / 2;
    const commonY = reference.y + reference.height / 2 - floating.height / 2;
    const commonAlign = reference[alignLength] / 2 - floating[alignLength] / 2;
    let coords;
    switch (side) {
      case "top":
        coords = {
          x: commonX,
          y: reference.y - floating.height
        };
        break;
      case "bottom":
        coords = {
          x: commonX,
          y: reference.y + reference.height
        };
        break;
      case "right":
        coords = {
          x: reference.x + reference.width,
          y: commonY
        };
        break;
      case "left":
        coords = {
          x: reference.x - floating.width,
          y: commonY
        };
        break;
      default:
        coords = {
          x: reference.x,
          y: reference.y
        };
    }
    switch (getAlignment(placement)) {
      case "start":
        coords[alignmentAxis] -= commonAlign * (rtl && isVertical ? -1 : 1);
        break;
      case "end":
        coords[alignmentAxis] += commonAlign * (rtl && isVertical ? -1 : 1);
        break;
    }
    return coords;
  }
  const computePosition$1 = async (reference, floating, config2) => {
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2
    } = config2;
    const validMiddleware = middleware.filter(Boolean);
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(floating));
    let rects = await platform2.getElementRects({
      reference,
      floating,
      strategy
    });
    let {
      x: x2,
      y
    } = computeCoordsFromPlacement(rects, placement, rtl);
    let statefulPlacement = placement;
    let middlewareData = {};
    let resetCount = 0;
    for (let i2 = 0; i2 < validMiddleware.length; i2++) {
      const {
        name,
        fn
      } = validMiddleware[i2];
      const {
        x: nextX,
        y: nextY,
        data,
        reset
      } = await fn({
        x: x2,
        y,
        initialPlacement: placement,
        placement: statefulPlacement,
        strategy,
        middlewareData,
        rects,
        platform: platform2,
        elements: {
          reference,
          floating
        }
      });
      x2 = nextX != null ? nextX : x2;
      y = nextY != null ? nextY : y;
      middlewareData = {
        ...middlewareData,
        [name]: {
          ...middlewareData[name],
          ...data
        }
      };
      if (reset && resetCount <= 50) {
        resetCount++;
        if (typeof reset === "object") {
          if (reset.placement) {
            statefulPlacement = reset.placement;
          }
          if (reset.rects) {
            rects = reset.rects === true ? await platform2.getElementRects({
              reference,
              floating,
              strategy
            }) : reset.rects;
          }
          ({
            x: x2,
            y
          } = computeCoordsFromPlacement(rects, statefulPlacement, rtl));
        }
        i2 = -1;
      }
    }
    return {
      x: x2,
      y,
      placement: statefulPlacement,
      strategy,
      middlewareData
    };
  };
  async function detectOverflow(state, options) {
    var _await$platform$isEle;
    if (options === void 0) {
      options = {};
    }
    const {
      x: x2,
      y,
      platform: platform2,
      rects,
      elements,
      strategy
    } = state;
    const {
      boundary = "clippingAncestors",
      rootBoundary = "viewport",
      elementContext = "floating",
      altBoundary = false,
      padding = 0
    } = evaluate(options, state);
    const paddingObject = getPaddingObject(padding);
    const altContext = elementContext === "floating" ? "reference" : "floating";
    const element = elements[altBoundary ? altContext : elementContext];
    const clippingClientRect = rectToClientRect(await platform2.getClippingRect({
      element: ((_await$platform$isEle = await (platform2.isElement == null ? void 0 : platform2.isElement(element))) != null ? _await$platform$isEle : true) ? element : element.contextElement || await (platform2.getDocumentElement == null ? void 0 : platform2.getDocumentElement(elements.floating)),
      boundary,
      rootBoundary,
      strategy
    }));
    const rect = elementContext === "floating" ? {
      x: x2,
      y,
      width: rects.floating.width,
      height: rects.floating.height
    } : rects.reference;
    const offsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(elements.floating));
    const offsetScale = await (platform2.isElement == null ? void 0 : platform2.isElement(offsetParent)) ? await (platform2.getScale == null ? void 0 : platform2.getScale(offsetParent)) || {
      x: 1,
      y: 1
    } : {
      x: 1,
      y: 1
    };
    const elementClientRect = rectToClientRect(platform2.convertOffsetParentRelativeRectToViewportRelativeRect ? await platform2.convertOffsetParentRelativeRectToViewportRelativeRect({
      elements,
      rect,
      offsetParent,
      strategy
    }) : rect);
    return {
      top: (clippingClientRect.top - elementClientRect.top + paddingObject.top) / offsetScale.y,
      bottom: (elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom) / offsetScale.y,
      left: (clippingClientRect.left - elementClientRect.left + paddingObject.left) / offsetScale.x,
      right: (elementClientRect.right - clippingClientRect.right + paddingObject.right) / offsetScale.x
    };
  }
  const arrow$3 = (options) => ({
    name: "arrow",
    options,
    async fn(state) {
      const {
        x: x2,
        y,
        placement,
        rects,
        platform: platform2,
        elements,
        middlewareData
      } = state;
      const {
        element,
        padding = 0
      } = evaluate(options, state) || {};
      if (element == null) {
        return {};
      }
      const paddingObject = getPaddingObject(padding);
      const coords = {
        x: x2,
        y
      };
      const axis = getAlignmentAxis(placement);
      const length = getAxisLength(axis);
      const arrowDimensions = await platform2.getDimensions(element);
      const isYAxis = axis === "y";
      const minProp = isYAxis ? "top" : "left";
      const maxProp = isYAxis ? "bottom" : "right";
      const clientProp = isYAxis ? "clientHeight" : "clientWidth";
      const endDiff = rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length];
      const startDiff = coords[axis] - rects.reference[axis];
      const arrowOffsetParent = await (platform2.getOffsetParent == null ? void 0 : platform2.getOffsetParent(element));
      let clientSize = arrowOffsetParent ? arrowOffsetParent[clientProp] : 0;
      if (!clientSize || !await (platform2.isElement == null ? void 0 : platform2.isElement(arrowOffsetParent))) {
        clientSize = elements.floating[clientProp] || rects.floating[length];
      }
      const centerToReference = endDiff / 2 - startDiff / 2;
      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1;
      const minPadding = min(paddingObject[minProp], largestPossiblePadding);
      const maxPadding = min(paddingObject[maxProp], largestPossiblePadding);
      const min$1 = minPadding;
      const max2 = clientSize - arrowDimensions[length] - maxPadding;
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference;
      const offset2 = clamp(min$1, center, max2);
      const shouldAddOffset = !middlewareData.arrow && getAlignment(placement) != null && center !== offset2 && rects.reference[length] / 2 - (center < min$1 ? minPadding : maxPadding) - arrowDimensions[length] / 2 < 0;
      const alignmentOffset = shouldAddOffset ? center < min$1 ? center - min$1 : center - max2 : 0;
      return {
        [axis]: coords[axis] + alignmentOffset,
        data: {
          [axis]: offset2,
          centerOffset: center - offset2 - alignmentOffset,
          ...shouldAddOffset && {
            alignmentOffset
          }
        },
        reset: shouldAddOffset
      };
    }
  });
  const flip$2 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "flip",
      options,
      async fn(state) {
        var _middlewareData$arrow, _middlewareData$flip;
        const {
          placement,
          middlewareData,
          rects,
          initialPlacement,
          platform: platform2,
          elements
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true,
          fallbackPlacements: specifiedFallbackPlacements,
          fallbackStrategy = "bestFit",
          fallbackAxisSideDirection = "none",
          flipAlignment = true,
          ...detectOverflowOptions
        } = evaluate(options, state);
        if ((_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        const side = getSide(placement);
        const initialSideAxis = getSideAxis(initialPlacement);
        const isBasePlacement = getSide(initialPlacement) === initialPlacement;
        const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
        const fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipAlignment ? [getOppositePlacement(initialPlacement)] : getExpandedPlacements(initialPlacement));
        const hasFallbackAxisSideDirection = fallbackAxisSideDirection !== "none";
        if (!specifiedFallbackPlacements && hasFallbackAxisSideDirection) {
          fallbackPlacements.push(...getOppositeAxisPlacements(initialPlacement, flipAlignment, fallbackAxisSideDirection, rtl));
        }
        const placements = [initialPlacement, ...fallbackPlacements];
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const overflows = [];
        let overflowsData = ((_middlewareData$flip = middlewareData.flip) == null ? void 0 : _middlewareData$flip.overflows) || [];
        if (checkMainAxis) {
          overflows.push(overflow[side]);
        }
        if (checkCrossAxis) {
          const sides2 = getAlignmentSides(placement, rects, rtl);
          overflows.push(overflow[sides2[0]], overflow[sides2[1]]);
        }
        overflowsData = [...overflowsData, {
          placement,
          overflows
        }];
        if (!overflows.every((side2) => side2 <= 0)) {
          var _middlewareData$flip2, _overflowsData$filter;
          const nextIndex = (((_middlewareData$flip2 = middlewareData.flip) == null ? void 0 : _middlewareData$flip2.index) || 0) + 1;
          const nextPlacement = placements[nextIndex];
          if (nextPlacement) {
            const ignoreCrossAxisOverflow = checkCrossAxis === "alignment" ? initialSideAxis !== getSideAxis(nextPlacement) : false;
            if (!ignoreCrossAxisOverflow ||

overflowsData.every((d) => getSideAxis(d.placement) === initialSideAxis ? d.overflows[0] > 0 : true)) {
              return {
                data: {
                  index: nextIndex,
                  overflows: overflowsData
                },
                reset: {
                  placement: nextPlacement
                }
              };
            }
          }
          let resetPlacement = (_overflowsData$filter = overflowsData.filter((d) => d.overflows[0] <= 0).sort((a2, b) => a2.overflows[1] - b.overflows[1])[0]) == null ? void 0 : _overflowsData$filter.placement;
          if (!resetPlacement) {
            switch (fallbackStrategy) {
              case "bestFit": {
                var _overflowsData$filter2;
                const placement2 = (_overflowsData$filter2 = overflowsData.filter((d) => {
                  if (hasFallbackAxisSideDirection) {
                    const currentSideAxis = getSideAxis(d.placement);
                    return currentSideAxis === initialSideAxis ||

currentSideAxis === "y";
                  }
                  return true;
                }).map((d) => [d.placement, d.overflows.filter((overflow2) => overflow2 > 0).reduce((acc, overflow2) => acc + overflow2, 0)]).sort((a2, b) => a2[1] - b[1])[0]) == null ? void 0 : _overflowsData$filter2[0];
                if (placement2) {
                  resetPlacement = placement2;
                }
                break;
              }
              case "initialPlacement":
                resetPlacement = initialPlacement;
                break;
            }
          }
          if (placement !== resetPlacement) {
            return {
              reset: {
                placement: resetPlacement
              }
            };
          }
        }
        return {};
      }
    };
  };
  function getSideOffsets(overflow, rect) {
    return {
      top: overflow.top - rect.height,
      right: overflow.right - rect.width,
      bottom: overflow.bottom - rect.height,
      left: overflow.left - rect.width
    };
  }
  function isAnySideFullyClipped(overflow) {
    return sides.some((side) => overflow[side] >= 0);
  }
  const hide$2 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "hide",
      options,
      async fn(state) {
        const {
          rects
        } = state;
        const {
          strategy = "referenceHidden",
          ...detectOverflowOptions
        } = evaluate(options, state);
        switch (strategy) {
          case "referenceHidden": {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              elementContext: "reference"
            });
            const offsets = getSideOffsets(overflow, rects.reference);
            return {
              data: {
                referenceHiddenOffsets: offsets,
                referenceHidden: isAnySideFullyClipped(offsets)
              }
            };
          }
          case "escaped": {
            const overflow = await detectOverflow(state, {
              ...detectOverflowOptions,
              altBoundary: true
            });
            const offsets = getSideOffsets(overflow, rects.floating);
            return {
              data: {
                escapedOffsets: offsets,
                escaped: isAnySideFullyClipped(offsets)
              }
            };
          }
          default: {
            return {};
          }
        }
      }
    };
  };
  const originSides = new Set(["left", "top"]);
  async function convertValueToCoords(state, options) {
    const {
      placement,
      platform: platform2,
      elements
    } = state;
    const rtl = await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating));
    const side = getSide(placement);
    const alignment = getAlignment(placement);
    const isVertical = getSideAxis(placement) === "y";
    const mainAxisMulti = originSides.has(side) ? -1 : 1;
    const crossAxisMulti = rtl && isVertical ? -1 : 1;
    const rawValue = evaluate(options, state);
    let {
      mainAxis,
      crossAxis,
      alignmentAxis
    } = typeof rawValue === "number" ? {
      mainAxis: rawValue,
      crossAxis: 0,
      alignmentAxis: null
    } : {
      mainAxis: rawValue.mainAxis || 0,
      crossAxis: rawValue.crossAxis || 0,
      alignmentAxis: rawValue.alignmentAxis
    };
    if (alignment && typeof alignmentAxis === "number") {
      crossAxis = alignment === "end" ? alignmentAxis * -1 : alignmentAxis;
    }
    return isVertical ? {
      x: crossAxis * crossAxisMulti,
      y: mainAxis * mainAxisMulti
    } : {
      x: mainAxis * mainAxisMulti,
      y: crossAxis * crossAxisMulti
    };
  }
  const offset$2 = function(options) {
    if (options === void 0) {
      options = 0;
    }
    return {
      name: "offset",
      options,
      async fn(state) {
        var _middlewareData$offse, _middlewareData$arrow;
        const {
          x: x2,
          y,
          placement,
          middlewareData
        } = state;
        const diffCoords = await convertValueToCoords(state, options);
        if (placement === ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse.placement) && (_middlewareData$arrow = middlewareData.arrow) != null && _middlewareData$arrow.alignmentOffset) {
          return {};
        }
        return {
          x: x2 + diffCoords.x,
          y: y + diffCoords.y,
          data: {
            ...diffCoords,
            placement
          }
        };
      }
    };
  };
  const shift$2 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "shift",
      options,
      async fn(state) {
        const {
          x: x2,
          y,
          placement
        } = state;
        const {
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = false,
          limiter = {
            fn: (_ref) => {
              let {
                x: x3,
                y: y2
              } = _ref;
              return {
                x: x3,
                y: y2
              };
            }
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const coords = {
          x: x2,
          y
        };
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const crossAxis = getSideAxis(getSide(placement));
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        if (checkMainAxis) {
          const minSide = mainAxis === "y" ? "top" : "left";
          const maxSide = mainAxis === "y" ? "bottom" : "right";
          const min2 = mainAxisCoord + overflow[minSide];
          const max2 = mainAxisCoord - overflow[maxSide];
          mainAxisCoord = clamp(min2, mainAxisCoord, max2);
        }
        if (checkCrossAxis) {
          const minSide = crossAxis === "y" ? "top" : "left";
          const maxSide = crossAxis === "y" ? "bottom" : "right";
          const min2 = crossAxisCoord + overflow[minSide];
          const max2 = crossAxisCoord - overflow[maxSide];
          crossAxisCoord = clamp(min2, crossAxisCoord, max2);
        }
        const limitedCoords = limiter.fn({
          ...state,
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        });
        return {
          ...limitedCoords,
          data: {
            x: limitedCoords.x - x2,
            y: limitedCoords.y - y,
            enabled: {
              [mainAxis]: checkMainAxis,
              [crossAxis]: checkCrossAxis
            }
          }
        };
      }
    };
  };
  const limitShift$2 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      options,
      fn(state) {
        const {
          x: x2,
          y,
          placement,
          rects,
          middlewareData
        } = state;
        const {
          offset: offset2 = 0,
          mainAxis: checkMainAxis = true,
          crossAxis: checkCrossAxis = true
        } = evaluate(options, state);
        const coords = {
          x: x2,
          y
        };
        const crossAxis = getSideAxis(placement);
        const mainAxis = getOppositeAxis(crossAxis);
        let mainAxisCoord = coords[mainAxis];
        let crossAxisCoord = coords[crossAxis];
        const rawOffset = evaluate(offset2, state);
        const computedOffset = typeof rawOffset === "number" ? {
          mainAxis: rawOffset,
          crossAxis: 0
        } : {
          mainAxis: 0,
          crossAxis: 0,
          ...rawOffset
        };
        if (checkMainAxis) {
          const len = mainAxis === "y" ? "height" : "width";
          const limitMin = rects.reference[mainAxis] - rects.floating[len] + computedOffset.mainAxis;
          const limitMax = rects.reference[mainAxis] + rects.reference[len] - computedOffset.mainAxis;
          if (mainAxisCoord < limitMin) {
            mainAxisCoord = limitMin;
          } else if (mainAxisCoord > limitMax) {
            mainAxisCoord = limitMax;
          }
        }
        if (checkCrossAxis) {
          var _middlewareData$offse, _middlewareData$offse2;
          const len = mainAxis === "y" ? "width" : "height";
          const isOriginSide = originSides.has(getSide(placement));
          const limitMin = rects.reference[crossAxis] - rects.floating[len] + (isOriginSide ? ((_middlewareData$offse = middlewareData.offset) == null ? void 0 : _middlewareData$offse[crossAxis]) || 0 : 0) + (isOriginSide ? 0 : computedOffset.crossAxis);
          const limitMax = rects.reference[crossAxis] + rects.reference[len] + (isOriginSide ? 0 : ((_middlewareData$offse2 = middlewareData.offset) == null ? void 0 : _middlewareData$offse2[crossAxis]) || 0) - (isOriginSide ? computedOffset.crossAxis : 0);
          if (crossAxisCoord < limitMin) {
            crossAxisCoord = limitMin;
          } else if (crossAxisCoord > limitMax) {
            crossAxisCoord = limitMax;
          }
        }
        return {
          [mainAxis]: mainAxisCoord,
          [crossAxis]: crossAxisCoord
        };
      }
    };
  };
  const size$2 = function(options) {
    if (options === void 0) {
      options = {};
    }
    return {
      name: "size",
      options,
      async fn(state) {
        var _state$middlewareData, _state$middlewareData2;
        const {
          placement,
          rects,
          platform: platform2,
          elements
        } = state;
        const {
          apply = () => {
          },
          ...detectOverflowOptions
        } = evaluate(options, state);
        const overflow = await detectOverflow(state, detectOverflowOptions);
        const side = getSide(placement);
        const alignment = getAlignment(placement);
        const isYAxis = getSideAxis(placement) === "y";
        const {
          width,
          height
        } = rects.floating;
        let heightSide;
        let widthSide;
        if (side === "top" || side === "bottom") {
          heightSide = side;
          widthSide = alignment === (await (platform2.isRTL == null ? void 0 : platform2.isRTL(elements.floating)) ? "start" : "end") ? "left" : "right";
        } else {
          widthSide = side;
          heightSide = alignment === "end" ? "top" : "bottom";
        }
        const maximumClippingHeight = height - overflow.top - overflow.bottom;
        const maximumClippingWidth = width - overflow.left - overflow.right;
        const overflowAvailableHeight = min(height - overflow[heightSide], maximumClippingHeight);
        const overflowAvailableWidth = min(width - overflow[widthSide], maximumClippingWidth);
        const noShift = !state.middlewareData.shift;
        let availableHeight = overflowAvailableHeight;
        let availableWidth = overflowAvailableWidth;
        if ((_state$middlewareData = state.middlewareData.shift) != null && _state$middlewareData.enabled.x) {
          availableWidth = maximumClippingWidth;
        }
        if ((_state$middlewareData2 = state.middlewareData.shift) != null && _state$middlewareData2.enabled.y) {
          availableHeight = maximumClippingHeight;
        }
        if (noShift && !alignment) {
          const xMin = max(overflow.left, 0);
          const xMax = max(overflow.right, 0);
          const yMin = max(overflow.top, 0);
          const yMax = max(overflow.bottom, 0);
          if (isYAxis) {
            availableWidth = width - 2 * (xMin !== 0 || xMax !== 0 ? xMin + xMax : max(overflow.left, overflow.right));
          } else {
            availableHeight = height - 2 * (yMin !== 0 || yMax !== 0 ? yMin + yMax : max(overflow.top, overflow.bottom));
          }
        }
        await apply({
          ...state,
          availableWidth,
          availableHeight
        });
        const nextDimensions = await platform2.getDimensions(elements.floating);
        if (width !== nextDimensions.width || height !== nextDimensions.height) {
          return {
            reset: {
              rects: true
            }
          };
        }
        return {};
      }
    };
  };
  function hasWindow() {
    return typeof window !== "undefined";
  }
  function getNodeName(node) {
    if (isNode(node)) {
      return (node.nodeName || "").toLowerCase();
    }
    return "#document";
  }
  function getWindow(node) {
    var _node$ownerDocument;
    return (node == null || (_node$ownerDocument = node.ownerDocument) == null ? void 0 : _node$ownerDocument.defaultView) || window;
  }
  function getDocumentElement(node) {
    var _ref;
    return (_ref = (isNode(node) ? node.ownerDocument : node.document) || window.document) == null ? void 0 : _ref.documentElement;
  }
  function isNode(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Node || value instanceof getWindow(value).Node;
  }
  function isElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof Element || value instanceof getWindow(value).Element;
  }
  function isHTMLElement(value) {
    if (!hasWindow()) {
      return false;
    }
    return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement;
  }
  function isShadowRoot(value) {
    if (!hasWindow() || typeof ShadowRoot === "undefined") {
      return false;
    }
    return value instanceof ShadowRoot || value instanceof getWindow(value).ShadowRoot;
  }
  const invalidOverflowDisplayValues = new Set(["inline", "contents"]);
  function isOverflowElement(element) {
    const {
      overflow,
      overflowX,
      overflowY,
      display
    } = getComputedStyle$1(element);
    return /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) && !invalidOverflowDisplayValues.has(display);
  }
  const tableElements = new Set(["table", "td", "th"]);
  function isTableElement(element) {
    return tableElements.has(getNodeName(element));
  }
  const topLayerSelectors = [":popover-open", ":modal"];
  function isTopLayer(element) {
    return topLayerSelectors.some((selector) => {
      try {
        return element.matches(selector);
      } catch (_e) {
        return false;
      }
    });
  }
  const transformProperties = ["transform", "translate", "scale", "rotate", "perspective"];
  const willChangeValues = ["transform", "translate", "scale", "rotate", "perspective", "filter"];
  const containValues = ["paint", "layout", "strict", "content"];
  function isContainingBlock(elementOrCss) {
    const webkit = isWebKit$1();
    const css = isElement(elementOrCss) ? getComputedStyle$1(elementOrCss) : elementOrCss;
    return transformProperties.some((value) => css[value] ? css[value] !== "none" : false) || (css.containerType ? css.containerType !== "normal" : false) || !webkit && (css.backdropFilter ? css.backdropFilter !== "none" : false) || !webkit && (css.filter ? css.filter !== "none" : false) || willChangeValues.some((value) => (css.willChange || "").includes(value)) || containValues.some((value) => (css.contain || "").includes(value));
  }
  function getContainingBlock(element) {
    let currentNode = getParentNode(element);
    while (isHTMLElement(currentNode) && !isLastTraversableNode(currentNode)) {
      if (isContainingBlock(currentNode)) {
        return currentNode;
      } else if (isTopLayer(currentNode)) {
        return null;
      }
      currentNode = getParentNode(currentNode);
    }
    return null;
  }
  function isWebKit$1() {
    if (typeof CSS === "undefined" || !CSS.supports) return false;
    return CSS.supports("-webkit-backdrop-filter", "none");
  }
  const lastTraversableNodeNames = new Set(["html", "body", "#document"]);
  function isLastTraversableNode(node) {
    return lastTraversableNodeNames.has(getNodeName(node));
  }
  function getComputedStyle$1(element) {
    return getWindow(element).getComputedStyle(element);
  }
  function getNodeScroll(element) {
    if (isElement(element)) {
      return {
        scrollLeft: element.scrollLeft,
        scrollTop: element.scrollTop
      };
    }
    return {
      scrollLeft: element.scrollX,
      scrollTop: element.scrollY
    };
  }
  function getParentNode(node) {
    if (getNodeName(node) === "html") {
      return node;
    }
    const result = (
node.assignedSlot ||
node.parentNode ||
isShadowRoot(node) && node.host ||
getDocumentElement(node)
    );
    return isShadowRoot(result) ? result.host : result;
  }
  function getNearestOverflowAncestor(node) {
    const parentNode = getParentNode(node);
    if (isLastTraversableNode(parentNode)) {
      return node.ownerDocument ? node.ownerDocument.body : node.body;
    }
    if (isHTMLElement(parentNode) && isOverflowElement(parentNode)) {
      return parentNode;
    }
    return getNearestOverflowAncestor(parentNode);
  }
  function getOverflowAncestors(node, list, traverseIframes) {
    var _node$ownerDocument2;
    if (list === void 0) {
      list = [];
    }
    if (traverseIframes === void 0) {
      traverseIframes = true;
    }
    const scrollableAncestor = getNearestOverflowAncestor(node);
    const isBody = scrollableAncestor === ((_node$ownerDocument2 = node.ownerDocument) == null ? void 0 : _node$ownerDocument2.body);
    const win = getWindow(scrollableAncestor);
    if (isBody) {
      const frameElement = getFrameElement(win);
      return list.concat(win, win.visualViewport || [], isOverflowElement(scrollableAncestor) ? scrollableAncestor : [], frameElement && traverseIframes ? getOverflowAncestors(frameElement) : []);
    }
    return list.concat(scrollableAncestor, getOverflowAncestors(scrollableAncestor, [], traverseIframes));
  }
  function getFrameElement(win) {
    return win.parent && Object.getPrototypeOf(win.parent) ? win.frameElement : null;
  }
  function getCssDimensions(element) {
    const css = getComputedStyle$1(element);
    let width = parseFloat(css.width) || 0;
    let height = parseFloat(css.height) || 0;
    const hasOffset = isHTMLElement(element);
    const offsetWidth = hasOffset ? element.offsetWidth : width;
    const offsetHeight = hasOffset ? element.offsetHeight : height;
    const shouldFallback = round$1(width) !== offsetWidth || round$1(height) !== offsetHeight;
    if (shouldFallback) {
      width = offsetWidth;
      height = offsetHeight;
    }
    return {
      width,
      height,
      $: shouldFallback
    };
  }
  function unwrapElement(element) {
    return !isElement(element) ? element.contextElement : element;
  }
  function getScale(element) {
    const domElement = unwrapElement(element);
    if (!isHTMLElement(domElement)) {
      return createCoords(1);
    }
    const rect = domElement.getBoundingClientRect();
    const {
      width,
      height,
      $
    } = getCssDimensions(domElement);
    let x2 = ($ ? round$1(rect.width) : rect.width) / width;
    let y = ($ ? round$1(rect.height) : rect.height) / height;
    if (!x2 || !Number.isFinite(x2)) {
      x2 = 1;
    }
    if (!y || !Number.isFinite(y)) {
      y = 1;
    }
    return {
      x: x2,
      y
    };
  }
  const noOffsets = createCoords(0);
  function getVisualOffsets(element) {
    const win = getWindow(element);
    if (!isWebKit$1() || !win.visualViewport) {
      return noOffsets;
    }
    return {
      x: win.visualViewport.offsetLeft,
      y: win.visualViewport.offsetTop
    };
  }
  function shouldAddVisualOffsets(element, isFixed, floatingOffsetParent) {
    if (isFixed === void 0) {
      isFixed = false;
    }
    if (!floatingOffsetParent || isFixed && floatingOffsetParent !== getWindow(element)) {
      return false;
    }
    return isFixed;
  }
  function getBoundingClientRect(element, includeScale, isFixedStrategy, offsetParent) {
    if (includeScale === void 0) {
      includeScale = false;
    }
    if (isFixedStrategy === void 0) {
      isFixedStrategy = false;
    }
    const clientRect = element.getBoundingClientRect();
    const domElement = unwrapElement(element);
    let scale2 = createCoords(1);
    if (includeScale) {
      if (offsetParent) {
        if (isElement(offsetParent)) {
          scale2 = getScale(offsetParent);
        }
      } else {
        scale2 = getScale(element);
      }
    }
    const visualOffsets = shouldAddVisualOffsets(domElement, isFixedStrategy, offsetParent) ? getVisualOffsets(domElement) : createCoords(0);
    let x2 = (clientRect.left + visualOffsets.x) / scale2.x;
    let y = (clientRect.top + visualOffsets.y) / scale2.y;
    let width = clientRect.width / scale2.x;
    let height = clientRect.height / scale2.y;
    if (domElement) {
      const win = getWindow(domElement);
      const offsetWin = offsetParent && isElement(offsetParent) ? getWindow(offsetParent) : offsetParent;
      let currentWin = win;
      let currentIFrame = getFrameElement(currentWin);
      while (currentIFrame && offsetParent && offsetWin !== currentWin) {
        const iframeScale = getScale(currentIFrame);
        const iframeRect = currentIFrame.getBoundingClientRect();
        const css = getComputedStyle$1(currentIFrame);
        const left = iframeRect.left + (currentIFrame.clientLeft + parseFloat(css.paddingLeft)) * iframeScale.x;
        const top = iframeRect.top + (currentIFrame.clientTop + parseFloat(css.paddingTop)) * iframeScale.y;
        x2 *= iframeScale.x;
        y *= iframeScale.y;
        width *= iframeScale.x;
        height *= iframeScale.y;
        x2 += left;
        y += top;
        currentWin = getWindow(currentIFrame);
        currentIFrame = getFrameElement(currentWin);
      }
    }
    return rectToClientRect({
      width,
      height,
      x: x2,
      y
    });
  }
  function getWindowScrollBarX(element, rect) {
    const leftScroll = getNodeScroll(element).scrollLeft;
    if (!rect) {
      return getBoundingClientRect(getDocumentElement(element)).left + leftScroll;
    }
    return rect.left + leftScroll;
  }
  function getHTMLOffset(documentElement, scroll) {
    const htmlRect = documentElement.getBoundingClientRect();
    const x2 = htmlRect.left + scroll.scrollLeft - getWindowScrollBarX(documentElement, htmlRect);
    const y = htmlRect.top + scroll.scrollTop;
    return {
      x: x2,
      y
    };
  }
  function convertOffsetParentRelativeRectToViewportRelativeRect(_ref) {
    let {
      elements,
      rect,
      offsetParent,
      strategy
    } = _ref;
    const isFixed = strategy === "fixed";
    const documentElement = getDocumentElement(offsetParent);
    const topLayer = elements ? isTopLayer(elements.floating) : false;
    if (offsetParent === documentElement || topLayer && isFixed) {
      return rect;
    }
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    let scale2 = createCoords(1);
    const offsets = createCoords(0);
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isHTMLElement(offsetParent)) {
        const offsetRect = getBoundingClientRect(offsetParent);
        scale2 = getScale(offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      }
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    return {
      width: rect.width * scale2.x,
      height: rect.height * scale2.y,
      x: rect.x * scale2.x - scroll.scrollLeft * scale2.x + offsets.x + htmlOffset.x,
      y: rect.y * scale2.y - scroll.scrollTop * scale2.y + offsets.y + htmlOffset.y
    };
  }
  function getClientRects(element) {
    return Array.from(element.getClientRects());
  }
  function getDocumentRect(element) {
    const html = getDocumentElement(element);
    const scroll = getNodeScroll(element);
    const body = element.ownerDocument.body;
    const width = max(html.scrollWidth, html.clientWidth, body.scrollWidth, body.clientWidth);
    const height = max(html.scrollHeight, html.clientHeight, body.scrollHeight, body.clientHeight);
    let x2 = -scroll.scrollLeft + getWindowScrollBarX(element);
    const y = -scroll.scrollTop;
    if (getComputedStyle$1(body).direction === "rtl") {
      x2 += max(html.clientWidth, body.clientWidth) - width;
    }
    return {
      width,
      height,
      x: x2,
      y
    };
  }
  const SCROLLBAR_MAX = 25;
  function getViewportRect(element, strategy) {
    const win = getWindow(element);
    const html = getDocumentElement(element);
    const visualViewport = win.visualViewport;
    let width = html.clientWidth;
    let height = html.clientHeight;
    let x2 = 0;
    let y = 0;
    if (visualViewport) {
      width = visualViewport.width;
      height = visualViewport.height;
      const visualViewportBased = isWebKit$1();
      if (!visualViewportBased || visualViewportBased && strategy === "fixed") {
        x2 = visualViewport.offsetLeft;
        y = visualViewport.offsetTop;
      }
    }
    const windowScrollbarX = getWindowScrollBarX(html);
    if (windowScrollbarX <= 0) {
      const doc = html.ownerDocument;
      const body = doc.body;
      const bodyStyles = getComputedStyle(body);
      const bodyMarginInline = doc.compatMode === "CSS1Compat" ? parseFloat(bodyStyles.marginLeft) + parseFloat(bodyStyles.marginRight) || 0 : 0;
      const clippingStableScrollbarWidth = Math.abs(html.clientWidth - body.clientWidth - bodyMarginInline);
      if (clippingStableScrollbarWidth <= SCROLLBAR_MAX) {
        width -= clippingStableScrollbarWidth;
      }
    } else if (windowScrollbarX <= SCROLLBAR_MAX) {
      width += windowScrollbarX;
    }
    return {
      width,
      height,
      x: x2,
      y
    };
  }
  const absoluteOrFixed = new Set(["absolute", "fixed"]);
  function getInnerBoundingClientRect(element, strategy) {
    const clientRect = getBoundingClientRect(element, true, strategy === "fixed");
    const top = clientRect.top + element.clientTop;
    const left = clientRect.left + element.clientLeft;
    const scale2 = isHTMLElement(element) ? getScale(element) : createCoords(1);
    const width = element.clientWidth * scale2.x;
    const height = element.clientHeight * scale2.y;
    const x2 = left * scale2.x;
    const y = top * scale2.y;
    return {
      width,
      height,
      x: x2,
      y
    };
  }
  function getClientRectFromClippingAncestor(element, clippingAncestor, strategy) {
    let rect;
    if (clippingAncestor === "viewport") {
      rect = getViewportRect(element, strategy);
    } else if (clippingAncestor === "document") {
      rect = getDocumentRect(getDocumentElement(element));
    } else if (isElement(clippingAncestor)) {
      rect = getInnerBoundingClientRect(clippingAncestor, strategy);
    } else {
      const visualOffsets = getVisualOffsets(element);
      rect = {
        x: clippingAncestor.x - visualOffsets.x,
        y: clippingAncestor.y - visualOffsets.y,
        width: clippingAncestor.width,
        height: clippingAncestor.height
      };
    }
    return rectToClientRect(rect);
  }
  function hasFixedPositionAncestor(element, stopNode) {
    const parentNode = getParentNode(element);
    if (parentNode === stopNode || !isElement(parentNode) || isLastTraversableNode(parentNode)) {
      return false;
    }
    return getComputedStyle$1(parentNode).position === "fixed" || hasFixedPositionAncestor(parentNode, stopNode);
  }
  function getClippingElementAncestors(element, cache) {
    const cachedResult = cache.get(element);
    if (cachedResult) {
      return cachedResult;
    }
    let result = getOverflowAncestors(element, [], false).filter((el) => isElement(el) && getNodeName(el) !== "body");
    let currentContainingBlockComputedStyle = null;
    const elementIsFixed = getComputedStyle$1(element).position === "fixed";
    let currentNode = elementIsFixed ? getParentNode(element) : element;
    while (isElement(currentNode) && !isLastTraversableNode(currentNode)) {
      const computedStyle = getComputedStyle$1(currentNode);
      const currentNodeIsContaining = isContainingBlock(currentNode);
      if (!currentNodeIsContaining && computedStyle.position === "fixed") {
        currentContainingBlockComputedStyle = null;
      }
      const shouldDropCurrentNode = elementIsFixed ? !currentNodeIsContaining && !currentContainingBlockComputedStyle : !currentNodeIsContaining && computedStyle.position === "static" && !!currentContainingBlockComputedStyle && absoluteOrFixed.has(currentContainingBlockComputedStyle.position) || isOverflowElement(currentNode) && !currentNodeIsContaining && hasFixedPositionAncestor(element, currentNode);
      if (shouldDropCurrentNode) {
        result = result.filter((ancestor) => ancestor !== currentNode);
      } else {
        currentContainingBlockComputedStyle = computedStyle;
      }
      currentNode = getParentNode(currentNode);
    }
    cache.set(element, result);
    return result;
  }
  function getClippingRect(_ref) {
    let {
      element,
      boundary,
      rootBoundary,
      strategy
    } = _ref;
    const elementClippingAncestors = boundary === "clippingAncestors" ? isTopLayer(element) ? [] : getClippingElementAncestors(element, this._c) : [].concat(boundary);
    const clippingAncestors = [...elementClippingAncestors, rootBoundary];
    const firstClippingAncestor = clippingAncestors[0];
    const clippingRect = clippingAncestors.reduce((accRect, clippingAncestor) => {
      const rect = getClientRectFromClippingAncestor(element, clippingAncestor, strategy);
      accRect.top = max(rect.top, accRect.top);
      accRect.right = min(rect.right, accRect.right);
      accRect.bottom = min(rect.bottom, accRect.bottom);
      accRect.left = max(rect.left, accRect.left);
      return accRect;
    }, getClientRectFromClippingAncestor(element, firstClippingAncestor, strategy));
    return {
      width: clippingRect.right - clippingRect.left,
      height: clippingRect.bottom - clippingRect.top,
      x: clippingRect.left,
      y: clippingRect.top
    };
  }
  function getDimensions(element) {
    const {
      width,
      height
    } = getCssDimensions(element);
    return {
      width,
      height
    };
  }
  function getRectRelativeToOffsetParent(element, offsetParent, strategy) {
    const isOffsetParentAnElement = isHTMLElement(offsetParent);
    const documentElement = getDocumentElement(offsetParent);
    const isFixed = strategy === "fixed";
    const rect = getBoundingClientRect(element, true, isFixed, offsetParent);
    let scroll = {
      scrollLeft: 0,
      scrollTop: 0
    };
    const offsets = createCoords(0);
    function setLeftRTLScrollbarOffset() {
      offsets.x = getWindowScrollBarX(documentElement);
    }
    if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
      if (getNodeName(offsetParent) !== "body" || isOverflowElement(documentElement)) {
        scroll = getNodeScroll(offsetParent);
      }
      if (isOffsetParentAnElement) {
        const offsetRect = getBoundingClientRect(offsetParent, true, isFixed, offsetParent);
        offsets.x = offsetRect.x + offsetParent.clientLeft;
        offsets.y = offsetRect.y + offsetParent.clientTop;
      } else if (documentElement) {
        setLeftRTLScrollbarOffset();
      }
    }
    if (isFixed && !isOffsetParentAnElement && documentElement) {
      setLeftRTLScrollbarOffset();
    }
    const htmlOffset = documentElement && !isOffsetParentAnElement && !isFixed ? getHTMLOffset(documentElement, scroll) : createCoords(0);
    const x2 = rect.left + scroll.scrollLeft - offsets.x - htmlOffset.x;
    const y = rect.top + scroll.scrollTop - offsets.y - htmlOffset.y;
    return {
      x: x2,
      y,
      width: rect.width,
      height: rect.height
    };
  }
  function isStaticPositioned(element) {
    return getComputedStyle$1(element).position === "static";
  }
  function getTrueOffsetParent(element, polyfill) {
    if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
      return null;
    }
    if (polyfill) {
      return polyfill(element);
    }
    let rawOffsetParent = element.offsetParent;
    if (getDocumentElement(element) === rawOffsetParent) {
      rawOffsetParent = rawOffsetParent.ownerDocument.body;
    }
    return rawOffsetParent;
  }
  function getOffsetParent(element, polyfill) {
    const win = getWindow(element);
    if (isTopLayer(element)) {
      return win;
    }
    if (!isHTMLElement(element)) {
      let svgOffsetParent = getParentNode(element);
      while (svgOffsetParent && !isLastTraversableNode(svgOffsetParent)) {
        if (isElement(svgOffsetParent) && !isStaticPositioned(svgOffsetParent)) {
          return svgOffsetParent;
        }
        svgOffsetParent = getParentNode(svgOffsetParent);
      }
      return win;
    }
    let offsetParent = getTrueOffsetParent(element, polyfill);
    while (offsetParent && isTableElement(offsetParent) && isStaticPositioned(offsetParent)) {
      offsetParent = getTrueOffsetParent(offsetParent, polyfill);
    }
    if (offsetParent && isLastTraversableNode(offsetParent) && isStaticPositioned(offsetParent) && !isContainingBlock(offsetParent)) {
      return win;
    }
    return offsetParent || getContainingBlock(element) || win;
  }
  const getElementRects = async function(data) {
    const getOffsetParentFn = this.getOffsetParent || getOffsetParent;
    const getDimensionsFn = this.getDimensions;
    const floatingDimensions = await getDimensionsFn(data.floating);
    return {
      reference: getRectRelativeToOffsetParent(data.reference, await getOffsetParentFn(data.floating), data.strategy),
      floating: {
        x: 0,
        y: 0,
        width: floatingDimensions.width,
        height: floatingDimensions.height
      }
    };
  };
  function isRTL(element) {
    return getComputedStyle$1(element).direction === "rtl";
  }
  const platform = {
    convertOffsetParentRelativeRectToViewportRelativeRect,
    getDocumentElement,
    getClippingRect,
    getOffsetParent,
    getElementRects,
    getClientRects,
    getDimensions,
    getScale,
    isElement,
    isRTL
  };
  function rectsAreEqual(a2, b) {
    return a2.x === b.x && a2.y === b.y && a2.width === b.width && a2.height === b.height;
  }
  function observeMove(element, onMove) {
    let io = null;
    let timeoutId;
    const root = getDocumentElement(element);
    function cleanup() {
      var _io;
      clearTimeout(timeoutId);
      (_io = io) == null || _io.disconnect();
      io = null;
    }
    function refresh(skip, threshold) {
      if (skip === void 0) {
        skip = false;
      }
      if (threshold === void 0) {
        threshold = 1;
      }
      cleanup();
      const elementRectForRootMargin = element.getBoundingClientRect();
      const {
        left,
        top,
        width,
        height
      } = elementRectForRootMargin;
      if (!skip) {
        onMove();
      }
      if (!width || !height) {
        return;
      }
      const insetTop = floor(top);
      const insetRight = floor(root.clientWidth - (left + width));
      const insetBottom = floor(root.clientHeight - (top + height));
      const insetLeft = floor(left);
      const rootMargin = -insetTop + "px " + -insetRight + "px " + -insetBottom + "px " + -insetLeft + "px";
      const options = {
        rootMargin,
        threshold: max(0, min(1, threshold)) || 1
      };
      let isFirstUpdate = true;
      function handleObserve(entries) {
        const ratio = entries[0].intersectionRatio;
        if (ratio !== threshold) {
          if (!isFirstUpdate) {
            return refresh();
          }
          if (!ratio) {
            timeoutId = setTimeout(() => {
              refresh(false, 1e-7);
            }, 1e3);
          } else {
            refresh(false, ratio);
          }
        }
        if (ratio === 1 && !rectsAreEqual(elementRectForRootMargin, element.getBoundingClientRect())) {
          refresh();
        }
        isFirstUpdate = false;
      }
      try {
        io = new IntersectionObserver(handleObserve, {
          ...options,
root: root.ownerDocument
        });
      } catch (_e) {
        io = new IntersectionObserver(handleObserve, options);
      }
      io.observe(element);
    }
    refresh(true);
    return cleanup;
  }
  function autoUpdate(reference, floating, update, options) {
    if (options === void 0) {
      options = {};
    }
    const {
      ancestorScroll = true,
      ancestorResize = true,
      elementResize = typeof ResizeObserver === "function",
      layoutShift = typeof IntersectionObserver === "function",
      animationFrame = false
    } = options;
    const referenceEl = unwrapElement(reference);
    const ancestors = ancestorScroll || ancestorResize ? [...referenceEl ? getOverflowAncestors(referenceEl) : [], ...getOverflowAncestors(floating)] : [];
    ancestors.forEach((ancestor) => {
      ancestorScroll && ancestor.addEventListener("scroll", update, {
        passive: true
      });
      ancestorResize && ancestor.addEventListener("resize", update);
    });
    const cleanupIo = referenceEl && layoutShift ? observeMove(referenceEl, update) : null;
    let reobserveFrame = -1;
    let resizeObserver = null;
    if (elementResize) {
      resizeObserver = new ResizeObserver((_ref) => {
        let [firstEntry] = _ref;
        if (firstEntry && firstEntry.target === referenceEl && resizeObserver) {
          resizeObserver.unobserve(floating);
          cancelAnimationFrame(reobserveFrame);
          reobserveFrame = requestAnimationFrame(() => {
            var _resizeObserver;
            (_resizeObserver = resizeObserver) == null || _resizeObserver.observe(floating);
          });
        }
        update();
      });
      if (referenceEl && !animationFrame) {
        resizeObserver.observe(referenceEl);
      }
      resizeObserver.observe(floating);
    }
    let frameId;
    let prevRefRect = animationFrame ? getBoundingClientRect(reference) : null;
    if (animationFrame) {
      frameLoop();
    }
    function frameLoop() {
      const nextRefRect = getBoundingClientRect(reference);
      if (prevRefRect && !rectsAreEqual(prevRefRect, nextRefRect)) {
        update();
      }
      prevRefRect = nextRefRect;
      frameId = requestAnimationFrame(frameLoop);
    }
    update();
    return () => {
      var _resizeObserver2;
      ancestors.forEach((ancestor) => {
        ancestorScroll && ancestor.removeEventListener("scroll", update);
        ancestorResize && ancestor.removeEventListener("resize", update);
      });
      cleanupIo == null || cleanupIo();
      (_resizeObserver2 = resizeObserver) == null || _resizeObserver2.disconnect();
      resizeObserver = null;
      if (animationFrame) {
        cancelAnimationFrame(frameId);
      }
    };
  }
  const offset$1 = offset$2;
  const shift$1 = shift$2;
  const flip$1 = flip$2;
  const size$1 = size$2;
  const hide$1 = hide$2;
  const arrow$2 = arrow$3;
  const limitShift$1 = limitShift$2;
  const computePosition = (reference, floating, options) => {
    const cache = new Map();
    const mergedOptions = {
      platform,
      ...options
    };
    const platformWithCache = {
      ...mergedOptions.platform,
      _c: cache
    };
    return computePosition$1(reference, floating, {
      ...mergedOptions,
      platform: platformWithCache
    });
  };
  var isClient = typeof document !== "undefined";
  var noop = function noop2() {
  };
  var index$1 = isClient ? React.useLayoutEffect : noop;
  function deepEqual(a2, b) {
    if (a2 === b) {
      return true;
    }
    if (typeof a2 !== typeof b) {
      return false;
    }
    if (typeof a2 === "function" && a2.toString() === b.toString()) {
      return true;
    }
    let length;
    let i2;
    let keys;
    if (a2 && b && typeof a2 === "object") {
      if (Array.isArray(a2)) {
        length = a2.length;
        if (length !== b.length) return false;
        for (i2 = length; i2-- !== 0; ) {
          if (!deepEqual(a2[i2], b[i2])) {
            return false;
          }
        }
        return true;
      }
      keys = Object.keys(a2);
      length = keys.length;
      if (length !== Object.keys(b).length) {
        return false;
      }
      for (i2 = length; i2-- !== 0; ) {
        if (!{}.hasOwnProperty.call(b, keys[i2])) {
          return false;
        }
      }
      for (i2 = length; i2-- !== 0; ) {
        const key = keys[i2];
        if (key === "_owner" && a2.$$typeof) {
          continue;
        }
        if (!deepEqual(a2[key], b[key])) {
          return false;
        }
      }
      return true;
    }
    return a2 !== a2 && b !== b;
  }
  function getDPR(element) {
    if (typeof window === "undefined") {
      return 1;
    }
    const win = element.ownerDocument.defaultView || window;
    return win.devicePixelRatio || 1;
  }
  function roundByDPR(element, value) {
    const dpr = getDPR(element);
    return Math.round(value * dpr) / dpr;
  }
  function useLatestRef(value) {
    const ref = React__namespace.useRef(value);
    index$1(() => {
      ref.current = value;
    });
    return ref;
  }
  function useFloating(options) {
    if (options === void 0) {
      options = {};
    }
    const {
      placement = "bottom",
      strategy = "absolute",
      middleware = [],
      platform: platform2,
      elements: {
        reference: externalReference,
        floating: externalFloating
      } = {},
      transform = true,
      whileElementsMounted,
      open
    } = options;
    const [data, setData] = React__namespace.useState({
      x: 0,
      y: 0,
      strategy,
      placement,
      middlewareData: {},
      isPositioned: false
    });
    const [latestMiddleware, setLatestMiddleware] = React__namespace.useState(middleware);
    if (!deepEqual(latestMiddleware, middleware)) {
      setLatestMiddleware(middleware);
    }
    const [_reference, _setReference] = React__namespace.useState(null);
    const [_floating, _setFloating] = React__namespace.useState(null);
    const setReference = React__namespace.useCallback((node) => {
      if (node !== referenceRef.current) {
        referenceRef.current = node;
        _setReference(node);
      }
    }, []);
    const setFloating = React__namespace.useCallback((node) => {
      if (node !== floatingRef.current) {
        floatingRef.current = node;
        _setFloating(node);
      }
    }, []);
    const referenceEl = externalReference || _reference;
    const floatingEl = externalFloating || _floating;
    const referenceRef = React__namespace.useRef(null);
    const floatingRef = React__namespace.useRef(null);
    const dataRef = React__namespace.useRef(data);
    const hasWhileElementsMounted = whileElementsMounted != null;
    const whileElementsMountedRef = useLatestRef(whileElementsMounted);
    const platformRef = useLatestRef(platform2);
    const openRef = useLatestRef(open);
    const update = React__namespace.useCallback(() => {
      if (!referenceRef.current || !floatingRef.current) {
        return;
      }
      const config2 = {
        placement,
        strategy,
        middleware: latestMiddleware
      };
      if (platformRef.current) {
        config2.platform = platformRef.current;
      }
      computePosition(referenceRef.current, floatingRef.current, config2).then((data2) => {
        const fullData = {
          ...data2,



isPositioned: openRef.current !== false
        };
        if (isMountedRef.current && !deepEqual(dataRef.current, fullData)) {
          dataRef.current = fullData;
          reactDomExports.flushSync(() => {
            setData(fullData);
          });
        }
      });
    }, [latestMiddleware, placement, strategy, platformRef, openRef]);
    index$1(() => {
      if (open === false && dataRef.current.isPositioned) {
        dataRef.current.isPositioned = false;
        setData((data2) => ({
          ...data2,
          isPositioned: false
        }));
      }
    }, [open]);
    const isMountedRef = React__namespace.useRef(false);
    index$1(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
      };
    }, []);
    index$1(() => {
      if (referenceEl) referenceRef.current = referenceEl;
      if (floatingEl) floatingRef.current = floatingEl;
      if (referenceEl && floatingEl) {
        if (whileElementsMountedRef.current) {
          return whileElementsMountedRef.current(referenceEl, floatingEl, update);
        }
        update();
      }
    }, [referenceEl, floatingEl, update, whileElementsMountedRef, hasWhileElementsMounted]);
    const refs = React__namespace.useMemo(() => ({
      reference: referenceRef,
      floating: floatingRef,
      setReference,
      setFloating
    }), [setReference, setFloating]);
    const elements = React__namespace.useMemo(() => ({
      reference: referenceEl,
      floating: floatingEl
    }), [referenceEl, floatingEl]);
    const floatingStyles = React__namespace.useMemo(() => {
      const initialStyles = {
        position: strategy,
        left: 0,
        top: 0
      };
      if (!elements.floating) {
        return initialStyles;
      }
      const x2 = roundByDPR(elements.floating, data.x);
      const y = roundByDPR(elements.floating, data.y);
      if (transform) {
        return {
          ...initialStyles,
          transform: "translate(" + x2 + "px, " + y + "px)",
          ...getDPR(elements.floating) >= 1.5 && {
            willChange: "transform"
          }
        };
      }
      return {
        position: strategy,
        left: x2,
        top: y
      };
    }, [strategy, transform, elements.floating, data.x, data.y]);
    return React__namespace.useMemo(() => ({
      ...data,
      update,
      refs,
      elements,
      floatingStyles
    }), [data, update, refs, elements, floatingStyles]);
  }
  const arrow$1 = (options) => {
    function isRef(value) {
      return {}.hasOwnProperty.call(value, "current");
    }
    return {
      name: "arrow",
      options,
      fn(state) {
        const {
          element,
          padding
        } = typeof options === "function" ? options(state) : options;
        if (element && isRef(element)) {
          if (element.current != null) {
            return arrow$2({
              element: element.current,
              padding
            }).fn(state);
          }
          return {};
        }
        if (element) {
          return arrow$2({
            element,
            padding
          }).fn(state);
        }
        return {};
      }
    };
  };
  const offset = (options, deps) => ({
    ...offset$1(options),
    options: [options, deps]
  });
  const shift = (options, deps) => ({
    ...shift$1(options),
    options: [options, deps]
  });
  const limitShift = (options, deps) => ({
    ...limitShift$1(options),
    options: [options, deps]
  });
  const flip = (options, deps) => ({
    ...flip$1(options),
    options: [options, deps]
  });
  const size = (options, deps) => ({
    ...size$1(options),
    options: [options, deps]
  });
  const hide = (options, deps) => ({
    ...hide$1(options),
    options: [options, deps]
  });
  const arrow = (options, deps) => ({
    ...arrow$1(options),
    options: [options, deps]
  });
  var NAME$3 = "Arrow";
  var Arrow$1 = React__namespace.forwardRef((props, forwardedRef) => {
    const { children, width = 10, height = 5, ...arrowProps } = props;
    return jsxRuntimeExports.jsx(
      Primitive.svg,
      {
        ...arrowProps,
        ref: forwardedRef,
        width,
        height,
        viewBox: "0 0 30 10",
        preserveAspectRatio: "none",
        children: props.asChild ? children : jsxRuntimeExports.jsx("polygon", { points: "0,0 30,0 15,10" })
      }
    );
  });
  Arrow$1.displayName = NAME$3;
  var Root$5 = Arrow$1;
  function useSize(element) {
    const [size2, setSize] = React__namespace.useState(void 0);
    useLayoutEffect2(() => {
      if (element) {
        setSize({ width: element.offsetWidth, height: element.offsetHeight });
        const resizeObserver = new ResizeObserver((entries) => {
          if (!Array.isArray(entries)) {
            return;
          }
          if (!entries.length) {
            return;
          }
          const entry = entries[0];
          let width;
          let height;
          if ("borderBoxSize" in entry) {
            const borderSizeEntry = entry["borderBoxSize"];
            const borderSize = Array.isArray(borderSizeEntry) ? borderSizeEntry[0] : borderSizeEntry;
            width = borderSize["inlineSize"];
            height = borderSize["blockSize"];
          } else {
            width = element.offsetWidth;
            height = element.offsetHeight;
          }
          setSize({ width, height });
        });
        resizeObserver.observe(element, { box: "border-box" });
        return () => resizeObserver.unobserve(element);
      } else {
        setSize(void 0);
      }
    }, [element]);
    return size2;
  }
  var POPPER_NAME = "Popper";
  var [createPopperContext, createPopperScope] = createContextScope(POPPER_NAME);
  var [PopperProvider, usePopperContext] = createPopperContext(POPPER_NAME);
  var Popper = (props) => {
    const { __scopePopper, children } = props;
    const [anchor, setAnchor] = React__namespace.useState(null);
    return jsxRuntimeExports.jsx(PopperProvider, { scope: __scopePopper, anchor, onAnchorChange: setAnchor, children });
  };
  Popper.displayName = POPPER_NAME;
  var ANCHOR_NAME$2 = "PopperAnchor";
  var PopperAnchor = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopper, virtualRef, ...anchorProps } = props;
      const context = usePopperContext(ANCHOR_NAME$2, __scopePopper);
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs$1(forwardedRef, ref);
      const anchorRef = React__namespace.useRef(null);
      React__namespace.useEffect(() => {
        const previousAnchor = anchorRef.current;
        anchorRef.current = virtualRef?.current || ref.current;
        if (previousAnchor !== anchorRef.current) {
          context.onAnchorChange(anchorRef.current);
        }
      });
      return virtualRef ? null : jsxRuntimeExports.jsx(Primitive.div, { ...anchorProps, ref: composedRefs });
    }
  );
  PopperAnchor.displayName = ANCHOR_NAME$2;
  var CONTENT_NAME$6 = "PopperContent";
  var [PopperContentProvider, useContentContext] = createPopperContext(CONTENT_NAME$6);
  var PopperContent = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopePopper,
        side = "bottom",
        sideOffset = 0,
        align = "center",
        alignOffset = 0,
        arrowPadding = 0,
        avoidCollisions = true,
        collisionBoundary = [],
        collisionPadding: collisionPaddingProp = 0,
        sticky = "partial",
        hideWhenDetached = false,
        updatePositionStrategy = "optimized",
        onPlaced,
        ...contentProps
      } = props;
      const context = usePopperContext(CONTENT_NAME$6, __scopePopper);
      const [content, setContent] = React__namespace.useState(null);
      const composedRefs = useComposedRefs$1(forwardedRef, (node) => setContent(node));
      const [arrow$12, setArrow] = React__namespace.useState(null);
      const arrowSize = useSize(arrow$12);
      const arrowWidth = arrowSize?.width ?? 0;
      const arrowHeight = arrowSize?.height ?? 0;
      const desiredPlacement = side + (align !== "center" ? "-" + align : "");
      const collisionPadding = typeof collisionPaddingProp === "number" ? collisionPaddingProp : { top: 0, right: 0, bottom: 0, left: 0, ...collisionPaddingProp };
      const boundary = Array.isArray(collisionBoundary) ? collisionBoundary : [collisionBoundary];
      const hasExplicitBoundaries = boundary.length > 0;
      const detectOverflowOptions = {
        padding: collisionPadding,
        boundary: boundary.filter(isNotNull),
altBoundary: hasExplicitBoundaries
      };
      const { refs, floatingStyles, placement, isPositioned, middlewareData } = useFloating({
strategy: "fixed",
        placement: desiredPlacement,
        whileElementsMounted: (...args) => {
          const cleanup = autoUpdate(...args, {
            animationFrame: updatePositionStrategy === "always"
          });
          return cleanup;
        },
        elements: {
          reference: context.anchor
        },
        middleware: [
          offset({ mainAxis: sideOffset + arrowHeight, alignmentAxis: alignOffset }),
          avoidCollisions && shift({
            mainAxis: true,
            crossAxis: false,
            limiter: sticky === "partial" ? limitShift() : void 0,
            ...detectOverflowOptions
          }),
          avoidCollisions && flip({ ...detectOverflowOptions }),
          size({
            ...detectOverflowOptions,
            apply: ({ elements, rects, availableWidth, availableHeight }) => {
              const { width: anchorWidth, height: anchorHeight } = rects.reference;
              const contentStyle = elements.floating.style;
              contentStyle.setProperty("--radix-popper-available-width", `${availableWidth}px`);
              contentStyle.setProperty("--radix-popper-available-height", `${availableHeight}px`);
              contentStyle.setProperty("--radix-popper-anchor-width", `${anchorWidth}px`);
              contentStyle.setProperty("--radix-popper-anchor-height", `${anchorHeight}px`);
            }
          }),
          arrow$12 && arrow({ element: arrow$12, padding: arrowPadding }),
          transformOrigin({ arrowWidth, arrowHeight }),
          hideWhenDetached && hide({ strategy: "referenceHidden", ...detectOverflowOptions })
        ]
      });
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const handlePlaced = useCallbackRef$1(onPlaced);
      useLayoutEffect2(() => {
        if (isPositioned) {
          handlePlaced?.();
        }
      }, [isPositioned, handlePlaced]);
      const arrowX = middlewareData.arrow?.x;
      const arrowY = middlewareData.arrow?.y;
      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const [contentZIndex, setContentZIndex] = React__namespace.useState();
      useLayoutEffect2(() => {
        if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
      }, [content]);
      return jsxRuntimeExports.jsx(
        "div",
        {
          ref: refs.setFloating,
          "data-radix-popper-content-wrapper": "",
          style: {
            ...floatingStyles,
            transform: isPositioned ? floatingStyles.transform : "translate(0, -200%)",
minWidth: "max-content",
            zIndex: contentZIndex,
            ["--radix-popper-transform-origin"]: [
              middlewareData.transformOrigin?.x,
              middlewareData.transformOrigin?.y
            ].join(" "),


...middlewareData.hide?.referenceHidden && {
              visibility: "hidden",
              pointerEvents: "none"
            }
          },
          dir: props.dir,
          children: jsxRuntimeExports.jsx(
            PopperContentProvider,
            {
              scope: __scopePopper,
              placedSide,
              onArrowChange: setArrow,
              arrowX,
              arrowY,
              shouldHideArrow: cannotCenterArrow,
              children: jsxRuntimeExports.jsx(
                Primitive.div,
                {
                  "data-side": placedSide,
                  "data-align": placedAlign,
                  ...contentProps,
                  ref: composedRefs,
                  style: {
                    ...contentProps.style,

animation: !isPositioned ? "none" : void 0
                  }
                }
              )
            }
          )
        }
      );
    }
  );
  PopperContent.displayName = CONTENT_NAME$6;
  var ARROW_NAME$4 = "PopperArrow";
  var OPPOSITE_SIDE = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right"
  };
  var PopperArrow = React__namespace.forwardRef(function PopperArrow2(props, forwardedRef) {
    const { __scopePopper, ...arrowProps } = props;
    const contentContext = useContentContext(ARROW_NAME$4, __scopePopper);
    const baseSide = OPPOSITE_SIDE[contentContext.placedSide];
    return (



jsxRuntimeExports.jsx(
        "span",
        {
          ref: contentContext.onArrowChange,
          style: {
            position: "absolute",
            left: contentContext.arrowX,
            top: contentContext.arrowY,
            [baseSide]: 0,
            transformOrigin: {
              top: "",
              right: "0 0",
              bottom: "center 0",
              left: "100% 0"
            }[contentContext.placedSide],
            transform: {
              top: "translateY(100%)",
              right: "translateY(50%) rotate(90deg) translateX(-50%)",
              bottom: `rotate(180deg)`,
              left: "translateY(50%) rotate(-90deg) translateX(50%)"
            }[contentContext.placedSide],
            visibility: contentContext.shouldHideArrow ? "hidden" : void 0
          },
          children: jsxRuntimeExports.jsx(
            Root$5,
            {
              ...arrowProps,
              ref: forwardedRef,
              style: {
                ...arrowProps.style,
display: "block"
              }
            }
          )
        }
      )
    );
  });
  PopperArrow.displayName = ARROW_NAME$4;
  function isNotNull(value) {
    return value !== null;
  }
  var transformOrigin = (options) => ({
    name: "transformOrigin",
    options,
    fn(data) {
      const { placement, rects, middlewareData } = data;
      const cannotCenterArrow = middlewareData.arrow?.centerOffset !== 0;
      const isArrowHidden = cannotCenterArrow;
      const arrowWidth = isArrowHidden ? 0 : options.arrowWidth;
      const arrowHeight = isArrowHidden ? 0 : options.arrowHeight;
      const [placedSide, placedAlign] = getSideAndAlignFromPlacement(placement);
      const noArrowAlign = { start: "0%", center: "50%", end: "100%" }[placedAlign];
      const arrowXCenter = (middlewareData.arrow?.x ?? 0) + arrowWidth / 2;
      const arrowYCenter = (middlewareData.arrow?.y ?? 0) + arrowHeight / 2;
      let x2 = "";
      let y = "";
      if (placedSide === "bottom") {
        x2 = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${-arrowHeight}px`;
      } else if (placedSide === "top") {
        x2 = isArrowHidden ? noArrowAlign : `${arrowXCenter}px`;
        y = `${rects.floating.height + arrowHeight}px`;
      } else if (placedSide === "right") {
        x2 = `${-arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      } else if (placedSide === "left") {
        x2 = `${rects.floating.width + arrowHeight}px`;
        y = isArrowHidden ? noArrowAlign : `${arrowYCenter}px`;
      }
      return { data: { x: x2, y } };
    }
  });
  function getSideAndAlignFromPlacement(placement) {
    const [side, align = "center"] = placement.split("-");
    return [side, align];
  }
  var Root2$3 = Popper;
  var Anchor = PopperAnchor;
  var Content$2 = PopperContent;
  var Arrow = PopperArrow;
  var PORTAL_NAME$5 = "Portal";
  var Portal$4 = React__namespace.forwardRef((props, forwardedRef) => {
    const { container: containerProp, ...portalProps } = props;
    const [mounted, setMounted] = React__namespace.useState(false);
    useLayoutEffect2(() => setMounted(true), []);
    const container = containerProp || mounted && globalThis?.document?.body;
    return container ? ReactDOM.createPortal( jsxRuntimeExports.jsx(Primitive.div, { ...portalProps, ref: forwardedRef }), container) : null;
  });
  Portal$4.displayName = PORTAL_NAME$5;
  var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
  var EVENT_OPTIONS = { bubbles: false, cancelable: true };
  var GROUP_NAME$2 = "RovingFocusGroup";
  var [Collection$1, useCollection$1, createCollectionScope$1] = createCollection(GROUP_NAME$2);
  var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
    GROUP_NAME$2,
    [createCollectionScope$1]
  );
  var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME$2);
  var RovingFocusGroup = React__namespace.forwardRef(
    (props, forwardedRef) => {
      return jsxRuntimeExports.jsx(Collection$1.Provider, { scope: props.__scopeRovingFocusGroup, children: jsxRuntimeExports.jsx(Collection$1.Slot, { scope: props.__scopeRovingFocusGroup, children: jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
    }
  );
  RovingFocusGroup.displayName = GROUP_NAME$2;
  var RovingFocusGroupImpl = React__namespace.forwardRef((props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      orientation,
      loop = false,
      dir,
      currentTabStopId: currentTabStopIdProp,
      defaultCurrentTabStopId,
      onCurrentTabStopIdChange,
      onEntryFocus,
      preventScrollOnEntryFocus = false,
      ...groupProps
    } = props;
    const ref = React__namespace.useRef(null);
    const composedRefs = useComposedRefs$1(forwardedRef, ref);
    const direction = useDirection(dir);
    const [currentTabStopId, setCurrentTabStopId] = useControllableState({
      prop: currentTabStopIdProp,
      defaultProp: defaultCurrentTabStopId ?? null,
      onChange: onCurrentTabStopIdChange,
      caller: GROUP_NAME$2
    });
    const [isTabbingBackOut, setIsTabbingBackOut] = React__namespace.useState(false);
    const handleEntryFocus = useCallbackRef$1(onEntryFocus);
    const getItems = useCollection$1(__scopeRovingFocusGroup);
    const isClickFocusRef = React__namespace.useRef(false);
    const [focusableItemsCount, setFocusableItemsCount] = React__namespace.useState(0);
    React__namespace.useEffect(() => {
      const node = ref.current;
      if (node) {
        node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
        return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
      }
    }, [handleEntryFocus]);
    return jsxRuntimeExports.jsx(
      RovingFocusProvider,
      {
        scope: __scopeRovingFocusGroup,
        orientation,
        dir: direction,
        loop,
        currentTabStopId,
        onItemFocus: React__namespace.useCallback(
          (tabStopId) => setCurrentTabStopId(tabStopId),
          [setCurrentTabStopId]
        ),
        onItemShiftTab: React__namespace.useCallback(() => setIsTabbingBackOut(true), []),
        onFocusableItemAdd: React__namespace.useCallback(
          () => setFocusableItemsCount((prevCount) => prevCount + 1),
          []
        ),
        onFocusableItemRemove: React__namespace.useCallback(
          () => setFocusableItemsCount((prevCount) => prevCount - 1),
          []
        ),
        children: jsxRuntimeExports.jsx(
          Primitive.div,
          {
            tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
            "data-orientation": orientation,
            ...groupProps,
            ref: composedRefs,
            style: { outline: "none", ...props.style },
            onMouseDown: composeEventHandlers(props.onMouseDown, () => {
              isClickFocusRef.current = true;
            }),
            onFocus: composeEventHandlers(props.onFocus, (event) => {
              const isKeyboardFocus = !isClickFocusRef.current;
              if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
                const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
                event.currentTarget.dispatchEvent(entryFocusEvent);
                if (!entryFocusEvent.defaultPrevented) {
                  const items = getItems().filter((item) => item.focusable);
                  const activeItem = items.find((item) => item.active);
                  const currentItem = items.find((item) => item.id === currentTabStopId);
                  const candidateItems = [activeItem, currentItem, ...items].filter(
                    Boolean
                  );
                  const candidateNodes = candidateItems.map((item) => item.ref.current);
                  focusFirst$1(candidateNodes, preventScrollOnEntryFocus);
                }
              }
              isClickFocusRef.current = false;
            }),
            onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
          }
        )
      }
    );
  });
  var ITEM_NAME$2 = "RovingFocusGroupItem";
  var RovingFocusGroupItem = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeRovingFocusGroup,
        focusable = true,
        active = false,
        tabStopId,
        children,
        ...itemProps
      } = props;
      const autoId = useId();
      const id2 = tabStopId || autoId;
      const context = useRovingFocusContext(ITEM_NAME$2, __scopeRovingFocusGroup);
      const isCurrentTabStop = context.currentTabStopId === id2;
      const getItems = useCollection$1(__scopeRovingFocusGroup);
      const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
      React__namespace.useEffect(() => {
        if (focusable) {
          onFocusableItemAdd();
          return () => onFocusableItemRemove();
        }
      }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
      return jsxRuntimeExports.jsx(
        Collection$1.ItemSlot,
        {
          scope: __scopeRovingFocusGroup,
          id: id2,
          focusable,
          active,
          children: jsxRuntimeExports.jsx(
            Primitive.span,
            {
              tabIndex: isCurrentTabStop ? 0 : -1,
              "data-orientation": context.orientation,
              ...itemProps,
              ref: forwardedRef,
              onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
                if (!focusable) event.preventDefault();
                else context.onItemFocus(id2);
              }),
              onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id2)),
              onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                if (event.key === "Tab" && event.shiftKey) {
                  context.onItemShiftTab();
                  return;
                }
                if (event.target !== event.currentTarget) return;
                const focusIntent = getFocusIntent(event, context.orientation, context.dir);
                if (focusIntent !== void 0) {
                  if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                  event.preventDefault();
                  const items = getItems().filter((item) => item.focusable);
                  let candidateNodes = items.map((item) => item.ref.current);
                  if (focusIntent === "last") candidateNodes.reverse();
                  else if (focusIntent === "prev" || focusIntent === "next") {
                    if (focusIntent === "prev") candidateNodes.reverse();
                    const currentIndex = candidateNodes.indexOf(event.currentTarget);
                    candidateNodes = context.loop ? wrapArray$1(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                  }
                  setTimeout(() => focusFirst$1(candidateNodes));
                }
              }),
              children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
            }
          )
        }
      );
    }
  );
  RovingFocusGroupItem.displayName = ITEM_NAME$2;
  var MAP_KEY_TO_FOCUS_INTENT = {
    ArrowLeft: "prev",
    ArrowUp: "prev",
    ArrowRight: "next",
    ArrowDown: "next",
    PageUp: "first",
    Home: "first",
    PageDown: "last",
    End: "last"
  };
  function getDirectionAwareKey(key, dir) {
    if (dir !== "rtl") return key;
    return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
  }
  function getFocusIntent(event, orientation, dir) {
    const key = getDirectionAwareKey(event.key, dir);
    if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
    if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
    return MAP_KEY_TO_FOCUS_INTENT[key];
  }
  function focusFirst$1(candidates, preventScroll = false) {
    const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
    for (const candidate of candidates) {
      if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
      candidate.focus({ preventScroll });
      if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
    }
  }
  function wrapArray$1(array, startIndex) {
    return array.map((_, index2) => array[(startIndex + index2) % array.length]);
  }
  var Root$4 = RovingFocusGroup;
  var Item = RovingFocusGroupItem;
  var getDefaultParent = function(originalTarget) {
    if (typeof document === "undefined") {
      return null;
    }
    var sampleTarget = Array.isArray(originalTarget) ? originalTarget[0] : originalTarget;
    return sampleTarget.ownerDocument.body;
  };
  var counterMap = new WeakMap();
  var uncontrolledNodes = new WeakMap();
  var markerMap = {};
  var lockCount = 0;
  var unwrapHost = function(node) {
    return node && (node.host || unwrapHost(node.parentNode));
  };
  var correctTargets = function(parent, targets) {
    return targets.map(function(target) {
      if (parent.contains(target)) {
        return target;
      }
      var correctedTarget = unwrapHost(target);
      if (correctedTarget && parent.contains(correctedTarget)) {
        return correctedTarget;
      }
      console.error("aria-hidden", target, "in not contained inside", parent, ". Doing nothing");
      return null;
    }).filter(function(x2) {
      return Boolean(x2);
    });
  };
  var applyAttributeToOthers = function(originalTarget, parentNode, markerName, controlAttribute) {
    var targets = correctTargets(parentNode, Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    if (!markerMap[markerName]) {
      markerMap[markerName] = new WeakMap();
    }
    var markerCounter = markerMap[markerName];
    var hiddenNodes = [];
    var elementsToKeep = new Set();
    var elementsToStop = new Set(targets);
    var keep = function(el) {
      if (!el || elementsToKeep.has(el)) {
        return;
      }
      elementsToKeep.add(el);
      keep(el.parentNode);
    };
    targets.forEach(keep);
    var deep = function(parent) {
      if (!parent || elementsToStop.has(parent)) {
        return;
      }
      Array.prototype.forEach.call(parent.children, function(node) {
        if (elementsToKeep.has(node)) {
          deep(node);
        } else {
          try {
            var attr = node.getAttribute(controlAttribute);
            var alreadyHidden = attr !== null && attr !== "false";
            var counterValue = (counterMap.get(node) || 0) + 1;
            var markerValue = (markerCounter.get(node) || 0) + 1;
            counterMap.set(node, counterValue);
            markerCounter.set(node, markerValue);
            hiddenNodes.push(node);
            if (counterValue === 1 && alreadyHidden) {
              uncontrolledNodes.set(node, true);
            }
            if (markerValue === 1) {
              node.setAttribute(markerName, "true");
            }
            if (!alreadyHidden) {
              node.setAttribute(controlAttribute, "true");
            }
          } catch (e) {
            console.error("aria-hidden: cannot operate on ", node, e);
          }
        }
      });
    };
    deep(parentNode);
    elementsToKeep.clear();
    lockCount++;
    return function() {
      hiddenNodes.forEach(function(node) {
        var counterValue = counterMap.get(node) - 1;
        var markerValue = markerCounter.get(node) - 1;
        counterMap.set(node, counterValue);
        markerCounter.set(node, markerValue);
        if (!counterValue) {
          if (!uncontrolledNodes.has(node)) {
            node.removeAttribute(controlAttribute);
          }
          uncontrolledNodes.delete(node);
        }
        if (!markerValue) {
          node.removeAttribute(markerName);
        }
      });
      lockCount--;
      if (!lockCount) {
        counterMap = new WeakMap();
        counterMap = new WeakMap();
        uncontrolledNodes = new WeakMap();
        markerMap = {};
      }
    };
  };
  var hideOthers = function(originalTarget, parentNode, markerName) {
    if (markerName === void 0) {
      markerName = "data-aria-hidden";
    }
    var targets = Array.from(Array.isArray(originalTarget) ? originalTarget : [originalTarget]);
    var activeParentNode = getDefaultParent(originalTarget);
    if (!activeParentNode) {
      return function() {
        return null;
      };
    }
    targets.push.apply(targets, Array.from(activeParentNode.querySelectorAll("[aria-live], script")));
    return applyAttributeToOthers(targets, activeParentNode, markerName, "aria-hidden");
  };
  var __assign = function() {
    __assign = Object.assign || function __assign2(t2) {
      for (var s2, i2 = 1, n2 = arguments.length; i2 < n2; i2++) {
        s2 = arguments[i2];
        for (var p in s2) if (Object.prototype.hasOwnProperty.call(s2, p)) t2[p] = s2[p];
      }
      return t2;
    };
    return __assign.apply(this, arguments);
  };
  function __rest(s2, e) {
    var t2 = {};
    for (var p in s2) if (Object.prototype.hasOwnProperty.call(s2, p) && e.indexOf(p) < 0)
      t2[p] = s2[p];
    if (s2 != null && typeof Object.getOwnPropertySymbols === "function")
      for (var i2 = 0, p = Object.getOwnPropertySymbols(s2); i2 < p.length; i2++) {
        if (e.indexOf(p[i2]) < 0 && Object.prototype.propertyIsEnumerable.call(s2, p[i2]))
          t2[p[i2]] = s2[p[i2]];
      }
    return t2;
  }
  function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P ? value : new P(function(resolve) {
        resolve(value);
      });
    }
    return new (P || (P = Promise))(function(resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, [])).next());
    });
  }
  function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() {
      if (t2[0] & 1) throw t2[1];
      return t2[1];
    }, trys: [], ops: [] }, f, y, t2, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() {
      return this;
    }), g;
    function verb(n2) {
      return function(v) {
        return step([n2, v]);
      };
    }
    function step(op) {
      if (f) throw new TypeError("Generator is already executing.");
      while (g && (g = 0, op[0] && (_ = 0)), _) try {
        if (f = 1, y && (t2 = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t2 = y["return"]) && t2.call(y), 0) : y.next) && !(t2 = t2.call(y, op[1])).done) return t2;
        if (y = 0, t2) op = [op[0] & 2, t2.value];
        switch (op[0]) {
          case 0:
          case 1:
            t2 = op;
            break;
          case 4:
            _.label++;
            return { value: op[1], done: false };
          case 5:
            _.label++;
            y = op[1];
            op = [0];
            continue;
          case 7:
            op = _.ops.pop();
            _.trys.pop();
            continue;
          default:
            if (!(t2 = _.trys, t2 = t2.length > 0 && t2[t2.length - 1]) && (op[0] === 6 || op[0] === 2)) {
              _ = 0;
              continue;
            }
            if (op[0] === 3 && (!t2 || op[1] > t2[0] && op[1] < t2[3])) {
              _.label = op[1];
              break;
            }
            if (op[0] === 6 && _.label < t2[1]) {
              _.label = t2[1];
              t2 = op;
              break;
            }
            if (t2 && _.label < t2[2]) {
              _.label = t2[2];
              _.ops.push(op);
              break;
            }
            if (t2[2]) _.ops.pop();
            _.trys.pop();
            continue;
        }
        op = body.call(thisArg, _);
      } catch (e) {
        op = [6, e];
        y = 0;
      } finally {
        f = t2 = 0;
      }
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  }
  function __spreadArray(to, from, pack) {
    for (var i2 = 0, l = from.length, ar; i2 < l; i2++) {
      if (ar || !(i2 in from)) {
        if (!ar) ar = Array.prototype.slice.call(from, 0, i2);
        ar[i2] = from[i2];
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  }
  typeof SuppressedError === "function" ? SuppressedError : function(error2, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error2, e.suppressed = suppressed, e;
  };
  var zeroRightClassName = "right-scroll-bar-position";
  var fullWidthClassName = "width-before-scroll-bar";
  var noScrollbarsClassName = "with-scroll-bars-hidden";
  var removedBarSizeVariable = "--removed-body-scroll-bar-size";
  function assignRef(ref, value) {
    if (typeof ref === "function") {
      ref(value);
    } else if (ref) {
      ref.current = value;
    }
    return ref;
  }
  function useCallbackRef(initialValue, callback) {
    var ref = React.useState(function() {
      return {
value: initialValue,
callback,
facade: {
          get current() {
            return ref.value;
          },
          set current(value) {
            var last = ref.value;
            if (last !== value) {
              ref.value = value;
              ref.callback(value, last);
            }
          }
        }
      };
    })[0];
    ref.callback = callback;
    return ref.facade;
  }
  var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React__namespace.useLayoutEffect : React__namespace.useEffect;
  var currentValues = new WeakMap();
  function useMergeRefs(refs, defaultValue) {
    var callbackRef = useCallbackRef(null, function(newValue) {
      return refs.forEach(function(ref) {
        return assignRef(ref, newValue);
      });
    });
    useIsomorphicLayoutEffect(function() {
      var oldValue = currentValues.get(callbackRef);
      if (oldValue) {
        var prevRefs_1 = new Set(oldValue);
        var nextRefs_1 = new Set(refs);
        var current_1 = callbackRef.current;
        prevRefs_1.forEach(function(ref) {
          if (!nextRefs_1.has(ref)) {
            assignRef(ref, null);
          }
        });
        nextRefs_1.forEach(function(ref) {
          if (!prevRefs_1.has(ref)) {
            assignRef(ref, current_1);
          }
        });
      }
      currentValues.set(callbackRef, refs);
    }, [refs]);
    return callbackRef;
  }
  function ItoI(a2) {
    return a2;
  }
  function innerCreateMedium(defaults, middleware) {
    if (middleware === void 0) {
      middleware = ItoI;
    }
    var buffer = [];
    var assigned = false;
    var medium = {
      read: function() {
        if (assigned) {
          throw new Error("Sidecar: could not `read` from an `assigned` medium. `read` could be used only with `useMedium`.");
        }
        if (buffer.length) {
          return buffer[buffer.length - 1];
        }
        return defaults;
      },
      useMedium: function(data) {
        var item = middleware(data, assigned);
        buffer.push(item);
        return function() {
          buffer = buffer.filter(function(x2) {
            return x2 !== item;
          });
        };
      },
      assignSyncMedium: function(cb) {
        assigned = true;
        while (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
        }
        buffer = {
          push: function(x2) {
            return cb(x2);
          },
          filter: function() {
            return buffer;
          }
        };
      },
      assignMedium: function(cb) {
        assigned = true;
        var pendingQueue = [];
        if (buffer.length) {
          var cbs = buffer;
          buffer = [];
          cbs.forEach(cb);
          pendingQueue = buffer;
        }
        var executeQueue = function() {
          var cbs2 = pendingQueue;
          pendingQueue = [];
          cbs2.forEach(cb);
        };
        var cycle = function() {
          return Promise.resolve().then(executeQueue);
        };
        cycle();
        buffer = {
          push: function(x2) {
            pendingQueue.push(x2);
            cycle();
          },
          filter: function(filter2) {
            pendingQueue = pendingQueue.filter(filter2);
            return buffer;
          }
        };
      }
    };
    return medium;
  }
  function createSidecarMedium(options) {
    if (options === void 0) {
      options = {};
    }
    var medium = innerCreateMedium(null);
    medium.options = __assign({ async: true, ssr: false }, options);
    return medium;
  }
  var SideCar$1 = function(_a) {
    var sideCar = _a.sideCar, rest = __rest(_a, ["sideCar"]);
    if (!sideCar) {
      throw new Error("Sidecar: please provide `sideCar` property to import the right car");
    }
    var Target = sideCar.read();
    if (!Target) {
      throw new Error("Sidecar medium not found");
    }
    return React__namespace.createElement(Target, __assign({}, rest));
  };
  SideCar$1.isSideCarExport = true;
  function exportSidecar(medium, exported) {
    medium.useMedium(exported);
    return SideCar$1;
  }
  var effectCar = createSidecarMedium();
  var nothing = function() {
    return;
  };
  var RemoveScroll = React__namespace.forwardRef(function(props, parentRef) {
    var ref = React__namespace.useRef(null);
    var _a = React__namespace.useState({
      onScrollCapture: nothing,
      onWheelCapture: nothing,
      onTouchMoveCapture: nothing
    }), callbacks = _a[0], setCallbacks = _a[1];
    var forwardProps = props.forwardProps, children = props.children, className = props.className, removeScrollBar = props.removeScrollBar, enabled = props.enabled, shards = props.shards, sideCar = props.sideCar, noRelative = props.noRelative, noIsolation = props.noIsolation, inert = props.inert, allowPinchZoom = props.allowPinchZoom, _b = props.as, Container = _b === void 0 ? "div" : _b, gapMode = props.gapMode, rest = __rest(props, ["forwardProps", "children", "className", "removeScrollBar", "enabled", "shards", "sideCar", "noRelative", "noIsolation", "inert", "allowPinchZoom", "as", "gapMode"]);
    var SideCar2 = sideCar;
    var containerRef = useMergeRefs([ref, parentRef]);
    var containerProps = __assign(__assign({}, rest), callbacks);
    return React__namespace.createElement(
      React__namespace.Fragment,
      null,
      enabled && React__namespace.createElement(SideCar2, { sideCar: effectCar, removeScrollBar, shards, noRelative, noIsolation, inert, setCallbacks, allowPinchZoom: !!allowPinchZoom, lockRef: ref, gapMode }),
      forwardProps ? React__namespace.cloneElement(React__namespace.Children.only(children), __assign(__assign({}, containerProps), { ref: containerRef })) : React__namespace.createElement(Container, __assign({}, containerProps, { className, ref: containerRef }), children)
    );
  });
  RemoveScroll.defaultProps = {
    enabled: true,
    removeScrollBar: true,
    inert: false
  };
  RemoveScroll.classNames = {
    fullWidth: fullWidthClassName,
    zeroRight: zeroRightClassName
  };
  var getNonce = function() {
    if (typeof __webpack_nonce__ !== "undefined") {
      return __webpack_nonce__;
    }
    return void 0;
  };
  function makeStyleTag() {
    if (!document)
      return null;
    var tag = document.createElement("style");
    tag.type = "text/css";
    var nonce = getNonce();
    if (nonce) {
      tag.setAttribute("nonce", nonce);
    }
    return tag;
  }
  function injectStyles(tag, css) {
    if (tag.styleSheet) {
      tag.styleSheet.cssText = css;
    } else {
      tag.appendChild(document.createTextNode(css));
    }
  }
  function insertStyleTag(tag) {
    var head = document.head || document.getElementsByTagName("head")[0];
    head.appendChild(tag);
  }
  var stylesheetSingleton = function() {
    var counter = 0;
    var stylesheet = null;
    return {
      add: function(style2) {
        if (counter == 0) {
          if (stylesheet = makeStyleTag()) {
            injectStyles(stylesheet, style2);
            insertStyleTag(stylesheet);
          }
        }
        counter++;
      },
      remove: function() {
        counter--;
        if (!counter && stylesheet) {
          stylesheet.parentNode && stylesheet.parentNode.removeChild(stylesheet);
          stylesheet = null;
        }
      }
    };
  };
  var styleHookSingleton = function() {
    var sheet = stylesheetSingleton();
    return function(styles, isDynamic) {
      React__namespace.useEffect(function() {
        sheet.add(styles);
        return function() {
          sheet.remove();
        };
      }, [styles && isDynamic]);
    };
  };
  var styleSingleton = function() {
    var useStyle2 = styleHookSingleton();
    var Sheet = function(_a) {
      var styles = _a.styles, dynamic = _a.dynamic;
      useStyle2(styles, dynamic);
      return null;
    };
    return Sheet;
  };
  var zeroGap = {
    left: 0,
    top: 0,
    right: 0,
    gap: 0
  };
  var parse$1 = function(x2) {
    return parseInt(x2 || "", 10) || 0;
  };
  var getOffset = function(gapMode) {
    var cs = window.getComputedStyle(document.body);
    var left = cs[gapMode === "padding" ? "paddingLeft" : "marginLeft"];
    var top = cs[gapMode === "padding" ? "paddingTop" : "marginTop"];
    var right = cs[gapMode === "padding" ? "paddingRight" : "marginRight"];
    return [parse$1(left), parse$1(top), parse$1(right)];
  };
  var getGapWidth = function(gapMode) {
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    if (typeof window === "undefined") {
      return zeroGap;
    }
    var offsets = getOffset(gapMode);
    var documentWidth = document.documentElement.clientWidth;
    var windowWidth = window.innerWidth;
    return {
      left: offsets[0],
      top: offsets[1],
      right: offsets[2],
      gap: Math.max(0, windowWidth - documentWidth + offsets[2] - offsets[0])
    };
  };
  var Style = styleSingleton();
  var lockAttribute = "data-scroll-locked";
  var getStyles = function(_a, allowRelative, gapMode, important) {
    var left = _a.left, top = _a.top, right = _a.right, gap = _a.gap;
    if (gapMode === void 0) {
      gapMode = "margin";
    }
    return "\n  .".concat(noScrollbarsClassName, " {\n   overflow: hidden ").concat(important, ";\n   padding-right: ").concat(gap, "px ").concat(important, ";\n  }\n  body[").concat(lockAttribute, "] {\n    overflow: hidden ").concat(important, ";\n    overscroll-behavior: contain;\n    ").concat([
      allowRelative && "position: relative ".concat(important, ";"),
      gapMode === "margin" && "\n    padding-left: ".concat(left, "px;\n    padding-top: ").concat(top, "px;\n    padding-right: ").concat(right, "px;\n    margin-left:0;\n    margin-top:0;\n    margin-right: ").concat(gap, "px ").concat(important, ";\n    "),
      gapMode === "padding" && "padding-right: ".concat(gap, "px ").concat(important, ";")
    ].filter(Boolean).join(""), "\n  }\n  \n  .").concat(zeroRightClassName, " {\n    right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " {\n    margin-right: ").concat(gap, "px ").concat(important, ";\n  }\n  \n  .").concat(zeroRightClassName, " .").concat(zeroRightClassName, " {\n    right: 0 ").concat(important, ";\n  }\n  \n  .").concat(fullWidthClassName, " .").concat(fullWidthClassName, " {\n    margin-right: 0 ").concat(important, ";\n  }\n  \n  body[").concat(lockAttribute, "] {\n    ").concat(removedBarSizeVariable, ": ").concat(gap, "px;\n  }\n");
  };
  var getCurrentUseCounter = function() {
    var counter = parseInt(document.body.getAttribute(lockAttribute) || "0", 10);
    return isFinite(counter) ? counter : 0;
  };
  var useLockAttribute = function() {
    React__namespace.useEffect(function() {
      document.body.setAttribute(lockAttribute, (getCurrentUseCounter() + 1).toString());
      return function() {
        var newCounter = getCurrentUseCounter() - 1;
        if (newCounter <= 0) {
          document.body.removeAttribute(lockAttribute);
        } else {
          document.body.setAttribute(lockAttribute, newCounter.toString());
        }
      };
    }, []);
  };
  var RemoveScrollBar = function(_a) {
    var noRelative = _a.noRelative, noImportant = _a.noImportant, _b = _a.gapMode, gapMode = _b === void 0 ? "margin" : _b;
    useLockAttribute();
    var gap = React__namespace.useMemo(function() {
      return getGapWidth(gapMode);
    }, [gapMode]);
    return React__namespace.createElement(Style, { styles: getStyles(gap, !noRelative, gapMode, !noImportant ? "!important" : "") });
  };
  var passiveSupported = false;
  if (typeof window !== "undefined") {
    try {
      var options = Object.defineProperty({}, "passive", {
        get: function() {
          passiveSupported = true;
          return true;
        }
      });
      window.addEventListener("test", options, options);
      window.removeEventListener("test", options, options);
    } catch (err) {
      passiveSupported = false;
    }
  }
  var nonPassive = passiveSupported ? { passive: false } : false;
  var alwaysContainsScroll = function(node) {
    return node.tagName === "TEXTAREA";
  };
  var elementCanBeScrolled = function(node, overflow) {
    if (!(node instanceof Element)) {
      return false;
    }
    var styles = window.getComputedStyle(node);
    return (
styles[overflow] !== "hidden" &&
!(styles.overflowY === styles.overflowX && !alwaysContainsScroll(node) && styles[overflow] === "visible")
    );
  };
  var elementCouldBeVScrolled = function(node) {
    return elementCanBeScrolled(node, "overflowY");
  };
  var elementCouldBeHScrolled = function(node) {
    return elementCanBeScrolled(node, "overflowX");
  };
  var locationCouldBeScrolled = function(axis, node) {
    var ownerDocument = node.ownerDocument;
    var current = node;
    do {
      if (typeof ShadowRoot !== "undefined" && current instanceof ShadowRoot) {
        current = current.host;
      }
      var isScrollable = elementCouldBeScrolled(axis, current);
      if (isScrollable) {
        var _a = getScrollVariables(axis, current), scrollHeight = _a[1], clientHeight = _a[2];
        if (scrollHeight > clientHeight) {
          return true;
        }
      }
      current = current.parentNode;
    } while (current && current !== ownerDocument.body);
    return false;
  };
  var getVScrollVariables = function(_a) {
    var scrollTop = _a.scrollTop, scrollHeight = _a.scrollHeight, clientHeight = _a.clientHeight;
    return [
      scrollTop,
      scrollHeight,
      clientHeight
    ];
  };
  var getHScrollVariables = function(_a) {
    var scrollLeft = _a.scrollLeft, scrollWidth = _a.scrollWidth, clientWidth = _a.clientWidth;
    return [
      scrollLeft,
      scrollWidth,
      clientWidth
    ];
  };
  var elementCouldBeScrolled = function(axis, node) {
    return axis === "v" ? elementCouldBeVScrolled(node) : elementCouldBeHScrolled(node);
  };
  var getScrollVariables = function(axis, node) {
    return axis === "v" ? getVScrollVariables(node) : getHScrollVariables(node);
  };
  var getDirectionFactor = function(axis, direction) {
    return axis === "h" && direction === "rtl" ? -1 : 1;
  };
  var handleScroll = function(axis, endTarget, event, sourceDelta, noOverscroll) {
    var directionFactor = getDirectionFactor(axis, window.getComputedStyle(endTarget).direction);
    var delta = directionFactor * sourceDelta;
    var target = event.target;
    var targetInLock = endTarget.contains(target);
    var shouldCancelScroll = false;
    var isDeltaPositive = delta > 0;
    var availableScroll = 0;
    var availableScrollTop = 0;
    do {
      if (!target) {
        break;
      }
      var _a = getScrollVariables(axis, target), position = _a[0], scroll_1 = _a[1], capacity = _a[2];
      var elementScroll = scroll_1 - capacity - directionFactor * position;
      if (position || elementScroll) {
        if (elementCouldBeScrolled(axis, target)) {
          availableScroll += elementScroll;
          availableScrollTop += position;
        }
      }
      var parent_1 = target.parentNode;
      target = parent_1 && parent_1.nodeType === Node.DOCUMENT_FRAGMENT_NODE ? parent_1.host : parent_1;
    } while (
!targetInLock && target !== document.body ||
targetInLock && (endTarget.contains(target) || endTarget === target)
    );
    if (isDeltaPositive && (Math.abs(availableScroll) < 1 || false)) {
      shouldCancelScroll = true;
    } else if (!isDeltaPositive && (Math.abs(availableScrollTop) < 1 || false)) {
      shouldCancelScroll = true;
    }
    return shouldCancelScroll;
  };
  var getTouchXY = function(event) {
    return "changedTouches" in event ? [event.changedTouches[0].clientX, event.changedTouches[0].clientY] : [0, 0];
  };
  var getDeltaXY = function(event) {
    return [event.deltaX, event.deltaY];
  };
  var extractRef = function(ref) {
    return ref && "current" in ref ? ref.current : ref;
  };
  var deltaCompare = function(x2, y) {
    return x2[0] === y[0] && x2[1] === y[1];
  };
  var generateStyle = function(id2) {
    return "\n  .block-interactivity-".concat(id2, " {pointer-events: none;}\n  .allow-interactivity-").concat(id2, " {pointer-events: all;}\n");
  };
  var idCounter = 0;
  var lockStack = [];
  function RemoveScrollSideCar(props) {
    var shouldPreventQueue = React__namespace.useRef([]);
    var touchStartRef = React__namespace.useRef([0, 0]);
    var activeAxis = React__namespace.useRef();
    var id2 = React__namespace.useState(idCounter++)[0];
    var Style2 = React__namespace.useState(styleSingleton)[0];
    var lastProps = React__namespace.useRef(props);
    React__namespace.useEffect(function() {
      lastProps.current = props;
    }, [props]);
    React__namespace.useEffect(function() {
      if (props.inert) {
        document.body.classList.add("block-interactivity-".concat(id2));
        var allow_1 = __spreadArray([props.lockRef.current], (props.shards || []).map(extractRef)).filter(Boolean);
        allow_1.forEach(function(el) {
          return el.classList.add("allow-interactivity-".concat(id2));
        });
        return function() {
          document.body.classList.remove("block-interactivity-".concat(id2));
          allow_1.forEach(function(el) {
            return el.classList.remove("allow-interactivity-".concat(id2));
          });
        };
      }
      return;
    }, [props.inert, props.lockRef.current, props.shards]);
    var shouldCancelEvent = React__namespace.useCallback(function(event, parent) {
      if ("touches" in event && event.touches.length === 2 || event.type === "wheel" && event.ctrlKey) {
        return !lastProps.current.allowPinchZoom;
      }
      var touch = getTouchXY(event);
      var touchStart = touchStartRef.current;
      var deltaX = "deltaX" in event ? event.deltaX : touchStart[0] - touch[0];
      var deltaY = "deltaY" in event ? event.deltaY : touchStart[1] - touch[1];
      var currentAxis;
      var target = event.target;
      var moveDirection = Math.abs(deltaX) > Math.abs(deltaY) ? "h" : "v";
      if ("touches" in event && moveDirection === "h" && target.type === "range") {
        return false;
      }
      var canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      if (!canBeScrolledInMainDirection) {
        return true;
      }
      if (canBeScrolledInMainDirection) {
        currentAxis = moveDirection;
      } else {
        currentAxis = moveDirection === "v" ? "h" : "v";
        canBeScrolledInMainDirection = locationCouldBeScrolled(moveDirection, target);
      }
      if (!canBeScrolledInMainDirection) {
        return false;
      }
      if (!activeAxis.current && "changedTouches" in event && (deltaX || deltaY)) {
        activeAxis.current = currentAxis;
      }
      if (!currentAxis) {
        return true;
      }
      var cancelingAxis = activeAxis.current || currentAxis;
      return handleScroll(cancelingAxis, parent, event, cancelingAxis === "h" ? deltaX : deltaY);
    }, []);
    var shouldPrevent = React__namespace.useCallback(function(_event) {
      var event = _event;
      if (!lockStack.length || lockStack[lockStack.length - 1] !== Style2) {
        return;
      }
      var delta = "deltaY" in event ? getDeltaXY(event) : getTouchXY(event);
      var sourceEvent = shouldPreventQueue.current.filter(function(e) {
        return e.name === event.type && (e.target === event.target || event.target === e.shadowParent) && deltaCompare(e.delta, delta);
      })[0];
      if (sourceEvent && sourceEvent.should) {
        if (event.cancelable) {
          event.preventDefault();
        }
        return;
      }
      if (!sourceEvent) {
        var shardNodes = (lastProps.current.shards || []).map(extractRef).filter(Boolean).filter(function(node) {
          return node.contains(event.target);
        });
        var shouldStop = shardNodes.length > 0 ? shouldCancelEvent(event, shardNodes[0]) : !lastProps.current.noIsolation;
        if (shouldStop) {
          if (event.cancelable) {
            event.preventDefault();
          }
        }
      }
    }, []);
    var shouldCancel = React__namespace.useCallback(function(name, delta, target, should) {
      var event = { name, delta, target, should, shadowParent: getOutermostShadowParent(target) };
      shouldPreventQueue.current.push(event);
      setTimeout(function() {
        shouldPreventQueue.current = shouldPreventQueue.current.filter(function(e) {
          return e !== event;
        });
      }, 1);
    }, []);
    var scrollTouchStart = React__namespace.useCallback(function(event) {
      touchStartRef.current = getTouchXY(event);
      activeAxis.current = void 0;
    }, []);
    var scrollWheel = React__namespace.useCallback(function(event) {
      shouldCancel(event.type, getDeltaXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    var scrollTouchMove = React__namespace.useCallback(function(event) {
      shouldCancel(event.type, getTouchXY(event), event.target, shouldCancelEvent(event, props.lockRef.current));
    }, []);
    React__namespace.useEffect(function() {
      lockStack.push(Style2);
      props.setCallbacks({
        onScrollCapture: scrollWheel,
        onWheelCapture: scrollWheel,
        onTouchMoveCapture: scrollTouchMove
      });
      document.addEventListener("wheel", shouldPrevent, nonPassive);
      document.addEventListener("touchmove", shouldPrevent, nonPassive);
      document.addEventListener("touchstart", scrollTouchStart, nonPassive);
      return function() {
        lockStack = lockStack.filter(function(inst) {
          return inst !== Style2;
        });
        document.removeEventListener("wheel", shouldPrevent, nonPassive);
        document.removeEventListener("touchmove", shouldPrevent, nonPassive);
        document.removeEventListener("touchstart", scrollTouchStart, nonPassive);
      };
    }, []);
    var removeScrollBar = props.removeScrollBar, inert = props.inert;
    return React__namespace.createElement(
      React__namespace.Fragment,
      null,
      inert ? React__namespace.createElement(Style2, { styles: generateStyle(id2) }) : null,
      removeScrollBar ? React__namespace.createElement(RemoveScrollBar, { noRelative: props.noRelative, gapMode: props.gapMode }) : null
    );
  }
  function getOutermostShadowParent(node) {
    var shadowParent = null;
    while (node !== null) {
      if (node instanceof ShadowRoot) {
        shadowParent = node.host;
        node = node.host;
      }
      node = node.parentNode;
    }
    return shadowParent;
  }
  const SideCar = exportSidecar(effectCar, RemoveScrollSideCar);
  var ReactRemoveScroll = React__namespace.forwardRef(function(props, ref) {
    return React__namespace.createElement(RemoveScroll, __assign({}, props, { ref, sideCar: SideCar }));
  });
  ReactRemoveScroll.classNames = RemoveScroll.classNames;
  var SELECTION_KEYS = ["Enter", " "];
  var FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
  var LAST_KEYS = ["ArrowUp", "PageDown", "End"];
  var FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
  var SUB_OPEN_KEYS = {
    ltr: [...SELECTION_KEYS, "ArrowRight"],
    rtl: [...SELECTION_KEYS, "ArrowLeft"]
  };
  var SUB_CLOSE_KEYS = {
    ltr: ["ArrowLeft"],
    rtl: ["ArrowRight"]
  };
  var MENU_NAME = "Menu";
  var [Collection, useCollection, createCollectionScope] = createCollection(MENU_NAME);
  var [createMenuContext, createMenuScope] = createContextScope(MENU_NAME, [
    createCollectionScope,
    createPopperScope,
    createRovingFocusGroupScope
  ]);
  var usePopperScope$2 = createPopperScope();
  var useRovingFocusGroupScope$1 = createRovingFocusGroupScope();
  var [MenuProvider, useMenuContext] = createMenuContext(MENU_NAME);
  var [MenuRootProvider, useMenuRootContext] = createMenuContext(MENU_NAME);
  var Menu = (props) => {
    const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props;
    const popperScope = usePopperScope$2(__scopeMenu);
    const [content, setContent] = React__namespace.useState(null);
    const isUsingKeyboardRef = React__namespace.useRef(false);
    const handleOpenChange = useCallbackRef$1(onOpenChange);
    const direction = useDirection(dir);
    React__namespace.useEffect(() => {
      const handleKeyDown = () => {
        isUsingKeyboardRef.current = true;
        document.addEventListener("pointerdown", handlePointer, { capture: true, once: true });
        document.addEventListener("pointermove", handlePointer, { capture: true, once: true });
      };
      const handlePointer = () => isUsingKeyboardRef.current = false;
      document.addEventListener("keydown", handleKeyDown, { capture: true });
      return () => {
        document.removeEventListener("keydown", handleKeyDown, { capture: true });
        document.removeEventListener("pointerdown", handlePointer, { capture: true });
        document.removeEventListener("pointermove", handlePointer, { capture: true });
      };
    }, []);
    return jsxRuntimeExports.jsx(Root2$3, { ...popperScope, children: jsxRuntimeExports.jsx(
      MenuProvider,
      {
        scope: __scopeMenu,
        open,
        onOpenChange: handleOpenChange,
        content,
        onContentChange: setContent,
        children: jsxRuntimeExports.jsx(
          MenuRootProvider,
          {
            scope: __scopeMenu,
            onClose: React__namespace.useCallback(() => handleOpenChange(false), [handleOpenChange]),
            isUsingKeyboardRef,
            dir: direction,
            modal,
            children
          }
        )
      }
    ) });
  };
  Menu.displayName = MENU_NAME;
  var ANCHOR_NAME$1 = "MenuAnchor";
  var MenuAnchor = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeMenu, ...anchorProps } = props;
      const popperScope = usePopperScope$2(__scopeMenu);
      return jsxRuntimeExports.jsx(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
    }
  );
  MenuAnchor.displayName = ANCHOR_NAME$1;
  var PORTAL_NAME$4 = "MenuPortal";
  var [PortalProvider$3, usePortalContext$3] = createMenuContext(PORTAL_NAME$4, {
    forceMount: void 0
  });
  var MenuPortal = (props) => {
    const { __scopeMenu, forceMount, children, container } = props;
    const context = useMenuContext(PORTAL_NAME$4, __scopeMenu);
    return jsxRuntimeExports.jsx(PortalProvider$3, { scope: __scopeMenu, forceMount, children: jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: jsxRuntimeExports.jsx(Portal$4, { asChild: true, container, children }) }) });
  };
  MenuPortal.displayName = PORTAL_NAME$4;
  var CONTENT_NAME$5 = "MenuContent";
  var [MenuContentProvider, useMenuContentContext] = createMenuContext(CONTENT_NAME$5);
  var MenuContent = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext$3(CONTENT_NAME$5, props.__scopeMenu);
      const { forceMount = portalContext.forceMount, ...contentProps } = props;
      const context = useMenuContext(CONTENT_NAME$5, props.__scopeMenu);
      const rootContext = useMenuRootContext(CONTENT_NAME$5, props.__scopeMenu);
      return jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeMenu, children: jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeMenu, children: rootContext.modal ? jsxRuntimeExports.jsx(MenuRootContentModal, { ...contentProps, ref: forwardedRef }) : jsxRuntimeExports.jsx(MenuRootContentNonModal, { ...contentProps, ref: forwardedRef }) }) }) });
    }
  );
  var MenuRootContentModal = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const context = useMenuContext(CONTENT_NAME$5, props.__scopeMenu);
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs$1(forwardedRef, ref);
      React__namespace.useEffect(() => {
        const content = ref.current;
        if (content) return hideOthers(content);
      }, []);
      return jsxRuntimeExports.jsx(
        MenuContentImpl,
        {
          ...props,
          ref: composedRefs,
          trapFocus: context.open,
          disableOutsidePointerEvents: context.open,
          disableOutsideScroll: true,
          onFocusOutside: composeEventHandlers(
            props.onFocusOutside,
            (event) => event.preventDefault(),
            { checkForDefaultPrevented: false }
          ),
          onDismiss: () => context.onOpenChange(false)
        }
      );
    }
  );
  var MenuRootContentNonModal = React__namespace.forwardRef((props, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME$5, props.__scopeMenu);
    return jsxRuntimeExports.jsx(
      MenuContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        disableOutsideScroll: false,
        onDismiss: () => context.onOpenChange(false)
      }
    );
  });
  var Slot$2 = createSlot("MenuContent.ScrollLock");
  var MenuContentImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeMenu,
        loop = false,
        trapFocus,
        onOpenAutoFocus,
        onCloseAutoFocus,
        disableOutsidePointerEvents,
        onEntryFocus,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside,
        onInteractOutside,
        onDismiss,
        disableOutsideScroll,
        ...contentProps
      } = props;
      const context = useMenuContext(CONTENT_NAME$5, __scopeMenu);
      const rootContext = useMenuRootContext(CONTENT_NAME$5, __scopeMenu);
      const popperScope = usePopperScope$2(__scopeMenu);
      const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeMenu);
      const getItems = useCollection(__scopeMenu);
      const [currentItemId, setCurrentItemId] = React__namespace.useState(null);
      const contentRef = React__namespace.useRef(null);
      const composedRefs = useComposedRefs$1(forwardedRef, contentRef, context.onContentChange);
      const timerRef = React__namespace.useRef(0);
      const searchRef = React__namespace.useRef("");
      const pointerGraceTimerRef = React__namespace.useRef(0);
      const pointerGraceIntentRef = React__namespace.useRef(null);
      const pointerDirRef = React__namespace.useRef("right");
      const lastPointerXRef = React__namespace.useRef(0);
      const ScrollLockWrapper = disableOutsideScroll ? ReactRemoveScroll : React__namespace.Fragment;
      const scrollLockWrapperProps = disableOutsideScroll ? { as: Slot$2, allowPinchZoom: true } : void 0;
      const handleTypeaheadSearch = (key) => {
        const search = searchRef.current + key;
        const items = getItems().filter((item) => !item.disabled);
        const currentItem = document.activeElement;
        const currentMatch = items.find((item) => item.ref.current === currentItem)?.textValue;
        const values = items.map((item) => item.textValue);
        const nextMatch = getNextMatch(values, search, currentMatch);
        const newItem = items.find((item) => item.textValue === nextMatch)?.ref.current;
        (function updateSearch(value) {
          searchRef.current = value;
          window.clearTimeout(timerRef.current);
          if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
        })(search);
        if (newItem) {
          setTimeout(() => newItem.focus());
        }
      };
      React__namespace.useEffect(() => {
        return () => window.clearTimeout(timerRef.current);
      }, []);
      useFocusGuards();
      const isPointerMovingToSubmenu = React__namespace.useCallback((event) => {
        const isMovingTowards = pointerDirRef.current === pointerGraceIntentRef.current?.side;
        return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area);
      }, []);
      return jsxRuntimeExports.jsx(
        MenuContentProvider,
        {
          scope: __scopeMenu,
          searchRef,
          onItemEnter: React__namespace.useCallback(
            (event) => {
              if (isPointerMovingToSubmenu(event)) event.preventDefault();
            },
            [isPointerMovingToSubmenu]
          ),
          onItemLeave: React__namespace.useCallback(
            (event) => {
              if (isPointerMovingToSubmenu(event)) return;
              contentRef.current?.focus();
              setCurrentItemId(null);
            },
            [isPointerMovingToSubmenu]
          ),
          onTriggerLeave: React__namespace.useCallback(
            (event) => {
              if (isPointerMovingToSubmenu(event)) event.preventDefault();
            },
            [isPointerMovingToSubmenu]
          ),
          pointerGraceTimerRef,
          onPointerGraceIntentChange: React__namespace.useCallback((intent) => {
            pointerGraceIntentRef.current = intent;
          }, []),
          children: jsxRuntimeExports.jsx(ScrollLockWrapper, { ...scrollLockWrapperProps, children: jsxRuntimeExports.jsx(
            FocusScope,
            {
              asChild: true,
              trapped: trapFocus,
              onMountAutoFocus: composeEventHandlers(onOpenAutoFocus, (event) => {
                event.preventDefault();
                contentRef.current?.focus({ preventScroll: true });
              }),
              onUnmountAutoFocus: onCloseAutoFocus,
              children: jsxRuntimeExports.jsx(
                DismissableLayer,
                {
                  asChild: true,
                  disableOutsidePointerEvents,
                  onEscapeKeyDown,
                  onPointerDownOutside,
                  onFocusOutside,
                  onInteractOutside,
                  onDismiss,
                  children: jsxRuntimeExports.jsx(
                    Root$4,
                    {
                      asChild: true,
                      ...rovingFocusGroupScope,
                      dir: rootContext.dir,
                      orientation: "vertical",
                      loop,
                      currentTabStopId: currentItemId,
                      onCurrentTabStopIdChange: setCurrentItemId,
                      onEntryFocus: composeEventHandlers(onEntryFocus, (event) => {
                        if (!rootContext.isUsingKeyboardRef.current) event.preventDefault();
                      }),
                      preventScrollOnEntryFocus: true,
                      children: jsxRuntimeExports.jsx(
                        Content$2,
                        {
                          role: "menu",
                          "aria-orientation": "vertical",
                          "data-state": getOpenState(context.open),
                          "data-radix-menu-content": "",
                          dir: rootContext.dir,
                          ...popperScope,
                          ...contentProps,
                          ref: composedRefs,
                          style: { outline: "none", ...contentProps.style },
                          onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                            const target = event.target;
                            const isKeyDownInside = target.closest("[data-radix-menu-content]") === event.currentTarget;
                            const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                            const isCharacterKey = event.key.length === 1;
                            if (isKeyDownInside) {
                              if (event.key === "Tab") event.preventDefault();
                              if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key);
                            }
                            const content = contentRef.current;
                            if (event.target !== content) return;
                            if (!FIRST_LAST_KEYS.includes(event.key)) return;
                            event.preventDefault();
                            const items = getItems().filter((item) => !item.disabled);
                            const candidateNodes = items.map((item) => item.ref.current);
                            if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
                            focusFirst(candidateNodes);
                          }),
                          onBlur: composeEventHandlers(props.onBlur, (event) => {
                            if (!event.currentTarget.contains(event.target)) {
                              window.clearTimeout(timerRef.current);
                              searchRef.current = "";
                            }
                          }),
                          onPointerMove: composeEventHandlers(
                            props.onPointerMove,
                            whenMouse((event) => {
                              const target = event.target;
                              const pointerXHasChanged = lastPointerXRef.current !== event.clientX;
                              if (event.currentTarget.contains(target) && pointerXHasChanged) {
                                const newDir = event.clientX > lastPointerXRef.current ? "right" : "left";
                                pointerDirRef.current = newDir;
                                lastPointerXRef.current = event.clientX;
                              }
                            })
                          )
                        }
                      )
                    }
                  )
                }
              )
            }
          ) })
        }
      );
    }
  );
  MenuContent.displayName = CONTENT_NAME$5;
  var GROUP_NAME$1 = "MenuGroup";
  var MenuGroup = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeMenu, ...groupProps } = props;
      return jsxRuntimeExports.jsx(Primitive.div, { role: "group", ...groupProps, ref: forwardedRef });
    }
  );
  MenuGroup.displayName = GROUP_NAME$1;
  var LABEL_NAME$1 = "MenuLabel";
  var MenuLabel = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeMenu, ...labelProps } = props;
      return jsxRuntimeExports.jsx(Primitive.div, { ...labelProps, ref: forwardedRef });
    }
  );
  MenuLabel.displayName = LABEL_NAME$1;
  var ITEM_NAME$1 = "MenuItem";
  var ITEM_SELECT = "menu.itemSelect";
  var MenuItem = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { disabled = false, onSelect, ...itemProps } = props;
      const ref = React__namespace.useRef(null);
      const rootContext = useMenuRootContext(ITEM_NAME$1, props.__scopeMenu);
      const contentContext = useMenuContentContext(ITEM_NAME$1, props.__scopeMenu);
      const composedRefs = useComposedRefs$1(forwardedRef, ref);
      const isPointerDownRef = React__namespace.useRef(false);
      const handleSelect = () => {
        const menuItem = ref.current;
        if (!disabled && menuItem) {
          const itemSelectEvent = new CustomEvent(ITEM_SELECT, { bubbles: true, cancelable: true });
          menuItem.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), { once: true });
          dispatchDiscreteCustomEvent(menuItem, itemSelectEvent);
          if (itemSelectEvent.defaultPrevented) {
            isPointerDownRef.current = false;
          } else {
            rootContext.onClose();
          }
        }
      };
      return jsxRuntimeExports.jsx(
        MenuItemImpl,
        {
          ...itemProps,
          ref: composedRefs,
          disabled,
          onClick: composeEventHandlers(props.onClick, handleSelect),
          onPointerDown: (event) => {
            props.onPointerDown?.(event);
            isPointerDownRef.current = true;
          },
          onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
            if (!isPointerDownRef.current) event.currentTarget?.click();
          }),
          onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
            const isTypingAhead = contentContext.searchRef.current !== "";
            if (disabled || isTypingAhead && event.key === " ") return;
            if (SELECTION_KEYS.includes(event.key)) {
              event.currentTarget.click();
              event.preventDefault();
            }
          })
        }
      );
    }
  );
  MenuItem.displayName = ITEM_NAME$1;
  var MenuItemImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
      const contentContext = useMenuContentContext(ITEM_NAME$1, __scopeMenu);
      const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeMenu);
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs$1(forwardedRef, ref);
      const [isFocused, setIsFocused] = React__namespace.useState(false);
      const [textContent, setTextContent] = React__namespace.useState("");
      React__namespace.useEffect(() => {
        const menuItem = ref.current;
        if (menuItem) {
          setTextContent((menuItem.textContent ?? "").trim());
        }
      }, [itemProps.children]);
      return jsxRuntimeExports.jsx(
        Collection.ItemSlot,
        {
          scope: __scopeMenu,
          disabled,
          textValue: textValue ?? textContent,
          children: jsxRuntimeExports.jsx(Item, { asChild: true, ...rovingFocusGroupScope, focusable: !disabled, children: jsxRuntimeExports.jsx(
            Primitive.div,
            {
              role: "menuitem",
              "data-highlighted": isFocused ? "" : void 0,
              "aria-disabled": disabled || void 0,
              "data-disabled": disabled ? "" : void 0,
              ...itemProps,
              ref: composedRefs,
              onPointerMove: composeEventHandlers(
                props.onPointerMove,
                whenMouse((event) => {
                  if (disabled) {
                    contentContext.onItemLeave(event);
                  } else {
                    contentContext.onItemEnter(event);
                    if (!event.defaultPrevented) {
                      const item = event.currentTarget;
                      item.focus({ preventScroll: true });
                    }
                  }
                })
              ),
              onPointerLeave: composeEventHandlers(
                props.onPointerLeave,
                whenMouse((event) => contentContext.onItemLeave(event))
              ),
              onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
              onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
            }
          ) })
        }
      );
    }
  );
  var CHECKBOX_ITEM_NAME$1 = "MenuCheckboxItem";
  var MenuCheckboxItem = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
      return jsxRuntimeExports.jsx(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: jsxRuntimeExports.jsx(
        MenuItem,
        {
          role: "menuitemcheckbox",
          "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
          ...checkboxItemProps,
          ref: forwardedRef,
          "data-state": getCheckedState(checked),
          onSelect: composeEventHandlers(
            checkboxItemProps.onSelect,
            () => onCheckedChange?.(isIndeterminate(checked) ? true : !checked),
            { checkForDefaultPrevented: false }
          )
        }
      ) });
    }
  );
  MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME$1;
  var RADIO_GROUP_NAME$1 = "MenuRadioGroup";
  var [RadioGroupProvider, useRadioGroupContext] = createMenuContext(
    RADIO_GROUP_NAME$1,
    { value: void 0, onValueChange: () => {
    } }
  );
  var MenuRadioGroup = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { value, onValueChange, ...groupProps } = props;
      const handleValueChange = useCallbackRef$1(onValueChange);
      return jsxRuntimeExports.jsx(RadioGroupProvider, { scope: props.__scopeMenu, value, onValueChange: handleValueChange, children: jsxRuntimeExports.jsx(MenuGroup, { ...groupProps, ref: forwardedRef }) });
    }
  );
  MenuRadioGroup.displayName = RADIO_GROUP_NAME$1;
  var RADIO_ITEM_NAME$1 = "MenuRadioItem";
  var MenuRadioItem = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { value, ...radioItemProps } = props;
      const context = useRadioGroupContext(RADIO_ITEM_NAME$1, props.__scopeMenu);
      const checked = value === context.value;
      return jsxRuntimeExports.jsx(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: jsxRuntimeExports.jsx(
        MenuItem,
        {
          role: "menuitemradio",
          "aria-checked": checked,
          ...radioItemProps,
          ref: forwardedRef,
          "data-state": getCheckedState(checked),
          onSelect: composeEventHandlers(
            radioItemProps.onSelect,
            () => context.onValueChange?.(value),
            { checkForDefaultPrevented: false }
          )
        }
      ) });
    }
  );
  MenuRadioItem.displayName = RADIO_ITEM_NAME$1;
  var ITEM_INDICATOR_NAME = "MenuItemIndicator";
  var [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext(
    ITEM_INDICATOR_NAME,
    { checked: false }
  );
  var MenuItemIndicator = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeMenu, forceMount, ...itemIndicatorProps } = props;
      const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME, __scopeMenu);
      return jsxRuntimeExports.jsx(
        Presence,
        {
          present: forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true,
          children: jsxRuntimeExports.jsx(
            Primitive.span,
            {
              ...itemIndicatorProps,
              ref: forwardedRef,
              "data-state": getCheckedState(indicatorContext.checked)
            }
          )
        }
      );
    }
  );
  MenuItemIndicator.displayName = ITEM_INDICATOR_NAME;
  var SEPARATOR_NAME$1 = "MenuSeparator";
  var MenuSeparator = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeMenu, ...separatorProps } = props;
      return jsxRuntimeExports.jsx(
        Primitive.div,
        {
          role: "separator",
          "aria-orientation": "horizontal",
          ...separatorProps,
          ref: forwardedRef
        }
      );
    }
  );
  MenuSeparator.displayName = SEPARATOR_NAME$1;
  var ARROW_NAME$3 = "MenuArrow";
  var MenuArrow = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeMenu, ...arrowProps } = props;
      const popperScope = usePopperScope$2(__scopeMenu);
      return jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
    }
  );
  MenuArrow.displayName = ARROW_NAME$3;
  var SUB_NAME = "MenuSub";
  var [MenuSubProvider, useMenuSubContext] = createMenuContext(SUB_NAME);
  var SUB_TRIGGER_NAME$1 = "MenuSubTrigger";
  var MenuSubTrigger = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const context = useMenuContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
      const rootContext = useMenuRootContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
      const subContext = useMenuSubContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
      const contentContext = useMenuContentContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
      const openTimerRef = React__namespace.useRef(null);
      const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
      const scope = { __scopeMenu: props.__scopeMenu };
      const clearOpenTimer = React__namespace.useCallback(() => {
        if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
        openTimerRef.current = null;
      }, []);
      React__namespace.useEffect(() => clearOpenTimer, [clearOpenTimer]);
      React__namespace.useEffect(() => {
        const pointerGraceTimer = pointerGraceTimerRef.current;
        return () => {
          window.clearTimeout(pointerGraceTimer);
          onPointerGraceIntentChange(null);
        };
      }, [pointerGraceTimerRef, onPointerGraceIntentChange]);
      return jsxRuntimeExports.jsx(MenuAnchor, { asChild: true, ...scope, children: jsxRuntimeExports.jsx(
        MenuItemImpl,
        {
          id: subContext.triggerId,
          "aria-haspopup": "menu",
          "aria-expanded": context.open,
          "aria-controls": subContext.contentId,
          "data-state": getOpenState(context.open),
          ...props,
          ref: composeRefs$1(forwardedRef, subContext.onTriggerChange),
          onClick: (event) => {
            props.onClick?.(event);
            if (props.disabled || event.defaultPrevented) return;
            event.currentTarget.focus();
            if (!context.open) context.onOpenChange(true);
          },
          onPointerMove: composeEventHandlers(
            props.onPointerMove,
            whenMouse((event) => {
              contentContext.onItemEnter(event);
              if (event.defaultPrevented) return;
              if (!props.disabled && !context.open && !openTimerRef.current) {
                contentContext.onPointerGraceIntentChange(null);
                openTimerRef.current = window.setTimeout(() => {
                  context.onOpenChange(true);
                  clearOpenTimer();
                }, 100);
              }
            })
          ),
          onPointerLeave: composeEventHandlers(
            props.onPointerLeave,
            whenMouse((event) => {
              clearOpenTimer();
              const contentRect = context.content?.getBoundingClientRect();
              if (contentRect) {
                const side = context.content?.dataset.side;
                const rightSide = side === "right";
                const bleed = rightSide ? -5 : 5;
                const contentNearEdge = contentRect[rightSide ? "left" : "right"];
                const contentFarEdge = contentRect[rightSide ? "right" : "left"];
                contentContext.onPointerGraceIntentChange({
                  area: [

{ x: event.clientX + bleed, y: event.clientY },
                    { x: contentNearEdge, y: contentRect.top },
                    { x: contentFarEdge, y: contentRect.top },
                    { x: contentFarEdge, y: contentRect.bottom },
                    { x: contentNearEdge, y: contentRect.bottom }
                  ],
                  side
                });
                window.clearTimeout(pointerGraceTimerRef.current);
                pointerGraceTimerRef.current = window.setTimeout(
                  () => contentContext.onPointerGraceIntentChange(null),
                  300
                );
              } else {
                contentContext.onTriggerLeave(event);
                if (event.defaultPrevented) return;
                contentContext.onPointerGraceIntentChange(null);
              }
            })
          ),
          onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
            const isTypingAhead = contentContext.searchRef.current !== "";
            if (props.disabled || isTypingAhead && event.key === " ") return;
            if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
              context.onOpenChange(true);
              context.content?.focus();
              event.preventDefault();
            }
          })
        }
      ) });
    }
  );
  MenuSubTrigger.displayName = SUB_TRIGGER_NAME$1;
  var SUB_CONTENT_NAME$1 = "MenuSubContent";
  var MenuSubContent = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext$3(CONTENT_NAME$5, props.__scopeMenu);
      const { forceMount = portalContext.forceMount, ...subContentProps } = props;
      const context = useMenuContext(CONTENT_NAME$5, props.__scopeMenu);
      const rootContext = useMenuRootContext(CONTENT_NAME$5, props.__scopeMenu);
      const subContext = useMenuSubContext(SUB_CONTENT_NAME$1, props.__scopeMenu);
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs$1(forwardedRef, ref);
      return jsxRuntimeExports.jsx(Collection.Provider, { scope: props.__scopeMenu, children: jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: jsxRuntimeExports.jsx(Collection.Slot, { scope: props.__scopeMenu, children: jsxRuntimeExports.jsx(
        MenuContentImpl,
        {
          id: subContext.contentId,
          "aria-labelledby": subContext.triggerId,
          ...subContentProps,
          ref: composedRefs,
          align: "start",
          side: rootContext.dir === "rtl" ? "left" : "right",
          disableOutsidePointerEvents: false,
          disableOutsideScroll: false,
          trapFocus: false,
          onOpenAutoFocus: (event) => {
            if (rootContext.isUsingKeyboardRef.current) ref.current?.focus();
            event.preventDefault();
          },
          onCloseAutoFocus: (event) => event.preventDefault(),
          onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
            if (event.target !== subContext.trigger) context.onOpenChange(false);
          }),
          onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (event) => {
            rootContext.onClose();
            event.preventDefault();
          }),
          onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
            const isKeyDownInside = event.currentTarget.contains(event.target);
            const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key);
            if (isKeyDownInside && isCloseKey) {
              context.onOpenChange(false);
              subContext.trigger?.focus();
              event.preventDefault();
            }
          })
        }
      ) }) }) });
    }
  );
  MenuSubContent.displayName = SUB_CONTENT_NAME$1;
  function getOpenState(open) {
    return open ? "open" : "closed";
  }
  function isIndeterminate(checked) {
    return checked === "indeterminate";
  }
  function getCheckedState(checked) {
    return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
  }
  function focusFirst(candidates) {
    const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
    for (const candidate of candidates) {
      if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
      candidate.focus();
      if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
    }
  }
  function wrapArray(array, startIndex) {
    return array.map((_, index2) => array[(startIndex + index2) % array.length]);
  }
  function getNextMatch(values, search, currentMatch) {
    const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
    const normalizedSearch = isRepeated ? search[0] : search;
    const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
    let wrappedValues = wrapArray(values, Math.max(currentMatchIndex, 0));
    const excludeCurrentMatch = normalizedSearch.length === 1;
    if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
    const nextMatch = wrappedValues.find(
      (value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase())
    );
    return nextMatch !== currentMatch ? nextMatch : void 0;
  }
  function isPointInPolygon$1(point, polygon) {
    const { x: x2, y } = point;
    let inside = false;
    for (let i2 = 0, j = polygon.length - 1; i2 < polygon.length; j = i2++) {
      const ii = polygon[i2];
      const jj = polygon[j];
      const xi = ii.x;
      const yi = ii.y;
      const xj = jj.x;
      const yj = jj.y;
      const intersect = yi > y !== yj > y && x2 < (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  function isPointerInGraceArea(event, area) {
    if (!area) return false;
    const cursorPos = { x: event.clientX, y: event.clientY };
    return isPointInPolygon$1(cursorPos, area);
  }
  function whenMouse(handler) {
    return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
  }
  var Root3$1 = Menu;
  var Anchor2 = MenuAnchor;
  var Portal$3 = MenuPortal;
  var Content2$3 = MenuContent;
  var Group = MenuGroup;
  var Label$2 = MenuLabel;
  var Item2$1 = MenuItem;
  var CheckboxItem = MenuCheckboxItem;
  var RadioGroup = MenuRadioGroup;
  var RadioItem = MenuRadioItem;
  var ItemIndicator = MenuItemIndicator;
  var Separator$2 = MenuSeparator;
  var Arrow2$1 = MenuArrow;
  var SubTrigger = MenuSubTrigger;
  var SubContent = MenuSubContent;
  var DROPDOWN_MENU_NAME = "DropdownMenu";
  var [createDropdownMenuContext] = createContextScope(
    DROPDOWN_MENU_NAME,
    [createMenuScope]
  );
  var useMenuScope = createMenuScope();
  var [DropdownMenuProvider, useDropdownMenuContext] = createDropdownMenuContext(DROPDOWN_MENU_NAME);
  var DropdownMenu$1 = (props) => {
    const {
      __scopeDropdownMenu,
      children,
      dir,
      open: openProp,
      defaultOpen,
      onOpenChange,
      modal = true
    } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    const triggerRef = React__namespace.useRef(null);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: DROPDOWN_MENU_NAME
    });
    return jsxRuntimeExports.jsx(
      DropdownMenuProvider,
      {
        scope: __scopeDropdownMenu,
        triggerId: useId(),
        triggerRef,
        contentId: useId(),
        open,
        onOpenChange: setOpen,
        onOpenToggle: React__namespace.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        modal,
        children: jsxRuntimeExports.jsx(Root3$1, { ...menuScope, open, onOpenChange: setOpen, dir, modal, children })
      }
    );
  };
  DropdownMenu$1.displayName = DROPDOWN_MENU_NAME;
  var TRIGGER_NAME$4 = "DropdownMenuTrigger";
  var DropdownMenuTrigger$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDropdownMenu, disabled = false, ...triggerProps } = props;
      const context = useDropdownMenuContext(TRIGGER_NAME$4, __scopeDropdownMenu);
      const menuScope = useMenuScope(__scopeDropdownMenu);
      return jsxRuntimeExports.jsx(Anchor2, { asChild: true, ...menuScope, children: jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          id: context.triggerId,
          "aria-haspopup": "menu",
          "aria-expanded": context.open,
          "aria-controls": context.open ? context.contentId : void 0,
          "data-state": context.open ? "open" : "closed",
          "data-disabled": disabled ? "" : void 0,
          disabled,
          ...triggerProps,
          ref: composeRefs$1(forwardedRef, context.triggerRef),
          onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
            if (!disabled && event.button === 0 && event.ctrlKey === false) {
              context.onOpenToggle();
              if (!context.open) event.preventDefault();
            }
          }),
          onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
            if (disabled) return;
            if (["Enter", " "].includes(event.key)) context.onOpenToggle();
            if (event.key === "ArrowDown") context.onOpenChange(true);
            if (["Enter", " ", "ArrowDown"].includes(event.key)) event.preventDefault();
          })
        }
      ) });
    }
  );
  DropdownMenuTrigger$1.displayName = TRIGGER_NAME$4;
  var PORTAL_NAME$3 = "DropdownMenuPortal";
  var DropdownMenuPortal = (props) => {
    const { __scopeDropdownMenu, ...portalProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return jsxRuntimeExports.jsx(Portal$3, { ...menuScope, ...portalProps });
  };
  DropdownMenuPortal.displayName = PORTAL_NAME$3;
  var CONTENT_NAME$4 = "DropdownMenuContent";
  var DropdownMenuContent$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDropdownMenu, ...contentProps } = props;
      const context = useDropdownMenuContext(CONTENT_NAME$4, __scopeDropdownMenu);
      const menuScope = useMenuScope(__scopeDropdownMenu);
      const hasInteractedOutsideRef = React__namespace.useRef(false);
      return jsxRuntimeExports.jsx(
        Content2$3,
        {
          id: context.contentId,
          "aria-labelledby": context.triggerId,
          ...menuScope,
          ...contentProps,
          ref: forwardedRef,
          onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
            hasInteractedOutsideRef.current = false;
            event.preventDefault();
          }),
          onInteractOutside: composeEventHandlers(props.onInteractOutside, (event) => {
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            if (!context.modal || isRightClick) hasInteractedOutsideRef.current = true;
          }),
          style: {
            ...props.style,
...{
              "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
              "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
              "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
              "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
              "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
            }
          }
        }
      );
    }
  );
  DropdownMenuContent$1.displayName = CONTENT_NAME$4;
  var GROUP_NAME = "DropdownMenuGroup";
  var DropdownMenuGroup$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDropdownMenu, ...groupProps } = props;
      const menuScope = useMenuScope(__scopeDropdownMenu);
      return jsxRuntimeExports.jsx(Group, { ...menuScope, ...groupProps, ref: forwardedRef });
    }
  );
  DropdownMenuGroup$1.displayName = GROUP_NAME;
  var LABEL_NAME = "DropdownMenuLabel";
  var DropdownMenuLabel$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDropdownMenu, ...labelProps } = props;
      const menuScope = useMenuScope(__scopeDropdownMenu);
      return jsxRuntimeExports.jsx(Label$2, { ...menuScope, ...labelProps, ref: forwardedRef });
    }
  );
  DropdownMenuLabel$1.displayName = LABEL_NAME;
  var ITEM_NAME = "DropdownMenuItem";
  var DropdownMenuItem$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDropdownMenu, ...itemProps } = props;
      const menuScope = useMenuScope(__scopeDropdownMenu);
      return jsxRuntimeExports.jsx(Item2$1, { ...menuScope, ...itemProps, ref: forwardedRef });
    }
  );
  DropdownMenuItem$1.displayName = ITEM_NAME;
  var CHECKBOX_ITEM_NAME = "DropdownMenuCheckboxItem";
  var DropdownMenuCheckboxItem = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...checkboxItemProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return jsxRuntimeExports.jsx(CheckboxItem, { ...menuScope, ...checkboxItemProps, ref: forwardedRef });
  });
  DropdownMenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME;
  var RADIO_GROUP_NAME = "DropdownMenuRadioGroup";
  var DropdownMenuRadioGroup = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...radioGroupProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return jsxRuntimeExports.jsx(RadioGroup, { ...menuScope, ...radioGroupProps, ref: forwardedRef });
  });
  DropdownMenuRadioGroup.displayName = RADIO_GROUP_NAME;
  var RADIO_ITEM_NAME = "DropdownMenuRadioItem";
  var DropdownMenuRadioItem = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...radioItemProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return jsxRuntimeExports.jsx(RadioItem, { ...menuScope, ...radioItemProps, ref: forwardedRef });
  });
  DropdownMenuRadioItem.displayName = RADIO_ITEM_NAME;
  var INDICATOR_NAME = "DropdownMenuItemIndicator";
  var DropdownMenuItemIndicator = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...itemIndicatorProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return jsxRuntimeExports.jsx(ItemIndicator, { ...menuScope, ...itemIndicatorProps, ref: forwardedRef });
  });
  DropdownMenuItemIndicator.displayName = INDICATOR_NAME;
  var SEPARATOR_NAME = "DropdownMenuSeparator";
  var DropdownMenuSeparator$1 = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...separatorProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return jsxRuntimeExports.jsx(Separator$2, { ...menuScope, ...separatorProps, ref: forwardedRef });
  });
  DropdownMenuSeparator$1.displayName = SEPARATOR_NAME;
  var ARROW_NAME$2 = "DropdownMenuArrow";
  var DropdownMenuArrow = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDropdownMenu, ...arrowProps } = props;
      const menuScope = useMenuScope(__scopeDropdownMenu);
      return jsxRuntimeExports.jsx(Arrow2$1, { ...menuScope, ...arrowProps, ref: forwardedRef });
    }
  );
  DropdownMenuArrow.displayName = ARROW_NAME$2;
  var SUB_TRIGGER_NAME = "DropdownMenuSubTrigger";
  var DropdownMenuSubTrigger = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...subTriggerProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return jsxRuntimeExports.jsx(SubTrigger, { ...menuScope, ...subTriggerProps, ref: forwardedRef });
  });
  DropdownMenuSubTrigger.displayName = SUB_TRIGGER_NAME;
  var SUB_CONTENT_NAME = "DropdownMenuSubContent";
  var DropdownMenuSubContent = React__namespace.forwardRef((props, forwardedRef) => {
    const { __scopeDropdownMenu, ...subContentProps } = props;
    const menuScope = useMenuScope(__scopeDropdownMenu);
    return jsxRuntimeExports.jsx(
      SubContent,
      {
        ...menuScope,
        ...subContentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
...{
            "--radix-dropdown-menu-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-dropdown-menu-content-available-width": "var(--radix-popper-available-width)",
            "--radix-dropdown-menu-content-available-height": "var(--radix-popper-available-height)",
            "--radix-dropdown-menu-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-dropdown-menu-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  });
  DropdownMenuSubContent.displayName = SUB_CONTENT_NAME;
  var Root2$2 = DropdownMenu$1;
  var Trigger$3 = DropdownMenuTrigger$1;
  var Portal2 = DropdownMenuPortal;
  var Content2$2 = DropdownMenuContent$1;
  var Group2 = DropdownMenuGroup$1;
  var Label2 = DropdownMenuLabel$1;
  var Item2 = DropdownMenuItem$1;
  var Separator2 = DropdownMenuSeparator$1;
  function DropdownMenu({
    ...props
  }) {
    return jsxRuntimeExports.jsx(Root2$2, { "data-slot": "dropdown-menu", ...props });
  }
  function DropdownMenuTrigger({
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Trigger$3,
      {
        "data-slot": "dropdown-menu-trigger",
        ...props
      }
    );
  }
  function DropdownMenuContent({
    className,
    sideOffset = 4,
    ...props
  }) {
    return jsxRuntimeExports.jsx(Portal2, { children: jsxRuntimeExports.jsx(
      Content2$2,
      {
        "data-slot": "dropdown-menu-content",
        sideOffset,
        className: cn$1(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-x-hidden overflow-y-auto rounded-md border p-1 shadow-md",
          className
        ),
        ...props
      }
    ) });
  }
  function DropdownMenuGroup({
    ...props
  }) {
    return jsxRuntimeExports.jsx(Group2, { "data-slot": "dropdown-menu-group", ...props });
  }
  function DropdownMenuItem({
    className,
    inset,
    variant = "default",
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Item2,
      {
        "data-slot": "dropdown-menu-item",
        "data-inset": inset,
        "data-variant": variant,
        className: cn$1(
          "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        ),
        ...props
      }
    );
  }
  function DropdownMenuLabel({
    className,
    inset,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Label2,
      {
        "data-slot": "dropdown-menu-label",
        "data-inset": inset,
        className: cn$1(
          "px-2 py-1.5 text-sm font-medium data-[inset]:pl-8",
          className
        ),
        ...props
      }
    );
  }
  function DropdownMenuSeparator({
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Separator2,
      {
        "data-slot": "dropdown-menu-separator",
        className: cn$1("bg-border -mx-1 my-1 h-px", className),
        ...props
      }
    );
  }
  var DIALOG_NAME = "Dialog";
  var [createDialogContext] = createContextScope(DIALOG_NAME);
  var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
  var Dialog$1 = (props) => {
    const {
      __scopeDialog,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      modal = true
    } = props;
    const triggerRef = React__namespace.useRef(null);
    const contentRef = React__namespace.useRef(null);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: DIALOG_NAME
    });
    return jsxRuntimeExports.jsx(
      DialogProvider,
      {
        scope: __scopeDialog,
        triggerRef,
        contentRef,
        contentId: useId(),
        titleId: useId(),
        descriptionId: useId(),
        open,
        onOpenChange: setOpen,
        onOpenToggle: React__namespace.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        modal,
        children
      }
    );
  };
  Dialog$1.displayName = DIALOG_NAME;
  var TRIGGER_NAME$3 = "DialogTrigger";
  var DialogTrigger = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, ...triggerProps } = props;
      const context = useDialogContext(TRIGGER_NAME$3, __scopeDialog);
      const composedTriggerRef = useComposedRefs$1(forwardedRef, context.triggerRef);
      return jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          "aria-haspopup": "dialog",
          "aria-expanded": context.open,
          "aria-controls": context.contentId,
          "data-state": getState$1(context.open),
          ...triggerProps,
          ref: composedTriggerRef,
          onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
        }
      );
    }
  );
  DialogTrigger.displayName = TRIGGER_NAME$3;
  var PORTAL_NAME$2 = "DialogPortal";
  var [PortalProvider$2, usePortalContext$2] = createDialogContext(PORTAL_NAME$2, {
    forceMount: void 0
  });
  var DialogPortal$1 = (props) => {
    const { __scopeDialog, forceMount, children, container } = props;
    const context = useDialogContext(PORTAL_NAME$2, __scopeDialog);
    return jsxRuntimeExports.jsx(PortalProvider$2, { scope: __scopeDialog, forceMount, children: React__namespace.Children.map(children, (child) => jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: jsxRuntimeExports.jsx(Portal$4, { asChild: true, container, children: child }) })) });
  };
  DialogPortal$1.displayName = PORTAL_NAME$2;
  var OVERLAY_NAME = "DialogOverlay";
  var DialogOverlay$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext$2(OVERLAY_NAME, props.__scopeDialog);
      const { forceMount = portalContext.forceMount, ...overlayProps } = props;
      const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
      return context.modal ? jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: jsxRuntimeExports.jsx(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
    }
  );
  DialogOverlay$1.displayName = OVERLAY_NAME;
  var Slot$1 = createSlot("DialogOverlay.RemoveScroll");
  var DialogOverlayImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, ...overlayProps } = props;
      const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
      return (


jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot$1, allowPinchZoom: true, shards: [context.contentRef], children: jsxRuntimeExports.jsx(
          Primitive.div,
          {
            "data-state": getState$1(context.open),
            ...overlayProps,
            ref: forwardedRef,
            style: { pointerEvents: "auto", ...overlayProps.style }
          }
        ) })
      );
    }
  );
  var CONTENT_NAME$3 = "DialogContent";
  var DialogContent$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext$2(CONTENT_NAME$3, props.__scopeDialog);
      const { forceMount = portalContext.forceMount, ...contentProps } = props;
      const context = useDialogContext(CONTENT_NAME$3, props.__scopeDialog);
      return jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? jsxRuntimeExports.jsx(DialogContentModal, { ...contentProps, ref: forwardedRef }) : jsxRuntimeExports.jsx(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
    }
  );
  DialogContent$1.displayName = CONTENT_NAME$3;
  var DialogContentModal = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const context = useDialogContext(CONTENT_NAME$3, props.__scopeDialog);
      const contentRef = React__namespace.useRef(null);
      const composedRefs = useComposedRefs$1(forwardedRef, context.contentRef, contentRef);
      React__namespace.useEffect(() => {
        const content = contentRef.current;
        if (content) return hideOthers(content);
      }, []);
      return jsxRuntimeExports.jsx(
        DialogContentImpl,
        {
          ...props,
          ref: composedRefs,
          trapFocus: context.open,
          disableOutsidePointerEvents: true,
          onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
            event.preventDefault();
            context.triggerRef.current?.focus();
          }),
          onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
            const originalEvent = event.detail.originalEvent;
            const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
            const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
            if (isRightClick) event.preventDefault();
          }),
          onFocusOutside: composeEventHandlers(
            props.onFocusOutside,
            (event) => event.preventDefault()
          )
        }
      );
    }
  );
  var DialogContentNonModal = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const context = useDialogContext(CONTENT_NAME$3, props.__scopeDialog);
      const hasInteractedOutsideRef = React__namespace.useRef(false);
      const hasPointerDownOutsideRef = React__namespace.useRef(false);
      return jsxRuntimeExports.jsx(
        DialogContentImpl,
        {
          ...props,
          ref: forwardedRef,
          trapFocus: false,
          disableOutsidePointerEvents: false,
          onCloseAutoFocus: (event) => {
            props.onCloseAutoFocus?.(event);
            if (!event.defaultPrevented) {
              if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
              event.preventDefault();
            }
            hasInteractedOutsideRef.current = false;
            hasPointerDownOutsideRef.current = false;
          },
          onInteractOutside: (event) => {
            props.onInteractOutside?.(event);
            if (!event.defaultPrevented) {
              hasInteractedOutsideRef.current = true;
              if (event.detail.originalEvent.type === "pointerdown") {
                hasPointerDownOutsideRef.current = true;
              }
            }
            const target = event.target;
            const targetIsTrigger = context.triggerRef.current?.contains(target);
            if (targetIsTrigger) event.preventDefault();
            if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
              event.preventDefault();
            }
          }
        }
      );
    }
  );
  var DialogContentImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
      const context = useDialogContext(CONTENT_NAME$3, __scopeDialog);
      const contentRef = React__namespace.useRef(null);
      const composedRefs = useComposedRefs$1(forwardedRef, contentRef);
      useFocusGuards();
      return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(
          FocusScope,
          {
            asChild: true,
            loop: true,
            trapped: trapFocus,
            onMountAutoFocus: onOpenAutoFocus,
            onUnmountAutoFocus: onCloseAutoFocus,
            children: jsxRuntimeExports.jsx(
              DismissableLayer,
              {
                role: "dialog",
                id: context.contentId,
                "aria-describedby": context.descriptionId,
                "aria-labelledby": context.titleId,
                "data-state": getState$1(context.open),
                ...contentProps,
                ref: composedRefs,
                onDismiss: () => context.onOpenChange(false)
              }
            )
          }
        ),
jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(TitleWarning, { titleId: context.titleId }),
jsxRuntimeExports.jsx(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
        ] })
      ] });
    }
  );
  var TITLE_NAME = "DialogTitle";
  var DialogTitle$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, ...titleProps } = props;
      const context = useDialogContext(TITLE_NAME, __scopeDialog);
      return jsxRuntimeExports.jsx(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
    }
  );
  DialogTitle$1.displayName = TITLE_NAME;
  var DESCRIPTION_NAME = "DialogDescription";
  var DialogDescription$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, ...descriptionProps } = props;
      const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
      return jsxRuntimeExports.jsx(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
    }
  );
  DialogDescription$1.displayName = DESCRIPTION_NAME;
  var CLOSE_NAME$1 = "DialogClose";
  var DialogClose$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeDialog, ...closeProps } = props;
      const context = useDialogContext(CLOSE_NAME$1, __scopeDialog);
      return jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          ...closeProps,
          ref: forwardedRef,
          onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
        }
      );
    }
  );
  DialogClose$1.displayName = CLOSE_NAME$1;
  function getState$1(open) {
    return open ? "open" : "closed";
  }
  var TITLE_WARNING_NAME = "DialogTitleWarning";
  var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
    contentName: CONTENT_NAME$3,
    titleName: TITLE_NAME,
    docsSlug: "dialog"
  });
  var TitleWarning = ({ titleId }) => {
    const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
    const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
    React__namespace.useEffect(() => {
      if (titleId) {
        const hasTitle = document.getElementById(titleId);
        if (!hasTitle) console.error(MESSAGE);
      }
    }, [MESSAGE, titleId]);
    return null;
  };
  var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
  var DescriptionWarning = ({ contentRef, descriptionId }) => {
    const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
    const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
    React__namespace.useEffect(() => {
      const describedById = contentRef.current?.getAttribute("aria-describedby");
      if (descriptionId && describedById) {
        const hasDescription = document.getElementById(descriptionId);
        if (!hasDescription) console.warn(MESSAGE);
      }
    }, [MESSAGE, contentRef, descriptionId]);
    return null;
  };
  var Root$3 = Dialog$1;
  var Portal$2 = DialogPortal$1;
  var Overlay = DialogOverlay$1;
  var Content$1 = DialogContent$1;
  var Title = DialogTitle$1;
  var Description = DialogDescription$1;
  var Close = DialogClose$1;
  function Dialog({
    ...props
  }) {
    return jsxRuntimeExports.jsx(Root$3, { "data-slot": "dialog", ...props });
  }
  function DialogPortal({
    ...props
  }) {
    return jsxRuntimeExports.jsx(Portal$2, { "data-slot": "dialog-portal", ...props });
  }
  function DialogClose({
    ...props
  }) {
    return jsxRuntimeExports.jsx(Close, { "data-slot": "dialog-close", ...props });
  }
  function DialogOverlay({
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Overlay,
      {
        "data-slot": "dialog-overlay",
        className: cn$1(
          "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
          className
        ),
        ...props
      }
    );
  }
  function DialogContent({
    className,
    children,
    showCloseButton = true,
    ...props
  }) {
    return jsxRuntimeExports.jsxs(DialogPortal, { "data-slot": "dialog-portal", children: [
jsxRuntimeExports.jsx(DialogOverlay, {}),
jsxRuntimeExports.jsxs(
        Content$1,
        {
          "data-slot": "dialog-content",
          className: cn$1(
            "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 fixed top-[50%] left-[50%] z-50 grid w-full max-w-[calc(100%-2rem)] translate-x-[-50%] translate-y-[-50%] gap-4 rounded-lg border p-6 shadow-lg duration-200 sm:max-w-lg",
            className
          ),
          ...props,
          children: [
            children,
            showCloseButton && jsxRuntimeExports.jsxs(
              Close,
              {
                "data-slot": "dialog-close",
                className: "ring-offset-background focus:ring-ring data-[state=open]:bg-accent data-[state=open]:text-muted-foreground absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
                children: [
jsxRuntimeExports.jsx(lucideReact.XIcon, {}),
jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
                ]
              }
            )
          ]
        }
      )
    ] });
  }
  function DialogHeader({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "dialog-header",
        className: cn$1("flex flex-col gap-2 text-center sm:text-left", className),
        ...props
      }
    );
  }
  function DialogFooter({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "dialog-footer",
        className: cn$1(
          "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
          className
        ),
        ...props
      }
    );
  }
  function DialogTitle({
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Title,
      {
        "data-slot": "dialog-title",
        className: cn$1("text-lg leading-none font-semibold", className),
        ...props
      }
    );
  }
  function DialogDescription({
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Description,
      {
        "data-slot": "dialog-description",
        className: cn$1("text-muted-foreground text-sm", className),
        ...props
      }
    );
  }
  var NAME$2 = "Label";
  var Label$1 = React__namespace.forwardRef((props, forwardedRef) => {
    return jsxRuntimeExports.jsx(
      Primitive.label,
      {
        ...props,
        ref: forwardedRef,
        onMouseDown: (event) => {
          const target = event.target;
          if (target.closest("button, input, select, textarea")) return;
          props.onMouseDown?.(event);
          if (!event.defaultPrevented && event.detail > 1) event.preventDefault();
        }
      }
    );
  });
  Label$1.displayName = NAME$2;
  var Root$2 = Label$1;
  function Label({
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Root$2,
      {
        "data-slot": "label",
        className: cn$1(
          "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
          className
        ),
        ...props
      }
    );
  }
  var NAME$1 = "Separator";
  var DEFAULT_ORIENTATION = "horizontal";
  var ORIENTATIONS = ["horizontal", "vertical"];
  var Separator$1 = React__namespace.forwardRef((props, forwardedRef) => {
    const { decorative, orientation: orientationProp = DEFAULT_ORIENTATION, ...domProps } = props;
    const orientation = isValidOrientation(orientationProp) ? orientationProp : DEFAULT_ORIENTATION;
    const ariaOrientation = orientation === "vertical" ? orientation : void 0;
    const semanticProps = decorative ? { role: "none" } : { "aria-orientation": ariaOrientation, role: "separator" };
    return jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-orientation": orientation,
        ...semanticProps,
        ...domProps,
        ref: forwardedRef
      }
    );
  });
  Separator$1.displayName = NAME$1;
  function isValidOrientation(orientation) {
    return ORIENTATIONS.includes(orientation);
  }
  var Root$1 = Separator$1;
  function Separator({
    className,
    orientation = "horizontal",
    decorative = true,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Root$1,
      {
        "data-slot": "separator",
        decorative,
        orientation,
        className: cn$1(
          "bg-border shrink-0 data-[orientation=horizontal]:h-px data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-px",
          className
        ),
        ...props
      }
    );
  }
  function FieldGroup({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "field-group",
        className: cn$1(
          "group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4",
          className
        ),
        ...props
      }
    );
  }
  const fieldVariants = cva(
    "group/field flex w-full gap-3 data-[invalid=true]:text-destructive",
    {
      variants: {
        orientation: {
          vertical: ["flex-col [&>*]:w-full [&>.sr-only]:w-auto"],
          horizontal: [
            "flex-row items-center",
            "[&>[data-slot=field-label]]:flex-auto",
            "has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
          ],
          responsive: [
            "flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto",
            "@md/field-group:[&>[data-slot=field-label]]:flex-auto",
            "@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px"
          ]
        }
      },
      defaultVariants: {
        orientation: "vertical"
      }
    }
  );
  function Field({
    className,
    orientation = "vertical",
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        role: "group",
        "data-slot": "field",
        "data-orientation": orientation,
        className: cn$1(fieldVariants({ orientation }), className),
        ...props
      }
    );
  }
  function FieldLabel({
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Label,
      {
        "data-slot": "field-label",
        className: cn$1(
          "group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50",
          "has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>*]:data-[slot=field]:p-4",
          "has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10",
          className
        ),
        ...props
      }
    );
  }
  function FieldError({
    className,
    children,
    errors,
    ...props
  }) {
    const content = React.useMemo(() => {
      if (children) {
        return children;
      }
      if (!errors?.length) {
        return null;
      }
      const uniqueErrors = [
        ...new Map(errors.map((error2) => [error2?.message, error2])).values()
      ];
      if (uniqueErrors?.length == 1) {
        return uniqueErrors[0]?.message;
      }
      return jsxRuntimeExports.jsx("ul", { className: "ml-4 flex list-disc flex-col gap-1", children: uniqueErrors.map(
        (error2, index2) => error2?.message && jsxRuntimeExports.jsx("li", { children: error2.message }, index2)
      ) });
    }, [children, errors]);
    if (!content) {
      return null;
    }
    return jsxRuntimeExports.jsx(
      "div",
      {
        role: "alert",
        "data-slot": "field-error",
        className: cn$1("text-destructive text-sm font-normal", className),
        ...props,
        children: content
      }
    );
  }
  function Input({ className, type, ...props }) {
    return jsxRuntimeExports.jsx(
      "input",
      {
        type,
        "data-slot": "input",
        className: cn$1(
          "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        ),
        ...props
      }
    );
  }
  function $constructor(name, initializer2, params) {
    function init(inst, def) {
      var _a;
      Object.defineProperty(inst, "_zod", {
        value: inst._zod ?? {},
        enumerable: false
      });
      (_a = inst._zod).traits ?? (_a.traits = new Set());
      inst._zod.traits.add(name);
      initializer2(inst, def);
      for (const k in _.prototype) {
        if (!(k in inst))
          Object.defineProperty(inst, k, { value: _.prototype[k].bind(inst) });
      }
      inst._zod.constr = _;
      inst._zod.def = def;
    }
    const Parent = params?.Parent ?? Object;
    class Definition extends Parent {
    }
    Object.defineProperty(Definition, "name", { value: name });
    function _(def) {
      var _a;
      const inst = params?.Parent ? new Definition() : this;
      init(inst, def);
      (_a = inst._zod).deferred ?? (_a.deferred = []);
      for (const fn of inst._zod.deferred) {
        fn();
      }
      return inst;
    }
    Object.defineProperty(_, "init", { value: init });
    Object.defineProperty(_, Symbol.hasInstance, {
      value: (inst) => {
        if (params?.Parent && inst instanceof params.Parent)
          return true;
        return inst?._zod?.traits?.has(name);
      }
    });
    Object.defineProperty(_, "name", { value: name });
    return _;
  }
  class $ZodAsyncError extends Error {
    constructor() {
      super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
    }
  }
  const globalConfig = {};
  function config(newConfig) {
    return globalConfig;
  }
  function jsonStringifyReplacer(_, value) {
    if (typeof value === "bigint")
      return value.toString();
    return value;
  }
  function cached(getter) {
    return {
      get value() {
        {
          const value = getter();
          Object.defineProperty(this, "value", { value });
          return value;
        }
      }
    };
  }
  function nullish(input) {
    return input === null || input === void 0;
  }
  const EVALUATING = Symbol("evaluating");
  function defineLazy(object2, key, getter) {
    let value = void 0;
    Object.defineProperty(object2, key, {
      get() {
        if (value === EVALUATING) {
          return void 0;
        }
        if (value === void 0) {
          value = EVALUATING;
          value = getter();
        }
        return value;
      },
      set(v) {
        Object.defineProperty(object2, key, {
          value: v
});
      },
      configurable: true
    });
  }
  const captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
  };
  function isObject(data) {
    return typeof data === "object" && data !== null && !Array.isArray(data);
  }
  function clone(inst, def, params) {
    const cl = new inst._zod.constr(def ?? inst._zod.def);
    if (!def || params?.parent)
      cl._zod.parent = inst;
    return cl;
  }
  function normalizeParams(_params) {
    const params = _params;
    if (!params)
      return {};
    if (typeof params === "string")
      return { error: () => params };
    if (params?.message !== void 0) {
      if (params?.error !== void 0)
        throw new Error("Cannot specify both `message` and `error` params");
      params.error = params.message;
    }
    delete params.message;
    if (typeof params.error === "string")
      return { ...params, error: () => params.error };
    return params;
  }
  function optionalKeys(shape) {
    return Object.keys(shape).filter((k) => {
      return shape[k]._zod.optin === "optional" && shape[k]._zod.optout === "optional";
    });
  }
  function aborted(x2, startIndex = 0) {
    if (x2.aborted === true)
      return true;
    for (let i2 = startIndex; i2 < x2.issues.length; i2++) {
      if (x2.issues[i2]?.continue !== true) {
        return true;
      }
    }
    return false;
  }
  function prefixIssues(path, issues) {
    return issues.map((iss) => {
      var _a;
      (_a = iss).path ?? (_a.path = []);
      iss.path.unshift(path);
      return iss;
    });
  }
  function unwrapMessage(message) {
    return typeof message === "string" ? message : message?.message;
  }
  function finalizeIssue(iss, ctx, config2) {
    const full = { ...iss, path: iss.path ?? [] };
    if (!iss.message) {
      const message = unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
      full.message = message;
    }
    delete full.inst;
    delete full.continue;
    if (!ctx?.reportInput) {
      delete full.input;
    }
    return full;
  }
  function getLengthableOrigin(input) {
    if (Array.isArray(input))
      return "array";
    if (typeof input === "string")
      return "string";
    return "unknown";
  }
  const initializer = (inst, def) => {
    inst.name = "$ZodError";
    Object.defineProperty(inst, "_zod", {
      value: inst._zod,
      enumerable: false
    });
    Object.defineProperty(inst, "issues", {
      value: def,
      enumerable: false
    });
    inst.message = JSON.stringify(def, jsonStringifyReplacer, 2);
    Object.defineProperty(inst, "toString", {
      value: () => inst.message,
      enumerable: false
    });
  };
  const $ZodError = $constructor("$ZodError", initializer);
  const $ZodRealError = $constructor("$ZodError", initializer, { Parent: Error });
  const _parse = (_Err) => (schema, value, _ctx, _params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: false }) : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError();
    }
    if (result.issues.length) {
      const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, _params?.callee);
      throw e;
    }
    return result.value;
  };
  const parse = _parse($ZodRealError);
  const _parseAsync = (_Err) => async (schema, value, _ctx, params) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    if (result.issues.length) {
      const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, params?.callee);
      throw e;
    }
    return result.value;
  };
  const parseAsync = _parseAsync($ZodRealError);
  const _safeParse = (_Err) => (schema, value, _ctx) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError();
    }
    return result.issues.length ? {
      success: false,
      error: new (_Err ?? $ZodError)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    } : { success: true, data: result.value };
  };
  const safeParse = _safeParse($ZodRealError);
  const _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
    const ctx = _ctx ? Object.assign(_ctx, { async: true }) : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    return result.issues.length ? {
      success: false,
      error: new _Err(result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
    } : { success: true, data: result.value };
  };
  const safeParseAsync = _safeParseAsync($ZodRealError);
  const string$1 = (params) => {
    const regex = params ? `[\\s\\S]{${params?.minimum ?? 0},${params?.maximum ?? ""}}` : `[\\s\\S]*`;
    return new RegExp(`^${regex}$`);
  };
  const $ZodCheck = $constructor("$ZodCheck", (inst, def) => {
    var _a;
    inst._zod ?? (inst._zod = {});
    inst._zod.def = def;
    (_a = inst._zod).onattach ?? (_a.onattach = []);
  });
  const $ZodCheckMaxLength = $constructor("$ZodCheckMaxLength", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.length !== void 0;
    });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.maximum ?? Number.POSITIVE_INFINITY;
      if (def.maximum < curr)
        inst2._zod.bag.maximum = def.maximum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length <= def.maximum)
        return;
      const origin = getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_big",
        maximum: def.maximum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort
      });
    };
  });
  const $ZodCheckMinLength = $constructor("$ZodCheckMinLength", (inst, def) => {
    var _a;
    $ZodCheck.init(inst, def);
    (_a = inst._zod.def).when ?? (_a.when = (payload) => {
      const val = payload.value;
      return !nullish(val) && val.length !== void 0;
    });
    inst._zod.onattach.push((inst2) => {
      const curr = inst2._zod.bag.minimum ?? Number.NEGATIVE_INFINITY;
      if (def.minimum > curr)
        inst2._zod.bag.minimum = def.minimum;
    });
    inst._zod.check = (payload) => {
      const input = payload.value;
      const length = input.length;
      if (length >= def.minimum)
        return;
      const origin = getLengthableOrigin(input);
      payload.issues.push({
        origin,
        code: "too_small",
        minimum: def.minimum,
        inclusive: true,
        input,
        inst,
        continue: !def.abort
      });
    };
  });
  const version$1 = {
    major: 4,
    minor: 1,
    patch: 12
  };
  const $ZodType = $constructor("$ZodType", (inst, def) => {
    var _a;
    inst ?? (inst = {});
    inst._zod.def = def;
    inst._zod.bag = inst._zod.bag || {};
    inst._zod.version = version$1;
    const checks = [...inst._zod.def.checks ?? []];
    if (inst._zod.traits.has("$ZodCheck")) {
      checks.unshift(inst);
    }
    for (const ch of checks) {
      for (const fn of ch._zod.onattach) {
        fn(inst);
      }
    }
    if (checks.length === 0) {
      (_a = inst._zod).deferred ?? (_a.deferred = []);
      inst._zod.deferred?.push(() => {
        inst._zod.run = inst._zod.parse;
      });
    } else {
      const runChecks = (payload, checks2, ctx) => {
        let isAborted = aborted(payload);
        let asyncResult;
        for (const ch of checks2) {
          if (ch._zod.def.when) {
            const shouldRun = ch._zod.def.when(payload);
            if (!shouldRun)
              continue;
          } else if (isAborted) {
            continue;
          }
          const currLen = payload.issues.length;
          const _ = ch._zod.check(payload);
          if (_ instanceof Promise && ctx?.async === false) {
            throw new $ZodAsyncError();
          }
          if (asyncResult || _ instanceof Promise) {
            asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
              await _;
              const nextLen = payload.issues.length;
              if (nextLen === currLen)
                return;
              if (!isAborted)
                isAborted = aborted(payload, currLen);
            });
          } else {
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              continue;
            if (!isAborted)
              isAborted = aborted(payload, currLen);
          }
        }
        if (asyncResult) {
          return asyncResult.then(() => {
            return payload;
          });
        }
        return payload;
      };
      const handleCanaryResult = (canary, payload, ctx) => {
        if (aborted(canary)) {
          canary.aborted = true;
          return canary;
        }
        const checkResult = runChecks(payload, checks, ctx);
        if (checkResult instanceof Promise) {
          if (ctx.async === false)
            throw new $ZodAsyncError();
          return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
        }
        return inst._zod.parse(checkResult, ctx);
      };
      inst._zod.run = (payload, ctx) => {
        if (ctx.skipChecks) {
          return inst._zod.parse(payload, ctx);
        }
        if (ctx.direction === "backward") {
          const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
          if (canary instanceof Promise) {
            return canary.then((canary2) => {
              return handleCanaryResult(canary2, payload, ctx);
            });
          }
          return handleCanaryResult(canary, payload, ctx);
        }
        const result = inst._zod.parse(payload, ctx);
        if (result instanceof Promise) {
          if (ctx.async === false)
            throw new $ZodAsyncError();
          return result.then((result2) => runChecks(result2, checks, ctx));
        }
        return runChecks(result, checks, ctx);
      };
    }
    inst["~standard"] = {
      validate: (value) => {
        try {
          const r2 = safeParse(inst, value);
          return r2.success ? { value: r2.data } : { issues: r2.error?.issues };
        } catch (_) {
          return safeParseAsync(inst, value).then((r2) => r2.success ? { value: r2.data } : { issues: r2.error?.issues });
        }
      },
      vendor: "zod",
      version: 1
    };
  });
  const $ZodString = $constructor("$ZodString", (inst, def) => {
    $ZodType.init(inst, def);
    inst._zod.pattern = [...inst?._zod.bag?.patterns ?? []].pop() ?? string$1(inst._zod.bag);
    inst._zod.parse = (payload, _) => {
      if (def.coerce)
        try {
          payload.value = String(payload.value);
        } catch (_2) {
        }
      if (typeof payload.value === "string")
        return payload;
      payload.issues.push({
        expected: "string",
        code: "invalid_type",
        input: payload.value,
        inst
      });
      return payload;
    };
  });
  function handlePropertyResult(result, final, key, input) {
    if (result.issues.length) {
      final.issues.push(...prefixIssues(key, result.issues));
    }
    if (result.value === void 0) {
      if (key in input) {
        final.value[key] = void 0;
      }
    } else {
      final.value[key] = result.value;
    }
  }
  function normalizeDef(def) {
    const keys = Object.keys(def.shape);
    for (const k of keys) {
      if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
        throw new Error(`Invalid element at key "${k}": expected a Zod schema`);
      }
    }
    const okeys = optionalKeys(def.shape);
    return {
      ...def,
      keys,
      keySet: new Set(keys),
      numKeys: keys.length,
      optionalKeys: new Set(okeys)
    };
  }
  function handleCatchall(proms, input, payload, ctx, def, inst) {
    const unrecognized = [];
    const keySet = def.keySet;
    const _catchall = def.catchall._zod;
    const t2 = _catchall.def.type;
    for (const key of Object.keys(input)) {
      if (keySet.has(key))
        continue;
      if (t2 === "never") {
        unrecognized.push(key);
        continue;
      }
      const r2 = _catchall.run({ value: input[key], issues: [] }, ctx);
      if (r2 instanceof Promise) {
        proms.push(r2.then((r3) => handlePropertyResult(r3, payload, key, input)));
      } else {
        handlePropertyResult(r2, payload, key, input);
      }
    }
    if (unrecognized.length) {
      payload.issues.push({
        code: "unrecognized_keys",
        keys: unrecognized,
        input,
        inst
      });
    }
    if (!proms.length)
      return payload;
    return Promise.all(proms).then(() => {
      return payload;
    });
  }
  const $ZodObject = $constructor("$ZodObject", (inst, def) => {
    $ZodType.init(inst, def);
    const desc = Object.getOwnPropertyDescriptor(def, "shape");
    if (!desc?.get) {
      const sh = def.shape;
      Object.defineProperty(def, "shape", {
        get: () => {
          const newSh = { ...sh };
          Object.defineProperty(def, "shape", {
            value: newSh
          });
          return newSh;
        }
      });
    }
    const _normalized = cached(() => normalizeDef(def));
    defineLazy(inst._zod, "propValues", () => {
      const shape = def.shape;
      const propValues = {};
      for (const key in shape) {
        const field = shape[key]._zod;
        if (field.values) {
          propValues[key] ?? (propValues[key] = new Set());
          for (const v of field.values)
            propValues[key].add(v);
        }
      }
      return propValues;
    });
    const isObject$12 = isObject;
    const catchall = def.catchall;
    let value;
    inst._zod.parse = (payload, ctx) => {
      value ?? (value = _normalized.value);
      const input = payload.value;
      if (!isObject$12(input)) {
        payload.issues.push({
          expected: "object",
          code: "invalid_type",
          input,
          inst
        });
        return payload;
      }
      payload.value = {};
      const proms = [];
      const shape = value.shape;
      for (const key of value.keys) {
        const el = shape[key];
        const r2 = el._zod.run({ value: input[key], issues: [] }, ctx);
        if (r2 instanceof Promise) {
          proms.push(r2.then((r3) => handlePropertyResult(r3, payload, key, input)));
        } else {
          handlePropertyResult(r2, payload, key, input);
        }
      }
      if (!catchall) {
        return proms.length ? Promise.all(proms).then(() => payload) : payload;
      }
      return handleCatchall(proms, input, payload, ctx, _normalized.value, inst);
    };
  });
  function _string(Class, params) {
    return new Class({
      type: "string",
      ...normalizeParams(params)
    });
  }
  function _maxLength(maximum, params) {
    const ch = new $ZodCheckMaxLength({
      check: "max_length",
      ...normalizeParams(params),
      maximum
    });
    return ch;
  }
  function _minLength(minimum, params) {
    return new $ZodCheckMinLength({
      check: "min_length",
      ...normalizeParams(params),
      minimum
    });
  }
  const ZodMiniType = $constructor("ZodMiniType", (inst, def) => {
    if (!inst._zod)
      throw new Error("Uninitialized schema in ZodMiniType.");
    $ZodType.init(inst, def);
    inst.def = def;
    inst.type = def.type;
    inst.parse = (data, params) => parse(inst, data, params, { callee: inst.parse });
    inst.safeParse = (data, params) => safeParse(inst, data, params);
    inst.parseAsync = async (data, params) => parseAsync(inst, data, params, { callee: inst.parseAsync });
    inst.safeParseAsync = async (data, params) => safeParseAsync(inst, data, params);
    inst.check = (...checks) => {
      return inst.clone(
        {
          ...def,
          checks: [
            ...def.checks ?? [],
            ...checks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
          ]
        }
);
    };
    inst.clone = (_def, params) => clone(inst, _def, params);
    inst.brand = () => inst;
    inst.register = ((reg, meta) => {
      reg.add(inst, meta);
      return inst;
    });
  });
  const ZodMiniString = $constructor("ZodMiniString", (inst, def) => {
    $ZodString.init(inst, def);
    ZodMiniType.init(inst, def);
  });
  function string(params) {
    return _string(ZodMiniString, params);
  }
  const ZodMiniObject = $constructor("ZodMiniObject", (inst, def) => {
    $ZodObject.init(inst, def);
    ZodMiniType.init(inst, def);
    defineLazy(inst, "shape", () => def.shape);
  });
  function object(shape, params) {
    const def = {
      type: "object",
      shape: shape ?? {},
      ...normalizeParams(params)
    };
    return new ZodMiniObject(def);
  }
  const r = (t2, r2, o2) => {
    if (t2 && "reportValidity" in t2) {
      const s2 = reactHookForm.get(o2, r2);
      t2.setCustomValidity(s2 && s2.message || ""), t2.reportValidity();
    }
  }, o = (e, t2) => {
    for (const o2 in t2.fields) {
      const s2 = t2.fields[o2];
      s2 && s2.ref && "reportValidity" in s2.ref ? r(s2.ref, o2, e) : s2 && s2.refs && s2.refs.forEach((t3) => r(t3, o2, e));
    }
  }, s$1 = (r2, s2) => {
    s2.shouldUseNativeValidation && o(r2, s2);
    const n2 = {};
    for (const o2 in r2) {
      const f = reactHookForm.get(s2.fields, o2), c = Object.assign(r2[o2] || {}, { ref: f && f.ref });
      if (i$1(s2.names || Object.keys(r2), o2)) {
        const r3 = Object.assign({}, reactHookForm.get(n2, o2));
        reactHookForm.set(r3, "root", c), reactHookForm.set(n2, o2, r3);
      } else reactHookForm.set(n2, o2, c);
    }
    return n2;
  }, i$1 = (e, t2) => {
    const r2 = n(t2);
    return e.some((e2) => n(e2).match(`^${r2}\\.\\d+`));
  };
  function n(e) {
    return e.replace(/\]|\[/g, "");
  }
  function t(r2, e) {
    try {
      var o2 = r2();
    } catch (r3) {
      return e(r3);
    }
    return o2 && o2.then ? o2.then(void 0, e) : o2;
  }
  function s(r2, e) {
    for (var n2 = {}; r2.length; ) {
      var t2 = r2[0], s2 = t2.code, i2 = t2.message, a2 = t2.path.join(".");
      if (!n2[a2]) if ("unionErrors" in t2) {
        var u = t2.unionErrors[0].errors[0];
        n2[a2] = { message: u.message, type: u.code };
      } else n2[a2] = { message: i2, type: s2 };
      if ("unionErrors" in t2 && t2.unionErrors.forEach(function(e2) {
        return e2.errors.forEach(function(e3) {
          return r2.push(e3);
        });
      }), e) {
        var c = n2[a2].types, f = c && c[t2.code];
        n2[a2] = reactHookForm.appendErrors(a2, e, n2, s2, f ? [].concat(f, t2.message) : t2.message);
      }
      r2.shift();
    }
    return n2;
  }
  function i(r2, e) {
    for (var n2 = {}; r2.length; ) {
      var t2 = r2[0], s2 = t2.code, i2 = t2.message, a2 = t2.path.join(".");
      if (!n2[a2]) if ("invalid_union" === t2.code && t2.errors.length > 0) {
        var u = t2.errors[0][0];
        n2[a2] = { message: u.message, type: u.code };
      } else n2[a2] = { message: i2, type: s2 };
      if ("invalid_union" === t2.code && t2.errors.forEach(function(e2) {
        return e2.forEach(function(e3) {
          return r2.push(e3);
        });
      }), e) {
        var c = n2[a2].types, f = c && c[t2.code];
        n2[a2] = reactHookForm.appendErrors(a2, e, n2, s2, f ? [].concat(f, t2.message) : t2.message);
      }
      r2.shift();
    }
    return n2;
  }
  function a(o$1, a2, u) {
    if (void 0 === u && (u = {}), (function(r2) {
      return "_def" in r2 && "object" == typeof r2._def && "typeName" in r2._def;
    })(o$1)) return function(n2, i2, c) {
      try {
        return Promise.resolve(t(function() {
          return Promise.resolve(o$1["sync" === u.mode ? "parse" : "parseAsync"](n2, a2)).then(function(e) {
            return c.shouldUseNativeValidation && o({}, c), { errors: {}, values: u.raw ? Object.assign({}, n2) : e };
          });
        }, function(r2) {
          if ((function(r3) {
            return Array.isArray(null == r3 ? void 0 : r3.issues);
          })(r2)) return { values: {}, errors: s$1(s(r2.errors, !c.shouldUseNativeValidation && "all" === c.criteriaMode), c) };
          throw r2;
        }));
      } catch (r2) {
        return Promise.reject(r2);
      }
    };
    if ((function(r2) {
      return "_zod" in r2 && "object" == typeof r2._zod;
    })(o$1)) return function(s2, c, f) {
      try {
        return Promise.resolve(t(function() {
          return Promise.resolve(("sync" === u.mode ? parse : parseAsync)(o$1, s2, a2)).then(function(e) {
            return f.shouldUseNativeValidation && o({}, f), { errors: {}, values: u.raw ? Object.assign({}, s2) : e };
          });
        }, function(r2) {
          if ((function(r3) {
            return r3 instanceof $ZodError;
          })(r2)) return { values: {}, errors: s$1(i(r2.issues, !f.shouldUseNativeValidation && "all" === f.criteriaMode), f) };
          throw r2;
        }));
      } catch (r2) {
        return Promise.reject(r2);
      }
    };
    throw new Error("Invalid input: not a Zod schema");
  }
  const _userLabelsAtom = utils.atomWithStorage(
    `${"cx-style"}-user_labels`,
    []
  );
  const userLabelsAtom = jotai.atom(
    (get2) => get2(_userLabelsAtom),
    (get2, set2, action) => {
      const prev = get2(_userLabelsAtom);
      let next = [];
      switch (action.type) {
        case "add":
          next = [action.label, ...prev.filter((l) => l.id !== action.label.id)];
          break;
        case "remove":
          next = prev.filter((l) => l.id !== action.id);
          break;
        case "clear":
          break;
        default:
          next = prev;
      }
      set2(_userLabelsAtom, next);
    }
  );
  const userLabelByIdAtom = utils.atomFamily(
    (id2) => jotai.atom((get2) => {
      const labels = get2(_userLabelsAtom);
      return labels.find((l) => l.id === id2) ?? null;
    })
  );
  utils.atomFamily(
    (username) => jotai.atom((get2) => {
      const labels = get2(_userLabelsAtom);
      return labels.find((l) => l.username === username) ?? null;
    })
  );
  function ChatHistory(props) {
    const { messages, isConnected } = props;
    const { containerRef, scrollToBottom, isAutoScrollEnabled } = useSmartAutoScroll();
    const [pendingImagePromises, setPendingImagePromises] = React.useState([]);
    const newMessages = useUnreadMessages(messages, isAutoScrollEnabled);
    const handleImageDone = (p) => {
      setPendingImagePromises((e) => [...e, p]);
    };
    React.useEffect(() => {
      if (!isAutoScrollEnabled) return;
      scrollToBottom();
      if (pendingImagePromises.length === 0) {
        return;
      }
      let cancelled = false;
      Promise.allSettled(pendingImagePromises).then((e) => {
        if (!cancelled) {
          scrollToBottom();
          setPendingImagePromises([]);
        }
      });
      return () => {
        cancelled = true;
      };
    }, [messages, pendingImagePromises, isAutoScrollEnabled]);
    return jsxRuntimeExports.jsxs(ScrollArea, { className: "flex-1 min-h-0", ref: containerRef, children: [
jsxRuntimeExports.jsx("div", { className: "p-4 flex flex-col gap-1.5", children: messages.map((m) => {
        let messageEle;
        switch (m.type) {
          case "history_message":
          case "message":
            messageEle = jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(UserNameDropdown, { message: m }),
jsxRuntimeExports.jsx("span", { className: "ml-2 leading-5", children: jsxRuntimeExports.jsx(Message, { text: m.message, onImageDone: handleImageDone }) })
            ] });
            break;
          case "status_change":
            messageEle = jsxRuntimeExports.jsx(
              "div",
              {
                dangerouslySetInnerHTML: { __html: m.content.message },
                className: "rounded-lg p-3 bg-primary/35 text-center break-keep"
              }
            );
            break;
          case "system":
            messageEle = jsxRuntimeExports.jsx(
              "div",
              {
                dangerouslySetInnerHTML: { __html: m.message },
                className: "rounded-lg p-3 bg-primary/35 text-center break-keep "
              }
            );
            break;
          default:
            return;
        }
        return jsxRuntimeExports.jsx("div", { className: "text-sm", children: messageEle }, m.helpId);
      }) }),
jsxRuntimeExports.jsx(AnimatePresence, { children: !isAutoScrollEnabled && newMessages.length > 0 && jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "absolute bottom-2 left-0 right-0 flex justify-center",
          initial: { y: 8, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 8, opacity: 0 },
          transition: { duration: 0.3 },
          children: jsxRuntimeExports.jsxs(
            Button,
            {
              className: "rounded-full flex items-center gap-0.5",
              size: "sm",
              onClick: () => {
                scrollToBottom();
              },
              children: [
jsxRuntimeExports.jsx(lucideReact.ChevronsDown, { className: "size-4.5 animate-bounce translate-y-1/6" }),
                newMessages.length,
                "条新消息"
              ]
            }
          )
        }
      ) }),
jsxRuntimeExports.jsx(AnimatePresence, { children: !isConnected && jsxRuntimeExports.jsx(
        motion.div,
        {
          className: "absolute bottom-2 left-0 right-0 flex justify-center",
          initial: { y: 8, opacity: 0 },
          animate: { y: 0, opacity: 1 },
          exit: { y: 8, opacity: 0 },
          transition: { duration: 0.3 },
          children: jsxRuntimeExports.jsxs("span", { className: "px-3 py-1.5 flex items-center gap-1.5 bg-primary/90 rounded-full text-primary-foreground text-sm", children: [
jsxRuntimeExports.jsx(LoadingIcon, { className: "size-5", strokeWidth: 120 }),
            "正在连接聊天室..."
          ] })
        }
      ) })
    ] });
  }
  function UserNameDropdown({
    message
  }) {
    const user = jotai.useAtomValue(userAtom);
    const { ip, id: id2, username } = message;
    const isMe = user?.id === id2;
    if (isMe) {
      return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(Badge, { className: "scale-90", children: "我" }),
jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
          username,
          ":"
        ] })
      ] });
    }
    const userLabel = jotai.useAtomValue(userLabelByIdAtom(id2));
    const labelDispath = jotai.useSetAtom(userLabelsAtom);
    const [showLableDialog, setShowLabelDialog] = React.useState(false);
    const [bannedUsers, dispatch] = jotai.useAtom(bannedUsersAtom);
    const banned = React.useMemo(() => {
      return bannedUsers.some((u) => u.id === id2);
    }, [bannedUsers, id2]);
    const handleBanUser = () => {
      if (banned) {
        dispatch({ type: "remove", id: id2 });
      } else {
        dispatch({ type: "add", user: { ip, id: id2, username } });
      }
    };
    const handleRemoveLabel = (id22) => {
      labelDispath({ type: "remove", id: id22 });
    };
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsxs(DropdownMenu, { children: [
jsxRuntimeExports.jsx(DropdownMenuTrigger, { children: jsxRuntimeExports.jsxs("span", { className: "text-primary", children: [
          userLabel?.label || username,
          ":"
        ] }) }),
jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "start", children: [
jsxRuntimeExports.jsxs(DropdownMenuLabel, { children: [
            userLabel?.label || username,
            userLabel?.label && `（${username}）`
          ] }),
jsxRuntimeExports.jsxs(DropdownMenuGroup, { children: [
jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: handleBanUser, children: banned ? "解除屏蔽" : "屏蔽用户" }),
jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => setShowLabelDialog(true), children: "标记用户" }),
            userLabel && jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => handleRemoveLabel(id2), children: "清除标记" })
          ] })
        ] })
      ] }),
jsxRuntimeExports.jsx(
        LabelDialog,
        {
          message,
          open: showLableDialog,
          onOpenChange: setShowLabelDialog
        }
      )
    ] });
  }
  const formSchema$1 = object({
    label: string().check(_minLength(1, "用户标记不能为空")).check(_maxLength(10, "用户标记不能超过10个字符"))
  });
  function LabelDialog({
    message,
    open,
    onOpenChange
  }) {
    const { id: id2, ip, username } = message;
    const userLabel = jotai.useAtomValue(userLabelByIdAtom(id2));
    const dispatch = jotai.useSetAtom(userLabelsAtom);
    const { handleSubmit, control, reset } = reactHookForm.useForm({
      resolver: a(formSchema$1),
      defaultValues: {
        label: userLabel?.label || ""
      }
    });
    function onSubmit(data) {
      dispatch({ type: "add", label: { id: id2, ip, username, label: data.label } });
      onOpenChange?.(false);
      reset();
    }
    React.useEffect(() => {
      reset({ label: userLabel?.label || "" });
    }, [userLabel, reset]);
    return jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: jsxRuntimeExports.jsxs(DialogContent, { children: [
jsxRuntimeExports.jsxs(DialogHeader, { children: [
jsxRuntimeExports.jsxs(DialogTitle, { children: [
          "标记 【",
          username,
          "】"
        ] }),
jsxRuntimeExports.jsx(DialogDescription, { children: "标记用户后，会以标记替换用户的用户名。需要注意的是，用户标记只能自己看到，其他人是看得不到的" })
      ] }),
jsxRuntimeExports.jsxs(
        "form",
        {
          id: "label-form",
          className: "space-y-4",
          onSubmit: handleSubmit(onSubmit),
          children: [
jsxRuntimeExports.jsx(FieldGroup, { children: jsxRuntimeExports.jsx(
              reactHookForm.Controller,
              {
                control,
                name: "label",
                render: ({ field, fieldState }) => jsxRuntimeExports.jsxs(Field, { "data-invalid": fieldState.invalid, children: [
jsxRuntimeExports.jsx(FieldLabel, { htmlFor: "label", children: "用户标记" }),
jsxRuntimeExports.jsx(
                    Input,
                    {
                      ...field,
                      id: "label",
                      "aria-invalid": fieldState.invalid,
                      autoComplete: "off"
                    }
                  ),
                  fieldState.invalid && jsxRuntimeExports.jsx(FieldError, { errors: [fieldState.error] })
                ] })
              }
            ) }),
jsxRuntimeExports.jsxs(DialogFooter, { children: [
jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: jsxRuntimeExports.jsx(Button, { variant: "outline", children: "关闭" }) }),
jsxRuntimeExports.jsx(Button, { type: "submit", children: "确定" })
            ] })
          ]
        }
      )
    ] }) });
  }
  function OnlineCount(props) {
    const { count: count2 } = props;
    return jsxRuntimeExports.jsxs("div", { className: "h-12 border-b border-border flex items-center justify-between px-4", children: [
jsxRuntimeExports.jsx("span", { children: "在线人数" }),
jsxRuntimeExports.jsxs("span", { className: "ml-2", children: [
        count2 && count2 > -1 ? count2 : "--",
        "人"
      ] })
    ] });
  }
  var POPOVER_NAME = "Popover";
  var [createPopoverContext] = createContextScope(POPOVER_NAME, [
    createPopperScope
  ]);
  var usePopperScope$1 = createPopperScope();
  var [PopoverProvider, usePopoverContext] = createPopoverContext(POPOVER_NAME);
  var Popover$1 = (props) => {
    const {
      __scopePopover,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      modal = false
    } = props;
    const popperScope = usePopperScope$1(__scopePopover);
    const triggerRef = React__namespace.useRef(null);
    const [hasCustomAnchor, setHasCustomAnchor] = React__namespace.useState(false);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: onOpenChange,
      caller: POPOVER_NAME
    });
    return jsxRuntimeExports.jsx(Root2$3, { ...popperScope, children: jsxRuntimeExports.jsx(
      PopoverProvider,
      {
        scope: __scopePopover,
        contentId: useId(),
        triggerRef,
        open,
        onOpenChange: setOpen,
        onOpenToggle: React__namespace.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
        hasCustomAnchor,
        onCustomAnchorAdd: React__namespace.useCallback(() => setHasCustomAnchor(true), []),
        onCustomAnchorRemove: React__namespace.useCallback(() => setHasCustomAnchor(false), []),
        modal,
        children
      }
    ) });
  };
  Popover$1.displayName = POPOVER_NAME;
  var ANCHOR_NAME = "PopoverAnchor";
  var PopoverAnchor = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopover, ...anchorProps } = props;
      const context = usePopoverContext(ANCHOR_NAME, __scopePopover);
      const popperScope = usePopperScope$1(__scopePopover);
      const { onCustomAnchorAdd, onCustomAnchorRemove } = context;
      React__namespace.useEffect(() => {
        onCustomAnchorAdd();
        return () => onCustomAnchorRemove();
      }, [onCustomAnchorAdd, onCustomAnchorRemove]);
      return jsxRuntimeExports.jsx(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
    }
  );
  PopoverAnchor.displayName = ANCHOR_NAME;
  var TRIGGER_NAME$2 = "PopoverTrigger";
  var PopoverTrigger$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopover, ...triggerProps } = props;
      const context = usePopoverContext(TRIGGER_NAME$2, __scopePopover);
      const popperScope = usePopperScope$1(__scopePopover);
      const composedTriggerRef = useComposedRefs$1(forwardedRef, context.triggerRef);
      const trigger = jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          "aria-haspopup": "dialog",
          "aria-expanded": context.open,
          "aria-controls": context.contentId,
          "data-state": getState(context.open),
          ...triggerProps,
          ref: composedTriggerRef,
          onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
        }
      );
      return context.hasCustomAnchor ? trigger : jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: trigger });
    }
  );
  PopoverTrigger$1.displayName = TRIGGER_NAME$2;
  var PORTAL_NAME$1 = "PopoverPortal";
  var [PortalProvider$1, usePortalContext$1] = createPopoverContext(PORTAL_NAME$1, {
    forceMount: void 0
  });
  var PopoverPortal = (props) => {
    const { __scopePopover, forceMount, children, container } = props;
    const context = usePopoverContext(PORTAL_NAME$1, __scopePopover);
    return jsxRuntimeExports.jsx(PortalProvider$1, { scope: __scopePopover, forceMount, children: jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: jsxRuntimeExports.jsx(Portal$4, { asChild: true, container, children }) }) });
  };
  PopoverPortal.displayName = PORTAL_NAME$1;
  var CONTENT_NAME$2 = "PopoverContent";
  var PopoverContent$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext$1(CONTENT_NAME$2, props.__scopePopover);
      const { forceMount = portalContext.forceMount, ...contentProps } = props;
      const context = usePopoverContext(CONTENT_NAME$2, props.__scopePopover);
      return jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? jsxRuntimeExports.jsx(PopoverContentModal, { ...contentProps, ref: forwardedRef }) : jsxRuntimeExports.jsx(PopoverContentNonModal, { ...contentProps, ref: forwardedRef }) });
    }
  );
  PopoverContent$1.displayName = CONTENT_NAME$2;
  var Slot = createSlot("PopoverContent.RemoveScroll");
  var PopoverContentModal = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const context = usePopoverContext(CONTENT_NAME$2, props.__scopePopover);
      const contentRef = React__namespace.useRef(null);
      const composedRefs = useComposedRefs$1(forwardedRef, contentRef);
      const isRightClickOutsideRef = React__namespace.useRef(false);
      React__namespace.useEffect(() => {
        const content = contentRef.current;
        if (content) return hideOthers(content);
      }, []);
      return jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, children: jsxRuntimeExports.jsx(
        PopoverContentImpl,
        {
          ...props,
          ref: composedRefs,
          trapFocus: context.open,
          disableOutsidePointerEvents: true,
          onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
            event.preventDefault();
            if (!isRightClickOutsideRef.current) context.triggerRef.current?.focus();
          }),
          onPointerDownOutside: composeEventHandlers(
            props.onPointerDownOutside,
            (event) => {
              const originalEvent = event.detail.originalEvent;
              const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
              const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
              isRightClickOutsideRef.current = isRightClick;
            },
            { checkForDefaultPrevented: false }
          ),
          onFocusOutside: composeEventHandlers(
            props.onFocusOutside,
            (event) => event.preventDefault(),
            { checkForDefaultPrevented: false }
          )
        }
      ) });
    }
  );
  var PopoverContentNonModal = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const context = usePopoverContext(CONTENT_NAME$2, props.__scopePopover);
      const hasInteractedOutsideRef = React__namespace.useRef(false);
      const hasPointerDownOutsideRef = React__namespace.useRef(false);
      return jsxRuntimeExports.jsx(
        PopoverContentImpl,
        {
          ...props,
          ref: forwardedRef,
          trapFocus: false,
          disableOutsidePointerEvents: false,
          onCloseAutoFocus: (event) => {
            props.onCloseAutoFocus?.(event);
            if (!event.defaultPrevented) {
              if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
              event.preventDefault();
            }
            hasInteractedOutsideRef.current = false;
            hasPointerDownOutsideRef.current = false;
          },
          onInteractOutside: (event) => {
            props.onInteractOutside?.(event);
            if (!event.defaultPrevented) {
              hasInteractedOutsideRef.current = true;
              if (event.detail.originalEvent.type === "pointerdown") {
                hasPointerDownOutsideRef.current = true;
              }
            }
            const target = event.target;
            const targetIsTrigger = context.triggerRef.current?.contains(target);
            if (targetIsTrigger) event.preventDefault();
            if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
              event.preventDefault();
            }
          }
        }
      );
    }
  );
  var PopoverContentImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopePopover,
        trapFocus,
        onOpenAutoFocus,
        onCloseAutoFocus,
        disableOutsidePointerEvents,
        onEscapeKeyDown,
        onPointerDownOutside,
        onFocusOutside,
        onInteractOutside,
        ...contentProps
      } = props;
      const context = usePopoverContext(CONTENT_NAME$2, __scopePopover);
      const popperScope = usePopperScope$1(__scopePopover);
      useFocusGuards();
      return jsxRuntimeExports.jsx(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: jsxRuntimeExports.jsx(
            DismissableLayer,
            {
              asChild: true,
              disableOutsidePointerEvents,
              onInteractOutside,
              onEscapeKeyDown,
              onPointerDownOutside,
              onFocusOutside,
              onDismiss: () => context.onOpenChange(false),
              children: jsxRuntimeExports.jsx(
                Content$2,
                {
                  "data-state": getState(context.open),
                  role: "dialog",
                  id: context.contentId,
                  ...popperScope,
                  ...contentProps,
                  ref: forwardedRef,
                  style: {
                    ...contentProps.style,
...{
                      "--radix-popover-content-transform-origin": "var(--radix-popper-transform-origin)",
                      "--radix-popover-content-available-width": "var(--radix-popper-available-width)",
                      "--radix-popover-content-available-height": "var(--radix-popper-available-height)",
                      "--radix-popover-trigger-width": "var(--radix-popper-anchor-width)",
                      "--radix-popover-trigger-height": "var(--radix-popper-anchor-height)"
                    }
                  }
                }
              )
            }
          )
        }
      );
    }
  );
  var CLOSE_NAME = "PopoverClose";
  var PopoverClose = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopover, ...closeProps } = props;
      const context = usePopoverContext(CLOSE_NAME, __scopePopover);
      return jsxRuntimeExports.jsx(
        Primitive.button,
        {
          type: "button",
          ...closeProps,
          ref: forwardedRef,
          onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
        }
      );
    }
  );
  PopoverClose.displayName = CLOSE_NAME;
  var ARROW_NAME$1 = "PopoverArrow";
  var PopoverArrow = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopePopover, ...arrowProps } = props;
      const popperScope = usePopperScope$1(__scopePopover);
      return jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
    }
  );
  PopoverArrow.displayName = ARROW_NAME$1;
  function getState(open) {
    return open ? "open" : "closed";
  }
  var Root2$1 = Popover$1;
  var Trigger$2 = PopoverTrigger$1;
  var Portal$1 = PopoverPortal;
  var Content2$1 = PopoverContent$1;
  function Popover({
    ...props
  }) {
    return jsxRuntimeExports.jsx(Root2$1, { "data-slot": "popover", ...props });
  }
  function PopoverTrigger({
    ...props
  }) {
    return jsxRuntimeExports.jsx(Trigger$2, { "data-slot": "popover-trigger", ...props });
  }
  function PopoverContent({
    className,
    align = "center",
    sideOffset = 4,
    ...props
  }) {
    return jsxRuntimeExports.jsx(Portal$1, { children: jsxRuntimeExports.jsx(
      Content2$1,
      {
        "data-slot": "popover-content",
        align,
        sideOffset,
        className: cn$1(
          "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-72 origin-(--radix-popover-content-transform-origin) rounded-md border p-4 shadow-md outline-hidden",
          className
        ),
        ...props
      }
    ) });
  }
  var TABS_NAME = "Tabs";
  var [createTabsContext] = createContextScope(TABS_NAME, [
    createRovingFocusGroupScope
  ]);
  var useRovingFocusGroupScope = createRovingFocusGroupScope();
  var [TabsProvider, useTabsContext] = createTabsContext(TABS_NAME);
  var Tabs$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeTabs,
        value: valueProp,
        onValueChange,
        defaultValue,
        orientation = "horizontal",
        dir,
        activationMode = "automatic",
        ...tabsProps
      } = props;
      const direction = useDirection(dir);
      const [value, setValue] = useControllableState({
        prop: valueProp,
        onChange: onValueChange,
        defaultProp: defaultValue ?? "",
        caller: TABS_NAME
      });
      return jsxRuntimeExports.jsx(
        TabsProvider,
        {
          scope: __scopeTabs,
          baseId: useId(),
          value,
          onValueChange: setValue,
          orientation,
          dir: direction,
          activationMode,
          children: jsxRuntimeExports.jsx(
            Primitive.div,
            {
              dir: direction,
              "data-orientation": orientation,
              ...tabsProps,
              ref: forwardedRef
            }
          )
        }
      );
    }
  );
  Tabs$1.displayName = TABS_NAME;
  var TAB_LIST_NAME = "TabsList";
  var TabsList$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTabs, loop = true, ...listProps } = props;
      const context = useTabsContext(TAB_LIST_NAME, __scopeTabs);
      const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
      return jsxRuntimeExports.jsx(
        Root$4,
        {
          asChild: true,
          ...rovingFocusGroupScope,
          orientation: context.orientation,
          dir: context.dir,
          loop,
          children: jsxRuntimeExports.jsx(
            Primitive.div,
            {
              role: "tablist",
              "aria-orientation": context.orientation,
              ...listProps,
              ref: forwardedRef
            }
          )
        }
      );
    }
  );
  TabsList$1.displayName = TAB_LIST_NAME;
  var TRIGGER_NAME$1 = "TabsTrigger";
  var TabsTrigger$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTabs, value, disabled = false, ...triggerProps } = props;
      const context = useTabsContext(TRIGGER_NAME$1, __scopeTabs);
      const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeTabs);
      const triggerId = makeTriggerId(context.baseId, value);
      const contentId = makeContentId(context.baseId, value);
      const isSelected = value === context.value;
      return jsxRuntimeExports.jsx(
        Item,
        {
          asChild: true,
          ...rovingFocusGroupScope,
          focusable: !disabled,
          active: isSelected,
          children: jsxRuntimeExports.jsx(
            Primitive.button,
            {
              type: "button",
              role: "tab",
              "aria-selected": isSelected,
              "aria-controls": contentId,
              "data-state": isSelected ? "active" : "inactive",
              "data-disabled": disabled ? "" : void 0,
              disabled,
              id: triggerId,
              ...triggerProps,
              ref: forwardedRef,
              onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
                if (!disabled && event.button === 0 && event.ctrlKey === false) {
                  context.onValueChange(value);
                } else {
                  event.preventDefault();
                }
              }),
              onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
                if ([" ", "Enter"].includes(event.key)) context.onValueChange(value);
              }),
              onFocus: composeEventHandlers(props.onFocus, () => {
                const isAutomaticActivation = context.activationMode !== "manual";
                if (!isSelected && !disabled && isAutomaticActivation) {
                  context.onValueChange(value);
                }
              })
            }
          )
        }
      );
    }
  );
  TabsTrigger$1.displayName = TRIGGER_NAME$1;
  var CONTENT_NAME$1 = "TabsContent";
  var TabsContent$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTabs, value, forceMount, children, ...contentProps } = props;
      const context = useTabsContext(CONTENT_NAME$1, __scopeTabs);
      const triggerId = makeTriggerId(context.baseId, value);
      const contentId = makeContentId(context.baseId, value);
      const isSelected = value === context.value;
      const isMountAnimationPreventedRef = React__namespace.useRef(isSelected);
      React__namespace.useEffect(() => {
        const rAF = requestAnimationFrame(() => isMountAnimationPreventedRef.current = false);
        return () => cancelAnimationFrame(rAF);
      }, []);
      return jsxRuntimeExports.jsx(Presence, { present: forceMount || isSelected, children: ({ present }) => jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": isSelected ? "active" : "inactive",
          "data-orientation": context.orientation,
          role: "tabpanel",
          "aria-labelledby": triggerId,
          hidden: !present,
          id: contentId,
          tabIndex: 0,
          ...contentProps,
          ref: forwardedRef,
          style: {
            ...props.style,
            animationDuration: isMountAnimationPreventedRef.current ? "0s" : void 0
          },
          children: present && children
        }
      ) });
    }
  );
  TabsContent$1.displayName = CONTENT_NAME$1;
  function makeTriggerId(baseId, value) {
    return `${baseId}-trigger-${value}`;
  }
  function makeContentId(baseId, value) {
    return `${baseId}-content-${value}`;
  }
  var Root2 = Tabs$1;
  var List = TabsList$1;
  var Trigger$1 = TabsTrigger$1;
  var Content = TabsContent$1;
  function Tabs({
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Root2,
      {
        "data-slot": "tabs",
        className: cn$1("flex flex-col gap-2", className),
        ...props
      }
    );
  }
  function TabsList({
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      List,
      {
        "data-slot": "tabs-list",
        className: cn$1(
          "bg-muted text-muted-foreground inline-flex h-9 w-fit items-center justify-center rounded-lg p-[3px]",
          className
        ),
        ...props
      }
    );
  }
  function TabsTrigger({
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Trigger$1,
      {
        "data-slot": "tabs-trigger",
        className: cn$1(
          "data-[state=active]:bg-background dark:data-[state=active]:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:outline-ring dark:data-[state=active]:border-input dark:data-[state=active]:bg-input/30 text-foreground dark:text-muted-foreground inline-flex h-[calc(100%-1px)] flex-1 items-center justify-center gap-1.5 rounded-md border border-transparent px-2 py-1 text-sm font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:ring-[3px] focus-visible:outline-1 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
          className
        ),
        ...props
      }
    );
  }
  function TabsContent({
    className,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Content,
      {
        forceMount: true,
        "data-slot": "tabs-content",
        className: cn$1(
          "data-[state=inactive]:hidden flex-1 outline-none",
          className
        ),
        ...props
      }
    );
  }
  var VISUALLY_HIDDEN_STYLES = Object.freeze({
position: "absolute",
    border: 0,
    width: 1,
    height: 1,
    padding: 0,
    margin: -1,
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    wordWrap: "normal"
  });
  var NAME = "VisuallyHidden";
  var VisuallyHidden = React__namespace.forwardRef(
    (props, forwardedRef) => {
      return jsxRuntimeExports.jsx(
        Primitive.span,
        {
          ...props,
          ref: forwardedRef,
          style: { ...VISUALLY_HIDDEN_STYLES, ...props.style }
        }
      );
    }
  );
  VisuallyHidden.displayName = NAME;
  var Root = VisuallyHidden;
  var [createTooltipContext] = createContextScope("Tooltip", [
    createPopperScope
  ]);
  var usePopperScope = createPopperScope();
  var PROVIDER_NAME = "TooltipProvider";
  var DEFAULT_DELAY_DURATION = 700;
  var TOOLTIP_OPEN = "tooltip.open";
  var [TooltipProviderContextProvider, useTooltipProviderContext] = createTooltipContext(PROVIDER_NAME);
  var TooltipProvider$1 = (props) => {
    const {
      __scopeTooltip,
      delayDuration = DEFAULT_DELAY_DURATION,
      skipDelayDuration = 300,
      disableHoverableContent = false,
      children
    } = props;
    const isOpenDelayedRef = React__namespace.useRef(true);
    const isPointerInTransitRef = React__namespace.useRef(false);
    const skipDelayTimerRef = React__namespace.useRef(0);
    React__namespace.useEffect(() => {
      const skipDelayTimer = skipDelayTimerRef.current;
      return () => window.clearTimeout(skipDelayTimer);
    }, []);
    return jsxRuntimeExports.jsx(
      TooltipProviderContextProvider,
      {
        scope: __scopeTooltip,
        isOpenDelayedRef,
        delayDuration,
        onOpen: React__namespace.useCallback(() => {
          window.clearTimeout(skipDelayTimerRef.current);
          isOpenDelayedRef.current = false;
        }, []),
        onClose: React__namespace.useCallback(() => {
          window.clearTimeout(skipDelayTimerRef.current);
          skipDelayTimerRef.current = window.setTimeout(
            () => isOpenDelayedRef.current = true,
            skipDelayDuration
          );
        }, [skipDelayDuration]),
        isPointerInTransitRef,
        onPointerInTransitChange: React__namespace.useCallback((inTransit) => {
          isPointerInTransitRef.current = inTransit;
        }, []),
        disableHoverableContent,
        children
      }
    );
  };
  TooltipProvider$1.displayName = PROVIDER_NAME;
  var TOOLTIP_NAME = "Tooltip";
  var [TooltipContextProvider, useTooltipContext] = createTooltipContext(TOOLTIP_NAME);
  var Tooltip$1 = (props) => {
    const {
      __scopeTooltip,
      children,
      open: openProp,
      defaultOpen,
      onOpenChange,
      disableHoverableContent: disableHoverableContentProp,
      delayDuration: delayDurationProp
    } = props;
    const providerContext = useTooltipProviderContext(TOOLTIP_NAME, props.__scopeTooltip);
    const popperScope = usePopperScope(__scopeTooltip);
    const [trigger, setTrigger] = React__namespace.useState(null);
    const contentId = useId();
    const openTimerRef = React__namespace.useRef(0);
    const disableHoverableContent = disableHoverableContentProp ?? providerContext.disableHoverableContent;
    const delayDuration = delayDurationProp ?? providerContext.delayDuration;
    const wasOpenDelayedRef = React__namespace.useRef(false);
    const [open, setOpen] = useControllableState({
      prop: openProp,
      defaultProp: defaultOpen ?? false,
      onChange: (open2) => {
        if (open2) {
          providerContext.onOpen();
          document.dispatchEvent(new CustomEvent(TOOLTIP_OPEN));
        } else {
          providerContext.onClose();
        }
        onOpenChange?.(open2);
      },
      caller: TOOLTIP_NAME
    });
    const stateAttribute = React__namespace.useMemo(() => {
      return open ? wasOpenDelayedRef.current ? "delayed-open" : "instant-open" : "closed";
    }, [open]);
    const handleOpen = React__namespace.useCallback(() => {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = 0;
      wasOpenDelayedRef.current = false;
      setOpen(true);
    }, [setOpen]);
    const handleClose = React__namespace.useCallback(() => {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = 0;
      setOpen(false);
    }, [setOpen]);
    const handleDelayedOpen = React__namespace.useCallback(() => {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = window.setTimeout(() => {
        wasOpenDelayedRef.current = true;
        setOpen(true);
        openTimerRef.current = 0;
      }, delayDuration);
    }, [delayDuration, setOpen]);
    React__namespace.useEffect(() => {
      return () => {
        if (openTimerRef.current) {
          window.clearTimeout(openTimerRef.current);
          openTimerRef.current = 0;
        }
      };
    }, []);
    return jsxRuntimeExports.jsx(Root2$3, { ...popperScope, children: jsxRuntimeExports.jsx(
      TooltipContextProvider,
      {
        scope: __scopeTooltip,
        contentId,
        open,
        stateAttribute,
        trigger,
        onTriggerChange: setTrigger,
        onTriggerEnter: React__namespace.useCallback(() => {
          if (providerContext.isOpenDelayedRef.current) handleDelayedOpen();
          else handleOpen();
        }, [providerContext.isOpenDelayedRef, handleDelayedOpen, handleOpen]),
        onTriggerLeave: React__namespace.useCallback(() => {
          if (disableHoverableContent) {
            handleClose();
          } else {
            window.clearTimeout(openTimerRef.current);
            openTimerRef.current = 0;
          }
        }, [handleClose, disableHoverableContent]),
        onOpen: handleOpen,
        onClose: handleClose,
        disableHoverableContent,
        children
      }
    ) });
  };
  Tooltip$1.displayName = TOOLTIP_NAME;
  var TRIGGER_NAME = "TooltipTrigger";
  var TooltipTrigger$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTooltip, ...triggerProps } = props;
      const context = useTooltipContext(TRIGGER_NAME, __scopeTooltip);
      const providerContext = useTooltipProviderContext(TRIGGER_NAME, __scopeTooltip);
      const popperScope = usePopperScope(__scopeTooltip);
      const ref = React__namespace.useRef(null);
      const composedRefs = useComposedRefs$1(forwardedRef, ref, context.onTriggerChange);
      const isPointerDownRef = React__namespace.useRef(false);
      const hasPointerMoveOpenedRef = React__namespace.useRef(false);
      const handlePointerUp = React__namespace.useCallback(() => isPointerDownRef.current = false, []);
      React__namespace.useEffect(() => {
        return () => document.removeEventListener("pointerup", handlePointerUp);
      }, [handlePointerUp]);
      return jsxRuntimeExports.jsx(Anchor, { asChild: true, ...popperScope, children: jsxRuntimeExports.jsx(
        Primitive.button,
        {
          "aria-describedby": context.open ? context.contentId : void 0,
          "data-state": context.stateAttribute,
          ...triggerProps,
          ref: composedRefs,
          onPointerMove: composeEventHandlers(props.onPointerMove, (event) => {
            if (event.pointerType === "touch") return;
            if (!hasPointerMoveOpenedRef.current && !providerContext.isPointerInTransitRef.current) {
              context.onTriggerEnter();
              hasPointerMoveOpenedRef.current = true;
            }
          }),
          onPointerLeave: composeEventHandlers(props.onPointerLeave, () => {
            context.onTriggerLeave();
            hasPointerMoveOpenedRef.current = false;
          }),
          onPointerDown: composeEventHandlers(props.onPointerDown, () => {
            if (context.open) {
              context.onClose();
            }
            isPointerDownRef.current = true;
            document.addEventListener("pointerup", handlePointerUp, { once: true });
          }),
          onFocus: composeEventHandlers(props.onFocus, () => {
            if (!isPointerDownRef.current) context.onOpen();
          }),
          onBlur: composeEventHandlers(props.onBlur, context.onClose),
          onClick: composeEventHandlers(props.onClick, context.onClose)
        }
      ) });
    }
  );
  TooltipTrigger$1.displayName = TRIGGER_NAME;
  var PORTAL_NAME = "TooltipPortal";
  var [PortalProvider, usePortalContext] = createTooltipContext(PORTAL_NAME, {
    forceMount: void 0
  });
  var TooltipPortal = (props) => {
    const { __scopeTooltip, forceMount, children, container } = props;
    const context = useTooltipContext(PORTAL_NAME, __scopeTooltip);
    return jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeTooltip, forceMount, children: jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: jsxRuntimeExports.jsx(Portal$4, { asChild: true, container, children }) }) });
  };
  TooltipPortal.displayName = PORTAL_NAME;
  var CONTENT_NAME = "TooltipContent";
  var TooltipContent$1 = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const portalContext = usePortalContext(CONTENT_NAME, props.__scopeTooltip);
      const { forceMount = portalContext.forceMount, side = "top", ...contentProps } = props;
      const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
      return jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.disableHoverableContent ? jsxRuntimeExports.jsx(TooltipContentImpl, { side, ...contentProps, ref: forwardedRef }) : jsxRuntimeExports.jsx(TooltipContentHoverable, { side, ...contentProps, ref: forwardedRef }) });
    }
  );
  var TooltipContentHoverable = React__namespace.forwardRef((props, forwardedRef) => {
    const context = useTooltipContext(CONTENT_NAME, props.__scopeTooltip);
    const providerContext = useTooltipProviderContext(CONTENT_NAME, props.__scopeTooltip);
    const ref = React__namespace.useRef(null);
    const composedRefs = useComposedRefs$1(forwardedRef, ref);
    const [pointerGraceArea, setPointerGraceArea] = React__namespace.useState(null);
    const { trigger, onClose } = context;
    const content = ref.current;
    const { onPointerInTransitChange } = providerContext;
    const handleRemoveGraceArea = React__namespace.useCallback(() => {
      setPointerGraceArea(null);
      onPointerInTransitChange(false);
    }, [onPointerInTransitChange]);
    const handleCreateGraceArea = React__namespace.useCallback(
      (event, hoverTarget) => {
        const currentTarget = event.currentTarget;
        const exitPoint = { x: event.clientX, y: event.clientY };
        const exitSide = getExitSideFromRect(exitPoint, currentTarget.getBoundingClientRect());
        const paddedExitPoints = getPaddedExitPoints(exitPoint, exitSide);
        const hoverTargetPoints = getPointsFromRect(hoverTarget.getBoundingClientRect());
        const graceArea = getHull([...paddedExitPoints, ...hoverTargetPoints]);
        setPointerGraceArea(graceArea);
        onPointerInTransitChange(true);
      },
      [onPointerInTransitChange]
    );
    React__namespace.useEffect(() => {
      return () => handleRemoveGraceArea();
    }, [handleRemoveGraceArea]);
    React__namespace.useEffect(() => {
      if (trigger && content) {
        const handleTriggerLeave = (event) => handleCreateGraceArea(event, content);
        const handleContentLeave = (event) => handleCreateGraceArea(event, trigger);
        trigger.addEventListener("pointerleave", handleTriggerLeave);
        content.addEventListener("pointerleave", handleContentLeave);
        return () => {
          trigger.removeEventListener("pointerleave", handleTriggerLeave);
          content.removeEventListener("pointerleave", handleContentLeave);
        };
      }
    }, [trigger, content, handleCreateGraceArea, handleRemoveGraceArea]);
    React__namespace.useEffect(() => {
      if (pointerGraceArea) {
        const handleTrackPointerGrace = (event) => {
          const target = event.target;
          const pointerPosition = { x: event.clientX, y: event.clientY };
          const hasEnteredTarget = trigger?.contains(target) || content?.contains(target);
          const isPointerOutsideGraceArea = !isPointInPolygon(pointerPosition, pointerGraceArea);
          if (hasEnteredTarget) {
            handleRemoveGraceArea();
          } else if (isPointerOutsideGraceArea) {
            handleRemoveGraceArea();
            onClose();
          }
        };
        document.addEventListener("pointermove", handleTrackPointerGrace);
        return () => document.removeEventListener("pointermove", handleTrackPointerGrace);
      }
    }, [trigger, content, pointerGraceArea, onClose, handleRemoveGraceArea]);
    return jsxRuntimeExports.jsx(TooltipContentImpl, { ...props, ref: composedRefs });
  });
  var [VisuallyHiddenContentContextProvider, useVisuallyHiddenContentContext] = createTooltipContext(TOOLTIP_NAME, { isInside: false });
  var Slottable = createSlottable("TooltipContent");
  var TooltipContentImpl = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const {
        __scopeTooltip,
        children,
        "aria-label": ariaLabel,
        onEscapeKeyDown,
        onPointerDownOutside,
        ...contentProps
      } = props;
      const context = useTooltipContext(CONTENT_NAME, __scopeTooltip);
      const popperScope = usePopperScope(__scopeTooltip);
      const { onClose } = context;
      React__namespace.useEffect(() => {
        document.addEventListener(TOOLTIP_OPEN, onClose);
        return () => document.removeEventListener(TOOLTIP_OPEN, onClose);
      }, [onClose]);
      React__namespace.useEffect(() => {
        if (context.trigger) {
          const handleScroll2 = (event) => {
            const target = event.target;
            if (target?.contains(context.trigger)) onClose();
          };
          window.addEventListener("scroll", handleScroll2, { capture: true });
          return () => window.removeEventListener("scroll", handleScroll2, { capture: true });
        }
      }, [context.trigger, onClose]);
      return jsxRuntimeExports.jsx(
        DismissableLayer,
        {
          asChild: true,
          disableOutsidePointerEvents: false,
          onEscapeKeyDown,
          onPointerDownOutside,
          onFocusOutside: (event) => event.preventDefault(),
          onDismiss: onClose,
          children: jsxRuntimeExports.jsxs(
            Content$2,
            {
              "data-state": context.stateAttribute,
              ...popperScope,
              ...contentProps,
              ref: forwardedRef,
              style: {
                ...contentProps.style,
...{
                  "--radix-tooltip-content-transform-origin": "var(--radix-popper-transform-origin)",
                  "--radix-tooltip-content-available-width": "var(--radix-popper-available-width)",
                  "--radix-tooltip-content-available-height": "var(--radix-popper-available-height)",
                  "--radix-tooltip-trigger-width": "var(--radix-popper-anchor-width)",
                  "--radix-tooltip-trigger-height": "var(--radix-popper-anchor-height)"
                }
              },
              children: [
jsxRuntimeExports.jsx(Slottable, { children }),
jsxRuntimeExports.jsx(VisuallyHiddenContentContextProvider, { scope: __scopeTooltip, isInside: true, children: jsxRuntimeExports.jsx(Root, { id: context.contentId, role: "tooltip", children: ariaLabel || children }) })
              ]
            }
          )
        }
      );
    }
  );
  TooltipContent$1.displayName = CONTENT_NAME;
  var ARROW_NAME = "TooltipArrow";
  var TooltipArrow = React__namespace.forwardRef(
    (props, forwardedRef) => {
      const { __scopeTooltip, ...arrowProps } = props;
      const popperScope = usePopperScope(__scopeTooltip);
      const visuallyHiddenContentContext = useVisuallyHiddenContentContext(
        ARROW_NAME,
        __scopeTooltip
      );
      return visuallyHiddenContentContext.isInside ? null : jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
    }
  );
  TooltipArrow.displayName = ARROW_NAME;
  function getExitSideFromRect(point, rect) {
    const top = Math.abs(rect.top - point.y);
    const bottom = Math.abs(rect.bottom - point.y);
    const right = Math.abs(rect.right - point.x);
    const left = Math.abs(rect.left - point.x);
    switch (Math.min(top, bottom, right, left)) {
      case left:
        return "left";
      case right:
        return "right";
      case top:
        return "top";
      case bottom:
        return "bottom";
      default:
        throw new Error("unreachable");
    }
  }
  function getPaddedExitPoints(exitPoint, exitSide, padding = 5) {
    const paddedExitPoints = [];
    switch (exitSide) {
      case "top":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y + padding },
          { x: exitPoint.x + padding, y: exitPoint.y + padding }
        );
        break;
      case "bottom":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y - padding },
          { x: exitPoint.x + padding, y: exitPoint.y - padding }
        );
        break;
      case "left":
        paddedExitPoints.push(
          { x: exitPoint.x + padding, y: exitPoint.y - padding },
          { x: exitPoint.x + padding, y: exitPoint.y + padding }
        );
        break;
      case "right":
        paddedExitPoints.push(
          { x: exitPoint.x - padding, y: exitPoint.y - padding },
          { x: exitPoint.x - padding, y: exitPoint.y + padding }
        );
        break;
    }
    return paddedExitPoints;
  }
  function getPointsFromRect(rect) {
    const { top, right, bottom, left } = rect;
    return [
      { x: left, y: top },
      { x: right, y: top },
      { x: right, y: bottom },
      { x: left, y: bottom }
    ];
  }
  function isPointInPolygon(point, polygon) {
    const { x: x2, y } = point;
    let inside = false;
    for (let i2 = 0, j = polygon.length - 1; i2 < polygon.length; j = i2++) {
      const ii = polygon[i2];
      const jj = polygon[j];
      const xi = ii.x;
      const yi = ii.y;
      const xj = jj.x;
      const yj = jj.y;
      const intersect = yi > y !== yj > y && x2 < (xj - xi) * (y - yi) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }
    return inside;
  }
  function getHull(points) {
    const newPoints = points.slice();
    newPoints.sort((a2, b) => {
      if (a2.x < b.x) return -1;
      else if (a2.x > b.x) return 1;
      else if (a2.y < b.y) return -1;
      else if (a2.y > b.y) return 1;
      else return 0;
    });
    return getHullPresorted(newPoints);
  }
  function getHullPresorted(points) {
    if (points.length <= 1) return points.slice();
    const upperHull = [];
    for (let i2 = 0; i2 < points.length; i2++) {
      const p = points[i2];
      while (upperHull.length >= 2) {
        const q = upperHull[upperHull.length - 1];
        const r2 = upperHull[upperHull.length - 2];
        if ((q.x - r2.x) * (p.y - r2.y) >= (q.y - r2.y) * (p.x - r2.x)) upperHull.pop();
        else break;
      }
      upperHull.push(p);
    }
    upperHull.pop();
    const lowerHull = [];
    for (let i2 = points.length - 1; i2 >= 0; i2--) {
      const p = points[i2];
      while (lowerHull.length >= 2) {
        const q = lowerHull[lowerHull.length - 1];
        const r2 = lowerHull[lowerHull.length - 2];
        if ((q.x - r2.x) * (p.y - r2.y) >= (q.y - r2.y) * (p.x - r2.x)) lowerHull.pop();
        else break;
      }
      lowerHull.push(p);
    }
    lowerHull.pop();
    if (upperHull.length === 1 && lowerHull.length === 1 && upperHull[0].x === lowerHull[0].x && upperHull[0].y === lowerHull[0].y) {
      return upperHull;
    } else {
      return upperHull.concat(lowerHull);
    }
  }
  var Provider = TooltipProvider$1;
  var Root3 = Tooltip$1;
  var Trigger = TooltipTrigger$1;
  var Portal = TooltipPortal;
  var Content2 = TooltipContent$1;
  var Arrow2 = TooltipArrow;
  function TooltipProvider({
    delayDuration = 0,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      Provider,
      {
        "data-slot": "tooltip-provider",
        delayDuration,
        ...props
      }
    );
  }
  function Tooltip({
    ...props
  }) {
    return jsxRuntimeExports.jsx(TooltipProvider, { children: jsxRuntimeExports.jsx(Root3, { "data-slot": "tooltip", ...props }) });
  }
  function TooltipTrigger({
    ...props
  }) {
    return jsxRuntimeExports.jsx(Trigger, { "data-slot": "tooltip-trigger", ...props });
  }
  function TooltipContent({
    className,
    sideOffset = 0,
    children,
    ...props
  }) {
    return jsxRuntimeExports.jsx(Portal, { children: jsxRuntimeExports.jsxs(
      Content2,
      {
        "data-slot": "tooltip-content",
        sideOffset,
        className: cn$1(
          "bg-foreground text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-md px-3 py-1.5 text-xs text-balance",
          className
        ),
        ...props,
        children: [
          children,
jsxRuntimeExports.jsx(Arrow2, { className: "bg-foreground fill-foreground z-50 size-2.5 translate-y-[calc(-50%_-_2px)] rotate-45 rounded-[2px]" })
        ]
      }
    ) });
  }
  function BannedToolkit() {
    return jsxRuntimeExports.jsx(Tooltip, { children: jsxRuntimeExports.jsxs(Popover, { children: [
jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: jsxRuntimeExports.jsx(lucideReact.Captions, { className: "ml-auto size-6 hover:text-primary" }) }) }),
jsxRuntimeExports.jsx(TooltipContent, { children: "屏蔽设置" }),
jsxRuntimeExports.jsx(
        PopoverContent,
        {
          align: "end",
          side: "top",
          className: "w-88 p-0 h-80 overflow-hidden",
          children: jsxRuntimeExports.jsx(BannedTabs, {})
        }
      )
    ] }) });
  }
  function BannedTabs() {
    return jsxRuntimeExports.jsxs(Tabs, { className: "h-full", children: [
jsxRuntimeExports.jsxs(TabsList, { className: "mt-2 ml-2", children: [
jsxRuntimeExports.jsx(TabsTrigger, { value: "bannedWords", children: "屏蔽词" }),
jsxRuntimeExports.jsx(TabsTrigger, { value: "bannedUsers", children: "屏蔽用户" })
      ] }),
jsxRuntimeExports.jsx(TabsContent, { value: "bannedWords", className: "flex-1 overflow-hidden", children: jsxRuntimeExports.jsx(BannedWords, {}) }),
jsxRuntimeExports.jsx(TabsContent, { value: "bannedUsers", className: "flex-1 overflow-hidden", children: jsxRuntimeExports.jsx(BannedUsers, {}) })
    ] });
  }
  function BannedWords() {
    const [bannedWord, setBannedWord] = React.useState("");
    const [bannedWords, dispatch] = jotai.useAtom(bannedWordsAtom);
    const handleSubmit = (e) => {
      e.preventDefault();
      if (bannedWord) {
        dispatch({
          type: "add",
          word: bannedWord
        });
        setBannedWord("");
      }
    };
    const handleChange = (e) => {
      setBannedWord(e.target.value);
    };
    const handleClear = () => {
      dispatch({ type: "clear" });
    };
    const handleRemove = (word) => {
      dispatch({ type: "remove", word });
    };
    return jsxRuntimeExports.jsxs("div", { className: "flex flex-col gap-2 h-full overflow-hidden py-2", children: [
jsxRuntimeExports.jsxs("form", { className: "px-2 flex gap-2", onSubmit: handleSubmit, children: [
jsxRuntimeExports.jsx(
          Input,
          {
            name: "bannedWord",
            placeholder: "输入屏蔽词",
            value: bannedWord,
            onChange: handleChange
          }
        ),
jsxRuntimeExports.jsx(Button, { type: "submit", variant: "outline", children: "添加" })
      ] }),
      bannedWords.length > 0 ? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(ScrollArea, { className: "flex-1 px-3 min-h-0", children: jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: bannedWords.map((w, i2) => jsxRuntimeExports.jsxs(
          "div",
          {
            className: "p-1 flex items-center justify-between hover:bg-secondary rounded-sm gap-1",
            children: [
jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
                i2 + 1,
                "."
              ] }),
jsxRuntimeExports.jsx("span", { className: "text-sm truncate flex-1", children: w }),
jsxRuntimeExports.jsx(
                lucideReact.Trash2,
                {
                  className: "size-4 cursor-pointer hover:text-primary shrink-0 ml-6",
                  onClick: () => handleRemove(w)
                }
              )
            ]
          },
          w
        )) }) }),
jsxRuntimeExports.jsx("div", { className: "text-center", children: jsxRuntimeExports.jsx(
          Button,
          {
            variant: "outline",
            className: "text",
            size: "sm",
            onClick: handleClear,
            children: "清空屏蔽词"
          }
        ) })
      ] }) : jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground flex-1 flex justify-center items-center", children: "--- 暂未添加屏蔽词 ---" })
    ] });
  }
  function BannedUsers() {
    const [bannedUsers, dispatch] = jotai.useAtom(bannedUsersAtom);
    const handleClear = () => {
      dispatch({ type: "clear" });
    };
    return jsxRuntimeExports.jsx("div", { className: "h-full flex flex-col overflow-hidden py-2 gap-2", children: bannedUsers.length > 0 ? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(ScrollArea, { className: "min-h-0 px-3", children: jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1", children: bannedUsers.map((u, i2) => jsxRuntimeExports.jsx(BannedUserItem, { user: u, index: i2 }, u.id)) }) }),
jsxRuntimeExports.jsx("div", { className: "text-center", children: jsxRuntimeExports.jsx(
        Button,
        {
          variant: "outline",
          className: "text",
          size: "sm",
          onClick: handleClear,
          children: "清空屏蔽用户"
        }
      ) })
    ] }) : jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground flex-1 flex justify-center items-center", children: "--- 暂未屏蔽用户 ---" }) });
  }
  function BannedUserItem({ user, index: index2 }) {
    const { id: id2, username } = user;
    const dispatch = jotai.useSetAtom(bannedUsersAtom);
    const userLabel = jotai.useAtomValue(userLabelByIdAtom(id2));
    const handleRemove = () => {
      dispatch({ type: "remove", id: id2 });
    };
    return jsxRuntimeExports.jsxs("div", { className: "p-1 flex items-center justify-between hover:bg-secondary rounded-sm gap-1", children: [
jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
        index2 + 1,
        "."
      ] }),
jsxRuntimeExports.jsxs("span", { className: "text-sm truncate flex-1", children: [
        userLabel?.label || username,
        userLabel?.label ? `（${username}）` : ""
      ] }),
jsxRuntimeExports.jsx(
        lucideReact.Trash2,
        {
          className: "size-4 cursor-pointer hover:text-primary shrink-0 ml-6",
          onClick: handleRemove
        }
      )
    ] });
  }
  function Empty({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "empty",
        className: cn$1(
          "flex min-w-0 flex-1 flex-col items-center justify-center gap-6 rounded-lg border-dashed p-6 text-center text-balance md:p-12",
          className
        ),
        ...props
      }
    );
  }
  function EmptyHeader({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "empty-header",
        className: cn$1(
          "flex max-w-sm flex-col items-center gap-2 text-center",
          className
        ),
        ...props
      }
    );
  }
  const emptyMediaVariants = cva(
    "flex shrink-0 items-center justify-center mb-2 [&_svg]:pointer-events-none [&_svg]:shrink-0",
    {
      variants: {
        variant: {
          default: "bg-transparent",
          icon: "bg-muted text-foreground flex size-10 shrink-0 items-center justify-center rounded-lg [&_svg:not([class*='size-'])]:size-6"
        }
      },
      defaultVariants: {
        variant: "default"
      }
    }
  );
  function EmptyMedia({
    className,
    variant = "default",
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "empty-icon",
        "data-variant": variant,
        className: cn$1(emptyMediaVariants({ variant, className })),
        ...props
      }
    );
  }
  function EmptyTitle({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "empty-title",
        className: cn$1("text-lg font-medium tracking-tight", className),
        ...props
      }
    );
  }
  function EmptyDescription({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "empty-description",
        className: cn$1(
          "text-muted-foreground [&>a:hover]:text-primary text-sm/relaxed [&>a]:underline [&>a]:underline-offset-4",
          className
        ),
        ...props
      }
    );
  }
  const commentAtom = jotai.atom("");
  function __insertCSS(code) {
    if (typeof document == "undefined") return;
    let head = document.head || document.getElementsByTagName("head")[0];
    let style2 = document.createElement("style");
    style2.type = "text/css";
    head.appendChild(style2);
    style2.styleSheet ? style2.styleSheet.cssText = code : style2.appendChild(document.createTextNode(code));
  }
  const getAsset = (type) => {
    switch (type) {
      case "success":
        return SuccessIcon;
      case "info":
        return InfoIcon;
      case "warning":
        return WarningIcon;
      case "error":
        return ErrorIcon;
      default:
        return null;
    }
  };
  const bars = Array(12).fill(0);
  const Loader = ({ visible, className }) => {
    return React.createElement("div", {
      className: [
        "sonner-loading-wrapper",
        className
      ].filter(Boolean).join(" "),
      "data-visible": visible
    }, React.createElement("div", {
      className: "sonner-spinner"
    }, bars.map((_, i2) => React.createElement("div", {
      className: "sonner-loading-bar",
      key: `spinner-bar-${i2}`
    }))));
  };
  const SuccessIcon = React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20"
  }, React.createElement("path", {
    fillRule: "evenodd",
    d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z",
    clipRule: "evenodd"
  }));
  const WarningIcon = React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "currentColor",
    height: "20",
    width: "20"
  }, React.createElement("path", {
    fillRule: "evenodd",
    d: "M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z",
    clipRule: "evenodd"
  }));
  const InfoIcon = React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20"
  }, React.createElement("path", {
    fillRule: "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z",
    clipRule: "evenodd"
  }));
  const ErrorIcon = React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 20 20",
    fill: "currentColor",
    height: "20",
    width: "20"
  }, React.createElement("path", {
    fillRule: "evenodd",
    d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z",
    clipRule: "evenodd"
  }));
  const CloseIcon = React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "12",
    height: "12",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
  const useIsDocumentHidden = () => {
    const [isDocumentHidden, setIsDocumentHidden] = React.useState(document.hidden);
    React.useEffect(() => {
      const callback = () => {
        setIsDocumentHidden(document.hidden);
      };
      document.addEventListener("visibilitychange", callback);
      return () => window.removeEventListener("visibilitychange", callback);
    }, []);
    return isDocumentHidden;
  };
  let toastsCounter = 1;
  class Observer {
    constructor() {
      this.subscribe = (subscriber) => {
        this.subscribers.push(subscriber);
        return () => {
          const index2 = this.subscribers.indexOf(subscriber);
          this.subscribers.splice(index2, 1);
        };
      };
      this.publish = (data) => {
        this.subscribers.forEach((subscriber) => subscriber(data));
      };
      this.addToast = (data) => {
        this.publish(data);
        this.toasts = [
          ...this.toasts,
          data
        ];
      };
      this.create = (data) => {
        var _data_id;
        const { message, ...rest } = data;
        const id2 = typeof (data == null ? void 0 : data.id) === "number" || ((_data_id = data.id) == null ? void 0 : _data_id.length) > 0 ? data.id : toastsCounter++;
        const alreadyExists = this.toasts.find((toast2) => {
          return toast2.id === id2;
        });
        const dismissible = data.dismissible === void 0 ? true : data.dismissible;
        if (this.dismissedToasts.has(id2)) {
          this.dismissedToasts.delete(id2);
        }
        if (alreadyExists) {
          this.toasts = this.toasts.map((toast2) => {
            if (toast2.id === id2) {
              this.publish({
                ...toast2,
                ...data,
                id: id2,
                title: message
              });
              return {
                ...toast2,
                ...data,
                id: id2,
                dismissible,
                title: message
              };
            }
            return toast2;
          });
        } else {
          this.addToast({
            title: message,
            ...rest,
            dismissible,
            id: id2
          });
        }
        return id2;
      };
      this.dismiss = (id2) => {
        if (id2) {
          this.dismissedToasts.add(id2);
          requestAnimationFrame(() => this.subscribers.forEach((subscriber) => subscriber({
            id: id2,
            dismiss: true
          })));
        } else {
          this.toasts.forEach((toast2) => {
            this.subscribers.forEach((subscriber) => subscriber({
              id: toast2.id,
              dismiss: true
            }));
          });
        }
        return id2;
      };
      this.message = (message, data) => {
        return this.create({
          ...data,
          message
        });
      };
      this.error = (message, data) => {
        return this.create({
          ...data,
          message,
          type: "error"
        });
      };
      this.success = (message, data) => {
        return this.create({
          ...data,
          type: "success",
          message
        });
      };
      this.info = (message, data) => {
        return this.create({
          ...data,
          type: "info",
          message
        });
      };
      this.warning = (message, data) => {
        return this.create({
          ...data,
          type: "warning",
          message
        });
      };
      this.loading = (message, data) => {
        return this.create({
          ...data,
          type: "loading",
          message
        });
      };
      this.promise = (promise, data) => {
        if (!data) {
          return;
        }
        let id2 = void 0;
        if (data.loading !== void 0) {
          id2 = this.create({
            ...data,
            promise,
            type: "loading",
            message: data.loading,
            description: typeof data.description !== "function" ? data.description : void 0
          });
        }
        const p = Promise.resolve(promise instanceof Function ? promise() : promise);
        let shouldDismiss = id2 !== void 0;
        let result;
        const originalPromise = p.then(async (response) => {
          result = [
            "resolve",
            response
          ];
          const isReactElementResponse = React.isValidElement(response);
          if (isReactElementResponse) {
            shouldDismiss = false;
            this.create({
              id: id2,
              type: "default",
              message: response
            });
          } else if (isHttpResponse(response) && !response.ok) {
            shouldDismiss = false;
            const promiseData = typeof data.error === "function" ? await data.error(`HTTP error! status: ${response.status}`) : data.error;
            const description = typeof data.description === "function" ? await data.description(`HTTP error! status: ${response.status}`) : data.description;
            const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult ? promiseData : {
              message: promiseData
            };
            this.create({
              id: id2,
              type: "error",
              description,
              ...toastSettings
            });
          } else if (response instanceof Error) {
            shouldDismiss = false;
            const promiseData = typeof data.error === "function" ? await data.error(response) : data.error;
            const description = typeof data.description === "function" ? await data.description(response) : data.description;
            const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult ? promiseData : {
              message: promiseData
            };
            this.create({
              id: id2,
              type: "error",
              description,
              ...toastSettings
            });
          } else if (data.success !== void 0) {
            shouldDismiss = false;
            const promiseData = typeof data.success === "function" ? await data.success(response) : data.success;
            const description = typeof data.description === "function" ? await data.description(response) : data.description;
            const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult ? promiseData : {
              message: promiseData
            };
            this.create({
              id: id2,
              type: "success",
              description,
              ...toastSettings
            });
          }
        }).catch(async (error2) => {
          result = [
            "reject",
            error2
          ];
          if (data.error !== void 0) {
            shouldDismiss = false;
            const promiseData = typeof data.error === "function" ? await data.error(error2) : data.error;
            const description = typeof data.description === "function" ? await data.description(error2) : data.description;
            const isExtendedResult = typeof promiseData === "object" && !React.isValidElement(promiseData);
            const toastSettings = isExtendedResult ? promiseData : {
              message: promiseData
            };
            this.create({
              id: id2,
              type: "error",
              description,
              ...toastSettings
            });
          }
        }).finally(() => {
          if (shouldDismiss) {
            this.dismiss(id2);
            id2 = void 0;
          }
          data.finally == null ? void 0 : data.finally.call(data);
        });
        const unwrap = () => new Promise((resolve, reject) => originalPromise.then(() => result[0] === "reject" ? reject(result[1]) : resolve(result[1])).catch(reject));
        if (typeof id2 !== "string" && typeof id2 !== "number") {
          return {
            unwrap
          };
        } else {
          return Object.assign(id2, {
            unwrap
          });
        }
      };
      this.custom = (jsx, data) => {
        const id2 = (data == null ? void 0 : data.id) || toastsCounter++;
        this.create({
          jsx: jsx(id2),
          id: id2,
          ...data
        });
        return id2;
      };
      this.getActiveToasts = () => {
        return this.toasts.filter((toast2) => !this.dismissedToasts.has(toast2.id));
      };
      this.subscribers = [];
      this.toasts = [];
      this.dismissedToasts = new Set();
    }
  }
  const ToastState = new Observer();
  const toastFunction = (message, data) => {
    const id2 = (data == null ? void 0 : data.id) || toastsCounter++;
    ToastState.addToast({
      title: message,
      ...data,
      id: id2
    });
    return id2;
  };
  const isHttpResponse = (data) => {
    return data && typeof data === "object" && "ok" in data && typeof data.ok === "boolean" && "status" in data && typeof data.status === "number";
  };
  const basicToast = toastFunction;
  const getHistory = () => ToastState.toasts;
  const getToasts = () => ToastState.getActiveToasts();
  const toast = Object.assign(basicToast, {
    success: ToastState.success,
    info: ToastState.info,
    warning: ToastState.warning,
    error: ToastState.error,
    custom: ToastState.custom,
    message: ToastState.message,
    promise: ToastState.promise,
    dismiss: ToastState.dismiss,
    loading: ToastState.loading
  }, {
    getHistory,
    getToasts
  });
  __insertCSS("[data-sonner-toaster][dir=ltr],html[dir=ltr]{--toast-icon-margin-start:-3px;--toast-icon-margin-end:4px;--toast-svg-margin-start:-1px;--toast-svg-margin-end:0px;--toast-button-margin-start:auto;--toast-button-margin-end:0;--toast-close-button-start:0;--toast-close-button-end:unset;--toast-close-button-transform:translate(-35%, -35%)}[data-sonner-toaster][dir=rtl],html[dir=rtl]{--toast-icon-margin-start:4px;--toast-icon-margin-end:-3px;--toast-svg-margin-start:0px;--toast-svg-margin-end:-1px;--toast-button-margin-start:0;--toast-button-margin-end:auto;--toast-close-button-start:unset;--toast-close-button-end:0;--toast-close-button-transform:translate(35%, -35%)}[data-sonner-toaster]{position:fixed;width:var(--width);font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;--gray1:hsl(0, 0%, 99%);--gray2:hsl(0, 0%, 97.3%);--gray3:hsl(0, 0%, 95.1%);--gray4:hsl(0, 0%, 93%);--gray5:hsl(0, 0%, 90.9%);--gray6:hsl(0, 0%, 88.7%);--gray7:hsl(0, 0%, 85.8%);--gray8:hsl(0, 0%, 78%);--gray9:hsl(0, 0%, 56.1%);--gray10:hsl(0, 0%, 52.3%);--gray11:hsl(0, 0%, 43.5%);--gray12:hsl(0, 0%, 9%);--border-radius:8px;box-sizing:border-box;padding:0;margin:0;list-style:none;outline:0;z-index:999999999;transition:transform .4s ease}@media (hover:none) and (pointer:coarse){[data-sonner-toaster][data-lifted=true]{transform:none}}[data-sonner-toaster][data-x-position=right]{right:var(--offset-right)}[data-sonner-toaster][data-x-position=left]{left:var(--offset-left)}[data-sonner-toaster][data-x-position=center]{left:50%;transform:translateX(-50%)}[data-sonner-toaster][data-y-position=top]{top:var(--offset-top)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--offset-bottom)}[data-sonner-toast]{--y:translateY(100%);--lift-amount:calc(var(--lift) * var(--gap));z-index:var(--z-index);position:absolute;opacity:0;transform:var(--y);touch-action:none;transition:transform .4s,opacity .4s,height .4s,box-shadow .2s;box-sizing:border-box;outline:0;overflow-wrap:anywhere}[data-sonner-toast][data-styled=true]{padding:16px;background:var(--normal-bg);border:1px solid var(--normal-border);color:var(--normal-text);border-radius:var(--border-radius);box-shadow:0 4px 12px rgba(0,0,0,.1);width:var(--width);font-size:13px;display:flex;align-items:center;gap:6px}[data-sonner-toast]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-y-position=top]{top:0;--y:translateY(-100%);--lift:1;--lift-amount:calc(1 * var(--gap))}[data-sonner-toast][data-y-position=bottom]{bottom:0;--y:translateY(100%);--lift:-1;--lift-amount:calc(var(--lift) * var(--gap))}[data-sonner-toast][data-styled=true] [data-description]{font-weight:400;line-height:1.4;color:#3f3f3f}[data-rich-colors=true][data-sonner-toast][data-styled=true] [data-description]{color:inherit}[data-sonner-toaster][data-sonner-theme=dark] [data-description]{color:#e8e8e8}[data-sonner-toast][data-styled=true] [data-title]{font-weight:500;line-height:1.5;color:inherit}[data-sonner-toast][data-styled=true] [data-icon]{display:flex;height:16px;width:16px;position:relative;justify-content:flex-start;align-items:center;flex-shrink:0;margin-left:var(--toast-icon-margin-start);margin-right:var(--toast-icon-margin-end)}[data-sonner-toast][data-promise=true] [data-icon]>svg{opacity:0;transform:scale(.8);transform-origin:center;animation:sonner-fade-in .3s ease forwards}[data-sonner-toast][data-styled=true] [data-icon]>*{flex-shrink:0}[data-sonner-toast][data-styled=true] [data-icon] svg{margin-left:var(--toast-svg-margin-start);margin-right:var(--toast-svg-margin-end)}[data-sonner-toast][data-styled=true] [data-content]{display:flex;flex-direction:column;gap:2px}[data-sonner-toast][data-styled=true] [data-button]{border-radius:4px;padding-left:8px;padding-right:8px;height:24px;font-size:12px;color:var(--normal-bg);background:var(--normal-text);margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end);border:none;font-weight:500;cursor:pointer;outline:0;display:flex;align-items:center;flex-shrink:0;transition:opacity .4s,box-shadow .2s}[data-sonner-toast][data-styled=true] [data-button]:focus-visible{box-shadow:0 0 0 2px rgba(0,0,0,.4)}[data-sonner-toast][data-styled=true] [data-button]:first-of-type{margin-left:var(--toast-button-margin-start);margin-right:var(--toast-button-margin-end)}[data-sonner-toast][data-styled=true] [data-cancel]{color:var(--normal-text);background:rgba(0,0,0,.08)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-styled=true] [data-cancel]{background:rgba(255,255,255,.3)}[data-sonner-toast][data-styled=true] [data-close-button]{position:absolute;left:var(--toast-close-button-start);right:var(--toast-close-button-end);top:0;height:20px;width:20px;display:flex;justify-content:center;align-items:center;padding:0;color:var(--gray12);background:var(--normal-bg);border:1px solid var(--gray4);transform:var(--toast-close-button-transform);border-radius:50%;cursor:pointer;z-index:1;transition:opacity .1s,background .2s,border-color .2s}[data-sonner-toast][data-styled=true] [data-close-button]:focus-visible{box-shadow:0 4px 12px rgba(0,0,0,.1),0 0 0 2px rgba(0,0,0,.2)}[data-sonner-toast][data-styled=true] [data-disabled=true]{cursor:not-allowed}[data-sonner-toast][data-styled=true]:hover [data-close-button]:hover{background:var(--gray2);border-color:var(--gray5)}[data-sonner-toast][data-swiping=true]::before{content:'';position:absolute;left:-100%;right:-100%;height:100%;z-index:-1}[data-sonner-toast][data-y-position=top][data-swiping=true]::before{bottom:50%;transform:scaleY(3) translateY(50%)}[data-sonner-toast][data-y-position=bottom][data-swiping=true]::before{top:50%;transform:scaleY(3) translateY(-50%)}[data-sonner-toast][data-swiping=false][data-removed=true]::before{content:'';position:absolute;inset:0;transform:scaleY(2)}[data-sonner-toast][data-expanded=true]::after{content:'';position:absolute;left:0;height:calc(var(--gap) + 1px);bottom:100%;width:100%}[data-sonner-toast][data-mounted=true]{--y:translateY(0);opacity:1}[data-sonner-toast][data-expanded=false][data-front=false]{--scale:var(--toasts-before) * 0.05 + 1;--y:translateY(calc(var(--lift-amount) * var(--toasts-before))) scale(calc(-1 * var(--scale)));height:var(--front-toast-height)}[data-sonner-toast]>*{transition:opacity .4s}[data-sonner-toast][data-x-position=right]{right:0}[data-sonner-toast][data-x-position=left]{left:0}[data-sonner-toast][data-expanded=false][data-front=false][data-styled=true]>*{opacity:0}[data-sonner-toast][data-visible=false]{opacity:0;pointer-events:none}[data-sonner-toast][data-mounted=true][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset)));height:var(--initial-height)}[data-sonner-toast][data-removed=true][data-front=true][data-swipe-out=false]{--y:translateY(calc(var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=true]{--y:translateY(calc(var(--lift) * var(--offset) + var(--lift) * -100%));opacity:0}[data-sonner-toast][data-removed=true][data-front=false][data-swipe-out=false][data-expanded=false]{--y:translateY(40%);opacity:0;transition:transform .5s,opacity .2s}[data-sonner-toast][data-removed=true][data-front=false]::before{height:calc(var(--initial-height) + 20%)}[data-sonner-toast][data-swiping=true]{transform:var(--y) translateY(var(--swipe-amount-y,0)) translateX(var(--swipe-amount-x,0));transition:none}[data-sonner-toast][data-swiped=true]{user-select:none}[data-sonner-toast][data-swipe-out=true][data-y-position=bottom],[data-sonner-toast][data-swipe-out=true][data-y-position=top]{animation-duration:.2s;animation-timing-function:ease-out;animation-fill-mode:forwards}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=left]{animation-name:swipe-out-left}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=right]{animation-name:swipe-out-right}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=up]{animation-name:swipe-out-up}[data-sonner-toast][data-swipe-out=true][data-swipe-direction=down]{animation-name:swipe-out-down}@keyframes swipe-out-left{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) - 100%));opacity:0}}@keyframes swipe-out-right{from{transform:var(--y) translateX(var(--swipe-amount-x));opacity:1}to{transform:var(--y) translateX(calc(var(--swipe-amount-x) + 100%));opacity:0}}@keyframes swipe-out-up{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) - 100%));opacity:0}}@keyframes swipe-out-down{from{transform:var(--y) translateY(var(--swipe-amount-y));opacity:1}to{transform:var(--y) translateY(calc(var(--swipe-amount-y) + 100%));opacity:0}}@media (max-width:600px){[data-sonner-toaster]{position:fixed;right:var(--mobile-offset-right);left:var(--mobile-offset-left);width:100%}[data-sonner-toaster][dir=rtl]{left:calc(var(--mobile-offset-left) * -1)}[data-sonner-toaster] [data-sonner-toast]{left:0;right:0;width:calc(100% - var(--mobile-offset-left) * 2)}[data-sonner-toaster][data-x-position=left]{left:var(--mobile-offset-left)}[data-sonner-toaster][data-y-position=bottom]{bottom:var(--mobile-offset-bottom)}[data-sonner-toaster][data-y-position=top]{top:var(--mobile-offset-top)}[data-sonner-toaster][data-x-position=center]{left:var(--mobile-offset-left);right:var(--mobile-offset-right);transform:none}}[data-sonner-toaster][data-sonner-theme=light]{--normal-bg:#fff;--normal-border:var(--gray4);--normal-text:var(--gray12);--success-bg:hsl(143, 85%, 96%);--success-border:hsl(145, 92%, 87%);--success-text:hsl(140, 100%, 27%);--info-bg:hsl(208, 100%, 97%);--info-border:hsl(221, 91%, 93%);--info-text:hsl(210, 92%, 45%);--warning-bg:hsl(49, 100%, 97%);--warning-border:hsl(49, 91%, 84%);--warning-text:hsl(31, 92%, 45%);--error-bg:hsl(359, 100%, 97%);--error-border:hsl(359, 100%, 94%);--error-text:hsl(360, 100%, 45%)}[data-sonner-toaster][data-sonner-theme=light] [data-sonner-toast][data-invert=true]{--normal-bg:#000;--normal-border:hsl(0, 0%, 20%);--normal-text:var(--gray1)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast][data-invert=true]{--normal-bg:#fff;--normal-border:var(--gray3);--normal-text:var(--gray12)}[data-sonner-toaster][data-sonner-theme=dark]{--normal-bg:#000;--normal-bg-hover:hsl(0, 0%, 12%);--normal-border:hsl(0, 0%, 20%);--normal-border-hover:hsl(0, 0%, 25%);--normal-text:var(--gray1);--success-bg:hsl(150, 100%, 6%);--success-border:hsl(147, 100%, 12%);--success-text:hsl(150, 86%, 65%);--info-bg:hsl(215, 100%, 6%);--info-border:hsl(223, 43%, 17%);--info-text:hsl(216, 87%, 65%);--warning-bg:hsl(64, 100%, 6%);--warning-border:hsl(60, 100%, 9%);--warning-text:hsl(46, 87%, 65%);--error-bg:hsl(358, 76%, 10%);--error-border:hsl(357, 89%, 16%);--error-text:hsl(358, 100%, 81%)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]{background:var(--normal-bg);border-color:var(--normal-border);color:var(--normal-text)}[data-sonner-toaster][data-sonner-theme=dark] [data-sonner-toast] [data-close-button]:hover{background:var(--normal-bg-hover);border-color:var(--normal-border-hover)}[data-rich-colors=true][data-sonner-toast][data-type=success]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=success] [data-close-button]{background:var(--success-bg);border-color:var(--success-border);color:var(--success-text)}[data-rich-colors=true][data-sonner-toast][data-type=info]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=info] [data-close-button]{background:var(--info-bg);border-color:var(--info-border);color:var(--info-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=warning] [data-close-button]{background:var(--warning-bg);border-color:var(--warning-border);color:var(--warning-text)}[data-rich-colors=true][data-sonner-toast][data-type=error]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}[data-rich-colors=true][data-sonner-toast][data-type=error] [data-close-button]{background:var(--error-bg);border-color:var(--error-border);color:var(--error-text)}.sonner-loading-wrapper{--size:16px;height:var(--size);width:var(--size);position:absolute;inset:0;z-index:10}.sonner-loading-wrapper[data-visible=false]{transform-origin:center;animation:sonner-fade-out .2s ease forwards}.sonner-spinner{position:relative;top:50%;left:50%;height:var(--size);width:var(--size)}.sonner-loading-bar{animation:sonner-spin 1.2s linear infinite;background:var(--gray11);border-radius:6px;height:8%;left:-10%;position:absolute;top:-3.9%;width:24%}.sonner-loading-bar:first-child{animation-delay:-1.2s;transform:rotate(.0001deg) translate(146%)}.sonner-loading-bar:nth-child(2){animation-delay:-1.1s;transform:rotate(30deg) translate(146%)}.sonner-loading-bar:nth-child(3){animation-delay:-1s;transform:rotate(60deg) translate(146%)}.sonner-loading-bar:nth-child(4){animation-delay:-.9s;transform:rotate(90deg) translate(146%)}.sonner-loading-bar:nth-child(5){animation-delay:-.8s;transform:rotate(120deg) translate(146%)}.sonner-loading-bar:nth-child(6){animation-delay:-.7s;transform:rotate(150deg) translate(146%)}.sonner-loading-bar:nth-child(7){animation-delay:-.6s;transform:rotate(180deg) translate(146%)}.sonner-loading-bar:nth-child(8){animation-delay:-.5s;transform:rotate(210deg) translate(146%)}.sonner-loading-bar:nth-child(9){animation-delay:-.4s;transform:rotate(240deg) translate(146%)}.sonner-loading-bar:nth-child(10){animation-delay:-.3s;transform:rotate(270deg) translate(146%)}.sonner-loading-bar:nth-child(11){animation-delay:-.2s;transform:rotate(300deg) translate(146%)}.sonner-loading-bar:nth-child(12){animation-delay:-.1s;transform:rotate(330deg) translate(146%)}@keyframes sonner-fade-in{0%{opacity:0;transform:scale(.8)}100%{opacity:1;transform:scale(1)}}@keyframes sonner-fade-out{0%{opacity:1;transform:scale(1)}100%{opacity:0;transform:scale(.8)}}@keyframes sonner-spin{0%{opacity:1}100%{opacity:.15}}@media (prefers-reduced-motion){.sonner-loading-bar,[data-sonner-toast],[data-sonner-toast]>*{transition:none!important;animation:none!important}}.sonner-loader{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);transform-origin:center;transition:opacity .2s,transform .2s}.sonner-loader[data-visible=false]{opacity:0;transform:scale(.8) translate(-50%,-50%)}");
  function isAction(action) {
    return action.label !== void 0;
  }
  const VISIBLE_TOASTS_AMOUNT = 3;
  const VIEWPORT_OFFSET = "24px";
  const MOBILE_VIEWPORT_OFFSET = "16px";
  const TOAST_LIFETIME = 4e3;
  const TOAST_WIDTH = 356;
  const GAP = 14;
  const SWIPE_THRESHOLD = 45;
  const TIME_BEFORE_UNMOUNT = 200;
  function cn(...classes) {
    return classes.filter(Boolean).join(" ");
  }
  function getDefaultSwipeDirections(position) {
    const [y, x2] = position.split("-");
    const directions = [];
    if (y) {
      directions.push(y);
    }
    if (x2) {
      directions.push(x2);
    }
    return directions;
  }
  const Toast = (props) => {
    var _toast_classNames, _toast_classNames1, _toast_classNames2, _toast_classNames3, _toast_classNames4, _toast_classNames5, _toast_classNames6, _toast_classNames7, _toast_classNames8;
    const { invert: ToasterInvert, toast: toast2, unstyled, interacting, setHeights, visibleToasts, heights, index: index2, toasts, expanded, removeToast, defaultRichColors, closeButton: closeButtonFromToaster, style: style2, cancelButtonStyle, actionButtonStyle, className = "", descriptionClassName = "", duration: durationFromToaster, position, gap, expandByDefault, classNames, icons, closeButtonAriaLabel = "Close toast" } = props;
    const [swipeDirection, setSwipeDirection] = React.useState(null);
    const [swipeOutDirection, setSwipeOutDirection] = React.useState(null);
    const [mounted, setMounted] = React.useState(false);
    const [removed, setRemoved] = React.useState(false);
    const [swiping, setSwiping] = React.useState(false);
    const [swipeOut, setSwipeOut] = React.useState(false);
    const [isSwiped, setIsSwiped] = React.useState(false);
    const [offsetBeforeRemove, setOffsetBeforeRemove] = React.useState(0);
    const [initialHeight, setInitialHeight] = React.useState(0);
    const remainingTime = React.useRef(toast2.duration || durationFromToaster || TOAST_LIFETIME);
    const dragStartTime = React.useRef(null);
    const toastRef = React.useRef(null);
    const isFront = index2 === 0;
    const isVisible = index2 + 1 <= visibleToasts;
    const toastType = toast2.type;
    const dismissible = toast2.dismissible !== false;
    const toastClassname = toast2.className || "";
    const toastDescriptionClassname = toast2.descriptionClassName || "";
    const heightIndex = React.useMemo(() => heights.findIndex((height) => height.toastId === toast2.id) || 0, [
      heights,
      toast2.id
    ]);
    const closeButton = React.useMemo(() => {
      var _toast_closeButton;
      return (_toast_closeButton = toast2.closeButton) != null ? _toast_closeButton : closeButtonFromToaster;
    }, [
      toast2.closeButton,
      closeButtonFromToaster
    ]);
    const duration = React.useMemo(() => toast2.duration || durationFromToaster || TOAST_LIFETIME, [
      toast2.duration,
      durationFromToaster
    ]);
    const closeTimerStartTimeRef = React.useRef(0);
    const offset2 = React.useRef(0);
    const lastCloseTimerStartTimeRef = React.useRef(0);
    const pointerStartRef = React.useRef(null);
    const [y, x2] = position.split("-");
    const toastsHeightBefore = React.useMemo(() => {
      return heights.reduce((prev, curr, reducerIndex) => {
        if (reducerIndex >= heightIndex) {
          return prev;
        }
        return prev + curr.height;
      }, 0);
    }, [
      heights,
      heightIndex
    ]);
    const isDocumentHidden = useIsDocumentHidden();
    const invert = toast2.invert || ToasterInvert;
    const disabled = toastType === "loading";
    offset2.current = React.useMemo(() => heightIndex * gap + toastsHeightBefore, [
      heightIndex,
      toastsHeightBefore
    ]);
    React.useEffect(() => {
      remainingTime.current = duration;
    }, [
      duration
    ]);
    React.useEffect(() => {
      setMounted(true);
    }, []);
    React.useEffect(() => {
      const toastNode = toastRef.current;
      if (toastNode) {
        const height = toastNode.getBoundingClientRect().height;
        setInitialHeight(height);
        setHeights((h) => [
          {
            toastId: toast2.id,
            height,
            position: toast2.position
          },
          ...h
        ]);
        return () => setHeights((h) => h.filter((height2) => height2.toastId !== toast2.id));
      }
    }, [
      setHeights,
      toast2.id
    ]);
    React.useLayoutEffect(() => {
      if (!mounted) return;
      const toastNode = toastRef.current;
      const originalHeight = toastNode.style.height;
      toastNode.style.height = "auto";
      const newHeight = toastNode.getBoundingClientRect().height;
      toastNode.style.height = originalHeight;
      setInitialHeight(newHeight);
      setHeights((heights2) => {
        const alreadyExists = heights2.find((height) => height.toastId === toast2.id);
        if (!alreadyExists) {
          return [
            {
              toastId: toast2.id,
              height: newHeight,
              position: toast2.position
            },
            ...heights2
          ];
        } else {
          return heights2.map((height) => height.toastId === toast2.id ? {
            ...height,
            height: newHeight
          } : height);
        }
      });
    }, [
      mounted,
      toast2.title,
      toast2.description,
      setHeights,
      toast2.id,
      toast2.jsx,
      toast2.action,
      toast2.cancel
    ]);
    const deleteToast = React.useCallback(() => {
      setRemoved(true);
      setOffsetBeforeRemove(offset2.current);
      setHeights((h) => h.filter((height) => height.toastId !== toast2.id));
      setTimeout(() => {
        removeToast(toast2);
      }, TIME_BEFORE_UNMOUNT);
    }, [
      toast2,
      removeToast,
      setHeights,
      offset2
    ]);
    React.useEffect(() => {
      if (toast2.promise && toastType === "loading" || toast2.duration === Infinity || toast2.type === "loading") return;
      let timeoutId;
      const pauseTimer = () => {
        if (lastCloseTimerStartTimeRef.current < closeTimerStartTimeRef.current) {
          const elapsedTime = ( new Date()).getTime() - closeTimerStartTimeRef.current;
          remainingTime.current = remainingTime.current - elapsedTime;
        }
        lastCloseTimerStartTimeRef.current = ( new Date()).getTime();
      };
      const startTimer = () => {
        if (remainingTime.current === Infinity) return;
        closeTimerStartTimeRef.current = ( new Date()).getTime();
        timeoutId = setTimeout(() => {
          toast2.onAutoClose == null ? void 0 : toast2.onAutoClose.call(toast2, toast2);
          deleteToast();
        }, remainingTime.current);
      };
      if (expanded || interacting || isDocumentHidden) {
        pauseTimer();
      } else {
        startTimer();
      }
      return () => clearTimeout(timeoutId);
    }, [
      expanded,
      interacting,
      toast2,
      toastType,
      isDocumentHidden,
      deleteToast
    ]);
    React.useEffect(() => {
      if (toast2.delete) {
        deleteToast();
        toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
      }
    }, [
      deleteToast,
      toast2.delete
    ]);
    function getLoadingIcon() {
      var _toast_classNames9;
      if (icons == null ? void 0 : icons.loading) {
        var _toast_classNames12;
        return React.createElement("div", {
          className: cn(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames12 = toast2.classNames) == null ? void 0 : _toast_classNames12.loader, "sonner-loader"),
          "data-visible": toastType === "loading"
        }, icons.loading);
      }
      return React.createElement(Loader, {
        className: cn(classNames == null ? void 0 : classNames.loader, toast2 == null ? void 0 : (_toast_classNames9 = toast2.classNames) == null ? void 0 : _toast_classNames9.loader),
        visible: toastType === "loading"
      });
    }
    const icon = toast2.icon || (icons == null ? void 0 : icons[toastType]) || getAsset(toastType);
    var _toast_richColors, _icons_close;
    return React.createElement("li", {
      tabIndex: 0,
      ref: toastRef,
      className: cn(className, toastClassname, classNames == null ? void 0 : classNames.toast, toast2 == null ? void 0 : (_toast_classNames = toast2.classNames) == null ? void 0 : _toast_classNames.toast, classNames == null ? void 0 : classNames.default, classNames == null ? void 0 : classNames[toastType], toast2 == null ? void 0 : (_toast_classNames1 = toast2.classNames) == null ? void 0 : _toast_classNames1[toastType]),
      "data-sonner-toast": "",
      "data-rich-colors": (_toast_richColors = toast2.richColors) != null ? _toast_richColors : defaultRichColors,
      "data-styled": !Boolean(toast2.jsx || toast2.unstyled || unstyled),
      "data-mounted": mounted,
      "data-promise": Boolean(toast2.promise),
      "data-swiped": isSwiped,
      "data-removed": removed,
      "data-visible": isVisible,
      "data-y-position": y,
      "data-x-position": x2,
      "data-index": index2,
      "data-front": isFront,
      "data-swiping": swiping,
      "data-dismissible": dismissible,
      "data-type": toastType,
      "data-invert": invert,
      "data-swipe-out": swipeOut,
      "data-swipe-direction": swipeOutDirection,
      "data-expanded": Boolean(expanded || expandByDefault && mounted),
      "data-testid": toast2.testId,
      style: {
        "--index": index2,
        "--toasts-before": index2,
        "--z-index": toasts.length - index2,
        "--offset": `${removed ? offsetBeforeRemove : offset2.current}px`,
        "--initial-height": expandByDefault ? "auto" : `${initialHeight}px`,
        ...style2,
        ...toast2.style
      },
      onDragEnd: () => {
        setSwiping(false);
        setSwipeDirection(null);
        pointerStartRef.current = null;
      },
      onPointerDown: (event) => {
        if (event.button === 2) return;
        if (disabled || !dismissible) return;
        dragStartTime.current = new Date();
        setOffsetBeforeRemove(offset2.current);
        event.target.setPointerCapture(event.pointerId);
        if (event.target.tagName === "BUTTON") return;
        setSwiping(true);
        pointerStartRef.current = {
          x: event.clientX,
          y: event.clientY
        };
      },
      onPointerUp: () => {
        var _toastRef_current, _toastRef_current1, _dragStartTime_current;
        if (swipeOut || !dismissible) return;
        pointerStartRef.current = null;
        const swipeAmountX = Number(((_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.getPropertyValue("--swipe-amount-x").replace("px", "")) || 0);
        const swipeAmountY = Number(((_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.getPropertyValue("--swipe-amount-y").replace("px", "")) || 0);
        const timeTaken = ( new Date()).getTime() - ((_dragStartTime_current = dragStartTime.current) == null ? void 0 : _dragStartTime_current.getTime());
        const swipeAmount = swipeDirection === "x" ? swipeAmountX : swipeAmountY;
        const velocity = Math.abs(swipeAmount) / timeTaken;
        if (Math.abs(swipeAmount) >= SWIPE_THRESHOLD || velocity > 0.11) {
          setOffsetBeforeRemove(offset2.current);
          toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
          if (swipeDirection === "x") {
            setSwipeOutDirection(swipeAmountX > 0 ? "right" : "left");
          } else {
            setSwipeOutDirection(swipeAmountY > 0 ? "down" : "up");
          }
          deleteToast();
          setSwipeOut(true);
          return;
        } else {
          var _toastRef_current2, _toastRef_current3;
          (_toastRef_current2 = toastRef.current) == null ? void 0 : _toastRef_current2.style.setProperty("--swipe-amount-x", `0px`);
          (_toastRef_current3 = toastRef.current) == null ? void 0 : _toastRef_current3.style.setProperty("--swipe-amount-y", `0px`);
        }
        setIsSwiped(false);
        setSwiping(false);
        setSwipeDirection(null);
      },
      onPointerMove: (event) => {
        var _window_getSelection, _toastRef_current, _toastRef_current1;
        if (!pointerStartRef.current || !dismissible) return;
        const isHighlighted = ((_window_getSelection = window.getSelection()) == null ? void 0 : _window_getSelection.toString().length) > 0;
        if (isHighlighted) return;
        const yDelta = event.clientY - pointerStartRef.current.y;
        const xDelta = event.clientX - pointerStartRef.current.x;
        var _props_swipeDirections;
        const swipeDirections = (_props_swipeDirections = props.swipeDirections) != null ? _props_swipeDirections : getDefaultSwipeDirections(position);
        if (!swipeDirection && (Math.abs(xDelta) > 1 || Math.abs(yDelta) > 1)) {
          setSwipeDirection(Math.abs(xDelta) > Math.abs(yDelta) ? "x" : "y");
        }
        let swipeAmount = {
          x: 0,
          y: 0
        };
        const getDampening = (delta) => {
          const factor = Math.abs(delta) / 20;
          return 1 / (1.5 + factor);
        };
        if (swipeDirection === "y") {
          if (swipeDirections.includes("top") || swipeDirections.includes("bottom")) {
            if (swipeDirections.includes("top") && yDelta < 0 || swipeDirections.includes("bottom") && yDelta > 0) {
              swipeAmount.y = yDelta;
            } else {
              const dampenedDelta = yDelta * getDampening(yDelta);
              swipeAmount.y = Math.abs(dampenedDelta) < Math.abs(yDelta) ? dampenedDelta : yDelta;
            }
          }
        } else if (swipeDirection === "x") {
          if (swipeDirections.includes("left") || swipeDirections.includes("right")) {
            if (swipeDirections.includes("left") && xDelta < 0 || swipeDirections.includes("right") && xDelta > 0) {
              swipeAmount.x = xDelta;
            } else {
              const dampenedDelta = xDelta * getDampening(xDelta);
              swipeAmount.x = Math.abs(dampenedDelta) < Math.abs(xDelta) ? dampenedDelta : xDelta;
            }
          }
        }
        if (Math.abs(swipeAmount.x) > 0 || Math.abs(swipeAmount.y) > 0) {
          setIsSwiped(true);
        }
        (_toastRef_current = toastRef.current) == null ? void 0 : _toastRef_current.style.setProperty("--swipe-amount-x", `${swipeAmount.x}px`);
        (_toastRef_current1 = toastRef.current) == null ? void 0 : _toastRef_current1.style.setProperty("--swipe-amount-y", `${swipeAmount.y}px`);
      }
    }, closeButton && !toast2.jsx && toastType !== "loading" ? React.createElement("button", {
      "aria-label": closeButtonAriaLabel,
      "data-disabled": disabled,
      "data-close-button": true,
      onClick: disabled || !dismissible ? () => {
      } : () => {
        deleteToast();
        toast2.onDismiss == null ? void 0 : toast2.onDismiss.call(toast2, toast2);
      },
      className: cn(classNames == null ? void 0 : classNames.closeButton, toast2 == null ? void 0 : (_toast_classNames2 = toast2.classNames) == null ? void 0 : _toast_classNames2.closeButton)
    }, (_icons_close = icons == null ? void 0 : icons.close) != null ? _icons_close : CloseIcon) : null, (toastType || toast2.icon || toast2.promise) && toast2.icon !== null && ((icons == null ? void 0 : icons[toastType]) !== null || toast2.icon) ? React.createElement("div", {
      "data-icon": "",
      className: cn(classNames == null ? void 0 : classNames.icon, toast2 == null ? void 0 : (_toast_classNames3 = toast2.classNames) == null ? void 0 : _toast_classNames3.icon)
    }, toast2.promise || toast2.type === "loading" && !toast2.icon ? toast2.icon || getLoadingIcon() : null, toast2.type !== "loading" ? icon : null) : null, React.createElement("div", {
      "data-content": "",
      className: cn(classNames == null ? void 0 : classNames.content, toast2 == null ? void 0 : (_toast_classNames4 = toast2.classNames) == null ? void 0 : _toast_classNames4.content)
    }, React.createElement("div", {
      "data-title": "",
      className: cn(classNames == null ? void 0 : classNames.title, toast2 == null ? void 0 : (_toast_classNames5 = toast2.classNames) == null ? void 0 : _toast_classNames5.title)
    }, toast2.jsx ? toast2.jsx : typeof toast2.title === "function" ? toast2.title() : toast2.title), toast2.description ? React.createElement("div", {
      "data-description": "",
      className: cn(descriptionClassName, toastDescriptionClassname, classNames == null ? void 0 : classNames.description, toast2 == null ? void 0 : (_toast_classNames6 = toast2.classNames) == null ? void 0 : _toast_classNames6.description)
    }, typeof toast2.description === "function" ? toast2.description() : toast2.description) : null), React.isValidElement(toast2.cancel) ? toast2.cancel : toast2.cancel && isAction(toast2.cancel) ? React.createElement("button", {
      "data-button": true,
      "data-cancel": true,
      style: toast2.cancelButtonStyle || cancelButtonStyle,
      onClick: (event) => {
        if (!isAction(toast2.cancel)) return;
        if (!dismissible) return;
        toast2.cancel.onClick == null ? void 0 : toast2.cancel.onClick.call(toast2.cancel, event);
        deleteToast();
      },
      className: cn(classNames == null ? void 0 : classNames.cancelButton, toast2 == null ? void 0 : (_toast_classNames7 = toast2.classNames) == null ? void 0 : _toast_classNames7.cancelButton)
    }, toast2.cancel.label) : null, React.isValidElement(toast2.action) ? toast2.action : toast2.action && isAction(toast2.action) ? React.createElement("button", {
      "data-button": true,
      "data-action": true,
      style: toast2.actionButtonStyle || actionButtonStyle,
      onClick: (event) => {
        if (!isAction(toast2.action)) return;
        toast2.action.onClick == null ? void 0 : toast2.action.onClick.call(toast2.action, event);
        if (event.defaultPrevented) return;
        deleteToast();
      },
      className: cn(classNames == null ? void 0 : classNames.actionButton, toast2 == null ? void 0 : (_toast_classNames8 = toast2.classNames) == null ? void 0 : _toast_classNames8.actionButton)
    }, toast2.action.label) : null);
  };
  function getDocumentDirection() {
    if (typeof window === "undefined") return "ltr";
    if (typeof document === "undefined") return "ltr";
    const dirAttribute = document.documentElement.getAttribute("dir");
    if (dirAttribute === "auto" || !dirAttribute) {
      return window.getComputedStyle(document.documentElement).direction;
    }
    return dirAttribute;
  }
  function assignOffset(defaultOffset2, mobileOffset) {
    const styles = {};
    [
      defaultOffset2,
      mobileOffset
    ].forEach((offset2, index2) => {
      const isMobile = index2 === 1;
      const prefix2 = isMobile ? "--mobile-offset" : "--offset";
      const defaultValue = isMobile ? MOBILE_VIEWPORT_OFFSET : VIEWPORT_OFFSET;
      function assignAll(offset3) {
        [
          "top",
          "right",
          "bottom",
          "left"
        ].forEach((key) => {
          styles[`${prefix2}-${key}`] = typeof offset3 === "number" ? `${offset3}px` : offset3;
        });
      }
      if (typeof offset2 === "number" || typeof offset2 === "string") {
        assignAll(offset2);
      } else if (typeof offset2 === "object") {
        [
          "top",
          "right",
          "bottom",
          "left"
        ].forEach((key) => {
          if (offset2[key] === void 0) {
            styles[`${prefix2}-${key}`] = defaultValue;
          } else {
            styles[`${prefix2}-${key}`] = typeof offset2[key] === "number" ? `${offset2[key]}px` : offset2[key];
          }
        });
      } else {
        assignAll(defaultValue);
      }
    });
    return styles;
  }
  const Toaster$1 = React.forwardRef(function Toaster(props, ref) {
    const { id: id2, invert, position = "bottom-right", hotkey = [
      "altKey",
      "KeyT"
    ], expand, closeButton, className, offset: offset2, mobileOffset, theme = "light", richColors, duration, style: style2, visibleToasts = VISIBLE_TOASTS_AMOUNT, toastOptions, dir = getDocumentDirection(), gap = GAP, icons, containerAriaLabel = "Notifications" } = props;
    const [toasts, setToasts] = React.useState([]);
    const filteredToasts = React.useMemo(() => {
      if (id2) {
        return toasts.filter((toast2) => toast2.toasterId === id2);
      }
      return toasts.filter((toast2) => !toast2.toasterId);
    }, [
      toasts,
      id2
    ]);
    const possiblePositions = React.useMemo(() => {
      return Array.from(new Set([
        position
      ].concat(filteredToasts.filter((toast2) => toast2.position).map((toast2) => toast2.position))));
    }, [
      filteredToasts,
      position
    ]);
    const [heights, setHeights] = React.useState([]);
    const [expanded, setExpanded] = React.useState(false);
    const [interacting, setInteracting] = React.useState(false);
    const [actualTheme, setActualTheme] = React.useState(theme !== "system" ? theme : typeof window !== "undefined" ? window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : "light");
    const listRef = React.useRef(null);
    const hotkeyLabel = hotkey.join("+").replace(/Key/g, "").replace(/Digit/g, "");
    const lastFocusedElementRef = React.useRef(null);
    const isFocusWithinRef = React.useRef(false);
    const removeToast = React.useCallback((toastToRemove) => {
      setToasts((toasts2) => {
        var _toasts_find;
        if (!((_toasts_find = toasts2.find((toast2) => toast2.id === toastToRemove.id)) == null ? void 0 : _toasts_find.delete)) {
          ToastState.dismiss(toastToRemove.id);
        }
        return toasts2.filter(({ id: id3 }) => id3 !== toastToRemove.id);
      });
    }, []);
    React.useEffect(() => {
      return ToastState.subscribe((toast2) => {
        if (toast2.dismiss) {
          requestAnimationFrame(() => {
            setToasts((toasts2) => toasts2.map((t2) => t2.id === toast2.id ? {
              ...t2,
              delete: true
            } : t2));
          });
          return;
        }
        setTimeout(() => {
          ReactDOM.flushSync(() => {
            setToasts((toasts2) => {
              const indexOfExistingToast = toasts2.findIndex((t2) => t2.id === toast2.id);
              if (indexOfExistingToast !== -1) {
                return [
                  ...toasts2.slice(0, indexOfExistingToast),
                  {
                    ...toasts2[indexOfExistingToast],
                    ...toast2
                  },
                  ...toasts2.slice(indexOfExistingToast + 1)
                ];
              }
              return [
                toast2,
                ...toasts2
              ];
            });
          });
        });
      });
    }, [
      toasts
    ]);
    React.useEffect(() => {
      if (theme !== "system") {
        setActualTheme(theme);
        return;
      }
      if (theme === "system") {
        if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
          setActualTheme("dark");
        } else {
          setActualTheme("light");
        }
      }
      if (typeof window === "undefined") return;
      const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      try {
        darkMediaQuery.addEventListener("change", ({ matches }) => {
          if (matches) {
            setActualTheme("dark");
          } else {
            setActualTheme("light");
          }
        });
      } catch (error2) {
        darkMediaQuery.addListener(({ matches }) => {
          try {
            if (matches) {
              setActualTheme("dark");
            } else {
              setActualTheme("light");
            }
          } catch (e) {
            console.error(e);
          }
        });
      }
    }, [
      theme
    ]);
    React.useEffect(() => {
      if (toasts.length <= 1) {
        setExpanded(false);
      }
    }, [
      toasts
    ]);
    React.useEffect(() => {
      const handleKeyDown = (event) => {
        var _listRef_current;
        const isHotkeyPressed = hotkey.every((key) => event[key] || event.code === key);
        if (isHotkeyPressed) {
          var _listRef_current1;
          setExpanded(true);
          (_listRef_current1 = listRef.current) == null ? void 0 : _listRef_current1.focus();
        }
        if (event.code === "Escape" && (document.activeElement === listRef.current || ((_listRef_current = listRef.current) == null ? void 0 : _listRef_current.contains(document.activeElement)))) {
          setExpanded(false);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => document.removeEventListener("keydown", handleKeyDown);
    }, [
      hotkey
    ]);
    React.useEffect(() => {
      if (listRef.current) {
        return () => {
          if (lastFocusedElementRef.current) {
            lastFocusedElementRef.current.focus({
              preventScroll: true
            });
            lastFocusedElementRef.current = null;
            isFocusWithinRef.current = false;
          }
        };
      }
    }, [
      listRef.current
    ]);
    return (

React.createElement("section", {
        ref,
        "aria-label": `${containerAriaLabel} ${hotkeyLabel}`,
        tabIndex: -1,
        "aria-live": "polite",
        "aria-relevant": "additions text",
        "aria-atomic": "false",
        suppressHydrationWarning: true
      }, possiblePositions.map((position2, index2) => {
        var _heights_;
        const [y, x2] = position2.split("-");
        if (!filteredToasts.length) return null;
        return React.createElement("ol", {
          key: position2,
          dir: dir === "auto" ? getDocumentDirection() : dir,
          tabIndex: -1,
          ref: listRef,
          className,
          "data-sonner-toaster": true,
          "data-sonner-theme": actualTheme,
          "data-y-position": y,
          "data-x-position": x2,
          style: {
            "--front-toast-height": `${((_heights_ = heights[0]) == null ? void 0 : _heights_.height) || 0}px`,
            "--width": `${TOAST_WIDTH}px`,
            "--gap": `${gap}px`,
            ...style2,
            ...assignOffset(offset2, mobileOffset)
          },
          onBlur: (event) => {
            if (isFocusWithinRef.current && !event.currentTarget.contains(event.relatedTarget)) {
              isFocusWithinRef.current = false;
              if (lastFocusedElementRef.current) {
                lastFocusedElementRef.current.focus({
                  preventScroll: true
                });
                lastFocusedElementRef.current = null;
              }
            }
          },
          onFocus: (event) => {
            const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
            if (isNotDismissible) return;
            if (!isFocusWithinRef.current) {
              isFocusWithinRef.current = true;
              lastFocusedElementRef.current = event.relatedTarget;
            }
          },
          onMouseEnter: () => setExpanded(true),
          onMouseMove: () => setExpanded(true),
          onMouseLeave: () => {
            if (!interacting) {
              setExpanded(false);
            }
          },
          onDragEnd: () => setExpanded(false),
          onPointerDown: (event) => {
            const isNotDismissible = event.target instanceof HTMLElement && event.target.dataset.dismissible === "false";
            if (isNotDismissible) return;
            setInteracting(true);
          },
          onPointerUp: () => setInteracting(false)
        }, filteredToasts.filter((toast2) => !toast2.position && index2 === 0 || toast2.position === position2).map((toast2, index3) => {
          var _toastOptions_duration, _toastOptions_closeButton;
          return React.createElement(Toast, {
            key: toast2.id,
            icons,
            index: index3,
            toast: toast2,
            defaultRichColors: richColors,
            duration: (_toastOptions_duration = toastOptions == null ? void 0 : toastOptions.duration) != null ? _toastOptions_duration : duration,
            className: toastOptions == null ? void 0 : toastOptions.className,
            descriptionClassName: toastOptions == null ? void 0 : toastOptions.descriptionClassName,
            invert,
            visibleToasts,
            closeButton: (_toastOptions_closeButton = toastOptions == null ? void 0 : toastOptions.closeButton) != null ? _toastOptions_closeButton : closeButton,
            interacting,
            position: position2,
            style: toastOptions == null ? void 0 : toastOptions.style,
            unstyled: toastOptions == null ? void 0 : toastOptions.unstyled,
            classNames: toastOptions == null ? void 0 : toastOptions.classNames,
            cancelButtonStyle: toastOptions == null ? void 0 : toastOptions.cancelButtonStyle,
            actionButtonStyle: toastOptions == null ? void 0 : toastOptions.actionButtonStyle,
            closeButtonAriaLabel: toastOptions == null ? void 0 : toastOptions.closeButtonAriaLabel,
            removeToast,
            toasts: filteredToasts.filter((t2) => t2.position == toast2.position),
            heights: heights.filter((h) => h.position == toast2.position),
            setHeights,
            expandByDefault: expand,
            gap,
            expanded,
            swipeDirections: props.swipeDirections
          });
        }));
      }))
    );
  });
  function EmojiToolkit() {
    return jsxRuntimeExports.jsxs(Popover, { children: [
jsxRuntimeExports.jsx(PopoverTrigger, { children: jsxRuntimeExports.jsx(lucideReact.SmilePlus, { className: "size-6 hover:text-primary" }) }),
jsxRuntimeExports.jsx(
        PopoverContent,
        {
          align: "start",
          side: "top",
          className: "w-88 p-0 h-80 overflow-hidden",
          children: jsxRuntimeExports.jsx(EmojiTabs, {})
        }
      )
    ] });
  }
  function EmojiTabs() {
    const [activeTab, setActiveTab] = React.useState();
    const { data, loading, error: error2 } = useRequest(fetchEmoji, {
      staleTime: 10 * 60 * 1e3,
      cacheKey: "emoji"
    });
    const groupEmoji = React.useMemo(() => {
      if (!data) return new Map();
      const grouped = new Map();
      for (const item of data) {
        const list = grouped.get(item.group) ?? [];
        list.push(item);
        grouped.set(item.group, list);
      }
      return grouped;
    }, [data]);
    const setComment = jotai.useSetAtom(commentAtom);
    const groups = Array.from(groupEmoji.keys());
    const handleClick = (e) => {
      setComment((prev) => prev + `[${e.emojiname}]`);
    };
    React.useEffect(() => {
      if (groups.length > 0 && !activeTab) {
        setActiveTab(groups[0]);
      }
    }, [groups, activeTab]);
    if (loading) return jsxRuntimeExports.jsx(LoadingContent, {});
    if (error2) return jsxRuntimeExports.jsx(ErrorContent, {});
    return jsxRuntimeExports.jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "h-full", children: [
jsxRuntimeExports.jsx(TabsList, { className: "mt-2 ml-2", children: groups.map((group) => jsxRuntimeExports.jsx(TabsTrigger, { value: group, children: group }, group)) }),
      groups.map((group) => jsxRuntimeExports.jsx(TabsContent, { value: group, className: "overflow-hidden", children: jsxRuntimeExports.jsx(ScrollArea, { className: "h-full p-2 pt-0", children: jsxRuntimeExports.jsxs("div", { className: "grid grid-cols-7 gap-2 p-2 justify-items-center items-center", children: [
        group === "test" && jsxRuntimeExports.jsx(UploadButton, {}),
        groupEmoji.get(group)?.map((item) => jsxRuntimeExports.jsx(
          EmojiImage,
          {
            className: "hover:scale-110 object-contain cursor-pointer",
            imgKey: item.emojiname,
            onClick: () => handleClick(item)
          },
          item.emojiname
        ))
      ] }) }) }))
    ] });
  }
  function LoadingContent() {
    return jsxRuntimeExports.jsx("div", { className: "h-full flex items-center justify-center text-sm text-muted-foreground", children: "加载中..." });
  }
  function ErrorContent() {
    return jsxRuntimeExports.jsx(Empty, { className: "h-full", children: jsxRuntimeExports.jsxs(EmptyHeader, { children: [
jsxRuntimeExports.jsx(EmptyMedia, { children: jsxRuntimeExports.jsx(lucideReact.TriangleAlert, { className: "size-10" }) }),
jsxRuntimeExports.jsx(EmptyTitle, { children: "图片获取失败" }),
jsxRuntimeExports.jsx(EmptyDescription, { children: "具体错误信息请联系源站长。" })
    ] }) });
  }
  const loadingPlaceholder = jsxRuntimeExports.jsx(LoadingIcon, { className: "size-8" });
  const errorFallback = jsxRuntimeExports.jsx(SvgImageError, { className: "size-8" });
  function EmojiImage({
    imgKey,
    onClick,
    ...rest
  }) {
    const { url, isError } = useImageUrl(imgKey);
    if (isError) return errorFallback;
    return jsxRuntimeExports.jsx(
      Image$1,
      {
        src: url,
        loadingPlaceholder,
        errorFallback,
        alt: imgKey,
        loading: "lazy",
        onClick,
        ...rest
      }
    );
  }
  const imageMaxSize = Number("2");
  function UploadButton() {
    const fileInputRef = React.useRef(null);
    const handleClick = () => {
      fileInputRef.current?.click();
    };
    const handleFileChange = (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const validImageTypes = [
        "image/jpeg",
        "image/png",
        "image/gif",
        "image/webp"
      ];
      if (!validImageTypes.includes(file.type)) {
        toast.error("只支持 JPG, PNG, GIF, WEBP 格式的图片");
        return;
      }
      const maxSize = imageMaxSize * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`图片大小不能超过 ${imageMaxSize}MB`);
        return;
      }
      toast.promise(
        fetchStsToken().then((token) => uploadFile(file, token)).then((cosUrl) => submitEmojiUrl(cosUrl)).then((res) => {
          if (!res.success) {
            throw new Error(res.msg);
          }
          return res;
        }),
        {
          loading: "图片上传中！请耐心等待。",
          success: "表情上传成功，请耐心等待审核结果。",
          error(e2) {
            return {
              message: "图片上传失败！",
              description: e2.message || "未知错误"
            };
          }
        }
      );
    };
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: handleClick, children: jsxRuntimeExports.jsx(lucideReact.Plus, {}) }),
jsxRuntimeExports.jsx(
        "input",
        {
          ref: fileInputRef,
          type: "file",
          accept: "image/*",
          className: "hidden",
          onChange: handleFileChange
        }
      )
    ] });
  }
  function LabelTooltik() {
    const [userLabels, dispatch] = jotai.useAtom(userLabelsAtom);
    const handleRemove = (id2) => {
      dispatch({ type: "remove", id: id2 });
    };
    const handleClear = () => {
      dispatch({ type: "clear" });
    };
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: jsxRuntimeExports.jsx(Tooltip, { children: jsxRuntimeExports.jsxs(Popover, { children: [
jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: jsxRuntimeExports.jsx(PopoverTrigger, { asChild: true, children: jsxRuntimeExports.jsx(lucideReact.Flag, { className: "size-6 hover:text-primary" }) }) }),
jsxRuntimeExports.jsx(TooltipContent, { children: "我的标记" }),
jsxRuntimeExports.jsx(
        PopoverContent,
        {
          align: "end",
          side: "top",
          className: "w-88 p-0 py-3 h-80 overflow-hidden",
          children: jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-2 h-full overflow-hidden", children: userLabels.length > 0 ? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(ScrollArea, { className: "px-3 flex-1 min-h-0", children: jsxRuntimeExports.jsx("div", { className: "flex flex-col gap-1 overflow-hidden h-full", children: userLabels.map((u, i2) => jsxRuntimeExports.jsxs(
              "div",
              {
                className: "p-1 flex items-center justify-between hover:bg-secondary rounded-sm gap-1",
                children: [
jsxRuntimeExports.jsxs("span", { className: "text-sm", children: [
                    i2 + 1,
                    "."
                  ] }),
jsxRuntimeExports.jsxs("span", { className: "text-sm truncate flex-1", children: [
                    u.label,
                    "（",
                    u.username,
                    "）"
                  ] }),
jsxRuntimeExports.jsx(
                    lucideReact.Trash2,
                    {
                      className: "size-4 cursor-pointer hover:text-primary shrink-0 ml-6",
                      onClick: () => handleRemove(u.id)
                    }
                  )
                ]
              },
              u.id
            )) }) }),
jsxRuntimeExports.jsx("div", { className: "text-center", children: jsxRuntimeExports.jsx(
              Button,
              {
                variant: "outline",
                className: "text",
                size: "sm",
                onClick: handleClear,
                children: "清空标记"
              }
            ) })
          ] }) : jsxRuntimeExports.jsx("span", { className: "text-sm text-muted-foreground absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2", children: "--- 暂未标记用户 ---" }) })
        }
      )
    ] }) }) });
  }
  function ChatTooltik() {
    return jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center gap-2", children: [
jsxRuntimeExports.jsx(EmojiToolkit, {}),
jsxRuntimeExports.jsx(BannedToolkit, {}),
jsxRuntimeExports.jsx(LabelTooltik, {})
    ] });
  }
  function ChatAction() {
    return jsxRuntimeExports.jsx("div", { className: "border-t border-border px-4 py-3", children: jsxRuntimeExports.jsx(ChatTooltik, {}) });
  }
  function Textarea({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "textarea",
      {
        "data-slot": "textarea",
        className: cn$1(
          "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ...props
      }
    );
  }
  function CommentInput({ sendMessage }) {
    const [text, setText] = jotai.useAtom(commentAtom);
    const handleChange = (e) => {
      setText(e.target.value);
    };
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        e.currentTarget.form?.requestSubmit();
      }
    };
    const handleSubmit = React.useCallback(
      debounce(
        (text2) => {
          sendMessage(text2);
          setText("");
        },
        2e3,
        true
      ),
      [sendMessage]
    );
    return jsxRuntimeExports.jsx("div", { className: "px-4 pb-4", children: jsxRuntimeExports.jsxs(
      "form",
      {
        className: "group grid grid-cols-[1fr_auto_auto] border shadow-sm rounded-lg focus-within:border-primary",
        onSubmit: (e) => {
          e.preventDefault();
          handleSubmit(text);
        },
        children: [
jsxRuntimeExports.jsx(
            Textarea,
            {
              value: text,
              name: "comment",
              placeholder: "发条评论吧～",
              className: "resize-none border-0 focus-visible:ring-0 shadow-none max-h-20 min-h-5",
              onChange: handleChange,
              onKeyDown: handleKeyDown
            }
          ),
jsxRuntimeExports.jsx(
            Separator,
            {
              orientation: "vertical",
              className: "group-focus-within:bg-primary"
            }
          ),
jsxRuntimeExports.jsx(
            Button,
            {
              variant: "link",
              className: "self-center hover:no-underline focus-visible:ring-0 shadow-none p-0 mx-4",
              type: "submit",
              disabled: text.length <= 0,
              children: "发送"
            }
          )
        ]
      }
    ) });
  }
  function Card({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "card",
        className: cn$1(
          "bg-card text-card-foreground flex flex-col gap-2 rounded-xl border py-3.5 shadow-sm",
          className
        ),
        ...props
      }
    );
  }
  function CardHeader({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "card-header",
        className: cn$1(
          "@container/card-header grid auto-rows-min grid-rows-[auto_auto] items-start gap-2 px-3.5 has-data-[slot=card-action]:grid-cols-[1fr_auto] [.border-b]:pb-6",
          className
        ),
        ...props
      }
    );
  }
  function CardContent({ className, ...props }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        "data-slot": "card-content",
        className: cn$1("px-3.5", className),
        ...props
      }
    );
  }
  var version = "4.6.2";
  function wait(durationMs, resolveWith) {
    return new Promise(function(resolve) {
      return setTimeout(resolve, durationMs, resolveWith);
    });
  }
  function releaseEventLoop() {
    return new Promise(function(resolve) {
      var channel = new MessageChannel();
      channel.port1.onmessage = function() {
        return resolve();
      };
      channel.port2.postMessage(null);
    });
  }
  function requestIdleCallbackIfAvailable(fallbackTimeout, deadlineTimeout) {
    if (deadlineTimeout === void 0) {
      deadlineTimeout = Infinity;
    }
    var requestIdleCallback = window.requestIdleCallback;
    if (requestIdleCallback) {
      return new Promise(function(resolve) {
        return requestIdleCallback.call(window, function() {
          return resolve();
        }, { timeout: deadlineTimeout });
      });
    } else {
      return wait(Math.min(fallbackTimeout, deadlineTimeout));
    }
  }
  function isPromise(value) {
    return !!value && typeof value.then === "function";
  }
  function awaitIfAsync(action, callback) {
    try {
      var returnedValue = action();
      if (isPromise(returnedValue)) {
        returnedValue.then(function(result) {
          return callback(true, result);
        }, function(error2) {
          return callback(false, error2);
        });
      } else {
        callback(true, returnedValue);
      }
    } catch (error2) {
      callback(false, error2);
    }
  }
  function mapWithBreaks(items, callback, loopReleaseInterval) {
    if (loopReleaseInterval === void 0) {
      loopReleaseInterval = 16;
    }
    return __awaiter(this, void 0, void 0, function() {
      var results, lastLoopReleaseTime, i2, now2;
      return __generator(this, function(_a) {
        switch (_a.label) {
          case 0:
            results = Array(items.length);
            lastLoopReleaseTime = Date.now();
            i2 = 0;
            _a.label = 1;
          case 1:
            if (!(i2 < items.length)) return [3, 4];
            results[i2] = callback(items[i2], i2);
            now2 = Date.now();
            if (!(now2 >= lastLoopReleaseTime + loopReleaseInterval)) return [3, 3];
            lastLoopReleaseTime = now2;
            return [4, releaseEventLoop()];
          case 2:
            _a.sent();
            _a.label = 3;
          case 3:
            ++i2;
            return [3, 1];
          case 4:
            return [2, results];
        }
      });
    });
  }
  function suppressUnhandledRejectionWarning(promise) {
    promise.then(void 0, function() {
      return void 0;
    });
    return promise;
  }
  function includes(haystack, needle) {
    for (var i2 = 0, l = haystack.length; i2 < l; ++i2) {
      if (haystack[i2] === needle) {
        return true;
      }
    }
    return false;
  }
  function excludes(haystack, needle) {
    return !includes(haystack, needle);
  }
  function toInt(value) {
    return parseInt(value);
  }
  function toFloat(value) {
    return parseFloat(value);
  }
  function replaceNaN(value, replacement) {
    return typeof value === "number" && isNaN(value) ? replacement : value;
  }
  function countTruthy(values) {
    return values.reduce(function(sum, value) {
      return sum + (value ? 1 : 0);
    }, 0);
  }
  function round(value, base) {
    if (base === void 0) {
      base = 1;
    }
    if (Math.abs(base) >= 1) {
      return Math.round(value / base) * base;
    } else {
      var counterBase = 1 / base;
      return Math.round(value * counterBase) / counterBase;
    }
  }
  function parseSimpleCssSelector(selector) {
    var _a, _b;
    var errorMessage = "Unexpected syntax '".concat(selector, "'");
    var tagMatch = /^\s*([a-z-]*)(.*)$/i.exec(selector);
    var tag = tagMatch[1] || void 0;
    var attributes = {};
    var partsRegex = /([.:#][\w-]+|\[.+?\])/gi;
    var addAttribute = function(name, value) {
      attributes[name] = attributes[name] || [];
      attributes[name].push(value);
    };
    for (; ; ) {
      var match = partsRegex.exec(tagMatch[2]);
      if (!match) {
        break;
      }
      var part = match[0];
      switch (part[0]) {
        case ".":
          addAttribute("class", part.slice(1));
          break;
        case "#":
          addAttribute("id", part.slice(1));
          break;
        case "[": {
          var attributeMatch = /^\[([\w-]+)([~|^$*]?=("(.*?)"|([\w-]+)))?(\s+[is])?\]$/.exec(part);
          if (attributeMatch) {
            addAttribute(attributeMatch[1], (_b = (_a = attributeMatch[4]) !== null && _a !== void 0 ? _a : attributeMatch[5]) !== null && _b !== void 0 ? _b : "");
          } else {
            throw new Error(errorMessage);
          }
          break;
        }
        default:
          throw new Error(errorMessage);
      }
    }
    return [tag, attributes];
  }
  function getUTF8Bytes(input) {
    var result = new Uint8Array(input.length);
    for (var i2 = 0; i2 < input.length; i2++) {
      var charCode = input.charCodeAt(i2);
      if (charCode > 127) {
        return new TextEncoder().encode(input);
      }
      result[i2] = charCode;
    }
    return result;
  }
  function x64Add(m, n2) {
    var m0 = m[0] >>> 16, m1 = m[0] & 65535, m2 = m[1] >>> 16, m3 = m[1] & 65535;
    var n0 = n2[0] >>> 16, n1 = n2[0] & 65535, n22 = n2[1] >>> 16, n3 = n2[1] & 65535;
    var o0 = 0, o1 = 0, o2 = 0, o3 = 0;
    o3 += m3 + n3;
    o2 += o3 >>> 16;
    o3 &= 65535;
    o2 += m2 + n22;
    o1 += o2 >>> 16;
    o2 &= 65535;
    o1 += m1 + n1;
    o0 += o1 >>> 16;
    o1 &= 65535;
    o0 += m0 + n0;
    o0 &= 65535;
    m[0] = o0 << 16 | o1;
    m[1] = o2 << 16 | o3;
  }
  function x64Multiply(m, n2) {
    var m0 = m[0] >>> 16, m1 = m[0] & 65535, m2 = m[1] >>> 16, m3 = m[1] & 65535;
    var n0 = n2[0] >>> 16, n1 = n2[0] & 65535, n22 = n2[1] >>> 16, n3 = n2[1] & 65535;
    var o0 = 0, o1 = 0, o2 = 0, o3 = 0;
    o3 += m3 * n3;
    o2 += o3 >>> 16;
    o3 &= 65535;
    o2 += m2 * n3;
    o1 += o2 >>> 16;
    o2 &= 65535;
    o2 += m3 * n22;
    o1 += o2 >>> 16;
    o2 &= 65535;
    o1 += m1 * n3;
    o0 += o1 >>> 16;
    o1 &= 65535;
    o1 += m2 * n22;
    o0 += o1 >>> 16;
    o1 &= 65535;
    o1 += m3 * n1;
    o0 += o1 >>> 16;
    o1 &= 65535;
    o0 += m0 * n3 + m1 * n22 + m2 * n1 + m3 * n0;
    o0 &= 65535;
    m[0] = o0 << 16 | o1;
    m[1] = o2 << 16 | o3;
  }
  function x64Rotl(m, bits) {
    var m0 = m[0];
    bits %= 64;
    if (bits === 32) {
      m[0] = m[1];
      m[1] = m0;
    } else if (bits < 32) {
      m[0] = m0 << bits | m[1] >>> 32 - bits;
      m[1] = m[1] << bits | m0 >>> 32 - bits;
    } else {
      bits -= 32;
      m[0] = m[1] << bits | m0 >>> 32 - bits;
      m[1] = m0 << bits | m[1] >>> 32 - bits;
    }
  }
  function x64LeftShift(m, bits) {
    bits %= 64;
    if (bits === 0) {
      return;
    } else if (bits < 32) {
      m[0] = m[1] >>> 32 - bits;
      m[1] = m[1] << bits;
    } else {
      m[0] = m[1] << bits - 32;
      m[1] = 0;
    }
  }
  function x64Xor(m, n2) {
    m[0] ^= n2[0];
    m[1] ^= n2[1];
  }
  var F1 = [4283543511, 3981806797];
  var F2 = [3301882366, 444984403];
  function x64Fmix(h) {
    var shifted = [0, h[0] >>> 1];
    x64Xor(h, shifted);
    x64Multiply(h, F1);
    shifted[1] = h[0] >>> 1;
    x64Xor(h, shifted);
    x64Multiply(h, F2);
    shifted[1] = h[0] >>> 1;
    x64Xor(h, shifted);
  }
  var C1 = [2277735313, 289559509];
  var C2 = [1291169091, 658871167];
  var M$1 = [0, 5];
  var N1 = [0, 1390208809];
  var N2 = [0, 944331445];
  function x64hash128(input, seed) {
    var key = getUTF8Bytes(input);
    seed = seed || 0;
    var length = [0, key.length];
    var remainder = length[1] % 16;
    var bytes = length[1] - remainder;
    var h1 = [0, seed];
    var h2 = [0, seed];
    var k1 = [0, 0];
    var k2 = [0, 0];
    var i2;
    for (i2 = 0; i2 < bytes; i2 = i2 + 16) {
      k1[0] = key[i2 + 4] | key[i2 + 5] << 8 | key[i2 + 6] << 16 | key[i2 + 7] << 24;
      k1[1] = key[i2] | key[i2 + 1] << 8 | key[i2 + 2] << 16 | key[i2 + 3] << 24;
      k2[0] = key[i2 + 12] | key[i2 + 13] << 8 | key[i2 + 14] << 16 | key[i2 + 15] << 24;
      k2[1] = key[i2 + 8] | key[i2 + 9] << 8 | key[i2 + 10] << 16 | key[i2 + 11] << 24;
      x64Multiply(k1, C1);
      x64Rotl(k1, 31);
      x64Multiply(k1, C2);
      x64Xor(h1, k1);
      x64Rotl(h1, 27);
      x64Add(h1, h2);
      x64Multiply(h1, M$1);
      x64Add(h1, N1);
      x64Multiply(k2, C2);
      x64Rotl(k2, 33);
      x64Multiply(k2, C1);
      x64Xor(h2, k2);
      x64Rotl(h2, 31);
      x64Add(h2, h1);
      x64Multiply(h2, M$1);
      x64Add(h2, N2);
    }
    k1[0] = 0;
    k1[1] = 0;
    k2[0] = 0;
    k2[1] = 0;
    var val = [0, 0];
    switch (remainder) {
      case 15:
        val[1] = key[i2 + 14];
        x64LeftShift(val, 48);
        x64Xor(k2, val);
case 14:
        val[1] = key[i2 + 13];
        x64LeftShift(val, 40);
        x64Xor(k2, val);
case 13:
        val[1] = key[i2 + 12];
        x64LeftShift(val, 32);
        x64Xor(k2, val);
case 12:
        val[1] = key[i2 + 11];
        x64LeftShift(val, 24);
        x64Xor(k2, val);
case 11:
        val[1] = key[i2 + 10];
        x64LeftShift(val, 16);
        x64Xor(k2, val);
case 10:
        val[1] = key[i2 + 9];
        x64LeftShift(val, 8);
        x64Xor(k2, val);
case 9:
        val[1] = key[i2 + 8];
        x64Xor(k2, val);
        x64Multiply(k2, C2);
        x64Rotl(k2, 33);
        x64Multiply(k2, C1);
        x64Xor(h2, k2);
case 8:
        val[1] = key[i2 + 7];
        x64LeftShift(val, 56);
        x64Xor(k1, val);
case 7:
        val[1] = key[i2 + 6];
        x64LeftShift(val, 48);
        x64Xor(k1, val);
case 6:
        val[1] = key[i2 + 5];
        x64LeftShift(val, 40);
        x64Xor(k1, val);
case 5:
        val[1] = key[i2 + 4];
        x64LeftShift(val, 32);
        x64Xor(k1, val);
case 4:
        val[1] = key[i2 + 3];
        x64LeftShift(val, 24);
        x64Xor(k1, val);
case 3:
        val[1] = key[i2 + 2];
        x64LeftShift(val, 16);
        x64Xor(k1, val);
case 2:
        val[1] = key[i2 + 1];
        x64LeftShift(val, 8);
        x64Xor(k1, val);
case 1:
        val[1] = key[i2];
        x64Xor(k1, val);
        x64Multiply(k1, C1);
        x64Rotl(k1, 31);
        x64Multiply(k1, C2);
        x64Xor(h1, k1);
    }
    x64Xor(h1, length);
    x64Xor(h2, length);
    x64Add(h1, h2);
    x64Add(h2, h1);
    x64Fmix(h1);
    x64Fmix(h2);
    x64Add(h1, h2);
    x64Add(h2, h1);
    return ("00000000" + (h1[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h1[1] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[0] >>> 0).toString(16)).slice(-8) + ("00000000" + (h2[1] >>> 0).toString(16)).slice(-8);
  }
  function errorToObject(error2) {
    var _a;
    return __assign({ name: error2.name, message: error2.message, stack: (_a = error2.stack) === null || _a === void 0 ? void 0 : _a.split("\n") }, error2);
  }
  function isFunctionNative(func) {
    return /^function\s.*?\{\s*\[native code]\s*}$/.test(String(func));
  }
  function isFinalResultLoaded(loadResult) {
    return typeof loadResult !== "function";
  }
  function loadSource(source, sourceOptions) {
    var sourceLoadPromise = suppressUnhandledRejectionWarning(new Promise(function(resolveLoad) {
      var loadStartTime = Date.now();
      awaitIfAsync(source.bind(null, sourceOptions), function() {
        var loadArgs = [];
        for (var _i = 0; _i < arguments.length; _i++) {
          loadArgs[_i] = arguments[_i];
        }
        var loadDuration = Date.now() - loadStartTime;
        if (!loadArgs[0]) {
          return resolveLoad(function() {
            return { error: loadArgs[1], duration: loadDuration };
          });
        }
        var loadResult = loadArgs[1];
        if (isFinalResultLoaded(loadResult)) {
          return resolveLoad(function() {
            return { value: loadResult, duration: loadDuration };
          });
        }
        resolveLoad(function() {
          return new Promise(function(resolveGet) {
            var getStartTime = Date.now();
            awaitIfAsync(loadResult, function() {
              var getArgs = [];
              for (var _i2 = 0; _i2 < arguments.length; _i2++) {
                getArgs[_i2] = arguments[_i2];
              }
              var duration = loadDuration + Date.now() - getStartTime;
              if (!getArgs[0]) {
                return resolveGet({ error: getArgs[1], duration });
              }
              resolveGet({ value: getArgs[1], duration });
            });
          });
        });
      });
    }));
    return function getComponent() {
      return sourceLoadPromise.then(function(finalizeSource) {
        return finalizeSource();
      });
    };
  }
  function loadSources(sources2, sourceOptions, excludeSources, loopReleaseInterval) {
    var includedSources = Object.keys(sources2).filter(function(sourceKey) {
      return excludes(excludeSources, sourceKey);
    });
    var sourceGettersPromise = suppressUnhandledRejectionWarning(mapWithBreaks(includedSources, function(sourceKey) {
      return loadSource(sources2[sourceKey], sourceOptions);
    }, loopReleaseInterval));
    return function getComponents() {
      return __awaiter(this, void 0, void 0, function() {
        var sourceGetters, componentPromises, componentArray, components, index2;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, sourceGettersPromise];
            case 1:
              sourceGetters = _a.sent();
              return [4, mapWithBreaks(sourceGetters, function(sourceGetter) {
                return suppressUnhandledRejectionWarning(sourceGetter());
              }, loopReleaseInterval)];
            case 2:
              componentPromises = _a.sent();
              return [
                4,
                Promise.all(componentPromises)
];
            case 3:
              componentArray = _a.sent();
              components = {};
              for (index2 = 0; index2 < includedSources.length; ++index2) {
                components[includedSources[index2]] = componentArray[index2];
              }
              return [2, components];
          }
        });
      });
    };
  }
  function isTrident() {
    var w = window;
    var n2 = navigator;
    return countTruthy([
      "MSCSSMatrix" in w,
      "msSetImmediate" in w,
      "msIndexedDB" in w,
      "msMaxTouchPoints" in n2,
      "msPointerEnabled" in n2
    ]) >= 4;
  }
  function isEdgeHTML() {
    var w = window;
    var n2 = navigator;
    return countTruthy(["msWriteProfilerMark" in w, "MSStream" in w, "msLaunchUri" in n2, "msSaveBlob" in n2]) >= 3 && !isTrident();
  }
  function isChromium() {
    var w = window;
    var n2 = navigator;
    return countTruthy([
      "webkitPersistentStorage" in n2,
      "webkitTemporaryStorage" in n2,
      (n2.vendor || "").indexOf("Google") === 0,
      "webkitResolveLocalFileSystemURL" in w,
      "BatteryManager" in w,
      "webkitMediaStream" in w,
      "webkitSpeechGrammar" in w
    ]) >= 5;
  }
  function isWebKit() {
    var w = window;
    var n2 = navigator;
    return countTruthy([
      "ApplePayError" in w,
      "CSSPrimitiveValue" in w,
      "Counter" in w,
      n2.vendor.indexOf("Apple") === 0,
      "RGBColor" in w,
      "WebKitMediaKeys" in w
    ]) >= 4;
  }
  function isDesktopWebKit() {
    var w = window;
    var HTMLElement2 = w.HTMLElement, Document = w.Document;
    return countTruthy([
      "safari" in w,
      !("ongestureend" in w),
      !("TouchEvent" in w),
      !("orientation" in w),
      HTMLElement2 && !("autocapitalize" in HTMLElement2.prototype),
      Document && "pointerLockElement" in Document.prototype
    ]) >= 4;
  }
  function isSafariWebKit() {
    var w = window;
    return (
isFunctionNative(w.print) &&
String(w.browser) === "[object WebPageNamespace]"
    );
  }
  function isGecko() {
    var _a, _b;
    var w = window;
    return countTruthy([
      "buildID" in navigator,
      "MozAppearance" in ((_b = (_a = document.documentElement) === null || _a === void 0 ? void 0 : _a.style) !== null && _b !== void 0 ? _b : {}),
      "onmozfullscreenchange" in w,
      "mozInnerScreenX" in w,
      "CSSMozDocumentRule" in w,
      "CanvasCaptureMediaStream" in w
    ]) >= 4;
  }
  function isChromium86OrNewer() {
    var w = window;
    return countTruthy([
      !("MediaSettingsRange" in w),
      "RTCEncodedAudioFrame" in w,
      "" + w.Intl === "[object Intl]",
      "" + w.Reflect === "[object Reflect]"
    ]) >= 3;
  }
  function isChromium122OrNewer() {
    var w = window;
    var URLPattern = w.URLPattern;
    return countTruthy([
      "union" in Set.prototype,
      "Iterator" in w,
      URLPattern && "hasRegExpGroups" in URLPattern.prototype,
      "RGB8" in WebGLRenderingContext.prototype
    ]) >= 3;
  }
  function isWebKit606OrNewer() {
    var w = window;
    return countTruthy([
      "DOMRectList" in w,
      "RTCPeerConnectionIceEvent" in w,
      "SVGGeometryElement" in w,
      "ontransitioncancel" in w
    ]) >= 3;
  }
  function isWebKit616OrNewer() {
    var w = window;
    var n2 = navigator;
    var CSS2 = w.CSS, HTMLButtonElement2 = w.HTMLButtonElement;
    return countTruthy([
      !("getStorageUpdates" in n2),
      HTMLButtonElement2 && "popover" in HTMLButtonElement2.prototype,
      "CSSCounterStyleRule" in w,
      CSS2.supports("font-size-adjust: ex-height 0.5"),
      CSS2.supports("text-transform: full-width")
    ]) >= 4;
  }
  function isIPad() {
    if (navigator.platform === "iPad") {
      return true;
    }
    var s2 = screen;
    var screenRatio = s2.width / s2.height;
    return countTruthy([
"MediaSource" in window,
!!Element.prototype.webkitRequestFullscreen,

screenRatio > 0.65 && screenRatio < 1.53
    ]) >= 2;
  }
  function getFullscreenElement() {
    var d = document;
    return d.fullscreenElement || d.msFullscreenElement || d.mozFullScreenElement || d.webkitFullscreenElement || null;
  }
  function exitFullscreen() {
    var d = document;
    return (d.exitFullscreen || d.msExitFullscreen || d.mozCancelFullScreen || d.webkitExitFullscreen).call(d);
  }
  function isAndroid() {
    var isItChromium = isChromium();
    var isItGecko = isGecko();
    var w = window;
    var n2 = navigator;
    var c = "connection";
    if (isItChromium) {
      return countTruthy([
        !("SharedWorker" in w),


n2[c] && "ontypechange" in n2[c],
        !("sinkId" in new Audio())
      ]) >= 2;
    } else if (isItGecko) {
      return countTruthy(["onorientationchange" in w, "orientation" in w, /android/i.test(n2.appVersion)]) >= 2;
    } else {
      return false;
    }
  }
  function isSamsungInternet() {
    var n2 = navigator;
    var w = window;
    var audioPrototype = Audio.prototype;
    var visualViewport = w.visualViewport;
    return countTruthy([
      "srLatency" in audioPrototype,
      "srChannelCount" in audioPrototype,
      "devicePosture" in n2,
      visualViewport && "segments" in visualViewport,
      "getTextInformation" in Image.prototype
]) >= 3;
  }
  function getAudioFingerprint() {
    if (doesBrowserPerformAntifingerprinting$1()) {
      return -4;
    }
    return getUnstableAudioFingerprint();
  }
  function getUnstableAudioFingerprint() {
    var w = window;
    var AudioContext2 = w.OfflineAudioContext || w.webkitOfflineAudioContext;
    if (!AudioContext2) {
      return -2;
    }
    if (doesBrowserSuspendAudioContext()) {
      return -1;
    }
    var hashFromIndex = 4500;
    var hashToIndex = 5e3;
    var context = new AudioContext2(1, hashToIndex, 44100);
    var oscillator = context.createOscillator();
    oscillator.type = "triangle";
    oscillator.frequency.value = 1e4;
    var compressor = context.createDynamicsCompressor();
    compressor.threshold.value = -50;
    compressor.knee.value = 40;
    compressor.ratio.value = 12;
    compressor.attack.value = 0;
    compressor.release.value = 0.25;
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);
    var _a = startRenderingAudio(context), renderPromise = _a[0], finishRendering = _a[1];
    var fingerprintPromise = suppressUnhandledRejectionWarning(renderPromise.then(function(buffer) {
      return getHash(buffer.getChannelData(0).subarray(hashFromIndex));
    }, function(error2) {
      if (error2.name === "timeout" || error2.name === "suspended") {
        return -3;
      }
      throw error2;
    }));
    return function() {
      finishRendering();
      return fingerprintPromise;
    };
  }
  function doesBrowserSuspendAudioContext() {
    return isWebKit() && !isDesktopWebKit() && !isWebKit606OrNewer();
  }
  function doesBrowserPerformAntifingerprinting$1() {
    return (
isWebKit() && isWebKit616OrNewer() && isSafariWebKit() ||
isChromium() && isSamsungInternet() && isChromium122OrNewer()
    );
  }
  function startRenderingAudio(context) {
    var renderTryMaxCount = 3;
    var renderRetryDelay = 500;
    var runningMaxAwaitTime = 500;
    var runningSufficientTime = 5e3;
    var finalize = function() {
      return void 0;
    };
    var resultPromise = new Promise(function(resolve, reject) {
      var isFinalized = false;
      var renderTryCount = 0;
      var startedRunningAt = 0;
      context.oncomplete = function(event) {
        return resolve(event.renderedBuffer);
      };
      var startRunningTimeout = function() {
        setTimeout(function() {
          return reject(makeInnerError(
            "timeout"
));
        }, Math.min(runningMaxAwaitTime, startedRunningAt + runningSufficientTime - Date.now()));
      };
      var tryRender = function() {
        try {
          var renderingPromise = context.startRendering();
          if (isPromise(renderingPromise)) {
            suppressUnhandledRejectionWarning(renderingPromise);
          }
          switch (context.state) {
            case "running":
              startedRunningAt = Date.now();
              if (isFinalized) {
                startRunningTimeout();
              }
              break;


case "suspended":
              if (!document.hidden) {
                renderTryCount++;
              }
              if (isFinalized && renderTryCount >= renderTryMaxCount) {
                reject(makeInnerError(
                  "suspended"
));
              } else {
                setTimeout(tryRender, renderRetryDelay);
              }
              break;
          }
        } catch (error2) {
          reject(error2);
        }
      };
      tryRender();
      finalize = function() {
        if (!isFinalized) {
          isFinalized = true;
          if (startedRunningAt > 0) {
            startRunningTimeout();
          }
        }
      };
    });
    return [resultPromise, finalize];
  }
  function getHash(signal) {
    var hash = 0;
    for (var i2 = 0; i2 < signal.length; ++i2) {
      hash += Math.abs(signal[i2]);
    }
    return hash;
  }
  function makeInnerError(name) {
    var error2 = new Error(name);
    error2.name = name;
    return error2;
  }
  function withIframe(action, initialHtml, domPollInterval) {
    var _a, _b, _c;
    if (domPollInterval === void 0) {
      domPollInterval = 50;
    }
    return __awaiter(this, void 0, void 0, function() {
      var d, iframe;
      return __generator(this, function(_d) {
        switch (_d.label) {
          case 0:
            d = document;
            _d.label = 1;
          case 1:
            if (!!d.body) return [3, 3];
            return [4, wait(domPollInterval)];
          case 2:
            _d.sent();
            return [3, 1];
          case 3:
            iframe = d.createElement("iframe");
            _d.label = 4;
          case 4:
            _d.trys.push([4, , 10, 11]);
            return [4, new Promise(function(_resolve, _reject) {
              var isComplete = false;
              var resolve = function() {
                isComplete = true;
                _resolve();
              };
              var reject = function(error2) {
                isComplete = true;
                _reject(error2);
              };
              iframe.onload = resolve;
              iframe.onerror = reject;
              var style2 = iframe.style;
              style2.setProperty("display", "block", "important");
              style2.position = "absolute";
              style2.top = "0";
              style2.left = "0";
              style2.visibility = "hidden";
              if (initialHtml && "srcdoc" in iframe) {
                iframe.srcdoc = initialHtml;
              } else {
                iframe.src = "about:blank";
              }
              d.body.appendChild(iframe);
              var checkReadyState = function() {
                var _a2, _b2;
                if (isComplete) {
                  return;
                }
                if (((_b2 = (_a2 = iframe.contentWindow) === null || _a2 === void 0 ? void 0 : _a2.document) === null || _b2 === void 0 ? void 0 : _b2.readyState) === "complete") {
                  resolve();
                } else {
                  setTimeout(checkReadyState, 10);
                }
              };
              checkReadyState();
            })];
          case 5:
            _d.sent();
            _d.label = 6;
          case 6:
            if (!!((_b = (_a = iframe.contentWindow) === null || _a === void 0 ? void 0 : _a.document) === null || _b === void 0 ? void 0 : _b.body)) return [3, 8];
            return [4, wait(domPollInterval)];
          case 7:
            _d.sent();
            return [3, 6];
          case 8:
            return [4, action(iframe, iframe.contentWindow)];
          case 9:
            return [2, _d.sent()];
          case 10:
            (_c = iframe.parentNode) === null || _c === void 0 ? void 0 : _c.removeChild(iframe);
            return [
              7
];
          case 11:
            return [
              2
];
        }
      });
    });
  }
  function selectorToElement(selector) {
    var _a = parseSimpleCssSelector(selector), tag = _a[0], attributes = _a[1];
    var element = document.createElement(tag !== null && tag !== void 0 ? tag : "div");
    for (var _i = 0, _b = Object.keys(attributes); _i < _b.length; _i++) {
      var name_1 = _b[_i];
      var value = attributes[name_1].join(" ");
      if (name_1 === "style") {
        addStyleString(element.style, value);
      } else {
        element.setAttribute(name_1, value);
      }
    }
    return element;
  }
  function addStyleString(style2, source) {
    for (var _i = 0, _a = source.split(";"); _i < _a.length; _i++) {
      var property = _a[_i];
      var match = /^\s*([\w-]+)\s*:\s*(.+?)(\s*!([\w-]+))?\s*$/.exec(property);
      if (match) {
        var name_2 = match[1], value = match[2], priority = match[4];
        style2.setProperty(name_2, value, priority || "");
      }
    }
  }
  function isAnyParentCrossOrigin() {
    var currentWindow = window;
    for (; ; ) {
      var parentWindow = currentWindow.parent;
      if (!parentWindow || parentWindow === currentWindow) {
        return false;
      }
      try {
        if (parentWindow.location.origin !== currentWindow.location.origin) {
          return true;
        }
      } catch (error2) {
        if (error2 instanceof Error && error2.name === "SecurityError") {
          return true;
        }
        throw error2;
      }
      currentWindow = parentWindow;
    }
  }
  var testString = "mmMwWLliI0O&1";
  var textSize = "48px";
  var baseFonts = ["monospace", "sans-serif", "serif"];
  var fontList = [
"sans-serif-thin",
    "ARNO PRO",
    "Agency FB",
    "Arabic Typesetting",
    "Arial Unicode MS",
    "AvantGarde Bk BT",
    "BankGothic Md BT",
    "Batang",
    "Bitstream Vera Sans Mono",
    "Calibri",
    "Century",
    "Century Gothic",
    "Clarendon",
    "EUROSTILE",
    "Franklin Gothic",
    "Futura Bk BT",
    "Futura Md BT",
    "GOTHAM",
    "Gill Sans",
    "HELV",
    "Haettenschweiler",
    "Helvetica Neue",
    "Humanst521 BT",
    "Leelawadee",
    "Letter Gothic",
    "Levenim MT",
    "Lucida Bright",
    "Lucida Sans",
    "Menlo",
    "MS Mincho",
    "MS Outlook",
    "MS Reference Specialty",
    "MS UI Gothic",
    "MT Extra",
    "MYRIAD PRO",
    "Marlett",
    "Meiryo UI",
    "Microsoft Uighur",
    "Minion Pro",
    "Monotype Corsiva",
    "PMingLiU",
    "Pristina",
    "SCRIPTINA",
    "Segoe UI Light",
    "Serifa",
    "SimHei",
    "Small Fonts",
    "Staccato222 BT",
    "TRAJAN PRO",
    "Univers CE 55 Medium",
    "Vrinda",
    "ZWAdobeF"
  ];
  function getFonts() {
    var _this = this;
    return withIframe(function(_, _a) {
      var document2 = _a.document;
      return __awaiter(_this, void 0, void 0, function() {
        var holder, spansContainer, defaultWidth, defaultHeight, createSpan, createSpanWithFonts, initializeBaseFontsSpans, initializeFontsSpans, isFontAvailable, baseFontsSpans, fontsSpans, index2;
        return __generator(this, function(_b) {
          holder = document2.body;
          holder.style.fontSize = textSize;
          spansContainer = document2.createElement("div");
          spansContainer.style.setProperty("visibility", "hidden", "important");
          defaultWidth = {};
          defaultHeight = {};
          createSpan = function(fontFamily) {
            var span = document2.createElement("span");
            var style2 = span.style;
            style2.position = "absolute";
            style2.top = "0";
            style2.left = "0";
            style2.fontFamily = fontFamily;
            span.textContent = testString;
            spansContainer.appendChild(span);
            return span;
          };
          createSpanWithFonts = function(fontToDetect, baseFont) {
            return createSpan("'".concat(fontToDetect, "',").concat(baseFont));
          };
          initializeBaseFontsSpans = function() {
            return baseFonts.map(createSpan);
          };
          initializeFontsSpans = function() {
            var spans = {};
            var _loop_1 = function(font2) {
              spans[font2] = baseFonts.map(function(baseFont) {
                return createSpanWithFonts(font2, baseFont);
              });
            };
            for (var _i = 0, fontList_1 = fontList; _i < fontList_1.length; _i++) {
              var font = fontList_1[_i];
              _loop_1(font);
            }
            return spans;
          };
          isFontAvailable = function(fontSpans) {
            return baseFonts.some(function(baseFont, baseFontIndex) {
              return fontSpans[baseFontIndex].offsetWidth !== defaultWidth[baseFont] || fontSpans[baseFontIndex].offsetHeight !== defaultHeight[baseFont];
            });
          };
          baseFontsSpans = initializeBaseFontsSpans();
          fontsSpans = initializeFontsSpans();
          holder.appendChild(spansContainer);
          for (index2 = 0; index2 < baseFonts.length; index2++) {
            defaultWidth[baseFonts[index2]] = baseFontsSpans[index2].offsetWidth;
            defaultHeight[baseFonts[index2]] = baseFontsSpans[index2].offsetHeight;
          }
          return [2, fontList.filter(function(font) {
            return isFontAvailable(fontsSpans[font]);
          })];
        });
      });
    });
  }
  function getPlugins() {
    var rawPlugins = navigator.plugins;
    if (!rawPlugins) {
      return void 0;
    }
    var plugins = [];
    for (var i2 = 0; i2 < rawPlugins.length; ++i2) {
      var plugin = rawPlugins[i2];
      if (!plugin) {
        continue;
      }
      var mimeTypes = [];
      for (var j = 0; j < plugin.length; ++j) {
        var mimeType = plugin[j];
        mimeTypes.push({
          type: mimeType.type,
          suffixes: mimeType.suffixes
        });
      }
      plugins.push({
        name: plugin.name,
        description: plugin.description,
        mimeTypes
      });
    }
    return plugins;
  }
  function getCanvasFingerprint() {
    return getUnstableCanvasFingerprint(doesBrowserPerformAntifingerprinting());
  }
  function getUnstableCanvasFingerprint(skipImages) {
    var _a;
    var winding = false;
    var geometry;
    var text;
    var _b = makeCanvasContext(), canvas = _b[0], context = _b[1];
    if (!isSupported(canvas, context)) {
      geometry = text = "unsupported";
    } else {
      winding = doesSupportWinding(context);
      if (skipImages) {
        geometry = text = "skipped";
      } else {
        _a = renderImages(canvas, context), geometry = _a[0], text = _a[1];
      }
    }
    return { winding, geometry, text };
  }
  function makeCanvasContext() {
    var canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    return [canvas, canvas.getContext("2d")];
  }
  function isSupported(canvas, context) {
    return !!(context && canvas.toDataURL);
  }
  function doesSupportWinding(context) {
    context.rect(0, 0, 10, 10);
    context.rect(2, 2, 6, 6);
    return !context.isPointInPath(5, 5, "evenodd");
  }
  function renderImages(canvas, context) {
    renderTextImage(canvas, context);
    var textImage1 = canvasToString(canvas);
    var textImage2 = canvasToString(canvas);
    if (textImage1 !== textImage2) {
      return [
        "unstable",
        "unstable"
];
    }
    renderGeometryImage(canvas, context);
    var geometryImage = canvasToString(canvas);
    return [geometryImage, textImage1];
  }
  function renderTextImage(canvas, context) {
    canvas.width = 240;
    canvas.height = 60;
    context.textBaseline = "alphabetic";
    context.fillStyle = "#f60";
    context.fillRect(100, 1, 62, 20);
    context.fillStyle = "#069";
    context.font = '11pt "Times New Roman"';
    var printedText = "Cwm fjordbank gly ".concat(
      String.fromCharCode(55357, 56835)
);
    context.fillText(printedText, 2, 15);
    context.fillStyle = "rgba(102, 204, 0, 0.2)";
    context.font = "18pt Arial";
    context.fillText(printedText, 4, 45);
  }
  function renderGeometryImage(canvas, context) {
    canvas.width = 122;
    canvas.height = 110;
    context.globalCompositeOperation = "multiply";
    for (var _i = 0, _a = [
      ["#f2f", 40, 40],
      ["#2ff", 80, 40],
      ["#ff2", 60, 80]
    ]; _i < _a.length; _i++) {
      var _b = _a[_i], color2 = _b[0], x2 = _b[1], y = _b[2];
      context.fillStyle = color2;
      context.beginPath();
      context.arc(x2, y, 40, 0, Math.PI * 2, true);
      context.closePath();
      context.fill();
    }
    context.fillStyle = "#f9c";
    context.arc(60, 60, 60, 0, Math.PI * 2, true);
    context.arc(60, 60, 20, 0, Math.PI * 2, true);
    context.fill("evenodd");
  }
  function canvasToString(canvas) {
    return canvas.toDataURL();
  }
  function doesBrowserPerformAntifingerprinting() {
    return isWebKit() && isWebKit616OrNewer() && isSafariWebKit();
  }
  function getTouchSupport() {
    var n2 = navigator;
    var maxTouchPoints = 0;
    var touchEvent;
    if (n2.maxTouchPoints !== void 0) {
      maxTouchPoints = toInt(n2.maxTouchPoints);
    } else if (n2.msMaxTouchPoints !== void 0) {
      maxTouchPoints = n2.msMaxTouchPoints;
    }
    try {
      document.createEvent("TouchEvent");
      touchEvent = true;
    } catch (_a) {
      touchEvent = false;
    }
    var touchStart = "ontouchstart" in window;
    return {
      maxTouchPoints,
      touchEvent,
      touchStart
    };
  }
  function getOsCpu() {
    return navigator.oscpu;
  }
  function getLanguages() {
    var n2 = navigator;
    var result = [];
    var language = n2.language || n2.userLanguage || n2.browserLanguage || n2.systemLanguage;
    if (language !== void 0) {
      result.push([language]);
    }
    if (Array.isArray(n2.languages)) {
      if (!(isChromium() && isChromium86OrNewer())) {
        result.push(n2.languages);
      }
    } else if (typeof n2.languages === "string") {
      var languages = n2.languages;
      if (languages) {
        result.push(languages.split(","));
      }
    }
    return result;
  }
  function getColorDepth() {
    return window.screen.colorDepth;
  }
  function getDeviceMemory() {
    return replaceNaN(toFloat(navigator.deviceMemory), void 0);
  }
  function getScreenResolution() {
    if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
      return void 0;
    }
    return getUnstableScreenResolution();
  }
  function getUnstableScreenResolution() {
    var s2 = screen;
    var parseDimension = function(value) {
      return replaceNaN(toInt(value), null);
    };
    var dimensions = [parseDimension(s2.width), parseDimension(s2.height)];
    dimensions.sort().reverse();
    return dimensions;
  }
  var screenFrameCheckInterval = 2500;
  var roundingPrecision = 10;
  var screenFrameBackup;
  var screenFrameSizeTimeoutId;
  function watchScreenFrame() {
    if (screenFrameSizeTimeoutId !== void 0) {
      return;
    }
    var checkScreenFrame = function() {
      var frameSize = getCurrentScreenFrame();
      if (isFrameSizeNull(frameSize)) {
        screenFrameSizeTimeoutId = setTimeout(checkScreenFrame, screenFrameCheckInterval);
      } else {
        screenFrameBackup = frameSize;
        screenFrameSizeTimeoutId = void 0;
      }
    };
    checkScreenFrame();
  }
  function getUnstableScreenFrame() {
    var _this = this;
    watchScreenFrame();
    return function() {
      return __awaiter(_this, void 0, void 0, function() {
        var frameSize;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              frameSize = getCurrentScreenFrame();
              if (!isFrameSizeNull(frameSize)) return [3, 2];
              if (screenFrameBackup) {
                return [2, __spreadArray([], screenFrameBackup)];
              }
              if (!getFullscreenElement()) return [3, 2];
              return [4, exitFullscreen()];
            case 1:
              _a.sent();
              frameSize = getCurrentScreenFrame();
              _a.label = 2;
            case 2:
              if (!isFrameSizeNull(frameSize)) {
                screenFrameBackup = frameSize;
              }
              return [2, frameSize];
          }
        });
      });
    };
  }
  function getScreenFrame() {
    var _this = this;
    if (isWebKit() && isWebKit616OrNewer() && isSafariWebKit()) {
      return function() {
        return Promise.resolve(void 0);
      };
    }
    var screenFrameGetter = getUnstableScreenFrame();
    return function() {
      return __awaiter(_this, void 0, void 0, function() {
        var frameSize, processSize;
        return __generator(this, function(_a) {
          switch (_a.label) {
            case 0:
              return [4, screenFrameGetter()];
            case 1:
              frameSize = _a.sent();
              processSize = function(sideSize) {
                return sideSize === null ? null : round(sideSize, roundingPrecision);
              };
              return [2, [processSize(frameSize[0]), processSize(frameSize[1]), processSize(frameSize[2]), processSize(frameSize[3])]];
          }
        });
      });
    };
  }
  function getCurrentScreenFrame() {
    var s2 = screen;
    return [
      replaceNaN(toFloat(s2.availTop), null),
      replaceNaN(toFloat(s2.width) - toFloat(s2.availWidth) - replaceNaN(toFloat(s2.availLeft), 0), null),
      replaceNaN(toFloat(s2.height) - toFloat(s2.availHeight) - replaceNaN(toFloat(s2.availTop), 0), null),
      replaceNaN(toFloat(s2.availLeft), null)
    ];
  }
  function isFrameSizeNull(frameSize) {
    for (var i2 = 0; i2 < 4; ++i2) {
      if (frameSize[i2]) {
        return false;
      }
    }
    return true;
  }
  function getHardwareConcurrency() {
    return replaceNaN(toInt(navigator.hardwareConcurrency), void 0);
  }
  function getTimezone() {
    var _a;
    var DateTimeFormat = (_a = window.Intl) === null || _a === void 0 ? void 0 : _a.DateTimeFormat;
    if (DateTimeFormat) {
      var timezone = new DateTimeFormat().resolvedOptions().timeZone;
      if (timezone) {
        return timezone;
      }
    }
    var offset2 = -getTimezoneOffset();
    return "UTC".concat(offset2 >= 0 ? "+" : "").concat(offset2);
  }
  function getTimezoneOffset() {
    var currentYear = ( new Date()).getFullYear();
    return Math.max(
toFloat(new Date(currentYear, 0, 1).getTimezoneOffset()),
      toFloat(new Date(currentYear, 6, 1).getTimezoneOffset())
    );
  }
  function getSessionStorage() {
    try {
      return !!window.sessionStorage;
    } catch (error2) {
      return true;
    }
  }
  function getLocalStorage() {
    try {
      return !!window.localStorage;
    } catch (e) {
      return true;
    }
  }
  function getIndexedDB() {
    if (isTrident() || isEdgeHTML()) {
      return void 0;
    }
    try {
      return !!window.indexedDB;
    } catch (e) {
      return true;
    }
  }
  function getOpenDatabase() {
    return !!window.openDatabase;
  }
  function getCpuClass() {
    return navigator.cpuClass;
  }
  function getPlatform() {
    var platform2 = navigator.platform;
    if (platform2 === "MacIntel") {
      if (isWebKit() && !isDesktopWebKit()) {
        return isIPad() ? "iPad" : "iPhone";
      }
    }
    return platform2;
  }
  function getVendor() {
    return navigator.vendor || "";
  }
  function getVendorFlavors() {
    var flavors = [];
    for (var _i = 0, _a = [
"chrome",
"safari",
"__crWeb",
      "__gCrWeb",
"yandex",
"__yb",
      "__ybro",
"__firefox__",
"__edgeTrackingPreventionStatistics",
      "webkit",
"oprt",
"samsungAr",
"ucweb",
      "UCShellJava",
"puffinDevice"

]; _i < _a.length; _i++) {
      var key = _a[_i];
      var value = window[key];
      if (value && typeof value === "object") {
        flavors.push(key);
      }
    }
    return flavors.sort();
  }
  function areCookiesEnabled() {
    var d = document;
    try {
      d.cookie = "cookietest=1; SameSite=Strict;";
      var result = d.cookie.indexOf("cookietest=") !== -1;
      d.cookie = "cookietest=1; SameSite=Strict; expires=Thu, 01-Jan-1970 00:00:01 GMT";
      return result;
    } catch (e) {
      return false;
    }
  }
  function getFilters() {
    var fromB64 = atob;
    return {
      abpIndo: [
        "#Iklan-Melayang",
        "#Kolom-Iklan-728",
        "#SidebarIklan-wrapper",
        '[title="ALIENBOLA" i]',
        fromB64("I0JveC1CYW5uZXItYWRz")
      ],
      abpvn: [".quangcao", "#mobileCatfish", fromB64("LmNsb3NlLWFkcw=="), '[id^="bn_bottom_fixed_"]', "#pmadv"],
      adBlockFinland: [
        ".mainostila",
        fromB64("LnNwb25zb3JpdA=="),
        ".ylamainos",
        fromB64("YVtocmVmKj0iL2NsaWNrdGhyZ2guYXNwPyJd"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9hcHAucmVhZHBlYWsuY29tL2FkcyJd")
      ],
      adBlockPersian: [
        "#navbar_notice_50",
        ".kadr",
        'TABLE[width="140px"]',
        "#divAgahi",
        fromB64("YVtocmVmXj0iaHR0cDovL2cxLnYuZndtcm0ubmV0L2FkLyJd")
      ],
      adBlockWarningRemoval: [
        "#adblock-honeypot",
        ".adblocker-root",
        ".wp_adblock_detect",
        fromB64("LmhlYWRlci1ibG9ja2VkLWFk"),
        fromB64("I2FkX2Jsb2NrZXI=")
      ],
      adGuardAnnoyances: [
        ".hs-sosyal",
        "#cookieconsentdiv",
        'div[class^="app_gdpr"]',
        ".as-oil",
        '[data-cypress="soft-push-notification-modal"]'
      ],
      adGuardBase: [
        ".BetterJsPopOverlay",
        fromB64("I2FkXzMwMFgyNTA="),
        fromB64("I2Jhbm5lcmZsb2F0MjI="),
        fromB64("I2NhbXBhaWduLWJhbm5lcg=="),
        fromB64("I0FkLUNvbnRlbnQ=")
      ],
      adGuardChinese: [
        fromB64("LlppX2FkX2FfSA=="),
        fromB64("YVtocmVmKj0iLmh0aGJldDM0LmNvbSJd"),
        "#widget-quan",
        fromB64("YVtocmVmKj0iLzg0OTkyMDIwLnh5eiJd"),
        fromB64("YVtocmVmKj0iLjE5NTZobC5jb20vIl0=")
      ],
      adGuardFrench: [
        "#pavePub",
        fromB64("LmFkLWRlc2t0b3AtcmVjdGFuZ2xl"),
        ".mobile_adhesion",
        ".widgetadv",
        fromB64("LmFkc19iYW4=")
      ],
      adGuardGerman: ['aside[data-portal-id="leaderboard"]'],
      adGuardJapanese: [
        "#kauli_yad_1",
        fromB64("YVtocmVmXj0iaHR0cDovL2FkMi50cmFmZmljZ2F0ZS5uZXQvIl0="),
        fromB64("Ll9wb3BJbl9pbmZpbml0ZV9hZA=="),
        fromB64("LmFkZ29vZ2xl"),
        fromB64("Ll9faXNib29zdFJldHVybkFk")
      ],
      adGuardMobile: [
        fromB64("YW1wLWF1dG8tYWRz"),
        fromB64("LmFtcF9hZA=="),
        'amp-embed[type="24smi"]',
        "#mgid_iframe1",
        fromB64("I2FkX2ludmlld19hcmVh")
      ],
      adGuardRussian: [
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9hZC5sZXRtZWFkcy5jb20vIl0="),
        fromB64("LnJlY2xhbWE="),
        'div[id^="smi2adblock"]',
        fromB64("ZGl2W2lkXj0iQWRGb3hfYmFubmVyXyJd"),
        "#psyduckpockeball"
      ],
      adGuardSocial: [
        fromB64("YVtocmVmXj0iLy93d3cuc3R1bWJsZXVwb24uY29tL3N1Ym1pdD91cmw9Il0="),
        fromB64("YVtocmVmXj0iLy90ZWxlZ3JhbS5tZS9zaGFyZS91cmw/Il0="),
        ".etsy-tweet",
        "#inlineShare",
        ".popup-social"
      ],
      adGuardSpanishPortuguese: ["#barraPublicidade", "#Publicidade", "#publiEspecial", "#queTooltip", ".cnt-publi"],
      adGuardTrackingProtection: [
        "#qoo-counter",
        fromB64("YVtocmVmXj0iaHR0cDovL2NsaWNrLmhvdGxvZy5ydS8iXQ=="),
        fromB64("YVtocmVmXj0iaHR0cDovL2hpdGNvdW50ZXIucnUvdG9wL3N0YXQucGhwIl0="),
        fromB64("YVtocmVmXj0iaHR0cDovL3RvcC5tYWlsLnJ1L2p1bXAiXQ=="),
        "#top100counter"
      ],
      adGuardTurkish: [
        "#backkapat",
        fromB64("I3Jla2xhbWk="),
        fromB64("YVtocmVmXj0iaHR0cDovL2Fkc2Vydi5vbnRlay5jb20udHIvIl0="),
        fromB64("YVtocmVmXj0iaHR0cDovL2l6bGVuemkuY29tL2NhbXBhaWduLyJd"),
        fromB64("YVtocmVmXj0iaHR0cDovL3d3dy5pbnN0YWxsYWRzLm5ldC8iXQ==")
      ],
      bulgarian: [fromB64("dGQjZnJlZW5ldF90YWJsZV9hZHM="), "#ea_intext_div", ".lapni-pop-over", "#xenium_hot_offers"],
      easyList: [
        ".yb-floorad",
        fromB64("LndpZGdldF9wb19hZHNfd2lkZ2V0"),
        fromB64("LnRyYWZmaWNqdW5reS1hZA=="),
        ".textad_headline",
        fromB64("LnNwb25zb3JlZC10ZXh0LWxpbmtz")
      ],
      easyListChina: [
        fromB64("LmFwcGd1aWRlLXdyYXBbb25jbGljayo9ImJjZWJvcy5jb20iXQ=="),
        fromB64("LmZyb250cGFnZUFkdk0="),
        "#taotaole",
        "#aafoot.top_box",
        ".cfa_popup"
      ],
      easyListCookie: [
        ".ezmob-footer",
        ".cc-CookieWarning",
        "[data-cookie-number]",
        fromB64("LmF3LWNvb2tpZS1iYW5uZXI="),
        ".sygnal24-gdpr-modal-wrap"
      ],
      easyListCzechSlovak: [
        "#onlajny-stickers",
        fromB64("I3Jla2xhbW5pLWJveA=="),
        fromB64("LnJla2xhbWEtbWVnYWJvYXJk"),
        ".sklik",
        fromB64("W2lkXj0ic2tsaWtSZWtsYW1hIl0=")
      ],
      easyListDutch: [
        fromB64("I2FkdmVydGVudGll"),
        fromB64("I3ZpcEFkbWFya3RCYW5uZXJCbG9jaw=="),
        ".adstekst",
        fromB64("YVtocmVmXj0iaHR0cHM6Ly94bHR1YmUubmwvY2xpY2svIl0="),
        "#semilo-lrectangle"
      ],
      easyListGermany: [
        "#SSpotIMPopSlider",
        fromB64("LnNwb25zb3JsaW5rZ3J1ZW4="),
        fromB64("I3dlcmJ1bmdza3k="),
        fromB64("I3Jla2xhbWUtcmVjaHRzLW1pdHRl"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9iZDc0Mi5jb20vIl0=")
      ],
      easyListItaly: [
        fromB64("LmJveF9hZHZfYW5udW5jaQ=="),
        ".sb-box-pubbliredazionale",
        fromB64("YVtocmVmXj0iaHR0cDovL2FmZmlsaWF6aW9uaWFkcy5zbmFpLml0LyJd"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9hZHNlcnZlci5odG1sLml0LyJd"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9hZmZpbGlhemlvbmlhZHMuc25haS5pdC8iXQ==")
      ],
      easyListLithuania: [
        fromB64("LnJla2xhbW9zX3RhcnBhcw=="),
        fromB64("LnJla2xhbW9zX251b3JvZG9z"),
        fromB64("aW1nW2FsdD0iUmVrbGFtaW5pcyBza3lkZWxpcyJd"),
        fromB64("aW1nW2FsdD0iRGVkaWt1b3RpLmx0IHNlcnZlcmlhaSJd"),
        fromB64("aW1nW2FsdD0iSG9zdGluZ2FzIFNlcnZlcmlhaS5sdCJd")
      ],
      estonian: [fromB64("QVtocmVmKj0iaHR0cDovL3BheTRyZXN1bHRzMjQuZXUiXQ==")],
      fanboyAnnoyances: ["#ac-lre-player", ".navigate-to-top", "#subscribe_popup", ".newsletter_holder", "#back-top"],
      fanboyAntiFacebook: [".util-bar-module-firefly-visible"],
      fanboyEnhancedTrackers: [
        ".open.pushModal",
        "#issuem-leaky-paywall-articles-zero-remaining-nag",
        "#sovrn_container",
        'div[class$="-hide"][zoompage-fontsize][style="display: block;"]',
        ".BlockNag__Card"
      ],
      fanboySocial: ["#FollowUs", "#meteored_share", "#social_follow", ".article-sharer", ".community__social-desc"],
      frellwitSwedish: [
        fromB64("YVtocmVmKj0iY2FzaW5vcHJvLnNlIl1bdGFyZ2V0PSJfYmxhbmsiXQ=="),
        fromB64("YVtocmVmKj0iZG9rdG9yLXNlLm9uZWxpbmsubWUiXQ=="),
        "article.category-samarbete",
        fromB64("ZGl2LmhvbGlkQWRz"),
        "ul.adsmodern"
      ],
      greekAdBlock: [
        fromB64("QVtocmVmKj0iYWRtYW4ub3RlbmV0LmdyL2NsaWNrPyJd"),
        fromB64("QVtocmVmKj0iaHR0cDovL2F4aWFiYW5uZXJzLmV4b2R1cy5nci8iXQ=="),
        fromB64("QVtocmVmKj0iaHR0cDovL2ludGVyYWN0aXZlLmZvcnRobmV0LmdyL2NsaWNrPyJd"),
        "DIV.agores300",
        "TABLE.advright"
      ],
      hungarian: [
        "#cemp_doboz",
        ".optimonk-iframe-container",
        fromB64("LmFkX19tYWlu"),
        fromB64("W2NsYXNzKj0iR29vZ2xlQWRzIl0="),
        "#hirdetesek_box"
      ],
      iDontCareAboutCookies: [
        '.alert-info[data-block-track*="CookieNotice"]',
        ".ModuleTemplateCookieIndicator",
        ".o--cookies--container",
        "#cookies-policy-sticky",
        "#stickyCookieBar"
      ],
      icelandicAbp: [fromB64("QVtocmVmXj0iL2ZyYW1ld29yay9yZXNvdXJjZXMvZm9ybXMvYWRzLmFzcHgiXQ==")],
      latvian: [
        fromB64("YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiAxMjBweDsgaGVpZ2h0OiA0MHB4OyBvdmVyZmxvdzogaGlkZGVuOyBwb3NpdGlvbjogcmVsYXRpdmU7Il0="),
        fromB64("YVtocmVmPSJodHRwOi8vd3d3LnNhbGlkemluaS5sdi8iXVtzdHlsZT0iZGlzcGxheTogYmxvY2s7IHdpZHRoOiA4OHB4OyBoZWlnaHQ6IDMxcHg7IG92ZXJmbG93OiBoaWRkZW47IHBvc2l0aW9uOiByZWxhdGl2ZTsiXQ==")
      ],
      listKr: [
        fromB64("YVtocmVmKj0iLy9hZC5wbGFuYnBsdXMuY28ua3IvIl0="),
        fromB64("I2xpdmVyZUFkV3JhcHBlcg=="),
        fromB64("YVtocmVmKj0iLy9hZHYuaW1hZHJlcC5jby5rci8iXQ=="),
        fromB64("aW5zLmZhc3R2aWV3LWFk"),
        ".revenue_unit_item.dable"
      ],
      listeAr: [
        fromB64("LmdlbWluaUxCMUFk"),
        ".right-and-left-sponsers",
        fromB64("YVtocmVmKj0iLmFmbGFtLmluZm8iXQ=="),
        fromB64("YVtocmVmKj0iYm9vcmFxLm9yZyJd"),
        fromB64("YVtocmVmKj0iZHViaXp6bGUuY29tL2FyLz91dG1fc291cmNlPSJd")
      ],
      listeFr: [
        fromB64("YVtocmVmXj0iaHR0cDovL3Byb21vLnZhZG9yLmNvbS8iXQ=="),
        fromB64("I2FkY29udGFpbmVyX3JlY2hlcmNoZQ=="),
        fromB64("YVtocmVmKj0id2Vib3JhbWEuZnIvZmNnaS1iaW4vIl0="),
        ".site-pub-interstitiel",
        'div[id^="crt-"][data-criteo-id]'
      ],
      officialPolish: [
        "#ceneo-placeholder-ceneo-12",
        fromB64("W2hyZWZePSJodHRwczovL2FmZi5zZW5kaHViLnBsLyJd"),
        fromB64("YVtocmVmXj0iaHR0cDovL2Fkdm1hbmFnZXIudGVjaGZ1bi5wbC9yZWRpcmVjdC8iXQ=="),
        fromB64("YVtocmVmXj0iaHR0cDovL3d3dy50cml6ZXIucGwvP3V0bV9zb3VyY2UiXQ=="),
        fromB64("ZGl2I3NrYXBpZWNfYWQ=")
      ],
      ro: [
        fromB64("YVtocmVmXj0iLy9hZmZ0cmsuYWx0ZXgucm8vQ291bnRlci9DbGljayJd"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9ibGFja2ZyaWRheXNhbGVzLnJvL3Ryay9zaG9wLyJd"),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9ldmVudC4ycGVyZm9ybWFudC5jb20vZXZlbnRzL2NsaWNrIl0="),
        fromB64("YVtocmVmXj0iaHR0cHM6Ly9sLnByb2ZpdHNoYXJlLnJvLyJd"),
        'a[href^="/url/"]'
      ],
      ruAd: [
        fromB64("YVtocmVmKj0iLy9mZWJyYXJlLnJ1LyJd"),
        fromB64("YVtocmVmKj0iLy91dGltZy5ydS8iXQ=="),
        fromB64("YVtocmVmKj0iOi8vY2hpa2lkaWtpLnJ1Il0="),
        "#pgeldiz",
        ".yandex-rtb-block"
      ],
      thaiAds: [
        "a[href*=macau-uta-popup]",
        fromB64("I2Fkcy1nb29nbGUtbWlkZGxlX3JlY3RhbmdsZS1ncm91cA=="),
        fromB64("LmFkczMwMHM="),
        ".bumq",
        ".img-kosana"
      ],
      webAnnoyancesUltralist: [
        "#mod-social-share-2",
        "#social-tools",
        fromB64("LmN0cGwtZnVsbGJhbm5lcg=="),
        ".zergnet-recommend",
        ".yt.btn-link.btn-md.btn"
      ]
    };
  }
  function getDomBlockers(_a) {
    var _b = _a === void 0 ? {} : _a, debug = _b.debug;
    return __awaiter(this, void 0, void 0, function() {
      var filters, filterNames, allSelectors, blockedSelectors, activeBlockers;
      var _c;
      return __generator(this, function(_d) {
        switch (_d.label) {
          case 0:
            if (!isApplicable()) {
              return [2, void 0];
            }
            filters = getFilters();
            filterNames = Object.keys(filters);
            allSelectors = (_c = []).concat.apply(_c, filterNames.map(function(filterName) {
              return filters[filterName];
            }));
            return [4, getBlockedSelectors(allSelectors)];
          case 1:
            blockedSelectors = _d.sent();
            if (debug) {
              printDebug(filters, blockedSelectors);
            }
            activeBlockers = filterNames.filter(function(filterName) {
              var selectors = filters[filterName];
              var blockedCount = countTruthy(selectors.map(function(selector) {
                return blockedSelectors[selector];
              }));
              return blockedCount > selectors.length * 0.6;
            });
            activeBlockers.sort();
            return [2, activeBlockers];
        }
      });
    });
  }
  function isApplicable() {
    return isWebKit() || isAndroid();
  }
  function getBlockedSelectors(selectors) {
    var _a;
    return __awaiter(this, void 0, void 0, function() {
      var d, root, elements, blockedSelectors, i2, element, holder, i2;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            d = document;
            root = d.createElement("div");
            elements = new Array(selectors.length);
            blockedSelectors = {};
            forceShow(root);
            for (i2 = 0; i2 < selectors.length; ++i2) {
              element = selectorToElement(selectors[i2]);
              if (element.tagName === "DIALOG") {
                element.show();
              }
              holder = d.createElement("div");
              forceShow(holder);
              holder.appendChild(element);
              root.appendChild(holder);
              elements[i2] = element;
            }
            _b.label = 1;
          case 1:
            if (!!d.body) return [3, 3];
            return [4, wait(50)];
          case 2:
            _b.sent();
            return [3, 1];
          case 3:
            d.body.appendChild(root);
            try {
              for (i2 = 0; i2 < selectors.length; ++i2) {
                if (!elements[i2].offsetParent) {
                  blockedSelectors[selectors[i2]] = true;
                }
              }
            } finally {
              (_a = root.parentNode) === null || _a === void 0 ? void 0 : _a.removeChild(root);
            }
            return [2, blockedSelectors];
        }
      });
    });
  }
  function forceShow(element) {
    element.style.setProperty("visibility", "hidden", "important");
    element.style.setProperty("display", "block", "important");
  }
  function printDebug(filters, blockedSelectors) {
    var message = "DOM blockers debug:\n```";
    for (var _i = 0, _a = Object.keys(filters); _i < _a.length; _i++) {
      var filterName = _a[_i];
      message += "\n".concat(filterName, ":");
      for (var _b = 0, _c = filters[filterName]; _b < _c.length; _b++) {
        var selector = _c[_b];
        message += "\n  ".concat(blockedSelectors[selector] ? "🚫" : "➡️", " ").concat(selector);
      }
    }
    console.log("".concat(message, "\n```"));
  }
  function getColorGamut() {
    for (var _i = 0, _a = ["rec2020", "p3", "srgb"]; _i < _a.length; _i++) {
      var gamut = _a[_i];
      if (matchMedia("(color-gamut: ".concat(gamut, ")")).matches) {
        return gamut;
      }
    }
    return void 0;
  }
  function areColorsInverted() {
    if (doesMatch$5("inverted")) {
      return true;
    }
    if (doesMatch$5("none")) {
      return false;
    }
    return void 0;
  }
  function doesMatch$5(value) {
    return matchMedia("(inverted-colors: ".concat(value, ")")).matches;
  }
  function areColorsForced() {
    if (doesMatch$4("active")) {
      return true;
    }
    if (doesMatch$4("none")) {
      return false;
    }
    return void 0;
  }
  function doesMatch$4(value) {
    return matchMedia("(forced-colors: ".concat(value, ")")).matches;
  }
  var maxValueToCheck = 100;
  function getMonochromeDepth() {
    if (!matchMedia("(min-monochrome: 0)").matches) {
      return void 0;
    }
    for (var i2 = 0; i2 <= maxValueToCheck; ++i2) {
      if (matchMedia("(max-monochrome: ".concat(i2, ")")).matches) {
        return i2;
      }
    }
    throw new Error("Too high value");
  }
  function getContrastPreference() {
    if (doesMatch$3("no-preference")) {
      return 0;
    }
    if (doesMatch$3("high") || doesMatch$3("more")) {
      return 1;
    }
    if (doesMatch$3("low") || doesMatch$3("less")) {
      return -1;
    }
    if (doesMatch$3("forced")) {
      return 10;
    }
    return void 0;
  }
  function doesMatch$3(value) {
    return matchMedia("(prefers-contrast: ".concat(value, ")")).matches;
  }
  function isMotionReduced() {
    if (doesMatch$2("reduce")) {
      return true;
    }
    if (doesMatch$2("no-preference")) {
      return false;
    }
    return void 0;
  }
  function doesMatch$2(value) {
    return matchMedia("(prefers-reduced-motion: ".concat(value, ")")).matches;
  }
  function isTransparencyReduced() {
    if (doesMatch$1("reduce")) {
      return true;
    }
    if (doesMatch$1("no-preference")) {
      return false;
    }
    return void 0;
  }
  function doesMatch$1(value) {
    return matchMedia("(prefers-reduced-transparency: ".concat(value, ")")).matches;
  }
  function isHDR() {
    if (doesMatch("high")) {
      return true;
    }
    if (doesMatch("standard")) {
      return false;
    }
    return void 0;
  }
  function doesMatch(value) {
    return matchMedia("(dynamic-range: ".concat(value, ")")).matches;
  }
  var M$2 = Math;
  var fallbackFn = function() {
    return 0;
  };
  function getMathFingerprint() {
    var acos = M$2.acos || fallbackFn;
    var acosh = M$2.acosh || fallbackFn;
    var asin = M$2.asin || fallbackFn;
    var asinh = M$2.asinh || fallbackFn;
    var atanh = M$2.atanh || fallbackFn;
    var atan = M$2.atan || fallbackFn;
    var sin = M$2.sin || fallbackFn;
    var sinh = M$2.sinh || fallbackFn;
    var cos = M$2.cos || fallbackFn;
    var cosh = M$2.cosh || fallbackFn;
    var tan = M$2.tan || fallbackFn;
    var tanh = M$2.tanh || fallbackFn;
    var exp = M$2.exp || fallbackFn;
    var expm1 = M$2.expm1 || fallbackFn;
    var log1p = M$2.log1p || fallbackFn;
    var powPI = function(value) {
      return M$2.pow(M$2.PI, value);
    };
    var acoshPf = function(value) {
      return M$2.log(value + M$2.sqrt(value * value - 1));
    };
    var asinhPf = function(value) {
      return M$2.log(value + M$2.sqrt(value * value + 1));
    };
    var atanhPf = function(value) {
      return M$2.log((1 + value) / (1 - value)) / 2;
    };
    var sinhPf = function(value) {
      return M$2.exp(value) - 1 / M$2.exp(value) / 2;
    };
    var coshPf = function(value) {
      return (M$2.exp(value) + 1 / M$2.exp(value)) / 2;
    };
    var expm1Pf = function(value) {
      return M$2.exp(value) - 1;
    };
    var tanhPf = function(value) {
      return (M$2.exp(2 * value) - 1) / (M$2.exp(2 * value) + 1);
    };
    var log1pPf = function(value) {
      return M$2.log(1 + value);
    };
    return {
      acos: acos(0.12312423423423424),
      acosh: acosh(1e308),
      acoshPf: acoshPf(1e154),
      asin: asin(0.12312423423423424),
      asinh: asinh(1),
      asinhPf: asinhPf(1),
      atanh: atanh(0.5),
      atanhPf: atanhPf(0.5),
      atan: atan(0.5),
      sin: sin(-1e300),
      sinh: sinh(1),
      sinhPf: sinhPf(1),
      cos: cos(10.000000000123),
      cosh: cosh(1),
      coshPf: coshPf(1),
      tan: tan(-1e300),
      tanh: tanh(1),
      tanhPf: tanhPf(1),
      exp: exp(1),
      expm1: expm1(1),
      expm1Pf: expm1Pf(1),
      log1p: log1p(10),
      log1pPf: log1pPf(10),
      powPI: powPI(-100)
    };
  }
  var defaultText = "mmMwWLliI0fiflO&1";
  var presets = {
default: [],
apple: [{ font: "-apple-system-body" }],
serif: [{ fontFamily: "serif" }],
sans: [{ fontFamily: "sans-serif" }],
mono: [{ fontFamily: "monospace" }],
min: [{ fontSize: "1px" }],
system: [{ fontFamily: "system-ui" }]
  };
  function getFontPreferences() {
    return withNaturalFonts(function(document2, container) {
      var elements = {};
      var sizes = {};
      for (var _i = 0, _a = Object.keys(presets); _i < _a.length; _i++) {
        var key = _a[_i];
        var _b = presets[key], _c = _b[0], style2 = _c === void 0 ? {} : _c, _d = _b[1], text = _d === void 0 ? defaultText : _d;
        var element = document2.createElement("span");
        element.textContent = text;
        element.style.whiteSpace = "nowrap";
        for (var _e = 0, _f = Object.keys(style2); _e < _f.length; _e++) {
          var name_1 = _f[_e];
          var value = style2[name_1];
          if (value !== void 0) {
            element.style[name_1] = value;
          }
        }
        elements[key] = element;
        container.append(document2.createElement("br"), element);
      }
      for (var _g = 0, _h = Object.keys(presets); _g < _h.length; _g++) {
        var key = _h[_g];
        sizes[key] = elements[key].getBoundingClientRect().width;
      }
      return sizes;
    });
  }
  function withNaturalFonts(action, containerWidthPx) {
    if (containerWidthPx === void 0) {
      containerWidthPx = 4e3;
    }
    return withIframe(function(_, iframeWindow) {
      var iframeDocument = iframeWindow.document;
      var iframeBody = iframeDocument.body;
      var bodyStyle = iframeBody.style;
      bodyStyle.width = "".concat(containerWidthPx, "px");
      bodyStyle.webkitTextSizeAdjust = bodyStyle.textSizeAdjust = "none";
      if (isChromium()) {
        iframeBody.style.zoom = "".concat(1 / iframeWindow.devicePixelRatio);
      } else if (isWebKit()) {
        iframeBody.style.zoom = "reset";
      }
      var linesOfText = iframeDocument.createElement("div");
      linesOfText.textContent = __spreadArray([], Array(containerWidthPx / 20 << 0)).map(function() {
        return "word";
      }).join(" ");
      iframeBody.appendChild(linesOfText);
      return action(iframeDocument, iframeBody);
    }, '<!doctype html><html><head><meta name="viewport" content="width=device-width, initial-scale=1">');
  }
  function isPdfViewerEnabled() {
    return navigator.pdfViewerEnabled;
  }
  function getArchitecture() {
    var f = new Float32Array(1);
    var u8 = new Uint8Array(f.buffer);
    f[0] = Infinity;
    f[0] = f[0] - f[0];
    return u8[3];
  }
  function getApplePayState() {
    var ApplePaySession = window.ApplePaySession;
    if (typeof (ApplePaySession === null || ApplePaySession === void 0 ? void 0 : ApplePaySession.canMakePayments) !== "function") {
      return -1;
    }
    if (willPrintConsoleError()) {
      return -3;
    }
    try {
      return ApplePaySession.canMakePayments() ? 1 : 0;
    } catch (error2) {
      return getStateFromError(error2);
    }
  }
  var willPrintConsoleError = isAnyParentCrossOrigin;
  function getStateFromError(error2) {
    if (error2 instanceof Error && error2.name === "InvalidAccessError" && /\bfrom\b.*\binsecure\b/i.test(error2.message)) {
      return -2;
    }
    throw error2;
  }
  function getPrivateClickMeasurement() {
    var _a;
    var link = document.createElement("a");
    var sourceId = (_a = link.attributionSourceId) !== null && _a !== void 0 ? _a : link.attributionsourceid;
    return sourceId === void 0 ? void 0 : String(sourceId);
  }
  var STATUS_NO_GL_CONTEXT = -1;
  var STATUS_GET_PARAMETER_NOT_A_FUNCTION = -2;
  var validContextParameters = new Set([
    10752,
    2849,
    2884,
    2885,
    2886,
    2928,
    2929,
    2930,
    2931,
    2932,
    2960,
    2961,
    2962,
    2963,
    2964,
    2965,
    2966,
    2967,
    2968,
    2978,
    3024,
    3042,
    3088,
    3089,
    3106,
    3107,
    32773,
    32777,
    32777,
    32823,
    32824,
    32936,
    32937,
    32938,
    32939,
    32968,
    32969,
    32970,
    32971,
    3317,
    33170,
    3333,
    3379,
    3386,
    33901,
    33902,
    34016,
    34024,
    34076,
    3408,
    3410,
    3411,
    3412,
    3413,
    3414,
    3415,
    34467,
    34816,
    34817,
    34818,
    34819,
    34877,
    34921,
    34930,
    35660,
    35661,
    35724,
    35738,
    35739,
    36003,
    36004,
    36005,
    36347,
    36348,
    36349,
    37440,
    37441,
    37443,
    7936,
    7937,
    7938

]);
  var validExtensionParams = new Set([
    34047,
    35723,
    36063,
    34852,
    34853,
    34854,
    34229,
    36392,
    36795,
    38449
]);
  var shaderTypes = ["FRAGMENT_SHADER", "VERTEX_SHADER"];
  var precisionTypes = ["LOW_FLOAT", "MEDIUM_FLOAT", "HIGH_FLOAT", "LOW_INT", "MEDIUM_INT", "HIGH_INT"];
  var rendererInfoExtensionName = "WEBGL_debug_renderer_info";
  var polygonModeExtensionName = "WEBGL_polygon_mode";
  function getWebGlBasics(_a) {
    var _b, _c, _d, _e, _f, _g;
    var cache = _a.cache;
    var gl = getWebGLContext(cache);
    if (!gl) {
      return STATUS_NO_GL_CONTEXT;
    }
    if (!isValidParameterGetter(gl)) {
      return STATUS_GET_PARAMETER_NOT_A_FUNCTION;
    }
    var debugExtension = shouldAvoidDebugRendererInfo() ? null : gl.getExtension(rendererInfoExtensionName);
    return {
      version: ((_b = gl.getParameter(gl.VERSION)) === null || _b === void 0 ? void 0 : _b.toString()) || "",
      vendor: ((_c = gl.getParameter(gl.VENDOR)) === null || _c === void 0 ? void 0 : _c.toString()) || "",
      vendorUnmasked: debugExtension ? (_d = gl.getParameter(debugExtension.UNMASKED_VENDOR_WEBGL)) === null || _d === void 0 ? void 0 : _d.toString() : "",
      renderer: ((_e = gl.getParameter(gl.RENDERER)) === null || _e === void 0 ? void 0 : _e.toString()) || "",
      rendererUnmasked: debugExtension ? (_f = gl.getParameter(debugExtension.UNMASKED_RENDERER_WEBGL)) === null || _f === void 0 ? void 0 : _f.toString() : "",
      shadingLanguageVersion: ((_g = gl.getParameter(gl.SHADING_LANGUAGE_VERSION)) === null || _g === void 0 ? void 0 : _g.toString()) || ""
    };
  }
  function getWebGlExtensions(_a) {
    var cache = _a.cache;
    var gl = getWebGLContext(cache);
    if (!gl) {
      return STATUS_NO_GL_CONTEXT;
    }
    if (!isValidParameterGetter(gl)) {
      return STATUS_GET_PARAMETER_NOT_A_FUNCTION;
    }
    var extensions = gl.getSupportedExtensions();
    var contextAttributes = gl.getContextAttributes();
    var unsupportedExtensions = [];
    var attributes = [];
    var parameters = [];
    var extensionParameters = [];
    var shaderPrecisions = [];
    if (contextAttributes) {
      for (var _i = 0, _b = Object.keys(contextAttributes); _i < _b.length; _i++) {
        var attributeName = _b[_i];
        attributes.push("".concat(attributeName, "=").concat(contextAttributes[attributeName]));
      }
    }
    var constants = getConstantsFromPrototype(gl);
    for (var _c = 0, constants_1 = constants; _c < constants_1.length; _c++) {
      var constant = constants_1[_c];
      var code = gl[constant];
      parameters.push("".concat(constant, "=").concat(code).concat(validContextParameters.has(code) ? "=".concat(gl.getParameter(code)) : ""));
    }
    if (extensions) {
      for (var _d = 0, extensions_1 = extensions; _d < extensions_1.length; _d++) {
        var name_1 = extensions_1[_d];
        if (name_1 === rendererInfoExtensionName && shouldAvoidDebugRendererInfo() || name_1 === polygonModeExtensionName && shouldAvoidPolygonModeExtensions()) {
          continue;
        }
        var extension = gl.getExtension(name_1);
        if (!extension) {
          unsupportedExtensions.push(name_1);
          continue;
        }
        for (var _e = 0, _f = getConstantsFromPrototype(extension); _e < _f.length; _e++) {
          var constant = _f[_e];
          var code = extension[constant];
          extensionParameters.push("".concat(constant, "=").concat(code).concat(validExtensionParams.has(code) ? "=".concat(gl.getParameter(code)) : ""));
        }
      }
    }
    for (var _g = 0, shaderTypes_1 = shaderTypes; _g < shaderTypes_1.length; _g++) {
      var shaderType = shaderTypes_1[_g];
      for (var _h = 0, precisionTypes_1 = precisionTypes; _h < precisionTypes_1.length; _h++) {
        var precisionType = precisionTypes_1[_h];
        var shaderPrecision = getShaderPrecision(gl, shaderType, precisionType);
        shaderPrecisions.push("".concat(shaderType, ".").concat(precisionType, "=").concat(shaderPrecision.join(",")));
      }
    }
    extensionParameters.sort();
    parameters.sort();
    return {
      contextAttributes: attributes,
      parameters,
      shaderPrecisions,
      extensions,
      extensionParameters,
      unsupportedExtensions
    };
  }
  function getWebGLContext(cache) {
    if (cache.webgl) {
      return cache.webgl.context;
    }
    var canvas = document.createElement("canvas");
    var context;
    canvas.addEventListener("webglCreateContextError", function() {
      return context = void 0;
    });
    for (var _i = 0, _a = ["webgl", "experimental-webgl"]; _i < _a.length; _i++) {
      var type = _a[_i];
      try {
        context = canvas.getContext(type);
      } catch (_b) {
      }
      if (context) {
        break;
      }
    }
    cache.webgl = { context };
    return context;
  }
  function getShaderPrecision(gl, shaderType, precisionType) {
    var shaderPrecision = gl.getShaderPrecisionFormat(gl[shaderType], gl[precisionType]);
    return shaderPrecision ? [shaderPrecision.rangeMin, shaderPrecision.rangeMax, shaderPrecision.precision] : [];
  }
  function getConstantsFromPrototype(obj) {
    var keys = Object.keys(obj.__proto__);
    return keys.filter(isConstantLike);
  }
  function isConstantLike(key) {
    return typeof key === "string" && !key.match(/[^A-Z0-9_x]/);
  }
  function shouldAvoidDebugRendererInfo() {
    return isGecko();
  }
  function shouldAvoidPolygonModeExtensions() {
    return isChromium() || isWebKit();
  }
  function isValidParameterGetter(gl) {
    return typeof gl.getParameter === "function";
  }
  function getAudioContextBaseLatency() {
    var isAllowedPlatform = isAndroid() || isWebKit();
    if (!isAllowedPlatform) {
      return -2;
    }
    if (!window.AudioContext) {
      return -1;
    }
    var latency = new AudioContext().baseLatency;
    if (latency === null || latency === void 0) {
      return -1;
    }
    if (!isFinite(latency)) {
      return -3;
    }
    return latency;
  }
  function getDateTimeLocale() {
    if (!window.Intl) {
      return -1;
    }
    var DateTimeFormat = window.Intl.DateTimeFormat;
    if (!DateTimeFormat) {
      return -2;
    }
    var locale = DateTimeFormat().resolvedOptions().locale;
    if (!locale && locale !== "") {
      return -3;
    }
    return locale;
  }
  var sources = {




fonts: getFonts,
    domBlockers: getDomBlockers,
    fontPreferences: getFontPreferences,
    audio: getAudioFingerprint,
    screenFrame: getScreenFrame,
    canvas: getCanvasFingerprint,
    osCpu: getOsCpu,
    languages: getLanguages,
    colorDepth: getColorDepth,
    deviceMemory: getDeviceMemory,
    screenResolution: getScreenResolution,
    hardwareConcurrency: getHardwareConcurrency,
    timezone: getTimezone,
    sessionStorage: getSessionStorage,
    localStorage: getLocalStorage,
    indexedDB: getIndexedDB,
    openDatabase: getOpenDatabase,
    cpuClass: getCpuClass,
    platform: getPlatform,
    plugins: getPlugins,
    touchSupport: getTouchSupport,
    vendor: getVendor,
    vendorFlavors: getVendorFlavors,
    cookiesEnabled: areCookiesEnabled,
    colorGamut: getColorGamut,
    invertedColors: areColorsInverted,
    forcedColors: areColorsForced,
    monochrome: getMonochromeDepth,
    contrast: getContrastPreference,
    reducedMotion: isMotionReduced,
    reducedTransparency: isTransparencyReduced,
    hdr: isHDR,
    math: getMathFingerprint,
    pdfViewerEnabled: isPdfViewerEnabled,
    architecture: getArchitecture,
    applePay: getApplePayState,
    privateClickMeasurement: getPrivateClickMeasurement,
    audioBaseLatency: getAudioContextBaseLatency,
    dateTimeLocale: getDateTimeLocale,

webGlBasics: getWebGlBasics,
    webGlExtensions: getWebGlExtensions
  };
  function loadBuiltinSources(options) {
    return loadSources(sources, options, []);
  }
  var commentTemplate = "$ if upgrade to Pro: https://fpjs.dev/pro";
  function getConfidence(components) {
    var openConfidenceScore = getOpenConfidenceScore(components);
    var proConfidenceScore = deriveProConfidenceScore(openConfidenceScore);
    return { score: openConfidenceScore, comment: commentTemplate.replace(/\$/g, "".concat(proConfidenceScore)) };
  }
  function getOpenConfidenceScore(components) {
    if (isAndroid()) {
      return 0.4;
    }
    if (isWebKit()) {
      return isDesktopWebKit() && !(isWebKit616OrNewer() && isSafariWebKit()) ? 0.5 : 0.3;
    }
    var platform2 = "value" in components.platform ? components.platform.value : "";
    if (/^Win/.test(platform2)) {
      return 0.6;
    }
    if (/^Mac/.test(platform2)) {
      return 0.5;
    }
    return 0.7;
  }
  function deriveProConfidenceScore(openConfidenceScore) {
    return round(0.99 + 0.01 * openConfidenceScore, 1e-4);
  }
  function componentsToCanonicalString(components) {
    var result = "";
    for (var _i = 0, _a = Object.keys(components).sort(); _i < _a.length; _i++) {
      var componentKey = _a[_i];
      var component = components[componentKey];
      var value = "error" in component ? "error" : JSON.stringify(component.value);
      result += "".concat(result ? "|" : "").concat(componentKey.replace(/([:|\\])/g, "\\$1"), ":").concat(value);
    }
    return result;
  }
  function componentsToDebugString(components) {
    return JSON.stringify(components, function(_key, value) {
      if (value instanceof Error) {
        return errorToObject(value);
      }
      return value;
    }, 2);
  }
  function hashComponents(components) {
    return x64hash128(componentsToCanonicalString(components));
  }
  function makeLazyGetResult(components) {
    var visitorIdCache;
    var confidence = getConfidence(components);
    return {
      get visitorId() {
        if (visitorIdCache === void 0) {
          visitorIdCache = hashComponents(this.components);
        }
        return visitorIdCache;
      },
      set visitorId(visitorId) {
        visitorIdCache = visitorId;
      },
      confidence,
      components,
      version
    };
  }
  function prepareForSources(delayFallback) {
    if (delayFallback === void 0) {
      delayFallback = 50;
    }
    return requestIdleCallbackIfAvailable(delayFallback, delayFallback * 2);
  }
  function makeAgent(getComponents, debug) {
    var creationTime = Date.now();
    return {
      get: function(options) {
        return __awaiter(this, void 0, void 0, function() {
          var startTime, components, result;
          return __generator(this, function(_a) {
            switch (_a.label) {
              case 0:
                startTime = Date.now();
                return [4, getComponents()];
              case 1:
                components = _a.sent();
                result = makeLazyGetResult(components);
                if (debug || (options === null || options === void 0 ? void 0 : options.debug)) {
                  console.log("Copy the text below to get the debug data:\n\n```\nversion: ".concat(result.version, "\nuserAgent: ").concat(navigator.userAgent, "\ntimeBetweenLoadAndGet: ").concat(startTime - creationTime, "\nvisitorId: ").concat(result.visitorId, "\ncomponents: ").concat(componentsToDebugString(components), "\n```"));
                }
                return [2, result];
            }
          });
        });
      }
    };
  }
  function monitor() {
    if (window.__fpjs_d_m || Math.random() >= 1e-3) {
      return;
    }
    try {
      var request = new XMLHttpRequest();
      request.open("get", "https://m1.openfpcdn.io/fingerprintjs/v".concat(version, "/npm-monitoring"), true);
      request.send();
    } catch (error2) {
      console.error(error2);
    }
  }
  function load(options) {
    var _a;
    if (options === void 0) {
      options = {};
    }
    return __awaiter(this, void 0, void 0, function() {
      var delayFallback, debug, getComponents;
      return __generator(this, function(_b) {
        switch (_b.label) {
          case 0:
            if ((_a = options.monitoring) !== null && _a !== void 0 ? _a : true) {
              monitor();
            }
            delayFallback = options.delayFallback, debug = options.debug;
            return [4, prepareForSources(delayFallback)];
          case 1:
            _b.sent();
            getComponents = loadBuiltinSources({ cache: {}, debug });
            return [2, makeAgent(getComponents, debug)];
        }
      });
    });
  }
  var index = { load, hashComponents, componentsToDebugString };
  async function getFp() {
    const fp = await index.load();
    const result = await fp.get();
    return result.visitorId;
  }
  function ChatHistoryPanel() {
    const [fp, setFp] = React.useState(null);
    const wsUrl = fp ? `ws://175.178.29.106:8000/ws?fp=${encodeURIComponent(fp)}` : "ws://175.178.29.106:8000/ws";
    React.useEffect(() => {
      getFp().then((s2) => setFp(s2));
    }, []);
    const { messages, onlineCount, isConnected, sendMessage } = useChatWebSocket(wsUrl);
    return jsxRuntimeExports.jsxs(Card, { className: "w-96 shadow-lg flex flex-col overflow-hidden py-0 gap-0 relative", children: [
jsxRuntimeExports.jsx(OnlineCount, { count: onlineCount }),
jsxRuntimeExports.jsx(ChatHistory, { messages, isConnected }),
jsxRuntimeExports.jsx(ChatAction, {}),
jsxRuntimeExports.jsx(CommentInput, { sendMessage })
    ] });
  }
  const kuaishouLogo = "data:image/svg+xml,%3csvg%20viewBox='0%200%20171%20195.87'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%3e%3cpath%20class='cls-1'%20d='M131.08,13.06a39.51,39.51,0,0,0-27,10.59A46.22,46.22,0,1,0,99,76.09a39.68,39.68,0,1,0,32.07-63ZM63.78,73.83A27.63,27.63,0,1,1,91.41,46.21,27.63,27.63,0,0,1,63.78,73.83Zm67.3,0a21.1,21.1,0,1,1,21.1-21.1A21.1,21.1,0,0,1,131.08,73.83Z'%20fill='%23ff4906'/%3e%3cpath%20class='cls-2'%20d='M136.61,100.45H86.38a34.17,34.17,0,0,0-32.53,23.74L24.06,109.11A16.57,16.57,0,0,0,0,123.9v48.64a16.58,16.58,0,0,0,24,14.82l29.93-15a34.16,34.16,0,0,0,32.45,23.51h50.23a34.15,34.15,0,0,0,34.15-34.15V134.6A34.15,34.15,0,0,0,136.61,100.45ZM24.07,167.7a4.53,4.53,0,0,1-6-2,4.59,4.59,0,0,1-.49-2.06V133.05a4.52,4.52,0,0,1,6.55-4l28.1,14.11v10.13L24.15,167.66Zm129.11-6.48v.28a17.07,17.07,0,0,1-17.07,16.79H86.6a17.07,17.07,0,0,1-16.79-17.07v-26.4A17.08,17.08,0,0,1,86.89,118h49.5a17.07,17.07,0,0,1,16.79,17.07Z'%20fill='%23ff4906'%20fill-rule='evenodd'/%3e%3c/g%3e%3c/svg%3e";
  const douyinLogo = "data:image/svg+xml,%3csvg%20width='200px'%20height='200'%20viewBox='0%200%2035%2040'%20fill='none'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%3e%3cg%20id='g998'%20transform='matrix(1.1587615,0,0,1.1587615,5.6580122e-4,0)'%3e%3cpath%20d='m%2011.639644,13.3091%20v%20-1.3108%20c%20-0.4554,-0.0547%20-0.9108,-0.0911%20-1.3844,-0.0911%20-5.6470199,0%20-10.255732281,4.5881%20-10.255732281,10.2503%200,3.4592%201.730542381,6.5361%204.371892381,8.3931%20-1.71232,-1.8388%20-2.75064,-4.2785%20-2.75064,-6.973%200.01821,-5.5894%204.48119,-10.141%2010.0188799,-10.2685%20z'%20fill='%2300faf0'%20/%3e%3cpath%20d='m%2011.876844,28.22%20c%202.5139,0%204.5723,-2.0027%204.6634,-4.497%20V%201.4201%20h%204.0805%20C%2020.529644,0.96494%2020.493144,0.491574%2020.493144,0%20h%20-5.5741%20v%2022.3029%20c%20-0.0911,2.4943%20-2.1496,4.497%20-4.6634,4.497%20-0.7833099,0%20-1.5301799,-0.2003%20-2.1677499,-0.5462%200.85616,1.2016%202.2405499,1.9663%203.7889499,1.9663%20z'%20fill='%2300faf0'/%3e%3cpath%20d='M%2028.251644,8.99427%20V%207.75624%20c%20-1.5483,0%20-3.0056,-0.45516%20-4.2261,-1.25624%201.0929,1.23804%202.5685,2.13014%204.2261,2.49427%20z'%20fill='%2300faf0'%20/%3e%3cpath%20d='m%2024.045144,6.5005%20c%20-1.184,-1.36548%20-1.9126,-3.13151%20-1.9126,-5.0796%20h%20-1.4938%20c%200.4008,2.11195%201.6577,3.9326%203.4064,5.0796%20z'%20fill='%23ff0050'%20/%3e%3cpath%20d='m%2010.255344,17.4597%20c%20-2.5867399,0%20-4.6816099,2.0937%20-4.6816099,4.679%200,1.8025%201.02011,3.35%202.51384,4.1329%20-0.54649,-0.7647%20-0.8926,-1.7114%20-0.8926,-2.731%200,-2.5853%202.09488,-4.679%204.6815699,-4.679%200.4736,0%200.9473,0.0728%201.3845,0.2184%20v%20-5.6804%20c%20-0.4554,-0.0546%20-0.9109,-0.091%20-1.3845,-0.091%20-0.0728,0%20-0.1639,0%20-0.2368,0%20v%204.3695%20c%20-0.4372,-0.1456%20-0.8926,-0.2184%20-1.3844,-0.2184%20z'%20fill='%23ff0050'%20/%3e%3cpath%20d='m%2028.252544,8.99414%20v%204.33316%20c%20-2.8963,0%20-5.5559,-0.9285%20-7.7419,-2.4943%20v%2011.3062%20c%200,5.644%20-4.5905,10.2502%20-10.2557,10.2502%20-2.1859699,0%20-4.2079799,-0.6918%20-5.8656599,-1.857%201.87627,2.0027%204.53585,3.2771%207.5050599,3.2771%205.6471,0%2010.2558,-4.588%2010.2558,-10.2502%20V%2012.2531%20c%202.1859,1.5658%204.8637,2.4943%207.7419,2.4943%20V%209.17621%20c%20-0.5647,-0.01821%20-1.1112,-0.07283%20-1.6395,-0.18207%20z'%20fill='%23ff0050'%20/%3e%3cpath%20d='M%2020.509644,22.1398%20V%2010.8336%20c%202.1859,1.5658%204.8637,2.4943%207.7419,2.4943%20V%208.99477%20c%20-1.6759,-0.36412%20-3.1332,-1.25623%20-4.2262,-2.49427%20-1.7488,-1.1288%20-3.0057,-2.94945%20-3.3882,-5.0796%20h%20-4.0805%20v%2022.3029%20c%20-0.0911,2.4943%20-2.1495,4.497%20-4.6633,4.497%20-1.5666,0%20-2.9510799,-0.7647%20-3.7890299,-1.9481%20-1.49373,-0.7829%20-2.51384,-2.3486%20-2.51384,-4.1329%200,-2.5853%202.09487,-4.679%204.6815699,-4.679%200.4736,0%200.9473,0.0728%201.3844,0.2184%20v%20-4.3695%20c%20-5.5376999,0.1274%20-10.0006799,4.6791%20-10.0006799,10.232%200,2.6946%201.03832,5.1524%202.75065,6.9731%201.65768,1.1652%203.69791,1.8571%205.8656299,1.8571%205.6288,0.0182%2010.2376,-4.5881%2010.2376,-10.2321%20z'%20fill='%23111111'%20/%3e%3c/g%3e%3c/svg%3e";
  const bilibiliLogo = "data:image/svg+xml,%3csvg%20viewBox='0%200%202240%201024'%20version='1.1'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:xlink='http://www.w3.org/1999/xlink'%20width='140'%20height='64'%3e%3cpath%20d='M2079.810048%20913.566175c-10.01309%200-18.554608%200.799768-26.936172-0.159954-16.987063-1.951433-33.974126-1.567544-50.99318-2.079395-10.972811-0.287916-10.652904-0.287916-11.580634-10.90883-2.71921-32.406582-5.694345-64.781173-8.605499-97.155764-2.527266-28.439735-4.926568-56.91146-7.70976-85.319204-2.527266-26.040432-5.566382-52.016883-8.317583-78.025324-2.623238-24.440897-5.054531-48.913784-7.77374-73.322691a12681.114551%2012681.114551%200%200%200-10.684895-92.133223c-3.295042-27.128116-6.558094-54.320213-10.205034-81.416339a20559.272961%2020559.272961%200%200%200-17.530905-125.979387c-6.398141-44.723002-14.075909-89.22207-22.105576-133.657156-1.439582-7.965685-1.247637-8.253601%206.36615-9.533229%2031.670796-5.406429%2063.501545-10.01309%2095.716183-9.309295%203.486987%200.095972%207.005964%200.159954%2010.460959%200.607823%205.662354%200.703795%208.605499%203.454996%208.925406%2010.045081%201.119675%2022.969325%202.71921%2045.938649%204.414717%2068.875983%202.71921%2037.589076%205.662354%2075.178151%208.477537%20112.735236%201.791479%2024.184971%203.327033%2048.305961%205.150503%2072.426951%202.911154%2038.772732%205.982261%2077.513473%208.925406%20116.286205%201.791479%2023.705111%203.359024%2047.474203%205.182494%2071.179313%202.783191%2034.805885%205.822308%2069.579778%208.637489%20104.353672%201.791479%2022.137566%203.391014%2044.307123%205.278466%2066.44469%202.783191%2032.79047%205.790317%2065.580941%208.63749%2098.371411%202.143377%2025.592562%204.09481%2051.249106%206.270178%2077.673426zM853.670395%20114.918282c4.638652%200%2011.644616-0.511851%2018.554607%200.127963%208.797443%200.799768%2010.49295%203.071107%2011.036793%2011.900541%202.527266%2040.372267%204.894578%2080.776524%207.581796%20121.180782%202.943145%2043.571337%206.174206%2087.078693%209.405267%20130.586048%202.975135%2039.956388%205.950271%2079.912775%209.149341%20119.869163%203.486987%2043.891244%207.357862%2087.718507%2010.876839%20131.609751%202.655228%2033.622229%204.926568%2067.244457%207.677768%20100.898677%202.623238%2031.222926%205.694345%2062.38187%208.509527%2093.572805%202.399303%2026.8402%204.830596%2053.71239%207.165918%2080.58458%200.735786%208.509527%200.127963%209.053369-9.053369%208.829434-24.025018-0.575833-47.922073-3.391014-71.947091-2.71921-5.502401%200.159954-7.101936-2.367312-8.029666-7.581796-1.983424-11.356699-1.663517-22.905343-2.879163-34.390006-3.295042-30.359177-5.182494-60.846317-7.965685-91.269474-2.495275-27.639967-5.502401-55.215953-8.349574-82.82393-2.527266-25.240664-5.02254-50.481329-7.709759-75.753984-2.687219-24.792795-5.534392-49.61758-8.349573-74.442365-2.591247-22.841362-5.118512-45.682723-7.869713-68.524085-4.062819-33.462275-8.093648-66.92455-12.508365-100.322844-4.062819-30.647093-8.66948-61.198214-12.988225-91.813317-5.886289-41.587914-12.508365-83.079855-19.834236-124.411842a1393.96288%201393.96288%200%200%200-5.310457-28.023856c-0.959721-4.702633-0.095972-7.421843%205.278466-8.157629%2014.139891-1.887451%2028.24779-4.830596%2042.451663-6.206196%2014.203872-1.311619%2028.407744-3.966847%2045.106891-2.71921z%20m1006.075609%20403.33878c27.064134%200%2027.703949%200.191944%2032.054684%2024.536869%205.342447%2030.03927%209.08536%2060.334465%2012.636328%2090.62966%203.742912%2032.278619%207.517815%2064.557238%2010.972811%2096.867848%202.783191%2026.008441%205.118512%2052.080864%207.74175%2078.089305%202.7512%2027.256079%205.662354%2054.416185%208.509527%2081.640274%201.567544%2015.387528%203.039117%2030.775056%204.798605%2046.130593%200.511851%204.446708-0.831758%206.81402-5.214485%207.325871-9.245313%201.055693-18.426645%202.27134-27.639967%203.263052-16.891091%201.82347-33.814173%203.614949-50.737254%205.182493-8.733462%200.799768-9.309294%200.319907-10.940821-8.125638-14.843686-76.617733-29.719363-153.171485-44.435086-229.821208-9.789155-50.961189-19.322384-101.95437-28.919595-152.915559a805.525894%20805.525894%200%200%201-3.582959-21.081873c-0.639814-4.030829%200.44787-6.622075%205.022541-7.70976%2030.48714-7.133927%2061.294186-12.636328%2089.733921-14.011927z%20m-1137.077537%200c28.951586%200%2028.823623%200.095972%2033.302322%2026.360339%206.909992%2040.660183%2011.804569%2081.544301%2016.187295%20122.556382%204.286754%2039.796434%208.957397%2079.560878%2013.148179%20119.357311%202.847173%2027.224088%205.086522%2054.512157%207.74175%2081.704255%201.887451%2019.354375%204.126801%2038.644769%206.174206%2057.967153%200.255926%202.367312%200.383888%204.734624%200.543842%207.133927%200.415879%209.469248%200%2010.237025-9.117351%2011.164755-18.074747%201.887451-36.181485%203.454996-54.256232%205.246476-6.558094%200.639814-13.084197%201.599535-19.57831%202.239349-8.63749%200.799768-8.925406%200.767777-10.620913-7.965685-6.078234-30.679084-11.964523-61.422149-17.914793-92.101233-14.267853-73.898523-28.69566-147.733065-42.867542-221.631589-5.662354-29.559409-10.524941-59.246781-16.091323-88.838181-1.023702-5.406429-0.255926-7.933694%205.342447-9.245313%2030.199223-7.037955%2060.590391-12.540355%2088.006423-13.947946z%20m382.128944%20309.861946v124.027954c0%201.183656-0.127963%202.399303%200.03199%203.582959%200.607823%206.014252-1.599535%208.66948-7.805731%208.413555-8.157629-0.351898-16.251277-0.127963-24.408906%200.063981-17.019054%200.319907-34.070098-0.351898-51.057162%201.599535-9.405267%201.087684-9.213322%200.511851-10.141052-9.405266-2.783191-31.222926-5.822308-62.413861-8.669481-93.636787-2.623238-28.823623-4.99055-57.711228-7.677768-86.534851-2.71921-29.655381-5.758326-59.214791-8.509527-88.838181-1.887451-19.770254-3.550968-39.508518-5.214485-59.278772-2.175368-25.720525-4.190782-51.409059-6.462122-77.129585-0.959721-10.844848-0.159954-12.380402%2010.588923-13.500076a531.877423%20531.877423%200%200%201%2083.527724-2.591247c6.941982%200.383888%2013.851974%201.727498%2020.570022%203.359024%208.477536%202.015414%209.405267%203.263052%209.853137%2012.124476%200.92773%2017.850812%201.855461%2035.701624%202.335321%2053.584427%200.543842%2019.866226%200.095972%2039.764443%200.831758%2059.63067%201.855461%2054.800074%201.567544%20109.664129%202.207359%20164.528184z%20m1134.806197%205.630364v117.437869c0%201.983424-0.063981%203.966847%200.03199%205.982262%200.415879%205.150503-1.983424%206.973973-6.878001%206.941982-12.028504-0.095972-24.025018%200-36.021531%200.159954-13.564058%200.127963-27.096125%200.063981-40.628192%201.535553-8.925406%201.023702-8.989387%200.351898-9.789155-8.509527-3.678931-40.660183-7.549806-81.320366-11.260728-122.04453-3.391014-37.525094-6.526103-75.082179-9.981099-112.639265-3.550968-38.740741-7.421843-77.38551-10.90883-116.09426-1.727498-19.386366-3.16708-38.772732-4.606661-58.159097-0.575833-8.445546%200.351898-9.949109%209.885127-10.716886%2016.571184-1.311619%2033.078387-3.550968%2049.777534-3.263051%2016.635165%200.319907%2033.302322-0.607823%2049.841515%202.559256%2014.011928%202.687219%2014.715723%203.486987%2015.547481%2018.458635%202.399303%2044.051198%201.663517%2088.230358%203.231061%20132.281556%201.599535%2046.89837%200.479861%2093.79674%201.759489%20146.069549zM1831.498213%20305.135c9.789155%200.575833%2017.498914%200.095972%2025.176683%201.791479%204.894578%201.119675%207.357862%203.327033%207.837723%208.573509%202.303331%2025.240664%204.798605%2050.51332%207.32587%2075.785975%202.015414%2020.50604%204.158791%2041.012081%206.238188%2061.518121l0.191944%201.183656c1.663517%2012.924244%201.279628%2013.276142-11.292718%2013.979937-11.196746%200.607823-22.361501%201.599535-33.558247%202.27134-7.357862%200.44787-9.693183%201.695507-10.90883-9.021378-4.190782-37.813011-9.053369-75.530049-13.692021-113.311069a1185.0316%201185.0316%200%200%200-4.286754-31.798759c-0.92773-5.982261%201.407591-9.277304%207.005964-9.757164%207.357862-0.671805%2014.715723-0.863749%2019.962198-1.215647z%20m-1133.398606%200.159954c7.549806%200.415879%2015.323547-0.159954%2022.937334%201.599535%204.350736%200.991712%206.558094%202.815182%206.973973%207.773741%200.92773%2011.83656%202.7512%2023.641129%203.870875%2035.477689%203.550968%2036.309448%206.909992%2072.650886%2010.237025%20108.992324%200.703795%207.901704%200.543842%208.061657-6.84601%208.605499-13.116188%200.959721-26.264367%201.919442-39.412546%202.463284-7.645778%200.351898-8.605499-0.575833-9.56522-8.381564-3.327033-26.744227-6.462122-53.520446-9.661192-80.296664-2.591247-22.073585-4.766615-44.14717-7.901704-66.156773-0.863749-6.078234%201.119675-7.74175%205.982262-8.733462%207.709759-1.567544%2015.451509-1.055693%2023.385203-1.343609z%20m399.147998%20100.002936c0%2023.001315%200.063981%2045.97064-0.031991%2069.003946%200%2010.332997-0.127963%2010.396978-10.396978%2010.269016a324.289753%20324.289753%200%200%201-36.981252-1.919443c-7.933694-0.991712-8.093648-0.735786-8.317583-9.149341-0.799768-28.119828-1.631526-56.239655-2.207359-84.359483-0.415879-19.034468-0.639814-38.004955-1.791479-57.039422-0.607823-9.821146-0.063981-9.917118%209.373276-10.045081%2013.915956-0.159954%2027.799921%200.479861%2041.619904%202.591247%208.317583%201.279628%208.701471%201.279628%208.733462%2010.49295%200.063981%2023.385204%200.063981%2046.770407%200.063981%2070.187602h-0.063981z%20m1135.38203%200.607824c0%2023.033306%200.063981%2046.034621-0.031991%2069.035936%200%209.661192-0.159954%209.725174-9.853137%209.661192a505.32514%20505.32514%200%200%201-38.132917-1.791479c-6.302168-0.479861-8.157629-3.135089-7.74175-8.861425%200.063981-0.799768%200-1.599535%200-2.399302-0.959721-44.403095-1.919442-88.7742-2.815182-133.177296-0.031991-2.367312-0.159954-4.734624-0.063982-7.133926%200.127963-8.957397%200.159954-9.181332%209.149341-9.117351%2012.380402%200.063981%2024.664832%200.703795%2037.013243%201.919442%2015.067621%201.503563%2012.412393%203.359024%2012.476375%2015.259566%200.063981%2022.169557%200.031991%2044.403095%200%2066.604643z%20m-1565.593%2054.000306c0.287916%2012.636328%200.287916%2012.604337-11.804569%2015.547481-8.221611%202.015414-16.443221%204.222773-24.728813%206.046243-7.069945%201.599535-8.317583%200.703795-9.53323-6.238187-8.445546-47.090314-16.8591-94.212619-25.240664-141.334924-1.695507-9.757164-1.247637-10.364988%208.349573-12.060495%2011.804569-2.079396%2023.577148-4.126801%2035.381717-5.950271%207.517815-1.183656%208.477536-0.767777%209.9811%207.517815%202.975135%2016.731138%205.790317%2033.526256%207.997675%2050.385357%203.423005%2026.680246%206.238187%2053.456464%209.309295%2080.168701%200.255926%201.951433%200.191944%203.966847%200.287916%205.91828z%20m1064.138735-136.696273c15.451509-2.527266%2031.030982-5.086522%2046.610454-7.549806%205.598373-0.863749%207.29388%202.655228%208.029666%207.645778%202.655228%2018.426645%205.982261%2036.725327%208.157629%2055.183962%203.19907%2026.744227%207.581797%2053.360492%208.413555%2080.328655%200.063981%202.7512%200.031991%205.566382%200.095972%208.317583%200.159954%204.286754-1.983424%206.494113-5.950271%207.421843-10.556932%202.367312-21.113864%204.734624-31.638805%207.261889-5.054531%201.215647-6.750038-0.92773-7.581796-5.854298-3.16708-18.746552-6.81402-37.397131-10.045081-56.079702-5.47041-30.775056-10.780867-61.582103-16.091323-92.38915-0.127963-1.119675%200-2.303331%200-4.286754z%20m-710.64147%20108.032603c-0.44787%2016.37924%200.543842%2030.647093-1.695507%2044.914947-0.671805%204.510689-1.983424%207.421843-6.846011%207.837722-10.428969%200.863749-20.825947%201.695507-31.190935%202.7512-5.02254%200.543842-6.430131-1.631526-7.261889-6.558094-2.335321-14.55577-1.919442-29.303484-3.327033-43.923234-2.655228-27.607976-3.774903-55.407897-5.566383-83.111846-0.44787-6.750038-1.119675-13.436095-1.663516-20.186134-0.287916-3.774903%201.215647-5.886289%205.246475-6.046242%2013.500077-0.543842%2026.936172-3.007126%2040.50023-2.527266%207.933694%200.287916%208.605499%200.799768%209.181331%208.797443%200.351898%205.534392%200.255926%2011.132765%200.383889%2016.699147l2.239349%2081.352357z%20m1134.902169-15.867388c0%2019.066459%200.223935%2038.132918-0.031991%2057.199376-0.159954%209.917118-1.279628%2010.780867-10.652904%2011.644616-9.277304%200.863749-18.490626%201.567544-27.735939%202.559256-5.214485%200.543842-7.645778-0.991712-7.965685-6.973973-1.34361-25.336637-3.16708-50.673273-4.926568-75.977919-1.3756-20.985901-2.943145-41.939811-4.414717-62.893722-0.159954-2.399303-0.031991-4.798605-0.191944-7.165917-0.223935-4.190782%201.055693-6.654066%205.758326-6.81402%2013.116188-0.44787%2026.136404-2.975135%2039.348564-2.495274%208.061657%200.287916%208.18962%200.415879%208.797444%208.797443%201.951433%2027.32006%202.143377%2054.704102%202.015414%2082.120134zM628.295894%20756.171918c16.571184%2018.234701%2017.402942%2039.828425%2011.932532%2062.413861-5.502401%2022.585436-18.042756%2041.204025-33.23834%2057.903171-25.49659%2027.895893-56.303637%2048.497905-89.062116%2065.99682-56.399609%2030.135242-116.190232%2050.161422-178.572103%2061.997982-44.882956%208.477536-90.053828%2015.00364-135.704561%2017.498914-13.915956%200.767777-27.799921%201.407591-41.715876%201.311619-10.077071%200-20.186133%200.287916-30.231214-0.063981-8.541518-0.319907-9.789155-1.791479-10.49295-10.716886-2.591247-32.022693-4.798605-64.077378-7.645778-96.100071-3.327033-37.109215-7.229899-74.18644-10.812858-111.295654-2.623238-26.8402-4.894578-53.744381-7.773741-80.520599-3.327033-31.542833-7.069945-63.021684-10.716885-94.564517-3.327033-29.111539-6.526103-58.28706-10.045081-87.430591-3.934856-32.278619-7.997676-64.493257-12.31642-96.707894a8228.968456%208228.968456%200%200%200-13.212161-92.996973%205984.500754%205984.500754%200%200%200-24.312934-152.627642%203243.825263%203243.825263%200%200%200-23.67312-123.740038c-1.151665-5.502401%200.511851-7.709759%205.342448-9.725174C52.335283%2047.609843%2098.465876%2028.063524%20144.724432%208.77313c8.605499-3.582959%2017.434933-6.590085%2026.584274-8.285592%206.334159-1.183656%207.965685%200.127963%207.773741%206.494113-0.479861%2016.283268%200.191944%2032.630517-1.407591%2048.849803a161.393095%20161.393095%200%200%200-0.639814%2013.084197c-0.735786%2058.383032-1.439582%20116.798056%200.095972%20175.213079%201.34361%2051.185124%204.030829%20102.338258%207.005964%20153.491392%202.335321%2040.372267%205.694345%2080.744534%209.149341%20121.052819%203.391014%2039.508518%207.517815%2078.953054%2011.38869%20118.461572%200.735786%207.517815%201.407591%208.221611%209.949108%207.069945a381.329176%20381.329176%200%200%201%2050.833227-4.190782c52.880632-0.127963%20104.897514%207.133927%20156.338564%2019.322384%2045.010919%2010.684895%2088.806191%2024.920757%20130.777993%2044.818975%2020.793957%209.853136%2040.692174%2021.241827%2058.830902%2035.701624%206.174206%204.862587%2011.676606%2010.46096%2016.891091%2016.315259z%20m1126.840512-9.597211c20.47405%2017.946784%2027.927883%2039.924397%2022.105576%2067.116494-4.830596%2022.425483-15.771416%2041.268006-30.359177%2058.127107-23.417194%2027.096125-51.856929%2047.698138-82.631985%2064.909136-60.334465%2033.782182-124.603787%2055.727804-192.168151%2068.396122a1151.089465%201151.089465%200%200%201-111.455609%2015.547481c-21.177845%201.82347-42.451662%204.09481-66.220754%202.623238h-27.76793c-5.406429%200-8.477536-1.695507-8.925406-8.125638-2.047405-28.087837-4.414717-56.143683-6.941983-84.19953-2.687219-29.623391-5.662354-59.246781-8.477536-88.870172-2.559256-27.224088-4.926568-54.512157-7.709759-81.736245-2.559256-25.656544-5.502401-51.249106-8.285592-76.873659-2.591247-24.057008-5.086522-48.114017-7.933695-72.139035-3.423005-29.111539-7.037955-58.223079-10.652904-87.334618-3.391014-27.160107-6.750038-54.288222-10.364987-81.416338a6133.577429%206133.577429%200%200%200-12.156467-87.142675c-5.694345-37.653057-11.804569-75.178151-17.818822-112.767227a3259.14881%203259.14881%200%200%200-29.111539-158.993792c-0.44787-2.335321-0.671805-4.734624-1.3756-7.005964-1.663517-5.118512-0.063981-7.837722%204.958559-9.821146C1191.012355%2047.641834%201238.61452%2024.448575%201288.2321%206.149893c6.494113-2.431293%2013.052207-5.150503%2020.058171-5.854299%206.302168-0.639814%207.901704%200.383888%207.29388%207.101936-3.327033%2036.43741-1.407591%2073.066765-3.135089%20109.536166-1.407591%2029.751354-1.247637%2059.598679%200.255926%2089.382023%200.351898%207.549806%200.639814%2015.131602%200.575832%2022.649418-0.383888%2035.765606%201.503563%2071.499221%203.327033%20107.200845%202.335321%2047.186286%205.758326%2094.276601%209.245313%20141.398906%202.527266%2034.006117%205.822308%2067.948253%209.021379%20101.922379%201.695507%2018.586598%203.518977%2037.141206%205.822308%2055.631832%201.247637%2010.205034%201.759489%2010.301006%2011.772578%208.957396%2017.658868-2.399303%2035.349726-4.350736%2053.200539-4.09481%2062.637796%200.799768%20124.027954%2010.684895%20184.266447%2027.863902%2040.788146%2011.580634%2080.488608%2026.040432%20117.981712%2046.290547a253.55831%20253.55831%200%200%201%2047.218277%2032.438573zM308.676783%20922.811488c23.161269-11.068783%20135.608589-98.947243%20144.533995-113.279078-54.576139-23.513166-109.344222-45.362816-168.239105-63.24562l23.70511%20176.524698z%20m1277.196815-107.520752c2.879163-3.103098%202.559256-5.502401-1.343609-7.229899-7.773741-3.550968-15.4835-7.325871-23.353213-10.556932-42.003793-17.179007-84.19953-33.814173-127.482951-47.37823-3.774903-1.151665-7.645778-3.774903-12.476374-1.535554l23.321222%20173.45359c3.454996%200.767777%204.798605-0.831758%206.33416-1.919442%2039.316574-28.855614%2078.889073-57.35933%20116.638102-88.390312%206.36615-5.182494%2012.668318-10.396978%2018.362663-16.443221z'%20fill='%2300AEEC'%3e%3c/path%3e%3c/svg%3e";
  const weiboLogo = "data:image/svg+xml,%3csvg%20version='1.1'%20width='75px'%20height='61px'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20d='m%205.53007,41.9362%20c%200,8.7573%2011.40225,15.8597%2025.46951,15.8597%2014.06726,0%2025.46951,-7.1024%2025.46951,-15.8597%200,-8.75872%20-11.40225,-15.8597%20-25.46951,-15.8597%20-14.06726,0%20-25.46951,7.10098%20-25.46951,15.8597'%20fill='%23ffffff'/%3e%3cpath%20d='M%2031.59333,56.50352%20C%2019.14371,57.73143%208.39625,52.10481%207.58671,43.93067%206.77861,35.75796%2016.21935,28.13544%2028.66755,26.90466%2041.11861,25.67245%2051.86607,31.30051%2052.67417,39.47178%2053.48084,47.64879%2044.0444,55.27274%2031.59333,56.50352%20M%2056.49546,29.36909%20c%20-1.05885,-0.31665%20-1.78528,-0.53301%20-1.23078,-1.92426%201.20069,-3.02178%201.32534,-5.62805%200.0229,-7.48783%20-2.44149,-3.48744%20-9.12122,-3.29975%20-16.77812,-0.0932%200,-0.005%20-2.40425,1.05168%20-1.78958,-0.85538%201.17777,-3.7869%201.0001,-6.9577%20-0.83245,-8.78882%20C%2031.73373,6.06304%2020.68681,10.37721%2011.21312,19.84661%204.11931,26.94185%200,34.4612%200,40.96326%200,53.4%2015.94853,60.9609%2031.55176,60.9609%20c%2020.45327,0%2034.05917,-11.88367%2034.05917,-21.31868%200,-5.69969%20-4.80132,-8.93496%20-9.11549,-10.2732'%20fill='%23e6162d'/%3e%3cpath%20d='M%2070.07757,6.61%20C%2065.1387,1.13383%2057.85289,-0.95377%2051.12732,0.47617%20l%20-0.002,0%20c%20-1.55459,0.33241%20-2.54752,1.86408%20-2.21368,3.41724%200.33098,1.55316%201.86121,2.54752%203.41724,2.21511%204.78413,-1.01586%209.96085,0.47139%2013.47408,4.36002%203.5075,3.89006%204.46032,9.19573%202.95731,13.84661%20l%2010e-4,0.001%20c%20-0.49002,1.51591%200.33814,3.13641%201.85548,3.62642%201.51161,0.48859%203.13498,-0.33957%203.625,-1.84974%200,-0.002%200,-0.008%200.001,-0.0115%202.10766,-6.54361%200.77658,-14.00135%20-4.16516,-19.47179'%20fill='%23ff9933'/%3e%3cpath%20d='m%2062.49231,13.45494%20c%20-2.40424,-2.66645%20-5.9533,-3.67944%20-9.23012,-2.9831%20-1.33967,0.28513%20-2.19362,1.60331%20-1.90563,2.94441%200.28656,1.33394%201.60331,2.19219%202.93868,1.90133%20l%200,0.002%20c%201.60188,-0.33958%203.33844,0.15474%204.51477,1.45572%201.17633,1.30529%201.49298,3.08196%200.9872,4.64085%20l%200.002,0%20c%20-0.41981,1.30099%200.29229,2.69941%201.59471,3.12208%201.30385,0.41695%202.70084,-0.29372%203.12065,-1.59757%201.03018,-3.18799%200.38685,-6.82015%20-2.02312,-9.48659'%20fill='%23ff9933'/%3e%3cpath%20d='m%2032.28036,41.69964%20c%20-0.43557,0.74506%20-1.39842,1.10326%20-2.15207,0.79234%20-0.7422,-0.30518%20-0.97431,-1.13764%20-0.55307,-1.86981%200.43414,-0.72786%201.35974,-1.08319%202.09906,-0.78947%200.75222,0.2751%201.02159,1.11759%200.60608,1.86694%20m%20-3.96744,5.09219%20c%20-1.20355,1.92139%20-3.7826,2.76244%20-5.72548,1.87554%20-1.91422,-0.87115%20-2.47875,-3.10346%20-1.27376,-4.97613%201.18923,-1.86551%203.68087,-2.69654%205.60943,-1.88844%201.95004,0.83103%202.57331,3.04758%201.38981,4.98903%20m%204.5248,-13.59731%20c%20-5.92464,-1.54169%20-12.62157,1.41131%20-15.19488,6.63102%20-2.6206,5.32429%20-0.086,11.23461%205.89885,13.16746%206.20117,1.99876%2013.50847,-1.06457%2016.05026,-6.81155%202.50598,-5.61802%20-0.62327,-11.40225%20-6.75423,-12.98693'%20fill='%23000000'/%3e%3c/svg%3e";
  const douyuLogo = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='utf-8'?%3e%3csvg%20viewBox='0%200%201129%201024'%20id='logo_eac22d1'%20xmlns='http://www.w3.org/2000/svg'%3e%3cpath%20fill='%23231815'%20d='M1117.645%20179.111c8.602-1.575%2012.757-11.581%207.86-18.911l-12.851-19.217c-33.891-50.922-76.709-88.765-127.249-112.473C945.077%209.594%20900.809-.001%20853.836-.001%20811.59-.007%20774.813%208.03%20751.283%2016.611c-20.326-5.265-67.612-15.427-129.667-15.427-57.691%200-113.722%208.715-166.538%2025.917-65.606%2021.365-125.539%2053.354-178.119%2095.082-42.065%2033.369-79.501%2072.982-111.271%20117.727-54.245%2076.394-73.252%20141.351-74.032%20144.083l-1.902%206.623c-2.166%207.558.764%2015.661%207.239%2020.013l5.672%203.818c61.396%2041.305%20140.314%2064.996%20216.517%2064.996%2049.254%200%2097.381-9.444%20143.057-28.065%20106.807-43.548%20166.692-116.942%20198.12-170.841a416.768%20416.768%200%20008.305-14.943c.802%2025.572-1.297%2055.524-9.245%2088.27-16.204%2066.738-50.337%20122.568-101.448%20165.933-38.706%2032.84-73.219%2045.891-73.565%2046.019l-9.767%203.556-4.826%209.227c-5.502%2010.374-31.896%2064.712-11.361%20116.001%206.392%2015.955%2021.31%2025.483%2039.921%2025.483%2017.66%200%2037.321-8.298%2053.349-17.224%208.432%209.717%2015.005%2016.089%2020.628%2020.836-1.803%2022.239-15.16%2033.58-30.457%2046.703-12.356%2010.591-27.888%2013.622-43.52%2013.622-28.125-44.31-69.349-55.689-120.4-55.689-20.843%200-41.059%204.497-60.093%2013.368-21.761%2010.134-20.733%2041.784%201.632%2050.46.599.234%2065.216%2026.045%20103.493%2078.887%2036.969%2051.039%2015.577%20103.307%2014.087%20106.78l-14.263%2030.163c-3.897%208.237%203.314%2017.402%2012.114%2015.393l32.545-7.418c13.181-2.916%2047.451-12.845%2080.859-41.834%2029.043-25.205%2049.507-58.451%2059.884-96.996%2065.551-10.624%20125.974-34.443%20179.85-70.94%2055.075-37.309%20102.179-87.942%20136.208-146.426%2034.727-59.687%2056.07-127.722%2061.72-196.753%205.398-65.992-3.617-133.259-26.114-195.578%2059.104-68.959%20134.438-84.057%20135.235-84.207l22.514-4.118z'/%3e%3cpath%20fill='%23f0f1f2'%20d='M585.932%20852.978C874.854%20817.884%201031.603%20517.98%20929%20262.776c67.816-89.055%20161.223-106.145%20161.223-106.145C980.145-8.762%20802.153%2024.145%20752.805%2045.772%20729.846%2038.854%20604.664%207.5%20463.366%2053.519c-274.258%2089.316-345.728%20338.454-345.728%20338.454%2078.413%2052.753%20206.486%2086.528%20334.499%2034.332%20193.119-78.737%20225.015-259.651%20225.015-259.651s35.854%2081.547%208.536%20194.081c-42.916%20176.829-192.036%20231.162-192.036%20231.162-7.261%2013.69-24.905%2055.847-10.125%2092.75%207.305%2018.248%2043.417%204.068%2074.049-17.297%2025.009%2032.306%2035.364%2038.355%2042.065%2043.158%201.369%2036.118-12.485%2060.885-37.142%2082.027-24.789%2021.265-50.766%2030.073-68.846%2033.821-29.637-64.262-104.208-87.516-164.46-59.439%200%200%2071.888%2027.882%20115.629%2088.264%2047.907%2066.143%2016.88%20134.367%2016.88%20134.367%2034.749-7.708%20107.962-42.457%20124.231-136.57z'/%3e%3cpath%20fill='%23bcbcbc'%20d='M491.003%2045.415c129.68-33.899%20240.352-6.107%20261.802.356%2019.28-8.45%2058.199-18.621%20105.032-18.015-42.96%203.843-67.909%2015.787-86.383%2023.162-.859.343-1.704.676-2.537.998l-.107.602c39.403%2025.41%2064.004%2061.855%2064.004%2061.855-79.389-100.992-288.72-62.958-322.211-53.434-5.297-5.303-13.452-11.287-19.6-15.525zM1071.083%20161.784c-30.87%209.933-93.141%2036.721-142.083%20100.991%2030.944%2076.967%2038.298%20157.999%2025.552%20234.607a314.04%20314.04%200%2001-6.451%2018.975c17.209-153.353-34.511-247.714-82.64-335.238%2035.986%2042.313%2042.707%2055.813%2042.707%2055.813%2062.01-63.343%20168.466-79.09%20168.466-79.09l-5.55%203.941z'/%3e%3cpath%20fill='%23231815'%20d='M680.604%20364.334c24.053-81.007-6.722-136.76-6.722-136.76-23.316%2088.459-66.815%20153.739-160.074%20203.164-67.48%2035.757-184.621%2042.162-184.621%2042.162l159.068%2087.624c97.409-22.433%20162.52-95.744%20192.349-196.191z'/%3e%3cpath%20fill='%23fff'%20d='M664.598%20240.419c12.637%2052.681%204.766%2090.391.158%2099.212-6.303%2012.042-30.358-4.749-30.358-4.749s9.849%2080.358.251%2090.047c-9.604%209.69-57.872-26.518-57.872-26.518s22.416%2085.244%206.406%2096.01c-16.004%2010.767-91.891-48.827-91.891-48.827s25.188%2097.302%209.511%20101.704c-14.037%203.946-35.987-2.648-59.623-13.65l-36.806-19.547c-26.208-15.358-50.584-32.26-64.74-42.439%2030.327-1.775%20103.497-10.437%20167.939-52.179%2085.586-55.439%20140.61-122.897%20157.026-179.065z'/%3e%3cpath%20fill='%232d0a03'%20stroke='%23231815'%20stroke-width='35.31'%20d='M496.533%20506.619c97.632%2060.955%20125.441%20167.458%2069.942%20244.77-55.504%2077.318-164.2%2083.488-251.675%208.389-78.682-67.556-114.492-180.069-68.701-243.857%2045.802-63.799%20162.614-64.125%20250.434-9.302z'/%3e%3cpath%20fill='%23231815'%20d='M610.523%20624.884c-17.758-59.853-65.458-114.001-127.607-144.858-100.814-50.036-215.487-27.802-261.054%2050.64-44.632%2076.809-7.328%20187.739%2084.911%20252.539%2054.082%2037.989%20118.993%2054.751%20176.127%2045.969a188.204%20188.204%200%200012.059-2.258c45.124-10.033%2080.536-35.234%20102.406-72.88%2021.974-37.818%2026.645-83.687%2013.158-129.153z'/%3e%3cpath%20fill='%23f8c100'%20d='M471.194%20494.97c102.997%2051.127%20153.655%20163.949%20105.791%20246.336-47.864%2082.381-168.268%2089.603-262.504%2023.402-84.763-59.543-118.342-158.487-78.851-226.459s142.925-89.265%20235.564-43.28z'/%3e%3cpath%20fill='%23231815'%20d='M444.805%20479.517s-166.65%2037.652-175.651%20245.539l6.716%209.136s-7.64-64.231%2065.337-158.72c58.02-75.121%20106.825-93.1%20106.825-93.1l-3.227-2.855z'/%3e%3cpath%20fill='%23231815'%20d='M196.833%20705.283C88.696%20650.349%2019.114%20577.713%2037.441%20534.649c20.323-47.756%20141.022-41.061%20269.581%2014.958a687.116%20687.116%200%200130.369%2014.144c3.265-4.671%206.645-9.363%2010.287-13.89a780.404%20780.404%200%2000-36.39-17.005C165.245%20469.223%2028.134%20461.614%205.049%20515.867c-16.276%2038.238%2028.466%2096.99%20107.443%20150.629%2031.118%2021.133%2065.288%2030.165%2084.342%2038.786z'/%3e%3cpath%20fill='%23f0f1f2'%20d='M626.083%20527.481c-43.177%2057.667-111.594%2094.915-188.602%2094.915-5.857%200-11.654-.21-17.397-.631l-.109-.133c37.982%2047.187%2095.849%2077.323%20160.672%2077.323%2099.245%200%20182.181-70.622%20202.406-164.907z'/%3e%3cpath%20fill='%23231815'%20d='M454.2%20635.335v.181c5.46%204.686%2011.13%209.107%2017.019%2013.205%207.443%205.052%2015.127%209.756%2023.188%2013.696%208.007%204.056%2016.314%207.46%2024.807%2010.287%208.428%202.999%2017.085%205.351%2025.863%207.111%208.778%201.787%2017.692%202.889%2026.656%203.381l8.827.343c-.263.011.738-.011-.558.017h.109l.23-.006.908-.039%203.626-.127%2014.405-.47c8.542-.902%2017.162-1.688%2026.098-3.769%204.468-.703%208.794-1.998%2013.125-3.287%204.342-1.251%208.739-2.38%2012.907-4.178%204.178-1.754%208.592-2.972%2012.704-4.914l12.409-5.761c7.963-4.46%2016.008-8.909%2023.418-14.399%203.877-2.512%207.465-5.401%2011.08-8.295%203.648-2.855%207.334-5.7%2010.615-8.998%207.028-6.148%2013.175-13.181%2019.48-20.187%205.885-7.327%2011.786-14.759%2016.779-22.888%202.767-3.907%204.938-8.146%207.345-12.307%202.428-4.15%204.774-8.373%206.645-12.822%204.299-8.694%207.755-17.786%2011.168-27.06-1.449%209.69-2.581%2019.65-5.447%2029.207-1.099%204.892-2.702%209.612-4.419%2014.321-1.641%204.737-3.216%209.551-5.507%2014.017-3.97%209.291-8.975%2018.046-14.121%2026.828-5.704%208.367-11.589%2016.706-18.398%2024.315-3.183%204.018-6.814%207.598-10.446%2011.211-3.577%203.663-7.203%207.31-11.271%2010.42-7.733%206.779-16.237%2012.54-24.796%2018.3-8.882%205.18-17.807%2010.431-27.394%2014.349-4.665%202.263-9.582%203.846-14.476%205.534-4.878%201.732-9.773%203.442-14.843%204.543-5.075%201.168-9.926%202.728-15.226%203.547l-15.904%202.463c-5.031.548-9.718.719-14.597.991l-4.534.238-1.613.022-1.947-.033-7.788-.166c-10.38-.393-20.749-1.5-30.992-3.392-10.249-1.865-20.377-4.444-30.271-7.769-19.77-6.757-38.332-16.795-55.368-28.82-8.406-6.17-16.647-12.634-24.009-20.054-3.974-3.797-7.718-7.824-11.319-11.974-4.158-3.352-9.463-9.959-10.28-12.51l-.002-.007c-4.189-6.035-3.208-14.414%202.461-19.266a14.094%2014.094%200%200113.078-2.858c.251.02.537.052.86.096l10.826.676c3.921.31%209.062.05%2013.541.116%209.27-.266%2018.545-.802%2027.799-1.981l13.809-2.258%2013.672-3.171c8.996-2.584%2018.069-5.152%2026.863-8.644%204.348-1.832%208.854-3.392%2013.082-5.545%204.293-2.031%208.625-4.023%2012.775-6.369a208.188%20208.188%200%200024.665-14.831c4.052-2.645%207.832-5.65%2011.753-8.528%203.998-2.806%207.558-6.12%2011.37-9.208%207.317-6.369%2014.591-13.154%2021.444-20.381-5.234%208.445-10.61%2016.889-17.047%2024.714-3.265%203.807-6.322%207.869-9.855%2011.46-3.434%203.708-6.88%207.443-10.681%2010.78a221.581%20221.581%200%2001-23.511%2019.418c-4.074%203.104-8.46%205.7-12.786%208.439-4.277%202.839-8.871%205.086-13.344%207.614-9.078%204.776-18.458%209.075-28.16%2012.584l-14.728%204.765-15.034%203.791c-8.825%201.823-17.738%203.418-26.738%204.289zM560.372%20147.064c0%2070.621-55.246%20127.873-123.399%20127.873-68.148%200-123.394-57.251-123.394-127.873%200-70.627%2055.246-127.879%20123.394-127.879%2068.153%200%20123.399%2057.251%20123.399%20127.879z'/%3e%3cpath%20fill='%23e9e9e9'%20d='M560.372%20162.855c0%2061.903-48.424%20112.085-108.159%20112.085s-108.159-50.182-108.159-112.085c0-61.903%2048.424-112.085%20108.159-112.085s108.159%2050.182%20108.159%20112.085z'/%3e%3cpath%20fill='%23fff'%20d='M556.487%20161.403c0%2054.908-44.622%2099.415-99.662%2099.415s-99.662-44.506-99.662-99.415c0-54.908%2044.622-99.421%2099.662-99.421s99.662%2044.512%2099.662%2099.421z'/%3e%3cpath%20fill='%23231815'%20d='M539.742%20161.403c0%2045.681-37.125%2082.713-82.919%2082.713-45.789%200-82.914-37.032-82.914-82.713s37.125-82.713%2082.914-82.713c45.795%200%2082.919%2037.032%2082.919%2082.713z'/%3e%3cpath%20fill='%23fff'%20d='M552.151%20167.872c0%2023.997-19.506%2043.459-43.567%2043.459-24.056%200-43.562-19.462-43.562-43.459%200-24.003%2019.506-43.459%2043.562-43.459%2024.061%200%2043.567%2019.456%2043.567%2043.459zM416.269%20135.985c0%2013.416-10.903%2024.298-24.357%2024.298-13.449%200-24.357-10.882-24.357-24.298s10.909-24.298%2024.357-24.298c13.454%200%2024.357%2010.882%2024.357%2024.298z'/%3e%3c/svg%3e";
  const xiaohongshuLogo = "data:image/svg+xml,%3c?xml%20version='1.0'%20encoding='UTF-8'%20standalone='no'?%3e%3c!--%20Created%20with%20Inkscape%20(http://www.inkscape.org/)%20--%3e%3csvg%20version='1.1'%20id='svg1'%20width='256'%20height='256'%20viewBox='0%200%20256%20256'%20sodipodi:docname='XiaohongshuLOGO.png'%20xmlns:inkscape='http://www.inkscape.org/namespaces/inkscape'%20xmlns:sodipodi='http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd'%20xmlns='http://www.w3.org/2000/svg'%20xmlns:svg='http://www.w3.org/2000/svg'%3e%3cdefs%20id='defs1'%20/%3e%3csodipodi:namedview%20id='namedview1'%20pagecolor='%23ffffff'%20bordercolor='%23000000'%20borderopacity='0.25'%20inkscape:showpageshadow='2'%20inkscape:pageopacity='0.0'%20inkscape:pagecheckerboard='0'%20inkscape:deskcolor='%23d1d1d1'%20inkscape:zoom='2.6914062'%20inkscape:cx='127.81422'%20inkscape:cy='128'%20inkscape:window-width='1600'%20inkscape:window-height='928'%20inkscape:window-x='0'%20inkscape:window-y='0'%20inkscape:window-maximized='1'%20inkscape:current-layer='g1'%20/%3e%3cg%20inkscape:groupmode='layer'%20inkscape:label='Image'%20id='g1'%3e%3cpath%20style='fill:%23ff2842;stroke:none'%20d='M%2029,0.33332825%20C%2013.959937,3.4666748%201.5356731,15.204498%200,31%20-1.586103,47.314209%200,64.597672%200,81%20v%20102%20c%200,18.76035%20-4.7369685,44.19888%207.3333335,60%20C%2020.372129,260.06897%2044.156731,256%2063,256%20h%20111%2035%20c%205.78276,0%2012.33244,0.84741%2018,-0.33333%2015.0401,-3.13336%2027.46432,-14.87115%2029,-30.66667%201.58612,-16.31419%200,-33.59769%200,-50%20V%2073%20C%20256,54.239685%20260.73697,28.801102%20248.66667,13%20235.62787,-4.0689697%20211.84329,0%20193,0%20H%2082%2047%20C%2041.217228,0%2034.667561,-0.84741211%2029,0.33332825%20M%20120,91%20l%20-7,19%20h%2012%20l%20-10,24%209,1%20c%20-0.98794,2.68155%20-2.31718,7.73317%20-4.33334,9.83334%20C%20118.18945,146.3721%20115.92654,146%20114,146%20c%20-4.35942,0%20-13.16798,1.80539%20-15.5,-3%20-1.069664,-2.20416%200.465553,-4.98451%201.333336,-7%201.813624,-4.21228%204.222554,-8.51549%205.166664,-13%20-2.17548,0%20-4.92464,0.42967%20-7,-0.33333%20-7.778526,-2.85974%200.874031,-15.36435%202.66666,-19.66667%201.25875,-3.020981%202.75652,-9.584732%205.5,-11.5%20C%20110.01874,88.810822%20115.88325,90.674988%20120,91%20m%20-79,63%20c%202.750713,0%206.837379,0.81721%208.5,-2%201.769028,-2.99753%200.5,-9.58963%200.5,-13%20V%20106%20C%2050,102.90659%2048.438198,93.464493%2051.166668,91.5%2053.41069,89.884308%2062.832935,90.226166%2063.833332,93%2065.47065,97.539825%2064,105.16241%2064,110%20v%2032%20c%200,5.48389%200.949112,11.8645%20-1.333332,17%20-2.177158,4.89861%20-12.303417,9.27243%20-17.333336,5.5%20C%2043.120155,162.84012%2041.545292,156.59013%2041,154%20M%20193,91%20v%205%20c%203.72887,0%208.4108,-0.763367%2012,0.333328%2011.97635,3.659424%2011,15.422502%2011,25.666672%201.99706,0%204.04419,-0.15562%206,0.33333%2011.49335,2.87334%2010,14.36401%2010,23.66667%200,4.95615%200.93086,10.82184%20-2.33333,15%20-3.59567,4.60246%20-9.48195,4%20-14.66667,4%20-1.6116,0%20-4.26318,0.51051%20-5.66667,-0.5%20-2.62326,-1.88875%20-3.78159,-7.50485%20-4.33333,-10.5%203.28711,0%209.2179,1.12517%2011.83333,-1.33334%20C%20219.9164,149.76859%20218.65411,138.43454%20215,136.5%20c%20-1.93661,-1.02527%20-4.88672,-0.5%20-7,-0.5%20h%20-15%20v%2029%20h%20-14%20v%20-29%20h%20-14%20v%20-14%20h%2014%20v%20-12%20h%20-9%20V%2096%20h%209%20v%20-5%20h%2014%20m%20-32,5%20v%2014%20h%20-8%20v%2042%20h%2013%20v%2013%20H%20120%20L%20125.33334,152.5%20138,152%20v%20-42%20h%20-8%20V%2096%20h%2031%20m%2057,14%20c%200,-2.84204%20-0.51608,-6.25871%200.33333,-9%203.34434,-10.793121%2019.61577,-2.093994%2011.5,6.83333%20-0.92279,1.01507%20-2.54419,1.51106%20-3.83333,1.83334%20C%20223.43948,110.30679%20220.61993,110%20218,110%20M%2041,110%2036.833332,147%2030,159%2024,143%2027,110%20h%2014%20m%2046,0%203,33%20-6,15%20h%20-2%20c%20-5.366936,-8.49765%20-6.053299,-17.26251%20-7,-27%20-0.672195,-6.91406%20-2,-14.04004%20-2,-21%20h%2014%20m%20106,0%20v%2012%20h%209%20v%20-12%20h%20-9%20m%20-75,42%20-5,13%20H%2091%20L%2096.333336,151.5%20104,151.66666%20Z'%20id='path1'%20/%3e%3c/g%3e%3c/svg%3e";
  const PLATFORM_CONFIG = {
    kuaishou: { pattern: /快手/, logo: kuaishouLogo },
    douyin: { pattern: /抖音/, logo: douyinLogo },
    bilibili: { pattern: /bilibili/, logo: bilibiliLogo },
    weibo: { pattern: /微博/, logo: weiboLogo },
    douyu: { pattern: /斗鱼/, logo: douyuLogo },
    xiaohongshu: { pattern: /小红书/, logo: xiaohongshuLogo }
  };
  function getPlatformLogo(channel) {
    for (const key in PLATFORM_CONFIG) {
      const { pattern, logo } = PLATFORM_CONFIG[key];
      if (pattern.test(channel)) {
        return logo;
      }
    }
    return "";
  }
  function getPlatformKey(channel) {
    for (const key in PLATFORM_CONFIG) {
      const { pattern } = PLATFORM_CONFIG[key];
      if (pattern.test(channel)) {
        return key;
      }
    }
    return null;
  }
  function LivingIcon(props) {
    const { barWidth = 160, className } = props;
    const barRadius = barWidth / 2;
    return jsxRuntimeExports.jsxs(
      "svg",
      {
        viewBox: "0 0 1024 1024",
        xmlns: "http://www.w3.org/2000/svg",
        className: cn$1("size-2.5", className),
        children: [
jsxRuntimeExports.jsxs(
            "rect",
            {
              x: "108.22",
              y: "274",
              width: "160",
              height: "750",
              rx: barRadius,
              ry: barRadius,
              fill: "currentColor",
              children: [
jsxRuntimeExports.jsx(
                  "animate",
                  {
                    attributeName: "height",
                    values: "750;1000;750;500;250;500;750",
                    dur: "0.6s",
                    repeatCount: "indefinite"
                  }
                ),
jsxRuntimeExports.jsx(
                  "animate",
                  {
                    attributeName: "y",
                    values: "274;24;274;524;774;524;274",
                    dur: "0.6s",
                    repeatCount: "indefinite"
                  }
                )
              ]
            }
          ),
jsxRuntimeExports.jsxs(
            "rect",
            {
              x: "432",
              width: "160",
              height: "1000",
              y: "24",
              rx: barRadius,
              ry: barRadius,
              fill: "currentColor",
              children: [
jsxRuntimeExports.jsx(
                  "animate",
                  {
                    attributeName: "height",
                    values: "1000;750;500;250;500;750;1000",
                    dur: "0.6s",
                    repeatCount: "indefinite"
                  }
                ),
jsxRuntimeExports.jsx(
                  "animate",
                  {
                    attributeName: "y",
                    values: "24;274;524;774;524;274;24",
                    dur: "0.6s",
                    repeatCount: "indefinite"
                  }
                )
              ]
            }
          ),
jsxRuntimeExports.jsxs(
            "rect",
            {
              x: "755.78",
              y: "524",
              width: "160",
              height: "500",
              rx: barRadius,
              ry: barRadius,
              fill: "currentColor",
              children: [
jsxRuntimeExports.jsx(
                  "animate",
                  {
                    attributeName: "height",
                    values: "500;750;1000;750;500;250;500",
                    dur: "0.6s",
                    repeatCount: "indefinite"
                  }
                ),
jsxRuntimeExports.jsx(
                  "animate",
                  {
                    attributeName: "y",
                    values: "524;274;24;274;524;774;524",
                    dur: "0.6s",
                    repeatCount: "indefinite"
                  }
                )
              ]
            }
          )
        ]
      }
    );
  }
  function Avatar(props) {
    const { streamer } = props;
    const platform2 = getPlatformKey(streamer.channel);
    const handleError = (e) => {
      e.currentTarget.src = "https://placehold.co/48x48?text=Failed";
    };
    return jsxRuntimeExports.jsxs("div", { className: "relative self-start", children: [
jsxRuntimeExports.jsx(
        "img",
        {
          src: platform2 === "bilibili" ? `https://wsrv.nl//?url=${streamer.avatar}` : streamer.avatar,
          className: "size-13 rounded-full",
          onError: handleError,
          alt: ""
        }
      ),
      streamer.status === 1 && jsxRuntimeExports.jsx(Badge, { className: "absolute -bottom-0.5 -right-0 rounded-full p-0.5 [&>svg]:size-2.5 text-white", children: jsxRuntimeExports.jsx(LivingIcon, {}) })
    ] });
  }
  function StreamerItem(props) {
    const { streamer, className, inPinnedArea = false } = props;
    const { channel, live_url, uname, start_time, status } = streamer;
    const [showRemarkDialog, setShowRemarkDialog] = React.useState(false);
    const remark = jotai.useAtomValue(streamerRemarkAtom(streamer.id));
    const dispatchRemark = jotai.useSetAtom(streamerRemarksAtom);
    const ref = React.useRef(null);
    const dispatchPinnedIds = jotai.useSetAtom(pinnedIdsAtom);
    const img = getPlatformLogo(channel);
    const handleClick = (e) => {
      if (ref.current && ref.current.contains(e.target)) {
        return;
      }
      window.open(live_url, "_blank");
    };
    const handlePin = (e) => {
      e.stopPropagation();
      if (inPinnedArea) {
        dispatchPinnedIds({ type: "remove", id: streamer.id });
      } else {
        dispatchPinnedIds({ type: "add", id: streamer.id });
      }
    };
    const handleRemarkDialog = (e) => {
      e.stopPropagation();
      setShowRemarkDialog(true);
    };
    const handleRemoveRemark = (e) => {
      e.stopPropagation();
      dispatchRemark({ type: "remove", id: streamer.id });
    };
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsxs(
        Card,
        {
          className: `${status !== 1 ? "grayscale" : ""} rounded-lg  hover:shadow-lg ${className ?? ""}`,
          onClick: handleClick,
          children: [
jsxRuntimeExports.jsxs(CardHeader, { className: "flex flex-col gap-2 relative", children: [
jsxRuntimeExports.jsx(Avatar, { streamer }),
jsxRuntimeExports.jsx("span", { className: "text-sm", children: uname }),
              remark && jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "备注：",
                remark.remark
              ] }),
jsxRuntimeExports.jsxs(DropdownMenu, { modal: false, children: [
jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: jsxRuntimeExports.jsx(
                  Button,
                  {
                    ref,
                    className: "absolute right-2.5 top-0 rounded-full",
                    variant: "ghost",
                    size: "icon-sm",
                    children: jsxRuntimeExports.jsx(lucideReact.EllipsisVertical, {})
                  }
                ) }),
jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "start", children: [
jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: handlePin, children: inPinnedArea ? "取消置顶" : "置顶主播" }),
jsxRuntimeExports.jsx(DropdownMenuSeparator, {}),
jsxRuntimeExports.jsxs(DropdownMenuItem, { onClick: handleRemarkDialog, children: [
                    remark ? "修改" : "添加",
                    "备注"
                  ] }),
                  remark && jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: handleRemoveRemark, children: "删除备注" })
                ] })
              ] })
            ] }),
jsxRuntimeExports.jsxs(CardContent, { className: "flex flex-col items-end justify-stretch gap-1", children: [
jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: status === 1 ? jsxRuntimeExports.jsxs("span", { className: "text-xs text-muted-foreground", children: [
                "已开播",
                formatLiveDuration(start_time)
              ] }) : jsxRuntimeExports.jsx("span", { className: "text-xs text-muted-foreground", children: "未开播" }) }),
jsxRuntimeExports.jsxs("div", { className: "text-xs text-muted-foreground", children: [
jsxRuntimeExports.jsx("span", { className: "align-bottom", children: "来源:" }),
                img ? jsxRuntimeExports.jsx("img", { className: "inline-block h-4.5 ml-2 align-bottom", src: img }) : jsxRuntimeExports.jsx("span", { className: "ml-2 align-bottom", children: "未知" })
              ] })
            ] })
          ]
        }
      ),
jsxRuntimeExports.jsx(
        RemarkDialog,
        {
          streamer,
          open: showRemarkDialog,
          onOpenChange: setShowRemarkDialog
        }
      )
    ] });
  }
  const formSchema = object({
    remark: string().check(_minLength(1, "用户标记不能为空")).check(_maxLength(20, "用户标记不能超过20个字符"))
  });
  function RemarkDialog({
    streamer,
    open,
    onOpenChange
  }) {
    const { id: id2, uid, uname } = streamer;
    const remarkObj = jotai.useAtomValue(streamerRemarkAtom(streamer.id));
    const dispatch = jotai.useSetAtom(streamerRemarksAtom);
    const { handleSubmit, control, reset } = reactHookForm.useForm({
      resolver: a(formSchema),
      defaultValues: { remark: remarkObj?.remark || "" }
    });
    function onSubmit(data) {
      dispatch({ type: "add", remark: { id: id2, uid, remark: data.remark } });
      onOpenChange?.(false);
      reset();
    }
    React.useEffect(() => {
      reset({ remark: remarkObj?.remark || "" });
    }, [remarkObj, reset]);
    return jsxRuntimeExports.jsx(Dialog, { open, onOpenChange, children: jsxRuntimeExports.jsxs(DialogContent, { children: [
jsxRuntimeExports.jsx(DialogHeader, { children: jsxRuntimeExports.jsxs(DialogTitle, { children: [
        "为【",
        uname,
        "】添加备注"
      ] }) }),
jsxRuntimeExports.jsxs(
        "form",
        {
          id: "label-form",
          className: "space-y-4",
          onSubmit: handleSubmit(onSubmit),
          children: [
jsxRuntimeExports.jsx(FieldGroup, { children: jsxRuntimeExports.jsx(
              reactHookForm.Controller,
              {
                control,
                name: "remark",
                render: ({ field, fieldState }) => jsxRuntimeExports.jsxs(Field, { "data-invalid": fieldState.invalid, children: [
jsxRuntimeExports.jsx(FieldLabel, { htmlFor: "streamer-remark", children: "备注" }),
jsxRuntimeExports.jsx(
                    Input,
                    {
                      ...field,
                      id: "streamer-remark",
                      "aria-invalid": fieldState.invalid,
                      autoComplete: "off"
                    }
                  ),
                  fieldState.invalid && jsxRuntimeExports.jsx(FieldError, { errors: [fieldState.error] })
                ] })
              }
            ) }),
jsxRuntimeExports.jsxs(DialogFooter, { children: [
jsxRuntimeExports.jsx(DialogClose, { asChild: true, children: jsxRuntimeExports.jsx(Button, { variant: "outline", children: "关闭" }) }),
jsxRuntimeExports.jsx(Button, { type: "submit", children: "确定" })
            ] })
          ]
        }
      )
    ] }) });
  }
  function StreamerList() {
    const liveStreamers = jotai.useAtomValue(liveStreamersAtom);
    const offlinetreamers = jotai.useAtomValue(offlineStreamersAtom);
    return jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: jsxRuntimeExports.jsxs(ScrollArea, { className: "flex-1 min-h-0", children: [
      liveStreamers.length > 0 && jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx("h2", { className: "text-base px-6", children: "直播中 📺" }),
jsxRuntimeExports.jsx("div", { className: "grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 auto-rows-min gap-6 p-6", children: liveStreamers.map((s2) => jsxRuntimeExports.jsx(StreamerItem, { streamer: s2 }, s2.id)) })
      ] }),
jsxRuntimeExports.jsx("h2", { className: "text-base px-6", children: "未开播 💤" }),
jsxRuntimeExports.jsx("div", { className: "grid 2xl:grid-cols-4 xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 auto-rows-min gap-6 p-6", children: offlinetreamers?.map((s2) => jsxRuntimeExports.jsx(StreamerItem, { streamer: s2 }, s2.id)) })
    ] }) });
  }
  function PinnedStreamers() {
    const pinnedStreamers = jotai.useAtomValue(pinnedStreamersAtom);
    return jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx("div", { className: "px-6 flex justify-between", children: jsxRuntimeExports.jsx("h1", { className: "text-2xl", children: "我的置顶" }) }),
jsxRuntimeExports.jsx("hr", { className: "text-gray-200 border-t-2 mx-6" }),
jsxRuntimeExports.jsxs(ScrollArea, { className: "mx-6", children: [
jsxRuntimeExports.jsx("div", { className: " py-6 flex flex-nowrap gap-6", children: pinnedStreamers.map((s2) => jsxRuntimeExports.jsx(
          StreamerItem,
          {
            streamer: s2,
            inPinnedArea: true,
            className: "w-2xs"
          },
          s2.id
        )) }),
jsxRuntimeExports.jsx(ScrollBar, { orientation: "horizontal" })
      ] })
    ] });
  }
  function Streamers() {
    const fetchStreamers2 = jotai.useSetAtom(fetchStreamersAtom);
    const lasUpdated = jotai.useAtomValue(lastUpdatedAtom);
    const streamersStatus = jotai.useAtomValue(streamersStatusAtom);
    const pinnedStreamers = jotai.useAtomValue(pinnedStreamersAtom);
    const loading = streamersStatus === "loading";
    const isError = streamersStatus === "error";
    const showPinnedStreamers = !isError && pinnedStreamers.length > 0;
    const refreshData = React.useMemo(
      () => debounce(() => fetchStreamers2(), 2e3, true),
      [fetchStreamers2]
    );
    React.useEffect(() => {
      fetchStreamers2();
    }, [fetchStreamers2]);
    return jsxRuntimeExports.jsxs(Card, { className: "flex-1 overflow-hidden shadow-lg flex flex-col", children: [
      showPinnedStreamers && jsxRuntimeExports.jsx(PinnedStreamers, {}),
jsxRuntimeExports.jsxs("div", { className: "px-6 flex justify-between", children: [
jsxRuntimeExports.jsx("h1", { className: "text-2xl", children: "主播列表" }),
jsxRuntimeExports.jsxs("div", { className: "flex gap-4 items-end", children: [
jsxRuntimeExports.jsxs("span", { className: "text-gray-600 text-xs", children: [
            "最近更新时间：",
            lasUpdated ? formatDate(lasUpdated) : "--"
          ] }),
jsxRuntimeExports.jsx(Button, { onClick: refreshData, disabled: loading, children: loading ? jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
jsxRuntimeExports.jsx(LoadingIcon, {}),
            "刷新中"
          ] }) : "刷新列表" })
        ] })
      ] }),
jsxRuntimeExports.jsx("hr", { className: "text-gray-200 border-t-2 mx-6" }),
      isError ? jsxRuntimeExports.jsx(Empty, { children: jsxRuntimeExports.jsxs(EmptyHeader, { children: [
jsxRuntimeExports.jsx(EmptyMedia, { children: jsxRuntimeExports.jsx(lucideReact.TriangleAlert, { className: "size-10" }) }),
jsxRuntimeExports.jsx(EmptyTitle, { children: "主播列表数据请求失败！" }),
jsxRuntimeExports.jsx(EmptyDescription, { children: "具体错误信息请联系源站长。您可以尝试刷新列表数据。" })
      ] }) }) : jsxRuntimeExports.jsx(StreamerList, {})
    ] });
  }
  const initialState = {
    theme: "system",
    setTheme: () => null
  };
  const ThemeProviderContext = React.createContext(initialState);
  function ThemeProvider({
    children,
    defaultTheme = "system",
    storageKey = "cx-style-ui_theme",
    ...props
  }) {
    const [theme, setTheme] = React.useState(
      () => localStorage.getItem(storageKey) || defaultTheme
    );
    React.useEffect(() => {
      const root = window.document.documentElement;
      root.classList.remove("light", "dark");
      if (theme === "system") {
        const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        root.classList.add(systemTheme);
        return;
      }
      root.classList.add(theme);
    }, [theme]);
    const value = {
      theme,
      setTheme: (theme2) => {
        localStorage.setItem(storageKey, theme2);
        setTheme(theme2);
      }
    };
    return jsxRuntimeExports.jsx(ThemeProviderContext.Provider, { ...props, value, children });
  }
  const useTheme = () => {
    const context = React.useContext(ThemeProviderContext);
    if (context === void 0)
      throw new Error("useTheme must be used within a ThemeProvider");
    return context;
  };
  function ModeToggle({ className }) {
    const { setTheme } = useTheme();
    const buttonRef = React.useRef(null);
    function handleThemeChange(theme) {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const x2 = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      if (!document.startViewTransition) {
        setTheme(theme);
        return;
      }
      document.startViewTransition(() => {
        setTheme(theme);
      }).ready.then(() => {
        const radius = Math.hypot(
          Math.max(x2, innerWidth - x2),
          Math.max(y, innerHeight - y)
        );
        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x2}px ${y}px)`,
              `circle(${radius}px at ${x2}px ${y}px)`
            ]
},
          {
            duration: 700,
            easing: "ease-in-out",
            pseudoElement: "::view-transition-new(root)"
          }
        );
      });
    }
    return jsxRuntimeExports.jsxs(DropdownMenu, { children: [
jsxRuntimeExports.jsx(DropdownMenuTrigger, { asChild: true, children: jsxRuntimeExports.jsxs(
        Button,
        {
          variant: "outline",
          size: "icon",
          className,
          ref: buttonRef,
          children: [
jsxRuntimeExports.jsx(lucideReact.Sun, { className: "size-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" }),
jsxRuntimeExports.jsx(lucideReact.Moon, { className: "absolute size-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" }),
jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Toggle theme" })
          ]
        }
      ) }),
jsxRuntimeExports.jsxs(DropdownMenuContent, { align: "end", children: [
jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => handleThemeChange("light"), children: "浅色主题" }),
jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => handleThemeChange("dark"), children: "暗黑主题" }),
jsxRuntimeExports.jsx(DropdownMenuItem, { onClick: () => handleThemeChange("system"), children: "跟随系统" })
      ] })
    ] });
  }
  const _globalSettingAtom = utils.atomWithStorage(
    `${"cx-style"}-global_setting`,
    {
      bannedPresenceEffect: false,
      enableNewPage: false
    }
  );
  const globalSettingAtom = jotai.atom(
    (get2) => get2(_globalSettingAtom),
    (get2, set2, update) => {
      set2(_globalSettingAtom, { ...get2(_globalSettingAtom), ...update });
    }
  );
  function ToOriginPageButton() {
    const setGlobalSetting = jotai.useSetAtom(globalSettingAtom);
    const handleClick = () => {
      setGlobalSetting({ enableNewPage: false });
      window.location.reload();
    };
    return jsxRuntimeExports.jsxs(Tooltip, { children: [
jsxRuntimeExports.jsx(TooltipTrigger, { asChild: true, children: jsxRuntimeExports.jsx(Button, { variant: "outline", size: "icon", onClick: handleClick, children: jsxRuntimeExports.jsx(lucideReact.Undo2, { className: "size-[1.2rem]" }) }) }),
jsxRuntimeExports.jsx(TooltipContent, { side: "bottom", children: "回到源站" })
    ] });
  }
  const buttonGroupVariants = cva(
    "flex w-fit items-stretch [&>*]:focus-visible:z-10 [&>*]:focus-visible:relative [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-md has-[>[data-slot=button-group]]:gap-2",
    {
      variants: {
        orientation: {
          horizontal: "[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
          vertical: "flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:first-child)]:border-t-0 [&>*:not(:last-child)]:rounded-b-none"
        }
      },
      defaultVariants: {
        orientation: "horizontal"
      }
    }
  );
  function ButtonGroup({
    className,
    orientation,
    ...props
  }) {
    return jsxRuntimeExports.jsx(
      "div",
      {
        role: "group",
        "data-slot": "button-group",
        "data-orientation": orientation,
        className: cn$1(buttonGroupVariants({ orientation }), className),
        ...props
      }
    );
  }
  function NewPage() {
    return jsxRuntimeExports.jsxs("main", { className: "w-screen h-screen overflow-hidden flex items-stretch justify-between gap-5 px-14 xl:px-16 py-8", children: [
jsxRuntimeExports.jsx("div", { className: "fixed right-3 top-8 z-10", children: jsxRuntimeExports.jsxs(ButtonGroup, { orientation: "vertical", children: [
jsxRuntimeExports.jsx(ButtonGroup, { children: jsxRuntimeExports.jsx(ModeToggle, {}) }),
jsxRuntimeExports.jsx(ButtonGroup, { children: jsxRuntimeExports.jsx(ToOriginPageButton, {}) })
      ] }) }),
jsxRuntimeExports.jsx(Streamers, {}),
jsxRuntimeExports.jsx(ChatHistoryPanel, {})
    ] });
  }
  const style = "body{background-color:var(--color-background)}";
  var M = (e, i2, s2, u, m, a2, l, h) => {
    let d = document.documentElement, w = ["light", "dark"];
    function p(n2) {
      (Array.isArray(e) ? e : [e]).forEach((y) => {
        let k = y === "class", S = k && a2 ? m.map((f) => a2[f] || f) : m;
        k ? (d.classList.remove(...S), d.classList.add(a2 && a2[n2] ? a2[n2] : n2)) : d.setAttribute(y, n2);
      }), R(n2);
    }
    function R(n2) {
      h && w.includes(n2) && (d.style.colorScheme = n2);
    }
    function c() {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    }
    if (u) p(u);
    else try {
      let n2 = localStorage.getItem(i2) || s2, y = l && n2 === "system" ? c() : n2;
      p(y);
    } catch (n2) {
    }
  };
  var x = React__namespace.createContext(void 0), U = { setTheme: (e) => {
  }, themes: [] }, z = () => {
    var e;
    return (e = React__namespace.useContext(x)) != null ? e : U;
  };
  React__namespace.memo(({ forcedTheme: e, storageKey: i2, attribute: s2, enableSystem: u, enableColorScheme: m, defaultTheme: a2, value: l, themes: h, nonce: d, scriptProps: w }) => {
    let p = JSON.stringify([s2, i2, a2, e, h, l, u, m]).slice(1, -1);
    return React__namespace.createElement("script", { ...w, suppressHydrationWarning: true, nonce: typeof window == "undefined" ? d : "", dangerouslySetInnerHTML: { __html: `(${M.toString()})(${p})` } });
  });
  const Toaster2 = ({ ...props }) => {
    const { theme = "system" } = z();
    return jsxRuntimeExports.jsx(
      Toaster$1,
      {
        theme,
        className: "toaster group",
        icons: {
          success: jsxRuntimeExports.jsx(lucideReact.CircleCheck, { className: "size-5 text-white fill-green-500" }),
          info: jsxRuntimeExports.jsx(lucideReact.InfoIcon, { className: "size-5 text-white fill-blue-500" }),
          warning: jsxRuntimeExports.jsx(lucideReact.TriangleAlert, { className: "size-5 text-white fill-amber-500" }),
          error: jsxRuntimeExports.jsx(lucideReact.CircleX, { className: "size-5 text-white fill-red-500" }),
          loading: jsxRuntimeExports.jsx(lucideReact.Loader2Icon, { className: "size-4.5 animate-spin" })
        },
        style: {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)"
        },
        ...props
      }
    );
  };
  function ToNewPageButton() {
    const setGlobalSetting = jotai.useSetAtom(globalSettingAtom);
    const handleClick = () => {
      setGlobalSetting({ enableNewPage: true });
      window.location.reload();
    };
    return jsxRuntimeExports.jsx(
      "button",
      {
        style: {
          position: "fixed",
          padding: "2px 6px",
          borderRadius: 6,
          outline: 0,
          border: "1px solid #000",
          zIndex: 99999,
          left: 10,
          top: 10,
          background: "rgba(255 255 255 /.9)",
          color: "#000"
        },
        onClick: handleClick,
        children: "去新版"
      }
    );
  }
  function removeStyle() {
    document.querySelectorAll("style").forEach((styleDom) => {
      if (!(styleDom.id === "artplayer-style" ||
/tailwindcss/.test(styleDom.textContent) ||
/data-sonner-toaster/.test(styleDom.textContent))) {
        styleDom.remove();
      }
    });
  }
  function mount() {
    injectCSS(style);
    document.querySelectorAll("audio").forEach((item) => item.setAttribute("src", ""));
    document.title = document.title + "(new)";
    document.body.innerHTML = "";
    const rootDiv = document.createElement("div");
    rootDiv.id = "root";
    document.body.appendChild(rootDiv);
    ReactDOM$1.createRoot(rootDiv).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsxs(ThemeProvider, { children: [
jsxRuntimeExports.jsx(NewPage, {}),
jsxRuntimeExports.jsx(Toaster2, { position: "top-center" })
      ] }) })
    );
    removeStyle();
  }
  function bootstrap() {
    const settingStr = localStorage.getItem(
      `${"cx-style"}-global_setting`
    );
    if (settingStr) {
      const setting = JSON.parse(settingStr);
      if (setting.enableNewPage) {
        mount();
        return;
      }
    }
    const toggleBtnContainer = document.createElement("div");
    document.body.appendChild(toggleBtnContainer);
    ReactDOM$1.createRoot(toggleBtnContainer).render(
jsxRuntimeExports.jsx(React.StrictMode, { children: jsxRuntimeExports.jsx(ToNewPageButton, {}) })
    );
  }
  bootstrap();

})(React, ReactDOM, jotai, jotaiVanillaUtils, flvjs, COS, clsx, LucideReact, ReactHookForm);